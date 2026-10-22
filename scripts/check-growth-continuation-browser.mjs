import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8795';
assert(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
await mkdir('/tmp/gemnao-growth-screenshots', { recursive: true });
try {
  for (const locale of ['ja', 'en']) {
    for (const width of [360, 1280]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      await context.route('**/*', (r) => {
        const u = new URL(r.request().url());
        if (u.origin !== base) return r.abort();
        if (u.pathname.startsWith('/api/'))
          return r.fulfill({
            status: r.request().method() === 'POST' ? 503 : 200,
            json: { rows: [], methods: [], stepResultsAvailable: true },
          });
        return r.continue();
      });
      const page = await context.newPage();
      const errors = [],
        badAssets = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('response', (r) => {
        if (/\.(css|js)(\?|$)/.test(r.url()) && r.status() !== 200)
          badAssets.push(r.url());
      });
      const path = `${locale === 'ja' ? '' : '/en'}/games/rocket-league/dualsense-not-working`;
      await page.goto(base + path);
      await expect(page.locator('.article-evidence')).toBeVisible();
      await page.evaluate(() =>
        localStorage.setItem('gemnao-my-games', '["apex-legends"]'),
      );
      await page.locator('#check-connection .step-solved').click();
      const form = page.locator('#check-connection .resolved-fix-save');
      await expect(form).toBeVisible();
      const setting = 'Bluetooth → USB; menu input works';
      await form.locator('textarea').fill(setting);
      // Navigation away before explicit save must leave saved data untouched.
      assert.equal(
        await page.evaluate(() => localStorage.getItem('gemnao-solutions-v1')),
        null,
      );
      await page.goto(base + '/');
      await page.goto(base + path);
      await page.locator('#check-connection .step-solved').click();
      await form.locator('textarea').fill(setting);
      await form.screenshot({
        path: `/tmp/gemnao-growth-screenshots/input-${locale}-${width}.png`,
      });
      await form.locator('button').first().click();
      await expect(form.locator('a')).toBeVisible();
      const saved = await page.evaluate(() =>
        localStorage.getItem('gemnao-solutions-v1'),
      );
      assert.equal(JSON.parse(saved).items[0].settings, setting);
      assert.deepEqual(
        await page.evaluate(() =>
          JSON.parse(localStorage.getItem('gemnao-my-games')),
        ),
        ['apex-legends', 'rocket-league'],
      );
      await form.locator('a').click();
      await expect(page.locator('#my-game-rocket-league')).toBeVisible();
      await expect(
        page.locator('#my-game-rocket-league .saved-game-fixes'),
      ).toContainText(setting);
      await page.goto(base + path);
      await page.locator('#check-connection .step-solved').click();
      await form.locator('textarea').fill('Must not overwrite');
      await form.locator('button').first().click();
      assert.equal(
        await page.evaluate(() => localStorage.getItem('gemnao-solutions-v1')),
        saved,
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page
        .locator('.article-evidence')
        .screenshot({
          path: `/tmp/gemnao-growth-screenshots/evidence-${locale}-${width}.png`,
        });
      await form.screenshot({
        path: `/tmp/gemnao-growth-screenshots/save-${locale}-${width}.png`,
      });
      assert.deepEqual(errors, []);
      assert.deepEqual(badAssets, []);
      await context.close();
      console.log(
        `PASS ${locale} ${width}px: evidence, interrupted save, actual settings, My Games, repeated save, no overflow/errors`,
      );
    }
  }
  const bundled = await build({
    entryPoints: ['lib/diagnosis/local.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
  });
  const { freshLocal } = await import(
    'data:text/javascript;base64,' +
      Buffer.from(bundled.outputFiles[0].contents).toString('base64')
  );
  const context = await browser.newContext({
    viewport: { width: 360, height: 900 },
  });
  await context.route('**/*', (r) => {
    const u = new URL(r.request().url());
    if (u.origin !== base) return r.abort();
    if (u.pathname.startsWith('/api/'))
      return r.fulfill({ json: { enabled: true, sharing: false, metrics: false } });
    return r.continue();
  });
  const page = await context.newPage();
  await page.goto(base + '/');
  await page.evaluate(
    (seed) => localStorage.setItem('gemnao-diagnosis-v1', JSON.stringify(seed)),
    {
      ...freshLocal(),
      complete: true,
      answers: {
        symptom: 'low-fps',
        scope: 'game',
        observation: 'capped',
        change: 'settings',
        launcher: 'steam',
        safety: 'none',
        storage: 'none',
        os: 'unknown',
        gpu: 'unknown',
        ram: 'unknown',
      },
    },
  );
  await page.goto(base + '/diagnose');
  await page.getByRole('button', { name: '続きから再開する', exact: true }).click();
  const nav = page.getByRole('navigation', { name: '次に読む記事' });
  await expect(nav).toBeVisible();
  await expect(nav.locator('a')).toHaveCount(1);
  const href = await nav.locator('a').getAttribute('href');
  assert(href.startsWith('/guide/'));
  await nav.locator('a').click();
  await page.goBack();
  await page.getByRole('button', { name: '続きから再開する', exact: true }).click();
  await expect(nav.locator('a')).toHaveAttribute('href', href);
  await page
    .locator('.diag-actions > li')
    .first()
    .getByRole('button', { name: '改善した', exact: true })
    .click();
  await expect(nav).toHaveCount(0);
  await page.reload();
  await page.getByRole('button', { name: '続きから再開する', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'あなたの診断結果' }),
  ).toBeVisible();
  await expect(nav).toHaveCount(0);
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await context.close();
  console.log(
    'PASS diagnosis: one matched guide, back navigation, recorded improvement suppresses further changes after reload',
  );
} finally {
  await browser.close();
}
