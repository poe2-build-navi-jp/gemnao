# 海外版の残対応台帳 — 2026-10-18

基準本番: `054f5ea0345e7f81b7cd96177a0c42944d5317cb`。検索量の順位ではなく、利用者のデータ保護と既存記事から必要な次の行動を優先する。本作業の海外版追加は、品質検証後の順次本番公開までユーザー承認済み（2026-10-18、親スレッド経由）。まとまりごとに対象差分のみcommit・配備し、結果を報告する。

## 実在する登録配列からの棚卸し

`commonGuides`、`discordArticles`、`gameArticles`の157件を、公開ルートで使用する`hasTranslation`と照合。パスの重複なし。全行と各言語の有無は [CSV台帳](localization-backlog-2026-10-18.csv)。この数は記事3系列の集計であり、サイト全体のPC・gear・tools等を含む総数ではない。公開済みの有無と準備中の有無を混同しないためCSVは基準commitのスナップショットとして保持する。

| 登録系列 | 日本語件数 | 英語未対応 | 中国語未対応 | スペイン語未対応 |
|---|---:|---:|---:|---:|
| 共通ガイド | 28 | 21 | 28 | 28 |
| Discord | 38 | 37 | 37 | 37 |
| ゲーム記事 | 91 | 46 | 55 | 55 |

導線の基準状態: 英語共通一覧あり（7本）、英語Discord一覧なし、中国語・スペイン語の共通一覧なし。英語セーブ保存先gear記事からAの2記事へは日本語リンクのみ。翻訳済みDiscord記事1件は一覧・新3記事の設計時に再利用し、重複実装しない。

## 順次バッチ

| 順位 | 独立したまとまり | 今回の状態・次の作業 |
|---|---|---|
| A | en/save-data-backup、en/steam-cloud-sync-error | 公開済み `e53de3145ee8cb953b8465d796405481c13d6ab4`。Pages `5422d0f2-af8d-4fe7-96a2-0bef969dd13e` 成功・SHA一致。共通一覧9本。 |
| B | en/Discord一覧、mic-not-working、stream-no-audio、screen-share-black-screen | 公開済み `a520710979c830c5c11a89d74e4eba17a06a952a`。Pages `d9f19feb-7f5a-4480-9197-50abd4380715` 成功・SHA一致。英語一覧4本。 |
| C1 | Palworld save-data・dedicated-server-backup、Wilds save-data、Elden Ring save-data | 専用サーバーバックアップ英語版は公開済み `17726c36603e585e7f05781becc1a808f2f31495`、Pages `8704c1d5-5cc1-4541-9f36-602953683f7a` 成功・SHA一致。ほか3件は出典再確認が未完了（Q&A・更新告知の取得制限／保存先の一次資料不足）。詳細は english-palworld-backup-review-2026-10-18.md。 |
| C2 | Palworld not-launching、Elden Ring not-launching、Wilds fps等 | 既存英語記事・日本語利用実績・不足導線を確認して選定。未提供のアクセス数字は推測しない。 |
| D | zh/es主要共通ガイド、各言語一覧・検索 | D初回は公開済み `3b1c21e30189b46e574f62a1adb47f0f5ce875d0`、Pages `4e1f98c9-a193-4f9b-a89b-8843266ff9b4` 成功・SHA一致。Cloudは公開済み `d5d19a7c914f39614205169328625ea103089986`、Pages `c8cff2e7-bbfe-4d21-91f9-71cca021be0e` 成功・SHA一致。起動・クラッシュ中西4記事を追加・検証（一覧各4本）。次は検証可能なファイル確認・FPS等を独立バッチ化。記事がない一覧カードや架空hreflangを公開しない。 |

C候補の実在未対応パス:

- Palworld: save-data、dedicated-server-settings、dedicated-server-backup、dedicated-server-port、not-launching、system-requirements。
- Wilds: save-data、fps、controller、mod、config-file、system-requirements、hdr、ultrawide。
- Elden Ring: save-data、not-launching、fps、ultrawide、hdr、mod。

## Bを止めずに進めるための作業境界

日本語の有効な記事は`discordArticleBySlug`の戻り値を使う。似たslugを含む補助ファイルが複数あるためファイル名だけから本文を選ばない。翻訳登録は既存`localizedDiscordArticles`と既存Discordルートに接続する。英語一覧は新規、実在する英語記事だけを列挙する。ヘッダーのDiscordリンクは英語版のみ切り替える。

まず3記事の公式Discord資料とWindowsマイク許可・入力デバイスの現行案内を確認。マイク入力、共有アプリの音、共有映像の黒画面を別の分岐として扱う。機密ウィンドウ共有、管理者起動、セキュリティ停止を一律の標準対処にしない。本文、SEO、検索、一覧、OG、表示検証をB内で完結させ、Aとは別commitにする。Aの新URLをBの必須依存にしない。

各バッチで変更対象だけcommitし、検証・配備結果は独立管理。既存collector関連の未公開3ファイルを含めない。本番の合成投票、GAイベント、課金・権限・セキュリティ変更は行わない。

Bの先行調査（本文実装は次バッチ）: `discordArticleBySlug`でマイク5原因、配信音声4原因、黒画面5原因を確認。既存翻訳モデルは`cause-1`形式。公式DiscordのVoice & Video、Go Live、Windows capture資料は取得できた。現行案内のVoiceタブ／Debuggingタブと旧画面表記を区別し、2022年のcapture記事を現在の全構成で保証された挙動とは扱わない。

ゲーム別で保留している正確な資料URLと条件は [資料再確認待ち](localization-source-blockers-2026-10-18.md) を参照。
