/* End-to-end validation suite for src/worker.js.
 *
 * Exercises the /api/sync handler over both verification modes: full Google
 * ID-token verification (real RS256 signatures minted with node:crypto's
 * WebCrypto against a mocked JWKS endpoint) and the long-lived odesess_*
 * edge session tokens (hashed KV records, 30-day TTL), plus the DELETE
 * hard sign-out that revokes a session record server-side. Malformed,
 * tampered, expired, and oversized inputs must all be rejected with
 * 401/413/405.
 *
 * Progress storage is subject-namespaced ("progress:<subject>:<sub>",
 * ?subject= query param, default ode): covered are registry rejection of
 * unknown tracks, cross-track isolation, and the lazy lossless migration
 * of legacy pre-namespace records.
 *
 * Sprint Rec 5 (2026-07-11): the /api/packages entitlement ledger — the
 * edge-evaluated OWNER_SUBS role split (student reads only their own sub
 * namespace, every student write is 403), the forward-only
 * Quoted -> Active -> Completed lifecycle, session logging bounds, the
 * group roster cap, and unassigned-record relocation.
 *
 * Also covers the Phase 3 hardening surface: the POST /api/contact lead
 * endpoint (strict payload shape, Turnstile siteverify against a mocked
 * challenges.cloudflare.com, KV lead records) and the per-IP fixed-window
 * rate limiter on both API routes (429 + Retry-After past the window cap).
 *
 * Finally, the programmatic-SEO surface: the dynamic /sitemap.xml handler
 * must deep-link all 19 ODE units (/ode/?unit=N) with weekly changefreq,
 * emit valid, entity-safe XML, and carry per-unit ISO-8601 <lastmod> dates
 * that vary across units (not one global constant).
 *
 * Run from the repo root:  node scripts/test_sync_worker.mjs
 * Exit code 0 = all cases pass.
 */

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const CLIENT_ID = "test-client.apps.googleusercontent.com";
const JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const KID = "test-key-1";
const SUB = "1234567890";

/* ---- Import the Worker module ------------------------------------------ *
 * The repo's package.json has no "type": "module", so src/worker.js parses
 * as CJS when imported by path. Copy it to a temp .mjs to import as ESM.   */
const workDir = mkdtempSync(join(tmpdir(), "ode-sync-test-"));
const workerCopy = join(workDir, "worker.mjs");
writeFileSync(workerCopy, readFileSync("src/worker.js", "utf8"));
const worker = (await import(pathToFileURL(workerCopy).href)).default;

/* ---- RS256 key + token forge ------------------------------------------- */

const { publicKey, privateKey } = await crypto.subtle.generateKey(
    {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    },
    true,
    ["sign", "verify"]
);
const publicJwk = await crypto.subtle.exportKey("jwk", publicKey);
Object.assign(publicJwk, { kid: KID, use: "sig", alg: "RS256" });

function b64url(input) {
    const bytes = typeof input === "string"
        ? new TextEncoder().encode(input)
        : input;
    return Buffer.from(bytes).toString("base64url");
}

async function signToken(payloadOverrides = {}, headerOverrides = {}) {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT", kid: KID, ...headerOverrides };
    const payload = {
        iss: "https://accounts.google.com",
        aud: CLIENT_ID,
        sub: SUB,
        email: "student@example.com",
        iat: now,
        exp: now + 3600,
        ...payloadOverrides
    };
    const signingInput =
        b64url(JSON.stringify(header)) + "." + b64url(JSON.stringify(payload));
    const sig = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        privateKey,
        new TextEncoder().encode(signingInput)
    );
    return signingInput + "." + b64url(new Uint8Array(sig));
}

/* ---- Mocked platform: JWKS endpoint + TTL-aware KV ---------------------- */

const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_SECRET = "test-turnstile-secret";
let lastSiteverifyParams = null;

globalThis.fetch = async (resource, init) => {
    if (String(resource) === JWKS_URL) {
        return new Response(JSON.stringify({ keys: [publicJwk] }), {
            headers: { "Content-Type": "application/json" }
        });
    }
    if (String(resource) === TURNSTILE_URL) {
        const params = new URLSearchParams(String(init.body));
        lastSiteverifyParams = params;
        const success = params.get("secret") === TURNSTILE_SECRET &&
            params.get("response") === "PASS";
        return new Response(JSON.stringify({ success }), {
            headers: { "Content-Type": "application/json" }
        });
    }
    throw new Error("unexpected network call: " + resource);
};

class MockKV {
    constructor() { this.store = new Map(); }
    async get(key, type) {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
            this.store.delete(key);
            return null;
        }
        return type === "json" ? JSON.parse(entry.value) : entry.value;
    }
    async put(key, value, opts = {}) {
        this.store.set(key, {
            value,
            expiresAt: opts.expirationTtl
                ? Date.now() + opts.expirationTtl * 1000
                : null
        });
    }
    async delete(key) {
        this.store.delete(key);
    }
    /* Workers KV list() shape, used by the /api/packages prefix scans. The
       mock returns everything in one page, so the cursor loop's single-page
       exit path is what gets exercised. */
    async list(opts = {}) {
        const prefix = opts.prefix || "";
        const names = [...this.store.keys()]
            .filter((k) => k.startsWith(prefix)).sort();
        return { keys: names.map((name) => ({ name })), list_complete: true };
    }
    keysWithPrefix(prefix) {
        return [...this.store.keys()].filter((k) => k.startsWith(prefix));
    }
    forceExpire(key) {
        const entry = this.store.get(key);
        if (entry) entry.expiresAt = Date.now() - 1000;
    }
}

