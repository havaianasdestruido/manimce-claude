---
title: Install the skill
sidebar_position: 2
---

Choose the installation path for your agent host. The skill's directory must retain `SKILL.md` beside its `references/` directory.

## Skills CLI (recommended for compatible agents)

```bash
npx skills add havaianasdestruido/manimce-claude --skill manim-community
```

The installer discovers the `manim-community` skill and lets you select supported coding agents and installation scope.

## Claude Code marketplace

```text
/plugin marketplace add havaianasdestruido/manimce-claude
/plugin install manim-community-plugin@manimce-claude
```

Run `/reload-plugins` if Claude Code asks you to activate the newly installed plugin.

## Manual installation

Clone or download this repository, then copy `SKILL.md` and `references/` together into your host's skill folder. For Claude Code that can be either the user-level `~/.claude/skills/manim-community/` directory or a project-level `.claude/skills/manim-community/` directory.

```bash
mkdir -p ~/.claude/skills/manim-community
cp SKILL.md ~/.claude/skills/manim-community/
cp -R references ~/.claude/skills/manim-community/
```

## Claude.ai upload

Create a ZIP in which `SKILL.md` and `references/` are at the archive root (or inside one top-level folder), then use **Settings → Capabilities → Skills → Upload skill**.

## Verify

Ask the agent to create a ManimCE `Scene` that draws a circle. A correctly loaded skill should use `from manim import *`, `Create(circle)`, and a command such as `manim -pql scene.py SceneName`.
