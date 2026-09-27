/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function ControllerDoubleBeforeSteps() {
  return (
    <div className="reset-config-details controller-double-details">
      <section className="diagnosis-table" id="double-quick">
        <h2>最初の30秒：本当に「1回で2回」動くか</h2>
        <p>
          ゲームのタイトル画面など、何項目動いたか数えられる場所を選びます。方向ボタンを
          <strong>短く1回押してすぐ離す</strong>
          操作を数回繰り返し、「1項目」「2項目」「反応なし」を記録。押し続けた時だけ続けて動くなら、キーリピートの可能性を分けて確認します。
        </p>
        <p>
          まずゲームを終了し、
          <a href="#double-devices">実機と仮想パッドの一覧</a>
          を記録します。外部変換ツールを使っていない場合は、ツールを終了する手順を飛ばして、
          <a href="#double-steam">Steam Inputとゲームの割り当て</a>を比べます。
        </p>
      </section>

      <section className="diagnosis-table" id="double-devices">
        <h2>実機と仮想パッドの見分け方：名前より「消える方」を見る</h2>
        <ol>
          <li>
            ゲームを閉じたまま<strong>Windowsキー＋R</strong>→
            <code>joy.cpl</code>→Enterで「ゲーム
            コントローラー」の一覧を開き、表示された機器名を控えます。Steam「設定」→「コントローラ」に出る機器も確認しますが、両方の一覧が一致するとは限りません。
          </li>
          <li>
            DS4Windowsなどの変換ツールを使用中なら、そのツールの機器名・仮想出力の種類を控え、
            <strong>ゲームを閉じてからツールを通常終了</strong>
            します。通知領域やタスクマネージャーでまだ動いていないか確認し、
            <code>joy.cpl</code>を開き直して一覧を比較します。
          </li>
          <li>
            例：停止前に「Wireless Controller」と「Xbox 360
            Controller」があり、停止後にXbox側だけ消えたなら、消えたXbox側がそのツールによる仮想パッドの候補。
            <strong>
              どちらも残るなら、その名前だけで実機・仮想の区別を確定しない
            </strong>
            で、別の変換ツール・常駐アプリも調べます。
          </li>
        </ol>
        <p>
          HidHideなどですでに実機を隠していると、<code>joy.cpl</code>
          には仮想パッドだけが表示される場合があります。一覧が1台でも入力が一系統とは限らず、2台でもゲームが両方読むとは限りません。
          <strong>一覧の変化とゲーム内で1回押した結果を必ずセットで確認</strong>
          してください。
          <a
            href="https://kanuan.github.io/DS4WSite/guides/solving-double-input/"
            target="_blank"
            rel="noopener noreferrer"
          >
            DS4Windows Docsの実機・仮想パッドの説明
          </a>
        </p>
      </section>
    </div>
  );
}

