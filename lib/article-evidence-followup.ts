import type { ArticleEvidenceReview } from './article-evidence-reviews';
const gpuSource = {
  label: 'Microsoft：タスクマネージャーのGPU表示（英語）',
  url: 'https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/',
};
export const followupEvidenceReviews: Record<string, ArticleEvidenceReview> = {
  '/games/call-of-duty-modern-warfare-4/crash': {
    scope:
      'PC版。Season 1更新後の起動クラッシュの告知はSteam版に限定します。PC構成・ゲーム版ごとの独立した比較記録は未取得です。',
    result:
      '公式資料の照合まで完了。ゲムなおで実機の起動失敗を再現・修復した結果、FPSの前後測定値、実画面の比較画像はまだありません。',
    limits:
      '安定性改善の告知だけではSteam起動クラッシュの修正完了を確認できません。比較用の60秒・3回という条件は編集上の提案で、公式の測定基準や実測結果ではありません。',
    compare:
      'CPU・GPU・メモリ・OS・ドライバー・配布元・ゲーム版と前後の設定画面を保存し、変更を1項目に絞って同じ場面で比べます。起動可否・落ちるまでの時間・試行回数を先に記録。FPSが測れなければ未測定とし、公開前に実施日・画像内の個人情報・測定条件を照合します。',
    sourceReview:
      '2026-11-12にSeason 1パッチ（11/10更新）、既知問題（11/6更新）、PC要件（11/5更新）の本文を照合。過去の資料確認日を実機試験日には転用していません。',
    official: [
      {
        label: 'Call of Duty：Season 1パッチノート（英語）',
        url: 'https://www.callofduty.com/patchnotes/2026/11/call-of-duty-modern-warfare-4-season-1-patch-notes',
        text: '11/7のSteam起動クラッシュと整合性確認、11/10の安定性改善の告知を確認。個別環境の改善はこの資料だけで証明しません。',
      },
    ],
  },
  '/guide/low-gpu-usage': {
    result:
      '本文の60／120fpsなどは判定方法の仮例です。特定PCでGPU使用率を上げて性能が改善したという実機記録は、このガイドにはありません。',
    limits:
      '使用率だけではCPU制約・FPS上限・GPUの選択違いを確定できません。目標FPSを維持している場合の低使用率を故障とは判定しません。',
    compare:
      '同じ場面で目標FPS・上限・実際のFPS・GPU番号とエンジン・CPU各論理プロセッサを記録します。上限や描画設定を一つ変え、FPSも変わるか比較してください。使用率だけの増加は改善結果に数えません。',
    scope:
      'Windows PCのGPU負荷の読み方。引用するMicrosoftのGPU表示説明はWDDM 2.0以上が対象です。ゲームのビルド・GPU・ドライバー別の実測版は未記録です。',
    official: [
      {
        ...gpuSource,
        text: 'MicrosoftはGPUエンジン別の表示と、全体使用率が最も忙しいエンジンを代表値にする仕組みを説明しています。低使用率の原因を一つに決める資料ではありません。',
      },
    ],
    sourceReview:
      '2026-10-25にMicrosoftのGPU表示解説を照合しました。既存のCPU/GPU制約解説は取得が403となり本文を再確認できていません。記事全体の新しい実機確認日ではありません。',
  },
  '/guide/low-fps': {
    result:
      '本文のFPS・負荷の数値は説明用です。解像度や設定を変えた前後の実測ベンチマークは掲載していません。',
    limits:
      '解像度を下げてもFPSが増えない結果だけでCPUが原因とは断定できません。FPS上限・同期・計測対象のGPUも確認が必要で、改善幅や推奨設定はゲームごとに未検証です。',
    compare:
      '同じセーブ地点・視点・解像度でFPS、上限、GPU 3D負荷を記録し、描画解像度だけを下げて比較します。CPU側を調べる場合も変更を一つに絞り、平均FPSだけでなく引っ掛かりの有無を残します。',
    scope:
      'Windows PCの継続的な低FPSが対象です。オンラインの通信遅延や瞬間的な停止は別に切り分けます。特定ゲーム・パッチ・ドライバーでの改善確認は未記録です。',
    official: [
      {
        ...gpuSource,
        text: 'Microsoftの解説でGPUエンジンの表示対象を確認できます。3D負荷とFPSを併記する比較は編集上の切り分けで、改善率を示す試験ではありません。',
      },
    ],
    sourceReview:
      'GPU表示の説明を2026-10-25に照合。既存のCPU/GPU制約解説は403で本文を再確認できず、その資料を新たに確認済みとはしていません。',
  },
  '/guide/stutter-fix': {
    result:
      '90fpsなどの上限設定例と比較メモは説明・記入用です。編集部がフレーム時間を測ってカクつきの解消を確認した記録ではありません。',
    limits:
      '平均FPSが高くても瞬間的な停止は残り得ます。初回読み込み、シェーダー、メモリ、通信のどれが原因かは本文だけでは確定できず、90fpsを全ゲーム向けの最適値にはできません。',
    compare:
      '同じ移動経路で初回と再訪を分け、停止する場所・間隔とFPS上限を記録します。上限を変える場合は一項目だけ変更し、固定Hz／VRRの条件をそろえます。通信の巻き戻りと画面全体の停止も分けてください。',
    scope:
      'Windows PCで断続的に引っ掛かる症状。NVIDIAの引用は対応するコントロールパネルの設定説明で、他社GPUの画面にはそのまま適用しません。特定ゲーム・ドライバー版の実測は未記録です。',
    official: [
      {
        label: 'NVIDIA：3D設定の管理（英語）',
        url: 'https://www.nvidia.com/content/Control-Panel-Help/vLatest/en-us/mergedProjects/nv3d/Manage_3D_Settings_(reference).htm',
        text: 'NVIDIAはゲーム単位で3D設定を保存・復元できることを説明しています。設定機能の説明であり、この症状への効果を実証する資料ではありません。',
      },
    ],
    sourceReview:
      '2026-10-25にNVIDIAのプログラム別設定の説明を照合。本文の比較例を新しい実測値に置き換えたものではなく、全手順の現行UIを確認した日でもありません。',
  },
  '/guide/vram-shortage': {
    result:
      '本文のGPUメモリ値は記録方法の仮例です。テクスチャを下げた際の実測使用量やクラッシュ改善率は掲載していません。',
    limits:
      'ゲーム内の推定VRAMとWindowsの使用量は同じ指標とは限りません。容量に近い数値や共有メモリ使用だけで不足・故障とは断定できず、内蔵GPUを専用GPUと同じ条件で判定できません。',
    compare:
      '同じ場面で専用・共有GPUメモリと実際の症状を記録し、テクスチャなど一項目を下げて再比較します。使用量だけでなく、停止やエラーが再発するかも記録してください。',
    scope:
      'Windows PCの専用／共有GPUメモリ。Microsoftの表示説明はWDDM 2.0以上を対象とし、ゲーム内の推定値を保証しません。特定GPU容量・ゲーム版での実測は未記録です。',
    official: [
      {
        ...gpuSource,
        text: 'Microsoftは専用メモリと共有メモリを区別しています。プロセスごとの値を単純合算すると共有分が重複する場合があるため、GPU全体の値と区別します。',
      },
    ],
    sourceReview:
      '2026-10-25にMicrosoftの専用／共有メモリと集計方法の説明を照合しました。ゲームごとの必要容量を新たに測定した記録ではありません。',
  },
  '/games/aniimo/video-memory-error': {
    result:
      '「専用7.6／8GB→5.2／8GB」は比較の読み方を示す仮例です。Aniimoを実行して採取した値や、エラーが直ったという編集部の実測記録ではありません。',
    limits:
      'エラー名だけではVRAM不足とCPU等の不安定動作を区別できません。GPU容量・設定別の改善率は不明で、更新告知の存在だけで現在のエラーが修正済みとは判断しません。',
    compare:
      'エラー全文、ゲームの版、GPU、ドライバー、同じ場面の専用／共有メモリを記録します。テクスチャを一段下げた後も同じ解像度・場面で再発を確認し、使用量の減少だけで解決とはしないでください。',
    scope:
      'AniimoのWindows PC版。2026年9月23日更新の公式告知を参照しますが、現在の配信版やテスト済みのビルドを示すものではありません。本文のIntel CPUに関する分岐も、このPCの故障診断にはなりません。',
    official: [
      {
        label: 'Aniimo：9月23日アップデートのお知らせ',
        url: 'https://aniimo.com/ja/newslist/detail/100139',
        text: '2026-09-21公開の告知には9月23日の更新予定とクライアント再起動の案内があります。この告知をVRAMエラーの一律解消の根拠にはしていません。',
      },
    ],
    sourceReview:
      '2026-10-25に上記の告知日・更新日・再起動案内を照合。最新パッチの網羅的な確認、Intel関連資料の再確認、新しい実機試験は行っていません。',
  },
};
