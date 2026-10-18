import { commonGuidesEn } from './common-guides-en';
import { crashGuideEn } from './crash-guide-en';
export const guideIndexEn = {
  title: 'PC Game Troubleshooting Guides',
  description:
    'Choose an English guide for Steam launch failures, file verification, crashes, black screens, GPU drivers, low FPS, stutter, save backups or Steam Cloud conflicts. Compare one change safely and find your next check.',
  checkedAt: '2026-10-18',
};
const guides = [crashGuideEn, ...commonGuidesEn];
export const guideGroupsEn = [
  { id: 'saves-cloud', title: 'Save backups and Cloud conflicts', description: 'Preserve progress before repairs or synchronization choices. Keep independent copies and stop if the intended version is unclear.', paths: ['/guide/save-data-backup', '/guide/steam-cloud-sync-error'] },
  {
    id: 'launch-files',
    title: 'Launch and game files',
    description:
      'Nothing happens after Play, files are missing, or verification leaves the same error.',
    paths: ['/guide/steam-game-not-launching', '/guide/verify-steam-files'],
  },
  {
    id: 'crash-display',
    title: 'Crashes and missing pictures',
    description:
      'The game closes, stays black, or has sound without a picture. First separate a game problem from a Windows-wide failure.',
    paths: ['/guide/pc-game-crash', '/guide/black-screen'],
  },
  {
    id: 'performance',
    title: 'Drivers and performance',
    description:
      'Check a driver change, consistently low FPS or occasional hitches. These symptoms need different comparisons.',
    paths: ['/guide/gpu-driver-update', '/guide/low-fps', '/guide/stutter-fix'],
  },
].map((group) => ({
  ...group,
  guides: group.paths.map((path) =>
    guides.find((guide) => guide.path === path)!,
  ),
}));
