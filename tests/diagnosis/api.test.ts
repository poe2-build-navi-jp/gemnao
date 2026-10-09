import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import {
  handleDiagnosis as handle,
  cleanupDiagnosis,
  type DiagnosisEnv,
} from '../../lib/diagnosis/server';
import cleanupWorker from '../../cloudflare/diagnosis-cleanup';
import { actions } from '../../lib/diagnosis/rules';
import { RULE_VERSION, answerLabel } from '../../lib/diagnosis/model';
import { buildSnapshot, type Snapshot } from '../../lib/diagnosis/validation';
type TestDTO = {
  id: string;
  recoveryKey: string;
  expiresAt: number;
  updatedAt: number;
  snapshot: Snapshot;
  sharing: boolean;
  metrics: boolean;
  enabled: boolean;
  inactive: boolean;
  repeated: boolean;
};
async function handleDiagnosis(
  ...args: Parameters<typeof handle>
): Promise<Omit<Response, 'json'> & { json(): Promise<TestDTO> }> {
  return (await handle(...args)) as Omit<Response, 'json'> & {
    json(): Promise<TestDTO>;
  };
}
function database() {
  const sql = new DatabaseSync(':memory:');
  sql.exec(
    "CREATE TABLE issue_feedback (label TEXT); INSERT INTO issue_feedback VALUES ('existing');",
  );
  sql.exec(readFileSync('migrations/diagnosis/0001_diagnosis.sql', 'utf8'));
  const wrap = (statement: string, values: unknown[] = []) => ({
    bind(...v: unknown[]) {
      return wrap(statement, v);
    },
    async first(column?: string) {
      const row = sql.prepare(statement).get(...(values as never[]));
      return column ? (row?.[column] ?? null) : (row ?? null);
    },
    async all() {
      return { results: sql.prepare(statement).all(...(values as never[])) };
    },
    async run() {
      const result = sql.prepare(statement).run(...(values as never[]));
      return { success: true, meta: { changes: Number(result.changes) } };
    },
  });
  const db = {
    prepare: (s: string) => wrap(s),
    async batch(stmts: { run: () => Promise<unknown> }[]) {
      sql.exec('BEGIN');
      try {
        const result = [];
        for (const s of stmts) result.push(await s.run());
        sql.exec('COMMIT');
        return result;
      } catch (e) {
        sql.exec('ROLLBACK');
        throw e;
      }
    },
  } as unknown as D1Database;
  return { db, sql };
}
const now = Date.UTC(2026, 9, 2, 4);
const input = {
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
  version: RULE_VERSION,
};
function req(
  path: string,
  body?: unknown,
  cookie = '',
  method = body === undefined ? 'GET' : 'POST',
  extra: Record<string, string> = {},
) {
  return new Request(`https://gemnao.test/api/diagnosis${path}`, {
    method,
    headers: {
      Origin: 'https://gemnao.test',
      'X-Diagnosis-Request': '1',
      'Content-Type': 'application/json',
      'CF-Connecting-IP': '192.0.2.1',
      ...(cookie ? { Cookie: cookie } : {}),
      ...extra,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
async function setup() {
  const { db, sql } = database();
  const env: DiagnosisEnv = {
    DIAGNOSIS_DB: db,
    DIAGNOSIS_ENABLED: 'true',
    DIAGNOSIS_STORAGE_ENABLED: 'true',
    DIAGNOSIS_SHARING_ENABLED: 'true',
    DIAGNOSIS_METRICS_ENABLED: 'true',
  };
  await cleanupDiagnosis(db, now);
  const session = await handleDiagnosis(req('/session', {}), env, now);
  const cookie = session.headers.get('set-cookie')!.split(';')[0];
  return { env, db, sql, cookie };
}
async function create(env: DiagnosisEnv, cookie: string, at = now) {
  const nonce = crypto.randomUUID().replaceAll('-', '');
  const r = await handleDiagnosis(
    req('', { snapshot: input, requestId: nonce }, cookie),
    env,
    at,
  );
  assert.equal(r.status, 201);
  return { data: await r.json(), nonce };
}
void test('migration and cleanup retain existing data, additive/repeatable', async () => {
  const { db, sql } = database();
  sql.exec(readFileSync('migrations/diagnosis/0001_diagnosis.sql', 'utf8'));
  await cleanupDiagnosis(db, now);
  assert.equal(
    sql.prepare('SELECT label FROM issue_feedback').get()?.label,
    'existing',
  );
});
void test('default sharing disabled, stale/missing cleanup fail closed', async () => {
  const { env, db, cookie, sql } = await setup();
  assert.equal(
    (
      await handleDiagnosis(
        req('', { snapshot: input, requestId: 'a'.repeat(32) }, cookie),
        { ...env, DIAGNOSIS_SHARING_ENABLED: undefined },
        now,
      )
    ).status,
    503,
  );
  sql.exec('DELETE FROM diagnosis_operations');
  assert.equal(
    (await handleDiagnosis(req('/session', {}), env, now)).status,
    503,
  );
  await cleanupDiagnosis(db, now - 7200001);
  assert.equal(
    (await handleDiagnosis(req('/session', {}), env, now)).status,
    503,
  );
  assert.equal(
    (await (await handleDiagnosis(req('/config'), env, now)).json()).sharing,
    false,
  );
});
void test('share creation optional and owner cookie secure, independent identifiers, server stores only hashes', async () => {
  const { env, sql, cookie } = await setup();
  assert.equal(
    sql.prepare('SELECT COUNT(*) n FROM diagnosis_shared').get()?.n,
    0,
  );
  const { data } = await create(env, cookie);
  assert.match(data.id, /^[a-f0-9]{32}$/);
  assert.match(data.recoveryKey, /^[a-f0-9]{64}$/);
  assert.notEqual(cookie.split('=')[1], data.recoveryKey);
  const row = sql.prepare('SELECT * FROM diagnosis_shared').get()!;
  assert.notEqual(row.owner_hash, cookie.split('=')[1]);
  assert.notEqual(row.recovery_hash, data.recoveryKey);
  assert.equal(row.expires_at, now + 30 * 86400000);
  const session = await handleDiagnosis(req('/session', {}), env, now);
  assert.match(
    session.headers.get('set-cookie')!,
    /Secure; HttpOnly; SameSite=Strict/,
  );
});
void test('public DTO and headers never expose management information', async () => {
  const { env, cookie } = await setup();
  const { data } = await create(env, cookie);
  const r = await handleDiagnosis(req('/' + data.id), env, now);
  const raw = await r.text();
  for (const forbidden of [
    'owner_hash',
    'recovery_hash',
    'request_id',
    data.recoveryKey,
    cookie.split('=')[1],
    '192.0.2.1',
  ])
    assert.ok(!raw.includes(forbidden));
  assert.equal(r.headers.get('cache-control'), 'private, no-store');
  assert.match(r.headers.get('x-robots-tag')!, /noindex/);
  assert.equal(r.headers.get('referrer-policy'), 'no-referrer');
});
void test('other browser and bare share ID cannot view owner or mutate/revoke/delete', async () => {
  const { env, cookie } = await setup();
  const { data } = await create(env, cookie);
  for (const [suffix, body, method] of [
    ['/owner', undefined, 'GET'],
    ['', { results: { dx: 'improved' }, revision: 1 }, 'PATCH'],
    ['/revoke', {}, 'POST'],
    ['', {}, 'DELETE'],
  ] as const) {
    const r = await handleDiagnosis(
      req('/' + data.id + suffix, body, '', method),
      env,
      now,
    );
    assert.equal(r.status, 403);
  }
  assert.equal(
    (await handleDiagnosis(req('/' + data.id), env, now)).status,
    200,
  );
});
void test('CSRF and non-JSON/malformed/oversized bodies rejected', async () => {
  const { env, cookie } = await setup();
  const { data } = await create(env, cookie);
  assert.equal(
    (
      await handleDiagnosis(
        req('/' + data.id, {}, cookie, 'DELETE', {
          Origin: 'https://evil.test',
        }),
        env,
        now,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleDiagnosis(
        req('/' + data.id, {}, cookie, 'DELETE', { 'X-Diagnosis-Request': '' }),
        env,
        now,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleDiagnosis(
        req('/session', {}, cookie, 'POST', { 'Content-Type': 'text/plain' }),
        env,
        now,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await handleDiagnosis(
        req('/session', { x: 'x'.repeat(20000) }, cookie),
        env,
        now,
      )
    ).status,
    400,
  );
});
void test('strict server choices reject free text, stale dependent errors, client rankings and prototype keys', async () => {
  for (const mutation of [
    { ...input, answers: { ...input.answers, email: 'person@example.com' } },
    { ...input, game: 'someone' },
    { ...input, answers: { ...input.answers, observation: 'nothing' } },
    { ...input, answers: { ...input.answers, gpu: '<script>' } },
    { ...input, results: { fake: 'improved' } },
    { ...input, version: 'future' },
  ])
    assert.equal(buildSnapshot(mutation), null);
});
void test('manual updates use revision, preserve original answer snapshot/version/expiry', async () => {
  const { env, cookie } = await setup();
  const { data } = await create(env, cookie);
  const r = await handleDiagnosis(
    req(
      '/' + data.id,
      { results: { dx: 'improved' }, revision: 1 },
      cookie,
      'PATCH',
    ),
    env,
    now + 1000,
  );
  assert.equal(r.status, 200);
  assert.equal(
    (
      await handleDiagnosis(
        req(
          '/' + data.id,
          { results: { dx: 'unchanged' }, revision: 1 },
          cookie,
          'PATCH',
        ),
        env,
        now + 1001,
      )
    ).status,
    409,
  );
  const publicData = await (
    await handleDiagnosis(req('/' + data.id), env, now + 1001)
  ).json();
  assert.equal(publicData.snapshot.result.version, RULE_VERSION);
  assert.equal(publicData.snapshot.results.dx, 'improved');
  assert.deepEqual(publicData.snapshot.answers, input.answers);
  assert.equal(publicData.expiresAt, data.expiresAt);
  assert.equal(publicData.updatedAt, now + 1000);
});
void test('expired/revoked/deleted inaccessible; owner receives only inactive metadata', async () => {
  const { env, cookie, db, sql } = await setup();
  const { data } = await create(env, cookie);
  assert.equal(
    (await handleDiagnosis(req('/' + data.id), env, now + 30 * 86400000))
      .status,
    404,
  );
  const own = await (
    await handleDiagnosis(
      req('/' + data.id + '/owner', undefined, cookie),
      env,
      now + 30 * 86400000,
    )
  ).json();
  assert.equal(own.inactive, true);
  assert.ok(!own.snapshot);
  await cleanupDiagnosis(db, now + 30 * 86400000);
  assert.equal(
    sql.prepare('SELECT COUNT(*) n FROM diagnosis_shared').get()?.n,
    0,
  );
  const second = await create(env, cookie, now + 30 * 86400000);
  assert.equal(
    (
      await handleDiagnosis(
        req('/' + second.data.id + '/revoke', {}, cookie),
        env,
        now + 30 * 86400000,
      )
    ).status,
    200,
  );
  assert.equal(
    (await handleDiagnosis(req('/' + second.data.id), env, now + 30 * 86400000))
      .status,
    404,
  );
  assert.equal(
    (
      await handleDiagnosis(
        req('/' + second.data.id, {}, cookie, 'DELETE'),
        env,
        now + 30 * 86400000,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await handleDiagnosis(
        req('/' + second.data.id + '/owner', undefined, cookie),
        env,
        now + 30 * 86400000,
      )
    ).status,
    403,
  );
});
void test('owner recovery, revoke, delete remain available under kill switches and stale cleanup', async () => {
  const { env, cookie } = await setup();
  const { data } = await create(env, cookie);
  const stopped = {
    ...env,
    DIAGNOSIS_ENABLED: 'false',
    DIAGNOSIS_SHARING_ENABLED: 'false',
    DIAGNOSIS_WRITES_ENABLED: 'false',
  };
  const recover = await handleDiagnosis(
    req('/' + data.id + '/recover', { key: data.recoveryKey }),
    stopped,
    now + 4 * 3600000,
  );
  assert.equal(recover.status, 200);
  const replacement = recover.headers.get('set-cookie')!.split(';')[0];
  assert.equal(
    (
      await handleDiagnosis(
        req('/' + data.id + '/revoke', {}, replacement),
        stopped,
        now + 4 * 3600000,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await handleDiagnosis(
        req('/' + data.id, {}, replacement, 'DELETE'),
        stopped,
        now + 4 * 3600000,
      )
    ).status,
    200,
  );
});
void test('create retries idempotent, one-time recovery secret not recovered or saved again', async () => {
  const { env, cookie, sql } = await setup();
  const { data, nonce } = await create(env, cookie);
  const again = await (
    await handleDiagnosis(
      req('', { snapshot: input, requestId: nonce }, cookie),
      env,
      now,
    )
  ).json();
  assert.equal(again.id, data.id);
  assert.equal(again.recoveryKey, null);
  assert.equal(again.repeated, true);
  assert.equal(
    sql.prepare('SELECT COUNT(*) n FROM diagnosis_shared').get()?.n,
    1,
  );
});
void test('atomic create rate limit bounds rows, wrong recovery attempts rate limited', async () => {
  const { env, cookie, sql } = await setup();
  let share: TestDTO | undefined;
  for (let i = 0; i < 5; i++) share = (await create(env, cookie)).data;
  assert.equal(
    (
      await handleDiagnosis(
        req('', { snapshot: input, requestId: 'b'.repeat(32) }, cookie),
        env,
        now,
      )
    ).status,
    429,
  );
  assert.equal(
    sql.prepare('SELECT COUNT(*) n FROM diagnosis_shared').get()?.n,
    5,
  );
  for (let i = 0; i < 5; i++)
    assert.equal(
      (
        await handleDiagnosis(
          req('/' + share!.id + '/recover', { key: 'c'.repeat(64) }),
          env,
          now,
        )
      ).status,
      403,
    );
  assert.equal(
    (
      await handleDiagnosis(
        req('/' + share!.id + '/recover', { key: 'c'.repeat(64) }),
        env,
        now,
      )
    ).status,
    429,
  );
  const dump = JSON.stringify(
    sql.prepare('SELECT * FROM diagnosis_rate_limits').all(),
  );
  assert.ok(!dump.includes('192.0.2.1'));
});
void test('database outage returns generic failure, never false success', async () => {
  const broken = {
    prepare() {
      throw new Error('PRIVATE SQL AND SECRET');
    },
  } as unknown as D1Database;
  const r = await handleDiagnosis(
    req('/session', {}),
    { DIAGNOSIS_DB: broken, DIAGNOSIS_ENABLED: 'true', DIAGNOSIS_STORAGE_ENABLED: 'true', DIAGNOSIS_SHARING_ENABLED: 'true' },
    now,
  );
  assert.equal(r.status, 503);
  assert.ok(!(await r.text()).includes('PRIVATE'));
});
void test('minimal metrics reject URLs/free input; no missing answer assumed failure', async () => {
  const { env, sql } = await setup();
  assert.equal(
    (
      await handleDiagnosis(
        req('/events', {
          event: 'record',
          step: 'none',
          action: 'dx',
          status: 'improved',
        }),
        env,
        now,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await handleDiagnosis(
        req('/events', {
          event: 'record',
          step: 'none',
          action: 'dx',
          status: 'improved',
          game: 'name',
        }),
        env,
        now,
      )
    ).status,
    400,
  );
  assert.equal(
    sql
      .prepare(
        "SELECT count FROM diagnosis_metrics WHERE event='record' AND status='improved'",
      )
      .get()?.count,
    1,
  );
  assert.equal(
    sql
      .prepare("SELECT count FROM diagnosis_metrics WHERE status='unchanged'")
      .get(),
    undefined,
  );
});
void test('observation labels use symptom context', () => {
  assert.equal(
    answerLabel('observation', 'startup', 'black-screen'),
    '起動時から黒い',
  );
  assert.equal(
    answerLabel('observation', 'startup', 'crash'),
    '起動直後に閉じる',
  );
});
void test('unverified preview storage gate never touches D1 even for owner APIs', async () => {
  let touched = false;
  const db = {
    prepare() {
      touched = true;
      throw new Error('must not touch');
    },
  } as unknown as D1Database;
  const env: DiagnosisEnv = {
    DIAGNOSIS_DB: db,
    DIAGNOSIS_SHARING_ENABLED: 'true',
    DIAGNOSIS_METRICS_ENABLED: 'true',
  };
  assert.equal(
    (await handleDiagnosis(req('/' + 'a'.repeat(32) + '/owner'), env, now))
      .status,
    503,
  );
  const config = await (await handleDiagnosis(req('/config'), env, now)).json();
  assert.equal(config.sharing, false);
  assert.equal(touched, false);
});

void test('archived answer and attempted-action labels survive future registry changes', async () => {
  const { env, cookie } = await setup();
  const { data } = await create(env, cookie);
  const previous = actions.verify.title;
  try {
    actions.verify.title = 'FUTURE TITLE MUST NOT APPEAR';
    const shared = await (
      await handleDiagnosis(req('/' + data.id), env, now)
    ).json();
    assert.equal(shared.snapshot.actionLabels.verify, previous);
    assert.equal(shared.snapshot.answerLabels.symptom, 'ゲームが起動しない');
    assert.equal(shared.snapshot.answerLabels.error, 'DirectX / DXGI');
  } finally {
    actions.verify.title = previous;
  }
});

void test('stale cleanup disables metric writes as well as shares', async () => {
  const { env, sql } = await setup();
  sql.exec("DELETE FROM diagnosis_operations WHERE key='cleanup_success'");
  const config = await (await handleDiagnosis(req('/config'), env, now)).json();
  assert.equal(config.metrics, false);
  assert.equal(
    (
      await handleDiagnosis(
        req('/events', {
          event: 'record',
          step: 'none',
          action: 'dx',
          status: 'improved',
        }),
        env,
        now,
      )
    ).status,
    503,
  );
  assert.equal(
    sql.prepare('SELECT COUNT(*) n FROM diagnosis_metrics').get()?.n,
    0,
  );
});

void test('daily metrics bucket at the 30-day boundary is purged, newer bucket remains', async () => {
  const { db, sql } = await setup();
  const cutoff = new Date(now - 30 * 86400000).toISOString().slice(0, 10);
  const newer = new Date(now - 29 * 86400000).toISOString().slice(0, 10);
  const insert = sql.prepare(
    "INSERT INTO diagnosis_metrics (day,event,step,action,status,count) VALUES (?,'start','none','none','none',1)",
  );
  insert.run(cutoff);
  insert.run(newer);
  await cleanupDiagnosis(db, now);
  assert.deepEqual(
    sql
      .prepare('SELECT day FROM diagnosis_metrics ORDER BY day')
      .all()
      .map((row) => row.day),
    [newer],
  );
});

void test('every storage route stays closed when storage permission is absent, even if other gates are true', async () => {
  const db = {
    prepare() { throw new Error('unapproved D1 access'); },
    batch() { throw new Error('unapproved D1 access'); },
  } as unknown as D1Database;
  const env: DiagnosisEnv = { DIAGNOSIS_DB: db, DIAGNOSIS_ENABLED: 'true', DIAGNOSIS_SHARING_ENABLED: 'true', DIAGNOSIS_WRITES_ENABLED: 'true', DIAGNOSIS_METRICS_ENABLED: 'true' };
  const id = 'b'.repeat(32);
  for (const [path, method] of [
    ['/session', 'POST'], ['', 'POST'], ['/events', 'POST'],
    [`/${id}`, 'GET'], [`/${id}`, 'PATCH'], [`/${id}`, 'DELETE'],
    [`/${id}/owner`, 'GET'], [`/${id}/recover`, 'POST'], [`/${id}/revoke`, 'POST'],
  ]) {
    const response = await handleDiagnosis(req(path, method === 'GET' ? undefined : {}, '', method), env, now);
    assert.equal(response.status, 503, `${method} ${path}`);
  }
  const config = await (await handleDiagnosis(req('/config'), env, now)).json();
  assert.equal(config.sharing, false);
  assert.equal(config.metrics, false);
});

void test('entire diagnosis intake needs explicit runtime activation while owner deletion survives shutdown', async () => {
  const { env, cookie, sql } = await setup();
  const { data } = await create(env, cookie);
  for (const value of [undefined, 'false', '', '1', 'TRUE']) {
    const disabled = { ...env, DIAGNOSIS_ENABLED: value };
    const config = await (await handleDiagnosis(req('/config'), disabled, now)).json();
    assert.equal(config.enabled, false);
    assert.equal(config.sharing, false);
    assert.equal(config.metrics, false);
    assert.equal((await handleDiagnosis(req('/session', {}), disabled, now)).status, 503);
    assert.equal((await handleDiagnosis(req('/' + data.id), disabled, now)).status, 503);
  }
  assert.equal((await handleDiagnosis(req('/' + data.id, {}, cookie, 'DELETE'), { ...env, DIAGNOSIS_ENABLED: undefined }, now)).status, 200);
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM diagnosis_shared').get()?.n, 0);
});

void test('local-only beta advertises no collection and rejects public storage even with stale runtime flags', async () => {
  let touched = false;
  const db = { prepare() { touched = true; throw new Error('no beta DB access'); } } as unknown as D1Database;
  const env: DiagnosisEnv = { DIAGNOSIS_DB: db, DIAGNOSIS_LOCAL_BETA: 'true', DIAGNOSIS_ENABLED: 'true', DIAGNOSIS_STORAGE_ENABLED: 'true', DIAGNOSIS_SHARING_ENABLED: 'true', DIAGNOSIS_METRICS_ENABLED: 'true' };
  const config = await (await handleDiagnosis(req('/config'), env, now)).json();
  assert.equal(config.enabled, true);
  assert.equal(config.sharing, false);
  assert.equal(config.metrics, false);
  for (const [path, method] of [['/session', 'POST'], ['', 'POST'], ['/events', 'POST'], ['/' + 'a'.repeat(32), 'GET'], ['/' + 'a'.repeat(32), 'PATCH']]) {
    assert.equal((await handleDiagnosis(req(path, method === 'GET' ? undefined : {}, '', method), env, now)).status, 503);
  }
  assert.equal(touched, false);
});

void test('local beta keeps pre-existing owner deletion behind its separate storage permission', async () => {
  const { env, cookie, sql } = await setup();
  const { data } = await create(env, cookie);
  const beta = { ...env, DIAGNOSIS_LOCAL_BETA: 'true', DIAGNOSIS_ENABLED: undefined };
  assert.equal((await handleDiagnosis(req('/' + data.id, {}, cookie, 'DELETE'), { ...beta, DIAGNOSIS_STORAGE_ENABLED: undefined }, now)).status, 503);
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM diagnosis_shared').get()?.n, 1);
  assert.equal((await handleDiagnosis(req('/' + data.id, {}, cookie, 'DELETE'), beta, now)).status, 200);
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM diagnosis_shared').get()?.n, 0);
});

void test('ordinary site DB never substitutes for missing DIAGNOSIS_DB with every diagnosis flag enabled', async () => {
  let touched = false;
  const ordinary = {
    prepare() { touched = true; throw new Error('ordinary DB must not be used'); },
    batch() { touched = true; throw new Error('ordinary DB must not be used'); },
  } as unknown as D1Database;
  const env: DiagnosisEnv & { DB: D1Database } = {
    DB: ordinary,
    DIAGNOSIS_ENABLED: 'true',
    DIAGNOSIS_STORAGE_ENABLED: 'true',
    DIAGNOSIS_SHARING_ENABLED: 'true',
    DIAGNOSIS_WRITES_ENABLED: 'true',
    DIAGNOSIS_METRICS_ENABLED: 'true',
  };
  const id = 'b'.repeat(32);
  for (const [path, method] of [
    ['/session', 'POST'], ['', 'POST'], ['/events', 'POST'],
    [`/${id}`, 'GET'], [`/${id}`, 'PATCH'], [`/${id}`, 'DELETE'],
    [`/${id}/owner`, 'GET'], [`/${id}/recover`, 'POST'], [`/${id}/revoke`, 'POST'],
  ]) {
    const response = await handleDiagnosis(req(path, method === 'GET' ? undefined : {}, '', method), env, now);
    assert.equal(response.status, 503, `${method} ${path}`);
  }
  const config = await (await handleDiagnosis(req('/config'), env, now)).json();
  assert.equal(config.sharing, false);
  assert.equal(config.metrics, false);
  assert.equal(touched, false);
});

void test('local beta config does not even resolve a stale storage binding', async () => {
  const env: DiagnosisEnv = {
    DIAGNOSIS_LOCAL_BETA: 'true',
    DIAGNOSIS_ENABLED: 'true',
    DIAGNOSIS_STORAGE_ENABLED: 'true',
    DIAGNOSIS_SHARING_ENABLED: 'true',
    DIAGNOSIS_METRICS_ENABLED: 'true',
    get DIAGNOSIS_DB(): D1Database { throw new Error('local config cannot access storage'); },
  };
  const config = await (await handleDiagnosis(req('/config'), env, now)).json();
  assert.deepEqual(config, { enabled: true, sharing: false, metrics: false, localOnly: true });
});

void test('scheduled cleanup fails closed without DIAGNOSIS_DB and never falls back to ordinary DB', async () => {
  let touched = false;
  const env: { DIAGNOSIS_DB?: D1Database; DB: D1Database } = {
    DB: {
      prepare() { touched = true; throw new Error('ordinary DB must not be cleaned'); },
      batch() { touched = true; throw new Error('ordinary DB must not be cleaned'); },
    } as unknown as D1Database,
  };
  await assert.rejects(
    cleanupWorker.scheduled({} as ScheduledController, env, {} as ExecutionContext),
    /DIAGNOSIS_DB binding is required/,
  );
  assert.equal(touched, false);
});

void test('API and scheduled cleanup use dedicated diagnosis storage when ordinary DB is also present', async () => {
  const { env, cookie, sql } = await setup();
  let ordinaryTouched = false;
  const isolated = {
    ...env,
    DB: {
      prepare() { ordinaryTouched = true; throw new Error('ordinary DB must not be used'); },
      batch() { ordinaryTouched = true; throw new Error('ordinary DB must not be used'); },
    } as unknown as D1Database,
  };
  const { data } = await create(isolated, cookie);
  assert.equal((await handleDiagnosis(req('/' + data.id), isolated, now)).status, 200);
  sql.prepare('UPDATE diagnosis_shared SET expires_at=1 WHERE id=?').run(data.id);
  await cleanupWorker.scheduled({} as ScheduledController, isolated, {} as ExecutionContext);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM diagnosis_shared').get()?.n, 0);
  assert.ok(Number(sql.prepare("SELECT value FROM diagnosis_operations WHERE key='cleanup_success'").get()?.value) > 0);
  assert.equal(ordinaryTouched, false);
});

void test('cleanup failure rolls back deletions and cannot refresh the last successful heartbeat', async () => {
  const { env, cookie, db, sql } = await setup();
  const { data } = await create(env, cookie);
  sql.prepare('UPDATE diagnosis_shared SET expires_at=1 WHERE id=?').run(data.id);
  // Force the second operation in the deletion batch to fail after the first ran.
  sql.exec('DROP TABLE diagnosis_rate_limits');
  await assert.rejects(cleanupDiagnosis(db, now + 3600000), /no such table/);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM diagnosis_shared').get()?.n, 1);
  assert.equal(sql.prepare("SELECT value FROM diagnosis_operations WHERE key='cleanup_success'").get()?.value, String(now));
});

const previewOrigin = 'https://qa-isolated.gemnao.pages.dev';
function previewReq(path: string, body?: unknown, cookie = '', method = body === undefined ? 'GET' : 'POST', origin = previewOrigin) {
  return new Request(origin + '/api/diagnosis' + path, {
    method, headers: { Origin: origin, 'X-Diagnosis-Request': '1', 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.10', ...(cookie ? { Cookie: cookie } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
void test('preview exception needs exact origin and explicit flag, production stays local-only without touching storage', async () => {
  const blockedDb = { prepare() { throw new Error('must not read storage'); } } as unknown as D1Database;
  const env: DiagnosisEnv = { DIAGNOSIS_LOCAL_BETA: 'true', DIAGNOSIS_ENABLED: 'true', DIAGNOSIS_STORAGE_ENABLED: 'true', DIAGNOSIS_SHARING_ENABLED: 'true', DIAGNOSIS_WRITES_ENABLED: 'true', DIAGNOSIS_METRICS_ENABLED: 'true', DIAGNOSIS_DB: blockedDb, DIAGNOSIS_PREVIEW_SHARING_ENABLED: 'true', DIAGNOSIS_PREVIEW_ORIGIN: previewOrigin };
  for (const origin of ['https://gemnao.pages.dev', 'https://other.gemnao.pages.dev', 'https://qa-isolated.gemnao.pages.dev.attacker.test', 'http://qa-isolated.gemnao.pages.dev']) {
    const config = await (await handleDiagnosis(previewReq('/config', undefined, '', 'GET', origin), env, now)).json();
    assert.deepEqual(config, { enabled: true, sharing: false, metrics: false, localOnly: true });
    assert.equal((await handleDiagnosis(previewReq('/session', {}, '', 'POST', origin), env, now)).status, 503);
    // A stale non-beta flag still cannot broaden a preview-scoped activation.
    assert.equal((await handleDiagnosis(previewReq('/session', {}, '', 'POST', origin), { ...env, DIAGNOSIS_LOCAL_BETA: 'false' }, now)).status, 503);
  }
  for (const flag of [undefined, 'false', '', 'TRUE', '1']) {
    assert.equal((await handleDiagnosis(previewReq('/session', {}), { ...env, DIAGNOSIS_PREVIEW_SHARING_ENABLED: flag }, now)).status, 503);
  }
  for (const origin of [undefined, '', 'https://gemnao.pages.dev', previewOrigin + '/', previewOrigin + ':443', 'https://attacker.test']) {
    assert.equal((await handleDiagnosis(previewReq('/session', {}), { ...env, DIAGNOSIS_PREVIEW_ORIGIN: origin }, now)).status, 503);
  }
});
void test('preview creates and reads only after cleanup, never records metrics, deletion survives preview shutdown', async () => {
  const { env: base, sql } = await setup();
  sql.exec('DELETE FROM diagnosis_operations');
  const env: DiagnosisEnv = { ...base, DIAGNOSIS_WRITES_ENABLED: 'true', DIAGNOSIS_LOCAL_BETA: 'true', DIAGNOSIS_PREVIEW_SHARING_ENABLED: 'true', DIAGNOSIS_PREVIEW_ORIGIN: previewOrigin };
  const before = await (await handleDiagnosis(previewReq('/config'), env, now)).json();
  assert.equal(before.sharing, false);
  assert.equal(before.metrics, false);
  assert.equal((await handleDiagnosis(previewReq('/session', {}), env, now)).status, 503);
  await cleanupDiagnosis(env.DIAGNOSIS_DB!, now);
  assert.equal((await handleDiagnosis(previewReq('/session', {}), { ...env, DIAGNOSIS_WRITES_ENABLED: undefined }, now)).status, 503);
  assert.deepEqual(await (await handleDiagnosis(previewReq('/config'), env, now)).json(), { enabled: true, sharing: true, metrics: false, localOnly: false, previewSharing: true });
  const session = await handleDiagnosis(previewReq('/session', {}), env, now);
  assert.equal(session.status, 200);
  const cookie = session.headers.get('set-cookie')!.split(';')[0];
  const created = await handleDiagnosis(previewReq('', { snapshot: input, requestId: 'f'.repeat(32) }, cookie), env, now);
  assert.equal(created.status, 201);
  const data = await created.json();
  assert.equal((await handleDiagnosis(previewReq('/' + data.id), env, now)).status, 200);
  const events = await handleDiagnosis(previewReq('/events', { event: 'start', step: 'none', action: 'none', status: 'none' }), env, now);
  assert.deepEqual(await events.json(), { ok: true, recorded: false });
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM diagnosis_metrics').get()?.n, 0);
  await cleanupDiagnosis(env.DIAGNOSIS_DB!, now - 7200001);
  assert.equal((await handleDiagnosis(previewReq('/session', {}), env, now)).status, 503);
  const stopped = { ...env, DIAGNOSIS_PREVIEW_SHARING_ENABLED: 'false', DIAGNOSIS_ENABLED: 'false' };
  assert.equal((await handleDiagnosis(previewReq('/' + data.id, {}, cookie, 'DELETE'), stopped, now)).status, 200);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM diagnosis_shared').get()?.n, 0);
});
void test('preview exception does not provide storage permission or a fallback DB', async () => {
  const env: DiagnosisEnv = { DIAGNOSIS_LOCAL_BETA: 'true', DIAGNOSIS_ENABLED: 'true', DIAGNOSIS_SHARING_ENABLED: 'true', DIAGNOSIS_PREVIEW_SHARING_ENABLED: 'true', DIAGNOSIS_PREVIEW_ORIGIN: previewOrigin };
  const noFallback = { ...env, DIAGNOSIS_STORAGE_ENABLED: 'true', DB: { prepare() { throw new Error('ordinary DB forbidden'); } } };
  for (const closed of [env, noFallback]) {
    assert.equal((await handleDiagnosis(previewReq('/session', {}), closed, now)).status, 503);
    assert.equal((await (await handleDiagnosis(previewReq('/config'), closed, now)).json()).sharing, false);
  }
});
