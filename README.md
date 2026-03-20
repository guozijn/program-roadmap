# Program Roadmap — Adelaide University

A web-based platform helping students locate information about their studies, programs, industry and alumni — and a marketing tool for prospective students.

Built with **Next.js 14**, **Prisma**, **NextAuth**, and **Tailwind CSS**. Designed to match the Adelaide University 2026 brand identity.

---

## Features

### Public (no login required)
- **Home** — hero section, stats, featured programs, alumni spotlight, industry partners
- **Programs** — browse all programs by level (Bachelor/Masters/PhD)
- **Program Detail** — interactive visual roadmap (year-by-year course view with hover tooltips), career outcomes, alumni
- **Alumni** — success stories and testimonials
- **Industry Partners** — partners grouped by tier (Gold/Silver/Bronze)

### Admin (login required)
- **Dashboard** — overview stats and quick actions
- **Program Management** — create, edit, delete programs with full course & career outcome management
- **Alumni Management** — add/edit alumni profiles and testimonials
- **Industry Partner Management** — manage partner listings and tiers
- **Site Content Editor** — edit all page text, hero copy, stats, and contact info without code changes

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local
# Edit .env.local and set NEXTAUTH_SECRET to a strong random string

# 3. Run migrations to create the database schema
npx prisma migrate deploy

# 4. Seed with sample data
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Access
- URL: `http://localhost:3000/admin/login`
- Email: `admin@programroadmap.edu`
- Password: `Admin@123`

> Change these credentials after first login for production use.

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── page.tsx       # Home
│   │   ├── programs/      # Programs list + detail with roadmap
│   │   ├── alumni/        # Alumni page
│   │   └── industry/      # Industry partners
│   ├── admin/             # Admin section (protected)
│   │   ├── login/
│   │   └── dashboard/     # CMS dashboard
│   └── api/               # REST API routes
├── components/
│   ├── layout/            # Navbar, Footer, AdminSidebar
│   ├── roadmap/           # Interactive roadmap visualization
│   ├── admin/             # Admin forms and tables
│   └── ui/                # Shared UI components and SVG icon library
├── lib/
│   ├── prisma.ts          # Database client
│   ├── auth.ts            # NextAuth config
│   └── utils.ts           # Utilities
└── middleware.ts           # Route protection
public/
└── au-logo-dark-blue-horizontal.svg   # Official Adelaide University logo
```

---

## Deploying to Vercel

### 1. Set up Vercel Postgres
In your Vercel project, go to **Storage** → **Create Database** → **Postgres**. Copy the connection string.

### 2. Update `prisma/schema.prisma`
Change the provider from `sqlite` to `postgresql`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Set Environment Variables in Vercel
```
DATABASE_URL        = your-postgres-connection-string
NEXTAUTH_SECRET     = your-secret-32-char-string (openssl rand -base64 32)
NEXTAUTH_URL        = https://your-domain.vercel.app
```

### 4. Build Command
No extra configuration needed — `npm run build` already runs `prisma generate && prisma migrate deploy && next build`.

### 5. Run Seed (first deploy only)
After first deployment, run the seed via Vercel CLI:
```bash
vercel env pull .env.production.local
DATABASE_URL=<your-postgres-url> npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Prisma + SQLite (dev) / PostgreSQL (prod) |
| Auth | NextAuth v4 (Credentials) |
| Deployment | Vercel |

---

## Design

Follows the **Adelaide University 2026 brand identity**:

| Token | Value | Usage |
|-------|-------|-------|
| Navy | `#140F50` | Primary dark — headers, nav, sidebar |
| Blue Ribbon | `#1448FF` | CTA / accent — buttons, links, active states |
| Blue Marguerite | `#6956CC` | Secondary purple — specialization badges |
| Spanish White | `#F9F2E6` | Warm cream — section backgrounds |

- Official university logo (`au-logo-dark-blue-horizontal.svg`) in Navbar and Footer
- SVG icon library throughout — no emoji
- Inter font, card-based layouts, mobile-first responsive design

---

## Course Types (Roadmap)

| Type | Colour | Description |
|------|--------|-------------|
| Core | Navy `#140F50` | Mandatory foundational courses |
| Elective | Gray | Student-chosen courses |
| Specialization | Purple `#6956CC` | Advanced stream courses |
| Capstone | Blue `#1448FF` | Final-year major project |
| Industry | Teal | Courses delivered with industry partners |
