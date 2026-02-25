import { STYLES, CATEGORIES } from "../styles/index.js";

const translations = {
  en: {
    "nav.preview": "Preview",
    "nav.components": "Components",
    "nav.github": "GitHub",
    "nav.lang": "中/EN",
    "hero.start": "Get Started",
    "hero.learn": "Learn More",
    "panel.tuning": "⚙️ Fine Tuning",
    "tuning.reset": "Reset",
    "tuning.colors": "🎨 Colors",
    "tuning.shape": "📐 Shape",
    "tuning.shadow": "🌑 Shadow",
    "tuning.typography": "🔤 Typography",
    "tuning.spacing": "📏 Spacing",
    "tuning.special": "✨ Special",
    "tuning.primary": "Primary",
    "tuning.background": "Background",
    "tuning.surface": "Surface",
    "tuning.text": "Text",
    "tuning.accent": "Accent",
    "tuning.borderRadius": "Border Radius",
    "tuning.borderWidth": "Border Width",
    "tuning.borderColor": "Border Color",
    "tuning.offsetX": "Offset X",
    "tuning.offsetY": "Offset Y",
    "tuning.blur": "Blur",
    "tuning.shadowColor": "Shadow Color",
    "tuning.fontFamily": "Font Family",
    "tuning.fontWeight": "Font Weight",
    "tuning.baseSpacing": "Base Spacing",
    "tuning.uploadFont": "Upload Font",
    "tuning.detectFonts": "Detect System Fonts",
    "tuning.detecting": "Detecting...",
    "tuning.detected": "fonts detected",
    "tuning.notSupported": "Not supported in this browser",
    "tuning.fontLoaded": "Loaded:",
    "tuning.googleFonts": "Google Fonts",
    "tuning.systemFonts": "System Fonts",
    "tuning.customFont": "Custom Upload",
    "code.title": "CSS Variables Output",
    "code.copy": "Copy",
    "code.copied": "Copied!",
    "code.download": "Download",
    "selector.title": "Select Style",
    "custom.title": "Upload Custom CSS Variables",
    "custom.name": "＋ Custom",
    "custom.hint": "Paste CSS Variables code or upload a .css file.<br>Example: <code>--color-primary: #6366f1;</code>",
    "custom.upload": "Upload .css file",
    "custom.apply": "Apply",
    "custom.cancel": "Cancel",
    "cards.c1.title": "Color System",
    "cards.c1.text": "Every style defines a unique color palette. Switch the entire site's color language with one click.",
    "cards.c2.title": "Shape Language",
    "cards.c2.text": "Border radii, borders, and shadows form the shape language. The tuning panel helps you understand every parameter.",
    "cards.c3.title": "Special Effects",
    "cards.c3.text": "Glass blur, neon glow, hard shadows — distinct effects are key factors in differentiating styles.",
    "cards.learn": "Learn More",
  },
  zh: {
    "nav.preview": "预览",
    "nav.components": "组件",
    "nav.github": "源码",
    "nav.lang": "EN/中",
    "hero.start": "开始使用",
    "hero.learn": "了解更多",
    "panel.tuning": "⚙️ 参数微调",
    "tuning.reset": "重置",
    "tuning.colors": "🎨 颜色系统",
    "tuning.shape": "📐 形状语言",
    "tuning.shadow": "🌑 阴影系统",
    "tuning.typography": "🔤 字体排版",
    "tuning.spacing": "📏 基础间距",
    "tuning.special": "✨ 专属特色",
    "tuning.primary": "主色",
    "tuning.background": "背景色",
    "tuning.surface": "表面色",
    "tuning.text": "文本色",
    "tuning.accent": "强调色",
    "tuning.borderRadius": "圆角大小",
    "tuning.borderWidth": "边框宽度",
    "tuning.borderColor": "边框颜色",
    "tuning.offsetX": "X 轴偏移",
    "tuning.offsetY": "Y 轴偏移",
    "tuning.blur": "模糊半径",
    "tuning.shadowColor": "阴影颜色",
    "tuning.fontFamily": "首选字体",
    "tuning.fontWeight": "字体粗细",
    "tuning.baseSpacing": "基础间距",
    "tuning.uploadFont": "上传字体",
    "tuning.detectFonts": "检测系统字体",
    "tuning.detecting": "检测中...",
    "tuning.detected": "个字体已检测",
    "tuning.notSupported": "当前浏览器不支持",
    "tuning.fontLoaded": "已加载：",
    "tuning.googleFonts": "谷歌字体",
    "tuning.systemFonts": "系统字体",
    "tuning.customFont": "自定义上传",
    "code.title": "CSS 变量输出",
    "code.copy": "复制",
    "code.copied": "已复制!",
    "code.download": "下载 .css",
    "selector.title": "选择风格",
    "custom.title": "上传自定义 CSS 变量",
    "custom.name": "＋ 自定义",
    "custom.hint": "粘贴包含 CSS Variables 的代码，或上传 .css 文件。<br>格式示例：<code>--color-primary: #6366f1;</code>",
    "custom.upload": "上传 .css 文件",
    "custom.apply": "应用",
    "custom.cancel": "取消",
    "cards.c1.title": "色彩系统",
    "cards.c1.text": "每种风格定义独特的配色方案，从主色到强调色，一键切换整站色彩语言。",
    "cards.c2.title": "形状语言",
    "cards.c2.text": "圆角、边框、阴影共同构成风格的形状语言，微调面板让你深入理解每个参数。",
    "cards.c3.title": "专属特效",
    "cards.c3.text": "毛玻璃模糊、霓虹发光、硬阴影 — 独特效果是区分风格的关键因素。",
    "cards.learn": "了解更多",
  }
};

let currentLang = localStorage.getItem("i18n_lang") || "en";
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
