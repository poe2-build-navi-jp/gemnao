/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */
import type { ReactNode } from 'react';
import { WikiHeader, WikiFooter } from './wiki-header';
export function EnglishStaticPage({
  path,
  title,
  description,
  children,
  type = 'WebPage',
}: {
  path: string;
  title: string;
  description: string;
  children: ReactNode;
  type?: string;
}) {
  return (
    <main lang="en">
      <WikiHeader locale="en" pagePath={path} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': type,
            name: title,
            description,
            url: `https://gemnao.pages.dev/en${path}`,
            inLanguage: 'en',
          }),
        }}
      />
      <article className="static-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/en">Home</a>
          <span>›</span>
          <b>{title}</b>
        </nav>
        <h1>{title}</h1>
        <p className="page-lead">{description}</p>
        {children}
      </article>
      <WikiFooter locale="en" />
    </main>
  );
}
