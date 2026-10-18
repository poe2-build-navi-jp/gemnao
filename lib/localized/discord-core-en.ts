import type { LocalizedArticle } from './types';
const discord = (id: string) =>
  `https://support.discord.com/hc/en-us/articles/${id}`;
const support = discord(
  '360045138471-Discord-Voice-and-Video-Troubleshooting-Guide',
);
const stream = discord('360040816151-Go-Live-and-Screen-Share');
const related = (slug: string, label: string) => ({
  href: `/en/discord/${slug}`,
  label,
});
const base = {
  locale: 'en' as const,
  gameSlug: 'discord',
  gameName: 'Discord',
  checkedAt: '2026-10-18',
  sourcePolicy:
    'English adaptation of the Japanese troubleshooting guide, checked against official Discord and Microsoft documentation. Comparisons are editorial guidance, not a guaranteed fix or a measured success rate. Settings can vary by client version. Keep security protection enabled and respect channel restrictions.',
};
const step = (
  n: number,
  title: string,
  summary: string,
  actions: string[],
  note?: string,
) => ({
  id: `cause-${n}`,
  title,
  summary,
  time: 'A few minutes; compare one change',
  actions,
  ...(note ? { note } : {}),
});
const row = (symptom: string, cause: string, n: number) => ({
  symptom,
  cause,
  stepId: `cause-${n}`,
});
export const discordCoreEn: LocalizedArticle[] = [
  {
    ...base,
    slug: 'mic-not-working',
    title:
      'Discord Microphone Not Working: Windows Test, Input Mode and Call Checks',
    shortTitle: 'Microphone not working',
    description:
      'Find where Discord microphone audio stops: Windows input, Discord’s test, input mode or one channel/viewer. Compare the same device safely before resetting voice settings.',
    lead: 'For the Windows desktop app, with a browser comparison if needed. First establish whether Windows receives the microphone, then whether Discord plays it back, and finally whether a real caller hears it.',
    summary:
      'Test the same microphone in Windows and Discord. Stop Discord’s mic test before assessing a call: testing mutes and deafens the call. If testing works, check input mode and the affected callers or channels before resetting settings.',
    quickFacts: [
      {
        label: 'First comparison',
        value: 'Same microphone in Windows and Discord',
      },
      {
        label: 'Before a call test',
        value:
          'Stop the microphone test; it temporarily mutes/deafens the call',
      },
      {
        label: 'One channel only',
        value:
          'Ask its administrator about server mute and effective Speak permission',
      },
    ],
    diagnosis: [
      row(
        'No device or no input in Windows',
        'Check connection, physical mute and the selected input; compare a port/device.',
        1,
      ),
      row(
        'Windows receives sound but Discord does not',
        'Match desktop-app access and Discord’s named input.',
        2,
      ),
      row(
        'Discord’s indicator moves but playback is silent',
        'Check the output device too; do not infer microphone failure.',
        2,
      ),
      row(
        'Playback works but callers cannot hear',
        'Stop testing, then check mute and input mode.',
        3,
      ),
      row(
        'Quiet words or sentence endings disappear',
        'Compare silence and quiet speech at the sensitivity threshold.',
        3,
      ),
      row(
        'A DM works but one server channel does not',
        'Ask about server mute and effective Speak permission.',
        4,
      ),
      row(
        'Only one person cannot hear you',
        'Compare another listener, then their individual mute/volume.',
        4,
      ),
      row(
        'Push to Talk fails only while gaming',
        'Compare the same key with Discord focused; check conflicting bindings.',
        3,
      ),
    ],
    steps: [
      step(
        1,
        'Check whether Windows receives the same microphone',
        'Start outside Discord so you know which layer needs attention.',
        [
          'Check the headset’s physical mute and detachable microphone connection. Reconnect an external USB/audio plug safely, and confirm which microphone you intend to use. Do not change several devices at once.',
          'In Windows 11, open Settings → System → Sound → Input and select that microphone. Use its microphone test, speak a short harmless sentence and stop. Listen to a sample if your version offers playback.',
          'On Windows 10, select the input under Settings → System → Sound and observe the microphone test indicator while speaking. Keep the selected device name in your record.',
          'If input reacts, continue to STEP 2. Otherwise check input volume and compare a direct USB connection rather than a hub, another port, or another available microphone. Keep the comparison narrow.',
          'If the device is absent, follow the PC or microphone maker’s detection guidance. If another microphone works, investigate the original connection/device; if neither works, also check access settings in STEP 2. Record the result instead of assuming hardware failure.',
        ],
        'No Windows input can reflect selection, mute, access or connection. For Bluetooth-only failures, a wired/USB comparison can help without proving the cause.',
      ),
      step(
        2,
        'Match microphone access, input and playback output',
        'A silent test can also be an output problem.',
        [
          'Open Windows 11 Settings → Privacy & security → Microphone; on Windows 10 use Settings → Privacy → Microphone. On a managed PC, ask the administrator if access is restricted.',
          'For a microphone you intend Discord to use, check Microphone access and the desktop-app access setting. Desktop Discord may not have an individual toggle in the app list. Browser use also needs permission for the actual Discord website.',
          'Open Discord User Settings using the cogwheel, then Voice & Video and its voice controls. Choose the microphone that reacted in Windows by name instead of relying on Default. Check that input volume is not zero.',
          'Select your current headphones as the output device. Start the Mic Test, say the same short sentence and check whether you hear the playback. Do not use private conversations as test material.',
          'If input reacts but playback is silent, check headphones and output volume. If playback works, stop the test and continue to STEP 3. If only Windows works, fully exit/reopen Discord after the settings change and repeat once.',
        ],
        'Discord’s official mic-test guide says a test during a call automatically mutes and deafens you. Stop it before asking a caller whether your voice is arriving.',
      ),
      step(
        3,
        'Check mute, input mode and the speech threshold',
        'Voice Activity and Push to Talk determine when audio is transmitted; sensitivity is not voice loudness.',
        [
          'Stop Mic Test and return to the call. Check your microphone/headphone icons and remove only a mute/deafen state you set yourself. A server-imposed restriction requires the administrator.',
          'Check Input Mode in Voice & Video. For Push to Talk, hold the assigned key while speaking. If others hear you only while holding it, that is expected behavior.',
          'If you want transmission without a key, choose Voice Activity. If automatic sensitivity cuts off quiet speech, record the current setting before comparing a manual threshold.',
          'Compare the level in silence with quiet speech. Adjust the threshold so room noise does not trigger transmission but quiet words do. Use the actual indicator, not a universal numeric recommendation.',
          'For illustration, noise around −60 dB and quiet speech around −40 dB might justify comparing a threshold between them. These are example values only. Ask a willing caller whether sentence endings arrive; readjust if background sound is continuously sent.',
          'If the key works only when Discord is focused, compare key conflicts with game controls. Record whether this occurs only in an elevated game; consult the relevant official guidance rather than making administrator launch a default fix.',
        ],
        'A sensitivity threshold does not increase the microphone’s actual loudness. Keep “too quiet”, “cutting out” and “no audio” separate in the support record.',
      ),
      step(
        4,
        'Locate a channel or listener-specific restriction',
        'Keep your working input settings while comparing the destination.',
        [
          'With a willing contact and an authorized test location, compare the same short sentence in a DM call and the affected server voice channel. Do not use another destination to bypass a restriction.',
          'If the DM works but the channel does not, ask an administrator to check server mute and the effective Speak permission. Joining a voice channel does not guarantee permission to speak there.',
          'If just one listener cannot hear you, compare another willing listener. Ask the affected person to check their individual mute and volume for your user, as well as their playback device.',
          'If nobody hears you and the call is stuck connecting or disconnects, record that connection state. Repeated sensitivity changes are not a repair for an unresolved connection failure; use official connection support.',
        ],
      ),
      step(
        5,
        'Compare the browser before a documented settings reset',
        'Record settings so an unhelpful reset does not erase your troubleshooting history.',
        [
          'End the desktop call. Open discord.com/app in a supported browser and use the same input, allowing microphone access only for the intended site. Repeat the local test and, with consent, the short call.',
          'If only the browser works, record desktop input/output devices, input mode, sensitivity and key assignments before changing them. Do not post private screenshots publicly.',
          'Restart the desktop app to apply available updates. If it still fails, consider the documented Reset Voice and Video Settings control under the Debugging tab of Voice & Video. Placement can vary; do not reset unrelated account settings.',
          'Reselect the intended microphone and output afterward. Test, stop the test, then compare the actual call. If unchanged, restore your recorded preferences and send official support the Windows/test/DM/channel/browser results without raw voice recordings.',
        ],
      ),
    ],
    avoid: [
      'Do not disable antivirus or firewall protection to diagnose microphone input.',
      'Do not bypass server mute/permissions or turn on administrator mode for every call.',
      'Do not send private voice recordings as routine test evidence.',
    ],
    cautions: [
      'Keep volume comfortable during playback tests.',
      'If Windows itself receives no input, use PC/device support; a Discord-only failure belongs with Discord support.',
    ],
    faqs: [
      {
        question: 'Mic Test works, but callers still cannot hear me. Why?',
        answer:
          'Stop Mic Test first: it mutes/deafens the call. Then check input mode and mute, and compare the affected channel or listener.',
      },
      {
        question: 'Does a green indicator prove everyone hears me?',
        answer:
          'No. It does not verify another person’s output, user volume or listening state. Ask a willing caller whether they heard the actual sentence.',
      },
      {
        question:
          'Why is Discord absent from Windows’ app-by-app microphone list?',
        answer:
          'Desktop apps may use the desktop-app access setting rather than an individual toggle. Browser Discord also needs site-level microphone permission.',
      },
      {
        question: 'What sensitivity value should everyone use?',
        answer:
          'There is no single value. Compare your quiet speech with room noise. Sensitivity changes the transmission threshold, not the microphone’s inherent loudness.',
      },
    ],
    sources: [
      { label: 'Discord: voice and video troubleshooting', url: support },
      {
        label: 'Discord: Mic Testing and call mute behavior',
        url: discord('360020641332-Mic-Testing'),
      },
      {
        label: 'Discord: Voice Activity and Push to Talk',
        url: discord(
          '211376518-Voice-Input-Modes-101-Push-to-Talk-Voice-Activated',
        ),
      },
      {
        label: 'Microsoft: microphone input and access',
        url: 'https://support.microsoft.com/en-us/windows/hardware/drivers/fix-microphone-problems',
      },
    ],
    related: [
      related(
        'stream-no-audio',
        'Voice works but shared game audio is missing',
      ),
      { href: '/en/discord', label: 'All English Discord guides' },
    ],
  },
  {
    ...base,
    slug: 'stream-no-audio',
    title:
      'Discord Stream Has No Audio: Broadcaster, Share Target and Viewer Checks',
    shortTitle: 'Screen share has no game audio',
    description:
      'Separate missing local game sound, audio capture and one viewer’s muted stream. Compare an app window and full screen safely without assuming microphone audio proves game-audio sharing.',
    lead: 'For Discord screen sharing, primarily on Windows desktop. Voice-call audio and shared application sound are different paths. Start with who cannot hear the game: the broadcaster, every viewer, or only one viewer.',
    summary:
      'If the broadcaster cannot hear the game, fix its local output first. If every viewer is silent, compare the correct game window and the screen-sharing method. If one viewer alone is affected, check that stream’s mute/volume and their output. Do not reset the microphone to fix an unrelated capture problem.',
    quickFacts: [
      {
        label: 'Voice versus stream',
        value:
          'A working microphone does not prove application audio is captured',
      },
      {
        label: 'Privacy before testing',
        value:
          'Use consenting viewers and harmless content; whole-screen sharing can expose notifications',
      },
      {
        label: 'Client support',
        value:
          'Check Discord’s current audio-sharing support for the client you use',
      },
    ],
    diagnosis: [
      row(
        'The broadcaster also cannot hear the game',
        'Check the game’s Windows mixer and output first.',
        1,
      ),
      row(
        'The broadcaster hears it but all viewers are silent',
        'Compare the selected application and whole-screen capture.',
        2,
      ),
      row(
        'Only one viewer has no game audio',
        'Check that viewer’s stream mute/volume and output.',
        3,
      ),
      row(
        'There is no Share audio option',
        'Do not chase a missing toggle; check client support and target.',
        2,
      ),
      row(
        'Other apps share sound, but one game does not',
        'Check the game’s own output and actual selected window.',
        4,
      ),
    ],
    steps: [
      step(
        1,
        'Confirm sound on the broadcaster’s PC',
        'Make local game audio work before investigating sharing.',
        [
          'Play a known audible scene at a comfortable level and confirm the broadcaster hears it through the intended headphones or speakers. Keep microphone voice separate from this observation.',
          'On Windows 11, open Settings → System → Sound → Volume mixer while the game is producing sound.',
          'Find the game under Apps, check its mute and volume, and look again while audio is playing if it is absent. Do not increase every system/application slider together.',
          'Confirm the game’s output is the device actually being used. Once local audio works, compare the same scene with a willing viewer. If everyone remains silent, continue to STEP 2.',
        ],
        'Local playback establishes that the game produces sound; it does not prove Discord captures that sound.',
      ),
      step(
        2,
        'Compare the correct game window and sharing method',
        'Change the selected capture target while keeping game and listener fixed.',
        [
          'Leave the game running but stop the stream before choosing a new target. Close private windows and suppress sensitive notifications before any whole-screen comparison; use a private, permitted test call.',
          'From the screen-sharing selector, choose the game’s application window if offered and start sharing. Ask the same viewer whether the same scene is audible. Confirm you selected the game rather than its launcher.',
          'If still silent and sharing the desktop is safe, stop and compare the screen containing the same game. Whole-screen sharing is not universally silent. Use the method that works only when its privacy exposure is acceptable.',
          'If the start dialog presents an audio-sharing option, check it. If it is absent, do not keep searching for a control your client may not provide; record the client and selected target for support.',
        ],
        'Discord’s current guide lists Windows/macOS desktop, Chrome and mobile for audio capture; other browsers and Linux do not support application-audio sharing there. Support can change, so check the linked guide for your client.',
      ),
      step(
        3,
        'Check an affected viewer’s stream volume and output',
        'Joining a voice channel alone is not the same as opening its live stream.',
        [
          'Have the viewer open the broadcaster’s actual stream and confirm the video is moving. Compare another willing viewer of the same stream if available.',
          'In the stream’s viewing controls or context menu, check mute and stream volume. Adjust gradually rather than jumping to maximum. The stream’s volume is separate from someone’s microphone volume.',
          'If still silent, check the viewer’s Discord output device under User Settings → Voice & Video. Confirm they are listening to that device.',
          'On the viewer’s Windows PC, check Discord’s entry in the Volume mixer too. Reopen the same stream and compare. If all viewers remain affected, return to capture/source checks instead of changing every viewer’s settings.',
        ],
        'A problem affecting one viewer suggests a different comparison from audio missing for everyone; it is not proof of one specific fault.',
      ),
      step(
        4,
        'Compare the particular game with a harmless control app',
        'Use the same viewer and output to isolate a game-specific difference.',
        [
          'Check the game’s master volume and output setting, then replay a known audible scene. Record any recent change without resetting the whole game configuration.',
          'Check that game’s Windows mixer entry for a separate mute or output route. Keep other audio applications unchanged during the comparison.',
          'Confirm the shared window belongs to the process producing the game sound, rather than an external launcher. Stop sharing before changing the target and review the destination before restarting.',
          'With permission, compare a harmless non-private audio source in another application for the same viewer. Record “control audible/game silent” or “both silent”. Restart Discord normally and reselect the running game if needed; if unchanged, give support the client, target, game and affected-viewer pattern.',
        ],
      ),
    ],
    avoid: [
      'Do not share the entire desktop before removing private windows and notifications.',
      'Do not turn off security software, change server permissions yourself or install unofficial capture tools as a default fix.',
    ],
    cautions: [
      'Use only content you are allowed to share and a permitted private test destination.',
      'A missing capture option is not proof the game or microphone is broken; client support and target matter.',
    ],
    faqs: [
      {
        question: 'I cannot find Share audio. What should I change?',
        answer:
          'Check the client and target rather than assuming every version has that toggle. On a supported Windows desktop setup, compare the running game window with a privacy-safe screen share.',
      },
      {
        question: 'My voice works. Why is the game silent?',
        answer:
          'Microphone transmission and application-audio capture are different. Determine whether the broadcaster hears the game and whether one or all viewers are affected before changing settings.',
      },
      {
        question: 'Is whole-screen sharing always silent?',
        answer:
          'No. Compare the actual methods on your supported client with the same viewer. Whole-screen capture can expose unrelated information, so use it only when that exposure is acceptable.',
      },
    ],
    sources: [
      {
        label: 'Discord: Go Live, audio support and viewer controls',
        url: stream,
      },
      {
        label: 'Microsoft: app volume and output routing',
        url: 'https://support.microsoft.com/en-us/windows/hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows',
      },
      {
        label: 'Discord: voice, video and streaming guide',
        url: discord('33030151293079-Discord-Voice-Video-Streaming-Guide'),
      },
    ],
    related: [
      related('mic-not-working', 'Your microphone voice is missing'),
      related('screen-share-black-screen', 'The stream picture is black'),
      { href: '/en/discord', label: 'All English Discord guides' },
    ],
  },
  {
    ...base,
    slug: 'screen-share-black-screen',
    title: 'Discord Screen Share Is Black: Preview, Viewer and Capture Checks',
    shortTitle: 'Screen share is black',
    description:
      'Separate a paused local preview from a black viewer stream. Compare a harmless app window and screen, identify one-viewer failures and respect protected-content capture limits.',
    lead: 'For a Discord stream whose picture is black. First distinguish the broadcaster’s own game, the local preview and the stream a viewer actually opened. A hidden preview does not prove sharing failed.',
    summary:
      'If the application itself is black, investigate its display first. Otherwise ask a willing viewer to open the actual stream. Compare a blank Notepad window and a privacy-safe screen share; use who can see which target to choose the next check. Do not bypass protected-content capture restrictions.',
    quickFacts: [
      {
        label: 'Confirm the actual view',
        value:
          'Broadcaster app, preview and viewer stream are different observations',
      },
      {
        label: 'Safe comparison',
        value: 'A new Notepad document with harmless test text',
      },
      {
        label: 'One viewer only',
        value:
          'Compare the same live stream before changing broadcaster settings',
      },
    ],
    diagnosis: [
      row(
        'The broadcaster’s game itself is black',
        'Check whether it remains black without Discord sharing.',
        1,
      ),
      row(
        'Only the broadcaster preview is black or paused',
        'Ask whether a viewer sees changing content in the actual stream.',
        1,
      ),
      row(
        'All viewers see black while the source looks normal',
        'Compare harmless app-window and screen capture.',
        2,
      ),
      row(
        'One viewer sees black, another sees the stream',
        'Check they opened the same live stream and reconnect the affected viewer.',
        3,
      ),
      row(
        'Only one app or its window capture is black',
        'Compare the selected process and display mode.',
        4,
      ),
      row(
        'Notepad and screen capture are black for everyone',
        'Restart and compare the broadcaster’s capture environment.',
        5,
      ),
      row(
        'Only a protected video region is black',
        'Respect the provider’s supported viewing/sharing method.',
        4,
      ),
    ],
    steps: [
      step(
        1,
        'Identify which picture is actually black',
        'Do not diagnose a failed stream from a thumbnail alone.',
        [
          'The broadcaster should check that the source app itself looks normal. If it is black even after sharing stops, use the game/Windows display guide first.',
          'Ask a willing viewer in the permitted channel to open the actual live stream, not only its thumbnail. Confirm they selected this broadcaster’s current stream.',
          'If the viewer sees changing harmless text or game movement, sharing is working at that moment even if the broadcaster’s small preview is paused. If the actual viewer picture is also black, continue to STEP 2.',
        ],
        'Discord documents hidden stream previews and a broadcaster picture-in-picture preview that can pause while a game is focused. Prioritize the viewer’s actual result.',
      ),
      step(
        2,
        'Compare a harmless app window and the screen',
        'Keep the viewer and content constant; change only the capture target.',
        [
          'Open a new Notepad document without private text. In a permitted private call, share that application window and type a harmless character while the viewer watches the actual stream.',
          'Stop sharing. Only after hiding private windows and notifications, share the display containing that same Notepad window and repeat the character change. If a whole-screen test is unsafe, skip it and record the limitation.',
          'App-window only black: STEP 4. Both methods black for everyone: STEP 5. One viewer only: STEP 3. Both visible: compare the original game/application next, without changing unrelated settings.',
        ],
        'Whole-screen capture can reveal notifications and other windows. Use harmless content with consent; audio results are a separate test.',
      ),
      step(
        3,
        'Compare a second viewer of the same stream',
        'A working second viewer helps narrow the problem without proving its cause.',
        [
          'If available, ask another willing participant to open the same broadcaster’s stream in the same permitted channel. Compare the same Notepad changes at the same time.',
          'If the second viewer sees them, have the affected viewer close/reopen the stream and restart their Discord app normally if needed. Check their client version and ordinary connection without changing the broadcaster’s working setup.',
          'If both see black, stop changing individual viewer settings and use the app/screen results to continue to STEP 4 or 5. If no second viewer is available, state that uncertainty rather than treating one person’s result as universal.',
        ],
      ),
      step(
        4,
        'Check the selected app and display mode',
        'A control app that works while a game fails points toward a different comparison.',
        [
          'Keep the game open, stop sharing and select its actual displayed window again. A launcher and the game can be separate targets. Confirm the target before restarting the stream.',
          'Record the current game mode. If it uses exclusive fullscreen, compare an offered borderless or windowed mode with the same viewer. Discord’s Windows capture documentation describes fullscreen limitations; this comparison is not a guarantee for every game or client.',
          'If only an app window is black while screen capture works, retain that comparison for support. If ordinary content is visible but a protected video region is black, use the provider’s authorized viewing/sharing method instead of trying to evade capture protection.',
        ],
        'Restore an unhelpful display-mode change. Do not disable content protection or use an alternate recorder to bypass a protected region.',
      ),
      step(
        5,
        'Compare the broadcaster’s client with the same safe target',
        'Use this when both ordinary app and screen capture fail for multiple viewers.',
        [
          'Fully exit Discord from the system tray and reopen it. Repeat the same safe target comparison and check official Discord Status for relevant incidents; a status page alone does not diagnose your individual session.',
          'If offered in your version, record Hardware Acceleration under Voice & Video → Video, then compare it disabled and restart Discord. Use the same content/viewer. Restore it if there is no benefit; do not change multiple acceleration switches together.',
          'For persistent problems, use official Windows/GPU update guidance with the correct device and OEM package. If the issue is intermittent freezing rather than a black picture, compare a lower offered stream quality separately. Give Discord support the source/preview/viewer distinction, app/screen results, client versions and affected-viewer count.',
        ],
        'Settings move between versions. If starting a stream is blocked by channel permissions, ask the administrator; do not treat that as a black-picture capture failure.',
      ),
    ],
    avoid: [
      'Do not expose private windows during a whole-screen comparison.',
      'Do not bypass protected-video capture restrictions or server permissions.',
      'Do not disable antivirus or routinely elevate Discord to administrator for this comparison.',
    ],
    cautions: [
      'Record and restore display/acceleration settings that do not help.',
      'No screen capture, test call or permission change is performed automatically by this guide.',
    ],
    faqs: [
      {
        question: 'Only my local preview is black. Is sharing broken?',
        answer:
          'Ask whether the viewer sees changing content after opening the actual stream. A hidden or paused preview can differ from the viewer’s live picture.',
      },
      {
        question: 'Why does screen capture work but app capture stays black?',
        answer:
          'The selected window or capture path may differ. Compare the actual game process and borderless/windowed mode. A working screen share does not make its privacy exposure acceptable by default.',
      },
      {
        question: 'Why is just one viewer affected?',
        answer:
          'Compare another viewer of the same stream. If one works, check the affected viewer’s session/client before changing a working broadcaster setup.',
      },
      {
        question: 'Only a video area is black. What next?',
        answer:
          'Protected content may restrict capture. Use the provider’s authorized viewing/sharing options; do not attempt to defeat that restriction.',
      },
    ],
    sources: [
      { label: 'Discord: Go Live, previews and viewing', url: stream },
      {
        label: 'Discord: Windows application capture',
        url: discord(
          '9410427556375--Windows-Capturing-Application-Window-for-Screen-Share-and-Go-Live',
        ),
      },
      { label: 'Discord: voice and video troubleshooting', url: support },
      {
        label: 'Discord: voice, video and streaming',
        url: discord('33030151293079-Discord-Voice-Video-Streaming-Guide'),
      },
      {
        label: 'Microsoft: protected video and desktop duplication',
        url: 'https://learn.microsoft.com/en-us/windows-hardware/drivers/display/desktop-duplication-api',
      },
      {
        label: 'Discord: official service status',
        url: 'https://discordstatus.com/',
      },
    ],
    related: [
      related(
        'stream-no-audio',
        'Stream picture works but game audio is missing',
      ),
      {
        href: '/en/guide/black-screen',
        label: 'The game itself is black without sharing',
      },
      { href: '/en/discord', label: 'All English Discord guides' },
    ],
  },
];
