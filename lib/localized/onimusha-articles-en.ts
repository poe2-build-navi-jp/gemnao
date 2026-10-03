import type { LocalizedArticle } from './types';

// English editions of the seven existing Japanese guides. Keep their step IDs
// stable: they identify the same troubleshooting step across languages.
const gameSlug = 'onimusha-way-of-the-sword';
const gameName = 'Onimusha: Way of the Sword';
const installDir = String.raw`C:\Program Files (x86)\Steam\steamapps\common\OnimushaWotS`;
const sources = {
  capcom: {
    label: 'Capcom: Onimusha: Way of the Sword PC troubleshooting guide',
    url: 'https://steamcommunity.com/app/2638890/discussions/0/589562598193771781/',
  },
  steam: {
    label: 'Steam: Onimusha: Way of the Sword system requirements',
    url: 'https://store.steampowered.com/app/2638890/',
  },
  pcgw: {
    label: 'PCGamingWiki: Onimusha: Way of the Sword (community reference)',
    url: 'https://www.pcgamingwiki.com/wiki/Onimusha:_Way_of_the_Sword',
  },
  msHdr: {
    label: 'Microsoft: HDR settings in Windows',
    url: 'https://support.microsoft.com/en-us/windows/hardware/display-graphics/hdr-settings-in-windows',
  },
  msCalibration: {
    label:
      'Microsoft: Calibrate your HDR display using Windows HDR Calibration',
    url: 'https://support.microsoft.com/en-us/windows/hardware/display-graphics/calibrate-your-hdr-display-using-the-windows-hdr-calibration-app',
  },
};
const driverFact = {
  label: 'GPU driver versions in Capcom’s guide',
  value: 'NVIDIA GeForce 596.49 or later; AMD Radeon 26.5.1 or later',
};
const titles: Record<string, string> = {
  'not-launching': 'Crashing or not launching',
  'crash-report': 'Find CrashReport and prepare a support request',
  'low-fps': 'Low or unstable FPS',
  'shader-cache': 'Rebuild shader.cache',
  'black-screen': 'Black screen, flickering or missing picture',
  hdr: 'HDR looks washed out or will not turn on',
  'gpu-driver-version': 'GPU driver requirements',
};
const related = (...slugs: string[]) =>
  slugs.map((slug) => ({
    href: `/en/games/${gameSlug}/${slug}`,
    label: titles[slug],
  }));
type Draft = Omit<
  LocalizedArticle,
  'locale' | 'gameSlug' | 'gameName' | 'checkedAt' | 'sourcePolicy'
>;
const make = (draft: Draft): LocalizedArticle => ({
  locale: 'en',
  gameSlug,
  gameName,
  checkedAt: '2026-10-03',
  sourcePolicy:
    'These steps summarize the linked Capcom, Steam and Microsoft guidance in our own words. PCGamingWiki is linked as a secondary reference, not publisher guidance. Unverified version-specific settings and save paths are not treated as established facts. This is a source-based guide, not a claim that we tested every fix on this game. Follow newer official guidance if it differs.',
  ...draft,
});

