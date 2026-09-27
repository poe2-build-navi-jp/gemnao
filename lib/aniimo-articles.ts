import type { GameArticle } from '@/lib/game-articles';

const checkedAt = '2026-09-17';
const targetVersion = 'PC版・正式サービス開始直後（2026年9月17日時点）';
const officialNews = {
  label: 'Aniimo公式ニュース',
  url: 'https://www.aniimo.com/newslist',
};
const steamStore = {
  label: 'Aniimo Steamストア',
  url: 'https://store.steampowered.com/app/4126040/Aniimo/',
};
const pcLaunchFaq = {
  label: 'Aniimo公式FAQ：PC版の起動・ワンクリック修復・エラー表示',
  url: 'https://aniimo.com/ja/newslist/detail/100091',
};
const steamVerifyGuide = {
  label: 'Steam公式サポート：ゲームファイルの整合性を確認する方法',
  url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
};
const windowsEventViewer = {
  label: 'Microsoft公式：イベント ビューアーで日時・イベントを確認する',
  url: 'https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows',
};
const windowsProtectionHistory = {
  label: 'Microsoft公式：Windowsセキュリティの保護の履歴',
  url: 'https://support.microsoft.com/en-us/windows/security/windows-security/protection-history-in-the-windows-security-app',
};
const aniimoIntelIssue = {
  label: 'Aniimo公式：Intel第13・14世代CPUの安定性問題',
  url: 'https://aniimo.com/ja/newslist/detail/100102',
};
const aniimoRelease = {
  label: 'Aniimo公式：正式リリースと日本語サポート窓口',
  url: 'https://aniimo.com/newslist/detail/100117',
};
const windowsBlankScreen = {
  label: 'Microsoft公式：Windowsの空白・黒い画面のトラブルシューティング',
  url: 'https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/troubleshooting-blank-screens-in-windows',
};
const windowsDisplaySettings = {
  label: 'Microsoft公式：Windowsの解像度と画面のレイアウト',
  url: 'https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/change-your-screen-resolution-and-layout-in-windows',
};
const related = [
  'not-launching',
  'black-screen',
  'login-error',
  'video-memory-error',
  'launcher-display',
];

