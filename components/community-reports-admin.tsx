'use client';
import { redactReportContent } from '@/lib/community-reports/model';
/* oxlint-disable next/no-html-link-for-pages -- Reuse the existing admin login via native navigation. */
import { useEffect, useRef, useState } from 'react';
import { reportCopy } from '@/lib/community-reports/copy';
import {
  parseEvidence,
  labels,
  outcomes,
  reasons,
  type Evidence,
  type OwnerReport,
} from '@/lib/community-reports/model';
import { randomHex } from '@/lib/community-reports/local';
import type { MyGamesLocale } from '@/lib/my-games-copy';
import { CommunityReportView } from './community-report-view';
const adminCopy = {
  ja: {
    redact: '公開では本人の任意項目・出典URLを省略する',
    title: '不具合報告の審査',
    load: '一覧を読む',
    login: '既存の管理者ログインへ',
    preparing:
      '審査は未設定、または管理者認証が必要です。新しい鍵は作成しません。',
    approve: 'プレビューの内容を公開承認',
    hide: '非表示にする',
    restore: '同じ版の公開を復元',
    reject: '公開を見送る',
    cite: '記事引用を記録',
    withdrawn: '記事からの撤回完了を記録',
    article: '引用先の記事パス',
    evidence: '検証の根拠',
    environment: '別環境の条件（個人情報なし）',
    note: '検証・公式修正の対象と限界（300文字まで）',
    attest:
      '根拠の本文・確認記録を実際に確認し、このラベルの適用範囲を点検しました。審査だけで独立検証済みとはしません。',
    preview: '審査後の公開プレビュー',
    done: '操作を保存しました。',
    next: '次の5件',
    audit: '審査・根拠の監査履歴',
    duplicates: '重複先の報告ID（重複は独立確認数に加算しません）',
    flags: '通報',
    proposal:
      '本人報告の記事転載は無効です。長期転載には本人の別同意が必要で、現在の投稿同意から推定しません。',
  },
  en: {
    redact:
      'Omit the player’s optional fields and source URLs from publication',
    title: 'Review issue reports',
    load: 'Read queue',
    login: 'Existing admin login',
    preparing:
      'Review is unconfigured or admin login is required. No new key is created.',
    approve: 'Approve preview for publication',
    hide: 'Hide',
    restore: 'Restore the same revision',
    reject: 'Decline publication',
    cite: 'Record article citation',
    withdrawn: 'Record completed article withdrawal',
    article: 'Target article path',
    evidence: 'Evidence',
    environment: 'Separate environment; no personal data',
    note: 'Scope and limits of the check or official fix (300 characters)',
    attest:
      'I read the source or check record and confirmed the scope of this label. Review alone is not independent verification.',
    preview: 'Preview after review',
    done: 'Operation saved.',
    next: 'Next 5',
    audit: 'Review and evidence audit',
    duplicates: 'Duplicate target ID; no independent-count increment',
    flags: 'Flags',
    proposal:
      'Republication in articles is disabled. Long-term reuse requires separate player consent; the current report consent does not provide it.',
  },
  zh: {
    redact: '公开时省略本人的可选字段和来源URL',
    title: '故障报告审核',
    load: '读取列表',
    login: '现有管理员登录',
    preparing: '审核尚未配置或需要管理员登录，不创建新密钥。',
    approve: '批准预览内容公开',
    hide: '隐藏',
    restore: '恢复同一版本公开',
    reject: '暂不公开',
    cite: '记录文章引用',
    withdrawn: '记录文章撤回完成',
    article: '引用文章路径',
    evidence: '验证依据',
    environment: '其他环境条件，不含个人信息',
    note: '验证或官方修复的范围与限制，最多300字符',
    attest:
      '我已实际阅读来源正文或确认记录，并核对标签适用范围。仅审核不等于独立验证。',
    preview: '审核后公开预览',
    done: '已保存操作。',
    next: '接下来的5条',
    audit: '审核和依据审计历史',
    duplicates: '重复报告ID，不增加独立确认数量',
    flags: '举报',
    proposal:
      '已禁用文章转载。长期使用需要本人另行同意，不能从当前报告同意中推定。',
  },
  es: {
    redact: 'Omitir campos opcionales y URL del jugador al publicar',
    title: 'Revisar informes de fallos',
    load: 'Leer lista',
    login: 'Acceso de administrador existente',
    preparing:
      'Revisión sin configurar o requiere acceso de administrador; no creamos claves nuevas.',
    approve: 'Aprobar vista previa para publicar',
    hide: 'Ocultar',
    restore: 'Restaurar la misma revisión',
    reject: 'Rechazar publicación',
    cite: 'Registrar cita en artículo',
    withdrawn: 'Registrar retirada completada del artículo',
    article: 'Ruta del artículo citado',
    evidence: 'Pruebas',
    environment: 'Condiciones del otro equipo, sin datos personales',
    note: 'Alcance y límites de la comprobación o corrección oficial, máximo 300 caracteres',
    attest:
      'Leí la fuente o el registro de comprobación y revisé el alcance de la etiqueta. La revisión sola no equivale a verificación independiente.',
    preview: 'Vista previa tras revisión',
    done: 'Operación guardada.',
    next: 'Siguientes 5',
    audit: 'Auditoría de revisión y pruebas',
    duplicates: 'ID del duplicado; no añade confirmaciones independientes',
    flags: 'Avisos',
    proposal:
      'La reproducción en artículos está desactivada. El uso permanente requiere otro consentimiento del jugador; el actual no lo concede.',
  },
};
const queueMessages = {
  ja: {
    loading: '一覧を読み込み中…',
    empty: '読み込み完了。今回の一覧対象は0件です。',
    loaded: '読み込み完了。このページの件数：',
    unauthorized:
      '認証または審査設定を確認できません（401）。既存の管理者ログインを同じブラウザで確認し、この画面に戻ってください。ログイン済みでも続く場合は審査設定の確認が必要です。',
    forbidden:
      'アクセスが拒否されました（403）。別経路で再試行せず、管理者に確認してください。',
    unavailable:
      '管理サービスを利用できません（503）。設定・サービス状態の確認が必要です。0件という意味ではありません。',
    limited:
      '読み取り回数の制限に達しました（429）。連続で再試行せず、時間を置いて確認してください。',
    invalid: '応答を読み取れませんでした。件数は未確認です。',
    network:
      '通信に失敗しました。接続を確認してから再度読み込んでください。件数は未確認です。',
    timeout:
      '10秒以内に応答がなかったため読み込みを中止しました。件数は未確認です。',
    other: '一覧を読み込めませんでした。HTTP状態：',
  },
  en: {
    loading: 'Reading queue…',
    empty: 'Read complete. No reports in this result.',
    loaded: 'Read complete. Reports on this page:',
    unauthorized:
      'Authentication or review configuration could not be verified (401). Check the existing admin login in this browser, then return here. If already signed in, review configuration needs checking.',
    forbidden:
      'Access denied (403). Do not retry through another route; contact the administrator.',
    unavailable:
      'Admin service unavailable (503). Configuration or service status needs checking. This does not mean zero reports.',
    limited:
      'Read limit reached (429). Wait before trying again; do not repeatedly retry.',
    invalid: 'Could not read the response. Report count is unknown.',
    network:
      'Connection failed. Check connectivity before retrying. Report count is unknown.',
    timeout:
      'Reading stopped after 10 seconds without a response. Report count is unknown.',
    other: 'Could not read the queue. HTTP status:',
  },
  zh: {
    loading: '正在读取列表…',
    empty: '读取完成，本次列表没有报告。',
    loaded: '读取完成，本页报告数：',
    unauthorized:
      '无法确认认证或审核配置（401）。请在同一浏览器确认现有管理员登录，再返回此页。若已登录仍失败，需要检查审核配置。',
    forbidden: '访问被拒绝（403）。请勿改用其他路径重试，请联系管理员。',
    unavailable:
      '管理服务不可用（503）。需要检查配置或服务状态，不代表报告为0条。',
    limited: '已达到读取次数限制（429）。请稍后再试，不要连续重试。',
    invalid: '无法读取响应，报告数量尚未确认。',
    network: '连接失败，请检查网络后再试。报告数量尚未确认。',
    timeout: '10秒内未收到响应，已停止读取。报告数量尚未确认。',
    other: '无法读取列表，HTTP状态：',
  },
  es: {
    loading: 'Leyendo lista…',
    empty: 'Lectura completada. No hay informes en este resultado.',
    loaded: 'Lectura completada. Informes en esta página:',
    unauthorized:
      'No se pudo verificar la autenticación o configuración de revisión (401). Comprueba el acceso de administrador en este navegador y vuelve aquí. Si ya has iniciado sesión, hay que revisar la configuración.',
    forbidden:
      'Acceso denegado (403). No reintentes por otra ruta; consulta al administrador.',
    unavailable:
      'Servicio de administración no disponible (503). Hay que revisar su configuración o estado. No significa que haya cero informes.',
    limited:
      'Se alcanzó el límite de lecturas (429). Espera antes de volver a intentarlo; no repitas solicitudes seguidas.',
    invalid:
      'No se pudo leer la respuesta. Se desconoce el número de informes.',
    network:
      'Falló la conexión. Compruébala antes de reintentar. Se desconoce el número de informes.',
    timeout:
      'Lectura detenida tras 10 segundos sin respuesta. Se desconoce el número de informes.',
    other: 'No se pudo leer la lista. Estado HTTP:',
  },
};
type QueueRow = OwnerReport & {
  deleted?: boolean;
  flags: { reason: string; count: number }[];
  references: {
    article_path: string;
    revision: number;
    withdrawal_at: number | null;
    completed_at: number | null;
  }[];
};
function ReviewCard({
  row,
  locale,
  onDone,
}: {
  row: QueueRow;
  locale: MyGamesLocale;
  onDone: () => Promise<void>;
}) {
  const t = reportCopy[locale],
    a = adminCopy[locale],
    today = new Date().toISOString().slice(0, 10);
  const [label, setLabel] = useState<Evidence['label']>('self-report'),
    [checked, setChecked] = useState(''),
    [source, setSource] = useState(''),
    [sourceDate, setSourceDate] = useState(''),
    [observed, setObserved] = useState(''),
    [result, setResult] = useState<Evidence['result']>(null),
    [environment, setEnvironment] = useState(''),
    [note, setNote] = useState(''),
    [attest, setAttest] = useState(false),
    [reason, setReason] = useState<(typeof reasons)[number]>('other'),
    [duplicate, setDuplicate] = useState(''),
    [preview, setPreview] = useState<Evidence | null>(null),
    [redact, setRedact] = useState(true),
    [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false),
    [pendingOperation, setPendingOperation] = useState<Record<
      string,
      unknown
    > | null>(null);
  const guard = useRef(false),
    pending = useRef<Record<string, unknown> | null>(null);
  function edit() {
    setPreview(null);
    setAttest(false);
  }
  function evidence() {
    return parseEvidence(
      {
        label,
        checkedOn: checked,
        basis: {
          'self-report': 'self-report',
          'separate-environment': 'separate-pc-test',
          'official-fix': 'official-announcement',
        }[label],
        sources: source ? [{ url: source, readOn: sourceDate }] : [],
        observedOn: observed || null,
        result,
        environment,
        note,
      },
      Math.floor(Date.now() / 1000),
    );
  }
  async function act(action: string, path = '') {
    if (guard.current) return;
    guard.current = true;
    setBusy(true);
    try {
      if (action === 'approve' && (!preview || !attest))
        throw Error('evidence');
      pending.current ||= {
        id: row.id,
        revision: row.revision,
        requestId: randomHex(),
        action,
        reason,
        ...(action === 'approve'
          ? { evidence: preview, redactOptional: redact }
          : {}),
        ...(['cite', 'withdrawn'].includes(action)
          ? { articlePath: path }
          : {}),
        ...(reason === 'duplicate' ? { duplicateOf: duplicate } : {}),
      };
      setPendingOperation(pending.current);
      if (pending.current.action !== action) throw Error('pending');
      const r = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pending.current),
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      });
      const d = (await r.json()) as { ok?: boolean; error?: string };
      if (!r.ok || d.ok !== true) throw Error(d.error || 'unavailable');
      pending.current = null;
      setPendingOperation(null);
      setPreview(null);
      setAttest(false);
      setNotice(a.done);
      await onDone();
    } catch {
      setNotice(t.failure);
    } finally {
      guard.current = false;
      setBusy(false);
    }
  }
  return (
    <article className="review-card">
      <h2>{row.id}</h2>
      {row.content && (
        <CommunityReportView content={row.content} locale={locale} />
      )}
      <p>{t.state[row.state as keyof typeof t.state]}</p>
      <p>
        {a.flags}:{' '}
        {row.flags
          .map(
            (f) =>
              `${t.reasons[f.reason as keyof typeof t.reasons]} ${f.count}`,
          )
          .join(' / ') || '0'}
      </p>
      <p>{a.proposal}</p>
      {!row.deleted && (
        <fieldset disabled={busy || !!pendingOperation}>
          <legend>{a.evidence}</legend>
          <label>
            {a.evidence}
            <select
              value={label}
              onChange={(e) => {
                setLabel(e.target.value as Evidence['label']);
                edit();
              }}
            >
              {labels.map((l) => (
                <option key={l} value={l}>
                  {t.labels[l]}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t.reviewed}
            <input
              type="date"
              max={today}
              value={checked}
              onChange={(e) => {
                setChecked(e.target.value);
                edit();
              }}
            />
          </label>
          <label>
            {t.source}
            <input
              type="url"
              maxLength={400}
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setSourceDate('');
                edit();
              }}
            />
          </label>
          <label>
            {t.sourceReadOn}
            <input
              type="date"
              max={today}
              value={sourceDate}
              onChange={(e) => {
                setSourceDate(e.target.value);
                edit();
              }}
            />
          </label>
          <label>
            {t.evidenceObserved}
            <input
              type="date"
              max={today}
              value={observed}
              onChange={(e) => {
                setObserved(e.target.value);
                edit();
              }}
            />
          </label>
          <label>
            {t.evidenceResult}
            <select
              value={result || ''}
              onChange={(e) => {
                setResult((e.target.value as Evidence['result']) || null);
                edit();
              }}
            >
              <option value="">{t.unknown}</option>
              {outcomes.map((o) => (
                <option key={o} value={o}>
                  {t.results[o]}
                </option>
              ))}
            </select>
          </label>
          <label>
            {a.environment}
            <input
              maxLength={120}
              value={environment}
              onChange={(e) => {
                setEnvironment(e.target.value);
                edit();
              }}
            />
          </label>
          <label>
            {a.note}
            <textarea
              maxLength={300}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                edit();
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              try {
                setPreview(evidence());
                setNotice('');
              } catch {
                setNotice(t.errors.input);
              }
            }}
          >
            {a.preview}
          </button>
          <label>
            <input
              type="checkbox"
              checked={redact}
              onChange={(e) => {
                setRedact(e.target.checked);
                edit();
              }}
            />
            {a.redact}
          </label>
          {preview && row.content && (
            <CommunityReportView
              content={redact ? redactReportContent(row.content) : row.content}
              evidence={preview}
              locale={locale}
            />
          )}
          <label>
            <input
              type="checkbox"
              checked={attest}
              onChange={(e) => setAttest(e.target.checked)}
            />
            {a.attest}
          </label>
          <button
            type="button"
            disabled={!preview || !attest}
            onClick={() => void act('approve')}
          >
            {a.approve}
          </button>
        </fieldset>
      )}
      <label>
        {t.reason}
        <select
          value={reason}
          disabled={busy || !!pendingOperation}
          onChange={(e) => setReason(e.target.value as typeof reason)}
        >
          {reasons.map((r) => (
            <option key={r} value={r}>
              {t.reasons[r]}
            </option>
          ))}
        </select>
      </label>
      <label>
        {a.duplicates}
        <input
          value={duplicate}
          maxLength={32}
          disabled={busy || !!pendingOperation}
          onChange={(e) => setDuplicate(e.target.value)}
        />
      </label>
      {!row.deleted && (
        <div>
          {(['hide', 'restore', 'reject'] as const).map((action) => (
            <button
              key={action}
              disabled={busy || !!pendingOperation}
              type="button"
              onClick={() => void act(action)}
            >
              {a[action]}
            </button>
          ))}
        </div>
      )}
      {row.references
        .filter((r) => r.withdrawal_at !== null && r.completed_at === null)
        .map((r) => (
          <p key={r.article_path}>
            {r.article_path}
            <button
              disabled={busy || !!pendingOperation}
              type="button"
              onClick={() => void act('withdrawn', r.article_path)}
            >
              {a.withdrawn}
            </button>
          </p>
        ))}
      {!!pendingOperation && (
        <button
          disabled={busy}
          type="button"
          onClick={() =>
            void act(
              String(pending.current!.action),
              typeof pending.current!.articlePath === 'string'
                ? pending.current!.articlePath
                : '',
            )
          }
        >
          {t.retry}
        </button>
      )}
      <details>
        <summary>{a.audit}</summary>
        {row.audit?.map((e, i) => (
          <p key={i}>
            {new Date(e.at * 1000).toISOString()} / {e.action} /{' '}
            {e.evidence &&
              `${t.labels[e.evidence.label]} ${e.evidence.checkedOn}`}
          </p>
        ))}
      </details>
      <output aria-live="polite">{notice}</output>
    </article>
  );
}
const queueAttemptLabels = {
  ja: 'この画面での読込回数：',
  en: 'Read attempts on this screen:',
  zh: '本页面读取次数：',
  es: 'Intentos de lectura en esta pantalla:',
};
export function CommunityReportsAdmin() {
  const [locale, setLocale] = useState<MyGamesLocale>('ja'),
    [rows, setRows] = useState<QueueRow[]>([]),
    [status, setStatus] = useState<keyof typeof queueMessages.ja | ''>(''),
    [httpStatus, setHttpStatus] = useState(0),
    [attempt, setAttempt] = useState(0),
    [next, setNext] = useState<string | null>(null),
    [busy, setBusy] = useState(false);
  const t = reportCopy[locale],
    a = adminCopy[locale],
    guard = useRef(false),
    request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  async function load(cursor = '') {
    if (guard.current) return;
    guard.current = true;
    setBusy(true);
    setStatus('loading');
    setAttempt((value) => value + 1);
    setRows([]);
    setNext(null);
    const controller = new AbortController();
    request.current = controller;
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const r = await fetch(
        `/api/admin/reports?all=true${cursor ? '&before=' + encodeURIComponent(cursor) : ''}`,
        {
          cache: 'no-store',
          credentials: 'same-origin',
          signal: controller.signal,
        },
      );
      if (!r.ok) {
        setHttpStatus(r.status);
        setStatus(
          r.status === 401
            ? 'unauthorized'
            : r.status === 403
              ? 'forbidden'
              : r.status === 503
                ? 'unavailable'
                : r.status === 429
                  ? 'limited'
                  : 'other',
        );
        return;
      }
      const d = (await r.json().catch(() => null)) as null | {
        reports: QueueRow[];
        next: string | null;
      };
      if (controller.signal.aborted) {
        setStatus('timeout');
        return;
      }
      if (
        !d ||
        !Array.isArray(d.reports) ||
        !(d.next === null || typeof d.next === 'string')
      ) {
        setStatus('invalid');
        return;
      }
      setRows(d.reports);
      setNext(d.next);
      setStatus(d.reports.length ? 'loaded' : 'empty');
    } catch {
      setRows([]);
      setStatus(controller.signal.aborted ? 'timeout' : 'network');
    } finally {
      clearTimeout(timer);
      request.current = null;
      guard.current = false;
      setBusy(false);
    }
  }
  return (
    <div
      className="report-workspace"
      lang={locale === 'zh' ? 'zh-Hans' : locale}
    >
      <label>
        Language
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as MyGamesLocale)}
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
          <option value="zh">简体中文</option>
          <option value="es">Español</option>
        </select>
      </label>
      <h1>{a.title}</h1>
      <p>
        <a href="/admin/discord-servers">{a.login}</a>
      </p>
      <button
        disabled={busy}
        aria-busy={busy}
        type="button"
        onClick={() => void load()}
      >
        {busy ? queueMessages[locale].loading : a.load}
      </button>
      <output
        className="report-queue-status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="report-queue-result">
          {status ? queueMessages[locale][status] : ''}
          {status === 'loaded'
            ? ` ${rows.length}`
            : status === 'other'
              ? ` ${httpStatus}`
              : ''}
        </span>
        {attempt > 0 && (
          <>
            <br />
            <span className="report-queue-attempt">
              {queueAttemptLabels[locale]} {attempt}
            </span>
          </>
        )}
      </output>
      {rows.map((r) => (
        <ReviewCard
          key={`${r.id}:${r.revision}:${locale}`}
          row={r}
          locale={locale}
          onDone={() => load()}
        />
      ))}
      {next && (
        <button type="button" disabled={busy} onClick={() => void load(next)}>
          {a.next}
        </button>
      )}
      <p>{t.privacy}</p>
    </div>
  );
}
