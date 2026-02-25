# 🤝 Contributing Guide

感谢你为 `Web Style Visualisation` 做贡献。

本项目当前处于 `docs-first` 阶段：仓库已定义完整技术方案与数据协议，代码目录将在后续初始化。你可以先贡献文档，也可以提前提交风格 JSON 方案。

## 你可以贡献什么

- 文档改进：术语统一、结构优化、示例补充、错别字修复。
- 新风格提案：新增或改进风格 JSON（含变量、专属微调、关键属性说明）。
- 工程实现：在代码目录初始化后提交组件、面板、校验脚本、`CI` 配置。

## 快速流程

```bash
# 1) Fork + Clone
git clone <your-fork-url>
cd web-style-visualisation

# 2) 创建分支
git checkout -b feat/<short-topic>

# 3) 修改文档或代码
# edit files

# 4) 提交
git add .
git commit -m "docs: improve style contribution spec"

# 5) 推送并发起 PR
git push origin feat/<short-topic>
```

如果你只提交新风格，推荐分支名：

```bash
git checkout -b style/<style-id>
```

## 风格 JSON 贡献规范

目标目录（代码初始化后）：`src/styles/`

### 1) 从模板创建

```bash
cp src/styles/_template.json src/styles/<style-id>.json
```

### 2) 必填字段

```json
{
  "id": "neo-brutalism",
  "name": "Neo Brutalism",
  "nameZh": "新粗犷主义",
  "category": "modern",
  "description": "A bold style with sharp contrast and hard shadows",
  "descriptionZh": "高对比、硬阴影、强烈排版的视觉风格",
  "author": "your-github-username",
  "variables": {
    "--color-primary": "#ff5722",
    "--color-bg": "#ffffff",
    "--color-surface": "#f5f5f5",
    "--color-text": "#111111",
    "--color-accent": "#00e5ff",
    "--border-radius": "0px",
    "--border-width": "3px",
    "--border-color": "#000000",
    "--shadow-x": "6px",
    "--shadow-y": "6px",
    "--shadow-blur": "0px",
    "--shadow-color": "#000000",
    "--font-family": "\"Inter\", sans-serif",
    "--font-weight": "700"
  },
  "specialTuning": [],
  "keyProperties": [
    {
      "property": "box-shadow",
      "explanation": "使用硬阴影构建强烈层次"
    }
  ]
}
```

### 3) `category` 可选值

| 值 | 说明 |
|---|---|
| `classic` | 经典基础风格 |
| `modern` | 现代流行风格 |
| `theme` | 主题与氛围风格 |

### 4) `specialTuning` 规则

支持 3 种控件类型：`range`、`color`、`select`。

```json
{
  "variable": "--backdrop-blur",
  "label": "模糊强度",
  "type": "range",
  "min": 0,
  "max": 30,
  "step": 1,
  "unit": "px"
}
```

`select` 示例：

```json
{
  "variable": "--neu-type",
  "label": "凸起/凹陷",
  "type": "select",
  "options": ["raised", "pressed"]
}
```

## 验证与自测

代码初始化后，请在本地至少执行：

```bash
npm install
npm run validate
npm run dev
```

检查点：

- 风格可被自动发现（无需手动注册）。
- 微调控件能正确更新对应 `CSS Variables`。
- 代码面板可正确输出当前变量值。
- 页面无明显视觉回归（`Button`、`Card`、`Form`、`Navbar` 均可读可用）。

## PR 清单

提交 PR 前请确认：

- [ ] 文件路径与命名符合规范（如 `src/styles/<style-id>.json`）。
- [ ] JSON 文件名与 `id` 字段一致。
- [ ] 关键变量已完整填写。
- [ ] 至少包含 1 条 `keyProperties`。
- [ ] 文案遵循中英文排版规范（中文与英文/数字之间加空格）。
- [ ] 若改动可执行逻辑，已附最小验证说明（命令 + 结果）。

## Commit Message 建议

| 类型 | 何时使用 | 示例 |
|---|---|---|
| `feat` | 新功能/新风格 | `feat: add neo-brutalism style` |
| `fix` | 修复问题 | `fix: correct shadow variable mapping` |
| `docs` | 文档更新 | `docs: clarify style json schema` |
| `chore` | 工具或配置维护 | `chore: update lint config` |

## 文档与术语规范

请保持以下写法一致：

- `CSS Variables`（不要写成 `CSS variables`）
- `Vanilla JS`（不要写成 `vanilla js`）
- `GitHub Pages`（不要写成 `Github pages`）
- `Material Design`、`Glassmorphism`、`Neumorphism`（首字母大写）

## 讨论与协作

- 新增风格前，建议先开 Issue 说明设计动机与参考链接。
- 对变量命名、数据协议有改动时，请先在 PR 描述中给出兼容性说明。
- 欢迎在 PR 中附对比截图或录屏，帮助审阅者快速理解改动。
