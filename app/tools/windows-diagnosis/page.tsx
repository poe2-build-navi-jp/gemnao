import { SaveArticle } from '@/components/save-article';
import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/localized/index';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { WikiFooter, WikiHeader } from '@/components/wiki-header';
import { windowsDiagnosisRelease as release } from '@/lib/windows-diagnosis-release';

const title = 'PCゲーム診断ツール｜ゲームと症状を選んで調べる';
const description =
  'ゲームを限定せず、起動しない・クラッシュ・黒画面・フリーズ・低FPS・カクつきを切り分けるWindows用の試作診断ツール。ダウンロード、使い方、取得情報、結果の見方と安全な中止方法を説明します。';
export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/tools/windows-diagnosis',
    languages: languageAlternates('/tools/windows-diagnosis'),
  },
  openGraph: {
    title,
    description,
    url: '/tools/windows-diagnosis',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-default.png'],
  },
};
const symptoms = [
  {
    title: '起動しない',
    body: 'ゲームを開いても始まらない。起動前後の記録と、選択した本体の情報を確認します。',
    href: '/trouble/not-launching',
  },
  {
    title: 'クラッシュ・落ちる',
    body: '起動時やプレイ中に終了する。対象ゲームのエラー記録と周辺のPC情報を確認します。',
    href: '/trouble/crash',
  },
  {
    title: '黒画面',
    body: '音は出るが画面が映らない等。画面の状態は本人の回答が必要です。',
    href: '/guide/black-screen',
  },
  {
    title: 'フリーズ',
    body: '画面や操作が止まる。応答停止の記録が残らない場合もあります。',
    href: '/guide/pc-game-freezes',
  },
  {
    title: '低FPS',
    body: '全体的に動作が重い。FPSはこのツールで自動計測せず、本人の観察をもとに確認します。',
    href: '/guide/low-fps',
  },
  {
    title: 'カクつき',
    body: '一瞬止まる、動きが不安定。平均FPSだけでは分からない症状も整理します。',
    href: '/guide/stutter-fix',
  },
];