/* The tutor-owner's Google sub for the /api/packages role split. The env
   value carries stray whitespace on purpose: the allowlist parser must trim. */
const OWNER_SUB = "77770000111122223333";

const kv = new MockKV();
const env = {
    ODE_PROGRESS_KV: kv,
    GOOGLE_CLIENT_ID: CLIENT_ID,
    TURNSTILE_SECRET_KEY: TURNSTILE_SECRET,
    OWNER_SUBS: " " + OWNER_SUB + " , "
};

function apiRequest(method, token, body, subject) {
    const headers = {};
    if (token !== null) headers["Authorization"] = "Bearer " + token;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    return new Request("https://stapleseducation.com/api/sync" +
        (subject ? "?subject=" + encodeURIComponent(subject) : ""), {
        method,
        headers,
        body: body === undefined ? undefined
            : typeof body === "string" ? body : JSON.stringify(body)
    });
}

/* ---- Tiny runner -------------------------------------------------------- */

let caseNo = 0;
let failures = 0;

function check(condition, label) {
    if (!condition) {
        failures++;
        console.error(`    FAIL  ${label}`);
    }
}

async function testCase(title, fn) {
    caseNo++;
    console.log(`Case ${String(caseNo).padStart(2)}: ${title}`);
    const before = failures;
    try {
        await fn();
    } catch (err) {
        failures++;
        console.error(`    THREW  ${err && err.stack || err}`);
    }
    if (failures === before) console.log("    pass");
}

/* ---- The cases ----------------------------------------------------------- */

let sessionToken = null;   // captured in case 8, threaded through 10-15
const DAY_MS = 24 * 60 * 60 * 1000;

await testCase("unsupported methods are refused with 405", async () => {
    const res = await worker.fetch(apiRequest("PUT", await signToken()), env);
    check(res.status === 405, `expected 405, got ${res.status}`);
    check(res.headers.get("Allow") === "GET, POST, DELETE",
        "Allow header lists GET, POST, DELETE");
});

await testCase("missing bearer credential is a 401 challenge", async () => {
    const res = await worker.fetch(apiRequest("GET", null), env);
    check(res.status === 401, `expected 401, got ${res.status}`);
});

await testCase("garbage bearer (neither JWT nor session shape) is 401", async () => {
    const res = await worker.fetch(apiRequest("GET", "not-a-real-token"), env);
    check(res.status === 401, `expected 401, got ${res.status}`);
});

await testCase("tampered Google JWT (payload swap + alg:none) is 401", async () => {
    const token = await signToken();
    const parts = token.split(".");
    const forgedPayload = b64url(JSON.stringify({
        iss: "https://accounts.google.com",
        aud: CLIENT_ID, sub: "9999", exp: Math.floor(Date.now() / 1000) + 3600
    }));
    const tampered = parts[0] + "." + forgedPayload + "." + parts[2];
    const res = await worker.fetch(apiRequest("GET", tampered), env);
    check(res.status === 401, `tampered payload: expected 401, got ${res.status}`);

    const noneHeader = b64url(JSON.stringify({ alg: "none", kid: KID }));
    const unsigned = noneHeader + "." + parts[1] + ".";
    const res2 = await worker.fetch(apiRequest("GET", unsigned), env);
    check(res2.status === 401, `alg:none: expected 401, got ${res2.status}`);
});

await testCase("wrong audience is 401", async () => {
    const token = await signToken({ aud: "someone-else.apps.googleusercontent.com" });
    const res = await worker.fetch(apiRequest("GET", token), env);
    check(res.status === 401, `expected 401, got ${res.status}`);
});

await testCase("expired Google token is 401", async () => {
    const token = await signToken({ exp: Math.floor(Date.now() / 1000) - 600 });
    const res = await worker.fetch(apiRequest("GET", token), env);
    check(res.status === 401, `expected 401, got ${res.status}`);
});

await testCase("wrong issuer is 401", async () => {
    const token = await signToken({ iss: "https://evil.example.com" });
    const res = await worker.fetch(apiRequest("GET", token), env);
    check(res.status === 401, `expected 401, got ${res.status}`);
});

