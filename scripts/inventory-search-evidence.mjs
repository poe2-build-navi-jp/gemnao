import { build } from 'esbuild';
const result = await build({
  stdin: {
    contents: `import {gameArticles} from './lib/game-articles'; import {commonGuides} from './lib/common-guides'; import {discordArticles} from './lib/discord-articles'; import {pcArticles} from './lib/pc-articles'; import sitemap from './app/sitemap'; export {gameArticles,commonGuides,discordArticles,pcArticles,sitemap};`,
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const d = await import(
  'data:text/javascript;base64,' +
    Buffer.from(result.outputFiles[0].text).toString('base64')
);
const selected = new Set([
  '/games/monster-hunter-wilds/not-launching',
  '/guide/steam-game-not-launching',
  '/guide/verify-steam-files',
  '/guide/directx-error',
]);
const rows = [];
for (const [family, items] of [
  ['games', d.gameArticles],
  ['guide', d.commonGuides],
  ['discord', d.discordArticles],
  ['pc', d.pcArticles],
])
  for (const a of items) {
    const path = `/${family}/${family === 'games' ? a.gameSlug + '/' : ''}${a.slug}`;
    rows.push({
      path,
      title: a.title,
      family,
      status: a.status || 'published',
      date: a.checkedAt,
      conclusion: !!(a.conclusion || a.answer),
      steps: (a.steps || a.causes || []).length,
      sources: a.sources?.length || 0,
      version: a.targetVersion || null,
      scope: selected.has(path)
        ? 'individual-evidence-added'
        : path === '/games/rocket-league/dualsense-not-working'
          ? 'existing-evidence-preserved'
          : 'not-reviewed-this-change',
    });
  }
const { writeFileSync } = await import('node:fs');
writeFileSync(
  'docs/search-evidence-2026-10-25/article-inventory.json',
  JSON.stringify(
    {
      base: 'a03f37a2eb4e06a222cda0d2bb581e5e817870c1',
      note: 'Code inventory only; status/checkedAt are inherited metadata, not proof of hardware testing or review today.',
      articles: rows,
    },
    null,
    2,
  ) + '\n',
);
const urls = d.sitemap().map((x) => new URL(x.url).pathname);
writeFileSync(
  'docs/search-evidence-2026-10-25/indexed-route-inventory.json',
  JSON.stringify(urls, null, 2) + '\n',
);
console.log(
  JSON.stringify(
    {
      families: Object.fromEntries(
        ['games', 'guide', 'discord', 'pc'].map((f) => [
          f,
          rows.filter((r) => r.family === f).length,
        ]),
      ),
      articles: rows.length,
      indexedRoutes: urls.length,
      otherLanguages: urls.filter((p) => /^\/(en|zh|es)\//.test(p)).length,
      selected: rows
        .filter((r) => selected.has(r.path))
        .map((r) => ({ path: r.path, title: r.title })),
    },
    null,
    2,
  ),
);
