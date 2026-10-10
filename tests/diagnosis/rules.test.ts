import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DiagnosisRepairReport } from '../../components/diagnosis-repair-report';
import { DiagnosisDecision } from '../../components/diagnosis-decision';
import { RepairCostTable } from '../../components/repair-cost-table';
import {
  symptoms,
  questions,
  observationQuestion,
  changeAnswer,
  stepsFor,
  type Answers,
} from '../../lib/diagnosis/model';
import { diagnose, actions, rules } from '../../lib/diagnosis/rules';
import { diagnosisGuideSlugs } from '../../lib/diagnosis/cta';
import { repairDecision } from '../../lib/diagnosis/decision';
import { buildRepairReport } from '../../lib/diagnosis/report';
import { validateAnswers, buildSnapshot } from '../../lib/diagnosis/validation';
import { readLocal, LOCAL_KEY } from '../../lib/diagnosis/local';
import { RULE_VERSION, PREVIOUS_RULE_VERSION } from '../../lib/diagnosis/model';
import { commonGuides } from '../../lib/common-guides';
void test('all six P0 symptoms complete, with at most three specific actions', () => {
  for (const s of symptoms) {
    const a: Answers = {
      symptom: s.id,
      scope: 'game',
      observation: observationQuestion({ symptom: s.id }).options[0].value,
      launcher: 'steam',
      change: 'none',
    };
    const r = diagnose(a);
    assert.ok(r.recommendations.length > 0 && r.recommendations.length <= 3);
    assert.ok(stepsFor(a).length <= 12);
  }
});
void test('all unknown yields information shortage, not a guessed cause', () => {
  for (const s of symptoms) {
    const r = diagnose({
      symptom: s.id,
      scope: 'unknown',
      observation: 'unknown',
      change: 'unknown',
      launcher: 'unknown',
    });
    assert.equal(r.scope, 'insufficient');
    assert.ok(r.missing.length >= 4);
    assert.equal(r.recommendations[0].ruleId, 'insufficient-information');
  }
});
void test('technical questions have unknown and help', () => {
  for (const q of Object.values(questions)) {
    if (q.id !== 'symptom') {
      assert.ok(q.options.some((o) => o.value === 'unknown'));
      assert.ok(q.help.length > 20);
    }
  }
});
void test('changing upstream clears dependent values', () => {
  const a = changeAnswer(
    {
      symptom: 'not-launching',
      scope: 'game',
      observation: 'error',
      error: 'directx',
      change: 'mods',
      launcher: 'steam',
    },
    'observation',
    'nothing',
  );
  assert.equal(a.error, undefined);
  assert.equal(a.change, undefined);
  assert.ok(!stepsFor(a).includes('error'));
  assert.ok(!diagnose(a).recommendations.some((r) => r.ruleId === 'error-dx'));
});
void test('failed or already attempted actions do not repeat', () => {
  const a: Answers = {
    symptom: 'crash',
    scope: 'game',
    observation: 'startup',
    launcher: 'steam',
    change: 'none',
  };
  const r = diagnose(a, { verify: 'unchanged', history: 'tried' });
  assert.ok(
    !r.recommendations.some((r) => ['verify', 'history'].includes(r.action.id)),
  );
});
void test('missing rule never fabricates a diagnosis', () => {
  assert.equal(
    diagnose({ symptom: 'crash', scope: 'game' }, {}, []).scope,
    'insufficient',
  );
});
void test('PC-wide issues stop ordinary game changes for all symptoms', () => {
  for (const s of symptoms)
    for (const scope of ['power-off', 'restart', 'pc-freeze']) {
      const r = diagnose({
        symptom: s.id,
        scope,
        change: 'driver',
        error: 'directx',
      });
      assert.equal(r.scope, 'pc');
      assert.deepEqual(
        r.recommendations.map((x) => x.action.id),
        ['pc'],
      );
    }
});
void test('MODs/VC/DirectX changes produce different priorities', () => {
  const a: Answers = {
    symptom: 'not-launching',
    scope: 'game',
    observation: 'error',
    launcher: 'steam',
  };
  assert.equal(
    diagnose({ ...a, error: 'vc' }).recommendations[0].action.id,
    'vc',
  );
  assert.equal(
    diagnose({ ...a, error: 'directx' }).recommendations[0].action.id,
    'dx',
  );
  assert.equal(
    diagnose({ ...a, change: 'mods' }).recommendations[0].action.id,
    'mods',
  );
});
void test('only Steam receives Steam file verification', () => {
  assert.ok(
    !diagnose({
      symptom: 'crash',
      scope: 'game',
      observation: 'startup',
      launcher: 'other',
    }).recommendations.some((r) => r.action.id === 'verify'),
  );
});
void test('rules carry traceable conditions/exclusions/version/reasons and official sources', () => {
  assert.equal(new Set(rules.map((r) => r.id)).size, rules.length);
  for (const r of rules) {
    assert.ok(
      r.version &&
        r.checkedAt &&
        r.reason &&
        r.excludes &&
        Object.keys(r.conditions).length,
    );
    const a = actions[r.action];
    assert.ok(a && a.warning && a.improved && a.unchanged && a.sources.length);
  }
});
void test('all action article links actually exist and are verified', () => {
  for (const a of Object.values(actions)) {
    assert.ok(
      commonGuides.some(
        (g) => `/guide/${g.slug}` === a.article && g.status === 'verified',
      ),
      a.article,
    );
  }
  for (const scope of ['restart', 'pc-freeze'])
    assert.ok(
      commonGuides.some(
        (g) =>
          `/guide/${g.slug}` ===
          diagnose({ scope }).recommendations[0].action.article,
      ),
    );
});