export const aniimoArticles: GameArticle[] = [
  {
    gameSlug: 'aniimo',
    slug: 'not-launching',
    category: 'launch',
    title: 'アニモ（Aniimo）が起動しない・途中で落ちるときの直し方【PC版】',
    shortTitle: '起動しない・クラッシュ',
    symptom:
      '「ゲーム開始」を押しても無反応、画面が一瞬出て閉じる、遊んでいる途中で落ちる。この3つは確認する場所が異なります。最後に正常だった地点から、下の早見表で手順を選んでください。',
    conclusion:
      'ランチャーすら開かない場合は公式FAQの権限確認、ゲームがすぐ閉じる場合は表示されたエラーとファイル修復、プレイ中だけ落ちる場合はWindowsのアプリ履歴と描画環境を確認します。修復後は同じ場面を再現して結果を比べます。',
    description:
      '公式ランチャー版とSteam版では修復する画面が違います。エラー文や履歴は原因を断定する証拠ではなく、次に何を調べるかを絞る手がかりです。',
    checkedAt: '2026-09-27',
    status: 'verified',
    targetVersion: 'Windows PC版（公式ランチャー・Steam）／2026年9月27日確認',
    quickFacts: [
      {
        label: '最初に記録',
        value:
          'ランチャー無反応／起動直後／プレイ中のどこで止まるか、エラー全文と発生時刻',
      },
      {
        label: '公式ランチャー版の修復',
        value: '右上の「設定」→「ワンクリック修復」',
      },
      {
        label: 'Steam版の修復',
        value:
          'ライブラリ→Aniimoの「プロパティ」→「インストール済みファイル」→整合性確認',
      },
      {
        label: 'PCの最低条件',
        value:
          '64ビット版Windows 10、RAM 8GB、DirectX 11、空き容量40GBなど（Steam掲載）',
      },
    ],
    causes: [
      'ランチャーの権限・更新、または起動対象の違い',
      '破損・不足ファイル、セキュリティソフトによる隔離',
      'OS・空き容量・描画環境とゲームの動作要件の不一致',
      'プレイ中にだけ再現する不具合、特定CPU環境の安定性問題',
    ],
    symptoms: [
      { label: 'ランチャー自体が無反応', target: 'launcher-no-response' },
      { label: 'ゲーム開始を押しても無反応', target: 'repair-files' },
      { label: '起動直後に落ちる', target: 'repair-files' },
      { label: 'エラーが表示される', target: 'read-error' },
      { label: 'プレイ中だけ落ちる', target: 'crash-during-play' },
      { label: '修復後も落ちる', target: 'review-after-repair' },
    ],
    diagnosis: [
      {
        symptom: 'ランチャーのアイコンを押しても画面が開かない',
        cause: 'ゲームファイルより、ランチャーの起動や権限を確認',
        stepId: 'launcher-no-response',
      },
      {
        symptom: 'ランチャーは開くが「ゲーム開始」で無反応',
        cause: '更新待ち・ファイル不整合・隔離の可能性を分ける',
        stepId: 'repair-files',
      },
      {
        symptom: 'ロゴが出てすぐ終了する／エラーなしで閉じる',
        cause: '発生時刻を控え、ファイル修復後にWindowsの履歴と比較',
        stepId: 'repair-files',
      },
      {
        symptom: '「Falied to load il2cpp」が表示される',
        cause: '公式FAQが案内する隔離・ブロック履歴を先に確認',
        stepId: 'read-error',
      },
      {
        symptom: 'Windows非対応／容量不足／ネットワークエラーが表示される',
        cause: '表示内容ごとにOS・保存先の空き・通信を確認',
        stepId: 'read-error',
      },
      {
        symptom: '遊んでいる途中で毎回落ちる',
        cause: '場所・経過時間とアプリのエラー履歴を照合',
        stepId: 'crash-during-play',
      },
      {
        symptom: '修復で再取得された／何も変わらないのに再発',
        cause: '再現テストの結果で次の確認先を選ぶ',
        stepId: 'review-after-repair',
      },
    ],
    steps: [
      {
        id: 'record-crash',
        title: '最後に動いていた地点とWindowsのエラー履歴を記録する',
        summary:
          '無反応、起動直後、プレイ中のどこで止まるかと、エラーがWindowsに残ったかを先に見ます。',
        actions: [
          '表示されたエラー文やコードをそのまま控える。表示がなければ、落ちた時刻と直前の操作（起動、ロード、戦闘など）を控える',
          'Windowsのスタートを右クリック→「イベント ビューアー」を開き、「Windowsログ」→「Application（アプリケーション）」を選ぶ',
          '発生時刻付近の「エラー」を開き、ゲームまたはランチャーに関係するアプリ名・障害が発生したモジュール名・例外コードがあれば控える',
          '同じ時刻のログが見つからなくても決めつけず、早見表から症状に合うSTEPへ進む',
        ],
        note: '「Application Error」などの履歴は調査の手がかりです。エラー名だけでGPUやWindowsの故障とは断定できません。',
      },
      {
        id: 'launcher-no-response',
        title: 'ランチャー自体が開かない場合の確認',
        summary:
          '公式ランチャーとSteamで起動する入口を確認し、権限不足を切り分けます。',
        actions: [
          '公式のお知らせでメンテナンスや更新案内を確認。ダウンロード・更新が続いていれば終了を待つ',
          'Steam版はSteamのライブラリからAniimoを起動し、Steam自体が開くか確認する。公式ランチャー版は公式配布のランチャーを使う',
          '公式ランチャーが無反応ならWindowsを再起動。なお開かなければ、公式FAQに沿ってランチャーのアイコンを右クリック→「管理者として実行」→「はい」を1回試す',
          'ランチャーが開いたなら次は「ゲーム開始」を押して結果を見る。開かなければ発生時刻とエラー履歴を控え、公式窓口 support_jp@aniimo.com へ相談する',
        ],
      },
      {
        id: 'read-error',
        title: 'エラー表示を読み、内容に合った場所だけ確認する',
        summary:
          'ゲーム固有の表示を、一般的なクラッシュと同じ手順で片付けないための確認です。',
        actions: [
          '「Falied to load il2cpp」（公式FAQの表記）の場合はWindowsの「Windows セキュリティ」→「ウイルスと脅威の防止」→「保護の履歴」を開き、Aniimoのファイルが隔離された記録を確認する',
          '隔離されたファイルが公式配布のAniimoのものと確かめられる場合のみ、セキュリティ製品の案内に従って個別に復元・許可する。不明な検出を無条件に許可しない',
          'Windowsのバージョン非対応と出た場合は「設定」→「システム」→「バージョン情報」でOSとシステムの種類を確認。最低条件は64ビット版Windows 10',
          'ディスク容量不足ならインストール先ドライブの空き容量を確認。ネットワークエラーならランチャーの通信と公式のお知らせを確認する',
        ],
        note: '音が出て白画面のまま、真っ暗な画面が続く場合は「黒画面」の関連記事へ。エラーがない場合は次のファイル修復を試します。',
      },
      {
        id: 'repair-files',
        title: '起動直後に落ちる・開始が無反応なら配布元で修復する',
        summary:
          'ランチャーの修復とSteamの整合性確認は入口が異なります。結果を見て次に進みます。',
        actions: [
          'ゲームを終了する。公式ランチャー版はランチャー右上の「設定」→「ワンクリック修復」を実行し、終了後にランチャーを再起動する',
          'Steam版はライブラリでAniimoを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」を押す',
          '修復・確認が終わるまで待ち、再取得の有無を控える。再取得されたら「ゲーム開始」を1回試し、ロゴを越えてゲーム内まで進めるか確認する',
          '再取得されない／再取得しても同じ時点で落ちるなら、次の「修復後の結果別判断」へ進む',
        ],
        note: '公式ランチャーの「ワンクリック修復」はAniimo公式FAQに掲載されています。Steamの画面操作はSteam公式サポートの案内です。',
      },
      {
        id: 'review-after-repair',
        title: '修復した後、結果に応じて次の確認先を決める',
        summary:
          '修復の成功表示とゲームが安定して動くことは別なので、同じ操作で再現を確認します。',
        actions: [
          'ゲームに入れるようになったら、以前落ちた地点（起動直後／同じロード／同じプレイ場面）まで進め、1回だけ再現するか確かめる',
          '修復で再取得され、同じエラーが再発する場合は「保護の履歴」に再度隔離された記録がないか確認する。別のファイル名ならサポートにそのまま伝える',
          '修復で変化がなく、毎回起動直後に落ちるならSteamの動作要件とWindowsのエラー履歴を見て、GPU・描画を確認する',
          'ゲームは起動するが長時間後や特定の場面だけで落ちるなら、次のプレイ中の切り分けへ進む',
        ],
      },
      {
        id: 'crash-during-play',
        title: 'プレイ中だけ落ちるなら再現場面と描画環境を分ける',
        summary:
          'ゲームが起動できる状態では、毎回落ちる場面とPC側の変化を比較します。',
        actions: [
          '戦闘・移動・ロードなど落ちた場面とプレイ開始からの時間を記録し、イベント ビューアーの同時刻に新しいエラーがあるか確認する',
          'ゲーム内で画質を一段階下げ、Discord・録画ソフトなどのオーバーレイを一つだけ停止して、同じ場所・操作で再現するか比べる',
          '描画開始時から毎回落ちる場合は、Steamの最低条件（GPU・メモリ・DirectX 11）とPCの仕様を比較し、GPUメーカー公式のドライバーに更新したら再起動して再確認する',
          'Intel Core第13・14世代の対象機種でクラッシュや「ビデオメモリ不足」が繰り返されるなら、Aniimo公式のCPU安定性案内を確認する。BIOS更新などはPCメーカーの指示を確認して進める',
        ],
        note: '同じ場面で多くの人に起きると確認できれば更新情報を確認。1台だけで再発する場合は発生時刻・エラー名・PC構成を添え、ゲーム内のF10または support_jp@aniimo.com へ報告します。',
      },
    ],
    cautions: [
      '再インストールやゲームフォルダの手動削除に進む前に、ゲームのアカウント連携先とインストール元を確かめてください。',
    ],
    avoid: [
      'エラー文を控える前に非公式DLLや「万能修復ツール」を導入しない。',
      'Aniimo以外の検出を含め、セキュリティ機能全体を無効にしない。隔離ファイルが公式配布か確かめられない場合は復元しない。',
      '複数の設定を同時に変えない。直った手順が分からなくなります。',
    ],
    faqs: [
      {
        question:
          '公式ランチャーに「ワンクリック修復」があるのに見つかりません',
        answer:
          '公式ランチャーの右上「設定」にあります。Steam版では同じ項目名を探さず、ライブラリのAniimoを右クリック→「プロパティ」→「インストール済みファイル」から整合性確認を実行してください。',
      },
      {
        question: 'ゲームファイルを修復したのに、まだ落ちるのはなぜ？',
        answer:
          '修復で再取得されたのに同じエラーが繰り返されるなら、セキュリティ製品に再隔離されていないか確認します。何も変わらず毎回同じ時点で落ちるなら、Windowsの同時刻のエラー履歴と動作要件を見てください。',
      },
      {
        question: 'エラー表示がなく突然閉じる場合、何をサポートに送ればよい？',
        answer:
          '公式ランチャー版かSteam版か、発生時刻、起動直後かプレイ中か、再現する操作、試した修復結果、イベント ビューアーで一致したアプリ名・例外コードがあれば控えてください。ゲームに入れる場合はメニュー→カスタマーサポートまたはF10、入れない場合は公式窓口 support_jp@aniimo.com に報告できます。',
      },
    ],
    sources: [
      pcLaunchFaq,
      steamVerifyGuide,
      steamStore,
      windowsEventViewer,
      windowsProtectionHistory,
      aniimoIntelIssue,
      aniimoRelease,
    ],
    related: related.filter((slug) => slug !== 'not-launching'),
    seoTitle: 'アニモ（Aniimo）が起動しない・途中で落ちる原因と直し方【PC版】',
    metaDescription:
      'アニモ（Aniimo）PC版が無反応・起動直後に落ちる・プレイ中にクラッシュする原因を症状別に整理。公式ランチャーとSteamの修復場所、エラー表示・Windowsの履歴、修復後の判断を解説。',
    ogTitle: 'アニモが起動しない・途中で落ちる？',
    ogSteps: [
      '無反応／起動直後／プレイ中を区別',
      'エラー表示とWindows履歴を確認',
      '配布元でゲームファイルを修復',
      '修復後に同じ場面で比較',
    ],
  },
  {
    gameSlug: 'aniimo',
    slug: 'black-screen',
    category: 'settings',
    title:
      'アニモ（Aniimo）が黒画面になるときの直し方｜PC全体が映らない場合も解説',
    shortTitle: '黒画面・画面が映らない',
    symptom:
      'ゲームのウィンドウだけ真っ暗なのか、Windowsのデスクトップも映らないのかで初動が変わります。まずAlt＋TabやCtrl＋Alt＋DeleteでWindowsの画面が見えるか確認してください。',
    conclusion:
      'Windowsが見えるならゲーム側の表示切り替えを試し、映像が戻れば画面設定を保存。戻らなければAniimoの修復へ。PC画面全体が黒いなら、モニターの電源・入力先・接続を確かめてからWindowsの表示を復旧します。',
    description:
      '音が聞こえていても、ゲーム映像だけの問題かWindows全体の表示問題かは判定できません。デスクトップやセキュリティ画面が見えるかを先に確かめ、見えない場合はゲームのファイル操作へ進まないでください。',
    checkedAt: '2026-09-27',
    status: 'verified',
    targetVersion: 'Windows PC版（公式ランチャー・Steam）／2026年9月27日確認',
    quickFacts: [
      {
        label: '最初に試すキー',
        value: 'Alt＋Tab、次にCtrl＋Alt＋Delete。Windowsの画面が見えるかを判定',
      },
      {
        label: 'ゲーム画面だけ黒い',
        value:
          'ゲームが選択された状態でAlt＋Enterを1回試し、結果に合わせて分岐',
      },
      {
        label: 'PCの画面全体が黒い',
        value: 'モニター電源・入力・ケーブル→Windows＋Ctrl＋Shift＋Bの順',
      },
      {
        label: 'Aniimo公式の修復',
        value: '公式ランチャー右上の「設定」→「ワンクリック修復」',
      },
    ],
    causes: [
      'Aniimoの画面モード・解像度とディスプレイ設定の組み合わせ',
      '更新後のゲームファイルの不整合（Aniimo公式FAQが修復を案内）',
      'モニターの入力先・接続、Windowsの表示先やグラフィックスの問題',
    ],
    symptoms: [
      { label: 'まずWindowsを操作できるか確認', target: 'split-black-screen' },
      { label: 'ゲームだけ黒い・音は出る', target: 'window-mode' },
      { label: 'PCの画面全体が映らない', target: 'desktop-blank' },
      { label: 'Alt＋Enterで映像が戻った', target: 'after-display-toggle' },
      { label: '切り替えてもゲームが真っ黒', target: 'repair-black-screen' },
      { label: '修復後も同じ黒画面', target: 'after-repair-black-screen' },
    ],
    diagnosis: [
      {
        symptom: 'Aniimoだけ黒く、Alt＋Tabでデスクトップが見える',
        cause: 'ゲームの表示モード・描画かファイルを確認',
        stepId: 'window-mode',
      },
      {
        symptom: '音は出るがAniimoの映像だけ見えない',
        cause: '音の有無では断定せず、Windowsが見えれば画面切り替えを試す',
        stepId: 'window-mode',
      },
      {
        symptom: 'Alt＋Enter後に映像が戻った',
        cause: '切り替えた表示モード・解像度で再起動しても戻るか確認',
        stepId: 'after-display-toggle',
      },
      {
        symptom: 'Alt＋Enterで変化なし／一瞬映ってまた黒い',
        cause: 'ゲームを終了し、配布元に合う修復を実行',
        stepId: 'repair-black-screen',
      },
      {
        symptom: 'デスクトップも見えず、Ctrl＋Alt＋Deleteも表示されない',
        cause: 'ゲーム設定よりモニター・Windowsの画面出力を先に確認',
        stepId: 'desktop-blank',
      },
      {
        symptom: '更新後から黒く、修復しても同じ状態',
        cause: '修復結果と起動時点を比較し、表示環境と公式窓口へ',
        stepId: 'after-repair-black-screen',
      },
    ],
    steps: [
      {
        id: 'split-black-screen',
        title: 'Windowsが見えるか確認して、調べる対象を決める',
        summary: 'ゲームだけ黒いのか、PCの表示全体が消えたのかを切り分けます。',
        actions: [
          'Alt＋Tabで別のアプリかWindowsのデスクトップに切り替える。ゲーム以外が見えるなら次の「ゲームだけ黒い」へ進む',
          '何も見えなければCtrl＋Alt＋Deleteを1回押す。セキュリティ画面が出るならWindowsは表示できているため、タスク マネージャーでAniimoが応答しているか確認する',
          'デスクトップもセキュリティ画面も出ず、モニター全体が黒いなら「PCの画面全体が映らない」へ進む',
        ],
        note: 'ロゴの後で黒い場合も、画面全体が真っ黒になった場合も、音だけを手がかりにゲームの修復へ進まないことが重要です。',
      },
      {
        id: 'window-mode',
        title: 'ゲームだけ黒い場合、表示モードを1回切り替える',
        summary:
          'Windowsが見える場合に限り、全画面とウィンドウの表示差を調べます。',
        actions: [
          'ゲーム以外のWindows画面が見えることを確認し、Alt＋TabでAniimoに戻る',
          'Aniimoが選択された状態でAlt＋Enterを1回押し、10秒ほど待って映像が戻るか見る。ゲームがこのキーに対応しない場合もあります',
          '映像が戻ったなら次の「映像が戻った後」へ。映像が戻らない、または一瞬だけ戻るならCtrl＋Alt＋Deleteからタスク マネージャーを開き、応答しないAniimoを終了して「ゲームを修復」へ進む',
        ],
        note: 'Alt＋Enterに反応しないことだけではゲームファイルの破損と判断できません。画面全体が黒い場合はこの操作を繰り返さず、Windows側の手順を先に確認します。',
      },
      {
        id: 'desktop-blank',
        title: 'PCの画面全体が映らない場合は表示を復旧する',
        summary:
          'デスクトップも見えない間は、ゲームファイルの修復を始められません。',
        actions: [
          'モニターの電源ランプと入力先（HDMI／DisplayPort）を確認し、PCとモニターのケーブルが抜けていないか確認する。ノートPCなら外部モニターをいったん外して内蔵画面を見る',
          'Windows＋Ctrl＋Shift＋Bを1回押し、音や画面のちらつき、デスクトップが戻るか確認する',
          'まだ真っ黒ならWindows＋Pを押し、もう一度P、Enterの順で表示先を1段階切り替えて数秒待つ。外部画面を使う場合は投影先を間違えていないか見る',
          'Ctrl＋Alt＋Deleteで画面が戻ればタスク マネージャーでAniimoを終了し、デスクトップが見える状態にしてからゲーム側を確認する。何を押しても表示が戻らなければMicrosoftの「Windowsの空白画面」案内に進む',
        ],
        note: 'ディスクへの更新・保存中と分かる場合は電源の長押しを避けてください。PCが応答せず表示も戻らない場合は、Microsoftの復旧手順を確認してから再起動を判断します。',
      },
      {
        id: 'after-display-toggle',
        title: '映像が戻ったら、表示設定を保存して再発を確かめる',
        summary:
          'その場で一度映っただけでは解決とせず、再起動後も映るか調べます。',
        actions: [
          'Aniimoの画面が戻ったら、ゲームの表示設定で現在表示できている画面モードと解像度を控え、その設定で保存する',
          'いったん通常終了し、同じモニターで再起動する。ログイン画面からゲーム内まで映れば改善と判断する',
          '再起動時にだけ黒くなるなら、Windows「設定」→「システム」→「ディスプレイ」で利用中のモニターを選び、解像度と画面の配置を確認する',
          '同じ設定でも再発するなら、次の修復手順で更新後のゲームファイルを確認する',
        ],
      },
      {
        id: 'repair-black-screen',
        title: '切り替えてもゲームだけ黒いなら配布元の修復を実行する',
        summary:
          'Aniimo公式は更新後の黒画面にワンクリック修復を案内しています。',
        actions: [
          'Windowsのデスクトップが表示できていることを確認し、Aniimoを終了する。公式ニュースに更新・メンテナンスがあれば状況を確かめる',
          '公式ランチャー版はランチャー右上「設定」→「ワンクリック修復」を実行し、完了後にランチャーを再起動する',
          'Steam版はライブラリでAniimoを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」を実行する',
          '再取得されたかどうかを控え、ゲームを再び起動して、ロゴ直後からゲーム内まで映るか確認する。改善しなければ次の結果別手順へ',
        ],
      },
      {
        id: 'after-repair-black-screen',
        title: '修復後も黒い場合は結果に合わせて次の行動を選ぶ',
        summary: '修復結果、映る範囲、別のアプリの表示から調べる先を絞ります。',
        actions: [
          '再取得後にゲームが映り、再起動しても再発しなければ修復完了。再取得されても同じ時点で黒くなるなら、公式更新情報を確認し、再発時刻と修復結果を控える',
          '修復で変化がなくAniimoだけ黒い場合は、GPUメーカー公式のドライバーを確認し、更新した場合はWindowsを再起動して比較する。Discordや録画ソフトのオーバーレイは一つずつ止めて試す',
          'Windowsのデスクトップも再び消える場合はゲーム設定の問題と決めつけず、MicrosoftのWindows空白画面の手順で表示先・接続・ドライバーを確認する',
          'ゲームだけ黒い症状が続くなら、公式ランチャー版かSteam版か、更新前後の変化、Alt＋Enterの結果、音の有無とエラー表示を添えて support_jp@aniimo.com へ相談する',
        ],
      },
    ],
    cautions: [
      'ランチャーの更新中やディスクへの書き込み中と分かるときは、強制終了や電源の長押しを繰り返さないでください。',
    ],
    avoid: [
      'PC画面全体が映らない状態で、当てずっぽうにゲームファイルや設定を削除しない。',
      '非公式のDLLや修復ツール、原因の分からない設定ファイルは追加しない。',
    ],
    faqs: [
      {
        question: 'ゲーム音が聞こえればAniimo側だけの問題ですか？',
        answer:
          '音だけでは判断できません。Alt＋TabでWindowsのデスクトップが見えればゲーム側の表示を確認します。Windowsの画面も見えなければ、モニターの入力先とWindowsの表示復旧を先に試してください。',
      },
      {
        question: 'Alt＋Enterで一度直ったのに、次の起動でまた黒くなります',
        answer:
          '映った時の画面モードと解像度をゲーム内で保存し、Windows側でも使っているモニターと解像度を確認します。ゲームだけ再発するなら更新後のファイルを修復し、その結果を控えてください。',
      },
      {
        question: 'ロゴが出ず白い画面のままの場合も同じ手順ですか？',
        answer:
          'Aniimo公式FAQは、ロゴが出ず白い画面が続く症状について別にDirectX 11の案内を掲載しています。デスクトップが見えることを確認したうえで、公式FAQの該当項目を先に確認してください。',
      },
    ],
    sources: [
      pcLaunchFaq,
      windowsBlankScreen,
      windowsDisplaySettings,
      steamVerifyGuide,
      aniimoRelease,
    ],
    related: related.filter((slug) => slug !== 'black-screen'),
    seoTitle:
      'アニモ（Aniimo）が黒画面になる時の直し方｜Windows全体が映らない場合も',
    metaDescription:
      'アニモ（Aniimo）PC版が黒画面になる時は、ゲームだけ黒いかWindows全体が映らないかを判定。Alt＋Enterで映像が戻った場合・戻らない場合の次の行動、公式ランチャーとSteamの修復方法を解説。',
    ogTitle: 'アニモが黒画面。PC全体も？',
    ogSteps: [
      'Windowsの画面が見えるか確認',
      'ゲームだけなら表示を切り替え',
      '映像が戻ったら設定を保存',
      '戻らなければ公式の修復へ',
    ],
  },
  {
    gameSlug: 'aniimo',
    slug: 'login-error',
    category: 'server',
    title: 'アニモ（Aniimo）にログインできない・接続できないときの対処法',
    shortTitle: 'ログイン・接続エラー',
    symptom:
      'アカウントへ入れない、接続できない、ログイン待ちから進まない場合の切り分け手順です。',
    conclusion:
      '公式のお知らせでメンテナンスを確認し、再認証、Windowsの時刻、別回線の比較まで行って、サーバー側とPC側を切り分けます。',
    description:
      'サービス開始直後の混雑・メンテナンスと、認証情報や通信環境の問題は対処が異なります。待機表示がある場合は、連打や短時間の再接続を避けてください。',
    checkedAt,
    status: 'verified',
    targetVersion,
    causes: [
      'メンテナンス、障害、ログイン集中',
      'ランチャーまたはSteamの認証情報が更新されていない',
      'Windowsの時刻ずれやVPN・プロキシの影響',
      '家庭内ネットワークまたはプロバイダー経路の一時的な問題',
    ],
    symptoms: [
      { label: 'ログイン待ちから進まない', target: 'check-login-status' },
      { label: 'アカウントへ入れない', target: 'reauthenticate' },
      { label: '接続できない', target: 'compare-network' },
    ],
    steps: [
      {
        id: 'check-login-status',
        title: '公式情報と待機表示を確認する',
        summary: '運営側の状況なら、端末設定の変更は不要です。',
        actions: [
          'Aniimo公式ニュースでメンテナンスや障害情報を確認する',
          '待機人数や待機時間が表示されている場合は、その画面の案内に従う',
          '短時間にログイン操作を繰り返さない',
        ],
      },
      {
        id: 'reauthenticate',
        title: 'ランチャーを終了して再認証する',
        summary: '古い認証状態が残っていないかを確認します。',
        actions: [
          'ゲームとランチャーまたはSteamを終了する',
          'タスクマネージャーで関連プロセスが終了したことを確認する',
          'Windowsを再起動する',
          '通常の公式ログイン画面から再度サインインする',
        ],
        note: 'パスワードや確認コードを第三者サイトへ入力しないでください。',
      },
      {
        id: 'compare-network',
        title: '時刻と通信経路を比較する',
        summary:
          '認証に影響する端末時刻と回線を、変更の少ない方法で確認します。',
        actions: [
          'Windowsの「時刻を自動的に設定する」を有効にして同期する',
          'VPNやプロキシを使っている場合は一時的に停止して比較する',
          'ルーターを再起動する',
          '可能ならスマートフォンのテザリングで一度だけ比較する',
        ],
      },
    ],
    cautions: [
      'アカウント情報や確認コードは公式画面以外に入力しないでください。',
      '待機列があるときに再接続すると、順番が戻る場合があります。画面の案内を優先してください。',
    ],
    faqs: [
      {
        question: 'Aniimoのログイン待ちはPCの故障ですか？',
        answer:
          '待機人数や待機時間が表示される場合は、サーバー混雑の可能性があります。公式のお知らせを確認し、画面の案内を優先してください。',
      },
      {
        question: 'Aniimoだけ接続できないときは？',
        answer:
          '公式の障害情報を確認し、再認証、Windowsの時刻同期、VPN停止、別回線での比較を順番に行います。',
      },
    ],
    sources: [officialNews, steamStore],
    related: related.filter((slug) => slug !== 'login-error'),
    seoTitle: 'アニモ（Aniimo）にログインできない・接続できない時の対処法',
    metaDescription:
      'アニモ（Aniimo）にログインできない、接続できない、ログイン待ちから進まない場合の対処法。公式状況、再認証、時刻・回線を順に確認します。',
  },
  {
    gameSlug: 'aniimo',
    slug: 'video-memory-error',
    category: 'display',
    title: 'アニモ（Aniimo）で「ビデオメモリ不足」が出る原因と対処法',
    shortTitle: 'ビデオメモリ不足',
    symptom:
      '起動時やプレイ中にビデオメモリ不足を示す表示が出る、または描画開始時に終了する場合の確認手順です。',
    conclusion:
      '高負荷な設定と同時起動アプリを減らし、GPUドライバーを更新します。Intel第13・14世代CPUを使う場合も、Aniimo公式が原因と確認したとは断定せず、PCメーカーの案内で更新状況を確認します。',
    description:
      'この表示はGPUのVRAM使用量だけでなく、ドライバーやシステム安定性の影響でも発生する場合があります。危険を伴うBIOS操作を自己流で行わず、PC・マザーボードメーカーの正式な手順を使ってください。',
    checkedAt,
    status: 'verified',
    targetVersion,
    causes: [
      'テクスチャ品質・解像度に対してGPUのVRAMが不足している',
      'ブラウザー、録画、生成AIなどがGPUメモリを使用している',
      'GPUドライバーが古い、または更新後に再起動していない',
      '一部のIntel第13・14世代デスクトップCPU環境で報告されたシステム不安定性（Aniimo固有と確認された原因ではありません）',
    ],
    symptoms: [
      { label: '起動時に不足と表示', target: 'reduce-vram' },
      { label: '高画質にすると落ちる', target: 'reduce-vram' },
      { label: 'ほかのゲームでも同じエラー', target: 'check-system' },
    ],
    steps: [
      {
        id: 'reduce-vram',
        title: 'VRAM使用量を減らす',
        summary: '最初に、安全に戻せるゲーム設定と同時起動アプリを見直します。',
        actions: [
          'ブラウザー、録画、画像生成などGPUを使うアプリを終了する',
          'テクスチャ品質を1段階下げる',
          '解像度またはレンダリング解像度を下げる',
          'ゲームを再起動し、同じ場面で比較する',
        ],
      },
      {
        id: 'update-vram-driver',
        title: 'GPUドライバーを公式版へ更新する',
        summary: 'GPUメーカーが提供する正式なドライバーで再確認します。',
        actions: [
          'タスクマネージャーの「パフォーマンス」でGPU名を確認する',
          'NVIDIA・AMD・Intelの公式サイトから対応ドライバーを入手する',
          'インストール後にWindowsを再起動する',
          '低い画質設定のままAniimoを起動する',
        ],
      },
      {
        id: 'check-system',
        title: 'Intel第13・14世代環境はメーカー情報を確認する',
        summary:
          '同じエラーが複数のゲームで出る場合に限り、システム側の安定性も確認します。',
        actions: [
          'CPU型番とPCまたはマザーボードの製品名を確認する',
          'メーカー公式サポートでBIOS・マイクロコード更新情報を確認する',
          '更新する場合は、その製品専用の公式手順だけに従う',
          '不明な場合はメーカーサポートへ相談する',
        ],
        note: 'Aniimo公式がIntel CPUを原因として確認したという意味ではありません。BIOS更新は失敗時の影響が大きいため、汎用手順では案内しません。',
      },
    ],
    cautions: [
      'BIOS更新中の電源断や別製品向けファイルの使用は起動不能につながります。メーカー公式手順を確認できない場合は実行しないでください。',
      'レジストリ変更や非公式の電圧設定を、最初の対処として行わないでください。',
    ],
    faqs: [
      {
        question: 'ビデオメモリ不足はVRAMを増設すれば直りますか？',
        answer:
          '多くのGPUはVRAMだけを増設できません。まずテクスチャ・解像度を下げ、同時起動アプリとドライバーを確認してください。',
      },
      {
        question: 'Intel第13・14世代CPUなら必ずBIOS更新が必要ですか？',
        answer:
          '必ずではありません。Aniimo固有の原因と公式確認された情報ではないため、ほかのゲームでも同じ症状が出るかを確認し、PC・マザーボードメーカーの対象製品向け案内を優先してください。',
      },
    ],
    sources: [
      officialNews,
      steamStore,
      {
        label: 'Intel公式：第13・14世代デスクトップCPUの保証延長',
        url: 'https://community.intel.com/t5/Processors/Intel-Core-13th-14th-Gen-Desktop-Processors-VLSI-Instability/m-p/1620853',
      },
      {
        label: 'NVIDIA公式ドライバー',
        url: 'https://www.nvidia.com/Download/index.aspx',
      },
      { label: 'AMD公式サポート', url: 'https://www.amd.com/en/support' },
    ],
    related: related.filter((slug) => slug !== 'video-memory-error'),
    seoTitle: 'アニモ（Aniimo）のビデオメモリ不足エラー原因と対処法【PC版】',
    metaDescription:
      'アニモ（Aniimo）でビデオメモリ不足が出るときの対処法。VRAM使用量、GPUドライバー、Intel第13・14世代環境を安全な順番で確認します。',
  },
  {
    gameSlug: 'aniimo',
    slug: 'launcher-display',
    category: 'settings',
    title: 'アニモ（Aniimo）のランチャーが画面に収まらないときの直し方',
    shortTitle: 'ランチャー表示',
    symptom:
      'ランチャーの下部が切れる、開始ボタンが見えない、ウィンドウを移動できない場合の確認手順です。',
    conclusion:
      'Windowsの表示スケールを「推奨」へ戻し、ランチャーを再起動します。改善しない場合は一時的に100%で比較し、ウィンドウをキーボードで移動します。',
    description:
      '高DPIモニターや複数画面では、Windowsの表示倍率とランチャーの大きさが合わないことがあります。まずWindows標準設定だけで、安全に元へ戻せる方法を試します。',
    checkedAt,
    status: 'verified',
    targetVersion,
    causes: [
      'Windowsの表示スケールがランチャー表示と合っていない',
      '解像度またはメインディスプレイが切り替わった',
      'ランチャーが前回の画面外位置を記憶している',
    ],
    symptoms: [
      { label: '開始ボタンが見えない', target: 'recommended-scale' },
      { label: '下や右が画面外へ出る', target: 'recommended-scale' },
      { label: 'ウィンドウを移動できない', target: 'move-window' },
    ],
    steps: [
      {
        id: 'recommended-scale',
        title: 'Windowsの表示スケールを確認する',
        summary: 'Windowsが推奨する解像度と倍率へ戻して比較します。',
        actions: [
          'デスクトップを右クリックして「ディスプレイ設定」を開く',
          '「拡大縮小とレイアウト」で推奨の倍率を選ぶ',
          'ディスプレイ解像度も「推奨」を選ぶ',
          'ランチャーを終了して開き直す',
        ],
      },
      {
        id: 'compare-100-scale',
        title: '表示倍率100%で一時的に比較する',
        summary: '倍率が原因かを確認し、終わったら使いやすい設定へ戻します。',
        actions: [
          '現在の表示倍率をメモする',
          '表示倍率を一時的に100%へ変更する',
          'ランチャーを開き直して全体が表示されるか確認する',
          '確認後、文字が小さすぎる場合は元の倍率へ戻す',
        ],
      },
      {
        id: 'move-window',
        title: 'キーボードでウィンドウを画面内へ戻す',
        summary: 'タイトルバーをつかめない場合にWindows標準操作で移動します。',
        actions: [
          'タスクバーでAniimoランチャーを選ぶ',
          'AltキーとSpaceキーを同時に押す',
          'Mキーを押し、矢印キーで画面内へ移動する',
          'Enterキーで位置を確定する',
        ],
      },
    ],
    cautions: [
      '表示倍率100%は文字が小さくなる場合があります。原因確認後は読みやすい倍率へ戻してください。',
      '高DPI互換設定を変更する前に、まずWindowsの推奨設定で確認してください。',
    ],
    faqs: [
      {
        question: 'Aniimoランチャーの開始ボタンが見えないときは？',
        answer:
          'Windowsの表示スケールと解像度を「推奨」へ戻し、ランチャーを再起動します。改善しない場合は一時的に100%で比較してください。',
      },
      {
        question: 'ランチャーが画面外へ出て移動できません',
        answer:
          'ランチャーを選択してAlt＋Space、Mの順に押し、矢印キーで画面内へ移動してEnterで確定します。',
      },
    ],
    sources: [
      {
        label: 'Aniimo公式サイト（PCランチャー）',
        url: 'https://www.aniimo.com/ja',
      },
      {
        label: 'Microsoft公式：Windowsの画面解像度とレイアウト変更',
        url: 'https://support.microsoft.com/windows/change-your-screen-resolution-and-layout-in-windows-5effefe3-2eac-e306-0b5d-2073b765876b',
      },
    ],
    related: related.filter((slug) => slug !== 'launcher-display'),
    seoTitle: 'アニモ（Aniimo）ランチャーが画面に収まらない時の直し方',
    metaDescription:
      'アニモ（Aniimo）のランチャーが画面に収まらない、開始ボタンが見えない場合の直し方。Windows表示スケールと画面外ウィンドウの戻し方を解説します。',
  },
];
