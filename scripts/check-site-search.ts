import assert from 'node:assert/strict';
import { games } from '../lib/games';
import { gameArticles } from '../lib/game-articles';
import {
  hasSiteSearchResult,
  matchesNaturalQuery,
  searchArticles,
  searchGames,
  searchQueryTerms,
} from '../lib/site-search';

// Unknown words must not disappear when a known symptom is present.
assert.deepEqual(searchQueryTerms('モンハン 起動しない'), [
  'モンハン',
  '起動しない',
]);
assert.equal(
  matchesNaturalQuery('Aniimo 起動しない', 'モンハン 起動しない'),
  false,
);
assert.equal(
  matchesNaturalQuery('モンハン 起動しない', '未収録タイトル 起動しない'),
  false,
);
assert.equal(matchesNaturalQuery('ＵＳＢ－Ｃ', 'usb-c'), true);
assert.equal(
  matchesNaturalQuery(
    'Monster Hunter Wilds 起動しない',
    'モンスターハンター 開かない',
  ),
  true,
);
assert.equal(
  matchesNaturalQuery('モンハン 起動しない', 'モンハンが起動しない'),
  true,
);
assert.equal(
  matchesNaturalQuery('マインクラフト 起動しない', 'マイクラ 立ち上がらない'),
  true,
);

for (const query of [
  'モンハン 起動しない',
  'モンハンが起動しない',
  'モンスターハンター 起動しない',
  'Monster Hunter 起動しない',
  'モンハン　開かない',
]) {
  const results = searchArticles(query);
  assert(results.length > 0, query);
  assert.equal(results[0].gameArticle?.gameSlug, 'monster-hunter-wilds', query);
  assert(results[0].title.includes('起動'), `${query}: ${results[0].title}`);
  assert(
    results.every(
      (article) => article.gameArticle?.gameSlug === 'monster-hunter-wilds',
    ),
    query,
  );
  assert.deepEqual(
    searchGames(query).map((game) => game.slug),
    ['monster-hunter-wilds'],
    query,
  );
}
assert.deepEqual(
  searchGames('モンハン').map((game) => game.slug),
  ['monster-hunter-wilds'],
);
assert.equal(searchArticles('Discord')[0].kind, 'discord');
assert.equal(searchArticles('ディスコード')[0].kind, 'discord');
assert(searchArticles('セーブ')[0].title.includes('セーブ'));
assert.equal(
  searchArticles('USB-C')[0].href,
  '/pc/usb-c-device-not-recognized',
);
assert.equal(
  searchArticles('ＵＳＢ－Ｃ')[0].href,
  '/pc/usb-c-device-not-recognized',
);
// Single-term natural-language aliases retained.
assert(searchArticles('黒い画面').length > 0);
assert(searchArticles('ガクガク').length > 0);
for (const query of [
  '未収録タイトル',
  '未収録タイトル 起動しない',
  'モンハン 未収録症状',
  'Discord 未収録症状',
]) {
  assert.equal(searchGames(query).length, 0, query);
  assert.equal(searchArticles(query).length, 0, query);
  assert.equal(hasSiteSearchResult(query), false, query);
}
// Blank queries retain game order and article recency, without mutating data.
assert.deepEqual(searchGames('　 '), games);
assert.equal(
  searchArticles('').filter((article) => article.kind === 'game').length,
  gameArticles.length,
);
assert(
  searchArticles('').every(
    (article, i, all) => !i || all[i - 1].checkedAt >= article.checkedAt,
  ),
);
assert(
  searchArticles('', 'discord').every((article) => article.kind === 'discord'),
);
assert(searchArticles('', 'pc').every((article) => article.kind === 'pc'));
assert.equal(searchArticles('モンハン 起動しない', 'save').length, 0);
for (const query of [
  'モンハン 起動しない',
  'モンハン',
  'Discord',
  'セーブ',
  'USB-C',
  '未収録タイトル 起動しない',
  '',
]) {
  assert.equal(
    hasSiteSearchResult(query),
    Boolean(searchGames(query).length + searchArticles(query).length),
  );
  console.log(
    `${JSON.stringify(query)}: games=${searchGames(query).length}, articles=${searchArticles(query).length}; first=${searchArticles(query)[0]?.href ?? '(none)'}`,
  );
}
console.log(
  'PASS: query retention, Japanese/English aliases, field relevance, cross-type ranking, filters, empty/no-hit queries and UI/server parity',
);
