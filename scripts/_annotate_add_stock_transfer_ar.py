"""Annotate Arabic admin_add_stock_Transfer form like the English version (3 orange boxes)."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

src = Path(
    r"C:\Users\sara.benmansour\AppData\Roaming\Cursor\User\workspaceStorage"
    r"\empty-window\images\image-43194ab3-ecf7-47e9-a7c3-bc10237a0503.png"
)
out = Path(
    r"C:\Users\sara.benmansour\smartprins-docs\assets\images\Inventory\Daily"
    r"\add-stock-transfer-ar.png"
)

im = Image.open(src).convert("RGBA")
w, h = im.size
print("size", w, h)

annotated = im.copy()
draw = ImageDraw.Draw(annotated)

orange = (228, 94, 41, 255)
orange_dk = (200, 60, 0, 255)
white = (255, 255, 255, 255)

# Tuned for 1008x849 RTL form (mirrors EN add-stock-transfer.png):
# Row1 RTL: التاريخ (right) | admin_source_branch | admin_destination_branch (left)
# Box 1 = source + destination labels+inputs (skip date on the right)
box1 = (14, 48, 655, 152)
# Row2: الموظف | الحالة | الملاحظات (labels + inputs)
box2 = (14, 168, 994, 285)
# قائمة العناصر table down to above action buttons
box3 = (14, 305, 994, 758)


def draw_box(box, width=3):
    x0, y0, x1, y1 = box
    for i in range(width):
        draw.rectangle([x0 - i, y0 - i, x1 + i, y1 + i], outline=orange)


def draw_badge(cx, cy, num, r=14):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=orange, outline=orange_dk)
    try:
        font = ImageFont.truetype("arial.ttf", 18)
    except Exception:
        font = ImageFont.load_default()
    text = str(num)
    bb = draw.textbbox((0, 0), text, font=font)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    draw.text((cx - tw / 2, cy - th / 2 - 1), text, fill=white, font=font)


def draw_cursor(tip_x, tip_y, point_right=True, scale=1.15):
    s = scale
    if point_right:
        pts = [
            (tip_x, tip_y),
            (tip_x - 14 * s, tip_y + 4 * s),
            (tip_x - 10 * s, tip_y + 8 * s),
            (tip_x - 18 * s, tip_y + 18 * s),
            (tip_x - 14 * s, tip_y + 20 * s),
            (tip_x - 6 * s, tip_y + 10 * s),
            (tip_x - 2 * s, tip_y + 14 * s),
        ]
    else:
        pts = [
            (tip_x, tip_y),
            (tip_x + 14 * s, tip_y + 4 * s),
            (tip_x + 10 * s, tip_y + 8 * s),
            (tip_x + 18 * s, tip_y + 18 * s),
            (tip_x + 14 * s, tip_y + 20 * s),
            (tip_x + 6 * s, tip_y + 10 * s),
            (tip_x + 2 * s, tip_y + 14 * s),
        ]
    draw.polygon(pts, fill=orange, outline=orange_dk)


for box in (box1, box2, box3):
    draw_box(box)

# Badge 1 at top-left of box1 (RTL: near destination/source group start)
draw_badge(box1[0] + 18, box1[1] + 16, 1)
draw_cursor(box1[0] + 8, box1[3] - 8, point_right=True)

# Badge 2 at bottom-left of box2
draw_badge(box2[0] + 18, box2[3] - 18, 2)
draw_cursor(box2[0] + 8, box2[3] - 4, point_right=True)

# Badge 3 at top-left of items list
draw_badge(box3[0] + 18, box3[1] + 16, 3)
draw_cursor(box3[0] + 8, box3[1] + 48, point_right=True)

annotated.convert("RGB").save(out, quality=95)
print("saved", out)

# Previews
preview = out.parent
annotated.crop((0, 40, w, 270)).convert("RGB").save(preview / "_ast-p12.png")
annotated.crop((0, 270, w, 500)).convert("RGB").save(preview / "_ast-p3.png")
