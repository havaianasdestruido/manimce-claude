---
name: manim-community
description: Reference for Manim Community Edition (ManimCE) — the Python library (`pip install manim`) for programmatic math/science animation in the style of 3Blue1Brown. Use whenever the user wants to write, edit, debug, or render a Manim scene; asks about Scene, Mobject, VMobject, VGroup, Animation, Axes, Tex, MathTex, Text, Transform, ValueTracker, updaters, or camera classes; wants to animate shapes, equations, graphs, or text; wants an explainer/educational video made with Python; mentions "manim", "ManimCE", or manimations; or hits `manim` CLI errors (LaTeX/TeX errors, ManimPango install failures, blank/black renders, "scene not found", ffmpeg issues). Also use for installing Manim on Windows/macOS/Linux, render-quality flags, manim.cfg, or telling apart Manim (ManimCE), ManimGL, and old ManimCairo — incompatible libraries with confusingly similar names.
---

# Manim Community Edition (ManimCE)

Manim is a Python library for creating precise, programmatic animations — circles morphing into squares, equations rewriting themselves, function graphs being drawn, camera pans across a proof. The person writes a Python `Scene` subclass; Manim renders it to an MP4 (or GIF/PNG/WebM).

This skill reflects the official ManimCE documentation (docs.manim.community) as of v0.21.0. Manim moves reasonably fast between minor versions — if something here seems to conflict with an error message the person is actually seeing, trust the error and search docs.manim.community rather than this file.

## Which "Manim"? Read this first.

There are **three incompatible libraries** that all get called "Manim". Get this wrong and every code sample you write will fail to import correctly.

| | Import style | Install | Notes |
|---|---|---|---|
| **Manim / ManimCE** (this skill) | `from manim import *` | `pip install manim` (PyPI: `manim`) | Community-maintained fork. Best documented, most stable, what beginners should use. **Assume this is what the person means unless they say otherwise.** |
| ManimGL | `import manimlib` / `from manimlib import *` | `pip install manimgl` | Grant Sanderson's (3Blue1Brown) personal, actively-changing version. More experimental, breaking changes undocumented. |
| ManimCairo (very old, pre-2020) | `from big_ol_pile_of_manim_imports import *` or `from manimlib.imports import *` | source only | Only relevant for re-rendering ancient 3b1b videos. Never write new code against this. |

If the person pastes code and it errors on import, check which of these it's written for before assuming it's a ManimCE bug. Full disambiguation details: `references/installation.md`.

## The mental model

Three concepts, three classes:

- **`Mobject`** ("mathematical object") — anything that can be shown on screen: a `Circle`, a `Square`, a block of `Text`, a set of `Axes`. Most concrete mobjects are actually `VMobject`s (vectorized, drawn with Bézier curves).
- **`Animation`** — a procedure that interpolates a mobject from one state to another (`Create`, `FadeIn`, `Transform`, `Rotate`, …).
- **`Scene`** — the timeline. All your code lives inside a `Scene` subclass's `construct()` method. `self.add(mobject)` puts something on screen instantly; `self.play(animation)` animates it; `self.wait()` pauses.

Minimal example (save as `scene.py`):

```python
from manim import *

class CreateCircle(Scene):
    def construct(self):
        circle = Circle()
        circle.set_fill(PINK, opacity=0.5)
        self.play(Create(circle))
        self.wait()
```

Render it with:

```
manim -pql scene.py CreateCircle
```

`-p` previews (opens) the result, `-ql` renders at low quality (854x480, fast) for iterating. Swap to `-qh` for the final high-quality (1920x1080) render.

## Quick reference

**Common Mobjects**: `Circle`, `Square`, `Rectangle`, `Triangle`, `Polygon`, `RegularPolygon`, `Line`, `Arrow`, `Vector`, `Dot`, `Ellipse`, `Star`, `Text`, `Tex`, `MathTex`, `MarkupText`, `Axes`, `NumberPlane`, `NumberLine`, `Matrix`, `Table`, `VGroup`, `ImageMobject`, `SVGMobject`.

**Common Animations**: `Create` / `Uncreate`, `Write` / `Unwrite`, `FadeIn` / `FadeOut`, `Transform` / `ReplacementTransform`, `TransformMatchingShapes` / `TransformMatchingTex`, `Rotate`, `GrowFromCenter`, `Indicate`, `Circumscribe`, `Wiggle`, `MoveAlongPath`, `AnimationGroup`, `LaggedStart`, `Succession`.

**Positioning**: `.shift(vector)`, `.move_to(point_or_mobject)`, `.next_to(mobject, DIRECTION, buff=...)`, `.align_to(mobject, DIRECTION)`, `.to_edge(DIRECTION)`, `.to_corner(DIRECTION)`, `.arrange(DIRECTION, buff=...)` (on a VGroup). Direction constants: `UP DOWN LEFT RIGHT IN OUT ORIGIN`, plus combos like `UR`, `DL`. The origin is screen-center; `+y` is up, `+x` is right — unlike most 2D graphics libraries.

