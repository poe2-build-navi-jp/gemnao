import type { CommonGuide } from './common-guides';

export const crashGuide: CommonGuide = {
  slug: 'pc-game-crash',
  title: 'PCゲームが落ちる・強制終了する時の対処法｜タイミング別の原因確認',
  shortTitle: 'ゲームが落ちる・強制終了',
  description:
    'PCゲームがデスクトップに戻る時の切り分け方。起動直後・ロード中・長時間プレイ後で確認先を分け、エラー表示がない場合のWindowsの信頼性履歴・イベントビューアーの見方と比較方法を解説します。',
  conclusion:
    'まず「ゲームだけ閉じた／PCが再起動した」を分け、落ちた時刻とタイミングを記録します。起動直後はMOD・オーバーレイ、ロード中はセーブを保全してファイルと特定場面、長時間後はメモリ・VRAM・温度の変化を優先して確認。エラー表示がなくても信頼性履歴とイベントビューアーで同時刻のゲーム名を照合し、変更は1項目ずつ試してください。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    '起動直後：MOD・外部ツール・オーバーレイ・設定の競合',
    'ロード中：特定セーブ・追加データ・ゲームファイルの問題',
    '長時間後：RAM・VRAMの余裕不足、温度やドライバーの不安定さ',
    '複数ゲームで再現：ゲーム以外のPC環境も含めて確認が必要',
  ],
  steps: [
    {
      title: '落ち方と発生時刻を記録する',
      actions: [
        '画面がデスクトップへ戻った時刻、起動直後／ロード中／プレイ開始から何分後か、同じ操作で再現するかを控える。PCの電源断・自動再起動・青い画面は別記事で調べる。',
        '下のWindows履歴の手順で、同時刻の対象ゲームの停止記録を確認する。エラー文がない場合も「記録なし」と残す。記録中のモジュール名だけで原因を断定しない。',
      ],
    },
    {
      title: '発生タイミングに合う1項目を試す',
      actions: [
        '起動直後ならMOD管理ツールでMODを無効化し、次はSteamの対象ゲームの「プロパティ」→「一般」でSteamオーバーレイをオフにして別々に比較。MODが必要なセーブは上書きしない。',
        'ロード中なら先にセーブをコピーし、別のセーブ／新規ゲームでも落ちるか確認。Steam利用時は「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」。MODで変更したファイルが戻る可能性に注意する。',
        '長時間後なら同じ場面でタスクマネージャーのメモリと専用GPUメモリを比べる。余裕が減るなら不要アプリを通常終了、VRAMが逼迫するならテクスチャを1段階下げる。温度上昇も伴うなら冷却と通気を確認する。',
      ],
    },
    {
      title: '同じ条件で結果を比べ、次へ進む',
      actions: [
        '変更前後で同じセーブ・同じ場面・同程度の時間を比較し、「落ちた時刻／経過時間／試した1項目」を記録。改善しなければその設定を戻し、次の候補に進む。',
        '1ゲームだけで改善せず、更新直後から発生した場合はGPUドライバーの版と変更日を照合。複数ゲームでも落ちるならPC全体の履歴とメーカーの診断も確認し、ゲームの再インストールだけを繰り返さない。',
      ],
    },
  ],
  faqs: [
    {
      question: '何も表示されずデスクトップに戻ります。どこから調べますか？',
      answer:
        '落ちた時刻を控え、Windowsの検索から「信頼性の履歴」を開いて同時刻のゲーム名を探します。見つからない場合はイベントビューアーの「Windows ログ」→「アプリケーション」を確認。記録がなくても、起動直後／ロード中／長時間後のどれかで試す項目を選べます。',
    },
    {
      question:
        'イベントにKERNELBASE.dllが出たら、そのDLLを入れ直すべきですか？',
      answer:
        'いいえ。障害モジュールは障害が記録された場所を示す手掛かりで、単独で破損や故障の証拠にはなりません。対象ゲーム名・時刻・再現条件と、ゲーム側の公式案内を照合してください。DLLを配布サイトから取得しないでください。',
    },
    {
      question: 'ロード画面でだけ落ちます。セーブを消してよいですか？',
      answer:
        '削除せず、ゲームを終了してセーブを別の場所へコピーします。別スロットや新規ゲームでも落ちるか比較し、Steam版ならファイル整合性を確認。特定セーブだけならゲームの公式サポートにその状況を伝えます。',
    },
    {
      question: '起動して1時間ほどで落ちます。温度が原因ですか？',
      answer:
        '時間だけでは断定できません。落ちる前後のメモリと専用GPUメモリの余裕、温度の変化を確認し、不要アプリを終了するなど1項目ずつ比較します。複数ゲームや通常の操作でも落ちる場合はPCメーカーにも相談してください。',
    },
  ],
  related: [
    'pc-game-freezes',
    'pc-shuts-down-while-gaming',
    'bsod-while-gaming',
    'save-data-backup',
    'verify-steam-files',
    'gpu-driver-update',
    'vram-shortage',
  ],
  sources: [
    {
      label: 'Microsoft：イベントビューアーで日時・イベントの詳細を調べる',
      url: 'https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows',
    },
    {
      label: 'Microsoft Learn：アプリケーションの停止とイベント1000・1001',
      url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-application-service-crashing-behavior',
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
