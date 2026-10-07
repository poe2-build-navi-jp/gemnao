// Created by run 37640786041; no caller-selected databases, SQL or URLs.
import { TARGET, SHARING, sha256 } from './controller.mjs';
import { readOnlyTransport } from './diagnostics.mjs';
export const HEALTH_TARGETS = Object.freeze([
  Object.freeze({ feature: 'feedback', databaseName: TARGET.database,
    databaseId: '3a714aee-e602-4590-afd0-3c2ddd9aea8f', confirmedAt: 1791385426577,
    sql: 'SELECT last_cleanup FROM diagnostic_retention_health WHERE singleton=1 LIMIT 1;',
    sqlSha256: '89def89f72a3609f179571566d369fb67ffcdb5fc2ed05d213d0acda42b41b26' }),
  Object.freeze({ feature: 'sharing', databaseName: SHARING.database,
    databaseId: '72c728f5-1656-4e26-bc11-7c508ae155c3', confirmedAt: 1791385430287,
    sql: "SELECT value,expires_at FROM diagnosis_operations WHERE key='cleanup_success' LIMIT 1;",
    sqlSha256: '687966446eb2e3911382151bcea3619338452f5313127718f9d7a31bb3de1876' }),
]);
export const HEALTH_PLAN_HASH = sha256(JSON.stringify({ operation: 'observe-preview-cleanup-heartbeats',
  accountId: TARGET.accountId, creationRunId: 37640786041,
  creationReceiptSha256: 'a60571f40ecd9a37db31a42e98841ad2ba2f993de0ec016488fc688d599e43d0',
  targets: HEALTH_TARGETS, maximumQueries: 2, maximumRowsPerQuery: 1, maximumAgeMs: 7_200_000 }));
function need(ok, code) { if (!ok) throw new Error(`BLOCKED:${code}`); }
export function healthTransport(transport) {
  const reads = readOnlyTransport(transport);
  const accountUrl = `https://api.cloudflare.com/client/v4/accounts/${TARGET.accountId}`;
  const queried = new Set();
  return (url, options) => {
    if (url.startsWith('https://api.github.com/')) return reads(url, options);
    const target = HEALTH_TARGETS.find(t => url === `${accountUrl}/d1/database/${t.databaseId}`
      || url === `${accountUrl}/d1/database/${t.databaseId}/query`);
    if (options?.method === 'GET' && (url === accountUrl
      || (target && url === `${accountUrl}/d1/database/${target.databaseId}`))) return transport(url, options);
    need(options?.method === 'POST' && target && url === `${accountUrl}/d1/database/${target.databaseId}/query`, 'HEALTH_REQUEST_SCOPE');
    need(sha256(target.sql) === target.sqlSha256 && options.body === JSON.stringify({ sql: target.sql }), 'HEALTH_SQL_PIN');
    need(!queried.has(target.feature), 'HEALTH_QUERY_ONCE');
    queried.add(target.feature); // No retry, including an uncertain response.
    return transport(url, options);
  };
}
export function heartbeatStatus(feature, result, now) {
  need(Array.isArray(result) && result.length === 1 && result[0]?.success === true
    && Array.isArray(result[0].results) && result[0].results.length <= 1
    && (result[0].meta?.rows_written === undefined || result[0].meta.rows_written === 0)
    && (result[0].meta?.changed_db === undefined || result[0].meta.changed_db === false), 'HEALTH_QUERY_RESULT');
  const target = HEALTH_TARGETS.find(t => t.feature === feature); need(target, 'HEALTH_REQUEST_SCOPE');
  if (result[0].results.length === 0) return { healthy: false, pending: true };
  const row = result[0].results[0];
  need(row && typeof row === 'object' && !Array.isArray(row), 'HEALTH_HEARTBEAT_SHAPE');
  let stamp;
  if (feature === 'feedback') {
    need(Object.keys(row).length === 1 && Number.isSafeInteger(row.last_cleanup), 'HEALTH_HEARTBEAT_SHAPE');
    stamp = row.last_cleanup * 1000;
  } else {
    need(Object.keys(row).length === 2 && typeof row.value === 'string' && /^[0-9]{13}$/.test(row.value)
      && Number.isSafeInteger(row.expires_at), 'HEALTH_HEARTBEAT_SHAPE');
    stamp = Number(row.value);
    need(row.expires_at === stamp + 7_200_000, 'HEALTH_HEARTBEAT_SHAPE');
  }
  const healthy = stamp >= Math.floor(target.confirmedAt / 1000) * 1000
    && stamp <= now && now - stamp <= 7_200_000
    && (feature === 'feedback' || row.expires_at > now);
  return { healthy, pending: !healthy };
}
