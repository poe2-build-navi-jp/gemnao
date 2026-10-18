import { guideUi } from '@/lib/localized/guide-ui';
import { languageTag } from '@/lib/localized/index';
import type { Locale } from '@/lib/i18n';
import { ArticleToc } from '@/components/article-toc';
import { ArticleDiagnosisEntry } from '@/components/article-diagnosis-entry';
import { ShareButtons } from '@/components/share-buttons';
import { SaveArticle } from '@/components/save-article';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import type { ReactNode } from 'react';
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { ogImageFor } from '@/lib/og-images';

export type EnglishGuideInfo = {
  path: string;
  title: string;
  shortTitle: string;
  description: string;
  lead: string;
  summary: string;
  checkedAt: string;
  category: string;
  sourcePolicy: string;
  sources: { label: string; url: string }[];
  faqs: { question: string; answer: string }[];
  related: { href: string; label: string }[];
};

export function EnglishGuideShell({
  guide,
  contents,
  children,
  affiliate = false,
  locale = 'en',
}: {
  guide: EnglishGuideInfo;
  contents: { id: string; title: string }[];
  children: ReactNode;
  affiliate?: boolean;
  locale?: Locale;
}) {
  const t = guideUi[locale];
  const path = `/${locale}${guide.path}`;
  const canonical = `https://gemnao.pages.dev${path}`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: guide.title,
      description: guide.description,
      dateModified: guide.checkedAt,
      inLanguage: languageTag[locale],
      author: { '@type': 'Organization', name: 'Gemnao' },
      mainEntityOfPage: canonical,
      image: `https://gemnao.pages.dev${ogImageFor(path).split('?')[0]}`,
      citation: guide.sources.map((source) => source.url),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: languageTag[locale],
      mainEntity: guide.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t.home,
          item: `https://gemnao.pages.dev/${locale}`,
        },
        ...(guide.path.startsWith('/guide/')
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: t.index,
                item: `https://gemnao.pages.dev/${locale}/guide`,
              },
            ]
          : []),
        {
          '@type': 'ListItem',
          position: guide.path.startsWith('/guide/') ? 3 : 2,
          name: guide.shortTitle,
          item: canonical,
        },
      ],
    },
  ];
  return (
    <main lang={languageTag[locale]}>
      <WikiHeader locale={locale} pagePath={guide.path} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="article-hero issue-hero pc-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href={`/${locale}`}>{t.home}</a>
            <span>›</span>
            {guide.path.startsWith('/guide/') && (
              <>
                <a href={`/${locale}/guide`}>{t.index}</a>
                <span>›</span>
              </>
            )}
            <b>{guide.shortTitle}</b>
          </nav>
          <p className="article-label">{guide.category}</p>
          <h1>{guide.title}</h1>
          <p className="article-lead">{guide.lead}</p>
          <div className="article-meta">
            <span>
              {t.checked}: {guide.checkedAt}
            </span>
            {affiliate ? (
              <span>Contains advertising / affiliate links</span>
            ) : null}
          </div>
          <SaveArticle path={path} title={guide.title} locale={locale} />
        </div>
      </header>
      <div className="article-layout issue-layout">
        <ArticleToc title={t.toc} className="issue-toc">
          <a href="#answer">{t.answer}</a>
          {contents.map((section) => (
            <a href={`#${section.id}`} key={section.id}>
              {section.title}
            </a>
          ))}
          <a href="#faq">{t.faq}</a>
          <a href="#references">{t.sources}</a>
        </ArticleToc>
        <article className="guide-article pc-guide">
          <section className="answer-summary" id="answer">
            <h2>
              <CheckCircle2 size={23} /> {t.answer}
            </h2>
            <p>{guide.summary}</p>
            {guide.related.length ? (
              <a className="article-next-jump" href="#related-guides">
                {t.next}
              </a>
            ) : null}
          </section>
          {children}
          <section className="faq-section" id="faq">
            <h2>{t.faq}</h2>
            <div>
              {guide.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <ArticleDiagnosisEntry path={guide.path} locale={locale} />
          <section className="related-section" id="related-guides">
            <h2>{t.related}</h2>
            <div>
              {guide.related.map((link) => (
                <a
                  href={link.href}
                  data-related="true"
                  hrefLang={
                    link.href.startsWith('/en/')
                      ? 'en'
                      : link.href.startsWith('/zh/')
                        ? 'zh-Hans'
                        : link.href.startsWith('/es/')
                          ? 'es'
                          : 'ja'
                  }
                  key={link.href}
                >
                  {link.label}
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          </section>
          <p className="correction-link">
            <a href={guide.path} hrefLang="ja">
              {t.japanese}
            </a>{' '}
            ·{' '}
            <a href={`/contact?url=${encodeURIComponent(canonical)}`}>
              {t.correction}
            </a>
          </p>
          <ShareButtons title={guide.title} path={path} locale={locale} />
          <section className="sources" id="references">
            <h2>{t.sourceNotes}</h2>
            <p className="source-policy">{guide.sourcePolicy}</p>
            {guide.sources.map((source) => (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                key={source.url}
              >
                {source.label}
                <ExternalLink size={15} />
              </a>
            ))}
          </section>
        </article>
      </div>
      <WikiFooter locale={locale} />
    </main>
  );
}
