import type { LocalizedArticle } from './types';
const source=(id:string,label:string)=>({label,url:`https://support.discord.com/hc/en-us/articles/${id}`});
const step=(n:number,title:string,summary:string,actions:string[],note?:string)=>({id:`cause-${n}`,title,summary,time:'Compare one change at a time',actions,...(note?{note}:{})});
const row=(symptom:string,cause:string,n:number)=>({symptom,cause,stepId:`cause-${n}`});
const link=(slug:string,label:string)=>({href:`/en/discord/${slug}`,label});
const jp=(slug:string,label:string)=>({href:`/discord/${slug}`,label:`${label} (Japanese)`});
const base={locale:'en' as const,gameSlug:'discord',gameName:'Discord',checkedAt:'2026-10-18',sourcePolicy:'English adaptation of the existing Japanese guide, retaining its step IDs, diagnostic branches and official sources. Comparisons are editorial troubleshooting guidance, not measured results. Preserve original settings and distinguish an unperformed test from success.'};
export const discordNotificationsOverlayPhoneEn: LocalizedArticle[] = [
{
 ...base,slug:'notifications-not-working',title:'Discord Notifications Missing: DM, Mention and Windows Checks',shortTitle:'Notifications are missing',
 description:'Separate a missing message from a missing desktop banner. Check conversation mute, message requests, server mentions, viewing state and Windows notification settings.',
 lead:'For Windows 11/10 desktop Discord when DMs, server mentions or desktop banners seem missing. Record message receipt, unread badges, sounds and pop-ups separately.',
 summary:'First open the conversation to check whether the message arrived. For one DM inspect mute, Ignore and message requests; for server posts inspect notification levels and overrides. Compare viewing that conversation, another conversation and minimized Discord before checking Do Not Disturb, Streamer Mode and Windows banners.',
 quickFacts:[{label:'Receipt versus display',value:'A message in the conversation can arrive without a desktop banner'},{label:'Use an incoming message',value:'Ask a willing person to send a short test DM'},{label:'Compare viewing states',value:'Same conversation, another conversation, then minimized Discord'}],
 diagnosis:[row('One person/group DM arrives without a notification','Inspect that conversation’s mute and whether the sender is ignored.',1),row('A new sender’s DM is missing from the conversation list','Inspect Message Requests and Spam.',2),row('DM notifications work; one server/channel does not','Compare server notification level and channel/category overrides.',3),row('Personal mentions, role mentions and @everyone behave differently','Inspect the corresponding mention suppression controls.',3),row('No pop-up only while viewing that conversation','Compare another conversation and minimized Discord.',4),row('Neither DMs nor server posts notify while Discord is running','Inspect Do Not Disturb and Streamer Mode.',4),row('Unread badges/sounds work, but banners do not, or fail only in games','Inspect Discord desktop notifications and Windows display conditions.',5)],
 steps:[
 step(1,'For one DM, inspect conversation mute and Ignore','Server notification controls do not directly fix a muted private conversation.',[
 'Open the affected conversation from the DM list and check whether the new message actually arrived.',
 'Right-click that conversation and inspect Mute Notifications. Group DMs have their own setting; change only the conversation you intend to hear from.',
 'For one person, inspect their profile or the ignored-accounts area under Content & Social. Remove Ignore only if you want messages from that person; do not unblock unwanted contacts as a general repair.',
 'If other sounds work but this DM is silent, distinguish conversation mute from the separate message-sound settings under Notifications.',
 'Move to another conversation before asking the same person to send another short DM. Do not judge solely from a test while viewing the affected conversation.',
 ],'Windows-wide notification permission does not undo Discord’s conversation mute or Ignore setting.'),
 step(2,'For a new sender, inspect Message Requests','Messages from people outside your friends list can be routed away from the normal DM list.',[
 'Open Home and inspect Message Requests near the DM area. The tab may appear only when requests are pending.',
 'Inspect Spam within Message Requests too. Verify the sender before deciding whether to accept or reply.',
 'If no request exists and the sender could not send, inspect Messaging Permissions in User Settings and privacy settings for the shared server. Layouts may place related controls under Content & Social.',
 'If the message already appears in a conversation, continue to Step 1 or Step 4 instead of changing request settings.',
 ],'A request badge differs from a Windows pop-up. You do not need to weaken privacy or accept an unfamiliar sender just to test notifications.'),
 step(3,'For server posts, compare notification types','Server level, channel/category overrides and mention suppression are separate controls.',[
 'Right-click the server → Notification Settings. Inspect server mute and its notification level; Only @mentions will not notify for every ordinary post.',
 'Inspect Notification Overrides for the affected channel and category. Distinguish mentions-only behavior from Nothing or a muted channel.',
 'For missing role or @everyone/@here notifications, inspect their separate suppression settings. Do not infer their behavior from an ordinary post or personal mention.',
 'In an appropriate channel, ask a willing participant to send an ordinary message and a real mention addressed to you. Compare the two after your change; avoid sending mass mentions for testing.',
 ],'Discord documents an @everyone exception to server mute. Do not assume every notification type is suppressed identically.'),
 step(4,'Compare viewing state and Discord status','An open app is not enough to identify the reason a banner is absent.',[
 'With Online status selected, compare a willing person’s incoming DM while viewing that DM and while viewing another conversation/server. Record pop-ups and unread indicators separately.',
 'Minimize Discord without quitting it, including when it moves to the notification area. Ask for another DM from the same person and compare.',
 'If notifications also fail in another conversation or while minimized, inspect your avatar’s status menu. Do Not Disturb mutes desktop notifications.',
 'If OBS or another streaming app is running, inspect User Settings → Streamer Mode and Disable Notifications. Stop any public stream before temporarily changing this setting, record its original value and restore it after comparison.',
 'If only the currently viewed conversation lacks a pop-up, record that condition. Do not treat it as proof that the entire app or Windows needs reinstalling.',
 ],'This is a Windows desktop comparison. A documented mobile foreground-notification rule is not evidence that the PC client must behave identically.'),
 step(5,'For all banners or game-only failures, inspect Windows','Keep desktop banners, notification sounds and unread badges as separate observations.',[
 'Open Discord User Settings → Notifications and inspect desktop notifications. If only audio is missing, inspect the message-sound setting separately.',
 'On Windows 11, open Settings → System → Notifications. Inspect the global setting and, if Discord appears among app senders, its notification permission and banner option.',
 'Inspect Windows 11 Do not disturb and its automatic conditions. Compare a full-screen game with the normal desktop. On Windows 10, inspect Focus assist and its corresponding automatic rules.',
 'Open notification center with Windows+N on Windows 11, or action center with Windows+A on Windows 10. A notification stored there without a banner points toward display conditions.',
 'Keep Discord running for the comparison. If sounds and unread indicators are absent too, revisit Discord settings; if only the banner is absent, prioritize Windows display conditions.',
 ],'App registration and distribution can affect whether Discord appears in Windows’ per-app list. If absent, inspect Discord’s own settings and status first.'),
 ],
 avoid:['Do not change every server or weaken DM privacy for a single missing notification.','Do not test by repeatedly sending messages or mass mentions; coordinate short tests with a willing person.'],
 cautions:['Record the message type, actual conversation receipt, unread/sound/banner results, viewing state, status and original settings. Restore temporary changes.','For screenshots sent to support, hide DM contents and personal account details. In-game overlay messages and Windows desktop banners are different surfaces.'],
 faqs:[{question:'Should I change server settings when only a DM is silent?',answer:'First check that DM’s mute and whether you ignored the sender. For an unfamiliar sender whose message is absent, inspect Message Requests and Spam.'},{question:'Does server mute always suppress @everyone?',answer:'Discord documents an exception. Inspect @everyone/@here suppression, role suppression and channel mute separately.'},{question:'Why do notifications disappear only while Discord is open?',answer:'Compare viewing the same DM, another conversation and minimized Discord. If all fail, inspect status and Streamer Mode; if unread/sound work but banners do not, inspect Windows.'},{question:'Why is there a badge but no message in the DM list?',answer:'A pending Message Request can produce a badge outside the normal DM list. Inspect Home → Message Requests and verify the sender before accepting.'}],
 sources:[source('215253258-Notifications-Settings-101','Discord: server and channel notifications'),source('223657667-Group-Chat-and-Calls','Discord: group DM notification mute'),source('227779547-Changing-Online-Status','Discord: Do Not Disturb status'),source('218485407-Streamer-Mode-101','Discord: Streamer Mode notification controls'),source('28084948873623-How-to-Ignore-Users-on-Discord','Discord: ignored-user messages'),source('7924992471191-Message-Requests','Discord: message requests and spam'),{label:'Microsoft: notifications and Do not disturb in Windows',url:'https://support.microsoft.com/en-us/windows/experience/notifications-and-do-not-disturb-in-windows'}],
 related:[link('overlay-not-showing','In-game overlay or messages are missing'),link('loading-stuck','Discord stays loading'),link('not-opening','Discord will not open')],
},
{
 ...base,slug:'overlay-not-showing',title:'Discord Overlay Missing: Controls, Call Icons and Message Checks',shortTitle:'Game overlay is missing',
 description:'Separate an overlay that will not open from missing call icons or messages. Compare its assigned key, pin settings and game display mode; check when System Helper applies.',
 lead:'For the Discord desktop game overlay on Windows. These checks do not apply to browser Discord or provide an overlay for macOS/Linux.',
 summary:'With the game in front, press the key actually assigned in Overlay settings. If the controls do not open, check enablement, key conflicts and display mode. If they open, inspect voice and message windows separately. Compare another available game before concluding that Discord itself is broken.',
 quickFacts:[{label:'First success condition',value:'Discord’s overlay controls open over the running game'},{label:'Use your assigned key',value:'A default shortcut found online may not match your settings'},{label:'Change one condition',value:'Keep the same game and scene while comparing settings'}],
 diagnosis:[row('The assigned key does not open the overlay','Check enablement, the actual keybind and game focus.',1),row('Controls open, but call participants are absent','Inspect call membership, voice window pin and display conditions.',2),row('Controls/call icons work, but messages are absent','Inspect Messages, target mute and Streamer Mode.',3),row('Another game works, but this one does not','Compare windowed/borderless mode using the same key.',4),row('Keybinds fail only in a game running as administrator','Inspect Discord’s official System Helper prompt if offered.',5),row('Enabling the overlay makes the game lag or crash','Compare it disabled and keep it off if that is stable.',4)],
 steps:[
 step(1,'Check enablement and your assigned key','You can test whether the controls open without waiting for a message.',[
 'In Windows desktop Discord, select the cogwheel near your username and open Overlay in User Settings.',
 'Enable the overlay and record its toggle keybind. Use the combination currently shown in your app.',
 'Start the game and bring it to the foreground at a safe menu or paused scene. Press that key and check whether Discord’s overlay controls appear.',
 'If absent, compare a key combination that does not conflict with game controls in the same scene. If still absent, continue to Step 4; if it works, revisit the old assignment.',
 ],'The official overlay supports Windows. Repeating these steps in macOS, Linux or browser Discord will not add it; setting labels can vary by version/language.'),
 step(2,'For missing participants, inspect the voice window','If the controls open, separate participant display from overlay startup.',[
 'Join the intended call or voice channel and confirm its participants in the normal Discord window.',
 'In Overlay voice settings, temporarily choose Always for displaying users and inspect the preview.',
 'Return to the game, open the overlay and inspect the voice window’s pin. The official guide identifies the colored pin as the visible/pinned state.',
 'Close the controls and compare the display while people are silent and speaking. If Always works, restore Only while speaking if that is your preferred behavior.',
 ]),
 step(3,'Compare message receipt and display','A Windows desktop banner and a message over the game are different checks.',[
 'Enable Messages in Overlay settings and inspect whether the in-game notification window is hidden/unpinned.',
 'Inspect mute for the DM, group or server used in the test. Unmute only the intended conversation rather than changing all notifications.',
 'Inspect Streamer Mode. Stop any public stream before temporarily disabling it, so private messages are not exposed; preserve its original value.',
 'With the game in front, ask a willing person for a short test DM. Check for the in-game message, then open the conversation to confirm receipt.',
 'If it arrives but the overlay does not show it, continue display checks. If it never arrives or only Windows banners are absent, use the notifications guide.',
 ],'Discord documents target mute and Streamer Mode as reasons overlay messages may not appear. Missing messages alone do not establish that the whole overlay failed.'),
 step(4,'Compare display mode and another game','Keep the keybind constant while changing one game condition.',[
 'Record the game’s current display mode. In its display/video settings, apply windowed or borderless windowed mode if available.',
 'Press the same overlay key in the same menu. If it appears, decide whether to keep that mode or compare restoring the original.',
 'If unchanged, save your work and quit the game and Discord. Use Discord’s notification-area Quit action, then reopen Discord and the game.',
 'If another game is already available, compare it using the same key. Record game and mode if only one fails; for an elevated game, continue to Step 5.',
 'If the overlay causes lag or crashes, disable it and compare the same scene. Keep it disabled if only that state is stable and share the reproduction conditions with support.',
 ],'Success in another game narrows the comparison but does not prove compatibility or a particular cause. Do not disable anti-cheat or security protection to force the overlay.'),
 step(5,'For elevated-game keybinds, inspect the official helper prompt','System Helper addresses elevated-app keybind cases; it is not required for every missing overlay.',[
 'Check whether the affected game runs as administrator. Record whether the same key works in another normally launched game.',
 'Inspect Discord User Settings → Overlay or Keybinds for an official System Helper offer.',
 'If offered and appropriate, follow the Discord app’s installation prompt. If absent, retain your comparison results instead of downloading a helper installer from another site.',
 'After installation, restart Discord and the game and compare the same key, game and display mode. If unchanged, use the System Helper guide and official support.',
 ],'System Helper is an experimental feature offered to some Windows desktop users. An absent option does not by itself mean Discord is faulty.'),
 ],
 avoid:['Do not assume every overlay issue requires reinstalling Discord or installing System Helper.','Do not disable game protection or expose private notifications on a live stream while testing.'],
 cautions:['Record game, Windows/Discord versions, missing controls versus participants/messages, keybind, display mode, another game’s result and elevation. Hide names and private messages in screenshots.','Example: controls and participants appear, a DM arrives in Discord, but no in-game message appears. This illustrates a useful comparison record, not a measured result for a particular game.'],
 faqs:[{question:'Why does the usual default shortcut do nothing?',answer:'Your assignment may differ or conflict with game controls. Inspect the actual keybind and press it while the running game is in front.'},{question:'Is it a fault if silent participants disappear?',answer:'Only while speaking can produce that result. Temporarily compare Always and check whether participants remain when silent.'},{question:'Where is the same overlay in macOS or browser Discord?',answer:'This guide covers Windows desktop. The official game overlay does not work on macOS/Linux; use the normal Discord window while keeping your call active.'},{question:'Should reinstalling be my first step?',answer:'First separate missing controls from missing messages, and one-game failure from all games. Reinstalling may leave the relevant display or notification setting unchanged.'}],
 sources:[source('217659737-Game-Overlay-101','Discord: Game Overlay settings and Windows support'),source('34853435033367-Discord-System-Helper','Discord: experimental System Helper and elevated keybinds')],
 related:[link('notifications-not-working','Desktop notifications are missing'),link('system-helper','System Helper'),jp('slow-performance','Discord feels slow')],
},
{
 ...base,slug:'phone-verification-error',title:'Discord Phone Verification Errors and Missing SMS',shortTitle:'Phone verification and missing SMS',
 description:'Choose checks from the actual phone-verification error. Separate invalid numbers, an existing account, rate limits and missing SMS without repeatedly requesting codes.',
 lead:'For Discord account phone verification on desktop or mobile. Record whether the number was rejected or accepted before an SMS failed to arrive.',
 summary:'For an invalid number, inspect country format and whether it is an eligible mobile number. For an already registered number, inspect your original account. After acceptance, compare SMS receipt on the phone. Apply Discord’s 24–48-hour guidance to Rate Limit or Recently Used errors, not every missing SMS.',
 quickFacts:[{label:'Record the exact message',value:'Invalid, already registered, recently used or awaiting SMS'},{label:'Avoid repeated retries',value:'Choose the step matching the screen before requesting another code'},{label:'Keep credentials private',value:'Never post phone numbers, SMS codes or account recovery secrets publicly'}],
 diagnosis:[row('Invalid phone number','Check selected country, the displayed format and eligible mobile number.',1),row('Phone number is already registered','Inspect your own previous Discord account.',2),row('Rate Limit or Recently Used','Stop repeated attempts and follow the documented waiting period.',3),row('Number accepted, but no verification SMS','Compare actual handset receipt, blocking and other SMS.',4)],
 steps:[
 step(1,'For Invalid, inspect format and number type','Discord requires an eligible mobile number in the correct country format.',[
 'Inspect the country/region selected for the phone number. Match the number’s country rather than guessing from your current location.',
 'Follow the input field’s example for country code and any leading zero. Do not repeatedly add or remove digits based on guesses.',
 'Use your own accessible mobile number. Discord does not accept landline, VoIP or disposable numbers for this verification.',
 'If the same eligible number and correct format remain invalid, record the error and contact official support. Do not use someone else’s number to bypass the rejection.',
 ],'While the number is being rejected as invalid, changing SMS inbox settings does not change that acceptance result.'),
 step(2,'For Already Registered, inspect the original account','A number can be associated with only one Discord account at a time.',[
 'If you can access your previous account, desktop/browser User Settings → My Account provides Remove beside the phone number and asks for your password.',
 'On mobile, open your profile → Settings → Account → Phone → Remove Phone Number. Labels can change with app updates.',
 'Confirm that the original account no longer lists the number. Removal does not guarantee immediate reuse; Discord documents a waiting period.',
 'If you cannot access the original account, read the official phone-removal guide’s recovery route. When you know its registered email, contact support from that address.',
 ],'Discord says support cannot disclose the original account’s email or remove the number if you do not know that email. Do not guess which account to delete.'),
 step(3,'For Rate Limit or Recently Used, stop and wait','The official 24–48-hour instruction concerns these errors.',[
 'Confirm that the message is Rate Limit or Recently Used and record the last attempt’s time.',
 'Stop repeatedly verifying or registering the number and wait 24–48 hours as directed by Discord’s verification guide.',
 'After waiting, try the same mobile number once. If the message changes to Invalid or Already Registered, follow that corresponding step.',
 'If the same error persists after 48 hours, give official support the full error and last-attempt time.',
 ],'Missing SMS without one of these errors does not establish a rate limit, and waiting 48 hours is not a guaranteed repair for every delivery problem.'),
 step(4,'For accepted numbers, compare SMS receipt','These handset checks separate delivery from input rejection; they are not a guaranteed delivery time.',[
 'Match the entered number’s final digits to the phone/SIM currently available to receive SMS and check that mobile service is available.',
 'Inspect the normal SMS app’s spam and blocked-message areas. If ordinary SMS also fails, ask the carrier about reception and SMS settings.',
 'If other SMS arrives but Discord alone does not, record the verification screen. Avoid repeated resend requests; wait before making one further attempt through the official screen.',
 'If unchanged, provide official support the device, carrier, whether an error appears and when you last requested the message.',
 ],'No SMS alone does not identify an invalid number, an existing registration or a rate limit. If a new error appears, use its matching diagnostic row.'),
 ],
 avoid:['Do not repeatedly resend codes, use disposable/borrowed numbers or delete a guessed old account.','Do not publish full phone numbers, SMS codes, passwords or backup codes in comments or screenshots.'],
 cautions:['For official support, record exact error, last attempt, desktop/mobile and completed checks. Handle private account information only as requested through the official support process.','If the number belongs to an accidental older account, the official removal guide explains its recovery flow and support limits. Read that route before making further account changes.'],
 faqs:[{question:'Can I reuse the number immediately after removal?',answer:'Not necessarily: Discord documents a waiting period. If Recently Used or Rate Limit appears, follow its 24–48-hour guidance and contact support if the same error persists afterward.'},{question:'Must every missing SMS wait 24–48 hours?',answer:'That guidance concerns Rate Limit/Recently Used. Without those errors, inspect the number, handset reception and other SMS before assuming the same condition.'},{question:'Can support remove it if I do not know the old account’s email?',answer:'The official removal guide says support cannot disclose that email or remove the number in this situation. Look for your own previous account details and inspect the official recovery route.'}],
 sources:[source('26680694104215-How-to-Fix-Phone-Errors-on-Discord','Discord: phone-number error types'),source('6181726888215-How-to-Verify-Your-Discord-Account','Discord: verification and rate-limit waiting conditions'),source('4413460214807-How-to-Remove-a-Phone-Number-From-a-Discord-Account','Discord: phone removal and account recovery limits'),{label:'Discord: official support request',url:'https://support.discord.com/hc/en-us/requests/new'}],
 related:[link('login-error','Cannot log in'),link('not-opening','Discord will not open')],
},
];
