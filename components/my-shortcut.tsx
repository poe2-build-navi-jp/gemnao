'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { Bookmark, ArrowRight } from 'lucide-react';
import { useMyGames } from '@/components/use-my-pc';
import { useReadingList } from '@/components/use-reading-list';
import { games } from '@/lib/games';
import { trackReadingAction } from '@/lib/analytics';

/** One returning-reader entry; all counts are this browser's saved items. */
export function MyShortcut() {
  const [myGames, , gamesReady] = useMyGames();
  const { items, ready } = useReadingList();
  const mine = games.filter((game) => myGames.includes(game.slug));
  const hasSaved = ready && items.length > 0;
  return (
    <section className="my-shortcut" aria-labelledby="my-shortcut-title">
      <h2 id="my-shortcut-title">
        <Bookmark size={18} aria-hidden="true" />
        {hasSaved
          ? '保存した記事から、続きへ'
          : '遊ぶゲームの対処法を、自分の一覧に。'}
      </h2>
      <p>
        ゲームを1本選ぶだけで、そのゲームの解決記事をまとめて確認。次に困ったときも、ここからすぐ開けます。無料・アカウント不要・このブラウザだけに保存。
      </p>
      {hasSaved ? (
        <a
          className="my-shortcut-latest"
          href={items[0].path}
          onClick={() => trackReadingAction('saved_article_opened')}
        >
          <span>
            <small>最後に保存した記事</small>
            {items[0].title}
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      ) : null}
      <div className="my-shortcut-actions">
        <a className="my-games-primary" href="/my-games">
          {gamesReady && mine.length
            ? `マイゲーム ${mine.length}本を開く`
            : '自分のゲームを選ぶ'}{' '}
          →
        </a>
        <a href="/my#my-reading-list">
          {hasSaved
            ? `保存した記事 ${items.length}件を開く`
            : 'マイページを使ってみる'}{' '}
          →
        </a>
      </div>
    </section>
  );
}
