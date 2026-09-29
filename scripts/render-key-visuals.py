"""Draw original keyboard diagrams for shortcut guides (lib/key-visuals.ts).

Input: JSON {"visuals": [...], "sheets": [...]} on stdin. Output: WebP files in
public/images. The keyboard is a simplified Japanese (JIS) layout drawn from
rectangles; no screenshots, photos or vendor logos are used.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SCALE = 2  # draw at 2x and downsample for smooth edges
NAVY = (14, 37, 64)
BLUE = (9, 99, 199)
ORANGE = (214, 104, 16)
PALE = (240, 246, 251)
WHITE = (255, 255, 255)
KEY = (252, 253, 255)
KEY_EDGE = (190, 202, 214)
GREY = (82, 98, 116)
BASE = Path('public/images')
FONT_PATHS = [
    '/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf',
    '/usr/share/fonts/truetype/fonts-japanese-gothic.ttf',
]
FONT_FILE = next((p for p in FONT_PATHS if Path(p).exists()), None)
if FONT_FILE is None:
    sys.exit('A Japanese font (IPAGothic) is required: apt install fonts-ipafont-gothic')

LABELS = {'Win': 'Windows', 'Ctrl': 'Ctrl', 'Shift': 'Shift', 'Alt': 'Alt',
          'Esc': 'Esc', 'Tab': 'Tab', 'Enter': 'Enter', 'F12': 'F12'}


def font(size):
    return ImageFont.truetype(FONT_FILE, size * SCALE)


def key_name(key_id):
    return LABELS.get(key_id, key_id)


# (label, width in key units, id or None). None entries with label '' are gaps.
ROWS = [
    [('Esc', 1, 'Esc'), ('', 1, None), *[(f'F{i}', 1, None) for i in range(1, 5)],
     ('', 0.5, None), *[(f'F{i}', 1, None) for i in range(5, 9)], ('', 0.5, None),
     *[(f'F{i}', 1, 'F12' if i == 12 else None) for i in range(9, 13)]],
    [('半/全', 1, None), *[(c, 1, None) for c in '1234567890-^¥'], ('BS', 1, None)],
    [('Tab', 1.5, 'Tab'), *[(c, 1, c if c in 'PR' else None) for c in 'QWERTYUIOP@['],
     ('Enter', 1.5, 'Enter')],
    [('Caps', 1.75, None), *[(c, 1, c if c == 'G' else None) for c in 'ASDFGHJKL;:]'],
     ('', 1.25, 'Enter')],
    [('Shift', 2.25, 'Shift'), *[(c, 1, c if c == 'B' else None) for c in 'ZXCVBNM,./\\'],
     ('Shift', 1.75, None)],
    [('Ctrl', 1.5, 'Ctrl'), ('Win', 1.25, 'Win'), ('Alt', 1.25, 'Alt'), ('無変換', 1.25, None),
     ('', 4.75, 'Space'), ('変換', 1.25, None), ('かな', 1.25, None), ('Alt', 1.25, None),
     ('Ctrl', 1.5, None)],
]


def text_center(draw, box, text, size, color):
    f = font(size)
    x0, y0, x1, y1 = box
    l, t, r, b = draw.textbbox((0, 0), text, font=f)
    draw.text(((x0 + x1 - (r - l)) / 2 - l, (y0 + y1 - (b - t)) / 2 - t), text, font=f, fill=color)


def keyboard(draw, left, top, unit, colors):
    """colors: key id -> fill colour for highlighted keys."""
    s = SCALE
    gap = 5 * s
    enter_top = None
    for r, row in enumerate(ROWS):
        x = left
        y = top + r * unit + (unit * 0.25 if r > 0 else 0)
        for label, width, kid in row:
            w = width * unit
            if label == '' and kid is None:
                x += w
                continue
            box = [x + gap / 2, y + gap / 2, x + w - gap / 2, y + unit - gap / 2]
            if kid == 'Enter' and r == 2:
                enter_top = box[1]
            if kid == 'Enter' and r == 3:
                box[1] = enter_top  # one inverted-L Enter key spanning two rows
            fill = colors.get(kid, KEY)
            lit = kid in colors
            draw.rounded_rectangle(box, radius=9 * s, fill=fill,
                                   outline=fill if lit else KEY_EDGE, width=2 * s)
            text = key_name(label) if label in LABELS else label
            if label == 'Win':
                text = 'Win'
            size = 22 if len(text) <= 2 else 17 if len(text) <= 4 else 14
            if lit:
                size += 3
            if kid == 'Enter':
                # Label the merged key once, after its lower half is drawn.
                text = 'Enter' if r == 3 else ''
            if text:
                text_center(draw, box, text, size, WHITE if lit else GREY)
            x += w


def keycaps(draw, x, y, combo, color, size=34, height=72):
    """Draw 'Key + Key' as caps starting at x; returns the right edge."""
    s = SCALE
    f = font(size)
    for i, kid in enumerate(combo):
        if i:
            l, t, r, b = draw.textbbox((0, 0), '+', font=f)
            draw.text((x + 10 * s, y + (height * s - (b - t)) / 2 - t), '+', font=f, fill=GREY)
            x += (r - l) + 20 * s
        text = key_name(kid)
        l, t, r, b = draw.textbbox((0, 0), text, font=f)
        w = (r - l) + 36 * s
        draw.rounded_rectangle([x, y, x + w, y + height * s], radius=12 * s, fill=color)
        draw.rounded_rectangle([x, y + height * s - 8 * s, x + w, y + height * s],
                               radius=6 * s, fill=tuple(int(c * 0.78) for c in color))
        draw.text((x + 18 * s - l, y + (height * s - 8 * s - (b - t)) / 2 - t), text,
                  font=f, fill=WHITE)
        x += w
    return x


def caps_width(draw, combo, size=34):
    f = font(size)
    width = 0
    for i, kid in enumerate(combo):
        if i:
            l, t, r, b = draw.textbbox((0, 0), '+', font=f)
            width += (r - l) + 20 * SCALE
        l, t, r, b = draw.textbbox((0, 0), key_name(kid), font=f)
        width += (r - l) + 36 * SCALE
    return width


def save(img, path, size):
    img.resize(size, Image.LANCZOS).save(BASE / path.rsplit('/', 1)[-1], 'WEBP', quality=88, method=6)


def step_image(item):
    s = SCALE
    W, H = item['width'], item['height']
    img = Image.new('RGB', (W * s, H * s), PALE)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W * s, 176 * s], fill=NAVY)
    d.text((48 * s, 26 * s), 'ゲムなお｜PCゲームのお直しWiki', font=font(20), fill=(180, 205, 230))
    d.text((48 * s, 58 * s), item['title'], font=font(36), fill=WHITE)
    palette = [BLUE, ORANGE]
    x = 48 * s
    for i, combo in enumerate(item['combos']):
        if i:
            d.text((x + 14 * s, 116 * s), '／', font=font(30), fill=WHITE)
            x += 58 * s
        x = keycaps(d, x, 106 * s, combo, palette[i], size=24, height=52)
    colors = {}
    for i, combo in enumerate(item['combos']):
        for kid in combo:
            colors.setdefault(kid, palette[i])
    unit = 68 * s
    left = (W * s - 15 * unit) / 2
    keyboard(d, left, 204 * s, unit, colors)
    d.text((48 * s, (H - 34) * s), '日本語（JIS）キーボードの例。キーの位置は機種によって異なります。',
           font=font(16), fill=GREY)
    d.text(((W - 190) * s, (H - 34) * s), 'gemnao.pages.dev', font=font(18), fill=BLUE)
    save(img, item['image'], (W, H))


def cheat_sheet(item):
    s = SCALE
    W, H = item['width'], item['height']
    img = Image.new('RGB', (W * s, H * s), PALE)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W * s, 250 * s], fill=NAVY)
    d.text((64 * s, 54 * s), 'ゲムなお｜PCゲームのお直しWiki', font=font(26), fill=(180, 205, 230))
    d.text((64 * s, 110 * s), item['title'], font=font(50), fill=WHITE)
    d.text((64 * s, 186 * s), 'Windows 11・困った場面から選ぶ', font=font(28), fill=(180, 205, 230))
    top, row_h, gap = 282, 146, 14
    for i, row in enumerate(item['rows']):
        y = (top + i * (row_h + gap)) * s
        d.rounded_rectangle([56 * s, y, (W - 56) * s, y + row_h * s], radius=16 * s, fill=WHITE)
        d.rectangle([56 * s, y, 68 * s, y + row_h * s], fill=BLUE)
        d.text((96 * s, y + 22 * s), row['scene'], font=font(34), fill=NAVY)
        combo = row['combos'][0]
        width = caps_width(d, combo, size=30)
        keycaps(d, (W - 88) * s - width, y + 76 * s, combo, BLUE, size=30, height=56)
    d.text((64 * s, (H - 62) * s), 'キー操作の詳しい手順と注意点は記事本文へ', font=font(26), fill=GREY)
    d.text((64 * s, (H - 26) * s), 'gemnao.pages.dev/pc/gaming-shortcut-keys', font=font(20), fill=BLUE)
    save(img, item['image'], (W, H))


data = json.load(sys.stdin)
for item in data['visuals']:
    step_image(item)
for item in data['sheets']:
    cheat_sheet(item)
print(f"Generated {len(data['visuals'])} keyboard diagrams and {len(data['sheets'])} cheat sheets")
