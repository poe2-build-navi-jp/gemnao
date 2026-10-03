import type { GameArticle } from '@/lib/game-articles';

// Official-source synthesis checked on 2026-10-03, not a hands-on test.
// Keep source URLs, step IDs and safety boundaries aligned in all languages.
export const rocketLeagueSourceUrls = {
  epicDualSense:
    'https://www.epicgames.com/help/c-37599050/c-42869540/a15512450',
  sonyFirmware:
    'https://controller.dl.playstation.net/controller/lang/en/2100004.html',
  sonyConnection:
    'https://www.playstation.com/en-us/support/hardware/pair-dualsense-controller-bluetooth/',
  windowsControllers:
    'https://support.microsoft.com/en-us/servicing/os/windows/2017/01/how-to-run-control-panel-tools-by-typing-a-command',
  steamInput:
    'https://steamcommunity.com/games/593110/announcements/detail/3823053915988527062',
  liveIssues:
    'https://www.epicgames.com/help/c-37599050/c-Trending_0/rocket-league-live-issues-and-system-status-a19449274',
  sonySupport:
    'https://www.playstation.com/en-us/support/hardware/accessories/?category=dualsense-wireless-controller&subCategory=connect',
  bugReport: 'https://www.epicgames.com/help/c-37599050/a12186875',
};

const steps: GameArticle['steps'] = [
  {
    id: 'identify-environment',
    title: 'DualSenseかどうかと、起動方法・症状を記録する',
    summary:
      '同じ「反応しない」でも、PCへの接続、ゲーム内の入力、2Pへの参加では確認先が違います。',
    time: '約2分',
    risk: 'low',
    actions: [
      '対象は通常のDualSense（PS5コントローラー）です。DualShock 4、Xbox、Switch Pro、DualSense Edgeなどの別機種へ、この機種専用の案内をそのまま適用しないでください。',
      'Epic Games Launcherから直接起動しているか、Steamライブラリから起動しているかを確認し、USB／Bluetoothと、最後に正常だった日時を控える。Epic版をSteam経由で起動する追加設定がある場合も記録する。',
      '無反応、メニューだけ動く、1回押すと2回動く、2Pとして参加する、のどれかを記録。アップデート直後ならゲーム・Windows・コントローラーのどれを更新したかも分ける。',
    ],
    note: '2Pを操作できる場合は「入力が一切届いていない」状態とは異なります。PC側で未認識と決めつけてドライバーを削除しないでください。',
  },
  {
    id: 'check-connection',
    title: 'ゲームの外で認識と入力を確認する',
    summary:
      'ゲーム設定を変える前に、PCに機器とボタン入力が届くかを確かめます。',
    time: '約3分',
    risk: 'low',
    actions: [
      'ゲームを終了し、Windows＋Rで「joy.cpl」を開く。コントローラー一覧に機器があるかを確認し、プロパティにテスト画面があればボタンとスティックの反応を見る。表示名だけで実機か仮想機器かを決めない。',
      '一覧にない場合は、データ通信できるUSBケーブルと別のUSBポートで比較。BluetoothならPCとの接続状態を確認し、必要ならSonyのPC接続手順でペアリングする。充電ランプが点灯するだけでは、入力が届く証拠にならない。',
      'USBだけで入力できれば無線接続側を、PC側の入力テストでは動くのにRocket Leagueだけ動かなければゲームへの入力経路を次に調べる。テスト画面が使えない場合は、既に使っている対応ゲームで同じボタンを比較する。',
    ],
    note: 'これは切り分けのための比較です。USBで直ったことだけで、Bluetoothが一律に非対応だとは判断しません。機器を隠す設定や入力変換ツールを使っている場合は、その有無も記録してください。',
  },
  {
    id: 'update-dualsense',
    title: 'Sony公式アプリでファームウェアを確認する',
    summary:
      'EpicのDualSense専用案内は、まずコントローラーのソフトウェア更新を確認するよう案内しています。',
    time: '約5〜10分',
    risk: 'medium',
    actions: [
      '出典のSony公式ページから「PlayStation Accessories」を開く。公式の動作条件はWindows 10（64bit）またはWindows 11、空き容量250MB以上、画面解像度1280×800以上です。未導入なら条件を満たすPCへ公式配布元からインストールする。非公式のドライバー更新ツールは不要です。',
      'DualSenseを接続し、アプリに表示される現在のファームウェアを控える。更新が表示された場合だけ、画面の案内に従って完了させる。最新と表示されているなら再インストールせず次へ進む。',
      '更新中はPCの電源を切らず、コントローラーを切断しない。更新完了後にアプリを終了する。',
    ],
    note: 'ファームウェア更新は設定の切り替えと違い、簡単に元へ戻せる操作ではありません。接続不良で更新が完了しない時は抜き差しを繰り返さず、Sonyの案内を確認してください。',
  },
  {
    id: 'restart-reconnect',
    title: '切断・PC再起動・再接続のあと、同じ操作で比較する',
    summary:
      'Epicの公式手順はEpic版とSteam版の両方が対象で、再接続はUSBでもBluetoothでも案内されています。',
    time: '約3〜5分',
    risk: 'low',
    actions: [
      'ゲームを終了した状態でDualSenseを切断し、PCを再起動する。起動後にコントローラーを接続し、接続ができたことを確認してから、普段のランチャーでRocket Leagueを起動する。',
      'メニューで方向ボタンを短く1回押す。続いてフリープレイなど対戦に影響しない場面で、移動とジャンプを確認する。メニューの反応だけで試合中も解決したとは判断しない。',
      '2P参加や二重入力が残る場合は、比較条件を整理するためゲームを終了し、余分なゲームパッドだけを外して実機1台で再試行する。入力変換ツールを自分で使用中なら、設定を記録して通常終了した条件も別に比較し、悪化したら元へ戻す。',
    ],
    note: '最後の1台での比較は編集部の切り分け手順で、2P問題に対する公式の万能修正ではありません。キーボード・マウス、外付けドライブ、必要な支援機器まで外す必要はありません。',
  },
  {
    id: 'steam-input',
    title: 'Steam版だけ、ゲーム別Steam Inputを1項目ずつ比較する',
    summary:
      'PCで入力が確認でき、公式の再接続後もSteam版だけ無反応なら、この分岐を使います。',
    time: '約3〜5分',
    risk: 'low',
    actions: [
      'Epic Games Launcherから直接起動している場合はこのSTEPを飛ばす。修復のためだけにEpic版をSteamへ追加したり、新しい変換ソフトを導入したりしない。',
      'SteamライブラリでRocket Leagueを選び、プレイ欄近くのコントローラー設定を開く。ゲーム別のSteam Input設定を控え、有効なら無効、無効なら有効を1回ずつ比較する。既定値の場合も、元の値へ戻せるよう記録してから比較する。項目の表記や位置はSteamの版で異なります。',
      '変更のたびにゲームを終了・再起動し、同じメニュー操作とフリープレイで確認する。無反応や二重入力が悪化したら元へ戻し、両方で変わらなければ設定を増やさず次へ進む。',
    ],
    note: 'Steamの機種別・ゲーム別入力設定を使う診断です。「有効」「無効」のどちらかがRocket Leagueの全環境で正解だと保証するものではありません。',
  },
  {
    id: 'report-result',
    title: '更新直後の不具合と機器側の問題を分けて相談する',
    summary:
      '結果をまとめれば、同じ設定変更を繰り返すより次の調査につながります。',
    time: '約5分',
    risk: 'low',
    actions: [
      'ランチャー、DualSenseの機種、USB／Bluetooth、ファームウェア、Windowsのバージョン、最終正常日時、各STEPの結果をまとめる。ゲームだけの不具合か、別ゲームやPCの入力テストでも再現するかを明記する。',
      'ゲーム更新後にだけ発生する場合は、出典の「Rocket Leagueの既知の問題・稼働状況」から公式の不具合案内を確認する。更新の直後というだけで、その更新やアンチチートが原因だとは断定しない。',
      '公式のDualSense手順で直らない場合は、Epicの案内先であるPlayStationコントローラーサポートへ。Rocket Leagueだけで再現する場合、Epicの不具合報告案内は公開のReddit／Xへ誘導します。最初は個人情報を含まない症状と比較結果だけを投稿し、公開投稿へログや未加工の画像・動画を載せない。画像が必要なら原本を残し、手元のコピー上で氏名・メール・アカウントIDなどを不透明な塗りつぶしで隠す。認証情報は送らない。',
    ],
    note: 'この記事は公式資料を整理したもので、編集部が同じPC・機器で修復を実証したものではありません。最新の公式案内に変更があれば、そちらを優先してください。',
  },
];

