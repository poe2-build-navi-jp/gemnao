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
    title: 'アニモ（Aniimo）が起動しない・クラッシュするときの対処法【PC版】',
    shortTitle: '起動しない・クラッシュ',
    symptom:
      'ランチャーから開始しても反応しない、起動直後に終了する、プレイ中にクラッシュする場合の切り分け手順です。',
    conclusion:
      '公式のお知らせを確認し、ランチャーまたはSteamとPCを再起動してから、ゲームファイルの修復・整合性確認を行います。',
    description:
      '正式サービス開始直後は、端末側の破損だけでなくメンテナンスやランチャー更新が原因の場合もあります。公式情報を確認してから、元に戻せる操作を1つずつ試してください。',
    checkedAt,
    status: 'verified',
    targetVersion,
    causes: [
      'メンテナンスや配信直後のランチャー更新',
      'ダウンロード済みファイルの不足・破損',
      '古いGPUドライバーや描画オーバーレイとの競合',
      'PCがSteamストアに掲載された動作要件を満たしていない',
    ],
    symptoms: [
      { label: '開始を押しても反応しない', target: 'check-official' },
      { label: '起動直後に落ちる', target: 'repair-files' },
      { label: 'プレイ中にクラッシュする', target: 'update-driver' },
    ],
    steps: [
      {
        id: 'check-official',
        title: '公式のお知らせを確認して再起動する',
        summary:
          '障害・メンテナンス・必須更新がある間は、PC設定を変えても直りません。',
        actions: [
          'Aniimo公式ニュースで最新のお知らせを確認する',
          'ゲームとランチャーまたはSteamを完全に終了する',
          'Windowsを再起動する',
          'ランチャーの更新が終わってから1回だけ起動を試す',
        ],
      },
      {
        id: 'repair-files',
        title: 'ゲームファイルを修復・整合性確認する',
        summary: '不足または破損したファイルを配信元に確認させます。',
        actions: [
          '公式ランチャー版は、修復・チェック機能が表示される場合に実行する',
          'Steam版はライブラリでAniimoを右クリックする',
          '「プロパティ」→「インストール済みファイル」を開く',
          '「ゲームファイルの整合性を確認」を実行する',
          '完了後にPCを再起動する',
        ],
        note: '再インストールは最後にします。先に修復すれば、不要な再ダウンロードを避けられます。',
      },
      {
        id: 'update-driver',
        title: 'GPUドライバーを更新し、オーバーレイを止める',
        summary: '描画開始時のクラッシュ要因を分けて確認します。',
        actions: [
          'GPUメーカー公式サイトから使用中GPU向けドライバーを確認する',
          '更新後にWindowsを再起動する',
          'Discord・録画・FPS表示などのオーバーレイを一時停止する',
          'Aniimoだけを起動して再確認する',
        ],
      },
    ],
    cautions: [
      'Aniimo公式が案内していないDLL配布サイトや「修復ツール」は使用しないでください。',
      '複数の設定を同時に変えず、各手順の後に起動を確認してください。',
    ],
    faqs: [
      {
        question: 'Aniimoが起動しないとき、最初に何をすればよいですか？',
        answer:
          '公式ニュースでメンテナンスや更新を確認し、ランチャーまたはSteamとPCを再起動してください。次にファイル修復・整合性確認を行います。',
      },
      {
        question: 'Aniimoをすぐ再インストールした方がよいですか？',
        answer:
          '先に修復・整合性確認を試します。再インストールは、公式情報とほかの手順を確認しても直らない場合の最後の候補です。',
      },
    ],
    sources: [officialNews, steamStore],
    related: related.filter((slug) => slug !== 'not-launching'),
    seoTitle: 'アニモ（Aniimo）が起動しない・クラッシュする時の対処法【PC版】',
    metaDescription:
      'アニモ（Aniimo）PC版が起動しない、起動直後に落ちる、クラッシュするときの直し方。公式情報の確認、ファイル修復、GPUドライバーを順番に解説します。',
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