await testCase("valid Google GET verifies and mints a 30-day edge session", async () => {
    const res = await worker.fetch(apiRequest("GET", await signToken()), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    const body = await res.json();
    check(body.progress === null, "fresh account has null progress");
    check(body.session && typeof body.session.token === "string",
        "response carries a minted session");
    check(body.session.token.startsWith("odesess_"), "session token is odesess_*");
    const msLeft = Date.parse(body.session.expiresAt) - Date.now();
    check(msLeft > 29 * DAY_MS && msLeft < 31 * DAY_MS,
        "session expiry is ~30 days out");
    const sessionKeys = kv.keysWithPrefix("session:");
    check(sessionKeys.length === 1, "exactly one session record in KV");
    check(!sessionKeys[0].includes(body.session.token.slice(8, 20)),
        "KV key stores a hash, never the plaintext token");
    const record = JSON.parse(kv.store.get(sessionKeys[0]).value);
    check(record.sub === SUB, "session record binds the Google sub");
    sessionToken = body.session.token;
});

await testCase("valid Google POST sanitizes hostile payloads before KV write", async () => {
    const res = await worker.fetch(apiRequest("POST", await signToken(), {
        progress: {
            ode_watched_videos: ["v1", "v1", "v2", 42, { bad: true }],
            ode_passed_checkpoints: { cp1: { passed: true, score: 5 } },
            ode_quiz_progress: { q1: ["a", "a", "b"] },
            ode_learning_mode: "guided",
            ode_theme_preference: "neon-vaporwave",
            evil_injected_key: "drop me"
        }
    }), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    const saved = await kv.get("progress:ode:" + SUB, "json");
    check(JSON.stringify(saved.progress.ode_watched_videos) === '["v1","v2"]',
        "watched list deduped, non-strings dropped");
    check(saved.progress.ode_passed_checkpoints.cp1.score === 5,
        "checkpoint detail round-trips");
    check(JSON.stringify(saved.progress.ode_quiz_progress.q1) === '["a","b"]',
        "quiz answers deduped");
    check(saved.progress.ode_learning_mode === "guided", "valid mode kept");
    check(!("ode_theme_preference" in saved.progress), "invalid theme dropped");
    check(!("evil_injected_key" in saved.progress), "foreign key dropped");
});

await testCase("session-token GET reads the progress map without a re-mint", async () => {
    const res = await worker.fetch(apiRequest("GET", sessionToken), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    const body = await res.json();
    check(body.progress && body.progress.ode_watched_videos.length === 2,
        "session identity reaches the same progress:<sub> record");
    check(!("session" in body), "no fresh session minted on a session-auth call");
});

await testCase("session-token POST writes the progress map", async () => {
    const res = await worker.fetch(apiRequest("POST", sessionToken, {
        progress: { ode_watched_videos: ["v1", "v2", "v3"] }
    }), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    const saved = await kv.get("progress:ode:" + SUB, "json");
    check(saved.progress.ode_watched_videos.length === 3,
        "session-authenticated write persisted");
});

await testCase("tampered session token signature misses KV and is 401", async () => {
    const last = sessionToken.slice(-1);
    const flipped = sessionToken.slice(0, -1) + (last === "A" ? "B" : "A");
    const res = await worker.fetch(apiRequest("GET", flipped), env);
    check(res.status === 401, `expected 401, got ${res.status}`);
    const res2 = await worker.fetch(apiRequest("POST", flipped,
        { progress: { ode_watched_videos: ["evil"] } }), env);
    check(res2.status === 401, `tampered POST: expected 401, got ${res2.status}`);
    const saved = await kv.get("progress:ode:" + SUB, "json");
    check(saved.progress.ode_watched_videos.indexOf("evil") === -1,
        "tampered token never reaches the progress map");
});

await testCase("truncated and oversized session tokens are 401", async () => {
    const short = await worker.fetch(apiRequest("GET", "odesess_abc"), env);
    check(short.status === 401, `truncated: expected 401, got ${short.status}`);
    const huge = await worker.fetch(
        apiRequest("GET", "odesess_" + "A".repeat(500)), env);
    check(huge.status === 401, `oversized: expected 401, got ${huge.status}`);
});

await testCase("TTL-expired session is 401; a fresh Google token re-mints", async () => {
    kv.keysWithPrefix("session:").forEach((k) => kv.forceExpire(k));
    const res = await worker.fetch(apiRequest("GET", sessionToken), env);
    check(res.status === 401, `expired session: expected 401, got ${res.status}`);
    const reauth = await worker.fetch(apiRequest("GET", await signToken()), env);
    check(reauth.status === 200, "Google re-auth after expiry succeeds");
    const body = await reauth.json();
    check(body.session && body.session.token !== sessionToken,
        "a distinct replacement session is minted");
    sessionToken = body.session.token;
});

await testCase("oversized POST body is refused with 413", async () => {
    const padded = '{"progress":{"ode_watched_videos":["' +
        "x".repeat(130 * 1024) + '"]}}';
    const res = await worker.fetch(apiRequest("POST", sessionToken, padded), env);
    check(res.status === 413, `expected 413, got ${res.status}`);
});

/* ---- Phase 6: subject-namespaced progress -------------------------------- */

await testCase("unregistered subject parameter is refused with 400", async () => {
    const res = await worker.fetch(
        apiRequest("GET", sessionToken, undefined, "underwater_basket_weaving"), env);
    check(res.status === 400, `unknown subject: expected 400, got ${res.status}`);
    const hostile = await worker.fetch(apiRequest("POST", sessionToken,
        { progress: { ode_watched_videos: ["x"] } }, "ode'; DROP TABLE"), env);
    check(hostile.status === 400, `hostile subject: expected 400, got ${hostile.status}`);
});

await testCase("parallel subject tracks are isolated namespaces", async () => {
    const res = await worker.fetch(apiRequest("POST", sessionToken,
        { progress: { ode_watched_videos: ["la-v1"] } }, "lin_alg"), env);
    check(res.status === 200, `lin_alg POST: expected 200, got ${res.status}`);
    const la = await kv.get("progress:lin_alg:" + SUB, "json");
    check(la !== null && la.progress.ode_watched_videos.length === 1,
        "lin_alg record lands in its own namespace");
    const ode = await kv.get("progress:ode:" + SUB, "json");
    check(ode.progress.ode_watched_videos.length === 3,
        "ode namespace untouched by the lin_alg write");
    const odeBody = await (await worker.fetch(
        apiRequest("GET", sessionToken), env)).json();
    check(odeBody.progress.ode_watched_videos.indexOf("la-v1") === -1,
        "subjectless (default ode) GET never sees lin_alg data");
});

await testCase("legacy pre-namespace record migrates losslessly on first ode read", async () => {
    const legacySub = "9998887776665554443";
    await kv.put("progress:" + legacySub, JSON.stringify({
        progress: { ode_watched_videos: ["old-v1", "old-v2"] },
        email: "veteran@example.com",
        updatedAt: "2026-01-01T00:00:00.000Z"
    }));
    const res = await worker.fetch(
        apiRequest("GET", await signToken({ sub: legacySub })), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    const body = await res.json();
    check(body.progress && body.progress.ode_watched_videos.length === 2,
        "legacy progress served on the first namespaced read");
    const migrated = await kv.get("progress:ode:" + legacySub, "json");
    check(migrated !== null && migrated.progress.ode_watched_videos[0] === "old-v1",
        "record copied forward into the ode namespace");
    check((await kv.get("progress:" + legacySub, "json")) !== null,
        "legacy record retained for rollback safety");
});

/* ---- Sprint Rec 1: telemetry layer sanitization --------------------------- */

await testCase("telemetry keys sanitize hostile shapes and round-trip clean data", async () => {
    const res = await worker.fetch(apiRequest("POST", sessionToken, {
        progress: {
            ode_watched_videos: ["v1", "v2", "v3"],
            ode_events: [
                "5abcd|q|1|unit0_micro::3",
                "5abcd|q|1|unit0_micro::3",       // duplicate: dropped
                42,                                // non-string: dropped
                "",                                // empty: dropped
                "x".repeat(100)                    // oversized: dropped
            ],
            ode_skill_state: {
                unit0_micro: { r: 1234.7, a: 10, c: 7, t: 1780000000000, evil: "drop me" },
                garbage: "not-an-object",
                zeroed: { r: "NaN-ish", a: -5 }
            },
            ode_daily_activity: {
                "2026-07-10": [5, 3],
                "not-a-date": [1, 1],
                "2026-07-11": ["x", 2]
            }
        }
    }), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    const saved = await kv.get("progress:ode:" + SUB, "json");
    check(JSON.stringify(saved.progress.ode_events) ===
        '["5abcd|q|1|unit0_micro::3"]',
        "events deduped, non-strings and oversized entries dropped");
    const skill = saved.progress.ode_skill_state.unit0_micro;
    check(skill.r === 1235 && skill.a === 10 && skill.c === 7 &&
        skill.t === 1780000000000, "skill record numeric fields round-trip");
    check(!("evil" in skill), "foreign field inside a skill record dropped");
    check(!("garbage" in saved.progress.ode_skill_state),
        "non-object skill entry dropped");
    const zeroed = saved.progress.ode_skill_state.zeroed;
    check(zeroed.r === 0 && zeroed.a === 0,
        "non-numeric and negative fields collapse to 0");
    check(JSON.stringify(saved.progress.ode_daily_activity["2026-07-10"]) === "[5,3]",
        "daily counters round-trip");
    check(!("not-a-date" in saved.progress.ode_daily_activity),
        "malformed date key dropped");
    check(saved.progress.ode_daily_activity["2026-07-11"][0] === 0,
        "non-numeric counter collapses to 0");
});

await testCase("telemetry entry caps bound events, skills, and daily maps", async () => {
    const events = [];
    for (let i = 0; i < 1700; i++) events.push("5ab" + i.toString(36) + "|q|1|q" + i);
    const skills = {};
    for (let i = 0; i < 700; i++) skills["skill_" + i] = { r: 1200, a: 1, c: 1, t: 1 };
    const daily = {};
    for (let i = 0; i < 500; i++) {
        const day = new Date(Date.UTC(2025, 0, 1) + i * 86400000);
        daily[day.toISOString().slice(0, 10)] = [1, 1];
    }
    const res = await worker.fetch(apiRequest("POST", sessionToken, {
        progress: {
            ode_watched_videos: ["v1", "v2", "v3"],
            ode_events: events,
            ode_skill_state: skills,
            ode_daily_activity: daily
        }
    }), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    const saved = await kv.get("progress:ode:" + SUB, "json");
    check(saved.progress.ode_events.length === 1600,
        `events capped at 1600, got ${saved.progress.ode_events.length}`);
    check(Object.keys(saved.progress.ode_skill_state).length === 600,
        `skills capped at 600, got ${Object.keys(saved.progress.ode_skill_state).length}`);
    check(Object.keys(saved.progress.ode_daily_activity).length === 400,
        `daily map capped at 400, got ${Object.keys(saved.progress.ode_daily_activity).length}`);
});

/* ---- Phase 5: DELETE /api/sync hard sign-out ----------------------------- */

/* The KV key the worker derives for a session token — lets the suite assert
   on the exact hashed record instead of counting keys (earlier Google-auth
   cases leave TTL-expired zombie records that MockKV only sweeps on get). */
async function sessionKvKey(token) {
    const digest = await crypto.subtle.digest(
        "SHA-256", new TextEncoder().encode(token));
    return "session:" + Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0")).join("");
}

await testCase("sign-out DELETE refuses missing and non-session bearers", async () => {
    const noBearer = await worker.fetch(apiRequest("DELETE", null), env);
    check(noBearer.status === 401, `no bearer: expected 401, got ${noBearer.status}`);
    const googleJwt = await worker.fetch(
        apiRequest("DELETE", await signToken()), env);
    check(googleJwt.status === 400,
        `Google JWT bearer: expected 400, got ${googleJwt.status}`);
    const oversized = await worker.fetch(
        apiRequest("DELETE", "odesess_" + "A".repeat(500)), env);
    check(oversized.status === 401,
        `oversized token: expected 401, got ${oversized.status}`);
    check(kv.store.has(await sessionKvKey(sessionToken)),
        "live session survives every refused sign-out attempt");
});

await testCase("sign-out DELETE hard-revokes the live session in KV", async () => {
    const res = await worker.fetch(apiRequest("DELETE", sessionToken), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    check((await res.json()).ok === true, "response body is { ok: true }");
    check(!kv.store.has(await sessionKvKey(sessionToken)),
        "hashed session record deleted from KV");
    const replay = await worker.fetch(apiRequest("GET", sessionToken), env);
    check(replay.status === 401, `revoked token replay: expected 401, got ${replay.status}`);
    const progress = await kv.get("progress:ode:" + SUB, "json");
    check(progress !== null && progress.progress.ode_watched_videos.length === 3,
        "sign-out revokes the credential, never the progress data");
});

await testCase("repeat DELETE of a revoked token is the standard 401 challenge", async () => {
    const res = await worker.fetch(apiRequest("DELETE", sessionToken), env);
    check(res.status === 401, `expected 401, got ${res.status}`);
});

/* ---- Phase 3: /api/contact + rate limiting ------------------------------ */

/* Each case uses a dedicated CF-Connecting-IP so the in-isolate fixed-window
   buckets (keyed route:ip) never bleed between cases. */
function contactRequest(body, opts = {}) {
    const headers = { "CF-Connecting-IP": opts.ip || "203.0.113.1" };
    if (body !== undefined) {
        headers["Content-Type"] = opts.contentType || "application/json";
    }
    return new Request("https://stapleseducation.com/api/contact", {
        method: opts.method || "POST",
        headers,
        body: body === undefined ? undefined
            : typeof body === "string" ? body : JSON.stringify(body)
    });
}

const GOOD_LEAD = {
    name: "Ada Student",
    email: "ada@example.com",
    message: "I need help with Laplace transforms before my final.",
    turnstileToken: "PASS"
};

await testCase("contact: non-POST methods are refused with 405", async () => {
    const res = await worker.fetch(
        contactRequest(undefined, { method: "GET", ip: "203.0.113.10" }), env);
    check(res.status === 405, `expected 405, got ${res.status}`);
    check(res.headers.get("Allow") === "POST", "Allow header lists POST");
});

await testCase("contact: malformed payload shapes are 400", async () => {
    const missing = await worker.fetch(contactRequest(
        { name: "Ada", turnstileToken: "PASS" }, { ip: "203.0.113.11" }), env);
    check(missing.status === 400, `missing fields: expected 400, got ${missing.status}`);
    const badEmail = await worker.fetch(contactRequest(
        { ...GOOD_LEAD, email: "not-an-email" }, { ip: "203.0.113.11" }), env);
    check(badEmail.status === 400, `bad email: expected 400, got ${badEmail.status}`);
    const overlong = await worker.fetch(contactRequest(
        { ...GOOD_LEAD, name: "x".repeat(200) }, { ip: "203.0.113.11" }), env);
    check(overlong.status === 400, `overlong name: expected 400, got ${overlong.status}`);
    const noToken = await worker.fetch(contactRequest(
        { ...GOOD_LEAD, turnstileToken: "" }, { ip: "203.0.113.11" }), env);
    check(noToken.status === 400, `empty token: expected 400, got ${noToken.status}`);
    check(kv.keysWithPrefix("lead:").length === 0, "no lead record written");
});

await testCase("contact: oversized body is 413, wrong content-type is 415", async () => {
    const huge = { ...GOOD_LEAD, message: "x".repeat(20 * 1024) };
    const res = await worker.fetch(
        contactRequest(huge, { ip: "203.0.113.12" }), env);
    check(res.status === 413, `oversized: expected 413, got ${res.status}`);
    const wrongType = await worker.fetch(contactRequest(
        GOOD_LEAD, { ip: "203.0.113.12", contentType: "text/plain" }), env);
    check(wrongType.status === 415, `wrong type: expected 415, got ${wrongType.status}`);
});

await testCase("contact: failed Turnstile verification is 403, no KV write", async () => {
    const res = await worker.fetch(contactRequest(
        { ...GOOD_LEAD, turnstileToken: "FAIL" }, { ip: "203.0.113.13" }), env);
    check(res.status === 403, `expected 403, got ${res.status}`);
    check(kv.keysWithPrefix("lead:").length === 0, "bot lead never persisted");
});

await testCase("contact: verified submission persists a TTL'd lead record", async () => {
    lastSiteverifyParams = null;
    const res = await worker.fetch(
        contactRequest(GOOD_LEAD, { ip: "203.0.113.14" }), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    check((await res.json()).ok === true, "response body is { ok: true }");
    check(lastSiteverifyParams !== null &&
        lastSiteverifyParams.get("remoteip") === "203.0.113.14",
        "siteverify call forwards the caller IP");
    const leadKeys = kv.keysWithPrefix("lead:");
    check(leadKeys.length === 1, "exactly one lead record in KV");
    const record = JSON.parse(kv.store.get(leadKeys[0]).value);
    check(record.name === GOOD_LEAD.name && record.email === GOOD_LEAD.email &&
        record.message === GOOD_LEAD.message, "lead fields round-trip");
    check(!("turnstileToken" in record), "challenge token never persisted");
    check(kv.store.get(leadKeys[0]).expiresAt !== null, "lead carries a TTL");
});

await testCase("contact: 6th request in the window is rate-limited 429", async () => {
    const ip = "203.0.113.15";
    for (let i = 0; i < 5; i++) {
        const res = await worker.fetch(contactRequest(
            { ...GOOD_LEAD, turnstileToken: "FAIL" }, { ip }), env);
        check(res.status === 403, `warm-up ${i + 1}: expected 403, got ${res.status}`);
    }
    const blocked = await worker.fetch(contactRequest(GOOD_LEAD, { ip }), env);
    check(blocked.status === 429, `expected 429, got ${blocked.status}`);
    check(Number(blocked.headers.get("Retry-After")) >= 1,
        "429 carries a Retry-After header");
});

await testCase("sync: 61st request in the window is rate-limited 429", async () => {
    const ip = "198.51.100.99";
    let last;
    for (let i = 0; i < 61; i++) {
        const req = new Request("https://stapleseducation.com/api/sync", {
            method: "GET",
            headers: {
                "Authorization": "Bearer garbage-token",
                "CF-Connecting-IP": ip
            }
        });
        last = await worker.fetch(req, env);
        if (i < 60) {
            check(last.status === 401, `req ${i + 1}: expected 401, got ${last.status}`);
        }
    }
    check(last.status === 429, `req 61: expected 429, got ${last.status}`);
    check(Number(last.headers.get("Retry-After")) >= 1,
        "429 carries a Retry-After header");
});

/* ---- Sprint Rec 3: adaptive learning mode joins the sync whitelist ------- */

await testCase("sync: adaptive learning mode persists, junk modes still drop", async () => {
    const res = await worker.fetch(apiRequest("POST", await signToken(), {
        progress: { ode_learning_mode: "adaptive" }
    }), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    const saved = await kv.get("progress:ode:" + SUB, "json");
    check(saved.progress.ode_learning_mode === "adaptive",
        "adaptive mode round-trips the sanitizer");
    const junk = await worker.fetch(apiRequest("POST", await signToken(), {
        progress: { ode_learning_mode: "speedrun" }
    }), env);
    check(junk.status === 200, `junk-mode POST: expected 200, got ${junk.status}`);
    const resaved = await kv.get("progress:ode:" + SUB, "json");
    check(!("ode_learning_mode" in resaved.progress),
        "unregistered mode value dropped");
});

/* ---- Sprint Rec 5: /api/packages entitlement ledger ---------------------- */

/* Dedicated IPs per case so the packages rate bucket never bleeds. */
function packagesRequest(method, token, body, ip) {
    const headers = { "CF-Connecting-IP": ip || "192.0.2.1" };
    if (token !== null) headers["Authorization"] = "Bearer " + token;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    return new Request("https://stapleseducation.com/api/packages", {
        method,
        headers,
        body: body === undefined ? undefined
            : typeof body === "string" ? body : JSON.stringify(body)
    });
}

function ownerToken(overrides = {}) {
    return signToken({ sub: OWNER_SUB, email: "tutor@example.com", ...overrides });
}

let trackedPkg = null;     // owner-created package threaded through the cases
let unassignedPkg = null;  // package awaiting link-student

await testCase("packages: missing bearer is 401, unsupported method is 405", async () => {
    const noBearer = await worker.fetch(packagesRequest("GET", null), env);
    check(noBearer.status === 401, `no bearer: expected 401, got ${noBearer.status}`);
    const put = await worker.fetch(
        packagesRequest("PUT", await signToken()), env);
    check(put.status === 405, `PUT: expected 405, got ${put.status}`);
    check(put.headers.get("Allow") === "GET, POST", "Allow header lists GET, POST");
});

await testCase("packages: student GET is role student with an empty own-namespace ledger", async () => {
    const res = await worker.fetch(
        packagesRequest("GET", await signToken()), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    const body = await res.json();
    check(body.role === "student", `role student, got ${body.role}`);
    check(body.sub === SUB, "caller sub echoed for profile display");
    check(Array.isArray(body.packages) && body.packages.length === 0,
        "fresh student sees an empty ledger");
    check(body.catalog && body.catalog["fundamentals-4"].priceUsd === 100 &&
        body.catalog["fundamentals-4"].wyzantHourlyUsd === 25,
        "catalog carries the flat price and Wyzant hourly translation");
});

await testCase("packages: student POST is 403 with no KV write", async () => {
    const res = await worker.fetch(packagesRequest("POST", await signToken(), {
        action: "create", studentEmail: "self@example.com", type: "semester-12"
    }), env);
    check(res.status === 403, `expected 403, got ${res.status}`);
    check(kv.keysWithPrefix("package:").length === 0,
        "student write never reaches the ledger");
});

await testCase("packages: owner creates a quoted package with the rate translation", async () => {
    const res = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "create", studentEmail: "ada@example.com",
        studentSub: SUB, type: "fundamentals-4"
    }), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    const body = await res.json();
    trackedPkg = body.package;
    check(trackedPkg.status === "quoted", "new package starts quoted");
    check(trackedPkg.hours === 4 && trackedPkg.priceUsd === 100 &&
        trackedPkg.wyzantHourlyUsd === 25,
        "catalog terms stamped onto the record");
    check(kv.store.has("package:" + SUB + ":" + trackedPkg.id),
        "record keyed package:<sub>:<pkgId>");
    const badType = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "create", studentEmail: "ada@example.com", type: "elite-bootcamp"
    }), env);
    check(badType.status === 400, `unknown type: expected 400, got ${badType.status}`);
});

await testCase("packages: lifecycle is forward-only quoted -> active -> completed", async () => {
    const activate = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "set-status", sub: SUB, pkgId: trackedPkg.id, status: "active"
    }), env);
    check(activate.status === 200, `activate: expected 200, got ${activate.status}`);
    check((await activate.json()).package.status === "active", "package is active");
    const backward = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "set-status", sub: SUB, pkgId: trackedPkg.id, status: "quoted"
    }), env);
    check(backward.status === 400, `backward step: expected 400, got ${backward.status}`);
    const second = await (await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "create", studentEmail: "grace@example.com", type: "comprehensive-8"
    }), env)).json();
    unassignedPkg = second.package;
    const skip = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "set-status", sub: "unassigned", pkgId: unassignedPkg.id,
        status: "completed"
    }), env);
    check(skip.status === 400, `quoted -> completed skip: expected 400, got ${skip.status}`);
});

