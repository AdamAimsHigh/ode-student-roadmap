"""Regenerate transparent favicon.png + multi-res favicon.ico from the new brand graphic.

Pipeline: strict luminance-gated flood-fill background removal (only near-black pixels
may be background, so the fill cannot tunnel through shadow lines; connectivity preserves
interior dark metal), largest connected component kept, enclosed holes filled for a
guaranteed-solid silhouette, 1px softened alpha edge, tight crop with bottom cushion,
centered square canvas, and a final bottom-edge matte slice that removes the dark
semi-transparent shadow fringe below the baseline. Descends from commit 432b498's approach.
"""
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

SRC = sys.argv[1]
OUT_PNG = sys.argv[2]
OUT_ICO = sys.argv[3]

# --- load ---
im = Image.open(SRC).convert("RGBA")
arr = np.asarray(im).astype(np.int16)
h, w = arr.shape[:2]
rgb = arr[:, :, :3]

# --- background mask: strict luminance gate + connectivity ---
# Only genuinely near-black pixels (R+G+B <= GATE) may be treated as background, so the
# border flood-fill cannot tunnel through the dark-grey shadow at the front toe (the
# artifact that carved a V-notch out of the silhouette). Analysis of this master shows
# the pure-black studio background is fully captured at GATE=10 (66.6% of frame); raising
# the gate to 18-25 adds only ~0.1% more pixels — precisely the thin shadow channel that
# caused the leak — so we hold the gate at the knee and keep the toe shadow as foreground.
# (A per-channel test like all(rgb<=18) allowed sums up to 54, which is what leaked.)
GATE = 10
lum = rgb.sum(axis=2)
cand = lum <= GATE  # background candidates: strictly near-black only

# BFS flood-fill from the border through candidates → border-connected background only.
# Connectivity guarantees pure-black crevices *inside* the metal are never removed.
bg = np.zeros((h, w), dtype=bool)
dq = deque()
for x in range(w):
    for y in (0, h - 1):
        if cand[y, x] and not bg[y, x]:
            bg[y, x] = True; dq.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if cand[y, x] and not bg[y, x]:
            bg[y, x] = True; dq.append((y, x))
while dq:
    y, x = dq.popleft()
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny, nx = y+dy, x+dx
        if 0 <= ny < h and 0 <= nx < w and cand[ny, nx] and not bg[ny, nx]:
            bg[ny, nx] = True; dq.append((ny, nx))

# --- apply transparency to background ---
alpha = np.where(bg, 0, 255).astype(np.uint8)
out = arr[:, :, :3].astype(np.uint8)
res = np.dstack([out, alpha])
im2 = Image.fromarray(res, "RGBA")

# --- keep largest connected opaque component (drop any stray specks/reflection) ---
fg = ~bg
labels = np.zeros((h, w), dtype=np.int32)
cur = 0
best_label, best_size = 0, 0
for sy in range(h):
    for sx in range(w):
        if fg[sy, sx] and labels[sy, sx] == 0:
            cur += 1; size = 0
            st = deque([(sy, sx)]); labels[sy, sx] = cur
            while st:
                y, x = st.popleft(); size += 1
                for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
                    ny, nx = y+dy, x+dx
                    if 0 <= ny < h and 0 <= nx < w and fg[ny, nx] and labels[ny, nx] == 0:
                        labels[ny, nx] = cur; st.append((ny, nx))
            if size > best_size:
                best_size, best_label = size, cur
keep = labels == best_label

# --- fill fully-enclosed holes so the silhouette is guaranteed solid ---
# With the leak eliminated at the mask stage, the only remaining transparency inside the
# body would be pure-black pockets the gate carved out (e.g. deep metal crevices). Flood
# the *non-body* from the border: anything it cannot reach is an enclosed hole → reclaim
# it as body. The open jaw reaches the border, so it is not enclosed and stays open.
notbody = ~keep
reach = np.zeros((h, w), dtype=bool)
dq = deque()
for x in range(w):
    for y in (0, h - 1):
        if notbody[y, x] and not reach[y, x]:
            reach[y, x] = True; dq.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if notbody[y, x] and not reach[y, x]:
            reach[y, x] = True; dq.append((y, x))
while dq:
    y, x = dq.popleft()
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny, nx = y+dy, x+dx
        if 0 <= ny < h and 0 <= nx < w and notbody[ny, nx] and not reach[ny, nx]:
            reach[ny, nx] = True; dq.append((ny, nx))
