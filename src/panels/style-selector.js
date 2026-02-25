import { STYLE_LIST, CATEGORIES } from "../styles/index.js";
import { applyStyle, applyCustomVariables } from "../utils/css-var-manager.js";

export function renderStyleSelector(container) {
  const title = document.createElement("div");
  title.className = "style-selector-title";
  title.textContent = "Select Style";

  const grid = document.createElement("div");
  grid.className = "style-selector-grid";

  // Built-in style cards
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

  // Custom CSS card (last in list)
  const customCard = document.createElement("div");
  customCard.className = "style-card style-card-custom";
  customCard.dataset.styleId = "custom";
  customCard.innerHTML = `
    <div class="style-card-name">＋ Custom</div>
    <div class="style-card-category">上传 CSS</div>
  `;
  customCard.addEventListener("click", () => {
    openCustomCSSModal(grid);
  });
  grid.appendChild(customCard);

  // Custom CSS modal
  const modal = createCustomCSSModal(grid);

  container.appendChild(title);
  container.appendChild(grid);
  container.appendChild(modal);

  // Apply default style
  if (STYLE_LIST.length > 0) {
    const defaultStyle = STYLE_LIST.find((s) => s.id === "material") || STYLE_LIST[0];
    applyStyle(defaultStyle.id);
    updateActiveState(grid, defaultStyle.id);

    requestAnimationFrame(() => {
      const activeCard = grid.querySelector(`.style-card[data-style-id="${defaultStyle.id}"]`);
      if (activeCard) {
        const scrollLeft = activeCard.offsetLeft - (grid.clientWidth / 2) + (activeCard.offsetWidth / 2);
        grid.scrollTo({ left: scrollLeft, behavior: "instant" });
      }
    });
  }
}

function createCustomCSSModal(grid) {
  const modal = document.createElement("div");
  modal.className = "custom-css-modal";
  modal.id = "custom-css-modal";
  modal.innerHTML = `
    <div class="custom-css-modal-backdrop"></div>
    <div class="custom-css-modal-content">
      <div class="custom-css-modal-header">
        <span class="custom-css-modal-title">Upload Custom CSS Variables</span>
        <button class="custom-css-modal-close">×</button>
      </div>
      <div class="custom-css-modal-body">
        <p class="custom-css-modal-hint">粘贴包含 CSS Variables 的代码，或上传 .css 文件。<br>格式示例：<code>--color-primary: #6366f1;</code></p>
        <textarea class="custom-css-textarea" placeholder=":root {\n  --color-primary: #6366f1;\n  --color-bg: #0f0f23;\n  --color-text: #e2e8f0;\n  --border-radius: 16px;\n  ...\n}" rows="10"></textarea>
        <div class="custom-css-file-row">
          <label class="btn btn-ghost btn-sm custom-css-file-label">
            📁 Upload .css file
            <input type="file" accept=".css,.txt" class="custom-css-file-input" />
          </label>
          <span class="custom-css-file-name"></span>
        </div>
      </div>
      <div class="custom-css-modal-footer">
        <button class="btn btn-ghost btn-sm custom-css-cancel">Cancel</button>
        <button class="btn btn-primary btn-sm custom-css-apply">Apply</button>
      </div>
    </div>
  `;

  // Close handlers
  modal.querySelector(".custom-css-modal-backdrop").addEventListener("click", () => closeModal(modal));
  modal.querySelector(".custom-css-modal-close").addEventListener("click", () => closeModal(modal));
  modal.querySelector(".custom-css-cancel").addEventListener("click", () => closeModal(modal));

  // File upload handler
  const fileInput = modal.querySelector(".custom-css-file-input");
  const fileNameEl = modal.querySelector(".custom-css-file-name");
  const textarea = modal.querySelector(".custom-css-textarea");

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    fileNameEl.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (ev) => {
      textarea.value = ev.target.result;
    };
    reader.readAsText(file);
  });

  // Apply handler
  modal.querySelector(".custom-css-apply").addEventListener("click", () => {
    const cssText = textarea.value.trim();
    if (!cssText) return;

    const success = applyCustomVariables(cssText);
    if (success) {
      updateActiveState(grid, "custom");
      closeModal(modal);
    } else {
      alert("No CSS variables found. Please provide --variable: value; format.");
    }
  });

  return modal;
}

function openCustomCSSModal(grid) {
  const modal = document.getElementById("custom-css-modal");
  if (modal) {
    modal.classList.add("open");
  }
}

function closeModal(modal) {
  modal.classList.remove("open");
}

function updateActiveState(grid, activeId) {
  grid.querySelectorAll(".style-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.styleId === activeId);
  });
}
