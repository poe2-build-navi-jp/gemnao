// Loopback-only integration of the real QA component, handlers and SQLite D1 adapters.
// Never contacts Cloudflare, production, or an external proxy.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const out = '.wrangler/diagnosis-qa-browser';
await mkdir(out, { recursive: true });
await build({ stdin: { contents: `
  export { setup, testAdmin, origin } from './tests/diagnosis/qa-fixture';
  export { handleQa, qaShareAllowed, qaDiagnosisEnv } from './lib/diagnosis/qa';
  export { handleDiagnosis } from './lib/diagnosis/server';
  export { handleFeedback } from './lib/diagnostic-feedback/service';
  export { configuredAdminToken } from './lib/admin-cookie';`, loader: 'ts', resolveDir: process.cwd() },
  bundle: true, platform: 'node', format: 'esm', packages: 'external', outfile: `${out}/handlers.mjs` });
const h = await import('../../' + out + '/handlers.mjs');
await build({ stdin: { contents: `import React from 'react';import { createRoot } from 'react-dom/client';
  import { DiagnosisQa } from './components/diagnosis-qa';
  createRoot(document.getElementById('root')).render(<main><h1>診断の限定テスト</h1><DiagnosisQa /></main>);`, loader: 'tsx', resolveDir: process.cwd() },
  bundle: true, platform: 'browser', format: 'esm', outfile: `${out}/bundle.js`,
  define: { 'process.env.NODE_ENV': '"production"' } });
