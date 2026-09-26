import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight, ExternalLink } from 'lucide-react';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { SolutionIllustration } from '@/components/solution-illustration';
import { discordHubVisual } from '@/lib/visual-guides';
import {
  discordArticles,
  discordCategoryLabels,
  type DiscordCategory,
} from '@/lib/discord-articles';

export const metadata: Metadata = {
  title: 'Discordの不具合・Bot・エラー解決｜起動・音声・RTC',
  description:
    'Discordが起動しない、声が聞こえない、RTC接続中、Botが反応しない・追加できないなどのPC版Discordトラブルを症状別に確認できます。',
  alternates: { canonical: '/discord' },
  openGraph: { images: [discordHubVisual.ogImage] },
  twitter: { card: 'summary_large_image', images: [discordHubVisual.ogImage] },
};

const categoryOrder: DiscordCategory[] = [
  'connection',
  'audio',
  'screen',
  'launch',
  'game',
  'bot',
];

export default function DiscordHub() {
  const grouped = categoryOrder.map((category) => ({
    category,
    label: discordCategoryLabels[category],
    items: discordArticles.filter(
      (item) => item.category === category && item.status === 'verified',
    ),
  }));
  return (
    <main>
      <WikiHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Discordの不具合・トラブル解決',
            url: 'https://gemnao.pages.dev/discord',
            image: `https://gemnao.pages.dev${discordHubVisual.image}`,
            inLanguage: 'ja-JP',
          }),
        }}
      />
      <article className="static-page">
        <p className="page-kicker">DISCORD TROUBLESHOOTING</p>
        <h1>Discordの不具合・トラブル解決</h1>
        <p className="page-lead">
          Discordが起動しない、声が聞こえない、マイクが反応しない、画面共有できない、RTC接続中から進まないなどのPC版Discordトラブルを症状別に確認できます。
        </p>
        <SolutionIllustration visual={discordHubVisual} />
        <p>
          <a href="/discord/cant-hear-voice">相手の声が聞こえない</a> ／{' '}
          <a href="/discord/mic-not-working">自分の声が届かない</a> ／{' '}
          <a href="/discord/rtc-connecting">RTC接続中で止まる</a> ／{' '}
          <a href="/discord/screen-share-not-working">画面共有が黒い</a> ／{' '}
          <a href="/discord/stream-no-audio">配信の音が出ない</a> ／{' '}
          <a href="/discord/not-opening">Discordが起動しない</a>
        </p>
        <p>
          <a href="https://discordstatus.com/" target="_blank" rel="noreferrer">
            Discord Status（公式障害情報）を確認する
            <ExternalLink size={14} />
          </a>
          ｜
          大規模障害が発生している場合は、PC側の設定を変更せず復旧を待ってください。
        </p>
        <h2>Discordで何に困っていますか？</h2>
        <nav className="symptom-nav" aria-label="Discordの症状を選ぶ">
          {grouped.map((group) => (
            <a key={group.category} href={`#${group.category}`}>
              {group.label}（{group.items.length}）
            </a>
          ))}
        </nav>
        {grouped.map((group) => (
          <section
            id={group.category}
            key={group.category}
            style={{ marginTop: 28 }}
          >
            <h3>{group.label}</h3>
            <div className="guide-index-grid">
              {group.items.map((item) => (
                <a href={`/discord/${item.slug}`} key={item.slug}>
                  <strong>{item.shortTitle}</strong>
                  <span>{item.symptom}</span>
                  <small>
                    手順を見る <ArrowRight size={14} />
                  </small>
                </a>
              ))}
            </div>
          </section>
        ))}
        <p className="correction-link">
          ここに載っていない症状もありますか？{' '}
          <a href="/contact">お問い合わせから教えてください</a>
          。検索需要を確認したうえで記事化を検討します。
        </p>
        <p className="correction-link">
          PCゲーム中の起動・FPS・MODなどのトラブルは{' '}
          <a href="/guide">PCゲーム共通トラブル解決ガイド</a>{' '}
          もあわせてご覧ください。
        </p>
        <p className="correction-link">
          Botを使うPCゲームコミュニティを探す場合は{' '}
          <a href="/discord-servers">Discordサーバー募集・検索</a>
          、自分のサーバーを紹介する場合は{' '}
          <a href="/discord-servers/submit">無料掲載申請</a>
          を利用できます。
        </p>
      </article>
      <WikiFooter />
    </main>
  );
}
