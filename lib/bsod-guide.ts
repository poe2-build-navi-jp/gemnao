import type { CommonGuide } from './common-guides';

export const bsodGuide: CommonGuide = {
  slug: 'bsod-while-gaming',
  title:
    'ゲーム中のブルースクリーン｜停止コード・メモリ診断・ミニダンプの調べ方',
  shortTitle: 'ゲーム中のブルースクリーン',
  description:
    'ゲーム中にPCが停止コードを表示して再起動する時の調べ方。VIDEO_TDR_FAILURE・MEMORY_MANAGEMENT・WHEAなどの確認先、Windowsメモリ診断の起動と結果、ミニダンプの保存先、相談用メモを解説します。',
  conclusion:
    '画面の色より「停止コード」「表示されたファイル名」「発生時刻」を先に記録します。再起動後はイベント ビューアーで同じ時刻の記録を確認し、コードに応じてGPUドライバー、メモリ診断、PCメーカーの診断へ進みます。何度も止まる場合は重要なデータを先にバックアップし、ミニダンプと経過をサポートへ伝えてください。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    'ディスプレイなどのドライバーとWindows・ゲームの組み合わせ',
    'メモリ管理の問題やハードウェアの異常',
    '新しく追加した周辺機器、OC設定、更新直後の変化',
  ],
  steps: [
    {
      title: '停止コードと時刻を残し、Windowsの記録を確認する',
      actions: [
        '停止画面の「Stop code／停止コード」と、あれば「What failed／失敗した内容」のファイル名を撮影する。画面がすぐ消えたら再起動後にイベント ビューアーの「Windows ログ」→「システム」で発生時刻付近のBugCheckやWHEA-Loggerを調べる。',
        'ゲーム名、発生場面、日時、直前のWindows・GPUドライバー更新や周辺機器の変更を控える。繰り返す場合は重要ファイルをバックアップし、無理に何度も再現させない。',
      ],
    },
    {
      title: '停止コードに合う確認先を1つずつ試す',
      actions: [
        'VIDEO_TDR_FAILUREならGPU名・現在のドライバー版・更新直後かを確認する。MEMORY_MANAGEMENTやIRQL_NOT_LESS_OR_EQUALならWindowsメモリ診断と最近追加したドライバー・機器を調べる。WHEA_UNCORRECTABLE_ERRORならメーカーのハードウェア診断や冷却・標準設定を確認する。コードだけで部品の故障を断定しない。',
        'Windows 11では「スタート」→「設定」→「Windows Update」で更新を確認する。ドライバー更新の直後に悪化した場合は元の版を記録した上で戻し方を調べる。変更は1項目ずつ行い、同じ場面で比較する。',
      ],
    },
    {
      title: 'メモリ診断の結果を読み、相談用の記録を揃える',
      actions: [
        '作業を保存してからWindowsの検索で「Windows メモリ診断」を開き、「今すぐ再起動して問題の有無を確認する」を選ぶ。再起動後にイベント ビューアー→「Windows ログ」→「システム」でソース「MemoryDiagnostics-Results」の結果本文を読む。',
        '「エラーは検出されませんでした」は今回の検査で未検出という意味。ブルースクリーンの原因がメモリではないと確定しない。エラーが出た場合はPCメーカーへ相談する。',
        'ミニダンプが作成されていればエクスプローラーで「%SystemRoot%\\Minidump」を開き、発生時刻の.dmpの名前を控える。提出はメーカー・サポートの案内に従い、公開掲示板へ無確認でアップロードしない。',
      ],
    },
  ],
  faqs: [
    {
      question: '画面が黒いのですが、ブルースクリーンの記事でよいですか？',
      answer:
        '「デバイスで問題が発生したため、再起動が必要です」や停止コードが出ていればこの手順です。Windowsの版により停止画面が黒くなる場合があります。停止コードのない真っ黒な画面は黒い画面の記事から切り分けます。',
    },
    {
      question: 'メモリ診断の結果が通知されません',
      answer:
        'スタートを右クリック→「イベント ビューアー」→「Windows ログ」→「システム」を開き、診断後の時刻でソース「MemoryDiagnostics-Results」を探してください。該当記録が見つからない場合は、未検出だったと決めつけず、実施日時と結果が確認できないことを控えて相談してください。',
    },
    {
      question: 'Minidumpフォルダーが空です。異常がないという意味ですか？',
      answer:
        'いいえ。ダンプの保存設定や空き容量、停止の状態によって作成されないことがあります。「システムの詳細設定」→「起動と回復」の「設定」→「デバッグ情報の書き込み」で保存形式を確認し、ファイルがない事実をサポートに伝えてください。',
    },
    {
      question: 'Kernel-Power 41が出ています。電源ユニットの故障ですか？',
      answer:
        'この記録だけで故障箇所は決まりません。予期しない再起動を示す手掛かりとして時刻を照合し、同時刻前後の停止コード・BugCheck・WHEA-Loggerと発生条件を一緒に確認します。',
    },
  ],
  related: [
    'gpu-driver-update',
    'pc-shuts-down-while-gaming',
    'pc-game-freezes',
    'black-screen',
  ],
  sources: [
    {
      label: 'Microsoft：停止コードの見方とWindowsの基本的な確認',
      url: 'https://support.microsoft.com/ja-jp/windows/experience/performance-optimization/troubleshooting-windows-unexpected-restarts-and-stop-code-errors',
    },
    {
      label: 'Microsoft：Windowsメモリ診断と結果のイベントログ',
      url: 'https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/bug-check-0x116---video-tdr-failure',
    },
    {
      label: 'Microsoft：MEMORY_MANAGEMENTの解説',
      url: 'https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/bug-check-0x1a--memory-management',
    },
    {
      label: 'Microsoft：IRQL_NOT_LESS_OR_EQUALの解説',
      url: 'https://support.microsoft.com/en-us/windows/experience/performance-optimization/how-to-fix-error-0xa-irql-not-less-or-equal',
    },
    {
      label: 'Microsoft：WHEA_UNCORRECTABLE_ERRORの解説',
      url: 'https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/bug-check-0x124---whea-uncorrectable-error',
    },
    {
      label: 'Microsoft：小さなメモリダンプの保存先と設定',
      url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/read-small-memory-dump-file',
    },
    {
      label: 'Microsoft：停止コードとダンプの調査',
      url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/stop-code-error-troubleshooting',
    },
    {
      label: 'Microsoft：Kernel-Powerイベント41の読み方',
      url: 'https://learn.microsoft.com/ja-jp/troubleshoot/windows-client/performance/event-id-41-restart',
    },
  ],
};
