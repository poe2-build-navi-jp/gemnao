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
    slug: 'camera-not-working',
    category: 'screen',
    title: 'Discordでカメラが映らないときの対処法【PC版】',
    shortTitle: 'カメラが映らない',
    seoTitle: 'Discordでカメラが映らないときの対処法【PC版】',
    metaDescription:
      'Discordでカメラが映らない、黒い画面になる場合のPC向け対処法。カメラ選択、Windowsの権限、ドライバーとUSB接続を順に確認します。',
    symptom:
      'Discordのビデオ通話で自分の映像が出ない、プレビューが黒い、カメラを開始できない場合の手順です。カメラ自体の問題とDiscordの設定・権限を切り分けます。',
    target: 'Windows 11 / Windows 10版 Discordデスクトップアプリ',
    conclusion:
      'Discordの「音声・ビデオ」で正しいカメラを選び、Windowsのカメラアクセスを許可します。次にほかのカメラ使用アプリを閉じ、USB接続とドライバーを確認してください。',
    quickFixes: [
      'Discordの「音声・ビデオ」で使用するカメラを選び直す',
      'Windowsのプライバシー設定でデスクトップアプリのカメラアクセスを許可する',
      'ZoomやOBSなどカメラを使うアプリを閉じ、カメラを挿し直す',
    ],
    causes: [
      {
        title: 'Discordが別のカメラを選んでいる',
        description:
          '内蔵カメラとUSBカメラがあるPCでは、Discordが使っていない機器を選択している場合があります。',
        actions: [
          'Discordの歯車アイコンからユーザー設定を開く',
          '「音声・ビデオ」を開き、カメラの一覧から使う機器を選ぶ',
          'ビデオのプレビューで映像が表示されるか確認する',
        ],
      },
      {
        title: 'Windowsまたはチャンネルの権限が不足している',
        description:
          'Windowsのプライバシー設定や、Discordのボイスチャンネル権限でビデオが許可されていないと使用できません。',
        actions: [
          'Windowsの設定から「プライバシーとセキュリティ」→「カメラ」を開く',
          'カメラへのアクセスと、デスクトップアプリのアクセスをオンにする',
          '特定サーバーだけで使えない場合は、チャンネルのビデオ権限を管理者に確認する',
        ],
      },
      {
        title: 'ほかのアプリ、USB接続、ドライバーが競合している',
        description:
          '別のアプリがカメラを使用中、またはUSB接続やドライバーに問題があるとDiscordから映像を取得できません。',
        actions: [
          'Zoom、Teams、OBS、ブラウザなどカメラを使うアプリを終了する',
          'USBカメラを別のUSBポートへ直接接続する',
          'Windowsのカメラアプリで映像が出るか確認する',
          'PCメーカーまたはカメラメーカーの公式手順でドライバーを更新する',
          'Discordだけで黒画面になる場合はハードウェアアクセラレーションを切り替えて再起動する',
        ],
      },
    ],
    ifNotFixed:
      'ブラウザ版DiscordとWindowsのカメラアプリで映るか確認してください。どちらでも映らない場合はDiscordではなく、カメラ本体・Windows・ドライバー側の問題です。Discordだけで再現する場合は、カメラ名と試した手順を添えて公式サポートへ連絡してください。',
    faqs: [
      {
        question: 'カメラは映るのに特定のサーバーだけビデオを開始できません',
        answer:
          'そのボイスチャンネルでビデオ権限が許可されているか、サーバー管理者に確認してください。端末側の設定が正常でもチャンネル権限で制限される場合があります。',
      },
      {
        question: 'プレビューが黒い場合も同じ手順ですか？',
        answer:
          'はい。カメラ選択、Windowsの権限、ほかのアプリの終了を先に確認します。Discordだけ黒い場合は描画設定やGPUドライバーも切り分けてください。',
      },
      {
        question: '仮想カメラも使えますか？',
        answer:
          'カメラ一覧に表示される場合は選択できます。ただし映らない場合は、仮想カメラを提供するアプリが起動しているか、そのアプリ側の映像出力を確認してください。',
      },
    ],
    sources: [voiceVideoGuide],
    related: ['screen-share-black-screen', 'screen-share-not-working', 'error-1001'],
    checkedAt: '2026-09-19',
    status: 'verified',
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
