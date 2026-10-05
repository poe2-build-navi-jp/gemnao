import type { CommonGuide } from './common-guides';

export const steamInputGuide: CommonGuide = {
  slug: 'steam-input-controller',
  title: 'Steam Inputでコントローラーが反応しない時の直し方｜認識場所別に確認',
  shortTitle: 'Steam Input設定',
  description:
    'コントローラーがWindows・Steam・ゲームのどこで反応しなくなるかを判別。Steamが認識しない場合の接続確認と、Steamでは認識するのにゲームで動かない場合のゲーム別Steam Input・レイアウト・競合の確認を、期待結果つきで説明します。',
  conclusion:
    'Steamの「設定」→「コントローラ」で機器名とボタン入力を確認します。Steamに出ないなら接続・Windows側を確認。Steamでは入力できるのにゲームだけ無反応なら、対象ゲームの「プロパティ」→「コントローラ」でSteam Inputを1回だけ切り替え、ゲームを再起動して同じボタンを試します。ゲーム側がパッド非対応の場合は、ゲームパッド操作のままでは動かないため、公式の対応情報とレイアウトの入力方式も確認してください。',
  checkedAt: '2026-10-03',
  status: 'verified',
  causes: [
    'USB・Bluetooth接続や機器自体の入力がSteamまで届いていない',
    'Steamが認識していても、ゲーム別Steam Inputとゲームの入力方式が合っていない',
    'コントローラーレイアウトがゲーム非対応の入力方式に割り当てられている',
    '複数のパッド・仮想パッド・外部入力変換ツールが同じゲームへ入力している',
  ],
  steps: [
    {
      title: 'Steamが機器とボタン入力を認識するか確認する',
      advanceCheck: {
        prompt:
          'Steamに機器名とボタン反応の両方が出ていますか？ 名前だけ・未確認の場合は接続とメーカー診断へ戻ります。認識の確認だけでは、ゲームの問題が解決したことにはなりません。',
        confirmedLabel: '機器名とボタン反応を確認した → ゲーム別設定を比較',
        unresolvedLabel: '未確認・認識しない → 接続とメーカー診断を確認',
        unresolvedHref: '#input-device',
        resolvedLabel: 'ゲーム内の操作も直った',
      },
      actions: [
        'ゲームを終了し、コントローラーを1台だけ接続。「Steam」→「設定」→「コントローラ」で機器名を確認し、入力テストが使える場合はA／決定ボタンとスティックを操作。名前と入力が両方出るならゲーム側の確認へ進む。',
        '名前が出ない、またはテストが動かない場合は別のUSBポートとデータ通信できるケーブルで比べる。Bluetooth接続ならWindows「設定」→「Bluetoothとデバイス」で接続状態を確認。有線では動くなら無線側の接続を調べる。Steam Inputを切り替える前に、接続を戻す。',
      ],
    },
    {
      title: 'ゲーム別Steam Inputと入力方式を比較する',
      actions: [
        'Steamが入力を認識する場合、対象ゲームの「ライブラリ」→右クリック→「プロパティ」→「コントローラ」で現在のゲーム別設定を記録。ゲームを終了したまま「Steam Inputを有効化」に変更し、Steamから起動してタイトル画面の同じボタンを押す。設定名はSteamの表示によって異なる。',
        '反応すれば、その状態を維持する。無反応で、ゲーム自体がその機種のパッドに対応しているなら、今度はSteam Inputを「無効化」にしてゲームを再起動し、同じ操作を比較。どちらも効かない場合は、そのゲームの「コントローラーレイアウト」とストア／公式のコントローラー対応情報を確認する。',
        'ゲームパッド非対応のゲームではゲームパッド用のボタン割り当てを送っても動かない。ゲームの規約や対応範囲を確認したうえで、Steamのレイアウトでキーボード・マウス操作を割り当てられるか検討する。対応ゲームでもレイアウトのボタンが「割り当てなし」なら変更前に保存して見直す。',
      ],
    },
    {
      title: '外部変換・複数機器を外して結果を確かめる',
      actions: [
        'DS4Windowsなどの入力変換ツールを使っている場合はゲームとツールを終了し、実機1台とSteam Inputだけで再起動。1回押して1回だけ反応するか確認する。直ったら二重の入力経路が候補。外部ツールを使う必要がある場合だけ、Steam Inputを無効化した状態を別に試す。',
        'Steam側のテストは動くが対象ゲームだけ無反応なら、別のパッド対応ゲームでも同じ機器を試す。別ゲームで動けば対象ゲームの入力方式・設定を調べ、両方で動かなければSteamを通常終了して再起動し、機器の入力テストからやり直す。',
      ],
    },
  ],
  faqs: [
    {
      question: 'PS4のコントローラーなのに、SteamにXbox 360と表示されます。',
      answer:
        'DS4WindowsやInputMapperを使用中なら、Steamがツールの作る仮想Xbox 360パッドを認識している場合があります。実機名と表示名を分けて記録し、ゲームと変換ツールを終了して実機1台で再テストしてください。表示名だけでは故障や誤接続と判断できません。',
    },
    {
      question: 'メニューは操作できますが、戦闘中のボタンだけ反応しません。',
      answer:
        '場面別のアクションセットがあるゲームでは、各セットの割り当ては独立しています。メニュー用だけでなく、問題が起きる場面のセットを確認し、変更前を控えて該当ボタンだけを比較します。すべてのゲームに同じセットがあるわけではありません。',
    },
    {
      question:
        'Bluetoothでは認識しないのに、USB接続なら認識します。何を調べますか？',
      answer:
        '有線でSteamの機器名とボタンが確認できるなら、まず無線接続側を切り分けます。Windows「設定」→「Bluetoothとデバイス」で接続状態を見て、接続が切れていれば機器メーカーの手順でペアリングし直してください。ゲーム別Steam Inputは有線で動く設定を控えてから確認します。',
    },
    {
      question: 'Steamの画面はパッドで動くのに、ゲームだけ反応しないのはなぜ？',
      answer:
        'Steam画面の操作はゲームがそのボタン入力を受け取る証拠にはなりません。対象ゲームのSteam Input設定とレイアウト、ゲーム自体のパッド対応を順に確認し、変更後はゲームを再起動して同じボタンで比べてください。',
    },
    {
      question: 'Steam Inputは「有効」「無効」のどちらが正解ですか？',
      answer:
        'ゲームと機器によって変わります。変更前の値を控えたうえで「有効」でゲームを再起動して試し、ゲームがパッド入力に対応していて無反応なら「無効」でも同じボタンを比較。動いた方を選び、両方無反応ならレイアウトとゲーム側の設定を確認します。',
    },
    {
      question: 'Steam Inputを有効にしても、パッド非対応のゲームが動きません。',
      answer:
        'ゲームパッド入力を送るレイアウトでは、非対応ゲームは操作できません。Steam Inputのキーボード・マウス割り当てを利用できるかを確認し、ゲームごとの操作方法と規約に従ってください。Steam Inputの有効化だけで全ゲームがパッド対応になるわけではありません。',
    },
    {
      question: '1回押すと2回動くようになりました。',
      answer:
        '外部入力変換ツールとSteam Input、または実機と仮想コントローラーの重複を疑います。まずゲームと外部ツールを終了し、実機1台とSteam Inputだけで再起動。詳しくは「コントローラー二重入力」の記事を確認してください。',
    },
  ],
  related: [
    'controller-double-input',
    'steam-game-not-launching',
    'reset-config-file',
  ],
  sources: [
    {
      label: 'Steamworks：Steam Inputとゲーム別コントローラー設定',
      url: 'https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_players',
    },
    {
      label: 'Steamworks：ゲームパッド・キーボード・マウスの入力割り当て',
      url: 'https://partner.steamgames.com/doc/features/steam_controller/legacy_mode',
    },
    {
      label: 'Steam公式：ゲーム別Steam Inputと機種別の対応表示',
      url: 'https://store.steampowered.com/news/posts/?enddate=1701713393&feed=steam_blog',
    },
    {
      label: 'Steamサポート（Steam Controller）：入力方式と競合の確認',
      url: 'https://help.steampowered.com/ja/wizard/HelpWithGameIssue/?appid=353370&issueid=361&nodeid=9',
    },
    {
      label: 'Microsoft：WindowsのBluetooth接続の問題',
      url: 'https://support.microsoft.com/ja-jp/windows/hardware/bluetooth/fix-bluetooth-problems-in-windows',
    },
  ],
};
