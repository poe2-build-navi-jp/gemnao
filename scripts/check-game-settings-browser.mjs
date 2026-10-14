// Local-only. Uses the current notebook controls, not obsolete article step buttons.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { chromium, expect } from '@playwright/test';
async function moduleFrom(path) {
  const result = await build({
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
      Buffer.from(result.outputFiles[0].contents).toString('base64')
  );
}
const { gameSettingsCopy: copy } = await moduleFrom(
  'lib/game-settings-copy.ts',
);
const { freshLocal } = await moduleFrom('lib/diagnosis/local.ts');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8795';
assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const key = 'gemnao-settings-snapshots-v1';
const note = {
  id: 'legacy-note',
  title: 'PRIVATE_SENTINEL old settings',
  gameSlug: 'apex-legends',
  status: 'unresolved',
  diagnosis: 'Original diagnosis',
  settings: 'Legacy settings\nPRIVATE_SENTINEL',
  notes: 'User note',
  articlePath: '',
  stepId: '',
  completedSteps: [],
  createdAt: '2026-10-13T12:00:00Z',
  updatedAt: '2026-10-13T12:00:00Z',
  support: {
    attempts: [],
    seenUpdates: [],
    reversions: [
      {
        id: 'restore-overlay',
        setting: 'Overlay',
        original: 'On',
        restore: 'Enable manually',
        state: 'pending',
      },
    ],
  },
};
const seed = {
  'gemnao-my-games': JSON.stringify(['apex-legends', 'pubg']),
  'gemnao-solutions-v1': JSON.stringify({ version: 1, items: [note] }),
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
const errors = [];
const assets = [];
const requests = [];
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
  const url = base + (locale === 'ja' ? '' : '/' + locale) + '/my-games';
  await page.goto(url);
  await page.evaluate((seed) => {
    localStorage.clear();
    for (const [k, v] of Object.entries(seed)) localStorage.setItem(k, v);
  }, seed);
  await page.reload();
  return { ctx, page, url };
}
const panel = (page) =>
  page.locator('.game-settings[data-game="apex-legends"]');
async function open(page) {
  await panel(page).locator(':scope > summary').click();
}
async function items(page) {
  return page.evaluate(
    (k) => JSON.parse(localStorage.getItem(k) || '{"items":[]}').items,
    key,
  );
}
await mkdir('.wrangler/settings-review', { recursive: true });
try {
  for (const width of [360, 390, 1440])
    for (const locale of ['ja', 'en', 'zh', 'es']) {
      const { ctx, page } = await setup(width, locale);
      const t = copy[locale];
      const p = panel(page);
      await open(page);
      await expect(p).toContainText(t.empty);
      assert.equal(
        await page.evaluate((k) => localStorage.getItem(k), key),
        null,
      );
      await p.locator('.settings-new > summary').click();
      await p.locator('.settings-legacy > summary').click();
      await p.getByLabel(t.legacy, { exact: true }).selectOption(note.id);
      await expect(p.locator('.settings-legacy')).toContainText(
        'Enable manually',
      );
      await p
        .getByRole('textbox', { name: t.memo, exact: true })
        .fill('My draft');
      await p.getByRole('button', { name: t.copy, exact: true }).click();
      await expect(
        p.getByRole('textbox', { name: t.memo, exact: true }),
      ).toHaveValue('My draft\n\n' + note.settings);
      await expect(p.getByLabel(t.resolution, { exact: true })).toHaveValue('');
      await p.getByLabel(t.name, { exact: true }).fill('Earlier');
      await p.getByLabel(t.resolution, { exact: true }).fill('1920x1080');
      await p.getByLabel(t.checkedOn, { exact: true }).fill('2026-10-13');
      await p.getByLabel(t.comfortable, { exact: true }).check();
      await p.getByRole('button', { name: t.save, exact: true }).focus();
      await page.keyboard.press('Enter');
      await expect(p.locator('.settings-message')).toHaveText(t.saved);
      const first = (await items(page))[0];
      assert.equal(first.fpsLimit, '');
      assert.equal(first.sourceNoteId, note.id);
      await p.getByLabel(t.name, { exact: true }).fill('Second');
      await expect(p.locator('.settings-message')).toHaveText('');
      await p.getByLabel(t.resolution, { exact: true }).fill('2560x1440');
      await p.getByLabel(t.fpsLimit, { exact: true }).fill('0');
      await p.getByLabel(t.controller, { exact: true }).fill('Custom buttons');
      await p
        .getByRole('textbox', { name: t.memo, exact: true })
        .fill('LongText'.repeat(80));
      await p.getByRole('button', { name: t.save, exact: true }).click();
      await expect(p.locator('.settings-record')).toContainText(
        t.comfortUnknown,
      );
      const second = (await items(page))[0];
      assert.equal(second.checkedOn, '');
      assert.equal((await items(page)).length, 2);
      await p.getByLabel(t.chooseLeft, { exact: true }).selectOption(first.id);
      await p
        .getByLabel(t.chooseRight, { exact: true })
        .selectOption(second.id);
      const fps = p
        .locator('.settings-comparison-row')
        .filter({ hasText: `${t.fpsLimit} — ${t.different}` });
      await expect(fps.locator('dd').first()).toContainText(t.blank);
      await expect(fps.locator('dd').nth(1)).toContainText('0');
      await expect(p.locator('.settings-comparison')).toContainText(
        '2026-10-13',
      );
      await page.reload();
      await open(page);
      assert.equal((await items(page)).length, 2);
      await p.getByLabel(t.chooseLeft, { exact: true }).selectOption(first.id);
      await p
        .getByLabel(t.chooseRight, { exact: true })
        .selectOption(second.id);
      await p.locator('.settings-comparison').scrollIntoViewIfNeeded();
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      if (width === 390)
        await page.screenshot({
          path: `.wrangler/settings-review/${locale}-390.png`,
        });
      for (const el of await p.locator('button:visible,select:visible').all()) {
        const box = await el.boundingBox();
        assert(
          box.height >= 44 && box.x >= 0 && box.x + box.width <= width,
          'accessible target bounds',
        );
      }
      const before = await page.evaluate((k) => localStorage.getItem(k), key);
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
        before,
      );
      for (const [k, v] of Object.entries(seed).filter(
        ([k]) => k !== 'gemnao-my-games',
      ))
        assert.equal(
          await page.evaluate((k) => localStorage.getItem(k), k),
          v,
          'legacy state unchanged',
        );
      await ctx.close();
      console.log(`PASS settings view: ${locale} ${width}px`);
    }
  const { ctx, page } = await setup(320);
  const t = copy.en;
  const p = panel(page);
  await open(page);
  await p.locator('.settings-new > summary').click();
  await p.getByRole('button', { name: t.save, exact: true }).click();
  await expect(p.locator('.settings-message')).toHaveText(t.emptyError);
  await p
    .getByRole('textbox', { name: t.memo, exact: true })
    .fill('x'.repeat(4000));
  await p.getByRole('button', { name: t.save, exact: true }).click();
  const id = (await items(page))[0].id;
  await p.locator('.settings-record').scrollIntoViewIfNeeded();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await p.getByRole('button', { name: t.delete, exact: true }).click();
  await p.getByRole('button', { name: t.cancel, exact: true }).click();
  assert.equal((await items(page)).length, 1);
  // Another tab deleting a selected snapshot leaves a clear missing selection.
  const second = await ctx.newPage();
  await second.goto(base + '/en/my-games');
  await open(second);
  await panel(second)
    .getByLabel(t.chooseLeft, { exact: true })
    .selectOption(id);
  await p.getByRole('button', { name: t.delete, exact: true }).click();
  await p.getByRole('button', { name: t.confirmDelete, exact: true }).click();
  await expect(panel(second)).toContainText(t.missing);
  assert.equal((await items(page)).length, 0);
  await p
    .getByRole('textbox', { name: t.memo, exact: true })
    .fill('KEEP_DRAFT');
  await page.evaluate((k) => {
    // oxlint-disable-next-line typescript/unbound-method -- Called with its original receiver below.
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === k) throw new DOMException('full', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  }, key);
  await p.getByRole('button', { name: t.save, exact: true }).click();
  await expect(p.locator('.settings-message')).toHaveText(t.error);
  await expect(
    p.getByRole('textbox', { name: t.memo, exact: true }),
  ).toHaveValue('KEEP_DRAFT');
  assert.equal((await items(page)).length, 0);
  await page.reload();
  await open(page);
  await p.locator('.settings-new > summary').click();
  // Corrupt and future-version records remain untouched.
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
  await page.evaluate((k) => {
    localStorage.removeItem(k);
    window.dispatchEvent(new Event('storage'));
  }, key);
  // Current notebook controls: edit settings and restoration state, then reload.
  await page.locator('#issue-notebook select').first().selectOption(note.id);
  await page
    .locator('#issue-notebook')
    .getByRole('button', { name: 'Edit issue', exact: true })
    .click();
  const noteForm = page.locator('#issue-notebook form').first();
  await noteForm
    .getByRole('textbox', { name: 'Settings changed / solution', exact: true })
    .fill('Updated legacy settings');
  await noteForm
    .getByRole('button', { name: 'Save note', exact: true })
    .click();
  await page.reload();
  const old = await page.evaluate(
    () => JSON.parse(localStorage.getItem('gemnao-solutions-v1')).items[0],
  );
  assert.equal(old.settings, 'Updated legacy settings');
  assert.equal(old.support.reversions[0].original, 'On');
  assert.equal(
    await page.evaluate(() => localStorage.getItem('gemnao-diagnosis-v1')),
    seed['gemnao-diagnosis-v1'],
  );
  await page.route('**/api/diagnosis/config', (route) =>
    route.fulfill({ json: { enabled: true, sharing: false, metrics: false } }),
  );
  await page.goto(base + '/diagnose');
  await page
    .getByRole('button', { name: '続きから再開する', exact: true })
    .click();
  await expect(
    page.getByRole('heading', {
      name: '先に、危険な兆候はありませんか？',
      exact: true,
    }),
  ).toBeVisible();
  assert.equal(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('gemnao-diagnosis-v1')).game,
    ),
    'apex-legends',
  );
  await ctx.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(assets, []);
  assert(
    !requests.some(
      (r) => r.includes('PRIVATE_SENTINEL') || r.includes('KEEP_DRAFT'),
    ),
    'no private text leaves browser',
  );
  console.log(
    'PASS: settings snapshots in 4 languages at 360/390/1440; 320px long text; copy, save, compare blank/0, reload, remove/re-add, cross-tab delete, quota/corruption preservation, keyboard/targets, current notebook edit and diagnosis bytes, no private network data',
  );
} finally {
  await browser.close();
}
