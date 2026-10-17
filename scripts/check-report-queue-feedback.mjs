import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
const { chromium, expect } = await import(
  process.env.PLAYWRIGHT_TEST_MODULE || '@playwright/test'
);
const result = await build({
  stdin: {
    contents:
      "import React from 'react';import {createRoot} from 'react-dom/client';import {CommunityReportsAdmin} from './components/community-reports-admin';createRoot(document.getElementById('root')).render(<CommunityReportsAdmin/>);",
    loader: 'tsx',
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'iife',
  jsx: 'automatic',
});
const css = await readFile('app/globals.css', 'utf8');
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
await mkdir('/tmp/gemnao-report-queue', { recursive: true });
async function setup(bundle) {
  const p = await browser.newPage();
  await p.route('**/*', (r) => r.abort());
  await p.setContent(
    `<style>${css}</style><main id="root" class="static-page"></main>`,
  );
  await p.addScriptTag({ content: bundle });
  return p;
}
async function mock(page, mode, status = 200) {
  await page.evaluate(
    ({ mode, status }) => {
      window.mockCalls = [];
      window.fetch = async (url, options) => {
        window.mockCalls.push({
          url,
          method: options.method || 'GET',
          credentials: options.credentials,
        });
        if (mode === 'network') throw new TypeError('network');
        if (mode === 'wait')
          return new Promise((resolve, reject) => {
            window.resolveQueue = () =>
              resolve(
                new Response(JSON.stringify({ reports: [], next: null })),
              );
            options.signal.addEventListener('abort', () =>
              reject(new DOMException('Aborted', 'AbortError')),
            );
          });
        if (mode === 'bad') return new Response('<invalid>');
        return new Response(
          status === 200
            ? JSON.stringify({
                reports:
                  mode === 'row'
                    ? [
                        {
                          id: 'a'.repeat(32),
                          revision: 1,
                          state: 'deleted',
                          deleted: true,
                          content: null,
                          flags: [],
                          references: [],
                          audit: [],
                        },
                      ]
                    : [],
                next: mode === 'row' ? '1:' + 'a'.repeat(32) : null,
              })
            : '<error>',
          { status },
        );
      };
    },
    { mode, status },
  );
}
try {
  if (process.env.QUEUE_BASELINE) {
    const p = await setup(await readFile(process.env.QUEUE_BASELINE, 'utf8'));
    const b = p.getByRole('button', { name: '一覧を読む', exact: true });
    await mock(p, 'empty');
    await b.click();
    await expect(b).toBeEnabled();
    assert.equal(await p.locator('output').last().innerText(), '');
    let same;
    for (const code of [401, 403, 503]) {
      await mock(p, 'http', code);
      await b.click();
      await expect(b).toBeEnabled();
      const text = await p.locator('output').last().innerText();
      if (same) assert.equal(text, same);
      same = text;
    }
    await p.close();
    console.log(
      'REPRO baseline: empty success has no feedback; 401/403/503 show identical text',
    );
  }
  for (const locale of ['ja', 'en', 'zh', 'es']) {
    const p = await setup(result.outputFiles[0].text);
    await p.getByRole('combobox').selectOption(locale);
    const b = p.locator('.report-workspace > button').first(),
      out = p.locator('.report-queue-status');
    await mock(p, 'wait');
    await b.click();
    await expect(b).toBeDisabled();
    await expect(b).toHaveAttribute('aria-busy', 'true');
    await expect(out).not.toBeEmpty();
    const loading = await out.innerText();
    await b.evaluate((el) => el.click());
    assert.equal(await p.evaluate(() => window.mockCalls.length), 1);
    await p.evaluate(() => window.resolveQueue());
    await expect(b).toBeEnabled();
    const empty = await out.innerText();
    assert.notEqual(empty, loading);
    const messages = new Set([empty]);
    for (const code of [401, 403, 503, 429, 500]) {
      await mock(p, 'http', code);
      await b.click();
      await expect(out).toContainText(String(code));
      await expect(b).toBeEnabled();
      messages.add(await out.innerText());
    }
    assert.equal(messages.size, 6);
    for (const mode of ['network', 'bad']) {
      await mock(p, mode);
      await b.click();
      await expect(b).toBeEnabled();
      messages.add(await out.innerText());
    }
    assert.equal(messages.size, 8);
    await mock(p, 'row');
    await b.click();
    await expect(p.locator('.review-card')).toHaveCount(1);
    await expect(out).toContainText('1');
    assert.equal(await p.locator('.report-workspace > button').count(), 2);
    assert.deepEqual(await p.evaluate(() => window.mockCalls[0]), {
      url: '/api/admin/reports?all=true',
      method: 'GET',
      credentials: 'same-origin',
    });
    await mock(p, 'http', 503);
    await p.locator('.report-workspace > button').last().click();
    await expect(out).toContainText('503');
    await expect(p.locator('.review-card')).toHaveCount(0);
    assert.equal(await p.locator('.report-workspace > button').count(), 1);
    for (const width of [390, 1165]) {
      await p.setViewportSize({ width, height: 900 });
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      const box = await out.boundingBox();
      assert.ok(box.y >= 0 && box.y + box.height <= 900);
      await p.screenshot({
        path: `/tmp/gemnao-report-queue/${locale}-${width}.png`,
        fullPage: true,
      });
    }
    if (locale === 'ja') {
      await mock(p, 'wait');
      await b.click();
      await expect(out).toContainText('10秒', { timeout: 12000 });
      await expect(b).toBeEnabled();
    }
    await p.close();
    console.log(
      `PASS ${locale}: loading/empty/rows, HTTP statuses, malformed/network/timeout, same-origin GET, single flight, stale page removal, 390/1165`,
    );
  }
} finally {
  await browser.close();
}
