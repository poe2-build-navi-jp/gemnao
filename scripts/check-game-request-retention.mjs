import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

// All requests below use Miniflare.dispatchFetch and ephemeral local D1 only.
const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))(
  'miniflare',
);
const compiled = await build({
  stdin: {
    contents: `import * as p from './app/api/game-requests/route.ts';import * as a from './app/api/admin/game-requests/route.ts';export default {fetch(r){const h=new URL(r.url).pathname==='/api/game-requests'?p:a;return h[r.method]?.(r)??new Response(null,{status:405});}}`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'browser',
  plugins: [
    {
      name: 'local-retention-race-barrier',
      setup(b) {
        b.onResolve({ filter: /^cloudflare:workers$/ }, (args) =>
          args.namespace === 'retention-test'
            ? { path: args.path, external: true }
            : { path: 'binding', namespace: 'retention-test' },
        );
        b.onLoad({ filter: /.*/, namespace: 'retention-test' }, () => ({
          loader: 'js',
          // A one-shot barrier makes every competing request finish its
          // availability check before any admission transaction can commit.
          contents: `
            import {env as original} from 'cloudflare:workers';
            const fixedNow = Number(original.LOCAL_TEST_NOW || 0);
            if (fixedNow) Date.now = () => fixedNow;
            let waiting = [], released = false;
            async function barrier() {
              const size = Number(original.LOCAL_TEST_BATCH_BARRIER || 0);
              if (size < 2 || released) return;
              await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('local test barrier timed out')), 5000);
                waiting.push(() => { clearTimeout(timeout); resolve(); });
                if (waiting.length === size) {
                  released = true;
                  for (const resume of waiting) resume();
                  waiting = [];
                }
              });
            }
            export const env = new Proxy(original, {get(target, key) {
              if (key !== 'DB') return target[key];
              const db = target.DB;
              return {
                prepare: db.prepare.bind(db),
                async batch(statements) { await barrier(); return db.batch(statements); }
              };
            }});
          `,
        }));
      },
    },
  ],
});
const root = 'https://gemnao.pages.dev';
const publicPath = root + '/api/game-requests';
const adminPath = root + '/api/admin/game-requests';
const publicHeaders = {
  'content-type': 'application/json',
  origin: root,
  'cf-connecting-ip': '192.0.2.1',
  'sec-fetch-site': 'same-origin',
};
const adminHeaders = {
  ...publicHeaders,
  cookie: 'gemnao_discord_admin=local-test-key',
};
const tables = [
  'game_requests',
  'game_request_daily_salts',
  'game_request_attempts',
];
const old = Date.now() - 100 * 86_400_000;
const sequence = `WITH RECURSIVE seq(n) AS (SELECT 0 UNION ALL SELECT n+1 FROM seq WHERE n+1 < ?)`;

async function fixture(bindings = {}) {
  const mf = new Miniflare({
    modules: true,
    script: compiled.outputFiles[0].text,
    compatibilityDate: '2026-05-15',
    compatibilityFlags: ['nodejs_compat'],
    d1Databases: ['DB'],
    bindings: {
      DISCORD_ADMIN_TOKEN: 'local-test-key',
      GAME_REQUESTS_ENABLED: 'true',
      GAME_REQUEST_REVIEW_MODE: 'manual',
      GAME_REQUEST_MANUAL_REVIEW_READY: 'true',
      ...bindings,
    },
  });
  const db = await mf.getD1Database('DB');
  const migration = await readFile(
    'migrations/game-requests/0001_game_requests.sql',
    'utf8',
  );
  await db.exec(migration.replace(/--[^\n]*/g, '').replace(/\n/g, ' '));
  return { mf, db };
}
async function forbidDeletes(db) {
  for (const table of ['game_requests'])
    await db.exec(
      `CREATE TRIGGER forbid_delete_${table} BEFORE DELETE ON ${table} BEGIN SELECT RAISE(ABORT,'manual_retention_must_not_delete'); END`,
    );
}
async function seedRequests(db, count) {
  await db
    .prepare(
      `${sequence} INSERT INTO game_requests(id,game_name,normalized_name,locale,created_at,updated_at)
       SELECT '00000000-0000-4000-8000-'||printf('%012d',n),'Synthetic retained game '||n,'synthetic retained game '||n,'en',?,? FROM seq`,
    )
    .bind(count, old, old)
    .run();
}
async function seedAttempts(db, count, fingerprint = 'public') {
  await db
    .prepare(
      `${sequence} INSERT INTO game_request_attempts(id,day,fingerprint,created_at)
       SELECT ?||'-'||n,?,?,? FROM seq`,
    )
    .bind(
      count,
      'seed-' + fingerprint,
      fingerprint === 'manual'
        ? 'manual:2000-01-01T00:00'
        : fingerprint === 'consumer'
          ? 'consumer:2000-01-01T00:00'
          : '2000-01-01',
      fingerprint,
      old,
    )
    .run();
}
async function seedSalts(db, count) {
  await db
    .prepare(
      `${sequence} INSERT INTO game_request_daily_salts(day,salt,expires_at)
       SELECT date('2000-01-01','+'||n||' days'),'synthetic-old-salt-'||n,0 FROM seq`,
    )
    .bind(count)
    .run();
}
async function count(db, table, where = '') {
  return (await db.prepare(`SELECT COUNT(*) n FROM ${table} ${where}`).first())
    .n;
}
async function snapshot(db) {
  return Promise.all(
    tables.map(
      async (table) =>
        (await db.prepare(`SELECT * FROM ${table} ORDER BY 1`).all()).results,
    ),
  );
}
async function available(mf, expected) {
  const response = await mf.dispatchFetch(publicPath);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { available: expected });
}
const post = (mf, gameName, ip = '192.0.2.1') =>
  mf.dispatchFetch(publicPath, {
    method: 'POST',
    headers: { ...publicHeaders, 'cf-connecting-ip': ip },
    body: JSON.stringify({ gameName, locale: 'en', website: '' }),
  });
