// Synthetic component regression: loopback only, no Cloudflare or remote D1.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const out = '.wrangler/diagnosis-availability-browser';
await mkdir(out, { recursive: true });
await build({
  stdin: {
    contents: `
      import React from 'react';
      import { createRoot } from 'react-dom/client';
      import { DiagnosisShare } from './components/diagnosis-share';
      import { DiagnosisWizard } from './components/diagnosis-wizard';
      import './app/diagnose/diagnosis.css';
      const answers = { symptom: 'not-launching', scope: 'game', observation: 'error', error: 'directx', change: 'none', launcher: 'steam', os: 'windows11', gpu: 'nvidia', ram: '32' };
      function Harness() {
        const [created, setCreated] = React.useState('');
        return <main className="diag">
          <h1>保存・共有の受付</h1>
          <textarea aria-label="未保存の入力" defaultValue="Synthetic local answer" />
          <DiagnosisShare answers={answers} tried={{verify:'unchanged'}} results={{}} enabled={true} shareId={created || undefined}
            onCreated={setCreated} onMetric={() => {}} />
          <output data-testid="created">{created}</output>
        </main>;
      }
      createRoot(document.getElementById('root')).render(location.pathname === '/wizard' ? <DiagnosisWizard gameNames={[]} /> : <Harness />);
    `,
    loader: 'tsx',
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: 'browser',
  format: 'esm',
  outfile: `${out}/bundle.js`,
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED': '"true"',
    'process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA': '"false"',
  },
});
const unexpectedServerRequests = [];
const server = createServer(async (request, response) => {
  const path = request.url?.split('?')[0];
  // This server has no API, database or proxy fallback. Unexpected mutations
  // are rejected even if a browser interception is accidentally removed.
  if (request.method !== 'GET' || path?.startsWith('/api/')) {
    unexpectedServerRequests.push(`${request.method} ${path}`);
    response.writeHead(405, { 'Content-Type': 'text/plain' });
    response.end('Synthetic fixture has no API');
  } else if (path === '/bundle.js' || path === '/bundle.css') {
    response.setHeader(
      'Content-Type',
      path.endsWith('.js') ? 'text/javascript' : 'text/css',
    );
    response.end(await readFile(`${out}${path}`));
  } else if (path === '/' || path === '/wizard') {
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.end(
      '<!doctype html><html lang="ja"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/bundle.css"><style>body{margin:0;font-family:Arial,sans-serif;color:#161616;background:#fafafa}textarea{max-width:90%;padding:8px}button{cursor:pointer}#root{max-width:900px;margin:auto}</style><div id="root"></div><script type="module" src="/bundle.js"></script></html>',
    );
  } else {
    response.writeHead(404);
    response.end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const fixturePaths = new Set(['/', '/wizard', '/bundle.js', '/bundle.css']);
let browser;
const id = 'a'.repeat(32);
let passed = 0;
try {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {}),
  });
  for (const width of [375, 1440]) {
    for (const scenario of [
      'daily-session',
      'daily-create',
      'capacity-create',
      'html-create',
      'html-error',
      'lost-create',
      'success',
    ]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        serviceWorkers: 'block',
      });
      const requests = [];
      const createBodies = [];
      const errors = [];
      const unexpected = [];
      await context.route('**/*', (route) => {
        const url = new URL(route.request().url());
        const method = route.request().method();
        if (url.origin === base && method === 'GET' && fixturePaths.has(url.pathname))
          return route.continue();
        if (url.origin !== base || method !== 'POST' ||
          !['/api/diagnosis', '/api/diagnosis/session'].includes(url.pathname)) {
          unexpected.push(`${method} ${url.origin}${url.pathname}`);
          return route.abort();
        }
        requests.push(url.pathname);
        if (url.pathname === '/api/diagnosis')
          createBodies.push(route.request().postData());
        if (
          url.pathname.endsWith('/session') &&
          !['daily-session', 'html-error'].includes(scenario)
        )
          return route.fulfill({ json: { ok: true, ownerBinding: 'c'.repeat(64) } });
        if (scenario === 'success')
          return route.fulfill({
            json: {
              id,
              recoveryKey: 'b'.repeat(64),
              expiresAt: Date.now() + 86400000,
              createdAt: Date.now(),
              revision: 1,
            },
          });
        if (scenario === 'lost-create') {
          if (createBodies.length === 1) return route.abort('connectionfailed');
          return route.fulfill({
            json: {
              id,
              recoveryKey: null,
              repeated: true,
              expiresAt: Date.now() + 86400000,
              createdAt: Date.now(),
              revision: 1,
            },
          });
        }
        if (scenario.startsWith('html'))
          return route.fulfill({
            status: scenario === 'html-create' ? 200 : 503,
            contentType: 'text/html',
            body: '<html>Error 1027: synthetic provider page</html>',
          });
        return route.fulfill({
          status: 503,
          json: {
            code:
              scenario === 'capacity-create' ? 'storage_limit' : 'daily_limit',
            error:
              scenario === 'capacity-create'
                ? '保存容量の上限に達したため、保存・共有の受付を一時停止しています。入力は消去していません。'
                : '本日の無料利用枠に達したため、保存・共有の受付を一時停止しています。入力は消去していません。',
          },
        });
      });
      const page = await context.newPage();
      await page.clock.install();
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(base);
      await page.evaluate(() =>
        localStorage.setItem('gemnao-diagnosis-v1', 'synthetic saved input'),
      );
      await page.getByLabel('未保存の入力').fill('Keep this unsaved answer');
      await page
        .getByRole('button', { name: '共有用ページを作る', exact: true })
        .click();
      await page.getByRole('checkbox').check();
      await page
        .getByRole('button', { name: '確認した内容でURLを発行', exact: true })
        .click();
      if (scenario === 'success') {
        await page.waitForFunction(
          () =>
            document.querySelector('[data-testid="created"]').textContent
              .length > 0,
        );
        assert.equal(
          await page.locator('[data-testid="created"]').textContent(),
          id,
        );
      } else {
        await page.getByRole('alert').waitFor();
        assert.match(
          await page.getByRole('alert').textContent(),
          /入力は消去していません/,
        );
        assert.equal(
          await page.locator('[data-testid="created"]').textContent(),
          '',
        );
        assert.equal(
          await page
            .getByRole('button', {
              name: '確認した内容でURLを発行',
              exact: true,
            })
            .count(),
          0,
        );
        assert.equal(
          await page
            .getByRole('button', { name: '共有用ページを作る', exact: true })
            .count(),
          0,
        );
        if (scenario === 'daily-create')
          await page.screenshot({
            path: `${out}/paused-${width}.png`,
            fullPage: true,
          });
      }
      assert.equal(
        await page.getByLabel('未保存の入力').inputValue(),
        'Keep this unsaved answer',
      );
      assert.equal(
        await page.evaluate(() => localStorage.getItem('gemnao-diagnosis-v1')),
        'synthetic saved input',
      );
      assert.equal(
        requests.length,
        ['daily-session', 'html-error'].includes(scenario) ? 1 : 2,
      );
      if (scenario === 'lost-create') {
        await page
          .getByRole('button', { name: '同じ保存操作を再確認', exact: true })
          .click();
        await page.waitForFunction(
          () =>
            document.querySelector('[data-testid="created"]').textContent
              .length > 0,
        );
        assert.equal(
          await page.locator('[data-testid="created"]').textContent(),
          id,
        );
        assert.equal(requests.length, 4);
        assert.equal(createBodies.length, 2);
        const first = JSON.parse(createBodies[0]);
        const second = JSON.parse(createBodies[1]);
        assert.deepEqual(second, { ...first, resume: true },
          'explicit recovery preserves request ID, snapshot and cookie binding and is lookup-only');
      }
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
      );
      // Advancing the browser clock verifies that the failure schedules no
      // timer-driven retry; explicit user rechecks above are the only repeats.
      const beforeIdle = requests.length;
      await page.clock.fastForward(60000);
      // Allow locally dispatched fetch/interception events to settle after the
      // controlled timer jump; this is a bounded quiet observation, not a retry.
      await page.waitForTimeout(100);
      assert.equal(requests.length, beforeIdle);
      assert.deepEqual(unexpected, []);
      assert.deepEqual(errors, []);
      assert.equal(
        await page.locator('[data-testid="created"]').textContent(),
        ['success', 'lost-create'].includes(scenario) ? id : '',
      );
      await context.close();
      passed++;
    }
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      serviceWorkers: 'block',
    });
    const unexpected = [];
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      const method = route.request().method();
      if (url.origin === base && method === 'GET' && fixturePaths.has(url.pathname))
        return route.continue();
      if (url.origin !== base || method !== 'GET' || url.pathname !== '/api/diagnosis/config') {
        unexpected.push(`${method} ${url.origin}${url.pathname}`);
        return route.abort();
      }
      return route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html>static fallback</html>',
      });
    });
    const page = await context.newPage();
    await page.goto(base + '/wizard');
    await page
      .getByText('確認不能：診断の稼働状況を確認できません。', { exact: false })
      .waitFor();
    assert.equal(
      await page
        .getByRole('button', {
          name: '症状を選んで診断をはじめる',
          exact: false,
        })
        .count(),
      0,
    );
    assert.deepEqual(unexpected, []);
    await context.close();
    passed++;
  }
  assert.deepEqual(unexpectedServerRequests, [], 'mocked API traffic must never reach even the loopback server');
  console.log(
    `Diagnosis availability browser checks passed: ${passed} (375px / 1440px; synthetic loopback only).`,
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
