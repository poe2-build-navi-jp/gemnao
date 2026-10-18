import { troubleHubs, type TroubleHub } from '@/lib/trouble-hubs';
const copy: Record<
  string,
  Pick<TroubleHub, 'label' | 'title' | 'description' | 'quickChecks'>
> = {
  'not-launching': {
    label: 'Not launching',
    title: 'PC Game Not Launching: Choose the Next Check',
    description:
      'Find general and game-specific checks for an unresponsive launch, immediate exit or launcher that does not proceed.',
    quickChecks: [
      'Save work, then restart the PC and launcher normally.',
      'Run the launcher’s file verification or repair once.',
      'Only if you added mods or overlays, temporarily disable or move them using their installation instructions. Do not delete DLL files based on their names alone.',
    ],
  },
  crash: {
    label: 'Crashes',
    title: 'PC Game Crashes, Forced Exits and Freezes',
    description:
      'Find the right checks for returning to the desktop at launch or during play, or a game that freezes and stops responding.',
    quickChecks: [
      'Record the scene, exact error and time.',
      'If you use mods, overlays or recording tools, disable or move one at a time and compare.',
      'Check installed files and the appropriate GPU driver.',
    ],
  },
  fps: {
    label: 'Low FPS and stutter',
    title: 'PC Game Low FPS, Stutter and Display Problems',
    description:
      'Find general and game-specific checks for low frame rates, brief pauses, VRAM limits and graphics-setting problems.',
    quickChecks: [
      'Record the resolution and upscaler setting.',
      'Compare the FPS cap, ray tracing and shadows one setting at a time.',
      'Check dedicated VRAM usage and whether shader preparation is still progressing.',
    ],
  },
  save: {
    label: 'Saves and backups',
    title: 'PC Game Save Locations and Backup Guides',
    description:
      'Find game-specific save locations, backup instructions and checks for progress that does not save.',
    quickChecks: [
      'If saves may be lost or corrupted, preserve remaining local files elsewhere before creating a new save or retrying synchronization.',
      'For a routine backup while the game works normally, exit the game, let the cloud service finish syncing, then close the launcher.',
      'Copy the complete folder to another drive without deleting the original.',
      'Before restoring a backup, preserve the current files separately too.',
    ],
  },
  mod: {
    label: 'Mods',
    title: 'Safely Diagnose PC Game Mod Problems',
    description:
      'Find safe reversal steps when a game fails to launch or crashes after adding mods or installing an update.',
    quickChecks: [
      'Close the game, copy the saves and record which mods you installed.',
      'Disable mods using the correct manager, manual-install or Workshop procedure. Move only files you can confirm you added yourself.',
      'First test the unmodified game only as far as the title screen. Do not load and overwrite an existing mod-dependent save. Verify base files only if corruption is suspected.',
    ],
  },
  controller: {
    label: 'Controllers',
    title: 'PC Game Controller and Double-Input Problems',
    description:
      'Find checks for an unresponsive controller, duplicate input, incorrect prompts or button mappings.',
    quickChecks: [
      'If the controller supports wired operation, compare a wired connection with only that controller attached.',
      'For Steam games, compare the target game’s Steam Input setting one change at a time. Restore it if input stops.',
      'Only if you use a tool such as DS4Windows, close the game and compare with that tool stopped and running.',
    ],
  },
  server: {
    label: 'Servers and connections',
    title: 'PC Game Server, Login and Connection Checks',
    description:
      'Find game-specific help for connection failures, login queues and dedicated-server configuration.',
    quickChecks: [
      'Check official outage and maintenance announcements first.',
      'If no official instruction says to remain queued, close the game and launcher and sign in again through the normal official flow.',
      'Before changing VPN or network routing, compare another permitted connection if available, accounting for mobile-data charges.',
    ],
  },
};
export const troubleHubsEn: TroubleHub[] = troubleHubs.map((h) => ({
  ...h,
  ...copy[h.slug],
  updated: '2026-10-18',
}));
export const troubleHubEnBySlug = (slug: string) =>
  troubleHubsEn.find((h) => h.slug === slug);
