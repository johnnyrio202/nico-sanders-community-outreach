# Nico Sanders Community Outreach

District 11A community resource hub — nicosanders.net

## Stack

- Vite + React + TypeScript
- shadcn-ui + Tailwind CSS
- Neon Postgres (via Vercel Marketplace) — forms, `resources`, `community_events`
- Vercel Blob (via Vercel Marketplace) — event thumbnails (`event-media/*`)
- Resend — transactional email
- All reached through `api/*.ts` Vercel Functions. No external backend platform (Supabase, etc.) — everything runs on Vercel.

The live homepage (`/`) is served directly from `public/concept-warm.html` via a Vercel routing rule, not the React app — see `vercel.json`. `public/events.html` serves `/events` the same way. Both fetch data from `/api/*`, not a direct database connection. The React app still handles `/backend-info`.

## Local development

```sh
npm i
vercel env pull .env.local --yes   # syncs DATABASE_URL, BLOB_READ_WRITE_TOKEN, RESEND_API_KEY
npm run dev
```

## Deploy

Push to `main` — Vercel auto-deploys from GitHub. After any change to `vercel.json` or the static `public/*.html` pages, run `vercel cache purge` if the root URL doesn't reflect the update right away.

## Backend

**Database (Neon):** provisioned via `vercel integration add neon`, linked to this Vercel project — `DATABASE_URL` is injected automatically, no manual connection-string management. Schema lives in `db/schema.sql` (apply with `psql "$DATABASE_URL_UNPOOLED" -f db/schema.sql`). Data is read/written only from `api/*.ts` (using `@neondatabase/serverless`); the static pages and the React components call those routes, never Postgres directly. Neon's free tier scales to zero on inactivity but auto-resumes on the next query — no manual restart needed.

**Storage (Vercel Blob):** the `event-media/*` files backing `community_events.image_url` live in a public Blob store (`nico-community-outreach`), provisioned via `vercel blob create-store`. Upload new files with `vercel blob put <file> --access public`.

**Email (Resend via Vercel Functions):** `api/send-contact-email.ts` and `api/send-admin-alert.ts` call the Resend API directly using a `RESEND_API_KEY` environment variable (set via `vercel env add`). No third-party function host involved.

Historical note: this project originally ran on Supabase (database, storage, and Deno edge functions). `supabase/migrations/` is kept as a record of how the schema and resource content evolved, but nothing in the live site talks to Supabase anymore.
