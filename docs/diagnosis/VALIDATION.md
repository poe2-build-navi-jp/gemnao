# 検証記録

## 作業前

対象branch `gemunao`, commit `cdc1581301a00b0ff35dd5d833b263c49bfed6b1`。`pnpm install --frozen-lockfile`、`tsc --noEmit`、`pnpm lint`、`pnpm build`は成功。sitemap236件、画像sitemap21ページ、OG162件。

作業環境のpnpm/Cloudflareのホーム領域が書込み不可だったため、ツール用の一時保存場所を作業領域へ指定した。既存ソースや設定を削除して通してはいない。

## 2026-10-02 実装後の結果

- `pnpm typecheck`: 成功
- `pnpm lint`: 成功
- `pnpm test:diagnosis`: 30/30成功。ルール/リンク12件+SQLite SQL/API境界18件
- `pnpm build`: 成功。sitemap237件（既存236件+diagnose1件）、画像21ページ/OG162件を維持
- `node scripts/run-site-search-check.mjs`: 成功
- `node scripts/run-affiliate-analytics-check.mjs`: 成功
- `node scripts/run-gear-guide-check.mjs`: 成功
- `node scripts/run-localized-check.mjs`: 54翻訳ページ成功

ルール/APIテストはP0全症状、不明回答、上流回答変更、試行済み除外、該当なし、PC全体停止、別原因の優先順、非Steam、実在記事、権限、CSRF、不正/巨大入力、30日期限、失効/削除、停止フラグ、再試行、回数制限、障害時汎用エラー、選択肢の文脈、未検証DB接続禁止、過去の共有表示名の固定、定期削除停止時の集計停止を含む。

追加の全組合せスモーク確認では6,930パターンを実行し、18ルールと安全/情報不足の両分岐へ到達。各結果は理由を伴う1〜3件の重複しない対処だった。

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

## ブラウザ確認

### 許可されたクラウドブラウザによる初回プレビュー実操作

URL: https://ea887f6b.gemnao.pages.dev/diagnose 。初回commit `358aeebbda82bc453f1a279526dccdc1516d3df8`、テスト済みtree `1b348825dcd40a97cde077baca0225eae58a5b26`。本番branchは変更していない。

実際のデスクトップviewportは1165pxで、次を確認した。

- P0全6症状で技術質問をすべて不明にしても、情報不足の結果へ到達
- 共有は自動作成せず、停止中の案内になる
- 起動不可 → エラー → DirectX → 2回戻る → エラーなしで、エラー質問と結果の残留がない
- 整合性確認を改善なしにすると、推奨から同じ整合性確認を除外
- 改善した記録が再読み込み→再開でも残る
- Space/Enterのキーボード操作と見出しへのフォーカス移動
- PC電源断の分岐はゲーム質問を止め、適切な安全案内と既存記事へ遷移
- DOMのclientWidth/scrollWidthがともに1165で横スクロールなし
- DOMの外部scriptは同一originの3bundleのみ

この実操作で、試行済み対処が最初から15項目表示されるUX課題を発見した。修正版は現在の候補（最大3件）だけ表示し、その他の対処は任意の折りたたみへ移す。再確認用のブラウザテストも追加した。共有スナップショットの回答/試行済み対処の表示名を固定し、Steam Input CTAの実URLも修正した。

### 未確認の範囲

`pnpm test:diagnosis:browser` は現在14ケースを定義する。初回の13ケースは作業コンテナのChromium起動時にUnixソケットが拒否され、許可確認後の再試行でも起動不可。UI assertionは実行されていない。自動ブラウザテストの成功と報告しない。

許可されたクラウドブラウザでも、viewport変更機能がなく、DevToolsは組織により禁止されていたため停止した。375/390/430pxのシミュレーションと実機検証は未確認。スクリーンショットファイルは保存していない。別ブラウザでの共有/管理UIも、隔離されたリモートD1がないため未確認。これらは本番有効化前の残りの確認であり、HTTP/API検証で代替済みとは扱わない。

## 公開状況

- ローカル: 実装・型・lint・30テスト・build・実D1/HTTP11確認まで
- リモートpreview: 専用feature branchに初回版を公開し、上記デスクトップUIを確認。共有/計測/診断DB接続は無効。修正版の公開URLは当該commitのCloudflare Pages checkで確認する
- production: 未反映。実際のD1 binding/schema、production migration、cleanup Worker/Cron、バックアップ/ログ/失敗監視、モバイル/共有UIのブラウザ確認を完了してから反映する

コードが揃ったことを、productionで任意の安全な共有まで使えるMVPの公開完了とは扱わない。
