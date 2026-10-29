"""Validate actual rendered prose for all 191 audited routes, not editorial truth."""
import json
from pathlib import Path
from html.parser import HTMLParser
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip=0; self.prose=[]; self.links=[]; self.ids=[]; self.h1=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag in ('script','style'): self.skip+=1
        if tag=='h1': self.h1+=1
        if 'id' in a:self.ids.append(a['id'])
        if 'href' in a:self.links.append((tag,a))
    def handle_endtag(self,tag):
        if tag in ('script','style'):self.skip=max(0,self.skip-1)
    def handle_data(self,s):
        if not self.skip:self.prose.append(s)
coverage=json.loads(Path('docs/evidence-coverage-2026-10-25/coverage.json').read_text())
for row in coverage['articles']:
    path=row['path']; file=Path('dist/server/prerendered-routes')/(path.lstrip('/')+'.html')
    assert file.exists(),path
    parser=Page();parser.feed(file.read_text()); text=''.join(parser.prose)
    assert parser.h1==1,path
    assert ('answer' in parser.ids or 'answer-title' in parser.ids) and 'references' in parser.ids,path
    assert any(tag=='link' and a.get('rel')=='canonical' and a['href']=='https://gemnao.pages.dev'+path for tag,a in parser.links),path
    assert any(tag=='a' and a['href'].startswith('https://') for tag,a in parser.links),path
    assert ('公式情報の確認' if row['category']=='pc' else '資料の確認記録') in text,path
for path,label in [('/zh/guide/pc-game-crash','确切反馈时间未记录'),('/es/guide/pc-game-crash','sin fecha exacta de recepción registrada')]:
    p=Page();p.feed((Path('dist/server/prerendered-routes')/(path.lstrip('/')+'.html')).read_text());assert label in ''.join(p.prose),path
print('PASS: all 191 built article routes, answer/references/source links, source-date label, canonical; existing zh/es crash date limitation')
