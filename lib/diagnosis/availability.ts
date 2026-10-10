/** Public, non-sensitive failure details shared by the API and browser. */
export const DIAGNOSIS_UNAVAILABLE =
  '保存・共有機能を一時的に利用できません。入力は消去していません。時間を空けて再試行してください。';

export type DiagnosisFailure = {
  error: string;
  code: 'daily_limit' | 'storage_limit' | 'unavailable';
  retryAt?: number;
};

/** Do not return or log the provider error: it can contain SQL or private data. */
export function diagnosisStorageFailure(
  error: unknown,
  now = Date.now(),
): DiagnosisFailure {
  const message = error instanceof Error ? error.message : '';
  if (/D1's free tier daily row (?:read|write) limit/i.test(message)) {
    return {
      code: 'daily_limit',
      error:
        '本日の無料利用枠に達したため、保存・共有の受付を一時停止しています。入力は消去していません。日本時間の午前9時以降に再試行してください。',
      retryAt: (Math.floor(now / 86400000) + 1) * 86400000,
    };
  }
  if (
    /D1's maximum account storage limit|Exceeded maximum DB size/i.test(message)
  ) {
    return {
      code: 'storage_limit',
      error:
        '保存容量の上限に達したため、保存・共有の受付を一時停止しています。入力は消去していません。',
    };
  }
  return { code: 'unavailable', error: DIAGNOSIS_UNAVAILABLE };
}

export function diagnosisRetryHeaders(
  failure: DiagnosisFailure,
  now: number,
): Record<string, string> {
  return failure.retryAt === undefined
    ? {}
    : {
        'Retry-After': String(
          Math.max(1, Math.ceil((failure.retryAt - now) / 1000)),
        ),
      };
}
