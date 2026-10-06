import './check-d1-connection.mjs';
import assert from 'node:assert/strict';
import {
  readFile,
  readdir,
  mkdtemp,
  mkdir,
  copyFile,
  rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import {
  target,
  history,
  Blocked,
  execute,
  collect,
  verifyMigration,
  applyOnce,
  pagesProjection,
  cloudflareClient,
} from '../ops/d1/control.mjs';
import { gate, validateEnvironment } from '../ops/d1/github-gate.mjs';
const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))(
  'miniflare',
);
const mf = new Miniflare({
  modules: true,
  script: 'export default {fetch(){return new Response("fixture")}}',
  compatibilityDate: '2026-05-15',
  d1Databases: ['DB'],
});
const env = {
  GITHUB_ACTIONS: 'true',
  GITHUB_REPOSITORY: target.repository,
  GITHUB_REF: 'refs/heads/gemunao',
  GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_RUN_ATTEMPT: '1',
  D1_PROTECTED_ENVIRONMENT: target.environment,
  D1_OPERATION: 'preflight',
  CLOUDFLARE_API_TOKEN: 'SYNTHETIC_TOKEN_NOT_A_SECRET',
};
const pages = {
  name: target.project,
  production_branch: target.branch,
  source: { config: { owner: 'poe2-build-navi-jp', repo_name: 'gemnao' } },
  deployment_configs: {
    production: {
      d1_databases: { DB: { id: target.database } },
      env_vars: {
        PRIVATE_SENTINEL: { type: 'secret_text', value: 'PRIVATE_SENTINEL' },
      },
    },
    preview: { d1_databases: {} },
  },
  canonical_deployment: {
    id: 'fixture-production-id',
    environment: 'production',
    latest_stage: { status: 'success' },
    deployment_trigger: {
      metadata: { branch: target.branch, commit_hash: 'a'.repeat(40) },
    },
  },
};
const database = {
  uuid: target.database,
  name: target.databaseName,
  ignoredPrivateField: 'PRIVATE_SENTINEL',
};
const protectedEnvironment = {
  name: target.environment,
  protection_rules: [
    {
      type: 'required_reviewers',
      reviewers: [{ type: 'User', reviewer: { id: 1 } }],
    },
  ],
  deployment_branch_policy: {
    protected_branches: false,
    custom_branch_policies: true,
  },
};
const policies = {
  total_count: 1,
  branch_policies: [{ name: target.branch, type: 'branch' }],
};
const sqls = [
  'PRAGMA table_info(issue_feedback)',
  'PRAGMA table_info(solution_method_feedback)',
  'PRAGMA table_info(step_result_receipts)',
  'PRAGMA index_info(step_result_receipts_requested_at)',
  'PRAGMA table_info(d1_migrations)',
  'SELECT name FROM d1_migrations ORDER BY id',
  "SELECT sql FROM sqlite_master WHERE type='table' AND name='step_result_receipts'",
];
try {
  const db = await mf.getD1Database('DB');
  for (const file of (await readdir('.openai/drizzle'))
    .filter((f) => f.endsWith('.sql'))
    .sort())
    for (const sql of (await readFile('.openai/drizzle/' + file, 'utf8'))
      .split(';')
      .map((s) => s.replace(/--> statement-breakpoint/g, '').trim())
      .filter(Boolean))
      await db.prepare(sql).run();
  await db
    .prepare(
      'CREATE TABLE d1_migrations(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT UNIQUE,applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
    )
    .run();
  for (const name of history)
    await db
      .prepare('INSERT INTO d1_migrations(name) VALUES (?)')
      .bind(name)
      .run();
  await db
    .prepare(
      "INSERT INTO issue_feedback VALUES ('synthetic','launch',7,3,'fixture')",
    )
    .run();
  await db
    .prepare(
      "INSERT INTO solution_method_feedback VALUES ('synthetic','launch','one','Fixture',3,'fixture')",
    )
    .run();
  const snapshot = async () =>
    Object.fromEntries(
      await Promise.all(
        sqls.map(async (sql) => [sql, await db.prepare(sql).all()]),
      ),
    );
  const old = await snapshot();
  const fixedSQL = await readFile(
    'ops/d1/migrations/' + target.migration,
    'utf8',
  );
  await db.batch([
    ...fixedSQL
      .split(';')
      .map((s) => s.replace(/--> statement-breakpoint/g, '').trim())
      .filter(Boolean)
      .map((sql) => db.prepare(sql)),
    db
      .prepare('INSERT INTO d1_migrations(name) VALUES (?)')
      .bind(target.migration),
  ]);
  const ready = await snapshot();
  assert.deepEqual(
    await db
      .prepare(
        "SELECT struggling_count,resolved_count FROM issue_feedback WHERE game_slug='synthetic'",
      )
      .first(),
    { struggling_count: 7, resolved_count: 3 },
  );
  assert.deepEqual(
    await db
      .prepare(
        "SELECT response_count,not_resolved_count FROM solution_method_feedback WHERE context_slug='synthetic'",
      )
      .first(),
    { response_count: 3, not_resolved_count: 0 },
  );
  let state = old,
    applies = 0;
  const calls = [],
    checkpoints = [];
  const api = async (path, sql) => {
    calls.push({ path, sql });
    if (path.endsWith('/pages/projects/' + target.project))
      return structuredClone(pages);
    if (path.endsWith('/time_travel/bookmark'))
      return { bookmark: '00000001-fixture-restore' };
    if (path.endsWith('/d1/database/' + target.database))
      return structuredClone(database);
    assert.ok(path.endsWith('/query'));
    assert.ok(sqls.includes(sql), 'only allowlisted read-only SQL');
    return [structuredClone(state[sql])];
  };
  await verifyMigration();
  const settings = await execute({ ...env, D1_OPERATION: 'settings' }, { api });
  assert.equal(settings.credentialConfigured, true);
  assert.equal(calls.length, 0);
  const before = await execute(env, { api });
  assert.equal(before.state, 'ready_for_0004');
  assert.equal(applies, 0);
  assert.ok(!JSON.stringify(before).includes('PRIVATE_SENTINEL'));
  const applyEnv = {
    ...env,
    D1_OPERATION: 'apply',
    D1_CONFIRMATION: 'APPLY_0004_TO_GEMNAO',
    D1_PREFLIGHT_SHA256: before.preflightSHA256,
  };
  for (const patch of [
    { GITHUB_REF: 'refs/heads/preview' },
    { GITHUB_EVENT_NAME: 'push' },
    { GITHUB_REPOSITORY: 'other/fork' },
    { GITHUB_RUN_ATTEMPT: '2' },
    { D1_CONFIRMATION: 'wrong' },
    { D1_PREFLIGHT_SHA256: 'not a hash' },
    { D1_PROTECTED_ENVIRONMENT: 'preview' },
  ])
    await assert.rejects(
      execute(
        { ...applyEnv, ...patch },
        {
          api,
          apply: async () => {
            applies++;
          },
        },
      ),
      Blocked,
    );
  assert.equal(applies, 0);
  await assert.rejects(
    execute(
      { ...applyEnv, D1_PREFLIGHT_SHA256: '0'.repeat(64) },
      {
        api,
        apply: async () => {
          applies++;
        },
      },
    ),
    /PREFLIGHT_CHANGED/,
  );
  assert.equal(applies, 0);
  const after = await execute(applyEnv, {
    api,
    apply: async () => {
      applies++;
      state = ready;
    },
    checkpoint: async (r) => checkpoints.push(r),
  });
  assert.equal(applies, 1);
  assert.equal(after.result, 'applied_and_read_back');
  assert.equal(checkpoints.length, 1);
  assert.equal(after.restorePoint.bookmark, '00000001-fixture-restore');
  assert.equal(
    (
      await execute(applyEnv, {
        api,
        apply: async () => {
          applies++;
        },
      })
    ).result,
    'already_applied_no_write',
  );
  assert.equal(applies, 1);
  state = old;
  await assert.rejects(
    execute(applyEnv, {
      api,
      apply: async () => {
        throw new Blocked('APPLY_OUTCOME_UNCONFIRMED_RUN_PREFLIGHT');
      },
    }),
    /OUTCOME_UNCONFIRMED/,
  );
  await assert.rejects(
    execute(applyEnv, {
      api,
      apply: async () => {
        applies++;
      },
    }),
    /READBACK_INCOMPLETE/,
  );
  const mutate = async (fn) => {
    const altered = structuredClone(pages);
    fn(altered);
    let dbCalls = 0;
    await assert.rejects(
      collect(async (path, sql) => {
        if (path.includes('/pages/projects/')) return altered;
        dbCalls++;
        return api(path, sql);
      }),
      Blocked,
    );
    assert.equal(dbCalls, 0, 'wrong/preview binding stops before D1');
  };
  await mutate((p) => {
    p.deployment_configs.production.d1_databases.DB.id = 'wrong';
  });
  await mutate((p) => {
    p.deployment_configs.preview.d1_databases.DB = { id: target.database };
  });
  await mutate((p) => {
    p.source.config.owner = 'other';
  });
  await mutate((p) => {
    p.canonical_deployment.environment = 'preview';
  });
  await mutate((p) => {
    p.canonical_deployment.latest_stage.status = 'failure';
  });
  const badSnapshot = async (fn) => {
    state = structuredClone(old);
    fn(state);
    await assert.rejects(collect(api), Blocked);
    state = old;
  };
  await badSnapshot((s) => {
    s['PRAGMA table_info(d1_migrations)'].results = [];
  });
  await badSnapshot((s) => {
    s['SELECT name FROM d1_migrations ORDER BY id'].results.push({
      name: '9999_unreviewed.sql',
    });
  });
  await badSnapshot((s) => {
    s['PRAGMA table_info(step_result_receipts)'] =
      ready['PRAGMA table_info(step_result_receipts)'];
  });
  await badSnapshot((s) => {
    s['PRAGMA table_info(solution_method_feedback)'].results[0].type = 'BLOB';
  });
  // One blocked preflight reports all fixed metadata without disclosing any
  // arbitrary names, SQL defaults, provider values, or granting apply approval.
  state = structuredClone(old);
  state['SELECT name FROM d1_migrations ORDER BY id'].results = [
    { name: history[0] }, { name: history[0] }, { name: 'PRIVATE_SENTINEL_UNKNOWN_NAME' },
  ];
  state['PRAGMA table_info(solution_method_feedback)'].results[0].type = 'PRIVATE_SENTINEL_TYPE';
  state['PRAGMA table_info(solution_method_feedback)'].results.push({ name: 'PRIVATE_SENTINEL_COLUMN', type: 'TEXT' });
  state["SELECT sql FROM sqlite_master WHERE type='table' AND name='step_result_receipts'"].results = [{ sql: 'PRIVATE_SENTINEL_SQL' }];
  let diagnosticError;
  await assert.rejects(execute(env, { api }), (error) => {
    diagnosticError = error;
    return error.code === 'MIGRATION_HISTORY_MISMATCH';
  });
  const diagnostic = diagnosticError.diagnostic;
  assert.equal(diagnostic.applyAllowed, false);
  assert.equal(diagnostic.history.expected[0].count, 2);
  assert.equal(diagnostic.history.expected[1].count, 0);
  assert.equal(diagnostic.history.unknownCount, 1);
  assert.equal(diagnostic.history.duplicateCount, 1);
  assert.match(diagnostic.history.unknownFingerprints[0], /^[a-f0-9]{64}$/);
  assert.equal(diagnostic.schema.methodLegacy.matches, false);
  assert.equal(diagnostic.schema.methodLegacy.unexpectedCount, 1);
  assert.equal(diagnostic.schema.receiptChecks.definitionPresent, true);
  assert.equal(diagnostic.schema.receiptChecks.outcome, false);
  assert.ok(!JSON.stringify(diagnostic).includes('PRIVATE_SENTINEL'));
  assert.ok(!JSON.stringify(diagnostic).includes('preflightSHA256'));
  let forbiddenApply = 0;
  await assert.rejects(execute(applyEnv, { api, apply: async () => { forbiddenApply++; } }), /MIGRATION_HISTORY_MISMATCH/);
  assert.equal(forbiddenApply, 0);
  state['PRAGMA table_info(d1_migrations)'].results = [];
  await assert.rejects(execute(env, { api }), (error) => {
    assert.equal(error.diagnostic.history.readable, false);
    assert.equal(error.diagnostic.schema.registry.present, false);
    assert.equal(error.diagnostic.schema.methodLegacy.unexpectedCount, 1);
    return error.code === 'MIGRATION_REGISTRY_MISSING_OR_UNRECOGNIZED';
  });
  state = old;
  const tmp = await mkdtemp(join(tmpdir(), 'd1-control-fixture-'));
  try {
    await mkdir(join(tmp, 'ops/d1/migrations'), { recursive: true });
    await copyFile(
      'ops/d1/migrations/' + target.migration,
      join(tmp, 'ops/d1/migrations', target.migration),
    );
    await verifyMigration(tmp);
    await copyFile(
      'ops/d1/migrations/' + target.migration,
      join(tmp, 'ops/d1/migrations', '9999.sql'),
    );
    await assert.rejects(verifyMigration(tmp), /UNEXPECTED_MIGRATION_FILE/);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
  let spawnCalls = 0;
  await applyOnce(
    'SYNTHETIC_TOKEN_NOT_A_SECRET',
    process.cwd(),
    (binary, args, options) => {
      spawnCalls++;
      assert.ok(args.includes('--remote'));
      assert.ok(!args.includes('deploy'));
      assert.equal(options.stdio[1], 'pipe');
      assert.equal(options.env.CLOUDFLARE_ACCOUNT_ID, target.account);
      assert.equal(
        options.env.CLOUDFLARE_API_TOKEN,
        'SYNTHETIC_TOKEN_NOT_A_SECRET',
      );
      assert.equal(options.env.WRANGLER_WRITE_LOGS, 'false');
      return { status: 0 };
    },
  );
  assert.equal(spawnCalls, 1);
  await assert.rejects(
    applyOnce('SYNTHETIC_TOKEN_NOT_A_SECRET', process.cwd(), () => ({
      status: 1,
      stderr: Buffer.from('PRIVATE_SENTINEL'),
    })),
    (e) => e.message === 'APPLY_OUTCOME_UNCONFIRMED_RUN_PREFLIGHT',
  );
  validateEnvironment(protectedEnvironment, policies);
  for (const [e, p] of [
    [{ ...protectedEnvironment, protection_rules: [] }, policies],
    [
      protectedEnvironment,
      {
        total_count: 2,
        branch_policies: [
          ...policies.branch_policies,
          { name: '*', type: 'branch' },
        ],
      },
    ],
    [
      protectedEnvironment,
      {
        total_count: 1,
        branch_policies: [{ name: target.branch, type: 'tag' }],
      },
    ],
  ])
    assert.throws(() => validateEnvironment(e, p), Blocked);
  const gateEnvironment = await gate(
    { ...env, GH_TOKEN: 'SYNTHETIC_GITHUB_TOKEN' },
    async (url) =>
      Response.json(
        url.includes('/deployment-branch-policies')
          ? policies
          : protectedEnvironment,
      ),
  );
  assert.equal(gateEnvironment, target.environment);
  await assert.rejects(
    gate(env, async () =>
      Response.json({ message: 'PRIVATE_SENTINEL' }, { status: 404 }),
    ),
    /ENVIRONMENT_MISSING_SETUP_REQUIRED/,
  );
  const apiClient = cloudflareClient(
    'SYNTHETIC_TOKEN_NOT_A_SECRET',
    async (url, options) => {
      assert.ok(
        url.startsWith(
          'https://api.cloudflare.com/client/v4/accounts/' + target.account,
        ),
      );
      assert.equal(options.redirect, 'error');
      return Response.json({
        success: false,
        errors: [{ message: 'PRIVATE_SENTINEL' }],
      });
    },
  );
  await assert.rejects(
    apiClient(`/accounts/${target.account}/pages/projects/gemnao`),
    (e) => e.message === 'CLOUDFLARE_OPERATION_FAILED',
  );
  assert.ok(
    !JSON.stringify(pagesProjection(pages)).includes('PRIVATE_SENTINEL'),
  );
  const yaml = await readFile('.github/workflows/d1-control.yml', 'utf8');
  assert.ok(yaml.includes('workflow_dispatch:'));
  assert.ok(!/^\s+(push|pull_request|schedule):/m.test(yaml));
  assert.ok(yaml.includes('cancel-in-progress: false'));
  assert.ok(yaml.includes('persist-credentials: false'));
  assert.ok(yaml.includes('--ignore-pnpmfile'));
  assert.ok(!yaml.includes('permissions: write-all'));
  assert.ok(!yaml.includes('secrets: inherit'));
  console.log(
    'PASS: isolated schema migration preserves counters; metadata-only preflight; current production binding; preview/fork/ref/review gates; fixed hash/history/extra-file rejection; apply once/readback/no blind rerun; restore metadata; secret projection/error sanitization; fixed official Wrangler invocation. No real network, secrets or production data.',
  );
} finally {
  await mf.dispose();
}
