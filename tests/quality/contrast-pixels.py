"""Contrast against every rendered background pixel inside reviewed text bounds.
Requires Pillow (already used by this repository's OG tooling). No network.
"""
import json
import math
import sys
from PIL import Image

def luminance(rgb):
    values = [v / 255 for v in rgb[:3]]
    values = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in values]
    return sum(v * weight for v, weight in zip(values, (0.2126, 0.7152, 0.0722)))

image = Image.open(sys.argv[1]).convert('RGB')
results = []
for target in json.load(sys.stdin):
    fg = luminance(target['rgb'])
    ratios = []
    for rect in target['rects']:
        box = (max(0, math.ceil(rect['x']) + 1), max(0, math.ceil(rect['y']) + 1),
               min(image.width, math.floor(rect['x'] + rect['width']) - 1),
               min(image.height, math.floor(rect['y'] + rect['height']) - 1))
        if box[2] <= box[0] or box[3] <= box[1]:
            continue
        crop = image.crop(box)
        for _, pixel in crop.getcolors(crop.width * crop.height):
            bg = luminance(pixel)
            ratios.append((max(fg, bg) + .05) / (min(fg, bg) + .05))
    results.append({**target, 'minimumRatio': min(ratios) if ratios else 0})
print(json.dumps(results))
