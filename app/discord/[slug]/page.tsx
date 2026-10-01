import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { InteractiveSteps } from '@/components/interactive-steps';
import { ShareButtons } from '@/components/share-buttons';
import { SolutionIllustration } from '@/components/solution-illustration';
import { discordArticleVisualBySlug } from '@/lib/visual-guides';
import {
  discordArticleBySlug,
  discordArticles,
  discordCategoryLabels,
  type DiscordCategory,
} from '@/lib/discord-articles';
import { ogImageFor } from '@/lib/og-images';
import {
  DiscordBotComparison,
  DiscordBotRecommendations,
} from '@/components/discord-bot-recommendations';

const feedbackTopic: Record<
  DiscordCategory,
  'discord-launch' | 'discord-audio' | 'discord-connection' | 'discord-screen'
> = {
  launch: 'discord-launch',
  audio: 'discord-audio',
  connection: 'discord-connection',
  screen: 'discord-screen',
  game: 'discord-launch',
  bot: 'discord-launch',
};

export function generateStaticParams() {
  return discordArticles
    .filter(({ status }) => status === 'verified')
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = discordArticleBySlug(slug);
  const visual = discordArticleVisualBySlug(slug);
  if (!item) return {};
  const canonical = `/discord/${slug}`;
  return {
    title: item.seoTitle,
    description: item.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: item.seoTitle,
      description: item.metaDescription,
      url: canonical,
      locale: 'ja_JP',
      modifiedTime: item.checkedAt,
      images: [visual?.ogImage || ogImageFor(`/discord/${slug}`)],
    },
    twitter: {
      card: 'summary_large_image',
      title: item.seoTitle,
      description: item.metaDescription,
      images: [visual?.ogImage || ogImageFor(`/discord/${slug}`)],
    },
  };
}

