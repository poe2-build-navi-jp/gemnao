// Local save-location / backup guides only. GTA migration and online-only
// progress guides use different workflows and deliberately do not belong here.
export const saveGuideByGame: Record<string, { slug: string; label: string }> =
  {
    'monster-hunter-wilds': {
      slug: 'save-data',
      label: 'ワイルズのセーブ場所・バックアップ手順',
    },
    palworld: {
      slug: 'save-data',
      label: 'パルワールドのバックアップ・復元手順',
    },
    'elden-ring': {
      slug: 'save-data',
      label: 'エルデンリングのセーブ場所・バックアップ手順',
    },
    'stardew-valley': {
      slug: 'save-restore',
      label: 'スターデューバレーのセーブ場所・復元手順',
    },
  };
