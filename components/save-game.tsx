'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { useState } from 'react';
import { Check, Gamepad2 } from 'lucide-react';
import { useMyGames } from '@/components/use-my-pc';
import { MY_GAMES_KEY } from '@/lib/my-pc';
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
  const [message, setMessage] = useState('');
  const saved = myGames.includes(slug);
  return (
    <div className="save-game my-pc-actions">
      <button
        type="button"
        aria-pressed={saved}
        disabled={!ready}
        onClick={() => {
          try {
            // Read at click time so another component/tab's latest choices survive.
            const value: unknown = JSON.parse(
              localStorage.getItem(MY_GAMES_KEY) || '[]',
            );
            if (
              !Array.isArray(value) ||
              !value.every((item) => typeof item === 'string')
            )
              throw new Error(t.corrupt);
            const current = [...new Set(value as string[])];
            const removing = current.includes(slug);
            if (!removing && current.length >= 10) {
              setMessage(t.limit);
              return;
            }
            if (
              !saveGames(
                removing
                  ? current.filter((item) => item !== slug)
                  : [...current, slug],
              )
            )
              throw new Error(t.error);
            if (!removing) trackMyGameAdded();
            setMessage(removing ? t.removed : t.success);
          } catch (error) {
            setMessage(error instanceof Error ? error.message : t.error);
          }
        }}
      >
        {saved ? (
          <Check size={18} aria-hidden="true" />
        ) : (
          <Gamepad2 size={18} aria-hidden="true" />
        )}
        {saved ? `${t.selected} · ${t.remove}` : `${t.name} · ${t.add}`}
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
      <output aria-live="polite">{message}</output>
    </div>
  );
}
