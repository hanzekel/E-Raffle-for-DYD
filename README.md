# MOPCY DYD 2026 - Diocesan Youth Day Raffle Platform

Diocesan Youth Day 2026
"Take Courage, Youth in Christ: 40 Years in Mission"
General Headquarters (GHQ), Philippines

A full-stack raffle ticket web application and live draw stage built for MOPCY DYD 2026. Attendees register, submit payment proofs, and receive cryptographically verified PDF e-tickets with QR codes upon admin verification.

---

## Core Features

### Public Experience
- Hero and Fit-to-Screen Design: Styled with the Diocesan Marian Blue color palette (#1A3A8F), gold accents (#F5A623), and typography scaled for both mobile phones and large displays.
- Registration Flow: Multi-step registration form with live price calculations and input sanitization.
- Smart Receipt Validator: Client-side canvas analyzer that inspects uploaded proofs. Rejects blank canvases, solid-color squares, low-resolution files, or non-receipt photos using luminance variance and Sobel edge-contrast algorithms before upload.
- E-Ticket Retrieval: Attendees can verify their email to download generated PDF tickets containing QR codes.
- 3D Flying Tickets Live Raffle Stage (/raffle): Stage view powered by an HTML5 canvas 3D physics engine. Eligible tickets tumble, pitch, and roll in a swirling wind vortex before extracting a golden winning ticket with built-in audio effects and celebratory confetti.

### Admin and Operational Controls
- Live Sync Dashboard: Metrics update automatically in the background every 6 seconds without page flickers.
- In-App Receipt Lightbox: Preview uploaded payment slips directly in the browser with a one-click shortcut to inspect full-resolution files.
- Cascading Record Deletion: Direct, reason-free entry deletion with an in-app confirmation modal that purges the registration, associated tickets, and winner records from the database.
- Audit Ledger and CSV Export: Filter, review, and export approved participants and drawn winners alongside their SHA-256 verification hashes.
- Accessible Modals: Zero native browser alert or confirm popups; all user prompts use custom dialogs.

---

## Technical Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 19, TypeScript, Tailwind CSS 3, Vite, SVG Icons |
| Backend API | Node.js Express dispatcher deployed as a single Vercel Serverless Function |
| Database | PostgreSQL (Supabase) accessed via Prisma 6 ORM |
| Storage | Supabase Storage (private bucket with short-lived signed URLs) |
| Ticket Generation | pdf-lib, qrcode |
| Email Service | Nodemailer (SMTP transactional mailer) |
| Cryptography | Node.js crypto CSPRNG, Web Crypto API, JWT (HTTP-only cookies), bcryptjs |
| Deployment | Vercel (Production) |

---

## Project Structure

```
DYDWebsite/
├── api/
│   ├── index.ts                  # Single serverless entrypoint for Vercel
│   ├── _lib/                     # Shared backend utilities
│   │   ├── auth.ts               # JWT authentication and bcrypt password helpers
│   │   ├── email.ts              # Nodemailer transport configuration
│   │   ├── errors.ts             # Standardized API error responses
│   │   ├── middleware.ts         # CORS guards and rate limiting
│   │   ├── pdf.ts                # PDF e-ticket layout and QR embedding
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── supabase.ts           # Supabase client wrapper and file size guards
│   │   └── validation.ts         # Zod schemas for input validation
│   └── _routes/                  # Internal API route handlers
│       ├── config.ts             # GET /api/config
│       ├── payment.ts            # POST /api/payment
│       ├── register.ts           # POST /api/register
│       ├── upload-url.ts         # POST /api/upload-url
│       ├── admin/                # Admin endpoints (login, dashboard, draw, delete)
│       ├── auth/                 # Email verification endpoint
│       ├── raffle/               # Public winners feed
│       └── tickets/              # Public tickets roster and order downloads
├── frontend/
│   ├── src/
│   │   ├── components/           # UI components (FlyingTicketsVortex, WinningTicketCard, etc.)
│   │   ├── hooks/                # Custom React hooks (useAuth, useConfig)
│   │   ├── lib/                  # API client, audio synthesizer, receipt validator
│   │   ├── pages/                # Page views (Landing, Register, Admin, Raffle, Payment)
│   │   └── types/                # TypeScript shared interfaces
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── prisma/
│   └── schema.prisma             # PostgreSQL schema definition
├── local-server.ts               # Local Express server mounting api/index.ts
├── dev-all.js                    # Concurrent development runner (API + Vite)
├── vercel.json                   # Vercel deployment and routing configuration
└── .env.example                  # Environment configuration template
```

---

## Vercel Serverless Architecture

To stay within the 12-function limit of Vercel's free Hobby plan, this application consolidates all 18 backend endpoints into a single Express serverless function (`api/index.ts`).

1. Route files reside in `api/_routes/`. Folders prefixed with an underscore are ignored by Vercel's function scanner.
2. `api/index.ts` mounts all routes through an Express router and handles incoming traffic.
3. `vercel.json` rewrites all `/api/(.*)` requests to `/api`.

This guarantees the entire backend uses only 1 serverless function on Vercel while keeping local development (`local-server.ts`) running the exact same router code.

---

## Local Development Setup

### Prerequisites
- Node.js version 20 or higher
- npm version 10 or higher
- Supabase project (PostgreSQL database and private Storage bucket)

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/hanzekel/E-Raffle-for-DYD.git
cd E-Raffle-for-DYD

# Install root dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend
```

### 2. Environment Configuration
Copy the sample environment file and add your credentials:
```bash
cp .env.example .env
```

Key environment variables:
- `DATABASE_URL`: Supabase connection pooler URL (with `?pgbouncer=true`)
- `DIRECT_URL`: Supabase direct connection URL (port 5432)
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`: Supabase API credentials
- `SUPABASE_STORAGE_BUCKET`: Private bucket name (e.g. `dyd26-uploads`)
- `JWT_SECRET`: Random 64-character secret
- `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH`: Admin credentials
- `GCASH_NUMBER`, `GCASH_NAME`, `BANK_NAME`, `BANK_ACCOUNT_NUMBER`: Payment info displayed to users

### 3. Database Parity
Sync the database schema with Supabase:
```bash
# Generate Prisma client
npx prisma generate

# Verify database schema parity
npm run db:check
```

### 4. Running Locally
Start both the Express API server and the Vite frontend simultaneously:
```bash
npm run dev:all
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/*
- Live Raffle Stage: http://localhost:5173/raffle
- Admin Dashboard: http://localhost:5173/admin/dashboard

---

## Testing and Verification

Run full TypeScript compilation across both frontend and backend along with database schema validation:
```bash
npm run check:all
```

To test the production build locally:
```bash
npm run build
```

---

## Vercel Deployment Guide

1. Push your repository to GitHub.
2. Go to vercel.com/new and import your repository.
3. In Project Settings:
   - Root Directory: `./` (do not select the `frontend` subfolder).
   - Application Preset: `Other` (so `vercel.json` handles build commands).
4. Under Environment Variables, paste the contents of your `.env` file.
5. Click Deploy.
6. Once deployed, update `FRONTEND_URL` in your Vercel Project Settings to match your production domain.

---

## License

Diocesan Youth Day 2026 (MOPCY). All rights reserved.
