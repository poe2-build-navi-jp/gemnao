import type { GameArticle } from '@/lib/game-articles';
import type { LocalizedArticle } from '@/lib/localized/types';
export const enshroudedArticles: GameArticle[] = [
  {
    title: 'Enshroudedの黒画面・マルチに入れない・セーブ移行｜1.0.0.3の確認',
    shortTitle: '黒画面・マルチ・セーブ移行',
    description:
      'Enshrouded正式版移行の黒画面とセーブ移行問題を整理。10/21のHotfix 1.0.0.3（1273043）更新確認、修正対象と移行時の制限、安全な記録手順。',
    gameSlug: 'enshrouded',
    slug: 'black-screen-save-migration',
    checkedAt: '2026-10-24',
    steps: [
      {
        id: 'check-update',
        title: '版とダウンロード完了を確認',
        summary: '公式の版番号と、自分の導入状況を分けます。',
        actions: [
          'Steamで更新待ちやダウンロード中の表示を確認し、進行中なら完了を待つ。ゲーム内などで確認できる版表示を記録し、不明な場合は導入済みと決めない。',
          '1.0.0.3の告知日は2026/10/21、公式Versionは1273043です。後続版を使っている場合は、その正式な更新履歴も照合する。最新版へ更新したことと個別症状が直ったことは別。',
        ],
        time: '確認約3〜5分（更新を除く）',
        risk: 'low',
      },
      {
        id: 'classify-loading',
        title: '黒画面と別の通信エラーを分ける',
        summary: '修正対象はマルチプレイを読み込もうとする時の無限黒画面です。',
        actions: [
          'どの画面から、誰のワールドへ入ろうとして止まるか、表示が黒いだけかエラー文があるか、待った時間を控える。パスワードやサーバーの私的情報は公開しない。',
          '認証・招待・接続エラーなど別の表示を、今回の黒画面修正で必ず解決する問題として扱わない。ルーターや保護機能を根拠なく変更しない。',
        ],
        time: '確認約3〜5分（更新を除く）',
        risk: 'low',
      },
      {
        id: 'review-migration',
        title: 'セーブ移行の対象と制限を確認',
        summary:
          '公式Launch FAQではEarly Accessのセーブを1.0の新形式へ変換して使えると説明しています。',
        actions: [
          '移行前の保存を保護する。保存先を確認できる場合だけ、ゲームを終了して別の日時付きフォルダーへコピーし、元データを残す。保存先が不明なら推測でファイルを移動せず公式サポートへ確認する。',
          '追加バックパック枠に不正な項目があるケースは移行を改善。ただし処理を止めていた問題アイテムは引き継がれないと告知されています。',
          'Flame Altarがボクセル格子外にあるケースは位置を補正。ただし該当する拠点の水は読み込めず、必要に応じて再追加すると案内されています。全ワールドの水や全アイテムが消えるという意味ではありません。',
        ],
        time: '確認約3〜5分（更新を除く）',
        risk: 'low',
      },
      {
        id: 'record-result',
        title: '更新後も続く場合は状況を報告',
        summary: '修正告知は個別環境での成功保証ではありません。',
        actions: [
          '版、OS、ソロかマルチか、ホストか参加側か、黒画面・エラー・移行中クラッシュのどれかを記録する。未確認の項目はそのまま残す。',
          '現在のセーブを削除・上書きしたり同期を初期化せず、公式サポートへ必要な範囲の情報を伝える。唯一のセーブで移行を繰り返し試さない。',
        ],
        time: '確認約3〜5分（更新を除く）',
        risk: 'low',
      },
    ],
    faqs: [
      {
        question: '1.0.0.3の修正はまだ予定ですか？',
        answer:
          '10/21の正式なHotfix変更履歴で修正として案内されています。今回の確認で実機の改善まで検証したわけではありません。',
      },
      {
        question: '更新すればマルチ接続はすべて直りますか？',
        answer:
          'いいえ。今回の黒画面修正は読み込み時の特定症状です。ほかの通信・認証エラーまで同じ原因と断定しません。',
      },
      {
        question: '旧セーブを消して作り直す必要がありますか？',
        answer:
          'その手順は案内しません。公式FAQは旧セーブの変換利用を説明しています。既存保存を保護し、特定ケースの制限と、別原因の欠損を分けて相談します。',
      },
      {
        question: 'バックアップを取れば必ず復元できますか？',
        answer:
          'コピーが一致してもゲームで読み込める保証とは別です。保存先を確認し、元の保存と以前のバックアップを上書きせず残してください。',
      },
    ],
    quickFacts: [
      {
        label: '対象／修正',
        value: 'Windows PC・Steam／1.0.0.3・1273043（10/21）',
      },
    ],
    diagnosis: [
      {
        symptom: 'マルチ読み込みが黒画面',
        cause: '更新後に症状を照合',
        stepId: 'classify-loading',
      },
      {
        symptom: 'セーブ移行で停止',
        cause: '移行条件と制限を確認',
        stepId: 'review-migration',
      },
    ],
    avoid: [
      'セーブ削除・同期初期化・保護無効化を一般解決法にしない',
      '未確認の保存先や万能の復元手順を使わない',
    ],
    cautions: [
      '実機での再現・修正効果は未確認です。後続更新は公式ニュースで確認してください。',
    ],
    sources: [
      {
        url: 'https://enshrouded.com/en-US/news/changelog-for-hotfix-1003',
        label: '公式：1.0.0.3変更履歴（英語）',
      },
      {
        url: 'https://enshrouded.com/en-US/news/enshrouded-launch-faq-early-access-reward-world',
        label: '公式：正式版移行FAQ（英語）',
      },
      {
        url: 'https://enshrouded.com/en-US/news',
        label: '公式ニュース（英語）',
      },
      {
        url: 'https://store.steampowered.com/app/1203620/Enshrouded/',
        label: 'Steam：Windows PC要件',
      },
    ],
    category: 'save',
    status: 'verified',
    symptom:
      'Windows PC・Steam版でマルチプレイ読み込みが黒画面のまま、または旧セーブの変換中に止まる人向けです。一般的な接続エラーや全データ消失と同じ原因だとは判断しません。',
    conclusion:
      'まずHotfix 1.0.0.3（公式Version 1273043）以降への更新状態を確認してください。10/21告知は一部プレイヤーのマルチ読み込み時の無限黒画面と、セーブ移行中のまれなクラッシュを修正しています。移行の対象条件と制限を確認してから進め、更新済みでも続く症状は別途記録します。',
    seoTitle: 'Enshroudedの黒画面・マルチに入れない・セーブ移行｜1.0.0.3の確認',
    metaDescription:
      'Enshrouded正式版移行の黒画面とセーブ移行問題を整理。10/21のHotfix 1.0.0.3（1273043）更新確認、修正対象と移行時の制限、安全な記録手順。',
    symptoms: [
      {
        label: '版とダウンロード完了を確認',
        target: 'check-update',
      },
      {
        label: '黒画面と別の通信エラーを分ける',
        target: 'classify-loading',
      },
      {
        label: 'セーブ移行の対象と制限を確認',
        target: 'review-migration',
      },
      {
        label: '更新後も続く場合は状況を報告',
        target: 'record-result',
      },
    ],
    related: [],
    nextChecks: {
      heading: '関連する確認',
      links: [
        {
          href: '/guide/save-data-backup',
          label: 'セーブのバックアップ：保存先確認とコピー',
        },
        {
          href: '/guide/pc-game-crash',
          label: '別場面のクラッシュ確認',
        },
      ],
    },
  },
];
export const enshroudedArticlesEn: LocalizedArticle[] = [
  {
    title:
      'Enshrouded black screen, multiplayer loading and save migration: check 1.0.0.3',
    shortTitle: 'Black screen and save migration',
    description:
      'Check Enshrouded Hotfix 1.0.0.3 (1273043) before troubleshooting multiplayer black screens or save migration. Understand the October 21 fixes, limits and safe next steps.',
    lead: 'For Windows PC/Steam players stuck at multiplayer loading or during conversion of an older save. These symptoms do not establish a general connection failure or loss of all saved data.',
    summary:
      'First check update status for Hotfix 1.0.0.3 (official Version 1273043) or later. The October 21 notice fixes an endless multiplayer-loading black screen for some players and a rare crash during save migration. Check the migration conditions and limits before proceeding; record symptoms that remain after updating separately.',
    gameSlug: 'enshrouded',
    slug: 'black-screen-save-migration',
    checkedAt: '2026-10-24',
    steps: [
      {
        id: 'check-update',
        title: 'Confirm the version and download completion',
        summary: 'Separate the published version from what is installed.',
        actions: [
          'Check Steam for a pending or active update and let the download finish. Record any available game-version display; if it is unclear, do not assume the fix is installed.',
          'The notice is dated October 21, 2026 and gives Version 1273043 for 1.0.0.3. If you use a later build, compare its official release notes too. Updating does not by itself prove your symptom is resolved.',
        ],
        time: 'About 3–5 minutes to check; update time varies',
        risk: 'low',
      },
      {
        id: 'classify-loading',
        title: 'Separate loading black screens from connection errors',
        summary:
          'The named fix concerns an endless black screen when loading multiplayer.',
        actions: [
          'Record the starting screen, whose world you are joining, whether the screen stays black or shows an error, and the wait duration. Keep passwords and private server details out of public reports.',
          'Do not treat authentication, invitation or other connection messages as guaranteed to be fixed by this black-screen change. Avoid unsupported router or security changes.',
        ],
        time: 'About 3–5 minutes to check; update time varies',
        risk: 'low',
      },
      {
        id: 'review-migration',
        title: 'Check migration conditions and limitations',
        summary:
          'The launch FAQ says Early Access saves can be converted to the new 1.0 format.',
        actions: [
          'Protect the pre-migration save. Only after confirming its location, close the game and copy it to a separate dated folder while retaining the original. If the location is unknown, ask official support rather than guessing or moving files.',
          'Migration was improved for invalid additional-backpack entries, but the items blocking conversion are not carried over.',
          'For a Flame Altar outside the voxel grid, migration corrects its position; the affected base’s water cannot load and needs re-adding as necessary. This is not a statement that all worlds lose water or all items disappear.',
        ],
        time: 'About 3–5 minutes to check; update time varies',
        risk: 'low',
      },
      {
        id: 'record-result',
        title: 'Report symptoms that persist after updating',
        summary: 'A published fix is not a guarantee for every system.',
        actions: [
          'Record version, OS, solo or multiplayer, host or joining role, and whether this is a black screen, error or migration crash. Leave unknown details unknown.',
          'Keep existing saves intact; do not delete, overwrite or reset synchronization. Give official support only the needed details and avoid repeated migration tests using your only save.',
        ],
        time: 'About 3–5 minutes to check; update time varies',
        risk: 'low',
      },
    ],
    faqs: [
      {
        question: 'Are the 1.0.0.3 fixes still only planned?',
        answer:
          'They are listed as fixes in the October 21 hotfix changelog. This guide does not claim hands-on confirmation of improvement.',
      },
      {
        question: 'Will updating fix every multiplayer connection?',
        answer:
          'No. The loading black screen is a specific symptom; other network or authentication failures are not established as the same cause.',
      },
      {
        question: 'Must I delete an old save and start over?',
        answer:
          'This guide does not prescribe that. The launch FAQ describes conversion of old saves. Preserve them and distinguish the documented limitations from unrelated missing data.',
      },
      {
        question: 'Does a backup guarantee recovery?',
        answer:
          'No. Matching copied files is different from successful in-game loading. Confirm the source and retain both the original and earlier backups without overwriting them.',
      },
    ],
    quickFacts: [
      {
        label: 'Scope / fix',
        value: 'Windows PC / Steam; 1.0.0.3, Version 1273043 (October 21)',
      },
    ],
    diagnosis: [
      {
        symptom: 'Multiplayer loading stays black',
        cause: 'Compare the symptom after updating',
        stepId: 'classify-loading',
      },
      {
        symptom: 'Save conversion stops',
        cause: 'Review conditions and limits',
        stepId: 'review-migration',
      },
    ],
    avoid: [
      'Do not delete saves, reset sync or disable protection as a generic fix',
      'Do not use unverified save paths or universal recovery instructions',
    ],
    cautions: [
      'No hands-on reproduction or fix effectiveness is claimed. Check official news for later updates.',
    ],
    sources: [
      {
        url: 'https://enshrouded.com/en-US/news/changelog-for-hotfix-1003',
        label: 'Official: Hotfix 1.0.0.3 changelog',
      },
      {
        url: 'https://enshrouded.com/en-US/news/enshrouded-launch-faq-early-access-reward-world',
        label: 'Official: launch and save-conversion FAQ',
      },
      {
        url: 'https://enshrouded.com/en-US/news',
        label: 'Official news',
      },
      {
        url: 'https://store.steampowered.com/app/1203620/Enshrouded/',
        label: 'Steam: Windows PC requirements',
      },
    ],
    locale: 'en',
    gameName: 'Enshrouded',
    related: [
      {
        href: '/en/guide/save-data-backup',
        label: 'Save backup: identify and copy',
      },
      {
        href: '/en/guide/pc-game-crash',
        label: 'Crashes in other scenes',
      },
    ],
  },
];
