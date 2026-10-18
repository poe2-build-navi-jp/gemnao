import type { LocalizedArticle } from './types';
const source=(id:string,label:string)=>({label,url:`https://support.discord.com/hc/en-us/articles/${id}`});
const voice=source('360045138471-Discord-Voice-and-Video-Troubleshooting-Guide','Discord: voice and video troubleshooting');
const mic=source('360020641332-Mic-Testing','Discord: microphone testing and call muting');
const codes=source('30952914470807-Discord-Audio-and-Video-Error-Codes-Troubleshooting-Guide','Discord: audio and video error codes');
const windows=(path:string,label:string)=>({label,url:`https://support.microsoft.com/en-us/windows/${path}`});
const micTest=windows('hardware/drivers/how-to-set-up-and-test-microphones-in-windows','Microsoft: set up and test a microphone');
const status={label:'Discord Status: service incidents',url:'https://discordstatus.com/'};
const support={label:'Discord: contact support',url:'https://support.discord.com/hc/en-us/requests/new'};
const step=(n:number,title:string,summary:string,actions:string[],note?:string)=>({id:`cause-${n}`,title,summary,time:'Compare one change at a time',actions,...(note?{note}:{})});
const row=(symptom:string,cause:string,n:number)=>({symptom,cause,stepId:`cause-${n}`});
const link=(slug:string,label:string)=>({href:`/en/discord/${slug}`,label});
const jp=(slug:string,label:string)=>({href:`/discord/${slug}`,label:`${label} (Japanese)`});
const base={locale:'en' as const,gameSlug:'discord',gameName:'Discord',checkedAt:'2026-10-18',sourcePolicy:'English adaptation of the Japanese guide with the same cause IDs, action sequence, cautions and source scope. Official Discord, Microsoft and relevant browser documentation support the checks. Comparison examples are editorial guidance, not measured results. Test with a willing participant, keep recordings private and restore unhelpful changes.'};
export const discordAudioChecksEn: LocalizedArticle[] = [
{
 ...base,slug:'cant-hear-voice',title:'Cannot Hear People in Discord: Everyone, One Person or Only While Gaming',shortTitle:'Cannot hear people in Discord',
 description:'Separate Windows output, Discord deafen, individual user volume and the speaker’s microphone. Compare the same headphones, participant and short phrase before resetting settings.',
 lead:'For the Windows 11/10 desktop app when you join a call but hear nobody, cannot hear one person, or lose voices after starting a game or stream. A browser comparison is included.',
 summary:'First identify whether everyone is silent or only one person. For everyone, check deafen and Windows/Discord output. For one person, check your local mute and their user volume. If nobody hears that speaker, ask them to check microphone input and speaking permissions.',
 quickFacts:[{label:'Start here',value:'Stop any mic test and check the headphone/deafen icon'},{label:'Same output device',value:'Compare a harmless local sound or another app'},{label:'One speaker only',value:'Compare your local mute/volume with another listener’s result'}],
 diagnosis:[row('Everyone is silent and other Windows/app sounds fail','Inspect the physical output device and Windows selection.',1),row('Other sounds work; all Discord voices are silent','Check deafen, Discord output and per-app volume.',2),row('Only one person is silent to you','Compare local mute/user volume with another listener.',3),row('Nobody hears the same speaker','Check that speaker’s mic, test and speaking permissions.',3),row('DM calls work; one server does not','Ask its administrator about server deafen/mute or speaking restrictions.',4),row('Voices disappear only after a game/stream starts','Compare output selection, masking by game sound and stream versus call audio.',5),row('RTC Connecting or No Route remains','Resolve connection failure before assessing sound.',4)],
 steps:[
 step(1,'Test the same headphones outside Discord','Confirm that Windows can play sound through the intended device before changing Discord.',[
 'Check the headphone connection, physical volume control and speaker power. Start with a low volume and increase gradually, never immediately to maximum.',
 'Open Windows Settings → System → Sound → Output and select the actual headphones/speakers. Check whether an HDMI/DisplayPort monitor was selected instead.',
 'Play a harmless local audio file or another app’s video through the same device. Check that the player itself is not muted.',
 'If it is audible, continue to Step 2. Otherwise, compare another port or available headphones and record which change helps.',
 'If the intended device is absent from Windows Output, inspect its connection and manufacturer’s driver/support guidance. Changing a Discord user’s volume will not resolve that missing-device check.',
 ]),
 step(2,'If only Discord is silent, check deafen and output','Your microphone reaching others does not establish that your output path works.',[
 'Check Discord’s headphone icon and turn off deafen if you enabled it. The microphone mute controls your outgoing voice; deafen also prevents hearing the call.',
 'Stop any microphone test in Voice & Video before asking someone to speak. Discord documents automatic mute/deafen during its mic test.',
 'Open User Settings → Voice & Video and choose the device that worked in Step 1 by name under Output Device. Check that Output Volume is not zero.',
 'On Windows 11, open Settings → System → Sound → Volume mixer. Inspect Discord’s mute/volume and its expanded output-device selection.',
 'On Windows 10, right-click the taskbar speaker and open Volume Mixer for app volume. Check app routing under Settings → System → Sound → App volume and device preferences.',
 'If Discord is absent from the mixer, keep the app open, ask a participant to speak during a call and reopen the mixer. After changing output, rejoin if needed and compare the same short phrase.',
 ],'Use actual Windows/app audio and the call; do not assume Discord has a dedicated output-test-tone button. In the browser, inspect that browser’s mixer volume and tab/site mute instead.'),
 step(3,'If one person is silent, compare local settings with other listeners','The useful distinction is whether only you cannot hear them or nobody can.',[
 'Right-click the participant’s name/avatar and inspect your local Mute setting. Do not confuse local mute with an administrator’s Server Mute.',
 'Check User Volume in that menu for zero or an unusually low level. Keep physical output modest and raise gradually while they speak.',
 'Ask another willing participant whether they hear the same person. If they do, prioritize your local settings and output.',
 'If nobody hears that person, ask the speaker to check physical/Discord mute and microphone testing using the microphone guide.',
 'If their test plays their voice back, have them stop the test and return to the call. If a DM works but the server does not, ask its administrator about Speak permission and Server Mute.',
 ],'A glowing avatar alone does not prove intelligible speech is arriving; background noise can trigger activity. Confirm a short phrase such as “Audio check, one, two, three.”'),
 step(4,'Separate server restrictions from an unfinished connection','Joining a channel and successfully sending/receiving voice are different observations.',[
 'If RTC Connecting or No Route remains, record it and follow the connection-error guide instead of increasing volume.',
 'With the same headphones/output settings, compare a willing contact’s DM call and the affected server. Check another permitted voice channel too.',
 'If only one server is silent, ask its administrator whether you are server-deafened. Reinstalling the app cannot lift a server restriction you cannot change.',
 'If several people lose audio together, inspect Discord Status. Recheck after a relevant incident recovers; an unlisted incident still does not establish a local cause.',
 ]),
 step(5,'If it happens during gaming or streaming, identify which sound fails','A caller’s voice, a viewed stream’s audio and your own game sound use different checks.',[
 'Confirm the caller is audible before the game starts, then ask for the same phrase afterward. Compare Discord and Windows output selections before/after.',
 'Temporarily lower the game’s volume to distinguish complete silence from a voice masked by louder audio. Restore an unhelpful change; use the low-user-volume guide if the voice is merely quiet.',
 'If using Bluetooth, compare available wired/USB equipment under the same call conditions. If only Bluetooth is affected, use the Bluetooth audio guide.',
 'If voices work but a viewed stream’s game audio does not, inspect that stream’s mute/volume and the viewer checks in the stream-no-audio guide.',
 'If sound cuts out rather than remaining silent, stop screen sharing or recording one at a time and compare. Continue with the voice-cutting-out guide for that symptom.',
 ]),
 step(6,'Compare the browser before resetting an app-only failure','Do this after checking output and individual settings; do not run duplicate calls for the same account.',[
 'Leave the desktop call and open https://discord.com/app. Compare the same participant and headphones in a browser call.',
 'If only the browser works, record the app’s input/output, input mode and keybinds. Fully quit from the tray, reopen/update the app and compare the same call.',
 'If only the app remains silent, consider Reset Voice and Video Settings in Voice & Video’s debugging area. Labels and placement vary by version.',
 'Select the output device again and compare. If unhelpful, restore recorded settings and report the separate Windows/app/browser results to support.',
 ]),
 ],
 avoid:['Do not raise every volume to maximum or treat microphone permission as an output repair.','Do not bypass server restrictions or record/share private calls for a basic comparison.'],
 cautions:['Record everyone/one-person scope, other-app audio, output model, DM/server difference, other listeners’ results, browser comparison and time.','Use a willing participant and the same short phrase. No conversation recording or DM publication is needed.'],
 faqs:[{question:'People hear me, but I hear nobody. Why?',answer:'Working input does not establish working output. Check deafen, the selected output and Windows per-app volume. Stop any microphone test before testing the live call.'},{question:'Their avatar lights up, but I hear nothing.',answer:'The indicator does not confirm audible speech or your playback path. Inspect local mute/User Volume and ask whether another participant hears that person.'},{question:'Will enabling microphone permission make incoming voices audible?',answer:'That permission concerns input. For incoming voices alone, begin with output routing and deafen.'},{question:'Are these also the steps for missing stream audio?',answer:'Call voices and a viewed stream have separate volume controls. If voices work, inspect stream mute/volume and whether the broadcaster is sharing the application’s audio.'}],
 sources:[voice,mic,windows('hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows','Microsoft: app audio fails while system sounds work'),windows('hardware/audio/fix-sound-or-audio-problems-in-windows','Microsoft: Windows sound troubleshooting'),status],
 related:[link('mic-not-working','Microphone checks'),link('user-volume-low','Quiet caller volume'),link('bluetooth-audio-problem','Bluetooth audio'),link('stream-no-audio','Missing stream audio'),link('voice-cutting-out','Voice cutting out'),link('rtc-connecting','RTC Connecting'),jp('no-route','No Route')],
},
{
 ...base,slug:'audio-input-not-found',title:'Discord Cannot Find Audio Input: Compare Windows, the App and Browser',shortTitle:'Audio input device not found',
 description:'Distinguish a missing microphone from a selectable device with no speech. Compare Windows input tests, Discord device selection and Chrome site permission before resetting voice settings.',
 lead:'For Windows 11/10 desktop Discord or the browser when the intended microphone is missing, an audio-input warning appears, or a selectable microphone receives no speech. Chrome is the browser example.',
 summary:'First check whether Windows lists the microphone, then whether it receives your voice. If Windows succeeds, compare Discord’s named input and app access. If only the browser fails, inspect discord.com site permission. If Discord’s test succeeds but callers hear nothing, move to mute, input mode and channel checks.',
 quickFacts:[{label:'Listed is not tested',value:'A selectable device does not establish that speech reaches it'},{label:'Keep the comparison consistent',value:'Use the same microphone, distance and phrase in each test'},{label:'Test one client at a time',value:'Close competing calls/recorders before comparing the next app'}],
 diagnosis:[row('Microphone absent from Windows Input','Inspect connection, input support and another port.',1),row('Windows lists it but its test receives no voice','Check physical mute, input level and a local recording.',2),row('Windows test succeeds; desktop Discord fails','Check desktop-app permission and the named input.',3),row('Desktop works; only the browser fails','Inspect discord.com permission and the browser’s chosen mic.',4),row('Windows works; both Discord clients fail','Recheck shared Windows permission/device selection, one client at a time.',3),row('Discord test works; callers still hear nothing','Stop the test and inspect mute/input mode/channel restrictions.',5)],
 steps:[
 step(1,'If Windows does not list it, inspect the input connection','Headphone playback does not prove that the microphone input is available.',[
 'Open Settings → System → Sound and inspect Input, not the speaker/output list. Record the displayed device name.',
 'Reconnect a USB device and, if possible, compare a direct PC port without the hub. For Bluetooth, verify that an input device appears, not merely that the headset is connected. Continue to Step 2 once listed.',
 'For 3.5 mm hardware, check the product’s microphone/jack compatibility. An analog mic may appear under the PC audio-device name rather than its product brand; the name alone does not prove it is missing.',
 'If another microphone is available, compare it on the same PC. One missing device points toward its connection/device path; several missing devices warrant Windows-side checks. Neither result alone proves hardware failure.',
 'If still absent, consult the PC/device manufacturer’s supported configuration and driver guidance. Reinstalling Discord is not a reliable remedy for a device missing from Windows Input.',
 ]),
 step(2,'If listed but silent, test speech in Windows','Check physical mute, level and the selected mic first. Close other meeting/recording apps and run one test at a time.',[
 'Inspect the physical mute switch and detachable microphone connection. On Windows 11, open the target device’s properties from Sound → Input.',
 'Use Start test or the corresponding control, speak normally, stop and inspect the result. Listen where playback is offered. On Windows 10, select the input in Sound settings and observe the microphone test meter.',
 'If input level is zero or very low, record it and raise it gradually while repeating the same phrase. Avoid clipping. Once voice is received, continue to Step 3.',
 'If unclear, make a short private recording using Sound Recorder, or Voice Recorder on Windows 10, with the same microphone selected. The recorder also needs microphone permission.',
 'If the meter responds but playback is inaudible, test output with another known sound. Inaudible playback alone does not establish a missing microphone. If Windows receives no input, prioritize its connection/input settings.',
 ]),
 step(3,'If Windows works, align permissions and the app’s input','Windows device availability and Discord access are different checks.',[
 'On Windows 11, open Settings → Privacy & security → Microphone; on Windows 10, Settings → Privacy → Microphone. Inspect microphone access and desktop-app access.',
 'A normal desktop app may not have an individual switch in the Microsoft Store app list. Discord’s absence there does not prove it is uninstalled; inspect desktop-app access instead.',
 'Open Discord User Settings → Voice & Video and choose the microphone that worked in Windows by name under Input Device. Default can follow a different device.',
 'Inspect Input Volume and the output used for playback, then run the mic test with the same phrase. If audible, continue to Step 5. If the device is absent, keep it connected, fully quit Discord from the tray and reopen the list.',
 'If still unsuccessful, close the app and compare the browser in Step 4. Browser-only success suggests app-specific checks; failure in both calls for rechecking shared permissions/device choice.',
 ]),
 step(4,'If only the browser fails, inspect its site permission','Windows permission for the browser and the browser’s permission for discord.com are separate. These controls describe Chrome.',[
 'Open https://discord.com/app on the same PC. Inspect microphone permission through the address-bar site controls. If prompted, verify discord.com before allowing the intended microphone use.',
 'If no prompt appears, open Chrome Settings → Privacy and security → Site settings → Microphone and review a blocked discord.com entry. You do not need to grant unconditional access to every website.',
 'Where available, select the same microphone in Chrome’s microphone settings, reload Discord and check its Voice & Video input before testing.',
 'If permission makes the device usable and the test receives voice, continue to the call check. If settings are managed and unavailable, ask the administrator about site/microphone restrictions.',
 'For browser-only success, record desktop input settings and fully restart the app. Only if it still fails, consider its Voice & Video debugging-area reset, then reselect the device/input mode and test. Restore recorded settings if unhelpful.',
 ]),
 step(5,'After test success, check an actual call','A successful mic test establishes usable input at that moment, not delivery to another participant.',[
 'Stop the mic test before joining the call. Check Discord mute and input mode; for Push to Talk, hold the assigned key while speaking.',
 'Ask a willing participant to hear the same phrase. If another call/channel works, ask the original channel’s administrator about Speak permission or Server Mute.',
 'If tests work but all calls fail, use the microphone guide. If the voice arrives but is quiet, use the low-microphone-volume guide instead of repeatedly reconnecting hardware.',
 'Restart Discord and confirm the same device remains selected and callers still hear you. If the issue returns only after reconnecting, record that timing and device name.',
 ]),
 ],
 avoid:['Do not reset Discord before identifying whether Windows lists and receives the microphone.','Do not override managed permissions or enable microphone access for every site as a shortcut.'],
 cautions:['Record device/connection type, Windows list and test, app list and test, browser list and test separately. Mark unavailable tests unconfirmed.','Redact usernames/server names from support screenshots; keep a test recording local.'],
 faqs:[{question:'If the microphone is listed, is it working?',answer:'It can be selected, but speech still needs testing. Compare Windows input, Discord’s test and finally an actual call.'},{question:'Discord is absent from Windows microphone permission switches.',answer:'Desktop apps may not have individual switches in the Store-app list. Check the desktop-app microphone access control.'},{question:'Bluetooth playback works, but there is no input.',answer:'Playback and microphone availability are separate. Inspect Windows Input and the product’s microphone support/connection. A quality change only when calling also warrants Bluetooth audio checks.'},{question:'Why choose a model instead of Default?',answer:'Default follows the system’s current choice. Naming the tested device reduces the chance of comparing a different microphone unintentionally.'},{question:'Should I reset voice settings immediately?',answer:'First compare Windows recognition/testing and the browser. Record the original device and input mode before any later reset for an app-only failure.'}],
 sources:[voice,micTest,windows('privacy/turn-on-app-permissions-for-your-microphone-in-windows','Microsoft: microphone access permissions'),windows('hardware/drivers/fix-microphone-problems','Microsoft: fix microphone problems'),{label:'Google: Chrome microphone permissions and device selection',url:'https://support.google.com/chrome/answer/2693767?hl=en'}],
 related:[link('mic-not-working','Microphone tests succeed but calls fail'),jp('mic-volume-low','Quiet microphone voice'),link('bluetooth-audio-problem','Bluetooth microphone and sound')],
},
{
 ...base,slug:'error-1001',title:'Discord Error 1001: Sound Sharing Permission Appears—or Does Not',shortTitle:'Error 1001: stream sound sharing',
 description:'Separate a sound-sharing prompt from a missing prompt, compare the actual sound-producing application, and check remaining silence after error 1001 disappears.',
 lead:'For Windows desktop Go Live/screen sharing when video works but error 1001 appears and viewers cannot hear application/game audio.',
 summary:'Discord identifies 1001 as a sound-sharing problem. If its sound-share permission request appears, verify it and select Grant Access. If no prompt appears, do not assume permission was denied: reselect the actual sound-producing application and compare with the same viewer. If the code clears but silence remains, use the stream-audio guide.',
 quickFacts:[{label:'Prompt appears',value:'Verify Discord’s sound-sharing request, then Grant Access'},{label:'No prompt',value:'Compare the actual sound-producing app; do not hunt for an undocumented force-prompt switch'},{label:'Check two results',value:'Whether 1001 remains and whether the viewer hears application sound'}],
 diagnosis:[row('Grant Access appears when starting the stream','Verify the sound-share request and ask the viewer to compare audio.',1),row('1001 appears without a permission prompt','Reselect the app producing the sound and compare once.',2),row('1001 remains after approval','Compare another app playing shareable audio.',3),row('No prompt; another app shares audio successfully','Check the original game versus its launcher and selected source.',3),row('1001 disappears but game audio stays silent','Check broadcaster audio, then everyone versus one viewer.',4),row('Video will not start or only microphone speech is missing','Use the screen-share-start or microphone guide for that separate symptom.',4)],
 steps:[
 step(1,'When prompted, verify and grant sound-sharing access','This is Discord’s specific permission guidance for error 1001.',[
 'Inspect the request shown while starting your Discord stream. If it is the intended sound-sharing request, select Grant Access. Distinguish this from microphone permission or volume controls.',
 'Play a harmless audible scene in the game/application. Ask the same willing viewer to open the stream and confirm the sound; separately check whether 1001 disappears.',
 'If 1001 remains after approval, continue to Step 3. If the code clears but audio is still absent, continue to Step 4.',
 ],'A visible stream does not establish successful sound sharing. Discord explains that video may continue without the application audio when sound-share access is not granted.'),
 step(2,'Without a prompt, reselect the application and compare','A missing prompt alone does not explain why it is absent. Start with the actual source instead of undocumented Windows switches.',[
 'Stop the stream and confirm the broadcaster hears sound from the game itself. Distinguish the actual game window from its launcher.',
 'Open the voice channel’s screen-sharing control, select the application window producing sound and start Go Live. If a permission request appears, follow Step 1.',
 'Ask the same viewer to listen to the same scene. If 1001 remains, fully quit Discord from the tray, reopen and compare the same application once.',
 'If the prompt still does not appear and 1001 persists, continue to the alternate-app comparison in Step 3 instead of repeatedly reconnecting.',
 ],'Do not treat an absent prompt as proof of a denial. If an audio-sharing switch is not offered, record the selected source and result rather than searching indefinitely for a control that is not shown.'),
 step(3,'Compare another application if 1001 remains','This narrows whether the error affects one source or every tested source.',[
 'Use another application to play a short harmless sound you have permission to share. Share that application and ask the same viewer whether it is audible and whether 1001 appears.',
 'If only the alternative works, inspect the original game’s audio/output and the selected window. If the code is gone but silence remains, use Step 4.',
 'If every tested app shows 1001, record the prompt’s presence/absence, full message, OS/Discord versions and app comparisons for Discord’s error-code guidance and official support.',
 ],'While 1001 is present, treat it as application-audio capture trouble. Changing only microphone or viewer volume does not establish the cause of that code.'),
 step(4,'If the code clears but audio remains silent, use the stream-audio checks','Remaining silence needs broadcaster-versus-viewer comparisons; missing video or mic speech is a different symptom.',[
 'Confirm 1001 has cleared, then check whether the broadcaster hears the game locally. If not, inspect the game’s Windows mixer volume and output.',
 'If the broadcaster hears it but all viewers do not, compare application and whole-screen sharing with the same viewer, keeping private windows/notifications hidden. If only one viewer is silent, inspect that viewer’s stream mute and stream volume.',
 'Use the linked stream-no-audio guide for detailed controls. If video itself will not start, use screen-share troubleshooting; if only microphone speech is missing, use the microphone guide.',
 ]),
 ],
 nextChecks:{heading:'1001 cleared, but game sound is still missing?',links:[{href:'/en/discord/stream-no-audio',label:'Compare broadcaster audio, all viewers and one silent viewer'}]},
 avoid:['Do not approve an unrelated system request or treat microphone access as sound-share permission.','Do not share private conversations or an unprepared whole desktop during comparisons.'],
 cautions:['Record the exact error, prompt behavior, selected application, alternative-app result and OS/Discord versions for support.','Keep code disappearance and actual viewer audio as separate results. An untested viewer comparison is not a successful repair.'],
 faqs:[{question:'Where can I force Grant Access to appear?',answer:'Discord documents approval when the request appears, but does not provide a universal manual force-prompt setting. Reselect the sound-producing app, fully restart once, then compare another app and report the results if 1001 persists.'},{question:'Video works while 1001 appears. Did the whole stream fail?',answer:'Not necessarily. Discord says the stream can continue without application sound when sound-sharing access is missing. Check video and audio separately.'},{question:'Why is game audio still silent after 1001 disappears?',answer:'Inspect local game output, sharing source and each viewer’s stream mute/volume. The linked stream-audio guide separates broadcaster silence, all viewers and one viewer.'}],
 sources:[codes,source('360040816151-Go-Live-and-Screen-Share','Discord: Go Live, sharing sources and viewer stream volume'),voice,status],
 related:[link('stream-no-audio','Stream audio after 1001 clears'),link('screen-share-not-working','Screen sharing will not start'),link('mic-not-working','Microphone speech is missing')],
},
{
 ...base,slug:'error-1002',title:'Discord Error 1002: Rejoin, Restart and Compare Noise Suppression',shortTitle:'Error 1002: noise canceller',
 description:'Distinguish error 1002 from ordinary background noise or Krisp’s high-CPU notification. Rejoin first, then compare original/off/original suppression settings with a listener.',
 lead:'For Windows desktop voice calls showing error 1002. Background noise or clipped words alone do not establish that this error occurred.',
 summary:'Confirm 1002, leave/rejoin the call, then fully restart Discord if needed. If it persists, record the original suppression setting and compare original → off → original while keeping the mic and phrase unchanged. Judge the code, intelligible speech and background noise separately.',
 quickFacts:[{label:'Official first checks',value:'Leave/rejoin, then fully restart Discord'},{label:'Controlled comparison',value:'Original suppression → off → original; keep other settings fixed'},{label:'Different notification',value:'Krisp automatically turning off under CPU load is not itself proof of 1002'}],
 diagnosis:[row('1002 has just appeared','Rejoin and fully restart before changing settings.',1),row('Off clears the code and speech arrives','Compare once after restoring the original setting.',2),row('Original setting reproduces 1002; off allows calls','Use the working state temporarily and inspect conditions/update.',3),row('Code clears but noise or clipped speech remains','Assess audio quality separately in a quieter setting.',3),row('Both enabled and disabled states show 1002','Compare client/version conditions, not only suppression.',3),row('RTC Connecting/No Route or a silent joined call','Separate connection, microphone and output failures.',4)],
 steps:[
 step(1,'Confirm 1002, rejoin and fully restart in that order','These are Discord’s explicit first checks for its noise-canceller error.',[
 'Record the number, time and whether it began on call entry or during gaming. Leave and rejoin the same call.',
 'Check whether 1002 returns and separately whether the other person hears you. If the call works without recurrence, stop changing settings.',
 'If it continues, quit Discord from the Windows tray. Closing/minimizing a window may leave the app running.',
 'If needed, use Ctrl+Shift+Esc to confirm identified Discord processes have ended, then reopen and compare the same call. Continue to Step 2 only if the issue remains.',
 ]),
 step(2,'Compare original, off and original suppression settings','Keep input device, volume, sensitivity and echo cancellation fixed so the comparison concerns suppression.',[
 'Open User Settings → Voice & Video → Noise Suppression. Record the exact current choice, including Krisp or another available mode.',
 'With the original setting, say a short repeatable phrase such as “Audio check: can you hear the end of this sentence?” Ask the listener about clipped beginnings/endings and keyboard/background noise.',
 'Disable suppression using the available off/None choice. Rejoin the same call and repeat the phrase at the same distance.',
 'Record three outcomes separately: 1002 present/absent, speech quality and background noise. Any example format is a recording aid, not a measured result to copy as your own.',
 'If off works, restore the original mode once, rejoin and compare. Keep it if normal; if 1002 returns, use the working off state and continue to Step 3.',
 ],'If suppression was already off, record that 1002 occurred in that state. A mic test can inspect input when no partner is available, but cannot replace checking delivery and recurrence in a real call. Stop the test before returning to the call.'),
 step(3,'If restoring the setting reproduces the issue, narrow the conditions','That result suggests examining suppression conditions; it does not prove a broken mic or inadequate CPU.',[
 'If calls work with suppression off, use that temporarily. Move somewhere quieter or mute when not speaking if background noise increases; do not repeatedly force the failing mode.',
 'Update and fully restart Discord, then repeat the controlled comparison once. If it recurs, record the version and original suppression mode.',
 'If it happens only while gaming/streaming, compare a call without those tasks. Inspect CPU load in Task Manager → Processes and compare after closing your own unnecessary apps.',
 'Distinguish a notification that Krisp disabled itself under CPU load from a displayed 1002 code. Discord documents automatic disabling, but the notification alone does not diagnose this error.',
 'If both suppression states fail, leave the desktop call and compare the browser on the same PC with the same mic/person. Record its site permission and actual suppression setting before reporting app-only versus both-client failure.',
 ],'Browser and desktop features/settings can differ. One succeeding does not prove that identical suppression processing was compared.'),
 step(4,'If calling still fails, follow the stage that remains broken','Do not keep toggling suppression when the remaining problem is connection or input/output.',[
 'For RTC Connecting or No Route, the connection has not reached a useful voice comparison. Follow the relevant connection guide.',
 'For a single server/channel, ask its administrator to inspect Connect/Speak permissions and Server Mute.',
 'If you hear the other person but they do not hear you, inspect physical/Discord mute, input selection and mic testing using the microphone guide.',
 'If your speech arrives but you cannot hear them, check deafen, output and individual volume using the incoming-voice guide.',
 ]),
 ],
 avoid:['Do not label every noisy or clipped voice as error 1002.','Do not change suppression, sensitivity, device and volume simultaneously or bypass channel restrictions.'],
 cautions:['For support, include the code screen, OS/app versions, devices, original mode, original/off/original results, game-load comparison and browser result.','Report any residual clipped speech separately even if the code clears. Do not describe unavailable call comparisons as successful.'],
 faqs:[{question:'Must I turn suppression back on?',answer:'No. If speech is clear in a quiet setting without it, that can be usable. If restoring it reproduces 1002, keep the working state temporarily and recheck after an update; ask the listener about background noise.'},{question:'Will my Krisp setting remove another person’s background noise?',answer:'Your setting filters your outgoing audio. The other person must inspect their own microphone path, so use a listener to judge your comparison.'},{question:'Is Krisp automatically switching off always 1002?',answer:'No. Discord documents automatic disabling under high CPU load to preserve voice performance. Record whether the actual error number appeared or only the notification.'},{question:'Is the issue fixed when 1002 disappears?',answer:'Also confirm that intelligible speech reaches the listener without disruptive noise. Follow connection or input/output checks if those failures remain.'}],
 sources:[codes,voice,source('360040843952-Krisp-FAQ','Discord: Krisp controls, voice quality and high-load behavior'),support],
 related:[link('rtc-connecting','RTC Connecting'),jp('no-route','No Route'),link('mic-not-working','Microphone delivery'),link('cant-hear-voice','Cannot hear callers'),link('voice-cutting-out','Voice cutting out')],
},
{
 ...base,slug:'error-1003',title:'Discord Error 1003 or Robot Voice: Compare Input and Output Separately',shortTitle:'Error 1003: distorted voice',
 description:'Confirm error 1003, compare one input/output change at a time, return to the baseline, and use local recording/browser checks when no spare audio device is available.',
 lead:'For Windows desktop voice calls showing 1003 with distorted or slowed speech. A report of robotic voice alone does not confirm this code.',
 summary:'Discord describes 1003 as a substantial microphone input-rate mismatch. Rejoin first. If it persists, record input A/output B, compare input C with B, restore A+B, then compare A with output D. If no alternative devices exist, record that limit and compare a local recording and browser call without assuming these prove hardware compatibility.',
 quickFacts:[{label:'Verify the actual error',value:'Record which participant’s device shows 1003'},{label:'One variable at a time',value:'A+B → C+B → A+B → A+D'},{label:'No spare hardware',value:'Check built-in devices, then record what remains untested'}],
 diagnosis:[row('1003 not confirmed; someone reports distorted speech','Check the screen and who hears the distortion.',1),row('Baseline input A/output B shows 1003','Rejoin with that unchanged combination first.',2),row('Input C/output B improves','Investigate the original input or combination; do not declare it broken.',2),row('Input A/output D comparison','Restore A+B before changing output only.',2),row('No alternative mic/output device','Inspect built-in options, then recording/browser comparisons.',3),row('1003 persists or clears while distortion remains','Record code and audio separately and choose the next check.',4)],
 steps:[
 step(1,'Confirm 1003 and who hears the distorted audio','The official input-rate description does not mean every robotic voice has this cause.',[
 'Record the code, full message and time. Distinguish a code on your screen from one reported by another participant.',
 'Determine whether they hear your voice distorted or you hear theirs distorted. If possible, ask another willing listener for comparison.',
 'For 1003 on your device, continue to Step 2. For an error concerning the other person’s input, let them use these checks on their own setup.',
 'Without a confirmed 1003, follow the voice-cutting-out guide for clipped/intermittent speech, or Bluetooth audio checks for muffling that starts when a call begins.',
 ]),
 step(2,'Change input and output separately, returning to the baseline','This orders Discord’s device/rejoin suggestions so you can identify what changed.',[
 'In User Settings → Voice & Video, record the exact input A and output B. Select their names during the comparison rather than relying on Default.',
 'First leave/rejoin using A+B and repeat the same phrase. If that clears both the code and distortion, keep the devices and check for recurrence.',
 'If it persists and an alternative exists, change input only to C while keeping output B. For example, use a built-in mic with the original headphones. Rejoin and record code plus speech quality.',
 'Restore input A and confirm output B, then change only output to D and repeat. Moving directly to C+D would obscure which change helped.',
 'If only C+B helps, prioritize the original input/combination. If only A+D helps, inspect the output-including combination. Even if both help, do not conclude that the original headset is faulty from this alone.',
 'Rejoin once more with the working combination and ask the same listener to confirm. If 1003 clears but distortion remains, continue to Step 4 instead of calling it resolved.',
 ],'Lower volume before changing output. Speakers can feed back into the mic; stop if echo occurs. The A/B/C/D examples describe a comparison, not measured results.'),
 step(3,'Without spares, compare available built-in devices, recording and browser','These observations can help support; they do not replace a test with an alternative device.',[
 'Inspect Settings → System → Sound for a usable built-in mic, monitor output or built-in speakers. Use an available option as C or D in Step 2, keeping volume modest.',
 'If no alternatives exist, mark that comparison unperformed. Fully quit/reopen Discord, select the original devices by name and recheck the call.',
 'Make a brief private recording with the same mic in Windows Sound Recorder, or Voice Recorder on Windows 10. Distortion there broadens the check to input/connection/Windows; a clean recording prioritizes Discord or call conditions without proving the hardware fault-free.',
 'Close the recorder and desktop Discord, then compare the same call at https://discord.com/app. Align site microphone permission and the named input/output devices.',
 'If only the browser works, prioritize app settings/conditions. If both distort, record the shared device/connection/call conditions without declaring hardware failure.',
 ]),
 step(4,'Choose settings checks or support from the results','The phrase input rate is not a reason to impose one Windows sample-rate value on every device.',[
 'If an alternative combination works, use it temporarily and inspect the original device’s connection, manufacturer-supported drivers and known issues.',
 'For browser-only success, check Discord updates and a full restart. Before trying a Voice & Video debugging-area reset, record device choices/input mode, then compare under the same conditions and restore unhelpful changes.',
 'If the code clears but distorted or interrupted speech remains, record that separately. Check one listener versus all listeners and continue with the voice-cutting-out guide.',
 'For persistent failure, give official support the device showing 1003, OS/app versions, input/output names, A+B/C+B/A+D results and recording/browser results. Mark unavailable comparisons unconfirmed.',
 ]),
 ],
 avoid:['Do not impose 48 kHz or another sample rate solely because the code mentions input rate.','Do not buy replacement hardware or conclude it is broken from one comparison.'],
 cautions:['Keep the baseline and each changed combination identifiable. Record code presence and audible distortion separately, with the rejoin time.','Use only a harmless private test recording; redact usernames/server names from support screenshots.'],
 faqs:[{question:'Does robot voice always mean 1003?',answer:'No. Confirm the code before applying its interpretation. Intermittent speech, Bluetooth quality changes and one-listener issues can require different checks.'},{question:'Can I replace both mic and headphones at once?',answer:'It might avoid the symptom but obscures which change helped. To isolate it, change input only, restore the baseline, then change output only.'},{question:'Do I need to buy a spare microphone?',answer:'No. Use built-in alternatives if available. Otherwise record rejoin/restart, local recording and browser results, and mark the device comparison untested.'},{question:'Should every Windows device be set to 48 kHz?',answer:'This guide does not prescribe that. Discord’s 1003 advice concerns separate/alternative input and output devices and rejoining. Change device-specific format settings only with appropriate manufacturer guidance.'}],
 sources:[codes,voice,micTest,support],
 related:[link('voice-cutting-out','Voice cutting out'),link('bluetooth-audio-problem','Bluetooth audio'),link('audio-input-not-found','Input device recognition')],
},
];
