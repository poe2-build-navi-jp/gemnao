import type { CommonGuide } from './common-guides';

export const powerShutdownGuide: CommonGuide = {
  slug: 'pc-shuts-down-while-gaming',
  title: 'ゲーム中にPCの電源が落ちる・勝手に再起動する時の調べ方',
  shortTitle: 'ゲーム中に電源が落ちる',
  description:
    'ゲーム中にPCが突然切れる、勝手に再起動する時の確認手順。電源断・再起動・停止コードの違い、Kernel-Power 41の読み方、CPU・GPU温度の調べ方、安全にできる確認と点検依頼の目安を解説します。',
  conclusion:
    'まず「切れたまま」「操作せずに再起動」「停止コードを表示」「ゲームだけ終了」のどれかを記録します。焦げた臭い・煙・火花・筐体の変形があれば使用を止めて点検を依頼。異常が見えない場合は発生時刻とイベント記録を照合し、直前の温度・冷却・外部の電源接続を安全に確認します。Kernel-Power 41だけで電源ユニットの故障とは判断できません。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    'CPU・GPUなどの冷却不足や高負荷時の温度上昇',
    '電源ケーブル・ACアダプター・外部電源の接続やPC内部の故障',
    '停止コードを伴うWindows・ドライバー・ハードウェアの問題',
    '変更したオーバークロック・アンダーボルトなどの設定',
  ],
  steps: [
    {
      title: '電源断・再起動・停止コードを分ける',
      actions: [
        '画面が突然消えた時、PCのランプ・ファンは止まったか、何も押さずにWindowsのロゴへ戻ったか、停止コードを表示したかを記録する。ゲームだけ閉じたならPC電源ではなくゲームのクラッシュとして調べる。',
        '焦げた臭い・煙・火花・膨らみ・ケーブルやプラグの異常な熱がある場合は使用を中止し、安全に行えるなら電源から切り離してメーカーに相談する。繰り返す電源断では重要データを先にバックアップする。',
      ],
    },
    {
      title: '信頼性履歴とイベント41を時刻で照合する',
      actions: [
        'Windowsの「スタート」で「信頼性履歴の表示」を探し、発生した日の「Windowsが正しくシャットダウンされませんでした」などを記録。続けてスタートを右クリック→「イベント ビューアー」→「Windows ログ」→「システム」で発生時刻の前後と次の起動時刻を確認する。',
        '「Kernel-Power」イベント41は正常終了しなかった結果を示す。BugCheck（1001）や停止コードがあればブルースクリーン側へ進み、WHEA-Loggerやハードウェア診断の異常があればPCメーカーに相談する。41だけ、あるいはBugcheckCode 0だけでは原因を特定しない。',
      ],
    },
    {
      title: '温度・冷却・電源接続を安全に確認する',
      actions: [
        '危険な兆候がない場合に限り、PCを硬く平らな場所に置き、吸排気口がふさがれていないか、外側から見えるファンが正常に回るかを確認する。電源を切ってから外側のほこりを取り、内部や電源ユニットは開けない。',
        '対応機種ではタスク マネージャー→「パフォーマンス」→「GPU」で温度を見られる。CPU温度はPCメーカーの監視ツールなどで確認する。起動時とゲーム中の同じ場面の温度、製品名、ファンの状態を記録する。安全に再現できない場合は測定を優先せず相談する。',
        '電源ケーブルの差し込みやノートPCの純正・指定ACアダプターの型番を外側から確認する。OCやアンダーボルトを変更した人は変更前の設定を控え、メーカーの手順で標準設定に戻す。直らない電源断を繰り返して検証しない。',
      ],
    },
  ],
  faqs: [
    {
      question: 'Kernel-Power 41と出ました。電源ユニットを交換すべきですか？',
      answer:
        '41は予期しない停止後の記録で、電源部品を指名するものではありません。画面に停止コードがあったか、BugCheckの記録・WHEAの記録があるか、電源が切れたままだったかを時刻と合わせて確認します。交換の判断はPCの型番と検査結果を持って点検先に相談してください。',
    },
    {
      question: 'BugcheckCodeが0なら、ブルースクリーンではありませんか？',
      answer:
        'いいえ。Windowsが停止コードやダンプを書き込めなかった場合も0になり得ます。目で見た停止画面、イベント1001、ダンプの有無を合わせて確認し、0だけで電源断と断定しないでください。',
    },
    {
      question: 'CPUが90℃ならすぐ故障と判断できますか？',
      answer:
        '温度の許容値はCPUの型番と冷却設計で異なります。単一の数値で故障と判断せず、型番別の上限、負荷中の温度変化、ファンの動作、頻繁な停止を確認します。停止を繰り返すなら測定のためにゲームを再開せず点検を依頼します。',
    },
    {
      question: 'ゲームを軽くしたら電源が落ちなくなりました。解決ですか？',
      answer:
        '負荷が関係する手掛かりですが、冷却と電源のどちらが原因かはまだ分かりません。実施した設定、前後の温度、発生頻度を控え、設定を戻すと再発する場合やほかのゲームでも落ちる場合はPCメーカーや修理窓口へ相談します。',
    },
  ],
  related: [
    'bsod-while-gaming',
    'pc-game-freezes',
    'gpu-driver-update',
    'pc-game-crash',
  ],
  sources: [
    {
      label: 'Microsoft：Kernel-Powerイベント41、BugcheckCode 0の解釈',
      url: 'https://learn.microsoft.com/ja-jp/troubleshoot/windows-client/performance/event-id-41-restart',
    },
    {
      label: 'Microsoft：イベント ビューアーの役割と開き方',
      url: 'https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows',
    },
    {
      label: 'Microsoft：予期しない再起動と停止コードの確認',
      url: 'https://support.microsoft.com/ja-jp/windows/experience/performance-optimization/troubleshooting-windows-unexpected-restarts-and-stop-code-errors',
    },
    {
      label: 'Microsoft：タスク マネージャーのGPU温度の表示条件',
      url: 'https://blogs.windows.com/windows-insider/2019/08/16/announcing-windows-10-insider-preview-build-18963/',
    },
    {
      label: 'Intel：CPUの型番別の温度上限と温度保護',
      url: 'https://www.intel.com/content/www/us/en/support/articles/000005597/processors.html',
    },
    {
      label: 'AMD：GPU温度・接合部温度の監視',
      url: 'https://www.amd.com/en/resources/support-articles/faqs/DH3-038.html',
    },
    {
      label: 'ASUS：高温とファンの確認、機種対応の診断',
      url: 'https://www.asus.com/jp/support/faq/1015064/',
    },
    {
      label: 'Dell：温度異常と電源断を分ける点検の目安',
      url: 'https://www.dell.com/support/kbdoc/en-us/000130867/how-to-troubleshoot-a-overheating-shutdown-or-thermal-issue-on-a-dell-pc',
    },
  ],
};
