import { games, type GameGuide } from './games';
import {
  categoryLabels,
  gameArticles,
  type GameArticle,
} from './game-articles';
import { commonGuides } from './common-guides';
import { discordArticles } from './discord-articles';
import { pcArticles } from './pc-articles';
import { articleMatchesTrouble, troubleHubForGuide } from './trouble-hubs';

const aliases: [RegExp, string][] = [
  [/立ち上がらない|開かない/g, '起動しない'],
  [/真っ黒|黒い画面/g, '黒画面'],
  [/相手の声|音が聞こえない/g, '声 聞こえない'],
  [/ガクガク/g, 'カクつく'],
  [/マイクラ|minecraft/g, 'マインクラフト'],
  [/エスコン/g, 'エースコンバット'],
  [/ギアーズ/g, 'gears'],
  [/モンスターハンター|monster[ -]?hunter/g, 'モンハン'],
  [/wilds/g, 'ワイルズ'],
  [/ディスコード/g, 'discord'],
  [/セキュア ?ブート|secure ?boot/g, 'セキュアブート'],
  [/モダンウォーフェア|モダン・ウォーフェア/g, 'modern warfare'],
  [/ゲームガード|game ?guard/g, 'gameguard'],
  [/バルダーズ ?ゲート ?3|バルダーズ・ゲート ?3|バルゲ3/g, 'bg3'],
  [/gta ?(?:5|v)(?![a-z0-9])/g, 'gta5'],
];

export function normalizeSearchQuery(value: string) {
  return value.normalize('NFKC').toLowerCase().trim().replace(/\s+/g, ' ');
}

function normalizeText(value: string) {
  return aliases.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    normalizeSearchQuery(value),
  );
}

