import { blackScreenGuide } from './black-screen-guide';
import { crashGuide } from './crash-guide';
import { directxGuide } from './directx-guide';
import { steamLaunchGuide } from './steam-launch-guide';
import { gpuDriverGuide } from './gpu-driver-guide';
import { freezeGuide } from './freeze-guide';
import { stutterGuide } from './stutter-guide';
import { vramGuide } from './vram-guide';
import { lowFpsGuide } from './low-fps-guide';
import { lowGpuUsageGuide } from './low-gpu-usage-guide';
import { steamInputGuide } from './steam-input-guide';
import { controllerDoubleInputGuide } from './controller-double-input-guide';
import { uninstallSaveGuide } from './uninstall-save-guide';
import { saveBackupGuide } from './save-backup-guide';
import { shaderCacheGuide } from './shader-cache-guide';
import { reshadeGuide } from './reshade-guide';
import { resetConfigGuide } from './reset-config-guide';
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
  faqs?: { question: string; answer: string }[];
};
const causeMap: Record<string, string[]> = {
  'pc-game-freezes': [
    'MOD・オーバーレイの競合',
    'メモリ・VRAM不足',
    '温度上昇や破損ファイル',
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
  'save-data-backup': [
    'ローカル保存とクラウド保存の混同',
    '同期競合',
    'コピー漏れ',
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
const reviewedActions: Record<string, string[][]> = {
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
  lowGpuUsageGuide,
  freezeGuide,
  steamLaunchGuide,
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
  crashGuide,
  blackScreenGuide,
  gpuDriverGuide,
  stutterGuide,
  lowFpsGuide,
  vramGuide,
  saveBackupGuide,
  steamInputGuide,
  controllerDoubleInputGuide,
  directxGuide,
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
  reshadeGuide,
  resetConfigGuide,
  shaderCacheGuide,
  uninstallSaveGuide,
  ...commonGrowthGuides,
];
export const commonGuideBySlug = (slug: string) =>
  commonGuides.find((g) => g.slug === slug);
