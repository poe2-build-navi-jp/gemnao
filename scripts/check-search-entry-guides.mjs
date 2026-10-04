import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';

const bundled = await build({
  stdin: { contents: `export { summarizeFrameTimes } from './lib/refresh-rate'; export { aceCombatLaunchArticles } from './lib/localized/ace-combat-launch-articles'; export { articleBySlug } from './lib/game-articles';`, resolveDir: process.cwd() },
  bundle: true, write: false, platform: 'node', format: 'esm',
});
const { summarizeFrameTimes, aceCombatLaunchArticles, articleBySlug } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
for (const hz of [30, 60, 144, 240]) {
  const result = summarizeFrameTimes(Array.from({ length: 241 }, (_, i) => i * 1000 / hz));
  assert.equal(result.hz, hz, `Synthetic ${hz} Hz timing`);
}
assert.equal(summarizeFrameTimes([0, 1, 2]), null, 'Insufficient samples');
assert.equal(summarizeFrameTimes(Array(50).fill(0)), null, 'Repeated timestamps rejected');
assert.equal(summarizeFrameTimes([...Array.from({ length: 40 }, (_, i) => i * 16), NaN]), null);
const gaps = Array(240).fill(1000 / 60); gaps[90] = 1000;
const times = [0]; for (const gap of gaps) times.push(times.at(-1) + gap);
assert.equal(summarizeFrameTimes(times).hz, 60, 'A single delayed callback is not a different monitor mode');
const original = articleBySlug('ace-combat-8', 'not-launching');
assert.deepEqual(aceCombatLaunchArticles.map(a => a.locale).sort(), ['en', 'es', 'zh']);
for (const article of aceCombatLaunchArticles) {
  assert.deepEqual(article.steps.map(s => s.id), original.steps.map(s => s.id));
  for (const row of article.diagnosis) assert(article.steps.some(s => s.id === row.stepId));
  assert(article.sources.some(s => s.url.includes('/2288340/allnews/')));
}
if (process.argv.includes('--built')) {
  const manifest = JSON.parse(await readFile('dist/editorial-snapshots.json', 'utf8'));
  const sitemap = await readFile('dist/client/sitemap.xml', 'utf8');
  const paths = ['', '/en', '/zh', '/es'].map(l => `${l}/games/ace-combat-8/not-launching`);
  for (const path of paths) {
    const html = await readFile(`dist/client${manifest[path]}`, 'utf8');
    const head = html.split('</head>')[0];
    assert(head.includes(`rel="canonical" href="https://gemnao.pages.dev${path}"`), path);
    assert(!/name="robots" content="[^"]*noindex/.test(head), path);
    for (const lang of ['ja', 'en', 'zh-Hans', 'es', 'x-default']) assert(new RegExp(`hrefLang="${lang}"`, 'i').test(head));
    assert(sitemap.includes(`<loc>https://gemnao.pages.dev${path}</loc>`));
    assert(head.includes('property="og:image"'));
    for (const step of original.steps) assert(html.includes(`id="${step.id}"`));
    if (path.startsWith('/en') || path.startsWith('/zh') || path.startsWith('/es')) {
      const locale = path.split('/')[1];
      const home = await readFile(`dist/client${manifest[`/${locale}`]}`, 'utf8');
      assert(home.includes(`href="${path}"`), `Discovery from ${locale} home`);
    }
  }
  const error = await readFile(`dist/client${manifest['/en/games/ace-combat-8/error-st-3100001']}`, 'utf8');
  assert(error.includes('href="/en/games/ace-combat-8/not-launching"'));
  for (const locale of ['', '/en']) {
    const html = await readFile(`dist/client${manifest[`${locale}/games/monster-hunter-wilds/not-launching`]}`, 'utf8');
    assert(html.includes('id="media-playback"') && html.includes('25.10.2'));
    assert(html.includes('media-feature-pack-list-for-windows-n-editions'));
  }
}
console.log('PASS: synthetic browser timing and invalid samples; AC8 language/step parity; optional built metadata, discovery links and Wilds source checks. No physical monitor or game verification.');
