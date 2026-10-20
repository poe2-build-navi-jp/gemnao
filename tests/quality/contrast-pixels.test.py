import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from PIL import Image

class PixelContrastTest(unittest.TestCase):
    def test_known_ratios_and_worst_pixel(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'background.png'
            image = Image.new('RGB', (20, 10), 'white')
            # A single low-contrast pixel must not be lost to averaging.
            image.putpixel((15, 5), (0, 0, 0))
            image.save(path)
            targets = [dict(rgb=[0, 0, 0], rects=[dict(x=x,y=0,width=10,height=10)]) for x in (0,10)]
            targets.append(dict(rgb=[255,255,255], rects=[dict(x=0,y=0,width=10,height=10)]))
            targets.append(dict(rgb=[0,0,0],rects=[]))
            result = json.loads(subprocess.check_output(['python3','tests/quality/contrast-pixels.py',str(path)],input=json.dumps(targets).encode()))
            self.assertEqual([r['minimumRatio'] for r in result], [21,1,1,0])

if __name__ == '__main__':
    unittest.main()
