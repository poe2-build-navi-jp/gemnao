import type { EnglishCommonGuide } from './common-guides-en';
const cloud = 'https://help.steampowered.com/en/faqs/view/68D2-35AB-09A9-7678';
const cloudDev = 'https://partner.steamgames.com/doc/features/cloud';
const base = {
  category: 'Save protection and recovery',
  checkedAt: '2026-10-18',
  topic: 'save' as const,
  sourcePolicy:
    'English adaptation of the Japanese guide. Official documentation supports the save locations and tool behavior below; preservation order and decision examples are editorial guidance. No recovery or successful load is guaranteed. Follow the publisher’s instructions for your exact game, store and account.',
};
export const saveGuidesEn: EnglishCommonGuide[] = [
  {
    ...base,
    slug: 'save-data-backup',
    path: '/guide/save-data-backup',
    title:
      'Back Up PC Game Saves: Find Files, Verify Copies and Restore Safely',
    shortTitle: 'Back up and restore game saves',
    description:
      'Make a dated backup of PC game saves before updates or repairs. Find the correct files, verify copies and plan restoration without losing the current save or forcing a cloud overwrite.',
    lead: 'For local Windows game saves. A copy of the game installation is not necessarily a copy of its saves. Steam Cloud synchronizes supported data; it is not a promise that you can retrieve any earlier version you want.',
    summary:
      'For a healthy save, finish saving, close the game and let normal synchronization finish before exiting the launcher. Copy the confirmed save folder into a new dated backup without moving the original. If progress is already missing or a cloud conflict is present, preserve what remains before launching or retrying sync. Matching files are a copy check, not proof the game can load them.',
    branches: [
      {
        symptom: 'Preparing for an update, mod change or repair',
        action:
          'Find the correct save location while progress is still healthy.',
        step: 'step-1',
      },
      {
        symptom: 'Progress disappeared or a cloud conflict appeared',
        action:
          'Stop new saves and sync choices; preserve remaining candidates.',
        step: 'step-1',
      },
      {
        symptom: 'A copy exists but you are unsure it is complete',
        action: 'Compare the copied structure and contents.',
        step: 'step-3',
      },
      {
        symptom: 'You need to restore an older copy',
        action:
          'Read the separate restoration conditions before replacing active files.',
        step: 'safe-restore',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Identify the right save and close writers',
        actions: [
          'If progress is healthy, save normally and close the game. Let its usual cloud sync finish, then exit the launcher. Close this game on your other devices too. Copying while the game writes can capture an inconsistent set of files.',
          'If progress is already missing, corrupt or in conflict, do not create a new save, start the game to “check”, or retry synchronization first. Preserve the local files that remain on each device separately. Opening a game can autosave even if you never press Save.',
          'Use the publisher’s location for your Windows user, game edition and store. Cyberpunk 2077’s Windows support lists %USERPROFILE%\\Saved Games\\CD Projekt Red\\Cyberpunk 2077. Copy the relevant save-folder structure, not merely a screenshot or the game executable.',
          'For Stardew Valley on Windows, the official guide lists %APPDATA%\\StardewValley\\Saves. Preserve the whole character folder, including its same-named save, SaveGameInfo and any _old files. Do not rename or edit those candidates during backup. Other games can use entirely different layouts.',
        ],
        next: 'If the account, edition or required files are uncertain, stop and confirm with the publisher. With the game closed and the correct data identified, continue to STEP 2. A cloud conflict needs the related Cloud guide before any synchronization choice.',
      },
      {
        id: 'step-2',
        title: 'Copy into a new dated folder without replacing an older backup',
        actions: [
          'Create an outer folder named for the game, device and date/time, for example Game_PC-A_2026-10-18_1800. Inside it, copy the confirmed save folder with Ctrl+C and Ctrl+V. Keep internal names and folder structure. Use Copy, not Cut, and retain the active original.',
          'For the next backup, create a new dated outer folder. Keep an earlier known-good version separately; the newest file may already contain an unwanted change. Note the game version, store/account context and any required mods without publishing account identifiers.',
          'Use a destination outside the game’s active save and synchronization folders. A separate physical device adds protection against failure of the original drive; another folder on the same drive does not. Do not move the only copy to a removable drive or disconnect it while copying.',
        ],
        next: 'Keep both source and destination intact and continue to STEP 3. If copying reports an error or the source cannot be read, do not label the backup complete or delete the source to “start fresh”.',
      },
      {
        id: 'step-3',
        title: 'Check the copy and record what was actually verified',
        actions: [
          'In File Explorer, compare the source and backup folder Properties after counting finishes: file/folder counts and Size in bytes. Size on disk can differ between storage formats. Open the backup and check that expected save and companion files are present.',
          'A zero-byte expected save, copy error or mismatch needs investigation before any restore. Equal counts and sizes can catch omissions but do not prove identical content. Keep the original and all earlier snapshots while investigating.',
          'For an optional read-only comparison of a confirmed file, run Get-FileHash -LiteralPath "C:\\your-source\\actual-save-file" -Algorithm SHA256 in PowerShell, then repeat for its backup path. Replace the example paths with real files. Compare the Hash fields for each corresponding file; checking one file does not verify the entire folder.',
          'Record “counts and sizes checked”, “corresponding hashes match” or “loaded successfully in the matching game environment” separately. A matching hash confirms the copied contents, including any pre-existing corruption. It does not demonstrate that a save is complete, compatible or loadable.',
        ],
        next: 'If the copy checks pass, retain it without altering the active game just to test it. If restoration is needed, follow the conditions below; a load test can change active files through autosave.',
      },
    ],
    extraSections: [
      {
        id: 'safe-restore',
        title:
          'Before restoring: preserve the current state and control synchronization',
        actions: [
          'Restore only when the publisher supports file restoration for this game, store, account and version. Cross-store or cross-account transfer is not assumed. If you cannot identify the correct destination or required mod/version environment, stop and ask support.',
          'Close the game on every device. Make a new dated copy of the current local state, even if it looks wrong, and keep the backup you intend to restore unchanged. If a cloud conflict is open, preserve both available candidates using the Cloud guide first; do not choose one to make the dialog disappear.',
          'Before a supported restoration, record and disable this game’s Steam Cloud synchronization in its Properties where available. Confirm any separate publisher cross-progression or folder-sync service using that service’s own instructions. Do not assume the Steam setting controls all syncing. If you cannot prevent automatic overwrite safely, stop before replacing files.',
          'Exit the launcher, then use the publisher’s restore procedure to put a working copy of the selected backup into the confirmed active location. Retain the pre-restore snapshot separately and avoid mixing unrelated versions or deleting a whole user-data directory. Never operate on your only preserved copy.',
          'With synchronization still controlled, inspect the game’s load screen for the expected character, slot and progress. Starting or loading may autosave, so the independent copies must already exist. If progress is wrong, close the game and keep the snapshots; do not start on another device or attempt a chain of guesses.',
          'After confirming the desired progress, close the game and make a new backup of that verified local state. Do not immediately re-enable synchronization and accept an unexplained upload/download prompt. Use the Cloud guide and the publisher’s instructions to reconcile versions; if the proposed direction is unclear, leave the candidates preserved and ask support.',
        ],
      },
    ],
    cautions: [
      'Do not delete a save, empty Steam userdata or edit cloud metadata to force a conflict.',
      'Do not overwrite the only known-good backup, assume a newer timestamp means better progress, or run a bulk restore script.',
      'For server-side-only progress, local folder copying may not provide recovery. Ask the game publisher what can actually be backed up.',
    ],
    faqs: [
      {
        question: 'Does Steam Cloud replace dated backups?',
        answer:
          'No. Synchronization and preserving a chosen earlier state serve different purposes. Keep independent snapshots before updates, mod changes and repairs, particularly when the desired state may be overwritten.',
      },
      {
        question: 'Does a matching hash prove the game will load?',
        answer:
          'No. It checks file content equality, not game compatibility or save integrity. A perfectly copied corrupt save remains corrupt. Keep the verification claim limited to the check you performed.',
      },
      {
        question: 'Should I restore immediately to test a healthy backup?',
        answer:
          'Not necessarily. A restore or load test can change active data. Only do it with a publisher-supported plan, a separate copy of the current state and control over every relevant synchronization mechanism.',
      },
    ],
    sources: [
      {
        label: 'CD PROJEKT RED: Cyberpunk 2077 Windows save location',
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1706/where-are-my-game-saves-located',
      },
      {
        label: 'Stardew Valley: save location and companion files',
        url: 'https://www.stardewvalley.net/missing-corrupt-save-file-troubleshooting-guide/',
      },
      {
        label: 'Microsoft: Get-FileHash and content comparison',
        url: 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/get-filehash?view=powershell-5.1',
      },
      { label: 'Steam: Cloud conflicts and synchronization', url: cloud },
      { label: 'Steamworks: per-game Cloud settings', url: cloudDev },
    ],
    related: [
      {
        href: '/en/guide/steam-cloud-sync-error',
        label: 'Cloud error or conflict: preserve candidates before choosing',
      },
      {
        href: '/en/gear/save-backup-storage-guide',
        label: 'Choose a separate backup destination',
      },
      {
        href: '/en/guide/verify-steam-files',
        label: 'File verification and its limits',
      },
    ],
  },
  {
    ...base,
    slug: 'steam-cloud-sync-error',
    path: '/guide/steam-cloud-sync-error',
    topic: 'launch',
    title:
      'Steam Cloud Sync Error or Conflict: Preserve Saves Before Choosing a Version',
    shortTitle: 'Steam Cloud sync errors and conflicts',
    description:
      'Protect local and available cloud saves before resolving a Steam Cloud conflict. Compare play history across PCs, recognize when to stop and check progress without forcing an overwrite.',
    lead: 'For Steam Cloud warnings on Windows. “Unable to sync” and a choice between conflicting local/cloud versions are different states. Neither is a reason to delete files, force a new save or assume the newest timestamp contains the progress you want.',
    summary:
      'Do not launch past a synchronization warning or immediately choose a conflict candidate. Record the message and preserve local saves on each device, plus downloadable cloud files where available. Compare the last known successful play session and intended progress. If you cannot identify the right candidate and overwrite direction, stop with the copies intact.',
    branches: [
      {
        symptom: 'Steam says it is unable to sync',
        action:
          'Keep the game closed, preserve local data and check account/network state.',
        step: 'step-1',
      },
      {
        symptom: 'A local-versus-cloud conflict is displayed',
        action: 'Record both candidates before choosing either.',
        step: 'step-1',
      },
      {
        symptom: 'You used two PCs or played offline',
        action: 'Compare each device’s actual play and sync history.',
        step: 'step-2',
      },
      {
        symptom: 'You selected a version but progress looks wrong',
        action: 'Stop further saves and keep other devices closed.',
        step: 'step-4',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Keep the game closed and preserve every available candidate',
        actions: [
          'Record the complete warning and any local/cloud dates shown. Do not press a continue-playing or overwrite choice to dismiss it. Steam warns that playing despite a sync failure can create conflicting changes and lost progress; resolve the uncertainty before playing.',
          'With the game closed, locate its saves from the publisher’s documentation and copy them into a separate dated folder. For multiple devices, preserve each device’s local data under a distinct device label before opening the game there. Do not reconnect and launch an offline device just to force a sync.',
          'If the official Steam Remote Storage page exposes files for this game, sign in on Steam’s own site and download those files into a different preservation folder. Keep original file names and note the listed paths/dates. This page requires your own login; a missing listing is not proof that there is no recoverable progress.',
          'For a sync error without a conflict choice, record the Steam account in use, whether the game supports Steam Cloud and the game’s Cloud setting. Check ordinary connectivity and any official service notice while keeping the game closed. Do not disable security, clear save folders or toggle Cloud repeatedly as a repair method.',
        ],
        next: 'Once copies are preserved, compare history in STEP 2. If a relevant device or file cannot be accessed, do not treat the missing candidate as safely disposable; retain what you have and consult support.',
      },
      {
        id: 'step-2',
        title: 'Compare progress and synchronization history across devices',
        actions: [
          'For one PC, note the last session you know saved successfully, whether it was offline, and the character/slot or chapter you intended to keep. Use screenshots and notes from that session, not a new launch that could autosave.',
          'For two or more devices, make one row per device with its last play time, known progress and whether synchronization completed after exiting. Keep local backups separate even if file names match. Do not start the game on the next device while the first remains unresolved.',
          'Compare those records with the conflict timestamps, allowing for differing clocks or time zones. A timestamp describes a file event, not necessarily the desired chapter. A later new-game save can be newer than the progress you want. A Cloud status alone does not demonstrate that the selected save loads correctly.',
        ],
        next: 'If history clearly identifies a desired candidate and you have preserved the alternatives, read the conditional examples in STEP 3. If it does not, stop before selecting either version.',
      },
      {
        id: 'step-3',
        title: 'Choose only when the candidate and direction are understood',
        actions: [
          'Example, not a default rule: if PC A was the only device used and you know its preserved local save contains later offline progress, while the cloud candidate predates that session, the local candidate may be the intended one. Verify which choice uploads or retains it before confirming.',
          'Different example: if PC B completed the desired session and successfully synchronized, while PC A has an older local state, the cloud candidate on A may be the intended one. This depends on actual history and copies, not on the word “cloud” being inherently safer.',
          'If a later timestamp could be a new game, a different slot, a bad autosave or the wrong account, do not guess. Preserve the copies and ask the publisher or Steam Support which files and choice apply. Never manufacture a conflict by deleting cloud metadata or replacing files with empty data.',
          'For a plain sync error that clears after connectivity returns, there may be no candidate dialog to select. Do not create one deliberately. Keep the backup and proceed to a cautious progress check only when the warning is resolved and the expected version is understood.',
        ],
        next: 'If you can identify the intended candidate and the effect of the displayed action, follow that confirmed choice and continue to STEP 4. If the direction or progress remains uncertain, stop; this guide does not authorize an automatic local/cloud overwrite.',
      },
      {
        id: 'step-4',
        title:
          'Check the expected progress and avoid spreading a wrong version',
        actions: [
          'Before any load, retain all pre-selection copies. Inspect the load screen for character, slot, play time or chapter where the game exposes them. Launching or loading can autosave; do not rely on avoiding the Save button to keep files unchanged.',
          'If the expected progress is present, confirm only as much as needed, then exit normally. Keep a new dated copy of the confirmed local state and check that Steam finishes normal synchronization before using another device. Do not assume a successful sync makes older independent backups unnecessary.',
          'If progress is wrong, close the game, avoid further play and leave other devices closed. Preserve the current result as another labeled snapshot; do not delete the original candidates. Use the backup guide and the publisher’s supported restoration procedure, with synchronization controlled before replacement.',
          'For support, provide the exact warning, platform/store, affected devices and chronology without exposing passwords, account tokens or private save contents publicly. A recovered local file may still require the matching game version or mods. Stop if restoration would overwrite the only remaining copy.',
        ],
        next: 'Correct progress and completed synchronization: resume on one device at a time and retain backups. Wrong or uncertain progress: keep all candidates and use official support rather than repeating sync or overwrite choices.',
      },
    ],
    cautions: [
      'Do not choose solely by the newest timestamp, “local” or “cloud”. Neither label guarantees the intended progress.',
      'Do not delete Steam userdata, remotecache files, local saves or cloud files to force a reset.',
      'Do not turn off security or accept a destructive overwrite without independent copies and a confirmed direction. Some games have a separate publisher cross-save system that Steam Cloud settings do not control.',
    ],
    faqs: [
      {
        question: 'Can I play while Steam says it cannot sync?',
        answer:
          'Keep the game closed until you have preserved the saves and resolved the warning. Playing can create another changed version, making later conflict resolution harder and risking progress.',
      },
      {
        question: 'Which is always safer: local or cloud?',
        answer:
          'Neither. Use known play history and preserved candidates. The examples are conditional, not a recommendation to always upload the local copy or always download the cloud copy.',
      },
      {
        question: 'Remote Storage shows no files. Is my progress gone?',
        answer:
          'That listing alone cannot establish it. Check the account, game’s Cloud support and local copies. Server-side or publisher-managed progress can have different recovery procedures.',
      },
      {
        question:
          'Can I undo a wrong choice by clicking the other option later?',
        answer:
          'Do not rely on it. A selection or subsequent autosave may change what remains available. Keep independent copies before choosing; if you already chose incorrectly, stop play and seek a supported restore path.',
      },
    ],
    sources: [
      { label: 'Steam: Cloud conflicts and sync-error warnings', url: cloud },
      {
        label: 'Steamworks: synchronization and per-game settings',
        url: cloudDev,
      },
      {
        label: 'Steam Remote Storage: view your files after signing in',
        url: 'https://store.steampowered.com/account/remotestorage',
      },
    ],
    related: [
      {
        href: '/en/guide/save-data-backup',
        label: 'Copy checks and restoration stopping conditions',
      },
      {
        href: '/en/gear/save-backup-storage-guide',
        label: 'Keep a separate backup destination',
      },
      {
        href: '/en/guide/steam-game-not-launching',
        label: 'Launch problems after the Cloud warning is resolved',
      },
    ],
  },
];
