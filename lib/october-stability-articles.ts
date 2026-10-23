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
    checkedAt: '2026-10-22',
    quickFacts: [
      {
        label: '確認日',
        value: '2026年10月22日',
      },
      {
        label: '状態',
        value: '対象問題は10月20日告知で修正テスト中。',
      },
      {
        label: '対象',
        value: 'Steam版・動物解放とオートセーブ',
      },
    ],
    diagnosis: [
      {
        symptom: 'ハブ移動後に自動保存されない',
        cause: '既知のタイマー問題。まず手動保存を確認',
        stepId: 'protect',
      },
      {
        symptom: '動物解放時に落ちる',
        cause: '公式調査項目と照合し、再現を繰り返さない',
        stepId: 'status',
      },
    ],
    faqs: [
      {
        question: '再インストールすれば失った進行が戻りますか？',
        answer:
          '復旧できる根拠は確認できていません。まず既存の保存を保護し、My Savesに残る日時と動物園を確認してください。',
      },
    ],
    title:
      'Planet Zoo 2が落ちる・オートセーブされない時は｜動物解放とハブ移動の既知問題',
    shortTitle: 'クラッシュ・オートセーブ',
    description:
      'Planet Zoo 2の動物解放時クラッシュとハブ移動でオートセーブが動かない問題。10月20日の修正テスト状況、手動保存とMy Savesの公式回避策を解説します。',
    steps: [
      {
        id: 'protect',
        title: '公式回避策：手動保存とMy Savesを使う',
        summary:
          'オートセーブだけに任せず、保存を確認してから次の操作に進みます。',
        actions: [
          '公式は頻繁な手動保存と、メインメニューのMy Savesからのロードを案内している。日本語UIの項目名は未確認。',
          '一般的な予防策：ロード前に保存日時と対象の動物園を確認する。別枠で保存できる場合は、既存の正常な保存を残す。',
          'クラウド競合や保存先が不明な場合は上書きを止める。この記事は削除や復元を案内するものではない。',
        ],
        time: '約5分',
        risk: 'low',
      },
      {
        id: 'status',
        title: '10月20日の調査項目と1.0.5を区別する',
        summary:
          'Under Investigationは次回更新に向けた修正テストの告知で、確定パッチノートではありません。',
        actions: [
          '対象はフランチャイズの野生保護区へ動物を解放する時のクラッシュと、planet hubへ入るとオートセーブタイマーがリセットされ保存が発動しない問題。',
          '10月16日の1.0.5では安定性改善などが配信されたが、それだけで10月20日の対象問題が直ったとは判断しない。',
          '現在の版と最新の正式な更新内容を照合する。予定一覧のFixedという表現だけで配信済みと判断しない。',
        ],
        time: '約5分',
        risk: 'low',
      },
      {
        id: 'isolate',
        title: '一般的な予防策：危険な再現を繰り返さない',
        summary:
          'ここからは公式の修正保証ではなく、進行を守りながら原因を整理する手順です。',
        actions: [
          '動物解放で落ちるなら、その操作を繰り返さず保存を確認して作業を中断する。',
          'ハブ移動の前後に手動保存を確認し、オートセーブの待ち時間だけを頼りに終了しない。',
          'ほかの場面で落ちる場合も、全クラッシュを動物解放の既知問題と決めつけず、モード・操作・発生時刻を分けて記録する。',
        ],
        time: '約5分',
        risk: 'low',
      },
      {
        id: 'report',
        title: '保存済みの状態を確認し、未解決なら報告する',
        summary: '既に失った進行の復旧方法は、この告知では確認できません。',
        actions: [
          'My Savesに残る保存の日時と対象を確認する。新規ゲームや空のデータで既存セーブを置き換えない。',
          'ゲーム版、モード、発生操作、最後に成功した手動保存、エラーを記録し、公式告知が案内するIssue Trackerへ報告する。',
          '公開報告に個人情報を含めない。実機での改善確認は行っていないため、結果を保証しない。',
        ],
        time: '約5分',
        risk: 'low',
      },
    ],
    avoid: [
      'セーブファイルの削除や、内容不明のクラウド上書きをしない。',
      '動物解放クラッシュを確かめるために、唯一のセーブで繰り返し試さない。',
    ],
    cautions: [
      'My Savesは公式の英語表記です。未確認のセーブパスや日本語UI名は記載しません。',
    ],
    related: [],
    gameSlug: 'planet-zoo-2',
    slug: 'crashing-autosave',
    category: 'save',
    status: 'verified',
    sources: [
      {
        label: '公式Steam告知：2026年10月16日・20日（10月22日確認）',
        url: 'https://steamcommunity.com/app/3219030/allnews/',
      },
      {
        label: 'Steamストア：正式名・発売日',
        url: 'https://store.steampowered.com/app/3219030/',
      },
    ],
    symptom:
      'Steam版Planet Zoo 2で動物解放時に落ちる、保存したはずの進行が残らない人向け。公式資料の確認日は2026年10月22日です。',
    conclusion:
      'まず手動保存をこまめに行い、ロードはメインメニューのMy Savesから行ってください。10月20日の公式告知では動物解放時クラッシュとハブ移動時のオートセーブ問題の修正をテスト中です。修正済みとも、失った進行を戻せるとも確認されていません。',
    seoTitle:
      'Planet Zoo 2が落ちる・オートセーブされない時は｜動物解放とハブ移動の既知問題',
    metaDescription:
      'Planet Zoo 2の動物解放時クラッシュとハブ移動でオートセーブが動かない問題。10月20日の修正テスト状況、手動保存とMy Savesの公式回避策を解説します。',
    symptoms: [
      {
        label: '公式回避策：手動保存とMy Savesを使う',
        target: 'protect',
      },
      {
        label: '10月20日の調査項目と1.0.5を区別する',
        target: 'status',
      },
      {
        label: '一般的な予防策：危険な再現を繰り返さない',
        target: 'isolate',
      },
      {
        label: '保存済みの状態を確認し、未解決なら報告する',
        target: 'report',
      },
    ],
    nextChecks: {
      heading: '関連する症状を確認',
      links: [
        {
          href: '/guide/steam-cloud-sync-error',
          label: 'Steamクラウドの同期エラー',
        },
        {
          href: '/guide/pc-game-crash',
          label: '他の場面で落ちる時の一般的な切り分け',
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
    checkedAt: '2026-10-22',
    quickFacts: [
      {
        label: 'Checked',
        value: 'October 22, 2026',
      },
      {
        label: 'Status',
        value:
          'Fixes for these issues were being tested in the October 20 notice.',
      },
      {
        label: 'Scope',
        value: 'Steam: animal release and autosave',
      },
    ],
    diagnosis: [
      {
        symptom: 'Autosave does not trigger after a hub transition',
        cause: 'Known timer issue; confirm a manual save first',
        stepId: 'protect',
      },
      {
        symptom: 'The game crashes when releasing animals',
        cause: 'Compare with the investigation notice; avoid repeated tests',
        stepId: 'status',
      },
    ],
    faqs: [
      {
        question: 'Will reinstalling recover lost progress?',
        answer:
          'We found no evidence that it will. Protect existing saves first, then check the timestamps and zoos still available in My Saves.',
      },
    ],
    title:
      'Planet Zoo 2 Crashes and Autosave Not Working: Animal Release and Hub Issues',
    shortTitle: 'Crashes and autosave',
    description:
      'What to do about Planet Zoo 2 animal-release crashes and the hub autosave timer issue: official manual-save advice, My Saves, and the October 20 investigation status.',
    lead: 'For Steam players losing progress or crashing when releasing animals. Official sources checked October 22, 2026.',
    summary:
      'Save manually and often, then load through My Saves on the main menu. The October 20 notice says fixes for animal-release crashes and the hub autosave issue are being tested. It does not confirm a released fix or a way to recover progress already lost.',
    steps: [
      {
        id: 'protect',
        title: 'Official workaround: manual saves and My Saves',
        summary:
          'Confirm a save before continuing instead of relying entirely on autosave.',
        actions: [
          'The publisher advises frequent manual saves and loading through My Saves on the main menu.',
          'General precaution: check the save timestamp and zoo before loading. If a separate slot is available, retain your known-good save.',
          'Stop before overwriting if cloud copies conflict or you cannot identify the save. This guide does not instruct you to delete or restore files.',
        ],
        time: 'About 5 minutes',
        risk: 'low',
      },
      {
        id: 'status',
        title: 'Separate the October 20 investigation from 1.0.5',
        summary:
          'Under Investigation describes fixes being tested for a future update, not final patch notes.',
        actions: [
          'The listed issues include crashes when releasing animals into franchise wildlife reserves and an autosave timer reset on entering the planet hub that prevents autosaving.',
          'Version 1.0.5 delivered stability improvements on October 16. That does not establish that the issues listed on October 20 are fixed.',
          'Compare your installed version with actual release notes. The word Fixed in the investigation list does not establish that a fix has shipped.',
        ],
        time: 'About 5 minutes',
        risk: 'low',
      },
      {
        id: 'isolate',
        title: 'General precaution: avoid repeating a risky trigger',
        summary:
          'These steps help protect progress and organize evidence; they are not guaranteed fixes.',
        actions: [
          'If releasing an animal causes a crash, stop repeating the action and check your saved progress before continuing.',
          'Confirm manual saves around hub transitions. Do not rely on elapsed autosave time alone before quitting.',
          'For crashes elsewhere, record the mode, action and time separately rather than attributing every crash to animal release.',
        ],
        time: 'About 5 minutes',
        risk: 'low',
      },
      {
        id: 'report',
        title: 'Check existing saves and report unresolved issues',
        summary:
          'The notice does not establish a recovery method for progress already lost.',
        actions: [
          'Review the timestamps and zoos still listed in My Saves. Do not replace an existing save with a new or empty game.',
          'Record the game version, mode, triggering action, last successful manual save and any error. Follow the official notice to the Issue Tracker.',
          'Remove personal details from public reports. We have not tested the game on a physical PC and cannot guarantee an improvement.',
        ],
        time: 'About 5 minutes',
        risk: 'low',
      },
    ],
    avoid: [
      'Do not delete save files or overwrite cloud data you have not identified.',
      'Do not repeatedly test the animal-release crash using your only save.',
    ],
    cautions: ['This guide does not assume an unverified save-file path.'],
    related: [
      {
        href: '/en/guide/steam-cloud-sync-error',
        label: 'Steam Cloud sync errors',
      },
      {
        href: '/en/guide/pc-game-crash',
        label: 'General checks for crashes in other scenes',
      },
    ],
    gameSlug: 'planet-zoo-2',
    gameName: 'Planet Zoo 2',
    slug: 'crashing-autosave',
    locale: 'en',
    sources: [
      {
        label:
          'Official Steam announcements: October 16 and 20 (checked October 22, 2026)',
        url: 'https://steamcommunity.com/app/3219030/allnews/',
      },
      {
        label: 'Steam store: title and release date',
        url: 'https://store.steampowered.com/app/3219030/',
      },
    ],
  },
];