const review = (mf, id, expectedUpdatedAt = old) =>
  mf.dispatchFetch(adminPath, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      action: 'review',
      id,
      expectedUpdatedAt,
      decision: 'adopt',
    }),
  });

// Freeze only Date.now in this local worker so strict < cleanup boundaries
// can be checked to the millisecond without racing wall-clock execution.
const fixedNow = Date.now();
const cutoff = fixedNow - 2 * 86_400_000;
const retention = await fixture({ LOCAL_TEST_NOW: String(fixedNow) });
try {
  await seedRequests(retention.db, 1);
  for (const [label, timestamp] of [
    ['expired', cutoff - 1],
    ['boundary', cutoff],
    ['recent', cutoff + 1],
  ]) {
    for (const fingerprint of ['public', 'manual'])
      await retention.db
        .prepare('INSERT INTO game_request_attempts VALUES(?,?,?,?)')
        .bind(
          label + '-' + fingerprint,
          fingerprint === 'manual' ? 'manual:2000-01-01T00:00' : '2000-01-01',
          fingerprint,
          timestamp,
        )
        .run();
    await retention.db
      .prepare('INSERT INTO game_request_daily_salts VALUES(?,?,?)')
      .bind(label, 'synthetic-' + label, fixedNow + (timestamp - cutoff))
      .run();
  }
  await forbidDeletes(retention.db);
  const initialRequest = await retention.db
    .prepare(
      "SELECT * FROM game_requests WHERE id='00000000-0000-4000-8000-000000000000'",
    )
    .first();
  await available(retention.mf, true);
  assert.equal(
    (await post(retention.mf, 'Synthetic newly retained game')).status,
    201,
  );
  for (const fingerprint of ['public', 'manual']) {
    assert.equal(
      await retention.db
        .prepare('SELECT id FROM game_request_attempts WHERE id=?')
        .bind('expired-' + fingerprint)
        .first(),
      null,
    );
    for (const label of ['boundary', 'recent'])
      assert.ok(
        await retention.db
          .prepare('SELECT id FROM game_request_attempts WHERE id=?')
          .bind(label + '-' + fingerprint)
          .first(),
      );
  }
  assert.equal(
    await retention.db
      .prepare("SELECT day FROM game_request_daily_salts WHERE day='expired'")
      .first(),
    null,
  );
  for (const label of ['boundary', 'recent'])
    assert.ok(
      await retention.db
        .prepare('SELECT day FROM game_request_daily_salts WHERE day=?')
        .bind(label)
        .first(),
    );
  // Admin-only cleanup retains its precise namespace and 48-hour threshold.
  await retention.db.batch([
    retention.db
      .prepare('INSERT INTO game_request_attempts VALUES(?,?,?,?)')
      .bind(
        'admin-expired-manual',
        'manual:2000-01-01T00:00',
        'manual',
        cutoff - 1,
      ),
    retention.db
      .prepare('INSERT INTO game_request_attempts VALUES(?,?,?,?)')
      .bind('admin-expired-public', '2000-01-01', 'public', cutoff - 1),
  ]);
  const fresh = await retention.db
    .prepare('SELECT id,updated_at FROM game_requests WHERE normalized_name=?')
    .bind('synthetic newly retained game')
    .first();
  assert.equal(
    (await review(retention.mf, fresh.id, fresh.updated_at)).status,
    200,
  );
  assert.equal(
    await retention.db
      .prepare(
        "SELECT id FROM game_request_attempts WHERE id='admin-expired-manual'",
      )
      .first(),
    null,
  );
  assert.ok(
    await retention.db
      .prepare(
        "SELECT id FROM game_request_attempts WHERE id='admin-expired-public'",
      )
      .first(),
  );
  assert.ok(
    await retention.db
      .prepare(
        "SELECT id FROM game_request_attempts WHERE id='boundary-manual'",
      )
      .first(),
  );
  assert.deepEqual(
    await retention.db
      .prepare(
        "SELECT * FROM game_requests WHERE id='00000000-0000-4000-8000-000000000000'",
      )
      .first(),
    initialRequest,
  );
  console.log(
    'PASS: ordinary manual mode retains the expired request with DELETE-aborting protection; ancillary cleanup keeps the exact 48-hour and salt-expiry boundaries.',
  );
} finally {
  await retention.mf.dispose();
}

