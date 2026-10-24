import assert from 'node:assert/strict';
import { readFile, writeFile, unlink, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';
async function load(contents) {
  const out = new URL('./.valorant-test-data.mjs', import.meta.url);
  const result = await build({
    stdin: { contents, resolveDir: process.cwd(), loader: 'ts' },
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    write: false,
  });
  try {
    await writeFile(out, result.outputFiles[0].contents);
    return await import(out.href + '?' + Math.random());
  } finally {
    await unlink(out);
  }
}
const {
  gameArticles,
  localizedArticles,
  valorantLaunchGuide,
  valorantVan9003Guide,
} = await load(
  "export {gameArticles} from './lib/game-articles';export {localizedArticles} from './lib/localized';export {valorantLaunchGuide} from './lib/followups/valorant-launch';export {valorantVan9003Guide} from './lib/followups/valorant-van9003';",
);
for (const [name, key, current] of [
  ['valorant-launch', 'valorantLaunchGuide', valorantLaunchGuide],
  ['valorant-van9003', 'valorantVan9003Guide', valorantVan9003Guide],
]) {
  const previous = (
    await load(
      execFileSync(
        'git',
        [
          'show',
          `d637523949e770434e35246f30f1de5ad2e617b7:lib/followups/${name}.ts`,
        ],
        { encoding: 'utf8' },
      ),
    )
  )[key];
  for (const lang of ['zh', 'es'])
    assert.deepEqual(
      current.copy[lang],
      previous.copy[lang],
      'Unrequested translations preserved',
    );
  for (const lang of ['ja', 'en'])
    assert.deepEqual(
      current.copy[lang].steps.map((x) => x.id),
      previous.copy[lang].steps.map((x) => x.id),
      'Existing STEP IDs preserved',
    );
}
const manifest = JSON.parse(
  await readFile('dist/editorial-snapshots.json', 'utf8'),
);
const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
const html = async (path) => readFile('dist/client' + manifest[path], 'utf8');
for (const slug of ['van9003', 'not-launching-no-van', 'stuck-loading']) {
  const ja = gameArticles.filter(
    (x) => x.gameSlug === 'valorant' && x.slug === slug,
  );
  assert.equal(ja.length, 1);
  const en = localizedArticles.filter(
    (x) => x.gameSlug === 'valorant' && x.slug === slug && x.locale === 'en',
  );
  assert.equal(en.length, 1);
  assert.equal(ja[0].checkedAt, '2026-10-24');
  assert.equal(en[0].checkedAt, ja[0].checkedAt);
  assert.deepEqual(
    ja[0].steps.map((x) => x.id),
    en[0].steps.map((x) => x.id),
  );
  assert.deepEqual(
    ja[0].sources.map((x) => x.url),
    en[0].sources.map((x) => x.url),
  );
  assert.ok(!/[ぁ-んァ-ヶ一-龯]/u.test(JSON.stringify(en[0])));
  for (const prefix of ['', '/en']) {
    const path = `${prefix}/games/valorant/${slug}`,
      page = await html(path),
      head = page.split('</head>')[0];
    assert.ok(
      head.includes(`rel="canonical" href="https://gemnao.pages.dev${path}"`),
      path,
    );
    for (const lang of ['ja', 'en'])
      assert.ok(
        head.includes(
          `hrefLang="${lang}" href="https://gemnao.pages.dev${lang === 'en' ? '/en' : ''}/games/valorant/${slug}"`,
        ),
      );
    for (const lang of ['zh-Hans', 'es'])
      assert.equal(
        head.includes(`hrefLang="${lang}"`),
        slug !== 'stuck-loading',
      );
    assert.ok(sitemap.includes(`<loc>https://gemnao.pages.dev${path}</loc>`));
    await access(`public/images/og${path}.png`);
    assert.ok(
      (await html(`${prefix}/games/valorant`)).includes(`href="${path}"`),
    );
    for (const step of ja[0].steps) assert.ok(page.includes(`id="${step.id}"`));
    assert.ok(page.includes('2026-10-24'));
    const links = [...page.matchAll(/href="([^"?#]+)(?:#[^"]*)?"/g)].map(
      (x) => x[1],
    );
    for (const link of links.filter((x) =>
      x.startsWith(prefix + '/games/valorant/'),
    ))
      assert.ok(manifest[link], `Missing article ${link}`);
    if (slug !== 'stuck-loading')
      assert.ok(page.includes(`href="${prefix}/games/valorant/stuck-loading"`));
  }
}
for (const locale of ['zh', 'es'])
  assert.equal(
    localizedArticles.find(
      (x) =>
        x.gameSlug === 'valorant' &&
        x.slug === 'van9003' &&
        x.locale === locale,
    ).checkedAt,
    '2026-10-13',
  );
const loading = localizedArticles.find(
  (x) => x.gameSlug === 'valorant' && x.slug === 'stuck-loading',
);
assert.match(JSON.stringify(loading), /July 2024/);
assert.match(JSON.stringify(loading), /does not cover every login failure/);
assert.match(JSON.stringify(loading), /Do not clear TPM/);
console.log(
  'PASS VALORANT: 6 JA/EN pages; 2 new, 4 updated; unique routes, preserved STEP IDs and ZH/ES content/dates, source/date parity, English text, canonical/hreflang/sitemap/OG, hub and reciprocal links, scoped patch and safety language.',
);
