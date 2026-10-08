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
      if (location.hash === '#wizard') localStorage.setItem('gemnao-diagnosis-v1', JSON.stringify({
        ...freshLocal(), answers: initialAnswers, complete: true, step: 'tried',
      }));
      function Harness() {
        const [answers, setAnswers] = useState(initialAnswers);
        const [tried, setTried] = useState({});
        const [results, setResults] = useState({});
        const [enabled, setEnabled] = useState(true);
        const [shareId, setShareId] = useState();
        return <main>
          <button onClick={() => setAnswers({ ...initialAnswers, scope: 'game' })}>change answers</button>
          <button onClick={() => setTried({ inspect: 'tried' })}>change tried</button>
          <button onClick={() => setResults({ inspect: 'improved' })}>change results</button>
          <button onClick={() => setResults({})}>restore results</button>
          <button onClick={() => setEnabled(false)}>disable sharing</button>
          <DiagnosisShare answers={answers} tried={tried} results={results}
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

await test('sharing consent is tied to content and immutable retry payloads', async (t) => {
  const browser = await chromium.launch({ headless: true });
  async function fixture(wizard = false) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const posts = [];
    const errors = [];
    let mode = 'fail';
    let sessionWait = null;
    let createWait = null;
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      assert.equal(url.origin, origin, 'no external requests');
      if (url.pathname === '/') {
        return route.fulfill({ contentType: 'text/html', body: '<!doctype html><div id="root"></div><script src="/bundle.js"></script>' });
      }
      if (url.pathname === '/bundle.js') return route.fulfill({ contentType: 'application/javascript', body: script });
      if (url.pathname === '/api/diagnosis/config') return route.fulfill({ contentType: 'application/json', body: '{"enabled":true,"sharing":true,"metrics":false}' });
      if (url.pathname === '/api/diagnosis/session') {
        if (sessionWait) await sessionWait;
        return route.fulfill({ contentType: 'application/json', body: '{"ok":true}' });
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
            id: 'a'.repeat(32), recoveryKey: 'b'.repeat(64), expiresAt: Date.now() + 86400000,
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
      page, posts, checkbox, submit, open,
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
          await f.checkbox.check();
          f.succeed();
          await f.submit.click();
          await expect(f.page.locator('.diag-share-url')).toBeVisible();
          assert.equal(f.posts.length, 1);
          if (kind === 'answers') assert.equal(f.posts[0].snapshot.answers.scope, 'game');
          if (kind === 'tried') assert.equal(f.posts[0].snapshot.tried.inspect, 'tried');
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
        assert.deepEqual(f.posts[1], f.posts[0]);
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
        assert.deepEqual(f.posts[2], f.posts[0]);
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
          assert.deepEqual(f.posts[1], f.posts[0]);
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
        assert.deepEqual(f.posts[1], f.posts[0]);
      } finally { release?.(); await f.close(); }
    });
    for (const stage of ['session', 'create']) {
      for (const navigation of ['back', 'reset', 'restart']) {
        await t.test(navigation + ' during ' + stage + ' cannot attach an old share to a new diagnosis', async () => {
          const f = await fixture(true);
          let release;
          try {
            release = stage === 'session' ? f.holdSession() : f.holdCreate();
            f.succeed();
            await f.checkbox.check();
            await f.submit.click();
            if (stage === 'create') await expect.poll(() => f.posts.length).toBe(1);
            else await expect(f.page.getByRole('button', { name: '保存しています…' })).toBeDisabled();
            if (navigation === 'back') {
              await f.page.getByRole('button', { name: '回答に戻る', exact: false }).click();
              await f.page.getByRole('button', { name: '確認する順番を見る' }).click();
            } else {
              if (navigation === 'reset') {
                await f.page.getByRole('button', { name: '端末内の記録を消す', exact: true }).click();
                await f.page.getByRole('button', { name: '症状を選んで診断をはじめる', exact: false }).click();
              } else await f.page.getByRole('button', { name: '別の症状を診断する' }).click();
              await f.page.getByRole('button', { name: 'ゲームが起動しない', exact: false }).click();
              await f.page.getByRole('button', { name: '次へ', exact: false }).click();
              await f.page.getByRole('button', { name: 'PCの電源が落ちる', exact: true }).click();
              await f.page.getByRole('button', { name: '確認する順番を見る' }).click();
            }
            await expect(f.page.getByRole('heading', { name: 'あなたの診断結果' })).toBeVisible();
            const responsePromise = f.page.waitForResponse((r) => new URL(r.url()).pathname === (stage === 'session' ? '/api/diagnosis/session' : '/api/diagnosis'));
            release();
            await (await responsePromise).finished();
            await f.page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
            await expect(f.page.locator('.diag-share-url')).toHaveCount(0);
            assert.equal(await f.page.evaluate(() => JSON.parse(localStorage.getItem('gemnao-diagnosis-v1')).shareId), undefined);
            assert.equal(f.posts.length, stage === 'session' ? 0 : 1);
            await f.open.click();
            await expect(f.checkbox).not.toBeChecked();
          } finally { release?.(); await f.close(); }
        });
      }
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
