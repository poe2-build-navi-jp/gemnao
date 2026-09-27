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
    title: 'アニモ（Aniimo）が黒画面になるときの直し方【PC版】',
    shortTitle: '黒画面',
    symptom:
      '起動後に映像が出ない、ロゴの後で黒い画面のまま進まない場合の確認手順です。',
    conclusion:
      '音が出ているかを確認し、ウィンドウ表示へ切り替え、ファイル修復とGPUドライバー更新を順番に試します。',
    description:
      '黒画面は、サービス側の問題、表示モード、描画ドライバー、破損ファイルで対処が異なります。Aniimo公式が黒画面を既知問題として掲載しているとは限らないため、症状を分けて確認します。',
    checkedAt,
    status: 'verified',
    targetVersion,
    causes: [
      'メンテナンスやランチャー更新が完了していない',
      'フルスクリーンの解像度・表示モードが合っていない',
      'ゲームファイルの不足または破損',
      'GPUドライバーや描画オーバーレイとの競合',
    ],
    symptoms: [
      { label: 'ロゴの後で黒画面', target: 'window-mode' },
      { label: '音は出るが映像がない', target: 'window-mode' },
      { label: '黒画面のまま応答しない', target: 'repair-black-screen' },
    ],
    steps: [
      {
        id: 'check-black-screen-status',
        title: '公式のお知らせと待機時間を確認する',
        summary: '配信直後の更新中と端末固有の黒画面を分けます。',
        actions: [
          'Aniimo公式ニュースでメンテナンスや更新情報を確認する',
          'ディスク使用率が動いている場合は数分待つ',
          '変化がなければゲームを終了し、Windowsを再起動する',
        ],
      },
      {
        id: 'window-mode',
        title: 'ウィンドウ表示へ切り替える',
        summary: 'フルスクリーンだけで映像が出ない状態かを確認します。',
        actions: [
          'ゲーム画面を選択する',
          'AltキーとEnterキーを同時に押す',
          '映像が表示されたら、ゲーム内でモニター対応の解像度を選ぶ',
          '一度終了し、同じ設定で再起動する',
        ],
      },
      {
        id: 'repair-black-screen',
        title: 'ファイル修復後にGPU環境を確認する',
        summary: '破損ファイルと描画環境を順番に切り分けます。',
        actions: [
          '公式ランチャーの修復機能が表示される場合は実行する',
          'Steam版は「ゲームファイルの整合性を確認」を実行する',
          'GPUメーカー公式のドライバーへ更新してPCを再起動する',
          'Discordや録画ソフトのオーバーレイを止めて再確認する',
        ],
      },
    ],
    cautions: [
      '黒画面中にインストール処理が続いている場合があります。ディスクアクセス中の強制終了を繰り返さないでください。',
      '非公式の設定ファイルやDLLは導入しないでください。',
    ],
    faqs: [
      {
        question: 'Aniimoで音は出るのに黒画面のときは？',
        answer:
          'Alt＋Enterでウィンドウ表示へ切り替え、映像が戻るか確認します。戻った場合はモニターに合う解像度へ設定してください。',
      },
    ],
    sources: [officialNews, steamStore],
    related: related.filter((slug) => slug !== 'black-screen'),
    seoTitle: 'アニモ（Aniimo）が黒画面になるときの直し方【PC版】',
    metaDescription:
      'アニモ（Aniimo）PC版が黒画面で進まない、音だけ出る場合の対処法。ウィンドウ表示、ファイル修復、GPUドライバーを安全な順に確認します。',
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