export default async function DiscordArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = discordArticleBySlug(slug);
  if (!item) notFound();
  if (item.status === 'draft' || item.status === 'thin') notFound();
  const visual = discordArticleVisualBySlug(slug);
  const canonical = `https://gemnao.pages.dev/discord/${item.slug}`;
  const relatedItems = item.related
    .map((s) => discordArticleBySlug(s))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
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
        name: 'Discord',
        item: 'https://gemnao.pages.dev/discord',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: discordCategoryLabels[item.category],
        item: `https://gemnao.pages.dev/discord#${item.category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: item.shortTitle,
        item: canonical,
      },
    ],
  };
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: item.title,
    description: item.metaDescription,
    dateModified: item.checkedAt,
    author: { '@type': 'Organization', name: 'ゲムなお編集部' },
    ...(item.botRecommendations
      ? { publisher: { '@id': 'https://gemnao.pages.dev/#operator' } }
      : {}),
    inLanguage: 'ja-JP',
    about: 'Discord',
    mainEntityOfPage: canonical,
    image: `https://gemnao.pages.dev${visual?.image || ogImageFor(`/discord/${item.slug}`)}`,
  };
  const faqSchema = item.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: item.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null;
  return (
    <main>
      <WikiHeader pagePath="/discord" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            [breadcrumbSchema, articleSchema, faqSchema].filter(Boolean),
          ),
        }}
      />
      <header className="article-hero issue-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="パンくず">
            <a href="/">ゲムなお</a>
            <span>›</span>
            <a href="/discord">Discord</a>
            <span>›</span>
            <a href={`/discord#${item.category}`}>
              {discordCategoryLabels[item.category]}
            </a>
            <span>›</span>
            <b>{item.shortTitle}</b>
          </nav>
          <p className="article-label">
            {discordCategoryLabels[item.category]}｜
            {item.botRecommendations
              ? 'Discordサーバー運営ガイド'
              : 'Discordトラブル解決'}
          </p>
          <h1>{item.title}</h1>
          <p className="article-lead">{item.symptom}</p>
          <div className="article-meta">
            <span>最終確認：{item.checkedAt.replaceAll('-', '.')}</span>
            <span>対象：{item.target}</span>
          </div>
        </div>
      </header>
      <div className="article-layout issue-layout">
        <aside className="toc issue-toc">
          <strong>このページの内容</strong>
          <a href="#answer">
            {item.botRecommendations
              ? '用途別のおすすめ・結論'
              : 'まず試すこと'}
          </a>
          {item.botRecommendations ? (
            <a href="#bot-comparison">おすすめBot比較表</a>
          ) : null}
          {item.diagnosis?.length ? (
            <a href="#diagnosis">症状別の判定表</a>
          ) : null}
          {item.showStatusCheck !== false ? (
            <a href="#status-check">Discord全体の障害確認</a>
          ) : null}
          {item.causes.map((cause, i) => (
            <a href={`#cause-${i + 1}`} key={cause.title}>
              {i + 1}. {cause.title}
            </a>
          ))}
          {item.botRecommendations?.map((bot) => (
            <a href={`#bot-${bot.id}`} key={bot.id}>
              {bot.name}の設定手順
            </a>
          ))}
          {item.followUp ? <a href="#next-guide">次に確認する記事</a> : null}
          <a href="#faq">よくある質問</a>
          <a href="#references">参考情報</a>
        </aside>
        <article className="guide-article">
          <section className="answer-summary" id="answer">
            <p className="evidence-label">
              {item.botRecommendations
                ? 'ゲームサーバーの用途から選ぶ'
                : 'まずこれを試す'}
            </p>
            <h2>
              <CheckCircle2 size={23} />
              結論
            </h2>
            <p>{item.conclusion}</p>
            <ol>
              {item.quickFixes.map((fix, index) => (
                <li key={fix}>
                  {item.quickFixCauseIndexes?.[index] ? (
                    <a href={`#cause-${item.quickFixCauseIndexes[index]}`}>
                      {fix}
                    </a>
                  ) : (
                    fix
                  )}
                </li>
              ))}
            </ol>
          </section>
          {item.botRecommendations ? (
            <DiscordBotComparison bots={item.botRecommendations} />
          ) : null}
          {item.diagnosis?.length ? (
            <section
              className="diagnosis-table"
              id="diagnosis"
              aria-labelledby="discord-diagnosis-title"
            >
              <h2 id="discord-diagnosis-title">
                {item.diagnosisTitle ?? 'どこで止まる？ 症状別の判定表'}
              </h2>
              <p>
                {item.diagnosisIntro ??
                  '配信の開始前・視聴者側・共有対象のどこで失敗するかを確認してください。'}
              </p>
              <table>
                <thead>
                  <tr>
                    <th scope="col">見えている症状</th>
                    <th scope="col">まず比べること</th>
                    <th scope="col">次の手順</th>
                  </tr>
                </thead>
                <tbody>
                  {item.diagnosis.map((row) => (
                    <tr key={row.symptom}>
                      <td data-label="症状">{row.symptom}</td>
                      <td data-label="比較">{row.check}</td>
                      <td data-label="手順">
                        <a href={`#cause-${row.causeIndex}`}>
                          {row.causeIndex}.{' '}
                          {item.causes[row.causeIndex - 1]?.title}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : null}
          {visual ? <SolutionIllustration visual={visual} /> : null}
          {item.showStatusCheck !== false ? (
            <section className="caution-block" id="status-check">
              <h2>
                <ShieldAlert size={22} />
                まずDiscord全体の障害か確認する
              </h2>
              <p>
                PC側の設定を変更する前に、
                <a
                  href="https://discordstatus.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Discord Status（公式）
                  <ExternalLink size={14} />
                </a>
                で大規模な障害が発生していないか確認してください。障害が発表されている場合は、設定変更を進めず復旧を待つことをおすすめします。ゲムなおはリアルタイムの障害状況を自動取得していないため、必ず公式ページで確認してください。
              </p>
            </section>
          ) : null}
          {item.botRecommendations ? (
            <>
              <section className="bot-common-steps">
                <h2>Botの選び方・共通の導入手順</h2>
                {item.causes.map((cause, index) => (
                  <section
                    className="guide-section"
                    id={`cause-${index + 1}`}
                    key={cause.title}
                  >
                    <h3>
                      {index + 1}. {cause.title}
                    </h3>
                    <p>{cause.description}</p>
                    <ol>
                      {cause.actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ol>
                    {cause.note ? (
                      <p className="procedure-note">{cause.note}</p>
                    ) : null}
                  </section>
                ))}
              </section>
              <DiscordBotRecommendations bots={item.botRecommendations} />
            </>
          ) : (
            <InteractiveSteps
              contextSlug={`discord-${item.slug}`}
              topic={feedbackTopic[item.category]}
              articleTitle={item.title}
              articlePath={`/discord/${item.slug}`}
              shareHashtag="Discord"
              heading="原因と対処法"
              steps={item.causes.map((cause, index) => ({
                id: `cause-${index + 1}`,
                title: cause.title,
                summary: cause.description,
                actions: cause.actions,
                note: cause.note,
              }))}
              nextLinks={[
                ...relatedItems.map((related) => ({
                  href: `/discord/${related.slug}`,
                  label: related.shortTitle,
                })),
                { href: '/discord', label: 'Discordトラブル一覧へ戻る' },
              ]}
            />
          )}
          {item.followUp ? (
            <section className="answer-summary" id="next-guide">
              <h2>{item.followUp.title}</h2>
              <p>{item.followUp.description}</p>
              <p>
                <a href={item.followUp.href}>{item.followUp.label} →</a>
              </p>
            </section>
          ) : null}
          <section className="caution-block">
            <h2>
              <AlertTriangle size={22} />
              {item.botRecommendations
                ? '導入・設定で止まった場合'
                : '直らない場合'}
            </h2>
            <p>{item.ifNotFixed}</p>
          </section>
          <section className="faq-section" id="faq">
            <h2>よくある質問</h2>
            <div>
              {item.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="related-section">
            <h2>
              {item.botRecommendations
                ? '追加・無応答・解除の詳しい手順'
                : 'まだ直りませんか？ 次に試す記事'}
            </h2>
            <div>
              {relatedItems.map((r) => (
                <a href={`/discord/${r.slug}`} key={r.slug}>
                  <span>{discordCategoryLabels[r.category]}</span>
                  {r.shortTitle}
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          </section>
          <section className="common-guides">
            <h2>Discordのトラブル一覧</h2>
            <a href="/discord">
              Discordトラブル一覧をすべて見る <ArrowRight size={15} />
            </a>
            <a href="/guide">
              PCゲーム共通トラブル解決ガイド <ArrowRight size={15} />
            </a>
          </section>
          {item.category === 'bot' ? (
            <section className="server-related">
              <h2>Botを使うDiscordサーバーを探す・掲載する</h2>
              <p>
                PCゲーム向けコミュニティを条件から探せます。サーバー運営者は無料掲載を申請できます。
              </p>
              <a href="/discord-servers">
                Discordサーバー募集・検索を見る <ArrowRight size={16} />
              </a>
              <a href="/discord-servers/submit">
                自分のサーバーを無料掲載する <ArrowRight size={16} />
              </a>
            </section>
          ) : null}
          <ShareButtons
            title={item.title}
            path={`/discord/${item.slug}`}
            hashtag="Discord"
            label={
              item.botRecommendations
                ? 'サーバー運営メンバーに共有する'
                : undefined
            }
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
              {item.botRecommendations
                ? 'Discord・各Botの公式情報を確認し、設定例と確認手順をゲムなお独自の構成で整理しています。'
                : 'Discord公式の情報を優先して確認し、本文はゲムなお独自の表現で要約しています。'}
              UIの表記は更新で変わることがあるため、最新の状態は出典先でも確認してください。
            </p>
            {item.sources.map((source) => (
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
