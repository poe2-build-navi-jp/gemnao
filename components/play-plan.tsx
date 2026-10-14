'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native local fragment navigation. */
import { useState } from 'react';
import { PlayActivity } from './play-activity';
import { useBrowserRecords } from './use-browser-records';
import {
  PLAY_PLANS_KEY,
  PLAY_PLANS_EVENT,
  parsePlayPlans,
  savePlayPlan,
  emptyPlayDraft,
  PlayPlanError,
  chooseToday,
  type PlayPlan,
  type PlayDraft,
  TODAY_CHOICES_KEY,
  parseTodayChoices,
  saveTodayChoice,
  type TodayChoice,
} from '@/lib/play-plans';
import {
  SETTINGS_SNAPSHOTS_KEY,
  SETTINGS_SNAPSHOTS_EVENT,
  parseSettingsSnapshots,
  settingsFields,
  type SettingsSnapshot,
} from '@/lib/game-settings-snapshots';
import { gameSettingsCopy } from '@/lib/game-settings-copy';
import { playPlansCopy } from '@/lib/play-plans-copy';
import type { MyGamesLocale } from '@/lib/my-games-copy';
import type { SavedGameChoice } from '@/lib/my-games-data';
export const usePlayPlans = () =>
  useBrowserRecords(PLAY_PLANS_KEY, PLAY_PLANS_EVENT, parsePlayPlans);
