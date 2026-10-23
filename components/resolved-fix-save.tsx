'use client';
/* oxlint-disable next/no-html-link-for-pages -- Existing native My Games navigation. */
import { useRef, useState } from 'react';
import { saveResolvedFix, registerFixGame } from '@/lib/fix-save';
import { fixSaveCopy } from '@/lib/fix-save-copy';
import { myGamesPath, type MyGamesLocale } from '@/lib/my-games-copy';
import type { SolutionDraft } from '@/lib/saved-solutions';
import type { Attempt } from '@/lib/support-record';
import { announceMyData, useSavedSolutions } from './use-saved-solutions';
import { trackMyGameAdded, trackSolutionSaved } from '@/lib/analytics';
export function ResolvedFixSave({
  draft,
  attempt,
  locale = 'ja',
  onSaved,
}: {
  draft: SolutionDraft;
  attempt?: Attempt;
  locale?: MyGamesLocale;
  onSaved?: () => void;
}) {
  const t = fixSaveCopy[locale],
    { ready, error } = useSavedSolutions();
  const [settings, setSettings] = useState(draft.settings);
  const [version, setVersion] = useState(''),
    [message, setMessage] = useState(''),
    [failure, setFailure] = useState(''),
    [gameError, setGameError] = useState(''),
    [saved, setSaved] = useState(false);
  const busy = useRef(false);
  function save() {
    if (busy.current || saved) return;
    busy.current = true;
    try {
      const result = saveResolvedFix(
        localStorage,
        { ...draft, settings: settings.trim() },
        attempt,
        locale,
        version,
      );
      announceMyData();
      if (result.created) trackSolutionSaved();
      if (result.added) trackMyGameAdded();
      setSaved(true);
      setFailure('');
      setGameError(result.gameError);
      setMessage(result.created ? t.saved : t.already);
      onSaved?.();
    } catch {
      setFailure(t.error);
    } finally {
      busy.current = false;
    }
  }
  return (
    <section className="resolved-fix-save" aria-label={t.heading}>
      <h4>{t.heading}</h4>
      <p>{t.privacy}</p>
      {!saved && (
        <>
          <label>
            {t.settings}
            <textarea
              rows={3}
              maxLength={4000}
              value={settings}
              onChange={(e) => setSettings(e.target.value)}
              placeholder={t.settingsHint}
            />
          </label>
          <p>{t.settingsHint}</p>
          <label>
            {t.version}
            <input
              maxLength={120}
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder={t.unknown}
            />
          </label>
          <button type="button" disabled={!ready || !!error} onClick={save}>
            {draft.gameSlug ? t.save : t.saveNote}
          </button>
        </>
      )}
      <output aria-live="polite">{message}</output>
      {(failure || error) && <p role="alert">{failure || t.error}</p>}
      {gameError && (
        <>
          <p role="alert">{gameError}</p>
          <button
            type="button"
            onClick={() => {
              try {
                const { added } = registerFixGame(localStorage, draft.gameSlug);
                announceMyData();
                if (added) trackMyGameAdded();
                setGameError('');
              } catch (caught) {
                setGameError(
                  caught instanceof Error && caught.message === 'game-limit'
                    ? t.limit
                    : t.gameError,
                );
              }
            }}
          >
            {t.retry}
          </button>
        </>
      )}
      {saved && (
        <p>
          <a
            href={`${myGamesPath(locale)}#${draft.gameSlug && !gameError ? `my-game-${draft.gameSlug}` : 'issue-notebook'}`}
          >
            {t.open} →
          </a>
        </p>
      )}
    </section>
  );
}
