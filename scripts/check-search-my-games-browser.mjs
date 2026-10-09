// Local-only regression: synthetic saved games; no live APIs or analytics.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const origin = new URL(base).origin;
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--no-sandbox'],
});
await mkdir('outputs/search-my-games', { recursive: true });
try {
  for (const width of [375, 390, 430, 1165]) {
    const context = await browser.newContext({
      viewport: { width, height: 747 },
    });
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) return route.abort();
      if (url.pathname.startsWith('/api/'))
        return route.fulfill({
          json: { rows: [], methods: [], enabled: false },
        });
      return route.continue();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base + '/?q=Steam+起動しない');
    const input = page.getByRole('searchbox', { name: 'ゲーム名や症状を検索' });
    await expect(input).toHaveValue('Steam 起動しない');
    await expect(page.locator('.hero-searching')).toBeVisible();
    await expect(page.locator('.search-result-summary')).toContainText('19件');
    const first = page.locator('#articles .home-article-grid a').first();
    await expect(first).toBeVisible();
    assert.ok(
      (await first.boundingBox()).y < 620,
      'first result appears in initial viewport',
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      'no overflow',
    );
    await page.screenshot({
      path: `outputs/search-my-games/search-${width}.png`,
    });
    await first.click();
    await page.goBack();
    await expect(input).toHaveValue('Steam 起動しない');
    await page.goForward();
    await page.goBack();
    await expect(input).toHaveValue('Steam 起動しない');
    await page.getByRole('button', { name: 'クリア', exact: true }).click();
    await expect(page.locator('.hero-copy')).toBeVisible();
    assert.equal(new URL(page.url()).searchParams.has('q'), false);
    await expect(input).toBeFocused();
    for (let repeat = 0; repeat < 2; repeat++) {
      await input.fill('synthetic-no-match-987654');
      await expect(page.locator('.search-no-results')).toBeVisible();
      await input.fill('Discord マイク');
      await expect(page.locator('.search-result-summary')).toBeVisible();
      await input.fill('');
      await expect(page.locator('.hero-copy')).toBeVisible();
    }
    await input.fill('Steam');
    await input.pressSequentially(' 起動しない');
    await expect(input).toBeFocused();
    await expect(page.locator('.search-result-summary')).toContainText('19件');
    const seed = JSON.stringify(['elden-ring']);
    await page.evaluate(
      (value) => localStorage.setItem('gemnao-my-games', value),
      seed,
    );
    await page.goto(base + '/my#my-games');
    const entry = page.locator('#my-games a[href="/my-games#my-games"]');
    await expect(entry).toBeVisible();
    assert.equal(
      await page.locator('#my-games input[type=checkbox]').count(),
      0,
    );
    assert.equal(
      await page.evaluate(() => localStorage.getItem('gemnao-my-games')),
      seed,
    );
    await entry.click();
    const gameSearch = page.getByRole('searchbox', {
      name: 'ゲーム名で絞り込む',
    });
    await expect(
      page.locator('.my-games-choices button').first(),
    ).toBeEnabled();
    await gameSearch.fill('ELDEN');
    await expect(gameSearch).toHaveValue('ELDEN');
    const saved = page
      .locator('.my-games-choices button')
      .filter({ hasText: 'エルデンリング' })
      .first();
    await expect(saved).toHaveAttribute('aria-pressed', 'true');
    await saved.click();
    await expect(saved).toHaveAttribute('aria-pressed', 'false');
    await saved.click();
    await expect(saved).toHaveAttribute('aria-pressed', 'true');
    assert.equal(
      await page.evaluate(() => localStorage.getItem('gemnao-my-games')),
      seed,
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      'my games no overflow',
    );
    await page.screenshot({
      path: `outputs/search-my-games/my-games-${width}.png`,
    });
    await page.goBack();
    assert.ok(page.url().endsWith('/my#my-games'));
    assert.equal(
      await page.evaluate(() => localStorage.getItem('gemnao-my-games')),
      seed,
    );
    assert.deepEqual(errors, []);
    console.log(
      `PASS ${width}px search entry/clear/zero/repeat/history, saved-games compatibility`,
    );
    await context.close();
  }
} finally {
  await browser.close();
}
