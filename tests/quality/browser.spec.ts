import { createRequire } from 'node:module';
import { test, expect } from './fixtures';
const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const paths = [
  '/en',
  '/en/articles',
  '/en/trouble/fps',
  '/en/discord-servers',
  '/en/new-releases/2026-11',
  '/en/tools/save-locations',
];
test('English pages: responsive layout, accessibility and evidence', async ({
  page,
}, testInfo) => {
  for (const path of paths) {
    expect(
      (await page.goto(path, { waitUntil: 'networkidle' }))?.status(),
    ).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveAttribute('lang', 'en');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `${path}: horizontal overflow`,
    ).toBe(true);
    expect(
      await page
        .locator('main img')
        .evaluateAll((images) =>
          images
            .filter(
              (image) =>
                !(image as HTMLImageElement).complete ||
                !(image as HTMLImageElement).naturalWidth,
            )
            .map((image) => image.getAttribute('src')),
        ),
    ).toEqual([]);
    await page.addScriptTag({ path: axePath });
    const accessibility = await page.evaluate(async () => {
      const engine = (window as unknown as { axe: typeof import('axe-core') })
        .axe;
      const result = await engine.run('main', {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      });
      return { violations: result.violations, incomplete: result.incomplete };
    });
    await testInfo.attach(`axe-${path.replaceAll('/', '-')}`, {
      body: JSON.stringify(accessibility, null, 2),
      contentType: 'application/json',
    });
    await page.screenshot({
      path: testInfo.outputPath(`${path.replaceAll('/', '-')}.png`),
      fullPage: true,
    });
    expect(accessibility.violations, `${path}: axe violations`).toEqual([]);
    if (path.includes('new-releases')) {
      const wrapping = await page
        .locator('#requirements td[data-label="OS"]')
        .evaluateAll((cells) =>
          cells.flatMap((cell) => {
            const text = cell.firstChild;
            if (!text || text.nodeType !== Node.TEXT_NODE) return [];
            return [...(text.textContent || '').matchAll(/Windows/g)].map(
              (match) => {
                const range = document.createRange();
                range.setStart(text, match.index!);
                range.setEnd(text, match.index! + 7);
                return range.getClientRects().length;
              },
            );
          }),
        );
      expect(wrapping.length).toBeGreaterThan(0);
      expect(
        wrapping.every((count) => count === 1),
        'Windows split across lines',
      ).toBe(true);
    }
  }
});
test('Search, keyboard, history, topics and complete directory', async ({
  page,
}) => {
  await page.goto('/en');
  const input = page.locator('#english-search'),
    results = page.locator('.english-home-search .search-result-list a');
  await input.fill('ST 3100001');
  await expect(results.first()).toHaveAttribute(
    'href',
    '/en/games/ace-combat-8/error-st-3100001',
  );
  await input.fill('wilds nonexistentqzx');
  await expect(results).toHaveCount(0);
  await expect(
    page.getByText('No matching English guides.', { exact: false }),
  ).toBeVisible();
  await input.fill('ST-3100001');
  await input.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(results.first()).toBeFocused();
  await page.keyboard.press('Enter');
  await page.waitForURL('**/en/games/ace-combat-8/error-st-3100001');
  await page.goBack();
  await expect(input).toHaveValue('ST-3100001');
  await page.reload();
  await expect(input).toHaveValue('ST-3100001');
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
  await page.locator('.symptom-grid a[href="/en/trouble/fps"]').click();
  await page.waitForURL('**/en/trouble/fps');
  await page.goBack();
  await page.locator('.english-home-more-games summary').click();
  await expect(page.locator('.english-home-more-games')).toHaveAttribute(
    'open',
    '',
  );
  const game = page.locator('.english-home-more-games li a').first(),
    target = await game.getAttribute('href');
  await game.click();
  await page.waitForURL(`**${target}`);
  await page.goBack();
  await page.locator('#articles a[href="/en/articles"]').click();
  await page.waitForURL('**/en/articles');
  expect(
    await page.locator('.english-directory-group li a').count(),
  ).toBeGreaterThan(200);
  await input.fill('Discord upload');
  await expect(results.first()).toBeVisible();
  const href = await results.first().getAttribute('href');
  await results.first().click();
  await page.waitForURL(`**${href}`);
  await page.goBack();
  await expect(input).toHaveValue('Discord upload');
});
test('Directory unavailable state is distinct from an empty listing', async ({
  page,
}) => {
  await page.route('**/api/discord-servers', (route) =>
    route.fulfill({ status: 503, json: { error: 'local fixture' } }),
  );
  await page.goto('/en/discord-servers');
  await expect(
    page.getByRole('heading', {
      name: 'Listings could not be loaded',
      exact: true,
    }),
  ).toBeVisible();
  await page.unroute('**/api/discord-servers');
  await page.reload();
  await expect(
    page.getByRole('heading', {
      name: 'Listings could not be loaded',
      exact: true,
    }),
  ).toHaveCount(0);
  await expect(page.locator('.server-empty')).toBeVisible();
  await expect(
    page.locator('.server-hero-actions a[href="/en/discord-servers/submit"]'),
  ).toBeVisible();
});
