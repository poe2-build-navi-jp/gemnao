import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { TARGET, FLAGS } from '../../ops/community-reports/closed-setup.mjs';
import { RELEASE } from '../../ops/community-reports/code-deploy.mjs';
import { configProjection } from '../../ops/community-reports/managed-config.mjs';
import {
  BASE,
  ANCHOR,
  MODE,
  CRON,
  COUNT_SQL,
  CONFIRM,
  launchContext,
  launchClient,
  executeLaunch,
} from '../../ops/community-reports/free-launch.mjs';
const base = JSON.parse(await readFile('wrangler.json', 'utf8')),
  schema = await readFile('migrations/community-reports/0001.sql', 'utf8');
const now = Date.now(),
  sha = 'a'.repeat(40),
  token = 'synthetic-not-a-real-credential';
const environment = (op) => ({
  GITHUB_ACTIONS: 'true',
  GITHUB_REPOSITORY: TARGET.repository,
  GITHUB_REF: 'refs/heads/gemunao',
  GITHUB_WORKFLOW: TARGET.workflow,
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_RUN_ATTEMPT: '1',
  GITHUB_SHA: sha,
  GITHUB_RUN_ID: '99999',
  REPORTS_SETUP_OPERATION: op,
  REPORTS_SETUP_SOURCE_SHA: sha,
  REPORTS_SETUP_CONFIRMATION: CONFIRM[op] + sha,
  ...(op === 'inspect-cleanup'
    ? {}
    : {
        REPORTS_MONITOR_RECEIPT:
          'CHATGPT_REPORTS_ALERT_RECEIVED@' +
          new Date(now - 1000).toISOString(),
      }),
});
function projection(c) {
  const { vars, ...p } = configProjection(c);
  return {
    ...p,
    wrangler_config_hash: 'synthetic',
    env_vars: {
      ...Object.fromEntries(
        Object.entries(vars).map(([k, v]) => [
          k,
          { type: 'plain_text', value: v },
        ]),
      ),
      EXISTING_SECRET: { type: 'secret_text', value: 'DO_NOT_LOG' },
    },
  };
}
function fixture(options = {}) {
  const sql = new DatabaseSync(':memory:');
  sql.exec(schema);
  const counts = sql.prepare(COUNT_SQL).get();
  const project = {
    name: TARGET.pages,
    production_branch: TARGET.branch,
    canonical_deployment: { id: ANCHOR },
    build_config: { build_command: 'pnpm build' },
    deployment_configs: {
      production: projection(base),
      preview: { env_vars: {} },
    },
  };
  const state = { source: BASE, cleanupReady: false, now, counts, ...options };
  const settings = {
    [TARGET.guard]: {
      compatibility_date: '2026-05-22',
      observability: { enabled: false },
      bindings: [
        {
          type: 'durable_object_namespace',
          name: 'GUARD',
          class_name: 'CommunityReportLedger',
          namespace_id: RELEASE.namespaceId,
        },
      ],
    },
    [TARGET.cleanup]: {
      compatibility_date: '2026-05-22',
      observability: { enabled: false },
      bindings: [
        { type: 'd1', name: 'REPORTS_DB', id: RELEASE.databaseId },
        {
          type: 'service',
          name: 'REPORTS_GUARD',
          service: TARGET.guard,
          entrypoint: 'ReportsGuardService',
        },
        ...FLAGS.map((name) => ({ type: 'plain_text', name, text: 'false' })),
        {
          type: 'plain_text',
          name: 'REPORTS_GUARD_INSTANCE',
          text: RELEASE.instanceId,
        },
      ],
    },
  };
  const schedules = { [TARGET.guard]: [], [TARGET.cleanup]: [] },
    calls = [],
    writes = [],
    receipts = [];
  const envelope = (result) =>
    Response.json({ success: true, errors: [], result });
  const fetcher = async (url, init) => {
    calls.push({ url, method: init.method });
    assert.equal(init.redirect, 'error');
    if (url === 'https://gemnao.pages.dev/api/reports/health') {
      assert.equal(init.method, 'GET');
      assert.equal(init.credentials, 'omit');
      assert.ok(!init.headers.Authorization);
      const open =
        project.deployment_configs.production.env_vars.REPORTS_ENABLED.value ===
        'true';
      if (open && state.failOpenHealth) throw Error('synthetic public outage');
      const good = state.cleanupReady;
      return Response.json(
        {
          schemaVersion: 2,
          budgetMode: MODE,
          ok: open && good,
          intakeEnabled: open && good,
          publicEnabled: open && good,
          checkedAt: new Date(state.now).toISOString(),
          observedAt: null,
          validUntil: null,
          cleanupAt: good
            ? new Date(state.now - (state.stale ? 7200001 : 1000)).toISOString()
            : null,
          reason: good
            ? open
              ? null
              : 'intake-disabled'
            : 'cleanup-unavailable',
        },
        {
          status: open && good ? 200 : 503,
          headers: { 'cache-control': 'no-store' },
        },
      );
    }
    const path = new URL(url).pathname.replace(
      '/client/v4/accounts/' + TARGET.account,
      '',
    );
    if (path === '/pages/projects/gemnao') return envelope(project);
    if (path.startsWith('/pages/projects/gemnao/deployments/'))
      return envelope({
        id: project.canonical_deployment.id,
        environment: 'production',
        latest_stage: { name: 'deploy', status: 'success' },
        deployment_trigger: { metadata: { commit_hash: state.source } },
      });
    if (path === '/d1/database/' + RELEASE.databaseId)
      return envelope({
        uuid: state.wrongDb ? 'wrong' : RELEASE.databaseId,
        name: TARGET.database,
      });
    if (path === '/d1/database/' + RELEASE.databaseId + '/query') {
      assert.equal(init.method, 'POST');
      assert.deepEqual(JSON.parse(init.body), { sql: COUNT_SQL, params: [] });
      state.countReads = (state.countReads || 0) + 1;
      const c = { ...state.counts };
      if (state.growAfterFirstRead && state.countReads > 1) c.reports_total = 1;
      return envelope([{ success: true, results: [c] }]);
    }
    const match = path.match(
      /^\/workers\/scripts\/(.+)\/(settings|subdomain|schedules)$/,
    );
    assert.ok(match);
    const [, name, kind] = match;
    if (init.method === 'GET') {
      if (kind === 'settings') return envelope(settings[name]);
      if (kind === 'subdomain')
        return envelope({
          enabled: !!state.publicUrl,
          previews_enabled: false,
        });
      return envelope({ schedules: schedules[name] });
    }
    writes.push({ method: init.method, path });
    if (state.failPath === path) throw Error('DO_NOT_LOG private failure');
    if (kind === 'settings') {
      assert.equal(init.method, 'PATCH');
      const b = JSON.parse(init.body.get('settings'));
      assert.deepEqual(Object.keys(b), ['bindings']);
      settings[name].bindings = b.bindings;
      if (state.afterGuardDrift && name === TARGET.guard)
        settings[TARGET.cleanup].bindings[0].id = 'wrong';
      return envelope(settings[name]);
    }
    assert.equal(kind, 'schedules');
    assert.equal(name, TARGET.cleanup);
    assert.equal(init.method, 'PUT');
    assert.deepEqual(JSON.parse(init.body), [{ cron: CRON }]);
    schedules[name] = JSON.parse(init.body);
    return envelope({ schedules: schedules[name] });
  };
  const uploader = async (config) => {
    writes.push({
      method: 'PAGES',
      open: config.vars.REPORTS_ENABLED === 'true',
    });
    project.deployment_configs.production = projection(config);
    project.canonical_deployment.id = '11111111-1111-4111-8111-111111111111';
    state.source = sha;
  };
  const run = async (op, patch = {}) => {
    const env = { ...environment(op), ...patch },
      receipt = { sourceSha: sha, operation: op, completed: [] };
    receipts.push(receipt);
    await executeLaunch(
      env,
      base,
      (p) => launchClient(token, op, p, fetcher),
      uploader,
      receipt,
      async () => {},
      fetcher,
      () => state.now,
    );
    return receipt;
  };
  return {
    state,
    project,
    settings,
    schedules,
    calls,
    writes,
    receipts,
    run,
    fetcher,
  };
}
await test('fixed source/confirmation, owner receipt within 24h and first-attempt context; monitor job success cannot substitute', () => {
  for (const op of Object.keys(CONFIRM)) launchContext(environment(op), now);
  for (const patch of [
    { REPORTS_MONITOR_RECEIPT: undefined },
    { REPORTS_MONITOR_RECEIPT: 'job-success' },
    {
      REPORTS_MONITOR_RECEIPT:
        'CHATGPT_REPORTS_ALERT_RECEIVED@' + new Date(now + 1).toISOString(),
    },
    {
      REPORTS_MONITOR_RECEIPT:
        'CHATGPT_REPORTS_ALERT_RECEIVED@' +
        new Date(now - 86400001).toISOString(),
    },
    { REPORTS_SETUP_SOURCE_SHA: 'b'.repeat(40) },
    { REPORTS_SETUP_CONFIRMATION: 'START_FREE' },
    { GITHUB_RUN_ATTEMPT: '2' },
  ])
    assert.throws(() =>
      launchContext({ ...environment('start-free'), ...patch }, now),
    );
});
await test('inspection is SELECT-only, bounded counts, no provider usage queries, no guard/check or settings writes', async () => {
  const f = fixture();
  const r = await f.run('inspect-cleanup');
  assert.equal(r.counts.reports_total, 0);
  assert.equal(r.productionChanged, false);
  assert.equal(r.completeGuardAwareDryRun, false);
  assert.equal(f.writes.length, 0);
  assert(!f.calls.some((x) => /graphql|\/check|\/initialize/.test(x.url)));
  assert(!JSON.stringify(r).includes('DO_NOT_LOG'));
});
await test('start stages same bindings with intake OFF, then starts one exact cron; does not fake first cleanup or open intake', async () => {
  const f = fixture();
  const r = await f.run('start-free');
  assert.equal(r.intakeEnabled, false);
  assert.equal(r.cleanupExecutionVerified, false);
  assert.equal(r.cronStarted, true);
  assert.deepEqual(
    f.writes.map((x) => x.method),
    ['PATCH', 'PATCH', 'PAGES', 'PUT'],
  );
  assert.equal(
    f.project.deployment_configs.production.env_vars.REPORTS_ENABLED.value,
    'false',
  );
  assert.equal(
    f.settings[TARGET.guard].bindings[0].namespace_id,
    RELEASE.namespaceId,
  );
  const prior = f.writes.length;
  await f.run('start-free');
  assert.equal(
    f.writes.length,
    prior,
    'already staged exact state does not repeat mutations',
  );
});
await test('actual fresh cleanup required before opening; open does not touch Worker settings or cron', async () => {
  const f = fixture();
  await f.run('start-free');
  const prior = f.writes.length;
  await assert.rejects(f.run('open-free'), /HEALTH_NOT_READY/);
  assert.equal(f.writes.length, prior);
  f.state.cleanupReady = true;
  f.state.stale = true;
  await assert.rejects(f.run('open-free'), /CLEANUP_NOT_FRESH/);
  assert.equal(f.writes.length, prior);
  f.state.stale = false;
  const r = await f.run('open-free');
  assert.equal(r.intakeEnabled, true);
  assert.deepEqual(f.writes.slice(prior), [{ method: 'PAGES', open: true }]);
  const n = f.writes.length;
  await f.run('open-free');
  assert.equal(
    f.writes.length,
    n,
    'already-open receipt is checked without reupload',
  );
});
await test('nonempty tables, stale counts, new rows before write, wrong binding/DB/cron, secret or missing monitor stop safely', async () => {
  for (const mutate of [
    (f) => (f.state.counts.reports_total = 1),
    (f) => (f.state.counts.revisions_total = 1),
    (f) => (f.state.counts.old_rate_rows = 1001),
    (f) => (f.state.counts.checked_at_utc_seconds = 0),
    (f) => (f.state.wrongDb = true),
    (f) => (f.settings[TARGET.guard].bindings[0].namespace_id = 'wrong'),
    (f) =>
      f.settings[TARGET.cleanup].bindings.push({
        type: 'secret_text',
        name: 'NEW',
      }),
    (f) => (f.schedules[TARGET.cleanup] = [{ cron: '* * * * *' }]),
    (f) => (f.state.publicUrl = true),
    (f) => (f.state.growAfterFirstRead = true),
  ]) {
    const f = fixture();
    mutate(f);
    await assert.rejects(f.run('start-free'));
    assert.equal(f.writes.length, 0);
  }
  const f = fixture();
  await assert.rejects(f.run('start-free', { REPORTS_MONITOR_RECEIPT: '' }));
  assert.equal(f.calls.length, 0);
});
await test('uncertain PATCH is not retried; partial failure does not reach cron; drift after first update stops', async () => {
  const f = fixture({
    failPath: '/workers/scripts/' + TARGET.guard + '/settings',
  });
  await assert.rejects(f.run('start-free'), /UNCERTAIN/);
  assert.equal(f.writes.length, 1);
  const g = fixture({ afterGuardDrift: true });
  await assert.rejects(g.run('start-free'));
  assert.equal(g.writes.length, 1);
});
await test('failed post-open health closes Pages again and never reports opening successful', async () => {
  const f = fixture();
  await f.run('start-free');
  f.state.cleanupReady = true;
  f.state.failOpenHealth = true;
  await assert.rejects(f.run('open-free'), /OPEN_CHECK_FAILED_INTAKE_CLOSED/);
  assert.deepEqual(f.writes.slice(-2), [
    { method: 'PAGES', open: true },
    { method: 'PAGES', open: false },
  ]);
  assert.equal(
    f.project.deployment_configs.production.env_vars.REPORTS_ENABLED.value,
    'false',
  );
});
await test('transport rejects arbitrary SQL, mutations in inspect/open, wrong cron, credential APIs and guard data-plane before network', async () => {
  const calls = [];
  const fetcher = async (...a) => {
    calls.push(a);
    throw Error('unexpected');
  };
  for (const op of ['inspect-cleanup', 'start-free', 'open-free']) {
    const api = launchClient(token, op, {}, fetcher);
    for (const [method, path, body] of [
      [
        'POST',
        '/d1/database/' + RELEASE.databaseId + '/query',
        { sql: 'DELETE FROM community_reports', params: [] },
      ],
      ['GET', '/initialize'],
      ['GET', '/check'],
      [
        'PUT',
        '/workers/scripts/' + TARGET.cleanup + '/schedules',
        [{ cron: '* * * * *' }],
      ],
      ['PATCH', '/workers/scripts/' + TARGET.guard + '/settings', {}],
      ['PUT', '/workers/scripts/' + TARGET.cleanup + '/secrets', {}],
    ])
      await assert.rejects(api(method, path, body));
  }
  assert.equal(calls.length, 0);
});
await test('SELECT simulates expiry deletion after withdrawal marking, returns no content and cannot mutate SQLite', () => {
  const d = new DatabaseSync(':memory:');
  d.exec(schema);
  for (let i = 0; i < 4; i++)
    d.prepare(
      "INSERT INTO community_reports VALUES(?,'hash',1,'g','other','{}','pending',NULL,NULL,'req',0,0,0)",
    ).run(String(i));
  for (const [id, w, c] of [
    ['1', null, 9],
    ['2', 3, null],
    ['3', 3, 9],
  ])
    d.prepare('INSERT INTO community_article_refs VALUES(?,?,1,0,?,?)').run(
      id,
      '/synthetic',
      w,
      c,
    );
  const before = d.prepare('SELECT total_changes() AS n').get().n,
    r = d.prepare(COUNT_SQL).get();
  assert.equal(r.expiry_delete_reports, 2);
  assert.equal(r.expiry_retain_reports, 2);
  assert.equal(d.prepare('SELECT total_changes() AS n').get().n, before);
  assert(!Object.keys(r).some((k) => /owner|content|report_id/.test(k)));
});

