/* Worker entry point (wrangler.jsonc "main") for stapleseducation.com.
 *
 * Owns the authenticated /api/sync progress-synchronization endpoint and
 * the Turnstile-protected /api/contact lead-generation endpoint, and falls
 * through to the static asset pipeline (env.ASSETS) for every other
 * request: the landing page at /, the ODE roadmap SPA at /ode/.
 *
 * Abuse controls: every API route sits behind a lightweight in-isolate
 * fixed-window rate limiter keyed on CF-Connecting-IP (best-effort by
 * design — each isolate keeps its own counters, which is exactly the
 * blast radius that matters for a single hot client hammering one PoP).
 * POST bodies are size-capped twice (declared Content-Length before the
 * read, actual text after) and must declare application/json.
 *
 * Auth (hybrid, two verification modes on one Bearer header):
 *
 * 1. Google ID token (RS256 JWT). Verified at the edge with the native
 *    Web Crypto API against Google's published JWKS — no third-party
 *    libraries. Claims checked: signature, iss, aud (must equal
 *    env.GOOGLE_CLIENT_ID), exp/nbf with clock skew, and a present sub.
 *    A successful Google verification additionally mints a long-lived
 *    opaque session token (odesess_* + 256 random bits) returned in the
 *    response body, so the client can outlive the ~1 h Google token.
 *
 * 2. Edge session token (odesess_*). Validated directly against KV: the
 *    token's SHA-256 hash keys a "session:<hash>" record holding the
 *    Google sub/email, written with a 30-day expirationTtl. Only the
 *    hash is stored, so a KV dump can never be replayed as a credential;
 *    TTL expiry or eviction yields a 401 challenge and the client falls
 *    back to a fresh Google sign-in.
 *
 * Sign-out: DELETE /api/sync with an odesess_* bearer hard-revokes that
 * session server-side — the hashed KV record is deleted, so the token is
 * dead on every device immediately rather than lingering until TTL expiry.
 *
 * Storage: env.ODE_PROGRESS_KV, four record families:
 *   "progress:<subject>:<google sub>"  { progress, email, updatedAt }
 *       — per-curriculum progress, subject ∈ KNOWN_SUBJECTS. GET/POST
 *       /api/sync?subject=<s> selects the namespace; absent → "ode".
 *   "progress:<google sub>"  — legacy pre-namespace ode records: kept as
 *       a read-only fallback and lazily copied into "progress:ode:<sub>"
 *       on first read, so no student progress is ever stranded.
 *   "session:<sha256 hex>"   { sub, email, createdAt }  (30-day TTL)
 *       — deliberately subject-agnostic: identity is one sign-in across
 *       every curriculum; only progress data is track-scoped.
 *   "lead:<iso>_<rand>"      { name, email, message, ip, submittedAt }  (90-day TTL)
 */

const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
const CLOCK_SKEW_S = 60;
const MAX_BODY_BYTES = 128 * 1024;
const JWKS_TTL_MS = 60 * 60 * 1000;

/* ---- Subject namespaces ------------------------------------------------- */

/* Progress keys carry an explicit curriculum segment so parallel tracks
   (linear algebra, calculus, ...) can never cross-pollute. Adding a track
   is a one-line append to the registry; anything not registered is a 400,
   so a hostile query string cannot mint unbounded KV namespaces. */
const KNOWN_SUBJECTS = ["ode", "lin_alg", "calc"];
const DEFAULT_SUBJECT = "ode";
const PROGRESS_KV_PREFIX = "progress:";

function progressKey(subject, sub) {
    return PROGRESS_KV_PREFIX + subject + ":" + sub;
}

/* Pre-namespace key shape ("progress:<sub>", no subject segment) — the
   installed base. Never written anymore; read as a fallback and lazily
   copied into the ode namespace by handleSync. */
function legacyProgressKey(sub) {
    return PROGRESS_KV_PREFIX + sub;
}

const SESSION_TOKEN_PREFIX = "odesess_";
const SESSION_KV_PREFIX = "session:";
const SESSION_TTL_S = 30 * 24 * 60 * 60;
/* odesess_ + base64url(32 bytes) is 51 chars; anything far past that is
   hostile input and is rejected before it reaches a KV lookup. */
const SESSION_TOKEN_MAX_LENGTH = 128;

/* Module-scope JWKS cache; persists across requests on a warm isolate and
   falls back to a refetch when Google rotates keys (unknown kid). */
let jwksCache = { byKid: null, fetchedAt: 0 };

function b64urlToBytes(part) {
    const padded = part.replace(/-/g, "+").replace(/_/g, "/") +
        "===".slice((part.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

function decodeJwtSection(part) {
    return JSON.parse(new TextDecoder().decode(b64urlToBytes(part)));
}

async function fetchJwks() {
    const res = await fetch(GOOGLE_JWKS_URL);
    if (!res.ok) throw new Error("JWKS fetch failed: " + res.status);
    const { keys } = await res.json();
    const byKid = new Map();
    for (const jwk of keys || []) {
        if (jwk.kty === "RSA" && jwk.kid) byKid.set(jwk.kid, jwk);
    }
    jwksCache = { byKid, fetchedAt: Date.now() };
    return byKid;
}

async function getGoogleVerifyKey(kid) {
    let byKid = jwksCache.byKid;
    const stale = !byKid || Date.now() - jwksCache.fetchedAt > JWKS_TTL_MS;
    if (stale || !byKid.has(kid)) byKid = await fetchJwks();
    const jwk = byKid.get(kid);
    if (!jwk) return null;
    return crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"]
    );
}

/* Verifies a Google ID token; returns { sub, email } or throws. */
async function verifyGoogleIdToken(token, env) {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("malformed token");

    let header, payload;
    try {
        header = decodeJwtSection(parts[0]);
        payload = decodeJwtSection(parts[1]);
    } catch {
        throw new Error("malformed token");
    }
    if (header.alg !== "RS256") throw new Error("unexpected alg");

    const key = await getGoogleVerifyKey(header.kid);
    if (!key) throw new Error("unknown signing key");

    const valid = await crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        key,
        b64urlToBytes(parts[2]),
        new TextEncoder().encode(parts[0] + "." + parts[1])
    );
    if (!valid) throw new Error("bad signature");

    const now = Date.now() / 1000;
    if (!GOOGLE_ISSUERS.includes(payload.iss)) throw new Error("bad issuer");
    if (payload.aud !== env.GOOGLE_CLIENT_ID) throw new Error("bad audience");
    if (typeof payload.exp !== "number" || payload.exp < now - CLOCK_SKEW_S) {
        throw new Error("expired");
    }
    if (typeof payload.nbf === "number" && payload.nbf > now + CLOCK_SKEW_S) {
        throw new Error("not yet valid");
    }
    if (!payload.sub) throw new Error("missing subject");

    return { sub: payload.sub, email: payload.email || null };
}

/* ---- Edge session tokens ----------------------------------------------- */

function bytesToB64url(bytes) {
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256Hex(text) {
    const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(text)
    );
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

/* Issues an opaque 256-bit session token for a Google-verified identity and
   caches its hash in KV for 30 days. The plaintext token exists only in the
   response to the client; KV holds the SHA-256 hash as the lookup key. */
async function mintSession(identity, env) {
    const raw = new Uint8Array(32);
    crypto.getRandomValues(raw);
    const token = SESSION_TOKEN_PREFIX + bytesToB64url(raw);
    const record = {
        sub: identity.sub,
        email: identity.email,
        createdAt: new Date().toISOString()
    };
    await env.ODE_PROGRESS_KV.put(
        SESSION_KV_PREFIX + (await sha256Hex(token)),
        JSON.stringify(record),
        { expirationTtl: SESSION_TTL_S }
    );
    return {
        token,
        expiresAt: new Date(Date.now() + SESSION_TTL_S * 1000).toISOString()
    };
}

/* Validates a presented session token against its hashed KV record; returns
   { sub, email } or throws. Tampered, truncated, or expired tokens all miss
   the hash lookup and surface as the same 401 to the caller. */
async function verifySessionToken(token, env) {
    if (token.length > SESSION_TOKEN_MAX_LENGTH) {
        throw new Error("malformed session token");
    }
    const record = await env.ODE_PROGRESS_KV.get(
        SESSION_KV_PREFIX + (await sha256Hex(token)),
        "json"
    );
    if (!record || !record.sub) throw new Error("unknown or expired session");
    return { sub: record.sub, email: record.email || null };
}

/* ---- Progress sanitization -------------------------------------------- */

const MAX_ID_LENGTH = 160;
const MAX_LIST_ITEMS = 4000;
const MAX_MAP_ENTRIES = 2000;
const MAX_DETAIL_JSON = 2048;

function cleanId(value) {
    return typeof value === "string" && value.length > 0 &&
        value.length <= MAX_ID_LENGTH ? value : null;
}

function cleanStringList(value) {
    if (!Array.isArray(value)) return [];
    const out = [];
    const seen = new Set();
    for (const item of value) {
        const id = cleanId(item);
        if (id && !seen.has(id)) {
            seen.add(id);
            out.push(id);
            if (out.length >= MAX_LIST_ITEMS) break;
        }
    }
    return out;
}

function isPlainObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/* Whitelists the ode_* progress keys and clamps every entry so a hostile or
   corrupted client can never store unbounded or foreign data. */
function sanitizeProgress(raw) {
    if (!isPlainObject(raw)) return null;
    const out = {
        ode_watched_videos: cleanStringList(raw.ode_watched_videos),
        ode_passed_checkpoints: {},
        ode_quiz_progress: {}
    };

    if (isPlainObject(raw.ode_passed_checkpoints)) {
        let count = 0;
        for (const [k, v] of Object.entries(raw.ode_passed_checkpoints)) {
            if (!cleanId(k)) continue;
            const detail = JSON.stringify(v === undefined ? true : v);
            if (detail && detail.length <= MAX_DETAIL_JSON) {
                out.ode_passed_checkpoints[k] = JSON.parse(detail);
                if (++count >= MAX_MAP_ENTRIES) break;
            }
        }
    }

    if (isPlainObject(raw.ode_quiz_progress)) {
        let count = 0;
        for (const [k, v] of Object.entries(raw.ode_quiz_progress)) {
            if (!cleanId(k)) continue;
            out.ode_quiz_progress[k] = cleanStringList(v);
            if (++count >= MAX_MAP_ENTRIES) break;
        }
    }

    if (raw.ode_learning_mode === "exploration" || raw.ode_learning_mode === "guided") {
        out.ode_learning_mode = raw.ode_learning_mode;
    }
    if (["light", "dark", "system"].includes(raw.ode_theme_preference)) {
        out.ode_theme_preference = raw.ode_theme_preference;
    }
    return out;
}

/* ---- HTTP plumbing ----------------------------------------------------- */

function json(status, body, extraHeaders) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            ...extraHeaders
        }
    });
}

