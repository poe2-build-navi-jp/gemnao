# Gears of War: E-Day / WARDOGS 日英記事レビュー

基点: `b76006f6e2e55b8e76903397e574f23068e70f04`。2026-10-22に最新 `origin/gemunao` をfetchし、checkout HEADと一致を確認。作業開始時はclean。最終remote確認も同一SHA。前回のACE COMBAT 8 / Planet Zoo 2の公開済み差分を維持。今回は未コミット・未push・未deploy。

AGENTS.md / CLAUDE.mdを再確認。利用可能な関連 `.agents/skills` はない。明示された日英の依頼を優先し、未翻訳zh/es URLを作らない。環境・認証・DB・課金・公開範囲・Pages設定は変更していない。

## 提案URL（今回分は未公開）

- https://gemnao.pages.dev/games/gears-of-war-e-day/achievements-rewards
- https://gemnao.pages.dev/en/games/gears-of-war-e-day/achievements-rewards
- https://gemnao.pages.dev/games/wardogs/error-wd-l020
- https://gemnao.pages.dev/en/games/wardogs/error-wd-l020

既存Gears `not-launching` 日英は実績記事への導線のみ追加し、既存の確認日やSTEP idを変更していない。既存WARDOGS `server-connection` 日英は再利用し、結論、修正履歴と現在の状態の区別、高pingキック、起動コード・ゲーム終了・PC再起動の分岐を更新。各ゲームの日英ハブから両症状記事へ案内。英語ハブは新規追加、日本語ハブは既存を維持。2記事になった日本語ハブは既存のindex条件を満たす。

## 主な差分

- `lib/gears-wardogs-articles.ts`: 新規2記事×日英。症状表、要点、FAQ、公式出典と確認日、対処順、リスク表示。
- `lib/game-articles.ts`, `lib/localized/index.ts`: 記事登録。canonical / hreflang / sitemapは既存の仕組みで生成。
- `lib/october-release-articles.ts`, `lib/localized/aion-gears-en.ts`: Gears既存記事からのリンク。
- `lib/new-release-articles.ts`, `lib/localized/final-games-en.ts`: WARDOGS接続記事更新。
- `lib/games.ts`, `lib/localized/hubs.ts`: 日英ハブの症状案内。
- `lib/og-cards.ts`, `lib/og-image-manifest.ts`, `public/images/og/`: 自動生成OG。新規6画像（4記事＋英語ハブ2）、日本語ハブ2画像更新。
- `scripts/check-gears-wardogs-build.mjs`: 記事・ハブ・リンク・SEO回帰検査。
- このフォルダ: ログ、browser.json、8枚の画面証跡。

## 一次資料・記述範囲

以下は今回本文を実読したもの。発売確認はGearsのSteam公式10月6日発売告知（日本向け既存日時との差を新たに変更しない）、WARDOGSのSteamストア9月10日Early Access表示。

- https://www.gearsofwar.com/en-us/news/oct-14-patch-notes/
- https://www.gearsofwar.com/en-us/news/
- https://steamcommunity.com/app/3010850/allnews/
- https://steamcommunity.com/app/1867240/discussions/0/585061535402989202/
- https://steamcommunity.com/app/1867240/discussions/0/585061535403000092/
- https://steamcommunity.com/app/1867240/discussions/0/585060903246928845/
- https://steamcommunity.com/app/1867240/discussions/3/562541966849717283/
- https://steamcommunity.com/app/1867240/allnews/
- https://store.steampowered.com/app/1867240/
- https://www.team17.com/support/

Gears: 10月14日の進捗追跡・Co-op修正と、同告知に残る実績・関連報酬の調査項目を分離。後続の修正完了本文は今回未確認で、10月14日が必ず最新パッチとは断定しない。欠落収集品は再収集、スキン／称号は完了済みミッションから新キャンペーンで再プレイする対象限定の案内。自動再付与や全実績の解除保証に拡大しない。新キャンペーンによる進行への影響を明示し、上書き対象や保存状態が不明なら操作を止める。

