# Nico Sanders Community Outreach

District 11A community resource hub — nicosanders.net

## Stack

- Vite + React + TypeScript
- shadcn-ui + Tailwind CSS
- Supabase (forms, `resources` table, edge functions for email notifications)

The live homepage (`/`) is served directly from `public/concept-warm.html` via a Vercel routing rule, not the React app — see `vercel.json`. The React app still handles `/backend-info`.

## Local development

```sh
npm i
npm run dev
```

## Deploy

Push to `main` — Vercel auto-deploys from GitHub. After any change to `vercel.json` or the static `public/*.html` pages, run `vercel cache purge` if the root URL doesn't reflect the update right away.

## Backend

Supabase project: `sldlxxcyhgccattpllqm`. Schema and RLS policies live in `supabase/migrations/`. Edge functions (`send-contact-email`, `send-admin-alert`) require a `RESEND_API_KEY` secret set via `supabase secrets set`.
