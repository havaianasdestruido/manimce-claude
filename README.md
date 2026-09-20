# manimce-claude

## Star History

<a href="https://www.star-history.com/?repos=havaianasdestruido%2Fmanimce-claude&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=havaianasdestruido/manimce-claude&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=havaianasdestruido/manimce-claude&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=havaianasdestruido/manimce-claude&type=date&legend=top-left" />
 </picture>
</a>


Skill do Claude (SKILL.md) com referência da Manim Community Edition (ManimCE):
instalação, conceitos centrais, CLI/config, TeX/texto e um cookbook de receitas.

## Instalar

### Opção 1 — Claude Code, via marketplace de plugin (recomendado)

```bash
/plugin marketplace add havaianasdestruido/manimce-claude
/plugin install manim-community-plugin@manimce-claude
```

Depois de instalado, o Claude usa a skill automaticamente sempre que a
conversa envolver Manim/ManimCE. Se aparecer "Run /reload-plugins to
activate.", rode esse comando.

### Opção 2 — `npx skills add` (Claude Code, Cursor, OpenCode, etc.)

```bash
npx skills add havaianasdestruido/manimce-claude --skill manim-community
```

Uma instalação com êxito se pareceria com isso:

```
PS C:\Users\mcmco\manimce-claude> npx skills add havaianasdestruido/manimce-claude --skill manim-community
npm notice run npx
npm notice run skills add havaianasdestruido/manimce-claude --skill manim-community

███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝

┌   skills
│
◇  Source: https://github.com/havaianasdestruido/manimce-claude.git
│
◇  Repository cloned
│
◇  Found 1 skill
│
●  Selected 1 skill: manim-community
│
◇  79 agents
◇  Which agents do you want to install to?
│  Amp, Cline, Codex, Cursor, Droid, Gemini CLI, GitHub Copilot, Kilo Code, Kimi Code CLI, OpenCode, Warp, Zed, AiderDesk, AstrBot, Autohand Code CLI, Augment, IBM Bob, Claude Code, OpenClaw, CodeArts Agent, CodeBuddy, Codemaker, Code Studio, Command Code, Continue, Cortex Code, Crush, Devin for Terminal, ForgeCode, Goose, Grok Build, Hermes Agent, inference.sh, Jazz, Junie, iFlow CLI, Kimchi, Kiro CLI, Kode, Lingma, MCPJam, MiniMax Code, Mistral Vibe, Moxby, Mux, OpenHands, Ona, Pi, Posit Assistant, Qoder, Qoder CN, Qwen Code, Reasonix, Rovo Dev, Roo Code, Tabnine CLI, Terramind, Tinycloud, Trae, Trae CN, Windsurf, ZCode, Zencoder, Zenflow, Neovate, Pochi, AdaL
│
◇  Installation scope
│  Global
│
◇  Installation method
│  Symlink (Recommended)

│
◇  Installation Summary ─────────────────────────────────────────╮
│                                                                │
│  ~\.agents\skills\manim-community                              │
│    universal: Amp, Cline, Codex, Cursor, Droid +7 more         │
│    symlink → AdaL, Pochi, Neovate, Zenflow, Zencoder +50 more  │
│                                                                │
├────────────────────────────────────────────────────────────────╯
│
◇  Proceed with installation?
│  Yes
│
◇  Installation complete

│
◇  Installed 1 skill ─────────────────────────────────────────────╮
│                                                                 │
│  ✓ ~\.agents\skills\manim-community                             │
│    universal: Amp, Cline, Codex, Cursor, Droid +7 more          │
│    symlinked: AdaL, Pochi, Neovate, Zenflow, Zencoder +50 more  │
│                                                                 │
├─────────────────────────────────────────────────────────────────╯

│
└  Done!  Review skills before use; they run with full agent permissions.

PS C:\Users\mcmco\manimce-claude>
```

### Opção 3 — Manual, em qualquer ferramenta Claude

Copie a pasta da skill para o diretório de skills:

```bash
cp -r plugins/manim-community-plugin/skills/manim-community ~/.claude/skills/
# ou, no escopo do projeto:
cp -r plugins/manim-community-plugin/skills/manim-community .claude/skills/
```

### Opção 4 — Upload manual em claude.ai

1. Compacte a pasta `plugins/manim-community-plugin/skills/manim-community/`
   em um `.zip` (o `SKILL.md` deve ficar na raiz do zip ou dentro de uma
   única pasta de nível superior).
2. Em claude.ai: **Settings → Capabilities → Skills → Upload skill**.

## Estrutura

```
.
├── .claude-plugin/
│   └── marketplace.json        # catálogo do marketplace (name, owner, plugins)
└── plugins/
    └── manim-community-plugin/
        ├── .claude-plugin/
        │   └── plugin.json     # manifesto do plugin
        └── skills/
            └── manim-community/
                ├── SKILL.md
                └── references/
                    ├── installation.md
                    ├── core-concepts.md
                    ├── cli-and-config.md
                    ├── text-and-tex.md
                    └── cookbook.md
```

## Validar antes de publicar

```bash
claude plugin validate .
```
