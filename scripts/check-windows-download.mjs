import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
const artifact = (name, bytes, sha256) => {
  const zip = readFileSync(`public/downloads/${name}`);
  assert.equal(zip.length, bytes);
  assert.equal(createHash('sha256').update(zip).digest('hex'), sha256);
  assert.ok(
    readFileSync('cloudflare/worker-source.mjs', 'utf8').includes(
      `'/downloads/${name}'`,
    ),
  );
};
artifact(
  'gemnao-wilds-diagnosis-0.4.0-windows-x64.zip',
  192536,
  'bc39326824f113ab61abd590403432e9743a7edb1a3cbef644c30ac2f379e229',
);
artifact(
  'gemnao-game-diagnosis-0.5.0-windows-x64.zip',
  210897,
  '88023049dee7e92aad94f6d6653b4a63e2eedf3a086e0bb6e5ca8058a4cdaaa0',
);
const bundled = await build({
  entryPoints: ['lib/windows-diagnosis-release.ts'],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
});
const { windowsDiagnosisRelease: release } = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`
);
if (release) {
  assert.notEqual(release.version, '0.4.0');
  assert.ok(release.languages.includes('ja'));
  assert.ok(
    Number.isInteger(release.syntheticTests) && release.syntheticTests > 0,
  );
  if (release.languages.includes('en'))
    assert.notEqual(release.version, '0.5.0');
  artifact(release.file, release.bytes, release.sha256);
}
const page = readFileSync('app/tools/windows-diagnosis/page.tsx', 'utf8');
for (const required of [
  'PCゲーム診断ツール',
  '未署名',
  '全ゲーム',
  'Windows実機検証',
  '起動しない',
  'クラッシュ・落ちる',
  '黒画面',
  'フリーズ',
  '低FPS',
  'カクつき',
  '任意',
  'Webの報告受付は準備中',
  '完全匿名ではありません',
  'すべて展開',
  'Gemnao.Diagnostics.exe',
  '0.4.0はワイルズ専用の旧版',
])
  assert.ok(page.includes(required), required);
assert.ok(
  readFileSync('components/wiki-home.tsx', 'utf8').includes(
    '/tools/windows-diagnosis',
  ),
);
assert.ok(
  readFileSync('components/troubleshooting-article.tsx', 'utf8').includes(
    '/tools/windows-diagnosis',
  ),
);
assert.ok(
  readFileSync('app/tools/page.tsx', 'utf8').includes(
    '/tools/windows-diagnosis',
  ),
);
assert.ok(
  readFileSync('app/sitemap.ts', 'utf8').includes('/tools/windows-diagnosis'),
);
assert.ok(page.includes('/guide/pc-game-freezes'));
assert.ok(!page.includes('/guide/game-freeze'));
console.log(
  `General diagnosis guide, artifact identity and routing passed; release ${release?.version ?? 'not yet published'}`,
);
