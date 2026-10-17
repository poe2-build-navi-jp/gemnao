// Isolated browser component; all HTTP is synthetic and no report is submitted.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const { chromium, expect } = await import(
  process.env.PLAYWRIGHT_TEST_MODULE || '@playwright/test'
);
const copies = await build({
  stdin: {
    contents:
      "export {reportCopy} from './lib/community-reports/copy';export {validReportVersion} from './lib/community-reports/model';",
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { reportCopy, validReportVersion } = await import(
  'data:text/javascript;base64,' +
    Buffer.from(copies.outputFiles[0].text).toString('base64')
);
for (const x of ['', '1.2.3', '1A+_-', '1'.repeat(24)])
  assert.equal(validReportVersion(x), true);
for (const x of [
  'QA-SYNTHETIC-NOT-SUBMITTED',
  'v1',
  '１.２',
  '1'.repeat(25),
  '1 2',
  null,
])
  assert.equal(validReportVersion(x), false);
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  for (const locale of ['ja', 'en', 'zh', 'es']) {
    const b = await build({
      stdin: {
        contents: `import React from 'react';import {createRoot} from 'react-dom/client';import {CommunityReports} from './components/community-reports';createRoot(document.getElementById('root')).render(<CommunityReports locale="${locale}"/>);`,
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
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    page.on('pageerror', (e) => console.error(e.message));
    let posts = 0;
    await page.route('**/*', async (route) => {
      const req = route.request();
      if (req.method() !== 'GET') {
        posts++;
        return route.abort();
      }
      const path = new URL(req.url()).pathname;
      if (path === '/')
        return route.fulfill({
          contentType: 'text/html',
          body: '<div id="root"></div>',
        });
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(
          path.endsWith('/status')
            ? { enabled: true, publicEnabled: true, canDelete: true }
            : { items: [] },
        ),
      });
    });
    await page.goto('http://127.0.0.1/');
    await page.addScriptTag({ content: b.outputFiles[0].text });
    const t = reportCopy[locale];
    await page.locator('select').first().selectOption('overwatch-2');
    await page.locator('select').nth(1).selectOption({ index: 1 });
    await page.locator('.report-step-list input').first().check();
    const version = page.getByLabel(t.version, { exact: true });
    await version.fill('QA-SYNTHETIC-NOT-SUBMITTED');
    await expect(version).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#report-version-hint')).toHaveText(
      t.versionHint,
    );
    await expect(page.locator('#report-version-error')).toHaveText(
      t.versionError,
    );
    await page.getByRole('button', { name: t.preview, exact: true }).click();
    await expect(page.locator('.report-preview')).toHaveCount(0);
    await expect(
      page.getByText(t.draftInvalid + ' ' + t.versionError, { exact: true }),
    ).toBeVisible();
    assert.equal(
      (await page.locator('body').innerText()).includes(t.failure),
      false,
    );
    await version.fill('');
    await expect(version).toHaveAttribute('aria-invalid', 'false');
    await page.getByRole('button', { name: t.preview, exact: true }).click();
    await expect(page.locator('.report-preview')).toBeVisible();
    // Old draft shape is still valid; optional values round-trip locally.
    await expect(
      page.getByLabel(t.previouslyWorked, { exact: true }),
    ).toHaveValue('');
    await expect(page.getByLabel(t.recentChange, { exact: true })).toHaveValue(
      '',
    );
    await page
      .getByLabel(t.previouslyWorked, { exact: true })
      .selectOption('yes');
    await page
      .getByLabel(t.recentChange, { exact: true })
      .selectOption('driver-update');
    await page.getByRole('button', { name: t.saveDraft, exact: true }).click();
    const saved = await page.evaluate(
      () => JSON.parse(localStorage.getItem('gemnao-report-draft-v1')).content,
    );
    assert.equal(saved.previouslyWorked, 'yes');
    assert.equal(saved.recentChange, 'driver-update');
    await page.reload();
    await page.addScriptTag({ content: b.outputFiles[0].text });
    await expect(
      page.getByLabel(t.previouslyWorked, { exact: true }),
    ).toHaveValue('yes');
    await expect(page.getByLabel(t.recentChange, { exact: true })).toHaveValue(
      'driver-update',
    );
    await page.getByRole('button', { name: t.preview, exact: true }).click();
    await expect(page.locator('.report-preview')).toContainText(
      t.previousStates.yes,
    );
    await expect(page.locator('.report-preview')).toContainText(
      t.recentChanges['driver-update'],
    );
    await page.getByLabel(t.consent, { exact: true }).check();
    await expect(
      page.getByRole('button', { name: t.send, exact: true }),
    ).toBeEnabled();
    await page.evaluate(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException('blocked', 'QuotaExceededError');
      };
    });
    await page.getByRole('button', { name: t.saveDraft, exact: true }).click();
    await expect(
      page.getByText(t.draftStorageError, { exact: true }),
    ).toBeVisible();
    assert.equal(posts, 0);
    await page.close();
    console.log(
      `PASS ${locale}: format, inline error, local failure, preview/consent, no submission`,
    );
  }
} finally {
  await browser.close();
}
