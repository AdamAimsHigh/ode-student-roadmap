/* 15-case end-to-end cryptographic validation suite for src/worker.js.
 *
 * Exercises the /api/sync handler over both verification modes: full Google
 * ID-token verification (real RS256 signatures minted with node:crypto's
 * WebCrypto against a mocked JWKS endpoint) and the long-lived odesess_*
 * edge session tokens (hashed KV records, 30-day TTL). Malformed, tampered,
 * expired, and oversized inputs must all be rejected with 401/413/405.
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

globalThis.fetch = async (resource) => {
    if (String(resource) === JWKS_URL) {
        return new Response(JSON.stringify({ keys: [publicJwk] }), {
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
    keysWithPrefix(prefix) {
        return [...this.store.keys()].filter((k) => k.startsWith(prefix));
    }
    forceExpire(key) {
        const entry = this.store.get(key);
        if (entry) entry.expiresAt = Date.now() - 1000;
    }
}

const kv = new MockKV();
const env = { ODE_PROGRESS_KV: kv, GOOGLE_CLIENT_ID: CLIENT_ID };

function apiRequest(method, token, body) {
    const headers = {};
    if (token !== null) headers["Authorization"] = "Bearer " + token;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    return new Request("https://stapleseducation.com/api/sync", {
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

/* ---- The 15 cases ------------------------------------------------------- */

let sessionToken = null;   // captured in case 8, threaded through 10-15
const DAY_MS = 24 * 60 * 60 * 1000;

await testCase("non-GET/POST methods are refused with 405", async () => {
    const res = await worker.fetch(apiRequest("PUT", await signToken()), env);
    check(res.status === 405, `expected 405, got ${res.status}`);
    check(res.headers.get("Allow") === "GET, POST", "Allow header lists GET, POST");
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
    const saved = await kv.get("progress:" + SUB, "json");
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
    const saved = await kv.get("progress:" + SUB, "json");
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
    const saved = await kv.get("progress:" + SUB, "json");
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

/* ---- Verdict ------------------------------------------------------------ */

rmSync(workDir, { recursive: true, force: true });

if (failures > 0) {
    console.error(`\n${failures} assertion(s) failed across ${caseNo} cases.`);
    process.exit(1);
}
console.log(`\nAll ${caseNo} cases passed (every malformed/tampered path 401s).`);
