import { setVariable, resetToStyle, getCurrentStyle, getCurrentVariables, onChange } from "../utils/css-var-manager.js";

const COMMON_TUNING = [
  { section: "🎨 Colors", controls: [
    { variable: "--color-primary", label: "Primary", type: "color" },
    { variable: "--color-bg", label: "Background", type: "color" },
    { variable: "--color-surface", label: "Surface", type: "color" },
    { variable: "--color-text", label: "Text", type: "color" },
    { variable: "--color-accent", label: "Accent", type: "color" },
  ]},
  { section: "📐 Shape", controls: [
    { variable: "--border-radius", label: "Border Radius", type: "range", min: 0, max: 32, step: 1, unit: "px" },
    { variable: "--border-width", label: "Border Width", type: "range", min: 0, max: 6, step: 1, unit: "px" },
    { variable: "--border-color", label: "Border Color", type: "color" },
  ]},
  { section: "🌑 Shadow", controls: [
    { variable: "--shadow-x", label: "Offset X", type: "range", min: -20, max: 20, step: 1, unit: "px" },
    { variable: "--shadow-y", label: "Offset Y", type: "range", min: -20, max: 20, step: 1, unit: "px" },
    { variable: "--shadow-blur", label: "Blur", type: "range", min: 0, max: 40, step: 1, unit: "px" },
    { variable: "--shadow-color", label: "Shadow Color", type: "color" },
  ]},
  { section: "🔤 Typography", controls: [
    { variable: "--font-family", label: "Font Family", type: "select", options: [
      "'Inter', sans-serif",
      "'Roboto', sans-serif",
      "'Courier Prime', monospace",
      "'Press Start 2P', monospace",
      "system-ui, sans-serif",
    ]},
    { variable: "--font-weight", label: "Font Weight", type: "range", min: 100, max: 900, step: 100, unit: "" },
  ]},
  { section: "📏 Spacing", controls: [
    { variable: "--spacing", label: "Base Spacing", type: "range", min: 4, max: 32, step: 2, unit: "px" },
  ]},
];

let panelContainer = null;

export function renderTuningPanel(container) {
  panelContainer = container;
  buildPanel();
  onChange(() => buildPanel());
}

function buildPanel() {
  if (!panelContainer) return;

  const style = getCurrentStyle();
  const vars = getCurrentVariables();

  panelContainer.innerHTML = "";

  // Header
  const header = document.createElement("div");
  header.className = "tuning-panel-header";
  header.innerHTML = `
    <span class="tuning-panel-title">⚙️ Fine Tuning</span>
    <button class="tuning-close" id="tuning-close-btn">×</button>
  `;
  panelContainer.appendChild(header);

  header.querySelector("#tuning-close-btn").addEventListener("click", () => {
    panelContainer.classList.remove("open");
    document.body.classList.remove("tuning-open");
  });

  // Common sections
  COMMON_TUNING.forEach((section) => {
    renderSection(panelContainer, section.section, section.controls, vars);
  });

  // Special tuning for current style
  if (style && style.specialTuning && style.specialTuning.length > 0) {
    renderSection(panelContainer, `✨ ${style.name} Special`, style.specialTuning, vars);
  }

  // Actions
  const actions = document.createElement("div");
  actions.className = "tuning-actions";
  actions.innerHTML = `
    <button class="btn btn-ghost btn-sm" id="tuning-reset-btn" style="flex:1">Reset</button>
  `;
  panelContainer.appendChild(actions);

  actions.querySelector("#tuning-reset-btn").addEventListener("click", () => {
    resetToStyle();
  });
}

function renderSection(parent, title, controls, vars) {
  const section = document.createElement("div");
  section.className = "tuning-section";

  const titleEl = document.createElement("div");
  titleEl.className = "tuning-section-title";
  titleEl.textContent = title;
  section.appendChild(titleEl);

  controls.forEach((ctrl) => {
    const row = document.createElement("div");
    row.className = "tuning-row";

    const currentValue = vars[ctrl.variable] || "";

    if (ctrl.type === "color") {
      const hexValue = toHexSafe(currentValue);
      row.innerHTML = `
        <div class="tuning-label">
          <span>${ctrl.label}</span>
          <span class="tuning-value">${currentValue}</span>
        </div>
        <input type="color" class="tuning-color-input" value="${hexValue}" />
      `;
      const input = row.querySelector("input");
      input.addEventListener("input", (e) => {
        setVariable(ctrl.variable, e.target.value);
        row.querySelector(".tuning-value").textContent = e.target.value;
      });
    } else if (ctrl.type === "range") {
      const numVal = parseFloat(currentValue) || ctrl.min || 0;
      row.innerHTML = `
        <div class="tuning-label">
          <span>${ctrl.label}</span>
          <span class="tuning-value">${numVal}${ctrl.unit || ""}</span>
        </div>
        <input type="range" class="tuning-slider"
          min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step || 1}" value="${numVal}" />
      `;
      const input = row.querySelector("input");
      input.addEventListener("input", (e) => {
        const val = `${e.target.value}${ctrl.unit || ""}`;
        setVariable(ctrl.variable, val);
        row.querySelector(".tuning-value").textContent = val;
      });
    } else if (ctrl.type === "select") {
      const options = ctrl.options || [];
      row.innerHTML = `
        <div class="tuning-label">
          <span>${ctrl.label}</span>
        </div>
        <select class="tuning-select">
          ${options.map((opt) => `<option value="${opt}" ${currentValue.includes(opt.split(",")[0].replace(/'/g, "")) ? "selected" : ""}>${opt}</option>`).join("")}
        </select>
      `;
      const select = row.querySelector("select");
      select.addEventListener("change", (e) => {
        setVariable(ctrl.variable, e.target.value);
      });
    }

    section.appendChild(row);
  });

  parent.appendChild(section);
}

function toHexSafe(cssColor) {
  if (!cssColor) return "#000000";
  const trimmed = cssColor.trim();
  if (trimmed.startsWith("#") && (trimmed.length === 7 || trimmed.length === 4)) {
    return trimmed.length === 4
      ? `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`
      : trimmed;
  }
  // For rgba / named colors, fallback
  return "#000000";
}
