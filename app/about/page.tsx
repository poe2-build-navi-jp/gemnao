import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { siteConfig } from '@/lib/site-config';
export const metadata: Metadata = {
  title: 'ゲムなおとは？運営者情報・編集方針',
  description:
    'ゲムなおの運営者、出典の確認方法、記事の訂正方針、広告・製品提供の開示、PC・周辺機器メーカーからの企画相談について案内します。',
  alternates: { canonical: '/about' },
};
export default function About() {
  return (
    <main>
      <WikiHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            '@id': `${siteConfig.url}/about#page`,
            url: `${siteConfig.url}/about`,
            name: 'ゲムなおとは？運営者情報・編集方針',
            description: siteConfig.description,
            inLanguage: 'ja-JP',
            isPartOf: { '@id': `${siteConfig.url}/#website` },
            about: [
              { '@id': `${siteConfig.url}/#website` },
              { '@id': `${siteConfig.url}/#operator` },
            ],
          }),
        }}
      />
      <article className="static-page">
        <p className="page-kicker">ABOUT</p>
        <h1>ゲムなおとは？運営者情報・編集方針</h1>
        <p className="page-lead">{siteConfig.description}</p>
        <h2>ゲムなおで調べられること</h2>
        <p>
          ゲーム名や症状から記事を探し、設定画面を開く操作、確認結果の読み方、改善しなかった場合の次の行動を確認できます。記事の閲覧は無料で、個別の修理や復旧を代行するサービスではありません。
        </p>
        <ul>
          <li>
            <a href="/guide">PCゲーム共通ガイド</a>
            ：起動しない、クラッシュ、FPS、セーブ、MODなど。
          </li>
          <li>
            <a href="/discord">Discordの不具合</a>
            ：音声、接続、画面共有、Botなど。
          </li>
          <li>
            <a href="/pc">PC・Windowsの不具合</a>
            ：更新後の音声、Wi-Fi、USB、モニターなど。
          </li>
          <li>
            <a href="/discord-servers">Discordサーバー募集</a>
            ：PCゲームの日本語コミュニティの探し方と、運営者向け無料掲載申請。
          </li>
        </ul>
        <h2>サイト運営者情報</h2>
        <dl>
          <dt>運営者</dt>
          <dd>{siteConfig.operatorName}</dd>
          <dt>メールアドレス</dt>
          <dd>
            <a href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
          </dd>
        </dl>
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
          AdSense等の広告を掲載する場合があります。広告は本文と区別できる形で表示します。また、Amazonアソシエイト・プログラムに参加しています。Amazonのアソシエイトとして、ゲムなおは適格販売により収入を得ています。アソシエイトのリンクを含むページやリンクの近くには「広告」「PR」と表示し、紹介内容はメーカー公式情報などで確認した事実に基づいて編集しています。
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
        <p>
          <a href="/contact">お問い合わせフォーム</a>からもご連絡いただけます。
        </p>
        <section id="business">
          <h2>PC・周辺機器メーカーの皆さまへ</h2>
          <p>
            ゲムなおでは、PCゲームの不具合を調べる読者に向けた、使い方案内・トラブル切り分けの記事を公開しています。製品の公式情報の訂正や、貸出機を用いた検証記事の企画についてご相談いただけます。内容・機材・日程を確認してから対応の可否をお伝えします。
          </p>
          <h3>公開中のコンテンツと機能</h3>
          <ul>
            <li><a href="/guide">症状別の確認手順</a>と、ゲーム・Windows・Discordの関連記事</li>
            <li><a href="/tools/windows-diagnosis">Windows向け診断ツールの配布・使い方</a>。対応範囲と制限は配布ページに記載しています</li>
            <li><a href="/gear/discord-microphone-guide">購入前の比較ポイント</a>。手持ちの機器や無料の設定確認で足りる場合も案内します</li>
          </ul>
          <h3>検証・広告の扱い</h3>
          <ul>
            <li>公式仕様の紹介と実機検証を区別します。未使用の製品を実機レビューとして扱いません。</li>
            <li>実機検証を行う場合は、使用機材・設定・ソフトウェアの版・確認日・検証範囲を記載します。未実施の測定値や実績を掲載しません。</li>
            <li>広告、報酬、製品提供・貸出などの関係は、読者が分かるよう記事内に明記します。</li>
            <li>読者の判断に必要な制限や改善しなかった結果も記載します。肯定的な評価、検索順位、閲覧数、販売数は保証しません。</li>
            <li>記事の事実確認と編集判断を分け、誤りが見つかった場合は訂正します。</li>
          </ul>
          <p>
            <a href="/contact?category=business#business">企画相談を送る</a>
            。問い合わせだけで契約や掲載が確定することはありません。
          </p>
        </section>
        <p className="source-note">最終確認：2026.10.03（企画相談・編集方針）</p>
      </article>
      <WikiFooter />
    </main>
  );
}
