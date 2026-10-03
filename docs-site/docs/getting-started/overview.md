---
id: overview
title: Overview
slug: /
description: Learn what ManimCE Claude is and when to use it.
---

<div className="hero-banner">

# Manim knowledge for coding agents

**manimce-claude** packages a current, task-oriented Manim Community Edition reference as an installable agent skill. It helps assistants choose the correct API, produce runnable scenes, and diagnose common rendering failures.

</div>

## Why this project exists

“Manim” can mean three incompatible projects. Examples online often mix ManimCE, ManimGL, and the old ManimCairo API. A general-purpose agent can therefore generate plausible-looking code that does not run. This skill establishes a clear default—modern **Manim Community Edition**—and gives the agent targeted references to consult.

The knowledge base covers:

- installation on Windows, macOS, and Linux;
- the `Scene` / `Mobject` / `Animation` mental model;
- rendering through the CLI and `manim.cfg`;
- text, LaTeX, and Typst;
- plotting, cameras, 3D scenes, updaters, and common recipes;
- practical troubleshooting for system dependencies and API migrations.

## Minimal ManimCE scene

```python
from manim import *

class CreateCircle(Scene):
    def construct(self):
        circle = Circle().set_fill(PINK, opacity=0.5)
        self.play(Create(circle))
        self.wait()
```

Render with `manim -pql scene.py CreateCircle`. The `-p` flag previews the output and `-ql` uses fast, low-quality rendering while you iterate.

## Documentation map

- **Getting started** explains how to install and invoke the skill.
- **ManimCE guide** publishes the operational knowledge available to an agent.
- **Codebase** documents every source artifact and the website deployment architecture.
- **Contributing** describes the checks and conventions expected for changes.

:::note Scope
This repository is a reference skill, not the Manim renderer itself. For the Python package API, use the [official Manim documentation](https://docs.manim.community/).
:::
