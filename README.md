# Leadership Hub

A secure, invite-only collaboration platform for Procurement Senior Leadership. Built with Next.js 16, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- **Invite-Only Access** — Users must redeem a one-time invite code to register
- **Dashboard** — Glassmorphism UI showing meetings, tasks, and messages at a glance
- **Shared Calendar** — Team calendar with event categories (Meeting, Deadline, Review, Social)
- **Messaging** — Channel-based messaging with threaded conversations
- **Tasks** — Kanban board with drag-and-drop, priorities, owners, and dependency tracking
- **Document Library** — Secure file management with folders, tags, and role-based access
- **Modern UI** — Liquid-glass aesthetic with frosted panels, floating nav, and animated backgrounds

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Custom session-based (bcrypt + HTTP-only cookies) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or cloud)
- npm

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd leadership-hub
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```
DATABASE_URL="postgresql://user:password@localhost:5432/leadership_hub"
DIRECT_URL="postgresql://user:password@localhost:5432/leadership_hub"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Seed config
ADMIN_EMAIL="admin@procurement.gov"
ADMIN_PASSWORD="your-secure-password"
ADMIN_NAME="Your Name"
INITIAL_INVITE_COUNT="5"
```

**For Vercel Postgres:** Go to your Vercel project → Storage → Create Postgres Database. Copy the connection strings into your `.env`.

### 3. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Or create a migration (production-ready)
npx prisma migrate dev --name init

# Seed with admin user and invite codes
npm run db:seed
```

The seed script will output your initial invite codes. Save them — they are one-time use.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to the sign-in page.

**First-time setup:**
1. Sign in with the admin credentials from your `.env`
2. Or use the sign-up page with one of the generated invite codes

## Managing Invite Codes

```bash
# Generate new invite codes
npm run invite:generate          # 1 code, 30-day expiry
npm run invite:generate 5        # 5 codes, 30-day expiry
npm run invite:generate 3 --days 7  # 3 codes, 7-day expiry

# List all invite codes and their status
npm run invite:list
```

## Project Structure

```
leadership-hub/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── seed.ts                # Initial data seeding
├── scripts/
│   ├── generate-invite.ts     # CLI: generate invite codes
│   └── list-invites.ts        # CLI: list invite codes
├── src/
│   ├── app/
│   │   ├── (auth)/            # Auth pages (sign-in, sign-up)
│   │   ├── (hub)/             # Protected app pages
│   │   │   ├── dashboard/
│   │   │   ├── calendar/
│   │   │   ├── messages/
│   │   │   ├── tasks/
│   │   │   └── library/
│   │   └── api/
│   │       └── auth/          # Auth API routes
│   ├── components/
│   │   └── ui/                # Glassmorphism component library
│   │       ├── glass-card.tsx
│   │       ├── glass-button.tsx
│   │       ├── glass-input.tsx
│   │       ├── glass-modal.tsx
│   │       ├── glass-badge.tsx
│   │       ├── glass-avatar.tsx
│   │       └── floating-nav.tsx
│   ├── lib/
│   │   ├── auth/              # Auth utilities
│   │   │   ├── password.ts
│   │   │   └── session.ts
│   │   ├── db/
│   │   │   └── prisma.ts      # Prisma client singleton
│   │   └── mock-data/
│   │       └── index.ts       # Development mock data
│   └── middleware.ts           # Route protection
├── .env.example
├── package.json
└── README.md
```

## Database Schema

The Prisma schema includes these models:

- **User** — email, name, hashed password, role (ADMIN/LEADER/MEMBER)
- **Session** — server-side session storage
- **InviteCode** — one-time codes with expiry dates
- **Channel** / **Message** / **ThreadReply** — messaging system
- **Event** / **EventAttendee** — calendar with categories
- **Task** / **TaskDependency** — kanban with dependency graph
- **Folder** / **Document** / **Tag** / **DocumentTag** — document library

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Leadership Hub"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Create Vercel Project

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework Preset: **Next.js** (auto-detected)
4. Set environment variables:
   - `DATABASE_URL` — from Vercel Postgres or your provider
   - `DIRECT_URL` — direct connection string
   - `NEXT_PUBLIC_APP_URL` — your Vercel domain (e.g., `https://leadership-hub.vercel.app`)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` — for initial seed

### 3. Set Up Vercel Postgres

1. In your Vercel project, go to **Storage** → **Create Database** → **Postgres**
2. The connection strings are automatically added to your environment variables
3. Run the seed after first deploy:

```bash
vercel env pull .env.local
npx prisma db push
npm run db:seed
```

### 4. Deploy

Vercel will auto-deploy on every push to `main`. The `build` script runs `prisma generate` automatically.

## Security Notes

- Passwords are hashed with bcrypt (12 rounds)
- Sessions use HTTP-only, Secure, SameSite=Lax cookies
- No tokens stored in localStorage
- Invite codes are single-use and expire
- Route protection via Next.js middleware
- All API routes check session validity

## License

Private — Procurement Senior Leadership use only.
