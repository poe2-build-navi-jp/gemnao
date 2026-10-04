import { ArticleToc } from '@/components/article-toc';
import { hasTranslation, languageAlternates } from '@/lib/localized/index';
import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { ShareButtons } from '@/components/share-buttons';
import { ogImageFor } from '@/lib/og-images';
import { AffiliateLink } from '@/components/affiliate-link';
import type { AffiliatePosition } from '@/lib/affiliate-analytics';
import { gearArticleBySlug, gearArticles } from '@/lib/gear-articles';
import { gearGuideBySlug, gearGuides } from '@/lib/gear-guides';
import { GearBuyerGuide } from '@/components/gear-buyer-guide';

export function generateStaticParams() {
  return [...gearArticles, ...gearGuides].map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = gearArticleBySlug(slug) ?? gearGuideBySlug(slug);
  if (!article) return {};
  const path = `/gear/${slug}`;
  const image = ogImageFor(path);
  return {
    title: article.seoTitle,
    description: article.description,
    alternates: { canonical: path, ...(hasTranslation('en', path) ? { languages: languageAlternates(path) } : {}) },
    openGraph: {
      type: 'article',
      locale: 'ja_JP',
      title: article.seoTitle,
      description: article.description,
      url: path,
      modifiedTime: article.checkedAt,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle,
      description: article.description,
      images: [image],
    },
  };
}

// 広告（PR）であることが分かる形でAmazonへのリンクを表示する
function AmazonBox({
  name,
  asin,
  articlePath,
  position,
}: {
  name: string;
  asin: string;
  articlePath: string;
  position: AffiliatePosition;
}) {
  return (
    <aside className="affiliate-box" aria-label="広告">
      <span className="affiliate-label">PR</span>
      <p>
        <strong>{name}</strong>
        価格・在庫は販売ページで確認してください。
      </p>
      <AffiliateLink
        className="affiliate-button"
        asin={asin}
        articlePath={articlePath}
        position={position}
      >
        Amazonで見る
        <ExternalLink size={15} />
      </AffiliateLink>
      <small>
        Amazonのアソシエイトとして、ゲムなおは適格販売により収入を得ています。
      </small>
    </aside>
  );
}

