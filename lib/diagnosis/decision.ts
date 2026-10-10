import { answerLabel, isPcIssue, type ActionStatus, type Answers, type RepairDecision } from './model';

/** A decision aid from explicit answers, never a health check or a purchase recommendation. */
export function repairDecision(
  answers: Answers,
  records: Record<string, ActionStatus> = {},
): RepairDecision {
  const comparison = [
    answers.modelKnown === 'known'
      ? '確認した機種型番で、対応部品・修理受付・保証条件をメーカーへ照合します。'
      : 'まず購入履歴や保証書でメーカーと正確な機種型番を確認します。製造番号を公開する必要はありません。',
    answers.warranty === 'covered'
      ? '保証期間内と回答しています。対象修理・自己分解の扱い・送料を窓口に確認してから、有料修理や部品購入を検討します。'
      : '保証・延長保証の対象と費用を確認します。期間外でも修理可否・修理後の保証を確認してください。',
    answers.goal === 'higher'
      ? '希望するゲーム・解像度・画質・FPSを整理し、修理で元に戻す費用と、性能を上げる費用を分けます。'
      : '今後の用途と必要な性能を整理します。今の性能で足りるなら、修理・設定改善で使い続ける選択肢があります。',
    answers.repairability === 'confirmed'
      ? '交換可能と回答した部品でも、容量・規格・電源・寸法・冷却・保証条件を機種ごとに照合します。'
      : answers.repairability === 'limited'
        ? '交換に制約があると回答しています。基板一式の費用やメーカー対応を確認し、部品単体で直せる前提にしません。'
        : '交換・増設できる部品を機種別仕様かメーカー窓口で確認します。ノートPCのGPUや基板直付けメモリなどは交換できない場合があります。',
    answers.quote === 'itemized'
      ? '確認済みの見積もりで、部品代・作業料・診断料・送料・データ移行・税込総額、キャンセル料金と修理後の保証を照合します。'
      : '部品代だけで比べず、作業料・診断料・送料・データ移行・税込総額、キャンセル料金と修理後の保証を含む見積もりを取ります。',
    '買い替えは候補の1つです。本体価格だけでなく周辺機器・移行・処分・必要ソフトを含む総額と、今のPCを直した後に用途を満たせるかを比べます。年数やGPUメーカー名だけでは決めません。',
  ];
  const finish = (decision: Omit<RepairDecision, 'comparison'>): RepairDecision => ({ ...decision, comparison });
  if (answers.safety === 'danger') return finish({
    category: 'repair', urgency: 'stop', title: '使用を中止し、メーカー・専門窓口へ相談',
    evidence: ['異臭・煙・膨らみ・危険な熱・液体侵入や水濡れ直後のいずれかがあると回答しています。'],
    nextSteps: [
      'PCの使用と充電を中止し、安全を確保してください。危険な本体やバッテリーに触れず、メーカー・専門窓口へ相談します。煙や火など差し迫る危険があれば近づかず、地域の緊急窓口へ連絡してください。',
      '再起動・負荷テスト・分解・電源装置の開封は行いません。バックアップのためでも無理に電源を入れないでください。',
      '保存データが必要なことは相談先へ伝え、データの保全は安全が確認されてから相談します。修理費や買い替え比較より安全を優先します。',
    ],
  });
  if (answers.storage === 'critical') return finish({
    category: 'repair', urgency: 'backup', title: '重要データの保全を優先し、ストレージの相談へ',
    evidence: ['SSD・HDDの信頼性低下・故障予測などの重大な警告があると回答しています。'],
    nextSteps: [
      '危険な兆候がなく安全に操作できる場合だけ、重要なデータを別のドライブや既存のバックアップ先へ先に保存します。警告があるドライブ内の別フォルダーは退避先にしません。',
      '安全が分からない、異音がする、認識しない、読み取りに失敗する場合は、繰り返し試さず電源操作を増やさずにメーカーやデータ復旧窓口へ相談します。',
      'ゲーム・ベンチマーク・負荷テスト、初期化、修復や再インストールは後回しにし、保証とストレージ交換・データ移行の見積もりを確認します。',
    ],
  });
  if (answers.manufacturerTest === 'error') return finish({
    category: 'repair', urgency: 'normal', title: 'メーカー診断のエラーを添えて修理相談',
    evidence: ['すでに実施したメーカー診断でエラー・修理相談の案内が出たと回答しています。', 'これは本人申告で、エラーの内容や故障部品をこのWeb診断が確認したものではありません。'],
    nextSteps: ['新たな負荷テストや検査の繰り返しをせず、メーカー窓口へ既存の診断結果を伝えてください。コードや画面は相談先で確認してもらいます。', '一時的に設定で改善しても、診断エラーを無視せず相談します。危険な兆候がなく安全に操作できる場合だけ重要データのバックアップを確認します。', '保証と点検結果を確認し、必要な修理・部品交換の内容と総額を見積もってもらいます。'],
  });
  if (isPcIssue(answers)) return finish({
    category: 'repair', urgency: 'normal', title: 'PC全体の異常は、ハードウェアも含めて修理相談',
    evidence: [`影響範囲：「${answerLabel('scope', answers.scope!)}」と回答しています。`, 'ドライバーなどのソフトウェア要因もあり、この回答だけで故障部品は特定できません。'],
    nextSteps: ['無理な再現や負荷テストを止め、発生時刻・画面の表示・直前の変更を分かる範囲で控えてメーカーへ相談します。', '安全に操作できる状態なら重要データのバックアップを確認します。分解や電源・BIOS設定の変更で試さないでください。', '点検で故障箇所が分かってから、部品交換で元の用途に戻せるかと、総額の見積もりを確認します。'],
  });
  if (answers.safety !== 'none' || answers.storage !== 'none') return finish({
    category: 'insufficient', urgency: 'normal', title: '情報不足：安全・保存データの確認が先です',
    evidence: ['危険な兆候またはストレージ警告について、未回答・分からない項目があります。「不明」は「正常」ではありません。'],
    nextSteps: ['すでに見た警告や気付いた兆候を、電源投入や再現テストをせずに確認します。判断できなければメーカー窓口へ相談できます。', '安全が確認できるまで負荷のかかる対処を進めず、部品購入や買い替えの判断を保留します。'],
  });
  const improved = ['settings', 'fpscap', 'display'].filter((id) => records[id] === 'improved');
  if (improved.length || (answers.symptom === 'low-fps' && answers.observation === 'capped') || answers.change === 'settings') return finish({
    category: 'settings', urgency: 'normal', title: '設定の確認・改善を先に試す余地があります',
    evidence: [improved.length ? '画面・画質・FPS上限の対処で改善したと記録しています（自己申告）。' : answers.observation === 'capped' ? '30 / 60など一定のFPSで止まると回答しています。上限設定が手がかりです。' : '画質・画面設定の変更後に症状が出たと回答しています。'],
    nextSteps: ['改善したなら、追加の変更を重ねず使い続けられるかを確認します。未確認なら、元に戻せる設定を1項目ずつ確認します。', '設定の手がかりはPC全体の正常判定ではありません。改善しない場合は情報を追加し、修理や買い替えが必要と即断しません。'],
  });
  if (answers.requirements === 'below' || (['low-fps', 'stutter'].includes(answers.symptom || '') && records.load === 'improved')) return finish({
    category: 'performance', urgency: 'normal', title: '用途に対して性能が足りない可能性があります',
    evidence: [answers.requirements === 'below' ? '使いたいゲームの公式動作環境を満たさない項目を確認したと回答しています。' : '画質・解像度を下げる比較で改善したと記録しています（自己申告）。描画負荷が関わる手がかりです。'],
    nextSteps: ['希望する画質・解像度・FPSと、正確なCPU・GPU・RAM・VRAMを公式動作環境に照合します。低FPSや使用率だけで故障とは判定しません。', '設定を下げて用途を満たせるなら、そのまま使う選択肢があります。性能を上げたい場合だけ、交換可能な部品と互換性を確認して見積もりを比べます。', '部品の追加・交換で足りるかは機種によります。修理で性能が上がるとは限らず、買い替えが必要ともこの情報だけでは決められません。'],
  });
  return finish({
    category: 'insufficient', urgency: 'normal', title: '情報不足：修理・部品交換・買い替えはまだ決められません',
    evidence: ['現在の回答では、故障・性能不足・設定の問題を区別する根拠が足りません。', ...(answers.manufacturerTest === 'passed' ? ['メーカー診断が正常・合格でも、間欠的な不具合や未検査の部品が正常とは言い切れません。'] : []), ...(answers.requirements === 'meets' ? ['公式動作環境を満たす回答だけでは、実際の快適さや部品の正常性は確認できません。'] : [])],
    nextSteps: ['下の確認順で、エラーの分類・発生場面・変更前後を整理します。すでに試した対処を繰り返す必要はありません。', '分からない項目を残したまま相談できます。型番・保証・希望する用途と、点検結果や見積もりがそろうまで部品購入は保留します。'],
  });
}
