import type { Metadata } from 'next';
import { DiscordServerSubmitForm } from '@/components/discord-server-submit-form';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';

export const metadata: Metadata = {
  title: 'Discordサーバーを無料掲載する｜PCゲーム募集',
  description: 'PCゲーム向けDiscordサーバーの無料掲載申請ページです。内容と招待リンクを審査し、活動中と確認できる募集だけを掲載します。',
  alternates: { canonical: '/discord-servers/submit' },
  robots: { index: false, follow: true },
};

export default function DiscordServerSubmitPage() {
  return (
    <main>
      <WikiHeader />
      <article className="static-page server-submit-page">
        <p className="page-kicker">FREE LISTING REQUEST</p>
        <h1>Discordサーバーを無料掲載する</h1>
        <p className="page-lead">PCゲーム向け・日本語対応のコミュニティを募集できます。申請内容を確認してから公開するため、投稿直後には表示されません。</p>
        <div className="submission-policy">
          <strong>申請前にご確認ください</strong>
          <ul>
            <li>申請者が対象サーバーの管理権限を持っていること</li>
            <li>出会い、成人向け、RMT、アカウント売買、チート、海賊版を目的としないこと</li>
            <li>招待リンクと募集条件が正確であること</li>
            <li>定期的な募集継続確認に対応できること</li>
          </ul>
        </div>
        <DiscordServerSubmitForm />
      </article>
      <WikiFooter />
    </main>
  );
}
