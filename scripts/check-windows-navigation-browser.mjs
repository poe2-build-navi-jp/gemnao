import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
const base = process.env.TEST_BASE_URL || 'http://localhost:3027';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const output = process.env.SCREENSHOT_DIR || '/tmp/gemnao-navigation';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
  for (const width of [375, 1536]) {
    const context = await browser.newContext({ viewport: { width, height: 950 } });
    await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const locale of ['ja', 'en', 'zh', 'es']) {
      const prefix = locale === 'ja' ? '' : `/${locale}`;
      const target = `${prefix}/tools/windows-diagnosis#download`;
      for (const path of [prefix || '/', `${prefix}/diagnose`]) {
        assert.equal((await page.goto(base + path)).status(), 200);
        await page.locator('.windows-diagnosis-entry').waitFor();
        await page.waitForFunction(() => Object.keys(document.querySelector('.mobile-menu') || {}).some(key => key.startsWith('__reactProps')));
        assert.equal(await page.locator('.windows-diagnosis-entry a').getAttribute('href'), target);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} overflow at ${width}`);
        if (width === 375 && path === prefix && ['zh', 'es'].includes(locale)) assert.ok(await page.locator('.hero-copy').evaluate(el => el.getBoundingClientRect().width > 300), 'Localized hero must remain full width');
        await page.screenshot({ path: `${output}/${locale}-${path.endsWith('diagnose') ? 'diagnose' : 'home'}-${width}.png`, fullPage: false });
        if (width === 375) {
          const toggle = page.locator('.mobile-menu');
          for (let i = 0; i < 3; i++) {
            await toggle.focus(); await page.keyboard.press('Enter');
            await page.locator('#mobile-navigation-panel').waitFor();
            assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
            const link = page.locator(`#mobile-navigation-panel a[href="${target}"]`);
            await link.focus(); assert.ok(await link.evaluate(el => el === document.activeElement));
            await page.keyboard.press('Escape');
            assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
            assert.ok(await toggle.evaluate(el => el === document.activeElement));
          }
          await toggle.click();
          await page.screenshot({ path: `${output}/${locale}-menu-${width}.png` });
          await page.locator(`#mobile-navigation-panel a[href="${target}"]`).click();
        } else {
          await page.locator(`.site-header > nav a[href="${target}"]`).click();
        }
        await page.waitForURL(base + target);
        await page.locator('#download').waitFor();
        assert.ok(await page.locator('#download .download-caution').count());
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${target} overflow`);
        await page.screenshot({ path: `${output}/${locale}-download-${width}.png` });
        const canonical = page.locator('link[rel="canonical"]');
        assert.equal(new URL(await canonical.getAttribute('href')).pathname, `${prefix}/tools/windows-diagnosis`);
        for (const language of ['ja', 'en', 'zh-Hans', 'es']) assert.equal(await page.locator(`link[rel="alternate"][hreflang="${language}"]`).count(), 1);
        await page.goBack(); await page.waitForURL(base + path);
        await page.locator('.windows-diagnosis-entry').waitFor();
        await page.waitForFunction(() => Object.keys(document.querySelector('.mobile-menu') || {}).some(key => key.startsWith('__reactProps')));
        if (width === 375) {
          const toggle = page.locator('.mobile-menu');
          if (await toggle.getAttribute('aria-expanded') === 'true') await page.keyboard.press('Escape');
          await toggle.click(); await page.locator('#mobile-navigation-panel').waitFor();
          await page.keyboard.press('Escape');
        }
      }
      console.log(`PASS ${locale} ${width}px: top, diagnosis, menu, keyboard, back, locale, anchor, wrapping`);
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
} finally { await browser.close(); }
