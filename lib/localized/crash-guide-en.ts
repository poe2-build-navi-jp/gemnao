import type { EnglishGuideInfo } from '@/components/english-guide-shell';

export const crashGuideEn: EnglishGuideInfo = {
  path: '/guide/pc-game-crash',
  title:
    'PC Games Crashing to Desktop: What to Check at Startup, During Loading and After Long Sessions',
  shortTitle: 'Game crashes to desktop',
  description:
    'Troubleshoot a PC game that closes at launch, during loading or after a long session. Check Windows Reliability Monitor and Event Viewer, compare one change at a time, and read a labeled Steam-extension recovery case.',
  lead: 'Start by separating a game closing from the whole PC restarting. Use the timing, crash records and a controlled comparison to decide what to check next, even when no error appears.',
  summary:
    'Record whether only the game closed or the PC restarted, and when. At launch, compare mods and overlays; during loading, preserve saves and check files and scene-specific behavior; after long sessions, watch RAM, VRAM and temperature changes. Match the game and time in Reliability Monitor or Event Viewer and change one item at a time.',
  checkedAt: '2026-10-03',
  category: 'Common PC game troubleshooting',
  sourcePolicy:
    'The Windows and Steam procedures summarize the linked support documentation in our own words. The Steam-extension section is a single anonymous user-reported recovery received on October 3, 2026 (Japan time), not an official fix, a controlled proof of cause or a success-rate estimate.',
  faqs: [
    {
      question:
        'The game returns to the desktop without any message. Where do I start?',
      answer:
        'Note the time, open Reliability Monitor from Windows search and look for the matching game. If nothing appears, check Event Viewer → Windows Logs → Application. Even without a record, use launch/loading/long-session timing to choose a comparison.',
    },
    {
      question: 'Should I reinstall KERNELBASE.dll if it appears in an event?',
      answer:
        'No. A faulting module is a clue to where a failure was recorded, not proof that the file or hardware is damaged. Match the game, time and reproduction conditions with the publisher’s guidance. Do not download DLLs from file-distribution sites.',
    },
    {
      question: 'It only crashes on a loading screen. Can I delete the save?',
      answer:
        'Do not delete it. Close the game and copy the save elsewhere. Compare another slot or a new game and verify files if using Steam. If one save alone fails, tell the game’s official support team.',
    },
    {
      question: 'It crashes after about an hour. Is temperature the cause?',
      answer:
        'Timing alone cannot establish that. Check available RAM and dedicated GPU memory and temperature changes. Compare one change at a time, such as closing an unnecessary app. Ask the PC manufacturer for help if several games or ordinary desktop work also fail.',
    },
  ],
  related: [
    {
      href: '/en/games/monster-hunter-wilds/not-launching#steam-client-check',
      label: 'Wilds launch-crash checks and the reported recovery case',
    },
    {
      href: '/en/gear/save-backup-storage-guide',
      label: 'Choose a save-backup destination',
    },
    {
      href: '/guide/pc-game-freezes',
      label: 'Game freezes and temperature checks (Japanese)',
    },
    {
      href: '/guide/pc-shuts-down-while-gaming',
      label: 'Whole-PC shutdowns and restarts (Japanese)',
    },
    {
      href: '/guide/bsod-while-gaming',
      label: 'Blue screens while gaming (Japanese)',
    },
    {
      href: '/guide/save-data-backup',
      label: 'Copy, verify and restore saves safely (Japanese)',
    },
    {
      href: '/guide/verify-steam-files',
      label: 'Steam game-file verification (Japanese)',
    },
    {
      href: '/guide/gpu-driver-update',
      label: 'GPU driver updates and rollback (Japanese)',
    },
    { href: '/guide/vram-shortage', label: 'VRAM shortage checks (Japanese)' },
    {
      href: '/guide/reset-config-file',
      label: 'Back up and reset game settings (Japanese)',
    },
  ],
  sources: [
    {
      label:
        'Microsoft: Windows system-configuration tools and Event Viewer (Japanese)',
      url: 'https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows',
    },
    {
      label: 'Microsoft Learn: Application crashes and events 1000/1001',
      url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-application-service-crashing-behavior',
    },
    {
      label:
        'Dell: Identify software problems with Windows Reliability Monitor',
      url: 'https://www.dell.com/support/kbdoc/en-us/000178177/how-to-use-windows-reliability-monitor-to-identify-software-issues',
    },
    {
      label: 'Steam Support: Verify integrity of game files (Japanese)',
      url: 'https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB',
    },
  ],
};

