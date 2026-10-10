'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { useEffect, useId, useRef, useState, type SyntheticEvent } from 'react';
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { gameRequestCopy } from '@/lib/game-request-copy';
import {
  normalizeRequestedGame,
  sendGameRequest,
  type GameRequestOutcome,
} from '@/lib/game-request-client';

export function GameRequestForm({ locale }: { locale: MyGamesLocale }) {
  const t = gameRequestCopy[locale];
  const id = useId();
  const [available, setAvailable] = useState(false);
  const [checking, setChecking] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<GameRequestOutcome | null>(null);
  const inFlight = useRef(false);
  const submission = useRef<AbortController | null>(null);
  useEffect(() => () => submission.current?.abort(), []);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 10000);
    fetch('/api/game-requests', {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return false;
        const data: unknown = await response.json();
        return (
          !!data &&
          typeof data === 'object' &&
          'available' in data &&
          data.available === true
        );
      })
      .then((enabled) => {
        if (active) setAvailable(enabled);
      })
      .catch(() => {
        if (active) setAvailable(false);
      })
      .finally(() => {
        clearTimeout(timeout);
        if (active) setChecking(false);
      });
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);
  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !available) return;
    const normalized = normalizeRequestedGame(title);
    if (!normalized) {
      setOutcome('invalid');
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setOutcome(null);
    const controller = new AbortController();
    submission.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    const result = await sendGameRequest(normalized, locale, controller.signal);
    clearTimeout(timeout);
    inFlight.current = false;
    setBusy(false);
    setOutcome(result);
    if (result === 'received' || result === 'duplicate') setTitle('');
    if (result === 'unavailable') setAvailable(false);
  }
  return (
    <section className="game-request" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`}>{t.title}</h2>
      <p>{t.intro}</p>
      <p className="game-request-privacy">{t.capacity}</p>
      {available ? (
        <form onSubmit={submit} noValidate aria-busy={busy}>
          <p id={`${id}-privacy`} className="game-request-privacy">
            {t.privacy}
          </p>
          <p className="game-request-privacy">
            {t.security}{' '}
            <a className="game-request-policy" href="/privacy">
              {t.privacyLink}
            </a>
          </p>
          <label htmlFor={`${id}-title`}>{t.label}</label>
          <input
            id={`${id}-title`}
            name="gameName"
            value={title}
            maxLength={80}
            minLength={2}
            placeholder={t.placeholder}
            autoComplete="off"
            required
            disabled={busy}
            aria-invalid={outcome === 'invalid'}
            aria-describedby={`${id}-privacy ${id}-count ${id}-message`}
            onChange={(event) => {
              setTitle(event.target.value);
              setOutcome(null);
            }}
          />
          <span id={`${id}-count`} className="game-request-count">
            {title.length} / 80
          </span>
          <button type="submit" disabled={busy}>
            {busy ? t.sending : t.submit}
          </button>
        </form>
      ) : (
        <div>
          <p>{checking ? t.checking : t.unavailable}</p>
          <button
            type="button"
            disabled={checking}
            onClick={() => {
              setChecking(true);
              setAttempt((value) => value + 1);
            }}
          >
            {t.check}
          </button>
        </div>
      )}
      <output
        id={`${id}-message`}
        className="game-request-message"
        aria-live="polite"
        aria-atomic="true"
      >
        {outcome ? t[outcome] : ''}
      </output>
    </section>
  );
}
