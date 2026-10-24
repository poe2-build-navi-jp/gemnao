import assert from 'node:assert/strict';
import { readFile, writeFile, unlink, access } from 'node:fs/promises';
import { build } from 'esbuild';
async function load(contents) {
  const path = new URL('./.ens-test.mjs', import.meta.url);
  const r = await build({
    stdin: { contents, resolveDir: process.cwd(), loader: 'ts' },
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
  });
  try {
    await writeFile(path, r.outputFiles[0].contents);
    return await import(path.href + '?' + Math.random());
  } finally {
    await unlink(path);
  }
}
const data = await load("export * from './lib/enshrouded-articles';");
assert.equal(data.enshroudedArticles.length, 1);
assert.equal(data.enshroudedArticlesEn.length, 1);
const ja = data.enshroudedArticles[0],
  en = data.enshroudedArticlesEn[0];
assert.deepEqual(
  ja.sources.map((x) => x.url),
  en.sources.map((x) => x.url),
);
assert.deepEqual(
  ja.steps.map((x) => x.id),
  en.steps.map((x) => x.id),
);
assert.equal(ja.checkedAt, '2026-10-24');
assert.equal(en.checkedAt, ja.checkedAt);
assert.ok(!/[ぁ-んァ-ヶ一-龯]/u.test(JSON.stringify(en)));
assert.match(en.summary, /rare crash during save migration/);
assert.match(JSON.stringify(en), /1273043/);
const manifest = JSON.parse(
  await readFile('dist/editorial-snapshots.json', 'utf8'),
);
const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
const html = (p) => readFile('dist/client' + manifest[p], 'utf8');
for (const prefix of ['', '/en']) {
  const path = prefix + '/games/enshrouded/black-screen-save-migration',
    page = await html(path),
    head = page.split('</head>')[0];
  assert.ok(
    head.includes(`rel="canonical" href="https://gemnao.pages.dev${path}"`),
  );
  for (const lang of ['ja', 'en'])
    assert.ok(
      head.includes(
        `hrefLang="${lang}" href="https://gemnao.pages.dev${lang === 'en' ? '/en' : ''}/games/enshrouded/black-screen-save-migration"`,
      ),
    );
  for (const lang of ['zh-Hans', 'es'])
    assert.ok(!head.includes(`hrefLang="${lang}"`));
  assert.ok(sitemap.includes(`<loc>https://gemnao.pages.dev${path}</loc>`));
  await access('public/images/og' + path + '.png');
  for (const step of ja.steps) assert.ok(page.includes(`id="${step.id}"`));
  assert.ok(
    page.includes('1.0.0.3') &&
      page.includes('1273043') &&
      page.includes('2026-10-24'),
  );
  assert.ok(
    (await html(prefix + '/games/enshrouded')).includes(`href="${path}"`),
  );
  for (const slug of ['save-data-backup', 'pc-game-crash']) {
    assert.ok(page.includes(`href="${prefix}/guide/${slug}"`));
    assert.ok(manifest[prefix + '/guide/' + slug]);
  }
}
console.log(
  'PASS Enshrouded: JA/EN source and STEP parity, version and date, built canonical/hreflang/sitemap/OG, hub and safe-guide links.',
);
