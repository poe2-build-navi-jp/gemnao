import type { CommonGuide } from './common-guides';

export const controllerDoubleInputGuide: CommonGuide = {
  slug: 'controller-double-input',
  title:
    'コントローラーが二重入力する時の直し方｜Steam Input・仮想パッドの見分け方',
  shortTitle: 'コントローラー二重入力',
  description:
    'PCゲームでボタンを1回押したのにメニューが2つ進む、2Pが参加する時の切り分け。Windowsで実機と仮想パッドを見分け、外部変換ツールとSteam Inputを1つずつ切り替えた結果から、ゲームに届く入力経路を判断します。',
  conclusion:
    'まず対象ゲームのタイトル画面で、同じ方向ボタンを1回だけ押し、メニューが何項目動いたか記録します。DS4Windowsなどを使っていればゲームを終了してツールを停止し、実機1台とSteam Inputだけで再起動して同じ操作を比較。1項目だけ動くようになれば、外部ツールが作る仮想パッドと実機の入力が重なった可能性があります。変わらない場合はSteam Inputをゲームごとに切り替え、結果から次の確認先を選びます。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    '外部変換ツールが実機に加えて仮想パッドを作り、ゲームが両方を読む',
    'Steam Inputと外部変換ツールなど、複数の入力経路が同時に有効',
    '実機・仮想パッド以外にも別のゲームパッドや配信ソフトの仮想機器が接続中',
    '同じボタンに複数の操作が割り当てられ、特定のゲームでだけ二重に反応',
  ],
  steps: [
    {
      title: '1回押した結果と実機・仮想パッドを記録する',
      actions: [
        'ゲームのタイトル画面など、同じ項目数を確認できるメニューで、方向ボタンを押してすぐ離す。1回押しただけで1項目／2項目／無反応のどれかを記録する。長押しによるキーリピートと混同しない。',
        'ゲームを終了し、Windowsキー＋R→joy.cplで「ゲーム コントローラー」一覧を開く。DS4Windowsなどを使う場合、実機（例：Wireless Controller）と仮想機器（例：Xbox 360 Controller）が並ぶことがある。名前だけで決めず、ツールを停止して消える方を確認する。',
        '実機のパッドをゲームから隠す設定（HidHideなど）を使っている場合は一覧に両方出るとは限らない。機器を削除・ドライバーを無効化せず、変換ツールの「接続中」「出力」表示と停止前後を照合する。',
      ],
    },
    {
      title: '外部ツールを停止しSteam Inputだけで比較する',
      actions: [
        'ゲームを終了してDS4Windowsなどの入力変換ツールを通常終了し、バックグラウンドで動いていないか通知領域とタスクマネージャーで確認。外部ツールを使用していなければこの停止操作は飛ばす。',
        'Steamの「設定」→「コントローラ」で実機の認識と入力を確認し、対象ゲームのライブラリ→「プロパティ」→「コントローラ」で現在値を控える。Steam Inputを有効にしてSteamからゲームを起動し、同じボタンを1回だけ押す。',
        '2項目→1項目なら外部ツール経由の入力が重なっていた可能性が高い。2項目のままなら外部ツールだけが原因とは決めず、別のパッドやゲーム側の割り当てを確認。無反応になれば、そのツールがゲームに必要な入力を作っていた可能性がある。',
      ],
    },
    {
      title: '残る場合だけSteam Inputかゲーム側を確認する',
      actions: [
        '外部ツールを止めたまま二重入力する場合は、ゲームを終了し、対象ゲームの「プロパティ」→「コントローラ」でSteam Inputを無効化して再起動。同じボタンが1回だけ反応するか比べる。ゲームが実機の入力に対応していなければ無反応になるため、その場合は元へ戻す。',
        '外部ツールを使う必要がある場合は、今度はゲームを終了してSteam Inputを無効にし、外部ツールだけで起動して比較。2系統を同時に変更・起動しない。HidHideを既に使用中なら専用の案内で実機と仮想機器の表示先を確認し、推測で隠す対象を追加しない。',
        'どの組み合わせでも特定のゲームだけ二重なら、そのゲーム内とSteamの「コントローラーレイアウト」に同じ操作の重複割り当てがないか確認。別ゲームでも同じなら、接続中の別パッド・仮想機器とツールの自動起動を調べる。',
      ],
    },
  ],
  faqs: [
    {
      question:
        'joy.cplに「Wireless Controller」と「Xbox 360 Controller」が出ます。どちらが実機ですか？',
      answer:
        'DS4WindowsでXbox型の仮想パッドを出している場合は、Wireless Controllerが実機、Xbox 360 Controllerが仮想パッドの例があります。ただし名称だけで確定できません。ゲームを終了して外部ツールを通常停止し、一覧から消える方とツールの出力表示を照合してください。',
    },
    {
      question: '一覧にパッドが2台あれば、必ず二重入力していますか？',
      answer:
        'いいえ。Windowsに2台見えても、ゲームがどちらを受け取るかは別です。ゲームの同じメニューで短く1回押し、外部ツールを止めた前後で2項目→1項目になるか比べてください。HidHide利用時は一覧が実際の機器構成と一致しないこともあります。',
    },
    {
      question: '外部ツールを終了したらコントローラーが無反応になりました。',
      answer:
        '外部ツールがそのゲーム向けの入力を作っていた可能性があります。Steamの「設定」→「コントローラ」で実機の入力が届いているかを確認し、ゲーム側の対応機種とSteam Input設定を比較。外部ツールを使う場合はSteam Inputを無効にした条件を別に試し、変更前に戻せるよう記録します。',
    },
    {
      question: 'HidHideで実機を隠せば必ず直りますか？',
      answer:
        'DS4Windows側の資料では、外部ツールを使う構成で実機をゲームから隠し仮想パッドだけを見せる方法が案内されています。ただし隠す機器や許可するアプリを誤ると入力が届きません。外部ツールなしで動くなら追加設定は不要です。使う必要がある場合だけ、利用中のツールの手順を確認してください。',
    },
    {
      question: 'メニューが2つ進むのは、ボタンの長押しが原因では？',
      answer:
        '長押しの連続入力は二重入力と症状が似ています。画面の同じ場所でボタンを短く1回押してすぐ離す試験を数回行い、毎回2項目ずつ進むかを記録します。特定のボタンだけなら、Steamとゲーム内のボタン割り当ても確認してください。',
    },
  ],
  related: [
    'steam-input-controller',
    'steam-game-not-launching',
    'reset-config-file',
  ],
  sources: [
    {
      label: 'DS4Windows Docs：実機と仮想パッドが重なる仕組み・HidHide',
      url: 'https://kanuan.github.io/DS4WSite/guides/solving-double-input/',
    },
    {
      label: 'Microsoft：joy.cplでゲームコントローラー一覧を開く',
      url: 'https://support.microsoft.com/en-us/topic/how-to-run-control-panel-tools-by-typing-a-command-bce95b4d-e8c2-1cd0-ee0d-027679d520a6',
    },
    {
      label: 'Steamサポート：競合する入力ソフト・複数機器の確認',
      url: 'https://help.steampowered.com/ja/wizard/HelpWithGameIssue/?appid=353370&issueid=361&nodeid=9',
    },
    {
      label: 'Steamworks：Steam Inputのゲーム別設定',
      url: 'https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_players',
    },
  ],
};
