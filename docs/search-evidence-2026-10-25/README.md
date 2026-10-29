# 検索巡回方針と症状記事の根拠整理

基準: `gemunao` / `a03f37a2eb4e06a222cda0d2bb581e5e817870c1`。独立worktree・branch `improve/search-evidence-20261025`。別の品質基盤ブランチや未公開collectorは混ぜていない。本番mergeは行わない。

## 棚卸しと今回の範囲

`article-inventory.json` はゲーム105、PC共通28、Discord38、Windows20の191記事を全件列挙する。165件のverified、26件のstatus省略は既存データの状態であり、実機検証済みという意味ではない。`indexed-route-inventory.json` は現行sitemapの495ルート（他言語245を含む）。どちらも公開コードからの棚卸しで、アクセス解析・ユーザー情報は含まない。noindexの管理画面等はsitemap一覧の対象外。

共通テンプレートはゲーム個別記事とPC共通ガイド。根拠レコードのあるページだけ表示し、未登録ページに定型文を大量追加しない。今回の個別整備は日本語4記事:

| URL | 実質的な変更・根拠 |
|---|---|
| `/games/monster-hunter-wilds/not-launching` | 結論を短縮。公式の要件案内と、公開済み本人報告1件の変更・結果・未記録事項・原因特定の限界を分離。既存実例へのリンク。独立再現なし。 |
| `/guide/steam-game-not-launching` | ボタン・エラーの状態から始める短い結論。共通手順に実機結果がないこと、Wildsの結果を転用しないこと、停止記録の読み取り限界と比較項目を明示。 |
| `/guide/verify-steam-files` | 再取得と改善を別の結果として扱う短い結論。セーブ復旧や機器検査とは異なる範囲、比較すべき5項目、結果の限界を明示。 |
| `/guide/directx-error` | 機能レベル・追加DLL・DXGIを分ける短い結論。Microsoftの定義と実機での原因特定を区別。ランタイムでGPUの対応能力が増えると誤解させない。 |

既存Rocket League DualSense記事の日本語/英語の根拠欄・2026-10-22の資料確認日は保持。日本語ゲームテンプレートでは根拠欄を具体手順の後へ移動する。今回4件＋既存1件以外の186記事は **今回未レビュー**。JSONにも明記しており、未整備を完了扱いしない。結論・手順・出典の有無の機械集計は内容の正確性を保証しない。

ホーム・機能一覧・ゲームハブ・商品比較・週刊・発売まとめには症状記事の型を適用しない。他言語の大量翻訳、タイトル・URL・STEP id変更、作者やレビューの創作は行わない。記事全体のcheckedAt・JSON-LD日付も更新していない。

## robots

- `app/robots.ts` と `public/robots.txt` にOAI-SearchBotの公開ページ許可、GPTBotの全拒否を明示。
- Google/Bing等には従来どおり `*` の公開ページ許可。管理/APIの `/admin`・`/api` はwildcardとOAI双方で拒否。特定UAのグループはwildcardの制限を継承しないため、OAIにも同じ除外を指定。
- 基準コードのrobotsには管理/API除外がなかったため、今回追加。既存管理ページのnoindex・認証・Worker経路は変更していない。robotsはアクセス制御ではない。
- 非公開モード `NEXT_PUBLIC_SITE_PUBLIC=false` は全UA拒否・sitemap省略を維持。
- Cloudflare/WAF/IP許可/権限/秘密/DBは変更なし。全学習事業者やユーザー操作による取得を拒否する設定とは説明しない。検索掲載・順位は保証しない。

2026-10-25に確認した公式根拠:

- https://developers.openai.com/api/docs/bots — OAI-SearchBotとGPTBotは独立した用途・設定。ChatGPT-Userはユーザー操作で、robotsが適用されない場合がある。
- https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt — 検索掲載は保証されず、ホスト/CDN側の到達性も関係する。

