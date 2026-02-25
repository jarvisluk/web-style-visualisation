import { getCurrentVariables, getCurrentStyle } from "./css-var-manager.js";

export function generateCSS() {
  const vars = getCurrentVariables();
  const style = getCurrentStyle();
  const styleName = style ? style.name : "Custom";

  const lines = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  return `/* Style: ${styleName} */\n:root {\n${lines}\n}`;
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}
