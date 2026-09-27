/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */
import { PathCopy } from './path-copy';
export function BlackScreenBeforeSteps() {
  return (
    <div className="reset-config-details black-screen-details">
      <section className="diagnosis-table" id="black-symptoms">
        <h2>黒いのはどこ？ 症状で最初の操作を選ぶ</h2>
        <p>
          対象は主にWindows
          11のPCゲームです。先に「Windowsが映るか」を確認すると、ゲーム設定を触るべきか、モニター側を確認すべきかを分けられます。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">見えている状態</th>
              <th scope="col">最初に確認すること</th>
              <th scope="col">進む手順</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="状態">
                ゲーム内だけ真っ暗。Alt＋Tabでデスクトップは映る
              </td>
              <td data-label="確認">全画面・解像度・HDRの変更直後か</td>
              <td data-label="次へ">
                <a href="#black-display">ゲームの表示設定を戻す</a>
              </td>
            </tr>
            <tr>
              <td data-label="状態">音は出るが、ゲーム映像が出ない</td>
              <td data-label="確認">
                Ctrl＋Alt＋Deleteの画面が出るか。音だけで正常と決めない
              </td>
              <td data-label="次へ">
                Windowsが映れば表示設定へ。映らなければ
                <a href="#black-windows">接続・Windowsの確認</a>
              </td>
            </tr>
            <tr>
              <td data-label="状態">ロゴの後・同じロード画面で毎回真っ暗</td>
              <td data-label="確認">初回や更新後だけか、進捗表示は動くか</td>
              <td data-label="次へ">
                進捗がなければ<a href="#step-3">修復・追加機能の比較</a>
              </td>
            </tr>
            <tr>
              <td data-label="状態">「信号なし」「No Signal」と表示される</td>
              <td data-label="確認">
                モニターの入力先・ケーブル・PC側の接続先
              </td>
              <td data-label="次へ">
                <a href="#black-windows">モニター側から確認</a>
              </td>
            </tr>
            <tr>
              <td data-label="状態">
                PC起動時から何も映らず、ゲームを開く前も黒い
              </td>
              <td data-label="確認">
                モニター自身のメニュー、PC起動時のロゴが見えるか
              </td>
              <td data-label="次へ">
                ゲーム設定ではなく接続・PCメーカーの表示診断へ
              </td>
            </tr>
            <tr>
              <td data-label="状態">
                停止コードや「再起動が必要」が表示される
              </td>
              <td data-label="確認">
                画面の色より、メッセージと停止コードを記録
              </td>
              <td data-label="次へ">
                <a href="/guide/bsod-while-gaming">停止コードの対処</a>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          ゲーム映像は見えていて左右・上下に黒帯があるだけなら、画面全体が映らない症状とは別です。まずゲームの対応画面比率と表示モードを確認してください。
        </p>
      </section>
      <section id="black-windows">
        <h2>デスクトップも映らない：接続とWindowsの表示を確認</h2>
        <ol>
          <li>
            <strong>モニター本体のメニューボタン</strong>
            を押します。メニューが出るなら、選ばれている入力が実際の接続端子（HDMI
            1・HDMI 2・DisplayPortなど）と一致するか確認します。
          </li>
          <li>
            電源・ケーブルの抜けを確認します。配線を付け替える時は機器の説明書に従い、可能なら通常終了してから作業します。別ケーブルや別モニターを試す場合も1つずつ変更します。
          </li>
          <li>
            Windowsが起動している状況なら、
            <strong>Windows＋Ctrl＋Shift＋B</strong>
            を一度押します。表示ドライバーのリセットで、音が鳴ったり画面が一時的にちらついたりする場合があります。
          </li>
          <li>
            外部画面の接続変更後なら<strong>Windows＋P</strong>
            で出力先を確認します。メニューが見える場合は使う画面を選びます。ノートPC内蔵画面なら「PC画面のみ」、外部画面だけなら「セカンドスクリーンのみ」が選択肢です。
          </li>
          <li>
            <strong>Ctrl＋Alt＋Delete</strong>
            の画面が出るなら、タスクマネージャーから対象ゲームを終了するか、電源メニューから通常の再起動を試します。未保存の進行は失われる場合があります。
          </li>
        </ol>
        <p>
          画面が見えないまま出力モードを何度も切り替えると、選択状態が分からなくなります。デスクトップPCでは、映像ケーブルが元のGPU端子に接続されているかも確認してください。マザーボード側の端子は構成によって映りません。
        </p>
        <p>
          Windowsの操作にも反応しない場合は
          <a href="/guide/pc-game-freezes">PC全体が固まった時の手順</a>
          へ。PC起動時のロゴも出ず、別の接続でも映らない場合は、ゲーム設定を初期化する前にPC・モニターメーカーへ相談します。
        </p>
      </section>
      <section id="black-display">
        <h2>Windowsは映る：画面モード・解像度・HDRを戻す</h2>
        <h3>1．Alt＋Enterで映るか試す</h3>
        <p>
          ゲームを選択してAlt＋Enterを一度押します。対応ゲームでは全画面とウィンドウを切り替えられます。反応がないゲームでは連打せず次へ進みます。
        </p>
        <p>
          映ったらゲームの「設定」→「映像」「ディスプレイ」などで、ウィンドウまたはボーダーレスにして再起動を比較します。解像度はモニターが対応する値へ戻します。変更を1つずつ試し、映った条件を記録します。
        </p>
        <h3>2．解像度・リフレッシュレートを変更前へ戻す</h3>
        <p>
          Windows側も変更した場合は、ゲームを終了して「設定」→「システム」→「ディスプレイ」で対象画面を選び、「ディスプレイの解像度」を確認します。リフレッシュレートは「ディスプレイの詳細設定」で確認します。独自の数値を作らず、対応する選択肢から以前映っていた設定へ戻します。
        </p>
        <h3>3．HDRを変えた直後なら、その設定だけ比較する</h3>
        <p>
          ゲームを終了し、Windowsの「設定」→「システム」→「ディスプレイ」→対象画面→「HDR」で「HDRを使用する」を変更前へ戻します。オンにしてから問題が出た場合は、オフで起動を比較します。ゲーム内にもHDR設定がある場合は、Windows側とは別に1つずつ確認します。
        </p>
        <p>
          HDR切り替え時の一時的な暗転と、戻らない黒画面は分けて記録します。画面が戻っただけで解決とせず、同じゲームを通常終了して再起動し、同じ場面まで映るか確認してください。
        </p>
      </section>
      <section className="diagnosis-table" id="black-config">
        <h2>設定画面を開けない時の具体例：対象ファイルだけを扱う</h2>
        <p>
          画面設定を変えた直後など、設定側を疑う場合の例です。
          <strong>初期化が黒画面を直すと保証するものではありません。</strong>
          保存先と操作の根拠を分けて示します。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">ゲーム・開く場所</th>
              <th scope="col">対象と試す操作</th>
              <th scope="col">根拠・関連手順</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="ゲーム・場所">
                エルデンリング（Steam版）
                <br />
                <code>{String.raw`%APPDATA%\EldenRing`}</code>
                <PathCopy value={String.raw`%APPDATA%\EldenRing`} />
              </td>
              <td data-label="対象・操作">
                <code>GraphicsConfig.xml</code>
                をバックアップして別名へ退避し、再生成と表示の変化を確認。数字のフォルダー内のセーブは変更しない
              </td>
              <td data-label="根拠">
                保存先は
                <a
                  href="https://www.nexusmods.com/eldenring/mods/135"
                  target="_blank"
                  rel="noreferrer"
                >
                  MOD作者の記録
                </a>
                で確認。メーカー公式の黒画面修正ではなく、設定を分けて比較する手順。
                <a href="/games/elden-ring/not-launching">ゲーム別ガイド</a>
              </td>
            </tr>
            <tr>
              <td data-label="ゲーム・場所">
                Fortnite（Windows版）
                <br />
                <code>{String.raw`%LOCALAPPDATA%\FortniteGame\Saved\Config\WindowsClient`}</code>
                <PathCopy
                  value={String.raw`%LOCALAPPDATA%\FortniteGame\Saved\Config\WindowsClient`}
                />
              </td>
              <td data-label="対象・操作">
                <code>GameUserSettings.ini</code>
                。変更した画面設定が保存されない場合は、右クリック→プロパティ→「読み取り専用」を外す→適用
              </td>
              <td data-label="根拠">
                <a
                  href="https://www.epicgames.com/help/c-34254770/c-38015632/a14140539?lang=ja"
                  target="_blank"
                  rel="noreferrer"
                >
                  Epic公式
                </a>
                の保存不良対策。黒画面全般への削除指示ではない
              </td>
            </tr>
          </tbody>
        </table>
        <h3>エルデンリングで設定を退避・復元する手順</h3>
        <ol>
          <li>
            ゲームを終了し、Steamの同期完了を待ってSteamも終了します。セーブは
            <a href="/guide/save-data-backup">別途バックアップ</a>します。
          </li>
          <li>
            エクスプローラーのアドレスバーに上のパスを貼り付けます。「表示」→「表示」→「ファイル名拡張子」をオンにし、
            <code>GraphicsConfig.xml</code>を確認します。
          </li>
          <li>
            ファイルを同期対象外の別フォルダーへコピーし、元のファイルを
            <code>GraphicsConfig.xml.bak</code>
            など未使用の名前へ変更します。既存のバックアップを上書きしません。
          </li>
          <li>
            Steamから起動し、新しい設定ファイルが作られるかと表示を確認します。映れば必要な設定を1つずつ戻します。
          </li>
          <li>
            変化がない・悪化した場合は、再びゲームと同期を終了。今回できたXMLを別へ退避し、元のファイル名を
            <code>GraphicsConfig.xml</code>へ戻します。
          </li>
        </ol>
        <p>
          対象ファイルが見つからない、再生成されない場合は、推測で空のファイルやフォルダーを作らず中止します。より詳しい復元や同期の切り分けは
          <a href="/guide/reset-config-file">設定ファイルの初期化・復元</a>
          を参照してください。参照先のMOD導入やアンチチート変更は、この手順には不要です。
        </p>
        <h3>FortniteがDX12で黒くなる場合の公式対処例</h3>
        <p>
          Epicはこの症状でパフォーマンスモードを試す手順を案内しています。ゲームを終了し、Epic
          Games
          Launcherの「設定」→「フォートナイト」→「追加コマンドライン引数」に
          <code>-d3d12 -es31</code>
          を指定して起動します。項目が見つからない場合は上の公式案内で使用中の画面を確認してください。
        </p>
        <p>
          既存の引数は先にコピーして控え、競合する引数を重ねません。改善しなければ追加した引数を外し、控えた元の状態へ戻します。
          <strong>
            Fortnite向けの例なので、他のゲームへ同じ引数を追加しないでください。
          </strong>
        </p>
      </section>
    </div>
  );
}
export function BlackScreenAfterSteps() {
  return (
    <div className="reset-config-details black-screen-details">
      <section className="diagnosis-table" id="black-next">
        <h2>まだ映らない時：比較結果から次を選ぶ</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">比較した結果</th>
              <th scope="col">次に調べること</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="結果">ウィンドウでは映るが全画面では黒い</td>
              <td data-label="次へ">
                映る方式を維持し、対象モニター・解像度・HDRを1つずつ確認。黒くなる設定を特定する
              </td>
            </tr>
            <tr>
              <td data-label="結果">設定を退避しても同じロゴ後で黒い</td>
              <td data-label="次へ">
                設定を戻し、ファイル修復・公式の既知問題を確認。全設定の初期化を繰り返さない
              </td>
            </tr>
            <tr>
              <td data-label="結果">画面加工・MODを入れてから発生</td>
              <td data-label="次へ">
                <a href="/guide/reshade-uninstall">ReShadeの外し方</a>や
                <a href="/guide/remove-mods-safely">MODの退避手順</a>
                で比較。名前だけでDLLを削除しない
              </td>
            </tr>
            <tr>
              <td data-label="結果">複数のゲーム・デスクトップでも発生</td>
              <td data-label="次へ">
                ゲーム単体より、接続・Windows・
                <a href="/guide/gpu-driver-update">GPUドライバー</a>
                側へ。更新直後かを記録する
              </td>
            </tr>
            <tr>
              <td data-label="結果">長時間後に真っ暗になり操作も戻らない</td>
              <td data-label="次へ">
                <a href="/guide/pc-game-freezes">温度・メモリ・信頼性履歴</a>
                を確認。電源断なら
                <a href="/guide/pc-shuts-down-while-gaming">
                  電源が落ちる時の手順
                </a>
                へ
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section id="black-record">
        <h2>相談時に役立つ「黒画面の5項目メモ」</h2>
        <p>
          取得できた情報だけ記入してください。検証済みの測定結果ではなく、読者が記録するためのテンプレートです。
        </p>
        <ul>
          <li>ゲーム名・ストア・版／GPU・ドライバー版：</li>
          <li>発生場面：起動前／ロゴ後／ロード中／プレイ開始から何分：</li>
          <li>Windowsは映るか／音・カーソル・「信号なし」の有無：</li>
          <li>モニター台数・接続端子／全画面・解像度・Hz・HDR：</li>
          <li>直前の変更／今回変えた1項目／再起動後も改善したか：</li>
        </ul>
        <p>
          デスクトップが映る状態を撮影できるならゲームの表示設定も残します。画面全体が映らない場合は、モニターの表示やPCの状態をスマホで記録すると状況を伝えやすくなります。
        </p>
      </section>
    </div>
  );
}
