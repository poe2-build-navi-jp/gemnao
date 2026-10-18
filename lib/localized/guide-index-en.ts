import { commonGuidesEn } from './common-guides-en';
import { crashGuideEn } from './crash-guide-en';
export const guideIndexEn = {
  title: 'PC Game Troubleshooting Guides',
  description:
    'Choose an English guide for Steam launch failures, DirectX and Visual C++ errors, file verification, crashes, black screens, GPU drivers, low FPS, stutter, save backups, Steam Cloud conflicts, missing audio or controller input. Compare one change safely and find your next check.',
  checkedAt: '2026-10-18',
};
const guides = [crashGuideEn, ...commonGuidesEn];
export const guideGroupsEn = [
  { id: 'requirements', title: 'Windows and hardware requirements', description: 'Check the exact game’s OS, TPM, Secure Boot and hardware ray-tracing requirements before changing firmware or replacing hardware.', paths: ['/guide/tpm-secure-boot', '/guide/windows-11-required', '/guide/ray-tracing-gpu'] },
  { id: 'audio-controller', title: 'Sound and controller input', description: 'Separate app volume from Windows output, controller recognition from game support, and a short press from duplicate input.', paths: ['/guide/no-game-audio', '/guide/steam-input-controller', '/guide/controller-double-input'] },
  { id: 'saves-cloud', title: 'Save backups and Cloud conflicts', description: 'Preserve progress before repairs or synchronization choices. Keep independent copies and stop if the intended version is unclear.', paths: ['/guide/save-data-backup', '/guide/steam-cloud-sync-error', '/guide/uninstall-save-data'] },
  {
    id: 'launch-files',
    title: 'Launch and game files',
    description:
      'Nothing happens after Play, files are missing, or verification leaves the same error.',
    paths: ['/guide/steam-game-not-launching', '/guide/verify-steam-files', '/guide/directx-error', '/guide/visual-c-runtime-error', '/guide/remove-mods-safely', '/guide/steam-disk-write-error', '/guide/reshade-uninstall', '/guide/reset-config-file'],
  },
  {
    id: 'crash-display',
    title: 'Crashes and missing pictures',
    description:
      'The game closes, stays black, or has sound without a picture. First separate a game problem from a Windows-wide failure.',
    paths: ['/guide/pc-game-crash', '/guide/pc-game-freezes', '/guide/black-screen', '/guide/pc-shuts-down-while-gaming', '/guide/bsod-while-gaming'],
  },
  {
    id: 'performance',
    title: 'Drivers and performance',
    description:
      'Check a driver change, consistently low FPS or occasional hitches. These symptoms need different comparisons.',
    paths: ['/guide/gpu-driver-update', '/guide/low-fps', '/guide/stutter-fix', '/guide/vram-shortage', '/guide/low-gpu-usage', '/guide/shader-cache-delete'],
  },
].map((group) => ({
  ...group,
  guides: group.paths.map((path) =>
    guides.find((guide) => guide.path === path)!,
  ),
}));
