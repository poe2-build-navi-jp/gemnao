import type { CommonGuide } from './common-guides';

export const lowGpuUsageGuide: CommonGuide = {
  slug: 'low-gpu-usage',
  title: 'ゲーム中にGPU使用率が低い時の見方｜正常なFPS上限と性能不足を判別',
  shortTitle: 'GPU使用率が低い',
  description:
    'GPU使用率が低いだけでは異常とは限りません。現在FPSと上限、CPU全体と論理プロセッサ別の負荷、ゲームが使うGPU名と3D負荷を組み合わせ、上限に達した正常な状態と性能が出ていない状態を分けます。',
  conclusion:
    'まずゲーム中のFPSが目標と上限に達しているかを見ます。60fps上限で安定して60fpsならGPUに余裕があっても正常で、使用率を上げる必要はありません。目標FPSに届かない場合は、タスクマネージャーでゲームが使うGPU番号とその3D負荷、CPUの論理プロセッサ別の負荷を確認。CPU側に負荷が偏っていればCPU側の処理、ゲームが内蔵GPUを使っていればGPU選択を比べ、どちらでもない時に電源・設定などへ進みます。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    'FPS上限・V-Syncに達した結果としてGPUに余裕がある正常な状態',
    'CPU側の処理待ちでGPUへ描画の指示が十分届かない状態',
    'ゲームが内蔵GPUで動作し、別の独立GPUだけを測っている状態',
    '省電力・AC未接続、別アプリの負荷や測定時の画面切り替え',
  ],
  steps: [
    {
      title: 'プレイ中のFPSと上限が一致しているか確認する',
      actions: [
        'ゲーム内またはSteamのパフォーマンスモニターでプレイ中のFPSを確認し、ゲーム内の「映像」「ディスプレイ」のFPS上限とV-Syncを控える。ロビーや一時停止画面ではなく、普段遊ぶ同じ場面で測る。',
        '例：目標60fps・上限60fpsでプレイ中もほぼ60fpsなら、GPU使用率が40%前後でもまず正常と判断。上限より低い・視点移動などで落ちる場合だけCPU・GPUの確認へ進む。',
      ],
    },
    {
      title: 'ゲームが使うGPUとCPUの負荷をセットで記録する',
      actions: [
        'Ctrl＋Shift＋Esc→「プロセス」でゲーム名を探し、「GPUエンジン」列の番号を確認。「パフォーマンス」で同じ番号のGPU名と3Dグラフを見て、内蔵GPUか独立GPUかを記録する。別のGPUの0%だけでゲームがGPUを使っていないと判断しない。',
        '「パフォーマンス」→「CPU」のグラフを右クリック→「グラフの変更」→「論理プロセッサ」で負荷を確認。CPU全体が低い数値でも、一部の論理プロセッサに負荷が偏ることがある。ゲーム画面から切り替えると負荷が変わるため、数値は傾向として扱う。',
      ],
    },
    {
      title: '目標未達ならCPU側か使用GPUかを一つずつ比べる',
      actions: [
        'CPU側が疑わしい時は、ゲーム内に表示距離・NPC密度などの設定があれば一項目だけ下げ、同じ場面でFPSとGPU 3D負荷が変わるか比較。動画・録画・更新が動いていれば一つずつ終了する。画質の一括変更は避ける。',
        '複数GPUのPCでゲームが内蔵GPUを使っていると確認できた時だけ、Windows 11の「設定」→「システム」→「ディスプレイ」→「グラフィック」で対象のゲームを選び「高パフォーマンス」を設定。ゲームを再起動し、GPU番号・FPS・負荷を再確認する。',
      ],
    },
    {
      title: '改善しない時は電源と描画設定を条件付きで確認する',
      actions: [
        'ノートPCならAC接続とWindowsの「設定」→「システム」→「電源とバッテリー」→「電源モード」を確認。省電力中なら「バランス」へ変更して同じ場面で比較。戻らない場合はPCメーカーの電源・温度の案内へ。',
        'ゲームが使うGPUの3D負荷が高く、FPSが上限に届かないならGPU描画負荷が候補なので、別記事「FPSが低い」のレンダリング解像度比較へ。GPUの3D負荷が低いだけでドライバー故障や買い替えを決めない。',
      ],
    },
  ],
  faqs: [
    {
      question:
        '上限60fpsで60fpsを維持し、GPU使用率は40%です。改善が必要ですか？',
      answer:
        '目標が60fpsで画面の引っかかりもなければ、使用率を上げる必要はありません。描画に余裕がある時は上限に達したままGPU負荷が低くなります。もっと高いFPSが必要な場合だけ上限とモニターのHzを確認し、同じ場面で比較してください。',
    },
    {
      question: 'CPU全体が30%なのにGPUも低くFPSが上がりません。',
      answer:
        'CPU全体の平均値だけではCPU側の制約を除外できません。「パフォーマンス」→「CPU」で論理プロセッサ別のグラフを確認し、上限、使用GPU番号と合わせて判断します。CPU側の設定を一つ変えてもFPSが伸びなければ別の原因も調べます。',
    },
    {
      question:
        '独立GPUが0%です。ゲームはグラフィックボードを使っていませんか？',
      answer:
        '別のGPUや別の処理のグラフを見ている可能性があります。ゲームを開いたまま「プロセス」の「GPUエンジン」列で番号を確認し、「パフォーマンス」でそのGPUの名前・3Dグラフを見ます。画面切り替えで負荷が下がる場合もあります。',
    },
    {
      question: '「高パフォーマンス」に変えればどのPCでもFPSが上がりますか？',
      answer:
        'いいえ。独立GPUと内蔵GPUなど複数のGPUがあり、実際に低性能側でゲームが動いている場合に比べる設定です。GPUが1台のPCでは変化しないことがあります。保存後はゲームを再起動し、実際のGPU名とFPSを再確認してください。',
    },
    {
      question: 'FPSは高いのに時々一瞬止まります。GPU使用率が低いせいですか？',
      answer:
        '高い平均FPSと一瞬の停止は別に確認します。初回のシェーダー準備や移動時の読み込みなども候補です。FPSと止まる瞬間を記録し、関連記事「ゲームがカクつく・一瞬止まる時の対処法」を確認してください。',
    },
  ],
  related: ['low-fps', 'stutter-fix', 'gpu-driver-update', 'vram-shortage'],
  sources: [
    {
      label: 'Microsoft DirectX：CPU側・GPU側で処理が詰まる仕組み',
      url: 'https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/',
    },
    {
      label: 'Microsoft DirectX：タスクマネージャーのGPU番号と負荷の読み方',
      url: 'https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/',
    },
    {
      label: 'Microsoft：Windows 11のゲーム別GPU選択',
      url: 'https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/optimizations-for-windowed-games-in-windows-11',
    },
    {
      label: 'Microsoft：タスクマネージャーのCPUと論理プロセッサ',
      url: 'https://support.microsoft.com/ja-jp/windows/experience/compatibility/find-out-how-many-cores-a-processor-on-a-windows-device-has',
    },
    {
      label: 'Microsoft：Windowsの電源モードの影響',
      url: 'https://support.microsoft.com/ja-jp/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows',
    },
    {
      label: 'Steam：ゲーム中のパフォーマンスモニター',
      url: 'https://help.steampowered.com/ja/faqs/view/3462-CD4C-36BD-5767',
    },
  ],
};
