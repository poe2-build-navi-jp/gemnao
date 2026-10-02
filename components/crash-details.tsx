/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function CrashBeforeSteps() {
  return (
    <div className="reset-config-details crash-details">
      <section className="diagnosis-table" id="crash-scope">
        <h2>まず「ゲームだけ落ちた」かを確認</h2>
        <p>
          ここで扱うのは、ゲームが閉じて
          <strong>Windowsのデスクトップへ戻る</strong>
          症状です。画面が固まったままなら
          <a href="/guide/pc-game-freezes">フリーズの手順</a>
          、PCが消灯・再起動したら
          <a href="/guide/pc-shuts-down-while-gaming">電源断・再起動の手順</a>、
          停止コードが出たら
          <a href="/guide/bsod-while-gaming">ブルースクリーンの手順</a>
          で確認してください。
        </p>
        <p>
          ゲーム名・バージョン、落ちた時刻、開始からの時間、画面のエラー文、使ったセーブ・場所をメモします。できれば同じ操作で再現するかも確認しますが、セーブ破損が疑われる場合は先にコピーを取ります。
        </p>
      </section>
      <section className="diagnosis-table" id="crash-timing">
        <h2>起動直後／ロード中／長時間後：最初の確認先</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">落ちるタイミング</th>
              <th scope="col">先に分けること</th>
              <th scope="col">まず試す1項目</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="タイミング">ロゴの前後・起動直後</td>
              <td data-label="確認">
                MODやReShadeなど導入後からか。更新前は起動したか
              </td>
              <td data-label="最初の対処">
                MOD管理ツールから無効化して比較。次にオーバーレイを別にオフ。改善しなければ
                <a href="/guide/reset-config-file">設定ファイルの退避</a>も確認
              </td>
            </tr>
            <tr>
              <td data-label="タイミング">セーブ・エリアのロード中</td>
              <td data-label="確認">
                特定のセーブ・場面だけか、別スロットや新規ゲームでも起きるか
              </td>
              <td data-label="最初の対処">
                <a href="/guide/save-data-backup">セーブをコピー</a>
                。別スロットも落ちるなら
                <a href="/guide/verify-steam-files">Steamの整合性確認</a>
                。特定データだけなら消さずにゲームのサポートへ
              </td>
            </tr>
            <tr>
              <td data-label="タイミング">数十分～数時間後</td>
              <td data-label="確認">
                長く遊ぶほどメモリ・専用GPUメモリの余裕が減るか、温度が上がるか
              </td>
              <td data-label="最初の対処">
                不要アプリを通常終了して比較。VRAMならテクスチャを一段下げる。
                <a href="/guide/pc-game-freezes">温度の確認方法</a>も参照
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          時間帯は<strong>原因を断定する基準ではありません</strong>
          。同じゲームでも起動直後のファイル破損、ロード時のMOD競合、長時間後のドライバー障害はあり得ます。下の履歴と比較結果で確認先を更新します。
        </p>
      </section>
    </div>
  );
}

