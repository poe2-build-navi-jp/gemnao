import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ExternalLink } from 'lucide-react';
import { StatusBoard } from '@/components/status-board';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { officialStatusPages } from '@/lib/status/sources';

export const metadata: Metadata = {
  title: 'PCゲーム・Discordの障害・メンテナンス情報｜今日落ちてる？',
  description:
    'Discordの稼働状況、PCゲームの公式メンテナンス予定、Steamの公式アナウンス（障害・修正）、ゲムなおで「困っている」が急増しているゲームを1ページで確認できます。約10分ごとに更新。',
  alternates: { canonical: '/status' },
};

export default function StatusPage() {
  return (
    <main>
      <WikiHeader pagePath="/status" />
      <article className="static-page">
        <p className="page-kicker">STATUS</p>
        <h1>今日、落ちてる？｜PCゲーム・Discordの障害・メンテ情報</h1>
        <p className="page-lead">
          ゲームやDiscordにつながらない時、自分のPCを疑う前に、公式の障害・メンテナンス情報を確認できます。表示しているのは公式の情報だけで、それぞれの出典にリンクしています。
        </p>
        <StatusBoard />
        <section aria-labelledby="status-official">
          <h2 id="status-official">公式の稼働状況ページ</h2>
          <ul className="status-list">
            {officialStatusPages.map((page) => (
              <li key={page.url}>
                <div>
                  <a href={page.url} target="_blank" rel="noreferrer">
                    {page.name} <ExternalLink size={13} />
                  </a>
                  <p>{page.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="status-next">
          <h2 id="status-next">障害が出ていないのにつながらない時</h2>
          <ul>
            <li>
              <a href="/trouble/server">
                ゲームのサーバーに接続できない時の対処法
              </a>
            </li>
            <li>
              <a href="/pc/wifi-connected-no-internet">
                Wi-Fiは接続済みなのにインターネットが使えない
              </a>
            </li>
            <li>
              <a href="/discord">Discordのトラブル一覧</a>
            </li>
          </ul>
        </section>
      </article>
      <WikiFooter />
    </main>
  );
}
