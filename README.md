# Zupass Discount Codes Demo

## Overview

This project is a demo app that allows users to connect their Zupass wallet and claim a unique discount code using zero-knowledge proofs (ZKPs). The app ensures each user can only claim one code, using a privacy-preserving nullifier, and prevents double-claims. It demonstrates the use of PODs, GPCs, and the Zupass Z-API for privacy-preserving authentication and selective disclosure.

**The backend database is Postgres, managed through Vercel's Storage/Marketplace integration (Prisma Postgres), and accessed via Prisma ORM.**

## Tech Stack
- **Next.js** (React, App Router)
- **Prisma** (ORM for Postgres)
- **Vercel-managed Postgres** (Prisma Postgres/Neon via Vercel Storage/Marketplace)
- **Vercel** (hosting, serverless functions)
- **@parcnet-js/app-connector** (Zupass integration)
- **@pcd/gpc** (General Purpose Circuits for ZKPs)
- **@parcnet-js/ticket-spec** (Ticket proof helpers)
- **Tailwind CSS** (styling)

## Project Structure

```
zupass-discount-codes/
├── prisma/                # Prisma schema, migrations, seed script
├── src/
│   ├── app/              # Next.js app directory (API routes, pages, components)
│   ├── lib/              # Utility modules (prisma client, proof helpers)
│   └── generated/        # (If using custom Prisma client output)
├── public/               # Static assets
├── .env, .env.local, .env.production  # Environment variables
├── README.md             # This file
└── ...
```

### Key Files
- `prisma/schema.prisma`: Database schema (VoucherCode table)
- `prisma/seed.ts`: Script to seed voucher codes
- `src/app/api/verify/route.ts`: API endpoint for proof verification and code claiming
- `src/lib/prisma.ts`: Prisma client utility
- `src/lib/ticketProof.ts`: Proof request builder (configures what is revealed)
- `src/app/home.tsx`: Main frontend logic/UI

## How We Use PODs, GPC, and Zupass
- **PODs** (Provable Object Datatypes): Cryptographically signed data objects (e.g., event tickets) stored in Zupass.
- **GPCs** (General Purpose Circuits): Enable flexible, privacy-preserving ZK proofs about PODs (e.g., prove you have a ticket without revealing all details).
- **Zupass Z-API**: Lets the app request proofs from the user's Zupass wallet, including selective disclosure and nullifier generation.
- **Nullifier**: A privacy-preserving unique value derived from the user's identity and an external string, used to prevent double-claims.

## Setup Instructions

### Prerequisites
- Node.js (18+ recommended)
- pnpm (or npm/yarn)
- Vercel account (for deployment and managed Postgres)

### 1. Clone the Repo and Install Dependencies
```sh
git clone <repo-url>
cd zupass-discount-codes
pnpm install
```

### 2. Environment Variables
- `.env.example` is a template file listing all required environment variables. Copy it to `.env.local` for development, and to `.env.production` for production if you want to run commands locally with production settings.
- **DATABASE_URL**: Get this from the Vercel dashboard:
  - Go to your project in Vercel
  - Click on the Storage tab or Database integration (Prisma Postgres/Neon)
  - Copy the connection string (DATABASE_URL) and paste it into your `.env.local` and/or `.env.production` as needed.

### 3. Database Setup
- **You do not need to create additional databases manually.** Vercel manages the Prisma Postgres database for you when you add it via the Storage/Marketplace integration.
- Set `DATABASE_URL` in your environment files as described above.
- Run migrations:
  ```sh
  npx prisma migrate dev --name init
  ```
- Seed codes:
  ```sh
  npx tsx prisma/seed.ts
  ```

### 4. Using Prisma Studio or Running Prisma Commands with Production Variables
- To run Prisma commands (like `studio`, `migrate`, or `seed`) against your production database locally, use:
  ```sh
  export $(cat .env.production | grep -v '^#' | xargs) && npx prisma studio
  # or for migrations:
  export $(cat .env.production | grep -v '^#' | xargs) && npx prisma migrate deploy
  ```
- This loads your production environment variables for the command, without needing to copy files.

### 5. Running Locally
```sh
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000)

## Vercel Integration & Deployment
- Connect your repo to Vercel.
- Set `DATABASE_URL` in Vercel project settings for both Preview and Production as needed.
- Deploy:
  - Preview: `vercel deploy` (answer "no" to production prompt or use `--pre`)
  - Production: `vercel deploy --prod`

## API Usage
- **Endpoint:** `POST /api/verify`
- **Request:** `{ serializedProofResult: string }` (from Zupass proof)
- **Response:**
  - `{ verified: true, code: "DISCOUNT2024A" }` (success)
  - `{ verified: true, code: null, error: "No codes remaining." }` (no codes left)
  - `{ verified: false, ... }` (invalid proof or server error)
- **Error Handling:** All errors are returned as structured JSON.

## Code Claim Flow
1. User connects Zupass and requests a proof.
2. Proof request includes an `externalNullifier` so the proof reveals a nullifier.
3. User submits proof to `/api/verify`.
4. Backend verifies proof, extracts nullifier:
   - If nullifier already claimed, returns the same code.
   - If not, atomically assigns an unused code to the nullifier.
   - If no codes remain, returns an error.
5. Frontend displays the code or error.

## Common Prisma & Vercel Commands
- **Migrate dev DB:** `npx prisma migrate dev --name <desc>`
- **Migrate prod DB:**
  ```sh
  cp .env.production .env
  npx prisma migrate deploy
  mv .env .env.local
  ```
- **Seed codes:** `npx tsx prisma/seed.ts`
- **Open Prisma Studio:** `npx prisma studio`
- **Deploy preview:** `vercel deploy --pre`
- **Deploy production:** `vercel deploy --prod`

## Troubleshooting & FAQ
- **Nullifier not found in proof:** Ensure your proof request includes an `externalNullifier`.
- **No codes remaining:** Seed more codes in the database.
- **Prisma errors:** Check your `DATABASE_URL` and run `npx prisma generate` after schema changes.
- **Vercel deploy uses wrong DB:** Double-check environment variables in Vercel dashboard.

## Resources
- [PODs & GPCs Documentation](https://pod.org/docs)
- [Zupass Z-API Docs](https://pod.org/z-api/introduction)
- [Prisma Docs](https://www.prisma.io/docs)
- [Vercel Docs](https://vercel.com/docs)

---

**Maintainers:**
- Please keep this README up to date as the project evolves!
