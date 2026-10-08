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
assert.ok(!config.d1_databases.some((db) => db.binding === 'DIAGNOSIS_DB'));
const localConfig = JSON.parse(read('wrangler.diagnosis-local.json'));
assert.equal(localConfig.vars.DIAGNOSIS_LOCAL_BETA, 'false');
const diagnosisFixture = localConfig.d1_databases.find((db) => db.binding === 'DIAGNOSIS_DB');
const siteFixture = localConfig.d1_databases.find((db) => db.binding === 'DB');
assert.equal(diagnosisFixture.migrations_dir, 'migrations/diagnosis');
assert.equal(siteFixture.migrations_dir, '.openai/drizzle');
assert.notEqual(diagnosisFixture.database_id, siteFixture.database_id);
for (const path of ['wrangler.diagnosis-cleanup-local.json', 'cloudflare/wrangler.diagnosis-cleanup.json']) {
  assert.deepEqual(JSON.parse(read(path)).d1_databases.map((db) => db.binding), ['DIAGNOSIS_DB']);
}
for (const path of ['lib/diagnosis/server.ts', 'cloudflare/diagnosis-cleanup.ts', 'cloudflare/worker-source.mjs']) {
  assert.ok(!read(path).includes('env.DB'), path + ' must not access the ordinary site DB');
}
assert.ok(!read('scripts/test-diagnosis-browser.sh').includes('d1 migrations apply gemnao-diagnosis-local '));
assert.match(read('cloudflare/diagnosis-cleanup.ts'), /from '\.\.\/lib\/diagnosis\/cleanup'/);
assert.ok(!read('lib/diagnosis/cleanup.ts').includes('import '));
assert.match(read('lib/diagnosis/server.ts'), /export \{ cleanupDiagnosis \} from '\.\/cleanup'/);
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

const cleanupBuild = await build({
  entryPoints: ['cloudflare/diagnosis-cleanup.ts'], outfile: '.wrangler/diagnosis-tests/cleanup-worker.mjs',
  bundle: true, format: 'esm', platform: 'neutral', metafile: true,
});
assert.deepEqual(Object.keys(cleanupBuild.metafile.inputs).sort(), ['cloudflare/diagnosis-cleanup.ts', 'lib/diagnosis/cleanup.ts']);
console.log('PASS: cleanup deploy bundle contains only the dedicated worker and dependency-free cleanup module');

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
let betaStorageTouched = false;
const betaStorage = { prepare() { betaStorageTouched = true; throw new Error('local beta cannot read diagnosis data'); } };
const betaEnv = { DIAGNOSIS_LOCAL_BETA: 'true', DIAGNOSIS_ENABLED: 'true', DIAGNOSIS_STORAGE_ENABLED: 'true', DIAGNOSIS_SHARING_ENABLED: 'true', DIAGNOSIS_METRICS_ENABLED: 'true', DB: betaStorage, DIAGNOSIS_DB: betaStorage };
for (const path of ['/diagnose', '/diagnose/privacy']) {
  const response = await worker.fetch(new Request('https://gemnao.test' + path), betaEnv, {});
  assert.equal(response.status, 200);
  assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
  assert.match(response.headers.get('Cache-Control'), /no-store/);
}
assert.equal((await worker.fetch(new Request('https://gemnao.test/diagnosis/' + 'a'.repeat(32)), betaEnv, {})).status, 503);
assert.equal(betaStorageTouched, false);
let ordinaryTouched = false;
const storageFlags = { DIAGNOSIS_ENABLED: 'true', DIAGNOSIS_STORAGE_ENABLED: 'true', DIAGNOSIS_SHARING_ENABLED: 'true', DIAGNOSIS_WRITES_ENABLED: 'true', DIAGNOSIS_METRICS_ENABLED: 'true' };
const ordinary = { prepare() { ordinaryTouched = true; throw new Error('ordinary site DB must never substitute'); } };
const sharedRequest = new Request('https://gemnao.test/diagnosis/' + 'a'.repeat(32));
assert.equal((await worker.fetch(sharedRequest, { ...storageFlags, DB: ordinary }, {})).status, 503);
assert.equal(ordinaryTouched, false);
let dedicatedTouched = false;
const dedicated = { prepare() { dedicatedTouched = true; return { bind() { return { async first() { return { expires_at: Date.now() + 60000, revoked_at: null }; } }; } }; } };
const sharedResponse = await worker.fetch(sharedRequest, { ...storageFlags, DIAGNOSIS_DB: dedicated, DB: ordinary }, {});
assert.equal(sharedResponse.status, 200);
assert.match(sharedResponse.headers.get('Cache-Control'), /no-store/);
assert.match(sharedResponse.headers.get('X-Robots-Tag'), /noindex/);
assert.equal(dedicatedTouched, true);
assert.equal(ordinaryTouched, false);
console.log('PASS: shared-page worker requires dedicated DIAGNOSIS_DB and never falls back to ordinary DB');
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