/* ---- Edge rate limiting ------------------------------------------------- */

/* Fixed-window counters held in isolate memory. Deliberately not KV-backed:
   a KV read+write per request would double the endpoint's latency and cost
   to defend against abuse that per-isolate counters already absorb. Sync is
   generous (the real client debounces at 2.5 s ≈ 24 req/min); contact is
   tight because humans submit a form once. */
const RATE_LIMITS = {
    sync: { limit: 60, windowS: 60 },
    contact: { limit: 5, windowS: 60 }
};
/* Sweep threshold keeps a scanning attacker with rotating IPs from growing
   the bucket map without bound inside a long-lived isolate. */
const RATE_BUCKET_SWEEP_SIZE = 4096;
const rateBuckets = new Map();

/* Counts the request against its route:ip window. Returns 0 when allowed,
   or the whole seconds remaining in the window (a ready-made Retry-After)
   when the caller should refuse with 429. */
function rateLimitRetryAfter(route, request) {
    const { limit, windowS } = RATE_LIMITS[route];
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const key = route + ":" + ip;
    const now = Date.now();
    if (rateBuckets.size >= RATE_BUCKET_SWEEP_SIZE) {
        for (const [k, bucket] of rateBuckets) {
            if (bucket.resetAt <= now) rateBuckets.delete(k);
        }
    }
    let bucket = rateBuckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
        bucket = { count: 0, resetAt: now + windowS * 1000 };
        rateBuckets.set(key, bucket);
    }
    bucket.count++;
    if (bucket.count <= limit) return 0;
    return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
}

function tooManyRequests(retryAfterS) {
    return json(429, { error: "Too many requests. Please slow down." },
        { "Retry-After": String(retryAfterS) });
}

/* Declared-size guard: rejects an oversized upload from the headers alone,
   before the body stream is ever read into memory. */
function declaredLengthExceeds(request, maxBytes) {
    const declared = Number(request.headers.get("Content-Length"));
    return Number.isFinite(declared) && declared > maxBytes;
}

function isJsonRequest(request) {
    const contentType = request.headers.get("Content-Type") || "";
    return contentType.toLowerCase().includes("application/json");
}

async function handleSync(request, env, url) {
    if (request.method !== "GET" && request.method !== "POST" &&
        request.method !== "DELETE") {
        return new Response(null,
            { status: 405, headers: { Allow: "GET, POST, DELETE" } });
    }
    if (!env.ODE_PROGRESS_KV || !env.GOOGLE_CLIENT_ID) {
        return json(500, { error: "Sync service is not configured." });
    }

    /* Rate-limit before auth so a flood cannot burn RS256 verifications
       or KV session lookups. */
    const retryAfterS = rateLimitRetryAfter("sync", request);
    if (retryAfterS) return tooManyRequests(retryAfterS);

    /* Subject context for the GET/POST data routes. Absent or empty means
       "ode", so every deployed client predating the namespace keeps
       working untouched. DELETE is exempt: sign-out revokes the identity,
       which is shared across all subject tracks. */
    let subject = DEFAULT_SUBJECT;
    if (request.method !== "DELETE") {
        const requested = url.searchParams.get("subject");
        if (requested !== null && requested !== "") {
            if (!KNOWN_SUBJECTS.includes(requested)) {
                return json(400, { error: "Unknown subject track." });
            }
            subject = requested;
        }
    }

    const auth = request.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) {
        return json(401, { error: "Missing bearer credential." });
    }
    const token = auth.slice(7).trim();

    /* Hard sign-out. Only odesess_* bearers are revocable — a Google ID
       token carries no server-side state, so presenting one here is a
       client bug and gets a 400 rather than a silent no-op. The session is
       verified before deletion so an unknown, expired, or already-revoked
       token surfaces as the same 401 the client's re-auth fallback already
       handles. The KV delete is wrapped separately: a storage fault must
       become a clean 500 for this request, never an escape into the
       routing pipeline. */
    if (request.method === "DELETE") {
        if (!token.startsWith(SESSION_TOKEN_PREFIX)) {
            return json(400, { error: "Sign-out requires an odesess_* session token." });
        }
        try {
            await verifySessionToken(token, env);
        } catch (err) {
            return json(401, { error: "Invalid credential.", detail: String(err.message || err) });
        }
        try {
            await env.ODE_PROGRESS_KV.delete(
                SESSION_KV_PREFIX + (await sha256Hex(token)));
        } catch (err) {
            console.error("Session revocation failed:",
                err instanceof Error ? err.name : "unknown");
            return json(500, { error: "Sign-out could not be completed. Please retry." });
        }
        return json(200, { ok: true });
    }

    /* Extended verification: an odesess_* bearer validates directly against
       its hashed KV session record; anything else must be a full Google ID
       token, which — once cryptographically verified — is exchanged for a
       fresh 30-day edge session returned alongside the sync payload. */
    let identity;
    let mintedSession = null;
    try {
        if (token.startsWith(SESSION_TOKEN_PREFIX)) {
            identity = await verifySessionToken(token, env);
        } else {
            identity = await verifyGoogleIdToken(token, env);
            mintedSession = await mintSession(identity, env);
        }
    } catch (err) {
        return json(401, { error: "Invalid credential.", detail: String(err.message || err) });
    }

    const kvKey = progressKey(subject, identity.sub);

    if (request.method === "GET") {
        let record = await env.ODE_PROGRESS_KV.get(kvKey, "json");
        /* Lazy lossless migration of the installed base: an ode read that
           misses the namespaced key falls back to the pre-namespace record
           and copies it forward, so returning students see their progress
           on the very first request after this deploy. The legacy record
           is left in place — the fallback stays idempotent and a rollback
           to the old worker would still find its data. */
        if (!record && subject === DEFAULT_SUBJECT) {
            const legacy = await env.ODE_PROGRESS_KV.get(
                legacyProgressKey(identity.sub), "json");
            if (legacy) {
                record = legacy;
                await env.ODE_PROGRESS_KV.put(kvKey, JSON.stringify(legacy));
            }
        }
        const body = {
            progress: (record && record.progress) || null,
            updatedAt: (record && record.updatedAt) || null
        };
        if (mintedSession) body.session = mintedSession;
        return json(200, body);
    }

    if (!isJsonRequest(request)) {
        return json(415, { error: "Body must be application/json." });
    }
    if (declaredLengthExceeds(request, MAX_BODY_BYTES)) {
        return json(413, { error: "Progress payload too large." });
    }
    const bodyText = await request.text();
    if (bodyText.length > MAX_BODY_BYTES) {
        return json(413, { error: "Progress payload too large." });
    }
    let parsed;
    try {
        parsed = JSON.parse(bodyText);
    } catch {
        return json(400, { error: "Body must be valid JSON." });
    }
    if (!isPlainObject(parsed)) {
        return json(400, { error: "Body must be a JSON object." });
    }
    const progress = sanitizeProgress(parsed.progress !== undefined ? parsed.progress : parsed);
    if (progress === null) {
        return json(400, { error: "Progress must be a JSON object." });
    }

    const record = {
        progress,
        email: identity.email,
        updatedAt: new Date().toISOString()
    };
    await env.ODE_PROGRESS_KV.put(kvKey, JSON.stringify(record));
    const response = { ok: true, updatedAt: record.updatedAt };
    if (mintedSession) response.session = mintedSession;
    return json(200, response);
}

