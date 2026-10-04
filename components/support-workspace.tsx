'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links preserve the site's navigation behavior. */
import { useMemo, useState, useSyncExternalStore } from 'react';
import { games } from '@/lib/games';
import { gameFacts } from '@/lib/localized/game-facts';
import { supportCopy, type SupportLocale } from '@/lib/support-copy';
import {
  ACTIVE_CASE_KEY,
  canonicalArticle,
  changeSupport,
  emptySupport,
  recordAttempt,
  type Reversion,
  type Attempt,
} from '@/lib/support-record';
import {
  defaultShareFields,
  supportSummary,
  type ShareFields,
} from '@/lib/support-summary';
import { matchingUpdates, markUpdatesRead } from '@/lib/support-updates';
import {
  MY_DATA_EVENT,
  type SavedSolution,
  type SolutionDraft,
} from '@/lib/saved-solutions';
import { announceMyData, useSavedSolutions } from './use-saved-solutions';
import { useMyPc } from './use-my-pc';
import { SolutionForm } from './solution-form';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(MY_DATA_EVENT, callback);
  window.addEventListener('pageshow', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(MY_DATA_EVENT, callback);
    window.removeEventListener('pageshow', callback);
  };
}
export function useActiveCase() {
  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(ACTIVE_CASE_KEY) || '';
      } catch {
        return '';
      }
    },
    () => '',
  );
}
const blank: SolutionDraft = {
  title: '',
  gameSlug: '',
  diagnosis: '',
  settings: '',
  notes: '',
  status: 'investigating',
  articlePath: '',
  stepId: '',
  completedSteps: [],
};
export function SupportWorkspace({
  locale = 'ja',
  draft = blank,
  steps = [],
}: {
  locale?: SupportLocale;
  draft?: SolutionDraft;
  steps?: { id: string; title: string }[];
}) {
  const t = supportCopy[locale];
  const { items, ready, error } = useSavedSolutions();
  const active = useActiveCase();
  const item = items.find((i) => i.id === active);
  const [editing, setEditing] = useState<'new' | 'edit' | null>(null);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  function select(id: string) {
    try {
      localStorage.setItem(ACTIVE_CASE_KEY, id);
      announceMyData();
      setFailed(false);
      setMessage('');
      setEditing(null);
    } catch {
      setFailed(true);
    }
  }
  return (
    <section className="support-workspace" aria-label={t.heading} lang={locale}>
      <h3>{t.heading}</h3>
      <p>{t.privacy}</p>
      <label>
        {t.choose}
        <select
          aria-label={t.choose}
          value={item?.id || ''}
          disabled={!ready || !!error}
          onChange={(e) => select(e.target.value)}
        >
          <option value="">{t.none}</option>
          {items.map((i) => (
            <option key={i.id} value={i.id}>
              {i.title} — {t[i.status]}
            </option>
          ))}
        </select>
      </label>
      <p>{t.active}</p>
      <div className="my-pc-actions">
        <button
          type="button"
          disabled={!ready || !!error}
          onClick={() => setEditing('new')}
        >
          {t.create}
        </button>
        {item && (
          <button type="button" onClick={() => setEditing('edit')}>
            {t.edit}
          </button>
        )}
      </div>
      {editing && (
        <SolutionForm
          key={`${editing}:${item?.id || ''}`}
          locale={locale}
          initial={editing === 'edit' && item ? item : draft}
          id={editing === 'edit' ? item?.id : undefined}
          onCancel={() => setEditing(null)}
          onSaved={(saved) => {
            select(saved.id);
            setMessage(t.saved);
          }}
        />
      )}
      {message && <output>{message}</output>}
      {(error || failed) && <p role="alert">{t.error}</p>}
      {item && (
        <SupportTools
          key={item.id}
          item={item}
          locale={locale}
          path={draft.articlePath}
          steps={steps}
        />
      )}
    </section>
  );
}
export function SupportTools({
  item,
  locale = 'ja',
  path = '',
  steps = [],
}: {
  item: SavedSolution;
  locale?: SupportLocale;
  path?: string;
  steps?: { id: string; title: string }[];
}) {
  const t = supportCopy[locale];
  const support = item.support || emptySupport();
  const [stepId, setStep] = useState(steps[0]?.id || '');
  const [result, setResult] = useState<Attempt['result']>('tried');
  const [setting, setSetting] = useState('');
  const [original, setOriginal] = useState('');
  const [restore, setRestore] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  function mutate(action: () => unknown) {
    try {
      action();
      announceMyData();
      setMessage(t.saved);
      setError('');
      return true;
    } catch {
      setError(t.error);
      setMessage('');
      return false;
    }
  }
  return (
    <div className="support-tools">
      <details>
        <summary>
          {t.history} ({support.attempts.length})
        </summary>
        {!support.attempts.length && <p>{t.noAttempts}</p>}
        {item.completedSteps.length > 0 && (
          <p>
            {t.completed}: {item.completedSteps.join(' / ')}
          </p>
        )}
        <ul>
          {support.attempts.map((a) => (
            <li key={`${a.path}#${a.stepId}`}>
              <a href={`${a.path}#${a.stepId}`}>
                {a.label}
                {locale !== 'ja' ? ' (日本語)' : ''}
              </a>{' '}
              — {t[a.result]} <time>{a.at.slice(0, 10)}</time>
            </li>
          ))}
        </ul>
        {steps.length > 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const step = steps.find((s) => s.id === stepId);
              if (step)
                mutate(() =>
                  recordAttempt(localStorage, item.id, {
                    path: canonicalArticle(path),
                    stepId,
                    label: step.title,
                    result,
                    at: new Date().toISOString(),
                  }),
                );
            }}
          >
            <label>
              {t.step}
              <select
                aria-label={t.step}
                value={stepId}
                onChange={(e) => setStep(e.target.value)}
              >
                {steps.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t.result}
              <select
                aria-label={t.result}
                value={result}
                onChange={(e) => setResult(e.target.value as Attempt['result'])}
              >
                {(['tried', 'unresolved', 'resolved'] as const).map((r) => (
                  <option key={r} value={r}>
                    {t[r]}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit">{t.record}</button>
          </form>
        )}
      </details>
      <details>
        <summary>
          {t.rollback} (
          {support.reversions.filter((r) => r.state === 'pending').length})
        </summary>
        {!support.reversions.length && <p>{t.noSettings}</p>}
        {support.reversions.map((r) => (
          <div className="support-setting" key={r.id}>
            <strong>{r.setting}</strong>
            <p>
              {t.original}: {r.original}
            </p>
            <p>
              {t.restore}: {r.restore}
            </p>
            <label>
              {t.status}
              <select
                aria-label={`${r.setting}: ${t.status}`}
                value={r.state}
                onChange={(e) => {
                  const state = e.target.value as Reversion['state'];
                  mutate(() =>
                    changeSupport(localStorage, item.id, (current) => {
                      const data = current.support || emptySupport();
                      return {
                        ...current,
                        support: {
                          ...data,
                          reversions: data.reversions.map((old) =>
                            old.id === r.id ? { ...old, state } : old,
                          ),
                        },
                      };
                    }),
                  );
                }}
              >
                {(['pending', 'restored', 'kept'] as const).map((state) => (
                  <option key={state} value={state}>
                    {t[state]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!setting.trim() || !original.trim() || !restore.trim()) return;
            if (
              mutate(() =>
                changeSupport(localStorage, item.id, (current) => {
                  const data = current.support || emptySupport();
                  return {
                    ...current,
                    support: {
                      ...data,
                      reversions: [
                        ...data.reversions,
                        {
                          id: crypto.randomUUID(),
                          setting: setting.trim(),
                          original: original.trim(),
                          restore: restore.trim(),
                          state: 'pending',
                        },
                      ],
                    },
                  };
                }),
              )
            ) {
              setSetting('');
              setOriginal('');
              setRestore('');
            }
          }}
        >
          <label>
            {t.setting}
            <input
              required
              maxLength={4000}
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
            />
          </label>
          <label>
            {t.original}
            <input
              required
              maxLength={4000}
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
            />
          </label>
          <label>
            {t.restore}
            <textarea
              required
              maxLength={4000}
              value={restore}
              onChange={(e) => setRestore(e.target.value)}
            />
          </label>
          <button type="submit">{t.add}</button>
        </form>
      </details>
      <SupportSummary item={item} locale={locale} />
      {message && <output>{message}</output>}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
function SupportSummary({
  item,
  locale,
}: {
  item: SavedSolution;
  locale: SupportLocale;
}) {
  const t = supportCopy[locale];
  const [pc] = useMyPc();
  const [fields, setFields] = useState<ShareFields>({ ...defaultShareFields });
  const [language, setLanguage] = useState(locale);
  const [edited, setEdited] = useState<{ source: string; text: string } | null>(
    null,
  );
  const [message, setMessage] = useState('');
  const [copying, setCopying] = useState(false);
  const generated = useMemo(
    () =>
      supportSummary(
        item,
        fields,
        language,
        (language !== 'ja'
          ? gameFacts[item.gameSlug]?.names[language]
          : undefined) ||
          games.find((g) => g.slug === item.gameSlug)?.shortTitle ||
          t.other,
        pc,
      ),
    [item, fields, language, pc, t.other],
  );
  const preview = edited?.source === generated ? edited.text : generated;
  return (
    <details>
      <summary>{t.summary}</summary>
      <p>{t.review}</p>
      <fieldset>
        <legend>{t.include}</legend>
        {(Object.keys(fields) as (keyof ShareFields)[]).map((key) => (
          <label className="support-check" key={key}>
            <input
              type="checkbox"
              checked={fields[key]}
              onChange={(e) => {
                setFields({ ...fields, [key]: e.target.checked });
                setEdited(null);
                setMessage('');
              }}
            />
            {
              t[
                (
                  {
                    game: 'includeGame',
                    symptoms: 'includeSymptoms',
                    pc: 'includePc',
                    attempts: 'includeAttempts',
                    notes: 'includeNotes',
                  } as const
                )[key]
              ]
            }
          </label>
        ))}
      </fieldset>
      <label>
        {t.language}
        <select
          aria-label={t.language}
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value as SupportLocale);
            setEdited(null);
            setMessage('');
          }}
        >
          {Object.entries({
            ja: '日本語',
            en: 'English',
            zh: '简体中文',
            es: 'Español',
          }).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t.preview}
        <textarea
          aria-label={t.preview}
          rows={10}
          value={preview}
          onChange={(e) => {
            setEdited({ source: generated, text: e.target.value });
            setMessage('');
          }}
        />
      </label>
      <button
        type="button"
        disabled={copying}
        onClick={async () => {
          setCopying(true);
          try {
            await navigator.clipboard.writeText(preview);
            setMessage(t.copied);
          } catch {
            setMessage(t.copyError);
          } finally {
            setCopying(false);
          }
        }}
      >
        {t.copy}
      </button>
      {message && <output>{message}</output>}
    </details>
  );
}
export function SupportUpdates({ locale = 'ja' }: { locale?: SupportLocale }) {
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
      {ready && !error && !matches.length && <p>{t.emptyUpdates}</p>}
      {(error || failed) && <p role="alert">{t.error}</p>}
      {matches.map(({ item, update }) => (
        <article key={`${item.id}:${update.id}`}>
          <h3>
            {item.title} — {t[update.kind]}
          </h3>
          <p>{games.find((g) => g.slug === item.gameSlug)?.shortTitle}</p>
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
