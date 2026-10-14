// Local-only browser regression; no production API, telemetry or user data.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8795';
assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const key = 'gemnao-official-changes-read-v1';
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--no-sandbox'],
});
const errors = [];
const failedAssets = [];
const seed = {
  'gemnao-my-games': JSON.stringify(['apex-legends', 'pubg', 'overwatch-2']),
  'gemnao-my-pc': JSON.stringify({ os: 'win11', ram: 16, gpu: 'rtx-3060' }),
  'gemnao-diagnosis-v1': 'diagnosis-preservation-sentinel',
  'gemnao-solutions-v1': JSON.stringify({ version: 1, items: [] }),
};
async function setup(width = 390) {
  const ctx = await browser.newContext({
    viewport: { width, height: 844 },
    timezoneId: 'America/Los_Angeles',
  });
  await ctx.route('**/*', (r) => {
    const u = new URL(r.request().url());
    if (u.origin !== base) return r.abort();
    if (u.pathname.startsWith('/api/'))
      return r.fulfill({
        json: { rows: [], methods: [], items: [], enabled: false },
      });
    return r.continue();
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => {
    if (/\.(css|js)(\?|$)/.test(r.url()) && r.status() !== 200)
      failedAssets.push(r.url());
  });
  await page.goto(base + '/my-games');
  await page.evaluate((values) => {
    localStorage.clear();
    for (const [k, v] of Object.entries(values)) localStorage.setItem(k, v);
  }, seed);
  return { ctx, page };
}
await mkdir('.wrangler/my-game-changes-review', { recursive: true });
try {
  for (const width of [360, 390, 1440])
    for (const locale of ['ja', 'en', 'zh', 'es']) {
      const { ctx, page } = await setup(width);
      await page.goto(
        base + (locale === 'ja' ? '' : '/' + locale) + '/my-games',
      );
      await expect(page.locator('.my-game-change')).toHaveCount(2);
      await expect(page.locator('.my-game-changes')).toHaveCount(3);
      assert.equal(
        await page.evaluate((k) => localStorage.getItem(k), key),
        null,
        'first view does not mark as read',
      );
      assert.equal(
        await page
          .locator('#change-apex-javelin-20260929-v1')
          .locator('..')
          .locator('time')
          .first()
          .textContent(),
        '2026-09-24',
      );
      assert.equal(
        await page
          .locator('#change-pubg-conflict-371-v1')
          .locator('..')
          .locator('time')
          .first()
          .textContent(),
        '2025-08-11',
      );
      const first = page
        .locator('#change-apex-javelin-20260929-v1')
        .locator('..');
      await first.getByRole('button').focus();
      await page.keyboard.press('Enter');
      await expect(first.locator('.my-game-change-state')).toHaveText(
        { ja: '既読', en: 'Read', zh: '已读', es: 'Leído' }[locale],
      );
      const before = await page.evaluate((k) => localStorage.getItem(k), key);
      await page.reload();
      await expect(first.locator('.my-game-change-state')).toHaveText(
        { ja: '既読', en: 'Read', zh: '已读', es: 'Leído' }[locale],
      );
      const apex = page.locator('.my-game-card').filter({
        has: page.getByRole('heading', { name: 'Apex Legends', exact: true }),
      });
      await apex.locator('.my-games-card-heading button').click();
      await expect(page.locator('.my-game-change')).toHaveCount(1);
      await page
        .locator('.my-games-choices button')
        .filter({ hasText: 'Apex Legends' })
        .click();
      await expect(page.locator('.my-game-change')).toHaveCount(2);
      assert.equal(
        await page.evaluate((k) => localStorage.getItem(k), key),
        before,
        'remove/re-add retains read state',
      );
      await expect(first.locator('.my-game-change-state')).toHaveText(
        { ja: '既読', en: 'Read', zh: '已读', es: 'Leído' }[locale],
      );
      for (const [k, v] of Object.entries(seed).filter(
        ([k]) => k !== 'gemnao-my-games',
      ))
        assert.equal(
          await page.evaluate((k) => localStorage.getItem(k), k),
          v,
          'legacy data preserved',
        );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        'no horizontal overflow',
      );
      for (const el of await page
        .locator('.my-game-change button,.my-game-change a')
        .all()) {
        const box = await el.boundingBox();
        assert(
          box.height >= 44 && box.x >= 0 && box.x + box.width <= width,
          'touch target and bounds',
        );
      }
      assert.equal(await page.locator('#issue-notebook').count(), 1);
      for (const link of await page
        .locator('.my-game-change a[href^="/"]')
        .all())
        assert.equal(
          (
            await page.request.get(base + (await link.getAttribute('href')))
          ).status(),
          200,
        );
      if (width === 390) {
        await first.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `.wrangler/my-game-changes-review/${locale}-390.png`,
        });
      }
      await ctx.close();
    }
  const { ctx, page } = await setup();
  await page.reload();
  const second = await ctx.newPage();
  await second.goto(base + '/en/my-games');
  await page.locator('.my-game-change button').first().click();
  await expect(second.locator('.my-game-change-state').first()).toHaveText(
    'Read',
  );
  await second.locator('.my-game-change button').first().click();
  await expect(page.locator('.my-game-change-state').first()).toHaveText(
    '未読',
  );
  // Corrupt and future state are neither silently reset nor described as unread.
  for (const bad of ['broken', '{"version":2,"read":[]}']) {
    await page.evaluate(({ key, bad }) => localStorage.setItem(key, bad), {
      key,
      bad,
    });
    await page.reload();
    await expect(page.locator('.my-game-change button').first()).toBeDisabled();
    await expect(page.locator('.my-game-change-state').first()).toHaveText(
      '既読状態を取得できません',
    );
    assert.equal(await page.evaluate((k) => localStorage.getItem(k), key), bad);
  }
  await page.evaluate((k) => localStorage.removeItem(k), key);
  await page.reload();
  await page.evaluate((k) => {
    // oxlint-disable-next-line typescript/unbound-method -- Preserve prototype method and call it with the original receiver.
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === k) throw new DOMException('full', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  }, key);
  await page.locator('.my-game-change button').first().click();
  await expect(
    page
      .locator('.my-game-changes')
      .filter({ has: page.locator('.my-game-change') })
      .first()
      .locator('output'),
  ).toContainText('保存できません');
  assert.equal(await page.evaluate((k) => localStorage.getItem(k), key), null);
  await page.reload();
  await page.evaluate(() => {
    localStorage.setItem('gemnao-my-games', '[]');
  });
  await page.reload();
  await expect(page.locator('.my-game-change')).toHaveCount(0);
  await page
    .locator('.my-games-choices button')
    .filter({ hasText: 'Apex Legends' })
    .click();
  await expect(page.locator('.my-game-change-state').first()).toHaveText(
    '未読',
  );
  assert.equal(await page.evaluate((k) => localStorage.getItem(k), key), null);
  await ctx.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(failedAssets, []);
  console.log(
    'PASS: 12 locale/viewport cases; keyboard, 44px targets, dates, local persistence, remove/re-add, cross-tab state, missing cards, corruption, quota failure, old-key preservation, links and CSS/JS',
  );
} finally {
  await browser.close();
}
