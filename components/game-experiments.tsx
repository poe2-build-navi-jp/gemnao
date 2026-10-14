'use client';
/* oxlint-disable next/no-html-link-for-pages -- Existing notebook uses native links. */
import { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import {
  GAME_EXPERIMENTS_KEY,
  GAME_EXPERIMENTS_EVENT,
  parseGameExperiments,
  saveGameExperiment,
  deleteGameExperiment,
  emptyExperiment,
  ExperimentError,
  type ExperimentDecision,
} from '@/lib/game-experiments';
import {
  settingsFields,
  localDay,
  type SettingsSnapshot,
} from '@/lib/game-settings-snapshots';
import { gameExperimentsCopy } from '@/lib/game-experiments-copy';
import { gameSettingsCopy } from '@/lib/game-settings-copy';
import type { MyGamesLocale } from '@/lib/my-games-copy';
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(GAME_EXPERIMENTS_EVENT, callback);
  window.addEventListener('pageshow', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(GAME_EXPERIMENTS_EVENT, callback);
    window.removeEventListener('pageshow', callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(GAME_EXPERIMENTS_KEY);
  } catch {
    return '!unavailable';
  }
}
const serverSnapshot = () => undefined;
function announce() {
  window.dispatchEvent(new Event(GAME_EXPERIMENTS_EVENT));
}
export function GameExperiments({
  gameSlug,
  locale,
  snapshots,
  snapshotsReady,
  snapshotsError,
}: {
  gameSlug: string;
  locale: MyGamesLocale;
  snapshots: SettingsSnapshot[];
  snapshotsReady: boolean;
  snapshotsError: boolean;
}) {
  const t = gameExperimentsCopy[locale],
    s = gameSettingsCopy[locale];
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const state = useMemo(() => {
    try {
      return { items: parseGameExperiments(raw ?? null), error: '' };
    } catch {
      return { items: [], error: raw === '!unavailable' ? t.error : t.invalid };
    }
  }, [raw, t]);
  const mine = state.items.filter((item) => item.gameSlug === gameSlug);
  const [draft, setDraft] = useState(emptyExperiment);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const summary = useRef<HTMLElement>(null);
  const ready = raw !== undefined;
  function report(error: unknown) {
    setFailed(true);
    setMessage(
      error instanceof ExperimentError
        ? t[
            error.code === 'empty'
              ? 'emptyError'
              : error.code === 'reference'
                ? 'referenceError'
                : error.code
          ]
        : t.error,
    );
  }
  function title(ref: SettingsSnapshot) {
    return `${ref.name || s.untitled} — ${ref.checkedOn || ref.createdAt.slice(0, 10)} · ${ref.id.slice(-6)}`;
  }
  function reference(ref: SettingsSnapshot | null, side: 'before' | 'after') {
    if (!ref)
      return (
        <p>
          {t[side]}: {t.snapshotNone}
        </p>
      );
    return (
      <details className={`experiment-reference experiment-${side}`}>
        <summary>
          {t[side]}: {title(ref)}
        </summary>
        <p>{t.archived}</p>
        {snapshotsError ? (
          <p>{t.referenceUnknown}</p>
        ) : snapshotsReady && !snapshots.some((item) => item.id === ref.id) ? (
          <p>{t.referenceMissing}</p>
        ) : null}
        <p>
          {t.snapshotId}: <code>{ref.id}</code>
        </p>
        <dl>
          {settingsFields.map((field) => (
            <div key={field}>
              <dt>{s[field]}</dt>
              <dd>{ref[field] === '' ? t.blank : ref[field]}</dd>
            </div>
          ))}
          <div>
            <dt>{s.checkedOn}</dt>
            <dd>{ref.checkedOn || t.blank}</dd>
          </div>
          <div>
            <dt>{s.comfortable}</dt>
            <dd>{ref.comfortable ? s.comfortable : s.comfortUnknown}</dd>
          </div>
        </dl>
      </details>
    );
  }
  return (
    <details className="game-experiments" data-game={gameSlug}>
      <summary ref={summary}>
        {t.heading} ({ready && !state.error ? mine.length : '—'})
      </summary>
      <p>{t.intro}</p>
      <p>{t.revertHint}</p>
      <p>{t.retention}</p>
      {!ready && <p>{t.loading}</p>}
      {state.error && <p role="alert">{state.error}</p>}
      {ready && !state.error && !mine.length && <p>{t.empty}</p>}
      <details className="experiment-new">
        <summary>{t.create}</summary>
        <p>{t.optional}</p>
        <form
          onChange={() => {
            setMessage('');
            setFailed(false);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            try {
              saveGameExperiment(
                localStorage,
                gameSlug,
                draft,
                crypto.randomUUID(),
              );
              setDraft(emptyExperiment());
              setDeleteId('');
              setFailed(false);
              setMessage(t.saved);
            } catch (error) {
              report(error);
            }
            announce();
          }}
        >
          <label>
            {t.changed}
            <input
              aria-label={t.changed}
              maxLength={200}
              value={draft.changed}
              onChange={(e) => setDraft({ ...draft, changed: e.target.value })}
            />
          </label>
          <label>
            {t.purpose}
            <input
              aria-label={t.purpose}
              maxLength={200}
              placeholder={t.purposeHint}
              value={draft.purpose}
              onChange={(e) => setDraft({ ...draft, purpose: e.target.value })}
            />
          </label>
          {snapshotsError ? (
            <p>{t.referenceError}</p>
          ) : snapshotsReady && !snapshots.length ? (
            <p>{t.snapshotsEmpty}</p>
          ) : null}
          {(['before', 'after'] as const).map((side) => {
            const key = side === 'before' ? 'beforeId' : 'afterId';
            return (
              <label key={side}>
                {t[side]}
                <select
                  aria-label={t[side]}
                  value={draft[key]}
                  disabled={!snapshotsReady}
                  onChange={(e) =>
                    setDraft({ ...draft, [key]: e.target.value })
                  }
                >
                  <option value="">{t.none}</option>
                  {draft[key] &&
                    !snapshots.some((item) => item.id === draft[key]) && (
                      <option value={draft[key]}>{t.referenceMissing}</option>
                    )}
                  {snapshots.map((item) => (
                    <option value={item.id} key={item.id}>
                      {title(item)}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
          <p>{t.fpsHint}</p>
          {(['fpsBefore', 'fpsAfter'] as const).map((field) => (
            <label key={field}>
              {t[field]}
              <input
                aria-label={t[field]}
                type="number"
                min="0"
                max="99999.99"
                step="0.01"
                value={draft[field]}
                onChange={(e) =>
                  setDraft({ ...draft, [field]: e.target.value })
                }
              />
            </label>
          ))}
          <label>
            {t.result}
            <textarea
              aria-label={t.result}
              rows={4}
              maxLength={2000}
              value={draft.result}
              onChange={(e) => setDraft({ ...draft, result: e.target.value })}
            />
          </label>
          <label>
            {t.performedOn}
            <input
              aria-label={t.performedOn}
              type="date"
              max={ready ? localDay() : undefined}
              value={draft.performedOn}
              onChange={(e) =>
                setDraft({ ...draft, performedOn: e.target.value })
              }
            />
          </label>
          <label>
            {t.decision}
            <select
              aria-label={t.decision}
              value={draft.decision}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  decision: e.target.value as ExperimentDecision,
                })
              }
            >
              {(['pending', 'adopt', 'revert'] as const).map((value) => (
                <option key={value} value={value}>
                  {t[value]}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={!ready || !!state.error}>
            {t.save}
          </button>
        </form>
      </details>
      <output
        className="experiment-message"
        role={failed ? 'alert' : 'status'}
        aria-live="polite"
      >
        {message}
      </output>
      <div className="experiment-list">
        {mine.map((item) => (
          <article className="experiment-record" key={item.id}>
            <h4>{item.changed || t.untitled}</h4>
            <p>
              {t.createdAt}:{' '}
              <time dateTime={item.createdAt}>{item.createdAt}</time>
            </p>
            <dl>
              <div>
                <dt>{t.changed}</dt>
                <dd>{item.changed || t.blank}</dd>
              </div>
              <div>
                <dt>{t.purpose}</dt>
                <dd>{item.purpose || t.blank}</dd>
              </div>
              <div>
                <dt>{t.performedOn}</dt>
                <dd>
                  {item.performedOn ? (
                    <time dateTime={item.performedOn}>{item.performedOn}</time>
                  ) : (
                    t.blank
                  )}
                </dd>
              </div>
              <div>
                <dt>{t.fpsBefore}</dt>
                <dd>{item.fpsBefore === '' ? t.unmeasured : item.fpsBefore}</dd>
              </div>
              <div>
                <dt>{t.fpsAfter}</dt>
                <dd>{item.fpsAfter === '' ? t.unmeasured : item.fpsAfter}</dd>
              </div>
              <div>
                <dt>{t.result}</dt>
                <dd>{item.result || t.blank}</dd>
              </div>
              <div>
                <dt>{t.decision}</dt>
                <dd>{t[item.decision]}</dd>
              </div>
            </dl>
            {reference(item.before, 'before')}
            {reference(item.after, 'after')}
            <button
              type="button"
              onClick={() => {
                setDeleteId(item.id);
                setMessage('');
              }}
            >
              {t.delete}
            </button>
            {deleteId === item.id && (
              <div className="experiment-delete-confirm">
                <p>{t.deleteHint}</p>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      deleteGameExperiment(localStorage, item.id, gameSlug);
                      setDeleteId('');
                      setFailed(false);
                      setMessage(t.deleted);
                      requestAnimationFrame(() => summary.current?.focus());
                    } catch (error) {
                      report(error);
                    }
                    announce();
                  }}
                >
                  {t.confirmDelete}
                </button>
                <button type="button" onClick={() => setDeleteId('')}>
                  {t.cancel}
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
      <a href="#issue-notebook" className="experiment-notebook">
        {t.legacy}
      </a>
    </details>
  );
}
