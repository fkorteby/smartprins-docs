"""Fix waste-ar.png arrows: strip old marks, redraw clean 1+2 annotations."""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

out = Path(
    r"C:\Users\sara.benmansour\smartprins-docs\assets\images\Inventory\Daily\waste-ar.png"
)

im = Image.open(out).convert("RGB")
arr = np.asarray(im).copy()
h, w, _ = arr.shape
print("size", w, h)

# --- strip orange + red annotation pixels ---
orange = (
    (arr[:, :, 0] > 190)
    & (arr[:, :, 1] > 70)
    & (arr[:, :, 1] < 210)
    & (arr[:, :, 2] < 100)
)
red = (arr[:, :, 0] > 170) & (arr[:, :, 1] < 120) & (arr[:, :, 2] < 120)
mask = orange | red

# Dilate
m = mask.copy()
for dy in (-2, -1, 0, 1, 2):
    for dx in (-2, -1, 0, 1, 2):
        if dy == 0 and dx == 0:
            continue
        shifted = np.zeros_like(mask)
        ys = slice(max(0, dy), h + min(0, dy))
        xs = slice(max(0, dx), w + min(0, dx))
        ys2 = slice(max(0, -dy), h - max(0, dy))
        xs2 = slice(max(0, -dx), w - max(0, dx))
        shifted[ys, xs] = mask[ys2, xs2]
        m |= shifted
mask = m
print("strip px", int(mask.sum()))

clean = arr.copy()
yy, xx = np.where(mask)
for y, x in zip(yy, xx):
    y0, y1 = max(0, y - 5), min(h, y + 6)
    x0, x1 = max(0, x - 5), min(w, x + 6)
    patch = arr[y0:y1, x0:x1]
    pmask = mask[y0:y1, x0:x1]
    good = patch[~pmask]
    if len(good) == 0:
        clean[y, x] = (40, 44, 52)
    else:
        clean[y, x] = np.median(good, axis=0).astype(np.uint8)

base = Image.fromarray(clean)
arr = np.asarray(base)
sidebar_x = int(w * 0.78)

# --- find blue Add button ---
region = arr[50:130, 200:sidebar_x]
mask_b = (
    (region[:, :, 2] > 140)
    & (region[:, :, 0] < 150)
    & (region[:, :, 1] > 60)
    & (region[:, :, 1] < 200)
)
ys, xs = np.where(mask_b)
print("blue px", len(xs))
if len(xs) == 0:
    raise SystemExit("no blue button")

# Rightmost cluster (Add button next to sidebar)
x_max = int(xs.max())
keep = xs > (x_max - 220)
xs_k, ys_k = xs[keep], ys[keep]
add_box = (
    int(xs_k.min()) + 200 - 8,
    int(ys_k.min()) + 50 - 8,
    int(xs_k.max()) + 200 + 8,
    int(ys_k.max()) + 50 + 8,
)
# region started at x=200, y=50 — already added
print("add_box", add_box)

# Also box the two dropdowns to the left of Add for "toolbar" feel?
# User text says click + إضافة نفايات — box just the Add button for arrow 2.
# Arrow 1: التالف in sidebar — find active/highlighted row via white edge bar
side = arr[:, sidebar_x:]
# White vertical indicator on far right of active item
edge = side[:, -8:].mean(axis=2)
# Find contiguous bright rows
bright = edge.mean(axis=1) > (edge.mean() + 20)
runs = []
start = None
for i, b in enumerate(bright):
    if b and start is None:
        start = i
    elif not b and start is not None:
        runs.append((start, i - 1))
        start = None
if start is not None:
    runs.append((start, len(bright) - 1))
print("bright runs", runs)

# Prefer run in inventory submenu area (y 250-380) with height ~20-35
side_box = None
for a, b in runs:
    if 240 <= a <= 360 and 15 <= (b - a) <= 40:
        side_box = (sidebar_x + 6, a - 2, w - 4, b + 2)
        break
if side_box is None:
    # Fallback: scan row brightness for التالف zone
    side_box = (806, 268, 1018, 300)
print("side_box", side_box)

# ---- draw ----
annotated = base.convert("RGBA")
draw = ImageDraw.Draw(annotated)
red = (230, 40, 40, 255)
orange = (255, 140, 0, 255)
orange_dk = (200, 100, 0, 255)


def draw_box(box, width=3):
    x0, y0, x1, y1 = [int(v) for v in box]
    for i in range(width):
        draw.rectangle([x0 - i, y0 - i, x1 + i, y1 + i], outline=red)


def draw_badge(cx, cy, num, r=14):
    cx, cy = int(cx), int(cy)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=orange, outline=orange_dk, width=2)
    try:
        font = ImageFont.truetype("arial.ttf", 17)
    except Exception:
        font = ImageFont.load_default()
    text = str(num)
    bb = draw.textbbox((0, 0), text, font=font)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    draw.text((cx - tw / 2, cy - th / 2 - 1), text, fill=(255, 255, 255, 255), font=font)


# 1) Sidebar التالف — arrow from LEFT pointing RIGHT into the box
draw_box(side_box)
sy = (side_box[1] + side_box[3]) // 2
tip_x = side_box[0] - 3
start_x = tip_x - 56
draw.line([(start_x, sy), (tip_x, sy)], fill=orange, width=4)
draw.polygon(
    [(tip_x, sy), (tip_x - 14, sy - 8), (tip_x - 14, sy + 8)],
    fill=orange,
)
draw_badge(start_x - 2, sy, 1)

# 2) Add button — short arrow from BELOW pointing UP into button center
draw_box(add_box)
cx = (add_box[0] + add_box[2]) // 2
tip_y = add_box[3] + 3
start_y = tip_y + 40
draw.line([(cx, start_y), (cx, tip_y)], fill=orange, width=4)
draw.polygon(
    [(cx, tip_y), (cx - 8, tip_y + 14), (cx + 8, tip_y + 14)],
    fill=orange,
)
draw_badge(add_box[0] - 22, (add_box[1] + add_box[3]) // 2, 2)

annotated.convert("RGB").save(out, quality=95)
print("saved", out)

annotated.crop((sidebar_x - 100, side_box[1] - 30, w, side_box[3] + 30)).convert(
    "RGB"
).save(out.parent / "_waste-p1.png")
annotated.crop(
    (max(0, add_box[0] - 80), max(0, add_box[1] - 20), min(w, add_box[2] + 40), add_box[3] + 70)
).convert("RGB").save(out.parent / "_waste-p2.png")
