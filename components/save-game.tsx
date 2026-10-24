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
        {saved ? t.selected : `${t.name} · ${t.add}`}
      </button>
      <a href={`${myGamesPath(locale)}#my-feed`}>{t.return} →</a>
      <small className="save-game-benefit">
        {locale === 'ja'
          ? 'このゲームの対処法を、次回もすぐ開く。アカウント不要・このブラウザのみ。'
          : locale === 'en'
            ? 'Keep this game’s fixes handy. No account. This browser only.'
            : locale === 'zh'
              ? '下次直接打开这款游戏的解决方法。无需账号，仅保存在当前浏览器。'
              : 'Ten a mano las soluciones de este juego. Sin cuenta. Solo en este navegador.'}
      </small>
      <MyGamesNotice notice={message} locale={locale} />
    </div>
  );
}
