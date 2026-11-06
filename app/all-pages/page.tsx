/* oxlint-disable next/no-html-link-for-pages -- Native, crawlable links to every page. */
import type { Metadata } from 'next';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { pageIndex } from '@/lib/page-index';

export const metadata: Metadata = {
  title: '全ページ一覧',
  description:
    'ゲムなおの記事・ガイド・まとめページを、種類ごとにすべて一覧にしたページです。',
  alternates: { canonical: '/all-pages' },
  // A navigation aid, not content to rank: keep it out of results but let
  // crawlers follow every link.
  robots: { index: false, follow: true },
};

export default function AllPages() {
  const sections = pageIndex();
  const total = sections.reduce((sum, s) => sum + s.pages.length, 0);
  return (
    <main>
      <WikiHeader pagePath="/all-pages" />
      <article className="static-page">
        <p className="page-kicker">ALL PAGES</p>
        <h1>全ページ一覧</h1>
        <p className="page-lead">
          ゲムなおのページを種類ごとにすべて並べています（{total}
          ページ）。English pages are listed at the end.
        </p>
        {sections.map((section) => (
          <section key={`${section.language}:${section.name}`}>
            <h2 lang={section.language === 'English' ? 'en' : undefined}>
              {section.language === 'English'
                ? `English: ${section.name}`
                : section.name}
              （{section.pages.length}）
            </h2>
            <ul>
              {section.pages.map((page) => (
                <li key={page.path}>
                  <a
                    href={page.path}
                    hrefLang={
                      page.path === '/en' || page.path.startsWith('/en/')
                        ? 'en'
                        : undefined
                    }
                  >
                    {page.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </article>
      <WikiFooter />
    </main>
  );
}
