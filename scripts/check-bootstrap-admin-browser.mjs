// Loopback-only UI tests. Requests are intercepted; no production credentials,
// SQL, guard invocation, initialization or provider configuration changes.
import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.TEST_BOOTSTRAP_BASE_URL || 'http://127.0.0.1:8861';
const closed =
  process.env.TEST_BOOTSTRAP_CLOSED_BASE_URL || 'http://127.0.0.1:8862';
for (const value of [base, closed]) {
  const url = new URL(value);
  assert.equal(url.protocol, 'http:');
  assert.ok(['127.0.0.1', 'localhost'].includes(url.hostname));
  assert.ok(url.port);
}
const out =
  process.env.TEST_BOOTSTRAP_OUTPUT || '.wrangler/bootstrap-admin-ui-review';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const id = '11111111-1111-4111-8111-111111111111';
const marker = 'gemnao-reports-bootstrap-attempt-v1';
const results = [],
  errors = [],
  badAssets = [];
async function pageFor(origin = base, authenticated = true, init = null) {
  const context = await browser.newContext({
    viewport: { width: 320, height: 820 },
  });
  if (authenticated)
    await context.addCookies([
      {
        name: 'gemnao_discord_admin',
        value: 'fixture-local-admin-session',
        url: origin,
        httpOnly: true,
        sameSite: 'Strict',
      },
    ]);
  if (init) await context.addInitScript(init);
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== new URL(origin).origin) return route.abort();
    return route.continue();
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => {
    if (/\.(css|js)(?:\?|$)/.test(r.url()) && r.status() !== 200)
      badAssets.push(r.url());
  });
  return { context, page };
}
async function navigate(page, origin = base) {
  const response = await page.goto(origin + '/admin/reports-bootstrap');
  assert.equal(response.status(), 200);
  const headers = await response.allHeaders();
  assert.equal(headers['cache-control'], 'private, no-store');
  assert.match(headers['x-robots-tag'], /noindex/);
  assert.equal(headers['referrer-policy'], 'no-referrer');
  assert.match(headers['content-security-policy'], /form-action 'self'/);
  assert.match(headers['content-security-policy'], /frame-ancestors 'none'/);
  assert.equal(
    await page.locator('meta[name="robots"]').getAttribute('content'),
    'noindex, nofollow, noarchive',
  );
}
try {
  const unauth = await pageFor(base, false);
  await navigate(unauth.page);
  await expect(
    unauth.page.getByText('既存の管理者ログインが必要です。', { exact: false }),
  ).toBeVisible();
  await expect(
    unauth.page.getByRole('button', { name: '初期化を1回実行' }),
  ).toHaveCount(0);
  await expect(
    unauth.page.getByRole('link', { name: 'お問い合わせ管理でログイン' }),
  ).toHaveAttribute('href', '/admin/contacts');
  await unauth.context.close();
  results.push(
    'unauthenticated SSR hides action; existing login only; private headers',
  );

  const stopped = await pageFor(closed);
  await navigate(stopped.page, closed);
  await expect(
    stopped.page.getByRole('button', { name: '初期化を1回実行' }),
  ).toBeDisabled();
  await expect(
    stopped.page.getByText('初期化は現在許可されていません。', {
      exact: false,
    }),
  ).toBeVisible();
  await stopped.page.screenshot({
    path: out + '/closed-320.png',
    fullPage: true,
  });
  await stopped.context.close();
  results.push('closed configuration disables normal UI without any POST');

  for (const mode of [
    'success',
    'unauthorized',
    'closed',
    'server-error',
    'malformed',
    'extra-field',
    'network',
  ]) {
    const { context, page } = await pageFor();
    let calls = 0;
    await page.route('**/api/admin/reports-bootstrap', async (route) => {
      calls++;
      const request = route.request();
      assert.equal(request.method(), 'POST');
      assert.ok(request.postData() === null || request.postData() === '');
      assert.equal(new URL(request.url()).search, '');
      assert.equal(request.headers().origin, new URL(base).origin);
      assert.ok(!request.headers()['authorization']);
      if (mode === 'network') return route.abort('failed');
      const status =
        mode === 'unauthorized'
          ? 401
          : mode === 'closed'
            ? 409
            : mode === 'server-error'
              ? 503
              : 200;
      const json =
        mode === 'unauthorized'
          ? { error: 'unauthorized' }
          : mode === 'closed'
            ? { error: 'setup-closed' }
            : mode === 'server-error'
              ? { error: 'unavailable' }
              : mode === 'malformed'
                ? { ok: true, instanceId: 'bad' }
                : mode === 'extra-field'
                  ? { ok: true, instanceId: id, token: 'DO_NOT_SHOW' }
                  : { ok: true, instanceId: id };
      await route.fulfill({ status, json });
    });
    await navigate(page);
    const button = page.getByRole('button', { name: '初期化を1回実行' });
    await expect(button).toBeEnabled();
    assert.equal(calls, 0);
    await button.evaluate((el) => {
      el.click();
      el.click();
    });
    if (mode === 'success') await expect(page.locator('code')).toHaveText(id);
    else await expect(page.getByRole('status')).not.toContainText('送信中です');
    await expect(button).toBeDisabled();
    assert.equal(calls, 1);
    assert.equal(
      (await page.locator('body').innerText()).includes('DO_NOT_SHOW'),
      false,
    );
    if (mode === 'success')
      await page.screenshot({ path: out + '/success-320.png', fullPage: true });
    await page.reload();
    await expect(button).toBeDisabled();
    if (mode === 'success') await expect(page.locator('code')).toHaveText(id);
    await button.evaluate((el) => el.click());
    assert.equal(calls, 1);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await context.close();
    results.push(
      mode + ': one bodyless POST, double-click and reload do not repeat',
    );
  }

  const unavailable = await pageFor(base, true, () => {
    // oxlint-disable-next-line typescript/unbound-method -- Called with its original receiver below.
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'gemnao-reports-bootstrap-attempt-v1')
        throw Error('fixture storage');
      return original.call(this, key, value);
    };
  });
  let calls = 0;
  await unavailable.page.route('**/api/admin/reports-bootstrap', (route) => {
    calls++;
    return route.abort();
  });
  await navigate(unavailable.page);
  await unavailable.page
    .getByRole('button', { name: '初期化を1回実行' })
    .click();
  await expect(unavailable.page.getByRole('status')).toContainText(
    '実行していません',
  );
  assert.equal(calls, 0);
  await unavailable.context.close();
  results.push('storage write failure refuses POST');
  assert.deepEqual(errors, []);
  assert.deepEqual(badAssets, []);
  const report = {
    passed: true,
    groups: results.length,
    results,
    jsErrors: errors,
    badAssets,
    productionRequests: 0,
    realInitializations: 0,
    marker,
  };
  await writeFile(
    out + '/results.json',
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
