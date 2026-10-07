import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { monitor } from '../../ops/cleanup-health-monitor/monitor.mjs';
import { REVIEWED_TARGETS } from '../../ops/cleanup-health-monitor/reviewed-targets.mjs';

const config = (
  feedback = 'enabled',
  sharing = 'enabled',
  name = 'preview',
) => ({
  [name]: {
    feedback: {
      url: `https://${name === 'preview' ? 'monitor-testbed.' : ''}gemnao.pages.dev/api/diagnostic-feedback`,
      expected: feedback,
    },
    sharing: {
      url: `https://${name === 'preview' ? 'monitor-testbed.' : ''}gemnao.pages.dev/api/diagnosis/config`,
      expected: sharing,
    },
  },
});
const ready = {
  feedback: { enabled: true, canDelete: true },
  sharing: { enabled: true, sharing: true, metrics: false },
};
const paused = {
  feedback: { enabled: false, canDelete: true },
  sharing: { enabled: true, sharing: false, metrics: false, localOnly: true },
};
const json = (value, init = {}) =>
  new Response(JSON.stringify(value), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'private, no-store',
    },
    ...init,
  });
const mock =
  (responses = ready, calls = []) =>
  async (url, options) => {
    calls.push({ url, options });
    return json(responses[url.endsWith('/config') ? 'sharing' : 'feedback']);
  };
const probe = (targets, responses = ready, name = 'preview') =>
  monitor(name, { targets, fetchImpl: mock(responses) });

await test('all committed live targets remain unconfigured and never fetch', async () => {
  assert.deepEqual(REVIEWED_TARGETS, { preview: null, production: null });
  for (const name of [
    'preview',
    'production',
    'arbitrary',
    'https://example.com',
    '__proto__',
  ]) {
    const summary = await monitor(name, {
      fetchImpl: () => assert.fail('must not fetch'),
    });
    assert.deepEqual(summary, {
      ok: false,
      checks: [
        {
          service: 'configuration',
          state: 'failed',
          code: 'target_not_reviewed',
        },
      ],
    });
  }
});

await test('healthy enabled capabilities use exactly two bounded, credentialless GETs', async () => {
  const calls = [];
  const targets = config();
  const summary = await monitor('preview', {
    targets,
    fetchImpl: mock(ready, calls),
  });
  assert.equal(summary.ok, true);
  assert.deepEqual(
    summary.checks.map((r) => r.state),
    ['ready', 'ready'],
  );
  assert.equal(calls.length, 2);
  assert.deepEqual(
    calls.map((r) => r.url).sort((a, b) => a.localeCompare(b)),
    Object.values(targets.preview)
      .map((r) => r.url)
      .sort((a, b) => a.localeCompare(b)),
  );
  for (const { options } of calls) {
    assert.equal(options.method, 'GET');
    assert.equal(options.redirect, 'error');
    assert.equal(options.credentials, 'omit');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.referrerPolicy, 'no-referrer');
    assert.deepEqual(options.headers, {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    });
    assert.equal(options.body, undefined);
    assert.ok(options.signal instanceof AbortSignal);
  }
});

for (const scenario of [
  'missing',
  'stale',
  'failed cleanup',
  'missing binding',
]) {
  await test(`${scenario}: fail closed readiness false under expected enabled`, async () => {
    const summary = await probe(config(), {
      feedback: { enabled: false, canDelete: true },
      sharing: { enabled: true, sharing: false, metrics: false },
    });
    assert.equal(summary.ok, false);
    assert.deepEqual(
      summary.checks.map((r) => r.code),
      ['capability_not_ready', 'capability_not_ready'],
    );
  });
}

await test('intentional disabled/local-only is paused, never a heartbeat success or failure', async () => {
  const summary = await probe(config('disabled', 'local-only'), paused);
  assert.equal(summary.ok, true);
  assert.deepEqual(
    summary.checks.map((r) => [r.state, r.code]),
    [
      ['paused', 'intentionally_disabled'],
      ['paused', 'intentionally_disabled'],
    ],
  );
});

await test('intentional disabled without any storage binding remains paused', async () => {
  const summary = await probe(config('disabled', 'disabled'), {
    feedback: { enabled: false, canDelete: false },
    sharing: { enabled: false, sharing: false, metrics: false },
  });
  assert.equal(summary.ok, true);
});

