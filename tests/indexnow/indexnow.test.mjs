import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  SITE,
  ENDPOINT,
  KEY_FILE,
  articleUrl,
  inspectArticle,
  diffSnapshots,
  validatePlan,
} from '../../scripts/indexnow-content.mjs';
import { runIndexNow } from '../../scripts/indexnow-submit.mjs';

const head = 'b'.repeat(40),
  base = 'a'.repeat(40);
const url = SITE + '/games/valorant/van9003';
const key = KEY_FILE.slice(0, -4);
function html(target = url, body = 'Read the firmware status.', extra = '') {
  return `<html><head><title>Launch error</title><meta name="description" content="Check the status first."><link rel="canonical" href="${target}">${extra}</head><body><main><header class="site-header">Navigation</header><header class="article-hero"><h1>Launch error</h1></header><p>${body}</p><a href="/guide/tpm-secure-boot">Next check</a><footer class="site-footer">Common footer</footer></main><script>hydrate('bundle-v1')</script></body></html>`;
}
function plan(doc = html(), target = url) {
  return {
    version: 1,
    origin: SITE,
    baseCommit: base,
    headCommit: head,
    urls: [
      {
        url: target,
        change: 'added',
        beforeHash: null,
        afterHash: inspectArticle(doc, target).hash,
      },
    ],
  };
}
function check(overrides = {}) {
  return {
    id: 2,
    name: 'Cloudflare Pages',
    app: { id: 85455, slug: 'cloudflare-workers-and-pages' },
    head_sha: head,
    status: 'completed',
    conclusion: 'success',
    completed_at: '2026-10-13T10:08:25Z',
    details_url:
      'https://dash.cloudflare.com/?to=/123abc/pages/view/gemnao/1234-abcd',
    output: { title: 'Deployed successfully' },
    ...overrides,
  };
}
function network({
  document = html(),
  pageHeaders = {},
  pageStatus = 200,
  keyBody = key,
  checks = [check()],
  branch = head,
  postStatuses = [200],
  postHeaders = {},
  onPost,
  onBranch,
} = {}) {
  const calls = [],
    posts = [];
  let branchReads = 0;
  const fetchFn = async (target, init = {}) => {
    calls.push({ target, method: init.method || 'GET' });
    assert.equal(init.redirect, 'manual');
    if (init.method === 'POST') {
      assert.equal(target, ENDPOINT, 'No alternate engine or Google WebSub');
      const body = JSON.parse(init.body);
      posts.push(body);
      assert.equal(body.host, new URL(SITE).host);
      assert.equal(body.key, key);
      assert.equal(body.keyLocation, SITE + '/' + KEY_FILE);
      if (onPost) await onPost(posts.length, body);
      const status =
        postStatuses[Math.min(posts.length - 1, postStatuses.length - 1)];
      if (status === 'timeout') throw new Error('socket closed after request');
      return new Response('', { status, headers: postHeaders });
    }
    if (target.endsWith('/branches/gemunao'))
      return Response.json({
        commit: { sha: onBranch ? onBranch(++branchReads) : branch },
      });
    if (target.includes('/check-runs?'))
      return Response.json({ check_runs: checks });
    if (target === SITE + '/' + KEY_FILE) return new Response(keyBody);
    if (target === url)
      return new Response(document, {
        status: pageStatus,
        headers: { 'content-type': 'text/html; charset=utf-8', ...pageHeaders },
      });
    throw new Error('Unexpected request ' + target);
  };
  return { fetchFn, calls, posts };
}
async function withState(fn) {
  const stateDir = await mkdtemp(join(tmpdir(), 'gemnao-indexnow-test-'));
  try {
    await fn(stateDir);
  } finally {
    await rm(stateDir, { recursive: true, force: true });
  }
}
const send = (net, stateDir, extra = {}) =>
  runIndexNow({
    plan: plan(),
    mode: 'send',
    key,
    stateDir,
    fetchFn: net.fetchFn,
    sleep: async () => {},
    ...extra,
  });

