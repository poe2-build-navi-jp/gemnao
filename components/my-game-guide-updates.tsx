'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links preserve saved-state navigation. */
import { useState } from 'react';
import { useMyGames } from './use-my-pc';
import { useBrowserRecords } from './use-browser-records';
import { parseReadChanges, setChangeRead } from '@/lib/my-game-changes-read';
import type { GuideUpdate } from '@/lib/guide-updates';
import {
  GUIDE_UPDATES_READ_KEY,
  GUIDE_UPDATES_READ_EVENT,
} from '@/lib/guide-updates-read';
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { trackEvent } from '@/lib/analytics';
const parse = (raw: string | null) => parseReadChanges(raw).read;
const copy = {
  ja: {
    title: '保存ゲームの記事の更新',
    note: 'ゲムなおの記事の編集・資料確認記録です。ゲーム公式のパッチ情報とは別です。初回は過去の記事も表示します。自動通知はありません。',
    edited: '本文更新',
    reviewed: '資料確認',
    read: '確認済みにする',
    empty:
      '未読の更新はありません。ゲームを保存すると、そのゲームの記事をここで確認できます。',
    error: '既読状態を保存できません。記事はそのまま開けます。',
    all: '確認済みも表示',
    unread: '未読のみ表示',
    saved: '確認済みにしました。',
  },
  en: {
    title: 'Guide updates for your saved games',
    note: 'Gemnao edits and source-review records, separate from official game patches. Older guides appear on the first visit. No automatic notifications.',
    edited: 'Content edited',
    reviewed: 'Sources reviewed',
    read: 'Mark as read',
    empty: 'No unread guides. Save a game to see its guide updates here.',
    error: 'Read status could not be saved. You can still open the guides.',
    all: 'Include read guides',
    unread: 'Show unread only',
    saved: 'Marked as read.',
  },
  zh: {
    title: '已保存游戏的文章更新',
    note: '这里是Gemnao文章的编辑与资料核对记录，与游戏官方补丁分开。首次访问包含较早文章，不会自动通知。',
    edited: '正文更新',
    reviewed: '资料核对',
    read: '标为已读',
    empty: '没有未读文章。保存游戏后可在这里查看文章更新。',
    error: '无法保存已读状态，仍可打开文章。',
    all: '包含已读文章',
    unread: '只看未读',
    saved: '已标为已读。',
  },
  es: {
    title: 'Guías actualizadas de tus juegos',
    note: 'Ediciones y revisiones de fuentes de Gemnao, separadas de los parches oficiales. La primera visita incluye guías anteriores. Sin avisos automáticos.',
    edited: 'Contenido editado',
    reviewed: 'Fuentes revisadas',
    read: 'Marcar como leída',
    empty: 'No hay guías sin leer. Guarda un juego para ver sus guías aquí.',
    error: 'No se pudo guardar el estado. Puedes abrir las guías igualmente.',
    all: 'Incluir guías leídas',
    unread: 'Solo sin leer',
    saved: 'Marcada como leída.',
  },
};
export function MyGameGuideUpdates({
  updates,
  locale = 'ja',
}: {
  updates: GuideUpdate[];
  locale?: MyGamesLocale;
}) {
  const [saved, , ready] = useMyGames();
  const read = useBrowserRecords(
    GUIDE_UPDATES_READ_KEY,
    GUIDE_UPDATES_READ_EVENT,
    parse,
  );
  const [includeRead, setIncludeRead] = useState(false);
  const [message, setMessage] = useState('');
  const t = copy[locale];
  const items = updates
    .filter(
      (u) =>
        saved.includes(u.gameSlug) &&
        (includeRead || !read.items.includes(u.id)),
    )
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  if (!ready || !read.ready) return null;
  return (
    <section
      className="saved-guide-updates"
      id="my-guide-updates"
      aria-labelledby="guide-updates-heading"
    >
      <h2 id="guide-updates-heading">{t.title}</h2>
      <p>{t.note}</p>
      {read.error && <p role="alert">{t.error}</p>}
      <button
        type="button"
        aria-pressed={includeRead}
        onClick={() => setIncludeRead(!includeRead)}
      >
        {includeRead ? t.unread : t.all}
      </button>
      {!items.length && <p>{t.empty}</p>}
      <ul>
        {items.slice(0, 12).map((u) => (
          <li key={u.id}>
            <a
              href={u.href}
              onClick={() =>
                trackEvent('game_guide_update_opened', {
                  page_location: 'https://gemnao.pages.dev/my-games',
                  page_title: 'My Games updates',
                  page_referrer: '',
                })
              }
            >
              {u.gameName}: {u.title}
            </a>
            <p>
              {u.kind === 'edited' ? t.edited : t.reviewed}:{' '}
              <time dateTime={u.date}>{u.date}</time>
            </p>
            {!read.items.includes(u.id) && (
              <button
                type="button"
                disabled={read.error}
                aria-label={`${t.read}: ${u.title}`}
                onClick={() => {
                  try {
                    setChangeRead(
                      localStorage,
                      u.id,
                      true,
                      GUIDE_UPDATES_READ_KEY,
                    );
                    window.dispatchEvent(new Event(GUIDE_UPDATES_READ_EVENT));
                    setMessage(t.saved);
                  } catch {
                    setMessage(t.error);
                  }
                }}
              >
                {t.read}
              </button>
            )}
          </li>
        ))}
      </ul>
      <output aria-live="polite">{message}</output>
    </section>
  );
}