await test('unexpected collection while expected disabled fails', async () => {
  const summary = await probe(config('disabled', 'disabled'));
  assert.equal(summary.ok, false);
  assert.deepEqual(
    summary.checks.map((r) => r.code),
    ['unexpectedly_enabled', 'unexpectedly_enabled'],
  );
});

await test('local-only expectation cannot silently degrade to entirely disabled', async () => {
  const summary = await probe(config('disabled', 'local-only'), {
    ...paused,
    sharing: { enabled: false, sharing: false, metrics: false },
  });
  assert.equal(summary.checks[1].code, 'expected_local_only');
});

await test('preview schema additions still gate on sharing readiness', async () => {
  for (const sharing of [true, false]) {
    const summary = await probe(config(), {
      ...ready,
      sharing: {
        enabled: true,
        sharing,
        metrics: false,
        localOnly: false,
        previewSharing: true,
      },
    });
    assert.equal(summary.ok, sharing);
  }
});

await test('production cannot pass while reporting preview sharing mode', async () => {
  const summary = await probe(
    config('enabled', 'enabled', 'production'),
    {
      ...ready,
      sharing: {
        enabled: true,
        sharing: true,
        metrics: false,
        localOnly: false,
        previewSharing: true,
      },
    },
    'production',
  );
  assert.equal(summary.checks[1].code, 'unexpected_preview_mode');
});

await test('unreviewed metrics intake fails even when sharing readiness is true', async () => {
  const summary = await probe(config(), {
    ...ready,
    sharing: { enabled: true, sharing: true, metrics: true },
  });
  assert.equal(summary.checks[1].code, 'unexpected_metrics_enabled');
});

for (const [service, value] of /** @type {Array<[string, unknown]>} */ ([
  ['feedback', { enabled: 'true', canDelete: true }],
  ['feedback', { enabled: true, canDelete: false }],
  ['feedback', { enabled: true }],
  ['feedback', { ...ready.feedback, report: 'DO_NOT_LOG' }],
  ['sharing', { enabled: false, sharing: true, metrics: false }],
  ['sharing', { ...ready.sharing, localOnly: true }],
  ['sharing', { ...ready.sharing, previewSharing: true }],
  ['sharing', { ...ready.sharing, localOnly: 'false' }],
  ['sharing', { ...ready.sharing, unexpected: 'DO_NOT_LOG' }],
  ['sharing', null],
  ['sharing', []],
])) {
  await test(`reject invalid ${service} schema ${JSON.stringify(value)}`, async () => {
    const summary = await probe(config(), { ...ready, [service]: value });
    assert.equal(summary.ok, false);
    assert.equal(
      summary.checks.find((r) => r.service === service).code,
      'response_invalid',
    );
    assert.ok(!JSON.stringify(summary).includes('DO_NOT_LOG'));
  });
}

for (const badUrl of [
  'http://monitor-testbed.gemnao.pages.dev/api/diagnostic-feedback',
  'https://example.com/api/diagnostic-feedback',
  'https://gemnao.pages.dev/api/diagnostic-feedback',
  'https://monitor-testbed.gemnao.pages.dev.evil.test/api/diagnostic-feedback',
  'https://x.y.gemnao.pages.dev/api/diagnostic-feedback',
  'https://owner:secret@monitor-testbed.gemnao.pages.dev/api/diagnostic-feedback',
  'https://monitor-testbed.gemnao.pages.dev:8443/api/diagnostic-feedback',
  'https://monitor-testbed.gemnao.pages.dev/api/diagnostic-feedback?secret=x',
  'https://monitor-testbed.gemnao.pages.dev/api/diagnostic-feedback#fragment',
  'https://monitor-testbed.gemnao.pages.dev/api/diagnosis/config',
  'https://other.gemnao.pages.dev/api/diagnostic-feedback',
]) {
  await test(`reject non-reviewed/cross-origin URL ${badUrl}`, async () => {
    const targets = config();
    targets.preview.feedback.url = badUrl;
    const summary = await monitor('preview', {
      targets,
      fetchImpl: () => assert.fail('must not fetch'),
    });
    assert.equal(summary.checks[0].code, 'target_not_reviewed');
  });
}

