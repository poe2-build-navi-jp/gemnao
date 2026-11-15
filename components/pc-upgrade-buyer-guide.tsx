/* oxlint-disable next/no-html-link-for-pages -- Preserve native editorial links. */
import { ArticleToc } from './article-toc';
import { WikiFooter, WikiHeader } from './wiki-header';
import { editorialAuthor, editorialPublisher } from '@/lib/editorial-identity';
import { AMAZON_ASSOCIATE_TAG } from '@/lib/gear-articles';
import type { GearGuide } from '@/lib/gear-guides';
import { ogImageFor } from '@/lib/og-images';
import {
  upgradeAmazonSearches,
  type UpgradeLocale,
} from '@/lib/pc-upgrade-guides';

const ui = {
  ja: {
    lang: 'ja-JP',
    home: 'ゲムなお',
    hub: 'ゲーマー向けデバイス',
    category: 'ゲーム用PC・パーツ｜購入前の判断ガイド',
    checked: '公式情報の確認',
    contents: 'このページの内容',
    answer: '先に結論',
    before: '買う前に無料で確認',
    compare: '状況から選ぶ',
    setup: '作業後の確認',
    faq: 'よくある質問',
    related: '次に読む記事',
    sources: '公式出典',
    policy:
      '公式資料で確認した仕様・操作と、購入判断のための編集上の比較をまとめています。特定機種の実機ベンチマークや、増設後の改善を保証する評価ではありません。',
  },
  en: {
    lang: 'en',
    home: 'Home',
    hub: 'PC game guides',
    category: 'Gaming PCs and components · Before buying',
    checked: 'Sources checked',
    contents: 'On this page',
    answer: 'Quick answer',
    before: 'Free checks before buying',
    compare: 'Choose for your situation',
    setup: 'Check the result',
    faq: 'Questions and answers',
    related: 'What to read next',
    sources: 'Official sources',
    policy:
      'Manufacturer documentation supports the specifications and procedures; the decision comparisons are editorial guidance. This is not a hands-on benchmark or a promise that an upgrade will solve a problem.',
  },
  zh: {
    lang: 'zh-Hans',
    home: '首页',
    hub: 'PC 游戏指南',
    category: '游戏电脑与部件 · 购买前判断',
    checked: '资料核对日期',
    contents: '本页内容',
    answer: '先看结论',
    before: '购买前的免费检查',
    compare: '按实际情况选择',
    setup: '确认操作结果',
    faq: '常见问题',
    related: '接下来阅读',
    sources: '官方资料',
    policy:
      '规格与操作依据所列官方资料，购买比较属于编辑判断。本文不是特定机型的实测，也不保证升级一定能解决问题。链接资料为英文。',
  },
  es: {
    lang: 'es',
    home: 'Inicio',
    hub: 'Guías de juegos de PC',
    category: 'PC y componentes para jugar · Antes de comprar',
    checked: 'Fuentes revisadas',
    contents: 'En esta página',
    answer: 'Respuesta breve',
    before: 'Comprobaciones gratuitas antes de comprar',
    compare: 'Elegir según tu situación',
    setup: 'Comprobar el resultado',
    faq: 'Preguntas frecuentes',
    related: 'Qué leer después',
    sources: 'Fuentes oficiales',
    policy:
      'La documentación oficial respalda especificaciones y procedimientos; la comparación para decidir es un criterio editorial. No es una prueba propia de rendimiento ni una garantía de reparación. Fuentes en inglés.',
  },
} as const;

