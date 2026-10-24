import assert from 'node:assert/strict';
import { readFile, writeFile, unlink, access } from 'node:fs/promises';
import { build } from 'esbuild';
const output = new URL('./.bf6-update-data.mjs', import.meta.url);
const bundle = await build({
  stdin: {
    contents:
      "export {bf6UpdateIssues,bf6UpdateIssuesEn} from './lib/bf6-update-issues';export {gameArticles} from './lib/game-articles';",
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  write: false,
});
let data;
try {
  await writeFile(output, bundle.outputFiles[0].contents);
  data = await import(output.href);
} finally {
  await unlink(output);
}
const { bf6UpdateIssues: ja, bf6UpdateIssuesEn: en, gameArticles } = data;
assert.equal(ja.length, 2);
assert.equal(en.length, 2);
const manifest = JSON.parse(
  await readFile('dist/editorial-snapshots.json', 'utf8'),
);
const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
const game = '/games/battlefield-6';
const html = async (path) => readFile('dist/client' + manifest[path], 'utf8');
for (const a of ja) {
  const b = en.find((x) => x.slug === a.slug);
  assert.ok(b);
  assert.equal(
    gameArticles.filter((x) => x.gameSlug === a.gameSlug && x.slug === a.slug)
      .length,
    1,
  );
  assert.deepEqual(
    a.steps.map((x) => x.id),
    b.steps.map((x) => x.id),
  );
  assert.deepEqual(
    a.sources.map((x) => x.url),
    b.sources.map((x) => x.url),
  );
  assert.equal(a.checkedAt, '2026-10-24');
  assert.equal(b.checkedAt, a.checkedAt);
  assert.ok(!/[ぁ-んァ-ヶ一-龯]/u.test(JSON.stringify(b)));
  for (const prefix of ['', '/en']) {
    const path = prefix + game + '/' + a.slug,
      page = await html(path),
      head = page.split('</head>')[0];
    assert.ok(
      head.includes(`rel="canonical" href="https://gemnao.pages.dev${path}"`),
      path,
    );
    for (const lang of ['ja', 'en'])
      assert.ok(
        head.includes(
          `hrefLang="${lang}" href="https://gemnao.pages.dev${lang === 'en' ? '/en' : ''}${game}/${a.slug}"`,
        ),
      );
    for (const lang of ['zh', 'es'])
      assert.ok(
        !head.includes(`hrefLang="${lang}"`),
        'No invented translation',
      );
    assert.ok(sitemap.includes(`<loc>https://gemnao.pages.dev${path}</loc>`));
    assert.ok(head.includes('property="og:image"'));
    await access('public/images/og' + path + '.png');
    assert.ok(page.includes('2026-10-24'));
    assert.ok(page.includes(a.sources[0].url));
    for (const step of a.steps) assert.ok(page.includes(`id="${step.id}"`));
    for (const other of ja.filter((x) => x.slug !== a.slug))
      assert.ok(page.includes(`href="${prefix + game}/${other.slug}"`));
    assert.ok(page.includes(`href="${prefix + game}/javelin-error-94"`));
    assert.ok(
      (await html(prefix + game)).includes(`href="${path}"`),
      'Hub must link to article',
    );
    assert.ok(
      (await html(prefix + game + '/javelin-error-94')).includes(
        `href="${path}"`,
      ),
      'Existing error-guide return link',
    );
  }
}
assert.match(en.find((x) => x.slug === 'cannot-revive').summary, /October 16/);
assert.match(
  en.find((x) => x.slug === 'cannot-revive').summary,
  /later confirmed fix was not verified/,
);
assert.match(
  en.find((x) => x.slug === 'crash-after-update').summary,
  /Vegas Strip and Area 51/,
);
assert.match(
  JSON.stringify(en.find((x) => x.slug === 'crash-after-update')),
  /does not specify a version number/,
);
console.log(
  'PASS BF6: four built JA/EN pages; unique routes, STEP/source/date parity, English text, canonical, reciprocal hreflang, sitemap, OG, hub and existing-guide links; dated investigation and limited hotfix scope.',
);
