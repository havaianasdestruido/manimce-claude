# Core concepts: Mobject, Animation, Scene

## Scene

Everything happens inside `construct()` of a class inheriting `Scene`:

```python
class MyScene(Scene):
    def construct(self):
        ...  # all mobject creation, layout, and self.play() calls go here
```

Core `Scene` methods:
- `self.add(*mobjects)` — puts mobjects on screen instantly, no animation.
- `self.remove(*mobjects)` — takes them off screen instantly.
- `self.play(*animations, run_time=1)` — runs animation(s), simultaneously if more than one is passed.
- `self.wait(seconds=1)` — pause with nothing changing. Always end a scene with at least one `self.wait()`, or the last frame has zero duration.
- A single file can contain multiple `Scene` subclasses; pass the class name on the CLI to pick one, or `-a` to render all of them.

## Mobject and VMobject

`Mobject` is the abstract base of everything on screen. In practice you almost always work with `VMobject` ("vectorized mobject") subclasses — shapes drawn from Bézier curves: `Circle`, `Square`, `Line`, `Text`, `Tex`, `Axes`, and so on are all `VMobject`s. The plain `Mobject` class itself renders nothing.

**Creating and removing:**
```python
circle = Circle()
self.add(circle)        # shows it
self.remove(circle)     # hides it (no animation either way)
```

**Positioning** (mobjects start at the origin, i.e. screen-center):
- `.shift(vector)` — relative move, e.g. `.shift(LEFT)` or `.shift(2 * UP)`.
- `.move_to(point_or_mobject)` — absolute move to a point, or to another mobject's center.
- `.next_to(mobject, DIRECTION, buff=0.5)` — position relative to another mobject with a gap.
- `.align_to(mobject, DIRECTION)` — align one edge to another mobject's corresponding edge (`DIRECTION` picks which edge, e.g. `LEFT` aligns left edges).
- `.to_edge(DIRECTION, buff=...)` / `.to_corner(DIRECTION, buff=...)` — snap to the edge/corner of the frame.
- `VGroup(...).arrange(DIRECTION, buff=...)` — lay out a group's members in a row/column.

Direction constants: `UP, DOWN, LEFT, RIGHT, IN, OUT, ORIGIN`, and diagonal combinations `UL, UR, DL, DR`. `+y` is up and `+x` is right (unlike screen/pixel coordinate systems); `ORIGIN` is the center of the frame, not a corner.

Methods that mutate a mobject typically `return self`, so calls chain:
```python
square = Square().shift(LEFT).set_color(BLUE)
```

**Styling** (only `VMobject`s have fill/stroke; a bare `Mobject` only has `set_color()`):
- `.set_fill(COLOR, opacity=1.0)` — interior color. Opacity `0.0` (default for most shapes) is fully transparent, so opacity must be set explicitly to see a fill.
- `.set_stroke(color=COLOR, width=4)` — outline/border.
- `.set_color(COLOR)` — sets both, or the only color a non-VMobject has.

**On-screen order (z-order)**: whatever is added/passed to `self.add()`/`self.play()` *last* is drawn on top. `self.add(circle, square, triangle)` draws `triangle` on top of `square` on top of `circle`.

**Groups**: `VGroup(mob1, mob2, ...)` bundles VMobjects so you can move/style/animate them together; `Group(...)` is the equivalent for mixed mobject types (e.g. mixing in an `ImageMobject`); `VDict({"key": mob, ...})` is a dict-like group addressable by key.

