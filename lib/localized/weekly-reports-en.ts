import { weeklyReports, type WeeklyReport } from '@/lib/weekly-reports';
const names: Record<string, string> = {
  エースコンバット8: 'ACE COMBAT 8',
  ドラゴンズドグマ2: 'Dragon’s Dogma 2',
  'ドラゴンズドグマ2 ダークアリズン': 'Dragon’s Dogma 2: Dark Arisen',
  'テイルズ オブ エターニア リマスター': 'Tales of Eternia Remastered',
  'アニモ（Aniimo）': 'Aniimo',
  'ホグワーツ・レガシー': 'Hogwarts Legacy',
  崩落の国: 'Where the Seeds Fall',
  'ドラゴンクエストモンスターズ4・Edge of Memories':
    'Dragon Quest Monsters 4 / Edge of Memories',
  モンハンワイルズ: 'Monster Hunter Wilds',
  サイバーパンク2077: 'Cyberpunk 2077',
  'ファイナルファンタジー レゾナンス': 'FINAL FANTASY RESONANCE',
  'Call of Duty: Modern Warfare 4・ファイナルファンタジー レゾナンス':
    'Call of Duty: Modern Warfare 4 / Final Fantasy Resonance',
  進撃の巨人3: 'Attack on Titan 3',
  '進撃の巨人3・レイトン教授と蒸気の新世界':
    'Attack on Titan 3 / Professor Layton and the New World of Steam',
};
const text: Record<
  string,
  {
    title: string;
    description: string;
    highlights: string[];
    items: [string, string][];
    upcoming: string[];
  }
