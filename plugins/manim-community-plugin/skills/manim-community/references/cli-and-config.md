# CLI usage and configuration

## Basic invocation

```
manim [OPTIONS] FILE [SCENE_NAMES]...
```

(`manim render ...` is equivalent — `render` is the default subcommand when none is given.) Example:

```
manim -qm file.py SceneOne
```

If `FILE` contains only one `Scene` subclass, the scene name can be omitted entirely.

## Quality / resolution flags

| Flag | Resolution | Frame rate | Use for |
|---|---|---|---|
| `-ql` | 854x480 | 15 fps | Fast iteration / drafts |
| `-qm` | 1280x720 | 30 fps | Mid-quality checks |
| `-qh` | 1920x1080 | 60 fps | Default "final" quality |
| `-qp` | 2560x1440 | 60 fps | 2K |
| `-qk` | 3840x2160 | 60 fps | 4K |

`-r W,H` sets a custom resolution instead, for aspect ratios other than 16:9. `--fps <n>` (or `--frame_rate`) overrides the frame rate independently.

## Other frequently-used flags

- `-p` — preview: play the video (or, on the OpenGL renderer, live-preview in a window) once rendering finishes. Does not change the `config` object, purely a CLI convenience.
- `-f` — open the containing folder in the system file browser instead of playing the file.
- `-s` — render and save only the last frame, as a PNG. Fastest way to preview static layout without waiting for a full animation render. Combine with a quality flag: `-sqh`.
- `-a` — render every `Scene` subclass found in the file (instead of requiring one on the command line).
- `-n START,END` (`--from_animation_number`) — render only animations `START` through `END` (`self.play()` calls are numbered in order); leave `END` off to render from `START` to the end. Useful for re-rendering just the part of a scene that changed.
- `-o NAME` (`--output_file`) — set the output filename.
- `--format {png,gif,mp4,webm,mov}` — output format; default is `mp4`.
- `-c COLOR` (`--background_color`) — e.g. `-c WHITE`.
- `-t` (`--transparent`) — render with an alpha channel (PNG sequence or a format that supports it) instead of a solid background.
- `--renderer {cairo,opengl}` — pick the renderer; `cairo` (default) is the standard 2D software renderer, `opengl` enables live preview windows and is generally used for 3D or performance-sensitive scenes.
- `--disable_caching` — skip the partial-movie-file cache (each `self.play()` call is normally cached separately so re-renders after a small edit are fast); useful when the cache itself seems to be causing stale output.
- `--dry_run` — render without writing any image/video files, for quickly checking the scene runs without errors.
- `--seed N` — fix the random seed for reproducible output when a scene uses randomness.

Full flag list (`manim render --help`) covers additional rarely-needed options (GUI mode, wireframe debugging, section saving, parallel encoding tuning, etc.) — fetch the live `--help` output or the configuration guide on docs.manim.community if one of those is specifically needed.

## Output folder structure

Rendering `manim -pql scene.py SquareToCircle` from a `project/` folder produces:

```
project/
├─ scene.py
└─ media/
   ├─ videos/
   │  └─ scene/                 # named after the .py file
   │     └─ 480p15/              # named after resolution+fps used
   │        ├─ SquareToCircle.mp4
   │        └─ partial_movie_files/   # internal per-animation cache
   ├─ text/                      # internal
   └─ Tex/                       # internal — LaTeX intermediate files land here;
                                  # check this folder's .log files when a Tex()/MathTex()
                                  # call fails to compile
```

Rendering the same scene again at a different quality (e.g. `-qh`) adds a sibling folder (`1080p60/`) rather than overwriting — handy when comparing quality levels, but can silently accumulate a lot of old renders in `media/videos/.../partial_movie_files/`.

Adding `-s` additionally creates `media/images/scene/SquareToCircle.png`.

## Sections

Sections let one scene produce multiple separate output clips (e.g. for a presentation tool, or so an editor can re-cut only the part that changed) without splitting the code into multiple `Scene` classes:

```python
def construct(self):
    # first section is implicit, no need to call next_section() before the first animation
    self.play(Create(circle))
    self.next_section("transform")     # name is optional and doesn't need to be unique
    self.play(Transform(circle, square))
    self.next_section("fade")
    self.play(FadeOut(square))
```

Every section needs at least one animation in it, or it's silently dropped (a section with only `self.add()` calls and no `self.play()`/`self.wait()` produces no video and no error — add a bare `self.wait()` if a section is meant to hold a static frame).

Render with `--save_sections` to actually get one file per section, under `media/videos/.../sections/`, alongside a JSON manifest describing each clip's name, codec, dimensions, and frame count — useful for feeding into external video-editing automation.

`self.next_section(skip_animations=True)` skips rendering everything in that section (e.g. to jump straight to reviewing a later part of a long scene while iterating).

## manim.cfg config files

A `manim.cfg` file lets the person avoid re-typing the same CLI flags on every render. Must be named exactly `manim.cfg`, must start with a `[CLI]` header, and uses the **long name** of each flag (not the short letter) as the key:

```ini
[CLI]
output_file = myscene
background_color = WHITE
quality = high_quality
```

Manim looks for `manim.cfg` in the same folder as the file being rendered (not the current working directory it's invoked from), so different projects/scenes can each carry their own settings.

There's also a **user-wide** config file applying to every render regardless of folder:
- Windows: `%USERPROFILE%\AppData\Roaming\Manim\manim.cfg`
- macOS/Linux: `~/.config/manim/manim.cfg`

**Precedence, lowest to highest**: library-wide defaults → user-wide `manim.cfg` → folder-wide `manim.cfg` (or a file passed via `--config_file`) → other CLI flags → any programmatic change to `config` inside the script itself. A folder-wide file overrides a conflicting user-wide setting; an explicit CLI flag overrides both.

## Programmatic configuration

The global `config` object (an instance of `ManimConfig`) is the single source of truth everything else ultimately writes into — CLI flags and `.cfg` files are just alternate ways of setting its attributes:

```python
from manim import *
config.background_color = WHITE
config.frame_rate = 30
```

It's internally consistent — e.g. setting `config.frame_y_radius` automatically updates the derived `config.frame_height`. Reading `config["pixel_width"]`, `config["frame_width"]`, etc. inside a scene is the standard way to build layouts that adapt to whatever resolution is actually being rendered at, rather than hardcoding `1920`/`1080`.

## Other useful subcommands

- `manim init project my-project --default` — scaffolds a new project folder with a starter scene file.
- `manim checkhealth` — diagnoses the local install (LaTeX, ffmpeg, Cairo, etc.); run this first for any install-flavored error rather than guessing.
- `manim cfg write` / `manim cfg show` / `manim cfg export` — create/inspect/export a `manim.cfg`.
- `manim plugins -l` — list installed plugins (see `references/cookbook.md` for the plugin ecosystem).
