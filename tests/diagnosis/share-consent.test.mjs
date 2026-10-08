import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';
import { chromium, expect } from '@playwright/test';

// Exercise the actual component in Chromium. Every HTTP request is intercepted;
// these synthetic tests never contact a deployed service or database.
const origin = 'http://127.0.0.1:4179';
const bundle = await build({
  stdin: {
    contents: `
      import React, { useState } from 'react';
      import { createRoot } from 'react-dom/client';
      import { DiagnosisShare } from './components/diagnosis-share';
      function Harness() {
        const [answers, setAnswers] = useState({ symptom: 'launch', scope: 'unknown' });
        const [tried, setTried] = useState({});
        const [results, setResults] = useState({});
        const [enabled, setEnabled] = useState(true);
        const [shareId, setShareId] = useState();
        return <main>
          <button onClick={() => setAnswers({ symptom: 'launch', scope: 'game' })}>change answers</button>
          <button onClick={() => setTried({ inspect: 'tried' })}>change tried</button>
          <button onClick={() => setResults({ inspect: 'improved' })}>change results</button>
          <button onClick={() => setResults({})}>restore results</button>
          <button onClick={() => setEnabled(false)}>disable sharing</button>
          <DiagnosisShare answers={answers} tried={tried} results={results}
            enabled={enabled} shareId={shareId} onCreated={setShareId} onMetric={() => {}} />
        </main>;
      }
      createRoot(document.getElementById('root')).render(<Harness />);
    `,
    resolveDir: process.cwd(),
    loader: 'tsx',
  },
  bundle: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  define: { 'process.env.NODE_ENV': '"production"' },
});
const script = bundle.outputFiles[0].text;

await test('sharing consent is tied to content and immutable retry payloads', async (t) => {
  const browser = await chromium.launch({ headless: true });
  async function fixture() {
    const context = await browser.newContext();
    const page = await context.newPage();
    const posts = [];
    const errors = [];
    let mode = 'fail';
    let sessionWait = null;
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      assert.equal(url.origin, origin, 'no external requests');
      if (url.pathname === '/') {
        return route.fulfill({ contentType: 'text/html', body: '<!doctype html><div id="root"></div><script src="/bundle.js"></script>' });
      }
      if (url.pathname === '/bundle.js') return route.fulfill({ contentType: 'application/javascript', body: script });
      if (url.pathname === '/api/diagnosis/session') {
        if (sessionWait) await sessionWait;
        return route.fulfill({ contentType: 'application/json', body: '{"ok":true}' });
      }
      if (url.pathname === '/api/diagnosis') {
        posts.push(request.postDataJSON());
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
    await page.goto(origin);
    const open = page.getByRole('button', { name: '共有用ページを作る', exact: true });
    const checkbox = page.getByRole('checkbox', { name: '上の内容と公開範囲' });
    const submit = page.getByRole('button', { name: '確認した内容でURLを発行' });
    await open.click();
    return {
      page, posts, checkbox, submit, open,
      succeed() { mode = 'success'; },
      failure(next) { mode = next; },
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
