import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { DiagnosisStorageNotice } from '../../components/diagnosis-storage-notice';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clientDiagnosisConfig, isDiagnosisConfig } from '../../lib/diagnosis/client-config';
import { isPagesPreviewOrigin } from '../../lib/preview/origin';
import { isWorkerPreviewOrigin, VERIFIED_WORKER_PREVIEW_ORIGIN } from '../../lib/preview/worker-origin';

void test('only the verified Worker origin is accepted by browser and shared validator', () => {
  assert.equal(VERIFIED_WORKER_PREVIEW_ORIGIN, 'https://gemnao-diagnostic-qa.soykururu143.workers.dev');
  assert.equal(isWorkerPreviewOrigin(VERIFIED_WORKER_PREVIEW_ORIGIN), true);
  assert.equal(clientDiagnosisConfig({ enabled: true, sharing: true, metrics: true, previewSharing: true }, VERIFIED_WORKER_PREVIEW_ORIGIN, true, true).sharing, true);
  assert.equal(clientDiagnosisConfig({ enabled: true, sharing: true, metrics: true, previewSharing: true }, VERIFIED_WORKER_PREVIEW_ORIGIN, true, true).metrics, false);
  for (const origin of ['https://gemnao-diagnostic-qa.synthetic-test.workers.dev', 'https://any.other.workers.dev', 'https://gemnao-diagnostic-qa.workers.dev', VERIFIED_WORKER_PREVIEW_ORIGIN + '/', VERIFIED_WORKER_PREVIEW_ORIGIN + ':443', VERIFIED_WORKER_PREVIEW_ORIGIN.replace('https:', 'http:')]) {
    assert.equal(isWorkerPreviewOrigin(origin), false);
    assert.equal(clientDiagnosisConfig({ enabled: true, sharing: true, metrics: false, previewSharing: true }, origin, true, true).sharing, false);
  }
});
void test('beta browser requires preview hostname and explicit server mode; preview metrics stay off', () => {
  const next = { enabled: true, sharing: true, metrics: true, previewSharing: true };
  assert.deepEqual(clientDiagnosisConfig(next, 'https://qa-isolated.gemnao.pages.dev', true, false), { enabled: true, sharing: true, metrics: false, localOnly: false, previewSharing: true });
  for (const origin of ['https://gemnao.pages.dev', 'https://evil.test', 'http://qa-isolated.gemnao.pages.dev']) {
    assert.equal(clientDiagnosisConfig(next, origin, true, true).sharing, false);
    assert.equal(clientDiagnosisConfig(next, origin, true, true).localOnly, true);
  }
  assert.equal(clientDiagnosisConfig({ ...next, previewSharing: undefined }, 'https://qa-isolated.gemnao.pages.dev', true, true).sharing, false);
  assert.equal(clientDiagnosisConfig({ ...next, sharing: false }, 'https://qa-isolated.gemnao.pages.dev', true, false).sharing, false);
  for (const origin of ['https://gemnao.pages.dev', 'https://qa.gemnao.pages.dev.evil.test', 'https://qa.gemnao.pages.dev/', 'https://qa.gemnao.pages.dev:443', 'https://user@qa.gemnao.pages.dev']) assert.equal(isPagesPreviewOrigin(origin), false);
});

void test('unconfirmed capability copy never claims that server sharing is disabled', () => {
  const html = renderToStaticMarkup(createElement(DiagnosisStorageNotice));
  assert.match(html, /受付状況をまだ確認できていません/);
  assert.match(html, /内容と公開範囲を確認して確定するまで/);
  assert.ok(!html.includes('サーバー送信・結果の共有・診断イベントの計測は行いません'));
  const privacy = readFileSync('components/diagnosis-privacy-content.tsx', 'utf8');
  assert.ok(privacy.indexOf('if (!config.confirmed)') < privacy.indexOf('if (config.localOnly)'));
  assert.match(privacy, /aria-live="polite">\{unconfirmedSharingNotice\}/);
  const hook = readFileSync('components/diagnosis-config.ts', 'utf8');
  assert.match(hook, /confirmed: false/);
  assert.match(hook, /confirmed: true/);
  assert.match(hook, /\.catch\(\(\) => \{\}\)/);
});

void test('malformed or incomplete configuration cannot confirm privacy capability', () => {
  for (const value of [null, {}, { enabled: true, sharing: true }, { enabled: true, sharing: true, metrics: 'false' }, { enabled: true, sharing: true, metrics: false, previewSharing: 'true' }]) assert.equal(isDiagnosisConfig(value), false);
  assert.equal(isDiagnosisConfig({ enabled: true, sharing: false, metrics: false, localOnly: true }), true);
});
