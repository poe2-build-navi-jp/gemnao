import type { CommonGuide } from './common-guides';

export const steamLaunchGuide: CommonGuide = {
  slug: 'steam-game-not-launching',
  title:
    'Steamゲームが起動しない時の対処法｜プレイ無反応・一瞬で終了を切り分ける',
  shortTitle: 'Steamゲームが起動しない',
  description:
    'Steamの「プレイ」を押しても無反応、一瞬「実行中」になって戻る、エラーが出る場合を分けて対処。タスクマネージャーとWindowsの信頼性履歴で起動の痕跡を確認し、結果別に次の手順を選びます。',
  conclusion:
    '「プレイ」を押した直後にボタンが変わるか、ゲームのプロセスが現れるかを観察します。Steam全体が反応しないならSteamを通常終了してPCを再起動。ゲームのプロセスが一瞬現れて閉じるなら信頼性履歴で同時刻のエラーを確認。表示されたエラー文があるなら名前ごとの手順を先に選びます。整合性確認やMOD停止は確認結果に合わせて1つずつ試してください。',
  checkedAt: '2026-10-03',
  status: 'verified',
  causes: [
    'Steamクライアント側が応答しない、別のゲームも起動しない',
    'ゲームが起動直後に終了し、ファイル・設定・追加ソフトが影響している',
    '更新・隔離などで実行ファイルが見つからない',
    '起動中の判定、MODやオーバーレイ、ゲーム固有のランチャーとの競合',
  ],
  steps: [
    {
      title: 'プレイ直後の状態を見分ける',
      actions: [
        'このPCで一度も起動できていない場合は、先にSteamストアの対象ゲームの対応OSと最低システム要件を確認し、PCの仕様と比べる。要件を満たさない場合、再インストールや設定変更だけで動作するとは限らない。',
        'Steamのライブラリで対象ゲームを選び「プレイ」を1回押す。ボタンが「停止／実行中」に変わったか、エラーが出たか、何秒で「プレイ」に戻ったかを控える。連打せず様子を見る。',
        'Ctrl＋Shift＋Escでタスクマネージャーを開き、「プロセス」または「詳細」でゲーム名やゲームの実行ファイルが現れるかを確認。短時間で閉じると見逃すため、表示されなくても履歴を調べる。',
        '別のSteamゲームも同様に反応しないかを確認する。複数で起きる場合はSteam・Windows側、対象ゲームだけならそのゲーム側の対処を優先する。',
      ],
    },
    {
      title: '無反応ならSteamとエラー表示を確認する',
      actions: [
        '複数のゲームで「プレイ」が反応しない、Steamの操作も重い場合は、ダウンロード中やクラウド同期中でないか確認。Steamのメニューから通常終了し、Windowsの「スタート」→「電源」→「再起動」後にもう一度だけ起動する。',
        '「実行ファイルが見つかりません」なら対象ゲームのプロパティ→インストール済みファイル→ゲームファイルの整合性を確認。Windowsセキュリティの保護履歴でゲームのファイルが隔離されていないか調べ、無条件に許可しない。',
        '「アプリはすでに実行されています」なら、ほかの画面に隠れたランチャー・ゲームウィンドウやタスクマネージャーの対象プロセスを確認。保存中でなければ通常終了を試し、終了できない時はSteamとPCを再起動する。',
      ],
    },
    {
      title: '一瞬起動して閉じるなら停止履歴を調べる',
      actions: [
        'ゲームが閉じた時刻を控え、Windowsキー＋R→perfmon /relで信頼性の履歴を開く。対象ゲーム名の「動作が停止しました」などが同時刻にあるか確認する。見つからなければイベントビューアー→Windows ログ→アプリケーションも調べる。',
        '対象ゲームの停止記録があるなら、別記事の「クラッシュ・強制終了」の分岐へ進み、エラー名・MOD・オーバーレイを1項目ずつ確認。DirectXやVisual C++のDLL名が表示されたら、それぞれの専用記事へ進む。',
        'ゲームの停止記録がなくてもゲーム側の問題を否定できない。起動したランチャーや別の実行ファイル名の記録、Windowsセキュリティの保護履歴を確認し、ゲーム固有の公式サポートも照合する。',
      ],
    },
    {
      title: '試した結果から次の行動を決める',
      actions: [
        '対象ゲームだけが起動せず、整合性確認後に起動するなら不足・変更のあったファイルが戻った可能性がある。MODを使っていた場合は導入記録を確認し、MOD必須セーブを上書きせずに原因を特定する。',
        'MODやオーバーレイの一方を止めた時だけ起動するなら、もう片方を同時に変更せず、そのツールの更新・対応状況を調べる。変化がなければ設定を戻す。',
        '直らなければゲーム名・版、エラー全文、Steamのボタンの変化、別ゲームでの再現、履歴の時刻・アプリ名、実施した1項目ずつを控えて、ゲームまたはSteamの公式サポートに相談する。',
      ],
    },
  ],
  faqs: [
    {
      question: 'Steamで買ったのにEA appのログイン画面が出ます。異常ですか？',
      answer:
        '一部のEAゲームはSteam版でもEA appが必要です。対象ゲームのSteamストアの第三者DRM・外部アプリの条件を確認してください。ログインや認証で止まる場合は、そのランチャー名とエラー文を控えて公式ヘルプへ進み、原因が分からないままアカウント連携を解除しないでください。',
    },
    {
      question:
        '「プレイ」が一瞬「停止」になって元に戻ります。何が分かりますか？',
      answer:
        'Steamが起動処理を始めた手掛かりですが、ゲーム本体がどこまで起動したかは確定しません。タスクマネージャーにゲーム名が現れるか、同時刻にWindowsの信頼性履歴へ停止が残るかを調べてください。',
    },
    {
      question:
        'タスクマネージャーにゲーム名が出ません。起動していない証拠ですか？',
      answer:
        'いいえ。数秒以内に閉じると見逃します。プレイを押した時刻を控え、信頼性履歴とイベントビューアーでゲームやランチャーの停止を探します。記録がなければSteam側の反応やゲーム公式の既知問題も確認します。',
    },
    {
      question:
        '「実行ファイルが見つかりません」と出たら、別サイトからexeを入れていいですか？',
      answer:
        '入れないでください。Steamのゲームファイル整合性確認と、Windowsセキュリティの保護履歴を確認します。隔離された場合は出所と理由を確かめ、無条件に保護を無効化・許可しないでください。',
    },
    {
      question: '整合性確認でファイルが再取得されても起動しません。次は？',
      answer:
        'Steamでの再取得だけで原因は確定しません。起動した後に閉じるならWindowsの停止履歴とエラー全文を確認し、MODや追加ソフトの有無に合わせて次の記事へ進んでください。別のSteamゲームも起動しないならクライアントやWindows側も調べます。',
    },
    {
      question: 'エラー表示がなく、ウィンドウだけ黒いままならどの記事ですか？',
      answer:
        'ウィンドウが残り、ゲームのプロセスが続いているなら「黒い画面」の記事で、画面モードと表示先を確認してください。プロセスが閉じてデスクトップに戻るなら「クラッシュ・強制終了」の記事です。',
    },
  ],
  related: [
    'pc-game-crash',
    'black-screen',
    'verify-steam-files',
    'remove-mods-safely',
    'directx-error',
    'visual-c-runtime-error',
  ],
  sources: [
    {
      label: 'EA公式：Steam版でEA appが必要な条件とlink2eaエラー',
      url: 'https://help.ea.com/en/articles/platforms/download-and-play-ea-app-games/',
    },
    {
      label: 'Steamサポート：起動準備後にゲームが動かない場合',
      url: 'https://help.steampowered.com/ja/faqs/view/5814-D9A3-BE42-62DF',
    },
    {
      label: 'Steamサポート：実行ファイルが見つからない場合',
      url: 'https://help.steampowered.com/ja/faqs/view/3A2A-BF2D-15FF-7963',
    },
    {
      label: 'Steamサポート：アプリはすでに実行中と表示される場合',
      url: 'https://help.steampowered.com/ja/faqs/view/7CFE-6339-CEA8-DC13',
    },
    {
      label: 'Steamサポート：ゲームファイルの整合性確認',
      url: 'https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB',
    },
    {
      label: 'Microsoft：タスクマネージャーとイベントビューアー',
      url: 'https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows',
    },
    {
      label: 'Microsoft：Windowsセキュリティの保護履歴',
      url: 'https://support.microsoft.com/ja-jp/windows/security/windows-security/protection-history-in-the-windows-security-app',
    },
    {
      label: 'Dell：信頼性履歴でソフトウェアの問題を調べる',
      url: 'https://www.dell.com/support/kbdoc/en-us/000178177/how-to-use-windows-reliability-monitor-to-identify-software-issues',
    },
  ],
};
