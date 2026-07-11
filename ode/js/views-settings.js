/* Spoke Settings view, the #settings route (Hub-and-Spoke model, 2026-07-11).

   This is the SUBJECT SPOKE's settings surface, scoped strictly to
   pedagogical parameters and local client preferences: the local profile
   card, the visual theme selector, the learning mode toggle, and the local
   data controls (progress reset, cache clear).

   Everything business-side — the student package list and the Tutor Admin
   Console (Package Manager, Group Session Builder, Package Ledger, Session
   Ledger) — lives in the apex hub at /portal/ (portal/app.js), the single
   client of the /api/packages endpoint. This spoke never invokes that
   endpoint; it only links across to the hub. Identity stays unified: the
   hub and every spoke share the same ode_* credential keys on the same
   origin, so the student is already signed in when they land there.

   Classic script loaded before router.js, fully file:// executable.
   Copy rule: no em-dashes, no ampersands. */

function renderSettings(container) {
    buildIndexShell(container, "Profile and Settings",
        "Your study preferences and your local data, all in one place.");

    const grid = document.createElement("div");
    grid.className = "settings-grid";
    grid.appendChild(buildProfileCard());
    grid.appendChild(buildPreferencesCard());
    grid.appendChild(buildDataCard());
    container.appendChild(grid);
}

/* ---- Cards ---------------------------------------------------------------- */

function settingsCard(title) {
    const card = document.createElement("section");
    card.className = "settings-card";
    const heading = document.createElement("h3");
    heading.className = "settings-card-title";
    heading.textContent = title;
    card.appendChild(heading);
    return card;
}

function settingsRow(card, label, valueText) {
    const row = document.createElement("p");
    row.className = "settings-row";
    const key = document.createElement("span");
    key.className = "settings-row-label";
    key.textContent = label;
    const value = document.createElement("span");
    value.className = "settings-row-value";
    value.textContent = valueText;
    row.appendChild(key);
    row.appendChild(value);
    card.appendChild(row);
    return value;
}

function buildProfileCard() {
    const card = settingsCard("Profile");
    const auth = ODEState.getAuthInfo();

    settingsRow(card, "Account", auth.signedIn
        ? (auth.email || "Signed in")
        : "Working locally, not signed in");
    settingsRow(card, "Cloud sync", !auth.httpContext
        ? "Unavailable offline, progress stays in this browser"
        : (auth.signedIn ? "Active" : "Sign in above to enable sync"));

    const watched = ODEState.getWatchedVideos().length;
    const checkpoints = Object.keys(ODEState.getPassedCheckpoints()).length;
    const events = typeof ODETelemetry !== "undefined"
        ? ODETelemetry.getEvents().length : 0;
    settingsRow(card, "Videos watched", String(watched));
    settingsRow(card, "Checkpoints passed", String(checkpoints));
    settingsRow(card, "Practice events recorded", String(events));

    /* Account-level surfaces (tutoring packages, the course library) live
       in the campus hub. The link is document-relative so it resolves from
       /ode/ in production and from a local checkout alike. */
    const portalNote = document.createElement("p");
    portalNote.className = "settings-note";
    portalNote.textContent = "Your tutoring packages and the full course library live in the Student Portal.";
    card.appendChild(portalNote);

    const portalLink = document.createElement("a");
    portalLink.className = "pdf-download-btn";
    portalLink.href = "../portal/";
    portalLink.textContent = "Open the Student Portal";
    card.appendChild(portalLink);

    return card;
}

function buildPreferencesCard() {
    const card = settingsCard("Preferences");

    const themeLabel = document.createElement("p");
    themeLabel.className = "settings-row-label settings-group-label";
    themeLabel.textContent = "Visual theme";
    card.appendChild(themeLabel);

    const themeRow = document.createElement("div");
    themeRow.className = "settings-toggle-row";
    [["light", "Light"], ["dark", "Dark"], ["system", "System"]]
        .forEach(function (pair) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "settings-toggle-btn" +
                (getStoredThemePreference() === pair[0] ? " active" : "");
            btn.textContent = pair[1];
            btn.addEventListener("click", function () {
                setThemePreference(pair[0]);
                themeRow.querySelectorAll(".settings-toggle-btn")
                    .forEach(function (b) { b.classList.remove("active"); });
                btn.classList.add("active");
            });
            themeRow.appendChild(btn);
        });
    card.appendChild(themeRow);

    const modeLabel = document.createElement("p");
    modeLabel.className = "settings-row-label settings-group-label";
    modeLabel.textContent = "Learning mode";
    card.appendChild(modeLabel);

    const modeRow = document.createElement("div");
    modeRow.className = "settings-toggle-row";
    ODEModes.MODES.forEach(function (mode) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "settings-toggle-btn" +
            (ODEModes.getMode() === mode ? " active" : "");
        btn.textContent = ODEModes.modeLabel(mode);
        btn.addEventListener("click", function () {
            ODEModes.setMode(mode);
        });
        modeRow.appendChild(btn);
    });
    card.appendChild(modeRow);

    return card;
}

function buildDataCard() {
    const card = settingsCard("Local Data");

    const explain = document.createElement("p");
    explain.className = "settings-note";
    explain.textContent = "Progress lives in this browser and syncs to your account when signed in. These controls only touch this device.";
    card.appendChild(explain);

    /* Two-step confirmation: the first click arms the button, the second
       within its armed state performs the reset. */
    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "settings-danger-btn";
    resetBtn.textContent = "Reset all progress";
    let armed = false;
    resetBtn.addEventListener("click", function () {
        if (!armed) {
            armed = true;
            resetBtn.textContent = "Click again to confirm the reset";
            resetBtn.classList.add("armed");
            setTimeout(function () {
                armed = false;
                resetBtn.textContent = "Reset all progress";
                resetBtn.classList.remove("armed");
            }, 4000);
            return;
        }
        ODEState.resetAllProgress();
        renderCurriculum();
    });
    card.appendChild(resetBtn);

    /* Cache clear: drops every ode_* key except the sign-in credentials,
       then reloads so the shell rebuilds from a clean slate (which also
       re-fetches any bank chunk marked failed this session). */
    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "settings-secondary-btn";
    clearBtn.textContent = "Clear cached data and reload";
    clearBtn.addEventListener("click", function () {
        try {
            const keep = { ode_google_credential: true, ode_cloud_session: true };
            Object.keys(localStorage).forEach(function (key) {
                if (key.indexOf("ode_") === 0 && !keep[key]) {
                    localStorage.removeItem(key);
                }
            });
        } catch (err) { /* storage unavailable */ }
        window.location.reload();
    });
    card.appendChild(clearBtn);

    return card;
}
