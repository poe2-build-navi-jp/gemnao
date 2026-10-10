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
    contents: `import * as p from './app/api/game-requests/route.ts';import * as a from './app/api/admin/game-requests/route.ts';import * as c from './app/api/automation/game-requests/route.ts';export default {fetch(r){let path=new URL(r.url).pathname,h=path==='/api/game-requests'?p:path==='/api/admin/game-requests'?a:c;return h[r.method]?.(r)??new Response(null,{status:405});}}`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'browser',
  external: ['cloudflare:workers'],
});
const root = 'https://gemnao.pages.dev',
  publicPath = root + '/api/game-requests',
  adminPath = root + '/api/admin/game-requests',
  automationPath = root + '/api/automation/game-requests';
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
const syntheticToken = 'ab'.repeat(32);
async function fixture(
  bindings = {},
  migrate = true,
  script = compiled.outputFiles[0].text,
) {
  const mf = new Miniflare({
    modules: true,
    script,
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
  if (migrate)
    await db.exec(
      (
        await readFile(
          'migrations/game-requests/0001_game_requests.sql',
          'utf8',
        )
      )
        .replace(/--[^\n]*/g, '')
        .replace(/\n/g, ' '),
    );
  return { mf, db };
}
const post = (mf, gameName = 'Synthetic Manual Game', locale = 'en') =>
  mf.dispatchFetch(publicPath, {
    method: 'POST',
    headers: publicHeaders,
    body: JSON.stringify({ gameName, locale, website: '' }),
  });
const patch = (mf, body, headers = adminHeaders) =>
  mf.dispatchFetch(adminPath, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
const action = (row, decision) => ({
  action: 'review',
  id: row.id,
  expectedUpdatedAt: row.updated_at,
  decision,
});
const main = await fixture({ GAME_REQUEST_CONSUMER_TOKEN: syntheticToken });
try {
  assert.deepEqual(await (await main.mf.dispatchFetch(publicPath)).json(), {
    available: true,
  });
  for (const locale of ['ja', 'en', 'zh', 'es'])
    assert.equal(
      (await post(main.mf, 'Synthetic ' + locale + ' Game', locale)).status,
      201,
    );
  const response = await main.mf.dispatchFetch(adminPath, {
    headers: adminHeaders,
  });
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const queue = await response.json();
  assert.equal(queue.reviewMode, 'manual');
  assert.equal(queue.requests.length, 4);
  let row = queue.requests[0];
  assert.ok(Number.isSafeInteger(row.updated_at));
  assert.equal((await main.mf.dispatchFetch(adminPath)).status, 401);
  assert.equal(
    (await patch(main.mf, action(row, 'adopt'), publicHeaders)).status,
    401,
  );
  assert.equal(
    (
      await patch(main.mf, action(row, 'adopt'), {
        ...adminHeaders,
        origin: 'https://elsewhere.example',
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await patch(main.mf, action(row, 'adopt'), {
        ...adminHeaders,
        'sec-fetch-site': 'cross-site',
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await patch(main.mf, action(row, 'adopt'), {
        ...adminHeaders,
        'content-type': 'text/plain',
      })
    ).status,
    415,
  );
  for (const extra of [
    { decision: ['adopt'] },
    { expectedUpdatedAt: '1' },
    { expectedUpdatedAt: -1 },
    { expectedUpdatedAt: Number.MAX_SAFE_INTEGER },
    { decision: 'published' },
    { action: 'claim' },
    { privateNote: 'should not be collected' },
    { gameName: 'should not be transmitted' },
  ])
    assert.equal(
      (await patch(main.mf, { ...action(row, 'adopt'), ...extra })).status,
      400,
    );
  assert.equal(
    (await patch(main.mf, { ...action(row, 'adopt'), extra: 'x'.repeat(3000) }))
      .status,
    413,
  );
  assert.equal(
    (
      await main.db
        .prepare(
          'SELECT COUNT(*) n FROM game_request_attempts WHERE fingerprint=?',
        )
        .bind('manual')
        .first()
    ).n,
    0,
  );
  // Two stale-tab/double-click requests race: exactly one may change the row.
  const concurrent = await Promise.all([
    patch(main.mf, action(row, 'adopt')),
    patch(main.mf, action(row, 'hold')),
  ]);
  assert.deepEqual(
    concurrent.map((r) => r.status).sort((a, b) => a - b),
    [200, 409],
  );
  row = await main.db
    .prepare('SELECT * FROM game_requests WHERE id=?')
    .bind(row.id)
    .first();
  const next = await patch(
    main.mf,
    action(row, row.status === 'held' ? 'adopt' : 'hold'),
  );
  assert.equal(next.status, 200);
  const saved = (await next.json()).request;
  assert.deepEqual(Object.keys(saved).sort(), ['id', 'status', 'updated_at']);
  assert.ok(saved.updated_at > row.updated_at);
  assert.equal((await patch(main.mf, action(row, 'adopt'))).status, 409);
  row = { ...row, ...saved };
  // A valid future automatic credential cannot use the queue in manual mode.
  for (const method of ['GET', 'PATCH'])
    assert.equal(
      (
        await main.mf.dispatchFetch(automationPath, {
          method,
          headers: {
            Authorization: 'Bearer ' + syntheticToken,
            ...(method === 'PATCH'
              ? { 'content-type': 'application/json' }
              : {}),
          },
          ...(method === 'PATCH'
            ? { body: JSON.stringify({ action: 'claim', id: row.id }) }
            : {}),
        })
      ).status,
      503,
    );
  assert.equal(
    (await patch(main.mf, { action: 'claim', id: row.id })).status,
    400,
  );
  const received = queue.requests[1];
  await main.db
    .prepare('UPDATE game_requests SET lease_until=?,lease_token=? WHERE id=?')
    .bind(Date.now() + 60000, 'private-lease', received.id)
    .run();
  assert.equal((await patch(main.mf, action(received, 'adopt'))).status, 409);
  for (const status of [
    'verifying',
    'drafting',
    'qa',
    'published',
    'covered',
    'rejected',
  ]) {
    await main.db
      .prepare('UPDATE game_requests SET status=?,lease_until=NULL WHERE id=?')
      .bind(status, received.id)
      .run();
    assert.equal((await patch(main.mf, action(received, 'hold'))).status, 409);
  }
  // Manual readiness permits reviewing the backlog while public intake is off.
  console.log(
    'PASS: manual intake in four locales, existing auth/CSRF, strict body/size, no raw title in mutation, CAS races/replay, active leases and terminal protection, automation exclusion.',
  );
} finally {
  await main.mf.dispose();
}
for (const bindings of [
  { GAME_REQUEST_MANUAL_REVIEW_READY: 'false' },
  {
    GAME_REQUEST_MANUAL_REVIEW_READY: 'false',
    GAME_REQUEST_CONSUMER_READY: 'true',
  },
  { GAME_REQUEST_REVIEW_MODE: 'invalid' },
  {
    GAME_REQUEST_REVIEW_MODE: 'automatic',
    GAME_REQUEST_CONSUMER_READY: 'false',
  },
  { GAME_REQUESTS_ENABLED: 'false' },
]) {
  const f = await fixture(bindings);
  try {
    assert.deepEqual(await (await f.mf.dispatchFetch(publicPath)).json(), {
      available: false,
    });
    assert.equal((await post(f.mf)).status, 503);
    assert.equal(
      (await f.db.prepare('SELECT COUNT(*) n FROM game_requests').first()).n,
      0,
    );
  } finally {
    await f.mf.dispose();
  }
}
const incomplete = await fixture({}, false);
try {
  assert.deepEqual(
    await (await incomplete.mf.dispatchFetch(publicPath)).json(),
    { available: false },
  );
  assert.equal((await post(incomplete.mf)).status, 503);
} finally {
  await incomplete.mf.dispose();
}
const off = await fixture({ GAME_REQUESTS_ENABLED: 'false' });
try {
  const id = crypto.randomUUID(),
    now = Date.now();
  await off.db
    .prepare(
      'INSERT INTO game_requests(id,game_name,normalized_name,locale,created_at,updated_at)VALUES(?,?,?,?,?,?)',
    )
    .bind(id, 'Synthetic Backlog', 'synthetic backlog', 'en', now, now)
    .run();
  assert.equal(
    (
      await patch(off.mf, {
        action: 'review',
        id,
        expectedUpdatedAt: now,
        decision: 'adopt',
      })
    ).status,
    200,
  );
} finally {
  await off.mf.dispose();
}
const rate = await fixture();
try {
  const id = crypto.randomUUID();
  const results = await Promise.all(
    Array.from({ length: 40 }, () =>
      patch(rate.mf, {
        action: 'review',
        id,
        expectedUpdatedAt: 0,
        decision: 'hold',
      }),
    ),
  );
  assert.equal(results.filter((r) => r.status === 409).length, 30);
  assert.equal(results.filter((r) => r.status === 429).length, 10);
  assert.equal(
    (
      await rate.db
        .prepare(
          "SELECT COUNT(*) n FROM game_request_attempts WHERE fingerprint='manual'",
        )
        .first()
    ).n,
    30,
  );
  assert.equal((await post(rate.mf)).status, 201);
  assert.equal(
    (
      await rate.db
        .prepare(
          "SELECT COUNT(*) n FROM game_request_attempts WHERE day NOT LIKE 'manual:%'",
        )
        .first()
    ).n,
    1,
  );
} finally {
  await rate.mf.dispose();
}
console.log(
  'PASS: independent manual-readiness/intake gates, missing schema closed, backlog review with intake off, atomic 30/min admin cap isolated from public quota.',
);

// Explicit five-minute validation mode uses normal ingress/auth/quotas but no DELETE.
const start = Date.now() - 1000,
  end = Date.now() + 5000;
const validation = await fixture({
  GAME_REQUEST_REVIEW_MODE: 'manual-validation',
  GAME_REQUEST_VALIDATION_FROM: new Date(start).toISOString(),
  GAME_REQUEST_VALIDATION_UNTIL: new Date(end).toISOString(),
});
try {
  const oldId = crypto.randomUUID(),
    old = Date.now() - 100 * 86400000;
  await validation.db
    .prepare(
      'INSERT INTO game_requests(id,game_name,normalized_name,locale,created_at,updated_at)VALUES(?,?,?,?,?,?)',
    )
    .bind(
      oldId,
      'Synthetic Existing Old',
      'synthetic existing old',
      'en',
      old,
      old,
    )
    .run();
  await validation.db
    .prepare(
      'INSERT INTO game_request_daily_salts(day,salt,expires_at)VALUES(?,?,?)',
    )
    .bind('2000-01-01', 'synthetic-old-salt', 0)
    .run();
  await validation.db
    .prepare(
      'INSERT INTO game_request_attempts(id,day,fingerprint,created_at)VALUES(?,?,?,?)',
    )
    .bind('old-public', '2000-01-01', 'synthetic-old', 0)
    .run();
  await validation.db
    .prepare(
      'INSERT INTO game_request_attempts(id,day,fingerprint,created_at)VALUES(?,?,?,?)',
    )
    .bind('old-manual', 'manual:2000-01-01T00:00', 'manual', 0)
    .run();
  for (const table of [
    'game_requests',
    'game_request_daily_salts',
    'game_request_attempts',
  ])
    await validation.db.exec(
      `CREATE TRIGGER forbid_delete_${table} BEFORE DELETE ON ${table} BEGIN SELECT RAISE(ABORT,'no_delete_in_validation'); END`,
    );
  assert.deepEqual(
    await (await validation.mf.dispatchFetch(publicPath)).json(),
    { available: true },
  );
  assert.equal(
    (await post(validation.mf, 'Synthetic Timed Review')).status,
    201,
  );
  const row = await validation.db
    .prepare('SELECT id,updated_at FROM game_requests WHERE normalized_name=?')
    .bind('synthetic timed review')
    .first();
  assert.equal((await patch(validation.mf, action(row, 'adopt'))).status, 200);
  for (let i = 0; i < 4; i++)
    assert.equal(
      (await post(validation.mf, 'Synthetic Rate ' + i)).status,
      201,
    );
  assert.equal((await post(validation.mf, 'Synthetic Limited')).status, 429);
  assert.ok(
    await validation.db
      .prepare('SELECT id FROM game_requests WHERE id=?')
      .bind(oldId)
      .first(),
  );
  assert.ok(
    await validation.db
      .prepare('SELECT day FROM game_request_daily_salts WHERE day=?')
      .bind('2000-01-01')
      .first(),
  );
  assert.equal(
    (
      await validation.db
        .prepare(
          "SELECT COUNT(*) n FROM game_request_attempts WHERE id IN ('old-public','old-manual')",
        )
        .first()
    ).n,
    2,
  );
  await new Promise((resolve) =>
    setTimeout(resolve, Math.max(0, end - Date.now() + 80)),
  );
  assert.deepEqual(
    await (await validation.mf.dispatchFetch(publicPath)).json(),
    { available: false },
  );
  assert.equal(
    (await post(validation.mf, 'Synthetic After Expiry')).status,
    503,
  );
  const updated = await validation.db
    .prepare('SELECT id,updated_at FROM game_requests WHERE id=?')
    .bind(row.id)
    .first();
  assert.equal(
    (await patch(validation.mf, action(updated, 'hold'))).status,
    200,
  );
} finally {
  await validation.mf.dispose();
}
for (const [from, until] of [
  [undefined, undefined],
  ['invalid', 'invalid'],
  [
    new Date(Date.now() + 10000).toISOString(),
    new Date(Date.now() + 20000).toISOString(),
  ],
  [
    new Date(Date.now() - 20000).toISOString(),
    new Date(Date.now() - 10000).toISOString(),
  ],
  [
    new Date(Date.now() - 1000).toISOString(),
    new Date(Date.now() + 300001).toISOString(),
  ],
]) {
  const f = await fixture({
    GAME_REQUEST_REVIEW_MODE: 'manual-validation',
    ...(from === undefined ? {} : { GAME_REQUEST_VALIDATION_FROM: from }),
    ...(until === undefined ? {} : { GAME_REQUEST_VALIDATION_UNTIL: until }),
  });
  try {
    assert.deepEqual(await (await f.mf.dispatchFetch(publicPath)).json(), {
      available: false,
    });
    assert.equal((await post(f.mf)).status, 503);
    assert.equal(
      (
        await f.db
          .prepare('SELECT COUNT(*) n FROM game_request_attempts')
          .first()
      ).n,
      0,
    );
    assert.equal(
      (
        await f.db
          .prepare('SELECT COUNT(*) n FROM game_request_daily_salts')
          .first()
      ).n,
      0,
    );
  } finally {
    await f.mf.dispose();
  }
}
console.log(
  'PASS: explicit timed validation expires closed, invalid/future/overlong windows deny without writes, normal quotas preserved, and DELETE-aborting triggers prove intake/review retain every expired fixture.',
);

// Delay the salt DB call across expiry in a local-only binding wrapper. The
// real route must not create even a daily salt after the window has expired.
const delayed = await build({
  stdin: {
    contents: `import * as p from './app/api/game-requests/route.ts';export default {fetch(r){return p[r.method](r);}}`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'browser',
  plugins: [
    {
      name: 'local-delayed-salt-binding',
      setup(b) {
        b.onResolve({ filter: /^cloudflare:workers$/ }, (args) =>
          args.namespace === 'test-delay'
            ? { path: args.path, external: true }
            : { path: 'delay', namespace: 'test-delay' },
        );
        b.onLoad({ filter: /.*/, namespace: 'test-delay' }, () => ({
          loader: 'js',
          contents: `
      import {env as original} from 'cloudflare:workers';
      export const env = new Proxy(original,{get(target,key){
        if(key!=='DB')return target[key];
        const db=target.DB;
        return {batch:db.batch.bind(db),prepare(sql){
          const statement=db.prepare(sql);
          if(!sql.includes('INSERT OR IGNORE INTO game_request_daily_salts'))return statement;
          return {bind(...values){const bound=statement.bind(...values);return {async run(){await new Promise(resolve=>setTimeout(resolve,Number(target.LOCAL_TEST_DELAY_SALT_MS)));return bound.run();}};}};
        }};
      }});
    `,
        }));
      },
    },
  ],
});
const deadline = Date.now() + 2500;
const late = await fixture(
  {
    GAME_REQUEST_REVIEW_MODE: 'manual-validation',
    GAME_REQUEST_VALIDATION_FROM: new Date(deadline - 60000).toISOString(),
    GAME_REQUEST_VALIDATION_UNTIL: new Date(deadline).toISOString(),
    LOCAL_TEST_DELAY_SALT_MS: '2700',
  },
  true,
  delayed.outputFiles[0].text,
);
try {
  assert.deepEqual(await (await late.mf.dispatchFetch(publicPath)).json(), {
    available: true,
  });
  assert.equal((await post(late.mf, 'Synthetic Delayed Salt')).status, 503);
  for (const table of [
    'game_requests',
    'game_request_daily_salts',
    'game_request_attempts',
  ])
    assert.equal(
      (await late.db.prepare('SELECT COUNT(*) n FROM ' + table).first()).n,
      0,
    );
} finally {
  await late.mf.dispose();
}
console.log(
  'PASS: delayed D1 salt INSERT crosses deadline and is refused without salt, attempt, or request writes.',
);
