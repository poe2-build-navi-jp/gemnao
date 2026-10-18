import type { LocalizedArticle } from './types';
const source=(id:string,label:string)=>({label,url:`https://support.discord.com/hc/en-us/articles/${id}`});
const voice=source('360045138471-Discord-Voice-and-Video-Troubleshooting-Guide','Discord: voice and video troubleshooting');
const general=source('31623498041623-Discord-Troubleshooting-Guide','Discord: general troubleshooting');
const status={label:'Discord Status: service incidents',url:'https://discordstatus.com/'};
const step=(n:number,title:string,summary:string,actions:string[],note?:string)=>({id:`cause-${n}`,title,summary,time:'Compare one change at a time',actions,...(note?{note}:{})});
const row=(symptom:string,cause:string,n:number)=>({symptom,cause,stepId:`cause-${n}`});
const link=(slug:string,label:string)=>({href:`/en/discord/${slug}`,label});
const base={locale:'en' as const,gameSlug:'discord',gameName:'Discord',checkedAt:'2026-10-18',sourcePolicy:'English adaptation preserving the Japanese article’s steps, diagnostic branches, precautions and official references. Numerical comparisons are illustrative, not measured results or universal thresholds. Record original settings and restore unhelpful changes.'};
export const discordPerformanceVersionEn: LocalizedArticle[] = [
{
 ...base,slug:'slow-performance',title:'Discord Feels Slow: Typing, Network and Gaming Checks',shortTitle:'Discord feels slow',
 description:'Separate slow typing and scrolling from delayed messages or game-only lag. Compare CPU, memory, GPU and disk activity with the same task before and after one change.',
 lead:'For Windows 11/10 desktop Discord when typing, switching channels, receiving messages or using games/streams feels slow. Browser comparisons are included.',
 summary:'First identify whether the delay affects screen controls, message delivery or only gaming/streaming. For slow controls inspect PC load and rendering; for smooth controls but delayed delivery inspect incidents and connectivity. Keep the same task and change one setting at a time, judging responsiveness as well as resource figures.',
 quickFacts:[{label:'Name the delayed action',value:'Typing, scrolling, loading messages or gaming alongside Discord'},{label:'Observe when it happens',value:'Task Manager figures are most useful alongside the actual slowdown'},{label:'Keep the comparison fair',value:'Same channel, action and other apps before/after the change'}],
 diagnosis:[row('Typing, scrolling or channel switching stutters','Compare other apps and CPU/memory activity.',1),row('Games and the whole PC are slow too','Inspect busy resources and close one unneeded app.',2),row('Controls are smooth; sending/loading images is slow','Compare incidents, websites and background transfers.',3),row('GIF/emoji-heavy screens are especially slow','Compare animation and rendering settings separately.',4),row('Only gaming, recording or streaming alongside Discord is slow','Reduce one concurrent task and compare the same scene.',5),row('Only streamed video stutters or voices break up','Use the stream/voice guide if normal Discord controls remain responsive.',5),row('Browser Discord is smooth; only the app is slow','Compare a full restart/update and time since launch.',6)],
 steps:[
 step(1,'Choose a repeatable task and record the baseline','Use an observable action rather than changing several settings and relying on a general impression.',[
 'In the same text channel, type a short draft without sending it. Note whether characters appear late, then scroll the same section and record any stutter.',
 'Press Ctrl+Shift+Esc → Processes and inspect CPU, memory and disk. If GPU is absent, inspect the column-header menu for a GPU column.',
 'Sort by the busy resource and record overall activity plus the top apps. Performance shows changes over time.',
 'Repeat the slow action for about 30 seconds. Compare sustained activity during the problem with ordinary operation rather than treating a brief peak as a diagnosis.',
 'After each change, repeat the same channel/action and other-app conditions. Example: typing lags around 90% total CPU; after stopping recording it responds at around 60%. These are illustrative figures, not normal/abnormal cutoffs.',
 ],'Multiple Discord processes are normal. Low total CPU also does not rule out a bottleneck in an individual operation or core.'),
 step(2,'Use resource activity to choose the next comparison','High activity alone does not prove hardware failure or a need to buy replacements.',[
 'For sustained CPU activity with delayed typing, inspect top tasks such as recording, encoding or unneeded browser windows. Save work and close one through its normal controls.',
 'For little memory headroom and slow app switching, close unneeded tabs/apps. Check whether responsiveness improves as well as memory use.',
 'For high game GPU activity and slow Discord controls, use Step 5 to compare reduced game/recording/streaming load. High GPU use does not identify Discord as the cause.',
 'For busy disk activity and slow loading, inspect updates, downloads and synchronization. Let an active Windows update finish rather than forcibly ending it.',
 'If resource use drops but Discord alone stays slow, use Step 4. If it improves, reduce that combination of tasks. Do not end unidentified Windows processes or security components.',
 ],'100% disk activity is not the same as a full drive. Memory and GPU figures also cannot define a universal point at which every PC must lag.'),
 step(3,'For delivery delay, compare incidents and connectivity','Prioritize this branch when draft typing is smooth but sending or image loading waits.',[
 'Inspect Discord Status against the time of failure. For a relevant incident, wait for recovery before changing settings.',
 'Open another site on the same PC. If large downloads or cloud sync are active, pause one transfer you control and compare.',
 'On Wi-Fi, compare closer to the router or use wired networking if available. A permitted alternate network can provide another short comparison; account for data limits.',
 'Open https://discord.com/app on the same PC and compare loading the same channel. Both being slow does not prove the network is the cause; inspect PC load too.',
 'Improvement only after changing the connection prioritizes that connection. If Discord alone remains slow across networks, record time and app/browser results for support.',
 ],'Task Manager’s Network column shows traffic, not a direct measurement of voice latency or packet loss. Fast download speed does not prove a stable call.'),
 step(4,'For slow controls, compare animation and rendering','Keep the same content visible. Disabling GPU acceleration is a comparison, not a universal best setting.',[
 'Open User Settings → Accessibility and disable Automatically play GIFs when Discord is focused. Scroll the same screen again.',
 'Separately compare Play animated emoji disabled. Restore unhelpful changes according to your preference; labels can vary.',
 'If unchanged, record Hardware Acceleration under Advanced, switch its state and restart Discord.',
 'Repeat Step 1’s typing/scrolling and compare CPU/GPU activity plus responsiveness. Lower GPU use with slower typing is not an improvement.',
 'Restore unchanged/worse settings. If visual corruption or problems began after a driver update too, inspect the manufacturer’s driver guidance and make changes separately.',
 ]),
 step(5,'For game-only slowdown, reduce one concurrent task','Distinguish slow local controls from only the viewer’s received video stuttering.',[
 'In the same game scene, check whether Discord typing also lags. Compare recording stopped, then streaming stopped, as separate tests.',
 'If game GPU activity is sustained, record and reduce its FPS cap in its graphics settings. A 144-to-60 comparison is only an example, not a universal recommendation; judge both game smoothness and Discord controls.',
 'For a live stream, use its quality menu to compare a lower available resolution/frame rate, for example 720p/30fps. Ask the viewer about their received picture separately from the broadcaster’s game.',
 'If local controls are fine but the viewer’s picture stutters, use the stream-stuttering guide. For broken speech alone, use the voice-cutting-out guide.',
 'If controls slow only with the overlay enabled, disable Overlay and compare the same scene. Restore it if there is no improvement.',
 ]),
 step(6,'For app-only slowdown, restart and compare the browser','Avoid joining the same call or running duplicate streams in both clients.',[
 'Quit Discord from the notification area. If Discord processes remain, end only the identified Discord processes, then reopen and finish available updates.',
 'Repeat the baseline just after launch and again after the duration that usually causes the issue. Record temporary improvement separately from longer use.',
 'Close the app, then use current Edge or Chrome at https://discord.com/app to compare typing/scrolling in the same channel. If both are slow, revisit load and connection checks.',
 'If only the app remains slow, use the not-opening guide’s cache move-aside comparison. Consider reinstalling afterward, with login email/password and MFA access confirmed first.',
 ]),
 ],
 avoid:['Do not force-end unknown system/security processes to reduce a number in Task Manager.','Do not infer defective hardware or a required upgrade from a single utilization reading.'],
 cautions:['For support, record the exact delayed action, time, duration since launch, versions, CPU/memory/GPU/disk activity, concurrent apps, browser/network results and settings restored.','Pair action and outcome: for example, typing lags while recording a game and improves when recording stops. This is an example of a useful report, not an observed result. Hide private conversations in screenshots.'],
 faqs:[{question:'What CPU or memory percentage is abnormal?',answer:'There is no fixed cutoff for this symptom. Compare sustained activity during the actual delay and whether reducing a task improves both figures and responsiveness.'},{question:'Should Hardware Acceleration always be off?',answer:'It is an official troubleshooting option, but the result varies. Record the original state, compare the same screen and restore it if unchanged or worse.'},{question:'Why is Discord slow on a fast connection?',answer:'Local controls can lag because of PC load or rendering. Connection speed also does not measure every delay or instability; separate typing from delivery.'},{question:'Does reducing Discord memory always make it faster?',answer:'No. Confirm the same action responds better, and do not terminate system tasks merely to lower a figure.'}],
 sources:[source('213491697-What-are-the-OS-system-requirements-for-Discord','Discord: requirements and lag comparisons'),general,source('225733808-Why-does-Discord-have-multiple-processes','Discord: multiple processes are normal'),{label:'Microsoft: monitoring and improving Windows performance',url:'https://support.microsoft.com/en-us/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows'},status],
 related:[link('stream-stuttering','Stream stutters'),link('voice-cutting-out','Speech cuts out'),link('not-opening','Discord will not open'),link('crashing','Discord crashes'),link('overlay-not-showing','Overlay is missing')],
},
{
 ...base,slug:'stream-stuttering',title:'Discord Stream Stuttering: Broadcaster and Viewer Checks',shortTitle:'Stream keeps stuttering',
 description:'Compare the game’s own motion with viewers’ received video. Find live quality controls, compare 720p/30fps, and separate one viewer, network, PC load and capture-method problems.',
 lead:'For Windows 11/10 desktop Discord game streams or screen sharing that freeze or look like a slideshow. Check whose picture stops before changing settings.',
 summary:'Have the broadcaster compare the actual game and, if possible, two viewers report the same scene. For several affected viewers, compare lower stream quality. If the game itself also slows, inspect broadcaster PC load; if only one viewer fails, prioritize that person’s reception/playback conditions.',
 quickFacts:[{label:'Compare the actual scene',value:'Broadcaster’s game versus each viewer’s received video'},{label:'Lower quality as a test',value:'Try available 720p/30fps controls, then repeat the same motion'},{label:'One viewer differs',value:'Inspect that viewer before blaming every stream setting'}],
 diagnosis:[row('Game stays smooth; two viewers see a slideshow','Compare lower live quality with both viewers.',1),row('Game stays smooth; only one viewer freezes','Confirm another viewer’s result, then inspect the affected viewer.',2),row('The game itself slows only after streaming starts','Compare with streaming stopped and inspect PC load.',3),row('All viewers lose both video and speech','Inspect incidents and the broadcaster’s connection.',2),row('Only a particular game stutters; desktop capture is smooth','Compare application and whole-display capture.',4)],
 steps:[
 step(1,'Compare lower stream quality','Improvement does not by itself identify the network or PC as the limiting factor.',[
 'In a safe repeatable game scene, move the camera sideways. The broadcaster checks game motion and viewers report interruptions in that same motion.',
 'While live in a server voice channel, hover the small picture-in-picture and open its gear → Stream Quality. If absent, inspect the active Screen sharing button near the voice panel.',
 'For a DM stream, use the stream’s downward-arrow menu → Stream Quality. Compare 720p and 30fps within the options available to you, recording the original values.',
 'Repeat the same motion for about 10–20 seconds. Ask whether pauses decreased and whether both viewers agree.',
 'If both improve, keep the useful setting. If unchanged, inspect connections in Step 2; if the game itself is also slow, inspect load in Step 3.',
 ],'The official guide says browser broadcasters cannot adjust stream quality. These controls concern desktop-app broadcasting.'),
 step(2,'Separate shared failures from one viewer','Several viewers failing together prioritizes shared conditions; one failing viewer needs their own comparison.',[
 'Inspect Discord Status for voice/streaming incidents and wait for relevant recovery before retesting.',
 'If several viewers stop together, the broadcaster pauses Steam downloads, cloud sync or another stream/recording one at a time, then repeats the scene for the same viewers.',
 'If the broadcaster uses Wi-Fi, compare wired networking where available without also changing quality. If both viewers improve, investigate the original connection.',
 'If only one viewer fails, that person closes/rejoins the stream, then restarts Discord and compares the same scene.',
 'If still isolated to that person, they pause their downloads/sync and compare a permitted wired/alternate connection if available. Keep other viewers’ successful results in the record.',
 ],'Record who watched the same scene and on which connection; a speed-test number alone is not a playback diagnosis. Account for data limits and mark unavailable comparisons untested.'),
 step(3,'If the game also slows, inspect broadcaster load','Do not focus exclusively on viewer networks when local game motion deteriorates.',[
 'Compare the same game scene before and during sharing. Ask whether the viewer sees pauses corresponding to the broadcaster’s local pauses.',
 'Open Ctrl+Shift+Esc → Performance and inspect CPU, memory and GPU for sustained changes while streaming. Processes identifies busy apps.',
 'Save work, then stop an unneeded recorder or close unused browser tabs one at a time. Compare both local game and received video again.',
 'If unchanged, record and lower the game’s FPS cap or graphics quality one level. If the game improves but received video still pauses, return to Steps 1–2.',
 ]),
 step(4,'Compare capture method and video processing','For game-specific stutter, retain the same scene and viewer while changing capture.',[
 'Compare the game’s window and whole display; hide private windows/notifications before display sharing. If supported, compare borderless mode too, recording the original mode.',
 'Record Hardware Acceleration under User Settings → Voice & Video → Video, switch its state, restart Discord and compare the same scene.',
 'Restore it if unchanged or worse. Inspect Discord/Windows updates and use the GPU/PC manufacturer’s official driver instructions if a driver update is needed.',
 ],'Labels and placement can vary. Skip absent controls rather than changing a guessed experimental option, and preserve original settings.'),
 ],
 avoid:['Do not judge viewers’ reception from the broadcaster’s preview alone.','Do not change quality, network and graphics settings together or expose private information in display capture.'],
 cautions:['If unresolved, compare the same game window, whole display and another available game with the same viewers. Record whether local game motion also stopped, affected viewers, quality comparison, network/load and time.','One viewer is usable if two are unavailable; record that limitation rather than treating an unperformed comparison as success.'],
 faqs:[{question:'Where are the live 720p/30fps settings?',answer:'For a server stream, hover the broadcaster’s PiP → gear → Stream Quality, or inspect the active Screen button. For a DM stream use the downward-arrow menu → Stream Quality.'},{question:'Does a smooth local preview prove viewers see smooth video?',answer:'No. Compare the game itself with each viewer’s received picture of the same scene.'},{question:'Does one stuttering viewer prove the broadcaster is at fault?',answer:'No. Confirm another viewer can see the same scene, then compare the affected person’s rejoin, app restart and available connection alternatives.'},{question:'Why are quality controls missing?',answer:'The official guide says browser broadcasting cannot adjust quality. Confirm you use the desktop app, then inspect the appropriate live-stream menu.'}],
 sources:[source('360040816151-Go-Live-and-Screen-Share','Discord: Go Live and live quality controls'),source('33030151293079-Discord-Voice-Video-Streaming-Guide','Discord: streaming settings'),voice,status],
 related:[link('screen-share-not-working','Screen sharing will not start'),link('slow-performance','Discord controls feel slow'),link('stream-no-audio','Stream has no audio')],
},
{
 ...base,slug:'voice-client-outdated',title:'Discord Voice Client Out of Date: Update and Browser Checks',shortTitle:'Old client cannot join calls',
 description:'Record the full app version before and after updating. Separate unsupported voice clients, failed updates, wrong shortcuts and connection errors using a real browser-call comparison.',
 lead:'For Windows desktop or PC browser Discord when text chat works but calls fail, an old-version warning appears or the version seems unchanged.',
 summary:'Since March 2, 2026, Discord requires encryption-capable clients for voice/video conversations. Record the full version display, fully quit, update and check it again. If updating fails, compare the same call in a current supported browser and choose the next check from the actual error and call result.',
 quickFacts:[{label:'Record the entire version',value:'Compare the same app and same settings field before/after'},{label:'Minimum is not current',value:'Use available current releases, not old installers at the minimum number'},{label:'Test a real conversation',value:'Loading text chat does not verify voice compatibility'}],
 diagnosis:[row('Old-version warning or Windows client below 1.0.9164','Record the version and fully quit/update.',1),row('The version seems unchanged after restart','Compare the full field, app variant and supported minimum.',2),row('Update Failed, a loop or Installation has failed','Try browser voice and follow the guide for that exact error.',2),row('App fails; updated browser voice works','Prioritize app updates, launch target and installation.',4),row('App voice works; browser fails','Inspect browser update/restart, site permission and exact error.',3),row('Both clients are supported but calls fail','Inspect incidents, RTC/No Route or channel permissions.',4),row('Call connects without audio, or only a bot fails','Separate audio devices from the bot provider’s compatibility.',4)],
 steps:[
 step(1,'Record the version, quit and update','The voice minimum lists Windows 1.0.9164, Firefox 142 and Chrome/Edge 86. These are voice compatibility floors, not current-release recommendations or every product’s full requirements.',[
 'Open User Settings and scroll to the bottom of its panel. Record the entire version display, including multiple numbers rather than selecting an arbitrary part.',
 'Right-click Discord in Windows’ notification area and quit. If necessary, use Ctrl+Shift+Esc to check whether identified Discord processes remain.',
 'Open the intended Discord from Start and allow updates to finish. If Update Failed or another error appears, record it and use Step 2.',
 'Reopen the same settings field and record the new display. Join the same call and record any old-version warning, connection result and whether both people can hear each other.',
 ],'DAVE is Discord’s audio/video encryption system. The recovery path is a supported client, not disabling encryption to retain an obsolete version.'),
 step(2,'For unchanged versions, inspect the app and update result','An unchanged number can already be current. A version below the requirement or a persistent warning is not a successful update.',[
 'Compare the same app and field. If Stable, PTB or Canary coexist, record which one you updated and which one you launched.',
 'Select the intended Discord from Start instead of an old taskbar/desktop shortcut. Check the warning and version again after a PC restart.',
 'For Update Failed or a loop, use that guide’s app/browser/network comparisons. Do not begin by deleting AppData.',
 'If a fresh installer is needed, obtain Windows Discord from its official download page. Before reinstalling, preserve login/MFA access and record voice settings.',
 'For Installation has failed, use its dedicated guide. For unsupported OS or organization restrictions, inspect the stated condition and use a supported device or ask its administrator.',
 ],'A current supported browser can be a temporary comparison, but it also needs a compatible OS. It is not a guaranteed workaround for unsupported hardware/software.'),
 step(3,'Update and restart the browser itself','Reloading Discord’s page does not update the browser.',[
 'In Chrome, open More → Help → About Google Chrome. Record update/version state, relaunch if requested, then verify the same page again.',
 'For Firefox downloaded from Mozilla, use Help → About Firefox and finish the restart. A Microsoft Store installation updates through the Store. Check the resulting version, including the voice minimum of 142, and any error.',
 'In Edge, use Help and feedback → About Microsoft Edge, inspect update state and complete a required restart. If managed settings prevent this, ask the administrator.',
 'Leave the app call before opening https://discord.com/app in the browser. Join the same account/destination and inspect microphone permission for discord.com.',
 'Record cannot join, joins but no voice, or two-way conversation works. For browser-only silence, inspect site microphone permission and Discord input/output devices.',
 ],'Example: an app old-version warning with a working browser call prioritizes app updating; both stuck on RTC Connecting prioritizes connection checks. These are decision examples, not device-test results.'),
 step(4,'Route the result to update, connection, audio or bot checks','A supported version does not make every remaining symptom an encryption problem.',[
 'If browser voice alone works, use it temporarily and inspect the app’s update/launch errors in Step 2. This result does not rule out every possible network influence.',
 'If app voice alone works, revisit browser updating, restart and site permission. For a persistent unsupported-version warning, inspect OS compatibility too.',
 'If both show RTC Connecting or No Route, inspect Discord Status and the matching connection guide. For one channel only, ask its administrator to inspect Connect and Speak permissions.',
 'If connected but silent, inspect mute/deafen and Voice & Video input/output devices. Use the output guide when only incoming voices are missing.',
 'If people can talk and only a music bot fails, inspect the provider’s DAVE support and incidents. Reinstalling a user’s app cannot implement missing support in the bot.',
 ]),
 ],
 avoid:['Do not disable encryption, use unofficial clients or downgrade to a minimum-version installer.','Do not delete app data or bypass managed update restrictions before identifying the stopping point.'],
 cautions:['For support, record Windows version, full Discord version before/after, Stable/PTB variant, browser/version, same-call results and exact warning/time.','The listed voice minima are distinct from broader system/browser requirements. Keep the device and browser current through their official update channels.'],
 faqs:[{question:'Does an unchanged number prove the update failed?',answer:'No. It may already be current or you may be comparing different fields/variants. Compare the entire display with errors and actual call results.'},{question:'Does opening chat prove the client supports calls?',answer:'No. Text and voice/video requirements differ. Confirm joining and two-way audio in the same call.'},{question:'Should I install exactly the minimum version?',answer:'No. Use the current release available for a supported device. A compatibility floor is not a recommendation to install old software.'},{question:'Can I call while the app update is broken?',answer:'Try official browser Discord on a supported, updated browser/OS. If it works, use it temporarily while fixing the app; otherwise follow the actual connection/permission error.'}],
 sources:[source('38025123604631-Minimum-Client-Version-Requirements-for-Voice-Chat','Discord: minimum voice-client versions and DAVE requirement'),general,{label:'Discord: official downloads',url:'https://discord.com/download'},{label:'Google: updating Chrome',url:'https://support.google.com/chrome/answer/95414?hl=en'},{label:'Mozilla: updating Firefox',url:'https://support.mozilla.org/en-US/kb/update-firefox-latest-release'},{label:'Microsoft: Edge update settings',url:'https://support.microsoft.com/en-us/topic/microsoft-edge-update-settings-af8aaca2-1b69-4870-94fe-18822dbb7ef1'},status],
 related:[link('update-failed','Update Failed or update loop'),link('installation-failed','Installation has failed'),link('rtc-connecting','Stuck on RTC Connecting'),link('no-route','No Route'),link('cant-hear-voice','Cannot hear callers'),link('bot-not-responding','Bot does not respond')],
},
];
