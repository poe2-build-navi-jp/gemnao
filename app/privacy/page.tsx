import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  alternates: { canonical: '/privacy' },
};
export default function Privacy() {
  return (
    <main>
      <WikiHeader />
      <article className="static-page">
        <p className="page-kicker">PRIVACY</p>
        <h1>プライバシーポリシー</h1>
        <p className="page-lead">
          本サイトにおける利用者情報の取り扱いを説明します。
        </p>
        <h2>困りごと・解決回答の集計</h2>
        <p>
          各ガイドの「困っている」「解決した」ボタンは、ゲームと項目ごとの回答件数だけを保存します。名前、メールアドレス、投票時の入力内容など、個人を特定する情報は保存しません。同じブラウザからの重複回答を減らすため、回答済みの印を端末内に保存します。
        </p>
        <h2>アクセス解析</h2>
        <p>
          公開後、サイト改善のためにGoogle
          Analytics等を使用する場合があります。これらはCookieを使用し、個人を特定しない形で利用状況を収集します。
        </p>
        <h2>広告配信</h2>
        <p>
          Googleなどの第三者配信事業者はCookie、ウェブビーコン、IPアドレス等を使用し、本サイトや他サイトへの過去のアクセス情報に基づく広告を配信する場合があります。Googleとそのパートナーによる広告Cookieの利用により、利用者のアクセスに応じた広告が表示されます。
        </p>
        <p>
          パーソナライズ広告は
          <a
            href="https://adssettings.google.com/"
            target="_blank"
            rel="noreferrer"
          >
            Google広告設定
          </a>
          で無効にできます。第三者配信事業者に関する情報は
          <a
            href="https://support.google.com/adsense/answer/9012903"
            target="_blank"
            rel="noreferrer"
          >
            Googleの案内
          </a>
          を確認してください。
        </p>
        <h2>EEA・英国・スイスの同意管理</h2>
        <p>
          対象地域へ広告を配信する場合、Google認定CMPを通じて必要な同意情報を取得できる構成を使用します。同意画面の提供状況はGoogle
          AdSense側の「プライバシーとメッセージ」設定にも依存します。
        </p>
        <h2>お問い合わせフォーム</h2>
        <p>
          フォームでは、お問い合わせ種別、対象ページURL、入力本文、任意の返信先メールアドレスを保存します。対応、権利確認、記事品質改善に必要な範囲で使用し、第三者へ販売しません。返信先を入力しない場合は個別返信を行いません。
        </p>
        <h2>個人情報の取り扱い</h2>
        <p>
          法令に基づく場合を除き、フォームで取得した情報を本人の同意なく目的外利用または第三者提供しません。開示・訂正・削除の相談は
          <a href="/contact">お問い合わせフォーム</a>から受け付けます。
        </p>
        <h2>外部リンク</h2>
        <p>
          外部サイトで提供される情報や個人情報の取り扱いについて、本サイトは責任を負いません。
        </p>
        <h2>改定</h2>
        <p>
          法令や運営方針の変更に応じ、本ポリシーを改定する場合があります。制定日：2026年9月6日　改定日：2026年9月14日
        </p>
      </article>
      <WikiFooter />
    </main>
  );
}
