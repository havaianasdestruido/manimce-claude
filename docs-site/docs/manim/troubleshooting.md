---
title: Troubleshooting
---

Use this order to isolate failures quickly.

## Installation and command failures

1. Run `python -m manim --version` to verify the interpreter can import Manim.
2. If `manim` is not on `PATH`, activate the virtual environment or use `uv run manim`.
3. Run `manim checkhealth` to identify missing external tools.
4. For ManimPango or Cairo build errors, install the platform system dependencies documented in [installation](./installation.md).

## Scene and render failures

- **No scene found:** ensure the CLI class name exactly matches a `Scene` subclass.
- **Blank output:** add the mobject using `self.add(...)` or animate it with `self.play(...)`; finish with `self.wait()`.
- **Wrong API names:** replace legacy `ShowCreation`, `TextMobject`, and `TexMobject` with `Create`, `Tex`, and `MathTex`.
- **LaTeX fails, plain text works:** `Tex` and `MathTex` require a complete LaTeX toolchain. Use `Text` when mathematical typesetting is unnecessary.
- **Backslash errors:** use Python raw strings for TeX, such as `MathTex(r"\frac{1}{2}")`.

## Diagnose before changing code

Render a minimal scene using `-ql`, then add pieces back incrementally. Keep the complete terminal traceback: the earliest external-tool error often explains later renderer errors. If local behavior differs from this knowledge base, trust the installed version and consult the [official FAQ](https://docs.manim.community/en/stable/faq/).
