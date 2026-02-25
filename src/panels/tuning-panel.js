import { setVariable, resetToStyle, getCurrentStyle, getCurrentVariables, onChange } from "../utils/css-var-manager.js";
import { t, getLang, onLangChange } from "../utils/i18n.js";

// --- Font state (persists across panel re-renders) ---
let cachedSystemFonts = null;   // null = not yet detected
let customFontName = null;      // name of user-uploaded font
let customFontValue = null;     // CSS value for --font-family

const GOOGLE_FONTS = [
  "'Inter', sans-serif",
  "'Roboto', sans-serif",
  "'Courier Prime', monospace",
  "'Press Start 2P', monospace",
  "system-ui, sans-serif",
];

const FALLBACK_SYSTEM_FONTS = [
  "Georgia, serif",
  "'Helvetica Neue', Arial, sans-serif",
  "'Times New Roman', Times, serif",
  "'Courier New', Courier, monospace",
  "Menlo, Monaco, monospace",
  "'PingFang SC', 'Microsoft YaHei', sans-serif",
  "system-ui, -apple-system, sans-serif",
];

// --- System font detection ---
async function detectSystemFonts() {
  if (!window.queryLocalFonts) return null;
  try {
    const fonts = await window.queryLocalFonts();
    const families = [...new Set(fonts.map((f) => f.family))];
    return families.sort((a, b) => a.localeCompare(b));
  } catch {
    return null;
  }
}

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
      { variable: "--font-family", label: t("tuning.fontFamily"), type: "font-picker" },
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
    <span class="tuning-panel-title">${t("panel.tuning")}</span>
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
    customFontName = null;
    customFontValue = null;
  });
}