const requests = await fixture({ LOCAL_TEST_BATCH_BARRIER: '2' });
try {
  await seedRequests(requests.db, 499);
  await forbidDeletes(requests.db);
  await available(requests.mf, true);
  const responses = await Promise.all([
    post(requests.mf, 'Synthetic last request slot A', '192.0.2.2'),
    post(requests.mf, 'Synthetic last request slot B', '192.0.2.3'),
  ]);
  assert.deepEqual(
    responses.map((r) => r.status).sort((a, b) => a - b),
    [201, 503],
  );
  assert.equal(await count(requests.db, 'game_requests'), 500);
  assert.equal(await count(requests.db, 'game_request_attempts'), 1);
  await available(requests.mf, false);
  const full = await snapshot(requests.db);
  assert.equal(
    (await post(requests.mf, 'Synthetic over request capacity')).status,
    503,
  );
  assert.deepEqual(await snapshot(requests.db), full);
  assert.equal(
    (await review(requests.mf, '00000000-0000-4000-8000-000000000000')).status,
    200,
  );
  assert.equal(
    (await requests.mf.dispatchFetch(adminPath, { headers: adminHeaders }))
      .status,
    200,
  );
  assert.equal(await count(requests.db, 'game_requests'), 500);
  console.log(
    'PASS: two admissions past the same 499-row precheck commit exactly one request; 500 closes intake without further public writes and authenticated backlog review still works.',
  );
} finally {
  await requests.mf.dispose();
}

const perIp = await fixture({ LOCAL_TEST_BATCH_BARRIER: '6' });
try {
  await forbidDeletes(perIp.db);
  const responses = await Promise.all(
    Array.from({ length: 6 }, (_, i) =>
      post(perIp.mf, 'Synthetic per network limit ' + i),
    ),
  );
  assert.deepEqual(
    responses.map((r) => r.status).sort((a, b) => a - b),
    [201, 201, 201, 201, 201, 429],
  );
  assert.equal(await count(perIp.db, 'game_request_attempts'), 5);
  assert.equal(await count(perIp.db, 'game_requests'), 5);
  await available(perIp.mf, true);
  console.log(
    'PASS: concurrent manual intake retains the existing five-per-network daily limit.',
  );
} finally {
  await perIp.mf.dispose();
}

const global = await fixture({ LOCAL_TEST_BATCH_BARRIER: '2' });
try {
  const today = new Date().toISOString().slice(0, 10);
  await global.db
    .prepare(`${sequence} INSERT INTO game_request_attempts
    SELECT 'today-'||n,?,'other-network-'||n,? FROM seq`)
    .bind(99, today, Date.now())
    .run();
  await forbidDeletes(global.db);
  const responses = await Promise.all([
    post(global.mf, 'Synthetic daily last slot A', '192.0.2.6'),
    post(global.mf, 'Synthetic daily last slot B', '192.0.2.7'),
  ]);
  assert.deepEqual(
    responses.map((r) => r.status).sort((a, b) => a - b),
    [201, 429],
  );
  assert.equal(await count(global.db, 'game_request_attempts'), 100);
  assert.equal(await count(global.db, 'game_requests'), 1);
  assert.equal(
    (await post(global.mf, 'Synthetic daily refused', '192.0.2.8')).status,
    429,
  );
  assert.equal(await count(global.db, 'game_request_attempts'), 100);
  await available(global.mf, true);
  console.log(
    'PASS: independent-network races retain the existing 100-per-day limit without partial request inserts.',
  );
} finally {
  await global.mf.dispose();
}

const automatic = await fixture({
  GAME_REQUEST_REVIEW_MODE: 'automatic',
  GAME_REQUEST_CONSUMER_READY: 'true',
});
try {
  await seedRequests(automatic.db, 1);
  await seedAttempts(automatic.db, 1);
  await seedSalts(automatic.db, 1);
  assert.equal(
    (await post(automatic.mf, 'Synthetic automatic cleanup')).status,
    201,
  );
  for (const table of tables) assert.equal(await count(automatic.db, table), 1);
  assert.equal(
    await automatic.db
      .prepare(
        "SELECT id FROM game_requests WHERE id='00000000-0000-4000-8000-000000000000'",
      )
      .first(),
    null,
  );
  console.log(
    'PASS: legacy automatic intake still cleans up expired local fixtures.',
  );
} finally {
  await automatic.mf.dispose();
}
