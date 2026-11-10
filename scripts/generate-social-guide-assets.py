"""Render authored quick-check diagrams; no game screenshots or claimed test results."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT = Path('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
BOLD = Path('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc')


def font(size, bold=False):
    return ImageFont.truetype(str(BOLD if bold else FONT), size, index=0)


def lines(draw, text, f, width):
    result = []
    for paragraph in text.split('\n'):
        words = list(paragraph) if any(ord(c) > 255 for c in paragraph) else paragraph.split(' ')
        join = '' if any(ord(c) > 255 for c in paragraph) else ' '
        line = ''
        for word in words:
            trial = line + (join if line else '') + word
            if line and draw.textlength(trial, font=f) > width:
                result.append(line)
                line = word
            else:
                line = trial
        result.append(line)
    return result


def text(draw, value, xy, size, color, width, max_lines, bold=False):
    f = font(size, bold)
    wrapped = lines(draw, value, f, width)
    if len(wrapped) > max_lines:
        raise ValueError(f'Text overflows: {value}')
    for i, line in enumerate(wrapped):
        draw.text((xy[0], xy[1] + i * (size + 12)), line, font=f, fill=color)


def render(item):
    im = Image.new('RGB', (1200, 1200), '#102c39')
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 16, 1200), fill='#f07a4b')
    text(d, 'GEMNAO / QUICK CHECK', (68, 48), 27, '#74d3d6', 1060, 1, True)
    text(d, item['title'], (68, 118), 68, '#ffffff', 1070, 2, True)
    text(d, item['subtitle'], (70, 314), 28, '#b8cdd4', 1060, 1)
    for i, step in enumerate(item['steps']):
        y = 390 + i * 185
        d.rounded_rectangle((62, y, 1138, y + 165), radius=20, fill='#f0f7f7')
        text(d, step['title'], (90, y + 17), 34, '#13576b', 1015, 1, True)
        text(d, step['body'], (90, y + 76), 30, '#243f4a', 1015, 2)
    text(d, item['caution'], (70, 982), 27, '#ffc29c', 1060, 2, True)
    text(d, 'gemnao.pages.dev', (70, 1090), 38, '#ffffff', 1060, 1, True)
    text(d, 'Read the full guide for conditions and steps' if item['lang'] == 'en' else '条件・詳しい手順は記事で確認してください', (70, 1150), 21, '#b8cdd4', 1060, 1)
    return im


if __name__ == '__main__':
    target = ROOT / 'public/images/social-guides'
    target.mkdir(parents=True, exist_ok=True)
    for item in json.loads((ROOT / 'lib/social-guide-assets.json').read_text()):
        image = render(item)
        image.save(target / f"{item['id']}.png", optimize=True)
        print(f"Rendered {item['id']} (1200 x 1200)")
