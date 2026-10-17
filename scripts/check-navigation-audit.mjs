// Synthetic local browser only; never sends a game request.
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
const { chromium, expect } = await import(
  process.env.PLAYWRIGHT_TEST_MODULE || '@playwright/test'
);
const css = await readFile('app/globals.css', 'utf8');
await mkdir('/tmp/gemnao-navigation-audit', { recursive: true });
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  for (const locale of ['ja', 'en', 'zh', 'es']) {
    const result = await build({
      stdin: {
        contents: `import React from 'react';import {createRoot} from 'react-dom/client';import {WikiHeader} from './components/wiki-header';import {MyGamesPanel} from './components/my-games-panel';import {GameRequestForm} from './components/game-request-form';import {myGamesData} from './lib/my-games-data';createRoot(document.getElementById('root')).render(<><WikiHeader locale="${locale}"/><main className="static-page"><MyGamesPanel locale="${locale}" games={myGamesData('${locale}')}/><GameRequestForm locale="${locale}"/></main></>);`,
        loader: 'tsx',
        resolveDir: process.cwd(),
      },
      bundle: true,
      write: false,
      platform: 'browser',
      format: 'iife',
      jsx: 'automatic',
      define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' },
    });
    const page = await browser.newPage();
    page.on('pageerror', (error) => console.error(error.message));
    let writes = 0;
    await page.route('**/*', (route) => {
      if (route.request().method() !== 'GET') {
        writes++;
        return route.abort();
      }
      if (new URL(route.request().url()).pathname === '/')
        return route.fulfill({
          contentType: 'text/html',
          body: '<div id="root"></div>',
        });
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ enabled: true, available: true, items: [] }),
      });
    });
    await page.goto('http://127.0.0.1/');
    await page.addStyleTag({ content: css });
    await page.addScriptTag({ content: result.outputFiles[0].text });
    const href = locale === 'ja' ? '/?view=games#games' : `/${locale}/#games`;
    for (const width of [390, 1165, 1600]) {
      await page.setViewportSize({ width, height: 1000 });
      const trigger = page.locator('.mobile-menu');
      if (width <= 1480) {
        await expect(trigger).toBeVisible();
        await trigger.focus();
        await page.keyboard.press('Enter');
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        await expect(
          page
            .locator('.mobile-navigation-panel a')
            .filter({
              hasText:
                locale === 'ja'
                  ? 'ゲーム一覧'
                  : locale === 'en'
                    ? 'Games'
                    : locale === 'zh'
                      ? '游戏'
                      : 'Juegos',
            })
            .first(),
        ).toHaveAttribute('href', href);
        await page.locator('.mobile-navigation-panel a').first().focus();
        await page.keyboard.press('Escape');
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(trigger).toBeFocused();
      } else {
        await expect(trigger).toBeHidden();
        await expect(
          page.locator('.site-header > nav a').first(),
        ).toHaveAttribute('href', href);
      }
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `${locale} ${width} overflow`,
      );
      const overlaps = await page.locator('.site-header').evaluate((el) => {
        const visible = [...el.children]
          .filter((e) => getComputedStyle(e).display !== 'none')
          .map((e) => e.getBoundingClientRect());
        return visible.some(
          (r, i) => i > 0 && r.left < visible[i - 1].right - 1,
        );
      });
      assert.equal(overlaps, false, `${locale} ${width} overlap`);
      await page.screenshot({
        path: `/tmp/gemnao-navigation-audit/${locale}-${width}.png`,
      });
    }
    await page
      .locator('#my-games input[type="search"]')
      .fill('zzzz-no-matching-game');
    const link = page.locator('.my-games-no-results a');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '#game-request');
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#game-request')).toBeFocused();
    assert.equal(writes, 0);
    await page.close();
    console.log(
      `PASS ${locale}: full-list routes, 390/1165/1600 header, keyboard menu, empty-result form anchor, no submission`,
    );
  }
  assert.match(
    await readFile('app/games/[slug]/page.tsx', 'utf8'),
    /href=\{gamesListPath\(\)\}>ゲーム一覧/,
  );
} finally {
  await browser.close();
}