> = {
  '2026-11-16': {
    title:
      'PC Gaming Weekly, November 16–22: FM27 Update 27.1.0 Crash Fixes, ROB RUN Patches and AION2 EU Connection Issues',
    description:
      'An archive of official patches and announcements from November 16–22, 2026: FM27 Update 27.1.0 (crash fixes and faster loading on lower-end PCs), ROB RUN connection-stability and anti-cheat patches, AION2 EU connection issues and maintenance, The Blood of Dawnwalker Update 1.2 and Aniimo’s right-stick fix.',
    highlights: [
      'FM27: Update 27.1.0 fixed numerous crashes, including online-related ones, and improved loading times for large databases on lower-end PCs.',
      'ROB RUN: the November 17 patch improved connection stability and keeps progress when changing regions; the November 20 patch added cheat-detection methods and shows online friends in the server list.',
      'AION2: on November 19 the developer reported EU connection issues caused by a routing problem between infrastructure providers.',
    ],
    items: [
      [
        'Update 27.1.0 fixed numerous crashes and improved loading on lower-end PCs',
        'Released on Steam, Epic Games Store and Microsoft Store. Fixed numerous crashes and online-related crashes, improved UI performance and shortened loading of larger databases on lower-end PCs; Information Display is now available at 1080p or higher. Match engine and AI transfer tweaks are included. Report gameplay issues via the official Bug Tracker and technical issues to SEGA Support.',
      ],
      [
        'Patch improved connection stability; progress and Battle Pass carry over between regions',
        'Fixed some connection issues and improved stability. Progress and Battle Pass points now carry over when changing regions. Added mouse Y-axis inversion and a profanity filter for character names.',
      ],
      [
        'Patch added cheat-detection methods and improved network performance',
        'Added more cheat-detection methods and improved network performance. The server list now shows which servers online friends are playing on, and the game checks for a vacant cop slot before opening equipment selection.',
      ],
      [
        'EU connection issues caused by a routing problem between infrastructure providers',
        'The developer identified a network routing issue on one connection path between infrastructure providers supporting the service, is working with partners on a fix and will share an expected resolution time.',
      ],
      [
        'Scheduled maintenance from 15:30 for about three hours; World Market from November 25',
        'Login is unavailable during maintenance and players are disconnected when it starts. From November 25 (after maintenance), the World Market and World Exchange allow trading with other servers in the same faction and region (Membership only, 20% sales tax).',
      ],
      [
        'Update 1.2 added New Game+ and fixed terrain snagging',
        'After the Epilogue, New Game+ keeps level, skills and inventory (level cap 100). Multiple terrain geometry fixes smooth movement in combat and exploration; enemy health and ability frequency were adjusted.',
      ],
      [
        'November 18 fixes (v1.1.3973445.0) including the controller right stick',
        'Fixed an issue with the controller right stick, the chat tab display and missing skill effects, among others.',
      ],
      [
        'Balance update applied at next login, no game update needed',
        'Raised Echo Shard and Emerald caps, buffed an artifact and adjusted boss health. No game update is required; changes apply at next login. Bugs can be reported at aka.ms/Dungeons2Bugs.',
      ],
    ],
    upcoming: [
      'World Market and World Exchange open after maintenance (official).',
      'Release date shown on Steam.',
      'Digital Deluxe Edition early access begins 72 hours before release (official).',
      'Release date on the official sites.',
      'Full release (Pacific Time); free to play (official).',
    ],
  },
  '2026-11-09': {
    title:
      'PC Gaming Weekly, November 9–15: HELLDIVERS 2 Crash Fixes, AION2 Login Outage, WARDOGS Season 3 and FM27 Launch',
    description:
      'An archive of official patches and announcements from November 9–15, 2026: HELLDIVERS 2 7.2.3 (startup and exit crash fixes) and its mod guidance, AION2’s Steam login outage and maintenance, WARDOGS Season 3 (Update 0.3.0), the FM27 launch, Aniimo maintenance and the returning Edge of Memories demo.',
    highlights: [
      'HELLDIVERS 2: 7.2.3 fixed a startup crash when Windows write permissions were problematic. For cosmetic mods, the developer advises reinstalling and verifying files first, then adding mods one at a time.',
      'AION2: on November 11, an account-linking error stopped Steam users from logging in (resolved). A prompt asking players to accept Throne and Liberty terms was also removed.',
      'WARDOGS: Season 3 (Update 0.3.0) launched, fixing server crashes and the graphics benchmark running twice on first launch.',
    ],
    items: [
      [
        '7.2.3 fixed a startup crash caused by write-permission issues, an exit crash and more',
        'Fixed a crash on boot when the game had issues writing with Windows permissions, a crash when exiting, and a crash from poison or gas status effects in Hive World caves. Some cosmetic mods that had stopped working were unblocked.',
      ],
      [
        'Developer blog: Easy Anti-Cheat, mods and checking cosmetic mods',
        'Mods that alter game code or memory remain prohibited and may lead to bans. To try cosmetic mods, reinstall if mods were previously installed, verify files in Steam, confirm the game runs, then add mods one at a time and reverify. Reports of virtual machines losing access are being reviewed.',
      ],
      [
        'Steam login outage (resolved); the Throne and Liberty terms prompt was removed',
        'An account-linking error prevented logins for Steam users. An interim notice said restarting Steam allowed entry and that a Throne and Liberty terms/data prompt might appear. The developer later said the issue was resolved and the prompt no longer appears.',
      ],
      [
        'Scheduled maintenance from 15:30 for about 4.5 hours, then an update',
        'The update added Hard mode to Expeditions and extended 5-minute consumables to 10 minutes, among other changes. Account creation and management services also had maintenance on November 10. Accounts violating policy (bots, RMT) were restricted as of November 11; temporary security locks are not penalties and are lifted through Customer Support.',
      ],
      [
        'Season 3 (Update 0.3.0) launched with server-crash and duplicate-benchmark fixes',
        'Added the Sabatulo map and a new mode. Fixed server crashes when a locked-on target became invalid or vehicles were damaged, and the graphics benchmark running twice on first launch; improved ground-clutter and rain performance. Using NVIDIA Inspector or similar tools to remove smoke or grass is prohibited.',
      ],
      [
        'Released; Launch Preview saves can be continued',
        'Available on Steam, Epic Games, the Microsoft Store and PC Game Pass. Saves started in the Launch Preview can be continued. Some club and player assets may be missing while rights-holder approval is pending.',
      ],
      [
        'Update maintenance (Asia-Pacific servers 15:00–20:00 JST)',
        'Login is unavailable during maintenance. Asia-Pacific servers were down 14:00–19:00 UTC+8 (15:00–20:00 JST). Restart the client afterward to run the latest version.',
      ],
      [
        'Demo returns on Steam; buying in the first two weeks adds a costume pack',
        'The demo covers the same Act 1 as the Steam Next Fest version, with enemy balancing, full controller button remapping, a save-completed notification and standardized text size for Asian languages. Purchases in the first two weeks after launch include the Legacy Costume Pack.',
      ],
    ],
    upcoming: [
      'Release date shown on Steam.',
      'Digital Deluxe Edition early access begins 72 hours before release (official).',
      'Release date on the official sites.',
      'Full release (Pacific Time); free to play (official).',
    ],
  },
  '2026-11-02': {
    title:
      'PC Gaming Weekly, November 2–8: Phantom Blade Zero Patch, Castlevania 1.1.4, Godzilla and Where the Seeds Fall',
    description:
      'An archive of official patches and announcements from November 2–8, 2026: Phantom Blade Zero’s shorter shader compilation and Bluetooth controller stutter fix, Castlevania: Belmont’s Curse Ver. 1.1.4, ACE COMBAT 8’s crash workaround, the Godzilla and Where the Seeds Fall launches, and FM27 updates.',
    highlights: [
      'Phantom Blade Zero: a patch greatly shortened shader compilation at startup. Players who had ray tracing off recompile once on the first launch after the patch.',
      'Castlevania: Belmont’s Curse: Ver. 1.1.4 added further fixes for a black screen after loading and a launch failure with V-Sync off.',
      'ACE COMBAT 8: the developer says turning Async Compute OFF under SYSTEM may reduce crashes during play.',
    ],
    items: [
      [
        'Patch (Version 1.0302256) shortened shader compilation and reduced Bluetooth controller stutter',
        'Ray-tracing shaders are no longer compiled at startup by default. Players who had ray tracing off recompile once on their first launch after the patch. Stutter with Bluetooth controllers was reduced, and NVIDIA Reflex now works on “Auto” with V-Sync enabled. The patch also improved performance in some areas and fixed progression blockers.',
      ],
      [
        'Ver. 1.1.4 added further fixes for black screens and launches with V-Sync off',
        'A black screen that could remain after loading under certain conditions was fixed, and further fixes were made for launch failures with V-Sync disabled. The version number now appears at the bottom of the title screen.',
      ],
      [
        'Turning Async Compute OFF may help if the game crashes',
        'The developer said Async Compute can affect stability on some GPU configurations. Turning OFF the SYSTEM option added in Ver. 1.01.002 may help (it is greyed out on unsupported GPUs). Other causes remain under investigation.',
      ],
      [
        'Post-launch hotfixes: V-Sync on by default and audio-device fix',
        'The November 3 (US) hotfix set V-Sync on by default. The November 4 (US) hotfix fixed the roster becoming fully locked when save data is corrupted and Steam using the wrong audio output device.',
      ],
      [
        'Released at 14:00 JST; the Steam page’s “November 6” was an error',
        'The developer said the Steam store briefly showed November 6, but the correct release was November 5 at 14:00 JST (05:00 UTC). The main story takes about three hours, with harder maps and time trials after clearing it.',
      ],
      [
        'Minor Update 1 fixed UEFA squad registration and saving issues',
        'Squad registration messages that sometimes did not appear for UEFA club competitions, and the Save Game option becoming unavailable when that happened, were fixed. Another update is planned for the November 10 launch, followed by a first post-launch update addressing 3D match engine reports.',
      ],
      [
        'PC patch (November 5) added DLSS 5 and XeSS multi-frame generation',
        'The patch added NVIDIA DLSS 5 with Neural Rendering (off by default; requires an RTX 50 Series GPU and driver 616.64 or newer) and Intel XeSS Multi-Frame Generation, fixed some graphics options saving incorrectly, and reduced restarts needed after changing Frame Gen options.',
      ],
      [
        'Scheduled maintenance from 15:30 for about three hours, then a hotfix',
        'Maintenance accompanied the Ludra Awakens update. For the following hotfix, players were told to exit, update through the Steam or PURPLE launcher and restart.',
      ],
      [
        'November 6 fixes for DLSS Frame Generation and laptop stutter',
        'After the November 5 update (v1.1.3880756.0), the November 6 update (v1.1.3887621.0) fixed DLSS Frame Generation not working, stutter on some laptops and the controller radial menu in the Park, among other issues.',
      ],
      [
        'Season 3 starts November 12 with a new map and anti-cheat plans',
        'A new map, Sabatulo, and longer seasons were announced, along with how cheating and exploits will be handled. A Season 3 patch notes preview was due the following week.',
      ],
    ],
    upcoming: [
      'Release date shown on Steam.',
      'Season 3 start (official announcement).',
      'Release date shown on Steam.',
    ],
  },
  '2026-10-26': {
    title:
      'PC Gaming Weekly, October 26–November 1: Phantom Blade Zero, Monster Hunter Wilds and FM27',
    description:
      'An archive of official patches and announcements from October 26–November 1, 2026: Phantom Blade Zero’s launch and NVIDIA driver advice, Monster Hunter Wilds Ver. 1.042.00.03 (AMD crash measures), SILENT HILL: Townfall Patch 1.6.0, and AION2 transfers and maintenance.',
    highlights: [
      'Phantom Blade Zero launched at 11:00 JST on October 29 with a roughly 5 GB day-one patch. The developer reported instability with NVIDIA’s latest 621.01 driver and recommends 617.42.',
      'Monster Hunter Wilds Ver. 1.042.00.03 added measures against crashes on some AMD GPUs and communication errors in certain networks.',
      'Football Manager 27’s free Launch Preview runs until 03:00 JST on November 4; careers carry over to the full game.',
    ],
    items: [
      [
        'Released at 11:00 JST; day-one patch and NVIDIA 617.42 recommended',
        'The release unlocked at 11:00 JST on October 29. The game is about 145 GB, with at least 300 GB free needed during pre-load. A roughly 5 GB day-one patch must be installed before launching a pre-load. Citing instability with NVIDIA’s latest 621.01 driver, the developer recommends 617.42 (clean installation) until NVIDIA’s next driver.',
      ],
      [
        'Ver. 1.042.00.03 addressed AMD GPU crashes and communication errors',
        'Measures were added for crashes on some AMD graphics cards and for communication errors that occurred more often in certain network environments. The latest version is required for online multiplayer and DLC. Recommended drivers: NVIDIA 581.57 or newer, AMD 25.9.1 or newer.',
      ],
      [
        'Patch 1.6.0 added a Hard difficulty and DLSS Ray Reconstruction',
        'Released October 28. Balance was adjusted across difficulties, the player’s position now shows on the map in every mode, and The Weight’s attack-severity reduction now applies to Story Mode only. A DLSS Ray Reconstruction option was added on PC. After updating, check for v.1.6.155963 at the lower right of the main menu.',
      ],
      [
        '7.2.2 fixed rare renderer and boot crashes',
        'A rare renderer crash on PC and Xbox and a rare crash on boot were fixed, along with weapon balance and display corrections.',
      ],
      [
        'Server transfers paused, then resumed; level requirement is now 45',
        'Transfers were put on hold while an issue was investigated, then resumed with Europe, with other regions continuing their normal windows. The level requirement to transfer is now 45.',
      ],
      [
        'Scheduled maintenance from 15:30 for about 4.5 hours; North America had temporary maintenance on November 1',
        'Scheduled maintenance ran on October 28. NA East (from 14:30) and NA West (from 17:30) each had about 2.5 hours of temporary maintenance on November 1 for the end of daylight saving time (both completed).',
      ],
      [
        'October 30 fixes for main-story blockers and the friends list',
        'Fixes covered the Waterfall Climb quest in “The Challenge of Fighting Upstream!” that could fail to complete, a friends list that sometimes failed to appear, and a boss that could be defeated in a way that blocked quest progression, among others.',
      ],
      [
        'Free Launch Preview started (until 03:00 JST on November 4)',
        'Free on PC and Mac until 18:00 GMT on November 3; start times can differ by platform. Careers carry over to the paid Launch Preview and the full game. Bugs can be reported in a dedicated area of the SI Forums.',
      ],
    ],
    upcoming: [
      'Release date shown on Steam.',
      'The free period ends at 03:00 JST; pre-purchasers can continue until the full release.',
      'Ludra Awakens update announced; check the official notice for timing.',
      'Release date shown on Steam.',
      'Release date shown on Steam.',
    ],
  },
  '2026-10-19': {
    title:
      'PC Gaming Weekly, October 19–25: HELLDIVERS 2 Anti-Cheat, ACE COMBAT 8 and Dawnwalker 1.1',
    description:
      'An archive of official patches and announcements from October 19–25, 2026: HELLDIVERS 2’s switch from GameGuard to Easy Anti-Cheat, ACE COMBAT 8 Ver. 1.01.002, The Blood of Dawnwalker Update 1.1, a Gears of War: E-Day hotfix and AION2 maintenance.',
    highlights: [
      'HELLDIVERS 2: on October 20 the anti-cheat changed from GameGuard to Easy Anti-Cheat. The developer said some mods may stop working.',
      'ACE COMBAT 8: Ver. 1.01.002 (released October 23) fixed mission progression blockers and several crashes, and added an Async Compute toggle.',
      'The Blood of Dawnwalker: Update 1.1 fixed many crashes and short freezes when saving. The notes warn the game may crash when turning FrameGen on with an RX 9070 XT.',
    ],
    items: [
      [
        'Anti-cheat changed from GameGuard to Easy Anti-Cheat (7.2.0)',
        'Patch 7.2.0 on October 20 replaced GameGuard with Easy Anti-Cheat and added tools against cheat mods. Mods that affect other players may stop working, and some cosmetic mods may need updates from their creators. The patch also fixed crashes when cycling resolutions or render scale.',
      ],
      [
        '7.2.1 fixed a crash when players joined or left the squad',
        'The hotfix addressed one of the main crashes, which occurred when another player joined or left the squad.',
      ],
      [
        'Ver. 1.01.002 (released October 23) fixed progression blockers and some crashes',
        'Fixes covered missions that could not progress, a crash during a chain explosion in MISSION 11, and crashes in aircraft selection and the AIRCRAFT TREE screen. An Async Compute toggle was added under SYSTEM for supported GPUs, and ACE COINS purchases that stalled with the Steam overlay disabled were fixed.',
      ],
      [
        'Standalone ACE COMBAT ZERO released for pre-order bonus owners',
        'It is added to eligible libraries in stages. On the same PC, existing saves carry over automatically regardless of Steam Cloud; to move progress to another PC, enable Steam Cloud before launching. To skip the ZERO launch dialog, choose “Always use this option” or uncheck ACE COMBAT ZERO under DLC in the game’s properties.',
      ],
      [
        'Update 1.1 fixed many crashes and freezes when saving',
        'The update refreshed frame generation with dedicated settings; fixed crashes in dialogue and when loading saves, short freezes when saving or loading, and flickering with DLSS Frame Generation in windowed mode; and added controller deadzone settings. A known issue: the game may crash when switching FrameGen from off to on with an RX 9070 XT. Gore is no longer censored in the Japanese Steam version.',
      ],
      [
        'October 22 hotfix reduced crashes and fixed a sign-in issue',
        'Stability, performance and crash improvements were made on PC and other platforms, and players with incorrect system date/time settings can now sign in. Reports of freezes and crashes during long sessions were still under investigation.',
      ],
      [
        'Hotfix 1.1.3.0 fixed crashes and improved login around error code CH1',
        'Fixes covered crashes during play and a hard lock when a couch co-op party returned to the main menu. Login stability around error code “CH1” was improved.',
      ],
      [
        'Scheduled maintenance from 15:30 for about 5.5 hours',
        'Skill-effect display issues and others were fixed. From 09:30 on October 25, European servers also had about 2.5 hours of temporary maintenance for the end of summer time, with compensation items (seven-day claim window).',
      ],
      [
        'Missing daily-reset items under investigation',
        'Some players did not receive Shugo keys and Nightmare tickets at the October 25 morning (CET) reset. Further account restrictions for abuse were announced on October 21 and 24.',
      ],
      [
        'Released; loadout saving and stats display under official investigation',
        'Activision’s known-issues page (updated October 22) listed loadouts that cannot be saved in Multiplayer, stats not displaying (still tracked), and a missing Campaign/DMZ launch button for some XBOX on PC players.',
      ],
      [
        'Released; minimap reappearing and audio noise under investigation',
        'The launch notice listed a minimap/help display that can reappear after being hidden and occasional audio noise on certain CPU configurations.',
      ],
      [
        'Edgerunners 2 Update (2.5) released',
        'New content inspired by the second Cyberpunk: Edgerunners anime season was added. Detailed changes are in the official patch notes.',
      ],
      [
        'Free Launch Preview from October 29, 18:00 GMT',
        'PC players can play free for five days, to November 3, 18:00 GMT (03:00 JST on October 30 to November 4). Saves started in the free period continue into the paid Launch Preview and the full game.',
      ],
    ],
    upcoming: [
      'Release date shown on Steam.',
      'Free Launch Preview from 03:00 JST (until November 4, 03:00 JST).',
      'Release date shown on Steam.',
      'Ludra Awakens update announced; check the official notice for timing.',
      'Release date shown on Steam.',
      'Release date shown on Steam.',
    ],
  },
  '2026-10-12': {
    title:
      'PC Gaming Weekly, October 12–18: ACE COMBAT 8 Crashes, AION2 and Castlevania',
    description:
      'An archive of official patches and announcements from October 12–18, 2026: the ACE COMBAT 8 crash investigation and virtual-memory workaround, AION2 4K crash fix and Steam payment issue, Castlevania: Belmont’s Curse Ver. 1.1.3 and a Gears of War: E-Day patch.',
    highlights: [
      'ACE COMBAT 8: crashes during play were under investigation. As a temporary workaround, the notice suggested increasing Windows virtual memory (16 GB or more with 32 GB of RAM, 32 GB or more with 16 GB).',
      'AION2: October 14 maintenance fixed crashes at certain refresh rates on 4K monitors. The October 6–12 Steam payment issue was resolved.',
      'Castlevania: Belmont’s Curse: Ver. 1.1.3 addressed a black screen on launch with high-refresh-rate monitors, though it could still occur on some systems.',
    ],
    items: [
      [
        'Crash investigation; more virtual memory could reduce some crashes',
        'The notice said systems with about 48 GB or more of total available memory (RAM plus Windows virtual memory) saw fewer memory-related crashes. Suggested temporary settings: 16 GB or more of virtual memory with 32 GB of RAM, or 32 GB or more with 16 GB. This was not described as a permanent fix; memory-use reduction and further fixes were in progress.',
      ],
      [
        'ACE COMBAT ZERO to become available as a standalone application',
        'ZERO was playable by launching it from ACE COMBAT 8. After the update, a standalone version was also expected, with save data shared through Steam Cloud. The schedule was to be announced after final verification.',
      ],
      [
        'Scheduled maintenance from 15:30 for about four hours, including a 4K monitor crash fix',
        'The update fixed crashes at certain refresh rates on 4K monitors, reduced stuttering in large Abyss battles and added a Y-axis inversion option. Separate platform maintenance from 06:00 the same day made account registration unavailable for about 30 minutes.',
      ],
      [
        'October 6–12 Steam payment issue resolved',
        'Items not delivered after completed payments were delivered, and purchase limits used up by incomplete payments were restored.',
      ],
      [
        'Server transfers have limits and may close early',
        'Transfers into and out of each server were capped, so applications could close before the period ended. Available counts were updated every hour on the hour. Players who could not apply were asked to wait for the next round; servers with excessive requests could close transfers permanently.',
      ],
      [
        'Further account restrictions for abuse',
        'Restrictions for bots and real-money trading were also announced on October 13, 14, 16 and 17. Temporary security locks for suspicious access, which are not penalties, continued. Players locked out unexpectedly were directed to help.plaync.com.',
      ],
      [
        'Ver. 1.1.3 addressed a black screen on launch with high-refresh-rate monitors',
        'The update followed the October 15 release. Improvement was expected, but the issue could still occur on some systems and work toward a full fix continued. Players still unable to launch were directed to KONAMI customer support.',
      ],
      [
        'Released on Steam',
        'The Deluxe Edition includes a digital artbook, soundtrack and Battle BGM Pack, among other items.',
      ],
      [
        'October 14 patch addressed crashes and slowdowns in long sessions',
        'Memory improvements on PC and other platforms targeted crashes and performance degradation during long play sessions; account-linking and login issues were also fixed. Campaign achievements and rewards not always being awarded was a known issue, with players asked to contact aka.ms/GearsSupport.',
      ],
      [
        '1.2 fixed progression blockers and a crash when quitting from the main menu',
        'Fixes covered softlocks in the Utility Tutorial and in Retake Luunata after saving in the elevator, a crash when closing the game from the main menu, and various performance issues.',
      ],
      [
        'Updates without maintenance; restart the game to download',
        'The October 15 update (v1.0.3732728.0) fixed lag when switching in Elite Training and a key-locked door in Operation: Egg Heist that would not open, among other issues. The October 17 update (v1.0.3743667) fixed Tiered Grand Gifts stage 4 rewards that could not be claimed.',
      ],
      [
        'Season 2 (Update 0.2.0) introduced region-based ping limits',
        'On official servers, players who consistently exceed the ping limit are kicked automatically and cannot rejoin the same server until the next map transition; temporary and server-side spikes are excluded. The server browser gained ping-limit tags and filters.',
      ],
    ],
    upcoming: [
      'Transfer applications from full-service servers scheduled to open after maintenance, through October 28.',
      'Release scheduled.',
      'Release date shown on Steam.',
    ],
  },
  '2026-10-05': {
    title:
      'PC Gaming Weekly, October 5–11: AION2 Launch, ACE COMBAT 8 and CONTROL Resonant',
    description:
      'An archive of official patches and announcements from October 5–11, 2026: AION2 launch and transfers, ACE COMBAT 8 matchmaking, and fixes for CONTROL Resonant and Minecraft Dungeons II.',
    highlights: [
      'ACE COMBAT 8: matchmaking difficulties were under investigation, with Windows 11 and SSD installation requested and a bug-fix update in preparation.',
      'AION2 launched October 5. Transfer applications were announced for October 14, with Asia windows of 12:00–16:00 and 18:00–22:00 JST.',
      'CONTROL Resonant 1.4.2 and Minecraft Dungeons II 1.1.2.0 addressed progression blockers and crashes.',
    ],
    items: [
      [
        'Bug-fix update in preparation; matchmaking problems under investigation',
        'The update date and contents were to be announced when decided. The official notice identified connections from systems below requirements as one possible contributor to ACE COMBAT ONLINE matchmaking difficulties and requested Windows 11 and SSD installation.',
      ],
      [
        'Full release on Steam, Xbox on PC and Game Pass',
        'Worldwide release followed early access. The official service-status site is status.gearsofwar.com.',
      ],
      [
        'Base-game update announced, including Hard Mode',
        'An update adding Hard Mode and other changes was planned alongside Dark Arisen. The release date was to be announced through official notices.',
      ],
      [
        'Dark Arisen released',
        'The expansion added the northern region Norgan and a new storyline.',
      ],
      [
        'Hotfix 1.4.2 addressed quest blockers introduced in 1.4.0',
        'Fixes included Zoe disappearing in The House in Distress and being unable to leave the Gap after returning to the main menu immediately after defeating Artist Resonant. The missing Every Dog Has Her Day reward could be claimed retroactively provided New Game+ had not been started.',
      ],
      [
        'Patch 1.4.0 adjusted The Weight and enemy reactions',
        'On Story and Normal difficulties, The Weight’s grab changed from instant death to heavy damage. Enemies reacted less strongly to gunfire and running. The notice instructed players to check for v1.5.154194 at the lower right of the main menu.',
      ],
      [
        'Hotfix 1.1.2.0 fixed crashes during play and when leaving online games',
        'The update addressed various client and server crashes, crashes on leaving online games, and blurred visuals at Ultra graphics quality.',
      ],
      [
        'Full service started at 22:00 as scheduled',
        'Worldwide full service began after maintenance marking the end of early access.',
      ],
      [
        'Scheduled maintenance from 15:30: about 3.5 hours, or 5.5 hours for Asia',
        'Founder’s Pack skins and titles were changed to work across characters and servers. Players encountering purchase errors were advised to close the client and try again.',
      ],
      [
        'European cloud-service outage, emergency maintenance and compensation',
        'An outage affected some European servers on October 8 and was reported resolved. Emergency maintenance ran from 15:30 on October 9 for about 1.5 hours. A Special Daeva Supply chest was offered with a seven-day claim window.',
      ],
      [
        'Server-transfer Q&A published; applications announced for October 14',
        'Transfers from early-access servers were scheduled for October 14–21, and from full-service servers for October 21–28, each starting after scheduled maintenance. Asia application windows were 12:00–16:00 and 18:00–22:00 JST. Applications were unavailable outside those windows or when either server reached its limit.',
      ],
      [
        'Accounts restricted for abuse; suspicious access could also trigger temporary security locks',
        'Accounts violating rules through bots or real-money trading were restricted. Separately, access from a device or connection associated with account-compromise risk could trigger a temporary security lock, which was not a punishment. Players unable to log in were directed to help.plaync.com.',
      ],
      [
        'Galactic Network maintenance from 17:00 for about two hours',
        'The official notice warned that players on a mission when maintenance began could lose rewards.',
      ],
    ],
    upcoming: [
      'Transfer applications scheduled to open from early-access servers; full-service server transfers from October 21.',
      'Release announced by KONAMI.',
      'Release scheduled for 07:00.',
      'Release scheduled.',
      'Release date shown on Steam.',
    ],
  },
  '2026-09-28': {
    title:
      'PC Gaming Weekly, September 28–October 4: ACE COMBAT 8, AION2 and CONTROL Resonant',
    description:
      'Archived official patches and error notices for September 28–October 4, 2026, including ACE COMBAT 8 ST-3100001, AION2 access fixes, CONTROL Resonant progression fixes, Townfall stutter and WARDOGS WD-L020.',
    highlights: [
      'ACE COMBAT 8: Steam crashes were under investigation and a reporting thread was opened. Synchronizing the clock could help with ST-3100001.',
      'CONTROL Resonant: Hotfix 1.4.1 addressed The Park Resonant progression blocker introduced in 1.4.0.',
      'AION2: early-access entitlement recognition was fixed. Full service was scheduled for October 5 at 22:00, after 14:00–22:00 maintenance.',
      'WARDOGS: the WD-L020 crash after Windows 11 update KB5124010 was fixed.',
    ],
    items: [
      [
        'Steam crash investigation announced',
        'The notice advised checking the recommended driver shown at launch, SSD free space (16 GB or more recommended), and whether Windows virtual memory was enabled.',
      ],
      [
        'Official explanation of error ST-3100001',
        'The error indicated lost communication with the ACE COMBAT ONLINE server. Synchronizing the Windows clock could resolve it.',
      ],
      [
        'Official response about HOTAS settings',
        'Some settings available for certain devices in ACE COMBAT 7 were acknowledged to be unavailable in 8. Improvements were under consideration and could take time.',
      ],
      [
        'Standalone release considered for the ACE COMBAT ZERO preorder bonus',
        'The bonus was playable from within 8. A standalone Steam application was under consideration, with feasibility and timing to be announced later.',
      ],
      [
        'Release and a PC crash-reporting thread',
        'The official team requested PC specifications, Windows version, error messages, reproduction steps and other running applications in reports.',
      ],
      [
        'Patch 1.3.1 reduced shader-precompilation stutter',
        'After updating, players were instructed to check for v1.4.153829 in the lower-right corner of the main menu.',
      ],
      [
        'Update 1.4.0 added New Game++ and numerous fixes',
        'Changes included New Game++, build power displayed on the loadout screen and adjustments to combat volume in the Unknown Zone.',
      ],
      [
        'Hotfix 1.4.1 addressed a progression blocker introduced in 1.4.0',
        'The fix addressed being unable to eat Mold as required by The Park Resonant quest, and losing dash momentum during Elevate.',
      ],
      [
        'Early access delayed by 30 minutes, to 22:30',
        'Early access began September 30 at 22:30 JST. Transfers between servers of the same faction were announced for October 14, initially free.',
      ],
      [
        'Emergency maintenance from 15:00 for about 1.5 hours',
        'Maintenance addressed progression stopping when interacting with objects in certain quests. Compensation was distributed afterward.',
      ],
      [
        'Early-access entitlement recognition fixed',
        'In-game purchase problems were also fixed, with the update applied automatically on restart. Account-linking issues remained under investigation.',
      ],
      [
        'Twitch Drops warning: do not link separately through NC’s official website',
        'Doing so could disconnect an existing link and prevent access to a character. Players were advised to link Twitch to the account they were currently using.',
      ],
      [
        'Known issues published, updated October 4',
        'Opening the map’s Duty tab before level 45 could prevent Duty access for the rest of that day even after reaching 45; avoiding the tab until 45 prevented this. The October 4 addition advised switching characters, passing through a loading screen or logging in again for chat failures showing Please Try Again Later.',
      ],
      [
        'Prelaunch maintenance confirmed for October 5, 14:00–22:00',
        'About eight hours of maintenance would end early access and begin full service. Players would disconnect when it started. Timing could change.',
      ],
      [
        'Full-service server list and opposing-server pairings published',
        'Each server contained one faction. Players selected region, faction and server after launch. Servers were paired for a period with an opposing faction’s server for activities including the Abyss.',
      ],
      [
        'Founder’s Pack outfits to become available across all characters and servers',
        'The change responded to difficulties playing with friends on other servers or leveling another class. Implementation timing was to be announced officially.',
      ],
      [
        'Update enabled play on Steam Deck',
        'Problems such as the on-screen keyboard not appearing remained. The emerald cap increased from 9,999 to 99,999 after logging in again.',
      ],
      [
        'Early access started for Premium Edition and the Game Pass Premium Upgrade',
        'Full release was scheduled for October 7 at 00:00 JST. Official service status was available at status.gearsofwar.com.',
      ],
      [
        'Update 0.1.2 fixed WD-L020 crashes',
        'The update fixed WD-L020 crashes following Windows 11 update KB5124010. It also addressed illegitimate experience and money gains, with about one hour of maintenance.',
      ],
      [
        'Maintenance from 17:00 for about an hour for security and stability fixes',
        'The changes addressed minor security and stability issues affecting some players.',
      ],
    ],
    upcoming: [
      'Maintenance announced for 14:00–22:00, subject to change; full service scheduled for 22:00.',
      'Release scheduled for 00:00, also on Game Pass.',
      'Release scheduled.',
      'Release announced by KONAMI.',
      'Release scheduled for 07:00.',
    ],
  },
};
const periods: Record<string, string> = {
  '2026-11-16': 'November 16–22',
  '2026-11-09': 'November 9–15',
  '2026-11-02': 'November 2–8',
  '2026-10-26': 'October 26–November 1',
  '2026-10-19': 'October 19–25',
  '2026-10-12': 'October 12–18',
  '2026-10-05': 'October 5–11',
  '2026-09-28': 'September 28–October 4',
};
export const weeklyKindLabelsEn = {
  patch: 'Patch / fix',
  outage: 'Outage / maintenance',
  error: 'Error code',
  notice: 'Official announcement',
  release: 'Release',
};
export const weeklyReportsEn: WeeklyReport[] = weeklyReports.map((r) => {
  const t = text[r.slug];
  if (
    !t ||
    !periods[r.slug] ||
    t.items.length !== r.items.length ||
    t.upcoming.length !== r.upcoming.length
  )
    throw Error(`Weekly translation parity: ${r.slug}`);
  return {
    ...r,
    title: t.title,
    shortTitle: periods[r.slug],
    period: `${periods[r.slug]}, 2026`,
    description: t.description,
    lead: 'Historical weekly archive of official notices. Dates and times follow the original Japanese edition (JST); statements describe the reporting period, not current service status.',
    highlights: t.highlights,
    items: r.items.map((i, n) => ({
      ...i,
      game: names[i.game] || i.game,
      title: t.items[n][0],
      summary: t.items[n][1],
      article: i.article
        ? { href: `/en${i.article.href}`, label: 'Troubleshooting guide' }
        : undefined,
      source: {
        url: i.source.url,
        label: i.source.url.includes('konami.com')
          ? 'KONAMI: Patch 1.3.1 (Japanese)'
          : i.source.url.includes('support.activision.com')
            ? 'Activision Support: known issues'
            : 'Official Steam news',
      },
    })),
    upcoming: r.upcoming.map((u, n) => ({
      ...u,
      game: names[u.game] || u.game,
      note: t.upcoming[n],
      href: u.href ? `/en${u.href}` : undefined,
    })),
  };
});
