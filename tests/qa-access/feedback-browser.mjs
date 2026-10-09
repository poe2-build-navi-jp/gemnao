// Local Chromium + actual React form/service/gate; synthetic auth and in-memory SQLite only.
// The loopback adapter maps only its own Origin to the pinned synthetic HTTPS origin.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import {
  wrapQaAccess,
  wrapPreviewApplication,
  qaAccessVerifier,
} from '../../cloudflare/worker-preview-policy.mjs';
const origin = 'https://gemnao-diagnostic-qa.synthetic-test.workers.dev';
const token = 'SYNTHETIC_TEST_FIXTURE_NOT_A_REAL_PASSWORD_0001';
const serviceBuild = await build({
  entryPoints: ['lib/diagnostic-feedback/service.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  plugins: [
    {
      name: 'synthetic-origin-pin',
      setup(b) {
        b.onLoad({ filter: /worker-origin\.ts$/ }, ({ path }) => ({
          contents: readFileSync(path, 'utf8').replace(
            'https://gemnao-diagnostic-qa.soykururu143.workers.dev',
            origin,
          ),
          loader: 'ts',
        }));
      },
    },
  ],
});
const { handleFeedback } = await import(
  'data:text/javascript;base64,' +
    Buffer.from(serviceBuild.outputFiles[0].text).toString('base64')
);
async function bundle(legacy) {
  const output = await build({
    stdin: {
      contents: `import React from 'react';import {createRoot} from 'react-dom/client';import {DiagnosticFeedbackForm} from './components/diagnostic-feedback-form';createRoot(document.getElementById('root')).render(<DiagnosticFeedbackForm/>);`,
      resolveDir: process.cwd(),
      loader: 'tsx',
    },
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
    plugins: legacy
      ? [
          {
            name: 'legacy-omit-reproduction',
            setup(b) {
              b.onLoad(
                { filter: /diagnostic-feedback-form\.tsx$/ },
                ({ path }) => ({
                  contents: readFileSync(path, 'utf8').replaceAll(
                    "credentials: 'same-origin'",
                    "credentials: 'omit'",
                  ),
                  loader: 'tsx',
                }),
              );
            },
          },
        ]
      : [],
  });
  return output.outputFiles[0].text;
}
const bundles = { current: await bundle(false), legacy: await bundle(true) };
const sql = new DatabaseSync(':memory:');
sql.exec(readFileSync('migrations/diagnostic-feedback/0001.sql', 'utf8'));
sql
  .prepare(
    'INSERT INTO diagnostic_retention_health(singleton,last_cleanup) VALUES(1,?)',
  )
  .run(Math.floor(Date.now() / 1000));
const db = {
  prepare(query) {
    let args = [];
    return {
      bind(...a) {
        args = a;
        return this;
      },
      async first() {
        return sql.prepare(query).get(...args) ?? null;
      },
      async run() {
        const r = sql.prepare(query).run(...args);
        return { success: true, meta: { changes: Number(r.changes) } };
      },
    };
  },
  async batch(queries) {
    sql.exec('BEGIN');
    try {
      const r = [];
      for (const q of queries) r.push(await q.run());
      sql.exec('COMMIT');
      return r;
    } catch (e) {
      sql.exec('ROLLBACK');
      throw e;
    }
  },
};
let clock = Date.now(),
  redirectFeedback = false;
const env = {
  QA_PREVIEW_ORIGIN: origin,
  QA_ACCESS_SHA256: await qaAccessVerifier(token),
  QA_ACCESS_NOT_BEFORE: String(clock - 1000),
  QA_ACCESS_EXPIRES_AT: String(clock + 600000),
  FEEDBACK_ENABLED: 'true',
  FEEDBACK_PREVIEW_ENABLED: 'true',
  FEEDBACK_PREVIEW_ORIGIN: origin,
  FEEDBACK_DB: db,
};
const observed = [],
  wire = [];
