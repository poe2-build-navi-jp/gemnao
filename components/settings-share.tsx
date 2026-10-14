'use client';
import { useEffect, useRef, useState } from 'react';
import { settingsShareText } from '@/lib/settings-share';
import { myGamesTransferCopy } from '@/lib/my-games-transfer-copy';
import type { SettingsSnapshot } from '@/lib/game-settings-snapshots';
import type { MyGamesLocale } from '@/lib/my-games-copy';
export function SettingsShare({
  gameName,
  snapshot,
  locale,
}: {
  gameName: string;
  snapshot: SettingsSnapshot;
  locale: MyGamesLocale;
}) {
  const t = myGamesTransferCopy[locale];
  const [includeMemo, setIncludeMemo] = useState(false),
    [message, setMessage] = useState(''),
    [failed, setFailed] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  const current = useRef('');
  const text = settingsShareText(gameName, snapshot, locale, includeMemo);
  useEffect(() => {
    current.current = text;
    return () => {
      current.current = '';
    };
  }, [text]);
  function select() {
    area.current?.focus();
    area.current?.select();
  }
  async function copy() {
    const copied = text;
    setMessage('');
    setFailed(false);
    try {
      await navigator.clipboard.writeText(copied);
      if (current.current === copied) setMessage(t.copied);
    } catch {
      if (current.current !== copied) return;
      setFailed(true);
      setMessage(t.manual);
      select();
    }
  }
  return (
    <section className="settings-share" aria-label={t.share}>
      <h6>{t.share}</h6>
      <p>{t.shareHint}</p>
      <label className="settings-comfort">
        <input
          type="checkbox"
          checked={includeMemo}
          onChange={(e) => {
            setIncludeMemo(e.target.checked);
            setMessage('');
            setFailed(false);
          }}
        />
        {t.includeMemo}
      </label>
      <label>
        {t.sharePreview}
        <textarea
          ref={area}
          aria-label={t.sharePreview}
          rows={6}
          readOnly
          value={text}
        />
      </label>
      <button type="button" onClick={() => void copy()}>
        {t.copy}
      </button>
      {failed && (
        <button type="button" onClick={select}>
          {t.manualSelect}
        </button>
      )}
      <output aria-live="polite">{message}</output>
    </section>
  );
}
