from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

src = Path(
    r"C:\Users\sara.benmansour\.cursor\projects\c-Users-sara-benmansour-smartprins-docs"
    r"\assets\c__Users_sara.benmansour_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"empty-window_images_image-8d9ae6a1-daa9-420f-ab3e-a8513b0199ab.png"
)
out = Path(
    r"C:\Users\sara.benmansour\smartprins-docs\assets\images\Inventory\Daily"
    r"\purchase-reception-ar.png"
)
preview_dir = out.parent

im = Image.open(src).convert("RGBA")
arr = np.asarray(im.convert("RGB"))
h, w, _ = arr.shape
print("size", w, h)

sidebar_x = int(w * 0.78)

# Locate blue Add button in toolbar (exclude sidebar)
region = arr[50:140, 0:sidebar_x]
mask = (
    (region[:, :, 2] > 160)
    & (region[:, :, 0] < 130)
    & (region[:, :, 1] > 70)
    & (region[:, :, 1] < 180)
)
ys, xs = np.where(mask)
print("blue px", len(xs))
if len(xs) == 0:
    raise SystemExit("no blue button found")

# Keep the rightmost blue cluster (Add button near sidebar in RTL)
x_max = xs.max()
keep = xs > (x_max - 160)
xs_k, ys_k = xs[keep], ys[keep]
add_box = (
    int(xs_k.min()) - 4,
    int(ys_k.min()) + 50 - 4,
    int(xs_k.max()) + 4,
    int(ys_k.max()) + 50 + 4,
)
print("add_box", add_box)

# Sidebar: استقبالات الشراء — under المشتريات, below طلبات الشراء
# From prior PO page: طلبات ~288-316; استقبالات is next (~318-346)
side_box = (sidebar_x + 10, 318, w - 8, 348)

# Refine sidebar Y by scanning for active/highlighted row brightness if possible
side = arr[260:380, sidebar_x:]
# Save guides for debug
guide = im.crop((sidebar_x, 260, w, 400))
gd = ImageDraw.Draw(guide)
for y in range(260, 400, 10):
    yy = y - 260
    gd.line([(0, yy), (guide.width, yy)], fill=(255, 0, 0))
    if y % 20 == 0:
        gd.text((2, yy), str(y), fill=(255, 255, 0))
guide.convert("RGB").save(preview_dir / "_prx-side.png")

tool = im.crop((add_box[0] - 40, 50, sidebar_x, 150))
tool.convert("RGB").save(preview_dir / "_prx-tool.png")

# ---- annotate ----
annotated = im.copy()
draw = ImageDraw.Draw(annotated)
red = (230, 40, 40, 255)
orange = (255, 140, 0, 255)
orange_dk = (200, 100, 0, 255)


def draw_box(box, width=3):
    x0, y0, x1, y1 = box
    for i in range(width):
        draw.rectangle([x0 - i, y0 - i, x1 + i, y1 + i], outline=red)


def draw_badge(cx, cy, num, r=13):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=orange, outline=orange_dk)
    try:
        font = ImageFont.truetype("arial.ttf", 16)
    except Exception:
        font = ImageFont.load_default()
    text = str(num)
    bb = draw.textbbox((0, 0), text, font=font)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    draw.text((cx - tw / 2, cy - th / 2 - 1), text, fill=(255, 255, 255, 255), font=font)


def arrow_from_left(box, length=50):
    y = (box[1] + box[3]) // 2
    x1 = box[0] - 2
    x0 = x1 - length
    draw.line([(x0, y), (x1, y)], fill=red, width=3)
    draw.polygon([(x1, y), (x1 - 10, y - 6), (x1 - 10, y + 6)], fill=red)
    return x0, y


def arrow_from_below(box):
    cx = (box[0] + box[2]) // 2
    y1 = box[3] + 2
    y0 = y1 + 28
    draw.line([(cx, y0), (cx, y1)], fill=red, width=3)
    draw.polygon([(cx, y1), (cx - 7, y1 + 10), (cx + 7, y1 + 10)], fill=red)
    return cx, y0


# Use refined side box after reading guide — defaults:
# Based on PO page pattern: طلبات at ~288-316, next item +30
side_box = (808, 318, 1014, 348)

draw_box(side_box)
draw_box(add_box)

x0, y0 = arrow_from_left(side_box, 52)
draw_badge(x0 - 2, y0, 1)

# EN ref: arrow from below pointing up to Add button, badge to the left
cx, y0 = arrow_from_below(add_box)
draw_badge(add_box[0] - 18, (add_box[1] + add_box[3]) // 2, 2)

annotated.convert("RGB").save(out, quality=95)
print("saved", out, annotated.size)

annotated.crop((780, 280, w, 380)).convert("RGB").save(preview_dir / "_prx-p1.png")
annotated.crop((add_box[0] - 80, 50, min(add_box[2] + 40, sidebar_x), 170)).convert(
    "RGB"
).save(preview_dir / "_prx-p2.png")