export const onimushaArticlesEn: LocalizedArticle[] = [
  make({
    slug: 'not-launching',
    title: 'Onimusha: Way of the Sword Not Launching or Crashing on PC',
    shortTitle: titles['not-launching'],
    description:
      'Troubleshoot Onimusha PC launch and loading crashes with Capcom’s driver requirements, Steam file verification, overlay checks and safe security-software checks.',
    lead: 'For the PC/Steam version failing to start, closing at launch or during loading, or displaying corrupted graphics. Use the symptom table to choose the next check.',
    summary:
      'Start with the GPU driver versions listed by Capcom: NVIDIA 596.49 or later, or AMD 26.5.1 or later, then restart Windows. Next verify the game files in Steam and compare with recording tools and overlays closed. If a security alert appears, inspect the specific blocked file before considering an exception. Change one thing at a time and retest.',
    quickFacts: [
      driverFact,
      {
        label: 'Minimum requirements',
        value:
          'Windows 11; GTX 1660 (6 GB) or RX 5500 XT (8 GB); 16 GB RAM; SSD required (Steam)',
      },
      { label: 'Default installation folder', value: installDir, copy: true },
      {
        label: 'Prepare for support',
        value:
          'DxDiag.txt, config.ini, the relevant CrashReport ZIP, and steps to reproduce the problem',
      },
    ],
    diagnosis: [
      {
        symptom: 'Will not launch or closes immediately',
        cause: 'Check whether the GPU driver meets Capcom’s listed version',
        stepId: 'driver',
      },
      {
        symptom: 'Crashes after installation or an update',
        cause: 'Missing or damaged files are one possibility',
        stepId: 'verify',
      },
      {
        symptom: 'Unstable while recording or streaming',
        cause: 'Compare without software that hooks game rendering',
        stepId: 'overlay',
      },
      {
        symptom: 'A security alert appears or launch is blocked',
        cause: 'Inspect the alert; do not assume it is a false positive',
        stepId: 'security',
      },
      {
        symptom: 'Will not launch or runs very slowly on a laptop',
        cause: 'Check whether the game is using integrated graphics',
        stepId: 'gpu-select',
      },
      {
        symptom: 'You previously changed compatibility settings',
        cause: 'An executable’s compatibility mode may affect launch',
        stepId: 'compat',
      },
    ],
    steps: [
      {
        id: 'driver',
        title: 'Check the GPU driver requirement and restart',
        summary:
          'Capcom lists NVIDIA GeForce 596.49 or later and AMD Radeon 26.5.1 or later.',
        time: '10–20 minutes',
        risk: 'low',
        actions: [
          'Obtain a compatible driver from NVIDIA or AMD. For a laptop, also check the PC manufacturer’s supported driver.',
          'Check Windows Update and apply available updates appropriate for your PC.',
          'Restart Windows after installation, then launch the game again.',
        ],
        note: 'Capcom emphasizes restarting after the update. If a qualifying version causes problems, compare another version that still meets the requirement. A version number alone does not guarantee stability.',
      },
      {
        id: 'verify',
        title: 'Verify the game files in Steam',
        summary: 'Files can need repair even immediately after installation.',
        time: '5–15 minutes or longer',
        risk: 'low',
        actions: [
          'Close the game and restart the PC.',
          'In Steam → Library, right-click the game → Properties → Installed Files → Verify integrity of game files.',
          'Wait for verification and any downloads to finish, then launch and repeat the situation that failed.',
        ],
        note: 'Some local configuration files may fail verification. A validation message alone does not prove that damaged files caused the crash.',
      },
      {
        id: 'overlay',
        title: 'Compare with recording tools and overlays closed',
        summary:
          'Performance overlays and capture tools can interact with game rendering.',
        time: 'About 2 minutes',
        risk: 'low',
        actions: [
          'Save any recording work, then close capture, streaming and FPS-display tools such as OBS.',
          'Close nonessential, resource-heavy apps such as browser windows after saving your work. Keep antivirus and firewall protection enabled.',
          'Launch through Steam and compare the same scene without those extra apps.',
        ],
      },
      {
        id: 'security',
        title: 'Inspect security alerts before considering an exception',
        summary:
          'Capcom discusses security-software exclusions. Use a narrow, evidence-based check rather than excluding Steam folders automatically.',
        time: 'About 5 minutes',
        risk: 'medium',
        actions: [
          'Open your security software’s protection history and check the exact detection, time and file. Confirm whether it points to the genuine Steam-installed OnimushaWotS.exe.',
          'Verify the game files and consult the security vendor’s guidance. Only consider a narrowly scoped exception for a confirmed false positive; do not exclude the whole game folder, Steam data or an unknown file.',
          'If an exception is justified, record the change and retest. Remove an unnecessary exception if it does not help, and ask Capcom or the security vendor about an unresolved detection.',
        ],
        note: 'Exclusions reduce protection. Do not disable security software to play, restore a quarantined file you cannot verify, or follow a detection warning’s unfamiliar download link.',
      },
      {
        id: 'gpu-select',
        title: 'Select the intended GPU for the game',
        summary:
          'A PC with integrated and dedicated graphics may assign the game to the integrated GPU.',
        time: 'About 3 minutes',
        risk: 'low',
        actions: [
          'Open Windows Settings → System → Display → Graphics.',
          'Select the game. If it is missing, browse to the actual Steam installation and select OnimushaWotS.exe.',
          'Choose the high-performance GPU option available on your PC, save it, and restart the game.',
        ],
        note: 'On a laptop, connect the correct charger and check the manufacturer’s power guidance. Capcom’s guide does not generally guarantee support for mobile or external GPUs.',
      },
      {
        id: 'compat',
        title: 'Turn off a previously enabled compatibility mode',
        summary:
          'Capcom advises disabling compatibility mode when it prevents the game from starting correctly.',
        time: 'About 2 minutes',
        risk: 'low',
        actions: [
          'Right-click OnimushaWotS.exe in the actual installation folder → Properties → Compatibility. Record the current setting.',
          'Clear “Run this program in compatibility mode for” if enabled, apply the change, and test.',
          'If the problem remains, check Steam.exe for the same compatibility setting. Do not add administrator privileges as a blanket fix.',
        ],
      },
    ],
    avoid: [
      'Do not leave antivirus or firewall protection disabled.',
      'Do not use a Windows Insider or other prerelease Windows build as the baseline for troubleshooting; Capcom excludes these from support.',
      'Do not change several things at once. Launch and compare after each change.',
    ],
    cautions: [
      'Keep a separate copy before changing config.ini or moving cache files.',
      'Follow newer official guidance if Capcom changes its requirements.',
    ],
    faqs: [
      {
        question: 'Is Windows 10 supported?',
        answer:
          'Steam lists Windows 11 for both the minimum and recommended requirements. Capcom’s guide says it does not officially provide technical support for PCs below the minimum requirements.',
      },
      {
        question: 'The game remains stuck on a loading screen. What next?',
        answer:
          'Complete the driver update and restart, verify files, and compare without recording tools. If the same loading screen still fails, record the location and time and use the CrashReport guide to prepare a support request.',
      },
      {
        question: 'What if I use Windows N or KN?',
        answer:
          'Capcom notes that these editions may lack media components needed for video playback and points to Microsoft’s Media Feature Pack. Use Microsoft’s instructions for your exact Windows edition rather than downloading a codec pack from an unrelated site.',
      },
    ],
    sources: [sources.capcom, sources.steam],
    related: related(
      'gpu-driver-version',
      'crash-report',
      'shader-cache',
      'black-screen',
    ),
  }),
  make({
    slug: 'crash-report',
    title:
      'Onimusha: Way of the Sword CrashReport Location and Support Checklist',
    shortTitle: titles['crash-report'],
    description:
      'Find the Onimusha PC CrashReport folder, choose the ZIP matching a crash, and prepare DxDiag, graphics settings and reproduction steps safely for Capcom support.',
    lead: 'For finding a report after a PC crash and preparing the information Capcom needs to investigate it.',
    summary:
      'Open the game’s actual installation folder through Steam and look for CrashReport. Capcom says a dated ZIP is produced in most cases, so a report is not guaranteed after every crash. Keep the ZIP closest to the time of the problem. Prepare DxDiag.txt, a copy of config.ini and a concise account of what happened; review files for private information before sharing them.',
    quickFacts: [
      {
        label: 'Default CrashReport folder',
        value: `${installDir}\\CrashReport`,
        copy: true,
      },
      {
        label: 'Report filename',
        value: 'A date/time-based filename in ZIP format',
      },
      {
        label: 'Where to confirm the destination',
        value:
          'The crash-report tool shows the saved location when it finishes',
      },
      {
        label: 'Other useful information',
        value:
          'DxDiag.txt, config.ini, circumstances, reproduction steps and screenshots',
      },
    ],
    diagnosis: [
      {
        symptom: 'Cannot find the CrashReport folder',
        cause: 'The installation may use a different Steam library',
        stepId: 'open',
      },
      {
        symptom: 'Several ZIP files are present',
        cause: 'Match their timestamps to the crash you want investigated',
        stepId: 'choose',
      },
      {
        symptom: 'Unsure what to include in a support request',
        cause:
          'Collect hardware, settings, symptoms, reproduction steps and the report',
        stepId: 'report',
      },
    ],
    steps: [
      {
        id: 'open',
        title: 'Open the actual CrashReport folder',
        summary:
          'Steam’s shortcut works even when the game is installed on another drive.',
        time: 'About 1 minute',
        risk: 'low',
        actions: [
          'In Steam → Library, right-click the game → Manage → Browse local files.',
          'Look for the CrashReport folder inside the opened OnimushaWotS installation folder.',
          'If it is absent, check the saved location shown by the crash-report tool. A report may not have been generated; do not create a substitute file.',
        ],
      },
      {
        id: 'choose',
        title: 'Keep the ZIP that matches the crash time',
        summary:
          'Use the report’s timestamp to distinguish one incident from another.',
        time: 'About 1 minute',
        risk: 'low',
        actions: [
          'Write down the date, time and time zone when the crash occurred.',
          'Copy the ZIP with the closest matching timestamp to a clearly named folder you can find again.',
          'Keep the original ZIP as well, in case support requests it during investigation.',
        ],
      },
      {
        id: 'report',
        title: 'Prepare the information requested by Capcom',
        summary:
          'A clear record is more useful than repeatedly trying unrelated changes.',
        time: 'About 10 minutes',
        risk: 'low',
        actions: [
          'Press Windows + R, run dxdiag, and use Save All Information to create DxDiag.txt. It includes hardware, driver and Windows details; inspect it before sending.',
          'Make a copy of config.ini from the game’s installation folder. Mention any manual edits and retain the original.',
          'Describe when and where it happened, what the character was doing, whether restarting helped, how often it happens, and exact steps that reproduce it.',
          'For display issues, prepare a screenshot. Capcom suggests an unlisted YouTube link for video; first remove private content and remember that anyone with that link can view it. Ask support for its upload method if needed.',
        ],
        note: 'Capcom also asks for the security-software name, monitor model, and HDMI cable brand/model and 4K/HDR capability when relevant. Send diagnostic files only through the intended official support channel, not in a public forum.',
      },
    ],
    avoid: [
      'Do not delete the relevant ZIP just to tidy the folder.',
      'Do not present a manually edited config.ini as unchanged; explain what was modified.',
    ],
    cautions: [
      'Logs and screenshots can reveal usernames, paths and other personal details. Review them before sharing and keep an unmodified original privately. An unlisted video is not private access control.',
    ],
    faqs: [
      {
        question: 'Why was no CrashReport folder created?',
        answer:
          'Capcom says a ZIP is generated in most cases, not all cases. Check the location displayed by the crash tool if it appeared. If no report exists, tell support that and provide the crash time, DxDiag information and reproduction steps instead.',
      },
      {
        question: 'What if Steam or the game is installed on another drive?',
        answer:
          'Use Manage → Browse local files in Steam. It opens the actual game installation, so you do not have to guess a replacement for the default C: path.',
      },
      {
        question: 'What if the video or report is too large to send?',
        answer:
          'Capcom suggests sharing an unlisted YouTube link for videos and contacting support about a separate upload facility for large files. Confirm the destination with official support before uploading logs or other diagnostic data.',
      },
    ],
    sources: [sources.capcom],
    related: related('not-launching', 'gpu-driver-version', 'shader-cache'),
  }),
  make({
    slug: 'low-fps',
    title:
      'Onimusha: Way of the Sword Low FPS and Stuttering: PC Settings to Check',
    shortTitle: titles['low-fps'],
    description:
      'Compare Onimusha PC performance using the Low graphics preset, driver checks, upscaling, frame caps, laptop power and cooling, and recording-app memory use.',
    lead: 'For low frame rates, sudden slowdowns, poor laptop performance, or slowdowns while recording and streaming.',
    summary:
      'Capcom recommends the Low graphics preset when the frame rate is unstable. Record the current settings, lower the preset, and compare the same scene. Check the listed GPU driver requirement, and on a laptop check power and ventilation. Steam’s performance targets use upscaling; they are not a promise that every scene will maintain the target frame rate.',
    quickFacts: [
      {
        label: 'First comparison',
        value: 'Use the Low graphics preset, then raise settings individually',
      },
      {
        label: 'Minimum-spec target',
        value:
          'GTX 1660 / RX 5500 XT: Low, 1080p output with upscaling, 30 FPS (Steam)',
      },
      {
        label: 'Recommended-spec target',
        value:
          'RTX 2060 SUPER / RX 6600: Medium, 1080p output with upscaling, 60 FPS (Steam)',
      },
      {
        label: 'Upscaling',
        value:
          'DLSS needs a supported GeForce RTX GPU; use an available compatible alternative on other GPUs',
      },
      {
        label: 'Frame cap',
        value:
          'Choose a cap your PC can sustain, using the options available in your version',
      },
    ],
    diagnosis: [
      {
        symptom: 'FPS is low throughout the game',
        cause: 'Compare a lower graphics preset',
        stepId: 'step-2',
      },
      {
        symptom: 'The GPU driver has not been updated recently',
        cause: 'Check it against Capcom’s listed requirement',
        stepId: 'step-1',
      },
      {
        symptom: 'A laptop slows down or performance falls over time',
        cause: 'Check power delivery and ventilation',
        stepId: 'step-3',
      },
      {
        symptom: 'FPS stops at a steady number such as 30 or 60',
        cause: 'Check whether the current frame cap matches that number',
        stepId: 'step-4',
      },
      {
        symptom:
          'Lower graphics settings still miss your target, or recording makes performance worse',
        cause: 'Compare GPU preferences and background apps one at a time',
        stepId: 'step-5',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Check the GPU driver version',
        summary: 'Capcom lists NVIDIA 596.49 or later and AMD 26.5.1 or later.',
        time: '10–20 minutes',
        risk: 'low',
        actions: [
          'Press Windows + R, run dxdiag, and record the GPU name and driver version on the Display tab.',
          'Obtain a supported driver from NVIDIA or AMD. On a laptop, check the PC manufacturer’s guidance too.',
          'Restart Windows after installation and compare the same scene at the same settings.',
        ],
      },
      {
        id: 'step-2',
        title: 'Compare the Low graphics preset',
        summary:
          'Capcom’s English troubleshooting guide names the Low graphics preset.',
        time: 'About 5 minutes',
        risk: 'low',
        actions: [
          'In Steam → Settings → In Game, enable the performance monitor. Record resolution, preset, upscaling, frame generation and the frame cap, then note the FPS range after loading settles in the same location and viewpoint. If frame generation is enabled, distinguish the displayed rate including generated frames from the game’s base frame rate.',
          'Open the game’s graphics settings and choose the Low graphics preset. Compare frame rate in the same location.',
          'If it improves, raise resolution and quality options individually. If little changes, do not keep lowering everything: go to step 4 if FPS stops at a fixed number, or step 5 if it remains below your target.',
        ],
      },
      {
        id: 'step-3',
        title: 'Check power delivery and ventilation',
        summary:
          'Power-saving settings and excessive heat can reduce sustained performance.',
        time: 'About 5 minutes',
        risk: 'low',
        actions: [
          'Connect the correct charger and record the old power mode. In Windows 11, use Settings → System → Power & battery → Power mode → Best performance if available, then compare the same scene. If Windows separates Plugged in and On battery settings, change Plugged in while testing with the charger connected. If the option is absent, consult the manufacturer’s power controls or Control Panel → Power Options; change only an available supported setting and restore it if it does not help.',
          'For USB-C charging, check the laptop manual for the correct charging port and required charger and cable capability.',
          'Keep ventilation openings clear and allow space around the PC. A lower frame cap can reduce load; stop testing if the PC overheats or shuts down.',
        ],
      },
      {
        id: 'step-4',
        title: 'Check rendering load and the frame cap separately',
        summary:
          'Upscaling may lower rendering load. A suitable cap may reduce frame-rate swings and heat; lowering it does not raise FPS that is already low.',
        time: 'About 5 minutes',
        risk: 'low',
        actions: [
          'If FPS stops at a fixed number such as 30 or 60, record and compare the in-game frame cap. If FPS is already below the cap, raising the limit alone will not add performance.',
          'On a supported GeForce RTX GPU, compare DLSS if available. A GTX 1660 cannot use DLSS; compare a compatible available option such as FSR. Check text, edges and FPS at the same output resolution, location and viewpoint, changing one option at a time.',
          'Choose a frame cap the PC can usually sustain, slightly below its typical rate. Use 60 FPS only if the PC can consistently reach it.',
          'Restore changes that do not help. If FPS remains below your target, continue to the GPU-preference and background-app checks rather than repeatedly changing limits.',
        ],
        note: 'Steam’s listed performance targets use upscaling. A frame cap does not create performance the hardware cannot deliver.',
      },
      {
        id: 'step-5',
        title: 'Compare background apps and the game’s GPU preference',
        summary:
          'First compare background-app load, then the per-app GPU preference on a multi-GPU PC. The Windows preference screen alone does not prove which GPU the game is actually using.',
        time: 'About 2 minutes',
        risk: 'low',
        actions: [
          'Record memory use in Task Manager and compare with recording or streaming stopped. High memory use alone does not establish a memory shortage.',
          'Save your work and close unneeded recording, streaming and browser apps one at a time, comparing the same scene after each change. Keep security protection enabled. If nothing changes, do not assume background apps are the sole cause.',
          'On a multi-GPU PC, open Windows Settings → System → Display → Graphics and select OnimushaWotS.exe. If missing, use Steam’s Browse local files to locate and add the executable. Record the old preference, choose Options → High performance, restart the game and compare the same scene. Restore the preference if it does not help.',
        ],
        note: 'If the Low preset still does not help, record the GPU, driver, resolution, test scene and each comparison result for Capcom support. Use the CrashReport guide if the game also crashes.',
      },
    ],
    avoid: [
      'Do not change every graphics setting at once; compare one change in the same scene.',
      'Do not keep playing if the PC is abnormally hot or powers itself off.',
    ],
    cautions: [
      'Save screenshots of the original settings before experimenting.',
    ],
    faqs: [
      {
        question: 'Do the recommended requirements guarantee 60 FPS?',
        answer:
          'No. Steam gives a target of 60 FPS at Medium settings and 1080p output using upscaling, and warns that demanding scenes may run more slowly.',
      },
      {
        question: 'Why does streaming make the game slower?',
        answer:
          'Recording and streaming add resource demands. Check Task Manager and compare with capture software closed before buying memory. Steam recommends more RAM as appropriate for simultaneous recording or streaming, but RAM is not the cause of every slowdown.',
      },
      {
        question: 'Can I use a gaming laptop?',
        answer:
          'Capcom’s guide does not generally guarantee support for mobile or external GPUs. If you play on one, check the correct charger, the manufacturer’s power mode and the selected GPU; a similar desktop GPU name does not establish identical performance.',
      },
    ],
    sources: [
      sources.capcom,
      sources.steam,
      sources.pcgw,
      {
        label: 'NVIDIA: DLSS 4 FAQ',
        url: 'https://forums.developer.nvidia.com/t/dlss-4-faq/321939',
      },
      {
        label: 'Steam: In-Game Performance Monitor and frame generation',
        url: 'https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767',
      },
      {
        label: 'Microsoft: Change the power mode for your Windows PC',
        url: 'https://support.microsoft.com/en-us/windows/change-the-power-mode-for-your-windows-pc-c2aff038-22c9-f46d-5ca0-78696fdf2de8',
      },
    ],
    related: related(
      'gpu-driver-version',
      'shader-cache',
      'not-launching',
      'black-screen',
    ),
  }),
  make({
    slug: 'shader-cache',
    title:
      'Onimusha: Way of the Sword shader.cache Location and Safe Rebuild Steps',
    shortTitle: titles['shader-cache'],
    description:
      'Find shader.cache and shader.cache2 beside OnimushaWotS.exe, move only those caches aside, and compare a rebuild without deleting save data or unrelated files.',
    lead: 'For graphics problems or instability after a game or GPU-driver update when you want to compare a fresh shader cache.',
    summary:
      'Capcom identifies shader.cache and shader.cache2 in the folder containing OnimushaWotS.exe as files to remove when troubleshooting instability. Instead of deleting them, first move only the files that exist to a separate backup folder. Launch again and compare after any shader preparation finishes. If neither file exists, skip this step; do not remove other files to compensate.',
    quickFacts: [
      { label: 'Default game folder', value: installDir, copy: true },
      {
        label: 'Files covered by this procedure',
        value: 'shader.cache and shader.cache2 only',
      },
      {
        label: 'If neither file exists',
        value: 'Skip the operation, as Capcom advises',
      },
      {
        label: 'GPU-driver cache',
        value: 'Use the GPU manufacturer’s instructions for its separate cache',
      },
    ],
    diagnosis: [
      {
        symptom: 'Graphics become corrupted or unstable after an update',
        cause: 'Compare freshly generated game shader caches',
        stepId: 'step-2',
      },
      {
        symptom: 'Problems began after a driver update',
        cause:
          'After the game-cache check, consult the GPU vendor about its cache',
        stepId: 'step-4',
      },
      {
        symptom: 'shader.cache is missing',
        cause: 'The specified files may not exist; no deletion is needed',
        stepId: 'step-2',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Open the game folder, then close the game and Steam',
        summary: 'Avoid moving files while the game is using them.',
        time: 'About 1 minute',
        risk: 'low',
        actions: [
          'Use Steam → Library → right-click the game → Manage → Browse local files, and leave that folder open.',
          'Close the game, then exit Steam from its menu.',
        ],
      },
      {
        id: 'step-2',
        title: 'Move only shader.cache and shader.cache2 aside',
        summary:
          'Moving the files keeps a copy available if you need to restore them.',
        time: 'About 1 minute',
        risk: 'medium',
        actions: [
          'Look for shader.cache and shader.cache2 in the same folder as OnimushaWotS.exe.',
          'Create a separate, clearly named backup folder outside the installation and move only the specified files that are present. Record their original location.',
          'If neither exists, skip this operation. Do not remove similarly named files, config.ini, save folders or the whole installation.',
        ],
      },
      {
        id: 'step-3',
        title: 'Launch again and compare the result',
        summary: 'Retest after the game has completed any shader preparation.',
        time: 'Several minutes; varies by PC',
        risk: 'low',
        actions: [
          'Reopen Steam and launch the game.',
          'Allow shader preparation to finish if it runs. Do not confuse a slow preparation stage with an error that closes the game.',
          'Compare the same scene. Keep the backup until the result is clear. To revert, close the game and Steam, move any newly generated files to a different backup folder, and return the originals without blindly overwriting files.',
        ],
      },
      {
        id: 'step-4',
        title: 'Consult the GPU vendor about its separate cache',
        summary:
          'Capcom also mentions clearing shader caches created by the graphics driver.',
        time: 'About 5 minutes, plus regeneration',
        risk: 'medium',
        actions: [
          'Consider this only if rebuilding the specified game caches did not help.',
          'Follow current NVIDIA or AMD instructions for your driver. Do not guess cache paths or delete broad Windows or driver folders.',
          'Restart the PC as directed, launch again, and compare after shader preparation.',
        ],
      },
    ],
    avoid: [
      'Do not delete unrelated files or the entire game folder.',
      'Do not move caches while the game is running.',
    ],
    cautions: [
      'Keep the moved files until you have checked the result. A cache rebuild is a comparison, not proof that corruption caused the problem.',
    ],
    faqs: [
      {
        question: 'Is it safe to remove shader.cache?',
        answer:
          'Capcom recommends removing shader.cache and shader.cache2 when troubleshooting instability. Moving the specific files aside first preserves a copy. After relaunching, allow any shader preparation to finish before comparing the same scene.',
      },
      {
        question: 'What if I cannot find either cache file?',
        answer:
          'Skip the operation. Capcom explicitly says it is unnecessary when the specified files do not exist. Their absence is not a reason to delete other files.',
      },
      {
        question: 'Will this remove my saved game?',
        answer:
          'This procedure moves only the two named shader-cache files. It does not include any save files or Steam userdata folder. If a filename or location is unclear, stop and confirm it rather than moving a whole folder.',
      },
    ],
    sources: [sources.capcom, sources.pcgw],
    related: related(
      'low-fps',
      'not-launching',
      'black-screen',
      'gpu-driver-version',
    ),
  }),
  make({
    slug: 'black-screen',
    title: 'Onimusha: Way of the Sword Black Screen or Flickering on PC',
    shortTitle: titles['black-screen'],
    description:
      'Check Onimusha PC screen mode, resolution, VSync and HDR output, then compare capture software, monitor connections and cable capability without navigating blind.',
    lead: 'For a running game that shows a black screen, flickers, or displays only part of the picture.',
    summary:
      'Capcom recommends checking screen mode, resolution, vertical synchronization and HDR output for display problems. First try to recover a visible picture. Then compare one display setting at a time, close capture tools, and check the monitor and cable. If the menu stays invisible, skip menu-only steps and collect a report rather than guessing where to click.',
    quickFacts: [
      {
        label: 'Display settings to compare',
        value: 'Screen mode, resolution, VSync and HDR output',
      },
      {
        label: 'Display modes',
        value: 'Compare the screen modes available in the installed version',
      },
      {
        label: 'Also check',
        value:
          'Game-capture tools and the monitor/connection’s resolution and HDR capability',
      },
    ],
    diagnosis: [
      {
        symptom: 'The screen is black immediately after launch',
        cause: 'Try to recover a visible window before editing settings',
        stepId: 'step-1',
      },
      {
        symptom: 'Flickering or only part of the picture is visible',
        cause: 'Compare resolution and synchronization settings',
        stepId: 'step-2',
      },
      {
        symptom: 'Black only while recording software is open',
        cause: 'Compare without capture tools or overlays',
        stepId: 'step-3',
      },
      {
        symptom: 'The picture disappears after enabling HDR',
        cause: 'Compare SDR and check the HDR connection',
        stepId: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Try to restore a visible game window',
        summary: 'A visible picture lets you change settings deliberately.',
        time: 'About 1 minute',
        risk: 'low',
        actions: [
          'With the game window selected, press Alt + Enter once as a common PC-game fullscreen/windowed shortcut. It may not work in every mode.',
          'If the picture returns, open the game’s display settings.',
          'If it stays black, do not navigate invisible menus. Skip settings that require a visible menu and continue with the capture/display checks in step 3.',
        ],
      },
      {
        id: 'step-2',
        title: 'Compare screen mode, resolution and VSync',
        summary:
          'Capcom lists these display settings; change them one at a time.',
        time: 'About 3 minutes',
        risk: 'low',
        actions: [
          'Only if the menu is visible, open display settings and take a screenshot of the current values.',
          'First compare borderless or windowed mode if available. Then separately compare the monitor’s native resolution.',
          'Next toggle only VSync and compare. Restore a change that does not help.',
        ],
      },
      {
        id: 'step-3',
        title: 'Compare without capture tools or extra displays',
        summary: 'Software that hooks rendering can affect game stability.',
        time: 'About 3 minutes',
        risk: 'low',
        actions: [
          'Save any recording, close tools such as OBS, and launch the game again.',
          'With Windows visible, use Windows + P to select only the display you intend to use, then compare. Record the old arrangement first.',
          'Separately compare with the Steam overlay disabled. Restore it and the display arrangement if they make no difference.',
        ],
      },
      {
        id: 'step-4',
        title: 'Compare SDR and check the monitor connection',
        summary:
          'If HDR triggers the problem, establish whether the picture works without it.',
        time: 'About 5 minutes',
        risk: 'low',
        actions: [
          'If the game menu is visible, turn off HDR Mode and compare. If it is not visible, close the game and use Windows Settings → System → Display → HDR to turn HDR off for that display before relaunching.',
          'Check the monitor manual for supported inputs, resolutions and refresh rates, including any HDR input setting.',
          'Check whether the cable and connection support the resolution, refresh rate and HDR combination you want. Do not assume every HDMI cable or port supports the same signal.',
        ],
        note: 'Once the picture is stable, use the HDR guide to re-enable and adjust HDR one stage at a time. If Windows itself is also black, treat that as a separate display problem.',
      },
    ],
    avoid: [
      'Do not navigate invisible menus by guesswork.',
      'Do not change several display settings simultaneously.',
    ],
    cautions: [
      'Record the old settings and restore changes that do not improve the picture.',
    ],
    faqs: [
      {
        question:
          'Why does the screen go black when recording software is open?',
        answer:
          'Capcom notes that capture tools and performance overlays can interfere with rendering. Close the recording software and compare the same launch before changing display settings. Improvement is evidence for further comparison, not proof that every capture tool is incompatible.',
      },
      {
        question: 'Can the HDMI cable affect the picture?',
        answer:
          'Yes. Capcom asks for the cable brand/model and 4K/HDR capability when investigating display issues. Check the complete monitor, port and cable combination against the signal you are using.',
      },
      {
        question: 'Does the game support an ultrawide monitor?',
        answer:
          'Check the resolution and aspect-ratio options exposed by your installed version. We have not independently verified every ultrawide aspect ratio. Side bars alone do not establish a launch failure; compare a standard supported resolution and include the monitor model in a support request.',
      },
    ],
    sources: [sources.capcom, sources.pcgw],
    related: related('hdr', 'not-launching', 'low-fps', 'shader-cache'),
  }),
  make({
    slug: 'hdr',
    title:
      'Onimusha: Way of the Sword HDR Settings: Washed-Out Colors or HDR Unavailable',
    shortTitle: titles.hdr,
    description:
      'Check Windows and monitor HDR support, enable game HDR separately, adjust brightness carefully, and troubleshoot washed-out colors, bright UI or a missing picture.',
    lead: 'For HDR that cannot be enabled, looks washed out or too dark, makes the interface too bright, or causes an unstable picture.',
    summary:
      'Steam lists HDR support. Check the monitor and Windows HDR settings first, then enable the game’s HDR output separately. If the game exposes separate controls, adjust peak brightness to the display’s capability before overall brightness. If HDR causes a black screen, return to SDR and check the connection before continuing calibration.',
    quickFacts: [
      { label: 'HDR support', value: 'Listed on the Steam store page' },
      {
        label: 'In-game adjustments',
        value:
          'Use the brightness and color controls actually available in your version; adjust them separately',
      },
      {
        label: 'Start in Windows',
        value: 'Settings → System → Display → select the display → HDR',
      },
      {
        label: 'Windows calibration',
        value: 'Microsoft’s Windows HDR Calibration app for Windows 11',
      },
    ],
    diagnosis: [
      {
        symptom: 'HDR cannot be selected in the game',
        cause: 'Check Windows HDR availability and the monitor/input setup',
        stepId: 'step-1',
      },
      {
        symptom: 'Colors look washed out or blacks look gray',
        cause: 'Compare peak and overall brightness before saturation',
        stepId: 'step-3',
      },
      {
        symptom: 'Only the UI or subtitles are too bright',
        cause: 'Compare the separate UI-brightness setting if available',
        stepId: 'step-3',
      },
      {
        symptom: 'HDR causes flickering or no picture',
        cause: 'Check the monitor input and cable’s supported signal',
        stepId: 'step-5',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Check HDR on the monitor and in Windows',
        summary: 'Establish Windows HDR output before changing the game.',
        time: 'About 2 minutes',
        risk: 'low',
        actions: [
          'Open Windows Settings → System → Display and select the monitor used for the game.',
          'Open HDR and enable Use HDR if supported. If the option is missing or unavailable, check display capabilities, connection mode and driver support; the missing switch alone does not prove the monitor lacks HDR.',
          'Check the monitor manual and on-screen menu for an HDR-capable input and any required input setting.',
        ],
      },
      {
        id: 'step-2',
        title: 'Enable the game’s HDR output separately',
        summary:
          'Do not change Windows and game HDR settings at the same time.',
        time: 'About 1 minute',
        risk: 'low',
        actions: [
          'Open the game’s display options and record the current values.',
          'Enable HDR Mode and apply it. If the picture becomes unstable, return to the previous setting before adjusting brightness.',
        ],
      },
      {
        id: 'step-3',
        title: 'Adjust peak brightness before overall brightness',
        summary:
          'Use the display’s capability and the calibration pattern, rather than copying another monitor’s numbers.',
        time: 'About 5 minutes',
        risk: 'low',
        actions: [
          'Start with the peak-brightness control if available. Follow its test pattern and the monitor’s HDR specifications; avoid losing bright detail.',
          'Next adjust overall brightness while comparing the same dark scene.',
          'Adjust saturation only if needed, and use a separate UI-brightness control, if available, for an overly bright interface or subtitles. Labels and available controls may vary by version.',
        ],
      },
      {
        id: 'step-4',
        title: 'Use Windows HDR Calibration if needed',
        summary:
          'The Windows 11 app creates a color profile for the selected HDR display.',
        time: 'About 5 minutes',
        risk: 'low',
        actions: [
          'Obtain Windows HDR Calibration from Microsoft Store using Microsoft’s linked instructions.',
          'With HDR enabled on the intended display, follow the dark/bright test patterns and color-saturation adjustment, then save the profile.',
          'Restart the game and compare the same scene before revisiting the in-game brightness settings.',
        ],
      },
      {
        id: 'step-5',
        title: 'Check the cable and HDR-capable monitor input',
        summary:
          'If HDR removes the picture, diagnose the connection before calibration.',
        time: 'About 3 minutes',
        risk: 'low',
        actions: [
          'Check the HDMI cable’s model and support for the intended 4K/HDR signal; Capcom includes these details in its support checklist.',
          'Read the monitor manual for the input ports and settings that support HDR at your chosen resolution and refresh rate.',
          'If the problem remains, use SDR for now. If the game menu is invisible, close the game and turn off HDR in Windows for that display before relaunching.',
        ],
      },
    ],
    avoid: [
      'Do not change Windows and game HDR settings simultaneously.',
      'Do not change all brightness controls together. Compare peak brightness, then overall brightness, one at a time.',
    ],
    cautions: [
      'HDR appearance depends heavily on the display. Use its manual and calibration pattern; there is no universal brightness value for every monitor.',
    ],
    faqs: [
      {
        question: 'Why does the whole game look washed out in HDR?',
        answer:
          'A mismatch in the HDR output chain or brightness settings can contribute. Confirm Windows and game HDR first, then compare peak and overall brightness. If needed, use Windows HDR Calibration. Do not assume one brightness value fixes every display.',
      },
      {
        question:
          'Only the interface or subtitles are too bright. What should I change?',
        answer:
          'If your version exposes a separate UI-brightness control, lower it before changing the brightness of the whole scene. Do not assume another version’s setting names or a different monitor’s values apply.',
      },
      {
        question: 'What if the screen goes black after enabling HDR?',
        answer:
          'Restore SDR using the visible game menu or Windows HDR settings, then check the monitor, input and cable. Follow the black-screen guide rather than trying to navigate an invisible calibration screen.',
      },
    ],
    sources: [
      sources.steam,
      sources.pcgw,
      sources.capcom,
      sources.msHdr,
      sources.msCalibration,
    ],
    related: related('black-screen', 'low-fps', 'not-launching'),
  }),
  make({
    slug: 'gpu-driver-version',
    title:
      'Onimusha: Way of the Sword GPU Drivers: NVIDIA 596.49 and AMD 26.5.1 Requirements',
    shortTitle: titles['gpu-driver-version'],
    description:
      'Check Onimusha PC driver requirements, read NVIDIA and AMD version numbers, restart after updating, and compare supported versions before considering advanced cleanup.',
    lead: 'For checking the required NVIDIA or AMD driver, finding your installed version, and deciding what to try when updating does not resolve a problem.',
    summary:
      'Capcom’s guide lists NVIDIA GeForce 596.49 or later and AMD Radeon 26.5.1 or later. Restart Windows after updating. If problems persist on a qualifying version, compare another supported version and only then consider the manufacturer’s clean-install procedure. Third-party driver cleanup is an advanced option, not a required first step.',
    quickFacts: [
      driverFact,
      {
        label: 'After updating',
        value: 'Restart Windows before testing the game',
      },
      {
        label: 'NVIDIA dxdiag example',
        value:
          '32.0.15.9649 corresponds to 596.49 (the final five digits are 59649)',
      },
      {
        label: 'Intel GPUs',
        value:
          'The linked Capcom guide lists version requirements for NVIDIA and AMD only',
      },
    ],
    diagnosis: [
      {
        symptom: 'The installed driver version is unclear',
        cause: 'Windows and vendor version formats differ',
        stepId: 'step-1',
      },
      {
        symptom: 'The driver is older than the listed requirement',
        cause: 'Check for a compatible update from the vendor',
        stepId: 'step-2',
      },
      {
        symptom: 'Updating did not change the problem',
        cause: 'Restart and compare without recording tools first',
        stepId: 'step-3',
      },
      {
        symptom: 'A qualifying driver still has problems',
        cause: 'Compare another supported version before advanced cleanup',
        stepId: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Record the GPU and installed driver version',
        summary:
          'Use dxdiag and the GPU vendor’s app to avoid comparing different numbering formats.',
        time: 'About 2 minutes',
        risk: 'low',
        actions: [
          'Press Windows + R, run dxdiag, and record the GPU name and driver version on the Display tab for the GPU used by the game.',
          'For NVIDIA, 32.0.15.9649 is an example of the Windows format corresponding to 596.49. Confirm the release version in NVIDIA Control Panel → Help → System Information if uncertain.',
          'For AMD, check the release version in AMD Software. Do not apply the NVIDIA digit-conversion example to an AMD driver number.',
        ],
      },
      {
        id: 'step-2',
        title: 'Get a compatible driver from the manufacturer',
        summary:
          'Use NVIDIA, AMD or the PC manufacturer’s official support channel.',
        time: '10–20 minutes',
        risk: 'low',
        actions: [
          'Obtain a driver matching your GPU and Windows version from NVIDIA or AMD. For a laptop, check the PC manufacturer’s supported package too.',
          'Save your work and install it using the manufacturer’s instructions.',
          'Check Windows Update for applicable updates as well.',
        ],
      },
      {
        id: 'step-3',
        title: 'Restart Windows and repeat the same test',
        summary: 'Capcom emphasizes restarting after a driver update.',
        time: 'About 5 minutes',
        risk: 'low',
        actions: [
          'Restart Windows after installation finishes.',
          'Close nonessential recording and streaming apps, keep security protection enabled, and launch through Steam to repeat the same scene.',
          'Record the driver versions before and after the update, along with whether the symptom changed.',
        ],
      },
      {
        id: 'step-4',
        title: 'Compare supported versions before advanced cleanup',
        summary:
          'Capcom discusses alternate qualifying drivers and clean installation when an update does not help.',
        time: '20–30 minutes or longer',
        risk: 'high',
        actions: [
          'If needed, compare another official driver that still meets the listed requirement: NVIDIA 596.49 or later, or AMD 26.5.1 or later. Keep a known supported installer available.',
          'If problems persist, consult the manufacturer’s clean-install instructions first. Capcom mentions the third-party Display Driver Uninstaller (DDU), but it removes drivers and can change display behavior. Read its original documentation, plan recovery and create a restore point before considering it; ask for help if unsure.',
          'After reinstalling, restart and retest. If following Capcom’s additional DirectX runtime step, obtain the end-user runtime from Microsoft and restart as directed; do not download individual DLL files from third-party sites.',
        ],
        note: 'A restore point does not replace a file backup. DDU is not made by Capcom, NVIDIA or AMD and is not necessary for every driver update. Do not begin cleanup without a way to restore a compatible display driver.',
      },
    ],
    avoid: [
      'Do not obtain GPU drivers or individual DirectX DLLs from unofficial download sites.',
      'Do not skip the restart after updating.',
    ],
    cautions: [
      'On a laptop, check the PC manufacturer’s driver guidance. Follow newer Capcom requirements if the official guide changes.',
    ],
    faqs: [
      {
        question: 'Why does dxdiag not show a number like 596.49?',
        answer:
          'Windows may show an NVIDIA driver as 32.0.15.9649; the final five digits in that example correspond to 596.49. The vendor app is a useful cross-check. AMD uses a different version mapping, so read the release version in AMD Software.',
      },
      {
        question: 'Which Intel Arc driver is required?',
        answer:
          'The linked Capcom guide specifies NVIDIA and AMD versions, not an Intel minimum. Check Intel or your PC manufacturer for a supported driver and ask Capcom about your configuration. Installing the newest Intel driver alone does not establish official game support.',
      },
      {
        question: 'Can I use a driver older than the latest release?',
        answer:
          'Capcom suggests comparing another version when a driver meeting the requirement still causes problems. Stay within the listed minimum versions and use official installers; “newest” and “most stable on this PC” are not always the same.',
      },
    ],
    sources: [
      sources.capcom,
      {
        label: 'NVIDIA: Driver FAQ and version numbers',
        url: 'https://www.nvidia.com/en-gb/drivers/drivers-faq/',
      },
    ],
    related: related(
      'not-launching',
      'low-fps',
      'black-screen',
      'crash-report',
    ),
  }),
];
