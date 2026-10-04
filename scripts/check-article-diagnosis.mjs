import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
const result = await build({
  entryPoints: ['components/article-diagnosis-entry.tsx'], bundle: true,
  platform: 'node', format: 'esm', packages: 'external', write: false,
});
// Resolve external React imports relative to this repository.
const { writeFile, unlink } = await import('node:fs/promises');
const file = new URL('./.article-diagnosis-check.mjs', import.meta.url);
try {
  await writeFile(file, result.outputFiles[0].contents);
  const { ArticleDiagnosisEntry } = await import(file.href);
  const render = (path, locale = 'ja') => renderToStaticMarkup(createElement(ArticleDiagnosisEntry, { path, locale }));
  for (const path of ['/games/monster-hunter-wilds/not-launching', '/games/elden-ring/fps', '/games/pragmata/black-screen', '/guide/pc-game-crash', '/guide/pc-game-freezes', '/guide/low-fps']) {
    for (const locale of ['ja', 'en', 'zh', 'es']) {
      const html = render(path, locale);
      assert.match(html, /Windows 11 x64/);
      assert.match(html, /ZIP/);
      assert.match(html, /4\.8/);
      assert.equal((html.match(/<a /g) || []).length, 1);
      assert.ok(html.includes(`href="${locale === 'ja' ? '' : '/en'}/tools/windows-diagnosis"`));
      assert.ok(!html.includes('/downloads/'), 'Must open instructions before download');
    }
  }
  for (const path of ['/discord/not-launching', '/discord/black-screen', '/games/monster-hunter-wilds/save-data', '/games/monster-hunter-wilds/hdr', '/games/monster-hunter-wilds/ultrawide', '/games/elden-ring/controller', '/games/elden-ring/mod', '/games/test/tpm-secure-boot', '/games/test/launcher-display', '/guide/bsod-while-gaming', '/guide/pc-shuts-down-while-gaming', '/guide/save-data-backup', '/pc/black-screen-after-sign-in']) {
    assert.equal(render(path), '', path);
  }
  console.log('PASS: four-language target links, download requirements, and unrelated/unsafe symptom exclusions');
} finally { await unlink(file); }
