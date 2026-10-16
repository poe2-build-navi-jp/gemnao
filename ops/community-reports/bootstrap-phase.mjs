// Stage 1 only. CI never sends the administrator bootstrap POST and never
// initializes/resets the ledger. Only the existing authenticated browser can.
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  TARGET,
  FLAGS,
  SetupFailure,
  safeFailure,
  client,
  jsonResponse,
} from './closed-setup.mjs';
import {
  normalized,
  validateRecord,
  persistedConfig,
  configProjection,
  managedBaseline,
  productionAnchor,
  verifyManagedDeployment,
} from './managed-config.mjs';

export const PHASE_PATH = 'ops/community-reports/bootstrap-phase-state.json';
export const STAGE1 = Object.freeze({
  databaseId: '3141aae6-8dc9-47e9-a8a2-7a05f642f94f',
  guardNamespaceId: '54f03069afc249779996d92530e835e1',
  deploymentId: '0b826756-057a-4853-94b9-d1dcf9e6002c',
  sourceSha: '085020c9e6115c18886ea49cbcbf84ee22b17687',
});
export const CONFIRMATIONS = Object.freeze({
  'bootstrap-open': 'OPEN_REPORTS_BOOTSTRAP_ONLY',
  'bootstrap-pin': 'PIN_REPORTS_INSTANCE_ONLY',
  'bootstrap-close': 'CLOSE_REPORTS_BOOTSTRAP_ONLY',
});
const UUID =
  /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const SHA = /^[a-f0-9]{40}$/;
const hash = (value) =>
  createHash('sha256')
    .update(typeof value === 'string' ? value : normalized(value))
    .digest('hex');
const requireValue = (ok, code) => {
  if (!ok) throw new SetupFailure(code);
};
const exact = (object, keys) =>
  object &&
  typeof object === 'object' &&
  !Array.isArray(object) &&
  normalized(Object.keys(object).sort((a, b) => a.localeCompare(b))) ===
    normalized([...keys].sort((a, b) => a.localeCompare(b)));
