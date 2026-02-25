import { onChange } from "../utils/css-var-manager.js";
import { generateCSS, copyToClipboard } from "../utils/export.js";

export function renderCodePanel(container) {
  buildCodePanel(container);
  onChange(() => updateCode(container));
}

function buildCodePanel(container) {
  container.innerHTML = `
    <div class="code-panel-header">
      <span class="code-panel-title">CSS Variables Output</span>
      <div class="code-panel-actions">
        <button class="code-panel-btn" id="code-copy-btn">📋 Copy</button>
      </div>
    </div>
    <div class="code-panel-body">
      <pre><code id="code-output"></code></pre>
    </div>
  `;

  container.querySelector("#code-copy-btn").addEventListener("click", async () => {
    const css = generateCSS();
    const success = await copyToClipboard(css);
    const btn = container.querySelector("#code-copy-btn");
    if (success) {
      btn.textContent = "✅ Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "📋 Copy";
        btn.classList.remove("copied");
      }, 2000);
    }
  });

  updateCode(container);
}

function updateCode(container) {
  const codeEl = container.querySelector("#code-output");
  if (codeEl) {
    const css = generateCSS();
    codeEl.textContent = css;
    // Basic syntax highlighting without Prism dependency at runtime
    highlightCSS(codeEl);
  }
}

function highlightCSS(element) {
  const text = element.textContent;
  const highlighted = text
    .replace(/(\/\*.*?\*\/)/g, '<span class="token comment">$1</span>')
    .replace(/(--[\w-]+)/g, '<span class="token property">$1</span>')
    .replace(/(:)\s*(.*?)(;)/g, '$1 <span class="token value">$2</span>$3')
    .replace(/([:;{}])/g, '<span class="token punctuation">$1</span>');
  element.innerHTML = highlighted;
}