公開 `https://gemnao.pages.dev/robots.txt` の取得はこの環境でHTTP403。回避や設定変更は行わず、現行公開本文の一致は未確認。ローカル生成物で検査する。

## 記事の出典と確認の限界

- Wilds: Capcom公式 https://steamcommunity.com/app/2246340/discussions/0/596267902352499417/ の動作要件・高解像度テクスチャ部分を本文照合。新たな実機試験なし。本人報告は `lib/reported-cases.ts` の公開済み記録のみで、元データは変更なし。正確な報告日時・ゲーム版・Steam版はnullのまま。
- DirectX: https://learn.microsoft.com/ja-jp/windows/win32/direct3ddxgi/dxgi-error と https://www.microsoft.com/en-us/download/details.aspx?id=8109 の説明を本文照合。2026-10-25はこの出典範囲の確認日で、実機動作確認日ではない。
- Steam: 公式FAQの検索抜粋は取得できたが、日本語・英語ページとも本文の抽出結果は画像のみ。既存記事の確認日（起動2026-10-21、整合性2026-09-27）を維持し、最新本文の再確認は未完了と記事に明記。元記事にある操作説明を新しい公式確認済み情報へ格上げしていない。

## 検査

最終検証: build成功（HTML646/sitemap495/OG573）、型検査・全体lint・変更範囲lint・翻訳整合（355ページ）成功。新しい設定/根拠データ検査も成功。実ブラウザも375/390/430/1440px×4記事=16ケース、対照5ページで成功。robots実レスポンス、結論→手順→根拠欄の順序、canonical/OG、横はみ出しなし、JS例外・CSS/JS失敗・書込み試行0を確認。Wilds根拠欄は375px/1440pxの画像を目視し、文字・リンクの欠けがないことを確認。ゲームの実機テストではない。

既存 `scripts/run-evidence-articles-check.mjs` は、DiscordのgenerateStaticParamsを昔の3ページに固定した期待値と、現在の英語追加ページとの不一致で停止。該当テスト・Discordルート・翻訳集合は今回未変更。無関係な期待値変更で成功扱いにせず、この失敗を残す。


再現コマンド:

```sh
node scripts/inventory-search-evidence.mjs
node scripts/check-search-evidence.mjs
pnpm build
pnpm typecheck
pnpm lint
pnpm check:localized
# ローカルproduction serverを別ターミナルで起動
node node_modules/vinext/dist/cli.js start --hostname 127.0.0.1 --port 3098
node scripts/check-search-evidence-browser.mjs
```

ブラウザ検査は既存Chromium `/usr/bin/chromium` を使う隔離環境向け。APIはローカルfixture、外部通信・書込み・WebSocketは遮断する。対照ページはホーム・英語ホーム・tools・Rocket League日英。証跡はGit対象外の `outputs/search-evidence-2026-10-25/` に保存。初回のテスト側ではrobotsのUser-Agent大文字小文字を厳密比較して失敗したため、大文字小文字を区別しない照合へ修正し、全ブラウザケースを再実行して成功。新規テストのlint指摘も修正済み。

残件: Steam公式本文の再取得・画面操作の実機検証、残り186記事の個別根拠整備、公開robots本文と実OAI-SearchBot到達性の確認。Cloudflare/WAFを変更して残件を解消しない。draft PRのレビュー後も、本番反映は別途判断する。


## 公開判断の追補

[RELEASE-READINESS.md](RELEASE-READINESS.md) に4記事の正確なURL/既存対応言語、Steam未再確認の影響と限定、変更前でも同一だったDiscordテスト失敗、残186記事の50/17/119件の構造別評価と次のまとまりを記録。`structure-review.json` は全191件の生成HTMLの候補文と評価。今回の追補で186件を新たに実機検証済みとはしていない。

追加の共通表示は、実際に根拠レコードがある4記事の目次リンクのみ。Steam整合性の対象外説明は、機能全般の断定から「この記事で扱う手順の範囲」へ限定した。
