// Isolated component UI with synthetic network responses, never the live intake.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const fixture = JSON.parse(
  await readFile('/tmp/private-native-fixture.json', 'utf8'),
);
const result = await build({
  stdin: {
    contents:
      "import React from 'react';import{createRoot}from'react-dom/client';import{PrivateDiagnosticForm}from'./components/private-diagnostic-form';import{PrivateDiagnosticAdmin}from'./components/private-diagnostic-admin';createRoot(document.getElementById('root')).render(location.pathname==='/admin'?<PrivateDiagnosticAdmin/>:<PrivateDiagnosticForm/>);",
    loader: 'tsx',
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  jsx: 'automatic',
});
const server = createServer((req, res) => {
  res.setHeader(
    'Content-Type',
    req.url === '/bundle.js' ? 'application/javascript' : 'text/html',
  );
  res.end(
    req.url === '/bundle.js'
      ? result.outputFiles[0].text
      : '<!doctype html><meta charset="utf-8"><main id="root"></main><script src="/bundle.js"></script>',
  );
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
let count = 0;
async function page(mode = 'success', enabled = true, path = '/') {
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await p.route('**/*', (r) =>
    r.request().url().startsWith(base) ? r.continue() : r.abort(),
  );
  await p.addInitScript(
    ({ mode, enabled }) => {
      window.calls = [];
      window.mode = mode;
      window.fetch = async (url, opts = {}) => {
        const method = opts.method || 'GET';
        window.calls.push({
          url,
          method,
          body: opts.body,
          credentials: opts.credentials,
        });
        if (url.startsWith('/api/admin')) {
          if (window.mode === 'unauthorized')
            return new Response('{}', { status: 401 });
          return new Response(JSON.stringify({ items: [], next: null }));
        }
        if (method === 'GET')
          return new Response(JSON.stringify({ enabled, canDelete: true }));
        if (method === 'DELETE') return new Response('{"ok":true}');
        const payload = JSON.parse(opts.body);
        if (window.mode === 'network')
          throw new TypeError('synthetic lost response');
        if (window.mode === 'rejected')
          return new Response('{}', { status: 429 });
        if (window.mode === 'wrong-receipt')
          return new Response(
            JSON.stringify({ ok: true, receipt_id: 'bad', expires_at: 123 }),
          );
        if (window.mode === 'wait')
          await new Promise((resolve) => (window.release = resolve));
        return new Response(
          JSON.stringify({
            ok: true,
            receipt_id: payload.receipt_id,
            expires_at: Math.floor(Date.now() / 1000) + 86400,
          }),
        );
      };
    },
    { mode, enabled, fixture },
  );
  await p.goto(base + path);
  return p;
}
async function load(p, data = fixture) {
  await p.getByLabel('Import JSON').setInputFiles({
    name: 'synthetic.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await p.getByText('JSON全文', { exact: true }).waitFor();
}
async function sends(p) {
  return p.evaluate(() => window.calls.filter((x) => x.method === 'POST'));
}
try {
  let p = await page();
  await load(p);
  assert.match(await p.locator('#private-use-purpose').innerText(), /原文公開、第三者販売、別目的/);
  assert.match(await p.locator('#private-retention-policy').innerText(), /30日で閲覧できなく/);
  assert.match(await p.locator('#private-retention-policy').innerText(), /1時間以内/);
  assert.equal(await p.getByRole('checkbox').getAttribute('aria-describedby'), 'private-use-purpose private-retention-policy');
  await p.getByText('中文 / Español — 保存方针 / Política de conservación', {exact:true}).click();
  assert.match(await p.locator('p[lang="zh-Hans"]').allTextContents().then(x=>x.join(' ')), /30天/);
  assert.match(await p.locator('p[lang="es"]').allTextContents().then(x=>x.join(' ')), /30 días/);
  assert.equal(await p.getByRole('checkbox').isChecked(), false);
  assert.equal(
    await p
      .getByRole('button', { name: '確認した内容を送信する' })
      .isDisabled(),
    true,
  );
  assert.equal((await sends(p)).length, 0);
  await p.getByRole('checkbox').check();
  await p.getByRole('button', { name: '確認した内容を送信する' }).click();
  await p
    .getByText('ゲムなおへの非公開保存を確認しました。', { exact: false })
    .waitFor();
  assert.equal((await sends(p)).length, 1);
  assert.equal((await sends(p))[0].credentials, 'omit');
  assert.equal(
    await p
      .getByRole('button', { name: '確認した内容を送信する' })
      .isDisabled(),
    true,
  );
  count++;
  await p.close();
  p = await page('network');
  await load(p);
  await p.getByRole('checkbox').check();
  await p.getByRole('button', { name: '確認した内容を送信する' }).click();
  await p.getByText('保存されたか確認できません。', { exact: false }).waitFor();
  const first = JSON.parse((await sends(p))[0].body);
  await p.evaluate(() => (window.mode = 'success'));
  await p.getByRole('button', { name: '確認した内容を送信する' }).click();
  await p
    .getByText('ゲムなおへの非公開保存を確認しました。', { exact: false })
    .waitFor();
  assert.deepEqual(JSON.parse((await sends(p))[1].body), first);
  count++;
  await p.close();
  p = await page('wait');
  await load(p);
  await p.getByRole('checkbox').check();
  await p
    .getByRole('button', { name: '確認した内容を送信する' })
    .evaluate((e) => {
      e.click();
      e.click();
    });
  await p.waitForFunction(() => typeof window.release === 'function');
  assert.equal((await sends(p)).length, 1);
  await p.evaluate(() => window.release());
  await p
    .getByText('ゲムなおへの非公開保存を確認しました。', { exact: false })
    .waitFor();
  count++;
  await p.close();
  for (const mode of ['rejected', 'wrong-receipt']) {
    p = await page(mode);
    await load(p);
    await p.getByRole('checkbox').check();
    await p.getByRole('button', { name: '確認した内容を送信する' }).click();
    await p
      .getByText(
        mode === 'rejected'
          ? '今回の送信は受け付けられませんでした。'
          : '保存されたか確認できません。',
        { exact: false },
      )
      .waitFor();
    assert.equal(
      await p
        .getByText('ゲムなおへの非公開保存を確認しました。', { exact: false })
        .count(),
      0,
    );
    count++;
    await p.close();
  }
  p = await page('success', false);
  await load(p);
  await p.getByRole('checkbox').check();
  assert.equal(
    await p
      .getByRole('button', { name: '確認した内容を送信する' })
      .isDisabled(),
    true,
  );
  assert.equal((await sends(p)).length, 0);
  count++;
  await p.close();
  p = await page();
  await p.getByLabel('Import JSON').setInputFiles({
    name: 'raw.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({ ...fixture, raw: 'SYNTHETIC_PRIVATE' }),
    ),
  });
  await p.getByRole('alert').waitFor();
  assert.equal((await sends(p)).length, 0);
  assert.equal(await p.getByRole('checkbox').isChecked(), false);
  count++;
  await p.close();
  p = await page();
  await load(p, first);
  assert.equal(await p.getByRole('checkbox').isChecked(), false);
  await p.getByRole('checkbox').check();
  await p.getByRole('button', { name: '確認した内容を送信する' }).click();
  await p
    .getByText('ゲムなおへの非公開保存を確認しました。', { exact: false })
    .waitFor();
  assert.deepEqual(JSON.parse((await sends(p))[0].body), first);
  p.on('dialog', (d) => d.accept());
  await p.getByRole('button', { name: 'この受付の削除を依頼' }).click();
  await p.getByText('削除要求を処理しました。', { exact: false }).waitFor();
  count++;
  await p.close();
  p = await page();
  await load(p);
  await p.getByRole('combobox').selectOption('en');
  assert.match(await p.locator('#private-use-purpose').innerText(), /sale to third parties/);
  assert.match(await p.locator('#private-retention-policy').innerText(), /inaccessible 30 days/);
  assert.equal(await p.getByRole('checkbox').isChecked(), false);
  await p.getByRole('checkbox').check();
  await p.getByRole('button', { name: 'Send reviewed content' }).click();
  await p
    .getByText('Private storage at Gemnao is confirmed.', { exact: false })
    .waitFor();
  count++;
  await p.close();
  p = await page('unauthorized', true, '/admin');
  await p.getByRole('button', { name: '一覧を読む' }).click();
  await p
    .getByText('既存の運営者認証、または閲覧の有効設定が必要です。')
    .waitFor();
  assert.equal(await p.locator('pre').count(), 0);
  count++;
  await p.close();
  console.log(
    `PASS ${count} synthetic Chromium UI groups: consent, no auto POST, duplicate lock, uncertain/rejected/confirmed, stable retry/reimport, deletion, JA/EN, closed intake, admin denial. Not Windows app validation.`,
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
