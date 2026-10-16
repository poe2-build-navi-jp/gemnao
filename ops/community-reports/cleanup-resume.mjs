// Candidate only. Two permitted writes: create the absent cleanup, disable its
// URLs. D1, guard, Pages, schedules, credentials and protections are read-only.
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, lstat } from 'node:fs/promises';
import { join } from 'node:path';
import {
  client,
  readbackPartial,
  TARGET,
  PARTIAL_SETUP,
  FLAGS,
  SetupFailure,
  verifySource,
} from './closed-setup.mjs';
import { normalized, validateRecord } from './managed-config.mjs';

export const RESUME = Object.freeze({
  readbackRunId: '38916688046',
  readbackSourceSha: '776a8a216fa3ab922817dc57d6a8b15daefb2738',
  databaseId: PARTIAL_SETUP.databaseId,
  guardNamespaceId: '54f03069afc249779996d92530e835e1',
  recovery: Object.freeze({
    deploymentId: 'b75715f4-d6ec-4c8b-9569-68ad98d7cabb',
    sourceSha: '603b31de1a286880931fa8bf796aefb4533acde1',
    productionConfigSha256:
      'ad3f6dbe2868417e842b3633d159325a8b01117f369d02de6fb5244540531195',
  }),
});
const hash = (value) => createHash('sha256').update(value).digest('hex');
const requireValue = (value, code) => {
  if (!value) throw new SetupFailure(code);
};
export const cleanupMetadata = () => ({
  main_module: 'worker.mjs',
  compatibility_date: '2026-05-22',
  bindings: [
    { type: 'd1', name: 'REPORTS_DB', id: RESUME.databaseId },
    {
      type: 'service',
      name: 'REPORTS_GUARD',
      service: TARGET.guard,
      entrypoint: 'ReportsGuardService',
    },
    ...FLAGS.map((name) => ({ type: 'plain_text', name, text: 'false' })),
  ],
  observability: { enabled: false },
});

export async function packageCleanupArtifact(directory, sourceSha) {
  await verifySource();
  requireValue(
    /^[a-f0-9]{40}$/.test(sourceSha || ''),
    'CLEANUP_ARTIFACT_SOURCE_REQUIRED',
  );
  await mkdir(directory, { recursive: true });
  requireValue(
    (await readdir(directory)).length === 0,
    'CLEANUP_ARTIFACT_DIRECTORY_NOT_EMPTY',
  );
  const { build } = await import('esbuild');
  await build({
    entryPoints: ['cloudflare/community-reports-cleanup.ts'],
    outfile: join(directory, 'cleanup.mjs'),
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    external: ['cloudflare:workers'],
  });
  const manifest = JSON.stringify({
    sourceSha,
    scopeBase: TARGET.scopeBase,
    readbackRunId: RESUME.readbackRunId,
    metadata: cleanupMetadata(),
    codeSha256: hash(await readFile(join(directory, 'cleanup.mjs'))),
  });
  await writeFile(join(directory, 'manifest.json'), manifest);
  return hash(manifest);
}

export async function verifyCleanupArtifact(directory, digest, sourceSha) {
  requireValue(
    normalized((await readdir(directory)).sort()) ===
      normalized(['cleanup.mjs', 'manifest.json']),
    'CLEANUP_ARTIFACT_FILE_SET',
  );
  for (const name of ['cleanup.mjs', 'manifest.json']) {
    const info = await lstat(join(directory, name));
    requireValue(
      info.isFile() && !info.isSymbolicLink() && info.size <= 2_000_000,
      'CLEANUP_ARTIFACT_FILE_TYPE_OR_SIZE',
    );
  }
  const text = await readFile(join(directory, 'manifest.json'), 'utf8');
  requireValue(
    /^[a-f0-9]{64}$/.test(digest || '') && hash(text) === digest,
    'CLEANUP_ARTIFACT_DIGEST',
  );
  const manifest = JSON.parse(text);
  requireValue(
    normalized(Object.keys(manifest).sort()) ===
      normalized(
        [
          'sourceSha',
          'scopeBase',
          'readbackRunId',
          'metadata',
          'codeSha256',
        ].sort(),
      ) &&
      /^[a-f0-9]{40}$/.test(sourceSha || '') &&
      manifest.sourceSha === sourceSha &&
      manifest.scopeBase === TARGET.scopeBase &&
      manifest.readbackRunId === RESUME.readbackRunId &&
      normalized(manifest.metadata) === normalized(cleanupMetadata()),
    'CLEANUP_ARTIFACT_IDENTITY',
  );
  const bytes = await readFile(join(directory, 'cleanup.mjs'));
  requireValue(hash(bytes) === manifest.codeSha256, 'CLEANUP_ARTIFACT_BYTES');
  return { bytes, codeSha256: manifest.codeSha256 };
}