/* ---- Form-session timing tokens ---------------------------------------- *
 *
 * A stateless, cryptographically verifiable anti-flood gate layered UNDER
 * Turnstile on the /api/contact path. When rendering a storefront page the
 * Worker's HTMLRewriter (handleStorefront) stamps a hidden form input with a
 * token of the form "<issuedAtMs>.<base64url(HMAC-SHA256(issuedAtMs))>",
 * signed with the FORM_SESSION_SECRET Worker secret. On submit the handler
 * recomputes the HMAC and requires the token's age to clear a realistic human
 * reading window (>= 2.5 s) and stay under a bound (2 h), which drops the
 * high-frequency manual form flooding and instant scripted posts that a fresh
 * Turnstile token alone would still let through.
 *
 * Stateless BY DESIGN (no KV): the signature is self-authenticating, so there
 * is no per-render server state to store or sweep, mirroring the deliberately
 * non-KV rate limiter and lead-dedup gates above. The secret NEVER appears in
 * the repo or wrangler.jsonc vars — it is provisioned with:
 *   npx wrangler secret put FORM_SESSION_SECRET
 * Absent the secret the gate is INERT end to end (no injection, no check), so
 * lead capture is completely unaffected and a stale cached page can never be
 * rejected — the same graceful-degradation contract as EMAIL_API_KEY. */
const FORM_SESSION_MIN_FILL_MS = 2500;
const FORM_SESSION_MAX_AGE_MS = 2 * 60 * 60 * 1000;
/* "<=15-digit ms>." + 43-char base64url HMAC-SHA256 is 59 chars; anything far
   past that is hostile input and is rejected before the HMAC is ever run. */
const FORM_SESSION_TOKEN_MAX_LENGTH = 256;

async function hmacSha256B64url(secret, message) {
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const sig = await crypto.subtle.sign(
        "HMAC", key, new TextEncoder().encode(message));
    return bytesToB64url(new Uint8Array(sig));
}

/* Mints a fresh timing token stamped at nowMs. The timestamp is inside the
   signed payload, so a client cannot backdate it to fake a longer dwell. */
async function issueFormSessionToken(secret, nowMs) {
    const ts = String(nowMs);
    return ts + "." + (await hmacSha256B64url(secret, ts));
}

/* Constant-time string compare so a forged signature cannot be recovered byte
   by byte from response-timing. Unequal lengths short-circuit — the only
   information that leaks is that the lengths differ, never content. */
function timingSafeStrEqual(a, b) {
    if (typeof a !== "string" || typeof b !== "string" ||
        a.length !== b.length) {
        return false;
    }
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
}

/* Validates a presented timing token against FORM_SESSION_SECRET and the
   human-dwell window. Returns { ok, reason }; every failure mode (absent,
   malformed, forged signature, too fast, expired) surfaces as the same
   generic rejection to the caller — only the reason is logged. */
async function verifyFormSessionToken(token, secret, nowMs) {
    if (typeof token !== "string" || token.length === 0 ||
        token.length > FORM_SESSION_TOKEN_MAX_LENGTH) {
        return { ok: false, reason: "missing" };
    }
    const dot = token.indexOf(".");
    if (dot <= 0 || dot === token.length - 1) {
        return { ok: false, reason: "malformed" };
    }
    const tsPart = token.slice(0, dot);
    const sigPart = token.slice(dot + 1);
    /* Bound the digit count so Number() can never lose precision on the
       timestamp and so a giant numeric string cannot reach the HMAC. */
    if (!/^[0-9]{1,15}$/.test(tsPart)) {
        return { ok: false, reason: "malformed" };
    }
    const expected = await hmacSha256B64url(secret, tsPart);
    if (!timingSafeStrEqual(sigPart, expected)) {
        return { ok: false, reason: "bad-signature" };
    }
    const age = nowMs - Number(tsPart);
    if (age < FORM_SESSION_MIN_FILL_MS) return { ok: false, reason: "too-fast" };
    if (age > FORM_SESSION_MAX_AGE_MS) return { ok: false, reason: "expired" };
    return { ok: true };
}

/* ---- Lead generation: POST /api/contact --------------------------------- */

const TURNSTILE_VERIFY_URL =
    "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const CONTACT_MAX_BODY_BYTES = 16 * 1024;
const CONTACT_FIELD_LIMITS = { name: 100, email: 254, message: 4000 };
/* Turnstile documents its response token at up to 2048 characters. */
const TURNSTILE_TOKEN_MAX_LENGTH = 2048;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEAD_KV_PREFIX = "lead:";
const LEAD_TTL_S = 90 * 24 * 60 * 60;
/* Lead-notification email routing, delivered through the Brevo
   transactional v3 REST API. The credential is a Worker secret (never in
   vars or the repo): npx wrangler secret put EMAIL_API_KEY. When the
   secret is missing, the notification is skipped and lead capture is
   completely unaffected. */
const BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";
const LEAD_NOTIFY_FROM = { name: "Staples Education Notifications", email: "notifications@stapleseducation.com" };
const LEAD_NOTIFY_TO = [{ email: "addstaples@gmail.com", name: "Adam Staples" }];

/* ---- In-isolate lead de-duplication ------------------------------------- *
 * A single verified lead can reach us more than once in quick succession: a
 * double click on submit, or a client retry after a slow siteverify round
 * trip (the retry fetches a fresh Turnstile token, so it passes human
 * verification on its own merits). Left alone, each copy cuts another
 * lead:<iso> KV record and fires another owner-notification email.
 *
 * This gate collapses those bursts with a short-TTL map in isolate memory,
 * keyed on the SHA-256 of the normalized name/email/message. Mirroring the
 * rate limiter above, it is deliberately NOT KV-backed: an extra KV read per
 * submit is exactly the persistent-layer overhead this shields against, and a
 * warm isolate absorbs the rapid duplicates that motivate it. Only the
 * content hash is held, never the lead text (blinded). Duplicates that land
 * on a different isolate, or arrive past the TTL, fall through to the durable
 * path -- the goal is collapsing bursts, not global exactly-once. The hash is
 * recorded only AFTER a successful KV write, so a failed write never
 * suppresses the client's legitimate retry. */
