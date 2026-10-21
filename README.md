# 🎟️ MOPCY DYD 2026 — Diocesan Youth Day Raffle Platform

> **Diocesan Youth Day 2026**  
> *"Take Courage, Youth in Christ: 40 Years in Mission"*  
> General Headquarters (GHQ), Philippines

A secure, full-stack raffle ticket web application and live draw stage built for MOPCY DYD 2026. Attendees register, submit GCash/bank transfer payment proofs, and receive cryptographically verified PDF e-tickets with QR codes upon admin verification.

---

## 🚀 Key Features

### 🌐 Public Experience
- **High-Impact Hero & Fit-to-Screen Design:** Styled with the Diocesan Marian Blue color palette (`#1A3A8F`), Marian gold accents (`#F5A623`), and responsive typography optimized for mobile (375px+) and desktop displays.
- **Streamlined Multi-Step Registration:** Fast registration flow with quantity selection, instant price calculation, and real-time validation.
- **Secure Proof Upload:** Direct image uploads for GCash or bank transfer slips stored securely in Supabase Storage with signed URL access.
- **E-Ticket Retrieval:** Attendees can verify and download their custom-generated PDF tickets with high-resolution QR codes.
- **Live CSPRNG Raffle Stage (`/raffle`):** Public-facing animated stage for live event draws featuring real-time drum rolls, cryptographic randomness, and instant winner reveal.

### 🛡️ Admin & Operational Controls
- **Real-Time Live Dashboard:** Auto-syncing statistics (Total Submissions, Pending, Eligible, Rejected, Confirmed Winners) polling seamlessly every 6 seconds without UI flicker.
- **In-App Receipt Viewer:** Instant high-resolution preview modal for proof-of-payment receipts with quick-action full-size inspection.
- **One-Click Approval / Rejection:** Automated PDF ticket generation and transactional email dispatch upon approval.
- **Cascading Permanent Deletion:** Safe, reason-free entry deletion with in-app dual confirmation that purges registration records and associated tickets from PostgreSQL.
- **Live Draw Controls & Void/Redraw:** Secure CSPRNG draw engine with tamper-evident SHA-256 draw verification and operator Void & Redraw capabilities.
- **Zero Native Popups:** 100% custom accessible UI dialogs (`actionModal`, `noticeModal`) eliminating native browser `alert()` and `confirm()` dialogs.
- **Audit & CSV Export:** One-click CSV export of approved raffle entries and winners with cryptographic hashes.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19 · TypeScript · Tailwind CSS 3 · Vite · Lucide Icons |
| **Backend** | Vercel Serverless Functions / Express (`local-server.ts` for local dev) |
| **Database** | PostgreSQL (Supabase) via Prisma 6 ORM |
| **Storage** | Supabase Storage (private bucket with short-lived signed URLs) |
| **PDF & QR** | `pdf-lib` (custom e-ticket generation) · `qrcode` |
| **Email** | Nodemailer (SMTP transactional dispatch) |
| **Security** | Node.js `crypto` CSPRNG · JWT (HTTP-only) · bcryptjs (12 rounds) · Zod |
| **Deployment** | Vercel (Production) |

---

## 📁 Project Structure

