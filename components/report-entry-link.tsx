/* oxlint-disable next/no-html-link-for-pages -- Full navigation unloads article analytics. */
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { reportCopy } from '@/lib/community-reports/copy';
import { gameArticles } from '@/lib/game-articles';
export function ReportEntryLink({
  articlePath,
  stepIds = [],
  outcome = 'unresolved',
  locale = 'ja',
}: {
  articlePath: string;
  stepIds?: string[];
  outcome?: string;
  locale?: MyGamesLocale;
}) {
  if (!/^\/games\/[a-z0-9-]+\/[a-z0-9-]+$/.test(articlePath)) return null;
  const query = new URLSearchParams({ article: articlePath });
  const category = gameArticles.find(
    (a) => `/games/${a.gameSlug}/${a.slug}` === articlePath,
  )?.category;
  query.set(
    'symptom',
    category === 'server'
      ? 'network'
      : category === 'settings'
        ? 'display'
        : category &&
            [
              'launch',
              'crash',
              'performance',
              'display',
              'network',
              'audio',
            ].includes(category)
          ? category
          : 'other',
  );
  if (stepIds.length) query.set('steps', stepIds.join(','));
  if (['unresolved', 'resolved', 'recurrence'].includes(outcome))
    query.set('outcome', outcome);
  return (
    <p>
      <a href={`${locale === 'ja' ? '' : '/' + locale}/reports?${query}`}>
        {reportCopy[locale].title} →
      </a>
    </p>
  );
}