export function PcUpgradeBuyerGuide({
  guide,
  locale = 'ja',
}: {
  guide: GearGuide;
  locale?: UpgradeLocale;
}) {
  const t = ui[locale];
  const originalPath = `/gear/${guide.slug}`;
  const path = `${locale === 'ja' ? '' : `/${locale}`}${originalPath}`;
  const home = locale === 'ja' ? '/' : `/${locale}`;
  const hub = locale === 'ja' ? '/gear' : `/${locale}/guide`;
  const canonical = `https://gemnao.pages.dev${path}`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: guide.title,
      description: guide.description,
      dateModified: guide.checkedAt,
      inLanguage: t.lang,
      author: editorialAuthor,
      publisher: editorialPublisher,
      mainEntityOfPage: canonical,
      image: `https://gemnao.pages.dev${ogImageFor(path).split('?')[0]}`,
      citation: guide.sources.map((source) => source.url),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t.home,
          item: `https://gemnao.pages.dev${home}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t.hub,
          item: `https://gemnao.pages.dev${hub}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: guide.shortTitle,
          item: canonical,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: t.lang,
      mainEntity: guide.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ];
  return (
    <main lang={t.lang}>
      <WikiHeader
        locale={locale === 'ja' ? undefined : locale}
        pagePath={originalPath}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="article-hero issue-hero pc-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label={t.hub}>
            <a href={home}>{t.home}</a>
            <span>›</span>
            <a href={hub}>{t.hub}</a>
            <span>›</span>
            <b>{guide.shortTitle}</b>
          </nav>
          <p className="article-label">{t.category}</p>
          <h1>{guide.title}</h1>
          <p className="article-lead">{guide.lead}</p>
          <div className="article-meta">
            <span>
              {t.checked}: {guide.checkedAt.replaceAll('-', '.')}
            </span>
          </div>
        </div>
      </header>
      <div className="article-layout issue-layout">
        <ArticleToc title={t.contents} className="issue-toc">
          <a href="#answer">{t.answer}</a>
          <a href="#before-buying">{t.before}</a>
          <a href="#compare">{t.compare}</a>
          {guide.sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title}
            </a>
          ))}
          <a href="#setup">{guide.setupTitle ?? t.setup}</a>
          <a href="#faq">{t.faq}</a>
          <a href="#references">{t.sources}</a>
        </ArticleToc>
        <article className="guide-article pc-guide">
          <section className="answer-summary" id="answer">
            <h2>{t.answer}</h2>
            <p>{guide.answer}</p>
          </section>
          <section className="pc-step" id="before-buying">
            <h2>{t.before}</h2>
            <ul>
              {guide.beforeBuying.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="diagnosis-table" id="compare">
            <h2>{guide.compareTitle ?? t.compare}</h2>
            <table>
              <thead>
                <tr>
                  {guide.compare.headers.map((heading) => (
                    <th scope="col" key={heading}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.compare.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th scope="row" key={i}>
                          {cell}
                        </th>
                      ) : (
                        <td key={i} data-label={guide.compare.headers[i]}>
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          {guide.sections.map((section) => (
            <section className="pc-step" id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.items && (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <section className="pc-step" id="setup">
            <h2>{guide.setupTitle ?? t.setup}</h2>
            <ol>
              {guide.setup.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
          {locale === 'ja' && (
            <aside
              className="affiliate-box"
              aria-label="広告：必要な条件を確認した方の購入先"
            >
              <span className="affiliate-label">広告・Amazonアソシエイト</span>
              <h2>必要な条件が分かったら、購入先で構成を確認</h2>
              <p>
                対応する規格・容量・構成を確認でき、追加が必要と判断した場合の検索先です。検索結果には条件の違う製品も含まれるため、型番・対応機種・販売元・価格・保証を再確認してください。
              </p>
              <div className="related-links">
                {upgradeAmazonSearches(guide.slug).map((search) => (
                  <a
                    className="affiliate-button"
                    key={search.query}
                    href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(search.query)}&tag=${AMAZON_ASSOCIATE_TAG}`}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                  >
                    {search.label} ↗
                  </a>
                ))}
              </div>
              <small>
                Amazonのアソシエイトとして、ゲムなおは適格販売により収入を得ています。
              </small>
            </aside>
          )}
          <section className="faq-section" id="faq">
            <h2>{t.faq}</h2>
            {guide.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </section>
          <section className="related-section" id="related-guides">
            <h2>{t.related}</h2>
            <div>
              {guide.related.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label} →
                </a>
              ))}
            </div>
          </section>
          <section className="sources" id="references">
            <h2>{t.sources}</h2>
            <p className="source-policy">{t.policy}</p>
            <ul>
              {guide.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.title} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
      <WikiFooter locale={locale === 'ja' ? undefined : locale} />
    </main>
  );
}
