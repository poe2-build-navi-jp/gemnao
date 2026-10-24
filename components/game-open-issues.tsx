'use client';
import { useState } from 'react';
import { useSavedSolutions, announceMyData } from './use-saved-solutions';
import { openIssues, selectOpenIssue, returnCopy } from '@/lib/my-games-return';
import type { MyGamesLocale } from '@/lib/my-games-copy';
export function GameOpenIssues({
  gameSlug,
  locale,
}: {
  gameSlug: string;
  locale: MyGamesLocale;
}) {
  const { items, ready, error } = useSavedSolutions();
  const [failed, setFailed] = useState(false);
  const t = returnCopy[locale];
  const notes = openIssues(items, gameSlug);
  return (
    <section aria-label={t.heading}>
      <h4>{t.heading}</h4>
      {error && <p role="alert">{t.error}</p>}
      {ready && !error && !notes.length && <p>{t.empty}</p>}
      {notes.map((note) => (
        <article key={note.id}>
          <h5>{note.title}</h5>
          {note.support?.attempts.length ? (
            <p>
              {t.last}: {note.support.attempts.at(-1)?.label}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => {
              try {
                if (!selectOpenIssue(localStorage, gameSlug, note.id)) {
                  setFailed(true);
                  announceMyData();
                  return;
                }
                setFailed(false);
                announceMyData();
                const target = document.getElementById('issue-notebook');
                target?.scrollIntoView({ block: 'start' });
                target?.focus({ preventScroll: true });
              } catch {
                setFailed(true);
              }
            }}
          >
            {t.open}: {note.title}
          </button>
        </article>
      ))}
      {failed && <p role="alert">{t.error}</p>}
    </section>
  );
}
