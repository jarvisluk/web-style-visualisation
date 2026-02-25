import { getCurrentStyle } from "../utils/css-var-manager.js";
import { onChange } from "../utils/css-var-manager.js";

export function renderHero(container) {
  updateHero(container);
  onChange(() => updateHero(container));
}

function updateHero(container) {
  const style = getCurrentStyle();
  const name = style ? style.name : "Web Style Visualisation";
  const desc = style ? style.descriptionZh : "选择一种风格，体验整站实时变化";

  container.innerHTML = `
    <div class="hero">
      <h1 class="hero-title">${name}</h1>
      <p class="hero-subtitle">${desc}</p>
      <div class="hero-actions">
        <button class="btn btn-primary btn-lg">Get Started</button>
        <button class="btn btn-secondary btn-lg">Learn More</button>
      </div>
    </div>
  `;
}