const LEAD_DEDUP_TTL_MS = 10 * 60 * 1000;
const LEAD_DEDUP_SWEEP_SIZE = 4096;
const recentLeadHashes = new Map();

function leadSeenRecently(contentHash) {
    const now = Date.now();
    if (recentLeadHashes.size >= LEAD_DEDUP_SWEEP_SIZE) {
        for (const [k, expiresAt] of recentLeadHashes) {
            if (expiresAt <= now) recentLeadHashes.delete(k);
        }
    }
    const expiresAt = recentLeadHashes.get(contentHash);
    return typeof expiresAt === "number" && expiresAt > now;
}

function rememberLeadHash(contentHash) {
    recentLeadHashes.set(contentHash, Date.now() + LEAD_DEDUP_TTL_MS);
}

/* Content-blinded idempotency key for a sanitized lead. NUL separators keep
   field boundaries unambiguous (name "ab" + email "c" never collides with
   name "a" + email "bc"); the email is lowercased so a case-variant resend of
   the same address still collapses. */
async function leadContentHash(lead) {
    return sha256Hex(
        lead.name + "\0" + lead.email.toLowerCase() + "\0" + lead.message
    );
}

/* Server-side Turnstile verification. The secret NEVER appears in the
   codebase or wrangler.jsonc vars — it is a Worker secret provisioned with:
   npx wrangler secret put TURNSTILE_SECRET_KEY */
async function verifyTurnstile(token, ip, env) {
    const params = new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token
    });
    if (ip) params.set("remoteip", ip);
    const res = await fetch(TURNSTILE_VERIFY_URL, {
        method: "POST",
        body: params
    });
    if (!res.ok) throw new Error("siteverify unreachable: " + res.status);
    const outcome = await res.json();
    return outcome && outcome.success === true;
}

/* Strict payload shape: exactly the string fields the landing-page form
   sends, each trimmed and length-capped. Returns the clean lead or null. */
function sanitizeLead(raw) {
    if (!isPlainObject(raw)) return null;
    const lead = {};
    for (const [field, max] of Object.entries(CONTACT_FIELD_LIMITS)) {
        const value = raw[field];
        if (typeof value !== "string") return null;
        const trimmed = value.trim();
        if (trimmed.length === 0 || trimmed.length > max) return null;
        lead[field] = trimmed;
    }
    if (!EMAIL_PATTERN.test(lead.email)) return null;
    return lead;
}

/* Minimal HTML entity escape for lead fields interpolated into the
   notification email body — the message is student-controlled text. */
function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

/* Email the owner about a captured lead. Best-effort by design: the lead is
   already durable in KV before this runs, so every failure path here is
   logged (error code only, never lead contents) and swallowed — the student
   always keeps their 200. */
async function sendLeadNotification(lead, env) {
    if (!env.EMAIL_API_KEY) {
        console.log("Lead notification skipped: EMAIL_API_KEY secret not configured");
        return;
    }
    /* sanitizeLead only trims ends; strip interior CR/LF so a crafted name
       can never smuggle extra headers into the Subject or Reply-To lines. */
    const safeName = lead.name.replace(/[\r\n]+/g, " ");
    try {
        const res = await fetch(BREVO_SEND_URL, {
            method: "POST",
            headers: {
                "api-key": env.EMAIL_API_KEY,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: LEAD_NOTIFY_FROM,
                to: LEAD_NOTIFY_TO,
                replyTo: { email: lead.email, name: safeName },
                /* Belt and suspenders for Gmail's reply-target resolution:
                   some clients only honor a strictly formatted Reply-To
                   header. Display-name is CR/LF-stripped and quoted per
                   RFC 5322 (inner double quotes downgraded) so a crafted
                   name cannot break out of the address spec. */
                headers: {
                    "Reply-To": "\"" + safeName.replace(/"/g, "'") + "\" <" + lead.email + ">"
                },
                subject: "New student inquiry from " + safeName,
                textContent: "New student inquiry via stapleseducation.com\n\n" +
                    "Name: " + lead.name + "\nEmail: " + lead.email +
                    "\n\n" + lead.message,
                htmlContent: "<h2>New student inquiry</h2>" +
                    "<p><strong>Name:</strong> " + escapeHtml(lead.name) + "<br>" +
                    "<strong>Email:</strong> " + escapeHtml(lead.email) + "</p>" +
                    "<p style=\"white-space:pre-wrap\">" + escapeHtml(lead.message) + "</p>"
            })
        });
        /* Log status only — a Brevo error body could echo lead contents,
           and Worker logs must stay PII-free. */
        if (res.ok) {
            console.log("Lead notification email accepted by Brevo:", res.status);
        } else {
            console.error("Lead notification email rejected by Brevo:", res.status);
        }
    } catch (e) {
        console.error("Lead notification email failed:", e instanceof Error ? e.name : "unknown");
    }
}

async function handleContact(request, env, ctx) {
    if (request.method !== "POST") {
        return new Response(null, { status: 405, headers: { Allow: "POST" } });
    }
    if (!env.ODE_PROGRESS_KV || !env.TURNSTILE_SECRET_KEY) {
        console.error("Configuration error: Missing KV or Secret Key");
        return json(503, { error: "Contact service is not configured." });
    }

    const retryAfterS = rateLimitRetryAfter("contact", request);
    if (retryAfterS) return tooManyRequests(retryAfterS);

    if (!isJsonRequest(request)) {
        return json(415, { error: "Body must be application/json." });
    }
    if (declaredLengthExceeds(request, CONTACT_MAX_BODY_BYTES)) {
        return json(413, { error: "Inquiry payload too large." });
    }
    const bodyText = await request.text();
    if (bodyText.length > CONTACT_MAX_BODY_BYTES) {
        return json(413, { error: "Inquiry payload too large." });
    }
    let parsed;
    try {
        parsed = JSON.parse(bodyText);
    } catch {
        return json(400, { error: "Body must be valid JSON." });
    }

    /* Log outcomes and shapes only — never lead contents or raw payloads.
       Worker logs are a second data store; student PII must not land there. */
    const lead = sanitizeLead(parsed);
    console.log("Lead sanitization result:", lead === null ? "rejected" : "ok");
    if (lead === null) {
        console.log("Sanitization rejected payload with keys:",
            isPlainObject(parsed) ? Object.keys(parsed).join(",") : typeof parsed);
        return json(400, {
            error: "Please provide a valid name, email, and message."
        });
    }

    const turnstileToken = parsed.turnstileToken;
    if (typeof turnstileToken !== "string" || turnstileToken.length === 0 ||
        turnstileToken.length > TURNSTILE_TOKEN_MAX_LENGTH) {
        console.log("Missing or invalid Turnstile token");
        return json(400, { error: "Missing human-verification token." });
    }

    /* Form-session timing gate (defense in depth). Checked before the
       siteverify network round trip so an instant scripted post or a manual
       flood is dropped as cheaply as possible. Inert unless the secret is
       provisioned, so a page served (or cached) before this rolled out — one
       carrying no timing token — is never rejected. */
    if (env.FORM_SESSION_SECRET) {
        const verdict = await verifyFormSessionToken(
            parsed.formSessionToken, env.FORM_SESSION_SECRET, Date.now());
        if (!verdict.ok) {
            console.log("Form-session token rejected:", verdict.reason);
            return json(400, {
                error: "Please take a moment to complete the form, then send again."
            });
        }
    }

    const ip = request.headers.get("CF-Connecting-IP") || null;
    let human;
    try {
        human = await verifyTurnstile(turnstileToken, ip, env);
        console.log("Turnstile verification result:", human);
    } catch (e) {
        console.error("Turnstile verification exception:", e);
        return json(502, { error: "Verification service unavailable. Please retry." });
    }
    if (!human) {
        console.log("Human verification failed");
        return json(403, { error: "Human verification failed. Please retry the check." });
    }

    /* Collapse a rapid duplicate of this exact verified lead before it can cut
       a second KV record or fire a second notification email. Placed after
       human verification so an unverified spammer can never probe or poison
       the dedup map, and so a genuine retry (which re-earns a token) is what
       we collapse. */
    const contentHash = await leadContentHash(lead);
    if (leadSeenRecently(contentHash)) {
        console.log("Duplicate lead collapsed before KV write");
        return json(200, { ok: true, deduped: true });
    }

    const suffix = new Uint8Array(6);
    crypto.getRandomValues(suffix);
    const key = LEAD_KV_PREFIX + new Date().toISOString() + "_" +
        Array.from(suffix).map((b) => b.toString(16).padStart(2, "0")).join("");
    
    try {
        console.log("Attempting KV put for key:", key);
        await env.ODE_PROGRESS_KV.put(
            key,
            JSON.stringify({ ...lead, ip, submittedAt: new Date().toISOString() }),
            { expirationTtl: LEAD_TTL_S }
        );
        console.log("KV put successful");
        /* Only now is the lead durable, so only now do we arm the dedup gate
           against its near-term duplicates. A failed put above never records
           the hash, leaving the client free to retry. */
        rememberLeadHash(contentHash);
    } catch (e) {
        console.error("KV put failed:", e);
        return json(500, { error: "Failed to save inquiry." });
    }

    /* Owner notification rides after the response via ctx.waitUntil so it
       never adds latency to the student's submit. The test harness invokes
       fetch without a ctx — there the promise floats, and it is safe to
       float because sendLeadNotification catches all of its own failures. */
    const notified = sendLeadNotification(lead, env);
    if (ctx) ctx.waitUntil(notified);

    return json(200, { ok: true });
}

