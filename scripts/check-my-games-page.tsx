import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { MyGamesPage } from '../components/my-games-page';
import { myGamesData } from '../lib/my-games-data';
import { games } from '../lib/games';
import { gameDisplayName } from '../lib/game-display-name';
import { myGamesCopy } from '../lib/my-games-copy';
import { hasTranslation, languageAlternates } from '../lib/localized/index';
import { readFileSync } from 'node:fs';
for (const locale of ['ja', 'en', 'zh', 'es'] as const) {
  const html = renderToStaticMarkup(<MyGamesPage locale={locale} />);
  assert.ok(html.includes(myGamesCopy[locale].title));
  assert.ok(html.includes('id="my-games"'));
  assert.ok(html.includes('id="my-feed"'));
  assert.ok(
    !html.includes('aria-pressed="true"'),
    'SSR cannot invent saved games',
  );
  const data = myGamesData(locale);
  for (const game of games) {
    const name = gameDisplayName(game, locale);
    assert.ok(name);
    if (locale !== 'ja') assert.ok(!/[ぁ-んァ-ヶ]/u.test(name), game.slug);
  }
  assert.equal(data.length, new Set(data.map((game) => game.slug)).size);
  for (const game of data) {
    assert.ok(game.name && game.searchNames && game.hub);
    if (game.slug === 'dragons-dogma-2') assert.ok(game.searchNames.includes("Dragon's Dogma 2"));
    assert.ok(game.searchNames.includes(game.slug.replaceAll('-', ' ')));
    if (locale !== 'ja') assert.ok(!/[ぁ-んァ-ヶ]/u.test(game.name), game.slug);
    for (const article of game.articles) {
      assert.ok(
        article.href.startsWith('/games/') ||
          article.href.startsWith(`/${locale}/games/`),
      );
      if (locale !== 'ja' && article.href.startsWith('/games/'))
        assert.equal(article.japanese, true);
    }
  }
  if (locale !== 'ja') assert.equal(hasTranslation(locale, '/my-games'), true);
}
assert.equal(Object.keys(languageAlternates('/my-games')).length, 5);
assert.ok(
  readFileSync('app/my-games/page.tsx', 'utf8').includes('index: false'),
);
assert.ok(
  readFileSync('app/[locale]/my-games/page.tsx', 'utf8').includes(
    'index: false',
  ),
);
console.log(
  'PASS: four-language My Games SSR, empty defaults, real game identities, localized/fallback guide paths, language alternatives, and personal-page noindex.',
);
