import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { ShareButtons } from '@/components/share-buttons';
import { ogImageFor } from '@/lib/og-images';
import { pcArticleBySlug, pcArticles } from '@/lib/pc-articles';

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
      author: { '@type': 'Organization', name: 'ゲムなお編集部' },
      about: 'Windows 11',
      mainEntityOfPage: canonical,
      image: `https://gemnao.pages.dev${ogImageFor(`/pc/${slug}`).split('?')[0]}`,
    },
  ];
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
          </div>
        </div>
      </header>
      <div className="article-layout issue-layout">
        <aside className="toc issue-toc">
          <strong>このページの内容</strong>
          <a href="#answer">先に結論</a>
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
            <ol>
              {article.quickChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ol>
          </section>
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
