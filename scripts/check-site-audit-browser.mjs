// Focused regressions discovered by the full-site audit. Loopback and mocks only.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8795';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const out = '.wrangler/site-audit/final';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const results = [],
  errors = [];
try {
  for (const width of [320, 360, 390, 430, 1440]) {
    const c = await browser.newContext({ viewport: { width, height: 900 } });
    await c.route('**/*', (r) => {
      const u = new URL(r.request().url());
      if (u.origin !== new URL(base).origin) return r.abort();
      if (u.pathname.startsWith('/api/'))
        return r.fulfill({
          json: {
            enabled: false,
            available: false,
            rows: [],
            items: [],
            methods: [],
          },
        });
      return r.continue();
    });
    const p = await c.newPage();
    p.on('pageerror', (e) => errors.push(e.message));
    await p.goto(base + '/weekly', { waitUntil: 'networkidle' });
    const article = await p.locator('.article-layout > article').boundingBox();
    assert.ok(
      article.width >= Math.min(width - 90, 950),
      JSON.stringify({ width, article }),
    );
    const card = await p
      .locator('.related-section > div > a')
      .first()
      .boundingBox();
    assert.ok(
      card.width >= Math.min(width - 90, 300),
      JSON.stringify({ width, card }),
    );
    const weeklyLinks = await p
      .locator('.related-section a')
      .evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    assert.ok(
      weeklyLinks.every((h) => /^\/weekly\/\d{4}-\d{2}-\d{2}$/.test(h)),
    );
    await p.screenshot({ path: `${out}/weekly-${width}.png`, fullPage: true });
    await p.goto(base + '/my', { waitUntil: 'networkidle' });
    const link = p.getByRole('link', {
      name: '症状に合う記事を探す',
      exact: true,
    });
    await expect(link).toHaveAttribute('href', '/?view=articles#articles');
    await link.click();
    await p.waitForLoadState('networkidle');
    await expect(p.locator('#articles')).toHaveCount(1);
    assert.equal(new URL(p.url()).searchParams.get('view'), 'articles');
    await p.goBack();
    await expect(link).toBeVisible();
    for (const locale of ['en', 'zh', 'es']) {
      await p.goto(base + '/' + locale + '/my-games', {
        waitUntil: 'networkidle',
      });
      const search = p.getByRole('searchbox');
      await expect(p.locator('.my-games-choices button').first()).toBeEnabled();
      for (const [query, name] of [
        ['Dragon', "Dragon's Dogma 2"],
        ['Tales', 'Tales of Eternia Remastered'],
        ['DYNASTY', 'DYNASTY WARRIORS 3: Complete Edition Remastered'],
      ]) {
        await search.fill(query);
        const game = p
          .locator('.my-games-choices button')
          .filter({ hasText: name });
        await expect(game).toBeVisible();
        await game.click();
        await expect(game).toHaveAttribute('aria-pressed', 'true');
        await game.click();
        await expect(game).toHaveAttribute('aria-pressed', 'false');
      }
      const notebook = p.locator('.support-workspace').first();
      await notebook.getByRole('button').first().click();
      await expect(notebook.locator('form select option[value="dragons-dogma-2"]')).toHaveText("Dragon's Dogma 2");
      await notebook.locator('form select').first().selectOption('shin-sangoku-musou-2-remastered');
      assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await notebook.locator('form button[type="button"]').last().click();
      await search.fill('Dragon');
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      if (width === 390)
        await p.screenshot({
          path: `${out}/${locale}-games-390.png`,
          fullPage: true,
        });
    }
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    results.push({
      width,
      weeklyArticleWidth: article.width,
      weeklyCardWidth: card.width,
      readingLink: true,
      threeLocalesSearch: true,
    });
    await c.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(
    `${out}/results.json`,
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(
    `PASS: ${results.length} widths, weekly cards, reading recovery/history, EN/ZH/ES verified game names/search/selection; no JS errors or overflow. Local only.`,
  );
} finally {
  await browser.close();
}