await test('default dry-run is offline, deduplicates explicit URLs and CLI rejects the old date mode', async () => {
  const p = plan();
  p.urls.push({ ...p.urls[0] });
  const result = await runIndexNow({
    plan: p,
    fetchFn: () => {
      throw new Error('Dry-run used network');
    },
  });
  assert.equal(result.count, 1);
  assert.equal(result.posts, 0);
  const cli = spawnSync(process.execPath, ['scripts/ping-index.mjs', '2'], {
    encoding: 'utf8',
  });
  assert.equal(cli.status, 1);
  assert.match(cli.stderr, /Unknown argument/);
});

await test('preview, diagnosis, hubs, query, fragments, credentials, normalization and foreign origins are excluded', () => {
  for (const target of [
    SITE + '/',
    SITE + '/games/valorant',
    SITE + '/diagnose/shared',
    SITE + '/api/feedback',
    SITE + '/tools/windows-diagnosis',
    url + '?preview=1',
    url + '#step',
    url.replace('gemnao.pages.dev', 'preview.gemnao.pages.dev'),
    url.replace('https://', 'http://'),
    url.replace('https://', 'https://user@'),
    url.replace('/van9003', '/a/../van9003'),
    url + '/',
    url.replace('van9003', '%76an9003'),
  ])
    assert.throws(() => articleUrl(target));
  assert.equal(
    articleUrl(SITE + '/zh/games/valorant/van9003'),
    SITE + '/zh/games/valorant/van9003',
  );
});

await test('plans reject unchanged hashes, conflicting duplicates, unpinned commits and oversize batches', () => {
  const p = plan();
  assert.throws(() => validatePlan({ ...p, headCommit: 'main' }));
  assert.throws(() =>
    validatePlan({
      ...p,
      urls: [
        { ...p.urls[0], change: 'updated', beforeHash: p.urls[0].afterHash },
      ],
    }),
  );
  assert.throws(() =>
    validatePlan({
      ...p,
      urls: [p.urls[0], { ...p.urls[0], afterHash: '0'.repeat(64) }],
    }),
  );
  assert.throws(() =>
    validatePlan({
      ...p,
      urls: Array.from({ length: 10001 }, (_, i) => ({
        ...p.urls[0],
        url: SITE + '/guide/article-' + i,
      })),
    }),
  );
});

await test('article diff ignores deployment noise and common navigation while preserving article headers and text/link edits', () => {
  const first = html();
  const noisy = first
    .replace('Navigation', 'New global navigation')
    .replace('Common footer', 'New footer')
    .replace('bundle-v1', 'bundle-v2')
    .replace('article-hero', 'article-hero new-css')
    .replace(
      '</head>',
      '<script src="/bundle-v2.js"></script><meta name="msvalidate.01" content="public-value"></head>',
    );
  assert.equal(
    inspectArticle(first, url).hash,
    inspectArticle(noisy, url).hash,
  );
  for (const changed of [
    first.replace(
      'Read the firmware status.',
      'Record the firmware status first.',
    ),
    first.replace('/guide/tpm-secure-boot', '/guide/windows-11-required'),
    first.replace('<title>Launch error', '<title>VAN9003 launch error'),
    first.replace('Check the status first.', 'Record the exact error.'),
    first.replace('<h1>Launch error', '<h1>Check launch error'),
  ])
    assert.notEqual(
      inspectArticle(first, url).hash,
      inspectArticle(changed, url).hash,
    );
  const old = {
    version: 1,
    origin: SITE,
    commit: base,
    articles: { [url]: inspectArticle(first, url) },
  };
  assert.equal(
    diffSnapshots(old, {
      ...old,
      commit: head,
      articles: { [url]: inspectArticle(noisy, url) },
    }).urls.length,
    0,
  );
  const nextUrl = SITE + '/games/valorant/van9001';
  const changed = diffSnapshots(old, {
    ...old,
    commit: head,
    articles: {
      [url]: inspectArticle(html(url, 'New step'), url),
      [nextUrl]: inspectArticle(html(nextUrl), nextUrl),
    },
  });
  assert.deepEqual(changed.urls.map((e) => e.change).sort(), [
    'added',
    'updated',
  ]);
});

