import assert from 'node:assert/strict';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { build } from 'esbuild';

const bundle = await build({
  stdin: {
    contents: `import { createElement } from 'react'; import { renderToStaticMarkup } from 'react-dom/server'; import { OnimushaSaveAnswer } from './components/onimusha-save-answer'; export const html = [false, true].map(english => renderToStaticMarkup(createElement(OnimushaSaveAnswer, { english })));`,
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  packages: 'external',
});
const temporary = new URL('./.onimusha-save-answer-check.mjs', import.meta.url);
let html;
try {
  await writeFile(temporary, bundle.outputFiles[0].text);
  ({ html } = await import(temporary.href));
} finally {
  await unlink(temporary);
}
for (const page of html) {
  assert.equal(page.split('id="save-method"').length - 1, 1);
  assert.ok(page.includes('https://game8.jp/onimusha-ws/813817'));
  assert.ok(!/20 (manual|save)|20個/.test(page));
  assert.ok(!page.includes('win64_save'));
}
assert.match(html[0], /破魔鏡/);
assert.match(html[0], /オートセーブの発生条件は未検証/);
assert.match(html[0], /当サイトの実機プレイ検証ではありません/);
assert.match(html[1], /not our own gameplay test/);
assert.ok(!/[ぁ-んァ-ヶ一-龯]/u.test(html[1]));

if (process.argv.includes('--built')) {
  const manifest = JSON.parse(
    await readFile('dist/editorial-snapshots.json', 'utf8'),
  );
  for (const locale of ['', '/en']) {
    const path = `${locale}/games/onimusha-way-of-the-sword`;
    const page = await readFile(`dist/client${manifest[path]}`, 'utf8');
    assert.equal(page.split('id="save-method"').length - 1, 1);
    assert.ok(page.includes('href="#save-method"'));
    assert.ok(page.includes('https://game8.jp/onimusha-ws/813817'));
    assert.ok(
      page.includes(`rel="canonical" href="https://gemnao.pages.dev${path}"`),
    );
    assert.ok(page.includes('application/ld+json'));
    assert.ok(page.includes('og:image'));
  }
}
console.log(
  'PASS: sourced Japanese/English save answers, explicit evidence boundaries, unique anchors, optional built canonical and metadata',
);
