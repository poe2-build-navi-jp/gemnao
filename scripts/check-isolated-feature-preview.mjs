// Local-only QA of the actual built Pages worker with two fresh Miniflare D1s.
// No remote provider calls, credentials, real IDs, or deployment.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
const require = createRequire(import.meta.url);
const { Miniflare } = createRequire(require.resolve('wrangler/package.json'))('miniflare');
const cleanupBuild = await build({ stdin: { contents: `export {default as feedback} from './cloudflare/diagnostic-feedback-cleanup'; export {cleanupDiagnosis as diagnosis} from './lib/diagnosis/cleanup'; export {RULE_VERSION} from './lib/diagnosis/model';`, resolveDir: process.cwd(), loader: 'ts' }, bundle: true, write: false, format: 'esm', platform: 'node' });
const cleanup = await import('data:text/javascript;base64,' + Buffer.from(cleanupBuild.outputFiles[0].text).toString('base64'));
const origin = 'https://qa-isolated.gemnao.pages.dev';
const bindings = {
  DIAGNOSIS_LOCAL_BETA: 'true', DIAGNOSIS_ENABLED: 'true', DIAGNOSIS_STORAGE_ENABLED: 'true',
  DIAGNOSIS_SHARING_ENABLED: 'true', DIAGNOSIS_WRITES_ENABLED: 'true', DIAGNOSIS_METRICS_ENABLED: 'true',
  DIAGNOSIS_PREVIEW_SHARING_ENABLED: 'true', DIAGNOSIS_PREVIEW_ORIGIN: origin,
  FEEDBACK_ENABLED: 'true', FEEDBACK_PREVIEW_ENABLED: 'true', FEEDBACK_PREVIEW_ORIGIN: origin,
};
const options = { cf: false, outboundService: () => { throw new Error('No outbound fetch is permitted in local QA'); }, modules: [{ type: 'ESModule', path: 'dist/client/_worker.bundle.js' }], compatibilityDate: '2026-05-22', compatibilityFlags: ['nodejs_compat'], d1Databases: ['DIAGNOSIS_DB', 'FEEDBACK_DB'], bindings };
const mf = new Miniflare(options);
const request = (path, body, { method = body === undefined ? 'GET' : 'POST', cookie = '', target = origin } = {}) => mf.dispatchFetch(target + path, {
  method, headers: { Origin: target, 'Content-Type': 'application/json', 'X-Diagnosis-Request': '1', 'CF-Connecting-IP': '192.0.2.42', ...(cookie ? { Cookie: cookie } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});
try {
  const diagnosis = await mf.getD1Database('DIAGNOSIS_DB');
  const feedback = await mf.getD1Database('FEEDBACK_DB');
  for (const [db, path] of [[diagnosis, 'migrations/diagnosis/0001_diagnosis.sql'], [feedback, 'migrations/diagnostic-feedback/0001.sql']]) await db.exec((await readFile(path, 'utf8')).replace(/--[^\n]*/g, '').replace(/\n/g, ' '));
  assert.equal((await (await request('/api/diagnosis/config')).json()).sharing, false);
  assert.equal((await (await request('/api/diagnostic-feedback')).json()).enabled, false);
  assert.equal((await request('/api/diagnosis/session', {})).status, 503);
  assert.equal((await request('/api/diagnostic-feedback', {})).status, 503);
  await cleanup.diagnosis(diagnosis);
  await cleanup.feedback.scheduled({}, { FEEDBACK_DB: feedback });
  assert.deepEqual(await (await request('/api/diagnosis/config')).json(), { enabled: true, sharing: true, metrics: false, localOnly: false, previewSharing: true });
  assert.deepEqual(await (await request('/api/diagnostic-feedback')).json(), { enabled: true, canDelete: true });
  for (const target of ['https://gemnao.pages.dev', 'https://other.gemnao.pages.dev']) {
    assert.deepEqual(await (await request('/api/diagnosis/config', undefined, { target })).json(), { enabled: true, sharing: false, metrics: false, localOnly: true });
    assert.equal((await request('/api/diagnosis/session', {}, { target })).status, 503);
    assert.deepEqual(await (await request('/api/diagnostic-feedback', undefined, { target })).json(), { enabled: false, canDelete: true });
    assert.equal((await request('/api/diagnostic-feedback', {}, { target })).status, 503);
  }
  const session = await request('/api/diagnosis/session', {});
  assert.equal(session.status, 200);
  const cookie = session.headers.get('Set-Cookie').split(';')[0];
  const snapshot = { answers: { symptom: 'not-launching', scope: 'game', observation: 'error', error: 'directx', change: 'none', launcher: 'steam', os: 'windows11', gpu: 'nvidia', ram: '32' }, tried: { verify: 'unchanged' }, results: { dx: 'tried' }, version: cleanup.RULE_VERSION };
  const created = await request('/api/diagnosis', { snapshot, requestId: 'c'.repeat(32) }, { cookie });
  assert.equal(created.status, 201);
  const shared = await created.json();
  assert.equal((await request('/api/diagnosis/' + shared.id)).status, 200);
  for (const path of ['/diagnose', '/diagnose/privacy', '/diagnosis/' + shared.id, '/diagnostic-feedback']) {
    const page = await request(path);
    assert.equal(page.status, 200, path);
    assert.match(page.headers.get('Cache-Control'), /no-store/);
    assert.match(page.headers.get('X-Robots-Tag'), /noindex/);
    assert.match(page.headers.get('Content-Security-Policy'), /connect-src 'self'/);
    assert.equal(page.headers.get('Referrer-Policy'), 'no-referrer');
  }
  assert.equal((await request('/diagnosis/' + shared.id, undefined, { target: 'https://gemnao.pages.dev' })).status, 503);
  assert.deepEqual(await (await request('/api/diagnosis/events', { event: 'start', step: 'none', action: 'none', status: 'none' })).json(), { ok: true, recorded: false });
  assert.equal(await diagnosis.prepare('SELECT count(*) n FROM diagnosis_metrics').first('n'), 0);
  const key = 'b'.repeat(64), now = Math.floor(Date.now() / 1000);
  const report = { receipt_id: now.toString(16).padStart(8, '0') + createHash('sha256').update(key).digest('hex').slice(0, 24), delete_key: key, consent_version: 1, report: { schema_version: 1, game_id: 'monster-hunter-wilds', source: 'native-windows', symptom: 'launch-crash', tool_version: '0.4.0', rule_version: '0.4.0', actions: [{ action_id: 'wilds-steam-client-review', outcome: 'improved', evidence: 'self-report' }] } };
  assert.equal((await request('/api/diagnostic-feedback', { ...report, consent_version: undefined })).status, 400);
  assert.equal((await request('/api/diagnostic-feedback', report)).status, 201);
  assert.equal((await request('/api/diagnostic-feedback', report)).status, 200);
  assert.equal(await diagnosis.prepare("SELECT count(*) n FROM sqlite_master WHERE name='diagnostic_reports'").first('n'), 0);
  assert.equal(await feedback.prepare("SELECT count(*) n FROM sqlite_master WHERE name='diagnosis_shared'").first('n'), 0);
  await mf.setOptions({ ...options, bindings: { ...bindings, DIAGNOSIS_PREVIEW_SHARING_ENABLED: 'false', DIAGNOSIS_ENABLED: 'false', FEEDBACK_ENABLED: 'false', FEEDBACK_PREVIEW_ENABLED: 'false' } });
  assert.equal((await request('/api/diagnosis/session', {})).status, 503);
  assert.equal((await request('/api/diagnostic-feedback', report)).status, 503);
  assert.equal((await request('/api/diagnosis/' + shared.id, {}, { method: 'DELETE', cookie })).status, 200);
  assert.equal((await request('/api/diagnostic-feedback', { receipt_id: report.receipt_id, delete_key: key }, { method: 'DELETE' })).status, 200);
  assert.equal(await (await mf.getD1Database('DIAGNOSIS_DB')).prepare('SELECT count(*) n FROM diagnosis_shared').first('n'), 0);
  assert.equal(await (await mf.getD1Database('FEEDBACK_DB')).prepare('SELECT count(*) n FROM diagnostic_reports').first('n'), 0);
  console.log('PASS: actual built Pages worker and two fresh isolated D1s: cleanup gate, exact-preview-only intake, consented submission, sharing, private pages, metrics off, no mixed schema, deletion after shutdown');
} finally { await mf.dispose(); }
