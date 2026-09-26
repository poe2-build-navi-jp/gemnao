"""Generate original Japanese WebP figures from the article STEP registry."""
import io
import json
import sys
from pathlib import Path

import fitz
from PIL import Image

NAVY = (0.055, 0.145, 0.25)
BLUE = (0.035, 0.39, 0.78)
PALE = (0.94, 0.965, 0.985)
WHITE = (1, 1, 1)
GREY = (0.32, 0.40, 0.47)
FONT = fitz.Font('japan')
LATIN = fitz.Font('helv')
BASE = Path('public/images')
BASE.mkdir(parents=True, exist_ok=True)


def font_for(char):
    return LATIN if ord(char) < 128 else FONT


def measure(text, size):
    return sum(font_for(char).text_length(char, fontsize=size) for char in text)


def wrap(text, size, width):
    lines = []
    line = ''
    for char in text:
        if line and measure(line + char, size) > width:
            lines.append(line)
            line = char
        else:
            line += char
    if line:
        lines.append(line)
    return lines


def label(page, text, x, y, size, width, color=NAVY, leading=1.34):
    for line in wrap(text, size, width):
        run = ''
        previous = None
        cursor = x
        for char in line + '\0':
            family = 'helv' if char != '\0' and ord(char) < 128 else 'japan'
            if previous is not None and (family != previous or char == '\0'):
                page.insert_text((cursor, y), run, fontsize=size, fontname=previous, color=color)
                cursor += measure(run, size)
                run = ''
            if char != '\0':
                run += char
                previous = family
        y += size * leading
    return y


def rect(page, x, y, w, h, color):
    page.draw_rect(fitz.Rect(x, y, x + w, y + h), color=None, fill=color)


def badge(page, x, y):
    # An original monitor and check shape; no vendor marks or screenshots.
    page.draw_rect(fitz.Rect(x, y, x + 45, y + 34), color=WHITE, width=3)
    page.draw_line((x + 14, y + 39), (x + 32, y + 39), color=WHITE, width=3)
    page.draw_polyline([(x + 11, y + 18), (x + 19, y + 25), (x + 35, y + 10)], color=WHITE, width=4)


def save(doc, path):
    pix = doc[0].get_pixmap(alpha=False)
    with Image.open(io.BytesIO(pix.tobytes('png'))) as img:
        img.save(path, 'WEBP', quality=87, method=6)


def portrait(item):
    doc = fitz.open()
    page = doc.new_page(width=1080, height=1350)
    rect(page, 0, 0, 1080, 1350, PALE)
    rect(page, 0, 0, 1080, 282, NAVY)
    badge(page, 80, 65)
    label(page, 'ゲムなお | PCゲームのお直しWiki', 145, 95, 30, 850, WHITE)
    label(page, item['title'], 80, 190, 53, 925, WHITE, 1.16)
    steps = item['steps']
    rect(page, 80, 307, 920, 4, BLUE)
    section_label = '近い症状を選ぶ' if item['key'] == 'discord' else '上から順番に確認'
    label(page, section_label, 80, 357, 28, 920, GREY)
    if len(steps) <= 4:
        top = 394
        height = 160 if len(steps) == 4 else 202
        gap = 20
        for index, step in enumerate(steps):
            y = top + index * (height + gap)
            rect(page, 80, y, 920, height, WHITE)
            rect(page, 80, y, 14, height, BLUE)
            label(page, f'{index + 1:02d}', 118, y + 80, 42, 80, BLUE)
            label(page, step, 220, y + 79, 48, 730, leading=1.22)
    else:
        # Keep the six Discord symptoms in one column. Two columns shrink
        # Japanese labels to ~10 px when the diagram is shown on a phone.
        top = 375
        for index, step in enumerate(steps):
            y = top + index * 130
            rect(page, 80, y, 920, 118, WHITE)
            rect(page, 80, y, 14, 118, BLUE)
            label(page, f'{index + 1:02d}', 118, y + 75, 44, 80, BLUE)
            label(page, step, 220, y + 75, 48, 730)
    if item['key'] == 'low-fps':
        label(page, '一瞬止まる症状は「カクつき」記事へ', 80, 1190, 29, 920, BLUE)
    else:
        label(page, '詳しい操作と注意事項は記事本文で確認', 80, 1190, 29, 920, GREY)
    label(page, 'gemnao.pages.dev', 80, 1270, 29, 925, BLUE)
    save(doc, BASE / item['image'].rsplit('/', 1)[-1])


