import { EditorialByline } from '@/components/editorial-byline';
import { editorialAuthor, editorialPublisher } from '@/lib/editorial-identity';
import { SaveArticle } from '@/components/save-article';
import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { ShareButtons } from '@/components/share-buttons';
import { ogImageFor } from '@/lib/og-images';
import { KeyIllustration } from '@/components/key-illustration';
import {
  keyCheatSheetFor,
  keyImagesFor,
  keyVisualFor,
} from '@/lib/key-visuals';
import { pcArticleBySlug, pcArticles } from '@/lib/pc-articles';
import { gameLinksForPcArticle } from '@/lib/cross-links';
import { TroubleshootingProduct } from '@/components/troubleshooting-product';

export function generateStaticParams() {
  return pcArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = pcArticleBySlug(slug);
  if (!article) return {};
  const path = `/pc/${slug}`;
  const image = ogImageFor(path);
  return {
    title: article.seoTitle,
    description: article.description,
    alternates: { canonical: path },
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

export default async function PcArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = pcArticleBySlug(slug);
  if (!article) notFound();
  const canonical = `https://gemnao.pages.dev/pc/${slug}`;
  const jsonLd: Record<string, unknown>[] = [
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
          name: 'PC・Windowsの不具合',
          item: 'https://gemnao.pages.dev/pc',
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
      '@type': 'TechArticle',
      headline: article.title,
      description: article.description,
      dateModified: article.checkedAt,
      inLanguage: 'ja-JP',
      author: editorialAuthor,
      publisher: editorialPublisher,
      citation: article.sources.map((source) => source.url),
      about: 'Windows 11',
      ...(article.evidenceSummary
        ? {
            hasPart: {
              '@type': 'WebPageElement',
              name: article.evidenceSummary.title,
              url: `${canonical}#signs`,
            },
          }
        : {}),
      mainEntityOfPage: canonical,
      image: [
        ...keyImagesFor(`/pc/${slug}`),
        ogImageFor(`/pc/${slug}`).split('?')[0],
      ].map((src) => `https://gemnao.pages.dev${src}`),
    },
  ];
  if (
    [
      'pc-hacked-signs',
      'pc-broken',
      'bluetooth-option-missing',
      'windows-update-stuck',
      'disk-usage-100',
    ].includes(slug)
  ) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }
  return (
    <main>
      <WikiHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="article-hero issue-hero pc-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="パンくず">
            <a href="/">ゲムなお</a>
            <span>›</span>
            <a href="/pc">PC・Windowsの不具合</a>
            <span>›</span>
            <b>{article.shortTitle}</b>
          </nav>
          <p className="article-label">PC・Windowsの不具合｜Windows 11</p>
          <h1>{article.title}</h1>
          <p className="article-lead">{article.lead}</p>
          <div className="article-meta">
            <span>
              公式情報の確認：{article.checkedAt.replaceAll('-', '.')}
            </span>
            <span>対象：Windows 11</span>
            <EditorialByline />
          </div>
          <SaveArticle path={`/pc/${article.slug}`} title={article.title} />
        </div>
      </header>
      <div className="article-layout issue-layout">
        <aside className="toc issue-toc">
          <strong>このページの内容</strong>
          <a href="#answer">先に結論</a>
          {article.shortcutRows && (
            <a href="#shortcut-list">ショートカット早見表</a>
          )}
          {article.evidenceSummary && (
            <a href="#signs">
              {article.evidenceSummary.tocLabel ?? '乗っ取りを疑う兆候'}
            </a>
          )}
          <a href="#diagnosis">症状別の判断表</a>
          {article.steps.map((step, i) => (
            <a href={`#step-${i + 1}`} key={step.title}>
              {i + 1}. {step.title}
            </a>
          ))}
          <a href="#escalation">直らない場合</a>
          <a href="#references">公式出典</a>
        </aside>
        <article className="guide-article pc-guide">
          <section className="answer-summary" id="answer">
            <p className="evidence-label">最初に確かめる</p>
            <h2>
              <CheckCircle2 size={23} /> 結論
            </h2>
            <p>{article.answer}</p>
            {slug === 'refresh-rate-stuck-60hz' ? (
              <p>
                変更前後を比べるには
                <a href="/tools/refresh-rate">Hz確認ツール</a>を使えます。
                まずWindowsの現在値とツールの目安を控え、下の症状に合う手順を1つ試し、
                <a href="/tools/refresh-rate#retest">同じモニターで再確認</a>
                してください。
                ツールの数値だけで設定の成否を決めず、Windowsの表示とゲームのFPSも分けて確認します。
              </p>
            ) : null}
            <ol>
              {article.quickChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ol>
            <KeyIllustration visual={keyCheatSheetFor(`/pc/${slug}`)} eager />
          </section>
          {article.evidenceSummary && (
            <section
              className="guide-section"
              id="signs"
              aria-labelledby="signs-title"
            >
              <h2 id="signs-title">{article.evidenceSummary.title}</h2>
              <p>{article.evidenceSummary.intro}</p>
              <ol>
                {article.evidenceSummary.items.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}：</strong>
                    {item.explanation}
                  </li>
                ))}
              </ol>
              <p>{article.evidenceSummary.limitation}</p>
              <p className="source-note">判断の根拠となる公式資料：</p>
              <ul>
                {article.evidenceSummary.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {article.shortcutRows && (
            <section className="diagnosis-table" id="shortcut-list">
              <h2>ゲーム中に使うショートカットキー早見表</h2>
              <p>
                画面が反応するかを先に確認し、当てはまる行のキーを1回押してください。キーが効く条件と、次に確認する手順も併記しています。
              </p>
              <table>
                <thead>
                  <tr>
                    <th scope="col">困っている場面</th>
                    <th scope="col">押すキー</th>
                    <th scope="col">起きること・使える条件</th>
                    <th scope="col">詳しい手順</th>
                  </tr>
                </thead>
                <tbody>
                  {article.shortcutRows.map((row) => (
                    <tr key={row.keys}>
                      <td data-label="場面">{row.situation}</td>
                      <td data-label="キー">
                        <strong>{row.keys}</strong>
                      </td>
                      <td data-label="動作と条件">
                        {row.effect}。{row.condition}
                      </td>
                      <td data-label="手順">
                        <a href={`#step-${row.step}`}>STEP {row.step}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          <section className="diagnosis-table" id="diagnosis">
            <h2>症状別の判断表</h2>
            <p>
              今の症状に近い行から始めてください。1回に変える設定は1つだけにすると、何が効いたか分かります。
            </p>
            <table>
              <thead>
                <tr>
                  <th scope="col">起きていること</th>
                  <th scope="col">比べる結果</th>
                  <th scope="col">進む先</th>
                </tr>
              </thead>
              <tbody>
                {article.diagnosis.map((row) => (
                  <tr key={row.symptom}>
                    <td data-label="症状">{row.symptom}</td>
                    <td data-label="比較">{row.check}</td>
                    <td data-label="手順">
                      <a href={`#step-${row.next}`}>STEP {row.next}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="pc-steps" aria-label="確認と対処の手順">
            <h2>画面を見ながら順番に確認する</h2>
            {article.steps.map((step, i) => (
              <section
                className="pc-step"
                id={`step-${i + 1}`}
                key={step.title}
              >
                <h3>
                  STEP {i + 1}｜{step.title}
                </h3>
                <KeyIllustration visual={keyVisualFor(`/pc/${slug}`, i + 1)} />
                <ol>
                  {step.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ol>
                {step.resultRows && (
                  <div className="diagnosis-table pc-result-guide">
                    <h4>表示された結果と次の行動</h4>
                    <table>
                      <thead>
                        <tr>
                          <th scope="col">表示された状態</th>
                          <th scope="col">分かること</th>
                          <th scope="col">次の行動</th>
                        </tr>
                      </thead>
                      <tbody>
                        {step.resultRows.map((row) => (
                          <tr key={row.state}>
                            <td data-label="状態">{row.state}</td>
                            <td data-label="判断">{row.meaning}</td>
                            <td data-label="次の行動">{row.next}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <dl className="pc-step-results">
                  <div>
                    <dt>正常な結果・分かったこと</dt>
                    <dd>{step.expected}</dd>
                  </div>
                  <div>
                    <dt>変わらない・異常な場合</dt>
                    <dd>{step.unexpected}</dd>
                  </div>
                  <div>
                    <dt>元に戻す方法</dt>
                    <dd>{step.revert}</dd>
                  </div>
                </dl>
                <TroubleshootingProduct
                  articlePath={`/pc/${slug}`}
                  step={i + 1}
                />
              </section>
            ))}
          </section>
          <section className="caution-block" id="escalation">
            <h2>改善しなかった場合</h2>
            <p>{article.escalation}</p>
          </section>
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
          <section className="related-section">
            <h2>症状が違う場合の関連記事</h2>
            <div>
              {article.related.map((link) => (
                <a href={link.href} key={link.href}>
                  <span>症状から探す</span>
                  {link.label}
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          </section>
          {gameLinksForPcArticle(slug).length ? (
            <section className="related-section">
              <h2>PCゲームで困っている場合</h2>
              <div>
                {gameLinksForPcArticle(slug).map((link) => (
                  <a href={link.href} key={link.href}>
                    <span>PCゲーム</span>
                    {link.label}
                    <ArrowRight size={15} />
                  </a>
                ))}
              </div>
            </section>
          ) : null}
          <ShareButtons
            title={article.title}
            path={`/pc/${slug}`}
            hashtag="Windows11"
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
              Microsoftの公開手順を確認し、判断表と比較方法はゲムなおで整理しました。機器固有の症状は各製造元の案内も確認してください。記載した正常・異常の例は切り分けの目安であり、全機器の実機検証結果ではありません。
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
