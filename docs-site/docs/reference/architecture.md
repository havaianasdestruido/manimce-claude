---
title: Architecture
---

The repository contains three independently useful layers:

```text
.
├── SKILL.md                 # agent entry point and routing instructions
├── references/              # detailed ManimCE knowledge modules
├── .claude-plugin/          # Claude Code marketplace metadata
├── index.md                 # Jekyll marketing homepage
├── _layouts/ + assets/      # Jekyll presentation layer
├── docs-site/               # Docusaurus documentation application
└── .github/workflows/       # validation and GitHub Pages deployment
```

## Runtime model

The skill has no executable runtime. An agent host reads YAML front matter from `SKILL.md`, matches the description against a user request, then injects the Markdown instructions. Relative references let the agent load deeper material only when needed.

## Web publishing model

The public site deliberately uses two static generators:

1. **Jekyll** builds the primary project page at the repository's GitHub Pages base URL.
2. **Docusaurus** builds this documentation with `routeBasePath: '/'` and a base URL ending in `/docs/`.
3. The deployment workflow copies the Docusaurus output into Jekyll's `_site/docs` directory.
4. A single Pages artifact is uploaded, so `/manimce-claude/` is Jekyll and `/manimce-claude/docs/` is Docusaurus.

This avoids an iframe, redirect-only landing page, or a second deployment target.
