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
  const mine = games.filter((game) => myGames.includes(game.slug));
  return (
    <section className="my-shortcut" aria-labelledby="my-shortcut-title">
      <h2 id="my-shortcut-title">
        <Cpu size={18} aria-hidden="true" /> 自分のPC用にまとめる
      </h2>
      <p>
        遊ぶゲームと、診断結果・解決した設定を保存。関連する解決記事や公式のお知らせ・メンテ情報もまとめて確認。
        ログイン不要で、登録内容はこのブラウザにだけ保存されます。
      </p>
      {pcReady && gamesReady && (pc || mine.length) ? (
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
          <a href="/my">マイゲーム・解決ノートを見る →</a>
        </>
      ) : (
        <a href="/my">ゲーム・診断結果を保存する →</a>
      )}
    </section>
  );
}
