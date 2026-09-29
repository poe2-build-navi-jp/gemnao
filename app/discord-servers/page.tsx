import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DiscordServerDirectory } from '@/components/discord-server-directory';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { listApprovedDiscordServers } from '@/lib/discord-server-db';
import { ogImageFor } from '@/lib/og-images';

export const metadata: Metadata = {
  title: 'Discordサーバー募集を探す｜PCゲーム・日本語コミュニティ',
  description:
    'PCゲーム向けのDiscordサーバー募集をゲーム名・活動時間・VC条件で探す。掲載がない時の公式「サーバー発見」の使い方、参加前の確認、運営者向け無料掲載も案内。',
  alternates: { canonical: '/discord-servers' },
  openGraph: {
    title: 'Discordサーバー募集を探す｜PCゲーム・日本語コミュニティ',
    description:
      'PCゲームのDiscordサーバー募集を条件から探す。参加前の確認項目と無料掲載の手順も掲載。',
    type: 'website',
    url: '/discord-servers',
    images: [ogImageFor('/discord-servers')],
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogImageFor('/discord-servers')],
  },
};

const faq = [
  {
    question: 'ディスコードサーバーとは何ですか？',
    answer:
      'Discord上でテキスト・ボイスチャンネルを使って交流するコミュニティの場です。PCゲームではフレンド募集、固定パーティ、攻略情報の共有などに利用されています。',
  },
  {
    question: 'ディスコードサーバーはどうやって探しますか？',
    answer:
      'このページの掲載募集をゲーム・目的・活動時間・VC条件で絞り込みます。掲載がない場合はDiscordアプリのサーバー一覧下部にあるコンパス形の「発見」から、ゲーム名やカテゴリで公開コミュニティを探してください。発見に出ないサーバーは招待リンクが必要です。',
  },
  {
    question: 'ディスコードサーバーに参加するには？',
    answer:
      '有効な招待リンクを開くか、Discordのサーバー一覧で「+」から「サーバーに参加」を選んで招待リンクを貼り付けます。参加前にルールとプライバシー設定を確認してください。',
  },
  {
    question: 'ディスコードサーバーは自分で作れますか？',
    answer:
      'はい、無料で作れます。Discordのサーバー一覧で「+」を選び、「自分で作成」またはテンプレートを選択し、名前を付けて作成します。',
  },
  {
    question: 'Discordサーバーは無料で探せますか？',
    answer:
      'はい。検索、サーバー詳細の確認、Discordへの参加にゲムなおの利用料金はかかりません。Discord側の参加条件は各サーバーの案内を確認してください。',
  },
  {
    question: 'Discordサーバーの募集を無料で掲載できますか？',
    answer:
      '管理権限のある運営者は無料で申請できます。サーバー名・対象ゲーム・募集目的・活動時間・VC条件・参加条件・ルール・招待URLを入力します。内容と招待を確認する審査があるため、申請直後には公開されません。',
  },
  {
    question: '活動確認済みとはどういう意味ですか？',
    answer:
      'サーバー運営者が現在もメンバーを募集していると確認した日を表示します。Discord内のメッセージ数やメンバーの行動を収集するものではありません。',
  },
  {
    question: '招待リンクが切れていたらどうすればいいですか？',
    answer:
      '招待リンクは期限切れ、回数上限、運営者による招待の一時停止などで利用できなくなります。ゲムなおの掲載であればお問い合わせから該当サーバー名とURLを知らせてください。確認後、参加ボタンの停止または掲載停止を行います。',
  },
  {
    question: 'VCなし・聞き専OKのゲームサーバーは探せますか？',
    answer:
      '掲載がある場合は「ボイスチャット」で「VCなし」または「聞き専OK」を選べます。VCなしは通話を使わない募集、聞き専OKは声を出さずに参加できる募集です。参加後の運用は各サーバーのルールを確認してください。',
  },
];

