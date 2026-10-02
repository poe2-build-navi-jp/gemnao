import type { GearGuide } from '@/lib/gear-guides';

// Complete English editions of the recent Japanese decision guides.
// Keep section IDs and source URLs aligned with their originals.
export const gearGuidesEn: GearGuide[] = [
  {
    slug: 'save-backup-storage-guide',
    title:
      'Where to Back Up Game Saves: Do You Need a USB Drive or External SSD?',
    shortTitle: 'Choose a save-backup destination',
    seoTitle: 'Game Save Backups: Choosing a USB Drive or External SSD',
    description:
      'Check whether your existing storage is enough, estimate capacity, compare USB drives and external SSDs, and verify copied game saves. Learn how Steam Cloud differs from a separate backup.',
    checkedAt: '2026-10-02',
    lead: 'Before buying a large SSD just to keep your saves, check the size of the folders you need. Choose storage based on the type of data loss you want to protect against, then verify the copy.',
    answer:
      'You do not need new hardware if an existing USB flash drive or external drive has enough free space and reads and writes reliably. A copy elsewhere on the same PC can protect you before a settings change, but a copy on the same physical drive will not protect against that drive failing. Consider buying storage if you need a separate backup but have no suitable place to store it or not enough free space.',
    beforeBuying: [
      'Check the game developer’s instructions for the save location and everything that needs copying. The installed game’s size is different from the size of its saves. The related save-location directory below can help (Japanese).',
      'If the game is working normally, save and close it, wait for Steam Cloud to finish syncing, then close the launcher. Check the target folder’s size in Properties.',
      'If data is already missing, corrupted or in a sync conflict, preserve what remains before launching or resetting anything. Buying a new SSD will not restore lost progress.',
      'Check the free space on storage you already own. Do not format someone else’s drive or a device containing other data, such as TV recordings, to reuse it.',
    ],
    compareTitle: 'Choose storage for what you want to protect',
    compare: {
      headers: ['Destination', 'Useful when', 'Limits and checks'],
      rows: [
        [
          'Another folder on the same PC',
          'You want a temporary copy before changing settings or mods',
          'It does not protect against failure of the same physical drive. Different drive letters can still be on one physical drive.',
        ],
        [
          'An existing USB flash drive',
          'It holds the backup versions you need and you can verify copying and reading',
          'Small drives are easy to lose. Do not make this your only copy.',
        ],
        [
          'An external SSD or HDD',
          'You want to retain versions from several games, or recordings as well',
          'Check the connector, supported OS, free space and where it will sit. Speed alone does not guarantee data protection.',
        ],
        [
          'Steam Cloud',
          'You want to sync progress between devices for supported games',
          'The developer chooses which files sync. This is different from a backup that reliably retains any chosen point in the past.',
        ],
      ],
    },
    sections: [
      {
        id: 'capacity',
        title: 'Estimate capacity: total save size × number of copies',
        paragraphs: [
          'Add up the sizes of the save folders you want to keep. Decide how many full versions to retain: the latest, a known-working copy, and a copy from before a major update, for example. Repeatedly overwriting a single copy can leave you with no working version when you notice corruption.',
          'Example: if the total is 2 GB and you keep five full copies, you need about 10 GB. These are illustrative assumptions, not the save size of a particular game. Allow extra room for growth and other files. You do not need a 1 TB device for a small amount of data.',
          'Add recordings, screenshots and installed game files separately if you also want to store them. An advertised read speed does not tell you how long writing many small files will take. Prioritize capacity and your actual use.',
        ],
      },
      {
        id: 'compatibility',
        title:
          'Check connectors, file-system format and placement before buying',
        paragraphs: [
          '“External” does not automatically mean ready to use with your PC. Match the exact model against the manufacturer’s compatibility information and the seller’s listing.',
        ],
        items: [
          'Connector: check whether the PC has USB-A or USB-C, and which cable or adapter is included. Connector shape and transfer-speed standard are separate checks.',
          'OS and file system: decide whether you will use only Windows or also a Mac, then read the manufacturer’s format guidance. Do not format a drive that fails to work without first preserving its existing data.',
          'Individual file size: FAT32 has an approximately 4 GB single-file limit. If you also store large recordings or archives, check the destination’s file system as well as its free space (Microsoft).',
          'Physical design: a plug-in drive may obstruct a neighboring USB port; a cabled drive needs somewhere safe to sit. Do not move a laptop with the external device still connected.',
          'Purchase conditions: verify the model, capacity, included items, seller, OS support, returns and warranty. A recovery service does not guarantee that every file can be recovered.',
        ],
      },
      {
        id: 'cloud-and-backup',
        title:
          'Understand the difference between Steam Cloud, game-file backups and save backups',
        paragraphs: [
          'Steam explains that the developer chooses which files go to the cloud. Launching despite a sync error can cause conflicts or lost progress. Do not erase an old PC’s data just because you assume synchronization is complete.',
          'Do not assume Steam’s game-file backup feature includes every save. Save locations differ by developer, so identify and copy the save folders separately (Steam).',
          'External storage can also fail or be lost. Keep the original saves after copying, and clearly identify important known-working versions. This guide does not cover running games from an external drive or restoring an entire PC.',
        ],
      },
    ],
    setupTitle: 'Copy the saves and verify the destination',
    setup: [
      'Confirm the game, store and account. After closing the game, copy the complete save folder into a backup folder named with the game, date and time. Do not cut the files or delete the originals.',
      'Compare file counts, folder counts and sizes, and check for copy errors. For a stricter comparison, see the hash-checking instructions in the related backup guide below (Japanese). Matching counts and sizes alone do not prove identical contents.',
      'Record the copy time, game version, mod status and verification method. A correct copy and a save the game can load are different things. Follow game-specific restore instructions and preserve the current saves before restoring.',
      'Wait for writing to finish, then use the OS’s safe-removal option. If it says the device cannot be removed, check which app is using it rather than pulling it out (Microsoft).',
    ],
    faqs: [
      {
        question: 'Will buying an external SSD also fix crashes?',
        answer:
          'Adding a backup destination and fixing the cause of a crash are different tasks. Do not replace an SSD or GPU before identifying the problem. Record the error and conditions, then follow the relevant troubleshooting guide.',
      },
      {
        question: 'Should I buy the fastest SSD for backups?',
        answer:
          'It depends on save size and how often you copy them. If your existing device handles the copies reliably, you do not need another purchase. Check capacity for the versions you need, compatibility and copy verification before speed.',
      },
      {
        question:
          'Can I delete the PC’s saves after copying them to an external drive?',
        answer:
          'No. The aim here is to keep an additional copy. Deleting the PC copy can make the game lose track of your progress, and leaving the files only on the external device makes it your only copy.',
      },
    ],
    related: [
      {
        href: '/tools/save-locations',
        label: 'Save locations by game (Japanese)',
      },
      {
        href: '/guide/save-data-backup',
        label: 'Copy verification, hashes and safe restoration (Japanese)',
      },
      {
        href: '/guide/steam-cloud-sync-error',
        label: 'Steam Cloud sync errors (Japanese)',
      },
      {
        href: '/en/guide/pc-game-crash',
        label: 'PC game crash troubleshooting',
      },
    ],
    sources: [
      {
        title:
          'Steam Support: Steam Cloud files, conflicts and sync errors (Japanese)',
        url: 'https://help.steampowered.com/ja/faqs/view/68D2-35AB-09A9-7678',
      },
      {
        title:
          'Steam Support: Game-file backups and save-data cautions (Japanese)',
        url: 'https://help.steampowered.com/ja/faqs/view/4593-5CB7-DC3C-64F0',
      },
      {
        title:
          'Microsoft: File-system functionality comparison and file-size limits',
        url: 'https://learn.microsoft.com/en-us/windows/win32/fileio/filesystem-functionality-comparison',
      },
      {
        title: 'Microsoft: Safely remove hardware in Windows',
        url: 'https://support.microsoft.com/en-us/windows/safely-remove-hardware-in-windows-1ee6677d-4e6c-4359-efca-fd44b9cec369',
      },
    ],
  },
  {
    slug: 'discord-microphone-guide',
    title: 'Choosing a Microphone for Discord: Built-in, USB or Headset?',
    shortTitle: 'Choose a Discord microphone',
    seoTitle: 'Discord Microphones: Built-in, USB and Headsets Compared',
    description:
      'Before buying a Discord microphone, check whether your built-in mic is enough. Compare standalone USB mics and headsets, connections, positioning and background sound, with the 400-MC017 as an example for a specific setup.',
    checkedAt: '2026-10-01',
    lead: 'It is easier to choose a Discord microphone when you first identify the problem, the connector you need and whether you can position it near your mouth. Price and “high quality” labels are not enough. You may not need to buy anything.',
    answer:
      'Keep your built-in microphone if people hear you clearly and background sound is not a problem. A standalone USB mic is an option if you want to keep using favorite earphones; a boom-mic headset can keep the mic a consistent distance from your mouth while playing. If your voice is quiet or missing only in Discord, check input settings first.',
    beforeBuying: [
      'In Discord’s desktop or browser Voice & Video settings, check that the intended microphone is selected as the input device. Check mute controls and the OS microphone permission too.',
      'Make a short recording, then run Discord’s mic test using the same microphone, posture and sentence. If recording is clear but Discord alone is quiet, investigate input settings and voice processing first. See the related low-microphone-volume guide (Japanese).',
      'If you run the mic test while connected to a voice channel, Discord temporarily mutes and deafens you in that channel. End the test before asking someone to check your voice in the call.',
      'If your built-in mic or another mic you already own works well, keep it. Check your usual posture and typing as well as volume.',
    ],
    compareTitle: 'Compare built-in mics, standalone USB mics and headsets',
    compare: {
      headers: ['Option', 'Useful when', 'Check before buying or using'],
      rows: [
        [
          'PC’s built-in microphone',
          'Current calls sound fine and you do not want extra equipment',
          'Can others hear you in your usual posture? Does moving the PC change the sound?',
        ],
        [
          'Standalone USB microphone',
          'You want to choose earphones and a mic separately',
          'USB connector, supported OS, placement and which side of the mic should face you',
        ],
        [
          'Headset with a boom microphone',
          'You want the mic to stay a consistent distance from your mouth when you move your head',
          'Comfort, mic adjustment range, connector and supported devices',
        ],
        [
          'USB clip-on microphone (a type of standalone USB mic)',
          'You want to keep the desk clear and can clip it near your chest',
          'Clothing and cable contact, cable reach and background-sound pickup',
        ],
      ],
    },
    sections: [
      {
        id: 'direction-and-distance',
        title: 'Consider background sound, direction and distance',
        paragraphs: [
          'USB describes a connection; a headset describes a physical design. USB headsets also exist. This comparison is about how built-in mics, standalone USB mics and headsets are used.',
          'An omnidirectional microphone picks up sound from many directions. A directional microphone is more sensitive to sound in front and less sensitive in other directions, but it does not eliminate background sound (Shure).',
          'Even a directional mic may disappoint if its pickup side faces away from your mouth or it is too far away. Follow the manufacturer’s positioning instructions and test in your usual gaming posture.',
          'Discord’s Krisp reduces background noise on your side, not the other caller’s. It can reduce audio quality in a quiet room, so compare it on and off (Discord).',
        ],
      },
      {
        id: 'bluetooth-input',
        title: 'With Bluetooth, compare another input before buying',
        paragraphs: [
          'If Bluetooth earphones sound muffled only when you join a call, a switch to headset audio mode may be involved (Discord).',
          'On a PC, you can select your audio output and microphone input separately. First try the built-in microphone you already have as the input, then check your usual game and call together. Results depend on the device and OS; buying a separate mic does not guarantee a fix.',
          'The related Bluetooth game-audio guide below (Japanese) explains the checks. If the built-in microphone works well, an additional purchase is unnecessary.',
        ],
      },
      {
        id: 'purchase-checklist',
        title: 'Check connections, placement and supported devices',
        paragraphs: [
          'Once you know the type you need, check each model’s requirements.',
        ],
        items: [
          'Device: PC, phone and console compatibility can differ. A PC-compatible label does not establish compatibility with other devices.',
          'Connector: USB-A, USB-C or 3.5 mm. For 3.5 mm, check whether the port you will use supports microphone input. An adapter must also support the intended use.',
          'Position: check the desk placement, headset boom adjustment range or clip position. Consider your normal posture as well as desk space.',
          'Listening equipment: standalone microphones may not include earphones or headphones. Check whether you can combine the mic with what you already use.',
          'Purchase details: check supported OS versions, included items, seller, returns and warranty. Prices and stock change; use the current seller information.',
        ],
      },
    ],
    example: {
      title: 'An option for a clip-on setup: Sanwa Direct 400-MC017',
      introduction:
        'The 400-MC017 is a USB-A clip microphone. It may fit someone who wants to clip a mic near their chest without putting a stand on the desk. We are not claiming it offers the best sound quality or recommending it for every Discord user.',
      fits: [
        'Your supported PC has a USB-A port and you can verify the manufacturer’s supported models and OS list',
        'You want to add only a microphone while keeping your existing earphones',
        'You can clip it near your chest and its approximately 2 m cable reaches the PC',
      ],
      specs: [
        { label: 'Connection', value: 'Supported PC with a USB-A port' },
        { label: 'Design', value: 'Clip-on' },
        { label: 'Pickup pattern', value: 'Omnidirectional' },
        { label: 'Cable length', value: 'Approximately 2 m' },
        { label: 'Weight', value: 'Approximately 30 g' },
        { label: 'Earphones or headphones', value: 'Required separately' },
      ],
      cautions: [
        'Its omnidirectional pattern also picks up surrounding sound. We do not recommend it solely as a noise fix for someone trying to exclude household voices and other background sound.',
        'Check whether you can wear it without clothing or the cable brushing the microphone.',
        'Do not use this page alone to determine compatibility with USB-C-only devices or phones. Check manufacturer support for the device and any adapter together.',
        'Check the manufacturer’s supported OS and device list before buying. This guide does not guarantee operation on every OS or console.',
      ],
      asin: 'B08H6X6G28',
    },
    setupTitle: 'After connecting, check input and output separately',
    setup: [
      'Select the new mic as Discord’s input device. Check your earphones separately under output device.',
      'Speak a short sentence at your normal volume. Compare your usual posture, typing and small head movements.',
      'End the mic test, then ask the other person to check your voice in a call. While the test is running, Discord mutes and deafens you in the voice channel. This checks practical use; it is not a controlled audio-quality measurement.',
    ],
    faqs: [
      {
        question: 'Do I need an expensive microphone for Discord?',
        answer:
          'No. If people hear you clearly and surrounding sound is not a problem, keep the mic you have. Identify the problem before choosing equipment.',
      },
      {
        question: 'Should I choose a USB microphone or a headset?',
        answer:
          'A standalone USB mic is an option if you want to keep your earphones; a boom-mic headset can keep the mic near your mouth. USB is a connection type, so USB headsets also exist.',
      },
      {
        question: 'Will a directional microphone eliminate keyboard noise?',
        answer:
          'Not completely. Directionality describes where sound is picked up. Check the positions of your mouth, mic and keyboard, and any voice processing.',
      },
      {
        question: 'Does the 400-MC017 work with a USB-C phone?',
        answer:
          'We have not verified that. A PC compatibility list does not guarantee phone support. Check compatibility for the phone and adapter together.',
      },
      {
        question: 'Should I replace my mic if the other person sounds quiet?',
        answer:
          'First check your output settings and that person’s user volume. This is separate from deciding to replace your own mic. See the related quiet-caller guide below (Japanese).',
      },
    ],
    related: [
      {
        href: '/discord/mic-volume-low',
        label: 'Fix a quiet microphone or voice (Japanese)',
      },
      {
        href: '/discord/bluetooth-audio-problem',
        label: 'Missing or poor game audio with Bluetooth (Japanese)',
      },
      {
        href: '/discord/user-volume-low',
        label: 'When the other person sounds quiet (Japanese)',
      },
    ],
    sources: [
      {
        title: 'Discord: Voice and Video Troubleshooting Guide',
        url: 'https://support.discord.com/hc/en-us/articles/360045138471-Discord-Voice-and-Video-Troubleshooting-Guide',
      },
      {
        title: 'Discord: Mic Testing, including temporary effects on calls',
        url: 'https://support.discord.com/hc/en-us/articles/360020641332-Mic-Testing',
      },
      {
        title: 'Discord: Krisp FAQ',
        url: 'https://support.discord.com/hc/en-us/articles/360040843952-Krisp-FAQ',
      },
      {
        title:
          'Discord: Known issue with audio quality dropping when joining a call',
        url: 'https://support.discord.com/hc/en-us/articles/19850083499159--Known-Issue-Audio-Quality-Drops-When-Joining-A-Call',
      },
      {
        title: 'Discord: Missing audio input and voice issues',
        url: 'https://support.discord.com/hc/en-us/articles/214925018-Where-d-my-Audio-Input-go-Various-Voice-Issues',
      },
      {
        title: 'Shure: Microphone directionality and polar-pattern basics',
        url: 'https://www.shure.com/en-GB/insights/microphone-directionality-polar-pattern-basics',
      },
      {
        title:
          'Sanwa Direct: 400-MC017 specifications and supported devices (Japanese)',
        url: 'https://direct.sanwa.co.jp/ItemPage/400-MC017',
      },
    ],
  },
];

export const gearGuideEnBySlug = (slug: string) =>
  gearGuidesEn.find((guide) => guide.slug === slug);
