#!/usr/bin/env python3
"""Inventory local rendered prose; this is a review queue, never fact verification.
Run pnpm build and the read-only local audit-public-site.py crawl first.
"""
import argparse
import hashlib
import gzip
import json
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

class Prose(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.skip = 0
        self.block = None
        self.blocks = []
        self.heading = ''
        self.links = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'main': self.depth += 1
        if tag in ('script', 'style'): self.skip += 1
        if not self.depth or self.skip: return
        if tag == 'a' and attrs.get('href', '').startswith('https://'):
            href = attrs['href']
            if urlsplit(href).netloc != 'gemnao.pages.dev': self.links.add(href)
        if tag in ('p', 'li', 'td', 'dd', 'h1', 'h2', 'h3', 'h4') and self.block is None:
            self.block = {'tag': tag, 'text': []}
    def handle_data(self, text):
        if self.block is not None and not self.skip: self.block['text'].append(text)
    def handle_endtag(self, tag):
        if self.block is not None and self.block['tag'] == tag:
            text = ' '.join(''.join(self.block['text']).split())
            if tag.startswith('h'): self.heading = text
            if len(text) >= 12: self.blocks.append({'section':self.heading, 'text':text, 'tag':tag})
            self.block = None
        if tag == 'main': self.depth = max(0, self.depth - 1)
        if tag in ('script', 'style'): self.skip = max(0, self.skip - 1)

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--crawl', required=True)
    ap.add_argument('--output', default='docs/evidence-audit-2026-10-05')
    ns = ap.parse_args()
    crawl, out = Path(ns.crawl), Path(ns.output)
    out.mkdir(parents=True, exist_ok=True)
    pages, claims, seen = [], [], set()
    for meta in sorted((crawl/'html').glob('*.json')):
        m=json.loads(meta.read_text()); path=urlsplit(m['url']).path or '/'
        if path in seen or not m.get('content_type','') or 'text/html' not in m['content_type']: continue
        seen.add(path)
        p=Prose(); p.feed(meta.with_suffix('.html').read_text())
        locale=path.split('/')[1] if path.split('/')[1] in ['en','zh','es'] else 'ja'
        row={'url':'https://gemnao.pages.dev'+path,'locale':locale,'title':next((b['text'] for b in p.blocks if b['tag']=='h1'), None),'origin':'local-build-crawl','captured_at':m['fetched_at'],'local_http_status':m['status'],'external_links':sorted(p.links),'candidate_count':len(p.blocks),'review_status':'unverified'}
        pages.append(row)
        for b in p.blocks:
            digest=hashlib.sha256((path+'\n'+b['section']+'\n'+b['text']).encode()).hexdigest()[:16]
            claims.append({'id':digest,'path':path,'locale':locale,**b,'status':'unverified','checked_at':None,'applicable_version':None,'evidence_urls':[]})
    pages.sort(key=lambda x:x['url'])
    claims.sort(key=lambda x:(x['path'],x['id']))
    # Identical prose may appear repeatedly in a page (responsive cards/FAQ). Review once.
    claims=list({c['id']:c for c in claims}.values())
    reviews_path = out/'reviews.json'
    if reviews_path.exists():
        by_id = {c['id']: c for c in claims}
        reviewed_ids = set()
        for review in json.loads(reviews_path.read_text()):
            for cid in review['candidate_ids']:
                if cid not in by_id or cid in reviewed_ids:
                    raise ValueError(f'Missing or duplicate reviewed candidate: {cid}')
                reviewed_ids.add(cid)
                by_id[cid].update({k:review[k] for k in ['status','checked_at','applicable_version','evidence_urls']})
                by_id[cid]['review_id'] = review['id']
    for page in pages:
        path = urlsplit(page['url']).path or '/'
        if any(c['path'] == path and c['status'] != 'unverified' for c in claims):
            page['review_status'] = 'partially-reviewed'
    priorities = [
        ('safety', ['BIOS', 'TPM', 'セキュアブート', 'レジストリ', '削除', '除外', '無効', '防火墙', '排除', '杀毒', 'antivirus', 'cortafuegos', 'delete', 'registry']),
        ('release-patch', ['発売', 'パッチ', 'Hotfix', 'KB5', 'アップデート', 'release', 'patch', 'lanzamiento', '更新']),
        ('requirements-settings', ['GPU', 'GB', 'GHz', 'fps', 'DirectX', '設定', 'configuración', '设置', 'settings']),
    ]
    queue = []
    for label, needles in priorities:
        ids = [c['id'] for c in claims if c['status'] == 'unverified' and any(n.lower() in c['text'].lower() for n in needles)]
        queue.append({'priority':label, 'candidate_ids':ids, 'note':'Keyword triage only; overlapping queues, not confirmed errors'})
    (out/'priority-queue.json').write_text(json.dumps(queue,ensure_ascii=False,indent=2)+'\n')
    (out/'pages.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2)+'\n')
    (out/'claims.jsonl.gz').write_bytes(gzip.compress(''.join(json.dumps(c,ensure_ascii=False)+'\n' for c in claims).encode(), mtime=0))
    summary={'pages':len(pages),'candidate_prose_blocks':len(claims),'candidate_status_counts':dict(Counter(c['status'] for c in claims)),'by_locale':dict(Counter(p['locale'] for p in pages)),'status':'partial-audit; candidates are NOT verified claims','production_fetch':'blocked: proxy CONNECT 403; no login attempted'}
    (out/'inventory-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(summary,ensure_ascii=False))
if __name__ == '__main__': main()