export function cleanupClient(token, codeSha256, fetcher = fetch) {
  requireValue(
    /^[a-f0-9]{64}$/.test(codeSha256 || ''),
    'CLEANUP_CODE_HASH_REQUIRED',
  );
  const api = client(
    token,
    (url, options) => {
      const headers = new Headers(options.headers);
      if (options.method === 'PUT') headers.set('If-None-Match', '*');
      return fetcher(url, { ...options, headers });
    },
    RESUME.databaseId,
  );
  let uploadSent = false,
    uploadConfirmed = false,
    disableSent = false,
    stopped = false;
  return async (method, path, body, label) => {
    requireValue(method === 'GET' || !stopped, 'CLEANUP_WRITES_STOPPED');
    if (method === 'GET') {
      requireValue(
        body === undefined &&
          (path === '/d1/database/' + RESUME.databaseId ||
            path === '/workers/scripts' ||
            path === '/pages/projects/gemnao' ||
            /^\/pages\/projects\/gemnao\/deployments\/[a-f0-9-]{36}$/.test(
              path,
            ) ||
            /^\/workers\/scripts\/gemnao-community-reports-(guard|cleanup)\/(settings|subdomain|schedules)$/.test(
              path,
            )),
        'CLEANUP_READ_OUTSIDE_SCOPE',
      );
    } else if (
      method === 'PUT' &&
      path === '/workers/scripts/' + TARGET.cleanup
    ) {
      requireValue(
        !uploadSent &&
          body instanceof FormData &&
          normalized([...body.keys()].sort()) ===
            normalized(['metadata', 'worker.mjs']),
        'CLEANUP_UPLOAD_ONCE_ONLY',
      );
      const metadata = body.get('metadata'),
        code = body.get('worker.mjs');
      requireValue(
        metadata instanceof Blob &&
          code instanceof Blob &&
          code.name === 'worker.mjs' &&
          normalized(JSON.parse(await metadata.text())) ===
            normalized(cleanupMetadata()) &&
          hash(Buffer.from(await code.arrayBuffer())) === codeSha256,
        'CLEANUP_UPLOAD_BYTES_OR_BINDINGS',
      );
      uploadSent = true; // uncertain responses consume this attempt; never retry
    } else if (
      method === 'POST' &&
      path === '/workers/scripts/' + TARGET.cleanup + '/subdomain'
    ) {
      requireValue(
        uploadConfirmed &&
          !disableSent &&
          normalized(body) ===
            normalized({ enabled: false, previews_enabled: false }),
        'CLEANUP_DISABLE_ONCE_ONLY',
      );
      disableSent = true;
    } else throw new SetupFailure('CLEANUP_WRITE_OUTSIDE_SCOPE');
    try {
      const response = await api(method, path, body, label);
      if (method === 'PUT') {
        requireValue(
          response.result?.id === TARGET.cleanup,
          'CLEANUP_UPLOAD_IDENTITY_UNCERTAIN',
        );
        uploadConfirmed = true;
      }
      return response;
    } catch (error) {
      if (method !== 'GET') stopped = true;
      throw error;
    }
  };
}

function requireClosedReadback(result, cleanupExists) {
  const guard = result.workers[TARGET.guard];
  requireValue(
    result.readOnly &&
      result.readbackComplete &&
      result.errors.length === 0 &&
      result.database?.identityMatches &&
      result.database.databaseId === RESUME.databaseId &&
      guard?.exists === true &&
      guard.bindings?.identityMatches === true &&
      guard.bindings.guardNamespaceId === RESUME.guardNamespaceId &&
      guard.publicUrls?.enabled === false &&
      guard.publicUrls.previewsEnabled === false &&
      guard.cron?.empty === true &&
      guard.cron.expressions.length === 0 &&
      result.workers[TARGET.cleanup]?.exists === cleanupExists &&
      result.pages?.intakeClosed === true &&
      result.pages.unchangedClosedConfiguration === true &&
      Object.values(result.pages.flagsOff).every((off) => off === true) &&
      normalized(result.pages.recovery) === normalized(RESUME.recovery),
    'CLEANUP_RESUME_READBACK_DRIFT',
  );
  if (cleanupExists) {
    const cleanup = result.workers[TARGET.cleanup];
    requireValue(
      cleanup.publicUrls?.enabled === false &&
        cleanup.publicUrls.previewsEnabled === false &&
        cleanup.cron?.empty === true &&
        cleanup.cron.expressions.length === 0 &&
        cleanup.bindings?.databaseMatches === true &&
        cleanup.bindings.serviceMatches === true &&
        FLAGS.every((flag) => cleanup.bindings.flagsOff[flag] === true),
      'CLEANUP_READBACK_NOT_CLOSED',
    );
  }
}

