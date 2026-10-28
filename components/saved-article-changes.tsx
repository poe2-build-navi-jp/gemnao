'use client';
import { useSyncExternalStore } from 'react';
import {
  CHANGES_READ_EVENT,
  parseReadChanges,
} from '@/lib/my-game-changes-read';
import { MyGameChanges } from './my-game-changes';
import {
  initializeSavedChanges,
  savedArticleChanges,
  SAVED_CHANGES_KEY,
} from '@/lib/saved-article-changes';
import type { ReadingItem } from '@/lib/reading-list';
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGES_READ_EVENT, callback);
  try {
    initializeSavedChanges(localStorage);
  } catch {
    /* Preserve unreadable storage. */
  }
  callback();
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGES_READ_EVENT, callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(SAVED_CHANGES_KEY);
  } catch {
    return 'unavailable';
  }
}
export function SavedArticleChanges({
  items,
  locale,
}: {
  items: ReadingItem[];
  locale: 'ja' | 'en';
}) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => undefined);
  let state = raw === undefined ? 'loading' : 'ready';
  try {
    if (raw === null || raw === 'unavailable') throw new Error('Unavailable');
    parseReadChanges(raw ?? null);
  } catch {
    state = 'error';
  }
  const en = locale === 'en';
  if (state === 'loading')
    return (
      <p>
        {en ? 'Checking saved-article changes…' : '保存記事の変更記録を確認中…'}
      </p>
    );
  if (state === 'error')
    return (
      <p role="alert">
        {en
          ? 'Change read state is unavailable. Existing saved data was not overwritten.'
          : '変更の既読状態を読み込めません。既存の保存データは上書きしていません。'}
      </p>
    );
  const changes = savedArticleChanges(items, locale);
  return (
    <section
      aria-label={
        en ? 'Important changes to saved articles' : '保存した記事の重要な変更'
      }
    >
      <h3>
        {en
          ? 'Important changes to saved articles'
          : '保存した記事の重要な変更'}
      </h3>
      <p>
        {en
          ? 'Only reviewed change records for your saved article are shown. Existing records start as read on first use; dates alone do not create alerts. Removing and saving again keeps read state.'
          : '保存した記事に対応する確認済みの変更記録だけを表示します。初回は既存の記録を既読として開始し、日付だけで新着にはしません。保存解除・再追加でも既読状態を保ちます。'}
      </p>
      {changes.length ? (
        <MyGameChanges
          changes={changes}
          locale={locale}
          storageKey={SAVED_CHANGES_KEY}
          notesHref={`${en ? '/en' : ''}/my-games#issue-notebook`}
        />
      ) : (
        <p>
          {en
            ? 'No reviewed important changes recorded for these saved articles. This does not mean there are no updates.'
            : '保存記事に対応する重要変更の確認済み記録はありません。更新がないことを保証する表示ではありません。'}
        </p>
      )}
    </section>
  );
}
