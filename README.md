# What Changed — Landing Page + Waitlist

A single-page Next.js site that introduces the **What Changed** AI consulting / education
brand and captures a qualified waitlist (email, industry, AI experience, biggest challenge).
A password-gated `/admin` page lets you browse signups and download them as CSV.

This is **milestone 1** — validation only. Course player, payments, and community
come later, in the same Next.js app.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** (no UI library — kept intentionally simple)
- **Supabase** (Postgres) for waitlist storage
- **Resend** for confirmation emails
- **Vercel** for hosting

## Quick start (local)

```bash
npm install
cp .env.local.example .env.local
# fill in the values in .env.local
npm run dev
```

Then open http://localhost:3000.

## One-time setup

### 1. Supabase

1. Create a free project at <https://supabase.com>.
2. In **Project Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose)
3. Open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the
   `waitlist` table.

### 2. Resend (confirmation emails)

1. Create a free account at <https://resend.com>.
2. Verify the domain you'll send from (the `whatchanged` domain).
3. Copy the API key → `RESEND_API_KEY`.
4. Set `RESEND_FROM_EMAIL` to e.g. `hello@whatchanged.yourdomain`.

> Email is best-effort. If Resend isn't configured, signups still succeed —
> the warning just goes to the server logs.

### 3. Admin password

Pick a strong string and put it in `ADMIN_PASSWORD`. You'll be prompted for it
(via HTTP basic auth) when you visit `/admin`. Username is ignored; only the
password is checked.

## Deploy to Vercel

1. Push this directory to a GitHub repo.
2. Go to <https://vercel.com/new>, import the repo.
3. Add the env vars from `.env.local` in **Project Settings → Environment Variables**.
4. Deploy.
5. In **Project Settings → Domains**, add your `whatchanged` domain and follow
   the DNS instructions.

## Admin

Visit `/admin` on the deployed site. Enter any username and your `ADMIN_PASSWORD`
when prompted. You'll see all signups newest-first and can hit **Download CSV**
to grab them for analysis.

`/admin` and `/api` are also blocked from search engines via `app/robots.ts`.

## Project layout

```
app/
  layout.tsx              # Root layout + site metadata
  page.tsx                # The landing page
  globals.css             # Tailwind base
  robots.ts               # Block /admin and /api from crawlers
  api/waitlist/route.ts   # POST: validate, insert, send email
  admin/
    page.tsx              # HTML signup table
    export.csv/route.ts   # CSV download
components/
  Hero.tsx
  Problem.tsx
  Pillars.tsx
  WhoFor.tsx
  WaitlistForm.tsx        # The only client component
  FAQ.tsx
  Footer.tsx
lib/
  supabase.ts             # Server-only Supabase admin client
  email.ts                # Resend wrapper
middleware.ts             # HTTP basic auth gate for /admin/*
supabase/schema.sql       # One-time DB setup
```

## Testing the funnel end-to-end

1. `npm run dev`
2. Open <http://localhost:3000>, fill in the form, submit.
3. Confirm:
   - The form shows the success state.
   - A row appears in your Supabase `waitlist` table.
   - A confirmation email arrives in your inbox (if Resend is configured).
4. Submit the same email again → friendly "you're already on the list" message.
5. Submit an invalid email → inline error.
6. Visit <http://localhost:3000/admin>, log in, confirm the row appears, and
   click **Download CSV**.

## What's next

When the waitlist proves there's demand, the next milestone adds:

- Authentication for waitlist members
- A course player + Stripe checkout
- A members area / community
- Cohort invites driven by the `experience` and `industry` data captured here

All of that lives in this same Next.js app — no migration.
