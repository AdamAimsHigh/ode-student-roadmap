/* Unified Profile and Settings view, the #settings route (Day 3 capstone).

   A split interface driven by edge role evaluation:

   Student interface (always rendered, works fully offline and over
   file://): the local profile card (account, sync state, stored-data
   summary), the visual theme and learning mode preferences, and the local
   data controls (progress reset, cached data clear).

   Tutor admin console (rendered only when the edge says so): the view
   probes GET /api/packages through ODEState.authFetch; the Worker resolves
   the bearer, evaluates the OWNER_SUBS allowlist, and answers with either
   the student shape (own packages only) or the owner shape (full ledger
   plus write actions). The client renders whichever shape arrives and
   holds no role logic of its own: a student response physically contains
   no other student's data, so there is nothing here to leak. Under
   file:// or signed-out the probe never fires and the section explains
   itself instead.

   Owner tools: the Package Manager (catalog with Wyzant rate translations,
   create, activate, complete), the Group Session builder (roster of up to
   four students), and the session logging ledger.

   Classic script loaded before router.js. Copy rule: professional
   terminology only (Packages, Group Sessions, Fundamentals), no em-dashes,
   no ampersands. */

const PACKAGES_ENDPOINT = "/api/packages";

function renderSettings(container) {
    buildIndexShell(container, "Profile and Settings",
        "Your account, your preferences, and your local data, all in one place.");

    const grid = document.createElement("div");
    grid.className = "settings-grid";
    const profileCard = buildProfileCard();
    grid.appendChild(profileCard.card);
    grid.appendChild(buildPreferencesCard());
    grid.appendChild(buildDataCard());
    container.appendChild(grid);

    /* The role-driven section: filled asynchronously by the edge probe. */
    const roleSlot = document.createElement("div");
    roleSlot.className = "settings-role-slot";
    container.appendChild(roleSlot);
    loadRoleArea(roleSlot, profileCard);
}

/* ---- Student interface --------------------------------------------------- */

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
    const accountIdValue = settingsRow(card, "Account id",
        auth.signedIn && auth.httpContext ? "Loading" : "Available when signed in");

    const watched = ODEState.getWatchedVideos().length;
    const checkpoints = Object.keys(ODEState.getPassedCheckpoints()).length;
    const events = typeof ODETelemetry !== "undefined"
        ? ODETelemetry.getEvents().length : 0;
    settingsRow(card, "Videos watched", String(watched));
    settingsRow(card, "Checkpoints passed", String(checkpoints));
    settingsRow(card, "Practice events recorded", String(events));

    return { card: card, accountIdValue: accountIdValue };
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

/* ---- Edge role probe ------------------------------------------------------ */

function settingsNote(slot, text) {
    slot.innerHTML = "";
    const note = document.createElement("p");
    note.className = "static-page-placeholder";
    note.textContent = text;
    slot.appendChild(note);
}

function loadRoleArea(slot, profileCard) {
    const auth = ODEState.getAuthInfo();
    if (!auth.httpContext) {
        settingsNote(slot,
            "Package and tutoring tools are available on the online version of this site.");
        return;
    }
    if (!auth.signedIn) {
        settingsNote(slot,
            "Sign in with Google above to see your tutoring packages here.");
        return;
    }
    settingsNote(slot, "Checking your account.");
    ODEState.authFetch(PACKAGES_ENDPOINT, { method: "GET" }).then(function (res) {
        if (!res.ok) throw new Error("status " + res.status);
        return res.json();
    }).then(function (body) {
        ODEState.adoptSession(body);
        if (body.sub && profileCard && profileCard.accountIdValue) {
            profileCard.accountIdValue.textContent = body.sub;
        }
        if (window.location.hash !== "#settings") return;
        if (body.role === "owner") {
            renderOwnerConsole(slot, body);
        } else {
            renderStudentPackages(slot, body);
        }
    }).catch(function (err) {
        console.debug("Package probe skipped:", err);
        if (window.location.hash === "#settings") {
            settingsNote(slot,
                "Your packages could not be loaded right now. They will appear here next time.");
        }
    });
}

/* ---- Student package list -------------------------------------------------- */

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

