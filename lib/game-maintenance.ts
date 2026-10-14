import type { MyGamesLocale } from './my-games-copy';
import { articleReview } from './fix-save';
import { localizedArticle } from './localized/index';
export type MaintenanceSource = {
  url: string;
  label: string;
  status: 'content-checked' | 'title-only' | 'unavailable';
  checkedOn: string | null;
  attemptedOn: string;
};
export type GameMaintenanceRecord = {
  gameSlug: string;
  articlePath: string;
  referenceVersion: string | null;
  versionSourceUrl: string | null;
  versionCheckedOn: string | null;
  sources: MaintenanceSource[];
  translationReviewedOn: Record<MyGamesLocale, string | null>;
};
// Manual, claim-specific records. Article dates alone never verify source content,
// a current game version, or translation parity. No automatic subscription/feed.
export const gameMaintenance: GameMaintenanceRecord[] = [
  {
    gameSlug: 'monster-hunter-wilds',
    articlePath: '/games/monster-hunter-wilds/not-launching',
    referenceVersion: '1.042.00.02',
    versionSourceUrl:
      'https://store.steampowered.com/news/app/2246340/view/1840944183778483',
    versionCheckedOn: null,
    sources: [
      {
        url: 'https://steamcommunity.com/app/2246340/discussions/0/596267902352499612/',
        label: 'Capcom: troubleshooting and issue reporting',
        status: 'content-checked',
        checkedOn: '2026-10-14',
        attemptedOn: '2026-10-14',
      },
      {
        url: 'https://store.steampowered.com/news/app/2246340/view/1840944183778483',
        label: 'Capcom: update reference 1.042.00.02',
        status: 'unavailable',
        checkedOn: null,
        attemptedOn: '2026-10-14',
      },
    ],
    translationReviewedOn: { ja: null, en: null, zh: null, es: null },
  },
  {
    gameSlug: 'ace-combat-8',
    articlePath: '/games/ace-combat-8/error-st-3100001',
    referenceVersion: null,
    versionSourceUrl: null,
    versionCheckedOn: null,
    sources: [
      {
        url: 'https://steamcommunity.com/ogg/2288340/announcements/detail/695399726270382124',
        label: 'ACE COMBAT 8: About Error Code ST-3100001',
        status: 'title-only',
        checkedOn: null,
        attemptedOn: '2026-10-14',
      },
    ],
    translationReviewedOn: { ja: null, en: null, zh: null, es: null },
  },
];
export function maintenanceForGame(gameSlug: string) {
  return gameMaintenance
    .filter((row) => row.gameSlug === gameSlug)
    .map((row) => {
      const article = articleReview(row.articlePath);
      const translations = (['ja', 'en', 'zh', 'es'] as const).map((locale) => {
        const match =
          locale === 'ja'
            ? article
            : localizedArticle(
                locale,
                gameSlug,
                row.articlePath.split('/').at(-1)!,
              );
        return {
          locale,
          exists: !!match,
          articleCheckedOn: match
            ? 'checkedOn' in match
              ? match.checkedOn
              : match.checkedAt
            : null,
          contentReviewedOn: row.translationReviewedOn[locale],
        };
      });
      return {
        ...row,
        articleCheckedOn: article?.checkedOn || null,
        translations,
      };
    });
}
