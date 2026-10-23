// Synthetic-only local D1. Never loads wrangler production config or remote data.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))(
  'miniflare',
);
const fixture = JSON.parse(
  await readFile(
    process.env.PRIVATE_NATIVE_FIXTURE || '/tmp/private-native-fixture.json',
    'utf8',
  ),
);
const bundled = await build({
  stdin: {
    contents: `import {handlePrivateDiagnostic} from './lib/private-diagnostic/service';import {handlePrivateAdmin} from './lib/private-diagnostic/admin';import cleanup from './cloudflare/private-diagnostic-cleanup';export default {async fetch(r,e){const p=new URL(r.url).pathname;if(p==='/cleanup'){await cleanup.scheduled({},e);return new Response(null,{status:204});}const runtime={...e,PRIVATE_DIAGNOSTIC_ENABLED:r.headers.get('x-test-off')?'false':'true',PRIVATE_DIAGNOSTIC_OWNER_REVIEW_ENABLED:r.headers.get('x-test-review-off')?'false':'true'};if(r.headers.get('x-test-missing'))delete runtime.PRIVATE_DIAGNOSTIC_DB;if(r.headers.get('x-test-storage-failure'))runtime.PRIVATE_DIAGNOSTIC_DB={prepare(sql){if(sql.startsWith('INSERT OR IGNORE INTO diagnostic_reports'))throw Error('synthetic failure');return e.PRIVATE_DIAGNOSTIC_DB.prepare(sql);},batch(statements){return e.PRIVATE_DIAGNOSTIC_DB.batch(statements);}};if(p==='/admin')return handlePrivateAdmin(r,runtime,async()=>r.headers.get('x-test-owner')==='yes');return handlePrivateDiagnostic(r,runtime);}}`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'esm',
  external: ['node:net'],
});
const mf = new Miniflare({
  modules: true,
  script: bundled.outputFiles[0].text,
  compatibilityDate: '2026-05-22',
  compatibilityFlags: ['nodejs_compat'],
  d1Databases: ['PRIVATE_DIAGNOSTIC_DB'],
});
const db = await mf.getD1Database('PRIVATE_DIAGNOSTIC_DB');
const sql = await readFile('migrations/private-diagnostic/0001.sql', 'utf8');
await db.exec(sql.replace(/--[^\n]*/g, '').replace(/\n/g, ' '));
const now = Math.floor(Date.now() / 1000),
  origin = 'https://private.test';
let serial = 0,
  passed = 0;
function envelope() {
  const key = (++serial).toString(16).padStart(64, '0');
  return {
    receipt_id:
      now.toString(16).padStart(8, '0') +
      createHash('sha256').update(key).digest('hex').slice(0, 24),
    delete_key: key,
    consent_version: 1,
    report: structuredClone(fixture),
  };
}
async function req(
  method = 'GET',
  body,
  headers = {},
  path = '/api/private-diagnostic',
) {
  return mf.dispatchFetch(origin + path, {
    method,
    headers: {
      origin,
      'sec-fetch-site': 'same-origin',
      'cf-connecting-ip': '192.0.2.1',
      'content-type': 'application/json',
      ...headers,
    },
    ...(body === undefined
      ? {}
      : { body: typeof body === 'string' ? body : JSON.stringify(body) }),
  });
}
async function reset() {
  await db.batch([
    db.prepare('DELETE FROM diagnostic_reports'),
    db.prepare('DELETE FROM diagnostic_report_tombstones'),
    db.prepare('DELETE FROM diagnostic_rate_attempts'),
    db
      .prepare('INSERT OR REPLACE INTO diagnostic_retention_health VALUES(1,?)')
      .bind(now),
  ]);
}
async function test(name, fn) {
  await reset();
  await fn();
  passed++;
  console.log('PASS ' + name);
}
try {
  await test('default closed and no DB fallback', async () => {
    assert.equal(
      (await req('POST', envelope(), { 'x-test-off': '1' })).status,
      503,
    );
    assert.deepEqual(
      await (await req('GET', undefined, { 'x-test-missing': '1' })).json(),
      { enabled: false, canDelete: false },
    );
  });
  await test('owner readiness is required before intake', async () => {
    assert.equal(
      (await req('POST', envelope(), { 'x-test-review-off': '1' })).status,
      503,
    );
    assert.equal(
      (await db.prepare('SELECT count(*) n FROM diagnostic_reports').first()).n,
      0,
    );
  });
  await test('write failure never claims storage success', async () => {
    const response = await req('POST', envelope(), {
      'x-test-storage-failure': '1',
    });
    assert.equal(response.status, 503);
    const value = await response.json();
    assert.notEqual(value.ok, true);
    assert(!JSON.stringify(value).includes('synthetic failure'));
    assert.equal(
      (await db.prepare('SELECT count(*) n FROM diagnostic_reports').first()).n,
      0,
    );
  });
  await test('native fixture accepted; persisted receipt and no public body GET', async () => {
    const e = envelope(),
      r = await req('POST', e);
    assert.equal(r.status, 201);
    assert.equal((await r.json()).receipt_id, e.receipt_id);
    const v = await (await req()).json();
    assert.deepEqual(Object.keys(v).sort(), ['canDelete', 'enabled']);
    assert.equal(
      (
        await req(
          'GET',
          undefined,
          {},
          '/api/private-diagnostic?id=' + e.receipt_id,
        )
      ).status,
      403,
    );
  });
  await test('explicit consent, unknown fields, malformed JSON and cap rejected', async () => {
    let e = envelope();
    delete e.consent_version;
    assert.equal((await req('POST', e)).status, 400);
    e = envelope();
    e.report.raw_log = 'SYNTHETIC_REJECT';
    assert.equal((await req('POST', e)).status, 400);
    assert.equal((await req('POST', '{"a":1,"a":2}')).status, 400);
    assert.equal((await req('POST', 'x'.repeat(6145))).status, 400);
    e = envelope();
    e.report.observed.application.exact_matches = 1;
    assert.equal((await req('POST', e)).status, 400);
  });
  await test('cross-origin and unsupported methods rejected', async () => {
    assert.equal(
      (await req('POST', envelope(), { origin: 'https://other.test' })).status,
      403,
    );
    assert.equal(
      (await req('POST', envelope(), { 'sec-fetch-site': 'cross-site' }))
        .status,
      403,
    );
    assert.equal((await req('PUT', envelope())).status, 405);
  });
  await test('concurrent retries store once; changed payload conflicts', async () => {
    const e = envelope();
    const rs = await Promise.all(
      Array.from({ length: 5 }, () => req('POST', e)),
    );
    assert(rs.every((r) => [200, 201].includes(r.status)));
    assert.equal(
      (await db.prepare('SELECT count(*) n FROM diagnostic_reports').first()).n,
      1,
    );
    e.report.symptom = 'freeze';
    assert.equal((await req('POST', e)).status, 409);
  });
  await test('freshness and key binding rejected before storage', async () => {
    let e = envelope();
    e.receipt_id = '00000000' + e.receipt_id.slice(8);
    assert.equal((await req('POST', e)).status, 400);
    e = envelope();
    e.delete_key = 'f'.repeat(64);
    assert.equal((await req('POST', e)).status, 409);
  });
  await test('stale cleanup stops intake but deletion works when intake off', async () => {
    const e = envelope();
    await req('POST', e);
    await db
      .prepare('UPDATE diagnostic_retention_health SET last_cleanup=?')
      .bind(now - 7201)
      .run();
    assert.equal((await req('POST', envelope())).status, 503);
    assert.equal(
      (
        await req(
          'DELETE',
          { receipt_id: e.receipt_id, delete_key: e.delete_key },
          { 'x-test-off': '1' },
        )
      ).status,
      200,
    );
    assert.equal(
      (await db.prepare('SELECT count(*) n FROM diagnostic_reports').first()).n,
      0,
    );
  });
  await test('cancel before delayed post prevents resurrection', async () => {
    const e = envelope();
    assert.equal(
      (
        await req('DELETE', {
          receipt_id: e.receipt_id,
          delete_key: e.delete_key,
        })
      ).status,
      200,
    );
    assert.equal((await req('POST', e)).status, 409);
  });
  await test('admin auth and owner enable gate; list excludes secrets; detail sanitized', async () => {
    const e = envelope();
    await req('POST', e);
    assert.equal((await req('GET', undefined, {}, '/admin')).status, 401);
    assert.equal(
      (
        await req(
          'GET',
          undefined,
          { 'x-test-owner': 'yes', 'x-test-review-off': '1' },
          '/admin',
        )
      ).status,
      401,
    );
    const r = await req('GET', undefined, { 'x-test-owner': 'yes' }, '/admin');
    assert.match(r.headers.get('cache-control'), /no-store/);
    const list = await r.json();
    assert.equal(list.items.length, 1);
    assert(!JSON.stringify(list).includes('delete'));
    assert(!JSON.stringify(list).includes('report_json'));
    const detail = await (
      await req(
        'GET',
        undefined,
        { 'x-test-owner': 'yes' },
        '/admin?id=' + e.receipt_id,
      )
    ).json();
    assert.deepEqual(detail.report, fixture);
    assert(!JSON.stringify(detail).includes(e.delete_key));
    assert.equal(
      (
        await req(
          'GET',
          undefined,
          { 'x-test-owner': 'yes' },
          '/admin?id=invalid',
        )
      ).status,
      400,
    );
  });
  await test('expiry hidden before cleanup, scheduled deletion and healthy receipt', async () => {
    const e = envelope();
    await req('POST', e);
    await db
      .prepare('UPDATE diagnostic_reports SET expires_at=?')
      .bind(now - 1)
      .run();
    assert.equal(
      (
        await req(
          'GET',
          undefined,
          { 'x-test-owner': 'yes' },
          '/admin?id=' + e.receipt_id,
        )
      ).status,
      404,
    );
    assert.equal((await req('GET', undefined, {}, '/cleanup')).status, 204);
    assert.equal(
      (await db.prepare('SELECT count(*) n FROM diagnostic_reports').first()).n,
      0,
    );
  });
  await test('independent deletion quota, bounded admission attempts', async () => {
    for (let i = 0; i < 10; i++) assert.equal((await req()).status, 200);
    assert.equal((await req()).status, 429);
    const e = envelope();
    assert.equal(
      (
        await req('DELETE', {
          receipt_id: e.receipt_id,
          delete_key: e.delete_key,
        })
      ).status,
      200,
    );
    assert(
      (
        await db
          .prepare('SELECT count(*) n FROM diagnostic_rate_attempts')
          .first()
      ).n <= 20,
    );
  });
  await test('combined retained cap preserves deletion and prevents unbounded tombstones', async () => {
    const e = envelope();
    await req('POST', e);
    await db.exec(
      `WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<999) INSERT INTO diagnostic_report_tombstones SELECT printf('%032x',x),printf('%064x',x),${now + 86400} FROM n`,
    );
    assert.equal((await req('POST', envelope())).status, 429);
    const fresh = envelope();
    assert.equal(
      (
        await req('DELETE', {
          receipt_id: fresh.receipt_id,
          delete_key: fresh.delete_key,
        })
      ).status,
      429,
    );
    assert.equal(
      (
        await req('DELETE', {
          receipt_id: e.receipt_id,
          delete_key: e.delete_key,
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await db
          .prepare('SELECT count(*) n FROM diagnostic_report_tombstones')
          .first()
      ).n,
      1000,
    );
  });
  await test('read-only admin pagination is bounded and expired rows excluded', async () => {
    await db
      .prepare(
        `WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<25) INSERT INTO diagnostic_reports SELECT printf('%032x',x),printf('%064x',x),?,1,?,? FROM n`,
      )
      .bind(JSON.stringify(fixture), now, now + 100)
      .run();
    const first = await (
      await req('GET', undefined, { 'x-test-owner': 'yes' }, '/admin')
    ).json();
    assert.equal(first.items.length, 20);
    const second = await (
      await req(
        'GET',
        undefined,
        { 'x-test-owner': 'yes' },
        '/admin?before=' + first.next,
      )
    ).json();
    assert.equal(second.items.length, 5);
    assert.equal(second.next, null);
  });
  console.log(
    `PASS ${passed} synthetic local D1 groups; no remote database or credentials used`,
  );
} finally {
  await mf.dispose();
}
