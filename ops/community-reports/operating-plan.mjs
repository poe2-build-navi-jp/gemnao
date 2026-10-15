// Pure decision helper: no network, credentials, SQL or configuration writes.
// The runtime lease uses this arithmetic on manually entered observations.
export const stopFlags = Object.freeze({
  REPORTS_ENABLED: 'false',
  REPORTS_PUBLIC_ENABLED: 'false',
  REPORTS_BUDGET_VERIFIED: 'false',
});
export const usageLimits = Object.freeze({
  rowsReadToday: 5_000_000,
  rowsWrittenToday: 100_000,
  accountStorageBytes: 5_000_000_000,
  largestDatabaseBytes: 500_000_000,
  workerRequestsToday: 100_000,
  durableObjectRequestsToday: 100_000,
  durableObjectGbMillisecondsToday: 13_000_000,
  durableObjectRowsReadToday: 5_000_000,
  durableObjectRowsWrittenToday: 100_000,
  durableObjectStorageBytes: 5_000_000_000,
});
const countKeys = ['databaseCount', 'workerCount', 'cronCount'];
const number = (x) => Number.isSafeInteger(x) && x >= 0;
const exact = (x, keys) =>
  x &&
  typeof x === 'object' &&
  !Array.isArray(x) &&
  Object.keys(x).length === keys.length &&
  keys.every((k) => Object.hasOwn(x, k));
function decision(reasons) {
  return {
    stopRecommended: reasons.length > 0,
    reasons,
    suggestedFlags: reasons.length ? { ...stopFlags } : null,
    applied: false,
    automaticStopImplemented: false,
    automaticResumeAllowed: false,
    authorizesActivation: false,
  };
}
/** Values must be transcribed by the operator from the existing dashboard.
 * This validates arithmetic/freshness, not authenticity or API permissions. */
export function assessUsage(observation, now = Date.now()) {
  const keys = [
    'source',
    'observedAt',
    'utcDay',
    'phase',
    ...Object.keys(usageLimits),
    ...countKeys,
  ];
  if (
    !exact(observation, keys) ||
    !['operator-transcribed-dashboard', 'cloudflare-graphql'].includes(
      observation.source,
    ) ||
    !['before-setup', 'after-setup'].includes(observation.phase) ||
    typeof observation.observedAt !== 'string' ||
    typeof observation.utcDay !== 'string' ||
    ![...Object.keys(usageLimits), ...countKeys].every((k) =>
      number(observation[k]),
    ) ||
    !number(now)
  )
    return decision(['invalid-or-missing-usage']);
  const at = Date.parse(observation.observedAt);
  if (
    !Number.isFinite(at) ||
    new Date(at).toISOString() !== observation.observedAt ||
    at > now ||
    now - at > 30 * 60_000 ||
    observation.utcDay !== new Date(at).toISOString().slice(0, 10) ||
    observation.utcDay !== new Date(now).toISOString().slice(0, 10)
  )
    return decision(['stale-future-or-different-utc-day']);
  const reasons = Object.entries(usageLimits)
    .filter(([k, limit]) => observation[k] >= limit * 0.8)
    .map(([k]) => `${k}-at-or-over-80-percent`);
  const add = observation.phase === 'before-setup' ? 1 : 0;
  for (const [k, limit] of [
    ['databaseCount', 10],
    ['workerCount', 100],
    ['cronCount', 5],
  ])
    if (observation[k] + (k === 'workerCount' ? 2 : 1) * add > limit)
      reasons.push(`${k}-no-free-slot`);
  return decision(reasons);
}

/** Proposed deadlines, not a change to deployed retention or scheduled jobs. */
export function withdrawalDeadlines(createdAt, withdrawalAt) {
  if (!number(createdAt) || !number(withdrawalAt) || withdrawalAt < createdAt)
    throw Error('Invalid withdrawal dates');
  const day = 86400;
  const eraseBy = Math.min(withdrawalAt + 30 * day, createdAt + 60 * day);
  return {
    reviewRoute: '/admin/reports',
    responseBy: Math.min(withdrawalAt + day, eraseBy),
    eraseBy,
    automaticDeadlineEnforcementImplemented: false,
    authorizesMetadataDeletion: false,
  };
}

/** Initial rollout does not support restoring old community-report DB images. */
export function restoreDisposition(snapshotRestored) {
  if (snapshotRestored !== false)
    return {
      ...decision(['past-db-restore-unsupported']),
      keepOwnerDeletionAndCleanupBindings: true,
      requireArticleWithdrawalReview: true,
      restoreSupportImplemented: false,
    };
  return { ...decision([]), restoreSupportImplemented: false };
}
