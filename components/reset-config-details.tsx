/* oxlint-disable next/no-html-link-for-pages -- Native links match the article template. */
import { ShareButtons } from './share-buttons';

export function ResetConfigBeforeSteps() {
  return (
    <div className="reset-config-details">
      <section className="diagnosis-table" id="reset-decision">
        <h2>設定初期化を試すべき症状・先に確認すること</h2>
        <p>
          「いつから起きたか」で試す順を決めます。以下はゲムなお編集部の切り分け表です。改善を保証するものではありません。
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">症状・きっかけ</th>
              <th scope="col">最初の確認</th>
              <th scope="col">次の行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="症状">解像度・画面モード変更の直後から黒画面</td>
              <td data-label="最初の確認">設定画面を開けるか</td>
              <td data-label="次の行動">
                開ければ該当項目を戻す。開けなければ
                <a href="#step-1">設定ファイルを特定</a>
              </td>
            </tr>
            <tr>
              <td data-label="症状">configを編集してから起動しない</td>
              <td data-label="最初の確認">編集前のコピーがあるか</td>
              <td data-label="次の行動">
                あればそのファイルを復元。なければ公式の再生成手順を確認
              </td>
            </tr>
            <tr>
              <td data-label="症状">設定しても次回起動で元に戻る</td>
              <td data-label="最初の確認">保存・同期・上書きの問題か</td>
              <td data-label="次の行動">
                <a href="#reset-troubleshooting">再生成後の切り分け表</a>へ
              </td>
            </tr>
            <tr>
              <td data-label="症状">セーブが消えた・同期の競合が出た</td>
              <td data-label="最初の確認">設定とセーブの問題を分ける</td>
              <td data-label="次の行動">
                初期化を止めて<a href="/guide/save-data-backup">セーブの保全</a>
                を優先
              </td>
            </tr>
            <tr>
              <td data-label="症状">どのゲームでも落ちる・PCごと再起動する</td>
              <td data-label="最初の確認">特定ゲームの設定以外の原因</td>
              <td data-label="次の行動">
                <a href="/guide/pc-shuts-down-while-gaming">
                  PCが落ちる時の確認
                </a>
                へ
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section id="config-location">
        <h2>設定ファイルはどこ？ 保存先を探す順番</h2>
        <p>
          ゲーム名と「設定ファイル 場所」または「config
          reset」で公式サポートを探し、対象ファイル名まで確認します。ストア版・ゲームの版・Windowsユーザーが違うと、同じタイトルでも場所が異なることがあります。
        </p>
        <p>
          下記は<strong>探す入口の例</strong>
          です。すべてのゲームに存在する保存先や、削除対象の一覧ではありません。エクスプローラー上部のアドレスバーへ入力し、公式案内で指定されたゲームのフォルダーを開きます。
        </p>
        <dl className="reset-path-list">
          <div>
            <dt>
              <code>%LOCALAPPDATA%</code>
            </dt>
            <dd>
              ユーザーごとのローカルデータの入口。公式案内にあるゲーム名・メーカー名のフォルダーを探します。
            </dd>
          </div>
          <div>
            <dt>
              <code>%APPDATA%</code>
            </dt>
            <dd>ユーザーごとのRoamingデータの入口。Localとは別の場所です。</dd>
          </div>
          <div>
            <dt>ドキュメント／My Games</dt>
            <dd>
              エクスプローラーの「ドキュメント」から確認。OneDriveなどで保存場所が変わっている場合は実際の場所を確認します。
            </dd>
          </div>
          <div>
            <dt>ゲームのインストール先</dt>
            <dd>
              ランチャーのローカルファイル表示から開ける場合があります。そこに設定があるとは限らず、本体ファイルをまとめて退避しないでください。
            </dd>
          </div>
        </dl>
        <p>
          <code>.ini</code>・<code>.cfg</code>・<code>.json</code>
          などはファイル形式の手がかりに過ぎません。拡張子が同じでも用途は違います。Unreal
          Engineの公式資料でも設定は複数の階層で管理されます。「Engine.iniだから消してよい」とは判断できません。
          <a href="#references">出典：Epic Games・Microsoft</a>
        </p>
        <p>
          <strong>特定できない時：</strong>
          ファイルを作ったり、名前の似たフォルダーを消したりせず、ゲーム名・ストア・症状を添えて公式サポートへ確認してください。
        </p>
      </section>
      <section className="reset-checklist" id="reset-checklist">
        <h2>作業前の「3つそろったら開始」チェック</h2>
        <p>削除を急がず、戻せる状態を先に作ります。</p>
        <label>
          <input type="checkbox" />
          公式案内で対象の設定ファイルと再生成方法を確認した
        </label>
        <label>
          <input type="checkbox" />
          設定とセーブを別の場所へコピーし、コピー先を確認した
        </label>
        <label>
          <input type="checkbox" />
          元のフルパス・ファイル名・症状をメモした
        </label>
        <p className="reset-small">
          チェック状態は再読み込みするとリセットされます。
        </p>
      </section>
    </div>
  );
}

