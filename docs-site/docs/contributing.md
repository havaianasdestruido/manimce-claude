---
title: Contributing
---

Contributions that correct version drift, improve troubleshooting, or add tested recipes are welcome.

## Workflow

1. Create a focused branch and make the smallest coherent change.
2. Verify commands and examples against the ManimCE version stated in `SKILL.md`.
3. Update both the canonical knowledge file and its Docusaurus counterpart when content overlaps.
4. Run the documentation build: `cd docs-site && npm ci && npm run build`.
5. Validate the Claude plugin with `claude plugin validate .` when that CLI is available.
6. Open a pull request explaining the user problem, expected behavior, and validation performed.

## Writing conventions

Use current ManimCE names and explicitly label APIs from ManimGL or old ManimCairo. Prefer runnable examples with imports and render commands. Keep examples narrow enough to teach one concept. Use relative links for repository files and stable official links for upstream Manim behavior.

## Reporting issues

Include the operating system, Python and Manim versions, installation method, render command, minimal scene, and complete traceback. Never include credentials or private project content.
