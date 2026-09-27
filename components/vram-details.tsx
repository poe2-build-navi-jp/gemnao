/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function VramBeforeSteps() {
  return (
    <div className="reset-config-details vram-details">
      <section className="diagnosis-table" id="vram-readings">
        <h2>専用・共有GPUメモリ：まず表示の意味を分ける</h2>
        <p>
          Windowsのタスクマネージャーで「専用GPUメモリ{' '}
          <strong>7.6/8.0 GB</strong>
          」と表示された場合、左側が現在の使用量、右側が表示される容量です。
          <strong>数値だけで原因は確定しません。</strong>
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">表示</th>
              <th scope="col">独立GPUの場合</th>
              <th scope="col">注意して読む点</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="表示">専用GPUメモリ</td>
              <td data-label="意味">
                グラフィックボード上のVRAMの使用量／容量
              </td>
              <td data-label="注意">
                ゲーム以外のアプリも使用する。上限に近いだけで不足確定とはならない
              </td>
            </tr>
            <tr>
              <td data-label="表示">共有GPUメモリ</td>
              <td data-label="意味">
                GPUとCPUで共用できるシステムRAMの使用量／上限
              </td>
              <td data-label="注意">
                「0.5/8
                GB」なら使用中は左の0.5GB。右側の8GBが専用VRAMに増えたわけではない
              </td>
            </tr>
            <tr>
              <td data-label="表示">GPUメモリ（合計）</td>
              <td data-label="意味">専用と共有を合算した表示</td>
              <td data-label="注意">
                「合計16GB」と表示されても、8GBの独立GPUが16GBの専用VRAMになった意味ではない
              </td>
            </tr>
            <tr>
              <td data-label="表示">内蔵GPUの「専用」</td>
              <td data-label="意味">
                独立GPUのVRAMと異なり、システムRAMの予約領域など
              </td>
              <td data-label="注意">
                128MBなどの小さな値だけを見て不足や故障と決めない。共有とPCのメモリも確認
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          読み方は
          <a
            href="https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft DirectXの解説
          </a>
          に基づきます。ゲーム内の「必要VRAM」「推定使用量」は、実測使用量と異なる場合があります。比較にはタスクマネージャーの同じ表示を使います。
        </p>
      </section>

      <section className="diagnosis-table" id="vram-observe">
        <h2>症状と数値を同じタイミングで確認する</h2>
        <ol>
          <li>
            ゲームを起動したまま<strong>Ctrl＋Shift＋Esc</strong>
            →「プロセス」で対象ゲームを探します。「GPUエンジン」列がなければ列の見出しを右クリックして表示します。ゲームのGPU番号を確認し、「パフォーマンス」→同じ番号のGPU（例：GPU
            1）の名前も控えます。ゲームのプロセスにGPUエンジンが出ない場合は、GPU名とゲーム内の表示設定を確認し、番号を推測しないでください。
          </li>
          <li>
            そのGPUの「専用GPUメモリ」「共有GPUメモリ」の
            <strong>左側の使用量と右側の容量</strong>
            を記録します。画面を切り替えると負荷が変わるため、症状が出た直後の値と、症状がない時の値をそれぞれ記録します。余裕があればスマートフォンで画面を撮影します。
          </li>
          <li>
            「パフォーマンス」→「メモリ」でPC全体のRAM使用量も控えます。特に内蔵GPUではシステムRAMを共用するので、専用GPUメモリだけを判断材料にしません。
          </li>
        </ol>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">症状と観測値</th>
              <th scope="col">考えられること</th>
              <th scope="col">次の比較</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="観測">
                独立GPUの専用使用量が容量に近く、移動・視点変更時に引っかかる
              </td>
              <td data-label="候補">
                VRAMの負荷は候補。読み込みやシェーダー構築もあり得る
              </td>
              <td data-label="比較">
                <a href="#vram-compare">テクスチャだけ1段階下げ</a>
                、同じルートを2回走って比較
              </td>
            </tr>
            <tr>
              <td data-label="観測">
                専用・共有に余裕があり、初回だけ引っかかる
              </td>
              <td data-label="候補">
                VRAM不足以外の可能性が高い。シェーダー準備なども確認
              </td>
              <td data-label="比較">
                ゲーム側の準備表示と再訪時の症状を見て
                <a href="/guide/shader-cache-delete">シェーダーの記事</a>へ
              </td>
            </tr>
            <tr>
              <td data-label="観測">
                共有使用量が増えており、PC全体のRAMも高く、長時間後に重い
              </td>
              <td data-label="候補">
                GPUメモリだけでなくシステムRAMや他アプリの負荷も候補
              </td>
              <td data-label="比較">
                動画・録画などを1つずつ終了し、同じ場面・同じ時間後に再確認
              </td>
            </tr>
            <tr>
              <td data-label="観測">
                「VRAM不足」警告が出るのに表示使用量が低い
              </td>
              <td data-label="候補">
                別のGPUを見ている、瞬間的な変動、ゲームの割り当て要求など
              </td>
              <td data-label="比較">
                ゲームが使うGPU名と、警告の文面・出た時刻を確認。低い値だけで警告を否定しない
              </td>
            </tr>
            <tr>
              <td data-label="観測">
                平均FPSが常に低いが、VRAMを下げても変化しない
              </td>
              <td data-label="候補">GPU処理・CPU・FPS上限など別の制約</td>
              <td data-label="比較">
                <a href="/guide/low-fps">FPSが低い時の設定順</a>
                で処理負荷を分ける
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export function VramAfterSteps() {
  return (
    <div className="reset-config-details vram-details">
      <section className="diagnosis-table" id="vram-compare">
        <h2>テクスチャを1段階下げて、変更前後を比べる</h2>
        <ol>
          <li>
            同じセーブ、解像度、画面モード、移動ルートを決め、変更前のテクスチャ品質と、専用・共有メモリの使用量、警告の有無、引っかかる回数を記録します。初回だけ引っかかる場合は、変更前にも同じルートを2回試します。
          </li>
          <li>
            ゲーム内の「設定」→「グラフィック」「映像」などから
            <strong>テクスチャ品質だけ</strong>
            を1段階下げます。項目名はゲームで異なります。反映に再起動が必要ならゲームの案内に従って再起動し、同じルートを再訪します。
          </li>
          <li>
            メモリ使用量と症状の両方を確認。改善がなければ元の品質へ戻し、
            <a href="#vram-next">結果別の次の行動</a>
            へ。ゲーム内にテクスチャ項目がない場合、追加した高解像度テクスチャDLCだけをSteamの「ライブラリ」→右クリック→「プロパティ」→「DLC」から外す選択肢があります。該当DLCがあるゲームだけ試し、ダウンロード完了を待ちます。
          </li>
        </ol>
        <h3>記録例（説明のための仮の数値・実機測定ではありません）</h3>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">同じルート・独立GPU</th>
              <th scope="col">変更前：テクスチャ「高」</th>
              <th scope="col">変更後：「中」</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="項目">専用GPUメモリ</td>
              <td data-label="変更前">7.7 / 8.0 GB</td>
              <td data-label="変更後">6.3 / 8.0 GB</td>
            </tr>
            <tr>
              <td data-label="項目">共有GPUメモリ</td>
              <td data-label="変更前">0.9 / 8.0 GB</td>
              <td data-label="変更後">0.3 / 8.0 GB</td>
            </tr>
            <tr>
              <td data-label="項目">同じ移動ルートを2回試した引っかかり</td>
              <td data-label="変更前">毎回3回程度</td>
              <td data-label="変更後">2回とも0回</td>
            </tr>
            <tr>
              <td data-label="項目">判断</td>
              <td data-label="変更前">画質変更前の基準</td>
              <td data-label="変更後">
                GPUメモリの負荷が関係する可能性が高まる。原因を確定する実験ではない
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          「7.7GB→6.3GB」だけでは十分な改善とは言えません。
          <strong>同じ条件で引っかかりも減るか</strong>
          が判断の中心です。テクスチャ変更によりシェーダー再構築などの影響も生じ得るため、初回だけと2回目以降を分けて記録します。
        </p>
      </section>

      <section className="diagnosis-table" id="vram-next">
        <h2>結果別の次の行動</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">比較結果</th>
              <th scope="col">次にすること</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="結果">専用使用量も症状も改善</td>
              <td data-label="次の操作">
                品質を維持して複数の場面でも確認。必要な画質を保てる範囲で調整
              </td>
            </tr>
            <tr>
              <td data-label="結果">使用量は下がるが、症状は変わらない</td>
              <td data-label="次の操作">
                設定を元に戻し、<a href="/guide/stutter-fix">一瞬止まる原因</a>
                、ストレージ・シェーダー・温度などを切り分ける
              </td>
            </tr>
            <tr>
              <td data-label="結果">使用量も症状もほぼ変わらない</td>
              <td data-label="次の操作">
                測定中のGPU名とゲームの設定反映を再確認。
                <a href="/guide/low-gpu-usage">内蔵GPUでの起動</a>
                の可能性も調べる
              </td>
            </tr>
            <tr>
              <td data-label="結果">ゲームが落ちる、メモリ不足の警告が続く</td>
              <td data-label="次の操作">
                警告の全文とゲーム名、GPU名、設定値、Windowsのメモリ使用量を保存し、
                <a href="/guide/pc-game-crash">クラッシュの記事</a>
                とゲーム公式サポートを確認
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          VRAMをソフトウェアで増やす設定として、レジストリの数値を書き換えたり、仮想メモリを専用VRAMと見なしたりしないでください。ゲーム本体のファイルを名前だけで削除せず、変更は必ず元に戻せる単位で行います。
        </p>
      </section>
    </div>
  );
}
