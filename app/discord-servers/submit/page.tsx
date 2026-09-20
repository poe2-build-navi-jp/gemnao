import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
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
        <p className="correction-link">
          掲載するサーバーへBotを導入する場合は{' '}
          <a href="/discord/bot-add">Discord Botの入れ方</a>
          、導入済みのBotが動かない場合は{' '}
          <a href="/discord/bot-not-responding">Bot・コマンドの権限確認</a>
          を先に確認できます。
        </p>
        <DiscordServerSubmitForm />
      </article>
      <WikiFooter />
    </main>
  );
}