export function announcePlayPlans() {
  window.dispatchEvent(new Event(PLAY_PLANS_EVENT));
}
export function playError(error: unknown, locale: MyGamesLocale) {
  const t = playPlansCopy[locale];
  return error instanceof PlayPlanError
    ? t[error.code === 'minutes' ? 'minutesError' : error.code]
    : t.error;
}
function PlanEditor({
  gameSlug,
  plan,
  snapshots,
  locale,
  onClose,
  onSaved,
}: {
  gameSlug: string;
  plan?: PlayPlan;
  snapshots: SettingsSnapshot[];
  locale: MyGamesLocale;
  onClose: () => void;
  onSaved: () => void;
}) {
  const t = playPlansCopy[locale];
  const [draft, setDraft] = useState<PlayDraft>(() =>
    plan ? { ...plan, snapshotId: plan.snapshot?.id || '' } : emptyPlayDraft(),
  );
  const [revision] = useState(plan?.revision || 0);
  const [error, setError] = useState('');
  function field<K extends keyof PlayDraft>(key: K, value: PlayDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setError('');
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        try {
          savePlayPlan(localStorage, gameSlug, draft, revision);
          announcePlayPlans();
          onSaved();
        } catch (err) {
          setError(playError(err, locale));
        }
      }}
    >
      {(['progress', 'next'] as const).map((key) => (
        <label key={key}>
          {t[key]}
          <textarea
            aria-label={t[key]}
            maxLength={300}
            value={draft[key]}
            onChange={(e) => field(key, e.target.value)}
          />
        </label>
      ))}
      <label>
        {t.guideUrl}
        <input
          aria-label={t.guideUrl}
          type="text"
          inputMode="url"
          maxLength={1000}
          value={draft.guideUrl}
          onChange={(e) => field('guideUrl', e.target.value)}
        />
      </label>
      <p>{t.guideHint}</p>
      <label>
        {t.snapshot}
        <select
          aria-label={t.snapshot}
          value={draft.snapshotId}
          onChange={(e) => field('snapshotId', e.target.value)}
        >
          <option value="">{t.none}</option>
          {snapshots.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name || s.createdAt}
            </option>
          ))}
          {plan?.snapshot &&
            !snapshots.some((s) => s.id === plan.snapshot?.id) && (
              <option value={plan.snapshot.id}>
                {plan.snapshot.name || t.archived}
              </option>
            )}
        </select>
      </label>
      <fieldset>
        <legend>{t.preferences}</legend>
        <p>{t.preferenceHint}</p>
        <label>
          {t.minutes}
          <input
            aria-label={t.minutes}
            inputMode="numeric"
            maxLength={4}
            value={draft.minutes}
            onChange={(e) => field('minutes', e.target.value)}
          />
        </label>
        <label>
          {t.company}
          <select
            aria-label={t.company}
            value={draft.company}
            onChange={(e) =>
              field('company', e.target.value as PlayDraft['company'])
            }
          >
            {(['unset', 'solo', 'friends', 'either'] as const).map((x) => (
              <option key={x} value={x}>
                {t[x]}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.prepared}
          <select
            aria-label={t.prepared}
            value={draft.prepared}
            onChange={(e) =>
              field('prepared', e.target.value as PlayDraft['prepared'])
            }
          >
            {(['unset', 'yes', 'no'] as const).map((x) => (
              <option key={x} value={x}>
                {t[x]}
              </option>
            ))}
          </select>
        </label>
      </fieldset>
      <button type="submit">{t.save}</button>{' '}
      <button type="button" onClick={onClose}>
        {t.cancel}
      </button>
      <output aria-live="polite">{error}</output>
    </form>
  );
}
export function PlayPlanCard({
  gameSlug,
  locale,
}: {
  gameSlug: string;
  locale: MyGamesLocale;
}) {
  const t = playPlansCopy[locale];
  const store = usePlayPlans();
  const snapshots = useBrowserRecords(
    SETTINGS_SNAPSHOTS_KEY,
    SETTINGS_SNAPSHOTS_EVENT,
    parseSettingsSnapshots,
  );
  const plan = store.items.find((p) => p.gameSlug === gameSlug);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  return (
    <section
      className="play-plan"
      id={`play-plan-${gameSlug}`}
      aria-labelledby={`play-title-${gameSlug}`}
      data-game={gameSlug}
    >
      <h4 id={`play-title-${gameSlug}`}>{t.heading}</h4>
      <p>{t.intro}</p>
      {!store.ready ? (
        <p>{t.loading}</p>
      ) : store.error ? (
        <p role="alert">{t.error}</p>
      ) : (
        <>
          {plan ? (
            <>
              <dl>
                <dt>{t.progress}</dt>
                <dd>{plan.progress || t.blank}</dd>
                <dt>{t.next}</dt>
                <dd>{plan.next || t.blank}</dd>
              </dl>
              <p>
                {t.updated}:{' '}
                <time dateTime={plan.updatedAt}>
                  {new Date(plan.updatedAt).toLocaleString(locale)}
                </time>
              </p>
              {plan.guideUrl && (
                <button
                  type="button"
                  onClick={() =>
                    window.open(plan.guideUrl, '_blank', 'noopener,noreferrer')
                  }
                >
                  {t.openGuide}
                </button>
              )}
              {plan.snapshot && (
                <details>
                  <summary>
                    {t.archived}: {plan.snapshot.name}
                  </summary>
                  {snapshots.error ? (
                    <p>{t.reference}</p>
                  ) : (
                    snapshots.ready &&
                    !snapshots.items.some(
                      (s) => s.id === plan.snapshot?.id,
                    ) && <p>{t.snapshotMissing}</p>
                  )}
                  <dl>
                    {settingsFields.map((key) => (
                      <div key={key}>
                        <dt>{gameSettingsCopy[locale][key]}</dt>
                        <dd>{plan.snapshot?.[key] || t.blank}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              )}
            </>
          ) : (
            <p>{t.empty}</p>
          )}
        </>
      )}
      {editing ? (
        <PlanEditor
          gameSlug={gameSlug}
          plan={plan}
          snapshots={snapshots.items.filter((s) => s.gameSlug === gameSlug)}
          locale={locale}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            setMessage(t.saved);
          }}
        />
      ) : store.ready && !store.error ? (
        <button
          type="button"
          onClick={() => {
            setEditing(true);
            setMessage('');
          }}
        >
          {t.edit}
        </button>
      ) : null}
      <output aria-live="polite">{message}</output>
      <PlayActivity gameSlug={gameSlug} locale={locale} />
      <p className="play-plan-note">{t.retention}</p>
    </section>
  );
}
export function TodayGames({
  games,
  locale,
  ready,
}: {
  games: SavedGameChoice[];
  locale: MyGamesLocale;
  ready: boolean;
}) {
  const prefs = useBrowserRecords(
    TODAY_CHOICES_KEY,
    PLAY_PLANS_EVENT,
    parseTodayChoices,
  );
  const t = playPlansCopy[locale];
  if (!prefs.ready) return <p>{t.loading}</p>;
  if (prefs.error)
    return (
      <section className="play-plan">
        <h3>{t.today}</h3>
        <p role="alert">{t.error}</p>
      </section>
    );
  return (
    <TodayForm
      games={games}
      locale={locale}
      ready={ready}
      initial={prefs.items[0]}
    />
  );
}
function TodayForm({
  games,
  locale,
  ready,
  initial,
}: {
  games: SavedGameChoice[];
  locale: MyGamesLocale;
  ready: boolean;
  initial?: TodayChoice;
}) {
  const t = playPlansCopy[locale];
  const store = usePlayPlans();
  const [minutes, setMinutes] = useState(initial?.minutes || '');
  const [company, setCompany] = useState<'solo' | 'friends'>(
    initial?.company || 'solo',
  );
  const [submitted, setSubmitted] = useState(!!initial);
  const [saveError, setSaveError] = useState('');
  let result: ReturnType<typeof chooseToday> | undefined;
  let error = '';
  if (submitted) {
    try {
      result = chooseToday(
        games.map((g) => g.slug),
        store.items,
        minutes,
        company,
      );
    } catch (e) {
      error = playError(e, locale);
    }
  }
  return (
    <section className="play-plan today-games" aria-label={t.today}>
      <h3>{t.today}</h3>
      <p>{t.todayHint}</p>
      {!ready || !store.ready ? (
        <p>{t.loading}</p>
      ) : store.error ? (
        <p role="alert">{t.error}</p>
      ) : !games.length ? (
        <p>{t.noGames}</p>
      ) : (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              try {
                saveTodayChoice(localStorage, { minutes, company });
                announcePlayPlans();
                setSaveError('');
                setSubmitted(true);
              } catch (err) {
                setSubmitted(false);
                setSaveError(playError(err, locale));
              }
            }}
          >
            <label>
              {t.available}
              <input
                aria-label={t.available}
                inputMode="numeric"
                maxLength={4}
                value={minutes}
                onChange={(e) => {
                  setMinutes(e.target.value);
                  setSubmitted(false);
                }}
              />
            </label>
            <label>
              {t.company}
              <select
                aria-label={t.company}
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value as 'solo' | 'friends');
                  setSubmitted(false);
                }}
              >
                <option value="solo">{t.solo}</option>
                <option value="friends">{t.friends}</option>
              </select>
            </label>
            <button>{t.find}</button>
          </form>
          <div aria-live="polite">
            {saveError && <p>{saveError}</p>}
            {error && <p>{error}</p>}
            {result && (
              <>
                <p>
                  {t.unconfigured}: {result.unconfigured}
                </p>
                <p>
                  {result.total ? `${t.matches}: ${result.total}` : t.noMatch}
                </p>
                <ul>
                  {result.matches.map((p) => (
                    <li key={p.gameSlug}>
                      <strong>
                        {games.find((g) => g.slug === p.gameSlug)?.name}
                      </strong>
                      <p>
                        {t.reason}: {t.minutes} {p.minutes} / {t[p.company]} /{' '}
                        {t.yes}
                      </p>
                      <a href={`#play-plan-${p.gameSlug}`}>{t.continue}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}
