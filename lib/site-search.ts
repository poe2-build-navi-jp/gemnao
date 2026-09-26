import { games } from './games';
import { categoryLabels, gameArticles } from './game-articles';
import { commonGuides } from './common-guides';
import { discordArticles } from './discord-articles';

const aliases: [RegExp, string][] = [
  [/立ち上がらない|開かない/g, '起動しない'],
  [/真っ黒|黒い画面/g, '黒画面'],
  [/相手の声|音が聞こえない/g, '声 聞こえない'],
  [/ガクガク/g, 'カクつく'],
];
const knownTerms = [
  'installation has failed',
  'update failed',
  'コントローラー',
  '聞こえない',
  '起動しない',
  'クラッシュ',
  'カクつく',
  '黒画面',
  'discord',
  'aniimo',
  'アニモ',
  'wardogs',
  'steam',
  'マイク',
  'セーブ',
  'サーバー',
  'fps',
  'mod',
  '起動',
  '声',
  '重い',
];

export function normalizeSearchQuery(value: string) {
  return value.normalize('NFKC').toLowerCase().trim().replace(/\s+/g, ' ');
}

function words(value: string) {
  const normalized = aliases.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    normalizeSearchQuery(value),
  );
  const intent = knownTerms.filter((term) => normalized.includes(term));
  return intent.length
    ? [...new Set(intent)]
    : normalized.split(/[\s、。・/]+/).filter(Boolean);
}

export function matchesNaturalQuery(haystack: string, query: string) {
  return words(query).every((word) =>
    aliases
      .reduce(
        (text, [pattern, replacement]) => text.replace(pattern, replacement),
        haystack.toLowerCase(),
      )
      .includes(word),
  );
}

/** The server repeats the public site's search before recording a zero result. */
export function hasSiteSearchResult(query: string) {
  return (
    games.some((game) =>
      matchesNaturalQuery(
        [game.title, game.shortTitle, game.lead, ...game.tags].join(' '),
        query,
      ),
    ) ||
    gameArticles.some((article) => {
      const game = games.find((item) => item.slug === article.gameSlug);
      return matchesNaturalQuery(
        [
          game?.title,
          game?.shortTitle,
          article.title,
          article.shortTitle,
          article.symptom,
          article.description,
          article.metaDescription,
          categoryLabels[article.category],
        ].join(' '),
        query,
      );
    }) ||
    commonGuides.some(
      (guide) =>
        guide.status === 'verified' &&
        matchesNaturalQuery(
          [
            guide.title,
            guide.shortTitle,
            guide.description,
            ...guide.causes,
          ].join(' '),
          query,
        ),
    ) ||
    discordArticles.some(
      (article) =>
        article.status === 'verified' &&
        matchesNaturalQuery(
          [
            article.title,
            article.shortTitle,
            article.symptom,
            article.metaDescription,
            ...article.quickFixes,
          ].join(' '),
          query,
        ),
    )
  );
}
