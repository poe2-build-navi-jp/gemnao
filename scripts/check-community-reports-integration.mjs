// Synthetic renderers and local source only; never connects to a live account.
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import { build } from 'esbuild';
import { isEditorialSnapshotPath } from '../cloudflare/prerender-policy.mjs';
import { TARGET, FLAGS } from '../ops/community-reports/closed-setup.mjs';
const out = '.wrangler/community-reports-review';
await mkdir(out, { recursive: true });
const config = JSON.parse(await readFile('wrangler.json', 'utf8'));
const baseline = JSON.parse(
  execFileSync('git', ['show', TARGET.base + ':wrangler.json'], {
    encoding: 'utf8',
  }),
);
for (const database of baseline.d1_databases)
  assert.deepEqual(
    config.d1_databases.find((binding) => binding.binding === database.binding),
    database,
  );
for (const [key, value] of Object.entries(baseline.vars))
  assert.equal(config.vars[key], value);
const reports = config.d1_databases.find(
  (binding) => binding.binding === 'REPORTS_DB',
);
if (reports) {
  assert.equal(reports.database_name, TARGET.database);
  assert.match(
    reports.database_id,
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
  );
  assert.ok(
    !config.d1_databases.some(
      (binding) =>
        binding.binding !== 'REPORTS_DB' &&
        binding.database_id === reports.database_id,
    ),
  );
  assert.ok(
    config.services?.some(
      (binding) =>
        binding.binding === 'REPORTS_GUARD' &&
        binding.service === TARGET.guard &&
        binding.entrypoint === 'ReportsGuardService',
    ),
  );
} else
  assert.ok(
    !config.services?.some((binding) => binding.binding === 'REPORTS_GUARD'),
  );
for (const flag of FLAGS)
  if (config.vars[flag] !== undefined)
    assert.ok(['true', 'false'].includes(config.vars[flag]));
assert.deepEqual(config.env.preview.d1_databases, []);
assert.ok(
  !(await readFile('lib/community-reports/service.ts', 'utf8')).includes(
    'env.DB',
  ),
);
await build({
  entryPoints: ['cloudflare/worker-source.mjs'],
  outfile: out + '/worker-integration.mjs',
  bundle: true,
  format: 'esm',
  platform: 'node',
  plugins: [
    {
      name: 'synthetic-renderer',
      setup(b) {
        b.onResolve({ filter: /dist\/server\/index\.js$/ }, () => ({
          path: 'synthetic',
          namespace: 'test-renderer',
        }));
        b.onLoad({ filter: /.*/, namespace: 'test-renderer' }, () => ({
          contents: `export default {fetch(){return new Response('<html lang="ja"><body>Synthetic renderer</body></html>',{headers:{'Content-Type':'text/html'}})}};`,
        }));
      },
    },
  ],
});
globalThis.HTMLRewriter = class {
  on() {
    return this;
  }
  transform(response) {
    return response;
  }
};
globalThis.caches = {
  get default() {
    throw Error('Private route attempted an edge cache read');
  },
};
const { default: worker } =
  await import('../.wrangler/community-reports-review/worker-integration.mjs');
const paths = [
  '/reports',
  '/en/reports',
  '/zh/reports',
  '/es/reports',
  '/admin/reports',
];
for (const path of paths) {
  assert.equal(isEditorialSnapshotPath(path), false);
  const response = await worker.fetch(
    new Request('https://gemnao.test' + path),
    {
      ASSETS: {
        fetch() {
          throw Error('Private route attempted static assets');
        },
      },
    },
    {
      waitUntil() {
        throw Error('Private route attempted cache write');
      },
    },
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
  assert.equal(response.headers.get('Referrer-Policy'), 'no-referrer');
  assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
  assert.match(
    response.headers.get('Content-Security-Policy'),
    /connect-src 'self'/,
  );
  assert.match(
    response.headers.get('Content-Security-Policy'),
    /frame-ancestors 'none'/,
  );
}
await build({
  stdin: {
    contents: `export * from './lib/analytics';export {exportMyGames,backupKeys} from './lib/my-games-backup';export {REPORT_OWNER_KEY,REPORT_DRAFT_KEY} from './lib/community-reports/local';`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  outfile: out + '/integration-data.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
});
const m =
  await import('../.wrangler/community-reports-review/integration-data.mjs');
const layout = await readFile('app/layout.tsx', 'utf8');
const begin = layout.indexOf('`(function(){if(location.origin');
assert.ok(begin > 0);
const end = layout.indexOf('`,', begin) + 1;
const bootstrap = vm.runInNewContext(layout.slice(begin, end), {
  analyticsOrigin: m.analyticsOrigin,
  googleAnalyticsId: 'G-SYNTHETIC-LOCAL',
});
for (const path of paths) {
  const context = {
    location: { origin: m.analyticsOrigin, pathname: path },
    window: {},
  };
  vm.runInNewContext(bootstrap, context);
  assert.equal(context.window.gtag, undefined);
  assert.equal(context.window.dataLayer, undefined);
  globalThis.location = context.location;
  let calls = 0;
  globalThis.window = {
    gtag() {
      calls++;
    },
  };
  assert.equal(m.canTrackAnalytics(), false);
  m.trackEvent('article_saved');
  assert.equal(calls, 0);
}
const control = {
  location: { origin: m.analyticsOrigin, pathname: '/games/apex' },
  window: {},
};
control.dataLayer = [];
control.window.dataLayer = control.dataLayer;
Object.defineProperty(control, 'gtag', {
  get() {
    return control.window.gtag;
  },
});
vm.runInNewContext(bootstrap, control);
assert.equal(control.dataLayer.length, 2);
assert.ok(!m.backupKeys.includes(m.REPORT_OWNER_KEY));
assert.ok(!m.backupKeys.includes(m.REPORT_DRAFT_KEY));
const values = new Map([
  [m.REPORT_OWNER_KEY, 'synthetic-private-owner-secret'],
  [m.REPORT_DRAFT_KEY, 'synthetic-private-draft'],
]);
const backup = m.exportMyGames({ getItem: (k) => values.get(k) || null });
assert.ok(!JSON.stringify(backup).includes('synthetic-private'));
console.log(
  'PASS: isolated report bindings/config, private worker bypass/cache/CSP, production-origin GA exclusion with editorial control, report credentials/drafts excluded from existing backup; synthetic local only.',
);
