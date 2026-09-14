# Rendering text and formulas

Manim has three independent ways to put text on screen. Picking the right one matters — `Tex`/`MathTex` pull in a whole LaTeX installation as a dependency; `Text` does not.

| Class | Engine | Needs LaTeX installed? | Use for |
|---|---|---|---|
| `Text`, `MarkupText`, `Paragraph` | Pango | No | Plain prose, labels, titles, any non-English script |
| `Tex`, `MathTex` | LaTeX | **Yes** | Actual math notation, or content that specifically needs LaTeX macros |
| `Typst`, `MathTypst` | Typst compiler | No (needs `pip install manim[typst]`) | Math/markup typesetting without a TeX distribution |

Default to `Text` unless the content is genuinely mathematical — it sidesteps the entire LaTeX dependency and its install headaches (see `references/installation.md`).

## Text (no LaTeX required)

```python
text = Text("Hello world", font_size=144)
```

`Text` supports non-Latin scripts natively (你好, こんにちは, مرحبا بالعالم, etc.) since Pango handles the shaping.

Common kwargs:
- `font="Noto Sans"` — must be installed system-wide and known to Pango; list available fonts with `manimpango.list_fonts()`.
- `slant=ITALIC` / `slant=OBLIQUE`, `weight=BOLD` (see `manimpango.Weight` for the full weight list).
- `color=RED` — solid color for the whole string.
- `gradient=(RED, BLUE, GREEN)` — gradient across the string.
- `t2c={"substring_or_[slice]": COLOR}` — color specific characters or a slice, e.g. `Text("Hello", t2c={"[1:-1]": BLUE})` or `t2c={"World": RED}`.
- `t2g={...}` — same idea, but assigns a gradient tuple per key instead of a single color.
- `line_spacing=1.5` — spacing between lines (`\n`-separated).
- `disable_ligatures=True` — forces a strict one-to-one mapping between characters and submobjects, needed if you plan to iterate/index/color individual letters and the font's ligatures (e.g. "fl" → a single glyph) would otherwise merge two characters into one submobject. Don't use this for scripts that depend on ligatures for correctness (e.g. Arabic).

`Text` objects behave like a `VGroup` of characters, so `for letter in text: letter.set_color(...)` and `text[2:5]` both work (subject to the ligature caveat above).

`MarkupText` is the same engine but interprets PangoMarkup (HTML-like) instead of plain text:
```python
MarkupText('all in red <span fgcolor="#FFFF00">except this</span>', color=RED)
```

## Tex and MathTex (LaTeX)

Both compile real LaTeX and require a working LaTeX installation on the machine (see `references/installation.md`). **Always use raw strings** (`r"..."`) since LaTeX source is full of backslashes that Python would otherwise try to interpret as escape sequences.

- `Tex(r"\LaTeX")` — general LaTeX text/markup.
- `MathTex(r"\xrightarrow{x^6y^8}")` — everything is implicitly wrapped in an `align*` math environment. To get the same math-mode effect inside a `Tex(...)` call, wrap the formula in `$...$`.

```python
tex = Tex(r"Hello \LaTeX", color=BLUE, font_size=144)
equation = MathTex(r"e^{i\pi} + 1 = 0", font_size=96)
```

Multi-line formulas can use LaTeX's `&` alignment character, since `MathTex` runs inside `align*`:
```python
MathTex(r"f(x) &= 3 + 2 + 1\\ &= 5 + 1 \\ &= 6")
```

**Extra LaTeX packages**: if a command needs a package not in Manim's default template (e.g. `\mathscr` needs `mathrsfs`), build a custom `TexTemplate`:
```python
my_template = TexTemplate()
my_template.add_to_preamble(r"\usepackage{mathrsfs}")
Tex(r"$\mathscr{H}$", tex_template=my_template)
```

**Custom math fonts**: pass `tex_template=TexFontTemplates.french_cursive` (or another entry from `TexFontTemplates`) to `Tex`/`MathTex`. `TexTemplateLibrary` additionally has the specific templates 3Blue1Brown's videos use, including a `ctex` template for Chinese script — but if you're only typesetting plain (non-math) text, reach for `Text` instead of `Tex` + `ctex`.

### Coloring / isolating parts of a formula

Three ways, roughly in order of how much control they give:

1. **Multiple string arguments**: `Tex('Hello', r'$\bigstar$', r'\LaTeX')` creates three sub-mobjects addressable by index (`tex[1]`) or via `tex.set_color_by_tex(r'$\bigstar$', RED)` (exact string match against one of the original arguments).
2. **`substrings_to_isolate`**: splits every occurrence of a substring into its own sub-mobject first, so `set_color_by_tex` can then match it even mid-formula: `MathTex(r"e^{x} = x^0 + x^1 + \cdots", substrings_to_isolate="x").set_color_by_tex("x", YELLOW)` colors every `x`.
3. **`{{ }}` double-brace syntax**: `MathTex(r"{{ a^2 }} + {{ b^2 }} = {{ c^2 }}")` splits at each `{{ ... }}` into its own addressable part — the cleanest way to set up a formula for `TransformMatchingTex` (below). A `{{` only counts as a splitter at the very start of the string or right after whitespace; `{{` glued directly onto other LaTeX (e.g. `\frac{{{n}}}{k}`) is left alone, so ordinary nested braces aren't accidentally split.

When something is too fiddly to isolate by eye, add `self.add(index_labels(tex[0]))` (from `manim.utils.debug`) to overlay the index of every submobject, then slice by index (`tex[0][1:3].set_color(...)`).

### Morphing between two formulas: TransformMatchingTex

Set both formulas up with the `{{ }}` syntax (or matching string-argument boundaries) sharing the parts that should visually persist, then:
```python
self.play(TransformMatchingTex(old_formula, new_formula))
```
Parts with matching source text morph in place; everything else fades/transforms normally. This is the standard pattern for "equation rewrites itself" animations, and far cleaner than manually cross-fading pieces.

## Typst (LaTeX-free math)

Requires the optional dependency: `pip install manim[typst]`.

```python
text = Typst(r"*Hello* from _Typst!_", font_size=96)
equation = MathTypst(r"sum_(k=1)^n k = (n(n + 1)) / 2", font_size=72)
```

`MathTypst` also supports the same `{{ }}` sub-expression syntax as `MathTex` for later `.select("label")`-style coloring, or `.select(0)` by position. Good option when the person wants typeset math but can't/doesn't want to install a full LaTeX distribution.

## Deprecated names to avoid

`TextMobject` and `TexMobject` are the pre-2021 names for what are now `Tex` and `MathTex` respectively — if the person's existing code uses those, it's either very old ManimCE or written for ManimGL; update the class names rather than trying to install an old Manim version to match.
