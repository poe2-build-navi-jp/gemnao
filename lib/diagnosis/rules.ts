import {
  CHECKED_AT,
  RULE_VERSION,
  isPcIssue,
  isSymptom,
  questions,
  type Action,
  type ActionStatus,
  type Answers,
  type DiagnosisResult,
  type Rule,
} from './model';
const source = {
  steam: {
    label: 'Steam公式：整合性確認',
    url: 'https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB',
  },
  update: {
    label: 'Steam公式：更新とインストール',
    url: 'https://help.steampowered.com/ja/faqs/view/21F5-8D5D-0141-7A5E',
  },
  tools: {
    label: 'Microsoft：Windowsのシステム構成ツール',
    url: 'https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows',
  },
  driver: {
    label: 'NVIDIA：NVIDIAアプリ',
    url: 'https://www.nvidia.com/en-us/software/nvidia-app/faq/',
  },
  screen: {
    label: 'Microsoft：黒い画面の確認',
    url: 'https://support.microsoft.com/en-us/windows/hardware/display-graphics/troubleshooting-blank-screens-in-windows',
  },
  vc: {
    label: 'Microsoft：Visual C++の対応版',
    url: 'https://learn.microsoft.com/ja-jp/cpp/windows/latest-supported-vc-redist',
  },
  dx: {
    label: 'Microsoft：DXGIエラーの分類',
    url: 'https://learn.microsoft.com/ja-jp/windows/win32/direct3ddxgi/dxgi-error',
  },
  fps: {
    label: 'Microsoft DirectX：CPUとGPUの処理制約',
    url: 'https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/',
  },
  monitor: {
    label: 'Steam：パフォーマンスモニター',
    url: 'https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767',
  },
  mods: {
    label: 'Vortex開発元：MODの配置と復元',
    url: 'https://github.com/Nexus-Mods/Vortex/wiki/MODDINGWIKI-Users-FAQ',
  },
};
const action = (
  id: string,
  title: string,
  article: string,
  steps: string[],
  sources: Action['sources'],
  extra: Partial<Action> = {},
): Action => ({
  id,
  title,
  article: `/guide/${article}`,
  steps,
  sources,
  time: '約3〜5分（目安）',
  risk: '低：確認が中心',
  reversible: '設定を変えなければ復元不要',
  warning:
    '1つずつ確認してください。症状の再現のために無理な負荷をかけないでください。',
  improved:
    '同じ条件でもう一度確認し、改善を記録します。ほかの対処を続ける必要はありません。',
  unchanged:
    '改善しなかったと記録し、次の未実施の確認へ進みます。判断できない場合は記事末尾の確認先を読みます。',
  ...extra,
});
export const actions: Record<string, Action> = {
  inspect: action(
    'inspect',
    '症状と発生した場面を確認する',
    'pc-game-crash',
    [
      'ゲームだけが閉じたか、Windowsも操作できなくなったかを確認します。分からなければ無理に再現させず、不明のまま相談できます。',
      'エラーがあれば画面で分類を確認します。ユーザー名・パスを含む文章を共有欄へ貼る必要はありません。',
    ],
    [source.tools],
  ),
  launcher: action(
    'launcher',
    'Steamとダウンロードの状態を確認する',
    'steam-game-not-launching',
    [
      'Steamのライブラリと「ダウンロード」を開き、対象ゲームの更新が完了しているか確認します。',
      '更新中なら終了を待って比較。Steam自体が開かない・エラーが残る場合は、記事のSteam側の確認へ進みます。',
    ],
    [source.update],
  ),
  verify: action(
    'verify',
    'Steamのゲームファイルを検証する',
    'verify-steam-files',
    [
      'ゲームと更新を終了します。セーブとMODの構成を記録し、必要なら別の場所へコピーします。',
      'ライブラリ → ゲームのプロパティ → インストール済みファイル → 整合性確認。再取得後はダウンロード完了を待って、同じ場面を試します。',
    ],
    [source.steam],
    {
      time: '約5〜15分（容量で変わります）',
      risk: '低〜中：配布ファイルを再取得',
      reversible: 'MODによる上書きは復元準備が必要',
      warning:
        'MODで変更したファイルが元に戻る場合があります。セーブ・MODの状態を先に控えてください。',
    },
  ),
  vc: action(
    'vc',
    'Visual C++の必要な版を確認する',
    'visual-c-runtime-error',
    [
      'VCRUNTIME / MSVCPなどのエラー分類と、対象ゲームの公式サポートにある必要なランタイムを確認します。',
      'ゲームが指定した年版とx86/x64を照合し、記事の公式配布先・修復手順へ進みます。手当たり次第に既存の版を削除しないでください。',
    ],
    [source.vc],
    {
      warning:
        'DLL単体配布サイトから取得しないでください。インストールが必要ならゲーム公式が指定する版と復旧手順を先に確認します。',
    },
  ),
  dx: action(
    'dx',
    'DirectXエラーの種類を確認する',
    'directx-error',
    [
      'DXGI_ERROR_DEVICE_REMOVEDなどの表記か、古いランタイム不足の表記かを分けます。どちらか不明なら「分からない」と記録します。',
      'Windows + R → dxdiagでバージョン・ディスプレイの情報を確認し、記事の対応する分岐へ。DirectXのバージョン表示だけで必要なGPU機能があるとは判断しません。',
    ],
    [source.dx],
  ),
  driver: action(
    'driver',
    'GPUドライバー更新前後を照合する',
    'gpu-driver-update',
    [
      'デバイス マネージャー → ディスプレイ アダプター → 使用中GPUのプロパティ → ドライバーで版を確認します。',
      '更新後だけの症状かを控え、PCメーカーまたはGPUメーカー公式の対応版・戻す方法を記事で確認します。更新の時期だけで原因とは断定しません。',
    ],
    [source.driver, source.screen],
    {
      warning:
        'ドライバー完全削除、DDU、Factory Resetは初期対処では行いません。変更する場合は現在の版と復元手順を先に記録します。',
    },
  ),
  mods: action(
    'mods',
    'MODを使わない状態と比較する',
    'remove-mods-safely',
    [
      'MOD一覧・読込順とセーブをバックアップします。対応ゲーム版をMOD配布元で確認します。',
      '管理ツールの無効化機能を使い、元のゲーム状態と比較します。手動導入やセーブ依存が分からない場合は削除せず、記事の導入方法別の確認へ進みます。',
    ],
    [source.mods],
    {
      risk: '中：MOD依存のセーブに注意',
      reversible: '構成を保存し、同じMODを戻せる場合',
      warning:
        'MODを外した状態で既存セーブを上書きしないでください。不明なファイルは削除しません。',
    },
  ),
  display: action(
    'display',
    '画面の切り替えと出力先を確認する',
    'black-screen',
    [
      'Windowsの画面が操作できるか、ゲームの音が聞こえるかを確認します。PC全体が映らない場合はゲーム単体の設定変更を中止します。',
      'ゲームが対応していればAlt + Enterでウィンドウ表示と比較。表示が戻れば画面設定を1項目ずつ戻します。変わらなければ出力先・HDRなど記事の順で確認します。',
    ],
    [source.screen],
    {
      reversible: '元の表示モードへ戻す',
      warning:
        '対応しないゲームもあります。画面が見えないまま設定変更を繰り返さないでください。',
    },
  ),
  settings: action(
    'settings',
    '変更したゲーム設定を元に戻して比較する',
    'reset-config-file',
    [
      '変更前の値が分かる項目だけ、ゲーム内設定から1つずつ戻して比較します。',
      '設定ファイルの初期化が必要なら、記事で対象ファイルとセーブの違いを確認し、別名コピー・戻し方を確保してから進めます。',
    ],
    [source.screen],
    {
      risk: '中：設定とセーブの区別が必要',
      reversible: '変更前の値・設定のコピーがある場合',
      warning:
        'この診断はファイルを削除しません。保存先が不明なら初期化しないでください。',
    },
  ),
  history: action(
    'history',
    '停止した時刻と履歴を照合する',
    'pc-game-crash',
    [
      '発生時刻を控え、Windowsの検索から信頼性履歴を表示します。ゲームの停止と同時刻の項目を確認します。',
      '繰り返す場面や更新と時期が重なるかを比べ、記事の確認順へ進みます。イベント番号だけで部品の故障と断定しません。',
    ],
    [source.tools],
  ),
  memory: action(
    'memory',
    'ゲーム中のメモリ使用状況を確認する',
    'pc-game-freezes',
    [
      'Ctrl + Shift + Esc → パフォーマンス → メモリで、症状が出る前後の使用状況を確認します。VRAMはGPU側の専用メモリ表示で分けて見ます。',
      '保存済みの不要なアプリを終了して同じ条件で比較。逼迫していなければメモリ不足とは決めず、記事の次の分岐を確認します。',
    ],
    [source.tools],
    {
      warning:
        '作業を保存してから不要なアプリを閉じます。システムのプロセスを一括終了しないでください。',
    },
  ),
  fpscap: action(
    'fpscap',
    'FPS上限と表示設定を確認する',
    'low-fps',
    [
      'ゲーム内のFPS上限とV-Syncを確認し、現在の値を控えます。ドライバー側にも上限がある場合はゲーム別設定を確認します。',
      '意図した上限なら故障とは限りません。値を1つ変えて比較し、変化がなければ元に戻して画質と負荷を確認します。',
    ],
    [source.monitor],
    { reversible: '控えた元の設定値へ戻す' },
  ),
  load: action(
    'load',
    '同じ場面で画質とFPSを比較する',
    'low-fps',
    [
      'ゲーム内の解像度・描画品質の元の値を控えます。1項目だけ下げ、同じ場面でFPSの変化を比べます。',
      '改善すれば描画負荷が関与する手がかりです。変わらなければCPU・FPS上限なども確認します。GPU使用率だけで故障を判断しません。',
    ],
    [source.fps],
    { reversible: '変更前の設定値へ戻す' },
  ),
  frametime: action(
    'frametime',
    '引っかかる場面とFPSを記録する',
    'stutter-fix',
    [
      '毎回同じ場面か、一定間隔か、初回だけかを分けます。ゲーム内表示またはSteamのパフォーマンスモニターで比較します。',
      'FPSが高くても瞬間的な停止は起きます。平均値だけで判断せず、裏のダウンロード・録画など同時に動く処理を1つずつ確認します。',
    ],
    [source.monitor],
  ),
  shader: action(
    'shader',
    '初回処理が完了しているか確認する',
    'stutter-fix',
    [
      'ゲーム内にシェーダー構築やロードの進捗があれば、通常の範囲で完了を待ちます。処理中にキャッシュを消さないでください。',
      '初回と2回目の同じ場面を比較。毎回止まる・長時間進捗が変わらない場合は初回処理と決めつけず、記事の確認へ進みます。',
    ],
    [source.monitor],
    { time: '処理時間はゲーム・PCにより異なります' },
  ),
  known: action(
    'known',
    'ゲーム更新と公式の既知問題を確認する',
    'steam-game-not-launching',
    [
      '利用中のランチャーで対象ゲームのお知らせを開き、更新日と発生時期、同じエラーや症状の告知があるかを照合します。',
      '一致する告知があれば公式の対象バージョンと対処を確認。告知がなければ既知問題とは決めず、ほかの確認へ進みます。',
    ],
    [source.update],
  ),
  pc: action(
    'pc',
    'ゲーム診断を止め、PC全体の症状を確認する',
    'pc-shuts-down-while-gaming',
    [
      '電源断・再起動・PC全体の停止は、通常のゲーム設定の切り分けから外れます。無理な再現テストや負荷テストを中止してください。',
      '異臭・煙・異常な熱などがあれば使用を中止し、安全を確保してメーカーへ相談します。PCの内部や電源装置を開けず、対応記事で確認事項を整理します。',
    ],
    [source.tools],
    {
      warning:
        '電圧、BIOS、レジストリを変更しないでください。突然の電源断は保存中のデータに影響します。',
      improved:
        '一時的に戻っても原因が分かったとは限りません。発生時刻と症状を記録し、繰り返す場合はメーカーへ相談してください。',
      unchanged:
        '通常のゲーム設定変更を続けず、PCメーカーのサポートへ相談してください。',
    },
  ),
};
const rule = (
  id: string,
  action: string,
  priority: number,
  conditions: Rule['conditions'],
  reason: string,
  excludes: Rule['excludes'] = {},
): Rule => ({
  id,
  action,
  priority,
  conditions,
  reason,
  excludes,
  version: RULE_VERSION,
  checkedAt: CHECKED_AT,
});
export const rules: Rule[] = [
  rule(
    'change-mods',
    'mods',
    100,
    { change: ['mods'] },
    'MODの追加・更新後から発生したため、MODを使わない状態との比較を優先します。時期の一致は原因確定ではありません。',
  ),
  rule(
    'change-driver',
    'driver',
    99,
    { change: ['driver'] },
    'ドライバー更新後から発生したと回答したため、更新前後の版と状態を先に確認します。',
  ),
  rule(
    'error-vc',
    'vc',
    97,
    { error: ['vc'] },
    'Visual C++関連の表示を選んだため、ゲームが必要とするランタイムを確認します。',
  ),
  rule(
    'error-dx',
    'dx',
    96,
    { error: ['directx'] },
    'DirectX / DXGIの表示を選んだため、エラー分類と必要な機能を先に確認します。',
  ),
  rule(
    'error-gpu',
    'driver',
    95,
    { error: ['gpu'] },
    'GPU関連のエラー表示を選んだため、使用しているGPUとドライバーの版を確認します。',
  ),
  rule(
    'error-memory',
    'memory',
    94,
    { error: ['memory'] },
    'メモリ関連の表示を選んだため、RAMとVRAMを分けて使用状況を確認します。',
  ),
  rule(
    'change-settings',
    'settings',
    92,
    { change: ['settings'] },
    '画質・画面設定の変更後に発生したため、変更した項目から確認します。',
  ),
  rule(
    'launch-steam',
    'launcher',
    88,
    {
      symptom: ['not-launching'],
      launcher: ['steam'],
      observation: ['nothing', 'launcher'],
    },
    'Steamで無反応またはランチャーまでと回答したため、ゲームより先に起動元と更新状態を確認します。',
  ),
  rule(
    'black-display',
    'display',
    86,
    {
      symptom: ['black-screen'],
      observation: ['audio', 'fullscreen', 'startup'],
    },
    'ゲーム画面の表示に問題があるため、表示モードと出力の状態を確認します。',
  ),
  rule(
    'fps-cap',
    'fpscap',
    86,
    { symptom: ['low-fps'], observation: ['capped'] },
    '一定のFPSで止まると回答したため、FPS上限の設定を先に確認します。',
  ),
  rule(
    'first-shader',
    'shader',
    85,
    { symptom: ['stutter', 'freeze'], observation: ['first-run', 'loading'] },
    '初回の場面や処理中に止まると回答したため、初回処理と持続する不具合を分けます。',
  ),
  rule(
    'update-known',
    'known',
    82,
    { change: ['game-update'] },
    'ゲーム更新後から発生したため、対象バージョンの公式告知と症状を照合します。',
  ),
  rule(
    'heavy-load',
    'load',
    80,
    { symptom: ['low-fps', 'stutter'], observation: ['always', 'heavy'] },
    '画質や場面による重さを選んだため、同じ場面で設定を1つだけ変えて比較します。',
  ),
  rule(
    'crash-history',
    'history',
    73,
    { symptom: ['crash'], observation: ['startup', 'scene', 'random'] },
    'ゲームが閉じる時刻や場面を手がかりに、Windowsの履歴と照合します。',
  ),
  rule(
    'freeze-memory',
    'memory',
    72,
    { symptom: ['freeze'], observation: ['scene', 'random'] },
    'ゲームが止まる場面があるため、停止前後のメモリと同時に動くアプリを確認します。',
  ),
  rule(
    'stutter-record',
    'frametime',
    71,
    { symptom: ['stutter'], observation: ['periodic', 'heavy', 'first-run'] },
    '瞬間的な引っかかりを選んだため、平均FPSとは分けて発生の条件を記録します。',
  ),
  rule(
    'steam-files',
    'verify',
    60,
    {
      launcher: ['steam'],
      scope: ['game'],
      symptom: ['not-launching', 'crash', 'freeze'],
    },
    'Steamのゲームだけで発生しているため、配布ファイルの不足・不整合を確認する候補です。',
    { change: ['mods'], observation: ['loading'] },
  ),
  rule(
    'windows-history',
    'history',
    61,
    { change: ['windows'] },
    'Windows Update後と回答したため、停止日時と更新履歴を照合します。更新の削除をすぐには勧めません。',
  ),
];
const matches = (a: Answers, c: Rule['conditions']) =>
  Object.entries(c).every(([k, vs]) =>
    vs?.includes(a[k as keyof Answers] || ''),
  );