/* ---- Programmatic SEO: unit-targeted metadata for the ODE SPA ----------- *
 *
 * The roadmap SPA is one static document at /ode/, but its curriculum spans
 * 19 first-principles units. A crawler that lands on /ode/?unit=N should see
 * <title>/<meta description> written for that unit's concept, not the generic
 * shell copy. This map is the source of truth for that substitution; keys are
 * the ?unit= selector value (string), matching the curriculum unit numbers in
 * content/curriculum.json. Copy obeys the §1 constraint: no em-dashes, no
 * ampersands (WEBSITE_BLUEPRINT Maintenance Contract rule 3).
 *
 * Each block also carries a `lastmod` (ISO-8601 YYYY-MM-DD) feeding the
 * sitemap's per-unit <lastmod>. The value is the git last-commit date of that
 * unit's content package source (`scripts/unitN_data.json`, the per-unit data
 * that content/units/unit-NN was migrated from) — an accurate, reproducible
 * per-unit authoring date. Most units share the Content API v1 date, while the
 * later-track units (1, 14-18) retain their earlier authoring date, so the
 * sitemap reports genuine per-unit history. sitemapUrlEntry() falls back to the
 * global SITEMAP_LASTMOD if any block ever omits lastmod.
 *
 * This runs only because wrangler.jsonc lists "/ode/" in assets.run_worker_first,
 * so the Worker sees the request before the asset server does; see the ODE SEO
 * metadata layer note in WEBSITE_BLUEPRINT.md (Pillar 1). */
const ODE_SEO_SUFFIX = " | ODE Roadmap by Staples Education";
/* Prototype-blank lookup table (Object.create(null)): the ?unit= selector is
   attacker-controlled, so a hostile value such as "constructor", "__proto__",
   "toString", or "hasOwnProperty" must resolve to undefined rather than an
   inherited Object.prototype member that would mint a phantom unit route with
   garbage metadata. With no prototype chain the direct ODE_UNIT_SEO[unitParam]
   lookup in handleOdeSeo is inherently safe. Frozen against mutation. */
const ODE_UNIT_SEO = Object.freeze(Object.assign(Object.create(null), {
    "0": { title: "Unit 0: What Are Differential Equations", description: "Learn what a differential equation actually is from first principles: an equation relating a function to its own rate of change, and why that idea models the world.", lastmod: "2026-07-03" },
    "1": { title: "Unit 1: Foundations and Prerequisites", description: "Rebuild the calculus and algebra foundations every differential equations course assumes, so derivatives, integrals, and functions feel like tools you own.", lastmod: "2026-06-27" },
    "2": { title: "Unit 2: First Order Linear Differential Equations", description: "Master first order linear equations from the ground up: integrating factors, the structure of the general solution, and why the method actually works.", lastmod: "2026-07-03" },
    "3": { title: "Unit 3: Existence, Uniqueness, and Geometry", description: "Understand when a differential equation has exactly one solution, and read solution behavior straight from slope fields before solving anything.", lastmod: "2026-07-03" },
    "4": { title: "Unit 4: Autonomous Equations, Equilibrium, and Stability", description: "Analyze autonomous equations through their equilibria and stability, predicting long term behavior from the sign of the rate of change alone.", lastmod: "2026-07-03" },
    "5": { title: "Unit 5: Numerical Methods", description: "Approximate solutions you cannot solve by hand. Build Euler and Runge Kutta methods from the definition of the derivative and control their error.", lastmod: "2026-07-03" },
    "6": { title: "Unit 6: Multivariable Calculus Foundations", description: "The partial derivatives, gradients, and exact differentials you need before exact equations and systems, developed from first principles.", lastmod: "2026-07-03" },
    "7": { title: "Unit 7: First-Order Exactness and Methods", description: "Recognize exact equations, recover potential functions, and apply integrating factors, all grounded in the multivariable calculus that makes them work.", lastmod: "2026-07-03" },
    "8": { title: "Unit 8: Special Equations and Classical Models", description: "Solve Bernoulli, homogeneous, and classical model equations with the substitutions that turn hard nonlinear forms into ones you already know.", lastmod: "2026-07-03" },
    "9": { title: "Unit 9: Second-Order Linear Equations, Theory and Structure", description: "The structure behind second order linear equations: linear independence, the Wronskian, and why two solutions span every solution.", lastmod: "2026-07-03" },
    "10": { title: "Unit 10: Nonhomogeneous Equations and Forced Response", description: "Build the full solution to a forced linear equation as its homogeneous part plus one particular response, via undetermined coefficients and variation of parameters.", lastmod: "2026-07-03" },
    "11": { title: "Unit 11: Mechanical Vibrations and Oscillators", description: "Watch second order linear equations become real oscillators: damping, resonance, and forced vibration derived from Newton's second law.", lastmod: "2026-07-03" },
    "12": { title: "Unit 12: The Laplace Transform", description: "Turn differential equations into algebra with the Laplace transform, from its integral definition through initial value problems and discontinuous forcing.", lastmod: "2026-07-03" },
    "13": { title: "Unit 13: Series Solutions", description: "Solve equations with variable coefficients using power series, learning where a series solution converges and how ordinary and singular points differ.", lastmod: "2026-07-03" },
    "14": { title: "Unit 14: Linear Algebra Foundations for Systems", description: "The vectors, matrices, eigenvalues, and eigenvectors that systems of differential equations are built on, developed from first principles.", lastmod: "2026-06-27" },
    "15": { title: "Unit 15: Systems of Linear Differential Equations", description: "Solve systems of linear differential equations through eigenvalues and eigenvectors, reading coupled behavior as motion in a vector space.", lastmod: "2026-06-27" },
    "16": { title: "Unit 16: Phase Plane Analysis and Nonlinear Dynamics", description: "Classify equilibria in the phase plane and linearize nonlinear systems, reading stability and long term dynamics straight from the geometry.", lastmod: "2026-06-27" },
    "17": { title: "Unit 17: Boundary Value Problems and Sturm-Liouville Theory", description: "Move from initial value to boundary value problems, discovering eigenvalues, eigenfunctions, and the orthogonality that Sturm Liouville theory guarantees.", lastmod: "2026-06-27" },
    "18": { title: "Unit 18: Fourier Series and Partial Differential Equations", description: "Represent functions as Fourier series and separate variables to solve the heat, wave, and Laplace equations from first principles.", lastmod: "2026-06-27" }
}));

