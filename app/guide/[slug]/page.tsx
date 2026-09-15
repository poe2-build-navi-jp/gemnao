import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { notFound } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ListChecks,
} from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { IssueFeedback } from '@/components/issue-feedback';
import { gameArticles } from '@/lib/game-articles';
import { gameBySlug } from '@/lib/games';
import { commonGuideBySlug, commonGuides } from '@/lib/common-guides';
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
  return item
    ? {
        title: item.title,
        description: item.description,
        alternates: { canonical: `/guide/${slug}` },
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
          <IssueFeedback
            gameSlug={`guide-${item.slug}`}
            locale="ja"
            topics={[topic]}
            compact
            solutionOptions={item.steps.map((step, index) => ({
              id: `step-${index + 1}`,
              label: step.title,
            }))}
          />
          <section className="cause-block" aria-labelledby="cause-title">
            <h2 id="cause-title">原因候補</h2>
            <ul>
              {item.causes.map((cause) => (
                <li key={cause}>{cause}</li>
              ))}
            </ul>
          </section>
          <section className="procedure-section">
            <h2>
              <ListChecks size={26} />
              解決手順
            </h2>
            <div className="procedure-list">
              {item.steps.map((s, i) => (
                <section
                  className="procedure-card"
                  id={`step-${i + 1}`}
                  key={s.title}
                >
                  <header>
                    <span>{i + 1}</span>
                    <div>
                      <h3>{s.title}</h3>
                    </div>
                  </header>
                  <ol>
                    {s.actions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </section>
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
            <h2>関連する共通ガイド</h2>
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
