"""Inspect built article prose; signals are review candidates, never verified test results."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path

class Prose(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = 0
        self.block = None
        self.blocks = []
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'): self.skip += 1
        if not self.skip and tag in ('p','li','td','h2','h3') and self.block is None:
            self.block = {'tag': tag, 'parts': []}
    def handle_data(self, text):
        if self.block is not None and not self.skip: self.block['parts'].append(text)
    def handle_endtag(self, tag):
        if self.block is not None and tag == self.block['tag']:
            self.blocks.append(' '.join(''.join(self.block['parts']).split()))
            self.block = None
        if tag in ('script','style'): self.skip = max(0,self.skip-1)

folder = Path('docs/search-evidence-2026-10-25')
rows = json.loads((folder/'article-inventory.json').read_text())['articles']
# Manually classified against the quoted built prose, not inferred from a keyword match.
article_limit_paths = {
 '/games/elden-ring-nightreign/dlc-not-working',
 '/games/marvel-rivals/login-error', '/games/marvel-rivals/high-ping',
 '/games/ace-combat-8/hotas-not-recognized', '/games/ace-combat-8/stutter-audio-cutting-out',
 '/games/apex-legends/game-version-mismatch', '/games/overwatch-2/rendering-device-lost',
 '/games/pubg/anti-cheat-conflict-warning', '/games/apex-legends/javelin-launch-error',
 '/games/valorant/van-restriction-5', '/games/valorant/van9005',
 '/games/monster-hunter-wilds/crash-after-fixes', '/games/ace-combat-8/crashing-memory',
 '/games/planet-zoo-2/crashing-autosave', '/games/gears-of-war-e-day/achievements-rewards',
 '/games/wardogs/error-wd-l020',
 '/games/call-of-duty-modern-warfare-4/xbox-pc-launch-button',
 '/games/call-of-duty-modern-warfare-4/loadout-not-saving',
 '/games/call-of-duty-modern-warfare-4/stats-not-showing',
 '/games/enshrouded/black-screen-save-migration',
 '/games/battlefield-6/crash-after-update', '/games/battlefield-6/cannot-revive',
 '/guide/steam-input-controller', '/guide/save-data-backup', '/guide/reshade-uninstall',
 '/guide/reset-config-file', '/guide/shader-cache-delete', '/guide/uninstall-save-data',
 '/discord/upload-failed', '/discord/mic-volume-low',
}
example_limit_paths = {
 '/games/aniimo/video-memory-error', '/games/ace-combat-8/error-st-3100001',
 '/guide/low-gpu-usage', '/guide/pc-game-freezes', '/guide/pc-game-crash',
 '/guide/gpu-driver-update', '/guide/stutter-fix', '/guide/low-fps',
 '/guide/vram-shortage', '/guide/steam-disk-write-error',
 '/discord/error-1002', '/discord/error-1003', '/discord/overlay-not-showing',
 '/discord/bluetooth-audio-problem', '/discord/game-not-detected',
 '/discord/user-volume-low', '/discord/voice-client-outdated',
}
results = []
for row in rows:
    html = Path('dist/server/prerendered-routes') / (row['path'].lstrip('/')+'.html')
    parser = Prose()
    if html.exists(): parser.feed(html.read_text())
    signals = [s for s in parser.blocks if re.search(r'実機|実測|本人報告|独立.{0,5}再現|未検証|検証結果|改善報告',s)]
    signals = list(dict.fromkeys(signals))
    if row['scope'] != 'not-reviewed-this-change':
        classification = 'scoped-evidence-record-present'
        gap = '今回4件と既存Rocket League。記録に示す制限を保持。全環境の実機検証済みではない。'
    elif row['family'] == 'pc' or row['path'] in article_limit_paths:
        classification = 'basic-structure-and-article-limit-disclosure-present'
        gap = '結論・手順・出典に加え、実機結果ではない／実機での効果を確認していない等の本文説明あり。説明が示す範囲は下記引用どおり。版ごとの再現記録・最新性の個別監査は別途必要。'
    elif row['path'] in example_limit_paths:
        classification = 'basic-structure-and-partial-limit-disclosure-present'
        gap = '数値例・利用者報告・商品仕様紹介の一部に限界の明記あり。これを記事全体の検証状況に拡大できない。残る手順の根拠範囲と対象版は個別監査が必要。'
    else:
        classification = 'basic-structure-present-evidence-separation-needs-review'
        gap = '結論・操作手順・出典は存在。記録された実測結果／一般の期待結果／未検証範囲のまとまった説明を今回の抽出・確認では認定していない。不存在の断定ではなく個別監査の対象。'
    results.append({
        'path':row['path'], 'family':row['family'], 'classification':classification,
        'basicStructure':{'answer':row['conclusion'],'actions':row['actionCount'],'sourceCount':len(row['effectiveSources'])},
        'declaredScope':row['declaredScope'],
        'scopeFieldGap':None if row['declaredScope'] else '専用フィールドなし。本文中の対象記述の不存在を意味しない。',
        'existingEvidenceSummary':row['existingEvidenceSummary'],
        'renderedHtmlInspected':html.exists(),
        'evidenceLanguageCandidates':signals,
        'assessment':gap,
        'verification':'構造の確認のみ。候補文の真偽・再現性・最新性の検証ではない。'
    })
(folder/'structure-review.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
from collections import Counter
print(json.dumps({'total':len(results),'rendered':sum(r['renderedHtmlInspected'] for r in results),'classifications':dict(Counter(r['classification'] for r in results)),'candidates':sum(bool(r['evidenceLanguageCandidates']) for r in results)},ensure_ascii=False,indent=2))
