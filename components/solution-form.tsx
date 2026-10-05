'use client';

import { useRef, useState } from 'react';
import { emptySupport, type Attempt } from '@/lib/support-record';
import { supportCopy, type SupportLocale } from '@/lib/support-copy';
import { games } from '@/lib/games';
import {
  readSolutions,
  solutionError,
  statusLabels,
  upsertSolution,
  type SavedSolution,
  type SolutionDraft,
  type SolutionStatus,
} from '@/lib/saved-solutions';
import { announceMyData } from '@/components/use-saved-solutions';

export function SolutionForm({
  initial,
  id,
  attempt,
  onSaved,
  onCancel,
  locale = 'ja',
}: {
  locale?: SupportLocale;
  initial: SolutionDraft;
  id?: string;
  attempt?: Attempt;
  onSaved: (item: SavedSolution) => void;
  onCancel: () => void;
}) {
  const t = supportCopy[locale];
  const stableId = useRef(id);
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState('');
  function field<K extends keyof SolutionDraft>(
    key: K,
    value: SolutionDraft[K],
  ) {
    setDraft((previous) => ({ ...previous, [key]: value }));
  }
  return (
    <form
      className="solution-form"
      onSubmit={(event) => {
        event.preventDefault();
        try {
          const now = new Date().toISOString();
          const previous = stableId.current
            ? readSolutions(localStorage).find(
                (item) => item.id === stableId.current,
              )
            : undefined;
          stableId.current ||= crypto.randomUUID();
          const item: SavedSolution = {
            ...draft,
            ...(previous?.support ? { support: previous.support } : {}),
            title: draft.title.trim(),
            id: stableId.current,
            createdAt: previous?.createdAt || now,
            updatedAt: now,
          };
          if (id && !previous) throw new Error('missing-record');
          if (attempt) {
            const support = previous?.support || emptySupport();
            item.support = {
              ...support,
              attempts: [
                ...support.attempts.filter(
                  (a) => a.path !== attempt.path || a.stepId !== attempt.stepId,
                ),
                attempt,
              ],
            };
          }
          upsertSolution(localStorage, item);
          announceMyData();
          onSaved(item);
        } catch (caught) {
          setError(locale === 'ja' ? solutionError(caught) : t.error);
        }
      }}
    >
      <label>
        {t.title}
        <input
          value={draft.title}
          maxLength={200}
          required
          onChange={(event) => field('title', event.target.value)}
        />
      </label>
      <div className="solution-form-row">
        <label>
          {t.game}
          <select
            aria-label={t.game}
            value={draft.gameSlug}
            onChange={(event) => field('gameSlug', event.target.value)}
          >
            <option value="">{t.other}</option>
            {games.map((game) => (
              <option value={game.slug} key={game.slug}>
                {game.shortTitle}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.status}
          <select
            aria-label={t.status}
            value={draft.status}
            onChange={(event) =>
              field('status', event.target.value as SolutionStatus)
            }
          >
            {Object.keys(statusLabels).map((value) => (
              <option value={value} key={value}>
                {t[value as SolutionStatus]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        {t.diagnosis}
        <textarea
          rows={3}
          value={draft.diagnosis}
          maxLength={4000}
          required
          onChange={(event) => field('diagnosis', event.target.value)}
        />
      </label>
      <label>
        {t.settings}
        <textarea
          rows={3}
          value={draft.settings}
          maxLength={4000}
          onChange={(event) => field('settings', event.target.value)}
        />
      </label>
      <label>
        {t.notes}
        <textarea
          rows={3}
          value={draft.notes}
          maxLength={4000}
          onChange={(event) => field('notes', event.target.value)}
        />
      </label>
      {draft.completedSteps.length ? (
        <p className="solution-hint">
          {t.completed}: {draft.completedSteps.join('／')}
        </p>
      ) : null}
      <p className="solution-hint">{t.local}</p>
      <div className="my-pc-actions">
        <button type="submit">{t.save}</button>
        <button className="secondary" type="button" onClick={onCancel}>
          {t.cancel}
        </button>
      </div>
      {error ? (
        <p role="alert" className="solution-error">
          {error}
        </p>
      ) : null}
    </form>
  );
}
