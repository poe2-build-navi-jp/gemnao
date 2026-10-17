'use client';

/* oxlint-disable next/no-html-link-for-pages -- Native links keep article fragments. */
import { useState } from 'react';
import { games } from '@/lib/games';
import { gameDisplayName } from '@/lib/game-display-name';
import { supportCopy, type SupportLocale } from '@/lib/support-copy';
import { matchingUpdates, markUpdatesRead } from '@/lib/support-updates';
import { announceMyData, useSavedSolutions } from './use-saved-solutions';

// Official updates that match the reader's private notebook. Kept apart from
// support-workspace.tsx so pages that only show updates (the home page) do
// not load the notebook form and its article data.
export function SupportUpdates({
  locale = 'ja',
  createHref,
}: {
  locale?: SupportLocale;
  createHref: string;
}) {
  const t = supportCopy[locale];
  const { items, ready, error } = useSavedSolutions();
  const [failed, setFailed] = useState(false);
  const matches = items.flatMap((item) =>
    matchingUpdates(item).map((update) => ({ item, update })),
  );
  return (
    <section className="support-workspace" aria-label={t.updates}>
      <h2>{t.updates}</h2>
      <p>{t.updateHint}</p>
      {ready &&
        !error &&
        !matches.length &&
        (!items.length ? (
          <p>
            {t.noRecords} <a href={createHref}>{t.create} →</a>
          </p>
        ) : (
          <p>
            {items.every((item) => item.status === 'resolved')
              ? t.noUnresolved
              : t.emptyUpdates}
          </p>
        ))}
      {(error || failed) && <p role="alert">{t.error}</p>}
      {matches.map(({ item, update }) => (
        <article key={`${item.id}:${update.id}`}>
          <h3>
            {item.title} — {t[update.kind]}
          </h3>
          <p>
            {gameDisplayName(
              games.find((g) => g.slug === item.gameSlug),
              locale,
            )}
          </p>
          <p>{update.text[locale]}</p>
          <p>
            {t.verified}: {update.verifiedOn}
          </p>
          <a href={update.sourceUrl} rel="noreferrer">
            {t.evidence}
          </a>
        </article>
      ))}
      {!!matches.length && (
        <button
          type="button"
          onClick={() => {
            try {
              markUpdatesRead(
                localStorage,
                items.map((item) => ({
                  id: item.id,
                  updates: matches
                    .filter((m) => m.item.id === item.id)
                    .map((m) => m.update.id),
                })),
              );
              setFailed(false);
            } catch {
              setFailed(true);
            } finally {
              announceMyData();
            }
          }}
        >
          {t.mark}
        </button>
      )}
    </section>
  );
}
