// KA LYNTI — shared navigation and footer.
const navItems = [
  ["Home", "index.html"], ["Understand", "understand.html"],
  ["Navigate", "navigate.html"], ["Know your rights", "rights.html"],
  ["Find support", "support.html"], ["Opportunities", "opportunities.html"],
  ["To-do list", "todo.html"], ["About", "about.html"]
];

const currentPage = location.pathname.split("/").pop() || "index.html";
const header = document.querySelector("[data-site-header]");

if (header) {
  header.innerHTML = `
    <a class="brand" href="index.html" aria-label="Ka Lynti home">
      <span class="brand-mark" aria-hidden="true">kl</span>
      <span>ka lynti<span class="brand-dot">.</span></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primaryNav">Menu ☰</button>
    <nav class="site-nav" id="primaryNav" aria-label="Main navigation">
      ${navItems.map(([label, url]) => `
        <a href="${url}" ${currentPage === url ? 'aria-current="page"' : ''}>${label}</a>
      `).join("")}
    </nav>`;

  const button = header.querySelector(".menu-toggle");
  const nav = header.querySelector(".site-nav");
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
  }));
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
