/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */

export function LowGpuUsageBeforeSteps() {
  return (
    <div className="reset-config-details low-gpu-usage-details">
      <section className="diagnosis-table" id="gpu-normal">
        <h2>まず結論：目標FPSを維持しているなら低使用率は正常</h2>
        <p>
          <strong>
            例：目標が60fps、ゲーム内の上限も60fps、プレイ中もほぼ60fps。
          </strong>
          この時にGPU使用率が40%でも、必要な枚数を余裕をもって描けています。故障を疑ったり、使用率を100%に近づけたりする必要はありません。
        </p>
        <p>
          目標が120fpsなのにゲームが60fpsで固定される場合は、ゲーム内のFPS上限やV-Sync、必要ならドライバー側の上限を確認します。上限を上げても目標に届かない、または上限より低い時だけ
          <a href="#gpu-table">CPU・使用GPUを含めた判断表</a>
          へ進みます。瞬間的な引っかかりは平均FPSとは分けて
          <a href="/guide/stutter-fix">カクつきの記事</a>で確認してください。
        </p>
      </section>

      <section className="diagnosis-table" id="gpu-readings">
        <h2>FPS・CPU・使用GPUを、同じプレイ場面で確認する</h2>
        <ol>
          <li>
            ゲーム内のFPS表示、またはSteam「設定」→「ゲーム中」のパフォーマンスモニターを使い、
            <strong>実際のプレイ中</strong>
            のFPSを記録。ゲーム内「映像」「ディスプレイ」のFPS上限・V-Syncも控えます。ロビーとプレイ中では上限が違うゲームがあります。
          </li>
          <li>
            Ctrl＋Shift＋Esc→「プロセス」でゲーム名を見つけ、「GPUエンジン」列がなければ見出しを右クリックして表示。GPU番号（例：GPU
            0）を控え、「パフォーマンス」で同じ番号のGPU名を確認します。GPU
            0が内蔵でGPU 1が独立GPUという並びはPCによって異なるため、
            <strong>番号と名前の両方</strong>を照合します。
          </li>
          <li>
            ゲームに対応するGPUの「3D」グラフと、「パフォーマンス」→「CPU」の全体使用率を確認。CPUグラフを右クリック→「グラフの変更」→「論理プロセッサ」で一部だけ負荷が高くないか調べます。
          </li>
        </ol>
        <p>
          タスクマネージャーのGPU全体の数値は、最も忙しいエンジンを代表値として表示する仕組みです。動画の処理などと混ぜず、ゲームが使うGPU名と3Dグラフを確認します。ゲームからタスクマネージャーへ切り替えると負荷が下がるため、数値は目安として記録し、結論は設定変更前後のFPSも合わせて判断します。
          <a
            href="https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft DirectXによるGPU表示の説明
          </a>
        </p>
      </section>

      <section className="diagnosis-table" id="gpu-table">
        <h2>判断表：FPS・CPU・実際の使用GPUを組み合わせる</h2>
        <p className="reset-small">
          下記の数値は判断方法を示す<strong>仮の例</strong>
          で、特定のゲーム・PCでの実測結果ではありません。実際はプレイ中の同じ場面で自分の目標FPSと比べます。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">プレイ中のFPSと上限</th>
              <th scope="col">CPUの状態</th>
              <th scope="col">使用GPU・3D負荷</th>
              <th scope="col">判断と次の行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="FPS">目標60／上限60／実測ほぼ60</td>
              <td data-label="CPU">全体25%、偏りは目立たない</td>
              <td data-label="GPU">対象GPU 3D 約40%</td>
              <td data-label="判断">
                <strong>正常。</strong>
                目標を満たすなら設定変更不要。GPU使用率を上げない
              </td>
            </tr>
            <tr>
              <td data-label="FPS">目標120／上限60／実測ほぼ60</td>
              <td data-label="CPU">全体30%</td>
              <td data-label="GPU">対象GPU 3D 約45%</td>
              <td data-label="判断">
                上限が先。
                <a href="/guide/low-fps#fps-limit">ゲーム内の上限・V-Sync</a>
                を確認し、同じ場面で再測定
              </td>
            </tr>
            <tr>
              <td data-label="FPS">目標60／上限120／実測45前後</td>
              <td data-label="CPU">全体35%、一部の論理プロセッサは90%前後</td>
              <td data-label="GPU">対象の独立GPU 3D 約35%</td>
              <td data-label="判断">
                CPU側が候補。
                <a href="#gpu-cpu">表示距離や背景処理を一項目ずつ比較</a>
              </td>
            </tr>
            <tr>
              <td data-label="FPS">目標60／上限120／実測45前後</td>
              <td data-label="CPU">全体30%</td>
              <td data-label="GPU">
                ゲームは内蔵GPU 0で3D約90%。独立GPU 1は約0%
              </td>
              <td data-label="判断">
                見ていたGPUが違う。<a href="#gpu-select">対象ゲームのGPU設定</a>
                を確認
              </td>
            </tr>
            <tr>
              <td data-label="FPS">目標60／上限120／実測45前後</td>
              <td data-label="CPU">全体30%、偏りは目立たない</td>
              <td data-label="GPU">ゲームが使う独立GPU 3D 約96%</td>
              <td data-label="判断">
                GPUは低使用率ではない。
                <a href="/guide/low-fps#fps-compare">描画負荷を切り分ける</a>
              </td>
            </tr>
            <tr>
              <td data-label="FPS">目標60／上限120／実測45前後</td>
              <td data-label="CPU">全体も各論理プロセッサも低め</td>
              <td data-label="GPU">ゲームの独立GPU 3D 低め</td>
              <td data-label="判断">
                数字だけで原因不明。
                <a href="#gpu-next">電源・画面切り替え・別の上限を確認</a>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          CPU全体35%でも一部の処理が詰まる場合があります。逆にCPUの高い論理プロセッサが一つ見えただけではCPUが唯一の原因と確定できません。
          <strong>一項目を変えた前後でFPSが動くか</strong>を確かめます。
          <a
            href="https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft DirectXのCPU・GPU負荷解説
          </a>
        </p>
      </section>
    </div>
  );
}

