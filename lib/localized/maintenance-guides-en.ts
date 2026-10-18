import type { EnglishCommonGuide } from './common-guides-en';

export const maintenanceGuidesEn: EnglishCommonGuide[] = [
  {
    slug: 'remove-mods-safely', path: '/guide/remove-mods-safely', topic: 'mods',
    title: 'Remove PC Game Mods Safely: Managers, Manual Files and Workshop',
    shortTitle: 'Remove mods safely',
    description: 'Disable mods through their original installation method, preserve saves and load order, identify leftovers, and restore one compatible mod at a time.',
    lead: 'For a game that stopped launching or became unstable after a mod or game update. A disabled entry, an unsubscribed item and a clean game folder are different observations.',
    summary: 'Close the game and preserve saves plus the installation record. Use the manager for managed mods, move only positively identified additions for manual installs, and unsubscribe from individual Workshop items. Check each installation route before testing. Do not open and overwrite a mod-dependent save during a vanilla test.',
    category: 'Common PC game troubleshooting', checkedAt: '2026-10-18',
    sourcePolicy: 'English edition of the Japanese guide, including its backup, leftover and restoration checks. Nexus Mods documents deployment and purge; the other linked sources cover their own tools. The conservative comparison sequence is editorial guidance, not a tested removal recipe for every mod.',
    branches: [
      { symptom: 'Installed through Vortex or another manager', action: 'Record the profile, disable there and complete the tool’s deployment.', step: 'step-2' },
      { symptom: 'Copied files into the game manually', action: 'Match the original archive and paths before moving additions.', step: 'mods-backup' },
      { symptom: 'Subscribed through Steam Workshop', action: 'Record the item, unsubscribe, then check updates and in-game state.', step: 'step-2' },
      { symptom: 'Files remain after disabling', action: 'Check other installation routes; do not delete by filename alone.', step: 'mods-residue' },
    ],
    steps: [
      { id: 'step-1', title: 'Preserve saves and the installation record', actions: [
        'Let any pending game, manager or Steam synchronization finish, then close the game. Identify its save location using game-specific documentation and copy it outside the game folder. If the location is uncertain, stop before moving files.',
        'Record the game, enabled mods, active profile and load order. For manual installs, keep the publisher’s instructions and archive file list; for Workshop items, keep names and links. Create a dated holding folder outside the game and record each original relative path.',
      ], next: 'Keep the backup separate from the files being changed. A list of enabled mods is useful, but is not a copy of your saves.' },
      { id: 'step-2', title: 'Use the original installation method', actions: [
        'In the manager, select the correct game/profile and disable the suspected mod. In Vortex, complete Deploy Mods so the choice reaches the game. Purge Mods removes Vortex’s deployed links; it does not manage manually copied additions. For a virtual-file manager such as MO2, disable the mod in the intended profile and compare launches through that same manager.',
        'For a manual install, compare the distribution archive, installation record and actual game folder. Move only additions you can identify into the holding folder, preserving relative paths. Do not move original game files or whole folders shared with other mods merely because their names match.',
        'For Workshop, locate the game’s subscribed items and confirm the exact item. Unsubscribe one at a time, allow Steam’s downloads/updates to finish, then check the game’s mod menu if it has one. Do not manually erase the entire Workshop directory.',
      ], next: 'A game can use several installation methods at once. Check each applicable route before calling the installation mod-free.' },
      { id: 'step-3', title: 'Check leftovers and compare a launch', actions: [
        'Confirm the manager finished applying changes, the identified manual files left their original paths, and the Workshop item is no longer subscribed. If a remaining file’s owner is unclear, leave it alone until identified.',
        'Launch through the usual route and record whether the title screen opens. Do not load and overwrite an existing save that requires the removed mods. Only use separate new data if the game permits it without replacing progress.',
        'If original game files may be damaged, use Steam → game Properties → Installed Files → Verify integrity of game files after preservation. Verification repairs the installed game; it is not evidence that every added mod file was removed.',
      ], next: 'Compare the same launch conditions. If nothing changes, review the installation record instead of widening deletion to unknown folders.' },
      { id: 'step-4', title: 'Restore one compatible mod at a time', actions: [
        'Close the game. In a manager, review the saved profile, enabled list and load order before reapplying. For manual files, match the recorded relative path and check game-version compatibility first. Preserve any current file before replacement; if its identity changed, stop and investigate.',
        'For Workshop, resubscribe through the recorded item page, wait for updates and review in-game activation/load order. After each addition, test the title screen. If a mod brings the problem back, disable it again and check its supported version and dependencies. Do not overwrite saves just to test launch restoration.',
      ], next: 'Only resume a mod-dependent save when its required environment is restored and its independent backup is intact.' },
    ],
    extraSections: [
      { id: 'mods-methods', title: 'Match the removal and return paths', actions: [
        'Manager: preserve profile and enabled list → disable using that tool → confirm application of changes → restore through the same profile. Vortex deployment and MO2’s virtual view are not interchangeable operations.',
        'Manual copy: identify additions → move them outside the game while preserving paths → compare the original locations → return one compatible addition at a time.',
        'Workshop: record item pages → unsubscribe → wait for updates and inspect in-game state → resubscribe from those pages when restoring. Check for a second manual or managed copy if the mod still loads.',
      ] },
      { id: 'mods-backup', title: 'Keep paths as well as files', actions: [
        'Use Steam’s game management menu to browse the installed game, but locate saves separately. A save can be outside the installation folder. Follow the linked save-backup guide for independent copies and verification.',
        'Illustrative layout: game/mods/ExampleMod/file.pak becomes holding_YYYY-MM-DD/mods/ExampleMod/file.pak. These are example names, not files to search for and delete. Compare names and file counts after copying.',
        'If installation overwrote an original game file, simply removing the mod does not restore that original. Confirm that you retained its original copy or that the launcher can repair that particular installed file. Stop if the required original cannot be identified.',
      ] },
      { id: 'mods-residue', title: 'Interpret what remains', actions: [
        'Vortex says disabled but the game directory appears unchanged: check deployment. Its documented Purge Mods operation removes links it deployed, and Deploy Mods can restore those links. This does not remove manually installed files.',
        'MO2 and a direct game launch give different results: keep the profile and launch route consistent. Check for manual files outside the virtual setup instead of assuming either launch proves the other is clean.',
        'A manual file is still at its original path: compare archive contents, recorded location and installation history. A matching DLL name is insufficient identification. Never move a shared directory wholesale.',
        'A Workshop mod still appears: wait for updates and inspect the game’s activation settings, then check other installation routes. A stale entry or unsubscribed state alone does not prove the files in use.',
      ] },
      { id: 'mods-restore', title: 'Stop at a changed file or a returning error', actions: [
        'Restore managed mods through the recorded profile; apply deployment where required. Restore manual additions only to verified original paths. Restore Workshop items from their recorded pages and review load order.',
        'If a same-named file is now different, do not silently overwrite it. Check the current game version and author’s installation instructions. Keep the current state separately where a documented replacement is required.',
        'Test after each restored mod. A reproducible return of the symptom identifies a comparison worth reporting, not necessarily a defective mod: dependencies, load order and game versions can also matter.',
      ] },
    ],
    cautions: ['Never delete a DLL or folder solely by name.', 'A save may depend on removed mods. Keep it copied and avoid overwriting it during testing.', 'Do not bypass anti-cheat or a game’s mod restrictions to test an unsupported setup.'],
    faqs: [
      { question: 'Why are files still present after disabling a Vortex mod?', answer: 'Check whether deployment finished. Purge Mods concerns links Vortex deployed; manually added files have another owner. Identify them before moving anything.' },
      { question: 'Does Steam verification remove every mod?', answer: 'Treat it as verification and repair of installed game files, not a complete audit of additions. Check the manager, manual files and Workshop separately.' },
      { question: 'Can I move a DLL with the same name as one in a mod archive?', answer: 'Only after confirming it is your addition at the documented location. Another mod or the game may use the same filename. Stop when ownership is uncertain.' },
      { question: 'Why is a Workshop mod active after unsubscribing?', answer: 'Check pending updates and the game’s mod settings. Also look for a managed or manual installation of the same mod. Do not erase the whole Workshop folder.' },
      { question: 'Can I load my existing save without its mods?', answer: 'Not safely as a general rule. It may depend on added data. Preserve the save and test the title screen first; use separate new data only when the game allows it without replacing progress.' },
    ],
    sources: [
      { label: 'Nexus Mods: Vortex deployment, purge and restoration', url: 'https://github.com/Nexus-Mods/Vortex/wiki/MODDINGWIKI-Users-FAQ' },
      { label: 'Mod Organizer 2: developer releases and virtual-file behavior', url: 'https://github.com/ModOrganizer2/modorganizer/releases' },
      { label: 'Steam Workshop: subscriptions and game-specific management', url: 'https://steamcommunity.com/workshop/' },
      { label: 'Steam Support: verify installed game files', url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB' },
    ],
    related: [{ href: '/en/guide/save-data-backup', label: 'Back up saves before changing files' }, { href: '/en/guide/steam-game-not-launching', label: 'Steam game will not launch' }, { href: '/en/guide/reshade-uninstall', label: 'Remove ReShade' }, { href: '/en/guide/verify-steam-files', label: 'Verify installed game files' }],
  },
  {
    slug: 'uninstall-save-data', path: '/guide/uninstall-save-data', topic: 'save',
    title: 'Does Uninstalling a PC Game Delete Saves? Steam and Epic Checks',
    shortTitle: 'Uninstalling games and keeping saves',
    description: 'Separate installed game files from saves, check three documented Windows save locations, preserve a verified copy, and inspect progress after reinstalling.',
    lead: 'For removing one PC game to free space or reinstall it. Removing the Steam client, resetting Windows and manually cleaning AppData are wider operations.',
    summary: 'A save stored outside the files being removed remains only if that save location is left untouched. Identify the actual removal scope and copy saves outside it before uninstalling. Cloud support does not prove the latest progress has synchronized or that an older version can be recovered.',
    category: 'Common PC game troubleshooting', checkedAt: '2026-10-18',
    sourcePolicy: 'English edition of the Japanese guide and its three save-location examples. The scope comparison is based on publisher-documented paths, not hands-on testing of every store/version’s uninstaller. Relocated saves and additional user-data removal options change the outcome.',
    branches: [
      { symptom: 'Removing only one game through its launcher', action: 'Identify and copy its separate save location first.', step: 'step-1' },
      { symptom: 'Also cleaning AppData, Saved Games or userdata', action: 'Stop and check whether those folders contain saves.', step: 'uninstall-decision' },
      { symptom: 'Cloud reports a sync error', action: 'Preserve the intended local progress before removing anything.', step: 'step-2' },
      { symptom: 'Reinstalled, but progress is missing from the menu', action: 'Check account, paths and synchronization before saving again.', step: 'uninstall-after' },
    ],
    steps: [
      { id: 'step-1', title: 'Identify the game files and saves separately', actions: [
        'In Steam, right-click the game in Library and use Manage → Browse local files to inspect its installation. Locate its saves independently using publisher guidance or the examples below.',
        'Compare the planned removal scope with the actual save path. Similar game names in steamapps and AppData do not make those folders interchangeable. If the save location is unknown, identify it before uninstalling or cleaning folders.',
      ], next: 'Read any additional user-data removal choices. A game-specific uninstaller may offer more than removal of the installed program.' },
      { id: 'step-2', title: 'Check synchronization and the account', actions: [
        'If the game works normally, save and close it. For a Steam Cloud game, wait for synchronization to finish. If it reports an error, do not proceed on the assumption that the cloud must hold your latest progress.',
        'Review the game’s Cloud setting in Steam Properties → General, and record the store and account in use. Treat a publisher’s separate cross-save service separately. Do not toggle synchronization merely to inspect its current state.',
      ], next: 'Resolve uncertainty about the version you want to preserve before making a conflict choice or removing local data.' },
      { id: 'step-3', title: 'Copy saves outside the removal scope and compare', actions: [
        'Close the game and launcher after synchronization. Copy the identified save folder into a dated backup outside all folders that will be removed. A backup inside the game installation is not protected from removing that installation.',
        'Compare source and destination file/folder counts and Size in bytes in Properties, and check that the required files are present. The save-backup guide covers stronger verification and restoration; matching counts alone does not prove a save can load.',
        'Only after checking the copy, continue to the normal uninstall procedure below. For protection against drive failure as well as accidental removal, retain another copy on a separate physical device.',
      ], next: 'Keep the copy until the reinstalled game loads the intended progress. A successful uninstall is not a successful restoration test.' },
    ],
    extraSections: [
      { id: 'uninstall-decision', title: 'What exactly will be removed?', actions: [
        'Launcher removal of one installed game: separately stored saves are outside that scope, provided no additional save/user-data removal is selected. Back up before relying on this distinction.',
        'Manual removal of the installation directory: anything inside, including mods, configuration or misplaced backups, is in scope. Prefer the normal launcher operation when the aim is simply to remove the game.',
        'Cleaning AppData, Saved Games or Steam userdata: these can hold progress. Leftover does not mean disposable. Identify the contents instead of following a blanket cleanup list.',
        'Windows reset, drive formatting or deleting a user account: these affect a wider area. A backup elsewhere on the same affected drive may also be lost; preserve it outside the entire operation’s scope.',
      ] },
      { id: 'uninstall-examples', title: 'Three documented Windows save locations', actions: [
        String.raw`Cyberpunk 2077: %USERPROFILE%\Saved Games\CD Projekt Red\Cyberpunk 2077. This is separate from its normal installed game files. Removing this Saved Games folder also removes the local saves it contains. CD PROJEKT RED’s clean-install instructions explicitly include that additional removal after backing up; they are not the same as uninstalling only the game.`,
        String.raw`Baldur’s Gate 3: %LOCALAPPDATA%\Larian Studios\Baldur's Gate 3\PlayerProfiles\Public\Savegames\Story. Larian identifies each save as a folder here. Removing the parent Baldur's Gate 3 folder from AppData includes these saves; uninstalling files elsewhere does not itself target this path.`,
        String.raw`Stardew Valley, Windows Steam edition: %APPDATA%\StardewValley\Saves. Keep the character’s whole folder, including its actual save and SaveGameInfo. Removing Saves or its parent removes that local data. A missing Load-menu entry alone does not establish that all progress is gone.`,
        'These examples compare documented paths with removal scope. They do not guarantee all editions, custom save locations or installer options. Check the path on your PC and preserve the copy before proceeding.',
      ] },
      { id: 'uninstall-normal', title: 'Use the launcher’s normal uninstall operation', actions: [
        'Steam: Library → right-click the intended game → Manage → Uninstall. Check the title in the confirmation before proceeding. This concerns one game, not uninstalling the Steam client.',
        'Epic Games Launcher: Library → the game’s three-dot menu → Uninstall, then review the confirmation. The Early Preview layout can put Library in the top bar and the menu on the selected game; follow the linked Epic instructions for your version.',
        'If a separate uninstaller offers to remove saves, settings or user data, do not select removal of data you want to retain. After the ordinary uninstall, inspect the save location and compare file presence with your record. Loadability must still be checked after reinstalling.',
      ] },
      { id: 'uninstall-after', title: 'If progress does not appear after reinstalling', actions: [
        'Reinstall through the same store/account and inspect the save location before launch. Compare the character and progress in the Load menu with your record. Only a successful load confirms that the expected progress is usable.',
        'Files exist but the Load menu is empty: check the Windows user, store/game account and folder nesting. Do not delete files just because the menu does not list them.',
        'Local files are missing but an independent copy exists: use the save-backup guide’s restoration procedure. Preserve current data before any replacement and manage synchronization according to the game/store guidance.',
        'A Cloud conflict or sync error appears: pause launch and new saves until you identify the wanted progress and timestamps. Use the Cloud troubleshooting guide; do not choose solely by a larger file size or newer time.',
        'No local copy is found: inspect the Recycle Bin, other Windows accounts and known external/cloud backups. Recovery without a retained copy is not guaranteed. Server-stored progress also depends on the correct game account/server; cross-store transfer is a separate compatibility question.',
      ] },
      { id: 'uninstall-record', title: 'Keep a short record before removal', actions: [
        'Removal: one game only, or which additional folders and data? Retained save: original path, game/store/account and expected progress. Backup: location outside removal scope and the result of the copy comparison.',
        'Write the removal and backup locations separately. Redact Windows usernames and account identifiers before sharing a record publicly.',
      ] },
    ],
    cautions: ['Stop if you cannot identify the save location or the scope of removal.', 'Do not use a clean-install cleanup list merely to free the game’s disk space.', 'Cloud synchronization and an independent backup serve different purposes.'],
    faqs: [
      { question: 'Does uninstalling in Steam force me to start again?', answer: 'Not if a compatible save is retained and the reinstalled game can load it under the correct account/environment. If it is absent from the menu, inspect paths and synchronization before assuming it was deleted.' },
      { question: 'Will reinstalling repair a corrupt save?', answer: 'Reinstalling the program and repairing progress are different tasks. The same damaged save may still fail. Preserve it and investigate a known-good backup or the game’s documented recovery process.' },
      { question: 'Can I skip the copy because the game supports Steam Cloud?', answer: 'Cloud support does not establish that your last session synchronized, and does not guarantee a selectable historical version. An independent copy preserves a state you deliberately chose.' },
      { question: 'Is uninstalling Steam itself equivalent?', answer: 'No. Its scope is wider, especially if you manually remove Steam’s entire folder and userdata beneath it. Identify every relevant save and preserve it outside that scope.' },
      { question: 'Should I delete the save folder to start over?', answer: 'Use the game’s New Game or save-slot controls first. Manual removal can affect every slot, and cloud data may return. A deliberate progress reset is separate from ordinary game removal.' },
    ],
    sources: [
      { label: 'CD PROJEKT RED: clean installation and separate save-folder removal', url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/2233/how-do-i-perform-a-clean-install-of-the-game' },
      { label: 'Larian: Baldur’s Gate 3 save location', url: 'https://larian.com/support/faqs/multiplayer-issues_84' },
      { label: 'Stardew Valley: save folders and required files', url: 'https://www.stardewvalley.net/missing-corrupt-save-file-troubleshooting-guide/' },
      { label: 'Steam Support: Manage → Uninstall in disc-install preparation', url: 'https://help.steampowered.com/en/faqs/view/4566-6D94-3A46-953A' },
      { label: 'Steam Support: Cloud settings and conflicts', url: 'https://help.steampowered.com/en/faqs/view/68D2-35AB-09A9-7678' },
      { label: 'Epic Games: uninstall a game through the launcher', url: 'https://www.epicgames.com/help/c-32735058/c-36403860/a12795838?lang=en-US' },
    ],
    related: [{ href: '/en/guide/save-data-backup', label: 'Copy, verify and restore saves' }, { href: '/en/guide/steam-cloud-sync-error', label: 'Steam Cloud errors and conflicts' }, { href:'/en/guide/reset-config-file',label:'Reset a configuration file' }, { href: '/en/guide/remove-mods-safely', label: 'Remove mods while preserving progress' }, { href: '/en/guide/verify-steam-files', label: 'Verify installed game files' }],
  },
];
