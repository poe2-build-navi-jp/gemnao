import { ArticleToc } from '@/components/article-toc';
import { SaveArticle } from '@/components/save-article';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { ShareButtons } from '@/components/share-buttons';
import { AffiliateLink } from '@/components/affiliate-link';
import { ogImageFor } from '@/lib/og-images';
import type { GearGuide } from '@/lib/gear-guides';

export function GearBuyerGuide({ guide }: { guide: GearGuide }) {
  const path = `/gear/${guide.slug}`;
  const canonical = `https://gemnao.pages.dev${path}`;
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
          name: guide.shortTitle,
          item: canonical,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.description,
      dateModified: guide.checkedAt,
      inLanguage: 'ja-JP',
      author: { '@type': 'Organization', name: 'ゲムなお編集部' },
      about: guide.shortTitle,
      mainEntityOfPage: canonical,
      image: [`https://gemnao.pages.dev${ogImageFor(path).split('?')[0]}`],
    },
  ];
  return (
    <main>
      <WikiHeader pagePath={path} />
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
            <b>{guide.shortTitle}</b>
          </nav>
          <p className="article-label">
            ゲーマー向けデバイス｜買う前の判断ガイド
          </p>
          <h1>{guide.title}</h1>
          <p className="article-lead">{guide.lead}</p>
          <div className="article-meta">
            <span>公式情報の確認：{guide.checkedAt.replaceAll('-', '.')}</span>
            {guide.example && <span>このページには広告（PR）を含みます</span>}
          </div>
          <SaveArticle path={path} title={guide.title} />
        </div>
      </header>
      <div className="article-layout issue-layout">
        <ArticleToc title={'このページの内容'} className="issue-toc">
          <a href="#answer">先に結論</a>
          <a href="#before-buying">買わずに済むか確認</a>
          <a href="#compare">選び方を比較</a>
          {guide.sections.map((section) => (
            <a href={`#${section.id}`} key={section.id}>
              {section.title}
            </a>
          ))}
          {guide.example && (
            <a href="#product-example">条件に合う場合の製品例</a>
          )}
          <a href="#setup">{guide.setupTitle ?? '接続後の確認'}</a>
          <a href="#references">公式出典</a>
        </ArticleToc>
        <article className="guide-article pc-guide">
          <section className="answer-summary" id="answer">
            <p className="evidence-label">買う前に切り分ける</p>
            <h2>
              <CheckCircle2 size={23} /> 結論
            </h2>
            <p>{guide.answer}</p>
          </section>
          <section className="caution-block" id="before-buying">
            <h2>まず買わずに済むか確認する</h2>
            <ul>
              {guide.beforeBuying.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="diagnosis-table" id="compare">
            <h2>
              {guide.compareTitle ??
                '内蔵マイク・USB別マイク・ヘッドセットを比較'}
            </h2>
            <p>
              順位や性能の採点ではなく、困っていることと使い方で選ぶ目安です。
            </p>
            <table>
              <thead>
                <tr>
                  {guide.compare.headers.map((header) => (
                    <th scope="col" key={header}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.compare.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) =>
                      index === 0 ? (
                        <th scope="row" key={index}>
                          {cell}
                        </th>
                      ) : (
                        <td
                          data-label={guide.compare.headers[index]}
                          key={index}
                        >
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
          {guide.example && (
            <section className="pc-step" id="product-example">
              <h2>{guide.example.title}</h2>
              <p>{guide.example.introduction}</p>
              <h3>候補になる条件</h3>
              <ul>
                {guide.example.fits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="diagnosis-table spec-table">
                <table>
                  <caption>メーカー公式仕様から確認した項目</caption>
                  <tbody>
                    {guide.example.specs.map((spec) => (
                      <tr key={spec.label}>
                        <th scope="row">{spec.label}</th>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3>合わない場合・購入前の注意</h3>
              <ul>
                {guide.example.cautions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                実機テスト・録音比較に基づく推奨ではありません。公式仕様をもとにした条件付きの一例です。
              </p>
              <aside
                className="affiliate-box"
                aria-label="広告・条件に合う場合だけ検討する製品"
              >
                <span className="affiliate-label">PR・広告</span>
                <p>
                  上の条件に合い、手持ちのマイクでは足りない場合だけ検討してください。購入前に型番・対応環境・価格・在庫を販売ページで確認してください。
                </p>
                <AffiliateLink
                  asin={guide.example.asin}
                  articlePath={path}
                  position="after-fit-check"
                  className="affiliate-button"
                >
                  Amazonで400-MC017の詳細を確認する <ExternalLink size={15} />
                </AffiliateLink>
                <small>
                  Amazonのアソシエイトとして、ゲムなおは適格販売により収入を得ています。
                </small>
              </aside>
            </section>
          )}
          <section className="pc-step" id="setup">
            <h2>{guide.setupTitle ?? '接続後は入力・出力を分けて確認する'}</h2>
            <ol>
              {guide.setup.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
          <section className="faq-section" id="faq">
            <h2>よくある質問</h2>
            <div>
              {guide.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="related-section">
            <h2>設定から確認したい場合</h2>
            <div>
              {guide.related.map((link) => (
                <a href={link.href} key={link.href}>
                  <span>関連する手順・ツール</span>
                  {link.label}
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          </section>
          <ShareButtons title={guide.title} path={path} hashtag="PCゲーム" />
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
              公式情報を確認し、選び方は編集部で整理しました。実機による比較評価・ランキングではありません。価格・在庫は変動するため記載していません。
            </p>
            {guide.sources.map((source) => (
              <a
                href={source.url}
                key={source.url}
                target="_blank"
                rel="noopener noreferrer"
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
