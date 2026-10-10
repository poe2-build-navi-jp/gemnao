import { answerLabel, decisionFields, questions, statuses, type Answers, type ActionStatus, type RepairDecision } from './model';
import { actions } from './rules';

/** Deliberately receives no game name, free text, logs, path, serial or machine data. */
export function buildRepairReport(
  answers: Answers,
  records: Record<string, ActionStatus>,
  decision: RepairDecision,
  createdAt: string,
): string {
  const fields = ['safety', 'storage', 'symptom', 'scope', 'observation', 'error', 'change', 'launcher', 'os', 'gpu', 'ram', ...decisionFields];
  const visible = fields.filter((key) => key !== 'error' || answers.observation === 'error');
  const unknown = visible.filter((key) => !answers[key as keyof Answers] || answers[key as keyof Answers] === 'unknown');
  const label = (key: string) => key === 'observation' ? '発生状況' : questions[key]?.title || key;
  return [
    'PC修理相談用メモ（ゲムなお Web診断）',
    `メモ作成日時（UTC・症状の発生日時ではありません）：${createdAt}`,
    'このメモは本人の選択回答・実施結果の整理です。PC内部の自動測定や、故障箇所の確定ではありません。',
    'Windows診断ツールの取得データは取り込んでいません。温度・SMART・電源容量・部品の正常性は未検査です。修理店・メーカーで追加点検が必要になる場合があります。',
    '',
    `相談の優先度：${decision.title}`,
    ...decision.evidence.map((line) => `根拠（自己申告）：${line}`),
    '',
    '先に行うこと',
    ...decision.nextSteps.map((line, i) => `${i + 1}. ${line}`),
    '',
    '回答内容（すべて自己申告）',
    ...visible.map((key) => `${label(key)}：${answers[key as keyof Answers] ? answerLabel(key, answers[key as keyof Answers]!, answers.symptom) : '未回答・未確認'}`),
    '',
    '試した対処・実施結果（自己申告）',
    ...(Object.entries(records).filter(([id]) => Object.hasOwn(actions, id)).map(([id, value]) => `${actions[id].title}：${statuses[value] || '未確認'}`)),
    ...(Object.keys(records).length ? [] : ['実施記録なし（未実施・未確認。改善しなかったという意味ではありません）']),
    '',
    '不明・未確認',
    ...(unknown.length ? unknown.map((key) => label(key)) : ['選択欄の未回答はありませんが、機器の正常性は未検査です。']),
    '症状の発生日時、正確な機種型番、故障部品、正式な修理見積もりはこのWeb診断では取得していません。必要な情報は相談先で追加してください。',
    '',
    '費用比較の確認事項',
    ...decision.comparison.map((line) => `・${line}`),
    '選んだ部品・作業は相談候補です。表示する公式料金例は参考で、本人のPCの見積もりではありません。平均価格や必要な交換の確定ではありません。',
    '費用ガイド：https://gemnao.pages.dev/pc/repair-or-replace',
    '',
    '分からない・警告未表示・一時的な改善は、部品が正常という判定ではありません。',
  ].join('\n');
}
