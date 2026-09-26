import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { DiscordServerAdmin } from '@/components/discord-server-admin';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';

export const metadata: Metadata = {
  title: 'Discordサーバー掲載審査',
  robots: { index: false, follow: false, noarchive: true },
};

export default function DiscordServerAdminPage() {
  return (
    <main>
      <WikiHeader />
      <article className="static-page admin-server-page">
        <p className="page-kicker">PRIVATE ADMIN</p>
        <h1>Discordサーバー掲載審査</h1>
        <p className="page-lead">
          申請内容と招待リンクを確認し、問題がない募集だけを承認してください。
        </p>
        <p className="admin-back-link">
          <a href="/admin/contacts">お問い合わせ一覧</a>
          <a href="/admin/search-demand">記事がない検索の集計</a>
          <a href="/discord-servers">公開中の募集一覧を確認</a>
        </p>
        <DiscordServerAdmin />
      </article>
      <WikiFooter />
    </main>
  );
}
