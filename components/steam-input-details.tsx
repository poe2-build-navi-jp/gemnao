/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function SteamInputBeforeSteps() {
  return (
    <div className="reset-config-details steam-input-details">
      <section className="diagnosis-table" id="input-branches">
        <h2>どこまで認識される？ 最初に進む場所を決める</h2>
        <p>
          まずゲームを終了し、パッドを<strong>1台だけ</strong>
          接続します。Steamの画面をパッドで操作できることと、ゲームにボタン入力が届くことは別です。以下の順に、最後に反応した場所を確認してください。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">最後に反応した場所</th>
              <th scope="col">見分け方</th>
              <th scope="col">次の確認と期待結果</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="認識地点">Windows側の接続が疑わしい</td>
              <td data-label="見分け方">
                Bluetoothの接続状態に出ない、USBで認識しない。ケーブルを替えても同じ
              </td>
              <td data-label="次の確認">
                <a href="#input-device">接続を確認</a>
                。有線で認識すれば無線接続側、別ケーブルで認識すれば元のケーブルが候補
              </td>
            </tr>
            <tr>
              <td data-label="認識地点">Windowsには出るがSteamに出ない</td>
              <td data-label="見分け方">
                Steam「設定」→「コントローラ」に機器名が出ない、入力テストが使えない
              </td>
              <td data-label="次の確認">
                <a href="#input-device">Steamを再起動し、USB接続で再検出</a>
                。名前とボタン反応が出れば次の段階へ
              </td>
            </tr>
            <tr>
              <td data-label="認識地点">Steamには出るがゲームで動かない</td>
              <td data-label="見分け方">
                Steamの機器名とボタンテストは正常。ゲームのタイトル画面では無反応
              </td>
              <td data-label="次の確認">
                <a href="#input-game">ゲーム別Steam Input設定とレイアウト</a>
                。再起動後に同じボタンが1回反応すれば改善
              </td>
            </tr>
            <tr>
              <td data-label="認識地点">
                ゲームでも動くが二重・一部だけ無反応
              </td>
              <td data-label="見分け方">
                1回押して2回動く／移動だけできて決定ボタンが動かない
              </td>
              <td data-label="次の確認">
                <a href="#input-conflicts">外部変換ツール・レイアウト</a>
                。1回の押下が1回だけ届くか、問題のボタンだけ改善したか確認
              </td>
            </tr>
          </tbody>
        </table>
        <p className="reset-small">
          Windowsに表示されないだけで故障とは断定できません。機器の種類により表示先が異なるため、Steamの入力テスト・別のポート／ケーブル・機器メーカーの案内を合わせて確認します。
        </p>
      </section>

      <section className="diagnosis-table" id="input-device">
        <h2>Steamが認識しない場合：機器名とボタンの両方を見る</h2>
        <ol>
          <li>
            ゲームを終了し、パッドを1台だけPCに接続。Steam左上の「Steam」→「設定」→「コントローラ」で、
            <strong>接続した機器名が出るか</strong>
            確認します。入力をテストする項目があれば、決定ボタンとスティックを動かし、画面に変化が出るかも確認してください。項目名はSteamの版で異なる場合があります。
          </li>
          <li>
            機器名が出ない・テストが動かない時は、まずデータ通信できるUSBケーブルとPC本体の別ポートで試します。充電専用ケーブルでは接続できない場合があります。
            <strong>有線では反応するなら、次は無線側</strong>を確認します。
          </li>
          <li>
            Bluetooth接続ならWindows「設定」→「Bluetoothとデバイス」→「デバイス」で接続状態を確認。接続できない時に限り、機器のメーカーのペアリング手順を見て再接続してください。Steamに機器名が出るようになったら、ボタン入力のテストをやり直します。
          </li>
        </ol>
        <p>
          Windowsでは接続済みなのにSteamに出ない場合はSteamを「終了」して起動し直し、有線1台で再確認します。
          <strong>
            Steamに名前とボタン反応が出るまでは、ゲーム別Steam
            Inputの切り替えに進みません。
          </strong>
          <a
            href="https://support.microsoft.com/ja-jp/windows/hardware/bluetooth/fix-bluetooth-problems-in-windows"
            target="_blank"
            rel="noopener noreferrer"
          >
            MicrosoftのBluetooth接続手順
          </a>
        </p>
      </section>
    </div>
  );
}

