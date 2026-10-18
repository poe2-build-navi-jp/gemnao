import type { LocalizedArticle } from './types';
const source = (id:string,label:string) => ({label,url:`https://support.discord.com/hc/en-us/articles/${id}`});
const general=source('31623498041623-Discord-Troubleshooting-Guide','Discord: general troubleshooting and Cache location');
const installer=source('209099387--Windows-Installer-Errors','Discord: Windows installer errors');
const corrupt=source('115004307527--Windows-Corrupt-Installation','Discord: corrupt Windows installation');
const status={label:'Discord Status: official service incidents',url:'https://discordstatus.com/'};
const download={label:'Discord: official downloads',url:'https://discord.com/download'};
const support={label:'Discord: contact support',url:'https://support.discord.com/hc/en-us/requests/new'};
const step=(n:number,title:string,summary:string,actions:string[],note?:string)=>({id:`cause-${n}`,title,summary,time:'Compare one change before continuing',actions,...(note?{note}:{})});
const row=(symptom:string,cause:string,n:number)=>({symptom,cause,stepId:`cause-${n}`});
const link=(slug:string,label:string)=>({href:`/en/discord/${slug}`,label});
const base={locale:'en' as const,gameSlug:'discord',gameName:'Discord',checkedAt:'2026-10-18',sourcePolicy:'English adaptation of the Japanese guide, retaining its comparison sequence, restoration and stopping conditions. Official Discord documentation was reviewed; the comparisons and log-reading examples are editorial guidance, not a claim of a reproduced fault or a guaranteed repair. These Windows instructions concern the standard desktop client.'};
export const discordLaunchEn: LocalizedArticle[] = [
{
 ...base,slug:'not-opening',title:'Discord Will Not Open on Windows: No Response, Immediate Exit or Gray Screen',shortTitle:'Discord will not open',
 description:'Separate a hidden Discord process, an app-only launch fault, connection trouble and login errors. Preserve Cache before comparing and prepare sign-in access before reinstalling.',
 lead:'For the Windows desktop app: clicking Discord does nothing, a window closes immediately, or the logo/gray screen never reaches your conversations.',
 summary:'Fully quit Discord and launch once from Start. Compare actual conversations in the browser on the same PC. If only the app fails, preserve and rename its Cache folder before considering a reinstall. Follow the separate update or installation guide when an explicit error names that stage.',
 quickFacts:[{label:'First check',value:'Quit remaining Discord processes and launch once from Start'},{label:'Useful comparison',value:'The same account’s conversations load at discord.com/app'},{label:'Before local reset',value:'Keep sign-in access and a recoverable copy of the targeted data'}],
 diagnosis:[row('No window, but Discord remains in Task Manager','Quit the tray app and remaining identified Discord processes.',1),row('Window opens briefly, then the process disappears','Record the error/time and compare the browser.',2),row('Logo or gray screen never progresses','Test conversations in the browser; compare loading-specific checks.',2),row('Browser works; only the app fails','Preserve and rename Cache after fully quitting.',3),row('Neither app nor browser loads conversations','Check service status, other sites and login errors before uninstalling.',2),row('Update Failed or Installation has failed appears','Use the guide for the exact stage and message.',5),row('Security notification appears at launch','Inspect its time, file and detection instead of guessing.',4)],
 steps:[
 step(1,'Fully quit and check a fresh launch route','Closing a window can leave Discord running. A Start-menu launch also helps separate an old shortcut.',[
 'If Discord appears in the Windows notification area, including hidden icons, right-click it and quit. Warn anyone in an active call/stream first because quitting disconnects it.',
 'Open Task Manager with Ctrl+Shift+Esc. Under Processes, end remaining entries you have identified as Discord.',
 'Once Discord is gone, wait about 30 seconds, find Discord in Start and open it once. Check whether conversations load, not just whether a window appears.',
 'If Start works, use that route and replace the obsolete shortcut. Otherwise save work, restart Windows, try once again and continue to Step 2.',
 ],'Do not end every Update.exe or similarly named process by name alone. This initial check targets entries positively identified as Discord.'),
 step(2,'Compare the browser, connection and sign-in stage','A public landing page loading is not the same as the account’s conversations loading.',[
 'Open https://discord.com/app in Edge or Chrome on the same PC. Verify the official domain before signing in, then inspect the conversation list.',
 'If conversations open, the browser can provide temporary access while you investigate the desktop app in Step 3.',
 'If the browser also stalls, check Discord Status and try another website. When a relevant incident is reported, recheck after recovery.',
 'If other sites fail too, investigate the connection first. If only Discord fails, an empty status page still does not prove the PC is the cause.',
 'If the failure is at email, password or authentication-code entry, use the login guide. For a persistent logo or gray screen, also use the loading-stuck comparison.',
 ],'A working browser narrows the next checks; it does not prove the desktop Cache is corrupt.'),
 step(3,'Preserve Cache and compare only an app-specific failure','Renaming the documented Cache folder keeps the comparison reversible. It is not a full data-folder or account reset.',[
 'Fully quit Discord as in Step 1. Press Windows+R, enter %APPDATA%/discord and open it.',
 'Rename only Cache to a unique name such as Cache.backup-20261018, using your work date. If it is absent, do not create it or target an unrelated folder.',
 'Launch Discord and check conversations. If it works, quit and reopen to confirm another normal launch.',
 'To restore, quit Discord, move or rename any newly generated Cache separately, then return the preserved folder to the exact name Cache. Do not overwrite or mix the contents.',
 'If renaming fails, check for a remaining Discord process and retry after a restart. If access is still denied, record it and continue to Step 4 without changing ownership or forcing deletion.',
 ],'Confirm access to your email, password and two-factor authentication first in case sign-in is required. Server membership/messages and local settings/session state are different. Keep the backup private until stable operation is confirmed.'),
 step(4,'Inspect a matching block notification','Failure to open is not proof that security software blocked the app.',[
 'In Windows Security → Virus & threat protection → Protection history, look for events near the failed launch time. For another security product, inspect its own history.',
 'Record the affected path, detection and action. Do not release quarantine or add exclusions merely because the filename contains Discord.',
 'If the installer came from an unofficial site, stop using it and obtain the official download. If the official file is detected too, consult the security provider or administrator.',
 'If there is no matching record and Cache preservation made no difference, continue to Step 5. On a managed PC, check installation/execution permission with its administrator.',
 ]),
 step(5,'Prepare sign-in access before reinstalling','Use this later step when the app still fails after the earlier comparisons. Follow a specific error guide if the failed stage changes.',[
 'Confirm email/password and two-factor authentication or backup-code access. Keep an already signed-in phone or other device signed in.',
 'Uninstall Discord through Windows Settings → Apps → Installed apps, or Apps & features on Windows 10.',
 'With Discord closed, use Windows+R → %APPDATA% and then %LOCALAPPDATA% to inspect the remaining Discord folder in each location.',
 'If local data/settings need preserving, copy each target to a separate clearly named private location first. Following the official reinstall procedure, remove only the remaining Discord folders; never the entire AppData or Local folders.',
 'Restart Windows and reinstall from https://discord.com/download. Sign in, confirm conversations open, then quit and reopen once.',
 'For Update Failed, use the update guide; for Installation has failed, use the installer guide. If the app still closes immediately, record the crash conditions for the separate crashing guide.',
 ],'Returning the entire old data folder can also return the fault. Reinstallation is not account/server deletion, but local preferences and sign-in state may need to be rebuilt.'),
 ],
 avoid:['Do not repeatedly launch overlapping copies or kill unrelated updater processes.','Do not reset all AppData, force ownership changes or disable security protection to bypass an unexplained block.'],
 cautions:['For support, record the visible screen/error, time, browser result, each comparison and Windows version from winver.','Keep original backups/logs private; redact email addresses, Windows usernames and DM content in shared copies.','A working website alone is not a completed sign-in or conversation comparison.'],
 faqs:[{question:'Should I run Discord as administrator first?',answer:'Start with a full quit and browser comparison. Official guidance mentions elevated execution for some cases, but it is not a universal fix. Limit it to an identified permission issue and consult the administrator on a managed PC.'},{question:'Does moving Cache delete messages or my account?',answer:'It is not an account, server-membership or sent-message deletion. Local session behavior may still change, so ensure you can sign in again before working on app data.'},{question:'Can I keep communicating while the app fails?',answer:'If the same account’s conversations work in the browser, use that temporarily. Calls also need the browser’s microphone permission and appropriate device settings.'},{question:'What if there is no Cache folder?',answer:'Skip that change. Do not create one or delete a different app’s similarly named data. Record its absence and continue using the browser comparison and exact error.'}],
 sources:[general,installer,status],
 related:[link('loading-stuck','Discord stuck loading'),link('update-failed','Update Failed and retry loops'),link('installation-failed','Installation has failed'),link('crashing','Discord closes or crashes'),link('login-error','Discord login errors')],
},
{
 ...base,slug:'loading-stuck',title:'Discord Stuck Loading: Compare the Browser Before Resetting the Windows App',shortTitle:'Discord stuck loading',
 description:'Separate a logo or gray loading screen from account and connection failures. Compare conversations in the browser, fully quit the app, and preserve Cache before resetting it.',
 lead:'For the Windows desktop app when the logo/spinner or a gray screen never reaches the server/chat list, including a stall after signing in.',
 summary:'On the same PC and connection, check whether the same account’s conversations open in the browser. If the browser works, fully quit and reopen the app before preserving Cache. If both fail, check incidents and connectivity first. Screen color alone does not identify the cause.',
 quickFacts:[{label:'Compare actual conversations',value:'A login screen or landing page alone is not enough'},{label:'Only the app fails',value:'Fully quit, restart, then compare preserved Cache if needed'},{label:'Both fail',value:'Check incidents and the same PC on another permitted connection'}],
 diagnosis:[row('Logo stalls; browser conversations work','Does a complete app quit resolve it?',2),row('Gray screen; browser conversations work','Compare after a full quit, regardless of screen color.',2),row('Only the app still stalls after restart','Preserve Cache before comparing.',4),row('Neither app nor browser opens conversations','Check incidents, other sites and another connection.',3),row('App works; browser stalls','Compare a private window or another browser.',1),row('Update Failed or installation-corruption message','Record the exact message and use its specific guide.',5)],
 steps:[
 step(1,'Compare the same account in the browser','This tests a usable Discord session from the same connection, not the underlying reason for an app-only stall.',[
 'On the affected PC, open https://discord.com/app and, where possible, sign in to the same account as the desktop app. Verify the domain first.',
 'Check that the server/chat list loads and an existing conversation opens. A sign-in screen alone does not complete the comparison.',
 'If the browser works and only the app stalls, continue to Step 2. If both stall, continue to Step 3.',
 'If only the browser fails, compare a private window or another browser before inspecting extensions and stored site data. Keep sign-in access available before clearing anything.',
 ],'If authentication prevents reaching conversations, mark the comparison unconfirmed. A gray screen or logo does not identify a particular cause.'),
 step(2,'If the browser works, fully quit the app','Remaining background processes can survive a closed window.',[
 'In the Windows notification area, expand hidden icons if needed and quit Discord from its icon. This disconnects any call or stream.',
 'Open Task Manager with Ctrl+Shift+Esc and end remaining identified Discord processes.',
 'Reopen once and check the chat list. If normal loading returns, stop making changes.',
 'If it still stalls, save work and restart Windows. If only the app remains affected afterward, continue to Step 4.',
 ]),
 step(3,'If both fail, check the service and connection','Resetting app Cache does not isolate a failure shared by the browser.',[
 'Check https://discordstatus.com/ for a relevant incident and wait for recovery if one matches. No posted incident does not rule out an unreported or local connection issue.',
 'Open another website in the same browser. If other sites fail, inspect the PC’s Wi-Fi/router/connection first.',
 'If available and permitted, compare the same PC on another connection such as your own hotspot. Consider data costs, then return to the original network. Success only elsewhere points toward the original connection or restrictions.',
 'If other sites work but Discord does not, check Windows Settings → Time & language → Date & time for automatic time, and inspect VPN/proxy/firewall restrictions affecting Discord. Record existing settings and avoid changing multiple variables.',
 ],'Do not bypass company/school restrictions or leave protection disabled. Ask the administrator about managed settings and restore any unhelpful personally controlled comparison.'),
 step(4,'If only the app stalls, preserve Cache','Use this after a full app quit and Windows restart have failed to help the app-only symptom.',[
 'Fully quit Discord as in Step 2 and confirm its processes are gone. Keep email/password and two-factor authentication available in case another sign-in is needed.',
 'Open Windows+R and enter %APPDATA%/discord. Record this path and the intended backup name.',
 'Rename only Cache to an unused name such as Cache_before_loading_fix. If it is absent, do not create it or delete a different folder.',
 'Reopen and inspect conversations. To undo an unhelpful result, quit again, keep the newly generated Cache separately and restore the old folder’s exact name without mixing or overwriting contents.',
 ],'This does not reset every file outside Cache. Keep the original private until testing is complete and distinguish it from the entire Discord settings folder.'),
 step(5,'Follow explicit update or corruption errors','A named update/installation error needs its own comparison path.',[
 'Record the exact displayed error and time it appeared.',
 'For Update Failed, use the linked update-loop guide to compare update connectivity and processes.',
 'If installation corruption is explicitly reported, review Discord’s corrupt-installation instructions and the installer guide before reinstalling. Removing whole app-data folders is a different, wider operation than preserving Cache and requires sign-in preparation.',
 ]),
 ],
 avoid:['Do not infer a cause from screen color or a working login page.','Do not delete the entire Discord folder as the first Cache test or disable network protection to bypass a restriction.'],
 cautions:['If both clients still fail on another connection, retain the incident/login observations for support.','If only the app fails, include Windows version, exact error and full-quit/Cache results. Mark unavailable comparisons as unconfirmed.','Redact personal details in screenshots and keep preserved app data private.'],
 faqs:[{question:'Do a logo screen and a gray screen need different fixes?',answer:'Their colors do not identify the cause. First compare actual browser conversations on the same PC. A browser-only success leads to app checks; failure in both leads to incident/connection checks.'},{question:'Does the browser login screen prove the desktop app is broken?',answer:'No. Reach the server/chat list and a conversation before treating it as a successful session. If sign-in fails, record the authentication error and leave the comparison unconfirmed.'},{question:'Will preserving Cache remove servers or messages?',answer:'This targets the Windows app’s Cache folder, not account or server/message deletion. Keep the preserved folder until testing finishes, and do not confuse it with the complete app-data directory.'}],
 sources:[general,source('115001130052-Stuck-on-the-Main-Connecting-Screen','Discord: stuck on the connecting screen'),corrupt,status],
 related:[link('update-failed','Update Failed comparisons'),link('installation-failed','Installation failures'),{href:'/discord/login-error',label:'Login errors (Japanese)'},link('not-opening','Discord will not open')],
},
{
 ...base,slug:'update-failed',title:'Discord Update Failed or Retry Loop: Check Connectivity Before Reinstalling',shortTitle:'Update Failed and update loops',
 description:'Compare the same PC’s browser, official download and another permitted connection. Identify Discord updater processes and prepare sign-in access before removing app remnants.',
 lead:'For the standard Windows desktop client repeatedly showing Update Failed. Reaching a login screen means that update stage progressed; an authentication error needs separate checks.',
 summary:'Check official incidents and actual browser conversations before deleting anything. Compare the official download and the same PC on another connection if available. If only the app still fails after a full quit/restart, reinstall only after confirming a usable official installer and sign-in access.',
 quickFacts:[{label:'Browser works?',value:'This does not establish that update traffic also works'},{label:'Another connection helps?',value:'Investigate the original network; stop reinstall attempts'},{label:'Before cleanup',value:'Official installer available, recovery/sign-in ready, exact folders identified'}],
 diagnosis:[row('A reported incident matches the timing/symptom','Pause local deletion and retry after recovery.',1),row('Browser works but update fails','Compare official installer retrieval and another connection.',2),row('Browser or download also fails','Inspect connection, VPN and block notifications first.',2),row('The same PC updates on another connection','Investigate the original network; no folder cleanup is needed.',2),row('Only the app fails on both connections','Fully quit identified Discord/updater processes.',3),row('Full quit fails; official download works','Prepare sign-in access before scoped cleanup.',4)],
 steps:[
 step(1,'Check incidents and browser conversations before deleting files','Record the update screen and time first. A working browser can also provide temporary access.',[
 'Check https://discordstatus.com/ for an incident matching the symptom and time. Retry after its recovery if applicable. No matching incident does not establish that every connection path works.',
 'On the same PC and connection, open https://discord.com/app. Confirm channels and existing conversations load after signing in, not just the public page.',
 'If the browser works, record it and continue to Step 2. Browser sessions and the updater use different operations; browser success is not proof of corrupt app files or healthy update traffic.',
 'Separate email/password/authentication-code failures from connection problems. Use the login guide and leave already signed-in devices signed in.',
 ]),
 step(2,'Compare the download and update on the same PC','Changing both device and network at once makes results harder to interpret.',[
 'Try saving the Windows installer from https://discord.com/download. Check that the download completes, not merely that its page opens. You do not need to run it or delete anything yet.',
 'If you use a personally controlled VPN, record its state and compare temporarily without it where permitted. Do not change managed workplace/school restrictions; ask the administrator.',
 'If available, connect the same PC to a permitted alternative such as your own hotspot and compare the update. Account for data use, then return to the original network/settings. If unavailable, record this comparison as unconfirmed.',
 'If updating works only on the other connection, stop reinstalling and inspect the original connection, VPN or restrictions. A browser-only success still leaves update-specific connectivity as a possibility.',
 'If only the app fails on both connections, continue to Step 3. If the official download also fails, retain the browser error or security notification and resolve access before removing the app.',
 ],'Do not start with blanket security disablement, DNS changes or network resets. Inspect the actual file/reason in any block record rather than bypassing it.'),
 step(3,'Fully quit identified Discord and updater processes','A closed window can leave processes in the notification area or Task Manager.',[
 'Quit Discord from its notification-area icon, including hidden icons if necessary. This ends ongoing calls/streams.',
 'Open Task Manager with Ctrl+Shift+Esc and end remaining Discord processes. If Update.exe appears, use Open file location to confirm it belongs to the Discord folder before ending that specific process.',
 'Launch Discord once from Start. Check whether it repeats Update Failed or advances to a normal/login screen. If it advances, folder cleanup is unnecessary.',
 'If unchanged, save work, restart Windows and compare again. If it still fails, meet the preparation conditions in Step 4 before reinstalling.',
 ]),
 step(4,'Reinstall only after the prerequisites are met','Use this after full quit/restart fails, with no relevant incident awaiting recovery and a completed official download. An unavailable network comparison remains unconfirmed, not a passed test.',[
 'Confirm email, password and two-factor authentication or backup-code access. Record voice/keybind settings if accessible; otherwise expect that local settings may need recreating. Preserve needed local data privately before cleanup.',
 'Fully quit Discord and close the browser Discord tabs used for comparison. An already signed-in phone or other device can remain signed in.',
 'Use Windows+R → %APPDATA% and remove only the identified Discord folder there after preservation. Repeat for the Discord folder inside %LOCALAPPDATA%. Never remove the whole AppData or Local directory.',
 'Skip a target that does not exist. For an in-use message, return to the process check. For access denied, record the exact path/message and seek administrator or security-provider help; do not force ownership changes or deletion.',
 'Restart Windows and run the installer obtained from the official source. Sign in, open a channel, then quit and reopen to check that the update loop does not return.',
 ],'Official remnant cleanup concerns installer/corruption recovery. It is not account deletion, but it can rebuild local settings/session state. Do not guess alternate-client folder names or restore a whole old folder indiscriminately.'),
 step(5,'If failure remains, record the stage and comparison results','Repeatedly deleting the same data adds little evidence.',[
 'If running DiscordSetup.exe produces Installation has failed, use the installer-specific guide. That is a different stage from an update retry loop.',
 'For another Update Failed loop, record time, Windows version, browser result, official-download result, alternate-network result, full quit and reinstall results. Mark tests you could not perform as unconfirmed.',
 'If the error offers a log-opening action, preserve the original and prepare a redacted copy for official support. Remove private usernames/paths and secret URL values; never send passwords or authentication codes.',
 ]),
 ],
 avoid:['Do not rename Update.exe or end another app’s updater solely because the name matches.','Do not remove the current app before obtaining a usable official installer and sign-in access.'],
 cautions:['A useful support record distinguishes the original network, browser, download and alternate-network results without claiming unavailable tests passed.','Keep any preserved local data private. If the error changes to authentication or installation, change the troubleshooting path instead of repeating cleanup.'],
 faqs:[{question:'Does a working browser prove the connection is fine?',answer:'It proves some Discord session functions are reachable, not that updater traffic also works. Compare a completed official download and, if available, updating the same PC on another permitted connection.'},{question:'How many minutes should I wait?',answer:'There is no universal timeout. Observe whether progress changes or the same failure repeatedly retries. For a relevant incident, follow recovery information; for a loop, use the comparisons before deleting files.'},{question:'Should I rename Update.exe?',answer:'This procedure does not. Other applications can use that name too. Even when ending a process, identify its location first rather than substituting a filename change for diagnosis.'},{question:'Does cleanup remove my servers or messages?',answer:'Removing local app folders is not deleting the account or servers. Local preferences and sign-in state may be rebuilt, so prepare authentication access and preserve needed data before cleanup.'}],
 sources:[installer,corrupt,status,download,support],
 related:[link('installation-failed','Installation has failed'),link('not-opening','Discord will not open'),link('loading-stuck','Loading-screen comparisons'),{href:'/discord/login-error',label:'Login errors (Japanese)'}],
},
{
 ...base,slug:'installation-failed',title:'Discord Installation Has Failed: First Install, Reinstall and Setup Log Checks',shortTitle:'Installation has failed',
 description:'Identify the failed installation stage, preserve the current Setup Log, distinguish missing/in-use/access-denied folders, and verify a normal launch after reinstalling Discord.',
 lead:'For the standard Windows installer when DiscordSetup.exe reports Installation has failed or reinstallation cannot finish. A launch-time Update Failed loop has a separate guide.',
 summary:'For a first install, check the official download and compare after restarting. For a reinstall, preserve sign-in access and fully quit Discord. Save the current log before scoped cleanup, skip absent folders and treat in-use versus access-denied messages separately. Confirm conversations and a second launch before calling the installation complete.',
 quickFacts:[{label:'Identify the stage',value:'Download failure, execution block and installer error are different'},{label:'Before cleanup',value:'Preserve this attempt’s log and sign-in access'},{label:'Missing folder?',value:'Skip it; do not create a replacement or delete another folder'}],
 diagnosis:[row('First installation; never launched successfully','Verify the official download and retry after a restart.',1),row('Previously installed or reinstalling after removal','Prepare sign-in access and fully quit remaining processes.',2),row('One or both Discord folders are missing','Skip cleanup for absent targets.',4),row('Cleanup reports a file in use','Check remaining processes/startup before retrying.',4),row('Cleanup reports access denied','Record it and inspect permission/block evidence; do not force removal.',4),row('Same error after restart/reinstall','Read the current attempt’s log and surrounding context.',3)],
 steps:[
 step(1,'For a first install, identify the source and failed stage','Download failure, an execution block and an installer’s own error need different observations.',[
 'Obtain the Windows installer from https://discord.com/download. If saving it does not finish, inspect the connection/browser error first; do not proceed to app-data deletion.',
 'Record the exact screen and time. If Windows or a security product blocks execution, inspect its notification rather than disabling protection broadly.',
 'Save open work, restart Windows and run the official installer once. If Discord opens normally, verify the result in Step 5.',
 'If Installation has failed returns, preserve the log in Step 3 before cleanup in Step 4. Even a first failed attempt may have created some files; their presence alone does not establish corruption.',
 ]),
 step(2,'For a reinstall, prepare sign-in access and fully quit','Old processes can prevent files being replaced even after their window closes.',[
 'Confirm email/password and two-factor authentication or backup-code access. Record voice/keybind settings if accessible, and preserve needed local data privately. Keep other already signed-in devices signed in.',
 'Quit Discord from its notification-area icon. Open Task Manager with Ctrl+Shift+Esc and end remaining identified Discord processes.',
 'For an Update.exe process, use Open file location and confirm it is inside the Discord installation before ending it. Do not stop another application’s updater on name alone.',
 'Retry the installer. If it fails, save this attempt’s log in Step 3. Close browser Discord tabs before the local cleanup in Step 4.',
 ]),
 step(3,'Read the current Setup Log with its surrounding context','The last line or a single error word is not enough to establish the cause. The following terms are examples, not guaranteed output.',[
 'If the error screen offers Open Setup Log, open it and save a separate copy. If the button is absent or fails, preserve the screen/time and record that the log was unavailable. Do not delete files at a guessed log path.',
 'Find the time of the current attempt, often near the end. Keep old and current attempts separate. If timestamps are unclear, retain the newly captured log and the time of the error screenshot.',
 'Search for terms such as Error, Exception or failed using a text editor’s Find. Read the surrounding operations; roughly 10–20 nearby lines can be an initial excerpt, extending it to include a related exception’s continuation.',
 'Access is denied or UnauthorizedAccessException suggests inspecting permission/block records; being used by another process suggests the named in-use target; download or timeout suggests connection-related context. These are leads, not diagnoses.',
 'Record the affected file/path, full error and preceding operation. If you do not understand it, retain it unchanged for support instead of editing settings based on a keyword.',
 ],'Keep the original private and redact a sharing copy: Windows username, email, device name, private folders and token-like URL values. Never send passwords or authentication codes. Preserve useful error names and the non-private Discord path structure.'),
 step(4,'Separate absent, in-use and access-denied targets','The official targets are the Discord folders under AppData and LocalAppData. Save the log and prepare sign-in access plus a usable official installer first.',[
 'Open Windows+R → %APPDATA% and identify its Discord folder. Then inspect %LOCALAPPDATA% for the separate Discord folder. Preserve needed local data outside these targets before removal.',
 'With Discord fully closed, remove only the existing identified Discord folders. Skip either location if absent. Do not create an empty replacement or remove AppData, Local or another application’s folder.',
 'For an in-use message, return to Step 2. If Discord automatically opens after a restart, temporarily disable only its startup entry in Task Manager, record the original state and compare after restarting.',
 'For access denied, record the exact message/path and inspect security notifications or protection history. Ask the administrator on a managed PC. Do not force deletion or change ownership to bypass it.',
 'After the scoped cleanup succeeds, restart Windows and run the official installer. If cleanup cannot be completed, record that state and move to support in Step 5 instead of repeatedly forcing it.',
 ]),
 step(5,'Verify a usable session and another launch','An installer window disappearing is not sufficient evidence of success.',[
 'Open Discord, sign in and confirm channels and existing conversations load. Quit and reopen; verify the same installation error does not return.',
 'Restore the startup preference if you temporarily changed it and still want automatic launch. Review voice devices and key bindings too.',
 'If the app reaches sign-in but authentication fails, use the login guide. If the new error is Update Failed, use the update guide. Do not keep deleting files as though the stage had not changed.',
 'If the same error persists, give official support the first-install/reinstall context, Windows version, source, time, target-folder presence, full-quit/restart results and redacted current log.',
 ]),
 ],
 avoid:['Do not force ownership changes or delete unrelated folders when a target is missing or access is denied.','Do not download an unfamiliar log collector, share raw private logs or infer a cause from one Error line.'],
 cautions:['For support, an example format is: first install/reinstall, official source, result after restart, each target folder present/absent, failure time and relevant log context. Replace examples with your actual results.','Reinstallation is not account/server deletion, but local settings and sessions can change. Preserve authentication access first.'],
 faqs:[{question:'Why is there a Discord folder on a first install?',answer:'A failed attempt may have written partial data. Presence alone is not proof of corruption. Save this attempt’s log before inspecting the exact target.'},{question:'Neither target folder exists. What should I remove?',answer:'Nothing from those locations. Skip that cleanup, use the official installer and inspect the current error/log. Do not create empty folders or find unrelated data to delete.'},{question:'What if Open Setup Log is missing or will not open?',answer:'Keep the error screen, time, first-install/reinstall context and steps tried. Report the log as unavailable; an unfamiliar collection tool is not required.'},{question:'Does an Error line identify the root cause?',answer:'Not necessarily. It may be a consequence or belong to an older attempt. Read the current timestamp and surrounding operations before deciding what to inspect.'},{question:'Does removing local Discord data delete my account?',answer:'It is not account or server deletion. Local preferences and sign-in state may be rebuilt, so confirm your authentication methods and preserve needed data before the operation.'}],
 sources:[installer,corrupt,download,support],
 related:[link('update-failed','Update loops'),link('not-opening','Discord will not open'),{href:'/discord/login-error',label:'Login errors (Japanese)'}],
},
];
