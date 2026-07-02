# Cloud Progress Sync — Configuration Guide

The `/api/sync` endpoint (`functions/api/sync.js`) synchronizes student
progress to Cloudflare KV, authenticated with Google Sign-In. Two values must
be provisioned before the first deploy succeeds; everything else ships in the
repository.

## 1. Create and bind the `ODE_PROGRESS_KV` namespace

```bash
npx wrangler kv namespace create ODE_PROGRESS_KV
```

The command prints a namespace `id`. Paste it into `wrangler.jsonc`, replacing
`TODO_PASTE_ODE_PROGRESS_KV_NAMESPACE_ID`:

```jsonc
"kv_namespaces": [
  { "binding": "ODE_PROGRESS_KV", "id": "<the id from the command above>" }
]
```

**Binding rules (this is the part that must match exactly):**

- The **binding variable name** must be `ODE_PROGRESS_KV` — the function reads
  `env.ODE_PROGRESS_KV` and returns HTTP 500 if the binding is absent.
- If you manage bindings in the dashboard instead of `wrangler.jsonc`:
  - **Workers project (current setup):** Workers and Pages → your Worker
    (`differential-equations-app`) → *Settings* → *Bindings* → *Add* →
    *KV namespace* → Variable name `ODE_PROGRESS_KV` → select the
    `ODE_PROGRESS_KV` namespace.
  - **Pages project (if ever migrated):** your Pages project → *Settings* →
    *Functions* → *KV namespace bindings* → Variable name `ODE_PROGRESS_KV` →
    select the namespace — set it for **both Production and Preview**.
    `functions/api/sync.js` already exports Pages-style `onRequestGet`/
    `onRequestPost` handlers, so no code change is needed.
- Dashboard-edited bindings are overwritten on the next `wrangler deploy`;
  keep `wrangler.jsonc` authoritative.

## 2. Provision the Google OAuth client ID

1. Google Cloud Console → *APIs and Services* → *Credentials* → *Create
   credentials* → *OAuth client ID* → type **Web application**.
2. Authorized JavaScript origins: `https://stapleseducation.com` (plus
   `http://localhost:8787` for local `wrangler dev` testing).
3. Copy the client ID (ends in `.apps.googleusercontent.com`) into **both**
   places, which must match or every token is rejected with 401 `bad audience`:
   - `wrangler.jsonc` → `vars.GOOGLE_CLIENT_ID`
   - `ode/index.html` → the `data-client_id` attribute on `#g_id_onload`

## 3. Deploy and verify

```bash
npm run deploy:dry-run   # config validation, no upload
npm run deploy
```

Verify after deploy:

- `https://stapleseducation.com/` serves the landing page, `/ode/` the SPA.
- `curl https://stapleseducation.com/api/sync` → `401 {"error":"Missing
  bearer credential."}` (proves the Worker owns the route).
- Sign in with Google inside the app header: the button swaps to a "Syncing
  as \<email>" chip, and progress made on one browser appears on another
  after sign-in (watched videos and quiz answers merge as unions, so devices
  never erase each other).

## Security model

- Google ID tokens are verified **at the edge** with the native Web Crypto
  API: RS256 signature against Google's live JWKS, plus `iss`, `aud`
  (= `GOOGLE_CLIENT_ID`), `exp`/`nbf` (60 s skew), and `sub` checks.
- KV records are namespaced per Google account (`progress:<sub>`); one user
  can never address another user's record.
- POST bodies are capped at 128 KiB and sanitized against a whitelist of the
  five `ode_*` progress keys with per-entry length and count caps — foreign
  keys, oversized blobs, and non-string ids are silently dropped (verified by
  the 15-case end-to-end test run during development).
- The client keeps the credential in `sessionStorage` only, and the sync loop
  is inert on `file://`, offline, or signed-out sessions — localStorage
  remains the authoritative store.
