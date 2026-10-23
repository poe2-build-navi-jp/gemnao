import type { GameArticle } from './game-articles';
import type { LocalizedArticle } from './localized/types';

// Japanese and English only, as requested. Keep matching step IDs.
export const gearsWardogsArticles: GameArticle[] = [
  {
    gameSlug: 'gears-of-war-e-day',
    slug: 'achievements-rewards',
    checkedAt: '2026-10-22',
    title:
      'Gears of War: E-Dayの実績・クリア報酬が反映されない時は｜修正状況と再取得の注意',
    shortTitle: '実績・クリア報酬が出ない',
    description:
      'Gears of War: E-Dayの実績、War Journal、クリア報酬の不足を切り分け。10月14日の修正と残る調査項目、自動再付与の制限、再プレイ前のセーブ保護を案内します。',
    quickFacts: [
      {
        label: '確認日',
        value: '2026年10月22日',
      },
      {
        label: '配信済み',
        value: '10月14日：War Journal・実績進捗、Co-Op進捗の一部修正',
      },
      {
        label: '残る問題',
        value: '一部実績・関連報酬の未付与は同告知で調査中',
      },
    ],
    diagnosis: [
      {
        symptom: '実績が解除されない',
        cause: '条件・版・モードを記録して既知問題と照合',
        stepId: 'identify',
      },
      {
        symptom: '収集物やクリア報酬が足りない',
        cause: '自動再付与の対象外として案内されている',
        stepId: 'replay',
      },
      {
        symptom: '再プレイしても反映されない',
        cause: '反復より記録を添えた公式問い合わせを優先',
        stepId: 'report',
      },
    ],
    steps: [
      {
        id: 'identify',
        title: '不足している項目とプレイ条件を記録する',
        summary:
          '一般的な切り分けです。実績とゲーム内報酬を同じものとして扱わないでください。',
        actions: [
          '実績名、収集物、スキン・称号のどれが不足しているか、表示中の進捗を控える。',
          'プラットフォーム、ゲーム版、ミッション、難易度、ソロ／Co-Op、達成時刻を記録する。',
          '使っているアカウントと表示先が意図したものか確認する。アカウントの連携解除や別アカウントへの移行は行わない。',
        ],
        time: '約5分',
        risk: 'low',
      },
      {
        id: 'status',
        title: '10月14日の修正と残る既知問題を分ける',
        summary:
          '公式のCampaign欄には進捗修正、Known Issues欄には未解決の付与問題が併記されています。',
        actions: [
          '利用ストアで配信済みのゲーム更新を完了し、導入版を記録する。',
          '最新告知も確認し、修正済みの項目をすべての実績への解決保証に広げない。',
          'この確認で失われた記録が復元されるとは限らない。現在の表示を残してから次へ進む。',
        ],
        time: '約5分',
        risk: 'low',
      },
      {
        id: 'replay',
        title: '公式の再取得案内はセーブを保護して検討する',
        summary:
          '公式は不足収集物の再収集と、クリア済みミッションから新しいキャンペーンを始めて再プレイする報酬再取得策を案内しています。',
        actions: [
          '10月14日の告知では、不足収集物とクリア報酬のスキン・称号は自動再付与できないとしている。',
          '一般的な予防策：再プレイ前に現在の進捗を記録し、保存済みデータを保護する。保存先や上書き対象が確認できなければ操作を中止する。',
          '新キャンペーン開始は既存進行へ影響する可能性がある。画面上で既存の進行を残せることが確認できる場合だけ、公式が案内する対象ミッションの再プレイを検討する。未確認のメニュー名やセーブ場所は推測しない。',
          'この方法を全実績の解除保証や、キャンペーン最初からのやり直し必須と解釈しない。',
        ],
        time: 'ミッションと確認内容による',
        risk: 'medium',
      },
      {
        id: 'report',
        title: '未解決なら公式サポートへ記録を送る',
        summary:
          '調査中の付与問題は、公式告知が案内するGears Supportへ報告できます。',
        actions: [
          '不足項目、達成条件、モード、版、日時、再プレイを試した場合の結果をまとめる。',
          '公式パッチノート内のGears Supportリンクから窓口へ進む。画像やログは個人情報を確認してから共有する。',
          '解決しなければ同じ長いミッションを何度もやり直さず、問い合わせの回答や続報を待つ。',
        ],
        time: '約5分',
        risk: 'low',
      },
    ],
    avoid: [
      'セーブ削除やクラウド競合の無条件上書きをしない。',
      '未確認の実績解除ツールやセーブ編集を使わない。',
    ],
    cautions: [
      '本記事は公式資料の整理で、実機検証ではありません。報酬復旧や実績解除を保証しません。',
    ],
    faqs: [
      {
        question: 'パッチを入れれば過去の報酬も戻りますか？',
        answer:
          '進捗記録の修正と過去分の再付与は別です。不足項目を記録し、公式の対象別案内を確認してください。',
      },
      {
        question: '最初から全編をやり直す必要がありますか？',
        answer:
          '公式の報酬再取得案内はクリア済みミッションからの再プレイです。全編やり直しや、セーブの削除を求める案内ではありません。',
      },
    ],
    related: ['not-launching'],
    category: 'save',
    status: 'verified',
    symptom:
      'キャンペーンをクリアしたのに実績やスキン・称号が出ない、収集物が記録されない人向け。PC版を中心に、2026年10月22日に公式資料を確認しました。',
    conclusion:
      'まず不足しているものが実績・収集物・ゲーム内報酬のどれかを分けます。10月14日に進捗記録の一部は修正されましたが、一部実績と関連報酬の未付与は調査中です。修正と過去の不足分の自動復旧は別です。',
    seoTitle:
      'Gears of War: E-Dayの実績・クリア報酬が反映されない時は｜修正状況と再取得の注意',
    metaDescription:
      'Gears of War: E-Dayの実績、War Journal、クリア報酬の不足を切り分け。10月14日の修正と残る調査項目、自動再付与の制限、再プレイ前のセーブ保護を案内します。',
    symptoms: [
      {
        label: '不足している項目とプレイ条件を記録する',
        target: 'identify',
      },
      {
        label: '10月14日の修正と残る既知問題を分ける',
        target: 'status',
      },
      {
        label: '公式の再取得案内はセーブを保護して検討する',
        target: 'replay',
      },
      {
        label: '未解決なら公式サポートへ記録を送る',
        target: 'report',
      },
    ],
    nextChecks: {
      heading: '関連する症状',
      links: [
        {
          href: '/games/gears-of-war-e-day/not-launching',
          label: 'ゲームが起動しない・落ちる',
        },
        {
          href: '/guide/steam-cloud-sync-error',
          label: 'Steamクラウド同期エラー（Steam版）',
        },
      ],
    },
    sources: [
      {
        url: 'https://www.gearsofwar.com/en-us/news/oct-14-patch-notes/',
        label: '公式：10月14日パッチノート（修正・既知問題）',
      },
      {
        url: 'https://steamcommunity.com/app/3010850/allnews/',
        label: '公式Steamニュース：発売・更新履歴',
      },
      {
        url: 'https://www.gearsofwar.com/en-us/news/',
        label: '公式ニュース一覧（10月22日確認）',
      },
    ],
  },
  {
    gameSlug: 'wardogs',
    slug: 'error-wd-l020',
    checkedAt: '2026-10-22',
    title: 'WARDOGSの起動エラーWD-L020｜修正済み更新とログイン障害の切り分け',
    shortTitle: '起動エラーWD-L020',
    description:
      'WARDOGSのWD-L020はWindows 11更新関連の修正履歴を確認し、まずゲームを更新。古いWindowsロールバック案内と現在の対処を分け、ログイン・サーバー接続は別記事へ案内します。',
    quickFacts: [
      {
        label: '修正履歴',
        value: '0.1.2：KB5124010関連のWD-L020修正',
      },
      {
        label: '確認した後続版',
        value: '10月15日：0.2.0配信告知あり',
      },
      {
        label: '対象外',
        value: '起動後のログイン待ち・サーバー切断は接続記事へ',
      },
    ],
    diagnosis: [
      {
        symptom: '起動時にWD-L020が出る',
        cause: '最新の配信済みゲーム更新を確認',
        stepId: 'update',
      },
      {
        symptom: '更新後もWD-L020が残る',
        cause: '現在のOSビルドと再現条件を記録',
        stepId: 'record',
      },
      {
        symptom: '起動はするが接続できない',
        cause: '別の症状として公式の現在の告知を確認',
        stepId: 'connection',
      },
    ],
    steps: [
      {
        id: 'update',
        title: '修正履歴を確認し、ゲームを更新する',
        summary:
          '9月23日の調査告知より後の0.1.2で、該当Windows更新によるクラッシュの修正が案内されています。',
        actions: [
          'ゲームを終了し、Steamのダウンロードで保留中のWARDOGS更新を完了する。',
          '0.1.2だけを探して古い版へ戻す必要はない。10月15日には後続の0.2.0配信が告知されているため、現在配信されている版を利用する。',
          '更新後に起動を一度比較する。9月のメンテナンス予告を今日の障害と判断しない。',
        ],
        time: '約5分',
        risk: 'low',
      },
      {
        id: 'verify',
        title: '一般的な切り分け：再起動とファイル確認',
        summary:
          'ここからはWD-L020の新たな原因が公式確認されたという意味ではありません。',
        actions: [
          'SteamとWindowsを通常の手順で再起動し、同じコードが出るか確認する。',
          '続く場合はSteamライブラリのゲームのプロパティから、インストール済みファイルの整合性を確認し、完了後に比較する。',
          '変えた項目と結果を残す。セキュリティソフトやアンチチートを無効にせず、非公式DLLも導入しない。',
        ],
        time: '約10分（ファイル確認時間による）',
        risk: 'low',
      },
      {
        id: 'record',
        title: 'Windowsビルドと発生条件を記録する',
        summary:
          '9月23日のロールバック案内は修正前の暫定策です。本記事ではWindows更新の削除を案内しません。',
        actions: [
          'Windows＋Rでwinverを開き、バージョンとOSビルドを控える。Windows Updateの更新履歴と発生し始めた日も記録する。',
          'ゲーム版、エラー全文、起動までの操作、再起動・整合性確認の結果をまとめる。',
          'WD-L014／WD-L018なら別コードとして記録する。9月30日の公式告知は対応中としており、今回確認した資料では個別コードの修正完了を確認できない。今日の継続障害を新たに実測したわけではない。',
          'Team17公式サポートへ報告する。画像・診断情報の個人情報を確認し、DxDiagを公開サイトへ丸ごと投稿しない。別の更新番号を推測で削除しない。',
        ],
        time: '約5分',
        risk: 'low',
      },
      {
        id: 'connection',
        title: '起動後のログイン・接続問題は別に確認する',
        summary:
          'WD-L020で起動が止まる場合と、ゲーム内で接続できない場合を混ぜないでください。',
        actions: [
          '起動できるなら、待機列、ログイン失敗、特定サーバーの切断のどこで止まるか記録する。ゲーム自体が終了する場合やPCごと再起動する場合は区別し、危険な再現を繰り返さない。',
          '下のサーバー接続記事で、告知の日時・対象、クライアント更新、サーバーの地域・フィルターを確認する。',
          '古い発売時の混雑や修正履歴だけで、現在も全体障害が続いているとは断定しない。',
        ],
        time: '約5分',
        risk: 'low',
      },
    ],
    avoid: [
      'Windows更新の削除やアンチチート無効化を最初の手段にしない。',
      'セーブ削除・クラウドデータの無条件上書きをしない。',
    ],
    cautions: [
      '本記事は実機検証ではありません。0.1.2の修正は対象条件の修正履歴で、将来の全WD-L020の解消保証ではありません。',
    ],
    faqs: [
      {
        question: '古い案内のKB5124010削除を今すぐ行うべきですか？',
        answer:
          'まずゲームの修正適用と現状の記録を優先します。修正前の任意の回避策を、現在の全環境へそのまま適用しないでください。',
      },
      {
        question: '待機列が長いのもWD-L020ですか？',
        answer:
          '起動できて待機列が表示されるなら別の症状です。エラーの実際の表示と発生段階に合わせて接続記事を確認してください。',
      },
    ],
    related: ['server-connection'],
    category: 'launch',
    status: 'verified',
    symptom:
      'Steam版WARDOGSがWD-L020で起動できない人向け。2026年10月22日に公式告知を確認しました。待機列や試合中の切断とは分けて扱います。',
    conclusion:
      'まず配信済みのゲーム更新を適用してください。KB5124010に関連するWD-L020は0.1.2で修正されたと公式が案内しています。更新後も同じコードが出るなら、古い原因と決めつけずWindowsビルドと再現条件を記録します。',
    seoTitle:
      'WARDOGSの起動エラーWD-L020｜修正済み更新とログイン障害の切り分け',
    metaDescription:
      'WARDOGSのWD-L020はWindows 11更新関連の修正履歴を確認し、まずゲームを更新。古いWindowsロールバック案内と現在の対処を分け、ログイン・サーバー接続は別記事へ案内します。',
    symptoms: [
      {
        label: '修正履歴を確認し、ゲームを更新する',
        target: 'update',
      },
      {
        label: '一般的な切り分け：再起動とファイル確認',
        target: 'verify',
      },
      {
        label: 'Windowsビルドと発生条件を記録する',
        target: 'record',
      },
      {
        label: '起動後のログイン・接続問題は別に確認する',
        target: 'connection',
      },
    ],
    nextChecks: {
      heading: '関連する症状',
      links: [
        {
          href: '/games/wardogs/server-connection',
          label: 'サーバー接続・ログイン待ち',
        },
        {
          href: '/guide/verify-steam-files',
          label: 'Steamのファイル整合性確認',
        },
      ],
    },
    sources: [
      {
        url: 'https://steamcommunity.com/app/1867240/allnews/',
        label: '公式Steam告知：0.1.2修正と0.2.0配信',
      },
      {
        url: 'https://steamcommunity.com/app/1867240/discussions/0/585060903246928845/',
        label: 'Team17：9月23日の修正前の調査告知',
      },
      {
        url: 'https://www.team17.com/support/',
        label: 'Team17公式サポート',
      },
      {
        url: 'https://steamcommunity.com/app/1867240/discussions/0/585061535402989202/',
        label: '0.1.2配信済み：開発者投稿',
      },
      {
        url: 'https://steamcommunity.com/app/1867240/discussions/0/585061535403000092/',
        label: 'WD-L014／WD-L018：9月30日の開発者告知',
      },
      {
        url: 'https://steamcommunity.com/app/1867240/discussions/3/562541966849717283/',
        label: 'Team17_Help：参加時クラッシュのファイル確認案内',
      },

      {
        url: 'https://store.steampowered.com/app/1867240/',
        label: 'Steamストア：WARDOGS',
      },
    ],
  },
];

