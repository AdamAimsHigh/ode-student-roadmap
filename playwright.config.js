// Playwright configuration for the client-side smoke suite (Audit Rec #2).
//
// The suite boots ode/index.html directly over the file:// scheme, honoring the
// SPA's zero-dependency execution contract (Pillar 1) -- there is no dev server
// and no webServer block here on purpose. Chromium only: the goal is a fast,
// deterministic pre-flight gate wired into `npm run verify`, not cross-engine
// coverage. Viewport breadth is exercised inside the spec via setViewportSize.
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    reporter: [["list"]],
    timeout: 30000,
    use: {
        headless: true,
        // Subresources are blocked per-test (see blockExternal); this is a
        // belt-and-suspenders default so a stray navigation never hangs on a CDN.
        navigationTimeout: 15000
    },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } }
    ]
});
