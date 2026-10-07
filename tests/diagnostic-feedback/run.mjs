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
    'lib/diagnostic-feedback/rate-limit.ts',
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
let rateNow = Math.floor(Date.now() / 1000);
sql.function('unixepoch', () => rateNow);
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
  sql.exec(
    'DELETE FROM diagnostic_rate_attempts; DELETE FROM diagnostic_rate_salt',
  );
  rateNow = now;
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
await test('D1 quota denial stops writes', async () => {
  for (let i = 0; i < 10; i++)
    assert.equal((await handleFeedback(req('invalid'), env)).status, 400);
  assert.equal((await handleFeedback(req(envelope()), env)).status, 429);
  assert.equal(
    sql.prepare('SELECT count(*) AS n FROM diagnostic_rate_attempts').get().n,
    10,
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
  for (let i = 0; i < 200; i++) {
    // Advance only the quota clock to exercise the separate retained-row cap.
    rateNow += 61;
    assert.equal((await handleFeedback(req(envelope()), env)).status, 201);
  }
  rateNow += 61;
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

await test('disabled GET avoids D1; enabled status shares intake quota and preserves deletion capability', async () => {
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
  for (let i = 0; i < 10; i++) await handleFeedback(req('invalid'), env);
  result = await handleFeedback(
    new Request('https://test.invalid/api/diagnostic-feedback', {
      headers: { 'cf-connecting-ip': '192.0.2.1' },
    }),
    env,
  );
  assert.equal(result.status, 429);
  assert.equal((await result.json()).canDelete, true);
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
await test('ordinary production DB binding can never substitute for isolated feedback storage', async () => {
  let touched = false;
  const forbidden = {
    prepare() {
      touched = true;
      throw new Error('must not use ordinary DB');
    },
  };
  const wrongBinding = {
    FEEDBACK_ENABLED: 'true',
    DB: forbidden,
  };
  const response = await handleFeedback(
    new Request('https://gemnao.test/api/diagnostic-feedback'),
    wrongBinding,
  );
  assert.equal((await response.json()).enabled, false);
  assert.equal(
    (await handleFeedback(req(envelope()), wrongBinding)).status,
    503,
  );
  assert.equal(touched, false);
});
await test('owner deletion survives intake stop and stale cleanup without bypassing safeguards', async () => {
  for (const stopped of [{ ...env, FEEDBACK_ENABLED: 'false' }, env]) {
    sql.exec('DELETE FROM diagnostic_rate_attempts');
    const body = envelope();
    assert.equal((await handleFeedback(req(body), env, now)).status, 201);
    const at = stopped.FEEDBACK_ENABLED === 'false' ? now : now + 7201;
    const config = await handleFeedback(
      new Request('https://test.invalid/api/diagnostic-feedback', {
        headers: { 'cf-connecting-ip': '192.0.2.1' },
      }),
      stopped,
      at,
    );
    assert.deepEqual(await config.json(), { enabled: false, canDelete: true });
    assert.equal(
      (await handleFeedback(req(envelope()), stopped, at)).status,
      503,
    );
    const cancel = { receipt_id: body.receipt_id, delete_key: body.delete_key };
    assert.equal(
      (
        await handleFeedback(
          req(cancel, 'DELETE', { origin: 'https://other.invalid' }),
          stopped,
          at,
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await handleFeedback(
          req({ ...cancel, delete_key: 'f'.repeat(64) }, 'DELETE'),
          stopped,
          at,
        )
      ).status,
      409,
    );
    // Fill only the independent DELETE bucket, then verify a genuine denial.
    while (
      sql
        .prepare(
          "SELECT count(*) AS n FROM diagnostic_rate_attempts WHERE bucket='delete'",
        )
        .get().n < 10
    )
      await handleFeedback(req('invalid', 'DELETE'), stopped, at);
    assert.equal(
      (await handleFeedback(req(cancel, 'DELETE'), stopped, at)).status,
      429,
    );
    assert.equal(
      (
        await handleFeedback(
          req(cancel, 'DELETE'),
          { ...stopped, FEEDBACK_DB: undefined },
          at,
        )
      ).status,
      503,
    );
    rateNow += 61;
    assert.equal(
      (await handleFeedback(req(cancel, 'DELETE'), stopped, at)).status,
      200,
    );
    assert.equal(
      sql
        .prepare(
          "SELECT count(*) AS n FROM diagnostic_rate_attempts WHERE bucket='delete'",
        )
        .get().n,
      1,
    );
    assert.equal(
      sql
        .prepare(
          'SELECT count(*) AS n FROM diagnostic_reports WHERE receipt_id=?',
        )
        .get(body.receipt_id).n,
      0,
    );
    assert.equal((await handleFeedback(req(body), env, now)).status, 409);
  }
});
await test('network validation/canonicalization, rolling boundary and UTC-day salt rotation', async () => {
  const { feedbackNetwork, takeFeedbackQuota } =
    await import('../../.tmp-feedback-test/lib/diagnostic-feedback/rate-limit.js');
  assert.equal(
    feedbackNetwork('192.0.2.1'),
    feedbackNetwork('::ffff:192.0.2.1'),
  );
  assert.equal(
    feedbackNetwork('2001:0db8:1234:5678:0:0:0:1'),
    feedbackNetwork('2001:db8:1234:5678::ffff'),
  );
  assert.notEqual(
    feedbackNetwork('2001:db8:1234:5678::1'),
    feedbackNetwork('2001:db8:1234:5679::1'),
  );
  for (const ip of [
    null,
    '',
    'invalid',
    '1.2.3.4, 5.6.7.8',
    '127.1',
    '192.000.2.1',
    'fe80::1%eth0',
    '[::1]',
    '1.2.3.4:80',
  ])
    assert.equal(feedbackNetwork(ip), null, ip);
  rateNow = Math.floor(now / 86400) * 86400 + 86399;
  const initial = rateNow;
  for (let i = 0; i < 10; i++)
    assert.equal(await takeFeedbackQuota(db, 'intake', '192.0.2.1'), true);
  const salt = sql.prepare('SELECT salt FROM diagnostic_rate_salt').get().salt;
  rateNow++;
  assert.equal(
    await takeFeedbackQuota(db, 'intake', '192.0.2.2'),
    false,
    'midnight cannot reset global cap',
  );
  assert.notEqual(
    sql.prepare('SELECT salt FROM diagnostic_rate_salt').get().salt,
    salt,
  );
  assert.equal(
    sql.prepare('SELECT count(*) AS n FROM diagnostic_rate_salt').get().n,
    1,
  );
  rateNow = initial + 60;
  assert.equal(
    await takeFeedbackQuota(db, 'intake', '192.0.2.1'),
    false,
    'exact 60-second boundary is retained',
  );
  rateNow++;
  assert.equal(await takeFeedbackQuota(db, 'intake', '192.0.2.1'), true);
  assert.equal(
    sql.prepare('SELECT count(*) AS n FROM diagnostic_rate_attempts').get().n,
    1,
  );
  assert.ok(
    !JSON.stringify(
      sql.prepare('SELECT * FROM diagnostic_rate_attempts').all(),
    ).includes('192.0.2.1'),
  );
  rateNow += 86400;
  await cleanup.scheduled({}, env);
  assert.equal(
    sql.prepare('SELECT count(*) AS n FROM diagnostic_rate_salt').get().n,
    0,
  );
  assert.equal(
    sql.prepare('SELECT count(*) AS n FROM diagnostic_rate_attempts').get().n,
    0,
  );
});
await test('salt rollover during an in-flight quota request denies conservatively', async () => {
  const { takeFeedbackQuota } =
    await import('../../.tmp-feedback-test/lib/diagnostic-feedback/rate-limit.js');
  rateNow = (Math.floor(now / 86400) + 1) * 86400 - 1;
  const midnightDuringHash = {
    ...db,
    batch(statements) {
      rateNow++;
      return db.batch(statements);
    },
  };
  assert.equal(
    await takeFeedbackQuota(midnightDuringHash, 'intake', '192.0.2.1'),
    false,
  );
  assert.equal(
    sql.prepare('SELECT count(*) AS n FROM diagnostic_rate_attempts').get().n,
    0,
  );
  assert.equal(await takeFeedbackQuota(db, 'intake', '192.0.2.1'), true);
  assert.equal(
    sql.prepare('SELECT count(*) AS n FROM diagnostic_rate_salt').get().n,
    1,
  );
});
console.log(`${tests} groups passed`);
sql.close();
