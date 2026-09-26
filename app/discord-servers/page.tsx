import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DiscordServerDirectory } from '@/components/discord-server-directory';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { listApprovedDiscordServers } from '@/lib/discord-server-db';

export const metadata: Metadata = {
  title: 'ディスコード（Discord）サーバー募集・検索｜PCゲーム',
  description:
    '日本語のPCゲーム向けディスコード（Discord）サーバー募集を、ゲーム・募集目的・活動時間・VC条件から検索。活動確認日と招待リンクの状態を確認して参加できます。',
  alternates: { canonical: '/discord-servers' },
  openGraph: {
    title: 'Discordサーバー募集・検索｜ゲムなお',
    description:
      'PCゲーム向けのDiscordサーバーを、ゲーム・目的・活動時間・VC条件から探せます。',
    type: 'website',
    url: '/discord-servers',
  },
};

const faq = [
  {
    question: 'ディスコードサーバーとは何ですか？',
    answer:
      'Discord上でテキストチャットやボイスチャットを使って交流するコミュニティです。PCゲームではフレンド募集、固定パーティ、攻略情報の共有などに利用されています。',
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
      name: 'PCゲームのDiscordサーバー募集・検索',
      url: 'https://gemnao.pages.dev/discord-servers',
      description:
        '日本語のPCゲーム向けDiscordサーバー募集を条件から検索できるページです。',
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
            PCゲームの
            <br />
            <span>ディスコード（Discord）サーバー募集・検索</span>
          </h1>
          <p>
            日本語で遊べるPCゲームのDiscordサーバーを、ゲーム・募集目的・活動時間・VC条件から探せます。
            活動確認日と招待リンクの状態が分かる募集だけを掲載します。
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
            <p className="page-kicker">FIND YOUR TEAM</p>
            <h2 id="server-intro-title">目的に合うDiscordサーバーを見つける</h2>
            <p>
              Discordサーバーは、ゲーム仲間とのボイスチャット、固定パーティ募集、初心者同士の情報交換などに使われるコミュニティです。
              ゲムなおではPCゲームと日本語コミュニティに絞り、参加前に必要な条件を比較しやすくします。
            </p>
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
