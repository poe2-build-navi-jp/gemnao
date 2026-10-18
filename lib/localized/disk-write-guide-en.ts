import type { EnglishCommonGuide } from './common-guides-en';
export const diskWriteGuideEn: EnglishCommonGuide = {
 slug:'steam-disk-write-error',path:'/guide/steam-disk-write-error',topic:'launch',
 title:'Steam Disk Write Error: Check the Target Drive and Repair Scope',shortTitle:'Steam disk write error',
 description:'Identify the game’s actual drive, check free space, distinguish Steam folder repair from file verification, and stop repeated retries when storage symptoms extend beyond Steam.',
 lead:'For installation or update failures that report a disk write error. A Steam library on D: can fail even when Steam itself is installed on C: with ample free space.',
 summary:'Identify the affected game’s destination before checking capacity. After a normal restart and one controlled retry, consider Steam’s library-folder repair if the drive is stable. That repair addresses library permissions needed for updates, not every disk error. Confirm completion of the same update and a successful launch; wider storage failures need preservation and device support.',
 category:'Common PC game troubleshooting',checkedAt:'2026-10-18',
 sourcePolicy:'English edition of the Japanese guide and its drive, capacity and result checks. Steam documents Repair Folder as repair of library-folder user permissions, separately from game-file verification. The exact permissions changed and every client layout are not documented here; this is not an on-device repair test or a diagnosis of drive health.',
 branches:[
 {symptom:'Steam is on C: but this game is elsewhere',action:'Confirm the game’s path and inspect that drive first.',step:'disk-target'},
 {symptom:'The target drive has little free space',action:'Compare capacity with the update, allowing for unpacking and replacement.',step:'disk-space'},
 {symptom:'Stable drive, but the same update still fails',action:'Check the affected library and use the bounded Steam repair.',step:'step-3'},
 {symptom:'Drive disappears, makes unusual noises or other apps cannot save',action:'Stop repeated updates and prioritize data preservation and support.',step:'disk-check'},
 ],
 steps:[
 {id:'step-1',title:'Identify the destination and check its free space',actions:[
 'Record the game name, error and progress in Steam Downloads. Use Settings → Storage to identify its library. For an installed game, inspect the actual folder through Properties → Installed Files → Browse and note its drive letter.',
 'Open File Explorer with Windows+E, then This PC, and inspect free space on that drive. For a new installation, check the selected destination. If Steam is on C: and the game is on D:, start with D:; also check C: if the update remains blocked.',
 'The displayed download size is not a guaranteed measure of working space for unpacking or replacing existing files. If room is limited, review your own removable files or use Steam’s documented storage/move controls for a suitable destination. Do not delete unfamiliar game or Steam folders to make room.',
 ],next:'Record drive letter, free space and update progress together. There is no universal number of free gigabytes that guarantees every game update.'},
 {id:'step-2',title:'Restart normally and retry the same update once',actions:[
 'Exit Steam normally, save other work and restart the PC. For external storage, first confirm the expected drive and library are recognized in Windows and Steam. Do not repeatedly retry an update to a missing drive.',
 'Resume the same installation/update in Downloads. Record whether it completes, fails at the same point or fails during disk activity. Do not keep retrying without a new observation or relevant change.',
 ],next:'If the drive disconnects or other storage warning signs appear, skip repeated repair attempts and move to the preservation/support conditions below.'},
 {id:'step-3',title:'Repair the affected library, then verify the outcome',actions:[
 'Steam’s documented path is Settings → Storage → … → Repair Folder. Before confirming, identify the library associated with the failed game in the current screen. If the target is unclear or the option differs, consult Steam support rather than choosing another drive by guesswork. The operation repairs library-folder permissions used for updates; it is not a general hardware repair.',
 'After the operation finishes, resume that same game in Downloads. Confirm both download and installation/update completion without the original error, then try launching the game. The repair’s completion message alone does not establish success.',
 'If only this installed game still fails, preserve saves/mod records and use Properties → Installed Files → Verify integrity of game files, then recheck update and launch. If security software logged a matching event, examine its file/path and official guidance; do not blindly restore quarantined files or disable protection.',
 ],next:'Folder repair and game-file verification have different targets. Use the observed result to choose the next branch instead of repeating both indefinitely.'},
 {id:'step-4',title:'Investigate storage when failures extend beyond one game',actions:[
 'If several games on the same drive fail, Windows also cannot save, or the drive disappears, prioritize important files and saves. Stop update/repair retries if there are unusual mechanical noises or frequent disconnects. For irreplaceable data on a potentially failing drive, seek recovery advice before adding load.',
 'With the data preserved and the device stable, use the Windows or manufacturer’s documented error-checking procedure for the identified drive. Record the exact result and any repair request. Save work before a requested restart; do not proceed with an unclear repair or an unprotected copy of important data.',
 'If errors recur after the indicated repair, multiple apps still fail or the drive disconnects/noises persist, contact the drive/PC manufacturer. If only Steam fails and checks detect no issue, provide Steam support with the error, progress, capacity and results. A clean file-system check is not proof of healthy hardware.',
 ],next:'Do not format a drive, reset permissions across it, or repeatedly run aggressive repair commands as a general response to a Steam error.'},
 ],
 extraSections:[
 {id:'disk-target',title:'The Steam client’s drive is not necessarily the game’s drive',actions:[
 'Installed game/update: inspect its actual installation path and compare it with Steam Settings → Storage. New installation: inspect the chosen destination rather than assuming the default library.',
 'External library missing: compare Windows recognition and Steam’s library view with your earlier record. If the device is not reliably present, do not repeatedly repair or start a new installation to another guessed path.',
 'Example: the game’s Browse action opens D:, while Steam runs from C:. Check D: first. To move an installed game, use the linked Steam moving guide rather than manually cutting a folder while Steam is updating it.',
 ]},
 {id:'disk-space',title:'Read capacity and update size together',actions:[
 'In This PC, record free space for the actual destination; its drive Properties also identifies capacity. Keep the C: and D: readings distinct when both exist.',
 'Illustrative example: D: has 4 GB free and the update displays a 6 GB download, while C: has 80 GB free. The C: number does not solve D: capacity. These are invented comparison figures, not a tested game requirement.',
 'Even 40 GB free beside a 2 GB download is not a universal guarantee: an update may need additional working space. Review Steam’s requirements/status, clear only identified expendable files or choose a suitable supported library, then confirm the capacity actually changed.',
 ]},
 {id:'disk-repair',title:'Keep Repair Folder within its documented scope',actions:[
 'The Steam support article explains that library-folder user permissions required for updates can become damaged and names Repair Folder under Storage. It does not list every permission changed or establish that all disk-write failures share that cause.',
 'Select the affected library only when its identity is clear. After repair, complete the same update and launch check. Do not extend the procedure into manual drive-wide permission changes or broad administrator exceptions.',
 'If this game alone remains affected, verification is a separate installed-file check. Keep saves and mod records before it and record whether the same update now succeeds.',
 ]},
 {id:'disk-results',title:'Choose the next check from the actual result',actions:[
 'Update completes and the game launches: record the date, drive and change. No extra reinstall or disk repair is justified by the resolved symptom alone.',
 'One game fails while others on that drive work: investigate its files and any matching protection history. A logged block is a reason to examine provenance, not an instruction to restore the file automatically.',
 'Several games or normal saves on one drive fail: preserve data and investigate storage. An external drive repeatedly disappears: stop updates and use safe manufacturer checks for connection/power; repeated loss warrants support.',
 'Only Steam fails and storage checks report no detected problem: provide Steam support the complete error, affected stage, target path/drive, space and repair/verification results. Redact personal usernames or account identifiers from public logs.',
 ]},
 {id:'disk-check',title:'Checking and repairing are different operations',actions:[
 'Use the exact drive identified earlier and follow Windows/device guidance. Note whether it reports no detected error, requests a repair or cannot complete. An error-free file-system result cannot rule out an intermittent connection or physical fault.',
 'Microsoft’s chkdsk reference distinguishes reporting from repair options such as /f and /r. Do not copy repair commands into a terminal as a routine next step: repair changes the file system and a sector scan can take substantial time. Preserve important data and understand the device-specific recommendation first.',
 'If safe, one post-repair attempt at the same update can show whether that symptom changed. Stop if failures across applications, disconnects or unusual noises continue; take the recorded result to the manufacturer instead of repeating scans.',
 ]},
 ],
 cautions:['A missing or unstable drive is a reason to stop retries, not to keep repairing Steam.','Do not disable antivirus, restore unidentified quarantined files or reset whole-drive permissions as standard steps.','Preserve saves and important data before file repair; seek help before stressing a potentially failing drive.'],
 faqs:[
 {question:'Steam is on C: and the game is on D:. Which free-space figure matters?',answer:'Confirm the game’s actual path and check D: first. Steam Storage also identifies the library. Inspect C: as well if the update stays blocked, but do not substitute its free space for the game destination’s.'},
 {question:'How many free gigabytes are enough?',answer:'There is no fixed value for every update. Download size can differ from the space needed to unpack and replace files. Record the target’s capacity and Steam’s status and allow room appropriate to that update.'},
 {question:'Repair Folder finished. Is the error fixed?',answer:'Not yet established. Resume the same update, confirm installation completes and try launching. Folder repair success is not proof that the game update or the drive is healthy.'},
 {question:'There is free space, but only one game fails. What next?',answer:'After the bounded library repair, consider verification of that installed game and record the next update result. Examine any matching security event without blindly restoring files or weakening protection.'},
 {question:'When should I investigate the drive?',answer:'Failures in several games or Windows saves, disconnects, unusual noises or a Windows disk warning broaden the concern. Prioritize data preservation and device support; do not repeatedly force updates or scans on unstable storage.'},
 ],
 sources:[
 {label:'Steam Support: update/installation issues and library-folder repair',url:'https://help.steampowered.com/en/faqs/view/21F5-8D5D-0141-7A5E'},
 {label:'Steam Support: verify installed game files',url:'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB'},
 {label:'Steam Support: moving installed games',url:'https://help.steampowered.com/en/faqs/view/4BD4-4528-6B2E-8327'},
 {label:'Microsoft: check and manage free drive space',url:'https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/free-up-drive-space-in-windows'},
 {label:'Microsoft Learn: file-system checking versus repair',url:'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/chkdsk'},
 {label:'Steam Support: software that can interfere with Steam',url:'https://help.steampowered.com/en/faqs/view/1F39-DCB4-FF28-5748'},
 ],
 related:[{href:'/en/guide/verify-steam-files',label:'Verify Steam game files'},{href:'/en/guide/steam-game-not-launching',label:'Steam launch failures'},{href:'/en/guide/steam-cloud-sync-error',label:'Cloud synchronization errors'},{href:'/en/guide/save-data-backup',label:'Preserve and verify save backups'}],
};
