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
  sources,
  checkedAt: reviewedActions[slug] ? '2026-09-23' : '2026-09-12',
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
    'FPSが低いのにGPU使用率が上がらない、内蔵GPUで動いている疑いがある時の共通切り分けです。',
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
    '推奨スペックでも重い場合の優先順位です。',
    '解像度、レイトレーシング、影、テクスチャの順に比較します。',
    [
      '解像度とアップスケーラーを確認する',
      'レイトレーシングと影を下げる',
      'VRAM使用量を減らす',
    ],
    ['stutter-fix', 'vram-shortage', 'gpu-driver-update'],
    [nv, amd],
  ),
  mk(
    'vram-shortage',
    'VRAM不足の症状とテクスチャ設定の下げ方',
    'VRAM不足',
    'テクスチャ欠け、急なFPS低下、長時間後のクラッシュを切り分けます。',
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
    'DirectX、DX12、デバイス削除エラーの確認です。',
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
    'MSVCP、VCRUNTIME、Runtime Errorが出る時の修復方法です。',
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
    'MOD導入後や本体更新後に起動しない時の切り分けです。',
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
