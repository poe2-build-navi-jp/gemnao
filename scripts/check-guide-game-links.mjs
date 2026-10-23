import assert from 'node:assert/strict';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { build } from 'esbuild';
const result = await build({
  stdin: {
    contents: `export {gameArticlesForGuide, guideGamePaths} from './lib/guide-game-links'; export {commonGuides} from './lib/common-guides'; export {gameArticles} from './lib/game-articles';`,
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const temporary = new URL(
  '../node_modules/.guide-game-links.mjs',
  import.meta.url,
);
let data;
try {
  await writeFile(temporary, result.outputFiles[0].text);
  data = await import(temporary.href);
} finally {
  await unlink(temporary);
}
const {
  gameArticlesForGuide: select,
  guideGamePaths: paths,
  commonGuides,
  gameArticles,
} = data;
const pathOf = (a) => `${a.gameSlug}/${a.slug}`;
assert.deepEqual(select('unknown'), []);
assert.deepEqual(select('stutter-fix', []), []);
const vram = select('vram-shortage')[0];
for (const status of ['draft', 'thin'])
  assert.deepEqual(select('vram-shortage', [{ ...vram, status }]), []);
assert.deepEqual(select('vram-shortage').map(pathOf), [
  'aniimo/video-memory-error',
]);
assert.deepEqual(select('shader-cache-delete').map(pathOf), [
  'onimusha-way-of-the-sword/shader-cache',
  'the-blood-of-dawnwalker/shader-compilation-crash',
]);
assert.deepEqual(select('steam-cloud-sync-error').map(pathOf), [
  'stardew-valley/save-restore',
  'palworld/save-data',
]);
for (const guide of commonGuides) {
  assert.ok(
    Object.hasOwn(paths, guide.slug),
    `Review new guide: ${guide.slug}`,
  );
  const chosen = select(guide.slug);
  assert.deepEqual(
    chosen.map(pathOf),
    paths[guide.slug],
    `Missing/unpublished candidate: ${guide.slug}`,
  );
  assert.deepEqual(
    select(guide.slug, [...gameArticles].reverse()).map(pathOf),
    paths[guide.slug],
  );
  assert.equal(new Set(chosen.map(pathOf)).size, chosen.length);
  for (const a of chosen) assert.match(a.title, /[ぁ-んァ-ヶ一-龯]/u);
}
if (process.argv.includes('--built')) {
  const manifest = JSON.parse(
    await readFile('dist/editorial-snapshots.json', 'utf8'),
  );
  for (const guide of commonGuides) {
    const html = await readFile(
      `dist/client${manifest['/guide/' + guide.slug]}`,
      'utf8',
    );
    const section = html.match(
      /<section class="related-section"><h2>ゲーム別の対処法<\/h2>(.*?)<\/section>/s,
    )?.[1];
    const expected = select(guide.slug).map((a) => '/games/' + pathOf(a));
    assert.equal(!!section, !!expected.length, guide.slug);
    assert.deepEqual(
      [...(section?.matchAll(/href="([^"]+)"/g) ?? [])].map((m) => m[1]),
      expected,
      guide.slug,
    );
    for (const path of expected)
      assert.ok(manifest[path], `Missing built target ${path}`);
    const general = html.match(
      /<section class="related-section" id="related-guides">(.*?)<\/section>/s,
    )?.[1];
    assert.deepEqual(
      [...general.matchAll(/href="([^"]+)"/g)].map((m) => m[1]),
      guide.related.map((s) => '/guide/' + s),
    );
  }
}
console.log(
  `PASS: ${commonGuides.length} guides; exact symptom candidates, stable order, Japanese titles, draft/thin/missing/empty handling${process.argv.includes('--built') ? ', built links and unchanged general recommendations' : ''}`,
);
