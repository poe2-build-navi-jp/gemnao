import assert from 'node:assert/strict';
import { checkFit, gpuById, type MinSpec } from '../lib/my-pc';
const fit = (gpu: string, vramGb: number, ramGb = 32) =>
  checkFit({ gpu, ramGb, windows: 11 }, { gpu: [], ramGb: 16, vramGb } satisfies MinSpec);
for (const [legacy, low, high, below, middle, above] of [
  ['rtx-3050', 'rtx-3050-6gb', 'rtx-3050-8gb', 6, 8, 12],
  ['rtx-3060', 'rtx-3060-8gb', 'rtx-3060-12gb', 8, 12, 16],
  ['rtx-3080', 'rtx-3080-10gb', 'rtx-3080-12gb', 10, 12, 16],
  ['rtx-4060-ti', 'rtx-4060-ti-8gb', 'rtx-4060-ti-16gb', 8, 16, 20],
  ['rtx-5060', 'rtx-5060-8gb', 'rtx-5060-ti-16gb', 8, 16, 20],
  ['rtx-4070-ti', 'rtx-4070-ti-12gb', 'rtx-4070-ti-super-16gb', 12, 16, 20],
  ['rx-7600', 'rx-7600-8gb', 'rx-7600-xt-16gb', 8, 16, 20],
  ['rx-9060-xt', 'rx-9060-xt-8gb', 'rx-9060-xt-16gb', 8, 16, 20],
  ['arc-a750', 'arc-a750-8gb', 'arc-a770-16gb', 8, 16, 20],
  ['arc-b570', 'arc-b570-10gb', 'arc-b580-12gb', 10, 12, 16],
  ['rx-7900-xt', 'rx-7900-gre-16gb', 'rx-7900-xt-20gb', 16, 20, 24],
] as const) {
  assert.ok(gpuById(legacy), 'legacy storage ID stays readable');
  assert.equal(fit(legacy, below).result, 'ok');
  assert.equal(fit(legacy, middle).result, 'maybe');
  assert.match(fit(legacy, middle).reasons.join(''), /型番を選び直して/);
  assert.equal(fit(legacy, above).result, 'no');
  assert.equal(fit(low, middle).result, 'no');
  assert.equal(fit(high, middle).result, 'ok');
  assert.equal(fit(legacy, middle, 8).result, 'no', 'known RAM failure still takes precedence');
}
assert.equal(fit('rtx-5060-ti-8gb', 12).result, 'no');
assert.equal(fit('arc-a770-8gb', 12).result, 'no');
assert.equal(fit('rtx-4090', 24).result, 'ok');
console.log('PASS: legacy GPU ambiguity, exact variants, VRAM boundaries, known RAM failure precedence');