function renderStudentPackages(slot, body) {
    slot.innerHTML = "";
    const card = settingsCard("Your Tutoring Packages");
    if (!body.packages || !body.packages.length) {
        const note = document.createElement("p");
        note.className = "settings-note";
        note.textContent = "No packages on your account yet. Packages appear here once your tutor sets one up.";
        card.appendChild(note);
    } else {
        body.packages.forEach(function (pkg) {
            const row = document.createElement("div");
            row.className = "pkg-row";
            const title = document.createElement("p");
            title.className = "pkg-row-title";
            title.textContent = pkg.label;
            title.appendChild(packageStatusChip(pkg.status));
            row.appendChild(title);
            const meta = document.createElement("p");
            meta.className = "pkg-row-meta";
            meta.textContent = packageHoursLine(pkg);
            row.appendChild(meta);
            card.appendChild(row);
        });
    }
    slot.appendChild(card);
}

/* ---- Tutor admin console ---------------------------------------------------- */

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

/* Owner write action with a shared status line; on success the whole role
   area re-probes so every list reflects the new ledger state. */
function postPackageAction(payload, statusEl, slot, profileCard) {
    statusEl.textContent = "Working.";
    statusEl.className = "admin-status";
    ODEState.authFetch(PACKAGES_ENDPOINT, {
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
        if (window.location.hash === "#settings") {
            loadRoleArea(slot, profileCard);
        }
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

function renderOwnerConsole(slot, body) {
    slot.innerHTML = "";

    const console_ = document.createElement("section");
    console_.className = "admin-console";

    const heading = document.createElement("h2");
    heading.className = "admin-console-title";
    heading.textContent = "Tutor Admin Console";
    console_.appendChild(heading);

    const status = document.createElement("p");
    status.className = "admin-status";
    console_.appendChild(status);

    console_.appendChild(buildCatalogSection(body.catalog));
    console_.appendChild(buildCreatePackageSection(body, status, slot));
    console_.appendChild(buildGroupBuilderSection(body, status, slot));
    console_.appendChild(buildLedgerSection(body, status, slot));
    console_.appendChild(buildSessionLogSection(body));

    slot.appendChild(console_);
}

function adminSection(title) {
    const section = document.createElement("div");
    section.className = "admin-section";
    const heading = document.createElement("h3");
    heading.className = "settings-card-title";
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
    note.className = "settings-note";
    note.textContent = "All billing runs through Wyzant. Quote the flat package, then set the student's custom Wyzant rate to the per-hour translation shown above.";
    section.appendChild(note);
    return section;
}

function buildCreatePackageSection(body, status, slot) {
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
    submit.className = "pdf-download-btn";
    submit.textContent = "Create Quote";
    submit.addEventListener("click", function () {
        postPackageAction({
            action: "create",
            studentEmail: email.value,
            studentSub: sub.value.trim(),
            type: select.value
        }, status, slot, null);
    });
    form.appendChild(submit);
    section.appendChild(form);
    return section;
}

function buildGroupBuilderSection(body, status, slot) {
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
    submit.className = "pdf-download-btn";
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
        }, status, slot, null);
    });
    form.appendChild(submit);
    section.appendChild(form);
    return section;
}

function buildLedgerSection(body, status, slot) {
    const section = adminSection("Package Ledger");
    const packages = body.packages || [];
    if (!packages.length) {
        const note = document.createElement("p");
        note.className = "settings-note";
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
            activate.className = "settings-secondary-btn";
            activate.textContent = "Activate";
            activate.addEventListener("click", function () {
                postPackageAction({
                    action: "set-status", sub: pkg.subSegment,
                    pkgId: pkg.id, status: "active"
                }, status, slot, null);
            });
            actions.appendChild(activate);
        }
        if (pkg.status === "active") {
            const complete = document.createElement("button");
            complete.type = "button";
            complete.className = "settings-secondary-btn";
            complete.textContent = "Mark Completed";
            complete.addEventListener("click", function () {
                postPackageAction({
                    action: "set-status", sub: pkg.subSegment,
                    pkgId: pkg.id, status: "completed"
                }, status, slot, null);
            });
            actions.appendChild(complete);

            const minutes = adminInput("number", "Minutes");
            minutes.min = "15";
            minutes.max = "480";
            minutes.className += " admin-input-minutes";
            const note = adminInput("text", "Session note (optional)");
            const log = document.createElement("button");
            log.type = "button";
            log.className = "settings-secondary-btn";
            log.textContent = "Log Session";
            log.addEventListener("click", function () {
                postPackageAction({
                    action: "log-session", sub: pkg.subSegment,
                    pkgId: pkg.id, minutes: parseInt(minutes.value, 10),
                    note: note.value
                }, status, slot, null);
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
        note.className = "settings-note";
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
    total.className = "settings-note";
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
