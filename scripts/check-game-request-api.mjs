import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))(
  'miniflare',
);
const compiled = await build({
  stdin: {
    contents: `import * as pub from './app/api/game-requests/route.ts'; import * as admin from './app/api/admin/game-requests/route.ts'; export default {fetch(r){const handler=new URL(r.url).pathname.includes('/admin/')?admin:pub;return handler[r.method]?.(r)??new Response(null,{status:405});}}`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'browser',
  external: ['cloudflare:workers'],
});
async function make(enabled = true, migrate = true, consumerReady = true) {
  const mf = new Miniflare({
    modules: true,
    script: compiled.outputFiles[0].text,
    compatibilityDate: '2026-05-15',
    compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['DB'],
    bindings: {
      GAME_REQUESTS_ENABLED: enabled ? 'true' : 'false',
      GAME_REQUEST_CONSUMER_READY: consumerReady ? 'true' : 'false',
      DISCORD_ADMIN_TOKEN: 'local-test-key',
    },
  });
  const db = await mf.getD1Database('DB');
  if (migrate) {
    const sql = await readFile(
      'migrations/game-requests/0001_game_requests.sql',
      'utf8',
    );
    await db.exec(sql.replace(/--[^\n]*/g, '').replace(/\n/g, ' '));
  }
  return { mf, db };
}
const origin = 'https://test';
const headers = {
  'content-type': 'application/json',
  origin,
  'cf-connecting-ip': '192.0.2.1',
};
const payload = { gameName: '原神', locale: 'ja', website: '' };
const post = (mf, body = payload, h = headers) =>
  mf.dispatchFetch(origin + '/api/game-requests', {
    method: 'POST',
    headers: h,
    body: JSON.stringify(body),
  });
const { mf, db } = await make();
try {
  assert.deepEqual(
    await (await mf.dispatchFetch(origin + '/api/game-requests')).json(),
    { available: true },
  );
  const response = await post(mf);
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    ok: true,
    status: 'received',
    duplicate: false,
  });
  assert.equal((await post(mf)).status, 200);
  assert.equal(
    (await db.prepare('SELECT COUNT(*) AS n FROM game_requests').first()).n,
    1,
  );
  assert.equal((await post(mf, { ...payload, website: 'spam' })).status, 400);
  for (const gameName of [
    'x',
    'test@example.com',
    'https://example.com',
    '原神\n秘密',
    '<script>',
    '123456789',
  ])
    assert.equal(
      (await post(mf, { ...payload, gameName })).status,
      400,
      gameName,
    );
  assert.equal(
    (await post(mf, payload, { ...headers, origin: 'https://evil' })).status,
    403,
  );
  assert.equal(
    (await post(mf, payload, { ...headers, 'sec-fetch-site': 'cross-site' }))
      .status,
    403,
  );
  assert.equal((await post(mf, payload, { origin })).status, 415);
  assert.equal(
    (
      await post(mf, payload, {
        'content-type': 'application/json',
        origin,
        'cf-connecting-ip': 'invalid',
      })
    ).status,
    503,
  );
  assert.equal(
    (await post(mf, { ...payload, gameName: 'a'.repeat(3000) })).status,
    413,
  );
  const races = await Promise.all(
    Array.from({ length: 8 }, (_, i) =>
      post(mf, { ...payload, gameName: 'Game ' + i }),
    ),
  );
  assert.equal(races.filter((r) => r.status === 201).length, 3);
  assert.equal(races.filter((r) => r.status === 429).length, 5);
  assert.equal(
    (
      await db
        .prepare('SELECT COUNT(*) AS n FROM game_request_attempts')
        .first()
    ).n,
    5,
  );
  const records = await db.prepare('SELECT * FROM game_request_attempts').all();
  assert.ok(!JSON.stringify(records).includes('192.0.2.1'));
  assert.equal(
    (await mf.dispatchFetch(origin + '/api/admin/game-requests')).status,
    401,
  );
  const auth = { ...headers, cookie: 'gemnao_discord_admin=local-test-key' };
  const listing = await (
    await mf.dispatchFetch(origin + '/api/admin/game-requests', {
      headers: auth,
    })
  ).json();
  assert.equal(listing.requests.length, 4);
  const patch = (body, h = auth) =>
    mf.dispatchFetch(origin + '/api/admin/game-requests', {
      method: 'PATCH',
      headers: h,
      body: JSON.stringify(body),
    });
  const id = listing.requests[0].id;
  const claims = await Promise.all([
    patch({ id, action: 'claim' }),
    patch({ id, action: 'claim' }),
  ]);
  assert.deepEqual(claims.map((r) => r.status).sort((a, b) => a - b), [200, 409]);
  const claim = await claims.find((r) => r.status === 200).json();
  assert.equal(
    (await patch({ id: listing.requests[1].id, action: 'claim' })).status,
    409,
  );
  assert.equal(
    (
      await patch({
        id,
        action: 'update',
        leaseToken: crypto.randomUUID(),
        status: 'researching',
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await patch({
        id,
        action: 'update',
        leaseToken: claim.claim.lease_token,
        status: 'published',
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await patch({
        id,
        action: 'update',
        leaseToken: claim.claim.lease_token,
        status: 'held',
        reasonCode: 'sources_unavailable',
      })
    ).status,
    200,
  );
  assert.equal(
    (await patch({ id: listing.requests[1].id, action: 'claim' })).status,
    200,
  );
  assert.equal(
    (await patch({ id, action: 'claim' }, { ...auth, origin: 'https://evil' }))
      .status,
    403,
  );
  // Per-day global bound, independent networks. No partial request insert on rejection.
  await db.prepare('DELETE FROM game_request_attempts').run();
  const day = new Date().toISOString().slice(0, 10);
  for (let i = 0; i < 100; i++)
    await db
      .prepare('INSERT INTO game_request_attempts VALUES (?,?,?,?)')
      .bind(crypto.randomUUID(), day, 'network-' + i, Date.now())
      .run();
  assert.equal(
    (
      await post(
        mf,
        { ...payload, gameName: 'Global Blocked' },
        { ...headers, 'cf-connecting-ip': '192.0.2.2' },
      )
    ).status,
    429,
  );
  assert.equal(
    await db
      .prepare("SELECT id FROM game_requests WHERE game_name='Global Blocked'")
      .first(),
    null,
  );
  console.log(
    'PASS: real local D1 migration, persistence, dedupe, validation, byte cap, origin/media gates, atomic concurrent rate limits, private admin auth, global serial claims, leases and publication requirements.',
  );
} finally {
  await mf.dispose();
}
for (const [enabled, migrate] of [
  [false, true],
  [true, false],
]) {
  const { mf } = await make(enabled, migrate);
  try {
    assert.deepEqual(
      await (await mf.dispatchFetch(origin + '/api/game-requests')).json(),
      { available: false },
    );
    assert.equal((await post(mf)).status, 503);
  } finally {
    await mf.dispose();
  }
}
console.log(
  'PASS: default-off and missing migration fail closed with no fake receipt.',
);
const partial = await make();
try {
  await partial.db.prepare('DROP TABLE game_request_attempts').run();
  assert.deepEqual(
    await (
      await partial.mf.dispatchFetch(origin + '/api/game-requests')
    ).json(),
    { available: false },
  );
  assert.equal((await post(partial.mf)).status, 503);
} finally {
  await partial.mf.dispose();
}
console.log(
  'PASS: partially applied schema without rate accounting table stays unavailable.',
);
const retryCase = await make();
try {
  await post(retryCase.mf, { ...payload, gameName: 'Synthetic Retry Game' });
  const row = await retryCase.db
    .prepare('SELECT id FROM game_requests')
    .first();
  const auth = { ...headers, cookie: 'gemnao_discord_admin=local-test-key' };
  const change = (body) =>
    retryCase.mf.dispatchFetch(origin + '/api/admin/game-requests', {
      method: 'PATCH',
      headers: auth,
      body: JSON.stringify(body),
    });
  const claim = (await (await change({ action: 'claim', id: row.id })).json())
    .claim;
  const update = (status) =>
    change({
      action: 'update',
      id: row.id,
      leaseToken: claim.lease_token,
      status,
      canonicalGame: 'synthetic-game',
      publicationUrl: 'https://gemnao.pages.dev/games/synthetic-game',
      publicationSha: 'a'.repeat(40),
    });
  assert.equal((await update('published')).status, 409, 'cannot skip QA');
  for (const state of ['researching', 'drafting', 'qa', 'published'])
    assert.equal((await update(state)).status, 200, state);
  assert.equal(
    (await change({ action: 'claim', id: row.id })).status,
    409,
    'published not reclaimed',
  );
  await post(retryCase.mf, {
    ...payload,
    gameName: 'Synthetic Exhausted Game',
  });
  const exhausted = await retryCase.db
    .prepare(
      "SELECT id FROM game_requests WHERE game_name='Synthetic Exhausted Game'",
    )
    .first();
  await retryCase.db
    .prepare(
      "UPDATE game_requests SET status='qa',attempt_count=3,lease_until=? WHERE id=?",
    )
    .bind(Date.now() - 1000, exhausted.id)
    .run();
  assert.equal(
    (await change({ action: 'claim', id: exhausted.id })).status,
    409,
  );
  const held = await retryCase.db
    .prepare('SELECT status,reason_code FROM game_requests WHERE id=?')
    .bind(exhausted.id)
    .first();
  assert.deepEqual(held, { status: 'held', reason_code: 'retry_later' });
} finally {
  await retryCase.mf.dispose();
}
console.log(
  'PASS: ordered editorial state gates, terminal idempotency and exhausted retry hold.',
);
const consumerOff = await make(true, true, false);
try {
  assert.deepEqual(
    await (
      await consumerOff.mf.dispatchFetch(origin + '/api/game-requests')
    ).json(),
    { available: false },
  );
  assert.equal((await post(consumerOff.mf)).status, 503);
  assert.equal(
    (
      await consumerOff.db
        .prepare('SELECT COUNT(*) AS n FROM game_requests')
        .first()
    ).n,
    0,
  );
} finally {
  await consumerOff.mf.dispose();
}
const leaseCase = await make();
try {
  await post(leaseCase.mf, { ...payload, gameName: 'Synthetic Lease Game' });
  const row = await leaseCase.db
    .prepare('SELECT id FROM game_requests')
    .first();
  const auth = { ...headers, cookie: 'gemnao_discord_admin=local-test-key' };
  const change = (body) =>
    leaseCase.mf.dispatchFetch(origin + '/api/admin/game-requests', {
      method: 'PATCH',
      headers: auth,
      body: JSON.stringify(body),
    });
  const oldClaim = (
    await (await change({ action: 'claim', id: row.id })).json()
  ).claim;
  await leaseCase.db
    .prepare('UPDATE game_requests SET lease_until=? WHERE id=?')
    .bind(Date.now() - 1000, row.id)
    .run();
  assert.equal(
    (
      await change({
        action: 'update',
        id: row.id,
        leaseToken: oldClaim.lease_token,
        status: 'researching',
      })
    ).status,
    409,
  );
  const newClaim = (
    await (await change({ action: 'claim', id: row.id })).json()
  ).claim;
  assert.notEqual(newClaim.lease_token, oldClaim.lease_token);
  assert.equal(
    (
      await change({
        action: 'update',
        id: row.id,
        leaseToken: oldClaim.lease_token,
        status: 'researching',
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await change({
        action: 'update',
        id: row.id,
        leaseToken: newClaim.lease_token,
        status: 'researching',
      })
    ).status,
    200,
  );
} finally {
  await leaseCase.mf.dispose();
}
console.log(
  'PASS: consumer readiness independently gates intake; expired and replaced lease replay rejected.',
);
const migrationCase = await make(false, false);
try {
  await migrationCase.db.exec(
    "CREATE TABLE existing_feature_sentinel (id INTEGER PRIMARY KEY, value TEXT NOT NULL); INSERT INTO existing_feature_sentinel VALUES (1, 'preserve-existing-data');",
  );
  const migration = (
    await readFile('migrations/game-requests/0001_game_requests.sql', 'utf8')
  )
    .replace(/--[^\n]*/g, '')
    .replace(/\n/g, ' ');
  await migrationCase.db.exec(migration);
  await migrationCase.db.exec(migration);
  assert.deepEqual(
    await migrationCase.db
      .prepare('SELECT * FROM existing_feature_sentinel')
      .first(),
    { id: 1, value: 'preserve-existing-data' },
  );
  assert.equal(
    (
      await migrationCase.db
        .prepare(
          "SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table' AND name IN ('game_requests','game_request_attempts','game_request_daily_salts')",
        )
        .first()
    ).n,
    3,
  );
} finally {
  await migrationCase.mf.dispose();
}
console.log(
  'PASS: additive migration is repeatable and leaves unrelated existing data intact.',
);
const admissionCase = await make();
try {
  const day = new Date().toISOString().slice(0, 10);
  // Leave five global slots, each parallel caller has an independent network.
  for (let i = 0; i < 95; i++)
    await admissionCase.db
      .prepare('INSERT INTO game_request_attempts VALUES (?,?,?,?)')
      .bind(crypto.randomUUID(), day, 'seed-' + i, Date.now())
      .run();
  const burst = await Promise.all(
    Array.from({ length: 15 }, (_, i) =>
      post(
        admissionCase.mf,
        { ...payload, gameName: 'Synthetic Global Race ' + i },
        { ...headers, 'cf-connecting-ip': `192.0.2.${i + 10}` },
      ),
    ),
  );
  assert.equal(burst.filter((r) => r.status === 201).length, 5);
  assert.equal(burst.filter((r) => r.status === 429).length, 10);
  assert.equal(
    (
      await admissionCase.db
        .prepare('SELECT COUNT(*) AS n FROM game_request_attempts')
        .first()
    ).n,
    100,
  );
  assert.equal(
    (
      await admissionCase.db
        .prepare('SELECT COUNT(*) AS n FROM game_requests')
        .first()
    ).n,
    5,
  );
  const accepted = await admissionCase.db
    .prepare('SELECT game_name FROM game_requests LIMIT 1')
    .first();
  const deniedDuplicate = await post(
    admissionCase.mf,
    { ...payload, gameName: accepted.game_name },
    { ...headers, 'cf-connecting-ip': '192.0.2.200' },
  );
  assert.equal(
    deniedDuplicate.status,
    429,
    'existing row cannot bypass fresh admission or yield a false receipt',
  );
  assert.deepEqual(await deniedDuplicate.json(), { error: 'rate_limited' });
} finally {
  await admissionCase.mf.dispose();
}
console.log(
  'PASS: trigger-free atomic global concurrent admission and denied-duplicate receipt isolation.',
);
