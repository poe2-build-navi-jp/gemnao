# 検証記録

## 作業前

対象branch `gemunao`, commit `cdc1581301a00b0ff35dd5d833b263c49bfed6b1`。`pnpm install --frozen-lockfile`、`tsc --noEmit`、`pnpm lint`、`pnpm build`は成功。sitemap236件、画像sitemap21ページ、OG162件。

作業環境のpnpm/Cloudflareのホーム領域が書込み不可だったため、ツール用の一時保存場所を作業領域へ指定した。既存ソースや設定を削除して通してはいない。

## 2026-10-02 実装後の結果

- `pnpm typecheck`: 成功
- `pnpm lint`: 成功
- `pnpm test:diagnosis`: 27/27成功。ルール11件+SQLite SQL/API境界16件
- `pnpm build`: 成功。sitemap237件（既存236件+diagnose1件）、画像21ページ/OG162件を維持
- `node scripts/run-site-search-check.mjs`: 成功
- `node scripts/run-affiliate-analytics-check.mjs`: 成功
- `node scripts/run-gear-guide-check.mjs`: 成功
- `node scripts/run-localized-check.mjs`: 54翻訳ページ成功

ルール/APIテストはP0全症状、不明回答、上流回答変更、試行済み除外、該当なし、PC全体停止、別原因の優先順、非Steam、実在記事、権限、CSRF、不正/巨大入力、30日期限、失効/削除、停止フラグ、再試行、回数制限、障害時汎用エラー、選択肢の文脈、未検証DB接続禁止を含む。

## 実際のローカルD1/Pages/Cron

`DIAGNOSIS_SKIP_BROWSER=true bash scripts/test-diagnosis-browser.sh`: 11確認成功。Node SQLite adapterとは別に、WranglerのD1 bindingと構築済みPages Workerで実行。

- ID `00000000-0000-4000-8000-000000000004` の偽ローカルDBに0000〜0004を適用。remoteフラグなし
- cleanup Workerのscheduled handlerをローカルのテスト入口から実行、heartbeat更新を確認
- API共有作成と128bit ID、公開DTOから秘密除外
- Pages共有レスポンスの汎用OGP、noindex/no-store/no-referrer/CSP
- 別HTTPセッションの更新/削除403
- 本人の明示更新、失効でページ/APIとも404
- 本人削除による実DB行の消失
- 期限到達でページ/APIとも404、実際のscheduled処理で期限切れ行が消える
- sitemap旧236件保持+診断1件、個別共有は含めない
- トップ、記事、ゲームハブ、英語、記事一覧、robots、ads、feedback、CSS/JSが200

テスト用に作った共有は削除または期限切れ処理で消去した。テストログとSQLiteデータは`.wrangler`以下の無視対象。公開リポジトリに実行ログ/診断データ/秘密は含めない。

## 既存テストの失敗

`node scripts/check-feedback-d1.mjs` は75行目で失敗。「レイトレーシングと影を下げる」という古い期待文と、現記事の「FPSが上限値で頭打ちなら、まず上限設定を確認する」が異なる。

同じコマンドを未変更のbaseline commitの分離worktreeで実行し、同じエラー・実際値・期待値を再現した。今回の変更による回帰ではない。テストや記事を削除/変更して成功扱いにはしていない。既存feedback APIのHTTP読取は正常だが、この旧テスト一式を成功と報告しない。

## ブラウザ確認の限界

`pnpm test:diagnosis:browser` は13ケースを定義。P0全経路、全不明、戻る、localStorage再開、キーボード、375/390/430/1280px、保存失敗再試行、別ブラウザ権限、更新/失効/削除、外部通信抑止、SEO回帰を含む。

作業コンテナではChromium起動時のUnixソケットが拒否され、許可確認後の再試行でも起動不可。13ケースはブラウザを起動できず、UIのassertionは未実行。UI機能の不合格とも合格とも扱わない。viewportシミュレーション・スクリーンショット・実機検証はいずれもこの時点では未確認。対応する許可済みブラウザ/隔離DB環境での検証が残る。

## 公開状況

- ローカル: 実装・型・lint・27テスト・build・実D1/HTTP11確認まで
- リモートpreview: この記録時点では未公開。共有/計測/診断DB接続を無効のまま、専用branchで確認する
- production: 未反映。実際のD1 binding/schema、production migration、cleanup Worker/Cron、バックアップ/ログ/失敗監視、ブラウザ確認を完了してから反映する

コードが揃ったことを、productionで任意の安全な共有まで使えるMVPの公開完了とは扱わない。
