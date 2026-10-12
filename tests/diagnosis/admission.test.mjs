// Real local D1 SQL and transactions; no network, account, or remote DB access.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))(
  'miniflare',
);
const compiled = await build({
  stdin: {
    resolveDir: process.cwd(),
    loader: 'ts',
    contents: `
 import {reserveAdmission} from './lib/diagnosis/admission';
 import {cleanupDiagnosis} from './lib/diagnosis/cleanup';
 import {handleDiagnosis} from './lib/diagnosis/server';
 import {handleFeedback} from './lib/diagnostic-feedback/service';
 const broken = (db, marker, mode) => ({
   prepare(sql) { const prepared=db.prepare(sql); if(!sql.includes(marker)) return prepared;
     return { bind(...values) { const bound=prepared.bind(...values); return {
       async run(){ if(mode==='throw') throw new Error('PRIVATE PROVIDER'); return {success:false,meta:{changes:0}} }
     } } }
   },
   async batch(stmts) {
     if(mode==='lost-batch') { await db.batch(stmts); throw new Error('response lost'); }
     const result=await db.batch(stmts);
     return mode==='failed-batch' ? result.map((r,i)=>i===3?{...r,success:false}:r) : result;
   }
 });
 export default {async fetch(r,e) {
   const url=new URL(r.url), now=Number(r.headers.get('x-test-now') || Date.now());
   const mode=r.headers.get('x-test-failure');
   const env={...e};
   if(mode) {
     env.DIAGNOSIS_DB=broken(e.DIAGNOSIS_DB,'INSERT INTO diagnosis_shared (',mode);
     env.FEEDBACK_DB=broken(e.FEEDBACK_DB,'INSERT OR IGNORE INTO diagnostic_reports',mode);
   }
   try {
     if(url.pathname==='/reserve') { const {kind,id}=await r.json(); return Response.json({result:await reserveAdmission(env.DIAGNOSIS_DB,kind,id,now)}); }
     if(url.pathname==='/cleanup') { await cleanupDiagnosis(e.DIAGNOSIS_DB,now); return new Response(null,{status:204}); }
     if(url.pathname.startsWith('/api/diagnosis')) return handleDiagnosis(r,env,now);
     return handleFeedback(r,env,Math.floor(now/1000));
   } catch { return Response.json({error:'unavailable'}, {status:503}); }
 }};
 `,
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'browser',
  external: ['node:net'],
});
const totalKey = 'admission:total:v1',
  prefix = 'salt:admission:v1:',
  ttl = 30 * 86400000;
const now = Math.floor(Date.now() / 1000) * 1000,
  origin = 'https://admission.test';
let passed = 0;
async function test(name, fn) {
  const mf = new Miniflare({
    modules: true,
    script: compiled.outputFiles[0].text,
    compatibilityDate: '2026-05-22',
    compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['DIAGNOSIS_DB', 'FEEDBACK_DB'],
    bindings: {
      DIAGNOSIS_ENABLED: 'true',
      DIAGNOSIS_LOCAL_BETA: 'false',
      DIAGNOSIS_STORAGE_ENABLED: 'true',
      DIAGNOSIS_SHARING_ENABLED: 'true',
      DIAGNOSIS_WRITES_ENABLED: 'true',
      DIAGNOSIS_METRICS_ENABLED: 'false',
      FEEDBACK_ENABLED: 'true',
    },
  });
  try {
    const db = await mf.getD1Database('DIAGNOSIS_DB'),
      feedback = await mf.getD1Database('FEEDBACK_DB');
    for (const [target, path] of [
      [db, 'migrations/diagnosis/0001_diagnosis.sql'],
      [feedback, 'migrations/diagnostic-feedback/0001.sql'],
    ])
      await target.exec(
        (await readFile(path, 'utf8'))
          .replace(/--[^\n]*/g, '')
          .replace(/\n/g, ' '),
      );
    await db
      .prepare("INSERT INTO diagnosis_operations VALUES('cleanup_success',?,?)")
      .bind(String(now), now + 7200000)
      .run();
    await feedback
      .prepare('INSERT INTO diagnostic_retention_health VALUES(1,?)')
      .bind(now / 1000)
      .run();
    const request = (
      path,
      body,
      extra = {},
      method = body === undefined ? 'GET' : 'POST',
    ) =>
      mf.dispatchFetch(origin + path, {
        method,
        headers: {
          Origin: origin,
          'Content-Type': 'application/json',
          'X-Diagnosis-Request': '1',
          'CF-Connecting-IP': '192.0.2.44',
          'x-test-now': String(now),
          ...extra,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    const reserve = async (id, kind = 'diagnosis', extra = {}) =>
      (await (await request('/reserve', { kind, id }, extra)).json()).result;
    const count = async () =>
      Number(
        (
          await db
            .prepare('SELECT value FROM diagnosis_operations WHERE key=?')
            .bind(totalKey)
            .first()
        )?.value || 0,
      );
    await fn({ db, feedback, request, reserve, count });
    passed++;
    console.log('PASS', name);
  } finally {
    await mf.dispose();
  }
}
const snapshot = {
  answers: {
    symptom: 'not-launching',
    scope: 'game',
    observation: 'error',
    error: 'directx',
    change: 'none',
    launcher: 'steam',
    os: 'windows11',
    gpu: 'nvidia',
    ram: '32',
  },
  tried: { verify: 'unchanged' },
  results: { dx: 'tried' },
  version: '2026-10-10.1',
};
const cookie = '__Host-gemnao-diagnosis=' + 'a'.repeat(64);
const diag = (id = 'b'.repeat(32)) => ({ snapshot, requestId: id });
function envelope() {
  const key = 'c'.repeat(64);
  return {
    receipt_id:
      (now / 1000).toString(16).padStart(8, '0') +
      createHash('sha256').update(key).digest('hex').slice(0, 24),
    delete_key: key,
    consent_version: 1,
    report: {
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
    },
  };
}
await test('simultaneous retries reserve one slot; diagnosis and feedback share the counter', async ({
  reserve,
  count,
}) => {
  const results = await Promise.all(
    Array.from({ length: 24 }, () => reserve('same-request')),
  );
  assert.equal(results.filter((x) => x === 'new').length, 1);
  assert.equal(results.filter((x) => x === 'used').length, 23);
  assert.equal(await count(), 1);
  assert.equal(await reserve('same-request', 'feedback'), 'new');
  assert.equal(await count(), 2);
});
await test('499 boundary admits exactly one combined request; full counter never resets', async ({
  db,
  reserve,
  count,
  request,
}) => {
  await db
    .prepare("INSERT INTO diagnosis_operations VALUES(?,'499',0)")
    .bind(totalKey)
    .run();
  const results = await Promise.all(
    Array.from({ length: 24 }, (_, i) =>
      reserve('request-' + i, i % 2 ? 'diagnosis' : 'feedback'),
    ),
  );
  assert.equal(results.filter((x) => x === 'new').length, 1);
  assert.equal(results.filter((x) => x === 'full').length, 23);
  assert.equal(await count(), 500);
  const winner = results.indexOf('new');
  assert.equal(
    await reserve('request-' + winner, winner % 2 ? 'diagnosis' : 'feedback'),
    'used',
  );
  await request('/cleanup', {}, { 'x-test-now': String(now + ttl + 1) });
  assert.equal(await count(), 500);
  assert.equal(
    await reserve('new-after-cleanup', 'diagnosis', {
      'x-test-now': String(now + ttl + 1),
    }),
    'full',
  );
});
await test('fingerprints expire without extending on retry; only aggregate survives cleanup', async ({
  db,
  reserve,
  count,
  request,
}) => {
  assert.equal(await reserve('private-request'), 'new');
  const first = await db
    .prepare(
      'SELECT key,value,expires_at FROM diagnosis_operations WHERE key LIKE ?',
    )
    .bind(prefix + '%')
    .first();
  assert.equal(first.expires_at, now + ttl);
  assert.ok(!JSON.stringify(first).includes('private-request'));
  assert.equal(
    await reserve('private-request', 'diagnosis', {
      'x-test-now': String(now + 1000),
    }),
    'used',
  );
  assert.equal(
    (
      await db
        .prepare('SELECT expires_at FROM diagnosis_operations WHERE key=?')
        .bind(first.key)
        .first()
    ).expires_at,
    first.expires_at,
  );
  await request('/cleanup', {}, { 'x-test-now': String(now + ttl + 1) });
  assert.equal(
    (
      await db
        .prepare('SELECT count(*) n FROM diagnosis_operations WHERE key LIKE ?')
        .bind(prefix + '%')
        .first()
    ).n,
    0,
  );
  assert.equal(await count(), 1);
  assert.equal(
    await reserve('private-request', 'diagnosis', {
      'x-test-now': String(now + ttl + 1),
    }),
    'new',
  );
  assert.equal(await count(), 2);
});
await test('counter corruption and stale cleanup stop admission', async ({
  db,
  reserve,
  request,
  count,
}) => {
  await db
    .prepare("INSERT INTO diagnosis_operations VALUES(?,'1x',0)")
    .bind(totalKey)
    .run();
  assert.equal(
    (await request('/reserve', { kind: 'feedback', id: 'x' })).status,
    503,
  );
  assert.equal(
    (
      await db
        .prepare('SELECT count(*) n FROM diagnosis_operations WHERE key LIKE ?')
        .bind(prefix + '%')
        .first()
    ).n,
    0,
  );
  await db
    .prepare("UPDATE diagnosis_operations SET value='0' WHERE key=?")
    .bind(totalKey)
    .run();
  await db
    .prepare(
      "UPDATE diagnosis_operations SET value='0' WHERE key='cleanup_success'",
    )
    .run();
  assert.equal(await reserve('x'), undefined);
  assert.equal(await count(), 0);
  assert.equal(
    (await request('/api/diagnostic-feedback', envelope())).status,
    503,
  );
});
for (const feature of ['diagnosis', 'feedback']) {
  await test(`${feature}: failed payload write consumes once; retry never recreates or claims success`, async ({
    request,
    count,
    db,
    feedback,
  }) => {
    const path =
        feature === 'diagnosis' ? '/api/diagnosis' : '/api/diagnostic-feedback',
      body = feature === 'diagnosis' ? diag() : envelope(),
      headers = feature === 'diagnosis' ? { Cookie: cookie } : {};
    const failed = await request(path, body, {
      ...headers,
      'x-test-failure': 'false',
    });
    assert.equal(failed.status, 503);
    assert.equal(await count(), 1);
    assert.equal((await request(path, body, headers)).status, 503);
    assert.equal(await count(), 1);
    const target = feature === 'diagnosis' ? db : feedback,
      table =
        feature === 'diagnosis' ? 'diagnosis_shared' : 'diagnostic_reports';
    assert.equal(
      (await target.prepare('SELECT count(*) n FROM ' + table).first()).n,
      0,
    );
  });
}
await test('lost reservation response is not counted twice and cannot produce an unconfirmed payload', async ({
  request,
  count,
}) => {
  const first = await request('/api/diagnosis', diag(), {
    Cookie: cookie,
    'x-test-failure': 'lost-batch',
  });
  assert.equal(first.status, 503);
  assert.equal(await count(), 1);
  assert.equal(
    (await request('/api/diagnosis', diag(), { Cookie: cookie })).status,
    503,
  );
  assert.equal(await count(), 1);
});
await test('explicit failed D1 batch result never confirms payload success', async ({
  request,
  count,
  db,
}) => {
  assert.equal(
    (
      await request('/api/diagnosis', diag(), {
        Cookie: cookie,
        'x-test-failure': 'failed-batch',
      })
    ).status,
    503,
  );
  assert.equal(await count(), 1);
  assert.equal(
    (await db.prepare('SELECT count(*) n FROM diagnosis_shared').first()).n,
    0,
  );
  assert.equal(
    (await request('/api/diagnosis', diag(), { Cookie: cookie })).status,
    503,
  );
  assert.equal(await count(), 1);
});
await test('concurrent API retries persist one payload per feature and consume two total slots', async ({
  request,
  count,
  db,
  feedback,
}) => {
  const f = envelope();
  const responses = await Promise.all([
    ...Array.from({ length: 4 }, () =>
      request('/api/diagnosis', diag(), { Cookie: cookie }),
    ),
    ...Array.from({ length: 4 }, () => request('/api/diagnostic-feedback', f)),
  ]);
  assert.equal(responses.filter((r) => r.status === 201).length, 2);
  assert.ok(responses.every((r) => [200, 201, 503].includes(r.status)));
  assert.equal(await count(), 2);
  assert.equal(
    (await db.prepare('SELECT count(*) n FROM diagnosis_shared').first()).n,
    1,
  );
  assert.equal(
    (
      await feedback
        .prepare('SELECT count(*) n FROM diagnostic_reports')
        .first()
    ).n,
    1,
  );
  assert.equal(
    (await request('/api/diagnosis', diag(), { Cookie: cookie })).status,
    200,
  );
  assert.equal((await request('/api/diagnostic-feedback', f)).status, 200);
  assert.equal(await count(), 2);
});
await test('both successful APIs use the same allowance; retries and owner deletion do not refund', async ({
  request,
  count,
  db,
}) => {
  const d = await request('/api/diagnosis', diag(), { Cookie: cookie });
  assert.equal(d.status, 201, await d.clone().text());
  const saved = await d.json();
  const f = envelope();
  assert.equal((await request('/api/diagnostic-feedback', f)).status, 201);
  assert.equal(await count(), 2);
  assert.equal(
    (await request('/api/diagnosis', diag(), { Cookie: cookie })).status,
    200,
  );
  assert.equal((await request('/api/diagnostic-feedback', f)).status, 200);
  assert.equal(await count(), 2);
  await db
    .prepare("UPDATE diagnosis_operations SET value='500' WHERE key=?")
    .bind(totalKey)
    .run();
  assert.equal(
    (await (await request('/api/diagnosis/config')).json()).sharing,
    false,
  );
  assert.equal(
    (await (await request('/api/diagnostic-feedback')).json()).enabled,
    false,
  );
  assert.equal(
    (await request('/api/diagnosis', diag('e'.repeat(32)), { Cookie: cookie }))
      .status,
    429,
  );
  assert.equal(
    (
      await request(
        '/api/diagnosis/' + saved.id,
        {},
        { Cookie: cookie },
        'DELETE',
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        '/api/diagnostic-feedback',
        { receipt_id: f.receipt_id, delete_key: f.delete_key },
        {},
        'DELETE',
      )
    ).status,
    200,
  );
  assert.equal(await count(), 500);
  assert.equal(
    (await request('/api/diagnosis', diag(), { Cookie: cookie })).status,
    503,
  );
  assert.equal((await request('/api/diagnostic-feedback', f)).status, 409);
});
console.log(`${passed} admission groups passed`);
