import type { GameArticle } from '@/lib/game-articles';

// 2026年9月末〜10月初めに発売・サービス開始する3作品の個別記事。
// 2026-09-28に公式サイト・公式のお知らせ・Steamストアで確認した内容だけを載せています。
// STEPのidは解決報告（D1）の集計キーなので、公開後は変更しないでください。

type Draft = Omit<
  GameArticle,
  'checkedAt' | 'symptoms' | 'seoTitle' | 'status'
> & { seoTitle?: string; checkedAt?: string };

const make = (draft: Draft): GameArticle => ({
  checkedAt: '2026-09-28',
  status: 'verified',
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
  seoTitle: draft.title,
  ...draft,
});

const steamVerify =
  'Steam：ライブラリでゲームを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」';

const aionSources = {
  steamNews: {
    label:
      'Steamニュース（公式）：Launch Scale Test Comes to a Close（アーリーアクセスの準備・待機列の方針）',
    url: 'https://store.steampowered.com/news/app/3393110',
  },
  founders: {
    label: 'NC公式：9月30日から5日間のアーリーアクセス（ファウンダーズパック）',
    url: 'https://about.ncsoft.com/jp/news/article/Aion2_update_2607232',
  },
  predownload: {
    label:
      'Steamニュース（公式）：Pre-download Available Now（事前ダウンロードと復号）',
    url: 'https://store.steampowered.com/news/app/3393110',
  },
  servers: {
    label:
      'Steamニュース（公式）：Advanced Access Servers（先行アクセスの日程・サーバー一覧）',
    url: 'https://store.steampowered.com/news/app/3393110',
  },
  fixes: {
    label:
      'Steamニュース（公式）：Update on account issues and in-game fixes（10月1日）・Twitch Drops Account Linking Guide（10月2日）',
    url: 'https://store.steampowered.com/news/app/3393110',
  },
  launch: {
    label:
      'Steamニュース（公式）：Launch FAQ／Information on server transfer（9月30日）',
    url: 'https://store.steampowered.com/news/app/3393110',
  },
  steam: {
    label: 'Steamストア：AION 2（動作環境・対応言語）',
    url: 'https://store.steampowered.com/app/3393110/',
  },
};

const aceSources = {
  notice: {
    label:
      'Steamニュース（公式）：Product Notice（クラッシュの調査）・Error Code ST-3100001・Flight Stick Support Update・PC Crash Report Thread',
    url: 'https://store.steampowered.com/news/app/2288340',
  },
  official: {
    label:
      '公式サイト：ACE COMBAT 8: WINGS OF THEVE（STEAM版システム要件・製品情報）',
    url: 'https://enso-order.acecombat.jp/',
  },
  famitsu: {
    label:
      'ファミ通.com：発売日・アーリーアクセス・早期購入特典（プレスリリース）',
    url: 'https://www.famitsu.com/article/202606/76733',
  },
  steam: {
    label: 'Steamストア：ACE COMBAT 8: WINGS OF THEVE',
    url: 'https://store.steampowered.com/app/2288340/',
  },
};

const musouSources = {
  official: {
    label: '公式サイト：真・三國無双２ with 猛将伝 Remastered',
    url: 'https://www.gamecity.ne.jp/smusou2-re/jp/',
  },
  steam: {
    label:
      'Steamストア：真・三國無双２ with 猛将伝 Remastered（動作環境・PC版対応機能）',
    url: 'https://store.steampowered.com/app/3841510/',
  },
  demo: {
    label: 'Steamストア：体験版（セーブデータの引き継ぎなし）',
    url: 'https://store.steampowered.com/app/4995490/',
  },
  watch: {
    label: 'GAME Watch：体験版の配信とオンライン2Pプレイのアップデート予定',
    url: 'https://game.watch.impress.co.jp/docs/news/2142485.html',
  },
};