await testCase("packages: session ledger logs only on active packages within bounds", async () => {
    const ok = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "log-session", sub: SUB, pkgId: trackedPkg.id,
        minutes: 90, date: "2026-07-11", note: "Integrating factors review"
    }), env);
    check(ok.status === 200, `expected 200, got ${ok.status}`);
    const logged = (await ok.json()).package;
    check(logged.minutesLogged === 90 && logged.sessions.length === 1 &&
        logged.sessions[0].note === "Integrating factors review",
        "session entry and running minutes persisted");
    const tiny = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "log-session", sub: SUB, pkgId: trackedPkg.id, minutes: 5
    }), env);
    check(tiny.status === 400, `5 minutes: expected 400, got ${tiny.status}`);
    const onQuoted = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "log-session", sub: "unassigned", pkgId: unassignedPkg.id, minutes: 60
    }), env);
    check(onQuoted.status === 400, `quoted package: expected 400, got ${onQuoted.status}`);
});

await testCase("packages: group builder caps the roster at 4 and dedupes", async () => {
    const five = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "create-group", title: "Laplace Group Session",
        studentEmails: ["a@x.com", "b@x.com", "c@x.com", "d@x.com", "e@x.com"]
    }), env);
    check(five.status === 400, `5 students: expected 400, got ${five.status}`);
    const ok = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "create-group", title: "Laplace Group Session",
        studentEmails: ["a@x.com", "A@x.com", "b@x.com", "c@x.com", "d@x.com"],
        scheduledFor: "2026-08-01"
    }), env);
    check(ok.status === 200, `expected 200, got ${ok.status}`);
    const group = (await ok.json()).package;
    check(group.roster.length === 4, "case-insensitive duplicate deduped");
    check(group.pricePerStudentUsd === 120 && group.wyzantHourlyUsd === 15,
        "group pricing carries the 15 dollar Wyzant translation");
    check(kv.store.has("package:group:" + group.id),
        "group record lives in the reserved group segment");
});

