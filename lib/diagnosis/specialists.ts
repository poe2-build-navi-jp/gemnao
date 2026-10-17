import type { Action } from './model';
/** Manual observations only; no device probing, networking or private data. */
export const specialistSymptoms = [
  {
    id: 'gpu-usage',
    label: 'GPU使用率が気になる',
    detail: '低使用率・高使用率・FPS上限・温度を分ける',
  },
  {
    id: 'vram',
    label: 'VRAMが足りないか確認したい',
    detail: '専用VRAM・共有GPUメモリ・RAMを区別',
  },
  {
    id: 'audio',
    label: 'ゲームの音がおかしい',
    detail: '出力先・アプリ別音量・ゲーム内設定',
  },
  {
    id: 'steam-cloud',
    label: 'Steam Cloudの同期がおかしい',
    detail: 'バックアップ優先・競合と通信を区別',
  },
  {
    id: 'controller',
    label: 'コントローラーが動かない・二重入力',
    detail: 'Windows認識→Steam入力→ゲームの順に確認',
  },
] as const;
export const specialistHelp: Record<string, string> = {
  'gpu-usage':
    '使用率だけでは異常と判断しません。ゲームが使うGPUの3D負荷、FPSと上限を手元で確認します。温度警告や不安定な状態をわざと再現しないでください。',
  vram: 'VRAMとWindowsのメモリ（RAM）は別です。タスクマネージャーで実際にゲームが使うGPUを確認します。このWebページは容量・使用量を取得しません。',
  audio:
    '小さな音量で、同じ出力機器を使う他アプリやWindowsの音が聞こえるか確認します。急に音量を上げないでください。マイクの録音や音声の取得は行いません。',
  'steam-cloud':
    '同期エラーのままプレイすると古い保存内容で上書きするおそれがあります。ゲームを終了し、先にローカル保存データのコピーを確保します。競合の選択を急がないでください。',
  controller:
    '実機1台で、Windows・Steam・ゲームのどこまで反応するかを分けます。ドライバー削除、デバイスの隠蔽、セキュリティの変更は行いません。',
};
export const specialistObservations: Record<string, string[][]> = {
  'gpu-usage': [
    ['capped', 'GPU使用率は低いが、目標FPS・上限に達している'],
    ['low', 'GPU使用率もFPSも低い'],
    ['high', 'GPU使用率が高い・FPSが足りない'],
    ['heat', '温度警告・熱による性能低下が気になる'],
  ],
  vram: [
    ['warning', '専用VRAM不足の警告・上限付近と症状がある'],
    ['ram', 'Windowsのメモリ（RAM）が不足している'],
    ['integrated', '内蔵GPU・共有GPUメモリの数字を見ている'],
    ['estimate', 'ゲーム内のVRAM予測表示だけが高い'],
  ],
  audio: [
    ['game-only', '他アプリは聞こえるが、このゲームだけ無音'],
    ['all', '同じ機器で他アプリの音も聞こえない'],
    ['partial', '効果音はあるが声など一部だけ聞こえない'],
    ['hdmi', 'HDMI・USBなど接続先を変えた後から'],
    ['bluetooth-mic', 'Bluetoothでマイク・通話を使うと変わる'],
    ['bluetooth-playback', 'Bluetoothの再生だけでも変わる・マイク使用は不明'],
  ],
  'steam-cloud': [
    ['conflict', 'クラウドとローカルの競合が出ている'],
    ['sync', '同期できない・通信エラーになっている'],
    ['missing', '別端末で進行が古い・セーブが見つからない'],
    ['unsupported', 'このゲームがCloud対応か分からない'],
  ],
  controller: [
    ['os', 'Windowsでも認識・入力を確認できない'],
    ['steam', 'Windowsでは反応するがSteamでは反応しない'],
    ['game', 'Steamでは反応するがゲームでは反応しない'],
    ['double-converter', '二重入力：DS4Windowsなどの変換アプリを使っている'],
    ['double-none', '二重入力：変換アプリは使っていない'],
    ['double-unknown', '二重入力：変換アプリの有無は分からない'],
  ],
};
export const specialistFallbacks: Record<string, Action> = {
  'gpu-usage': {
    id: 'specialist-gpu-usage-unknown',
    title: 'GPU使用率が気になる：分かる範囲を記録する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '使用率だけでは異常と判断しません。ゲームが使うGPUの3D負荷、FPSと上限を手元で確認します。温度警告や不安定な状態をわざと再現しないでください。',
    steps: [
      '使用率だけでは異常と判断しません。ゲームが使うGPUの3D負荷、FPSと上限を手元で確認します。温度警告や不安定な状態をわざと再現しないでください。',
      '不明な項目は正常とみなさず、無理に症状を再現せずに、すでに見た表示や発生状況を記録します。確認できない場合は下記ガイドまたは公式窓口を利用してください。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/low-gpu-usage',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/',
      },
    ],
  },
  vram: {
    id: 'specialist-vram-unknown',
    title: 'VRAMが足りないか確認したい：分かる範囲を記録する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      'VRAMとWindowsのメモリ（RAM）は別です。タスクマネージャーで実際にゲームが使うGPUを確認します。このWebページは容量・使用量を取得しません。',
    steps: [
      'VRAMとWindowsのメモリ（RAM）は別です。タスクマネージャーで実際にゲームが使うGPUを確認します。このWebページは容量・使用量を取得しません。',
      '不明な項目は正常とみなさず、無理に症状を再現せずに、すでに見た表示や発生状況を記録します。確認できない場合は下記ガイドまたは公式窓口を利用してください。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/vram-shortage',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/',
      },
    ],
  },
  audio: {
    id: 'specialist-audio-unknown',
    title: 'ゲームの音がおかしい：分かる範囲を記録する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '小さな音量で、同じ出力機器を使う他アプリやWindowsの音が聞こえるか確認します。急に音量を上げないでください。マイクの録音や音声の取得は行いません。',
    steps: [
      '小さな音量で、同じ出力機器を使う他アプリやWindowsの音が聞こえるか確認します。急に音量を上げないでください。マイクの録音や音声の取得は行いません。',
      '不明な項目は正常とみなさず、無理に症状を再現せずに、すでに見た表示や発生状況を記録します。確認できない場合は下記ガイドまたは公式窓口を利用してください。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/no-game-audio',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows',
      },
    ],
  },
  'steam-cloud': {
    id: 'specialist-steam-cloud-unknown',
    title: 'Steam Cloudの同期がおかしい：分かる範囲を記録する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '同期エラーのままプレイすると古い保存内容で上書きするおそれがあります。ゲームを終了し、先にローカル保存データのコピーを確保します。競合の選択を急がないでください。',
    steps: [
      '同期エラーのままプレイすると古い保存内容で上書きするおそれがあります。ゲームを終了し、先にローカル保存データのコピーを確保します。競合の選択を急がないでください。',
      '不明な項目は正常とみなさず、無理に症状を再現せずに、すでに見た表示や発生状況を記録します。確認できない場合は下記ガイドまたは公式窓口を利用してください。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/steam-cloud-sync-error',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://help.steampowered.com/ja/faqs/view/68D2-35AB-09A9-7678',
      },
    ],
  },
  controller: {
    id: 'specialist-controller-unknown',
    title: 'コントローラーが動かない・二重入力：分かる範囲を記録する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '実機1台で、Windows・Steam・ゲームのどこまで反応するかを分けます。ドライバー削除、デバイスの隠蔽、セキュリティの変更は行いません。',
    steps: [
      '実機1台で、Windows・Steam・ゲームのどこまで反応するかを分けます。ドライバー削除、デバイスの隠蔽、セキュリティの変更は行いません。',
      '不明な項目は正常とみなさず、無理に症状を再現せずに、すでに見た表示や発生状況を記録します。確認できない場合は下記ガイドまたは公式窓口を利用してください。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/steam-input-controller',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_players',
      },
    ],
  },
};
export const specialistActions: Record<string, Action> = {
  'specialist-gpu-usage-capped': {
    id: 'specialist-gpu-usage-capped',
    title: 'FPS上限に達しているか確認する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '使用率だけでは異常と判断しません。ゲームが使うGPUの3D負荷、FPSと上限を手元で確認します。温度警告や不安定な状態をわざと再現しないでください。',
    steps: [
      'ゲーム内のFPS上限・V-Syncと、普段遊ぶ場面でのFPSを照合します。',
      '目標FPSで安定しているなら、使用率を上げるための設定変更は不要です。PC全体が正常という判定ではありません。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/low-gpu-usage',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/',
      },
    ],
  },
  'specialist-gpu-usage-low': {
    id: 'specialist-gpu-usage-low',
    title: '使用GPUとCPU側の処理を確認する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '使用率だけでは異常と判断しません。ゲームが使うGPUの3D負荷、FPSと上限を手元で確認します。温度警告や不安定な状態をわざと再現しないでください。',
    steps: [
      'タスクマネージャーでゲームのGPUエンジン番号と同じGPUの3D負荷を確認します。別GPUの0%を見ていないか確認します。',
      'CPU全体の平均だけでなく論理プロセッサ別の偏りとFPS上限を確認します。CPU側の処理待ちも候補で、GPU故障や買い替えとは断定しません。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/low-gpu-usage',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/',
      },
    ],
  },
  'specialist-gpu-usage-high': {
    id: 'specialist-gpu-usage-high',
    title: '描画負荷を1項目だけ比べる',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '使用率だけでは異常と判断しません。ゲームが使うGPUの3D負荷、FPSと上限を手元で確認します。温度警告や不安定な状態をわざと再現しないでください。',
    steps: [
      '高使用率だけでは故障ではありません。目標FPSと症状を確認します。',
      '安全に操作できる場合だけ元の値を控え、解像度を1段階下げて同じ場面を比較します。効果がなければ戻し、温度警告があれば比較を止めます。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/low-gpu-usage',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/',
      },
    ],
  },
  'specialist-gpu-usage-heat': {
    id: 'specialist-gpu-usage-heat',
    title: '負荷を止めて温度警告を相談する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '使用率だけでは異常と判断しません。ゲームが使うGPUの3D負荷、FPSと上限を手元で確認します。温度警告や不安定な状態をわざと再現しないでください。',
    steps: [
      'ゲームや負荷テストを止めます。警告やすでに見た温度をメーカーの機種別案内と照合し、単一の温度基準で正常とは判断しません。',
      '異臭・危険な熱・電源断があれば使用を中止してメーカーへ相談します。分解、電圧・電力制限の変更、冷却性能を試す再現テストは行いません。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/low-gpu-usage',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/',
      },
    ],
  },
  'specialist-vram-warning': {
    id: 'specialist-vram-warning',
    title: 'テクスチャ負荷と症状を比較する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      'VRAMとWindowsのメモリ（RAM）は別です。タスクマネージャーで実際にゲームが使うGPUを確認します。このWebページは容量・使用量を取得しません。',
    steps: [
      '独立GPUの専用GPUメモリの使用量／容量と症状を記録します。上限付近という数値だけでは不足確定ではありません。',
      '元の設定を控え、テクスチャ品質だけ1段階下げます。使用量と同じ場面の症状を比較し、変わらなければ戻して別の原因を確認します。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/vram-shortage',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/',
      },
    ],
  },
  'specialist-vram-ram': {
    id: 'specialist-vram-ram',
    title: 'RAMとVRAMを分けて記録する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      'VRAMとWindowsのメモリ（RAM）は別です。タスクマネージャーで実際にゲームが使うGPUを確認します。このWebページは容量・使用量を取得しません。',
    steps: [
      'タスクマネージャーの「メモリ」はシステムRAMです。「GPU」の専用・共有メモリとは別に記録します。',
      '不要なアプリは作業を保存してから終了し、状態を確認します。ページファイルの無効化やVRAM増加をうたう設定変更は行いません。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/vram-shortage',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/',
      },
    ],
  },
  'specialist-vram-integrated': {
    id: 'specialist-vram-integrated',
    title: '共有メモリを専用VRAMに足さず確認する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      'VRAMとWindowsのメモリ（RAM）は別です。タスクマネージャーで実際にゲームが使うGPUを確認します。このWebページは容量・使用量を取得しません。',
    steps: [
      '共有GPUメモリはRAMを利用します。表示された上限が常に使用中という意味ではありません。',
      '内蔵GPUの小さな専用表示だけで不足と決めず、GPU型番・RAMとゲームの公式動作環境を照合します。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/vram-shortage',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/',
      },
    ],
  },
  'specialist-vram-estimate': {
    id: 'specialist-vram-estimate',
    title: '予測表示と実際の症状を分ける',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      'VRAMとWindowsのメモリ（RAM）は別です。タスクマネージャーで実際にゲームが使うGPUを確認します。このWebページは容量・使用量を取得しません。',
    steps: [
      'ゲーム内の予測量とタスクマネージャーの使用量は同じ測定値とは限りません。',
      '実際に問題があるかを先に確認し、問題がなければ数字だけを理由に設定変更や部品購入をしません。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/vram-shortage',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/',
      },
    ],
  },
  'specialist-audio-game-only': {
    id: 'specialist-audio-game-only',
    title: 'アプリ別とゲーム内の出力・音量を確認する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '小さな音量で、同じ出力機器を使う他アプリやWindowsの音が聞こえるか確認します。急に音量を上げないでください。マイクの録音や音声の取得は行いません。',
    steps: [
      'Windowsの音量ミキサーでゲームのミュート・音量・出力先を確認します。',
      'ゲーム内の主音量と音声設定を確認します。変更は1項目ずつ、元の値を控えて小さな音量で比較します。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/no-game-audio',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows',
      },
    ],
  },
  'specialist-audio-all': {
    id: 'specialist-audio-all',
    title: 'Windowsの出力先と機器を確認する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '小さな音量で、同じ出力機器を使う他アプリやWindowsの音が聞こえるか確認します。急に音量を上げないでください。マイクの録音や音声の取得は行いません。',
    steps: [
      'Windowsで選択中の出力機器と、その機器の接続・ミュートを確認します。HDMI接続後に出力先が変わっていないか確認します。',
      '小さな音量でWindowsのテスト音を確認します。機器の異常や故障が疑われる場合は使用を止め、ゲームの再インストールを繰り返さずメーカーへ相談します。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/no-game-audio',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows',
      },
    ],
  },
  'specialist-audio-partial': {
    id: 'specialist-audio-partial',
    title: 'ゲーム内の音声項目を確認する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '小さな音量で、同じ出力機器を使う他アプリやWindowsの音が聞こえるか確認します。急に音量を上げないでください。マイクの録音や音声の取得は行いません。',
    steps: [
      'ゲーム内のボイス・BGM・効果音の音量と出力設定を個別に確認します。',
      '同じ場面・同じ機器で確認し、このゲームだけならゲーム公式の既知不具合も確認します。音量を最大にして試さないでください。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/no-game-audio',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows',
      },
    ],
  },
  'specialist-steam-cloud-conflict': {
    id: 'specialist-steam-cloud-conflict',
    title: '上書きを保留し、両方の内容を照合する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '同期エラーのままプレイすると古い保存内容で上書きするおそれがあります。ゲームを終了し、先にローカル保存データのコピーを確保します。競合の選択を急がないでください。',
    steps: [
      'ゲームを終了し、既存のセーブ場所ガイドでローカルデータを別の場所へコピーします。移動や削除はしません。',
      '競合の日時・プレイ履歴・使用端末を照合します。新しい日時だけでは正しい進行とは限りません。正しい方が不明なら選択を保留してSteamまたはゲーム公式へ相談します。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/steam-cloud-sync-error',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://help.steampowered.com/ja/faqs/view/68D2-35AB-09A9-7678',
      },
    ],
  },
  'specialist-steam-cloud-sync': {
    id: 'specialist-steam-cloud-sync',
    title: 'バックアップ後に通信と同期状態を確認する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '同期エラーのままプレイすると古い保存内容で上書きするおそれがあります。ゲームを終了し、先にローカル保存データのコピーを確保します。競合の選択を急がないでください。',
    steps: [
      'ゲームを終了してローカルのコピーを確保し、Steamのオンライン状態と通常の通信を確認します。',
      '同期完了を確認できるまで他端末で起動しません。ファイアウォール無効化・セーブ削除・Cloudの切り替えを対処の前提にしません。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/steam-cloud-sync-error',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://help.steampowered.com/ja/faqs/view/68D2-35AB-09A9-7678',
      },
    ],
  },
  'specialist-steam-cloud-missing': {
    id: 'specialist-steam-cloud-missing',
    title: '端末ごとの保存内容を保全する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '同期エラーのままプレイすると古い保存内容で上書きするおそれがあります。ゲームを終了し、先にローカル保存データのコピーを確保します。競合の選択を急がないでください。',
    steps: [
      '新規セーブや上書きを止め、各端末のローカル保存を別々にコピーします。',
      '対象ゲームのCloud対応と利用アカウント、元の端末の同期完了を確認します。Cloudは全ゲーム・全ファイルのバックアップではありません。不明な競合は選択せず相談します。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/steam-cloud-sync-error',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://help.steampowered.com/ja/faqs/view/68D2-35AB-09A9-7678',
      },
    ],
  },
  'specialist-steam-cloud-unsupported': {
    id: 'specialist-steam-cloud-unsupported',
    title: '対応範囲とローカル保存先を確認する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '同期エラーのままプレイすると古い保存内容で上書きするおそれがあります。ゲームを終了し、先にローカル保存データのコピーを確保します。競合の選択を急がないでください。',
    steps: [
      'Steamのゲーム情報とゲーム公式の説明でCloud対応を確認します。',
      '非対応ならCloudで復元できる前提にせず、ローカルセーブのバックアップ手順を確認します。フォルダーやファイルを推測で削除しません。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/steam-cloud-sync-error',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://help.steampowered.com/ja/faqs/view/68D2-35AB-09A9-7678',
      },
    ],
  },
  'specialist-controller-os': {
    id: 'specialist-controller-os',
    title: 'Windowsの認識から確認する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '実機1台で、Windows・Steam・ゲームのどこまで反応するかを分けます。ドライバー削除、デバイスの隠蔽、セキュリティの変更は行いません。',
    steps: [
      '実機を1台にし、メーカーの接続方法に沿ってUSBまたはBluetoothの接続状態を確認します。',
      'Windowsのゲームコントローラー設定（joy.cpl）で認識とボタン反応を確認します。反応しなければSteam設定より先に機器メーカーへ相談します。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/steam-input-controller',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_players',
      },
    ],
  },
  'specialist-controller-steam': {
    id: 'specialist-controller-steam',
    title: 'Steamの認識・入力テストを確認する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '実機1台で、Windows・Steam・ゲームのどこまで反応するかを分けます。ドライバー削除、デバイスの隠蔽、セキュリティの変更は行いません。',
    steps: [
      'Windowsで入力できることを確認してから、Steamのコントローラー設定で機器と入力を確認します。',
      '対応機種・接続方式を公式情報と照合します。ゲーム別の変更前に現在値を控え、変換アプリを重ねて導入しません。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/steam-input-controller',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_players',
      },
    ],
  },
  'specialist-controller-game': {
    id: 'specialist-controller-game',
    title: 'ゲームの対応方式とSteam Inputを照合する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '実機1台で、Windows・Steam・ゲームのどこまで反応するかを分けます。ドライバー削除、デバイスの隠蔽、セキュリティの変更は行いません。',
    steps: [
      'ゲームのコントローラー対応と、XInput・DirectInputなどの対応方式を公式情報で確認します。',
      'Steam版ならゲーム別Steam Inputの現在値を控え、公式案内に合う設定を1つずつ比較して効果がなければ戻します。Steam以外のゲームにSteam設定を前提としません。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/steam-input-controller',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_players',
      },
    ],
  },
  'specialist-audio-hdmi': {
    id: 'specialist-audio-hdmi',
    title: 'HDMI・USBなど接続先を変えた後から場合の確認',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '小さな音量で、同じ出力機器を使う他アプリやWindowsの音が聞こえるか確認します。急に音量を上げないでください。マイクの録音や音声の取得は行いません。',
    steps: [
      'Windows・ゲームで選択中の出力先と、実際につないだ機器を照合します。',
      '元の出力先と音量を控え、小さな音量で1項目ずつ確認します。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/no-game-audio',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows',
      },
    ],
  },
  'specialist-audio-bluetooth-mic': {
    id: 'specialist-audio-bluetooth-mic',
    title: 'Bluetoothでマイク・通話を使うと変わる場合の確認',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '小さな音量で、同じ出力機器を使う他アプリやWindowsの音が聞こえるか確認します。急に音量を上げないでください。マイクの録音や音声の取得は行いません。',
    steps: [
      '使っているマイクと出力機器を確認します。録音・通話を終了した状態と比較し、音量は上げすぎません。',
      'アプリの終了と再開で変化するか記録します。マイク権限の一括変更やサービス無効化は行いません。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/no-game-audio',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows',
      },
    ],
  },
  'specialist-audio-bluetooth-playback': {
    id: 'specialist-audio-bluetooth-playback',
    title: 'Bluetoothの再生だけでも変わる・マイク使用は不明場合の確認',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '小さな音量で、同じ出力機器を使う他アプリやWindowsの音が聞こえるか確認します。急に音量を上げないでください。マイクの録音や音声の取得は行いません。',
    steps: [
      '通話・録音アプリが開いているか、利用中の出力先と接続状態を手元で確認します。',
      'マイク使用が不明なら使用していないと判断しません。OS・機器の対応方式を公式案内で確認します。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/no-game-audio',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows',
      },
    ],
  },
  'specialist-controller-double-converter': {
    id: 'specialist-controller-double-converter',
    title: '入力の変換経路を1つずつ確認する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '実機1台で、Windows・Steam・ゲームのどこまで反応するかを分けます。ドライバー削除、デバイスの隠蔽、セキュリティの変更は行いません。',
    steps: [
      'ゲームと変換アプリを終了し、実機1台・入力変換1経路で比較します。必要な設定を控えてから行います。',
      'Steam InputとDS4Windowsなどを重ねず、ゲームが対応する1つの経路で比較します。元の設定を控え、デバイスを隠したりドライバーを削除したりしません。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/controller-double-input',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_players',
      },
    ],
  },
  'specialist-controller-double-none': {
    id: 'specialist-controller-double-none',
    title: '入力の変換経路を1つずつ確認する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '実機1台で、Windows・Steam・ゲームのどこまで反応するかを分けます。ドライバー削除、デバイスの隠蔽、セキュリティの変更は行いません。',
    steps: [
      '実機が複数接続されていないかと、ゲーム内の入力割り当て・Steam Inputを確認します。新たな変換アプリは導入しません。',
      'Steam InputとDS4Windowsなどを重ねず、ゲームが対応する1つの経路で比較します。元の設定を控え、デバイスを隠したりドライバーを削除したりしません。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/controller-double-input',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_players',
      },
    ],
  },
  'specialist-controller-double-unknown': {
    id: 'specialist-controller-double-unknown',
    title: '入力の変換経路を1つずつ確認する',
    time: '確認できる範囲で',
    risk: '手動確認・元に戻せる比較',
    reversible: '変更前の値を控え、変化がなければ元に戻します。',
    warning:
      '実機1台で、Windows・Steam・ゲームのどこまで反応するかを分けます。ドライバー削除、デバイスの隠蔽、セキュリティの変更は行いません。',
    steps: [
      '起動中のアプリと接続中の機器を確認し、分からないアプリを削除・無効化せず公式案内を確認します。',
      'Steam InputとDS4Windowsなどを重ねず、ゲームが対応する1つの経路で比較します。元の設定を控え、デバイスを隠したりドライバーを削除したりしません。',
    ],
    improved:
      '改善したら追加変更を重ねず、変更内容と結果を記録します。原因確定やPC全体の正常判定ではありません。',
    unchanged:
      '繰り返さず、未確認の項目と症状を記録し、リンク先の手順または公式窓口を確認します。',
    article: '/guide/controller-double-input',
    sources: [
      {
        label: '公式の確認方法',
        url: 'https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_players',
      },
    ],
  },
};
export const specialistBranches = [
  {
    symptom: 'gpu-usage',
    observation: 'capped',
    action: 'specialist-gpu-usage-capped',
    reason:
      '「GPU使用率は低いが、目標FPS・上限に達している」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'gpu-usage',
    observation: 'low',
    action: 'specialist-gpu-usage-low',
    reason:
      '「GPU使用率もFPSも低い」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'gpu-usage',
    observation: 'high',
    action: 'specialist-gpu-usage-high',
    reason:
      '「GPU使用率が高い・FPSが足りない」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'gpu-usage',
    observation: 'heat',
    action: 'specialist-gpu-usage-heat',
    reason:
      '「温度警告・熱による性能低下が気になる」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'vram',
    observation: 'warning',
    action: 'specialist-vram-warning',
    reason:
      '「専用VRAM不足の警告・上限付近と症状がある」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'vram',
    observation: 'ram',
    action: 'specialist-vram-ram',
    reason:
      '「Windowsのメモリ（RAM）が不足している」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'vram',
    observation: 'integrated',
    action: 'specialist-vram-integrated',
    reason:
      '「内蔵GPU・共有GPUメモリの数字を見ている」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'vram',
    observation: 'estimate',
    action: 'specialist-vram-estimate',
    reason:
      '「ゲーム内のVRAM予測表示だけが高い」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'audio',
    observation: 'game-only',
    action: 'specialist-audio-game-only',
    reason:
      '「他アプリは聞こえるが、このゲームだけ無音」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'audio',
    observation: 'all',
    action: 'specialist-audio-all',
    reason:
      '「同じ機器で他アプリの音も聞こえない」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'audio',
    observation: 'partial',
    action: 'specialist-audio-partial',
    reason:
      '「効果音はあるが声など一部だけ聞こえない」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'steam-cloud',
    observation: 'conflict',
    action: 'specialist-steam-cloud-conflict',
    reason:
      '「クラウドとローカルの競合が出ている」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'steam-cloud',
    observation: 'sync',
    action: 'specialist-steam-cloud-sync',
    reason:
      '「同期できない・通信エラーになっている」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'steam-cloud',
    observation: 'missing',
    action: 'specialist-steam-cloud-missing',
    reason:
      '「別端末で進行が古い・セーブが見つからない」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'steam-cloud',
    observation: 'unsupported',
    action: 'specialist-steam-cloud-unsupported',
    reason:
      '「このゲームがCloud対応か分からない」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'controller',
    observation: 'os',
    action: 'specialist-controller-os',
    reason:
      '「Windowsでも認識・入力を確認できない」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'controller',
    observation: 'steam',
    action: 'specialist-controller-steam',
    reason:
      '「Windowsでは反応するがSteamでは反応しない」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'controller',
    observation: 'game',
    action: 'specialist-controller-game',
    reason:
      '「Steamでは反応するがゲームでは反応しない」という回答に合わせた手動確認です。自動検査や原因の断定ではありません。',
  },
  {
    symptom: 'audio',
    observation: 'hdmi',
    action: 'specialist-audio-hdmi',
    reason:
      '「HDMI・USBなど接続先を変えた後から」という回答に基づく手動確認です。音声や機器の情報は取得していません。',
  },
  {
    symptom: 'audio',
    observation: 'bluetooth-mic',
    action: 'specialist-audio-bluetooth-mic',
    reason:
      '「Bluetoothでマイク・通話を使うと変わる」という回答に基づく手動確認です。音声や機器の情報は取得していません。',
  },
  {
    symptom: 'audio',
    observation: 'bluetooth-playback',
    action: 'specialist-audio-bluetooth-playback',
    reason:
      '「Bluetoothの再生だけでも変わる・マイク使用は不明」という回答に基づく手動確認です。音声や機器の情報は取得していません。',
  },
  {
    symptom: 'controller',
    observation: 'double-converter',
    action: 'specialist-controller-double-converter',
    reason:
      '「二重入力：DS4Windowsなどの変換アプリを使っている」という回答に基づき、入力の重複経路を確認します。',
  },
  {
    symptom: 'controller',
    observation: 'double-none',
    action: 'specialist-controller-double-none',
    reason:
      '「二重入力：変換アプリは使っていない」という回答に基づき、入力の重複経路を確認します。',
  },
  {
    symptom: 'controller',
    observation: 'double-unknown',
    action: 'specialist-controller-double-unknown',
    reason:
      '「二重入力：変換アプリの有無は分からない」という回答に基づき、入力の重複経路を確認します。',
  },
];
/** Context-specific copy uses only the user's Windows answer. */
export function specialistActionFor(action: Action, os?: string): Action {
  if (!action.id.startsWith('specialist-audio-bluetooth')) return action;
  const version =
    os === 'windows10'
      ? 'Windows 10のBluetooth ClassicではStereoとHands-Freeが別の出力として見えることがあります。マイク使用時は経路が変わるため、Stereoへの一律切り替えを勧めません。'
      : os === 'windows11'
        ? 'Windows 11のBluetooth Classicでは出力が統合され、マイク使用や通信音声で経路が変わります。LE Audio対応機器・PCでは挙動が異なるため、Bluetoothは必ず低音質になるとは判断しません。'
        : 'Windowsの版とBluetooth Classic／LE Audioの対応は未確認です。Stereo／Hands-Freeの表示や通話中の音質を一律に判断せず、機器・PCの公式案内を確認します。';
  return {
    ...action,
    steps: [...action.steps, version],
    sources: [
      ...action.sources,
      {
        label: 'Microsoft：Bluetooth ClassicとWindowsの版',
        url: 'https://learn.microsoft.com/ja-jp/windows-hardware/drivers/bluetooth/bluetooth-classic-audio',
      },
      {
        label: 'Microsoft：通信音声の対応',
        url: 'https://learn.microsoft.com/en-us/windows/win32/coreaudio/communications-audio-format-capabilities',
      },
    ],
  };
}