export function diagnose(
  a: Answers,
  tried: Record<string, ActionStatus> = {},
  candidates: Rule[] = rules,
): DiagnosisResult {
  const base = { version: RULE_VERSION, checkedAt: CHECKED_AT };
  if (isPcIssue(a))
    return {
      ...base,
      scope: 'pc',
      summary:
        'PC全体の異常が含まれています。ゲーム設定の変更を続けず、安全の確認を優先してください。',
      missing: [],
      recommendations: [
        {
          ruleId: 'safety-pc',
          reason:
            'ゲームだけでなくPC全体が停止・再起動・電源断すると回答したためです。',
          action: {
            ...actions.pc,
            article:
              a.scope === 'restart'
                ? '/guide/bsod-while-gaming'
                : a.scope === 'pc-freeze'
                  ? '/guide/pc-game-freezes'
                  : actions.pc.article,
          },
        },
      ],
    };
  const missing = ['scope', 'observation', 'change', 'launcher'].filter(
    (k) => !a[k as keyof Answers] || a[k as keyof Answers] === 'unknown',
  );
  if (a.observation === 'error' && (!a.error || a.error === 'unknown'))
    missing.push('error');
  const seen = new Set<string>();
  const selected = isSymptom(a.symptom)
    ? candidates
        .filter(
          (r) =>
            matches(a, r.conditions) &&
            !Object.entries(r.excludes).some(([k, vs]) =>
              vs?.includes(a[k as keyof Answers] || ''),
            ),
        )
        .sort((x, y) => y.priority - x.priority)
        .filter((r) => {
          if (
            seen.has(r.action) ||
            tried[r.action] === 'unchanged' ||
            tried[r.action] === 'improved' ||
            tried[r.action] === 'tried'
          )
            return false;
          seen.add(r.action);
          return true;
        })
        .slice(0, 3)
        .map((r) => ({
          ruleId: r.id,
          reason: r.reason,
          action: actions[r.action],
        }))
    : [];
  return {
    ...base,
    scope: selected.length ? 'game' : 'insufficient',
    summary: selected.length
      ? '回答から、次の順番で確認することをおすすめします。原因の確定や確率の判定ではありません。'
      : '現在の回答だけでは、優先する原因候補を絞れません。すでに試した対処を繰り返さず、追加情報を確認してください。',
    missing: missing.map((k) => questions[k]?.title || '発生状況'),
    recommendations: selected.length
      ? selected
      : [
          {
            ruleId: 'insufficient-information',
            reason:
              '情報が足りない、または該当する確認をすでに実施しているためです。',
            action: actions.inspect,
          },
        ],
  };
}
