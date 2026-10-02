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
    checkedAt: '2026-10-02',
    seoTitle:
      'エースコンバット8のエラーコード「ST-3100001」の意味と直し方【PC版】',
    title:
      'エースコンバット8（エスコン8）のエラーコード「ST-3100001」の意味と直し方｜Windowsの時刻同期【PC・Steam版】',
    shortTitle: 'エラーコード ST-3100001',
    targetVersion: 'Steam版（ACE COMBAT ONLINE）・2026年10月2日時点',
    symptom:
      'ACE COMBAT ONLINEのプレイ中や出撃のタイミングでエラーコード「ST-3100001」が表示され、プレイを続けられない場合の対処です。',
    conclusion:
      '公式によると「ST-3100001」は、ゲームサーバーとの通信が切れた時に汎用的に表示されるエラーです。公式は、Windowsの時刻がずれていないかを確認し、時刻を同期してから試すよう案内しています。まず「設定」→「時刻と言語」→「日付と時刻」で「今すぐ同期」を押し、Steamとゲームを再起動してください。',
    description:
      'Steamの公式掲示板では、エアベース・マッチング・機体選択までは進めるのに、実際の戦闘に入る時に毎回このエラーが出て、PCの時計が約2分ずれていたという報告があり、時刻を直したら解消したという返信が続いています（プレイヤーの報告）。',
    causes: [
      'ゲームサーバーとの通信が切れた（公式の説明）',
      'Windowsの時刻がずれている（公式が確認を案内）',
      'Windowsの時刻同期サービスが止まっていて、自動で直らない',
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
          'リザルト画面に進まずエラーになる事象は公式が対応中。この事象で付いたペナルティは解除予定（9/29の公式告知）',
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
        cause: 'Windowsの時刻同期サービスが止まっている',
        stepId: 'check-offset',
      },
      {
        symptom: '対戦中に突然出る・ほかのオンラインゲームも切れる',
        cause: '回線の不安定・サーバー側の問題',
        stepId: 'check-status',
      },
      {
        symptom: 'ミッション終了後、リザルト画面に進まずエラーになる',
        cause: '公式が対応中の不具合（9/29告知）',
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
        title: '時刻のずれを数値で確かめ、同期サービスを動かす',
        summary:
          '「今すぐ同期」が失敗する場合や、同期しても直らない場合の確認です。使うのはWindows標準のコマンド（w32tm）だけです。',
        time: '約5分',
        risk: 'low',
        actions: [
          'Windowsキー＋Xを押し、「ターミナル（管理者）」を選んで「はい」を押す',
          '「w32tm /stripchart /computer:time.windows.com /samples:5 /dataonly」を貼り付けてEnterを押す。表示される数値が0秒前後（例：+0.02s）なら正常、数十秒〜数分なら時刻がずれている',
          'ずれていたら「w32tm /resync /force」を実行して同期する',
          '「サービスが開始されていません」と表示された場合は「Start-Service W32Time」を実行してから、もう一度「w32tm /resync /force」を実行する',
          'もう一度1つ目のコマンドで0秒前後になったことを確かめ、SteamとACE COMBAT 8を再起動する',
        ],
        note: 'Steamの公式掲示板では、この方法で約136秒（2分強）のずれが見つかり、直した直後から出撃できたという報告があります（プレイヤーの報告）。',
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
          'ミッション終了後にリザルト画面へ進まずエラーになる場合は、公式が対応中の不具合。解消の告知を待つ',
          'Wi-Fiの場合は可能なら有線接続にし、VPNや通信最適化ツールを止めて比べる',
          'ルーターを再起動してから、もう一度試す',
        ],
      },
    ],
    avoid: [
      'エラーが出たまま再出撃を何度も繰り返さない（時刻を直してから試す）',
      '時刻を手動でずらしたままにしない。確認が終わったら「時刻を自動的に設定する」をオンに戻す',
      '出どころの分からない修正ツールやスクリプトを使わない',
    ],
    cautions: [
      '公式は、ミッション終了後のエラーによってペナルティが付いたユーザーについて、ペナルティ状態を解除する対応を予定していると発表しています（2026年9月29日）。',
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
          '公式は、ミッション終了後にリザルト画面に進まずエラーになる事象について対応中で、この事象でペナルティが付いたユーザーのペナルティを解除する予定と発表しています（2026年9月29日）。',
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
        label:
          'Steamニュース（公式）：エラーコード：ST-3100001について（2026年9月30日）',
        url: 'https://store.steampowered.com/news/app/2288340/view/695399726270382123',
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
    related: ['not-launching'],
    metaDescription:
      'エースコンバット8（エスコン8）のエラーコード「ST-3100001」は、公式によるとゲームサーバーとの通信が切れた時のエラー。公式の対処（Windowsの時刻同期）の手順、時刻のずれを秒単位で確かめるコマンド、ミッション終了後のエラーとペナルティ解除の公式告知を解説。',
  }),
];
