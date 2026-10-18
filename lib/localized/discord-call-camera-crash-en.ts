import type { LocalizedArticle } from './types';
const source=(id:string,label:string)=>({label,url:`https://support.discord.com/hc/en-us/articles/${id}`});
const voice=source('360045138471-Discord-Voice-and-Video-Troubleshooting-Guide','Discord: voice and video troubleshooting');
const status={label:'Discord Status: service incidents',url:'https://discordstatus.com/'};
const step=(n:number,title:string,summary:string,actions:string[],note?:string)=>({id:`cause-${n}`,title,summary,time:'Compare one change at a time',actions,...(note?{note}:{})});
const row=(symptom:string,cause:string,n:number)=>({symptom,cause,stepId:`cause-${n}`});
const link=(slug:string,label:string)=>({href:`/en/discord/${slug}`,label});
const jp=(slug:string,label:string)=>({href:`/discord/${slug}`,label:`${label} (Japanese)`});
const base={locale:'en' as const,gameSlug:'discord',gameName:'Discord',checkedAt:'2026-10-18',sourcePolicy:'English adaptation of the existing Japanese guide using the same steps and official sources. Comparison sequences and example outcomes are editorial guidance, not measured results. Record original settings, change one condition at a time and distinguish an incomplete comparison from a successful result.'};
export const discordCallCameraCrashEn: LocalizedArticle[] = [
{
 ...base,slug:'call-disconnects',title:'Discord Calls Keep Disconnecting: Separate Connection Loss, Crashes and Audio Gaps',shortTitle:'Calls keep disconnecting',
 description:'Compare call location, desktop versus browser and network separately. Distinguish leaving a call from an app closing or voices cutting out while you remain connected.',
 lead:'For Windows desktop and browser Discord when a voice call disconnects, reconnects repeatedly or fails only while gaming. First identify whether the app, the connection or only the sound stopped.',
 summary:'Check whether Discord still responds and whether your call membership or connection state changed. For connection loss, inspect service incidents, then compare another channel and a DM with the same person. If every call fails, compare the browser on the same PC, then change only the network.',
 quickFacts:[{label:'What stopped?',value:'App window, call connection or sound only'},{label:'Keep conditions comparable',value:'Same PC and participant; change location, client and network separately'},{label:'Test duration matters',value:'A short connection does not establish recovery from a later failure'}],
 diagnosis:[row('Discord stays open, but the call disconnects or reconnects','Compare another channel and a DM for a similar duration.',2),row('The window closes or Discord restarts','Check the notification area and processes before calling it a crash.',1),row('You remain in the call, but voices break up','Confirm the connection remains active and investigate audio gaps.',1),row('DM works, but one server/channel disconnects','Ask whether other participants disconnect at the same time.',2),row('Only the desktop app fails; the same-PC browser stays connected','Restart/update the app and repeat the actual call.',3),row('Both clients fail, but another network works','Inspect the original network, VPN and restrictions.',4),row('Failure occurs only while gaming or streaming','Compare voice only, then the game, then streaming.',5)],
 steps:[
 step(1,'Separate connection loss, app closure and audio gaps','A vanished window does not by itself establish that Discord stopped running.',[
 'Record the time and any RTC Connecting, No Route or other message. Ask the other participant whether you disappeared from the call or only stopped being audible.',
 'If the window closed, inspect the Discord icon in the notification area and Discord processes in Task Manager (Ctrl+Shift+Esc). Distinguish a background app from an exit or restart.',
 'For an actual app exit/restart, use the crashing guide. If membership and connection remain unchanged and only sound breaks up, use the voice-cutting-out guide.',
 'If Discord stays open and only the call connection drops, continue to Step 2. For reconnection stuck on RTC Connecting or No Route, consult the corresponding related guide too.',
 ]),
 step(2,'Change only the call location: channel, another channel, then DM','Keep the PC, network and willing participant the same. Compare for a meaningful duration.',[
 'Check Discord Status for a relevant voice incident. Wait for recovery when one is reported; no announcement does not rule out a newly developing incident.',
 'If calls usually fail after about three minutes, a roughly five-minute conversation is one comparison example. Record the failure time. For failures after longer use, compare over a similarly relevant period instead.',
 'Try another permitted voice channel, then a DM call with the same person. Keep client and network settings unchanged during these comparisons.',
 'If only one channel fails, ask whether other participants disconnected simultaneously. Have its administrator check channel settings, permission changes and any move/disconnect actions.',
 'If every location including DMs fails, continue to Step 3. One failing channel alone does not establish faulty hardware or a problem across the whole network.',
 ]),
 step(3,'Compare desktop and browser on the same PC and network','Opening chat is insufficient: compare whether an actual voice call stays connected.',[
 'Leave the desktop call, open https://discord.com/app in a browser, sign in to the same account and allow microphone access for the site.',
 'Join the same location with the same person and compare for the duration used in Step 2. Do not join from both clients simultaneously.',
 'If only the browser stays connected, fully quit the desktop app from the notification area, restart it to apply updates and repeat that call.',
 'If only the app still fails, inspect the high-priority QoS packet setting under Voice & Video → Voice. If enabled, record the value, disable it and reconnect for comparison; restore it if unhelpful.',
 'If both fail, continue to Step 4. If only the browser fails, update it and compare another supported browser. Missing microphone permission that prevents the call means this comparison is incomplete.',
 ]),
 step(4,'Compare another network, then inspect the original connection','A speed-test number alone does not show whether voice calls remain connected.',[
 'Pause downloads or cloud synchronization one at a time and compare the same call’s disconnect frequency.',
 'For Wi-Fi, compare Ethernet. If available, separately compare another internet connection, such as your own phone hotspot, on the same PC and client; account for mobile data limits.',
 'Ethernet alone working points toward Wi-Fi conditions; another internet connection alone working prioritizes the original connection/router/restrictions. Record these as separate comparisons.',
 'If using a VPN you control, compare with it disconnected when permitted. Discord documents UDP support as a requirement for voice through a VPN. Ask the administrator about work/school network restrictions.',
 'If failure remains specific to the original network, restart its router using the manufacturer’s procedure and inspect Discord-specific security software permissions. If another network also fails, continue to Step 5.',
 ],'A router restart interrupts other users. Do not press its factory-reset button, bypass managed network rules or leave the entire firewall disabled.'),
 step(5,'For gaming or streaming failures, compare load and the actual symptom','High CPU use alone does not establish the cause, and broken audio can be mistaken for disconnection.',[
 'With the same participant and network, compare voice only with game/streaming stopped, then add the game, then start streaming. Record connection state at each failure.',
 'Open Task Manager with Ctrl+Shift+Esc. Inspect CPU, memory and GPU under Performance when the symptom occurs; use Processes to identify recording or unnecessary apps adding load.',
 'Stop one optional task such as recording and repeat the same conditions. Check whether disconnects also decrease; if not, do not attribute the problem to load alone.',
 'If connected but Push to Talk stops responding, inspect its binding and the game/app permission difference. For an app exit use the crashing guide; for voice gaps use the audio-cutting-out guide.',
 ]),
 ],
 avoid:['Do not treat browser chat loading or a brief successful call as proof that voice connectivity is healthy.','Do not reset the router, disable all protection or change client, network and channel together.'],
 cautions:['For help, record failure time and time to recurrence, whether the app remained open, location/client/network comparisons, VPN use, gaming/streaming and exact messages.','For one channel, contact its administrator; for one network, contact its operator/router support; for failures across tested conditions, contact Discord support. Mark unavailable comparisons as untested.'],
 faqs:[{question:'Why do calls disconnect when my speed test is fast?',answer:'Throughput does not establish freedom from brief outages or connection restrictions. Compare Ethernet and another network separately on the same PC and observe actual call failures.'},{question:'Does working browser chat prove the network is fine?',answer:'No. Compare a voice call with the same participant for a relevant duration. Chat access and sustained voice are different observations.'},{question:'Should I reinstall when only one server fails?',answer:'First compare another channel and a DM. Ask the administrator about settings, permissions and disconnect actions when failure is confined to a location.'},{question:'Is losing only voices while gaming necessarily a network issue?',answer:'No. If call membership remains, inspect input, sensitivity, Push to Talk and PC load using the voice-cutting-out guide rather than treating it as confirmed connection loss.'}],
 sources:[voice,status,source('115001310031-Voice-Connection-Errors','Discord: voice connection errors, VPN and network checks')],
 related:[jp('voice-cutting-out','Voice breaks up'),link('crashing','Discord exits or restarts'),link('rtc-connecting','Stuck on RTC Connecting'),link('no-route','No Route'),link('system-helper','Discord System Helper')],
},
{
 ...base,slug:'camera-not-working',title:'Discord Camera Not Working: Compare Windows, Your Preview and the Other Person’s View',shortTitle:'Camera missing or showing black',
 description:'Check the same camera in Windows and Discord, then verify live video reaches another person. Separate device access, desktop permissions and channel-specific restrictions.',
 lead:'For Windows 11/10 desktop Discord using a built-in or USB camera. Covers missing devices, black previews and video you can see but others cannot; game screen sharing is a separate issue.',
 summary:'Try the Windows Camera app first, close it, then test the same camera in Discord. Failure in both prioritizes the device/Windows; only Discord failing prioritizes selection and desktop-app access. A working preview still requires starting video in the call and checking the recipient’s view.',
 quickFacts:[{label:'Three observations',value:'Windows Camera → Discord preview → another person’s received picture'},{label:'One camera app at a time',value:'Close the previous app before comparing'},{label:'Server-only failure',value:'Compare a DM before asking about Video permission'}],
 diagnosis:[row('Windows Camera is black or cannot find the device','Check shutter, hardware switch, connection and access.',2),row('Windows works, but Discord preview is black','Select the same camera and inspect desktop-app access.',3),row('Preview works, but the other person sees no video','Start the camera in the call and compare another recipient.',4),row('DM video works, but a server channel cannot start it','Ask its administrator to inspect Video permission.',5),row('Physical camera works, but virtual camera is black','Inspect the virtual-camera provider’s running output.',3)],
 steps:[
 step(1,'Compare Windows, Discord and the recipient in order','Find where capture or transmission stops before changing several settings.',[
 'Turn off Discord video and close other camera users such as Zoom or Teams. Search Start for Camera and open the Windows app.',
 'If several cameras are available, select the intended one. Move your hand in view and confirm the image updates; record any displayed error code.',
 'Close Windows Camera. In Discord User Settings → Voice & Video, select the same camera in the video settings and use Test Video to check the same movement.',
 'If Windows also fails, continue to Step 2. If Windows works but Discord fails, use Step 3. If the preview works, continue to Step 4 for an actual call.',
 ],'A working preview does not confirm delivery. Start the camera in the call and ask the recipient whether the picture moves.'),
 step(2,'If Windows also fails, inspect the shutter, connection and access','Establish whether Windows can use that camera before changing only Discord settings.',[
 'Check the lens privacy cover, any physical camera switch and the laptop’s camera-disable key.',
 'For USB cameras, connect directly to another PC USB port without the hub and repeat Windows Camera.',
 'Open Windows 11 Settings → Privacy & security → Camera, or Windows 10 Settings → Privacy → Camera. Permit device camera access and access for the Camera app.',
 'If still unavailable, restart the PC. Right-click Start → Device Manager and inspect the device name/warnings under Cameras or its relevant category; consult supported PC/camera manufacturer drivers.',
 'If another camera is already available, compare it in the same app. Only the replacement working prioritizes the original camera/connection; neither working calls for Windows access checks too.',
 ],'For a managed PC with unavailable access controls, ask its administrator. Do not declare a hardware fault before inspecting access and connection conditions.'),
 step(3,'If only Discord fails, inspect camera selection and desktop access','Windows Camera working does not establish Discord’s selected device or desktop-app access.',[
 'Fully close Windows Camera and other calling apps, then select the physical camera by name in Discord Voice & Video.',
 'In Windows camera privacy settings, inspect Let desktop apps access your camera (Allow desktop apps to access your camera on Windows 10). Discord may have no individual app-list switch; this control affects desktop apps together.',
 'If using a virtual camera, compare the physical one. If only the physical camera works, inspect whether the virtual-camera software is running and producing video.',
 'Quit/restart Discord and repeat Test Video. If unresolved, close the app, open browser Discord, allow the site’s camera access and compare the same camera.',
 'If only the browser works, check desktop updates. If failure continues, record Hardware Acceleration under Voice & Video → Video and compare the alternative setting after restart; restore an unhelpful change.',
 ]),
 step(4,'If the preview works, start call video and compare recipients','The preview is a local check before sending video.',[
 'Close settings and return to the call. Use the call’s camera control to start video; if a preview confirmation appears, inspect it and confirm. Button layouts can vary by interface version.',
 'Move your hand and ask the recipient to distinguish no video tile, a black picture, a frozen picture and moving video.',
 'If possible, ask another willing participant to inspect the same feed. If only one recipient fails, have that person compare rejoining, restarting Discord and the browser.',
 'If nobody receives it, toggle your camera off/on and check again. If a DM works, continue to Step 5. If DMs also fail, inspect Discord Status/connection state and compare another permitted network if available.',
 ]),
 step(5,'For one server/channel, inspect Video permission','Use this comparison when the same camera works in a DM but cannot start in a particular voice channel.',[
 'Compare a DM with the same person against the affected voice channel; also compare another permitted channel.',
 'Ask a server administrator to inspect the affected role’s Video permission under Server Settings → Roles.',
 'Have them inspect role/member permission overrides in the affected voice channel’s settings too.',
 'After a justified permission change, rejoin, start the camera and confirm the other person receives moving video. Pass any error or participant-limit message to the administrator; restore unrelated changes.',
 ]),
 ],
 avoid:['Do not assume a local preview proves transmission or that a missing individual Discord switch proves access is unavailable.','Do not run multiple camera apps during a comparison or change virtual-camera, permissions and driver settings together.'],
 cautions:['Record Windows Camera, Discord preview and recipient results; camera name and built-in/USB/virtual type; DM/channel differences and error text.','If Windows also fails, send these findings to the PC/camera maker. If only Discord fails, contact Discord support. Use willing recipients and keep private surroundings out of the test picture.'],
 faqs:[{question:'Why is Discord black when Windows Camera works?',answer:'Device selection, another app using the camera or desktop-app access may differ. Close Camera, select the same device in Discord and compare again.'},{question:'Discord is absent from the Windows camera permission list.',answer:'Desktop apps may lack individual switches. Inspect the desktop-app camera access setting, remembering that it applies to desktop apps together.'},{question:'Does my working preview mean others can see me?',answer:'No. Return to the call, start video and ask a recipient to confirm a moving picture.'},{question:'Is a black game screen share the same problem?',answer:'This guide concerns camera video. For a shared game or desktop, use the black-screen sharing guide to compare the shared target and the viewer.'}],
 sources:[voice,source('360041721052-Video-Calls','Discord: camera testing, video calls and permissions'),{label:'Microsoft: camera troubleshooting in Windows',url:'https://support.microsoft.com/en-us/windows/hardware/camera/camera-doesn-t-work-in-windows'},{label:'Microsoft: camera permissions for apps and desktop apps',url:'https://support.microsoft.com/en-us/windows/privacy/manage-app-permissions-for-a-camera-in-windows'}],
 related:[link('screen-share-black-screen','Shared screen is black'),link('screen-share-not-working','Screen sharing will not start'),link('stream-stuttering','Stream stutters')],
},
{
 ...base,slug:'crashing',title:'Discord Keeps Crashing or Closing: Startup, Calls, Sharing and Gaming Checks',shortTitle:'Discord crashes or restarts',
 description:'Separate a hidden window from an app exit. Compare the triggering action, devices and graphics settings, inspect Windows reliability history and reserve reinstalling for app-only failures.',
 lead:'For Windows 11/10 desktop Discord that closes on startup, at call or screen-share start, or during gaming. If the whole PC freezes or restarts, investigate the PC as well.',
 summary:'Check whether the call continues and the notification-area icon restores the window. For actual exits, use the trigger: startup calls for browser/local-data comparison, calls for device checks, sharing for graphics comparisons, and gaming for optional features/load. Match the event time to Windows reliability history even without an error dialog.',
 quickFacts:[{label:'First distinction',value:'Hidden window, disconnected call or actual app exit'},{label:'Keep the same trigger',value:'Same person, shared target or game scene after each change'},{label:'No visible error',value:'Record the time and compare reliability history; no entry does not prove health'}],
 diagnosis:[row('Call continues and the notification-area icon restores the window','Inspect close/minimize behavior before treating it as an exit.',1),row('App exits before settings can open','Fully quit and compare your actual conversation list in the browser.',2),row('It crashes when joining voice','Keep camera/sharing off and compare audio devices separately.',3),row('Camera or screen-share start triggers the exit','Compare voice only, then video target and graphics settings.',4),row('It fails during gaming or after extended use','Compare optional recording, streaming and overlay over a similar duration.',5),row('It vanishes or reopens without an error','Match its time against Discord events in reliability history.',6),row('The app responds, but only the call disconnects','Use the connection guide rather than assuming a crash.',1)],
 steps:[
 step(1,'Distinguish minimizing, call disconnection and app exit','A window disappearing is not enough to identify a crash.',[
 'Check whether voices continue and whether others saw you leave. Open hidden notification-area icons and try restoring the window through Discord’s icon.',
 'If conversation continues and the window returns, inspect close/minimize behavior first; reinstalling is not the first step.',
 'Open Task Manager with Ctrl+Shift+Esc and inspect Discord processes. A remaining process with an unresponsive window can still mean part of the app stalled.',
 'If the app responds but the call disconnected, use the call-disconnects guide. If the window closes and a startup logo appears again, record the restart time and consult Step 6.',
 ],'Discord normally uses multiple processes. Several entries are not inherently abnormal, and one remaining process does not prove the app is healthy.'),
 step(2,'For startup exits, fully quit and compare the browser','When settings cannot stay open, inspect launch behavior before looking for in-app switches.',[
 'Quit Discord from the notification area, end remaining Discord processes in Task Manager and restart Windows. Open Discord once from Start.',
 'Allow an update to finish. If a specific message such as Update Failed appears, record it and use the update-failed guide.',
 'On the same PC, open https://discord.com/app and check that the same account’s conversation list loads. A public introduction page is not an equivalent comparison.',
 'If the browser works, prioritize the app and follow the cache-preservation procedure in the not-opening guide. If that does not help, continue to Step 7.',
 'If the browser also fails, inspect Discord Status and the exact error. Distinguish sign-in failure, connection errors and app exits rather than assuming one shared cause.',
 ]),
 step(3,'For call-start crashes, compare audio devices with video off','Starting voice, camera and sharing together obscures which operation triggered the exit.',[
 'With camera and sharing off, join voice with the same person. If voice alone is stable, continue to Step 4 for the video trigger.',
 'Record input/output choices under Voice & Video and select intended devices by name. If using virtual audio or voice effects, compare the physical microphone/headphones directly.',
 'If alternatives are available, change input first, then output, testing the same call after each change. Record which device change affects the result; do not replace all devices at once.',
 'If one device consistently triggers it, consult that manufacturer’s connection/driver guidance. If only the app keeps failing, compare the same voice call in the browser.',
 'For app-only failure, record devices and keybinds before trying Reset Voice and Video Settings under the available Debugging section. Reselect devices and repeat the call; restore needed preferences afterward.',
 ]),
 step(4,'For camera/share crashes, compare the target and graphics setting','An exit when starting video does not establish a GPU fault.',[
 'Confirm voice-only stability, then start camera alone or screen sharing alone. Record exactly which operation precedes the exit.',
 'For screen sharing, compare a blank Notepad window with the affected game using the same sharing method. If failure is target-specific, record the application and display mode.',
 'In User Settings → Advanced, record Hardware Acceleration and compare its opposite state after restarting Discord. Keep the same target, settings and participant.',
 'If the alternate state helps, compare for your normal usage duration. If not, restore it before checking drivers through the GPU/PC maker’s official procedure. Do not change setting and driver together.',
 'If the issue began immediately after a driver update, record both versions and use the GPU-driver guide’s rollback guidance. If only the picture stops while Discord responds, use the screen-sharing guide.',
 ],'This comparison concerns the Advanced graphics setting. Do not also change Voice & Video processing settings in the same comparison.'),
 step(5,'For gaming or later crashes, compare optional features and load','Change one companion feature and compare time to failure; high utilization alone is not a diagnosis.',[
 'Record the game, scene and elapsed time before failure. Inspect CPU, memory and GPU in Task Manager’s Processes view and note apps increasing load.',
 'If recording and streaming are both active, stop only one and repeat the scene. Improvement prioritizes the conditions involving that feature.',
 'In Discord User Settings, find Overlay/Game Overlay, record its state and disable the overlay for comparison with the same game. Restore it if unhelpful; if it helps, keep the observed working choice and record the conditions.',
 'If failure normally occurs after about thirty minutes, two stable minutes do not establish recovery. Compare a similar duration where practical and explicitly record a shorter test as limited.',
 'If the game/other apps also fail or the PC restarts, inspect Step 6’s history and investigate the PC. Do not repeatedly reinstall only Discord.',
 ]),
 step(6,'For silent exits, compare Windows reliability history','Use event times as evidence; a displayed filename alone is not a diagnosis.',[
 'Press Windows+R, enter perfmon /rel and press Enter. Select the date of the exit in Reliability Monitor.',
 'Look for a Discord-related failure among critical events. Open available technical details and record the time, app, faulting module and exception code shown.',
 'Match the time against your action immediately before the exit. Do not delete a named DLL or replace it with a copy from a download site.',
 'Record simultaneous game/other-app failures and unexpected Windows shutdowns too. For whole-PC freezing, blue screens or restarts, use the corresponding common troubleshooting guides.',
 'No entry does not prove nothing failed. Record the disappearance time, whether the call dropped and whether a startup logo returned, then compare the next occurrence.',
 ]),
 step(7,'For persistent app-only crashes, verify local folders before reinstalling','Use this later step when the browser performs the same action and the relevant feature checks have not helped.',[
 'Confirm access to your email, password and two-factor method; record needed device/keybind settings. Keep an already signed-in second device signed in. Stop if you cannot sign back in.',
 'Fully quit Discord. Uninstall it through Windows Settings → Apps → Installed apps (Apps & features on Windows 10).',
 'Use Windows+R to open %appdata%, then %localappdata%, separately. Identify only the remaining Discord folder in each location; do not delete AppData, Roaming or Local itself.',
 'Copy needed local data elsewhere, keeping the two locations distinguishable, before following Discord’s reinstall procedure for those remaining Discord folders. If a folder is in use, inspect remaining Discord processes; stop if the target is uncertain.',
 'Restart Windows and install from https://discord.com/download. After signing in, test normal startup, then the original failing call/share action. Do not restore the entire old folder over the fresh installation.',
 ],'Server memberships and sent messages are associated with the account, but local preferences may need reconfiguration. Keep preserved folders/logs private and share only the support details required.'),
 ],
 avoid:['Do not call every hidden window or remaining process a crash or proof of normal operation.','Do not replace DLLs from download sites, delete parent AppData directories or reset several graphics settings at once.'],
 cautions:['For support, collect Windows/Discord versions, time, preceding action, browser result, device/shared target, changed settings and reliability history. Redact DMs and email addresses in screenshots.','Example reporting format: voice stays connected; game-window sharing exits; blank Notepad sharing works; changing Advanced acceleration has no effect. This is an example format, not a test result for your PC.'],
 nextChecks:{heading:'When the symptom extends beyond Discord',links:[{href:'/en/guide/gpu-driver-update',label:'GPU drivers and rollback'},{href:'/en/guide/pc-game-freezes',label:'PC freezes'},{href:'/en/guide/bsod-while-gaming',label:'Blue screens'},{href:'/en/guide/pc-shuts-down-while-gaming',label:'PC shuts down'}]},
 faqs:[{question:'I clicked × and the window disappeared. Is that a crash?',answer:'If the call continues and the notification-area icon restores the window, the app may still be running in the background. Check those observations first.'},{question:'Discord immediately reopens by itself.',answer:'Record the time and preceding operation and compare reliability history. Reopening alone does not distinguish a crash from an update-related or other restart.'},{question:'Should Hardware Acceleration always be off?',answer:'Compare its alternative state with the same action and restore it if unhelpful. Results vary; keep a driver change separate from this comparison.'},{question:'What if the whole PC restarts?',answer:'That needs a wider investigation than an isolated Discord exit. Record Windows/other-app events and use the common freezing, blue-screen or shutdown guide.'}],
 sources:[source('31623498041623-Discord-Troubleshooting-Guide','Discord: general troubleshooting'),voice,source('360046057772-Discord-Bugs','Discord: documenting and reporting bugs'),source('209099387--Windows-Installer-Errors','Discord: Windows reinstall folders and installer errors'),source('225733808-Why-does-Discord-have-multiple-processes','Discord: its normal multiple-process model'),source('217659737-Game-Overlay-101','Discord: game overlay settings'),{label:'Microsoft Learn: perfmon and Reliability Monitor',url:'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/perfmon'}],
 related:[link('not-opening','App will not open'),link('call-disconnects','Only the call disconnects'),link('screen-share-not-working','Screen sharing will not start'),link('slow-performance','Discord is slow'),link('update-failed','Update Failed or update loop'),link('overlay-not-showing','Overlay will not appear')],
},
];
