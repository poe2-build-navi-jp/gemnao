import { pathToFileURL } from 'node:url';
import { REVIEWED_TARGETS } from './reviewed-targets.mjs';

const SERVICES = ['feedback', 'sharing'];
const PATHS = {
  feedback: '/api/diagnostic-feedback',
  sharing: '/api/diagnosis/config',
};
const MAX_BYTES = 2048;
const TIMEOUT_MS = 15000;
const result = (service, state, code) => ({ service, state, code });
const failed = (service, code) => result(service, 'failed', code);
const record = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const exactKeys = (value, keys) =>
  record(value) &&
  Object.keys(value).length === keys.length &&
  keys.every((key) => Object.hasOwn(value, key));

function validTarget(name, target) {
  if (
    !['preview', 'production'].includes(name) ||
    !exactKeys(target, ['feedback', 'sharing'])
  )
    return false;
  let origin;
  for (const service of SERVICES) {
    const check = target[service];
    if (
      !exactKeys(check, ['url', 'expected']) ||
      typeof check.url !== 'string' ||
      !(
        service === 'feedback'
          ? ['enabled', 'disabled']
          : ['enabled', 'disabled', 'local-only']
      ).includes(check.expected)
    )
      return false;
    let url;
    try {
      url = new URL(check.url);
    } catch {
      return false;
    }
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.port ||
      url.search ||
      url.hash ||
      url.pathname !== PATHS[service] ||
      url.href !== check.url
    )
      return false;
    if (
      name === 'production'
        ? url.hostname !== 'gemnao.pages.dev'
        : !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.gemnao\.pages\.dev$/.test(
            url.hostname,
          )
    )
      return false;
    if (origin && origin !== url.origin) return false;
    origin = url.origin;
  }
  return true;
}

async function readJson(response) {
  if (
    response.headers.get('content-type')?.toLowerCase().split(';')[0].trim() !==
      'application/json' ||
    !response.headers
      .get('cache-control')
      ?.split(',')
      .some((part) => part.trim().toLowerCase() === 'no-store') ||
    !response.body
  ) {
    await response.body?.cancel().catch(() => {});
    throw new Error('response');
  }
  const reader = response.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BYTES) throw new Error('response');
      chunks.push(value);
    }
  } finally {
    // Cancellation also bounds a malformed/oversized streaming response.
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

function evaluate(name, service, expected, value) {
  if (service === 'feedback') {
    if (
      !exactKeys(value, ['enabled', 'canDelete']) ||
      typeof value.enabled !== 'boolean' ||
      typeof value.canDelete !== 'boolean' ||
      (value.enabled && !value.canDelete)
    )
      return failed(service, 'response_invalid');
    if (expected === 'disabled')
      return value.enabled
        ? failed(service, 'unexpectedly_enabled')
        : result(service, 'paused', 'intentionally_disabled');
    return value.enabled
      ? result(service, 'ready', 'capability_ready')
      : failed(service, 'capability_not_ready');
  }
  const keys = ['enabled', 'sharing', 'metrics'];
  if (record(value) && Object.hasOwn(value, 'localOnly'))
    keys.push('localOnly');
  if (record(value) && Object.hasOwn(value, 'previewSharing'))
    keys.push('previewSharing');
  if (
    !exactKeys(value, keys) ||
    keys.some((key) => typeof value[key] !== 'boolean') ||
    ((!value.enabled || value.localOnly) && (value.sharing || value.metrics))
  )
    return failed(service, 'response_invalid');
  // Metrics intake is not in scope for this monitor or its activation review.
  if (value.metrics) return failed(service, 'unexpected_metrics_enabled');
  if (name === 'production' && value.previewSharing)
    return failed(service, 'unexpected_preview_mode');
  if (value.previewSharing && (value.localOnly !== false || !value.enabled))
    return failed(service, 'response_invalid');
  if (expected === 'enabled')
    return value.enabled && value.sharing && !value.localOnly
      ? result(service, 'ready', 'capability_ready')
      : failed(service, 'capability_not_ready');
  if (value.sharing) return failed(service, 'unexpectedly_enabled');
  if (expected === 'local-only' && (!value.enabled || !value.localOnly))
    return failed(service, 'expected_local_only');
  return result(service, 'paused', 'intentionally_disabled');
}

async function check(name, service, target, fetchImpl) {
  // No credentials, cookies, query parameters, user input, bodies or CF API calls.
  // A native timeout also covers response-body streaming in the real fetch path.
  try {
    const response = await fetchImpl(target.url, {
      method: 'GET',
      redirect: 'error',
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
    });
    if (response.status !== 200 || response.redirected) {
      await response.body?.cancel().catch(() => {});
      return failed(service, 'http_unavailable');
    }
    let value;
    try {
      value = await readJson(response);
    } catch {
      return failed(service, 'response_invalid');
    }
    return evaluate(name, service, target.expected, value);
  } catch {
    // Do not print an exception: it can include URLs, IPs or response content.
    return failed(service, 'request_failed');
  }
}

// Injection is for isolated tests only. CLI configuration is always the fixed,
// committed allowlist above; neither argv nor env may supply endpoints or modes.
export async function monitor(
  name,
  { targets = REVIEWED_TARGETS, fetchImpl = globalThis.fetch } = {},
) {
  if (!Object.hasOwn(targets, name) || !validTarget(name, targets[name])) {
    return {
      ok: false,
      checks: [failed('configuration', 'target_not_reviewed')],
    };
  }
  const checks = await Promise.all(
    SERVICES.map((service) =>
      check(name, service, targets[name][service], fetchImpl),
    ),
  );
  return { ok: checks.every((entry) => entry.state !== 'failed'), checks };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  // A fixed JSON summary is the only output. No bodies, raw errors, URLs or IDs.
  const summary = await monitor(
    process.argv.length === 3 ? process.argv[2] : '',
  );
  console.log(JSON.stringify(summary));
  process.exitCode = summary.ok ? 0 : 1;
}
