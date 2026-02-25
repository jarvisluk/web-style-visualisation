# 🎨 贡献指南 — 如何添加新风格

感谢你对 Web Style Visualisation 的贡献！添加一种新的网站设计风格非常简单 — **只需创建一个 JSON 文件**。

---

## 快速开始（3 步）

### 1. 复制模板

```bash
cp src/styles/_template.json src/styles/your-style-name.json
```

### 2. 编辑 JSON

打开新文件，填入你的风格定义。以下是每个字段的说明：

```json
{
  "id": "your-style-name",          // ⚠️ 必须与文件名一致（不含 .json）
  "name": "Your Style Name",        // 英文名称
  "nameZh": "你的风格名称",          // 中文名称
  "category": "modern",             // 分类，见下方可选值
  "description": "English desc",    // 一句话英文描述
  "descriptionZh": "中文描述",       // 一句话中文描述
  "author": "your-github-username", // 你的 GitHub 用户名
  "references": [                   // 参考链接（可选）
    "https://example.com"
  ],
  "variables": { ... },             // CSS Variables 值，见下方
  "specialTuning": [ ... ],         // 风格专属微调参数，见下方
  "keyProperties": [ ... ]          // 关键 CSS 属性说明，见下方
}
```

### 3. 提交 PR

```bash
git checkout -b style/your-style-name
git add src/styles/your-style-name.json
git commit -m "feat: add your-style-name style"
git push origin style/your-style-name
```

> **就这样！** 不需要修改任何其他文件。Vite 的 `import.meta.glob` 会自动发现新的 JSON 文件。

---

## 字段详细说明

### `category` 可选值

| 值 | 说明 | 示例 |
|---|------|------|
| `classic` | 经典基础风格 | Flat Design, Material Design, Skeuomorphism |
| `modern` | 现代流行风格 | Glassmorphism, Neumorphism, Claymorphism |
| `theme` | 主题与氛围 | Dark Mode, Retro, Sci-Fi |

### `variables` — CSS Variables

这是风格的核心。你需要为以下 CSS Variables 提供值：

#### 必填变量

| Variable | 说明 | 示例值 |
|----------|------|--------|
| `--color-primary` | 主色调 | `"#3498db"` |
| `--color-bg` | 页面背景色 | `"#ffffff"` |
| `--color-surface` | 卡片/面板背景色 | `"#f5f5f5"` |
| `--color-text` | 主文字颜色 | `"#333333"` |
| `--color-accent` | 强调色 | `"#e74c3c"` |
| `--border-radius` | 圆角大小 | `"8px"` |
| `--border-width` | 边框宽度 | `"1px"` |
| `--border-color` | 边框颜色 | `"#e0e0e0"` |
| `--shadow-x` | 阴影 X 偏移 | `"0px"` |
| `--shadow-y` | 阴影 Y 偏移 | `"2px"` |
| `--shadow-blur` | 阴影模糊半径 | `"8px"` |
| `--shadow-color` | 阴影颜色 | `"rgba(0,0,0,0.1)"` |
| `--font-family` | 字体 | `"'Inter', sans-serif"` |
| `--font-weight` | 字重 | `"400"` |

#### 可选变量（特殊效果）

| Variable | 说明 | 默认值 |
|----------|------|--------|
| `--backdrop-blur` | 背景模糊（毛玻璃） | `"0px"` |
| `--bg-opacity` | 背景透明度 | `"1"` |
| `--glow-intensity` | 发光强度 | `"0"` |
| `--shadow-inset` | 内阴影 | `"none"` |

### `specialTuning` — 风格专属微调控件

如果你的风格有独特的可调参数，在这里定义。用户选中该风格时，微调面板会额外显示这些控件。

```json
"specialTuning": [
  {
    "variable": "--backdrop-blur",  // 对应的 CSS Variable
    "label": "模糊强度",             // 控件显示名称
    "type": "range",                // 控件类型: "range" | "color" | "select"
    "min": 0,                       // 最小值（range 类型）
    "max": 30,                      // 最大值（range 类型）
    "step": 1,                      // 步进值（可选，默认 1）
    "unit": "px"                    // 单位后缀
  }
]
```

