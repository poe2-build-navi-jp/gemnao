"""Fixed public HTTP observations. No credentials, retries, or redirect following."""
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import time
import xml.etree.ElementTree as ET

ORIGIN = 'https://gemnao.pages.dev'
PATHS = ('/sitemap.xml', '/robots.txt', '/image-sitemap.xml')
NS = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
LIMIT = 2_000_000
UAS = {
    'ordinary': 'Gemnao-Public-Sitemap-Diagnostic/1.0',
    'googlebot-desktop': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'googlebot-mobile': 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'inspection': 'Mozilla/5.0 (compatible; Google-InspectionTool/1.0)',
}
SAFE_HEADERS = {'content-type', 'content-encoding', 'content-length', 'cache-control',
                'etag', 'last-modified', 'vary', 'cf-ray', 'cf-cache-status', 'age',
                'server', 'date', 'x-robots-tag', 'location'}


def headers(raw):
    blocks = []
    for block in re.split(r'\r?\n\r?\n', raw):
        lines = block.splitlines()
        if not lines or not re.match(r'^HTTP/\S+ \d{3}', lines[0]):
            continue
        item = {'status': int(lines[0].split()[1]), 'headers': {}}
        for line in lines[1:]:
            key, sep, value = line.partition(':')
            if sep and key.lower() in SAFE_HEADERS:
                item['headers'][key.lower()] = value.strip()[:2048]
        blocks.append(item)
    return blocks


def body_info(body, path):
    result = {'decodedBytes': len(body), 'decodedSha256': hashlib.sha256(body).hexdigest()}
    try:
        text = body.decode('utf-8', errors='strict')
        result.update(utf8=True, bom=body.startswith(b'\xef\xbb\xbf'))
        if path.endswith('.xml'):
            # Reject DTD/entities before parsing public, untrusted XML.
            if '<!DOCTYPE' in text.upper() or '<!ENTITY' in text.upper():
                raise ValueError('DTD/entity forbidden')
            root = ET.fromstring(text)
            locs = [e.text for e in root.findall(f'{NS}url/{NS}loc')]
            result.update(xmlValid=root.tag == NS + 'urlset', urlCount=len(locs),
                          duplicateUrls=len(locs) - len(set(locs)))
        else:
            result['robotsLines'] = text.splitlines()[:100]
    except (UnicodeError, ET.ParseError, ValueError):
        result['bodyValidationError'] = True
    return result


def observe(path, ua='ordinary', encoding='identity', method='GET', etag=None):
    if path not in PATHS or ua not in UAS or encoding not in ('identity', 'gzip', 'br') or method not in ('GET', 'HEAD'):
        raise ValueError('fixed request boundary')
    if etag is not None and not re.fullmatch(r'(?:W/)?"[\x21\x23-\x7e]{0,256}"', etag):
        raise ValueError('invalid etag')
    with tempfile.TemporaryDirectory() as tmp:
        hp, bp = Path(tmp) / 'headers', Path(tmp) / 'body'
        cmd = ['curl', '--disable', '--silent', '--show-error', '--proto', '=https',
               '--connect-timeout', '10', '--max-time', '20', '--max-filesize', str(LIMIT),
               '--compressed', '--user-agent', UAS[ua], '--header', f'Accept-Encoding: {encoding}',
               '--dump-header', str(hp), '--output', str(bp)]
        if method == 'HEAD':
            cmd.append('--head')
        if etag is not None:
            cmd += ['--header', f'If-None-Match: {etag}']
        cmd.append(ORIGIN + path)
        # No inherited tokens, curl config, cookies, netrc, proxy credentials or auth.
        try:
            result = subprocess.run(cmd, env={'PATH': os.defpath, 'LANG': 'C.UTF-8'},
                                    capture_output=True, timeout=25, check=False)
            exit_code = result.returncode
        except subprocess.TimeoutExpired:
            exit_code = 28
        blocks = headers(hp.read_text(errors='replace')) if hp.exists() else []
        last = blocks[-1] if blocks else {'status': None, 'headers': {}}
        report = {'atUtc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                  'path': path, 'ua': ua, 'encodingRequested': encoding, 'method': method,
                  'conditional': etag is not None, 'curlExit': exit_code,
                  'responses': blocks, 'status': last['status'], 'headers': last['headers'],
                  'redirectFollowed': False}
        # Redirect destination recorded only; never request another URL/host.
        if method == 'GET' and last['status'] == 200 and exit_code == 0:
            body = bp.read_bytes()
            if len(body) > LIMIT:
                report['bodyLimitExceeded'] = True
            else:
                report.update(body_info(body, path))
        return report


