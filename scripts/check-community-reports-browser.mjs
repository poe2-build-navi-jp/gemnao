// Loopback Pages HTML/assets; every API uses isolated in-memory SQL, never live.
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { chromium, expect } from '@playwright/test';
import { guardFixture } from './community-reports-fixtures.mjs';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8811';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const out = '.wrangler/community-reports-review/browser';
await mkdir(out, { recursive: true });
await build({
  stdin: {
    contents: `export * from './lib/community-reports/service';export * from './lib/community-reports/local';export * from './lib/community-reports/ledger';export {reportCopy} from './lib/community-reports/copy';export {configuredAdmin} from './lib/admin-cookie';`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  outfile: '.wrangler/community-reports-review/browser-api.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
});
const m = await import('../.wrangler/community-reports-review/browser-api.mjs'),
  schema = await readFile('migrations/community-reports/0001.sql', 'utf8');
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const results = [],
  errors = [],
  badAssets = [];
const paths = {
  ja: '/games/monster-hunter-wilds/not-launching',
  en: '/en/games/monster-hunter-wilds/not-launching',
  zh: '/zh/games/ace-combat-8/not-launching',
  es: '/es/games/ace-combat-8/not-launching',
};
function database() {
  const sql = new DatabaseSync(':memory:');
  sql.exec('PRAGMA foreign_keys=ON');
  sql.exec(schema);
  const control = { fail: false };
  return {
    sql,
    control,
    db: {
      prepare(q) {
        let args = [];
        return {
          bind(...v) {
            args = v;
            return this;
          },
          async first() {
            if (control.fail) throw Error('storage');
            return sql.prepare(q).get(...args) || null;
          },
          async all() {
            if (control.fail) throw Error('storage');
            return { success: true, results: sql.prepare(q).all(...args) };
          },
          runSync() {
            if (control.fail) throw Error('storage');
            const r = sql.prepare(q).run(...args);
            return { success: true, meta: { changes: Number(r.changes) } };
          },
          async run() {
            return this.runSync();
          },
        };
      },
      async batch(statements) {
        if (control.fail) throw Error('storage');
        sql.exec('BEGIN');
        try {
          const out = statements.map((q) => q.runSync());
          sql.exec('COMMIT');
          return out;
        } catch (e) {
          sql.exec('ROLLBACK');
          throw e;
        }
      },
    },
  };
}
async function setup(width = 390, mode = 'normal') {
  const c = await browser.newContext({ viewport: { width, height: 900 } }),
    d = database(),
    now = Math.floor(Date.now() / 1000);
  const external = await guardFixture(m.CommunityReportLedger, () =>
    Math.floor(Date.now() / 1000),
  );
  const env = {
    REPORTS_DB: d.db,
    REPORTS_ENABLED: 'true',
    REPORTS_PUBLIC_ENABLED: 'true',
    REPORTS_REVIEW_ENABLED: 'true',
    REPORTS_BUDGET_VERIFIED: 'true',
    REPORTS_GUARD: external.binding,
    REPORTS_GUARD_INSTANCE: external.instanceId,
  };
  await m.cleanupReports(d.db, now);
  d.sql
    .prepare("INSERT INTO community_operations VALUES('monitor',?)")
    .run(String(now));
  const state = {
    posts: [],
    mutations: [],
    mode,
    failed: false,
    holdOwner: false,
    held: null,
    release: null,
  };
  async function api(path, method = 'GET', body, owner, admin = false) {
    d.sql.exec('DELETE FROM community_rate');
    const headers = {
      'cf-connecting-ip': '192.0.2.1',
      ...(method === 'GET'
        ? {}
        : { origin: 'https://local.test', 'Content-Type': 'application/json' }),
      ...(owner ? { 'X-Report-Owner': owner } : {}),
      ...(admin
        ? { cookie: 'gemnao_discord_admin=synthetic-local-admin' }
        : {}),
    };
    return m.handleReports(
      new Request('https://local.test' + path, {
        method,
        headers,
        ...(body !== undefined
          ? { body: typeof body === 'string' ? body : JSON.stringify(body) }
          : {}),
      }),
      mode === 'default-off' ? {} : env,
      Math.floor(Date.now() / 1000),
      async () =>
        m.configuredAdmin(new Request('https://local.test', { headers }), {
          token: 'synthetic-local-admin',
        }),
    );
  }
  await c.route('**/*', async (r) => {
    const u = new URL(r.request().url());
    if (u.origin !== new URL(base).origin) return r.abort();
    if (
      u.pathname.startsWith('/api/reports') ||
      u.pathname === '/api/admin/reports'
    ) {
      const method = r.request().method(),
        body = r.request().postData() || undefined,
        owner = r.request().headers()['x-report-owner'];
      if (method !== 'GET')
        state.mutations.push({
          method,
          path: u.pathname,
          body: body ? JSON.parse(body) : null,
        });
      if (u.pathname === '/api/reports' && method === 'POST')
        state.posts.push(JSON.parse(body));
      if (!state.failed && u.pathname === '/api/reports' && method === 'POST') {
        if (mode === 'capacity')
          d.sql
            .prepare(
              "UPDATE community_operations SET value='100' WHERE key='total'",
            )
            .run();
        if (mode === 'db-failure') d.control.fail = true;
        if (mode === 'rate') {
          state.failed = true;
          return r.fulfill({ status: 429, json: { error: 'rate' } });
        }
      }
      const response = await api(
        u.pathname + u.search,
        method,
        body,
        owner,
        u.pathname === '/api/admin/reports',
      );
      const text = await response.text();
      if (
        !state.failed &&
        u.pathname === '/api/reports' &&
        method === 'POST' &&
        mode === 'lost-ack'
      ) {
        state.failed = true;
        return r.abort('failed');
      }
      if (
        !state.failed &&
        u.pathname === '/api/reports' &&
        method === 'POST' &&
        mode === 'timeout'
      ) {
        state.failed = true;
        await new Promise((resolve) => setTimeout(resolve, 11000));
      }
      if (u.pathname === '/api/reports' && method === 'POST')
        state.failed = true;
      if (
        method === 'GET' &&
        /^\/api\/reports\/[a-f0-9]{32}$/.test(u.pathname) &&
        state.holdOwner
      ) {
        state.holdOwner = false;
        state.held = text;
        await new Promise((resolve) => {
          state.release = resolve;
        });
      }
      return r.fulfill({
        status: response.status,
        headers: Object.fromEntries(response.headers),
        body: text,
      });
    }
    if (u.pathname === '/api/feedback')
      return r.fulfill({
        json:
          r.request().method() === 'POST'
            ? { ok: true }
            : { rows: [], methods: [], stepResultsAvailable: true },
      });
    if (u.pathname.startsWith('/api/'))
      return r.fulfill({
        json: { enabled: false, available: false, rows: [], items: [] },
      });
    return r.continue();
  });
  await c.addInitScript(
    ({ mode }) => {
      localStorage.setItem('gemnao-my-games', '["monster-hunter-wilds"]');
      localStorage.setItem('gemnao-solutions-v1', '{"version":1,"items":[]}');
      localStorage.setItem('legacy-preserve', 'keep private existing data');
      if (mode === 'quota') {
        const original = Object.getOwnPropertyDescriptor(
          Storage.prototype,
          'setItem',
        ).value;
        Storage.prototype.setItem = function (k, v) {
          if (k === 'gemnao-report-owner-v1')
            throw new DOMException(
              'Synthetic storage quota',
              'QuotaExceededError',
            );
          return original.call(this, k, v);
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
      badAssets.push(r.url());
  });
  return { c, p, d, state, api, env };
}
async function checks(p) {
  assert.ok(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  );
  await p.addScriptTag({
    path:
      process.env.COMMUNITY_REPORTS_AXE_PATH ||
      '/tmp/gemnao-audit-artifact/node_modules/axe-core/axe.min.js',
  });
  const x = await p.evaluate(async () =>
    window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    }),
  );
  assert.deepEqual(
    x.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
    [],
  );
}
async function fromArticle(p, locale) {
  const method = ['ja', 'en'].includes(locale)
    ? 'steam-client-isolation'
    : 'step-1';
  await p.goto(base + paths[locale] + '#' + method, {
    waitUntil: 'networkidle',
  });
  const step = p.locator('#' + method);
  await step.locator('button.step-solved').click();
  // A subsequent failed choice must be the value inherited by the report form.
  if (locale !== 'ja') await step.locator('button.step-next').first().click();
  await step.locator('a[href*="/reports?"]').last().click();
  await p.waitForLoadState('networkidle');
  const t = m.reportCopy[locale];
  await expect(p.locator('h1')).toHaveText(t.title);
  await expect(
    p.getByRole('combobox', { name: t.article, exact: true }),
  ).toHaveValue(paths[locale].replace(/^\/(en|zh|es)/, ''));
  await expect(p.locator('.report-step-list input:checked')).toHaveCount(1);
  await expect(
    p.getByRole('combobox', { name: t.outcome, exact: true }),
  ).toHaveValue(locale === 'ja' ? 'resolved' : 'unresolved');
}
async function preview(p, locale) {
  const t = m.reportCopy[locale];
  await p.getByRole('button', { name: t.preview, exact: true }).click();
  await expect(p.locator('.report-preview')).toBeVisible();
  await expect(
    p.getByRole('button', { name: t.send, exact: true }),
  ).toBeDisabled();
  await p.getByLabel(t.consent, { exact: true }).check();
}
async function send(p, locale) {
  const t = m.reportCopy[locale];
  await p.getByRole('button', { name: t.send, exact: true }).evaluate((b) => {
    b.click();
    b.click();
    b.click();
  });
}
async function ticket(p) {
  return p.evaluate(
    () => JSON.parse(localStorage.getItem('gemnao-report-owner-v1')).tickets[0],
  );
}
function reviewEvidence() {
  const day = new Date().toISOString().slice(0, 10);
  return {
    label: 'self-report',
    checkedOn: day,
    basis: 'self-report',
    sources: [],
    observedOn: null,
    result: null,
    environment: '',
    note: '',
  };
}
async function approve(f, id, revision = 1, action = 'approve', extras = {}) {
  const r = await f.api(
    '/api/admin/reports',
    'PATCH',
    {
      id,
      revision,
      requestId: m.randomHex(),
      action,
      reason: 'other',
      ...(action === 'approve' ? { evidence: reviewEvidence() } : {}),
      ...extras,
    },
    undefined,
    true,
  );
  assert.equal(r.status, 200);
}
try {
  for (const width of [320, 390, 1440])
    for (const locale of ['ja', 'en', 'zh', 'es']) {
      const f = await setup(width),
        { p } = f,
        t = m.reportCopy[locale];
      await fromArticle(p, locale);
      await p
        .getByRole('combobox', { name: t.outcome, exact: true })
        .selectOption('unresolved');
      await p.getByLabel(t.version, { exact: true }).fill('1.042.00.02');
      await p
        .getByLabel(t.source, { exact: true })
        .fill('https://example.org/synthetic-first');
      await p
        .getByLabel(t.readOn, { exact: true })
        .fill(new Date().toISOString().slice(0, 10));
      await p
        .getByLabel(t.source, { exact: true })
        .fill('https://example.org/synthetic-replacement');
      await expect(p.getByLabel(t.readOn, { exact: true })).toHaveValue('');
      await preview(p, locale);
      assert.equal(f.state.posts.length, 0);
      await checks(p);
      await p.screenshot({
        path: `${out}/${locale}-preview-${width}.png`,
        fullPage: true,
      });
      await send(p, locale);
      await expect(p.locator('.report-history')).toBeVisible();
      assert.equal(f.state.posts.length, 1);
      const saved = await ticket(p);
      assert.equal(
        f.d.sql.prepare('SELECT count(*) AS n FROM community_reports').get().n,
        1,
      );
      assert.equal(
        f.d.sql.prepare('SELECT state FROM community_reports').get().state,
        'pending',
      );
      await p.goto(base + (locale === 'ja' ? '' : '/' + locale) + '/my-games', {
        waitUntil: 'networkidle',
      });
      await expect(p.locator('.my-report-links a')).toContainText('(1)');
      await p.locator('.my-report-links a').click();
      await p.waitForLoadState('networkidle');
      await p
        .locator('#mine')
        .getByRole('button', { name: t.open, exact: true })
        .click();
      await expect(p.locator('.report-history')).toBeVisible();
      await approve(f, saved.id);
      await p.reload({ waitUntil: 'networkidle' });
      await expect(p.locator('.report-public .report-evidence')).toContainText(
        t.labels['self-report'],
      );
      await p
        .locator('#mine')
        .getByRole('button', { name: t.open, exact: true })
        .click();
      await expect(p.locator('.report-history')).toBeVisible();
      await p.getByRole('button', { name: t.edit, exact: true }).click();
      await p
        .getByRole('combobox', { name: t.outcome, exact: true })
        .selectOption('resolved');
      await preview(p, locale);
      await send(p, locale);
      await expect(p.locator('.report-history')).toContainText(t.state.pending);
      await expect(p.locator('.report-public .report-evidence')).toHaveCount(0);
      await p.getByRole('button', { name: t.edit, exact: true }).click();
      await p
        .getByRole('combobox', { name: t.outcome, exact: true })
        .selectOption('recurrence');
      await preview(p, locale);
      await send(p, locale);
      await expect(p.locator('.report-history ol li')).toHaveCount(3);
      assert.equal(
        f.d.sql.prepare('SELECT revision FROM community_reports').get()
          .revision,
        3,
      );
      await checks(p);
      assert.equal(
        await p.evaluate(() => localStorage.getItem('gemnao-my-games')),
        '["monster-hunter-wilds"]',
      );
      assert.equal(
        await p.evaluate(() => localStorage.getItem('gemnao-solutions-v1')),
        '{"version":1,"items":[]}',
      );
      await approve(f, saved.id, 3);
      const articlePath = paths[locale].replace(/^\/(en|zh|es)/, '');
      const cite = await f.api(
        '/api/admin/reports',
        'PATCH',
        {
          id: saved.id,
          revision: 3,
          requestId: m.randomHex(),
          action: 'cite',
          reason: 'other',
          articlePath,
        },
        undefined,
        true,
      );
      assert.equal(cite.status, 403);
      // Synthetic historical reference verifies withdrawal of old citations.
      f.d.sql
        .prepare('INSERT INTO community_article_refs VALUES(?,?,?,?,NULL,NULL)')
        .run(saved.id, articlePath, 3, Math.floor(Date.now() / 1000));
      p.once('dialog', (dialog) => dialog.accept());
      await p
        .locator('#mine')
        .getByRole('button', { name: t.remove, exact: true })
        .click();
      await expect(p.locator('#mine .report-owner')).toHaveCount(0);
      await expect(p.locator('.report-workspace > output')).toContainText(
        t.withdrawal,
      );
      await expect(p.locator('.report-history')).toHaveCount(0);
      await expect(p.locator('.report-public .report-evidence')).toHaveCount(0);
      assert.equal(
        f.d.sql.prepare('SELECT content_json FROM community_reports').get()
          .content_json,
        '{}',
      );
      const canon = (locale === 'ja' ? '' : '/' + locale) + '/reports';
      assert.equal(
        await p.locator('head link[rel=canonical]').getAttribute('href'),
        'https://gemnao.pages.dev' + canon,
      );
      assert.equal(
        await p.locator('head link[rel=alternate][hreflang]').count(),
        5,
      );
      assert.match(
        await p.locator('head meta[name=robots]').getAttribute('content'),
        /noindex/,
      );
      console.log(
        `PASS: ${locale} ${width}px inheritance/preview/consent/history/re-review/quoted-delete/compatibility/axe`,
      );
      results.push({ locale, width, flow: 'full report lifecycle' });
      await f.c.close();
    }
  for (const mode of [
    'default-off',
    'lost-ack',
    'timeout',
    'capacity',
    'rate',
    'db-failure',
    'quota',
  ]) {
    const f = await setup(390, mode),
      { p } = f,
      t = m.reportCopy.en;
    await fromArticle(p, 'en');
    await preview(p, 'en');
    if (mode === 'default-off') {
      await expect(
        p.getByRole('button', { name: t.send, exact: true }),
      ).toBeDisabled();
      assert.equal(f.state.posts.length, 0);
    } else {
      await send(p, 'en');
      await expect(p.getByRole('alert').first()).toBeVisible({
        timeout: 15000,
      });
      if (mode === 'quota') {
        assert.equal(f.state.posts.length, 0);
        assert.equal(
          await p.evaluate(() =>
            localStorage.getItem('gemnao-report-owner-v1'),
          ),
          null,
        );
        await expect(p.getByLabel(t.version, { exact: true })).toBeVisible();
      } else {
        const first = await ticket(p);
        assert.ok(first.pending);
        if (mode === 'lost-ack') {
          await p.reload({ waitUntil: 'networkidle' });
          await expect(p.locator('.report-pending')).toBeVisible();
          assert.equal(
            (await ticket(p)).pending.body.requestId,
            first.pending.body.requestId,
          );
        }
        f.d.control.fail = false;
        if (mode === 'capacity')
          f.d.sql
            .prepare(
              "UPDATE community_operations SET value='0' WHERE key='total'",
            )
            .run();
        await p.getByRole('button', { name: t.retry, exact: true }).click();
        await expect(p.locator('.report-history')).toBeVisible();
        assert.equal(f.state.posts.length, 2);
        assert.equal(f.state.posts[0].id, f.state.posts[1].id);
        assert.equal(f.state.posts[0].requestId, f.state.posts[1].requestId);
        assert.equal(
          f.d.sql.prepare('SELECT count(*) AS n FROM community_reports').get()
            .n,
          1,
        );
      }
    }
    await checks(p);
    console.log(`PASS: ${mode} draft retention/retry`);
    results.push({ mode, flow: 'failure/retry' });
    await f.c.close();
  }
  // Definite revision conflict keeps proposed text but unlocks a new revision.
  {
    const f = await setup(),
      { p } = f,
      t = m.reportCopy.en;
    await fromArticle(p, 'en');
    await preview(p, 'en');
    await send(p, 'en');
    await expect(p.locator('.report-history')).toBeVisible();
    const saved = await ticket(p);
    await p.getByRole('button', { name: t.edit, exact: true }).click();
    await p.getByLabel(t.version, { exact: true }).fill('9.1');
    const row = f.d.sql
      .prepare('SELECT content_json FROM community_reports WHERE id=?')
      .get(saved.id);
    const remote = { ...JSON.parse(row.content_json), version: '8.1' };
    assert.equal(
      (
        await f.api(
          '/api/reports/' + saved.id,
          'PATCH',
          {
            requestId: m.randomHex(),
            content: remote,
            revision: 1,
            consent: 1,
          },
          saved.key,
        )
      ).status,
      200,
    );
    await preview(p, 'en');
    await send(p, 'en');
    await expect(p.getByRole('alert')).toContainText(t.errors.conflict);
    await expect(p.getByLabel(t.version, { exact: true })).toHaveValue('9.1');
    assert.equal((await ticket(p)).pending, null);
    await preview(p, 'en');
    await send(p, 'en');
    await expect(p.locator('.report-history')).toContainText('9.1');
    assert.equal(
      f.d.sql.prepare('SELECT revision FROM community_reports').get().revision,
      3,
    );
    console.log('PASS: two-tab edit conflict recovery');
    results.push({ flow: 'two-tab conflict recovery' });
    await f.c.close();
  }
  // A delayed private response cannot redisplay text after deletion/new report.
  for (const action of ['delete', 'new']) {
    const f = await setup(),
      { p } = f,
      t = m.reportCopy.en;
    await fromArticle(p, 'en');
    await preview(p, 'en');
    await send(p, 'en');
    await expect(p.locator('.report-history')).toBeVisible();
    f.state.holdOwner = true;
    await p
      .locator('#mine')
      .getByRole('button', { name: t.open, exact: true })
      .click();
    await expect.poll(() => !!f.state.release).toBe(true);
    if (action === 'delete') {
      p.once('dialog', (d) => d.accept());
      await p
        .locator('#mine')
        .getByRole('button', { name: t.remove, exact: true })
        .click();
      await expect(p.locator('#mine .report-owner')).toHaveCount(0);
    } else
      await p.getByRole('button', { name: t.newReport, exact: true }).click();
    f.state.release();
    await p.waitForTimeout(250);
    await expect(p.locator('.report-history')).toHaveCount(0);
    if (action === 'new')
      await expect(
        p.getByRole('combobox', { name: t.article, exact: true }),
      ).toHaveValue('');
    console.log(`PASS: delayed owner response after ${action}`);
    results.push({ flow: 'late-owner-response-' + action });
    await f.c.close();
  }
  // Existing admin session verifier, four-language review UI and no new login.
  {
    const f = await setup(),
      { p } = f;
    await fromArticle(p, 'en');
    await preview(p, 'en');
    await send(p, 'en');
    await expect(p.locator('.report-history')).toBeVisible();
    await p.goto(base + '/admin/reports', { waitUntil: 'networkidle' });
    for (const locale of ['ja', 'en', 'zh', 'es']) {
      await p
        .getByRole('combobox', { name: 'Language', exact: true })
        .selectOption(locale);
      await p.locator('.report-workspace > button').first().click();
      await expect(p.locator('.review-card')).toHaveCount(1);
      await expect(
        p.getByLabel(m.reportCopy[locale].sourceReadOn, { exact: true }),
      ).toHaveCount(1);
      await expect(
        p.getByLabel(m.reportCopy[locale].reviewed, { exact: true }),
      ).toHaveCount(1);
      await checks(p);
      await p.screenshot({
        path: `${out}/${locale}-admin-390.png`,
        fullPage: true,
      });
    }
    await p
      .getByRole('combobox', { name: 'Language', exact: true })
      .selectOption('en');
    await p
      .getByLabel(m.reportCopy.en.reviewed, { exact: true })
      .first()
      .fill(new Date().toISOString().slice(0, 10));
    const approval = p.getByRole('button', {
      name: 'Approve preview for publication',
      exact: true,
    });
    await expect(approval).toBeDisabled();
    await p
      .getByRole('button', { name: 'Preview after review', exact: true })
      .click();
    await expect(approval).toBeDisabled();
    await p
      .getByLabel(
        'I read the source or check record and confirmed the scope of this label. Review alone is not independent verification.',
        { exact: true },
      )
      .check();
    await approval.click();
    await expect
      .poll(
        () =>
          f.d.sql.prepare('SELECT state FROM community_reports').get().state,
      )
      .toBe('approved');
    assert.equal(
      JSON.parse(
        f.d.sql.prepare('SELECT public_json FROM community_reports').get()
          .public_json,
      ).evidence.label,
      'self-report',
    );
    console.log(
      'PASS: existing-admin verifier and four-language review screens',
    );
    results.push({ flow: 'four-language admin review' });
    await f.c.close();
  }
  {
    const f = await setup(),
      { p } = f,
      t = m.reportCopy.en;
    await fromArticle(p, 'en');
    await preview(p, 'en');
    await send(p, 'en');
    await expect(p.locator('.report-history')).toBeVisible();
    const saved = await ticket(p);
    await approve(f, saved.id);
    await p.reload({ waitUntil: 'networkidle' });
    const flag = p.locator('.report-public .report-flag');
    await flag.getByRole('button', { name: t.flag, exact: true }).click();
    await expect(flag).toContainText(t.flagged);
    await expect(
      flag.getByRole('button', { name: t.flag, exact: true }),
    ).toBeDisabled();
    assert.equal(
      f.d.sql.prepare('SELECT count(*) AS n FROM community_flags').get().n,
      1,
    );
    await p
      .locator('#mine')
      .getByRole('button', { name: t.open, exact: true })
      .click();
    await expect(p.locator('.report-history')).toBeVisible();
    await p.evaluate(() =>
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'gemnao-my-games',
          storageArea: localStorage,
        }),
      ),
    );
    await expect(p.locator('.report-history')).toBeVisible();
    await f.api(
      '/api/reports/' + saved.id,
      'DELETE',
      { requestId: m.randomHex() },
      saved.key,
    );
    await p.evaluate(() => {
      localStorage.setItem(
        'gemnao-report-owner-v1',
        JSON.stringify({ version: 1, tickets: [] }),
      );
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'gemnao-report-owner-v1',
          storageArea: localStorage,
        }),
      );
    });
    await expect(p.locator('.report-history')).toHaveCount(0);
    await expect(p.locator('.report-public .report-evidence')).toHaveCount(0);
    console.log(
      'PASS: flag UI and cross-tab deletion invalidates private/public views without disturbing old keys',
    );
    results.push({ flow: 'flags and cross-tab invalidation' });
    await f.c.close();
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(badAssets, []);
  await writeFile(
    `${out}/results.json`,
    JSON.stringify(
      { results, errors, badAssets, remoteWrites: 0, liveAnalytics: 0 },
      null,
      2,
    ),
  );
  console.log(
    `PASS: ${results.length} browser flows, intercepted APIs backed by local SQLite; no production data or config.`,
  );
} finally {
  await browser.close();
}
