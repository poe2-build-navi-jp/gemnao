/* oxlint-disable next/no-html-link-for-pages -- Native links match the guide template. */
export function StutterBeforeSteps() {
  return (
    <div className="reset-config-details">
      <section className="diagnosis-table" id="stutter-symptoms">
        <h2>症状から切り分ける：全部を「重い」でまとめない</h2>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">見えている症状</th>
              <th scope="col">候補</th>
              <th scope="col">最初の比較</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="症状">常に動きが遅く、FPSも低い</td>
              <td data-label="候補">画質とCPU・GPU負荷</td>
              <td data-label="比較">
                <a href="/guide/low-fps">解像度・画質設定</a>を1項目下げる
              </td>
            </tr>
            <tr>
              <td data-label="症状">普段は滑らかだが、画面全体が一瞬止まる</td>
              <td data-label="候補">描画間隔の乱れ、処理待ち</td>
              <td data-label="比較">同じルートでFPS上限あり／変更前を比較</td>
            </tr>
            <tr>
              <td data-label="症状">
                初回・更新直後・新しいエフェクトで止まる
              </td>
              <td data-label="候補">シェーダー構築</td>
              <td data-label="比較">構築完了後、同じ場面を2回目にも確認</td>
            </tr>
            <tr>
              <td data-label="症状">高速移動や新エリアへの進入で止まる</td>
              <td data-label="候補">データ読み込み、VRAM、シェーダーなど</td>
              <td data-label="比較">同じ移動ルートでテクスチャだけ下げる</td>
            </tr>
            <tr>
              <td data-label="症状">
                オンラインでキャラが瞬間移動・元の位置へ戻る
              </td>
              <td data-label="候補">通信・サーバー。描画問題との併発もある</td>
              <td data-label="比較">
                FPS低下と同時か、Ping・パケット損失が悪化しているか確認
              </td>
            </tr>
            <tr>
              <td data-label="症状">画面の上下が横にずれて見える</td>
              <td data-label="候補">ティアリング</td>
              <td data-label="比較">V-Sync・VRRを別の検証項目にする</td>
            </tr>
            <tr>
              <td data-label="症状">しばらく遊ぶと悪化／一定間隔で止まる</td>
              <td data-label="候補">温度・電力、録画・更新などの定期処理</td>
              <td data-label="比較">発生時刻と動いていた処理を記録する</td>
            </tr>
          </tbody>
        </table>
        <p>
          この表は原因を断定する診断ではなく、比較する順番を決めるためのものです。平均60fpsは1フレーム約16.7ms、120fpsは約8.3msに相当します。平均が同じでも、途中に長い描画待ちがあれば引っかかりとして感じられます。
        </p>
      </section>
      <section id="stutter-limit">
        <h2>FPS上限はどこで設定する？</h2>
        <p>
          <strong>
            最初はゲーム内、なければドライバー側の1か所で設定します。
          </strong>
          変更前の値を控え、V-Sync・VRR・画質まで一度に変えないでください。
        </p>
        <h3>ゲーム内の例：Fortnite</h3>
        <p>
          ロビー右上のプレイヤープロフィール→歯車の「設定」→映像の「フレームレート制限（Frame
          Rate
          Limit）」で値を選び、「適用」。ロビーには別のFPS制限があるため、効果はプレイ中に確認します。
        </p>
        <p>
          V-SyncはモニターのHzに合わせてFPSを制限します。Hzを超える値などを試すためにオフにする場合は、まずその状態で基準を測り直してから上限を比較してください。Epicは変更で悪化した場合、元の設定へ戻すよう案内しています。
        </p>
        <h3>NVIDIA：ゲームごとの「最大フレームレート」</h3>
        <p>
          スタートで「NVIDIA コントロール
          パネル」を開く→「3D設定の管理」→「プログラム設定」→対象ゲームを選択→「最大フレームレート（Max
          Frame
          Rate）」をオン→数値を指定して「OK」→「適用」。一覧にない場合は「追加」からゲーム本体の.exeを選びます。
        </p>
        <p>
          「バックグラウンドアプリケーション最大フレームレート」は別項目です。ゲームを再起動して適用を確認し、戻す時は変更した項目を元の値へ戻します。
        </p>
        <h3>AMD：FRTCが表示される環境</h3>
        <p>
          AMD Software: Adrenalin
          Editionを開く→「ゲーム／グラフィックス」のグローバル設定→「詳細設定（Advanced）」→「Frame
          Rate Target Control」を有効にし、Max
          FPSを指定します。ゲームを終了して設定し、再起動して確認します。
        </p>
        <p>
          FRTCは公式に全画面モード向けとされ、表示される項目はGPU・ドライバー・導入形態で異なります。ここはグローバル設定なので他のゲームにも影響します。項目がない・効かない場合はゲーム内設定を使い、比較後に元へ戻します。Radeon
          Chillを同じ固定上限として混ぜないでください。
        </p>
        <p className="reset-small">
          <a href="https://www.epicgames.com/help/c-34254770/c-38015632/a17266354">
            Fortnite公式
          </a>{' '}
          ／{' '}
          <a href="https://www.nvidia.com/content/Control-Panel-Help/vLatest/en-us/mergedProjects/nv3d/Manage_3D_Settings_(reference).htm">
            NVIDIA公式
          </a>{' '}
          ／{' '}
          <a href="https://www.amd.com/en/resources/support-articles/faqs/dh3-012.html">
            AMD公式
          </a>
        </p>
      </section>
      <section className="diagnosis-table" id="stutter-values">
        <h2>60・90・120fps：数値の決め方と設定例</h2>
        <p>
          Windows
          11なら「設定」→「システム」→「ディスプレイ」→「ディスプレイの詳細設定」で、使っているモニターのHzを確認できます。ただし、
          <strong>HzはPCがそのFPSを出せる保証ではありません。</strong>
        </p>
        <p>
          重い場面を含むルートで、瞬間的な最低値ではなく普段維持できるFPSの下側を見ます。それより少し低い、ゲームで選べる値から比較を始めます。単発の大きな停止に合わせて、際限なく上限を下げないでください。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">仮の観察例</th>
              <th scope="col">最初に試す上限</th>
              <th scope="col">判定</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="観察例">60Hz／通常65〜95fps</td>
              <td data-label="上限例">60fps</td>
              <td data-label="判定">60付近を維持し、引っかかりが減るか</td>
            </tr>
            <tr>
              <td data-label="観察例">144Hz／通常100〜140fps</td>
              <td data-label="上限例">90fps（選択可能な場合）</td>
              <td data-label="判定">最高FPSより、描画間隔と操作感を比較</td>
            </tr>
            <tr>
              <td data-label="観察例">165Hz／通常125〜175fps</td>
              <td data-label="上限例">120fps</td>
              <td data-label="判定">重い場面でも120付近を維持できるか</td>
            </tr>
            <tr>
              <td data-label="観察例">60Hz／通常45〜58fps</td>
              <td data-label="上限例">
                60固定は維持できない。画質を下げるか30fpsを比較
              </td>
              <td data-label="判定">
                30では操作感が落ちる場合もある。快適さを含めて決める
              </td>
            </tr>
          </tbody>
        </table>
        <p className="reset-small">
          数値は設定の考え方を示す仮例で、実測結果・全ゲーム共通の推奨値ではありません。90fpsが選べなければ利用できる近い低めの値で比較します。固定リフレッシュレートでは上限との組み合わせで動きが不均等になる場合があり、VRRも動作範囲内での確認が必要です。
        </p>
      </section>
    </div>
  );
}
export function StutterAfterSteps() {
  return (
    <div className="reset-config-details">
      <section id="stutter-compare">
        <h2>同じ場面で「変更前→変更後→元に戻す」を比較</h2>
        <p>
          以下は本記事の比較手順です。1回だけ軽くなった結果を、設定の効果と取り違えないために条件をそろえます。
        </p>
        <h3>1. 測るルートと表示を決める</h3>
        <p>
          同じセーブ・練習場・同じカメラ方向を使い、約60秒で通れるルートを決めます。Steamでは「設定」→「ゲーム中（In
          Game）」のパフォーマンスオーバーレイから表示を設定できます。ゲーム内のFPS表示でも構いません。計測表示は1つにし、全比較で同じ表示を使います。
        </p>
        <p>
          解像度・画質・V-Sync・VRR・フレーム生成・録画の有無を記録します。フレーム生成を切って原因を調べる場合は、まずオフで基準を取り直し、以後の上限比較もオフで統一します。
        </p>
        <h3>2. 最初の読み込みを分けて記録する</h3>
        <p>
          シェーダーの事前構築を終え、ルートを1回通ります。この初回は「初回だけの引っかかり」として別記録にします。続く2回を変更前Aの比較対象にしてください。初回だけの症状を調べたい場合は、この初回記録も残します。
        </p>
        <h3>3. 上限だけを変えて、同じルートを2回</h3>
        <p>
          上限を設定した条件Bでも同じルートを2回。再起動が必要な設定では、各条件で再起動と慣らし走行をそろえます。平均FPSだけでなく「どこで何回止まったか」「視点移動や操作が悪化していないか」を記録します。フレームタイムのグラフを表示できる場合は、突出が減ったかも見ます。
        </p>
        <h3>4. 元の値へ戻して再確認する</h3>
        <p>
          Aへ戻した時に再び引っかかるなら、上限変更の効果を支持する材料になります。Aへ戻しても軽いなら、キャッシュの温まりや場面の差かもしれません。オンラインの試合ごとに比較するより、再現しやすい練習場などを使います。
        </p>
        <p>
          <strong>
            Bで繰り返し改善し、操作感も許容できるなら採用。変化なし・悪化なら元へ戻して、次の候補へ。
          </strong>
          平均FPSが下がったことだけを失敗とは判定しません。
        </p>
      </section>
      <section id="stutter-record" className="reset-checklist">
        <h2>比較結果を残すメモ</h2>
        <p>ゲーム・版／GPU・ドライバー／解像度・画質：</p>
        <p>モニターHz／V-Sync・VRR／フレーム生成：</p>
        <p>同じルート・計測表示／初回だけの症状：</p>
        <p>A 変更前：上限＿＿／1回目の引っかかり＿＿回／2回目＿＿回</p>
        <p>B 変更後：上限＿＿／1回目＿＿回／2回目＿＿回／操作感＿＿</p>
        <p>Aへ戻した結果＿＿／採用する設定＿＿</p>
        <p className="reset-small">
          これは記入用の書式です。編集部の実測値ではありません。資料確認：2026年9月27日。
        </p>
      </section>
      <section id="stutter-next">
        <h2>改善しなかった時は、症状に合わせて次へ</h2>
        <ul>
          <li>
            初回や更新後だけ：
            <a href="/guide/shader-cache-delete">
              シェーダー構築の待機・再構築手順
            </a>
          </li>
          <li>
            常に低FPS：<a href="/guide/low-fps">画質・解像度を下げる順番</a>
          </li>
          <li>
            テクスチャを下げると変わる：
            <a href="/guide/vram-shortage">VRAM不足の切り分け</a>
          </li>
          <li>
            ワイルズ固有の設定：
            <a href="/games/monster-hunter-wilds/fps">
              FPS上限・フレーム生成のゲーム別記事
            </a>
          </li>
          <li>
            ドライバー更新を境に発生：
            <a href="/guide/gpu-driver-update">ドライバーの確認</a>
          </li>
        </ul>
        <p>
          CPU全体の使用率が低いだけでCPUの問題を除外したり、GPU使用率が高いだけで故障と判断したりしないでください。上限の効果がない長い停止は、読み込みやゲーム側の不具合も候補です。
        </p>
      </section>
    </div>
  );
}