export const gearsWardogsArticlesEn: LocalizedArticle[] = [
  {
    gameSlug: 'gears-of-war-e-day',
    slug: 'achievements-rewards',
    checkedAt: '2026-10-22',
    title:
      'Gears of War: E-Day Achievements and Campaign Rewards Not Unlocking',
    shortTitle: 'Missing achievements and rewards',
    description:
      'Separate missing achievements, War Journal progress and campaign rewards in Gears of War: E-Day. Check the October 14 fixes, remaining investigation and safe replay precautions.',
    lead: 'For missing campaign achievements, collectibles, skins or titles. This guide focuses on PC players and was checked against official sources on October 22, 2026.',
    summary:
      'Identify whether an achievement, collectible or in-game reward is missing. The October 14 patch fixed some progress-tracking issues, but certain achievements and associated rewards remain under investigation. Fixing tracking is separate from restoring earlier missing rewards.',
    quickFacts: [
      {
        label: 'Checked',
        value: 'October 22, 2026',
      },
      {
        label: 'Released fixes',
        value:
          'October 14: some War Journal, achievement and co-op progress tracking issues',
      },
      {
        label: 'Still listed',
        value: 'Certain achievements and associated rewards not being awarded',
      },
    ],
    diagnosis: [
      {
        symptom: 'An achievement stays locked',
        cause: 'Record its conditions, game version and mode',
        stepId: 'identify',
      },
      {
        symptom: 'Collectibles or campaign rewards are missing',
        cause: 'The notice rules out automatic re-granting for these items',
        stepId: 'replay',
      },
      {
        symptom: 'Replaying did not help',
        cause: 'Report the evidence before repeating a long mission',
        stepId: 'report',
      },
    ],
    steps: [
      {
        id: 'identify',
        title: 'Record what is missing and how you played',
        summary:
          'General diagnostic checks: achievements and in-game rewards are distinct.',
        actions: [
          'Note the exact achievement, collectible, skin or title and the progress currently shown.',
          'Record platform, game version, mission, difficulty, solo or co-op play and completion time.',
          'Check that you are viewing the intended account and progress display. Do not unlink accounts or move to another account as a troubleshooting shortcut.',
        ],
        time: 'About 5 minutes',
        risk: 'low',
      },
      {
        id: 'status',
        title: 'Separate released fixes from remaining known issues',
        summary:
          'The Campaign section lists tracking fixes; Known Issues still lists an award problem.',
        actions: [
          'Finish released game updates through your storefront and record the installed version.',
          'Check for newer official notes. Do not treat a fix for one condition as a guarantee for every achievement.',
          'Updating does not necessarily restore earlier missing records. Preserve evidence of the current display before continuing.',
        ],
        time: 'About 5 minutes',
        risk: 'low',
      },
      {
        id: 'replay',
        title: 'Consider the official replay advice after protecting progress',
        summary:
          'The publisher advises re-collecting missing collectibles, and starting a new campaign from a completed mission to replay it for missing campaign rewards.',
        actions: [
          'The October 14 notice says missing collectibles and completion rewards such as skins and titles cannot be automatically re-granted.',
          'General precaution: record current progress and protect saved data first. Stop if you cannot identify the save or what would be overwritten.',
          'Starting a new campaign may affect existing progress. Only consider replaying the relevant mission once the on-screen options make clear how to retain existing progress. This guide does not invent menu labels or save locations.',
          'This is not a guarantee for every achievement or an instruction to restart the entire campaign.',
        ],
        time: 'Depends on the mission and save checks',
        risk: 'medium',
      },
      {
        id: 'report',
        title: 'Send unresolved cases to official support',
        summary: 'The patch notice directs affected players to Gears Support.',
        actions: [
          'Collect the missing item, completion conditions, mode, version, date and the result of any replay already attempted.',
          'Follow the Gears Support link in the official patch notes. Review screenshots and logs for private information before sharing them.',
          'If the problem remains, wait for support or a relevant update instead of repeatedly replaying a long mission.',
        ],
        time: 'About 5 minutes',
        risk: 'low',
      },
    ],
    avoid: [
      'Do not delete saves or blindly overwrite conflicting cloud copies.',
      'Do not use unverified achievement unlockers or save editors.',
    ],
    cautions: [
      'This is a source-based guide, not a hands-on test. Recovery and achievement unlocks are not guaranteed.',
    ],
    faqs: [
      {
        question: 'Will installing the patch restore earlier rewards?',
        answer:
          'Tracking fixes and restoring older missing rewards are separate. Record the missing items and follow the publisher’s advice for that category.',
      },
      {
        question: 'Must I replay the entire campaign?',
        answer:
          'The official reward workaround starts from a completed mission. It does not instruct you to erase saves or replay the entire story from the beginning.',
      },
    ],
    related: [
      {
        href: '/en/games/gears-of-war-e-day/not-launching',
        label: 'Game not launching or crashing',
      },
      {
        href: '/en/guide/steam-cloud-sync-error',
        label: 'Steam Cloud sync errors (Steam version)',
      },
    ],
    locale: 'en',
    gameName: 'Gears of War: E-Day',
    sources: [
      {
        url: 'https://www.gearsofwar.com/en-us/news/oct-14-patch-notes/',
        label: 'Official October 14 patch notes: fixes and known issues',
      },
      {
        url: 'https://steamcommunity.com/app/3010850/allnews/',
        label: 'Official Steam news: release and update history',
      },
      {
        url: 'https://www.gearsofwar.com/en-us/news/',
        label: 'Official news index (checked October 22)',
      },
    ],
  },
  {
    gameSlug: 'wardogs',
    slug: 'error-wd-l020',
    checkedAt: '2026-10-22',
    title: 'WARDOGS WD-L020 Launch Error: Released Fix and Connection Checks',
    shortTitle: 'WD-L020 launch error',
    description:
      'Check the released WARDOGS fix for WD-L020 before considering old Windows rollback advice. Update the game, record remaining errors and separate launch failures from server problems.',
    lead: 'For Steam players unable to launch WARDOGS because of WD-L020. Official notices checked October 22, 2026. Queues and in-match disconnects are separate symptoms.',
    summary:
      'Install released game updates first. The publisher says version 0.1.2 fixed WD-L020 crashes linked to KB5124010. If the code remains after updating, record your current Windows build and reproduction steps rather than assuming the old cause still applies.',
    quickFacts: [
      {
        label: 'Fix history',
        value: '0.1.2: WD-L020 crashes linked to KB5124010',
      },
      {
        label: 'Later release checked',
        value: '0.2.0 release announced October 15',
      },
      {
        label: 'Different symptom',
        value:
          'Queues and server disconnects after launch: use the connection guide',
      },
    ],
    diagnosis: [
      {
        symptom: 'WD-L020 appears at launch',
        cause: 'Check for released game updates first',
        stepId: 'update',
      },
      {
        symptom: 'WD-L020 remains after updating',
        cause: 'Record the current OS build and trigger',
        stepId: 'record',
      },
      {
        symptom: 'The game launches but cannot connect',
        cause: 'Check current notices for that separate symptom',
        stepId: 'connection',
      },
    ],
    steps: [
      {
        id: 'update',
        title: 'Check the fix history and update the game',
        summary:
          'The 0.1.2 notes followed the September 23 investigation and listed a fix for the Windows-update-related crash.',
        actions: [
          'Exit the game and complete pending WARDOGS downloads in Steam.',
          'Do not downgrade to find 0.1.2. A later 0.2.0 release was announced on October 15; use the currently released client.',
          'Compare one launch after updating. A maintenance window announced in September is not evidence of an outage today.',
        ],
        time: 'About 5 minutes',
        risk: 'low',
      },
      {
        id: 'verify',
        title: 'General checks: restart and verify files',
        summary:
          'These checks do not establish a newly confirmed cause of WD-L020.',
        actions: [
          'Restart Steam and Windows normally, then check whether the same code appears.',
          'If it persists, open the game’s Properties in Steam Library and verify the installed files. Wait for completion before comparing again.',
          'Record each change and result. Keep security and anti-cheat protection enabled; do not install unofficial replacement DLLs.',
        ],
        time: 'About 10 minutes, depending on verification',
        risk: 'low',
      },
      {
        id: 'record',
        title: 'Record the Windows build and triggering conditions',
        summary:
          'The September 23 rollback advice was a temporary option before the fix. This guide does not instruct you to remove Windows updates.',
        actions: [
          'Press Windows + R, run winver, and record the version and OS build. Note relevant Windows Update history and when the error began.',
          'Collect the game version, full error, launch steps and results of restarting or verifying files.',
          'Record WD-L014 or WD-L018 separately. Their September 30 notice says fixes were in progress; the material reviewed here does not confirm completion for those codes. This is not a new observation of an ongoing outage today.',
          'Report through official Team17 support. Review diagnostic information for private details; do not post a full DxDiag report publicly or remove a different update based on guesswork.',
        ],
        time: 'About 5 minutes',
        risk: 'low',
      },
      {
        id: 'connection',
        title: 'Treat login and server problems after launch separately',
        summary:
          'Failure to launch with WD-L020 is different from a connection failure inside the game.',
        actions: [
          'If the game opens, record whether the failure is a queue, sign-in error or disconnect from a particular server. Distinguish the game closing from the whole PC restarting, and avoid repeatedly triggering either failure.',
          'Use the server guide below to check notice dates and scope, client updates, server region and filters.',
          'Historical launch congestion or an older fix does not establish that a widespread outage is continuing now.',
        ],
        time: 'About 5 minutes',
        risk: 'low',
      },
    ],
    avoid: [
      'Do not start by removing Windows updates or disabling anti-cheat.',
      'Do not delete saves or blindly overwrite cloud data.',
    ],
    cautions: [
      'This guide is not a hands-on test. The 0.1.2 fix applies to the documented condition; it does not guarantee every future WD-L020 error is resolved.',
    ],
    faqs: [
      {
        question: 'Should I follow the old advice to remove KB5124010 now?',
        answer:
          'Prioritize the released game fix and evidence from your current system. A pre-fix optional workaround is not a universal instruction for current PCs.',
      },
      {
        question: 'Is a long queue also WD-L020?',
        answer:
          'If the game launches and displays a queue, use the connection guide. Choose checks based on the actual error text and where the process stops.',
      },
    ],
    related: [
      {
        href: '/en/games/wardogs/server-connection',
        label: 'Server connections and login queues',
      },
      {
        href: '/en/guide/verify-steam-files',
        label: 'Verify Steam game files',
      },
    ],
    locale: 'en',
    gameName: 'WARDOGS',
    sources: [
      {
        url: 'https://steamcommunity.com/app/1867240/allnews/',
        label: 'Official Steam announcements: 0.1.2 fix and 0.2.0 release',
      },
      {
        url: 'https://steamcommunity.com/app/1867240/discussions/0/585060903246928845/',
        label: 'Team17: September 23 pre-fix investigation notice',
      },
      {
        url: 'https://www.team17.com/support/',
        label: 'Official Team17 support',
      },
      {
        url: 'https://steamcommunity.com/app/1867240/discussions/0/585061535402989202/',
        label: 'Developer: update 0.1.2 is live',
      },
      {
        url: 'https://steamcommunity.com/app/1867240/discussions/0/585061535403000092/',
        label: 'Developer: September 30 WD-L014 and WD-L018 notice',
      },
      {
        url: 'https://steamcommunity.com/app/1867240/discussions/3/562541966849717283/',
        label: 'Team17_Help: verify files for a crash while joining',
      },

      {
        url: 'https://store.steampowered.com/app/1867240/',
        label: 'Steam store: WARDOGS',
      },
    ],
  },
];
