import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';
import { chromium, expect } from '@playwright/test';

// Exercise the actual component in Chromium. Every HTTP request is intercepted;
// these synthetic tests never contact a deployed service or database.
const validAnswers = {
  symptom: 'not-launching', scope: 'unknown', observation: 'unknown',
  change: 'unknown', launcher: 'unknown', os: 'unknown', gpu: 'unknown', ram: 'unknown',
};
const validation = await build({
  stdin: { contents: "export { buildSnapshot } from './lib/diagnosis/validation';", resolveDir: process.cwd() },
  bundle: true, write: false, format: 'esm', platform: 'node',
});
const { buildSnapshot } = await import('data:text/javascript;base64,' + Buffer.from(validation.outputFiles[0].text).toString('base64'));
const origin = 'http://127.0.0.1:4179';
const bundle = await build({
  stdin: {
    contents: `
      import React, { useState } from 'react';
      import { createRoot } from 'react-dom/client';
      import { DiagnosisShare } from './components/diagnosis-share';
      import { DiagnosisWizard } from './components/diagnosis-wizard';
      import { freshLocal } from './lib/diagnosis/local';
      const initialAnswers = ${JSON.stringify(validAnswers)};
      if (location.hash === '#wizard' && !location.search) localStorage.setItem('gemnao-diagnosis-v1', JSON.stringify({
        ...freshLocal(), answers: initialAnswers, complete: true, step: 'tried',
      }));
      function Harness() {
        const [answers, setAnswers] = useState(initialAnswers);
        const [tried, setTried] = useState({});
        const [results, setResults] = useState({});
        const [enabled, setEnabled] = useState(true);
        const [shareId, setShareId] = useState();
        const [generation, setGeneration] = useState(0);
        return <main>
          <button onClick={() => { setShareId(undefined); setGeneration(generation + 1); }}>replace diagnosis</button>
          <button onClick={() => setAnswers({ ...initialAnswers, scope: 'game' })}>change answers</button>
          <button onClick={() => setTried({ inspect: 'tried' })}>change tried</button>
          <button onClick={() => setResults({ inspect: 'improved' })}>change results</button>
          <button onClick={() => setResults({})}>restore results</button>
          <button onClick={() => setEnabled(false)}>disable sharing</button>
          <DiagnosisShare key={generation} answers={answers} tried={tried} results={results}
            enabled={enabled} shareId={shareId} onCreated={setShareId} onMetric={() => {}} />
        </main>;
      }
      createRoot(document.getElementById('root')).render(location.hash === '#wizard' ? <DiagnosisWizard gameNames={[]} /> : <Harness />);
    `,
    resolveDir: process.cwd(),
    loader: 'tsx',
  },
  bundle: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  define: { 'process.env.NODE_ENV': '"production"', 'process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED': '"true"', 'process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA': '"false"' },
});
const script = bundle.outputFiles[0].text;
const stablePayload = ({ snapshot, requestId, ownerBinding }) => ({ snapshot, requestId, ownerBinding });

