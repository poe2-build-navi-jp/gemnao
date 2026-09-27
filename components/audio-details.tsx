/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function AudioBeforeSteps() {
  return (
    <div className="reset-config-details audio-details">
      <section className="diagnosis-table" id="audio-scope">
        <h2>最初に分ける：Windows全体？ ゲームだけ？</h2>
        <p>
          ゲームで効果音やBGMが鳴る場面を開き、
          <strong>同じヘッドホン・スピーカーで</strong>
          動画や別アプリの音も試します。使う機器が違うまま比べると、出力先の問題を見落とします。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">確認結果</th>
              <th scope="col">優先して見る場所</th>
              <th scope="col">次の操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="結果">ゲームも動画も無音</td>
              <td data-label="確認先">
                Windows全体の「出力」、音量、機器側のミュート
              </td>
              <td data-label="次の操作">
                <a href="#audio-output">実際に使う機器を選び直す</a>
                。ゲームだけの設定変更は後回し
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                動画や別ゲームは鳴るが、このゲームだけ無音
              </td>
              <td data-label="確認先">
                音量ミキサーのゲーム別音量・出力先、ゲーム内音量
              </td>
              <td data-label="次の操作">
                <a href="#audio-mixer">ゲームを開いたまま音量ミキサーを確認</a>
                し、次に<a href="#audio-game">ゲーム内設定</a>へ
              </td>
            </tr>
            <tr>
              <td data-label="結果">
                内蔵スピーカーでは鳴るがBluetoothやモニター側では無音
              </td>
              <td data-label="確認先">
                その機器の接続・電源とWindowsの選択中の出力先
              </td>
              <td data-label="次の操作">
                特定機器を選んで同じ音で比較。Bluetoothなら
                <a href="#audio-next">接続側の確認</a>へ
              </td>
            </tr>
            <tr>
              <td data-label="結果">特定のゲーム場面や「ボイス」だけ無音</td>
              <td data-label="確認先">
                ゲーム内のマスター音量・BGM・効果音・ボイスなど個別音量
              </td>
              <td data-label="次の操作">
                <a href="#audio-game">そのゲーム内の音声設定</a>
                を優先。機器やドライバーを先に変更しない
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          ここでいう「Windows全体」は、比較に使った別のアプリも同じ出力機器で無音という意味です。マイク入力が届かない問題は、再生音の出力とは分けて確認してください。
        </p>
      </section>

      <section className="diagnosis-table" id="audio-output">
        <h2>① Windowsの「出力」を確認する</h2>
        <ol>
          <li>
            Windows
            11で「スタート」→「設定」→「システム」→「サウンド」→「出力」を開き、
            <strong>今聞きたいヘッドホン・スピーカー</strong>
            を選びます。全体の音量が0やミュートでないことと、機器本体の音量・電源も確認します。
          </li>
          <li>
            モニターの接続後ならHDMI／DisplayPortのモニターへ出力が切り替わっていないか確認します。モニターにスピーカーがない場合もあるため、使うヘッドホンへ選び直して別アプリとゲームを聞き比べます。
          </li>
          <li>
            複数のアプリがなお無音なら、別の出力機器でも音が出るか確かめて
            <a href="#audio-next">Windows全体の対処</a>
            へ。別アプリだけ音が戻りゲームが無音のままなら
            <a href="#audio-mixer">音量ミキサー</a>へ進みます。
          </li>
        </ol>
      </section>
    </div>
  );
}

