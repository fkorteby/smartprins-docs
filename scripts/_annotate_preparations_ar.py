"""Annotate Arabic Preparations list: (1) التحضيرات sidebar, (2) + إضافة تحضير."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

src = Path(
    r"C:\Users\sara.benmansour\AppData\Roaming\Cursor\User\workspaceStorage"
    r"\empty-window\images\image-893f759b-2606-4554-98df-659afaafbc14.png"
)
out = Path(
    r"C:\Users\sara.benmansour\smartprins-docs\assets\images\Inventory\Daily"
    r"\preparations-ar.png"
)
preview_dir = out.parent

im = Image.open(src).convert("RGBA")
w, h = im.size
print("size", w, h)

# Hard-tuned from pixel guides on this 1912x926 screenshot
# Sidebar: التحضيرات under المخزون ← المخزون (below جرد المخزون ~660-680)
side_box = (1499, 698, 1906, 722)
# Toolbar: + إضافة تحضير (rightmost blue button; branch dropdown is to its left)
add_box = (1362, 197, 1494, 253)
print("side_box", side_box)
print("add_box", add_box)

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


def arrow_from_left(box, length=55):
    y = (box[1] + box[3]) // 2
    x1 = box[0] - 2
    x0 = x1 - length
    draw.line([(x0, y), (x1, y)], fill=orange, width=3)
    draw.polygon([(x1, y), (x1 - 10, y - 6), (x1 - 10, y + 6)], fill=orange)
    return x0, y


def arrow_from_below(box):
    cx = (box[0] + box[2]) // 2
    y1 = box[3] + 2
    y0 = y1 + 32
    draw.line([(cx, y0), (cx, y1)], fill=orange, width=3)
    draw.polygon([(cx, y1), (cx - 7, y1 + 10), (cx + 7, y1 + 10)], fill=orange)
    return cx, y0


draw_box(side_box)
draw_box(add_box)

x0, y0 = arrow_from_left(side_box, 55)
draw_badge(x0 - 2, y0, 1)

arrow_from_below(add_box)
draw_badge(add_box[0] - 20, (add_box[1] + add_box[3]) // 2, 2)

annotated.convert("RGB").save(out, quality=95)
print("saved", out)

annotated.crop((1450, 680, w, 740)).convert("RGB").save(preview_dir / "_prep-p1.png")
annotated.crop((1280, 170, 1550, 300)).convert("RGB").save(preview_dir / "_prep-p2.png")