export default async function DiscordServersPage() {
  let initialServers: Awaited<ReturnType<typeof listApprovedDiscordServers>> =
    [];
  let initialLoadFailed = false;
  try {
    initialServers = await listApprovedDiscordServers();
  } catch {
    initialLoadFailed = true;
  }
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Discordサーバー募集を探す｜PCゲーム・日本語コミュニティ',
      url: 'https://gemnao.pages.dev/discord-servers',
      description:
        'PCゲーム向けDiscordサーバー募集の検索、参加前の比較、無料掲載申請を案内するページです。',
      inLanguage: 'ja-JP',
      dateModified: '2026-09-30',
      isPartOf: {
        '@type': 'WebSite',
        name: 'ゲムなお',
        url: 'https://gemnao.pages.dev/',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'ゲムなお',
          item: 'https://gemnao.pages.dev/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Discordサーバー募集',
          item: 'https://gemnao.pages.dev/discord-servers',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ];

  return (
    <main>
      <WikiHeader />
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <header className="server-hero">
        <div>
          <nav className="breadcrumbs" aria-label="パンくずリスト">
            <a href="/">ゲムなお</a>
            <span>›</span>
            <b>Discordサーバー募集</b>
          </nav>
          <p className="kicker">PC GAME COMMUNITY</p>
          <h1>
            Discordサーバー募集を
            <br />
            <span>PCゲーム・日本語で探す</span>
          </h1>
          <p>
            PCゲーム向けのディスコード（Discord）サーバー募集を、ゲーム・目的・活動時間・VC条件で探せます。参加前の確認方法と、運営者向けの無料掲載手順も案内します。
          </p>
          <div className="server-hero-actions">
            <a href="#server-search-title">
              募集を探す <ArrowRight size={17} />
            </a>
            <a href="/discord-servers/submit">無料で掲載する</a>
          </div>
        </div>
      </header>

      <div className="server-page">
        <section className="server-intro" aria-labelledby="server-intro-title">
          <div>
            <p className="page-kicker">DISCORD SERVER BASICS</p>
            <h2 id="server-intro-title">ディスコードサーバーとは？</h2>
            <p>
              Discordサーバー募集は、ゲーム仲間や攻略情報を共有するコミュニティへの参加者募集です。まず下の掲載欄でゲーム名と活動時間を選び、募集目的・VC条件・参加条件を確認します。掲載がない場合はDiscord公式の「サーバー発見」でも公開コミュニティを探せます。招待リンクだけで参加できる非公開サーバーは、発見には表示されません。
            </p>
            <a
              className="server-source"
              href="https://support.discord.com/hc/ja/articles/33023827550359"
              target="_blank"
              rel="noopener noreferrer"
            >
              出典：Discord公式「サーバーセットアップガイド」
            </a>
          </div>
          <ul>
            <li>
              <CheckCircle2 size={19} />
              ゲームと募集目的で絞り込める
            </li>
            <li>
              <CheckCircle2 size={19} />
              VC必須・任意・聞き専OKが分かる
            </li>
            <li>
              <CheckCircle2 size={19} />
              募集継続の確認日を表示する
            </li>
            <li>
              <CheckCircle2 size={19} />
              招待切れや不適切な掲載を通報できる
            </li>
          </ul>
        </section>

        <DiscordServerDirectory
          initialServers={initialServers}
          initialLoadFailed={initialLoadFailed}
        />

        <section className="server-howto" aria-labelledby="server-howto-title">
          <p className="page-kicker">START HERE</p>
          <h2 id="server-howto-title">
            ディスコードサーバーの探し方・参加・作り方
          </h2>
          <div className="server-howto-grid">
            <article>
              <h3>サーバーを探す</h3>
              <p>
                上の募集欄でゲームと活動時間を選びます。掲載がない場合は、Discordアプリ左側のサーバー一覧下部にあるコンパス形の「発見」を開き、ゲーム名で検索するか「ゲーミング」を選びます。発見に出ないコミュニティは招待リンクが必要です。
              </p>
              <a
                href="https://discord.com/servers/gaming"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord公式のゲームサーバー一覧 <ArrowRight size={15} />
              </a>
              <a
                href="https://support.discord.com/hc/ja/articles/360023968311"
                target="_blank"
                rel="noopener noreferrer"
              >
                出典：Discord公式「サーバー発見」 <ArrowRight size={15} />
              </a>
            </article>
            <article>
              <h3>サーバーに参加する</h3>
              <p>
                招待リンクを開くか、Discordのサーバー一覧の「+」から「サーバーに参加」を選び、招待リンクを入力します。参加前にルールとプライバシー設定を確認しましょう。
              </p>
              <a
                href="https://support.discord.com/hc/ja/articles/360034842871"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord公式の参加手順 <ArrowRight size={15} />
              </a>
            </article>
            <article>
              <h3>サーバーを作る</h3>
              <p>
                Discordのサーバー一覧で「+」を押し、「自分で作成」またはテンプレートを選んで名前を付けます。作成は無料です。公開募集する場合は招待の設定も確認しましょう。
              </p>
              <a
                href="https://support.discord.com/hc/ja/articles/33023827550359"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord公式の作成手順 <ArrowRight size={15} />
              </a>
            </article>
          </div>
        </section>

        <section className="server-match" aria-labelledby="server-match-title">
          <p className="page-kicker">FIND YOUR GROUP</p>
          <h2 id="server-match-title">募集文はここを比較して選ぶ</h2>
          <p>
            「人数が多い」だけでは遊びやすさは分かりません。例えば平日21時から遊ぶ初心者なら、次の4点を照合してから招待を開きます。
          </p>
          <div className="server-match-table">
            <table>
              <thead>
                <tr>
                  <th scope="col">確認する項目</th>
                  <th scope="col">募集文で見る例</th>
                  <th scope="col">合わない時の探し方</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">ゲームと遊び方</th>
                  <td data-label="募集文の例">
                    PC版・クロスプレイ可否、初心者歓迎、ランクか協力プレイか
                  </td>
                  <td data-label="合わない時">
                    ゲーム名だけでなく「初心者」「協力」など目的も絞る
                  </td>
                </tr>
                <tr>
                  <th scope="row">活動時間</th>
                  <td data-label="募集文の例">
                    平日夜・土日、募集が始まる時刻、地域や時差
                  </td>
                  <td data-label="合わない時">
                    自分が参加できる曜日と時間に近い募集を選ぶ
                  </td>
                </tr>
                <tr>
                  <th scope="row">VCと参加条件</th>
                  <td data-label="募集文の例">
                    VC必須・任意・聞き専OK、年齢やランクの条件
                  </td>
                  <td data-label="合わない時">
                    声を出せないなら「聞き専OK」か「VCなし」を選ぶ
                  </td>
                </tr>
                <tr>
                  <th scope="row">募集の継続とルール</th>
                  <td data-label="募集文の例">
                    確認日、招待の有効性、禁止事項、最初に読むチャンネル
                  </td>
                  <td data-label="合わない時">
                    期限切れなら掲載元に知らせ、別の募集を探す
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            ゲムなおの「活動確認済み」は運営者による募集継続の確認であり、同時接続人数や毎日の会話量を保証する表示ではありません。
          </p>
        </section>

        <section
          className="server-recruitment"
          aria-labelledby="server-recruitment-title"
        >
          <p className="page-kicker">FOR SERVER OWNERS</p>
          <h2 id="server-recruitment-title">
            自分のDiscordサーバーでメンバーを募集する方法
          </h2>
          <ol>
            <li>
              Discordで対象サーバーを開き、チャンネル名の横などから「招待」を選びます。招待リンクの期限と使用回数を確認し、募集期間中に使える設定にします。
            </li>
            <li>
              募集文には「対象ゲーム・目的・主な曜日と時間・VC条件・参加条件・禁止事項」を具体的に書きます。例：「PC版の協力プレイ／平日21〜23時／初心者歓迎／VC任意／暴言禁止」。これは書き方の例であり、実在の掲載ではありません。
            </li>
            <li>
              <a href="/discord-servers/submit">無料掲載申請フォーム</a>
              に招待URLと募集条件を入力します。管理権限と連絡先を確認して審査するため、申請直後は一覧に出ません。
            </li>
          </ol>
          <p>
            招待の設定は
            <a
              href="https://support.discord.com/hc/ja/articles/208866998"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord公式「招待101」
            </a>
            を参照してください。
          </p>
        </section>

        <section
          className="server-safety"
          aria-labelledby="server-safety-title"
        >
          <ShieldCheck size={31} aria-hidden="true" />
          <div>
            <h2 id="server-safety-title">安全に参加するために</h2>
            <p>
              知らない相手へ本名・住所・電話番号・アカウント情報を渡さないでください。外部ファイルのダウンロード、金銭の要求、アカウント売買、チート導入を求める募集には参加せず、掲載を通報してください。
            </p>
            <a href="/discord-servers/guidelines">
              掲載ガイドラインを確認する <ArrowRight size={15} />
            </a>
          </div>
        </section>

        <section className="server-faq" aria-labelledby="server-faq-title">
          <h2 id="server-faq-title">Discordサーバー募集のよくある質問</h2>
          <div>
            {faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="server-related">
          <h2>Discord・Botで困ったとき</h2>
          <p>
            参加後の音声・画面共有トラブルや、サーバー管理者向けのBot追加・権限確認を手順で確認できます。
          </p>
          <a href="/discord/bot-add">
            Discord Botの入れ方・追加方法 <ArrowRight size={16} />
          </a>
          <a href="/discord/bot-not-responding">
            Botが反応しない・コマンドが使えない <ArrowRight size={16} />
          </a>
          <a href="/discord">
            Discordの不具合・トラブル解決を見る <ArrowRight size={16} />
          </a>
        </section>
      </div>
      <WikiFooter />
    </main>
  );
}
