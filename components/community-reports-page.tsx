import { WikiHeader, WikiFooter } from './wiki-header';
import { CommunityReports } from './community-reports';
import { reportCopy } from '@/lib/community-reports/copy';
import { languageTag } from '@/lib/localized/index';
import type { MyGamesLocale } from '@/lib/my-games-copy';
export function CommunityReportsPage({
  locale = 'ja',
}: {
  locale?: MyGamesLocale;
}) {
  return (
    <main lang={languageTag[locale]}>
      <WikiHeader locale={locale} pagePath="/reports" />
      <article className="static-page community-reports-page">
        <h1>{reportCopy[locale].title}</h1>
        <CommunityReports locale={locale} />
      </article>
      <WikiFooter locale={locale} />
    </main>
  );
}