```
DYDWebsite/
├── api/                          # Vercel Serverless Functions & API Endpoints
│   ├── _lib/                     # Shared backend utilities
│   │   ├── auth.ts               # JWT authentication & bcrypt helpers
│   │   ├── email.ts              # Nodemailer transactional emailer
│   │   ├── errors.ts             # Standardized API error handler
│   │   ├── middleware.ts         # CORS & route guards
│   │   ├── pdf.ts                # PDF e-ticket generator with QR embedding
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── supabase.ts           # Supabase client wrapper
│   │   └── validation.ts         # Zod schemas for request validation
│   ├── admin/
│   │   ├── approve/[id].ts       # POST: Approve registration & generate tickets
│   │   ├── reject/[id].ts        # POST: Reject registration with reason
│   │   ├── delete/[id].ts        # DELETE: Permanent cascading deletion
│   │   ├── dashboard.ts          # GET: Real-time dashboard metrics & entries
│   │   ├── draw.ts               # POST: CSPRNG ticket draw execution
│   │   ├── void-draw.ts          # POST: Void draw & return ticket to pool
│   │   ├── winners.ts            # GET: Confirmed raffle winners list
│   │   ├── login.ts              # POST: Admin authentication
│   │   └── me.ts                 # GET: Admin session validation
│   ├── tickets/
│   │   ├── [orderId].ts          # GET: Order ticket details
│   │   └── all.ts                # GET: Public ticket roster
│   ├── raffle/
│   │   ├── winners.ts            # GET: Public winners feed
│   │   └── pool.ts               # GET: Public eligible entries pool
│   ├── config.ts                 # GET: Dynamic event configurations
│   ├── payment.ts                # POST: Proof of payment upload handler
│   └── register.ts               # POST: Initial attendee registration
├── frontend/                     # React + Vite Single Page Application
│   ├── src/
│   │   ├── components/           # UI components (SiteBackground, EventBanner, etc.)
│   │   ├── hooks/                # Custom React hooks (useAuth, useConfig)
│   │   ├── lib/                  # Frontend API client and utilities
│   │   ├── pages/                # Page views (Landing, Register, Admin, Raffle, etc.)
│   │   └── types/                # TypeScript interfaces and contracts
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── prisma/
│   └── schema.prisma             # PostgreSQL schema definition
├── local-server.ts               # Local Express dev server mounting all API routes
├── dev-all.js                    # Concurrent dev runner (API + Vite frontend)
├── vercel.json                   # Vercel deployment and routing configuration
└── .env.example                  # Environment configuration template
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- **Supabase** project (PostgreSQL + private Storage bucket)

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd DYDWebsite

# Install root dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend
```

### 3. Environment Configuration
Copy the template and configure your secrets:
```bash
cp .env.example .env
```
Ensure the following variables are set in `.env`:
- `DATABASE_URL` / `DIRECT_URL`: Supabase PostgreSQL connection strings
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`: Supabase API credentials
- `SUPABASE_STORAGE_BUCKET`: `dyd26-uploads`
- `JWT_SECRET`: Random 64-character secret
- `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH`: Admin credentials (bcrypt 12 rounds)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`: Mail server credentials

### 4. Database Parity
Synchronize your database schema with Supabase:
```bash
# Generate Prisma client
npx prisma generate

# Verify or sync schema with the database
npm run db:check
```

### 5. Running the Application
Launch both the backend API server and frontend SPA concurrently:
```bash
npm run dev:all
```
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:3000/api/*`
- **Live Raffle Stage:** `http://localhost:5173/raffle`
- **Admin Dashboard:** `http://localhost:5173/admin/dashboard`

---

## 🧪 Quality Assurance & Type Checking

Run full TypeScript compilation across both frontend and backend along with database schema validation:
```bash
npm run check:all
```

---

## 🔒 Security Architecture

- **CSPRNG Execution:** Draws use Node.js `crypto.randomInt` and Web Crypto API to ensure uniform distribution and prevent predictability.
- **Tamper-Evident Hashing:** Each draw generates a SHA-256 integrity hash linking the winner, ticket ID, timestamp, and seed.
- **Signed URL Protection:** All proof-of-payment receipts are stored in a private Supabase bucket and accessed only via short-lived signed URLs.
- **Strict Role-Based Guards:** Admin endpoints are shielded behind JWT tokens stored in HTTP-only cookies with 12-round bcrypt verification.
- **Sanitized Inputs:** Strict Zod parsing on API request payloads prevents parameter injection and unexpected inputs.

---

## 📄 License

Diocesan Youth Day 2026 (MOPCY). All rights reserved.
