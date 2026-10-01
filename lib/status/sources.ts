// What the status board (/status) watches. Only official sources are used:
// the Discord status page API, each game's official Steam announcements, and
// maintenance windows copied from an official notice (with its link).

/** Steam app id of the game itself, for official announcements. */
export const steamAppIds: Record<string, string> = {
  aniimo: '4126040',
  'onimusha-way-of-the-sword': '2638890',
  'the-blood-of-dawnwalker': '3751260',
  'star-wars-zero-company': '2075800',
  'gears-of-war-e-day': '3010850',
  'dragons-dogma-2': '2054970',
  'final-fantasy-resonance': '3259780',
  'call-of-duty-modern-warfare-4': '4435490',
  'control-resonant': '3669870',
  'silent-hill-townfall': '1636440',
  'minecraft-dungeons-2': '1912410',
  aion2: '3393110',
  'ace-combat-8': '2288340',
  'shin-sangoku-musou-2-remastered': '3841510',
  wardogs: '1867240',
  'monster-hunter-wilds': '2246340',
  palworld: '1623730',
  'elden-ring': '1245620',
  'cyberpunk-2077': '1091500',
  'baldurs-gate-3': '1086940',
  'helldivers-2': '553850',
  'hogwarts-legacy': '990080',
  'gta-v-enhanced': '3240220',
  'skyrim-special-edition': '489830',
  'stardew-valley': '413150',
};

export type Maintenance = {
  gameSlug: string;
  title: string;
  /** ISO 8601 with offset. */
  start: string;
  end: string;
  note?: string;
  source: { label: string; url: string };
};

// Scheduled maintenance from official notices. Remove entries a few days
// after they end; never add a window that is not in an official notice.
export const maintenanceSchedule: Maintenance[] = [
  {
    gameSlug: 'aion2',
    title: 'アーリーアクセス終了後のメンテナンス（正式サービス開始前）',
    start: '2026-10-05T14:00:00+09:00',
    end: '2026-10-05T22:00:00+09:00',
    note: '時間は変更される場合があると公式が案内しています。',
    source: {
      label: 'Steamニュース（公式）：Advanced Access Servers',
      url: 'https://store.steampowered.com/news/app/3393110',
    },
  },
];

/** Status pages people check first, shown on /status. */
export const officialStatusPages = [
  {
    name: 'Discord',
    url: 'https://discordstatus.com/',
    note: 'Discord公式の稼働状況ページ（このページでも自動で表示）',
  },
  {
    name: 'Steam',
    url: 'https://help.steampowered.com/',
    note: 'Steamには公式の稼働状況ページがありません。障害の告知はSteamサポートと公式X（@Steam）で行われます',
  },
  {
    name: 'Xbox（Game Pass・Xboxアプリ）',
    url: 'https://support.xbox.com/xbox-live-status',
    note: 'Xbox公式のサービス状況',
  },
  {
    name: 'PlayStation Network（PC版でPSNを使うゲーム）',
    url: 'https://status.playstation.com/',
    note: 'PlayStation公式のサービス状況',
  },
  {
    name: 'EA app',
    url: 'https://help.ea.com/jp/',
    note: 'EA公式ヘルプ（サーバー状況はゲームごとに案内）',
  },
];

/** Announcement titles that usually mean an outage, maintenance or fix. */
export const noticePattern =
  /\b(?:maintenance|outage|servers?|downtime|known issues?|hotfix|patch(?:es)?|patch notes|update|notice|issues?|bugs?|crash(?:es)?|fix(?:es|ed)?)\b|メンテ|障害|不具合|修正|お知らせ|アップデート|維護|维护/i;