def social(item):
    doc = fitz.open()
    page = doc.new_page(width=1200, height=630)
    rect(page, 0, 0, 1200, 630, PALE)
    rect(page, 0, 0, 1200, 205, NAVY)
    badge(page, 62, 36)
    label(page, 'ゲムなお | 症状から探す', 125, 67, 30, 1030, WHITE)
    label(page, item['title'], 62, 160, 51, 1080, WHITE, 1.15)
    steps = item['steps'][:6]
    cols = 2
    rows = (len(steps) + 1) // 2
    height = 140 if rows <= 2 else 105
    for i, step in enumerate(steps):
        x = 62 + (i % cols) * 548
        y = 238 + (i // cols) * (height + 16)
        rect(page, x, y, 525, height, WHITE)
        rect(page, x, y, 9, height, BLUE)
        label(page, f'{i + 1:02d}', x + 22, y + 52, 30, 70, BLUE)
        label(page, step, x + 85, y + (51 if rows <= 2 else 40), 26, 415)
    label(page, '詳しい手順 → gemnao.pages.dev', 62, 606, 24, 1040, GREY)
    pix = page.get_pixmap(alpha=False)
    with Image.open(io.BytesIO(pix.tobytes('png'))) as img:
        img.save(BASE / item['ogImage'].rsplit('/', 1)[-1], 'PNG', optimize=True)


def logo_png():
    doc = fitz.open()
    page = doc.new_page(width=512, height=512)
    rect(page, 0, 0, 512, 512, NAVY)
    page.draw_rect(fitz.Rect(116, 100, 396, 300), color=WHITE, width=16)
    page.draw_line((210, 329), (302, 329), color=WHITE, width=16)
    page.draw_line((256, 300), (256, 329), color=WHITE, width=16)
    page.draw_polyline([(164, 200), (218, 248), (348, 145)], color=(0.43, 0.79, 1), width=21)
    label(page, 'ゲムなお', 105, 423, 70, 330, WHITE)
    pix = page.get_pixmap(alpha=False)
    with Image.open(io.BytesIO(pix.tobytes('png'))) as img:
        img.save('public/gemnao-logo.png', 'PNG', optimize=True)


def default_social():
    doc = fitz.open()
    page = doc.new_page(width=1200, height=630)
    rect(page, 0, 0, 1200, 630, PALE)
    rect(page, 0, 0, 1200, 215, NAVY)
    badge(page, 78, 61)
    label(page, 'ゲムなお', 148, 99, 54, 930, WHITE)
    label(page, 'PCゲームのお直しWiki', 78, 172, 36, 980, WHITE)
    label(page, '困っている症状から、試す順番を見つける', 78, 312, 45, 1050)
    for i, text in enumerate(['起動しない', 'FPS・カクつき', 'セーブ', 'Discord']):
        x = 78 + i * 268
        rect(page, x, 390, 252, 112, WHITE)
        rect(page, x, 390, 252, 8, BLUE)
        label(page, text, x + 18, 464, 28, 215)
    label(page, 'gemnao.pages.dev', 78, 586, 29, 1000, BLUE)
    pix = page.get_pixmap(alpha=False)
    with Image.open(io.BytesIO(pix.tobytes('png'))) as img:
        img.save('public/og-default.png', 'PNG', optimize=True)


items = json.load(sys.stdin)
for item in items:
    portrait(item)
    social(item)
logo_png()
default_social()
print(f'Generated {len(items)} original flow charts and {len(items)} social previews')
