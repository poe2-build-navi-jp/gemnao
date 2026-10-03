#!/usr/bin/env python3
"""Read-only HTML census. No browser scripts, analytics requests, forms or API writes.

python scripts/audit-public-site.py --output outputs/site-audit
Uses curl and Python's standard library; saves a per-URL evidence manifest.
"""
import argparse
import concurrent.futures
import hashlib
import json
import pathlib
import subprocess
import time
import urllib.parse
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from html.parser import HTMLParser


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.head = False
        self.capture = None
        self.buf = []
        self.title = []
        self.h1 = []
        self.metas = defaultdict(list)
        self.canonical = []
        self.links = []
        self.ids = []
        self.schemas = []
        self.schema_errors = []
        self.assets = []
        self.head_fields = []
        self.lang = ''

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'head': self.head = True
        if tag == 'html': self.lang = a.get('lang', '')
        if a.get('id'): self.ids.append(a['id'])
        if tag in ('title', 'h1') or (tag == 'script' and a.get('type') == 'application/ld+json'):
            self.capture = tag
            self.buf = []
            if tag == 'title' and self.head: self.head_fields.append('title')
        if tag == 'meta':
            name = a.get('name', a.get('property', '')).lower()
            self.metas[name].append(a.get('content', ''))
            if self.head: self.head_fields.append(name)
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonical.append(a.get('href', ''))
            if self.head: self.head_fields.append('canonical')
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        if tag == 'script' and a.get('src'): self.assets.append(a['src'])
        if tag == 'link' and a.get('rel') == 'stylesheet': self.assets.append(a.get('href', ''))

    def handle_endtag(self, tag):
        if tag == self.capture:
            content = ''.join(self.buf).strip()
            if tag == 'title': self.title.append(content)
            elif tag == 'h1': self.h1.append(content)
            else:
                try: self.schemas.append(json.loads(content))
                except (ValueError, TypeError): self.schema_errors.append(content[:120])
            self.capture = None
        if tag == 'head': self.head = False

    def handle_data(self, data):
        if self.capture: self.buf.append(data)


def schema_types(value):
    types = []
    if isinstance(value, dict):
        t = value.get('@type')
        if t: types.extend(t if isinstance(t, list) else [t])
        for v in value.values(): types.extend(schema_types(v))
    elif isinstance(value, list):
        for v in value: types.extend(schema_types(v))
    return sorted(set(types))


