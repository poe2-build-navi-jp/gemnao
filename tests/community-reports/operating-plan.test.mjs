import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assessUsage,
  usageLimits,
  stopFlags,
  withdrawalDeadlines,
  restoreDisposition,
} from '../../ops/community-reports/operating-plan.mjs';
// Synthetic numbers only; never a claim about the account's current usage.
const now = Date.parse('2026-10-14T12:00:00.000Z');
const fixture = () => ({
  source: 'operator-transcribed-dashboard',
  observedAt: new Date(now).toISOString(),
  utcDay: '2026-10-14',
  phase: 'before-setup',
  ...Object.fromEntries(Object.keys(usageLimits).map((k) => [k, 0])),
  rowsReadToday: 0,
  rowsWrittenToday: 0,
  accountStorageBytes: 0,
  largestDatabaseBytes: 0,
  workerRequestsToday: 0,
  databaseCount: 3,
  workerCount: 3,
  cronCount: 2,
});
await test('missing or malformed observation recommends stop, never grants activation', () => {
  for (const x of [
    null,
    {},
    { ...fixture(), rowsReadToday: undefined },
    { ...fixture(), rowsReadToday: -1 },
    { ...fixture(), rowsReadToday: NaN },
    { ...fixture(), token: 'must not be accepted' },
  ]) {
    const d = assessUsage(x, now);
    assert.equal(d.stopRecommended, true);
    assert.deepEqual(d.suggestedFlags, stopFlags);
    assert.equal(d.applied, false);
    assert.equal(d.authorizesActivation, false);
  }
});
await test('fresh below-threshold observation is arithmetic only, not production readiness', () => {
  const d = assessUsage(fixture(), now);
  assert.equal(d.stopRecommended, false);
  assert.equal(d.suggestedFlags, null);
  assert.equal(d.automaticStopImplemented, false);
  assert.equal(d.automaticResumeAllowed, false);
  assert.equal(d.authorizesActivation, false);
});
for (const [key, limit] of Object.entries(usageLimits))
  await test(`${key} stops at 80 percent, including the boundary`, () => {
    assert.equal(
      assessUsage({ ...fixture(), [key]: limit * 0.8 - 1 }, now)
        .stopRecommended,
      false,
    );
    assert.equal(
      assessUsage({ ...fixture(), [key]: limit * 0.8 }, now).stopRecommended,
      true,
    );
  });
await test('stale, future and previous UTC-day observations never pass', () => {
  for (const x of [
    { ...fixture(), observedAt: new Date(now - 1800001).toISOString() },
    { ...fixture(), observedAt: new Date(now + 1).toISOString() },
    { ...fixture(), utcDay: '2026-10-13' },
  ])
    assert.equal(assessUsage(x, now).stopRecommended, true);
  const midnight = Date.parse('2026-10-15T00:00:01.000Z');
  assert.equal(
    assessUsage(
      { ...fixture(), observedAt: '2026-10-14T23:59:59.000Z' },
      midnight,
    ).stopRecommended,
    true,
  );
});
await test('one DB and cron plus two Worker slots are reserved before setup, not double-counted after', () => {
  for (const [key, limit] of [
    ['databaseCount', 10],
    ['workerCount', 100],
    ['cronCount', 5],
  ]) {
    assert.equal(
      assessUsage({ ...fixture(), [key]: limit }, now).stopRecommended,
      true,
    );
    assert.equal(
      assessUsage({ ...fixture(), [key]: limit, phase: 'after-setup' }, now)
        .stopRecommended,
      false,
    );
  }
  assert.equal(
    assessUsage({ ...fixture(), workerCount: 99 }, now).stopRecommended,
    true,
  );
  assert.equal(
    assessUsage({ ...fixture(), workerCount: 98 }, now).stopRecommended,
    false,
  );
});
await test('withdrawal deadlines bound response to one day and metadata to 30 days/60 from creation', () => {
  const at = Math.floor(now / 1000),
    d = withdrawalDeadlines(at - 20 * 86400, at);
  assert.equal(d.responseBy, at + 86400);
  assert.equal(d.eraseBy, at + 30 * 86400);
  assert.equal(d.authorizesMetadataDeletion, false);
  assert.equal(withdrawalDeadlines(at - 59 * 86400, at).eraseBy, at + 86400);
  assert.throws(() => withdrawalDeadlines(at, at - 1));
});
await test('old or unknown DB restoration always recommends stop, without deleting resources', () => {
  for (const x of [true, undefined, 'confirmed']) {
    const d = restoreDisposition(x);
    assert.equal(d.stopRecommended, true);
    assert.deepEqual(d.suggestedFlags, stopFlags);
    assert.equal(d.keepOwnerDeletionAndCleanupBindings, true);
    assert.equal(d.restoreSupportImplemented, false);
  }
  assert.equal(restoreDisposition(false).authorizesActivation, false);
});
