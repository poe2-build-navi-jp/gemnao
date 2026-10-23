#!/usr/bin/env python3
"""Package only the standalone prototype; never the Web repo, credentials or reports."""
from pathlib import Path
import hashlib
import zipfile
root = Path(__file__).resolve().parents[1]
output = root / 'artifacts'
output.mkdir(exist_ok=True)
payload = {}
for name in ['Gemnao.Diagnostics.exe', 'Gemnao.Diagnostics.exe.config']:
    path = root / 'bin/Release/net48' / name
    if not path.is_file(): raise SystemExit('Build first; missing ' + name)
    payload[name] = path.read_bytes()
for pattern in ['README.ja.md', 'README.en.md', 'Resources/*.resx', 'docs/*.md', 'docs/*.txt', 'Gemnao.Diagnostics.csproj', 'packages.lock.json', 'app.manifest', 'src/*.cs', 'tests/*.cs', 'tests/*.csproj', 'tools/*.py']:
    for path in root.glob(pattern):
        payload['source/' + path.relative_to(root).as_posix()] = path.read_bytes()
payload['READ-ME-FIRST.txt'] = (root / 'docs/QUICKSTART.en.txt').read_bytes()
payload['最初に読む.txt'] = (root / 'docs/QUICKSTART.ja.txt').read_bytes()
manifest = ''.join(hashlib.sha256(data).hexdigest() + '  ' + name + '\n' for name, data in sorted(payload.items()))
payload['SHA256SUMS.txt'] = manifest.encode('utf-8')
archive = output / 'gemnao-game-diagnosis-0.6.0-windows-x64.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for name, data in sorted(payload.items()):
        info = zipfile.ZipInfo('gemnao-game-diagnosis/' + name, date_time=(2026, 10, 2, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        z.writestr(info, data)
print(archive)
print('SHA256 ' + hashlib.sha256(archive.read_bytes()).hexdigest())
print(str(archive.stat().st_size) + ' bytes; ' + str(len(payload)) + ' files')
