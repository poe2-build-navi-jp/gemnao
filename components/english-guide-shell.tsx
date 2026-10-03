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
}: {
  guide: EnglishGuideInfo;
  contents: { id: string; title: string }[];
  children: ReactNode;
  affiliate?: boolean;
}) {
  const path = `/en${guide.path}`;
  const canonical = `https://gemnao.pages.dev${path}`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: guide.title,
      description: guide.description,
      dateModified: guide.checkedAt,
      inLanguage: 'en',
      author: { '@type': 'Organization', name: 'Gemnao' },
      mainEntityOfPage: canonical,
      image: `https://gemnao.pages.dev${ogImageFor(path).split('?')[0]}`,
      citation: guide.sources.map((source) => source.url),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: 'en',
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
          name: 'Home',
          item: 'https://gemnao.pages.dev/en',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: guide.shortTitle,
          item: canonical,
        },
      ],
    },
  ];
  return (
    <main lang="en">
      <WikiHeader locale="en" pagePath={guide.path} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="article-hero issue-hero pc-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/en">Home</a>
            <span>›</span>
            <b>{guide.shortTitle}</b>
          </nav>
          <p className="article-label">{guide.category}</p>
          <h1>{guide.title}</h1>
          <p className="article-lead">{guide.lead}</p>
          <div className="article-meta">
            <span>Last checked: {guide.checkedAt}</span>
            {affiliate ? (
              <span>Contains advertising / affiliate links</span>
            ) : null}
          </div>
          <SaveArticle path={path} title={guide.title} locale="en" />
        </div>
      </header>
      <div className="article-layout issue-layout">
        <aside className="toc issue-toc">
          <strong>On this page</strong>
          <a href="#answer">The short answer</a>
          {contents.map((section) => (
            <a href={`#${section.id}`} key={section.id}>
              {section.title}
            </a>
          ))}
          <a href="#faq">FAQ</a>
          <a href="#references">Sources</a>
        </aside>
        <article className="guide-article pc-guide">
          <section className="answer-summary" id="answer">
            <h2>
              <CheckCircle2 size={23} /> The short answer
            </h2>
            <p>{guide.summary}</p>
            {guide.related.length ? (
              <a className="article-next-jump" href="#related-guides">
                Need a different check? Find a related guide or tool →
              </a>
            ) : null}
          </section>
          {children}
          <section className="faq-section" id="faq">
            <h2>FAQ</h2>
            <div>
              {guide.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="related-section" id="related-guides">
            <h2>Related guides and tools</h2>
            <div>
              {guide.related.map((link) => (
                <a
                  href={link.href}
                  data-related="true"
                  hrefLang={link.href.startsWith('/en/') ? 'en' : 'ja'}
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
              Japanese version of this page
            </a>{' '}
            ·{' '}
            <a href={`/contact?url=${encodeURIComponent(canonical)}`}>
              Report an error (Japanese contact form)
            </a>
          </p>
          <ShareButtons title={guide.title} path={path} locale="en" />
          <section className="sources" id="references">
            <h2>Sources and editorial notes</h2>
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
      <WikiFooter locale="en" />
    </main>
  );
}
