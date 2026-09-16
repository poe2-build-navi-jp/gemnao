import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
export const metadata: Metadata = {
  title: '利用規約・免責事項',
  alternates: { canonical: '/terms' },
};
export default function Terms() {
  return (
    <main>
      <WikiHeader />
      <article className="static-page">
        <p className="page-kicker">TERMS</p>
        <h1>利用規約・免責事項</h1>
        <p className="page-lead">
          本サイトの情報を利用する前に、以下をご確認ください。
        </p>
        <h2>情報の正確性</h2>
        <p>
          掲載時点で正確な情報の提供に努めますが、ゲーム本体、OS、ドライバー、MODの更新により手順が古くなる場合があります。
        </p>
        <h2>自己責任</h2>
        <p>
          設定ファイルの変更、MOD導入、セーブ移行は自己責任で行ってください。必ずバックアップを作成し、オンラインゲームでは利用規約とアンチチートの仕様を優先してください。
        </p>
        <h2>著作権・商標</h2>
        <p>
          各ゲームの名称、画像、商標はそれぞれの権利者に帰属します。本サイトは各開発元・発売元と提携する公式サイトではありません。
        </p>
        <h2>禁止事項</h2>
        <p>
          本サイトの文章を無断で複製・再配布する行為、および不正アクセスや運営を妨げる行為を禁止します。
        </p>
        <h2>Discordサーバー募集</h2>
        <p>
          サーバー募集は審査後に掲載します。虚偽情報、成人向け・出会い目的、RMT、アカウント売買、チート、海賊版、詐欺、マルウェア、違法行為を含む掲載は禁止します。詳細は
          <a href="/discord-servers/guidelines">Discordサーバー掲載ガイドライン</a>
          を確認してください。本サイトはDiscord Inc.とは無関係の非公式サービスです。
        </p>
        <h2>MOD・外部ツール</h2>
        <p>
          本サイトは正規配布元の通常MOD、設定変更、競合解消のみを扱います。クラック、DRM回避、海賊版、有料コンテンツの不正解除、オンライン上の不正行為を目的とする情報は掲載しません。
        </p>
        <h2>お問い合わせ</h2>
        <p>
          権利侵害、誤情報、プライバシーに関する連絡は
          <a href="/contact">お問い合わせフォーム</a>から受け付けます。
        </p>
      </article>
      <WikiFooter />
    </main>
  );
}
