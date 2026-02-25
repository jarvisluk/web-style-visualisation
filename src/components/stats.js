export function renderStats(container) {
  container.innerHTML = `
    <div class="stats-container">
      <h3 class="stats-title">Dashboard</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">8</span>
          <span class="stat-label">Design Styles</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">20+</span>
          <span class="stat-label">CSS Variables</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">6</span>
          <span class="stat-label">UI Components</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">∞</span>
          <span class="stat-label">Combinations</span>
        </div>
      </div>
    </div>
  `;
}
