/* oxlint-disable typescript/unbound-method -- Test saves prototype methods and invokes them with .call(this). */
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { chromium, expect } from '@playwright/test';
async function moduleFrom(p) {
  const r = await build({
    entryPoints: [p],
    platform: 'node',
    format: 'esm',
    bundle: true,
    packages: 'external',
    write: false,
  });
  return import(
    'data:text/javascript;base64,' +
      Buffer.from(r.outputFiles[0].contents).toString('base64')
  );
}
const { myGamesTransferCopy: copy } = await moduleFrom(
  'lib/my-games-transfer-copy.ts',
);
const { gameSettingsCopy: settings } = await moduleFrom(
  'lib/game-settings-copy.ts',
);
const {
  backupKeys,
  parseMyGamesBackup,
  BACKUP_MAX_BYTES,
  BACKUP_RECOVERY_KEY,
} = await moduleFrom('lib/my-games-backup.ts');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8795';
assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const snap = {
  id: 'snapshot-1',
  gameSlug: 'apex-legends',
  createdAt: '2026-10-14T01:00:00Z',
  name: 'First',
  resolution: '2560x1440',
  preset: 'Low',
  fpsLimit: '0',
  controller: 'Keyboard',
  memo: 'PRIVATE_MEMO',
  checkedOn: '2026-10-14',
  comfortable: true,
};
const second = {
  ...snap,
  id: 'snapshot-2',
  name: 'Second',
  preset: 'High',
  memo: 'PRIVATE_OTHER_MEMO',
};
const note = {
  id: 'note-1',
  gameSlug: 'apex-legends',
  title: 'PRIVATE_CASE',
  status: 'unresolved',
  diagnosis: 'Observed',
  settings: 'Low',
  notes: 'PRIVATE_NOTE',
  articlePath: '/games/apex-legends/javelin-launch-error',
  stepId: 'update-restart',
  completedSteps: [],
  createdAt: snap.createdAt,
  updatedAt: snap.createdAt,
};
const plan = {
  gameSlug: 'apex-legends',
  progress: 'PRIVATE_PROGRESS',
  next: 'PRIVATE_NEXT_' + 'x'.repeat(270),
  guideUrl: 'https://example.com/PRIVATE_GUIDE',
  snapshot: snap,
  minutes: '30',
  company: 'either',
  prepared: 'yes',
  updatedAt: '2026-10-14T02:00:00Z',
  revision: 1,
};
const activity = {
  gameSlug: 'apex-legends',
  tried: 'PRIVATE_TRIED',
  nextFix: 'Next check',
  noteId: 'note-1',
  tasks: [{ id: 'task-1', text: 'PRIVATE_TASK', done: true, deleted: true }],
  revision: 1,
  updatedAt: plan.updatedAt,
};
const seed = {
  'gemnao-my-games': '["apex-legends","valorant"]',
  'gemnao-my-pc': '{"gpu":"rtx-3060","ramGb":16,"windows":11}',
  'gemnao-solutions-v1': JSON.stringify({ version: 1, items: [note] }),
  'gemnao-settings-snapshots-v1': JSON.stringify({
    version: 1,
    items: [snap, second],
  }),
  'gemnao-game-experiments-v1': JSON.stringify({
    version: 1,
    items: [
      {
        id: 'experiment-1',
        gameSlug: 'apex-legends',
        createdAt: snap.createdAt,
        changed: 'PRIVATE_CHANGED',
        purpose: 'Compare',
        before: snap,
        after: second,
        fpsBefore: '',
        fpsAfter: '0',
        result: 'PRIVATE_RESULT',
        performedOn: '2026-10-14',
        decision: 'pending',
      },
    ],
  }),
  'gemnao-play-plans-v1': JSON.stringify({
    version: 1,
    items: [
      plan,
      {
        ...plan,
        gameSlug: 'valorant',
        snapshot: null,
        next: 'Other game next',
        updatedAt: snap.createdAt,
      },
    ],
  }),
  'gemnao-play-activity-v1': JSON.stringify({ version: 1, items: [activity] }),
  'gemnao-official-changes-read-v1':
    '{"version":1,"read":["apex-javelin-20260929-v1"]}',
  'gemnao-today-choices-v1': '{"version":1,"minutes":"45","company":"solo"}',
  'auth-secret': 'DO_NOT_TRANSFER',
  'gemnao-diagnosis-v1': 'DO_NOT_TRANSFER_DIAGNOSIS',
};
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const errors = [],
  badAssets = [],
  requests = [],
  cases = [];
