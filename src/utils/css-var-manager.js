import { STYLES, STYLE_LIST } from "../styles/index.js";

const VARIABLE_DEFINITIONS = [
  "--color-primary", "--color-primary-hover", "--color-bg", "--color-surface",
  "--color-text", "--color-text-secondary", "--color-accent", "--color-border",
  "--border-radius", "--border-width", "--border-color",
  "--shadow-x", "--shadow-y", "--shadow-blur", "--shadow-spread", "--shadow-color",
  "--font-family", "--font-weight", "--font-weight-bold",
  "--backdrop-blur", "--bg-opacity", "--glow-intensity", "--glow-color"
];

let currentStyleId = null;
let overrides = {};
let listeners = [];

export function getCurrentStyleId() {
  return currentStyleId;
}

export function applyStyle(styleId) {
  const style = STYLES[styleId];
  if (!style) return;

  currentStyleId = styleId;
  overrides = {};
  const root = document.documentElement;

  // Reset all variables to CSS defaults first
  VARIABLE_DEFINITIONS.forEach((varName) => {
    root.style.removeProperty(varName);
  });

  // Apply style variables
  Object.entries(style.variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  notifyListeners();
}

export function setVariable(name, value) {
  document.documentElement.style.setProperty(name, value);
  overrides[name] = value;
  notifyListeners();
}

export function resetToStyle() {
  if (currentStyleId) {
    applyStyle(currentStyleId);
  }
}

export function getCurrentVariables() {
  const style = getCurrentStyle();
  if (!style) return {};

  const result = { ...style.variables };
  Object.entries(overrides).forEach(([key, value]) => {
    result[key] = value;
  });
  return result;
}

export function getComputedVariable(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Apply custom CSS variables from raw CSS text.
 * Parses :root { --var: value; } blocks or plain --var: value; lines.
 */
let customStyle = null;

export function applyCustomVariables(cssText) {
  const variables = {};
  // Match --variable: value patterns
  const regex = /(--[\w-]+)\s*:\s*([^;]+)/g;
  let match;
  while ((match = regex.exec(cssText)) !== null) {
    variables[match[1].trim()] = match[2].trim();
  }

  if (Object.keys(variables).length === 0) return false;

  customStyle = {
    id: "custom",
    name: "Custom",
    nameZh: "自定义",
    category: "custom",
    description: "User-uploaded custom CSS variables",
    descriptionZh: "用户上传的自定义 CSS 变量",
    author: "user",
    variables,
    specialTuning: [],
    keyProperties: [{ property: "custom upload", explanation: "用户自定义" }]
  };

  currentStyleId = "custom";
  overrides = {};
  const root = document.documentElement;

  VARIABLE_DEFINITIONS.forEach((varName) => {
    root.style.removeProperty(varName);
  });

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  notifyListeners();
  return true;
}

export function getCurrentStyle() {
  if (currentStyleId === "custom" && customStyle) return customStyle;
  return currentStyleId ? STYLES[currentStyleId] : null;
}

export function onChange(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

function notifyListeners() {
  listeners.forEach((fn) => fn(currentStyleId, overrides));
}
