# Cookbook: graphing, camera work, 3D, plugins

## Plotting functions and coordinate systems

`Axes` (2D), `NumberPlane` (2D grid), `PolarPlane`, `ComplexPlane`, and `ThreeDAxes` (3D) are all `CoordinateSystem`s sharing the same plotting API.

```python
class PlotExample(Scene):
    def construct(self):
        axes = Axes(
            x_range=[0, 10, 1],      # [min, max, step]
            y_range=[-2, 6, 1],
            axis_config={"include_numbers": True},
        )
        graph = axes.plot(lambda x: x ** 2, x_range=[0, 3], color=YELLOW)
        labels = axes.get_axis_labels(x_label="x", y_label="y")
        self.play(Create(axes), Create(labels))
        self.play(Create(graph))
```

Key methods (all on `Axes`/`NumberPlane`/etc.):
- `.plot(function, x_range=[...], color=...)` — the current name; **older tutorials call this `get_graph`**, which no longer exists in ManimCE.
- `.coords_to_point(x, y)` (alias `.c2p(x, y)`, or `axes @ (x, y, 0)`) — converts axes-space coordinates to actual screen-space points, needed whenever you place a `Dot`/label at a specific data coordinate: `Dot(axes.c2p(2, 4))`.
- `.point_to_coords(point)` (alias `.p2c`) — the inverse.
- `.get_axis_labels(x_label=..., y_label=...)` — labels the axes; pass `Tex`/`Text` mobjects directly for full control, or a string (wrapped in `MathTex` automatically).
- `.add_coordinates()` — adds tick-value labels to the axes.
- `.plot_line_graph(x_values=[...], y_values=[...], line_color=..., add_vertex_dots=True)` — connects a discrete list of (x, y) points, useful for plotting real data rather than a continuous function.
- `ImplicitFunction`, `ParametricFunction` (in `manim.mobject.graphing.functions`) — for `f(x, y) = 0` curves and parametric `t -> (x(t), y(t))` curves respectively, when a simple `y = f(x)` plot isn't the right shape.

`BarChart` (in `manim.mobject.graphing.probability`) handles bar charts directly without needing to hand-build `Rectangle`s.

## Camera movement (pan / zoom)

Inherit `MovingCameraScene` instead of `Scene` to get a `self.camera.frame` that is itself an animatable mobject:

```python
class ZoomExample(MovingCameraScene):
    def construct(self):
        circle = Circle().shift(LEFT * 3)
        square = Square().shift(RIGHT * 3)
        self.add(circle, square)

        # zoom in on the circle
        self.play(self.camera.frame.animate.scale(0.4).move_to(circle))
        self.wait()
        # pan over to the square without changing zoom
        self.play(self.camera.frame.animate.move_to(square))
        # zoom back out
        self.play(self.camera.frame.animate.scale(2.5).move_to(ORIGIN))
```

`.scale(factor)` on the frame zooms (factor `< 1` zooms in, `> 1` zooms out); `.move_to(...)` pans. Because it's ordinary `.animate` syntax, both can be chained/combined with any other frame method.

## 3D scenes

Inherit `ThreeDScene` for camera orientation controls and 3D-aware defaults:

```python
class ThreeDExample(ThreeDScene):
    def construct(self):
        axes = ThreeDAxes()
        surface = Surface(
            lambda u, v: axes.c2p(u, v, np.sin(u) * np.cos(v)),
            u_range=[-3, 3], v_range=[-3, 3],
        )
        self.set_camera_orientation(phi=70 * DEGREES, theta=30 * DEGREES)
        self.add(axes)
        self.play(Create(surface))
        self.begin_ambient_camera_rotation(rate=0.15)   # slow continuous orbit
        self.wait(4)
        self.stop_ambient_camera_rotation()
```

`phi` is the angle down from the top (0 = looking straight down the z-axis), `theta` is rotation around the z-axis. `self.move_camera(phi=..., theta=..., run_time=...)` animates to a new orientation instead of cutting instantly. 3D shape primitives live in `manim.mobject.three_d.three_dimensions`: `Sphere`, `Cube`, `Cone`, `Cylinder`, `Torus`, `Prism`, `Line3D`, `Arrow3D`, `Dot3D`.

## Adding voiceover / narration

The official `manim-voiceover` plugin (`pip install "manim-voiceover[azure,gtts]"`) syncs animation timing to narration — either your own recorded audio or a text-to-speech service — without needing a separate video editor pass:

```python
from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.recorder import RecorderService
# or e.g. from manim_voiceover.services.gtts import GTTSService

class Narrated(VoiceoverScene):
    def construct(self):
        self.set_speech_service(RecorderService())  # or GTTSService(), AzureService(), ...
        circle = Circle()
        with self.voiceover(text="This circle is drawn as I speak.") as tracker:
            self.play(Create(circle), run_time=tracker.duration)
```

`tracker.duration` is the actual length of the (recorded or generated) audio clip, so `run_time` automatically matches the narration instead of being guessed by hand. Animations inside one `with self.voiceover(...)` block play while that line is spoken; the next block waits for the previous audio to finish.

## Other plugins

Plugins are separate PyPI packages (conventionally named `manim-*`) that extend Manim without bloating the core library — installed with plain `pip install manim-<name>` and then either imported directly or enabled via `manim.cfg` (`plugins = manim_something`) or `manim plugins -l` to list what's installed. Beyond `manim-voiceover`, well-known ones include physics simulations, presentation/slideshow tooling, and extra mobject collections — check <https://plugins.manim.community> for the current list rather than assuming a specific one exists, since the ecosystem changes independently of Manim itself.

## Troubleshooting beyond the SKILL.md basics

- **A `Tex`/`MathTex` mobject fails to compile**: the LaTeX error is usually in the terminal output, but the full log is also saved under `media/Tex/*.log` in the project folder (see `references/cli-and-config.md` for the folder layout) — worth reading directly when the terminal output is truncated or unclear.
- **Colors look wrong / washed out**: Manim's named color constants (`RED`, `BLUE`, etc.) are ManimColor objects, not raw hex strings — mixing `"#FF0000"` and `RED` is fine, but don't expect them to be identical values; use `ManimColor("#RRGGBB")` for a specific custom color and compare against that rather than assuming a named constant matches a designer's hex value exactly.
- **A `.animate` call does nothing visually**: see the `.animate` interpolation caveat in `references/core-concepts.md` — this is overwhelmingly the cause when a rotation, flip, or other symmetric transform "doesn't play."
- **Rendering is slow**: use `-ql` while iterating (see `references/cli-and-config.md`); also, LaTeX compilation and caching mean the *first* render of a scene with `Tex`/`MathTex` is much slower than subsequent ones (the compiled result is cached under `media/Tex/`) — don't assume a slow first run reflects steady-state performance.
- **Want a still image, not a video**: `-s` renders only the last frame as a PNG — much faster than a full render when the person just wants to check layout/composition.
- **Scene works with the `cairo` renderer but not `opengl` (or vice versa)**: some mobject/animation behavior differs subtly between renderers (this is also why plugin authors sometimes need renderer-compatibility code, see the Plugins section of the official docs). Default to `cairo` (the default) unless the person specifically wants a live interactive preview window or is doing performance-sensitive 3D work.
