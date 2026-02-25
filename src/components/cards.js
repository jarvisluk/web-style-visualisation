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
              <div class="card-footer">
                <button class="btn btn-ghost btn-sm">${t("cards.learn")}</button>
                <span style="font-size:12px;color:var(--color-text-secondary)">→</span>
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
