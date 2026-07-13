/* Staples Education Student Portal, the apex hub of the Hub-and-Spoke
   campus model (2026-07-11).

   One lightweight, zero-dependency shell at /portal/ that owns everything
   campus-wide while the subject spokes (/ode/, and future classrooms) stay
   purely pedagogical:

   - The Course Library grid: one card per subject classroom, deep-linking
     into its spoke by document-relative path so the hub works identically
     over file:// and from /portal/ in production.
   - The unified SSO surface. The hub reuses the SAME namespaced
     localStorage credential keys as the spokes (ode_google_credential,
     ode_cloud_session) on the same origin, so one sign-in anywhere on the
     campus is a sign-in everywhere. GIS is initialized programmatically on
     load, the Worker session-exchange loop is identical to state.js, and
     every network call is protocol-guarded so file:// opens degrade to the
     course library alone.
   - The business surface (migrated from ode/js/views-settings.js): the
     student package list, and the Tutor Admin Console (Package Manager,
     Group Session Builder, Package Ledger, Session Ledger). Role split is
     edge-evaluated by /api/packages exactly as before; this hub is now the
     ONLY client that invokes that endpoint.
   - The adaptive theme engine: the shared ode_theme_preference key drives
     the same [data-theme] attribute flip as the spokes, with a live
     matchMedia listener for the system preference.

   Classic script, no ES modules, no build step, no framework. Copy rule:
   professional terminology only (Packages, Group Sessions, Fundamentals),
   no em-dashes, no ampersands. */

