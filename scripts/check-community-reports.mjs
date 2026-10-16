// Real SQL in memory with a D1-compatible transactional adapter. Never remote.
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { runtimeFixture, guardFixture } from './community-reports-fixtures.mjs';
await mkdir('.wrangler/community-reports-review', { recursive: true });
await build({
  stdin: {
    contents: `export * from './lib/community-reports/service';export * from './lib/community-reports/model';export * from './lib/community-reports/local';export * from './lib/community-reports/ledger';export * from './lib/community-reports/maintenance';export * from './lib/community-reports/runtime';export * from './lib/community-reports/bootstrap';export * from './lib/community-reports/control';`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  outfile: '.wrangler/community-reports-review/api.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
});
const m = await import('../.wrangler/community-reports-review/api.mjs');
const sql = new DatabaseSync(':memory:');
sql.exec('PRAGMA foreign_keys=ON');
sql.exec(await readFile('migrations/community-reports/0001.sql', 'utf8'));
let fail = false,
  chain = Promise.resolve(),
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
let now = Math.floor(Date.now() / 1000),
  cases = 0;
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
// Legacy references are seeded directly in local SQL, never via the disabled API.
function seedLegacyCitation(f) {
  sql
    .prepare(
      'INSERT INTO community_article_refs VALUES(?,?,?,?,NULL,NULL) ON CONFLICT(report_id,article_path) DO UPDATE SET revision=excluded.revision,at=excluded.at,withdrawal_at=NULL,completed_at=NULL',
    )
    .run(f.id, f.content.articlePath, f.revision || 1, now);
}
function check(name) {
  cases++;
  console.log('PASS:', name);
}
const A = await fixture(),
  B = await fixture();
assert.equal((await create(A, { env: { DB: db } })).status, 503);
assert.deepEqual(
  (await call('/api/reports/status', 'GET', undefined, undefined, { env: {} }))
    .data,
  { enabled: false, publicEnabled: false, canDelete: false },
);
assert.equal(
  (await create(A, { env: { ...env, REPORTS_BUDGET_VERIFIED: undefined } }))
    .status,
  503,
);
assert.equal((await create(A, { now: now + 7201 })).status, 503);
check('default-off, ordinary DB refusal, unverified budget and stale cleanup');
assert.equal(
  (await create(A, { headers: { origin: 'https://foreign.test' } })).status,
  403,
);
assert.equal(
  (
    await call('/api/reports/' + A.id, 'GET', undefined, A.key, {
      headers: { 'sec-fetch-site': 'cross-site' },
    })
  ).status,
  403,
);
const malicious = { ...A.content, evidence: 'official-fix' };
assert.throws(() => m.parseContent(malicious, now));
assert.throws(() =>
  m.parseContent({ ...A.content, version: '<img src=x onerror=1>' }, now),
);
assert.throws(() =>
  m.parseContent(
    { ...A.content, sources: [{ url: 'javascript:alert(1)', readOn: null }] },
    now,
  ),
);
assert.throws(() =>
  m.parseContent(
    {
      ...A.content,
      sources: [{ url: 'https://site.test/x?token=private', readOn: null }],
    },
    now,
  ),
);
assert.throws(() =>
  m.parseEvidence({ ...evidence(), checkedOn: '2999-01-01' }, now),
);
const yesterday = new Date((now - 86400) * 1000).toISOString().slice(0, 10);
assert.throws(() =>
  m.parseEvidence({ ...evidence('official-fix'), checkedOn: yesterday }, now),
);
assert.throws(() =>
  m.parseEvidence(
    {
      ...evidence('separate-environment'),
      checkedOn: yesterday,
      sources: [
        { url: 'https://example.org/synthetic-check', readOn: yesterday },
      ],
    },
    now,
  ),
);
assert.equal(
  (await call('/api/reports', 'POST', '{"id":"x","id":"y"}', A.key)).status,
  400,
);
assert.equal(
  (await call('/api/reports', 'POST', 'x'.repeat(9000), A.key)).status,
  400,
);
check(
  'CSRF, public cross-site refusal, strict fields/JSON/size, XSS URLs and dates',
);
assert.equal((await create(A)).status, 201);
assert.equal((await create(B)).status, 201);
assert.equal((await publicRows()).data.reports.length, 0);
assert.equal(
  (await call('/api/reports/' + A.id, 'GET', undefined, B.key)).status,
  404,
);
assert.equal(
  (
    await call(
      '/api/reports/' + A.id,
      'PATCH',
      { requestId: m.randomHex(), content: B.content, consent: 1, revision: 1 },
      B.key,
    )
  ).status,
  404,
);
assert.equal(
  (
    await call(
      '/api/reports/' + A.id,
      'DELETE',
      { requestId: m.randomHex() },
      B.key,
    )
  ).status,
  404,
);
assert.equal(
  (await call('/api/admin/reports', 'GET', undefined, A.key)).status,
  401,
);
const mine = (await call('/api/reports/' + A.id, 'GET', undefined, A.key)).data;
assert.equal(mine.state, 'pending');
assert.ok(!JSON.stringify(mine).includes(A.key));
check(
  'two owners isolated; IDs/local tickets are not ownership; pending private',
);
assert.equal(
  (await review(A, 'approve', { evidence: evidence('separate-environment') }))
    .status,
  200,
);
const published = (await publicRows()).data.reports[0];
assert.equal(published.evidence.label, 'separate-environment');
assert.equal(published.content.version, '');
assert.deepEqual(published.content.sources, []);
assert.ok(
  !JSON.stringify(published).includes('owner_hash') &&
    !JSON.stringify(published).includes(A.key),
);
assert.equal(
  (
    await review(B, 'approve', {
      evidence: { ...evidence('official-fix'), sources: [] },
    })
  ).status,
  400,
);
assert.equal(
  (await review(B, 'approve', { evidence: evidence() })).status,
  200,
);
assert.equal(
  (await publicRows()).data.reports.find((r) => r.id === B.id).evidence.label,
  'self-report',
);
check(
  'source-backed staff labels; approval alone stays self-report; public redaction',
);
const updated = {
  ...A.content,
  outcome: 'resolved',
  version: '1.043.00.00',
  sources: [{ url: 'https://example.org/changed-evidence', readOn: null }],
};
const edit = {
  requestId: m.randomHex(),
  content: updated,
  consent: 1,
  revision: 1,
};
assert.equal(
  (await call('/api/reports/' + A.id, 'PATCH', edit, A.key)).status,
  200,
);
assert.equal(
  (await publicRows()).data.reports.some((r) => r.id === A.id),
  false,
);
assert.equal(
  (await call('/api/reports/' + A.id, 'PATCH', edit, A.key)).status,
  200,
);
assert.equal(
  (
    await call(
      '/api/reports/' + A.id,
      'PATCH',
      { ...edit, requestId: m.randomHex() },
      A.key,
    )
  ).status,
  409,
);
A.revision = 2;
assert.equal((await review(A, 'restore')).status, 409);
assert.equal(
  (await review(A, 'approve', { evidence: evidence() })).status,
  200,
);
assert.equal(
  (
    await call(
      '/api/reports/' + A.id,
      'PATCH',
      {
        requestId: m.randomHex(),
        content: { ...updated, outcome: 'recurrence' },
        consent: 1,
        revision: 2,
      },
      A.key,
    )
  ).status,
  200,
);
A.revision = 3;
const history = (await call('/api/reports/' + A.id, 'GET', undefined, A.key))
  .data;
assert.deepEqual(
  history.history.map((r) => r.content.outcome),
  ['unresolved', 'resolved', 'recurrence'],
);
assert.equal(history.state, 'pending');
check(
  'source/version/step edits invalidate labels; optimistic edit and retry; one-person history',
);
assert.equal(
  (await review(A, 'approve', { evidence: evidence() })).status,
  200,
);
assert.equal((await review(A, 'hide')).status, 200);
assert.equal(
  (await publicRows()).data.reports.some((r) => r.id === A.id),
  false,
);
assert.equal((await review(A, 'restore')).status, 200);
const count = (await publicRows()).data.reports.length;
assert.equal(
  (await review(B, 'hide', { reason: 'duplicate', duplicateOf: A.id })).status,
  200,
);
assert.equal((await publicRows()).data.reports.length, count - 1);
check(
  'reversible hide; duplicate removal does not add independent confirmations',
);
const flag = { requestId: m.randomHex(), reason: 'privacy' };
assert.equal(
  (await call('/api/reports/' + A.id + '/flag', 'POST', flag)).status,
  201,
);
assert.equal(
  (await call('/api/reports/' + A.id + '/flag', 'POST', flag)).status,
  200,
);
assert.equal(
  sql
    .prepare('SELECT count(*) AS n FROM community_flags WHERE report_id=?')
    .get(A.id).n,
  1,
);
const queue = await call(
  '/api/admin/reports?all=true',
  'GET',
  undefined,
  undefined,
  { admin: true },
);
assert.ok(queue.queries <= 50);
assert.ok(queue.data.reports.some((r) => r.id === A.id && r.flags.length));
check('idempotent flags and authenticated paged queue within Free query limit');
for (let i = 0; i < 4; i++)
  assert.equal((await create(await fixture())).status, 201);
const fullPage = await call(
  '/api/admin/reports?all=true',
  'GET',
  undefined,
  undefined,
  { admin: true },
);
assert.equal(fullPage.data.reports.length, 5);
assert.ok(fullPage.queries <= 50);
assert.ok(fullPage.data.next);
const secondPage = await call(
  '/api/admin/reports?all=true&before=' + fullPage.data.next,
  'GET',
  undefined,
  undefined,
  { admin: true },
);
assert.equal(secondPage.data.reports.length, 1);
assert.ok(secondPage.queries <= 50);
assert.ok(
  !fullPage.data.reports.some((r) => r.id === secondPage.data.reports[0].id),
);
check(
  'full five-report admin page stays within 50 queries and cursor excludes previous rows',
);
assert.equal(
  (
    await review(A, 'cite', {
      articlePath: '/games/monster-hunter-wilds/not-launching',
    })
  ).status,
  403,
);
seedLegacyCitation(A);
const removed = await call(
  '/api/reports/' + A.id,
  'DELETE',
  { requestId: m.randomHex() },
  A.key,
  {
    env: {
      ...env,
      REPORTS_ENABLED: 'false',
      REPORTS_BUDGET_VERIFIED: undefined,
    },
    now: now + 7201,
  },
);
assert.equal(removed.status, 200);
assert.equal(removed.data.withdrawalPending, true);
assert.equal(
  (await publicRows()).data.reports.some((r) => r.id === A.id),
  false,
);
assert.equal(
  sql.prepare('SELECT content_json FROM community_reports WHERE id=?').get(A.id)
    .content_json,
  '{}',
);
assert.ok(
  sql
    .prepare('SELECT content_json FROM community_revisions WHERE report_id=?')
    .all(A.id)
    .every((r) => r.content_json === '{}'),
);
assert.equal((await create(A)).status, 409);
assert.equal((await review(A, 'restore')).status, 409);
assert.equal(
  (await review(A, 'approve', { evidence: evidence() })).status,
  409,
);
assert.equal(
  (
    await review(A, 'withdrawn', {
      articlePath: '/games/monster-hunter-wilds/not-launching',
    })
  ).status,
  200,
);
assert.equal(
  (await call('/api/reports/' + A.id, 'GET', undefined, A.key)).data
    .withdrawalPending,
  false,
);
check(
  'owner erasure while intake/budget off, public/queue text erased, quoted article withdrawal and no republish',
);
const canceled = await fixture();
assert.equal(
  (
    await call(
      '/api/reports/' + canceled.id,
      'DELETE',
      { requestId: m.randomHex() },
      canceled.key,
    )
  ).status,
  200,
);
assert.equal((await create(canceled)).status, 409);
check(
  'cancel-before-create tombstone prevents delayed submission resurrection',
);
const C = await fixture();
rateReset();
let admitted = 0;
for (let i = 0; i < 6; i++) {
  const f = await fixture();
  const r = await create(f, { reset: false });
  if (r.status === 201) admitted++;
  else assert.equal(r.status, 429);
}
assert.equal(admitted, 5);
assert.equal((await create(C)).status, 201);
assert.equal((await create(C)).status, 200);
check('atomic rolling rate cap; safe repeated submission after rate recovery');
const D = await fixture(),
  total = sql
    .prepare("SELECT value FROM community_operations WHERE key='total'")
    .get().value;
sql
  .prepare("UPDATE community_operations SET value='100' WHERE key='total'")
  .run();
assert.equal((await create(D)).status, 429);
sql
  .prepare("UPDATE community_operations SET value=? WHERE key='total'")
  .run(total);
assert.equal((await create(D)).status, 201);
assert.equal((await create(D)).status, 200);
check('lifetime intake capacity and no duplicate on capacity recovery');
const E = await fixture();
fail = true;
assert.equal((await create(E)).status, 503);
fail = false;
assert.equal((await create(E)).status, 201);
assert.equal((await create(E)).status, 200);
check('transaction failure, retained request identity and retry');
const F = await fixture();
rateReset();
const parallel = await Promise.all([
  create(F, { reset: false }),
  create(F, { reset: false }),
]);
assert.ok(parallel.some((r) => r.status === 201));
assert.equal(
  sql
    .prepare('SELECT count(*) AS n FROM community_revisions WHERE report_id=?')
    .get(F.id).n,
  1,
);
assert.equal((await create(F)).status, 200);
check('concurrent repeated creates write one report and revision');
const samePatch = {
  requestId: m.randomHex(),
  content: { ...F.content, outcome: 'resolved' },
  consent: 1,
  revision: 1,
};
let patchBatches = 0,
  releasePatches,
  firstPatchWork;
const patchGate = new Promise((resolve) => {
  releasePatches = resolve;
});
const simultaneousDb = {
  ...db,
  batch(statements) {
    if (
      statements[0]._sql?.startsWith(
        'UPDATE community_reports SET revision=revision+1',
      )
    ) {
      const ordinal = ++patchBatches;
      if (ordinal === 2) releasePatches();
      return patchGate.then(async () => {
        if (ordinal === 1) {
          firstPatchWork = db.batch(statements);
          return firstPatchWork;
        }
        await firstPatchWork;
        // A moderator completes an article withdrawal between the two retries.
        sql
          .prepare('INSERT INTO community_article_refs VALUES(?,?,?,?,?,?)')
          .run(F.id, F.content.articlePath, 2, now, now, now);
        return db.batch(statements);
      });
    }
    return db.batch(statements);
  },
};
rateReset();
const repeatedPatch = await Promise.all(
  [1, 2].map(() =>
    call('/api/reports/' + F.id, 'PATCH', samePatch, F.key, {
      reset: false,
      env: { ...env, REPORTS_DB: simultaneousDb },
    }),
  ),
);
assert.deepEqual(
  repeatedPatch.map((r) => r.status),
  [200, 200],
);
assert.deepEqual(
  repeatedPatch.map((r) => r.data.revision),
  [2, 2],
);
assert.equal(
  sql
    .prepare(
      'SELECT completed_at FROM community_article_refs WHERE report_id=?',
    )
    .get(F.id).completed_at,
  now,
);
assert.equal(
  sql
    .prepare('SELECT count(*) AS n FROM community_revisions WHERE report_id=?')
    .get(F.id).n,
  2,
);
assert.equal(
  (await call('/api/reports/' + F.id, 'PATCH', samePatch, F.key)).status,
  200,
);
assert.equal(
  (
    await call(
      '/api/reports/' + F.id,
      'PATCH',
      { ...samePatch, content: F.content },
      F.key,
    )
  ).status,
  409,
);
check(
  'simultaneous identical PATCH retries both acknowledge one accepted revision, including a lost first acknowledgement',
);
const expiredOwner = await fixture();
await create(expiredOwner);
const expires = now + 31 * 86400;
assert.equal(
  (
    await call(
      '/api/reports/' + expiredOwner.id,
      'DELETE',
      { requestId: m.randomHex() },
      expiredOwner.key,
      {
        now: expires,
        env: {
          ...env,
          REPORTS_ENABLED: undefined,
          REPORTS_BUDGET_VERIFIED: undefined,
        },
      },
    )
  ).status,
  200,
);
assert.equal(
  sql
    .prepare('SELECT content_json FROM community_reports WHERE id=?')
    .get(expiredOwner.id).content_json,
  '{}',
);
const oldUnsent = await fixture();
assert.equal(
  (
    await call(
      '/api/reports/' + oldUnsent.id,
      'DELETE',
      { requestId: m.randomHex() },
      oldUnsent.key,
      { now: expires },
    )
  ).status,
  200,
);
sql
  .prepare(
    "UPDATE community_operations SET value=? WHERE key IN ('cleanup','monitor')",
  )
  .run(String(expires));
const futureGuard = await guardFixture(m.CommunityReportLedger, () => expires);
assert.ok(
  [409, 410].includes(
    (
      await create(oldUnsent, {
        now: expires,
        env: {
          ...env,
          REPORTS_GUARD: futureGuard.binding,
          REPORTS_GUARD_INSTANCE: futureGuard.instanceId,
        },
      })
    ).status,
  ),
);
assert.equal(
  sql
    .prepare('SELECT count(*) AS n FROM community_reports WHERE id=?')
    .get(oldUnsent.id).n,
  0,
);
sql
  .prepare(
    "UPDATE community_operations SET value=? WHERE key IN ('cleanup','monitor')",
  )
  .run(String(now));
await externalGuard.observe(runtimeFixture(now));
sql.prepare("DELETE FROM community_operations WHERE key='salt'").run();
check(
  'expired owner can erase retained content during stopped intake; old unsent cancellations cannot later create',
);
const G = await fixture();
await create(G);
await review(G, 'approve', { evidence: evidence() });
seedLegacyCitation(G);
await healthyCleanup(now + 31 * 86400);
assert.equal(
  sql
    .prepare('SELECT state,content_json FROM community_reports WHERE id=?')
    .get(G.id).state,
  'deleted',
);
assert.ok(
  sql
    .prepare(
      'SELECT withdrawal_at FROM community_article_refs WHERE report_id=?',
    )
    .get(G.id).withdrawal_at,
);
now += 31 * 86400;
assert.ok(
  (
    await call('/api/admin/reports?all=true', 'GET', undefined, undefined, {
      admin: true,
    })
  ).data.reports.some((r) => r.id === G.id),
);
assert.equal(
  (await review(G, 'withdrawn', { articlePath: G.content.articlePath })).status,
  200,
);
await healthyCleanup();
assert.equal(
  sql.prepare('SELECT id FROM community_reports WHERE id=?').get(G.id),
  undefined,
);
assert.equal((await create(G)).status, 410);
await healthyCleanup();
check(
  'expiry removes payloads; quoted expiry queues withdrawal; completed cleanup cannot resurrect IDs',
);
const values = new Map([
  ['gemnao-solutions-v1', 'existing private data'],
  ['gemnao-my-games', '["monster-hunter-wilds"]'],
]);
const storage = {
  getItem: (k) => values.get(k) ?? null,
  setItem: (k, v) => values.set(k, v),
};
const ticket = await m.prepareCreate(storage, C.content, now);
let attempts = 0;
globalThis.fetch = async (path, options) => {
  attempts++;
  const r = await m.handleReports(
    req(path, options.method, options.body, options.headers['X-Report-Owner']),
    env,
    now,
  );
  rateReset();
  if (attempts === 1) throw Error('lost acknowledgement');
  return r;
};
rateReset();
await assert.rejects(m.sendPending(ticket));
assert.deepEqual(m.readTickets(storage)[0].pending, ticket.pending);
const retry = await m.sendPending(ticket);
assert.equal(retry.id, ticket.id);
m.acknowledge(storage, ticket);
assert.equal(m.readTickets(storage)[0].pending, null);
assert.equal(values.get('gemnao-solutions-v1'), 'existing private data');
assert.equal(values.get('gemnao-my-games'), '["monster-hunter-wilds"]');
const broken = {
  getItem: () => '{broken',
  setItem: () => {
    throw Error('must not overwrite');
  },
};
await assert.rejects(m.prepareCreate(broken, C.content));
const full = {
  getItem: () => null,
  setItem: () => {
    throw Error('quota');
  },
};
await assert.rejects(m.prepareCreate(full, C.content));
globalThis.fetch = async () => Response.json({ ok: true });
await assert.rejects(m.sendPending(ticket));
check(
  'local lost-ack retry, corrupt/quota preservation, old keys unchanged and malformed success refusal',
);
const H = await fixture();
await create(H);
await review(H, 'approve', { evidence: evidence('official-fix') });
seedLegacyCitation(H);
assert.equal(
  (await review(H, 'approve', { evidence: evidence() })).status,
  200,
);
assert.equal(
  (await call('/api/reports/' + H.id, 'GET', undefined, H.key)).data
    .withdrawalPending,
  true,
);
seedLegacyCitation(H);
await review(H, 'hide', { reason: 'privacy' });
assert.equal(
  (await call('/api/reports/' + H.id, 'GET', undefined, H.key)).data
    .withdrawalPending,
  true,
);
await review(H, 'restore');
seedLegacyCitation(H);
await review(H, 'reject');
assert.equal(
  (await call('/api/reports/' + H.id, 'GET', undefined, H.key)).data
    .withdrawalPending,
  true,
);
check(
  'reapproval/evidence downgrade, privacy hide and rejection invalidate article citations',
);
const I = await fixture();
await create(I);
await review(I, 'approve', { evidence: evidence() });
seedLegacyCitation(I);
const nonWithdrawalCount = () =>
  sql
    .prepare(
      "SELECT count(*) AS n FROM community_audit WHERE report_id=? AND action<>'withdrawn'",
    )
    .get(I.id).n;
while (nonWithdrawalCount() < 59)
  sql
    .prepare('INSERT INTO community_audit VALUES(?,?,?,?,?,?,?,?,?,?)')
    .run(
      m.randomHex(),
      I.id,
      1,
      'approve',
      'other',
      null,
      'existing-admin',
      now,
      'synthetic',
      '{}',
    );
rateReset();
const parallelReview = await Promise.all([
  call(
    '/api/admin/reports',
    'PATCH',
    {
      id: I.id,
      revision: 1,
      requestId: m.randomHex(),
      action: 'hide',
      reason: 'other',
    },
    undefined,
    { admin: true, reset: false },
  ),
  call(
    '/api/admin/reports',
    'PATCH',
    {
      id: I.id,
      revision: 1,
      requestId: m.randomHex(),
      action: 'reject',
      reason: 'other',
    },
    undefined,
    { admin: true, reset: false },
  ),
]);
assert.equal(nonWithdrawalCount(), 60);
assert.equal(parallelReview.filter((r) => r.status === 200).length, 1);
assert.equal(
  (await review(I, 'approve', { evidence: evidence() })).status,
  429,
);
await call(
  '/api/reports/' + I.id,
  'DELETE',
  { requestId: m.randomHex() },
  I.key,
);
assert.equal(
  (await review(I, 'withdrawn', { articlePath: I.content.articlePath })).status,
  200,
);
assert.equal(
  (await call('/api/reports/' + I.id, 'GET', undefined, I.key)).data
    .withdrawalPending,
  false,
);
check(
  'atomic review audit ceiling; citation withdrawal still works at the ceiling',
);
const J = await fixture();
await create(J);
let race = true;
const racingDb = {
  ...db,
  batch(statements) {
    if (
      race &&
      statements[0]._sql?.includes(
        'INSERT INTO community_operations(key,value) SELECT',
      )
    ) {
      race = false;
      sql
        .prepare(
          "UPDATE community_reports SET revision=2,state='pending' WHERE id=?",
        )
        .run(J.id);
    }
    return db.batch(statements);
  },
};
const auditBefore = sql
  .prepare('SELECT count(*) AS n FROM community_audit WHERE report_id=?')
  .get(J.id).n;
assert.equal(
  (
    await call(
      '/api/admin/reports',
      'PATCH',
      {
        id: J.id,
        revision: 1,
        requestId: m.randomHex(),
        action: 'approve',
        reason: 'other',
        evidence: evidence(),
      },
      undefined,
      { admin: true, env: { ...env, REPORTS_DB: racingDb } },
    )
  ).status,
  503,
);
assert.equal(
  sql.prepare('SELECT state FROM community_reports WHERE id=?').get(J.id).state,
  'pending',
);
assert.equal(
  sql
    .prepare('SELECT count(*) AS n FROM community_audit WHERE report_id=?')
    .get(J.id).n,
  auditBefore,
);
check(
  'owner edit winning during staff review causes atomic rollback, not stale publication',
);
globalThis.fetch = async (path, options) => {
  rateReset();
  return m.handleReports(
    req(path, options.method, options.body, options.headers['X-Report-Owner']),
    env,
    now,
  );
};
const conflict = m.prepareChange(
  storage,
  m.readTickets(storage)[0],
  'PATCH',
  { ...C.content, version: '9.1' },
  1,
);
await call(
  '/api/reports/' + ticket.id,
  'PATCH',
  {
    requestId: m.randomHex(),
    content: { ...C.content, outcome: 'resolved' },
    consent: 1,
    revision: 1,
  },
  ticket.key,
);
let conflictError;
try {
  await m.sendPending(conflict);
} catch (e) {
  conflictError = e;
}
assert.equal(conflictError.status, 409);
assert.equal(conflictError.message, 'revision-conflict');
assert.equal(m.releaseRejectedUpdate(storage, conflict, conflictError), true);
assert.equal(m.readTickets(storage)[0].pending, null);
assert.equal(JSON.parse(values.get(m.REPORT_DRAFT_KEY)).content.version, '9.1');
const revised = m.prepareChange(
  storage,
  m.readTickets(storage)[0],
  'PATCH',
  JSON.parse(values.get(m.REPORT_DRAFT_KEY)).content,
  2,
);
assert.equal((await m.sendPending(revised)).revision, 3);
assert.equal(
  m.releaseRejectedUpdate(
    storage,
    revised,
    new m.ReportRequestError('unavailable', 503),
  ),
  false,
);
assert.ok(m.readTickets(storage)[0].pending);
check(
  'definite revision conflict preserves draft for a new edit; ambiguous failure retains original retry',
);
// Activation gates apply in the real handler, not just the offline calculator.
const observationRequest = (state, origin = 'https://local.test') =>
  new Request('https://local.test/api/admin/reports-control', {
    method: 'POST',
    headers: { origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  });
assert.equal(
  (
    await m.observeReports(
      observationRequest(runtimeFixture(now)),
      env,
      async () => false,
    )
  ).status,
  401,
);
assert.equal(
  (
    await m.observeReports(
      observationRequest(runtimeFixture(now), 'https://foreign.test'),
      env,
      async () => true,
    )
  ).status,
  403,
);
assert.equal(
  (
    await m.observeReports(
      observationRequest(runtimeFixture(now)),
      env,
      async () => true,
    )
  ).status,
  200,
);
const later = await fixture();
now += 1801;
assert.equal((await create(later)).status, 503);
assert.equal((await call('/api/reports/status')).data.enabled, false);
now -= 1801;
await externalGuard.observe(runtimeFixture(now));
check(
  'existing-admin observation API rejects outsiders and its accepted lease automatically expires without redeployment',
);
for (const raw of [() => '', () => '{}', () => runtimeFixture(now + 1)]) {
  const stopped = await fixture();
  await externalGuard.observe(raw());
  assert.equal((await create(stopped)).status, 503);
  assert.equal((await call('/api/reports/status')).data.enabled, false);
}
const staleAttempt = await fixture();
assert.equal(
  (await externalGuard.observe(runtimeFixture(now - 1801))).status,
  409,
);
assert.equal((await create(staleAttempt)).status, 201);
assert.equal(m.runtimeStateReady(runtimeFixture(now - 1801), now), false);
const stopped = await fixture();
now++;
const highUsage = JSON.parse(runtimeFixture(now));
highUsage.usage.rowsReadToday = 4_000_000;
await externalGuard.observe(JSON.stringify(highUsage));
assert.equal((await create(stopped)).status, 503);
assert.equal(
  (await create(await fixture(), { env: { ...env, REPORTS_GUARD: undefined } }))
    .status,
  503,
);
check(
  'live API closes for missing/future/80-percent observations or missing ledger; stale observations cannot replace a fresh lease',
);

let leaseNow = now;
const replayGuard = await guardFixture(m.CommunityReportLedger, () => leaseNow);
const oldLow = runtimeFixture(leaseNow);
leaseNow += 600;
const newerHigh = JSON.parse(runtimeFixture(leaseNow));
newerHigh.usage.rowsReadToday = 4_000_000;
const highRaw = JSON.stringify(newerHigh);
assert.equal((await (await replayGuard.observe(highRaw)).json()).ready, false);
leaseNow += 60;
assert.equal((await replayGuard.observe(oldLow)).status, 409);
assert.equal((await replayGuard.observe(highRaw)).status, 200);
const guardReady = async () =>
  (
    await (
      await replayGuard.binding.fetch(
        new Request('https://guard.test/check', {
          method: 'POST',
          headers: { 'X-Report-Instance': replayGuard.instanceId },
          body: JSON.stringify({ ids: [] }),
        }),
      )
    ).json()
  ).ready;
assert.equal(await guardReady(), false);
const conflictingLow = JSON.parse(highRaw);
conflictingLow.usage.rowsReadToday = 0;
assert.equal(
  (await replayGuard.observe(JSON.stringify(conflictingLow))).status,
  409,
);
assert.equal((await replayGuard.observe(highRaw)).status, 409);
assert.equal(await guardReady(), false);
const newLow = runtimeFixture(leaseNow);
assert.equal((await (await replayGuard.observe(newLow)).json()).ready, true);
leaseNow += 1801;
assert.equal((await (await replayGuard.observe(newLow)).json()).ready, false);
assert.equal(await guardReady(), false);
leaseNow++;
assert.equal(
  (await (await replayGuard.observe(runtimeFixture(leaseNow))).json()).ready,
  true,
);
await replayGuard.observe('{}');
assert.equal((await replayGuard.observe(runtimeFixture(leaseNow))).status, 409);
assert.equal(await guardReady(), false);
check(
  'newer stop observations survive old retries; same-time conflicts latch closed and identical retries cannot renew the lease',
);

const K = await fixture();
K.content.version = '8.999';
await create(K);
await review(K, 'approve', { evidence: evidence() });
const image = {
  ...sql.prepare('SELECT * FROM community_reports WHERE id=?').get(K.id),
};
await call(
  '/api/reports/' + K.id,
  'DELETE',
  { requestId: m.randomHex() },
  K.key,
);
// Restore the pre-deletion D1 row only. Independent storage is not restored.
sql
  .prepare(
    'UPDATE community_reports SET state=?,content_json=?,public_json=?,owner_hash=?,revision=?,approved_revision=? WHERE id=?',
  )
  .run(
    image.state,
    image.content_json,
    image.public_json,
    image.owner_hash,
    image.revision,
    image.approved_revision,
    K.id,
  );
assert.ok(!(await publicRows()).data.reports.some((r) => r.id === K.id));
const restoredOwner = await call(
  '/api/reports/' + K.id,
  'GET',
  undefined,
  K.key,
);
assert.equal(restoredOwner.data.deleted, true);
assert.ok(!JSON.stringify(restoredOwner.data).includes('8.999'));
assert.equal(
  (await review(K, 'approve', { evidence: evidence() })).status,
  409,
);
assert.equal(
  (
    await call(
      '/api/reports/' + K.id,
      'PATCH',
      { requestId: m.randomHex(), revision: 1, consent: 1, content: K.content },
      K.key,
    )
  ).status,
  409,
);
const restoredQueue = await call(
  '/api/admin/reports?all=true',
  'GET',
  undefined,
  undefined,
  { admin: true },
);
assert.ok(!JSON.stringify(restoredQueue.data).includes('8.999'));
let notified = [];
await m.runReportsMaintenance(
  { ...env, REPORTS_MONITOR_URL: 'https://monitor.example.org/synthetic' },
  now,
  async (url, options) => {
    notified.push(JSON.parse(options.body));
    return new Response('{}');
  },
);
assert.equal(
  sql.prepare('SELECT content_json FROM community_reports WHERE id=?').get(K.id)
    .content_json,
  '{}',
);
assert.deepEqual(
  notified.map((x) => x.state),
  ['ok'],
);
assert.ok(!JSON.stringify(notified).includes(K.id));
check(
  'D1 restoration cannot return deleted text through public/owner/review/edit; maintenance erases restored copies',
);

const L = await fixture();
await create(L);
await review(L, 'approve', { evidence: evidence() });
externalGuard.control.fail = true;
assert.equal(
  (
    await call(
      '/api/reports/' + L.id,
      'DELETE',
      { requestId: m.randomHex() },
      L.key,
    )
  ).status,
  503,
);
assert.equal(
  (await call('/api/reports/' + L.id, 'GET', undefined, L.key)).status,
  503,
);
assert.equal((await publicRows()).status, 503);
externalGuard.control.fail = false;
let once = true;
const deletionFailureDb = {
  ...db,
  batch(s) {
    if (
      once &&
      s[0]._sql?.startsWith('INSERT OR IGNORE INTO community_reports SELECT')
    ) {
      once = false;
      return Promise.reject(Error('synthetic failure after deletion ledger'));
    }
    return db.batch(s);
  },
};
const deleteRequest = { requestId: m.randomHex() };
assert.equal(
  (
    await call('/api/reports/' + L.id, 'DELETE', deleteRequest, L.key, {
      env: { ...env, REPORTS_DB: deletionFailureDb },
    })
  ).status,
  503,
);
assert.equal(
  (await call('/api/reports/' + L.id, 'GET', undefined, L.key)).data.deleted,
  true,
);
assert.ok(!(await publicRows()).data.reports.some((r) => r.id === L.id));
assert.equal(
  (await call('/api/reports/' + L.id, 'DELETE', deleteRequest, L.key)).status,
  200,
);
check(
  'external-ledger or post-ledger D1 failures never show false deletion success and preserve safe deletion retry',
);

notified = [];
await assert.rejects(
  m.runReportsMaintenance(
    { ...env, REPORTS_MONITOR_URL: 'https://monitor.example.org/synthetic' },
    now,
    async (url, options) => {
      notified.push(JSON.parse(options.body));
      return new Response('', { status: 503 });
    },
  ),
);
assert.equal(
  sql
    .prepare("SELECT value FROM community_operations WHERE key='monitor'")
    .get().value,
  '0',
);
assert.equal((await call('/api/reports/status')).data.enabled, false);
assert.deepEqual(
  notified.map((x) => x.state),
  ['ok', 'error'],
);
await assert.rejects(
  m.runReportsMaintenance(env, now, async () => {
    throw Error('unexpected external call');
  }),
);
await m.runReportsMaintenance(
  { ...env, REPORTS_MONITOR_URL: 'https://monitor.example.org/synthetic' },
  now,
  async () => new Response('{}'),
);
check(
  'missing or failed heartbeat receiver closes intake; only cleanup plus receiver acknowledgement refreshes health',
);

const lostRow = await fixture();
await create(lostRow);
await review(lostRow, 'approve', { evidence: evidence() });
const oldImage = {
  ...sql.prepare('SELECT * FROM community_reports WHERE id=?').get(lostRow.id),
};
sql.prepare('DELETE FROM community_reports WHERE id=?').run(lostRow.id);
now += 2 * 86400;
await healthyCleanup();
assert.equal(
  (
    await call(
      '/api/reports/' + lostRow.id,
      'DELETE',
      { requestId: m.randomHex() },
      lostRow.key,
    )
  ).status,
  200,
);
const keys = Object.keys(oldImage);
sql
  .prepare(
    'INSERT INTO community_reports(' +
      keys.join(',') +
      ') VALUES(' +
      keys.map(() => '?').join(',') +
      ')',
  )
  .run(...keys.map((k) => oldImage[k]));
assert.ok(!(await publicRows()).data.reports.some((r) => r.id === lostRow.id));
assert.equal(
  (await call('/api/reports/' + lostRow.id, 'GET', undefined, lostRow.key)).data
    .deleted,
  true,
);
check(
  'deleting a missing old D1 row still writes the external marker before a later D1 restore',
);
const priorReservations = externalGuard.values.get('ledger').total;
const preservedLedger = structuredClone(externalGuard.values.get('ledger'));
for (const path of ['/delete', '/reserve', '/observe']) {
  const before = JSON.stringify(externalGuard.values.get('ledger'));
  const input =
    path === '/observe'
      ? { state: '' }
      : { id: now.toString(16).padStart(8, '0') + m.randomHex().slice(0, 24) };
  const r = await externalGuard.binding.fetch(
    new Request('https://guard.test' + path, {
      method: 'POST',
      headers: { 'X-Report-Instance': 'wrong-instance' },
      body: JSON.stringify(input),
    }),
  );
  assert.equal(r.status, 503);
  assert.equal(JSON.stringify(externalGuard.values.get('ledger')), before);
}
check(
  'wrong-instance requests cannot mutate or prune another ledger before the response is checked',
);
externalGuard.values.delete('ledger');
await assert.rejects(
  m.runReportsMaintenance(
    { ...env, REPORTS_MONITOR_URL: 'https://monitor.example.org/synthetic' },
    now,
    async () => new Response('{}'),
  ),
);
assert.equal(externalGuard.values.has('ledger'), false);
externalGuard.values.set('ledger', preservedLedger);
const unknown = m.randomHex();
sql
  .prepare(
    "INSERT INTO community_reports VALUES(?,'',1,'x','other','{}','pending',NULL,NULL,'x',?,?,?)",
  )
  .run(unknown, now, now, now + 86400);
await assert.rejects(
  m.runReportsMaintenance(
    { ...env, REPORTS_MONITOR_URL: 'https://monitor.example.org/synthetic' },
    now,
    async () => new Response('{}'),
  ),
);
assert.equal(
  sql
    .prepare("SELECT value FROM community_operations WHERE key='monitor'")
    .get().value,
  '0',
);
sql.prepare('DELETE FROM community_reports WHERE id=?').run(unknown);
await m.runReportsMaintenance(
  { ...env, REPORTS_MONITOR_URL: 'https://monitor.example.org/synthetic' },
  now,
  async () => new Response('{}'),
);
check(
  'explicit authenticated bootstrap cannot reset a pinned ledger; missing ledger or unknown live IDs stop maintenance',
);
sql
  .prepare("UPDATE community_operations SET value='0' WHERE key='total'")
  .run();
for (let i = priorReservations; i < 100; i++)
  assert.equal((await create(await fixture())).status, 201);
sql
  .prepare("UPDATE community_operations SET value='0' WHERE key='total'")
  .run();
assert.equal((await create(await fixture())).status, 429);
check(
  'independent lifetime counter prevents a restored D1 counter from reopening the initial 100 slots',
);
console.log(
  `PASS: ${cases} community-report security/persistence groups; synthetic local SQLite only; no configuration, remote writes or credentials created.`,
);
