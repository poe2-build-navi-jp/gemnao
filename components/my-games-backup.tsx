'use client';
import { useRef, useState } from 'react';
import { useBrowserRecords } from './use-browser-records';
import {
  BACKUP_EVENT,
  BACKUP_RECOVERY_KEY,
  BACKUP_MAX_BYTES,
  parseRecoveryRecords,
  exportMyGames,
  previewMyGamesRestore,
  restoreMyGames,
  recoverMyGames,
  exportRecovery,
  BackupError,
  type RestorePreview,
} from '@/lib/my-games-backup';
import { myGamesTransferCopy } from '@/lib/my-games-transfer-copy';
import { MY_DATA_EVENT } from '@/lib/saved-solutions';
import { SETTINGS_SNAPSHOTS_EVENT } from '@/lib/game-settings-snapshots';
import { GAME_EXPERIMENTS_EVENT } from '@/lib/game-experiments';
import { PLAY_PLANS_EVENT } from '@/lib/play-plans';
import { PLAY_ACTIVITY_EVENT } from '@/lib/play-activity';
import { CHANGES_READ_EVENT } from '@/lib/my-game-changes-read';
import type { MyGamesLocale } from '@/lib/my-games-copy';
function announce() {
  for (const event of [
    BACKUP_EVENT,
    MY_DATA_EVENT,
    SETTINGS_SNAPSHOTS_EVENT,
    GAME_EXPERIMENTS_EVENT,
    PLAY_PLANS_EVENT,
    PLAY_ACTIVITY_EVENT,
    CHANGES_READ_EVENT,
  ])
    window.dispatchEvent(new Event(event));
}
function download(raw: string, prefix: string) {
  const url = URL.createObjectURL(
    new Blob([raw], { type: 'application/json' }),
  );
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${prefix}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
export function MyGamesBackup({ locale = 'ja' }: { locale?: MyGamesLocale }) {
  const t = myGamesTransferCopy[locale];
  const recovery = useBrowserRecords(
    BACKUP_RECOVERY_KEY,
    BACKUP_EVENT,
    parseRecoveryRecords,
  );
  const [preview, setPreview] = useState<RestorePreview | null>(null),
    [checked, setChecked] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const serial = useRef(0);
  const pending = !!recovery.items.length || recovery.error;
  function report(e: unknown) {
    setError(e instanceof BackupError ? t[e.code] : t.storage);
    setMessage('');
  }
  async function inspect(file: File) {
    const request = ++serial.current;
    setPreview(null);
    setChecked(false);
    setError('');
    setMessage('');
    setBusy(true);
    try {
      if (file.size > BACKUP_MAX_BYTES) throw new BackupError('size');
      const raw = await file.text();
      if (request !== serial.current) return;
      setPreview(previewMyGamesRestore(localStorage, raw));
      setTimeout(() => heading.current?.focus(), 0);
    } catch (e) {
      if (request === serial.current) report(e);
    } finally {
      if (request === serial.current) setBusy(false);
      if (input.current) input.current.value = '';
    }
  }
  function action(run: () => void) {
    setMessage('');
    setError('');
    try {
      run();
    } catch (e) {
      report(e);
    } finally {
      announce();
    }
  }
  return (
    <section
      className="my-games-backup"
      id="my-games-backup"
      aria-labelledby="backup-title"
    >
      <h2 id="backup-title">{t.heading}</h2>
      <p>{t.scope}</p>
      <p>{t.privacy}</p>
      <p className="transfer-note">{t.excluded}</p>
      {recovery.error ? (
        <p role="alert">{t.recoveryInvalid}</p>
      ) : (
        pending && (
          <div className="backup-recovery">
            <p role="alert">{t.pending}</p>
            <button
              type="button"
              onClick={() =>
                action(() => {
                  recoverMyGames(localStorage);
                  setPreview(null);
                  setMessage(t.recovered);
                })
              }
            >
              {t.recover}
            </button>
            <button
              type="button"
              onClick={() =>
                action(() => {
                  download(
                    exportRecovery(localStorage),
                    'gemnao-before-restore',
                  );
                  setMessage(t.exported);
                })
              }
            >
              {t.recoveryFile}
            </button>
          </div>
        )
      )}
      <div className="backup-actions">
        <button
          type="button"
          disabled={!recovery.ready || busy}
          onClick={() =>
            action(() => {
              download(exportMyGames(localStorage), 'gemnao-my-games');
              setMessage(t.exported);
            })
          }
        >
          {t.export}
        </button>
        <button
          type="button"
          disabled={!recovery.ready || pending || busy}
          onClick={() => input.current?.click()}
        >
          {busy ? t.busy : t.choose}
        </button>
        <input
          ref={input}
          type="file"
          accept=".json,application/json"
          aria-label={t.file}
          hidden
          disabled={!recovery.ready || pending || busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void inspect(file);
          }}
        />
      </div>
      {preview && !pending && (
        <div className="backup-preview">
          <h3 ref={heading} tabIndex={-1}>
            {t.preview}
          </h3>
          {preview.legacy && <p>{t.legacy}</p>}
          <p>{t.merge}</p>
          <p>{t.refs}</p>
          <ul className="backup-counts">
            {preview.rows.map((row) => (
              <li key={row.category}>
                <h4>{t[row.category]}</h4>
                <dl>
                  {(
                    [
                      'existing',
                      'incoming',
                      'added',
                      'duplicate',
                      'conflict',
                    ] as const
                  ).map((key) => (
                    <div key={key}>
                      <dt>{t[key]}</dt>
                      <dd>{row[key]}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
          <label>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            {t.check}
          </label>
          <div className="backup-actions">
            <button
              type="button"
              disabled={!checked || busy}
              onClick={() =>
                action(() => {
                  restoreMyGames(localStorage, preview);
                  setPreview(null);
                  setChecked(false);
                  setMessage(t.restored);
                })
              }
            >
              {t.confirm}
            </button>
            <button
              type="button"
              onClick={() => {
                serial.current++;
                setPreview(null);
                setChecked(false);
                setError('');
              }}
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}
      <output aria-live="polite">{message}</output>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