await test('invalid expected mode cannot downgrade a target to paused', async () => {
  for (const targets of [
    config('auto'),
    config('enabled', 'auto'),
    { preview: { ...config().preview, extra: true } },
  ]) {
    const summary = await monitor('preview', {
      targets,
      fetchImpl: () => assert.fail('must not fetch'),
    });
    assert.equal(summary.checks[0].code, 'target_not_reviewed');
  }
});

for (const status of [301, 302, 403, 404, 429, 500, 503]) {
  await test(`HTTP ${status} fails without logging response or following redirects`, async () => {
    let calls = 0;
    const summary = await monitor('preview', {
      targets: config(),
      fetchImpl: async () => {
        calls++;
        return new Response('DO_NOT_LOG', {
          status,
          headers: { Location: 'https://example.com/secret' },
        });
      },
    });
    assert.equal(calls, 2);
    assert.deepEqual(
      summary.checks.map((r) => r.code),
      ['http_unavailable', 'http_unavailable'],
    );
    assert.ok(!JSON.stringify(summary).includes('DO_NOT_LOG'));
  });
}

await test('network and timeout exceptions expose only constant codes, with no retry', async () => {
  for (const error of [
    new Error('secret=DO_NOT_LOG ip=192.0.2.1'),
    new DOMException('DO_NOT_LOG', 'TimeoutError'),
  ]) {
    let calls = 0;
    const summary = await monitor('preview', {
      targets: config(),
      fetchImpl: async () => {
        calls++;
        throw error;
      },
    });
    assert.equal(calls, 2);
    assert.deepEqual(
      summary.checks.map((r) => r.code),
      ['request_failed', 'request_failed'],
    );
    assert.ok(!JSON.stringify(summary).includes('DO_NOT_LOG'));
    assert.ok(!JSON.stringify(summary).includes('192.0.2.1'));
  }
});

for (const [
  label,
  response,
] of /** @type {Array<[string, () => Response]>} */ ([
  [
    'wrong content type',
    () =>
      new Response('{}', {
        headers: { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' },
      }),
  ],
  [
    'deceptive content type',
    () =>
      new Response('{}', {
        headers: {
          'Content-Type': 'fakeapplication/json',
          'Cache-Control': 'no-store',
        },
      }),
  ],
  [
    'cacheable response',
    () =>
      json(ready.feedback, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
        },
      }),
  ],
  [
    'broken JSON',
    () =>
      new Response('{secret=DO_NOT_LOG', {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }),
  ],
  ['oversized response', () => json({ value: 'DO_NOT_LOG'.repeat(1000) })],
])) {
  await test(`${label} is bounded and fails without response output`, async () => {
    const summary = await monitor('preview', {
      targets: config(),
      fetchImpl: async () => response(),
    });
    assert.deepEqual(
      summary.checks.map((r) => r.code),
      ['response_invalid', 'response_invalid'],
    );
    assert.ok(!JSON.stringify(summary).includes('DO_NOT_LOG'));
  });
}

await test('CLI rejects arbitrary endpoints and returns nonzero without leaking input', () => {
  const process = spawnSync(
    globalThis.process.execPath,
    [
      'ops/cleanup-health-monitor/monitor.mjs',
      'https://example.com/DO_NOT_LOG',
    ],
    { encoding: 'utf8' },
  );
  assert.equal(process.status, 1);
  assert.equal(process.stderr, '');
  assert.equal(
    JSON.parse(process.stdout).checks[0].code,
    'target_not_reviewed',
  );
  assert.ok(!process.stdout.includes('DO_NOT_LOG'));
});

await test('workflow is manual-only, pinned, read-only and credentialless', () => {
  const workflow = readFileSync(
    '.github/workflows/cleanup-health-monitor.yml',
    'utf8',
  );
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /default: self-test/);
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /persist-credentials: false/);
  assert.match(workflow, /github\.ref == 'refs\/heads\/gemunao'/);
  assert.doesNotMatch(
    workflow,
    /^\s*(schedule|push|pull_request|pull_request_target|repository_dispatch|environment):/m,
  );
  assert.doesNotMatch(
    workflow,
    /secrets\.|github\.token|write-all|contents: write|npm |pnpm |curl |wrangler /,
  );
  assert.equal([...workflow.matchAll(/uses: [^@]+@([a-f0-9]{40})/g)].length, 2);
});
