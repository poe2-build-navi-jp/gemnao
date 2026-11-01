"""Read-only assertions on the real post-build output; stdlib XML parser."""
from pathlib import Path
import hashlib
import json
import xml.etree.ElementTree as ET

base = Path('dist/client')
original = (base / 'sitemap.xml').read_bytes()
copy = (base / 'sitemap-diagnostic-copy.xml').read_bytes()
minimal = (base / 'sitemap-diagnostic-minimal.xml').read_bytes()
assert original == copy, 'Control copy must be byte-identical'
ns = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
for body in (original, copy, minimal):
    assert not body.startswith(b'\xef\xbb\xbf')
    root = ET.fromstring(body.decode('utf-8', errors='strict'))
    assert root.tag == ns + 'urlset'
root = ET.fromstring(minimal)
assert len(root) == 1
assert len(root[0]) == 1
assert root[0][0].tag == ns + 'loc'
assert root[0][0].text == 'https://gemnao.pages.dev/'
assert b'lastmod' not in minimal
for directory in ('public', 'dist/client'):
    routes = json.loads(Path(directory, '_routes.json').read_text())
    for name in ('sitemap-diagnostic-copy.xml', 'sitemap-diagnostic-minimal.xml'):
        assert '/' + name in routes['exclude']
        assert name not in Path(directory, 'robots.txt').read_text()
        assert name.encode() not in original
        assert name not in Path(directory, '_headers').read_text()
        assert name not in Path(directory, '_redirects').read_text()
print(json.dumps({'canonicalBytes': len(original), 'canonicalUrls': len(ET.fromstring(original)),
                  'canonicalSha256': hashlib.sha256(original).hexdigest(),
                  'copyByteIdentical': True, 'minimalUrls': 1, 'minimalBytes': len(minimal)}))
