# 🎟️ MOPCY DYD 2026 — Raffle Ticket System

> **Diocesan Youth Day 2026**
> *"Take Courage, Youth in Christ: 40 Years in Mission"*
> General Headquarters (GHQ), Philippines

A full-stack raffle ticket web application for MOPCY DYD 2026.
Attendees register, pay via GCash or bank transfer, and receive
PDF e-tickets with QR codes upon admin approval.

---

## Tech Stack

| Layer       | Technology                                    |
| ----------- | --------------------------------------------- |
| Frontend    | React 19 · TypeScript · Tailwind CSS 3 · Vite |
| Backend     | Vercel Serverless Functions (Node.js)         |
| Database    | PostgreSQL (Supabase)                         |
| ORM         | Prisma 6                                      |
| Storage     | Supabase Storage (private bucket)             |
| PDF         | pdf-lib                                       |
| QR Code     | qrcode                                        |
| Email       | Nodemailer (SMTP)                             |
| Auth        | JWT + bcryptjs                                |
| Deployment  | Vercel                                        |

---

## Project Structure

```
DYDWebsite/
├── api/                          # Vercel Serverless Functions
│   ├── _lib/                     # Shared utilities (not routed)
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── auth.ts               # JWT + bcrypt helpers
│   │   ├── validation.ts         # Zod schemas
│   │   ├── supabase.ts           # Supabase client
│   │   ├── email.ts              # Nodemailer transporter
│   │   ├── pdf.ts                # PDF generation with pdf-lib
│   │   ├── errors.ts             # Consistent error responses
│   │   └── middleware.ts         # CORS, rate limit, auth guard
│   ├── register.ts               # POST /api/register
│   ├── payment.ts                # POST /api/payment
│   ├── config.ts                 # GET  /api/config (public settings)
│   ├── admin/
│   │   ├── login.ts              # POST /api/admin/login
│   │   ├── dashboard.ts          # GET  /api/admin/dashboard
│   │   ├── approve/[id].ts       # POST /api/admin/approve/:id
│   │   └── reject/[id].ts        # POST /api/admin/reject/:id
│   ├── tickets/
│   │   └── [orderId].ts          # GET  /api/tickets/:orderId
│   └── auth/
│       └── verify-email.ts       # POST /api/auth/verify-email
├── frontend/                     # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   └── placeholders/     # ← All placeholder assets here
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
├── prisma/
│   └── schema.prisma             # Database schema
├── vercel.json                   # Deployment + routing config
├── .env.example                  # Environment variable template
├── package.json                  # Root (API dependencies)
└── README.md
```

---

