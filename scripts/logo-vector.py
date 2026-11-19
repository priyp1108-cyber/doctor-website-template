"""
Redraws the SA Skincure logo as a vector (public/images/logo.svg + emblem.svg).

Why: the only copy available (Google Business Profile) is 250 x 250 px, so any
enlargement is blurry. This rebuilds it:
  * the emblem is traced from the original with colour-aware edge separation;
  * the lettering is re-set in open-licence fonts (Tinos ~ Times, Arimo ~ Arial)
    and placed on the original's measured positions.
It is a faithful redraw, not the designer's master file. If the clinic can
supply the original artwork, use that instead.

Usage (needs: pip install vtracer fonttools numpy pillow):
  python scripts/logo-vector.py <logo-source-250px.png> <fonts-dir>
fonts-dir must hold Tinos-Regular.ttf, Tinos-Bold.ttf and Arimo[wght].ttf
(from github.com/google/fonts). Then run `pnpm logo` to make the PNGs.
"""
import os
import re
import sys
import tempfile

import numpy as np
import vtracer
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image, ImageFilter

SRC, FONTS = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "images")

NAVY = "#26448F"
SKY = "#12A6EC"
GREEN = "#1FA866"

# ---------------------------------------------------------------- emblem trace
src = Image.open(SRC).convert("RGB")
EMBLEM_BOX = (4, 99, 66, 149)  # in the 250 px source
S = 12
crop = src.crop(EMBLEM_BOX)
big = np.array(
    crop.resize((crop.width * S, crop.height * S), Image.LANCZOS).filter(ImageFilter.GaussianBlur(S * 0.45))
).astype(float)
palette = np.array([[24, 170, 236], [50, 120, 210], [40, 85, 170], [192, 194, 198], [50, 175, 105]], float)
white = np.array([255.0, 255.0, 255.0])
best_err = np.full(big.shape[:2], 1e18)
best_i = np.zeros(big.shape[:2], int)
best_t = np.zeros(big.shape[:2])
for i, p in enumerate(palette):
    # Treat each pixel as palette colour p blended over white; keep the best fit.
    d = p - white
    t = np.clip(((big - white) @ d) / (d @ d), 0, 1)
    err = ((big - (white + t[..., None] * d)) ** 2).sum(-1)
    m = err < best_err
    best_err[m], best_i[m], best_t[m] = err[m], i, t[m]
flat = np.where((best_t > 0.5)[..., None], palette[best_i], white).astype(np.uint8)

with tempfile.TemporaryDirectory() as tmp:
    png, svg = os.path.join(tmp, "e.png"), os.path.join(tmp, "e.svg")
    Image.fromarray(flat).save(png)
    vtracer.convert_image_to_svg_py(
        png, svg, colormode="color", hierarchical="stacked", mode="spline",
        filter_speckle=60, color_precision=8, layer_difference=8, corner_threshold=60,
        length_threshold=4.0, splice_threshold=45, path_precision=2,
    )
    traced = open(svg).read()

emblem_paths = []
for m in re.finditer(r'<path d="([^"]+)" fill="(#[0-9A-Fa-f]{6})" transform="translate\(([-\d.]+),([-\d.]+)\)"/>', traced):
    d, fill, tx, ty = m.groups()
    if min(int(fill[i:i + 2], 16) for i in (1, 3, 5)) > 240:
        continue  # background and counters stay transparent
    emblem_paths.append(f'<path d="{d}" fill="{fill}" transform="translate({tx},{ty})"/>')
emblem_group = "\n".join(emblem_paths)

# ---------------------------------------------------------------- lettering
def font(name, wght=None):
    f = TTFont(os.path.join(FONTS, name))
    if wght is not None and "fvar" in f:
        f = instancer.instantiateVariableFont(f, {"wght": wght})
    return f


def glyph_run(f, text, size, x, baseline, tracking=0.0, sx=1.0):
    """Path data for `text`, left ink edge at x, on `baseline` (source px); sx squeezes horizontally."""
    gs, cmap, upm = f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm
    k = size / upm
    pen = SVGPathPen(gs)
    cursor, first_lsb = 0.0, None
    for ch in text:
        g = cmap[ord(ch)]
        if first_lsb is None:
            bp = BoundsPen(gs)
            gs[g].draw(bp)
            first_lsb = bp.bounds[0] if bp.bounds else 0
        gs[g].draw(TransformPen(pen, (k * sx, 0, 0, -k, x + (cursor - first_lsb * k) * sx, baseline)))
        cursor += gs[g].width * k + tracking
    return pen.getCommands()


