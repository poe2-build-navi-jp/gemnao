import { createHash } from 'node:crypto';
/* oxlint-disable unicorn/no-invalid-fetch-options -- req test helper defaults to POST, never GET. */
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
await build({
  entryPoints: [
    'lib/diagnostic-feedback/service.ts',
    'lib/diagnostic-feedback/contract.ts',
    'lib/diagnostic-feedback/json.ts',
    'cloudflare/diagnostic-feedback-cleanup.ts',
  ],
  outdir: '.tmp-feedback-test',
  platform: 'node',
  format: 'esm',
  bundle: true,
});
const { handleFeedback } =
  await import('../../.tmp-feedback-test/lib/diagnostic-feedback/service.js');
const { parseReport } =
  await import('../../.tmp-feedback-test/lib/diagnostic-feedback/contract.js');
const { strictJson } =
  await import('../../.tmp-feedback-test/lib/diagnostic-feedback/json.js');
const cleanup = (
  await import('../../.tmp-feedback-test/cloudflare/diagnostic-feedback-cleanup.js')
).default;
const sql = new DatabaseSync(':memory:');
sql.exec(readFileSync('migrations/diagnostic-feedback/0001.sql', 'utf8'));
const db = {
  prepare(query) {
    let args = [];
    return {
      bind(...values) {
        args = values;
        return this;
      },
      async first() {
        return sql.prepare(query).get(...args) || null;
      },
      async run() {
        const r = sql.prepare(query).run(...args);
        return { success: true, meta: { changes: Number(r.changes) } };
      },
    };
  },
  async batch(queries) {
    sql.exec('BEGIN');
    try {
      const r = [];
      for (const q of queries) r.push(await q.run());
      sql.exec('COMMIT');
      return r;
    } catch (e) {
      sql.exec('ROLLBACK');
      throw e;
    }
  },
};
const now = Math.floor(Date.now() / 1000);
let tests = 0;
const test = async (name, fn) => {
  await fn();
  tests++;
  console.log('PASS', name);
};
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
let seq = 0;
const envelope = () => {
  const key = (++seq).toString(16).padStart(64, '0');
  return {
    report,
    consent_version: 1,
    receipt_id:
      now.toString(16).padStart(8, '0') +
      createHash('sha256').update(key).digest('hex').slice(0, 24),
    delete_key: key,
  };
};
const env = {
  FEEDBACK_ENABLED: 'true',
  FEEDBACK_DB: db,
  FEEDBACK_RATE_LIMIT: {
    async limit() {
      return { success: true };
    },
  },
};
const req = (data, method = 'POST', extra = {}) =>
  new Request('https://test.invalid/api/diagnostic-feedback', {
    method,
    headers: {
      origin: 'https://test.invalid',
      'content-type': 'application/json',
      'cf-connecting-ip': '192.0.2.1',
      ...extra,
    },
    body: typeof data === 'string' ? data : JSON.stringify(data),
  });
