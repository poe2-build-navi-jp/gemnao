import type { LocalizedArticle } from './types';
const source=(id:string,label:string)=>({label,url:`https://support.discord.com/hc/en-us/articles/${id}`});
const voice=source('360045138471-Discord-Voice-and-Video-Troubleshooting-Guide','Discord: voice, video and screen-share troubleshooting');
const status={label:'Discord Status: service incidents',url:'https://discordstatus.com/'};
const step=(n:number,title:string,summary:string,actions:string[],note?:string)=>({id:`cause-${n}`,title,summary,time:'Compare one change at a time',actions,...(note?{note}:{})});
const row=(symptom:string,cause:string,n:number)=>({symptom,cause,stepId:`cause-${n}`});
const link=(slug:string,label:string)=>({href:`/en/discord/${slug}`,label});
const jp=(slug:string,label:string)=>({href:`/discord/${slug}`,label:`${label} (Japanese)`});
const base={locale:'en' as const,gameSlug:'discord',gameName:'Discord',checkedAt:'2026-10-18',sourcePolicy:'English adaptation preserving the Japanese guide’s step IDs, comparisons, precautions and official sources. Examples describe how to record results; they are not measured outcomes or promises of recovery.'};
export const discordRtcScreenHelperEn: LocalizedArticle[] = [
{
 ...base,slug:'rtc-connecting',title:'Discord Stuck on RTC Connecting: Device, Network and Channel Checks',shortTitle:'Stuck on RTC Connecting',
 description:'Compare channels, browser voice, another device and another network. Inspect VPN, QoS and region settings with restoration steps, and use AMD-specific checks only when relevant.',
 lead:'For Windows desktop Discord stuck on RTC Connecting when joining a voice channel or DM. Browser and phone comparisons help narrow the scope.',
 summary:'Check incidents, then compare another destination, browser Discord on the same PC, and an available second device/network one at a time. Network-only failure prioritizes that connection; app-only failure prioritizes app settings. AMD-specific guidance is an additional check when the hardware matches and browser voice works.',
 quickFacts:[{label:'Record the exact error',value:'RTC Connecting, No Route and Awaiting Endpoint are observations, not a hardware diagnosis'},{label:'Success means a real call',value:'Confirm a short conversation, not merely loading text chat'},{label:'Keep comparisons separate',value:'Change the client, device or network individually'}],
 diagnosis:[row('Several people fail together, or Awaiting Endpoint appears','Compare the time with Discord Status and wait for a relevant incident to recover.',1),row('One channel fails; a DM or another channel works','Ask its administrator to compare the voice region.',4),row('Browser voice works on the same PC and connection','Inspect app updates/settings; use AMD checks only for the matching hardware.',5),row('Another device fails on the same Wi-Fi; another network works','Prioritize the original connection, router path and VPN.',3),row('Another device works on the same Wi-Fi; only the PC fails','Compare app/browser, PC VPN and targeted connection permissions.',2),row('The same destination fails across devices and networks','Compare another destination and share results with its administrator.',4),row('The connection completes but voices are missing','Separate output/microphone issues from connection failure.',1)],
 steps:[
 step(1,'Check the error and incidents, then rejoin','A prolonged RTC Connecting message does not identify a failed router or GPU.',[
 'Record the exact message and time, then inspect Discord Status for a matching incident.',
 'During a relevant incident, retry the same call after recovery. If nothing is posted, ask whether other participants failed at the same time; an empty status page is not proof that every service is healthy.',
 'Leave and rejoin once. If unchanged, quit Discord from the notification area and reopen it to apply updates.',
 'After connection, confirm a short conversation. For a connected but silent call use the output/microphone guides; for later disconnections use the call-disconnection guide.',
 ]),
 step(2,'Compare destination, browser and device','Keep account, destination and connection unchanged wherever possible.',[
 'On the same PC/network, try another permitted voice channel or a DM with a willing person. If only one destination fails, use Step 4.',
 'End the app call and open https://discord.com/app on the same PC. Join the same destination/account with required microphone permission. Opening the chat page alone is not a successful voice test.',
 'If browser voice works, use Step 5. If both clients fail, compare a phone on the same Wi-Fi if one is available.',
 'Confirm whether the phone actually uses Wi-Fi or mobile data. Same-Wi-Fi phone success prioritizes the PC; both failing prioritizes the network comparisons in Step 3.',
 'Record results separately, for example app fails / same-PC browser works / phone on Wi-Fi works. That example prioritizes the app without proving a cause. Mark unavailable tests as untested.',
 ]),
 step(3,'Inspect network, VPN and PC permissions','Another connection working narrows the path; it does not prove a particular router setting is wrong.',[
 'Where permitted, compare the same PC and call on another connection, such as your own hotspot. Keep it brief, account for data limits and restore the original connection afterward.',
 'For a personal VPN you control, temporarily compare it disconnected. If that helps, ask its provider about UDP support/configuration; Discord documents that voice requires a UDP-capable VPN.',
 'For home-network-only failure, inspect the provider’s incidents. Check shared users before restarting the modem/router by its manufacturer’s instructions. Do not press factory reset.',
 'For PC-only failure, inspect security software’s block history for Discord at the relevant time. Give a managed PC/network administrator the comparison results instead of bypassing their rules.',
 'If Voice & Video shows enabled high-priority QoS, record it, disable it temporarily and compare the same call. Skip an absent setting and restore it if unhelpful.',
 ],'Do not disable the whole firewall, guess ports to open or bypass school/work restrictions. Use another-network results as evidence for the administrator/provider.'),
 step(4,'For one channel, compare its voice region','Coordinate with its administrator because the change affects other participants.',[
 'Confirm a DM or another channel works on the same PC/network and share the affected channel and other participants’ results with its administrator.',
 'With management permission, right-click the voice channel → Edit Channel → Overview → Region Override. Record Automatic or the existing region.',
 'After coordinating with participants, temporarily select another available region. Without permission, ask the administrator to make the comparison.',
 'Rejoin with the same people and verify a short conversation. Restore the original region if unchanged; if improved, agree on the ongoing setting with the administrator.',
 ]),
 step(5,'For app-only failure, check updates and AMD conditions','The AMD-specific official article dates from 2022 and describes rare cases, mainly on older hardware. It is not a universal RTC repair.',[
 'Fully quit/reopen Discord and restart the PC, then compare app and browser again using the same call destination.',
 'Check whether the PC has an AMD CPU or GPU. Windows Settings → System → About identifies the processor; Windows+R → dxdiag → Display identifies GPU/driver details.',
 'Only with matching AMD hardware and working browser voice, inspect the official AMD article. If OpenH264 Video Codec provided by Cisco Systems, Inc. is present and enabled under Voice & Video, record it, disable it and compare.',
 'If the control is absent, skip it rather than guessing a replacement. Restore an unhelpful change. Check drivers through the PC/GPU manufacturer’s instructions separately from codec changes.',
 'App-only failure can also occur without AMD hardware. After recording input/output devices, levels and keybinds, consider the optional Reset Voice and Video Settings control under Debugging. Reselect devices and retest; consider reinstalling only if the problem persists.',
 ],'AMD hardware alone does not establish the cause. Before reinstalling, preserve your login email/password and MFA access and use the not-opening guide’s specific instructions.'),
 ],
 avoid:['Do not infer router/GPU failure from the error alone or change several network settings together.','Do not broadly disable protection or apply the AMD codec check to every PC.'],
 cautions:['Record exact error/time, client versions, same-PC app/browser, same-Wi-Fi device, other-network results, DM/channel differences, VPN and each changed/restored setting. Use the blank memo on this page without including secrets.','The official connection-error guide includes PTB/Canary console-log collection if needed. First gather ordinary-client comparisons; submit logs privately through official support with personal information removed.'],
 faqs:[{question:'Why does browsing work while RTC Connecting stays stuck?',answer:'Loading websites or text chat does not verify a voice connection. Compare real conversation in the same-PC browser and, where available, another network.'},{question:'How many minutes should I wait?',answer:'There is no universal recovery time. For a relevant incident wait for recovery; otherwise record the error/time and proceed through comparisons after rejoining fails.'},{question:'Should every AMD PC disable OpenH264?',answer:'No. The dated official article concerns some AMD environments. First verify browser voice works, then check the hardware and whether that exact control exists.'},{question:'Does hotspot success prove my router is broken?',answer:'No. The original connection, routing, VPN and router configuration differ. Share the same-PC/same-destination comparison with the administrator/provider.'}],
 sources:[source('115001310031-Voice-Connection-Errors','Discord: voice connection errors'),voice,source('4978019693463-AMD-GPU-CPU-RTC-CONNECTING-Troubleshooting','Discord: conditional AMD RTC troubleshooting (2022)'),status],
 related:[jp('voice-client-outdated','Voice client is out of date'),link('no-route','No Route'),link('call-disconnects','Calls disconnect'),link('cant-hear-voice','Connected but cannot hear callers'),link('not-opening','Discord will not open')],
},
{
 ...base,slug:'screen-share-not-working',title:'Discord Screen Sharing Not Working: Start, Source and Viewer Checks',shortTitle:'Screen sharing will not start',
 description:'Separate failure before Go Live from a black viewer screen or paused preview. Compare server Video permission, normal windows, games, the whole display and another viewer.',
 lead:'For Windows desktop Discord when sharing cannot start or another person cannot see the stream. Compare the broadcaster and viewer rather than changing both sides at once.',
 summary:'First check whether Go Live starts. If it does not, inspect call membership and the server’s Video permission. If it starts, have the viewer open Watch Stream. Then compare a nonprivate ordinary app, the game and the whole display; distinguish a small preview from the actual viewer’s picture.',
 quickFacts:[{label:'Locate the stopping point',value:'Before Go Live, after starting, or only in the viewer’s picture'},{label:'Have the viewer open it',value:'Joining voice alone does not necessarily open the stream'},{label:'Protect the shared display',value:'Hide notifications and private windows before whole-screen comparison'}],
 diagnosis:[row('Share button is absent/unavailable, or Go Live never starts','Compare a DM call and another permitted server channel.',1),row('Go Live starts but the viewer sees nothing','Have them open Watch Stream rather than relying on its thumbnail.',2),row('Only the broadcaster’s small preview pauses','Ask whether the actual viewer’s picture also stops.',2),row('Only the game is black or missing from the selection','Compare an ordinary app and the whole display.',3),row('Only one person cannot see it','Compare a second willing viewer in the same call.',4),row('Several viewers see every source as black','Compare restart, video settings and the same source.',5)],
 steps:[
 step(1,'Before Go Live, inspect the call and Video permission','Server voice-channel screen sharing uses Video permission.',[
 'Join the intended server voice channel, or first start a DM call. Select Share Your Screen, choose the source and check whether Go Live starts.',
 'If only the server prevents starting, ask its administrator to inspect Video under Server Settings → Roles and the voice channel’s Edit Channel → Permissions. Do not grant yourself or others broad management permissions as a workaround.',
 'Compare a DM and another permitted channel. If none starts, fully quit/reopen Discord and inspect Discord Status.',
 ],'Record the stopping point and exact error if Go Live immediately stops. The button’s presence alone does not prove a permission cause.'),
 step(2,'Separate the actual stream from its previews','A hidden thumbnail or paused local preview can differ from what the viewer sees.',[
 'Confirm the broadcaster remains live. The viewer joins the same voice channel, selects the broadcaster’s name and opens Watch Stream.',
 'If the actual picture works despite an empty thumbnail, inspect Hide stream preview or Stream Previews only if you want to change that preview behavior.',
 'If the broadcaster’s small picture pauses while the game is in front, ask whether the viewer’s picture still moves. Do not change GPU settings solely because that local preview pauses.',
 'If the actual viewing window is black or frozen, compare sources in the next step.',
 ]),
 step(3,'Compare app, game and display capture','Use a nonprivate source and have the viewer report each result.',[
 'Share a simple window such as a new Notepad document containing no personal information. Type a harmless line and ask whether the viewer sees it update.',
 'If that works, open the game and choose its application window. If absent from the picker, record the display mode and compare windowed/borderless if supported.',
 'For a game-only black picture, stop sharing and choose the intended display instead. Hide personal windows and notifications first. Success here suggests an application-capture difference without proving its cause.',
 'After switching to another window, use Change Windows in the active stream to select the intended source again. If both application and display capture fail, use Step 5.',
 ]),
 step(4,'For one affected viewer, compare a second person','Separate the broadcaster’s capture from one person’s viewing conditions.',[
 'If another willing participant is available, have both join the same voice channel and open the same stream from the broadcaster’s name → Watch Stream.',
 'If the second person sees it, the first closes the stream, rejoins the same channel and opens it again. Moving to a different voice channel leaves the stream.',
 'If both see the same black source, return to source comparisons in Step 3 and broadcaster checks in Step 5 instead of repeatedly changing only viewer settings.',
 ]),
 step(5,'For all sources and viewers, compare video settings','Change one condition and repeat the same harmless source with the same viewer.',[
 'Fully quit/reopen Discord and the shared app, then share the same Notepad window again.',
 'If unchanged, record Hardware Acceleration under User Settings → Voice & Video → Video. If enabled, compare it disabled after restarting Discord, and restore it if unhelpful.',
 'If the picture appears but repeatedly freezes, use the stream window’s quality controls to lower resolution or frame rate one level, then ask the same viewer to compare.',
 'If all viewers still see black, inspect Windows and the PC/GPU manufacturer’s driver updates. Record error, source, viewer count and comparisons for official support.',
 ],'The documented video Hardware Acceleration control is under Voice & Video → Video. Skip absent controls; do not hunt for unverified experimental capture switches.'),
 ],
 avoid:['Do not share private windows or assume a paused local preview proves the viewer sees black.','Do not grant Administrator permission or disable security protection as a blanket screen-sharing fix.'],
 cautions:['For support, record whether Go Live starts, ordinary-app/game/display differences, affected viewer count, incident/restart results and errors.','If the picture works but audio is absent, use the stream-audio guide. Mark unavailable second-viewer comparisons as untested.'],
 faqs:[{question:'Does a paused small preview mean viewers lost the picture?',answer:'Not necessarily. Discord documents pausing the local picture-in-picture when the game has focus. Ask whether the actual Watch Stream picture still updates.'},{question:'Why is the listing thumbnail black while the viewer sees video?',answer:'Stream previews can be hidden separately. If the opened stream works, you can continue sharing without changing its capture settings.'},{question:'Why does a DM share work but a server share will not start?',answer:'Ask the administrator to inspect the role and voice channel’s Video permission. DM success alone does not establish a server outage.'}],
 sources:[source('360040816151-Go-Live-and-Screen-Share','Discord: Go Live, Video permission and watching streams'),voice,source('33030151293079-Discord-Voice-Video-Streaming-Guide','Discord: voice, video and streaming settings'),status],
 related:[link('screen-share-black-screen','A shared screen is black'),link('stream-no-audio','Stream has no audio'),jp('stream-stuttering','Stream keeps stuttering')],
},
{
 ...base,slug:'system-helper',title:'Discord Keybinds Fail in Games: System Helper and Shortcut Checks',shortTitle:'System Helper and keybinds',
 description:'Compare the same key outside and inside a game, close the keybind editor and check conflicts. Follow only Discord’s official helper prompt when offered and verify the result afterward.',
 lead:'For Windows desktop Discord when Push-to-Talk, mute or overlay shortcuts fail in games. System Helper is experimental and available only to some Windows users.',
 summary:'Close the keybind editor and compare one action outside and inside the game. If both fail, inspect the action, recorded key and conflicts. If only the game fails, compare another key and inspect the official helper prompt. Without a prompt, continue ordinary comparisons and use manual controls rather than forcing installation.',
 quickFacts:[{label:'Leave the editor first',value:'Discord disables keybinds while you edit them'},{label:'Verify the action',value:'A recorded key is not proof that Push-to-Talk or mute works'},{label:'Helper availability varies',value:'An absent prompt does not itself mean installation failed'}],
 diagnosis:[row('Testing while editing keybinds','Close settings before testing.',1),row('The key fails both outside and inside the game','Inspect the selected action, recording and conflicts.',2),row('Outside the game works; in-game fails','Compare another key, then inspect the official helper prompt.',3),row('No System Helper prompt appears','Use basic comparisons and manual alternatives.',4),row('Installation finishes but the same game still fails','Repeat the original test and compare another game.',5),row('Mute toggles correctly but no voice reaches the caller','Separate microphone/call settings from key registration.',5)],
 steps:[
 step(1,'Close the editor and compare the same action','Recording a key and successfully using it are separate checks.',[
 'Open User Settings → Keybinds and record the target action/key. For Push-to-Talk, also inspect input mode and its shortcut under Voice & Video.',
 'Stop recording and close settings. Outside the game, press Toggle Mute once and inspect the icon; restore your intended mute state after testing.',
 'For Push-to-Talk, hold the key during a call and ask a willing caller to compare a short phrase with the key held/released. Mic Test alone does not verify game-focused key behavior.',
 'Bring a safe game menu to the front and repeat the same action/key. For Toggle Mute, press once then Alt+Tab to Discord to inspect the state rather than repeatedly pressing it.',
 'If both fail, use Step 2. If only the game fails, check conflicts then Step 3. The overlay itself is an in-game feature, so failing to open it outside a game is not this comparison’s failure condition.',
 ]),
 step(2,'Compare another unused key and inspect conflicts','Check the action and input before installing anything.',[
 'Record the original assignment and make sure the action is not Unassigned. Distinguish Push-to-Talk from Push-to-Mute and other similar actions.',
 'Check that recording shows the intended combination. If Fn or an extra mouse button records unreliably, compare a normal keyboard key.',
 'Temporarily choose a combination unused by your game, recorder and keyboard software. No single key is unused in every setup; inspect your own assignments.',
 'Close the editor and repeat the outside/inside-game comparison. If only the new key works, investigate the old key’s conflicts/input path; restore unhelpful changes.',
 'If comparing with unneeded recording/remapping software closed, save work and close one program at a time. Do not disable security or anti-cheat components.',
 ]),
 step(3,'For game-only failure, inspect the in-app helper offer','An elevated game can affect key registration, but game-only failure does not prove a permission mismatch.',[
 'In Windows desktop Discord, inspect User Settings → Overlay, Keybinds, Voice & Video or Windows Settings for a helper prompt. Windows Settings here means the section inside Discord.',
 'If offered and appropriate, start installation from that Discord prompt. Inspect the publisher/details of the Windows permission request and confirm it corresponds to your own action. Ask the administrator on a managed PC.',
 'Wait for the result and record any error instead of repeatedly clicking Install. Continue to Step 5 to verify behavior.',
 'If no prompt appears, use Step 4. Do not search third-party sites for an installer or raise the game’s privileges merely to force a prompt.',
 ]),
 step(4,'Without a prompt, use basic checks and alternatives','The helper is experimental, limited to some Windows desktop clients and unnecessary for ordinary Discord use.',[
 'Confirm you are using the Windows desktop app. The helper is not installed into browser or mobile Discord.',
 'Quit Discord from the notification area and reopen it to apply updates, then inspect again. Updating does not guarantee availability; record an absent offer as such.',
 'Compare another key from Step 2 and another already installed game if available. If only the original game fails, record its name, mode and affected action.',
 'For now, use Alt+Tab and Discord’s manual mute control. If considering Voice Activity instead of Push-to-Talk, first check whether it transmits unwanted room sound.',
 'Do not reinstall solely to obtain the offer or use permanent Run as administrator as a universal fix. Give official support the comparison results.',
 ]),
 step(5,'After installation, verify keys, voice and overlay separately','Installation completion does not prove the original symptom is resolved.',[
 'Inspect Discord’s Windows Settings section for a post-install indicator such as Uninstall. If unclear, record the prompt/error state rather than assuming success.',
 'Close settings and repeat Step 1. Check whether Push-to-Talk sends voice while held and whether one Toggle Mute press changes the mute state.',
 'If unchanged, save game progress, restart Discord and the game, and repeat. Compare another key/game to distinguish one-game from shared failure.',
 'If mute toggles but voice is missing, use the microphone guide. For overlay-only failure, inspect enablement and, where offered, compare windowed/borderless before using the overlay guide.',
 'After improvement, check again after restarting Discord/the game. If the helper is no longer wanted, its official removal control is User Settings → Windows Settings → Uninstall.',
 ]),
 ],
 avoid:['Do not download unofficial helper installers or disable protection to make shortcuts work.','Do not interpret missing experimental availability as corruption or elevate every game/app to force a prompt.'],
 cautions:['Record Windows/Discord versions, game, action/key, outside/inside results, another key/game and helper prompt/install state. Hide names in screenshots and never send administrator passwords.','If a managed PC blocks installation, ask its administrator. Helper key registration, microphone input and overlay rendering are different outcomes.'],
 faqs:[{question:'Why can Discord record a key but not use it in settings?',answer:'Keybinds are disabled during editing. Stop recording, close settings and test the action outside and inside the game.'},{question:'Can I use Discord without System Helper?',answer:'Yes. Core Discord features remain available; the helper addresses certain elevated-game keybind conditions and is not required for everyone.'},{question:'Will installing it guarantee the overlay appears?',answer:'No. Key registration and overlay display conditions differ. Inspect enablement and game display mode with the overlay guide.'},{question:'What if game-only failure remains after installation?',answer:'Compare the same action with another key and another game. Record whether one game or several fail, together with before/after installation results for support.'}],
 sources:[source('34853435033367-Discord-System-Helper','Discord: System Helper availability, installation and removal'),source('217659737-Game-Overlay-101','Discord: Windows game overlay'),source('217083547-How-do-I-add-different-Keybinds','Discord: keybind actions and disabled editing state'),{label:'Discord: official support request',url:'https://support.discord.com/hc/en-us/requests/new'}],
 related:[link('overlay-not-showing','Overlay is missing'),link('mic-not-working','Microphone has no input'),link('update-failed','Update Failed')],
},
];
