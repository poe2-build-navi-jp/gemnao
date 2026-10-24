import type { GameArticle } from './game-articles';
import type { LocalizedArticle } from './localized/types';

// User-requested Japanese and English scope; no placeholder translations.
export const octoberStabilityArticles: GameArticle[] = [
  {
    checkedAt: '2026-10-22',
    quickFacts: [
      {
        label: '確認日',
        value: '2026年10月22日',
      },
      {
        label: '状態',
        value: 'メモリ対策は暫定。1.01.002は10月23日予定。',
      },
      {
        label: '対象',
        value: 'Steam版・起動後のクラッシュ',
      },
    ],
    diagnosis: [
      {
        symptom: 'プレイ中に落ちる・メモリが足りない',
        cause: '公式の暫定目安と現在の設定を比較',
        stepId: 'memory',
      },
      {
        symptom: '決まったミッションや画面で落ちる',
        cause: '個別修正の対象条件・配信状況を確認',
        stepId: 'status',
      },
    ],
    faqs: [
      {
        question: '同じ場面で落ちたらメモリ不足と断定できますか？',
        answer:
          '断定できません。発生場面、コミット容量、版、変更前後の結果を残し、個別の既知問題と分けて報告してください。',
      },
    ],
    title:
      'エースコンバット8がプレイ中に落ちる｜メモリ対策と1.01.002の修正予定',
    shortTitle: 'プレイ中のクラッシュ・メモリ',
    description:
      'ACE COMBAT 8の10月16日メモリ告知と10月23日予定の1.01.002を区別。RAMと仮想メモリの目安、安全な確認順、起動不良・カクつきへの導線を案内します。',
    steps: [
      {
        id: 'status',
        title: '修正状況と落ちる場面を分ける',
        summary:
          '一般的なメモリ問題と、更新で対象になる個別クラッシュを混同しないでください。',
        actions: [
          '現在のゲーム版・ミッション・直前の操作・エラー全文を記録する。',
          '10月20日の予告では、1.01.002でMISSION 11や機体選択・AIRCRAFT TREEの特定条件のクラッシュを修正予定。一般的なメモリ問題の全解消は確認できない。',
          '配信予定日を過ぎても、実際の配信告知とインストール済み版を照合してから判断する。',
        ],
        time: '約5分',
        risk: 'low',
      },
      {
        id: 'memory',
        title: '公式のRAM＋仮想メモリの目安を確認する',
        summary:
          '10月16日の暫定目安：RAM 32GBなら仮想メモリ16GB以上、RAM 16GBなら32GB以上。物理RAM48GB必須という意味ではありません。',
        actions: [
          '変更前のRAM容量・仮想メモリ設定・ディスク空き容量を記録する。仮想メモリはGPUのVRAMとは別。',
          '公式の社内テストでは合計約48GB以上で一部クラッシュが減った。すべての原因に効く設定でも恒久修正でもない。',
          'Windowsの仮想メモリ設定を変更する場合は元の設定を控え、必要な空きを確認する。固定の最大値を一律に設定したり、ページファイルを削除したりしない。分からなければ変更を保留する。',
        ],
        time: '約5分',
        risk: 'medium',
      },
      {
        id: 'compare',
        title: '一般的な切り分けは1項目ずつ比較する',
        summary: 'ここからは公式が確認したゲーム固有の回避策ではありません。',
        actions: [
          '不要なアプリを閉じ、タスクマネージャーのメモリ欄でコミット済み容量と上限を確認する。上限に迫ることは調査材料になるが、ゲーム側の原因を断定しない。',
          'Microsoftによるとページファイルはコミット上限を拡張する。自動管理でも拡張にはディスク空き容量が必要。',
          'セーブを保護したうえで同じ場面を一度比較し、改善しなければ変更点と結果を記録する。クラッシュを何度も再現させない。',
        ],
        time: '約5分',
        risk: 'low',
      },
      {
        id: 'report',
        title: '改善しない時は記録を添えて報告する',
        summary:
          '起動できない場合や音切れが主症状の場合は、下の関連記事へ進んでください。',
        actions: [
          'ゲーム版、Windows版、CPU・GPU・RAM、ドライバー版、発生場面、試した変更と結果をまとめる。',
          '最新の公式告知で案内される報告窓口を確認する。ログや画像はユーザー名などの個人情報を確認してから共有する。',
        ],
        time: '約5分',
        risk: 'low',
      },
    ],
    avoid: [
      'セーブを削除しない。クラウド競合で内容を確認せず上書きしない。',
      '48GBという目安だけで物理メモリの買い替えを決めない。',
    ],
    cautions: [
      '公式の予定は変更される場合があります。最新の配信告知を確認してください。',
    ],
    related: ['not-launching', 'stutter-audio-cutting-out', 'error-st-3100001'],
    gameSlug: 'ace-combat-8',
    slug: 'crashing-memory',
    category: 'launch',
    status: 'verified',
    sources: [
      {
        label: '公式Steam告知：2026年10月16日・20日（10月22日確認）',
        url: 'https://steamcommunity.com/app/2288340/allnews/',
      },
      {
        label: 'Steamストア：正式名・発売日',
        url: 'https://store.steampowered.com/app/2288340/',
      },
      {
        label: 'Microsoft：ページファイルとコミット上限',
        url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/introduction-to-the-page-file',
      },
    ],
    symptom:
      'Steam版で起動後に落ちる人向け。2026年10月22日に公式資料を確認した記事で、実機検証結果ではありません。',
    conclusion:
      '10月16日の公式告知は一部メモリ関連クラッシュへの暫定対策です。RAMとWindows仮想メモリの合計を確認してください。1.01.002は10月23日配信予定で、現時点の修正済み扱いにはできません。',
    seoTitle:
      'エースコンバット8がプレイ中に落ちる｜メモリ対策と1.01.002の修正予定',
    metaDescription:
      'ACE COMBAT 8の10月16日メモリ告知と10月23日予定の1.01.002を区別。RAMと仮想メモリの目安、安全な確認順、起動不良・カクつきへの導線を案内します。',
    symptoms: [
      {
        label: '修正状況と落ちる場面を分ける',
        target: 'status',
      },
      {
        label: '公式のRAM＋仮想メモリの目安を確認する',
        target: 'memory',
      },
      {
        label: '一般的な切り分けは1項目ずつ比較する',
        target: 'compare',
      },
      {
        label: '改善しない時は記録を添えて報告する',
        target: 'report',
      },
    ],
    nextChecks: {
      heading: '関連する症状を確認',
      links: [
        {
          href: '/games/ace-combat-8/not-launching',
          label: '起動しない・起動直後に落ちる',
        },
        {
          href: '/games/ace-combat-8/stutter-audio-cutting-out',
          label: 'カクつき・音切れ',
        },
        {
          href: '/games/ace-combat-8/error-st-3100001',
          label: 'ST-3100001の通信エラー',
        },
      ],
    },
  },
  {
    title:
      'Planet Zoo 2でセーブが消えた・Resumeで接続エラー｜1.0.6／1.0.7の修正状況',
    shortTitle: 'セーブ・Resume・クラッシュ',
    description:
      'Planet Zoo 2のオートセーブ・動物放流クラッシュは1.0.6、FranchiseのResume接続エラーは1.0.7で修正。更新確認とセーブを削除しない対処を案内します。',
    gameSlug: 'planet-zoo-2',
    slug: 'crashing-autosave',
    checkedAt: '2026-10-24',
    quickFacts: [
      {
        label: '修正の区別',
        value: '1.0.6：自動保存・特定の放流クラッシュ／1.0.7：Franchise Resume',
      },
    ],
    steps: [
      {
        id: 'protect',
        title: '現在版と更新状態を先に確認',
        summary: 'セーブを触る前に、導入済みの更新を確認します。',
        actions: [
          'ゲームの版表示とSteamの更新状態を確認し、ダウンロード中なら完了を待つ。版が不明な場合は推測で1.0.7導入済みとしない。',
          'セーブフォルダーの削除、再インストール、クラウド同期の初期化を復旧手順として行わない。既存データの上書きも保留する。',
        ],
        time: '確認約3〜5分（更新待ちを除く）',
        risk: 'low',
      },
      {
        id: 'status',
        title: '1.0.6と1.0.7の対象を区別する',
        summary: '以前の「修正テスト中」から、正式な配信内容へ更新しています。',
        actions: [
          '1.0.6：Planet Hubへ入ると自動保存のタイマーがリセットされる問題と、Franchiseの野生保護区へ動物を放流する際のクラッシュは修正済みと告知。全クラッシュの解消ではない。',
          '1.0.7：FranchiseセーブのResumeで接続エラーが出て、どのモードにもロードできなくなる問題を修正。1.0.7の配信確認は今回のSteam告知の範囲。',
        ],
        time: '確認約3〜5分（更新待ちを除く）',
        risk: 'low',
      },
      {
        id: 'isolate',
        title: '1.0.7を取得できない場合だけ公式回避策',
        summary:
          '1.0.6導入済みで1.0.7をダウンロードできない人向けの一時策です。',
        actions: [
          'ゲームを再起動する。メインメニューでResumeは使わず、遊びたいモードのボタンから入る。日本語UI名は断定せず、表示されたモード名と照合する。',
          '1.0.7導入後も続く接続エラーを同じ原因と決めない。公式はVPN使用の影響にも言及しているため利用状況を控え、必要な接続の変更は管理者や公式サポートへ相談する。',
        ],
        time: '確認約3〜5分（更新待ちを除く）',
        risk: 'low',
      },
      {
        id: 'report',
        title: '保存一覧と未解決の症状を記録する',
        summary: '表示の回復と、実際の進行データの復元は別です。',
        actions: [
          '入れるようになったら保存一覧の日時と動物園を確認する。見えない・古い場合は空の新規データで上書きせず、状態を控える。',
          '版、モード、Resumeかモードボタンか、エラー全文、最後に確認できた保存日時を公式Issue Trackerへ報告する。私的情報や生ログを公開欄へ貼らない。',
          '動物放流で落ちる場合も、唯一のセーブで何度も再現を試さない。別場面のクラッシュはモード・操作を分けて記録する。',
        ],
        time: '確認約3〜5分（更新待ちを除く）',
        risk: 'low',
      },
    ],
    faqs: [
      {
        question:
          '公式の「セーブは失われていない」は全ケースに当てはまりますか？',
        answer:
          'いいえ。1.0.6後のFranchise Resumeによる接続・メニュー不具合の説明です。未保存の進行や別のセーブ事故が必ず戻る保証には広げません。',
      },
      {
        question: '修正テスト中ではなく修正済みですか？',
        answer:
          '今回扱うタイマーリセットと特定の動物放流クラッシュは1.0.6、Resumeによる接続エラーは1.0.7の正式告知に修正として載っています。個別環境での改善は実機確認していません。',
      },
      {
        question: '再インストールや同期リセットをすれば戻りますか？',
        answer:
          'その復旧効果は確認できていません。公式は今回の不具合でセーブフォルダーを消さないよう案内しています。既存保存を保ち、更新状態と症状を報告してください。',
      },
    ],
    diagnosis: [
      {
        symptom: 'Resumeで入れない',
        cause: '現在版と更新完了を先に確認',
        stepId: 'protect',
      },
    ],
    avoid: [
      'セーブ削除・内容不明の上書き・クラウド同期初期化をしない',
      '唯一の保存で危険な再現を繰り返さない',
    ],
    cautions: [
      '対象のResume不具合と、別原因のデータ消失を区別します。未確認のセーブパスは案内しません。',
    ],
    sources: [
      {
        label: '公式Steam：10/23の1.0.6・1.0.7配信告知（10/24確認）',
        url: 'https://steamcommunity.com/app/3219030/allnews/',
      },
    ],
    category: 'save',
    status: 'verified',
    symptom:
      'Steam版でセーブが見えない、Resumeから入れない、動物放流で落ちる人向けです。まず版と更新状況を確認し、別の症状を同じ原因と決めつけないでください。',
    conclusion:
      '10/23配信の1.0.6はPlanet HubでのオートセーブタイマーリセットとFranchise野生保護区への動物放流クラッシュを修正しました。一方、1.0.6後のFranchiseセーブをResumeすると接続エラーで各モードに入れなくなる問題は、同日の1.0.7で修正と告知されています。Steamの更新完了を確認し、セーブフォルダーは削除しないでください。',
    seoTitle:
      'Planet Zoo 2でセーブが消えた・Resumeで接続エラー｜1.0.6／1.0.7の修正状況',
    metaDescription:
      'Planet Zoo 2のオートセーブ・動物放流クラッシュは1.0.6、FranchiseのResume接続エラーは1.0.7で修正。更新確認とセーブを削除しない対処を案内します。',
    symptoms: [
      {
        label: '現在版と更新状態を先に確認',
        target: 'protect',
      },
      {
        label: '1.0.6と1.0.7の対象を区別する',
        target: 'status',
      },
      {
        label: '1.0.7を取得できない場合だけ公式回避策',
        target: 'isolate',
      },
      {
        label: '保存一覧と未解決の症状を記録する',
        target: 'report',
      },
    ],
    related: [],
    nextChecks: {
      heading: '関連する症状',
      links: [
        {
          href: '/guide/steam-cloud-sync-error',
          label: '別症状：Steamクラウド同期エラー',
        },
        {
          href: '/guide/pc-game-crash',
          label: '別場面で落ちる時の確認',
        },
      ],
    },
  },
];

