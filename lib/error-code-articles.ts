import type { GameArticle } from '@/lib/game-articles';

// Pages for one specific error code. New sites rank for an exact code much
// faster than for broad phrases, so when a publisher explains a code during
// launch week, give it its own page the same day.
// Rules: the code's meaning and the main fix must come from the publisher;
// player reports may add detail but are labelled as such.
// STEPのidは解決報告（D1）の集計キーなので、公開後は変更しないでください。

type Draft = Omit<GameArticle, 'symptoms' | 'seoTitle' | 'status'> & {
  seoTitle?: string;
};

const make = (draft: Draft): GameArticle => ({
  status: 'verified',
  symptoms: draft.steps.map((step) => ({ label: step.title, target: step.id })),
  seoTitle: draft.title,
  ...draft,
});

export const errorCodeArticles: GameArticle[] = [
  make({
    gameSlug: 'ace-combat-8',
    slug: 'error-st-3100001',
    category: 'server',
    checkedAt: '2026-10-18',
    seoTitle:
      'エースコンバット8のエラーコード「ST-3100001」の意味と直し方【PC版】',
    title:
      'エースコンバット8（エスコン8）のエラーコード「ST-3100001」の意味と直し方｜Windowsの時刻同期【PC・Steam版】',
    shortTitle: 'エラーコード ST-3100001',
    targetVersion:
      'Steam版（ACE COMBAT ONLINE）・時刻同期手順は10月13日更新、公式Steam告知は2026年10月18日（日本時間）確認',
    nextChecks: {
      heading: '症状に合う次の確認',
      links: [
        {
          href: '/games/ace-combat-8/time-sync-failed',
          label: '時刻同期が失敗する：同期結果と同期元を確認する',
        },
        {
          href: '/games/ace-combat-8/connection-after-time-sync',
          label: '同期後も切断される：公式告知と接続の範囲を確認する',
        },
        {
          href: '/games/ace-combat-8/not-launching',
          label: 'ゲーム自体が起動しない：起動・クラッシュの確認へ',
        },
      ],
    },
    symptom:
      'ACE COMBAT ONLINEのプレイ中や出撃のタイミングでエラーコード「ST-3100001」が表示され、プレイを続けられない場合の対処です。',
    conclusion:
      '公式によると「ST-3100001」は、ゲームサーバーとの通信が切れた時に汎用的に表示されるエラーです。公式は、Windowsの時刻がずれていないかを確認し、時刻を同期してから試すよう案内しています。まず「設定」→「時刻と言語」→「日付と時刻」で「今すぐ同期」を押し、Steamとゲームを再起動してください。',
    description:
      'Steamの公式掲示板では、エアベース・マッチング・機体選択までは進めるのに、実際の戦闘に入る時に毎回このエラーが出て、PCの時計が約2分ずれていたという報告があり、時刻を直したら解消したという返信が続いています（プレイヤーの報告）。',
    causes: [
      'ゲームサーバーとの通信が切れた（公式の説明）',
      'Windowsの時刻がずれている（公式が確認を案内）',
      '時刻同期に失敗している可能性（サービスの停止表示だけでは判断できない）',
      '回線が不安定（Wi-Fi・VPNなど）',
    ],
    quickFacts: [
      {
        label: 'エラーの意味（公式）',
        value: 'ゲームサーバーとの通信が切れた時に汎用的に表示される',
      },
      {
        label: '公式の対処',
        value: 'Windowsの時刻のずれを確認し、時刻同期をしてから再度試す',
      },
      {
        label: '時刻を同期する場所',
        value: '「設定」→「時刻と言語」→「日付と時刻」→「今すぐ同期」',
      },
      {
        label: 'ずれを数値で確かめる（管理者のPowerShell）',
        value:
          'w32tm /stripchart /computer:time.windows.com /samples:5 /dataonly',
        copy: true,
      },
      {
        label: 'ミッション終了後のエラー',
        value:
          '9月29日のX告知と9月30日のST告知は別件。今回確認した公式Steam告知では修正完了・対象ペナルティ解除完了の発表は未確認',
      },
    ],
    diagnosis: [
      {
        symptom: 'マッチング・機体選択までは進むが、出撃する時に毎回出る',
        cause: 'PCの時刻のずれ（プレイヤーの報告が多い）',
        stepId: 'sync-time',
      },
      {
        symptom: '「今すぐ同期」が失敗する・同期してもすぐずれる',
        cause: '同期エラーと同期元を確認。停止表示だけでは故障と判断できない',
        stepId: 'check-offset',
      },
      {
        symptom: '対戦中に突然出る・ほかのオンラインゲームも切れる',
        cause: '回線の不安定・サーバー側の問題',
        stepId: 'check-status',
      },
      {
        symptom: 'ミッション終了後、リザルト画面に進まずエラーになる',
        cause: '9月29日の告知対象と一致するか、後続の公式情報と照合',
        stepId: 'check-status',
      },
    ],
    steps: [
      {
        id: 'sync-time',
        title: 'Windowsの時刻を同期する（公式の対処）',
        summary:
          '公式が案内している対処です。時計が数分ずれているだけでも、実際の戦闘に入る時に失敗したという報告があります。',
        time: '約2分',
        risk: 'low',
        actions: [
          'Windowsキー＋Iで「設定」を開き、「時刻と言語」→「日付と時刻」を開く',
          '「時刻を自動的に設定する」がオンか、「タイム ゾーン」が「(UTC+09:00) 大阪、札幌、東京」になっているか確認する',
          '「追加の設定」の「今すぐ同期」を押す',
          'SteamとACE COMBAT 8を完全に終了してから起動し直し、もう一度出撃する',
        ],
        note: 'タスクバーの時計を右クリック→「日時を調整する」からも同じ画面を開けます。',
      },
      {
        id: 'check-offset',
        title: '時刻の同期状態と同期元を確認する',
        summary:
          '「今すぐ同期」の実際の結果を確認します。管理PCの同期設定は変更せず、担当者へ相談してください。',
        time: '約5分',
        risk: 'low',
        actions: [
          '自分で管理するPCで、コマンドプロンプトを「管理者として実行」し、w32tm /query /status と w32tm /query /source をそれぞれ実行する。',
          '最終同期成功時刻・同期元・エラーを控える。サービスの停止表示だけでは故障と限らず、古い成功時刻も今回の同期成功とは限らない。',
          '時差を追加で測る場合は w32tm /stripchart /computer:time.windows.com /samples:5 /dataonly を使う。小さい測定差でも、Windowsの同期処理やゲーム接続の成功は証明できない。',
          '同期に失敗する場合は下の専用手順へ進む。時刻サーバーやサービスの起動方式を自己判断で変えず、実際のエラーから次の確認を選ぶ。',
          '同期成功を確認したらSteamとACE COMBAT 8を再起動する。まだ切れる場合はSTEP 3へ進む。',
        ],
        note: '公式はすべての環境に共通する許容時差の秒数を示していません。プレイヤーの改善報告は個別例で、原因や成功率の証明ではありません。',
        guideLink: {
          href: '/games/ace-combat-8/time-sync-failed',
          label: 'Windowsの時刻同期そのものが失敗する場合',
          description: '実際のエラー、最終成功時刻、同期元を順に確認します。',
        },
      },
      {
        id: 'check-status',
        title: '公式の障害情報を確認し、回線を見直す',
        summary:
          'ST-3100001は通信が切れた時の汎用のエラーなので、時刻が正しくてもサーバー側や回線の問題で出ることがあります。',
        time: '約5分',
        risk: 'low',
        actions: [
          'エースコンバット公式X（@PROJECT_ACES）とSteamのニュースで、障害・メンテナンスの告知を確認する（ゲムなおの「障害・メンテ情報」でも確認できる）',
          'ミッション終了後にリザルト画面へ進まずエラーになる場合は、このページの公式告知履歴と発生場面を照合する。10月9日のマッチメイキング、10月16日のクラッシュ告知をST解消の証拠と混同しない。',
          '自分で管理する回線なら、同じPCで有線とWi-Fiを比較する。管理ネットワークの必須VPNや保護設定を変更しない。',
          'このゲームだけか、同じ回線の別端末やほかの通信も失敗するかを記録する。ゲームだけの失敗をサーバー障害と断定せず、下の切り分け記事へ進む。',
        ],
        guideLink: {
          href: '/games/ace-combat-8/connection-after-time-sync',
          label: '時刻同期後も切断される時の範囲の切り分け',
          description:
            '公式告知の日付、発生場面、別端末・接続方法の比較を整理します。',
        },
      },
    ],
    avoid: [
      'エラーが出たまま再出撃を何度も繰り返さない（時刻を直してから試す）',
      '時刻を手動でずらしたままにしない。確認が終わったら「時刻を自動的に設定する」をオンに戻す',
      '出どころの分からない修正ツールやスクリプトを使わない',
    ],
    cautions: [
      '9月29日のX告知は当時の対応・ペナルティ解除予定として掲載したものです。今回、投稿全文を再確認できておらず、公式Steam告知でも対象ペナルティ解除完了の発表は確認できませんでした。未確認は未解除の証明ではありません。',
      '「ST-3100001」以外のエラーコードについては、公式の説明が出たらこのサイトでも追記します。',
    ],
    faqs: [
      {
        question: '「ST-3100001」はどういう意味ですか？',
        answer:
          '公式の説明では、ゲームサーバーとの通信が切れた場合に汎用的に表示されるエラーです。原因は1つではありませんが、公式はまずWindowsの時刻同期を確認するよう案内しています。',
      },
      {
        question: 'エラーで途中抜けになり、ペナルティが付きました。',
        answer:
          '9月29日のX告知を基に、当時の対応・ペナルティ解除予定を紹介していました。2026年10月18日（日本時間）に確認した公式Steam告知では解除完了の発表は確認できず、X本文の再確認もできていません。個別アカウントの状態はこの情報から判断できません。',
      },
      {
        question:
          '時計は合っているように見えますが、それでも確認が必要ですか？',
        answer:
          'タスクバーの表示は分単位なので、数十秒〜2分程度のずれには気づきにくいです。Steamの掲示板では、見た目では分からない2分強のずれが原因だったという報告があります。「w32tm /stripchart」のコマンドで秒単位のずれを確認できます。',
      },
    ],
    sources: [
      {
        label: 'Microsoft Learn：W32Timeのトリガー起動と停止表示（英語）',
        url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/active-directory/w32time-not-start-on-workgroup',
      },
      {
        label:
          'Steamニュース（公式）：エラーコード：ST-3100001について（2026年9月30日）',
        url: 'https://steamcommunity.com/ogg/2288340/announcements/detail/695399726270382124',
      },
      {
        label:
          'エースコンバット公式X：ミッション終了後のエラーに関するお知らせ（2026年9月29日）',
        url: 'https://x.com/PROJECT_ACES/status/2104739973396373623',
      },
      {
        label:
          'Steamコミュニティ（プレイヤーの報告）：I FOUND HOW TO FIX ST-3100001',
        url: 'https://steamcommunity.com/app/2288340/discussions/0/594068631729585680/',
      },
      {
        label:
          'Microsoft Learn：Windows タイム サービスのツールと設定（w32tm）',
        url: 'https://learn.microsoft.com/ja-jp/windows-server/networking/windows-time-service/windows-time-service-tools-and-settings',
      },
    ],
    related: [
      'time-sync-failed',
      'connection-after-time-sync',
      'not-launching',
      'hotas-not-recognized',
      'stutter-audio-cutting-out',
    ],
    metaDescription:
      'エースコンバット8（エスコン8）のエラーコード「ST-3100001」は、公式によるとゲームサーバーとの通信が切れた時のエラー。公式の対処（Windowsの時刻同期）の手順、時刻のずれを秒単位で確かめるコマンド、ミッション終了後のエラーとペナルティ解除の公式告知を解説。',
  }),
];
