/* oxlint-disable next/no-html-link-for-pages -- Preserve native, language-specific article URLs. */
import type { Locale } from '@/lib/i18n';

const labels = {
  ja: { title: '最近更新した3記事', all: '記事をすべて見る' },
  en: { title: '3 recently updated guides', all: 'See all guides' },
  zh: { title: '最近更新的3篇指南', all: '查看全部指南' },
  es: {
    title: '3 guías actualizadas recientemente',
    all: 'Ver todas las guías',
  },
};

export function LatestArticles({
  articles,
  locale = 'ja',
  allHref,
}: {
  articles: {
    href: string;
    title: string;
    checkedAt: string;
    label?: string;
  }[];
  locale?: 'ja' | Locale;
  allHref?: string;
}) {
  const t = labels[locale];
  return (
    <section
      className="content home-latest"
      aria-labelledby="home-latest-title"
    >
      <div className="home-latest-heading">
        <h2 id="home-latest-title">{t.title}</h2>
        <a
          href={
            allHref ??
            (locale === 'ja'
              ? '/?view=articles#articles'
              : `/${locale}#articles`)
          }
        >
          {t.all} <span aria-hidden="true">→</span>
        </a>
      </div>
      <ol>
        {articles.map((article) => (
          <li key={article.href}>
            <a href={article.href}>
              {article.label && <span>{article.label}</span>}
              <strong>{article.title}</strong>
              <time dateTime={article.checkedAt}>{article.checkedAt}</time>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