def matrix():
    return [(path, ua, enc, method) for path, ua, enc, method in [
        ('/sitemap.xml', 'ordinary', 'identity', 'GET'),
        ('/sitemap.xml', 'ordinary', 'identity', 'HEAD'),
        *[('/sitemap.xml', ua, enc, 'GET') for ua in UAS for enc in ('identity', 'gzip', 'br')
          if (ua, enc) != ('ordinary', 'identity')],
        ('/robots.txt', 'ordinary', 'identity', 'GET'),
        ('/robots.txt', 'googlebot-desktop', 'identity', 'GET'),
        ('/robots.txt', 'inspection', 'identity', 'GET'),
        ('/image-sitemap.xml', 'ordinary', 'identity', 'GET'),
    ]]


def main():
    if os.environ.get('GITHUB_ACTIONS') != 'true' or os.environ.get('GITHUB_REPOSITORY') != 'poe2-build-navi-jp/gemnao':
        raise SystemExit('Run public requests only in the authorized repository Actions runner')
    rows = []
    for index, args in enumerate(matrix()):
        if index:
            time.sleep(3)
        row = observe(*args)
        rows.append(row)
        print(json.dumps(row, ensure_ascii=True), flush=True)
        if row['curlExit'] or row['status'] in (401, 403, 429):
            break  # Do not try alternate UAs/encodings after a denied request.
    baseline = rows[0]
    tag = baseline['headers'].get('etag', '')
    if len(rows) == len(matrix()) and re.fullmatch(r'(?:W/)?"[\x21\x23-\x7e]{0,256}"', tag):
        for label, value in [('matching', tag), ('nonmatching', '"gemnao-diagnostic-no-match-20261029"')]:
            time.sleep(3)
            row = observe('/sitemap.xml', etag=value)
            row['conditionalKind'] = label
            rows.append(row)
            print(json.dumps(row), flush=True)
            if row['curlExit'] or row['status'] in (401, 403, 429):
                break
    hashes = {r['decodedSha256'] for r in rows if r['path'] == '/sitemap.xml' and 'decodedSha256' in r}
    report = {'sourceSha': os.environ.get('GITHUB_SHA'), 'requestsMade': len(rows),
              'requestCap': 19, 'sameSitemapDecodedHash': len(hashes) == 1,
              'limitations': ['GitHub runner, not genuine Google crawler traffic',
                              'No redirects followed; Location records first hop only',
                              'No GSC submission, credentials, Cloudflare API or deployment',
                              'Requested encoding may be ignored by server; inspect content-encoding'],
              'observations': rows}
    Path('sitemap-http-result.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({k: v for k, v in report.items() if k != 'observations'}))
    invalid = any(r['curlExit'] or r['status'] not in (200, 304) or
                  r.get('bodyValidationError') or r.get('bodyLimitExceeded') or
                  r.get('xmlValid') is False or
                  (r.get('xmlValid') and r.get('urlCount', 0) == 0) or
                  (r.get('conditionalKind') == 'nonmatching' and r['status'] != 200) or
                  (r['status'] == 304 and r.get('conditionalKind') != 'matching')
                  for r in rows)
    return 1 if invalid or len(hashes) != 1 else 0


if __name__ == '__main__':
    raise SystemExit(main())