export const launchWeekArticles: GameArticle[] = [
  make({
    gameSlug: 'aion2',
    slug: 'login-error',
    checkedAt: '2026-10-03',
    category: 'server',
    seoTitle: 'AION2にログインできない・接続できない時の対処法【PC版】',
    title:
      'AION2（アイオン2）にログインできない・接続できない時の対処法【PC版】',
    shortTitle: 'ログイン・接続できない',
    targetVersion:
      'Steam版・PURPLE版（アーリーアクセス／正式サービス）・2026年10月2日時点',
    symptom:
      'ログイン画面から進まない、待機列が減らない、アーリーアクセスなのに入れない、プレイ中に切断される場合の確認手順です。',
    conclusion:
      'サービス開始直後の接続トラブルは、運営側の混雑や障害が原因のことが多くあります。まず公式のお知らせを確認し、待機列は抜けずに待ちます。Steamで9月の事前テストに参加した人は、Playtestアプリを削除してAION 2本体をダウンロードし直す必要があります（公式の案内）。',
    description:
      'アーリーアクセスは2026年9月30日から10月4日まで、正式サービスは10月5日からです（基本無料）。アーリーアクセスにはファウンダーズパックの購入が必要です。',
    causes: [
      'サービス開始直後のアクセス集中・障害・メンテナンス',
      'Steamで事前テスト用のPlaytestアプリを起動している',
      'ファウンダーズパックを購入したアカウントと別のアカウントでログインしている',
      'VPN・通信最適化ツール・セキュリティソフトの影響',
      '自宅の回線が不安定（Wi-Fiなど）',
    ],
    quickFacts: [
      {
        label: '事前ダウンロード（9月28日から）',
        value:
          'ファイルは暗号化されており、9月30日に復号（decrypt）してから遊ぶ。再インストールではない（公式）',
      },
      {
        label: 'アーリーアクセス',
        value:
          '9月30日 22:30〜10月5日 14:00（日本時間。ファウンダーズパック購入者）。開始は当日30分延期された（公式）',
      },
      {
        label: 'メンテナンス',
        value:
          '10月5日 14:00〜22:00（日本時間）の予定。時間は変わる場合あり（公式）',
      },
      {
        label: '正式サービス',
        value: '10月5日 22:00（日本時間）から（基本無料）',
      },
      {
        label: 'サーバーの選び方',
        value:
          '起動後に地域→種族→サーバーの順に選ぶ。1つのサーバーには1つの種族だけ（公式）',
      },
      {
        label: 'サーバー移動',
        value:
          '10月14日から同じ種族のサーバー間で移動可能（当初は無料）。アーリーアクセスのサーバーからは、アーリーアクセスのサーバーにだけ移動できる（公式）',
      },
      {
        label: 'Steamで事前テストに参加した人',
        value:
          'Playtestアプリを削除し、AION 2本体をダウンロード（PURPLEは作業不要）',
      },
      {
        label: '待機列',
        value: 'サーバーが満員の時は、優先列と一般列に分かれて入場',
      },
      { label: '必要な空き容量', value: '100GB（Steamストアの動作環境）' },
    ],
    diagnosis: [
      {
        symptom: '事前ダウンロードしたのに9月30日に長い処理が始まった',
        cause: '暗号化ファイルの復号（正常な動作）',
        stepId: 'step-3',
      },
      {
        symptom: '10月5日の14:00〜22:00に入れない',
        cause: 'アーリーアクセス終了後のメンテナンス（予定）',
        stepId: 'step-1',
      },
      {
        symptom: 'ログイン画面から進まない',
        cause: '混雑・障害・メンテナンス',
        stepId: 'step-1',
      },
      {
        symptom: '待機列がなかなか減らない',
        cause: 'サーバーの満員',
        stepId: 'step-2',
      },
      {
        symptom: 'アーリーアクセスなのに入れない',
        cause: 'Playtestアプリの起動・購入アカウントの違い',
        stepId: 'step-3',
      },
      {
        symptom: '更新の後から入れない・落ちる',
        cause: 'ランチャーやファイルの不具合',
        stepId: 'step-4',
      },
      {
        symptom: 'プレイ中に接続が切れる',
        cause: 'VPN・Wi-Fi・通信ツール',
        stepId: 'step-5',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: '公式のお知らせで障害・メンテナンスを確認する',
        summary:
          '運営側の障害やメンテナンス中は、PC側で何をしても接続できません。先に確認して、無駄な作業を避けます。',
        time: '約2分',
        risk: 'low',
        actions: [
          'AION2公式サイトのお知らせと公式Xを確認する',
          'SteamのAION 2のページで「ニュース」を開き、最新の告知を確認する',
          '障害の告知が出ている間は、再インストールやルーターの設定変更をしない',
        ],
      },
      {
        id: 'step-2',
        title: '待機列は抜けずに待つ',
        summary:
          'サーバーが満員の時は待機列に入ります。公式は、サーバーに空きが出ると優先列と一般列の両方が進む仕組みだと案内しています。',
        time: '混雑状況による',
        risk: 'low',
        actions: [
          '待機画面が表示されている間は、キャンセルや再起動を繰り返さない',
          '別のサーバーが選べる場合は、混雑していないサーバーも検討する。公式は、待機列の長いサーバーではなく「おすすめ」のサーバーや新しく追加されたサーバーでキャラクターを作るよう案内している',
          '友達と別のサーバーになっても、10月14日からのサーバー移動（同じ種族の間・当初は無料）で合流できる。ダンジョンなどのインスタンスコンテンツはサーバーをまたいで遊べる（公式）',
        ],
        note: '優先列は、規約違反などで処分を受けたアカウントや、違反が疑われるアカウントでは利用できなくなる場合があります（公式の案内）。',
      },
      {
        id: 'step-3',
        title: 'アーリーアクセスは起動するアプリと購入アカウントを確認する',
        summary:
          '9月16日から配布された事前テスト（Launch Scale Test）用のPlaytestアプリでは、アーリーアクセスに参加できません。',
        time: '約10分（ダウンロード時間を除く）',
        risk: 'low',
        actions: [
          'Steam版：ライブラリから「AION 2 Playtest」を削除し、「AION 2」本体をダウンロードする',
          'PURPLE版：追加の作業は不要（公式の案内）',
          'ファウンダーズパックを購入したアカウントと、ログインしているアカウントが同じか確認する',
          'Steam版・PURPLE版とも、ゲームを再起動してクライアントを最新にする。ログイン時にアーリーアクセスの権利が認識されない不具合は、10月1日に修正が配信された（公式。再起動時に自動で更新される）',
        ],
        note: '事前テストの進行状況はアーリーアクセスや正式サービスに引き継がれません。',
      },
      {
        id: 'step-4',
        title: 'ゲームとランチャーを完全に終了し、ファイルを確認する',
        summary:
          'ウィンドウを閉じても、裏でプロセスが残っていることがあります。更新の途中で止まる場合は、ファイルの破損も確認します。',
        time: '約10分',
        risk: 'low',
        actions: [
          'Ctrl + Shift + Esc でタスクマネージャーを開き、AION 2とSteamまたはPURPLEのプロセスを終了する',
          'ランチャーから起動し直す。直らなければPCを再起動する',
          'Twitchドロップのために、NCの公式サイトで別途アカウント連携をしない。公式は、既存の連携が外れてキャラクターに入れなくなる場合があると注意している。Twitchには、いま遊んでいる方のアカウント（Steam版ならSteam、PURPLE版ならNC）を連携する',
          steamVerify,
          'ストレージの空き容量を確認する（動作環境は100GB。更新分の余裕も必要）',
        ],
      },
      {
        id: 'step-5',
        title: 'VPN・通信ツールを止め、回線を見直す',
        summary: '運営側に問題がないのに自分だけつながらない場合に確認します。',
        time: '約10分',
        risk: 'low',
        actions: [
          'VPNや通信最適化ツールを使っている場合はオフにして試す',
          'セキュリティソフトを一時停止して接続できたら、AION 2とランチャーを除外（許可）リストに追加してから元に戻す',
          'ルーターの電源を抜いて30秒ほど待ち、入れ直す',
          'Wi-Fiの場合は、可能であればLANケーブルで有線接続にする',
        ],
      },
    ],
    avoid: [
      '待機列を何度も抜けて並び直さない',
      '障害の告知が出ている間に、再インストールやルーターの設定変更をしない',
      'セキュリティソフトをオフにしたままプレイしない（除外設定をして戻す）',
    ],
    cautions: [
      'サービス開始直後は告知や仕様が頻繁に変わります。最新のお知らせもあわせて確認してください。',
      'アカウント連携の不具合は、公式が調査中です（2026年10月1日の告知）。',
      '直らない場合は、発生日時・エラーの文章（スクリーンショット）・Steam版かPURPLE版か・回線の種類を添えて公式サポート（help.plaync.com）に問い合わせてください。',
    ],
    faqs: [
      {
        question: 'アーリーアクセスは日本時間の何時から遊べますか？',
        answer:
          '公式の告知では、アーリーアクセスは9月30日13:00（UTC）から、日本時間では9月30日22:00からです。10月5日14:00（日本時間）に終わり、22:00までメンテナンスを行ったあと、正式サービスが始まる予定です。メンテナンスの時間は変わる場合があるため、公式のお知らせも確認してください。',
      },
      {
        question: 'Steam版とPURPLE版で同じサーバーに入れますか？',
        answer:
          '公式のLaunch FAQによると、Steam版とPURPLE版は同じサーバーで、ゲーム内容も同じです。Steam版はPURPLEのアカウントと連携しなくても遊べますが、同じキャラクターを両方で使う場合は連携が必要です。',
      },
      {
        question: 'コントローラーで遊べますか？',
        answer:
          '公式のLaunch FAQでは、コントローラーでも遊べるものの公式サポートの対象外とされています。',
      },
      {
        question: 'サーバーを後から移動できますか？',
        answer:
          '公式によると、10月14日から同じ種族のサーバー間で移動できるようになり、当初は無料です。ただしアーリーアクセスのサーバーからは、アーリーアクセスのサーバーにだけ移動できます。',
      },
      {
        question: '別の種族の友達と同じサーバーで遊べますか？',
        answer:
          'AION 2では、1つのサーバーには天族（Elyos）か魔族（Asmodian）のどちらか一方だけが所属します。起動後に地域→種族→サーバーの順に選びます。天族と魔族のサーバーはペアになっており、アビスなどの対人の場で出会います（公式）。',
      },
      {
        question: '事前ダウンロードしたのに、9月30日にまた処理が始まりました。',
        answer:
          '公式によると、事前ダウンロードしたファイルは暗号化されており、アーリーアクセス開始時に復号（decrypt）が必要です。再インストールではなく、かかる時間はPCの性能によって異なります。途中で止めずに待ってください。',
      },
      {
        question: 'スペックが足りないとログインできませんか？',
        answer:
          'スペック不足は主に起動や動作の重さに影響し、ログインできない直接の原因にはなりにくいです。最低動作環境のGPUはGTX 1050 Ti（4GB）で、その場合はFHDでグラフィックプリセットを「非常に低い」にするよう案内されています。',
      },
      {
        question: 'プレイヤー同士で直接アイテムを交換できません。',
        answer:
          '公式は、ボット対策としてプレイヤー間の直接取引を無効にしています。取引はマーケットを使います。',
      },
      {
        question: 'PS5やスマートフォンで遊べますか？',
        answer:
          'グローバル版はPC専用で開発されています（公式FAQ）。SteamまたはNCのランチャー「PURPLE」から遊べます。',
      },
    ],
    sources: [
      aionSources.fixes,
      aionSources.launch,
      aionSources.servers,
      aionSources.predownload,
      aionSources.steamNews,
      aionSources.founders,
      aionSources.steam,
    ],
    related: [],
    metaDescription:
      'AION2にログインできない・接続できない時の対処法。アーリーアクセス（9/30〜）でSteamのPlaytestアプリを削除する手順、待機列の仕組み、VPN・回線の見直しまで公式情報をもとに解説。',
  }),
  make({
    gameSlug: 'ace-combat-8',
    slug: 'not-launching',
    category: 'launch',
    checkedAt: '2026-10-04',
    seoTitle:
      'エースコンバット8（エスコン8）が起動しない・落ちる時の対処法【PC版】',
    title:
      'エースコンバット8（ACE COMBAT 8）が起動しない・クラッシュする時の対処法【PC版】',
    shortTitle: '起動しない・クラッシュ',
    targetVersion:
      'STEAM版・公式システム要件と2026年10月2日時点の公式のお知らせ',
    symptom:
      'PC版（Steam）が起動しない、起動直後に落ちる、読み込みで止まる、プレイ中にクラッシュする場合の確認手順です。',
    conclusion:
      '最初に、GPUがハードウェアレイトレーシングに対応しているか、Windows 11か、SSDにインストールしているかを確認します。公式のシステム要件では、この3つが最低環境から必須です。要件を満たしているのに落ちる場合、公式はSteam版のクラッシュを調査中と発表しており、起動時に表示される推奨ドライバーへの更新、SSDの空き容量（16GB以上を推奨）、Windowsの仮想メモリの有効化を確認するよう案内しています。',
    description:
      '発売は2026年10月2日、DELUXE EDITIONなどのアーリーアクセスは9月29日からです。配信開始時間はストアに準拠するため前後する可能性があると、公式は案内しています。',
    causes: [
      'GPUがハードウェアレイトレーシングに対応していない',
      'Windows 11ではない（最低環境からWindows 11）',
      'HDDにインストールしている・空き容量が足りない（150GB）',
      'GPUドライバーが古い',
      'ゲームファイルの破損、オーバーレイや常駐ツールの干渉',
    ],
    quickFacts: [
      {
        label: '必須（最低環境から）',
        value:
          'ハードウェアレイトレーシング対応GPU／SSD／Shader Model 6.6以上のDirectX 12／Windows 11',
      },
      {
        label: '最低動作環境',
        value:
          'RTX 2060（6GB）・RX 6600 XT（8GB）／メモリ16GB（1080p・LOW・30fps、アップスケール使用）',
      },
      {
        label: '推奨動作環境',
        value:
          'RTX 3070・RX 6800／メモリ32GB（1080p・MEDIUM・60fps、アップスケール使用）',
      },
      { label: '空き容量', value: '150GB（SSD）' },
      {
        label: '発売日',
        value: '2026年10月2日（アーリーアクセスは9月29日から）',
      },
      {
        label: 'クラッシュ（公式が調査中）',
        value:
          '推奨ドライバーに更新／SSDの空きを16GB以上／仮想メモリを有効に（9月29日の公式のお知らせ）',
      },
      {
        label: 'エラー ST-3100001',
        value:
          'ACE COMBAT ONLINEでサーバーとの通信が切れた時に出る。Windowsの時刻を同期（公式）',
      },
    ],
    diagnosis: [
      {
        symptom: 'GTX 10／16シリーズ、RX 5000シリーズ以前で起動しない',
        cause: 'レイトレーシング非対応のGPU',
        stepId: 'step-1',
      },
      {
        symptom: 'Windows 10のPCで起動しない',
        cause: 'OSが要件を満たしていない',
        stepId: 'step-2',
      },
      {
        symptom: '読み込みで止まる・HDDに入れている',
        cause: 'SSD必須・空き容量不足',
        stepId: 'step-3',
      },
      {
        symptom: '要件は満たしているのに起動直後に落ちる',
        cause: '推奨ドライバーを確認（クラッシュだけでは原因は確定しない）',
        stepId: 'step-4',
      },
      {
        symptom: 'オーバーレイ使用中に落ちる・ファイルが壊れている',
        cause: '常駐ツールの干渉・ファイル破損',
        stepId: 'step-5',
      },
      {
        symptom: 'プレイ中にだけ落ちる',
        cause: '設定・メモリの負荷・仮想メモリ',
        stepId: 'step-6',
      },
      {
        symptom: 'オンラインで「ST-3100001」が出て続けられない',
        cause: 'サーバーとの通信切れ・PCの時刻のずれ',
        stepId: 'step-7',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'GPUがハードウェアレイトレーシングに対応しているか確認する',
        summary:
          '公式のシステム要件では、レイトレーシング対応GPUが最低環境から必須です。非対応のGPUは、設定を変えても要件を満たせません。',
        time: '約2分',
        risk: 'low',
        actions: [
          'Ctrl + Shift + Esc でタスクマネージャーを開き、「パフォーマンス」→「GPU」の右上でGPU名を確認する',
          'NVIDIA：GeForce RTX 20シリーズ以降は対応。GTX 10／16シリーズは非対応',
          'AMD：Radeon RX 6000シリーズ以降は対応。RX 5000シリーズ以前は非対応',
          '最低環境はRTX 2060（6GB）・RX 6600 XT（8GB）。対応GPUでも性能がこれを下回ると動作が重くなる',
        ],
      },
      {
        id: 'step-2',
        title: 'Windows 11か確認する',
        summary: '公式のシステム要件では、最低環境からOSがWindows 11です。',
        time: '約1分',
        risk: 'low',
        actions: [
          'Windows + R を押し、「winver」と入力してEnterを押す',
          '表示された画面で「Windows 11」と書かれているか確認する',
        ],
      },
      {
        id: 'step-3',
        title: 'SSDにインストールし、空き容量を確保する',
        summary:
          'SSDは必須で、必要な空き容量は150GBです。HDDに入れていると、起動しない・読み込みで止まる原因になります。',
        time: '約20分（移動するデータ量による）',
        risk: 'low',
        actions: [
          'Steamのライブラリでゲームを右クリック→「プロパティ」→「インストール済みファイル」→「インストールフォルダを移動」からSSDを選ぶ（再ダウンロード不要）',
          'インストール後も、ゲームを入れたSSDに16GB以上の空きを残す（公式がクラッシュ対策として推奨）',
        ],
      },
      {
        id: 'step-4',
        title: 'ゲームが示す推奨GPUドライバーを確認する',
        summary:
          '公式案内は起動時に示される推奨版の確認です。新しい版なら必ず安定するという意味ではありません。',
        time: '約10分',
        risk: 'low',
        actions: [
          'ゲームの起動時に推奨のドライバーのバージョンが表示された場合は、そのバージョンに更新する（公式）',
          'NVIDIA：NVIDIA Appからドライバーを更新する',
          'AMD：AMD Software: Adrenalin Editionから更新する',
          '更新後にPCを再起動してから起動する',
        ],
      },
      {
        id: 'step-5',
        title: 'ゲームファイルを確認し、オーバーレイを止める',
        summary:
          'ファイルの破損や、録画・FPS表示などの常駐ツールが、起動直後のクラッシュの原因になることがあります。',
        time: '約10分',
        risk: 'low',
        actions: [
          steamVerify,
          'Steamオーバーレイ、Discordオーバーレイ、録画・FPS表示ツールをオフにして起動を試す',
        ],
      },
      {
        id: 'step-6',
        title: 'プレイ中に落ちる時は設定と負荷を下げる',
        summary:
          '推奨環境はメモリ32GBです。16GBのPCでは、ほかのアプリを閉じるだけで安定することがあります。',
        time: '約5分',
        risk: 'low',
        actions: [
          'グラフィック設定を1段階下げる（特にテクスチャ品質）',
          'アップスケーリングを有効にする（公式の性能の目安もアップスケール使用時の数値）',
          'ブラウザなどの常駐アプリを閉じてメモリの空きを増やす',
          'Windowsの仮想メモリが有効か確認する（公式の案内）：「設定」→「システム」→「バージョン情報」→「システムの詳細設定」→「パフォーマンス」の「設定」→「詳細設定」タブ→「仮想メモリ」の「変更」で、「すべてのドライブのページング ファイルのサイズを自動的に管理する」にチェックが入っているか見る',
          'フライトスティックなど追加の入力機器を外して試す',
        ],
      },
      {
        id: 'step-7',
        title: 'オンラインで「ST-3100001」が出たらWindowsの時刻を同期する',
        summary:
          '公式によると、ACE COMBAT ONLINEでゲームサーバーとの通信が切れると、エラーコード「ST-3100001」が表示されます。',
        time: '約2分',
        risk: 'low',
        actions: [
          'タスクバーの時計がずれていないか確認する',
          '「設定」→「時刻と言語」→「日付と時刻」を開き、「今すぐ同期」を押す',
          'ゲームを起動し直して、もう一度オンラインに入る',
        ],
        note: '時刻のずれを秒単位で確かめる方法や、同期できない時の対処は「エラーコード ST-3100001の意味と直し方」の記事で詳しく解説しています。',
      },
    ],
    avoid: [
      'セキュリティ保護を無効にしたり、非公式サイトから替えのDLLを入れたりしない',
      'レイトレーシング非対応のGPUで、設定ファイルの書き換えや非公式ツールで起動させようとしない',
      '起動しないからといって、先にWindowsの再インストールをしない（まず要件を確認する）',
    ],
    cautions: [
      '公式はSteam版のクラッシュの原因を調査中です（2026年10月2日時点）。最新のお知らせも確認してください。',
      '直らない場合は、公式がSteamのお知らせに設けた「PC Crash Report Thread」（10月2日）に報告できます。公式は、PCの構成（GPU・CPU・メモリなど）、Windowsとシステムソフトウェアのバージョン、エラーメッセージや再現手順、一緒に起動していたアプリの一覧を書くよう求めています。',
    ],
    faqs: [
      {
        question: 'GTX 1660やGTX 1080で遊べますか？',
        answer:
          '遊べません。ハードウェアレイトレーシング対応GPUが必須で、GTX 10／16シリーズは性能に関係なく要件を満たしません。',
      },
      {
        question: 'エースコンバット7が動いたPCなら8も動きますか？',
        answer:
          '動かない場合があります。本作はレイトレーシング対応GPU・SSD・Windows 11・Shader Model 6.6以上のDirectX 12が必須で、前作より要件が大きく上がっています。',
      },
      {
        question: '4Kで遊ぶにはどのくらいの性能が必要ですか？',
        answer:
          '公式の「HIGH」設定・3840×2160（アップスケール使用）・60fpsの目安は、RTX 4080（16GB）・RX 7900 XTX（24GB）、Core i7-13700K・Ryzen 5 7600X、メモリ32GBです。',
      },
      {
        question:
          'フライトスティック（HOTAS）の設定が7のように細かくできません。',
        answer:
          '公式は、エースコンバット7で一部の機器に用意されていた設定の一部が8では使えないことを認め、改善を検討していると発表しています（9月30日）。対応には時間がかかる場合があるため、続報は公式のお知らせで確認してください。',
      },
      {
        question: 'オンラインは何人で遊べますか？クロスプレイは？',
        answer:
          'オンラインは最大8人です。クロスプラットフォームプレイに対応していますが、機種間でのセーブデータの共有（クロスセーブ）には対応していません（公式サイト）。',
      },
    ],
    sources: [
      {
        label:
          '公式告知本文：クラッシュ・ST-3100001・フライトスティック（英語、2026年10月4日確認）',
        url: 'https://steamcommunity.com/app/2288340/allnews/',
      },
      {
        label: 'Steam：ゲームファイルの整合性確認（英語）',
        url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB',
      },
      aceSources.notice,
      aceSources.official,
      aceSources.famitsu,
      aceSources.steam,
    ],
    related: ['error-st-3100001'],
    metaDescription:
      'PC版エースコンバット8（エスコン8）が起動しない・落ちる時の対処法。公式が調査中のクラッシュの確認事項（推奨ドライバー・SSDの空き16GB・仮想メモリ）、エラーST-3100001、レイトレーシング対応GPU・Windows 11・SSDが必須の動作環境まで公式情報をもとに解説。',
  }),
  make({
    gameSlug: 'shin-sangoku-musou-2-remastered',
    slug: 'not-launching',
    category: 'launch',
    seoTitle: '真・三國無双2 Remasteredが起動しない・重い時の対処法【PC版】',
    title:
      '真・三國無双２ with 猛将伝 Remasteredが起動しない・重い時の対処法【PC版】',
    shortTitle: '起動しない・重い',
    targetVersion: 'Steam版・体験版・2026年9月28日時点の動作環境',
    symptom:
      'PC版（Steam）や体験版が起動しない、起動直後に落ちる、読み込みが長い、戦場でカクつく・重い場合の確認手順です。',
    conclusion:
      'まずGPUのVRAMが6GB以上か、OSがWindows 11かを確認します。動作環境の最低条件はVRAM 6GBのGPUとWindows 11です。購入前なら、Steamで配信中の無料体験版で自分のPCで動くか確かめるのが確実です。',
    description:
      '発売は2026年10月1日（PC・PS5・Xbox Series X|S・Nintendo Switch 2）です。Unreal Engine 5で作られており、4K・ウルトラワイド・アップスケーリング・HDRに対応しています（ハードウェア環境に依存）。',
    causes: [
      'GPUのVRAMが6GB未満（GTX 1060 3GBモデルなど）',
      'Windows 11ではない',
      'GPUドライバーが古い',
      '初回起動時の読み込み（シェーダーの準備）の途中で終了している',
      '解像度や画質が高すぎる',
    ],
    quickFacts: [
      {
        label: '最低動作環境',
        value:
          'Windows 11／GTX 1060・RX 5600 XT・Arc A380（VRAM 6GB）／メモリ16GB（1080p・30fps・「低」）',
      },
      {
        label: '推奨動作環境',
        value:
          'RTX 3060・RX 6700 XT（VRAM 8GB）／メモリ16GB（1080p・60fps・「高」）',
      },
      { label: '空き容量', value: '60GB' },
      {
        label: '体験版',
        value: 'Steamで無料配信中（製品版へのセーブデータ引き継ぎなし）',
      },
      { label: '発売日', value: '2026年10月1日' },
    ],
    diagnosis: [
      {
        symptom: '起動しない・すぐ落ちる（古いGPU）',
        cause: 'VRAM 6GB未満',
        stepId: 'step-1',
      },
      {
        symptom: 'Windows 10のPCで起動しない',
        cause: 'OSが要件を満たしていない',
        stepId: 'step-2',
      },
      {
        symptom: '起動直後に落ちる・黒画面',
        cause: '古いドライバー',
        stepId: 'step-3',
      },
      {
        symptom: '初回の読み込みが長い・止まったように見える',
        cause: 'シェーダーの準備中',
        stepId: 'step-4',
      },
      {
        symptom: '敵が多い場面で重い・カクつく',
        cause: '画質・解像度が高い',
        stepId: 'step-5',
      },
      {
        symptom: 'コントローラーが反応しない',
        cause: 'Steam Inputの設定',
        stepId: 'step-6',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'GPUのVRAMが6GB以上か確認する',
        summary:
          '最低動作環境のGPUは、いずれもVRAM 6GBのモデルです。同じGTX 1060でも3GBモデルは要件を満たしません。',
        time: '約2分',
        risk: 'low',
        actions: [
          'Ctrl + Shift + Esc でタスクマネージャーを開き、「パフォーマンス」→「GPU」を選ぶ',
          '右上のGPU名と「専用GPUメモリ」（VRAM）の容量を確認する',
          'フルHDより高い解像度やワイドモニターでは、設定次第でさらにVRAMが必要になる（Steamストアの注記）',
        ],
      },
      {
        id: 'step-2',
        title: 'Windows 11か確認する',
        summary: '動作環境では、最低・推奨ともOSがWindows 11（64bit）です。',
        time: '約1分',
        risk: 'low',
        actions: [
          'Windows + R を押し、「winver」と入力してEnterを押す',
          '表示された画面で「Windows 11」と書かれているか確認する',
        ],
      },
      {
        id: 'step-3',
        title: 'GPUドライバーを最新にする',
        summary:
          '古いドライバーのままだと、起動直後に落ちる・黒画面になることがあります。',
        time: '約10分',
        risk: 'low',
        actions: [
          'NVIDIA：NVIDIA Appからドライバーを更新する',
          'AMD：AMD Software: Adrenalin Editionから更新する',
          'Intel Arc：Intelの公式サイトから最新のドライバーを入手する',
          '更新後にPCを再起動してから起動する',
        ],
      },
      {
        id: 'step-4',
        title: '初回起動時の読み込みが終わるまで待つ',
        summary:
          'Unreal Engine 5のゲームでは一般に、初回起動時やドライバー更新後にシェーダーの準備が行われ、読み込みが長くなったり最初の戦場で一時的にカクついたりします。',
        time: '数分',
        risk: 'low',
        actions: [
          '読み込み中に止まったように見えても、数分は待ってから判断する',
          '途中で強制終了すると、次回また準備からやり直しになることがある',
        ],
      },
      {
        id: 'step-5',
        title: '画質を下げ、アップスケーリングを使う',
        summary:
          '無双シリーズは大量の敵が同時に表示されるため、敵が密集する場面だけ重くなることがあります。',
        time: '約5分',
        risk: 'low',
        actions: [
          'アップスケーリングを有効にする（公式の性能の目安もアップスケール使用時の数値）',
          '4K・WQHDの場合は解像度を下げる',
          '影・エフェクト系の品質を1段階下げる',
          'フレームレートの上限を60fpsに固定する',
          steamVerify,
        ],
      },
      {
        id: 'step-6',
        title: 'コントローラーが反応しない時はSteam Inputを切り替える',
        summary: '本作は各種ゲームパッドとSteam入力に対応しています。',
        time: '約3分',
        risk: 'low',
        actions: [
          'Steamライブラリで本作を右クリック→「プロパティ」→「コントローラー」で、Steam Inputの設定を「有効」「無効」と切り替えて試す',
          '複数のコントローラーを接続している場合は、使う1台だけにする',
        ],
      },
    ],
    avoid: [
      '初回の読み込み中に、止まったと判断して何度も強制終了しない',
      '体験版と製品版の両方で同時に設定を変えない（体験版は仕様が異なる場合がある）',
    ],
    cautions: [
      '発売直後に見つかった不具合は、公式の告知とアップデートで修正されることがあります。最新のお知らせも確認してください。',
    ],
    faqs: [
      {
        question: '体験版で動けば製品版も動きますか？',
        answer:
          '体験版の動作環境は製品版と同じなので、動作確認の目安になります。ただし体験版は製品版と仕様が異なる場合があり、セーブデータは製品版に引き継げません。',
      },
      {
        question: '2人で遊べますか？',
        answer:
          'オフラインでは画面を分割して2人で遊べます（無双モード・フリーモード・VSモード）。オンラインでの2人プレイは、発売後のアップデートで対応する予定と発表されています。',
      },
      {
        question: '通常版とDigital Deluxe Editionで動作は変わりますか？',
        answer:
          '動作環境は同じです。公式は、両エディションの重複購入に注意するよう案内しています。',
      },
    ],
    sources: [
      musouSources.official,
      musouSources.steam,
      musouSources.demo,
      musouSources.watch,
    ],
    related: [],
    metaDescription:
      'PC版 真・三國無双２ with 猛将伝 Remasteredが起動しない・重い時の対処法。最低要件のVRAM 6GBとWindows 11の確認、初回読み込み、軽くする設定の順番、コントローラーの設定まで解説。体験版での事前確認も。',
  }),
];
