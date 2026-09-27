/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */
export function FreezeBeforeSteps() {
  return (
    <div className="reset-config-details">
      <section className="diagnosis-table" id="freeze-scope">
        <h2>最初に分ける：ゲームだけ停止？ PC全体が停止？</h2>
        <p>
          この記事の「固まる」は、画面や操作が戻らなくなる症状です。一瞬引っかかった後に動く場合は、
          <a href="/guide/stutter-fix">カクつく・一瞬止まる時の対処法</a>
          へ進んでください。以下はWindows 11を中心にした手順です。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">確認できる状態</th>
              <th scope="col">切り分け</th>
              <th scope="col">次の行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="状態">
                Alt＋Tabで他アプリに切り替えられ、操作もできる
              </td>
              <td data-label="切り分け">ゲーム側の停止を優先して調べる</td>
              <td data-label="次の行動">
                進捗を確認し、戻らなければ対象ゲームだけ終了。整合性・MOD・メモリを比較
              </td>
            </tr>
            <tr>
              <td data-label="状態">
                ゲーム画面は変わらないが、Ctrl＋Alt＋Deleteの画面は出る
              </td>
              <td data-label="切り分け">Windowsは少なくとも一部応答している</td>
              <td data-label="次の行動">
                「タスク
                マネージャー」を選択。表示できなければ同画面の電源メニューから通常の再起動を検討
              </td>
            </tr>
            <tr>
              <td data-label="状態">
                マウスも操作できず、Ctrl＋Alt＋Deleteにも反応しない
              </td>
              <td data-label="切り分け">
                PC全体・画面表示・入力機器の問題が候補
              </td>
              <td data-label="次の行動">
                通常操作で復旧しない場合は機種の手順で終了。再起動後に履歴を確認し、繰り返すならメーカー診断
              </td>
            </tr>
            <tr>
              <td data-label="状態">
                電源が落ちる／勝手に再起動／停止コードが出る
              </td>
              <td data-label="切り分け">ゲームの「応答なし」とは別の症状</td>
              <td data-label="次の行動">
                <a href="/guide/pc-shuts-down-while-gaming">電源が落ちる時</a>・
                <a href="/guide/bsod-while-gaming">停止コードが出る時</a>
                の手順へ
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          「音が鳴る」「マウスだけ動く」は補助情報です。それだけで停止範囲や故障箇所は確定しません。オンラインで相手だけ止まりメニューは動く場合は、通信・サーバー側の問題も分けて考えます。
        </p>
      </section>
      <section id="freeze-memory">
        <h2>メモリを確認する画面と、数値の読み方</h2>
        <ol>
          <li>
            <strong>Ctrl＋Shift＋Esc</strong>で「タスク
            マネージャー」を開きます。
          </li>
          <li>
            「プロセス」で「メモリ」の列をクリックし、使用量が多いアプリを確認します。保存を済ませた不要なアプリは通常の終了操作で閉じます。
          </li>
          <li>
            「パフォーマンス」→「メモリ」を開き、
            <strong>使用中・利用可能・コミット済み</strong>
            を記録します。ゲーム起動前と、停止が起きる場面の直前を比べます。
          </li>
          <li>
            「パフォーマンス」→使用中の「GPU」を開き、
            <strong>専用GPUメモリ</strong>
            も別に確認します。GPUが複数ある場合は画面の製品名を記録します。
          </li>
        </ol>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">見る項目</th>
              <th scope="col">意味・判断の例</th>
              <th scope="col">次に試すこと</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="項目">利用可能</td>
              <td data-label="読み方">
                Windowsが使えるRAMの余裕。低下と同時に停止や強い読み込み待ちが出るかを見る
              </td>
              <td data-label="次の行動">
                ブラウザーなどを閉じ、同じ場面で余裕と症状が改善するか比較
              </td>
            </tr>
            <tr>
              <td data-label="項目">コミット済み：使用量／上限</td>
              <td data-label="読み方">
                例：23.5／24.0GBなら、その時点の上限まで約0.5GB。RAMだけの使用量や、ページファイルだけの使用量ではない
              </td>
              <td data-label="次の行動">
                使用量が増えるアプリを確認。ページファイルを無効化・極端に縮小していないかと保存先の空きを確認
              </td>
            </tr>
            <tr>
              <td data-label="項目">専用GPUメモリ（VRAM）</td>
              <td data-label="読み方">
                例：7.8／8.0GBで移動時に止まるなら、画像用メモリの余裕も候補。確保・キャッシュもあるため満杯に近いだけでは断定しない
              </td>
              <td data-label="次の行動">
                テクスチャを1段階下げ、必要ならゲームを再起動して比較。
                <a href="/guide/vram-shortage">VRAM不足の手順</a>へ
              </td>
            </tr>
            <tr>
              <td data-label="項目">CPU・GPU使用率</td>
              <td data-label="読み方">
                GPUが100％でも故障とは限らない。CPU全体が低くても一部の処理が詰まる場合がある
              </td>
              <td data-label="次の行動">
                使用率だけを原因にせず、止まる場面・使用量・温度・履歴と照合
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>
            数値は読み方を説明する仮例で、実機測定値や異常判定のしきい値ではありません。
          </strong>
          RAMはPC全体の作業用メモリ、VRAMは主に画像処理用です。内蔵GPUはRAMを共有するため、専用GPUと同じ容量の見方はできません。
        </p>
        <p>
          ゲーム終了後は使用量が減ります。Alt＋Tabで負荷が変わることもあるため、可能なら別画面で確認し、毎回同じ方法で記録します。停止直前の値を取得できなければ、取得できた時点を明記してください。
        </p>
      </section>
      <section id="freeze-temperature">
        <h2>温度を確認する方法：GPUとCPUを分けて見る</h2>
        <h3>GPU：まずタスクマネージャーを見る</h3>
        <p>
          「パフォーマンス」→使用中の「GPU」で温度表示を確認します。対応するGPU・ドライバーでのみ表示されます。
          <strong>温度がないこと自体は故障ではありません。</strong>
          また、ここでCPU温度を調べることはできません。
        </p>
        <h3>CPU：センサー画面でプレイ中の温度を確認する</h3>
        <p>
          メーカー付属の監視ソフトがあるなら先に使います。ない場合は
          <a
            href="https://www.hwinfo.com/download/"
            target="_blank"
            rel="noreferrer"
          >
            HWiNFO公式
          </a>
          から入手し、起動時に「Sensors-only」を選んで「Start」または「Run」でセンサー画面を開きます。版によって表示名は異なります。
        </p>
        <ol>
          <li>
            CPUの欄で「CPU Package」や「CPU
            (Tctl/Tdie)」などの温度項目を探します。表示されるセンサー名はCPUによって異なります。
          </li>
          <li>
            「Current」は現在値、「Maximum」は監視開始・リセット後の最大値です。比較前にアプリを起動し直し、ゲーム開始時と症状が出る頃の値・センサー名を記録します。
          </li>
          <li>
            CPU温度とGPU温度を混ぜず、同じセンサー同士で比べます。温度だけでなく、同じ負荷なのに動作速度が低下していないかも確認します。
          </li>
        </ol>
        <p>
          対応環境のAMD Softwareでも、アプリ内検索で「Metrics」→「Performance
          Metrics」を開き、CPU TemperatureやGPU Current
          Temperatureを確認できます。初期設定ではCtrl＋Shift＋Lで記録の開始・終了ができます。項目が出ない環境では利用できません。GPU
          Junction
          Temperatureは別の測定点なので、通常のGPU温度と同列に比べません。
        </p>
        <h3>何℃なら異常？ 温度と症状を組み合わせて判断する</h3>
        <p>
          <strong>
            CPU・GPU全機種に共通する「この温度ならフリーズする」という境界はありません。
          </strong>
          製品の温度上限と照合し、長時間プレイで温度が上がる→同じ場面でも速度が下がる→止まる、という変化が重なるかを見ます。最大値が一度高くなっただけでは原因確定になりません。
        </p>
        <p>
          熱が疑わしい場合はゲームを終了し、通気口をふさがない硬い面に置く、外から確認できる吸排気口のほこりを機種の説明書に従って掃除する、という順で確認します。ファン異常や電源断が続く場合は無理に負荷をかけずメーカーへ相談します。
        </p>
      </section>
    </div>
  );
}

