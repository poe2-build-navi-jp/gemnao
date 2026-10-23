# ACE COMBAT 8 / Planet Zoo 2 日英記事レビュー

確認日: 2026-10-22。対象: poe2-build-navi-jp/gemnao、本番ブランチ gemunao、既存サイト https://gemnao.pages.dev 。基点は 276bfe2c4a0758272a79ca2adbd518058b5df102。開始時と最終確認時の `git ls-remote origin refs/heads/gemunao` が同じSHAで、checkout HEADと一致。作業はローカル work の未コミット差分。push / merge / deploy / IndexNow送信なし。

AGENTS.md と CLAUDE.md を確認。リポジトリと /workspace/.agents に関連する .agents/skills は存在しない。通常の新規4言語規則に対し、今回のユーザー指示を優先して日英のみ追加。zh/esの架空URLは作らない。既存サイト・公開範囲・認証・DB・課金・設定を変更しない。

## 実装

- `lib/october-stability-articles.ts`: 新規2記事×日英。ACE COMBAT 8 は起動不良やカクつきと分け、起動後のメモリ関連クラッシュに特化。Planet Zoo 2 は既存記事なしのため動物解放クラッシュとオートセーブを1記事に統合。
- `lib/launch-week-articles.ts`, `lib/localized/ace-combat-launch-articles.ts`: 既存起動記事の日英の結論・最新告知・補完記事への導線を更新。既存STEP idを維持。
- `lib/followups/ace-combat-performance.ts`: 日英のカクつき記事から新規クラッシュ記事への導線。
- `lib/games.ts`, `lib/localized/hubs.ts`, `lib/localized/remaining-hubs-en.ts`: Planet Zoo 2の日英ハブ、ACE COMBAT 8の症状案内。Planet Zoo 2は1記事の案内ハブなので既存方針どおり noindex,follow、sitemap対象外。
- `lib/game-articles.ts`, `lib/localized/index.ts`, `lib/og-cards.ts`: 既存レジストリへ登録。canonical・hreflang・sitemapは既存機構で生成。
- `lib/og-image-manifest.ts` と `public/images/og/` の新規6画像: 4記事＋Planet Zoo 2の日英ハブ。自動生成。
- `scripts/check-october-stability-build.mjs`: ビルド済みHTMLの回帰チェック。
- このフォルダ: 検証結果とスクリーンショット。

## 提案URL（まだ未公開）

- https://gemnao.pages.dev/games/ace-combat-8/crashing-memory
- https://gemnao.pages.dev/en/games/ace-combat-8/crashing-memory
- https://gemnao.pages.dev/games/planet-zoo-2/crashing-autosave
- https://gemnao.pages.dev/en/games/planet-zoo-2/crashing-autosave

既存更新URL: `/games/ace-combat-8/not-launching`、`/en/games/ace-combat-8/not-launching`。関連記事の導線更新: 日英 `stutter-audio-cutting-out` と ACE COMBAT 8 ハブ。新規ナビゲーションハブ: 日英 `/games/planet-zoo-2`。

## 一次資料

- https://steamcommunity.com/app/2288340/allnews/ : 10月16日 Product Notice ②、10月20日 1.01.002予告の本文を実読。合計約48GBはRAM＋Windows仮想メモリの一部クラッシュの暫定目安。物理RAM48GB必須・恒久修正とはしない。10月23日は配信予定であり未配信扱い。
- https://steamcommunity.com/app/3219030/allnews/ : 10月20日 Under Investigation、10月16日1.0.5本文を実読。動物解放時クラッシュ／hub移動時のautosave timer問題は次回更新へ向けて修正テスト中。手動保存とMy Savesを公式回避策として区別。
- https://store.steampowered.com/app/2288340/ : 正式名 ACE COMBAT 8: WINGS OF THEVE、表示発売日 October 1, 2026。既存日本向け10月2日案内とは地域・時差に注意する表記。
- https://store.steampowered.com/app/3219030/ : 正式名 Planet Zoo 2、表示発売日 October 13, 2026。
- https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/introduction-to-the-page-file : コミット上限、タスクマネージャーでの確認、ページファイル拡張と空き容量の関係を実読。固定最大値・削除・買い替えを一律推奨しない。

