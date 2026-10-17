import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
const { chromium, expect } = await import(
  process.env.PLAYWRIGHT_TEST_MODULE || '@playwright/test'
);
const bundle = await build({
  stdin: {
    contents:
      "import React from 'react';import {createRoot} from 'react-dom/client';import {DiscordRtcMemo} from './components/discord-rtc-memo';createRoot(document.getElementById('root')).render(<DiscordRtcMemo/>);",
    loader: 'tsx',
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'iife',
  jsx: 'automatic',
});
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
await mkdir('/tmp/gemnao-content34', { recursive: true });
try {
  const page = await browser.newPage();
  const requests = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.route('**/*', (r) => r.abort());
  await page.setContent(
    `<style>${await readFile('app/globals.css', 'utf8')}</style><main id="root" class="static-page" style="max-width:720px"></main>`,
  );
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  const memo = page.locator('textarea');
  await expect(memo).toHaveAttribute('readonly', '');
  await expect(page.locator('pre')).toContainText(
    '架空の記入例・実際の障害／改善報告ではありません',
  );
  await expect(page.locator('.safety-note')).toContainText('公開IP');
  assert.equal(await page.locator('form,input').count(), 0);
  const template = await memo.inputValue();
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.copiedMemo = text;
        },
      },
    }),
  );
  await page
    .getByRole('button', { name: '相談メモをコピー', exact: true })
    .click();
  await expect(page.locator('output')).toContainText('コピーしました');
  assert.equal(await page.evaluate(() => window.copiedMemo), template);
  assert.ok(!template.includes('20XX'));
  for (const mode of ['denied', 'unavailable']) {
    await page.evaluate(
      (mode) =>
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value:
            mode === 'unavailable'
              ? undefined
              : {
                  writeText: async () => {
                    throw new Error('denied');
                  },
                },
        }),
      mode,
    );
    await page
      .getByRole('button', { name: '相談メモをコピー', exact: true })
      .click();
    await expect(page.locator('output')).toContainText('手動でコピー');
    await expect(memo).toBeFocused();
    assert.equal(
      await memo.evaluate((el) => el.selectionEnd - el.selectionStart),
      template.length,
    );
  }
  for (const width of [390, 1165]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    assert.ok(await memo.evaluate((el) => el.scrollWidth <= el.clientWidth));
    await page.screenshot({
      path: `/tmp/gemnao-content34/rtc-${width}.png`,
      fullPage: true,
    });
  }
  assert.equal(requests.length, 0);
  assert.match(
    await readFile('app/discord/[slug]/page.tsx', 'utf8'),
    /item.slug === 'rtc-connecting' \? <DiscordRtcMemo/,
  );
  console.log(
    'PASS RTC: copy exact template; denied/missing clipboard selects manual fallback; fictional example; no requests; 390/1165 layout',
  );
} finally {
  await browser.close();
}