**Coordinates on a mobject**: `.get_center()`, `.get_top()`, `.get_bottom()`, `.get_left()`, `.get_right()`, `.get_corner(UR)`, `.get_start()`/`.get_end()` (for lines/arrows), `.point_from_proportion(0.5)` (a point partway along the mobject's path). The debugging helper `index_labels(mobject)` (from `manim.utils.debug`) overlays the index of every submobject — invaluable for figuring out which `tex[i]` or `text[i]` slice to color.

## Animation and self.play()

An `Animation` interpolates a mobject from a start state to an end state over `run_time` seconds (default 1s), sampled once per frame according to a `rate_func` (default eases in and out; `linear` for constant speed).

```python
self.play(FadeIn(square))
self.play(Rotate(square, PI / 4))
self.play(FadeOut(square))
```

**The `.animate` syntax** turns *any* mutating method call into an animation by prefixing it with `.animate`:
```python
self.play(square.animate.set_fill(WHITE))
self.play(square.animate.shift(UP).rotate(PI / 3))   # chainable, runs together
```
Caveat: `.animate` only knows the mobject's start and end *state* — it interpolates points, not the literal operation. A `.animate.rotate(PI)` (180°) looks visually identical to doing nothing, because the start and end shapes are indistinguishable, and the interpolation takes a shortcut path rather than actually spinning. When the visual path of the motion matters (a full rotation, a specific arc), use the dedicated `Rotate`/`MoveAlongPath`-style animation instead of `.animate`.

**`Transform` vs `ReplacementTransform`**: `Transform(mob1, mob2)` morphs `mob1`'s points/style into `mob2`'s, but the object remaining on scene is still (a mutated) `mob1` — `mob2` itself is never added. `ReplacementTransform(mob1, mob2)` actually swaps `mob1` out for `mob2` in the scene. They look identical for a single transform; `Transform` is more convenient when chaining several transforms onto the same object one after another (no need to track "the most recent mobject"), since you keep calling `Transform(a, next_shape)` against the same `a`.

**Common animations by purpose**:
- Appear/disappear: `Create`/`Uncreate` (draws the outline progressively), `Write`/`Unwrite` (for text/tex, looks handwritten), `FadeIn`/`FadeOut`, `DrawBorderThenFill`.
- Change into something else: `Transform`, `ReplacementTransform`, `TransformFromCopy`, `FadeTransform`, `TransformMatchingShapes`, `TransformMatchingTex` (matches sub-parts of two `Tex`/`MathTex` mobjects so shared pieces morph in place instead of cross-fading — see `references/text-and-tex.md`).
- Motion: `Rotate`/`Rotating`, `MoveAlongPath`, `GrowFromCenter`/`GrowFromEdge`/`GrowFromPoint`/`GrowArrow`.
- Emphasis: `Indicate`, `Circumscribe`, `Flash`, `Wiggle`, `FocusOn`, `ApplyWave`.
- Composition: `AnimationGroup(*anims)` (play together), `Succession(*anims)` (play in sequence, one `self.play` call), `LaggedStart(*anims, lag_ratio=0.2)` (staggered start times).

## Custom animations

Subclass `Animation`, pass the target mobject to `super().__init__()`, and override `interpolate_mobject(self, alpha)`. `alpha` runs from `0` (start) to `1` (end) across the animation's `run_time`, already passed through the current `rate_func` inside `self.play`'s machinery — if you want your custom animation to respect a `rate_func` argument, apply `self.rate_func(alpha)` yourself inside `interpolate_mobject` before using it.

```python
class Count(Animation):
    def __init__(self, number: DecimalNumber, start: float, end: float, **kwargs):
        super().__init__(number, **kwargs)
        self.start = start
        self.end = end

    def interpolate_mobject(self, alpha: float) -> None:
        value = self.start + (self.rate_func(alpha) * (self.end - self.start))
        self.mobject.set_value(value)

# usage: self.play(Count(number_mobject, 0, 100), run_time=4, rate_func=linear)
```

## Updaters and ValueTracker

An updater is a function attached to a mobject that re-runs every frame, useful for making one mobject continuously track another (a label that follows a moving dot, an arrow that always points between two objects):

```python
label.add_updater(lambda m: m.next_to(dot, UP))
self.play(dot.animate.shift(RIGHT * 3))   # label follows automatically
label.clear_updaters()                     # detach when no longer needed
```

`ValueTracker` is a mobject-free "just a number" container commonly driven by an animation and read by other mobjects' updaters — the standard pattern for animating a quantity that several things depend on (e.g. a slider driving both a dot's position and a displayed decimal value):

```python
tracker = ValueTracker(0)
dot.add_updater(lambda m: m.move_to(axes.c2p(tracker.get_value(), 0)))
self.play(tracker.animate.set_value(5), run_time=3)
```

`DecimalNumber`/`Integer`/`Variable` mobjects (in `manim.mobject.text.numbers`) are the usual way to display a `ValueTracker`-driven number on screen.

## Renamed since the pre-2021 / ManimGL-style API

If the person supplies old code, or you're tempted to reach for a name that "feels right" from older training data, double-check against this table — these are the most common hallucination traps:

| Old / other-version name | Current ManimCE |
|---|---|
| `ShowCreation` | `Create` |
| `TextMobject` | `Tex` |
| `TexMobject` | `MathTex` |
| `axes.get_graph(fn)` | `axes.plot(fn)` |
| class-level `CONFIG = {...}` dict for defaults | ordinary `__init__` keyword arguments |
