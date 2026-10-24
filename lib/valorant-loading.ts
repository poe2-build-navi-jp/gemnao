import type { GameArticle } from '@/lib/game-articles';
import type { LocalizedArticle } from '@/lib/localized/types';

export const valorantLoadingArticles: GameArticle[] = [
  {
    title: 'VALORANTがロード画面で止まる｜PC版の確認手順と既知問題の違い',
    shortTitle: 'ロード画面で止まる',
    description:
      'VALORANT PC版のロード停止を、起動失敗・ログイン失敗・VAN9003・更新0%から切り分け。公式案内とパッチの対象を確認し、安全な比較と相談記録をまとめます。',
    quickFacts: [
      {
        label: '対象',
        value:
          'Windows PC版。クライアント／ログイン／試合ロードのどこで止まるかを区別',
      },
      {
        label: '確認日',
        value: '2026-10-24。一般ロード案内は2026-09-21更新',
      },
      {
        label: 'パッチとの区別',
        value:
          '13.08の特定のキュー問題は、すべてのロード停止の原因を示すものではありません',
      },
    ],
    steps: [
      {
        id: 'record-loading-stage',
        title: '止まる位置とエラーを記録する',
        summary: '設定を変える前に、自分の症状を絞ります。',
        actions: [
          'Riot Client、ログイン後、エージェント選択、試合ロードのどこで止まるか、待った時間、音が続くか、エラー全文を自分用に控える。',
          'VAN9003なら専用記事へ。プレイを押しても画面自体が開かない場合は起動記事へ。更新ダウンロードの0%を試合ロードと同じ扱いにしない。',
          'Windowsの版とGPU名を記録する。アカウント名・チャット・個人情報が写る画像を公開しない。',
        ],
        time: '確認約3〜5分（処理待ちを除く）',
        risk: 'low',
      },
      {
        id: 'match-loading-notice',
        title: '告知の対象と自分の症状を照合する',
        summary: '似た言葉だけで同じ問題とは決めません。',
        actions: [
          '出典の13.08では、練習場をキュー待ち中に使う機能の問題で機能を停止し、修正を試験中と説明しています。通常のログイン停止全般の説明には広げません。',
          '同じパッチのTeam MVP表示問題も別件です。2024年のロード・ログイン案内の「最近の更新」を今日の新規障害として読み替えません。',
          '公式告知が自分の状況に当てはまるなら更新を確認します。当てはまらない場合も、PC故障やデータ消失とは断定しません。',
        ],
        time: '確認約3〜5分（処理待ちを除く）',
        risk: 'low',
      },
      {
        id: 'compare-loading-safely',
        title: '接続・ドライバー・修復を1つずつ比較する',
        summary: '一般ロード案内と公式修復から、必要な確認を選びます。',
        actions: [
          'Wi-Fi利用時は、安全に用意できれば有線接続で同じ停止位置になるか比較する。ネットワーク管理権限がない機器は管理者に相談する。',
          'GPU名と現在の版を控え、PC・GPUメーカーの公式案内で対応ドライバーを確認する。更新する場合は機種別手順に従い、他の変更と同時に行わない。',
          'Riot Clientにログインできる場合はプロフィール→設定→VALORANT→修復を選び、完了後に比較する。ボタンがない・失敗する場合は表示を記録し、フォルダー削除で代用しない。',
        ],
        risk: 'medium',
        time: '確認約3〜5分（処理待ちを除く）',
      },
      {
        id: 'report-loading-result',
        title: '未解決なら比較結果を公式サポートへ',
        summary: '分からない項目を推測で埋めません。',
        actions: [
          '停止位置、発生日時、WindowsとGPUの版、エラー全文、試した項目と変化をRiotサポートへ伝える。未実施は未実施と書く。',
          '公式案内にはさらに広い変更もありますが、この初心者向け記事では保護停止・第三者削除ツール・ファームウェア変更を一律には案内しません。必要性を個別に相談する。',
          'ログは公式窓口が求める範囲だけ確認して渡し、公開欄に生ログ・アカウント情報・回復キーを貼らない。',
        ],
        time: '確認約3〜5分（処理待ちを除く）',
        risk: 'low',
      },
    ],
    avoid: [
      'ロード停止だけを理由にTPMを初期化、ディスク変換、Secure Bootキーの変更をしない',
      'ウイルス対策やVanguardを無効化しない。第三者修復ツールやAppData一括削除を安易に試さない',
    ],
    cautions: [
      '公式の一般案内を使った切り分けであり、原因の確定や解決保証、実機での改善実績を示すものではありません。',
    ],
    faqs: [
      {
        question: '音だけ続いている場合も対象ですか？',
        answer:
          '一般ロード案内の対象に含まれます。ただし音が出るだけでは接続・描画・ファイルのどれが原因かは決まりません。停止位置と比較結果を記録します。',
      },
      {
        question: 'Intel内蔵GPUなら必ずドライバーが原因ですか？',
        answer:
          'いいえ。2024年の公式案内には古い署名のドライバーへの言及がありますが、すべてのIntel PCや今のロード停止の原因を証明するものではありません。機種と版を確認してから公式窓口で判断します。',
      },
      {
        question: 'VAN9003もこの手順だけでよいですか？',
        answer:
          '専用記事へ切り替えます。Secure Boot要件の通知なので、Windows上の状態確認と機種別手順の準備が先です。',
      },
      {
        question: '修復ボタンがありません',
        answer:
          'クライアントが開けるか、ログインできるかと表示を記録して相談してください。修復の代わりにゲームの設定フォルダーを消す必要はありません。',
      },
      {
        question: 'パッチの修正を待てば直りますか？',
        answer:
          '対象が一致するかと、その後の公式更新を確認します。13.08の記載だけで個別環境のロード停止が修正されるとは約束できません。',
      },
    ],
    gameSlug: 'valorant',
    slug: 'stuck-loading',
    checkedAt: '2026-10-24',
    sources: [
      {
        label: 'Riot：ロード画面で止まる（2026-09-21、英語）',
        url: 'https://support.riotgames.com/en-us/riot/performance/stuck-on-infinite-loading-screen',
      },
      {
        label: 'Riot：クライアントの修復（英語）',
        url: 'https://support.riotgames.com/en-us/riot/connectivity/riot-client-full-repair-tool',
      },
      {
        label: 'Riot：ロード・ログイン・選択画面の旧案内（2024-07-08、英語）',
        url: 'https://support.riotgames.com/en-us/riot/client/stuck-at-loading-screen-can-t-log-in-can-t-select-championagent-lolval',
      },
      {
        label: 'VALORANT：13.08パッチノート（2026-10-13、英語）',
        url: 'https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-13-08/',
      },
    ],
    diagnosis: [
      {
        symptom: 'VAN9003',
        cause: '表示に合う分岐を選ぶ',
        stepId: 'record-loading-stage',
      },
      {
        symptom: 'ロードが進まない',
        cause: '原因未確定。比較して記録',
        stepId: 'compare-loading-safely',
      },
    ],
    related: ['van9003', 'not-launching-no-van'],
    category: 'launch',
    status: 'verified',
    seoTitle: 'VALORANTがロード画面で止まる｜PC版の確認手順と既知問題の違い',
    metaDescription:
      'VALORANT PC版のロード停止を、起動失敗・ログイン失敗・VAN9003・更新0%から切り分け。公式案内とパッチの対象を確認し、安全な比較と相談記録をまとめます。',
    symptom:
      'ゲームやRiot Clientは開くのに次の画面へ進まないPC版向けです。停止位置とエラー全文を先に記録します。コンソールやMac向け手順ではありません。',
    conclusion:
      'ロード停止だけでは原因は確定しません。まず停止位置と対象の公式告知を照合し、接続・公式GPUドライバー・Riot Client修復を必要な範囲で1つずつ確認します。VAN9003が表示された場合はSecure Bootの専用記事へ進み、ロード停止を理由にBIOSを変えません。',
    symptoms: [
      {
        label: '止まる位置とエラーを記録する',
        target: 'record-loading-stage',
      },
      {
        label: '告知の対象と自分の症状を照合する',
        target: 'match-loading-notice',
      },
      {
        label: '接続・ドライバー・修復を1つずつ比較する',
        target: 'compare-loading-safely',
      },
      {
        label: '未解決なら比較結果を公式サポートへ',
        target: 'report-loading-result',
      },
    ],
  },
];

