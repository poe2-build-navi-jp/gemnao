import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DiscordServerDirectory } from '@/components/discord-server-directory';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { listApprovedDiscordServers } from '@/lib/discord-server-db';

export const metadata: Metadata = {
  title: 'ディスコードサーバーとは？探し方・参加方法・PCゲーム募集',
  description:
    'ディスコード（Discord）サーバーとは何か、探し方・招待リンクでの参加方法・無料での作り方を解説。日本語のPCゲーム向けサーバー募集も条件から探せます。',
  alternates: { canonical: '/discord-servers' },
  openGraph: {
    title: 'ディスコードサーバーの探し方・参加方法｜ゲムなお',
    description:
      'Discordサーバーの基本、探し方、参加方法と作り方。PCゲーム向けの募集も探せます。',
    type: 'website',
    url: '/discord-servers',
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
      'PCゲームの日本語コミュニティはこのページの募集欄でゲーム・目的・活動時間・VC条件から探せます。公開サーバーはDiscord公式のサーバーディレクトリでも探せます。掲載がないときは公式ディレクトリを確認してください。',
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
      '掲載申請は無料です。安全性と内容を確認する審査があり、申請直後には公開されません。',
  },
  {
    question: '活動確認済みとはどういう意味ですか？',
    answer:
      'サーバー運営者が現在もメンバーを募集していると確認した日を表示します。Discord内のメッセージ数やメンバーの行動を収集するものではありません。',
  },
  {
    question: '招待リンクが切れていたらどうすればいいですか？',
    answer:
      '各掲載の通報窓口から知らせてください。確認後、参加ボタンの停止または掲載停止を行います。',
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
      name: 'ディスコードサーバーの探し方・参加方法・PCゲーム募集',
      url: 'https://gemnao.pages.dev/discord-servers',
      description:
        'Discordサーバーの基本、探し方、参加方法と作り方を解説し、PCゲーム向けの募集を条件から探せるページです。',
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
          name: 'Discordサーバーの探し方',
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
            <b>Discordサーバーの探し方</b>
          </nav>
          <p className="kicker">PC GAME COMMUNITY</p>
          <h1>
            ディスコード（Discord）サーバーの
            <br />
            <span>探し方・参加方法</span>
          </h1>
          <p>
            サーバーの基本から、探し方・招待リンクでの参加・作り方まで案内します。
            日本語のPCゲーム向け募集は、ゲーム・目的・活動時間・VC条件から絞り込めます。
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
              Discordサーバーは、テキスト・ボイスチャンネルで会話や情報共有ができるコミュニティの場です。
              PCゲームならフレンド募集や攻略相談に使えます。自分で無料作成するほか、招待リンクや公開サーバーの一覧から参加先を探せます。
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
                上の募集欄でゲームや活動時間を選びます。ゲムなおに掲載がない場合は、Discord公式の公開サーバー一覧からゲーム名を検索できます。
              </p>
              <a
                href="https://discord.com/servers/gaming"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord公式のゲームサーバー一覧 <ArrowRight size={15} />
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

        <section className="server-guide" aria-labelledby="server-guide-title">
          <p className="page-kicker">HOW TO CHOOSE</p>
          <h2 id="server-guide-title">Discordサーバー募集の選び方</h2>
          <div className="server-guide-grid">
            <article>
              <span>01</span>
              <h3>遊ぶゲームを選ぶ</h3>
              <p>
                同じゲームでもPC版・クロスプレイ・使用MODなどの参加条件を確認します。
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>募集目的を合わせる</h3>
              <p>
                フレンド、ランク、固定パーティ、初心者募集など、自分の目的に近い募集を選びます。
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>時間とVC条件を見る</h3>
              <p>
                普段遊ぶ曜日・時間帯と、VC必須・聞き専OKなどの条件を参加前に確認します。
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>ルールを読んで参加する</h3>
              <p>
                年齢条件、禁止事項、退出方法を読み、個人情報を公開しすぎないように参加します。
              </p>
            </article>
          </div>
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
