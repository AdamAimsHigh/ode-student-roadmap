/* Service worker for the ODE Roadmap SPA.
 *
 * Strategy: cache-first with a network fallback. The versioned mathematical
 * dependencies (KaTeX, Math.js), the core layout document, the stylesheets,
 * and any locally self-hosted font binaries are served straight from the
 * Cache Storage the instant they are requested, so an already-visited
 * workbook opens with zero network latency and keeps working offline.
 *
 * Zero-dependency contract (WEBSITE_BLUEPRINT Pillar 1): this file is a plain
 * script with no imports and no build step. It is a PURE PROGRESSIVE
 * ENHANCEMENT. The SPA remains fully functional when this worker never
 * registers, which is exactly what happens under the file:// disk contract:
 * browsers refuse to register a service worker from a file:// origin, and the
 * registration snippet in index.html is additionally gated on an https:
 * origin. The guards below are belt-and-suspenders so that even if this
 * script is somehow evaluated off a disk origin it installs nothing, caches
 * nothing, and intercepts nothing, i.e. it never enters a lifecycle loop. */

var CACHE_VERSION = "ode-pwa-v1";
var RUNTIME_CACHE = CACHE_VERSION + "-runtime";

/* Disk run detection. A service worker cannot normally reach a file:// origin,
   but if one ever does it must be completely inert rather than trap the page
   in an install/activate churn. */
var DISK_RUN = self.location.protocol === "file:";

/* Same-origin core shell, document-relative to this worker (which lives at
   /ode/sw.js, so "./" is the SPA root). Kept deliberately small: precaching a
   URL that 404s would abort the whole addAll, so only assets guaranteed to
   exist are listed here. Everything else (the widget/view JS, CDN math
   libraries, fonts) is cached lazily on first fetch by the handler below. */
var CORE_ASSETS = [
    "./",
    "./index.html",
    "./css/theme.css",
    "./css/main.css",
    "./js/curriculum-data.js",
    "./js/state.js",
    "./js/router.js"
];

/* Cross-origin hosts whose immutable, versioned artifacts are safe to keep in
   the runtime cache (KaTeX + Math.js are pinned to fixed versions in the SRI
   contract, so a cached copy can never go stale under us). */
var CACHEABLE_HOSTS = [
    "cdn.jsdelivr.net",
    "cdnjs.cloudflare.com"
];

self.addEventListener("install", function (event) {
    if (DISK_RUN) return;
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function (cache) {
            /* Tolerate an individual miss: cache what resolves rather than
               failing the entire install if one shell asset is unavailable. */
            return Promise.all(CORE_ASSETS.map(function (url) {
                return cache.add(url).catch(function () { return null; });
            }));
        }).then(function () {
            return self.skipWaiting();
        })
    );
});

self.addEventListener("activate", function (event) {
    if (DISK_RUN) return;
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (key) {
                if (key !== CACHE_VERSION && key !== RUNTIME_CACHE) {
                    return caches.delete(key);
                }
                return null;
            }));
        }).then(function () {
            return self.clients.claim();
        })
    );
});

function isCacheableCrossOrigin(url) {
    return CACHEABLE_HOSTS.indexOf(url.hostname) !== -1;
}

/* Cache-first: serve the cached copy immediately when present; otherwise go to
   the network, store a clone for next time, and return the live response. On a
   hard network failure a navigation falls back to the cached shell so the app
   still boots offline. */
self.addEventListener("fetch", function (event) {
    if (DISK_RUN) return;
    var request = event.request;
    if (request.method !== "GET") return;

    var url = new URL(request.url);
    var sameOrigin = url.origin === self.location.origin;

    /* Never cache API traffic: /api/sync and /api/contact must always hit the
       live Worker so progress and lead capture stay authoritative. */
    if (sameOrigin && url.pathname.indexOf("/api/") === 0) return;

    /* Only intercept our own assets and the whitelisted math CDNs; leave every
       other cross-origin request (Desmos, Google Identity, analytics) on the
       default network path untouched. */
    if (!sameOrigin && !isCacheableCrossOrigin(url)) return;

    event.respondWith(
        caches.match(request).then(function (cached) {
            if (cached) return cached;
            return fetch(request).then(function (response) {
                /* Only cache successful, cacheable responses. Opaque
                   cross-origin responses (status 0) are still stored so the
                   CDN libraries survive an offline reload. */
                var storable = response &&
                    (response.status === 200 || response.type === "opaque");
                if (storable) {
                    var copy = response.clone();
                    caches.open(RUNTIME_CACHE).then(function (cache) {
                        cache.put(request, copy);
                    });
                }
                return response;
            }).catch(function () {
                /* Offline and uncached: fall back to the app shell for
                   navigations so the SPA still renders from local data. */
                if (request.mode === "navigate") {
                    return caches.match("./index.html");
                }
                return Response.error();
            });
        })
    );
});