export async function resumeCleanup(
  api,
  baseline,
  artifact,
  receipt,
  persist = async () => {},
) {
  const captureReadback = async () => {
    let pages = null;
    const readback = await readbackPartial(async (...args) => {
      const response = await api(...args);
      if (args[1] === '/pages/projects/gemnao') pages = response.result;
      return response;
    }, baseline);
    return { readback, pages };
  };
  // Fresh provider reads are mandatory; historical success is only an identity pin.
  const before = await captureReadback();
  receipt.readbackBefore = before.readback;
  requireClosedReadback(receipt.readbackBefore, false);
  receipt.databaseId = RESUME.databaseId;
  receipt.guardNamespaceId = RESUME.guardNamespaceId;
  receipt.recovery = RESUME.recovery;
  receipt.nextWrite = 'create-only-absent-cleanup';
  await persist();
  // Shared workflow concurrency plus an immediate absence check; never adopt.
  const list = await api(
    'GET',
    '/workers/scripts',
    undefined,
    'CLEANUP_ABSENCE_RECHECK',
  );
  requireValue(
    Array.isArray(list.result) &&
      list.result.length <= 98 &&
      list.result.every((worker) => typeof worker.id === 'string') &&
      !list.result.some((worker) => worker.id === TARGET.cleanup),
    'CLEANUP_ALREADY_EXISTS_OR_UNKNOWN',
  );
  const form = new FormData();
  form.set(
    'metadata',
    new Blob([JSON.stringify(cleanupMetadata())], { type: 'application/json' }),
  );
  form.set(
    'worker.mjs',
    new Blob([artifact.bytes], { type: 'application/javascript+module' }),
    'worker.mjs',
  );
  receipt.completed.push('cleanup-upload-requested');
  await persist();
  const uploaded = await api(
    'PUT',
    '/workers/scripts/' + TARGET.cleanup,
    form,
    'CLEANUP_RESUME_UPLOAD',
  );
  requireValue(
    uploaded.result?.id === TARGET.cleanup,
    'CLEANUP_UPLOAD_IDENTITY_UNCERTAIN',
  );
  receipt.completed.push('cleanup-uploaded');
  receipt.nextWrite = 'disable-cleanup-public-and-preview-urls';
  await persist();
  await api(
    'POST',
    '/workers/scripts/' + TARGET.cleanup + '/subdomain',
    { enabled: false, previews_enabled: false },
    'CLEANUP_RESUME_URL_DISABLE',
  );
  receipt.completed.push('cleanup-url-disable-request-accepted');
  receipt.nextWrite = null;
  await persist();
  const after = await captureReadback();
  receipt.readbackAfter = after.readback;
  requireClosedReadback(receipt.readbackAfter, true);
  // Compare secret descriptors/preview/build only in memory, never in receipts.
  const pageSettings = (project) => ({
    configs: project?.deployment_configs,
    build: project?.build_config,
    canonical: project?.canonical_deployment?.id,
    branch: project?.production_branch,
  });
  requireValue(
    normalized(pageSettings(before.pages)) ===
      normalized(pageSettings(after.pages)),
    'CLEANUP_PAGES_SETTINGS_CHANGED',
  );
  receipt.completed.push('cleanup-closed-readback-verified');
  receipt.pagesChanged = false;
  receipt.intakeEnabled = false;
  receipt.generalReportingUiIncluded = false;
  receipt.resourceRecord = validateRecord(
    {
      version: 1,
      accountId: TARGET.account,
      databaseName: TARGET.database,
      databaseId: RESUME.databaseId,
      guardName: TARGET.guard,
      guardNamespaceId: RESUME.guardNamespaceId,
      cleanupName: TARGET.cleanup,
      provisionedSourceSha: receipt.sourceSha,
      provisionedRunId: receipt.runId,
      recovery: RESUME.recovery,
    },
    TARGET,
  );
  receipt.setupProvenance = {
    originalRunId: PARTIAL_SETUP.runId,
    verifiedReadbackRunId: RESUME.readbackRunId,
  };
  receipt.nextStep =
    'Review completed resourceRecord offline; no Pages deployment or intake activation authorized';
  await persist();
}
