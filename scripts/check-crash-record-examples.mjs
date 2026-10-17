// Explanation cards only: no diagnosis, game launch or network requests.
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
const { chromium, expect } = await import(
  process.env.PLAYWRIGHT_TEST_MODULE || '@playwright/test'
);
const result = await build({
  stdin: {
    contents:
      "import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {CrashRecordExamples} from './components/crash-record-examples';import {AceCombatNoticeHistory} from './components/ace-combat-notice-history';export const render=locale=>renderToStaticMarkup(<><CrashRecordExamples locale={locale}/><AceCombatNoticeHistory locale={locale}/></>);",
    loader: 'tsx',
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  banner: {
    js: "import {createRequire} from 'node:module';const require=createRequire(process.cwd()+'/package.json');",
  },
});
const { render } = await import(
  'data:text/javascript;base64,' +
    Buffer.from(result.outputFiles[0].text).toString('base64')
);
const css = await readFile('app/globals.css', 'utf8');
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
await mkdir('/tmp/gemnao-crash-examples', { recursive: true });
try {
  for (const locale of ['ja', 'en']) {
    const page = await browser.newPage();
    await page.route('**/*', (r) => r.abort());
    await page.setContent(
      `<style>${css}</style><main class="static-page">${render(locale)}</main>`,
    );
    await expect(page.locator('.crash-record-cards article')).toHaveCount(3);
    await expect(page.locator('.safety-note')).toContainText(
      locale === 'ja' ? '説明用サンプル' : 'Illustrative samples',
    );
    assert.equal(await page.locator('img,input,form').count(), 0);
    await expect(page.locator('#official-notice-history tbody tr')).toHaveCount(
      4,
    );
    await expect(page.locator('#official-notice-history')).toContainText('37');
    await expect(page.locator('#official-notice-history')).toContainText(
      locale === 'ja' ? '2026年10月18日' : 'October 18, 2026',
    );
    const expected = locale === 'ja' ? '/' : '/en/';
    for (const href of await page
      .locator('.crash-record-cards a')
      .evaluateAll((a) => a.map((x) => x.getAttribute('href'))))
      assert.ok(href.startsWith(expected));
    for (const width of [390, 1165]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
      await page.screenshot({
        path: `/tmp/gemnao-crash-examples/${locale}-${width}.png`,
        fullPage: true,
      });
    }
    await page.close();
    console.log(
      `PASS ${locale}: three explicit samples, caveats, localized links, no form/image, 390/1165 layout`,
    );
  }
  const pages = [
    'components/crash-details.tsx',
    'components/english-crash-guide.tsx',
    'app/tools/windows-diagnosis/page.tsx',
    'app/[locale]/tools/windows-diagnosis/page.tsx',
  ];
  for (const file of pages)
    assert.match(await readFile(file, 'utf8'), /<CrashRecordExamples/);
  for (const locale of ['', '[locale]/'])
    assert.match(
      await readFile(`app/${locale}tools/windows-diagnosis/page.tsx`, 'utf8'),
      /id="use"/,
    );
  assert.match(
    await readFile('components/crash-details.tsx', 'utf8'),
    /id="crash-timing"/,
  );
  assert.match(
    await readFile('lib/localized/crash-guide-en.ts', 'utf8'),
    /id: 'crash-timing'/,
  );
} finally {
  await browser.close();
}
