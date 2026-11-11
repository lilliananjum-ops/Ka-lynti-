// KA LYNTI — shared navigation, accessibility preferences and footer.
const navItems = [
  ["Home", "index.html"], ["Understand", "understand.html"],
  ["Navigate", "navigate.html"], ["Know your rights", "rights.html"],
  ["Find support", "support.html"], ["Opportunities", "opportunities.html"],
  ["To-do list", "todo.html"], ["Accessibility", "accessibility.html"],
  ["About", "about.html"]
];

const currentPage = location.pathname.split("/").pop() || "index.html";
const header = document.querySelector("[data-site-header]");
const main = document.querySelector("main");

// Provide a reliable keyboard skip target on every page without duplicating markup.
if (main) {
  main.id ||= "main-content";
  main.tabIndex = -1;
  const skipLink = document.createElement("a");
  skipLink.className = "skip-link";
  skipLink.href = "#main-content";
  skipLink.textContent = "Skip to main content";
  document.body.insertBefore(skipLink, document.body.firstChild);
}

// Shared accessibility styles are loaded on every page using this script.
const a11yStyles = document.createElement("link");
a11yStyles.rel = "stylesheet";
a11yStyles.href = "css/accessibility.css";
document.head.append(a11yStyles);

const PREFS_KEY = "ka-lynti-accessibility-v1";
let preferences = { largeText: false, highContrast: false };
try {
  preferences = { ...preferences, ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") };
} catch {
  // Preferences remain available for the current page if storage is disabled.
}

document.body.classList.toggle("text-large", Boolean(preferences.largeText));
document.body.classList.toggle("high-contrast", Boolean(preferences.highContrast));

function savePreferences() {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
  } catch {
    // Do not block the controls if browser storage is unavailable.
  }
}

if (header) {
  header.innerHTML = `
    <a class="brand" href="index.html" aria-label="Ka Lynti home">
      <span class="brand-mark" aria-hidden="true">kl</span>
      <span>ka lynti<span class="brand-dot">.</span></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primaryNav">Menu <span aria-hidden="true">☰</span></button>
    <nav class="site-nav" id="primaryNav" aria-label="Main navigation">
      ${navItems.map(([label, url]) => `
        <a href="${url}" ${currentPage === url ? 'aria-current="page"' : ''}>${label}</a>
      `).join("")}
    </nav>
    <details class="accessibility-menu">
      <summary>Display options</summary>
      <div class="accessibility-options" aria-label="Display preferences">
        <button type="button" data-preference="largeText" aria-pressed="${Boolean(preferences.largeText)}">Larger text</button>
        <button type="button" data-preference="highContrast" aria-pressed="${Boolean(preferences.highContrast)}">High contrast</button>
        <p>These display choices are saved in this browser.</p>
      </div>
    </details>`;

  const menuButton = header.querySelector(".menu-toggle");
  const nav = header.querySelector(".site-nav");
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.focus();
    }
  });

  header.querySelectorAll("[data-preference]").forEach(button => {
    button.addEventListener("click", () => {
      const preference = button.dataset.preference;
      preferences[preference] = !preferences[preference];
      document.body.classList.toggle(preference === "largeText" ? "text-large" : "high-contrast", preferences[preference]);
      button.setAttribute("aria-pressed", String(preferences[preference]));
      savePreferences();
    });
  });
}

const footer = document.querySelector("[data-site-footer]");
if (footer) {
  footer.innerHTML = `
    <a class="brand footer-brand" href="index.html">
      <span class="brand-mark" aria-hidden="true">kl</span>
      <span>ka lynti<span class="brand-dot">.</span></span>
    </a>
    <p>Bridging the gap between knowing and accessing.</p>
    <p class="footer-small">An independent information initiative in development. Legal, scheme and directory information should be checked against its original source before use.</p>
    <span class="copyright">© ${new Date().getFullYear()} Ka Lynti</span>`;
}
