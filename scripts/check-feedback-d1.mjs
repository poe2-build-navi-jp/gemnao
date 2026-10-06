import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))(
  'miniflare',
);
const compiled = await build({
  stdin: {
    contents: `import {GET,POST} from './app/api/feedback/route.ts'; import {recordStepResult} from './lib/feedback-db.ts'; export default {async fetch(request) {if(new URL(request.url).pathname==='/isolated-expiry') {const b=await request.json(); return Response.json(await recordStepResult(b.game,b.topic,b.method,'fixture',b.outcome,b.requestId,b.reportStruggling,b.requestedAt));} return request.method === 'POST' ? POST(request) : GET({nextUrl: new URL(request.url)});}};`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'browser',
  external: ['cloudflare:workers'],
  plugins: [
    {
      name: 'next-response',
      setup(b) {
        b.onResolve({ filter: /^next\/server$/ }, () => ({
          path: 'response',
          namespace: 'test',
        }));
        b.onLoad({ filter: /.*/, namespace: 'test' }, () => ({
          contents:
            'export const NextResponse={json:(body,options)=>Response.json(body,options)}',
        }));
      },
    },
  ],
});
const mf = new Miniflare({
  modules: true,
  script: compiled.outputFiles[0].text,
  compatibilityDate: '2026-05-15',
  d1Databases: ['DB'],
});
try {
  const db = await mf.getD1Database('DB');
  for (const file of (await readdir('.openai/drizzle'))
    .filter((f) => f.endsWith('.sql') && !f.startsWith('0004'))
    .sort()) {
    const sql = await readFile(`.openai/drizzle/${file}`, 'utf8');
    for (const statement of sql
      .split(';')
      .map((s) => s.replace(/--> statement-breakpoint/g, '').trim())
      .filter(Boolean))
      await db.prepare(statement).run();
  }
  const game = 'guide-low-fps',
    topic = 'display';
  const get = async () =>
    (await mf.dispatchFetch(`http://test/api/feedback?game=${game}`)).json();
  const post = async (body) =>
    mf.dispatchFetch('http://test/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'http://test' },
      body: JSON.stringify({ game, topic, ...body }),
    });
  assert.deepEqual(await get(), {
    rows: [],
    methods: [],
    stepResultsAvailable: false,
  });
  for (let i = 0; i < 8; i++)
    assert.equal((await post({ kind: 'struggling' })).status, 200);
  let response = await post({
    kind: 'step-solved',
    method: 'step-2',
    label: 'untrusted',
  });
  let data = await response.json();
  assert.deepEqual(data.rows, [{ topic, struggling: 8, resolved: 1 }]);
  assert.equal(data.methods[0].responses, 1);
  assert.equal(
    data.methods[0].methodLabel,
    'FPSが上限値で頭打ちなら、まず上限設定を確認する',
  );
  response = await post({ kind: 'step-solved', method: 'step-1' });
  data = await response.json();
  assert.deepEqual(data.rows, [{ topic, struggling: 8, resolved: 2 }]);
  assert.equal(
    data.methods.reduce((n, m) => n + m.responses, 0),
    2,
  );
  assert.deepEqual(await get(), {
    rows: data.rows,
    methods: data.methods,
    stepResultsAvailable: false,
  });
  const before = await get();
  assert.equal(
    (await post({ kind: 'step-solved', method: 'unknown' })).status,
    400,
  );
  assert.equal(
    (await post({ kind: 'step-solved', method: 'step-1', topic: 'save' }))
      .status,
    400,
  );
  assert.deepEqual(await get(), before);
  // Historical rows from unrelated topics must not inflate article STEP counts.
  await db
    .prepare('INSERT INTO solution_method_feedback VALUES (?, ?, ?, ?, ?, ?)')
    .bind(game, 'save', 'step-1', 'wrong topic', 50, 'test')
    .run();
  assert.deepEqual(await get(), before);
  const plan = await db
    .prepare(
      'EXPLAIN QUERY PLAN SELECT * FROM solution_method_feedback WHERE context_slug=? AND topic=?',
    )
    .bind(game, topic)
    .all();
  assert(plan.results.some((row) => String(row.detail).includes('SEARCH')));
  const submission = (overrides = {}) => ({
    kind: 'step-result',
    method: 'step-1',
    outcome: 'not-resolved',
    requestId: crypto.randomUUID(),
    requestedAt: new Date().toISOString(),
    reportStruggling: false,
    ...overrides,
  });
  // An old schema keeps legacy operations intact and rejects new writes.
  assert.equal((await post(submission())).status, 503);
  assert.deepEqual(await get(), before);
  const migration = await readFile(
    '.openai/drizzle/0004_step_result_reports.sql',
    'utf8',
  );
  for (const statement of migration
    .split(';')
    .map((s) => s.replace(/--> statement-breakpoint/g, '').trim())
    .filter(Boolean)) {
    await db.prepare(statement).run();
    if (!statement.startsWith('ALTER TABLE')) {
      assert.equal(
        (await get()).stepResultsAvailable,
        false,
        'partial migration stays disabled',
      );
      assert.equal((await post(submission())).status, 503);
    }
  }
  const migrated = await get();
  assert.equal(migrated.stepResultsAvailable, true);
  await db.prepare('DROP INDEX step_result_receipts_requested_at').run();
  assert.equal(
    (await get()).stepResultsAvailable,
    false,
    'missing receipt index disables collection',
  );
  await db
    .prepare(
      'CREATE INDEX step_result_receipts_requested_at ON step_result_receipts(method_id)',
    )
    .run();
  assert.equal(
    (await get()).stepResultsAvailable,
    false,
    'wrong named index disables collection',
  );
  await db.prepare('DROP INDEX step_result_receipts_requested_at').run();
  await db
    .prepare(
      'CREATE INDEX step_result_receipts_requested_at ON step_result_receipts(requested_at)',
    )
    .run();
  assert.equal((await get()).stepResultsAvailable, true);

  assert.deepEqual(migrated.rows, before.rows);
  assert.deepEqual(
    migrated.methods.map(({ notResolved, ...rest }) => {
      assert.equal(notResolved, 0);
      return rest;
    }),
    before.methods,
  );
  const failed = submission();
  assert.equal((await post(failed)).status, 200);
  let current = await get();
  assert.deepEqual(
    current.rows,
    before.rows,
    'intermediate failure is not article struggling',
  );
  assert.equal(
    current.methods.find((m) => m.methodId === 'step-1').notResolved,
    1,
  );
  assert.equal(
    current.methods.find((m) => m.methodId === 'step-1').responses,
    1,
  );
  for (const response of await Promise.all([
    post(failed),
    post(failed),
    post(failed),
  ]))
    assert.equal(response.status, 200);
  assert.deepEqual(await get(), current, 'concurrent retries are idempotent');
  assert.equal((await post({ ...failed, method: 'step-2' })).status, 409);
  assert.equal((await post({ ...failed, outcome: 'resolved' })).status, 409);
  assert.deepEqual(await get(), current, 'collisions do not update counters');
  const success = submission({
    method: 'step-2',
    outcome: 'resolved',
    label: 'untrusted',
  });
  assert.equal((await post(success)).status, 200);
  current = await get();
  assert.equal(current.rows[0].resolved, 3);
  assert.equal(
    current.methods.find((m) => m.methodId === 'step-2').responses,
    2,
  );
  assert.notEqual(
    current.methods.find((m) => m.methodId === 'step-2').methodLabel,
    'untrusted',
  );
  assert.equal((await post(success)).status, 200);
  assert.deepEqual(await get(), current);
  // Discover the actual final STEP from the server-owned static catalog.
  const { build: esbuild } = await import('esbuild');
  const catalog = await esbuild({
    entryPoints: ['lib/article-step-data.ts'],
    bundle: true,
    write: false,
    platform: 'node',
    format: 'esm',
  });
  const { articleSteps } = await import(
    `data:text/javascript;base64,${Buffer.from(catalog.outputFiles[0].text).toString('base64')}`
  );
  const receiptCountBeforePrerequisite = await db
    .prepare('SELECT COUNT(*) AS n FROM step_result_receipts')
    .first();
  assert.equal(
    (
      await post(
        submission({
          game: 'guide-steam-input-controller',
          topic: 'controller',
          method: 'step-1',
          outcome: 'not-resolved',
        }),
      )
    ).status,
    400,
    'recognition-only negative is not a remedy report',
  );
  assert.deepEqual(
    await db.prepare('SELECT COUNT(*) AS n FROM step_result_receipts').first(),
    receiptCountBeforePrerequisite,
  );
  assert.equal(
    await db
      .prepare('SELECT topic FROM issue_feedback WHERE game_slug = ?')
      .bind('guide-steam-input-controller')
      .first(),
    null,
  );
  assert.equal(
    (
      await post(
        submission({
          game: 'guide-steam-input-controller',
          topic: 'controller',
          method: 'step-1',
          outcome: 'resolved',
        }),
      )
    ).status,
    200,
    'explicit actual-game-fixed success stays available',
  );
  const finalMethod = articleSteps(game).at(-1).id;
  const final = submission({ method: finalMethod, reportStruggling: true });
  assert.equal((await post(final)).status, 200);
  current = await get();
  assert.equal(current.rows[0].struggling, 9);
  assert.equal((await post(final)).status, 200);
  assert.deepEqual(await get(), current);
  const eventCount = await db
    .prepare(
      "SELECT COUNT(*) AS n FROM feedback_events WHERE group_key = ? AND kind = 'struggling'",
    )
    .bind(game)
    .first();
  assert.equal(eventCount.n, 9, 'final retry does not duplicate status event');
  for (const body of [
    submission({ method: 'unknown' }),
    submission({ topic: 'save' }),
    submission({ reportStruggling: true }),
    submission({ requestId: 'not-uuid' }),
    submission({ requestedAt: 'bad' }),
    submission({ outcome: 'wrong' }),
  ])
    assert.equal((await post(body)).status, 400);
  const expired = submission({
    requestedAt: new Date(Date.now() - 31 * 86400000).toISOString(),
  });
  assert.equal((await post(expired)).status, 410);
  assert.equal(
    (
      await post(
        submission({
          requestedAt: new Date(Date.now() + 3600000).toISOString(),
        }),
      )
    ).status,
    410,
  );
  assert.deepEqual(
    await get(),
    current,
    'invalid/expired requests never change aggregates',
  );
  await db
    .prepare(
      'INSERT INTO step_result_receipts (request_id, context_slug, topic, method_id, outcome, report_struggling, requested_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
    .bind(
      expired.requestId,
      game,
      topic,
      'step-1',
      'not-resolved',
      0,
      expired.requestedAt,
    )
    .run();
  assert.equal((await post(submission({ method: finalMethod }))).status, 200);
  assert.equal(
    await db
      .prepare(
        'SELECT request_id FROM step_result_receipts WHERE request_id = ?',
      )
      .bind(expired.requestId)
      .first(),
    null,
    'cleanup on write removes expired receipts',
  );
  const retained = await get();
  assert.equal((await post(expired)).status, 410);
  assert.deepEqual(
    await get(),
    retained,
    'expired receipt cannot be replayed after cleanup',
  );
  // Bypass only the API's early date check in this isolated worker to simulate
  // expiry after HTTP validation or after another request cleaned a receipt.
  const race = submission({
    outcome: 'resolved',
    requestedAt: new Date(Date.now() - 31 * 86400000).toISOString(),
  });
  await db
    .prepare(
      'INSERT INTO step_result_receipts (request_id, requested_at, context_slug, topic, method_id, outcome, report_struggling) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
    .bind(
      race.requestId,
      race.requestedAt,
      game,
      topic,
      race.method,
      race.outcome,
      0,
    )
    .run();
  const priorRace = await get();
  const direct = async (body) =>
    (
      await mf.dispatchFetch('http://test/isolated-expiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, topic, ...body }),
      })
    ).json();
  assert.equal((await direct(race)).expired, true);
  assert.deepEqual(
    await get(),
    priorRace,
    'DB admission rejects expired receipt after cleanup',
  );
  assert.equal((await direct(race)).expired, true);
  assert.deepEqual(
    await get(),
    priorRace,
    'removed receipt cannot replay after stale caller validation',
  );
  // Retained receipt count, not client timestamps, bounds new storage.
  const { n: existing } = await db
    .prepare('SELECT COUNT(*) AS n FROM step_result_receipts')
    .first();
  await db
    .prepare(
      `WITH RECURSIVE sequence(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM sequence WHERE n < ?) INSERT INTO step_result_receipts(request_id,requested_at,context_slug,topic,method_id,outcome,report_struggling) SELECT 'cap-fixture-'||n, ?, 'synthetic', 'display', 'one', 'not-resolved', 0 FROM sequence`,
    )
    .bind(49999 - existing, new Date().toISOString())
    .run();
  const capBodies = [submission(), submission()];
  const capResponses = await Promise.all(capBodies.map(post));
  assert.deepEqual(capResponses.map((r) => r.status).sort((a, b) => a - b), [200, 429]);
  assert.equal(
    (await db.prepare('SELECT COUNT(*) AS n FROM step_result_receipts').first())
      .n,
    50000,
  );
  const atCapacity = await get();
  assert.equal(
    (await post(failed)).status,
    200,
    'existing receipt replays work at cap',
  );
  assert.equal((await post({ ...failed, method: 'step-2' })).status, 409);
  assert.equal((await post(submission())).status, 429);
  assert.deepEqual(
    await get(),
    atCapacity,
    'capacity rejection never changes counters',
  );
  for (const headers of [
    { 'Content-Type': 'application/json' },
    { 'Content-Type': 'text/plain', Origin: 'http://test' },
    { 'Content-Type': 'application/json', Origin: 'https://other.invalid' },
    {
      'Content-Type': 'application/json',
      Origin: 'http://test',
      'Sec-Fetch-Site': 'cross-site',
    },
  ]) {
    const response = await mf.dispatchFetch('http://test/api/feedback', {
      method: 'POST',
      headers,
      body: JSON.stringify({ game, topic, ...submission() }),
    });
    assert.equal(response.status, 403);
  }
  assert.deepEqual(await get(), atCapacity);
  console.log(
    'PASS: legacy/unmigrated gate; additive data preservation; both outcomes; intermediate/final semantics; atomic concurrent retry; collisions; trusted labels; topic/STEP/input validation; TTL DB-admission race/replay; status-event dedupe; partial/malformed schema gate; 50k concurrent capacity/replay; same-origin JSON guard. Isolated D1 only.',
  );
} finally {
  await mf.dispose();
}
