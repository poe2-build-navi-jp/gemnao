import { test } from 'node:test';
import assert from 'node:assert/strict';
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
    assert.ok(stepsFor(a).length <= 10);
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
