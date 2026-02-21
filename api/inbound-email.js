// /api/inbound-email.js
// Receives Postmark inbound webhook, parses .ics attachment, inserts events into Supabase.

const SUPABASE_URL = 'https://yccjzybfaucjflilzpla.supabase.co';
const SUPABASE_KEY = 'sb_publishable_9MSp4q8-nwZSFwDXEsP7PQ_vhAp8CBd';

// ── Parse raw iCalendar text into event objects ──
function parseICS(text) {
  const events = [];
  const blocks = text.split('BEGIN:VEVENT');
  blocks.shift();
  for (const block of blocks) {
    const get = (key) => {
      const unfold = block.replace(/\r?\n[ \t]/g, '');
      const match = unfold.match(new RegExp(`(?:^|\\n)${key}(?:;[^:]*)?:([^\\n]*)`, 'i'));
      return match ? match[1].trim() : '';
    };
    const rawStart   = get('DTSTART');
    const rawEnd     = get('DTEND');
    const summary    = get('SUMMARY').replace(/\\,/g, ',').replace(/\\n/g, ' ').replace(/\\/g, '');
    const description = get('DESCRIPTION').replace(/\\,/g, ',').replace(/\\n/g, '\n').replace(/\\/g, '');
    const location   = get('LOCATION').replace(/\\,/g, ',').replace(/\\/g, '');

    if (!rawStart || !summary) continue;

    const parseDate = (raw) => {
      const d = raw.replace(/[TZ]/g, '').replace(/[^0-9]/g, '');
      if (d.length < 8) return { date: '', time: '' };
      const date = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
      const time = d.length >= 12 ? `${d.slice(8, 10)}:${d.slice(10, 12)}` : '';
      return { date, time };
    };

    const start = parseDate(rawStart);
    const end   = rawEnd ? parseDate(rawEnd) : { date: '', time: '' };
    if (!start.date) continue;

    // Auto-categorise from title
    const tl = summary.toLowerCase();
    let category = 'OTHER';
    if (/meeting|sync|standup|call|interview|1:1|one.on.one/.test(tl))       category = 'MEETING';
    else if (/deadline|due|submit|submission/.test(tl))                        category = 'DEADLINE';
    else if (/review|feedback|assessment|evaluation/.test(tl))                category = 'REVIEW';
    else if (/lunch|social|team.day|offsite|party|happy.hour/.test(tl))       category = 'SOCIAL';

    // end_date only when the event spans multiple days
    const end_date = (end.date && end.date !== start.date) ? end.date : null;

    events.push({
      title:       summary,
      description: description || null,
      date:        start.date,
      end_date,
      start_time:  start.time || null,
      end_time:    end.time   || null,
      category,
      location:    location || null,
      created_by:  'email-inbound',
    });
  }
  return events;
}

// ── Read full request body ──
function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch { resolve(null); }
    });
  });
}

// ── Main handler ──
module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Webhook-Token');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // ── Security: validate token via query param (survives redirects) ──
  // Postmark webhook URL: https://procalment.com/api/inbound-email?token=SECRET
  const expectedToken = process.env.POSTMARK_WEBHOOK_TOKEN;
  if (expectedToken) {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const queryToken = url.searchParams.get('token');
    if (!queryToken || queryToken !== expectedToken) {
      console.warn('inbound-email: rejected — invalid or missing token');
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  // ── Parse Postmark payload ──
  const payload = await readBody(req);
  if (!payload) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  const from    = payload.From    || 'unknown';
  const subject = payload.Subject || '(no subject)';
  console.log(`inbound-email: received from=${from} subject="${subject}"`);

  // ── Extract .ics content ──
  let icsText = null;

  // 1. Check attachments first (most reliable)
  const attachments = payload.Attachments || [];
  for (const att of attachments) {
    const name = (att.Name || '').toLowerCase();
    const type = (att.ContentType || '').toLowerCase();
    if (name.endsWith('.ics') || type.includes('calendar') || type.includes('ics')) {
      try {
        icsText = Buffer.from(att.Content, 'base64').toString('utf-8');
        console.log(`inbound-email: found .ics attachment "${att.Name}"`);
        break;
      } catch (e) {
        console.error('inbound-email: failed to decode attachment', e);
      }
    }
  }

  // 2. Fall back to text body (some clients inline the ICS)
  if (!icsText) {
    const body = payload.TextBody || payload.HtmlBody || '';
    if (body.includes('BEGIN:VCALENDAR') || body.includes('BEGIN:VEVENT')) {
      icsText = body;
      console.log('inbound-email: using ICS content from email body');
    }
  }

  if (!icsText) {
    console.log('inbound-email: no .ics content found in email');
    return res.status(200).json({ imported: 0, message: 'No calendar data found in email' });
  }

  // ── Parse ICS ──
  const events = parseICS(icsText);
  console.log(`inbound-email: parsed ${events.length} event(s)`);

  if (events.length === 0) {
    return res.status(200).json({ imported: 0, message: 'ICS parsed but contained no valid events' });
  }

  // ── Insert into Supabase ──
  let imported = 0;
  let errors   = 0;

  for (const event of events) {
    try {
      const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/events`, {
        method:  'POST',
        headers: {
          'apikey':        SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type':  'application/json',
          'Prefer':        'return=minimal',
        },
        body: JSON.stringify(event),
      });

      if (supaRes.ok || supaRes.status === 201) {
        imported++;
      } else {
        const errText = await supaRes.text();
        console.error(`inbound-email: Supabase insert failed for "${event.title}":`, errText);
        errors++;
      }
    } catch (e) {
      console.error(`inbound-email: fetch error for "${event.title}":`, e);
      errors++;
    }
  }

  console.log(`inbound-email: done — imported=${imported} errors=${errors}`);
  return res.status(200).json({ imported, errors, total: events.length });
};