await test('source pin accepts clean immutable app tree and rejects untracked, dirty and committed runtime changes', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'free-launch-source-'));
  try {
    execFileSync('git', [
      'clone',
      '--quiet',
      '--shared',
      '--no-hardlinks',
      process.cwd(),
      directory,
    ]);
    const git = (...a) =>
      execFileSync('git', a, { cwd: directory, encoding: 'utf8' }).trim();
    const url = pathToFileURL(
      resolve('ops/community-reports/free-launch.mjs'),
    ).href;
    const verify = () => {
      const source = git('rev-parse', 'HEAD');
      execFileSync(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          `import {verifyLaunchSource} from ${JSON.stringify(url)};await verifyLaunchSource(JSON.parse(process.env.FREE_TEST_CONTEXT));`,
        ],
        {
          cwd: directory,
          env: {
            ...process.env,
            FREE_TEST_CONTEXT: JSON.stringify({
              ...environment('inspect-cleanup'),
              GITHUB_SHA: source,
              REPORTS_SETUP_SOURCE_SHA: source,
              REPORTS_SETUP_CONFIRMATION: CONFIRM['inspect-cleanup'] + source,
            }),
          },
          stdio: 'pipe',
        },
      );
    };
    verify();
    await writeFile(join(directory, 'unexpected.txt'), 'synthetic');
    assert.throws(verify);
    await rm(join(directory, 'unexpected.txt'));
    await writeFile(
      join(directory, 'lib/community-reports/admission.ts'),
      '\n// unauthorized runtime edit\n',
      { flag: 'a' },
    );
    assert.throws(verify);
    git(
      '-c',
      'user.name=synthetic',
      '-c',
      'user.email=synthetic@example.invalid',
      'commit',
      '-am',
      'synthetic forbidden runtime edit',
    );
    assert.throws(verify);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
