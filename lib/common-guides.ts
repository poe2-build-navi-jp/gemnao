import type { ContentStatus } from '@/lib/game-articles';
import { commonGrowthGuides } from '@/lib/common-growth-guides';

export type CommonGuide = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  conclusion: string;
  checkedAt: string;
  steps: { title: string; actions: string[] }[];
  sources: { label: string; url: string }[];
  related: string[];
  status: ContentStatus;
  causes: string[];
};
const causeMap: Record<string, string[]> = {
  'low-gpu-usage': [
    'FPS上限やCPUボトルネック',
    '内蔵GPUでの起動',
    '省電力設定',
  ],
  'pc-game-freezes': [
    'MOD・オーバーレイの競合',
    'メモリ・VRAM不足',
    '温度上昇や破損ファイル',
  ],
  'steam-game-not-launching': [
    'Steamプロセスの停止',
    '破損ファイル',
    'MOD・外部DLLの競合',
  ],
  'verify-steam-files': [
    '不足ファイル',
    '更新失敗',
    'セキュリティソフトによる隔離',
  ],
  'pc-game-crash': [
    'MOD・オーバーレイ',
    'GPUドライバー',
    'VRAM・温度・破損ファイル',
  ],
  'black-screen': [
    '画面モードの不一致',
    '壊れた表示設定',
    '外部表示・オーバーレイ',
  ],
  'gpu-driver-update': [
    '古いドライバー',
    'ゲーム対応版との不一致',
    '更新後の再起動不足',
  ],
  'stutter-fix': [
    'フレーム時間の乱れ',
    'シェーダー構築',
    'VRAM・ストレージ待ち',
  ],
  'low-fps': ['解像度・レイトレーシング負荷', 'GPUドライバー', 'VRAM不足'],
  'vram-shortage': [
    '高解像度テクスチャ',
    '解像度・影・RT負荷',
    'バックグラウンドGPU利用',
  ],
  'save-data-backup': [
    'ローカル保存とクラウド保存の混同',
    '同期競合',
    'コピー漏れ',
  ],
  'steam-input-controller': [
    'Steam Input設定',
    '複数コントローラー',
    '外部変換ツール',
  ],
  'controller-double-input': [
    'Steam InputとDS4Windowsの二重変換',
    '複数入力機器',
    'ゲーム側割り当て',
  ],
  'directx-error': [
    'GPUドライバー',
    '破損ファイル',
    'Windows・DirectX関連更新',
  ],
  'visual-c-runtime-error': [
    '再頒布可能パッケージの破損',
    '必要版の不足',
    'ゲームファイル破損',
  ],
  'remove-mods-safely': [
    '本体更新とMOD版の不一致',
    '外部DLLの残存',
    '読み込み順の競合',
  ],
  'reshade-uninstall': [
    'API DLLの残存',
    'ReShade設定の競合',
    '別API向けファイル',
  ],
  'reset-config-file': ['壊れた設定', '画面外の解像度', '旧版設定の不整合'],
  'shader-cache-delete': [
    '旧シェーダーの不整合',
    'ドライバー更新',
    '再構築未完了',
  ],
  'uninstall-save-data': [
    '保存先がゲーム外',
    'Steam Cloud同期',
    'アンインストール対象の違い',
  ],
};
const steam = {
  label: 'Steamサポート',
  url: 'https://help.steampowered.com/ja/faqs/view/5814-D9A3-BE42-62DF',
};
const repair = {
  label: 'Steam：ゲームファイルの整合性確認',
  url: 'https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB',
};
const nv = {
  label: 'NVIDIA公式ドライバー',
  url: 'https://www.nvidia.com/ja-jp/drivers/',
};
const amd = {
  label: 'AMD公式ドライバー',
  url: 'https://www.amd.com/ja/support/download/drivers.html',
};
const reviewedActions: Record<string, string[][]> = {
  'low-fps': [
    [
      'ゲームの「設定」→「映像」「ディスプレイ」または「グラフィック」を開く。項目名はゲームによって異なります',
      '解像度・レンダリング解像度を確認し、まずレンダリング倍率が100%を超えていれば100%に戻して適用する',
      '対応するアップスケーラー（DLSS・FSR・XeSS）が選べる場合は「品質」で比較する。設定がなければ解像度を1段階下げる',
    ],
    [
      '同じグラフィック設定で「レイトレーシング」をオフにして適用する。項目がないゲームは次の操作へ進む',
      '改善が足りなければ「影の品質」を1段階下げて適用し、同じセーブ・同じ場所で確認する',
    ],
    [
      'グラフィック設定の「テクスチャ品質」を1段階下げ、再起動を求められたらゲームを終了して起動し直す',
      'ブラウザーの動画・録画アプリを終了して比較する。使用量を確認するにはCtrl＋Shift＋Esc→パフォーマンス→GPU→専用GPUメモリを開く',
      '画質を下げてもFPSが変わらない場合は、FPS上限や使用GPUを切り分けるため関連記事「GPU使用率が低い」を確認する',
    ],
  ],
  'vram-shortage': [
    [
      'Ctrl＋Shift＋Escでタスクマネージャーを開き、「パフォーマンス」→使用中の「GPU」を選ぶ',
      '「専用GPUメモリ」の使用量と容量を確認する。「共有GPUメモリ」と混同しない。内蔵GPUではこの表示が異なる場合があります',
      'ゲーム内にVRAM使用量の見積もりがあれば併せて確認する。上限近くという表示だけでクラッシュ原因とは断定しない',
    ],
    [
      'Steamで別配布の高解像度テクスチャDLCを入れている場合、ゲームを終了→ライブラリの対象ゲームを右クリック→プロパティ→DLCを開く',
      '高解像度テクスチャパックに該当する項目だけのチェックを外し、更新完了を待つ。DLC欄や対象パックがなければこの操作は不要です',
      'テクスチャMODは導入時の管理ツールで無効化する。ゲーム本体のファイルを名前だけで削除しない',
    ],
    [
      'ゲームの設定→グラフィックでテクスチャ品質を1段階下げ、適用してゲームを再起動する',
      'まだ不足する場合はレイトレーシングをオフにして比較し、次にレンダリング解像度を下げる',
      '変更した設定ごとに同じ場面と専用GPUメモリ使用量を確認し、効果がなければ設定を戻す',
    ],
  ],
  'low-gpu-usage': [
    [
      'ゲームの設定→映像またはグラフィックでFPS上限と垂直同期を確認する。設定した上限のFPSが出ているなら、GPU使用率を上げる必要はありません',
      '低FPSの場合はCtrl＋Shift＋Esc→パフォーマンス→CPUを開く。CPUグラフを右クリック→グラフの変更→論理プロセッサで、一部のCPUだけ高負荷になっていないか確認する',
    ],
    [
      'ゲームを終了し、Windows 11の設定→システム→ディスプレイ→グラフィックを開く',
      '対象ゲームを選択し、GPUの設定で「高パフォーマンス」を選んで保存する。旧表示では「オプション」内にあります',
      '一覧にない場合はデスクトップアプリの追加からゲームの実行ファイルを指定する。Steamのライブラリ→対象ゲームを右クリック→管理→ローカルファイルを閲覧でインストール先を確認できます',
      'ゲームを起動し直して比較する。GPUが1台だけのPCでは選択肢が変わらない場合があります',
    ],
    [
      'ノートPCはACアダプターを接続する。Windows 11の設定→システム→電源とバッテリー→電源モードを開き、省電力の場合はバランスに戻して比較する',
      'ドライバーを調べるにはWindows＋R→dxdiag→ディスプレイでGPU名とドライバー情報を確認する',
      'NVIDIAはNVIDIAアプリ→ドライバー、AMDはAMD Software→設定→システム、IntelはIntel Driver & Support Assistantで対応更新を確認する。ノートPCは製品メーカーの対応版を優先し、更新後に再起動する',
    ],
  ],
  'directx-error': [
    [
      'エラー画面の全文を控え、Windows＋R→dxdiagを実行する。「システム」のDirectXバージョンと「ディスプレイ」のGPU名・機能レベルを確認する',
      'Windows 11のスタート→設定→Windows Update→更新プログラムのチェックを選び、通常の更新を完了して再起動する',
      'DirectXの表示バージョンだけでゲームの必要機能への対応は判断できません。ゲームの最低動作環境とGPUの機能レベルも照合する',
    ],
    [
      'Steamを開き、ライブラリ→対象ゲームを右クリック→プロパティ→インストール済みファイル→ゲームファイルの整合性を確認を選ぶ',
      '完了後に再起動して確認する。古いDirectX DLLの不足が続く場合はゲーム公式の必要ランタイム案内を確認し、非公式サイトから単体DLLを入れない',
    ],
    [
      'dxdiagで確認したGPUメーカーに合わせて、NVIDIAアプリ→ドライバー、AMD Software→設定→システム、またはIntel Driver & Support Assistantで更新を確認する',
      'ノートPCでは製品メーカーの対応ドライバーを優先する。インストーラーの案内に従って更新し、Windowsを再起動して同じ起動方法で確認する',
      '同じエラーが続く場合はGPU名・ドライバー版・エラー全文をゲーム公式サポートへ伝える。DX12非対応GPUを更新だけで対応させることはできません',
    ],
  ],
  'visual-c-runtime-error': [
    [
      'エラーダイアログを撮影し、MSVCP140.dll・VCRUNTIME140.dllなどのファイル名やエラーコードを末尾まで控える',
      'ゲームの公式動作環境・サポートで必要なVisual C++の版と32bit（x86）／64bit（x64）を確認する。Windowsが64bitでも32bitゲームにはx86版が必要です',
    ],
    [
      '出典の「Microsoft：Visual C++再頒布可能パッケージ」を開き、ゲームが必要とする版とアーキテクチャのインストーラーをダウンロードする',
      'ダウンロードしたMicrosoftのインストーラーを開き、「修復」が表示される場合は修復する。未導入なら利用条件を確認してインストールする',
      '必要な版が2013以前ならその版を使用する。最新v14だけで全世代を置き換えられるわけではないため、既存の旧版をまとめて削除しない',
    ],
    [
      '作業中のファイルを保存し、Windowsのスタート→電源→再起動を選ぶ',
      'Steamのライブラリ→ゲームを右クリック→プロパティ→インストール済みファイル→ゲームファイルの整合性を確認を選ぶ',
      '完了後にゲームを起動する。同じエラーなら全文と導入したパッケージの版を公式サポートへ伝え、単体DLL配布サイトは使わない',
    ],
  ],
  'remove-mods-safely': [
    [
      'ゲームを終了し、公式サポートで対象ゲームのセーブ保存先を確認する。エクスプローラーでセーブフォルダーをコピーし、別の場所に日付付きフォルダーを作って貼り付ける',
      'MOD管理ツールの有効一覧と読み込み順を画面保存する。手動導入した場合は配布元の導入手順と追加ファイル一覧を残す',
    ],
    [
      '管理ツールで入れたMODは同じツールで無効化し、反映・配置の操作が必要な場合はそのツールの案内に従う',
      '手動導入分は追加したと確認できるファイルだけを、ゲームの外に作った退避フォルダーへ移す。不明なDLLや本体ファイルは削除しない',
      'Steamワークショップ利用時はSteamライブラリ→対象ゲーム→ワークショップ→自分のファイル→サブスクライブ中のアイテムで対象を確認し、一覧を控えてから解除する',
    ],
    [
      'Steamライブラリ→対象ゲームを右クリック→プロパティ→インストール済みファイル→ゲームファイルの整合性を確認を選ぶ',
      '検証完了後にMODなしでタイトル画面まで起動する。MOD必須の既存セーブはロード・上書きせず、新規データで症状を確認する',
      '整合性確認は手動で追加したMODファイルをすべて削除する機能ではありません。症状が残る場合は導入記録と退避漏れを照合する',
    ],
  ],

  'steam-game-not-launching': [
    [
      '保存中でないことを確認してSteamメニュー→終了を選ぶ',
      'Windowsのスタート→電源→再起動後、Steamから対象ゲームだけを起動する',
    ],
    [
      'Steamはライブラリのゲームを右クリック→プロパティ→インストール済みファイル→ゲームファイルの整合性を確認を選ぶ',
      '検証が完了してから同じ起動方法で確認する',
    ],
    [
      'MOD管理ツールで導入したMODを無効にする。手動導入分は導入記録にあるファイルだけを退避する',
      'Steamの対象ゲームのプロパティ→一般でオーバーレイをオフにする',
      '1項目ずつ起動を比較し、効果がなければ設定を戻す。名称だけでDLLを削除しない',
    ],
  ],
  'verify-steam-files': [
    [
      'ゲームを終了してSteamライブラリを開く',
      '対象ゲームを右クリックし、プロパティを選ぶ',
    ],
    [
      'インストール済みファイル→ゲームファイルの整合性を確認を選ぶ',
      '完了まで待つ。変更済みゲームファイルは元に戻る場合があるためMODは事前に退避する',
    ],
    [
      '検証完了後にSteamを終了して起動し直す',
      '対象ゲームを起動して同じ症状を確認する。再取得されるファイルがあっても、それだけで故障とは判断しない',
    ],
  ],
  'pc-game-crash': [
    [
      'エラー画面を撮影し、起動直後・ロード中・プレイ中のどこで落ちるか記録する',
      'ゲーム版、GPU名、ドライバー版、再現するセーブや場面を控える',
    ],
    [
      'MOD管理ツールでMODを無効にして起動する。MOD必須のセーブを上書きしない',
      '改善しなければSteamのプロパティ→一般でオーバーレイをオフにして再確認する',
    ],
    [
      'Steamはライブラリのゲームを右クリック→プロパティ→インストール済みファイル→ゲームファイルの整合性を確認を選ぶ',
      '改善しなければGPUメーカーの公式ドライバーを確認して更新し、Windows再起動後に比較する',
    ],
  ],
  'black-screen': [
    [
      'ゲームのウィンドウを選び、Alt＋Enterを一度押す',
      '映ればゲームの画面設定でモニター対応の解像度を選んで適用する',
    ],
    [
      'ゲームを終了し、そのゲームの公式サポートで設定ファイルの保存先を確認する',
      '設定ファイルだけを別フォルダーにコピーし、元ファイルを別名にして起動する。場所やセーブとの区別が不明なら実施しない',
      '再生成後に表示を確認し、悪化したら終了して退避した設定を戻す',
    ],
    [
      'Windows＋Pで使用画面を1台にして再確認する',
      'Steamのプロパティ→一般でオーバーレイをオフにして比較する。効果がなければ元に戻す',
    ],
  ],
  'gpu-driver-update': [
    ['Windows＋Rでdxdiagを実行し、ディスプレイ欄のGPU名・ドライバー版を控える'],
    [
      'ノートPCは製品メーカー、それ以外はGPUメーカーの公式配布で型番とWindows版に合うドライバーを選ぶ',
      'インストール後にWindowsを再起動し、同じ場面を比較する',
    ],
    [
      'インストール完了後にWindowsを再起動する',
      '同じゲーム・同じ画質・同じ場所で更新前の症状と比較する。悪化した場合はメーカーが配布する対応版へ戻すことを検討する',
    ],
  ],
};
const mk = (
  slug: string,
  title: string,
  shortTitle: string,
  description: string,
  conclusion: string,
  names: string[],
  related: string[],
  sources = [steam],
): CommonGuide => ({
  slug,
  title,
  shortTitle,
  description,
  conclusion,
  related,
  sources: [
    ...sources,
    ...(slug === 'low-gpu-usage'
      ? [
          {
            label: 'Microsoft：Windows 11のGPU設定',
            url: 'https://support.microsoft.com/en-us/windows/optimizations-for-windowed-games-in-windows-11-3f006843-2c7e-4ed0-9a5e-f9389e535952',
          },
        ]
      : []),
    ...(slug === 'directx-error'
      ? [
          {
            label: 'Microsoft：DirectXのバージョンを確認する',
            url: 'https://support.microsoft.com/en-us/windows/hardware/display-graphics/which-version-of-directx-is-on-your-pc',
          },
        ]
      : []),
  ],
  checkedAt: [
    'low-fps',
    'vram-shortage',
    'low-gpu-usage',
    'directx-error',
    'visual-c-runtime-error',
    'remove-mods-safely',
  ].includes(slug)
    ? '2026-09-24'
    : reviewedActions[slug]
      ? '2026-09-23'
      : '2026-09-12',
  status: 'verified',
  causes: causeMap[slug] || [],
  steps: names.map((title, i) => ({
    title,
    actions: reviewedActions[slug]?.[i] || [
      `ゲームとランチャーを終了し、「${title}」の変更前の状態を記録する`,
      `「${title}」だけを実施し、ほかの設定は同時に変えない`,
      `${i === names.length - 1 ? 'PCを再起動して' : '同じ起動方法・場面で'}症状を比較し、改善しなければ元へ戻す`,
    ],
  })),
});
export const commonGuides: CommonGuide[] = [
  mk(
    'low-gpu-usage',
    'PCゲームでGPU使用率が低い時の確認方法',
    'GPU使用率が低い',
    'FPSが低いのにGPU使用率が上がらない、内蔵GPUで動いている疑いがある場合の手順です。まずFPS上限に達していないかを確認します。Windows 11で高性能GPUを選ぶ操作、CPU負荷の見方、電源とドライバーの確認を順番に説明します。',
    'FPS上限、CPU負荷、使用GPU、電源設定を1項目ずつ確認します。',
    [
      'FPS上限とCPU負荷を確認する',
      '高性能GPUで起動しているか確認する',
      '電源設定とGPUドライバーを確認する',
    ],
    ['low-fps', 'gpu-driver-update', 'vram-shortage'],
    [nv, amd],
  ),
  mk(
    'pc-game-freezes',
    'PCゲームがフリーズ・応答なしになる時の対処法',
    'フリーズ・応答なし',
    '画面が固まる、音だけ続く、「応答なし」になる時の共通切り分けです。',
    '再現条件を記録し、MODとオーバーレイを外して、修復と負荷確認を行います。',
    [
      '発生場面と待機後の状態を記録する',
      'MOD・オーバーレイ・録画を外す',
      '整合性確認と温度・メモリを確認する',
    ],
    ['pc-game-crash', 'verify-steam-files', 'vram-shortage'],
    [repair, nv, amd],
  ),
  mk(
    'steam-game-not-launching',
    'Steamゲームが起動しない時の対処法｜まず試す3つ',
    'Steamゲームが起動しない',
    '「プレイ」を押しても戻る、無反応、起動直後に終了する時の共通切り分けです。',
    'PC再起動、整合性確認、MOD・オーバーレイ退避の順で試します。',
    [
      'PCとSteamを完全に再起動する',
      'ゲームファイルの整合性を確認する',
      'MOD・外部DLL・オーバーレイを外す',
    ],
    ['verify-steam-files', 'remove-mods-safely', 'reset-config-file'],
    [steam, repair],
  ),
  mk(
    'verify-steam-files',
    'Steamでゲームファイルの整合性を確認する方法',
    'Steam整合性確認',
    '破損・不足したゲームファイルをSteamに確認させる手順です。',
    'ライブラリのプロパティから「ゲームファイルの整合性を確認」を実行します。',
    [
      '対象ゲームのプロパティを開く',
      '整合性確認を実行する',
      '再起動して確認する',
    ],
    ['steam-game-not-launching', 'remove-mods-safely', 'reset-config-file'],
    [repair],
  ),
  mk(
    'pc-game-crash',
    'PCゲームがクラッシュ・強制終了する時の切り分け方',
    'クラッシュ・強制終了',
    'プレイ中にデスクトップへ戻る場合の共通手順です。',
    '発生条件を記録し、改変を外し、修復とGPUドライバー確認を行います。',
    [
      '発生条件とエラーを記録する',
      'MODとオーバーレイを外す',
      '整合性とドライバーを確認する',
    ],
    ['gpu-driver-update', 'shader-cache-delete', 'vram-shortage'],
    [repair, nv, amd],
  ),
  mk(
    'black-screen',
    'PCゲームが黒い画面で進まない時の対処法',
    '黒い画面',
    '音だけ出る、ロゴ後に黒画面、画面外表示になる時の対処です。',
    'Alt＋Enter、設定再生成、オーバーレイ停止を順に試します。',
    [
      'Alt＋Enterで表示方式を切り替える',
      '画面設定を再生成する',
      '外部表示とオーバーレイを外す',
    ],
    ['reset-config-file', 'gpu-driver-update', 'pc-game-crash'],
  ),
  mk(
    'gpu-driver-update',
    'GPUドライバーを安全に更新する方法【NVIDIA・AMD】',
    'GPUドライバー更新',
    '起動不良や描画乱れを直すための安全な更新手順です。',
    'GPUメーカーを確認し、公式サイトの対応ドライバーだけを使用します。',
    [
      'GPUのメーカーと型番を確認する',
      '公式ドライバーを入れる',
      'PCを再起動して比較する',
    ],
    ['pc-game-crash', 'shader-cache-delete', 'low-fps'],
    [nv, amd],
  ),
  mk(
    'stutter-fix',
    'PCゲームのカクつき・スタッターを減らす確認手順',
    'カクつき・スタッター',
    '平均FPSは高いのに一瞬止まる時の確認です。',
    'FPS固定、シェーダー構築、VRAM、ストレージを分けて確認します。',
    [
      'FPS上限を安定値へ固定する',
      'シェーダー構築を完了させる',
      'VRAMとSSDを確認する',
    ],
    ['low-fps', 'vram-shortage', 'shader-cache-delete'],
    [nv, amd],
  ),
  mk(
    'low-fps',
    'PCゲームのFPSが低い時に見直す設定順',
    'FPSが低い',
    '推奨スペックを満たしているのにFPSが低い、画質を上げると重くなる場合の手順です。まず解像度とレンダリング倍率を確認し、レイトレーシング、影、テクスチャの順で比較します。設定を開く場所とVRAMの確認方法を、3つのSTEPで説明します。',
    '解像度、レイトレーシング、影、テクスチャの順に比較します。',
    [
      '解像度とアップスケーラーを確認する',
      'レイトレーシングと影を下げる',
      'VRAM使用量を減らす',
    ],
    ['stutter-fix', 'vram-shortage', 'gpu-driver-update', 'low-gpu-usage'],
    [nv, amd],
  ),
  mk(
    'vram-shortage',
    'VRAM不足の症状とテクスチャ設定の下げ方',
    'VRAM不足',
    'VRAM不足の警告、テクスチャ欠け、急なFPS低下が出る場合は、まず専用GPUメモリの容量と使用量を確認します。この記事では高解像度テクスチャの外し方と画質を下げる順番を説明します。使用量の高さだけで原因を断定せず、変更前後を比較します。',
    '高解像度テクスチャを外し、品質と解像度を下げて再起動します。',
    [
      'VRAM容量と使用量を確認する',
      '高解像度テクスチャを外す',
      '設定を段階的に下げる',
    ],
    ['low-fps', 'stutter-fix', 'pc-game-crash'],
    [nv, amd],
  ),
  mk(
    'save-data-backup',
    'PCゲームのセーブデータを安全にバックアップする方法',
    'セーブデータのバックアップ',
    '更新、MOD、再インストール前にデータを守る共通手順です。',
    'ゲームを終了し、セーブフォルダを日付付きで別ドライブへコピーします。',
    [
      'ゲーム別の保存場所を確認する',
      'フォルダごとコピーする',
      'バックアップを検証する',
    ],
    ['uninstall-save-data', 'remove-mods-safely', 'reset-config-file'],
  ),
  mk(
    'steam-input-controller',
    'Steam Inputでコントローラーが反応しない時の設定',
    'Steam Input設定',
    'コントローラーが無反応、表示が違う時の確認です。',
    '有線1台で認識を確認し、Steam InputをON・OFFで比較します。',
    [
      'USB有線で1台だけ接続する',
      'Steam Inputを切り替える',
      '外部変換ツールを終了する',
    ],
    [
      'controller-double-input',
      'steam-game-not-launching',
      'reset-config-file',
    ],
  ),
  mk(
    'controller-double-input',
    'PCゲームでコントローラーが二重入力になる時の直し方',
    'コントローラー二重入力',
    '1回押して2回動く時の対処です。',
    'Steam InputとDS4Windowsなどの入力変換を1つだけにします。',
    ['入力機器を1台だけにする', '入力変換を1つにする', 'Steamを再起動する'],
    ['steam-input-controller', 'steam-game-not-launching', 'reset-config-file'],
  ),
  mk(
    'directx-error',
    'DirectXエラーでPCゲームが起動しない時の対処法',
    'DirectXエラー',
    'DirectX・DX12・デバイス削除エラーで起動できない場合は、まずエラー全文を控えてWindows Updateを確認します。dxdiagでの対応機能の確認、Steamのファイル修復、GPUメーカー別の更新手順を説明します。非公式の単体DLLは使用しません。',
    'Windows Update、ファイル修復、GPUドライバー更新を順に行います。',
    [
      'Windows Updateを完了する',
      'ゲームファイルを修復する',
      'GPUドライバーを更新する',
    ],
    ['gpu-driver-update', 'visual-c-runtime-error', 'pc-game-crash'],
    [repair, nv, amd],
  ),
  mk(
    'visual-c-runtime-error',
    'Visual C++ Runtimeエラーでゲームが起動しない時の対処',
    'Visual C++ Runtimeエラー',
    'MSVCP・VCRUNTIMEなどのDLL不足やRuntime Errorでゲームが起動しない場合は、まずエラーのファイル名を確認します。必要なVisual C++の版とx86・x64を選び、Microsoft公式インストーラーで修復する操作を説明します。',
    'Microsoft公式のVisual C++再頒布可能パッケージを確認します。',
    [
      'エラー名を記録する',
      'Microsoft公式パッケージを修復する',
      '再起動して整合性を確認する',
    ],
    ['directx-error', 'steam-game-not-launching', 'pc-game-crash'],
    [
      {
        label: 'Microsoft：Visual C++再頒布可能パッケージ',
        url: 'https://learn.microsoft.com/ja-jp/cpp/windows/latest-supported-vc-redist',
      },
      repair,
    ],
  ),
  mk(
    'remove-mods-safely',
    'PCゲームのMODを安全に外す方法｜起動しない時の戻し方',
    'MODを安全に外す',
    'MOD導入後や本体更新後にゲームが起動しない場合は、セーブを保全してMODなしの状態を試します。管理ツール・手動導入・Steamワークショップ別の外し方と、整合性確認の操作を説明します。MOD必須のセーブを上書きせずに切り分けてください。',
    'セーブを保全し、追加ファイルを全退避して、本体だけで起動します。',
    [
      'セーブと導入記録を残す',
      '全MODをゲーム外へ退避する',
      '本体を修復して起動する',
    ],
    ['save-data-backup', 'steam-game-not-launching', 'reshade-uninstall'],
    [repair],
  ),
  mk(
    'reshade-uninstall',
    'ReShadeを完全に外す方法｜ゲームが起動しない時の確認',
    'ReShadeを外す',
    'ReShade導入後のクラッシュを切り分けます。',
    'API DLL、ReShade.ini、reshade-shadersをゲーム外へ退避します。',
    [
      '導入先とAPI DLLを確認する',
      '関連ファイルをまとめて退避する',
      '整合性確認後に起動する',
    ],
    ['remove-mods-safely', 'steam-game-not-launching', 'reset-config-file'],
    [{ label: 'ReShade公式', url: 'https://reshade.me/' }, repair],
  ),
  mk(
    'reset-config-file',
    'PCゲームの設定ファイルを初期化・再生成する方法',
    '設定ファイル初期化',
    '黒画面や壊れた画質設定を安全に初期化する方法です。',
    '設定を削除せず日付付きで退避し、ゲーム起動で再生成させます。',
    [
      '設定ファイルの場所を確認する',
      '日付付きでバックアップする',
      '再生成して設定を戻す',
    ],
    ['black-screen', 'steam-game-not-launching', 'save-data-backup'],
  ),
  mk(
    'shader-cache-delete',
    'シェーダーキャッシュを削除・再構築する時の注意点',
    'シェーダーキャッシュ',
    '更新後の描画乱れやクラッシュで再構築を試す前の確認です。',
    '公式機能から削除し、再構築完了まで待ちます。',
    [
      'ゲームとランチャーを終了する',
      '公式機能からキャッシュを削除する',
      '再構築完了まで待つ',
    ],
    ['stutter-fix', 'gpu-driver-update', 'pc-game-crash'],
    [nv, amd],
  ),
  mk(
    'uninstall-save-data',
    'PCゲームをアンインストールするとセーブデータは消える？確認方法',
    'アンインストールとセーブ',
    '再インストール前にセーブとクラウド同期を確認します。',
    'ゲームごとに違うため、保存場所を確認して別ドライブへコピーします。',
    [
      'ローカル保存場所を確認する',
      'クラウド同期状態を確認する',
      '別ドライブへバックアップする',
    ],
    ['save-data-backup', 'reset-config-file', 'remove-mods-safely'],
  ),
  ...commonGrowthGuides,
];
export const commonGuideBySlug = (slug: string) =>
  commonGuides.find((g) => g.slug === slug);
