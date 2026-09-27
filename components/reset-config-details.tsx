/* oxlint-disable next/no-html-link-for-pages -- Native links match the article template. */
import { PathCopy } from './path-copy';
import { ResetConfigChecklist } from './reset-config-checklist';

const examples = [
  {
    game: 'エルデンリング（Steam版）',
    folder: String.raw`%APPDATA%\EldenRing`,
    file: 'GraphicsConfig.xml',
    action:
      '画面設定の初期化はこのXMLだけを退避。数字のフォルダー内のセーブとは分けて扱います。',
    href: '/games/elden-ring/not-launching',
    label: 'エルデンリングの復旧手順',
    source: 'https://www.nexusmods.com/eldenring/mods/135',
    sourceLabel: 'MOD作者による設定ファイルの記録',
  },
  {
    game: 'モンハンワイルズ（Steam製品版）',
    folder: String.raw`C:\Program Files (x86)\Steam\steamapps\common\MonsterHunterWilds`,
    file: 'config.ini',
    action:
      '別ドライブに入れた場合はSteamでゲームを右クリック→管理→ローカルファイルを閲覧。開いたフォルダー直下のconfig.iniを退避します。',
    href: '/games/monster-hunter-wilds/config-file',
    label: 'ワイルズのconfig.ini専用ガイド',
    source:
      'https://steamcommunity.com/app/2246340/discussions/0/596267902352499417/',
    sourceLabel: 'カプコン公式：インストール先の案内',
  },
  {
    game: 'Fortnite（Windows版）',
    folder: String.raw`%LOCALAPPDATA%\FortniteGame\Saved\Config\WindowsClient`,
    file: 'GameUserSettings.ini',
    action:
      '設定が保存されない症状では、初期化より先にこのファイルのプロパティで「読み取り専用」を外すのがEpic公式の手順です。',
    href: '/guide/black-screen',
    label: '黒画面の切り分けガイド',
    source:
      'https://www.epicgames.com/help/c-202300000001636/c-202300000001719/a202300000013484',
    sourceLabel: 'Epic公式：設定の保存とグラフィック問題',
  },
];

export function ResetConfigBeforeSteps() {
  return (
    <div className="reset-config-details">
      <section className="diagnosis-table" id="config-location">
        <h2>ゲーム別：設定ファイルの保存先3例</h2>
        <p>
          表の「コピー」を押したら、エクスプローラー上部のアドレスバーへ貼り付けてEnterを押します。フォルダー内で、表に記載したファイルを探してください。
        </p>
        <table className="reset-examples">
          <thead>
            <tr>
              <th scope="col">ゲーム／設定ファイル</th>
              <th scope="col">開くフォルダー</th>
              <th scope="col">このゲームでの扱い</th>
            </tr>
          </thead>
          <tbody>
            {examples.map((e) => (
              <tr key={e.game}>
                <td data-label="ゲーム">
                  <strong>{e.game}</strong>
                  <br />
                  <code>{e.file}</code>
                </td>
                <td data-label="フォルダー">
                  <code>{e.folder}</code>
                  <PathCopy value={e.folder} />
                </td>
                <td data-label="操作">
                  <p>{e.action}</p>
                  <a href={e.href}>{e.label}</a>
                  <br />
                  <a
                    className="reset-small"
                    href={e.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {e.sourceLabel}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reset-small">
          Windows向け。ワイルズのパスはSteamの標準インストール先です。保存先の資料確認：2026年9月27日。編集部によるゲーム実機検証は未実施です。
        </p>
        <details>
          <summary>表にないゲーム・フォルダーが見つからない場合</summary>
          <p>
            ゲームのPC版・ストアを確認して、公式サポートの保存先を調べます。設定は初回起動や正常終了後に作られる場合もあります。AppDataは隠しフォルダーなので、上のようにアドレスバーへ直接入力すると開けます。設定がファイル以外で管理されるゲームもあります。
          </p>
        </details>
      </section>
      <section className="diagnosis-table" id="reset-decision">
        <h2>この症状なら初期化を試す？</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">きっかけ</th>
              <th scope="col">先にすること</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="きっかけ">画面設定を変えた直後の黒画面</td>
              <td data-label="先にすること">
                設定画面を開ければ該当項目を戻す。開けなければ設定ファイルを退避
              </td>
            </tr>
            <tr>
              <td data-label="きっかけ">configの手動編集後に起動しない</td>
              <td data-label="先にすること">
                編集前のコピーがあれば復元。なければ下の手順で既定値と比較
              </td>
            </tr>
            <tr>
              <td data-label="きっかけ">設定しても次回起動で元に戻る</td>
              <td data-label="先にすること">
                <a href="#reset-troubleshooting">保存・同期の確認</a>へ
              </td>
            </tr>
            <tr>
              <td data-label="きっかけ">セーブ消失／PCごと再起動</td>
              <td data-label="先にすること">
                <a href="/guide/save-data-backup">セーブの保全</a>／
                <a href="/guide/pc-shuts-down-while-gaming">
                  PCが落ちる原因の確認
                </a>
                へ
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <ResetConfigChecklist />
    </div>
  );
}

export function ResetConfigAfterSteps() {
  return (
    <div className="reset-config-details">
      <section className="diagnosis-table" id="reset-troubleshooting">
        <h2>初期化後の結果で次の行動を選ぶ</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">結果</th>
              <th scope="col">確認・次の行動</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="結果">ファイルが再生成されない</td>
              <td data-label="次の行動">
                設定を適用して通常終了後に確認。作られなければ保存先と起動できた段階を見直す
              </td>
            </tr>
            <tr>
              <td data-label="結果">再生成されたが直らない</td>
              <td data-label="次の行動">
                元の設定へ復元し、
                <a href="/guide/verify-steam-files">整合性確認</a>や
                <a href="/guide/remove-mods-safely">MODの切り分け</a>へ
              </td>
            </tr>
            <tr>
              <td data-label="結果">古い設定に戻る</td>
              <td data-label="次の行動">
                クラウド同期、起動オプション、設定管理ツールによる上書きを1つずつ確認
              </td>
            </tr>
            <tr>
              <td data-label="結果">変更を保存できない</td>
              <td data-label="次の行動">
                対象ファイルの読み取り専用属性やWindowsのブロック通知を確認。Fortniteは上の表を参照
              </td>
            </tr>
            <tr>
              <td data-label="結果">セーブが見えない</td>
              <td data-label="次の行動">
                新規セーブを作らず終了し、退避したファイルと利用アカウントを確認
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Steam
          Cloudはゲームによって設定も同期します。競合が出たら、日時・進行状況・バックアップを照合してから選びます。
          <a href="/guide/steam-cloud-sync-error">同期エラーの確認手順</a>
        </p>
      </section>
      <section className="reset-checklist" id="reset-record">
        <h2>相談・共有に使える確認メモ</h2>
        <p>
          <strong>退避 → 既定値で比較 → 1項目ずつ戻す → 再起動で確認。</strong>
          相談時は次の4点を添えると、同じ確認の繰り返しを減らせます。
        </p>
        <ul>
          <li>ゲーム名・ストア・症状のきっかけ</li>
          <li>退避したファイル名・バックアップの有無</li>
          <li>再生成できたか・症状は改善したか</li>
          <li>次回起動でも設定が残るか</li>
        </ul>
        <p className="reset-small">
          共有する画面ではWindowsのユーザー名・アカウントIDを伏せてください。
        </p>
      </section>
    </div>
  );
}
