import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight, ExternalLink } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { ShareButtons } from '@/components/share-buttons';
import { pcArticles } from '@/lib/pc-articles';
import { ogImageFor } from '@/lib/og-images';
import {
  pcHub,
  pcHubSources,
  pcHubRows,
  pcHubGroups,
  pcHubFaqs,
} from '@/lib/pc-hub';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: pcHub.title,
  description: pcHub.description,
  alternates: { canonical: '/pc' },
  openGraph: {
    type: 'website',
    title: pcHub.title,
    description: pcHub.description,
    url: '/pc',
    locale: 'ja_JP',
    images: [ogImageFor('/pc')],
  },
  twitter: {
    card: 'summary_large_image',
    title: pcHub.title,
    description: pcHub.description,
    images: [ogImageFor('/pc')],
  },
};

export default function PcHub() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pcHub.title,
      description: pcHub.description,
      url: `${siteConfig.url}/pc`,
      inLanguage: 'ja-JP',
      dateModified: pcHub.checkedAt,
      publisher: {
        '@type': 'Organization',
        name: siteConfig.operatorName,
        url: `${siteConfig.url}/about`,
      },
      image: `${siteConfig.url}${ogImageFor('/pc')}`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: pcArticles.length,
        itemListElement: pcHubGroups
          .flatMap((group) => group.slugs)
          .map((slug, index) => {
            const article = pcArticles.find((a) => a.slug === slug)!;
            return {
              '@type': 'ListItem',
              position: index + 1,
              name: article.title,
              url: `${siteConfig.url}/pc/${slug}`,
            };
          }),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pcHubFaqs.map((faq) => ({
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
          item: siteConfig.url,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'PCトラブル',
          item: `${siteConfig.url}/pc`,
        },
      ],
    },
  ];
  return (
    <main>
      <WikiHeader pagePath="/pc" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <article className="static-page pc-trouble-hub">
        <nav className="breadcrumbs" aria-label="パンくず">
          <a href="/">ゲムなお</a>
          <span>›</span>
          <b>PCトラブル</b>
        </nav>
        <p className="page-kicker">PC &amp; WINDOWS TROUBLESHOOTING</p>
        <h1>{pcHub.title}</h1>
        <p className="page-lead">
          PCの不具合を、確認する画面・比較結果・次の行動から調べるガイドです。Windows
          11の音・通信・画面・周辺機器を中心に、{pcArticles.length}
          記事の詳しい手順へ案内します。
        </p>
        <p className="source-note">
          最終確認：2026年9月30日｜編集：ゲムなお編集部（オカピ研究所）
        </p>
        <nav className="pc-hub-nav" aria-label="PCトラブルの目次">
          <a href="#pc-first">最初の確認</a>
          <a href="#pc-symptoms">症状別の判断表</a>
          <a href="#pc-performance">重い・固まる</a>
          {pcHubGroups.map((group) => (
            <a href={`#${group.id}`} key={group.id}>
              {group.title}
            </a>
          ))}
          <a href="#pc-help">直らない場合</a>
          <a href="#pc-faq">よくある質問</a>
        </nav>
        <section id="pc-first" className="guide-section">
          <h2>PCトラブルが起きたら、まず確認する3つのこと</h2>
          <p>{pcHub.answer}</p>
          <ol>
            <li>
              <strong>操作できるか：</strong>
              マウスが動くか、Ctrl＋Alt＋Deleteで画面が出るかを見る。操作できない場合に、設定画面の手順を続けない。
            </li>
            <li>
              <strong>症状の範囲：</strong>
              別のアプリ・端末・接続先で同じ症状が出るか比較する。別の対象が動けば、問題が出る側を優先して調べる。
            </li>
            <li>
              <strong>直前の変更：</strong>
              Windowsの更新、アプリの導入、機器の接続など、正常に使えた時との違いを記録する。
            </li>
          </ol>
          <p className="source-note">
            電源が入らない・異臭や煙がある・バッテリーが膨らんでいる場合は使用を中止し、PCメーカーへ相談してください。本ページは内部部品の分解・交換を案内していません。
          </p>
        </section>
        <section
          id="pc-symptoms"
          className="diagnosis-table"
          aria-labelledby="pc-symptoms-title"
        >
          <h2 id="pc-symptoms-title">PCトラブルの症状別判断表</h2>
          <p>
            すべての対処を順番に試すのではなく、当てはまる症状の行から進んでください。
          </p>
          <table>
            <thead>
              <tr>
                <th scope="col">症状</th>
                <th scope="col">最初に見ること</th>
                <th scope="col">次の確認先</th>
              </tr>
            </thead>
            <tbody>
              {pcHubRows.map((row) => (
                <tr key={row.symptom}>
                  <td data-label="症状">{row.symptom}</td>
                  <td data-label="確認">{row.check}</td>
                  <td data-label="次の手順">
                    <a
                      href={row.href}
                      {...(row.href.startsWith('https:')
                        ? { target: '_blank', rel: 'noreferrer' }
                        : {})}
                    >
                      {row.label}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section id="pc-performance" className="guide-section">
          <h2>PCが重い・固まる時は、使用率と症状を一緒に見る</h2>
          <p>
            Windowsを操作できるなら、Ctrl＋Shift＋Escで「タスクマネージャー」を開き、「プロセス」のCPU・メモリ・ディスクを確認します。キーが効かない場合はスタートを右クリック→「タスクマネージャー」。一瞬の高い値だけで故障とは判断できません。
          </p>
          <ul>
            <li>
              <strong>ディスク使用率が100％で重い：</strong>
              空き容量とは別の数値です。上位プロセス・対象ディスク・メモリを見て、
              <a href="/pc/disk-usage-100">原因別の確認手順</a>
              で更新中・処理終了後・ドライブの警告を分けます。
            </li>
            <li>
              <strong>一つのアプリだけ「応答なし」：</strong>
              別のアプリを操作できるか確認。終了する場合は未保存の作業が失われるため、そのアプリだけを対象にする。右クリック操作でエクスプローラーだけ固まるなら
              <a href="/pc/file-explorer-freezes-on-right-click">
                専用の確認手順
              </a>
              へ。
            </li>
            <li>
              <strong>PC全体の操作が遅い：</strong>
              操作が遅い間に、どのアプリで使用率が高い状態が続くかを見る。使っていないアプリを保存して終了し、同じ操作が軽くなるか比較する。Windowsのシステムプロセスを手当たり次第に終了しない。
            </li>
            <li>
              <strong>アプリを閉じても変わらない：</strong>記録を残し、
              <a href={pcHubSources[3].url} target="_blank" rel="noreferrer">
                Microsoftのパフォーマンス改善手順
              </a>
              で、空き容量や起動時のアプリなど次の確認へ進む。
            </li>
          </ul>
          <p className="source-note">
            比較例：ブラウザーを開くのに時間がかかる→使用していない録画アプリを保存して終了→同じブラウザー操作を再確認。改善すれば負荷の関与を疑えますが、これだけで部品の故障を確定することはできません。
          </p>
        </section>
        {pcHubGroups.map((group) => (
          <section id={group.id} className="guide-section" key={group.id}>
            <h2>
              {group.title}
              {group.id === 'pc-keys' ? '' : 'のトラブル'}
            </h2>
            <p>{group.intro}</p>
            {group.id === 'pc-update' ? (
              <p>
                更新後の音声・マイクの不調は<a href="#pc-audio">音声の項目</a>
                、モニターが映らなくなった場合は
                <a href="#pc-devices">機器・画面の項目</a>
                へ進みます。更新が直前にあっただけで原因とは断定しません。
              </p>
            ) : null}
            <div className="guide-index-grid">
              {group.slugs.map((slug) => {
                const article = pcArticles.find((a) => a.slug === slug)!;
                return (
                  <a href={`/pc/${article.slug}`} key={article.slug}>
                    <strong>{article.shortTitle}</strong>
                    <span>{article.lead}</span>
                    <small>
                      結果別の手順を見る <ArrowRight size={14} />
                    </small>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
        <section id="pc-help" className="guide-section">
          <h2>直らないPCトラブルは、比較結果を残して相談する</h2>
          <p>
            変更は一つずつ試し、改善しない設定は元の値へ戻します。回復・初期化を検討する前に、重要なファイルをバックアップし、
            <a href={pcHubSources[0].url} target="_blank" rel="noreferrer">
              Microsoftの回復オプション
            </a>
            でデータ・アプリへの影響を確認してください。
          </p>
          <p>
            PCメーカーや管理担当者には、次の情報を渡すと確認した範囲を伝えやすくなります。
          </p>
          <ul>
            <li>PC型番、Windowsのバージョン、対象のアプリ・機器名</li>
            <li>発生日時、エラー全文・停止コード、最後に正常だった操作</li>
            <li>直前の変更と、別アプリ・別端末・直結などで比較した結果</li>
            <li>
              試した操作と結果：例「USB-Cをハブ経由から直結へ変更すると認識した」
            </li>
          </ul>
          <p>
            起動できる場合は、Windows＋R→<code>winver</code>
            →Enterでバージョンを確認できます。起動できない場合は無理に取得せず、その状態を伝えます。会社・学校のPCは管理担当者へ相談し、スクリーンショットの個人情報や回復キーを公開しないでください。
          </p>
          <p className="correction-link">
            ゲームだけで起きる問題は<a href="/guide">PCゲーム共通ガイド</a>
            、Discordだけの音声・接続・画面共有は
            <a href="/discord">Discordトラブル一覧</a>から探せます。
          </p>
          <ShareButtons
            title={pcHub.title}
            path="/pc"
            label="同じPCトラブルで困っている人に共有する"
          />
        </section>
        <section id="pc-faq" className="faq-section">
          <h2>PCトラブルについてよくある質問</h2>
          <div>
            {pcHubFaqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="sources" id="pc-sources">
          <h2>公式の確認先と編集方針</h2>
          {pcHubSources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {source.label}
              <ExternalLink size={15} />
            </a>
          ))}
          <p className="source-policy">
            掲載手順はMicrosoftの公式サポートと各記事の出典を照合して編集しています。Windows
            11を中心に案内し、機器やバージョンで項目名が異なる場合があります。すべての環境で実機検証した結果ではありません。
          </p>
        </section>
      </article>
      <WikiFooter />
    </main>
  );
}