for (const [label, document, headers] of [
  ['canonical mismatch', html(SITE + '/games/valorant/van9001'), {}],
  [
    'duplicate canonical',
    html(url, undefined, `<link rel="canonical" href="${url}">`),
    {},
  ],
  [
    'robots noindex',
    html(url, undefined, '<meta name="robots" content="noindex,follow">'),
    {},
  ],
  [
    'bingbot none',
    html(url, undefined, '<meta name="bingbot" content="none">'),
    {},
  ],
  ['X-Robots-Tag', html(), { 'x-robots-tag': 'bingbot: noindex' }],
  ['incomplete HTML', html().replace('</html>', ''), {}],
  ['stale content', html(url, 'An older article'), {}],
])
  await test(`${typeof label === 'string' ? label : 'invalid fixture'} prevents every POST`, () =>
    withState(async (stateDir) => {
      const net = network({ document, pageHeaders: headers });
      await assert.rejects(send(net, stateDir));
      assert.equal(net.posts.length, 0);
    }));

for (const pageStatus of [301, 403, 404, 500])
  await test(`article HTTP ${pageStatus} is never followed or submitted`, () =>
    withState(async (stateDir) => {
      const net = network({ pageStatus });
      await assert.rejects(send(net, stateDir));
      assert.equal(net.posts.length, 0);
    }));

await test('key mismatch, non-HTML response and unverified deployment prevent submission', () =>
  withState(async (stateDir) => {
    for (const options of [
      { keyBody: 'wrong' },
      { pageHeaders: { 'content-type': 'application/json' } },
      { branch: base },
      { checks: [check({ status: 'in_progress', conclusion: null })] },
      { checks: [check({ head_sha: base })] },
      { checks: [check({ app: { id: 1, slug: 'fake' } })] },
      {
        checks: [
          check({
            details_url:
              'https://dash.cloudflare.com/?to=/123abc/pages/view/another-project/1234-abcd',
          }),
        ],
      },
      { checks: [check(), check({ id: 3, conclusion: 'failure' })] },
    ]) {
      const net = network(options);
      await assert.rejects(send(net, stateDir));
      assert.equal(net.posts.length, 0);
    }
  }));

await test('branch movement during preflight stops before POST', () =>
  withState(async (stateDir) => {
    const net = network({ onBranch: (n) => (n === 1 ? head : base) });
    await assert.rejects(send(net, stateDir));
    assert.equal(net.posts.length, 0);
  }));

await test('verify performs only GET and does not need a receipt directory', async () => {
  const net = network();
  const result = await runIndexNow({
    plan: plan(),
    mode: 'verify',
    key,
    fetchFn: net.fetchFn,
  });
  assert.equal(result.posts, 0);
  assert.ok(net.calls.length > 0);
  assert.ok(net.calls.every((c) => c.method === 'GET'));
});

for (const [status, expected] of [
  [200, 'accepted'],
  [202, 'key_validation_pending'],
])
  await test(`${status} receipt is durable and cannot be reported as indexed or resent`, () =>
    withState(async (stateDir) => {
      const net = network({
        postStatuses: [status],
        onPost: async () => {
          const state = JSON.parse(
            await readFile(join(stateDir, 'receipts.json'), 'utf8'),
          );
          assert.equal(Object.values(state.entries)[0].status, 'in_flight');
        },
      });
      const p = plan();
      p.urls.push({ ...p.urls[0] });
      const first = await send(net, stateDir, { plan: p });
      assert.equal(first.status, expected);
      assert.equal(first.indexingConfirmed, false);
      assert.equal(net.posts.length, 1);
      assert.equal(net.posts[0].urlList.length, 1);
      const receipt = await readFile(join(stateDir, 'receipts.json'), 'utf8');
      assert.ok(!receipt.includes(key));
      const second = await send(net, stateDir, {
        plan: { ...p, headCommit: 'c'.repeat(40) },
      });
      assert.equal(second.status, 'already_received');
      assert.equal(net.posts.length, 1);
    }));

