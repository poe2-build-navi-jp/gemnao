// Status changes use synthetic rows and intercepted PATCHes only.
import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8796';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const b = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
let cases = 0;
try {
  for (const width of [320, 360, 390, 430, 1440])
    for (const kind of ['contacts', 'discord-servers']) {
      const c = await b.newContext({ viewport: { width, height: 900 } });
      const row =
        kind === 'contacts'
          ? {
              category: 'other',
              page_url: '',
              message: 'Synthetic local contact only',
              reply_email: 'synthetic@example.invalid',
              status: 'new',
              created_at: '2026-10-14T00:00:00Z',
            }
          : {
              server_name: 'Synthetic Local Server',
              description: 'Synthetic local-only server description',
              invite_url: 'https://discord.gg/synthetic-local-only',
              game: 'Synthetic',
              purposes: [],
              styles: [],
              activeTimes: [],
              voice_chat: 'optional',
              requirements: 'Synthetic',
              rules: 'Synthetic',
              owner_discord: 'synthetic_local',
              reply_email: 'synthetic@example.invalid',
              status: 'pending',
              created_at: '2026-10-14T00:00:00Z',
            };
      let mode = 'hang',
        patches = 0,
        reads = 0,
        held;
      const rows = [
        { ...row, id: 1 },
        { ...row, id: 2 },
      ];
      const errors = [];
      await c.route('**/*', (r) => {
        const u = new URL(r.request().url());
        if (u.origin !== new URL(base).origin) return r.abort();
        if (u.pathname.startsWith('/api/admin/' + kind + '/')) {
          assert.equal(r.request().method(), 'PATCH');
          patches++;
          if (mode === 'hang') {
            held = r;
            return;
          }
          if (mode === 'failure') return r.fulfill({ status: 503, json: {} });
          const status = JSON.parse(r.request().postData()).status;
          assert.equal(status, kind === 'contacts' ? 'reviewing' : 'approved');
          rows[0].status = status;
          return r.fulfill({ json: { ok: true } });
        }
        if (u.pathname === '/api/admin/' + kind) {
          reads++;
          return r.fulfill({ json: { submissions: rows } });
        }
        if (u.pathname.startsWith('/api/')) return r.abort();
        return r.continue();
      });
      const p = await c.newPage();
      p.on('pageerror', (e) => errors.push(e.message));
      await p.goto(base + '/admin/' + kind, { waitUntil: 'networkidle' });
      await p.clock.install();
      await expect(p.locator('.admin-server-card')).toHaveCount(2);
      await p.locator('.admin-server-actions button').first().click();
      await expect.poll(() => patches).toBe(1);
      assert.ok(
        await p
          .locator('.admin-server-actions button')
          .evaluateAll((es) => es.every((e) => e.disabled)),
      );
      await p
        .locator('.admin-server-actions button')
        .evaluateAll((es) => es.forEach((e) => e.click()));
      assert.equal(patches, 1);
      await expect(
        p.getByRole('button', { name: '再読み込み', exact: true }),
      ).toBeDisabled();
      await p.clock.fastForward(15001);
      await expect(p.getByRole('alert')).toContainText(
        '更新の完了を確認できません',
      );
      await expect(
        p.locator('.admin-server-actions button').first(),
      ).toBeEnabled();
      await held.abort().catch(() => {});
      assert.equal(patches, 1, 'no automatic update retry');
      mode = 'failure';
      await p.locator('.admin-server-actions button').first().click();
      await expect.poll(() => patches).toBe(2);
      await expect(p.getByRole('alert')).toBeVisible();
      await expect(
        p.locator('.admin-server-actions button').first(),
      ).toBeEnabled();
      mode = 'success';
      await p.locator('.admin-server-actions button').first().click();
      await expect.poll(() => reads).toBe(2);
      await expect(
        p.locator('.admin-server-actions button').first(),
      ).toBeEnabled();
      assert.equal(patches, 3);
      await expect(
        p.locator('.admin-server-card').first().locator('header span'),
      ).toHaveText(kind === 'contacts' ? '確認中' : '公開中');
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert.deepEqual(errors, []);
      cases++;
      await c.close();
    }
  console.log(
    `PASS: ${cases} admin update cases, two synthetic rows, timeout/failure/retry/success, all-row busy guard, refresh after confirmed write, 5 widths, no automatic PATCH and no real data.`,
  );
} finally {
  await b.close();
}
