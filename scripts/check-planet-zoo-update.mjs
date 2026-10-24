import assert from 'node:assert/strict';
import { readFile, writeFile, unlink, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';
async function load(contents) {
  const path = new URL('./.pz-test.mjs', import.meta.url);
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
const data = await load("export * from './lib/october-stability-articles';");
const old = await load(
  execFileSync(
    'git',
    [
      'show',
      '7acc9239faf11a6e897dc1c5ed94764a6504ed56:lib/october-stability-articles.ts',
    ],
    { encoding: 'utf8' },
  ),
);
for (const key of ['octoberStabilityArticles', 'octoberStabilityArticlesEn']) {
  assert.deepEqual(
    data[key].filter((x) => x.gameSlug !== 'planet-zoo-2'),
    old[key].filter((x) => x.gameSlug !== 'planet-zoo-2'),
    'Unrelated ACE article unchanged',
  );
  const a = data[key].find((x) => x.gameSlug === 'planet-zoo-2'),
    b = old[key].find((x) => x.gameSlug === 'planet-zoo-2');
  assert.equal(a.slug, b.slug);
  assert.deepEqual(
    a.steps.map((x) => x.id),
    b.steps.map((x) => x.id),
  );
  assert.equal(a.checkedAt, '2026-10-24');
}
const ja = data.octoberStabilityArticles.find(
  (x) => x.gameSlug === 'planet-zoo-2',
);
const en = data.octoberStabilityArticlesEn.find(
  (x) => x.gameSlug === 'planet-zoo-2',
);
assert.deepEqual(
  ja.sources.map((x) => x.url),
  en.sources.map((x) => x.url),
);
assert.deepEqual(
  ja.steps.map((x) => x.id),
  en.steps.map((x) => x.id),
);
assert.ok(!/[ぁ-んァ-ヶ一-龯]/u.test(JSON.stringify(en)));
assert.match(
  en.steps[2].summary,
  /1.0.6 is installed but 1.0.7 cannot be downloaded/,
);
assert.match(en.faqs[0].answer, /does not guarantee recovery/);
const manifest = JSON.parse(
  await readFile('dist/editorial-snapshots.json', 'utf8'),
);
const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
const html = (p) => readFile('dist/client' + manifest[p], 'utf8');
for (const prefix of ['', '/en']) {
  const path = prefix + '/games/planet-zoo-2/crashing-autosave',
    page = await html(path),
    head = page.split('</head>')[0];
  assert.ok(
    head.includes(`rel="canonical" href="https://gemnao.pages.dev${path}"`),
  );
  for (const lang of ['ja', 'en'])
    assert.ok(
      head.includes(
        `hrefLang="${lang}" href="https://gemnao.pages.dev${lang === 'en' ? '/en' : ''}/games/planet-zoo-2/crashing-autosave"`,
      ),
    );
  for (const lang of ['zh-Hans', 'es'])
    assert.ok(!head.includes(`hrefLang="${lang}"`));
  assert.ok(sitemap.includes(`<loc>https://gemnao.pages.dev${path}</loc>`));
  await access('public/images/og' + path + '.png');
  for (const step of ja.steps) assert.ok(page.includes(`id="${step.id}"`));
  assert.ok(
    page.includes('1.0.6') &&
      page.includes('1.0.7') &&
      page.includes('2026-10-24'),
  );
  assert.ok(
    (await html(prefix + '/games/planet-zoo-2')).includes(`href="${path}"`),
  );
  for (const slug of ['steam-cloud-sync-error', 'pc-game-crash']) {
    assert.ok(page.includes(`href="${prefix}/guide/${slug}"`));
    assert.ok(manifest[prefix + '/guide/' + slug]);
  }
}
console.log(
  'PASS Planet Zoo 2: existing JA/EN URLs and STEP IDs, unrelated ACE data preserved; source parity, conditional workaround, limited save reassurance, built canonical/hreflang/sitemap/OG and hub/guide links.',
);