// --- Build the <select> with optgroups ---
function buildFontSelect(currentValue) {
  const select = document.createElement("select");
  select.className = "tuning-select tuning-font-select";

  // Google Fonts group
  const googleGroup = document.createElement("optgroup");
  googleGroup.label = t("tuning.googleFonts");
  GOOGLE_FONTS.forEach((font) => {
    const opt = document.createElement("option");
    opt.value = font;
    opt.textContent = font.split(",")[0].replace(/'/g, "").trim();
    opt.style.fontFamily = font;
    if (currentValue && currentValue.includes(font.split(",")[0].replace(/'/g, "").trim())) {
      opt.selected = true;
    }
    googleGroup.appendChild(opt);
  });
  select.appendChild(googleGroup);

  // System Fonts group
  const systemGroup = document.createElement("optgroup");
  systemGroup.label = t("tuning.systemFonts");
  const systemList = cachedSystemFonts || FALLBACK_SYSTEM_FONTS;
  systemList.forEach((font) => {
    const opt = document.createElement("option");
    // If from queryLocalFonts, it's a bare family name; wrap it for CSS
    const isDetected = cachedSystemFonts !== null && cachedSystemFonts === systemList;
    const cssValue = isDetected ? `'${font}', sans-serif` : font;
    const displayName = isDetected ? font : font.split(",")[0].replace(/'/g, "").trim();
    opt.value = cssValue;
    opt.textContent = displayName;
    opt.style.fontFamily = cssValue;
    if (currentValue && currentValue.includes(displayName)) {
      opt.selected = true;
    }
    systemGroup.appendChild(opt);
  });
  select.appendChild(systemGroup);

  // Custom font group (if one has been uploaded)
  if (customFontName && customFontValue) {
    const customGroup = document.createElement("optgroup");
    customGroup.label = t("tuning.customFont");
    const opt = document.createElement("option");
    opt.value = customFontValue;
    opt.textContent = customFontName;
    opt.style.fontFamily = customFontValue;
    if (currentValue && currentValue.includes(customFontName)) {
      opt.selected = true;
    }
    customGroup.appendChild(opt);
    select.appendChild(customGroup);
  }

  return select;
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
    const lang = getLang();
    const labelText = (lang === "zh" && ctrl.labelZh) ? ctrl.labelZh : ctrl.label;

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
    } else if (ctrl.type === "font-picker") {
      // --- Font Picker: select + detect btn + upload btn ---
      row.innerHTML = `<div class="tuning-label"><span>${labelText}</span></div>`;

      // Font select with optgroups
      const select = buildFontSelect(currentValue);
      row.appendChild(select);
      select.addEventListener("change", (e) => {
        setVariable(ctrl.variable, e.target.value);
      });

      // Action buttons row
      const actionsRow = document.createElement("div");
      actionsRow.className = "tuning-font-actions";

      // Detect system fonts button
      const detectBtn = document.createElement("button");
      detectBtn.className = "tuning-font-btn";
      detectBtn.textContent = cachedSystemFonts ? `✓ ${cachedSystemFonts.length} ${t("tuning.detected")}` : `🔍 ${t("tuning.detectFonts")}`;
      if (!window.queryLocalFonts) {
        detectBtn.title = t("tuning.notSupported");
        detectBtn.style.opacity = "0.5";
      }
      detectBtn.addEventListener("click", async () => {
        if (!window.queryLocalFonts) {
          detectBtn.textContent = `⚠ ${t("tuning.notSupported")}`;
          setTimeout(() => {
            detectBtn.textContent = `🔍 ${t("tuning.detectFonts")}`;
          }, 2000);
          return;
        }
        detectBtn.textContent = `⏳ ${t("tuning.detecting")}`;
        detectBtn.disabled = true;
        const fonts = await detectSystemFonts();
        if (fonts && fonts.length > 0) {
          cachedSystemFonts = fonts;
          detectBtn.textContent = `✓ ${fonts.length} ${t("tuning.detected")}`;
          // Rebuild the select with newly detected fonts
          const newSelect = buildFontSelect(vars[ctrl.variable] || "");
          row.replaceChild(newSelect, row.querySelector("select"));
          newSelect.addEventListener("change", (e) => {
            setVariable(ctrl.variable, e.target.value);
          });
        } else {
          detectBtn.textContent = `⚠ ${t("tuning.notSupported")}`;
        }
        detectBtn.disabled = false;
      });
      actionsRow.appendChild(detectBtn);

      // Upload font button
      const uploadBtn = document.createElement("button");
      uploadBtn.className = "tuning-font-btn";
      uploadBtn.textContent = `📁 ${t("tuning.uploadFont")}`;
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".ttf,.otf,.woff,.woff2";
      fileInput.style.display = "none";
      fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const buffer = await file.arrayBuffer();
          const fontName = file.name.replace(/\.(ttf|otf|woff2?)/i, "");
          const face = new FontFace(fontName, buffer);
          await face.load();
          document.fonts.add(face);

          customFontName = fontName;
          customFontValue = `'${fontName}', sans-serif`;
          setVariable(ctrl.variable, customFontValue);

          // Rebuild select to include the custom font
          const newSelect = buildFontSelect(customFontValue);
          row.replaceChild(newSelect, row.querySelector("select"));
          newSelect.addEventListener("change", (ev) => {
            setVariable(ctrl.variable, ev.target.value);
          });

          // Show status
          statusEl.textContent = `${t("tuning.fontLoaded")} ${fontName}`;
        } catch {
          statusEl.textContent = "⚠ Failed to load font";
          setTimeout(() => { statusEl.textContent = ""; }, 3000);
        }
        fileInput.value = "";
      });
      uploadBtn.addEventListener("click", () => fileInput.click());
      actionsRow.appendChild(uploadBtn);
      actionsRow.appendChild(fileInput);

      row.appendChild(actionsRow);

      // Status text
      const statusEl = document.createElement("div");
      statusEl.className = "tuning-font-status";
      if (customFontName) {
        statusEl.textContent = `${t("tuning.fontLoaded")} ${customFontName}`;
      }
      row.appendChild(statusEl);
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
