# KONIK Web App

Modern platform combining premium clothing e-commerce with digital self-improvement tools.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS, TypeScript
- **Database:** PostgreSQL + Prisma ORM — **[docs/PRODUCTS.md](./docs/PRODUCTS.md)** for clothing catalog & Cloudinary flow
- **Auth:** NextAuth v5 (credentials + OAuth) — see **[docs/AUTH.md](./docs/AUTH.md)** for routes, RBAC, and protecting pages
- **Payments:** Stripe
- **Storage:** Cloudinary
- **Hosting:** Vercel

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in your database URL, auth secrets, and API keys.

3. **PostgreSQL:** Install Postgres locally, use [Docker](#local-postgres-with-docker), or create a free DB on [Neon](https://neon.tech) / [Supabase](https://supabase.com).

4. **Set up the database:**
   ```bash
   npx prisma db push
   ```

   **If `db push` fails:**

   | Error | What to do |
   |-------|------------|
   | `P1013` empty host | Your `DATABASE_URL` is invalid. Use the exact format in `.env.example`. If your password has `@`, `:`, `/`, `#`, encode it (e.g. `@` → `%40`). No spaces inside the URL. |
   | `P1000` authentication failed | Wrong username/password, or Postgres isn’t accepting that user. Match credentials to your server (or use Docker credentials below). |
   | Connection refused | Postgres isn’t running or wrong port (default `5432`). |

### Local Postgres with Docker

```bash
docker compose up -d
```

Then in `.env` set:

```env
DATABASE_URL="postgresql://konik:konik_dev_password@localhost:5432/konik?schema=public"
```

Then run `npx prisma db push` again.

5. **Run the dev server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── (dashboard)/     # User dashboard (protected)
│   ├── (admin)/         # Admin panel (admin-only)
│   └── api/             # API routes
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Core utilities (db, auth, utils)
├── services/            # Business logic (tool-access, etc.)
└── types/               # TypeScript type definitions
prisma/
└── schema.prisma        # Database schema
```

## Database Commands

```bash
npm run db:push      # Push schema to database
npm run db:migrate   # Create and apply migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed the database
```
