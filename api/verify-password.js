const bcrypt = require('bcryptjs');

// In-memory rate limiter per IP: max 10 attempts per 15-minute window.
// Note: resets on cold start (each function instance has its own Map).
// Acceptable for a small internal team app.
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (attempts.get(ip) || []).filter(t => now - t < WINDOW_MS);
  if (timestamps.length >= MAX_ATTEMPTS) {
    attempts.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  attempts.set(ip, timestamps);
  return false;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({
      success: false,
      error: 'Too many attempts. Please wait 15 minutes.',
    });
  }

  const { password } = req.body || {};

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, error: 'Password required' });
  }

  const hash = process.env.TEAM_PASSWORD_HASH;
  if (!hash) {
    console.error('TEAM_PASSWORD_HASH environment variable is not set');
    return res.status(500).json({ success: false, error: 'Server misconfigured' });
  }

  const match = await bcrypt.compare(password, hash);
  return res.status(200).json({ success: match });
};