export const configHash = (config) => hash(configProjection(config));
export function checkResourceRecord(record) {
  validateRecord(record, TARGET);
  requireValue(
    record.databaseId === STAGE1.databaseId &&
      record.guardNamespaceId === STAGE1.guardNamespaceId &&
      record.provisionedRunId === '38930349628',
    'BOOTSTRAP_RESOURCE_IDENTITY',
  );
  return record;
}
export function initialPhase(closed, record) {
  checkResourceRecord(record);
  requireValue(
    FLAGS.every((flag) => closed?.vars?.[flag] === 'false') &&
      !Object.hasOwn(closed.vars, 'REPORTS_GUARD_INSTANCE'),
    'BOOTSTRAP_CLOSED_FLAGS_REQUIRED',
  );
  return {
    version: 1,
    phase: 'open',
    resourceHash: hash(record),
    expectedPrevious: {
      deploymentId: STAGE1.deploymentId,
      sourceSha: STAGE1.sourceSha,
      configSha256: configHash(closed),
    },
    instanceId: null,
    openProof: null,
    bootstrapResultSha256: null,
  };
}
function projectedConfig(closed, phase, instanceId) {
  const value = structuredClone(closed);
  value.vars.REPORTS_BOOTSTRAP_ALLOWED = phase === 'open' ? 'true' : 'false';
  if (phase === 'pin') value.vars.REPORTS_GUARD_INSTANCE = instanceId;
  return value;
}
export function validatePhase(state, closed, record) {
  checkResourceRecord(record);
  requireValue(
    exact(state, [
      'version',
      'phase',
      'resourceHash',
      'expectedPrevious',
      'instanceId',
      'openProof',
      'bootstrapResultSha256',
    ]) &&
      state.version === 1 &&
      ['open', 'pin', 'close'].includes(state.phase) &&
      state.resourceHash === hash(record),
    'BOOTSTRAP_PHASE_INVALID',
  );
  const initial = initialPhase(closed, record);
  if (state.phase === 'open') {
    requireValue(
      normalized(state) === normalized(initial),
      'BOOTSTRAP_OPEN_SCOPE_CHANGED',
    );
  } else {
    const proof = state.openProof;
    requireValue(
      exact(proof, [
        'sourceSha',
        'runId',
        'deploymentId',
        'configSha256',
        'phaseHash',
        'resourceHash',
      ]) &&
        SHA.test(proof.sourceSha || '') &&
        /^[1-9][0-9]*$/.test(proof.runId || '') &&
        UUID.test(proof.deploymentId || '') &&
        proof.configSha256 ===
          configHash(projectedConfig(closed, 'open', null)) &&
        proof.phaseHash === hash(initial) &&
        proof.resourceHash === hash(record),
      'BOOTSTRAP_OPEN_PROOF_INVALID',
    );
    requireValue(
      normalized(state.expectedPrevious) ===
        normalized({
          deploymentId: proof.deploymentId,
          sourceSha: proof.sourceSha,
          configSha256: proof.configSha256,
        }),
      'BOOTSTRAP_PREVIOUS_IDENTITY_CHANGED',
    );
    requireValue(
      state.phase === 'pin'
        ? UUID.test(state.instanceId || '') &&
            state.bootstrapResultSha256 ===
              hash({ ok: true, instanceId: state.instanceId })
        : state.instanceId === null && state.bootstrapResultSha256 === null,
      'BOOTSTRAP_INSTANCE_INVALID',
    );
  }
  return state;
}
export function phaseConfig(closed, state, record) {
  validatePhase(state, closed, record);
  return projectedConfig(closed, state.phase, state.instanceId);
}
export async function optionalPhase(directory = '.') {
  try {
    return JSON.parse(await readFile(join(directory, PHASE_PATH), 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}
function openProof(receipt, closed, record) {
  requireValue(
    receipt?.ok === true &&
      receipt.operation === 'bootstrap-open' &&
      receipt.settingsVerified === true &&
      receipt.nextWrite === null &&
      receipt.phaseHash === hash(initialPhase(closed, record)) &&
      receipt.resourceHash === hash(record) &&
      receipt.configSha256 ===
        configHash(projectedConfig(closed, 'open', null)) &&
      SHA.test(receipt.sourceSha || '') &&
      receipt.deployment?.sourceSha === receipt.sourceSha,
    'SUCCESSFUL_OPEN_RECEIPT_REQUIRED',
  );
  return {
    sourceSha: receipt.sourceSha,
    runId: receipt.runId,
    deploymentId: receipt.deployment.deploymentId,
    configSha256: receipt.configSha256,
    phaseHash: receipt.phaseHash,
    resourceHash: receipt.resourceHash,
  };
}
export function nextPhase(
  closed,
  record,
  receipt,
  response,
  closeOnly = false,
) {
  const proof = openProof(receipt, closed, record);
  if (!closeOnly)
    requireValue(
      exact(response, ['ok', 'instanceId']) &&
        response.ok === true &&
        UUID.test(response.instanceId || ''),
      'EXACT_BROWSER_BOOTSTRAP_RESPONSE_REQUIRED',
    );
  const state = {
    version: 1,
    phase: closeOnly ? 'close' : 'pin',
    resourceHash: hash(record),
    expectedPrevious: {
      deploymentId: proof.deploymentId,
      sourceSha: proof.sourceSha,
      configSha256: proof.configSha256,
    },
    instanceId: closeOnly ? null : response.instanceId,
    openProof: proof,
    bootstrapResultSha256: closeOnly ? null : hash(response),
  };
  return validatePhase(state, closed, record);
}
// Offline only. No credential, provider request, UUID generation, reset or data
// mutation. Two source files change; an interrupted pair fails verifySource().
export async function preparePhase(
  directory,
  closed,
  record,
  mode,
  receipt = null,
  response = null,
) {
  requireValue(
    ['open', 'pin', 'close'].includes(mode),
    'BOOTSTRAP_PREPARE_MODE',
  );
  const current = await optionalPhase(directory);
  if (current) validatePhase(current, closed, record);
  const desired =
    mode === 'open'
      ? initialPhase(closed, record)
      : nextPhase(closed, record, receipt, response, mode === 'close');
  if (current?.phase === 'pin') {
    requireValue(
      mode === 'pin' &&
        current.instanceId === desired.instanceId &&
        normalized(current) === normalized(desired),
      'PINNED_INSTANCE_CANNOT_CHANGE_OR_REOPEN',
    );
  } else if (current?.phase === 'close')
    requireValue(
      mode === 'close' && normalized(current) === normalized(desired),
      'CLOSED_PHASE_REQUIRES_NEW_REVIEW',
    );
  else if (mode !== 'open')
    requireValue(current?.phase === 'open', 'REVIEWED_OPEN_PHASE_REQUIRED');
  const rootConfig = JSON.parse(
    await readFile(join(directory, 'wrangler.json'), 'utf8'),
  );
  requireValue(
    normalized(rootConfig) ===
      normalized(current ? phaseConfig(closed, current, record) : closed),
    'BOOTSTRAP_LOCAL_CONFIG_DRIFT',
  );
  if (current && normalized(current) === normalized(desired))
    return { unchanged: true, state: desired };
  await writeFile(
    join(directory, PHASE_PATH),
    JSON.stringify(desired, null, 2) + '\n',
  );
  await writeFile(
    join(directory, 'wrangler.json'),
    JSON.stringify(phaseConfig(closed, desired, record), null, 2) + '\n',
  );
  return { unchanged: false, state: desired };
}
export const cleanupBindings = (instanceId = null) => [
  { type: 'd1', name: 'REPORTS_DB', id: STAGE1.databaseId },
  {
    type: 'service',
    name: 'REPORTS_GUARD',
    service: TARGET.guard,
    entrypoint: 'ReportsGuardService',
  },
  ...FLAGS.map((name) => ({ type: 'plain_text', name, text: 'false' })),
  ...(instanceId
    ? [{ type: 'plain_text', name: 'REPORTS_GUARD_INSTANCE', text: instanceId }]
    : []),
];
function bindingProjection(bindings) {
  requireValue(Array.isArray(bindings), 'BOOTSTRAP_BINDINGS_MISSING');
  const value = bindings.map((b) => {
    if (b.type === 'd1') return { type: b.type, name: b.name, id: b.id };
    if (b.type === 'service') {
      requireValue(
        !b.environment || b.environment === 'production',
        'BOOTSTRAP_SERVICE_ENVIRONMENT',
      );
      return {
        type: b.type,
        name: b.name,
        service: b.service,
        entrypoint: b.entrypoint,
      };
    }
    requireValue(
      b.type === 'plain_text',
      'BOOTSTRAP_UNEXPECTED_BINDING_OR_SECRET',
    );
    return { type: b.type, name: b.name, text: b.text };
  });
  requireValue(
    new Set(value.map((b) => b.name)).size === value.length,
    'BOOTSTRAP_DUPLICATE_BINDING',
  );
  return normalized(value.sort((a, b) => a.name.localeCompare(b.name)));
}
// Adds only a non-secret instance pin. No code upload, URL/cron write, SQL,
// credential API, guard write, admin cookie, or /initialize request is allowed.
export function phaseClient(token, state, record, closed, fetcher = fetch) {
  validatePhase(state, closed, record);
  const get = client(token, fetcher, record.databaseId, true);
  let sent = false,
    stopped = false;
  return async (method, path, body, label) => {
    if (method === 'GET') {
      requireValue(
        body === undefined &&
          (path === '/pages/projects/gemnao' ||
            /^\/pages\/projects\/gemnao\/deployments\/[a-f0-9-]{36}$/.test(
              path,
            ) ||
            path === '/d1/database/' + record.databaseId ||
            /^\/workers\/scripts\/gemnao-community-reports-(guard|cleanup)\/(settings|subdomain|schedules)$/.test(
              path,
            )),
        'BOOTSTRAP_GET_OUTSIDE_SCOPE',
      );
      return get(method, path, body, label);
    }
    requireValue(
      !stopped &&
        !sent &&
        state.phase === 'pin' &&
        method === 'PATCH' &&
        path === '/workers/scripts/' + TARGET.cleanup + '/settings' &&
        body instanceof FormData &&
        normalized([...body.keys()]) === normalized(['settings']),
      'BOOTSTRAP_WRITE_OUTSIDE_SCOPE',
    );
    const raw = body.get('settings');
    requireValue(
      typeof raw === 'string' &&
        raw.length < 8000 &&
        normalized(JSON.parse(raw)) ===
          normalized({ bindings: cleanupBindings(state.instanceId) }),
      'BOOTSTRAP_PIN_PAYLOAD_CHANGED',
    );
    sent = true;
    try {
      const response = await fetcher(
        `https://api.cloudflare.com/client/v4/accounts/${TARGET.account}` +
          path,
        {
          method: 'PATCH',
          body,
          redirect: 'error',
          signal: AbortSignal.timeout(30000),
          headers: {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
          },
        },
      );
      const result = await jsonResponse(response, label);
      requireValue(
        result.success === true &&
          Array.isArray(result.errors) &&
          result.errors.length === 0,
        'BOOTSTRAP_PIN_PROVIDER_FAILURE',
      );
      return result;
    } catch (error) {
      stopped = true;
      if (error instanceof SetupFailure) throw error;
      throw new SetupFailure('BOOTSTRAP_PIN_REQUEST_UNCERTAIN');
    }
  };
}
async function projectRead(api) {
  const project = (
    await api(
      'GET',
      '/pages/projects/gemnao',
      undefined,
      'BOOTSTRAP_PAGES_READ',
    )
  ).result;
  requireValue(
    project?.name === TARGET.pages &&
      project.production_branch === TARGET.branch,
    'BOOTSTRAP_PAGES_IDENTITY',
  );
  const deployment = (
    await api(
      'GET',
      '/pages/projects/gemnao/deployments/' + project.canonical_deployment?.id,
      undefined,
      'BOOTSTRAP_DEPLOYMENT_READ',
    )
  ).result;
  return { project, anchor: productionAnchor(project, deployment) };
}
const settingsProjection = (settings) =>
  Object.fromEntries(
    [
      'compatibility_date',
      'compatibility_flags',
      'usage_model',
      'limits',
      'observability',
      'logpush',
      'tail_consumers',
      'tags',
      'placement',
      'cache_options',
    ]
      .filter((key) => Object.hasOwn(settings, key))
      .map((key) => [key, settings[key]]),
  );
async function resourcesRead(api, record, allowedPin) {
  const d1 = (
    await api(
      'GET',
      '/d1/database/' + record.databaseId,
      undefined,
      'BOOTSTRAP_D1_IDENTITY',
    )
  ).result;
  requireValue(
    d1?.uuid === record.databaseId && d1.name === record.databaseName,
    'BOOTSTRAP_D1_IDENTITY',
  );
  const settings = {};
  for (const name of [TARGET.guard, TARGET.cleanup]) {
    const value = (
      await api(
        'GET',
        '/workers/scripts/' + name + '/settings',
        undefined,
        'BOOTSTRAP_WORKER_SETTINGS',
      )
    ).result;
    const urls = (
      await api(
        'GET',
        '/workers/scripts/' + name + '/subdomain',
        undefined,
        'BOOTSTRAP_WORKER_URLS',
      )
    ).result;
    const cron = (
      await api(
        'GET',
        '/workers/scripts/' + name + '/schedules',
        undefined,
        'BOOTSTRAP_WORKER_CRON',
      )
    ).result;
    requireValue(
      urls?.enabled === false &&
        urls.previews_enabled === false &&
        Array.isArray(cron?.schedules) &&
        cron.schedules.length === 0,
      'BOOTSTRAP_WORKER_NOT_CLOSED',
    );
    if (name === TARGET.guard)
      requireValue(
        Array.isArray(value?.bindings) &&
          value.bindings.length === 1 &&
          value.bindings[0].name === 'GUARD' &&
          value.bindings[0].type === 'durable_object_namespace' &&
          value.bindings[0].class_name === 'CommunityReportLedger' &&
          value.bindings[0].namespace_id === record.guardNamespaceId,
        'BOOTSTRAP_GUARD_IDENTITY',
      );
    else {
      // The provider does not inherit version annotations on settings PATCH.
      // Do not silently erase an operator's message/tag; require another review.
      requireValue(
        !Object.entries(value?.annotations || {}).some(
          ([key, annotation]) =>
            key !== 'workers/triggered_by' &&
            annotation !== '' &&
            annotation != null,
        ),
        'BOOTSTRAP_CLEANUP_ANNOTATIONS_REQUIRE_REVIEW',
      );
      const actual = bindingProjection(value?.bindings);
      requireValue(
        actual === bindingProjection(cleanupBindings(null)) ||
          (allowedPin &&
            actual === bindingProjection(cleanupBindings(allowedPin))),
        'BOOTSTRAP_CLEANUP_PIN_OR_BINDING_CONFLICT',
      );
    }
    settings[name] = value;
  }
  return settings;
}
export async function runBootstrapStage(
  api,
  closed,
  record,
  state,
  receipt,
  uploader,
  persist = async () => {},
) {
  validatePhase(state, closed, record);
  requireValue(
    receipt.operation === 'bootstrap-' + state.phase &&
      SHA.test(receipt.sourceSha || ''),
    'BOOTSTRAP_OPERATION_MISMATCH',
  );
  Object.assign(receipt, {
    databaseId: record.databaseId,
    guardNamespaceId: record.guardNamespaceId,
    instanceId: state.instanceId,
    resourceHash: hash(record),
    phaseHash: hash(state),
    intakeEnabled: false,
    generalReportingUiIncluded: false,
    nextWrite: null,
  });
  const desired = phaseConfig(closed, state, record);
  const before = await projectRead(api);
  const desiredHash = configHash(desired);
  // Only a deployment of this exact reviewed execution SHA can be replayed.
  let alreadyDesired = false;
  try {
    managedBaseline(before.project, desired);
    alreadyDesired = before.anchor.sourceSha === receipt.sourceSha;
  } catch {
    /* Try only the specifically recorded previous configuration below. */
  }
  if (!alreadyDesired) {
    const previous =
      state.phase === 'open' ? closed : projectedConfig(closed, 'open', null);
    const snapshot = managedBaseline(before.project, previous);
    requireValue(
      normalized({
        ...before.anchor,
        configSha256: snapshot.productionConfigSha256,
      }) === normalized(state.expectedPrevious),
      'BOOTSTRAP_RECOVERY_OR_PHASE_DRIFT',
    );
  }
  const resourceBefore = await resourcesRead(
    api,
    record,
    state.phase === 'pin' ? state.instanceId : null,
  );
  const recheck = await projectRead(api);
  requireValue(
    normalized(recheck.project.deployment_configs) ===
      normalized(before.project.deployment_configs) &&
      normalized(recheck.project.build_config) ===
        normalized(before.project.build_config) &&
      normalized(recheck.anchor) === normalized(before.anchor),
    'BOOTSTRAP_CONCURRENT_PAGES_CHANGE',
  );
  receipt.recovery = {
    ...before.anchor,
    productionConfigSha256: configHash(
      alreadyDesired
        ? desired
        : state.phase === 'open'
          ? closed
          : projectedConfig(closed, 'open', null),
    ),
  };
  if (!alreadyDesired) {
    receipt.nextWrite = 'bootstrap-' + state.phase + '-pages-deployment';
    await persist();
    await uploader(desired);
    receipt.completed.push(
      'bootstrap-' + state.phase + '-pages-upload-requested',
    );
    receipt.nextWrite = null;
    await persist();
  }
  const afterPages = await projectRead(api);
  verifyManagedDeployment(before.project, afterPages.project, desired, TARGET);
  requireValue(
    afterPages.anchor.sourceSha === receipt.sourceSha,
    'BOOTSTRAP_DEPLOYED_SOURCE_MISMATCH',
  );
  receipt.deployment = afterPages.anchor;
  receipt.configSha256 = desiredHash;
  receipt.completed.push('bootstrap-' + state.phase + '-pages-verified');
  await persist();
  if (state.phase === 'pin') {
    const beforePin = await resourcesRead(api, record, state.instanceId);
    requireValue(
      normalized(beforePin[TARGET.guard]) ===
        normalized(resourceBefore[TARGET.guard]),
      'BOOTSTRAP_GUARD_SETTINGS_DRIFT',
    );
    const current = beforePin[TARGET.cleanup];
    const projected = bindingProjection(current?.bindings);
    if (projected !== bindingProjection(cleanupBindings(state.instanceId))) {
      requireValue(
        projected === bindingProjection(cleanupBindings(null)),
        'BOOTSTRAP_EXISTING_INSTANCE_CANNOT_CHANGE',
      );
      requireValue(
        normalized(settingsProjection(current)) ===
          normalized(settingsProjection(resourceBefore[TARGET.cleanup])),
        'BOOTSTRAP_CLEANUP_SETTINGS_DRIFT',
      );
      const body = new FormData();
      body.set(
        'settings',
        JSON.stringify({ bindings: cleanupBindings(state.instanceId) }),
      );
      receipt.nextWrite = 'pin-existing-cleanup-instance-only';
      await persist();
      await api(
        'PATCH',
        '/workers/scripts/' + TARGET.cleanup + '/settings',
        body,
        'BOOTSTRAP_CLEANUP_PIN',
      );
      receipt.completed.push('cleanup-instance-pin-request-accepted');
      receipt.nextWrite = null;
      await persist();
    }
  }
  const resourceAfter = await resourcesRead(
    api,
    record,
    state.phase === 'pin' ? state.instanceId : null,
  );
  requireValue(
    normalized(resourceAfter[TARGET.guard]) ===
      normalized(resourceBefore[TARGET.guard]),
    'BOOTSTRAP_GUARD_SETTINGS_CHANGED',
  );
  requireValue(
    normalized(settingsProjection(resourceAfter[TARGET.cleanup])) ===
      normalized(settingsProjection(resourceBefore[TARGET.cleanup])),
    'BOOTSTRAP_CLEANUP_SETTINGS_CHANGED',
  );
  requireValue(
    bindingProjection(resourceAfter[TARGET.cleanup].bindings) ===
      bindingProjection(
        cleanupBindings(state.phase === 'pin' ? state.instanceId : null),
      ),
    'BOOTSTRAP_FINAL_INSTANCE_PIN_MISSING',
  );
  const final = await projectRead(api);
  verifyManagedDeployment(afterPages.project, final.project, desired, TARGET);
  requireValue(
    normalized(final.anchor) === normalized(afterPages.anchor),
    'BOOTSTRAP_FINAL_PAGES_CHANGED',
  );
  receipt.settingsVerified = true;
  receipt.bootstrapAllowed = state.phase === 'open';
  receipt.workerUrlsOff = true;
  receipt.workerCronEmpty = true;
  receipt.initializationExecutedByWorkflow = false;
  receipt.replayedWithoutPagesDeployment = alreadyDesired;
  receipt.completed.push('bootstrap-' + state.phase + '-closed-scope-verified');
  receipt.nextStep =
    state.phase === 'open'
      ? 'Owner existing admin browser: bodyless same-origin POST once; then prepare-pin or prepare-close. No CI cookie/token transfer.'
      : state.phase === 'pin'
        ? 'Bootstrap disabled; same non-secret instance pinned on Pages and cleanup; intake and cron remain OFF.'
        : 'Bootstrap disabled without pin or ledger deletion; inspect any uncertain bootstrap response before a new review.';
  await persist();
}
async function localMain() {
  requireValue(
    !process.env.CLOUDFLARE_API_TOKEN && !process.env.CF_API_TOKEN,
    'BOOTSTRAP_PREPARE_OFFLINE_ONLY',
  );
  const mode = process.argv[2]?.replace('prepare-', '');
  requireValue(
    ['open', 'pin', 'close'].includes(mode),
    'BOOTSTRAP_PREPARE_MODE',
  );
  const record = JSON.parse(
    await readFile('ops/community-reports/closed-binding-state.json', 'utf8'),
  );
  const baseline = JSON.parse(
    execFileSync('git', ['show', TARGET.base + ':wrangler.json'], {
      encoding: 'utf8',
    }),
  );
  const closed = persistedConfig(
    baseline,
    checkResourceRecord(record),
    TARGET,
    FLAGS,
  );
  const receipt =
    mode === 'open'
      ? null
      : JSON.parse(
          await readFile(process.env.REPORTS_BOOTSTRAP_OPEN_RECEIPT, 'utf8'),
        );
  const response =
    mode === 'pin'
      ? JSON.parse(await readFile(process.env.REPORTS_BOOTSTRAP_RESULT, 'utf8'))
      : null;
  const result = await preparePhase(
    '.',
    closed,
    record,
    mode,
    receipt,
    response,
  );
  console.log(
    JSON.stringify({
      prepared: mode,
      unchanged: result.unchanged,
      intakeEnabled: false,
      bootstrapAllowed: mode === 'open',
      instanceId: result.state.instanceId,
    }),
  );
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  localMain().catch((error) => {
    console.error(JSON.stringify(safeFailure(error)));
    process.exitCode = 1;
  });
