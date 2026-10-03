---
title: SKILL.md
---

`SKILL.md` is the canonical entry point. Its YAML front matter has two required fields:

- `name`: stable machine-readable skill identifier (`manim-community`);
- `description`: detailed activation criteria, disambiguation, and trigger vocabulary.

The body is optimized for immediate use. It identifies the supported Manim flavor, introduces the three core classes, provides a runnable example, lists common mobjects and animations, documents frequent failures, and routes specialized questions into reference files.

## Design constraints

- Examples target modern Manim Community Edition and import from `manim`.
- Guidance defaults to low-quality rendering (`-ql`) while iterating.
- Plain `Text` is preferred unless TeX typesetting is actually required.
- Legacy and ManimGL names are called out explicitly rather than silently mixed in.
- Every referenced relative path must exist in the installed skill directory.

When updating behavior, change the canonical root source first, then keep the corresponding website guide synchronized.
