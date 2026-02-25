import { t, onLangChange } from "../utils/i18n.js";

export function renderCards(container) {
  const render = () => {
    const cards = [
      { icon: "🎨", title: t("cards.c1.title"), text: t("cards.c1.text") },
      { icon: "📐", title: t("cards.c2.title"), text: t("cards.c2.text") },
      { icon: "✨", title: t("cards.c3.title"), text: t("cards.c3.text") }
    ];

    container.innerHTML = `
      <div class="cards-grid">
        ${cards
          .map(
            (card) => `
          <div class="card">
            <div class="card-image">${card.icon}</div>
            <div class="card-body">
              <h3 class="card-title">${card.title}</h3>
              <p class="card-text">${card.text}</p>
              <div class="card-footer" style="padding-top: var(--spacing); border-top: 1px solid var(--color-border); margin-top: auto;">
                <button class="btn btn-ghost btn-sm" style="display:inline-flex; align-items:center; gap:6px; padding:0;">${t("cards.learn")} <span style="font-size:14px;">→</span></button>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  };

  render();
  onLangChange(render);
}
