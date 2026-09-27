/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function SteamLaunchBeforeSteps() {
  return (
    <div className="reset-config-details steam-launch-details">
      <section className="diagnosis-table" id="steam-launch-symptoms">
        <h2>「プレイ」を押した後、どの状態になる？</h2>
        <p>
          下の表で<strong>Steamの表示・ゲームのウィンドウ・エラー文</strong>
          を照らし合わせ、当てはまる行から確認を始めます。起動時に更新や初回セットアップが進んでいれば完了を待ち、ボタンを連打しないでください。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">押した後の状態</th>
              <th scope="col">次の確認先</th>
              <th scope="col">まず試すこと</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="状態">
                ボタンも変わらず無反応。別のゲームも同じ
              </td>
              <td data-label="確認先">
                Steamクライアントの操作、更新・同期、別ゲームの起動
              </td>
              <td data-label="最初の行動">
                Steamを通常終了してPCを再起動。再現するならSteam公式のクライアント案内へ
              </td>
            </tr>
            <tr>
              <td data-label="状態">
                一瞬「停止／実行中」になり「プレイ」に戻る
              </td>
              <td data-label="確認先">
                ゲームのプロセスと<strong>同時刻のWindows停止履歴</strong>
              </td>
              <td data-label="最初の行動">
                <a href="#steam-launch-history">信頼性の履歴</a>
                でゲームやランチャーの名前を照合
              </td>
            </tr>
            <tr>
              <td data-label="状態">「実行ファイルが見つかりません」</td>
              <td data-label="確認先">
                不足ファイル、Windowsセキュリティの保護履歴
              </td>
              <td data-label="最初の行動">
                <a href="/guide/verify-steam-files">
                  ゲームファイルの整合性を確認
                </a>
                し、同時刻の隔離も確認
              </td>
            </tr>
            <tr>
              <td data-label="状態">「アプリはすでに実行されています」</td>
              <td data-label="確認先">
                隠れたウィンドウ、ランチャー、対象ゲームのプロセス
              </td>
              <td data-label="最初の行動">
                ゲームが保存中でないことを確認し、終了・SteamとPCの再起動
              </td>
            </tr>
            <tr>
              <td data-label="状態">ウィンドウは残り画面だけ黒い</td>
              <td data-label="確認先">ゲームのプロセスが続いているか</td>
              <td data-label="最初の行動">
                <a href="/guide/black-screen">黒い画面の記事</a>
                で画面モードと表示先を確認
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          エラー文にDLL名・停止コードがある場合は、その全文を撮影。
          <a href="/guide/directx-error">DirectX</a>・
          <a href="/guide/visual-c-runtime-error">Visual C++</a>
          など該当する記事の手順を優先してください。
        </p>
      </section>
      <section className="diagnosis-table" id="steam-launch-process">
        <h2>本当に起動していない？ タスクマネージャーで見る</h2>
        <ol>
          <li>
            Steamのライブラリで対象ゲームを表示。
            <strong>Ctrl＋Shift＋Esc</strong>でWindowsの「タスク
            マネージャー」を先に開き、「プロセス」を見られる位置にしておきます。
          </li>
          <li>
            Steamで「プレイ」を1回押し、Steamのボタンが変わるか、ゲーム・ランチャー名がプロセスの一覧に出るか観察します。「詳細」で実行ファイル名が見える場合は名前を控えます。Steamの準備画面だけ表示されても、ゲーム本体の起動までは確定しません。
          </li>
          <li>
            一瞬現れて閉じたら、消えたおおよその<strong>時刻</strong>
            を記録して下の履歴へ。見えなかったとしても短時間で終了した可能性があるため、未起動と断定しません。プロセスが残るのに画面がない場合は、隠れたランチャーや黒い画面を別に確認します。
          </li>
        </ol>
      </section>
    </div>
  );
}

export function SteamLaunchAfterSteps() {
  return (
    <div className="reset-config-details steam-launch-details">
      <section className="diagnosis-table" id="steam-launch-history">
        <h2>一瞬で閉じる・エラーなし：起動の痕跡を探す</h2>
        <ol>
          <li>
            <strong>Windowsキー＋R</strong>→<code>perfmon /rel</code>
            →Enterで「信頼性の履歴」を開きます。「プレイ」を押した日の赤い×から、ゲーム名または別のランチャー名の「動作が停止しました」などを探し、詳細に表示されたアプリ名と時刻を控えます。
          </li>
          <li>
            見つからない時はスタートを右クリック→「イベント
            ビューアー」→「Windows
            ログ」→「アプリケーション」。起動時刻付近の「エラー」を選び、
            <strong>対象ゲーム／ランチャーとアプリ名が一致するか</strong>
            調べます。Application
            Error（イベント1000）などが記録される場合があります。
          </li>
          <li>
            「実行ファイルが見つかりません」や隔離の疑いがある場合は「Windows
            セキュリティ」→「ウイルスと脅威の防止」→「保護の履歴」で同時刻の項目を確認します。ファイル名と配布元を確かめずに復元・許可しないでください。
          </li>
        </ol>
        <p>
          <strong>例：</strong>19:40に「プレイ」→19:40に<code>Game.exe</code>
          の停止履歴があれば、ゲームが起動した後に閉じた手掛かりです。Steamだけの再起動で直らなければ
          <a href="/guide/pc-game-crash">クラッシュの切り分け</a>
          へ。履歴に何も見つからない場合も、記録が残らなかっただけの可能性があるため、Steamの表示と別ゲームの結果も合わせて判断します。
        </p>
      </section>
      <section className="diagnosis-table" id="steam-launch-results">
        <h2>確認結果から次に進む場所</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">分かったこと</th>
              <th scope="col">次に試すこと</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="結果">
                別のSteamゲームも起動せず、Steam操作も不安定
              </td>
              <td data-label="次の行動">
                Steamをメニューから終了してPCを再起動。改善しなければSteam公式のクライアント案内へ。ゲーム1本の再インストールを繰り返さない
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                対象ゲームだけ、開始直後の停止が履歴にある
              </td>
              <td data-label="次の行動">
                <a href="/guide/pc-game-crash">
                  落ち方に応じてクラッシュを調査
                </a>
                。MOD・オーバーレイを1項目ずつ比較。DLL名があれば該当するエラー記事へ
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                実行ファイルの不足が表示され、Steamの整合性確認で再取得
              </td>
              <td data-label="次の行動">
                ゲームをもう一度起動。再び消えるならセキュリティの保護履歴と配布元を確認し、該当ソフトの公式窓口へ相談
              </td>
            </tr>
            <tr>
              <td data-label="結果">ゲームのプロセスは続くが画面が黒い</td>
              <td data-label="次の行動">
                <a href="/guide/black-screen">
                  表示先・ウィンドウ設定の切り分け
                </a>
                へ。ゲームが終了したケースと分ける
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                MODを無効にした場合のみタイトル画面へ進む
              </td>
              <td data-label="次の行動">
                <a href="/guide/remove-mods-safely">
                  MODの更新と導入ファイルを照合
                </a>
                。MOD必須の既存セーブは上書きせず新規データで比較
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          ゲーム名と版、Steamのボタンの変化、プロセスの有無、エラー全文、履歴の時刻・アプリ名、別ゲームでの結果と変更項目を控えておくと、公式サポートへ状況を伝えやすくなります。
        </p>
      </section>
    </div>
  );
}
