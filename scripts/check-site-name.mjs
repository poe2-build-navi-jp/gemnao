import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const manifest = JSON.parse(
  await readFile('dist/editorial-snapshots.json', 'utf8'),
);
const read = async (path) => {
  if (path === '/') {
    const origin = process.env.TEST_ORIGIN;
    assert.ok(
      origin && /^http:\/\/127\.0\.0\.1:\d+$/.test(origin),
      'Use a local built server via TEST_ORIGIN',
    );
    const response = await fetch(origin + '/');
    assert.equal(response.status, 200);
    return response.text();
  }
  return readFile(
    manifest[path]
      ? 'dist/client' + manifest[path]
      : 'dist/server/prerendered-routes' + path + '.html',
    'utf8',
  );
};
for (const path of [
  '/',
  '/en',
  '/zh',
  '/es',
  '/about',
  '/en/about',
  '/games/valorant/van9003',
]) {
  const html = await read(path);
  const objects = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ].flatMap((m) => {
    const d = JSON.parse(m[1]);
    return d['@graph'] || [d];
  });
  const sites = objects.filter((x) => x['@type'] === 'WebSite');
  assert.equal(sites.length, 1, path);
  const site = sites[0];
  assert.equal(site.name, 'ゲムなお');
  assert.deepEqual(site.alternateName, ['げむなお', 'Gemnao']);
  assert.equal(site.url, 'https://gemnao.pages.dev');
  assert.equal(site['@id'], site.url + '/#website');
  const owner = objects.find((x) => x['@id'] === site.publisher['@id']);
  assert.equal(owner.name, 'オカピ研究所');
  assert.equal(owner.alternateName, 'Okapi Research Institute');
  assert.equal(owner.url, site.url + '/about');
  assert.equal(owner.sameAs, undefined);
  if (path === '/' || path === '/about')
    assert.ok(
      html
        .split('</head>')[1]
        .includes('ゲムなお（げむなお／Gemnao）は、オカピ研究所'),
    );
  if (['/', '/en', '/zh', '/es'].includes(path))
    assert.match(html, /<meta property="og:site_name" content="ゲムなお"/);
  if (path === '/') {
    assert.match(html, /<h1>ゲムなお/);
    assert.match(html, /<meta property="og:site_name" content="ゲムなお"/);
    assert.ok(html.includes('<title>ゲムなお｜PCゲームのお直しWiki</title>'));
  }
}
// Optional comparison against a build of the unchanged production base.
if (process.argv[2]) {
  const base = process.argv[2];
  const old = JSON.parse(
    await readFile(base + '/dist/editorial-snapshots.json', 'utf8'),
  );
  assert.deepEqual(
    Object.keys(manifest).sort((a, b) => a.localeCompare(b)),
    Object.keys(old).sort((a, b) => a.localeCompare(b)),
    'No route additions/removals',
  );
  const seo = (html) =>
    [
      ...html
        .split('</head>')[0]
        .matchAll(/<link[^>]*(?:rel="canonical"|hrefLang=)[^>]*>/g),
    ]
      .map((x) => x[0])
      .sort((a, b) => a.localeCompare(b));
  for (const path of Object.keys(manifest))
    assert.deepEqual(
      seo(await read(path)),
      seo(await readFile(base + '/dist/client' + old[path], 'utf8')),
      path,
    );
  assert.equal(
    await readFile('dist/client/sitemap.xml', 'utf8'),
    await readFile(base + '/dist/client/sitemap.xml', 'utf8'),
    'Sitemap unchanged',
  );
}
console.log(
  'PASS site identity: single WebSite node, primary/alternate names, distinct publisher, visible aliases, title/H1/OG; optional all-route canonical/hreflang/sitemap baseline comparison.',
);
