# Kantu

A personal health-tracking app for blood pressure, glucose, heart rate, weight,
mood, memory/focus, and symptoms — built for Claudia, explicitly scoped to
exclude cycle/fertility/pregnancy tracking. Bilingual (Spanish default,
English toggle). Implements the `Kantu App.dc.html` design handoff from
Claude Design.

## Stack

- **Frontend:** React + TypeScript (Vite), no framework beyond React. All
  data is stored client-side in `localStorage` — there is no database.
- **Backend:** one endpoint, `POST /api/send-disclaimer`, that emails a copy
  of the medical disclaimer when someone completes onboarding. Nothing else
  touches the network. It exists in two forms that share the same email
  copy (`server/copy.ts`):
  - `server/index.ts` — a small Express server, used for local development.
  - `netlify/functions/send-disclaimer.mts` — a Netlify Function used in
    production when the site is deployed on Netlify (see below).

## Running locally

```bash
npm install
cp .env.example .env   # optional — see below
npm run dev             # runs both the Vite dev server and the API, on :5173 / :8787
```

Open http://localhost:5173.

- `npm run dev` — frontend + API together (recommended)
- `npm run dev:web` — frontend only
- `npm run server` — API only
- `npm run build` — production build of the frontend (`dist/`)

## Disclaimer email

Onboarding ends with a mandatory disclaimer ("this is not a medical
diagnosis") that the person must read and acknowledge before entering the
app. On acceptance, the app asks the API to email them a copy.

To actually send that email, set SMTP credentials in `.env` (see
`.env.example`) — any provider's SMTP relay works (Gmail app password,
SendGrid, Mailgun, Postmark, etc.). Without credentials configured, the API
logs a warning and skips sending — onboarding is never blocked by missing
email infrastructure.

## Deploying on Netlify

The repo includes `netlify.toml` (build command, publish directory, and the
functions directory) and a Netlify Function for the disclaimer email, so a
standard "import from Git" deploy works with no extra setup beyond env vars:

1. Connect the repo in Netlify (New site → Import an existing project).
   Build command and publish directory are already set via `netlify.toml`.
2. Under **Site configuration → Environment variables**, add the same
   `SMTP_*` variables from `.env.example`. Without them, the disclaimer
   screen still works — it just skips the email (same graceful fallback as
   local dev).
3. Deploy. The frontend calls `/api/send-disclaimer`, which Netlify routes
   straight to the function — no proxy or extra config needed.

## Data & privacy

Entries, language, and theme are persisted only in the browser's
`localStorage` (key `kantu:v1`). There is no account system and no server
persistence. "Export my entries" (Settings) downloads the raw entries as
JSON; "Download summary" (Trends → Summary for the doctor) downloads a
plain-text averages summary.
