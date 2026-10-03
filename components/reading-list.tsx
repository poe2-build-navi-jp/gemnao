'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { Bookmark, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import {
  announceReadingListChange,
  useReadingList,
} from '@/components/use-reading-list';
import { removeReadingItem, readingListError } from '@/lib/reading-list';
import { trackReadingAction } from '@/lib/analytics';

export function ReadingList() {
  const { items, ready, error } = useReadingList();
  const [message, setMessage] = useState('');
  return (
    <section
      id="my-reading-list"
      className="reading-list"
      aria-labelledby="reading-list-title"
    >
      <h2 id="reading-list-title">
        <Bookmark size={21} aria-hidden="true" /> あとで読む
        {ready && items.length ? `（${items.length}件）` : ''}
      </h2>
      <p>気になる記事を保存して、ここから再開。このブラウザの保存一覧です。</p>
      {!ready ? (
        <p>保存した記事を確認しています…</p>
      ) : error ? (
        <p role="alert" className="solution-error">
          {error}
        </p>
      ) : items.length ? (
        <ul className="reading-list-items">
          {items.map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                onClick={() => trackReadingAction('saved_article_opened')}
              >
                <span>{item.title}</span>
                <ArrowRight size={17} aria-hidden="true" />
              </a>
              <button
                type="button"
                aria-label={`「${item.title}」をあとで読むから外す`}
                onClick={() => {
                  try {
                    removeReadingItem(localStorage, item.path);
                    announceReadingListChange();
                    setMessage(
                      'あとで読むから外しました。記事を開くと、もう一度保存できます。',
                    );
                  } catch (cause) {
                    setMessage(readingListError(cause));
                  }
                }}
              >
                <X size={17} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="reading-list-empty">
          <p>
            まだ保存した記事はありません。記事の「あとで読むに保存」で追加できます。
          </p>
          <a href="/#articles">
            症状に合う記事を探す <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      )}
      <output className="solution-message" aria-live="polite">
        {message}
      </output>
      <details className="bookmark-help">
        <summary>次回すぐ開けるように、このページをブックマーク</summary>
        <p>
          パソコンは Ctrl + D（Macは Command +
          D）。スマートフォンはブラウザのメニューからブックマークに追加できます。追加方法はブラウザによって異なります。
        </p>
        <p>
          記事・ノート・PCの登録内容は端末間で同期されません。ブラウザのデータを消すと、保存した内容も消えます。
        </p>
      </details>
    </section>
  );
}