export function LowGpuUsageAfterSteps() {
  return (
    <div className="reset-config-details low-gpu-usage-details">
      <section className="diagnosis-table" id="gpu-cpu">
        <h2>CPU側が候補なら、GPU使用率を上げる前に比較する</h2>
        <ol>
          <li>
            ゲーム内のFPS上限とV-Syncが目標未満でないことを確認。タスクマネージャーのCPUを「論理プロセッサ」で見て、同じ重い場面で一部の負荷が高く、ゲームのGPU
            3Dには余裕があるか記録します。
          </li>
          <li>
            ゲームに「表示距離」「NPC密度」「物体数」「シミュレーション品質」などがあれば
            <strong>一項目だけ</strong>
            下げ、同じ場所・同じプレイ方法でFPSを比べます。ある項目だけを試し、変更が効かなければ戻します。こうした項目がないゲームでは飛ばしてください。
          </li>
          <li>
            録画・動画再生・更新などが重なっていたら、一つずつ終了して比べます。FPSが伸びてもGPU使用率が必ず上がるとは限りません。FPSと操作感を成果として確認します。
          </li>
        </ol>
      </section>

      <section className="diagnosis-table" id="gpu-select">
        <h2>内蔵GPUで動いている場合だけ、ゲームのGPUを選ぶ</h2>
        <ol>
          <li>
            「プロセス」のゲームのGPUエンジン番号と「パフォーマンス」のGPU名を対応させます。独立GPUの使用率だけを見て0%でも、ゲームが内蔵GPU上で描画していれば独立GPUの故障を意味しません。
          </li>
          <li>
            複数GPUを搭載し、ゲームが内蔵GPU側だと確認できた場合は、Windows
            11の「設定」→「システム」→「ディスプレイ」→「グラフィック」→「アプリのカスタム
            オプション」からゲームを選び、「オプション」内の
            <strong>「高パフォーマンス」</strong>
            と表示されるGPU名を確認して保存します。ゲームが一覧にない場合は「デスクトップアプリを追加」からゲーム本体の実行ファイルを指定。ランチャーだけを指定しないようゲームのファイル名を確認します。
            <a
              href="https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/optimizations-for-windowed-games-in-windows-11"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoftの画面案内
            </a>
          </li>
          <li>
            ゲームを終了して再起動し、
            <strong>実際の使用GPU名・FPS・GPU 3D</strong>
            を同じ場面で比較。性能が上がらない場合は変更前の設定へ戻し、CPUや電源条件も調べます。GPUが1台しかないPCならこの切り替えは不要です。
          </li>
        </ol>
      </section>

      <section className="diagnosis-table" id="gpu-next">
        <h2>両方の使用率が低く、FPSも低いままなら</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">追加の確認</th>
              <th scope="col">結果に応じた行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="確認">FPSが別の値で固定（60、90、120など）</td>
              <td data-label="行動">
                ゲーム内・V-Sync・ドライバー側のFPS上限、ロビー専用上限を調べ、必要な時だけ一つ変更
              </td>
            </tr>
            <tr>
              <td data-label="確認">ノートPCでAC未接続・省電力</td>
              <td data-label="行動">
                AC接続を確認し、Windows「設定」→「システム」→「電源とバッテリー」→「電源モード」を省電力から「バランス」へ変えて再比較。温度やバッテリー消費にも注意
              </td>
            </tr>
            <tr>
              <td data-label="確認">
                タスクマネージャーを前面にした時だけGPUが0%に近い
              </td>
              <td data-label="行動">
                測定中はゲームが背景に回るので、ゲーム内・SteamのFPS表示を優先し、可能なら別画面でタスクマネージャーを見る。静止中の数字で断定しない
              </td>
            </tr>
            <tr>
              <td data-label="確認">ゲームが使うGPUの3Dが高く、目標FPS未達</td>
              <td data-label="行動">
                <a href="/guide/low-fps">FPSが低い時の解像度比較</a>
                へ。GPU使用率を上げる対応ではなく、描画負荷を下げる判断
              </td>
            </tr>
            <tr>
              <td data-label="確認">
                GPUの使用先も電源も正常、症状は更新後から
              </td>
              <td data-label="行動">
                ゲーム・Windows更新時期とドライバー版を記録し、
                <a href="/guide/gpu-driver-update">GPUドライバーの確認手順</a>
                へ。変更を一度に重ねない
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          目標FPSを維持している場合は、GPU使用率の低さ自体を直す必要はありません。記事の数値例は判定の練習用です。ご自身の結果は、ゲーム名・目標FPS・実測FPS・上限・CPU全体と各論理プロセッサ・GPU番号と名前・3D負荷を同じ場面のメモに残してください。
        </p>
      </section>
    </div>
  );
}
