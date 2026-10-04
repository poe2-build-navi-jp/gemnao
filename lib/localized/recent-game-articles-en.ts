import type { LocalizedArticle } from './types';

// Source-aligned English editions. Step IDs match the Japanese articles.
export const recentGameArticlesEn: LocalizedArticle[] = [
  {
    locale: 'en',
    gameSlug: 'monster-hunter-wilds',
    slug: 'not-launching',
    checkedAt: '2026-10-04',
    title:
      'Monster Hunter Wilds Crashing on PC: Launch, Hunting and Shader-Preparation Checks',
    shortTitle: 'Crashing or not launching',
    description:
      'Check launch, loading, hunting and shader-preparation crashes using Capcom’s guidance. Includes one clearly labeled user-reported recovery after pausing third-party Steam extensions, not a proven single cause.',
    lead: 'For the PC/Steam retail version closing at launch, during loading, while hunting or during shader preparation. Distinguish a game closing without an error from the whole PC restarting. Do not apply Steam or Windows file operations to PS5 or Xbox.',
    summary:
      'Record the time, scene and complete error first. After an update or mod installation, test without mods. For launch or repeatable loading crashes, verify Steam files. For crashes during hunts, check GPU drivers and graphics settings. The high-resolution texture pack requires at least 16 GB of VRAM. Change one thing at a time and repeat the scene that crashed. The Steam-extension case below is one report received on October 3, 2026 (Japan time); it does not establish a single cause or a success rate.',
    sourcePolicy:
      'The general checks summarize Capcom, Steam and Microsoft guidance in our own words. The Steam-extension recovery is one anonymous user report, with developer documentation used to understand file roles. It is not a publisher-endorsed fix or proof of a particular DLL causing the crash. Follow newer official guidance when it changes.',
    quickFacts: [
      {
        label: 'Record first',
        value:
          'Time; launch/loading/hunting/shader preparation; full error text; recent updates',
      },
      {
        label: 'High-resolution texture pack',
        value:
          'At least 16 GB VRAM required. Simply having it installed can cause instability below the requirement (Capcom).',
      },
      {
        label: 'Open the game folder',
        value:
          'Steam → Library → right-click the game → Manage → Browse local files',
      },
      {
        label: 'Crash records',
        value: 'CrashReport inside the game folder; it may not be generated',
      },
    ],
    diagnosis: [
      {
        symptom: 'Cutscenes alone fail to play on Windows N/KN',
        cause:
          'Check the edition and installed media features; skip installation on non-N editions or if already installed',
        stepId: 'media-playback',
      },
      {
        symptom:
          'Still closes before the title screen after file and driver checks; Steam has third-party extensions',
        cause:
          'Separately from game mods, inspect extra modules actually loaded into Steam, read-only first',
        stepId: 'steam-client-check',
      },
      {
        symptom: 'Crashes began after an update or mod installation',
        cause:
          'Compare without mods and tools that hook rendering; then check files if unchanged',
        stepId: 'remove-mods',
      },
      {
        symptom: 'Closes at launch or during the same loading screen',
        cause:
          'Verify files; if no replacement or no improvement, check drivers and crash history',
        stepId: 'verify-files',
      },
      {
        symptom: 'Crashes while hunting, or shows a GPU/DirectX error',
        cause:
          'Compare driver versions; a newer driver is not always more stable',
        stepId: 'update-driver',
      },
      {
        symptom:
          'Crashes after installing high-resolution textures, or reports video-memory shortage',
        cause:
          'Check dedicated VRAM and the DLC; do not add shared memory to reach 16 GB',
        stepId: 'check-vram',
      },
      {
        symptom: 'Crashes after changing graphics or display settings',
        cause:
          'Back up and move config.ini, then compare with newly generated settings',
        stepId: 'reset-config',
      },
      {
        symptom: 'Crashes during shader preparation',
        cause:
          'Regenerate only the specified caches that exist; persistent VRAM errors may need manufacturer support',
        stepId: 'shader-crash',
      },
      {
        symptom: 'Crashes after a long hunt',
        cause:
          'Compare graphics and frame caps under the same conditions; whole-PC failures need a separate check',
        stepId: 'compare-load',
      },
      {
        symptom: 'Closes without an error, or nothing helps',
        cause:
          'Match Windows history and CrashReport by time and prepare a support record',
        stepId: 'crash-record',
      },
      {
        symptom: 'A security or blocking notice appears at launch',
        cause:
          'Check the affected file in protection history; do not disable security wholesale',
        stepId: 'security',
      },
      {
        symptom: 'The game may be using integrated graphics',
        cause: 'Check executable-specific GPU assignment on a multi-GPU PC',
        stepId: 'gpu-select',
      },
    ],
    steps: [
      {
        id: 'remove-mods',
        title: 'After an update, compare without mods and overlays',
        summary:
          'Verifying files alone can leave manually added mod files behind.',
        time: 'About 5–10 minutes',
        risk: 'medium',
        actions: [
          'Close the game. In Steam, use Manage → Browse local files to open its actual installation. Check the original mod file list or manager history.',
          'Disable or undeploy mods through their manager. For manual installations, move only files you can confirm you added outside the game folder, and record their original locations.',
          'Temporarily close ReShade, recording and performance-display tools that hook rendering, then launch through Steam.',
          'Compare the same save and loading destination. If it improves, restore mods individually; wait for a compatible version of any mod that brings the crash back. If unchanged, verify files next.',
        ],
        note: 'Do not delete DLLs based on their names alone. If you cannot identify what was installed, check the installation method in the related mod guide (Japanese).',
      },
      {
        id: 'verify-files',
        title: 'Check file replacement and crash improvement separately',
        summary:
          'Repairing missing or damaged files does not by itself prove the crash is fixed.',
        time: 'Several to tens of minutes',
        risk: 'low',
        actions: [
          'Close the game and restart the PC. In Steam → Library, right-click Monster Hunter Wilds → Properties → Installed Files → Verify integrity of game files.',
          'If files are reacquired, wait for the Downloads view to show the work is complete before launching.',
          'If the same load or hunt now works, keep that state for the moment. If no files were reacquired, or crashes continue after replacement, check drivers and crash records.',
          'If the same files are reacquired repeatedly and the crash returns every launch, check protection history and errors on the storage drive rather than repeating verification indefinitely.',
        ],
        note: 'Some local configuration files can fail verification. Reacquired files do not prove this was the cause, and no reacquisition does not prove the PC is healthy.',
      },
      {
        id: 'update-driver',
        title:
          'Record the GPU driver version and compare an update or rollback',
        summary:
          'Investigate both outdated drivers and compatibility changes after an update.',
        time: 'About 10–20 minutes',
        risk: 'medium',
        actions: [
          'Press Windows + R, run dxdiag, and record the GPU name and driver version on the Display tab. For a laptop, also check the PC manufacturer’s supported driver.',
          'Check Drivers in the NVIDIA app or updates in AMD Software for an appropriate version. Compare the conditions in the driver notice linked from Capcom’s troubleshooting guide.',
          'Restart Windows after updating and retest without mods, using the same graphics settings and scene. Shader preparation immediately after a driver update may take time.',
          'If problems began after updating, confirm supported versions and the restore procedure with the GPU or PC manufacturer before comparing a previously working version. See the related GPU-driver guide (Japanese) for installing or reverting. If unchanged, check DLC, graphics settings and records.',
        ],
        note: 'The driver notice checked on October 4, 2026 warns about issues with 25.10.2 or later on some Radeon models, including RX 5500 XT and RX 7800 XT. Newer does not always mean more stable: compare your model and installed version with the latest notice. No older driver version is a permanent recommendation. Removing drivers with DDU or changing BIOS settings should not be the first step for every crash.',
      },
      {
        id: 'check-vram',
        title: 'Check dedicated VRAM and the high-resolution texture DLC',
        summary:
          'Capcom lists at least 16 GB VRAM as a requirement for the high-resolution texture pack.',
        time: 'About 3–5 minutes',
        risk: 'low',
        actions: [
          'Press Ctrl + Shift + Esc → Task Manager → Performance → the GPU used by the game. Read Dedicated GPU memory capacity. Shared GPU memory borrows system RAM; it is not extra dedicated VRAM.',
          'Close the game. In Steam → game Properties → DLC, untick the Monster Hunter Wilds high-resolution texture pack, then restart Steam.',
          'If the game opens, set the graphics preset under Options → GRAPHICS to Medium or Low and compare the same scene.',
          'If removing the DLC helps, keep that state and restore settings one at a time. If shader preparation still repeatedly reports insufficient VRAM without the DLC, continue to the shader-preparation check.',
        ],
        note: 'Having 16 GB or more VRAM does not guarantee freedom from crashes. An error message alone does not establish a memory shortage or faulty GPU.',
      },
      {
        id: 'reset-config',
        title: 'Move only config.ini to recreate display settings',
        summary:
          'Use this comparison if graphics changes prevent launch. There is no need to delete saves.',
        time: 'About 3 minutes',
        risk: 'medium',
        actions: [
          'Close the game and use Steam → Manage → Browse local files to open the folder containing MonsterHunterWilds.exe.',
          'Back up config.ini, then move it outside the folder. If it is absent, do not guess and move another file; continue to checking records.',
          'Launch and test the same scene with fresh settings. If it helps, adjust settings individually in-game rather than restoring the entire old file.',
          'To revert if it does not help, close the game, keep the newly generated config.ini separately under another name, and return the original backed-up config.ini to its original location.',
        ],
      },
      {
        id: 'shader-crash',
        title:
          'During shader preparation, check the error and whether caches exist',
        summary:
          'Try regeneration only when the specified files exist. A VRAM error does not establish a faulty CPU.',
        time: 'Regeneration time varies',
        risk: 'medium',
        actions: [
          'Record the time and full error, then close the game. First complete file verification, driver checks and a comparison without the high-resolution DLC.',
          'Open Steam → Manage → Browse local files. If the officially specified shader.cache and shader.cache2 exist, move them outside the game folder and relaunch. Skip this operation if neither exists.',
          'If shaders regenerate, wait for completion. Slow preparation and an error that closes the game are different outcomes. Once complete, compare the loading destination that previously crashed.',
          'For persistent insufficient-VRAM errors during shader preparation, Capcom also advises contacting Intel or the company that sold you the PC. Prepare the CPU model, error and steps tried, and ask whether BIOS action or inspection is needed.',
        ],
        note: 'You can read the CPU model under Processor in msinfo32 (Windows + R). Do not improvise BIOS voltage changes because the problem persists.',
      },
      {
        id: 'compare-load',
        title:
          'Compare long-session crashes with the same hunt, settings and duration',
        summary:
          'Changing several settings together makes it hard to tell which change mattered.',
        time: 'Use the previous time to crash as a reference',
        risk: 'low',
        actions: [
          'Example record: “same quest; game closes after about 20 minutes; no mods; High preset.” This illustrates a comparison, not an editorial measurement.',
          'Set Options → GRAPHICS to the Low preset and compare the same quest. If unchanged, restore it and next lower only the frame cap. A 60 fps cap is an example, not a guaranteed stable setting.',
          'If you pass the previous crash point for a similar duration, record “no recurrence this time.” A single successful run does not prove a complete fix; check the same conditions in normal play again.',
          'A PC restart, power loss or blue screen is different from the game alone closing. Use the related whole-PC shutdown or blue-screen guides (Japanese).',
        ],
      },
      {
        id: 'security',
        title: 'Check whether security software blocked the launch',
        summary:
          'Match the affected file and time before deciding what to do next.',
        time: 'About 3 minutes',
        risk: 'low',
        actions: [
          'Open Windows Security → Virus & threat protection → Protection history, and look for an entry matching the crash or failed launch. For another security product, check its detection history.',
          'Check whether the target is a game file obtained from official Steam distribution. Do not assume a detection involving a mod or unknown DLL is a false positive against the game.',
          'If there is a relevant detection, ask the security-software provider about the threat name and target. Without a relevant record, check crash history rather than adding exclusions.',
        ],
      },
      {
        id: 'gpu-select',
        title: 'On a multi-GPU PC, check which GPU runs the game',
        summary: 'For PCs with both integrated and dedicated graphics.',
        time: 'About 3 minutes',
        risk: 'low',
        actions: [
          'In Windows Settings → System → Display → Graphics, choose MonsterHunterWilds.exe. If absent, add the executable from the actual installation folder.',
          'Under Options, check the GPU named for High performance, save and restart the game.',
          'If unchanged, continue to the records. To revert, choose Let Windows decide in the same place.',
        ],
        note: 'Changing the GPU assignment does not establish that the PC meets the official requirements, or guarantee support for a mobile or external GPU.',
      },
      {
        id: 'crash-record',
        title:
          'Keep Windows history and CrashReport even without an error message',
        summary:
          'Do not assume a component has failed based on one error name alone.',
        time: 'About 5 minutes',
        risk: 'low',
        actions: [
          'Search Windows for View reliability history and inspect the application failure at the crash date and time. If absent, run eventvwr.msc with Windows + R and check Windows Logs → Application around the same time.',
          'Record the application name, faulting module and exception code. No matching record does not prove that a crash did not happen.',
          'Open Steam → Manage → Browse local files → CrashReport. Keep the ZIP nearest the event time and any crash-report screen number. If there is no folder, retain an error screenshot and reproduction steps.',
          'Run dxdiag → Save All Information. Prepare DxDiag.txt, a copy of config.ini, the scene, mod status, driver version, attempted steps and results for official support.',
        ],
        note: 'Logs and DxDiag can contain PC names, usernames and paths. Do not post them in full on social media; follow the official support channel’s instructions.',
      },
      {
        id: 'steam-client-check',
        title:
          'If standard checks fail, inspect third-party extensions in Steam itself',
        summary:
          'Third-party DLLs can remain loaded in Steam even when the game has no mods and Steam Overlay is off. This is an additional check when you recognize such an installation.',
        time: 'About 5–10 minutes',
        risk: 'low',
        actions: [
          'One recovery report, October 3, 2026 (Japan time): the Steam version on a Windows PC closed before the title screen, preventing play. The user reported no game mods or ReShade.',
          'In that case, closing OBS, switching Steam Overlay off, successful game-file verification, confirming no administrator or compatibility-mode override, and installing an official NVIDIA driver followed by a restart did not help. This does not predict the same result for everyone.',
          'Before any change, a read-only check found OpenSteamTool.dll (which had the Hidden attribute), cloud_redirect.dll and dwmapi.dll loaded into Steam’s own process from the Steam installation root. The check did not establish that those DLLs were loaded into the game process.',
          'On your PC, locate the running Steam executable through Task Manager. This is different from the game folder opened by Browse local files. Do not act merely because filenames look similar.',
          'For a read-only check, run the following in 64-bit PowerShell: Get-Process -Name steam -Module | Where-Object { $_.ModuleName -in @("OpenSteamTool.dll", "cloud_redirect.dll", "dwmapi.dll", "xinput1_4.dll") } | Select-Object ModuleName,FileName . Compare full load paths, not names alone. Checking these four names cannot rule out all other additions. Windows DLLs with the same names loaded from System32 are outside the scope of this check. If access is denied, output is empty or Steam is closed, record “unverified”; do not declare it safe or delete files.',
        ],
        note: 'Do not combine exception codes from different records as one failure, or infer a fault or cause solely from a code or CPU model. Redact personal folder names before sharing output publicly.',
        guideLink: {
          href: '/en/guide/pc-game-crash#steam-client-case',
          label: 'Separate Steam-client extensions from game mods',
          description: 'What was verified, and when to stop making changes.',
        },
      },
      {
        id: 'steam-client-isolation',
        title:
          'Only after identifying an added loader, preserve data before temporarily pausing it',
        summary:
          'In the case above, the user reported being able to play after two Steam-side loader files were temporarily disabled in a reversible way. This was not an experiment isolating one causal DLL.',
        time: 'Depends on storage locations and backup size',
        risk: 'high',
        actions: [
          'This applies only to files directly inside the Steam installation that you can identify as loaders for third-party extensions you installed. Stop if you do not recognize them or do not know their source or how to restore them. Record the names and load paths and ask for help.',
          'Close the game and Steam. Copy identifiable local Steam settings, the target game’s saves and extension settings elsewhere and compare file counts and sizes. The reported case also compared hashes with the originals, but this did not guarantee every save on or outside the PC was covered.',
          'With a save-redirecting extension such as cloud_redirect.dll, Steam’s userdata alone may not be sufficient. Check external cloud storage, other drives, custom save destinations and restoration methods. Do not proceed until important saves are preserved.',
          'In this case, with Steam and the game closed, only dwmapi.dll and xinput1_4.dll in the Steam root, confirmed as added loaders, were temporarily disabled by recording their original paths and names, retaining copies and adding a unique .disabled suffix. Nothing was deleted; Windows System32 and saves were not modified.',
          'Restart Steam and inspect load paths again. In this case, OpenSteamTool.dll and cloud_redirect.dll no longer appeared in the loaded-module list, and same-named Windows DLLs were confirmed as coming from System32. The user then reported launching the target game and being able to play. File existence and actual module loading are different checks.',
          'Check only the target game first. If a cloud conflict appears, saves are missing or the sync destination differs, stop without saving or overwriting. If it works, keep the working state; do not re-enable extensions to provoke a recurrence or prove causality. If the crash returns or never improves, share your results and a record of the changes with official support.',
          'If restoration is needed, close the game and Steam and restore only the relevant files to the recorded original names and paths. Stop rather than overwrite if a new file already has that name. For unknown or questionable additions, verify the source or ask support before re-enabling them.',
        ],
        note: 'This single case suggests that a Steam-client extension may have contributed to the crash. Two loaders were temporarily disabled together; it does not prove a specific DLL was the cause, that other PCs will recover, or that long-term stability was verified. These steps do not recommend installing an extension or bypassing entitlement checks.',
      },
      {
        id: 'media-playback',
        title: 'Cutscenes only: check media features on Windows N',
        summary:
          'Item 7 of Capcom’s guide concerns video playback. Missing media components are not a diagnosis for every crash.',
        time: 'About 5–10 minutes, excluding installation and restart',
        risk: 'low',
        actions: [
          'Use Windows + R → winver to check the edition. On a non-N edition, or if Media Feature Pack is already installed, skip installation and return to file/display checks. For older KN editions, consult Microsoft’s version-specific list first.',
          'Windows 11 N: Settings → Apps → Optional features → View features beside Add an optional feature. Windows 10 N (1909 or later): Settings → Apps → Apps & features → Optional features → Add a feature. Search Settings for Optional features if its location differs.',
          'Only on a supported N edition without the pack, add Media Feature Pack and retest the same cutscene after any required restart. If it is unavailable, consult Microsoft’s edition list; do not install a pack for another OS or a random codec bundle.',
          'If unchanged, record the scene, Windows edition and whether the pack is installed, then return to file verification or display checks. If the whole game closes, inspect crash records.',
        ],
        note: 'The Capcom post dates from February 2025. October 4, 2026 is our source-check date, not the start of a new incident. We have not verified playback recovery on a gaming PC.',
      },
    ],
    avoid: [
      'Confusing the Steam root with Windows System32, deleting DLLs in bulk, or disabling security features',
      'Assuming a cause and deleting entire save or game folders',
      'Obtaining supposedly missing DLLs from unrelated download sites',
      'Changing mods, graphics, drivers and BIOS settings together',
    ],
    cautions: [
      'Copy saves elsewhere before working and retain config.ini too. Saves and settings have different locations; consult the related save-location guide (Japanese).',
      'This is for the PC/Steam retail version. Compare the date of official notices with your game version because guidance can change with updates.',
    ],
    faqs: [
      {
        question: 'What if Wilds closes without an error?',
        answer:
          'Record the time and inspect Reliability Monitor and Event Viewer’s Application log. Keep a matching CrashReport ZIP if one exists in the game folder. Use the symptom table to distinguish launch, loading and hunting crashes.',
      },
      {
        question: 'Why does it crash only after an update?',
        answer:
          'Mods, rendering tools, drivers and game-side update bugs are possible candidates. Compare the same scene without mods, then check files, the driver version and records. Timing alone cannot identify one cause.',
      },
      {
        question:
          'Can an 8 GB or 12 GB GPU use the high-resolution texture pack?',
        answer:
          'Capcom lists at least 16 GB VRAM as required. Below that, even having the DLC installed can cause instability; disable it in Steam Properties → DLC and compare. Shared GPU memory does not count toward dedicated VRAM.',
      },
      {
        question:
          'Does insufficient VRAM during shader preparation prove CPU failure?',
        answer:
          'No. Check the DLC, drivers and game files first, then regenerate only the specified caches if they exist. If the same error persists, Capcom also advises contacting Intel or the company that sold you the PC.',
      },
      {
        question: 'Can I use these steps on PS5 or Xbox?',
        answer:
          'Steam verification, config.ini and Windows history are PC-only. On a console, check game and system updates and give the relevant official support team the scene and error. Do not apply PC file operations.',
      },
    ],
    related: [
      {
        href: '/en/guide/pc-game-crash',
        label: 'PC game crash troubleshooting',
      },
      {
        href: '/en/gear/save-backup-storage-guide',
        label: 'Choose a save-backup destination',
      },
      {
        href: '/games/monster-hunter-wilds/save-data',
        label: 'Wilds save locations (Japanese)',
      },
      {
        href: '/games/monster-hunter-wilds/config-file',
        label: 'Wilds config.ini (Japanese)',
      },
      {
        href: '/games/monster-hunter-wilds/mod',
        label: 'Wilds mods and safe removal (Japanese)',
      },
      {
        href: '/guide/gpu-driver-update',
        label: 'GPU driver updates and rollback (Japanese)',
      },
      {
        href: '/guide/pc-shuts-down-while-gaming',
        label: 'PC shutdowns and restarts while gaming (Japanese)',
      },
      {
        href: '/guide/bsod-while-gaming',
        label: 'Blue screens while gaming (Japanese)',
      },
    ],
    sources: [
      {
        label: 'Microsoft Learn: Get-Process, loaded modules and 64-bit checks',
        url: 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process',
      },
      {
        label:
          'OpenSteamTool developer documentation: Steam-root loaders (not an installation recommendation)',
        url: 'https://github.com/OpenSteam001/OpenSteamTool/blob/main/README.md',
      },
      {
        label:
          'CloudRedirect developer documentation: redirected storage and backup warnings',
        url: 'https://github.com/Selectively11/CloudRedirect#readme',
      },
      {
        label: 'Capcom: Monster Hunter Wilds troubleshooting guide',
        url: 'https://steamcommunity.com/app/2246340/discussions/0/596267902352499417/',
      },
      {
        label: 'Capcom: cutscene playback and Media Feature Pack (item 7)',
        url: 'https://steamcommunity.com/app/2246340/discussions/0/596267902352499612/',
      },
      {
        label: 'Microsoft: Media Feature Pack by Windows N version',
        url: 'https://support.microsoft.com/en-us/windows/experience/platform-variants/media-feature-pack-list-for-windows-n-editions',
      },
      {
        label: 'Capcom: Graphics-driver notice linked from the official guide',
        url: 'https://store.steampowered.com/news/app/2246340/view/534357354429284375',
      },
      {
        label: 'Steam Support: Verify integrity of game files (Japanese)',
        url: 'https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB',
      },
      {
        label: 'Microsoft: Windows system-configuration tools (Japanese)',
        url: 'https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows',
      },
      {
        label: 'Capcom: Official Monster Hunter Wilds support',
        url: 'https://www.monsterhunter.com/support/wilds/',
      },
    ],
  },
  {
    locale: 'en',
    gameSlug: 'ace-combat-8',
    gameName: 'ACE COMBAT 8',
    slug: 'error-st-3100001',
    checkedAt: '2026-10-02',
    title:
      'ACE COMBAT 8 Error ST-3100001 on PC: Check Windows Time Synchronization',
    shortTitle: 'Error ST-3100001',
    description:
      'What ST-3100001 means in ACE COMBAT ONLINE, the official Windows clock-sync check, how to measure clock offset, and the separate mission-end error notice. Player reports are labeled.',
    lead: 'For the Steam version of ACE COMBAT ONLINE showing ST-3100001 during play or deployment and preventing you from continuing. Guidance and notices were checked for the Japanese article on October 2, 2026.',
    summary:
      'The publisher describes ST-3100001 as a general error shown when communication with the game server is lost. Its recommended first check is whether Windows time is incorrect. Open Settings → Time & language → Date & time → Sync now, then restart Steam and the game. This error code does not identify a single cause.',
    sourcePolicy:
      'The code meaning and first clock-sync check come from the publisher’s notice. Clock-offset examples are player reports, not official measurements or a guaranteed fix. The mission-end issue and penalty plan reflect the dated September 29 notice; check for newer official updates.',
    quickFacts: [
      {
        label: 'Meaning (publisher)',
        value:
          'A general error when communication with the game server is lost',
      },
      {
        label: 'Official first check',
        value: 'Check Windows clock accuracy, synchronize it and retry',
      },
      {
        label: 'Synchronize time',
        value: 'Settings → Time & language → Date & time → Sync now',
      },
      {
        label: 'Measure offset (administrator PowerShell)',
        value:
          'w32tm /stripchart /computer:time.windows.com /samples:5 /dataonly',
        copy: true,
      },
      {
        label: 'Error after a mission',
        value:
          'The September 29 official notice said the results-screen issue was being addressed and affected penalties were planned to be removed. Check newer notices.',
      },
    ],
    diagnosis: [
      {
        symptom:
          'Matchmaking and aircraft selection work, but deployment repeatedly fails',
        cause:
          'An incorrect clock is one reported possibility; start with the official synchronization check',
        stepId: 'sync-time',
      },
      {
        symptom: 'Sync now fails, or the clock drifts again',
        cause: 'Check the Windows Time service and measured offset',
        stepId: 'check-offset',
      },
      {
        symptom: 'Disconnects during a match, including in other online games',
        cause: 'Investigate connection stability and official server notices',
        stepId: 'check-status',
      },
      {
        symptom: 'Error after a mission instead of the results screen',
        cause:
          'Compare with the issue described in the September 29 official notice',
        stepId: 'check-status',
      },
    ],
    steps: [
      {
        id: 'sync-time',
        title: 'Synchronize Windows time: the official first check',
        summary:
          'Players have reported deployment failures when their PC clocks were off by only a few minutes. These reports do not establish the cause of every occurrence.',
        time: 'About 2 minutes',
        risk: 'low',
        actions: [
          'Press Windows + I → Settings → Time & language → Date & time.',
          'Make sure Set time automatically is on, then choose the correct time zone for your location. The Japanese edition uses Osaka/Sapporo/Tokyo (UTC+09:00) as its local example; readers elsewhere should use their own correct zone.',
          'Under Additional settings, choose Sync now.',
          'Fully close Steam and ACE COMBAT 8, reopen them and try deploying again.',
        ],
        note: 'You can also right-click the taskbar clock and choose Adjust date and time.',
      },
      {
        id: 'check-offset',
        title: 'Measure clock offset and check the synchronization service',
        summary:
          'Use this when Sync now fails or the issue persists. These are built-in Windows commands, not a downloaded repair tool.',
        time: 'About 5 minutes',
        risk: 'low',
        actions: [
          'Press Windows + X and open Terminal (Admin), accepting the Windows elevation prompt only if you intend to run these commands on your own PC.',
          'Run w32tm /stripchart /computer:time.windows.com /samples:5 /dataonly . Values close to zero, such as +0.02s, show little measured offset; tens of seconds or minutes show a clock discrepancy. This is not a guarantee that the game will connect.',
          'If the time is off, run w32tm /resync /force to request synchronization.',
          'If Windows says the service has not been started, run Start-Service W32Time, then run w32tm /resync /force again.',
          'Repeat the first command to check the offset, then restart Steam and ACE COMBAT 8.',
        ],
        note: 'A player in the linked Steam discussion reported an approximately 136-second offset and being able to deploy after correcting it. That is an individual player report. On a managed work or school PC, ask its administrator before changing time-service behavior.',
      },
      {
        id: 'check-status',
        title: 'Check official notices and compare the connection',
        summary:
          'Because this is a general connection-loss error, a correct clock does not rule out a server or connection problem.',
        time: 'About 5 minutes',
        risk: 'low',
        actions: [
          'Check the official ACE COMBAT X account (@PROJECT_ACES) and Steam news for outages and maintenance. Gemnao’s status page is also available in Japanese.',
          'If the error appears after a mission instead of the results screen, compare with the issue in the September 29 notice and look for an official resolution update.',
          'On Wi-Fi, compare a wired connection if available. If appropriate for your own connection, pause a VPN or network-optimization tool for a separate comparison; do not change a managed network’s required settings.',
          'Restart your router when it is safe to interrupt the connection, then retry.',
        ],
      },
    ],
    avoid: [
      'Repeatedly attempting deployment with the same unresolved error; check time first',
      'Leaving the clock manually offset; restore automatic time after checking',
      'Using repair tools or scripts from unknown sources',
    ],
    cautions: [
      'In its September 29, 2026 notice, the publisher said it planned to clear penalties caused by the mission-end error. This is a dated plan, not confirmation that a specific account’s penalty has been removed.',
      'Do not apply this code’s explanation to another error code without its own official guidance.',
    ],
    faqs: [
      {
        question: 'What does ST-3100001 mean?',
        answer:
          'The official notice describes a general error when communication with the game server is lost. Causes can differ; the publisher recommends checking Windows time synchronization first.',
      },
      {
        question:
          'I received a penalty when the error disconnected me. What happens?',
        answer:
          'For the error after a mission instead of the results screen, the September 29 notice said the issue was being addressed and affected penalties were planned to be cleared. Check newer official notices; this does not confirm the status of an individual account.',
      },
      {
        question: 'The clock looks correct. Should I still check?',
        answer:
          'The taskbar clock may not make a difference of a few seconds obvious. Players in the Steam thread reported an offset of a little over two minutes that they had not noticed. The w32tm /stripchart command measures the difference in seconds.',
      },
    ],
    related: [
      {
        href: '/en/games/ace-combat-8/not-launching',
        label: 'ACE COMBAT 8 launch troubleshooting',
      },
      { href: '/status', label: 'Outage and maintenance status (Japanese)' },
    ],
    sources: [
      {
        label: 'Official Steam news: ST-3100001, September 30, 2026',
        url: 'https://store.steampowered.com/news/app/2288340/view/695399726270382123',
      },
      {
        label:
          'Official ACE COMBAT X: Mission-end error notice, September 29, 2026',
        url: 'https://x.com/PROJECT_ACES/status/2104739973396373623',
      },
      {
        label: 'Steam Community player reports: I FOUND HOW TO FIX ST-3100001',
        url: 'https://steamcommunity.com/app/2288340/discussions/0/594068631729585680/',
      },
      {
        label:
          'Microsoft Learn: Windows Time service tools and settings, w32tm (Japanese)',
        url: 'https://learn.microsoft.com/ja-jp/windows-server/networking/windows-time-service/windows-time-service-tools-and-settings',
      },
    ],
  },
];
