# manimce-claude

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
