import assert from 'node:assert/strict';
import { build } from 'esbuild';
const result = await build({ stdin: { contents: "export {games} from './lib/games'; export {troubleHubs} from './lib/trouble-hubs'; export {localizedHubs} from './lib/localized/hubs'; export {gameFacts} from './lib/localized/game-facts'; export {codMw4Articles} from './lib/cod-mw4-articles'; export {tpmSecureBootGuide} from './lib/requirement-guides';", resolveDir: process.cwd() }, bundle: true, write: false, platform: 'node', format: 'esm' });
const {games,troubleHubs,localizedHubs,gameFacts,codMw4Articles,tpmSecureBootGuide} = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const hd = games.find(g=>g.slug==='helldivers-2');
assert.match(hd.specs.storage,/Steam.*135GB.*40GB.*PlayStation.*100GB/);
assert.match(hd.specs.storage,/断定せず.*インストール・更新/);
assert.ok(hd.sources.some(s=>s.url==='https://www.playstation.com/ja-jp/games/helldivers-2/pc/'));
for(const locale of ['en','zh','es']) {
 const intro=localizedHubs['helldivers-2'].intro[locale];
 for(const value of ['135 GB','40 GB','100 GB','Steam','PlayStation']) assert.ok(intro.includes(value),`${locale}: ${value}`);
}
assert.equal(gameFacts['helldivers-2'].minimum.storage,'135 GB');
assert.equal(gameFacts['helldivers-2'].recommended.storage,'—');
assert.equal(games.find(g=>g.slug==='wardogs').japanese,'Steamの掲載では日本語インターフェースに対応。');
const cod=games.find(g=>g.slug==='call-of-duty-modern-warfare-4');
const article=codMw4Articles.find(a=>a.slug==='tpm-secure-boot');
assert.match(cod.launchFixes.join(' '),/Activisionアカウント.*必要な場合/);
assert.match(article.conclusion,/Activisionアカウント.*必要な場合/);
const phone=article.steps.find(s=>s.id==='step-6');
assert.match(phone.summary,/Steam.*現在の表示/);
assert.match(phone.actions[1],/求められる場合/);
for(const text of [cod.launchFixes[2],article.steps.find(s=>s.id==='step-5').actions[0],tpmSecureBootGuide.steps.find(s=>s.title==='有効にしたのにゲームで要件を満たさないと出る場合').actions[0]]) {
 for(const condition of ['公式ランチャー','通常起動','CODBrokerInstaller.exe','enrollaik.exe','発行元','不明な実行ファイル','許可しない']) assert.ok(text.includes(condition),condition);
}
assert.deepEqual(article.steps.map(s=>s.id),['step-1','step-2','step-3','step-4','step-5','step-6']);
const mod=troubleHubs.find(h=>h.slug==='mod');
assert.match(mod.quickChecks.join(' '),/管理ツール・手動・ワークショップ.*自分で追加したと確認できたファイルだけ/);
assert.match(mod.quickChecks.join(' '),/タイトル画面まで.*既存セーブ.*上書きしない/);
assert.deepEqual(mod.guideSlugs,['remove-mods-safely','reshade-uninstall','save-data-backup']);
console.log('PASS: storage discrepancy in JA/EN/ZH/ES, WARDOGS interface scope, conditional account-specific phone checks, verified-origin UAC, install-method MOD isolation and save preservation; stable STEP IDs and links');

assert.ok(!hd.launchFixes.join(' ').includes('GameGuardフォルダを削除'));
assert.match(hd.launchFixes.join(' '),/該当エラーのArrowhead公式手順.*未特定.*削除しない/);
assert.match(games.find(g=>g.slug==='wardogs').launchFixes.join(' '),/通常の混雑.*公式が更新・再起動.*優先/);
console.log('PASS: GameGuard support-scoped non-destructive checks and official-update exception to WARDOGS queue waiting');
