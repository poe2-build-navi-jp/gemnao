import { weeklyReports, type WeeklyReport } from '@/lib/weekly-reports';
const names: Record<string, string> = {
  エースコンバット8: 'ACE COMBAT 8',
  ドラゴンズドグマ2: 'Dragon’s Dogma 2',
  'ドラゴンズドグマ2 ダークアリズン': 'Dragon’s Dogma 2: Dark Arisen',
  'テイルズ オブ エターニア リマスター': 'Tales of Eternia Remastered',
  'Call of Duty: Modern Warfare 4・ファイナルファンタジー レゾナンス':
    'Call of Duty: Modern Warfare 4 / Final Fantasy Resonance',
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
    t.items.length !== r.items.length ||
    t.upcoming.length !== r.upcoming.length
  )
    throw Error(`Weekly translation parity: ${r.slug}`);
  return {
    ...r,
    title: t.title,
    shortTitle:
      r.slug === '2026-10-05' ? 'October 5–11' : 'September 28–October 4',
    period:
      r.slug === '2026-10-05'
        ? 'October 5–11, 2026'
        : 'September 28–October 4, 2026',
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