export const crashSectionsEn = [
  {
    id: 'crash-scope',
    title: 'First check whether only the game closed',
    paragraphs: [
      'This guide covers a game closing and returning to the Windows desktop. A frozen image, the entire PC switching off or restarting, and a blue screen with a stop code need different checks. The related guides below are labeled Japanese where no English edition exists.',
      'Record the game and version, crash time, time since launch, full on-screen error, save slot and in-game location. Compare the same action if safe, but copy saves first if corruption is suspected.',
    ],
  },
  {
    id: 'crash-timing',
    title: 'Launch, loading or a long session: where to start',
    table: {
      headers: ['When it closes', 'What to check first', 'First test to try'],
      rows: [
        [
          'Around the logo or immediately after launch',
          'Did it start after a mod or ReShade installation? Did it launch before the update?',
          'Disable mods through their manager and compare. Next test with the overlay off separately. If unchanged, consider backing up and resetting the settings file.',
        ],
        [
          'While loading a save or area',
          'Does it affect only one save or scene, or another slot/new game too?',
          'Copy saves first. If other slots also fail, verify Steam files. If one save alone fails, preserve it and contact game support.',
        ],
        [
          'After tens of minutes or hours',
          'Does RAM or dedicated GPU memory headroom fall, or temperature rise, as play continues?',
          'Close unnecessary apps normally, then test again. If VRAM is tight, lower textures one step. See the related freeze guide for temperature checks (Japanese).',
        ],
      ],
    },
    paragraphs: [
      'Timing alone does not establish a cause. File damage can affect launch, mods can affect loading, and driver failures can occur after long play. Choose your next check based on the records and the results of each test.',
    ],
  },
  {
    id: 'step-1',
    title: 'Step 1: Record the failure and time',
    ordered: true,
    items: [
      'Record when the desktop appeared, whether it was at launch, loading or how many minutes into play, and whether the same action reproduces it. Investigate power loss, automatic restarting and blue screens with their separate guides.',
      'Use the Windows crash-history instructions below to look for the target game at that time. If no entry is found, record “no matching record.” Do not infer a cause from the module name alone.',
    ],
  },
  {
    id: 'step-2',
    title: 'Step 2: Try one check that fits when the crash occurs',
    ordered: true,
    items: [
      'At launch: disable mods in their manager and compare. Separately turn Steam Overlay off under the game’s Properties → General. Do not overwrite a save that depends on mods.',
      'During loading: copy saves first, then compare another save or new game. In Steam, use Properties → Installed Files → Verify integrity of game files. This can restore files modified by mods.',
      'After a long session: compare Task Manager’s Memory and Dedicated GPU memory in the same scene. Close unnecessary apps normally if available memory is running low; lower textures one step if VRAM is tight. If temperature also rises, check cooling and airflow.',
    ],
  },
  {
    id: 'step-3',
    title:
      'Step 3: Compare under the same conditions, then choose the next check',
    ordered: true,
    items: [
      'Use the same save, scene and similar duration before and after the change. Record the crash time, elapsed play time and the one item changed. If it does not help, restore that setting before trying the next candidate.',
      'If one game still fails and it began after an update, compare the GPU driver version and change date. If several games fail, inspect whole-PC history and the manufacturer’s diagnostics rather than repeatedly reinstalling games.',
    ],
  },
  {
    id: 'crash-history',
    title: 'If there is no error message, check Windows crash history',
    ordered: true,
    items: [
      'Press Windows + R, enter perfmon /rel and press Enter. In Reliability Monitor, select the red failure marker on the day the game closed. If the game has a stopped-working entry, open its technical details and record the time, application name and problem-event name.',
      'If absent, right-click Start → Event Viewer → Windows Logs → Application. Check errors near the crash time and confirm the game executable matches. Application Error event 1000 and nearby Windows Error Reporting event 1001 may provide clues.',
      'Record the faulting application, faulting module, exception code and time from General. An error from another app or a warning recorded hours apart does not establish what caused the game to crash. If nothing matches, record “no matching record” and continue timing-based comparisons.',
    ],
    paragraphs: [
      'For example, if Game.exe stopped at the matching time and only the game closed, prioritize its updates, mods and save data. A module such as KERNELBASE.dll does not establish the cause or instruct you to replace that DLL. If multiple games or Windows itself fail, also investigate the PC.',
    ],
  },
  {
    id: 'steam-client-case',
    title:
      'One reported recovery: check Steam extensions separately from game mods',
    paragraphs: [
      'On October 3, 2026 (Japan time), one user reported being able to play the Steam version of Monster Hunter Wilds after temporarily disabling third-party Steam-client extensions. It had closed before the title screen. Closing OBS, switching Steam Overlay off, verifying files, confirming administrator-mode overrides were off, and updating the GPU driver followed by restarting had not resolved it. A read-only check then found extra DLLs loaded into the Steam process from its installation root.',
      'A file being present and a file actually loaded into a process are different facts. The case did not verify loading into the game process and did not prove one particular DLL was the cause. Do not delete by filename; stop if you do not recognize the installation. Windows DLLs with the same names in System32 are outside the scope of this check.',
      'Before a change, copy and verify settings and saves. With an extension that redirects saves, also check external cloud storage and custom destinations. Do not proceed if important data cannot be preserved. Check only the target game, and stop without overwriting if a sync conflict or missing-save warning appears. Keep the working state; do not re-enable additions just to provoke a recurrence.',
      'The linked Wilds case documents the DLL names, read-only check, reversible pause and reported result. Do not apply the same cause or a supposed success rate to other games.',
    ],
    links: [
      {
        href: '/en/games/monster-hunter-wilds/not-launching#steam-client-check',
        label: 'Read the Wilds pre-title crash recovery case',
      },
    ],
  },
  {
    id: 'crash-compare',
    title: 'Compare results and decide what to do next',
    table: {
      headers: ['Result', 'Next action'],
      rows: [
        [
          'It launches without mods',
          'Check the mod source’s updates against the game version. Preserve saves before restoring required mods and test them individually.',
        ],
        [
          'Only one save will not load',
          'Keep a copy and compare another slot. Do not delete the original; give the game’s support team the records.',
        ],
        [
          'Memory headroom falls the longer you play',
          'Close unnecessary apps and compare for the same duration. If dedicated VRAM becomes tight, lower textures one step and record the result.',
        ],
        [
          'Several games crash, or the PC restarts too',
          'Check driver-update history and whole-PC failures rather than repeatedly reinstalling one game.',
        ],
      ],
    },
    paragraphs: [
      'Example: “Before: the game closes within five minutes every time I load the same save. Change: mods disabled only. After: the same scene runs for 20 minutes without closing.” This is a sample record, not a measured result. If it does not recur, do not declare a permanent fix; compare again during normal play. When asking for help, include the game and version, crash time, application name and exception code from the Windows record, and the checks you have tried.',
    ],
  },
  {
    id: 'cautions',
    title: 'Preserve saves and avoid speculative DLL fixes',
    paragraphs: [
      'Do not overwrite a mod-dependent save without first preserving it. Do not replace a DLL just because it is named as a faulting module or download files from unknown sources. Preserve saves and settings, then change one item at a time.',
    ],
  },
];
