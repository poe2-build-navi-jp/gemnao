import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = async (entry, plugins = []) => {
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'esm', plugins });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
};
globalThis.__contactAudit = { saved: [], fail: false };
const { POST } = await bundle('app/api/contact/route.ts', [{
  name: 'isolated-contact',
  setup(b) {
    b.onResolve({ filter: /^next\/server$/ }, () => ({ path: 'response', namespace: 'test' }));
    b.onResolve({ filter: /contact-db$/ }, () => ({ path: 'db', namespace: 'test' }));
    b.onLoad({ filter: /.*/, namespace: 'test' }, ({ path }) => ({ contents: path === 'response'
      ? 'export const NextResponse={json:(a,b)=>Response.json(a,b)}'
      : 'export async function saveContactSubmission(input){if(globalThis.__contactAudit.fail)throw Error("private DB error");globalThis.__contactAudit.saved.push(input)}' }));
  },
}]);
const valid = { category: 'correction', message: '記事の確認手順について訂正したい箇所があるためご連絡しました。', pageUrl: '', replyEmail: '', website: '' };
const request = (body) => new Request('https://gemnao.pages.dev/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const invalid = [null, [], 'text', 1, {}, { category: 1 }, { ...valid, message: {} }, { ...valid, pageUrl: [] }, { ...valid, replyEmail: false }, { ...valid, website: 1 }, { ...valid, extra: 'unexpected' }, { ...valid, category: 'admin' }, { ...valid, message: 'short' }, { ...valid, message: 'a'.repeat(4001) }, { ...valid, pageUrl: 'https://gemnao.pages.dev.evil.example/' }, { ...valid, pageUrl: 'https://example.com/' }, { ...valid, replyEmail: 'not-an-email' }];
for (const body of invalid) assert.equal((await POST(request(body))).status, 400);
assert.equal((await POST(new Request('https://gemnao.pages.dev/api/contact', { method: 'POST', body: '{bad' }))).status, 400);
assert.equal(globalThis.__contactAudit.saved.length, 0);
assert.equal((await POST(request({ ...valid, message: 'a'.repeat(20_001) }))).status, 413);
const oversizedHeader = new Request('https://gemnao.pages.dev/api/contact', { method: 'POST', headers: { 'Content-Length': '20001' }, body: '{}' });
assert.equal((await POST(oversizedHeader)).status, 413);
assert.equal((await POST(request({ ...valid, website: 'bot' }))).status, 201);
assert.equal(globalThis.__contactAudit.saved.length, 0);
for (const category of ['correction', 'rights', 'privacy', 'other', 'business', 'server_submission', 'server_report']) {
  assert.equal((await POST(request({ ...valid, category }))).status, 201);
  assert.equal(globalThis.__contactAudit.saved.at(-1).category, category);
}
globalThis.__contactAudit.fail = true;
const failed = await POST(request(valid));
assert.equal(failed.status, 503);
assert.equal(failed.headers.get('Cache-Control'), 'no-store');
assert.ok(!(await failed.text()).includes('private DB error'));

// Exercise the actual async submit handler. React event.currentTarget becomes
// null after the synchronous callback returns; no browser/real submission here.
globalThis.__contactFormStates = [];
const { ContactForm } = await bundle('components/contact-form.tsx', [{
  name: 'isolated-form-state',
  setup(b) {
    b.onResolve({ filter: /^react(?:\/jsx-runtime)?$/ }, ({path}) => ({ path: path === 'react' ? 'hooks' : 'jsx', namespace: 'test' }));
    b.onLoad({ filter: /.*/, namespace: 'test' }, ({path}) => ({ contents: path === 'hooks' ? 'export const useState=()=>["idle",state=>globalThis.__contactFormStates.push(state)]' : 'export const jsx=(type,props)=>({type,props}); export const jsxs=jsx;' }));
  },
}]);
const originalFetch = globalThis.fetch;
const originalFormData = globalThis.FormData;
let resets = 0;
let sent;
const form = { reset: () => resets++ };
globalThis.FormData = class { constructor(element) { assert.equal(element, form); } entries() { return Object.entries(valid); } };
try {
  globalThis.fetch = async (_url, input) => { sent = JSON.parse(input.body); await Promise.resolve(); return { ok: true }; };
  const event = { preventDefault() {}, currentTarget: form };
  const pending = ContactForm({ initialCategory: 'business' }).props.onSubmit(event);
  event.currentTarget = null;
  await pending;
  assert.equal(resets, 1);
  assert.deepEqual(sent, valid);
  assert.deepEqual(globalThis.__contactFormStates, ['sending', 'sent']);
  globalThis.fetch = async () => { throw Error('offline'); };
  const failingEvent = { preventDefault() {}, currentTarget: form };
  const retry = ContactForm({}).props.onSubmit(failingEvent);
  failingEvent.currentTarget = null;
  await retry;
  assert.equal(resets, 1, 'Failure must preserve form inputs');
  assert.equal(globalThis.__contactFormStates.at(-1), 'error');
} finally {
  globalThis.fetch = originalFetch;
  globalThis.FormData = originalFormData;
  delete globalThis.__contactAudit;
  delete globalThis.__contactFormStates;
}
console.log('PASS: contact malformed inputs, all categories including business, honeypot, save failure, async success and offline input retention; no production D1 writes');
