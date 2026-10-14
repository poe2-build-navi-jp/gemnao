// Local synthetic responses only. No public submission or credentials.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8795';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const b = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const results = [],
  errors = [];
const text = 'Synthetic local test, containing no personal or production data.';
async function fill(p, path) {
  if (path === '/contact') {
    await p.locator('[name=message]').fill(text);
  } else {
    await p.locator('[name=serverName]').fill('Synthetic Local Server');
    await p
      .locator('[name=inviteUrl]')
      .fill('https://discord.gg/synthetic-local-only');
    await p.locator('[name=game]').selectOption({ index: 1 });
    await p.locator('textarea[name=description]').fill(text);
    await p.locator('[name=purpose]').first().check();
    await p.locator('[name=activeTime]').first().check();
    await p.locator('[name=voiceChat]').selectOption({ index: 1 });
    await p.locator('[name=requirements]').fill('Synthetic requirement text');
    await p.locator('[name=rules]').fill('Synthetic rules for local test');
    await p.locator('[name=ownerDiscord]').fill('synthetic_local');
    await p.locator('[name=replyEmail]').fill('synthetic@example.invalid');
  }
  await p.locator('.contact-consent input').check();
}
try {
  for (const width of [320, 360, 390, 430, 1440])
    for (const path of ['/contact', '/discord-servers/submit']) {
      const c = await b.newContext({ viewport: { width, height: 900 } });
      let posts = 0,
        mode = 'hang',
        held;
      await c.route('**/*', (r) => {
        const u = new URL(r.request().url());
        if (u.origin !== new URL(base).origin) return r.abort();
        if (u.pathname.startsWith('/api/')) {
          if (r.request().method() !== 'POST')
            return r.fulfill({ json: { enabled: false, rows: [] } });
          posts++;
          if (mode === 'hang') {
            held = r;
            return;
          }
          return r.fulfill({
            status: mode === 'success' ? 201 : 503,
            json: mode === 'success' ? { ok: true } : { error: 'synthetic' },
          });
        }
        return r.continue();
      });
      const p = await c.newPage();
      p.on('pageerror', (e) => errors.push(e.message));
      await p.goto(base + path, { waitUntil: 'networkidle' });
      await p.clock.install();
      await p.locator('button[type=submit]').click();
      assert.equal(posts, 0, 'native required fields prevent an empty POST');
      await fill(p, path);
      await p.locator('form.contact-form').evaluate((f) => {
        f.requestSubmit();
        f.requestSubmit();
        f.requestSubmit();
      });
      await expect.poll(() => posts).toBe(1);
      await expect(p.locator('button[type=submit]')).toBeDisabled();
      await p.clock.fastForward(15001);
      await expect(p.locator('[role=alert]')).toContainText(
        '送信完了を確認できません',
      );
      await expect(p.locator('button[type=submit]')).toBeEnabled();
      const content = p.locator(
        path === '/contact' ? '[name=message]' : 'textarea[name=description]',
      );
      await expect(content).toHaveValue(text);
      assert.equal(posts, 1, 'no automatic retry');
      await held.abort().catch(() => {});
      mode = 'failure';
      await p.locator('button[type=submit]').click();
      await expect.poll(() => posts).toBe(2);
      await expect(p.locator('[role=alert]')).toContainText(
        '送信できませんでした',
      );
      await expect(content).toHaveValue(text);
      mode = 'success';
      await p.locator('button[type=submit]').click();
      await expect(p.locator('.contact-success')).toBeVisible();
      assert.equal(posts, 3);
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      results.push({ width, path, posts });
      await c.close();
    }
  for (const mode of [
    'hang',
    'unauthorized',
    'server',
    'bad-json',
    'bad-shape',
  ]) {
    const c = await b.newContext({ viewport: { width: 390, height: 900 } });
    let current = mode,
      reads = 0;
    await c.route('**/*', (r) => {
      const u = new URL(r.request().url());
      if (u.origin !== new URL(base).origin) return r.abort();
      if (u.pathname === '/api/admin/search-demand') {
        reads++;
        if (current === 'hang') return;
        if (current === 'bad-json')
          return r.fulfill({ body: 'broken', contentType: 'application/json' });
        if (current === 'bad-shape')
          return r.fulfill({ json: { queries: [{}] } });
        if (current === 'unauthorized' || current === 'server')
          return r.fulfill({
            status: current === 'unauthorized' ? 401 : 503,
            json: {},
          });
        return r.fulfill({ json: { queries: [] } });
      }
      if (u.pathname.startsWith('/api/')) return r.abort();
      return r.continue();
    });
    const p = await c.newPage();
    p.on('pageerror', (e) => errors.push(e.message));
    await p.clock.install();
    await p.goto(base + '/admin/search-demand');
    if (mode === 'hang') {
      await expect.poll(() => reads).toBe(1);
      await p.clock.fastForward(15001);
    }
    await expect(p.locator('[role=alert]')).toBeVisible();
    current = 'success';
    await p.getByRole('button', { name: '再読み込み', exact: true }).click();
    await expect(
      p.getByText('過去30日間に検索0件の記録はありません。', { exact: true }),
    ).toBeVisible();
    assert.equal(reads, 2);
    results.push({ mode, reads });
    await c.close();
  }
  assert.deepEqual(errors, []);
  await mkdir('.wrangler/site-audit/final', { recursive: true });
  await writeFile(
    '.wrangler/site-audit/final/form-results.json',
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(
    `PASS: ${results.length} local form/read scenarios: 5 widths, required fields, triple submit, POST timeout/uncertainty, preserved inputs, 503 retry/201 success, and admin read timeout/auth/JSON/shape/retry. No automatic resend.`,
  );
} finally {
  await b.close();
}
