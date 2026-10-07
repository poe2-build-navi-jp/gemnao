import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))(
  'miniflare',
);
// Public, deterministic local fixtures only. These are never configured remotely.
const fixtureToken = 'a'.repeat(64),
  rotatedFixture = 'b'.repeat(64);
const compiled = await build({
  stdin: {
    contents: `import * as automatic from './app/api/automation/game-requests/route.ts'; import * as admin from './app/api/admin/game-requests/route.ts'; import * as publicApi from './app/api/game-requests/route.ts'; export default {fetch(r){const p=new URL(r.url).pathname;const h=p==='/api/automation/game-requests'?automatic:p==='/api/admin/game-requests'?admin:p==='/api/game-requests'?publicApi:null;return h?.[r.method]?.(r)??new Response(null,{status:404});}}`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'browser',
  external: ['cloudflare:workers'],
});
function options(token = fixtureToken, enabled = false) {
  return {
    modules: true,
    script: compiled.outputFiles[0].text,
    compatibilityDate: '2026-05-22',
    compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['DB'],
    bindings: {
      GAME_REQUESTS_ENABLED: enabled ? 'true' : 'false',
      GAME_REQUEST_CONSUMER_READY: enabled ? 'true' : 'false',
      DISCORD_ADMIN_TOKEN: 'local-owner-fixture',
      ...(token === null ? {} : { GAME_REQUEST_CONSUMER_TOKEN: token }),
    },
  };
}
async function make(token = fixtureToken, enabled = false) {
  const mf = new Miniflare(options(token, enabled)),
    db = await mf.getD1Database('DB');
  await db.exec(
    (await readFile('migrations/game-requests/0001_game_requests.sql', 'utf8'))
      .replace(/--[^\n]*/g, '')
      .replace(/\n/g, ' '),
  );
  return { mf, db };
}
const canonical = 'https://gemnao.pages.dev',
  path = '/api/automation/game-requests';
const auth = { Authorization: `Bearer ${fixtureToken}` };
const { mf, db } = await make();
try {
  // Seed only synthetic local rows to prove authentication failures never clean titles or rate records.
  const old = Date.now() - 100 * 86400000,
    id = crypto.randomUUID();
  await db
    .prepare(
      'INSERT INTO game_requests (id,game_name,normalized_name,locale,created_at,updated_at) VALUES (?,?,?,?,?,?)',
    )
    .bind(
      id,
      'Synthetic Existing Game',
      'synthetic existing game',
      'ja',
      old,
      old,
    )
    .run();
  await db
    .prepare('INSERT INTO game_request_attempts VALUES (?,?,?,?)')
    .bind('synthetic-public-old', '2000-01-01', 'public-fixture', old)
    .run();
  await db
    .prepare('INSERT INTO game_request_attempts VALUES (?,?,?,?)')
    .bind(
      'synthetic-consumer-old',
      'consumer:2000-01-01T00:00',
      'consumer',
      old,
    )
    .run();
  const badHeaders = [
    {},
    { cookie: 'gemnao_discord_admin=local-owner-fixture' },
    { Authorization: 'Bearer local-owner-fixture' },
    { Authorization: `Bearer ${rotatedFixture}` },
    { Authorization: `Bearer ${'x'.repeat(1000)}` },
    { Authorization: `Bearer ${fixtureToken}, Bearer ${fixtureToken}` },
    { ...auth, Origin: canonical },
    { ...auth, 'Sec-Fetch-Site': 'same-origin' },
  ];
  for (const headers of badHeaders) {
    const r = await mf.dispatchFetch(canonical + path, { headers });
    assert.equal(r.status, 401);
    assert.deepEqual(await r.json(), { error: 'unauthorized' });
    assert.equal(r.headers.get('access-control-allow-origin'), null);
  }
  for (const host of [
    'https://preview.gemnao.pages.dev',
    'https://gemnao.pages.dev.evil.example',
    'http://gemnao.pages.dev',
    'https://gemnao.pages.dev:8443',
  ])
    assert.equal(
      (await mf.dispatchFetch(host + path, { headers: auth })).status,
      401,
    );
  assert.equal(
    (
      await db
        .prepare('SELECT COUNT(*) AS n FROM game_request_attempts')
        .first()
    ).n,
    2,
  );
  assert.equal(
    (await db.prepare('SELECT COUNT(*) AS n FROM game_requests').first()).n,
    1,
  );
  const good = await mf.dispatchFetch(canonical + path, { headers: auth });
  assert.equal(good.status, 200);
  assert.equal(good.headers.get('cache-control'), 'no-store');
  assert.equal((await good.json()).requests[0].id, id);
  // Only namespaced operational rows cleaned by private API; never old visitor rows/titles.
  assert.ok(
    await db
      .prepare(
        "SELECT id FROM game_request_attempts WHERE id='synthetic-public-old'",
      )
      .first(),
  );
  assert.equal(
    await db
      .prepare(
        "SELECT id FROM game_request_attempts WHERE id='synthetic-consumer-old'",
      )
      .first(),
    null,
  );
  assert.ok(
    await db
      .prepare('SELECT id FROM game_requests WHERE id=?')
      .bind(id)
      .first(),
  );
  assert.deepEqual(
    await (await mf.dispatchFetch(canonical + '/api/game-requests')).json(),
    { available: false },
  );
  const patch = (body) =>
    mf.dispatchFetch(canonical + path, {
      method: 'PATCH',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  const claim = (await (await patch({ action: 'claim', id })).json()).claim;
  assert.equal(claim.id, id);
  assert.equal(
    (
      await patch({
        action: 'update',
        id,
        leaseToken: claim.lease_token,
        status: 'covered',
        canonicalGame: 'synthetic-game',
        reasonCode: 'already_covered',
        publicationUrl: canonical + '/games/synthetic-game',
      })
    ).status,
    200,
  );
  assert.equal((await patch({ action: 'delete', id })).status, 400);
  assert.equal(
    (await patch({ action: 'sql', id, sql: 'DROP TABLE game_requests' }))
      .status,
    400,
  );
  assert.equal(
    (await patch({ action: 'claim', id, extra: 'not allowed' })).status,
    400,
  );
  assert.equal(
    (await patch({ action: 'claim', id: 'x'.repeat(3000) })).status,
    413,
  );
  assert.equal(
    (
      await mf.dispatchFetch(canonical + path, {
        method: 'PATCH',
        headers: auth,
        body: '{}',
      })
    ).status,
    415,
  );
  assert.equal(
    (
      await mf.dispatchFetch(canonical + path + '?sql=anything', {
        headers: auth,
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await mf.dispatchFetch(canonical + path + '?after=a&after=b', {
        headers: auth,
      })
    ).status,
    400,
  );
  for (const method of ['POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD']) {
    const r = await mf.dispatchFetch(canonical + path, {
      method,
      headers: auth,
    });
    assert.equal(r.status, 405);
    assert.equal(r.headers.get('access-control-allow-origin'), null);
  }
  // A consumer bearer cannot authenticate owner administration.
  assert.equal(
    (
      await mf.dispatchFetch(canonical + '/api/admin/game-requests', {
        headers: auth,
      })
    ).status,
    401,
  );
  // Same consumer instance, changed runtime binding: no stale expected-token cache.
  await mf.setOptions(options(rotatedFixture));
  assert.equal(
    (await mf.dispatchFetch(canonical + path, { headers: auth })).status,
    401,
  );
  assert.equal(
    (
      await mf.dispatchFetch(canonical + path, {
        headers: { Authorization: `Bearer ${rotatedFixture}` },
      })
    ).status,
    200,
  );
  await mf.setOptions(options(null));
  assert.equal(
    (
      await mf.dispatchFetch(canonical + path, {
        headers: { Authorization: `Bearer ${rotatedFixture}` },
      })
    ).status,
    401,
  );
  console.log(
    'PASS: unset/wrong/owner-cookie/browser/preview/oversized auth denied before D1; canonical private GET/PATCH with public flags off; scope, body/query/method bounds; rotation and removal revoke old token.',
  );
} finally {
  await mf.dispose();
}
for (const bad of [null, 'short-human-password', 'x'.repeat(1000)]) {
  const c = await make(bad);
  try {
    assert.equal(
      (await c.mf.dispatchFetch(canonical + path, { headers: auth })).status,
      401,
    );
    assert.equal(
      (
        await c.db
          .prepare('SELECT COUNT(*) AS n FROM game_request_attempts')
          .first()
      ).n,
      0,
    );
  } finally {
    await c.mf.dispose();
  }
}
const rate = await make(fixtureToken, true);
try {
  const day = new Date().toISOString().slice(0, 10);
  await rate.db
    .prepare('INSERT INTO game_request_attempts VALUES (?,?,?,?)')
    .bind('synthetic-public-current', day, 'public-fixture', Date.now())
    .run();
  const replies = await Promise.all(
    Array.from({ length: 130 }, () =>
      rate.mf.dispatchFetch(canonical + path, { headers: auth }),
    ),
  );
  assert.equal(replies.filter((r) => r.status === 200).length, 120);
  assert.equal(replies.filter((r) => r.status === 429).length, 10);
  assert.equal(
    replies.find((r) => r.status === 429).headers.get('retry-after'),
    '60',
  );
  assert.equal(
    (
      await rate.db
        .prepare(
          "SELECT COUNT(*) AS n FROM game_request_attempts WHERE fingerprint='consumer'",
        )
        .first()
    ).n,
    120,
  );
  assert.equal(
    (
      await rate.db
        .prepare('SELECT COUNT(*) AS n FROM game_request_attempts WHERE day=?')
        .bind(day)
        .first()
    ).n,
    1,
  );
  // Consumer rate rows must not consume the public per-network/global quota.
  const publicHeaders = {
    'content-type': 'application/json',
    origin: canonical,
    'cf-connecting-ip': '192.0.2.80',
  };
  const post = () =>
    rate.mf.dispatchFetch(canonical + '/api/game-requests', {
      method: 'POST',
      headers: publicHeaders,
      body: JSON.stringify({
        gameName: 'Synthetic Public Game',
        locale: 'en',
        website: '',
      }),
    });
  for (let i = 0; i < 5; i++)
    assert.ok([200, 201].includes((await post()).status));
  assert.equal((await post()).status, 429);
  assert.equal(
    (
      await rate.db
        .prepare('SELECT COUNT(*) AS n FROM game_request_attempts WHERE day=?')
        .bind(day)
        .first()
    ).n,
    6,
  );
  console.log(
    'PASS: atomic 120/min private cap under 130 parallel calls; namespaced operational counters leave public 5/day and global date quota isolated.',
  );
} finally {
  await rate.mf.dispose();
}
