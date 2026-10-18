import { freezeGuideEn } from './freeze-guide-en';
import { gpuMemoryGuidesEn } from './gpu-memory-guides-en';
import { runtimeGuidesEn } from './runtime-guides-en';
import { audioControllerGuidesEn } from './audio-controller-guides-en';
import { saveGuidesEn } from './save-guides-en';
import { moreCommonGuidesEn } from './common-guides-more-en';
import type { EnglishGuideInfo } from '@/components/english-guide-shell';

export type EnglishCommonGuide = EnglishGuideInfo & {
  slug: string;
  topic: 'launch' | 'display' | 'save' | 'controller';
  branches: { symptom: string; action: string; step: string }[];
  steps: { id: string; title: string; actions: string[]; next: string }[];
  extraSections?: { id: string; title: string; actions: string[] }[];
  cautions: string[];
};
const steam = (id: string) =>
  `https://help.steampowered.com/en/faqs/view/${id}`;
const windowsTools =
  'https://support.microsoft.com/en-us/windows/experience/system-configuration-tools-in-windows';

export const commonGuidesEn: EnglishCommonGuide[] = [
  freezeGuideEn,
  ...gpuMemoryGuidesEn,
  ...runtimeGuidesEn,
  ...audioControllerGuidesEn,
  ...moreCommonGuidesEn,
  ...saveGuidesEn,
  {
    slug: 'steam-game-not-launching',
    path: '/guide/steam-game-not-launching',
    topic: 'launch',
    title:
      'Steam Game Not Launching: No Response, Launch Errors or Back to Play',
    shortTitle: 'Steam game not launching',
    description:
      'Separate a Steam launch error, no response and a game that immediately closes. Check files and Windows records safely, preserve saves, and choose the next step from the result.',
    lead: 'For Steam games on Windows. Start with what happens after pressing Play once. A login failure in another launcher, a black window that stays open and a game that closes need different checks.',
    summary:
      'Record the complete error and whether Play changes to Stop, then returns to Play. If several games fail, start with Steam and the PC. If only one fails, check its files and requirements. If it closes immediately, match the time with Windows records. Compare one change at a time; keep saves and security protection intact.',
    category: 'Common PC game troubleshooting',
    checkedAt: '2026-10-18',
    sourcePolicy:
      'An English edition of our Japanese Steam launch guide. The linked Steam and Microsoft documentation supports the procedures; symptom grouping and comparison order are editorial guidance, not a diagnosis or a guaranteed fix.',
    branches: [
      {
        symptom: 'Play does nothing, including in other games',
        action: 'Check downloads/sync, then restart normally.',
        step: 'step-2',
      },
      {
        symptom: 'Missing executable or a detailed launch error',
        action:
          'Record the full message; compare verification and protection history.',
        step: 'step-2',
      },
      {
        symptom: 'Running briefly, then back to Play',
        action: 'Match the closing time with application records.',
        step: 'step-3',
      },
      {
        symptom: 'A third-party launcher asks for login',
        action:
          'Check the game’s store requirements and that launcher’s official help; do not unlink accounts as a guess.',
        step: 'step-1',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Identify the launch state before changing anything',
        actions: [
          'If this game has never worked on the PC, compare its Steam store OS and minimum requirements with your hardware. A reinstall cannot make an unsupported configuration meet those requirements.',
          'Press Play once. Note the time, full error, launcher name and whether a window appears or closes. Use Ctrl+Shift+Esc to inspect Task Manager if Steam says it is already running; first look for a hidden game or launcher window.',
          'Try another installed Steam game if available. Record whether one game or several are affected. Do not interrupt a save, download or cloud sync to repeat the test.',
        ],
        next: 'No response or a launch error: continue to STEP 2. A game that closes immediately: go to STEP 3. If a window remains black, record that distinction for the game’s support team.',
      },
      {
        id: 'step-2',
        title: 'Restart normally, then check only what matches the error',
        actions: [
          'When Steam itself or several games are unresponsive, let downloads and cloud sync finish, exit Steam normally and restart Windows. Try one launch again. Follow Steam’s official Windows/driver update guidance if it still fails; use the hardware vendor or PC manufacturer, not third-party driver tools.',
          'For a missing executable or a game-specific failure, close the game. In Steam Library, open its Properties → Installed Files → Verify integrity of game files. Wait for verification and any downloads to finish. Do not verify several games at once.',
          'If files disappear again or a security notice appears, open Windows Security → Protection history and match the file path and time. Keep uncertain files blocked and ask the publisher/security vendor to verify them. Do not disable protection, add broad exclusions or download replacement DLLs.',
          'Compare a non-security recording/overlay app by closing one normally, then retrying. For mods, use the original manager or installation record; do not delete files merely because of a DLL name. Preserve saves and never overwrite a mod-dependent save during a vanilla test.',
        ],
        next: 'If it launches, record which single change preceded improvement and repeat under the same conditions. If it still closes or returns to Play, continue to STEP 3. Repeated missing files need investigation rather than endless verification.',
      },
      {
        id: 'step-3',
        title: 'Read the matching Windows record when the game closes',
        actions: [
          'Search Start for Event Viewer, open Windows Logs → Application and compare records around the closing time. Record the application name and error details; a nearby event for another program is not evidence about this game.',
          'A named faulting module is a clue, not proof that a Windows DLL or hardware component is broken. Do not replace system files based on the name. If no record matches, keep the observed behavior and timestamp; no event does not rule out a game problem.',
        ],
        next: 'Use the linked English crash guide for launch/loading/long-session branches. If the cause remains unclear, prepare the record in STEP 4 instead of trying unrelated changes.',
      },
      {
        id: 'step-4',
        title: 'Retest the result or prepare a support request',
        actions: [
          'Repeat the same launch, save and loading point after each change. Record “launched this time”, “same failure” or the new error. One successful run does not establish a permanent fix.',
          'If there was no improvement, restore reversible settings before the next comparison. Back up saves outside the game folder before any later reinstall or file operation; Steam Cloud is not a substitute for a separate copy.',
          'For one failing game, contact its official support with the edition, Windows/GPU versions, full error, timestamp, other-game comparison and steps already tried. For multiple failing games or Steam-client errors, use Steam Support. Remove account details and personal file paths from anything shared publicly.',
        ],
        next: 'Use the official sources below or the related crash guide. Keep your troubleshooting record; do not repeatedly submit an unchanged diagnosis as a new result.',
      },
    ],
    cautions: [
      'Do not delete saves, Steam userdata, entire mod folders or Windows DLLs as a general launch fix.',
      'Do not disable antivirus, firewall or anti-cheat, unlink accounts, edit the registry or change BIOS settings without a relevant official procedure.',
      'Download-cache clearing is for download problems, not every launch failure; it requires signing in again. Check Steam’s instructions before considering it.',
    ],
    faqs: [
      {
        question:
          'Does verification proving that files were replaced prove the cause?',
        answer:
          'No. Compare the next launch separately. Steam notes that some local configuration files may fail verification; that message alone is not proof of damage. If the same files disappear again, compare protection history and ask support.',
      },
      {
        question:
          'The game asks for another launcher even though I bought it on Steam. Is that an error?',
        answer:
          'Some games require another account or launcher. Check the game’s Steam store requirements and the named publisher’s help. Keep the full error and do not unlink accounts just to test a theory.',
      },
      {
        question: 'Should I reinstall before checking the error?',
        answer:
          'First record the behavior and run the relevant checks. A reinstall can take time and may leave added files behind. Preserve local and mod-dependent saves before any reinstall.',
      },
    ],
    sources: [
      {
        label: 'Steam: games do not run after Preparing to Launch',
        url: steam('5814-D9A3-BE42-62DF'),
      },
      {
        label: 'Steam: verify integrity of game files',
        url: steam('0C48-FCBD-DA71-93EB'),
      },
      {
        label: 'Steam: clear download cache',
        url: steam('6AD7-820D-8BE5-E51F'),
      },
      { label: 'Microsoft: Task Manager and Event Viewer', url: windowsTools },
      {
        label:
          'Microsoft: Protection history and handling uncertain detections',
        url: 'https://support.microsoft.com/en-us/windows/security/windows-security/protection-history-in-the-windows-security-app',
      },
    ],
    related: [
      { href: '/en/guide/save-data-backup', label: 'Preserve saves before changes or restoration' },
      { href: '/en/guide/steam-cloud-sync-error', label: 'Cloud warnings: protect candidates before selecting' },
      { href: '/en/guide', label: 'Browse all PC troubleshooting guides' },
      { href: '/en/guide/verify-steam-files', label: 'Verify Steam files and read the result' },
      { href: '/en/guide/low-fps', label: 'Consistently low FPS: compare caps and rendering load' },
      {
        href: '/en/guide/pc-game-crash',
        label: 'Game closes to desktop: choose a crash check',
      },
      {
        href: '/en/games/monster-hunter-wilds/not-launching',
        label: 'Monster Hunter Wilds: game-specific launch and crash checks',
      },
      {
        href: '/en/games/cyberpunk-2077/not-launching',
        label: 'Cyberpunk 2077: launch checks',
      },
      {
        href: '/en/gear/save-backup-storage-guide',
        label: 'Preserve game saves before changing files',
      },
    ],
  },
  {
    slug: 'stutter-fix',
    path: '/guide/stutter-fix',
    topic: 'display',
    title:
      'PC Game Stuttering with High FPS: Frame Caps, Shaders and Loading Checks',
    shortTitle: 'Stuttering and brief freezes',
    description:
      'Compare frame pacing, first-run shader work, texture/loading pressure and online lag. Use one reversible change at a time and record the same scene before and after.',
    lead: 'For games that keep running but hitch or briefly pause. A high average FPS does not describe every frame. Separate whole-scene stutter from online rubber-banding and from a game closing to desktop.',
    summary:
      'Choose a repeatable route and record the hitch before changing settings. Try a sustainable frame cap in one place, then compare first-run and repeat visits. If the hitch remains, test texture/loading pressure separately. Restore settings that do not help. Avoid clearing caches on every run: it changes the comparison.',
    category: 'Common PC game troubleshooting',
    checkedAt: '2026-10-18',
    sourcePolicy:
      'An English edition of our Japanese stutter guide. Steam, Microsoft, NVIDIA and AMD documentation supports the available tools and controls. The comparison order is editorial guidance; no benchmark or universal FPS target is claimed.',
    branches: [
      {
        symptom: 'The whole view briefly hitches, even with high average FPS',
        action: 'Compare a single frame cap and the same route.',
        step: 'step-1',
      },
      {
        symptom: 'Only the first visit after an update hitches',
        action:
          'Separate shader preparation and first-run results from repeat visits.',
        step: 'step-2',
      },
      {
        symptom: 'Hitches during movement or after a long session',
        action: 'Compare texture/loading pressure and session duration.',
        step: 'step-3',
      },
      {
        symptom: 'Other players teleport but the camera stays smooth',
        action:
          'Record online-only behavior and check the game’s server/network guidance. A frame cap is not a network repair.',
        step: 'step-1',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Record the hitch and use one frame limiter',
        actions: [
          'Choose the same save, practice area or route. Note settings, duration and where the hitch happens. If available, use the game’s display or Steam’s performance monitor to observe FPS and resource usage; use the same monitoring setup for both runs.',
          'Start with the game’s own FPS limit. Choose a value the PC can sustain in the heavier part of your route, not its highest momentary FPS. For example, comparing 60 fps on a machine that usually stays above it is a test, not a recommended target for every PC. Compare both smoothness and input feel.',
          'If the game has no limiter and NVIDIA Control Panel offers it, use Manage 3D settings → Program Settings for the correct game and Max Frame Rate. Record the old setting and apply the change. Do not stack a game cap with another limiter.',
          'On supported AMD setups, Frame Rate Target Control is available under Global Graphics → Advanced and targets full-screen applications. Availability varies; a global change affects other games too. Prefer an in-game control when available and restore the prior driver setting after testing.',
          'If display motion itself looks wrong, check the selected monitor and supported refresh rate in Windows Settings → System → Display → Advanced display. Refresh rate and rendered FPS are different. Do not change refresh rate, V-Sync and the limiter together.',
        ],
        next: 'If the hitch improves, keep the comparison record and retest. If it persists, restore an unhelpful cap and continue to STEP 2. If only online positions jump while local motion stays smooth, follow the game’s official network/status guidance.',
      },
      {
        id: 'step-2',
        title: 'Separate shader preparation from repeatable stutter',
        actions: [
          'If the game explicitly displays shader compilation or optimization, let its prescribed preparation finish. Record whether this followed a game or driver update. A loading process still advancing is different from an error or a crash.',
          'Compare the first visit with a second visit to the same place. If only the first hitches, record that difference without claiming shader work is proven as the cause. If every visit hitches, keep the repeatable location for STEP 3.',
          'Do not repeatedly clear shader caches as a benchmark routine. Cached shaders avoid repeating some compilation work. Only use a game/vendor-specific reset procedure when it matches the symptom, and keep save folders separate from any cache operation.',
        ],
        next: 'If repeat visits are smooth, check again during normal play. If stutter remains or appears after longer sessions, continue to STEP 3. For an actual exit to desktop, use the English crash guide instead.',
      },
      {
        id: 'step-3',
        title: 'Compare texture pressure, loading and session length',
        actions: [
          'Lower texture quality by one level, restart if the game requests it and repeat the same route. Record whether hitches change; improvement alone does not prove that VRAM capacity was the sole cause.',
          'For hitches while moving, compare the game’s storage requirements with the actual installation drive. If a download, recording or other nonessential app is active, pause or close one safely and retest. Do not interrupt cloud sync or security protection.',
          'If the problem starts only after a long session, use a similar duration for the comparison. Task Manager can help record CPU, memory and disk activity. A short smooth run does not establish that a long-session problem is fixed.',
          'Restore changes that do not help. If one game remains affected, send its official support a short record of the route, settings, session length and before/after results. If the whole PC freezes, restarts or fails in other apps, stop treating it as a frame-cap problem and seek device support. Back up important saves before any later repair or reinstall.',
        ],
        next: 'Use the sources and related guides below. Describe the observed result, including “unchanged”; do not keep lowering settings or deleting caches without a useful comparison.',
      },
    ],
    cautions: [
      'Do not delete saves or bulk-clear game/Windows folders to fix a hitch.',
      'Avoid registry tweaks, voltage changes, security exclusions and unsupported driver-cleaning tools as general stutter fixes.',
      'Do not compare different quests, graphics presets or session lengths and attribute the change to one setting.',
    ],
    faqs: [
      {
        question: 'Can a game stutter even when the average FPS is high?',
        answer:
          'Yes. Averages can hide an occasional slow frame. Compare the same place and hitch pattern, not just the FPS number. Smooth local motion with online position jumps needs a different investigation.',
      },
      {
        question: 'Does a 144 Hz monitor mean I should always cap at 144 fps?',
        answer:
          'No. The display rate does not mean the PC sustains that rendering rate. Test a sustainable cap and compare responsiveness. Check VRR and V-Sync separately using the game and display documentation.',
      },
      {
        question: 'Should I clear the shader cache after every test?',
        answer:
          'No. Rebuilding cached work changes the conditions and can add first-run work. Record first and repeat visits separately; reset only with a relevant official procedure.',
      },
    ],
    sources: [
      {
        label: 'NVIDIA: per-game settings and Max Frame Rate',
        url: 'https://www.nvidia.com/content/Control-Panel-Help/vLatest/en-us/mergedProjects/nv3d/Manage_3D_Settings_(reference).htm',
      },
      {
        label: 'AMD: graphics profiles, FRTC and shader cache',
        url: 'https://www.amd.com/en/resources/support-articles/faqs/dh3-012.html',
      },
      {
        label: 'Steam: in-game performance monitor',
        url: steam('3462-CD4C-36BD-5767'),
      },
      {
        label: 'Microsoft: display refresh rate',
        url: 'https://support.microsoft.com/en-us/windows/hardware/display-graphics/change-the-refresh-rate-on-your-monitor-in-windows',
      },
      { label: 'Microsoft: Task Manager and system tools', url: windowsTools },
    ],
    related: [
      { href: '/en/guide', label: 'Browse all PC troubleshooting guides' },
      { href: '/en/guide/verify-steam-files', label: 'Verify Steam files and read the result' },
      { href: '/en/guide/low-fps', label: 'Consistently low FPS: compare caps and rendering load' },
      {
        href: '/en/guide/pc-game-crash',
        label: 'Game closes instead of stuttering: crash checks',
      },
      {
        href: '/en/guide/steam-game-not-launching',
        label: 'Steam game does not start',
      },
      {
        href: '/en/games/monster-hunter-wilds/not-launching#compare-load',
        label: 'Monster Hunter Wilds: compare the same hunt and duration',
      },
    ],
  },
];
