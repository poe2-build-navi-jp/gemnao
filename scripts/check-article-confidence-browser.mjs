import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8795';
assert(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const paths = [
  '/games/ace-combat-8/error-st-3100001',
  '/games/call-of-duty-modern-warfare-4/tpm-secure-boot',
  '/games/aniimo/not-launching',
  '/games/monster-hunter-wilds/not-launching',
];
await mkdir('/tmp/gemnao-confidence', { recursive: true });
const errors = [];
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== base) return route.abort();
      if (url.pathname.startsWith('/api/'))
        return route.fulfill({
          json: { enabled: true, rows: [], methods: [], items: [] },
        });
      return route.continue();
    });
    const page = await context.newPage();
    page.on('pageerror', (err) => errors.push(err.message));
    for (const prefix of ['', '/en']) {
      for (const path of paths) {
        await page.goto(base + prefix + path);
        await expect(page.locator('.article-context')).toBeVisible();
        await expect(page.locator('.article-context dt')).toHaveCount(4);
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          path,
        );
        await page.screenshot({
          path: `/tmp/gemnao-confidence/${prefix ? 'en' : 'ja'}-${path.split('/')[2]}-${width}.png`,
        });
      }
      await page.goto(base + prefix + '/my');
      await expect(page.locator('#my-reading-list')).toBeVisible();
      await page.evaluate(() => {
        localStorage.setItem(
          'gemnao-reading-list-v1',
          JSON.stringify({
            version: 1,
            items: [
              {
                path: '/games/apex-legends/javelin-launch-error',
                title: 'Apex saved test',
                savedAt: '2026-10-01T00:00:00.000Z',
              },
            ],
          }),
        );
        localStorage.setItem('gemnao-my-games', '["apex-legends"]');
        localStorage.setItem('gemnao-diagnosis-v1', 'preserve');
        localStorage.removeItem('gemnao-saved-article-changes-v1');
      });
      await page.reload();
      const region = page.locator('#my-reading-list .my-game-change');
      await expect(region).toHaveCount(1);
      await expect(region.locator('button')).toHaveText(
        prefix ? 'Mark as unread' : '未読に戻す',
      );
      await region.locator('button').click();
      await page.reload();
      await expect(region.locator('button')).toHaveText(
        prefix ? 'Mark as read' : '既読にする',
      );
      const before = await page.evaluate(() =>
        localStorage.getItem('gemnao-saved-article-changes-v1'),
      );
      await page.locator('.reading-list-items button').click();
      await expect(region).toHaveCount(0);
      await page.goto(
        base + prefix + '/games/apex-legends/javelin-launch-error',
      );
      await page.locator('.save-article button').click();
      await page.goto(base + prefix + '/my');
      await expect(region).toHaveCount(1);
      assert.equal(
        await page.evaluate(() =>
          localStorage.getItem('gemnao-saved-article-changes-v1'),
        ),
        before,
      );
      await region.locator('button').click();
      await page.reload();
      await expect(region.locator('button')).toHaveText(
        prefix ? 'Mark as unread' : '未読に戻す',
      );
      assert.equal(
        await page.evaluate(() => localStorage.getItem('gemnao-diagnosis-v1')),
        'preserve',
      );
      assert.equal(
        await page.evaluate(() => localStorage.getItem('gemnao-my-games')),
        '["apex-legends"]',
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      await page.screenshot({
        path: `/tmp/gemnao-confidence/${prefix ? 'en' : 'ja'}-saved-${width}.png`,
      });
    }
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    'PASS: JA/EN four article contexts at 390/1440, first enrollment, read/unread, revisit, removal/re-add, saved data preserved; no horizontal overflow or page errors.',
  );
} finally {
  await browser.close();
}