export default function WindowsDiagnosis() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://gemnao.pages.dev';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: title,
        description,
        url: `${siteUrl}/tools/windows-diagnosis`,
        inLanguage: 'ja',
        dateModified: '2026-10-03',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'ホーム',
            item: `${siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '便利ツール',
            item: `${siteUrl}/tools`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'PCゲーム診断',
            item: `${siteUrl}/tools/windows-diagnosis`,
          },
        ],
      },
    ],
  };
  return (
    <main>
      <WikiHeader pagePath="/tools/windows-diagnosis" />
      <article className="static-page diagnosis-download">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
          }}
        />
        <nav aria-label="パンくず">
          <a href="/">ホーム</a> › <a href="/tools">便利ツール</a> ›
          PCゲーム診断
        </nav>
        <p className="page-kicker">PC GAME DIAGNOSIS · WINDOWS 試作版</p>
        <h1>
          PCゲーム診断ツール
          <br />
          ゲームと症状を選んで調べる
        </h1>
        <p className="page-lead">
          起動しない、落ちる、黒画面、フリーズ、重い、カクつく。ゲームを選び、今の症状に合わせてPC内の記録と確認手順を整理します。
        </p>
        <p>
          特定のゲーム専用ではありません。一般のゲーム本体EXEを選ぶ共通診断と、対応するゲームだけの追加チェックを分けています。今回のモンハンワイルズでの切り分けは、ゲーム固有チェックの更新に反映しています。
        </p>
        <p>説明確認日：2026年10月3日（日本時間） · ゲムなお／オカピ研究所</p>
        <SaveArticle
          path="/tools/windows-diagnosis"
          title="PCゲーム診断ツール"
          locale="ja"
        />
        <aside className="download-caution" aria-labelledby="trial-title">
          <h2 id="trial-title">使う前に：できることと限界</h2>
          <p>
            <strong>未署名・Windows実機での新版確認前の試作版です。</strong>
            すべてのゲームでの動作や、すべての原因の特定・修復を保証するものではありません。PCの設定変更や自動修復は行いません。不安がある場合は、下の通常ガイドをご利用ください。
          </p>
          <p>
            <strong>
              もう直った場合は、わざと不具合を再現しなくて大丈夫です。
            </strong>
            直った状態を保ってください。PC全体の電源断・ブルースクリーン・異常な発熱がある場合は、ゲームを再現させず診断を中止してください。
          </p>
        </aside>
        <nav className="download-toc" aria-label="このページの目次">
          <a href="#symptoms">症状から始める</a>
          <a href="#download">ダウンロード</a>
          <a href="#start">保存・起動</a>
          <a href="#use">ゲーム選択・診断</a>
          <a href="#results">結果の見方</a>
          <a href="#history">履歴・削除</a>
          <a href="#privacy">取得情報</a>
          <a href="#help">困った時</a>
        </nav>
        <section id="symptoms">
          <h2>どんな症状ですか？</h2>
          <p>
            アプリではゲーム本体と、次の6つから近い症状を選びます。迷った場合は「その他・分からない」も選べます。アプリを使わずに進めたい場合は、各カードの通常ガイドを開けます。
          </p>
          <div className="download-grid">
            {symptoms.map((s) => (
              <div key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <a href={s.href}>通常ガイドを読む →</a>
              </div>
            ))}
          </div>
          <p>
            音・コントローラー・通信・セーブなど、6症状に当てはまらない問題は、
            <a href="/#symptoms">症状別ガイド一覧</a>
            へ。アプリにない診断機能を使えるとは案内しません。
          </p>
        </section>
        <section
          className="download-box"
          id="download"
          aria-labelledby="download-title"
        >
          <h2 id="download-title">PCゲーム診断・Windows x64版</h2>
          {release ? (
            <>
              <a
                className="download-primary"
                href={`/downloads/${release.file}`}
                download={release.file}
              >
                試作版 {release.version} のZIPをダウンロード
              </a>
              <p className="download-small">
                無料 · {release.bytes.toLocaleString('ja-JP')} bytes ·
                インストーラー不要 · アカウント不要
              </p>
              <details>
                <summary>ファイル名とSHA-256（改変確認用）</summary>
                <p>
                  <code>{release.file}</code>
                </p>
                <p>
                  <code>{release.sha256}</code>
                </p>
                <p>
                  ZIP全体のハッシュです。同梱のSHA256SUMS.txtは中のファイル用です。ハッシュ一致は、発行元のデジタル署名や安全性の保証ではありません。
                </p>
              </details>
            </>
          ) : (
            <p>
              <strong>一般ゲーム対応の配布物を確認中です。</strong>
              旧0.4を一般ゲーム用として配布することはありません。準備中は上の通常ガイドをご利用ください。
            </p>
          )}
          <dl className="download-facts">
            <div>
              <dt>必要な環境</dt>
              <dd>
                Windows 11 x64、.NET Framework 4.8以降。Windows
                10・ARM64・32-bit版での動作は未検証です。
              </dd>
            </div>
            <div>
              <dt>表示言語</dt>
              <dd>
                {release?.languages.includes('en')
                  ? '日本語・英語。日本語のWindowsでは日本語、それ以外では英語で起動します。アプリが待機中なら上部の言語選択で切り替えられます。診断内容は維持し、選択は今回の起動中だけ有効です。'
                  : 'この配布版は日本語のみです。'}
              </dd>
            </div>
            <div>
              <dt>対象ゲーム</dt>
              <dd>
                自分でローカルのゲーム本体EXEを選択。ランチャー・保護された配置・ネットワーク保存先など、選択や読み取りができない環境があります。全ゲームでの対応確認はしていません。
              </dd>
            </div>
            <div>
              <dt>共通の確認</dt>
              <dd>
                選択したゲームに関係するWindows記録、PC情報、本人が選んだ症状・試した手順・結果。黒画面やFPSを自動測定する機能ではありません。
              </dd>
            </div>
            <div>
              <dt>ゲーム固有の確認</dt>
              <dd>
                ワイルズ用の既知痕跡・CrashReport解析などは、対応する固有プロファイルだけで使用します。一般ゲームに同じ意味を当てはめません。
              </dd>
            </div>
            <div>
              <dt>確認済みの範囲</dt>
              <dd>
                {release?.version}はコンパイル、{release?.syntheticTests}
                件の合成テスト、配布内容の確認済みです。Windows実機検証とは別です。新版のWindowsでの画面操作・実ゲームでの取得・履歴保護・削除操作は未検証です。
              </dd>
            </div>
          </dl>
        </section>
        <section id="start">
          <h2>① 保存して、ZIPを展開する</h2>
          <ol className="download-steps">
            <li>
              <h3>ダウンロードボタンからZIPを保存</h3>
              <p>
                通常はエクスプローラーの「ダウンロード」に入ります。保存場所を選べる場合は、OneDriveなどの同期先を避けたPC内のフォルダにしてください。
              </p>
            </li>
            <li>
              <h3>ZIPを右クリック →「すべて展開」</h3>
              <p>
                フォルダ全体を展開します。ZIPを開いた画面の中から直接EXEを実行しないでください。別の解凍ソフトやPowerShellは不要です。
              </p>
            </li>
            <li>
              <h3>「最初に読む.txt」を読み、アプリを通常起動</h3>
              <p>
                <code>Gemnao.Diagnostics.exe</code>{' '}
                をダブルクリックします。拡張子が非表示なら「Gemnao.Diagnostics」というアプリです。同梱の
                .exe.config
                も同じフォルダに置いてください。インストール操作や管理者実行は不要です。未保存の作業は先に保存してください。
              </p>
            </li>
          </ol>
          <SaveArticle
            path="/tools/windows-diagnosis"
            title="PCゲーム診断ツール"
            locale="ja"
          />
          <aside className="download-caution">
            <h3>Windowsの保護機能に止められたら中止</h3>
            <p>
              SmartScreen、ウイルス対策、組織ポリシーで停止した場合は進めず、警告を閉じてください。保護の無効化・除外設定・管理者実行・実行ポリシー変更で回避しないでください。
            </p>
          </aside>
        </section>
        <section id="use">
          <h2>② ゲームと症状を選んで、必要な記録だけ読む</h2>
          <ol className="download-steps" start={4}>
            <li>
              <h3>「1 準備」でルール・症状・配布元を選ぶ</h3>
              <p>
                まず「診断するルール」は「PCゲーム共通（通常はこちら）」を選びます。「困っている症状」と「ゲームの配布元」を選び、取得範囲に同意してから「自分で本体EXEを選ぶ」で対象を選択します。Steamなら対象ゲームを右クリック
                →「管理」→「ローカルファイルを閲覧」で場所を確認できます。別のランチャーなら、その製品の公式手順でインストール先を確認してください。
              </p>
              <p>
                Steam.exe、CrashReport.exe、アンインストーラー、別ゲームのEXEは対象本体として選びません。本体が分からない・保護されたフォルダで選べない場合は、権限を変えず通常ガイドへ進みます。症状は上の6つから近いものを選びます。
              </p>
            </li>
            <li>
              <h3>読み取り範囲と、追加チェックの同意を確認</h3>
              <p>
                起動しただけでPC全体を調べるものではありません。説明を読んでPC内の取得に同意し、自分で読み取りを始めます。任意チェックは必要なものだけ。「発生する場面」「発生する頻度」「PC全体の状態」なども、分かる範囲で回答します。性能症状で画質を1項目変えた場合だけ、その結果を記録してください。すべての操作を試す必要はありません。
              </p>
            </li>
            <li>
              <h3>すでに起きた記録を読む、または安全な1回の確認</h3>
              <p>
                すでに症状が起きた直後なら「すでに症状が出た場合:
                直近10分を読む」で直近の記録を読みます。新たに確認が必要で安全な場合だけ、「症状を確認する直前
                →
                記録開始」を押してから普段と同じ方法でゲームを1回起動し、症状を確認し、レポートがある場合は生成完了を待って「症状確認・レポート生成完了後
                →
                読み取る」を押します。アプリがゲームを自動起動することはありません。
              </p>
              <p>
                CrashReportなどが作成中なら、完了を待ってください。PC全体に異常がある場合や、すでに直っている場合は、わざと再現させません。
              </p>
            </li>
            <li>
              <h3>0件・反映待ちなら、再起動せず同じ記録を再読取り</h3>
              <p>
                「起動し直さず、同じ記録を読み直す」で、開始時刻・手順記録を保ったまま読み直せます。元の開始から30分までです。別の起動や設定変更を挟んだ場合は、同じ記録として扱わず、必要な結果を保存して新しい診断にします。
              </p>
            </li>
          </ol>
        </section>
        <section id="results">
          <h2>③ 結果の見方：観測・本人の回答・推測を分ける</h2>
          <div className="download-grid">
            <div>
              <h3>共通の観測</h3>
              <p>
                PC情報や対象ゲームのエラー・応答停止などの記録です。記録が0件でも、正常・解決した証明ではありません。
              </p>
            </div>
            <div>
              <h3>本人の症状と結果</h3>
              <p>
                黒画面、重さ、カクつき、改善の有無は本人の回答が必要です。ログだけで見た目やFPSを自動判定しません。
              </p>
            </div>
            <div>
              <h3>ゲーム固有の追加情報</h3>
              <p>
                対応プロファイルの説明がある時だけ使います。DLLの存在や読込み、1回の改善だけで、原因を確定しません。
              </p>
            </div>
          </div>
          <p>
            次の確認手順を読み、試すなら1つずつ。以前試して変わらなかった手順は繰り返さず記録します。必要な再テストは「1つ試したら
            →
            同じ場面を再テスト」から進めます。悪化やPC全体の異常があれば中止。改善したら追加変更を止めてください。ドライバーの最新版判定、ゲーム設定の自動修復、全ゲームの動作保証はしません。
          </p>
        </section>
        <section id="history">
          <h2>④ 履歴・書き出しは必要な方だけ</h2>
          <p>
            試した手順と本人の結果を記録できます。次回も残す場合だけ、履歴の保存に同意し「このPCに履歴を保存」を押します。チェックだけでは保存しません。最大64記録で、既存の保存は確認後に置き換えます。
          </p>
          <p>
            保存場所は{' '}
            <code>%LOCALAPPDATA%\Gemnao\GameDiagnosis\history-v2.dat</code>{' '}
            です。書き込み中の中断で history-v2.tmp
            が残る場合もあります。旧0.4のWildsDiagnosis内の履歴は自動移行・読み込みしません。履歴は本体の場所・診断区分・症状の照合が一致したものだけを、本人が内容を確認して読み込みます。過去の観測を現在の比較基準と同じものにはしません。未保存の診断結果はアプリを閉じると消えます。
          </p>
          <h3>診断テキストと改善報告は別のもの</h3>
          <p>
            共有用テキストは、保存される全文を確認してから自分でローカル保存先を選びます。一般ゲームでは改善報告JSONは無効です。ワイルズSteam版の固有ルールで「起動できない」を選んだ場合だけ使える改善報告JSONも、別途内容を確認してローカル保存するだけです。診断テキストの保存と、改善報告JSONを混同しないでください。
          </p>
          <p>
            <strong>
              Webの報告受付は準備中です。保存はサイトへの送信ではありません。
            </strong>
            外部への自動送信、自動更新、自動学習はありません。
          </p>
          <h3>履歴の削除・使わなくなった時</h3>
          <ol>
            <li>
              保存履歴が不要ならアプリの「保存履歴をゴミ箱へ」を使い、アプリとWindowsの確認内容を読みます。完全削除になる警告なら取り消してください。画面内の履歴は残るので、新しい診断の開始または終了で整理します。
            </li>
            <li>
              アプリを閉じ、展開フォルダとダウンロードZIPをエクスプローラーでゴミ箱へ移します。インストーラー・常駐サービス・自動起動登録はありません。
            </li>
            <li>
              アプリのフォルダだけを消しても、保存履歴や別の場所に書き出したテキスト/JSONは消えません。不要な書き出しは個別にゴミ箱へ。同期先やバックアップは別管理です。
            </li>
          </ol>
        </section>
        <section id="privacy">
          <h2>何を読み取り、何を送る？</h2>
          <p>
            <strong>
              アプリにネットワーク送信・AI呼出し・テレメトリー・自動アップロードはありません。
            </strong>
            本人が公式ガイドを開いた場合のブラウザー通信、同期フォルダへの保存による同期は別です。診断情報をURLへ付けません。Webページ自体の通信は
            <a href="/privacy">サイトのプライバシーポリシー</a>
            を確認してください。
          </p>
          <details>
            <summary>共通の読み取り範囲</summary>
            <p>
              選択したゲームEXEの版、OS・CPU・GPU・ドライバー・RAM・ドライブ容量、該当する互換モード登録、限定したWindowsイベント（1000/1002/4101/41）などを確認します。全ドライブを走査したり、セーブやログイン情報を読んだりしません。取得できない項目は不明のまま扱い、勝手に権限を上げません。
            </p>
          </details>
          <details>
            <summary>ゲーム固有・任意チェック</summary>
            <p>
              「Monster Hunter Wilds
              Steam版の固有ルール」を選んだ場合だけ、ワイルズ検索と固有の追加確認を使います。一般コースはゲームフォルダや独自ログ/ZIPを走査しません。固有コースの追加同意では既知の痕跡、製品版登録のLastPlayed形式、限定したCrashReport解析などを利用します。ワイルズの「起動できない」向けの推奨ルールを、ほかの症状へ同じ意味で当てはめません。存在・読込み・原因・正常プレイは区別します。Steam側の追加確認も対象を確認し、ゲーム本体とは別に扱います。
            </p>
            <p>
              CrashReport
              ZIPの限定解析では、ダンプのバイト列が一時的にメモリへ展開され、個人情報を含む可能性があります。メモリ内容・レジスタ・スタック・命令は解析・保存・出力しません。一般ゲームの任意のZIPやダンプを解析する機能ではありません。
            </p>
          </details>
          <details>
            <summary>保存・共有時の注意</summary>
            <p>
              共有用出力は固定項目に絞り、ユーザー名、フルパス、生ログ等を除きますが、完全匿名ではありません。OSやドライバー版、容量、選んだ手順などが残る場合があります。保存前・共有前に全文を確認してください。スクリーンショットにはパスやCPU/GPU名が写る場合があります。
            </p>
            <p>
              任意保存の履歴は、このWindowsユーザー用のDPAPI保護を使います。同じユーザーの別のソフトや侵害されたPCからの完全な秘匿は保証しません。Windowsのバックアップ・ページファイルや同期ソフトは、このアプリでは制御しません。詳細は同梱の説明を確認してください。
            </p>
          </details>
        </section>
        <section id="help">
          <h2>困った時</h2>
          <details>
            <summary>EXEがない・保護で止まる</summary>
            <p>
              ZIPの画面ではなく、全体を展開したフォルダを確認してください。隔離されていた場合は勝手に復元・除外せず、利用を中止します。
            </p>
          </details>
          <details>
            <summary>.NETのエラーが出る</summary>
            <p>
              必要なのは .NET Framework 4.8以降です。.NET
              8/10や開発用SDKを追加する手順ではありません。Windows
              11には通常4.8または4.8.1が含まれます。
              <a href="https://learn.microsoft.com/en-us/dotnet/framework/install/on-windows-and-server">
                Microsoft公式のOS別説明
              </a>
              で必要性を確認した場合だけ、
              <a href="https://dotnet.microsoft.com/en-us/download/dotnet-framework/net48">
                公式Runtime案内
              </a>
              を参照してください。新しい版から古い版へ戻さないでください。
            </p>
          </details>
          <details>
            <summary>本体EXEが分からない・読めない</summary>
            <p>
              ゲームの公式案内やランチャーのインストール先表示を確認します。保護されたフォルダの権限を変えたり、管理者実行で回避したりしないでください。本体を選べないゲームは通常ガイドで進めてください。
            </p>
          </details>
          <details>
            <summary>黒画面・低FPSなのにエラーが0件</summary>
            <p>
              その症状はWindowsイベントに残らないこともあります。0件を問題なしと判断せず、本人が症状・起きる場面・試した後の変化を確認します。アプリは画面の内容やFPSを自動計測しません。
            </p>
          </details>
          <details>
            <summary>動きが止まる・PC全体に異常がある</summary>
            <p>
              Windows
              APIや環境によって読み取りが遅れる場合があります。中止するかウィンドウを閉じてください。電源断・ブルースクリーン・異常な熱があれば、繰り返しゲームを起動して再現しないでください。
            </p>
          </details>
        </section>
        <section id="older-version">
          <h2>旧バージョンについて</h2>
          {release?.version !== '0.5.0' ? (
            <details>
              <summary>0.5.0は日本語のみの旧版です</summary>
              <p>
                一般ゲーム向けの旧試作版です。英語の画面・診断文は含まれません。既存ファイルとの照合用に
                <a
                  href="/downloads/gemnao-game-diagnosis-0.5.0-windows-x64.zip"
                  download
                >
                  旧0.5.0（日本語のみ）
                </a>
                を残しています。未署名・Windows実機での新版確認前です。
              </p>
              <p>
                210,897 bytes · SHA-256：
                <code>
                  88023049dee7e92aad94f6d6653b4a63e2eedf3a086e0bb6e5ca8058a4cdaaa0
                </code>
              </p>
            </details>
          ) : null}
          <details>
            <summary>0.4.0はワイルズ専用の旧版です</summary>
            <p>
              旧版は一般ゲーム・6症状向けではありません。新版の代わりとして使わないでください。既存の配布ファイルとの照合用に、
              <a
                href="/downloads/gemnao-wilds-diagnosis-0.4.0-windows-x64.zip"
                download
              >
                旧0.4.0（ワイルズ限定）
              </a>
              を残しています。未署名・新機能実機未検証です。
            </p>
            <p>
              192,536 bytes · SHA-256：
              <code>
                bc39326824f113ab61abd590403432e9743a7edb1a3cbef644c30ac2f379e229
              </code>
            </p>
          </details>
        </section>
        <p className="download-small">
          実機画面を撮影したガイドではありません。操作説明は同梱ソース・説明に照合し、Windowsでの全操作検証とは区別しています。
        </p>
        <p>
          <a href="/tools">便利ツール一覧へ戻る</a>
        </p>
      </article>
      <WikiFooter />
    </main>
  );
}