export function CrashAfterSteps() {
  return (
    <div className="reset-config-details crash-details">
      <section className="diagnosis-table" id="crash-history">
        <h2>エラー表示がない時：Windowsの履歴を見る</h2>
        <ol>
          <li>
            <strong>Windowsキー＋R</strong>を押し、<code>perfmon /rel</code>
            を入力してEnter。「信頼性の履歴」が開いたら、ゲームが閉じた日の
            <strong>赤い×</strong>
            を選びます。対象ゲーム名の「動作が停止しました」などがあれば「技術的な詳細の表示」から発生時刻、アプリ名、問題イベント名を控えます。
          </li>
          <li>
            見つからなければスタートを右クリック→「イベント
            ビューアー」→「Windows
            ログ」→「アプリケーション」を開きます。落ちた時刻付近の「エラー」を選び、
            <strong>ゲームの実行ファイル名</strong>
            が一致するかを確認します。「Application
            Error」などのイベント1000、近くの「Windows Error
            Reporting」イベント1001が手掛かりになる場合があります。
          </li>
          <li>
            「全般」にある障害が発生したアプリケーション名、障害モジュール名、例外コード、時刻を控えます。別のアプリのエラーや、数時間ずれた警告だけでゲームの原因と決めつけません。履歴が見つからない時は「記録なし」としてタイミング別の比較を続けます。
          </li>
        </ol>
        <p>
          例：同時刻に<code>Game.exe</code>
          の停止が記録され、ゲームだけ閉じたなら、そのゲームの更新・MOD・保存データを優先して調べます。
          <code>KERNELBASE.dll</code>などのモジュール名は
          <strong>原因の確定やDLL交換の指示ではありません</strong>
          。複数ゲームが落ちる、Windowsも停止する場合はPC側も調べます。
        </p>
      </section>
      <section className="diagnosis-table" id="steam-client-case">
        <h2>改善報告：ゲームのMODがなくてもSteam本体の拡張を確認</h2>
        <p>
          2026年10月3日（日本時間）、Steam版モンハンワイルズがタイトル前に落ちる環境で、
          Steamクライアントの外部拡張を一時停止した後に「プレイできた」との報告が1件ありました。
          OBS終了・SteamオーバーレイOFF・ゲームの整合性確認・管理者実行OFFの確認・GPUドライバー更新と再起動だけでは改善せず、
          SteamプロセスにSteam直下の追加DLLが読み込まれていることを確認してから切り分けています。
        </p>
        <p>
          ファイルが置かれていることと、プロセスに実際に読み込まれていることは別です。
          ゲーム側への読み込みを確認した事例ではなく、特定DLLだけが原因と証明したものでもありません。
          名前だけで削除せず、導入の心当たりがなければ変更を止めてください。
          WindowsのSystem32にある同名DLLは操作対象にしません。
        </p>
        <p>
          変更前には設定とセーブをコピーして照合します。保存先を転送する拡張では外部クラウドや独自保存先も確認し、
          保全できない場合は進みません。対象ゲームだけを確認し、同期競合・セーブ消失の表示では上書きせず中止します。
          改善した状態を保ち、再発を起こすための再有効化は不要です。
        </p>
        <p>
          確認したDLL名、読み取り確認、復元できる一時停止と結果は、次の事例にまとめています。
          他のゲームにも同じ原因や成功率を当てはめないでください。
        </p>
        <p>
          <a href="/games/monster-hunter-wilds/not-launching#steam-client-check" style={{ display: 'inline-block' }}>
            モンハンワイルズの起動前クラッシュ改善事例
          </a>
        </p>
      </section>
      <section className="diagnosis-table" id="crash-compare">
        <h2>試した対処が効いたか、同じ条件で比べる</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">確認結果</th>
              <th scope="col">次の行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="結果">MODを外すと起動する</td>
              <td data-label="次の行動">
                導入元の更新情報とゲーム版を照合。必要なMODを戻す前にセーブを保全し、1つずつ有効にして確認
              </td>
            </tr>
            <tr>
              <td data-label="結果">特定のセーブだけロードできない</td>
              <td data-label="次の行動">
                コピーを残し、別スロットが動くか確認。元ファイルを削除せず、対象ゲームのサポートへ記録を送る
              </td>
            </tr>
            <tr>
              <td data-label="結果">長く遊ぶほどメモリの余裕が減る</td>
              <td data-label="次の行動">
                不要アプリを閉じて同じ時間だけ比較。VRAMの余裕が減るならテクスチャを一段下げ、結果を記録
              </td>
            </tr>
            <tr>
              <td data-label="結果">複数のゲームが落ちる／PCも再起動する</td>
              <td data-label="次の行動">
                ゲーム固有の再インストールを重ねず、
                <a href="/guide/gpu-driver-update">GPUドライバーの更新履歴</a>や
                <a href="/guide/pc-shuts-down-while-gaming">PC全体の異常</a>
                を確認
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          「変更前：同じセーブで毎回5分以内に終了／変更：MODだけ無効／変更後：同じ場面を20分進めても終了しない」のように記録します。再現しない時は解決を断定せず、通常のプレイでもう一度確認。ゲーム名と版、エラー時刻、履歴のアプリ名・例外コード、試した項目を相談時に伝えてください。
        </p>
      </section>
    </div>
  );
}