await testCase("packages: edge role isolation on GET — student sees only their own", async () => {
    const ownerView = await (await worker.fetch(
        packagesRequest("GET", await ownerToken()), env)).json();
    check(ownerView.role === "owner", "allowlisted sub resolves to owner");
    check(ownerView.packages.length === 3,
        `owner sees the full ledger, got ${ownerView.packages.length}`);
    const studentView = await (await worker.fetch(
        packagesRequest("GET", await signToken()), env)).json();
    check(studentView.role === "student", "student stays student");
    check(studentView.packages.length === 1 &&
        studentView.packages[0].id === trackedPkg.id,
        "student ledger holds exactly their own package");
    const leaked = JSON.stringify(studentView);
    check(leaked.indexOf("grace@example.com") === -1 &&
        leaked.indexOf("a@x.com") === -1,
        "no other student's email reaches a student response");
});

await testCase("packages: link-student relocates an unassigned record atomically", async () => {
    const otherSub = "5556667778889990001";
    const res = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "link-student", pkgId: unassignedPkg.id, studentSub: otherSub
    }), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    check(kv.store.has("package:" + otherSub + ":" + unassignedPkg.id),
        "record relocated into the student namespace");
    check(!kv.store.has("package:unassigned:" + unassignedPkg.id),
        "unassigned original removed after the copy is durable");
});

