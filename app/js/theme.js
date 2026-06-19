/* Light and dark theme management per ARCHITECTURE.md Section 2.
   The control offers three explicit preferences: light, dark, and system.
   The chosen preference persists across sessions via localStorage. Light is
   the default. When the preference is "system", the effective theme follows
   the operating system setting live through a matchMedia listener, so the
   document switches the moment the OS preference changes. */

const SYSTEM_MEDIA = window.matchMedia("(prefers-color-scheme: dark)");

/* Reads the stored preference, falling back to "light" for a missing or
   unrecognized value so the default is always well defined. */
function getStoredThemePreference() {
    const pref = localStorage.getItem("ode_theme_preference");
    if (pref === "light" || pref === "dark" || pref === "system") return pref;
    return "light";
}

/* Resolves a preference to the concrete theme written onto the document. The
   explicit choices map straight through, and "system" reads the live OS query. */
function effectiveTheme(preference) {
    if (preference === "system") {
        return SYSTEM_MEDIA.matches ? "dark" : "light";
    }
    return preference;
}

/* Applies the effective theme by setting or removing the dark attribute on the
   root element. Light is the absence of the attribute, matching theme.css. */
function applyTheme(preference) {
    const theme = effectiveTheme(preference);
    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
}

/* The human label shown on the closed dropdown trigger for each preference. */
function themePreferenceLabel(preference) {
    if (preference === "dark") return "Dark Mode";
    if (preference === "system") return "System Default";
    return "Light Mode";
}

/* Synchronizes the dropdown trigger label and the active menu item, mirroring
   the way modes.js reflects the active learning mode on its dropdown. */
function updateThemeButtons(activePreference) {
    const label = document.getElementById("theme-dropdown-label");
    if (label) {
        label.textContent = themePreferenceLabel(activePreference);
    }

    const ids = { light: "theme-light", dark: "theme-dark", system: "theme-system" };
    Object.keys(ids).forEach(function (choice) {
        const btn = document.getElementById(ids[choice]);
        if (btn) {
            btn.classList.toggle("active", choice === activePreference);
        }
    });
}

/* Records and applies a new preference, then refreshes the dropdown state. */
function setThemePreference(preference) {
    if (preference !== "light" && preference !== "dark" && preference !== "system") return;
    localStorage.setItem("ode_theme_preference", preference);
    applyTheme(preference);
    updateThemeButtons(preference);
}

function initTheme() {
    const preference = getStoredThemePreference();
    applyTheme(preference);
    updateThemeButtons(preference);

    ["light", "dark", "system"].forEach(function (choice) {
        const btn = document.getElementById("theme-" + choice);
        if (btn) {
            btn.addEventListener("click", function () { setThemePreference(choice); });
        }
    });

    // When the active preference follows the system, re-evaluate the effective
    // theme on the fly each time the OS preference toggles.
    const onSystemChange = function () {
        if (getStoredThemePreference() === "system") {
            applyTheme("system");
        }
    };
    if (typeof SYSTEM_MEDIA.addEventListener === "function") {
        SYSTEM_MEDIA.addEventListener("change", onSystemChange);
    } else if (typeof SYSTEM_MEDIA.addListener === "function") {
        // Older engines expose the deprecated addListener form only.
        SYSTEM_MEDIA.addListener(onSystemChange);
    }
}

document.addEventListener("DOMContentLoaded", initTheme);
