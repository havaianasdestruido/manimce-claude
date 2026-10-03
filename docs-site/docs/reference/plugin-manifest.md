---
title: Plugin metadata
---

The `.claude-plugin/` directory exposes the repository to Claude Code.

## `marketplace.json`

Defines the marketplace name and owner, then advertises `manim-community-plugin` as a development plugin. Its keywords improve discovery for Manim, Python, animation, mathematics, and education.

## `plugin.json`

Defines package-level identity, version, author, repository, license, and keywords. Keep its version aligned with the marketplace version when releasing.

Validate metadata and the package layout before release:

```bash
claude plugin validate .
```

The Markdown skill itself remains portable to hosts that do not implement Claude Code's marketplace protocol.