await testCase("packages: hostile actions and malformed locators are refused", async () => {
    const unknown = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "drop-tables"
    }), env);
    check(unknown.status === 400, `unknown action: expected 400, got ${unknown.status}`);
    const traversal = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "set-status", sub: "../../session", pkgId: trackedPkg.id,
        status: "active"
    }), env);
    check(traversal.status === 404, `hostile sub: expected 404, got ${traversal.status}`);
    const badId = await worker.fetch(packagesRequest("POST", await ownerToken(), {
        action: "set-status", sub: SUB, pkgId: "pkg_../escape", status: "active"
    }), env);
    check(badId.status === 404, `hostile pkgId: expected 404, got ${badId.status}`);
});

await testCase("packages: 61st request in the window is rate-limited 429", async () => {
    const ip = "192.0.2.61";
    let last;
    for (let i = 0; i < 61; i++) {
        last = await worker.fetch(
            packagesRequest("GET", "garbage-token", undefined, ip), env);
        if (i < 60) {
            check(last.status === 401, `req ${i + 1}: expected 401, got ${last.status}`);
        }
    }
    check(last.status === 429, `req 61: expected 429, got ${last.status}`);
    check(Number(last.headers.get("Retry-After")) >= 1,
        "429 carries a Retry-After header");
});

