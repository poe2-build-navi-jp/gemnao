/** Versioned, deterministic triage. Never an estimated cause probability. */
export const RULE_VERSION = '2026-10-10.1';
export const PREVIOUS_RULE_VERSION = '2026-10-02.1';
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
    | 'ram'
    | 'safety'
    | 'storage'
    | 'pcType'
    | 'modelKnown'
    | 'warranty'
    | 'goal'
    | 'requirements'
    | 'repairability'
    | 'quote'
    | 'costCategory'
    | 'frequency'
    | 'occurrence'
    | 'manufacturerTest',
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
export const decisionFields = [
  'pcType', 'modelKnown', 'warranty', 'goal', 'requirements', 'repairability', 'quote', 'costCategory', 'manufacturerTest', 'frequency', 'occurrence',
] as const;
export const questions: Record<string, Question> = {
  manufacturerTest: {
    id: 'manufacturerTest', title: 'すでに実施したメーカー診断の結果（任意）',
    help: 'メーカーの診断を以前に実施した結果がある場合だけ選びます。この質問のために検査を実行する必要はありません。正常・合格でも間欠的な故障を否定できません。',
    options: options([['error', 'エラー・修理相談の案内が出た'], ['passed', '正常・合格と表示された'], ['not-run', '実施していない']]),
  },
  frequency: {
    id: 'frequency', title: '症状が出る頻度（自己申告）',
    help: 'これまでに起きた範囲で選んでください。確認のための再現テストは不要です。一度だけでも、異臭や膨らみ、液体侵入や水濡れ直後などの危険な兆候があれば安全を優先します。',
    options: options([['once', '今のところ1回'], ['intermittent', 'ときどき起きる'], ['every-use', '使うたび・ほぼ毎回起きる']]),
  },
  occurrence: {
    id: 'occurrence', title: '症状が出るタイミング（自己申告）',
    help: 'すでに確認できている発生条件を選んでください。ゲーム以外の軽い作業でも起きるなら相談先に伝える手がかりです。原因や故障の確定ではありません。',
    options: options([['game-start', 'ゲームを起動するとき'], ['during-game', 'ゲームのプレイ中'], ['outside-game', 'ゲーム以外の作業中・何もしていないとき'], ['other', 'それ以外・複数のタイミング']]),
  },
  costCategory: {
    id: 'costCategory', title: '費用を確認したい作業（任意・故障確定ではありません）',
    help: 'メーカーから案内された部品や、自分が相談したい作業だけを選びます。症状から故障部品を自動で推定するものではありません。不明ならそのまま進めます。',
    options: options([
      ['memory', 'メモリ'], ['storage', 'SSD・HDD'], ['gpu', 'GPU'], ['cpu', 'CPU'],
      ['cooling', '冷却・ファン'], ['power', '電源ユニット'], ['mainboard', 'マザーボード'],
      ['battery', 'バッテリー'], ['screen', '画面'], ['keyboard', 'キーボード'],
      ['adapter', 'ACアダプター'], ['network', 'ネットワーク'], ['speaker', 'スピーカー'],
      ['optical', '光学ドライブ'], ['os', 'OS・ソフトウェア'], ['backup', 'バックアップ・移行'],
      ['recovery', 'データ復旧'], ['other', 'その他・点検相談'],
    ]),
  },
  safety: {
    id: 'safety',
    title: '先に、危険な兆候はありませんか？',
    help: '異臭・煙・バッテリーや本体の膨らみ・触れられないほどの異常な熱・液体が入った／水濡れ直後など、すでに気付いていることだけで回答してください。確認のために電源を入れたり、触ったり、分解したりしないでください。',
    options: options([
      ['danger', '異臭・煙・膨らみ・危険な熱・液体侵入や水濡れ直後がある'],
      ['none', 'そのような兆候には気付いていない'],
    ]),
  },
  storage: {
    id: 'storage',
    title: 'SSD・HDDの重大な警告は出ていますか？',
    help: 'Windowsやメーカーの診断で「信頼性が低下」「読み取り専用」「故障予測」など、ドライブの重大な警告がすでに出ている場合に選びます。空き容量不足だけの通知とは分けます。再検査や負荷テストは不要です。',
    options: options([
      ['critical', '信頼性低下・故障予測などの重大な警告がある'],
      ['none', '重大な警告は見ていない'],
    ]),
  },
  pcType: {
    id: 'pcType', title: 'PCの種類',
    help: 'ノートPCでは交換できない部品もあります。種類だけで交換可否を決めず、メーカーの機種別仕様やサポートで確認します。',
    options: options([['desktop', 'デスクトップPC'], ['laptop', 'ノートPC・一体型PC']]),
  },
  modelKnown: {
    id: 'modelKnown', title: 'メーカー・正確な機種型番',
    help: '保証書や購入履歴にある型番を手元で確認します。ここには型番・製造番号・個人情報を入力する必要はありません。分解して調べないでください。',
    options: options([['known', '手元で確認できている'], ['not-checked', 'まだ確認していない']]),
  },
  warranty: {
    id: 'warranty', title: '保証・延長保証',
    help: '購入履歴や保証書で期間・対象を確認します。期間内でも修理内容が対象かは窓口の確認が必要です。自己分解前にメーカーへ相談してください。',
    options: options([['covered', '保証期間内（対象かは窓口に確認）'], ['expired', '保証期間外']]),
  },
  goal: {
    id: 'goal', title: 'これからの用途・希望',
    help: '今までの用途へ戻したいのか、新しいゲームや高画質など今より高い性能が必要なのかを分けます。正常に使えているPCの買い替えを前提にしません。',
    options: options([['restore', '今までの用途で使える状態に戻したい'], ['higher', '新しいゲーム・高画質など性能を上げたい']]),
  },
  requirements: {
    id: 'requirements', title: '使いたいゲームの公式動作環境との比較',
    help: 'CPU・GPUの正確な型番、RAM・VRAMを公式の必要要件と比べた結果です。OSへの対応は別に確認します。GPUメーカー名やRAM容量だけでは判断しません。要件内でも快適さや故障の有無は保証できません。',
    options: options([['below', 'CPU・GPU・RAM・VRAMで必要要件を満たさない項目がある'], ['meets', 'CPU・GPU・RAM・VRAMの必要要件を満たすと確認した']]),
  },
  repairability: {
    id: 'repairability', title: '必要な部品の交換・増設可否',
    help: '機種別仕様やメーカー窓口で確認した内容だけ選びます。メモリ・SSDでも基板直付けや規格制約があり、GPUは電源・ケース・冷却も確認が必要です。',
    options: options([['confirmed', '対象部品が交換・増設可能と確認できた'], ['limited', '基板直付けなど、交換・増設に制約がある']]),
  },
  quote: {
    id: 'quote', title: '修理・交換の見積もり',
    help: '故障箇所・部品代・作業料・診断料・送料・データ移行・税込総額と、キャンセル時の料金を確認します。見積もりがない状態で費用の有利不利を判定しません。',
    options: options([['itemized', '内訳と総額を確認済み'], ['total-only', '総額だけで内訳は未確認'], ['none', 'まだ見積もりを取っていない']]),
  },
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
  if (a.safety === 'danger') return ['safety'];
  if (a.storage === 'critical') return ['safety', 'storage'];
  if (isPcIssue(a)) return ['safety', 'storage', 'symptom', 'scope', 'decision'];
  return [
    'safety',
    'storage',
    'symptom',
    'scope',
    'observation',
    ...(a.observation === 'error' ? ['error'] : []),
    'change',
    'launcher',
    'environment',
    'game',
    'tried',
    'decision',
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
  // Safety and purchase context are independent facts, not symptom dependencies.
  if (dependencyOrder.includes(id) && !['os', 'gpu', 'ram'].includes(id)) {
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
export type RepairDecision = {
  category: 'settings' | 'performance' | 'repair' | 'insufficient';
  urgency: 'stop' | 'backup' | 'normal';
  title: string;
  evidence: string[];
  nextSteps: string[];
  comparison: string[];
};
export type DiagnosisResult = {
  version: string;
  checkedAt: string;
  scope: 'game' | 'pc' | 'insufficient';
  summary: string;
  missing: string[];
  recommendations: Recommendation[];
  /** Optional only for archived snapshots created before repair triage. */
  decision?: RepairDecision;
};
