import { getCurrentStyle } from "../utils/css-var-manager.js";
import { onChange } from "../utils/css-var-manager.js";
import { getStyleName, getStyleDesc, onLangChange } from "../utils/i18n.js";

export function renderHero(container) {
  const render = () => updateHero(container);
  render();
  onChange(render);
  onLangChange(render);
}

function updateHero(container) {
  const style = getCurrentStyle();
  const name = style ? getStyleName(style) : "Web Style Visualisation";
  const desc = style ? getStyleDesc(style) : "Select a style to see the entire page transform in real-time";

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