const ODEPortal = (function () {

    const GIS_CLIENT_ID =
        "422031597298-sa519hc2p023v4koialdum75crip6890.apps.googleusercontent.com";
    const PACKAGES_ENDPOINT = "/api/packages";
    const SYNC_ENDPOINT = "/api/sync";
    const CREDENTIAL_KEY = "ode_google_credential";
    const SESSION_KEY = "ode_cloud_session";
    const THEME_KEY = "ode_theme_preference";

    /* Course Library registry. path is document-relative from /portal/ so
       the same tree resolves over file:// and in production. Locked cards
       carry no path and render a coming-soon badge instead of a link. */
    const COURSE_LIBRARY = [
        {
            title: "Ordinary Differential Equations",
            description: "The complete first-principles roadmap: 19 units from what a differential equation is through Fourier series and PDEs, with interactive checkpoints, adaptive practice, and your statistics dashboard.",
            path: "../ode/",
            cta: "Enter Classroom"
        },
        {
            title: "Linear Algebra Foundations",
            description: "Vectors, matrices, eigenvalues, and the geometry underneath them, rebuilt from first principles. In development.",
            locked: true
        },
        {
            title: "Calculus Reset",
            description: "Limits, derivatives, and integrals as ideas you own rather than rules you memorize. In development.",
            locked: true
        }
    ];

    /* ---- Theme engine (shared ode_theme_preference key) ------------------ */

    /* System-default lighting engine (2026-07-12): "system" means NO
       data-theme attribute, letting the prefers-color-scheme block in the
       inline stylesheet follow the OS natively (live toggles included,
       with zero JavaScript in the path). A manual choice stamps the
       attribute explicitly and overrides the OS base in both directions. */
    function getStoredTheme() {
        try {
            const pref = localStorage.getItem(THEME_KEY);
            if (pref === "light" || pref === "dark" || pref === "system") return pref;
        } catch (err) { /* storage unavailable */ }
        return "system";
    }

    function applyTheme(pref) {
        if (pref === "light" || pref === "dark") {
            document.documentElement.setAttribute("data-theme", pref);
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
        document.querySelectorAll(".theme-btn").forEach(function (btn) {
            btn.classList.toggle("active",
                btn.getAttribute("data-theme-choice") === pref);
        });
    }

    function initTheme() {
        applyTheme(getStoredTheme());
        document.querySelectorAll(".theme-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                const choice = btn.getAttribute("data-theme-choice");
                try { localStorage.setItem(THEME_KEY, choice); } catch (err) { }
                applyTheme(choice);
            });
        });
    }

    /* ---- Shared-credential SSO loop (mirrors ode/js/state.js) ------------- */

    function httpContext() {
        return window.location.protocol === "http:" ||
            window.location.protocol === "https:";
    }

    function readJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch (err) {
            return fallback;
        }
    }

    /* Vanilla Base64URL decoder for JWT payload segments (mirrors state.js):
       map the URL-safe alphabet back to classic Base64, restore padding,
       atob, then rebuild multi-byte UTF-8 sequences via percent-escapes so
       non-ASCII profile names decode correctly. */
    function decodeBase64Url(segment) {
        let base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4 !== 0) base64 += "=";
        const bytes = atob(base64);
        let escaped = "";
        for (let i = 0; i < bytes.length; i++) {
            const hex = bytes.charCodeAt(i).toString(16);
            escaped += "%" + (hex.length < 2 ? "0" : "") + hex;
        }
        return decodeURIComponent(escaped);
    }

    function decodeCredentialPayload(credential) {
        try {
            return JSON.parse(decodeBase64Url(credential.split(".")[1]));
        } catch (err) {
            return null;
        }
    }

    function getStoredCredential() {
        try {
            const credential = localStorage.getItem(CREDENTIAL_KEY);
            if (!credential) return null;
            const payload = decodeCredentialPayload(credential);
            if (!payload || !payload.exp || payload.exp * 1000 < Date.now() + 15000) {
                localStorage.removeItem(CREDENTIAL_KEY);
                return null;
            }
            return credential;
        } catch (err) {
            return null;
        }
    }

    function getStoredSession() {
        const session = readJSON(SESSION_KEY, null);
        if (!session || typeof session.token !== "string") return null;
        if (session.expiresAt &&
            Date.parse(session.expiresAt) < Date.now() + 60000) {
            clearStoredSession();
            return null;
        }
        return session;
    }

    function clearStoredSession() {
        try { localStorage.removeItem(SESSION_KEY); } catch (err) { }
    }

    function adoptSession(body) {
        if (!body || !body.session || typeof body.session.token !== "string") {
            return;
        }
        const credential = getStoredCredential();
        const payload = credential
            ? decodeCredentialPayload(credential) || {}
            : {};
        const previous = readJSON(SESSION_KEY, null) || {};
        try {
            /* The display profile (name, picture) rides with the session so
               the identity header still renders after the short-lived Google
               credential expires and only the edge session remains. */
            localStorage.setItem(SESSION_KEY, JSON.stringify({
                token: body.session.token,
                expiresAt: body.session.expiresAt || null,
                email: payload.email || previous.email || null,
                name: payload.name || previous.name || null,
                picture: payload.picture || previous.picture || null
            }));
        } catch (err) { /* storage unavailable */ }
    }

    function pickAuthToken() {
        const session = getStoredSession();
        if (session) return { token: session.token, kind: "session" };
        const credential = getStoredCredential();
        if (credential) return { token: credential, kind: "google" };
        return null;
    }

    function isSignedIn() {
        return Boolean(getStoredSession() || getStoredCredential());
    }

    /* Display profile for the identity header, preferring the fresh Google
       claims and falling back to the profile cached on the edge session. */
    function signedInProfile() {
        const credential = getStoredCredential();
        const payload = credential
            ? decodeCredentialPayload(credential) || {}
            : {};
        const session = getStoredSession();
        return {
            email: payload.email || (session && session.email) || null,
            name: payload.name || (session && session.name) || null,
            picture: payload.picture || (session && session.picture) || null
        };
    }

    function signedInEmail() {
        return signedInProfile().email;
    }

    /* Authenticated same-origin fetch with the standard lifecycle: session
       token preferred, Google credential fallback, one 401 retry after a
       dropped session. Rejects when signed out or under file://. */
    function authFetch(url, options) {
        const auth = pickAuthToken();
        if (!auth) return Promise.reject(new Error("signed out"));
        if (!httpContext()) return Promise.reject(new Error("file context"));
        const init = {
            method: options.method,
            headers: { "Authorization": "Bearer " + auth.token }
        };
        if (options.body) {
            init.headers["Content-Type"] = "application/json";
            init.body = options.body;
        }
        return fetch(url, init).then(function (res) {
            if (res.status === 401 && auth.kind === "session" && !options.retried) {
                clearStoredSession();
                options.retried = true;
                return authFetch(url, options);
            }
            return res;
        });
    }

    /* ---- Google Identity surfaces ------------------------------------------ */

    let gisInitialized = false;
    let gisButtonRendered = false;

    function gisApi() {
        return (window.google && google.accounts && google.accounts.id) || null;
    }

    /* The signed-in header is a silent identity cluster: a circular Google
       avatar (initial-letter fallback when no picture claim is present)
       whose dropdown menu holds the name, the email, and sign out. */
    function setAuthUI() {
        const signedIn = isSignedIn();
        const info = signedIn ? signedInProfile() : {};
        const slot = document.getElementById("auth-signin-slot");
        const status = document.getElementById("auth-status");
        const label = document.getElementById("auth-status-label");
        const email = document.getElementById("auth-status-email");
        const avatar = document.getElementById("auth-avatar");
        const fallback = document.getElementById("auth-avatar-fallback");
        if (slot) slot.hidden = signedIn;
        if (status) status.hidden = !signedIn;
        const displayName = info.name || info.email || null;
        if (label) label.textContent = displayName || "Signed in";
        if (email) {
            email.textContent = info.name && info.email ? info.email : "";
            email.hidden = !email.textContent;
        }
        if (fallback) {
            fallback.textContent = displayName
                ? displayName.trim().charAt(0).toUpperCase() : "";
        }
        if (avatar) {
            if (signedIn && info.picture) {
                if (avatar.getAttribute("src") !== info.picture) {
                    avatar.src = info.picture;
                }
                avatar.hidden = false;
                if (fallback) fallback.hidden = true;
            } else {
                avatar.removeAttribute("src");
                avatar.hidden = true;
                if (fallback) fallback.hidden = false;
            }
        }
    }

    function syncGoogleSurfaces() {
        const api = gisApi();
        if (!api || !gisInitialized || isSignedIn()) return;
        const slot = document.getElementById("auth-signin-slot");
        if (slot && !gisButtonRendered) {
            try {
                /* The leanest label GIS offers ("Sign in"); mirrors the
                   spoke's log-in control, see state.js. */
                api.renderButton(slot, {
                    type: "standard",
                    shape: "pill",
                    theme: "outline",
                    text: "signin",
                    size: "medium"
                });
                gisButtonRendered = true;
            } catch (err) {
                console.debug("GIS button render skipped:", err);
            }
        }
        try {
            api.prompt();
        } catch (err) {
            console.debug("GIS One Tap prompt skipped:", err);
        }
    }

    function initGoogleIdentity() {
        const api = gisApi();
        if (!api || gisInitialized) return;
        try {
            api.initialize({
                client_id: GIS_CLIENT_ID,
                callback: window.odePortalHandleGoogleCredential,
                auto_select: true,
                itp_support: true,
                context: "signin"
            });
            gisInitialized = true;
        } catch (err) {
            console.debug("GIS init skipped:", err);
            return;
        }
        syncGoogleSurfaces();
    }

    window.onGoogleLibraryLoad = initGoogleIdentity;

    window.odePortalHandleGoogleCredential = function (response) {
        if (!response || !response.credential) return;
        try {
            localStorage.setItem(CREDENTIAL_KEY, response.credential);
        } catch (err) {
            console.debug("Credential storage unavailable:", err);
            return;
        }
        setAuthUI();
        const api = gisApi();
        if (api && typeof api.cancel === "function") {
            try { api.cancel(); } catch (err) { /* prompt already closed */ }
        }
        renderPortal();
    };

    /* Sign-out mirrors the spoke: best-effort server-side revocation of the
       edge session (identity is campus-wide, so DELETE /api/sync kills it
       for every app at once), then the unconditional local dump. */
    function signOut() {
        const session = getStoredSession();
        if (session && httpContext()) {
            try {
                fetch(SYNC_ENDPOINT, {
                    method: "DELETE",
                    headers: { "Authorization": "Bearer " + session.token },
                    keepalive: true
                }).catch(function (err) {
                    console.debug("Session revocation skipped:", err);
                });
            } catch (err) {
                console.debug("Session revocation skipped:", err);
            }
        }
        try { localStorage.removeItem(CREDENTIAL_KEY); } catch (err) { }
        clearStoredSession();
        const api = gisApi();
        if (api) api.disableAutoSelect();
        setAuthUI();
        syncGoogleSurfaces();
        renderPortal();
    }

    /* ---- Course Library ------------------------------------------------------ */

    function buildCourseLibrary() {
        const section = document.createElement("section");
        section.className = "portal-section";

        const title = document.createElement("h2");
        title.className = "portal-section-title";
        title.textContent = "Course Library";
        section.appendChild(title);

        const sub = document.createElement("p");
        sub.className = "portal-section-sub";
        sub.textContent = "Every classroom runs in your browser with nothing to install. Progress syncs to your account when you are signed in.";
        section.appendChild(sub);

        const grid = document.createElement("div");
        grid.className = "course-grid";
        COURSE_LIBRARY.forEach(function (course) {
            const card = document.createElement("div");
            card.className = "course-card " + (course.locked ? "locked" : "active");

            const heading = document.createElement("h3");
            heading.className = "course-card-title";
            heading.textContent = course.title;
            card.appendChild(heading);

            const desc = document.createElement("p");
            desc.className = "course-card-desc";
            desc.textContent = course.description;
            card.appendChild(desc);

            if (course.locked) {
                const badge = document.createElement("span");
                badge.className = "course-card-badge";
                badge.textContent = "Coming Soon";
                card.appendChild(badge);
            } else {
                const link = document.createElement("a");
                link.className = "course-card-cta";
                link.href = course.path;
                link.textContent = course.cta;
                card.appendChild(link);
            }
            grid.appendChild(card);
        });
        section.appendChild(grid);
        return section;
    }

    /* ---- Role area (student packages / tutor admin console) ------------------ */

    function portalNote(host, text) {
        host.innerHTML = "";
        const note = document.createElement("p");
        note.className = "portal-note";
        note.textContent = text;
        host.appendChild(note);
    }

    function loadRoleArea(host) {
        if (!httpContext()) {
            portalNote(host,
                "Sign-in and package tools are available on the online portal at stapleseducation.com/portal/. The course library above works everywhere.");
            return;
        }
        if (!isSignedIn()) {
            portalNote(host,
                "Sign in with Google above to see your tutoring packages.");
            return;
        }
        portalNote(host, "Checking your account.");
        authFetch(PACKAGES_ENDPOINT, { method: "GET" }).then(function (res) {
            if (!res.ok) throw new Error("status " + res.status);
            return res.json();
        }).then(function (body) {
            adoptSession(body);
            setAuthUI();
            if (body.role === "owner") {
                renderOwnerConsole(host, body);
            } else {
                renderStudentPackages(host, body);
            }
        }).catch(function (err) {
            console.debug("Package probe skipped:", err);
            portalNote(host,
                "Your packages could not be loaded right now. They will appear here next time.");
        });
    }

    function packageStatusChip(status) {
        const chip = document.createElement("span");
        chip.className = "pkg-status pkg-status-" + status;
        chip.textContent = status === "quoted" ? "Quoted"
            : status === "active" ? "Active" : "Completed";
        return chip;
    }

    function packageHoursLine(pkg) {
        const used = Math.round(((pkg.minutesLogged || 0) / 60) * 10) / 10;
        return used + " of " + pkg.hours + " hours used";
    }

    function renderStudentPackages(host, body) {
        host.innerHTML = "";
        const card = document.createElement("section");
        card.className = "portal-card";
        const title = document.createElement("h3");
        title.className = "portal-card-title";
        title.textContent = "Your Tutoring Packages";
        card.appendChild(title);

        if (!body.packages || !body.packages.length) {
            const note = document.createElement("p");
            note.className = "portal-hint";
            note.textContent = "No packages on your account yet. Packages appear here once your tutor sets one up.";
            card.appendChild(note);
        } else {
            body.packages.forEach(function (pkg) {
                const row = document.createElement("div");
                row.className = "pkg-row";
                const rowTitle = document.createElement("p");
                rowTitle.className = "pkg-row-title";
                rowTitle.textContent = pkg.label;
                rowTitle.appendChild(packageStatusChip(pkg.status));
                row.appendChild(rowTitle);
                const meta = document.createElement("p");
                meta.className = "pkg-row-meta";
                meta.textContent = packageHoursLine(pkg);
                row.appendChild(meta);
                card.appendChild(row);
            });
        }
        host.appendChild(card);
    }

    /* ---- Tutor Admin Console (migrated from ode/js/views-settings.js) -------- */

    function adminField(labelText, input) {
        const wrap = document.createElement("label");
        wrap.className = "admin-field";
        const label = document.createElement("span");
        label.className = "admin-field-label";
        label.textContent = labelText;
        wrap.appendChild(label);
        wrap.appendChild(input);
        return wrap;
    }

    function adminInput(type, placeholder) {
        const input = document.createElement("input");
        input.type = type;
        input.className = "admin-input";
        if (placeholder) input.placeholder = placeholder;
        return input;
    }

    function postPackageAction(payload, statusEl, host) {
        statusEl.textContent = "Working.";
        statusEl.className = "admin-status";
        authFetch(PACKAGES_ENDPOINT, {
            method: "POST",
            body: JSON.stringify(payload)
        }).then(function (res) {
            return res.json().then(function (body) {
                return { ok: res.ok, body: body };
            });
        }).then(function (result) {
            if (!result.ok) {
                statusEl.textContent = result.body && result.body.error
                    ? result.body.error : "That action could not be completed.";
                statusEl.className = "admin-status error";
                return;
            }
            loadRoleArea(host);
        }).catch(function (err) {
            console.debug("Package action skipped:", err);
            statusEl.textContent = "Network problem. Please try again.";
            statusEl.className = "admin-status error";
        });
    }

    function wyzantTranslationLine(entry) {
        const flat = entry.priceUsd !== undefined
            ? "$" + entry.priceUsd + " flat"
            : "$" + entry.pricePerStudentUsd + " per student flat";
        return flat + ", " + entry.hours + " hours ($" +
            entry.wyzantHourlyUsd + " per hour Wyzant rate)";
    }

    function adminSection(title) {
        const section = document.createElement("div");
        section.className = "admin-section";
        const heading = document.createElement("h3");
        heading.className = "portal-card-title";
        heading.textContent = title;
        section.appendChild(heading);
        return section;
    }

    function buildCatalogSection(catalog) {
        const section = adminSection("Package Catalog");
        const row = document.createElement("div");
        row.className = "catalog-row";
        Object.keys(catalog || {}).forEach(function (type) {
            const entry = catalog[type];
            const card = document.createElement("div");
            card.className = "catalog-card";
            const title = document.createElement("h4");
            title.className = "catalog-card-title";
            title.textContent = entry.label;
            card.appendChild(title);
            const price = document.createElement("p");
            price.className = "catalog-card-price";
            price.textContent = wyzantTranslationLine(entry);
            card.appendChild(price);
            row.appendChild(card);
        });
        section.appendChild(row);
        const note = document.createElement("p");
        note.className = "portal-hint";
        note.textContent = "All billing runs through Wyzant. Quote the flat package, then set the student's custom Wyzant rate to the per-hour translation shown above.";
        section.appendChild(note);
        return section;
    }

    function buildCreatePackageSection(body, status, host) {
        const section = adminSection("Create a Package Quote");
        const form = document.createElement("div");
        form.className = "admin-form";

        const email = adminInput("email", "student@example.com");
        const sub = adminInput("text", "Optional, links the student's account");
        const select = document.createElement("select");
        select.className = "admin-input";
        Object.keys(body.catalog || {}).forEach(function (type) {
            if (body.catalog[type].scope !== "individual") return;
            const option = document.createElement("option");
            option.value = type;
            option.textContent = body.catalog[type].label;
            select.appendChild(option);
        });

        form.appendChild(adminField("Student email", email));
        form.appendChild(adminField("Student account id", sub));
        form.appendChild(adminField("Package", select));

        const submit = document.createElement("button");
        submit.type = "button";
        submit.className = "primary-btn";
        submit.textContent = "Create Quote";
        submit.addEventListener("click", function () {
            postPackageAction({
                action: "create",
                studentEmail: email.value,
                studentSub: sub.value.trim(),
                type: select.value
            }, status, host);
        });
        form.appendChild(submit);
        section.appendChild(form);
        return section;
    }

    function buildGroupBuilderSection(body, status, host) {
        const section = adminSection("Group Session Builder");
        const form = document.createElement("div");
        form.className = "admin-form";

        const title = adminInput("text", "For example: Laplace Transform Group Session");
        form.appendChild(adminField("Session title", title));

        const emails = [];
        for (let i = 1; i <= 4; i++) {
            const input = adminInput("email", "Student " + i +
                (i > 1 ? " (optional)" : ""));
            emails.push(input);
            form.appendChild(adminField("Student " + i, input));
        }
        const date = adminInput("date", "");
        form.appendChild(adminField("Scheduled date", date));

        const submit = document.createElement("button");
        submit.type = "button";
        submit.className = "primary-btn";
        submit.textContent = "Create Group Session";
        submit.addEventListener("click", function () {
            const roster = emails.map(function (input) {
                return input.value.trim();
            }).filter(Boolean);
            postPackageAction({
                action: "create-group",
                title: title.value,
                studentEmails: roster,
                scheduledFor: date.value || null
            }, status, host);
        });
        form.appendChild(submit);
        section.appendChild(form);
        return section;
    }

    function buildLedgerSection(body, status, host) {
        const section = adminSection("Package Ledger");
        const packages = body.packages || [];
        if (!packages.length) {
            const note = document.createElement("p");
            note.className = "portal-hint";
            note.textContent = "No packages yet. Create the first quote above.";
            section.appendChild(note);
            return section;
        }
        packages.forEach(function (pkg) {
            const row = document.createElement("div");
            row.className = "pkg-row";

            const title = document.createElement("p");
            title.className = "pkg-row-title";
            title.textContent = pkg.scope === "group"
                ? (pkg.title || pkg.label)
                : pkg.label + " for " + (pkg.studentEmail || "unknown");
            title.appendChild(packageStatusChip(pkg.status));
            row.appendChild(title);

            const meta = document.createElement("p");
            meta.className = "pkg-row-meta";
            let metaText = packageHoursLine(pkg);
            if (pkg.scope === "group" && Array.isArray(pkg.roster)) {
                metaText += ". Roster: " + pkg.roster.join(", ");
            }
            if (pkg.subSegment === "unassigned") {
                metaText += ". Awaiting account link.";
            }
            meta.textContent = metaText;
            row.appendChild(meta);

            const actions = document.createElement("div");
            actions.className = "pkg-row-actions";
            if (pkg.status === "quoted") {
                const activate = document.createElement("button");
                activate.type = "button";
                activate.className = "secondary-btn";
                activate.textContent = "Activate";
                activate.addEventListener("click", function () {
                    postPackageAction({
                        action: "set-status", sub: pkg.subSegment,
                        pkgId: pkg.id, status: "active"
                    }, status, host);
                });
                actions.appendChild(activate);
            }
            if (pkg.status === "active") {
                const complete = document.createElement("button");
                complete.type = "button";
                complete.className = "secondary-btn";
                complete.textContent = "Mark Completed";
                complete.addEventListener("click", function () {
                    postPackageAction({
                        action: "set-status", sub: pkg.subSegment,
                        pkgId: pkg.id, status: "completed"
                    }, status, host);
                });
                actions.appendChild(complete);

                const minutes = adminInput("number", "Minutes");
                minutes.min = "15";
                minutes.max = "480";
                minutes.className += " admin-input-minutes";
                const note = adminInput("text", "Session note (optional)");
                const log = document.createElement("button");
                log.type = "button";
                log.className = "secondary-btn";
                log.textContent = "Log Session";
                log.addEventListener("click", function () {
                    postPackageAction({
                        action: "log-session", sub: pkg.subSegment,
                        pkgId: pkg.id, minutes: parseInt(minutes.value, 10),
                        note: note.value
                    }, status, host);
                });
                actions.appendChild(minutes);
                actions.appendChild(note);
                actions.appendChild(log);
            }
            if (actions.childNodes.length) row.appendChild(actions);
            section.appendChild(row);
        });
        return section;
    }

    function buildSessionLogSection(body) {
        const section = adminSection("Session Ledger");
        const entries = [];
        (body.packages || []).forEach(function (pkg) {
            (pkg.sessions || []).forEach(function (session) {
                entries.push({
                    date: session.date,
                    minutes: session.minutes,
                    note: session.note || "",
                    who: pkg.scope === "group"
                        ? (pkg.title || pkg.label)
                        : (pkg.studentEmail || pkg.label)
                });
            });
        });
        if (!entries.length) {
            const note = document.createElement("p");
            note.className = "portal-hint";
            note.textContent = "No sessions logged yet. Log the first one from an active package above.";
            section.appendChild(note);
            return section;
        }
        entries.sort(function (a, b) {
            return String(b.date).localeCompare(String(a.date));
        });
        const totalMinutes = entries.reduce(function (sum, e) {
            return sum + (e.minutes || 0);
        }, 0);
        const total = document.createElement("p");
        total.className = "portal-hint";
        total.textContent = entries.length + " sessions logged, " +
            Math.round((totalMinutes / 60) * 10) / 10 + " hours total.";
        section.appendChild(total);

        const list = document.createElement("ul");
        list.className = "session-log-list";
        entries.slice(0, 15).forEach(function (entry) {
            const li = document.createElement("li");
            li.className = "session-log-item";
            li.textContent = entry.date + ", " + entry.who + ", " +
                entry.minutes + " minutes" +
                (entry.note ? ". " + entry.note : "");
            list.appendChild(li);
        });
        section.appendChild(list);
        return section;
    }

    function renderOwnerConsole(host, body) {
        host.innerHTML = "";
        const console_ = document.createElement("section");
        console_.className = "admin-console";

        const heading = document.createElement("h2");
        heading.className = "admin-console-title";
        heading.textContent = "Tutor Admin Console";
        console_.appendChild(heading);

        const hint = document.createElement("p");
        hint.className = "portal-hint";
        hint.textContent = "Signed in as the tutor account (id " + body.sub + ").";
        console_.appendChild(hint);

        const status = document.createElement("p");
        status.className = "admin-status";
        console_.appendChild(status);

        console_.appendChild(buildCatalogSection(body.catalog));
        console_.appendChild(buildCreatePackageSection(body, status, host));
        console_.appendChild(buildGroupBuilderSection(body, status, host));
        console_.appendChild(buildLedgerSection(body, status, host));
        console_.appendChild(buildSessionLogSection(body));

        host.appendChild(console_);
    }

    /* ---- Root render ----------------------------------------------------------- */

    function renderPortal() {
        const main = document.getElementById("portal-content");
        if (!main) return;
        main.innerHTML = "";
        main.appendChild(buildCourseLibrary());

        const roleSection = document.createElement("section");
        roleSection.className = "portal-section";
        /* Anchor target for the header's gear icon (#settings): the account
           section is the hub's settings surface. */
        roleSection.id = "settings";
        const roleTitle = document.createElement("h2");
        roleTitle.className = "portal-section-title";
        roleTitle.textContent = "Your Account";
        roleSection.appendChild(roleTitle);
        const roleHost = document.createElement("div");
        roleSection.appendChild(roleHost);
        main.appendChild(roleSection);

        loadRoleArea(roleHost);
    }

    function boot() {
        initTheme();
        setAuthUI();
        const signout = document.getElementById("auth-signout");
        if (signout) signout.addEventListener("click", signOut);
        /* A Google avatar URL that fails to load falls back silently to the
           initial-letter badge. */
        const avatar = document.getElementById("auth-avatar");
        if (avatar) {
            avatar.addEventListener("error", function () {
                avatar.hidden = true;
                const fallback = document.getElementById("auth-avatar-fallback");
                if (fallback) fallback.hidden = false;
            });
        }
        renderPortal();
        /* Covers the edge where the GIS SDK finished loading before this
           module ran (onGoogleLibraryLoad would then never fire for us). */
        initGoogleIdentity();
    }

    document.addEventListener("DOMContentLoaded", boot);

    return {
        renderPortal: renderPortal,
        courseLibrary: COURSE_LIBRARY
    };
})();
