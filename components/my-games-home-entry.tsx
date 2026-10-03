'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { Gamepad2 } from 'lucide-react';
import { useMyGames } from '@/components/use-my-pc';
import {
  myGamesCopy,
  myGamesPath,
  type MyGamesLocale,
} from '@/lib/my-games-copy';
export function MyGamesHomeEntry({ locale }: { locale: MyGamesLocale }) {
  const t = myGamesCopy[locale];
  const [saved, , ready] = useMyGames();
  return (
    <section className="my-shortcut" aria-labelledby="my-shortcut-title">
      <h2 id="my-shortcut-title">
        <Gamepad2 size={20} aria-hidden="true" />
        {t.title}
      </h2>
      <p>{t.lead}</p>
      <a className="my-games-primary" href={myGamesPath(locale)}>
        {ready && saved.length ? `${t.return} (${saved.length})` : t.open} →
      </a>
      <p>{t.privacy}</p>
    </section>
  );
}
