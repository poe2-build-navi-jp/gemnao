// Local Miniflare/Chromium only. Synthetic data, no provider/external fetches.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';
import { prepareWorkerPreview } from './prepare-worker-preview.mjs';
import { verifyWorkerPreviewArtifact } from './verify-worker-preview-artifact.mjs';
const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))('miniflare');
const { chromium } = await import('@playwright/test');
const config = JSON.parse(await readFile('wrangler.worker-preview.json', 'utf8'));
const syntheticEnabled = process.argv.includes('--synthetic-enabled');
const localEnabled = process.argv.includes('--local-enabled');
assert.ok(!(syntheticEnabled && localEnabled), 'Choose one local mode');
const enabledLocal = syntheticEnabled || localEnabled;
const origin = localEnabled ? config.vars.QA_PREVIEW_ORIGIN : 'https://gemnao-diagnostic-qa.synthetic-test.workers.dev';
if (localEnabled) {
  assert.equal(origin, 'https://gemnao-diagnostic-qa.soykururu143.workers.dev');
  assert.equal(config.vars.DIAGNOSIS_PREVIEW_ORIGIN, origin);
  assert.equal(config.vars.FEEDBACK_PREVIEW_ORIGIN, origin);
  assert.ok((await readFile('lib/preview/worker-origin.ts', 'utf8')).includes(`VERIFIED_WORKER_PREVIEW_ORIGIN: string = '${origin}';`));
  // The provider IDs are never supplied to Miniflare. Only two fresh, in-memory
  // named D1 instances below receive this test's bounded synthetic records.
}
if (syntheticEnabled) {
  assert.equal(config.account_id, '00000000000000000000000000000000', 'Enabled QA requires the generated local-only fixture');
  assert.equal(config.workers_dev, false);
  assert.match(await readFile('lib/preview/worker-origin.ts', 'utf8'), /VERIFIED_WORKER_PREVIEW_ORIGIN: string = 'https:\/\/gemnao-diagnostic-qa\.synthetic-test\.workers\.dev';/);
}
await mkdir('.wrangler/worker-preview-tests', { recursive: true });
const manifest = await prepareWorkerPreview();
await verifyWorkerPreviewArtifact();
if (!enabledLocal) {
  await build({ entryPoints: ['cloudflare/worker-preview.mjs'], outfile: '.wrangler/worker-preview-tests/closed-worker.mjs', bundle: true, format: 'esm', platform: 'node', external: ['cloudflare:workers'] });
  const closed = new Miniflare({ cf: false, outboundService: () => { throw new Error('External fetch forbidden'); }, modules: [{ type: 'ESModule', path: '.wrangler/worker-preview-tests/closed-worker.mjs' }], compatibilityDate: config.compatibility_date, compatibilityFlags: config.compatibility_flags, bindings: config.vars });
  try {
    for (const pathname of ['/diagnose', '/api/diagnosis/config', '/api/diagnostic-feedback']) assert.equal((await closed.dispatchFetch(origin + pathname)).status, 503);
    console.log('PASS: actual candidate rejects an unapproved origin without bindings or database access.');
  } finally { await closed.dispose(); }
}
// Only the outer routing policy receives a synthetic test pin. The actual built
// application and its client bundles retain their unmodified fail-closed pin.
await build({
  ...(enabledLocal ? { entryPoints: ['cloudflare/worker-preview.mjs'] } : {
    stdin: { contents: `import application from './dist/client/_worker.bundle.js'; import {wrapPreviewApplication} from './cloudflare/worker-preview-policy.mjs'; export default wrapPreviewApplication(application, ${JSON.stringify(origin)});`, resolveDir: process.cwd() },
  }),
  outfile: '.wrangler/worker-preview-tests/worker.mjs', bundle: true, format: 'esm', platform: 'node', external: ['cloudflare:workers'],
});
const bindings = { ...config.vars, QA_PREVIEW_ORIGIN: origin };
if (enabledLocal) Object.assign(bindings, {
  DIAGNOSIS_ENABLED: 'true', DIAGNOSIS_STORAGE_ENABLED: 'true', DIAGNOSIS_SHARING_ENABLED: 'true', DIAGNOSIS_WRITES_ENABLED: 'true', DIAGNOSIS_METRICS_ENABLED: 'true', DIAGNOSIS_PREVIEW_SHARING_ENABLED: 'true', DIAGNOSIS_PREVIEW_ORIGIN: origin,
  FEEDBACK_ENABLED: 'true', FEEDBACK_PREVIEW_ENABLED: 'true', FEEDBACK_PREVIEW_ORIGIN: origin,
});
const options = {
  cf: false,
  outboundService: () => { throw new Error('External fetch forbidden in QA'); },
  modules: [{ type: 'ESModule', path: '.wrangler/worker-preview-tests/worker.mjs' }],
  compatibilityDate: config.compatibility_date, compatibilityFlags: config.compatibility_flags,
  d1Databases: ['DIAGNOSIS_DB', 'FEEDBACK_DB'],
  bindings,
  assets: { directory: path.resolve(config.assets.directory), binding: 'ASSETS', routerConfig: { has_user_worker: true, invoke_user_worker_ahead_of_assets: true }, assetConfig: { html_handling: 'none', not_found_handling: 'none' } },
};
const mf = new Miniflare(options);
let browser;
try {
  for (const [name, file] of [['DIAGNOSIS_DB', 'migrations/diagnosis/0001_diagnosis.sql'], ['FEEDBACK_DB', 'migrations/diagnostic-feedback/0001.sql']]) {
    const db = await mf.getD1Database(name);
    await db.exec((await readFile(file, 'utf8')).replace(/--[^\n]*/g, '').replace(/\n/g, ' '));
  }
  const request = (pathname, options) => mf.dispatchFetch(origin + pathname, options);
  assert.equal((await request('/', { redirect: 'manual' })).status, 302);
  for (const pathname of ['/diagnose', '/diagnose/privacy', '/diagnostic-feedback', '/favicon.svg']) {
    const response = await request(pathname);
    assert.equal(response.status, 200, pathname);
    assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
    assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
  }
  for (const pathname of ['/_worker.js', '/_worker.bundle.js', '/server/index.js', '/wrangler.worker-preview.json', '/_next/static/chunks/secret.js.map', '/api/feedback', '/%61pi/feedback', '//api/feedback', '/api/game-requests', '/api/admin/game-requests', '/api/automation/game-requests', '/status', '/contact', '/admin', '/sitemap.xml']) {
    for (const method of ['GET', 'POST']) assert.equal((await request(pathname, { method })).status, 404, `${method} ${pathname}`);
  }
  const snapshot = manifest.assets.find((entry) => entry.path.startsWith('_gemnao-snapshots/'));
  assert.ok(snapshot, 'Editorial snapshots were packaged for internal wrapper use');
  assert.equal((await request('/' + snapshot.path)).status, 404);
  const js = manifest.assets.find((entry) => entry.path.endsWith('.js'));
  const css = manifest.assets.find((entry) => entry.path.endsWith('.css'));
  for (const asset of [js, css]) {
    const response = await request('/' + asset.path);
    assert.equal(response.status, 200, asset.path);
    assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
  }
  assert.equal((await (await request('/api/diagnosis/config')).json()).sharing, false);
  assert.equal((await (await request('/api/diagnostic-feedback')).json()).enabled, false);
  assert.equal((await request('/api/diagnosis/session', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'X-Diagnosis-Request': '1' }, body: '{}' })).status, 503);
  assert.equal((await request('/api/diagnostic-feedback', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{}' })).status, 503);
  console.log('PASS: actual built application and local Workers assets router: private/noindex, source and ordinary APIs blocked, CSS/JS 200, intake off.');
  if (enabledLocal) {
    const clean = await build({ stdin: { contents: "export {default as feedback} from './cloudflare/diagnostic-feedback-cleanup'; export {cleanupDiagnosis as diagnosis} from './lib/diagnosis/cleanup'; export {RULE_VERSION} from './lib/diagnosis/model';", resolveDir: process.cwd(), loader: 'ts' }, bundle: true, write: false, format: 'esm', platform: 'node' });
    const cleanup = await import('data:text/javascript;base64,' + Buffer.from(clean.outputFiles[0].text).toString('base64'));
    const diagnosis = await mf.getD1Database('DIAGNOSIS_DB'), feedback = await mf.getD1Database('FEEDBACK_DB');
    await cleanup.diagnosis(diagnosis);
    await cleanup.feedback.scheduled({}, { FEEDBACK_DB: feedback });
    assert.deepEqual(await (await request('/api/diagnosis/config')).json(), { enabled: true, sharing: true, metrics: false, localOnly: false, previewSharing: true });
    assert.deepEqual(await (await request('/api/diagnostic-feedback')).json(), { enabled: true, canDelete: true });
    for (const target of ['https://gemnao.pages.dev', 'https://other.synthetic-test.workers.dev', 'https://gemnao-diagnostic-qa.other.workers.dev']) assert.equal((await mf.dispatchFetch(target + '/api/diagnosis/config')).status, 503);
    const send = (pathname, data, cookie = '', method = 'POST') => request(pathname, { method, headers: { Origin: origin, 'Content-Type': 'application/json', 'X-Diagnosis-Request': '1', 'CF-Connecting-IP': '192.0.2.42', ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(data) });
    const session = await send('/api/diagnosis/session', {});
    assert.equal(session.status, 200);
    const cookie = session.headers.get('Set-Cookie').split(';')[0];
    const snapshot = { answers: { symptom: 'not-launching', scope: 'game', observation: 'error', error: 'directx', change: 'none', launcher: 'steam', os: 'windows11', gpu: 'nvidia', ram: '32' }, tried: { verify: 'unchanged' }, results: { dx: 'tried' }, version: cleanup.RULE_VERSION };
    const created = await send('/api/diagnosis', { snapshot, requestId: 'c'.repeat(32) }, cookie);
    assert.equal(created.status, 201);
    const shared = await created.json();
    assert.equal((await request('/api/diagnosis/' + shared.id)).status, 200);
    const pageResponse = await request('/diagnosis/' + shared.id);
    assert.equal(pageResponse.status, 200);
    assert.match(pageResponse.headers.get('Cache-Control'), /private, no-store/);
    assert.equal((await send('/api/diagnosis/' + shared.id, {}, '', 'DELETE')).status, 403);
    assert.deepEqual(await (await send('/api/diagnosis/events', { event: 'start', step: 'none', action: 'none', status: 'none' })).json(), { ok: true, recorded: false });
    const key = 'b'.repeat(64), now = Math.floor(Date.now() / 1000);
    const report = { receipt_id: now.toString(16).padStart(8, '0') + createHash('sha256').update(key).digest('hex').slice(0, 24), delete_key: key, consent_version: 1, report: { schema_version: 1, game_id: 'monster-hunter-wilds', source: 'native-windows', symptom: 'launch-crash', tool_version: '0.4.0', rule_version: '0.4.0', actions: [{ action_id: 'wilds-steam-client-review', outcome: 'improved', evidence: 'self-report' }] } };
    assert.equal((await send('/api/diagnostic-feedback', { ...report, consent_version: undefined })).status, 400);
    assert.equal((await send('/api/diagnostic-feedback', report)).status, 201);
    assert.equal((await send('/api/diagnostic-feedback', report)).status, 200);
    assert.equal(await diagnosis.prepare("SELECT count(*) n FROM sqlite_master WHERE name='diagnostic_reports'").first('n'), 0);
    assert.equal(await feedback.prepare("SELECT count(*) n FROM sqlite_master WHERE name='diagnosis_shared'").first('n'), 0);
    await mf.setOptions({ ...options, bindings: { ...bindings, DIAGNOSIS_PREVIEW_SHARING_ENABLED: 'false', DIAGNOSIS_ENABLED: 'false', FEEDBACK_ENABLED: 'false', FEEDBACK_PREVIEW_ENABLED: 'false' } });
    assert.equal((await send('/api/diagnosis/session', {})).status, 503);
    assert.equal((await send('/api/diagnostic-feedback', report)).status, 503);
    assert.equal((await send('/api/diagnosis/' + shared.id, {}, cookie, 'DELETE')).status, 200);
    assert.equal((await send('/api/diagnostic-feedback', { receipt_id: report.receipt_id, delete_key: key }, '', 'DELETE')).status, 200);
    console.log('PASS: synthetic-only actual Worker happy path: missing cleanup refusal, fresh local cleanup, share create/read, unauthorized deletion refusal, explicit consent/report/retry, metrics forced off, schemas separated, deletion after intake shutdown.');
  }
  if (!process.argv.includes('--skip-browser')) {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const external = [], failedAssets = [], errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', async (route) => {
    const incoming = route.request();
    if (new URL(incoming.url()).origin !== origin) { external.push(incoming.url()); await route.abort(); return; }
    const response = await mf.dispatchFetch(incoming.url(), { method: incoming.method(), headers: await incoming.allHeaders(), ...(incoming.postDataBuffer() ? { body: incoming.postDataBuffer() } : {}) });
    if (/\.(?:css|js)(?:\?|$)/.test(incoming.url()) && response.status !== 200) failedAssets.push(incoming.url());
    await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
  });
  for (const pathname of ['/diagnose', '/diagnose/privacy', '/diagnostic-feedback', '/']) {
    await page.goto(origin + pathname, { waitUntil: 'networkidle' });
    await page.waitForTimeout(150);
    assert.ok((await page.locator('body').innerText()).length > 20, pathname);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(150);
  }
  assert.deepEqual(external, [], 'No GA/ad/third-party network requests');
  assert.deepEqual(failedAssets, [], 'Actual packaged CSS/JS served');
  assert.deepEqual(errors, [], 'No browser hydration/runtime errors');
  console.log('PASS: Chromium rendered QA pages without third-party requests or broken assets.');
  } else console.log('NOT RUN: Chromium browser check (--skip-browser).');
  const diagnosis = await mf.getD1Database('DIAGNOSIS_DB'), feedback = await mf.getD1Database('FEEDBACK_DB');
  assert.equal(await diagnosis.prepare('SELECT count(*) n FROM diagnosis_shared').first('n'), 0);
  assert.equal(await diagnosis.prepare('SELECT count(*) n FROM diagnosis_metrics').first('n'), 0);
  assert.equal(await feedback.prepare('SELECT count(*) n FROM diagnostic_reports').first('n'), 0);
  console.log('PASS: no retained shares/reports/metrics in isolated local test D1s. These checks do not verify a remote origin or scheduled cleanup.');
} finally {
  await browser?.close();
  await mf.dispose();
}