let s = h.setup(), dropSaveResponse = false;
const server = createServer(async (req, res) => {
  try {
    const path = req.url?.split('?')[0];
    if (path === '/bundle.js') { res.writeHead(200, { 'Content-Type': 'text/javascript' }); res.end(await readFile(`${out}/bundle.js`)); return; }
    if (path === '/admin/diagnosis-qa') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<!doctype html><html lang="ja"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:sans-serif;margin:20px;line-height:1.6}button,input{font:inherit;margin:6px;padding:8px}main{max-width:850px;margin:auto}output{display:block;padding:12px;background:#eef}a{margin:8px}button:disabled{opacity:.4}</style><div id="root"></div><script type="module" src="/bundle.js"></script></html>'); return; }
    if (path === '/favicon.ico') { res.writeHead(404); res.end(); return; }
    const body = []; for await (const chunk of req) body.push(chunk);
    // Local harness presents requests to the hard-coded production-origin policy in memory only.
    const headers = new Headers(req.headers); headers.set('Origin', h.origin); headers.set('CF-Connecting-IP', '192.0.2.45'); headers.delete('content-length');
    const request = new Request(h.origin + path, { method: req.method, headers, ...(body.length ? { body: Buffer.concat(body) } : {}) });
    let response;
    if (path === '/api/admin/discord-servers/login') {
      const input = await request.json(); const ok = await h.configuredAdminToken(input.token, { hash: s.env.DISCORD_ADMIN_TOKEN_HASH });
      response = Response.json({ ok }, { status: ok ? 200 : 401, headers: ok ? { 'Set-Cookie': 'gemnao_discord_admin=' + encodeURIComponent(input.token) + '; HttpOnly; SameSite=Strict; Path=/' } : {} });
    } else if (path === '/api/admin/diagnosis-qa') {
      const input = req.method === 'POST' ? JSON.parse(Buffer.concat(body).toString()) : null;
      response = await h.handleQa(request, s.env, s.window, s.clock.now);
      if (dropSaveResponse && input?.op === 'create' && input.slot === 'diagnosis-a' && response.status === 201) {
        dropSaveResponse = false; response = new Response('Simulated lost response', { status: 503 });
      }
    } else if (path === '/api/diagnostic-feedback') response = await h.handleFeedback(request, s.env, s.clock.now / 1000);
    else if (path?.startsWith('/api/diagnosis/')) {
      const id = path.match(/^\/api\/diagnosis\/([a-f0-9]{32})$/)?.[1];
      const allowed = id && await h.qaShareAllowed(request, s.env, id, s.window, s.clock.now);
      response = await h.handleDiagnosis(request, allowed ? h.qaDiagnosisEnv(s.env) : s.env, s.clock.now);
    } else if (path?.startsWith('/diagnosis/')) {
      const id = path.split('/').pop(); const allowed = await h.qaShareAllowed(request, s.env, id, s.window, s.clock.now);
      response = new Response(allowed ? '<h1>トラブル診断結果</h1>' : '共有は現在停止しています。', { status: allowed ? 200 : 503,
        headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow', 'Content-Type': 'text/html; charset=utf-8' } });
    } else response = new Response('No harness route', { status: 404 });
    res.writeHead(response.status, Object.fromEntries(response.headers)); res.end(Buffer.from(await response.arrayBuffer()));
  } catch { res.writeHead(500); res.end('Local harness error'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
let browser;
const counts = () => ({ diagnosis: Number(s.diagnosis.sql.prepare('SELECT count(*) n FROM diagnosis_shared').get().n), feedback: Number(s.feedback.sql.prepare('SELECT count(*) n FROM diagnostic_reports').get().n) });
async function open() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
  const page = await context.newPage();
  await page.goto(base + '/admin/diagnosis-qa');
  await page.getByLabel('既存の管理キー').fill(h.testAdmin);
  await page.getByRole('button', { name: 'ログイン', exact: true }).click();
  await expect(page.locator('output')).toContainText('一般受付はOFF');
  await page.getByRole('checkbox').check();
  return { context, page };
}
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  {
    const { context, page } = await open();
    await page.getByRole('button', { name: '1. 架空4件を保存', exact: true }).click();
    await expect(page.locator('output')).toContainText('4件を保存しました'); assert.deepEqual(counts(), { diagnosis: 2, feedback: 2 });
    await page.reload(); await expect(page.locator('output')).toContainText('一般受付はOFF'); await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: '1. 架空4件を保存', exact: true }).click();
    await expect(page.locator('output')).toContainText('4件を保存しました'); assert.deepEqual(counts(), { diagnosis: 2, feedback: 2 });
    await page.getByRole('button', { name: '2. 共有・保護を確認', exact: true }).click();
    await expect(page.locator('output')).toContainText('共有と保護を確認しました');
    await page.getByRole('button', { name: '3. 4件を削除して終了', exact: true }).click();
    await expect(page.locator('output')).toContainText('4件の削除と一時権限の停止を確認しました'); assert.deepEqual(counts(), { diagnosis: 0, feedback: 0 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('gemnao-limited-qa-v1')));
    assert.equal(stored.phase, 'complete'); assert.ok(stored.evidence.every(e => e.status === 'pass'));
    assert.ok(Object.values(stored.records).every(r => !r.key));
    const downloadPromise = page.waitForEvent('download'); await page.getByRole('button', { name: '結果だけ保存（キーを含みません）', exact: true }).click();
    const downloaded = await downloadPromise; const text = await readFile(await downloaded.path(), 'utf8');
    assert.doesNotMatch(text, /delete_key|__Host-|gemnao_discord_admin|synthetic-local-admin-only/);
    await page.screenshot({ path: `${out}/completed-mobile.png`, fullPage: true });
    await context.close(); console.log('PASS browser: login/save 4/reload-repeat/share/privacy/delete/no resurrection/close/sanitized receipt/mobile width');
  }
  {
    s = h.setup(); const { context, page } = await open();
    await page.getByRole('button', { name: '1. 架空4件を保存', exact: true }).click();
    await expect(page.locator('output')).toContainText('4件を保存しました');
    s.clock.now = s.window.expiresAt; s.window.enabled = false; // Prepared retirement must preserve the old tab's cleanup.
    await page.getByRole('button', { name: '状態を確認', exact: true }).click(); await expect(page.locator('output')).toContainText('停止中');
    await page.getByRole('button', { name: '中止・未削除分を削除', exact: true }).click();
    await expect(page.locator('output')).toContainText('試験データを削除しました'); assert.deepEqual(counts(), { diagnosis: 0, feedback: 0 });
    await context.close(); console.log('PASS browser: expiry stops exceptions while normal owner deletion survives');
  }
  {
    s = h.setup(); dropSaveResponse = true; const { context, page } = await open();
    await page.getByRole('button', { name: '1. 架空4件を保存', exact: true }).click();
    await expect(page.locator('output')).toContainText('診断A保存を確認できません'); assert.deepEqual(counts(), { diagnosis: 1, feedback: 0 });
    s.clock.now = s.window.expiresAt; s.window.enabled = false; // Prepared retirement must preserve the old tab's cleanup.
    await page.getByRole('button', { name: '中止・未削除分を削除', exact: true }).click();
    await expect(page.locator('output')).toContainText('試験データを削除しました'); assert.deepEqual(counts(), { diagnosis: 0, feedback: 0 });
    await context.close(); console.log('PASS browser: predeclared diagnosis IDs permit owner deletion after lost response and expiry');
  }
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
