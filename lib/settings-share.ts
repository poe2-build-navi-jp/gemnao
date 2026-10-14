import {
  settingsFields,
  type SettingsSnapshot,
} from './game-settings-snapshots';
import { gameSettingsCopy } from './game-settings-copy';
import type { MyGamesLocale } from './my-games-copy';
export function settingsShareText(
  gameName: string,
  snapshot: SettingsSnapshot,
  locale: MyGamesLocale,
  includeMemo = false,
) {
  const t = gameSettingsCopy[locale];
  return [
    gameName,
    ...settingsFields
      .filter((k) => k !== 'memo' || includeMemo)
      .filter((k) => snapshot[k].trim())
      .map((k) => `${t[k]}: ${snapshot[k]}`),
    `${t.checkedOn}: ${snapshot.checkedOn || t.blank}`,
  ].join('\n');
}