// Longest-first splitting supports unspaced Japanese queries without losing
// unfamiliar game names or qualifiers (the old known-terms filter lost them).
const knownTerms = [
  ...new Set([
    ...games.flatMap((game) => [
      normalizeText(game.title),
      normalizeText(game.shortTitle),
    ]),
    'installation has failed',
    'update failed',
    'コントローラー',
    '聞こえない',
    '起動しない',
    'クラッシュ',
    'カクつく',
    '黒画面',
    'discord',
    'windows',
    'aniimo',
    'アニモ',
    'wardogs',
    'aion2',
    'エースコンバット',
    '無双',
    'サイレントヒル',
    'マインクラフト',
    'モンハン',
    'ワイルズ',
    'tpm',
    'セキュアブート',
    'gameguard',
    'skse',
    'bg3',
    'gta5',
    'スカイリム',
    'スターデューバレー',
    'steam',
    'マイク',
    'セーブ',
    'サーバー',
    'fps',
    'mod',
    '起動',
    '声',
    '重い',
  ]),
].sort((a, b) => b.length - a.length);
const termPattern = new RegExp(
  `(${knownTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
  'g',
);

export function searchQueryTerms(value: string) {
  const normalized = normalizeText(value);
  const terms = normalized
    .split(termPattern)
    .flatMap((part) =>
      part.split(/[\s、。・/「」『』（）()]+/).filter(Boolean),
    );
  return [
    ...new Set(
      terms.filter(
        (term) =>
          // Only discard a complete connecting particle, never an unknown word.
          !/^(の|が|で|は|を|と|に)$/.test(term),
      ),
    ),
  ];
}

export function matchesNaturalQuery(haystack: string, query: string) {
  const text = normalizeText(haystack);
  const terms = searchQueryTerms(query);
  return terms.length
    ? terms.every((term) => text.includes(term))
    : !query.trim();
}

export type SearchArticle = {
  key: string;
  href: string;
  label: string;
  title: string;
  checkedAt: string;
  kind: 'game' | 'guide' | 'discord' | 'pc';
  gameArticle?: GameArticle;
  cluster?: string;
};
type SearchDocument<T> = {
  item: T;
  title: string;
  keywords: string;
  body: string;
};
function document<T>(
  item: T,
  title: string[],
  keywords: string[],
  body: string[],
): SearchDocument<T> {
  return {
    item,
    title: normalizeText(title.join(' ')),
    keywords: normalizeText(keywords.join(' ')),
    body: normalizeText(body.join(' ')),
  };
}
const gameIndex = games.map((game) =>
  document(game, [game.title, game.shortTitle], game.tags, [game.lead]),
);
const gameBySlug = new Map(games.map((game) => [game.slug, game]));
const articleIndex: SearchDocument<SearchArticle>[] = [
  ...gameArticles.map((article) => {
    const game = gameBySlug.get(article.gameSlug);
    return document<SearchArticle>(
      {
        key: `game-${article.gameSlug}-${article.slug}`,
        href: `/games/${article.gameSlug}/${article.slug}`,
        label: `${game?.shortTitle ?? ''}・${categoryLabels[article.category]}`,
        title: article.shortTitle,
        checkedAt: article.checkedAt,
        kind: 'game',
        gameArticle: article,
      },
      [article.title, article.shortTitle],
      [
        game?.title ?? '',
        game?.shortTitle ?? '',
        categoryLabels[article.category],
      ],
      [article.symptom, article.description, article.metaDescription],
    );
  }),
  ...commonGuides
    .filter((guide) => guide.status === 'verified')
    .map((guide) =>
      document<SearchArticle>(
        {
          key: `guide-${guide.slug}`,
          href: `/guide/${guide.slug}`,
          label: 'PC共通ガイド',
          title: guide.shortTitle,
          checkedAt: guide.checkedAt,
          kind: 'guide',
          cluster: troubleHubForGuide(guide)?.slug,
        },
        [guide.title, guide.shortTitle],
        [],
        [guide.description, ...guide.causes],
      ),
    ),
  ...discordArticles
    .filter((article) => article.status === 'verified')
    .map((article) =>
      document<SearchArticle>(
        {
          key: `discord-${article.slug}`,
          href: `/discord/${article.slug}`,
          label: 'Discord',
          title: article.shortTitle,
          checkedAt: article.checkedAt,
          kind: 'discord',
          cluster: 'discord',
        },
        [article.title, article.shortTitle],
        ['Discord'],
        [article.symptom, article.metaDescription, ...article.quickFixes],
      ),
    ),
  ...pcArticles.map((article) =>
    document<SearchArticle>(
      {
        key: `pc-${article.slug}`,
        href: `/pc/${article.slug}`,
        label: 'PC・Windows',
        title: article.shortTitle,
        checkedAt: article.checkedAt,
        kind: 'pc',
        cluster: 'pc',
      },
      [article.title, article.shortTitle],
      ['PC Windows'],
      [article.lead, article.description, ...article.quickChecks],
    ),
  ),
];

function rank<T>(
  index: SearchDocument<T>[],
  query: string,
  tieBreak: (a: T, b: T) => number,
): T[] {
  const terms = searchQueryTerms(query);
  if (!terms.length)
    return query.trim() ? [] : index.map(({ item }) => item).sort(tieBreak);
  const phrase = normalizeText(query);
  return index
    .map((entry) => {
      const all = `${entry.title} ${entry.keywords} ${entry.body}`;
      if (!terms.every((term) => all.includes(term)))
        return { item: entry.item, score: -1 };
      const score =
        (entry.title.includes(phrase) ? 100 : 0) +
        terms.reduce(
          (sum, term) =>
            sum +
            (entry.title.includes(term)
              ? 30
              : entry.keywords.includes(term)
                ? 12
                : 3),
          0,
        );
      return { item: entry.item, score };
    })
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score || tieBreak(a.item, b.item))
    .map(({ item }) => item);
}

export function searchGames(query: string): GameGuide[] {
  return rank(gameIndex, query, () => 0);
}

export function searchArticles(
  query: string,
  cluster = 'all',
): SearchArticle[] {
  return rank(
    articleIndex.filter(
      ({ item }) =>
        cluster === 'all' ||
        (item.gameArticle
          ? articleMatchesTrouble(item.gameArticle, cluster)
          : item.cluster === cluster),
    ),
    query,
    (a, b) => b.checkedAt.localeCompare(a.checkedAt),
  );
}

/** Use the same index and matching rules as the UI for zero-result telemetry. */
export function hasSiteSearchResult(query: string) {
  return searchGames(query).length > 0 || searchArticles(query).length > 0;
}
