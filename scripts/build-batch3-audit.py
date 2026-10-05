"""Build review queues without promoting matches or source links to verified prose."""
import gzip
import hashlib
import json
import re
from collections import Counter
from pathlib import Path

OUT = Path('docs/evidence-audit-batch3-2026-10-05')
families = json.loads(gzip.decompress(Path('docs/evidence-audit-batch2-2026-10-05/article-units.json.gz').read_bytes()))
claims = json.loads((OUT / 'shared-claims.json').read_text())
observations = json.loads((OUT / 'source-observations.json').read_text())
selected = [u for u in families if u['kind'] in ['common-guide', 'pc-article', 'discord-article']]

def dump(name, value):
    data = (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()
    if name in ['claim-locations.json', 'source-queue.json', 'all-212-page-queue.json']:
        (OUT / (name + '.gz')).write_bytes(gzip.compress(data, mtime=0))
        (OUT / name).unlink(missing_ok=True)
    else:
        (OUT / name).write_bytes(data)

def leaves(value, field='body'):
    if isinstance(value, str):
        yield field, value
    elif isinstance(value, dict):
        for key, child in value.items():
            yield from leaves(child, field + '.' + key)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from leaves(child, f'{field}[{index}]')

# These are references to occurrences, NOT automatic semantic review decisions.
locations = []
for claim in claims:
    for unit in selected:
        if unit['path'] not in claim['articlePaths']:
            continue
        for record in unit['authoredRecords']:
            if record['locale'] != 'ja':
                continue
            for field, value in leaves(record['body']):
                if re.search(claim['matchPattern'], value, re.I):
                    locations.append({'claimId': claim['id'], 'path': unit['path'], 'locale': 'ja', 'field': field, 'text': value, 'wholeTextStatus': 'not-reviewed-in-full', 'scope': 'Only the narrow proposition in shared-claims.json has a source comparison; this match is a navigation aid.'})
dump('claim-locations.json', locations)

# Supplementary JSX content is outside the data-only census. Keep every file visible.
supplements = sorted(str(p) for p in Path('components').glob('*details.tsx'))
supplements += ['app/guide/[slug]/page.tsx', 'components/english-crash-guide.tsx']
supplement_queue = []
for file in supplements:
    text = Path(file).read_text()
    headings = re.findall(r'<h[23][^>]*>([^<]+)</h[23]>', text)
    supplement_queue.append({'file': file, 'sha256': hashlib.sha256(text.encode()).hexdigest(), 'headings': [' '.join(h.split()) for h in headings], 'status': 'not-reviewed-in-full', 'required': 'Compare all prose/table cells with primary sources, including cautions, limits, and differences from data records. Keyword screening is not completion.'})
dump('supplement-queue.json', supplement_queue)

registry = {}
for u in selected:
    for r in u['authoredRecords']:
        for s in r['sources']:
            url = s['url']
            if url not in registry:
                direct = [o for o in observations if o['url'] == url]
                registry[url] = {'url': url, 'acquisitionStatus': direct[0]['state'] if direct else 'not-attempted-this-batch', 'observationIds': [o['id'] for o in direct], 'referencedBy': []}
            registry[url]['referencedBy'].append({'path': u['path'], 'locale': r['locale']})
dump('source-queue.json', list(registry.values()))

articles = []
lines = ['# 第3バッチ：記事別の残作業', '', '対象は共通ガイド28・Windows記事19・Discord記事38の計85ページ群。以下のSTEP/原因見出しは残作業の具体的な入口であり、全体未確認です。共通主張の一部に根拠があってもSTEP全体を完了扱いにしません。', '']
for u in selected:
    groups = [c['id'] for c in claims if u['path'] in c['articlePaths']]
    ja = next(r for r in u['authoredRecords'] if r['locale'] == 'ja')
    steps = ja['body'].get('steps', ja['body'].get('causes', []))
    todo = [s.get('title', str(s)) if isinstance(s, dict) else s for s in steps]
    todo += ['要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合', '実在する翻訳variantの意味と対応UIを照合']
    if u['kind'] == 'common-guide':
        todo += ['app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）']
    unavailable = [r['url'] for r in registry.values() if r['acquisitionStatus'] == 'body-unavailable' and any(v['path'] == u['path'] for v in r['referencedBy'])]
    pending = [r['url'] for r in registry.values() if r['acquisitionStatus'] == 'not-attempted-this-batch' and any(v['path'] == u['path'] for v in r['referencedBy'])]
    entry = {'path': u['path'], 'title': ja['title'], 'status': 'partial-scoped-claims' if groups else 'not-started-semantic-review', 'scopedClaimIds': groups, 'wholePageVerified': False, 'remainingClaimGroups': todo, 'bodyUnavailableUrls': unavailable, 'notAttemptedUrls': pending, 'locales': [v['locale'] for v in u['variants']]}
    articles.append(entry)
    lines += ['## ' + u['path'], '', ja['title'], '', '共通根拠の対象: ' + (', '.join(groups) or '未着手'), '', '未完了の確認:', ''] + ['- ' + t for t in todo] + ['', f'本文取得不能URL: {len(unavailable)}。未取得URL: {len(pending)}。詳細は article-queue.json / source-queue.json.gz。', '']
dump('article-queue.json', articles)
(OUT / 'remaining-articles.md').write_text('\n'.join(lines))

all_pages = []
shared_facts = json.loads(Path('docs/evidence-audit-batch2-2026-10-05/shared-fact-topics.json').read_text())
for u in families:
    current = next((a for a in articles if a['path'] == u['path']), None)
    remaining = []
    if current:
        remaining = current['remainingClaimGroups']
    else:
        for record in u['authoredRecords']:
            body = record['body']
            for key in ['steps', 'causes', 'sections', 'items', 'games', 'faqs']:
                for value in body.get(key, []):
                    if isinstance(value, dict):
                        title = value.get('title') or value.get('question') or value.get('name')
                        if title:
                            remaining.append(record['locale'] + ': ' + key + ': ' + title)
            for key in ['targetVersion', 'quickFacts', 'conclusion', 'evidenceSummary']:
                if key in body:
                    remaining.append(record['locale'] + ': ' + key + ' の未検証の主張を一次情報と比較')
        if u['kind'] == 'game-hub':
            remaining += [f['id'] for f in shared_facts if any(o['path'] == u['path'] for o in f['occurrences'])]
            remaining += ['ハブ固有の紹介・保存先・機能・各言語本文を照合']
        if not remaining:
            topic = {
                '/about': '運営者・編集方針・連絡先の記載と実装/確認済み組織情報',
                '/privacy': 'localStorage、解析、広告、D1、保持期間の説明と実装',
                '/terms': 'サービス範囲・免責・利用条件と運用実態（法的妥当性の保証は別）',
                '/contact': '送信項目・個人情報・送信後の案内と実装',
                '/my': '保存範囲・端末同期の有無・削除・上限と実装（fixtureのみ）',
                '/my-games': '保存範囲・端末同期の有無・削除・上限と実装（fixtureのみ）',
                '/status': '各障害データの出典・更新時刻・未取得時の表示',
                '/tools/refresh-rate': '測定値とモニター仕様/実fpsの違い・測定制限',
                '/tools/save-locations': '各ゲーム保存先とクラウド連携条件（ゲーム別公式資料）',
                '/tools/windows-diagnosis': '取得項目・機密情報・ZIP内容・対応OS・実行手順',
            }.get(u['path'], u['path'] + '固有の説明・選択条件・記事要約を参照元本文と照合。共通ナビUIは事実数に加えない。')
            remaining = [topic]
    all_pages.append({'path': u['path'], 'kind': u['kind'], 'variants': u['variants'], 'currentBatch': current['status'] if current else 'outside-current-batch', 'wholePageVerified': False, 'remaining': remaining, 'priorReviewLedgers': ['../evidence-audit-2026-10-05/reviews.json', '../evidence-audit-batch2-2026-10-05/reviews.json']})
dump('all-212-page-queue.json', all_pages)
summary = {'pageFamilies': len(families), 'batchPageFamilies': len(selected), 'kinds': dict(Counter(u['kind'] for u in selected)), 'scopedSharedClaims': len(claims), 'candidateLocationsNotVerifiedParagraphs': len(locations), 'sourceObservations': dict(Counter(o['state'] for o in observations)), 'sourceReferenceQueue': dict(Counter(o['acquisitionStatus'] for o in registry.values())), 'articleStates': dict(Counter(a['status'] for a in articles)), 'wholePagesVerified': 0, 'confirmedContentCorrections': 1, 'correctedOccurrences': 2, 'supplementFilesPending': len(supplement_queue)}
dump('summary.json', summary)
assert len(families) == 212 and len(selected) == 85
assert all(c['sourceIds'] and all(any(o['id'] == s and o['state'] == 'body-read' for o in observations) for s in c['sourceIds']) for c in claims)
assert set(c['id'] for c in claims) == set(l['claimId'] for l in locations), 'Every scoped claim needs a local occurrence'
print(json.dumps(summary, ensure_ascii=False, indent=2))
