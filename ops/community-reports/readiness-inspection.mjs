// One protected, read-only inspection. Never initializes, collects into a guard,
// changes configuration, deletes content, sends alerts or starts cron. Its sole
// SQL statement is a fixed SELECT of counts/operation timestamps in the dedicated DB.
import { discover, target, failureLines } from './preflight.mjs';
import { usageLimits } from './operating-plan.mjs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const api = 'https://api.cloudflare.com/client/v4';
const publicHealth = 'https://gemnao.pages.dev/api/reports/health';
const cleanup = 'gemnao-community-reports-cleanup';
const reportDatabase = Object.freeze({
  id: '3141aae6-8dc9-47e9-a8a2-7a05f642f94f',
  name: 'gemnao-community-reports-production',
});
const countSql = `SELECT
  (SELECT COUNT(*) FROM community_reports) AS report_count,
  (SELECT COUNT(*) FROM community_reports WHERE expires_at<=?) AS expired_count,
  (SELECT COUNT(*) FROM community_rate WHERE at<?) AS old_rate_count,
  (SELECT COUNT(*) FROM community_article_refs WHERE withdrawal_at IS NOT NULL AND completed_at IS NULL) AS withdrawal_count,
  (SELECT value FROM community_operations WHERE key='cleanup') AS cleanup_at,
  (SELECT value FROM community_operations WHERE key='monitor') AS monitor_at`;
