import { ArticleToc } from '@/components/article-toc';
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
import { ShareButtons } from '@/components/share-buttons';
import { ogImageFor } from '@/lib/og-images';
import { MyPcFit } from '@/components/my-pc-fit';
import {
  type Fit,
  releaseRoundupBySlug,
  releaseRoundups,
} from '@/lib/release-roundups';

// Requirements that most often stop a PC from launching the game.
const SPECIAL = /レイトレーシング|TPM|VRAM 8GB|RTX 2060|SSD/;

const fitLabel: Record<Fit, string> = {
  yes: '○',
  no: '×',
  partial: '△',
  unknown: '？',
};

export function generateStaticParams() {
  return releaseRoundups.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const roundup = releaseRoundupBySlug(slug);
  if (!roundup) return {};
  const path = `/new-releases/${slug}`;
  return {
    title: roundup.title,
    description: roundup.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: roundup.title,
      description: roundup.description,
      url: path,
      locale: 'ja_JP',
      modifiedTime: roundup.checkedAt,
      images: [ogImageFor(path)],
    },
    twitter: {
      card: 'summary_large_image',
      title: roundup.title,
      description: roundup.description,
      images: [ogImageFor(path)],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const roundup = releaseRoundupBySlug(slug);
  if (!roundup) notFound();
  const path = `/new-releases/${slug}`;
  const canonical = `https://gemnao.pages.dev${path}`;
  const blocked1660 = roundup.games.filter((game) => game.gtx1660 === 'no');
  const win10 = roundup.games.filter((game) => game.win10 !== 'no');
  const special = roundup.games.filter((game) =>
    game.must.some((item) => SPECIAL.test(item)),
  );
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: roundup.title,
      description: roundup.description,
      dateModified: roundup.checkedAt,
      author: { '@type': 'Organization', name: 'ゲムなお編集部' },
      inLanguage: 'ja-JP',
      mainEntityOfPage: canonical,
      image: `https://gemnao.pages.dev${ogImageFor(path)}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: roundup.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
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
          name: roundup.shortTitle,
          item: canonical,
        },
      ],
    },
  ];
  return (
    <main>
      <WikiHeader pagePath={path} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="article-hero issue-hero">
        <div className="article-hero-inner">
          <nav className="breadcrumbs" aria-label="パンくず">
            <a href="/">ゲムなお</a>
            <span>›</span>
            <b>{roundup.shortTitle}</b>
          </nav>
          <p className="article-label">新作PCゲームの動作環境</p>
          <h1>{roundup.title}</h1>
          <p className="article-lead">{roundup.lead}</p>
          <div className="article-meta">
            <span>最終確認：{roundup.checkedAt.replaceAll('-', '.')}</span>
            <span>Steamストア・公式サイトの動作環境を確認</span>
          </div>
        </div>
      </header>
      <div className="article-layout issue-layout">
        <ArticleToc title={'このページの内容'} className="issue-toc">
          <a href="#answer">結論</a>
          <a href="#requirements">動作環境の一覧</a>
          <a href="#fit">GTX 1660・Windows 10の目安</a>
          <a href="#faq">よくある質問</a>
          <a href="#references">参考情報</a>
        </ArticleToc>
        <article className="guide-article">
          <section
            className="answer-summary"
            id="answer"
            aria-labelledby="answer-title"
          >
            <p className="evidence-label">購入前に確認</p>
            <h2 id="answer-title">
              <CheckCircle2 size={23} />
              結論
            </h2>
            <p>{roundup.description}</p>
          </section>
          <section className="quick-facts" aria-labelledby="summary-title">
            <h2 id="summary-title">ひと目でわかる注意点</h2>
            <dl>
              <div>
                <dt>GTX 1660では最低環境に届かない</dt>
                <dd>{blocked1660.map((game) => game.name).join('、')}</dd>
              </div>
              <div>
                <dt>Windows 10で遊べる（条件付きを含む）</dt>
                <dd>{win10.map((game) => game.name).join('、')}</dd>
              </div>
              <div>
                <dt>特別な必須条件がある</dt>
                <dd>
                  {special.length === 0
                    ? 'なし'
                    : special
                        .map(
                          (game) =>
                            `${game.name}（${game.must
                              .filter((item) => SPECIAL.test(item))
                              .join('・')}）`,
                        )
                        .join('、')}
                </dd>
              </div>
            </dl>
          </section>
          {releaseRoundups.length > 1 ? (
            <nav className="article-parent-links" aria-label="ほかの月">
              {releaseRoundups
                .filter((other) => other.slug !== roundup.slug)
                .map((other) => (
                  <a href={`/new-releases/${other.slug}`} key={other.slug}>
                    {other.shortTitle}の動作環境まとめ
                  </a>
                ))}
            </nav>
          ) : null}
          <section
            className="diagnosis-table"
            id="requirements"
            aria-labelledby="requirements-title"
          >
            <h2 id="requirements-title">動作環境の一覧（最低環境）</h2>
            <p>
              発売日は日本での日付です。「必須条件」は、満たしていないと起動やプレイができない項目です。
            </p>
            <table>
              <thead>
                <tr>
                  <th scope="col">ゲーム・発売日</th>
                  <th scope="col">OS</th>
                  <th scope="col">最低GPU</th>
                  <th scope="col">メモリ・容量</th>
                  <th scope="col">必須条件</th>
                </tr>
              </thead>
              <tbody>
                {roundup.games.map((game) => (
                  <tr key={game.name}>
                    <td data-label="ゲーム">
                      <b>{game.name}</b>
                      <br />
                      {game.date}
                      {game.article ? (
                        <>
                          <br />
                          <a href={game.article.href}>{game.article.label}</a>
                        </>
                      ) : null}
                    </td>
                    <td data-label="OS">{game.os}</td>
                    <td data-label="最低GPU">{game.minGpu}</td>
                    <td data-label="メモリ・容量">
                      {game.memory}／{game.storage}
                    </td>
                    <td data-label="必須条件">{game.must.join('、')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section
            className="diagnosis-table"
            id="fit"
            aria-labelledby="fit-title"
          >
            <h2 id="fit-title">GTX 1660・Windows 10で遊べる？（目安）</h2>
            <p>
              ○＝最低環境を満たす目安、△＝条件付き、×＝満たさない、？＝記載なし。GPUは、最低環境のGPUとの世代・VRAMを編集部が比べた目安です。快適に遊べるかは推奨環境も確認してください。「あなたのPC」は
              <a href="/my#my-pc">マイPC</a>
              に登録したGPU・メモリ・Windowsで判定します（GPUの性能は目安。TPMやSSDなどは表の必須条件を確認してください）。
            </p>
            <table>
              <thead>
                <tr>
                  <th scope="col">ゲーム</th>
                  <th scope="col">GTX 1660（6GB）</th>
                  <th scope="col">Windows 10</th>
                  <th scope="col">あなたのPC（マイPC）</th>
                </tr>
              </thead>
              <tbody>
                {roundup.games.map((game) => (
                  <tr key={game.name}>
                    <td data-label="ゲーム">
                      <a href={game.source} target="_blank" rel="noreferrer">
                        {game.name}
                      </a>
                    </td>
                    <td data-label="GTX 1660">
                      <b>{fitLabel[game.gtx1660]}</b> {game.gtx1660Note}
                    </td>
                    <td data-label="Windows 10">
                      <b>{fitLabel[game.win10]}</b> {game.win10Note}
                    </td>
                    <td data-label="あなたのPC">
                      <MyPcFit spec={game.spec} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="caution-block">
            <h2>
              <AlertTriangle size={22} />
              注意
            </h2>
            <ul>
              <li>
                動作環境は発売前後に変更されることがあります。購入前にSteamストアや公式サイトの最新の表記を確認してください。
              </li>
              <li>
                Windowsのバージョンは「Windows +
                R」→「winver」、GPU名はタスクマネージャーの「パフォーマンス」→「GPU」で確認できます。
              </li>
            </ul>
          </section>
          <section className="faq-section" id="faq">
            <h2>よくある質問</h2>
            <div>
              {roundup.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="common-guides">
            <h2>起動しない時の共通の対処法</h2>
            <a href="/guide/ray-tracing-gpu">
              レイトレーシング対応GPUか確認する方法 <ArrowRight size={15} />
            </a>
            <a href="/guide/windows-11-required">
              Windows 11が必要なゲームの確認方法 <ArrowRight size={15} />
            </a>
            <a href="/guide/tpm-secure-boot">
              TPM 2.0・セキュアブートの有効化 <ArrowRight size={15} />
            </a>
            <a href="/guide/steam-game-not-launching">
              Steamゲームが起動しない時の対処法 <ArrowRight size={15} />
            </a>
          </section>
          <ShareButtons
            title={roundup.title}
            path={path}
            hashtag="新作PCゲーム"
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
              各ゲームの動作環境はSteamストアまたは公式サイトで確認し、ゲムなお独自に整理しています。各作品の出典は上の表のゲーム名からも開けます。
            </p>
            {roundup.sources.map((source) => (
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
