import assert from 'node:assert/strict';
const base = 'http://127.0.0.1:8790';
const get = (path, options = {}) => fetch(base + path, { signal: AbortSignal.timeout(15000), ...options });
const config = await get('/api/diagnosis/config');
assert.deepEqual(await config.json(), { enabled: true, sharing: false, metrics: false, localOnly: true });
for (const path of ['/api/diagnosis/session', '/api/diagnosis', '/api/diagnosis/events']) {
  assert.equal((await get(path, { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json', 'X-Diagnosis-Request': '1' }, body: '{}' })).status, 503);
}
assert.equal((await get('/diagnosis/' + 'a'.repeat(32))).status, 503);
for (const path of ['/diagnose', '/diagnose/privacy']) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
  assert.match(response.headers.get('content-security-policy'), /connect-src 'self'/);
  const html = await response.text();
  assert.match(html, /noindex/);
  assert.match(html, /端末内|localStorage/);
  assert.match(html, /サーバー|診断内容/);
  assert.ok(!html.includes('共有は内容を確認して確定したときだけ作成'));
  const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:css|js)(?:\?[^"]*)?)"/g)].map((m) => m[1]).filter((url) => url.startsWith('/'));
  assert.ok(assets.length > 0);
  for (const asset of new Set(assets)) assert.equal((await get(asset)).status, 200, asset);
}
const sitemap = await (await get('/sitemap.xml')).text();
assert.ok(!sitemap.includes('/diagnose</loc>'));
assert.ok(!sitemap.includes('/diagnosis/'));
console.log('PASS: actual no-DB local beta config, refused writes/shares, noindex/no-store/privacy/CSP, all referenced assets and sitemap exclusion');
