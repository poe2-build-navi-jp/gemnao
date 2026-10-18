import type { LocalizedArticle } from './types';
const source=(id:string,label:string)=>({label,url:`https://support.discord.com/hc/en-us/articles/${id}`});
const step=(n:number,title:string,summary:string,actions:string[],note?:string)=>({id:`cause-${n}`,title,summary,time:'Compare one change at a time',actions,...(note?{note}:{})});
const row=(symptom:string,cause:string,n:number)=>({symptom,cause,stepId:`cause-${n}`});
const link=(slug:string,label:string)=>({href:`/en/discord/${slug}`,label});
const jp=(slug:string,label:string)=>({href:`/discord/${slug}`,label:`${label} (Japanese)`});
const base={locale:'en' as const,gameSlug:'discord',gameName:'Discord',checkedAt:'2026-10-18',sourcePolicy:'English adaptation of the existing Japanese guide with corresponding steps and official sources. Comparisons and example outcomes are editorial guidance, not measured results. Record original settings, change one condition at a time and leave comparisons you cannot perform marked as untested.'};
export const discordEchoActivityVolumeEn: LocalizedArticle[] = [
{
 ...base,slug:'echo-double-voice',title:'Discord Echo or Double Voice: Find Who Hears It and Where the Sound Returns',shortTitle:'Echo or double voice',
 description:'Compare one participant’s microphone mute at a time, then local monitoring and separate playback paths. Distinguish hearing yourself from others hearing your voice twice.',
 lead:'For Windows 11/10 desktop Discord when your voice returns with a delay, others hear it twice or a call echoes. Identify who hears the duplicate before deciding whose settings to change.',
 summary:'If your own voice returns, ask the other person to mute only their microphone and repeat the same short phrase. If that stops the return, inspect their playback/input path. If you still hear yourself after leaving the call, inspect local monitoring on your PC or headset.',
 quickFacts:[{label:'Identify both people',value:'Whose voice is duplicated, and who hears it?'},{label:'Mic mute is the comparison',value:'Mute one participant’s microphone, not the entire output'},{label:'After leaving the call',value:'A remaining self-voice suggests inspecting local monitoring'}],
 diagnosis:[row('A hears their own voice; muting B’s mic stops it','Have B compare headphones, then unmute and retest.',2),row('A still hears their own voice after leaving the call','Check A’s mic test and Windows/device monitoring.',3),row('B hears A twice, but A cannot hear the duplication','Compare another recipient and stop extra playback paths.',4),row('Self-voice occurs only during Discord Mic Test','Stop Testing; playback during that test is intentional.',1),row('The return appears with more participants','Compare the non-speaking participants’ mic mutes one at a time.',1)],
 steps:[
 step(1,'Mute one participant’s microphone at a time to trace the return','Your own returning voice can originate at someone else’s speakers and microphone.',[
 'Open Discord User Settings → Voice & Video and stop Mic Test if it is running. The test deliberately plays your voice through the selected output; finish it before comparing a real call.',
 'Let A, the person hearing their own return, say a short phrase once, such as “Audio check, one, two, three.” Have B mute only their microphone using Discord’s mic icon, rather than the headphone/deafen control.',
 'Have A repeat the same phrase. If the return stops only while B is mic-muted, ask B to perform Step 2.',
 'With three or more participants, repeat one person at a time. If unclear, have everyone except A mute their mic, then unmute one at a time and repeat the phrase.',
 'If the return persists with the other microphones muted, have A leave the call and repeat the phrase. If still audible, use Step 3; if limited to calls/streams, use Step 4.',
 ],'A mute comparison narrows the returning path but does not distinguish speaker pickup from a virtual-audio mix. Lower playback volume immediately if loud feedback occurs.'),
 step(2,'When muting one person helps, inspect that person’s playback','If A’s voice returns through B, B makes this comparison. A wearing headphones does not remove B’s speaker pickup.',[
 'Have B stop PC speaker playback and use available earphones or headphones.',
 'In B’s Discord Voice & Video, select those headphones as Output Device and the actual microphone as Input Device.',
 'Have B unmute the microphone and A repeat the same phrase once. If A no longer hears the return, verify both people can converse with that setup.',
 'If unchanged, check whether another phone or PC in the room is also playing the call. If B uses a virtual mixer or loopback input, continue to Step 4.',
 ]),
 step(3,'If self-voice remains after leaving, inspect local monitoring','Windows, recording software and a headset/interface can each play your microphone back locally.',[
 'Press Windows+R, enter mmsys.cpl and open the Sound dialog. Under Recording, select the microphone in use and open Properties.',
 'If a Listen tab offers Listen to this device, record its state, clear it and apply. Repeat the phrase to check whether the local return stops; restore an unhelpful change.',
 'If the control is absent or unhelpful, inspect the headset/interface’s sidetone or Direct Monitor feature. Use its own manual to compare it temporarily off, keeping the original setting recorded.',
 'Compare with recording/streaming software closed too. After improvement, return to Discord and separately confirm that you no longer hear the return and the other person still hears your microphone.',
 ],'Monitoring can be intentional. Record needed settings before changing them; disabling local playback is different from disabling the microphone or muting its Discord input.'),
 step(4,'For duplicate voice, separate playback and virtual input','A recipient may hear both a call and a stream, or the same signal may enter a mixer twice. Merely having OBS open does not establish the cause.',[
 'Have B, who hears the duplicate, keep the Discord call but stop watching a stream or using another call app one at a time. Have A repeat the same phrase and check whether call-only playback produces one copy.',
 'If only B hears two copies while another participant hears one, inspect B’s playback paths. If everyone hears A twice, compare A’s input path.',
 'Have A record the current Input Device in Voice & Video, select the physical microphone directly instead of a virtual cable/mixer, and compare with OBS/voice-changing software closed.',
 'If direct physical input helps, restore the removed software one at a time. At the step where duplication returns, inspect input, monitoring and loopback routing. If unchanged, restore the original setup and compare another existing mic if available.',
 ]),
 ],
 avoid:['Do not assume the person hearing their own voice is the person who must change settings.','Do not use delay length alone to diagnose the cause or leave loud feedback playing while testing.'],
 cautions:['Record whose voice returns to whom, whose mic mute stops it, whether it persists after leaving and whether direct physical input changes it.','Include microphone/headset models, Discord input/output names and virtual-audio software when seeking help. Use willing participants and do not record private calls merely for this test.'],
 faqs:[{question:'Is hearing myself during Mic Test abnormal?',answer:'The test intentionally returns your voice through the selected output. If Stop Testing ends it, that is expected. Finish the test before comparing an actual call.'},{question:'Why does my voice return when I already use headphones?',answer:'Another participant’s speakers may feed your voice into their microphone. Compare their microphone mute, then their output and input path.'},{question:'Can noise suppression or echo cancellation solve everything?',answer:'Processing may help, but a second playback device or duplicated route can remain. First narrow the return using mic mutes and headphones, then compare processing settings individually.'},{question:'Will stopping my local monitor stop others hearing me?',answer:'Local Listen/sidetone monitoring is distinct from disabling the mic or muting Discord input. After changing it, verify both your local sound and the recipient’s hearing.'}],
 sources:[source('360045138471-Discord-Voice-and-Video-Troubleshooting-Guide','Discord: voice and video troubleshooting'),source('360020641332-Mic-Testing','Discord: mic-test playback and stopping the test'),{label:'Focusrite: direct/software monitoring and Windows Listen settings',url:'https://support.focusrite.com/hc/en-gb/articles/206849219-Latency-while-using-Direct-Monitor'}],
 related:[jp('voice-cutting-out','Voice breaks up'),jp('mic-volume-low','Microphone is too quiet'),link('cant-hear-voice','Cannot hear callers')],
},
{
 ...base,slug:'game-not-detected',title:'Discord Does Not Show Your Game: Separate Detection, Activity Sharing and Invites',shortTitle:'Game not detected or shown',
 description:'Check the running game in Registered Games, then compare the intended viewer’s profile view. Distinguish detection from sharing scope, game invites and overlay support.',
 lead:'For Windows 11/10 desktop Discord when a PC game is absent, friends cannot see what you are playing or accepting an invite produces Game not detected.',
 summary:'Keep the game running and inspect current detection in Registered Games. If undetected, verify the game itself and any available manual-add option. If detected, inspect activity sharing for the intended audience. Ask the same person to reopen your profile and check the current game; invites need game-side support too.',
 quickFacts:[{label:'Two places to compare',value:'Your current detection view and the other person’s view of your profile'},{label:'Saved name is not enough',value:'An old Registered Games entry does not prove current detection'},{label:'Different features',value:'Game name, Rich Presence, invitations and overlay are separate checks'}],
 diagnosis:[row('The running game is not currently detected','Launch the game itself and inspect available add candidates.',1),row('The current game is detected but another person cannot see it','Inspect global/game-specific sharing and compare that same viewer.',2),row('A friend sees it but a server acquaintance does not','Inspect the intended audience and that server’s sharing settings.',3),row('One game fails, or multiple games are undetected','Run existing games one at a time to narrow the scope.',4),row('Game name appears, but invite/join controls do not','Check game support and whether its current state permits joining.',5),row('The name appears, but Discord is absent inside the game','Investigate the overlay rather than registering the game again.',5)],
 steps:[
 step(1,'For missing detection, launch the game and inspect add candidates','An open launcher such as Steam is not the same as a running game. Start with only one game to avoid selecting the wrong app.',[
 'Launch the game to its title screen and keep it open. Alt+Tab to the installed Discord desktop app; do not use browser Discord as this PC-game detection comparison.',
 'Open User Settings and locate Registered Games. Current official guidance places it under Games & Apps; use the Registered Games name if your category layout differs.',
 'Record the app shown as currently running. If it is the intended game, continue to Step 2. If none or only a launcher appears, verify the actual game window remains open.',
 'If an Add it! or equivalent manual-add link is available, inspect its running-app candidates and choose the actual game. Match its window name instead of guessing between similar names.',
 'If it becomes the currently recognized game, continue to Step 2. If absent from candidates, stop repeating manual adding and use Step 4’s other-game comparison.',
 ]),
 step(2,'For a detected game, compare sharing with the intended viewer','Detecting software on your PC and revealing it to other people are different actions. Decide whom you want to see it before changing visibility.',[
 'Open the activity-sharing/privacy area of User Settings and locate the activity-sharing control, such as Share my activity. Older layouts/documentation may call this Activity Privacy.',
 'If you want to share, inspect both the global control and the target game’s sharing setting in Registered Games. Read the control’s purpose rather than confusing it with the overlay toggle.',
 'Keep the same game running and ask one willing intended viewer to reopen your Discord profile. Ask whether the current game name appears, rather than relying on old activity history.',
 'No current game before and the correct current game after the change supports a sharing-setting improvement. If unchanged, keep the same person/game and inspect the audience in Step 3.',
 ]),
 step(3,'For viewer-dependent results, inspect the sharing audience','You do not need to make activity visible to everyone. Check whether your intended viewer is included.',[
 'Inspect friend-only or other audience choices and per-server controls in the activity-sharing area. Establish whether the viewer is a friend or only shares a server.',
 'For a particular server, inspect its name menu → Privacy Settings → activity control. Change only the sharing destination you intend to allow.',
 'With the same game running, ask that same viewer to check again. Record friendship and other shared servers: disabling one server’s sharing does not prevent access through another allowed relationship.',
 'Example: friend A sees the game but server acquaintance B does not. Inspect audience before adding the game again. If neither sees it and current detection is absent too, return to Step 1.',
 ],'These are comparison examples, not measured results. Inspect the viewer’s profile view as well as member-list cards; Discord documents experiments where server-specific privacy controls do not govern those activity cards.'),
 step(4,'Compare another installed game before resetting anything','Narrow whether one game or all tested games fail. You do not need to buy or install a game just for this comparison.',[
 'Record game/launcher names, the currently detected name and the name the viewer sees. Save progress, close the first game and start one other installed game.',
 'Use the same detection view and the same person. If the second is detected, prioritize the original game’s launch path and add candidates instead of declaring all of Discord broken.',
 'If neither is detected, fully quit Discord through its notification-area icon, restart it and repeat the same comparison. Preserve game progress before closing anything.',
 'If unchanged, collect game names, Discord/Windows versions, other-game results and a detection screenshot for official support. Redact usernames/server names that are unnecessary.',
 ],'Do not disable security features or install unknown integration tools solely to display a game name.'),
 step(5,'Treat invite, join and overlay failures as separate checks','A displayed game name does not add invitations or spectating support to every game.',[
 'For Game not detected while accepting an invite, launch that game on your own PC and try again. Discord’s guidance requires running it after the invite integration was incorporated.',
 'If the send-invite option is absent, check the game’s official guidance for Discord invite support and enter a joinable state such as a supported lobby. Also inspect Step 2’s sharing controls.',
 'A name without map details, Join or Spectate does not establish failed manual adding. Detailed presence and joining/spectating require game-side integration and the appropriate state.',
 'If the other person sees your game but the in-game Discord interface is absent, use the overlay guide. Pause repeated game registration.',
 ]),
 ],
 avoid:['Do not broaden activity visibility beyond the audience you intend or erase history as a detection repair.','Do not assume manual registration guarantees invitations, spectating or an in-game overlay.'],
 cautions:['For help, list game/launcher, whether it is currently detected, who cannot see it, other-game results and before/after restart results.','Without another person, you can inspect local detection and sharing settings, but external visibility remains unconfirmed. Do not count your own saved entry as successful public display.'],
 faqs:[{question:'Does a name in Registered Games prove detection works?',answer:'An old entry can remain. Check current detection while the game runs and compare against after closing it.'},{question:'Will manual adding enable invitations or spectating?',answer:'No guarantee. Name registration is distinct from game-provided integration; even supported games need a suitable joinable state.'},{question:'Should I clear game history to fix the current display?',answer:'Do not substitute history deletion for detection/sharing checks. Use history controls only when your goal is to remove past activity.'},{question:'What if nobody is available to check my profile?',answer:'Record current detection and the chosen audience locally, but leave the other person’s visibility untested. Local settings alone do not confirm what they see.'}],
 sources:[source('7931156448919-Activity-Sharing-on-Discord-FAQ','Discord: activity sharing, audiences and game-level controls'),source('115001557452-Game-Invites','Discord: game detection and supported invitations'),{label:'Discord: official support request',url:'https://support.discord.com/hc/en-us/requests/new'}],
 related:[jp('overlay-not-showing','In-game overlay is missing'),link('not-opening','Discord will not open'),jp('slow-performance','Discord is slow')],
},
{
 ...base,slug:'game-volume-lowers',title:'Game Volume Drops in Discord Calls: Timing and Bluetooth Checks',shortTitle:'Game volume drops during calls',
 description:'Compare speech-triggered attenuation, Windows communication ducking, Bluetooth quality changes and game-specific volume. Keep the same sound and restore unhelpful changes.',
 lead:'For Windows 11/10 desktop Discord when music or effects become quieter during speech, stay quiet throughout a call or sound muffled with a Bluetooth headset.',
 summary:'If volume drops only while someone speaks, compare Discord Attenuation at 0%. If it drops immediately on joining even during silence, inspect Windows Communications settings. If Bluetooth quality changes too, compare microphone/audio mode. Use the same game sound before, during and after the call, changing one control at a time.',
 quickFacts:[{label:'Compare timing',value:'Before joining, silent call, other person speaking, you speaking and after leaving'},{label:'Volume versus quality',value:'Muffling is different from simply becoming quieter'},{label:'Keep the baseline',value:'Same game scene, output and volume controls; restore changes that do not help'}],
 diagnosis:[row('Volume falls during speech and returns during silence','Compare Discord Attenuation at 0% with the same speech.',2),row('It stays lower immediately after joining, even in silence','Inspect Windows Communications; inspect Bluetooth too if quality changes.',3),row('Bluetooth sounds muffled or thin as the call starts','Compare another microphone or existing wired equipment.',4),row('It lowers only when you switch away from the game','Return focus to the game and inspect background-volume options.',5),row('It stays low after leaving or only affects one game','Inspect per-app volume, output and the game’s settings.',5)],
 steps:[
 step(1,'Use the same sound before, during and after the call','A stable menu track is a better comparison than combat or a cutscene whose own loudness changes.',[
 'Record game, Windows and headset volume. Keep those values and the output device fixed during the first comparison.',
 'Listen before joining. Join a willing participant’s call and compare everyone silent, the other person speaking, then you speaking.',
 'Leave and check whether the original sound returns. Record speech-only reduction, reduction throughout the call, quality change or reduction remaining after leaving.',
 'If merely switching windows changes the sound, bring the game back to the foreground for each listening comparison. Check whether joining still makes a separate difference.',
 ]),
 step(2,'For speech-only drops, compare Discord Attenuation at 0%','Attenuation lowers other apps during conversation; inspect it when that automatic reduction is unwanted.',[
 'In the desktop client, open User Settings → Voice & Video and locate Attenuation among the voice controls. The official slider guidance is desktop-specific.',
 'Record its original percentage, then compare 0%. If controls for applying it to your speech or other people’s speech are shown, record their states too.',
 'Using Step 1’s sound, have the other person and yourself speak in turn. If silent-call volume stays unchanged and only the speech-triggered dip disappears, this setting improved the observed symptom.',
 'If unchanged, restore the previous values and continue to Step 3 or 4. If already at 0%, do not repeat the same adjustment. If absent, record the setting as unconfirmed and continue with the Windows comparison.',
 ],'With attenuation off, the game may mask conversation. Adjust game loudness afterward or restore enough attenuation for comfortable listening.'),
 step(3,'For an immediate call-wide drop, inspect Windows Communications','Windows can also reduce other audio when communication begins. Its Do nothing option does not repair a Bluetooth quality-mode change.',[
 'Press Windows+R, enter mmsys.cpl and press Enter. Open the Communications tab of Sound.',
 'Record the current choice, select Do nothing, then Apply and OK.',
 'Leave and rejoin the Discord call. Use the same game sound to compare whether it drops even during silence and returns after leaving.',
 'If the immediate reduction disappears, record that improvement. If unchanged, restore the old choice. Continue to Step 4 for a quality change or Step 5 for a volume-only problem.',
 ]),
 step(4,'For Bluetooth quality changes, compare microphone use separately','Traditional Bluetooth headset call modes can reduce playback quality while the headset mic is active; a volume slider cannot remove that mode change.',[
 'Record whether joining causes muffling or loss of detail as well as lower loudness. Make this comparison before deleting a stable pairing.',
 'If a built-in or USB mic is available, choose it as Discord Input Device while keeping the Bluetooth headset as Output Device, then rejoin. Check whether another app is still using the headset mic.',
 'Restored quality is a clue to headset-mic mode involvement. Without another mic, compare existing wired/USB headphones if available. If no alternative exists, record the comparison as untested.',
 'If only volume still drops with another device, return to attenuation/Communications checks. If confined to Bluetooth, consult the linked Bluetooth guide’s compatibility checks and restore unhelpful device selections.',
 ],'LE Audio behavior depends on Windows, drivers/radio and peripheral support; do not impose one limitation on every Bluetooth device. No new purchase is required just to complete a comparison.'),
 step(5,'For lingering or game-specific low volume, inspect routing and controls','Look for a setting that stayed lower or a game’s own audio behavior.',[
 'On Windows 11, open Settings → System → Sound → Volume mixer. On Windows 10, right-click the taskbar speaker → Open Volume Mixer and inspect the game.',
 'Check game mute/volume and, where available, its selected output. Compare against the before-call record and restore only the changed control. Windows 10 app routing is under Sound → App volume and device preferences.',
 'For one game, inspect master volume, voice-chat options and any background/inactive-window volume setting it provides. Record originals and compare one item in the same scene.',
 'If the headset provides Game/Chat balance, record its position and compare near the middle. For a separate mixer app with automatic volume control, inspect only that relevant feature.',
 'After improvement, rejoin and repeat speech, silence and leaving. If unresolved, collect timing, devices and before/after attenuation/Communications results for support; do not turn all controls to maximum.',
 ]),
 ],
 avoid:['Do not change all volume controls at once or confuse noise suppression with other-app attenuation.','Do not treat timing as conclusive proof: several settings can overlap, and a short or unavailable comparison remains limited.'],
 cautions:['Example record: normal before joining; lower immediately even in silence; normal after leaving; 0% attenuation made no difference; the Communications comparison helped. Replace this illustration with your actual results.','Include whether quality changed, the input/output models and each restored/retained setting when requesting help. Keep listening levels comfortable.'],
 faqs:[{question:'Why is it still quiet with Attenuation at 0%?',answer:'Windows communication ducking, Bluetooth mode or game/device controls may still contribute. Use when it begins and whether quality changes to choose the next comparison.'},{question:'Will disabling noise suppression restore game volume?',answer:'Noise suppression primarily processes microphone noise; it is separate from reducing other apps. Inspect attenuation and Windows Communications for game playback reduction first.'},{question:'What does Windows Do nothing mean?',answer:'It disables Windows’ default reduction of other sounds when communication is detected. Discord/game-specific volume behavior and Bluetooth modes remain separate.'},{question:'Why does it stay quiet after leaving?',answer:'Inspect the game’s mixer volume/output against the original record, then game/headset controls individually. Do not raise everything to maximum at once.'}],
 sources:[source('206342888-How-do-I-stop-Discord-from-lowering-my-volume-when-someone-else-is-talking','Discord: desktop Attenuation and its 0% setting'),{label:'Discord: Bluetooth call-profile quality limitation (Japanese)',url:'https://support.discord.com/hc/ja/articles/19850083499159--既知の問題-通話に参加すると音質が低下する'},{label:'Microsoft: app volume and output routing',url:'https://support.microsoft.com/en-us/windows/hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows'},{label:'Microsoft Learn: Windows default communication ducking',url:'https://learn.microsoft.com/en-us/windows/win32/coreaudio/stream-attenuation'},{label:'Microsoft Learn: communication devices and Sound controls',url:'https://learn.microsoft.com/en-us/windows/win32/coreaudio/using-the-communication-device'},{label:'Microsoft: Windows LE Audio compatibility and quality',url:'https://support.microsoft.com/en-us/windows/hardware/bluetooth/configuring-bluetooth-le-audio-quality-settings-on-windows-11'}],
 related:[link('bluetooth-audio-problem','Bluetooth audio changes during calls'),jp('user-volume-low','One caller is too quiet'),link('cant-hear-voice','Cannot hear callers')],
},
];
