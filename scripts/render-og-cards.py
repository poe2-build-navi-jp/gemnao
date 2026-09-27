"""Render 1200x630 social preview cards for article pages.

Reads card specs as JSON on stdin (see lib/og-cards.ts) and writes PNGs to
public/images/og/<page path>.png. Uses the same colours and fonts as
render-visuals.py so every card matches the existing flow-chart previews.
"""
import io
import json
import re
import sys
from pathlib import Path

import fitz
from PIL import Image

NAVY = (0.055, 0.145, 0.25)
BLUE = (0.035, 0.39, 0.78)
PALE = (0.94, 0.965, 0.985)
WHITE = (1, 1, 1)
GREY = (0.32, 0.40, 0.47)
MUTED = (0.72, 0.80, 0.87)
FONT = fitz.Font('japan')
LATIN = fitz.Font('helv')
BASE = Path('public/images/og')
WIDTH, HEIGHT, MARGIN = 1200, 630, 62


def font_for(char):
    return LATIN if ord(char) < 128 else FONT


def measure(text, size):
    return sum(font_for(char).text_length(char, fontsize=size) for char in text)


# Characters that must not start a line (Japanese kinsoku shori).
NO_LINE_START = set('ーッャュョァィゥェォヮっゃゅょぁぃぅぇぉゎ、。，．・：；？！）」』】〕〉》ヽヾゝゞ々')
# Keep a short kana run together with the next char when breaking ("映ら|ない").
KANA = re.compile(r'[ぁ-ゖ]')


def wrap(text, size, width):
    # Keep Latin words together ("Way of the Sword"); Japanese wraps per char.
    tokens = re.findall(r"[A-Za-z0-9'&.:+_-]+|\s+|.", text)
    lines, line = [], ''
    for token in tokens:
        if line and measure(line + token, size) > width:
            carry = ''
            # Move characters to the next line instead of starting it with
            # a small kana, long vowel mark or closing punctuation.
            while line[:-1].strip() and (token[0] in NO_LINE_START or (carry and carry[0] in NO_LINE_START)):
                carry = line[-1] + carry
                line = line[:-1]
                if carry[0] not in NO_LINE_START:
                    break
            # Avoid splitting a verb/adjective ending such as "映ら|ない".
            if not carry and KANA.match(token) and len(line) > 2 and KANA.match(line[-1]):
                if line[-2] in NO_LINE_START:  # "コピー|する"
                    carry, line = line[-1:], line[:-1]
                elif not KANA.match(line[-2]):  # "映ら|ない"
                    carry, line = line[-2:], line[:-2]
            lines.append(line.rstrip())
            line = (carry + token).lstrip()
            while measure(line, size) > width:  # a single over-long token
                cut = len(line)
                while cut > 1 and measure(line[:cut], size) > width:
                    cut -= 1
                lines.append(line[:cut])
                line = line[cut:]
        else:
            line += token
    if line.strip():
        lines.append(line.rstrip())
    return lines


def clamp(lines, size, width, limit):
    if len(lines) <= limit:
        return lines
    last = lines[limit - 1]
    while last and measure(last + '…', size) > width:
        last = last[:-1]
    return lines[: limit - 1] + [last + '…']


def draw_line(page, text, x, y, size, color):
    run, previous, cursor = '', None, x
    for char in text + '\0':
        family = 'helv' if char != '\0' and ord(char) < 128 else 'japan'
        if previous is not None and (family != previous or char == '\0'):
            page.insert_text((cursor, y), run, fontsize=size, fontname=previous, color=color)
            cursor += measure(run, size)
            run = ''
        if char != '\0':
            run += char
            previous = family


def rect(page, x, y, w, h, color):
    page.draw_rect(fitz.Rect(x, y, x + w, y + h), color=None, fill=color)


def badge(page, x, y):
    page.draw_rect(fitz.Rect(x, y, x + 45, y + 34), color=WHITE, width=3)
    page.draw_line((x + 14, y + 39), (x + 32, y + 39), color=WHITE, width=3)
    page.draw_polyline([(x + 11, y + 18), (x + 19, y + 25), (x + 35, y + 10)], color=WHITE, width=4)


def fit_title(title, width):
    for size in range(58, 37, -2):
        lines = wrap(title, size, width)
        if len(lines) <= 2:
            return size, lines
    return 38, clamp(wrap(title, 38, width), 38, width, 2)


def card(spec):
    doc = fitz.open()
    page = doc.new_page(width=WIDTH, height=HEIGHT)
    rect(page, 0, 0, WIDTH, HEIGHT, PALE)
    inner = WIDTH - MARGIN * 2
    size, lines = fit_title(spec['title'], inner)
    leading = size * 1.22
    header = 112 + leading * len(lines) + 18
    rect(page, 0, 0, WIDTH, header, NAVY)
    badge(page, MARGIN, 34)
    eyebrow = clamp(wrap(f"ゲムなお | {spec['eyebrow']}", 28, inner - 70), 28, inner - 70, 1)[0]
    draw_line(page, eyebrow, MARGIN + 63, 64, 28, MUTED)
    y = 112 + size * 0.9
    for line in lines:
        draw_line(page, line, MARGIN, y, size, WHITE)
        y += leading

    items = spec['items'][:4]
    top = header + 26
    draw_line(page, spec['itemsLabel'], MARGIN, top + 22, 24, GREY)
    top += 40
    rows = (len(items) + 1) // 2
    footer_top = 572
    gap = 14
    box_h = min(118, (footer_top - top - gap * (rows - 1)) / rows)
    box_w = (inner - 22) / 2
    item_size = 26 if box_h >= 80 else 23
    for i, text in enumerate(items):
        x = MARGIN + (i % 2) * (box_w + 22)
        by = top + (i // 2) * (box_h + gap)
        rect(page, x, by, box_w, box_h, WHITE)
        rect(page, x, by, 9, box_h, BLUE)
        text_w = box_w - 100
        text_lines = clamp(wrap(text, item_size, text_w), item_size, text_w, 2 if box_h >= 80 else 1)
        block = item_size * 1.25 * len(text_lines)
        ty = by + (box_h - block) / 2 + item_size * 0.95
        draw_line(page, f'{i + 1:02d}', x + 24, by + box_h / 2 + 11, 30, BLUE)
        for line in text_lines:
            draw_line(page, line, x + 85, ty, item_size, NAVY)
            ty += item_size * 1.25
    draw_line(page, '詳しい手順 → gemnao.pages.dev', MARGIN, 606, 24, GREY)

    out = BASE / (spec['path'].strip('/') + '.png')
    out.parent.mkdir(parents=True, exist_ok=True)
    pix = page.get_pixmap(alpha=False)
    with Image.open(io.BytesIO(pix.tobytes('png'))) as img:
        img.convert('P', palette=Image.ADAPTIVE, colors=64).save(out, 'PNG', optimize=True)


specs = json.load(sys.stdin)
for spec in specs:
    card(spec)
print(f'Rendered {len(specs)} social preview cards')
