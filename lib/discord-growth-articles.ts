import type { DiscordArticle } from '@/lib/discord-articles';

const official = (id: string, label: string) => ({
  label: `Discord公式サポート：${label}`,
  url: `https://support.discord.com/hc/en-us/articles/${id}`,
});

const status = {
  label: 'Discord Status（公式障害情報）',
  url: 'https://discordstatus.com/',
};

const generalTroubleshooting = official(
  '31623498041623-Discord-Troubleshooting-Guide',
  '一般的なトラブルシューティング（英語）',
);
const voiceVideoGuide = official(
  '360045138471-Discord-Voice-and-Video-Troubleshooting-Guide',
  '音声・ビデオのトラブルシューティング（英語）',
);
const loginGuide = official(
  '32557375603479-Discord-Login-Email-Troubleshooting-Guide',
  'ログインとメールのトラブルシューティング（英語）',
);
const bugsGuide = official(
  '360046057772-Discord-Bugs',
  '不具合を報告する前の確認事項（英語）',
);

export const discordGrowthArticles: DiscordArticle[] = [
  {
    slug: 'slow-performance',
    category: 'launch',
    title: 'Discordが重い・動作が遅いときの対処法【PC版】',
    shortTitle: 'Discordが重い・遅い',
    seoTitle: 'Discordが重い・動作が遅いときの対処法【PC版】',
    metaDescription:
      'Discordが重い、画面切り替えや通話が遅いときのPC向け対処法。再起動、通信と負荷の確認、ハードウェアアクセラレーションの切り分けを順に説明します。',
    symptom:
      'Discordの画面切り替えが遅い、入力が引っかかる、通話や配信中に動作が重くなる場合の切り分け手順です。障害や回線の問題と、PC・アプリ側の負荷を分けて確認します。',
    target: 'Windows 11 / Windows 10版 Discordデスクトップアプリ',
    conclusion:
      'Discordを完全終了して最新版へ更新し、公式ステータスと通信状態を確認します。PC全体が重い場合は負荷の高いアプリを閉じ、Discordだけが重い場合はハードウェアアクセラレーションの切り替えを試します。',
    quickFixes: [
      'Discordを完全終了し、PCを再起動して最新版のDiscordを開く',
      'Discord Statusと通信状態を確認し、ダウンロードなど負荷の高い処理を止める',
      'Discordのハードウェアアクセラレーションを切り替えて再起動する',
    ],
    causes: [
      {
        title: 'Discordの一時的な不調、または更新が反映されていない',
        description:
          '長時間起動したままのアプリや、バックグラウンドに残ったプロセスが動作を不安定にする場合があります。',
        actions: [
          '通知領域のDiscordアイコンを右クリックし、Discordを終了する',
          'タスクマネージャーでDiscordのプロセスが残っていないことを確認する',
          'PCを再起動し、Discordを開いて更新が完了するまで待つ',
        ],
      },
      {
        title: '通信またはPCの処理負荷が高い',
        description:
          'ゲーム、配信、ダウンロードを同時に行うと、回線やCPU・メモリ・GPUの不足でDiscordも遅くなることがあります。',
        actions: [
          'Discord Statusで障害が発生していないか確認する',
          '大容量ダウンロード、録画、不要なブラウザタブを一時的に閉じる',
          'タスクマネージャーでCPU、メモリ、GPU、ネットワークの使用率を確認する',
          'Wi-Fiの場合はルーターに近づくか、有線接続で改善するか確認する',
        ],
        note: 'Discord全体の障害中は、設定変更や再インストールをせず復旧を待ってください。',
      },
      {
        title: '描画処理とGPUドライバーの相性',
        description:
          '画面のスクロールや動画表示だけが重い場合は、ハードウェアアクセラレーションの切り分けが役立ちます。',
        actions: [
          'ユーザー設定の「詳細設定」を開く',
          'ハードウェアアクセラレーションを現在と反対の状態へ切り替える',
          'Discordを再起動して動作を比較する',
          '改善しない場合は元の設定に戻し、GPUドライバーをメーカー公式手順で更新する',
        ],
      },
    ],
    ifNotFixed:
      'ブラウザ版Discordでは軽いか確認してください。ブラウザ版だけ正常ならデスクトップアプリ側、両方で重いなら通信やDiscord側の障害の可能性があります。公式手順後も続く場合は、発生時刻、PC構成、使用率、再現手順を添えてDiscordサポートへ報告してください。',
    faqs: [
      {
        question: 'ハードウェアアクセラレーションはオフにした方がよいですか？',
        answer:
          '常にオフが正解ではありません。GPUやドライバーとの組み合わせで結果が変わるため、切り替え前後を比較し、改善しなければ元に戻してください。',
      },
      {
        question: 'ゲーム中だけDiscordが重くなるのはなぜですか？',
        answer:
          'ゲームがCPU、メモリ、GPU、回線を多く使い、Discordに回る余裕が不足している可能性があります。録画や配信を止め、タスクマネージャーで負荷を確認してください。',
      },
      {
        question: '再インストールを最初に試すべきですか？',
        answer:
          '先に完全終了、障害確認、PC負荷と描画設定を確認してください。再インストールはアプリ側だけに問題が残る場合の後段の手順です。',
      },
    ],
    sources: [generalTroubleshooting, voiceVideoGuide, status],
    related: ['loading-stuck', 'crashing', 'screen-share-not-working'],
    checkedAt: '2026-09-19',
    status: 'verified',
  },
  {
    slug: 'camera-not-working', category: 'screen',
    title: 'Discordでカメラが映らない時の直し方【自分・相手の画面で切り分け】',
    shortTitle: 'カメラが映らない',
    seoTitle: 'Discordでカメラが映らない・黒い時の直し方【Windows】',
    metaDescription: 'Discordでカメラが映らない時は、Windowsカメラ・Discordプレビュー・相手の画面を順に比較。カメラ選択、アクセス許可、特定サーバーだけ使えない場合の確認手順を解説します。',
    symptom: 'カメラが一覧に出ない、プレビューが黒い、自分には映るのに相手には映らない場合の手順です。ゲームの画面共有ではなく、内蔵・USBカメラのビデオ通話を対象にします。',
    target: 'Windows 11／Windows 10のDiscordデスクトップアプリ',
    conclusion: '最初にWindowsのカメラアプリで映るか確認し、アプリを閉じてからDiscordのビデオテストを試します。両方映らないなら機器・Windows側、Windowsだけ映るならDiscordの選択機器やデスクトップアプリの権限を確認。プレビューは映るのに相手に届かない場合は通話のカメラ開始と受信側を比較します。',
    quickFixes: [
      'スタートで「カメラ」を検索し、Windowsのカメラアプリで映像を確認する',
      'カメラアプリを閉じ、Discordの「音声・ビデオ」で同じカメラを選びビデオテストを行う',
      'プレビューが映ったら通話でカメラをオンにし、相手にも映像が届くか確認する',
    ],
    diagnosisTitle: 'どの画面まで映る？ カメラの結果別判定表',
    diagnosisIntro: 'Windowsカメラ・Discordのプレビュー・相手が受信した映像を区別します。カメラを使うアプリは同時に開かず、1つずつ終了して比較してください。',
    diagnosis: [
      { symptom: 'Windowsのカメラアプリでも黒い・機器が見つからない', check: 'レンズのカバー、カメラのスイッチ、接続、権限を確認', causeIndex: 2 },
      { symptom: 'Windowsでは映る／Discordのプレビューは黒い', check: '同じカメラを選択し、デスクトップアプリのアクセス許可を確認', causeIndex: 3 },
      { symptom: 'プレビューは映る／通話相手には映らない', check: '通話でカメラをオンにしたか、別の相手には届くか比較', causeIndex: 4 },
      { symptom: 'DMでは映る／特定サーバーだけ開始できない', check: '対象チャンネルのビデオ権限を管理者に確認', causeIndex: 5 },
      { symptom: '物理カメラは映る／仮想カメラだけ黒い', check: '仮想カメラを提供するソフトの映像出力を確認', causeIndex: 3 },
    ],
    causes: [
      {
        title: 'Windows・Discord・相手の画面を順に比較する',
        description: '設定をまとめて変える前に、どこまで映像を取得・送信できているか確認します。',
        actions: [
          'Discordのビデオをオフにし、Zoom・Teamsなどカメラを使うアプリを終了する。スタートで「カメラ」を検索して開く',
          '複数のカメラがある場合は使う機器へ切り替える。レンズの前で手を動かし、映像が更新されるか確認する。エラーが出る場合は表示されたコードを控える',
          'Windowsのカメラアプリを閉じる。Discord左下の歯車 →「音声・ビデオ」→ビデオ設定で使うカメラを選び、「ビデオをテスト」で同じ動きを確認する',
          'Windowsでも映らないなら手順2へ。Windowsでは映るのにDiscordでは映らないなら手順3へ。プレビューが映ったら手順4で実際の通話を確認する',
        ],
        note: 'ビデオテストの成功は相手への送信成功とは別です。通話でカメラをオンにする操作と、相手の受信確認まで行ってください。',
      },
      {
        title: 'Windowsでも映らない：カバー・接続・権限を確認',
        description: 'Discordだけの設定を変える前に、Windowsで同じカメラを使える状態を確認します。',
        actions: [
          'レンズのプライバシーカバーが閉じていないか、PC本体のカメラスイッチやカメラ無効キーがオフになっていないか確認する',
          'USBカメラはハブを介さずPCの別のUSB端子へ直接接続し、Windowsのカメラアプリで再確認する',
          'Windows 11は「設定 → プライバシーとセキュリティ → カメラ」、Windows 10は「設定 → プライバシー → カメラ」を開く。カメラへのアクセスとカメラアプリのアクセスを許可する',
          'まだ映らなければPCを再起動する。スタートを右クリック →「デバイス マネージャー」の「カメラ」などで機器名や警告表示を確認し、PC・カメラメーカーの対応ドライバーを確認する',
          '別のカメラがあれば同じアプリで比較する。別機器だけ映るなら元のカメラ・接続側、両方映らないならWindowsのアクセス制限などを確認する',
        ],
        note: '設定が灰色で変更できない管理対象PCでは、管理者へ確認してください。権限や接続を調べる前にカメラ故障とは断定しません。',
      },
      {
        title: 'Windowsだけ映る：Discordの機器選択とアクセス許可',
        description: 'Windowsのカメラアプリで映っても、デスクトップアプリのアクセス許可やDiscordの選択機器は別に確認が必要です。',
        actions: [
          'Windowsのカメラアプリやほかの通話アプリを完全に終了し、Discordの「音声・ビデオ」で実際のカメラ名を選び直す',
          'Windowsのカメラのプライバシー設定で「デスクトップ アプリがカメラにアクセスできるようにする」に相当する項目をオンにする。アプリ一覧にDiscordの個別スイッチがなくても、この設定を確認する',
          '仮想カメラを選んでいる場合は物理カメラに切り替えて比較する。物理カメラだけ映るなら、仮想カメラを提供するソフトの起動・映像出力を確認する',
          'Discordを終了して再起動し、再びビデオテストを行う。直らなければアプリを終了してからブラウザ版Discordで同じカメラを選び、サイトのカメラ利用を許可して比較する',
          'ブラウザ版だけ映る場合はDiscordアプリの更新を確認する。続く場合は「音声・ビデオ」のビデオ設定でハードウェアアクセラレーションの現在値を控え、切り替えて再起動し比較する。変化がなければ元に戻す',
        ],
      },
      {
        title: '自分には映る：通話のカメラ開始と相手側を確認',
        description: 'プレビューは送信前の確認画面です。相手に届かない場合は、実際の通話でカメラがオンになっているかを確認します。',
        actions: [
          '設定画面を閉じて通話へ戻り、通話パネルのカメラアイコンでカメラをオンにする。プレビューの確認画面が出た場合は内容を確認して開始する',
          '自分が手を動かし、相手に「映像がない」「黒い」「静止している」「動いている」のどれかを答えてもらう',
          '可能なら別の参加者にも同じ映像を確認してもらう。1人だけ映らないなら、その相手に通話への再参加とDiscord再起動、ブラウザ版での比較を依頼する',
          '全員に届かない場合は、自分のカメラをオフ・オンにして再確認する。DM通話で映るなら手順5へ、DMでも届かないならDiscord Statusと接続状態を確認し、可能なら別回線で比較する',
        ],
      },
      {
        title: '特定サーバーだけ映らない：ビデオ権限を確認',
        description: '同じ機器でDM通話は映るのに特定のボイスチャンネルだけ開始できない場合は、サーバー・チャンネルの条件を確認します。',
        actions: [
          '同じ相手とのDM通話と、問題のボイスチャンネルで結果を比較する。別チャンネルでは開始できるかも確認する',
          'サーバー管理者に「サーバー設定 → ロール」の対象ロールで「ビデオ」権限が許可されているか確認してもらう',
          '対象ボイスチャンネルの編集画面 →「権限」で、ロールや個人への上書き設定も確認してもらう',
          '必要な権限を変更したら入り直してカメラをオンにし、相手に映像が届くか再確認する。エラーや人数制限の表示がある場合は、その文言も管理者へ伝える',
        ],
      },
    ],
    ifNotFixed: 'Windowsカメラ／Discordプレビュー／相手の受信画面の結果、カメラ名、内蔵・USB・仮想の種別、DMとサーバーの違い、エラー文言を控えてください。Windowsでも映らない場合はPC・カメラメーカー、Discordだけの場合はDiscord公式サポートへ、この比較結果と試した操作を伝えます。',
    faqs: [
      { question: 'Windowsのカメラでは映るのにDiscordでは黒いのはなぜですか？', answer: 'Discordで選んだ機器が違う、別アプリが使用中、デスクトップアプリのアクセスが許可されていないなどの可能性があります。カメラアプリを閉じてから同じ機器で再テストしてください。' },
      { question: 'Windowsの許可一覧にDiscordがありません', answer: 'デスクトップアプリはMicrosoft Storeアプリと同じ個別スイッチ一覧に出ない場合があります。カメラのプライバシー設定にある、デスクトップアプリへのアクセス許可を確認してください。' },
      { question: '自分のプレビューが映れば、相手にも映っていますか？', answer: 'プレビューだけでは送信成功を確認できません。通話へ戻ってカメラをオンにし、相手に映像が動いているか確認してもらってください。' },
      { question: 'ゲームの画面共有が黒い場合も同じ手順ですか？', answer: 'この記事はカメラのビデオ通話が対象です。ゲームやデスクトップを共有した映像だけ黒い場合は、関連記事「画面共有の黒画面」で共有対象と視聴者側を比較してください。' },
    ],
    sources: [voiceVideoGuide,
      { label: 'Discord公式：ビデオ通話・カメラテスト・ビデオ権限', url: 'https://support.discord.com/hc/ja/articles/360041721052' },
      { label: 'Microsoft公式：Windowsでカメラが機能しない場合', url: 'https://support.microsoft.com/ja-jp/windows/hardware/camera/camera-doesn-t-work-in-windows' },
      { label: 'Microsoft公式：カメラへのアプリのアクセス許可', url: 'https://support.microsoft.com/ja-jp/windows/privacy/manage-app-permissions-for-a-camera-in-windows' },
    ],
    related: ['screen-share-black-screen', 'screen-share-not-working', 'stream-stuttering'],
    checkedAt: '2026-09-28', status: 'verified',
    ogTitle: 'Discordでカメラが映らない？',
    ogSteps: ['Windowsのカメラで映る？', '閉じてDiscordのテストへ', '通話相手にも映像が届く？', '特定サーバーだけなら権限確認'],
  },
  {
    slug: 'login-error',
    category: 'launch',
    title: 'Discordにログインできないときの対処法',
    shortTitle: 'ログインできない',
    seoTitle: 'Discordにログインできないときの対処法｜メール・パスワードを確認',
    metaDescription:
      'Discordにログインできない場合の対処法。障害確認、メールアドレスと電話番号、パスワード再設定、アプリとブラウザの切り分けを説明します。',
    symptom:
      'Discordにメールアドレスや電話番号を入力してもログインできない、「Email does not exist」などが表示される、正しいはずのパスワードで先へ進めない場合の手順です。',
    target: 'Windows版・ブラウザ版 Discord',
    conclusion:
      '公式ステータスを確認したうえで、登録したメールアドレスまたは電話番号を確認し、パスワード再設定を試します。アプリだけで失敗する場合はブラウザ版で切り分けてください。',
    quickFixes: [
      'Discord Statusでログイン障害が発生していないか確認する',
      '登録したメールアドレスまたは電話番号でログインし直す',
      '「パスワードを忘れた場合」から公式の再設定メールを送る',
    ],
    causes: [
      {
        title: 'Discord側で障害が発生している',
        description:
          '認証サービスの障害中は、正しい情報でもログインに失敗する場合があります。',
        actions: [
          'Discord Statusを開く',
          'LoginやAuthenticationに関する障害が出ていないか確認する',
          '障害がある場合は設定を変更せず、復旧後にもう一度試す',
        ],
      },
      {
        title: '登録したメールアドレスや電話番号と一致していない',
        description:
          '公式によると「Email does not exist」は、入力したメールアドレスがDiscordアカウントに紐付いていない場合に表示されます。',
        actions: [
          '別の端末やブラウザでログイン済みなら、ユーザー設定の「マイアカウント」で登録メールを確認する',
          '心当たりのあるメール受信箱でDiscordから届いたメールを検索する',
          '電話番号を登録している場合は、ログイン画面で電話番号を試す',
          '心当たりのあるメールアドレスでパスワード再設定メールを送る',
        ],
        note: 'Discordサポートは、アカウントに登録されたメールアドレスを本人へ開示できないと案内しています。',
      },
      {
        title: 'パスワードまたはアプリ側に問題がある',
        description:
          'パスワードが不明な場合は公式の再設定を使い、アプリだけで失敗する場合はブラウザ版で切り分けます。',
        actions: [
          'ログイン画面の「パスワードを忘れた場合」を選ぶ',
          'Discordから届くメールのリンクからパスワードを再設定する',
          'ブラウザ版Discordで同じアカウントへログインできるか確認する',
          'ブラウザ版だけ成功する場合は、デスクトップアプリを完全終了して更新する',
        ],
      },
    ],
    ifNotFixed:
      'メールへのアクセスを失った場合、Discord公式は登録メールを変更するために元のメールへアクセスできる必要があると案内しています。まずメール提供元へ復旧を依頼してください。二要素認証やバックアップコードの問題を回避する非公式ツールは使わず、Discord公式サポートを利用してください。',
    faqs: [
      {
        question: '「Email does not exist」と表示されます',
        answer:
          '入力したメールアドレスがDiscordアカウントに紐付いていない状態です。別端末のログイン状態、Discordから届いた過去メール、登録した電話番号を確認してください。',
      },
      {
        question: '登録したメールアドレスをDiscordサポートに教えてもらえますか？',
        answer:
          'Discord公式は、アカウントに紐付いたメールアドレスをサポートから開示できないと案内しています。ログイン済み端末や受信箱を確認してください。',
      },
      {
        question: 'メールへアクセスできない場合、登録メールを変更できますか？',
        answer:
          'Discord公式では、登録メールを変更するために元のメールへアクセスできる必要があると案内しています。先にメール提供元へアカウント復旧を依頼してください。',
      },
    ],
    sources: [loginGuide, status],
    related: ['loading-stuck', 'update-failed', 'not-opening'],
    checkedAt: '2026-09-19',
    status: 'verified',
  },
  {
    slug: 'crashing',
    category: 'launch',
    title: 'Discordが落ちる・勝手に終了するときの対処法【Windows】',
    shortTitle: 'Discordが落ちる',
    seoTitle: 'Discordが落ちる・勝手に終了するときの対処法【Windows】',
    metaDescription:
      'Discordが起動後や通話中に落ちる、勝手に終了する場合のWindows向け対処法。更新、描画設定、ドライバー、再インストールを順に確認します。',
    symptom:
      'Discordが起動直後に閉じる、通話や画面共有を始めると落ちる、操作中にウィンドウが突然消える場合の切り分け手順です。',
    target: 'Windows 11 / Windows 10版 Discordデスクトップアプリ',
    conclusion:
      'DiscordとWindowsを更新して再起動し、画面共有や動画で落ちる場合はハードウェアアクセラレーションとGPUドライバーを確認します。アプリだけが落ち続ける場合は公式手順で再インストールします。',
    quickFixes: [
      'Discordを完全終了し、Windowsを再起動して最新版を開く',
      '画面共有や動画で落ちる場合はハードウェアアクセラレーションを切り替える',
      'ブラウザ版で再現するか確認し、アプリだけなら再インストールする',
    ],
    causes: [
      {
        title: 'DiscordまたはWindowsの更新が反映されていない',
        description:
          '古いアプリや保留中の更新、終了しきっていないプロセスがクラッシュの原因になる場合があります。',
        actions: [
          '通知領域からDiscordを終了する',
          'タスクマネージャーでDiscordのプロセスが残っていないことを確認する',
          'Windowsを再起動し、Discordの更新を完了させる',
          'Discord Statusで障害が出ていないか確認する',
        ],
      },
      {
        title: '動画の描画処理やGPUドライバーに問題がある',
        description:
          '通話、カメラ、画面共有など映像を扱うときだけ落ちる場合は、GPU関連の切り分けを行います。',
        actions: [
          'ユーザー設定の「詳細設定」でハードウェアアクセラレーションを切り替える',
          'Discordを再起動して同じ操作を試す',
          'GPUメーカーの公式サイトまたはPCメーカーの手順でドライバーを更新する',
          '直らなければハードウェアアクセラレーションを元の状態に戻す',
        ],
      },
      {
        title: 'アプリのローカルファイルが破損している',
        description:
          'ブラウザ版は正常でデスクトップアプリだけが落ちる場合は、アプリ側のファイルを切り分けます。',
        actions: [
          'ブラウザ版Discordで同じアカウントと操作を試す',
          'アプリだけで落ちる場合はDiscordをアンインストールする',
          'Discord公式のトラブルシューティング手順に従って残存フォルダーを整理する',
          'discord.com/downloadから最新版を再インストールする',
        ],
      },
    ],
    ifNotFixed:
      '特定のサーバー、通話、画面共有だけで落ちるかを確認してください。再現手順、発生時刻、WindowsとDiscordのバージョン、クラッシュ前に行った操作を整理し、公式の不具合報告手順に従ってDiscordサポートへ連絡してください。',
    faqs: [
      {
        question: 'ゲーム中だけDiscordが落ちます',
        answer:
          'PC負荷やゲームオーバーレイ、GPUの描画処理が影響している可能性があります。オーバーレイを一時的にオフにし、ハードウェアアクセラレーションとGPUドライバーを切り分けてください。',
      },
      {
        question: '通話や画面共有を始めると落ちます',
        answer:
          '音声・映像機能に関係する可能性があります。Discord公式の音声・ビデオ手順に沿って、権限、デバイス、ドライバー、ハードウェアアクセラレーションを確認してください。',
      },
      {
        question: 'ブラウザ版は使える場合、アカウントに問題はありませんか？',
        answer:
          'ブラウザ版で同じ操作が正常なら、アカウントやDiscord全体よりもデスクトップアプリのローカル環境に問題がある可能性が高くなります。',
      },
    ],
    sources: [generalTroubleshooting, voiceVideoGuide, bugsGuide, status],
    related: ['not-opening', 'slow-performance', 'update-failed'],
    checkedAt: '2026-09-19',
    status: 'verified',
  },
];
