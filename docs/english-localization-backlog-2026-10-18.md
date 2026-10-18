# 英語版の全体棚卸し — 2026-10-18

基準commit: `659e2e633c6bd4bee4b3c72e99d5aaca364a3173`。本番Pages成功: `32a79a20-9cf9-45dc-b9c7-3246d9d297c6`。sitemapとhasTranslationの実登録を照合。日本語231 URL、英語86 URL、未対応145 URL、登録との不一致0。公開ブラウザの全ページ再検証を意味しない。

[全URLの基準CSV](english-localization-backlog-2026-10-18.csv) はこのcommitのスナップショットとして保持し、バッチ差分を下に記録する。

| 系列 | 日本語 | 英語 | 未対応 |
|---|---:|---:|---:|
| public-page | 8 | 1 | 7 |
| index | 6 | 3 | 3 |
| discord-article | 38 | 4 | 34 |
| examples | 1 | 1 | 0 |
| game-hub | 22 | 18 | 4 |
| game-article | 91 | 46 | 45 |
| gear-article | 3 | 2 | 1 |
| guide-article | 28 | 9 | 19 |
| new-releases | 2 | 0 | 2 |
| pc-article | 20 | 1 | 19 |
| tool | 3 | 1 | 2 |
| trouble | 7 | 0 | 7 |
| weekly | 2 | 0 | 2 |

## 今回の差分

共通ガイド `no-game-audio`、`steam-input-controller`、`controller-double-input` の英語版3件を追加。英語共通一覧は12件、サイト全体では89/231、未対応142となる。配備前は実装件数、配備成功確認後に公開件数として扱う。既存 `/en/pc/repair-or-replace` の英語ホーム検索・カードへの掲載漏れも修正（記事数増加には数えない）。

## sitemap外の操作画面

以下は145件と別枠。noindexを翻訳済みとは扱わない。実在ルートを調査し、管理画面は対象外とした。

| 日本語ルート | 英語対応 | 確認事項 |
|---|---|---|
| /my-games | あり | localeルートあり。UI再確認は別工程 |
| /reports | あり | localeルートあり。実投稿・運用変更は本作業外 |
| /my | なし | localStorageのPC情報画面、noindex |
| /diagnose | なし | 日本語の診断UI、既存公開フラグを維持 |
| /diagnose/privacy | なし | 診断説明、noindex |
| /diagnostic-feedback | なし | 診断フィードバック、noindex |
| /discord-servers/submit | なし | 投稿フォーム、noindex |
| /diagnosis/[id]、/diagnosis/manage/[id] | なし | 共有結果・管理操作。本文と権限動作を分けて検証が必要 |

英語版を完了とするには、記事だけでなく上記UI・索引・検索の不足も扱う。英語の公開URLがあることのみで内容校正完了とはみなさない。

## 保留条件

出典の未確認により保留するゲーム別復元・MOD条件は [資料再確認待ち](localization-source-blockers-2026-10-18.md) の正確なURLと条件に従う。他の独立した英語記事は継続する。言語順は英語版、スペイン語版、中国語版。

英語版追加後の全体QAは [QA台帳](english-full-qa-2026-10-18.md) に記録。全体監査・修正・再テスト・公開と保留報告を終えるまでスペイン語版に進まない。

## 公開・実装の更新

- 音声・コントローラー3件は `8294a413869ccd14b04e7bad59e0bc808ac9c3f3`、Pages `2fbd9792-7eab-4278-a91f-f2de2d691be0` 成功。89/231 URL、未対応142。
- DirectX・Visual C++の2件を追加実装。共通一覧14件、91/231 URL、未対応140。配備確認前は実装件数として扱う。
- DirectX・Visual C++は `be89783446fb6fdf92842fea295434944f1458dd` / Pages `18663c7f-3c59-4b99-8600-306fac4f9205` 成功。
- VRAM不足・低GPU使用率を2件追加実装。共通一覧16件（共通残12件）、93/231 URL、未対応138。配備確認前は実装件数として扱う。
- VRAM・低GPU使用率は `a298d8735eab65f8257154401502e75ea2b2d454` / Pages `079c0cae-4ebd-4a3e-be25-ec51ba9072ae` 成功。
- フリーズ記事を追加実装。共通一覧17件（共通残11件）、94/231 URL、未対応137。配備確認前は実装件数。Steamディスク書き込みエラーは中核の公式資料取得不可で保留（資料台帳参照）。

- 2026-10-18 maintenance batch: remove-mods-safely / uninstall-save-data / shader-cache-delete / steam-disk-write-error の英語版4件を追加。英語98/231、未対応133、共通21/28（残7）。配備成功までは実装件数。既存CSVは659e基準のまま保持。

- maintenance4件は `da96abe4c81833c3068e0ee9abebf80ddd3a3258` / Pages `633bf043-bf4b-419f-a099-3cbabf8be5b2` 成功。
- 電源断・停止コード・ReShade解除を3件追加。英語101/231、未対応130、共通24/28（残4）。配備成功までは実装件数。

## 共通ガイド完了バッチ

要件3件と設定ファイル初期化を追加し共通28/28。英語105/231、残126。初期CSVは保持。再集計でregistry/sitemap不一致0。Discord34、PC19、ゲーム記事45・ハブ4、gear1、tools2、index3、public7、trouble7、月間2・週刊2が未対応。sitemap外の保存/診断等UIと英語全体QAも残る。

## Discord起動・更新バッチ

既存4記事を追加してDiscord8/38・残30。英語109/231、未対応122。次候補はcant-hear-voice、audio-input-not-found、error-1001/1002/1003。公式エラーコード30952914470807は短いURLで取得失敗後、公式一般ガイドのリンクからフルURL本文を取得済み。候補はまだ翻訳/公開済み件数に含めない。

## Discord音声5件

Discord13/38・残25、英語114/231・残117。registry/sitemap不一致0。次は台帳順Bluetooth音声、Bot追加/応答/削除。既存日本語も公式日本語も読めるためBluetooth英語資料単体の取得失敗を全体停止条件にはしない。スペイン語版/中国語版へは未移行。

## Discord Bluetooth・Bot4件

bluetooth-audio-problem / bot-add / bot-not-responding / bot-remove追加。Discord17/38・残21、英語118/231・残113、registry/sitemap不一致0。localized250、全体型/buildと対象lint、49記事2261内部リンク、4幅20組・検索16件成功。API書込み0。詳細english-discord-bots-review-2026-10-18.md。英語全体QAと親担当の本番画面確認は残る。次は台帳順call-disconnects以降。

## Discord通話切断・カメラ・終了3件

call-disconnects / camera-not-working / crashing追加。Discord20/38・残18、英語121/231・残110。registry/sitemap不一致0。前バッチfbf5faaはPages 6ea872e2-cac5-4d4e-bc54-e14baf1df268成功を確認済み。次はecho-double-voice、game-not-detected、game-volume-lowers以降。スペイン語版・中国語版には移行していない。
