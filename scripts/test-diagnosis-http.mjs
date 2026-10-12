import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const base = 'http://127.0.0.1:8788';
const json = async (
  path,
  body,
  cookie = '',
  method = body === undefined ? 'GET' : 'POST',
) =>
  fetch(base + path, {
    method,
    headers: {
      Origin: base,
      'X-Diagnosis-Request': '1',
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
// These queries target only the fixed dummy local bindings from the test config.
const localRows = (binding, sql) => {
  const result = spawnSync('node_modules/.bin/wrangler', [
    'd1', 'execute', binding, '--local', '--config', 'wrangler.diagnosis-local.json',
    '--persist-to', process.env.DIAGNOSIS_LOCAL_STATE || '.wrangler/diagnosis-state',
    '--json', '--command', sql,
  ], { encoding: 'utf8', timeout: 60000 });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout)[0].results;
};
const reports = [];
const pass = (name) => {
  reports.push(name);
  console.log('PASS ' + name);
};
const diagnosisTables = localRows('DIAGNOSIS_DB', "SELECT name FROM sqlite_master WHERE type='table' AND (name LIKE 'diagnosis_%' OR name='issue_feedback') ORDER BY name").map((row) => row.name);
assert.deepEqual(diagnosisTables, ['diagnosis_metrics', 'diagnosis_operations', 'diagnosis_rate_limits', 'diagnosis_shared']);
const siteTables = localRows('DB', "SELECT name FROM sqlite_master WHERE type='table' AND (name LIKE 'diagnosis_%' OR name='issue_feedback') ORDER BY name").map((row) => row.name);
assert.deepEqual(siteTables, ['issue_feedback']);
pass('dedicated local DIAGNOSIS_DB has only diagnosis tables; ordinary local DB has no diagnosis tables');
const cfg = await (await json('/api/diagnosis/config')).json();
assert.equal(cfg.sharing, true);
pass('actual local D1 + executed scheduled cleanup enables shares');
const sess = await json('/api/diagnosis/session', {});
assert.equal(sess.status, 200);
const cookie = sess.headers.get('set-cookie').split(';')[0];
const input = {
  answers: {
    symptom: 'black-screen',
    scope: 'game',
    observation: 'unknown',
    change: 'unknown',
    launcher: 'unknown',
    os: 'unknown',
    gpu: 'unknown',
    ram: 'unknown',
  },
  tried: {},
  results: { inspect: 'tried' },
  version: '2026-10-02.1',
};
const create = await json(
  '/api/diagnosis',
  { snapshot: input, requestId: crypto.randomUUID().replaceAll('-', '') },
  cookie,
);
assert.equal(create.status, 201, await create.clone().text());
const data = await create.json();
assert.match(data.id, /^[a-f0-9]{32}$/);
pass('actual D1 create + high-entropy ID');
const view = await json('/api/diagnosis/' + data.id);
assert.equal(view.status, 200);
const text = await view.text();
assert.ok(!text.includes(data.recoveryKey));
assert.ok(!text.includes('owner_hash'));
assert.ok(!text.includes('recovery_hash'));
assert.match(view.headers.get('cache-control'), /no-store/);
pass('read-only public API hides owner secrets');
const page = await fetch(base + '/diagnosis/' + data.id);
assert.equal(page.status, 200);
const html = await page.text();
assert.ok(html.includes('ゲムなおのトラブル診断結果'));
assert.ok(!html.includes(data.recoveryKey));
assert.match(page.headers.get('x-robots-tag'), /noindex/);
assert.equal(page.headers.get('referrer-policy'), 'no-referrer');
assert.match(page.headers.get('content-security-policy'), /connect-src 'self'/);
pass('actual Pages result response security headers + generic metadata');
for (const method of ['PATCH', 'DELETE'])
  assert.equal(
    (
      await json(
        '/api/diagnosis/' + data.id,
        method === 'PATCH'
          ? { results: { inspect: 'improved' }, revision: 1 }
          : {},
        '',
        method,
      )
    ).status,
    403,
  );
pass('unrelated HTTP session update/delete denied');
const update = await json(
  '/api/diagnosis/' + data.id,
  { results: { inspect: 'improved' }, revision: 1 },
  cookie,
  'PATCH',
);
assert.equal(update.status, 200);
assert.equal(
  (await (await json('/api/diagnosis/' + data.id)).json()).snapshot.results
    .inspect,
  'improved',
);
pass('explicit owner result update persists');
const revoke = await json('/api/diagnosis/' + data.id + '/revoke', {}, cookie);
assert.equal(revoke.status, 200);
assert.equal((await json('/api/diagnosis/' + data.id)).status, 404);
assert.equal((await fetch(base + '/diagnosis/' + data.id)).status, 404);
const inactive = await (
  await json('/api/diagnosis/' + data.id + '/owner', undefined, cookie)
).json();
assert.equal(inactive.inactive, true);
assert.ok(!inactive.snapshot);
pass('revoked page and API unavailable, owner only metadata');
assert.equal(
  (await json('/api/diagnosis/' + data.id, {}, cookie, 'DELETE')).status,
  200,
);
assert.equal(
  (await json('/api/diagnosis/' + data.id + '/owner', undefined, cookie))
    .status,
  403,
);
pass('owner deletion removes actual local D1 row');
const second = await (
  await json(
    '/api/diagnosis',
    { snapshot: input, requestId: crypto.randomUUID().replaceAll('-', '') },
    cookie,
  )
).json();
assert.match(second.id, /^[a-f0-9]{32}$/);
const expired = spawnSync(
  'node_modules/.bin/wrangler',
  [
    'd1',
    'execute',
    'gemnao-diagnosis-local',
    '--local',
    '--config',
    'wrangler.diagnosis-local.json',
    '--persist-to',
    process.env.DIAGNOSIS_LOCAL_STATE || '.wrangler/diagnosis-state',
    '--command',
    `UPDATE diagnosis_shared SET expires_at=1 WHERE id='${second.id}'`,
  ],
  { encoding: 'utf8', timeout: 60000 },
);
assert.equal(expired.status, 0, expired.stderr);
assert.equal((await json('/api/diagnosis/' + second.id)).status, 404);
assert.equal((await fetch(base + '/diagnosis/' + second.id)).status, 404);
assert.equal(
  (
    await fetch(
      'http://127.0.0.1:8789/cdn-cgi/handler/scheduled?cron=17+*+*+*+*',
    )
  ).status,
  200,
);
assert.equal(
  (await json('/api/diagnosis/' + second.id + '/owner', undefined, cookie))
    .status,
  403,
);
pass(
  'actual scheduled cleanup purges expired row after immediate page/API denial',
);
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
const locations = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort((a, b) => a.localeCompare(b));
assert.deepEqual(locations(sitemap), locations(readFileSync('dist/client/sitemap.xml', 'utf8')));
assert.ok(locations(sitemap).length >= 272, 'must retain the current source sitemap');
assert.equal(sitemap.includes('/diagnose</loc>'), readFileSync('dist/client/sitemap.xml', 'utf8').includes('/diagnose</loc>'));
assert.ok(!sitemap.includes('/diagnosis/'));
pass('current built sitemap matches every served URL and activation policy, no individual shares');
for (const path of [
  '/',
  '/guide/steam-game-not-launching',
  '/games/elden-ring',
  '/en',
  '/guide',
  '/robots.txt',
  '/ads.txt',
  '/api/feedback?game=guide-steam-game-not-launching',
]) {
  const r = await fetch(base + path);
  assert.equal(r.status, 200, path);
  if (path === '/') {
    const raw = await r.text();
    assert.ok(raw.includes('google-site-verification'));
    assert.ok(raw.includes('google-adsense-account'));
    const urls = [
      ...raw.matchAll(/(?:src|href)="([^"]+\.(?:css|js)(?:\?[^"]*)?)"/g),
    ]
      .map((m) => m[1])
      .filter((u) => u.startsWith('/'));
    assert.ok(urls.length);
    for (const u of urls.slice(0, 8))
      assert.equal((await fetch(base + u)).status, 200, u);
  }
}
pass(
  'existing home/article/hub/locale/feedback/robots/ads/CSS/JS HTTP regression',
);
writeFileSync(
  '.wrangler/diagnosis-preview/http-results.json',
  JSON.stringify(
    {
      passed: reports,
      date: new Date().toISOString(),
      database: 'DIAGNOSIS_DB fixed local fake ID ...0004; ordinary DB separate local fake ID ...0005; no remote',
    },
    null,
    2,
  ),
);
