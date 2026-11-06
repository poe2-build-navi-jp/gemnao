'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native My Games anchors. */
import { useBrowserRecords } from './use-browser-records';
import { MY_GAMES_KEY } from '@/lib/my-pc';
import { MY_DATA_EVENT } from '@/lib/saved-solutions';
import { parseRegisteredGames } from '@/lib/my-games-selection';
import {
  CHANGES_READ_KEY,
  CHANGES_READ_EVENT,
  parseReadChanges,
} from '@/lib/my-game-changes-read';
import {
  unreadGameUpdates,
  type GameUpdateSummary,
} from '@/lib/game-update-summary';
import { myGamesPath, type MyGamesLocale } from '@/lib/my-games-copy';
const parseRead = (raw: string | null) => parseReadChanges(raw).read;
const copy = {
  ja: {
    heading: '保存ゲームの未読更新',
    japanese: '（日本語）',
    note: 'このブラウザで未読の公式更新です。初回は以前の発表も含みます。',
    all: 'マイゲームで内容を確認',
    error: '保存状態を確認できません。マイゲームで確認してください。',
  },
  en: {
    heading: 'Unread updates for saved games',
    japanese: ' (Japanese)',
    note: 'Official updates not marked as read in this browser. First visits can include older announcements.',
    all: 'Review updates in My Games',
    error: 'Saved state is unavailable. Check My Games.',
  },
  zh: {
    heading: '已保存游戏的未读更新',
    japanese: '（日语）',
    note: '此浏览器尚未标为已读的官方更新。首次访问可能包含较早的公告。',
    all: '在我的游戏中查看',
    error: '无法读取保存状态，请在我的游戏中确认。',
  },
  es: {
    heading: 'Actualizaciones sin leer de tus juegos',
    japanese: ' (japonés)',
    note: 'Anuncios oficiales no marcados como leídos en este navegador. La primera visita puede incluir anuncios antiguos.',
    all: 'Revisar en Mis juegos',
    error: 'No se pudo leer el estado guardado. Consulta Mis juegos.',
  },
};
export function MyGameUpdatesSummary({
  updates = [],
  locale = 'ja',
}: {
  updates?: GameUpdateSummary[];
  locale?: MyGamesLocale;
}) {
  const saved = useBrowserRecords(
    MY_GAMES_KEY,
    MY_DATA_EVENT,
    parseRegisteredGames,
  );
  const read = useBrowserRecords(
    CHANGES_READ_KEY,
    CHANGES_READ_EVENT,
    parseRead,
  );
  const t = copy[locale];
  if (!saved.ready || !read.ready) return null;
  if (saved.error || read.error)
    return (
      <p>
        {t.error} <a href={myGamesPath(locale)}>{t.all} →</a>
      </p>
    );
  const unread = unreadGameUpdates(updates, saved.items, read.items);
  if (!unread.length) return null;
  return (
    <aside className="saved-update-summary" aria-label={t.heading}>
      <h3>
        {t.heading} ({unread.length})
      </h3>
      <p>{t.note}</p>
      <ul>
        {unread.slice(0, 3).map((item) => (
          <li key={item.id}>
            <a href={item.href} lang={item.language || locale}>
              {item.gameTitle}: {item.title}
              {item.language === 'ja' && locale !== 'ja' ? t.japanese : ''}
            </a>{' '}
            <time dateTime={item.publishedOn}>{item.publishedOn}</time>
          </li>
        ))}
      </ul>
      <a href={`${myGamesPath(locale)}#my-feed`}>{t.all} →</a>
    </aside>
  );
}
