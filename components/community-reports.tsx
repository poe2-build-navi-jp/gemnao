'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { games } from '@/lib/games';
import { gameArticles } from '@/lib/game-articles';
import { gameDisplayName } from '@/lib/game-display-name';
import { articleReview } from '@/lib/fix-save';
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { reportCopy } from '@/lib/community-reports/copy';
import {
  parseContent,
  validReportVersion,
  symptoms,
  outcomes,
  reasons,
  type Content,
  type OwnerReport,
  type PublicReport,
} from '@/lib/community-reports/model';
import {
  releaseRejectedUpdate,
  prepareCreate,
  prepareChange,
  sendPending,
  acknowledge,
  readTickets,
  randomHex,
  REPORT_DRAFT_KEY,
  REPORT_OWNER_KEY,
  type Ticket,
} from '@/lib/community-reports/local';
import { CommunityReportView, reportGuide } from './community-report-view';
const initial: Content = {
  articlePath: '',
  symptom: 'launch',
  stepIds: [],
  outcome: 'unresolved',
  observedOn: null,
  version: '',
  os: 'unknown',
  gpu: 'unknown',
  sources: [],
};
function PublicFlag({ id, locale }: { id: string; locale: MyGamesLocale }) {
  const t = reportCopy[locale],
    [reason, setReason] = useState<(typeof reasons)[number]>('privacy'),
    [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false),
    [hasPending, setHasPending] = useState(false);
  const pending = useRef<{ requestId: string; reason: string } | null>(null),
    guard = useRef(false);
  async function send() {
    if (guard.current) return;
    guard.current = true;
    setBusy(true);
    pending.current ||= { requestId: randomHex(), reason };
    setHasPending(true);
    try {
      const r = await fetch(`/api/reports/${id}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pending.current),
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      });
      const d = (await r.json()) as { ok?: boolean };
      if (!r.ok || d.ok !== true) throw Error('unavailable');
      setNotice(t.flagged);
    } catch {
      setNotice(t.failure);
    } finally {
      guard.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="report-flag">
      <label>
        {t.reason}
        <select
          value={reason}
          disabled={busy || hasPending}
          onChange={(e) => setReason(e.target.value as typeof reason)}
        >
          {reasons.map((r) => (
            <option key={r} value={r}>
              {t.reasons[r]}
            </option>
          ))}
        </select>
      </label>
      <button
        disabled={busy || notice === t.flagged}
        onClick={() => void send()}
        type="button"
      >
        {busy ? t.busy : t.flag}
      </button>
      <output aria-live="polite">{notice}</output>
    </div>
  );
}
export function CommunityReports({
  locale = 'ja',
}: {
  locale?: MyGamesLocale;
}) {
  const t = reportCopy[locale],
    [draft, setDraft] = useState<Content>(initial),
    [game, setGame] = useState(''),
    [tickets, setTickets] = useState<Ticket[]>([]),
    [ticket, setTicket] = useState<Ticket | null>(null),
    [record, setRecord] = useState<OwnerReport | null>(null),
    [publicRows, setPublicRows] = useState<PublicReport[]>([]);
  const [status, setStatus] = useState({
      enabled: false,
      publicEnabled: false,
      canDelete: false,
    }),
    [preview, setPreview] = useState(false),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState('');
  const guard = useRef(false),
    preparation = useRef(false),
    generation = useRef(0),
    selection = useRef<string | null>(null),
    publicSerial = useRef(0);
  const [publicEpoch, setPublicEpoch] = useState(0);
  const [now] = useState(() => Math.floor(Date.now() / 1000));
  const today = new Date(now * 1000).toISOString().slice(0, 10);
  const article = articleReview(draft.articlePath),
    guide = article ? reportGuide(draft, locale) : null;
  const draftLocked = !!ticket?.pending || busy;
  const reloadLocal = useCallback(() => {
    const x = readTickets(localStorage);
    setTickets(x);
    window.dispatchEvent(new Event('gemnao-reports-updated'));
    return x;
  }, []);
  const failure = useCallback(
    (caught: unknown) => {
      const key = caught instanceof Error ? caught.message : '';
      setError(`${t.failure} ${t.errors[key as keyof typeof t.errors] || ''}`);
    },
    [t.failure, t.errors],
  );
  function change<K extends keyof Content>(key: K, value: Content[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setPreview(false);
    setConsent(false);
    setMessage('');
  }
  useEffect(() => {
    let stopped = false;
    queueMicrotask(() => {
      if (stopped) return;
      try {
        const savedTickets = reloadLocal();
        const q = new URLSearchParams(location.search),
          path = q.get('article') || '';
        const a = articleReview(path);
        const stored = localStorage.getItem(REPORT_DRAFT_KEY);
        let d = initial;
        if (stored) {
          const x = JSON.parse(stored);
          if (x?.version !== 1) throw Error('local');
          d = parseContent(x.content, Math.floor(Date.now() / 1000));
        }
        if (a?.gameSlug && path === a.path)
          d = {
            ...initial,
            articlePath: path,
            symptom: symptoms.includes(q.get('symptom') as Content['symptom'])
              ? (q.get('symptom') as Content['symptom'])
              : 'other',
            stepIds: [
              ...new Set(
                (q.get('steps') || '')
                  .split(',')
                  .filter((id) => a.steps.some((s) => s.id === id)),
              ),
            ].slice(0, 8),
            outcome: outcomes.includes(q.get('outcome') as Content['outcome'])
              ? (q.get('outcome') as Content['outcome'])
              : 'unresolved',
          };
        const unfinished = savedTickets.find(
          (x) =>
            x.pending &&
            (!path ||
              (x.pending.body.content &&
                (x.pending.body.content as Content).articlePath === path)),
        );
        if (unfinished) {
          setTicket(unfinished);
          selection.current = unfinished.id;
          if (unfinished.pending?.body.content)
            d = parseContent(
              unfinished.pending.body.content,
              Math.floor(Date.now() / 1000),
            );
        }
        setDraft(d);
        setGame(
          unfinished?.gameSlug ||
            a?.gameSlug ||
            q.get('game') ||
            d.articlePath.split('/')[2] ||
            '',
        );
      } catch (e) {
        failure(e);
      }
    });
    void fetch('/api/reports/status', {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })
      .then(async (r) => {
        if (!r.ok) throw Error('unavailable');
        const s = (await r.json()) as {
          enabled: boolean;
          publicEnabled: boolean;
          canDelete: boolean;
        } & Record<string, unknown>;
        if (
          ['enabled', 'publicEnabled', 'canDelete'].some(
            (k) => typeof s[k] !== 'boolean',
          )
        )
          throw Error('unavailable');
        setStatus(s);
      })
      .catch(() =>
        setStatus({ enabled: false, publicEnabled: false, canDelete: false }),
      );
    return () => {
      stopped = true;
    };
    // Storage and locale are initialized once; no implicit submission.
  }, [locale, failure, reloadLocal]);
  useEffect(() => {
    const invalidate = (e: StorageEvent) => {
      if (
        e.storageArea !== localStorage ||
        (e.key !== null && e.key !== REPORT_OWNER_KEY)
      )
        return;
      try {
        const current = readTickets(localStorage);
        setTickets(current);
        generation.current++;
        publicSerial.current++;
        setPublicRows([]);
        setPublicEpoch((n) => n + 1);
        setRecord(null);
        const selected =
          current.find((x) => x.id === selection.current) || null;
        setTicket(selected);
        if (!selected) selection.current = null;
      } catch (e) {
        failure(e);
      }
    };
    window.addEventListener('storage', invalidate);
    return () => window.removeEventListener('storage', invalidate);
  }, [failure]);
  useEffect(() => {
    let stopped = false;
    const serial = ++publicSerial.current;
    queueMicrotask(() => {
      if (!stopped && serial === publicSerial.current) setPublicRows([]);
    });
    if (!game || !status.publicEnabled) return;
    void fetch(
      `/api/reports/public?game=${encodeURIComponent(game)}&symptom=${draft.symptom}`,
      { cache: 'no-store', signal: AbortSignal.timeout(10000) },
    )
      .then(async (r) => {
        if (!r.ok) throw Error('unavailable');
        const d = (await r.json()) as { reports: PublicReport[] };
        if (!Array.isArray(d.reports)) throw Error('unavailable');
        if (!stopped && serial === publicSerial.current)
          setPublicRows(d.reports);
      })
      .catch(() => {
        if (!stopped && serial === publicSerial.current)
          setError(t.errors.unavailable);
      });
    return () => {
      stopped = true;
    };
  }, [
    game,
    draft.symptom,
    status.publicEnabled,
    t.errors.unavailable,
    publicEpoch,
  ]);
  async function loadOwner(selected: Ticket) {
    selection.current = selected.id;
    const current = ++generation.current;
    setError('');
    const r = await fetch(`/api/reports/${selected.id}`, {
      headers: { 'X-Report-Owner': selected.key },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    const d = (await r.json()) as OwnerReport & {
      error?: string;
      deleted?: boolean;
    };
    if (current !== generation.current || selection.current !== selected.id)
      return;
    if (!r.ok) throw Error(d.error || 'unavailable');
    if (current !== generation.current) return;
    if (d.deleted) {
      if (d.id !== selected.id) throw Error('unavailable');
      acknowledge(localStorage, selected, true);
      reloadLocal();
      setTicket(null);
      selection.current = null;
      setRecord(null);
      setMessage(t.deleted + (d.withdrawalPending ? ` ${t.withdrawal}` : ''));
      return;
    }
    if (d.id !== selected.id || !Number.isInteger(d.revision) || !d.content)
      throw Error('unavailable');
    setRecord(d);
    setTicket(selected);
    setDraft(d.content);
    setGame(selected.gameSlug);
    setPreview(false);
    setConsent(false);
  }
  function draftFailure(caught: unknown) {
    const key = caught instanceof Error ? caught.message : '';
    setError(
      ['content', 'date', 'source'].includes(key) || caught instanceof TypeError
        ? t.draftInvalid +
            ' ' +
            (!validReportVersion(draft.version)
              ? t.versionError
              : t.errors.input)
        : t.draftStorageError,
    );
  }
  function saveDraft() {
    const content = parseContent(draft, now);
    localStorage.setItem(
      REPORT_DRAFT_KEY,
      JSON.stringify({ version: 1, content }),
    );
    return content;
  }
  async function execute(selected: Ticket) {
    if (guard.current) return;
    guard.current = true;
    generation.current++;
    selection.current = selected.id;
    setRecord(null);
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await sendPending(selected);
      publicSerial.current++;
      setPublicRows([]);
      setPublicEpoch((e) => e + 1);
      acknowledge(localStorage, selected, result.deleted === true);
      const current = reloadLocal().find((x) => x.id === selected.id) || null;
      generation.current++;
      selection.current = current?.id || null;
      setTicket(current);
      setRecord(null);
      setPreview(false);
      setConsent(false);
      setMessage(
        result.deleted
          ? t.deleted + (result.withdrawalPending ? ` ${t.withdrawal}` : '')
          : t.sent,
      );
      if (current) {
        try {
          await loadOwner(current);
        } catch (e) {
          failure(e);
        }
      }
    } catch (e) {
      try {
        if (releaseRejectedUpdate(localStorage, selected, e)) {
          const current = reloadLocal().find((x) => x.id === selected.id);
          if (current) {
            setTicket(current);
            await loadOwner(current);
            setDraft(selected.pending!.body.content as Content);
            setPreview(false);
            setConsent(false);
            setError(t.errors.conflict);
            setPublicEpoch((n) => n + 1);
          }
          return;
        }
      } catch (recoveryError) {
        failure(recoveryError);
      }
      failure(e);
      try {
        const x = reloadLocal().find((x) => x.id === selected.id);
        if (x) setTicket(x);
      } catch {
        /* Preserve storage unchanged. */
      }
    } finally {
      guard.current = false;
      setBusy(false);
    }
  }
  async function submit() {
    if (
      guard.current ||
      preparation.current ||
      !preview ||
      !consent ||
      !status.enabled
    )
      return;
    preparation.current = true;
    setBusy(true);
    try {
      if (ticket && !record) throw Error('unavailable');
      const content = saveDraft();
      const next =
        ticket && record
          ? prepareChange(
              localStorage,
              ticket,
              'PATCH',
              content,
              record.revision,
            )
          : await prepareCreate(localStorage, content);
      setTicket(next);
      reloadLocal();
      await execute(next);
    } catch (e) {
      failure(e);
    } finally {
      preparation.current = false;
      setBusy(false);
    }
  }
  async function remove(selected: Ticket) {
    if (
      busy ||
      guard.current ||
      preparation.current ||
      !status.canDelete ||
      !confirm(t.confirmDelete)
    )
      return;
    try {
      const next = prepareChange(localStorage, selected, 'DELETE');
      setTicket(next);
      reloadLocal();
      await execute(next);
    } catch (e) {
      failure(e);
    }
  }
  return (
    <div className="report-workspace">
      <p>{t.intro}</p>
      <p>{t.privacy}</p>
      <p>{t.ownership}</p>
      <p>{t.retention}</p>
      {!status.enabled && <p className="report-notice">{t.disabled}</p>}
      <button
        type="button"
        disabled={busy || !!ticket?.pending}
        onClick={() => {
          generation.current++;
          selection.current = null;
          setTicket(null);
          setRecord(null);
          setDraft(initial);
          setGame('');
          setPreview(false);
          setConsent(false);
        }}
      >
        {t.newReport}
      </button>
      <fieldset disabled={draftLocked}>
        <legend>{t.title}</legend>
        <label>
          {t.game}
          <select
            value={game}
            onChange={(e) => {
              generation.current++;
              selection.current = null;
              setGame(e.target.value);
              change('articlePath', '');
              change('stepIds', []);
              setTicket(null);
              setRecord(null);
            }}
          >
            <option value="">—</option>
            {games.map((g) => (
              <option key={g.slug} value={g.slug}>
                {gameDisplayName(g, locale)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.article}
          <select
            value={draft.articlePath}
            onChange={(e) => {
              change('articlePath', e.target.value);
              change('stepIds', []);
            }}
          >
            <option value="">—</option>
            {gameArticles
              .filter(
                (a) =>
                  a.gameSlug === game &&
                  !['draft', 'thin'].includes(a.status || 'verified'),
              )
              .map((a) => {
                const path = `/games/${a.gameSlug}/${a.slug}`;
                return (
                  <option key={path} value={path}>
                    {
                      reportGuide({ ...initial, articlePath: path }, locale)
                        .title
                    }
                  </option>
                );
              })}
          </select>
        </label>
        <label>
          {t.symptom}
          <select
            value={draft.symptom}
            onChange={(e) =>
              change('symptom', e.target.value as Content['symptom'])
            }
          >
            {symptoms.map((s) => (
              <option key={s} value={s}>
                {t.symptoms[s]}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="report-step-list">
          <legend>{t.steps}</legend>
          {guide?.steps.map((s) => (
            <label key={s.id}>
              <input
                type="checkbox"
                checked={draft.stepIds.includes(s.id)}
                onChange={(e) =>
                  change(
                    'stepIds',
                    e.target.checked
                      ? [...draft.stepIds, s.id]
                      : draft.stepIds.filter((id) => id !== s.id),
                  )
                }
              />
              {s.title}
              {guide.fallback ? t.jaGuide : ''}
            </label>
          ))}
        </fieldset>
        <label>
          {t.outcome}
          <select
            value={draft.outcome}
            onChange={(e) =>
              change('outcome', e.target.value as Content['outcome'])
            }
          >
            {outcomes.map((s) => (
              <option key={s} value={s}>
                {t.outcomes[s]}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.observed}
          <input
            type="date"
            max={today}
            value={draft.observedOn || ''}
            onChange={(e) => change('observedOn', e.target.value || null)}
          />
        </label>
        <label>
          {t.version}
          <input
            maxLength={24}
            aria-invalid={!validReportVersion(draft.version)}
            aria-describedby="report-version-hint report-version-error"
            value={draft.version}
            onChange={(e) => change('version', e.target.value)}
          />
        </label>
        <span id="report-version-hint">{t.versionHint}</span>
        <span id="report-version-error" role="alert">
          {!validReportVersion(draft.version) ? t.versionError : ''}
        </span>
        <label>
          {t.os}
          <select
            value={draft.os}
            onChange={(e) => change('os', e.target.value as Content['os'])}
          >
            {['unknown', 'windows-10', 'windows-11', 'other'].map((s) => (
              <option key={s} value={s}>
                {s === 'unknown'
                  ? t.unknown
                  : s === 'other'
                    ? t.symptoms.other
                    : s}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.gpu}
          <select
            value={draft.gpu}
            onChange={(e) => change('gpu', e.target.value as Content['gpu'])}
          >
            {['unknown', 'nvidia', 'amd', 'intel', 'other'].map((s) => (
              <option key={s} value={s}>
                {s === 'unknown'
                  ? t.unknown
                  : s === 'other'
                    ? t.symptoms.other
                    : s}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.source}
          <input
            type="url"
            maxLength={400}
            value={draft.sources[0]?.url || ''}
            onChange={(e) =>
              change(
                'sources',
                e.target.value
                  ? [
                      {
                        url: e.target.value,
                        readOn: null,
                      },
                      ...draft.sources.slice(1),
                    ]
                  : draft.sources.slice(1),
              )
            }
          />
        </label>
        <label>
          {t.readOn}
          <input
            type="date"
            max={today}
            value={draft.sources[0]?.readOn || ''}
            disabled={!draft.sources.length}
            onChange={(e) =>
              change(
                'sources',
                draft.sources.map((s, i) =>
                  i === 0 ? { ...s, readOn: e.target.value || null } : s,
                ),
              )
            }
          />
        </label>
        <p>{t.optional}</p>
        <div className="my-pc-actions">
          <button
            type="button"
            onClick={() => {
              try {
                saveDraft();
                setMessage(t.draftSaved);
                setError('');
              } catch (e) {
                draftFailure(e);
              }
            }}
          >
            {t.saveDraft}
          </button>
          <button
            type="button"
            onClick={() => {
              try {
                parseContent(draft, now);
                setPreview(true);
                setConsent(false);
                setError('');
              } catch (e) {
                draftFailure(e);
              }
            }}
          >
            {t.preview}
          </button>
        </div>
      </fieldset>
      {preview && (
        <section className="report-preview">
          <h2>{t.previewTitle}</h2>
          <p>{t.previewNote}</p>
          <CommunityReportView content={draft} locale={locale} />
          <label className="report-consent">
            <input
              type="checkbox"
              checked={consent}
              disabled={busy}
              onChange={(e) => setConsent(e.target.checked)}
            />
            {t.consent}
          </label>
          <button
            type="button"
            disabled={
              !consent ||
              !status.enabled ||
              busy ||
              !!ticket?.pending ||
              (!!ticket && !record)
            }
            onClick={() => void submit()}
          >
            {busy ? t.busy : t.send}
          </button>
        </section>
      )}
      {ticket?.pending && (
        <section className="report-pending">
          <p>{t.failure}</p>
          {!!ticket.pending.body.content && (
            <CommunityReportView
              content={ticket.pending.body.content as Content}
              locale={locale}
            />
          )}
          <button
            type="button"
            disabled={
              busy ||
              (ticket.pending.method !== 'DELETE' && !status.enabled) ||
              (ticket.pending.method === 'DELETE' && !status.canDelete)
            }
            onClick={() => void execute(ticket)}
          >
            {t.retry}
          </button>
          <button
            type="button"
            disabled={busy || !status.canDelete}
            onClick={() => void remove(ticket)}
          >
            {t.cancelPending}
          </button>
        </section>
      )}
      <output aria-live="polite">{message}</output>
      {error && <p role="alert">{error}</p>}
      <section id="mine">
        <h2>{t.mine}</h2>
        {tickets.map((x) => (
          <article key={x.id} className="report-owner">
            <h3>
              {games.some((g) => g.slug === x.gameSlug)
                ? gameDisplayName(
                    games.find((g) => g.slug === x.gameSlug)!,
                    locale,
                  )
                : x.gameSlug}
            </h3>
            <p>
              {t.draftCreated}:{' '}
              {new Date(x.createdAt * 1000).toISOString().slice(0, 10)}
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                generation.current++;
                selection.current = x.id;
                setTicket(x);
                setRecord(null);
                if (x.pending?.body.content) {
                  setDraft(x.pending.body.content as Content);
                  setGame(x.gameSlug);
                } else void loadOwner(x).catch(failure);
              }}
            >
              {t.open}
            </button>
            <button
              type="button"
              disabled={busy || !status.canDelete}
              onClick={() => void remove(x)}
            >
              {t.remove}
            </button>
          </article>
        ))}
      </section>
      {record && (
        <section className="report-history">
          <h2>{t.history}</h2>
          <p>{t.state[record.state as keyof typeof t.state]}</p>
          <p>
            {t.posted}: {new Date(record.createdAt * 1000).toISOString()}
          </p>
          <p>
            {t.expires}: {new Date(record.expiresAt * 1000).toISOString()}
          </p>
          {record.withdrawalPending && <p>{t.withdrawal}</p>}
          <CommunityReportView content={record.content} locale={locale} />
          <button
            type="button"
            disabled={busy || !status.enabled || !!ticket?.pending}
            onClick={() => {
              setDraft(record.content);
              setGame(record.content.articlePath.split('/')[2]);
              setPreview(false);
              setConsent(false);
            }}
          >
            {t.edit}
          </button>
          <ol>
            {record.history.map((h) => (
              <li key={h.revision}>
                {new Date(h.at * 1000).toISOString()} ·{' '}
                {h.content ? t.outcomes[h.content.outcome] : t.deleted}
              </li>
            ))}
          </ol>
          <h3>{t.audit}</h3>
          <ul>
            {record.audit.map((a, i) => (
              <li key={i}>
                {new Date(a.at * 1000).toISOString()} ·{' '}
                {a.evidence
                  ? t.labels[a.evidence.label]
                  : t.actions[a.action as keyof typeof t.actions]}
                {a.evidence && (
                  <p>
                    {t.reviewed}: {a.evidence.checkedOn}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="report-public">
        <h2>{t.public}</h2>
        <p>{t.publicNote}</p>
        {!publicRows.length && <p>{t.empty}</p>}
        {publicRows.map((r) => (
          <article key={r.id}>
            <CommunityReportView
              content={r.content}
              evidence={r.evidence}
              locale={locale}
            />
            <p>
              {t.posted}: {new Date(r.postedAt * 1000).toISOString()}
            </p>
            <PublicFlag id={r.id} locale={locale} />
          </article>
        ))}
      </section>
    </div>
  );
}
