from collections import Counter
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

src = Path(
    r"C:\Users\sara.benmansour\.cursor\projects\c-Users-sara-benmansour-smartprins-docs"
    r"\assets\c__Users_sara.benmansour_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"empty-window_images_image-848fdfcd-1d07-41a8-b21b-8b6ce46a4b66.png"
)
out = Path(r"C:\Users\sara.benmansour\smartprins-docs\assets\images\Getting-started\employee-ar.png")
preview = Path(r"C:\Users\sara.benmansour\smartprins-docs\assets\images\Getting-started\_employee-ar-preview.png")

im = Image.open(src).convert("RGBA")
arr = np.asarray(im.convert("RGB"))
h, w, _ = arr.shape
sidebar_x = int(w * 0.78)

# Hard-tuned from pixel guides: "+ إضافة موظف" only (not "اختر الحالة" to its left)
btn = (728, 98, 820, 131)
print("btn", btn)

# --- Locate الموظف row in right sidebar ---
side = arr[:, sidebar_x:, :]
# Selected/active menu often has slightly brighter bg; also look for icon+text band
scores = []
for y in range(160, 340):
    row = side[y, 10:-10, :]
    scores.append((float(row.mean()), y))
scores.sort(reverse=True)
print("bright ys", [y for _, y in scores[:20]])

# Prefer a band around the brighter cluster near mid sidebar (employee under cashier)
# From layout: profile ~40-100, dashboard~120, kitchen~155, client~185, online~215,
# marketing~245, cashier~275, employee~305, ...
# Use brightness peaks and pick the one under cashier (~ after first major expansion)
candidate_ys = sorted({y for _, y in scores[:40]})
# Cluster contiguous peaks
clusters = []
for y in sorted(candidate_ys):
    if not clusters or y - clusters[-1][-1] > 8:
        clusters.append([y])
    else:
        clusters[-1].append(y)
print("clusters", [(c[0], c[-1], round(np.mean([s for s, yy in scores if yy in c]), 1)) for c in clusters])

# From sidebar guides: الكاشير ~275-305, الموظف ~310-335, إدارة الورديات ~340-360
menu = (sidebar_x + 4, 308, w - 4, 336)
print("menu", menu)


def draw_cursor(draw, tip_x, tip_y, point_left=True, scale=1.0):
    """Simple filled orange mouse-pointer shape."""
    s = scale
    if point_left:
        pts = [
            (tip_x, tip_y),
            (tip_x + 14 * s, tip_y + 4 * s),
            (tip_x + 10 * s, tip_y + 8 * s),
            (tip_x + 18 * s, tip_y + 18 * s),
            (tip_x + 14 * s, tip_y + 20 * s),
            (tip_x + 6 * s, tip_y + 10 * s),
            (tip_x + 2 * s, tip_y + 14 * s),
        ]
    else:
        pts = [
            (tip_x, tip_y),
            (tip_x - 14 * s, tip_y + 4 * s),
            (tip_x - 10 * s, tip_y + 8 * s),
            (tip_x - 18 * s, tip_y + 18 * s),
            (tip_x - 14 * s, tip_y + 20 * s),
            (tip_x - 6 * s, tip_y + 10 * s),
            (tip_x - 2 * s, tip_y + 14 * s),
        ]
    draw.polygon(pts, fill=(255, 120, 40, 255), outline=(200, 60, 0, 255))


annotated = im.copy()
draw = ImageDraw.Draw(annotated)
red = (230, 40, 40, 255)
width_px = 3

for box in (menu, btn):
    x0, y0, x1, y1 = box
    for i in range(width_px):
        draw.rectangle([x0 - i, y0 - i, x1 + i, y1 + i], outline=red)

# Cursors: point toward menu from left (into sidebar), and toward button from below-left
draw_cursor(draw, menu[0] - 2, (menu[1] + menu[3]) // 2 - 4, point_left=False, scale=1.1)
draw_cursor(draw, btn[0] + 8, btn[3] + 2, point_left=False, scale=1.1)

annotated.convert("RGB").save(out, quality=95)
annotated.convert("RGB").save(preview, quality=95)
print("saved", out)
