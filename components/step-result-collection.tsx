'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Locale } from '@/lib/i18n';
import {
  sendStepResult,
  readPendingStepResults,
  hasFeedbackVote,
  StepResultError,
} from '@/lib/step-result-client';

const copy = {
  en: {
    heading: 'Share the result you tried',
    intro:
      'After trying a step, share whether it fixed this article’s symptom. Only the article, step and result are sent to our anonymous counts. Your private notes and PC details are not sent.',
    limits:
      'Counts are answers, not people or a guaranteed success rate. “Not fixed” counts start with this feature; earlier failures did not record a method. Historical successes can include repeat or test answers. All language versions share the same counts.',
    loading: 'Checking whether reporting is available…',
    unavailable:
      'Result reporting is unavailable right now. You can still read the steps and use your private notebook.',
    reconnect: 'Check connection again',
    fixed: 'This fixed it',
    failed: 'Tried it, not fixed',
    sending: 'Sending your answer…',
    sent: 'Your anonymous answer was recorded.',
    alreadyFixed:
      'A solved answer for this article is already recorded in this browser. No extra method answer was sent.',
    alreadyFailed: 'This browser has already reported this step as not fixed.',
    error:
      'We could not confirm your answer was saved. You can retry the same answer.',
    blocked:
      'This submission token cannot be retried. Your private notebook is still available.',
    retry: 'Retry the same answer',
    pending:
      'This browser has an unconfirmed answer. Recover the original step and result without changing your private notes.',
    recover: 'Check original submission',
    counts: 'Reported answers',
    fixedCount: 'fixed',
    failedCount: 'not fixed (since this feature began)',
  },
  zh: {
    heading: '分享实际尝试的结果',
    intro:
      '尝试步骤后，可以反馈是否解决了本文描述的症状。仅文章、步骤和结果会发送到匿名计数中，不会发送私人笔记或电脑信息。',
    limits:
      '计数代表回答次数，不代表人数或保证有效的成功率。“未解决”从此功能启用后开始统计，之前的未解决回答没有记录方法。历史解决回答可能包含重复或测试回答。各语言版本共用同一计数。',
    loading: '正在检查反馈功能是否可用…',
    unavailable: '结果反馈暂不可用。仍可阅读步骤并使用私人笔记。',
    reconnect: '重新检查连接',
    fixed: '这个方法解决了',
    failed: '试过，仍未解决',
    sending: '正在发送回答…',
    sent: '已记录匿名回答。',
    alreadyFixed: '此浏览器已提交过本文的解决回答，没有追加方法回答。',
    alreadyFailed: '此浏览器已反馈过这个步骤未能解决问题。',
    error: '无法确认回答是否已保存，可以重试同一回答。',
    blocked: '此提交编号无法重试，私人笔记仍可使用。',
    retry: '重试同一回答',
    pending:
      '此浏览器有一条尚未确认的回答。可以按原步骤和结果确认发送，不会更改私人笔记。',
    recover: '确认原回答',
    counts: '回答次数',
    fixedCount: '已解决',
    failedCount: '未解决（此功能启用后）',
  },
  es: {
    heading: 'Comparte el resultado que probaste',
    intro:
      'Tras probar un paso, indica si resolvió el síntoma de este artículo. Solo enviamos el artículo, el paso y el resultado al recuento anónimo. No enviamos tus notas privadas ni datos del PC.',
    limits:
      'Los recuentos son respuestas, no personas ni una tasa de éxito garantizada. Los resultados «sin resolver» se recogen desde el inicio de esta función; antes no se registraba el método. Las respuestas históricas pueden incluir repeticiones o pruebas. Todas las versiones de idioma comparten el recuento.',
    loading: 'Comprobando si puedes enviar resultados…',
    unavailable:
      'El envío de resultados no está disponible ahora. Puedes seguir leyendo y usar tu cuaderno privado.',
    reconnect: 'Comprobar conexión',
    fixed: 'Esto lo solucionó',
    failed: 'Lo probé, sin resolver',
    sending: 'Enviando tu respuesta…',
    sent: 'Tu respuesta anónima se ha registrado.',
    alreadyFixed:
      'Este navegador ya registró una respuesta de solución para el artículo. No se añadió otra respuesta de método.',
    alreadyFailed: 'Este navegador ya indicó que este paso no lo resolvió.',
    error:
      'No pudimos confirmar que se guardara la respuesta. Puedes reintentar la misma.',
    blocked:
      'Este identificador de envío no se puede reutilizar. Tu cuaderno privado sigue disponible.',
    retry: 'Reintentar la misma respuesta',
    pending:
      'Hay una respuesta sin confirmar en este navegador. Recupera el paso y resultado originales sin cambiar tus notas privadas.',
    recover: 'Comprobar envío original',
    counts: 'Respuestas recibidas',
    fixedCount: 'resuelto',
    failedCount: 'sin resolver (desde el inicio de esta función)',
  },
};
type Step = { id: string; title: string };
type Outcome = 'resolved' | 'not-resolved';
type Report = {
  state: 'sending' | 'sent' | 'already' | 'error';
  retryable?: boolean;
};
type Method = { methodId: string; responses: number; notResolved?: number };
type Collection = {
  ready: boolean;
  t: typeof copy.en;
  methods: Method[];
  reports: Record<string, Report>;
  send: (method: string, outcome: Outcome) => Promise<void>;
};
const Context = createContext<Collection | null>(null);

