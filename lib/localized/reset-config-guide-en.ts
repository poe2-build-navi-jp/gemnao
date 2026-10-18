import type { EnglishCommonGuide } from './common-guides-en';
export const resetConfigGuideEn: EnglishCommonGuide = {
 slug:'reset-config-file',path:'/guide/reset-config-file',topic:'launch',
 title:'Reset a PC Game Configuration File: Find, Preserve and Restore Settings',shortTitle:'Reset and restore a configuration file',
 description:'Identify the game’s configuration file, preserve it and saves separately, compare default settings, and restore the original if the problem remains.',
 lead:'For a black screen or launch failure after changing display settings or editing a configuration file. A configuration reset is a controlled comparison, not a reason to delete a game’s entire data folder.',
 summary:'Find the exact configuration file, copy it outside the game and synchronization folders, and preserve saves separately. Move only the identified configuration out of its load location, then compare a normal launch. If defaults help, restore needed settings individually; otherwise keep any newly generated file separately and return your original copy.',
 category:'Common PC game troubleshooting',checkedAt:'2026-10-18',
 sourcePolicy:'English edition of the Japanese guide, including its game-specific locations, preparation checklist, restoration and result checks. Capcom and Epic document their files; the Elden Ring location is attributed to a mod author, not publisher support. File regeneration and recovery were not tested in the games for this article.',
 branches:[
 {symptom:'Black screen immediately after a display change',action:'Revert that setting in the game first if its settings screen opens.',step:'step-1'},
 {symptom:'Launch failure after editing a configuration',action:'Prefer the pre-edit copy; otherwise preserve the current file before comparing defaults.',step:'step-2'},
 {symptom:'Settings return on the next launch',action:'Check saving, synchronization and launch overrides.',step:'reset-troubleshooting'},
 {symptom:'Missing progress or the whole PC restarts',action:'Preserve saves or follow the system-failure guide before configuration experiments.',step:'reset-decision'},
 ],
 steps:[
 {id:'step-1',title:'Identify configuration and saves separately',actions:[
 'Use the game-specific locations below to identify the exact file. For the listed Steam versions, Elden Ring uses GraphicsConfig.xml and Monster Hunter Wilds uses config.ini. Confirm the store, Windows account and actual installation; do not move the parent folder.',
 'In Windows 11 File Explorer, enable View → Show → File name extensions so the complete name is visible. If the in-game settings screen opens, first undo only the setting that triggered the problem.',
 ],next:'If the file cannot be identified confidently, stop and consult the game’s support instructions. Do not create a guessed configuration file.'},
 {id:'step-2',title:'Close the game and make independent copies',actions:[
 'Exit the game normally, wait for the launcher’s synchronization to finish, then close the launcher too. If a sync conflict appears, preserve the available versions before choosing one.',
 'Copy the configuration to a dated folder outside the game and any synchronized location. Record its original full path and check the copied name and size. Keep this untouched copy throughout the comparison.',
 'Back up saves separately using the actual game/store location. Elden Ring’s numbered data folder must not be moved with GraphicsConfig.xml. For Wilds, use its separate save-location guidance; the installation’s config.ini is not a progress backup.',
 ],next:'Complete the preparation checklist only after identifying the target, preserving configuration and saves, and recording the original path and symptom.'},
 {id:'step-3',title:'Move only the configuration and compare a launch',actions:[
 'Leaving the backup intact, move only the identified original configuration file from its load location into a separate holding folder. Do not remove the containing folder, save files or other similarly named files.',
 'Launch normally and compare the same symptom. Exit normally, then inspect the original location for a new configuration. Generation depends on the game and how far it started; do not assume a new file must always appear.',
 ],next:'Record both whether a new file appeared and whether the symptom changed. A generated file alone does not prove the problem is fixed.'},
 {id:'step-4',title:'Check persistence or restore the original',actions:[
 'If the problem improves, adjust graphics or key bindings one item at a time in the game. Exit normally and launch again to confirm those settings persist without recreating the problem.',
 'If it does not improve, close the game and launcher. Preserve any newly generated configuration separately, then copy the original backup back to its exact original path and filename. Identify any file already at that destination before replacing it.',
 'After restoring the original, move to an appropriate separate check such as installed-file verification or mod isolation. Record each change so results from several modifications are not confused.',
 ],next:'If progress appears missing, stop without creating a new save. Check the held files and active account before any further launch or synchronization choice.'},
 ],
 extraSections:[
 {id:'reset-decision',title:'Choose a reset only for the relevant symptom',actions:[
 'Display change followed by a black screen: undo the single setting in-game if possible. Manual config edit followed by launch failure: use your own pre-edit backup first. Comparing defaults is the next reversible option when the target file is known.',
 'Settings return after a restart: investigate saving/synchronization below. Missing progress needs save preservation; a whole-PC shutdown needs the separate power/temperature/system checks. Neither symptom should be treated as proof of a corrupt graphics configuration.',
 ]},
 {id:'reset-troubleshooting',title:'Use the result to choose the next check',actions:[
 'No new file: if the game opens, apply a setting and exit normally, then check the documented location again. Review the account/store and how far launch progressed. Do not manufacture an empty file or copy someone else’s settings to force this result.',
 'A new file appears but the fault remains: close everything, preserve the new file and restore your original. Then compare file verification or mods separately.',
 'Old settings return: inspect Steam Cloud where the game synchronizes settings, launch options and configuration managers one at a time. Record the original choices. If Cloud reports a conflict, compare dates, progress and preserved copies before selecting a version.',
 'Changes cannot be saved: inspect the target file’s Read-only attribute and any Windows protection notification. For Fortnite, Epic specifically instructs clearing Read-only on GameUserSettings.ini and applying the change. Do not disable security software broadly to make settings writable.',
 'Saves appear missing: exit without creating new progress and review the moved files and active account. Do not repeatedly launch or overwrite synchronized data while the intended save is uncertain.',
 ]},
 {id:'reset-record',title:'Keep four observations for support',actions:[
 'Record the game/store and what changed just before the symptom began.',
 'Record the exact file moved, original location and independent backup availability.',
 'Record whether a new configuration appeared and whether the original symptom changed.',
 'Record whether settings persisted on the next launch. Redact Windows usernames and account identifiers before sharing paths or screenshots.',
 ]},
 ],
 cautions:['Move only an identified configuration file; never delete its parent data folder.','Keep configuration and saves independently backed up, and preserve the original until restoration is verified.','Do not treat a missing file, a Cloud copy or another player’s configuration as evidence that it is safe to overwrite your data.'],
 faqs:[
 {question:'Does resetting settings delete my saves?',answer:'The listed Elden Ring GraphicsConfig.xml and Wilds config.ini are separate from their save files. Moving only the identified configuration is different from moving the parent folder. Other games can organize data differently; identify and preserve saves independently.'},
 {question:'Does Steam verification reset all settings?',answer:'No. Steam explains that some local configuration files are not verified. Checking installed game files and preserving/regenerating a user configuration are separate operations.'},
 {question:'Should I create the configuration if I cannot find it?',answer:'No. Check the PC version, store, Windows account and documented location. Some games create settings only after an initial launch or normal exit, and some manage them elsewhere. A guessed empty file is not a reliable repair.'},
 {question:'Why do the old settings return?',answer:'Cloud synchronization, launch options or a mod/configuration manager can override them. Compare one source at a time and record changes. A Cloud conflict requires preserving and identifying the intended version before choosing.'},
 {question:'Is someone else’s config a faster solution?',answer:'Its display layout, game version and mod environment may differ. First compare your own defaults and preserve your original. Importing unrelated settings can introduce another mismatch and obscure which setting caused the fault.'},
 ],
 sources:[
 {label:'Capcom: Wilds installation and configuration in troubleshooting',url:'https://steamcommunity.com/app/2246340/discussions/0/596267902352499417/'},
 {label:'Epic: Fortnite settings file and Read-only attribute',url:'https://www.epicgames.com/help/c-202300000001636/c-202300000001719/a202300000013484'},
 {label:'Elden Ring mod author: GraphicsConfig.xml location',url:'https://www.nexusmods.com/eldenring/mods/135'},
 {label:'Microsoft: File Explorer extensions and hidden files',url:'https://support.microsoft.com/en-us/windows/experience/fileexplorer/file-explorer-in-windows'},
 {label:'Steam: Cloud synchronization and conflicts',url:'https://help.steampowered.com/en/faqs/view/68D2-35AB-09A9-7678'},
 {label:'Steam: verification and local configuration files',url:'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB'},
 {label:'Epic: configuration files in Unreal Engine',url:'https://dev.epicgames.com/documentation/en-us/unreal-engine/configuration-files-in-unreal-engine'},
 {label:'Steam: backup scope and separately preserved data',url:'https://help.steampowered.com/en/faqs/view/4593-5CB7-DC3C-64F0'},
 ],
 related:[{href:'/en/guide/black-screen',label:'Black-screen checks'},{href:'/en/guide/save-data-backup',label:'Preserve saves separately'},{href:'/en/guide/verify-steam-files',label:'Verify installed game files'},{href:'/en/guide/remove-mods-safely',label:'Isolate mods safely'},{href:'/en/guide/steam-cloud-sync-error',label:'Steam Cloud conflicts'},{href:'/en/guide/pc-shuts-down-while-gaming',label:'Whole-PC shutdowns'},{href:'/games/monster-hunter-wilds/config-file',label:'Wilds config.ini guide (Japanese)'}],
};
