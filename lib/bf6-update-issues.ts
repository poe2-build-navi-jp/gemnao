import type { GameArticle } from '@/lib/game-articles';
import type { LocalizedArticle } from '@/lib/localized/types';
// Steam facts reconciled with previously retrieved official records; see review document.
export const bf6UpdateIssues: GameArticle[] = [
  {
    gameSlug: 'battlefield-6',
    slug: 'crash-after-update',
    title: 'BF6がアップデート後にクラッシュする｜10/22修正の対象と確認手順',
    shortTitle: '更新後にクラッシュ',
    description:
      'BF6の更新後クラッシュをマップ・更新状態・エラーで切り分け。10/22のVegas Strip・Area 51向け安定性改善と、全クラッシュ解決との違いを説明します。',
    checkedAt: '2026-10-24',
    steps: [
      {
        id: 'check-client-update',
        title: '正規ランチャーの更新状態を確認',
        summary: '確認結果を記録し、未確認は未確認のまま残します。',
        time: '確認約3分（ダウンロードを除く）',
        risk: 'low',
        actions: [
          'ゲームを終了し、利用している正規ランチャーでBF6の更新待ち・ダウンロード中・完了の表示を確認する。進行中なら終了を待ち、表示が不明なら推測で完了扱いにしない。',
          '表示されるバージョンや更新日時を自分用に記録する。Hotfix告知には番号がないため、特定の番号が出るはずとは決めない。',
        ],
      },
      {
        id: 'match-crash-scope',
        title: 'マップ・モード・落ちる場面を照合',
        summary: '確認結果を記録し、未確認は未確認のまま残します。',
        time: '確認約3分（ダウンロードを除く）',
        risk: 'low',
        actions: [
          'Vegas Strip・Area 51か、それ以外のマップかを分け、ゲームモードと落ちる場面を控える。別マップの症状まで今回の修正対象と広げない。',
          '2.1.1.0は10/13配信の大型更新です。10/22 Hotfixの番号や修正範囲と同一視しない。画面にJavelin 94やSecure Bootの要求が出る場合は、その全文に合う専用記事へ。',
        ],
      },
      {
        id: 'report-crash-after-update',
        title: '更新後も落ちる場合は状況を記録',
        summary: '確認結果を記録し、未確認は未確認のまま残します。',
        time: '確認約3分（ダウンロードを除く）',
        risk: 'low',
        actions: [
          '通常プレイで再発した場合、日時、機種、ランチャー、マップ、モード、エラー全文、更新完了の表示を控える。クラッシュを何度も意図的に再現する必要はない。',
          '公式告知の後続更新を確認し、続く場合はEAの公式サポートへ比較結果を伝える。ユーザー名や個人情報が写る画面、生ログを公開欄へ貼らない。',
        ],
      },
    ],
    quickFacts: [
      {
        label: '告知日／対象',
        value: '2026-10-22／Vegas Strip・Area 51。番号・機種指定なし',
      },
    ],
    diagnosis: [
      {
        symptom: '更新後にクラッシュ',
        cause: '原因を断定せず、告知の対象と照合',
        stepId: 'check-client-update',
      },
    ],
    avoid: [
      'セーブ削除・保護無効化・BIOS変更を一般的な解決法にしない',
      '根拠のないHotfix番号や全モード共通の修正を作らない',
    ],
    cautions: [
      '公式告知の範囲を整理した記事です。ゲーム実機での再現・解決確認は行っていません。',
      '公式の後続案内により状況が変わる場合があります。',
    ],
    faqs: [
      {
        question: '修正済みバージョンは何番ですか？',
        answer:
          '10/22告知にはHotfix番号がありません。記載できるのは配信日と対象マップ・安定性改善という範囲です。2.1.1.0をこのHotfixの番号として扱いません。',
      },
      {
        question: '他のマップでも落ちます',
        answer:
          'その症状が10/22修正の対象だとは確認できません。マップ名と場面を記録し、別の告知やエラーに該当するか確認してください。',
      },
      {
        question: '更新すれば必ず直りますか？',
        answer:
          'いいえ。対象マップの安定性改善は配信済みですが、個別環境での解決保証ではありません。更新後も続く症状は別途記録して相談します。',
      },
    ],
    sources: [
      {
        url: 'https://steamcommunity.com/app/2807960/discussions/0/572678538884419660/',
        label: 'BFComms：10/22 Stability Hotfix（英語）',
      },
      {
        url: 'https://steamcommunity.com/app/2807960/discussions/0/564796840407520709/',
        label: 'BFComms：10/16 Season 5既知問題（英語）',
      },
      {
        url: 'https://www.ea.com/games/battlefield/redsec/news/battlefield-6-game-update-2-1-1-0',
        label: 'EA：2.1.1.0（10/12告知・10/13配信、英語）',
      },
    ],
    category: 'launch',
    status: 'verified',
    seoTitle: 'BF6がアップデート後にクラッシュする｜10/22修正の対象と確認手順',
    metaDescription:
      'BF6の更新後クラッシュをマップ・更新状態・エラーで切り分け。10/22のVegas Strip・Area 51向け安定性改善と、全クラッシュ解決との違いを説明します。',
    symptom:
      '更新後にゲームが終了する人向けです。落ちるマップ、モード、場面と更新状態を先に確認します。起動前のJavelin 94・Secure Bootエラーは別の記事へ進みます。',
    conclusion:
      '10/22の公式告知では、Vegas StripとArea 51の安定性を改善するクライアントHotfixを配信済みです。再プレイには更新のダウンロードが必要と案内されています。まず利用中の正規ランチャーで更新が完了しているか確認してください。全マップ・全クラッシュが直ったという告知ではありません。',
    symptoms: [
      {
        label: '正規ランチャーの更新状態を確認',
        target: 'check-client-update',
      },
      {
        label: 'マップ・モード・落ちる場面を照合',
        target: 'match-crash-scope',
      },
      {
        label: '更新後も落ちる場合は状況を記録',
        target: 'report-crash-after-update',
      },
    ],
    related: [
      'cannot-revive',
      'javelin-error-94',
      'secure-boot-enabled-not-launching',
    ],
  },
  {
    gameSlug: 'battlefield-6',
    slug: 'cannot-revive',
    title: 'BF6で蘇生できない｜BRの蘇生表示・操作と公式調査状況',
    shortTitle: '蘇生できない（BR）',
    description:
      'BF6／REDSECのBRでダウンした分隊員の蘇生表示が出ない・作動しない症状。10/16告知時点の調査状況と、モード・更新・表示を確認する手順を整理します。',
    checkedAt: '2026-10-24',
    steps: [
      {
        id: 'identify-revive-mode',
        title: 'モードと蘇生の対象を確認',
        summary: '確認結果を記録し、未確認は未確認のまま残します。',
        time: '確認約3分（ダウンロードを除く）',
        risk: 'low',
        actions: [
          'Battle Royaleか、通常マルチプレイヤーなど別モードかを確認する。ダウンした分隊員への操作か、蘇生後の装備など別の症状かも分ける。',
          '表示がまったく出ないのか、出ても作動しないのかを控える。機種・入力方法・マップも記録し、告知に書かれていない全機種共通の問題とは決めない。',
        ],
      },
      {
        id: 'check-revive-status',
        title: '更新状態と日付付き告知を確認',
        summary: '確認結果を記録し、未確認は未確認のまま残します。',
        time: '確認約3分（ダウンロードを除く）',
        risk: 'low',
        actions: [
          '利用中の正規ランチャーの更新状態を確認する。更新があれば通常手順で完了させ、導入状況を控える。ただし更新完了だけでこの問題の修正済み判定はしない。',
          '10/16の既知問題告知と、その後の公式案内を確認する。2.1.1.0の蘇生アニメーション改善は、BRの蘇生表示・操作問題の修正完了を示すものではない。',
        ],
      },
      {
        id: 'record-revive-result',
        title: '状況を保存して公式窓口へ',
        summary: '確認結果を記録し、未確認は未確認のまま残します。',
        time: '確認約3分（ダウンロードを除く）',
        risk: 'low',
        actions: [
          '通常プレイで起きた日時、モード、マップ、分隊員の状態、表示の有無、押した操作、機種を控える。個人情報を除いた短い記録で十分。',
          'この告知から確実な回避操作や修正予定日は確認できません。設定初期化を繰り返さず、公式の追加案内を待つかEAサポートへ状況を伝える。公開動画では他の利用者名・音声にも配慮する。',
        ],
      },
    ],
    quickFacts: [
      {
        label: '告知日／対象',
        value:
          '2026-10-16／Battle Royaleのダウンした分隊員。機種・版の指定なし',
      },
    ],
    diagnosis: [
      {
        symptom: '蘇生できない（BR）',
        cause: '原因を断定せず、告知の対象と照合',
        stepId: 'identify-revive-mode',
      },
    ],
    avoid: [
      'セーブ削除・保護無効化・BIOS変更を一般的な解決法にしない',
      '根拠のないHotfix番号や全モード共通の修正を作らない',
    ],
    cautions: [
      '公式告知の範囲を整理した記事です。ゲーム実機での再現・解決確認は行っていません。',
      '公式の後続案内により状況が変わる場合があります。',
    ],
    faqs: [
      {
        question: '全モードで起きる問題ですか？',
        answer:
          '10/16告知の対象はBattle Royaleです。通常マルチプレイヤーや別の蘇生症状まで共通の原因だと広げません。',
      },
      {
        question: '10/24現在も未修正ですか？',
        answer:
          '今回確認できるのは10/16告知時点で調査中だったことです。その後の修正完了は確認できず、現在も確実に未修正とは断定しません。',
      },
      {
        question: 'Hotfixや2.1.1.0で直りましたか？',
        answer:
          '10/22はマップ安定性、2.1.1.0には蘇生アニメーション改善の記載があります。いずれも今回のBRプロンプト問題が解決したと読み替えません。',
      },
    ],
    sources: [
      {
        url: 'https://steamcommunity.com/app/2807960/discussions/0/572678538884419660/',
        label: 'BFComms：10/22 Stability Hotfix（英語）',
      },
      {
        url: 'https://steamcommunity.com/app/2807960/discussions/0/564796840407520709/',
        label: 'BFComms：10/16 Season 5既知問題（英語）',
      },
      {
        url: 'https://www.ea.com/games/battlefield/redsec/news/battlefield-6-game-update-2-1-1-0',
        label: 'EA：2.1.1.0（10/12告知・10/13配信、英語）',
      },
    ],
    category: 'launch',
    status: 'verified',
    seoTitle: 'BF6で蘇生できない｜BRの蘇生表示・操作と公式調査状況',
    metaDescription:
      'BF6／REDSECのBRでダウンした分隊員の蘇生表示が出ない・作動しない症状。10/16告知時点の調査状況と、モード・更新・表示を確認する手順を整理します。',
    symptom:
      'Battle Royaleで、ダウンした分隊員の蘇生プロンプトが表示されない、または作動しない症状向けです。ほかのモードや蘇生後の別症状まで同じ問題とは扱いません。',
    conclusion:
      '10/16の公式告知では、Battle Royaleのダウンした分隊員に対する蘇生表示・操作が出ない、または作動しない報告を調査中としています。その後の修正完了は今回確認できていません。まずモードと症状が一致するかを記録し、公式の後続更新を確認してください。10/22のマップ安定性Hotfixで蘇生も直ったとは判断できません。',
    symptoms: [
      {
        label: 'モードと蘇生の対象を確認',
        target: 'identify-revive-mode',
      },
      {
        label: '更新状態と日付付き告知を確認',
        target: 'check-revive-status',
      },
      {
        label: '状況を保存して公式窓口へ',
        target: 'record-revive-result',
      },
    ],
    related: [
      'crash-after-update',
      'javelin-error-94',
      'secure-boot-enabled-not-launching',
    ],
  },
];
export const bf6UpdateIssuesEn: LocalizedArticle[] = [
  {
    gameSlug: 'battlefield-6',
    slug: 'crash-after-update',
    title:
      'Battlefield 6 crashes after an update: October 22 hotfix scope and checks',
    shortTitle: 'Crashes after updating',
    description:
      'Check the map, update status and error for BF6 crashes after updating. Separate the October 22 Vegas Strip and Area 51 stability hotfix from a promise to fix every crash.',
    lead: 'For players whose game closes after an update. Record the map, mode, stopping point and update status first. Pre-launch Javelin 94 and Secure Boot messages have separate guides.',
    summary:
      'The October 22 announcement says a client hotfix was deployed to improve stability on Vegas Strip and Area 51, with a download required before playing again. First check that the update has completed in your official launcher. The announcement does not say that every crash on every map is fixed.',
    checkedAt: '2026-10-24',
    steps: [
      {
        id: 'check-client-update',
        title: 'Check the official launcher update status',
        summary: 'Record the result and leave unverified details unknown.',
        time: 'About 3 minutes to check; download time varies',
        risk: 'low',
        actions: [
          'Close the game and check whether your official launcher shows an update pending, downloading or completed. Let an active download finish; do not assume completion if the state is unclear.',
          'Record the displayed version or update time privately. The hotfix announcement does not specify a version number, so do not expect a particular number.',
        ],
      },
      {
        id: 'match-crash-scope',
        title: 'Match the map, mode and crash point',
        summary: 'Record the result and leave unverified details unknown.',
        time: 'About 3 minutes to check; download time varies',
        risk: 'low',
        actions: [
          'Separate Vegas Strip or Area 51 from other maps and note the mode and crash point. Do not extend this hotfix to unrelated maps.',
          'Update 2.1.1.0 was released on October 13. Do not equate it with the October 22 hotfix version or scope. Use the dedicated guide if the message explicitly names Javelin 94 or Secure Boot.',
        ],
      },
      {
        id: 'report-crash-after-update',
        title: 'Record crashes that remain after updating',
        summary: 'Record the result and leave unverified details unknown.',
        time: 'About 3 minutes to check; download time varies',
        risk: 'low',
        actions: [
          'If it recurs during normal play, note the time, platform, launcher, map, mode, exact error and update-completion display. There is no need to repeatedly force a crash.',
          'Check later official announcements and report the comparison to official EA support if it continues. Do not post screenshots with account details or raw logs publicly.',
        ],
      },
    ],
    quickFacts: [
      {
        label: 'Notice date / scope',
        value:
          '2026-10-22 / Vegas Strip and Area 51; no version or platform specified',
      },
    ],
    diagnosis: [
      {
        symptom: 'Crashes after updating',
        cause: 'Match notice scope without assuming a cause',
        stepId: 'check-client-update',
      },
    ],
    avoid: [
      'Do not delete saves, disable protection or change BIOS settings as a generic fix',
      'Do not invent a hotfix number or an all-mode fix',
    ],
    cautions: [
      'This guide summarizes official notices; no hands-on reproduction or successful repair is claimed.',
      'Later official announcements may change the status.',
    ],
    faqs: [
      {
        question: 'What version contains the hotfix?',
        answer:
          'The October 22 notice does not give a version number. Its date, named maps and stability-improvement scope are the verified identifiers. Do not assign 2.1.1.0 to this hotfix.',
      },
      {
        question: 'What if another map crashes?',
        answer:
          'That is not established as part of this hotfix. Record the map and stopping point, then check whether another notice or error applies.',
      },
      {
        question: 'Will updating definitely fix it?',
        answer:
          'No. A deployed stability improvement is not a guarantee for each system. Record and report symptoms that continue after updating.',
      },
    ],
    sources: [
      {
        url: 'https://steamcommunity.com/app/2807960/discussions/0/572678538884419660/',
        label: 'BFComms: October 22 Stability Hotfix',
      },
      {
        url: 'https://steamcommunity.com/app/2807960/discussions/0/564796840407520709/',
        label: 'BFComms: October 16 Season 5 known issues',
      },
      {
        url: 'https://www.ea.com/games/battlefield/redsec/news/battlefield-6-game-update-2-1-1-0',
        label: 'EA: 2.1.1.0 (October 12 notice / October 13 release)',
      },
    ],
    locale: 'en',
    gameName: 'Battlefield 6',
    related: [
      {
        href: '/en/games/battlefield-6/cannot-revive',
        label: 'Battle Royale revive issues',
      },
      {
        href: '/en/games/battlefield-6/javelin-error-94',
        label: 'Javelin error 94',
      },
      {
        href: '/en/games/battlefield-6/secure-boot-enabled-not-launching',
        label: 'Secure Boot requirement',
      },
    ],
  },
  {
    gameSlug: 'battlefield-6',
    slug: 'cannot-revive',
    title:
      'Battlefield 6 cannot revive: Battle Royale prompts and official issue status',
    shortTitle: 'Cannot revive in Battle Royale',
    description:
      'Check BF6/REDSEC Battle Royale revive prompts that do not appear or activate over downed squadmates. Separate the October 16 investigation from later updates and other modes.',
    lead: 'For Battle Royale players whose revive prompt does not appear or activate over a downed squadmate. Do not treat other modes or different post-revive symptoms as the same issue.',
    summary:
      'The October 16 official notice says reports of missing or inactive revive prompts over downed squadmates in Battle Royale were under investigation. A later confirmed fix was not verified in this review. Record whether the mode and symptom match, then check subsequent official updates. The October 22 map-stability hotfix does not establish that reviving was fixed.',
    checkedAt: '2026-10-24',
    steps: [
      {
        id: 'identify-revive-mode',
        title: 'Identify the mode and revive target',
        summary: 'Record the result and leave unverified details unknown.',
        time: 'About 3 minutes to check; download time varies',
        risk: 'low',
        actions: [
          'Check whether this is Battle Royale or another mode such as standard multiplayer. Separate reviving a downed squadmate from equipment or other problems after a revive.',
          'Note whether the prompt is absent or visible but inactive, plus platform, input method and map. Do not infer universal platform impact from an unspecified notice.',
        ],
      },
      {
        id: 'check-revive-status',
        title: 'Check update status and dated notices',
        summary: 'Record the result and leave unverified details unknown.',
        time: 'About 3 minutes to check; download time varies',
        risk: 'low',
        actions: [
          'Check update status in your official launcher and complete any pending update normally, recording the result. Completion alone does not establish a fix for this issue.',
          'Check the October 16 issue notice and later official announcements. The revive-animation improvements in 2.1.1.0 do not establish a fix for the Battle Royale prompt issue.',
        ],
      },
      {
        id: 'record-revive-result',
        title: 'Keep a concise record for official support',
        summary: 'Record the result and leave unverified details unknown.',
        time: 'About 3 minutes to check; download time varies',
        risk: 'low',
        actions: [
          'Record the time, mode, map, squadmate state, whether a prompt appeared, attempted input and platform during normal play. Keep the report short and remove personal details.',
          'This notice does not establish a reliable workaround or fix date. Avoid repeatedly resetting settings; follow later official guidance or report the situation to EA support. Remove other players’ names and voice audio from public clips.',
        ],
      },
    ],
    quickFacts: [
      {
        label: 'Notice date / scope',
        value:
          '2026-10-16 / downed squadmates in Battle Royale; no platform or version specified',
      },
    ],
    diagnosis: [
      {
        symptom: 'Cannot revive in Battle Royale',
        cause: 'Match notice scope without assuming a cause',
        stepId: 'identify-revive-mode',
      },
    ],
    avoid: [
      'Do not delete saves, disable protection or change BIOS settings as a generic fix',
      'Do not invent a hotfix number or an all-mode fix',
    ],
    cautions: [
      'This guide summarizes official notices; no hands-on reproduction or successful repair is claimed.',
      'Later official announcements may change the status.',
    ],
    faqs: [
      {
        question: 'Does this affect every mode?',
        answer:
          'The October 16 notice concerns Battle Royale. It does not establish the same cause in standard multiplayer or for other revive symptoms.',
      },
      {
        question: 'Is it definitely still unfixed on October 24?',
        answer:
          'This review establishes the investigation stated on October 16. A subsequent confirmed fix was not verified, which is not proof that it remains unfixed today.',
      },
      {
        question: 'Did the hotfix or 2.1.1.0 fix it?',
        answer:
          'October 22 concerns map stability, while 2.1.1.0 mentions revive-animation improvements. Neither statement establishes resolution of this Battle Royale prompt issue.',
      },
    ],
    sources: [
      {
        url: 'https://steamcommunity.com/app/2807960/discussions/0/572678538884419660/',
        label: 'BFComms: October 22 Stability Hotfix',
      },
      {
        url: 'https://steamcommunity.com/app/2807960/discussions/0/564796840407520709/',
        label: 'BFComms: October 16 Season 5 known issues',
      },
      {
        url: 'https://www.ea.com/games/battlefield/redsec/news/battlefield-6-game-update-2-1-1-0',
        label: 'EA: 2.1.1.0 (October 12 notice / October 13 release)',
      },
    ],
    locale: 'en',
    gameName: 'Battlefield 6',
    related: [
      {
        href: '/en/games/battlefield-6/crash-after-update',
        label: 'Crashes after updating',
      },
      {
        href: '/en/games/battlefield-6/javelin-error-94',
        label: 'Javelin error 94',
      },
      {
        href: '/en/games/battlefield-6/secure-boot-enabled-not-launching',
        label: 'Secure Boot requirement',
      },
    ],
  },
];
