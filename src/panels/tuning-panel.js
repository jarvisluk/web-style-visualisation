import { setVariable, resetToStyle, getCurrentStyle, getCurrentVariables, onChange } from "../utils/css-var-manager.js";
import { t, onLangChange } from "../utils/i18n.js";

function getCommonTuning() {
  return [
    { section: t("tuning.colors"), controls: [
      { variable: "--color-primary", label: t("tuning.primary"), type: "color" },
      { variable: "--color-bg", label: t("tuning.background"), type: "color" },
      { variable: "--color-surface", label: t("tuning.surface"), type: "color" },
      { variable: "--color-text", label: t("tuning.text"), type: "color" },
      { variable: "--color-accent", label: t("tuning.accent"), type: "color" },
    ]},
    { section: t("tuning.shape"), controls: [
      { variable: "--border-radius", label: t("tuning.borderRadius"), type: "range", min: 0, max: 32, step: 1, unit: "px" },
      { variable: "--border-width", label: t("tuning.borderWidth"), type: "range", min: 0, max: 6, step: 1, unit: "px" },
      { variable: "--border-color", label: t("tuning.borderColor"), type: "color" },
    ]},
    { section: t("tuning.shadow"), controls: [
      { variable: "--shadow-x", label: t("tuning.offsetX"), type: "range", min: -20, max: 20, step: 1, unit: "px" },
      { variable: "--shadow-y", label: t("tuning.offsetY"), type: "range", min: -20, max: 20, step: 1, unit: "px" },
      { variable: "--shadow-blur", label: t("tuning.blur"), type: "range", min: 0, max: 40, step: 1, unit: "px" },
      { variable: "--shadow-color", label: t("tuning.shadowColor"), type: "color" },
    ]},
    { section: t("tuning.typography"), controls: [
      { variable: "--font-family", label: t("tuning.fontFamily"), type: "select", options: [
        "'Inter', sans-serif",
        "'Roboto', sans-serif",
        "'Courier Prime', monospace",
        "'Press Start 2P', monospace",
        "system-ui, sans-serif",
      ]},
      { variable: "--font-weight", label: t("tuning.fontWeight"), type: "range", min: 100, max: 900, step: 100, unit: "" },
    ]},
    { section: t("tuning.spacing"), controls: [
      { variable: "--spacing", label: t("tuning.baseSpacing"), type: "range", min: 4, max: 32, step: 2, unit: "px" },
    ]},
  ];
}

let panelContainer = null;

export function renderTuningPanel(container) {
  panelContainer = container;
  const render = () => buildPanel();
  render();
  onChange(render);
  onLangChange(render);
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
  getCommonTuning().forEach((section) => {
    renderSection(panelContainer, section.section, section.controls, vars);
  });

  // Special tuning for current style
  if (style && style.specialTuning && style.specialTuning.length > 0) {
    const specialTitle = t("tuning.special").replace("✨ Special", `✨ ${style.name} Special`).replace("✨ 专属特色", `✨ ${style.nameZh || style.name} 专属特色`);
    renderSection(panelContainer, specialTitle, style.specialTuning, vars);
  }

  // Actions
  const actions = document.createElement("div");
  actions.className = "tuning-actions";
  actions.innerHTML = `
    <button class="btn btn-ghost btn-sm" id="tuning-reset-btn" style="flex:1">${t("tuning.reset")}</button>
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
    const lang = document.documentElement.lang;
    const labelText = (lang === "zh-CN" && ctrl.labelZh) ? ctrl.labelZh : ctrl.label;

    if (ctrl.type === "color") {
      const hexValue = toHexSafe(currentValue);
      row.innerHTML = `
        <div class="tuning-label">
          <span>${labelText}</span>
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
          <span>${labelText}</span>
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
          <span>${labelText}</span>
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