**支持的控件类型：**

| type | 用途 | 额外字段 |
|------|------|---------|
| `range` | 数值滑块 | `min`, `max`, `step`, `unit` |
| `color` | 拾色器 | 无 |
| `select` | 下拉选择 | `options: ["option1", "option2"]` |

### `keyProperties` — 关键 CSS 属性说明

用于代码面板高亮展示，告诉用户这种风格的 CSS"精髓"在哪：

```json
"keyProperties": [
  {
    "property": "backdrop-filter: blur()",
    "explanation": "核心：对背后内容应用模糊效果"
  },
  {
    "property": "background: rgba()",
    "explanation": "半透明背景让模糊效果透出"
  }
]
```

---

## 完整示例

### Glassmorphism （毛玻璃风格）

```json
{
  "id": "glassmorphism",
  "name": "Glassmorphism",
  "nameZh": "毛玻璃",
  "category": "modern",
  "description": "Frosted glass effect with blur and transparency",
  "descriptionZh": "通过模糊和半透明效果创造磨砂玻璃质感",
  "author": "example-user",
  "references": ["https://css.glass/", "https://ui.glass/generator/"],
  "variables": {
    "--color-primary": "#6366f1",
    "--color-bg": "#0f0f23",
    "--color-surface": "rgba(255, 255, 255, 0.1)",
    "--color-text": "#ffffff",
    "--color-accent": "#a78bfa",
    "--border-radius": "16px",
    "--border-width": "1px",
    "--border-color": "rgba(255, 255, 255, 0.2)",
    "--shadow-x": "0px",
    "--shadow-y": "8px",
    "--shadow-blur": "32px",
    "--shadow-color": "rgba(31, 38, 135, 0.15)",
    "--font-family": "'Inter', sans-serif",
    "--font-weight": "400",
    "--backdrop-blur": "10px",
    "--bg-opacity": "0.1"
  },
  "specialTuning": [
    {
      "variable": "--backdrop-blur",
      "label": "模糊强度",
      "type": "range",
      "min": 0,
      "max": 30,
      "unit": "px"
    },
    {
      "variable": "--bg-opacity",
      "label": "透明度",
      "type": "range",
      "min": 0,
      "max": 1,
      "step": 0.05,
      "unit": ""
    }
  ],
  "keyProperties": [
    { "property": "backdrop-filter: blur()", "explanation": "核心：对背后内容应用模糊" },
    { "property": "background: rgba()", "explanation": "半透明背景让模糊透出" },
    { "property": "border: 1px solid rgba()", "explanation": "半透明边框模拟玻璃边缘" }
  ]
}
```

---

## PR 检查清单

提交 PR 前，请确认：

- [ ] JSON 文件名与 `id` 字段一致
- [ ] 文件放在 `src/styles/` 目录下
- [ ] 文件名不以 `_` 开头（下划线开头的文件会被忽略）
- [ ] 所有必填 variables 都已提供
- [ ] `category` 使用了有效值（`classic` / `modern` / `theme`）
- [ ] 至少有 1 条 `keyProperties`
- [ ] 本地运行 `npm run validate` 通过
- [ ] 本地运行 `npm run dev` 查看效果正常

## 本地验证

```bash
# 校验所有 style JSON 格式
npm run validate

# 启动开发服务器查看效果
npm run dev
```

---

## 命名规范

| 项目 | 规范 | 示例 |
|------|------|------|
| 文件名 | 小写 + 短横线 | `neo-brutalism.json` |
| `id` | 与文件名一致 | `"neo-brutalism"` |
| `name` | 英文标题格式 | `"Neo Brutalism"` |
| `nameZh` | 中文名称 | `"新粗犷主义"` |
| 分支名 | `style/` 前缀 | `style/neo-brutalism` |
| Commit | `feat:` 前缀 | `feat: add neo-brutalism style` |

---

## 需要帮助？

- 查看现有风格文件作为参考：`src/styles/*.json`
- 在 Issues 中讨论你想添加的风格
- 不确定某个值该填什么？先用模板默认值，在 PR 中说明即可
