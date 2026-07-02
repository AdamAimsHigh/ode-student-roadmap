/* Worker entry point (wrangler.jsonc "main") for stapleseducation.com.
 *
 * Owns the authenticated /api/sync progress-synchronization endpoint and
 * falls through to the static asset pipeline (env.ASSETS) for every other
 * request: the landing page at /, the ODE roadmap SPA at /ode/.
 *
 * Auth: a Google Identity Services ID token (RS256 JWT) supplied as
 * "Authorization: Bearer <credential>". The token is verified at the edge
 * with the native Web Crypto API against Google's published JWKS — no
 * third-party libraries. Claims checked: signature, iss, aud (must equal
 * env.GOOGLE_CLIENT_ID), exp/nbf with clock skew, and a present sub.
 *
 * Storage: env.ODE_PROGRESS_KV, one record per Google account:
 *   key    "progress:<google sub>"
 *   value  { progress: <sanitized ode_* map>, email, updatedAt }
 */

const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
const CLOCK_SKEW_S = 60;
const MAX_BODY_BYTES = 128 * 1024;
const KV_KEY_PREFIX = "progress:";
const JWKS_TTL_MS = 60 * 60 * 1000;

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

function json(status, body) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store"
        }
    });
}

async function handleSync(request, env) {
    if (request.method !== "GET" && request.method !== "POST") {
        return new Response(null, { status: 405, headers: { Allow: "GET, POST" } });
    }
    if (!env.ODE_PROGRESS_KV || !env.GOOGLE_CLIENT_ID) {
        return json(500, { error: "Sync service is not configured." });
    }

    const auth = request.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) {
        return json(401, { error: "Missing bearer credential." });
    }
    let identity;
    try {
        identity = await verifyGoogleIdToken(auth.slice(7).trim(), env);
    } catch (err) {
        return json(401, { error: "Invalid credential.", detail: String(err.message || err) });
    }

    const kvKey = KV_KEY_PREFIX + identity.sub;

    if (request.method === "GET") {
        const record = await env.ODE_PROGRESS_KV.get(kvKey, "json");
        return json(200, {
            progress: (record && record.progress) || null,
            updatedAt: (record && record.updatedAt) || null
        });
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
    return json(200, { ok: true, updatedAt: record.updatedAt });
}

/* Route matrix: /api/sync (GET and POST enforced inside handleSync, 405
   otherwise) runs the auth and KV loops; every other request falls through
   seamlessly to the static asset pipeline. */
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (url.pathname === "/api/sync") {
            return handleSync(request, env);
        }
        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        }
        return json(404, { error: "Not found." });
    }
};
