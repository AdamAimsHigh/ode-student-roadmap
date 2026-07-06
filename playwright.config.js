// @ts-check
/* Playwright configuration for the Staples Education headless-browser test
   harness (macro-sprint Bundle 4).

   INVARIANTS honored by this config:
   - Zero production impact. The specs only READ the shipped assets; nothing
     here writes to index.html, style.css, or the ode/ SPA. The static server
     below serves the repository root exactly as the deployed Worker's asset
     pipeline would, so the app runs unmodified.
   - No new runtime dependencies for the app. @playwright/test is a dev-only
     harness (already in package.json); it never ships. The .assetsignore
     deny-by-default allowlist excludes tests/ and this config from any
     Cloudflare upload by construction, so the production surface is untouched.
   - Local static emulation. webServer spins up Python's stdlib http.server
     over the repo root (the same lightweight server used for every prior
     local verification pass in this project — no extra install), giving the
     specs an http:// origin at which "/" is the landing storefront and
     "/ode/" is the roadmap SPA. Running over http (rather than file://)
     mirrors production routing and exercises the http-context code paths;
     the file:// invariant is a separate guarantee owned by the app itself. */

const { defineConfig, devices } = require("@playwright/test");

const HOST = "127.0.0.1";
const PORT = 4173;
const BASE_URL = `http://${HOST}:${PORT}`;

module.exports = defineConfig({
    testDir: "./tests",
    // Specs are independent; run them concurrently.
    fullyParallel: true,
    // A stray `test.only` left in a spec should fail CI, never silently skip.
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: "list",

    use: {
        baseURL: BASE_URL,
        headless: true,
        // Capture a trace on the first retry so a flake is debuggable without
        // re-instrumenting; no cost on the green path.
        trace: "on-first-retry",
        screenshot: "only-on-failure"
    },

    // Chromium-class validation boundary. Only the Chromium engine is
    // provisioned locally, so both the desktop and the mobile-emulation
    // project ride it. Additional engines (WebKit, Firefox) can be appended
    // here once their browser binaries are installed via
    // `npx playwright install`.
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] }
        }
    ],

    // Lightweight local static asset server. Serves the repo root so both the
    // landing storefront ("/") and the SPA ("/ode/") resolve exactly as they
    // do behind the Worker asset pipeline. Reused if already running locally.
    webServer: {
        command: `python -m http.server ${PORT} --bind ${HOST}`,
        url: `${BASE_URL}/index.html`,
        reuseExistingServer: !process.env.CI,
        timeout: 60 * 1000
    }
});
