import { STYLES, CATEGORIES } from "../styles/index.js";

const translations = {
  en: {
    "nav.preview": "Preview",
    "nav.components": "Components",
    "nav.github": "GitHub",
    "nav.lang": "中/EN",
    "panel.tuning": "⚙️ Fine Tuning",
    "tuning.reset": "Reset",
    "tuning.colors": "🎨 Colors",
    "tuning.shape": "📐 Shape",
    "tuning.shadow": "🌑 Shadow",
    "tuning.typography": "🔤 Typography",
    "tuning.spacing": "📏 Spacing",
    "tuning.special": "✨ Special",
    "code.title": "CSS Variables Output",
    "code.copy": "📋 Copy",
    "code.copied": "✅ Copied!",
    "code.download": "📥 Download",
    "selector.title": "Select Style",
    "custom.title": "Upload Custom CSS Variables",
    "custom.name": "＋ Custom",
    "custom.hint": "Paste CSS Variables code or upload a .css file.<br>Example: <code>--color-primary: #6366f1;</code>",
    "custom.upload": "📁 Upload .css file",
    "custom.apply": "Apply",
    "custom.cancel": "Cancel",
  },
  zh: {
    "nav.preview": "预览",
    "nav.components": "组件",
    "nav.github": "源码",
    "nav.lang": "EN/中",
    "panel.tuning": "⚙️ 参数微调",
    "tuning.reset": "重置",
    "tuning.colors": "🎨 颜色系统",
    "tuning.shape": "📐 形状语言",
    "tuning.shadow": "🌑 阴影系统",
    "tuning.typography": "🔤 字体排版",
    "tuning.spacing": "📏 基础间距",
    "tuning.special": "✨ 专属特色",
    "code.title": "CSS 变量输出",
    "code.copy": "📋 复制",
    "code.copied": "✅ 已复制!",
    "code.download": "📥 下载 .css",
    "selector.title": "选择风格",
    "custom.title": "上传自定义 CSS 变量",
    "custom.name": "＋ 自定义",
    "custom.hint": "粘贴包含 CSS Variables 的代码，或上传 .css 文件。<br>格式示例：<code>--color-primary: #6366f1;</code>",
    "custom.upload": "📁 上传 .css 文件",
    "custom.apply": "应用",
    "custom.cancel": "取消",
  }
};

let currentLang = localStorage.getItem("i18n_lang") || "zh";
let listeners = [];

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (lang !== "en" && lang !== "zh") return;
  currentLang = lang;
  localStorage.setItem("i18n_lang", lang);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  notifyListeners();
}

export function toggleLang() {
  setLang(currentLang === "zh" ? "en" : "zh");
}

export function t(key) {
  return translations[currentLang][key] || key;
}

export function getStyleName(style) {
  return currentLang === "zh" && style.nameZh ? style.nameZh : style.name;
}

export function getStyleDesc(style) {
  return currentLang === "zh" && style.descriptionZh ? style.descriptionZh : style.description;
}

export function getCategoryName(categoryId) {
  if (currentLang === "en") {
    const enMap = {
      "classic": "Classic",
      "modern": "Modern",
      "theme": "Theme",
      "custom": "Upload CSS"
    };
    return enMap[categoryId] || categoryId;
  }
  return CATEGORIES[categoryId] || categoryId;
}

export function onLangChange(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

function notifyListeners() {
  listeners.forEach((fn) => fn(currentLang));
}
