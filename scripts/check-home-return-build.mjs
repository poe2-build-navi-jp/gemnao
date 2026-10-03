import assert from 'node:assert/strict';
const base = process.argv[2];
assert.ok(
  base,
  'Usage: node scripts/check-home-return-build.mjs <preview-base-url>',
);
const assets = new Set();
for (const path of [
  '/',
  '/?view=games',
  '/?view=articles',
  '/en',
  '/zh',
  '/es',
]) {
  const response = await fetch(new URL(path, base), {
    signal: AbortSignal.timeout(20000),
  });
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || '';
  const canonicalPath = path.startsWith('/?') ? '/' : path;
  const canonicalTag =
    head.match(/<link\b[^>]*rel="canonical"[^>]*>/)?.[0] || '';
  const canonical = canonicalTag.match(/href="([^"]+)"/)?.[1];
  assert.ok(canonical, `${path} canonical in head`);
  assert.equal(
    new URL(canonical).href,
    new URL(canonicalPath, 'https://gemnao.pages.dev').href,
    `${path} canonical`,
  );
  for (const content of [
    '<title>',
    'rel="canonical"',
    'property="og:image"',
    'google-adsense-account',
  ])
    assert.ok(head.includes(content), `${path} ${content}`);
  assert.match(html, /<details class="home-bookmark-help"><summary>/);
  assert.ok(!html.includes('<details class="home-bookmark-help" open'));
  if (canonicalPath === '/') {
    assert.ok(
      html.indexOf('id="symptoms"') < html.indexOf('my-shortcut-title'),
    );
    assert.ok(html.indexOf('home-saved-entry') < html.indexOf('symptom-grid'));
    for (const href of [
      '/tools/save-locations',
      '/tools/refresh-rate',
      '/tools/windows-diagnosis',
    ])
      assert.ok(html.includes(`href="${href}"`));
    for (const example of [
      'Aniimo 黒画面',
      'Steam 起動しない',
      'Discord マイク',
    ])
      assert.ok(html.includes(`aria-label="${example}で検索"`));
  }
  for (const match of html.matchAll(
    /(?:src|href)="([^" ]+\.(?:css|js)(?:\?[^" ]*)?)"/g,
  ))
    if (match[1].startsWith('/')) assets.add(match[1]);
  console.log(`PASS: ${path} homepage HTML, bookmark help and head metadata`);
}
for (const asset of assets) {
  const response = await fetch(new URL(asset, base), {
    signal: AbortSignal.timeout(20000),
  });
  assert.equal(response.status, 200, asset);
  assert.ok(
    !response.headers.get('content-type')?.includes('text/html'),
    asset,
  );
}
console.log(`PASS: ${assets.size} referenced CSS/JS assets return 200`);