export const valorantLoadingEn: LocalizedArticle[] = [
  {
    title: 'VALORANT stuck on loading screen: PC checks and known-issue scope',
    shortTitle: 'Stuck on loading screen',
    description:
      'Separate VALORANT PC loading stalls from launch failures, login errors, VAN9003 and 0% downloads. Check official issue scope, compare safe options and prepare a support report.',
    lead: 'For Windows PC players whose game or Riot Client opens but does not reach the next screen. Record the stopping point and exact message first. These are not console or Mac instructions.',
    summary:
      'A loading stall does not identify its cause. Match the stopping point to official notices, then check connection, official GPU drivers and Riot Client repair one at a time as appropriate. If VAN9003 appears, use the Secure Boot guide instead. Do not change BIOS settings just because loading stalls.',
    quickFacts: [
      {
        label: 'Scope',
        value:
          'Windows PC: distinguish client, login, agent selection and match loading',
      },
      {
        label: 'Reviewed',
        value: '2026-10-24. General loading advice updated September 21, 2026',
      },
      {
        label: 'Patch scope',
        value:
          'The specific queue issue in 13.08 does not explain every loading stall',
      },
    ],
    steps: [
      {
        id: 'record-loading-stage',
        title: 'Record the stopping point and error',
        summary: 'Narrow the symptom before changing settings.',
        actions: [
          'Note whether the client, login, agent selection or match loading stalls, how long you waited, whether audio continues and the complete message.',
          'Use the VAN9003 guide for that code. If no game window opens after Play, use the launch guide. A download stuck at 0% is not the same as match loading.',
          'Record your Windows version and GPU model privately. Do not publish screenshots containing account names, chat or personal information.',
        ],
        time: 'About 3–5 minutes to check; processing varies',
        risk: 'low',
      },
      {
        id: 'match-loading-notice',
        title: 'Match the notice to your actual situation',
        summary: 'Similar wording does not establish the same cause.',
        actions: [
          'Patch 13.08 describes a queue-state issue involving the Practice Range while queuing. Riot disabled that feature and was testing a fix; this does not cover every login failure.',
          'The Team MVP display issue in that patch is separate. Do not reinterpret the older July 2024 login/loading article as a newly reported outage today.',
          'If a notice matches, check for official updates. A mismatch does not prove that your PC is broken or data has been lost.',
        ],
        time: 'About 3–5 minutes to check; processing varies',
        risk: 'low',
      },
      {
        id: 'compare-loading-safely',
        title: 'Compare connection, drivers and repair separately',
        summary:
          'Choose relevant checks from general loading and official repair advice.',
        actions: [
          'If you use Wi-Fi and can safely do so, compare the same stopping point on a wired connection. Ask the administrator before changing a managed network.',
          'Record the GPU model and driver version. Check the PC or GPU manufacturer for compatible official drivers; follow model-specific instructions for any update and do not combine it with other changes.',
          'If you can sign into Riot Client, open Profile → Settings → VALORANT → Repair. Compare after completion. If the option is missing or fails, record the message rather than deleting folders.',
        ],
        risk: 'medium',
        time: 'About 3–5 minutes to check; processing varies',
      },
      {
        id: 'report-loading-result',
        title: 'Send the comparison results to official support',
        summary: 'Leave unknown details unknown.',
        actions: [
          'Tell Riot support the stopping point, time, Windows and GPU versions, exact error and what changed after each check. Mark untried steps as untried.',
          'Official guidance includes broader changes, but this beginner guide does not prescribe disabling protection, third-party removal tools or firmware changes to everyone. Ask whether further changes fit your case.',
          'Review any logs requested by official support before sharing only what is needed. Never post raw logs, account details or recovery keys in public comments.',
        ],
        time: 'About 3–5 minutes to check; processing varies',
        risk: 'low',
      },
    ],
    avoid: [
      'Do not clear TPM, convert disks or change Secure Boot keys just because loading stalls',
      'Do not disable antivirus or Vanguard, use third-party repair tools or delete AppData indiscriminately',
    ],
    cautions: [
      'These checks are based on official guidance, not a confirmed diagnosis, guaranteed fix or claim of hands-on success.',
    ],
    faqs: [
      {
        question:
          'Does this include audio continuing behind the loading screen?',
        answer:
          'Yes, the general loading guide includes that symptom. Audio alone does not identify a connection, graphics or file problem. Record the stopping point and comparison results.',
      },
      {
        question: 'Does an integrated Intel GPU prove a driver fault?',
        answer:
          'No. The July 2024 guidance discusses older driver signatures, but does not establish the cause on every Intel PC today. Check the model and version before deciding with official support.',
      },
      {
        question: 'Should I use only these steps for VAN9003?',
        answer:
          'No. Switch to the dedicated guide for that Secure Boot requirement. Read the Windows state and prepare model-specific guidance first.',
      },
      {
        question: 'What if there is no Repair button?',
        answer:
          'Record whether the client opens, whether you can sign in and what it displays, then ask support. Deleting settings folders is not a substitute for a missing button.',
      },
      {
        question: 'Will waiting for a patch fix it?',
        answer:
          'Check whether the issue scope matches and whether Riot has posted an update. The 13.08 notes cannot promise a fix for an individual loading stall.',
      },
    ],
    gameSlug: 'valorant',
    slug: 'stuck-loading',
    checkedAt: '2026-10-24',
    sources: [
      {
        label: 'Riot: stuck loading (September 21, 2026)',
        url: 'https://support.riotgames.com/en-us/riot/performance/stuck-on-infinite-loading-screen',
      },
      {
        label: 'Riot: Client Full Repair Tool',
        url: 'https://support.riotgames.com/en-us/riot/connectivity/riot-client-full-repair-tool',
      },
      {
        label:
          'Riot: older loading/login/agent-selection advice (July 8, 2024)',
        url: 'https://support.riotgames.com/en-us/riot/client/stuck-at-loading-screen-can-t-log-in-can-t-select-championagent-lolval',
      },
      {
        label: 'VALORANT: patch 13.08 (October 13, 2026)',
        url: 'https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-13-08/',
      },
    ],
    diagnosis: [
      {
        symptom: 'VAN9003',
        cause: 'Choose the matching branch',
        stepId: 'record-loading-stage',
      },
      {
        symptom: 'Loading does not progress',
        cause: 'Cause unknown; compare and record',
        stepId: 'compare-loading-safely',
      },
    ],
    related: [
      {
        href: '/en/games/valorant/van9003',
        label: 'VAN9003: Secure Boot',
      },
      {
        href: '/en/games/valorant/not-launching-no-van',
        label: 'Will not launch without a VAN code',
      },
    ],
    locale: 'en',
    gameName: 'VALORANT',
  },
];