void test('article CTA targets use the actual verified guide registry', () => {
  for (const slug of diagnosisGuideSlugs)
    assert.ok(
      commonGuides.some((g) => g.slug === slug && g.status === 'verified'),
      slug,
    );
});

const safe: Answers = { safety: 'none', storage: 'none', symptom: 'low-fps', scope: 'game', observation: 'heavy', change: 'none', launcher: 'steam', os: 'unknown', gpu: 'unknown', ram: 'unknown' };
void test('danger wins over storage, performance, quotes and reported improvement', () => {
  const answers: Answers = { ...safe, safety: 'danger', storage: 'critical', requirements: 'below', quote: 'itemized', costCategory: 'gpu' };
  const result = diagnose(answers, { settings: 'improved' });
  assert.equal(result.decision?.urgency, 'stop');
  assert.equal(result.decision?.category, 'repair');
  assert.equal(result.recommendations.length, 0);
  assert.deepEqual(stepsFor(answers), ['safety']);
  assert.match(result.decision!.nextSteps.join(' '), /バックアップのためでも無理に電源を入れない/);
});
void test('critical storage takes precedence over all ordinary troubleshooting', () => {
  for (const safety of ['none', 'unknown']) {
    const answers = { ...safe, safety, storage: 'critical' };
    const result = diagnose(answers);
    assert.equal(result.decision?.urgency, 'backup');
    assert.deepEqual(result.recommendations, []);
    assert.deepEqual(stepsFor(answers), ['safety', 'storage']);
    assert.match(result.decision!.nextSteps[0], /安全に操作できる場合だけ/);
  }
});
void test('unknown safety or storage never unlocks game load tests', () => {
  for (const key of ['safety', 'storage'] as const) {
    const result = diagnose({ ...safe, [key]: 'unknown', requirements: 'below' });
    assert.equal(result.decision?.category, 'insufficient');
    assert.equal(result.scope, 'insufficient');
    assert.deepEqual(result.recommendations, []);
  }
});
void test('four decision categories require distinct evidence and never prescribe replacement', () => {
  assert.equal(repairDecision({ ...safe, observation: 'capped' }).category, 'settings');
  assert.equal(repairDecision({ ...safe, requirements: 'below' }).category, 'performance');
  assert.equal(repairDecision(safe, { load: 'improved' }).category, 'performance');
  assert.equal(repairDecision({ ...safe, scope: 'power-off' }).category, 'repair');
  assert.equal(repairDecision(safe).category, 'insufficient');
  for (const gpu of ['nvidia', 'amd', 'intel', 'unknown'])
    for (const ram of ['8-or-less', '16', '32', '64-or-more', 'unknown']) {
      assert.equal(repairDecision({ ...safe, gpu, ram, requirements: 'meets' }).category, 'insufficient');
    }
  for (const status of ['untried', 'tried', 'unchanged'] as const)
    assert.equal(repairDecision(safe, { load: status }).category, 'insufficient');
});
void test('configuration improvements do not imply all components are healthy', () => {
  const decision = repairDecision(safe, { settings: 'improved' });
  assert.equal(decision.category, 'settings');
  assert.match(decision.nextSteps.join(' '), /正常判定ではありません/);
});
void test('repair comparison preserves warranty, model, use, replaceability and full cost caveats', () => {
  const decision = repairDecision({ ...safe, modelKnown: 'known', warranty: 'covered', goal: 'higher', repairability: 'limited', quote: 'total-only' });
  const text = decision.comparison.join(' ');
  for (const word of ['機種型番', '保証期間内', '用途', '基板一式', '部品代', '作業料', '診断料', '送料', 'データ移行', '税込総額', 'キャンセル']) assert.ok(text.includes(word), word);
});
void test('new enum validation supports short safety branches and rejects arbitrary content', () => {
  assert.deepEqual(validateAnswers({ safety: 'danger' }), { safety: 'danger' });
  assert.deepEqual(validateAnswers({ safety: 'none', storage: 'critical' }), { safety: 'none', storage: 'critical' });
  assert.ok(validateAnswers(safe));
  for (const answers of [{ ...safe, safety: 'fine' }, { ...safe, modelKnown: 'PRIVATE MODEL' }, { ...safe, costCategory: '<script>' }, { ...safe, serial: 'SECRET' }, { safety: 'none' }, { storage: 'critical' }]) assert.equal(validateAnswers(answers), null);
});
void test('new repair context cannot enter the legacy sharing protocol', () => {
  assert.equal(buildSnapshot({ version: RULE_VERSION, answers: safe, tried: {}, results: {} }), null);
  const legacy = { ...safe };
  delete legacy.safety; delete legacy.storage;
  assert.ok(buildSnapshot({ version: RULE_VERSION, answers: legacy, tried: {}, results: {} }));
});
void test('independent safety and purchase answers retain prior observed facts', () => {
  const next = changeAnswer({ ...safe, error: undefined, warranty: 'unknown' }, 'warranty', 'covered');
  assert.equal(next.observation, 'heavy');
  assert.equal(next.change, 'none');
  assert.equal(changeAnswer(next, 'safety', 'danger').storage, 'none');
});
void test('report is deterministic, self-reported and omits undeclared/free-text identifiers', () => {
  const answers = { ...safe, frequency: 'intermittent', occurrence: 'during-game', game: 'PRIVATE GAME', serial: 'PRIVATE SERIAL' } as Answers;
  const records = { settings: 'unchanged' as const };
  const report = buildRepairReport(answers, records, repairDecision(answers, records), '2026-10-10T00:00:00.000Z');
  assert.equal(report, buildRepairReport(answers, records, repairDecision(answers, records), '2026-10-10T00:00:00.000Z'));
  for (const text of ['自己申告', 'ときどき起きる', 'ゲームのプレイ中', '改善しなかった', '未回答・未確認', '自動測定', '追加点検', '2026-10-10T00:00:00.000Z', '症状の発生日時ではありません']) assert.ok(report.includes(text), text);
  assert.ok(!report.includes('PRIVATE'));
});
void test('previous local records migrate without losing answers or status and reopen safety', () => {
  let value: string | null = JSON.stringify({ version: PREVIOUS_RULE_VERSION, answers: { symptom: 'crash', scope: 'pc-freeze' }, game: 'old private game', tried: { history: 'unchanged' }, results: {}, step: 'scope', complete: true, savedAt: Date.now(), shareId: 'a'.repeat(32) });
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => key === LOCAL_KEY ? value : null, removeItem: () => { value = null; } } });
  try {
    const migrated = readLocal();
    assert.equal(migrated?.version, RULE_VERSION);
    assert.equal(migrated?.step, 'safety');
    assert.equal(migrated?.complete, false);
    assert.equal(migrated?.tried.history, 'unchanged');
    assert.equal(migrated?.answers.scope, 'pc-freeze');
    assert.equal(migrated?.game, 'old private game');
    assert.equal(migrated?.shareId, undefined);
    value = JSON.stringify({ ...migrated, version: 'future' });
    assert.equal(readLocal(), null);
    assert.equal(value, null);
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

void test('manufacturer error overrides settings improvement and pass is not a health guarantee', () => {
  const error = diagnose({ ...safe, manufacturerTest: 'error', observation: 'capped' }, { settings: 'improved' });
  assert.equal(error.decision?.category, 'repair');
  assert.deepEqual(error.recommendations, []);
  assert.match(error.decision!.title, /メーカー診断/);
  const pass = repairDecision({ ...safe, manufacturerTest: 'passed' });
  assert.equal(pass.category, 'insufficient');
  assert.match(pass.evidence.join(' '), /間欠的/);
});

void test('report SSR exposes only local preview entry, no export or payload before review', () => {
  const html = renderToStaticMarkup(createElement(DiagnosisRepairReport, { report: 'PRIVATE PREVIEW PAYLOAD' }));
  assert.match(html, /相談用メモの全文を確認する/);
  assert.ok(!html.includes('PRIVATE PREVIEW PAYLOAD'));
  assert.ok(!html.includes('<textarea'));
  assert.ok(!html.includes('確認したメモをコピー'));
  assert.ok(!html.includes('確認したメモをテキスト保存'));
  assert.ok(!html.includes('<form'));
  assert.match(html, /すべて自己申告/);
  assert.match(html, /送付は自動で行いません/);
});
void test('cost SSR only includes explicitly selected category and identifies labor-only examples', () => {
  const html = renderToStaticMarkup(createElement(RepairCostTable, { categories: ['memory'] }));
  assert.match(html, /メモリ取付・交換/);
  assert.match(html, /3,500円/);
  assert.match(html, /工賃のみ/);
  assert.ok(!html.includes('グラフィックボード交換'));
  assert.ok(!html.includes('SSD・HDD取付・交換'));
  assert.match(html, /平均価格やあなたのPCの見積額ではありません/);
  assert.equal(renderToStaticMarkup(createElement(RepairCostTable, { categories: [] })), '');
});
void test('decision SSR shows urgent warnings before any cost examples and unknown shows none', () => {
  for (const answers of [{ ...safe, safety: 'danger', costCategory: 'memory' }, { ...safe, storage: 'critical', costCategory: 'memory' }, safe]) {
    const decision = repairDecision(answers);
    const html = renderToStaticMarkup(createElement(DiagnosisDecision, { answers, decision }));
    assert.ok(!html.includes('メモリ取付・交換'));
    assert.match(html, /費用と違いを見る/);
    if (decision.urgency !== 'normal') assert.match(html, /diag-warning/);
  }
});
void test('new UI has no event or GA emitters even under future runtime flags', () => {
  const wizard = readFileSync('components/diagnosis-wizard.tsx', 'utf8');
  for (const forbidden of ['/api/diagnosis/events', "'/events'", 'metric(', 'gtag(', 'pagehide']) assert.ok(!wizard.includes(forbidden), forbidden);
  const report = readFileSync('components/diagnosis-repair-report.tsx', 'utf8');
  for (const forbidden of ['fetch(', 'diagnosisRequest(', 'metric(', 'gtag(']) assert.ok(!report.includes(forbidden), forbidden);
  assert.match(report, /if \(!confirmed\) return;/);
  assert.match(report, /disabled=\{!confirmed\}/);
  assert.match(wizard, /DiagnosisRepairReport key=\{report\}/);
});

void test('liquid intrusion is visibly part of the existing stop-use safety gate', () => {
  assert.ok(questions.safety.options.some(option => option.value === 'danger' && /液体侵入|水濡れ/.test(option.label)));
  assert.match(questions.safety.help, /液体|水濡れ/);
  const result = diagnose({ safety: 'danger', storage: 'none', symptom: 'low-fps', scope: 'game' });
  assert.equal(result.decision?.urgency, 'stop');
  assert.match(result.decision?.evidence.join(' ') || '', /液体侵入|水濡れ/);
  assert.equal(result.recommendations.length, 0);
});


void test('all localized price rows expose parts scope beside the price', () => {
  for (const locale of ['ja', 'en', 'zh', 'es'] as const) {
    const html = renderToStaticMarkup(
      createElement(RepairCostTable, { locale }),
    );
    assert.equal((html.match(/data-parts-cost=/g) || []).length, 27);
    assert.match(html, /data-parts-cost="extra"/);
    assert.match(html, /data-parts-cost="included"/);
    assert.match(html, /data-parts-cost="confirm"/);
    const selected = renderToStaticMarkup(
      createElement(RepairCostTable, { locale, categories: ['memory'] }),
    );
    assert.equal((selected.match(/data-parts-cost=/g) || []).length, 2);
    assert.match(selected, /<details open="" class="repair-price-details">/);
    assert.match(html, /<details class="repair-price-details">/);
  }
});
