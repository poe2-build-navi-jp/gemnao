import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
const { chromium, expect } = await import(
  process.env.PLAYWRIGHT_TEST_MODULE || '@playwright/test'
);
const bundled = await build({
  stdin: {
    contents: `import React from 'react';import {createRoot} from 'react-dom/client';import {MyGamesBackup} from './components/my-games-backup';import {useReadingList} from './components/use-reading-list';function Observer(){const {items}=useReadingList();return <div id="reading-observer">{items.map(i=><p key={i.path}>{i.title}</p>)}</div>}createRoot(document.getElementById('root')).render(<><MyGamesBackup locale={window.testLocale}/><Observer/></>);`,
    loader: 'tsx',
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'iife',
  jsx: 'automatic',
});
const copyBundle = await build({
  entryPoints: ['lib/my-games-transfer-copy.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { myGamesTransferCopy: copy } = await import(
  'data:text/javascript;base64,' +
    Buffer.from(copyBundle.outputFiles[0].text).toString('base64')
);
const css = (await readFile('app/globals.css', 'utf8')).replace(
  "@import 'tailwindcss';",
  '',
);
const key = 'gemnao-reading-list-v1';
const item = {
  path: '/games/aniimo/not-launching',
  title: 'PRIVATE_SAVED_ARTICLE',
  savedAt: '2026-10-18T01:00:00.000Z',
};
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
await mkdir('/tmp/gemnao-reading-backup', { recursive: true });
try {
  for (const locale of ['ja', 'en', 'zh', 'es']) {
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();
    const requests = [];
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.route('**/*', (r) => {
      requests.push(r.request().url());
      return r.request().url() === 'http://127.0.0.1:8797/test'
        ? r.fulfill({
            contentType: 'text/html',
            body: `<style>${css}</style><main id="root" class="static-page"></main>`,
          })
        : r.abort();
    });
    await page.goto('http://127.0.0.1:8797/test');
    await page.evaluate(
      ({ key, item, locale }) => {
        window.testLocale = locale;
        localStorage.setItem(
          key,
          JSON.stringify({ version: 1, items: [item] }),
        );
        localStorage.setItem('gemnao-recent-troubles', 'EXCLUDED_HISTORY');
        localStorage.setItem('auth-test', 'PRESERVE_AUTH');
      },
      { key, item, locale },
    );
    await page.addScriptTag({ content: bundled.outputFiles[0].text });
    const t = copy[locale],
      panel = page.locator('#my-games-backup');
    const downloadPromise = page.waitForEvent('download');
    await panel.getByRole('button', { name: t.export, exact: true }).click();
    const download = await downloadPromise;
    const file = `/tmp/gemnao-reading-backup/${locale}.json`;
    await download.saveAs(file);
    const raw = await readFile(file, 'utf8');
    const exported = JSON.parse(raw);
    assert.equal(exported.version, 2);
    assert.deepEqual(exported.data.reading, [item]);
    assert.ok(!raw.includes('EXCLUDED_HISTORY'));
    assert.ok(!raw.includes('PRESERVE_AUTH'));
    await page.evaluate((key) => {
      localStorage.removeItem(key);
      window.dispatchEvent(new Event('gemnao-my-data'));
    }, key);
    async function upload(text) {
      await panel.getByLabel(t.file, { exact: true }).setInputFiles({
        name: 'backup.json',
        mimeType: 'application/json',
        buffer: Buffer.from(text),
      });
    }
    await upload(raw);
    await expect(panel.getByText(t.reading, { exact: true })).toBeVisible();
    for (const width of [390, 1165]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await panel.screenshot({
        path: `/tmp/gemnao-reading-backup/${locale}-${width}.png`,
      });
    }
    await panel.getByRole('checkbox', { name: t.check, exact: true }).check();
    await panel.getByRole('button', { name: t.confirm, exact: true }).click();
    await expect(panel.getByText(t.restored, { exact: true })).toBeVisible();
    assert.deepEqual(
      await page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)).items,
        key,
      ),
      [item],
    );
    await expect(page.locator('#reading-observer')).toContainText(item.title);
    const before = await page.evaluate(() =>
      Object.fromEntries(
        Object.keys(localStorage).map((key) => [
          key,
          localStorage.getItem(key),
        ]),
      ),
    );
    const v1 = { ...exported, version: 1, data: { ...exported.data } };
    delete v1.data.reading;
    await upload(JSON.stringify(v1));
    await panel.getByRole('checkbox', { name: t.check, exact: true }).check();
    await panel.getByRole('button', { name: t.confirm, exact: true }).click();
    await expect(panel.getByText(t.restored, { exact: true })).toBeVisible();
    assert.deepEqual(
      await page.evaluate(() =>
        Object.fromEntries(
          Object.keys(localStorage).map((key) => [
            key,
            localStorage.getItem(key),
          ]),
        ),
      ),
      before,
    );
    for (const invalid of [
      '{',
      JSON.stringify({
        ...exported,
        data: {
          ...exported.data,
          reading: [{ ...item, path: 'https://evil.example' }],
        },
      }),
      ' '.repeat(5_000_001),
    ]) {
      await upload(invalid);
      await expect(panel.getByRole('alert')).toBeVisible();
      assert.deepEqual(
        await page.evaluate(() =>
          Object.fromEntries(
            Object.keys(localStorage).map((key) => [
              key,
              localStorage.getItem(key),
            ]),
          ),
        ),
        before,
      );
    }
    assert.equal(requests.length, 1);
    assert.deepEqual(errors, []);
    console.log(
      `PASS browser ${locale}: real download/import, v1 preserved, live reading refresh, malformed/unsafe/oversized rejection, no uploads, 390/1165`,
    );
    await context.close();
  }
} finally {
  await browser.close();
}
