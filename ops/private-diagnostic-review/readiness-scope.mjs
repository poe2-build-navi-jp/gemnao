// OFFLINE REVIEW ONLY. No credentials, network, CLI, workflow, or execution adapter.
import { account, database } from './scope.mjs';
const root = `/accounts/${account}`;
export const settingsPath = `${root}/workers/scripts/gemnao-diagnostic-qa/settings`;
export const queryPath = `${root}/d1/database/${database}/query`;
export const readinessQueries = Object.freeze([
  'SELECT last_cleanup FROM diagnostic_retention_health WHERE singleton=1 LIMIT 1;',
  "SELECT name,type FROM sqlite_schema WHERE substr(name,1,19)='private_diagnostic_' ORDER BY name LIMIT 33;",
]);
export function allowed(path, method, body) {
  return method === 'GET' && path === settingsPath && body === undefined
    || method === 'POST' && path === queryPath && readinessQueries.some(sql => body === JSON.stringify({sql}));
}
export function readinessGuard() {
  const seen = new Set();
  return (path, method, body) => {
    const key = JSON.stringify([path,method,body]);
    if (!allowed(path,method,body) || seen.has(key) || seen.size >= 3) throw new Error('BLOCKED:READINESS_SCOPE');
    seen.add(key); // Before transport: no retry, even on failed or uncertain reads.
  };
}
// No generic bindings/settings output. Secret/verifier values are never accessed.
export function settingsSummary(bindings, now) {
  if (!Array.isArray(bindings) || !Number.isSafeInteger(now)) throw new Error('BLOCKED:SETTINGS_SHAPE');
  const expected = { DIAGNOSIS_DB:'72c728f5-1656-4e26-bc11-7c508ae155c3', FEEDBACK_DB:database };
  const d1 = bindings.filter(b => b.type === 'd1');
  const bindingsMatch = d1.length === 2 && Object.entries(expected).every(([name,id]) =>
    d1.filter(b => b.name === name && b.id === id).length === 1);
  const plain = name => {
    const items = bindings.filter(b => b.name === name);
    return items.length === 1 && items[0].type === 'plain_text' ? items[0].text : undefined;
  };
  const start = plain('QA_ACCESS_NOT_BEFORE'), end = plain('QA_ACCESS_EXPIRES_AT');
  const windowKnown = /^[1-9][0-9]{12}$/.test(start ?? '') && /^[1-9][0-9]{12}$/.test(end ?? '')
    && Number(end) > Number(start) && Number(end) - Number(start) <= 3600000;
  const flags = ['DIAGNOSIS_ENABLED','DIAGNOSIS_STORAGE_ENABLED','DIAGNOSIS_SHARING_ENABLED',
    'DIAGNOSIS_WRITES_ENABLED','DIAGNOSIS_PREVIEW_SHARING_ENABLED','FEEDBACK_ENABLED','FEEDBACK_PREVIEW_ENABLED'];
  return {bindingsMatch, gateWindowKnown:windowKnown,
    gateWindowActive:windowKnown && Number(start) <= now && now < Number(end),
    legacyIntakeOff:flags.every(name => plain(name) === 'false'),
    privateBindingAbsent:!bindings.some(b => b.name === 'PRIVATE_DIAGNOSTIC_DB'),
    currentPlanVerified:false, accountQuotaKnown:false, receiptActivationAuthorized:false};
}