/* ---- Programmatic SEO: dynamic sitemap ---------------------------------- */

function sitemapRequest() {
    return new Request("https://stapleseducation.com/sitemap.xml");
}

await testCase("sitemap.xml is served as application/xml with the top-level pages", async () => {
    const res = await worker.fetch(sitemapRequest(), env);
    check(res.status === 200, `expected 200, got ${res.status}`);
    check((res.headers.get("Content-Type") || "").includes("application/xml"),
        "Content-Type is application/xml");
    const xml = await res.text();
    check(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'),
        "well-formed XML prolog");
    check(xml.includes("<loc>https://stapleseducation.com/</loc>"),
        "root landing page listed");
    check(xml.includes("<loc>https://stapleseducation.com/ode/</loc>"),
        "ODE roadmap listed");
    check(!/<loc>[^<]*&(?!amp;|lt;|gt;|quot;|#)/.test(xml),
        "no unescaped ampersand in any <loc>");
});

await testCase("sitemap.xml deep-links all 19 ODE units with weekly changefreq", async () => {
    const res = await worker.fetch(sitemapRequest(), env);
    const xml = await res.text();
    for (let n = 0; n <= 18; n++) {
        check(xml.includes(`<loc>https://stapleseducation.com/ode/?unit=${n}</loc>`),
            `unit ${n} deep-link present`);
    }
    const unitLocs = (xml.match(/<loc>[^<]*\/ode\/\?unit=\d+<\/loc>/g) || []);
    check(unitLocs.length === 19, `exactly 19 unit URLs, got ${unitLocs.length}`);
    const urlBlocks = (xml.match(/<url>/g) || []).length;
    check(urlBlocks === 21, `21 total <url> blocks (2 pages + 19 units), got ${urlBlocks}`);
    const weekly = (xml.match(/<changefreq>weekly<\/changefreq>/g) || []).length;
    check(weekly === 21, `every entry pins weekly changefreq, got ${weekly}`);
});

await testCase("sitemap: per-unit <lastmod> dates are ISO-8601 and vary across units", async () => {
    const res = await worker.fetch(sitemapRequest(), env);
    const xml = await res.text();
    // Capture each unit URL's own <lastmod> from its <url> block.
    const perUnit = {};
    const re = /<url>\s*<loc>https:\/\/stapleseducation\.com\/ode\/\?unit=(\d+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g;
    let m;
    while ((m = re.exec(xml)) !== null) perUnit[m[1]] = m[2];
    const dates = Object.keys(perUnit).map((k) => perUnit[k]);
    check(dates.length === 19, `captured lastmod for all 19 units, got ${dates.length}`);
    check(dates.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)),
        "every unit lastmod is a well-formed ISO-8601 YYYY-MM-DD date");
    check(new Set(dates).size >= 2,
        `unit lastmod values vary across units (distinct=${new Set(dates).size})`);
    check(perUnit["1"] !== perUnit["0"],
        "per-unit dates are independent, not one global constant applied to all");
});

/* ---- Verdict ------------------------------------------------------------ */

rmSync(workDir, { recursive: true, force: true });

if (failures > 0) {
    console.error(`\n${failures} assertion(s) failed across ${caseNo} cases.`);
    process.exit(1);
}
console.log(`\nAll ${caseNo} cases passed (every malformed/tampered path 401s).`);
