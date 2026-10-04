import assert from 'node:assert/strict';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { build } from 'esbuild';

const result = await build({
  stdin: {
    contents: `
      export { steamInputGuide } from './lib/steam-input-guide';
      export { steamLaunchGuide } from './lib/steam-launch-guide';
      export { SteamInputBeforeSteps, SteamInputAfterSteps } from './components/steam-input-details';
      export { SteamLaunchBeforeSteps, SteamLaunchAfterSteps } from './components/steam-launch-details';
      export { renderToStaticMarkup } from 'react-dom/server';
      export { createElement } from 'react';
    `,
    resolveDir: process.cwd(),
  },
  bundle: true, write: false, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic',
});
const testModule = new URL('./.ranked-steam-check.mjs', import.meta.url);
let data;
try {
  await writeFile(testModule, result.outputFiles[0].contents);
  data = await import(testModule.href);
} finally {
  await unlink(testModule);
}
const { steamInputGuide: input, steamLaunchGuide: launch } = data;
assert.equal(input.slug, 'steam-input-controller');
assert.equal(launch.slug, 'steam-game-not-launching');
assert.deepEqual(input.steps.map((step) => step.actions.length), [2, 3, 2]);
assert.deepEqual(launch.steps.map((step) => step.actions.length), [4, 6, 3, 3]);
assert.equal(input.checkedAt, '2026-10-03');
assert.equal(launch.checkedAt, '2026-10-04');
assert.ok(input.faqs.some((faq) => faq.question.includes('Xbox 360') && faq.answer.includes('仮想')));
assert.ok(input.faqs.some((faq) => faq.question.includes('戦闘中') && faq.answer.includes('独立')));
assert.ok(launch.faqs.some((faq) => faq.question.includes('EA app') && faq.answer.includes('一部')));
assert.ok(input.sources.some((source) => source.url.endsWith('/getting_started_for_players')));
assert.ok(launch.sources.some((source) => source.url === 'https://help.ea.com/en/articles/platforms/download-and-play-ea-app-games/'));

const rendered = (Component) => data.renderToStaticMarkup(data.createElement(Component));
const inputHtml = rendered(data.SteamInputBeforeSteps) + rendered(data.SteamInputAfterSteps);
const launchHtml = rendered(data.SteamLaunchBeforeSteps) + rendered(data.SteamLaunchAfterSteps);
for (const id of ['input-branches', 'input-device', 'input-game', 'input-results', 'input-conflicts']) assert.equal(inputHtml.split(`id="${id}"`).length - 1, 1);
for (const id of ['steam-launch-symptoms', 'steam-launch-process', 'steam-launch-history', 'steam-launch-results', 'steam-launch-publisher']) assert.equal(launchHtml.split(`id="${id}"`).length - 1, 1);
assert.match(inputHtml, /仮想Xbox 360/);
assert.match(inputHtml, /ドライバーを削除する必要はありません/);
assert.match(inputHtml, /アクションセット/);
assert.match(inputHtml, /セット名と有無はゲームごとに異なります/);
assert.match(launchHtml, /href="#steam-launch-publisher"/);
assert.match(launchHtml, /すべてのSteamゲームにEA appが必要という意味ではありません/);
assert.match(launchHtml, /連携を解除しないでください/);
assert.match(launchHtml, /メールアドレスやアカウント情報を隠して/);
assert.ok(!launchHtml.includes('-dx11') && !launchHtml.includes('-autoconfig'));

if (process.argv.includes('--built')) {
  const manifest = JSON.parse(await readFile('dist/editorial-snapshots.json', 'utf8'));
  for (const [guide, anchors] of [[input, ['input-device', 'input-conflicts']], [launch, ['steam-launch-publisher']]]) {
    const path = `/guide/${guide.slug}`;
    const html = await readFile(`dist/client${manifest[path]}`, 'utf8');
    for (const anchor of anchors) assert.ok(html.includes(`id="${anchor}"`));
    assert.ok(html.includes(`href="https://gemnao.pages.dev${path}"`));
    for (const source of guide.sources) assert.ok(html.includes(source.url.replaceAll('&', '&amp;')));
    for (const faq of guide.faqs) assert.ok(html.includes(faq.question));
  }
}
console.log('PASS: two source-backed Steam ambiguities, publisher-launcher boundary, preserved feedback indexes/URLs, unique anchors, cautious account/driver handling and source links');