/* ---- Dynamic sitemap: index + child sitemaps ---------------------------- *
 *
 * /sitemap.xml is a <sitemapindex> pointing at three child <urlset> documents,
 * split by content family so each stays small, cacheable, and independently
 * recrawlable, and so the whole set scales far under the 50,000-URL / 50 MiB
 * per-file protocol ceiling as the parametric matrix grows:
 *
 *   /sitemap-core.xml   the root apex "/" and the "/ode/" SPA boundary
 *   /sitemap-units.xml  one deep-linked <url> per ODE unit (/ode/?unit=N)
 *   /sitemap-geo.xml    every curated + parametric Geo-SEO landing slug
 *
 * The children are one frozen registry (SITEMAP_CHILDREN); the index and the
 * router both read it, so adding a child sitemap is a single append that
 * self-registers in the index and gains its own route. Each child's records
 * still come from the same single sources of truth as before (ODE_UNIT_SEO,
 * allGeoSlugs), so a new unit or geo slug self-registers in its child. Every
 * <loc> — in the index and in each child — is XML-escaped (via escapeHtml,
 * whose &/</>/"/' entities are valid XML) so a future multi-parameter URL
 * cannot emit a raw ampersand. robots.txt still advertises the single
 * /sitemap.xml index, the standard crawler discovery entry point. */
const SITE_ORIGIN = "https://stapleseducation.com";
const SITEMAP_LASTMOD = "2026-07-05";

function sortedUnitNumbers() {
    return Object.keys(ODE_UNIT_SEO).map(Number).sort((a, b) => a - b);
}

/* One <url> block. lastmod is per-entry; a missing/empty value falls back to
   the global baseline SITEMAP_LASTMOD so an entry can never emit an empty
   <lastmod>. */
function sitemapUrlEntry(loc, changefreq, priority, lastmod) {
    return "  <url>\n" +
        "    <loc>" + escapeHtml(loc) + "</loc>\n" +
        "    <lastmod>" + (lastmod || SITEMAP_LASTMOD) + "</lastmod>\n" +
        "    <changefreq>" + changefreq + "</changefreq>\n" +
        "    <priority>" + priority + "</priority>\n" +
        "  </url>";
}

/* ---- Child-sitemap record sets (each a single source of truth) ---------- */

/* The two top-level pages: the site apex and the ODE SPA entry boundary. */
function coreUrlRecords() {
    return [
        { loc: SITE_ORIGIN + "/", changefreq: "weekly", priority: "1.0" },
        { loc: SITE_ORIGIN + "/ode/", changefreq: "weekly", priority: "0.8" }
    ];
}

/* One deep link per ODE unit, ascending, drawn from ODE_UNIT_SEO so a new unit
   self-registers; each carries that unit's own git-authored <lastmod>. */
function unitUrlRecords() {
    return sortedUnitNumbers().map((n) => {
        const unit = ODE_UNIT_SEO[String(n)];
        return {
            loc: SITE_ORIGIN + "/ode/?unit=" + n,
            changefreq: "weekly",
            priority: "0.7",
            lastmod: unit && unit.lastmod
        };
    });
}

/* Every Geo-SEO landing slug (curated overrides + the parametric subject x
   modality x location matrix), elevated priority (0.9) and a monthly
   changefreq. allGeoSlugs() enumerates them from the frozen registries
   themselves, so a new subject or neighborhood self-registers the moment it is
   added to the matrix. */
function geoUrlRecords() {
    return allGeoSlugs().map((slug) => ({
        loc: SITE_ORIGIN + "/" + slug,
        changefreq: "monthly",
        priority: "0.9"
    }));
}

/* Renders a record set into a complete <urlset> child-sitemap document. */
function renderUrlset(records) {
    const entries = records.map((r) =>
        sitemapUrlEntry(r.loc, r.changefreq, r.priority, r.lastmod));
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        entries.join("\n") + "\n</urlset>";
}

/* Latest ISO-8601 lastmod across a record set, for that child's <lastmod> in
   the index; zero-padded YYYY-MM-DD compares correctly as a plain string.
   Falls back to the baseline so an index <lastmod> is never empty. */
function rollupLastmod(records) {
    let max = "";
    for (const r of records) {
        const d = r.lastmod || SITEMAP_LASTMOD;
        if (d > max) max = d;
    }
    return max || SITEMAP_LASTMOD;
}

/* The child-sitemap registry: the single source the index and the router both
   read. path is the public route; records() is the lazy record builder. */
const SITEMAP_CHILDREN = Object.freeze([
    { path: "/sitemap-core.xml", records: coreUrlRecords },
    { path: "/sitemap-units.xml", records: unitUrlRecords },
    { path: "/sitemap-geo.xml", records: geoUrlRecords }
]);

function sitemapChildByPath(pathname) {
    for (const child of SITEMAP_CHILDREN) {
        if (child.path === pathname) return child;
    }
    return null;
}

/* The <sitemapindex> served at /sitemap.xml: one <sitemap> per child, each
   <loc> XML-escaped and stamped with its record set's rolled-up <lastmod>. */
function buildSitemapIndexXml() {
    const entries = SITEMAP_CHILDREN.map((child) =>
        "  <sitemap>\n" +
        "    <loc>" + escapeHtml(SITE_ORIGIN + child.path) + "</loc>\n" +
        "    <lastmod>" + rollupLastmod(child.records()) + "</lastmod>\n" +
        "  </sitemap>");
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        entries.join("\n") + "\n</sitemapindex>";
}

/* Serves /ode/ and, when a recognized ?unit= selector is present, stream-
 * rewrites only the <title> and <meta name="description"> of the returned
 * HTML with that unit's metadata. Every miss (no ASSETS binding, non-GET,
 * non-HTML, unknown unit) returns the untouched asset, so this is a pure
 * additive layer over the static shell. HTMLRewriter is a Workers-runtime
 * global referenced lazily here, so the Node test harness (which never hits
 * this path and has no env.ASSETS) parses the module without needing it. */
async function handleOdeSeo(request, env, url) {
    if (!env.ASSETS) return json(404, { error: "Not found." });
    const assetResponse = await env.ASSETS.fetch(request);

    const unitParam = url.searchParams.get("unit");
    const meta = unitParam !== null ? ODE_UNIT_SEO[unitParam] : null;
    const isHtml = (assetResponse.headers.get("Content-Type") || "")
        .toLowerCase().includes("text/html");
    if (!meta || request.method !== "GET" || !assetResponse.ok || !isHtml) {
        return assetResponse;
    }

    return new HTMLRewriter()
        .on("title", {
            element(el) { el.setInnerContent(meta.title + ODE_SEO_SUFFIX); }
        })
        .on('meta[name="description"]', {
            element(el) { el.setAttribute("content", meta.description); }
        })
        .transform(assetResponse);
}

/* ---- Local Geo-SEO landing matrix --------------------------------------- *
 *
 * Clean, keyword-anchored URL slugs for high-intent Phoenix-area
 * neighborhoods (e.g. /scottsdale-calculus-tutor). Each maps to a localized
 * <title>, meta description, and hero headline/subhead. A crawler or visitor
 * on one of these naked paths is served the SAME root storefront template,
 * stream-rewritten edge-side via HTMLRewriter with the neighborhood's copy:
 * no new page files, no duplication, and the zero-dependency landing template
 * is untouched on disk (Pillar 1 holds — the rewrite happens only at the edge).
 * Copy obeys the §1 constraint: no em-dashes, no ampersands (WEBSITE_BLUEPRINT
 * Maintenance Contract rule 3), so every headline uses commas and "and".
 *
 * The registry is a prototype-blank dictionary (Object.create(null)) AND frozen,
 * and lookups additionally go through geoRegistryEntry() which guards with
 * hasOwnProperty, so a path like /constructor or /toString can never resolve to
 * an inherited Object member and mint a phantom route. */
