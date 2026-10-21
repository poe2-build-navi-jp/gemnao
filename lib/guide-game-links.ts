import { gameArticles, type GameArticle } from './game-articles';
import { gameBySlug } from './games';

// Reviewed symptom matches for the Japanese guide template. Never pad with category matches.
export const guideGamePaths: Readonly<Record<string, readonly string[]>> = {
  'tpm-secure-boot': [
    'valorant/van9003',
    'valorant/van9001',
    'battlefield-6/secure-boot-enabled-not-launching',
  ],
  'windows-11-required': ['valorant/van9003', 'valorant/van9001'],
  'steam-game-not-launching': [
    'pubg/anti-cheat-conflict-warning',
    'apex-legends/r5apex-exe-launch-error',
    'battlefield-6/javelin-error-94',
  ],
  'gpu-driver-update': ['overwatch-2/rendering-device-lost'],
  'pc-game-crash': [
    'overwatch-2/rendering-device-lost',
    'apex-legends/r5apex-exe-launch-error',
    'apex-legends/apex-crash-txt',
    'valorant/not-launching-no-van',
  ],
  'black-screen': [
    'overwatch-2/rendering-device-lost',
    'fortnite/dx12-black-screen',
  ],
  'directx-error': ['fortnite/dx12-black-screen'],

  'stutter-fix': [
    'monster-hunter-wilds/fps',
    'elden-ring/fps',
    'the-blood-of-dawnwalker/stutter-windowed',
    'ace-combat-8/stutter-audio-cutting-out',
  ],
  'shader-cache-delete': [
    'onimusha-way-of-the-sword/shader-cache',
    'the-blood-of-dawnwalker/shader-compilation-crash',
  ],
  'vram-shortage': ['aniimo/video-memory-error'],
  // These guides explicitly cover conflicting/restored local and cloud saves.
  'steam-cloud-sync-error': [
    'stardew-valley/save-restore',
    'palworld/save-data',
  ],
  'low-fps': [
    'monster-hunter-wilds/fps',
    'elden-ring/fps',
    'onimusha-way-of-the-sword/low-fps',
  ],
  'save-data-backup': [
    'palworld/save-data',
    'elden-ring/save-data',
    'monster-hunter-wilds/save-data',
  ],
  'uninstall-save-data': ['palworld/save-data', 'elden-ring/save-data'],
  'steam-input-controller': [
    'rocket-league/dualsense-not-working',
    'monster-hunter-wilds/controller',
  ],
  'controller-double-input': ['monster-hunter-wilds/controller'],
  'remove-mods-safely': ['monster-hunter-wilds/mod', 'elden-ring/mod'],
  'reset-config-file': ['monster-hunter-wilds/config-file'],
  // No reviewed game-specific match: omit the section instead of filling slots.
  'low-gpu-usage': [],
  'pc-game-freezes': [],
  'verify-steam-files': [],
  'visual-c-runtime-error': [],
  'reshade-uninstall': [],
  'steam-disk-write-error': [],
  'pc-shuts-down-while-gaming': [],
  'bsod-while-gaming': [],
  'no-game-audio': [],
  'ray-tracing-gpu': [],
};

export function gameArticlesForGuide(
  slug: string,
  articles: readonly GameArticle[] = gameArticles,
): GameArticle[] {
  return (guideGamePaths[slug] ?? []).flatMap((path) => {
    const article = articles.find(
      (item) => `${item.gameSlug}/${item.slug}` === path,
    );
    return article &&
      gameBySlug(article.gameSlug) &&
      article.status !== 'draft' &&
      article.status !== 'thin'
      ? [article]
      : [];
  });
}
