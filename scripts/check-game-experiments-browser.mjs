import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { chromium, expect } from '@playwright/test';
async function moduleFrom(path) {
  const r = await build({
    entryPoints: [path],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    packages: 'external',
    logLevel: 'warning',
  });
  return import(
    'data:text/javascript;base64,' +
      Buffer.from(r.outputFiles[0].contents).toString('base64')
  );
}
const { gameExperimentsCopy: copy } = await moduleFrom(
  'lib/game-experiments-copy.ts',
);
const { gameSettingsCopy: settingsCopy } = await moduleFrom(
  'lib/game-settings-copy.ts',
);
const { freshLocal } = await moduleFrom('lib/diagnosis/local.ts');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8795';
assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const key = 'gemnao-game-experiments-v1',
  snapshotKey = 'gemnao-settings-snapshots-v1';
const before = {
  id: 'before-test',
  gameSlug: 'apex-legends',
  createdAt: '2026-10-13T12:00:00Z',
  name: 'Before',
  resolution: '1920x1080',
  preset: 'Low',
  fpsLimit: '',
  controller: '',
  memo: 'PRIVATE_SENTINEL cached',
  checkedOn: '2026-10-13',
  comfortable: true,
};
const after = { ...before, id: 'after-test', name: 'After', preset: 'High' };
const seed = {
  'gemnao-my-games': JSON.stringify(['apex-legends', 'pubg']),
  [snapshotKey]: JSON.stringify({
    version: 1,
    items: [before, after, { ...before, id: 'other-game', gameSlug: 'pubg' }],
  }),
  'gemnao-solutions-v1': JSON.stringify({ version: 1, items: [] }),
  'gemnao-diagnosis-v1': JSON.stringify({
    ...freshLocal(),
    game: 'apex-legends',
  }),
  'gemnao-my-pc': JSON.stringify({ os: 'win11', ram: 16, gpu: 'rtx-3060' }),
  'gemnao-official-changes-read-v1': JSON.stringify({
    version: 1,
    read: ['apex-javelin-20260929-v1'],
  }),
};
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--no-sandbox'],
});
const errors = [],
  assets = [],
  requests = [];
async function setup(width = 390, locale = 'en') {
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
  page.on('request', (r) =>
    requests.push(r.url() + ' ' + (r.postData() || '')),
  );
  page.on('response', (r) => {
    if (/\.(css|js)(\?|$)/.test(r.url()) && r.status() !== 200)
      assets.push(r.url());
  });
  await page.goto(base + (locale === 'ja' ? '' : '/' + locale) + '/my-games');
  await page.evaluate((seed) => {
    localStorage.clear();
    for (const [k, v] of Object.entries(seed)) localStorage.setItem(k, v);
  }, seed);
  await page.reload();
  return { ctx, page };
}
const panel = (p) => p.locator('.game-experiments[data-game="apex-legends"]');
const logs = (p) =>
  p.evaluate(
    (k) => JSON.parse(localStorage.getItem(k) || '{"items":[]}').items,
    key,
  );
