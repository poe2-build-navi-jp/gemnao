import type { CommonGuide } from './common-guides';

export const vramGuide: CommonGuide = {
  slug: 'vram-shortage',
  title: 'PCゲームのVRAM不足を確認する方法｜専用・共有GPUメモリの見方と比較例',
  shortTitle: 'VRAM不足',
  description:
    'VRAM不足の警告や画面のカクつきが出たら、タスクマネージャーで使っているGPUと専用・共有GPUメモリを確認。数値と症状を照合し、テクスチャを下げる前後で同じ場面を比べる手順を説明します。',
  conclusion:
    'まずゲームが使っているGPUを確認し、症状が出た場面で「専用GPUメモリ」の使用量／容量と「共有GPUメモリ」の使用量を記録します。独立GPUで専用メモリが上限付近でも、その数値だけでVRAM不足とは断定できません。テクスチャ品質を1段階だけ下げて同じ場面を再訪し、使用量と引っかかりの両方が変わるか比べてください。内蔵GPUの場合は専用メモリの表示をVRAM容量として扱わず、共有メモリとシステムRAMの状態も確認します。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    '高解像度テクスチャや追加テクスチャパックによるGPUメモリの負荷',
    '独立GPUと内蔵GPUの取り違え、または複数アプリの同時使用',
    '初回のシェーダー構築、読み込み、CPU・ストレージなどVRAM以外の要因',
  ],
  steps: [
    {
      title: 'ゲームが使うGPUと専用・共有GPUメモリを確認する',
      actions: [
        'ゲームを開いたままCtrl＋Shift＋Escでタスクマネージャーを開く。「プロセス」の「GPUエンジン」列が見えればゲームのGPU番号を確認し、「パフォーマンス」→同じ番号のGPUを選ぶ。複数GPUがある時はGPU名も控える。',
        '症状が出た直後に「専用GPUメモリ」と「共有GPUメモリ」をそれぞれ「使用量／表示された容量」の形で記録。内蔵GPUなら専用メモリが小さくても、それだけで故障や不足とは判断しない。',
      ],
    },
    {
      title: '症状と数値を照合して、変える設定を一つ選ぶ',
      actions: [
        'VRAM不足の警告、移動時の引っかかり、長時間後の悪化などを分けて記録する。ゲーム内の「VRAM使用量」表示は見積もりの場合があるため、タスクマネージャーの実際の使用量と同じ数値として扱わない。',
        '独立GPUで専用メモリが上限付近になり症状も出るなら、ゲーム内「設定」→「グラフィック」のテクスチャ品質を1段階下げる。追加の高解像度テクスチャDLCやMODを使う場合は導入方法に沿って個別に無効化する。',
      ],
    },
    {
      title: '同じ場面を再訪し、使用量と症状を一緒に比べる',
      actions: [
        '元の設定値、解像度、同じセーブ・移動ルートを控える。変更を反映するためゲームの指示に従って再起動し、同じ場面で専用・共有メモリと引っかかった回数や警告の有無を比較する。',
        '使用量が下がっても症状が続くならVRAM以外の要因を調べる。改善した場合も再訪して再現するか確認し、効果がなければ変更を戻す。数値例と次の確認先は下の表を参照。',
      ],
    },
  ],
  faqs: [
    {
      question: '専用GPUメモリが8GB中7.8GBならVRAM不足ですか？',
      answer:
        '使用量が上限付近というだけでは確定しません。症状が出る場面と時刻を合わせ、テクスチャだけを下げた前後で使用量と症状の両方を比べます。タスクマネージャーの「パフォーマンス」でゲームが使用中のGPUを選んでいるかも確認してください。',
    },
    {
      question: '共有GPUメモリが8GBと表示されます。VRAMが8GB増えたのですか？',
      answer:
        'いいえ。「8GB」が使用可能な上限の表示なら、そこまで常に使用中という意味でもありません。共有GPUメモリはCPUも利用するシステムRAMで、グラフィックボード上の専用VRAMが増えたわけではありません。',
    },
    {
      question:
        '内蔵GPUの専用メモリが128MBしかありません。ゲームは動かせませんか？',
      answer:
        'その数字だけでは判断できません。内蔵GPUはシステムRAMを共有して動作する場合があり、専用の表示だけを独立GPUのVRAM容量と同じように比較できません。ゲームの公式動作環境、共有GPUメモリとWindowsのメモリ使用量も確認してください。',
    },
    {
      question: 'テクスチャを下げて使用量が減ったのに、カクつきは直りません。',
      answer:
        'VRAM以外の負荷も候補です。初回や更新直後だけならシェーダー構築、移動中だけならストレージ読み込み、常にFPSが低いなら描画負荷やCPUを切り分けます。同じ場面を2回目にも確認し、変えた設定は必要に応じて元に戻します。',
    },
    {
      question: 'ゲーム内のVRAM表示とタスクマネージャーの数字が違います。',
      answer:
        'ゲーム内表示が設定から算出した見積もりの場合、タスクマネージャーの実使用量と一致しません。タスクマネージャーにはゲーム以外の処理も含まれます。同じ画面の同じ指標で変更前後を比べてください。',
    },
  ],
  related: [
    'stutter-fix',
    'low-fps',
    'low-gpu-usage',
    'shader-cache-delete',
    'pc-game-crash',
  ],
  sources: [
    {
      label: 'Microsoft DirectX：タスクマネージャーのGPUと専用・共有メモリ',
      url: 'https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/',
    },
    {
      label: 'Microsoft Learn：グラフィックスメモリの構成例',
      url: 'https://learn.microsoft.com/en-us/windows-hardware/drivers/display/examples-of-graphics-memory-reporting',
    },
    {
      label: 'Microsoft Learn：GPUプロセス別メモリ表示の注意',
      url: 'https://learn.microsoft.com/ja-jp/troubleshoot/windows-client/performance/gpu-process-memory-counters-report-wrong-value',
    },
    {
      label: 'NVIDIA：ゲームのテクスチャ品質とVRAMの例',
      url: 'https://www.nvidia.com/en-us/geforce/news/the-witcher-3-wild-hunt-graphics-performance-and-tweaking-guide/',
    },
  ],
};
