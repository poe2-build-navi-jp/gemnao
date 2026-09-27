/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function PowerShutdownBeforeSteps() {
  return (
    <div className="reset-config-details power-shutdown-details">
      <section className="diagnosis-table" id="power-symptoms">
        <h2>まず症状を分ける：何が消え、どう戻った？</h2>
        <p>
          「画面だけ消えた」場合はPC本体のランプ・ファンとWindowsの反応も確認します。電源を落として診断する前に、見えた順番をメモしてください。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">実際に見えた状態</th>
              <th scope="col">調べる方向</th>
              <th scope="col">次にすること</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="症状">
                本体のランプ・ファンが止まり、電源ボタンを押すまで戻らない
              </td>
              <td data-label="方向">
                電源断、冷却・電源接続など。原因はまだ確定しない
              </td>
              <td data-label="次の行動">
                危険な兆候を確認。なければ外側のケーブルと吸排気口を確認し、履歴と温度を記録
              </td>
            </tr>
            <tr>
              <td data-label="症状">
                操作しなくてもWindowsのロゴが出て再起動する
              </td>
              <td data-label="方向">
                突然の再起動。停止コードの見逃しもあり得る
              </td>
              <td data-label="次の行動">
                時刻を控えてイベント41だけでなくBugCheck・WHEA-Loggerを調べる
              </td>
            </tr>
            <tr>
              <td data-label="症状">
                「再起動が必要です」や停止コードが表示される
              </td>
              <td data-label="方向">Windowsの停止エラー</td>
              <td data-label="次の行動">
                <a href="/guide/bsod-while-gaming">
                  停止コード・ミニダンプの手順
                </a>
                へ。画面の色は判断材料にしない
              </td>
            </tr>
            <tr>
              <td data-label="症状">ゲームだけ閉じ、Windowsの操作はできる</td>
              <td data-label="方向">ゲームのクラッシュ</td>
              <td data-label="次の行動">
                <a href="/guide/pc-game-crash">ゲーム強制終了の手順</a>
                へ。PCの電源断とは分ける
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          煙・火花・焦げた臭い・本体の膨らみや損傷があれば再起動して確かめず、使用を中止してください。
        </p>
      </section>
      <section className="diagnosis-table" id="power-history">
        <h2>履歴の見方：41を見つけた後に何を見る？</h2>
        <ol>
          <li>
            Windowsの「スタート」で「信頼性履歴の表示」を検索し、発生した日と「Windowsが正しくシャットダウンされませんでした」などの記録を控えます。見つからない場合はWindows＋R→
            <code>perfmon /rel</code>でも開けます。
          </li>
          <li>
            「スタート」を右クリック→「イベント ビューアー」→「Windows
            ログ」→「システム」。停止の前後と次の起動時刻を見比べ、イベントの「日時」「ソース」「イベントID」「全般」の文面をメモします。
          </li>
          <li>
            「Kernel-Power」41は次の起動時に見つかる場合があります。発生時刻の目印にはなりますが、原因を指す記録ではありません。前後にBugCheckやWHEA-Loggerがあるかも確認します。
          </li>
        </ol>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">見つけた記録</th>
              <th scope="col">読み方</th>
              <th scope="col">次の判断</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="記録">Kernel-Power：41</td>
              <td data-label="読み方">
                前回のWindowsが正常終了しなかった記録。電源ユニットの診断結果ではない
              </td>
              <td data-label="次の行動">
                前後の日時、実際の症状、BugCheck・WHEAの有無と組み合わせる
              </td>
            </tr>
            <tr>
              <td data-label="記録">
                BugCheck：1001、停止コードやダンプの記録
              </td>
              <td data-label="読み方">停止エラーが記録された可能性が高い</td>
              <td data-label="次の行動">
                <a href="/guide/bsod-while-gaming">ブルースクリーンの調査</a>
                へ進む
              </td>
            </tr>
            <tr>
              <td data-label="記録">WHEA-Logger、メーカー診断の異常</td>
              <td data-label="読み方">
                ハードウェア関連の手掛かり。記録だけで部品を特定しない
              </td>
              <td data-label="次の行動">
                日時と本文、PC型番を控え、メーカーの診断と点検窓口へ
              </td>
            </tr>
            <tr>
              <td data-label="記録">41だけ／BugcheckCode 0／履歴なし</td>
              <td data-label="読み方">
                原因未確定。停止コードを書き込めなかった可能性もある
              </td>
              <td data-label="次の行動">
                外部の電源接続と冷却を確認。繰り返すなら記録が少なくても点検を依頼
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export function PowerShutdownAfterSteps() {
  return (
    <div className="reset-config-details power-shutdown-details">
      <section className="diagnosis-table" id="power-temperature">
        <h2>温度はどの画面で見て、どう判断する？</h2>
        <p>
          危険な兆候がなく、電源断を繰り返していない場合だけ確認します。測るために長時間ゲームや負荷テストを続ける必要はありません。
        </p>
        <ol>
          <li>
            <strong>GPU：</strong>Ctrl＋Shift＋Esc→「タスク
            マネージャー」→「パフォーマンス」→対象の「GPU」。対応GPUなら温度が表示されます。表示されない機種はPCメーカーの監視ツールを確認。AMD
            Radeonの対応環境ではAMD
            Softwareの「パフォーマンス」→「メトリクス」でGPU温度とGPU接合部温度を別々に見られます。
          </li>
          <li>
            <strong>CPU：</strong>タスク
            マネージャーには一般的なCPU温度欄はありません。PCメーカーの監視・診断ツールで温度とファン状態を確認してください。Intel
            CPUの上限は製品型番で異なるため、型番を調べてIntel公式の仕様と照合します。
          </li>
          <li>
            PC型番・CPU/GPU型番、起動直後とゲーム中の温度、ファンの音・通風、停止までの時間を記録。
            <strong>
              1回の温度表示や90℃という数字だけで電源断の原因は確定しません。
            </strong>
            上限付近で冷却異常がある、または停止を繰り返す場合は点検へ進みます。
          </li>
        </ol>
      </section>
      <section className="diagnosis-table" id="power-safe">
        <h2>自分で確認できる範囲と比較の仕方</h2>
        <ol>
          <li>
            電源を切り、外側の吸排気口を塞いでいないか確認します。ノートPCを布団・布の上で使っていたなら硬く平らな場所へ。外から掃除できるほこりを取り、冷却ファンの警告がある機種はメーカーの診断ツールで確認します。
          </li>
          <li>
            ケーブルやプラグが傷んでいないことを目視し、PC側・壁側の差し込みとノートPCなら指定ACアダプターの型番を確認します。異常な発熱・変色・損傷があれば触れて試さず使用を中止します。電源ユニットやケースの内部配線は扱いません。
          </li>
          <li>
            危険な兆候がなく症状が一度だけなら、変更前の画質・FPS上限・周辺機器・OC設定を記録します。自分が変更した設定を1項目ずつ元へ戻し、短時間で同じゲーム・場面を比較。負荷を下げて落ちなくなっても原因部品の確定とはしません。再び落ちたら検証を止めます。
          </li>
        </ol>
      </section>
      <section className="diagnosis-table" id="power-service">
        <h2>いつ点検を依頼する？</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">状態</th>
              <th scope="col">次に取る行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="状態">
                煙・火花・焦げた臭い、本体の膨らみ、ケーブルの損傷がある
              </td>
              <td data-label="行動">
                直ちに使用を中止。安全にできる場合に限って電源から切り離し、メーカー・修理窓口へ連絡
              </td>
            </tr>
            <tr>
              <td data-label="状態">
                ファンの異常、メーカー診断でエラー、温度が機種の許容上限付近で停止する
              </td>
              <td data-label="行動">
                再現テストを止め、PC型番と結果を添えて点検を依頼
              </td>
            </tr>
            <tr>
              <td data-label="状態">
                外側の確認と標準設定に戻しても、複数ゲームや通常使用で電源断が続く
              </td>
              <td data-label="行動">
                重要データをバックアップし、PCメーカー・購入店・修理窓口へ相談
              </td>
            </tr>
            <tr>
              <td data-label="状態">
                特定ゲームだけで一度発生し、PC全体の再起動や温度異常はない
              </td>
              <td data-label="行動">
                ゲームの公式既知問題・更新を確認。再発時には時刻を控え、この表に戻る
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          相談時は「PC型番／ゲーム名と場面／切れたままか自動再起動か／発生日時と頻度／イベント41・BugCheck・WHEAの有無／温度と使用した監視画面／試した操作」を一緒に伝えます。
        </p>
      </section>
    </div>
  );
}
