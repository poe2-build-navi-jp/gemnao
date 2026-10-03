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
        {hasSaved ? '保存した記事から、続きへ' : '次に困ったとき、探し直さない'}
      </h2>
      <p>
        記事の「あとで読む」と解決ノートをひとまとめに。遊ぶゲームを選ぶと、公式のお知らせも確認できます。ログイン不要・このブラウザだけに保存。
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
        <a href="/my#my-reading-list">
          {hasSaved
            ? `保存した記事 ${items.length}件を開く`
            : 'マイページを使ってみる'}{' '}
          →
        </a>
        {gamesReady && mine.length ? (
          <a href="/my#my-feed">マイゲーム {mine.length}本の最新情報 →</a>
        ) : (
          <a href="/my#my-games">遊ぶゲームを登録する →</a>
        )}
      </div>
    </section>
  );
}