async function open(p) {
  await panel(p).locator(':scope > summary').click();
}
await mkdir('.wrangler/experiments-review', { recursive: true });
try {
  for (const width of [360, 390, 1440])
    for (const locale of ['ja', 'en', 'zh', 'es']) {
      const { ctx, page } = await setup(width, locale);
      const t = copy[locale],
        s = settingsCopy[locale],
        p = panel(page);
      await open(page);
      await expect(p).toContainText(t.empty);
      assert.equal(
        await page.evaluate((k) => localStorage.getItem(k), key),
        null,
      );
      await p.locator('.experiment-new > summary').click();
      await expect(
        p.getByLabel(t.before, { exact: true }).locator('option'),
      ).toHaveCount(3);
      await p.getByLabel(t.changed, { exact: true }).fill('Graphics preset');
      await p.getByLabel(t.purpose, { exact: true }).fill('Image quality');
      await p.getByLabel(t.before, { exact: true }).selectOption(before.id);
      await p.getByLabel(t.after, { exact: true }).selectOption(after.id);
      await p.getByLabel(t.fpsAfter, { exact: true }).fill('0');
      await p
        .getByLabel(t.result, { exact: true })
        .fill('PRIVATE_SENTINEL subjective comparison');
      await p.getByLabel(t.performedOn, { exact: true }).fill('2026-10-13');
      await p.getByLabel(t.decision, { exact: true }).selectOption('revert');
      await p.getByRole('button', { name: t.save, exact: true }).focus();
      await page.keyboard.press('Enter');
      await expect(p.locator('.experiment-message')).toHaveText(t.saved);
      assert.equal((await logs(page)).length, 1);
      const log = (await logs(page))[0];
      assert.equal(log.before.id, before.id);
      assert.equal(log.fpsBefore, '');
      assert.equal(log.fpsAfter, '0');
      assert.equal(log.decision, 'revert');
      assert.equal(
        await page.evaluate((k) => localStorage.getItem(k), snapshotKey),
        seed[snapshotKey],
        'revert does not change snapshots',
      );
      const record = p.locator('.experiment-record');
      await expect(record).toContainText(t.unmeasured);
      await expect(record).toContainText(t.revert);
      await record.locator('.experiment-before > summary').click();
      await expect(record).toContainText(t.archived);
      const savedBytes = await page.evaluate(
        (k) => localStorage.getItem(k),
        key,
      );
      // Use feature II's real delete controls. The experiment stays unchanged.
      const settings = page.locator('.game-settings[data-game="apex-legends"]');
      await settings.locator(':scope > summary').click();
      await settings
        .getByLabel(s.chooseLeft, { exact: true })
        .selectOption(before.id);
      await settings
        .getByRole('button', { name: s.delete, exact: true })
        .click();
      await settings
        .getByRole('button', { name: s.confirmDelete, exact: true })
        .click();
      await expect(record.locator('.experiment-before')).toContainText(
        t.referenceMissing,
      );
      await expect(record.locator('.experiment-before')).toContainText(
        '1920x1080',
      );
      assert.equal(
        await page.evaluate((k) => localStorage.getItem(k), key),
        savedBytes,
        'source deletion preserves logged meaning',
      );
      await page.reload();
      await open(page);
      await p.locator('.experiment-before > summary').click();
      await expect(p.locator('.experiment-before')).toContainText(
        t.referenceMissing,
      );
      assert.equal((await logs(page))[0].before.memo, before.memo);
      await p.locator('.experiment-record h4').scrollIntoViewIfNeeded();
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      for (const el of await p.locator('button:visible,select:visible').all()) {
        const box = await el.boundingBox();
        assert(box.height >= 44 && box.x >= 0 && box.x + box.width <= width);
      }
      if (width === 390)
        await page.screenshot({
          path: `.wrangler/experiments-review/${locale}-390.png`,
        });
      await page
        .locator('.my-game-card')
        .filter({
          has: page.getByRole('heading', { name: 'Apex Legends', exact: true }),
        })
        .locator('.my-games-card-heading button')
        .click();
      await expect(panel(page)).toHaveCount(0);
      await page
        .locator('.my-games-choices button')
        .filter({ hasText: 'Apex Legends' })
        .click();
      await open(page);
      assert.equal(
        await page.evaluate((k) => localStorage.getItem(k), key),
        savedBytes,
      );
      for (const [k, v] of Object.entries(seed).filter(
        ([k]) => !['gemnao-my-games', snapshotKey].includes(k),
      ))
        assert.equal(await page.evaluate((k) => localStorage.getItem(k), k), v);
      await ctx.close();
      console.log(`PASS experiment view: ${locale} ${width}px`);
    }
  const { ctx, page } = await setup(320);
  const p = panel(page),
    t = copy.en;
  await open(page);
  await p.locator('.experiment-new > summary').click();
  await p.getByRole('button', { name: t.save, exact: true }).click();
  await expect(p.locator('.experiment-message')).toHaveText(t.emptyError);
  await p
    .getByLabel(t.result, { exact: true })
    .fill('<img src=x onerror=alert(1)> ' + 'LongText'.repeat(245));
  await p.getByRole('button', { name: t.save, exact: true }).click();
  await expect(p.locator('.experiment-record')).toHaveCount(1);
  assert.equal(await p.locator('.experiment-record img').count(), 0);
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  const bytes = await page.evaluate((k) => localStorage.getItem(k), key);
  // Stale references fail explicitly, without saving a misleading success.
  await p.getByLabel(t.changed, { exact: true }).fill('KEEP_DRAFT');
  await expect(p.locator('.experiment-message')).toHaveText('');
  await p.getByLabel(t.before, { exact: true }).selectOption(before.id);
  await page.evaluate((k) => {
    localStorage.setItem(k, '{"version":1,"items":[]}');
    window.dispatchEvent(new Event('storage'));
  }, snapshotKey);
  await p.getByRole('button', { name: t.save, exact: true }).click();
  await expect(p.locator('.experiment-message')).toHaveText(t.referenceError);
  assert.equal(await page.evaluate((k) => localStorage.getItem(k), key), bytes);
  await expect(p.getByLabel(t.changed, { exact: true })).toHaveValue(
    'KEEP_DRAFT',
  );
  await p.getByLabel(t.before, { exact: true }).selectOption('');
  await page.evaluate((k) => {
    // oxlint-disable-next-line typescript/unbound-method -- Retain the receiver with call.
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === k) throw new DOMException('full', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  }, key);
  await p.getByRole('button', { name: t.save, exact: true }).click();
  await expect(p.locator('.experiment-message')).toHaveText(t.error);
  await expect(p.getByLabel(t.changed, { exact: true })).toHaveValue(
    'KEEP_DRAFT',
  );
  assert.equal(await page.evaluate((k) => localStorage.getItem(k), key), bytes);
  await p.getByRole('button', { name: t.delete, exact: true }).click();
  await p.getByRole('button', { name: t.confirmDelete, exact: true }).click();
  await expect(p.locator('.experiment-message')).toHaveText(t.error);
  assert.equal(await page.evaluate((k) => localStorage.getItem(k), key), bytes);
  await page.reload();
  await open(page);
  const second = await ctx.newPage();
  await second.goto(base + '/en/my-games');
  await open(second);
  await p.getByRole('button', { name: t.delete, exact: true }).click();
  await p.getByRole('button', { name: t.cancel, exact: true }).click();
  assert.equal((await logs(page)).length, 1);
  await p.getByRole('button', { name: t.delete, exact: true }).click();
  await p.getByRole('button', { name: t.confirmDelete, exact: true }).click();
  await expect(p.locator(':scope > summary')).toBeFocused();
  await expect(panel(second).locator('.experiment-record')).toHaveCount(0);
  await p.locator('.experiment-new > summary').click();
  for (const bad of ['broken', '{"version":2,"items":[]}']) {
    await page.evaluate(
      ({ key, bad }) => {
        localStorage.setItem(key, bad);
        window.dispatchEvent(new Event('storage'));
      },
      { key, bad },
    );
    await expect(
      p.getByRole('button', { name: t.save, exact: true }),
    ).toBeDisabled();
    await expect(p).toContainText(t.invalid);
    assert.equal(await page.evaluate((k) => localStorage.getItem(k), key), bad);
  }
  // An unreadable source registry still allows a log with no references; no reset.
  await page.evaluate(
    ({ key, snapshotKey }) => {
      localStorage.removeItem(key);
      localStorage.setItem(snapshotKey, 'broken-source');
      window.dispatchEvent(new Event('storage'));
    },
    { key, snapshotKey },
  );
  await p.getByLabel(t.result, { exact: true }).fill('No references needed');
  await p.getByRole('button', { name: t.save, exact: true }).click();
  await expect(p.locator('.experiment-message')).toHaveText(t.saved);
  assert.equal(
    await page.evaluate((k) => localStorage.getItem(k), snapshotKey),
    'broken-source',
  );
  await ctx.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(assets, []);
  assert(
    !requests.some(
      (r) => r.includes('PRIVATE_SENTINEL') || r.includes('KEEP_DRAFT'),
    ),
    'no private text transmitted',
  );
  console.log(
    'PASS: 12 experiment viewports/locales plus 320px long/escaped text; capture survives real snapshot deletion; reload/re-add, optional FPS vs zero, keyboard/targets, stale references, quota/save/delete failure, corruption, cross-tab, no private requests',
  );
} finally {
  await browser.close();
}