export function AudioAfterSteps() {
  return (
    <div className="reset-config-details audio-details">
      <section className="diagnosis-table" id="audio-mixer">
        <h2>② ゲームだけ無音なら、音量ミキサーでゲーム名を確認</h2>
        <ol>
          <li>
            ゲームを<strong>終了せず</strong>
            音声が鳴るはずの場面を開き、Windowsの「設定」→「システム」→「サウンド」→「音量ミキサー」を開きます。タスクバーのスピーカーを右クリック→「音量ミキサーを開く」からも移動できます。
          </li>
          <li>
            「アプリ」に対象ゲームがあれば、ゲームだけミュート・音量0になっていないか確認。「出力デバイス」が別のモニターや機器なら、実際に聞きたい機器または「既定」へ変えます。両方を一度に変えず、どちらが原因か確認します。
          </li>
          <li>
            ゲームを通常終了して起動し直し、同じ場面で音を比較。ゲーム名が表示されない場合も「故障」と断定せず、ゲームが起動しているか・音声を再生する場面か確認してから
            <a href="#audio-game">ゲーム内設定</a>へ進みます。
          </li>
        </ol>
        <p>
          <strong>例：</strong>
          動画はヘッドホンで鳴るが、ゲームの「出力デバイス」は接続中のモニター。ゲームだけの出力先をヘッドホンへ変え、再起動して同じゲーム場面で聞こえれば、Windows全体のドライバー更新より出力の指定が手掛かりになります。
        </p>
      </section>

      <section className="diagnosis-table" id="audio-game">
        <h2>③ ゲーム内のマスター音量・個別音量を確認</h2>
        <p>
          ゲームの「設定」→「オーディオ」「サウンド」などを開き、マスター音量、効果音、BGM、ボイスの音量を調べます。ゲームによって項目名や出力デバイス設定の有無は異なります。
        </p>
        <ol>
          <li>
            全部無音なら<strong>マスター音量</strong>
            やミュートを確認。ボイスだけ聞こえないならボイス音量、BGMだけならBGM音量を別々に確かめます。
          </li>
          <li>
            出力機器を選べるゲームだけ、Windowsで指定したヘッドホン／スピーカーか「既定」を選びます。出力先の項目がなければ探し続けず、Windowsのゲーム別音量ミキサーを使います。
          </li>
          <li>
            値を控えて一項目ずつ変更し、必要ならゲームを再起動。
            <strong>同じ場面で音が戻ったか</strong>
            を比較します。戻らなければ前の値に戻して次へ進みます。
          </li>
        </ol>
      </section>

      <section className="diagnosis-table" id="audio-next">
        <h2>3か所とも正常だった場合、結果で次を選ぶ</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">残る症状</th>
              <th scope="col">次の確認・相談先</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="症状">すべてのアプリがどの機器でも無音</td>
              <td data-label="次の行動">
                Windows 11の「ヘルプの取得」で
                <a
                  href="https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-sound-or-audio-problems-in-windows"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microsoftのオーディオ診断
                </a>
                を実行。出力機器が見えなければPC・機器メーカーの公式案内も確認
              </td>
            </tr>
            <tr>
              <td data-label="症状">Bluetoothヘッドホンだけ無音</td>
              <td data-label="次の行動">
                Windowsの接続状態と「出力」でその機器が選ばれているかを再確認。続く場合は
                <a
                  href="https://support.microsoft.com/ja-jp/windows/hardware/bluetooth/fix-bluetooth-connected-but-no-sound-issue-on-windows"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MicrosoftのBluetooth音声手順
                </a>
                へ
              </td>
            </tr>
            <tr>
              <td data-label="症状">ゲームだけ無音、別のゲームは正常</td>
              <td data-label="次の行動">
                ゲーム公式の音声の既知問題・アップデートを確認。Steam版なら
                <a href="/guide/verify-steam-files">ゲームファイルの整合性</a>
                、仮想音声・録画ソフトを使う場合は一つずつ終了して比較
              </td>
            </tr>
            <tr>
              <td data-label="症状">Windows更新後、複数アプリで無音</td>
              <td data-label="次の行動">
                更新日と音が消えた日を控え、Windows・PC／機器メーカーの音声ドライバーの案内を確認。ゲームだけを再インストールしない
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          サポートへは、無音になった日、ゲーム名、他アプリでの結果、Windowsで選んだ出力機器、音量ミキサーとゲーム内設定の値、試した変更を伝えます。音声拡張などは必要になった時だけ元の値を控えて一項目ずつ比較してください。
        </p>
      </section>
    </div>
  );
}
