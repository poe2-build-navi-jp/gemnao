import { questions, statuses, type Answers, type ActionStatus } from './model';
import { actions, diagnose } from './rules';
import { nextDiagnosisArticle } from './next-article';

/** Accept only known choice labels and action IDs. Never include arbitrary input. */
export function consultationSummary(
  answers: Answers,
  tried: Record<string, ActionStatus>,
  results: Record<string, ActionStatus>,
) {
  const result = diagnose(answers, tried);
  const records = { ...tried, ...results };
  const label = (key: string) =>
    questions[key]?.options.find(
      (option) => option.value === answers[key as keyof Answers],
    )?.label || '未回答・未確認';
  const attempted = Object.entries(records).filter(
    ([id, status]) =>
      Object.hasOwn(actions, id) &&
      Object.hasOwn(statuses, status) &&
      status !== 'untried',
  );
  const next = nextDiagnosisArticle(result, records);
  const remaining = result.recommendations.filter(
    ({ action }) => !records[action.id] || records[action.id] === 'untried',
  );
  return [
    'PCゲームの相談用まとめ（ゲムなお）',
    '本人の回答・記録です。原因や故障を確定するものではありません。',
    `症状：${label('symptom')} / 影響範囲：${label('scope')}`,
    '試した対処と結果：',
    ...(attempted.length
      ? attempted.map(
          ([id, status]) => `・${actions[id].title}：${statuses[status]}`,
        )
      : ['・実施記録なし（未実施と断定できません）']),
    '残っている確認：',
    ...(result.scope === 'game' && result.decision?.urgency === 'normal'
      ? next
        ? remaining.map(({ action }) => `・${action.title}（実施記録なし）`)
        : [
            '・改善した場合は追加変更を止める。改善がなければ、結果と発生条件を相談先へ伝える。',
          ]
      : result.decision?.nextSteps || [result.summary]),
    ...(result.missing.length
      ? [`未確認の情報：${result.missing.join('、')}`]
      : []),
    `参考：https://gemnao.pages.dev${next?.action.article || '/tools/windows-diagnosis#community-reference'}`,
    'ゲーム名・バージョン・発生条件は、個人情報を除いて共有先で必要に応じて補足してください。',
  ].join('\n');
}
