import type { LocalizedArticle } from './types';
const source=(id:string,label:string)=>({label,url:`https://support.discord.com/hc/en-us/articles/${id}`});
const voice=source('360045138471-Discord-Voice-and-Video-Troubleshooting-Guide','Discord: voice and video troubleshooting');
const status={label:'Discord Status: service incidents',url:'https://discordstatus.com/'};
const step=(n:number,title:string,summary:string,actions:string[],note?:string)=>({id:`cause-${n}`,title,summary,time:'Compare one change at a time',actions,...(note?{note}:{})});
const row=(symptom:string,cause:string,n:number)=>({symptom,cause,stepId:`cause-${n}`});
const link=(slug:string,label:string)=>({href:`/en/discord/${slug}`,label});
const jp=(slug:string,label:string)=>({href:`/discord/${slug}`,label:`${label} (Japanese)`});
const base={locale:'en' as const,gameSlug:'discord',gameName:'Discord',checkedAt:'2026-10-18',sourcePolicy:'English adaptation of the existing Japanese guide using corresponding steps and verified official documentation. Comparison examples are editorial guidance, not measured outcomes. Preserve access and original settings; distinguish an unavailable test from a successful result.'};
export const discordLoginMicNetworkEn: LocalizedArticle[] = [
{
 ...base,slug:'login-error',title:'Cannot Log In to Discord: Email, Password and Authentication Checks',shortTitle:'Cannot log in',
 description:'Identify the screen that stops you, preserve signed-in devices and distinguish email, password, MFA and app-loading problems. Follow official recovery limits without sharing secrets.',
 lead:'For Discord desktop/browser login failures, missing reset email or authentication prompts. A phone that is already signed in can help check account details; keep that session available.',
 summary:'Preserve any signed-in device and inspect the registered email and available authentication methods. Email mismatch, a forgotten password and an MFA prompt need different actions. If only the app fails, compare the same account in the browser. Do not start by logging out everywhere or repeatedly requesting resets.',
 quickFacts:[{label:'Preserve existing access',value:'Keep a working signed-in device available before clearing data'},{label:'Record the stopping point',value:'Email, password, authentication code or post-login loading'},{label:'Passwords and MFA differ',value:'Resetting a password does not remove authentication requirements'}],
 diagnosis:[row('Email does not exist, or the registered address is unknown','Inspect My Account on a signed-in device and previous Discord email.',1),row('The address is known, but the password is forgotten/rejected','Use the official login page’s password-reset option.',2),row('The requested reset email never arrives','Compare the recipient, spam folders, rules and mailbox capacity.',3),row('Authentication stops after the password, or the phone was lost','Inspect registered methods, unused backup codes and pre-enabled SMS MFA.',4),row('Only the app fails or loading never finishes after login','Compare the same account’s conversation list in the browser.',5),row('Phone verification fails or an SMS is missing','Distinguish SMS MFA from initial phone-number verification.',4),row('Account disabled, or an unexpected email-change notice arrives','Follow the relevant official account-state/recovery route.',6)],
 steps:[
 step(1,'Confirm the registered address and preserve signed-in devices','A correct password cannot fix using the wrong account identifier.',[
 'If Discord still works on any phone, PC or browser, keep it signed in. Do not delete that app or clear its cookies merely to compare login.',
 'On desktop, inspect User Settings → My Account for the email. On mobile, open your profile/settings account area. Follow any identity check and record only the account information you can actually confirm.',
 'Without a signed-in device, search your own likely inboxes for previous Discord messages. Check that the email field contains an address rather than a display name/username and remove accidental surrounding spaces.',
 'If a phone number was already attached, inspect whether the login page accepts that number instead of email. Number-based login is distinct from receiving an SMS authentication code.',
 'Use the confirmed address/number for the intended account. For an unknown password, continue to Step 2. If the original mailbox is inaccessible, inspect the email provider’s recovery process first.',
 ],'Discord documents that support cannot disclose the registered email or change it on your behalf. Do not assume losing mailbox access can be solved by asking Discord to replace the address.'),
 step(2,'Reset a forgotten password through the official login page','Use this for the password stage, not as a way to remove MFA.',[
 'Type https://discord.com/login into the browser address bar. Enter the registered email and select Forgot your password?',
 'Inspect that inbox for the reset you requested. If absent, use Step 3 before repeating the request.',
 'Follow the requested email to the official reset page and choose a new password. If authentication is required, use a registered method; if unavailable, use Step 4.',
 'Return to login with the new password. Check whether autofill is still supplying the old one and update the saved entry as needed.',
 'After the conversation list opens, confirm the username and server memberships belong to your intended account. If it is another account, revisit the identifier instead of immediately rejoining servers.',
 ]),
 step(3,'For missing reset email, inspect destination and delivery','Requesting a message and receiving it in the intended mailbox are separate observations.',[
 'Compare the entered address against My Account on a working device or the recipient of older Discord messages. Check similar addresses, typos and unrelated service accounts.',
 'Open the email provider’s web interface and search spam, trash and all-mail views. Compare whether only the phone’s mail app has stopped refreshing.',
 'Inspect filtering rules, blocked senders and mailbox capacity. For work/school mail, ask its administrator about delivery restrictions.',
 'If you resend after confirming the destination, record the request time. Stop when a retry/rate-limit message appears and follow that message; there is no single waiting period for all delayed email.',
 'If unresolved, give official support the request time, entered address, exact error and folders checked. Do not include passwords or reset links.',
 ],'Missing email alone does not establish that an account is nonexistent or compromised. Combine account-identifier checks with actual mailbox findings.'),
 step(4,'At an authentication prompt, inspect registered recovery methods','Authenticator codes, backup codes and SMS are different methods. Use what was already enrolled and what the actual prompt offers.',[
 'If your authenticator is available, choose the Discord entry and its current code. Check for an expired code or an entry belonging to another account.',
 'If the device is lost, look in your own saved files/photos for unused Discord backup codes, including discord_backup_codes.txt. At Verify with something else, use the backup-code option if available.',
 'On a device still signed in, inspect My Account → View Backup Codes. Discord’s recovery guide requires the password to view them; being signed in does not guarantee you can retrieve them.',
 'If SMS MFA was enabled beforehand, inspect the alternative method for a code sent to your phone. Merely having a phone number attached does not establish SMS MFA availability.',
 'If a previously registered passkey or another enrolled method is offered, use that method. For initial phone verification or a number error, use the phone-verification guide instead.',
 'After recovery, review authentication using the official setup guide and preserve new backup codes securely. If no enrolled method or unused code remains accessible, do not use unofficial services promising to remove MFA.',
 ],'Discord states that support cannot remove MFA or issue replacement backup codes when you cannot access your backup codes. A password reset does not remove this limit.'),
 step(5,'For app-only failure, compare the same account in a browser','Do not log out a working device just to run a comparison.',[
 'On the affected PC, open https://discord.com/app and check the same account’s actual conversation list. A public landing page is not successful login.',
 'If only the browser succeeds, fully quit the desktop app from the notification area and restart to apply updates. Use the not-opening or loading-stuck guide for those respective symptoms.',
 'If both fail, inspect Discord Status and record whether errors match or one client merely stays loading. During a relevant incident, compare again after recovery.',
 'If unrelated sites also fail, inspect the connection first. If only a Discord authentication error remains, return to that error’s step rather than repeatedly changing network settings.',
 ]),
 step(6,'For account restrictions or unexpected changes, follow the notice','Account-state problems are different from a forgotten password and may not be repaired by reinstalling.',[
 'For an account-disabled or restriction notice, inspect the screen and registered email and use the official support/appeal route it identifies. Do not repeat cache deletion or email requests.',
 'For an email change you did not make, inspect the notification sent to the original address and its Start Account Recovery action. The official guide specifies a 48-hour link beginning https://discord.com/wasntme/; verify it and never share the private link.',
 'Read the recovery effects before completing that process: it signs out all devices, changes the password and removes the attached phone and MFA methods. Re-enroll needed security afterward. Discord cannot reissue an expired recovery link.',
 'Distinguish Invalid Email while adding an address and Changing Email Too Fast while verifying/changing it from ordinary login mismatch. The official 24-hour instructions concern those specific email operations, not every login failure.',
 'For support, provide the exact error, time, screen/action and whether a signed-in device remains. Exclude passwords, authentication/backup codes and reset/recovery URLs.',
 ]),
 ],
 avoid:['Do not clear the only working session or create another account before confirming the existing account details.','Do not share reset links or authentication secrets, spam requests or pay unofficial services to bypass MFA.'],
 cautions:['Record the stopping screen/error, whether the registered mailbox is confirmed and accessible, available authentication methods, working sessions and app/browser results.','For example, an authentication prompt after the password with a phone still signed in calls for checking that session and saved methods before resending password email. This is an example of prioritization, not an observed recovery result.'],
 faqs:[{question:'Does resetting my password let me skip MFA?',answer:'No. Password reset and MFA are separate. Use an enrolled method or unused backup code when authentication is required.'},{question:'Should I log out the phone where Discord still works?',answer:'First preserve that session and inspect the account identifier and available authentication methods. Do not discard your only working access as a test.'},{question:'Can support tell me my registered email?',answer:'Discord says it cannot disclose it. Inspect a signed-in device, previous Discord messages in your own inboxes or an already registered phone number.'},{question:'Must I wait 24 hours for every missing reset email?',answer:'No universal rule is given for ordinary delivery delay. Inspect destination and receiving conditions; the documented 24-hour wait applies to specific email-add/change errors.'}],
 sources:[source('32557375603479-Discord-Login-Email-Troubleshooting-Guide','Discord: login and email troubleshooting'),source('218410947-How-to-Reset-or-Change-Your-Forgotten-Password-on-Discord','Discord: password reset and change'),source('115001221072-How-to-Recover-Your-Discord-Account-When-Locked-Out-of-Multi-Factor-Authentication-MFA','Discord: recovery when locked out of MFA'),source('219576828-Setting-up-Multi-Factor-Authentication','Discord: enrolled MFA methods and backup codes'),source('27299669812375-My-Discord-Email-was-Changed-and-I-Want-to-Undo-It','Discord: undoing an unexpected email change'),status],
 related:[link('phone-verification-error','Phone verification or missing SMS'),link('loading-stuck','Login finishes but loading is stuck'),link('not-opening','Discord will not open'),link('update-failed','Update Failed')],
},
{
 ...base,slug:'mic-volume-low',title:'Discord Microphone Too Quiet: Compare the Listener, Windows and Your Input',shortTitle:'Microphone is too quiet',
 description:'Separate one listener’s volume from a quiet microphone for everyone. Compare the same device in Windows recording and Discord, then input level, position and gain without clipping.',
 lead:'For Windows 11/10 desktop Discord when others say your voice is quiet. First ask whether one person or everyone hears it that way; their playback volume and your input level are different controls.',
 summary:'If only one person hears you quietly, that listener checks your individual user volume first. If everyone does, compare the same microphone in Windows recording and Discord. Quiet recordings prioritize Windows/device input; only Discord being quiet prioritizes its device and input settings. Confirm the result in a real call.',
 quickFacts:[{label:'Who hears low volume?',value:'One listener versus everyone determines who adjusts first'},{label:'Same mic and phrase',value:'Keep microphone distance and playback volume comparable'},{label:'Level versus sensitivity',value:'Input volume changes loudness; sensitivity affects when speech is transmitted'}],
 diagnosis:[row('Only one participant hears you quietly','That listener checks the volume they assigned to you.',1),row('Everyone hears you quietly; recording is untested','Compare Windows recording and Discord using the same mic.',2),row('Windows recording and Discord are both quiet','Adjust Windows input and make a new recording.',3),row('Windows recording is adequate; only Discord is quiet','Inspect Discord’s named input and Input Volume.',4),row('100% is still quiet, or increases cause noise/distortion','Inspect pickup direction, distance, device gain and connection.',5),row('Only quiet words or sentence endings disappear','Distinguish sensitivity/processing from low overall volume.',4)],
 steps:[
 step(1,'For one affected listener, have them inspect your user volume','If A sounds quiet only to B, B makes the first adjustment.',[
 'Have A repeat the same sentence and, if possible, ask another participant besides B how it sounds.',
 'B right-clicks A’s name/avatar in the voice channel or call and inspects the individual user-volume slider.',
 'B records the previous value and raises it gradually if it was reduced. A repeats the same sentence so B can compare clarity.',
 'If B finds everyone quiet, B checks Discord Output Volume, Windows mixer and headset playback volume separately.',
 ],'A possible request: “Only you seem to hear my voice quietly. Could you check the user volume set for me while I repeat the same sentence?” If this resolves it, do not also raise A’s microphone input unnecessarily.'),
 step(2,'For everyone, compare recording, mic test and the call','Use the same input device and keep headphone playback level fixed; otherwise you may compare different microphones or listening volumes.',[
 'Inspect the microphone name in Windows Settings → System → Sound → Input. Select that same device in Discord Voice & Video → Voice → Input Device.',
 'Open Sound Recorder from Start (Voice Recorder on Windows 10), confirm the intended microphone and record the same sentence at your normal speaking level. Play it through the same headphones.',
 'Start Discord Mic Test under Voice & Video → Voice and repeat the phrase at the same distance. The test temporarily mutes/deafens you in an active voice channel; stop it before asking the caller to listen.',
 'If recording is already quiet, continue to Step 3. If recording is adequate but Discord is quiet, use Step 4. If both are adequate, revisit the listener’s settings in Step 1.',
 ],'Recording software and Discord process audio differently, so this is not a calibrated loudness measurement. Verify the final result with the same person in a call.'),
 step(3,'For quiet Windows recordings, adjust input gradually','Input level is different from playback volume. Make a new recording after each input change.',[
 'On Windows 11, open Settings → System → Sound → Input, select the microphone and record Input volume.',
 'Raise it a little and record the same phrase again. Moving from 50 to 60 is an example of a small comparison, not a recommended value for all microphones.',
 'If the input settings offer Start test, Stop test and Play, use them. If playback is unavailable there, compare recordings as in Step 2.',
 'On Windows 10 or when that layout is absent, Windows+R → mmsys.cpl → Recording → the mic’s Properties → Levels provides any controls the device supports.',
 'With intelligible speech and no distortion on a slightly louder phrase, try the Discord call. If maximum level remains quiet or mainly adds noise, continue to Step 5.',
 ]),
 step(4,'For Discord-only low volume, compare input and processing','Input Volume concerns the voice you send; Output Volume concerns the voices you hear.',[
 'Under Voice & Video → Voice, explicitly choose the microphone by name rather than relying on Default.',
 'Increase Input Volume gradually and compare normal and slightly louder speech in Mic Test. Restore the earlier value if sound becomes rough or distorted.',
 'Stop Testing, then have the same person hear the same sentence. Do not change their per-user volume and your input level simultaneously.',
 'If input level is unhelpful, record and compare any displayed noise suppression or automatic gain control setting one at a time. Restore changes that do not help.',
 'If only quiet words or endings vanish rather than the whole voice being low, use the voice-cutting-out guide for sensitivity and processing comparisons.',
 ],'Layout can vary; current official guidance groups voice controls under Voice. Input sensitivity is a transmission threshold, not a multiplier that amplifies the entire voice.'),
 {...step(5,'At maximum software level, inspect position, gain and connection','Check the actual microphone and pickup position before pushing every control upward.',[
 'Confirm that a webcam or laptop mic was not selected accidentally. Use the microphone manual to identify its pickup face, move slightly closer while keeping orientation consistent and record again.',
 'If a USB mic/interface has microphone gain, record its position and increase it gradually. Do not confuse this with its headphone playback knob.',
 'If Microphone Boost is offered, compare one increment using a new recording. Restore it if noise rises or stronger speech clips; some devices do not expose this control.',
 'Compare a USB mic directly in another port. If another mic is already available, record the same phrase to check whether only the original device is quiet.',
 'If another mic works, inspect the original device, cable and companion software. If several behave alike, revisit Windows input selection/settings before blaming hardware.',
 ]),guideLink:{href:'/en/gear/discord-microphone-guide',label:'Microphone checks before buying equipment',description:'Consider another microphone only after input selection, distance, gain and connection checks. A settings fix does not require buying hardware.'}},
 ],
 avoid:['Do not raise all gain and playback controls to maximum or assume 100% proves hardware failure.','Do not confuse input volume with the listener’s output or sensitivity with amplification.'],
 cautions:['Record who hears low volume, Windows/Discord comparison results, input device, changed levels and whether noise/distortion appeared.','If later trying Reset Voice and Video Settings, first record input/output devices, levels, input mode and keybinds. The official route uses Voice & Video → Debugging. Reselect the intended devices after reset and compare the same phrase/person again.'],
 faqs:[{question:'Windows recording is fine but Discord stays quiet. What next?',answer:'Confirm input and level, restart Discord, then optionally compare the same mic in browser Discord with site microphone permission. Browser success is a comparison, not a guaranteed repair.'},{question:'Why is it still quiet at 100%?',answer:'The wrong device, pickup distance/direction, Windows level or hardware gain may contribute. Check whether Windows recordings are quiet before using that percentage as a diagnosis.'},{question:'Should the listener simply set me to 200%?',answer:'It may help them hear you but does not repair an already quiet source recording. For one listener inspect their volume; for everyone inspect your input.'},{question:'Will lowering sensitivity make my voice louder?',answer:'Sensitivity affects whether speech is transmitted, not overall amplification. Missing endings call for threshold checks; consistently quiet speech calls for input/gain checks.'},{question:'Why does Mic Test sound loud when a caller says I am quiet?',answer:'Your playback volume affects how the test sounds to you. Stop it and verify an actual call; compare that listener’s volume/output if only they are affected.'}],
 sources:[source('360020641332-Mic-Testing','Discord: Mic Test and temporary call mute/deafen'),voice,{label:'Microsoft: setting up and testing microphones',url:'https://support.microsoft.com/en-us/windows/hardware/drivers/how-to-set-up-and-test-microphones-in-windows'},{label:'Microsoft: microphone level, boost and troubleshooting',url:'https://support.microsoft.com/en-us/windows/hardware/drivers/fix-microphone-problems'}],
 related:[link('mic-not-working','Microphone has no input'),jp('voice-cutting-out','Quiet words or endings disappear'),jp('user-volume-low','A caller sounds quiet'),link('echo-double-voice','Echo or double voice')],
},
{
 ...base,slug:'no-route',title:'Discord No Route: Compare the Device, Network and Voice Channel',shortTitle:'No Route voice error',
 description:'Compare the same voice destination across a PC, another device and another network. Inspect VPN, targeted permissions and channel region without assuming DNS or router failure.',
 lead:'For Discord voice calls that display No Route on Windows desktop or browser. Working websites or text chat do not prove the voice connection works.',
 summary:'Record the error/time and inspect incidents, then compare another channel or DM. If available, compare another device on the same Wi-Fi and the same PC on another network. Use those results to choose network, PC or channel checks; avoid indiscriminate DNS changes, router resets and firewall shutdowns.',
 quickFacts:[{label:'Compare real calls',value:'Text chat working is not a successful voice test'},{label:'Change one condition',value:'Same destination; separate device and network comparisons'},{label:'Unperformed stays unknown',value:'Use available comparisons without buying another device or connection'}],
 diagnosis:[row('PC and phone fail on one Wi-Fi; another network works','Prioritize the original connection/router/VPN path.',2),row('Phone works on the same Wi-Fi; only the PC fails','Inspect PC VPN, app permissions and desktop/browser difference.',3),row('The same PC succeeds only with its VPN disconnected','Ask the VPN provider about UDP support and configuration.',2),row('One channel fails, but another channel or DM works','Compare its region with the administrator and preserve the original.',4),row('Several people fail together or another network also fails','Inspect incidents and other destinations; retain the comparison results.',1),row('Browser voice works, but the app alone shows No Route','Inspect updates and voice settings before reinstalling.',3)],
 steps:[
 step(1,'Use incident checks and comparisons to narrow the scope','Web access is not equivalent to a working voice session.',[
 'Record No Route and its time. Inspect Discord Status and your provider’s incident information. For a relevant outage, repeat the same call after recovery.',
 'Leave/rejoin once. If it continues, use the same PC/network to try another permitted channel or a DM with a willing person. For only one failing destination, continue to Step 4.',
 'If available, try that same destination on a phone using the same Wi-Fi. Confirm it has not switched to mobile data and record its actual network.',
 'Next, compare the same PC on another permitted connection such as your own hotspot. Keep the call brief, account for data limits and restore the original network afterward.',
 'Example record: PC/home Wi-Fi fails, phone/home Wi-Fi fails, PC/hotspot works. This prioritizes the home path but does not itself establish a faulty router or blocked UDP.',
 ],'If another device/network is unavailable, record it as untested. Continue with available comparisons such as another channel or the same-PC browser.'),
 step(2,'For one failing network, inspect VPN and router conditions','Discord documents UDP support for voice through a VPN; compare VPN state separately from network changes.',[
 'For a VPN you control, compare it disconnected when permitted. If that helps, consult the provider about UDP/configuration. Ask the administrator about a required work/school VPN.',
 'If home internet alone fails even without the VPN, check whether others are using it before restarting the modem/router according to its manufacturer.',
 'After connection recovery, restart the PC and test a short conversation with the same account/channel. Do not press the router’s factory-reset button.',
 'If unchanged, send the ISP/router provider the time and comparisons, such as multiple devices failing on one Wi-Fi but another connection working. Do not guess port numbers to open.',
 ],'Another network working narrows the path; it does not identify the router as faulty. Respect shared users and managed network rules.'),
 step(3,'For PC-only failure, compare clients and targeted permissions','Inspect evidence before disabling protection broadly.',[
 'Fully quit Discord through the notification area, restart to apply updates and, if needed, restart the PC before repeating the same call.',
 'End the app call, open https://discord.com/app on the same PC and join the same destination. Allow microphone access and verify actual conversation, not just the page loading.',
 'If app and browser both fail, inspect PC VPN use and security software block history. Match event time and the actual Discord executable before drawing a conclusion.',
 'For Windows app permissions, inspect Windows Security → Firewall & network protection → Allow an app through firewall, including Discord and the active network type. Have the administrator handle managed PCs.',
 'If the high-priority QoS setting is enabled under Voice & Video, record it, disable it and compare the same call. Skip an absent control and restore it if unhelpful.',
 'If only the browser keeps succeeding, use the RTC Connecting guide’s app checks. Before any later reinstall, confirm email/password and MFA access so you can sign back in.',
 ],'Appearing in an allowlist does not prove every connection is permitted. Confirm only required changes with the administrator/provider instead of stopping the entire firewall or allowing all networks.'),
 step(4,'For a single channel, compare its voice region with the admin','A region change affects participants too; coordinate the comparison.',[
 'Record that another channel/DM works and whether other participants also fail in the affected channel.',
 'With management permission, open the voice channel’s Edit Channel → Overview → Region Override. Record Automatic or the existing region.',
 'Temporarily select an available alternative and rejoin with the same people/network. If you lack permission, ask the administrator to perform the comparison.',
 'If unchanged, restore Automatic/the original region. If improved, share the successful region and results with the administrator before choosing the ongoing setting.',
 ]),
 step(5,'Organize evidence before DNS changes or a network reset','No Route alone does not establish a DNS problem.',[
 'Separate a voice-only failure from websites also failing to resolve or load. If browsing fails too, consult the provider’s connection guidance.',
 'Do not apply DNS-cache clearing, DNS-server replacement or network reset as mandatory repairs for every voice-only No Route error.',
 'If an administrator/provider’s diagnosis calls for a change, record automatic configuration or original values first. Repeat the same call afterward and restore unhelpful changes as instructed.',
 'If No Route disappears but audio is missing, switch to the cannot-hear or microphone guide. A connected call and working audio are different results.',
 ]),
 ],
 avoid:['Do not infer router damage, blocked UDP or DNS failure from the error label alone.','Do not factory-reset the router, guess firewall ports or leave protection disabled.'],
 cautions:['For support, record time, desktop/browser results, another same-Wi-Fi device, the same PC on another network, channel/DM differences, VPN and settings restored/retained.','For network-specific failures contact the network operator; for app-only failures contact Discord. Its official guide includes PTB/Canary log collection when needed: follow that procedure, keep logs private and submit only to official support.'],
 faqs:[{question:'Does No Route mean my router is broken?',answer:'No. Compare another device on the same network and the same PC on another network before narrowing the investigation.'},{question:'Why does text chat work while voice fails?',answer:'They are different connection checks. Inspect VPN UDP support and PC permissions according to the actual comparison results.'},{question:'Will clearing DNS always fix it?',answer:'No Route does not itself prove DNS failure. Compare device, network and destination first; use provider guidance if evidence points to name-resolution trouble.'},{question:'Do RTC Connecting and No Route have different causes?',answer:'Discord groups both as voice-connection errors. Use comparable device/network/destination results instead of diagnosing solely from the label; the RTC guide adds app-side checks.'}],
 sources:[source('115001310031-Voice-Connection-Errors','Discord: voice connection errors, VPN and regions'),voice,status],
 related:[link('rtc-connecting','Stuck on RTC Connecting'),link('call-disconnects','Calls repeatedly disconnect'),link('cant-hear-voice','Connected but cannot hear callers'),link('mic-not-working','Microphone does not respond')],
},
];