await test('exact partial state can resume without repeating successful guard update', async () => {
  const f = fixture({
    failPath: '/workers/scripts/' + TARGET.cleanup + '/settings',
  });
  await assert.rejects(f.run('start-free'));
  assert.equal(
    f.writes.filter(
      (x) => x.path === '/workers/scripts/' + TARGET.guard + '/settings',
    ).length,
    1,
  );
  f.state.failPath = null;
  await f.run('start-free');
  assert.equal(
    f.writes.filter(
      (x) => x.path === '/workers/scripts/' + TARGET.guard + '/settings',
    ).length,
    1,
  );
  assert.equal(f.schedules[TARGET.cleanup][0].cron, CRON);
});

await test('GitHub scheduled notification attestation retains exact run and rejects absent/invalid/future/stale evidence', () => {
  const prefix = 'GITHUB_SCHEDULE_ALERT_RECEIVED@12345@';
  const receivedAt = new Date(now - 1000).toISOString();
  const receipt = launchContext(
    {
      ...environment('start-free'),
      REPORTS_MONITOR_RECEIPT: prefix + receivedAt,
    },
    now,
  );
  assert.equal(
    receipt.runUrl,
    'https://github.com/poe2-build-navi-jp/gemnao/actions/runs/12345',
  );
  assert.equal(receipt.event, 'schedule');
  assert.equal(receipt.receivedAt, receivedAt);
  assert.equal(receipt.independentlyVerified, false);
  for (const value of [
    'GITHUB_ACTIONS_ALERT_RECEIVED@12345@' + receivedAt,
    'GITHUB_SCHEDULE_ALERT_RECEIVED@0@' + receivedAt,
    'GITHUB_SCHEDULE_ALERT_RECEIVED@../12345@' + receivedAt,
    prefix + new Date(now + 1).toISOString(),
    prefix + new Date(now - 86400001).toISOString(),
    prefix + '2026-02-30T00:00:00.000Z',
    prefix + receivedAt + '\n',
  ])
    assert.throws(() =>
      launchContext(
        { ...environment('start-free'), REPORTS_MONITOR_RECEIPT: value },
        now,
      ),
    );
  assert.throws(() =>
    launchContext(
      {
        ...environment('inspect-cleanup'),
        REPORTS_MONITOR_RECEIPT: prefix + receivedAt,
      },
      now,
    ),
  );
});