export function ResetConfigAfterSteps() {
  return (
    <div className="reset-config-details">
      <section className="diagnosis-table" id="reset-troubleshooting">
        <h2>再生成されない・設定が戻る場合の切り分け</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">確認した結果</th>
              <th scope="col">考えられること</th>
              <th scope="col">次にすること</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="結果">新しいファイルができない</td>
              <td data-label="考えられること">
                場所が違う／まだ設定を保存していない／起動途中で停止
              </td>
              <td data-label="次にすること">
                設定の適用→通常終了後に確認。公式の保存先・生成条件を再確認し、無関係なファイルを追加で退避しない
              </td>
            </tr>
            <tr>
              <td data-label="結果">新しくできたが症状は同じ</td>
              <td data-label="考えられること">
                設定以外の原因、または別の設定が影響
              </td>
              <td data-label="次にすること">
                作業前の状態へ戻し、
                <a href="/guide/verify-steam-files">本体の整合性確認</a>や
                <a href="/guide/remove-mods-safely">MODの切り分け</a>へ
              </td>
            </tr>
            <tr>
              <td data-label="結果">再起動すると古い設定に戻る</td>
              <td data-label="考えられること">
                クラウド同期／起動オプション／管理ツールの上書き
              </td>
              <td data-label="次にすること">
                そのゲームで設定が同期対象か確認。起動オプションやツールを記録し、1つずつ確認する
              </td>
            </tr>
            <tr>
              <td data-label="結果">変更した設定を保存できない</td>
              <td data-label="考えられること">
                読み取り専用／保存先への書き込みがブロックされている可能性
              </td>
              <td data-label="次にすること">
                対象ファイルのプロパティとWindowsのブロック通知を確認。保護機能を一括で無効にせず、公式の案内に従う
              </td>
            </tr>
            <tr>
              <td data-label="結果">起動できたがセーブが見えない</td>
              <td data-label="考えられること">
                違うアカウント・保存先、退避対象の誤りなど
              </td>
              <td data-label="次にすること">
                新規セーブを作らず終了。退避した内容・アカウントを確認し、バックアップを守る
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Steam
          Cloudには、ゲームによってセーブだけでなく設定も含まれます。同期を一時停止する必要がある場合も、先にローカルデータを保全し、対象ゲームの設定だけを変更してください。再び有効にして競合が出たら、日時・進行状況・バックアップを照合し、判断できなければ上書きせず止めます。
          <a
            href="https://help.steampowered.com/en/faqs/view/68D2-35AB-09A9-7678"
            target="_blank"
            rel="noreferrer"
          >
            Steam公式：Steam Cloud
          </a>
        </p>
      </section>
      <section className="reset-checklist" id="reset-record">
        <h2>保存・共有用：設定リセットの確認メモ</h2>
        <p>
          <strong>
            「退避 → 既定値で比較 → 1項目ずつ戻す → 再起動で確認」
          </strong>
          が基本です。この4つを残すと、相談相手も次の対策を判断しやすくなります。
        </p>
        <ul>
          <li>ゲーム名・ストア・症状が始まったきっかけ</li>
          <li>退避したファイル名とバックアップの有無</li>
          <li>再生成：できた／できない、症状：改善／変わらない／悪化</li>
          <li>次回起動：設定が残る／元に戻る</li>
        </ul>
        <p>
          公開するメモや画像では、Windowsのユーザー名、メールアドレス、アカウントIDを伏せてください。
        </p>
        <ShareButtons
          title="PCゲームの設定リセットで覚えたい4つ：退避→既定値で比較→1項目ずつ戻す→再起動で確認。セーブを守る手順と確認メモ"
          path="/guide/reset-config-file#reset-record"
          hashtag="PCゲーム"
        />
      </section>
      <p className="reset-small">
        編集：ゲムなお編集部。公式資料の確認日：2026年9月27日。判断表と確認メモは、公式資料をもとに編集部が整理したものです。個別ゲームでの実機検証結果や成功率を示すものではありません。
      </p>
    </div>
  );
}
