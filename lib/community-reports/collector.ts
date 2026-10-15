import { strictJson } from '../diagnostic-feedback/json';
import {
  usageLimits,
  assessUsage,
} from '../../ops/community-reports/operating-plan.mjs';
import { callGuard, type GuardEnv } from './guard-client';

// Account identity is fixed in the reviewed repository, never supplied by HTTP.
export const REPORTS_ACCOUNT = '6a09a32cba1288cccce5912015086a35';
export type CollectorEnv = GuardEnv & {
  REPORTS_CLOUDFLARE_READ_TOKEN?: string;
  REPORTS_USAGE_PROFILE_JSON?: string;
  REPORTS_USAGE_PROFILE_VERIFIED?: string;
  REPORTS_MONITOR_MODE?: string;
  REPORTS_PUBLIC_MONITOR_VERIFIED?: string;
};
type Metric = {
  dataset: string;
  field: string;
  aggregate: 'sum' | 'max';
  window: 'date' | 'datetime';
  dimension: 'databaseId' | 'namespaceId' | null;
  factor: 1 | 1000;
  freshnessField: string;
};
export type UsageProfile = { version: 1; metrics: Record<string, Metric> };
const keys = Object.keys(usageLimits).filter(
  (k) => k !== 'largestDatabaseBytes',
);
const object = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === 'object' && !Array.isArray(x);
const exact = (x: unknown, names: string[]) =>
  object(x) &&
  Object.keys(x).length === names.length &&
  names.every((k) => Object.hasOwn(x, k));
const integer = (x: unknown): x is number =>
  Number.isSafeInteger(x) && (x as number) >= 0;
export class CollectionFailure extends Error {
  constructor(
    public code:
      | 'configuration'
      | 'provider'
      | 'incomplete'
      | 'limit'
      | 'storage',
  ) {
    super(code);
  }
}
function need(
  x: unknown,
  code: CollectionFailure['code'] = 'incomplete',
): asserts x {
  if (!x) throw new CollectionFailure(code);
}
// No production profile is guessed. Field names and units must first be checked
// against the actual account's introspection/settings and dashboard values.
export function parseUsageProfile(raw: string | undefined): UsageProfile {
  need(raw && raw.length <= 4800, 'configuration');
  let value: unknown;
  try {
    value = strictJson(raw);
  } catch {
    throw new CollectionFailure('configuration');
  }
  need(
    object(value) &&
      exact(value, ['version', 'metrics']) &&
      value.version === 1 &&
      exact(value.metrics, keys),
    'configuration',
  );
  for (const [key, x] of Object.entries(
    value.metrics as Record<string, unknown>,
  )) {
    need(
      exact(x, [
        'dataset',
        'field',
        'aggregate',
        'window',
        'dimension',
        'factor',
        'freshnessField',
      ]),
      'configuration',
    );
    const m = x as unknown as Metric;
    need(
      typeof m.dataset === 'string' &&
        typeof m.field === 'string' &&
        /^[a-z][A-Za-z0-9]{0,63}$/.test(m.field) &&
        typeof m.freshnessField === 'string' &&
        /^[a-z][A-Za-z0-9]{0,63}$/.test(m.freshnessField) &&
        m.freshnessField !== m.field,
      'configuration',
    );
    const d1 = key.startsWith('rows') || key === 'accountStorageBytes';
    need(
      d1
        ? ['d1AnalyticsAdaptiveGroups', 'd1StorageAdaptiveGroups'].includes(
            m.dataset,
          )
        : key === 'workerRequestsToday'
          ? m.dataset === 'workersInvocationsAdaptive'
          : /^durableObjects[A-Z][A-Za-z0-9]{0,60}Groups$/.test(m.dataset),
      'configuration',
    );
    const storage =
      key === 'accountStorageBytes' || key === 'durableObjectStorageBytes';
    need(
      storage
        ? m.aggregate === 'max' &&
            m.dimension === (d1 ? 'databaseId' : 'namespaceId')
        : m.aggregate === 'sum' && m.dimension === null,
      'configuration',
    );
    need(
      ['date', 'datetime'].includes(m.window) && [1, 1000].includes(m.factor),
      'configuration',
    );
    need(
      key === 'durableObjectGbMillisecondsToday' || m.factor === 1,
      'configuration',
    );
  }
  return value as unknown as UsageProfile;
}

