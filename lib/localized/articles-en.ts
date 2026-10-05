import type { LocalizedArticle } from '@/lib/localized/types';

// English versions of the seven classic-game articles, based on publisher
// support with editorial safety adaptations. See sources and the scoped audit
// in docs/evidence-audit-2026-10-05; checkedAt is not a full re-audit date.

const verify = (name: string) =>
  `In your Steam Library, right-click “${name}” → Properties → Installed Files → Verify integrity of game files.`;

const base = { locale: 'en' as const, checkedAt: '2026-10-01' };

export const articlesEn: LocalizedArticle[] = [
  {
    ...base,
    gameSlug: 'cyberpunk-2077',
    slug: 'not-launching',
    title:
      'Cyberpunk 2077 Not Launching or Crashing on PC: Official Fixes in Order',
    shortTitle: 'Not launching or crashing',
    description:
      'Cyberpunk 2077 won’t start or keeps crashing on PC? Test without mods, then follow CD PROJEKT RED’s order: clean GPU driver install, Visual C++ redistributables, file verification, overlays and overclocking.',
    lead: 'For the Steam, GOG and Epic versions on Windows: nothing happens after you press Play, the game closes after REDlauncher, or it drops to the desktop while playing.',
    summary:
      'CD PROJEKT RED’s support page lists the checks in this order: system requirements and Windows version, a clean GPU driver install, reinstalling the Visual C++ redistributables, verifying game files, and turning off overlays and background apps. If you use mods, first check whether the game starts without them.',
    quickFacts: [
      {
        label: 'Check your Windows version',
        value:
          'Windows + R → “winver” (Windows 10 must be version 1909 or later)',
      },
      {
        label: 'Save location',
        value: String.raw`%USERPROFILE%\Saved Games\CD Projekt Red\Cyberpunk 2077`,
        copy: true,
      },
      {
        label: 'Crashes started after a driver update',
        value: 'Install the previous driver version (official advice)',
      },
      { label: 'Using mods', value: 'Test without mods before anything else' },
    ],
    diagnosis: [
      {
        symptom: 'Stopped launching after installing mods or a big patch',
        cause: 'A mod does not support the current game version',
        stepId: 'mods-off',
      },
      {
        symptom: 'Crashes started right after a GPU driver update',
        cause: 'Driver problem',
        stepId: 'gpu-driver',
      },
      {
        symptom: 'An error such as “MSVCP140.dll was not found”',
        cause: 'Missing or damaged Visual C++ redistributables',
        stepId: 'vcredist',
      },
      {
        symptom: 'Random crashes while playing',
        cause: 'Damaged files, overlays or overclocking',
        stepId: 'verify-files',
      },
    ],
    steps: [
      {
        id: 'mods-off',
        title: 'Remove mods and check the requirements and Windows version',
        summary: 'Rule out mods first.',
        time: 'About 5 min',
        actions: [
          'If you use a mod manager, disable every mod. If you installed mods by hand, move the files you added into another folder.',
          'Press Windows + R, type “winver” and check your Windows version. On Windows 10, update if it is older than version 1909 (official requirement).',
          'Compare the Steam store requirements with your GPU and memory.',
        ],
        note: 'If the game starts without mods, update each mod to a version that supports the current game version, then add them back one at a time.',
      },
      {
        id: 'gpu-driver',
        title: 'Do a clean install of your GPU driver',
        summary:
          'The official steps remove the old driver before installing the latest one.',
        time: 'About 15 min',
        actions: [
          'Download the latest driver from NVIDIA, AMD or Intel first.',
          'NVIDIA and Intel: remove the old driver with Display Driver Uninstaller (DDU), then install the driver you downloaded. AMD: remove it with the AMD Cleanup Utility, then install the new one.',
          'If the crashes started right after a driver update, install the previous version instead.',
        ],
        note: 'The screen resolution may be lower while the GPU driver is uninstalled. Keep these steps open on another device.',
      },
      {
        id: 'vcredist',
        title: 'Reinstall the Visual C++ redistributables',
        summary:
          'Do this when you see a DLL error, or when the game closes right after launch with no message.',
        time: 'About 5 min',
        actions: [
          'Download both the x64 and x86 Visual C++ redistributables from Microsoft.',
          'Right-click each installer → Run as administrator.',
          'Restart the PC, then start the game.',
        ],
      },
      {
        id: 'verify-files',
        title:
          'Verify the game files and turn off overlays and background apps',
        summary:
          'Replace damaged files, then test for conflicts with other apps.',
        time: '10–20 min',
        actions: [
          verify('Cyberpunk 2077'),
          'On GOG GALAXY or Epic Games, use the launcher’s verify/repair option.',
          'Turn off overlays (Discord, Ubisoft Connect, GOG GALAXY and similar) and close unneeded hardware-monitoring or other non-security apps one at a time. Keep antivirus and firewall protection enabled.',
          'Run the launcher (Steam, GOG GALAXY or Epic) as administrator, then start the game.',
          'If your CPU or GPU is overclocked or underclocked, return it to stock clock settings (official advice).',
        ],
        note: 'If protection history identifies an official game file, confirm the file’s source and the detected issue with the security provider or game support before changing security settings. Do not restore a quarantined file or add an exclusion just to make the game start.',
      },
    ],
    avoid: [
      'Do not reinstall with mods still installed; mod files can be left behind.',
      'Do not delete the save folder. Copy it somewhere else before you start.',
      'Do not troubleshoot while the hardware is overclocked.',
    ],
    cautions: [
      'If nothing helps, contact CD PROJEKT RED support with the exact error message or code (official advice).',
    ],
    faqs: [
      {
        question: 'REDlauncher does not open.',
        answer:
          'CD PROJEKT RED suggests running your store app (Steam, Epic Games or GOG GALAXY) as administrator and launching from there.',
      },
      {
        question: 'Will reinstalling delete my saves?',
        answer: String.raw`Saves are stored in %USERPROFILE%\Saved Games\CD Projekt Red\Cyberpunk 2077, separate from the game folder. Copy that folder somewhere safe before you start anyway.`,
      },
    ],
    sources: [
      {
        label: 'CD PROJEKT RED Support: Game is not launching — Cyberpunk 2077',
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1568/game-is-not-launching',
      },
      {
        label: 'CD PROJEKT RED Support: Game crashes — Cyberpunk 2077',
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1700/my-game-crashes-7',
      },
      {
        label: 'CD PROJEKT RED Support: MSVCP140_1.dll was not found',
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1915/error-the-code-execution-cannot-proceed-because-msvcp140-1-dll-was-not-found',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'baldurs-gate-3',
    slug: 'crash-on-startup',
    title:
      'Baldur’s Gate 3 Crashing on Startup or Not Launching (PC): Larian’s Fixes',
    shortTitle: 'Crashing on startup',
    description:
      'Baldur’s Gate 3 crashes on startup or will not launch? Switch between DirectX 11 and Vulkan, launch the executable directly, remove old mods and rebuild the profile folder, following Larian’s support steps.',
    lead: 'For the Steam and GOG versions on Windows: nothing happens after you click Play in the launcher, the game closes around the logo, or it stopped launching after a patch.',
    summary:
      'Larian’s support suggests, in order: close non-essential apps, verify the files, switch between DirectX 11 and Vulkan in the launcher, start the executable directly without the launcher, and remove old mods completely. Leave rebuilding the profile folder for last, and rename it instead of deleting it so your saves stay safe.',
    quickFacts: [
      {
        label: 'Executables',
        value: 'Vulkan: bg3.exe / DirectX 11: bg3_dx11.exe (in the bin folder)',
      },
      {
        label: 'Mods folder',
        value: String.raw`%LocalAppData%\Larian Studios\Baldur's Gate 3\Mods`,
        copy: true,
      },
      {
        label: 'Saves and settings',
        value: String.raw`%LocalAppData%\Larian Studios\Baldur's Gate 3`,
        copy: true,
      },
      {
        label: 'Known issue',
        value:
          'ASUS Sonic Studio Virtual Mixer can crash the game on startup (official)',
      },
    ],
    diagnosis: [
      {
        symptom: 'Crashes after pressing Play in the launcher',
        cause: 'Background apps or the graphics API',
        stepId: 'switch-api',
      },
      {
        symptom: 'The launcher itself is blank or unusable',
        cause: 'Launcher problem',
        stepId: 'direct-exe',
      },
      {
        symptom: 'Stopped launching after a patch (you used mods)',
        cause: 'Old mods left behind',
        stepId: 'remove-mods',
      },
      {
        symptom: 'Crashes on startup even with a new game',
        cause: 'Damaged settings or cache',
        stepId: 'reset-profile',
      },
    ],
    steps: [
      {
        id: 'switch-api',
        title:
          'Close background apps, verify files and switch between DirectX 11 and Vulkan',
        summary:
          'These checks come first in Larian’s list. Review any software-removal step before proceeding.',
        time: '10–15 min',
        actions: [
          'Close nonessential graphics-tweaking tools, monitoring overlays and chat apps one at a time. Keep antivirus and firewall protection enabled; if protection history identifies an official game file, ask the security provider or game support what to do.',
          'If you use ASUS Sonic Studio Virtual Mixer, disable or uninstall it (a known issue listed by Larian).',
          verify("Baldur's Gate 3"),
          'In the launcher, switch between DirectX 11 and Vulkan and try again.',
        ],
      },
      {
        id: 'direct-exe',
        title: 'Skip the launcher and run the executable as administrator',
        summary:
          'Exit Steam or GOG GALAXY and start the game from the bin folder.',
        time: 'About 3 min',
        actions: [
          'Exit Steam (or GOG GALAXY).',
          String.raw`Open “…\SteamApps\common\Baldurs Gate 3\bin” (or in Steam: right-click the game → Manage → Browse local files).`,
          'Right-click bg3.exe (Vulkan) or bg3_dx11.exe (DirectX 11) → Run as administrator.',
          'Larian also suggests holding Shift after right-clicking, choosing Run as administrator and keeping Shift held until the splash screen appears.',
        ],
        note: 'If you get a Visual C++ DLL error, install the latest 64-bit Visual C++ redistributable from Microsoft.',
      },
      {
        id: 'remove-mods',
        title: 'Remove old mods completely',
        summary:
          'Mod files left over from an earlier patch can crash the game on startup.',
        time: 'About 5 min',
        actions: [
          'Exit the game and the launcher.',
          String.raw`Paste “%LocalAppData%\Larian Studios\Baldur's Gate 3\Mods” into the File Explorer address bar and move its contents somewhere else.`,
          String.raw`If the install folder “…\Baldurs Gate 3\Data” contains “Mods” or “Public” folders, move them too (Larian says both are safe to delete).`,
          'Check whether the game starts without mods.',
        ],
      },
      {
        id: 'reset-profile',
        title: 'Rename the profile folder so the game rebuilds it',
        summary:
          'This makes the game create fresh saves, settings and cache folders. Renaming means you can undo it.',
        time: 'About 5 min',
        actions: [
          String.raw`First, delete the contents of “%LocalAppData%\Larian Studios\Baldur's Gate 3\LevelCache” and try again (official).`,
          String.raw`If that does not help, open “%LocalAppData%\Larian Studios” and rename the “Baldur's Gate 3” folder (for example, add _old to the end).`,
          'If the game now starts, check that you can begin a new game, save and load.',
          'To restore the original profile, close the game and launcher, keep the newly created folder separately, then rename the old folder back. Do not overwrite any saves you want to keep.',
        ],
        note: 'With Steam Cloud enabled, Steam may download your cloud data when the game starts. Larian suggests turning off Steam Cloud for this game temporarily if needed.',
      },
    ],
    avoid: [
      'Do not delete the profile folder; rename it. It contains your saves.',
      'Do not test multiplayer while players have different mods or mod versions.',
    ],
    cautions: [
      'If the game still crashes, Larian asks for a DxDiag report (Windows + R → “dxdiag” → Save All Information), plus gold.log and any crash dump from the bin folder.',
    ],
    faqs: [
      {
        question: 'Should I play with DirectX 11 or Vulkan?',
        answer:
          'If the game will not start with one, Larian suggests trying the other. Use whichever starts and runs stably on your PC.',
      },
      {
        question: 'Where are my saves?',
        answer: String.raw`Saves, settings and the level cache are in %LocalAppData%\Larian Studios\Baldur's Gate 3 (official).`,
      },
    ],
    sources: [
      {
        label: 'Microsoft: Virus and threat protection (exclusion risks)',
        url: 'https://support.microsoft.com/en-us/windows/security/threat-malware-protection/virus-and-threat-protection-in-the-windows-security-app',
      },
      {
        label: 'Larian Support: Crashing upon startup (PC)',
        url: 'https://larian.com/support/faqs/crashing-upon-startup-pc_59',
      },
      {
        label: 'Larian Support: The Larian Launcher is crashing',
        url: 'https://larian.com/support/faqs/the-larian-launcher-is-crashing_63',
      },
      {
        label: 'Baldur’s Gate 3 official support',
        url: 'https://baldursgate3.game/support',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'helldivers-2',
    slug: 'gameguard-error-114',
    title: 'HELLDIVERS 2 GameGuard Error 114 on PC: How to Fix It',
    shortTitle: 'GameGuard error 114',
    description:
      'HELLDIVERS 2 won’t start because of nProtect GameGuard error 114? Review Arrowhead’s guidance on launch permissions, compatibility, GameGuard reinstallation, utility conflicts and security alerts.',
    lead: 'Arrowhead’s official steps for when nProtect GameGuard shows error 114 and the game does not start (Steam version).',
    summary:
      'Arrowhead lists workarounds involving launch permissions and compatibility, GameGuard reinstallation, utility conflicts, security software and unused drives. Review the steps and their cautions below. Error 114 alone is not a reason to weaken security or disconnect internal hardware.',
    quickFacts: [
      {
        label: 'Open the game folder',
        value: 'Steam: right-click the game → Manage → Browse local files',
      },
      { label: 'Game executable', value: '“helldivers2” in the bin folder' },
      {
        label: 'Reinstall GameGuard',
        value:
          'Run “gguninst”, then “GGSetup”, from the tools folder as administrator',
      },
      {
        label: 'On Windows 11',
        value: 'Also turn on compatibility mode for Windows 8 (official)',
      },
    ],
    diagnosis: [
      {
        symptom: 'Error 114 every time',
        cause: 'Permissions or compatibility',
        stepId: 'run-as-admin',
      },
      {
        symptom: 'Error 114 even as administrator',
        cause: 'Damaged GameGuard installation',
        stepId: 'reinstall-gameguard',
      },
      {
        symptom: 'Only happens while certain apps are open',
        cause: 'A utility or security software interferes',
        stepId: 'utilities',
      },
    ],
    steps: [
      {
        id: 'run-as-admin',
        title:
          'Run helldivers2 as administrator (plus compatibility mode on Windows 11)',
        summary: 'This is the first workaround on Arrowhead’s list.',
        time: 'About 3 min',
        actions: [
          'In your Steam Library, right-click HELLDIVERS 2 → Manage → Browse local files.',
          'Open the “bin” folder, right-click “helldivers2” → Properties → Compatibility tab.',
          'Tick “Run this program as an administrator”.',
          'On Windows 11, also tick “Run this program in compatibility mode for” and choose Windows 8.',
          'Click OK and start the game from Steam.',
        ],
        note: 'If this causes other problems, untick the boxes to undo it.',
      },
      {
        id: 'reinstall-gameguard',
        title: 'Uninstall and reinstall GameGuard',
        summary: 'Use the GameGuard tools that come with the game.',
        time: 'About 5 min',
        actions: [
          'Open the game folder as in step 1.',
          'In the “tools” folder, right-click “gguninst” → Run as administrator.',
          'When it finishes, right-click “GGSetup” in the same folder → Run as administrator.',
          'Restart the PC and start the game.',
        ],
      },
      {
        id: 'utilities',
        title: 'Close utility programs and review security alerts',
        summary:
          'Arrowhead notes that error 114 can be triggered by programs that are not cheats.',
        time: 'About 10 min',
        actions: [
          'Close overlays, macro tools, RGB lighting software and monitoring tools one at a time, and check whether the game starts.',
          'If security software reports a detection involving an official GameGuard or HELLDIVERS 2 file, record the threat name and file path, then ask the security provider or Arrowhead before changing exclusions. Do not allowlist unknown files, modified files or whole folders automatically.',
          'Arrowhead also mentions old hard drives as a possible factor. Do not disconnect internal hardware while the PC is running. If you are unsure which drive is involved or whether it contains needed data, ask the PC manufacturer or a technician before making a hardware change.',
        ],
        note: 'If you find the program that causes it, Arrowhead asks players to report its name.',
      },
    ],
    avoid: [
      'Keep security protection enabled. Review any relevant detection with the security provider or game support before considering an exclusion.',
      'Do not use modification or cheat tools; the anti-cheat will react to them.',
    ],
    cautions: ['If none of these steps help, contact Arrowhead support.'],
    faqs: [
      {
        question: 'Should I add an exception in Microsoft Defender?',
        answer:
          'Not automatically. Arrowhead discusses exceptions for GameGuard and HELLDIVERS 2, including in Microsoft Defender. First confirm whether a detection refers to an official game file and ask the security provider or Arrowhead for guidance. Do not exclude an unknown file or disable protection.',
      },
      {
        question: 'Will reinstalling GameGuard delete my progress?',
        answer:
          'Reinstalling GameGuard only reinstalls the anti-cheat inside the game folder. Arrowhead’s steps do not include deleting any save data.',
      },
    ],
    sources: [
      {
        label: 'Microsoft: Virus and threat protection (exclusion risks)',
        url: 'https://support.microsoft.com/en-us/windows/security/threat-malware-protection/virus-and-threat-protection-in-the-windows-security-app',
      },
      {
        label:
          'Arrowhead Support: I receive Error 114 when attempting to launch HELLDIVERS 2',
        url: 'https://arrowhead.zendesk.com/hc/en-us/articles/14732747845020-I-receive-Error-114-when-attempting-to-launch-HELLDIVERS-2',
      },
      {
        label: 'Steam store: HELLDIVERS 2',
        url: 'https://store.steampowered.com/app/553850/',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'hogwarts-legacy',
    slug: 'crash',
    title:
      'Hogwarts Legacy Crashing or Not Launching on PC: Official Troubleshooting',
    shortTitle: 'Crashing or not launching',
    description:
      'Hogwarts Legacy crashing on PC? Undo Engine.ini edits and mods, then follow WB Games’ troubleshooting: drivers, Windows Update, overclocking, file verification, graphics settings and security software.',
    lead: 'WB Games (Portkey Games) support steps for when the Steam version closes at launch, crashes to the desktop or freezes while loading.',
    summary:
      'Official support covers, in order: update GPU and sound drivers, run Windows Update (which updates DirectX), return overclocked parts to stock, verify the game files, lower graphics settings, and review relevant security alerts and conflicts with unneeded apps. If you edited Engine.ini or installed mods, undo that first.',
    quickFacts: [
      {
        label: 'Save location',
        value: String.raw`%LOCALAPPDATA%\Hogwarts Legacy\Saved\SaveGames`,
        copy: true,
      },
      {
        label: 'Config location',
        value: String.raw`%LOCALAPPDATA%\Hogwarts Legacy\Saved\Config\WindowsNoEditor`,
        copy: true,
      },
      { label: 'Updating DirectX', value: 'Through Windows Update (official)' },
      {
        label: 'Still crashing',
        value:
          'Search, vote on or add to reports on the official bug-report site',
      },
    ],
    diagnosis: [
      {
        symptom: 'Crashes started after editing Engine.ini or adding mods',
        cause: 'Config changes or mods',
        stepId: 'undo-changes',
      },
      {
        symptom: 'Drivers or Windows have not been updated for a while',
        cause: 'Outdated driver or DirectX',
        stepId: 'drivers-windows',
      },
      {
        symptom: 'The game starts but crashes in certain places',
        cause: 'Damaged files or graphics settings',
        stepId: 'verify-settings',
      },
      {
        symptom: 'Your security software showed a warning',
        cause: 'Check whether the alert refers to official game files',
        stepId: 'background-apps',
      },
    ],
    steps: [
      {
        id: 'undo-changes',
        title: 'Undo Engine.ini edits and remove mods',
        summary:
          'Official troubleshooting assumes an unmodified game, so restore it first.',
        time: 'About 5 min',
        actions: [
          String.raw`Open “%LOCALAPPDATA%\Hogwarts Legacy\Saved\Config\WindowsNoEditor”. If you edited Engine.ini, restore the original or move the edited file elsewhere.`,
          'If you installed mods, move the mod files out of the game folder.',
          'Start the game and check whether it still crashes.',
        ],
      },
      {
        id: 'drivers-windows',
        title: 'Update GPU and sound drivers, and Windows',
        summary:
          'DirectX is updated through Windows Update; get drivers from the manufacturer.',
        time: '10–20 min',
        actions: [
          'Install the latest GPU driver from NVIDIA, AMD, Intel or your PC manufacturer.',
          'Check your PC or motherboard manufacturer’s site for a newer sound driver.',
          'Go to Settings → Windows Update → Check for updates.',
          'If your CPU or GPU is overclocked (including “turbo boost” tools), return it to the manufacturer’s settings (official).',
        ],
      },
      {
        id: 'verify-settings',
        title: 'Verify the game files and lower graphics settings',
        summary:
          'Rule out damaged files first, then the load from graphics settings.',
        time: '10–20 min',
        actions: [
          verify('Hogwarts Legacy'),
          'Choose a lower graphics preset in the game and check whether it still crashes in the same place.',
          'If it still crashes, uninstall and reinstall the game. Saves are stored elsewhere, but copy them first anyway.',
        ],
      },
      {
        id: 'background-apps',
        title: 'Review security alerts and close unneeded apps',
        summary:
          'Check for quarantined files and conflicts with other apps. A clean boot is only a temporary test.',
        time: 'About 10 min',
        actions: [
          'Review protection history for a detection matching the official game file and failure time. Keep protection enabled and ask the security provider or game support before restoring a quarantined file or adding an exclusion. Do not exclude the entire game folder automatically.',
          'Close nonessential, non-security apps before starting the game and compare one change at a time.',
          'If it still crashes, do a clean boot using Microsoft’s instructions to compare, then return Windows to a normal startup when you are done.',
        ],
        note: 'WB Games warns that a clean boot done incorrectly can affect how your PC starts, so follow Microsoft’s steps exactly.',
      },
    ],
    avoid: [
      'Do not delete the save folder; copy it before reinstalling.',
      'Do not keep using Windows in clean-boot mode.',
    ],
    cautions: [
      'If nothing works, WB Games suggests finding a matching report on the Hogwarts Legacy bug-report site and voting or adding screenshots.',
    ],
    faqs: [
      {
        question:
          'My PC meets the minimum requirements but the game still crashes.',
        answer:
          'Official support explains that higher quality settings can affect performance and stability even on PCs that meet the requirements. Try lower graphics settings.',
      },
      {
        question: 'How do I update DirectX?',
        answer:
          'DirectX is updated through Windows Update: Settings → Windows Update → Check for updates.',
      },
    ],
    sources: [
      {
        label: 'Microsoft: Virus and threat protection (exclusion risks)',
        url: 'https://support.microsoft.com/en-us/windows/security/threat-malware-protection/virus-and-threat-protection-in-the-windows-security-app',
      },
      {
        label: 'Portkey Games Support: PC Troubleshooting (Steam)',
        url: 'https://portkeygamessupport.wbgames.com/hc/en-us/articles/10765467342099-PC-Troubleshooting-Steam',
      },
      {
        label: 'Portkey Games Support: Hogwarts Legacy',
        url: 'https://portkeygamessupport.wbgames.com/hc/en-us/categories/360004524734-Hogwarts-Legacy',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'gta-v-enhanced',
    slug: 'story-save-migration',
    title:
      'How to Transfer Your GTA V Story Mode Save from Legacy to Enhanced (PC)',
    shortTitle: 'Transfer Story Mode save',
    description:
      'Move your GTA V Story Mode progress from Legacy to Enhanced on PC: upload one save in Legacy, download it in Enhanced. One transfer per account, 90-day window, PC only — Rockstar’s official steps.',
    lead: 'For players who started Story Mode in GTA V Legacy and want to continue in GTA V Enhanced, using Rockstar’s official process.',
    summary:
      'In GTA V Legacy, open the pause menu and choose Game → Upload Save Game. Then, in GTA V Enhanced, download it from the Story tab on the landing page, or from the pause menu under Game → Download Save Game. Each account can transfer only once, and the transfer becomes final when you download the save.',
    quickFacts: [
      {
        label: 'Number of transfers',
        value: 'One per account (final once you download)',
      },
      {
        label: 'Upload stays available',
        value: '90 days (upload again after that)',
      },
      {
        label: 'Platforms',
        value: 'PC to PC only; no transfers between PC and console',
      },
      {
        label: 'Enhanced save location',
        value: String.raw`%USERPROFILE%\Documents\Rockstar Games\GTAV Enhanced\Profiles`,
        copy: true,
      },
    ],
    diagnosis: [
      {
        symptom: 'Upload Save Game is unavailable or fails',
        cause: 'Account linking',
        stepId: 'link-account',
      },
      {
        symptom: 'You are not sure which save to send',
        cause: 'Only one save can be uploaded',
        stepId: 'upload-save',
      },
      {
        symptom: 'The Enhanced landing page does not offer a transfer',
        cause: 'Enhanced already has a Story Mode save',
        stepId: 'download-save',
      },
    ],
    steps: [
      {
        id: 'link-account',
        title: 'Check that your Rockstar Games account is linked',
        summary:
          'The transfer goes through the Rockstar Games account you are signed in with.',
        time: 'About 3 min',
        actions: [
          'Make sure you are signed in to the same Rockstar Games account in Legacy and Enhanced.',
          'Make sure that account is linked to the PC platform account you play on (for example, Steam).',
        ],
        note: 'Some profiles are not eligible, for example because of a suspension or ban, or because the profile has illegitimate or insufficient progress (official).',
      },
      {
        id: 'upload-save',
        title: 'Upload your save from GTA V Legacy',
        summary:
          'Only one save can be uploaded, so pick the one you want to keep.',
        time: 'About 5 min',
        actions: [
          'Start GTA V Legacy on your PC and open the pause menu in Story Mode.',
          'Choose Game → Upload Save Game.',
          'Select the save you want to move and confirm it on the alert screen.',
          'Wait for the message confirming that the upload is complete.',
        ],
        note: 'Until you download it in Enhanced, you can upload a different save as many times as you like. Progress you make in Legacy after uploading is not synced.',
      },
      {
        id: 'download-save',
        title: 'Download the save in GTA V Enhanced',
        summary:
          'Use the Story tab on the landing page or the pause menu. Downloading completes the transfer.',
        time: 'About 5 min',
        actions: [
          'If Enhanced has no Story Mode saves yet: on the landing page, choose the Story tab and confirm the download.',
          'If Enhanced already has Story Mode saves: open the pause menu in Story Mode → Game → Download Save Game → choose the save and confirm.',
          'When the download finishes, the game loads the save automatically.',
        ],
        note: 'After downloading, no further Story Mode transfers are possible on that account. Make sure you uploaded the right save first.',
      },
    ],
    avoid: [
      'Do not download in Enhanced until you are sure the uploaded save is the right one — you only get one transfer.',
      'Do not leave an upload longer than 90 days.',
    ],
    cautions: [
      'Depending on the save size and server load, the transfer can take some time (official).',
      'Menu names can differ slightly by language and game version.',
    ],
    faqs: [
      {
        question: 'Can I move my PS5 or Xbox Story Mode save to PC?',
        answer:
          'No. Rockstar support says the Legacy-to-Enhanced transfer works only within PC; transfers between PC and consoles are not supported.',
      },
      {
        question: 'Will progress I make in Legacy afterwards carry over?',
        answer:
          'No. Story Mode progress made in Legacy after the transfer is not synced to Enhanced (official).',
      },
      {
        question: 'Can I change which save I uploaded?',
        answer:
          'Yes, until you download it in Enhanced — upload another save from Legacy to replace it. After the download it cannot be changed.',
      },
    ],
    sources: [
      {
        label:
          'Rockstar Support: Migrating your Story Mode Save from GTAV Legacy to GTAV Enhanced on PC',
        url: 'https://support.rockstargames.com/articles/mmRgMVfuQC3xNzXK4Cq9b/migrating-your-story-mode-save-from-grand-theft-auto-v-legacy-to-grand-theft',
      },
      {
        label: 'Rockstar Support: Grand Theft Auto V',
        url: 'https://support.rockstargames.com/gta-v',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'skyrim-special-edition',
    slug: 'skse-after-update',
    title: 'SKSE Not Working After a Skyrim Update: How to Fix It (PC)',
    shortTitle: 'SKSE broken after an update',
    description:
      'Skyrim won’t start through SKSE after a game update? Check your game version, install the matching SKSE build, and remove SKSE plugins until your mods are updated — based on the official SKSE site.',
    lead: 'For the Steam and GOG versions: the game will not start through SKSE, or crashes right after launch, following a Skyrim update.',
    summary:
      'Each SKSE build supports a specific game version. After a game update, install the matching build from the official SKSE site. If the game still crashes on startup after a patch, the SKSE team says to remove the files in Data/SKSE/Plugins and try again, because mods that use plugins usually need updating too.',
    quickFacts: [
      {
        label: 'Supported versions',
        value: 'Steam and GOG (not Game Pass or Epic)',
      },
      {
        label: 'Crashes after a game patch',
        value:
          'Remove the files in Data/SKSE/Plugins and try again (SKSE team)',
      },
      {
        label: 'Logs for support requests',
        value:
          'skse.log, skse_loader.log and skse_steam_loader.log (in My Games)',
      },
      {
        label: 'Save location',
        value: String.raw`%USERPROFILE%\Documents\My Games\Skyrim Special Edition\Saves`,
        copy: true,
      },
    ],
    diagnosis: [
      {
        symptom: 'The SKSE loader says your game version is not supported',
        cause: 'SKSE does not match the new game version',
        stepId: 'check-version',
      },
      {
        symptom: 'SKSE is up to date but the game crashes right away',
        cause: 'Plugin mods that do not support the new version',
        stepId: 'plugins-off',
      },
      {
        symptom: 'The game will not start even without SKSE',
        cause: 'A problem with the game itself',
        stepId: 'vanilla-check',
      },
    ],
    steps: [
      {
        id: 'vanilla-check',
        title: 'Check whether the game starts without SKSE',
        summary:
          'The SKSE team asks you to confirm the game launches properly without SKSE before contacting them.',
        time: 'About 5 min',
        actions: [
          'Copy your save folder somewhere else first.',
          'Start “The Elder Scrolls V: Skyrim Special Edition” normally through your purchased edition: Steam for the Steam edition or the normal GOG launch for the GOG edition, without the SKSE loader.',
          'If the Steam edition does not start: ' +
            verify('The Elder Scrolls V: Skyrim Special Edition'),
        ],
        note: 'Verifying files also restores game files that mods replaced. If you use a mod manager, check its instructions too.',
      },
      {
        id: 'check-version',
        title: 'Install the SKSE build that matches your game version',
        summary:
          'For the Steam edition, the SKSE team targets the latest game version. Each SKSE build requires a matching game version.',
        time: 'About 10 min',
        actions: [
          'In the game folder (Steam: right-click → Manage → Browse local files), right-click “SkyrimSE.exe” → Properties → Details and note the File version.',
          'On the official SKSE site (skse.silverlock.org), find the build for that version: the Anniversary Edition build for Steam, the GOG build for GOG.',
          'Reinstall SKSE following the site’s instructions.',
          'If there is no build for your version yet, wait for an SKSE update.',
        ],
        note: 'Follow the download destination and included instructions for the SE/AE build you selected on the official site. You can extract 7z files with 7-Zip. Do not mistake the classic build’s “Install via Steam” or installer for an SE/AE installation method.',
      },
      {
        id: 'plugins-off',
        title: 'Remove SKSE plugins, then add back updated mods',
        summary:
          'After a game update, mods that use SKSE plugins may need updating as well.',
        time: 'About 10 min',
        actions: [
          String.raw`Move the contents of “Data\SKSE\Plugins” in the game folder somewhere else (with a mod manager, disable the mods that include plugins).`,
          'Check whether the game starts through the SKSE loader.',
          'If it does, check each mod’s page for a version that supports the new game version and add them back one at a time.',
        ],
      },
    ],
    avoid: [
      'Back up older saves before overwriting them; changes saved after removing mods may not be reversible.',
      'Do not download SKSE from unofficial sites.',
    ],
    cautions: [
      'When contacting the SKSE team, attach skse.log, skse_loader.log and skse_steam_loader.log from the SKSE folder in My Games (official advice).',
      'Version numbers in this article were correct when checked. See the official SKSE site for the current status.',
    ],
    faqs: [
      {
        question: 'Does SKSE work with the Game Pass or Epic version?',
        answer:
          'No. The official SKSE site says the Windows Store/Game Pass and Epic Games Store versions are not supported.',
      },
      {
        question: 'Can I stay on an older game version?',
        answer:
          'The SKSE site still offers a build for players who downgraded to 1.5.97, but it recommends the Anniversary Edition build for the current Steam version.',
      },
    ],
    sources: [
      {
        label: 'Skyrim Script Extender (SKSE) official site',
        url: 'https://skse.silverlock.org/',
      },
      {
        label: 'Steam store: The Elder Scrolls V: Skyrim Special Edition',
        url: 'https://store.steampowered.com/app/489830/',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'stardew-valley',
    slug: 'save-restore',
    title:
      'Stardew Valley Save Location and How to Recover a Missing or Broken Save (PC)',
    shortTitle: 'Save location and recovery',
    description:
      'Where Stardew Valley saves are on PC and how to recover a save that disappeared or won’t load: fix _STARDEWVALLEYSAVETMP names, undo the last save, restore SMAPI backups or a save Steam Cloud overwrote.',
    lead: 'For players who need the save folder, whose save vanished from the list or will not load, or who want to go back one day.',
    summary: String.raw`Saves are in “%appdata%\StardewValley\Saves”, one “FarmName_number” folder per farm. If a save is missing or will not load, try in this order: remove “_STARDEWVALLEYSAVETMP” from file names, undo the last save using the _old files, then restore an SMAPI backup. Copy the whole folder before you change anything.`,
    quickFacts: [
      {
        label: 'Save location',
        value: String.raw`%appdata%\StardewValley\Saves`,
        copy: true,
      },
      {
        label: 'Files you need',
        value:
          'The “FarmName_number” file and SaveGameInfo (keep the folder together)',
      },
      {
        label: 'When the game saves',
        value:
          'Only at the end of an in-game day (going to bed, passing out, or 2 a.m.)',
      },
      {
        label: 'SMAPI backups',
        value: '“save-backups” in the game folder (up to 10 days)',
      },
    ],
    diagnosis: [
      {
        symptom: 'File names end in “_STARDEWVALLEYSAVETMP”',
        cause: 'A save was interrupted',
        stepId: 'tmp-name',
      },
      {
        symptom: 'The game crashes when loading, or you want to go back a day',
        cause: 'A problem with the last save',
        stepId: 'undo-save',
      },
      {
        symptom: 'The save folder is gone (you use SMAPI)',
        cause: 'Deleted or damaged files',
        stepId: 'smapi-backup',
      },
      {
        symptom: 'Days you already played are missing',
        cause: 'Steam Cloud replaced the save with an older copy',
        stepId: 'cloud-overwrite',
      },
    ],
    steps: [
      {
        id: 'open-backup',
        title: 'Open the save folder and back it up',
        summary: 'Copy the current state before trying any recovery.',
        time: 'About 2 min',
        actions: [
          'Close the game.',
          String.raw`Press Windows + R, type “%appdata%\StardewValley\Saves” and click OK.`,
          'Right-click the “FarmName_number” folder, compress it to a ZIP file and store it somewhere else, such as the desktop.',
        ],
        note: 'Do not keep backup folders inside the Saves folder — the game will try to load them (official wiki).',
      },
      {
        id: 'tmp-name',
        title: 'Remove “_STARDEWVALLEYSAVETMP” from file names',
        summary: 'This is the first fix the official wiki lists.',
        time: 'About 3 min',
        actions: [
          'Open the save folder and look for files with “_STARDEWVALLEYSAVETMP” in the name.',
          'Remove that part of the name and start the game.',
          'If the name changes back each time, open Stardew Valley’s Properties in Steam (gear icon) → General, turn off Steam Cloud sync, then fix the names again.',
          'Also make sure the folder name exactly matches the “FarmName_number” file name.',
        ],
      },
      {
        id: 'undo-save',
        title: 'Undo the last save using the _old files',
        summary:
          'If the folder has two files ending in “_old”, you can go back one day.',
        time: 'About 3 min',
        actions: [
          'Check that the folder contains “SaveGameInfo_old” and “FarmName_number_old” (if not, this step will not work).',
          'Make sure you have the backup from step 1.',
          'Delete “SaveGameInfo” and “FarmName_number” (the files without _old).',
          'Remove “_old” from the names of “SaveGameInfo_old” and “FarmName_number_old”.',
        ],
      },
      {
        id: 'smapi-backup',
        title: 'Restore an SMAPI backup',
        summary:
          'If you have SMAPI installed, its bundled SaveBackup mod keeps up to 10 daily backups.',
        time: 'About 5 min',
        actions: [
          'Open the game folder (Steam: right-click → Manage → Browse local files).',
          'Open “save-backups” and extract the newest ZIP file that contains your save.',
          'Copy the save folder inside it into your Saves folder.',
        ],
      },
      {
        id: 'cloud-overwrite',
        title: 'If Steam Cloud overwrote your save',
        summary:
          'For when you have a backup, but the game keeps switching back to an older cloud copy.',
        time: 'About 3 min',
        actions: [
          'Start the game, but do not load a save yet.',
          'With the game still running, delete the save folder in Saves and put your backup back.',
          'Load the save in the game. Because it changed while the game was running, the cloud treats it as the newer version (official wiki).',
        ],
      },
    ],
    avoid: [
      'Do not delete or rename files before making a backup.',
      'Do not keep backup folders inside the Saves folder.',
      'Avoid automatic save-editor tools — the official wiki warns they often break saves.',
    ],
    cautions: [
      'Multiplayer saves are stored only on the host’s PC (official wiki).',
      'An older version of the game cannot load a save made by a newer version.',
    ],
    faqs: [
      {
        question: 'I quit in the middle of a day and lost my progress.',
        answer:
          'Stardew Valley only saves at the end of an in-game day (going to bed, passing out from exhaustion, or at 2 a.m.). Progress during a day is lost if you quit before it ends (official wiki).',
      },
      {
        question:
          'I own the game on both Steam and GOG. Are the saves separate?',
        answer:
          'On PC, saves are stored separately from the game and are shared between copies from different stores, such as Steam and GOG (official wiki).',
      },
      {
        question: 'My save will not load after I removed mods.',
        answer:
          'The official wiki says some modded saves cannot be loaded in the unmodded game. Reinstall SMAPI and play one day: SMAPI removes custom content from the save (custom items left in your inventory may turn into error items).',
      },
    ],
    sources: [
      {
        label: 'Stardew Valley Wiki (official): Saves',
        url: 'https://stardewvalleywiki.com/Saves',
      },
      {
        label: 'Steam store: Stardew Valley',
        url: 'https://store.steampowered.com/app/413150/',
      },
    ],
  },
];