await mkdir('.wrangler/transfer-review', { recursive: true });
async function setup(locale = 'en', width = 390) {
  const context = await browser.newContext({
    viewport: { width, height: 844 },
    acceptDownloads: true,
  });
  await context.route('**/*', (r) => {
    const u = new URL(r.request().url());
    requests.push(r.request().url() + ' ' + (r.request().postData() || ''));
    if (u.origin !== base) return r.abort();
    if (u.pathname.startsWith('/api/'))
      return r.fulfill({
        json: { rows: [], items: [], methods: [], enabled: false },
      });
    return r.continue();
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => {
    if (/\.(css|js)(\?|$)/.test(r.url()) && r.status() !== 200)
      badAssets.push(r.url());
  });
  await page.goto(base + (locale === 'ja' ? '' : '/' + locale));
  await page.evaluate((d) => {
    localStorage.clear();
    for (const [k, v] of Object.entries(d)) localStorage.setItem(k, v);
  }, seed);
  await page.reload();
  return { page, context };
}
const pathFor = (locale) => (locale === 'ja' ? '' : '/' + locale) + '/my-games';
async function upload(panel, t, raw) {
  await expect(
    panel.getByRole('button', { name: t.choose, exact: true }),
  ).toBeEnabled();
  return panel.getByLabel(t.file, { exact: true }).setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(raw),
  });
}
async function confirm(panel, t) {
  await panel.getByRole('checkbox', { name: t.check, exact: true }).focus();
  await panel.page().keyboard.press('Space');
  await panel.getByRole('button', { name: t.confirm, exact: true }).click();
  await expect(panel.getByText(t.restored, { exact: true })).toBeVisible();
}
try {
  for (const locale of ['ja', 'en', 'zh', 'es'])
    for (const width of [320, 360, 390, 1440]) {
      const { page, context } = await setup(locale, width);
      const t = copy[locale],
        s = settings[locale];
      await expect(page.locator('.home-next-game')).toHaveCount(1);
      await expect(page.locator('.home-next-text')).toHaveText(plan.next);
      const href = pathFor(locale) + '#play-plan-apex-legends';
      assert.equal(
        await page.locator('.home-next-game a').getAttribute('href'),
        href,
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      await page.locator('.home-next-game a').click();
      await page.locator('#play-plan-apex-legends').waitFor();
      assert.equal(new URL(page.url()).hash, '#play-plan-apex-legends');
      const section = page.locator('.game-settings[data-game="apex-legends"]');
      await section.locator('summary').first().click();
      await section
        .getByRole('combobox', { name: s.chooseLeft, exact: true })
        .selectOption('snapshot-1');
      const sharing = section.locator('.settings-share');
      const preview = sharing.getByRole('textbox', {
        name: t.sharePreview,
        exact: true,
      });
      await expect(preview).toHaveValue(new RegExp('2560x1440'));
      assert(!(await preview.inputValue()).includes('PRIVATE_MEMO'));
      assert((await preview.inputValue()).includes('2026-10-14'));
      await page.evaluate(() =>
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: async (text) => {
              window.testCopied = text;
            },
          },
        }),
      );
      await sharing.getByRole('button', { name: t.copy, exact: true }).click();
      await expect(sharing.getByText(t.copied, { exact: true })).toBeVisible();
      assert.equal(
        await page.evaluate(() => window.testCopied),
        await preview.inputValue(),
      );
      await sharing
        .getByRole('checkbox', { name: t.includeMemo, exact: true })
        .check();
      assert((await preview.inputValue()).includes('PRIVATE_MEMO'));
      await section
        .getByRole('combobox', { name: s.chooseLeft, exact: true })
        .selectOption('snapshot-2');
      await expect(
        sharing.getByRole('checkbox', { name: t.includeMemo, exact: true }),
      ).not.toBeChecked();
      assert(!(await preview.inputValue()).includes('PRIVATE_OTHER_MEMO'));
      await page.evaluate(() =>
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: async () => {
              throw Error('denied');
            },
          },
        }),
      );
      await sharing.getByRole('button', { name: t.copy, exact: true }).click();
      await expect(sharing.getByText(t.manual, { exact: true })).toBeVisible();
      await sharing
        .getByRole('button', { name: t.manualSelect, exact: true })
        .click();
      assert.equal(
        await preview.evaluate((el) => el.selectionEnd - el.selectionStart),
        (await preview.inputValue()).length,
      );
      const panel = page.locator('#my-games-backup');
      const waiting = page.waitForEvent('download');
      await panel.getByRole('button', { name: t.export, exact: true }).click();
      const downloaded = await waiting;
      const raw = await readFile(await downloaded.path(), 'utf8');
      assert(!raw.includes('DO_NOT_TRANSFER'));
      const original = parseMyGamesBackup(raw).data;
      await page.evaluate((keys) => {
        for (const k of keys) localStorage.removeItem(k);
      }, backupKeys);
      await page.reload();
      await upload(panel, t, raw);
      await expect(
        panel.getByRole('heading', { name: t.preview, exact: true }),
      ).toBeVisible();
      assert.equal(
        await page.evaluate(() => localStorage.getItem('gemnao-play-plans-v1')),
        null,
      );
      await expect(
        panel.getByRole('button', { name: t.confirm, exact: true }),
      ).toBeDisabled();
      await confirm(panel, t);
      await page.reload();
      await expect(
        page
          .locator('#play-plan-apex-legends')
          .getByText(plan.progress, { exact: true }),
      ).toBeVisible();
      const restored = await page.evaluate(
        (keys) =>
          Object.fromEntries(keys.map((k) => [k, localStorage.getItem(k)])),
        backupKeys,
      );
      assert.deepEqual(
        JSON.parse(restored['gemnao-play-activity-v1']).items[0].tasks,
        activity.tasks,
      );
      assert.equal(
        JSON.parse(restored['gemnao-game-experiments-v1']).items[0].after.memo,
        'PRIVATE_OTHER_MEMO',
      );
      assert.equal(
        await page.evaluate(() => localStorage.getItem('auth-secret')),
        'DO_NOT_TRANSFER',
      );
      await upload(panel, t, raw);
      await expect(
        panel.getByRole('heading', { name: t.preview, exact: true }),
      ).toBeVisible();
      await confirm(panel, t);
      assert.deepEqual(
        await page.evaluate(
          (keys) =>
            Object.fromEntries(keys.map((k) => [k, localStorage.getItem(k)])),
          backupKeys,
        ),
        restored,
      );
      const waitingAgain = page.waitForEvent('download');
      await panel.getByRole('button', { name: t.export, exact: true }).click();
      assert.deepEqual(
        parseMyGamesBackup(
          await readFile(await (await waitingAgain).path(), 'utf8'),
        ).data,
        original,
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${locale}/${width} overflow`,
      );
      if (width === 390)
        await panel.screenshot({
          path: `.wrangler/transfer-review/${locale}-390.png`,
        });
      cases.push({ locale, width });
      console.log(`PASS transfer: ${locale} ${width}px`);
      await context.close();
    }
  const { page, context } = await setup();
  const t = copy.en;
  await page.goto(base + '/en/my-games');
  const panel = page.locator('#my-games-backup');
  const raw = JSON.stringify({
    version: 1,
    items: [{ ...note, id: 'legacy-note' }],
  });
  await upload(panel, t, raw);
  await expect(panel.getByText(t.legacy, { exact: true })).toBeVisible();
  await confirm(panel, t);
  assert.equal(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('gemnao-solutions-v1')).items.length,
    ),
    2,
  );
  const stable = await page.evaluate(
    (keys) => Object.fromEntries(keys.map((k) => [k, localStorage.getItem(k)])),
    backupKeys,
  );
  for (const raw of [
    'broken',
    '{"version":99,"items":[]}',
    JSON.stringify({
      version: 1,
      items: [{ ...note, articlePath: 'javascript:alert(1)' }],
    }),
  ]) {
    await upload(panel, t, raw);
    await expect(panel.getByText(t.invalid, { exact: true })).toBeVisible();
    assert.deepEqual(
      await page.evaluate(
        (keys) =>
          Object.fromEntries(keys.map((k) => [k, localStorage.getItem(k)])),
        backupKeys,
      ),
      stable,
    );
  }
  await page.evaluate(() => {
    localStorage.setItem('gemnao-play-activity-v1', 'broken');
    window.dispatchEvent(new Event('gemnao-play-activity'));
  });
  await upload(
    panel,
    t,
    JSON.stringify({
      version: 1,
      items: [{ ...note, id: 'invalid-current-test' }],
    }),
  );
  await expect(
    panel.getByText(t.currentInvalid, { exact: true }),
  ).toBeVisible();
  assert.equal(
    await page.evaluate(() => localStorage.getItem('gemnao-play-activity-v1')),
    'broken',
  );
  await page.evaluate((value) => {
    localStorage.setItem('gemnao-play-activity-v1', value);
    window.dispatchEvent(new Event('gemnao-play-activity'));
  }, stable['gemnao-play-activity-v1']);
  await panel.getByLabel(t.file, { exact: true }).setInputFiles({
    name: 'large.json',
    mimeType: 'application/json',
    buffer: Buffer.alloc(BACKUP_MAX_BYTES + 1, 32),
  });
  await expect(panel.getByText(t.size, { exact: true })).toBeVisible();
  const newNote = JSON.stringify({
    version: 1,
    items: [{ ...note, id: 'new-note' }],
  });
  await upload(panel, t, newNote);
  await expect(
    panel.getByRole('heading', { name: t.preview, exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    localStorage.setItem('gemnao-my-games', '["pubg"]');
    window.dispatchEvent(new Event('gemnao-my-data'));
  });
  await panel.getByRole('checkbox', { name: t.check, exact: true }).check();
  await panel.getByRole('button', { name: t.confirm, exact: true }).click();
  await expect(panel.getByText(t.changed, { exact: true })).toBeVisible();
  assert.equal(
    await page.evaluate(() => localStorage.getItem('gemnao-my-games')),
    '["pubg"]',
  );
  await panel.getByRole('button', { name: t.cancel, exact: true }).click();
  // Remove the chosen game from the home shortcut, then remove all saved games.
  await page.goto(base + '/en');
  await expect(page.locator('.home-next-game')).toHaveCount(0);
  await page.evaluate(() => {
    localStorage.setItem('gemnao-my-games', '["valorant"]');
    window.dispatchEvent(new Event('gemnao-my-data'));
  });
  await expect(page.locator('.home-next-text')).toHaveText('Other game next');
  await page.evaluate(() => {
    localStorage.setItem('gemnao-my-games', '[]');
    window.dispatchEvent(new Event('gemnao-my-data'));
  });
  await expect(page.locator('.home-next-game')).toHaveCount(0);
  // Journal/rollback recovery through UI after reload, including original-state export.
  await page.goto(base + '/en/my-games');
  await page.evaluate((keys) => {
    for (const k of keys) localStorage.removeItem(k);
  }, backupKeys);
  await page.reload();
  // Create a full file from another temporary context's seeded data.
  const other = await context.newPage();
  await other.goto(base + '/en/my-games');
  await other.evaluate((data) => {
    for (const [k, v] of Object.entries(data)) localStorage.setItem(k, v);
  }, seed);
  await other.reload();
  const d = other.waitForEvent('download');
  await other
    .locator('#my-games-backup')
    .getByRole('button', { name: t.export, exact: true })
    .click();
  const fullRaw = await readFile(await (await d).path(), 'utf8');
  await other.close();
  await page.evaluate((keys) => {
    for (const k of keys) localStorage.removeItem(k);
  }, backupKeys);
  await page.reload();
  await upload(panel, t, fullRaw);
  await expect(
    panel.getByRole('heading', { name: t.preview, exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    window.oldSet = Storage.prototype.setItem;
    window.oldRemove = Storage.prototype.removeItem;
    window.failedRestore = false;
    Storage.prototype.setItem = function (k, v) {
      if (k === 'gemnao-my-pc') {
        window.failedRestore = true;
        throw new DOMException('quota', 'QuotaExceededError');
      }
      window.oldSet.call(this, k, v);
    };
    Storage.prototype.removeItem = function (k) {
      if (window.failedRestore)
        throw new DOMException('blocked', 'SecurityError');
      window.oldRemove.call(this, k);
    };
  });
  await panel.getByRole('checkbox', { name: t.check, exact: true }).check();
  await panel.getByRole('button', { name: t.confirm, exact: true }).click();
  await expect(panel.getByText(t.pending, { exact: true })).toBeVisible();
  assert(
    await page.evaluate((k) => !!localStorage.getItem(k), BACKUP_RECOVERY_KEY),
  );
  await page.reload();
  await expect(panel.getByText(t.pending, { exact: true })).toBeVisible();
  const priorWaiting = page.waitForEvent('download');
  await panel
    .getByRole('button', { name: t.recoveryFile, exact: true })
    .click();
  const prior = parseMyGamesBackup(
    await readFile(await (await priorWaiting).path(), 'utf8'),
  ).data;
  assert.equal(prior.notes.length, 0);
  assert.equal(prior.games.length, 0);
  await panel.getByRole('button', { name: t.recover, exact: true }).click();
  await expect(panel.getByText(t.recovered, { exact: true })).toBeVisible();
  assert.equal(
    await page.evaluate((k) => localStorage.getItem(k), BACKUP_RECOVERY_KEY),
    null,
  );
  await upload(panel, t, fullRaw);
  await expect(
    panel.getByRole('heading', { name: t.preview, exact: true }),
  ).toBeVisible();
  await confirm(panel, t);
  await page.goto(base + '/my');
  await expect(page.locator('#my-games-backup')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'ノートをバックアップ', exact: true }),
  ).toBeVisible();
  await context.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(badAssets, []);
  assert(
    !requests.some((r) => /PRIVATE_|DO_NOT_TRANSFER/.test(r)),
    'private request',
  );
  await writeFile(
    '.wrangler/transfer-review/results.json',
    JSON.stringify({ cases, errors, badAssets, privateRequests: 0 }, null, 2),
  );
  console.log(
    'PASS: 16 language/width cases; actual home next, safe selected-text copy and fallback; whole backup/download/preview/reload/duplicate round-trip, old notes, invalid/oversize, preview conflict, journal recovery and /my integration; no overflow/private requests/JS or assets errors',
  );
} finally {
  await browser.close();
}
