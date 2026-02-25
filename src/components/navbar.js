import { t, toggleLang, onLangChange } from "../utils/i18n.js";

export function renderNavbar(container) {
  const render = () => {
    container.innerHTML = `
      <div class="navbar-brand">
        <span>🎨</span>
        <span>Web Style Visualisation</span>
      </div>
      <ul class="navbar-links">
        <li><a href="#hero">${t("nav.preview")}</a></li>
        <li><a href="#cards">${t("nav.components")}</a></li>
        <li><a href="https://github.com" target="_blank" rel="noopener">${t("nav.github")}</a></li>
        <li><a href="#" class="lang-toggle" style="font-weight: bold; color: var(--color-primary);">${t("nav.lang")}</a></li>
      </ul>
    `;

    container.querySelector(".lang-toggle").addEventListener("click", (e) => {
      e.preventDefault();
      toggleLang();
    });
  };

  render();
  onLangChange(render);
}
