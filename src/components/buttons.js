export function renderButtons(container) {
  container.innerHTML = `
    <div class="buttons-showcase">
      <div class="buttons-showcase-title">Buttons</div>
      <div class="buttons-row">
        <button class="btn btn-primary">Primary</button>
        <button class="btn btn-secondary">Secondary</button>
        <button class="btn btn-accent">Accent</button>
        <button class="btn btn-ghost">Ghost</button>
      </div>
      <div class="buttons-row">
        <button class="btn btn-primary btn-sm">Small</button>
        <button class="btn btn-primary">Default</button>
        <button class="btn btn-primary btn-lg">Large</button>
      </div>
      <div class="buttons-row">
        <button class="btn btn-primary" disabled>Disabled</button>
        <button class="btn btn-secondary" disabled>Disabled</button>
      </div>
    </div>
  `;
}