const object = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const need = (v) => {
  if (!v) throw Error('READINESS_INSPECTION_FAILED');
};
/** @type {ReadonlyArray<readonly [string, string, 'sum' | 'max', readonly string[], string | null]>} */
const metrics = Object.freeze([
  ['d1', 'd1AnalyticsAdaptiveGroups', 'sum', ['rowsRead', 'rowsWritten'], null],
  [
    'd1Storage',
    'd1StorageAdaptiveGroups',
    'max',
    ['databaseSizeBytes'],
    'databaseId',
  ],
  ['workers', 'workersInvocationsAdaptive', 'sum', ['requests'], null],
  [
    'doRequests',
    'durableObjectsInvocationsAdaptiveGroups',
    'sum',
    ['requests'],
    null,
  ],
  [
    'doPeriodic',
    'durableObjectsPeriodicGroups',
    'sum',
    ['duration', 'rowsRead', 'rowsWritten'],
    null,
  ],
  [
    'doStorage',
    'durableObjectsSqlStorageGroups',
    'max',
    ['storedBytes'],
    'namespaceId',
  ],
]);
async function boundedJson(response, maximum) {
  need(response.body);
  const reader = response.body.getReader(),
    chunks = [];
  let length = 0;
  for (;;) {
    const part = await reader.read();
    if (part.done) break;
    length += part.value.byteLength;
    if (length > maximum) {
      await reader.cancel();
      throw Error('READINESS_INSPECTION_FAILED');
    }
    chunks.push(part.value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder('utf8', { fatal: true }).decode(bytes));
}
export function inspectionQuery(datasets, now) {
  need(Number.isSafeInteger(now));
  const end = new Date(now - 300_000).toISOString();
  const start = new Date(now).toISOString().slice(0, 10) + 'T00:00:00.000Z';
  if (end < start) return null;
  const fields = metrics.map(
    ([alias, dataset, aggregate, names, dimension]) => {
      const schema = datasets[dataset];
      need(schema && names.every((name) => schema[aggregate]?.includes(name)));
      need(
        ['datetime_geq', 'datetime_leq'].every((name) =>
          schema.filter?.includes(name),
        ),
      );
      need(!dimension || schema.dimensions?.includes(dimension));
      return `${alias}:${dataset}(limit:1000,filter:{datetime_geq:${JSON.stringify(start)},datetime_leq:${JSON.stringify(end)}}){${aggregate}{${names.join(' ')}}${dimension ? ` dimensions{${dimension}}` : ''}}`;
    },
  );
  return {
    query: `query CommunityReportsReadinessUsage {viewer{accounts(filter:{accountTag:"${target.account}"}){${fields.join('\n')}}}}`,
    start,
    end,
  };
}
function reportedMetrics(data, inventory) {
  need(
    object(data) &&
      (!data.errors || (Array.isArray(data.errors) && !data.errors.length)),
  );
  const accounts = data.data?.viewer?.accounts;
  need(Array.isArray(accounts) && accounts.length === 1 && object(accounts[0]));
  const account = accounts[0],
    values = {};
  for (const [alias, , aggregate, names, dimension] of metrics) {
    const rows = account[alias];
    // No activity rows are unknown, not an invented zero or completeness proof.
    if (!Array.isArray(rows) || !rows.length || rows.length >= 1000) continue;
    const expected =
      dimension === 'databaseId' ? inventory.databases : inventory.namespaces;
    const covered = new Set();
    let valid = true;
    const perResource = new Map();
    const totals = Object.fromEntries(names.map((name) => [name, 0]));
    for (const row of rows) {
      if (!object(row?.[aggregate])) {
        valid = false;
        break;
      }
      if (dimension) {
        const id = row.dimensions?.[dimension];
        if (!expected.includes(id) || covered.has(id)) {
          valid = false;
          break;
        }
        covered.add(id);
        perResource.set(id, row[aggregate][names[0]]);
      }
      for (const name of names) {
        const value = row[aggregate][name];
        if (
          !Number.isFinite(value) ||
          value < 0 ||
          value > Number.MAX_SAFE_INTEGER
        ) {
          valid = false;
          break;
        }
        totals[name] += value;
        if (
          !Number.isFinite(totals[name]) ||
          totals[name] > Number.MAX_SAFE_INTEGER
        )
          valid = false;
      }
    }
    if (dimension && (!expected.length || covered.size !== expected.length))
      valid = false;
    if (valid)
      values[alias] = {
        ...totals,
        ...(dimension ? { largest: Math.max(...perResource.values()) } : {}),
      };
  }
  const below = (value, limit) =>
    value === undefined ? null : value < limit * 0.8;
  // Account usage values and resource identifiers never enter public CI logs.
  return {
    reportedBelow80Percent: {
      d1RowsRead: below(values.d1?.rowsRead, usageLimits.rowsReadToday),
      d1RowsWritten: below(
        values.d1?.rowsWritten,
        usageLimits.rowsWrittenToday,
      ),
      d1AccountStorage: below(
        values.d1Storage?.databaseSizeBytes,
        usageLimits.accountStorageBytes,
      ),
      d1LargestDatabase: below(
        values.d1Storage?.largest,
        usageLimits.largestDatabaseBytes,
      ),
      workerRequests: below(
        values.workers?.requests,
        usageLimits.workerRequestsToday,
      ),
      durableObjectRequests: below(
        values.doRequests?.requests,
        usageLimits.durableObjectRequestsToday,
      ),
      durableObjectRowsRead: below(
        values.doPeriodic?.rowsRead,
        usageLimits.durableObjectRowsReadToday,
      ),
      durableObjectRowsWritten: below(
        values.doPeriodic?.rowsWritten,
        usageLimits.durableObjectRowsWrittenToday,
      ),
      durableObjectStorage: below(
        values.doStorage?.storedBytes,
        usageLimits.durableObjectStorageBytes,
      ),
    },
    durationValueReturned: values.doPeriodic?.duration !== undefined,
    durationUnitAndBillingVerified: false,
    coverageWatermarkVerified: false,
    usageHeadroomVerified: false,
  };
}
async function inspectHealth(fetcher, now) {
  try {
    const response = await fetcher(publicHealth, {
      method: 'GET',
      redirect: 'error',
      credentials: 'omit',
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
      headers: { Accept: 'application/json' },
    });
    if (![200, 503].includes(response.status)) {
      await response.body?.cancel();
      return { reachable: false, status: response.status, validSchema: false };
    }
    const body = await boundedJson(response, 4096);
    const names = [
      'schemaVersion',
      'ok',
      'intakeEnabled',
      'publicEnabled',
      'checkedAt',
      'observedAt',
      'validUntil',
      'cleanupAt',
      'reason',
    ];
    const reasons = [
      'not-configured',
      'monitor-unverified',
      'usage-unavailable',
      'usage-stale',
      'usage-limit',
      'cleanup-unavailable',
      'storage-unavailable',
      'intake-disabled',
    ];
    need(
      object(body) &&
        Object.keys(body).length === names.length &&
        names.every((name) => Object.hasOwn(body, name)),
    );
    need(
      body.schemaVersion === 1 &&
        ['ok', 'intakeEnabled', 'publicEnabled'].every(
          (name) => typeof body[name] === 'boolean',
        ),
    );
    need(body.reason === null || reasons.includes(body.reason));
    const iso = (value) =>
      typeof value === 'string' &&
      Number.isFinite(Date.parse(value)) &&
      new Date(value).toISOString() === value;
    need(
      iso(body.checkedAt) &&
        Math.abs(Date.parse(body.checkedAt) - now) <= 300_000,
    );
    need(
      ['observedAt', 'validUntil', 'cleanupAt'].every(
        (name) => body[name] === null || iso(body[name]),
      ),
    );
    need(/no-store/i.test(response.headers.get('cache-control') || ''));
    need(
      response.status === 200
        ? body.ok &&
            body.reason === null &&
            body.intakeEnabled &&
            body.publicEnabled
        : !body.ok && reasons.includes(body.reason),
    );
    return {
      reachable: true,
      status: response.status,
      validSchema: true,
      intakeEnabled: body.intakeEnabled,
      publicEnabled: body.publicEnabled,
      reason: body.reason,
      cleanupReceiptPresent: typeof body.cleanupAt === 'string',
    };
  } catch {
    return { reachable: false, status: null, validSchema: false };
  }
}
export async function inspectReadiness(env, fetcher = fetch, now = Date.now()) {
  need(env.REPORTS_READINESS_INSPECTION === 'true');
  const inventory = {
    databases: [],
    namespaces: [],
    cleanupCron: null,
    dedicatedDatabaseMatched: false,
  };
  const observer = async (url, options) => {
    const response = await fetcher(url, options);
    if (response.ok && url.startsWith(api + `/accounts/${target.account}/`)) {
      const path = new URL(url).pathname;
      if (
        path.endsWith('/d1/database') ||
        path.endsWith('/workers/durable_objects/namespaces') ||
        path.endsWith(`/workers/scripts/${cleanup}/schedules`)
      ) {
        const body = await boundedJson(response.clone(), 512_000);
        if (path.endsWith('/d1/database')) {
          inventory.databases = body.result?.map((row) => row.uuid) || [];
          inventory.dedicatedDatabaseMatched =
            body.result?.some(
              (row) =>
                row.uuid === reportDatabase.id &&
                row.name === reportDatabase.name,
            ) === true;
        }
        if (path.endsWith('/workers/durable_objects/namespaces'))
          inventory.namespaces = body.result?.map((row) => row.id) || [];
        if (path.endsWith('/schedules'))
          inventory.cleanupCron =
            body.result?.schedules?.map((row) => row.cron) ?? null;
      }
    }
    return response;
  };
  const capability = await discover(env, observer);
  need(metrics.every(([, dataset]) => capability.enabled[dataset] === true));
  need(inventory.dedicatedDatabaseMatched);
  const databaseResponse = await fetcher(
    api + `/accounts/${target.account}/d1/database/${reportDatabase.id}/query`,
    {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sql: countSql,
        params: [Math.floor(now / 1000), Math.floor(now / 1000) - 60],
      }),
    },
  );
  need(databaseResponse.ok);
  const databaseBody = await boundedJson(databaseResponse, 16384);
  need(
    databaseBody.success === true &&
      (!databaseBody.errors ||
        (Array.isArray(databaseBody.errors) && !databaseBody.errors.length)) &&
      databaseBody.result?.length === 1 &&
      databaseBody.result[0].success === true &&
      databaseBody.result[0].results?.length === 1,
  );
  const counts = databaseBody.result[0].results[0];
  need(
    [
      'report_count',
      'expired_count',
      'old_rate_count',
      'withdrawal_count',
    ].every((key) => Number.isSafeInteger(counts[key]) && counts[key] >= 0),
  );
  need(counts.expired_count <= counts.report_count);
  const operationStamp = (value) => {
    if (value === null || value === undefined) return null;
    const stamp = Number(value);
    return Number.isSafeInteger(stamp) &&
      stamp > 0 &&
      stamp <= Math.floor(now / 1000)
      ? new Date(stamp * 1000).toISOString()
      : null;
  };
  const plan = inspectionQuery(capability.datasets, now);
  let usage = { sampleReturned: false, reason: 'utc-day-start-lag-window' };
  if (plan) {
    const response = await fetcher(api + '/graphql', {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query: plan.query }),
    });
    need(response.ok);
    usage = {
      sampleReturned: true,
      requestedStart: plan.start,
      requestedEnd: plan.end,
      ...reportedMetrics(await boundedJson(response, 512_000), inventory),
    };
  }
  return {
    operation: 'read-community-reports-readiness',
    sourceSha: env.GITHUB_SHA,
    checkedAt: new Date(now).toISOString(),
    usage,
    cleanup: {
      scheduleReadable: inventory.cleanupCron !== null,
      expectedSchedulePresent:
        inventory.cleanupCron?.includes('*/15 * * * *') ?? false,
      executionVerified: false,
      dedicatedDatabaseMatched: true,
      reportRowsPresent: counts.report_count > 0,
      expiredReportRowsPresent: counts.expired_count > 0,
      oldRateRowsPresent: counts.old_rate_count > 0,
      unfinishedWithdrawalsPresent: counts.withdrawal_count > 0,
      lastCleanupReceiptAt: operationStamp(counts.cleanup_at),
      lastMonitorReceiptAt: operationStamp(counts.monitor_at),
    },
    publicHealth: await inspectHealth(fetcher, now),
    notificationDeliveryVerified: false,
    automaticCollectorCompatible: false,
    collectorBlocker: 'required-provider-coverage-watermark-not-verified',
    productionChanged: false,
    secretsExported: false,
    authorizesActivation: false,
  };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    if (process.argv[2] !== 'inspect')
      throw Error('READINESS_INSPECTION_FAILED');
    console.log(JSON.stringify(await inspectReadiness(process.env), null, 2));
  } catch (error) {
    for (const line of failureLines(error)) console.error(line);
    process.exitCode = 1;
  }
}
