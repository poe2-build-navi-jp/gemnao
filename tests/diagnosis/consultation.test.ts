import test from 'node:test';
import assert from 'node:assert/strict';
import { consultationSummary } from '../../lib/diagnosis/consultation';
import { diagnose } from '../../lib/diagnosis/rules';
import type { Answers } from '../../lib/diagnosis/model';
const answers: Answers = { safety: 'none', storage: 'none', symptom: 'crash', scope: 'game', observation: 'random', change: 'none', launcher: 'steam' };
void test('summary separates attempts, remaining checks and uses only public static links', () => {
 const result = diagnose(answers, {});
 const id = result.recommendations[0]?.action.id;
 assert.ok(id);
 const summary = consultationSummary(answers, {}, { [id]: 'unchanged' });
 assert.match(summary, /試した対処と結果/);
 assert.match(summary, /改善しなかった/);
 assert.match(summary, /残っている確認/);
 assert.match(summary, /https:\/\/gemnao.pages.dev\//);
 assert.equal(summary, consultationSummary(answers, {}, { [id]: 'unchanged' }));
});
void test('unknown free text and action keys never enter the copy', () => {
 const summary = consultationSummary({ ...answers, symptom: '<script>private</script>', scope: 'C:\\Users\\private' }, {}, { private: 'tried' });
 assert.doesNotMatch(summary, /private|<script>|C:\\/);
});
void test('danger and improvement do not promote further game changes', () => {
 const danger = consultationSummary({ ...answers, safety: 'danger' }, {}, {});
 assert.match(danger, /使用|中止/);
 assert.match(danger, /community-reference/);
 const id = diagnose(answers, {}).recommendations[0].action.id;
 assert.match(consultationSummary(answers, {}, { [id]: 'improved' }), /追加変更を止める/);
});
