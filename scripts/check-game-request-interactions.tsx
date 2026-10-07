import assert from 'node:assert/strict';
import { GameRequestForm } from '../components/game-request-form';

type Element = { type?: unknown; props?: Record<string, unknown> };
function find(node: unknown, type: string): Element | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const result = find(child, type);
      if (result) return result;
    }
  } else if (node && typeof node === 'object') {
    const element = node as Element;
    if (element.type === type) return element;
    return find(element.props?.children, type);
  }
}
const harness = globalThis as unknown as {
  __states: unknown[];
  __index: number;
  __refs: { current: unknown }[];
  __refIndex: number;
};
function render() {
  harness.__index = 0;
  harness.__refIndex = 0;
  return GameRequestForm({ locale: 'en' });
}
function reset(available = true) {
  harness.__states = [available, false, 0, '', false, null];
  harness.__refs = [];
}
function enter(title: string) {
  const handler = find(render(), 'input')?.props?.onChange;
  assert.equal(typeof handler, 'function');
  (handler as (e: unknown) => void)({ target: { value: title } });
}
function submit() {
  const handler = find(render(), 'form')?.props?.onSubmit;
  assert.equal(typeof handler, 'function');
  return (handler as (e: unknown) => Promise<void>)({ preventDefault() {} });
}
const original = globalThis.fetch;
try {
  reset(false);
  assert.equal(find(render(), 'form'), undefined);
  reset();
  enter('x');
  await submit();
  assert.equal(harness.__states[5], 'invalid');
  for (const [status, body, expected] of [
    [201, { ok: true, status: 'received', duplicate: false }, 'received'],
    [200, { ok: true, status: 'received', duplicate: true }, 'duplicate'],
    [503, {}, 'unavailable'],
    [429, {}, 'rateLimited'],
    [200, {}, 'failed'],
  ] as const) {
    reset();
    enter('原神');
    let resolve!: (r: Response) => void;
    let calls = 0;
    globalThis.fetch = () => {
      calls++;
      return new Promise<Response>((done) => {
        resolve = done;
      });
    };
    const first = submit();
    assert.equal(find(render(), 'input')?.props?.disabled, true);
    assert.equal(find(render(), 'button')?.props?.disabled, true);
    await submit();
    assert.equal(calls, 1, 'Synchronous guard blocks double submission');
    resolve(new Response(JSON.stringify(body), { status }));
    await first;
    assert.equal(harness.__states[5], expected);
    assert.equal(
      harness.__states[3],
      expected === 'received' || expected === 'duplicate' ? '' : '原神',
    );
    assert.equal(harness.__states[4], false);
    if (status === 503) assert.equal(find(render(), 'form'), undefined);
  }
  reset();
  enter('原神');
  globalThis.fetch = async () => {
    throw new Error('offline');
  };
  await submit();
  assert.equal(harness.__states[5], 'failed');
  assert.equal(harness.__states[3], '原神');
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({ ok: true, status: 'received', duplicate: false }),
      { status: 201 },
    );
  await submit();
  assert.equal(harness.__states[5], 'received');
} finally {
  globalThis.fetch = original;
}
console.log(
  'Game request interactions: unavailable gate, invalid title, double clicks, busy controls, success/duplicate, rate limit, 503, malformed receipt and network retry passed (shallow hooks; browser QA separate).',
);
