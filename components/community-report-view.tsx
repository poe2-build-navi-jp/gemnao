/* oxlint-disable next/no-html-link-for-pages -- Untracked report navigation is a full document load. */
import { articleReview } from '@/lib/fix-save';
import { localizedArticle } from '@/lib/localized/index';
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { reportCopy } from '@/lib/community-reports/copy';
import type { Content, Evidence } from '@/lib/community-reports/model';
export function reportGuide(content: Content, locale: MyGamesLocale) {
  const review = articleReview(content.articlePath);
  const translated =
    locale === 'ja'
      ? undefined
      : localizedArticle(
          locale,
          content.articlePath.split('/')[2],
          content.articlePath.split('/')[3],
        );
  return {
    title:
      translated?.title ||
      `${review?.title || content.articlePath}${locale === 'ja' ? '' : reportCopy[locale].jaGuide}`,
    href: translated ? `/${locale}${content.articlePath}` : content.articlePath,
    steps: translated?.steps || review?.steps || [],
    fallback: locale !== 'ja' && !translated,
  };
}
export function CommunityReportView({
  content,
  evidence,
  locale = 'ja',
}: {
  content: Content;
  evidence?: Evidence;
  locale?: MyGamesLocale;
}) {
  const t = reportCopy[locale],
    guide = reportGuide(content, locale);
  return (
    <div className="report-summary">
      <p>
        <a href={guide.href}>{guide.title}</a>
      </p>
      <dl>
        <dt>{t.symptom}</dt>
        <dd>{t.symptoms[content.symptom]}</dd>
        <dt>{t.outcome}</dt>
        <dd>{t.outcomes[content.outcome]}</dd>
        <dt>{t.previouslyWorked}</dt>
        <dd>
          {content.previouslyWorked
            ? t.previousStates[content.previouslyWorked]
            : t.notRecorded}
        </dd>
        <dt>{t.recentChange}</dt>
        <dd>
          {content.recentChange
            ? t.recentChanges[content.recentChange]
            : t.notRecorded}
        </dd>
        <dt>{t.observed}</dt>
        <dd>{content.observedOn || t.unknown}</dd>
        <dt>{t.version}</dt>
        <dd>{content.version || t.unknown}</dd>
        <dt>{t.os}</dt>
        <dd>{content.os === 'unknown' ? t.unknown : content.os}</dd>
        <dt>{t.gpu}</dt>
        <dd>{content.gpu === 'unknown' ? t.unknown : content.gpu}</dd>
      </dl>
      <p>{t.steps}</p>
      <ul>
        {content.stepIds.map((id) => (
          <li key={id}>
            {guide.steps.find((s) => s.id === id)?.title || id}
            {guide.fallback ? t.jaGuide : ''}
          </li>
        ))}
      </ul>
      {content.sources.map((s, i) => (
        <p key={i}>
          <a href={s.url} rel="noopener noreferrer">
            {s.url}
          </a>
          <br />
          {t.readOn}: {s.readOn || t.unknown}
        </p>
      ))}
      {evidence && (
        <aside className="report-evidence">
          <strong>{t.labels[evidence.label]}</strong>
          <p>
            {t.reviewed}: {evidence.checkedOn}
          </p>
          {evidence.note && <p>{evidence.note}</p>}
          {evidence.environment && <p>{evidence.environment}</p>}
          {evidence.observedOn && (
            <p>
              {t.evidenceObserved}: {evidence.observedOn}
            </p>
          )}
          {evidence.result && (
            <p>
              {t.evidenceResult}: {t.results[evidence.result]}
            </p>
          )}
          {evidence.sources.map((s, i) => (
            <p key={i}>
              <a href={s.url} rel="noopener noreferrer">
                {s.url}
              </a>
              <br />
              {t.sourceReadOn}: {s.readOn}
            </p>
          ))}
        </aside>
      )}
    </div>
  );
}
