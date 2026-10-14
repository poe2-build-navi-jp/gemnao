'use client';
/* oxlint-disable next/no-html-link-for-pages -- Match the existing native notebook navigation. */
import { useMemo, useState, useSyncExternalStore } from 'react';
import { GameExperiments } from '@/components/game-experiments';
import {
  SETTINGS_SNAPSHOTS_KEY,
  SETTINGS_SNAPSHOTS_EVENT,
  parseSettingsSnapshots,
  saveSettingsSnapshot,
  deleteSettingsSnapshot,
  emptySettingsDraft,
  copySettingsNote,
  settingsFields,
  settingsDifferences,
  localDay,
  SettingsSnapshotError,
  type SettingsSnapshot,
  type SettingsField,
} from '@/lib/game-settings-snapshots';
import { gameSettingsCopy } from '@/lib/game-settings-copy';
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { useSavedSolutions } from '@/components/use-saved-solutions';
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(SETTINGS_SNAPSHOTS_EVENT, callback);
  window.addEventListener('pageshow', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(SETTINGS_SNAPSHOTS_EVENT, callback);
    window.removeEventListener('pageshow', callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(SETTINGS_SNAPSHOTS_KEY);
  } catch {
    return '!unavailable';
  }
}
const serverSnapshot = () => undefined;
function announce() {
  window.dispatchEvent(new Event(SETTINGS_SNAPSHOTS_EVENT));
}
export function GameSettingsSnapshots({
  gameSlug,
  locale,
}: {
  gameSlug: string;
  locale: MyGamesLocale;
}) {
  const t = gameSettingsCopy[locale];
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const state = useMemo(() => {
    try {
      return { items: parseSettingsSnapshots(raw ?? null), error: '' };
    } catch {
      return { items: [], error: raw === '!unavailable' ? t.error : t.invalid };
    }
  }, [raw, t]);
  const allNotes = useSavedSolutions();
  const notes = allNotes.items.filter((note) => note.gameSlug === gameSlug);
  const mine = state.items.filter((item) => item.gameSlug === gameSlug);
  const [draft, setDraft] = useState(emptySettingsDraft);
  const [leftId, setLeftId] = useState('');
  const [rightId, setRightId] = useState('');
  const [noteId, setNoteId] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const left = mine.find((item) => item.id === leftId);
  const right = mine.find((item) => item.id === rightId);
  const note = notes.find((item) => item.id === noteId);
  const ready = raw !== undefined;
  function error(e: unknown) {
    setFailed(true);
    setMessage(
      e instanceof SettingsSnapshotError
        ? t[e.code === 'empty' ? 'emptyError' : e.code]
        : t.error,
    );
  }
  function title(item: SettingsSnapshot) {
    return `${item.name || t.untitled} — ${item.checkedOn || item.createdAt.slice(0, 10)} · ${item.id.slice(-6)}`;
  }
  function fieldValue(value: string) {
    return value === '' ? t.blank : value;
  }
  return (
    <>
      <details className="game-settings" data-game={gameSlug}>
        <summary>
          {t.heading} ({ready && !state.error ? mine.length : '—'})
        </summary>
        <p>{t.intro}</p>
        <p>{t.retention}</p>
        {!ready && <p>{t.loading}</p>}
        {state.error && <p role="alert">{state.error}</p>}
        {ready && !state.error && !mine.length && <p>{t.empty}</p>}
        {mine.length > 0 && (
          <div className="settings-pickers">
            <label>
              {t.chooseLeft}
              <select
                aria-label={t.chooseLeft}
                value={left?.id || ''}
                onChange={(e) => {
                  setLeftId(e.target.value);
                  setDeleteId('');
                  setMessage('');
                }}
              >
                <option value="">{t.choose}</option>
                {mine.map((item) => (
                  <option key={item.id} value={item.id}>
                    {title(item)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t.chooseRight}
              <select
                aria-label={t.chooseRight}
                value={right?.id || ''}
                onChange={(e) => setRightId(e.target.value)}
              >
                <option value="">{t.choose}</option>
                {mine.map((item) => (
                  <option key={item.id} value={item.id}>
                    {title(item)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        {((leftId && !left) || (rightId && !right)) && (
          <output>{t.missing}</output>
        )}
        {left && (
          <section className="settings-record" aria-label={t.view}>
            <h5>{title(left)}</h5>
            <p>
              {t.savedOn}:{' '}
              <time dateTime={left.createdAt}>{left.createdAt}</time>
            </p>
            <p>{left.comfortable ? t.comfortable : t.comfortUnknown}</p>
            {left.sourceNoteId && <p>{t.source}</p>}
            <dl>
              {settingsFields.map((field) => (
                <div key={field}>
                  <dt>{t[field]}</dt>
                  <dd>{fieldValue(left[field])}</dd>
                </div>
              ))}
              <div>
                <dt>{t.checkedOn}</dt>
                <dd>{fieldValue(left.checkedOn)}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => {
                setDeleteId(left.id);
                setMessage('');
              }}
            >
              {t.delete}
            </button>
            {deleteId === left.id && (
              <div className="settings-delete-confirm">
                <p>
                  {t.deleteHint} {title(left)}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      deleteSettingsSnapshot(localStorage, deleteId, gameSlug);
                      setLeftId('');
                      if (rightId === deleteId) setRightId('');
                      setDeleteId('');
                      setFailed(false);
                      setMessage(t.deleted);
                    } catch (e) {
                      error(e);
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
          </section>
        )}
        {left && right && (
          <section className="settings-comparison" aria-label={t.compare}>
            <h5>{t.compare}</h5>
            <p>
              {t.chooseLeft}: {title(left)}
              <br />
              {t.chooseRight}: {title(right)}
            </p>
            <dl>
              {[
                ...settingsDifferences(left, right).map((row) => ({
                  ...row,
                  label: t[row.field],
                })),
                {
                  field: 'checkedOn',
                  label: t.checkedOn,
                  left: fieldValue(left.checkedOn),
                  right: fieldValue(right.checkedOn),
                  changed: left.checkedOn !== right.checkedOn,
                },
                {
                  field: 'comfortable',
                  label: t.comfortable,
                  left: left.comfortable ? t.comfortable : t.comfortUnknown,
                  right: right.comfortable ? t.comfortable : t.comfortUnknown,
                  changed: left.comfortable !== right.comfortable,
                },
              ].map((row) => (
                <div
                  key={row.field}
                  className="settings-comparison-row"
                  data-changed={row.changed}
                >
                  <dt>
                    {row.label} — {row.changed ? t.different : t.same}
                  </dt>
                  <dd>
                    <span>{t.chooseLeft}</span>
                    {fieldValue(row.left)}
                  </dd>
                  <dd>
                    <span>{t.chooseRight}</span>
                    {fieldValue(row.right)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        <details className="settings-new">
          <summary>{t.create}</summary>
          <p>{t.optional}</p>
          <details className="settings-legacy">
            <summary>{t.legacy}</summary>
            <p>{t.legacyHint}</p>
            {allNotes.error ? (
              <p role="alert">{t.legacyError}</p>
            ) : !allNotes.ready ? (
              <p>{t.loading}</p>
            ) : !notes.length ? (
              <p>{t.legacyEmpty}</p>
            ) : (
              <>
                <label>
                  {t.legacy}
                  <select
                    aria-label={t.legacy}
                    value={note?.id || ''}
                    onChange={(e) => setNoteId(e.target.value)}
                  >
                    <option value="">{t.choose}</option>
                    {notes.map((n) => (
                      <option value={n.id} key={n.id}>
                        {n.title}
                      </option>
                    ))}
                  </select>
                </label>
                {note && (
                  <>
                    <p className="settings-legacy-text">
                      {note.settings || t.blank}
                    </p>
                    {!!note.support?.reversions.length && (
                      <ul>
                        {note.support.reversions.map((r) => (
                          <li key={r.id}>
                            <strong>{r.setting}</strong>
                            <br />
                            {t.original}: {r.original || t.blank}
                            <br />
                            {t.restore}: {r.restore || t.blank}
                            <br />
                            {t[r.state]}
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      type="button"
                      disabled={!note.settings.trim()}
                      onClick={() => {
                        try {
                          setDraft(copySettingsNote(draft, note, gameSlug));
                          setFailed(false);
                          setMessage(t.copied);
                        } catch (e) {
                          error(e);
                        }
                      }}
                    >
                      {t.copy}
                    </button>
                  </>
                )}
              </>
            )}
            <a href="#issue-notebook">{t.notebook}</a>
          </details>
          <form
            onChange={() => {
              setMessage('');
              setFailed(false);
            }}
            onSubmit={(event) => {
              event.preventDefault();
              try {
                const saved = saveSettingsSnapshot(
                  localStorage,
                  gameSlug,
                  draft,
                  crypto.randomUUID(),
                );
                setLeftId(saved.id);
                setRightId('');
                setDeleteId('');
                setDraft(emptySettingsDraft());
                setFailed(false);
                setMessage(t.saved);
              } catch (e) {
                error(e);
              }
              announce();
            }}
          >
            <label>
              {t.name}
              <input
                maxLength={80}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            {settingsFields.map((field: SettingsField) => (
              <label key={field}>
                {t[field]}
                {field === 'memo' ? (
                  <textarea
                    rows={4}
                    maxLength={4000}
                    value={draft[field]}
                    onChange={(e) =>
                      setDraft({ ...draft, [field]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    maxLength={200}
                    value={draft[field]}
                    onChange={(e) =>
                      setDraft({ ...draft, [field]: e.target.value })
                    }
                  />
                )}
              </label>
            ))}
            <label>
              {t.checkedOn}
              <input
                type="date"
                max={ready ? localDay() : undefined}
                value={draft.checkedOn}
                onChange={(e) =>
                  setDraft({ ...draft, checkedOn: e.target.value })
                }
              />
            </label>
            <label className="settings-comfort">
              <input
                type="checkbox"
                checked={draft.comfortable}
                onChange={(e) =>
                  setDraft({ ...draft, comfortable: e.target.checked })
                }
              />
              {t.comfortable}
            </label>
            <button type="submit" disabled={!ready || !!state.error}>
              {t.save}
            </button>
          </form>
        </details>
        <output
          role={failed ? 'alert' : 'status'}
          aria-live="polite"
          className="settings-message"
        >
          {message}
        </output>
      </details>
      <GameExperiments
        gameSlug={gameSlug}
        locale={locale}
        snapshots={mine}
        snapshotsReady={ready}
        snapshotsError={!!state.error}
      />
    </>
  );
}
