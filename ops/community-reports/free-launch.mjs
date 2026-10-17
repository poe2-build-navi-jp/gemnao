// Initial empty-DB rollout only. Existing protection, no data-plane invocation.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import {
  TARGET,
  FLAGS,
  SetupFailure,
  context,
  jsonResponse,
  packageArtifact,
  verifyArtifact,
} from './closed-setup.mjs';
import {
  RELEASE,
  validateSettings,
  settingsProjection,
} from './code-deploy.mjs';
import {
  normalized,
  managedBaseline,
  productionAnchor,
  verifyManagedDeployment,
} from './managed-config.mjs';
export const BASE = '8f964ad2d63cfaf8059da4128f5120229c23f92f';
export const ANCHOR = '7215d9ee-cfc7-45a2-89cc-a06849a2ca28';
export const MODE = 'free-small-v1',
  CRON = '*/15 * * * *';
export const OPERATIONS = ['inspect-cleanup', 'start-free', 'open-free'];
export const CONFIRM = {
  'inspect-cleanup': 'READ_REPORTS_CLEANUP_COUNTS:',
  'start-free': 'START_FREE_REPORTS_30D_CLEANUP_AND_CRON:',
  'open-free': 'OPEN_FREE_REPORTS_AFTER_VERIFIED_CLEANUP:',
};
export const MONITOR = 'ChatGPT task: ゲムなお投稿受付の異常監視';
export const COUNT_SQL = await readFile(
  new URL('./cleanup-counts.sql', import.meta.url),
  'utf8',
);
const need = (ok, code) => {
  if (!ok) throw new SetupFailure(code);
};
const sortBindings = (b) =>
  normalized(
    b
      .map((x) =>
        Object.fromEntries(
          Object.entries(x).filter(
            ([k]) => k !== 'environment' || x[k] !== 'production',
          ),
        ),
      )
      .sort((a, b) => a.name.localeCompare(b.name)),
  );
export function launchContext(env, now = Date.now()) {
  context(env);
  const op = env.REPORTS_SETUP_OPERATION;
  need(
    OPERATIONS.includes(op) &&
      env.REPORTS_SETUP_SOURCE_SHA === env.GITHUB_SHA &&
      env.REPORTS_SETUP_CONFIRMATION === CONFIRM[op] + env.GITHUB_SHA,
    'LAUNCH_EXACT_CONTEXT_REQUIRED',
  );
  if (op === 'inspect-cleanup') {
    need(!env.REPORTS_MONITOR_RECEIPT, 'INSPECT_NO_MONITOR_ATTESTATION');
    return null;
  }
  const raw = env.REPORTS_MONITOR_RECEIPT || '';
  const chat =
    /^CHATGPT_REPORTS_ALERT_RECEIVED@(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)$/.exec(
      raw,
    );
  const github =
    /^GITHUB_SCHEDULE_ALERT_RECEIVED@([1-9]\d{0,19})@(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)$/.exec(
      raw,
    );
  const receivedAt = chat?.[1] || github?.[2];
  const at = receivedAt ? Date.parse(receivedAt) : NaN;
  need(
    (chat?.[0] === raw || github?.[0] === raw) &&
      Number.isFinite(at) &&
      new Date(at).toISOString() === receivedAt &&
      at <= now &&
      at >= now - 86400000,
    'ACTUAL_OWNER_MONITOR_RECEIPT_REQUIRED',
  );
  // Owner attestation only. Run failure and notification delivery are distinct.
  // GitHub requires receipt from this workflow's scheduled run, not just dispatch.
  return {
    destination: github ? 'GitHub Actions standard notification' : MONITOR,
    receivedAt,
    evidence: github
      ? 'owner-reported-scheduled-run-notification-and-active-workflow'
      : 'owner-reported-receipt-and-active-task',
    ...(github
      ? {
          workflow: '.github/workflows/community-reports-public-health.yml',
          event: 'schedule',
          runUrl: `https://github.com/${TARGET.repository}/actions/runs/${github[1]}`,
        }
      : {}),
    independentlyVerified: false,
  };
}
export async function verifyLaunchSource(env) {
  launchContext(env);
  const git = (...a) => execFileSync('git', a, { encoding: 'utf8' }).trim();
  need(git('rev-parse', 'HEAD') === env.GITHUB_SHA, 'LAUNCH_CHECKOUT_SHA');
  try {
    git('merge-base', '--is-ancestor', BASE, 'HEAD');
  } catch {
    throw new SetupFailure('LAUNCH_BASE_REQUIRED');
  }
  const allowed = [
    '.github/workflows/community-reports-closed-setup.yml',
    'ops/community-reports/closed-setup.mjs',
    'ops/community-reports/free-launch.mjs',
    'ops/community-reports/cleanup-counts.sql',
    'tests/community-reports/free-launch.test.mjs',
    'docs/community-reports-free-launch.md',
    'ops/community-reports/public-health-check.mjs',
    'tests/community-reports/public-health-check.test.mjs',
    'docs/community-reports-github-notifications.md',
  ];
  need(
    git('diff', '--name-only', BASE, 'HEAD')
      .split('\n')
      .filter(Boolean)
      .every((p) => allowed.includes(p)),
    'LAUNCH_SOURCE_OUTSIDE_SCOPE',
  );
  need(
    git('diff', '--name-only', 'HEAD')
      .split('\n')
      .filter(Boolean)
      .every((p) => p === 'dist/client/.gitkeep') &&
      !git('ls-files', '--others', '--exclude-standard'),
    'LAUNCH_DIRTY_SOURCE',
  );
  return JSON.parse(git('show', BASE + ':wrangler.json'));
}
export const packageLaunchArtifact = (dir, sha, env) =>
  packageArtifact(dir, sha, () => verifyLaunchSource(env));