keep = keep | (notbody & ~reach)  # reclaim enclosed holes

# --- level shallow anti-aliasing dimples along the bottom baseline ---
# A ~1px-deep, several-px-wide quantization dimple can survive in the outer bottom edge.
# A vertical kernel cannot close a downward-open dent, and a plain wide closing also
# rounds unrelated edges. Instead: horizontally close the mask, then keep only the ADDED
# pixels that (a) sit within DEPTH rows of body directly above (a shallow dent, not the
# deep open jaw) and (b) extend a column's lowest opaque row downward (bottom edge only).
# This levels the baseline and provably cannot touch the wide/deep open jaw or interior.
def _dilate_h(m, rx):
    p = np.pad(m, ((0, 0), (rx, rx)))
    o = np.zeros_like(m)
    for dx in range(2 * rx + 1):
        o |= p[:, dx:dx + w]
    return o
RX, DEPTH = 5, 2
closed = ~_dilate_h(~_dilate_h(keep, RX), RX)  # horizontal closing, width 2*RX+1
added = closed & ~keep
shallow = np.zeros((h, w), dtype=bool)          # body within DEPTH rows directly above
for d in range(1, DEPTH + 1):
    shallow[d:, :] |= keep[:-d, :]
rows = np.arange(h)[:, None]
col_bottom = np.where(keep, rows, -1).max(axis=0)      # lowest opaque row per column
below_bottom = rows > col_bottom[None, :]              # strictly extends the silhouette down
keep = keep | (added & shallow & below_bottom)

alpha2 = np.where(keep, 255, 0).astype(np.uint8)
res = np.dstack([out, alpha2])
im2 = Image.fromarray(res, "RGBA")

# --- soften alpha edge 1px ---
a = im2.split()[3].filter(ImageFilter.GaussianBlur(0.6))
im2.putalpha(a)

# --- crop to content bbox, with a 10px bottom cushion so the base curve is never flush ---
BOTTOM_PAD = 10
l, t, r, b = im2.getbbox()
b = min(b + BOTTOM_PAD, im2.height)
im2 = im2.crop((l, t, r, b))
cw, ch = im2.size

# --- center on square transparent canvas with small padding ---
side = max(cw, ch)
pad = int(side * 0.06)
canvas = side + 2 * pad
sq = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
sq.paste(im2, ((canvas - cw) // 2, (canvas - ch) // 2), im2)

# --- slice the semi-transparent shadow fringe below the bottom baseline ---
# The alpha soften + LANCZOS resize leave a haze of dark (R+G+B <= SHADOW_SUM),
# partially-transparent pixels hanging just below the base curve. Against a light page
# this reads as a fuzzy grey fringe. Per column, find the lowest genuinely-opaque row
# (the clean edge) and force alpha to 0 for any strictly-lower pixel whose colour is in
# the dark background-shadow spectrum. This is bottom-edge only: rows at or above each
# column's edge — the whole body, the open jaw, the side outlines — are untouched.
def slice_bottom_fringe(img, opaque_t=180, shadow_sum=60):
    a = np.asarray(img).copy()
    alpha = a[:, :, 3]
    rgbsum = a[:, :, :3].astype(np.int32).sum(axis=2)
    rows = np.arange(a.shape[0])[:, None]
    edge = np.where(alpha >= opaque_t, rows, -1).max(axis=0)  # lowest opaque row / column
    kill = (rows > edge[None, :]) & (rgbsum <= shadow_sum) & (alpha > 0)
    a[:, :, 3] = np.where(kill, 0, alpha)
    return Image.fromarray(a, "RGBA"), int(kill.sum())

# --- favicon.png @ 512, fringe sliced to a razor edge ---
png = sq.resize((512, 512), Image.LANCZOS)
png, sliced = slice_bottom_fringe(png)
png.save(OUT_PNG)

# --- favicon.ico multi-res 16/32/48, from the cleaned master ---
png.save(OUT_ICO, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

# --- report ---
cov = 100.0 * (alpha2 > 0).sum() / (h * w)
print(f"opaque coverage after keying: {cov:.1f}% of source")
print(f"cropped content: {cw}x{ch}, square canvas: {canvas}px")
print(f"sliced {sliced} dark semi-transparent fringe px below the baseline")
print(f"wrote {OUT_PNG} (512x512 RGBA) and {OUT_ICO} (16/32/48)")
