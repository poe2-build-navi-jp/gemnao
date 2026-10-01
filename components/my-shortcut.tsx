'use client';

/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { Cpu } from 'lucide-react';
import { useMyGames, useMyPc } from '@/components/use-my-pc';
import { games } from '@/lib/games';
import { gpuById } from '@/lib/my-pc';

/** Top-page entry to マイPC・マイゲーム (reads the reader's browser only). */
export function MyShortcut() {
  const [pc, , pcReady] = useMyPc();
  const [myGames, , gamesReady] = useMyGames();
  if (!pcReady || !gamesReady) return null;
  const mine = games.filter((game) => myGames.includes(game.slug));
  return (
    <section className="my-shortcut" aria-labelledby="my-shortcut-title">
      <h2 id="my-shortcut-title">
        <Cpu size={18} /> マイPC・マイゲーム
      </h2>
      {pc || mine.length ? (
        <>
          {pc ? (
            <p>
              {gpuById(pc.gpu)?.name}・メモリ{pc.ramGb}GB・Windows {pc.windows}
            </p>
          ) : null}
          {mine.length ? (
            <div className="my-shortcut-games">
              {mine.map((game) => (
                <a href={`/games/${game.slug}`} key={game.slug}>
                  {game.shortTitle}
                </a>
              ))}
            </div>
          ) : null}
          <a href="/my">マイゲームの最新情報を見る</a>
        </>
      ) : (
        <>
          <p>
            PCと遊んでいるゲームを登録すると、新作が動くかの目安と、公式のお知らせ・メンテ情報がまとまります（ログイン不要）。
          </p>
          <a href="/my">登録する</a>
        </>
      )}
    </section>
  );
}