export function ControllerDoubleAfterSteps() {
  return (
    <div className="reset-config-details controller-double-details">
      <section className="diagnosis-table" id="double-results">
        <h2>判断表：同じボタンを1回押した結果で次を決める</h2>
        <p>
          各行は<strong>ゲームを終了→条件を1つ変更→Steamから再起動</strong>
          した後、同じメニュー・同じボタンを短く1回押す試験です。変換ツールを使っていない人は、最初の変更を飛ばします。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">変えた条件</th>
              <th scope="col">1回押した結果</th>
              <th scope="col">分かること・次の行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="変更">
                外部ツールを終了、Steam Inputは有効のまま
              </td>
              <td data-label="結果">2項目→1項目</td>
              <td data-label="判断">
                外部ツールの仮想出力などが重なっていた可能性。必要なければ停止した状態を維持。
                <a href="#double-options">ツールが必要な場合</a>だけ別条件を試す
              </td>
            </tr>
            <tr>
              <td data-label="変更">
                外部ツールを終了、Steam Inputは有効のまま
              </td>
              <td data-label="結果">2項目のまま</td>
              <td data-label="判断">
                外部ツールだけでは説明できない。実機以外のパッド・仮想機器と、
                <a href="#double-steam">Steam／ゲームの重複割り当て</a>を確認
              </td>
            </tr>
            <tr>
              <td data-label="変更">
                外部ツールを終了、Steam Inputは有効のまま
              </td>
              <td data-label="結果">無反応</td>
              <td data-label="判断">
                ツールの仮想出力がゲームに必要だった可能性。Steamの機器認識とゲームのパッド対応を確認し、必要ならツールだけの条件を試す
              </td>
            </tr>
            <tr>
              <td data-label="変更">
                ツールを止め、Steam Inputも対象ゲームだけ無効化
              </td>
              <td data-label="結果">2項目→1項目</td>
              <td data-label="判断">
                Steam
                Input側の関与が候補。ゲームが実機を直接認識できるなら、この条件で比較を終える
              </td>
            </tr>
            <tr>
              <td data-label="変更">
                ツールを止め、Steam Inputも対象ゲームだけ無効化
              </td>
              <td data-label="結果">無反応／2項目のまま</td>
              <td data-label="判断">
                無反応ならゲームが実機を直接読めない可能性があり、Steam
                Inputを元へ。二重のままなら
                <a href="#double-steam">別の機器・ゲーム内設定</a>へ
              </td>
            </tr>
          </tbody>
        </table>
        <p className="reset-small">
          結果は原因の候補を絞るための比較で、使用機器やゲームが未特定の状態で故障・設定ミスを断定するものではありません。
        </p>
      </section>

      <section className="diagnosis-table" id="double-options">
        <h2>外部ツールが必要な場合：入力経路を1つにする</h2>
        <ol>
          <li>
            Steam
            Inputだけで1回動くなら、DS4Windowsなどは終了したまま使います。外部ツールがないと無反応のゲームなら、今度はゲームを終了し、対象ゲームの「ライブラリ」→「プロパティ」→「コントローラ」で
            <strong>Steam Inputを無効化</strong>
            。外部ツールを起動してからゲームを再起動し、同じ1回押しを比較します。
          </li>
          <li>
            外部ツールだけでも2回動く場合は、ゲームが実機と仮想パッドを両方読んでいる可能性があります。DS4Windows
            Docsは実機をゲームから隠し、仮想パッドだけ見せる方法を案内しています。すでにHidHideを使っているなら設定の対象機器と許可アプリを配布元の案内で照合。
            <strong>実機やドライバーを推測で無効化しない</strong>でください。
          </li>
          <li>
            設定後はツール・ゲームを起動し直し、<code>joy.cpl</code>
            で見える機器とゲームの1回押しを再確認します。入力が消えた時は変更前に戻し、機器名・接続方法・ツールの出力設定を控えてサポートへ相談します。
          </li>
        </ol>
      </section>

      <section className="diagnosis-table" id="double-steam">
        <h2>外部ツールを使わないのに二重なら</h2>
        <p>
          Steam「設定」→「コントローラ」で接続機器を確認し、ゲームの「プロパティ」→「コントローラ」でゲーム別Steam
          Input設定を控えます。ゲームを終了して有効・無効を
          <strong>一度に片方だけ</strong>
          試し、ボタン1回の結果を比較。無効化して操作できなくなったら、元の状態へ戻します。
          <a href="/guide/steam-input-controller">
            Steamが機器を認識しない場合の手順
          </a>
          は別記事にまとめています。
        </p>
        <p>
          問題が1本のゲームだけなら、Steamの「コントローラーレイアウト」とゲーム内のボタン割り当てで、同じ物理ボタンが複数の操作に割り当てられていないか確認します。別ゲームでも起きるなら、実機以外のゲームパッド、常駐する仮想機器や入力変換ツールを調べます。判別できない場合は、ゲーム名、使ったパッド、
          <code>joy.cpl</code>
          の一覧、試した条件と「1回で何項目動いたか」を記録してサポートへ伝えます。
        </p>
      </section>
    </div>
  );
}
