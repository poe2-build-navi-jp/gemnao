import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { blockedPreviewPath, wrapPreviewApplication } from '../../cloudflare/worker-preview-policy.mjs';
import { previewAssetAllowed } from '../../scripts/prepare-worker-preview.mjs';

const origin = 'https://gemnao-diagnostic-qa.synthetic-test.workers.dev';
void test('QA wrapper requires exact build-pinned and matching runtime origin', async () => {
  let calls = 0;
  const app = { fetch() { calls++; return new Response('OK'); } };
  const worker = wrapPreviewApplication(app, origin);
  for (const other of ['https://gemnao.pages.dev', 'https://other.synthetic-test.workers.dev', 'https://gemnao-diagnostic-qa.other.workers.dev', 'http://gemnao-diagnostic-qa.synthetic-test.workers.dev']) {
    assert.equal((await worker.fetch(new Request(other + '/diagnose'), { QA_PREVIEW_ORIGIN: origin }, {})).status, 503);
  }
  for (const runtime of ['', undefined, origin + '/']) assert.equal((await worker.fetch(new Request(origin + '/diagnose'), { QA_PREVIEW_ORIGIN: runtime }, {})).status, 503);
  assert.equal((await wrapPreviewApplication(app, '').fetch(new Request(origin), {}, {})).status, 503);
  assert.equal((await worker.fetch(new Request(origin), { QA_PREVIEW_ORIGIN: origin, DB: {} }, {})).status, 503);
  assert.equal(calls, 0);
});

void test('all QA responses and failures are private, noindex and block third-party requests', async () => {
  for (const app of [{ fetch() { return new Response('OK', { headers: { 'Cache-Control': 'public, max-age=3600' } }); } }, { fetch() { throw new Error('secret error'); } }]) {
    const worker = wrapPreviewApplication(app, origin);
    const response = await worker.fetch(new Request(origin + '/diagnose'), { QA_PREVIEW_ORIGIN: origin }, {});
    assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow, noarchive');
    assert.equal(response.headers.get('Referrer-Policy'), 'no-referrer');
    assert.match(response.headers.get('Content-Security-Policy'), /connect-src 'self'/);
    assert.ok(!(await response.text()).includes('secret error'));
  }
});

void test('source/internal paths, aliases and ordinary vote APIs never reach the application', async () => {
  const worker = wrapPreviewApplication({ fetch() { throw new Error('must not call'); } }, origin);
  for (const target of ['/_worker.js', '/_worker.bundle.js', '/%5fworker.bundle.js', '/server/index.js', '/cloudflare/worker-preview.mjs', '/.dev.vars', '/x.map', '/wrangler.json', '/package.json', '/_headers', '/vinext-client-entry-manifest.json', '/_gemnao-snapshots/a.html', '/ops/feedback-preview/live.mjs', '/api/feedback', '/%61pi/feedback', '//api/feedback', '/api/game-requests', '/api/admin/game-requests', '/status', '/contact', '/admin', '/sitemap.xml']) {
    assert.equal((await worker.fetch(new Request(origin + target), { QA_PREVIEW_ORIGIN: origin }, {})).status, 404, target);
  }
  assert.equal(blockedPreviewPath('/%252e%252e/private'), true);
  const robots = await worker.fetch(new Request(origin + '/robots.txt'), { QA_PREVIEW_ORIGIN: origin }, {});
  assert.equal(await robots.text(), 'User-agent: *\nDisallow: /\n');
});

void test('asset allowlist excludes every known server/config/sourcemap input', () => {
  for (const file of ['_worker.js', '_worker.bundle.js', 'server/index.js', '.dev.vars', '.vite/manifest.json', '_next/static/a.js.map', '_next/static/server.ts', 'images/a.json', 'wrangler.json', '_headers', 'node_modules/a.js', '_gemnao-snapshots/../secret.html', 'images/.secret.png']) assert.equal(previewAssetAllowed(file), false, file);
  for (const file of ['_next/static/chunks/a.js', '_next/static/assets/a.css', 'images/og/a.png', '_gemnao-snapshots/abc-123.snapshot', 'favicon.svg']) assert.equal(previewAssetAllowed(file), true, file);
});

void test('separate Worker config has only approved test D1s and all intake off', () => {
  const config = JSON.parse(readFileSync('wrangler.worker-preview.json', 'utf8'));
  assert.equal(config.name, 'gemnao-diagnostic-qa');
  assert.equal(config.account_id, '6a09a32cba1288cccce5912015086a35');
  assert.deepEqual(config.d1_databases, [
    { binding: 'DIAGNOSIS_DB', database_name: 'gemnao-diagnosis-preview-20261007', database_id: '72c728f5-1656-4e26-bc11-7c508ae155c3' },
    { binding: 'FEEDBACK_DB', database_name: 'gemnao-diagnostic-feedback-preview-20261007', database_id: '3a714aee-e602-4590-afd0-3c2ddd9aea8f' },
  ]);
  for (const [key, value] of Object.entries(config.vars)) if (key.endsWith('_ENABLED')) assert.equal(value, 'false', key);
  assert.equal(config.vars.DIAGNOSIS_LOCAL_BETA, 'true');
  assert.equal(config.vars.QA_PREVIEW_ORIGIN, 'https://gemnao-diagnostic-qa.soykururu143.workers.dev');
  assert.equal(config.vars.DIAGNOSIS_PREVIEW_ORIGIN, 'https://gemnao-diagnostic-qa.soykururu143.workers.dev');
  assert.equal(config.vars.FEEDBACK_PREVIEW_ORIGIN, 'https://gemnao-diagnostic-qa.soykururu143.workers.dev');
  assert.equal(config.assets.run_worker_first, true);
  assert.equal(config.assets.html_handling, 'none');
  assert.equal(config.assets.not_found_handling, 'none');
  assert.equal(config.preview_urls, false);
  for (const key of ['env', 'routes', 'triggers', 'kv_namespaces', 'r2_buckets', 'services']) assert.equal(config[key], undefined);
  assert.deepEqual(JSON.parse(readFileSync('wrangler.json', 'utf8')).env.preview.d1_databases, []);
});
