'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links match existing My Games navigation. */
import { useState, useSyncExternalStore } from 'react';
import type { VisibleGameChange } from '@/lib/my-game-changes';
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { gameChangesCopy } from '@/lib/my-game-changes-copy';
import {
  CHANGES_READ_KEY,
  CHANGES_READ_EVENT,
  parseReadChanges,
  setChangeRead,
} from '@/lib/my-game-changes-read';
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGES_READ_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGES_READ_EVENT, callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(CHANGES_READ_KEY);
  } catch {
    return 'unavailable';
  }
}
const serverSnapshot = () => undefined;
export function MyGameChanges({
  changes = [],
  locale,
}: {
  changes?: VisibleGameChange[];
  locale: MyGamesLocale;
}) {
  const t = gameChangesCopy[locale];
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [message, setMessage] = useState('');
  let read: string[] = [];
  let invalid = false;
  try {
    read = parseReadChanges(raw ?? null).read;
  } catch {
    invalid = true;
  }
  return (
    <div className="my-game-changes">
      <h4>{t.heading}</h4>
      {!changes.length && <p>{t.empty}</p>}
      {invalid && !!changes.length && <p role="alert">{t.error}</p>}
      {changes.map((item) => {
        const isRead = read.includes(item.id);
        return (
          <section
            className="my-game-change"
            key={item.id}
            aria-labelledby={`change-${item.id}`}
          >
            <h5 id={`change-${item.id}`} lang={item.copyLocale}>
              {item.copy.title}
            </h5>
            <p className="my-game-change-state">
              {raw === undefined
                ? t.loading
                : invalid
                  ? t.unknown
                  : isRead
                    ? t.read
                    : t.unread}
            </p>
            {item.copyLocale !== locale && <p>{t.fallback}</p>}
            <dl>
              <div>
                <dt>{t.published}</dt>
                <dd>
                  <time dateTime={item.publishedOn}>{item.publishedOn}</time>
                </dd>
              </div>
              <div>
                <dt>{t.checked}</dt>
                <dd>
                  <time dateTime={item.checkedOn}>{item.checkedOn}</time>
                </dd>
              </div>
            </dl>
            <p>
              <strong>{t.condition}</strong>
              <br />
              <span lang={item.copyLocale}>{item.copy.condition}</span>
            </p>
            <p>
              <strong>{t.change}</strong>
              <br />
              <span lang={item.copyLocale}>{item.copy.change}</span>
            </p>
            <p>
              <strong>{t.check}</strong>
              <br />
              <span lang={item.copyLocale}>{item.copy.check}</span>
            </p>
            <ul>
              <li>
                <a
                  href={item.sourceUrl}
                  hrefLang={item.sourceLanguage || 'ja'}
                  rel="noreferrer"
                >
                  {item.sourceLanguage === 'en' ? t.sourceEnglish : t.source}
                </a>
              </li>
              <li>
                <a
                  href={item.articleHref}
                  hrefLang={item.articleJapanese ? 'ja' : locale}
                >
                  {t.guide}
                  {item.articleJapanese ? t.ja : ''}
                </a>
              </li>
              <li>
                <a href="#issue-notebook">{t.notes}</a>
              </li>
            </ul>
            <button
              type="button"
              disabled={raw === undefined || invalid}
              aria-label={`${isRead ? t.markUnread : t.markRead}: ${item.copy.title}`}
              onClick={() => {
                try {
                  setChangeRead(localStorage, item.id, !isRead);
                  setMessage(t.saved);
                } catch {
                  setMessage(t.error);
                }
                window.dispatchEvent(new Event(CHANGES_READ_EVENT));
              }}
            >
              {isRead ? t.markUnread : t.markRead}
            </button>
          </section>
        );
      })}
      <output aria-live="polite">{message}</output>
    </div>
  );
}
