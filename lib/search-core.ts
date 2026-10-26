import {
  normalizeSearchQuery,
  rankSearchDocuments,
  type SearchDocument,
} from './search-ranking';
export { normalizeSearchQuery } from './search-ranking';
export type { SearchDocument } from './search-ranking';
import { games, type GameGuide } from './games';
import type { GameArticle } from './game-articles';

// Search rules shared by the server index (lib/site-search.ts) and the
// browser. This file must not import article bodies: the home page loads a
// compact index (/search-index.json) only when someone actually searches.

const aliases: [RegExp, string][] = [
  [/立ち上がらない|開かない/g, '起動しない'],
  [/真っ黒|黒い画面/g, '黒画面'],
  [/相手の声|音が聞こえない/g, '声 聞こえない'],
  [/ガクガク|かくつく/g, 'カクつく'],
  [/もんはん/g, 'モンハン'],
  [/わいるず/g, 'ワイルズ'],
  [/すちーむ|スチーム/g, 'steam'],
  [/えすこん/g, 'エースコンバット'],
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
  /** Clusters a game article matches; set in the compact index. */
  troubles?: string[];
};

export function document<T>(
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

/** Clusters the home page can filter by (topics + Discord + PC). */
export const searchClusters = [
  'not-launching',
  'crash',
  'fps',
  'save',
  'mod',
  'controller',
  'server',
  'discord',
  'pc',
];

export function rank<T>(
  index: SearchDocument<T>[],
  query: string,
  tieBreak: (a: T, b: T) => number,
): T[] {
  return rankSearchDocuments(
    index,
    searchQueryTerms(query),
    normalizeText(query),
    !query.trim(),
    tieBreak,
  );
}

export function searchGames(query: string): GameGuide[] {
  return rank(gameIndex, query, () => 0);
}

/** Search a compact index (no article bodies), e.g. /search-index.json. */
export function searchInIndex(
  index: SearchDocument<SearchArticle>[],
  query: string,
  cluster = 'all',
): SearchArticle[] {
  return rank(
    index.filter(
      ({ item }) =>
        cluster === 'all' ||
        (item.troubles
          ? item.troubles.includes(cluster)
          : item.cluster === cluster),
    ),
    query,
    (a, b) => b.checkedAt.localeCompare(a.checkedAt),
  );
}
