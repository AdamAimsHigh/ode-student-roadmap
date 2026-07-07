# Cloud Progress Sync — Configuration Guide

The `/api/sync` endpoint (`src/worker.js`) synchronizes student
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
    (`ode-student-roadmap`) → *Settings* → *Bindings* → *Add* →
    *KV namespace* → Variable name `ODE_PROGRESS_KV` → select the
    `ODE_PROGRESS_KV` namespace.
  - **Pages project (if ever migrated):** your Pages project → *Settings* →
    *Functions* → *KV namespace bindings* → Variable name `ODE_PROGRESS_KV` →
    select the namespace — set it for **both Production and Preview**. A Pages
    migration would also need `src/worker.js` re-wrapped as a
    `functions/api/sync.js` exporting `onRequestGet`/`onRequestPost` (the
    handler logic itself is transport-agnostic).
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
- **Long-lived edge sessions (2026-07-02):** the first verified Google
  request is exchanged for an opaque `odesess_*` token (256 random bits)
  cached in KV under `session:<sha256(token)>` with a **30-day TTL** — only
  the hash is stored, so a KV dump can never be replayed as a credential.
  Subsequent `GET`/`POST` sync calls validate this token directly against
  KV before touching any progress record; tampered, truncated, or expired
  session tokens are rejected with a 401 challenge, prompting the client to
  fall back to a fresh Google sign-in (GIS `data-auto_select` makes that
  silent for returning students).
- KV records are namespaced per Google account (`progress:<sub>`); one user
  can never address another user's record.
- POST bodies are capped at 128 KiB and sanitized against a whitelist of the
  five `ode_*` progress keys with per-entry length and count caps — foreign
  keys, oversized blobs, and non-string ids are silently dropped.
- The whole contract is regression-locked by the committed 15-case
  cryptographic validation suite: `npm run test:sync`
  (`scripts/test_sync_worker.mjs`, real RS256 tokens against a mocked JWKS
  plus a TTL-aware KV mock).
- The client persists the Google credential (`ode_google_credential`) and
  the edge session (`ode_cloud_session`) in namespaced `localStorage` keys
  so sign-in survives browser restarts; the sync loop is inert on `file://`,
  offline, or signed-out sessions — localStorage remains the authoritative
  progress store.
