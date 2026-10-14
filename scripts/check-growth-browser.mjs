// Loopback build with intercepted APIs and blocked external traffic only.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8811';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const out = '.wrangler/growth-review/browser';
await mkdir(out, { recursive: true });
const errors = [],
  badAssets = [],
  results = [];
const paths = {
  ja: '/games/monster-hunter-wilds/not-launching',
  en: '/en/games/monster-hunter-wilds/not-launching',
  zh: '/zh/games/ace-combat-8/not-launching',
  es: '/es/games/ace-combat-8/not-launching',
};
const caseSlug = 'wilds-steam-added-dll';
async function setup(width, mode = 'success') {
  const c = await browser.newContext({ viewport: { width, height: 900 } });
  await c.route('**/*', (r) => {
    const u = new URL(r.request().url());
    if (u.origin !== new URL(base).origin) return r.abort();
    if (u.pathname === '/api/feedback') {
      if (r.request().method() === 'POST')
        return r.fulfill({
          status: mode === 'api-failure' ? 503 : 200,
          json: { ok: mode !== 'api-failure' },
        });
      return r.fulfill({
        json: { rows: [], methods: [], stepResultsAvailable: true },
      });
    }
    if (u.pathname === '/api/game-news') return r.fulfill({ json: {} });
    if (u.pathname.startsWith('/api/'))
      return r.fulfill({
        json: { enabled: false, available: false, rows: [], items: [] },
      });
    return r.continue();
  });
  await c.addInitScript(
    ({ mode }) => {
      localStorage.setItem('legacy-preserve-key', 'synthetic existing data');
      if (mode === 'note-corrupt')
        localStorage.setItem('gemnao-solutions-v1', 'broken');
      if (mode === 'game-corrupt')
        localStorage.setItem('gemnao-my-games', 'broken');
      if (mode === 'game-full')
        localStorage.setItem(
          'gemnao-my-games',
          JSON.stringify(
            Array.from({ length: 10 }, (_, i) => 'synthetic-game-' + i),
          ),
        );
      if (mode === 'note-quota' || mode === 'game-quota') {
        const set = Object.getOwnPropertyDescriptor(
          Storage.prototype,
          'setItem',
        ).value;
        Storage.prototype.setItem = function (k, v) {
          if (
            k ===
            (mode === 'note-quota' ? 'gemnao-solutions-v1' : 'gemnao-my-games')
          )
            throw new DOMException('Synthetic quota', 'QuotaExceededError');
          return set.call(this, k, v);
        };
      }
    },
    { mode },
  );
  const p = await c.newPage();
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('response', (r) => {
    if (
      new URL(r.url()).origin === new URL(base).origin &&
      /\.(css|js)(\?|$)/.test(r.url()) &&
      r.status() !== 200
    )
      badAssets.push({ url: r.url(), status: r.status() });
  });
  return { c, p };
}
async function fixed(p, locale) {
  const target =
    locale === 'ja' || locale === 'en' ? 'steam-client-isolation' : 'step-1';
  await p.goto(base + paths[locale] + '#' + target, {
    waitUntil: 'networkidle',
  });
  const step = target
    ? p.locator('#' + target)
    : p
        .locator('.step-result-controls')
        .first()
        .locator('xpath=ancestor::section[1]');
  await expect(step).toBeVisible();
  await step.locator('button.step-solved').click();
  const save = step.locator('.resolved-fix-save');
  await expect(save).toBeVisible();
  return save;
}
async function overflow(p) {
  assert.ok(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  );
}
async function axe(p) {
  await p.addScriptTag({
    path: '/tmp/gemnao-audit-artifact/node_modules/axe-core/axe.min.js',
  });
  const result = await p.evaluate(() =>
    window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    }),
  );
  assert.deepEqual(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
  );
}
try {
  for (const width of [320, 390, 1440])
    for (const locale of ['ja', 'en', 'zh', 'es']) {
      const { c, p } = await setup(width);
      const save = await fixed(p, locale);
      await save.locator('input').fill('synthetic version 1');
      await save
        .locator('button')
        .first()
        .evaluate((b) => {
          b.click();
          b.click();
          b.click();
        });
      await expect(save.locator('input')).toHaveCount(0);
      await expect(save.locator('a')).toBeVisible();
      const record = await p.evaluate(() =>
        JSON.parse(localStorage.getItem('gemnao-solutions-v1')),
      );
      assert.equal(record.version, 1);
      assert.equal(record.items.length, 1);
      assert.equal(record.items[0].status, 'resolved');
      assert.ok(record.items[0].notes.includes('synthetic version 1'));
      assert.ok(record.items[0].settings);
      assert.equal(
        await p.evaluate(() => localStorage.getItem('legacy-preserve-key')),
        'synthetic existing data',
      );
      await overflow(p);
      await axe(p);
      await save.locator('a').click();
      await p.waitForLoadState('networkidle');
      const card = p.locator('#my-game-' + record.items[0].gameSlug);
      await expect(card).toBeVisible();
      await expect(card.locator('.saved-game-fixes article')).toHaveCount(1);
      await card.locator('.saved-game-fixes details summary').click();
      await expect(card.locator('.saved-fix-notes')).toContainText(
        'synthetic version 1',
      );
      await card.locator('.game-maintenance summary').click();
      await expect(card.locator('.game-maintenance')).toContainText(
        '2026-10-14',
      );
      await overflow(p);
      await axe(p);
      await p.screenshot({
        path: `${out}/${locale}-my-games-${width}.png`,
        fullPage: true,
      });
      await card.locator('.saved-game-fixes a').click();
      await p.waitForLoadState('networkidle');
      assert.ok(new URL(p.url()).hash);
      await overflow(p);
      const casePath =
        (locale === 'ja' ? '' : '/' + locale) + '/examples/' + caseSlug;
      await p.goto(base + casePath, { waitUntil: 'networkidle' });
      await expect(p.locator('h1')).toHaveCount(1);
      await expect(p.locator('.reported-case')).toContainText('i5-14400F');
      await p.evaluate(() => {
        window.__caseCitation = '';
        navigator.clipboard.writeText = async (text) => {
          window.__caseCitation = text;
        };
      });
      await p.locator('.case-citation button').click();
      await expect(p.locator('.case-citation output')).not.toBeEmpty();
      assert.ok(
        (await p.evaluate(() => window.__caseCitation)).includes(
          'https://gemnao.pages.dev' + casePath,
        ),
      );
      await p.evaluate(() => {
        navigator.clipboard.writeText = async () => {
          throw Error('synthetic denial');
        };
      });
      await p.locator('.case-citation button').click();
      await expect(p.locator('.case-citation a')).toBeVisible();
      await overflow(p);
      await axe(p);
      await p.screenshot({
        path: `${out}/${locale}-case-${width}.png`,
        fullPage: true,
      });
      const canonical = await p
        .locator('head link[rel=canonical]')
        .getAttribute('href');
      assert.equal(canonical, 'https://gemnao.pages.dev' + casePath);
      assert.equal(
        await p.locator('head link[rel=alternate][hreflang]').count(),
        5,
      );
      results.push({ width, locale, flow: 'save/reuse/case/citation/axe' });
      console.log(`PASS: ${locale} ${width}px save/reuse/case/citation/axe`);
      await c.close();
    }
  // The existing detailed save route must snapshot dates/version as well.
  {
    const { c, p } = await setup(390);
    await fixed(p, 'ja');
    const note = p.locator('#steam-client-isolation .result-note');
    await note
      .getByRole('button', { name: 'ノートを確認して保存', exact: true })
      .click();
    await expect(note.locator('.resolved-fix-save')).toHaveCount(0);
    const form = note.locator('.solution-form');
    await form
      .getByLabel('あなたのゲーム版（任意）', { exact: true })
      .fill('detailed-version');
    const fields = form.locator('textarea');
    await fields.first().fill('Synthetic player record; no cause established.');
    const limit = Number(await fields.last().getAttribute('maxlength'));
    await fields.last().fill('m'.repeat(limit));
    await form
      .getByRole('button', { name: 'ノートに保存する', exact: true })
      .click();
    await expect(form).toHaveCount(0);
    const record = await p.evaluate(
      () => JSON.parse(localStorage.getItem('gemnao-solutions-v1')).items,
    );
    assert.equal(record.length, 1);
    assert.ok(record[0].notes.startsWith('m'.repeat(limit)));
    assert.ok(record[0].notes.includes('detailed-version'));
    assert.ok(record[0].notes.includes('2026-10-13'));
    assert.ok(record[0].notes.length <= 4000);
    await overflow(p);
    await axe(p);
    results.push({
      width: 390,
      locale: 'ja',
      flow: 'detailed-save/version/date/maximum-notes',
    });
    console.log('PASS: detailed save version/date and maximum notes');
    await c.close();
  }
  for (const mode of [
    'note-corrupt',
    'note-quota',
    'game-corrupt',
    'game-full',
    'game-quota',
    'api-failure',
  ]) {
    const { c, p } = await setup(390, mode),
      save = await fixed(p, 'en');
    if (mode === 'note-corrupt') {
      await expect(save.locator('button').first()).toBeDisabled();
      await expect(save.getByRole('alert')).toBeVisible();
      assert.equal(
        await p.evaluate(() => localStorage.getItem('gemnao-solutions-v1')),
        'broken',
      );
    } else {
      await save.locator('input').fill('input retained');
      await save.locator('button').first().click();
      if (mode === 'note-quota') {
        await expect(save.getByRole('alert')).toBeVisible();
        await expect(save.locator('input')).toHaveValue('input retained');
        assert.equal(
          await p.evaluate(() => localStorage.getItem('gemnao-solutions-v1')),
          null,
        );
      } else {
        await expect(save.locator('input')).toHaveCount(0);
        assert.equal(
          await p.evaluate(
            () =>
              JSON.parse(localStorage.getItem('gemnao-solutions-v1')).items
                .length,
          ),
          1,
        );
        if (mode.startsWith('game-')) {
          await expect(save.getByRole('alert')).toBeVisible();
          await expect(save.locator('button')).toHaveCount(1);
          if (mode === 'game-corrupt')
            assert.equal(
              await p.evaluate(() => localStorage.getItem('gemnao-my-games')),
              'broken',
            );
        }
      }
    }
    await overflow(p);
    await axe(p);
    results.push({ mode, flow: 'failure distinction/input preservation' });
    await c.close();
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(badAssets, []);
  await writeFile(
    `${out}/results.json`,
    JSON.stringify(
      {
        results,
        errors,
        badAssets,
        productionWrites: 0,
        liveAnalyticsEvents: 0,
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS: ${results.length} loopback scenarios; four languages at 320/390/1440, one-record save/game registration/reopen, case metadata/copy fallback, quota/corrupt/cap/API-failure separation, axe and no overflow. All APIs mocked; no live analytics/votes.`,
  );
} finally {
  await browser.close();
}