export function SteamInputAfterSteps() {
  return (
    <div className="reset-config-details steam-input-details">
      <section className="diagnosis-table" id="input-game">
        <h2>Steamで認識する場合：ゲーム別設定は1回ずつ試す</h2>
        <ol>
          <li>
            Steamのライブラリで対象ゲームを右クリック→「プロパティ」→「コントローラ」。現在の「ゲーム別Steam
            Input設定」をメモします。<strong>ゲームを終了した状態</strong>
            で「Steam Inputを有効化」に変え、Steamからゲームを起動します。
          </li>
          <li>
            タイトル画面など同じ場所で決定ボタンを<strong>1回だけ</strong>
            押します。反応したらその設定を維持。反応しなければゲームを終了し、そのゲームが該当コントローラーに対応する場合に「Steam
            Inputを無効化」へ変更してもう一度試します。ゲームのネイティブ入力が利用できる場合に限った比較です。
          </li>
          <li>
            どちらも反応しない場合はライブラリの対象ゲームにある「コントローラーレイアウト」を開き、決定ボタンが「割り当てなし」になっていないか確認。ストアのコントローラー対応表示とゲーム公式ヘルプも照合します。ゲーム内に入力方式の切り替えがあれば、その現在値も控えます。
          </li>
        </ol>
        <p>
          パッド非対応のゲームでゲームパッドのボタンを割り当てても、そのままではゲームへ届きません。Steam
          Inputにはキーボード・マウス操作へ割り当てる方法もありますが、ゲームが許可・対応している範囲で検討してください。
          <a
            href="https://partner.steamgames.com/doc/features/steam_controller/legacy_mode"
            target="_blank"
            rel="noopener noreferrer"
          >
            Steamworksの入力方式の説明
          </a>
        </p>
      </section>

      <section className="diagnosis-table" id="input-results">
        <h2>設定を変えた後の期待結果と、次に調べる場所</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">変えた設定</th>
              <th scope="col">期待する結果</th>
              <th scope="col">違った場合に進む先</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="設定">USBケーブル／ポートを替える</td>
              <td data-label="期待結果">
                Steamに機器名が現れ、入力テストでボタンが反応する
              </td>
              <td data-label="次の行動">
                無反応なら別の対応機器で比較し、メーカーの接続・故障診断を確認
              </td>
            </tr>
            <tr>
              <td data-label="設定">Steam Inputを有効化 → ゲーム再起動</td>
              <td data-label="期待結果">
                対象ゲームで決定ボタンが1回押すと1回動く
              </td>
              <td data-label="次の行動">
                無反応なら対応状況・レイアウトを確認。該当パッドにネイティブ対応なら無効化も比較
              </td>
            </tr>
            <tr>
              <td data-label="設定">Steam Inputを無効化 → ゲーム再起動</td>
              <td data-label="期待結果">
                ゲームがパッドを直接認識し、同じボタンが動く
              </td>
              <td data-label="次の行動">
                有効・無効とも動かなければレイアウトとゲーム内入力設定へ。元の設定に戻せるよう記録を残す
              </td>
            </tr>
            <tr>
              <td data-label="設定">外部入力変換ツールを終了 → ゲーム再起動</td>
              <td data-label="期待結果">
                ボタン1回に対してゲーム内でも1回だけ反応する
              </td>
              <td data-label="次の行動">
                変わらなければ別のパッド・仮想パッドの接続とゲーム内割り当てを確認
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          入力が届くかの比較では、同じゲームの
          <strong>同じ画面・同じボタン</strong>
          を使い、変更ごとにゲームを終了して起動し直します。設定を変えてもSteam側の入力テストが無反応なら、
          <a href="#input-device">接続の確認</a>に戻ってください。
        </p>
      </section>

      <section className="diagnosis-table" id="input-conflicts">
        <h2>部分的に動く・二重に動く場合の分岐</h2>
        <p>
          1回押したのに2回動く場合は、DS4Windowsなどの変換ツールや仮想パッドを終了し、実機1台とSteam
          Inputだけで試します。直った場合は二重変換が候補です。
          <a href="/guide/controller-double-input">二重入力の詳しい切り分け</a>
          も参照してください。
        </p>
        <p>
          移動だけできて決定ボタンが動かない場合は、対象ゲームの「コントローラーレイアウト」を確認。ゲームパッド入力とキーボード操作が混ざっていないか、該当ボタンの割り当てを見ます。ゲームのストア表示が「部分的なコントローラーサポート」の場合は、操作の一部にマウスやキーボードが必要なこともあります。
        </p>
        <p>
          Steamの入力テストは通るのに<strong>1本のゲームだけ</strong>
          無反応なら、そのゲームの公式サポートへ、機器名・有線／無線・Steam
          Input有効／無効・レイアウト名・反応した画面とボタンを伝えます。Steam以外から起動するゲームでは、Steamのゲーム別設定が適用されているとは限りません。
        </p>
      </section>
    </div>
  );
}
