import type { CommonGuide } from '@/lib/common-guides';

export type CommonGuideCategory = {
  id: string;
  label: string;
  heading: string;
  description: string;
  slugs: string[];
};

export const commonGuideCategories: CommonGuideCategory[] = [
  {
    id: 'launch-crash',
    label: '起動・クラッシュ',
    heading: 'PCゲームの起動・クラッシュ対策',
    description: '起動しない、黒画面、強制終了、PC再起動などを切り分けます。',
    slugs: [
      'steam-game-not-launching',
      'pc-game-freezes',
      'pc-game-crash',
      'black-screen',
      'directx-error',
      'visual-c-runtime-error',
      'pc-shuts-down-while-gaming',
      'bsod-while-gaming',
    ],
  },
  {
    id: 'fps-display',
    label: 'FPS・描画',
    heading: 'FPS・カクつき・描画トラブル',
    description: 'FPS低下、スタッター、VRAM、GPUやシェーダーを確認します。',
    slugs: [
      'low-gpu-usage',
      'gpu-driver-update',
      'stutter-fix',
      'low-fps',
      'vram-shortage',
      'shader-cache-delete',
    ],
  },
  {
    id: 'steam-save',
    label: 'Steam・セーブ',
    heading: 'Steam・セーブデータのトラブル',
    description:
      '整合性確認、Cloud同期、書き込みエラー、バックアップを確認します。',
    slugs: [
      'verify-steam-files',
      'steam-cloud-sync-error',
      'steam-disk-write-error',
      'save-data-backup',
      'uninstall-save-data',
    ],
  },
  {
    id: 'mods-settings',
    label: 'MOD・設定',
    heading: 'MOD・設定ファイルの戻し方',
    description: 'MOD、ReShade、設定ファイルを安全に退避・再生成します。',
    slugs: ['remove-mods-safely', 'reshade-uninstall', 'reset-config-file'],
  },
  {
    id: 'devices-audio',
    label: 'デバイス・音',
    heading: 'コントローラー・ゲーム音のトラブル',
    description: 'Steam Input、二重入力、ゲーム音が出ない問題を確認します。',
    slugs: [
      'steam-input-controller',
      'controller-double-input',
      'no-game-audio',
    ],
  },
];

export function commonGuideCategoryFor(guide: CommonGuide) {
  return commonGuideCategories.find((category) =>
    category.slugs.includes(guide.slug),
  );
}

export function groupedCommonGuides(guides: CommonGuide[]) {
  return commonGuideCategories.map((category) => ({
    ...category,
    guides: category.slugs
      .map((slug) => guides.find((guide) => guide.slug === slug))
      .filter((guide): guide is CommonGuide => Boolean(guide)),
  }));
}
