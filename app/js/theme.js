/* Light and dark theme management per ARCHITECTURE.md Section 2.
   The user choice persists across sessions via localStorage. */

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("ode_theme_preference", newTheme);
    updateThemeButtonLabel(newTheme);
}

function updateThemeButtonLabel(activeTheme) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    // The label names the theme the button will switch to.
    btn.textContent = activeTheme === "dark" ? "Light Mode" : "Dark Mode";
}

function initTheme() {
    const savedTheme = localStorage.getItem("ode_theme_preference") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeButtonLabel(savedTheme);

    const btn = document.getElementById("theme-toggle");
    if (btn) {
        btn.addEventListener("click", toggleTheme);
    }
}

document.addEventListener("DOMContentLoaded", initTheme);