// Every request is pinned to Cloudflare's API. No arbitrary URLs, queries,
// redirects, retries, SQL, script downloads, secret APIs or raw errors in logs.
async function jsonRequest(
  fetcher: typeof fetch,
  token: string,
  path: string,
  now: number,
  body?: unknown,
  budget?: AbortSignal,
) {
  const r = await fetcher('https://api.cloudflare.com/client/v4' + path, {
    method: body === undefined ? 'GET' : 'POST',
    redirect: 'error',
    signal: AbortSignal.any([
      AbortSignal.timeout(5000),
      ...(budget ? [budget] : []),
    ]),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  need(r.ok && r.body, 'provider');
  const providerDate = Date.parse(r.headers.get('date') || '');
  need(
    Number.isFinite(providerDate) &&
      Math.abs(providerDate - now * 1000) <= 300_000,
    'provider',
  );
  const reader = r.body.getReader(),
    chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const part = await reader.read();
    if (part.done) break;
    size += part.value.byteLength;
    if (size > 512_000) {
      await reader.cancel();
      throw new CollectionFailure('provider');
    }
    chunks.push(part.value);
  }
  const bytes = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) {
    bytes.set(c, at);
    at += c.length;
  }
  const d = strictJson(new TextDecoder('utf8', { fatal: true }).decode(bytes));
  need(
    object(d) &&
      (d.errors === undefined ||
        d.errors === null ||
        (Array.isArray(d.errors) && d.errors.length === 0)),
    'provider',
  );
  return d;
}
function list(d: Record<string, unknown>, maximum: number, paginated = false) {
  need(
    d.success === true && Array.isArray(d.result) && d.result.length <= maximum,
  );
  if (paginated) {
    need(
      object(d.result_info) &&
        d.result_info.page === 1 &&
        d.result_info.total_count === d.result.length,
    );
  }
  if (object(d.result_info) && Object.hasOwn(d.result_info, 'total_count'))
    need(d.result_info.total_count === d.result.length);
  return d.result as Record<string, unknown>[];
}
function ids(rows: Record<string, unknown>[], field: string, pattern: RegExp) {
  const result = rows.map((r) => {
    need(object(r) && typeof r[field] === 'string' && pattern.test(r[field]));
    return r[field] as string;
  });
  need(new Set(result).size === result.length);
  return result;
}
export function usageQuery(profile: UsageProfile, now: number) {
  const end = new Date(now * 1000).toISOString(),
    day = end.slice(0, 10),
    start = day + 'T00:00:00.000Z';
  const fields = keys.map((key, i) => {
    const m = profile.metrics[key],
      a = m.window === 'date' ? day : start,
      b = m.window === 'date' ? day : end;
    const selection =
      m.aggregate === 'max'
        ? `max{${m.field} ${m.freshnessField}}`
        : `sum{${m.field}} max{${m.freshnessField}}`;
    return `m${i}:${m.dataset}(limit:1000,filter:{${m.window}_geq:${JSON.stringify(a)},${m.window}_leq:${JSON.stringify(b)}}){${selection}${m.dimension ? ` dimensions{${m.dimension}}` : ''}}`;
  });
  return `query CommunityReportsUsage {viewer{accounts(filter:{accountTag:"${REPORTS_ACCOUNT}"}){${fields.join('\n')}}}}`;
}
// Empty metrics are unknown, not zero. Storage must cover every inventoried
// resource; use max per resource and then sum, never a max across the account.
export function parseUsageData(
  d: Record<string, unknown>,
  profile: UsageProfile,
  databaseIds: string[],
  namespaceIds: string[],
  now: number,
) {
  need(
    object(d.data) &&
      object(d.data.viewer) &&
      Array.isArray(d.data.viewer.accounts) &&
      d.data.viewer.accounts.length === 1,
  );
  const account = d.data.viewer.accounts[0];
  need(object(account));
  const values: Record<string, number> = {};
  let oldest = Infinity;
  keys.forEach((key, i) => {
    const m = profile.metrics[key],
      rows = account[`m${i}`];
    need(Array.isArray(rows) && rows.length > 0 && rows.length < 1000);
    const maxima = new Map<string, number>();
    let sum = 0;
    const expected = m.dimension === 'databaseId' ? databaseIds : namespaceIds;
    for (const row of rows) {
      need(object(row) && object(row[m.aggregate]));
      // The verified field must mean the provider's aggregate/data coverage
      // watermark, not HTTP Date, query end or simply the last user request.
      need(object(row.max) && typeof row.max[m.freshnessField] === 'string');
      const stamp = row.max[m.freshnessField] as string,
        through = Date.parse(stamp);
      need(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(stamp) &&
          Number.isFinite(through) &&
          new Date(through).toISOString() ===
            (stamp.endsWith('.000Z') || stamp.includes('.')
              ? stamp
              : stamp.replace('Z', '.000Z')),
      );
      need(through <= now * 1000 && through >= (now - 1800) * 1000);
      oldest = Math.min(oldest, through, (now - 120) * 1000);
      const n = (row[m.aggregate] as Record<string, unknown>)[m.field];
      need(typeof n === 'number' && Number.isFinite(n) && n >= 0);
      const value = Math.ceil(n * m.factor);
      need(integer(value));
      if (m.dimension) {
        need(
          object(row.dimensions) &&
            typeof row.dimensions[m.dimension] === 'string',
        );
        const id = row.dimensions[m.dimension] as string;
        need(expected.includes(id));
        maxima.set(id, Math.max(maxima.get(id) ?? 0, value));
      } else sum += value;
      need(integer(sum));
    }
    if (m.dimension) {
      need(expected.length > 0 && maxima.size === expected.length);
      sum = [...maxima.values()].reduce((a, b) => a + b, 0);
      need(integer(sum));
      if (key === 'accountStorageBytes')
        values.largestDatabaseBytes = Math.max(...maxima.values());
    }
    values[key] = sum;
  });
  need(Number.isFinite(oldest));
  return { values, observedAt: new Date(oldest).toISOString() };
}
export async function readCloudflareUsage(
  env: CollectorEnv,
  now: number,
  fetcher: typeof fetch = fetch,
) {
  need(
    integer(now) &&
      env.REPORTS_USAGE_PROFILE_VERIFIED === 'true' &&
      env.REPORTS_CLOUDFLARE_READ_TOKEN &&
      /^[\x21-\x7e]{20,256}$/.test(env.REPORTS_CLOUDFLARE_READ_TOKEN),
    'configuration',
  );
  const profile = parseUsageProfile(env.REPORTS_USAGE_PROFILE_JSON),
    token = env.REPORTS_CLOUDFLARE_READ_TOKEN;
  const budget = AbortSignal.timeout(25000);
  const read = (path: string, body?: unknown) =>
    jsonRequest(fetcher, token, path, now, body, budget);
  const base = `/accounts/${REPORTS_ACCOUNT}`;
  const dbs = list(
    await read(base + '/d1/database?per_page=100&page=1'),
    10,
    true,
  );
  const workers = list(await read(base + '/workers/scripts'), 24);
  const namespaces = list(
    await read(
      base + '/workers/durable_objects/namespaces?per_page=1000&page=1',
    ),
    999,
    true,
  );
  const databaseIds = ids(
      dbs,
      'uuid',
      /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    ),
    workerIds = ids(workers, 'id', /^[A-Za-z0-9_-]{1,63}$/),
    namespaceIds = ids(namespaces, 'id', /^[a-f0-9]{32}$/);
  need(namespaces.every((n) => n.use_sqlite === true));
  let cronCount = 0;
  for (const name of workerIds) {
    const d = await read(base + `/workers/scripts/${name}/schedules`);
    need(
      d.success === true &&
        object(d.result) &&
        Array.isArray(d.result.schedules),
    );
    cronCount += d.result.schedules.length;
    need(integer(cronCount));
  }
  // Leave two minutes for provider ingestion; never label data as newer merely
  // because an HTTP request finished. At UTC rollover, old-day data closes intake.
  const sampleAt = now - 120;
  const analytics = await read('/graphql', {
    query: usageQuery(profile, sampleAt),
  });
  const data = parseUsageData(
    analytics,
    profile,
    databaseIds,
    namespaceIds,
    now,
  );
  return {
    source: 'cloudflare-graphql',
    observedAt: data.observedAt,
    utcDay: data.observedAt.slice(0, 10),
    phase: 'after-setup',
    ...data.values,
    databaseCount: databaseIds.length,
    workerCount: workerIds.length,
    cronCount,
  };
}
export async function collectReportsUsage(
  env: CollectorEnv,
  now = Math.floor(Date.now() / 1000),
  fetcher: typeof fetch = fetch,
) {
  try {
    need(
      env.REPORTS_AUTO_OBSERVATION_ENABLED === 'true' &&
        env.REPORTS_MONITOR_MODE === 'public-status' &&
        env.REPORTS_PUBLIC_MONITOR_VERIFIED === 'true',
      'configuration',
    );
    const usage = await readCloudflareUsage(env, now, fetcher);
    const stop = assessUsage(usage, now * 1000).stopRecommended;
    await callGuard(env, '/observe', {
      state: JSON.stringify({
        usage,
        monitoringMode: 'public-status',
        restorePolicy: 'no-past-db-restore',
      }),
    });
    await callGuard(env, '/operation', {
      kind: 'collection',
      at: now,
      ok: !stop,
    });
    return { ok: !stop, reason: stop ? 'limit' : null };
  } catch (error) {
    try {
      await callGuard(env, '/observe', { state: '' });
    } catch {
      /* Binding failure itself closes every API. */
    }
    try {
      await callGuard(env, '/operation', {
        kind: 'collection',
        at: now,
        ok: false,
      });
    } catch {
      /* No false success. */
    }
    return {
      ok: false,
      reason: error instanceof CollectionFailure ? error.code : 'provider',
    };
  }
}