export const rocketLeagueArticles: GameArticle[] = [
  {
    gameSlug: 'rocket-league',
    slug: 'dualsense-not-working',
    category: 'controller',
    title:
      'Rocket LeagueでPS5コントローラーが反応しない時の対処法【PC・DualSense】',
    shortTitle: 'DualSenseが反応しない',
    symptom:
      'Windows版Rocket Leagueで、通常のDualSenseが認識されない、ゲームだけ無反応、2Pになる場合の切り分けです。Epic Games Launcher版とSteam版を分けて案内します。',
    conclusion:
      'DualSenseのソフトウェアを確認し、ゲームを終了してコントローラーを切断、PCを再起動して再接続します。PC側でも入力できなければ接続を、PCでは動くのにSteam版だけ無反応ならゲーム別Steam Inputを確認。毎回同じ操作で比較し、改善しない設定変更は元へ戻します。',
    description:
      'Epic・Sony・Microsoft・Valveの一次情報をもとにしたガイドです。接続の比較や結果の判定は編集部の診断手順で、実機検証済みの修復例や成功率を示すものではありません。',
    checkedAt: '2026-10-03',
    status: 'verified',
    targetVersion:
      'Windows PC・通常のDualSense・Epic Games Launcher版／Steam版',
    quickFacts: [
      { label: '対象機種', value: '通常のDualSense（PS5コントローラー）' },
      { label: 'Windowsの機器一覧', value: 'joy.cpl', copy: true },
      { label: '更新用アプリ', value: 'Sony公式のPlayStation Accessories' },
      {
        label: '接続方式',
        value: 'EpicのDualSense専用案内はUSB・Bluetoothの両方を記載',
      },
    ],
    diagnosis: [
      {
        symptom: 'PC側でも機器・ボタン入力を確認できない',
        cause: 'ゲームの設定より接続経路を先に確認',
        stepId: 'check-connection',
      },
      {
        symptom: 'DualSenseがEpic版・Steam版で反応しない',
        cause: '公式の機器ソフトウェア確認から始める',
        stepId: 'update-dualsense',
      },
      {
        symptom: '2Pになる／1回押すと2回動く',
        cause: '未認識とは分け、実機1台の条件で比較',
        stepId: 'restart-reconnect',
      },
      {
        symptom: 'PCでは入力でき、Steam版だけ無反応',
        cause: 'Steamからゲームへ渡す入力設定を比較',
        stepId: 'steam-input',
      },
      {
        symptom: '更新直後にだけ発生し、比較しても残る',
        cause: '発生条件を保存し、公式の既知の問題を確認',
        stepId: 'report-result',
      },
    ],
    symptoms: steps.map((step) => ({ label: step.title, target: step.id })),
    steps,
    avoid: [
      '入力不良だけを理由にセーブや設定フォルダーを削除しない。',
      'アンチチートやセキュリティ保護を無効にしたり、非公式DLL・ドライバー更新ツールを導入したりしない。',
      '別機種・古いSteam専用の案内から「Bluetoothはすべて非対応」と一般化しない。',
      'ファームウェア更新中に電源を切ったり、接続を抜いたりしない。',
    ],
    cautions: [
      '変更は1つずつ。設定値と結果を残し、改善しない設定変更は元へ戻してください。',
      '対戦中ではなくメニューとフリープレイで確認してください。所要時間は目安です。',
    ],
    faqs: [
      {
        question: 'BluetoothのDualSenseは使えないのですか？',
        answer:
          '一律に使えないとはいえません。現在のEpicのDualSense専用案内とSonyのPC接続案内は、どちらもUSBとBluetoothを扱っています。USBで動き無線だけ失敗するなら、まずPCとの無線接続を切り分けます。',
      },
      {
        question:
          'PlayStation Accessoriesに表示されれば、ゲームでも入力できていますか？',
        answer:
          '機器が表示されることと、Rocket Leagueがボタン入力を受け取ることは別です。PCの入力確認、ゲームのメニュー、フリープレイを順番に比較してください。',
      },
      {
        question: 'Epic版でもSteam Inputを変更する必要がありますか？',
        answer:
          'Epic Games Launcherから直接起動しているなら、このガイドのSteam分岐は不要です。既にSteam経由で起動する構成ならその事実を記録し、通常のEpic起動と混同しないでください。',
      },
      {
        question:
          '更新後に動かなくなったのでアンチチートを止めてもよいですか？',
        answer:
          'この記事では無効化を案内しません。更新と症状の前後関係だけでは原因は分からないため、最終正常日時、更新内容、接続ごとの結果を記録して公式の不具合案内と照合してください。',
      },
    ],
    sources: [
      {
        label: 'Epic公式：PC版Rocket LeagueでDualSenseが動かない場合（英語）',
        url: rocketLeagueSourceUrls.epicDualSense,
      },
      {
        label: 'Sony公式：PlayStation Accessoriesとファームウェア更新（英語）',
        url: rocketLeagueSourceUrls.sonyFirmware,
      },
      {
        label: 'Sony公式：DualSenseのPC接続・USB・Bluetooth（英語）',
        url: rocketLeagueSourceUrls.sonyConnection,
      },
      {
        label: 'Microsoft公式：joy.cplでコントローラー設定を開く（英語）',
        url: rocketLeagueSourceUrls.windowsControllers,
      },
      {
        label:
          'Valve公式：ゲーム別Steam Inputと機種別対応表示（2023年11月の案内・英語）',
        url: rocketLeagueSourceUrls.steamInput,
      },
      {
        label: 'Epic公式：Rocket Leagueの既知の問題・稼働状況（英語）',
        url: rocketLeagueSourceUrls.liveIssues,
      },
      {
        label: 'Sony公式：PlayStationコントローラーサポート（英語）',
        url: rocketLeagueSourceUrls.sonySupport,
      },
      {
        label: 'Epic公式：公開SNSでRocket Leagueの不具合を報告する方法（英語）',
        url: rocketLeagueSourceUrls.bugReport,
      },
    ],
    related: [],
    seoTitle:
      'Rocket LeagueでPS5コントローラーが反応しない｜PC・DualSenseの対処法',
    metaDescription:
      'Rocket LeagueでDualSenseが反応しない時は、機器の認識・公式ファームウェア・再接続を順に確認。Epic版とSteam版、USBとBluetooth、2Pや更新後だけの症状を分けて案内します。',
    ogTitle: 'Rocket LeagueでDualSenseが反応しない',
    ogSteps: ['接続と入力を確認', 'Sony公式で更新', '再起動して比較'],
  },
];
