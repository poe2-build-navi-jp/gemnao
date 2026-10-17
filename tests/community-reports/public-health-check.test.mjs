import test from 'node:test';
import assert from 'node:assert/strict';
import { publicHealthCheck } from '../../ops/community-reports/public-health-check.mjs';

const now = Date.parse('2026-10-16T20:00:00.000Z');
const env = { GITHUB_SHA: 'a'.repeat(40) };
const iso = (offset) => new Date(now + offset).toISOString();
const healthy = () => ({
  schemaVersion: 1,
  ok: true,
  intakeEnabled: true,
  publicEnabled: true,
  checkedAt: iso(0),
  observedAt: iso(-300_000),
  validUntil: iso(1_500_000),
  cleanupAt: iso(-3_600_000),
  reason: null,
});
function probe(body, status = 200, headers = { 'cache-control': 'no-store' }) {
  const calls = [];
  return {
    calls,
    fetcher: async (url, options) => {
      calls.push({ url, options });
      return new Response(JSON.stringify(body), { status, headers });
    },
  };
}
await test('one fixed credential-free GET accepts a fresh, consistent healthy response', async () => {
  const p = probe(healthy());
  const result = await publicHealthCheck(env, p.fetcher, now);
  assert.equal(result.healthy, true);
  assert.equal(result.notificationDeliveryVerified, false);
  assert.equal(result.productionChanged, false);
  assert.equal(p.calls.length, 1);
  assert.equal(p.calls[0].url, 'https://gemnao.pages.dev/api/reports/health');
  const options = p.calls[0].options;
  assert.equal(options.method, 'GET');
  assert.equal(options.credentials, 'omit');
  assert.equal(options.redirect, 'error');
  assert.deepEqual(options.headers, { Accept: 'application/json' });
});
await test('503 is a real unhealthy report, never converted into success because intake is closed', async () => {
  const p = probe(
    {
      ...healthy(),
      ok: false,
      intakeEnabled: false,
      publicEnabled: false,
      observedAt: null,
      validUntil: null,
      cleanupAt: null,
      reason: 'not-configured',
    },
    503,
  );
  const result = await publicHealthCheck(env, p.fetcher, now);
  assert.equal(result.healthy, false);
  assert.equal(result.health.validSchema, true);
  assert.equal(result.health.reason, 'not-configured');
});
await test('missing, stale, future, expired and contradictory success receipts fail closed', async () => {
  for (const changes of [
    { observedAt: null },
    { observedAt: iso(-1_800_001) },
    { observedAt: iso(1) },
    { validUntil: iso(0) },
    { validUntil: iso(1_500_001) },
    { cleanupAt: null },
    { cleanupAt: iso(-7_200_001) },
    { cleanupAt: iso(1) },
    { checkedAt: iso(-300_001) },
    { intakeEnabled: false },
    { reason: 'usage-stale' },
    { unexpected: 'DO_NOT_LOG' },
  ]) {
    const p = probe({ ...healthy(), ...changes });
    const result = await publicHealthCheck(env, p.fetcher, now);
    assert.equal(result.healthy, false, JSON.stringify(changes));
    assert.equal(result.health.validSchema, false);
    assert.ok(!JSON.stringify(result).includes('DO_NOT_LOG'));
  }
});
await test('blocked, cached, invalid, oversized and timed-out responses are unhealthy without body leakage or retries', async () => {
  for (const p of [
    probe({ private: 'DO_NOT_LOG' }, 403),
    probe(healthy(), 200, {}),
    probe('not JSON'),
    probe({ value: 'DO_NOT_LOG'.repeat(600) }),
    {
      calls: [],
      fetcher: async () => {
        throw Error('PRIVATE_NETWORK_ERROR');
      },
    },
  ]) {
    const result = await publicHealthCheck(env, p.fetcher, now);
    assert.equal(result.healthy, false);
    assert.ok(p.calls.length <= 1);
    assert.ok(!/DO_NOT_LOG|PRIVATE_NETWORK_ERROR/.test(JSON.stringify(result)));
  }
});
await test('missing source identity blocks before any network request', async () => {
  const p = probe(healthy());
  await assert.rejects(
    publicHealthCheck({}, p.fetcher, now),
    /SOURCE_SHA_REQUIRED/,
  );
  assert.equal(p.calls.length, 0);
});
await test('Free policy v2 requires exact policy, null analytics timestamps and recent real cleanup', async () => {
  const free = {
    ...healthy(),
    schemaVersion: 2,
    budgetMode: 'free-small-v1',
    observedAt: null,
    validUntil: null,
  };
  assert.equal(
    (await publicHealthCheck(env, probe(free).fetcher, now)).healthy,
    true,
  );
  for (const patch of [
    { budgetMode: 'typo' },
    { observedAt: iso(0) },
    { validUntil: iso(1000) },
    { cleanupAt: null },
    { cleanupAt: iso(-7200001) },
    { cleanupAt: iso(1) },
  ]) {
    assert.equal(
      (await publicHealthCheck(env, probe({ ...free, ...patch }).fetcher, now))
        .healthy,
      false,
    );
  }
  const exhausted = {
    ...free,
    ok: false,
    intakeEnabled: false,
    publicEnabled: false,
    reason: 'daily-budget',
  };
  const report = await publicHealthCheck(
    env,
    probe(exhausted, 503).fetcher,
    now,
  );
  assert.equal(report.health.validSchema, true);
  assert.equal(report.healthy, false);
});
