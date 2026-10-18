/* oxlint-disable next/no-html-link-for-pages -- Native editorial navigation. */
import { WikiHeader, WikiFooter } from './wiki-header';
import { guideUi } from '@/lib/localized/guide-ui';
import { translatedCommonGuides } from '@/lib/localized/save-guides-zh-es';
import { languageTag } from '@/lib/localized/index';
export function LocalizedGuideIndex({ locale }: { locale: 'zh' | 'es' }) {
  const t = guideUi[locale];
  const guides = translatedCommonGuides.filter((g) => g.locale === locale);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t.indexTitle,
    description: t.indexDescription,
    inLanguage: languageTag[locale],
    url: `https://gemnao.pages.dev/${locale}/guide`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: guides.length,
      itemListElement: guides.map((g, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: g.shortTitle,
        url: `https://gemnao.pages.dev/${locale}${g.path}`,
      })),
    },
  };
  return (
    <main lang={languageTag[locale]}>
      <WikiHeader locale={locale} pagePath="/guide" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <article className="static-page">
        <nav className="breadcrumbs" aria-label={t.index}>
          <a href={`/${locale}`}>{t.home}</a>
          <span>›</span>
          <b>{t.index}</b>
        </nav>
        <h1>{t.indexTitle}</h1>
        <p className="page-lead">{t.indexDescription}</p>
        <div className="guide-index-grid">
          {guides.map((g) => (
            <a href={`/${locale}${g.path}`} key={g.path}>
              <strong>{g.shortTitle}</strong>
              <span>{g.description}</span>
              <small>{t.read} →</small>
            </a>
          ))}
        </div>
      </article>
      <WikiFooter locale={locale} />
    </main>
  );
}
