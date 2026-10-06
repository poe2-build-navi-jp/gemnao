// Anonymous per-action tokens are idempotency keys, not visitor identifiers.
// Nothing from the private notebook is accepted by this transport.
export type StepResultSubmission = {
  game: string;
  topic: string;
  method: string;
  outcome: 'resolved' | 'not-resolved';
  reportStruggling: boolean;
};
type Pending = StepResultSubmission & {
  requestId: string;
  requestedAt: string;
  terminalStatus?: number;
};
export class StepResultError extends Error {
  constructor(
    message: string,
    public retryable = true,
  ) {
    super(message);
  }
}
const requests = new Map<string, Pending>();
const running = new Map<
  string,
  { method: string; promise: Promise<'sent' | 'already'> }
>();
const completed = new Set<string>();

export function hasFeedbackVote(key: string): boolean {
  if (completed.has(key)) return true;
  try {
    return Boolean(localStorage.getItem(key));
  } catch {
    return false;
  }
}
export function markFeedbackVote(key: string) {
  completed.add(key);
  try {
    localStorage.setItem(key, '1');
  } catch {
    /* Keep in-memory dedupe. */
  }
}

export function sendStepResult(
  input: StepResultSubmission,
): Promise<'sent' | 'already'> {
  const prefix = `gemnao-feedback:${input.game}:${input.topic}`;
  const vote = `${prefix}:${input.outcome === 'resolved' ? 'resolved' : `not-resolved:${input.method}`}`;
  if (hasFeedbackVote(vote)) return Promise.resolve('already');
  const active = running.get(vote);
  if (active)
    return active.method === input.method
      ? active.promise
      : Promise.reject(
          new StepResultError(
            '別のSTEPの回答を送信中です。その回答の結果を確認してください。',
            false,
          ),
        );
  const promise = submit(input, prefix, vote);
  running.set(vote, { method: input.method, promise });
  return promise;
}

async function submit(
  input: StepResultSubmission,
  prefix: string,
  vote: string,
): Promise<'sent' | 'already'> {
  // Defer until the running entry is installed, including synchronous errors.
  await Promise.resolve();
  try {
    const key = `${vote}:request`;
    let request = requests.get(key);
    if (!request) {
      try {
        const saved = JSON.parse(
          localStorage.getItem(key) || 'null',
        ) as Pending | null;
        // A failed resolved request remains tied to its original STEP.
        // Never relabel an ambiguous write as a different method.
        if (
          saved &&
          saved.game === input.game &&
          saved.topic === input.topic &&
          saved.method === input.method &&
          saved.outcome === input.outcome &&
          typeof saved.reportStruggling === 'boolean' &&
          typeof saved.requestedAt === 'string' &&
          typeof saved.requestId === 'string' &&
          /^[a-f0-9-]{36}$/i.test(saved.requestId)
        )
          request = saved;
        else if (saved)
          throw new StepResultError(
            '別のSTEPの送信結果が未確認です。元のSTEPから再送してください。',
            false,
          );
      } catch (error) {
        if (error instanceof Error && error.message.startsWith('別のSTEP'))
          throw error;
      }
    }
    if (request && request.method !== input.method)
      throw new StepResultError(
        '別のSTEPの送信結果が未確認です。元のSTEPから再送してください。',
        false,
      );
    if (!request) {
      request = {
        ...input,
        requestId: crypto.randomUUID(),
        requestedAt: new Date().toISOString(),
      };
      requests.set(key, request);
      try {
        localStorage.setItem(key, JSON.stringify(request));
      } catch {
        /* In-memory retry remains safe. */
      }
    }
    requests.set(key, request);
    if (request.terminalStatus)
      throw new StepResultError(
        'この回答の送信番号は再利用できません。ノートは別に保存できます。',
        false,
      );
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'step-result',
        game: request.game,
        topic: request.topic,
        method: request.method,
        outcome: request.outcome,
        reportStruggling: request.reportStruggling,
        requestId: request.requestId,
        requestedAt: request.requestedAt,
      }),
    });
    if (response.status === 429)
      throw new StepResultError(
        '匿名回答の受付が混み合っています。回答は追加されていません。同じ回答を時間をおいて再送できます。',
      );
    if ([400, 403, 409, 410].includes(response.status)) {
      request.terminalStatus = response.status;
      requests.set(key, request);
      try {
        localStorage.setItem(key, JSON.stringify(request));
      } catch {
        /* Keep memory marker. */
      }
      throw new StepResultError(
        response.status === 410
          ? '送信番号の期限が切れました。二重集計を防ぐため、この回答は再送できません。ノートは別に保存できます。'
          : '回答の送信番号を確認できません。二重集計を防ぐため、この回答は再送できません。',
        false,
      );
    }
    if (
      !response.ok ||
      ((await response.json()) as { ok?: boolean }).ok !== true
    )
      throw new StepResultError(
        '匿名回答の送信完了を確認できませんでした。同じ回答を再送できます。',
      );
    markFeedbackVote(vote);
    if (request.reportStruggling) markFeedbackVote(`${prefix}:struggling`);
    requests.delete(key);
    try {
      localStorage.removeItem(key);
    } catch {
      /* Completed marker takes priority. */
    }
    return 'sent';
  } catch (error) {
    if (error instanceof StepResultError) throw error;
    throw new StepResultError(
      '匿名回答の送信完了を確認できませんでした。同じ回答を再送できます。',
    );
  } finally {
    running.delete(vote);
  }
}

// Recovery is explicitly browser/article-level, independent of private case IDs
// or note revisions. Expose only the original public STEP/result to the UI.
export function readPendingStepResults(
  game: string,
  topic: string,
  methodIds: string[],
) {
  const prefix = `gemnao-feedback:${game}:${topic}`;
  const votes = [
    `${prefix}:resolved`,
    ...methodIds.map((id) => `${prefix}:not-resolved:${id}`),
  ];
  return votes.flatMap(
    (vote): (StepResultSubmission & { retryable: boolean })[] => {
      if (hasFeedbackVote(vote)) return [];
      let pending = requests.get(`${vote}:request`);
      if (!pending) {
        try {
          pending = JSON.parse(
            localStorage.getItem(`${vote}:request`) || 'null',
          ) as Pending | undefined;
        } catch {
          return [];
        }
      }
      if (
        !pending ||
        pending.game !== game ||
        pending.topic !== topic ||
        !methodIds.includes(pending.method) ||
        !['resolved', 'not-resolved'].includes(pending.outcome) ||
        typeof pending.reportStruggling !== 'boolean' ||
        typeof pending.requestId !== 'string' ||
        !/^[a-f0-9-]{36}$/i.test(pending.requestId) ||
        !Number.isFinite(Date.parse(pending.requestedAt))
      )
        return [];
      return [
        {
          game,
          topic,
          method: pending.method,
          outcome: pending.outcome,
          reportStruggling: pending.reportStruggling,
          retryable:
            !pending.terminalStatus &&
            Date.parse(pending.requestedAt) >= Date.now() - 30 * 86400000 &&
            Date.parse(pending.requestedAt) <= Date.now() + 300000,
        },
      ];
    },
  );
}
