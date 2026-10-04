import { ArticleToc } from '@/components/article-toc';
import { ArticleDiagnosisEntry } from '@/components/article-diagnosis-entry';
import { EditorialByline } from '@/components/editorial-byline';
import { editorialAuthor, editorialPublisher } from '@/lib/editorial-identity';
import { SaveArticle } from '@/components/save-article';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Ban,
  ExternalLink,
  Timer,
} from 'lucide-react';
import { PathCopy } from '@/components/path-copy';
import { SaveGame } from '@/components/save-game';
import { ogImageFor } from '@/lib/og-images';
import { InteractiveSteps } from '@/components/interactive-steps';
import { ShareButtons } from '@/components/share-buttons';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import {
  articleBySlug,
  articleCategoryLabel,
  type ContentStatus,
  type GameArticle,
} from '@/lib/game-articles';
import type { GameGuide } from '@/lib/games';
import { commonGuideCategoryFor } from '@/lib/common-guide-categories';
import { commonGuides } from '@/lib/common-guides';
import { troubleHubForArticle } from '@/lib/trouble-hubs';
import { pcLinksForGameArticle } from '@/lib/cross-links';
import { saveGuideByGame } from '@/lib/tool-guide-links';

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
  const matchedGuides =
    article.category === 'server'
      ? []
      : commonGuides.filter((guide) =>
          troubleHub?.guideSlugs.includes(guide.slug),
        );
  // Do not recommend unrelated launch fixes when this symptom has no common guide.
  const fallbackGuides = matchedGuides;
  const guideCategory = fallbackGuides[0]
    ? commonGuideCategoryFor(fallbackGuides[0])
    : undefined;
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
    author: editorialAuthor,
    publisher: editorialPublisher,
    citation: sources.map((source) => source.url),
    inLanguage: 'ja-JP',
    about: game.title,
    mainEntityOfPage: canonical,
    image: `https://gemnao.pages.dev${ogImageFor(`/games/${game.slug}/${article.slug}`)}`,
  };
  // Skip FAQ entries that only repeat the 結論 box above them.
  const faqs = (article.faqs || []).filter(
    (faq) => faq.answer.trim() !== article.conclusion.trim(),
  );
  const faqSchema = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null;
  return (
    <main>
      <WikiHeader pagePath={`/games/${game.slug}/${article.slug}`} />
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
            {articleCategoryLabel(article)}｜PC版トラブル解決
          </p>
          <h1>{article.title}</h1>
          <p className="article-lead">{article.symptom}</p>
          <div className="article-meta">
            <EditorialByline />
            <span>最終確認：{article.checkedAt.replaceAll('-', '.')}</span>
            <span>
              情報の状態：{contentStatusLabels[article.status || 'verified']}
            </span>
          </div>
          {article.targetVersion ? (
            <p className="target-version">対象：{article.targetVersion}</p>
          ) : null}
          <SaveGame slug={game.slug} />
          <SaveArticle
            path={`/games/${game.slug}/${article.slug}`}
            title={article.title}
          />
        </div>
      </header>
      <div className="article-layout issue-layout">
        <ArticleToc title={'症状から移動'} className="issue-toc">
          {article.symptoms.map((symptom) => (
            <a href={`#${symptom.target}`} key={symptom.label}>
              {symptom.label}
            </a>
          ))}
          {faqs.length ? <a href="#faq">よくある質問</a> : null}
          <a href="#references">参考情報</a>
        </ArticleToc>
        <article className="guide-article">
          <section className="answer-summary" aria-labelledby="answer-title">
            <p className="evidence-label">まずこれを試す</p>
            <h2 id="answer-title">
              <CheckCircle2 size={23} />
              結論
            </h2>
            <p>{article.conclusion}</p>
            {article.related.length ? (
              <a className="article-next-jump" href="#related-guides">
                症状が違う・まだ直らない場合の次の確認 →
              </a>
            ) : null}
            {saveGuideByGame[game.slug]?.slug === article.slug ? (
              <p>
                保存場所をコピーするなら、
                <a href={`/tools/save-locations#${game.slug}`}>
                  {game.shortTitle}のセーブ・設定ファイル一覧
                </a>
                へ。バックアップ・復元は、このページの対象と手順を確認してから進めてください。
              </p>
            ) : null}
          </section>
          {article.quickFacts?.length ? (
            <section
              className="quick-facts"
              aria-labelledby="quick-facts-title"
            >
              <h2 id="quick-facts-title">
                <Timer size={21} />
                30秒でわかる要点
              </h2>
              <dl>
                {article.quickFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>
                      {fact.copy ? <code>{fact.value}</code> : fact.value}
                      {fact.copy ? <PathCopy value={fact.value} /> : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          {article.diagnosis?.length ? (
            <section
              className="diagnosis-table"
              aria-labelledby="diagnosis-title"
            >
              <h2 id="diagnosis-title">症状別の早見表</h2>
              <p>当てはまる症状から、試すSTEPへ移動できます。</p>
              <table>
                <thead>
                  <tr>
                    <th scope="col">症状</th>
                    <th scope="col">考えられる原因</th>
                    <th scope="col">試す手順</th>
                  </tr>
                </thead>
                <tbody>
                  {article.diagnosis.map((row) => {
                    const index = article.steps.findIndex(
                      (step) => step.id === row.stepId,
                    );
                    return (
                      <tr key={row.symptom}>
                        <td data-label="症状">{row.symptom}</td>
                        <td data-label="原因">{row.cause}</td>
                        <td data-label="手順">
                          {index >= 0 ? (
                            <a href={`#${row.stepId}`}>
                              STEP {index + 1}：{article.steps[index].title}
                            </a>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ) : null}
          {article.description ? (
            <p className="article-introduction">{article.description}</p>
          ) : null}
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
          {article.avoid?.length ? (
            <section className="avoid-block" aria-labelledby="avoid-title">
              <h2 id="avoid-title">
                <Ban size={22} />
                やってはいけないこと
              </h2>
              <ul>
                {article.avoid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}
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
          {faqs.length ? (
            <section className="faq-section" id="faq">
              <h2>よくある質問</h2>
              <div>
                {faqs.map((faq) => (
                  <details key={faq.question}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
          <ArticleDiagnosisEntry path={`/games/${game.slug}/${article.slug}`} />
          {article.related.length ? (
            <section className="related-section" id="related-guides">
              <h2>別の症状がある場合</h2>
              <p>
                起動・画面など、今起きている症状に当てはまる記事を選んでください。
              </p>
              <div>
                {article.related.map((slug) => {
                  const related = articleBySlug(game.slug, slug);
                  return related ? (
                    <a
                      data-related="true"
                      href={`/games/${game.slug}/${related.slug}`}
                      key={slug}
                    >
                      <span>{articleCategoryLabel(related)}</span>
                      {related.shortTitle}
                      <ArrowRight size={15} />
                    </a>
                  ) : null;
                })}
              </div>
            </section>
          ) : null}
          {pcLinksForGameArticle(article).length ? (
            <section className="related-section">
              <h2>
                {article.category === 'server'
                  ? 'ほかのサイトもつながらない場合'
                  : 'Windows側の原因も確認する'}
              </h2>
              <div>
                {pcLinksForGameArticle(article).map((link) => (
                  <a data-related="true" href={link.href} key={link.href}>
                    <span>PC・Windows</span>
                    {link.label}
                    <ArrowRight size={15} />
                  </a>
                ))}
              </div>
            </section>
          ) : null}
          <section className="common-guides">
            <h2>
              {fallbackGuides.length
                ? 'PC共通の原因も切り分ける'
                : '別の症状・対処法を探す'}
            </h2>
            {article.category === 'server' ? (
              <a href="/status" data-related="true">
                公式の障害・メンテナンス情報を確認 <ArrowRight size={15} />
              </a>
            ) : null}
            {fallbackGuides.slice(0, 3).map((guide) => (
              <a
                data-related="true"
                href={`/guide/${guide.slug}`}
                key={guide.slug}
              >
                {guide.shortTitle}
                <ArrowRight size={15} />
              </a>
            ))}
            {guideCategory ? (
              <a href={`/guide#${guideCategory.id}`} data-related="true">
                {guideCategory
                  ? `${guideCategory.label}の共通ガイドを見る`
                  : '共通ガイドをすべて見る'}{' '}
                <ArrowRight size={15} />
              </a>
            ) : null}
            <a data-related="true" href={`/games/${game.slug}`}>
              {game.shortTitle}の総合トラブルまとめ <ArrowRight size={15} />
            </a>
          </section>
          <ShareButtons
            title={article.title}
            path={`/games/${game.slug}/${article.slug}`}
            hashtag={game.title.split('/')[0].trim()}
          />
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
