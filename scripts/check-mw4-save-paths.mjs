import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFile, mkdir } from 'node:fs/promises';
const { chromium, expect } = await import(
  process.env.PLAYWRIGHT_TEST_MODULE || '@playwright/test'
);
const built = await build({
  stdin: {
    contents: `import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {GamePathHelp,WildsSaveGuideLink} from './components/game-path-help';export {games} from './lib/games';export {codMw4Articles} from './lib/cod-mw4-articles';export {releaseRoundups} from './lib/release-roundups';export const render=(path,locale)=>renderToStaticMarkup(<><GamePathHelp path={path} locale={locale}/><WildsSaveGuideLink locale={locale}/></>);`,
    loader: 'tsx',
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  banner: {
    js: "import {createRequire} from 'node:module';const require=createRequire(process.cwd()+'/package.json');",
  },
});
const { render, games, codMw4Articles, releaseRoundups } = await import(
  'data:text/javascript;base64,' +
    Buffer.from(built.outputFiles[0].text).toString('base64')
);
const mw4 = games.find((g) => g.slug === 'call-of-duty-modern-warfare-4');
assert.match(mw4.specs.minimum, /1400.*6600.*8GB/);
assert.match(mw4.specs.recommended, /RX 6600 XT/);
assert.match(mw4.specs.storage, /115GB/);
assert.doesNotMatch(JSON.stringify(mw4), /ベータ版の値/);
const article = codMw4Articles[0];
assert.match(
  article.faqs.find((f) => f.question === '動作環境はどのくらいですか？')
    .answer,
  /1400.*6600.*8GB.*115GB.*6600 XT/,
);
assert.doesNotMatch(article.targetVersion, /（発売前）/);
assert.match(article.steps[1].actions[0], /回復キー/);
const roundup = releaseRoundups
  .find((r) => r.slug === '2026-10')
  .games.find((g) => g.name === 'Call of Duty: Modern Warfare 4');
assert.equal(roundup.memory, '8GB');
assert.equal(roundup.spec.ramGb, 8);
assert.match(roundup.storage, /115GB/);
assert.match(roundup.date, /10月16日〈PT〉/);
assert.match(roundup.source, /pc-system-requirements/);
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
await mkdir('/tmp/gemnao-mw4-save', { recursive: true });
try {
  const css = await readFile('app/globals.css', 'utf8');
  for (const locale of ['ja', 'en', 'zh', 'es']) {
    const page = await browser.newPage();
    await page.route('**/*', (r) => r.abort());
    const paths = [
      ['<Steam>\\userdata\\<Steam ID>\\2246340\\remote\\win64_save', 'steam'],
      ['<インストール先>\\config.ini', 'install'],
      ['%USERPROFILE%\\Documents\\Game\\settings.xml', 'env'],
      ['%LOCALAPPDATA%\\Game\\Saved\\<ID>', 'env'],
      ['公式サポートで確認', 'unknown'],
    ];
    for (const [path, kind] of paths) {
      await page.setContent(
        `<style>${css}</style><main class="static-page" style="max-width:720px">${render(path, locale)}</main>`,
      );
      await expect(page.locator('[data-path-kind]')).toHaveAttribute(
        'data-path-kind',
        kind,
      );
      const href = await page.locator('a').getAttribute('href');
      assert.ok(href.endsWith('/games/monster-hunter-wilds/save-data'));
      for (const width of [390, 1165]) {
        await page.setViewportSize({ width, height: 900 });
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
      }
    }
    console.log(
      `PASS ${locale}: Steam/install/env/unknown guidance, detail link and 390/1165 widths`,
    );
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(
  'PASS MW4 retail values, structured RAM, PT date and recovery-key safety',
);