def main():
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument('--base', default='https://gemnao.pages.dev')
    args.add_argument('--output', default='outputs/site-audit')
    args.add_argument('--workers', type=int, default=1)
    ns = args.parse_args()
    base = ns.base.rstrip('/')
    out = pathlib.Path(ns.output)
    raw = out / 'html'
    raw.mkdir(parents=True, exist_ok=True)

    def fetch(url):
        file = raw / (hashlib.sha256(url.encode()).hexdigest()[:20] + '.html')
        meta = file.with_suffix('.json')
        if meta.exists() and file.exists():
            cached = json.loads(meta.read_text())
            if cached['status'] > 0:
                return cached, file.read_text(errors='replace')
        cmd = ['curl', '--silent', '--show-error', '--location', '--max-redirs', '3',
               '--max-time', '45', '--output', str(file), '--write-out', '%{json}', url]
        response = subprocess.run(cmd, capture_output=True, text=True)
        try: data = json.loads(response.stdout)
        except ValueError: data = {}
        result = {'url': url, 'status': data.get('http_code', 0),
                  'final_url': data.get('url_effective', ''),
                  'content_type': data.get('content_type', ''),
                  'bytes': data.get('size_download', 0),
                  'elapsed_seconds': data.get('time_total'),
                  'error': response.stderr[:250] if response.returncode else None,
                  'fetched_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}
        meta.write_text(json.dumps(result, ensure_ascii=False))
        return result, file.read_text(errors='replace') if file.exists() else ''

    resources = {}
    for path in ['/sitemap.xml', '/image-sitemap.xml', '/robots.txt', '/ads.txt']:
        result, content = fetch(base + path)
        resources[path] = result | {'body': content}
    if resources['/sitemap.xml']['status'] != 200:
        raise SystemExit('Sitemap is not accessible; stopped without guessing the page set')
    listed = [n.text for n in ET.fromstring(resources['/sitemap.xml']['body']).findall('.//{*}loc')]
    sitemap_urls = [base + urllib.parse.urlparse(u).path for u in listed]
    pages = {}
    queue = set(sitemap_urls)
    edges = []
    ignored = set()
    assets = set()
    while queue:
        batch = sorted(queue - set(pages))
        if not batch: break
        queue = set()
        with concurrent.futures.ThreadPoolExecutor(max_workers=ns.workers) as pool:
            for result, content in pool.map(fetch, batch):
                url = result['url']
                p = Page()
                if 'text/html' in (result['content_type'] or ''): p.feed(content)
                pages[url] = result | {
                    'in_sitemap': url in sitemap_urls, 'title': p.title, 'h1': p.h1,
                    'description': p.metas['description'], 'canonical': p.canonical,
                    'robots': p.metas['robots'], 'og_title': p.metas['og:title'],
                    'og_image': p.metas['og:image'], 'lang': p.lang,
                    'schema_types': schema_types(p.schemas), 'schema_errors': p.schema_errors,
                    'head_fields': sorted(set(p.head_fields)), 'ids': p.ids,
                    'duplicate_ids': [k for k, count in Counter(p.ids).items() if count > 1],
                    'internal_link_count': 0,
                }
                for href in p.links:
                    target = urllib.parse.urlparse(urllib.parse.urljoin(url, href))
                    if target.netloc != urllib.parse.urlparse(base).netloc: continue
                    path = target.path or '/'
                    if path.startswith(('/api/', '/admin')) or '.' in path.rsplit('/', 1)[-1]:
                        ignored.add(path); continue
                    dest = base + path.rstrip('/') if path != '/' else base + '/'
                    edges.append({'from': url, 'to': dest, 'fragment': urllib.parse.unquote(target.fragment)})
                    pages[url]['internal_link_count'] += 1
                    if dest not in pages: queue.add(dest)
                for asset in p.assets:
                    target = urllib.parse.urljoin(url, asset)
                    if urllib.parse.urlparse(target).netloc == urllib.parse.urlparse(base).netloc: assets.add(target)
                print(f"{len(pages):3} {result['status']} {urllib.parse.urlparse(url).path}", flush=True)
    asset_results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=ns.workers) as pool:
        for result, _ in pool.map(fetch, sorted(assets)): asset_results.append(result)
    broken = [e for e in edges if e['to'] in pages and pages[e['to']]['status'] != 200]
    fragment_errors = [e for e in edges if e['fragment'] and e['to'] in pages
                       and pages[e['to']]['status'] == 200 and e['fragment'] not in pages[e['to']]['ids']]
    issues = []
    for u, p in pages.items():
        if p['status'] != 200: issues.append({'url':u,'issue':'non_200','value':p['status']})
        if 'text/html' not in (p['content_type'] or ''): continue
        for field in ['title','description','canonical','h1']:
            if len(p[field]) != 1 or not p[field][0]: issues.append({'url':u,'issue':field+'_count','value':p[field]})
        if p['in_sitemap'] and any('noindex' in r for r in p['robots']): issues.append({'url':u,'issue':'sitemap_noindex'})
        if p['schema_errors']: issues.append({'url':u,'issue':'invalid_jsonld'})
        if p['duplicate_ids']: issues.append({'url':u,'issue':'duplicate_ids','value':p['duplicate_ids']})
        for f in ['title','description','canonical','og:image']:
            if f not in p['head_fields']: issues.append({'url':u,'issue':'missing_head_'+f})
        if p['canonical'] and urllib.parse.urlparse(p['canonical'][0]).path.rstrip('/') != urllib.parse.urlparse(u).path.rstrip('/'):
            issues.append({'url':u,'issue':'canonical_path_mismatch','value':p['canonical']})
    duplicates = {}
    for key in ['title','description','h1']:
        groups = defaultdict(list)
        for u,p in pages.items():
            if p['status'] == 200 and p[key]: groups[p[key][0]].append(u)
        duplicates[key] = [{'text':k,'urls':v} for k,v in groups.items() if len(v)>1]
    report = {'base':base,'completed_at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),
              'sitemap_count':len(sitemap_urls),'sitemap_duplicate_count':len(sitemap_urls)-len(set(sitemap_urls)),
              'crawled_pages':len(pages),'status_counts':dict(Counter(p['status'] for p in pages.values())),
              'issues':issues,'duplicate_metadata':duplicates,'broken_links':broken,
              'missing_fragments':fragment_errors,'assets':asset_results,
              'excluded_api_admin_files':sorted(ignored),'resources':resources,'pages':list(pages.values()),'edges':edges}
    (out/'manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps({k:report[k] for k in ['sitemap_count','crawled_pages','status_counts','issues','duplicate_metadata']},ensure_ascii=False,indent=2))


if __name__ == '__main__': main()