export const octoberStabilityArticlesEn: LocalizedArticle[] = [
  {
    checkedAt: '2026-10-22',
    quickFacts: [
      {
        label: 'Checked',
        value: 'October 22, 2026',
      },
      {
        label: 'Status',
        value: 'Temporary memory guidance; 1.01.002 planned for October 23.',
      },
      {
        label: 'Scope',
        value: 'Steam: crashes after launch',
      },
    ],
    diagnosis: [
      {
        symptom: 'Crashes during play or memory pressure',
        cause: 'Compare existing settings with the temporary guidance',
        stepId: 'memory',
      },
      {
        symptom: 'A particular mission or screen triggers the crash',
        cause: 'Check the specific fix conditions and release status',
        stepId: 'status',
      },
    ],
    faqs: [
      {
        question: 'Does crashing in the same scene prove a memory shortage?',
        answer:
          'No. Record the scene, committed memory, game version and before-and-after results. Keep specific known crash conditions separate when reporting the issue.',
      },
    ],
    title:
      'ACE COMBAT 8 Crashes During Play: Memory Guidance and the Planned 1.01.002 Update',
    shortTitle: 'Gameplay crashes and memory',
    description:
      'Understand the October 16 memory workaround, the planned October 23 update, and safe checks for ACE COMBAT 8 gameplay crashes. Separate launch failures from stutter.',
    lead: 'For Steam players whose game closes after launching. Official sources checked October 22, 2026; this is not a hands-on test report.',
    summary:
      'The October 16 notice offers a temporary workaround for some memory-related crashes. Check RAM plus Windows virtual memory. Version 1.01.002 is scheduled for October 23; its fixes are not confirmed as released at this review date.',
    steps: [
      {
        id: 'status',
        title: 'Match the crash to the update scope',
        summary:
          'Keep general memory issues separate from specific crash fixes.',
        actions: [
          'Record your installed game version, mission, last action and full error message.',
          'The October 20 preview lists planned fixes for specific crashes in Mission 11, aircraft selection and AIRCRAFT TREE. It does not confirm a complete fix for general memory issues.',
          'After the planned date, compare the actual release notice with your installed version before treating a fix as available.',
        ],
        time: 'About 5 minutes',
        risk: 'low',
      },
      {
        id: 'memory',
        title: 'Check the official RAM plus virtual-memory guidance',
        summary:
          'Temporary guidance: 32 GB RAM plus at least 16 GB virtual memory, or 16 GB RAM plus at least 32 GB virtual memory. This is not a 48 GB physical RAM requirement.',
        actions: [
          'Record your RAM, existing paging settings and free disk space before changing anything. Virtual memory is separate from GPU VRAM.',
          'Internal tests found fewer instances of some crashes with approximately 48 GB combined. This is neither a permanent fix nor a remedy for every crash.',
          'If changing Windows virtual memory, keep a record of the previous settings and check available space. Do not impose one fixed maximum on every PC or delete the page file. Leave settings unchanged if you are unsure.',
        ],
        time: 'About 5 minutes',
        risk: 'medium',
      },
      {
        id: 'compare',
        title: 'Compare one general troubleshooting change at a time',
        summary:
          'These are diagnostic checks, not a publisher-confirmed workaround for this game.',
        actions: [
          'Close unnecessary apps and inspect committed memory and its limit in Task Manager. Approaching the limit is useful evidence, not proof of the game’s underlying fault.',
          'Microsoft explains that page files extend the commit limit. Even automatic growth needs free disk space.',
          'Protect your saves, compare the same scene once, and record the change and result. Avoid repeatedly triggering a crash.',
        ],
        time: 'About 5 minutes',
        risk: 'low',
      },
      {
        id: 'report',
        title: 'Report what remains unresolved',
        summary:
          'Use the related guides below if the main symptom is failure to launch or interrupted audio.',
        actions: [
          'Collect the game and Windows versions, CPU, GPU, RAM, driver version, triggering scene, changes tried and results.',
          'Check the latest publisher notice for its reporting channel. Review screenshots and logs for personal information before sharing them.',
        ],
        time: 'About 5 minutes',
        risk: 'low',
      },
    ],
    avoid: [
      'Do not delete saves or overwrite a cloud conflict without checking both copies.',
      'Do not buy more physical RAM solely because the guidance mentions 48 GB.',
    ],
    cautions: ['Update plans can change. Check the actual release notice.'],
    related: [
      {
        href: '/en/games/ace-combat-8/not-launching',
        label: 'Not launching or closing at startup',
      },
      {
        href: '/en/games/ace-combat-8/stutter-audio-cutting-out',
        label: 'Stutter and audio interruptions',
      },
      {
        href: '/en/games/ace-combat-8/error-st-3100001',
        label: 'ST-3100001 connection error',
      },
    ],
    gameSlug: 'ace-combat-8',
    gameName: 'ACE COMBAT 8: WINGS OF THEVE',
    slug: 'crashing-memory',
    locale: 'en',
    sources: [
      {
        label:
          'Official Steam announcements: October 16 and 20 (checked October 22, 2026)',
        url: 'https://steamcommunity.com/app/2288340/allnews/',
      },
      {
        label: 'Steam store: title and release date',
        url: 'https://store.steampowered.com/app/2288340/',
      },
      {
        label: 'Microsoft: page files and the commit limit',
        url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/introduction-to-the-page-file',
      },
    ],
  },
  {
    title:
      'Planet Zoo 2 saves missing or Resume connection error: 1.0.6 and 1.0.7 fixes',
    shortTitle: 'Saves, Resume and crashes',
    description:
      'Separate Planet Zoo 2 autosave and animal-release fixes in 1.0.6 from the Franchise Resume connection fix in 1.0.7. Check updates and keep your saves folder intact.',
    lead: 'For Steam players who cannot see saves, cannot enter through Resume or crash when releasing animals. Check the installed version and update status before assuming a common cause.',
    summary:
      'The October 23 update 1.0.6 fixed the Planet Hub autosave timer reset and crashes when releasing animals into Franchise wildlife reserves. A separate issue after 1.0.6, where Resume for a Franchise save caused a connection error and blocked all modes, was addressed by 1.0.7 that day. Confirm Steam has completed the update and do not delete your saves folder.',
    gameSlug: 'planet-zoo-2',
    slug: 'crashing-autosave',
    checkedAt: '2026-10-24',
    quickFacts: [
      {
        label: 'Fix scope',
        value:
          '1.0.6: autosave and specific release crash / 1.0.7: Franchise Resume',
      },
    ],
    steps: [
      {
        id: 'protect',
        title: 'Check the installed version and update status first',
        summary: 'Confirm the update before touching saved data.',
        actions: [
          'Check the game version display and Steam update status; let any active download finish. If the version is unclear, do not assume 1.0.7 is installed.',
          'Do not delete saves, reinstall or reset cloud synchronization as a recovery procedure. Pause any overwrite of existing data.',
        ],
        time: 'About 3–5 minutes to check; update time varies',
        risk: 'low',
      },
      {
        id: 'status',
        title: 'Separate the fixes in 1.0.6 and 1.0.7',
        summary:
          'Released patch notes supersede the earlier testing status for these specific issues.',
        actions: [
          '1.0.6 lists fixes for the autosave timer resetting on entry to Planet Hub and crashes when releasing animals into Franchise wildlife reserves. This is not a fix for every crash.',
          '1.0.7 fixes selecting Resume for a Franchise save causing a connection error and blocking loading into any mode. The release confirmation used here is the Steam announcement.',
        ],
        time: 'About 3–5 minutes to check; update time varies',
        risk: 'low',
      },
      {
        id: 'isolate',
        title: 'Use the official workaround only if 1.0.7 is unavailable',
        summary:
          'This temporary route applies when 1.0.6 is installed but 1.0.7 cannot be downloaded.',
        actions: [
          'Restart the game. Enter through the chosen mode’s button on the main menu instead of Resume.',
          'If a connection error remains after 1.0.7, do not assume the same cause. The publisher also mentions VPN-related connectivity; record whether one is used and consult the administrator or official support before changing a required connection.',
        ],
        time: 'About 3–5 minutes to check; update time varies',
        risk: 'low',
      },
      {
        id: 'report',
        title: 'Record the save list and remaining symptoms',
        summary:
          'Restored access is different from recovery of progress that was never saved.',
        actions: [
          'Once access returns, check save timestamps and zoo names. If a save is absent or older than expected, record that instead of overwriting it with a new empty game.',
          'Report the version, mode, whether you used Resume or a mode button, exact error and last confirmed save time through the official Issue Tracker. Keep private details and raw logs out of public posts.',
          'Do not repeatedly trigger an animal-release crash using your only save. Record other crash scenes separately by mode and action.',
        ],
        time: 'About 3–5 minutes to check; update time varies',
        risk: 'low',
      },
    ],
    faqs: [
      {
        question:
          'Does the statement that saves were not lost cover every case?',
        answer:
          'No. It addresses the Franchise Resume connection/menu problem after 1.0.6. It does not guarantee recovery of unsaved progress or unrelated save incidents.',
      },
      {
        question: 'Are these fixes released rather than still being tested?',
        answer:
          'The specific timer reset and animal-release crash appear as fixes in 1.0.6, and the Resume connection problem in 1.0.7. We have not verified improvement on a physical gaming system.',
      },
      {
        question: 'Will reinstalling or resetting sync recover progress?',
        answer:
          'That recovery effect is not established. The publisher explicitly says not to delete the saves folder for this issue. Preserve existing saves and report the update status and symptoms.',
      },
    ],
    diagnosis: [
      {
        symptom: 'Resume cannot load',
        cause: 'Check version and update completion first',
        stepId: 'protect',
      },
    ],
    avoid: [
      'Do not delete saves, overwrite unidentified data or reset cloud synchronization',
      'Do not repeatedly test a risky trigger using your only save',
    ],
    cautions: [
      'Keep this Resume issue separate from unrelated data loss. No unverified save path is supplied.',
    ],
    sources: [
      {
        label:
          'Official Steam: October 23 releases 1.0.6 and 1.0.7 (reviewed October 24)',
        url: 'https://steamcommunity.com/app/3219030/allnews/',
      },
    ],
    locale: 'en',
    gameName: 'Planet Zoo 2',
    related: [
      {
        href: '/en/guide/steam-cloud-sync-error',
        label: 'Separate symptom: Steam Cloud sync errors',
      },
      {
        href: '/en/guide/pc-game-crash',
        label: 'Crashes in other scenes',
      },
    ],
  },
];
