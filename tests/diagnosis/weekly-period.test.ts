import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weeklyPeriod, weeklyPeriodLabel, weeklyLabels } from '../../lib/weekly-period';
for (const locale of ['ja', 'en', 'zh', 'es'] as const) {
  void test(`${locale}: JST Monday boundaries, future and cached HTML`, () => {
    const label = (time: string) => weeklyPeriodLabel('2026-10-05', locale, Date.parse(time));
    assert.equal(label('2026-10-04T14:59:59.999Z'), weeklyLabels[locale].dated);
    assert.equal(label('2026-10-04T15:00:00Z'), weeklyLabels[locale].current);
    assert.equal(label('2026-10-11T14:59:59.999Z'), weeklyLabels[locale].current);
    assert.equal(label('2026-10-11T15:00:00Z'), weeklyLabels[locale].past);
    assert.equal(label('2026-10-21T00:00:00Z'), weeklyLabels[locale].past);
    assert.equal(weeklyPeriodLabel('2026-10-05', locale, null), weeklyLabels[locale].dated);
  });
}
void test('Strict calendar dates, Monday requirement, leap day and year rollover', () => {
  for (const slug of ['2026-02-30', '2026-10-06', '2026-10-05T00:00:00Z', '10/5', 'invalid']) assert.equal(weeklyPeriod(slug), null);
  assert.equal(weeklyPeriod('2024-02-26')?.end, Date.parse('2024-03-03T15:00:00Z'));
  assert.equal(weeklyPeriod('2025-12-29')?.end, Date.parse('2026-01-04T15:00:00Z'));
  assert.equal(weeklyPeriodLabel('invalid','ja',Date.now()), weeklyLabels.ja.dated);
});
