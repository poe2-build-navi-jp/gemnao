import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPublication } from '../../ops/community-reports/publication-check.mjs';
const origin = 'https://gemnao.pages.dev',
  now = Date.now();
function fixture(stage, options = {}) {
  const calls = [];
  const live = ['open', 'ready-closed'].includes(stage);
  const health = {
    schemaVersion: 1,
    ok: stage === 'open',
    intakeEnabled: stage === 'open',
    publicEnabled: stage === 'open',
    checkedAt: new Date(now).toISOString(),
    observedAt: live ? new Date(now - 60000).toISOString() : null,
    validUntil: live ? new Date(now + 1740000).toISOString() : null,
    cleanupAt: live ? new Date(now - 60000).toISOString() : null,
    reason:
      stage === 'open'
        ? null
        : stage === 'ready-closed'
          ? 'intake-disabled'
          : 'not-configured',
    ...options.health,
  };
  return {
    calls,
    fetcher: async (url, init) => {
      const u = new URL(url);
      calls.push({ url, init });
      assert.equal(u.origin, origin);
      assert.equal(init.method, 'GET');
      assert.equal(init.credentials, 'omit');
      assert.equal(init.redirect, 'error');
      assert.ok(!init.headers.Authorization);
      assert.ok(!init.headers.Cookie);
      if (u.pathname === '/api/reports/health')
        return Response.json(health, {
          status: stage === 'open' ? 200 : 503,
          headers: {
            'cache-control': 'private, no-store',
            'x-robots-tag': 'noindex',
          },
        });
      assert.ok(!u.pathname.startsWith('/api/'));
      if (u.pathname.startsWith('/_next/static/'))
        return new Response('synthetic', {
          status: options.badAsset ? 404 : 200,
          headers: {
            'content-type': options.htmlAsset ? 'text/html' : 'text/javascript',
          },
        });
      if (u.pathname === '/sitemap.xml')
        return new Response(options.reportInSitemap ? '/reports' : '<urlset/>');
      if (u.pathname.endsWith('.txt')) return new Response('synthetic');
      const report = u.pathname.includes('/reports');
      const html = `<html><head><title>Synthetic</title><link rel="canonical" href="${origin + u.pathname}"/><meta property="og:image" content="/og-default.png"/><script src="/_next/static/test.js"></script><script src="https://outside.invalid/analytics.js"></script></head><body>Local fixture</body></html>`;
      return new Response(html, {
        status:
          report && ['backend-closed', 'ready-closed'].includes(stage)
            ? 404
            : 200,
        headers: {
          'cache-control': 'private, no-store',
          'x-robots-tag': 'noindex',
          'content-security-policy':
            "connect-src 'self'; frame-ancestors 'none'",
        },
      });
    },
  };
}
await test('all stages use only same-origin GET with no cookies, report status/list APIs or writes', async () => {
  for (const stage of ['backend-closed', 'ready-closed', 'ui-closed', 'open']) {
    const f = fixture(stage),
      result = await checkPublication({
        origin,
        stage,
        now,
        fetcher: f.fetcher,
      });
    assert.equal(result.assetsChecked, 1);
    assert.equal(result.acceptanceWrites, 0);
    assert.ok(f.calls.every((call) => call.init.method === 'GET'));
    assert.deepEqual(
      f.calls
        .filter((call) => new URL(call.url).pathname.startsWith('/api/'))
        .map((call) => new URL(call.url).pathname),
      ['/api/reports/health'],
    );
  }
});
await test('other origins, credentials, query strings and unknown stages refuse before fetch', async () => {
  for (const value of [
    'https://outside.invalid',
    'https://user:secret@gemnao.pages.dev',
    'https://gemnao.pages.dev/?token=x',
    'http://192.168.1.1:80',
  ]) {
    let count = 0;
    await assert.rejects(
      checkPublication({
        origin: value,
        stage: 'ui-closed',
        fetcher: async () => {
          count++;
        },
      }),
    );
    assert.equal(count, 0);
  }
  const f = fixture('ui-closed');
  await assert.rejects(
    checkPublication({ origin, stage: 'unsafe', now, fetcher: f.fetcher }),
  );
  assert.equal(f.calls.length, 0);
});
await test('open check refuses stale observations, expiry, stale cleanup, closed flags and unexpected/private health fields', async () => {
  for (const health of [
    { validUntil: new Date(now - 1).toISOString() },
    { cleanupAt: new Date(now - 7200001).toISOString() },
    { intakeEnabled: false },
    { observedAt: new Date(now - 1800001).toISOString() },
    { ownerKey: 'SYNTHETIC_MUST_NOT_LOG' },
    { checkedAt: new Date(now - 120001).toISOString() },
  ]) {
    const f = fixture('open', { health });
    await assert.rejects(
      checkPublication({ origin, stage: 'open', now, fetcher: f.fetcher }),
    );
  }
});
await test('closed check refuses enabled intake and asset/SEO failures', async () => {
  for (const options of [
    { health: { intakeEnabled: true } },
    { badAsset: true },
    { htmlAsset: true },
    { reportInSitemap: true },
  ]) {
    const f = fixture('ui-closed', options);
    await assert.rejects(
      checkPublication({ origin, stage: 'ui-closed', now, fetcher: f.fetcher }),
    );
  }
});

await test('ready-closed requires fresh operations while both public flags remain OFF', async () => {
  for (const health of [
    { reason: 'not-configured' },
    { reason: 'usage-stale' },
    { observedAt: null },
    { validUntil: new Date(now - 1).toISOString() },
    { publicEnabled: true },
  ]) {
    const f = fixture('ready-closed', { health });
    await assert.rejects(
      checkPublication({
        origin,
        stage: 'ready-closed',
        now,
        fetcher: f.fetcher,
      }),
    );
  }
});
await test('Free v2 publication requires a known policy and real cleanup without invented analytics coverage', async () => {
  const health = {
    schemaVersion: 2,
    budgetMode: 'free-small-v1',
    observedAt: null,
    validUntil: null,
  };
  const f = fixture('open', { health });
  await checkPublication({ origin, stage: 'open', now, fetcher: f.fetcher });
  for (const patch of [
    { budgetMode: 'typo' },
    { observedAt: new Date(now).toISOString() },
    { cleanupAt: null },
    { cleanupAt: new Date(now - 7200001).toISOString() },
  ]) {
    const bad = fixture('open', { health: { ...health, ...patch } });
    await assert.rejects(
      checkPublication({ origin, stage: 'open', now, fetcher: bad.fetcher }),
    );
  }
});
