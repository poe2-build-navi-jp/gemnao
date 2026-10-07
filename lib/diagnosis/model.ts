/** Versioned, deterministic triage. Never an estimated cause probability. */
export const RULE_VERSION = '2026-10-02.1';
export const CHECKED_AT = '2026-10-02';
export const symptoms = [
  {
    id: 'not-launching',
    label: 'ゲームが起動しない',
    detail: '無反応・一瞬で終了・ランチャーで止まる',
  },
  {
    id: 'crash',
    label: 'ゲームがクラッシュする',
    detail: 'ゲームが突然閉じる・エラーが出る',
  },
  {
    id: 'black-screen',
    label: '黒い画面になる',
    detail: 'ゲーム画面が映らない・音だけ聞こえる',
  },
  { id: 'freeze', label: 'フリーズする', detail: '画面が止まって操作できない' },
  { id: 'low-fps', label: 'FPSが低い', detail: '全体的に動きが重い' },
  { id: 'stutter', label: 'カクつく', detail: '一瞬引っかかる・動きが不安定' },
] as const;
export type Symptom = (typeof symptoms)[number]['id'];
export const statuses = {
  untried: '未実施',
  tried: '試した（結果は未確認）',
  improved: '改善した',
  unchanged: '改善しなかった',
} as const;
export type ActionStatus = keyof typeof statuses;
export type Answers = Partial<
  Record<
    | 'symptom'
    | 'scope'
    | 'observation'
    | 'error'
    | 'change'
    | 'launcher'
    | 'os'
    | 'gpu'
    | 'ram',
    string
  >
>;
export type Option = { value: string; label: string };
export type Question = {
  id: keyof Answers;
  title: string;
  help: string;
  options: Option[];
};
const options = (rows: string[][]): Option[] => [
  ...rows.map(([value, label]) => ({ value, label })),
  { value: 'unknown', label: '分からない' },
];
export const questions: Record<string, Question> = {
  symptom: {
    id: 'symptom',
    title: '何が起きていますか？',
    help: '不具合が起きているPCゲームの症状を1つ選びます。複数ある場合は、一番困っている症状から始めてください。',
    options: symptoms.map((s) => ({ value: s.id, label: s.label })),
  },
  scope: {
    id: 'scope',
    title: '止まるのはゲームだけですか？',
    help: '問題が起きたときWindowsのスタート画面や他のアプリが使えるかを思い出してください。PC全体の異常は、この診断の通常の対処と分けます。無理に再現させる必要はありません。',
    options: options([
      ['game', 'ゲームだけ（Windowsは操作できる）'],
      ['pc-freeze', 'PC全体が固まる'],
      ['restart', 'PCが再起動する・BSODが出る'],
      ['power-off', 'PCの電源が落ちる'],
    ]),
  },
  error: {
    id: 'error',
    title: '表示されたエラーはどの分類ですか？',
    help: '表示中の単語だけ確認します。文章やログの貼り付けは不要です。DirectX / DXGI、Visual C++ / VCRUNTIME / MSVCPなどの表記が手がかりです。',
    options: options([
      ['directx', 'DirectX / DXGI'],
      ['vc', 'Visual C++ / VCRUNTIME / MSVCP'],
      ['gpu', 'GPU / graphics driver'],
      ['memory', 'メモリ・VRAM不足'],
      ['dll', '上記以外のDLL'],
      ['other', 'その他のエラー'],
    ]),
  },
  change: {
    id: 'change',
    title: '発生する前に変更したものは？',
    help: '最も近い変更を選んでください。時期が一致しても原因が確定するわけではありません。複数なら、まず直前の変更を選びます。',
    options: options([
      ['driver', 'GPUドライバー更新'],
      ['windows', 'Windows Update'],
      ['mods', 'MODの追加・更新'],
      ['game-update', 'ゲームアップデート'],
      ['settings', '画質・画面設定'],
      ['none', '思い当たる変更はない'],
    ]),
  },
  launcher: {
    id: 'launcher',
    title: 'どこからゲームを起動していますか？',
    help: '普段「プレイ」を押すアプリを確認します。Steam以外ではSteam専用の整合性確認を案内しません。',
    options: options([
      ['steam', 'Steam'],
      ['other', 'Steam以外'],
    ]),
  },
  os: {
    id: 'os',
    title: 'Windows',
    help: '問題のあるPCで「設定 → システム → バージョン情報」を開きます。',
    options: options([
      ['windows11', 'Windows 11'],
      ['windows10', 'Windows 10'],
      ['other', 'その他'],
    ]),
  },
  gpu: {
    id: 'gpu',
    title: 'GPU（グラフィックス）',
    help: '問題のあるPCで Ctrl + Shift + Esc → タスク マネージャー → パフォーマンス → GPU。複数ある場合はゲームが使用しているもの。不明なら分からないで進めます。',
    options: options([
      ['nvidia', 'NVIDIA GeForce'],
      ['amd', 'AMD Radeon'],
      ['intel', 'Intel'],
      ['other', 'その他'],
    ]),
  },
  ram: {
    id: 'ram',
    title: 'メモリ',
    help: 'タスク マネージャー → パフォーマンス → メモリで容量を確認します。VRAMとは別です。',
    options: options([
      ['8-or-less', '8GB以下'],
      ['16', '16GB'],
      ['32', '32GB'],
      ['64-or-more', '64GB以上'],
      ['other', 'その他'],
    ]),
  },
};
const observations: Record<Symptom, string[][]> = {
  'not-launching': [
    ['nothing', 'プレイを押しても無反応'],
    ['exits', '起動中になってすぐ戻る'],
    ['launcher', 'ランチャーだけ開く'],
    ['error', 'エラーが表示される'],
  ],
  crash: [
    ['startup', '起動直後に閉じる'],
    ['scene', '決まった場面で閉じる'],
    ['random', 'しばらく遊ぶと閉じる'],
    ['error', 'エラーが表示される'],
  ],
  'black-screen': [
    ['audio', 'ゲームの音は聞こえる'],
    ['fullscreen', '全画面へ切り替えたとき'],
    ['startup', '起動時から黒い'],
    ['error', 'エラーも表示される'],
  ],
  freeze: [
    ['loading', 'ロード・シェーダー処理中'],
    ['scene', '同じ場面で止まる'],
    ['random', '時間が経つと止まる'],
    ['error', 'エラーも表示される'],
  ],
  'low-fps': [
    ['capped', '30 / 60など一定のFPSで止まる'],
    ['always', 'どの場面でも低い'],
    ['heavy', '混雑した場面・高画質で低い'],
    ['error', 'メモリ等のエラーも出る'],
  ],
  stutter: [
    ['first-run', '更新後・初回の場面で引っかかる'],
    ['periodic', '一定間隔で引っかかる'],
    ['heavy', '混雑した場面・高画質で引っかかる'],
    ['error', 'エラーも表示される'],
  ],
};
export const isSymptom = (s: unknown): s is Symptom =>
  symptoms.some((v) => v.id === s);
