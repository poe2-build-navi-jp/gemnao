import assert from 'node:assert/strict';
import { build } from 'esbuild';
const compiled = await build({
  entryPoints: ['lib/step-result-client.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const source = `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`;
const { sendStepResult, StepResultError, readPendingStepResults } =
  await import(source);
const values = new Map();
let blocked = false;
globalThis.localStorage = {
  getItem(key) {
    if (blocked) throw Error('blocked');
    return values.get(key) || null;
  },
  setItem(key, value) {
    if (blocked) throw Error('blocked');
    values.set(key, value);
  },
  removeItem(key) {
    if (blocked) throw Error('blocked');
    values.delete(key);
  },
};
const calls = [];
let handler = async () => Response.json({ ok: true });
globalThis.fetch = async (url, options) => {
  assert.equal(url, '/api/feedback');
  const body = JSON.parse(options.body);
  calls.push(body);
  return handler(body);
};
const input = (game, extra = {}) => ({
  game,
  topic: 'display',
  method: 'step-1',
  outcome: 'not-resolved',
  reportStruggling: false,
  ...extra,
});
const allowed = [
  'game',
  'kind',
  'method',
  'outcome',
  'reportStruggling',
  'requestId',
  'requestedAt',
  'topic',
].sort();
let release;
handler = () =>
  new Promise((resolve) => {
    release = resolve;
  });
const first = sendStepResult(input('double-click'));
const second = sendStepResult(input('double-click'));
await Promise.resolve();
await Promise.resolve();
assert.equal(calls.length, 1);
release(Response.json({ ok: true }));
assert.deepEqual(await Promise.all([first, second]), ['sent', 'sent']);
assert.equal(await sendStepResult(input('double-click')), 'already');
assert.equal(calls.length, 1);
// Simulate a committed write whose HTTP response disappears.
const serverReceipts = new Set();
let count = 0;
handler = async (body) => {
  if (!serverReceipts.has(body.requestId)) {
    serverReceipts.add(body.requestId);
    count++;
  }
  if (
    count === 1 &&
    calls.filter((c) => c.game === 'lost-response').length === 1
  )
    throw Error('network lost');
  return Response.json({ ok: true });
};
await assert.rejects(sendStepResult(input('lost-response')), /送信完了/);
const lost = calls.at(-1);
assert.equal(await sendStepResult(input('lost-response')), 'sent');
assert.equal(calls.at(-1).requestId, lost.requestId);
assert.equal(count, 1);
// New module instance emulates a page reload. Retry reuses its stored token.
handler = async () => {
  throw Error('offline');
};
await assert.rejects(
  sendStepResult(input('reload', { outcome: 'resolved' })),
  StepResultError,
);
const original = calls.at(-1);
const reloaded = await import(`${source}#reload`);
await assert.rejects(
  reloaded.sendStepResult(
    input('reload', { outcome: 'resolved', method: 'step-2' }),
  ),
  /別のSTEP/,
);
assert.equal(calls.at(-1).requestId, original.requestId);
handler = async () => Response.json({ ok: true });
assert.equal(
  await reloaded.sendStepResult(input('reload', { outcome: 'resolved' })),
  'sent',
);
assert.equal(calls.at(-1).requestId, original.requestId);
// Private or unexpected properties in stale storage must never reach the API.
const prefix = 'gemnao-feedback:whitelist:display:not-resolved:step-1:request';
values.set(
  prefix,
  JSON.stringify({
    ...input('whitelist'),
    requestId: crypto.randomUUID(),
    requestedAt: new Date().toISOString(),
    notes: 'PRIVATE_SENTINEL',
    email: 'PRIVATE_SENTINEL',
    device: 'PRIVATE_SENTINEL',
  }),
);
assert.equal(await sendStepResult(input('whitelist')), 'sent');
assert.deepEqual(Object.keys(calls.at(-1)).sort(), allowed);
assert.ok(!JSON.stringify(calls).includes('PRIVATE_SENTINEL'));
blocked = true;
assert.equal(await sendStepResult(input('storage-blocked')), 'sent');
const before = calls.length;
assert.equal(await sendStepResult(input('storage-blocked')), 'already');
assert.equal(calls.length, before, 'memory dedupe works without storage');
blocked = false;
handler = async () => Response.json({ error: 'expired' }, { status: 410 });
await assert.rejects(
  sendStepResult(input('expired')),
  (e) => e instanceof StepResultError && !e.retryable,
);
assert.equal(
  readPendingStepResults('expired', 'display', ['step-1'])[0].retryable,
  false,
);
const beforeTerminalRetry = calls.length;
await assert.rejects(
  sendStepResult(input('expired')),
  (e) => e instanceof StepResultError && !e.retryable,
);
assert.equal(
  calls.length,
  beforeTerminalRetry,
  'terminal token cannot be endlessly resent',
);
handler = async () => Response.json({ error: 'not ready' }, { status: 503 });
await assert.rejects(
  sendStepResult(input('not-ready')),
  (e) => e instanceof StepResultError && e.retryable,
);
// The final-result flag is frozen with the request, even if other UI changes.
handler = async () => {
  throw Error('offline');
};
await assert.rejects(
  sendStepResult(input('final', { reportStruggling: true })),
  StepResultError,
);
const pending = calls.at(-1);
handler = async () => Response.json({ ok: true });
await sendStepResult(input('final', { reportStruggling: false }));
assert.equal(calls.at(-1).requestId, pending.requestId);
assert.equal(calls.at(-1).reportStruggling, true);
for (const call of calls) assert.deepEqual(Object.keys(call).sort(), allowed);
console.log(
  'PASS: double clicks, shared in-flight navigation, lost-response retry, reload retry, method binding, explicit payload whitelist, storage denial, terminal expiry, unavailable retry, frozen final flag. No network requests.',
);
