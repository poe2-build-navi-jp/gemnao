import type { EnglishCommonGuide } from './common-guides-en';
const steam = (id: string) =>
  `https://help.steampowered.com/en/faqs/view/${id}`;
const related = (slug: string, label: string) => ({
  href: `/en/guide/${slug}`,
  label,
});
const base = {
  category: 'Common PC game troubleshooting',
  checkedAt: '2026-10-18',
  sourcePolicy:
    'Adapted from the corresponding Japanese guide and checked against the official sources below. Comparison order and interpretation are editorial guidance, not a tested success rate or a guarantee. Windows and vendor screens can vary by version and hardware.',
};
export const moreCommonGuidesEn: EnglishCommonGuide[] = [
  {
    ...base,
    slug: 'verify-steam-files',
    path: '/guide/verify-steam-files',
    topic: 'launch',
    title:
      'Verify Steam Game Files: Repair Results, Mods and Repeated Downloads',
    shortTitle: 'Verify Steam game files',
    description:
      'Verify installed Steam files safely, protect saves and mods, and interpret repaired files, unchanged results or repeated downloads before choosing the next check.',
    lead: 'For a Steam game with missing files, launch errors or problems after an update. Verification checks Steam-managed game files; it does not diagnose every crash or guarantee that user settings and added mods are clean.',
    summary:
      'Finish pending downloads, close the game and preserve saves and mod records. Open the game’s Properties → Installed Files → Verify integrity of game files. Wait for any downloads, then repeat the original test. Judge the result by what the game does, not only by a count of repaired files.',
    branches: [
      {
        symptom: 'Missing executable or an interrupted update',
        action: 'Finish or record the failed download before verifying.',
        step: 'step-1',
      },
      {
        symptom: 'You are ready to run verification',
        action: 'Use the Installed Files tab for this game only.',
        step: 'step-2',
      },
      {
        symptom: 'Everything verified but the problem remains',
        action: 'Compare the launch result and investigate other causes.',
        step: 'step-3',
      },
      {
        symptom: 'The same files keep downloading again',
        action: 'Match recurrence with updates, mods and protection history.',
        step: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Close the game and protect saves and mod records',
        actions: [
          'Finish the current save and close the game normally. In Steam, open Downloads and check whether this game still has an update or installation in progress. Wait for it to finish; record any download error and the scene or launch failure you want to test.',
          'Before changing files, locate saves using the game publisher’s documentation and copy them to a separate backup location. Keep the original intact. Cloud synchronization is not a substitute for an independent copy, particularly when a test can overwrite a save.',
          'Record your mod manager profile, load order and manually installed files. Verification can restore a Steam-managed file that a mod changed, but it is not a reliable way to remove every additional file. Do not load and overwrite a mod-dependent save just to test a repaired installation.',
        ],
        next: 'When updates have finished and your records are safe, continue to STEP 2. If downloading itself fails, keep its exact error for STEP 4; a repeated verification loop may not address it.',
      },
      {
        id: 'step-2',
        title: 'Run verification and let downloads finish',
        actions: [
          'In Steam Library, right-click the game or use its gear menu. Choose Properties → Installed Files → Verify integrity of game files. Let Steam complete the operation before starting the game.',
          'Verify one game at a time. Avoid running another intensive disk scan alongside it. Keep the completion message and any reacquired-file count for comparison; do not interpret a number alone as proof of drive damage.',
          'Check Downloads again. Steamworks documentation notes that verification can also trigger Workshop item downloads. A completed verification dialog does not mean every following download has already finished.',
        ],
        next: 'After downloads finish, go to STEP 3 and reproduce the original situation. If Steam reports an installation or write error, use STEP 4 to collect the relevant details.',
      },
      {
        id: 'step-3',
        title: 'Read the result together with the launch test',
        actions: [
          'Launch in the same way and test the same scene before reapplying changed mods. If repaired files coincide with improvement, they may have contributed; repeat the test before calling the issue resolved. Keep the comparison separate from a game update that arrived at the same time.',
          'If all files verify but the failure remains, record “verification completed; symptom unchanged”. Check the relevant launch or crash guide next. Settings stored elsewhere, incompatible mods, requirements and other software are not ruled out by this result.',
          'Steam notes that some local configuration files can fail verification without needing replacement. Do not delete them just because of that message. If reacquired files do not change the symptom, confirm downloads are finished and move to a symptom-specific check.',
        ],
        next: 'Improved: record the test conditions and preserve a working configuration. Unchanged: use the launch/crash links below. Recurs after a restart or mod change: continue to STEP 4.',
      },
      {
        id: 'step-4',
        title: 'Investigate repeated downloads or recurrence',
        actions: [
          'Record when the issue returns and whether it follows a game update, Workshop download or mod reapplication. Check whether the relevant Workshop item is still subscribed; deleting its local copy is not the same as changing the subscription. Preserve its name before changing anything.',
          'For write or download errors, identify the installation drive and available space in Steam’s storage settings. Record the exact error and use Steam’s installation support page. Reacquisition by itself does not establish hardware failure.',
          'If game files repeatedly disappear, review your security software’s protection history for the matching path and time. Keep uncertain files blocked and ask the publisher or security vendor; do not turn off protection or add a broad exclusion.',
          'For official support, provide the game edition, error, verification result, download state and before/after launch test. Remove personal paths and account details before posting publicly. Back up important files before any later storage repair.',
        ],
        next: 'Stop repeating an unchanged test. Use Steam Support for installation failures or the publisher for a game-specific failure, with the record you collected.',
      },
    ],
    cautions: [
      'Do not delete the game’s user-data or save folders as part of verification.',
      'Do not assume all mods were removed, or restore every mod at once after a successful test.',
      'Do not treat “files reacquired” as a storage-health diagnosis or disable security to prevent reacquisition.',
    ],
    faqs: [
      {
        question: 'Does verification remove every mod?',
        answer:
          'No. It can replace modified Steam-managed files, while added files can remain. Workshop subscriptions can cause downloads again. Use the original mod manager or installation record to identify what changed.',
      },
      {
        question: 'Are my saves guaranteed to be untouched?',
        answer:
          'Save locations and mod dependencies differ by game. Verification is aimed at installed game files, but that is not a backup guarantee. Make a separate save copy and avoid overwriting a mod-dependent save during testing.',
      },
      {
        question: 'Why does verification pass when the game still crashes?',
        answer:
          'It tests a limited part of the installation. Keep the exact crash behavior and continue with the crash guide rather than concluding that the whole PC or game configuration is healthy.',
      },
    ],
    sources: [
      {
        label: 'Steam: verify integrity of game files',
        url: steam('0C48-FCBD-DA71-93EB'),
      },
      {
        label: 'Steam: update and installation issues',
        url: steam('21F5-8D5D-0141-7A5E'),
      },
      {
        label: 'Steamworks: subscriptions and Workshop downloads',
        url: 'https://partner.steamgames.com/doc/features/workshop/implementation',
      },
      { label: 'Steam: cloud and saves', url: steam('68D2-35AB-09A9-7678') },
    ],
    related: [
      { href: '/en/guide/save-data-backup', label: 'Preserve saves before changes or restoration' },
      { href: '/en/guide/steam-cloud-sync-error', label: 'Cloud warnings: protect candidates before selecting' },
      related('steam-game-not-launching', 'Steam game does not launch'),
      related('pc-game-crash', 'Game launches and then crashes'),
      {
        href: '/en/gear/save-backup-storage-guide',
        label: 'Choose a separate save-backup destination',
      },
    ],
  },
  {
    ...base,
    slug: 'gpu-driver-update',
    path: '/guide/gpu-driver-update',
    topic: 'launch',
    title: 'Update or Roll Back a GPU Driver: NVIDIA, AMD and Intel on Windows',
    shortTitle: 'Update or roll back GPU drivers',
    description:
      'Identify your GPU, choose an official or PC-maker driver, update safely and compare the result. Includes NVIDIA, AMD, Intel and rollback limits for laptops and OEM PCs.',
    lead: 'Use this when a game’s official guidance points to a graphics driver, or a new display problem began after an update. A newer driver is not a promise of higher FPS. Keep a record of the current version and a way back before changing it.',
    summary:
      'Identify the exact GPU and PC model. On laptops and handhelds, check the computer maker’s supported package first. Use one official update route for the correct hardware and Windows version, restart as instructed and compare the same game scene. If the change makes things worse, check rollback availability rather than repeatedly installing different packages.',
    branches: [
      {
        symptom: 'Unsure which GPU or driver you have',
        action: 'Record every display adapter and the PC model.',
        step: 'step-1',
      },
      {
        symptom: 'Ready to install an official update',
        action: 'Choose the matching vendor or OEM route.',
        step: 'step-2',
      },
      {
        symptom: 'New crashes or display issues after updating',
        action: 'Record the regression and check rollback options.',
        step: 'step-3',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Record the GPU, driver version and original symptom',
        actions: [
          'Close the game. Right-click Start → Device Manager → Display adapters. Open the relevant adapter’s Properties → Driver and record its name, driver version and date. If two adapters appear, record both; a CPU brand alone does not identify the GPU running the game.',
          'Write down the computer manufacturer and model, Windows version, affected game and repeatable scene. Record the current graphics settings and whether the symptom is a crash, visual corruption or low FPS. Preserve saves before comparing a crash-prone scene.',
          'For a laptop, handheld or prebuilt PC, check the product support page for its supported driver and any model-specific instructions. Hybrid graphics and custom display features can depend on the manufacturer’s package. Ask your administrator about managed computers rather than overriding policy.',
        ],
        next: 'If the hardware or compatible package is unclear, stop and use the PC maker’s support. Otherwise choose one matching route in STEP 2; do not update every adapter and change game settings at the same time.',
      },
      {
        id: 'step-2',
        title: 'Use one official update route for your hardware',
        actions: [
          'NVIDIA: open the NVIDIA app’s Drivers page, review the offered driver and supported hardware, then follow its download and installation prompts. Alternatively use NVIDIA’s official driver search with the exact product and operating system. Do not get packages from download mirrors or search advertisements.',
          'AMD: in AMD Software: Adrenalin Edition, open its system/software information and Manage Updates. AMD’s current guide opens AMD Install Manager and lists available software there. Review the matching package before downloading and follow its installer. Screens differ by installed edition and supported hardware.',
          'Intel: use Intel Driver & Support Assistant from Intel’s official site, or the matching graphics package in Intel Download Center. Review the detected GPU and Windows compatibility. Intel also directs users to computer-manufacturer drivers; prefer the supported OEM package when your PC maker specifies one.',
          'Save other work, close games, keep a laptop on reliable power and follow the installer’s restart instructions. Do not select a driver-cleaning tool or AMD Factory Reset for a routine comparison. AMD warns that Factory Reset removes prior packages and prevents rollback to the previous driver.',
        ],
        next: 'When installation completes, restart if you have not already done so, then continue to STEP 3. If installation fails, retain the exact message and consult the relevant vendor; do not force an incompatible package.',
      },
      {
        id: 'step-3',
        title: 'Compare the result and roll back only when appropriate',
        actions: [
          'After restarting, recheck the adapter’s installed version. Repeat the same scene with the same graphics settings and duration. Separate first-run preparation from repeat runs; record whether the original symptom improved, stayed the same or was replaced by a new one.',
          'For Intel DCH packages, first check Intel’s matching rollback guidance and never bypass its installer with a legacy procedure. If an update introduced a new problem, open Device Manager → Display adapters → the GPU’s Properties → Driver → Roll Back Driver, if available. Follow the confirmation and restart instructions. This option requires a retained previous driver and suitable permissions; a grey button is not a reason to delete driver files manually.',
          'If rollback is unavailable, check the PC maker or GPU vendor for the previously recorded compatible version. NVIDIA’s app can offer Reinstall for a previously installed driver through its three-dot menu when that version is available. Do not assume an old package is available on every PC or for every GPU.',
          'After any rollback, verify the installed version and repeat the same comparison. If problems persist across games, give official support the versions and tests. A repeated crash or loss of display needs investigation beyond an FPS setting; back up important data before further repair.',
        ],
        next: 'Keep a version and symptom record if the comparison improves. If unchanged, use the matching black-screen, crash or performance guide below. Avoid cycling through drivers without a reproducible test.',
      },
    ],
    cautions: [
      'Do not disable antivirus, use third-party driver cleaners or select a destructive reset as the default update procedure.',
      'Do not overwrite your only save while testing a configuration known to crash.',
      'For Intel DCH drivers, follow Intel’s matching installer guidance; do not use a legacy-driver procedure to bypass the DCH installer.',
      'Do not bypass an OEM compatibility warning or an administrator’s policy; an installation that completes is not proof every laptop feature works.',
    ],
    faqs: [
      {
        question: 'My laptop lists Intel and NVIDIA. Which should I update?',
        answer:
          'Identify both and check the laptop maker’s supported combination. Different adapters can participate in rendering and display output. Do not infer the correct package from the CPU name or install every offered update together.',
      },
      {
        question: 'Why is Roll Back Driver greyed out?',
        answer:
          'Windows may not retain the previous package. Use your version record to check official compatible downloads or ask the PC maker. A restore path is not guaranteed after a cleanup or reset.',
      },
      {
        question: 'Should I update a stable PC just to raise FPS?',
        answer:
          'This guide is a troubleshooting comparison, not a guarantee of extra performance. Check relevant release notes and game requirements. If a frame cap or demanding scene explains the result, changing drivers may not help.',
      },
    ],
    sources: [
      {
        label: 'NVIDIA: app Drivers page and reinstall',
        url: 'https://www.nvidia.com/en-us/geforce/news/gfecnt/202411/nvidia-app-download-and-features/',
      },
      {
        label: 'NVIDIA: official driver search',
        url: 'https://www.nvidia.com/en-us/drivers/',
      },
      {
        label: 'AMD: software information and Manage Updates',
        url: 'https://www.amd.com/en/resources/support-articles/faqs/DH3-016.html',
      },
      {
        label: 'AMD: installer and Factory Reset limitations',
        url: 'https://www.amd.com/en/resources/support-articles/faqs/rsx2-install.html',
      },
      {
        label: 'Intel: graphics installation and manufacturer drivers',
        url: 'https://www.intel.com/content/www/us/en/support/articles/000005629/graphics/processor-graphics.html',
      },
      {
        label: 'Intel: Driver & Support Assistant',
        url: 'https://www.intel.com/content/www/us/en/support/detect.html',
      },
      {
        label: 'Intel: Windows driver rollback',
        url: 'https://www.intel.com/content/www/us/en/support/articles/000008628.html',
      },
    ],
    related: [
      related('black-screen', 'A black screen or missing picture'),
      related('pc-game-crash', 'Crashes during launch or play'),
      related('low-fps', 'Low FPS: compare caps and rendering load'),
      related('stutter-fix', 'Intermittent stutter after an update'),
    ],
  },
  {
    ...base,
    slug: 'black-screen',
    path: '/guide/black-screen',
    topic: 'launch',
    title:
      'PC Game Black Screen: Audio Still Playing, Startup and Display Checks',
    shortTitle: 'Black screen or audio without a picture',
    description:
      'Separate a black game window from no signal or a Windows-wide display problem. Check display mode, HDR and game files with reversible steps and save protection.',
    lead: 'Start by asking whether Windows still appears. A game with sound but no picture, a monitor reporting no signal and a PC showing a stop code need different checks. Sound alone does not prove that the game is still running correctly.',
    summary:
      'Try switching to Windows before changing files. If the desktop works, compare the game’s display mode and the last setting changed. If the entire display is unavailable, check the monitor and Windows display path first. Back up any confirmed game configuration before moving it, and keep saves separate.',
    branches: [
      {
        symptom: 'Black immediately after launching, but Windows is visible',
        action: 'Record the timing and compare the game’s display mode.',
        step: 'step-2',
      },
      {
        symptom: 'Audio continues but there is no game picture',
        action:
          'Check Windows responsiveness before assuming the game is healthy.',
        step: 'step-1',
      },
      {
        symptom: 'Monitor says no signal or the desktop is also missing',
        action: 'Check power, input and connections first.',
        step: 'step-1',
      },
      {
        symptom: 'Black screen began after a setting or update',
        action:
          'Undo the specific setting, then compare files or add-ons separately.',
        step: 'step-2',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Separate the game window from the whole display',
        actions: [
          'Try Alt+Tab to switch to another application. If nothing appears, try Ctrl+Alt+Delete and check whether the Windows security screen is visible. Record what appears, whether sound continues and whether the problem starts before the menu or only when loading a save.',
          'If the monitor shows no signal, check its power, selected input and external cable connections. Use the correct output for your PC’s configuration; do not open the PC or reseat internal hardware as a first step. A no-signal message alone does not identify a failed GPU.',
          'For a Windows-wide blank screen, Microsoft lists Windows+Ctrl+Shift+B as a graphics-driver reset shortcut; try it once and note a beep or flicker. If the screen returns, save work and record the circumstances. If Windows remains inaccessible, use Microsoft or your device maker’s blank-screen guidance instead of editing game files blindly.',
          'If a stop code, automatic restart or complete system freeze occurs, record that different symptom. Do not repeatedly force power off during a save or update. Seek device support when you cannot safely regain the desktop.',
        ],
        next: 'Desktop visible: continue to STEP 2. No desktop or repeated system restarts: follow official Windows/device support first. If a loading or shader-preparation indicator is still advancing, let the game’s prescribed preparation finish.',
      },
      {
        id: 'step-2',
        title: 'Compare display mode and the last changed setting',
        actions: [
          'With the game selected, try Alt+Enter once if the game supports switching display mode this way. It is not universal. If a picture returns, open the game’s video settings and record the working mode before changing anything else.',
          'Check the chosen monitor, a supported resolution and windowed or borderless mode in the game. Compare one option at a time. If a change does not help, restore it before testing another; lowering every graphics option together obscures what mattered.',
          'If this began after changing HDR, restore that setting for comparison. In Windows 11, open Settings → System → Display, select the intended display and open HDR where available. A brief transition to black is different from a picture that never returns. Do not change HDR and refresh rate together.',
          'If the game menu cannot be reached, consult that publisher’s documented configuration location and reset procedure. Close the game, back up the confirmed configuration file separately, and move only that file if the procedure supports regeneration. Never guess a path, delete a whole Documents/AppData folder or treat saves as disposable settings.',
        ],
        next: 'If the picture returns, retest after a normal exit and launch. If a configuration comparison does not help, restore the backup while the game is closed. With Windows still usable but the game still black, continue to STEP 3.',
      },
      {
        id: 'step-3',
        title: 'Compare file repair, overlays and driver changes separately',
        actions: [
          'For a Steam edition, close the game and verify its installed files using the linked verification guide. Preserve mod records and saves first, wait for downloads and repeat the same launch. Verification does not necessarily reset a separate user configuration.',
          'Compare a recording or overlay app by closing it normally, one at a time. For mods or visual injectors, follow the original manager or documented removal procedure and keep a record. Do not delete unknown DLLs, disable security protection or overwrite a mod-dependent save during the test.',
          'If multiple games are affected, compare the timing with a driver update or monitor connection change. Use the GPU guide to check the exact adapter, OEM package and rollback options. Do not reinstall drivers repeatedly without recording versions and results.',
          'If only this game remains affected, send its support team the platform, GPU/driver version, display mode, Windows response and before/after tests. Distinguish startup, loading and in-play failures. If the picture returns only once, report that limited result rather than a confirmed permanent fix.',
        ],
        next: 'Unchanged game-only failure: use the publisher’s support. New driver-related regression: use the driver guide. An exit to desktop: follow the crash guide. Retain your save backup before any later reinstall.',
      },
    ],
    cautions: [
      'Do not assume continued audio means the game is healthy or that verification resets every display setting.',
      'Avoid generic launch flags, registry fixes and configuration paths copied from a different game.',
      'Do not interrupt saves or updates to force repeated power cycles; use device support if Windows cannot be recovered safely.',
    ],
    faqs: [
      {
        question: 'How long should I wait on a black startup screen?',
        answer:
          'There is no safe universal number. Distinguish progressing first-run preparation from the same repeatable stall. Record elapsed time and whether Windows responds; use the game’s own support guidance for its loading process.',
      },
      {
        question: 'Alt+Enter does nothing. Is my GPU broken?',
        answer:
          'No. The shortcut is not supported by every game and must reach the selected game window. Check the game’s documented video or configuration controls; an unchanged shortcut result is not a hardware diagnosis.',
      },
      {
        question: 'Does no signal mean the same thing as a black game window?',
        answer:
          'No. No signal is a monitor/input observation. Confirm input, power and connections before game-file checks. A visible Windows desktop with only the game black points to a different comparison.',
      },
    ],
    sources: [
      {
        label: 'Microsoft: blank screens and graphics reset shortcut',
        url: 'https://support.microsoft.com/en-us/windows/hardware/display-graphics/troubleshooting-blank-screens-in-windows',
      },
      {
        label: 'Microsoft: HDR settings and display transitions',
        url: 'https://support.microsoft.com/en-us/windows/hardware/display-graphics/hdr-settings-in-windows',
      },
      {
        label: 'Steam: installed-file verification',
        url: steam('0C48-FCBD-DA71-93EB'),
      },
    ],
    related: [
      related(
        'verify-steam-files',
        'Verify files without losing track of mods',
      ),
      related('gpu-driver-update', 'Check a driver update or rollback'),
      related('pc-game-crash', 'The game exits instead of staying black'),
    ],
  },
  {
    ...base,
    slug: 'low-fps',
    path: '/guide/low-fps',
    topic: 'display',
    title: 'Low FPS in PC Games: Check Frame Caps, GPU Load and CPU Limits',
    shortTitle: 'Low FPS: caps and rendering load',
    description:
      'Compare the same scene to separate an FPS cap from rendering load and CPU-side limits. Includes resolution tests, GPU selection and the difference between low FPS and stutter.',
    lead: 'Use this for consistently low frame rates during play. If the average FPS is acceptable but occasional frames hitch, start with the stutter guide instead. If other players jump while your own camera remains smooth, investigate the game’s network guidance rather than graphics settings.',
    summary:
      'Record the same scene, FPS range, cap and active GPU. If FPS stays at a configured ceiling, check that ceiling first. Otherwise lower only rendering resolution and compare. Improvement points toward rendering workload; little change calls for cap, CPU, GPU-selection and power checks. None of these observations alone proves a faulty component.',
    branches: [
      {
        symptom: 'FPS sits near a fixed number such as 60',
        action: 'Check the configured cap and synchronization first.',
        step: 'step-2',
      },
      {
        symptom: 'FPS is low throughout the same demanding scene',
        action: 'Record the baseline, then compare resolution alone.',
        step: 'step-1',
      },
      {
        symptom: 'Lowering resolution barely changes FPS',
        action: 'Check caps, the active GPU and CPU-side work.',
        step: 'step-4',
      },
      {
        symptom: 'High average FPS with occasional hitches',
        action:
          'Record the hitch pattern and follow the related stutter guide.',
        step: 'step-1',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Record a repeatable scene and the active GPU',
        actions: [
          'Choose a save, practice area or route you can repeat safely. Keep the display mode, route and duration consistent. Use the game’s FPS display or Steam’s in-game performance monitor; keep the monitoring setup the same for both runs. Record an approximate range rather than one peak number.',
          'Write down rendering resolution, FPS limit, V-Sync, upscaling and frame-generation settings. Separate first-run loading or shader preparation from repeat visits. Generated/displayed FPS and the rate of newly rendered game frames are not interchangeable measures of responsiveness.',
          'Press Ctrl+Shift+Esc to open Task Manager. Under Performance, identify the GPU and examine the relevant engine graph, such as 3D, rather than assuming every GPU graph measures rendering. Record CPU and memory activity too; switching away from the game can change its workload, so treat these as contextual observations.',
        ],
        next: 'At a clear configured ceiling: STEP 2. Below the desired rate without an obvious cap: STEP 3. For isolated hitches, keep this baseline and use the stutter guide below instead of changing every quality option.',
      },
      {
        id: 'step-2',
        title: 'Check the ceiling before lowering image quality',
        actions: [
          'Look for the game’s FPS limit and V-Sync setting. Compare the configured ceiling with the observed rate. In Windows Settings → System → Display → Advanced display, check the intended monitor’s selected refresh rate; only use supported values. A display’s refresh rate is not proof that the PC can render that many frames.',
          'If the cap is below your intended target, compare one higher supported limit in the same scene. Do not disable every limit and synchronization option together. Keep the previous value so you can restore it if noise, heat, tearing or responsiveness becomes worse.',
          'If the game has no relevant limit, check any frame limit you previously set in its GPU driver profile. Use the vendor’s documented controls and avoid stacking multiple limiters. Removing a cap does not create additional processing capacity.',
        ],
        next: 'If FPS follows the new cap and the result suits your needs, retest and stop there. If it stays low, restore unhelpful changes and continue to STEP 3; do not call low GPU use a defect just because a cap was active.',
      },
      {
        id: 'step-3',
        title: 'Change only rendering resolution and compare',
        actions: [
          'Record the original value. If the game has a render-resolution scale, try a lower value as a comparison, such as 100% to 80%; otherwise try one lower supported game resolution. This is a diagnostic example, not a recommended setting for every game.',
          'Leave the cap, V-Sync, frame generation, texture quality, shadows and test route unchanged. Confirm that the new setting actually applied, including a restart if the game asks for one. Compare the same demanding part of the route and note image quality and input feel as well as FPS.',
          'A clear FPS increase suggests rendering work was important in that scene. Little change can reflect a cap or other limits; it does not prove the CPU is faulty or the GPU is unused. Restore the baseline before selecting another individual setting.',
        ],
        next: 'Resolution helps: compare GPU-heavy settings in STEP 4. Little change: check caps and CPU/GPU-selection conditions there. If only the first visit hitches, switch to the stutter guide.',
      },
      {
        id: 'step-4',
        title: 'Choose the next check from the comparison',
        actions: [
          'If lower resolution helped, compare one available setting such as ray tracing, shadows or upscaling. Judge the image-quality tradeoff at the same scene. For a video-memory warning or missing textures, record it and check the game’s memory requirements rather than inferring capacity problems from FPS alone.',
          'If resolution barely helped, recheck the cap and active GPU. On Windows 11, Settings → System → Display → Graphics provides per-app graphics preferences on supported systems. Select the correct game executable and check the named GPU options before changing a preference; hybrid laptops may also need the PC maker’s instructions.',
          'A modest overall CPU percentage can conceal uneven work across logical processors. Treat the CPU graph alongside the resolution comparison, not as a standalone bottleneck verdict. If the game offers view distance, crowd density or simulation settings, compare one relevant option at a time.',
          'On a laptop, compare with the correct power adapter connected and the manufacturer’s intended power mode. Close one nonessential recorder or background workload safely; do not interrupt cloud sync, updates or security protection. If performance worsens over a long session, record duration and seek model-specific thermal/power guidance rather than changing voltage.',
          'Restore changes that do not help. Send game support the scene, settings, hardware, driver version and comparison if one title remains affected. Back up saves before any later repair or reinstall; low FPS by itself is not a reason to delete them.',
        ],
        next: 'Keep a setting only when its repeatable benefit and quality tradeoff are useful. Unexplained game-only slowness goes to game support; system-wide slowdowns or restarts need PC support. Use the related guides for driver changes or intermittent stutter.',
      },
    ],
    cautions: [
      'Do not infer a broken CPU or GPU from one percentage or one busy scene.',
      'Do not clear shader caches between comparisons, stack frame limiters or change an entire graphics preset when testing one cause.',
      'Avoid registry edits, overclocking, security exclusions and driver-cleaning tools as generic FPS fixes.',
    ],
    faqs: [
      {
        question: 'Is low FPS the same as stuttering?',
        answer:
          'No. A consistently low rendering rate and an occasional long frame can feel different and need different comparisons. Both can occur together. Record the steady rate and hitch pattern separately.',
      },
      {
        question: 'Does 100% GPU usage mean I must reduce settings?',
        answer:
          'Not if the game meets your target and feels responsive. High use alone is not a fault. If the rate is too low, compare rendering resolution and one quality setting at a time.',
      },
      {
        question: 'Does frame generation prove the problem is fixed?',
        answer:
          'A higher displayed number can include generated frames. Keep that setting unchanged during diagnosis and compare input feel as well. Do not compare two counters with different definitions as though they measure the same work.',
      },
    ],
    sources: [
      {
        label: 'Microsoft DirectX: CPU and GPU workload limits',
        url: 'https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/',
      },
      {
        label: 'Microsoft DirectX: GPU engine graphs in Task Manager',
        url: 'https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/',
      },
      {
        label: 'Steam: in-game performance monitor',
        url: steam('3462-CD4C-36BD-5767'),
      },
      {
        label: 'Microsoft: display refresh rate',
        url: 'https://support.microsoft.com/en-us/windows/hardware/display-graphics/change-the-refresh-rate-on-your-monitor-in-windows',
      },
      {
        label: 'Microsoft DirectX: per-app graphics preferences',
        url: 'https://devblogs.microsoft.com/directx/navigating-the-redesigned-graphics-settings-page/',
      },
    ],
    related: [
      related('stutter-fix', 'High FPS but intermittent stutter'),
      related('gpu-driver-update', 'Record and compare a driver change'),
      related('black-screen', 'Display disappears instead of running slowly'),
    ],
  },
];