export function observationQuestion(a: Answers): Question {
  return {
    id: 'observation',
    title: 'どんな状況ですか？',
    help: '一番近いものを選びます。FPSが未計測でも、分からないを選んで最後まで進めます。',
    options: options(isSymptom(a.symptom) ? observations[a.symptom] : []),
  };
}
export const isPcIssue = (a: Answers) =>
  ['pc-freeze', 'restart', 'power-off'].includes(a.scope || '');
export function stepsFor(a: Answers): string[] {
  if (isPcIssue(a)) return ['symptom', 'scope'];
  return [
    'symptom',
    'scope',
    'observation',
    ...(a.observation === 'error' ? ['error'] : []),
    'change',
    'launcher',
    'environment',
    'game',
    'tried',
  ];
}
export function questionFor(id: string, a: Answers) {
  return id === 'observation' ? observationQuestion(a) : questions[id];
}
/** Clear dependent answers when a prior selection changes; no stale hidden facts. */
export function changeAnswer(
  a: Answers,
  id: keyof Answers,
  value: string,
): Answers {
  const next: Answers = { ...a, [id]: value };
  if (a[id] === value) return next;
  const dependencyOrder = [
    'symptom',
    'scope',
    'observation',
    'error',
    'change',
    'launcher',
    'os',
    'gpu',
    'ram',
  ];
  if (!['os', 'gpu', 'ram'].includes(id)) {
    for (const key of dependencyOrder.slice(dependencyOrder.indexOf(id) + 1))
      delete next[key as keyof Answers];
  }
  if (next.observation !== 'error') delete next.error;
  return next;
}
export function answerLabel(key: string, value: string, symptom?: string) {
  if (key === 'symptom')
    return symptoms.find((s) => s.id === value)?.label || '不明';
  if (key === 'observation')
    return (
      (isSymptom(symptom) ? observations[symptom] : []).find(
        (o) => o[0] === value,
      )?.[1] || '分からない'
    );
  return (
    questions[key]?.options.find((o) => o.value === value)?.label ||
    '分からない'
  );
}
export type Action = {
  id: string;
  title: string;
  time: string;
  risk: string;
  reversible: string;
  warning: string;
  steps: string[];
  improved: string;
  unchanged: string;
  article: string;
  sources: { label: string; url: string }[];
};
export type Rule = {
  id: string;
  version: string;
  checkedAt: string;
  conditions: Partial<Record<keyof Answers, string[]>>;
  excludes: Partial<Record<keyof Answers, string[]>>;
  priority: number;
  reason: string;
  action: string;
};
export type Recommendation = { ruleId: string; reason: string; action: Action };
export type DiagnosisResult = {
  version: string;
  checkedAt: string;
  scope: 'game' | 'pc' | 'insufficient';
  summary: string;
  missing: string[];
  recommendations: Recommendation[];
};
