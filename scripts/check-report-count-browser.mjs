// All requests intercepted locally. Never reads/writes production reports.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const { chromium, expect } = await import(
  process.env.PLAYWRIGHT_TEST_MODULE || '@playwright/test'
);
const copies = await build({
  stdin: {
    contents: "export {reportCopy} from './lib/community-reports/copy';",
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { reportCopy } = await import(
  'data:text/javascript;base64,' +
    Buffer.from(copies.outputFiles[0].text).toString('base64')
);
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  for (const locale of ['ja', 'en', 'zh', 'es']) {
    const b = await build({
      stdin: {
        contents: `import React from 'react';import {createRoot} from 'react-dom/client';import {CommunityReportCount} from './components/community-report-count';createRoot(document.getElementById('root')).render(<CommunityReportCount gameSlug="overwatch-2" locale="${locale}"/>);`,
        resolveDir: process.cwd(),
        loader: 'tsx',
      },
      bundle: true,
      write: false,
      platform: 'browser',
      jsx: 'automatic',
      format: 'iife',
      define: { 'process.env.NODE_ENV': '"production"' },
    });
    const page = await browser.newPage({
      viewport: { width: 360, height: 780 },
    });
    await page.clock.install();
    let reads = 0,
      mode = 'ok';
    await page.route('**/*', async (route) => {
      const request = route.request();
      assert.equal(request.method(), 'GET');
      const url = new URL(request.url());
      if (url.pathname === '/')
        return route.fulfill({
          contentType: 'text/html',
          body: '<div id="root"></div>',
        });
      reads++;
      assert.equal(url.pathname, '/api/reports/public');
      assert.equal(url.searchParams.get('game'), 'overwatch-2');
      assert.equal(url.searchParams.get('count'), 'true');
      return route.fulfill({
        status: mode === 'error' ? 503 : 200,
        contentType: 'application/json',
        body: JSON.stringify({
          count: 2,
          checkedAt:
            Math.floor((await page.evaluate(() => Date.now())) / 1000) -
            (mode === 'stale' ? 120 : 0),
        }),
      });
    });
    await page.goto('http://127.0.0.1/');
    await page.addScriptTag({ content: b.outputFiles[0].text });
    const t = reportCopy[locale],
      button = page.getByRole('button', { name: t.countCheck, exact: true });
    await expect(button).toBeVisible();
    assert.equal(reads, 0, 'no automatic budget use');
    await button.click();
    await expect(page.locator('output')).toContainText(
      t.countLabel.replace('{count}', '2'),
    );
    await page.clock.runFor(61000);
    await expect(page.locator('output')).toHaveText(t.countExpired);
    assert.equal(reads, 1, 'no polling');
    mode = 'stale';
    await button.click();
    await expect(page.locator('output')).toHaveText(t.countUnavailable);
    mode = 'error';
    await button.click();
    await expect(page.locator('output')).toHaveText(t.countUnavailable);
    assert.equal(
      await page.locator('time').count(),
      0,
      'failed reads cannot retain old count',
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await page.close();
    console.log(
      `PASS ${locale}: explicit no-store count read, expiry, stale/error hiding, no polling, mobile`,
    );
  }
} finally {
  await browser.close();
}
