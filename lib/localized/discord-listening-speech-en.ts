import type { LocalizedArticle } from './types';
const source=(id:string,label:string)=>({label,url:`https://support.discord.com/hc/en-us/articles/${id}`});
const voice=source('360045138471-Discord-Voice-and-Video-Troubleshooting-Guide','Discord: voice and video troubleshooting');
const step=(n:number,title:string,summary:string,actions:string[],note?:string)=>({id:`cause-${n}`,title,summary,time:'Compare one change at a time',actions,...(note?{note}:{})});
const row=(symptom:string,cause:string,n:number)=>({symptom,cause,stepId:`cause-${n}`});
const link=(slug:string,label:string)=>({href:`/en/discord/${slug}`,label});
const base={locale:'en' as const,gameSlug:'discord',gameName:'Discord',checkedAt:'2026-10-18',sourcePolicy:'English adaptation preserving the original diagnostic branches, step IDs, actions, precautions and official sources. Compare the same person, device and phrase. Numerical examples are not measured results or universal settings.'};
export const discordListeningSpeechEn: LocalizedArticle[] = [
{
 ...base,slug:'user-volume-low',title:'Discord Voices Too Quiet: One Person, Everyone or Only in Games',shortTitle:'Other people sound too quiet',
 description:'Start with one caller versus everyone. Compare user volume, Discord output, Windows mixer and game balance before asking the sender to inspect their microphone.',
 lead:'For Windows 11/10 desktop Discord when a caller is quiet or voices get buried under game audio. For complete silence, use the cannot-hear-voice guide.',
 summary:'For one quiet person, inspect the volume you assigned to them. For everyone, inspect your Discord output and Windows mixer. For game-only difficulty, lower competing game audio. If other listeners also hear the same person quietly, ask that person to compare their microphone recording and Discord input.',
 quickFacts:[{label:'Whose voice is quiet?',value:'One person, all callers or only during a game'},{label:'Keep listening conditions',value:'Same headphones, caller and phrase; change one control'},{label:'Input differs from output',value:'Your microphone level does not amplify someone else’s voice'}],
 diagnosis:[row('Only one person is quiet; other callers are clear','Inspect that person’s User Volume before overall volume.',1),row('All callers are quiet; games/videos sound normal','Inspect Discord output device/level, then Windows mixer.',2),row('Games and videos are quiet too','Inspect Windows output and headset controls.',3),row('Calls alone sound fine; games mask speech','Lower game audio and compare the same phrase.',4),row('User Volume is high and other listeners hear them quietly too','Ask the sender to compare microphone recording and input.',5),row('Only quiet words or sentence endings disappear','Ask about input sensitivity/processing instead of continually raising playback.',5)],
 steps:[
 step(1,'For one person, adjust their User Volume','This controls how you hear that caller, not their microphone or other listeners.',[
 'During a call, right-click the person’s name/avatar in the voice channel and inspect User Volume.',
 'Record the value and raise it gradually while they repeat the same sentence. Moving a reduced 50% toward 100% is an example, not an ideal value for everyone.',
 'If only that person becomes clear while other callers stay unchanged, stop at a comfortable level. Compare ordinary and slightly louder speech for distortion.',
 'If still quiet near the upper limit, ask another listener. If several listeners agree, use Step 5; if only you hear it quietly, use Step 2.',
 ],'Do not maximize every control at once. A sudden loud voice can be uncomfortable; reduce volume immediately if needed.'),
 step(2,'For everyone, inspect Discord output','Calls can sound distant if they play through a monitor while the game uses your headset.',[
 'Open User Settings → Voice & Video. If tabs are shown, choose Voice and inspect Output Device.',
 'Lower volume before switching, choose your actual headset/headphone name and confirm voices come from it.',
 'Record Output Volume and raise it gradually. Input Volume concerns your outgoing microphone and is not this adjustment.',
 'Ask at least two callers to compare if available. If all improve, stop; otherwise continue to the Windows mixer.',
 ]),
 step(3,'Inspect Windows mixer and headset controls','Keep the call active and distinguish Discord-only volume from whole-device volume.',[
 'On Windows 11 open Settings → System → Sound → Volume mixer. On Windows 10, right-click the taskbar speaker → Open Volume mixer.',
 'Inspect Discord’s mute and level and raise a reduced level gradually. If app-specific output selection appears, compare it with the intended device.',
 'If Discord is missing, ask the caller to speak and reopen the mixer. For browser Discord inspect the actual browser’s volume entry.',
 'If games/videos are also quiet, inspect Windows overall output and the headset’s own volume dial. Compare a short video and a call on the same device.',
 'If other headphones are already available, lower volume, switch both hardware and output selection, and compare. Improvement only with the replacement prioritizes the original device/connection.',
 ]),
 step(4,'For game-only difficulty, lower competing audio','Determine whether speech is inherently quiet or masked by music/effects.',[
 'Record and reduce the game’s master audio in its own settings. If unavailable, lower only that game in Windows Volume mixer.',
 'For example, compare a game level of 80 versus 40 in the same scene with the same caller’s phrase. These are illustrative values, not a recommendation or measured result.',
 'If speech becomes clear, gradually rebalance music/effects while preserving conversation. If unchanged, revisit Discord and Windows output.',
 'If the headset has a Game/Chat balance control, record its position and compare near the middle. Skip this for devices without that feature.',
 'If Bluetooth audio turns muffled when a call begins, separate that quality change from low volume and use the Bluetooth guide.',
 ]),
 step(5,'If several listeners agree, ask the sender to compare input','This prioritizes the source without proving the microphone is faulty.',[
 'Have another participant hear the same speaker if available. Only you being affected prioritizes your output; several listeners prioritizes their input. For a two-person call, use the recording comparison next.',
 'Ask the speaker to make a short Windows Sound Recorder recording (Voice Recorder on Windows 10), using the same mic, distance and normal voice as Discord.',
 'A quiet recording prioritizes microphone position/device gain and Windows input. An adequate recording prioritizes Discord’s selected input and Input Volume. Share the microphone-too-quiet guide for detailed steps.',
 'For missing endings only, inspect their sensitivity/processing with the speech-cutting-out guide. Raising your playback cannot reconstruct speech that was never transmitted.',
 'After their adjustment, lower your User Volume before comparing again. Aim for clear normal speech without distortion on a slightly louder phrase.',
 ]),
 ],
 avoid:['Do not raise every playback control to maximum or confuse your input with incoming voices.','Do not reinstall or reset everything before comparing one caller, everyone and game balance.'],
 cautions:['Record one/all callers, game-volume comparison, output device, user/Discord/Windows levels and other listeners’ results.','If another listener or headset is unavailable, mark that comparison untested and use the available recording/video comparisons.'],
 faqs:[{question:'What if someone is quiet even at 200%?',answer:'Ask whether others hear them quietly. For only you inspect output/mixer; for several listeners inspect the sender’s mic. Reduce the level if it mainly adds noise or distortion.'},{question:'Does User Volume change what everyone hears?',answer:'It changes your playback of that person. It does not change every listener’s volume or the sender’s microphone settings.'},{question:'Should I change Input Volume or Output Volume?',answer:'Incoming voices use your output. For just one caller, inspect User Volume first. Input Volume concerns your own outgoing voice.'},{question:'How can two people compare without another listener?',answer:'You compare a video and call on the same output; the speaker compares recording and Discord with the same mic. These observations narrow the next check without proving a cause.'}],
 sources:[source('205287897-How-do-I-adjust-the-volume-level-of-individual-users-in-my-server','Discord: per-user playback volume'),voice,{label:'Microsoft: app volume and output-device troubleshooting',url:'https://support.microsoft.com/en-us/windows/hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows'}],
 related:[link('cant-hear-voice','Cannot hear callers at all'),link('mic-volume-low','Your microphone is too quiet'),link('bluetooth-audio-problem','Bluetooth audio changes during calls'),link('voice-cutting-out','Words or sentence endings disappear')],
},
{
 ...base,slug:'voice-cutting-out',title:'Discord Speech Cuts Out: Sentence Endings and Game-Only Checks',shortTitle:'Speech or sentence endings cut out',
 description:'Compare Windows recording, Discord Mic Test and a real call using the same microphone. Separate sensitivity, Push-to-Talk release, processing and game/network conditions.',
 lead:'For Windows 11/10 desktop Discord when your words break up, beginnings/endings disappear or speech fails only during games.',
 summary:'If Windows recording also cuts out, inspect the microphone/Windows path. If recording works but Discord’s test loses words, inspect input mode and processing. If the test works but calls fail, compare listeners, connection and game load. Voice Activity sensitivity and Push-to-Talk release need different checks.',
 quickFacts:[{label:'Use one repeated phrase',value:'For example: “Today I am checking how my voice sounds”'},{label:'Keep the same input',value:'Same mic, speaking level and mouth-to-mic distance'},{label:'Finish with a real call',value:'Stop Mic Test before asking a caller to listen'}],
 diagnosis:[row('Words disappear in Windows recording too','Compare connection, another port and an available second microphone.',2),row('Recording works; Voice Activity loses quiet endings','Compare the input-sensitivity threshold.',3),row('Recording works; Discord loses irregular parts of speech','Compare one noise-processing setting.',4),row('Push-to-Talk loses endings when the key is released','Hold through the ending, then compare release delay.',3),row('Recording/test work; calls or games alone cut out','Compare one listener versus everyone, then network/load.',5)],
 steps:[
 step(1,'Compare recording, Mic Test and a call','This guide concerns your outgoing speech; align the input device before judging results.',[
 'Inspect Windows Settings → System → Sound → Input and choose that same named mic under Discord Voice & Video.',
 'Open Sound Recorder from Start (Voice Recorder on Windows 10), confirm its mic and record the example phrase three times at your normal speaking level.',
 'Stop and play the recording. Check its first and final words. If they disappear here, use Step 2.',
 'Start Discord Mic Test in Voice & Video’s voice controls, repeat the same phrase at the same distance, then Stop Testing.',
 'Repeat it in a real call and ask which words disappear. Record each result separately: normal, endings only or intermittent throughout.',
 ],'Discord automatically mutes/deafens you in the call during Mic Test. End the test before judging what a caller hears.'),
 step(2,'For broken recordings, inspect input and connection','A recording failure is not limited to Discord; compare the device, Windows path and load.',[
 'For a USB mic, compare a direct PC port without the hub. For a headset, inspect a loose connector and physical mute.',
 'Confirm the input name again and make a new recording of the same phrase. If it improves, compare the Discord call on that connection.',
 'If another mic is available, repeat the recording. Only the original failing prioritizes its device/connection/software; both failing prioritizes shared Windows/load conditions.',
 'Inspect the device manufacturer’s update guidance. If closing a game/recorder makes recording work, use Step 5’s load comparison.',
 ]),
 step(3,'For missing endings, use the correct input-mode control','Voice Activity uses a threshold; Push-to-Talk transmits while its key is held.',[
 'For Voice Activity, record the original settings and disable Automatically determine input sensitivity to expose manual adjustment.',
 'Compare background sound while silent with softly spoken sentence endings. Place the threshold so silence does not transmit but quiet speech does.',
 'Move toward lower sound levels in small increments if endings are lost. Where dB values appear, −50 to −60 dB admits quieter sounds; these are directional examples, not a universal setting.',
 'For Push-to-Talk, hold the key from before speaking through the final word. If audio stops only immediately after release, slightly increase Push to Talk Release Delay and compare.',
 'After each change, repeat the phrase in the call. If endings return but room sound transmits continuously, restore/raise the threshold and compare a closer microphone position.',
 ],'Sensitivity controls transmission, not overall loudness. For uniformly quiet speech use the microphone-volume guide instead.'),
 step(4,'For Discord-only gaps, compare processing','Change only one processing control so you can identify its effect.',[
 'Under Voice & Video’s voice settings, record Noise Suppression and temporarily turn it off.',
 'Repeat the phrase in Mic Test, stop the test and ask the caller to listen. If improved, verify a longer conversation with only that change.',
 'If unchanged, restore suppression. If Echo Cancellation or Automatic Gain Control is offered, compare each separately in the same way.',
 'If voice-processing software supplies a virtual input, compare the physical microphone directly in Discord. Success there prioritizes that software’s processing path.',
 ],'Use headphones when comparing Echo Cancellation off and restore it if the caller hears feedback/echo.'),
 step(5,'For call/game-only gaps, compare listener and load','Mic Test does not test the entire internet call or another person’s reception.',[
 'Ask another willing participant to hear the same phrase if possible. If only one listener hears gaps, ask them to compare rejoining, restarting Discord and another permitted connection.',
 'If everyone hears gaps, pause your downloads/cloud sync and compare. If available, compare wired networking or another permitted connection separately, accounting for data limits.',
 'For game-only failure, compare a call with the game closed and running. Ctrl+Shift+Esc → Performance helps inspect sustained CPU activity during the game.',
 'Save work and close an unneeded recorder/app one at a time. Judge whether speech also improves; CPU percentage alone does not establish the cause.',
 'If only game-focused Push-to-Talk fails, inspect key conflicts and use the System Helper guide’s conditional checks. If you leave the voice channel entirely, use the call-disconnection guide.',
 ]),
 ],
 avoid:['Do not treat input sensitivity as a loudness booster or use one dB value for every microphone.','Do not compare a live caller while Mic Test is active or disable several processors at once.'],
 cautions:['Record recording/test/call results, missing words, input mode, mic, game state and each change. A single normal recording does not rule out intermittent connection trouble.','Before an optional Reset Voice and Video Settings, record input/output devices, levels and keybinds. Reselect them afterward and repeat the same phrase; this is a later comparison, not a required first step.'],
 faqs:[{question:'What dB sensitivity should I use?',answer:'There is no common ideal for every mic. Silence should not transmit while your quiet speech does. Too low a threshold can continuously send keyboard/room sound.'},{question:'Why does Mic Test work while a call cuts out?',answer:'It does not verify the full path to listeners. Compare another participant: everyone affected prioritizes your shared path, one affected listener also needs reception/load checks.'},{question:'Should Push-to-Talk lower the Voice Activity threshold?',answer:'First check how long the key is held. Hold through the ending and compare release delay when audio stops just after release; this differs from Voice Activity sensitivity.'},{question:'Does one normal recording rule out a faulty microphone?',answer:'No. Repeat under the actual connection, distance and game conditions that produce the problem; another port/mic can help narrow intermittent issues.'}],
 sources:[voice,source('360020641332-Mic-Testing','Discord: Mic Test and temporary call mute/deafen'),source('211376518-Voice-Input-Modes-101-Push-to-Talk-Voice-Activated','Discord: Voice Activity, sensitivity and Push-to-Talk release delay'),{label:'Microsoft: Windows Sound Recorder',url:'https://support.microsoft.com/en-us/windows/apps/sound-recorder-app-for-windows-faq'}],
 related:[link('mic-volume-low','Microphone is too quiet'),link('mic-not-working','Microphone has no input'),link('call-disconnects','Calls disconnect'),link('system-helper','Game-focused keybinds and System Helper')],
},
];
