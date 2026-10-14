/* oxlint-disable next/no-html-link-for-pages -- Public native links match the existing editorial shell. */
import type { Metadata } from 'next';
import { WikiHeader, WikiFooter } from './wiki-header';
import { CaseCitation } from './case-citation';
import {
  casePath,
  reportedCaseBySlug,
  type ReportedCase,
} from '@/lib/reported-cases';
import {
  languageAlternates,
  languageTag,
  hasTranslation,
  ogLocale,
} from '@/lib/localized/index';
import { ogImageFor } from '@/lib/og-images';
import { editorialAuthor, editorialPublisher } from '@/lib/editorial-identity';
import type { MyGamesLocale } from '@/lib/my-games-copy';
export function caseMetadata(slug: string, locale: MyGamesLocale): Metadata {
  const item = reportedCaseBySlug(slug);
  if (!item) return {};
  const t = item.copy[locale],
    path = casePath(item, locale);
  return {
    title: {
      absolute: `${t.title} | ${locale === 'ja' ? 'ゲムなお' : 'Gemnao'}`,
    },
    description: t.summary,
    alternates: {
      canonical: path,
      languages: languageAlternates(casePath(item)),
    },
    openGraph: {
      type: 'article',
      locale: locale === 'ja' ? 'ja_JP' : ogLocale[locale],
      title: t.title,
      description: t.summary,
      url: path,
      modifiedTime: item.reviewedOn,
      images: [ogImageFor(path)],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.summary,
      images: [ogImageFor(path)],
    },
  };
}
export function ReportedCasePage({
  item,
  locale = 'ja',
}: {
  item: ReportedCase;
  locale?: MyGamesLocale;
}) {
  const t = item.copy[locale],
    path = casePath(item, locale),
    url = `https://gemnao.pages.dev${path}`;
  const translated =
    locale !== 'ja' && hasTranslation(locale, item.articlePath);
  const guide = `${translated ? `/${locale}` : ''}${item.articlePath}#${item.stepId}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: t.title,
    description: t.summary,
    dateModified: item.reviewedOn,
    inLanguage: languageTag[locale],
    author: editorialAuthor,
    publisher: editorialPublisher,
    mainEntityOfPage: url,
    citation: item.sources.map((s) => s.url),
  };
  return (
    <main lang={languageTag[locale]}>
      <WikiHeader locale={locale} pagePath={casePath(item)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replaceAll('<', '\\u003c'),
        }}
      />
      <article className="static-page reported-case">
        <p className="page-kicker">{t.badge}</p>
        <h1>{t.title}</h1>
        <p className="page-lead">{t.summary}</p>
        <section aria-labelledby="case-conditions">
          <h2 id="case-conditions">{t.conditions}</h2>
          <p>
            {t.platform} — {t.symptom}
          </p>
          <dl>
            <div>
              <dt>{t.priorDate}</dt>
              <dd>
                <time dateTime={item.priorRecordOn}>{item.priorRecordOn}</time>
              </dd>
            </div>
            <div>
              <dt>{t.cpu}</dt>
              <dd>{item.cpu}</dd>
            </div>
            <div>
              <dt>{t.gpu}</dt>
              <dd>{item.gpu}</dd>
            </div>
            <div>
              <dt>{t.reportDate}</dt>
              <dd>{item.reportedOn ?? t.unknown}</dd>
            </div>
            <div>
              <dt>{t.gameVersion}</dt>
              <dd>{item.gameVersion ?? t.unknown}</dd>
            </div>
            <div>
              <dt>{t.steamVersion}</dt>
              <dd>{item.steamVersion ?? t.unknown}</dd>
            </div>
            <div>
              <dt>{t.reviewed}</dt>
              <dd>
                <time dateTime={item.reviewedOn}>{item.reviewedOn}</time>
              </dd>
            </div>
          </dl>
        </section>
        <section aria-labelledby="case-prior">
          <h2 id="case-prior">{t.prior}</h2>
          <ul>
            {t.tried.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="case-result">
          <h2 id="case-result">{t.change}</h2>
          <p>{t.changed}</p>
          <p>{t.documented}</p>
          <p>
            <a
              data-related="true"
              href={guide}
              hrefLang={translated ? locale : 'ja'}
            >
              {t.guide}
              {locale !== 'ja' && !translated ? t.jaGuide : ''} →
            </a>
          </p>
        </section>
        <section aria-labelledby="case-limits">
          <h2 id="case-limits">{t.limits}</h2>
          <ul>
            {t.limitations.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="case-safety">
          <h2 id="case-safety">{t.safety}</h2>
          <p>{t.safe}</p>
        </section>
        <section aria-labelledby="case-sources">
          <h2 id="case-sources">{t.sources}</h2>
          <p>{t.sourceNote}</p>
          <ul>
            {item.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} hrefLang="en" rel="noreferrer">
                  {s.name}
                </a>{' '}
                — {t.reviewed}: {s.checkedOn}
              </li>
            ))}
          </ul>
        </section>
        <CaseCitation url={url} title={t.title} labels={t} />
      </article>
      <WikiFooter locale={locale} />
    </main>
  );
}
export function ReportedCaseLink({
  articlePath,
  locale = 'ja',
}: {
  articlePath: string;
  locale?: MyGamesLocale;
}) {
  const item = reportedCaseBySlug('wilds-steam-added-dll');
  if (!item || item.articlePath !== articlePath) return null;
  return (
    <aside className="procedure-note">
      <a data-related="true" href={casePath(item, locale)}>
        {item.copy[locale].title} →
      </a>
      <p>{item.copy[locale].badge}</p>
    </aside>
  );
}