WARDOGS: 開発者の0.1.2配信済み投稿でKB5124010関連WD-L020の修正を確認。古い9月23日のWindowsロールバック案内は修正前の履歴として扱い、更新削除の手順は掲載しない。WD-L014／WD-L018は9月30日の対応中告知であり、10月22日に継続障害を実測したとは書かない。個別コードの修正完了は確認資料では未確認。0.2.0は10月15日の配信告知で確認し、高ping継続超過によるキックと次マップまでの再参加制限を接続記事に反映。上限ms値を創作しない。過去の復旧告知は現在の正常性を証明しない。

Gears Supportリンクは公式パッチノートのリンク先を確認できたが、サポート本文はJavaScript必須表示。Steam公式整合性FAQも取得本文が画像のみだったため、そのページの本文を読めたとは扱わない。実際に読めたTeam17_Help開発者返信の整合性確認案内を出典に追加。公開pasteへのDxDiag全文投稿は転載せず、個人情報の確認と公式サポートを案内。実機検証・検索数・PVの実績は主張しない。

## 検証

PASS:
- package.json buildと同じ処理を既存binで実行: `vinext build --prerender-all --prerender-concurrency 1` → `prepare-pages.mjs` → `check-static-search-assets.mjs` → `generate-og-cards.mjs --check`。621 snapshots / 603 sitemap URLs / OG 548 pages。既存のchunk-size警告は残る。
- `node scripts/run-localized-check.mjs`: 347 translated pages、日英STEP対応。
- 変更TSファイルと追加検査スクリプトすべてに対する `node_modules/.bin/oxlint`。
- `node scripts/check-gears-wardogs-build.mjs`: 新規4ページのcanonical、双方向hreflang、sitemap、head内OG、STEP anchors、英語本文、4ハブと既存記事からの導線、editorialリンク24件。
- `node scripts/check-october-stability-build.mjs`: 前回公開済み4記事の回帰、27リンク。
- `node scripts/run-search-index-parity-check.mjs`: 8 queries × 10 filters、181 articles。
- Python Playwright + /usr/bin/chromium: 新規4記事＋更新4記事＋日英ハブ4の計12ページ × 375/1440px。h1各1、canonical、言語メニュー、横溢れなし、pageerrorなし、CSS/JS 200。新規4ページ×2幅のPNGとbrowser.json保存。生成HTMLをlocalhostで配信し、外部通信は遮断、APIはstub。実Cloudflare Worker/APIやDBの検証ではない。ゲーム実機検証でもない。
- `git diff --check`。

未解消・成功に含めない:
- 全体lintは29件。既存discord-server-directory.tsx 4件、feedback-stats-d1/control.test.mjs 6件、@playwright/test欠落と関連型エラー19件。
- 全体typecheckは19件。@playwright/test欠落と関連implicit-any。
- 両ログは前回基点検証で保存済みの `docs/validation/october-stability-2026-10-22/{lint,typecheck}-current.txt` と完全一致。今回の変更による増加なし。
- `check-english-articles.mjs` は既存の English home discovery: /games/aion2/login-error で失敗。新規記事の検証成功でこの全体失敗を隠さない。
- 前回pnpm起動時に依存の自動インストールがホーム作成エラーとなったため、今回は既存node_modulesのbinを直接使用。依存追加・認証追加・環境設定変更なし。

## 引き継ぎ

今回は実装・検証までの依頼なのでcommit/push/deployなし。親から前回公開成功の連絡を受領済みで、通信制限を公開失敗と解釈したり再pushしたりしていない。今回の実装・ローカル検証に新規アクセス拒否はない。全体検査の残存失敗と、未公開であることを引き継ぐ。公開は別の明示承認後、最新gemunaoとの差分と対象commitを確認して既存Pages連携を利用し、同一SHAの実際のPagesチェックと本番HTMLで検証する。

## 公開承認後の追記

2026-10-22、親スレッドのユーザー「いいよ」により今回分のcommitとgemunaoへの通常pushを承認済み。直前のfetchでリモートとHEADは基点b76006fに一致し、他者の追加変更なし。上記の未公開・未コミット表記は初回レビュー時点の記録。今回の配備確認は親側の既存GitHub connectorと通常公開HTTPに引き継ぐ。保存環境で以前拒否されたgh／本番HTTPは再試行しない。push成功を配備成功とは扱わない。
