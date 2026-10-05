import type { Maintenance } from './sources';

/** Official terminal states only; a missing item or an elapsed window is not proof of recovery. */
export function isActiveOfficialStatus(status: string): boolean {
  return ![
    'resolved',
    'postmortem',
    'completed',
    'cancelled',
    'canceled',
  ].includes(status.toLowerCase());
}

export const maintenanceLabels = {
  upcoming: '予定',
  'scheduled-window': '予定時間内',
  ongoing: '実施中',
  unconfirmed: '終了未確認',
};

export type MaintenanceState =
  | 'upcoming'
  | 'scheduled-window'
  | 'ongoing'
  | 'unconfirmed';

export function currentMaintenance(items: Maintenance[], now: number) {
  return items
    .filter((item) => isActiveOfficialStatus(item.status))
    .map((item) => ({
      ...item,
      state: (Date.parse(item.end) <= now
        ? 'unconfirmed'
        : item.status === 'in_progress'
          ? 'ongoing'
          : Date.parse(item.start) <= now
            ? 'scheduled-window'
            : 'upcoming') as MaintenanceState,
    }))
    .sort((a, b) => a.start.localeCompare(b.start));
}

/** Resolution announcements are not open incidents. Other updates remain reference news only. */
export const resolvedNoticePattern =
  /^(?:\[(?:resolved|completed|cancelled|canceled)\]|(?:scheduled |server )?maintenance (?:is )?(?:over|completed|cancelled|canceled)\b|(?:復旧|終了|完了)(?:済み)?[：:】]|【(?:復旧|終了|完了)(?:済み)?】|メンテナンス(?:終了|完了)のお知らせ)|\[(?:resolved|completed|cancelled|canceled)\]$/i;

/** GetNewsForApp gid is a feed ID, not necessarily a Steam /view/ event ID. */
export function officialSteamNoticeUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.port) return null;
    if (url.username || url.password || url.search || url.hash) return null;
    if (
      (url.hostname === 'steamstore-a.akamaihd.net' &&
        /^\/news\/externalpost\/steam_community_announcements\/\d+$/.test(
          url.pathname,
        )) ||
      (url.hostname === 'store.steampowered.com' &&
        /^\/news\/app\/\d+\/view\/\d+$/.test(url.pathname)) ||
      (url.hostname === 'steamcommunity.com' &&
        /^\/(?:games|ogg)\/\d+\/announcements\/detail\/\d+$/.test(url.pathname))
    )
      return url.href;
  } catch {
    // Invalid or unrelated links cannot be presented as official announcements.
  }
  return null;
}
