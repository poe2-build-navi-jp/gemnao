# 品質改善・検証記録 2026-09-23

## 実装
- 既存102記事を維持。新規追加なし。優先20記事を改善（下記）。STEP IDと順序を維持。
- 新作記事のactionsを必須化し、抽象的な自動補完を削除。
- Discordハブの症状ナビ、公開済み記事のみの一覧。
- 投票APIの型検証を追加。不正な数値・オブジェクト入力がDB到達前に400になることを検証。
- D1 schema変更なし。匿名集計・10件基準・同票・保存成功後共有・症状分岐は既存実装を維持。
- app/sitemap.tsをbuildで利用し、Pagesが配信する静的sitemapを毎回生成。
- audit-contentに最終確認日と抽象STEP検出を追加。検索意図一覧はcontent-intents-2026-09-23.md。

## 改善記事
- https://gemnao.pages.dev/games/onimusha-way-of-the-sword/low-fps
- https://gemnao.pages.dev/games/onimusha-way-of-the-sword/shader-cache
- https://gemnao.pages.dev/games/onimusha-way-of-the-sword/black-screen
- https://gemnao.pages.dev/games/onimusha-way-of-the-sword/hdr
- https://gemnao.pages.dev/games/onimusha-way-of-the-sword/gpu-driver-version
- https://gemnao.pages.dev/games/the-blood-of-dawnwalker/shader-compilation-crash
- https://gemnao.pages.dev/games/the-blood-of-dawnwalker/stutter-windowed
- https://gemnao.pages.dev/games/star-wars-zero-company/black-screen
- https://gemnao.pages.dev/games/star-wars-zero-company/save-progress
- https://gemnao.pages.dev/games/wardogs/server-connection
- https://gemnao.pages.dev/discord/mic-not-working
- https://gemnao.pages.dev/discord/rtc-connecting
- https://gemnao.pages.dev/discord/no-route
- https://gemnao.pages.dev/discord/update-failed
- https://gemnao.pages.dev/discord/installation-failed
- https://gemnao.pages.dev/guide/steam-game-not-launching
- https://gemnao.pages.dev/guide/verify-steam-files
- https://gemnao.pages.dev/guide/pc-game-crash
- https://gemnao.pages.dev/guide/black-screen
- https://gemnao.pages.dev/guide/gpu-driver-update

## 参照した一次資料
- https://help.ea.com/ja/articles/star-wars/zero-company/troubleshoot-common-issues/
- https://dawnwalkergame.com/us/en/news/hotfix-102
- https://steamcommunity.com/app/2638890/discussions/0/589562598193771782/
- https://support.discord.com/hc/en-us/articles/115004307527--Windows-Corrupt-Installation
- https://support.discord.com/hc/en-us/articles/4978019693463-AMD-GPU-CPU-RTC-CONNECTING-Troubleshooting

ゲーム公式が記載する問題と、一般的な切り分け操作を区別する。全環境での再現や解決を保証しない。BIOS更新は型番固有のため一律の操作手順を作らない。

## 検証
- vinext build + prepare-pages：成功、sitemap 133 URL。
- tsc --noEmit：成功。
- check-solution-ranking：102記事のSTEP ID・内部リンク、10件閾値、同票、任意ラベル排除を確認。
- check-feedback-input：不正JSON・型・未登録STEPをDB書き込み前に拒否。
- oxlint、git diff --check：成功。
- title/H1完全重複：0。共通ガイド分類漏れ：0。
- PC公開画面の閲覧確認。375/390/430/1440の指定幅での実ブラウザー検証は未完了（現在のブラウザー操作APIにviewport設定なし）。
- 本番D1にテスト投票は投入していない。保存処理の本番成功・失敗E2Eは未実施。

## 未実施と理由
- Search Console実績未取得。検索クエリ全件・順位・PV上昇は未確認。人気順も追加しない。
- 流入、canonical影響の確認なしに削除・統合・301は行わない。
- 共通ガイド残り15本の詳細化は次回対象。今回の優先20記事を超える全面書き換えはしない。
- 英語記事追加、note投稿、外部SNS投稿は行わない。