await test('strict allowlist and nested duplicate rejection', () => {
  assert.deepEqual(parseReport(report), report);
  for (const value of [
    { ...report, path: 'x' },
    { ...report, tool_version: 'host' },
    { ...report, actions: [...report.actions, ...report.actions] },
    { ...report, actions: [{ ...report.actions[0], evidence: 'observed' }] },
  ])
    assert.throws(() => parseReport(value));
  assert.throws(() => strictJson('{"a":1,"\\u0061":2}'));
  assert.throws(() => strictJson('{"a":{"b":1,"b":2}}'));
});
await test('missing settings and stale heartbeat fail closed', async () => {
  assert.equal((await handleFeedback(req(envelope()), {})).status, 503);
  assert.equal((await handleFeedback(req(envelope()), env)).status, 503);
});
await cleanup.scheduled({}, env);
await test('stale cleanup heartbeat blocks collection', async () => {
  assert.equal(
    (await handleFeedback(req(envelope()), env, now + 7201)).status,
    503,
  );
});
await test('create, retry and changed-payload conflict', async () => {
  const body = envelope();
  assert.equal((await handleFeedback(req(body), env)).status, 201);
  assert.equal((await handleFeedback(req(body), env)).status, 200);
  assert.equal(
    (await handleFeedback(req({ ...body, delete_key: 'b'.repeat(64) }), env))
      .status,
    409,
  );
  assert.equal(
    (
      await handleFeedback(
        req({ ...body, report: { ...report, symptom: 'unknown' } }),
        env,
      )
    ).status,
    409,
  );
  assert.equal(
    sql.prepare('SELECT count(*) AS n FROM diagnostic_reports').get().n,
    1,
  );
});
await test('delete requires secret; correct delete blocks retry resurrection', async () => {
  const body = envelope();
  await handleFeedback(req(body), env);
  await handleFeedback(
    req({ receipt_id: body.receipt_id, delete_key: 'b'.repeat(64) }, 'DELETE'),
    env,
  );
  assert.equal((await handleFeedback(req(body), env)).status, 200);
  await handleFeedback(
    req({ receipt_id: body.receipt_id, delete_key: body.delete_key }, 'DELETE'),
    env,
  );
  assert.equal((await handleFeedback(req(body), env)).status, 409);
});
await test('oversize, duplicate, cross-origin, unknown envelope rejected', async () => {
  assert.equal((await handleFeedback(req(' '.repeat(6200)), env)).status, 400);
  assert.equal(
    (
      await handleFeedback(
        req(envelope(), 'POST', { origin: 'https://evil.invalid' }),
        env,
      )
    ).status,
    403,
  );
  assert.equal(
    (await handleFeedback(req({ ...envelope(), path: 'x' }), env)).status,
    400,
  );
  assert.equal(
    (await handleFeedback(req('{"receipt_id":"x","receipt_id":"y"}'), env))
      .status,
    400,
  );
});
await test('new expired receipt rejected', async () => {
  assert.equal(
    (
      await handleFeedback(
        req({
          ...envelope(),
          delete_key: 'a'.repeat(64),
          receipt_id:
            (now - 86401).toString(16) +
            createHash('sha256')
              .update('a'.repeat(64))
              .digest('hex')
              .slice(0, 24),
        }),
        env,
      )
    ).status,
    400,
  );
});
await test('rate limiter denial stops writes', async () => {
  assert.equal(
    (
      await handleFeedback(req(envelope()), {
        ...env,
        FEEDBACK_RATE_LIMIT: {
          async limit() {
            return { success: false };
          },
        },
      })
    ).status,
    429,
  );
});
await test('database failure never claims success', async () => {
  assert.equal(
    (
      await handleFeedback(req(envelope()), {
        ...env,
        FEEDBACK_DB: {
          prepare() {
            throw Error('db');
          },
        },
      })
    ).status,
    503,
  );
});
await test('daily global cap enforced by SQL', async () => {
  sql.exec('DELETE FROM diagnostic_reports');
  for (let i = 0; i < 200; i++)
    assert.equal((await handleFeedback(req(envelope()), env)).status, 201);
  assert.equal((await handleFeedback(req(envelope()), env)).status, 429);
  assert.equal(
    sql.prepare('SELECT count(*) AS n FROM diagnostic_reports').get().n,
    200,
  );
});
await test('scheduled cleanup deletes expired rows and records health', async () => {
  sql.prepare('UPDATE diagnostic_reports SET expires_at=?').run(now - 1);
  sql
    .prepare('UPDATE diagnostic_report_tombstones SET expires_at=?')
    .run(now - 1);
  await cleanup.scheduled({}, env);
  assert.equal(
    sql.prepare('SELECT count(*) AS n FROM diagnostic_reports').get().n,
    0,
  );
  assert.equal(
    sql.prepare('SELECT count(*) AS n FROM diagnostic_report_tombstones').get()
      .n,
    0,
  );
  assert.ok(
    sql.prepare('SELECT last_cleanup FROM diagnostic_retention_health').get()
      .last_cleanup >= now,
  );
});

await test('disabled GET never reads D1 and enabled GET is rate limited before D1', async () => {
  const broken = {
    prepare() {
      throw Error('must not read');
    },
  };
  let result = await handleFeedback(
    new Request('https://test.invalid/api/diagnostic-feedback'),
    { FEEDBACK_DB: broken },
  );
  assert.equal(result.status, 200);
  assert.equal((await result.json()).enabled, false);
  result = await handleFeedback(
    new Request('https://test.invalid/api/diagnostic-feedback', {
      headers: { 'cf-connecting-ip': '192.0.2.1' },
    }),
    {
      ...env,
      FEEDBACK_DB: broken,
      FEEDBACK_RATE_LIMIT: {
        async limit() {
          return { success: false };
        },
      },
    },
  );
  assert.equal(result.status, 429);
});
await test('INSERT failure never returns a receipt success', async () => {
  const failing = {
    ...db,
    prepare(query) {
      if (query.startsWith('INSERT OR IGNORE INTO diagnostic_reports'))
        return {
          bind() {
            return this;
          },
          async run() {
            return { success: false, meta: { changes: 0 } };
          },
        };
      return db.prepare(query);
    },
  };
  assert.equal(
    (await handleFeedback(req(envelope()), { ...env, FEEDBACK_DB: failing }))
      .status,
    503,
  );
});
await test('DELETE before delayed POST cancels with key-bound tombstone', async () => {
  const body = envelope();
  const cancel = { receipt_id: body.receipt_id, delete_key: body.delete_key };
  assert.equal((await handleFeedback(req(cancel, 'DELETE'), env)).status, 200);
  assert.equal((await handleFeedback(req(body), env)).status, 409);
  assert.equal(
    sql
      .prepare(
        'SELECT count(*) AS n FROM diagnostic_reports WHERE receipt_id=?',
      )
      .get(body.receipt_id).n,
    0,
  );
});
await test('old absent cancellation rejected but completed DELETE retry remains idempotent', async () => {
  const body = envelope();
  const cancel = { receipt_id: body.receipt_id, delete_key: body.delete_key };
  await handleFeedback(req(body), env);
  await handleFeedback(req(cancel, 'DELETE'), env);
  sql
    .prepare('UPDATE diagnostic_retention_health SET last_cleanup=?')
    .run(now + 86401);
  assert.equal(
    (await handleFeedback(req(cancel, 'DELETE'), env, now + 86401)).status,
    200,
  );
  const other = envelope();
  assert.equal(
    (
      await handleFeedback(
        req(
          { receipt_id: other.receipt_id, delete_key: other.delete_key },
          'DELETE',
        ),
        env,
        now + 86401,
      )
    ).status,
    400,
  );
  sql.prepare('UPDATE diagnostic_retention_health SET last_cleanup=?').run(now);
});
console.log(`${tests} groups passed`);
sql.close();
