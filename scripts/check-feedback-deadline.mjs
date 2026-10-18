import assert from 'node:assert/strict';
import { build } from 'esbuild';
const bundle = await build({
  stdin: {
    contents: `export * from './lib/step-result-client'; export * from './lib/feedback-deadline';`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const {
  sendStepResult,
  readPendingStepResults,
  withFeedbackDeadline,
  FEEDBACK_TIMEOUT_MS,
} = await import(
  'data:text/javascript;base64,' +
    Buffer.from(bundle.outputFiles[0].text).toString('base64')
);
assert.equal(FEEDBACK_TIMEOUT_MS, 15000);
const originalSet = globalThis.setTimeout,
  originalClear = globalThis.clearTimeout;
const timers = new Map();
let seq = 0;
globalThis.setTimeout = (fn, ms) => {
  assert.equal(ms, 15000);
  timers.set(++seq, fn);
  return seq;
};
globalThis.clearTimeout = (id) => timers.delete(id);
const storage = new Map();
globalThis.localStorage = {
  getItem: (k) => storage.get(k) || null,
  setItem: (k, v) => storage.set(k, v),
  removeItem: (k) => storage.delete(k),
};
globalThis.location = {
  origin: 'https://gemnao.pages.dev',
  pathname: '/en/games/monster-hunter-wilds/not-launching',
};
const events = [];
globalThis.window = { gtag: (...args) => events.push(args) };
const flush = async () => {
  for (let i = 0; i < 12; i++) await Promise.resolve();
};
const expire = async () => {
  for (const fn of timers.values()) fn();
  await flush();
};
const input = (game) => ({
  game,
  topic: 'launch',
  method: 'step-1',
  outcome: 'not-resolved',
  reportStruggling: false,
});
try {
  const receipts = new Set(),
    calls = [];
  let late, signal;
  globalThis.fetch = async (_, init) => {
    signal = init.signal;
    const body = JSON.parse(init.body);
    calls.push(body);
    receipts.add(body.requestId);
    return new Promise((r) => (late = r));
  };
  const p = sendStepResult(input('lost-late'));
  const rejection = assert.rejects(p, (e) => e.retryable === true);
  const duplicate = sendStepResult(input('lost-late'));
  assert.equal(duplicate, p);
  await flush();
  assert.equal(calls.length, 1);
  await expire();
  await rejection;
  assert.ok(signal.aborted);
  assert.equal(timers.size, 0);
  assert.equal(
    readPendingStepResults('lost-late', 'launch', ['step-1']).length,
    1,
  );
  late(Response.json({ ok: true }));
  await flush();
  assert.equal(events.filter((e) => e[1] === 'step_result_saved').length, 0);
  assert.equal(
    readPendingStepResults('lost-late', 'launch', ['step-1']).length,
    1,
    'late success cannot consume pending token',
  );
  location.pathname = '/es/games/monster-hunter-wilds/not-launching';
  globalThis.fetch = async (_, init) => {
    const body = JSON.parse(init.body);
    calls.push(body);
    receipts.add(body.requestId);
    return Response.json({ ok: true });
  };
  assert.equal(await sendStepResult(input('lost-late')), 'sent');
  assert.equal(calls[1].requestId, calls[0].requestId);
  assert.equal(calls[1].requestedAt, calls[0].requestedAt);
  assert.equal(receipts.size, 1);
  assert.equal(timers.size, 0);
  assert.equal(await sendStepResult(input('lost-late')), 'already');
  assert.equal(calls.length, 2);
  // Headers arrived, body stalled: also bounded. A delayed body cannot mark saved.
  let bodyDone;
  globalThis.fetch = async () => ({
    status: 200,
    ok: true,
    json: () => new Promise((r) => (bodyDone = r)),
  });
  const body = sendStepResult(input('stalled-body'));
  const bodyRejected = assert.rejects(body, (e) => e.retryable === true);
  await flush();
  await expire();
  await bodyRejected;
  bodyDone({ ok: true });
  await flush();
  assert.equal(
    readPendingStepResults('stalled-body', 'launch', ['step-1']).length,
    1,
  );
  // External cancellation releases GET work even when its transport ignores abort.
  const controller = new AbortController();
  let getDone,
    innerSignal,
    applied = false;
  const get = withFeedbackDeadline((signal) => {
    innerSignal = signal;
    return new Promise((r) => (getDone = r));
  }, controller.signal).then(() => {
    applied = true;
  });
  const cancelled = assert.rejects(get, (e) => e.name === 'AbortError');
  await flush();
  controller.abort();
  await cancelled;
  getDone({ ok: true });
  await flush();
  assert.equal(applied, false);
  assert.ok(innerSignal.aborted);
  assert.equal(timers.size, 0);
  const before = new AbortController();
  before.abort();
  let started = false;
  await assert.rejects(
    withFeedbackDeadline(async () => {
      started = true;
    }, before.signal),
    (e) => e.name === 'AbortError',
  );
  assert.equal(started, false);
  assert.equal(timers.size, 0);
  // Failure and successful delayed response both clean their timer.
  await assert.rejects(
    withFeedbackDeadline(async () => {
      throw Error('offline');
    }),
  );
  assert.equal(timers.size, 0);
  let finish;
  const normal = withFeedbackDeadline(() => new Promise((r) => (finish = r)));
  await flush();
  finish('ok');
  assert.equal(await normal, 'ok');
  assert.equal(timers.size, 0);
  console.log(
    'PASS: 15s deadline including stalled body, repeated clicks, committed/lost response, late success ignored, same-token retry across locales, abort/unmount, pre-abort, success/failure timer cleanup. Fake clock/transport/GA only.',
  );
} finally {
  globalThis.setTimeout = originalSet;
  globalThis.clearTimeout = originalClear;
}
