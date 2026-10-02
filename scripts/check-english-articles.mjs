// Post-build regression: five complete English articles and their Japanese pairs.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isEditorialSnapshotPath } from '../cloudflare/prerender-policy.mjs';

const manifest = JSON.parse(
  await readFile('dist/editorial-snapshots.json', 'utf8'),
);
const prerender = JSON.parse(
  await readFile('dist/server/vinext-prerender.json', 'utf8'),
);
const knownPaths = new Set(
  prerender.routes
    .filter(
      (route) =>
        route.status === 'rendered' ||
        (route.reason === 'dynamic' && !route.route.includes(':')),
    )
    .map((route) => route.path || route.route),
);
const paths = [
  '/gear/save-backup-storage-guide',
  '/gear/discord-microphone-guide',
  '/guide/pc-game-crash',
  '/games/monster-hunter-wilds/not-launching',
  '/games/ace-combat-8/error-st-3100001',
];
const htmlFor = async (path) => {
  assert.ok(manifest[path], `Missing editorial snapshot: ${path}`);
  return readFile(`dist/client${manifest[path]}`, 'utf8');
};
let links = 0;
for (const original of paths) {
  const english = `/en${original}`;
  assert.ok(isEditorialSnapshotPath(english), english);
  for (const path of [original, english]) {
    const html = await htmlFor(path);
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
    assert.equal(
      new URL(head.match(/rel="canonical" href="([^"]+)"/)?.[1]).pathname,
      path,
    );
    assert.ok(!/name="robots" content="[^"]*noindex/.test(head), path);
    for (const [language, target] of [
      ['ja', original],
      ['en', english],
      ['x-default', original],
    ]) {
      const tag = [...head.matchAll(/<link\b[^>]*>/g)]
        .map((m) => m[0])
        .find((tag) => new RegExp(`hrefLang="${language}"`, 'i').test(tag));
      assert.ok(tag, `${path}: missing ${language}`);
      assert.equal(new URL(tag.match(/href="([^"]+)"/)?.[1]).pathname, target);
    }
    const menu =
      html.match(/<details class="language-menu">([\s\S]*?)<\/details>/)?.[1] ||
      '';
    assert.ok(
      menu.includes(`href="${path === original ? english : original}"`),
      `Reciprocal switch: ${path}`,
    );
    if (path === original) continue;
    assert.match(html, /<html lang="en"/);
    assert.match(html, /<main lang="en"/);
    assert.match(head, /property="og:locale" content="en_US"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.ok(head.includes(`/images/og${english}.png`), `English OG: ${path}`);
    await readFile(`public/images/og${english}.png`);
    const schemas = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ].flatMap((m) => {
      const json = JSON.parse(m[1]);
      return Array.isArray(json) ? json : json['@graph'] || [json];
    });
    assert.ok(
      schemas.some(
        (schema) =>
          schema.inLanguage === 'en' &&
          schema.mainEntityOfPage === `https://gemnao.pages.dev${path}`,
      ),
      `English schema: ${path}`,
    );
    const visible = html
      .replace(/<details class="language-menu">[\s\S]*?<\/details>/g, '')
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<[^>]+>/g, ' ');
    assert.ok(
      !/[ぁ-んァ-ヶ一-龯]/u.test(visible),
      `Untranslated text: ${path}`,
    );
    assert.ok(
      visible.length > 5000,
      `Suspiciously incomplete article: ${path}`,
    );
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)) {
      const href = match[1].replaceAll('&amp;', '&');
      if (!href.startsWith('/') && !href.startsWith('#')) continue;
      const url = new URL(href, `https://gemnao.pages.dev${path}`);
      const target = url.pathname.replace(/\/$/, '') || '/';
      assert.ok(knownPaths.has(target), `${path}: missing ${href}`);
      if (url.hash && manifest[target])
        assert.ok(
          (await htmlFor(target)).includes(
            `id="${decodeURIComponent(url.hash.slice(1))}"`,
          ),
          `${path}: missing anchor ${href}`,
        );
      links++;
    }
  }
}
const microphone = await htmlFor('/en/gear/discord-microphone-guide');
assert.match(microphone, /amazon\.co\.jp\/dp\/B08H6X6G28/);
assert.match(microphone, /rel="sponsored nofollow noopener"/);
assert.ok(
  microphone.includes('Amazon Japan') &&
    microphone.includes('As an Amazon Associate'),
);
assert.ok(
  microphone.indexOf('id="before-buying"') <
    microphone.indexOf('data-affiliate-asin'),
);
assert.ok(!/AggregateRating|ratingValue/.test(microphone));
const storage = await htmlFor('/en/gear/save-backup-storage-guide');
assert.ok(!storage.includes('data-affiliate-asin'));
assert.ok(
  storage.includes('You do not need new hardware') &&
    storage.includes('Matching counts and sizes alone'),
);
const wilds = await htmlFor('/en/games/monster-hunter-wilds/not-launching');
for (const required of [
  'one anonymous user report',
  'System32',
  'unverified',
  'Two loaders were temporarily disabled together',
  'Risk: high',
  'do not re-enable extensions',
  'external cloud storage',
  'not a publisher-endorsed fix',
])
  assert.ok(wilds.includes(required), required);
const ace = await htmlFor('/en/games/ace-combat-8/error-st-3100001');
assert.ok(ace.includes('ACE COMBAT 8 (Japanese)'));
assert.ok(ace.includes('correct time zone for your location'));
assert.ok(!ace.includes('href="/en/games/ace-combat-8"'));
for (const path of [
  '/en/games/ace-combat-8',
  '/zh/guide/pc-game-crash',
  '/es/gear/discord-microphone-guide',
  '/en/guide/save-data-backup',
  '/en/games/monster-hunter-wilds/system-requirements',
])
  assert.ok(!manifest[path], `Invented translation: ${path}`);
const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
for (const original of paths)
  assert.ok(
    sitemap.includes(`https://gemnao.pages.dev/en${original}</loc>`),
    original,
  );
const home = await htmlFor('/en');
for (const original of paths)
  assert.ok(
    home.includes(`href="/en${original}"`),
    `English home discovery: ${original}`,
  );
assert.ok(home.includes('href="/en/tools/windows-diagnosis"'));
console.log(
  `PASS: 5 complete English articles; reciprocal metadata/menu, language/schema/OG/sitemap, ${links} internal links and anchors, safe case wording, existing Japan affiliate and no phantom translations`,
);
