import type { CommonGuide } from './common-guides';
export const stutterGuide: CommonGuide = {
  slug: 'stutter-fix',
  title: 'PCゲームのカクつき・スタッター対策｜FPS上限の設定と比較手順',
  shortTitle: 'カクつき・スタッター',
  description:
    '平均FPSは高いのに一瞬止まる時の切り分け。ゲーム内・NVIDIA・AMDのFPS上限設定、60・90・120fpsを試す数値例、シェーダー・VRAM・通信ラグの見分け方、同じ場面での比較方法を解説します。',
  conclusion:
    '平均FPSが高くても一瞬止まる場合は、フレームの描画間隔が乱れている可能性があります。まず同じ場面で症状を記録し、FPS上限を重い場面でも維持できる値へ下げて比較します。初回だけの引っかかりはシェーダー構築、移動時は読み込みやVRAM、オンラインでの位置巻き戻りは通信も候補です。上限設定だけで全部を直そうとせず、症状に合う対策を1つずつ試してください。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    'CPU・GPUの処理負荷と、安定して出せるFPSを超えた設定',
    '初回や更新後のシェーダー構築・場面切り替え時の読み込み',
    'VRAM不足、バックグラウンド処理、温度・電力による性能変化',
  ],
  steps: [
    {
      title: 'FPS上限を1か所で設定する',
      actions: [
        '下の症状表で画面全体の引っかかりか、通信による位置の巻き戻りかを分ける。比較するセーブ・練習場・移動ルートを決め、変更前のFPSと引っかかる場所を記録する。',
        'FPS上限はゲーム内設定を優先する。ない場合は下のNVIDIA・AMD手順を使う。ゲーム内とドライバー側で複数の新しい上限を同時に設定しない。',
        '下の数値例を参考に、重い場面で継続して出るFPSより余裕のある上限を試す。これは最高FPSを伸ばす操作ではない。設定後は同じルートで比較し、改善しなければ元へ戻す。',
      ],
    },
    {
      title: 'シェーダー構築の完了を確認',
      actions: [
        'ゲーム内にシェーダーの構築・最適化・プリロード表示があれば、そのゲームの指定画面で完了を待つ。初回の結果と、同じ場面を再訪した時の結果を分ける。',
        '更新直後だけ引っかかるのか、2回目以降も毎回同じ場所で止まるのかを記録する。キャッシュを削除すると再構築が必要になるため、比較のたびに削除しない。',
        'キャッシュ破損が疑われる症状やゲーム側の案内がある場合だけ、「シェーダーキャッシュ」記事の対象別手順へ進む。',
      ],
    },
    {
      title: 'VRAM・読み込み負荷を確認',
      actions: [
        'テクスチャを1段階下げ、ゲームの案内に従い再起動して同じ場面を比較する。改善してもVRAM不足だけが原因とは断定しない。',
        '移動時の引っかかりなら、ゲームの必要ストレージ条件と実際のインストール先を確認する。更新・ダウンロード・録画が同時に走っていれば、1つずつ停止して比較する。',
        '長時間プレイ後だけ悪化する場合は温度や動作クロック、電源条件も記録する。短い比較で改善しなければ、実際に症状が出る時間まで条件をそろえて再確認する。',
      ],
    },
  ],
  faqs: [
    {
      question: '平均FPSが高いのにカクつくのはなぜですか？',
      answer:
        '平均値だけでは、1枚の描画に急に時間がかかった瞬間が分からないためです。FPSに加え、フレームタイムの突出や、同じ場所で引っかかる回数を比較します。',
    },
    {
      question: '144Hzなら上限は必ず144fpsですか？',
      answer:
        'いいえ。重い場面で100fps前後まで下がるPCに144fpsの上限を設定しても、144fpsを維持できるわけではありません。まず維持できる値で比較します。VRRの動作範囲やV-Syncとの組み合わせは、その後に別項目として確認します。',
    },
    {
      question: '上限を下げると操作が遅くなりませんか？',
      answer:
        '下げすぎると描画の更新間隔が長くなり、操作感も悪くなる場合があります。一方で高負荷時の遅延が減る環境もあります。引っかかりの減少だけでなく、視点移動と操作の反応も比較して決めます。',
    },
    {
      question: 'フレーム生成で120fpsなら安定していますか？',
      answer:
        '表示FPSだけでは判断できません。生成されたフレームを含むFPSと、ゲームが実際に描画するベースFPSを分けて見ます。原因を調べる時はフレーム生成をオフにした条件も別に測り、同じ条件同士で比較します。',
    },
    {
      question: '上限を変えてもFPSが変わりません',
      answer:
        'すでに処理負荷で上限より低い、V-Syncや別の制限が効いている、ロビー専用の上限、ドライバーで対象の実行ファイルを取り違えた、といった可能性があります。プレイ中に確認し、設定を重ねる前に有効な制限を整理します。',
    },
  ],
  related: [
    'low-fps',
    'shader-cache-delete',
    'vram-shortage',
    'gpu-driver-update',
    'pc-game-crash',
  ],
  sources: [
    {
      label: 'NVIDIA公式：Max Frame Rate・ゲーム別Program Settings',
      url: 'https://www.nvidia.com/content/Control-Panel-Help/vLatest/en-us/mergedProjects/nv3d/Manage_3D_Settings_(reference).htm',
    },
    {
      label: 'AMD公式：Global Graphics・Advanced・FRTC',
      url: 'https://www.amd.com/en/resources/support-articles/faqs/dh3-012.html',
    },
    {
      label: 'AMD公式：FRTCの用途と全画面モード',
      url: 'https://www.amd.com/en/products/software/adrenalin/frtc.html',
    },
    {
      label: 'Epic公式：FortniteのFPS上限・V-Sync・ロビーの制限',
      url: 'https://www.epicgames.com/help/c-34254770/c-38015632/a17266354',
    },
    {
      label: 'Steam公式：パフォーマンスモニター・生成FPSとベースFPS',
      url: 'https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767',
    },
    {
      label: 'Microsoft公式：Windowsのリフレッシュレート確認',
      url: 'https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/change-the-refresh-rate-on-your-monitor-in-windows',
    },
    {
      label: 'Epic公式：DirectX 12のカクつきと初回シェーダー構築',
      url: 'https://www.epicgames.com/help/c-34254770/c-38015632/a11302262',
    },
  ],
};
