/* oxlint-disable typescript/unbound-method -- Native input setter is deliberately called with its element receiver. */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8795';
assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const contacts = process.argv.includes('--contacts');
const screen = contacts ? '/admin/contacts' : '/admin/discord-servers';
const listing = '/api' + screen;
const emptyText = contacts ? 'お問い合わせはまだありません。' : '申請はまだありません。';
const retryText = contacts ? '再読み込み' : '認証状態を再確認する';
const evidence = contacts ? '.wrangler/contact-admin-review' : '.wrangler/admin-login-review';
const dummy = 'dummy-local-admin-key'; // Never read a real credential or production cookie.
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const errors = [],
  badAssets = [],
  results = [];
await mkdir(evidence, { recursive: true });
async function setup(width = 390, height = 844) {
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: width < 760,
    hasTouch: true,
  });
  const state = {
    posts: 0,
    reads: 0,
    auth: false,
    loginMode: 'success',
    listMode: 'success',
    held: null,
  };
  await context.route('**/*', (route) => {
    const req = route.request(),
      url = new URL(req.url());
    if (url.origin !== base) return route.abort();
    if (url.pathname === '/api/admin/discord-servers/login') {
      state.posts++;
      assert.equal(req.method(), 'POST');
      assert.equal(req.headers()['content-type'], 'application/json');
      assert.deepEqual(JSON.parse(req.postData()), { token: dummy });
      if (state.loginMode === 'hang') {
        state.held = route;
        return;
      }
      if (state.loginMode === 'network') return route.abort();
      if (state.loginMode === 'wrong')
        return route.fulfill({ status: 401, json: { error: 'denied' } });
      if (state.loginMode === 'server')
        return route.fulfill({ status: 503, json: { error: 'unavailable' } });
      state.auth = true;
      return route.fulfill({ json: { ok: true } });
    }
    if (url.pathname === listing) {
      state.reads++;
      assert.equal(req.method(), 'GET');
      if (state.listMode === 'hang') {
        state.held = route;
        return;
      }
      if (state.listMode === 'network') return route.abort();
      if (!state.auth || state.listMode === 'unauthorized')
        return route.fulfill({ status: 401, json: { error: 'unauthorized' } });
      if (state.listMode === 'bad-json')
        return route.fulfill({
          contentType: 'application/json',
          body: 'broken-json',
        });
      if (state.listMode === 'server')
        return route.fulfill({ status: 500, json: { error: 'unavailable' } });
      return route.fulfill({ json: { submissions: [] } });
    }
    if (url.pathname.startsWith('/api/'))
      return route.fulfill({ json: { rows: [], enabled: false } });
    return route.continue();
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => {
    if (/\.(css|js)(\?|$)/.test(r.url()) && r.status() !== 200)
      badAssets.push(r.url());
  });
  await page.goto(base + screen);
  const input = page.getByLabel('管理キー', { exact: true }),
    button = page.getByRole('button', { name: '管理画面を開く', exact: true });
  await expect(button).toBeVisible();
  return { page, context, state, input, button };
}
async function ready(p) {
  await expect(
    p.getByText(emptyText, { exact: true }),
  ).toBeVisible();
  await expect(p.locator('.admin-login')).toHaveCount(0);
}
try {
  for (const width of [320, 360, 390, 430, 1440])
    for (const entry of ['typed', 'paste', 'autofill', 'enter']) {
      const { page, context, state, input, button } = await setup(width);
      await expect(button).toBeEnabled();
      await expect(input).toHaveAttribute('autocomplete', 'current-password');
      await expect(input).toHaveAttribute('enterkeyhint', 'go');
      if (entry === 'autofill')
        await input.evaluate(
          (el, value) =>
            Object.getOwnPropertyDescriptor(
              HTMLInputElement.prototype,
              'value',
            ).set.call(el, value),
          dummy,
        );
      else if (entry === 'paste')
        await input.evaluate((el, value) => {
          el.value = ' ' + value + ' ';
          el.dispatchEvent(
            new InputEvent('input', {
              bubbles: true,
              inputType: 'insertFromPaste',
            }),
          );
        }, dummy);
      else await input.fill(dummy);
      await button.scrollIntoViewIfNeeded();
      const hit = await button.evaluate((el) => {
        const b = el.getBoundingClientRect();
        return {
          height: b.height,
          width: b.width,
          pointer: getComputedStyle(el).pointerEvents,
          topmost:
            document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2) ===
            el,
        };
      });
      assert(hit.height >= 44 && hit.width >= 44);
      assert.equal(hit.pointer, 'auto');
      assert(hit.topmost);
      assert(
        Number.parseFloat(
          await input.evaluate((e) => getComputedStyle(e).fontSize),
        ) >= 16,
      );
      if (width === 390 && entry === 'autofill')
        await page
          .locator('.admin-login')
          .screenshot({ path: evidence + '/form-390.png' });
      if (entry === 'enter') {
        await input.focus();
        await page.keyboard.press('Enter');
      } else await button.tap();
      await ready(page);
      assert.equal(state.posts, 1);
      assert.equal(state.reads, 2);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      results.push({ width, entry });
      await context.close();
    }
  // Short visual viewport approximates a shown keyboard; it is not a real iOS keyboard.
  {
    const { page, context, input, button, state } = await setup(390, 420);
    await input.fill(dummy);
    await button.scrollIntoViewIfNeeded();
    await button.tap();
    await ready(page);
    assert.equal(state.posts, 1);
    await context.close();
  }
  // Empty and whitespace: keep the button available, never send an empty key.
  {
    const { page, context, input, button, state } = await setup();
    await button.tap();
    assert.equal(state.posts, 0);
    await expect(input).toBeFocused();
    await input.fill('   ');
    await button.tap();
    await expect(
      page.getByText('管理キーを入力してください。', { exact: true }),
    ).toBeVisible();
    assert.equal(state.posts, 0);
    await expect(button).toBeEnabled();
    await context.close();
  }
  // All failures must retain the field and permit a successful retry.
  for (const failure of ['wrong', 'server', 'network']) {
    const { page, context, input, button, state } = await setup();
    state.loginMode = failure;
    await input.fill(dummy);
    await button.tap();
    await expect(page.locator('.admin-login [role="alert"]')).toBeVisible();
    await expect(input).toHaveValue(dummy);
    await expect(button).toBeEnabled();
    await expect(input).not.toHaveAttribute('readonly', '');
    assert.equal(state.posts, 1);
    state.loginMode = 'success';
    await button.tap();
    await ready(page);
    assert.equal(state.posts, 2);
    await context.close();
  }
  // Replayed submit events bypass a disabled button; the ref still admits only one POST.
  {
    const { page, context, input, state } = await setup();
    await page.clock.install();
    state.loginMode = 'hang';
    await input.fill(dummy);
    await page.locator('form.admin-login').evaluate((form) => {
      for (let i = 0; i < 4; i++)
        form.dispatchEvent(
          new Event('submit', { bubbles: true, cancelable: true }),
        );
    });
    await expect.poll(() => state.posts).toBe(1);
    await expect(
      page.getByRole('button', { name: '確認中…', exact: true }),
    ).toBeDisabled();
    await expect(page.locator('.admin-login')).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await page
      .locator('.admin-login')
      .screenshot({ path: evidence + '/busy-390.png' });
    state.auth = true;
    await state.held.fulfill({ json: { ok: true } });
    state.held = null;
    await ready(page);
    assert.equal(state.posts, 1);
    await context.close();
  }
  // Timed-out POST unlocks; a late response must not reopen or double-send.
  {
    const { page, context, input, button, state } = await setup();
    await page.clock.install();
    state.loginMode = 'hang';
    await input.fill(dummy);
    await button.tap();
    await expect.poll(() => state.posts).toBe(1);
    await page.clock.fastForward(15001);
    await expect(page.locator('.admin-login [role="alert"]')).toBeVisible();
    await expect(button).toBeEnabled();
    await expect(input).toHaveValue(dummy);
    await state.held.fulfill({ json: { ok: true } }).catch(() => undefined);
    state.held = null;
    assert.equal(state.reads, 1);
    state.loginMode = 'success';
    await button.tap();
    await ready(page);
    assert.equal(state.posts, 2);
    await context.close();
  }
  // Post-login GET failures, invalid JSON, expired cookies and its timeout.
  for (const failure of ['bad-json', 'server', 'unauthorized', 'hang']) {
    const { page, context, input, button, state } = await setup();
    await page.clock.install();
    state.listMode = failure;
    await input.fill(dummy);
    await button.tap();
    await expect.poll(() => state.reads).toBe(2);
    if (failure === 'hang') await page.clock.fastForward(15001);
    if (failure === 'unauthorized') {
      await expect(button).toBeEnabled();
      await expect(input).toHaveValue('');
      state.listMode = 'success';
      await input.fill(dummy);
      await button.tap();
      await ready(page);
    } else {
      await expect(
        page.getByRole('button', { name: retryText, exact: true }),
      ).toBeVisible();
      if (state.held) {
        await state.held.abort().catch(() => undefined);
        state.held = null;
      }
      state.listMode = 'success';
      await page
        .getByRole('button', { name: retryText, exact: true })
        .tap();
      await ready(page);
    }
    await context.close();
  }
  // Auth checks on initial load time out into a retry, rather than hanging forever.
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    let hang = true;
    await context.route('**/*', (r) => {
      const u = new URL(r.request().url());
      if (u.origin !== base) return r.abort();
      if (u.pathname === listing) {
        if (hang) return;
        return r.fulfill({ status: 401, json: {} });
      }
      if (u.pathname.startsWith('/api/')) return r.fulfill({ json: {} });
      return r.continue();
    });
    const page = await context.newPage();
    await page.clock.install();
    await page.goto(base + screen);
    await expect(
      page.getByText('認証状態を確認しています…', { exact: true }),
    ).toBeVisible();
    await page.clock.fastForward(15001);
    await expect(
      page.getByRole('button', { name: retryText, exact: true }),
    ).toBeVisible();
    hang = false;
    await page
      .getByRole('button', { name: retryText, exact: true })
      .click();
    await expect(
      page.getByRole('button', { name: '管理画面を開く', exact: true }),
    ).toBeEnabled();
    await context.close();
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(badAssets, []);
  await writeFile(
    evidence + '/results.json',
    JSON.stringify(
      { results, extraCases: 12, errors, badAssets, productionRequests: 0 },
      null,
      2,
    ),
  );
  console.log(
    'PASS: 20 width/input cases at 320/360/390/430/1440; direct DOM autofill and paste, touch/Enter, hit testing and 44px targets, short viewport; empty/wrong/network/server errors, double submit, timeouts, late response, read failure/invalid JSON/cookie expiry and retry; no JS or asset failures. Local dummy/mocks only.',
  );
} finally {
  await browser.close();
}