**Styling**: `.set_fill(COLOR, opacity=...)`, `.set_stroke(color=..., width=...)`, `.set_color(COLOR)`. Built-in color constants: `RED, GREEN, BLUE, YELLOW, PINK, ORANGE, PURPLE, WHITE, BLACK, GRAY`, each with `_A`..`_E` shade suffixes (e.g. `BLUE_E` is darkest). Custom colors: `"#FF0000"` or `ManimColor("#FF0000")`.

**The `.animate` syntax**: prepend `.animate` to any mutating method call to turn it into a `self.play`-able animation: `self.play(square.animate.shift(UP).set_color(RED))`. Caveat: `.animate` interpolates start-state to end-state, so a 180° `.animate.rotate(PI)` looks like nothing happened (start and end states are identical) — use the `Rotate` animation instead when the *path* matters, not just the endpoint.

**Default look**: black background, no axes/grid, 1920x1080@60fps at `-qh`. Change the background with `self.camera.background_color = WHITE` (in `construct`) or `config.background_color = WHITE` (module level).

## Common pitfalls (check these before debugging further)

- **Nothing renders / blank video**: the mobject was created but never `self.add()`-ed or `self.play()`-ed, or the scene has no `self.wait()` at the end and the final frame duration is zero.
- **"No Scene class found" / wrong scene renders**: the class name passed on the CLI must exactly match a `Scene` subclass in the file. With only one `Scene` subclass in the file, the name can be omitted.
- **`Tex`/`MathTex` fails but `Text` works**: `Tex` and `MathTex` shell out to a real LaTeX installation; `Text` (Pango) does not need LaTeX at all. If the person doesn't need typeset math, `Text` avoids this whole dependency. See `references/text-and-tex.md`.
- **`SyntaxError` / mangled LaTeX in a `Tex(...)` call**: LaTeX source needs backslashes, so it must be a raw string — `Tex(r"\frac{1}{2}")`, not `Tex("\frac{1}{2}")`.
- **Old tutorials/StackOverflow code doesn't run**: ManimCE renamed several classes from the pre-2021 API. See the renamed-API table below and in `references/core-concepts.md`.
- **ManimPango / pycairo build fails on `pip install manim`**: almost always a missing system dependency (Cairo, Pango dev headers) or, on Windows, needing to run from an activated virtual environment. Full OS-specific fixes in `references/installation.md`.
- **Windows: `manim` "is not recognized"**: if Manim was installed via `uv`, either activate the venv or prefix every command with `uv run` — i.e. `uv run manim -pql scene.py Name`.

**Renamed since the old (pre-2021 / 3b1b-style) API** — a frequent source of hallucinated code, since a lot of training data and old tutorials predate these renames:

| Old / ManimGL name | Current ManimCE name |
|---|---|
| `ShowCreation` | `Create` |
| `TextMobject` | `Tex` |
| `TexMobject` | `MathTex` |
| `axes.get_graph(...)` | `axes.plot(...)` |
| `CONFIG = {...}` class dict for defaults | plain `__init__` kwargs / `config.xxx` |

## Where to go deeper

Read the relevant reference file before writing non-trivial code — each covers one area in depth with verified, current syntax and examples:

- **`references/installation.md`** — installing on Windows/macOS/Linux (pip, uv, conda, Docker), installing LaTeX, `manim checkhealth`, and the full troubleshooting list (ManimPango build failures, Anaconda/pycairo conflicts, Windows PATH issues). Read this whenever the person needs to install Manim or hits any install/import error.
- **`references/core-concepts.md`** — Mobject/VMobject/Group mechanics, positioning and styling in depth, the `Scene` lifecycle, writing custom `Animation` subclasses, updaters and `ValueTracker`, `Transform` vs `ReplacementTransform`. Read this for anything beyond the basics above, especially custom animations or continuously-updating mobjects.
- **`references/text-and-tex.md`** — `Text` (Pango) vs `Tex`/`MathTex` (LaTeX) vs `Typst`, fonts, colors/gradients on text, coloring parts of an equation, `TexTemplate` for extra LaTeX packages, `TransformMatchingTex`. Read this for anything involving on-screen text or math typesetting.
- **`references/cli-and-config.md`** — the full `manim` CLI flag reference, quality/resolution table, output folder structure, `--save_sections`, and `manim.cfg` (folder-wide vs user-wide, precedence rules). Read this for rendering options, batch rendering, or config-file questions.
- **`references/cookbook.md`** — plotting functions on `Axes`/`NumberPlane`, camera movement (`MovingCameraScene`, `ThreeDScene`), plugins (voiceover, physics), and a longer troubleshooting list. Read this for graphing, 3D, or camera-motion requests, or when a problem isn't covered by the pitfalls list above.

## Writing style for generated scenes

- Default to `-ql` (`manim -pql file.py SceneName`) while iterating with the person; only suggest `-qh` for a final render, since high quality is much slower.
- Prefer `Text` over `Tex`/`MathTex` unless the content is actual mathematical notation or the person specifically needs LaTeX — it avoids the LaTeX dependency entirely.
- Give each `Scene` subclass a descriptive class name; it's also the CLI argument the person will type.
- End scenes with `self.wait()` (or a longer `self.wait(2)`) so the final frame isn't instantaneous.
- When a request implies several distinct beats (e.g. "show a circle, then turn it into a square, then explain it"), consider `self.next_section()` breaks so the person can re-render just the part that changed — see `references/cli-and-config.md`.
