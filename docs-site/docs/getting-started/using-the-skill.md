---
title: Using the skill
sidebar_position: 3
---

The host activates the skill automatically when a request matches its description. You do not need a special command.

## Requests that should activate it

- “Animate Euler's identity in Manim.”
- “Why does `MathTex` fail while `Text` works?”
- “Move the camera while plotting this function.”
- “Convert this old `ShowCreation` example to current ManimCE.”
- “Which `manim` flags produce a transparent 1080p render?”

## How the knowledge is organized

The top-level `SKILL.md` supplies routing guidance, a compact mental model, common APIs, and high-frequency pitfalls. For deeper tasks it directs the agent to one of five files under `references/`. This layered layout keeps basic answers fast while preserving detailed recipes.

## Good prompting practices

Include your Manim version, operating system, source code, full error output, and render command when debugging. State whether you mean ManimCE or ManimGL if you are not using Community Edition. Mention the desired resolution and output format for production renders.
