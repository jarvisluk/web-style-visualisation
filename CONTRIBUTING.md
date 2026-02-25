# 🤝 Contributing Guide

[中文文档](./CONTRIBUTING_zh.md)

Thank you for contributing to `Web Style Visualisation`.

This project is currently in the `docs-first` phase: The repository has defined a complete technical plan and data protocol, and the code directory will be initialized later. You can contribute to the documentation first, or submit style JSON schemas in advance.

## What You Can Contribute

- **Documentation Improvements**: Terminology unification, structure optimization, example supplementation, typo fixes.
- **New Style Proposals**: Propose or improve style JSONs (including variables, specific tuning parameters, and descriptions of key properties).
- **Engineering Implementation**: After the code directory is initialized, submit components, panels, validation scripts, or `CI` configurations.

## Quick Process

```bash
# 1) Fork + Clone
git clone <your-fork-url>
cd web-style-visualisation

# 2) Create a branch
git checkout -b feat/<short-topic>

# 3) Modify documentation or code
# edit files

# 4) Commit
git add .
git commit -m "docs: improve style contribution spec"

# 5) Push and open a PR
git push origin feat/<short-topic>
```

If you are just submitting a new style, recommended branch name format:

```bash
git checkout -b style/<style-id>
```

## Style JSON Contribution Spec

Target directory (after code initialization): `src/styles/`

### 1) Create from Template

```bash
cp src/styles/_template.json src/styles/<style-id>.json
```

### 2) Required Fields

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
      "explanation": "Use hard shadows to build strong visual hierarchy"
    }
  ]
}
```

### 3) `category` Allowed Values

| Value | Description |
|---|---|
| `classic` | Classic basic styles |
| `modern` | Modern trending styles |
| `theme` | Themes and atmospheres |

### 4) `specialTuning` Rules

Supports 3 types of controls: `range`, `color`, `select`.

```json
{
  "variable": "--backdrop-blur",
  "label": "Blur Intensity",
  "type": "range",
  "min": 0,
  "max": 30,
  "step": 1,
  "unit": "px"
}
```

`select` Example:

```json
{
  "variable": "--neu-type",
  "label": "Raised/Pressed",
  "type": "select",
  "options": ["raised", "pressed"]
}
```

## Validation & Self-Testing

After the code is initialized, please be sure to execute at least the following locally:

```bash
npm install
npm run validate
npm run dev
```

Checkpoints:

- Your style can be automatically discovered (no manual registration required).
- Fine-tuning controls correctly update the corresponding `CSS Variables`.
- The code panel correctly outputs the current variable values.
- There are no obvious visual regressions on the page (`Button`, `Card`, `Form`, `Navbar` are all legible and usable).

## PR Checklist

Before submitting a PR, please make sure:

- [ ] File paths and naming follow the specification (e.g., `src/styles/<style-id>.json`).
- [ ] The JSON filename matches the `id` field.
- [ ] Key variables have been completely filled out.
- [ ] It contains at least 1 `keyProperties`.
- [ ] Copywriting follows Chinese and English typography guidelines (add spaces between Chinese and English/numbers in Chinese descriptions).
- [ ] If changing executable logic, please include minimal verification instructions (command + result).

## Commit Message Guidelines

| Type | When to Use | Example |
|---|---|---|
| `feat` | New feature / new style | `feat: add neo-brutalism style` |
| `fix` | Bug fixes | `fix: correct shadow variable mapping` |
| `docs` | Documentation updates | `docs: clarify style json schema` |
| `chore` | Tool or config maintenance | `chore: update lint config` |

## Documentation and Terminology Norms

Please maintain consistency with the following terms:

- `CSS Variables` (Do not write `CSS variables`)
- `Vanilla JS` (Do not write `vanilla js`)
- `GitHub Pages` (Do not write `Github pages`)
- Capitalize the first letter for `Material Design`, `Glassmorphism`, `Neumorphism`

## Discussions and Collaboration

- Before proposing new styles, it is highly recommended to open an Issue explaining the design motivation and reference links.
- When there are changes to variable naming or data protocols, please provide compatibility notes in the PR description.
- You are welcome to include comparison screenshots or screen recordings in the PR to help reviewers quickly understand your changes.
