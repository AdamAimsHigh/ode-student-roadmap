/* Light and dark theme management per ARCHITECTURE.md Section 2, upgraded to
   the system-default lighting engine (2026-07-12). The control offers three
   explicit preferences: light, dark, and system. The chosen preference
   persists across sessions via localStorage. System is the default: with no
   stored choice the document carries no data-theme attribute and the
   prefers-color-scheme media block in theme.css follows the OS natively,
   with zero JavaScript in the path. A manual choice stamps data-theme
   explicitly ("light" or "dark") and always overrides the OS base. */

/* Reads the stored preference, falling back to "system" for a missing or
   unrecognized value so the OS setting is the well-defined default. */
function getStoredThemePreference() {
    const pref = localStorage.getItem("ode_theme_preference");
    if (pref === "light" || pref === "dark" || pref === "system") return pref;
    return "system";
}

/* Applies a preference through the three-state root attribute contract of
   theme.css: an explicit choice is stamped as data-theme so it beats the
   media query in both directions, and "system" removes the attribute so
   the CSS lighting engine defers to the OS on its own. */
function applyTheme(preference) {
    if (preference === "light" || preference === "dark") {
        document.documentElement.setAttribute("data-theme", preference);
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

    /* No matchMedia listener needed anymore: under the system preference
       the root carries no data-theme attribute, so the theme.css
       prefers-color-scheme block follows a live OS toggle natively. */
}

document.addEventListener("DOMContentLoaded", initTheme);
