import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { GameRequestForm } from '../components/game-request-form';
import {
  normalizeRequestedGame,
  sendGameRequest,
} from '../lib/game-request-client';
import { gameRequestCopy } from '../lib/game-request-copy';
for (const locale of ['ja', 'en', 'zh', 'es'] as const) {
  assert.deepEqual(
    Object.keys(gameRequestCopy[locale]),
    Object.keys(gameRequestCopy.en),
  );
  const html = renderToStaticMarkup(<GameRequestForm locale={locale} />);
  assert.ok(html.includes(gameRequestCopy[locale].title));
  assert.ok(
    !html.includes('<form'),
    'No public form before server availability check',
  );
  assert.ok(html.includes('<output') && html.includes('aria-live="polite"'));
}
for (const value of [
  '',
  'a',
  'x'.repeat(81),
  '原神\n',
  'A\tB',
  '原神\u200b',
  'me@example.com',
  'https://example.com',
  'example.com',
  'ｗｗｗ．example.com',
]) {
  assert.equal(normalizeRequestedGame(value), null, JSON.stringify(value));
}
assert.equal(normalizeRequestedGame('  ＦＦ１４  '), 'FF14');
assert.equal(normalizeRequestedGame('Genshin  Impact'), 'Genshin Impact');
assert.equal(normalizeRequestedGame('原神'), '原神');
const original = globalThis.fetch;
let calls = 0;
try {
  for (const [status, body, expected] of [
    [201, { ok: true, status: 'received', duplicate: false }, 'received'],
    [200, { ok: true, status: 'received', duplicate: true }, 'duplicate'],
    [200, { ok: true }, 'failed'],
    [201, {}, 'failed'],
    [202, { ok: true, status: 'received', duplicate: false }, 'failed'],
    [503, {}, 'unavailable'],
    [429, {}, 'rateLimited'],
    [400, {}, 'invalid'],
    [413, {}, 'invalid'],
    [403, {}, 'failed'],
    [500, {}, 'failed'],
  ] as const) {
    globalThis.fetch = async (url, options) => {
      calls++;
      assert.equal(url, '/api/game-requests');
      assert.equal(options?.method, 'POST');
      assert.deepEqual(JSON.parse(options?.body as string), {
        gameName: '原神',
        locale: 'ja',
        website: '',
      });
      return new Response(JSON.stringify(body), { status });
    };
    assert.equal(
      await sendGameRequest('原神', 'ja', new AbortController().signal),
      expected,
    );
  }
  globalThis.fetch = async () => {
    throw new Error('offline');
  };
  assert.equal(
    await sendGameRequest('原神', 'ja', new AbortController().signal),
    'failed',
  );
  globalThis.fetch = async () => new Response('not JSON', { status: 200 });
  assert.equal(
    await sendGameRequest('原神', 'ja', new AbortController().signal),
    'failed',
  );
} finally {
  globalThis.fetch = original;
}
assert.equal(calls, 11);
console.log(
  'Game request client: four locales, default-off SSR, normalization, 11 response cases, offline and malformed JSON passed.',
);