export default async function GearArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = gearGuideBySlug(slug);
  if (guide) return <GearBuyerGuide guide={guide} />;
  const article = gearArticleBySlug(slug);
  if (!article) notFound();
  const canonical = `https://gemnao.pages.dev/gear/${slug}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'ゲムなお',
          item: 'https://gemnao.pages.dev/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'ゲーマー向けデバイス',
          item: 'https://gemnao.pages.dev/gear',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.shortTitle,
          item: canonical,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      dateModified: article.checkedAt,
      inLanguage: 'ja-JP',
      author: { '@type': 'Organization', name: 'ゲムなお編集部' },
      about: article.product.name,
      mainEntityOfPage: canonical,
      image: [
        `https://gemnao.pages.dev${ogImageFor(`/gear/${slug}`).split('?')[0]}`,
      ],
    },
  ];
  return (
    <main>
      <WikiHeader pagePath={`/gear/${slug}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="article-hero issue-hero pc-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="パンくず">
            <a href="/">ゲムなお</a>
            <span>›</span>
            <a href="/gear">ゲーマー向けデバイス</a>
            <span>›</span>
            <b>{article.shortTitle}</b>
          </nav>
          <p className="article-label">
            ゲーマー向けデバイス｜{article.product.maker}
          </p>
          <h1>{article.title}</h1>
          <p className="article-lead">{article.lead}</p>
          <div className="article-meta">
            <span>
              公式情報の確認：{article.checkedAt.replaceAll('-', '.')}
            </span>
            <span>このページには広告（PR）を含みます</span>
          </div>
        </div>
      </header>
      <div className="article-layout issue-layout">
        <ArticleToc title={'このページの内容'} className="issue-toc">
          <a href="#answer">先に結論</a>
          <a href="#fit">向いている人・向いていない人</a>
          <a href="#specs">主な仕様</a>
          <a href="#features">できること</a>
          <a href="#before-buying">買う前の確認</a>
          {article.compare && <a href="#compare">小さいモデルとの違い</a>}
          <a href="#references">公式出典</a>
        </ArticleToc>
        <article className="guide-article pc-guide">
          <section className="answer-summary" id="answer">
            <p className="evidence-label">最初に確かめる</p>
            <h2>
              <CheckCircle2 size={23} /> 結論
            </h2>
            <p>{article.answer}</p>
          </section>
          <section className="diagnosis-table" id="fit">
            <h2>向いている人・向いていない人</h2>
            <table>
              <thead>
                <tr>
                  <th scope="col">向いている人</th>
                  <th scope="col">ほかを検討したい人</th>
                </tr>
              </thead>
              <tbody>
                {article.fits.map((fit, i) => (
                  <tr key={fit}>
                    <td data-label="向いている">{fit}</td>
                    <td data-label="ほかを検討">{article.notFits[i] ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="diagnosis-table spec-table" id="specs">
            <h2>主な仕様</h2>
            <table>
              <tbody>
                {article.specs.map((spec) => (
                  <tr key={spec.label}>
                    <th scope="row">{spec.label}</th>
                    <td>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="pc-steps" id="features">
            <h2>できること</h2>
            {article.features.map((feature, i) => (
              <section className="pc-step" key={feature.title}>
                <h3>
                  {i + 1}｜{feature.title}
                </h3>
                <p>{feature.body}</p>
              </section>
            ))}
          </section>
          <section className="caution-block" id="before-buying">
            <h2>買う前に確認したいこと</h2>
            <ul>
              {article.beforeBuying.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          {article.compare && (
            <section className="diagnosis-table spec-table" id="compare">
              <h2>小さいモデルとの違い</h2>
              <p>{article.compare.caption}</p>
              <table>
                <thead>
                  <tr>
                    {article.compare.headers.map((h) => (
                      <th scope="col" key={h}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {article.compare.rows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) =>
                        i === 0 ? (
                          <th scope="row" key={cell}>
                            {cell}
                          </th>
                        ) : (
                          <td key={`${row[0]}-${i}`}>{cell}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          <AmazonBox
            name={article.product.name}
            asin={article.product.asin}
            articlePath={`/gear/${slug}`}
            position="after-fit-check"
          />
          {article.notice && (
            <section className="answer-summary">
              <p className="evidence-label">実物を触れる機会</p>
              <p>{article.notice}</p>
            </section>
          )}
          <section className="faq-section" id="faq">
            <h2>よくある質問</h2>
            <div>
              {article.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <AmazonBox
            name={article.product.name}
            asin={article.product.asin}
            articlePath={`/gear/${slug}`}
            position="after-faq"
          />
          <section className="related-section">
            <h2>関連記事</h2>
            <div>
              {article.related.map((link) => (
                <a href={link.href} key={link.href}>
                  <span>PC・ゲーム設定</span>
                  {link.label}
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          </section>
          <ShareButtons
            title={article.title}
            path={`/gear/${slug}`}
            hashtag="ゲムなお"
          />
          <p className="correction-link">
            記載内容の誤りは
            <a href={`/contact?url=${encodeURIComponent(canonical)}`}>
              こちらからお知らせください
            </a>
            。
          </p>
          <section className="sources" id="references">
            <h2>参考情報・公式出典</h2>
            <p className="source-policy">
              仕様はメーカー公式ページで確認し、ゲムなおで整理しました。価格は販売店や時期で変わるため記載していません。実機での検証結果ではありません。
            </p>
            {article.sources.map((source) => (
              <a
                href={source.url}
                key={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {source.title}
                <ExternalLink size={15} />
              </a>
            ))}
          </section>
        </article>
      </div>
      <WikiFooter />
    </main>
  );
}
