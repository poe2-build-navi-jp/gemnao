import type { LocalizedPcArticle } from './pc-repair-articles';
const ms=(path:string,title:string)=>({title:`Microsoft: ${title}`,url:`https://support.microsoft.com/en-us/windows/${path}`});
const mixer=ms('hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows','app volume and output settings');
const le=ms('hardware/bluetooth/configuring-bluetooth-le-audio-quality-settings-on-windows-11','Bluetooth LE Audio quality while using a microphone');
const row=(symptom:string,check:string,next:number)=>({symptom,check,next});
const step=(title:string,actions:string[],expected:string,unexpected:string,revert:string)=>({title,actions,expected,unexpected,revert});
const base={locale:'en' as const,checkedAt:'2026-10-18',sourcePolicy:'English adaptation of the Japanese guide, preserving its diagnostic branches, steps, results, undo instructions and official sources. Source instructions were reviewed; these comparisons are not claims of successful testing on every device. Menu availability depends on Windows, drivers and hardware. On a managed PC, ask the administrator before changing restricted settings.'};
export const pcAudioEn: LocalizedPcArticle[]=[
{
 ...base,slug:'microphone-after-update',title:'Microphone Not Working After Windows Update: Windows 11 Checks',shortTitle:'Microphone fails after an update',seoTitle:'Microphone not working after Windows Update | Windows 11',
 description:'Compare the Windows input list, a recorded sample and app permissions after an update. Check device errors and supported drivers with clear ways to undo changes.',
 lead:'For Windows 11 when calls no longer pick up your voice after an update, or the microphone disappears from the input list. Separate an app-only failure from a microphone Windows cannot detect.',
 answer:'Select the intended microphone under Settings → System → Sound → Input and play a recorded test. If Windows records your voice but the calling app cannot, inspect microphone permissions and the app’s input selection. If the device is missing, check its connection and Device Manager before reinstalling apps.',
 quickChecks:['Use the same named microphone for a short Windows recording test.','If the recording works, inspect app access and the app’s selected input.','If the device is missing, inspect the connection and its Device Manager status.'],
 diagnosis:[row('The microphone is absent from Input','Check its hardware switch, USB connection, another port and Device Manager warnings.',3),row('It appears in Input but the test is silent','Check the selected name, hardware mute and input level.',1),row('Windows records correctly; only the calling app is silent','Compare app permissions and the app’s named input.',2),row('Every app stopped recording after the update','Record when the update happened and inspect device status and driver changes.',3)],
 steps:[
 step('Test the microphone in Windows',[
 'Release the microphone’s hardware mute. Open Start → Settings → System → Sound → Input and select the microphone by name.',
 'Open its properties using the arrow beside the device. Choose Start test, speak a short phrase, then Stop test and Play. Keep the same distance and phrase for comparisons.',
 'If the sample is merely quiet, record the current Input volume and raise it a little before repeating the recording.',
 ],'A clear recorded sample shows that Windows input is working for this test. Continue to the app in Step 2.','If the sample is silent or the microphone is absent, use Step 3 before reinstalling another calling app.','Restore the recorded input level and the previous microphone selection if you changed it only for this comparison.'),
 step('Check access and input selection for the calling app',[
 'Open Start → Settings → Privacy & security → Microphone. Inspect Microphone access and Let apps access your microphone. Record the current settings before changing them.',
 'For a desktop app, inspect Let desktop apps access your microphone. This is a shared permission, not an individual desktop-app switch; desktop apps do not appear in the per-app list. For listed Microsoft Store apps, allow only the app you intend to use. Do not bypass an administrator-controlled setting.',
 'In the calling app’s audio settings, select the same microphone that passed Step 1. Compare its test first, then a real call with the other person’s agreement.',
 ],'Both Windows playback and the app test contain your voice. Ask the caller to confirm a short phrase in the call.','If only the app test fails, inspect its own mute and input choice. If Windows now fails too, continue to Step 3.','Restore permissions changed only for testing; doing so can stop those apps using the microphone again. Keep needed access only with awareness of the desktop-app switch’s shared scope.'),
 step('Inspect missing devices and error messages',[
 'For USB, compare a direct PC connection without the hub and another port. For Bluetooth, inspect connection status under Settings → Bluetooth & devices.',
 'Search Start for Device Manager. Look under Audio inputs and outputs and Sound, video and game controllers. For a warning, open that device’s Properties → General and record Device status, including any code.',
 'For a warning or a change immediately after an update, check the PC or microphone maker’s supported driver. Driver → Roll Back Driver is available only when a previous driver is retained; do not force another model’s driver. Ask your administrator on a managed PC.',
 ],'If another port or microphone records successfully, focus the investigation on the original device, cable or port.','If another microphone also fails or a status code appears, record it and consult Microsoft’s code guide or the PC manufacturer.','Return test cables and ports to their previous connections. After a driver rollback, restart and retest; if it causes problems, ask the manufacturer about reinstalling a compatible supported version.'),
 ],
 escalation:'Record the update time, the name shown in Windows Input, recorded playback result, app test result and Device status code. Do not grant unrelated permissions or install drivers from an unknown source. An update occurring before the problem does not by itself prove which component failed.',
 faqs:[{question:'Will changing Discord settings fix it?',answer:'If Windows records correctly and only Discord fails, inspect Discord’s input and mute. If the Windows recording is silent too, investigate Windows input and the device first.'},{question:'Why is Roll Back Driver unavailable?',answer:'Windows needs a retained previous driver for that device. If it is unavailable, do not substitute an unrelated driver. Check the PC or microphone maker’s supported version.'}],
 sources:[ms('hardware/drivers/how-to-set-up-and-test-microphones-in-windows','setting up and testing microphones'),ms('privacy/turn-on-app-permissions-for-your-microphone-in-windows','microphone app permissions'),ms('hardware/drivers/fix-microphone-problems','microphone troubleshooting'),ms('hardware/drivers/error-codes-in-device-manager-in-windows','Device Manager error codes')],
 related:[{href:'/en/discord/mic-not-working',label:'Only Discord cannot use the microphone'},{href:'/pc/audio-after-update',label:'No sound after a Windows update (Japanese)'}],
},
{
 ...base,slug:'call-starts-audio-disappears',title:'Game Audio Goes Quiet or Disappears When a Call Starts on Windows 11',shortTitle:'Game audio changes when a call starts',seoTitle:'Game audio disappears when a call starts | Windows 11',
 description:'Compare Windows Communications volume reduction, app output changes and Bluetooth microphone behavior. Keep the same audio sample and restore each setting after testing.',
 lead:'For Windows when joining Teams, Discord or another call changes another app’s volume or sound quality. This is separate from being unable to hear the other caller.',
 answer:'If other audio becomes quieter during calls even with wired headphones, compare the Windows Communications setting with Do nothing. If audio moves to another device, inspect output selection. If only a Bluetooth headset changes quality, compare what happens when its microphone is used.',
 quickChecks:['Play a short clip before joining and record whether volume, quality or output changes.','For quieter audio even over a wire, compare More sound settings → Communications.','For Bluetooth-only changes, compare with the PC’s built-in microphone as the call input.'],
 diagnosis:[row('Game volume drops during calls even with wired audio','Inspect Windows automatic volume reduction for communications.',1),row('Game sound disappears while the caller uses another output','Compare Windows, game and calling-app output devices before and after joining.',2),row('Only Bluetooth sounds worse or goes silent','Compare a separate microphone while retaining the same headset output.',3),row('All audio is silent outside calls too','Inspect output and volume; this is not specifically a call-start change.',2)],
 steps:[
 step('Compare the Windows Communications setting',[
 'Before the call, play a repeatable game scene or short video. Note the volume and Windows output device name; start at a comfortable listening level.',
 'Open Start → Settings → System → Sound → More sound settings → Communications. Record the current option, such as reducing other sounds by 80%.',
 'Select Do nothing → Apply → OK. With the same clip playing, join the call and compare. Any attenuation setting inside the calling app is a separate control.',
 ],'If the other audio no longer drops, Windows communications volume adjustment may have contributed.','If there is no change, inspect the app’s own attenuation and compare output selection in Step 2.','Restore your recorded Communications option and Apply. You can retain automatic reduction if you prefer quieter background audio during calls.'),
 step('Compare game and call output devices',[
 'Before joining, note the selected device under Settings → System → Sound → Output.',
 'Join the call and inspect Output again. While the game is producing sound, open Volume mixer and inspect the game and calling app separately: mute, level and output. An inactive app may not appear.',
 'If only the game is muted or assigned elsewhere, select its intended output and compare the same scene. Lower volume before switching devices.',
 ],'If both game and call play through the intended output, a device assignment mismatch is a possible explanation.','If the same output changes quality only over Bluetooth, use Step 3. If all apps are silent, inspect the output device itself rather than assuming the calling app is broken.','Restore the recorded per-app output choices and levels. Restart the app to check which selection it retains.'),
 step('Separate Bluetooth microphone behavior',[
 'Keep the Bluetooth headset as output, but select the PC’s built-in or another available microphone as the call input. Compare the same clip before and during the call.',
 'If the separate microphone preserves playback, headset microphone use may be changing the audio mode. On compatible Windows 11 LE Audio systems only, inspect the headset’s Output properties → Output settings → Format → Format when microphone is active. Its availability depends on supported Windows, hardware and manufacturer drivers.',
 'If that supported system glitches in Stereo, record the selection and compare Mono. If the option is absent, do not force it: compare a separate input microphone or a wired headset.',
 ],'If a separate microphone restores the game audio, prioritize the headset’s behavior while its microphone is active.','If audio still disappears with another microphone, use the results from Steps 1 and 2 to check app-specific attenuation.','Restore the calling app’s previous input and any audio format you changed.'),
 ],
 escalation:'Record wired versus Bluetooth use, output names before and during the call, the original Communications option and comparison result, and each app’s mixer level. Bluetooth features and available settings vary by Windows version, headset, PC and drivers; a missing option is not proof of a fault.',
 faqs:[{question:'Does a large volume drop during a call mean hardware failure?',answer:'Windows and calling apps can deliberately lower other sounds. Compare the same clip before and after changing the Communications option; an improvement is evidence about that setting, not proof about every component.'},{question:'Why is the Bluetooth stereo option missing?',answer:'Stereo while the microphone is active requires a supported Windows 11 LE Audio setup, headset and manufacturer drivers. Use a separate input microphone to compare playback rather than looking for an unsupported switch.'}],
 sources:[le,{title:'Microsoft: Windows Communications setting for lower sound during Teams meetings',url:'https://support.microsoft.com/en-us/teams/meetings/share-sound-from-your-computer-in-microsoft-teams-meetings-or-live-events'},mixer],
 related:[{href:'/en/discord/game-volume-lowers',label:'Discord lowers game volume during calls'},{href:'/en/pc/bluetooth-connected-no-sound',label:'Bluetooth connected but no sound'}],
},
{
 ...base,slug:'bluetooth-connected-no-sound',title:'Bluetooth Headphones Connected but No Sound on Windows 11',shortTitle:'Bluetooth connected but silent',seoTitle:'Bluetooth connected but no sound | Windows 11',
 description:'Separate Bluetooth connection status from Windows output selection. Compare system playback, app mixer and reconnection, with pairing precautions and undo instructions.',
 lead:'Windows can report Connected while sound still plays through PC speakers. A drop in quality only after joining a call needs a different comparison from complete silence.',
 answer:'Check battery and headset volume, then explicitly select the headset under Settings → System → Sound → Output. If Windows playback works but one app is silent, inspect Volume mixer. Consider reconnection or pairing again only when the output device is missing or its connection is unstable.',
 quickChecks:['Compare the same short sound through PC speakers and headphones.','Select the named headphones in Windows Sound → Output.','If Windows playback works but one app is silent, inspect that app in Volume mixer.'],
 diagnosis:[row('Connected, but sound still comes from PC speakers','Select the headphones under Sound → Output.',1),row('The headset plays a test sound, but the game is silent','Inspect game mute, Volume mixer and app output.',2),row('Headphones disappear from Output or disconnect','Check battery, another connected device and Bluetooth settings.',3),row('Quality drops only when a call starts','Compare behavior while the headset microphone is active.',3)],
 steps:[
 step('Check connection and playback destination separately',[
 'Charge the headphones and inspect their own mute and volume. Check Settings → Bluetooth & devices → Devices for connection status.',
 'Open Start → Settings → System → Sound → Output and choose the headphones by name. At a low, comfortable level, alternate with PC speakers and play the same short sound; note where it actually plays.',
 'If selecting the headphones is still silent, inspect volume and output properties. Check whether they have automatically connected to a nearby phone instead.',
 ],'Selecting headphones plays through them, while selecting speakers plays through the speakers.','If system playback works but one app is silent, use Step 2. If the headphones are absent from Output, use Step 3.','Select the previous output device again and restore the previous volume.'),
 step('Inspect Volume mixer for an app-only failure',[
 'Keep the game or video producing audio while opening Settings → System → Sound → Volume mixer.',
 'Find the app and inspect mute, level and output. If assigned elsewhere, select the headphones and repeat the sound. If the app is missing, start its audio and check again.',
 'If the game has an output selector, compare its named device with Windows. Save your game before restarting it after a selection change, then compare audio.',
 ],'If only the affected app starts playing through the headset, its mute or output assignment may have contributed.','If every app is silent, continue to Step 3. If the problem returns only after an app restart, inspect the output setting it retains.','Restore the app’s recorded volume and output selection.'),
 step('Reconnect when the output device is missing',[
 'Under Settings → Bluetooth & devices, turn Bluetooth off, wait 10 seconds, then turn it on. Power-cycle the headphones and reconnect. This also disconnects Bluetooth keyboards and mice temporarily; have another way to control the PC first.',
 'If the headphones still do not appear in Output, confirm you can put them into pairing mode and re-enter any required pairing information. Under Bluetooth & devices → Devices, remove only those headphones using … → Remove device, then use Add device to pair again.',
 'If only this PC fails, check its manufacturer’s supported Bluetooth adapter driver. If quality changes only when a call begins, use the related call-start audio guide instead of repeatedly deleting pairing information.',
 ],'After reconnection, the headphones appear in Output and play the same sound.','If another device is silent too, inspect the headset, battery and manufacturer guidance. If only this PC fails to recognize it, investigate the PC’s Bluetooth support.','Return Bluetooth to its previous on state. A removed pairing is not restored automatically: use Add device and the headset’s pairing procedure to register it again.'),
 ],
 escalation:'Record the headphone name, connection status, whether it appears in Windows Output, whether PC speakers work and whether another device can play through it. If pairing again does not help, pass these results to the headset or PC manufacturer instead of repeatedly resetting unrelated devices.',
 faqs:[{question:'Why do speakers play even though the headphones say Connected?',answer:'The Bluetooth connection and audio destination are separate settings. Select the headset in Windows Sound and check the individual app’s output too.'},{question:'What if only call audio quality gets worse?',answer:'Some systems change playback mode when the headset microphone is used. Separate quality loss from silence and compare a different input microphone while keeping the same headset output.'}],
 sources:[ms('hardware/bluetooth/fix-bluetooth-connected-but-no-sound-issue-on-windows','Bluetooth connected but silent'),mixer,le],
 related:[{href:'/en/pc/call-starts-audio-disappears',label:'Game audio changes when a call starts'},{href:'/en/discord/bluetooth-audio-problem',label:'Bluetooth quality during Discord calls'},{href:'/pc/bluetooth-option-missing',label:'Bluetooth switch or adapter missing (Japanese)'}],
},
];
