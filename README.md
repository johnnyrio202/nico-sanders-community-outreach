# Nico Sanders Community Outreach

District 11A community resource hub — nicosanders.net

## Stack

- Vite + React + TypeScript
- shadcn-ui + Tailwind CSS
- Neon Postgres (via Vercel Marketplace) — forms, `resources`, `community_events`, reached through `api/*.ts` Vercel Functions
- Supabase — `event-media` storage bucket, edge functions for email notifications only (no longer holds the live relational data)

The live homepage (`/`) is served directly from `public/concept-warm.html` via a Vercel routing rule, not the React app — see `vercel.json`. `public/events.html` serves `/events` the same way. Both fetch data from `/api/*` (Neon-backed), not a direct database connection. The React app still handles `/backend-info`.

## Local development

```sh
npm i
vercel env pull .env.local --yes   # syncs DATABASE_URL from the linked Neon integration
npm run dev
```

## Deploy

Push to `main` — Vercel auto-deploys from GitHub. After any change to `vercel.json` or the static `public/*.html` pages, run `vercel cache purge` if the root URL doesn't reflect the update right away.

## Backend

**Database (Neon):** provisioned via `vercel integration add neon`, linked to this Vercel project — `DATABASE_URL` is injected automatically, no manual connection-string management. Schema lives in `db/schema.sql` (apply with `psql "$DATABASE_URL_UNPOOLED" -f db/schema.sql`). Data is read/written only from `api/*.ts` (using `@neondatabase/serverless`); the static pages and the React components call those routes, never Postgres directly. Neon's free tier scales to zero on inactivity but auto-resumes on the next query — no manual restart needed, unlike the old Supabase project.

**Storage & email (Supabase project `sldlxxcyhgccattpllqm`):** still hosts the `event-media` storage bucket (referenced only as static public URLs in `community_events.image_url`) and the `send-contact-email`/`send-admin-alert` edge functions, which require a `RESEND_API_KEY` secret set via `supabase secrets set`. This project can still pause on inactivity — if it does, event thumbnails and email notifications degrade gracefully (forms still submit to Neon; email just silently no-ops the way it already does when the secret is unset), but the core site (reads/writes) is no longer affected.