const GEO_SEO_SUFFIX = " | Staples Education";
const GEO_SEO_REGISTRY = Object.freeze(Object.assign(Object.create(null), {
    "scottsdale-calculus-tutor": {
        title: "Scottsdale Calculus Tutor",
        description: "Private calculus tutoring for Scottsdale students. The Math Confidence Reset framework closes foundational gaps and builds intuitive mastery from limits through integrals.",
        headline: "Scottsdale's <span class='highlight'>Calculus Confidence</span> Tutor",
        subhead: "Personalized calculus tutoring for Scottsdale students and families, built on a structured framework that turns test day pressure into genuine understanding."
    },
    "paradise-valley-math-tutor": {
        title: "Paradise Valley Math Tutor",
        description: "Premium one on one math tutoring for Paradise Valley students. We rebuild the foundations behind every grade so confidence and results follow naturally.",
        headline: "Paradise Valley's <span class='highlight'>Math Mastery</span> Tutor",
        subhead: "Focused, discreet math tutoring for Paradise Valley families, shaped around each student's exact gaps in algebra, calculus, and beyond."
    },
    "gilbert-math-tutor": {
        title: "Gilbert Math Tutor",
        description: "Expert math tutoring for Gilbert students of every level. The Math Confidence Reset framework replaces rote memorization with lasting, intuitive understanding.",
        headline: "Gilbert's <span class='highlight'>Math Confidence</span> Tutor",
        subhead: "Patient, structured math tutoring for Gilbert students, from middle school foundations through high school calculus and college coursework."
    },
    "chandler-math-tutor": {
        title: "Chandler Math Tutor",
        description: "Personalized math tutoring for Chandler students. We pinpoint the exact foundational gaps holding a grade back and rebuild them into real mastery.",
        headline: "Chandler's <span class='highlight'>Math Confidence</span> Tutor",
        subhead: "Results driven math tutoring for Chandler families, built on a first principles approach that makes every next topic easier than the last."
    },
    "tempe-calculus-tutor": {
        title: "Tempe Calculus Tutor",
        description: "Calculus and college math tutoring for Tempe and university students. Clear, first principles instruction that turns a heavy course load into steady progress.",
        headline: "Tempe's <span class='highlight'>Calculus Confidence</span> Tutor",
        subhead: "Dedicated calculus tutoring for Tempe and university students, pairing exam strategy with the deep understanding that makes it stick."
    },
    "arcadia-math-tutor": {
        title: "Arcadia Math Tutor",
        description: "Private math tutoring for Arcadia students and families. The Math Confidence Reset framework builds intuitive mastery from the foundations up.",
        headline: "Arcadia's <span class='highlight'>Math Confidence</span> Tutor",
        subhead: "Thoughtful, one on one math tutoring for Arcadia students, designed to replace anxiety with clarity at every level of the curriculum."
    },
    "ahwatukee-math-tutor": {
        title: "Ahwatukee Math Tutor",
        description: "One on one math tutoring for Ahwatukee students. We close foundational gaps and build the intuitive confidence that lifts every grade that follows.",
        headline: "Ahwatukee's <span class='highlight'>Math Confidence</span> Tutor",
        subhead: "Personalized math tutoring for Ahwatukee families, grounded in a structured framework that turns weak spots into genuine strengths."
    },
    "fountain-hills-math-tutor": {
        title: "Fountain Hills Math Tutor",
        description: "Premium private math tutoring for Fountain Hills students. Structured, first principles instruction that builds lasting mastery and real confidence.",
        headline: "Fountain Hills <span class='highlight'>Math Confidence</span> Tutor",
        subhead: "Focused math tutoring for Fountain Hills students and families, built around each learner's exact goals from algebra through calculus."
    }
}));

/* Own-property-guarded registry lookup: returns the entry or null, never an
   inherited Object.prototype member. */
function geoRegistryEntry(slug) {
    return Object.prototype.hasOwnProperty.call(GEO_SEO_REGISTRY, slug)
        ? GEO_SEO_REGISTRY[slug] : null;
}

/* Normalized naked-path slug: leading/trailing slashes stripped and
   lowercased, so /Scottsdale-Calculus-Tutor/ still resolves. */
function geoSlugFromPath(pathname) {
    return pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
}

/* ---- Parametric Geo-SEO matrix: subject x modality x location ----------- *
 *
 * The curated GEO_SEO_REGISTRY above is a hand-written override layer. Beneath
 * it sits a parametric engine that mints a landing page for every combination
 * of an approved SUBJECT and a MODALITY:
 *
 *   Modality 1  "Local Neighborhoods"  ->  one page per Phoenix-area
 *               neighborhood, slug  <neighborhood>-<subject>-tutor
 *               e.g. /scottsdale-linear-algebra-tutor
 *   Modality 2  "Online and Remote"    ->  one page, slug
 *               online-<subject>-tutor
 *               e.g. /online-discrete-math-tutor
 *
 * 13 subjects x (15 neighborhoods + 1 online token) = 208 parametric combos;
 * de-duplicated against the 8 curated overrides that live in the same slug
 * space, the sitemap emits 200+ discrete landing URLs. Both source arrays are
 * frozen (immutable), so a hostile request can never grow the matrix, and every
 * slug lookup goes through a Map (never a bare object), so an inherited Object
 * member such as /constructor-... can never resolve to a phantom route.
 *
 * Resolution order for any naked slug: curated GEO_SEO_REGISTRY first, then
 * this parametric layer (resolveGeoMeta). Generated copy obeys the §1 constraint
 * (no em-dashes, no ampersands; commas and "and"). The returned meta object has
 * the identical { title, description, headline, subhead } shape as a curated
 * entry, so handleStorefront rewrites it through the same HTMLRewriter path with
 * zero server lag. */
const SEO_SUBJECTS = Object.freeze([
    { slug: "act-math", label: "ACT Math" },
    { slug: "algebra-1", label: "Algebra 1" },
    { slug: "algebra-2", label: "Algebra 2" },
    { slug: "calculus", label: "Calculus" },
    { slug: "differential-equations", label: "Differential Equations" },
    { slug: "discrete-math", label: "Discrete Math" },
    { slug: "finite-math", label: "Finite Math" },
    { slug: "linear-algebra", label: "Linear Algebra" },
    { slug: "prealgebra", label: "Prealgebra" },
    { slug: "precalculus", label: "Precalculus" },
    { slug: "sat-math", label: "SAT Math" },
    { slug: "statistics", label: "Statistics" },
    { slug: "trigonometry", label: "Trigonometry" }
]);

/* Modality 1 targets: high-intent Phoenix-metro neighborhoods. */
const SEO_NEIGHBORHOODS = Object.freeze([
    { slug: "scottsdale", label: "Scottsdale" },
    { slug: "paradise-valley", label: "Paradise Valley" },
    { slug: "gilbert", label: "Gilbert" },
    { slug: "chandler", label: "Chandler" },
    { slug: "tempe", label: "Tempe" },
    { slug: "mesa", label: "Mesa" },
    { slug: "phoenix", label: "Phoenix" },
    { slug: "glendale", label: "Glendale" },
    { slug: "peoria", label: "Peoria" },
    { slug: "ahwatukee", label: "Ahwatukee" },
    { slug: "arcadia", label: "Arcadia" },
    { slug: "fountain-hills", label: "Fountain Hills" },
    { slug: "queen-creek", label: "Queen Creek" },
    { slug: "cave-creek", label: "Cave Creek" },
    { slug: "carefree", label: "Carefree" }
]);

/* The two modalities as an explicit immutable registry. "local" fans out over
   every SEO_NEIGHBORHOODS entry; "online" is a single location token. */
const SEO_MODALITIES = Object.freeze([
    { slug: "local", label: "Local Neighborhoods" },
    { slug: "online", label: "Online and Remote" }
]);
const ONLINE_LOCATION_SLUG = "online";

/* slug -> { label, online } for every location token: each neighborhood plus
   the single online-modality token. A Map (not a bare object) so a slug such as
   "constructor" can never resolve to an inherited Object.prototype member. */
const SEO_LOCATION_BY_SLUG = (function () {
    const m = new Map();
    for (const n of SEO_NEIGHBORHOODS) {
        m.set(n.slug, { label: n.label, online: false });
    }
    m.set(ONLINE_LOCATION_SLUG, { label: "Online", online: true });
    return m;
})();

/* Builds the localized { title, description, headline, subhead } for one
   (location, subject) pairing. §1-clean: no em-dashes, no ampersands. */
