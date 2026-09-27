import type { CommonGuide } from './common-guides';

export const freezeGuide: CommonGuide = {
  slug: 'pc-game-freezes',
  title: 'PCゲームが固まる・応答なしになる時の対処法｜メモリ・温度の確認手順',
  shortTitle: 'ゲームが固まる・応答なし',
  description:
    'ゲームだけ固まる場合とPC全体が操作できない場合を切り分け。Windows 11のタスクマネージャー、メモリ・GPU温度の見方、CPU温度の確認、信頼性履歴から次の対処を選ぶ方法を解説します。',
  conclusion:
    'まずCtrl＋Shift＋Escでタスクマネージャーが開くか確認します。Windowsが操作できるならゲーム側の停止として調べ、Ctrl＋Alt＋Deleteにも反応しないならPC全体・表示・入力の問題も候補にします。復旧後は同じ場面でメモリの空きと温度を記録し、結果に合う対処を1つだけ試します。「応答なし」や高い使用率だけで故障とは決めつけません。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    'ゲームの処理待ち、破損ファイル、MOD・オーバーレイの競合',
    'メモリ・VRAMの余裕不足、長時間プレイで増える使用量',
    '冷却・ドライバー・PC全体の不安定さ（停止範囲で切り分ける）',
  ],
  steps: [
    {
      title: 'ゲームだけかPC全体か分ける',
      actions: [
        '下の症状表に沿って、Alt＋Tab、Ctrl＋Shift＋Esc、Ctrl＋Alt＋Deleteへの反応を確認する。音が続くだけではWindowsが正常とは判断しない。',
        '読み込みやシェーダー構築の進捗が変化していれば待つ。進捗がなく操作も戻らない場合、Windowsが動くならタスクマネージャーの「プロセス」で対象ゲームを選び「タスクを終了する」。未保存の進行は失われる可能性がある。',
        'PC全体が反応せず通常の再起動もできない場合だけ、機種の説明書に従って電源ボタン長押しで終了する。復旧したら停止時刻を記録し、下の信頼性履歴を確認する。',
      ],
    },
    {
      title: 'メモリと温度を記録する',
      actions: [
        'ゲームを起動する前にタスクマネージャーの「パフォーマンス」を開く。「メモリ」の利用可能・コミット済みと、使用中GPUの専用GPUメモリを記録する。',
        '下の確認手順でGPU・CPU温度を調べる。起動直後と症状が出る直前を同じ条件で比べる。停止後や再起動後の低い温度だけでは、プレイ中の状態は分からない。',
        '見られなかった値は「未取得」とする。監視アプリは1つずつ使い、表示を追加したことで症状が変わる場合は監視あり／なしも分ける。',
      ],
    },
    {
      title: '結果に合う対処を1つ試す',
      actions: [
        '特定のゲーム・同じ場面だけなら、Steamライブラリで対象を右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」。完了後に同じ場面を試す。MOD導入済みなら先に導入元の手順で退避する。',
        'メモリの余裕が減っているなら、保存を済ませたブラウザーや録画アプリを終了して比較する。VRAM側ならテクスチャを1段階下げて比較する。両方を同時に変えない。',
        '温度上昇と性能低下が重なるなら、通気口や設置状態を確認する。複数ゲームや通常操作でも固まるなら、ゲームの再インストールを繰り返さず、PCメーカーの診断・サポートへ進む。',
      ],
    },
  ],
  faqs: [
    {
      question: '「応答なし」と出たら、すぐ強制終了していいですか？',
      answer:
        '一時的な処理待ちでも表示されます。読み込みやシェーダー構築の進捗が動くなら待ちます。進捗も操作も戻らない時は対象ゲームの終了を検討しますが、未保存の進行は失われる場合があります。全ゲーム共通の待ち時間はありません。',
    },
    {
      question:
        '音は鳴っているのに画面だけ固まります。ゲームだけの問題ですか？',
      answer:
        '音が続くことだけでは判断できません。Alt＋TabやCtrl＋Alt＋DeleteでWindowsが反応するかを確認します。画面表示だけの障害や、音が繰り返されるPC全体の停止もあります。',
    },
    {
      question: 'メモリ使用率が90％なら、メモリの故障ですか？',
      answer:
        'いいえ。使用率は容量の使われ方であり、故障判定ではありません。利用可能な容量、コミット済みの上限までの余裕、停止直前の変化を見ます。他アプリを終了すると改善するかを先に比較してください。',
    },
    {
      question: 'CPUが90℃なら、フリーズの原因は熱ですか？',
      answer:
        '90℃という値だけでは確定できません。許容温度は製品で異なり、同じ負荷で温度上昇と動作速度低下が重なるかも見ます。GPU温度・GPU接合部温度・CPU温度は別の測定値なので混ぜて比較しません。',
    },
    {
      question: '再起動後に温度やメモリが正常なら問題ありませんか？',
      answer:
        '再起動で負荷や使用量が下がるため、停止前も正常だったとは言えません。次回は起動直後から記録し、再現するまでの時間と信頼性履歴を残します。PC全体の停止を繰り返す場合は無理に再現させず相談してください。',
    },
  ],
  related: [
    'stutter-fix',
    'pc-game-crash',
    'verify-steam-files',
    'vram-shortage',
    'gpu-driver-update',
    'pc-shuts-down-while-gaming',
    'bsod-while-gaming',
  ],
  sources: [
    {
      label: 'Microsoft：タスクマネージャーの起動とシステム構成ツール',
      url: 'https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows',
    },
    {
      label: 'Microsoft：コミット済みメモリ・上限とページファイル',
      url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/introduction-to-the-page-file',
    },
    {
      label: 'Microsoft：タスクマネージャーのGPU温度表示と対応条件',
      url: 'https://blogs.windows.com/windows-insider/2019/08/16/announcing-windows-10-insider-preview-build-18963/',
    },
    {
      label: 'AMD：温度・使用量の確認とパフォーマンス記録',
      url: 'https://www.amd.com/en/resources/support-articles/faqs/DH3-038.html',
    },
    {
      label: 'Intel：CPUごとに異なる温度上限と温度制御',
      url: 'https://www.intel.com/content/www/us/en/support/articles/000005597/processors.html',
    },
    {
      label: 'HWiNFO：CPU・GPUのセンサー監視機能',
      url: 'https://www.hwinfo.com/about-software/',
    },
    {
      label: 'Dell：信頼性履歴からソフトウェアの問題を調べる',
      url: 'https://www.dell.com/support/kbdoc/en-us/000178177/how-to-use-windows-reliability-monitor-to-identify-software-issues',
    },
    {
      label: 'Steam：ゲームファイルの整合性確認',
      url: 'https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB',
    },
  ],
};
