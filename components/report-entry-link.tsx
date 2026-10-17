/* oxlint-disable next/no-html-link-for-pages -- Full navigation unloads article analytics. */
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { reportCopy } from '@/lib/community-reports/copy';
import { CommunityReportCount } from './community-report-count';
import { gameArticles } from '@/lib/game-articles';
export function ReportEntryLink({
  articlePath,
  gameSlug,
  prominent = false,
  stepIds = [],
  outcome = 'unresolved',
  locale = 'ja',
}: {
  articlePath?: string;
  gameSlug?: string;
  prominent?: boolean;
  stepIds?: string[];
  outcome?: string;
  locale?: MyGamesLocale;
}) {
  if (articlePath && !/^\/games\/[a-z0-9-]+\/[a-z0-9-]+$/.test(articlePath))
    return null;
  const query = new URLSearchParams();
  if (articlePath) query.set('article', articlePath);
  else if (
    gameSlug &&
    gameArticles.some(
      (a) =>
        a.gameSlug === gameSlug &&
        !['draft', 'thin'].includes(a.status || 'verified'),
    )
  )
    query.set('game', gameSlug);
  const category = gameArticles.find(
    (a) => `/games/${a.gameSlug}/${a.slug}` === articlePath,
  )?.category;
  if (articlePath)
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
  if (articlePath && ['unresolved', 'resolved', 'recurrence'].includes(outcome))
    query.set('outcome', outcome);
  const t = reportCopy[locale];
  const href = `${locale === 'ja' ? '' : '/' + locale}/reports${query.size ? '?' + query : ''}`;
  const link = (
    <a href={href}>
      {t.entryLink} <span aria-hidden="true">→</span>
    </a>
  );
  return prominent ? (
    <aside className="report-entry-card" aria-label={t.entryTitle}>
      <div>
        <strong>{t.entryTitle}</strong>
        <p>{t.entryPurpose}</p>
        {gameSlug && (
          <CommunityReportCount
            key={gameSlug}
            gameSlug={gameSlug}
            locale={locale}
          />
        )}
      </div>
      {link}
    </aside>
  ) : (
    <p className="report-entry-inline">{link}</p>
  );
}
