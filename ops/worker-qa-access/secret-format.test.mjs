import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyQaAccessSecret } from './secret-format.mjs';
test('missing or empty is separate from invalid format', () => {
  for (const v of [undefined, null, '']) assert.equal(classifyQaAccessSecret(v), 'missing_or_empty');
  for (const v of ['A'.repeat(42), 'A'.repeat(129), 'A'.repeat(64)+'\n', 'A'.repeat(64)+'\r', 'A'.repeat(63)+' ', 'あ'.repeat(64)]) assert.equal(classifyQaAccessSecret(v), 'invalid_format');
});
test('same printable ASCII bounds as the existing update controller', () => {
  for (const v of ['A'.repeat(43), 'Ab09'.repeat(16), '~'.repeat(128)]) assert.equal(classifyQaAccessSecret(v), 'valid');
  const original = v => typeof v === 'string' && /^[\x21-\x7e]{43,128}(?![\s\S])/.test(v);
  for (let n=0;n<=130;n++) for (const ch of ['A','0','!','~',' ','\n','\x7f','あ']) {
    const value=ch.repeat(n);assert.equal(classifyQaAccessSecret(value)==='valid',original(value));
  }
});
