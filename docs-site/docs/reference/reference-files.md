---
title: Reference files
---

The `references/` directory splits long-form knowledge by task so an agent only loads relevant context.

| File | Responsibility |
| --- | --- |
| `installation.md` | Platform installation, virtual environments, LaTeX, system libraries, health checks |
| `core-concepts.md` | Scene lifecycle, mobjects, transformations, positioning, styling, trackers, updaters |
| `cli-and-config.md` | Render flags, quality presets, output paths, sections, and `manim.cfg` precedence |
| `text-and-tex.md` | Pango text, LaTeX math, Typst, fonts, isolation, and matching transforms |
| `cookbook.md` | Reusable examples for plotting, cameras, 3D, plugins, and broader troubleshooting |

Reference documents should be self-contained enough to load independently, but avoid duplicating the quick-reference material unless context is essential. Commands and examples must be valid for the version named in `SKILL.md`.