await test('sharing consent is tied to content and immutable retry payloads', async (t) => {
  const browser = await chromium.launch({ headless: true });
  async function fixture(wizard = false) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const posts = [];
    const sessions = [];
    const errors = [];
    let mode = 'fail';
    let sessionWait = null;
    let createWait = null;
    page.on('pageerror', (error) => errors.push(error.message));
    await context.route('**/*', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      assert.equal(url.origin, origin, 'no external requests');
      if (url.pathname === '/') {
        return route.fulfill({ contentType: 'text/html', body: '<!doctype html><div id="root"></div><script src="/bundle.js"></script>' });
      }
      if (url.pathname === '/bundle.js') return route.fulfill({ contentType: 'application/javascript', body: script });
      if (url.pathname === '/api/diagnosis/config') return route.fulfill({ contentType: 'application/json', body: '{"enabled":true,"sharing":true,"metrics":false}' });
      if (url.pathname === '/api/diagnosis/session') {
        sessions.push(request.postDataJSON());
        if (sessionWait) await sessionWait;
        if (mode === 'missing-cookie') return route.fulfill({ status: 403, contentType: 'application/json', body: '{"error":"original cookie missing"}' });
        if (mode === 'session-fail') return route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"synthetic session failure"}' });
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ok: true, ownerBinding: mode === 'wrong-cookie' ? 'd'.repeat(64) : 'c'.repeat(64) }) });
      }
      if (url.pathname === '/api/diagnosis') {
        posts.push(request.postDataJSON());
        assert.ok(buildSnapshot(posts.at(-1).snapshot), 'synthetic payload must pass the real server validator');
        if (createWait) await createWait;
        if (mode === 'abort') return route.abort('failed');
        return route.fulfill({
          status: mode === 'fail' ? 503 : 201,
          contentType: 'application/json',
          body: mode === 'malformed' ? '{' : JSON.stringify(mode === 'fail' ? { error: 'synthetic uncertain save' } : {
            id: 'a'.repeat(32), recoveryKey: mode === 'repeated' ? null : 'b'.repeat(64), repeated: mode === 'repeated', expiresAt: Date.now() + 86400000,
          }),
        });
      }
      assert.fail('unexpected request path: ' + url.pathname);
    });
    await page.goto(origin + (wizard ? '/#wizard' : ''));
    if (wizard) await page.getByRole('button', { name: '続きから再開する' }).click();
    const open = page.getByRole('button', { name: '共有用ページを作る', exact: true });
    const checkbox = page.getByRole('checkbox', { name: '上の内容と公開範囲' });
    const submit = page.getByRole('button', { name: '確認した内容でURLを発行' });
    await open.click();
    return {
      page, posts, sessions, checkbox, submit, open,
      succeed() { mode = 'success'; },
      failure(next) { mode = next; },
      holdCreate() {
        let release;
        createWait = new Promise((resolve) => { release = resolve; });
        return () => release();
      },
      holdSession() {
        let release;
        sessionWait = new Promise((resolve) => { release = resolve; });
        return () => release();
      },
      async close() { assert.deepEqual(errors, []); await context.close(); },
    };
  }
  try {
    for (const kind of ['answers', 'tried', 'results']) {
      await t.test(kind + ' edits invalidate checked consent before any send', async () => {
        const f = await fixture();
        try {
          await expect(f.checkbox).not.toBeChecked();
          await expect(f.submit).toBeDisabled();
          await f.checkbox.check();
          await f.page.getByRole('button', { name: 'change ' + kind, exact: true }).click();
          await expect(f.checkbox).not.toBeChecked();
          await expect(f.submit).toBeDisabled();
          assert.equal(f.posts.length, 0);
          if (kind === 'results') {
            await f.page.getByRole('button', { name: 'restore results', exact: true }).click();
            await expect(f.checkbox).not.toBeChecked();
            await expect(f.submit).toBeDisabled();
          }
          if (kind === 'results') await f.page.getByRole('button', { name: 'change results', exact: true }).click();
          await f.checkbox.check();
          f.succeed();
          await f.submit.click();
          await expect(f.page.locator('.diag-share-url')).toBeVisible();
          assert.equal(f.posts.length, 1);
          if (kind === 'answers') assert.equal(f.posts[0].snapshot.answers.scope, 'game');
          if (kind === 'tried') assert.equal(f.posts[0].snapshot.tried.inspect, 'tried');
          if (kind === 'results') assert.equal(f.posts[0].snapshot.results.inspect, 'improved');
        } finally { await f.close(); }
      });
    }
    await t.test('unchanged retry and changed/cancelled/reopened retry keep exact original pair', async () => {
      const f = await fixture();
      try {
        await f.checkbox.check();
        await f.submit.click();
        await expect(f.page.getByRole('alert')).toContainText('synthetic uncertain save');
        await expect(f.checkbox).toBeChecked();
        await f.submit.click();
        await expect.poll(() => f.posts.length).toBe(2);
        assert.deepEqual(stablePayload(f.posts[1]), stablePayload(f.posts[0]));
        await expect(f.submit).toBeEnabled();
        await f.page.getByRole('button', { name: 'change results', exact: true }).click();
        await expect(f.checkbox).not.toBeChecked();
        await expect(f.submit).toBeDisabled();
        await expect(f.page.locator('.diag-preview')).not.toContainText('改善した');
        await expect(f.page.getByText('その後の端末内の変更は送信しません。', { exact: false })).toBeVisible();
        await f.page.getByRole('button', { name: 'キャンセル', exact: true }).click();
        await f.open.click();
        await expect(f.checkbox).not.toBeChecked();
        await f.checkbox.check();
        f.succeed();
        await f.submit.click();
        await expect(f.page.locator('.diag-share-url')).toBeVisible();
        assert.equal(f.posts.length, 3);
        assert.deepEqual(stablePayload(f.posts[2]), stablePayload(f.posts[0]));
        assert.deepEqual(f.posts[2].snapshot.results, {});
      } finally { await f.close(); }
    });
    for (const failure of ['abort', 'malformed']) {
      await t.test(failure + ' response preserves the reviewed attempt for retry', async () => {
        const f = await fixture();
        try {
          f.failure(failure);
          await f.checkbox.check();
          await f.submit.click();
          await expect(f.page.getByRole('alert')).toBeVisible();
          await expect(f.page.locator('.diag-share-url')).toHaveCount(0);
          await expect(f.submit).toBeEnabled();
          await f.page.getByRole('button', { name: 'change results', exact: true }).click();
          await expect(f.checkbox).not.toBeChecked();
          await f.checkbox.check();
          f.succeed();
          await f.submit.click();
          await expect(f.page.locator('.diag-share-url')).toBeVisible();
          assert.equal(f.posts.length, 2);
          assert.deepEqual(stablePayload(f.posts[1]), stablePayload(f.posts[0]));
        } finally { await f.close(); }
      });
    }
    await t.test('capture precedes session await; edits in flight never change sent snapshot', async () => {
      const f = await fixture();
      let release;
      try {
        release = f.holdSession();
        await f.checkbox.check();
        await f.submit.click();
        await expect(f.page.getByRole('button', { name: '保存しています…' })).toBeDisabled();
        await expect(f.checkbox).toBeDisabled();
        await f.page.getByRole('button', { name: 'change results', exact: true }).click();
        await expect(f.checkbox).not.toBeChecked();
        assert.equal(f.posts.length, 0);
        release();
        await expect(f.page.getByRole('alert')).toContainText('synthetic uncertain save');
        assert.deepEqual(f.posts[0].snapshot.results, {});
        await expect(f.submit).toBeDisabled();
        await f.checkbox.check();
        f.succeed();
        await f.submit.click();
        await expect(f.page.locator('.diag-share-url')).toBeVisible();
        assert.deepEqual(stablePayload(f.posts[1]), stablePayload(f.posts[0]));
      } finally { release?.(); await f.close(); }
    });
    for (const stage of ['session', 'create']) {
      await t.test('actual wizard prevents Back/reset/restart during ' + stage + ' and keeps the created key', async () => {
        const f = await fixture(true);
        let release;
        try {
          release = stage === 'session' ? f.holdSession() : f.holdCreate();
          f.succeed();
          await f.checkbox.check();
          await f.submit.click();
          if (stage === 'create') await expect.poll(() => f.posts.length).toBe(1);
          const back = f.page.getByRole('button', { name: '回答に戻る', exact: false });
          const reset = f.page.getByRole('button', { name: '端末内の記録を消す', exact: true });
          const restart = f.page.getByRole('button', { name: '別の症状を診断する' });
          for (const control of [back, reset, restart]) await expect(control).toBeDisabled();
          release();
          await expect(f.page.locator('.diag-share-url')).toBeVisible();
          await expect(f.page.locator('.diag-key')).toHaveText('b'.repeat(64));
          for (const control of [back, reset, restart]) await expect(control).toBeEnabled();
          assert.equal(f.posts.length, 1);
          await reset.click();
          await expect(f.page.locator('.diag-share-url')).toHaveCount(0);
        } finally { release?.(); await f.close(); }
      });
      await t.test('forced unmount during ' + stage + ' ignores the abandoned callback', async () => {
        const f = await fixture();
        let release;
        try {
          release = stage === 'session' ? f.holdSession() : f.holdCreate();
          f.succeed();
          await f.checkbox.check();
          await f.submit.click();
          if (stage === 'create') await expect.poll(() => f.posts.length).toBe(1);
          else await expect(f.page.getByRole('button', { name: '保存しています…' })).toBeDisabled();
          await f.page.getByRole('button', { name: 'replace diagnosis', exact: true }).click();
          const responsePromise = f.page.waitForResponse((r) => new URL(r.url()).pathname === (stage === 'session' ? '/api/diagnosis/session' : '/api/diagnosis'));
          release();
          await (await responsePromise).finished();
          await f.page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          await expect(f.page.locator('.diag-share-url')).toHaveCount(0);
          assert.equal(f.posts.length, stage === 'session' ? 0 : 1);
          await f.open.click();
          await expect(f.checkbox).not.toBeChecked();
        } finally { release?.(); await f.close(); }
      });
    }
    await t.test('rapid duplicate activation admits one in-flight create', async () => {
      const f = await fixture();
      let release;
      try {
        release = f.holdSession();
        await f.checkbox.check();
        await f.submit.evaluate((button) => { button.click(); button.click(); });
        release();
        await expect(f.page.getByRole('alert')).toContainText('synthetic uncertain save');
        assert.equal(f.posts.length, 1);
      } finally { release?.(); await f.close(); }
    });
    await t.test('session failure unlocks controls and repeated success preserves the existing key warning', async () => {
      const f = await fixture(true);
      try {
        f.failure('session-fail');
        await f.checkbox.check();
        await f.submit.click();
        await expect(f.page.getByRole('alert')).toContainText('synthetic session failure');
        await expect(f.submit).toBeEnabled();
        await expect(f.page.getByRole('button', { name: '端末内の記録を消す', exact: true })).toBeEnabled();
        assert.equal(f.posts.length, 0);
        f.failure('repeated');
        await f.submit.click();
        await expect(f.page.locator('.diag-share-url')).toBeVisible();
        await expect(f.page.locator('.diag-key')).toHaveCount(0);
        await expect(f.page.getByRole('alert')).toContainText('管理キーは再表示できません');
        assert.equal(f.posts.length, 1);
      } finally { await f.close(); }
    });
    await t.test('synchronous request ID failure unlocks the form for retry', async () => {
      const f = await fixture();
      try {
        await f.page.evaluate(() => {
          const original = crypto.randomUUID.bind(crypto);
          crypto.randomUUID = () => { crypto.randomUUID = original; throw new Error('synthetic UUID failure'); };
        });
        await f.checkbox.check();
        await f.submit.click();
        await expect(f.page.getByRole('alert')).toContainText('synthetic UUID failure');
        await expect(f.submit).toBeEnabled();
        assert.equal(f.posts.length, 0);
        f.succeed();
        await f.submit.click();
        await expect(f.page.locator('.diag-share-url')).toBeVisible();
        assert.equal(f.posts.length, 1);
      } finally { await f.close(); }
    });
    const pendingKeys = () => Object.keys(localStorage).filter((key) => key.startsWith('gemnao-diagnosis-pending-v1:'));
    for (const revisit of ['reload', 'new-tab', 'back']) {
      await t.test(revisit + ' recovers only the saved snapshot after explicit confirmation', async () => {
        const f = await fixture(true);
        try {
          await f.checkbox.check();
          await f.submit.click();
          await expect(f.page.getByRole('alert')).toContainText('synthetic uncertain save');
          const original = f.posts[0];
          assert.equal((await f.page.evaluate(pendingKeys)).length, 1);
          let page = f.page;
          if (revisit === 'new-tab') {
            page = await f.page.context().newPage();
            await f.page.close();
            await page.goto(origin + '/#wizard');
          } else if (revisit === 'reload') await page.reload();
          else await page.getByRole('button', { name: '回答に戻る', exact: false }).click();
          await expect(page.getByRole('heading', { name: '前回の未確認送信を回復' })).toBeVisible();
          assert.equal(f.posts.length, 1);
          assert.equal(f.sessions.length, 1, 'revisit never auto-sends or starts a session');
          await page.getByRole('button', { name: '前回の送信内容を確認する' }).click();
          const checkbox = page.getByRole('checkbox', { name: '上の内容と公開範囲' });
          await expect(checkbox).not.toBeChecked();
          f.succeed();
          await checkbox.check();
          await page.getByRole('button', { name: '確認した内容でURLを発行' }).click();
          await expect(page.locator('.diag-share-url')).toBeVisible();
          assert.equal(f.posts.length, 2);
          assert.deepEqual(stablePayload(f.posts[1]), stablePayload(original));
          assert.equal(f.posts[1].resume, true);
          assert.equal(f.sessions[1].resume, true);
          assert.equal((await page.evaluate(pendingKeys)).length, 0);
          assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('gemnao-diagnosis-v1')).shareId), undefined, 'old result never attaches to current diagnosis');
          const storage = await page.evaluate(() => JSON.stringify(localStorage));
          assert.ok(!storage.includes('b'.repeat(64)), 'recovery key never persists');
        } finally { await f.close(); }
      });
    }
    for (const failure of ['missing-cookie', 'wrong-cookie']) {
      await t.test(failure + ' blocks recovered snapshot POST', async () => {
        const f = await fixture(true);
        try {
          await f.checkbox.check();
          await f.submit.click();
          await expect(f.page.getByRole('alert')).toContainText('synthetic uncertain save');
          await f.page.reload();
          await f.page.getByRole('button', { name: '前回の送信内容を確認する' }).click();
          f.failure(failure);
          await f.checkbox.check();
          await f.submit.click();
          await expect(f.page.getByRole('alert')).toBeVisible();
          await expect(f.submit).toBeEnabled();
          assert.equal(f.posts.length, 1);
          assert.equal((await f.page.evaluate(pendingKeys)).length, 1);
        } finally { await f.close(); }
      });
    }
    for (const storageFailure of ['quota', 'denied']) {
      await t.test(storageFailure + ' local storage failure prevents any submission', async () => {
        const f = await fixture();
        try {
          await f.page.evaluate((mode) => {
            if (mode === 'denied') Object.defineProperty(window, 'localStorage', { get() { throw new Error('storage denied'); } });
            else {
              const original = Storage.prototype.setItem.bind(localStorage);
              Storage.prototype.setItem = function(key, value) {
                if (key.startsWith('gemnao-diagnosis-pending-v1:')) throw new DOMException('full', 'QuotaExceededError');
                return original(key, value);
              };
            }
          }, storageFailure);
          await f.checkbox.check();
          await f.submit.click();
          await expect(f.page.getByRole('alert')).toContainText('共有内容は送信していません');
          assert.equal(f.sessions.length, 0);
          assert.equal(f.posts.length, 0);
        } finally { await f.close(); }
      });
    }
    await t.test('explicit local erase clears pending only after warning; it never deletes the remote share', async () => {
      const f = await fixture(true);
      try {
        await f.checkbox.check();
        await f.submit.click();
        await expect(f.page.getByRole('alert')).toContainText('synthetic uncertain save');
        f.page.once('dialog', (dialog) => dialog.dismiss());
        await f.page.getByRole('button', { name: '端末内の記録を消す', exact: true }).click();
        assert.equal((await f.page.evaluate(pendingKeys)).length, 1);
        f.page.once('dialog', (dialog) => dialog.accept());
        await f.page.getByRole('button', { name: '端末内の記録を消す', exact: true }).click();
        await expect.poll(async () => (await f.page.evaluate(pendingKeys)).length).toBe(0);
        assert.equal(f.posts.length, 1);
        await f.page.reload();
        await expect(f.page.getByRole('heading', { name: '前回の未確認送信を回復' })).toHaveCount(0);
      } finally { await f.close(); }
    });
    for (const invalid of ['expired', 'version']) {
      await t.test(invalid + ' pending data is removed without network replay', async () => {
        const f = await fixture(true);
        try {
          await f.checkbox.check();
          await f.submit.click();
          await expect(f.page.getByRole('alert')).toContainText('synthetic uncertain save');
          await f.page.evaluate((reason) => {
            const key = Object.keys(localStorage).find((key) => key.startsWith('gemnao-diagnosis-pending-v1:'));
            const value = JSON.parse(localStorage.getItem(key));
            if (reason === 'expired') value.createdAt = Date.now() - 30 * 86400000;
            else value.snapshot.version = 'old-version';
            localStorage.setItem(key, JSON.stringify(value));
          }, invalid);
          await f.page.reload();
          await expect(f.page.getByRole('button', { name: '続きから再開する' })).toBeVisible();
          await expect(f.page.getByRole('heading', { name: '前回の未確認送信を回復' })).toHaveCount(0);
          assert.equal((await f.page.evaluate(pendingKeys)).length, 0);
          assert.equal(f.posts.length, 1);
          assert.equal(f.sessions.length, 1);
        } finally { await f.close(); }
      });
    }
    await t.test('two tabs cannot start competing sessions for the same unbound attempt', async () => {
      const f = await fixture(true);
      let release;
      try {
        release = f.holdSession();
        await f.checkbox.check();
        await f.submit.click();
        await expect.poll(() => f.sessions.length).toBe(1);
        const other = await f.page.context().newPage();
        await other.goto(origin + '/#wizard');
        await other.getByRole('button', { name: '前回の送信内容を確認する' }).click();
        await other.getByRole('checkbox', { name: '上の内容と公開範囲' }).check();
        await other.getByRole('button', { name: '確認した内容でURLを発行' }).click();
        await expect(other.getByRole('alert')).toContainText('別の画面で共有の処理中');
        assert.equal(f.sessions.length, 1);
        release();
        await expect(f.page.getByRole('alert')).toContainText('synthetic uncertain save');
        await other.getByRole('button', { name: '確認した内容でURLを発行' }).click();
        await expect(other.getByRole('alert')).toContainText('別の画面で変わりました');
        assert.equal(f.sessions.length, 1, 'stale unbound attempt cannot overwrite binding or open a new session');
        await other.reload();
        await other.getByRole('button', { name: '前回の送信内容を確認する' }).click();
        await other.getByRole('checkbox', { name: '上の内容と公開範囲' }).check();
        f.succeed();
        await other.getByRole('button', { name: '確認した内容でURLを発行' }).click();
        await expect(other.locator('.diag-share-url')).toBeVisible();
        assert.equal(f.posts.length, 2);
        assert.equal(f.posts[1].resume, true);
        assert.deepEqual(stablePayload(f.posts[1]), stablePayload(f.posts[0]));
      } finally { release?.(); await f.close(); }
    });
    await t.test('other-tab erase refuses while sending, then stale retries cannot resurrect erased local data', async () => {
      const f = await fixture(true);
      let release;
      try {
        release = f.holdSession();
        await f.checkbox.check();
        await f.submit.click();
        await expect.poll(() => f.sessions.length).toBe(1);
        const other = await f.page.context().newPage();
        await other.goto(origin + '/#wizard');
        await expect(other.getByRole('heading', { name: '前回の未確認送信を回復' })).toBeVisible();
        other.once('dialog', (dialog) => dialog.accept());
        await other.getByRole('button', { name: '端末内の記録を消す', exact: true }).click();
        await expect(other.getByText('別の画面の共有処理が終わってから', { exact: false })).toBeVisible();
        assert.equal((await other.evaluate(pendingKeys)).length, 1);
        release();
        await expect(f.page.getByRole('alert')).toContainText('synthetic uncertain save');
        other.once('dialog', (dialog) => dialog.accept());
        await other.getByRole('button', { name: '端末内の記録を消す', exact: true }).click();
        await expect.poll(async () => (await other.evaluate(pendingKeys)).length).toBe(0);
        await f.submit.click();
        await expect(f.page.getByRole('alert')).toContainText('削除または期限切れ');
        assert.equal(f.sessions.length, 1);
        assert.equal(f.posts.length, 1);
        assert.equal((await other.evaluate(pendingKeys)).length, 0);
      } finally { release?.(); await f.close(); }
    });
    await t.test('unsupported cross-tab locks fail before session or snapshot POST', async () => {
      const f = await fixture();
      try {
        await f.page.evaluate(() => Object.defineProperty(navigator, 'locks', { value: undefined }));
        await f.checkbox.check();
        await f.submit.click();
        await expect(f.page.getByRole('alert')).toContainText('安全な再試行を準備できません');
        assert.equal(f.sessions.length, 0);
        assert.equal(f.posts.length, 0);
      } finally { await f.close(); }
    });
    await t.test('pending recovery can be explicitly erased without a resumable diagnosis', async () => {
      const f = await fixture(true);
      try {
        await f.checkbox.check();
        await f.submit.click();
        await expect(f.page.getByRole('alert')).toContainText('synthetic uncertain save');
        await f.page.evaluate(() => localStorage.removeItem('gemnao-diagnosis-v1'));
        await f.page.goto(origin + '/?empty=1#wizard');
        await expect(f.page.getByRole('heading', { name: '前回の未確認送信を回復' })).toBeVisible();
        await expect(f.page.getByRole('button', { name: '続きから再開する' })).toHaveCount(0);
        f.page.once('dialog', (dialog) => dialog.accept());
        await f.page.getByRole('button', { name: '端末内の診断と回復情報を消す' }).click();
        await expect.poll(async () => (await f.page.evaluate(pendingKeys)).length).toBe(0);
        await expect(f.page.getByRole('heading', { name: '前回の未確認送信を回復' })).toHaveCount(0);
        assert.equal(f.posts.length, 1);
      } finally { await f.close(); }
    });
    await t.test('cancel before submission clears confirmation and a disabled capability cannot send', async () => {
      const f = await fixture();
      try {
        await f.checkbox.check();
        await f.page.getByRole('button', { name: 'キャンセル', exact: true }).click();
        await f.open.click();
        await expect(f.checkbox).not.toBeChecked();
        await f.checkbox.check();
        await f.page.getByRole('button', { name: 'disable sharing', exact: true }).click();
        await expect(f.submit).toHaveCount(0);
        assert.equal(f.posts.length, 0);
      } finally { await f.close(); }
    });
  } finally { await browser.close(); }
});
