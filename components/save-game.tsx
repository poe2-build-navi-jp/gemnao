'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { useState } from 'react';
import { Check, Gamepad2 } from 'lucide-react';
import { useMyGames } from '@/components/use-my-pc';
import {
  changeMyGames,
  type MyGamesNotice as Notice,
} from '@/lib/my-games-selection';
import { MyGamesNotice } from '@/components/my-games-notice';
import { trackMyGameAdded } from '@/lib/analytics';
import {
  myGamesCopy,
  myGamesPath,
  type MyGamesLocale,
} from '@/lib/my-games-copy';

export function SaveGame({
  slug,
  locale = 'ja',
}: {
  slug: string;
  locale?: MyGamesLocale;
}) {
  const t = myGamesCopy[locale];
  const [myGames, saveGames, ready] = useMyGames();
  const [message, setMessage] = useState<Notice | null>(null);
  const saved = myGames.includes(slug);
  return (
    <div className="save-game my-pc-actions">
      <p className="save-game-benefit">{saved ? t.savedNext : t.saveBenefit}</p>
      <button
        type="button"
        aria-pressed={saved}
        disabled={!ready}
        onClick={() => {
          const result = changeMyGames(
            () => localStorage,
            saveGames,
            slug,
            'add',
          );
          setMessage(result);
          if (result.added) trackMyGameAdded();
        }}
      >
        {saved ? (
          <Check size={18} aria-hidden="true" />
        ) : (
          <Gamepad2 size={18} aria-hidden="true" />
        )}
        {saved ? `${t.name} · ${t.selected}` : t.saveAction}
      </button>
      <a href={`${myGamesPath(locale)}${saved ? `#my-game-${slug}` : '#my-games'}`}>
        {saved ? t.return : t.previewLink} →
      </a>
      <MyGamesNotice notice={message} locale={locale} />
      {saved && <a href={`${myGamesPath(locale)}#my-guide-updates`}>
        {{ ja: 'このゲームの記事の更新を見る', en: 'See guide updates for saved games', zh: '查看已保存游戏的文章更新', es: 'Ver guías actualizadas de tus juegos' }[locale]} →
      </a>}
    </div>
  );
}