個別のACE COMBATパッチURLとPlanet Zoo公式サイト記事はこの環境の取得でエラー。本文を読めたSteamのパブリッシャー告知を出典とした。親から共有されたPlanet Zoo公式個別記事の403は迂回していない。実機検証・検索数・PVの実績なし。

## 検証結果

PASS:
- `node scripts/run-localized-check.mjs`: 343 translated pages / parity。
- 変更した全TSファイルと追加検証スクリプトへの `node_modules/.bin/oxlint`。
- package.jsonのbuildと同じ処理: vinext build --prerender-all --prerender-concurrency 1 → prepare-pages → check-static-search-assets → generate-og-cards --check。ビルド時の既存chunk-size警告は残る。615 snapshots / 595 sitemap URLs / OG 542 pages。
- `node scripts/check-october-stability-build.mjs`: 新規4記事のhead内canonical/OG、双方向日英hreflang、実在翻訳のみ、sitemap、STEP anchors、英語本文、日本語混入なし、hub/backlinks、27 editorial links。
- `node scripts/run-search-index-parity-check.mjs`: 8 queries × 10 filters、179 articles。
- Python Playwright + /usr/bin/chromium: 新規4記事 × 375/1440px。横溢れなし、h1各1個、言語メニュー、CSS/JS 200、pageerrorなし。browser.jsonと8枚のPNG参照。生成HTMLを配信するlocalhostのみ。外部通信ブロック、APIはローカルstub。実Cloudflare Worker/API・DB動作や本番配信の検証ではない。
- `git diff --check`。

未解消（今回の成功に含めない）:
- `pnpm`経由は自動依存インストールが `/home/agent/.local/share/pnpm` のmkdir ENOENTで停止。依存追加や環境変更はせず、既存node_modulesの実行ファイルとスクリプトで検証。
- 全体lint: 29 errors。未変更のdiscord-server-directory.tsxに4件、feedback-stats-d1/control.test.mjsのno-floating-promisesに6件、残りはこの環境の@playwright/test欠落と関連型エラー。元コミットを /tmp に展開し、同じ既存依存で実行した結果と完全一致（ログ同梱）。
- 全体typecheck: 19 errors。@playwright/test欠落と関連implicit-any。元コミットと完全一致（ログ同梱）。
- 既存 `check-english-articles.mjs`: English home discovery断言で失敗。変更版は `/games/aion2/login-error`、元コミットの再ビルドでも `/games/gears-of-war-e-day/not-launching` で失敗。全ページをホームに直接掲載するという既存テストの期待を満たしていない。今回の4ページは専用回帰テストで検証済みだが、この総合テストはPASS扱いしない。

## 公開に必要な操作（未実施）

この差分は未コミット・未pushであり、公開済みではない。ユーザーの公開承認後、最新gemunaoとの差分を再確認し、この対象差分だけをcommitして本番ブランチgemunaoへ反映する必要がある。リポジトリの既存公開記録は gemunao push → Cloudflare Pages Git連携だが、今回Cloudflare側の現在のproduction branch/連携設定を照会していない。したがってpushだけで公開成功とは断定しない。

既存Pagesプロジェクトgemnaoで、同一commitのビルド・配信成功を確認し、上記4URLと更新URLのHTML/head、CSS/JS、言語リンク、sitemap、robots、ads.txtを本番で検査する。別プロジェクトへ移動したり、新規deploy方式・DB操作・認証追加を導入する必要はない。全体lint・型検査の残存失敗は公開判断へ引き継ぐ。公開操作は今回の依頼で禁止されているため未実施であり、アクセス拒否された操作の再試行や自動承認拒否は発生していない。

## 公開承認後の追記

2026-10-22、親スレッドのユーザー「いいよ」により今回の対象差分のcommit・gemunao反映・既存Pages連携での公開を承認済み。直前のリモートは基点276bfe2と一致。他者の追加変更なし。公式Steam告知を再読し、ACE COMBAT 8の1.01.002は引き続き10月23日予定、Planet Zoo 2の対象問題は修正テスト中であることを確認。上記の「未公開」は初回レビュー時点の記録。配信結果はこのcommitに対するPagesチェックと本番HTMLの確認結果として別途報告する。
