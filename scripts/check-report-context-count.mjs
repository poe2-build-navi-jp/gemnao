// Real SQL in memory with a D1-compatible transactional adapter. Never remote.
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { runtimeFixture, guardFixture } from './community-reports-fixtures.mjs';
await mkdir('.wrangler/community-reports-context', { recursive: true });
await build({
  stdin: {
    contents: `export * from './lib/community-reports/service';export * from './lib/community-reports/model';export * from './lib/community-reports/local';export * from './lib/community-reports/ledger';export * from './lib/community-reports/maintenance';export * from './lib/community-reports/runtime';export * from './lib/community-reports/bootstrap';export * from './lib/community-reports/control';`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  outfile: '.wrangler/community-reports-context/api.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
});
const m = await import('../.wrangler/community-reports-context/api.mjs');
const sql = new DatabaseSync(':memory:');
sql.exec('PRAGMA foreign_keys=ON');
sql.exec(await readFile('migrations/community-reports/0001.sql', 'utf8'));
const fail = false;
let chain = Promise.resolve(),
  queries = 0;
const db = {
  prepare(q) {
    let args = [];
    return {
      _sql: q,
      bind(...x) {
        args = x;
        return this;
      },
      async first() {
        queries++;
        return sql.prepare(q).get(...args) || null;
      },
      async all() {
        queries++;
        return { success: true, results: sql.prepare(q).all(...args) };
      },
      rawRun() {
        queries++;
        const r = sql.prepare(q).run(...args);
        return { success: true, meta: { changes: Number(r.changes) } };
      },
      async run() {
        if (fail) throw Error('storage');
        return this.rawRun();
      },
    };
  },
  batch(statements) {
    const work = chain.then(() => {
      if (fail) throw Error('storage');
      sql.exec('BEGIN');
      try {
        const result = statements.map((s) => s.rawRun());
        sql.exec('COMMIT');
        return result;
      } catch (e) {
        sql.exec('ROLLBACK');
        throw e;
      }
    });
    chain = work.catch(() => {});
    return work;
  },
};
let now = Math.floor(Date.now() / 1000);
const externalGuard = await guardFixture(m.CommunityReportLedger, () => now);
const env = {
  REPORTS_DB: db,
  REPORTS_ENABLED: 'true',
  REPORTS_PUBLIC_ENABLED: 'true',
  REPORTS_REVIEW_ENABLED: 'true',
  REPORTS_BUDGET_VERIFIED: 'true',
  REPORTS_GUARD: externalGuard.binding,
  REPORTS_GUARD_INSTANCE: externalGuard.instanceId,
};
const emptySql = new DatabaseSync(':memory:');
emptySql.exec(await readFile('migrations/community-reports/0001.sql', 'utf8'));
const emptyDb = {
  prepare(q) {
    return {
      async first() {
        return emptySql.prepare(q).get();
      },
    };
  },
};
const setupEnv = {
  REPORTS_DB: emptyDb,
  REPORTS_GUARD: externalGuard.binding,
  REPORTS_BOOTSTRAP_ALLOWED: 'true',
};
const setupReq = () =>
  new Request('https://local.test/api/admin/reports-bootstrap', {
    method: 'POST',
    headers: { origin: 'https://local.test' },
  });
assert.equal(
  (await m.bootstrapReports(setupReq(), setupEnv, async () => false)).status,
  401,
);
assert.equal(
  (
    await m.bootstrapReports(
      setupReq(),
      { ...setupEnv, REPORTS_ENABLED: 'true' },
      async () => true,
    )
  ).status,
  409,
);
assert.equal(
  (
    await m.bootstrapReports(
      setupReq(),
      { ...setupEnv, REPORTS_GUARD_INSTANCE: externalGuard.instanceId },
      async () => true,
    )
  ).status,
  409,
);
const initialized = await m.bootstrapReports(
  setupReq(),
  setupEnv,
  async () => true,
);
assert.equal(initialized.status, 200);
assert.equal((await initialized.json()).instanceId, externalGuard.instanceId);
async function healthyCleanup(at = now) {
  await m.cleanupReports(db, at);
  sql
    .prepare(
      "INSERT INTO community_operations(key,value) VALUES('monitor',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
    )
    .run(String(at));
  await externalGuard.observe(runtimeFixture(at));
}
await healthyCleanup();
function rateReset() {
  sql.exec('DELETE FROM community_rate');
}
const fixtures = [];
async function fixture() {
  now++;
  await externalGuard.observe(runtimeFixture(now));
  const key = m.randomHex(32),
    id = now.toString(16).padStart(8, '0') + (await m.digest(key)).slice(0, 24);
  const value = {
    key,
    id,
    requestId: m.randomHex(),
    content: {
      articlePath: '/games/monster-hunter-wilds/not-launching',
      symptom: 'launch',
      stepIds: ['steam-client-isolation'],
      outcome: 'unresolved',
      observedOn: null,
      version: '1.042.00.02',
      os: 'windows-11',
      gpu: 'nvidia',
      sources: [
        { url: 'https://example.org/synthetic-reference', readOn: null },
      ],
    },
  };
  fixtures.push(value);
  return value;
}
function req(path, method = 'GET', data, token, headers = {}) {
  return new Request('https://local.test' + path, {
    method,
    headers: {
      'cf-connecting-ip': '192.0.2.1',
      ...(method !== 'GET'
        ? { origin: 'https://local.test', 'Content-Type': 'application/json' }
        : {}),
      ...(token ? { 'X-Report-Owner': token } : {}),
      ...headers,
    },
    ...(data !== undefined
      ? { body: typeof data === 'string' ? data : JSON.stringify(data) }
      : {}),
  });
}
async function call(path, method = 'GET', data, token, options = {}) {
  if (options.reset !== false) rateReset();
  queries = 0;
  const r = await m.handleReports(
    req(path, method, data, token, options.headers),
    options.env || env,
    options.now || now,
    async () => options.admin === true,
  );
  assert.match(r.headers.get('cache-control'), /no-store/);
  return { status: r.status, data: await r.json(), queries };
}
const create = (f, options = {}) =>
  call(
    '/api/reports',
    'POST',
    { id: f.id, requestId: f.requestId, content: f.content, consent: 1 },
    f.key,
    options,
  );
const publicRows = () => call('/api/reports/public?game=monster-hunter-wilds');
const evidence = (label = 'self-report') => ({
  label,
  checkedOn: new Date(now * 1000).toISOString().slice(0, 10),
  basis: {
    'self-report': 'self-report',
    'separate-environment': 'separate-pc-test',
    'official-fix': 'official-announcement',
  }[label],
  sources:
    label === 'self-report'
      ? []
      : [
          {
            url: 'https://example.org/synthetic-check',
            readOn: new Date(now * 1000).toISOString().slice(0, 10),
          },
        ],
  observedOn:
    label === 'self-report'
      ? null
      : new Date(now * 1000).toISOString().slice(0, 10),
  result: label === 'self-report' ? null : 'resolved',
  environment: label === 'separate-environment' ? 'Synthetic separate PC' : '',
  note:
    label === 'self-report' ? '' : 'Synthetic check, not a real verification',
});
const review = (f, action, extras = {}) =>
  call(
    '/api/admin/reports',
    'PATCH',
    {
      id: f.id,
      revision: f.revision || 1,
      requestId: m.randomHex(),
      action,
      reason: 'other',
      ...extras,
    },
    undefined,
    { admin: true },
  );

const counts = (options = {}) =>
  call(
    '/api/reports/public?game=monster-hunter-wilds&count=true',
    'GET',
    undefined,
    undefined,
    options,
  );
const legacy = await fixture();
assert.deepEqual(m.parseContent(legacy.content, now), legacy.content);
assert.equal((await create(legacy)).status, 201);
assert.equal((await create(legacy)).status, 200, 'legacy retry hash unchanged');
assert.equal((await counts()).data.count, 0, 'pending excluded');
const owner = (
  await call('/api/reports/' + legacy.id, 'GET', undefined, legacy.key)
).data;
assert.equal(owner.content.previouslyWorked, undefined);
assert.equal(owner.content.recentChange, undefined);
for (const previouslyWorked of m.previousStates)
  for (const recentChange of m.recentChanges) {
    const content = { ...legacy.content, previouslyWorked, recentChange };
    assert.deepEqual(m.parseContent(content, now), content);
  }
for (const patch of [
  { previouslyWorked: true },
  { previouslyWorked: null },
  { previouslyWorked: 'sometimes' },
  { recentChange: ['none', 'game-update'] },
  { recentChange: ['unknown', 'settings'] },
  { recentChange: null },
  { recentChange: 'other' },
])
  assert.throws(() => m.parseContent({ ...legacy.content, ...patch }, now));
const content = {
  ...legacy.content,
  previouslyWorked: 'yes',
  recentChange: 'driver-update',
};
assert.equal(
  (
    await call(
      '/api/reports/' + legacy.id,
      'PATCH',
      {
        requestId: m.randomHex(),
        content,
        consent: 1,
        revision: 1,
      },
      legacy.key,
    )
  ).status,
  200,
);
legacy.revision = 2;
assert.equal(
  (
    await review(legacy, 'approve', {
      evidence: evidence(),
      redactOptional: false,
    })
  ).status,
  200,
);
assert.deepEqual((await publicRows()).data.reports[0].content, content);
assert.equal((await counts()).data.count, 1);
assert.equal(
  (await call('/api/reports/' + legacy.id, 'GET', undefined, legacy.key)).data
    .history[1].content.recentChange,
  'driver-update',
);
assert.equal((await review(legacy, 'hide')).status, 200);
assert.equal((await counts()).data.count, 0);
assert.equal((await review(legacy, 'restore')).status, 200);
assert.equal((await counts()).data.count, 1);
assert.equal(
  (await review(legacy, 'approve', { evidence: evidence() })).status,
  200,
);
assert.equal(
  (await publicRows()).data.reports[0].content.previouslyWorked,
  undefined,
);
assert.equal(
  (await publicRows()).data.reports[0].content.recentChange,
  undefined,
);
assert.deepEqual(
  m.redactReportContent(content),
  (await publicRows()).data.reports[0].content,
);
console.log(
  'PASS optional context: enums, contradiction rejection, legacy retry, edit/history, review/public redaction',
);

const approvedImage = sql
  .prepare('SELECT public_json FROM community_reports WHERE id=?')
  .get(legacy.id);
sql
  .prepare('UPDATE community_reports SET approved_revision=1 WHERE id=?')
  .run(legacy.id);
assert.equal(
  (await counts()).data.count,
  0,
  'approval for an old revision excluded',
);
sql
  .prepare(
    'UPDATE community_reports SET approved_revision=revision,public_json=NULL WHERE id=?',
  )
  .run(legacy.id);
assert.equal(
  (await counts()).data.count,
  0,
  'no publishable snapshot excluded',
);
sql
  .prepare('UPDATE community_reports SET public_json=? WHERE id=?')
  .run(approvedImage.public_json, legacy.id);
assert.equal(
  (await call('/api/reports/public?game=overwatch-2&count=true')).data.count,
  0,
  'other games excluded',
);

// Same synthetic owner, separate valid report IDs. No person deduplication.
const second = await fixture();
second.key = legacy.key;
second.id =
  now.toString(16).padStart(8, '0') + (await m.digest(second.key)).slice(0, 24);
assert.equal((await create(second)).status, 201);
assert.equal(
  (await review(second, 'approve', { evidence: evidence() })).status,
  200,
);
assert.equal(
  (await counts()).data.count,
  2,
  'same owner reports count separately',
);
assert.equal((await create(second)).status, 200);
assert.equal((await counts()).data.count, 2, 'retry does not inflate count');
const image = {
  ...sql.prepare('SELECT * FROM community_reports WHERE id=?').get(second.id),
};
assert.equal(
  (
    await call(
      '/api/reports/' + second.id,
      'DELETE',
      { requestId: m.randomHex() },
      second.key,
    )
  ).status,
  200,
);
assert.equal(
  (await counts()).data.count,
  1,
  'delete reflected without cached response',
);
sql
  .prepare(
    "UPDATE community_reports SET state='approved',public_json=?,approved_revision=revision WHERE id=?",
  )
  .run(image.public_json, second.id);
assert.equal(
  (await counts()).data.count,
  1,
  'ledger excludes restored deleted copy',
);
sql
  .prepare('UPDATE community_reports SET expires_at=? WHERE id=?')
  .run(now, legacy.id);
assert.equal(
  (await counts()).data.count,
  0,
  'expiry excludes even before cleanup',
);
assert.equal(
  (await counts({ env: { ...env, REPORTS_PUBLIC_ENABLED: 'false' } })).status,
  503,
);
assert.equal((await counts({ now: now + 7201 })).status, 503);
for (const suffix of ['count=false', 'count=true&symptom=launch'])
  assert.equal(
    (await call('/api/reports/public?game=monster-hunter-wilds&' + suffix))
      .status,
    400,
  );
console.log(
  'PASS count: separate reports by same owner, retries, hidden/deleted/expired, restored deletion ledger, fail-closed/no-store',
);

// More than the public list limit: count scans IDs only, bounded by the 200-row store cap.
for (let i = 0; i < 21; i++) {
  const f = await fixture();
  assert.equal((await create(f)).status, 201);
  assert.equal(
    (await review(f, 'approve', { evidence: evidence() })).status,
    200,
  );
}
assert.equal((await publicRows()).data.reports.length, 20);
const counted = await counts();
assert.equal(counted.data.count, 21);
assert.deepEqual(Object.keys(counted.data).sort(), ['checkedAt', 'count']);
assert.equal(counted.data.checkedAt, now);
console.log(
  'PASS exact count beyond 20-list limit; no owner, report content or identifiers exposed',
);
