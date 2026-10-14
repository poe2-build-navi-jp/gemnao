/* oxlint-disable typescript/unbound-method -- Preserve and restore Storage.prototype.setItem with explicit .call(this). */
import assert from 'node:assert/strict';
import { mkdir, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { build } from 'esbuild';
import { chromium, expect } from '@playwright/test';
async function from(path) {
  const r = await build({
    entryPoints: [path],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    packages: 'external',
  });
  return import(
    'data:text/javascript;base64,' +
      Buffer.from(r.outputFiles[0].contents).toString('base64')
  );
}
const { playPlansCopy: copy } = await from('lib/play-plans-copy.ts');
const { playActivityCopy: activityCopy } = await from(
  'lib/play-activity-copy.ts',
);
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8795';
assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const pk = 'gemnao-play-plans-v1',
  ak = 'gemnao-play-activity-v1',
  sk = 'gemnao-settings-snapshots-v1';
const snapshot = {
  id: 'snapshot-1',
  gameSlug: 'apex-legends',
  name: 'Stable',
  resolution: '1920x1080',
  preset: 'Low',
  fpsLimit: '60',
  controller: '',
  memo: 'PRIVATE_SETTING',
  checkedOn: '2026-10-14',
  comfortable: true,
  createdAt: '2026-10-14T10:00:00Z',
};
const note = {
  id: 'note-1',
  title: 'Existing case',
  gameSlug: 'apex-legends',
  status: 'unresolved',
  diagnosis: '',
  settings: '',
  notes: 'PRIVATE_EXISTING_NOTE',
  articlePath: '/games/apex-legends/javelin-launch-error',
  stepId: 'update-restart',
  completedSteps: [],
  createdAt: '2026-10-14T10:00:00Z',
  updatedAt: '2026-10-14T10:00:00Z',
  support: {
    attempts: [
      {
        path: '/games/apex-legends/javelin-launch-error',
        stepId: 'update-restart',
        label: 'Restarted client',
        result: 'unresolved',
        at: '2026-10-14T10:00:00Z',
      },
    ],
    reversions: [],
    seenUpdates: [],
  },
};
const seed = {
  'gemnao-my-games': JSON.stringify(['apex-legends', 'valorant', 'pubg']),
  [sk]: JSON.stringify({ version: 1, items: [snapshot] }),
  'gemnao-solutions-v1': JSON.stringify({ version: 1, items: [note] }),
  'gemnao-my-pc': '{"os":"win11","ram":16}',
  'gemnao-game-experiments-v1': '{"version":1,"items":[]}',
  'gemnao-official-changes-read-v1': '{"version":1,"read":[]}',
};
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const errors = [],
  failed = [],
  requests = [],
  results = [];
await mkdir('.wrangler/play-review', { recursive: true });
async function setup(locale = 'en', width = 390, extra = {}) {
  const context = await browser.newContext({
    viewport: { width, height: 844 },
  });
  await context.route('**/*', (r) => {
    const u = new URL(r.request().url());
    requests.push(r.request().url() + ' ' + (r.request().postData() || ''));
    if (u.origin !== base) return r.abort();
    if (u.pathname.startsWith('/api/'))
      return r.fulfill({
        json: { rows: [], methods: [], items: [], enabled: false },
      });
    return r.continue();
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => {
    if (/\.(css|js)(\?|$)/.test(r.url()) && r.status() !== 200)
      failed.push(r.url());
  });
  await page.goto(base + (locale === 'ja' ? '' : '/' + locale) + '/my-games');
  await page.evaluate(
    (data) => {
      localStorage.clear();
      for (const [k, v] of Object.entries(data)) localStorage.setItem(k, v);
    },
    { ...seed, ...extra },
  );
  await page.reload();
  return { context, page };
}
const card = (p) => p.locator('.play-plan[data-game="apex-legends"]');
async function edit(page, locale = 'en') {
  const c = card(page),
    t = copy[locale];
  await c.getByRole('button', { name: t.edit, exact: true }).click();
  await c
    .getByRole('textbox', { name: t.progress, exact: true })
    .fill('PRIVATE_PROGRESS chapter 2');
  await c
    .getByRole('textbox', { name: t.next, exact: true })
    .fill('Next quest');
  await c
    .getByRole('textbox', { name: t.guideUrl, exact: true })
    .fill('https://example.com/PRIVATE_GUIDE');
  await c
    .getByRole('combobox', { name: t.snapshot, exact: true })
    .selectOption('snapshot-1');
  await c.getByRole('textbox', { name: t.minutes, exact: true }).fill('30');
  await c
    .getByRole('combobox', { name: t.company, exact: true })
    .selectOption('either');
  await c
    .getByRole('combobox', { name: t.prepared, exact: true })
    .selectOption('yes');
  return c;
}
try {
  for (const locale of ['ja', 'en', 'zh', 'es'])
    for (const width of [320, 360, 390, 1440]) {
      const { context, page } = await setup(locale, width);
      const t = copy[locale],
        a = activityCopy[locale];
      const c = await edit(page, locale);
      await c.getByRole('button', { name: t.save, exact: true }).click();
      await expect(c.getByText(t.saved, { exact: true })).toBeVisible();
      const today = page.locator('.today-games');
      await today
        .getByRole('textbox', { name: t.available, exact: true })
        .fill('45');
      await today.getByRole('button', { name: t.find, exact: true }).click();
      await expect(
        today.getByRole('link', { name: t.continue, exact: true }),
      ).toHaveCount(1);
      await today.getByRole('link', { name: t.continue, exact: true }).click();
      assert.equal(new URL(page.url()).hash, '#play-plan-apex-legends');
      await c
        .getByRole('textbox', { name: a.taskText, exact: true })
        .fill('PRIVATE_TASK');
      await c.getByRole('button', { name: a.add, exact: true }).click();
      const check = c.getByRole('checkbox', {
        name: 'PRIVATE_TASK',
        exact: true,
      });
      await check.focus();
      await page.keyboard.press('Space');
      await expect(check).toBeChecked();
      await c
        .getByRole('button', { name: a.remove + ': PRIVATE_TASK', exact: true })
        .click();
      await c.getByRole('button', { name: a.editTrouble, exact: true }).click();
      await c
        .getByRole('textbox', { name: a.tried, exact: true })
        .fill('PRIVATE_TRIED restart, unchanged');
      await c
        .getByRole('textbox', { name: a.nextFix, exact: true })
        .fill('Record exact error');
      await c
        .getByRole('combobox', { name: a.note, exact: true })
        .selectOption('note-1');
      await c.getByRole('button', { name: t.save, exact: true }).click();
      await expect(c.getByText(a.savedTrouble, { exact: true })).toBeVisible();
      await page.reload();
      await expect(
        c.getByText('PRIVATE_PROGRESS chapter 2', { exact: true }),
      ).toBeVisible();
      await expect(
        c.getByText('PRIVATE_TRIED restart, unchanged', { exact: true }),
      ).toBeVisible();
      await expect(
        today.getByRole('textbox', { name: t.available, exact: true }),
      ).toHaveValue('45');
      await expect(
        today.getByRole('link', { name: t.continue, exact: true }),
      ).toHaveCount(1);
      await c.locator('summary').filter({ hasText: a.trash }).click();
      await c
        .getByRole('button', {
          name: a.restore + ': PRIVATE_TASK',
          exact: true,
        })
        .click();
      await expect(
        c.getByRole('checkbox', { name: 'PRIVATE_TASK', exact: true }),
      ).toBeChecked();
      await expect(c.getByText(a.unknown, { exact: true })).toBeVisible();
      await c.locator('summary').filter({ hasText: 'Existing case' }).click();
      await expect(
        c.getByText('PRIVATE_EXISTING_NOTE', { exact: true }),
      ).toBeVisible();
      await expect(c.getByText(/Restarted client/)).toBeVisible();
      assert.equal(
        await c
          .getByRole('link', { name: new RegExp('EA:') })
          .getAttribute('href'),
        'https://help.ea.com/en/server-status/',
      );
      await expect(
        page
          .locator('.play-plan[data-game="pubg"]')
          .getByText(a.noLink, { exact: true }),
      ).toBeVisible();
      await c.locator('summary').filter({ hasText: t.archived }).click();
      await expect(c.getByText('1920x1080', { exact: true })).toBeVisible();
      const old = await page.evaluate(
        (keys) =>
          Object.fromEntries(keys.map((k) => [k, localStorage.getItem(k)])),
        Object.keys(seed),
      );
      assert.deepEqual(old, seed);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${locale}/${width} overflow`,
      );
      if (width === 390)
        await c.screenshot({ path: `.wrangler/play-review/${locale}-390.png` });
      results.push({ locale, width });
      console.log(`PASS play view: ${locale} ${width}px`);
      await context.close();
    }
  // Unsafe URL, quota failure, stale editor, corruption during editing and source deletion.
  const { context, page } = await setup();
  const t = copy.en,
    a = activityCopy.en;
  const c = await edit(page);
  await c
    .getByRole('textbox', { name: t.guideUrl, exact: true })
    .fill('javascript:alert(1)');
  await c.getByRole('button', { name: t.save, exact: true }).click();
  await expect(c.getByText(t.url, { exact: true })).toBeVisible();
  assert.equal(await page.evaluate((k) => localStorage.getItem(k), pk), null);
  await c
    .getByRole('textbox', { name: t.guideUrl, exact: true })
    .fill('https://example.com/PRIVATE_GUIDE');
  await page.evaluate(() => {
    window.originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k.startsWith('gemnao-play-'))
        throw new DOMException('quota', 'QuotaExceededError');
      window.originalSetItem.call(this, k, v);
    };
  });
  await c.getByRole('button', { name: t.save, exact: true }).click();
  await expect(c.getByText(t.error, { exact: true })).toBeVisible();
  await expect(
    c.getByRole('textbox', { name: t.progress, exact: true }),
  ).toHaveValue('PRIVATE_PROGRESS chapter 2');
  await page.evaluate(() => {
    Storage.prototype.setItem = window.originalSetItem;
  });
  await c.getByRole('button', { name: t.save, exact: true }).click();
  await c.getByRole('button', { name: t.edit, exact: true }).click();
  await c
    .getByRole('textbox', { name: t.next, exact: true })
    .fill('PRIVATE_DRAFT');
  await page.evaluate((k) => {
    const v = JSON.parse(localStorage.getItem(k));
    v.items[0].revision++;
    localStorage.setItem(k, JSON.stringify(v));
    window.dispatchEvent(new Event('gemnao-play-plans'));
  }, pk);
  await c.getByRole('button', { name: t.save, exact: true }).click();
  await expect(c.getByText(t.conflict, { exact: true })).toBeVisible();
  await expect(
    c.getByRole('textbox', { name: t.next, exact: true }),
  ).toHaveValue('PRIVATE_DRAFT');
  const good = await page.evaluate((k) => localStorage.getItem(k), pk);
  await page.evaluate((k) => {
    localStorage.setItem(k, 'broken');
    window.dispatchEvent(new Event('gemnao-play-plans'));
  }, pk);
  await expect(
    c.getByRole('textbox', { name: t.next, exact: true }),
  ).toHaveValue('PRIVATE_DRAFT');
  await c.getByRole('button', { name: t.save, exact: true }).click();
  assert.equal(
    await page.evaluate((k) => localStorage.getItem(k), pk),
    'broken',
  );
  await page.evaluate(
    ({ k, good, sk }) => {
      localStorage.setItem(k, good);
      localStorage.setItem(sk, '{"version":1,"items":[]}');
    },
    { k: pk, good, sk },
  );
  await page.reload();
  await c.locator('summary').filter({ hasText: t.archived }).click();
  await expect(c.getByText(t.snapshotMissing, { exact: true })).toBeVisible();
  await expect(c.getByText('1920x1080', { exact: true })).toBeVisible();
  await c.getByRole('button', { name: a.editTrouble, exact: true }).click();
  await c
    .getByRole('textbox', { name: a.tried, exact: true })
    .fill('PRIVATE_FIX_DRAFT');
  await page.evaluate((k) => {
    localStorage.setItem(k, 'broken');
    window.dispatchEvent(new Event('gemnao-play-activity'));
  }, ak);
  await expect(
    c.getByRole('textbox', { name: a.tried, exact: true }),
  ).toHaveValue('PRIVATE_FIX_DRAFT');
  await c.getByRole('button', { name: t.save, exact: true }).click();
  assert.equal(
    await page.evaluate((k) => localStorage.getItem(k), ak),
    'broken',
  );
  await context.close();
  // Actual browser restart with an on-disk profile; never uses a production URL.
  const profile = await mkdtemp(path.join(tmpdir(), 'gemnao-play-restart-'));
  const persist = async () => {
    const ctx = await chromium.launchPersistentContext(profile, {
      executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
      headless: true,
      args: ['--no-sandbox'],
      viewport: { width: 390, height: 844 },
    });
    await ctx.route('**/*', (r) => {
      const u = new URL(r.request().url());
      if (u.origin !== base) return r.abort();
      if (u.pathname.startsWith('/api/'))
        return r.fulfill({ json: { rows: [], items: [], enabled: false } });
      return r.continue();
    });
    return ctx;
  };
  try {
    let ctx = await persist();
    let pg = await ctx.newPage();
    await pg.goto(base + '/en/my-games');
    await pg.evaluate((data) => {
      for (const [k, v] of Object.entries(data)) localStorage.setItem(k, v);
    }, seed);
    await pg.reload();
    const cp = await edit(pg);
    await cp.getByRole('button', { name: t.save, exact: true }).click();
    await expect(cp.getByText(t.saved, { exact: true })).toBeVisible();
    await cp
      .getByRole('textbox', { name: a.taskText, exact: true })
      .fill('Restart task');
    await cp.getByRole('button', { name: a.add, exact: true }).click();
    await cp
      .getByRole('checkbox', { name: 'Restart task', exact: true })
      .check();
    await cp.getByRole('button', { name: a.editTrouble, exact: true }).click();
    await cp
      .getByRole('textbox', { name: a.tried, exact: true })
      .fill('Restart retained fix');
    await cp
      .getByRole('textbox', { name: a.nextFix, exact: true })
      .fill('Check next');
    await cp
      .getByRole('combobox', { name: a.note, exact: true })
      .selectOption('note-1');
    await cp.getByRole('button', { name: t.save, exact: true }).click();
    await expect(cp.getByText(a.savedTrouble, { exact: true })).toBeVisible();
    await ctx.close();
    ctx = await persist();
    pg = await ctx.newPage();
    await pg.goto(base + '/en/my-games');
    const resumed = card(pg);
    await expect(
      resumed.getByText('PRIVATE_PROGRESS chapter 2', { exact: true }),
    ).toBeVisible();
    await expect(
      resumed.getByRole('checkbox', { name: 'Restart task', exact: true }),
    ).toBeChecked();
    await expect(
      resumed.getByText('Restart retained fix', { exact: true }),
    ).toBeVisible();
    // A second tab changes the record; the open draft must not overwrite it.
    await resumed.getByRole('button', { name: t.edit, exact: true }).click();
    await resumed
      .getByRole('textbox', { name: t.next, exact: true })
      .fill('STALE TAB DRAFT');
    const other = await ctx.newPage();
    await other.goto(base + '/en/my-games');
    await other.evaluate((k) => {
      const v = JSON.parse(localStorage.getItem(k));
      v.items[0].revision++;
      v.items[0].next = 'Other tab saved';
      localStorage.setItem(k, JSON.stringify(v));
    }, pk);
    await expect(
      resumed.getByText('Other tab saved', { exact: true }),
    ).toBeVisible();
    await resumed.getByRole('button', { name: t.save, exact: true }).click();
    await expect(resumed.getByText(t.conflict, { exact: true })).toBeVisible();
    await expect(
      resumed.getByRole('textbox', { name: t.next, exact: true }),
    ).toHaveValue('STALE TAB DRAFT');
    // Removing a source note never erases the continuation of troubleshooting.
    await other.evaluate(() =>
      localStorage.setItem('gemnao-solutions-v1', '{"version":1,"items":[]}'),
    );
    await expect(
      resumed.getByText(a.noteMissing, { exact: true }),
    ).toBeVisible();
    await expect(
      resumed.getByText('Restart retained fix', { exact: true }),
    ).toBeVisible();
    await ctx.close();
  } finally {
    await rm(profile, { recursive: true, force: true });
  }
  console.log(
    'PASS: actual browser restart, existing note references, missing source note and cross-tab stale draft protection',
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  assert(
    !requests.some((r) => /PRIVATE_/.test(r)),
    'private data leaked in a request',
  );
  await writeFile(
    '.wrangler/play-review/results.json',
    JSON.stringify({ results, errors, failed, privateRequests: 0 }, null, 2),
  );
  console.log(
    'PASS: 4 locales × 320/360/390/1440px; continuation, matching, cached settings, keyboard tasks/delete/reload/restore, troubleshooting, local persistence and old-key preservation; unsafe URL/quota/conflict/corrupt drafts; no overflow, JS/asset errors or private-data requests',
  );
} finally {
  await browser.close();
}
