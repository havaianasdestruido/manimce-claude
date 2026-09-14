# Installing Manim (ManimCE)

## Which version am I installing?

Confirm this is ManimCE before anything else (see SKILL.md's disambiguation table). Package name on PyPI is `manim` (not `manimgl`, not `manimlib`). Once installed, `manim --version` (or the first line of any `manim` command's output) should say `Manim Community v<version>`. If it doesn't, `manimgl` is installed instead.

Why the confusion exists: Manim was Grant Sanderson's (3Blue1Brown) personal project. In 2020 a group of developers forked it into the community-maintained version documented here. In 2021 Grant merged his own experimental OpenGL branch back into his repo as `manimgl`, which continues to diverge with undocumented breaking changes. The pre-2020 version is sometimes called "ManimCairo" and is only useful for re-rendering old 3Blue1Brown videos from source.

You can tell which version a snippet of code targets by its import line:
- `from manim import *` / `import manim as mn` → ManimCE (this skill)
- `import manimlib` / `from manimlib import *` → ManimGL
- `from manimlib.imports import *` or `from big_ol_pile_of_manim_imports import *` → old ManimCairo

## Recommended install: pip + a virtual environment (uv)

Manim's own docs recommend [`uv`](https://docs.astral.sh/uv/) for managing the Python environment, but plain `pip` works fine too if the person already has a workflow they like.

**Install `uv`** (one-time, per machine):

```
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Step 1 — Python**: `uv python install`

**Step 2 — LaTeX (optional but common)**: skip this entirely if the person will only use `Text` (Pango) and never `Tex`/`MathTex`. Otherwise:

- **Windows**: install [MiKTeX](https://miktex.org/download).
- **macOS**: install [MacTeX](https://www.tug.org/mactex/mactex-download.html).
- **Linux**: install a TeX Live distribution via the system package manager, e.g. `sudo apt install texlive-full` (Debian/Ubuntu) or `sudo dnf install texlive-scheme-full` (Fedora).
- For a smaller, custom LaTeX install (e.g. [TinyTeX](https://yihui.org/tinytex/)) instead of a full distribution, Manim needs at least these packages: `amsmath babel-english cbfonts-fd cm-super count1to ctex doublestroke dvisvgm everysel fontspec frcursive fundus-calligra gnu-freefont jknapltx latex-bin mathastext microtype multitoc physics preview prelim2e ragged2e relsize rsfs setspace standalone tipa wasy wasysym xcolor xetex xkeyval`.

**Step 3 — Manim itself**, OS-specific:

Windows:
```
uv init manimations
cd manimations
uv add manim
```

macOS — first install the `cairo`/`pkg-config` system libraries (needed by the `pycairo` dependency), easiest via [Homebrew](https://brew.sh/):
```
brew install cairo pkg-config
uv init manimations
cd manimations
uv add manim
```

Linux — Linux additionally needs to build ManimPango (and sometimes pycairo) from source, so install a C compiler, Python dev headers, `pkg-config`, and the Cairo/Pango dev headers first:
```
# Debian / Ubuntu
sudo apt update
sudo apt install build-essential python3-dev libcairo2-dev libpango1.0-dev
# Fedora
sudo dnf install python3-devel pkg-config cairo-devel pango-devel
# Arch
sudo pacman -Syu base-devel cairo pango
```
Then, same as the other OSes:
```
uv init manimations
cd manimations
uv add manim
```

**Verify**: `uv run manim checkhealth` — this runs Manim's own diagnostic and reports missing dependencies (LaTeX, ffmpeg, etc.) directly, which is more reliable than guessing from a stack trace.

Important: if the environment was set up with `uv init`/`uv add` and never separately activated, every command needs the `uv run` prefix — `uv run manim -pql scene.py SceneName`, not just `manim -pql ...` — or run the `uv venv`-printed activation command first.

### Plain pip (no uv)

Works the same way, just without the project scaffolding: `pip install manim` into whatever virtual environment is already active. Same system-dependency requirements apply per OS above (Cairo/Pango on Linux, Cairo/pkg-config on macOS).

### Global tool install

`uv tool install manim` puts the `manim` executable on the system PATH globally, without needing `uv run` or an activated venv — convenient if the person works on Manim projects in many different folders. Trade-off: code editors won't auto-detect the environment for import resolution as easily; point the editor's Python interpreter at the path from `uv tool dir`.

### A specific Python version

```
uv init --python 3.12 manimations
```
To change an existing project's Python version, edit `requires-python` in `pyproject.toml`, then `uv python pin 3.12` and `uv sync`.

### Latest development (unstable) version

```
uv add git+https://github.com/ManimCommunity/manim.git@main
```

## Other install methods

- **Conda**: good if the person is already a conda user — dependencies like `pycairo` come bundled, so it sidesteps most build issues. Installation steps are identical across Windows/macOS/Linux with conda.
- **Docker**: the community-maintained image is `manimcommunity/manim`. Good for CI or avoiding local dependency hell entirely.
- **Jupyter / no local install**: <https://try.manim.community> is an interactive in-browser notebook — good for letting someone try Manim with zero setup. For local Jupyter use, Manim ships a `%%manim` IPython magic.
- **VS Code**: the third-party "Manim Sideview" extension adds an integrated preview, but is not officially maintained by the Manim team.

## Troubleshooting

**`ManimPango` or `pycairo` fails to build during `pip install manim`**: almost always a missing system dependency — see the OS-specific package lists above. Installing Cython first (`pip install Cython`) resolves it occasionally. On an unusual CPU architecture, no prebuilt wheel may exist and it has to compile from source, which is where these headers get needed.

**Anaconda: `ImportError` about a missing symbol**: Anaconda ships its own `cairo` that conflicts with the `pycairo` version Manim needs. Fix: `conda install -c conda-forge pycairo`.

**Windows: `'manim' is not recognized as an internal or external command`**: either the venv isn't activated (use `uv run manim ...`, or run the activation command `uv venv` printed) or the `PATH` doesn't include Python's Scripts folder. If `python` works, fall back to `python -m manim ...` and `python -m pip ...`.

**Windows: typing `python` opens the Microsoft Store**: Windows' "app execution aliases" are intercepting the command. Settings → Apps → Advanced app settings → App execution aliases → turn off the `python`/`python3` aliases.

**Chocolatey (`choco install manimce`) fails**: re-run as Administrator; if it still fails, Chocolatey prints a `.log` file path worth reading before asking for help.

**`manimpango/cmanimpango.c` not found during install**: your platform has no prebuilt wheel, so pip is building from source and missing a piece. Install `Cython` and retry; if that's not enough, follow the build prerequisites in the ManimPango repo's README.

**Different symptom entirely, or the fix above didn't work**: don't guess further — Manim's own `manim checkhealth` command and the official FAQ (docs.manim.community/en/stable/faq/installation.html) are more reliable than pattern-matching a stack trace, and are worth fetching directly if the person's exact error isn't listed here.
