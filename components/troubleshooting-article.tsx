/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { InteractiveSteps } from '@/components/interactive-steps';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import {
  articleBySlug,
  categoryLabels,
  type ContentStatus,
  type GameArticle,
} from '@/lib/game-articles';
import type { GameGuide } from '@/lib/games';
import { commonGuideCategoryFor } from '@/lib/common-guide-categories';
import { commonGuides } from '@/lib/common-guides';
import { troubleHubForArticle } from '@/lib/trouble-hubs';

const contentStatusLabels: Record<ContentStatus, string> = {
  verified: '確認済み',
  'needs-review': '再確認が必要',
  draft: '下書き',
  thin: '内容確認中',
};

export function TroubleshootingArticle({
  game,
  article,
}: {
  game: GameGuide;
  article: GameArticle;
}) {
  const canonical = `https://gemnao.pages.dev/games/${game.slug}/${article.slug}`;
  const feedbackTopic =
    article.category === 'settings'
      ? 'display'
      : article.category === 'server'
        ? 'launch'
        : article.category === 'specs'
          ? 'specs'
          : article.category;
  const sources = [...(article.sources || []), ...game.sources].filter(
    (source, index, all) =>
      all.findIndex((item) => item.url === source.url) === index,
  );
  const troubleHub = troubleHubForArticle(article);
  const matchedGuides = commonGuides.filter((guide) =>
    troubleHub?.guideSlugs.includes(guide.slug),
  );
  const fallbackGuides = matchedGuides.length
    ? matchedGuides
    : commonGuides.slice(0, 3);
  const guideCategory = commonGuideCategoryFor(fallbackGuides[0]);
  const breadcrumbSchema = {
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
        name: game.title,
        item: `https://gemnao.pages.dev/games/${game.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.shortTitle,
        item: canonical,
      },
    ],
  };
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.metaDescription,
    dateModified: article.checkedAt,
    author: { '@type': 'Organization', name: 'ゲムなお編集部' },
    inLanguage: 'ja-JP',
    about: game.title,
    mainEntityOfPage: canonical,
  };
  const faqSchema = article.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null;
  return (
    <main>
      <WikiHeader pagePath={`/games/${game.slug}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            [breadcrumbSchema, articleSchema, faqSchema].filter(Boolean),
          ),
        }}
      />
      <header
        className="article-hero issue-hero"
        style={{ '--game-accent': game.accent } as React.CSSProperties}
      >
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="パンくず">
            <a href="/">ゲムなお</a>
            <span>›</span>
            <a href={`/games/${game.slug}`}>{game.shortTitle}</a>
            <span>›</span>
            <b>{article.shortTitle}</b>
          </nav>
          <p className="article-label">
            {categoryLabels[article.category]}｜PC版トラブル解決
          </p>
          <h1>{article.title}</h1>
          <p className="article-lead">{article.symptom}</p>
          <div className="article-meta">
            <span>最終確認：{article.checkedAt.replaceAll('-', '.')}</span>
            <span>
              情報の状態：{contentStatusLabels[article.status || 'verified']}
            </span>
          </div>
          {article.targetVersion ? (
            <p className="target-version">対象：{article.targetVersion}</p>
          ) : null}
        </div>
      </header>
      <div className="article-layout issue-layout">
        <aside className="toc issue-toc">
          <strong>症状から移動</strong>
          {article.symptoms.map((symptom) => (
            <a href={`#${symptom.target}`} key={symptom.label}>
              {symptom.label}
            </a>
          ))}
          {article.faqs?.length ? <a href="#faq">よくある質問</a> : null}
          <a href="#references">参考情報</a>
        </aside>
        <article className="guide-article">
          <section className="answer-summary" aria-labelledby="answer-title">
            <p className="evidence-label">まずこれを試す</p>
            <h2 id="answer-title">
              <CheckCircle2 size={23} />
              結論
            </h2>
            <p>{article.conclusion}</p>
          </section>
          <nav className="symptom-nav" aria-label="症状別ナビゲーション">
            <strong>当てはまる症状</strong>
            <div>
              {article.symptoms.map((symptom) => (
                <a href={`#${symptom.target}`} key={symptom.label}>
                  {symptom.label}
                  <ArrowRight size={14} />
                </a>
              ))}
            </div>
          </nav>
          <p className="article-introduction">{article.description}</p>
          <nav className="article-parent-links" aria-label="この記事の分類">
            <a href={`/games/${game.slug}`}>{game.shortTitle}のトラブル一覧</a>
            {troubleHub ? (
              <a href={`/trouble/${troubleHub.slug}`}>
                {troubleHub.label}の症状別ガイド
              </a>
            ) : null}
          </nav>
          {article.causes?.length ? (
            <section className="cause-block" aria-labelledby="cause-title">
              <h2 id="cause-title">原因候補</h2>
              <ul>
                {article.causes.map((cause) => (
                  <li key={cause}>{cause}</li>
                ))}
              </ul>
            </section>
          ) : null}
          <InteractiveSteps
            contextSlug={`game-${game.slug}-${article.slug}`}
            topic={feedbackTopic}
            articleTitle={article.title}
            articlePath={`/games/${game.slug}/${article.slug}`}
            shareHashtag={game.title.split('/')[0].trim()}
            steps={article.steps}
            nextLinks={[
              ...article.related
                .map((slug) => articleBySlug(game.slug, slug))
                .filter((item): item is NonNullable<typeof item> =>
                  Boolean(item),
                )
                .map((item) => ({
                  href: `/games/${game.slug}/${item.slug}`,
                  label: item.shortTitle,
                })),
              ...matchedGuides.map((guide) => ({
                href: `/guide/${guide.slug}`,
                label: `${guide.shortTitle}（PC共通）`,
              })),
              ...(troubleHub
                ? [
                    {
                      href: `/trouble/${troubleHub.slug}`,
                      label: `${troubleHub.label}の共通対処を見る`,
                    },
                  ]
                : []),
              {
                href: `/games/${game.slug}`,
                label: `${game.shortTitle}のトラブル一覧へ戻る`,
              },
            ]}
          />
          <section className="caution-block">
            <h2>
              <AlertTriangle size={22} />
              注意
            </h2>
            <ul>
              {article.cautions.map((caution) => (
                <li key={caution}>{caution}</li>
              ))}
            </ul>
          </section>
          {article.faqs?.length ? (
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
          ) : null}
          <section className="related-section">
            <h2>まだ直りませんか？ 次に試す記事</h2>
            <div>
              {article.related.map((slug) => {
                const related = articleBySlug(game.slug, slug);
                return related ? (
                  <a href={`/games/${game.slug}/${related.slug}`} key={slug}>
                    <span>{categoryLabels[related.category]}</span>
                    {related.shortTitle}
                    <ArrowRight size={15} />
                  </a>
                ) : null;
              })}
            </div>
          </section>
          <section className="common-guides">
            <h2>PCゲーム共通の解決方法</h2>
            {fallbackGuides.slice(0, 3).map((guide) => (
              <a href={`/guide/${guide.slug}`} key={guide.slug}>
                {guide.shortTitle}
                <ArrowRight size={15} />
              </a>
            ))}
            <a href={guideCategory ? `/guide#${guideCategory.id}` : '/guide'}>
              {guideCategory
                ? `${guideCategory.label}の共通ガイドを見る`
                : '共通ガイドをすべて見る'}{' '}
              <ArrowRight size={15} />
            </a>
            <a href={`/games/${game.slug}`}>
              {game.shortTitle}の総合トラブルまとめ <ArrowRight size={15} />
            </a>
          </section>
          <p className="correction-link">
            この記事の情報に問題がありますか？{' '}
            <a href={`/contact?url=${encodeURIComponent(canonical)}`}>
              誤りを報告する
            </a>
          </p>
          <section className="sources" id="references">
            <h2>参考情報・出典</h2>
            <p className="source-policy">
              外部資料を確認し、本文はゲムなお独自の表現で要約しています。ゲームやドライバーの更新後は、リンク先の最新情報も確認してください。
            </p>
            {sources.map((source) => (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                key={source.url}
              >
                {source.label}
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
