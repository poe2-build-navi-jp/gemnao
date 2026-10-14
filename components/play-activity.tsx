'use client';
/* oxlint-disable next/no-html-link-for-pages -- Same-page support notebook anchor. */
import { useState, useRef } from 'react';
import { useBrowserRecords } from './use-browser-records';
import { useSavedSolutions } from './use-saved-solutions';
import {
  PLAY_ACTIVITY_KEY,
  PLAY_ACTIVITY_EVENT,
  parsePlayActivity,
  changePlayTask,
  saveTrouble,
  ActivityError,
  type PlayActivity as Activity,
  type TaskAction,
} from '@/lib/play-activity';
import { playActivityCopy } from '@/lib/play-activity-copy';
import { playPlansCopy } from '@/lib/play-plans-copy';
import { supportCopy } from '@/lib/support-copy';
import { playStatusLinks } from '@/lib/play-status-links';
import type { MyGamesLocale } from '@/lib/my-games-copy';
import type { SavedSolution } from '@/lib/saved-solutions';
const announce = () => window.dispatchEvent(new Event(PLAY_ACTIVITY_EVENT));
function errorText(e: unknown, locale: MyGamesLocale) {
  return e instanceof ActivityError
    ? e.code === 'limit'
      ? playActivityCopy[locale].limit
      : playPlansCopy[locale][e.code]
    : playPlansCopy[locale].error;
}
function TroubleEditor({
  gameSlug,
  record,
  notes,
  noteError,
  locale,
  close,
  saved,
}: {
  gameSlug: string;
  record?: Activity;
  notes: SavedSolution[];
  noteError: boolean;
  locale: MyGamesLocale;
  close: () => void;
  saved: () => void;
}) {
  const t = playActivityCopy[locale],
    p = playPlansCopy[locale];
  const [draft, setDraft] = useState(() => ({
    tried: record?.tried || '',
    nextFix: record?.nextFix || '',
    noteId: record?.noteId || '',
  }));
  const [revision] = useState(record?.revision || 0);
  const [error, setError] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        try {
          saveTrouble(localStorage, gameSlug, draft, revision);
          announce();
          saved();
        } catch (err) {
          setError(errorText(err, locale));
        }
      }}
    >
      {(['tried', 'nextFix'] as const).map((key) => (
        <label key={key}>
          {t[key]}
          <textarea
            aria-label={t[key]}
            maxLength={key === 'tried' ? 1000 : 300}
            value={draft[key]}
            onChange={(e) => {
              setDraft((d) => ({ ...d, [key]: e.target.value }));
              setError('');
            }}
          />
        </label>
      ))}
      <label>
        {t.note}
        <select
          aria-label={t.note}
          disabled={noteError}
          value={draft.noteId}
          onChange={(e) => {
            setDraft((d) => ({ ...d, noteId: e.target.value }));
            setError('');
          }}
        >
          <option value="">{p.none}</option>
          {notes.map((n) => (
            <option key={n.id} value={n.id}>
              {n.title}
            </option>
          ))}
          {draft.noteId && !notes.some((n) => n.id === draft.noteId) && (
            <option value={draft.noteId}>{t.noteMissing}</option>
          )}
        </select>
      </label>
      {noteError && <p>{t.noteError}</p>}
      <button>{p.save}</button>{' '}
      <button type="button" onClick={close}>
        {p.cancel}
      </button>
      <output aria-live="polite">{error}</output>
    </form>
  );
}
export function PlayActivity({
  gameSlug,
  locale,
}: {
  gameSlug: string;
  locale: MyGamesLocale;
}) {
  const t = playActivityCopy[locale],
    p = playPlansCopy[locale];
  const store = useBrowserRecords(
    PLAY_ACTIVITY_KEY,
    PLAY_ACTIVITY_EVENT,
    parsePlayActivity,
  );
  const notes = useSavedSolutions();
  const record = store.items.find((v) => v.gameSlug === gameSlug);
  const note = notes.items.find(
    (n) => n.gameSlug === gameSlug && n.id === record?.noteId,
  );
  const [text, setText] = useState(''),
    [message, setMessage] = useState(''),
    [editing, setEditing] = useState(false),
    [purge, setPurge] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const trashHeading = useRef<HTMLElement>(null);
  function task(action: TaskAction) {
    try {
      changePlayTask(localStorage, gameSlug, action, record?.revision || 0);
      announce();
      setMessage(t.taskSaved);
      setPurge('');
      if (action.kind === 'add') setText('');
      if (action.kind === 'delete') input.current?.focus();
      if (action.kind === 'restore' || action.kind === 'purge')
        trashHeading.current?.focus();
    } catch (e) {
      setMessage(errorText(e, locale));
    }
  }
  return (
    <div className="play-activity">
      <h5>{t.tasks}</h5>
      <p>{t.tasksHint}</p>
      {!store.ready ? (
        <p>{p.loading}</p>
      ) : store.error ? (
        <p role="alert">{p.error}</p>
      ) : (
        <>
          <ul>
            {record?.tasks
              .filter((t) => !t.deleted)
              .map((item) => (
                <li key={item.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => task({ kind: 'toggle', id: item.id })}
                    />
                    {item.text}
                  </label>
                  <button
                    type="button"
                    aria-label={`${t.remove}: ${item.text}`}
                    onClick={() => task({ kind: 'delete', id: item.id })}
                  >
                    {t.remove}
                  </button>
                </li>
              ))}
          </ul>
          {!record?.tasks.some((t) => !t.deleted) && <p>{t.emptyTasks}</p>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              task({ kind: 'add', text, id: crypto.randomUUID() });
            }}
          >
            <label>
              {t.taskText}
              <input
                ref={input}
                aria-label={t.taskText}
                maxLength={160}
                required
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setMessage('');
                }}
              />
            </label>
            <button>{t.add}</button>
          </form>
          <details>
            <summary ref={trashHeading} tabIndex={0}>
              {t.trash} ({record?.tasks.filter((t) => t.deleted).length || 0})
            </summary>
            <ul>
              {record?.tasks
                .filter((t) => t.deleted)
                .map((item) => (
                  <li key={item.id}>
                    <p>
                      {item.text}
                      {item.done ? ` — ${t.done}` : ''}
                    </p>
                    <button
                      type="button"
                      aria-label={`${t.restore}: ${item.text}`}
                      onClick={() => task({ kind: 'restore', id: item.id })}
                    >
                      {t.restore}
                    </button>{' '}
                    <button
                      type="button"
                      aria-label={`${t.purge}: ${item.text}`}
                      onClick={() => setPurge(item.id)}
                    >
                      {t.purge}
                    </button>
                    {purge === item.id && (
                      <div>
                        <button
                          type="button"
                          onClick={() => task({ kind: 'purge', id: item.id })}
                        >
                          {t.confirmPurge}
                        </button>
                        <button type="button" onClick={() => setPurge('')}>
                          {p.cancel}
                        </button>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </details>
        </>
      )}
      <h5>{t.status}</h5>
      <p>{t.unknown}</p>
      <p>{t.checkItems}</p>
      {playStatusLinks[gameSlug]?.length ? (
        <ul>
          {playStatusLinks[gameSlug].map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.provider}: {t.official} ({t.newTab})
              </a>
              <p>
                {t.linkChecked}: {link.checkedAt}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>{t.noLink}</p>
      )}
      <h5>{t.trouble}</h5>
      {!store.ready ? (
        <p>{p.loading}</p>
      ) : store.error ? (
        <p>{p.error}</p>
      ) : (
        <>
          <dl>
            <dt>{t.tried}</dt>
            <dd>{record?.tried || p.blank}</dd>
            <dt>{t.nextFix}</dt>
            <dd>{record?.nextFix || p.blank}</dd>
          </dl>
          {record && (
            <p>
              {p.updated}:{' '}
              <time dateTime={record.updatedAt}>
                {new Date(record.updatedAt).toLocaleString(locale)}
              </time>
            </p>
          )}
          {record?.noteId &&
            (notes.error ? (
              <p>{t.noteError}</p>
            ) : notes.ready && !note ? (
              <p>{t.noteMissing}</p>
            ) : (
              note && (
                <details>
                  <summary>
                    {t.note}: {note.title}
                  </summary>
                  <p>{note.notes || p.blank}</p>
                  <h6>{t.attempts}</h6>
                  <ul>
                    {note.support?.attempts.map((a, i) => (
                      <li key={`${a.at}-${i}`}>
                        {a.label} — {supportCopy[locale][a.result]} —{' '}
                        <time dateTime={a.at}>
                          {new Date(a.at).toLocaleString(locale)}
                        </time>
                      </li>
                    ))}
                  </ul>
                </details>
              )
            ))}
          <a href="#issue-notebook">{t.openNote}</a>
        </>
      )}
      {editing ? (
        <TroubleEditor
          gameSlug={gameSlug}
          record={record}
          notes={notes.items.filter((n) => n.gameSlug === gameSlug)}
          noteError={!!notes.error || !notes.ready}
          locale={locale}
          close={() => setEditing(false)}
          saved={() => {
            setEditing(false);
            setMessage(t.savedTrouble);
          }}
        />
      ) : store.ready && !store.error ? (
        <p>
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setMessage('');
            }}
          >
            {t.editTrouble}
          </button>
        </p>
      ) : null}
      <output aria-live="polite">{message}</output>
    </div>
  );
}