function buildParametricMeta(location, subject) {
    const S = subject.label;
    if (location.online) {
        return {
            title: "Online " + S + " Tutor",
            description: "Live online " + S + " tutoring for students anywhere. The Math Confidence Reset framework closes foundational gaps and builds real, intuitive mastery over screen share.",
            headline: "Online <span class='highlight'>" + S + " Confidence</span> Tutor",
            subhead: "Remote, one on one " + S + " tutoring over video, built on a structured framework that turns test day pressure into genuine understanding, wherever you are."
        };
    }
    const L = location.label;
    return {
        title: L + " " + S + " Tutor",
        description: "Private " + S + " tutoring for " + L + " students. The Math Confidence Reset framework closes foundational gaps and builds real, intuitive mastery from the ground up.",
        headline: L + "'s <span class='highlight'>" + S + " Confidence</span> Tutor",
        subhead: "Personalized " + S + " tutoring for " + L + " students and families, built on a structured framework that turns test day pressure into genuine understanding."
    };
}

/* Parses a naked slug of the form <location>-<subject>-tutor and returns its
   parametric meta, or null. Because both subjects and locations may contain
   hyphens (linear-algebra, paradise-valley), the split is anchored on the
   -tutor suffix, then each approved subject is tested as a suffix of the
   remainder and the leading segment must be a registered location token. The
   token sets are disjoint, so the first matching subject whose derived location
   is known is the unambiguous answer. */
function parametricGeoMeta(slug) {
    if (!slug.endsWith("-tutor")) return null;
    const core = slug.slice(0, -"-tutor".length);
    for (const subject of SEO_SUBJECTS) {
        const suffix = "-" + subject.slug;
        if (core.length > suffix.length && core.endsWith(suffix)) {
            const locSlug = core.slice(0, core.length - suffix.length);
            const location = SEO_LOCATION_BY_SLUG.get(locSlug);
            if (location) return buildParametricMeta(location, subject);
        }
    }
    return null;
}

/* Unified resolver for a naked geo slug: the curated override wins, then the
   parametric matrix, else null (not a geo route). Used by both the router and
   handleStorefront so the two can never disagree on what is a landing page. */
function resolveGeoMeta(slug) {
    return geoRegistryEntry(slug) || parametricGeoMeta(slug);
}

/* Every geo landing slug for the sitemap: curated entries first (insertion
   order), then every parametric (location, subject) combination, each emitted
   once and skipped when a curated override already claims that slug (so
   scottsdale-calculus-tutor is listed exactly once). */
function allGeoSlugs() {
    const out = Object.keys(GEO_SEO_REGISTRY);
    const seen = new Set(out);
    for (const [locSlug] of SEO_LOCATION_BY_SLUG) {
        for (const subject of SEO_SUBJECTS) {
            const slug = locSlug + "-" + subject.slug + "-tutor";
            if (!seen.has(slug)) {
                seen.add(slug);
                out.push(slug);
            }
        }
    }
    return out;
}

/* Serves the root storefront template for both "/" and a recognized Geo-SEO
 * slug. Two edge-side transforms ride on the returned HTML:
 *   1. Geo-SEO (slug requests only): <title>, <meta name="description">, and
 *      the hero headline/subhead are rewritten to the neighborhood's copy.
 *   2. Form-session token (always, when FORM_SESSION_SECRET is set): the hidden
 *      contact-form input is stamped with a fresh HMAC-signed timing token.
 * Every miss (no ASSETS, non-GET, non-HTML, non-200, or a runtime without the
 * HTMLRewriter global such as the Node test harness) returns the untouched
 * asset, so this stays a purely additive layer over the static shell. */
async function handleStorefront(request, env, geoSlug) {
    if (!env.ASSETS) return json(404, { error: "Not found." });
    /* A geo slug is not itself an uploaded asset, so fetch the real root
       document; the plain "/" path is already the asset request. */
    const assetRequest = geoSlug
        ? new Request(new URL("/", request.url), request)
        : request;
    const assetResponse = await env.ASSETS.fetch(assetRequest);

    const isHtml = (assetResponse.headers.get("Content-Type") || "")
        .toLowerCase().includes("text/html");
    if (request.method !== "GET" || !assetResponse.ok || !isHtml ||
        typeof HTMLRewriter === "undefined") {
        return assetResponse;
    }

    const meta = geoSlug ? resolveGeoMeta(geoSlug) : null;
    const formToken = env.FORM_SESSION_SECRET
        ? await issueFormSessionToken(env.FORM_SESSION_SECRET, Date.now())
        : null;
    if (!meta && !formToken) return assetResponse;

    let rewriter = new HTMLRewriter();
    if (meta) {
        rewriter = rewriter
            .on("title", {
                element(el) { el.setInnerContent(meta.title + GEO_SEO_SUFFIX); }
            })
            .on('meta[name="description"]', {
                element(el) { el.setAttribute("content", meta.description); }
            })
            .on(".hero-content h1", {
                element(el) { el.setInnerContent(meta.headline, { html: true }); }
            })
            .on(".hero-content p", {
                element(el) { el.setInnerContent(meta.subhead); }
            });
    }
    if (formToken) {
        rewriter = rewriter.on('input[name="formSessionToken"]', {
            element(el) { el.setAttribute("value", formToken); }
        });
    }

    const transformed = rewriter.transform(assetResponse);
    /* The embedded timing token is per-render and time-sensitive, so the
       document must never be served from a shared cache as a stale copy. Only
       this HTML doc is affected; sub-assets (css, fonts, PDFs) never traverse
       this path. */
    if (formToken) {
        const headers = new Headers(transformed.headers);
        headers.set("Cache-Control", "no-store");
        return new Response(transformed.body, {
            status: transformed.status,
            statusText: transformed.statusText,
            headers
        });
    }
    return transformed;
}

/* Route matrix: /api/sync, /api/contact, and SEO support files. */
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // --- SEO Support Files ---
        if (url.pathname === "/robots.txt") {
            return new Response("User-agent: *\nAllow: /\nSitemap: https://stapleseducation.com/sitemap.xml", {
                headers: { "Content-Type": "text/plain" }
            });
        }
        // /sitemap.xml is the <sitemapindex>; each child <urlset> is served
        // from its own path (/sitemap-core.xml, /sitemap-units.xml,
        // /sitemap-geo.xml), all resolved from the SITEMAP_CHILDREN registry.
        if (url.pathname === "/sitemap.xml") {
            return new Response(buildSitemapIndexXml(), {
                headers: { "Content-Type": "application/xml" }
            });
        }
        const sitemapChild = sitemapChildByPath(url.pathname);
        if (sitemapChild) {
            return new Response(renderUrlset(sitemapChild.records()), {
                headers: { "Content-Type": "application/xml" }
            });
        }

        // --- Programmatic SEO: unit-targeted metadata for the ODE SPA ---
        // Reached only because "/ode/" is in assets.run_worker_first; a bare
        // /ode/ (no ?unit=) falls straight through to the untouched asset.
        if (url.pathname === "/ode/" || url.pathname === "/ode/index.html") {
            return handleOdeSeo(request, env, url);
        }

        // --- Storefront root: inject the form-session timing token ---
        // Reached because "/" and "/index.html" are in assets.run_worker_first,
        // so the landing document traverses the Worker before the asset server
        // and its hidden contact-form token can be stamped edge-side.
        if (url.pathname === "/" || url.pathname === "/index.html") {
            return handleStorefront(request, env, null);
        }

        // --- API Endpoints ---
        if (url.pathname === "/api/sync") {
            return handleSync(request, env, url);
        }
        if (url.pathname === "/api/contact") {
            return handleContact(request, env, ctx);
        }

        // --- Local Geo-SEO landing pages (curated + parametric matrix) ---
        // A naked subject/location/modality slug (not an uploaded asset)
        // renders the root storefront template rewritten with that pairing's
        // copy. resolveGeoMeta checks the curated overrides first, then the
        // parametric subject x modality x location matrix. Placed immediately
        // ahead of the static fallback so it only ever intercepts paths the
        // asset server would otherwise 404.
        const geoSlug = geoSlugFromPath(url.pathname);
        if (resolveGeoMeta(geoSlug)) {
            return handleStorefront(request, env, geoSlug);
        }

        // --- Static Asset Fallback ---
        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        }
        return json(404, { error: "Not found." });
    }
};
