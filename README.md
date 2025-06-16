# Zupass Discount Codes Demo

## Overview

This project is a demo app that allows users to connect their Zupass wallet and claim a unique discount code using zero-knowledge proofs (ZKPs). The app ensures each user can only claim one code, using a privacy-preserving nullifier, and prevents double-claims. It demonstrates the use of PODs, GPCs, and the Zupass Z-API for privacy-preserving authentication and selective disclosure.

## Tech Stack
- **Next.js** (React, App Router)
- **Supabase** (hosted Postgres, API, CLI, client)
- **Vercel** (hosting, serverless functions)
- **@parcnet-js/app-connector** (Zupass integration)
- **@pcd/gpc** (General Purpose Circuits for ZKPs)
- **@parcnet-js/ticket-spec** (Ticket proof helpers)
- **Tailwind CSS** (styling)

**The backend database is managed by Supabase (Postgres), with migrations and seeding handled via the Supabase CLI.**

## Project Structure

```
zupass-discount-codes/
├── supabase/              # Supabase migrations and config
│   └── migrations/       # SQL migration and seed files
├── data/                 # ZK artifacts and backend/serverless files
│   └── artifacts/        # ZK circuits, keys, etc. (used by backend)
├── src/
│   ├── app/              # Next.js app directory (API routes, pages, components)
│   │   └── api/utils/    # Supabase client utility for backend
│   ├── utils/            # Utility modules (hashing, proof helpers)
├── public/               # Static assets
├── .env, .env.local, .env.production  # Environment variables
├── README.md             # This file
└── ...
```

### Key Files
- `supabase/migrations/`: Database schema and seed migrations (VoucherCode table)
- `src/app/api/verify/route.ts`: API endpoint for proof verification and code claiming
- `src/app/api/utils/supabase.ts`: Supabase client utility (backend only)
- `src/utils/hash.ts`: Hashing utility for ticket ID
- `src/utils/ticketProof.ts`: Proof request builder (configures what is revealed)
- `src/app/home.tsx`: Main frontend logic/UI

## How We Use PODs, GPC, and Zupass
- **PODs** (Provable Object Datatypes): Cryptographically signed data objects (e.g., event tickets) stored in Zupass.
- **GPCs** (General Purpose Circuits): Enable flexible, privacy-preserving ZK proofs about PODs (e.g., prove you have a ticket without revealing all details).
- **Zupass Z-API**: Lets the app request proofs from the user's Zupass wallet, including selective disclosure and nullifier generation.
- **Nullifier**: A privacy-preserving unique value derived from the user's identity and an external string, used to prevent double-claims. (Now only used for frontend display; backend uses ticket ID hash.)

## Backend Options

This demo app can be used in two ways:

1. **With the 0xPARC Vercel-hosted backend:**
   Follow the instructions below and the app will connect to our backend.
2. **With your own backend and database:**
   If you want to run your own backend (for privacy, testing, or development), follow the instructions in "Setting Up Your Own Backend" below.

---

## Setup Instructions

### A. Using the 0xPARC-hosted Backend (Default, Easiest)

- No backend setup required. The app will connect to the public demo backend managed by 0xPARC.
- Follow these steps to run the frontend locally:

#### Prerequisites
- Node.js (18+ recommended)
- pnpm (or npm/yarn)

#### 1. Clone the Repo and Install Dependencies
```sh
git clone <repo-url>
cd zupass-discount-codes
pnpm install
```

#### Environment Variables
- `.env.example` is a template file listing all required environment variables. Copy it to `.env.local` for development, and to `.env.production` for production if you want to run commands locally with production settings.
- **SUPABASE_URL** and **SUPABASE_ANON_KEY**: Get these from your Supabase project dashboard.
- **SUPABASE_SERVICE_ROLE_KEY**: (For backend use only) Get this from your Supabase project settings.

#### Running Locally
```sh
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000)

---

### B. Setting Up Your Own Backend (Supabase)

If you want to run your own backend and database (for privacy, testing, or development), follow these steps:

1. **Set Up a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project.
   - For local development, install the Supabase CLI:
     ```sh
     npm install -g supabase
     # or
     pnpm add -g supabase
     ```
   - Initialize Supabase in your project:
     ```sh
     npx supabase init
     npx supabase start
     ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local` and set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` as needed.

3. **Run Migrations and Seed the Database**
   - Migrations and seed files are in `supabase/migrations/`.
   - To apply all migrations (including seeds):
     ```sh
     npx supabase db push
     ```

4. **Start the App**
   ```sh
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

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
4. Backend verifies proof, extracts the **ticket ID** and computes its hash:
   - If the ticket ID hash is already claimed, returns the same code.
   - If not, atomically assigns an unused code to the ticket ID hash.
   - If no codes remain, returns an error.
5. Frontend displays the code or error. (Nullifier is shown for transparency, but not used for backend validation.)

## Common Supabase Commands
- **Apply migrations:** `npx supabase db push`
- **Seed codes:** Add seed SQL to a migration file and re-run `npx supabase db push`
- **Start local Supabase stack:** `npx supabase start`
- **Link to remote project:** `npx supabase link --project-ref <project-ref>`
- **Deploy to production:** Use the Supabase dashboard or CLI for remote migrations

## Troubleshooting & FAQ
- **No codes remaining:** Seed more codes in the database via a migration.
- **Supabase connection errors:** Check your `SUPABASE_URL` and keys in `.env.local`.
- **Migrations not applied:** Make sure your local Supabase stack is running and run `npx supabase db push`.
- **API returns verification failed:** Check your proof structure and Supabase backend logs.

## Resources
- [Supabase Docs](https://supabase.com/docs)
- [PODs & GPCs Documentation](https://pod.org/docs)
- [Zupass Z-API Docs](https://pod.org/z-api/introduction)

---

**Maintainers:**
- Please keep this README up to date as the project evolves!

---

## Community & Feedback

This project is built on new and evolving technology. We warmly welcome suggestions, improvements, and bugfixes from the community! If you encounter issues or have ideas for making this demo better, please open an issue or submit a pull request.

Thank you for your patience and support as we continue to improve and innovate with Zupass, PODs, GPC, and privacy-preserving tech!