## Local Development Setup

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **PostgreSQL** — local instance or [Supabase](https://supabase.com) project

### 1. Clone and Install

```bash
git clone <repo-url>
cd DYDWebsite

# Install root (API) dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend
```

### 2. Configure Environment

```bash
# Copy the template
cp .env.example .env

# Edit .env and fill in real values:
# - DATABASE_URL / DIRECT_URL (your PostgreSQL connection)
# - SUPABASE_URL / keys
# - JWT_SECRET (generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
# - ADMIN_PASSWORD_HASH (generate: node -e "require('bcryptjs').hash('your-password',12).then(h=>console.log(h))")
# - SMTP credentials
# - Payment details (GCash number, bank info)
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create database tables (development)
npx prisma migrate dev --name init

# Or push schema directly (quick prototyping)
npx prisma db push

# View data in browser
npx prisma studio
```

### 4. Supabase Storage Setup

1. Go to your Supabase Dashboard → Storage
2. Create a **private** bucket named `dyd26-uploads`
3. Do **not** enable public access — files are served via signed URLs

### 5. Run Development Servers

```bash
# Option A: Vercel CLI (recommended — matches production)
npm run dev

# Option B: Frontend only (uses Vite proxy for /api/*)
npm run dev:frontend
```

The frontend runs at `http://localhost:5173`.
The API runs at `http://localhost:3000/api/*`.

---

## Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name <migration-name>

# Apply migrations in production
npx prisma migrate deploy

# Reset database (⚠️ destructive)
npx prisma migrate reset
```

---

## Vercel Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial project setup"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects the `vercel.json` config
4. Framework preset: **Other** (not Next.js)

### 3. Set Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables,
add **every** variable from `.env.example` with production values:

| Variable                  | Required | Notes                                              |
| ------------------------- | -------- | -------------------------------------------------- |
| `DATABASE_URL`            | ✅       | Supabase pooler URL with `?pgbouncer=true`         |
| `DIRECT_URL`              | ✅       | Supabase direct URL (port 5432)                    |
| `SUPABASE_URL`            | ✅       | `https://[ref].supabase.co`                        |
| `SUPABASE_ANON_KEY`       | ✅       | Public key (RLS enforced)                          |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅     | **Secret** — server-side only                      |
| `SUPABASE_STORAGE_BUCKET` | ✅       | `dyd26-uploads`                                    |
| `JWT_SECRET`              | ✅       | Min 64 random chars                                |
| `JWT_EXPIRY`              | ✅       | `2h`                                               |
| `BCRYPT_ROUNDS`           | ✅       | `12`                                               |
| `ADMIN_USERNAME`          | ✅       | Admin login username                               |
| `ADMIN_PASSWORD_HASH`     | ✅       | bcrypt hash of admin password                      |
| `TICKET_PRICE`            | ✅       | e.g. `100` (in PHP)                                |
| `MAX_TICKETS_PER_REGISTRATION` | ✅  | e.g. `10`                                          |
| `GCASH_NUMBER`            | ✅       | GCash mobile number                                |
| `GCASH_NAME`              | ✅       | GCash account name                                 |
| `BANK_NAME`               | ✅       | e.g. `BDO`                                         |
| `BANK_ACCOUNT_NUMBER`     | ✅       | Bank account number                                |
| `BANK_ACCOUNT_NAME`       | ✅       | Bank account holder name                           |
| `SMTP_HOST`               | ✅       | e.g. `smtp.gmail.com`                              |
| `SMTP_PORT`               | ✅       | e.g. `587`                                         |
| `SMTP_USER`               | ✅       | SMTP login email                                   |
| `SMTP_PASS`               | ✅       | App password or API key                            |
| `EMAIL_FROM`              | ✅       | `DYD26 <noreply@dyd26.com>`                        |
| `FRONTEND_URL`            | ✅       | Your Vercel domain                                 |

### 4. Deploy

```bash
# Via CLI
vercel --prod

# Or push to main branch — Vercel auto-deploys
```

### 5. Run Production Migration

```bash
# Set DATABASE_URL to production, then:
npx prisma migrate deploy
```

---

## Swapping Placeholder Assets

All placeholder UI components live in
`frontend/src/components/placeholders/`.

Each placeholder file is self-contained and marked with
`// TODO: Replace with actual asset` comments.

| Placeholder          | File                          | Replace With                   |
| -------------------- | ----------------------------- | ------------------------------ |
| DYD26 Logo           | `PlaceholderLogo.tsx`         | Actual logo image (120×120px)  |
| GCash QR Code        | `PlaceholderGcashQR.tsx`      | Uploaded QR image via admin    |
| Event Banner         | `PlaceholderEventBanner.tsx`  | Branded hero banner image      |
| E-Ticket Background  | *(in pdf.ts)*                 | Branded PDF template           |

To swap:
1. Add the real asset to `frontend/public/` or Supabase Storage
2. Update the placeholder component to render the real image
3. Remove the `// TODO` comment

---

## Security Checklist

- [x] Zod validation on all API inputs
- [x] DOMPurify (frontend) + validator.js (backend) sanitization
- [x] bcrypt password hashing (12 rounds)
- [x] JWT in HTTP-only cookies (2h expiry)
- [x] Rate limiting on login + public endpoints (DB-backed)
- [x] CORS restricted to FRONTEND_URL only
- [x] Security headers via vercel.json (HSTS, CSP, X-Frame-Options)
- [x] File upload validation (type, size, UUID rename)
- [x] Private Supabase Storage bucket + signed URLs
- [x] Prisma parameterized queries only
- [x] crypto.randomBytes for ticket numbers
- [x] No stack traces in API responses
- [x] Environment variables — never hardcoded

---

## Pages

| Route                | Description                         | Auth     |
| -------------------- | ----------------------------------- | -------- |
| `/`                  | Landing page                        | Public   |
| `/register`          | Registration form                   | Public   |
| `/payment`           | Payment + proof upload              | Public   |
| `/confirmation`      | Post-submission confirmation        | Public   |
| `/tickets/[orderId]` | Download tickets (email-verified)   | Email    |
| `/admin/login`       | Admin login                         | Public   |
| `/admin/dashboard`   | Admin approval panel                | JWT      |

---

## License

Private — MOPCY DYD 2026. All rights reserved.