export function FreezeAfterSteps() {
  return (
    <div className="reset-config-details">
      <section id="freeze-history">
        <h2>復旧後は「信頼性履歴」で停止時刻を確認</h2>
        <ol>
          <li>
            Windowsの検索で「信頼性履歴」と入力し、「信頼性履歴の表示」を開きます。
          </li>
          <li>
            固まった日付の赤い×を選び、下の一覧から発生時刻が近い項目を探します。
          </li>
          <li>
            「技術的な詳細の表示」などから、アプリ名・発生時刻・問題イベント名・表示されたコードを記録します。項目名や記録内容は障害によって異なります。
          </li>
        </ol>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">履歴と症状</th>
              <th scope="col">次の行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="履歴と症状">特定のゲームだけが繰り返し停止</td>
              <td data-label="次の行動">
                同じ場面か確認→ファイル修復→MOD・録画・オーバーレイを1つずつ外して比較。ゲーム公式の既知の不具合も確認
              </td>
            </tr>
            <tr>
              <td data-label="履歴と症状">
                複数ゲームで表示関連のエラーが繰り返される
              </td>
              <td data-label="次の行動">
                発生前のドライバー変更を確認し、
                <a href="/guide/gpu-driver-update">GPUドライバーの手順</a>
                へ。履歴だけでGPU故障と断定しない
              </td>
            </tr>
            <tr>
              <td data-label="履歴と症状">
                「正しくシャットダウンされませんでした」だけ
              </td>
              <td data-label="次の行動">
                強制終了の結果として残ることもある。電源ユニットが原因とは決めず、直前の症状・他の履歴も記録
              </td>
            </tr>
            <tr>
              <td data-label="履歴と症状">何も記録されていない</td>
              <td data-label="次の行動">
                停止時に記録が残らない場合もある。発生時刻・停止範囲・再現条件を使って調べる
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section id="freeze-compare">
        <h2>改善したかを比べる手順と記録メモ</h2>
        <p>
          同じセーブ・移動ルート・画質・監視方法で、対策を1つだけ変えます。たとえば20分ほどで止まる症状を、3分起動できただけで「解決」としないでください。安全に確認できる範囲で、普段止まる時間・場面を越えて操作が続くかを複数回見ます。
        </p>
        <p>
          メモリ対策なら「閉じたアプリ」、熱対策なら「設置状態」、競合調査なら「無効にした機能」を1つ記録します。改善しなければ変更を戻し、次の候補へ。PC全体の停止や電源断を繰り返してまで比較する必要はありません。
        </p>
        <h3>コピーして使う相談用メモ</h3>
        <p>
          記入用のテンプレートです。数値が取得できない欄は「未取得」で構いません。
        </p>
        <ul>
          <li>ゲーム名・バージョン／Windows・CPU・GPU・RAM容量：</li>
          <li>停止時刻／起動から何分／場所・操作・初回か毎回か：</li>
          <li>Alt＋Tab・Ctrl＋Alt＋Deleteへの反応／音／復旧方法：</li>
          <li>停止前の利用可能メモリ・コミット済み／専用GPUメモリ：</li>
          <li>温度の測定ツール・センサー名／現在値・最大値・取得時点：</li>
          <li>信頼性履歴／変更した1項目／変更前後の結果：</li>
        </ul>
        <p>
          複数ゲームに加えブラウザーなど通常操作でも固まるなら、このメモを添えてPCメーカーへ相談します。ゲーム内だけならゲームのサポートへ。スクリーンショットを公開する際は、ユーザー名や個人フォルダーのパスを隠してください。
        </p>
      </section>
    </div>
  );
}
