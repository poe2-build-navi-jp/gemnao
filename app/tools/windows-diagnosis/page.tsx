import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { WikiFooter, WikiHeader } from '@/components/wiki-header';

const file = 'gemnao-wilds-diagnosis-0.4.0-windows-x64.zip';
const checksum =
  'bc39326824f113ab61abd590403432e9743a7edb1a3cbef644c30ac2f379e229';
const title = 'ワイルズ起動診断ツール｜ダウンロードと使い方';
const description =
  'ゲムなおのWindows用ワイルズ起動診断 0.4.0（試作版）。ZIPの展開からゲームの選択、記録の読み取り、結果の見方、任意の履歴保存・削除まで、初めての方向けに説明します。';
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/tools/windows-diagnosis' },
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

export default function WindowsDiagnosis() {
  return (
    <main>
      <WikiHeader pagePath="/tools/windows-diagnosis" />
      <article className="static-page diagnosis-download">
        <nav aria-label="パンくず">
          <a href="/">ホーム</a> › <a href="/tools">便利ツール</a> ›
          ワイルズ起動診断
        </nav>
        <p className="page-kicker">WINDOWS DOWNLOAD · 0.4.0 試作版</p>
        <h1>
          ワイルズ起動診断ツール
          <br />
          ダウンロードと使い方
        </h1>
        <p className="page-lead">
          Steamで「プレイ」を押した直後にワイルズが落ちる。そんな時に、PC内の限られた記録を確認して、次に確かめることを整理するWindowsアプリです。
        </p>
        <p>確認日：2026年10月2日 · ゲムなお／オカピ研究所</p>
        <aside className="download-caution" aria-labelledby="trial-title">
          <h2 id="trial-title">ダウンロードする前に</h2>
          <p>
            <strong>未署名・Windows実機での0.4動作確認前の試作版です。</strong>
            原因の確定や修復を保証しません。PCの設定変更や自動修復は行いません。初心者の方も、この制約に不安があれば利用を見送ってください。
          </p>
          <p>
            <strong>
              もうゲームが動く方は、わざと不具合を再現しなくて大丈夫です。
            </strong>
            直った状態を保ち、必要なら過去に試した手順だけ記録してください。電源断・ブルースクリーン・異常な発熱がある時は、再現テストを中止してください。
          </p>
        </aside>
        <section
          className="download-box"
          id="download"
          aria-labelledby="download-title"
        >
          <h2 id="download-title">Windows x64版を保存</h2>
          <p>
            対象：Steam製品版 Monster Hunter Wilds
            の起動時クラッシュ。ほかのゲーム、体験版・ベンチマークを診断するものではありません。
          </p>
          <a
            className="download-primary"
            href={`/downloads/${file}`}
            download={file}
          >
            試作版 0.4.0 のZIPをダウンロード
          </a>
          <p className="download-small">
            無料 · 192,536 bytes（約188 KiB） · インストーラー不要 ·
            アカウント不要
          </p>
          <dl className="download-facts">
            <div>
              <dt>必要な環境</dt>
              <dd>
                Windows 11 x64、.NET Framework 4.8以降。Windows
                10・ARM64・32-bit版での動作は未検証です。
              </dd>
            </div>
            <div>
              <dt>確認済みの範囲</dt>
              <dd>
                Windows向けコンパイル、313件の合成テスト、配布物の内容確認。0.4の画面操作、Steam読取り、履歴保護・ゴミ箱操作はWindows実機未検証です。
              </dd>
            </div>
            <div>
              <dt>ZIPに入っているもの</dt>
              <dd>
                実行ファイル、設定ファイル、最初に読む.txt、SHA256SUMS.txt、sourceフォルダ（ソース・説明・合成テスト）。実ユーザーのログやダンプは含みません。
              </dd>
            </div>
            <div>
              <dt>開くファイル</dt>
              <dd>
                <code>Gemnao.Diagnostics.exe</code>（同梱の .exe.config
                も同じ場所に置きます）
              </dd>
            </div>
          </dl>
          <details>
            <summary>ファイル名とSHA-256（改変確認用）</summary>
            <p>
              <code>{file}</code>
            </p>
            <p>
              <code>{checksum}</code>
            </p>
            <p>
              ZIP全体のハッシュです。同梱のSHA256SUMS.txtは中のファイル用です。ハッシュの一致は発行元のデジタル署名や安全性の保証ではありません。
            </p>
          </details>
        </section>
        <nav className="download-toc" aria-label="このページの目次">
          <a href="#start">① 保存・起動</a>
          <a href="#use">② ゲーム選択・診断</a>
          <a href="#results">③ 結果の見方</a>
          <a href="#history">④ 履歴・保存・削除</a>
          <a href="#privacy">読み取る情報</a>
          <a href="#help">困った時</a>
        </nav>
        <section id="start">
          <h2>① 保存して、ZIPを展開する</h2>
          <ol className="download-steps">
            <li>
              <h3>上のダウンロードボタンを押す</h3>
              <p>
                ブラウザーで保存します。通常はエクスプローラーの「ダウンロード」に入ります。保存場所を選べる場合は、OneDriveなどの同期先を避けたPC内のフォルダにしてください。
              </p>
            </li>
            <li>
              <h3>ZIPを右クリック →「すべて展開」</h3>
              <p>
                エクスプローラーで保存したZIPを探し、「すべて展開」からフォルダ全体を展開します。ZIPを開いた画面の中から直接EXEを実行しないでください。
              </p>
            </li>
            <li>
              <h3>「最初に読む.txt」を読む → EXEを開く</h3>
              <p>
                展開先の <code>Gemnao.Diagnostics.exe</code>{' '}
                をダブルクリックします。拡張子が非表示なら「Gemnao.Diagnostics」というアプリです。設定ファイル（.config）やsourceフォルダではありません。管理者として実行する必要はありません。
              </p>
              <p>
                インストール操作はありません。未保存の作業を先に保存してください。
              </p>
            </li>
          </ol>
          <aside className="download-caution">
            <h3>Windowsの保護機能に止められたら、ここで中止</h3>
            <p>
              SmartScreen、ウイルス対策、組織のポリシーで停止した場合は実行を進めず、警告を閉じてください。保護の無効化・除外設定・管理者実行・実行ポリシー変更で回避しないでください。署名済みの完成版ではないため、利用を見送る判断も大切です。
            </p>
          </aside>
        </section>
        <section id="use">
          <h2>② ゲームを選んで、記録を読む</h2>
          <ol className="download-steps" start={4}>
            <li>
              <h3>読み取り範囲を確認する</h3>
              <p>
                画面の説明を読み、「読み取り範囲を確認し、このPC内での取得に同意する」にチェックします。起動しただけでは診断情報を取得しません。追加確認の3項目は初期OFFです。必要な範囲だけ選び、迷ったらOFFのままで構いません。
              </p>
            </li>
            <li>
              <h3>「Steamの登録先からワイルズを探す」</h3>
              <p>
                候補の場所を確認して選びます。見つからない場合はSteamでワイルズを右クリック
                →「管理」→「ローカルファイルを閲覧」。アプリの「自分で本体EXEを選ぶ」から、そのフォルダの{' '}
                <code>MonsterHunterWilds.exe</code>{' '}
                を選びます。CrashReport.exeやベンチマークは選びません。
              </p>
              <p>
                Steam側の追加確認を使う場合、関連付けが不明なら「Steam本体を自分で選ぶ（追加確認用）」で普段使う
                steam.exe を選べます。確かでなければ選ばず、不明のままにします。
              </p>
            </li>
            <li>
              <h3>今の状況に合う方法で読む</h3>
              <ul>
                <li>
                  <strong>すでに落ちた直後：</strong>「すでに落ちた場合:
                  直近10分を読む」。CrashReportが作成中なら、完了を待ちます。
                </li>
                <li>
                  <strong>これから安全に確認できる：</strong>
                  「起動する直前に押す →
                  計測開始」を押し、自分でSteamの「プレイ」を1回押します。CrashReportが出たら生成完了を待ち、「CrashReport生成完了
                  / 起動確認後 → 読み取る」を押します。
                </li>
                <li>
                  <strong>すでに直った：</strong>
                  再現テストは不要です。ゲームを選んだ後、「5
                  実施履歴と改善報告」で以前の手順と結果を記録できます。
                </li>
              </ul>
            </li>
            <li>
              <h3>記録が0件・反映待ちなら、同じ記録を読み直す</h3>
              <p>
                新たにゲームを起動せず、「起動し直さず、同じ記録を読み直す」を押します。「3
                次の一手」「4
                詳細と保存」にあります。開始時刻や手順の記録を保ったまま読み直します。元の開始から30分を超えると止まります。
              </p>
              <p>
                別の起動や設定変更を挟んだ場合は、同じ記録として扱わないでください。必要な結果を保存し、「新しい診断を始める」から別の比較にします。
              </p>
            </li>
          </ol>
        </section>
        <section id="results">
          <h2>③ 結果は「確定診断」ではなく、確認の手がかり</h2>
          <div className="download-grid">
            <div>
              <h3>記録あり ≠ 原因が確定</h3>
              <p>
                エラーコード、DLL名、MODの痕跡、Steamの読込みは観測事実です。そこにあっただけで原因・不正・故障とは決めません。
              </p>
            </div>
            <div>
              <h3>0件・不明 ≠ 問題なし</h3>
              <p>
                記録の遅延、取得範囲、権限、未対応形式で見えない場合があります。正常・解決の証明にはなりません。
              </p>
            </div>
            <div>
              <h3>本人の結果とログは別</h3>
              <p>
                「改善した」「変わらない」などは本人の申告です。ログの差だけで正常プレイや単独原因を判定しません。
              </p>
            </div>
          </div>
          <p>
            「3
            次の一手」で内容を確認し、試すなら1つずつ。以前試して変わらなかった手順は繰り返さず、履歴へ記録します。再テストは同じ条件で行い、悪化やPC全体の異常があれば中止してください。改善したら追加変更を止めます。アプリがゲームの修復や設定変更を代行することはありません。
          </p>
        </section>
        <section id="history">
          <h2>④ 履歴・書き出しは必要な方だけ</h2>
          <h3>次回も使うための履歴</h3>
          <p>
            「5
            実施履歴と改善報告」で手順と本人の結果を選び、「選択した手順と結果を記録」。閉じた後も残したい場合だけ保存同意を選び、「このPCに履歴を保存」を押します。チェックだけでは保存されません。最大64記録で、保存時に前の保存履歴を置き換えます。
          </p>
          <p>
            保存先：
            <code>%LOCALAPPDATA%\Gemnao\WildsDiagnosis\history-v1.dat</code>
            。このWindowsユーザー用の保護（DPAPI）を使います。同じユーザーの別のソフトや、侵害されたPCからの完全な秘匿は保証しません。
          </p>
          <p>
            次回は「保存した履歴を読む」で内容を確認してから読み込みます。未保存の手順記録は置き換わり、取得済みの比較基準はクリアされます。過去の履歴が今のPC・導入先と同じかは自動判定しません。
          </p>
          <h3>診断テキスト・改善報告JSONを保存する</h3>
          <ul>
            <li>
              診断テキスト：「4
              詳細と保存」→「共有する内容を確認して保存」。全文を確認してから、自分で保存先を選びます。
            </li>
            <li>
              改善報告JSON：「改善報告用JSONを確認して保存」。結果を記録した最大8手順と症状を選び、全文を確認して保存します。OS/GPU分類・ドライバー版は追加の任意項目です。
            </li>
          </ul>
          <p>
            <strong>
              Webの報告受付は準備中です。この版はPCに保存するだけで、サイトへ送信しません。
            </strong>
            「送れた」とは表示しません。未保存の診断結果はアプリを閉じると消え、書き出した診断テキストを読み込んで比較する機能はありません。
          </p>
          <h3>履歴の削除・使わなくなった時</h3>
          <ol>
            <li>
              保存履歴を残したくなければ、アプリで「保存履歴をゴミ箱へ」を選び、Windowsの確認内容も読みます。完全削除になる警告なら取り消してください。画面内の履歴は、この操作だけでは消えません。
            </li>
            <li>
              アプリを閉じ、展開したフォルダとダウンロードしたZIPをエクスプローラーでゴミ箱へ移します。インストーラー・常駐サービス・自動起動・自動更新はありません。
            </li>
            <li>
              自分で別の場所へ保存したテキストやJSONも、不要なら個別にゴミ箱へ移します。アプリのフォルダを消すだけでは履歴や書き出しは消えません。同期先・バックアップのコピーも別管理です。
            </li>
          </ol>
        </section>
        <section id="privacy">
          <h2>何を読み取り、何を送る？</h2>
          <p>
            <strong>
              アプリにネットワーク送信・AI呼出し・テレメトリー・自動アップロードはありません。
            </strong>
            公式ガイドへのリンクを自分で開くと、ブラウザーの通常のWeb通信は発生します。診断情報をURLに付けません。このWebページの通信・Cookie等については
            <a href="/privacy">サイトのプライバシーポリシー</a>
            を確認してください。
          </p>
          <details>
            <summary>基本の読み取り範囲</summary>
            <p>
              Steamの登録先とローカルライブラリ登録、選択したゲームEXEの版、OS・CPU・GPU・ドライバー・RAM・ドライブ容量、該当する互換モード登録、限定したWindowsイベント（1000/1002/4101/41）、CrashReport直下の項目数や更新情報を読みます。全ドライブ検索・セーブ・ログイン情報・Steamのuserdataは読みません。登録ファイルに識別情報が含まれる場合も、それを利用・保存・出力しません。
            </p>
          </details>
          <details>
            <summary>追加の3項目は、それぞれ初期OFF</summary>
            <ul>
              <li>
                ゲーム直下の既知7項目の痕跡・版情報と、製品版のLastPlayed形式。MOD稼働や正常プレイの証明にはしません。
              </li>
              <li>
                CrashReport ZIPを1個（最大8
                MiB）。固定テキストの例外項目とダンプのヘッダー・例外・モジュール一覧だけを限定解析します。ダンプのバイト列は一時的にメモリへ展開され、個人情報を含む可能性があります。メモリ内容・レジスタ・スタック・命令は解析・保存・出力しません。
              </li>
              <li>
                選択したSteam直下の既知6項目の存在・Hidden属性と、同じSteam本体に一致する実行中プロセスの既知5DLLの読込先。DLLや設定本文を実行しません。ゲーム側の痕跡とは別に扱います。
              </li>
            </ul>
          </details>
          <details>
            <summary>共有前に気をつけること</summary>
            <p>
              書き出しは固定項目に絞り、ユーザー名、フルパス、Steam
              ID、生ログなどを除きますが、完全匿名ではありません。OSやドライバー版、容量、本人の回答などが残る場合があります。選んだ手順から追加ツールの利用が推測されることもあります。全文を見てから共有してください。スクリーンショットには選択パスやCPU/GPU名が写るため、別の注意が必要です。
            </p>
            <p>
              OneDriveなどの同期フォルダに保存すると、同期ソフトが送信する場合があります。Windowsのバックアップ・ページファイル等も、このアプリでは制御しません。詳細はZIP内の
              source/README.ja.md にあります。
            </p>
          </details>
        </section>
        <section id="help">
          <h2>困った時の確認</h2>
          <details>
            <summary>EXEがない・見つからない</summary>
            <p>
              ZIPの中を見ているだけではないか確認し、「すべて展開」をやり直してください。展開先の「Gemnao.Diagnostics」というアプリを探します。ウイルス対策が隔離した場合は、勝手に復元・除外せず利用を中止してください。
            </p>
          </details>
          <details>
            <summary>.NETのエラーが出る</summary>
            <p>
              必要なのは .NET Framework 4.8以降です。「.NET
              8/10」や開発者向けSDKを追加する手順ではありません。Windows
              11には通常4.8または4.8.1が含まれます。まず
              <a href="https://learn.microsoft.com/en-us/dotnet/framework/install/on-windows-and-server">
                Microsoft公式のOS別説明
              </a>
              を確認してください。必要性を確認できた場合のみ、
              <a href="https://dotnet.microsoft.com/en-us/download/dotnet-framework/net48">
                Microsoft公式のRuntime案内
              </a>
              を参照します。すでに新しい版があれば古い版へ戻さないでください。
            </p>
          </details>
          <details>
            <summary>Steam検索で見つからない・読み取りが不完全</summary>
            <p>
              Steamの登録が古い、特殊な配置、ネットワークドライブ等は対象外の場合があります。上の手順で本体EXEを手動選択できます。読めない記録を得るために権限を上げる必要はありません。「不明」はそのまま扱い、
              <a href="/games/monster-hunter-wilds">ワイルズの通常ガイド</a>
              も確認してください。
            </p>
          </details>
          <details>
            <summary>履歴が読み込めない・保存できない</summary>
            <p>
              別のWindowsユーザーや別PCから持ってきた履歴、未対応形式、専用保存場所ではないファイルは読みません。権限や保護を変更せず中止してください。保存失敗時は「保存できた」と考えず、閉じる前に必要なら内容を見て診断テキストを別のローカル場所へ書き出します。
            </p>
          </details>
          <details>
            <summary>固まる・ゲーム以外にも異常がある</summary>
            <p>
              読み取り時間はWindows
              APIや環境に左右されます。「中止する」またはウィンドウを閉じてください。PC全体の電源断・ブルースクリーン・異常な発熱がある場合は、繰り返しゲームを起動して再現しないでください。
            </p>
          </details>
        </section>
        <p className="download-small">
          このページの操作名は0.4.0のソース・同梱説明に照合しています。実機画面の撮影やWindowsでの全操作検証を済ませたガイドではありません。
        </p>
        <p>
          <a href="/tools">便利ツール一覧へ戻る</a>
        </p>
      </article>
      <WikiFooter />
    </main>
  );
}