def bounds(f, text, size, tracking=0.0):
    """(ink width, ink top above baseline) of `text` at `size`."""
    gs, cmap, upm = f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm
    k = size / upm
    cursor, left, right, top = 0.0, None, 0.0, 0.0
    for ch in text:
        bp = BoundsPen(gs)
        gs[cmap[ord(ch)]].draw(bp)
        if bp.bounds:
            x0, _, x1, y1 = bp.bounds
            left = cursor + x0 * k if left is None else left
            right, top = cursor + x1 * k, max(top, y1 * k)
        cursor += gs[cmap[ord(ch)]].width * k + tracking
    return right - left, top


def size_for(f, glyph_text, ink_height):
    _, top = bounds(f, glyph_text, 1000)
    return 1000 * ink_height / top


serif = font("Tinos-Regular.ttf")
serif_bold = font("Tinos-Bold.ttf")
sans = font("Arimo[wght].ttf", wght=600)

# Measurements from the 250 px original (ink at >50% strength).
BASE = 127.8
size = size_for(serif, "k", 127.8 - 103.6)  # ascender height of "k"
nat, _ = bounds(serif, "skincure", size)
track = (241 - 112.5 - nat) / (len("skincure") - 1)
s_w, _ = bounds(serif, "s", size)
a_size = size_for(serif_bold, "A", 127.8 - 106.2)
a_w, _ = bounds(serif_bold, "A", a_size)
word = [
    (serif, "s", size, 68.3, BASE, 0, (80.2 - 68.3) / s_w, NAVY),
    (serif_bold, "A", a_size, 87.6, BASE, 0, (106.4 - 87.6) / a_w, SKY),
    (serif, "skincure", size, 112.5, BASE, track, 1.0, NAVY),
]
TAG_BASE = 144.0
tag_size = size_for(sans, "S", 144.0 - 134.3)
tag_letters = [("S", 68), ("k", 82), ("i", 93), ("n", 101), ("H", 130), ("a", 144), ("i", 156), ("r", 164),
               ("L", 190), ("a", 202), ("s", 214), ("e", 225), ("r", 237)]

parts = []
for f, text, sz, x, base, tr, sx, fill in word:
    parts.append(f'<path d="{glyph_run(f, text, sz, x, base, tr, sx)}" fill="{fill}" stroke="{fill}" stroke-width="0.3" stroke-linejoin="round"/>')
tag_d = " ".join(glyph_run(sans, ch, tag_size, x, TAG_BASE) for ch, x in tag_letters)
parts.append(f'<path d="{tag_d}" fill="{GREEN}"/>')
# Separators and the two dots flanking the apex of the "A".
for x in (118.4, 178.0):
    parts.append(f'<rect x="{x}" y="137" width="1.7" height="7" rx="0.4" fill="{NAVY}"/>')
for x, y in ((83.4, 108.2), (100.6, 107.9)):
    parts.append(f'<rect x="{x}" y="{y}" width="2.9" height="2.9" rx="0.5" fill="{NAVY}"/>')

# ---------------------------------------------------------------- write
ex, ey = EMBLEM_BOX[0], EMBLEM_BOX[1]
emblem_in_logo = f'<g transform="translate({ex},{ey}) scale({1 / S})">{emblem_group}</g>'
vb = "7.5 101.5 236 45"  # tight around the ink, in source px
logo = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="944" height="180" role="img" aria-label="SA Skincure">'
    f"{emblem_in_logo}{''.join(parts)}</svg>\n"
)
open(os.path.join(OUT, "logo.svg"), "w").write(logo)

# Square emblem for icons (traced units: 62*S x 50*S).
w, h = crop.width * S, crop.height * S
pad = (w - h) / 2
emblem = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {-pad - 10} {w} {w + 20}" width="512" height="512">'
    f"{emblem_group}</svg>\n"
)
open(os.path.join(OUT, "emblem.svg"), "w").write(emblem)
print("wrote logo.svg and emblem.svg", f"tracking={track:.2f}px")
