import type { GameGuide } from './games';

export function englishTitle(game: GameGuide) {
  return (
    (
      {
        'monster-hunter-wilds': 'Monster Hunter Wilds',
        palworld: 'Palworld',
      } as Record<string, string>
    )[game.slug] ?? game.title
  );
}

export const diagnosticFocus: Record<string, string> = {
  'monster-hunter-wilds':
    'Separate a startup crash from stutter during play. Record your resolution, texture setting and whether the issue occurs in the same scene before comparing changes.',
  palworld:
    'For multiplayer problems, record both the client and server versions and test a local world separately. A local success does not prove that the server is healthy.',
  'elden-ring':
    'Record whether the failure occurs before the title screen or after loading a character. Keep modded testing offline and never bypass anti-cheat to join online play.',
  'cyberpunk-2077':
    'Record the game version and every installed mod framework. Test a clean profile before changing graphics settings; do not overwrite a mod-dependent save during testing.',
  'baldurs-gate-3':
    'For a multiplayer failure, compare every player’s game version and mod list. For a rendering crash, record which renderer was selected so that comparisons use the same save and scene.',
  'helldivers-2':
    'Distinguish a crash before launch from a connection failure after launch. Record the exact GameGuard or connection message; do not delete anti-cheat files or disable security software as a first step.',
  'hogwarts-legacy':
    'Separate shader preparation from repeated stutter in an already visited area. Compare the same route with the same graphics settings and no user-added configuration tweaks.',
  'gta-v-enhanced':
    'Confirm that your launcher, save and mod instructions refer to Enhanced, not Legacy. Keep an untouched save backup and never test story-mode mods in GTA Online.',
  'skyrim-special-edition':
    'Record the exact executable version, mod profile and script-extender version. Preserve the load order before testing a clean profile; do not save over a modded character.',
  'stardew-valley':
    'If you use SMAPI, keep the error log and note the first missing dependency. Test an unmodified launch separately, but do not save a mod-dependent farm during that test.',
};
