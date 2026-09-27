import type { CommonGuide } from './common-guides';

export const gpuDriverGuide: CommonGuide = {
  slug: 'gpu-driver-update',
  title: 'GPUドライバーの更新方法｜NVIDIA・AMD・Intel別の操作と戻し方',
  shortTitle: 'GPUドライバー更新・元に戻す',
  description:
    'PCゲームの画面乱れやクラッシュが更新で改善するか調べる手順。更新前のGPU名・ドライバー版の記録、NVIDIAアプリ・AMD Software・Intel DSAの操作、悪化した時のロールバックをWindows 11向けに解説します。',
  conclusion:
    '更新前に「使用中のGPU名・現在のドライバー版・困っている症状」を控え、ノートPCや携帯型PCは製品メーカーの対応版を先に確認します。NVIDIA・AMD・Intelのうち、対象のGPUに合う方法を1つ選んで更新し、インストール完了後に一度再起動。同じゲーム・同じ場面で比較します。悪化したら以前の版に戻せるか確認してください。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    'ゲームの更新と現在の描画ドライバーの組み合わせ',
    'ノートPC・携帯型PC固有の構成と汎用ドライバーの差',
    '更新後に生じた新しい不具合や、更新対象のGPUの取り違え',
  ],
  steps: [
    {
      title: 'GPU名・現在の版と症状を記録する',
      actions: [
        'ゲームを終了し、Windowsの「スタート」を右クリック→「デバイス マネージャー」→「ディスプレイ アダプター」を開く。対象GPUの製品名を控える。2つ表示されるPCでは両方を記録し、ゲームの使用GPUも確認する。',
        '対象GPUを右クリック→「プロパティ」→「ドライバー」で「ドライバーのバージョン」「日付」を記録する。Windows＋R→dxdiag→「ディスプレイ」または「レンダー」も確認できるが、複数GPUでは対象名を取り違えない。',
        '困っているゲーム・症状・発生場面と、PCメーカー／型番を控える。ノートPC・携帯型PCはまずその製品のサポートページで対応版を確認する。',
      ],
    },
    {
      title: 'メーカー別に1つの経路で更新する',
      actions: [
        '下のメーカー別操作表から対象GPUの行を選ぶ。NVIDIAアプリの「ドライバー」、AMD Softwareの「システム設定」、Intel Driver & Support Assistantの更新候補が入口。PCメーカーが専用版を指定していればその案内を優先する。',
        '更新候補の型番・OS・版を確かめ、ゲームを終了してから画面の案内に従ってインストールする。AMDの「Factory Reset」のような既存版を消す操作は通常の比較には選ばない。',
        'インストーラーから再起動を求められたら従う。完了後にまだ再起動していなければWindowsの「スタート」→「電源」→「再起動」を一度実施する。',
      ],
    },
    {
      title: '同じ条件で比較し、悪化したら戻す',
      actions: [
        '再起動後にデバイス マネージャーで対象GPUの版を確認し、同じゲーム・画質・セーブ・場面で変更前の症状を比較する。新しい場面や更新後の初回処理だけで結論を出さない。',
        '改善しないなら他の要因も調べる。更新後に新しい画面乱れ・クラッシュが出た場合は、下の「元に戻す」手順へ進む。戻す前に新しく出た症状と現在の版も記録する。',
        'Windowsの「ドライバーを元に戻す」が押せない場合は、記録しておいた以前の版をPCメーカーまたはGPUメーカーの公式配布から探す。互換性が不明な非公式パッケージは使わない。',
      ],
    },
  ],
  faqs: [
    {
      question: 'IntelとNVIDIAが両方表示されます。どちらを更新しますか？',
      answer:
        'CPU名だけで判断しないでください。タスク マネージャーの「パフォーマンス」でGPU名を確かめ、ゲームの表示に使うGPUと症状を記録します。ノートPCでは表示経路に両方が関わる場合もあるため、PCメーカーが指定する組み合わせを優先します。',
    },
    {
      question: '「ドライバーを元に戻す」が押せません',
      answer:
        'Windowsに戻すための以前の版が残っていない場合などは利用できません。NVIDIAアプリに以前インストールした版が表示される場合は再導入を確認します。それもなければ、更新前に控えた版とPC型番を基に、製品メーカーの公式配布を調べます。',
    },
    {
      question: 'AMDの「Factory Reset」を選んだほうが確実ですか？',
      answer:
        '通常の更新を比較する段階では選びません。AMDの説明では、既存のAMD Softwareを削除し、以前のドライバーへ戻せなくなります。問題の切り分け中は元へ戻せる方法を優先してください。',
    },
    {
      question: '最新版にしてもFPSが上がりません',
      answer:
        'ドライバー更新はFPSの上昇を保証しません。平均FPSに加え、更新前にあった画面乱れ・クラッシュの再発を同じ条件で比較します。FPS上限や画質、CPU・VRAMが原因なら別の設定を調べます。',
    },
    {
      question: '更新後の最初のゲームだけ引っかかります',
      answer:
        'ゲームやドライバーの更新後はシェーダーの構築・再構築が関わる場合もあります。ゲーム内の進捗を確認し、同じ場面の2回目以降も比較します。ずっと同じ場所で止まるなら別の原因も調べます。',
    },
  ],
  related: [
    'pc-game-crash',
    'black-screen',
    'stutter-fix',
    'low-gpu-usage',
    'shader-cache-delete',
  ],
  sources: [
    {
      label: 'NVIDIA公式：NVIDIAアプリのDrivers画面・更新・以前の版の再導入',
      url: 'https://www.nvidia.com/en-us/geforce/news/gfecnt/202411/nvidia-app-download-and-features/',
    },
    {
      label: 'NVIDIA公式：製品・OSに合うドライバーの検索',
      url: 'https://www.nvidia.com/ja-jp/drivers/',
    },
    {
      label: 'AMD公式：Software and Drivers・Manage Updates',
      url: 'https://www.amd.com/en/resources/support-articles/faqs/DH3-016.html',
    },
    {
      label: 'AMD公式：インストール手順とFactory Resetの制限',
      url: 'https://www.amd.com/en/resources/support-articles/faqs/rsx2-install.html',
    },
    {
      label: 'Intel公式：Driver & Support Assistantによる自動検出',
      url: 'https://www.intel.com/content/www/us/en/support/articles/000005629/graphics/processor-graphics.html',
    },
    {
      label: 'Intel公式：Driver & Support Assistant入手先',
      url: 'https://www.intel.com/content/www/us/en/support/detect.html',
    },
    {
      label: 'Microsoft公式：ディスプレイアダプターのドライバーを元に戻す',
      url: 'https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/fix-graphics-device-problems-with-error-code-43',
    },
  ],
};
