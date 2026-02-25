import { STYLE_LIST, CATEGORIES } from "../styles/index.js";
import { applyStyle, getCurrentStyleId } from "../utils/css-var-manager.js";

export function renderStyleSelector(container) {
  const title = document.createElement("div");
  title.className = "style-selector-title";
  title.textContent = "Select Style";

  const grid = document.createElement("div");
  grid.className = "style-selector-grid";

  STYLE_LIST.forEach((style) => {
    const card = document.createElement("div");
    card.className = "style-card";
    card.dataset.styleId = style.id;

    card.innerHTML = `
      <div class="style-card-name">${style.name}</div>
      <div class="style-card-category">${CATEGORIES[style.category] || style.category}</div>
    `;

    card.addEventListener("click", () => {
      applyStyle(style.id);
      updateActiveState(grid, style.id);
    });

    grid.appendChild(card);
  });

  container.appendChild(title);
  container.appendChild(grid);

  // Apply first style by default
  if (STYLE_LIST.length > 0) {
    const defaultStyle = STYLE_LIST.find((s) => s.id === "material") || STYLE_LIST[0];
    applyStyle(defaultStyle.id);
    updateActiveState(grid, defaultStyle.id);
  }
}

function updateActiveState(grid, activeId) {
  grid.querySelectorAll(".style-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.styleId === activeId);
  });
}
