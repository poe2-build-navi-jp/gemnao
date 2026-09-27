import type { CommonGuide } from './common-guides';

export const lowFpsGuide: CommonGuide = {
  slug: 'low-fps',
  title: 'PCゲームのFPSが低い時の調べ方｜上限・CPU・GPU負荷を切り分ける',
  shortTitle: 'FPSが低い',
  description:
    'FPSが低い原因を、上限設定、CPU側の処理待ち、GPUの描画負荷で切り分けます。SteamのFPS表示とWindowsのCPU・GPU画面の見方、解像度だけを変えた前後の比較例、結果別の設定手順を解説します。',
  conclusion:
    '画質を全部下げる前に、まず同じゲーム場面でFPS・FPS上限・GPUの3D使用率を記録します。上限値付近で一定なら上限やV-Syncを確認。GPUの描画負荷が高ければレンダリング解像度だけ下げて比べます。GPUに余裕があり、解像度を下げてもFPSがほぼ変わらなければCPU側の処理や、使っているGPU・電源条件を確認してください。CPU全体の使用率が低くても、一部の論理プロセッサで処理が詰まる場合があります。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    'FPS上限・V-Sync・画面のリフレッシュレートなどの表示条件',
    'GPUの描画負荷：解像度・レイトレーシング・影など',
    'CPU側の処理待ち、内蔵GPUでの起動、電源・温度・バックグラウンド負荷',
  ],
  steps: [
    {
      title: '同じ場面でFPS・上限・使用GPUを記録する',
      actions: [
        'ゲーム内またはSteamの「設定」→「ゲーム中」のパフォーマンスモニターでFPSを表示し、同じセーブ・同じルート・同じ表示モードで、重い場面を一定時間プレイしてFPSのおおよその範囲を記録する。初回ロード直後と2回目の移動は分けて控える。',
        'ゲーム内の「映像」「ディスプレイ」などでFPS上限・V-Sync・レンダリング解像度・フレーム生成の状態を控える。Ctrl＋Shift＋Esc→「パフォーマンス」→使用中のGPUでGPU名と3D負荷を確認。CPUは「パフォーマンス」→「CPU」を見る。',
      ],
    },
    {
      title: 'FPSが上限値で頭打ちなら、まず上限設定を確認する',
      actions: [
        'FPSが60や120などの設定値にほぼ張り付く場合は、ゲーム内のFPS上限とV-Sync、モニターのリフレッシュレートを確認する。ゲーム内で目標より低い上限が指定されていれば、必要な範囲で1段階上げ、同じ場面で比較する。',
        'ゲーム内に該当設定がない場合だけNVIDIA・AMD側の上限も確認する。上限を上げてもFPSが変わらなければ処理能力が足りない可能性があるので次へ。上限を外すことを高速化策と決め付けない。',
      ],
    },
    {
      title: '解像度だけを下げてFPSを比べる',
      actions: [
        'ゲーム内の「レンダリング解像度」「解像度スケール」があれば、基準値を控え、例として100%→80%だけを試す。なければゲームの解像度を1段階下げる。FPS上限、V-Sync、フレーム生成、影、テクスチャは一度に変更しない。',
        '同じ場面でFPSが目に見えて上がるならGPU側の描画負荷が候補。上がらない場合は上限・CPU側・使用GPUを再確認。比較後は元の解像度に戻し、必要な画質に合わせて個別設定を選ぶ。',
      ],
    },
    {
      title: '結果に合わせてCPU側・GPU側の対処を選ぶ',
      actions: [
        'GPU負荷が高く、解像度を下げて改善する場合は、設定を元に戻した上で、レイトレーシング、影、アップスケーラーを1項目ずつ比較する。VRAM不足警告やテクスチャ欠けがあれば専用GPUメモリとテクスチャ設定を別途確認する。',
        '解像度を下げても変化が小さくGPUに余裕がある場合はCPUの論理プロセッサごとの負荷を確認。表示距離・人やオブジェクトの密度・シミュレーション関連の設定があるゲームなら、対応する項目を1つずつ試す。録画や更新を止めて比べ、内蔵GPUやノートPCの省電力条件も調べる。',
      ],
    },
  ],
  faqs: [
    {
      question: 'GPU使用率が低いのにFPSが60から上がりません。故障ですか？',
      answer:
        'まずゲーム内の60fps上限、V-Sync、ドライバーのフレーム制限を確認してください。上限で固定されていればGPUに余裕があるのは不自然ではありません。必要なら上限を変更し、同じ場面で比べます。',
    },
    {
      question: 'CPU使用率が35%ならCPUが原因ではありませんか？',
      answer:
        '全体の平均が35%でも、一部の論理プロセッサに負荷が集中する場合があります。「パフォーマンス」→「CPU」のグラフを「論理プロセッサ」表示にし、ゲーム中に確認してください。数値一つで確定せず、解像度を下げた時のFPSの変化とも照合します。',
    },
    {
      question: 'GPU使用率が100%なら必ず画質を下げるべきですか？',
      answer:
        '高い使用率だけで不具合とは判断できません。目標FPSを満たしているなら変更不要です。目標より低い場合に、レンダリング解像度だけを変えてFPSが上がるかを比べ、必要ならレイトレーシングや影を個別に調整します。',
    },
    {
      question: '解像度を下げてもFPSが全く変わりません。次は？',
      answer:
        'FPS上限・V-Syncを先に再確認し、ゲームが独立GPUではなく内蔵GPUを使っていないか、CPUの論理プロセッサ負荷、録画・更新中のアプリ、ノートPCの電源モードを調べてください。解像度の変更がゲームに反映されたかも確認します。',
    },
    {
      question: 'フレーム生成で表示が120fpsになれば、動作は改善していますか？',
      answer:
        '表示上のFPSには生成されたフレームが含まれる場合があります。原因の切り分けではフレーム生成の状態を固定し、可能ならSteamのモニターなどでベースFPSと区別します。表示数字と操作感を同じ条件で比較してください。',
    },
  ],
  related: [
    'low-gpu-usage',
    'vram-shortage',
    'stutter-fix',
    'gpu-driver-update',
    'shader-cache-delete',
  ],
  sources: [
    {
      label: 'Microsoft DirectX：CPU側・GPU側の処理制約と解像度の影響',
      url: 'https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/',
    },
    {
      label: 'Microsoft DirectX：タスクマネージャーのGPU・3Dグラフ',
      url: 'https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/',
    },
    {
      label: 'Microsoft：タスクマネージャーでCPUを確認する',
      url: 'https://support.microsoft.com/en-us/windows/experience/compatibility/find-out-how-many-cores-a-processor-on-a-windows-device-has',
    },
    {
      label: 'Steam：ゲーム中のパフォーマンスモニター',
      url: 'https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767',
    },
    {
      label: 'NVIDIA：最大フレームレートの設定',
      url: 'https://www.nvidia.com/content/Control-Panel-Help/vLatest/en-us/mergedProjects/nv3d/Manage_3D_Settings_(reference).htm',
    },
    {
      label: 'AMD：Frame Rate Target Control',
      url: 'https://www.amd.com/en/products/software/adrenalin/frtc.html',
    },
    {
      label: 'Microsoft DirectX：Windowsのゲーム別GPU設定',
      url: 'https://devblogs.microsoft.com/directx/navigating-the-redesigned-graphics-settings-page/',
    },
  ],
};
