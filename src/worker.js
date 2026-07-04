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
 * Storage: env.ODE_PROGRESS_KV, three record families:
 *   "progress:<google sub>"  { progress: <sanitized ode_* map>, email, updatedAt }
 *   "session:<sha256 hex>"   { sub, email, createdAt }  (30-day TTL)
 *   "lead:<iso>_<rand>"      { name, email, message, ip, submittedAt }  (90-day TTL)
 */

const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
const CLOCK_SKEW_S = 60;
const MAX_BODY_BYTES = 128 * 1024;
const KV_KEY_PREFIX = "progress:";
const JWKS_TTL_MS = 60 * 60 * 1000;

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

async function handleSync(request, env) {
    if (request.method !== "GET" && request.method !== "POST") {
        return new Response(null, { status: 405, headers: { Allow: "GET, POST" } });
    }
    if (!env.ODE_PROGRESS_KV || !env.GOOGLE_CLIENT_ID) {
        return json(500, { error: "Sync service is not configured." });
    }

    /* Rate-limit before auth so a flood cannot burn RS256 verifications
       or KV session lookups. */
    const retryAfterS = rateLimitRetryAfter("sync", request);
    if (retryAfterS) return tooManyRequests(retryAfterS);

    const auth = request.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) {
        return json(401, { error: "Missing bearer credential." });
    }
    const token = auth.slice(7).trim();

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

    const kvKey = KV_KEY_PREFIX + identity.sub;

    if (request.method === "GET") {
        const record = await env.ODE_PROGRESS_KV.get(kvKey, "json");
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

async function handleContact(request, env) {
    if (request.method !== "POST") {
        return new Response(null, { status: 405, headers: { Allow: "POST" } });
    }
    if (!env.ODE_PROGRESS_KV || !env.TURNSTILE_SECRET_KEY) {
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

    const lead = sanitizeLead(parsed);
    if (lead === null) {
        return json(400, {
            error: "Please provide a valid name, email, and message."
        });
    }

    const turnstileToken = parsed.turnstileToken;
    if (typeof turnstileToken !== "string" || turnstileToken.length === 0 ||
        turnstileToken.length > TURNSTILE_TOKEN_MAX_LENGTH) {
        return json(400, { error: "Missing human-verification token." });
    }

    const ip = request.headers.get("CF-Connecting-IP") || null;
    let human;
    try {
        human = await verifyTurnstile(turnstileToken, ip, env);
    } catch {
        return json(502, { error: "Verification service unavailable. Please retry." });
    }
    if (!human) {
        return json(403, { error: "Human verification failed. Please retry the check." });
    }

    /* Leads land in the same KV namespace under their own prefix, keyed for
       chronological listing (wrangler kv key list --prefix lead:), with a
       random suffix so simultaneous submissions can never collide. */
    const suffix = new Uint8Array(6);
    crypto.getRandomValues(suffix);
    const key = LEAD_KV_PREFIX + new Date().toISOString() + "_" +
        Array.from(suffix).map((b) => b.toString(16).padStart(2, "0")).join("");
    await env.ODE_PROGRESS_KV.put(
        key,
        JSON.stringify({ ...lead, ip, submittedAt: new Date().toISOString() }),
        { expirationTtl: LEAD_TTL_S }
    );

    return json(200, { ok: true });
}

/* Route matrix: /api/sync (GET and POST enforced inside handleSync, 405
   otherwise) runs the auth and KV loops; /api/contact (POST only) runs the
   Turnstile-gated lead intake; every other request falls through seamlessly
   to the static asset pipeline. */
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (url.pathname === "/api/sync") {
            return handleSync(request, env);
        }
        if (url.pathname === "/api/contact") {
            return handleContact(request, env);
        }
        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        }
        return json(404, { error: "Not found." });
    }
};