await test('429 retries are bounded across reruns and obey Retry-After', () =>
  withState(async (stateDir) => {
    const waits = [],
      net = network({
        postStatuses: [429],
        postHeaders: { 'retry-after': '2' },
      });
    await assert.rejects(
      send(net, stateDir, {
        sleep: async (ms) => {
          waits.push(ms);
        },
      }),
      /stopped after 3/,
    );
    assert.equal(net.posts.length, 3);
    assert.deepEqual(waits, [2000, 2000]);
    await assert.rejects(send(net, stateDir), /Receipt blocks/);
    assert.equal(net.posts.length, 3);
  }));

await test('long Retry-After defers without sleeping or sending early, including a new invocation', () =>
  withState(async (stateDir) => {
    const net = network({
        postStatuses: [429],
        postHeaders: { 'retry-after': '120' },
      }),
      start = Date.now();
    await assert.rejects(
      send(net, stateDir, {
        now: () => start,
        sleep: async () => {
          throw new Error('Must defer');
        },
      }),
    );
    const state = JSON.parse(
      await readFile(join(stateDir, 'receipts.json'), 'utf8'),
    );
    assert.equal(Object.values(state.entries)[0].nextAttemptAt, start + 120000);
    await assert.rejects(
      send(net, stateDir, { now: () => start + 119999 }),
      /Receipt blocks/,
    );
    assert.equal(net.posts.length, 1);
  }));

await test('explicit 503 may retry once and then record success', () =>
  withState(async (stateDir) => {
    const net = network({ postStatuses: [503, 200] });
    const result = await send(net, stateDir);
    assert.equal(result.status, 'accepted');
    assert.equal(net.posts.length, 2);
  }));

for (const status of [400, 403, 422])
  await test(`${status} is not retried`, () =>
    withState(async (stateDir) => {
      const net = network({ postStatuses: [status] });
      await assert.rejects(send(net, stateDir));
      await assert.rejects(send(net, stateDir));
      assert.equal(net.posts.length, 1);
    }));

await test('lost response is uncertain and prevents a repeat even with another content version', () =>
  withState(async (stateDir) => {
    const net = network({ postStatuses: ['timeout'] });
    await assert.rejects(send(net, stateDir), /response unknown/);
    await assert.rejects(send(net, stateDir), /Receipt blocks/);
    await assert.rejects(
      send(net, stateDir, { plan: plan(html(url, 'New content')) }),
      /Uncertain prior/,
    );
    assert.equal(net.posts.length, 1);
  }));

await test('crash lock and invalid receipt state stop before any network request', () =>
  withState(async (stateDir) => {
    const net = network();
    const lock = join(stateDir, 'submission.lock');
    await writeFile(lock, '');
    await assert.rejects(send(net, stateDir), /EEXIST/);
    assert.equal(net.calls.length, 0);
    await rm(lock);
    await writeFile(join(stateDir, 'receipts.json'), '{bad json');
    await assert.rejects(send(net, stateDir));
    assert.equal(net.calls.length, 0);
    await writeFile(
      join(stateDir, 'receipts.json'),
      JSON.stringify({ version: 1, origin: SITE, entries: [], events: [] }),
    );
    await assert.rejects(send(net, stateDir), /Invalid receipt state/);
    assert.equal(net.calls.length, 0);
  }));

await test('a changed article version cannot be submitted within five minutes of acceptance', () =>
  withState(async (stateDir) => {
    const net = network(),
      start = Date.now();
    await send(net, stateDir, { now: () => start });
    await assert.rejects(
      send(net, stateDir, {
        plan: plan(html(url, 'New content')),
        now: () => start + 299999,
      }),
      /five minutes/,
    );
    assert.equal(net.posts.length, 1);
  }));
