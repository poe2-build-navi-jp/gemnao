'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  announceReadingListChange,
  useReadingList,
} from '@/components/use-reading-list';
import {
  readingListError,
  removeReadingItem,
  saveReadingItem,
} from '@/lib/reading-list';
import { rememberTrouble } from '@/lib/recent-troubles';
import { trackReadingAction } from '@/lib/analytics';

const labels = {
  ja: {
    save: 'あとで読むに保存',
    saved: '保存済み（外す）',
    list: '保存した記事を見る',
    hint: 'ログイン不要。このブラウザだけに保存されます。',
    added: '保存しました。マイページから読み返せます。',
    removed: 'あとで読むから外しました。',
  },
  en: {
    save: 'Save for later',
    saved: 'Saved (remove)',
    list: 'Saved articles (Japanese page)',
    hint: 'No account needed. Saved only in this browser.',
    added: 'Saved. You can reopen this article from My Page.',
    removed: 'Removed from saved articles.',
  },
  zh: {
    save: '保存，稍后阅读',
    saved: '已保存（移除）',
    list: '查看已保存文章（日语页面）',
    hint: '无需登录，仅保存在此浏览器中。',
    added: '已保存，可从个人页面重新打开。',
    removed: '已从保存列表中移除。',
  },
  es: {
    save: 'Guardar para después',
    saved: 'Guardado (quitar)',
    list: 'Artículos guardados (página en japonés)',
    hint: 'Sin cuenta. Se guarda solo en este navegador.',
    added: 'Guardado. Puedes volver a abrirlo desde Mi página.',
    removed: 'Eliminado de los artículos guardados.',
  },
};

export function SaveArticle({
  path,
  title,
  locale = 'ja',
}: {
  path: string;
  title: string;
  locale?: keyof typeof labels;
}) {
  const { items, ready, error } = useReadingList(locale);
  const [message, setMessage] = useState('');
  const saved = items.some((item) => item.path === path);
  const t = labels[locale];
  useEffect(() => {
    try {
      rememberTrouble(localStorage, {
        path,
        title,
        viewedAt: new Date().toISOString(),
      });
      announceReadingListChange();
    } catch {
      /* Storage access may be disabled. */
    }
  }, [path, title]);
  return (
    <div className="save-article">
      <div className="my-pc-actions">
        <button
          type="button"
          disabled={!ready || Boolean(error)}
          aria-pressed={saved}
          onClick={() => {
            try {
              if (saved) {
                removeReadingItem(localStorage, path);
                setMessage(t.removed);
              } else {
                if (saveReadingItem(localStorage, { path, title }))
                  trackReadingAction('article_saved');
                setMessage(t.added);
              }
              announceReadingListChange();
            } catch (cause) {
              setMessage(readingListError(cause, locale));
            }
          }}
        >
          {saved ? (
            <BookmarkCheck size={17} aria-hidden="true" />
          ) : (
            <Bookmark size={17} aria-hidden="true" />
          )}
          {saved ? t.saved : t.save}
        </button>
        <a href="/my#my-reading-list" hrefLang="ja">
          {t.list} →
        </a>
      </div>
      <small>{t.hint}</small>
      <output aria-live="polite">{error || message}</output>
    </div>
  );
}
