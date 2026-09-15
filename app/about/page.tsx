import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { siteConfig } from '@/lib/site-config';
export const metadata: Metadata = {
  title: 'このサイトについて',
  description: 'ゲムなおの運営方針、情報の確認方法、お問い合わせについて。',
  alternates: { canonical: '/about' },
};
export default function About() {
  return (
    <main>
      <WikiHeader />
      <article className="static-page">
        <p className="page-kicker">ABOUT</p>
        <h1>このサイトについて</h1>
        <p className="page-lead">
          「ゲムなお」は、ゲムなお編集部が運営する、PC版ゲームの起動トラブルや設定を試す順番でまとめる日本語のお直しWikiです。
        </p>
        <h2>編集・出典方針</h2>
        <p>
          公式サポート、開発元、公式ストアを優先し、補足が必要な場合のみ信頼できる技術資料や複数のユーザー報告を照合します。外部文章や画像は転載せず、独自の表現で要約して出典へリンクします。
        </p>
        <h2>更新・訂正方針</h2>
        <p>
          記事には最終確認日を表示し、大型アップデートや公式修正で内容が変わった場合は再確認します。誤りの指摘を受けた場合は出典と実機条件を確認し、必要に応じて本文と確認日を訂正します。
        </p>
        <h2>数字の見方</h2>
        <p>
          「需要」はプレイ動向と公開情報を基にした相対評価で、正確な人数ではありません。「困っている」「解決した」は、ゲムなお内の匿名回答件数です。別人物であることを保証する人数としては扱いません。
        </p>
        <h2>広告・アフィリエイト</h2>
        <p>
          運営費のためにGoogle
          AdSense等の広告を掲載する場合があります。広告は本文と区別できる形で表示します。商品の購入に応じたアフィリエイト報酬は受け取っていません。
        </p>
        <h2 id="contact">お問い合わせ</h2>
        {siteConfig.contactEmail ? (
          <p>
            記事の訂正、権利に関するご連絡、その他のお問い合わせは{' '}
            <a href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>{' '}
            へお送りください。
          </p>
        ) : (
          <div className="contact-status">
            <strong>記事の訂正・権利関係のお問い合わせ窓口</strong>
            <p>
              <a href="/contact">お問い合わせフォーム</a>
              から送信できます。返信先メールアドレスは任意です。
            </p>
          </div>
        )}
        <p className="source-note">最終確認：2026.09.14</p>
      </article>
      <WikiFooter />
    </main>
  );
}