export function launchConfig(base, opened = false) {
  const c = structuredClone(base);
  need(
    FLAGS.every((f) => c.vars?.[f] === 'false') &&
      c.vars.REPORTS_GUARD_INSTANCE === RELEASE.instanceId &&
      !c.vars.REPORTS_BUDGET_MODE,
    'LAUNCH_BASE_CONFIG',
  );
  Object.assign(c.vars, {
    REPORTS_BUDGET_MODE: MODE,
    REPORTS_MONITOR_MODE: 'public-status',
    REPORTS_PUBLIC_MONITOR_VERIFIED: 'true',
  });
  if (opened)
    for (const f of [
      'REPORTS_ENABLED',
      'REPORTS_PUBLIC_ENABLED',
      'REPORTS_REVIEW_ENABLED',
      'REPORTS_BUDGET_VERIFIED',
    ])
      c.vars[f] = 'true';
  return c;
}
export function freeSettings(name, value) {
  const s = structuredClone(value),
    extra =
      name === TARGET.guard
        ? ['REPORTS_BUDGET_MODE']
        : ['REPORTS_BUDGET_MODE', 'REPORTS_MONITOR_MODE'];
  s.bindings = s.bindings.filter((b) => !extra.includes(b.name));
  if (name === TARGET.cleanup)
    for (const b of s.bindings)
      if (b.name === 'REPORTS_PUBLIC_MONITOR_VERIFIED') b.text = 'false';
  validateSettings(name, s);
  const desired = structuredClone(s);
  desired.bindings.push({
    type: 'plain_text',
    name: 'REPORTS_BUDGET_MODE',
    text: MODE,
  });
  if (name === TARGET.cleanup) {
    desired.bindings.push({
      type: 'plain_text',
      name: 'REPORTS_MONITOR_MODE',
      text: 'public-status',
    });
    desired.bindings.find(
      (b) => b.name === 'REPORTS_PUBLIC_MONITOR_VERIFIED',
    ).text = 'true';
  }
  need(
    sortBindings(value.bindings) === sortBindings(s.bindings) ||
      sortBindings(value.bindings) === sortBindings(desired.bindings),
    'LAUNCH_UNEXPECTED_WORKER_MODE',
  );
  return {
    old: s,
    desired,
    ready: sortBindings(value.bindings) === sortBindings(desired.bindings),
  };
}
export function launchClient(token, op, patches = {}, fetcher = fetch) {
  need(
    typeof token === 'string' &&
      /^[\x21-\x7e]{20,256}$/.test(token) &&
      OPERATIONS.includes(op),
    'LAUNCH_AUTH_CONTEXT',
  );
  const sent = new Set();
  let stopped = false;
  return async (method, path, body) => {
    const key = method + ' ' + path;
    if (method === 'GET')
      need(
        body === undefined &&
          (path === '/pages/projects/gemnao' ||
            /^\/pages\/projects\/gemnao\/deployments\/[a-f0-9-]{36}$/.test(
              path,
            ) ||
            path === '/d1/database/' + RELEASE.databaseId ||
            /^\/workers\/scripts\/gemnao-community-reports-(guard|cleanup)\/(settings|subdomain|schedules)$/.test(
              path,
            )),
        'LAUNCH_READ_BOUNDARY',
      );
    else if (
      method === 'POST' &&
      path === '/d1/database/' + RELEASE.databaseId + '/query'
    )
      need(
        !stopped &&
          normalized(body) === normalized({ sql: COUNT_SQL, params: [] }),
        'LAUNCH_ONLY_FIXED_SELECT',
      );
    else {
      need(
        op === 'start-free' && !stopped && !sent.has(key),
        'LAUNCH_MUTATION_FORBIDDEN_OR_RETRY',
      );
      if (method === 'PATCH') {
        need(
          Object.hasOwn(patches, path) &&
            body instanceof FormData &&
            normalized([...body.keys()]) === normalized(['settings']),
          'LAUNCH_PATCH_BOUNDARY',
        );
        need(
          typeof body.get('settings') === 'string' &&
            normalized(JSON.parse(body.get('settings'))) ===
              normalized({ bindings: patches[path] }),
          'LAUNCH_PATCH_CHANGED',
        );
      } else
        need(
          method === 'PUT' &&
            path === '/workers/scripts/' + TARGET.cleanup + '/schedules' &&
            normalized(body) === normalized([{ cron: CRON }]),
          'LAUNCH_CRON_BOUNDARY',
        );
      sent.add(key);
    }
    try {
      const r = await fetcher(
        'https://api.cloudflare.com/client/v4/accounts/' +
          TARGET.account +
          path,
        {
          method,
          redirect: 'error',
          signal: AbortSignal.timeout(30000),
          headers: {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
            ...(body instanceof FormData
              ? {}
              : { 'Content-Type': 'application/json' }),
          },
          ...(body === undefined
            ? {}
            : { body: body instanceof FormData ? body : JSON.stringify(body) }),
        },
      );
      const data = await jsonResponse(r, 'LAUNCH_PROVIDER');
      need(
        data.success === true &&
          Array.isArray(data.errors) &&
          data.errors.length === 0,
        'LAUNCH_PROVIDER_FAILURE',
      );
      return data.result;
    } catch (e) {
      stopped = true;
      if (e instanceof SetupFailure) throw e;
      throw new SetupFailure('LAUNCH_REQUEST_UNCERTAIN');
    }
  };
}
async function snapshot(api, base, sha) {
  const project = await api('GET', '/pages/projects/gemnao');
  need(
    project?.name === TARGET.pages &&
      project.production_branch === TARGET.branch,
    'LAUNCH_PAGES_IDENTITY',
  );
  const anchor = productionAnchor(
    project,
    await api(
      'GET',
      '/pages/projects/gemnao/deployments/' + project.canonical_deployment?.id,
    ),
  );
  let phase = null;
  for (const [label, c] of [
    ['closed', base],
    ['staged', launchConfig(base)],
    ['open', launchConfig(base, true)],
  ])
    try {
      managedBaseline(project, c);
      phase = label;
      break;
    } catch {}
  need(
    phase &&
      (phase === 'closed'
        ? anchor.deploymentId === ANCHOR && anchor.sourceSha === BASE
        : anchor.sourceSha === sha),
    'LAUNCH_PAGES_DRIFT',
  );
  const db = await api('GET', '/d1/database/' + RELEASE.databaseId);
  need(
    db?.uuid === RELEASE.databaseId && db.name === TARGET.database,
    'LAUNCH_DB_IDENTITY',
  );
  const workers = {};
  for (const name of [TARGET.guard, TARGET.cleanup]) {
    const settings = await api('GET', '/workers/scripts/' + name + '/settings');
    const plan = freeSettings(name, settings);
    const url = await api('GET', '/workers/scripts/' + name + '/subdomain');
    const cron = await api('GET', '/workers/scripts/' + name + '/schedules');
    need(
      url?.enabled === false &&
        url.previews_enabled === false &&
        Array.isArray(cron?.schedules),
      'LAUNCH_URL_OR_CRON',
    );
    const schedules = cron.schedules.map((x) => x.cron);
    need(
      schedules.length === 0 ||
        (name === TARGET.cleanup &&
          normalized(schedules) === normalized([CRON])),
      'LAUNCH_UNEXPECTED_CRON',
    );
    workers[name] = { settings, ...plan, scheduled: schedules.length === 1 };
  }
  need(
    !workers[TARGET.cleanup].scheduled ||
      (workers[TARGET.guard].ready &&
        workers[TARGET.cleanup].ready &&
        phase !== 'closed'),
    'LAUNCH_UNSAFE_PARTIAL_STATE',
  );
  return { project, anchor, phase, workers };
}
export async function readCounts(api) {
  const result = await api(
    'POST',
    '/d1/database/' + RELEASE.databaseId + '/query',
    { sql: COUNT_SQL, params: [] },
  );
  need(
    Array.isArray(result) &&
      result.length === 1 &&
      result[0].success === true &&
      result[0].results?.length === 1,
    'LAUNCH_COUNTS_RESPONSE',
  );
  const counts = result[0].results[0];
  const names = [
    'checked_at_utc_seconds',
    'reports_total',
    'revisions_total',
    'audit_total',
    'flags_total',
    'article_refs_total',
    'expired_reports',
    'expiry_delete_reports',
    'expiry_retain_reports',
    'expiry_cascade_revisions',
    'expiry_cascade_audit',
    'expiry_cascade_flags',
    'expiry_cascade_refs',
    'expiry_new_withdrawal_refs',
    'current_pending_withdrawal_refs',
    'stored_deleted_reports',
    'old_rate_rows',
    'last_cleanup_receipt',
  ];
  need(
    normalized(Object.keys(counts).sort()) === normalized(names.sort()) &&
      names
        .filter((n) => n !== 'last_cleanup_receipt')
        .every((n) => Number.isSafeInteger(counts[n]) && counts[n] >= 0),
    'LAUNCH_COUNTS_SCHEMA',
  );
  need(
    counts.last_cleanup_receipt === null ||
      /^\d{1,12}$/.test(String(counts.last_cleanup_receipt)),
    'LAUNCH_RECEIPT_FORMAT',
  );
  return counts;
}
function emptyForInitialStart(counts, now) {
  need(
    Math.abs(counts.checked_at_utc_seconds * 1000 - now) <= 60000,
    'LAUNCH_COUNTS_STALE',
  );
  need(
    [
      'reports_total',
      'revisions_total',
      'audit_total',
      'flags_total',
      'article_refs_total',
    ].every((k) => counts[k] === 0) && counts.old_rate_rows <= 1000,
    'LAUNCH_NONEMPTY_REQUIRES_REVIEW',
  );
}
export async function readyHealth(
  fetcher = fetch,
  opened = false,
  now = Date.now(),
) {
  const r = await fetcher('https://gemnao.pages.dev/api/reports/health', {
    method: 'GET',
    credentials: 'omit',
    redirect: 'error',
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
    headers: { Accept: 'application/json' },
  });
  need(
    r.status === (opened ? 200 : 503) &&
      /no-store/i.test(r.headers.get('cache-control') || ''),
    'LAUNCH_HEALTH_STATUS',
  );
  const text = await r.text();
  need(text.length <= 4096, 'LAUNCH_HEALTH_SIZE');
  const b = JSON.parse(text);
  need(
    b.schemaVersion === 2 &&
      b.budgetMode === MODE &&
      b.observedAt === null &&
      b.validUntil === null &&
      b.ok === opened &&
      b.intakeEnabled === opened &&
      b.publicEnabled === opened &&
      b.reason === (opened ? null : 'intake-disabled'),
    'LAUNCH_HEALTH_NOT_READY',
  );
  const at = Date.parse(b.cleanupAt),
    checked = Date.parse(b.checkedAt);
  need(
    Number.isFinite(at) &&
      at <= now &&
      at >= now - 7200000 &&
      Number.isFinite(checked) &&
      Math.abs(checked - now) <= 60000,
    'LAUNCH_CLEANUP_NOT_FRESH',
  );
  return {
    checkedAt: b.checkedAt,
    cleanupAt: b.cleanupAt,
    schemaVersion: 2,
    budgetMode: MODE,
  };
}
function stable(before, after, exclude) {
  need(
    normalized(before.project.deployment_configs) ===
      normalized(after.project.deployment_configs) &&
      normalized(before.anchor) === normalized(after.anchor) &&
      normalized(before.project.build_config) ===
        normalized(after.project.build_config),
    'LAUNCH_CONCURRENT_PAGES_CHANGE',
  );
  for (const name of [TARGET.guard, TARGET.cleanup]) {
    need(
      normalized(settingsProjection(before.workers[name].settings)) ===
        normalized(settingsProjection(after.workers[name].settings)),
      'LAUNCH_WORKER_SETTINGS_DRIFT',
    );
    if (name !== exclude)
      need(
        sortBindings(before.workers[name].settings.bindings) ===
          sortBindings(after.workers[name].settings.bindings) &&
          before.workers[name].scheduled === after.workers[name].scheduled,
        'LAUNCH_CONCURRENT_WORKER_CHANGE',
      );
  }
}
export async function executeLaunch(
  env,
  base,
  apiFactory,
  uploader,
  receipt,
  persist = async () => {},
  fetcher = fetch,
  now = () => Date.now(),
) {
  const monitor = launchContext(env, now()),
    op = env.REPORTS_SETUP_OPERATION,
    sha = env.GITHUB_SHA;
  let state = await snapshot(apiFactory({}), base, sha);
  Object.assign(receipt, {
    instanceId: RELEASE.instanceId,
    databaseId: RELEASE.databaseId,
    guardNamespaceId: RELEASE.namespaceId,
    monitorReceipt: monitor,
    completed: receipt.completed || [],
    nextWrite: null,
  });
  const counts = await readCounts(apiFactory({}));
  receipt.counts = counts;
  await persist();
  if (op === 'inspect-cleanup') {
    Object.assign(receipt, {
      productionChanged: false,
      intakeEnabled: state.phase === 'open',
      completeGuardAwareDryRun: false,
      phase: state.phase,
    });
    return;
  }
  if (op === 'start-free') {
    need(state.phase !== 'open', 'LAUNCH_ALREADY_OPEN');
    emptyForInitialStart(counts, now());
    const patches = Object.fromEntries(
      [TARGET.guard, TARGET.cleanup].map((n) => [
        '/workers/scripts/' + n + '/settings',
        state.workers[n].desired.bindings,
      ]),
    );
    const api = apiFactory(patches);
    for (const name of [TARGET.guard, TARGET.cleanup])
      if (!state.workers[name].ready) {
        const checked = await snapshot(api, base, sha);
        stable(state, checked);
        emptyForInitialStart(await readCounts(api), now());
        const body = new FormData();
        body.set(
          'settings',
          JSON.stringify({
            bindings: patches['/workers/scripts/' + name + '/settings'],
          }),
        );
        receipt.nextWrite = 'settings:' + name;
        await persist();
        await api('PATCH', '/workers/scripts/' + name + '/settings', body);
        const after = await snapshot(api, base, sha);
        stable(state, after, name);
        need(after.workers[name].ready, 'LAUNCH_MODE_READBACK');
        state = after;
        receipt.completed.push('settings:' + name);
        receipt.nextWrite = null;
        await persist();
      }
    if (state.phase === 'closed') {
      const checked = await snapshot(api, base, sha);
      stable(state, checked);
      emptyForInitialStart(await readCounts(api), now());
      receipt.nextWrite = 'pages-free-closed';
      await persist();
      await uploader(launchConfig(base));
      const after = await snapshot(api, base, sha);
      verifyManagedDeployment(
        state.project,
        after.project,
        launchConfig(base),
        TARGET,
      );
      need(after.phase === 'staged', 'LAUNCH_STAGED_READBACK');
      state = after;
      receipt.completed.push('pages-free-closed');
      receipt.nextWrite = null;
      await persist();
    }
    if (!state.workers[TARGET.cleanup].scheduled) {
      const checked = await snapshot(api, base, sha);
      stable(state, checked);
      emptyForInitialStart(await readCounts(api), now());
      receipt.nextWrite = 'start-cron-including-first-cleanup';
      await persist();
      await api('PUT', '/workers/scripts/' + TARGET.cleanup + '/schedules', [
        { cron: CRON },
      ]);
      const after = await snapshot(api, base, sha);
      stable(state, after, TARGET.cleanup);
      need(after.workers[TARGET.cleanup].scheduled, 'LAUNCH_CRON_READBACK');
      state = after;
      receipt.completed.push('cron-started');
      receipt.nextWrite = null;
    }
    Object.assign(receipt, {
      intakeEnabled: false,
      cronStarted: true,
      cleanupExecutionVerified: false,
      phase: state.phase,
      deployment: state.anchor,
      desiredConfigSha256: createHash('sha256')
        .update(normalized(launchConfig(base)))
        .digest('hex'),
    });
    await persist();
    return;
  }
  need(
    state.phase === 'staged' || state.phase === 'open',
    'LAUNCH_STAGED_REQUIRED',
  );
  need(
    state.workers[TARGET.guard].ready &&
      state.workers[TARGET.cleanup].ready &&
      state.workers[TARGET.cleanup].scheduled,
    'LAUNCH_RUNTIME_REQUIRED',
  );
  const api = apiFactory({});
  receipt.health = await readyHealth(fetcher, state.phase === 'open', now());
  const checked = await snapshot(api, base, sha);
  stable(state, checked);
  if (state.phase === 'staged') {
    await readyHealth(fetcher, false, now());
    receipt.nextWrite = 'pages-open';
    await persist();
    await uploader(launchConfig(base, true));
    const after = await snapshot(api, base, sha);
    verifyManagedDeployment(
      state.project,
      after.project,
      launchConfig(base, true),
      TARGET,
    );
    need(after.phase === 'open', 'LAUNCH_OPEN_READBACK');
    for (const n of [TARGET.guard, TARGET.cleanup])
      need(
        sortBindings(after.workers[n].settings.bindings) ===
          sortBindings(state.workers[n].settings.bindings) &&
          after.workers[n].scheduled === state.workers[n].scheduled,
        'LAUNCH_WORKER_DRIFT_AFTER_PAGES',
      );
    state = after;
    receipt.completed.push('pages-open');
    receipt.nextWrite = null;
  }
  try {
    receipt.health = await readyHealth(fetcher, true, now());
  } catch {
    receipt.nextWrite = 'fail-safe-pages-closed';
    await persist();
    try {
      await uploader(launchConfig(base));
      const closed = await snapshot(api, base, sha);
      need(closed.phase === 'staged', 'LAUNCH_CLOSE_READBACK');
      receipt.completed.push('fail-safe-pages-closed');
      receipt.nextWrite = null;
      receipt.intakeEnabled = false;
      await persist();
    } catch {
      throw new SetupFailure('LAUNCH_OPEN_CHECK_FAILED_STATE_UNCERTAIN');
    }
    throw new SetupFailure('LAUNCH_OPEN_CHECK_FAILED_INTAKE_CLOSED');
  }
  Object.assign(receipt, {
    phase: 'open',
    intakeEnabled: true,
    deployment: state.anchor,
    desiredConfigSha256: createHash('sha256')
      .update(normalized(launchConfig(base, true)))
      .digest('hex'),
  });
  await persist();
}
export async function runLaunch(
  env,
  receipt,
  uploader,
  persist,
  fetcher = fetch,
) {
  const base = await verifyLaunchSource(env);
  if (env.REPORTS_SETUP_OPERATION !== 'inspect-cleanup')
    await verifyArtifact(
      env.REPORTS_ARTIFACT_DIR,
      env.REPORTS_ARTIFACT_DIGEST,
      env.GITHUB_SHA,
    );
  await executeLaunch(
    env,
    base,
    (p) =>
      launchClient(
        env.CLOUDFLARE_API_TOKEN,
        env.REPORTS_SETUP_OPERATION,
        p,
        fetcher,
      ),
    uploader,
    receipt,
    persist,
    fetcher,
  );
}