// A small reporting-only layer: no navigation, saved-case IDs or notebook data.
export function StepResultCollection({
  contextSlug,
  topic,
  locale,
  steps,
  children,
}: {
  contextSlug: string;
  topic: string;
  locale: Locale;
  steps: Step[];
  children: ReactNode;
}) {
  const t = copy[locale];
  const [availability, setAvailability] = useState<
    'loading' | 'available' | 'unavailable'
  >('loading');
  const [refresh, setRefresh] = useState(0);
  const [methods, setMethods] = useState<Method[]>([]);
  const [reports, setReports] = useState<Record<string, Report>>({});
  const [pending, setPending] = useState<
    ReturnType<typeof readPendingStepResults>
  >([]);
  const ready = availability === 'available';
  function refreshPending() {
    setPending(
      readPendingStepResults(
        contextSlug,
        topic,
        steps.map((step) => step.id),
      ),
    );
  }
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(
          `/api/feedback?game=${encodeURIComponent(contextSlug)}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error('unavailable');
        const data = (await response.json()) as {
          methods?: Method[];
          stepResultsAvailable?: boolean;
        };
        if (controller.signal.aborted) return;
        if (!Array.isArray(data.methods) || data.stepResultsAvailable !== true)
          throw new Error('unavailable');
        setMethods(data.methods);
        setAvailability('available');
      } catch {
        if (!controller.signal.aborted) setAvailability('unavailable');
      }
      if (!controller.signal.aborted)
        setPending(
          readPendingStepResults(
            contextSlug,
            topic,
            steps.map((step) => step.id),
          ),
        );
    }
    void load();
    return () => controller.abort();
  }, [contextSlug, topic, steps, refresh]);
  async function send(method: string, outcome: Outcome) {
    if (!ready || !steps.some((step) => step.id === method)) return;
    const key = `${method}:${outcome}`;
    setReports((previous) => ({ ...previous, [key]: { state: 'sending' } }));
    try {
      const result = await sendStepResult({
        game: contextSlug,
        topic,
        method,
        outcome,
        reportStruggling:
          outcome === 'not-resolved' &&
          method === steps.at(-1)?.id &&
          !hasFeedbackVote(
            `gemnao-feedback:${contextSlug}:${topic}:struggling`,
          ),
      });
      setReports((previous) => ({ ...previous, [key]: { state: result } }));
      refreshPending();
      // A later aggregate GET cannot turn an accepted submission into an error.
      setRefresh((value) => value + 1);
    } catch (error) {
      setReports((previous) => ({
        ...previous,
        [key]: {
          state: 'error',
          retryable: !(error instanceof StepResultError) || error.retryable,
        },
      }));
      refreshPending();
    }
  }
  return (
    <Context.Provider value={{ ready, t, methods, reports, send }}>
      <aside className="procedure-note">
        <strong>{t.heading}</strong>
        <p>{t.intro}</p>
        <p>{t.limits}</p>
        {!ready && (
          <output aria-live="polite">
            {availability === 'loading' ? t.loading : t.unavailable}
          </output>
        )}
        {availability === 'unavailable' && (
          <button
            type="button"
            className="step-next"
            onClick={() => {
              setAvailability('loading');
              setRefresh((value) => value + 1);
            }}
          >
            {t.reconnect}
          </button>
        )}
        {pending.length > 0 && (
          <div>
            <p>{t.pending}</p>
            {pending.map((item) => (
              <p key={`${item.method}:${item.outcome}`}>
                {steps.find((step) => step.id === item.method)?.title}:{' '}
                {item.outcome === 'resolved' ? t.fixed : t.failed}{' '}
                {item.retryable ? (
                  <button
                    type="button"
                    className="step-next"
                    disabled={
                      !ready ||
                      reports[`${item.method}:${item.outcome}`]?.state ===
                        'sending'
                    }
                    onClick={() => void send(item.method, item.outcome)}
                  >
                    {t.recover}
                  </button>
                ) : (
                  t.blocked
                )}
              </p>
            ))}
          </div>
        )}
      </aside>
      {children}
    </Context.Provider>
  );
}

export function StepResultButtons({ method }: { method: string }) {
  const context = useContext(Context);
  if (!context) return null;
  const { ready, t, methods, reports, send } = context;
  const counts = methods.find((item) => item.methodId === method);
  return (
    <div className="step-result-controls">
      <div className="step-actions">
        {(['resolved', 'not-resolved'] as const).map((outcome) => (
          <button
            type="button"
            className={outcome === 'resolved' ? 'step-solved' : 'step-next'}
            disabled={
              !ready || reports[`${method}:${outcome}`]?.state === 'sending'
            }
            onClick={() => void send(method, outcome)}
            key={outcome}
          >
            {outcome === 'resolved' ? t.fixed : t.failed}
          </button>
        ))}
      </div>
      {counts &&
        Number.isSafeInteger(counts.responses) &&
        Number.isSafeInteger(counts.notResolved) &&
        counts.responses >= 0 &&
        (counts.notResolved || 0) >= 0 && (
          <p>
            {t.counts}: {t.fixedCount} {counts.responses} · {t.failedCount}{' '}
            {counts.notResolved}
          </p>
        )}
      {(['resolved', 'not-resolved'] as const).map((outcome) => {
        const report = reports[`${method}:${outcome}`];
        return (
          report && (
            <output className="procedure-note" aria-live="polite" key={outcome}>
              {report.state === 'sending'
                ? t.sending
                : report.state === 'sent'
                  ? t.sent
                  : report.state === 'already'
                    ? outcome === 'resolved'
                      ? t.alreadyFixed
                      : t.alreadyFailed
                    : report.retryable
                      ? t.error
                      : t.blocked}
              {report.state === 'error' && report.retryable && (
                <button
                  type="button"
                  className="step-next"
                  disabled={!ready}
                  onClick={() => void send(method, outcome)}
                >
                  {t.retry}
                </button>
              )}
            </output>
          )
        );
      })}
    </div>
  );
}
