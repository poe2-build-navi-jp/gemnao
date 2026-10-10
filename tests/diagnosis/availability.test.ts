import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  diagnosisRequest,
  DiagnosisRequestError,
} from '../../lib/diagnosis/local';
import {
  diagnosisStorageFailure,
  diagnosisRetryHeaders,
} from '../../lib/diagnosis/availability';
import { buildSnapshot } from '../../lib/diagnosis/validation';
import { RULE_VERSION } from '../../lib/diagnosis/model';

const now = Date.UTC(2026, 9, 10, 23, 59, 58);
for (const kind of ['read', 'write'])
  void test(`D1 daily ${kind} limit has the UTC reset and no provider detail`, () => {
    const failure = diagnosisStorageFailure(
      new Error(
        `D1_ERROR: Your account has exceeded D1's free tier daily row ${kind} limit. PRIVATE SQL`,
      ),
      now,
    );
    assert.equal(failure.code, 'daily_limit');
    assert.equal(failure.retryAt, Date.UTC(2026, 9, 11));
    assert.deepEqual(diagnosisRetryHeaders(failure, now), {
      'Retry-After': '2',
    });
    assert.ok(!JSON.stringify(failure).includes('PRIVATE'));
  });
void test('UTC midnight advances to the next day; capacity and unknown errors do not promise a daily reset', () => {
  assert.equal(
    diagnosisStorageFailure(
      new Error("D1's free tier daily row read limit"),
      Date.UTC(2026, 9, 11),
    ).retryAt,
    Date.UTC(2026, 9, 12),
  );
  for (const message of [
    "Your account has exceeded D1's maximum account storage limit",
    'Exceeded maximum DB size.',
  ]) {
    const failure = diagnosisStorageFailure(new Error(message), now);
    assert.equal(failure.code, 'storage_limit');
    assert.equal(failure.retryAt, undefined);
    assert.deepEqual(diagnosisRetryHeaders(failure, now), {});
  }
  const failure = diagnosisStorageFailure(
    new Error('PRIVATE SQL AND TOKEN'),
    now,
  );
  assert.equal(failure.code, 'unavailable');
  assert.ok(!JSON.stringify(failure).includes('PRIVATE'));
  assert.equal(failure.retryAt, undefined);
});

void test('HTML, malformed JSON and invalid success DTOs never become successful requests or auto-retry', async () => {
  const original = globalThis.fetch;
  try {
    for (const response of [
      new Response('<html>Error 1027</html>', {
        status: 503,
        headers: { 'Content-Type': 'text/html' },
      }),
      new Response('<html>static fallback</html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }),
      new Response('not JSON', {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
      Response.json({}),
      Response.json(null),
      Response.json([]),
      Response.json({ error: 'not a save' }),
      Response.json({ id: 'bad', recoveryKey: null, expiresAt: now }),
    ]) {
      let requests = 0;
      globalThis.fetch = async () => {
        requests++;
        return response;
      };
      await assert.rejects(
        diagnosisRequest('', { snapshot: {} }),
        (error: unknown) =>
          error instanceof DiagnosisRequestError &&
          error.unavailable &&
          /入力は消去していません/.test(error.message),
      );
      assert.equal(requests, 1);
    }
    let requests = 0;
    globalThis.fetch = async () => {
      requests++;
      throw new Error('network PRIVATE');
    };
    await assert.rejects(
      diagnosisRequest('/session', {}),
      (error: unknown) =>
        error instanceof DiagnosisRequestError &&
        error.unavailable &&
        !error.message.includes('PRIVATE'),
    );
    assert.equal(requests, 1);
  } finally {
    globalThis.fetch = original;
  }
});

void test('valid response contracts and safe API errors are preserved', async () => {
  const original = globalThis.fetch;
  try {
    const id = 'a'.repeat(32);
    const snapshot = buildSnapshot({
      answers: {
        symptom: 'not-launching',
        scope: 'game',
        observation: 'error',
        error: 'directx',
        change: 'none',
        launcher: 'steam',
        os: 'windows11',
        gpu: 'nvidia',
        ram: '32',
      },
      tried: { verify: 'unchanged' },
      results: {},
      version: RULE_VERSION,
    });
    assert.ok(snapshot);
    const shared = {
      id,
      snapshot,
      createdAt: now,
      updatedAt: now,
      expiresAt: now + 86400000,
      revision: 1,
    };
    for (const [path, body, method, data] of [
      [
        '/config',
        undefined,
        'POST',
        { enabled: true, sharing: false, metrics: false },
      ],
      ['/session', {}, 'POST', { ok: true }],
      ['', {}, 'POST', { ...shared, recoveryKey: 'b'.repeat(64) }],
      ['', {}, 'POST', { ...shared, recoveryKey: null, repeated: true }],
      [`/${id}`, undefined, 'GET', shared],
      [
        `/${id}/owner`,
        undefined,
        'GET',
        { id, inactive: true, expiresAt: now },
      ],
      [
        `/${id}`,
        {},
        'PATCH',
        { ok: true, revision: 2, updatedAt: now, expiresAt: now },
      ],
      [`/${id}`, {}, 'DELETE', { ok: true }],
    ] as const) {
      globalThis.fetch = async () => Response.json(data);
      assert.deepEqual(await diagnosisRequest(path, body, method), data);
    }
    for (const data of [
      { sharing: true },
      { enabled: true, sharing: true },
      { enabled: 'true', sharing: true, metrics: false },
    ]) {
      globalThis.fetch = async () => Response.json(data);
      await assert.rejects(diagnosisRequest('/config'), DiagnosisRequestError);
    }
    for (const malformedSnapshot of [
      { answers: {}, result: {} },
      { ...snapshot, tried: null },
      { ...snapshot, tried: { verify: '__proto__' } },
      { ...snapshot, results: { verify: 'not-a-status' } },
      { ...snapshot, answers: JSON.parse('{"__proto__":"test"}') },
      { ...snapshot, result: { ...snapshot.result, missing: null } },
      {
        ...snapshot,
        result: { ...snapshot.result, recommendations: [{ action: {} }] },
      },
      { ...snapshot, result: { ...snapshot.result, decision: {} } },
    ]) {
      globalThis.fetch = async () =>
        Response.json({ ...shared, snapshot: malformedSnapshot });
      await assert.rejects(diagnosisRequest(`/${id}`), DiagnosisRequestError);
    }
    const archived = structuredClone(snapshot);
    delete archived.result.decision;
    globalThis.fetch = async () =>
      Response.json({ ...shared, snapshot: archived });
    assert.deepEqual(await diagnosisRequest(`/${id}`), {
      ...shared,
      snapshot: archived,
    });
    globalThis.fetch = async () =>
      Response.json(
        { error: '本日の受付を停止しています。', code: 'daily_limit' },
        { status: 503 },
      );
    await assert.rejects(
      diagnosisRequest('/session', {}),
      (error: unknown) =>
        error instanceof DiagnosisRequestError &&
        error.unavailable &&
        error.message === '本日の受付を停止しています。',
    );
    globalThis.fetch = async () =>
      Response.json({ error: '入力が正しくありません。' }, { status: 400 });
    await assert.rejects(
      diagnosisRequest('/session', {}),
      (error: unknown) =>
        error instanceof DiagnosisRequestError &&
        !error.unavailable &&
        error.message === '入力が正しくありません。',
    );
  } finally {
    globalThis.fetch = original;
  }
});
