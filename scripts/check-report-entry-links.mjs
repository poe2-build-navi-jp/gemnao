// Render the shared entry without JS hydration; browser layout uses no network.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
const { chromium, expect } = await import(
  process.env.PLAYWRIGHT_TEST_MODULE || '@playwright/test'
);
const bundle = await build({
  stdin: {
    contents: `import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {ReportEntryLink} from './components/report-entry-link';export {reportCopy} from './lib/community-reports/copy';export const render=p=>renderToStaticMarkup(<ReportEntryLink {...p}/>);`,
    loader: 'tsx',
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  banner: {
    js: "import {createRequire} from 'node:module';const require=createRequire(process.cwd()+'/package.json');",
  },
  jsx: 'automatic',
});
const { render, reportCopy } = await import(
  'data:text/javascript;base64,' +
    Buffer.from(bundle.outputFiles[0].text).toString('base64')
);
const css = (await readFile('app/globals.css', 'utf8')).split(
  '/* Report entry:',
)[1];
assert.ok(css);
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  for (const locale of ['ja', 'en', 'zh', 'es']) {
    const prefix = locale === 'ja' ? '' : `/${locale}`;
    for (const props of [
      { prominent: true },
      { prominent: true, gameSlug: 'overwatch-2' },
      {
        articlePath: '/games/overwatch-2/rendering-device-lost',
        stepIds: ['one'],
        outcome: 'resolved',
      },
    ]) {
      const markup = render({ locale, ...props });
      const page = await browser.newPage({
        viewport: { width: 360, height: 780 },
      });
      await page.route('**/*', (r) => r.abort());
      await page.setContent(
        `<style>:root{--paper:#fff;--ink:#18202b;--line:#ccd}body{margin:16px}*{box-sizing:border-box}/* Report entry:${css}</style>${markup}`,
      );
      const link = page.locator('a');
      await expect(link).toHaveCount(1);
      assert.ok(
        (await link.innerText()).includes(reportCopy[locale].entryLink),
      );
      const url = new URL(
        await link.getAttribute('href'),
        'https://gemnao.pages.dev',
      );
      assert.equal(url.pathname, prefix + '/reports');
      if (props.gameSlug)
        assert.equal(url.searchParams.get('game'), props.gameSlug);
      if (props.articlePath) {
        assert.equal(url.searchParams.get('article'), props.articlePath);
        assert.equal(url.searchParams.get('steps'), 'one');
        assert.equal(url.searchParams.get('outcome'), 'resolved');
      }
      if (props.prominent)
        await expect(page.locator('aside p')).toHaveText(
          reportCopy[locale].entryPurpose,
        );
      for (const width of [360, 1280]) {
        await page.setViewportSize({ width, height: 780 });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
        const b = await link.boundingBox();
        assert.ok(b.height >= 44);
        await link.focus();
        await expect(link).toBeFocused();
      }
      await page.close();
    }
    console.log(
      `PASS ${locale}: static a, home/game/article context, 360/1280 layout and focus`,
    );
  }
  assert.equal(render({ articlePath: '/admin' }), '');
  for (const file of ['app/reports/page.tsx', 'app/[locale]/reports/page.tsx'])
    assert.match(await readFile(file, 'utf8'), /index: false/);
} finally {
  await browser.close();
}
