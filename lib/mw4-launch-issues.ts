import type { GameArticle } from '@/lib/game-articles';
import type { LocalizedArticle } from '@/lib/localized/types';

// Official issue status checked 2026-10-24; no tested repair claims.
export const mw4LaunchIssues: GameArticle[] = [
  {
    gameSlug: 'call-of-duty-modern-warfare-4',
    slug: 'xbox-pc-launch-button',
    category: 'launch',
    title: 'CoD MW4の起動ボタンがない｜Xbox PC版の確認手順と公式調査状況',
    seoTitle: 'CoD MW4の起動ボタンがない｜Xbox PC版の確認手順と公式調査状況',
    shortTitle: '起動ボタンがない（Xbox PC版）',
    checkedAt: '2026-10-24',
    status: 'verified',
    targetVersion:
      'Xbox PC版のみ。Steam・Battle.net版の同じ症状まで公式確認されたとは扱いません。',
    symptom:
      'Xbox PC版のCOD HomeにMW4を起動するボタンがない人向けです。起動後に落ちる症状や、TPMの要件通知とは分けて確認します。',
    conclusion:
      '10月23日更新の公式一覧では、Xbox PC版の一部で起動ボタンが出ない問題を調査中です。案内されているのはMicrosoft Storeの登録デバイス上限10台と、未導入のMW4 Content Packsの確認です。確認しても直る保証はありません。',
    description:
      '確認日：2026年10月24日。公式の最終更新日は10月23日です。以下は症状の切り分けと報告準備であり、実機での解決実績や修正完了を示すものではありません。',
    steps: [
      {
        id: 'step-1',
        title: '利用しているストアと止まる画面を確認する',
        summary:
          '確認結果を自分用に記録します。解決を保証する操作ではありません。',
        time: '確認約3分（ダウンロード・修正待ちを除く）',
        risk: 'low',
        actions: [
          'Xboxアプリから開いたPC版か、Steam・Battle.net版かを確認する。ゲーム名だけで対象を決めない',
          'COD Homeにボタン自体がないのか、ボタンを押した後にエラーになるのかを書き分ける',
        ],
      },
      {
        id: 'step-2',
        title: '公式の2つの確認項目を照合する',
        summary:
          '確認結果を自分用に記録します。解決を保証する操作ではありません。',
        time: '確認約3分（ダウンロード・修正待ちを除く）',
        risk: 'low',
        actions: [
          '出典の既知問題ページからMicrosoft Storeのデバイス管理を開き、自分のアカウントの登録数と表示を確認する。見覚えのない機器を推測で解除しない',
          'XboxアプリのMW4管理画面で導入済みコンテンツを確認し、未導入のMW4 Content Packsがあれば公式ランチャーで導入する。名称は表示と照合し、特定の番号だけが原因とは決めつけない',
        ],
      },
      {
        id: 'step-3',
        title: '変化を記録し、直らない場合は報告する',
        summary:
          '確認結果を自分用に記録します。解決を保証する操作ではありません。',
        time: '確認約3分（ダウンロード・修正待ちを除く）',
        risk: 'low',
        actions: [
          '確認した登録数・パック名・確認日時と、ボタンが出たかを自分用に控える。アカウント情報は公開しない',
          '変わらない場合は同じ導入操作を繰り返さず、公式既知問題の更新を確認する。報告する場合は起動前の画面で止まることを伝える',
        ],
      },
    ],
    symptoms: [
      {
        label: '利用しているストアと止まる画面を確認する',
        target: 'step-1',
      },
      {
        label: '公式の2つの確認項目を照合する',
        target: 'step-2',
      },
      {
        label: '変化を記録し、直らない場合は報告する',
        target: 'step-3',
      },
    ],
    quickFacts: [
      {
        label: '対象',
        value:
          'Xbox PC版のみ。Steam・Battle.net版の同じ症状まで公式確認されたとは扱いません。',
      },
      {
        label: '公式更新／記事確認',
        value: '2026-10-23／2026-10-24',
      },
    ],
    cautions: [
      '修正時期や個別環境での改善は保証できません。公式の更新に合わせて再確認してください。',
      'TPM 2.0・セキュアブートはPCの別要件です。この症状を直す目的でBIOSを変更しないでください。',
    ],
    avoid: [
      '根拠なくセーブ・設定を削除しない。',
      'この問題の解決策として再購入や再インストールを繰り返さない。',
    ],
    faqs: [
      {
        question: 'TPMを変更すればボタンが出ますか？',
        answer:
          'この表示症状だけを理由にBIOSを変更しないでください。PCのTPM 2.0・セキュアブート要件は別の確認です。要件通知が出る場合は関連記事へ進みます。',
      },
    ],
    sources: [
      {
        url: 'https://support.activision.com/uk/en/modern-warfare-4/articles/known-issues-in-modern-warfare-4',
        label: 'Activision：既知の問題（2026年10月23日更新・英語）',
      },
      {
        url: 'https://support.activision.com/modern-warfare-4/articles/modern-warfare-4-editions',
        label: 'Activision：エディションとPC要件（英語）',
      },
      {
        url: 'https://support.activision.com/feedback-and-bug-report?g=Call+of+Duty%3A+Modern+Warfare+4&r=bug',
        label: 'Activision：不具合報告フォーム（英語）',
      },
    ],
    related: ['loadout-not-saving', 'stats-not-showing', 'tpm-secure-boot'],
    metaDescription:
      'Xbox PC版のCOD HomeにMW4を起動するボタンがない人向けです。起動後に落ちる症状や、TPMの要件通知とは分けて確認します。公式の対象範囲、確認手順、調査中の限界を整理。',
    ogTitle: '起動ボタンがない（Xbox PC版）',
    ogSteps: [
      '利用しているストアと止まる画面を確認する',
      '公式の2つの確認項目を照合する',
      '変化を記録し、直らない場合は報告する',
    ],
  },
  {
    gameSlug: 'call-of-duty-modern-warfare-4',
    slug: 'loadout-not-saving',
    category: 'settings',
    title: 'CoD MW4でロードアウトを保存できない｜公式の調査状況と確認事項',
    seoTitle: 'CoD MW4でロードアウトを保存できない｜公式の調査状況と確認事項',
    shortTitle: 'ロードアウトを保存できない',
    checkedAt: '2026-10-24',
    status: 'verified',
    targetVersion:
      '全プラットフォームのマルチプレイ。この記事のPCでの確認はSteam・Battle.net・Xbox PC版を区別して記録します。',
    symptom:
      'マルチプレイで作ったロードアウトが保存できない場合の確認です。装備の解除条件や、別モードの設定とは切り分けます。',
    conclusion:
      '10月23日更新の公式一覧は、マルチプレイのロードアウト保存不可を全プラットフォームの調査中項目として掲載しています。この項目に個別の回避策はありません。保存できたつもりで設定を作り直し続けず、残る内容を確認してください。',
    description:
      '確認日：2026年10月24日。公式の最終更新日は10月23日です。以下は症状の切り分けと報告準備であり、実機での解決実績や修正完了を示すものではありません。',
    steps: [
      {
        id: 'step-1',
        title: '保存操作の前後を一度だけ比べる',
        summary:
          '確認結果を自分用に記録します。解決を保証する操作ではありません。',
        time: '確認約3分（ダウンロード・修正待ちを除く）',
        risk: 'low',
        actions: [
          'マルチプレイのどのロードアウトで起きたか、変更前の内容を自分用に控える',
          '通常の保存操作を一度行い、同じロードアウトを開き直して、残った変更と戻った変更を比べる。新たな課金や大量の再設定は不要',
        ],
      },
      {
        id: 'step-2',
        title: '保存不可と別の問題を分ける',
        summary:
          '確認結果を自分用に記録します。解決を保証する操作ではありません。',
        time: '確認約3分（ダウンロード・修正待ちを除く）',
        risk: 'low',
        actions: [
          'エラー文、項目が選べない状態、変更後に元に戻る状態を分けて記録する',
          '解除条件や別モードの画面なら、保存不具合と同一だと決めつけない。ここでは解除条件を回避する操作を案内しない',
        ],
      },
      {
        id: 'step-3',
        title: '公式の更新確認と報告に切り替える',
        summary:
          '確認結果を自分用に記録します。解決を保証する操作ではありません。',
        time: '確認約3分（ダウンロード・修正待ちを除く）',
        risk: 'low',
        actions: [
          'ストア・機種、モード、保存前後の違い、発生時刻をまとめる。個人情報を含む画像は共有前に隠す',
          '公式バグ報告フォームでMW4を選び、保存した操作と結果を分けて伝える。返信・解決時期はこの記事では保証しない',
        ],
      },
    ],
    symptoms: [
      {
        label: '保存操作の前後を一度だけ比べる',
        target: 'step-1',
      },
      {
        label: '保存不可と別の問題を分ける',
        target: 'step-2',
      },
      {
        label: '公式の更新確認と報告に切り替える',
        target: 'step-3',
      },
    ],
    quickFacts: [
      {
        label: '対象',
        value:
          '全プラットフォームのマルチプレイ。この記事のPCでの確認はSteam・Battle.net・Xbox PC版を区別して記録します。',
      },
      {
        label: '公式更新／記事確認',
        value: '2026-10-23／2026-10-24',
      },
    ],
    cautions: [
      '修正時期や個別環境での改善は保証できません。公式の更新に合わせて再確認してください。',
      'TPM 2.0・セキュアブートはPCの別要件です。この症状を直す目的でBIOSを変更しないでください。',
    ],
    avoid: [
      '根拠なくセーブ・設定を削除しない。',
      'この問題の解決策として再購入や再インストールを繰り返さない。',
    ],
    faqs: [
      {
        question: 'セーブを消せば直りますか？',
        answer:
          'この項目の公式回避策としてセーブ削除は示されていません。保存不可への対処としてデータを削除したり、ゲームを再購入したりしないでください。',
      },
    ],
    sources: [
      {
        url: 'https://support.activision.com/uk/en/modern-warfare-4/articles/known-issues-in-modern-warfare-4',
        label: 'Activision：既知の問題（2026年10月23日更新・英語）',
      },
      {
        url: 'https://support.activision.com/modern-warfare-4/articles/modern-warfare-4-editions',
        label: 'Activision：エディションとPC要件（英語）',
      },
      {
        url: 'https://support.activision.com/feedback-and-bug-report?g=Call+of+Duty%3A+Modern+Warfare+4&r=bug',
        label: 'Activision：不具合報告フォーム（英語）',
      },
    ],
    related: ['xbox-pc-launch-button', 'stats-not-showing', 'tpm-secure-boot'],
    metaDescription:
      'マルチプレイで作ったロードアウトが保存できない場合の確認です。装備の解除条件や、別モードの設定とは切り分けます。公式の対象範囲、確認手順、調査中の限界を整理。',
    ogTitle: 'ロードアウトを保存できない',
    ogSteps: [
      '保存操作の前後を一度だけ比べる',
      '保存不可と別の問題を分ける',
      '公式の更新確認と報告に切り替える',
    ],
  },
  {
    gameSlug: 'call-of-duty-modern-warfare-4',
    slug: 'stats-not-showing',
    category: 'settings',
    title: 'CoD MW4の戦績が表示されない｜Combat Record・ランキングの表示問題',
    seoTitle:
      'CoD MW4の戦績が表示されない｜Combat Record・ランキングの表示問題',
    shortTitle: '戦績が表示されない',
    checkedAt: '2026-10-24',
    status: 'verified',
    targetVersion:
      '全プラットフォームのCombat Record・リーダーボード表示。別の進行状況・購入品の消失まで説明する項目ではありません。',
    symptom:
      'Combat Recordやリーダーボードに戦績が見えない人向けです。表示が空という観測だけから、戦績の消失やリセットを断定しません。',
    conclusion:
      '公式は全プラットフォームでの戦績表示問題を調査中とし、戦績の追跡自体は続いていると説明しています（10月23日更新）。表示の復旧日時は同項目にありません。欠けた画面を記録し、修正状況を確認します。',
    description:
      '確認日：2026年10月24日。公式の最終更新日は10月23日です。以下は症状の切り分けと報告準備であり、実機での解決実績や修正完了を示すものではありません。',
    steps: [
      {
        id: 'step-1',
        title: '見えない場所を具体的に記録する',
        summary:
          '確認結果を自分用に記録します。解決を保証する操作ではありません。',
        time: '確認約3分（ダウンロード・修正待ちを除く）',
        risk: 'low',
        actions: [
          'Combat Recordとリーダーボードのどちらか、両方かを確認する',
          '空欄・読み込み中・以前の数値のままなど、画面に実際に出ている状態と確認日時を控える。数字を推測で補わない',
        ],
      },
      {
        id: 'step-2',
        title: '表示の問題とアカウントの違いを区別する',
        summary:
          '確認結果を自分用に記録します。解決を保証する操作ではありません。',
        time: '確認約3分（ダウンロード・修正待ちを除く）',
        risk: 'low',
        actions: [
          'いつも利用するストア・アカウントで見ているかを確認し、アカウントの解除・再連携は行わない',
          '現在の画面だけでは追跡データの中身まで検証できないため、「見えない」と「消えた」を書き分ける',
        ],
      },
      {
        id: 'step-3',
        title: '更新を待つ間の記録と報告をまとめる',
        summary:
          '確認結果を自分用に記録します。解決を保証する操作ではありません。',
        time: '確認約3分（ダウンロード・修正待ちを除く）',
        risk: 'low',
        actions: [
          '同じ画面を後で確認できるよう、機種・モード・画面名を控える。統計を作り直す目的でプレイを強制する必要はない',
          '公式既知問題で対象項目の更新を確認し、報告が必要なら表示箇所と時刻を伝える。復旧を確認していない段階で「修正済み」としない',
        ],
      },
    ],
    symptoms: [
      {
        label: '見えない場所を具体的に記録する',
        target: 'step-1',
      },
      {
        label: '表示の問題とアカウントの違いを区別する',
        target: 'step-2',
      },
      {
        label: '更新を待つ間の記録と報告をまとめる',
        target: 'step-3',
      },
    ],
    quickFacts: [
      {
        label: '対象',
        value:
          '全プラットフォームのCombat Record・リーダーボード表示。別の進行状況・購入品の消失まで説明する項目ではありません。',
      },
      {
        label: '公式更新／記事確認',
        value: '2026-10-23／2026-10-24',
      },
    ],
    cautions: [
      '修正時期や個別環境での改善は保証できません。公式の更新に合わせて再確認してください。',
      'TPM 2.0・セキュアブートはPCの別要件です。この症状を直す目的でBIOSを変更しないでください。',
    ],
    avoid: [
      '根拠なくセーブ・設定を削除しない。',
      'この問題の解決策として再購入や再インストールを繰り返さない。',
    ],
    faqs: [
      {
        question: '戦績を取り戻すために設定を初期化しますか？',
        answer:
          '表示されないことだけを理由に初期化しないでください。設定削除や再インストールをこの表示問題の修正方法として裏付ける案内は、確認した項目にありません。',
      },
    ],
    sources: [
      {
        url: 'https://support.activision.com/uk/en/modern-warfare-4/articles/known-issues-in-modern-warfare-4',
        label: 'Activision：既知の問題（2026年10月23日更新・英語）',
      },
      {
        url: 'https://support.activision.com/modern-warfare-4/articles/modern-warfare-4-editions',
        label: 'Activision：エディションとPC要件（英語）',
      },
      {
        url: 'https://support.activision.com/feedback-and-bug-report?g=Call+of+Duty%3A+Modern+Warfare+4&r=bug',
        label: 'Activision：不具合報告フォーム（英語）',
      },
    ],
    related: ['xbox-pc-launch-button', 'loadout-not-saving', 'tpm-secure-boot'],
    metaDescription:
      'Combat Recordやリーダーボードに戦績が見えない人向けです。表示が空という観測だけから、戦績の消失やリセットを断定しません。公式の対象範囲、確認手順、調査中の限界を整理。',
    ogTitle: '戦績が表示されない',
    ogSteps: [
      '見えない場所を具体的に記録する',
      '表示の問題とアカウントの違いを区別する',
      '更新を待つ間の記録と報告をまとめる',
    ],
  },
];
export const mw4LaunchIssuesEn: LocalizedArticle[] = [
  {
    locale: 'en',
    gameSlug: 'call-of-duty-modern-warfare-4',
    gameName: 'Call of Duty: Modern Warfare 4',
    slug: 'xbox-pc-launch-button',
    title:
      'MW4 has no launch button on Xbox PC: checks and investigation status',
    description:
      'For MW4 missing from the launch controls in COD Home on Xbox PC. A crash after launching or a security-requirement prompt needs a different check.',
    shortTitle: 'No launch button on Xbox PC',
    lead: 'For MW4 missing from the launch controls in COD Home on Xbox PC. A crash after launching or a security-requirement prompt needs a different check.',
    summary:
      'Activision is investigating missing launch controls on Xbox PC. Its tips cover the Store’s ten-device limit and missing MW4 content packs; neither guarantees a fix.',
    checkedAt: '2026-10-24',
    quickFacts: [
      {
        label: 'Scope',
        value:
          'Xbox PC only for this issue entry; do not extend its confirmed scope to Steam or Battle.net.',
      },
      {
        label: 'Official update / article check',
        value: '2026-10-23 / 2026-10-24',
      },
    ],
    diagnosis: [],
    steps: [
      {
        id: 'step-1',
        title: 'Identify the store and screen',
        summary:
          'Keep a private record of the result. This is a check, not a guaranteed repair.',
        time: 'About 3 minutes to check; downloads and fix availability vary',
        risk: 'low',
        actions: [
          'Identify whether you opened the PC game through Xbox, Steam or Battle.net. Do not classify it from the game title alone.',
          'Distinguish an absent control in COD Home from an error after pressing a visible control.',
        ],
      },
      {
        id: 'step-2',
        title: 'Check the two official tips',
        summary:
          'Keep a private record of the result. This is a check, not a guaranteed repair.',
        time: 'About 3 minutes to check; downloads and fix availability vary',
        risk: 'low',
        actions: [
          'Follow the device-management link in the official issue entry and inspect your own account. Do not unlink an unfamiliar device by guesswork.',
          'Inspect MW4’s installed content in the Xbox app. Use the official launcher for missing packs and match the displayed names; do not assume one numbered pack explains every case.',
        ],
      },
      {
        id: 'step-3',
        title: 'Record the result and report a continuing issue',
        summary:
          'Keep a private record of the result. This is a check, not a guaranteed repair.',
        time: 'About 3 minutes to check; downloads and fix availability vary',
        risk: 'low',
        actions: [
          'Keep a private note of the check time, installed pack names and whether the button appeared. Do not publish account information.',
          'If nothing changes, stop repeating installations and check the official issue entry for updates. In a report, specify that you cannot reach the launch action.',
        ],
      },
    ],
    avoid: [
      'Do not delete saves or settings without a relevant official instruction.',
      'Do not repeatedly reinstall or repurchase the game as a presumed remedy.',
    ],
    cautions: [
      'These are observation and reporting steps, not a tested cure. No individual improvement or fix date is guaranteed.',
      'TPM 2.0 and Secure Boot are separate PC requirements. Do not change firmware to treat these symptoms.',
    ],
    faqs: [
      {
        question: 'Will changing TPM settings restore the button?',
        answer:
          'Do not change firmware because this control is missing. TPM 2.0 and Secure Boot are separate PC requirements; use the security guide if you actually receive a requirement warning.',
      },
    ],
    sources: [
      {
        url: 'https://support.activision.com/uk/en/modern-warfare-4/articles/known-issues-in-modern-warfare-4',
        label: 'Activision: known issues, updated October 23, 2026',
      },
      {
        url: 'https://support.activision.com/modern-warfare-4/articles/modern-warfare-4-editions',
        label: 'Activision: editions and PC requirements',
      },
      {
        url: 'https://support.activision.com/feedback-and-bug-report?g=Call+of+Duty%3A+Modern+Warfare+4&r=bug',
        label: 'Activision: bug report form',
      },
    ],
    related: [
      {
        href: '/en/games/call-of-duty-modern-warfare-4/loadout-not-saving',
        label: 'Loadouts will not save',
      },
      {
        href: '/en/games/call-of-duty-modern-warfare-4/stats-not-showing',
        label: 'Stats are not showing',
      },
      {
        href: '/en/games/call-of-duty-modern-warfare-4/tpm-secure-boot',
        label: 'TPM 2.0 and Secure Boot requirements',
      },
    ],
  },
  {
    locale: 'en',
    gameSlug: 'call-of-duty-modern-warfare-4',
    gameName: 'Call of Duty: Modern Warfare 4',
    slug: 'loadout-not-saving',
    title: 'MW4 loadouts not saving: what is known and what to check',
    description:
      'For a Multiplayer loadout that will not retain your changes. Separate this from an item you have not unlocked or a configuration in another mode.',
    shortTitle: 'Loadouts will not save',
    lead: 'For a Multiplayer loadout that will not retain your changes. Separate this from an item you have not unlocked or a configuration in another mode.',
    summary:
      'Multiplayer loadout saving is under investigation across platforms. The issue entry offers no workaround. Check which changes persist before rebuilding your setup repeatedly.',
    checkedAt: '2026-10-24',
    quickFacts: [
      {
        label: 'Scope',
        value:
          'All platforms, Multiplayer. For a PC report, identify Steam, Battle.net or Xbox PC explicitly.',
      },
      {
        label: 'Official update / article check',
        value: '2026-10-23 / 2026-10-24',
      },
    ],
    diagnosis: [],
    steps: [
      {
        id: 'step-1',
        title: 'Compare before and after one save attempt',
        summary:
          'Keep a private record of the result. This is a check, not a guaranteed repair.',
        time: 'About 3 minutes to check; downloads and fix availability vary',
        risk: 'low',
        actions: [
          'Note the Multiplayer loadout and its previous configuration privately.',
          'Use the normal save action once, reopen the same loadout and compare what remained versus what reverted. No purchase or extensive rebuild is needed.',
        ],
      },
      {
        id: 'step-2',
        title: 'Separate saving from other restrictions',
        summary:
          'Keep a private record of the result. This is a check, not a guaranteed repair.',
        time: 'About 3 minutes to check; downloads and fix availability vary',
        risk: 'low',
        actions: [
          'Distinguish an error message, an unavailable selection and a change that reverts after saving.',
          'If you are on an unlock screen or in another mode, do not assume this entry explains it. This guide does not bypass unlock conditions.',
        ],
      },
      {
        id: 'step-3',
        title: 'Check updates and prepare a useful report',
        summary:
          'Keep a private record of the result. This is a check, not a guaranteed repair.',
        time: 'About 3 minutes to check; downloads and fix availability vary',
        risk: 'low',
        actions: [
          'Prepare the platform/store, mode, time and the difference before and after saving. Redact personal details from any image.',
          'Select MW4 in the official bug form and describe the action separately from its result. This guide cannot promise a reply or a fix date.',
        ],
      },
    ],
    avoid: [
      'Do not delete saves or settings without a relevant official instruction.',
      'Do not repeatedly reinstall or repurchase the game as a presumed remedy.',
    ],
    cautions: [
      'These are observation and reporting steps, not a tested cure. No individual improvement or fix date is guaranteed.',
      'TPM 2.0 and Secure Boot are separate PC requirements. Do not change firmware to treat these symptoms.',
    ],
    faqs: [
      {
        question: 'Should I delete saves to fix it?',
        answer:
          'Save deletion is not an official workaround for this entry. Do not erase data or buy the game again as a response to this symptom.',
      },
    ],
    sources: [
      {
        url: 'https://support.activision.com/uk/en/modern-warfare-4/articles/known-issues-in-modern-warfare-4',
        label: 'Activision: known issues, updated October 23, 2026',
      },
      {
        url: 'https://support.activision.com/modern-warfare-4/articles/modern-warfare-4-editions',
        label: 'Activision: editions and PC requirements',
      },
      {
        url: 'https://support.activision.com/feedback-and-bug-report?g=Call+of+Duty%3A+Modern+Warfare+4&r=bug',
        label: 'Activision: bug report form',
      },
    ],
    related: [
      {
        href: '/en/games/call-of-duty-modern-warfare-4/xbox-pc-launch-button',
        label: 'No launch button on Xbox PC',
      },
      {
        href: '/en/games/call-of-duty-modern-warfare-4/stats-not-showing',
        label: 'Stats are not showing',
      },
      {
        href: '/en/games/call-of-duty-modern-warfare-4/tpm-secure-boot',
        label: 'TPM 2.0 and Secure Boot requirements',
      },
    ],
  },
  {
    locale: 'en',
    gameSlug: 'call-of-duty-modern-warfare-4',
    gameName: 'Call of Duty: Modern Warfare 4',
    slug: 'stats-not-showing',
    title:
      'MW4 stats not showing: Combat Record and Leaderboards display issue',
    description:
      'For missing figures in Combat Record or Leaderboards. An empty display alone does not establish that your record was erased or reset.',
    shortTitle: 'Stats are not showing',
    lead: 'For missing figures in Combat Record or Leaderboards. An empty display alone does not establish that your record was erased or reset.',
    summary:
      'Activision describes an all-platform display issue: stat tracking continues. No restoration date is listed. Record which screen is affected and follow status updates.',
    checkedAt: '2026-10-24',
    quickFacts: [
      {
        label: 'Scope',
        value:
          'All platforms, Combat Record and Leaderboards. This entry does not explain unrelated progression or missing purchases.',
      },
      {
        label: 'Official update / article check',
        value: '2026-10-23 / 2026-10-24',
      },
    ],
    diagnosis: [],
    steps: [
      {
        id: 'step-1',
        title: 'Identify the affected view',
        summary:
          'Keep a private record of the result. This is a check, not a guaranteed repair.',
        time: 'About 3 minutes to check; downloads and fix availability vary',
        risk: 'low',
        actions: [
          'Identify whether Combat Record, Leaderboards or both are affected.',
          'Record whether the display is blank, loading or showing an older value, along with the check time. Do not fill gaps with guessed numbers.',
        ],
      },
      {
        id: 'step-2',
        title: 'Separate display observations from account differences',
        summary:
          'Keep a private record of the result. This is a check, not a guaranteed repair.',
        time: 'About 3 minutes to check; downloads and fix availability vary',
        risk: 'low',
        actions: [
          'Check that you are viewing the intended store/account without unlinking or relinking accounts.',
          'The screen cannot independently verify stored tracking data. Describe what is missing rather than declaring the record lost.',
        ],
      },
      {
        id: 'step-3',
        title: 'Keep a concise record while awaiting updates',
        summary:
          'Keep a private record of the result. This is a check, not a guaranteed repair.',
        time: 'About 3 minutes to check; downloads and fix availability vary',
        risk: 'low',
        actions: [
          'Note the platform, mode and view so you can compare the same screen later. You do not need to play extra matches to recreate a record.',
          'Recheck the official entry and report the affected view and time if needed. Do not label the issue fixed before a relevant update or your own display check.',
        ],
      },
    ],
    avoid: [
      'Do not delete saves or settings without a relevant official instruction.',
      'Do not repeatedly reinstall or repurchase the game as a presumed remedy.',
    ],
    cautions: [
      'These are observation and reporting steps, not a tested cure. No individual improvement or fix date is guaranteed.',
      'TPM 2.0 and Secure Boot are separate PC requirements. Do not change firmware to treat these symptoms.',
    ],
    faqs: [
      {
        question: 'Should I reset settings to recover my stats?',
        answer:
          'Do not reset settings just because figures are missing. The checked entry does not support deletion or reinstallation as a remedy for this display problem.',
      },
    ],
    sources: [
      {
        url: 'https://support.activision.com/uk/en/modern-warfare-4/articles/known-issues-in-modern-warfare-4',
        label: 'Activision: known issues, updated October 23, 2026',
      },
      {
        url: 'https://support.activision.com/modern-warfare-4/articles/modern-warfare-4-editions',
        label: 'Activision: editions and PC requirements',
      },
      {
        url: 'https://support.activision.com/feedback-and-bug-report?g=Call+of+Duty%3A+Modern+Warfare+4&r=bug',
        label: 'Activision: bug report form',
      },
    ],
    related: [
      {
        href: '/en/games/call-of-duty-modern-warfare-4/xbox-pc-launch-button',
        label: 'No launch button on Xbox PC',
      },
      {
        href: '/en/games/call-of-duty-modern-warfare-4/loadout-not-saving',
        label: 'Loadouts will not save',
      },
      {
        href: '/en/games/call-of-duty-modern-warfare-4/tpm-secure-boot',
        label: 'TPM 2.0 and Secure Boot requirements',
      },
    ],
  },
];
