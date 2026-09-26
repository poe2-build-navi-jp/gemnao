import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { InteractiveSteps } from '@/components/interactive-steps';
import { SolutionIllustration } from '@/components/solution-illustration';
import { gameArticles } from '@/lib/game-articles';
import { gameBySlug } from '@/lib/games';
import { commonGuideBySlug, commonGuides } from '@/lib/common-guides';
import { troubleHubForGuide } from '@/lib/trouble-hubs';
import { guideVisualBySlug } from '@/lib/visual-guides';
export function generateStaticParams() {
  return commonGuides
    .filter(({ status }) => status === 'verified')
    .map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = commonGuideBySlug(slug);
  const visual = guideVisualBySlug(slug);
  return item
    ? {
        title: item.title,
        description: item.description,
        alternates: { canonical: `/guide/${slug}` },
        openGraph: {
          type: 'article',
          title: item.title,
          description: item.description,
          url: `/guide/${slug}`,
          locale: 'ja_JP',
          modifiedTime: item.checkedAt,
          images: [visual?.ogImage || '/og-default.png'],
        },
        twitter: {
          card: 'summary_large_image',
          title: item.title,
          description: item.description,
          images: [visual?.ogImage || '/og-default.png'],
        },
      }
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = commonGuideBySlug(slug);
  if (!item) notFound();
  if (item.status === 'draft' || item.status === 'thin') notFound();
  const visual = guideVisualBySlug(slug);
  const canonical = `https://gemnao.pages.dev/guide/${item.slug}`;
  const faq = [
    {
      question: `${item.shortTitle}は何から試しますか？`,
      answer: item.conclusion,
    },
    {
      question: '複数の対策を同時に行ってよいですか？',
      answer:
        '原因が分からなくなるため、1項目ずつ試し、毎回起動して確認します。',
    },
  ];
  const topic =
    item.slug.includes('save') || item.slug.includes('uninstall')
      ? 'save'
      : item.slug.includes('controller')
        ? 'controller'
        : item.slug.includes('mod') || item.slug.includes('reshade')
          ? 'mods'
          : item.slug.includes('fps') ||
              item.slug.includes('vram') ||
              item.slug.includes('stutter') ||
              item.slug.includes('shader')
            ? 'display'
            : 'launch';
  const gameLinks = gameArticles
    .filter(
      (article) =>
        article.category === topic ||
        (topic === 'display' && article.category === 'settings'),
    )
    .slice(0, 5);
  const troubleHub = troubleHubForGuide(item);
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: item.title,
      description: item.description,
      dateModified: item.checkedAt,
      author: { '@type': 'Organization', name: 'ゲムなお編集部' },
      inLanguage: 'ja-JP',
      mainEntityOfPage: canonical,
      ...(visual ? { image: `https://gemnao.pages.dev${visual.image}` } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
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
          name: 'PC共通ガイド',
          item: 'https://gemnao.pages.dev/guide',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: item.shortTitle,
          item: canonical,
        },
      ],
    },
  ];
  return (
    <main>
      <WikiHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="article-hero issue-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs">
            <a href="/">ゲムなお</a>
            <span>›</span>
            <a href="/guide">共通ガイド</a>
            <span>›</span>
            <b>{item.shortTitle}</b>
          </nav>
          <p className="article-label">PCゲーム共通トラブル解決</p>
          <h1>{item.title}</h1>
          <p className="article-lead">{item.description}</p>
          <div className="article-meta">
            <span>最終確認：{item.checkedAt.replaceAll('-', '.')}</span>
            <span>公式資料を優先して確認</span>
          </div>
        </div>
      </header>
      <div className="article-layout issue-layout">
        <aside className="toc issue-toc">
          <strong>このページの内容</strong>
          <a href="#answer">まず試すこと</a>
          {item.steps.map((s, i) => (
            <a href={`#step-${i + 1}`} key={s.title}>
              {i + 1}. {s.title}
            </a>
          ))}
          <a href="#faq">よくある質問</a>
        </aside>
        <article className="guide-article">
          <section className="answer-summary" id="answer">
            <p className="evidence-label">まずこれを試す</p>
            <h2>
              <CheckCircle2 size={23} />
              結論
            </h2>
            <p>{item.conclusion}</p>
            <ol>
              {item.steps.map((s) => (
                <li key={s.title}>{s.title}</li>
              ))}
            </ol>
          </section>
          {visual ? <SolutionIllustration visual={visual} /> : null}
          {slug === 'low-fps' ? (
            <p>
              平均FPSは出ているのに一瞬止まる場合は、{' '}
              <a href="/guide/stutter-fix">カクつき・スタッターの確認手順</a>
              をご覧ください。
            </p>
          ) : null}
          <section className="cause-block" aria-labelledby="cause-title">
            <h2 id="cause-title">原因候補</h2>
            <ul>
              {item.causes.map((cause) => (
                <li key={cause}>{cause}</li>
              ))}
            </ul>
          </section>
          {troubleHub ? (
            <nav className="article-parent-links" aria-label="この記事の分類">
              <a href="/guide">PC共通ガイド一覧</a>
              <a href={`/trouble/${troubleHub.slug}`}>
                {troubleHub.label}の症状別ガイド
              </a>
            </nav>
          ) : null}
          <InteractiveSteps
            contextSlug={`guide-${item.slug}`}
            topic={topic}
            articleTitle={item.title}
            articlePath={`/guide/${item.slug}`}
            shareHashtag="PCゲーム"
            steps={item.steps.map((step, index) => ({
              id: `step-${index + 1}`,
              title: step.title,
              actions: step.actions,
            }))}
            nextLinks={[
              ...item.related
                .map((slug) => commonGuideBySlug(slug))
                .filter((guide): guide is NonNullable<typeof guide> =>
                  Boolean(guide),
                )
                .map((guide) => ({
                  href: `/guide/${guide.slug}`,
                  label: guide.shortTitle,
                })),
              ...(troubleHub
                ? [
                    {
                      href: `/trouble/${troubleHub.slug}`,
                      label: `${troubleHub.label}の症状別ガイド`,
                    },
                  ]
                : []),
              { href: '/guide', label: 'PC共通ガイド一覧へ戻る' },
            ]}
          />
          <section className="caution-block">
            <h2>
              <AlertTriangle size={22} />
              注意
            </h2>
            <p>
              変更前にセーブと設定をバックアップし、対策は1項目ずつ試してください。
            </p>
          </section>
          <section className="faq-section" id="faq">
            <h2>よくある質問</h2>
            <div>
              {faq.map((f) => (
                <details key={f.question}>
                  <summary>{f.question}</summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="related-section">
            <h2>まだ直りませんか？ 次に試す記事</h2>
            <div>
              {item.related.map((s) => {
                const r = commonGuideBySlug(s);
                return r ? (
                  <a href={`/guide/${s}`} key={s}>
                    {r.shortTitle}
                    <ArrowRight size={15} />
                  </a>
                ) : null;
              })}
            </div>
          </section>
          <section className="related-section">
            <h2>ゲーム別の対処法</h2>
            <div>
              {gameLinks.map((article) => (
                <a
                  href={`/games/${article.gameSlug}/${article.slug}`}
                  key={`${article.gameSlug}-${article.slug}`}
                >
                  {gameBySlug(article.gameSlug)?.shortTitle}：
                  {article.shortTitle}
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
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
              公式資料を確認し、本文は独自の表現で要約しています。
            </p>
            {item.sources.map((s) => (
              <a href={s.url} target="_blank" rel="noreferrer" key={s.url}>
                {s.label}
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
