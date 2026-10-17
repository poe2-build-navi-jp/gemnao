import { test } from 'node:test';
import assert from 'node:assert/strict';
import { specialistBranches, specialistSymptoms, specialistObservations } from '../../lib/diagnosis/specialists';
import { diagnose } from '../../lib/diagnosis/rules';
import { changeAnswer, answerLabel, type Answers } from '../../lib/diagnosis/model';
import { validateAnswers, buildSnapshot } from '../../lib/diagnosis/validation';
import { RULE_VERSION } from '../../lib/diagnosis/model';
import { buildRepairReport } from '../../lib/diagnosis/report';
import { repairDecision } from '../../lib/diagnosis/decision';
const base: Answers = { safety:'none', storage:'none', scope:'game', change:'none', launcher:'steam', os:'windows11', gpu:'unknown', ram:'unknown' };
void test('every specialist choice selects its own action, survives validation and report, excludes tried actions', () => {
  for (const b of specialistBranches) {
    const a = {...base, symptom:b.symptom, observation:b.observation};
    assert.ok(validateAnswers(a), b.action);
    const r=diagnose(a);
    assert.equal(r.recommendations[0].action.id,b.action);
    assert.equal(r.recommendations.length,1);
    assert.ok(!diagnose(a,{[b.action]:'unchanged'}).recommendations.some(x=>x.action.id===b.action));
    const snap=buildSnapshot({version:RULE_VERSION,answers:a,tried:{},results:{}});
    assert.ok(snap);
    const report=buildRepairReport(a,{[b.action]:'improved'},repairDecision(a), '2026-10-18T00:00:00Z');
    assert.ok(report.includes(answerLabel('observation',b.observation,b.symptom)));
    assert.ok(report.includes(r.recommendations[0].action.title));
  }
});
void test('every field has choices, unknown stays insufficient and safety overrides all',()=>{
 for(const s of specialistSymptoms){
  assert.ok(specialistObservations[s.id].length>=4);
  const a={...base,symptom:s.id,observation:'unknown'};
  const unknown=diagnose(a);
  assert.equal(unknown.scope,'insufficient');
  assert.ok(unknown.recommendations[0].action.warning);
  assert.equal(diagnose({...a,safety:'danger'}).recommendations.length,0);
  assert.equal(diagnose({...a,storage:'critical'}).recommendations.length,0);
  assert.equal(diagnose({...a,scope:'power-off'}).scope,'pc');
 }
});
void test('known safe GPU cap, VRAM distinction, Cloud preservation, Bluetooth version, converter branches',()=>{
 const text=(symptom:string,observation:string,os='windows11')=>JSON.stringify(diagnose({...base,symptom,observation,os}));
 assert.match(text('gpu-usage','capped'),/設定変更は不要/);
 assert.match(text('gpu-usage','heat'),/負荷テストを止め/);
 assert.match(text('vram','integrated'),/専用VRAMに足さず/);
 assert.match(text('steam-cloud','conflict'),/正しい方が不明なら選択を保留/);
 assert.match(text('steam-cloud','missing'),/新規セーブや上書きを止め/);
 assert.match(text('steam-cloud','unknown'),/先にローカル保存データのコピー/);
 for(const os of ['windows11','windows10','unknown'])assert.match(text('audio','bluetooth-mic',os),os==='windows11'?/LE Audio/:os==='windows10'?/Windows 10/:/対応は未確認/);
 assert.notEqual(text('controller','double-converter'),text('controller','double-none'));
 assert.notEqual(text('controller','os'),text('controller','game'));
});
void test('changing symptom and observation removes stale downstream answers',()=>{
 const a=changeAnswer({...base,symptom:'controller',observation:'game',error:'gpu'},'symptom','audio');
 assert.equal(a.observation,undefined);assert.equal(a.error,undefined);assert.equal(a.launcher,undefined);
 const b=changeAnswer({...base,symptom:'audio',observation:'bluetooth-mic'},'observation','game-only');
 assert.equal(b.os,undefined);assert.equal(b.launcher,undefined);
});
