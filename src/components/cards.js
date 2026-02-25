export function renderCards(container) {
  const cards = [
    { icon: "🎨", title: "Color System", text: "每种风格定义独特的配色方案，从主色到强调色，一键切换整站色彩语言。" },
    { icon: "📐", title: "Shape Language", text: "圆角、边框、阴影共同构成风格的形状语言，微调面板让你深入理解每个参数。" },
    { icon: "✨", title: "Special Effects", text: "毛玻璃模糊、霓虹发光、硬阴影 — 独特效果是区分风格的关键因素。" }
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
              <button class="btn btn-ghost btn-sm">了解更多</button>
              <span style="font-size:12px;color:var(--color-text-secondary)">→</span>
            </div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}