const app = {
  async fetch(request) {
    const u = new URL(request.url);
    if (u.pathname === '/api/diagnostic-feedback') {
      observed.push({
        method: request.method,
        hasCookie: request.headers.has('Cookie'),
        hasAuthorization: request.headers.has('Authorization'),
      });
      if (redirectFeedback)
        return new Response(null, {
          status: 302,
          headers: { Location: '/api/diagnosis/cookie-probe' },
        });
      return handleFeedback(request, env);
    }
    if (u.pathname === '/api/diagnosis/cookie-probe') {
      observed.push({
        diagnosis: true,
        hasCookie: request.headers.get('Cookie') === 'synthetic-owner=existing',
        hasAuthorization: request.headers.has('Authorization'),
      });
      return Response.json({ ok: true });
    }
    if (u.pathname === '/_next/static/feedback.js')
      return new Response(
        bundles[u.searchParams.has('legacy') ? 'legacy' : 'current'],
        { headers: { 'Content-Type': 'text/javascript' } },
      );
    if (u.pathname === '/diagnostic-feedback')
      return new Response(
        `<html><div id="root"></div><script src="/_next/static/feedback.js${u.searchParams.has('legacy') ? '?legacy' : ''}"></script></html>`,
        { headers: { 'Content-Type': 'text/html' } },
      );
    return new Response('Not found', { status: 404 });
  },
};
const worker = wrapQaAccess(
  wrapPreviewApplication(app, origin),
  origin,
  () => clock,
);
const server = createServer(async (req, res) => {
  try {
    const h = new Headers();
    for (const [k, v] of Object.entries(req.headers))
      if (v !== undefined) h.set(k, Array.isArray(v) ? v.join(',') : v);
    if (h.get('Origin') === local) h.set('Origin', origin);
    h.set('cf-connecting-ip', '192.0.2.99');
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = Buffer.concat(chunks);
    const r = await worker.fetch(
      new Request(origin + req.url, {
        method: req.method,
        headers: h,
        ...(body.length ? { body } : {}),
      }),
      env,
      {},
    );
    wire.push({ path: req.url, method: req.method, status: r.status });
    res.writeHead(r.status, Object.fromEntries(r.headers));
    res.end(Buffer.from(await r.arrayBuffer()));
  } catch {
    res.writeHead(500);
    res.end('LOCAL_TEST_FAILURE');
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const local = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  ...(process.env.QA_CHROMIUM_PATH
    ? { executablePath: process.env.QA_CHROMIUM_PATH }
    : {}),
  headless: true,
  args: ['--no-sandbox', '--disable-background-networking'],
});
const context = await browser.newContext({
  httpCredentials: { username: 'qa', password: token, origin: local },
});
await context.route('**/*', (route) =>
  new URL(route.request().url()).origin === local
    ? route.continue()
    : route.abort(),
);
const page = await context.newPage();
const rowCount = () =>
  sql.prepare('SELECT count(*) n FROM diagnostic_reports').get().n;
const ready = () =>
  page.waitForFunction(() =>
    document.querySelector('output')?.textContent.includes('受付できます'),
  );
try {
  await page.goto(local + '/diagnostic-feedback?legacy');
  await page.waitForFunction(() =>
    document
      .querySelector('output')
      ?.textContent.includes('受付を確認できません。送信できません'),
  );
  assert(
    wire.some((r) => r.path === '/api/diagnostic-feedback' && r.status === 401),
  );
  assert.equal(observed.length, 0);
  assert.equal(rowCount(), 0);
  console.log(
    'PASS legacy: actual browser omit excludes cached Basic credentials; GET 401 and exact UI error, no app/DB call.',
  );
  await context.addCookies([
    {
      name: 'synthetic-owner',
      value: 'existing',
      url: local,
      httpOnly: true,
      sameSite: 'Strict',
    },
  ]);
  await page.goto(local + '/diagnostic-feedback');
  await ready();
  await page.getByRole('button', { name: 'この内容を確認画面へ' }).click();
  const send = page.getByRole('button', { name: '確認した内容だけ送信' });
  assert(await send.isDisabled());
  assert.equal(observed.filter((r) => r.method === 'POST').length, 0);
  const consent = page.getByRole('checkbox');
  await consent.check();
  await page.getByLabel('本人の結果').selectOption('improved');
  await page.getByRole('button', { name: 'この内容を確認画面へ' }).click();
  assert(!(await consent.isChecked()));
  assert(await send.isDisabled());
  assert.equal(rowCount(), 0);
  await consent.check();
  await send.click();
  await page.waitForFunction(() =>
    document
      .querySelector('output')
      ?.textContent.includes('保存を確認しました'),
  );
  assert.equal(rowCount(), 1);
  assert.equal(observed.filter((r) => r.method === 'POST').length, 1);
  const saved = sql
    .prepare('SELECT report_json FROM diagnostic_reports')
    .get().report_json;
  assert(!saved.includes('synthetic-owner') && !saved.includes(token));
  await page.getByRole('button', { name: 'この受付番号の報告を削除' }).click();
  await page.waitForFunction(() =>
    document
      .querySelector('output')
      ?.textContent.includes('削除リクエストを処理しました'),
  );
  assert.equal(rowCount(), 0);
  assert.equal(
    sql.prepare('SELECT count(*) n FROM diagnostic_report_tombstones').get().n,
    1,
  );
  assert(
    observed
      .filter((r) => !r.diagnosis)
      .every((r) => !r.hasCookie && !r.hasAuthorization),
  );
  const diagnosis = await page.evaluate(() =>
    fetch('/api/diagnosis/cookie-probe', { credentials: 'same-origin' }).then(
      (r) => r.json(),
    ),
  );
  assert.equal(diagnosis.ok, true);
  assert(
    observed.some((r) => r.diagnosis && r.hasCookie && !r.hasAuthorization),
  );
  assert(
    (await context.cookies()).some(
      (c) => c.name === 'synthetic-owner' && c.value === 'existing',
    ),
  );
  console.log(
    'PASS fixed: browser GET/POST/DELETE, explicit/reconfirmed consent, SQLite report/tombstone, feedback Cookie/auth scrub, diagnosis Cookie preserved.',
  );
  // A same-origin page cannot spoof browser Origin; raw requests exercise server-side CSRF separately.
  const auth = 'Basic ' + Buffer.from('qa:' + token).toString('base64');
  for (const headers of [
    {},
    { Origin: 'https://evil.invalid' },
    { Origin: local, 'Sec-Fetch-Site': 'cross-site' },
  ]) {
    const count = observed.length;
    const r = await fetch(local + '/api/diagnostic-feedback', {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: '{}',
    });
    assert.equal(r.status, 403);
    assert.equal(observed.length, count);
  }
  const noAuth = await fetch(local + '/api/diagnostic-feedback');
  assert.equal(noAuth.status, 401);
  redirectFeedback = true;
  const beforeRedirect = observed.filter((r) => r.diagnosis).length;
  await page.reload();
  await page.waitForFunction(() =>
    document
      .querySelector('output')
      ?.textContent.includes('受付を確認できません'),
  );
  assert.equal(observed.filter((r) => r.diagnosis).length, beforeRedirect);
  redirectFeedback = false;
  clock = Number(env.QA_ACCESS_EXPIRES_AT);
  const beforeExpired = observed.length;
  const expired = await page.evaluate(() =>
    fetch('/api/diagnostic-feedback', { credentials: 'same-origin' }).then(
      (r) => r.status,
    ),
  );
  assert.equal(expired, 503);
  assert.equal(observed.length, beforeExpired);
  console.log(
    'PASS protections: unauthenticated 401, mutation Origin/Fetch-Site 403, redirect refused, expiry 503 before app.',
  );
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  sql.close();
}
