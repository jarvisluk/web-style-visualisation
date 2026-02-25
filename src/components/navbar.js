export function renderNavbar(container) {
  container.innerHTML = `
    <div class="navbar-brand">
      <span>🎨</span>
      <span>Web Style Visualisation</span>
    </div>
    <ul class="navbar-links">
      <li><a href="#hero">Preview</a></li>
      <li><a href="#cards">Components</a></li>
      <li><a href="https://github.com" target="_blank" rel="noopener">GitHub</a></li>
    </ul>
  `;
}
