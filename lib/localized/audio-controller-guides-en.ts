import type { EnglishCommonGuide } from './common-guides-en';
const steamInput = 'https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_players';
const controllerHelp = 'https://help.steampowered.com/en/wizard/HelpWithGameIssue/?appid=353370&issueid=361&nodeid=9';
const msAudio = 'https://support.microsoft.com/en-us/windows/hardware/audio/';
export const audioControllerGuidesEn: EnglishCommonGuide[] = [
  {
    slug: 'no-game-audio', path: '/guide/no-game-audio', topic: 'launch',
    title: 'No Sound in a PC Game: Check Windows Output and App Volume',
    shortTitle: 'No sound in a PC game',
    description: 'Find out whether one game, all apps or one headset is silent. Check Windows output, the game’s Volume mixer entry and in-game audio, then compare the same scene.',
    lead: 'For PC games on Windows, with Windows 11 setting names. Start by comparing another app through the same headphones or speakers. A silent game and a silent PC need different checks.',
    summary: 'If every app is silent, check the selected Windows output and device volume. If only the game is silent, inspect its own mixer entry while it is running, then its audio settings. Change one item and listen to the same scene again.',
    category: 'Common PC game troubleshooting', checkedAt: '2026-10-18',
    sourcePolicy: 'English edition of our Japanese audio guide. Microsoft documents Windows output and app-volume checks; Steam documents file verification. The order and comparisons are editorial guidance, not proof of a cause.',
    branches: [
      {symptom: 'The game and other apps are silent', action: 'Check the shared Windows output and device volume.', step: 'step-2'},
      {symptom: 'Videos play, but the game is silent', action: 'Keep the game open and inspect its mixer entry.', step: 'step-2'},
      {symptom: 'Only one headset or monitor is silent', action: 'Confirm which device is actually receiving audio.', step: 'step-1'},
    ],
    steps: [
      {id: 'step-1', title: 'Compare another app on the same output', actions: [
        'Open a game scene that should have sound, then try audio in another app through the same headphones or speakers. Record whether both are silent or only the game is affected.',
        'If only one device is silent, open Windows Settings → System → Sound and check Output. After connecting HDMI or Bluetooth, make sure the selected device is the one you intend to hear.',
      ], next: 'Both silent: check the shared output in STEP 2. Only the game: inspect its app entry there. A working second device narrows the comparison; it does not identify a failed component.'},
      {id: 'step-2', title: 'Check Windows output and the game’s mixer entry', actions: [
        'For silence across apps, select the intended output in System → Sound and check the overall volume plus the device’s own volume and mute controls. Compare another available output if practical.',
        'For game-only silence, leave the game open and go to Settings → System → Sound → Volume mixer. Under Apps, check its mute, volume and Output device. Choose the intended device or Default when the system default is correct, then close and reopen the game.',
        'If the game is missing from the mixer, reach a scene that should play audio and check again. A missing entry alone does not establish a broken game; also check whether it has started normally.',
      ], next: 'Retest the same scene. If Windows and the app output are correct but the game stays silent, continue to its own settings.'},
      {id: 'step-3', title: 'Compare the game’s own audio settings', actions: [
        'Open the game’s Audio or Sound settings. Check master volume and separate effects, music and voice levels. Only if the game offers an output selector, choose your current device or the appropriate default.',
        'Exit normally, reopen and compare the same scene. Record each changed setting; restore changes that did not help before the next test. Compare another game if available.',
      ], next: 'Record whether all sound returned, only one channel returned or nothing changed. Use that distinction to choose the next check.'},
      {id: 'step-4', title: 'Follow up on the affected app or device', actions: [
        'If other apps are also silent, use Microsoft’s audio troubleshooting through Get Help on Windows 11. For persistent device detection or driver problems, follow the PC or headset manufacturer’s guidance.',
        'If only this game is silent, check its official known issues and updates. For suspected Steam installation damage, use the linked file-verification guide. Compare Discord, recording software or virtual-audio software by closing one app normally at a time.',
        'For Bluetooth-only silence, check the connection and selected output, then use Microsoft’s Bluetooth audio guidance. Keep a record of each comparison instead of replacing every audio driver at once.',
      ], next: 'Give support the game/version, output device, whether other apps work and the result of each change. A reinstall is not the first step for a device-specific problem.'},
    ],
    cautions: ['Avoid changing several output devices, drivers and game settings together.', 'Do not delete saves or reset Windows to investigate a single silent game.'],
    faqs: [
      {question: 'YouTube works but my game is silent. Where should I look first?', answer: 'Keep the game open at an audible scene and inspect its entry in Windows Volume mixer. Its volume and output can differ from another app’s. Then check the game’s own settings.'},
      {question: 'Everything went silent after I connected a monitor. Why?', answer: 'Check whether Windows selected the HDMI or DisplayPort monitor as its output. A monitor without speakers cannot provide the sound you expect. Select your intended headphones or speakers and compare both apps again.'},
      {question: 'Does a missing mixer entry mean the game is broken?', answer: 'No. Check again after reaching a scene that should produce audio. Also inspect startup state and in-game settings; the absence alone is not a diagnosis.'},
      {question: 'Should I reinstall the game if only Bluetooth is silent?', answer: 'First compare the Bluetooth connection, Windows output and another app on the same device. A connection or output problem needs a different check from damaged game files.'},
      {question: 'My game has no output-device selector. Am I missing a setting?', answer: 'Not every game provides one. Use Windows output and the app’s mixer settings, then restart the game. Do not search for a menu that the game does not offer.'},
    ],
    sources: [
      {label: 'Microsoft: app audio is silent while system sounds work', url: msAudio + 'fix-app-audio-not-working-while-system-sounds-work-in-windows'},
      {label: 'Microsoft: no sound from speakers or headphones', url: msAudio + 'fix-audio-issues-when-no-sound-plays-from-speakers-or-headphones-in-windows'},
      {label: 'Microsoft: sound and audio troubleshooting', url: msAudio + 'fix-sound-or-audio-problems-in-windows'},
      {label: 'Microsoft: Bluetooth connected but no sound', url: 'https://support.microsoft.com/en-us/windows/hardware/bluetooth/fix-bluetooth-connected-but-no-sound-issue-on-windows'},
      {label: 'Steam Support: verify game files', url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB'},
    ],
    related: [{href: '/en/guide/verify-steam-files', label: 'Verify Steam game files'}, {href: '/en/discord/stream-no-audio', label: 'Discord stream has no audio'}, {href: '/en/guide', label: 'All PC game guides'}],
  },
  {
    slug: 'steam-input-controller', path: '/guide/steam-input-controller', topic: 'controller',
    title: 'Controller Not Working in a Steam Game: Recognition and Steam Input', shortTitle: 'Controller not working in Steam',
    description: 'Separate connection problems from Steam recognition and game support. Compare Steam Input, controller layouts and external remapping tools one change at a time.',
    lead: 'Use one physical controller for this comparison. Being able to navigate Steam does not prove that the game supports that device or receives its buttons correctly.',
    summary: 'First confirm both the device name and button response in Steam’s controller settings. Then compare the game’s Steam Input setting after restarting the game. If an external remapper is involved, test one input path at a time and preserve your existing layout.',
    category: 'Common PC game troubleshooting', checkedAt: '2026-10-18',
    sourcePolicy: 'English edition of our Japanese controller guide. Valve documents Steam Input, layouts and external remapping. Screens and options vary by client and device; comparisons here are editorial guidance. Steam Controller-specific support is not a compatibility guarantee for every controller.',
    branches: [
      {symptom: 'No controller name or button response in Steam', action: 'Resolve the connection before changing game settings.', step: 'step-1'},
      {symptom: 'Steam responds, but the game does not', action: 'Check the game’s support and compare its Steam Input setting.', step: 'step-2'},
      {symptom: 'An unexpected Xbox device appears or inputs repeat', action: 'Compare with an external remapper closed.', step: 'step-3'},
    ],
    steps: [
      {id: 'step-1', title: 'Confirm recognition and a responding button', actions: [
        'Close the game, connect one charged controller and open Steam Settings → Controller. Check the detected name and use the input test where available to confirm buttons and sticks respond.',
        'If recognition or response is missing, compare a suitable USB port and a data-capable cable. For Bluetooth, check the Windows connection and the controller manufacturer’s instructions before changing Steam Input.',
      ], next: 'Continue only after both the device and button response are confirmed. Recognition is a prerequisite, not a fix for the game. If either is unconfirmed, return to connection and manufacturer checks.'},
      {id: 'step-2', title: 'Compare this game’s input setting and layout', actions: [
        'With the game closed, open its Steam Library Properties → Controller and record the current setting. Compare Enable Steam Input, launch the game and test the same button in the same scene. Keep it if it works.',
        'If that fails and the game supports your physical controller directly, compare Disable Steam Input after closing and reopening the game. If both fail, check the store’s controller-support information and the game’s official help. Disabling translation may leave an unsupported controller unresponsive.',
        'Check the game’s controller layout for unassigned or unintended bindings. Preserve your current layout before editing. A gamepad mapping cannot create native gamepad support in a keyboard-and-mouse-only game; keyboard/mouse bindings are a separate option, subject to that game’s rules and limitations.',
      ], next: 'Record which setting and button worked. If Steam responds but neither game configuration does, compare external remapping in STEP 3 instead of toggling repeatedly.'},
      {id: 'step-3', title: 'Compare one remapping path at a time', actions: [
        'Close the game and exit an external remapper such as DS4Windows normally. Test the physical controller with Steam Input alone. If that helps, overlapping input paths may contribute. If the external tool is required, compare it separately with this game’s Steam Input disabled; restore the previous setting if input disappears.',
        'Compare another supported game with the same controller. One affected game points to a game-specific comparison; failures across games call for connection and Steam checks. Restart Steam normally and repeat its input test if recognition changes.',
      ], next: 'For repeated presses, use the related double-input guide. For unresolved recognition, record the device, USB/Bluetooth connection, input-test result and games affected for support.'},
    ],
    cautions: ['Do not treat a detected device name as proof that the game receives input.', 'Save layouts and change one input path at a time. Avoid removing devices or drivers just because their names look unfamiliar.'],
    faqs: [
      {question: 'Why does my PS4 controller appear as an Xbox 360 controller?', answer: 'An external remapper can present a virtual Xbox device to Steam. Compare the displayed device with the tool closed. The name alone does not prove a fault or double input.'},
      {question: 'Why does a button work in menus but not in combat?', answer: 'Some Steam Input games use separate action sets with independent bindings. Check the relevant set where the game provides it. This feature is not present in every game.'},
      {question: 'USB works, but Bluetooth does not. Should I edit the layout?', answer: 'First compare the Bluetooth connection and Steam’s input test. If buttons do not reach Steam over Bluetooth, a game layout change does not address that missing connection.'},
      {question: 'I can navigate Steam. Does that confirm game compatibility?', answer: 'No. It confirms input reaches that part of Steam. Check the game’s supported devices, input setting and layout separately.'},
      {question: 'Should Steam Input always be enabled?', answer: 'No single setting suits every game and controller. Record the current choice and compare the game’s supported native input with Steam Input, restarting the game between tests.'},
      {question: 'Can I use a controller in a keyboard-and-mouse-only game?', answer: 'Legacy bindings can emulate keyboard or mouse input, but that is different from native gamepad support. Check the game’s rules and whether the chosen layout can perform the required actions.'},
      {question: 'What if one press moves the menu twice?', answer: 'Close external remapping software for a comparison, then follow the double-input guide. Keep a short press distinct from the game’s normal held-button repeat.'},
    ],
    sources: [
      {label: 'Valve: Steam Input getting started for players', url: steamInput},
      {label: 'Valve: legacy keyboard, mouse and gamepad bindings', url: 'https://partner.steamgames.com/doc/features/steam_controller/legacy_mode'},
      {label: 'Valve: Steam client controller-support announcements', url: 'https://store.steampowered.com/news/posts/?enddate=1701713393&feed=steam_blog'},
      {label: 'Steam Support: Steam Controller troubleshooting (device-specific)', url: controllerHelp},
      {label: 'Microsoft: Bluetooth connection troubleshooting', url: 'https://support.microsoft.com/en-us/windows/hardware/bluetooth/fix-bluetooth-problems-in-windows'},
    ],
    related: [{href: '/en/guide/controller-double-input', label: 'One press registers twice'}, {href: '/en/guide/steam-game-not-launching', label: 'Steam game will not launch'}, {href: '/en/guide', label: 'All PC game guides'}],
  },
  {
    slug: 'controller-double-input', path: '/guide/controller-double-input', topic: 'controller',
    title: 'Controller Double Input on PC: Compare Steam Input and Remapping', shortTitle: 'One controller press registers twice',
    description: 'Check a short press against held-button repeat, then compare physical and virtual controllers. Test Steam Input and external remapping separately without deleting drivers.',
    lead: 'Use the same menu and one brief press for each comparison. Two visible controller entries are a clue, not proof that both are reaching the game.',
    summary: 'Record whether one short press produces one action, two actions or no response. Close the game before changing input paths. First compare with external remapping software closed, then compare the game’s Steam Input setting if needed.',
    category: 'Common PC game troubleshooting', checkedAt: '2026-10-18',
    sourcePolicy: 'English edition of our Japanese double-input guide. Valve explains how remapped controllers appear to Steam. The linked DS4Windows community documentation describes physical/virtual overlap; the comparison order is editorial guidance, not an instruction to install a hiding tool.',
    branches: [
      {symptom: 'One brief press produces two menu moves', action: 'Record the active devices and remapping software.', step: 'step-1'},
      {symptom: 'An external remapper is running', action: 'Compare with that app closed before changing drivers.', step: 'step-2'},
      {symptom: 'Input stops when the remapper closes', action: 'Check compatibility and compare the required path separately.', step: 'step-3'},
    ],
    steps: [
      {id: 'step-1', title: 'Record one press and the visible devices', actions: [
        'In the same game menu, make one brief press and release. Record one move, two moves or no response. Do not confuse this with the menu repeatedly moving while you hold a button.',
        'Close the game. Press Win+R, enter joy.cpl and inspect the controller names. A physical device and a virtual Xbox-style device can coexist; compare which entry disappears when the remapping app closes instead of judging by the name alone.',
        'If device-hiding software is already configured, both entries may not be visible. Use the existing tool’s connection/output information to compare before and after. Do not delete devices or disable drivers to force a particular list.',
      ], next: 'Keep the short-press result and device list. They guide the comparison but do not establish that the game reads two controllers.'},
      {id: 'step-2', title: 'Test with external remapping software closed', actions: [
        'Close the game and exit DS4Windows or another remapper normally. Check the system tray or Task Manager to confirm the app has stopped; do not remove its installed drivers.',
        'Check the physical controller and button response in Steam Settings → Controller. Record this game’s Properties → Controller setting, compare Enable Steam Input and launch through Steam.',
        'Repeat the same short press. If two actions become one, the external path may contribute. If two remain, investigate other devices or game bindings. If input disappears, the external path may be needed for this game/controller combination.',
      ], next: 'Keep the working single-path configuration if the comparison resolves it. Otherwise continue with the recorded result, restoring an unhelpful change first.'},
      {id: 'step-3', title: 'Compare the remaining path and game bindings', actions: [
        'If input still doubles with the external tool closed, close the game and compare Disable Steam Input, then restart and repeat. If the game does not support the physical controller and input stops, restore the previous setting.',
        'If an external remapper is required, close the game and test that tool with the game’s Steam Input disabled. Do not change both paths during the same comparison. For an existing HidHide setup, follow its documentation; do not guess which devices to hide or install it as a universal fix.',
        'If only one game is affected, check its layout and duplicate keyboard/gamepad bindings. If multiple games are affected, compare other connected controllers, virtual devices and remappers that start automatically. Keep one change and one repeatable test at a time.',
      ], next: 'Record the device, game, short-press result and active input path. An unresolved case needs those details, not repeated driver deletion or an assumed hardware diagnosis.'},
    ],
    cautions: ['Do not delete a device because joy.cpl lists two names.', 'Hiding devices is not the first comparison. Preserve a working keyboard/mouse and existing configurations.'],
    faqs: [
      {question: 'Does an Xbox name mean I connected a second physical controller?', answer: 'No. Remapping software can create a virtual Xbox-style device. Compare the list with the software running and closed to understand the entry.'},
      {question: 'Are two joy.cpl entries proof of double input?', answer: 'No. A game may read only one of them. Compare its actual response to one short press before and after changing an input path.'},
      {question: 'The controller stops working when I close the remapper. What now?', answer: 'The game may need translated input. Restore the known configuration, check its controller support and compare the external tool separately with Steam Input disabled. No response is a distinct result from duplicate response.'},
      {question: 'Do I need to install HidHide?', answer: 'Not automatically. If closing an overlapping remapper gives a working single input, another tool is unnecessary for that comparison. Existing hiding configurations require their own documentation and should not be changed by guesswork.'},
      {question: 'The menu repeats only when I hold a button. Is that double input?', answer: 'It may be normal repeat behavior. Use a brief press and release in the same menu to compare one action with two; record held-button behavior separately.'},
    ],
    sources: [
      {label: 'DS4Windows community documentation: physical and virtual double input', url: 'https://kanuan.github.io/DS4WSite/guides/solving-double-input/'},
      {label: 'Microsoft: opening Control Panel tools by command', url: 'https://support.microsoft.com/en-us/topic/how-to-run-control-panel-tools-by-typing-a-command-bce95b4d-e8c2-1cd0-ee0d-027679d520a6'},
      {label: 'Steam Support: Steam Controller troubleshooting (device-specific)', url: controllerHelp},
      {label: 'Valve: Steam Input and external remappers', url: steamInput},
    ],
    related: [{href: '/en/guide/steam-input-controller', label: 'Controller recognition and Steam Input'}, {href: '/en/guide', label: 'All PC game guides'}],
  },
];
