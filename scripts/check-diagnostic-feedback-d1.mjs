// Entirely local Miniflare D1. Test-only routes/clock adapter are never shipped.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))(
  'miniflare',
);
const compiled = await build({
  stdin: {
    contents: `
      import {handleFeedback} from './lib/diagnostic-feedback/service.ts';
      import {takeFeedbackQuota} from './lib/diagnostic-feedback/rate-limit.ts';
      import cleanup from './cloudflare/diagnostic-feedback-cleanup.ts';
      export default {async fetch(r,env){
        // Freeze only the database clock expression, keeping all actual D1 SQL,
        // constraints, batches and concurrency. No clock hook in production.
        const clock=r.headers.get('x-test-clock');
        const db=clock===null?env.FEEDBACK_DB:{
          prepare(sql){const at=sql.startsWith('DELETE FROM diagnostic_rate_attempts')?(r.headers.get('x-test-prune-clock')??clock):clock;return env.FEEDBACK_DB.prepare(sql.replaceAll('unixepoch()',String(Number(at))))},
          batch(statements){return env.FEEDBACK_DB.batch(statements)}
        };
        const runtime={...env,FEEDBACK_DB:db};
        try{
          if(new URL(r.url).pathname==='/quota'){
            const ok=await takeFeedbackQuota(db,r.method==='DELETE'?'delete':'intake',r.headers.get('cf-connecting-ip'));
            return new Response(null,{status:ok?201:429});
          }
          if(new URL(r.url).pathname==='/cleanup'){
            await cleanup.scheduled({},runtime);return new Response(null,{status:204});
          }
          return handleFeedback(r,runtime);
        }catch{return new Response(null,{status:503})}
      }};`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'browser',
  external: ['node:net'],
});
const migration = await readFile(
  'migrations/diagnostic-feedback/0001.sql',
  'utf8',
);
async function make({ enabled = 'true', migrate = true } = {}) {
  const mf = new Miniflare({
    modules: true,
    script: compiled.outputFiles[0].text,
    compatibilityDate: '2026-05-22',
    compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['FEEDBACK_DB'],
    bindings: { FEEDBACK_ENABLED: enabled },
  });
  const db = await mf.getD1Database('FEEDBACK_DB');
  if (migrate) {
    await db.exec(migration.replace(/--[^\n]*/g, '').replace(/\n/g, ' '));
    await db
      .prepare('INSERT INTO diagnostic_retention_health VALUES(1,unixepoch())')
      .run();
  }
  return { mf, db };
}
const origin = 'https://test.invalid';
const api = '/api/diagnostic-feedback';
const now = Math.floor(Date.now() / 1000);
const clock = Math.floor(now / 86400) * 86400 + 3600;
const report = {
  schema_version: 1,
  game_id: 'monster-hunter-wilds',
  source: 'native-windows',
  symptom: 'launch-crash',
  tool_version: '0.4.0',
  rule_version: '0.4.0',
  actions: [
    {
      action_id: 'wilds-steam-client-review',
      outcome: 'improved',
      evidence: 'self-report',
    },
  ],
};
let sequence = 0;
const envelope = () => {
  const key = (++sequence).toString(16).padStart(64, '0');
  return {
    report,
    consent_version: 1,
    delete_key: key,
    receipt_id:
      now.toString(16).padStart(8, '0') +
      createHash('sha256').update(key).digest('hex').slice(0, 24),
  };
};
const request = (
  mf,
  {
    path = api,
    method = 'POST',
    data,
    ip = '192.0.2.1',
    at = clock,
    headers = {},
  } = {},
) =>
  mf.dispatchFetch(origin + path, {
    method,
    headers: {
      origin,
      'content-type': 'application/json',
      ...(ip === null ? {} : { 'cf-connecting-ip': ip }),
      ...(at === null ? {} : { 'x-test-clock': String(at) }),
      ...headers,
    },
    ...(method === 'GET'
      ? {}
      : {
          body:
            typeof data === 'string'
              ? data
              : JSON.stringify(data ?? envelope()),
        }),
  });
const quota = (mf, args = {}) => request(mf, { path: '/quota', ...args });
const count = async (db, table) =>
  (await db.prepare(`SELECT count(*) AS n FROM ${table}`).first()).n;
async function test(name, run, options) {
  const instance = await make(options);
  try {
    await run(instance);
    console.log('PASS', name);
  } finally {
    await instance.mf.dispose();
  }
}
await test('native D1 clock, persistence, retry, independent DELETE and tombstone', async ({
  mf,
  db,
}) => {
  const body = envelope();
  assert.equal((await request(mf, { data: body, at: null })).status, 201);
  assert.equal((await request(mf, { data: body, at: null })).status, 200);
  const cancel = { receipt_id: body.receipt_id, delete_key: body.delete_key };
  assert.equal(
    (await request(mf, { method: 'DELETE', data: cancel, at: null })).status,
    200,
  );
  assert.equal((await request(mf, { data: body, at: null })).status, 409);
  assert.equal(await count(db, 'diagnostic_reports'), 0);
  assert.equal(await count(db, 'diagnostic_report_tombstones'), 1);
  assert.equal(await count(db, 'diagnostic_rate_attempts'), 4);
});
await test('40 concurrent same-network attempts admit exactly 10; no rejection rows', async ({
  mf,
  db,
}) => {
  const results = await Promise.all(
    Array.from({ length: 40 }, () => quota(mf)),
  );
  assert.equal(results.filter((r) => r.status === 201).length, 10);
  assert.equal(results.filter((r) => r.status === 429).length, 30);
  assert.equal(await count(db, 'diagnostic_rate_attempts'), 10);
  assert.equal(
    await count(db, 'diagnostic_rate_salt'),
    1,
    'concurrent first salt creation is singleton',
  );
  const rows = await db.prepare('SELECT * FROM diagnostic_rate_attempts').all();
  assert.equal(new Set(rows.results.map((r) => r.network_hash)).size, 1);
  assert.ok(!JSON.stringify(rows).includes('192.0.2.1'));
});
await test('40 concurrent independent networks share exactly 10 intake slots; DELETE has 10 separate slots', async ({
  mf,
  db,
}) => {
  const results = await Promise.all(
    Array.from({ length: 40 }, (_, i) => quota(mf, { ip: `192.0.2.${i + 1}` })),
  );
  assert.equal(results.filter((r) => r.status === 201).length, 10);
  assert.equal(results.filter((r) => r.status === 429).length, 30);
  const deletions = await Promise.all(
    Array.from({ length: 40 }, (_, i) =>
      quota(mf, { method: 'DELETE', ip: `198.51.100.${i + 1}` }),
    ),
  );
  assert.equal(deletions.filter((r) => r.status === 201).length, 10);
  assert.equal(deletions.filter((r) => r.status === 429).length, 30);
  assert.equal(await count(db, 'diagnostic_rate_attempts'), 20);
  assert.equal(
    (await quota(mf, { at: clock + 60 })).status,
    429,
    'inclusive exact boundary',
  );
  assert.equal((await quota(mf, { at: clock + 61 })).status, 201);
  assert.equal(
    await count(db, 'diagnostic_rate_attempts'),
    1,
    'prune leaves no history',
  );
});
await test('clock tick between prune and admission cannot exceed the 20-row bound', async ({
  mf,
  db,
}) => {
  for (const method of ['POST', 'DELETE'])
    for (let i = 0; i < 10; i++)
      assert.equal((await quota(mf, { method })).status, 201);
  assert.equal(
    (
      await quota(mf, {
        at: clock + 61,
        headers: { 'x-test-prune-clock': String(clock + 60) },
      })
    ).status,
    429,
  );
  assert.equal(await count(db, 'diagnostic_rate_attempts'), 20);
  assert.equal((await quota(mf, { at: clock + 61 })).status, 201);
  assert.equal(await count(db, 'diagnostic_rate_attempts'), 1);
});
await test('UTC rollover, IPv6 /64 and mapped IPv4 do not reset the global rolling window', async ({
  mf,
  db,
}) => {
  const midnight = (Math.floor(clock / 86400) + 1) * 86400;
  const ips = ['2001:0db8:1234:5678::1', '2001:db8:1234:5678:abcd::2'];
  for (const ip of ips)
    assert.equal((await quota(mf, { ip, at: midnight - 1 })).status, 201);
  let hashes = await db
    .prepare('SELECT DISTINCT network_hash FROM diagnostic_rate_attempts')
    .all();
  assert.equal(hashes.results.length, 1, 'IPv6 /64 grouped');
  for (const ip of ['192.0.2.1', '::ffff:c000:201'])
    assert.equal((await quota(mf, { ip, at: midnight - 1 })).status, 201);
  hashes = await db
    .prepare('SELECT DISTINCT network_hash FROM diagnostic_rate_attempts')
    .all();
  assert.equal(hashes.results.length, 2, 'IPv4 aliases grouped');
  for (let i = 0; i < 6; i++) await quota(mf, { at: midnight - 1 });
  const salt = (
    await db.prepare('SELECT salt FROM diagnostic_rate_salt').first()
  ).salt;
  assert.equal((await quota(mf, { at: midnight })).status, 429);
  assert.notEqual(
    (await db.prepare('SELECT salt FROM diagnostic_rate_salt').first()).salt,
    salt,
  );
  assert.equal(await count(db, 'diagnostic_rate_salt'), 1);
  assert.equal((await quota(mf, { at: midnight + 59 })).status, 429);
  assert.equal((await quota(mf, { at: midnight + 60 })).status, 201);
  assert.equal(await count(db, 'diagnostic_rate_attempts'), 1);
  assert.equal(
    (await request(mf, { path: '/cleanup', at: midnight + 86400 })).status,
    204,
  );
  assert.equal(await count(db, 'diagnostic_rate_attempts'), 0);
  assert.equal(await count(db, 'diagnostic_rate_salt'), 0);
});
await test('mixed status/invalid POST share quota; exhausted intake cannot block authenticated owner deletion', async ({
  mf,
  db,
}) => {
  const body = envelope();
  assert.equal((await request(mf, { data: body })).status, 201);
  for (let i = 0; i < 4; i++) {
    assert.equal((await request(mf, { method: 'GET' })).status, 200);
    assert.equal((await request(mf, { data: 'invalid' })).status, 400);
  }
  assert.equal((await request(mf, { data: 'invalid' })).status, 400);
  assert.equal((await request(mf)).status, 429);
  const status = await request(mf, { method: 'GET' });
  assert.equal(status.status, 429);
  assert.equal((await status.json()).canDelete, true);
  const cancel = { receipt_id: body.receipt_id, delete_key: body.delete_key };
  assert.equal(
    (await request(mf, { method: 'DELETE', data: cancel })).status,
    200,
  );
  assert.equal(await count(db, 'diagnostic_reports'), 0);
  assert.equal((await request(mf, { data: body, at: clock + 61 })).status, 409);
});
await test(
  'intake-off preserves owner deletion without quota/heartbeat on disabled status',
  async ({ mf, db }) => {
    const body = envelope();
    await db
      .prepare('INSERT INTO diagnostic_reports VALUES(?,?,?,?,?,?)')
      .bind(
        body.receipt_id,
        createHash('sha256').update(body.delete_key).digest('hex'),
        JSON.stringify(report),
        1,
        now,
        now + 86400,
      )
      .run();
    await db.prepare('DELETE FROM diagnostic_retention_health').run();
    assert.deepEqual(await (await request(mf, { method: 'GET' })).json(), {
      enabled: false,
      canDelete: true,
    });
    assert.equal((await request(mf)).status, 503);
    assert.equal(await count(db, 'diagnostic_rate_attempts'), 0);
    const cancel = { receipt_id: body.receipt_id, delete_key: body.delete_key };
    assert.equal(
      (
        await request(mf, {
          method: 'DELETE',
          data: cancel,
          headers: { origin: 'https://evil.invalid' },
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await request(mf, {
          method: 'DELETE',
          data: { ...cancel, delete_key: 'f'.repeat(64) },
        })
      ).status,
      409,
    );
    assert.equal(
      (await request(mf, { method: 'DELETE', data: cancel })).status,
      200,
    );
    assert.equal(await count(db, 'diagnostic_reports'), 0);
  },
  { enabled: 'false' },
);
await test('stale heartbeat blocks intake but not verified deletion', async ({
  mf,
  db,
}) => {
  const body = envelope();
  assert.equal((await request(mf, { data: body })).status, 201);
  await db
    .prepare('UPDATE diagnostic_retention_health SET last_cleanup=?')
    .bind(now - 7201)
    .run();
  assert.equal((await request(mf)).status, 503);
  assert.deepEqual(await (await request(mf, { method: 'GET' })).json(), {
    enabled: false,
    canDelete: true,
  });
  assert.equal(
    (
      await request(mf, {
        method: 'DELETE',
        data: { receipt_id: body.receipt_id, delete_key: body.delete_key },
      })
    ).status,
    200,
  );
});
await test('malformed network header fails closed without persistence', async ({
  mf,
  db,
}) => {
  for (const ip of [
    'invalid',
    '1.2.3.4, 5.6.7.8',
    '127.1',
    'fe80::1%zone',
    '[::1]',
  ])
    assert.equal((await request(mf, { ip })).status, 503, ip);
  assert.equal(await count(db, 'diagnostic_rate_attempts'), 0);
  assert.equal(await count(db, 'diagnostic_rate_salt'), 0);
  assert.equal(await count(db, 'diagnostic_reports'), 0);
});
await test(
  'missing full migration fails closed',
  async ({ mf }) => {
    for (const method of ['GET', 'POST', 'DELETE'])
      assert.equal((await request(mf, { method })).status, 503);
  },
  { migrate: false },
);
for (const table of ['diagnostic_rate_attempts', 'diagnostic_rate_salt']) {
  await test(`missing ${table} blocks all writes including DELETE; never claims receipt`, async ({
    mf,
    db,
  }) => {
    const body = envelope();
    assert.equal((await request(mf, { data: body })).status, 201);
    await db.prepare(`DROP TABLE ${table}`).run();
    for (const method of ['GET', 'POST', 'DELETE']) {
      const response = await request(mf, {
        method,
        data:
          method === 'DELETE'
            ? { receipt_id: body.receipt_id, delete_key: body.delete_key }
            : envelope(),
      });
      assert.equal(response.status, 503);
      assert.equal((await response.json()).ok, undefined);
    }
    assert.equal(await count(db, 'diagnostic_reports'), 1);
  });
}
await test('failed cleanup rolls back expiry deletion and does not refresh heartbeat', async ({
  mf,
  db,
}) => {
  const body = envelope();
  await request(mf, { data: body });
  await db
    .prepare('UPDATE diagnostic_reports SET expires_at=?')
    .bind(now - 1)
    .run();
  await db
    .prepare('UPDATE diagnostic_retention_health SET last_cleanup=?')
    .bind(now - 7201)
    .run();
  await db.prepare('DROP TABLE diagnostic_rate_salt').run();
  assert.equal(
    (await request(mf, { path: '/cleanup', at: clock + 61 })).status,
    503,
  );
  assert.equal(
    await count(db, 'diagnostic_rate_attempts'),
    1,
    'D1 batch rolled back first statement',
  );
  assert.equal(await count(db, 'diagnostic_reports'), 1);
  assert.equal(
    (
      await db
        .prepare('SELECT last_cleanup FROM diagnostic_retention_health')
        .first()
    ).last_cleanup,
    now - 7201,
  );
});
console.log(
  'PASS: 13 real local D1 groups. No remote resource, credentials, deployment or production config used.',
);
