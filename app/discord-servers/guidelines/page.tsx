import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { WikiFooter, WikiHeader } from '@/components/wiki-header';

export const metadata: Metadata = {
  title: 'Discordサーバー掲載ガイドライン',
  description: 'ゲムなおのDiscordサーバー募集に掲載できる内容、禁止事項、審査、活動確認、通報と掲載停止の基準です。',
  alternates: { canonical: '/discord-servers/guidelines' },
};

export default function DiscordServerGuidelinesPage() {
  return (
    <main>
      <WikiHeader />
      <article className="static-page">
        <p className="page-kicker">SERVER LISTING GUIDELINES</p>
        <h1>Discordサーバー掲載ガイドライン</h1>
        <p className="page-lead">安全で、現在も参加できるPCゲームコミュニティだけを案内するための掲載基準です。</p>
        <h2>掲載できるサーバー</h2>
        <p>PCゲームを主なテーマとし、日本語で参加条件と禁止事項を確認できるDiscordサーバーが対象です。申請者は対象サーバーを管理する権限を持っている必要があります。</p>
        <h2>掲載できない内容</h2>
        <p>成人向け・出会い目的、荒らしやRaid、チート、クラック、海賊版、RMT、アカウント売買、詐欺、マルウェア、違法行為、個人への晒しを含むサーバーは掲載しません。</p>
        <h2>審査と公開</h2>
        <p>申請内容、招待リンク、参加条件を確認したうえで公開します。申請は掲載を保証するものではありません。虚偽、説明不足、権限を確認できない申請は保留または却下します。</p>
        <h2>活動確認と掲載停止</h2>
        <p>「活動確認日」はサーバー運営者が募集継続を確認した日です。30日以上確認できない掲載、招待リンクが無効な掲載、募集終了の連絡があった掲載は停止します。Discord内のメッセージやDMを無断で収集しません。</p>
        <h2>通報と削除</h2>
        <p>招待切れ、掲載内容との相違、不適切行為、詐欺などの通報を受け付けます。通報だけで即時削除せず、内容を確認して参加ボタンの停止、修正依頼、掲載停止を判断します。緊急性が高い場合は確認中に一時停止することがあります。</p>
        <h2>非公式サービスについて</h2>
        <p>ゲムなおのDiscordサーバー募集はDiscord Inc.とは無関係の非公式サービスです。Discordおよび各ゲームの名称・商標は、それぞれの権利者に帰属します。</p>
        <h2>申請・お問い合わせ</h2>
        <p><a href="/discord-servers/submit">掲載申請フォーム</a>から無料で申請できます。掲載内容の修正・削除、権利関係の連絡は<a href="/contact">お問い合わせフォーム</a>をご利用ください。</p>
        <p>制定日：2026年9月16日</p>
      </article>
      <WikiFooter />
    </main>
  );
}
