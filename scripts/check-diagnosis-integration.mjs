import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { build } from 'esbuild';
import { isEditorialSnapshotPath } from '../cloudflare/prerender-policy.mjs';
const read = (path) => readFileSync(path, 'utf8');
const productionMigrations = readdirSync('.openai/drizzle').filter((p) => p.endsWith('.sql'));
assert.ok(productionMigrations.includes('0004_step_result_reports.sql'));
assert.ok(!productionMigrations.some((p) => p.includes('diagnosis')));
assert.match(read('migrations/diagnosis/0001_diagnosis.sql'), /CREATE TABLE IF NOT EXISTS diagnosis_shared/);
const config = JSON.parse(read('wrangler.json'));
assert.ok(!Object.keys(config.vars || {}).some((k) => k.startsWith('DIAGNOSIS_') && k !== 'DIAGNOSIS_LOCAL_BETA'));
assert.deepEqual(config.env.preview.d1_databases, []);
assert.match(read('scripts/test-diagnosis-browser.sh'), /d1 execute gemnao-diagnosis-local --local[^\n]+--file migrations\/diagnosis\/0001_diagnosis.sql/);
for (const path of ['/diagnose', '/diagnosis/' + 'a'.repeat(32), '/diagnosis/manage/' + 'a'.repeat(32), '/api/diagnosis/config']) {
  assert.equal(isEditorialSnapshotPath(path), false, path);
}
for (const path of ['ops/d1/control.mjs', '.github/workflows/d1-control.yml']) {
  assert.ok(!read(path).includes('0001_diagnosis'));
}
assert.match(read('components/diagnosis-cta.tsx'), /<a href="\/diagnose">/);
assert.match(read('app/layout.tsx'), /location.origin !==/);
assert.match(read('cloudflare/worker-source.mjs'), /env\.DIAGNOSIS_STORAGE_ENABLED !== 'true'/);
console.log('PASS: staged schema, production and preview gates, live-only private routes, native navigation and unchanged control scope');
assert.match(read('lib/diagnosis/server.ts'), /env\.DIAGNOSIS_ENABLED === 'true'/);
assert.match(read('cloudflare/worker-source.mjs'), /env\.DIAGNOSIS_ENABLED !== 'true'/);
assert.match(read('components/diagnosis-cta.tsx'), /NEXT_PUBLIC_DIAGNOSIS_ENABLED !== 'true' && process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA !== 'true'\) return/);
assert.match(read('components/diagnosis-cta.tsx'), /setVisible\(d.enabled === true\)/);
assert.match(read('components/diagnosis-wizard.tsx'), /enabled: false/);
assert.match(read('components/diagnosis-wizard.tsx'), /NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA === 'true'\) && next.enabled === true/);
assert.match(read('app/diagnose/page.tsx'), /NEXT_PUBLIC_DIAGNOSIS_ENABLED !== 'true' && process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA !== 'true'\) return/);
assert.match(read('app/sitemap.ts'), /NEXT_PUBLIC_DIAGNOSIS_ENABLED === 'true' \? \[\{ path: '\/diagnose'/);

await build({
  entryPoints: ['cloudflare/worker-source.mjs'], outfile: '.wrangler/diagnosis-tests/worker-integration.mjs',
  bundle: true, format: 'esm', platform: 'node', plugins: [{
    name: 'synthetic-renderer', setup(build) {
      build.onResolve({ filter: /dist\/server\/index\.js$/ }, () => ({ path: 'synthetic', namespace: 'test-renderer' }));
      build.onLoad({ filter: /.*/, namespace: 'test-renderer' }, () => ({ contents: `export default { fetch() { return new Response('synthetic HTML', {headers:{'Content-Type':'text/html'}}); } };` }));
    },
  }],
});
const { default: worker } = await import('../.wrangler/diagnosis-tests/worker-integration.mjs');
for (const flag of [undefined, 'false', '', 'TRUE']) {
  for (const path of ['/diagnose', '/diagnose/privacy', '/diagnosis/' + 'a'.repeat(32)]) {
    const response = await worker.fetch(new Request('https://gemnao.test' + path), {
      DIAGNOSIS_ENABLED: flag,
      DB: { prepare() { throw new Error('default-off page must not read D1'); } },
      ASSETS: { fetch() { throw new Error('private page must not use snapshot'); } },
    }, {});
    assert.equal(response.status, 503, `${path} flag=${flag}`);
    assert.match(response.headers.get('Cache-Control'), /no-store/);
  }
}
console.log('PASS: actual worker rejects dormant diagnosis routes without reading DB or public snapshots');
const betaEnv = { DIAGNOSIS_LOCAL_BETA: 'true', DB: { prepare() { throw new Error('local beta cannot read diagnosis data'); } } };
for (const path of ['/diagnose', '/diagnose/privacy']) {
  const response = await worker.fetch(new Request('https://gemnao.test' + path), betaEnv, {});
  assert.equal(response.status, 200);
  assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
  assert.match(response.headers.get('Cache-Control'), /no-store/);
}
assert.equal((await worker.fetch(new Request('https://gemnao.test/diagnosis/' + 'a'.repeat(32)), betaEnv, {})).status, 503);
assert.equal(config.vars.DIAGNOSIS_LOCAL_BETA, 'true');
assert.equal(config.env.preview.vars.DIAGNOSIS_LOCAL_BETA, 'true');
assert.match(read('package.json'), /NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA=true/);
assert.match(read('components/diagnosis-wizard.tsx'), /NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA !== 'true' && <DiagnosisShare/);
assert.match(read('app/diagnose/page.tsx'), /robots: \{ index: false, follow: false \}/);
console.log('PASS: local beta renders noindex/private pages without DB and cannot serve shared results');
await build({ entryPoints: ['app/sitemap.ts'], outfile: '.wrangler/diagnosis-tests/sitemap-beta.mjs', bundle: true, format: 'esm', platform: 'node', packages: 'external' });
const { default: sitemap } = await import('../.wrangler/diagnosis-tests/sitemap-beta.mjs');
const oldBeta = process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA;
const oldEnabled = process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED;
try {
  for (const enabled of ['true', 'false']) {
    process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA = 'true';
    process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED = enabled;
    assert.ok(!sitemap().some((entry) => entry.url.endsWith('/diagnose')));
  }
} finally {
  if (oldBeta === undefined) delete process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA;
  else process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA = oldBeta;
  if (oldEnabled === undefined) delete process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED;
  else process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED = oldEnabled;
}
assert.match(read('package.json'), /NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA=true node scripts\/prepare-pages.mjs/);
console.log('PASS: conflicting old build flag cannot add local beta to sitemap, Pages preparation receives beta flag');
