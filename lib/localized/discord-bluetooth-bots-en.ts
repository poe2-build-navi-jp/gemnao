import type { LocalizedArticle } from './types';
const source=(id:string,label:string)=>({label,url:`https://support.discord.com/hc/en-us/articles/${id}`});
const apps=source('21334461140375-Using-Apps-on-Discord','Discord: using, adding and removing apps');
const permissions={label:'Discord developer documentation: permissions and role hierarchy',url:'https://docs.discord.com/developers/topics/permissions'};
const voice=source('360045138471-Discord-Voice-and-Video-Troubleshooting-Guide','Discord: voice and video troubleshooting');
const windows=(path:string,label:string)=>({label,url:`https://support.microsoft.com/en-us/windows/${path}`});
const step=(n:number,title:string,summary:string,actions:string[],note?:string)=>({id:`cause-${n}`,title,summary,time:'Compare one change at a time',actions,...(note?{note}:{})});
const row=(symptom:string,cause:string,n:number)=>({symptom,cause,stepId:`cause-${n}`});
const link=(slug:string,label:string)=>({href:`/en/discord/${slug}`,label});
const jp=(slug:string,label:string)=>({href:`/discord/${slug}`,label:`${label} (Japanese)`});
const base={locale:'en' as const,gameSlug:'discord',gameName:'Discord',checkedAt:'2026-10-18',sourcePolicy:'English adaptation of the existing Japanese article. Official documentation supports the described controls and limits; comparison sequences are editorial guidance rather than measured results. Follow the permissions of the actual device, account and server, record original settings and verify the outcome before making another change.'};
export const discordBluetoothBotsEn: LocalizedArticle[] = [
{
 ...base,slug:'bluetooth-audio-problem',title:'Bluetooth Game Audio Goes Silent or Muffled During Discord Calls',shortTitle:'Bluetooth audio changes during calls',
 description:'Separate missing game audio, lower playback quality and volume ducking. Compare Windows routing and a separate microphone before repairing an unstable Bluetooth connection.',
 lead:'For Windows 11/10 desktop Discord and a Bluetooth headset. Compare before joining, during a call and after leaving: complete silence, muffling and reduced volume need different checks.',
 summary:'For missing game sound, inspect Windows output and per-app routing first. If sound remains but becomes muffled exactly when the call starts, compare a separate input microphone while keeping Bluetooth output. Re-pairing does not remove a call-mode limitation and is a later step for an unstable connection.',
 quickFacts:[{label:'Compare three stages',value:'Before the call, during it and after leaving'},{label:'Silence versus quality',value:'Check routing for silence; compare input selection for muffling'},{label:'Pairing later',value:'Keep a stable pairing while investigating call-only changes'}],
 diagnosis:[row('Call voices work, but game audio disappears','Inspect the game’s mixer mute and output device.',1),row('Game audio remains but becomes muffled on joining','Compare after leaving and with a separate microphone.',2),row('Game volume falls only when someone speaks','Separate volume attenuation from a quality/mode change.',3),row('Audio cuts out outside calls or the device disappears','Inspect connection stability and other applications.',4)],
 steps:[
 step(1,'For silence, compare the game and Discord output routes','A game’s assigned output can differ from the Windows default. Separate game-only silence from system-wide silence.',[
 'Connect the Bluetooth headphones, play a repeatable game sound and join a willing participant’s call. Record whether the missing sound is the game, the caller or both.',
 'On Windows 11, open Settings → System → Sound and inspect Output. Confirm the intended Bluetooth device and whether its displayed name changes during the call.',
 'Open Volume mixer → Apps and inspect the game’s mute, volume and output device. If absent, make the game play sound and reopen the list.',
 'If routed to unused speakers or another device, record the old route and choose the Bluetooth output you are actually using. Check an explicitly selected in-game output too, then replay the same scene.',
 'Inspect Discord User Settings → Voice & Video → Output Device. Record whether both sounds now play and whether only their quality changes.',
 ],'On Windows 10, right-click the taskbar speaker for Volume Mixer; app routing is under Sound → App volume and device preferences. If other apps are also silent, prioritize Windows output and the physical connection.'),
 {...step(2,'For muffling, compare a separate input microphone','Discord describes a Bluetooth headset profile change that can reduce playback quality when a microphone is active, even on functioning hardware.',[
 'Replay the same game sound before, during and after the call. Quality returning after leaving suggests investigating the call-time audio mode.',
 'In Discord Voice & Video → Input Device, select an available built-in or USB microphone instead of the headset microphone. Keep Output Device on the Bluetooth headphones and record the original choices.',
 'Rejoin and compare game sound, then ask the participant to confirm your voice arrives. If both work, the separate input/output combination can be usable; restore an unhelpful change.',
 'If Windows separately lists Headphones/Stereo and Headset/Hands-Free, these can represent playback and call uses. Forcing the playback entry while also using the Bluetooth mic does not guarantee simultaneous high-quality playback and voice input.',
 'If no alternative mic is available, compare existing wired/USB equipment where possible. Do not buy hardware solely to complete a test, and do not expect re-pairing alone to remove a call-profile limitation.',
 ],'LE Audio needs support from Windows, the PC radio/drivers and the peripheral. A Bluetooth 5.x label alone does not guarantee high-quality two-way audio. The Discord profile explanation is linked in Japanese; Microsoft documents current Windows LE Audio compatibility separately.'),guideLink:{href:'/en/gear/discord-microphone-guide',label:'Microphone checks before buying equipment',description:'Compare an existing built-in mic first. If it is sufficient, no purchase is needed; otherwise compare a separate USB mic with headset options.'}},
 step(3,'For lower volume only, inspect attenuation','Sound that becomes quieter only during speech is different from a muffled call profile.',[
 'Keep game audio steady. Compare a reduction only while someone speaks with a reduction lasting for the entire joined call.',
 'For speech-triggered reduction, inspect Attenuation in Discord Voice & Video. Record its current value, compare at 0%, and restore it if unhelpful.',
 'For a reduction throughout the call, inspect Windows More sound settings → Communications. Use the linked game-volume-lowers guide for the separate comparison and retain the previous choice.',
 ],'Compare attenuation/communications settings before deleting a stable Bluetooth pairing when only volume changes.'),
 step(4,'Reconnect only when the connection itself is unstable','A device disappearing or cutting out outside calls is a different observation from call-only muffling.',[
 'Leave the call and play another app’s audio through the same headphones. Check whether it still cuts out or disappears from Windows Output.',
 'If the connection is unstable, cycle the headphones’ power and Windows Bluetooth, then reconnect. Be mindful that other Bluetooth peripherals may disconnect temporarily.',
 'Only if detection/connection still fails, remove the identified device in Windows Bluetooth & devices and pair again using its manufacturer’s instructions. On Windows 10, the relevant device settings are under Devices → Bluetooth & other devices.',
 'If other apps still cut out, consult the PC/headphone manufacturer’s supported drivers and help. If only call-time quality is affected, return to Step 2.',
 ],'Re-pairing requires setting the connection up again. Do not start there when the connection is stable and only call-time quality changes.'),
 ],
 avoid:['Do not equate a Bluetooth version number with guaranteed LE Audio support.','Do not delete a stable pairing or force a playback-only route before comparing the microphone and actual call result.'],
 cautions:['Record headphone model, Windows version, Discord input/output and before/during/after results for the manufacturer or Discord support.','The linked older Discord article explains headset-profile behavior; its old rollout wording is not a current Windows support guarantee.'],
 faqs:[{question:'Windows shows both Headphones and Headset. Which should I choose?',answer:'They can represent playback and microphone/call modes. First compare another microphone with Bluetooth kept as output, then verify both game sound and voice. Using the Bluetooth mic does not guarantee the same playback quality.'},{question:'It still sounds muffled after re-pairing. Is it broken?',answer:'If quality returns after leaving the call, compare the call profile using another input. If it cuts out outside calls too, investigate the connection/device separately. Re-pairing alone does not establish a fault.'},{question:'Does Bluetooth 5.3 guarantee high-quality calls?',answer:'No. Check the actual Windows, radio/driver and headphone LE Audio capabilities together. The version label alone is insufficient.'}],
 sources:[{label:'Discord: Bluetooth call-profile quality limitation (Japanese)',url:'https://support.discord.com/hc/ja/articles/19850083499159--既知の問題-通話に参加すると音質が低下する'},windows('hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows','Microsoft: app volume and output routing'),windows('hardware/bluetooth/fix-bluetooth-connected-but-no-sound-issue-on-windows','Microsoft: Bluetooth connected without sound'),windows('hardware/bluetooth/configuring-bluetooth-le-audio-quality-settings-on-windows-11','Microsoft: Windows LE Audio compatibility and quality'),voice,{label:'Microsoft: Bluetooth troubleshooting',url:'https://support.microsoft.com/windows/fix-bluetooth-problems-in-windows-723e092f-03fa-858b-5c80-131ec3fba75c'}],
 related:[jp('game-volume-lowers','Game volume falls during calls'),link('cant-hear-voice','Cannot hear callers'),link('mic-not-working','Microphone troubleshooting')],
},
{
 ...base,slug:'bot-add',title:'Add a Discord Bot or App: Check the Destination and Requested Permissions',shortTitle:'Add a bot or app',
 description:'Use the desktop/browser App Directory, verify server ownership or Manage Server permission, distinguish account and server installs, and check the resulting command list.',
 lead:'For desktop/browser users who want to add a bot/app, cannot see the intended server in the picker or need to check what was installed.',
 summary:'Open Server Settings → App Directory, inspect the app/provider and choose the intended destination. Read requested access before authorizing. Verify server installation in Members and Integrations; an account-added app instead appears in Authorized Apps.',
 quickFacts:[{label:'Who can add a server app?',value:'The server owner or a member with Manage Server'},{label:'Check the destination',value:'An account install and a server install have different scopes'},{label:'After adding',value:'Verify registration and the provider’s available commands'}],
 diagnosis:[row('The intended server is absent from the picker','Verify account, destination and Manage Server permission.',1),row('Unsure which app or permissions to authorize','Read its provider, purpose and requested access.',2),row('Authorization finished, but commands are missing','Inspect registration before repeating authorization.',3)],
 steps:[
 step(1,'Check server-management permission and destination','Server app installation requires ownership or Manage Server, not merely membership.',[
 'Open the Discord server where you intend to add the app.',
 'Select the server name and open Server Settings.',
 'Confirm ownership or whether your role has Manage Server. Ask the owner if you cannot inspect the relevant setting.',
 'In any installation picker, verify the server name and icon before continuing so another server is not selected inadvertently.',
 ],'If you lack permission, ask the owner or administrator to evaluate the addition. Do not try to bypass their server controls.'),
 step(2,'Choose the app through the App Directory','The desktop/browser directory presents the app’s overview and provider information.',[
 'Open Server Settings → App Directory.',
 'Search for the required app name or function.',
 'Read its overview, provider, support destination and required access. Directory presence alone does not make every requested permission appropriate to your purpose.',
 'Select Add App and inspect whether the flow proposes adding it to your account or to a server.',
 'Authorize only when the intended destination and requested permissions match the function you want. Cancel if the scope is unclear or excessive.',
 ],'Administrator is broad access. Do not grant it routinely to make a bot work; require a clear need for the intended function and reject unexplained excess permissions.'),
 step(3,'Verify registration and available commands','A server-added app appears as a member and under Server Settings → Integrations → Bots and Apps.',[
 'Look for the intended bot in the server’s Members list.',
 'Open Server Settings → Integrations and inspect its app entry. For an account installation instead, inspect User Settings → Authorized Apps.',
 'In an appropriate text channel, type / to open the command picker without submitting a command.',
 'Check whether the intended provider’s commands appear; identical command names can belong to different apps.',
 'If missing, use the bot-not-responding guide to compare permissions and channel settings. Inspect registration and provider guidance before deleting or repeatedly reauthorizing.',
 ]),
 ],
 avoid:['Do not authorize a different server/account destination by habit.','Do not grant Administrator automatically or run destructive commands merely to test installation.'],
 cautions:['If the server is absent, verify Manage Server and the signed-in account. If authorization completed but registration is unclear, inspect Members/Integrations and the provider’s support before retrying.','The walkthrough describes installation choices; this article does not install or authorize an app for you.'],
 faqs:[{question:'Do I need Administrator to add a bot?',answer:'The server owner or a member with Manage Server can add a server app. The bot’s own required permissions are a separate, feature-specific decision.'},{question:'Can I add one from a phone?',answer:'This walkthrough uses the desktop/browser App Directory. For a mobile-specific route, consult that app’s provider. Use the PC controls when available to inspect the full destination and permission request.'},{question:'Is a bot different from a Discord app?',answer:'Discord uses apps as a broader term for third-party features. Some expose bot commands; others include Activities used in calls or chats.'}],
 sources:[apps,permissions],
 related:[link('bot-not-responding','Commands missing or no response'),link('bot-remove','Remove or deauthorize an app'),jp('system-helper','Discord System Helper')],
},
{
 ...base,slug:'bot-not-responding',title:'Discord Bot Not Responding: Missing Commands, Execution Errors or No Reply',shortTitle:'Bot commands missing or not responding',
 description:'Compare the same harmless command across permitted channels and ordinary members. Separate user command access, bot operation permissions and provider-side failures.',
 lead:'For desktop/browser users and server administrators when / shows no intended command, execution returns an error or the expected reply never appears.',
 summary:'Identify the failed stage first. Missing commands call for installation and command-access checks; explicit errors call for their exact requirements; broad silence calls for usage/provider-status checks. Compare the same person in another permitted channel, then another ordinary member in the original channel.',
 quickFacts:[{label:'Record the stage',value:'No candidate, execution error, no reply or success'},{label:'Harmless comparison',value:'Use the provider’s documented read-only/help operation; do not assume /help exists'},{label:'Separate permissions',value:'A user invoking a command and a bot performing an action are different checks'}],
 diagnosis:[row('The bot/command is absent after typing /','Inspect invocation method and installation scope.',1),row('Command appears but reports permission/input errors','Read whether the failure concerns the user, bot or supplied options.',3),row('The application did not respond','Compare another permitted channel and ordinary member.',2),row('You can use it in another channel','Inspect the original channel and bot-specific allowed locations.',4),row('Another ordinary member succeeds in the same channel','Inspect your roles, overrides or app-specific account conditions.',4),row('Only this bot fails for every tested person/location','Inspect provider status, usage changes and reply destination.',5)],
 steps:[
 step(1,'For missing commands, inspect usage and installation scope','A command appearing and the app responding are different stages.',[
 'Type / in the affected channel and identify both the command and its provider. Several apps can expose the same command name.',
 'If you used a legacy prefix such as !, inspect the app profile or directory page for its current invocation method. Command names and prefixes are not universal.',
 'An administrator can inspect Server Settings → Integrations for server-installed apps. Distinguish those from your account-added apps under User Settings → Authorized Apps.',
 'If installed but absent from the picker, continue to Step 2. If not installed in the intended scope, use the add-app guide. Do not repeatedly remove/re-add without checking.',
 ]),
 step(2,'Change channel and user separately using the same command','Use only an allowed location and a documented operation that does not alter settings or delete, ban or notify people in bulk.',[
 'Try once as yourself in the original channel, keeping options fixed. Record no candidate, exact error, no reply or success. Do not repeatedly submit while a response is delayed.',
 'Try the same operation yourself in another permitted text channel in the same server. Success only there points to the original channel’s conditions in Step 4.',
 'Ask another willing ordinary member to make the same comparison in the original channel using their own account. If only they succeed, inspect user roles/overrides or provider account requirements; never borrow their login.',
 'Success only for an administrator does not establish ordinary-member access. Owners/administrators can access commands despite restrictions affecting other members; record that role difference.',
 'If every tested user/channel fails, continue to Step 5. If only your desktop app omits the candidate, compare the same account/channel in the browser and reload the app.',
 ],'Examples describe how to interpret your own results: success in B but failure in A prioritizes A; another ordinary member succeeding in A prioritizes user-specific conditions. Unperformed comparisons remain unconfirmed.'),
 step(3,'Use the exact execution error to choose the next check','Separate app-specific explanations from a Discord response failure after submitting a command.',[
 'For missing/invalid options, follow the command picker’s documented types and required selections. Identify the specific date, URL, user or other input requested.',
 'For permission errors, identify whether the user lacks invocation access or the bot lacks authority for its action. If unclear, give the full error to the administrator instead of increasing privileges by guesswork.',
 'For provider-specific cooldowns, limits or incomplete account linking, follow its guidance. There is no universal waiting period for every bot.',
 'The application did not respond means the required response was not obtained; it does not uniquely identify a permission failure. Use Step 2’s comparisons and provider status.',
 'Even if a reply appears, confirm the intended action completed where appropriate. For failed role assignment or another operation, compare feature-specific permissions and role hierarchy with the provider’s guidance.',
 ]),
 step(4,'Administrators: separate command access from bot actions','Record the existing settings and change only the scope narrowed by the comparison.',[
 'For user-dependent candidate/execution access, inspect the affected person’s Use Application Commands permission under Server Settings → Roles.',
 'Inspect that channel’s role/member overrides and the app’s available command restrictions under Server Settings → Integrations, including allowed users/channels.',
 'If the bot cannot post or perform its action, inspect only the relevant permissions in that channel, such as View Channel and Send Messages. History, attachments or role management are relevant only when the actual feature requires them.',
 'Interaction responses and ordinary message posts have different conditions. Send Messages is not a universal repair for every command. Inspect any provider-specific allowed-channel setting too.',
 'Have the originally affected ordinary member repeat the same command in the same channel. Verify the expected result as well as the candidate display, and restore unnecessary changes.',
 ],'Users without settings access should pass comparison results to the administrator. Do not grant Administrator to the bot or user merely as a test.'),
 step(5,'For widespread silence, inspect the provider and reply destination','An online indicator does not prove every command works; a member-list state does not establish that every app feature has failed.',[
 'Check the provider’s expected reply location: some results are visible only to the invoking user, in DMs or in a designated channel.',
 'Use the app profile/directory overview to find its support destination. Inspect incidents, maintenance and changed commands; note whether other functions still work.',
 'If several apps and normal Discord operations fail, check Discord Status too. For a reported bot-specific incident, pause PC reinstalls and server changes until recovery.',
 'If unresolved, send the provider the bot/command/options, time, exact error and channel/user comparisons. Redact private screenshot details; never send bot tokens, passwords or authentication codes.',
 ]),
 ],
 avoid:['Do not use deletion, bans or bulk notifications as test commands.','Do not spam retries, borrow another member’s account or grant blanket Administrator access.'],
 cautions:['Keep the same command/options across comparisons and distinguish ordinary members from administrators.','For support, explicitly record what was tested and what remains unconfirmed, including whether another command still works.'],
 faqs:[{question:'The bot is online but does not reply.',answer:'Online status does not verify each command or its external dependencies. Compare the same operation across a channel and ordinary user, then inspect provider status.'},{question:'Administrators can use it, but ordinary members cannot.',answer:'Inspect member roles, channel overrides and Integrations command restrictions. Retest as the original affected member, since an administrator’s success is not an equivalent permission check.'},{question:'Does The application did not respond mean missing permissions?',answer:'Not by itself. Response delay/failure can also produce it. Record the message and comparisons without flooding repeated requests.'},{question:'An app is absent from Members, but its commands appear.',answer:'It may be added to your account rather than the server. Inspect Authorized Apps and the intended installation scope.'},{question:'Is kicking and re-adding faster?',answer:'First inspect scope, permissions and provider health. Re-adding cannot guarantee recovery from a provider outage, and retained settings differ by app. Use that route only when justified by its guidance.'}],
 sources:[apps,permissions,source('10543994968087-Channel-Permissions-Settings-101','Discord: channel permissions'),source('10952702911639-Command-Permissions-Lockout','Discord: command restrictions and administrator access'),{label:'Discord developer documentation: interaction responses',url:'https://docs.discord.com/developers/interactions/receiving-and-responding'},{label:'Discord Status: service incidents',url:'https://discordstatus.com/'}],
 related:[link('bot-add','Check where an app was added'),link('bot-remove','Remove an app safely'),link('loading-stuck','Discord itself is stuck loading')],
},
{
 ...base,slug:'bot-remove',title:'Remove a Discord Bot or App: Account Access, Webhooks and Remaining Posts',shortTitle:'Remove a bot or app connection',
 description:'Preserve needed settings, distinguish server removal from account deauthorization, and identify new webhook, followed-channel or external-app posts after removal.',
 lead:'For desktop/browser server administrators and account owners removing an app, revoking authorization or investigating posts/commands that remain afterward.',
 summary:'Identify the app’s responsibilities and preserve needed settings first. Remove a server bot from its server; deauthorize a personal app under Authorized Apps. Record the removal time. New posts may come from a separate webhook, followed channel or another member’s account-added app; old messages alone do not prove the bot is still installed.',
 quickFacts:[{label:'Before routine removal',value:'Plan for verification, role assignment, logs or scheduled posts that will stop'},{label:'Different scopes',value:'Server Integrations and your Authorized Apps are separate'},{label:'Compare timestamps',value:'Distinguish historical messages from posts created after removal'}],
 diagnosis:[row('Bot appears in server Members/Integrations','Remove the identified server installation after preparation.',2),row('App appears in your Authorized Apps','Revoke your account authorization separately.',3),row('The same app exists in both lists','Choose the intended scope; one removal does not establish both.',2),row('Bot is absent but new automatic posts continue','Identify webhooks and followed channels by destination/time.',4),row('Posts follow another member’s command','Inspect their account-added app and server usage controls.',5),row('Only old posts or candidates remain','Distinguish history/discovery display from current registration.',5)],
 steps:[
 step(1,'Preserve needed settings and plan for stopped functions','For routine cleanup, replacing a verification/role bot’s responsibilities first prevents new members being stranded.',[
 'Match the server, bot identity and provider profile. Inspect its registration under Server Settings → Integrations.',
 'Identify active joining verification, role assignment, moderation logs and scheduled posts. Arrange alternatives for the functions actually in use.',
 'Record necessary destinations, roles and settings, using a provider export if available. Re-adding does not guarantee restoration of old configuration.',
 'Stop relevant scheduled posts/notifications in an external dashboard if present. Record the intended target and removal time.',
 ],'If suspicious posting is actively occurring, prioritize stopping the identified source over a lengthy routine cleanup. Keep webhook URLs and tokens out of public notes or screenshots.'),
 step(2,'Remove the identified server bot and verify registration','On desktop, right-click the bot in Members and use Kick with confirmation. An app-specific removal control may also be available under Integrations.',[
 'Recheck the bot name and server in the confirmation before executing the intended removal, then record the time.',
 'Reopen Members and Server Settings → Integrations and confirm the target entry is gone. An Offline label is not evidence of removal.',
 'If the control is absent or fails, ask the owner. App-management access and a member kick’s permissions/role hierarchy both matter; do not rearrange unrelated roles to force it.',
 'If the same app is authorized on your account, inspect Step 3 for that separate scope. If new posts continue, use Step 4.',
 ],'This removes the installation from the selected server, not every server where that provider’s bot exists.'),
 step(3,'Deauthorize an app on your own account','Open User Settings → Authorized Apps and use the target’s Deauthorize control; labels can vary with language/version.',[
 'Read the app/provider and granted access before revoking it. This is distinct from the Connections screen used for services such as Spotify.',
 'Reopen Authorized Apps and confirm the target is gone. A remaining server installation needs its own administrator action in Step 2 if that scope should also stop.',
 'If absent, do not remove a different app in its place. Another member’s account-added app requires their own account settings or appropriate server usage controls.',
 ]),
 step(4,'For new posts after removal, identify the webhook or forwarding source','Compare post time with removal time first. Existing history is not proof of continued execution.',[
 'Record each new message’s channel, timestamp, displayed sender and link. Investigate messages genuinely created after the recorded removal.',
 'Open Server Settings → Integrations → Webhooks and compare destination channel, creator and creation time. A matching display name alone is insufficient identification.',
 'If matched to an external notification service, stop that sending configuration. Remove only a webhook confirmed no longer needed. Do not assume the same URL can be restored: recreating it requires configuring the new URL at the sending service.',
 'If messages are forwarded announcements from another server, inspect Channel Following in Integrations and remove only the unwanted source.',
 'At the next normally expected notification, check whether new posts cease. If another arrives, use that new message to investigate another webhook, bot or user-triggered app.',
 ],'A webhook is a separate posting route. Removing a bot does not establish that every separately configured route has stopped. If the source cannot be identified, give the records to the administrator.'),
 step(5,'Treat remaining commands, history and roles separately','Hiding a candidate, stopping future posts and cleaning past history are different tasks.',[
 'For remaining command candidates, reload Discord and match the app name against server and account registration. App Launcher also shows discoverable/recommended apps; visibility there alone does not prove reinstallation.',
 'If another member’s interaction produces replies, inspect account-added app use. Administrators can review Use External Apps under Server Settings → Roles → Apps Permissions and relevant channel overrides.',
 'To restrict public external-app replies, adjust only the intended role/channel permission. Private replies to the invoking user may remain available; this is not deleting their account-installed app.',
 'For historical posts only, preserve necessary logs before an authorized administrator removes unwanted messages separately.',
 'For leftover roles/channels, inspect members, access and other functions still using them before targeted cleanup. A matching bot name alone is not sufficient reason to delete them.',
 ]),
 ],
 avoid:['Do not delete all webhooks, roles or channels just because the bot name matches.','Do not expose webhook URLs/tokens or assume re-adding restores provider-held data/settings.'],
 cautions:['Give the administrator the app/server identity, removal screen/time, current list entries and new message links/times. With suitable access, audit-log records can help identify bot/kick/webhook changes.','Provider dashboards and stored data have their own controls; server removal does not erase all historical messages or external data.'],
 faqs:[{question:'Must I ban a bot to remove it?',answer:'Routine removal can use Kick or the available app removal control. Banning additionally restricts rejoining and serves a different purpose. Re-adding does not guarantee old settings return.'},{question:'I deauthorized it, but the server bot remains.',answer:'Your account authorization and the server installation are separate. The server owner/authorized administrator must remove that installation if it should also stop.'},{question:'Does removal erase every message and provider-held record?',answer:'No. Historical posts and externally stored data are separate. Preserve needed logs, use authorized message cleanup, and follow the provider’s data-removal guidance where relevant.'},{question:'Can I undo webhook deletion?',answer:'Do not assume the old URL can be recovered. A recreated webhook needs its new URL configured at the sending service. Identify active dependencies before deleting the target.'}],
 sources:[apps,permissions,{label:'Discord: moderating external apps and private replies',url:'https://support-apps.discord.com/hc/en-us/articles/26501864012951-Moderating-Apps-on-Discord'},source('360045093012-Server-Integrations-Page','Discord: integrations, webhooks and followed channels'),source('228383668-Intro-to-Webhooks','Discord: webhooks'),source('214836687-Discord-Roles-and-Permissions','Discord: roles, kick permissions and hierarchy'),source('24160905919511-My-Discord-Account-was-Hacked-or-Compromised','Discord: account protection and Authorized Apps')],
 related:[link('bot-add','App installation scope'),link('bot-not-responding','Bot response and permissions')],
},
];
