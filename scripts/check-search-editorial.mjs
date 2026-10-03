import assert from 'node:assert/strict';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { build } from 'esbuild';

const result = await build({
  stdin: {
    contents: `
      export { gameArticles, isPublishedGameArticle } from './lib/game-articles';
      export { games } from './lib/games';
      export { commonGuides } from './lib/common-guides';
      export { discordArticles } from './lib/discord-articles';
      export { pcArticles } from './lib/pc-articles';
      export { editorialAuthor, editorialPublisher } from './lib/editorial-identity';
      export { renderToStaticMarkup } from 'react-dom/server';
      export { default as discordPage } from './app/discord/[slug]/page';
      export { default as guidePage } from './app/guide/[slug]/page';
      export { default as pcPage } from './app/pc/[slug]/page';
      export { default as gamePage, generateStaticParams, generateMetadata } from './app/games/[slug]/[article]/page';
    `,
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  packages: 'external',
  plugins: [{
    name: 'route-test-shims',
    setup(bundler) {
      bundler.onResolve({ filter: /^next\/navigation$/ }, () => ({ path: 'navigation', namespace: 'test' }));
      bundler.onLoad({ filter: /.*/, namespace: 'test' }, ({ path }) => ({ contents: path === 'navigation' ? 'export function notFound() { throw new Error("TEST_NOT_FOUND"); }' : 'export function TroubleshootingArticle() { return null; }' }));
    },
  }],
});
const testModule = new URL('./.search-editorial-check.mjs', import.meta.url);
let data;
try {
  await writeFile(testModule, result.outputFiles[0].contents);
  data = await import(testModule.href);
} finally {
  await unlink(testModule);
}
const { gameArticles, games, commonGuides, discordArticles, pcArticles, editorialAuthor, editorialPublisher } = data;
assert.equal(editorialAuthor.name, 'ゲムなお編集部');
assert.equal(editorialAuthor.url, 'https://gemnao.pages.dev/about');
assert.equal(editorialPublisher['@id'], 'https://gemnao.pages.dev/#operator');
const microphone = discordArticles.find((article) => article.slug === 'mic-volume-low');
assert.equal(microphone.symptomGuide.href, '/discord/user-volume-low');
assert.equal(microphone.showStatusCheck, false);
assert.equal(microphone.causes.length, 5, 'Preserve the existing feedback step indexes');
assert.ok(microphone.causes[3].actions[0].includes('音声（Voice）'));
assert.ok(microphone.causes[1].actions[2].includes('テストを終了してから通話'));
assert.ok(microphone.ifNotFixed.includes('デバッグ（Debugging）'));
assert.ok(microphone.ifNotFixed.indexOf('先に記録') < microphone.ifNotFixed.indexOf('リセット、'));
assert.ok(microphone.sources.some((source) => source.url.includes('360045138471')));

for (const status of ['verified', 'needs-review', undefined]) assert.equal(data.isPublishedGameArticle({ status }), true);
for (const status of ['draft', 'thin']) assert.equal(data.isPublishedGameArticle({ status }), false);

// Exercise actual route exports with temporary in-memory fixtures. No content files change.
const baselineParams = data.generateStaticParams();
const originalLength = gameArticles.length;
try {
  const original = gameArticles.find(data.isPublishedGameArticle);
  for (const status of ['draft', 'thin', 'needs-review']) gameArticles.push({ ...original, slug: `editorial-test-${status}`, status });
  const params = data.generateStaticParams();
  for (const status of ['draft', 'thin']) {
    const slug = `editorial-test-${status}`;
    assert.ok(!params.some((item) => item.article === slug));
    const input = { params: Promise.resolve({ slug: original.gameSlug, article: slug }) };
    assert.deepEqual(await data.generateMetadata(input), {});
    await assert.rejects(() => data.gamePage(input), /TEST_NOT_FOUND/);
  }
  assert.ok(params.some((item) => item.article === 'editorial-test-needs-review'));
  assert.equal(params.length, baselineParams.length + 1);
} finally {
  gameArticles.length = originalLength;
}
assert.deepEqual(data.generateStaticParams(), baselineParams);

if (!process.argv.includes('--source-only')) {
  const sourceRender = process.argv.includes('--render-source');
  const manifest = sourceRender ? null : JSON.parse(await readFile('dist/editorial-snapshots.json', 'utf8'));
  const records = [
    ...gameArticles.filter(data.isPublishedGameArticle).map((article) => ({
      path: `/games/${article.gameSlug}/${article.slug}`,
      checkedAt: article.checkedAt,
      sources: [...(article.sources || []), ...games.find((game) => game.slug === article.gameSlug).sources].filter((source, index, all) => all.findIndex((item) => item.url === source.url) === index),
    })),
    ...discordArticles.filter((article) => !['draft', 'thin'].includes(article.status)).map((article) => ({ path: `/discord/${article.slug}`, checkedAt: article.checkedAt, sources: article.sources })),
    ...commonGuides.filter((article) => !['draft', 'thin'].includes(article.status)).map((article) => ({ path: `/guide/${article.slug}`, checkedAt: article.checkedAt, sources: article.sources })),
    ...pcArticles.map((article) => ({ path: `/pc/${article.slug}`, checkedAt: article.checkedAt, sources: article.sources })),
  ];
  for (const record of records) {
    let html;
    if (sourceRender) {
      const [, section, slug, article] = record.path.split('/');
      const page = { games: data.gamePage, discord: data.discordPage, guide: data.guidePage, pc: data.pcPage }[section];
      html = data.renderToStaticMarkup(await page({ params: Promise.resolve({ slug, article }) }));
    } else {
      assert.ok(manifest[record.path], record.path);
      html = await readFile(`dist/client${manifest[record.path]}`, 'utf8');
    }
    assert.match(html, /編集：<a href="\/about">ゲムなお編集部<\/a>/, record.path);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((match) => {
      const parsed = JSON.parse(match[1]);
      return Array.isArray(parsed) ? parsed : [parsed];
    });
    const article = schemas.find((item) => item['@type'] === 'TechArticle');
    assert.ok(article, record.path);
    assert.deepEqual(article.author, editorialAuthor, record.path);
    assert.deepEqual(article.publisher, editorialPublisher, record.path);
    assert.equal(article.dateModified, record.checkedAt, record.path);
    assert.deepEqual(article.citation, record.sources.map((source) => source.url), record.path);
    for (const source of record.sources) assert.ok(html.includes(`href="${source.url.replaceAll('&', '&amp;')}"`), `${record.path}: visible source ${source.url}`);
  }
  console.log(`PASS: ${records.length} ${sourceRender ? 'source-rendered' : 'built'} Japanese articles have visible editorial attribution, matching author URL, publisher and visible-source citations; original checkedAt is retained`);
}
console.log('PASS: actual game route excludes future draft/thin metadata, prerenders and requests while preserving published/needs-review routes');
