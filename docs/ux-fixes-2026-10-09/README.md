# 症状の終点・検索・マイゲームの改善

基点: 公開ブランチ `gemunao` / `8aa3f41b9a755936243fed5101034a9b3c6c9c3c`（PR100/101/102、75/82を継承）。

受け入れ条件:
- 症状混在記事で「試したが直らない」が別の症状へ進まない。FFのSTEP2、DogmaのSTEP5は症状別リンクと記録・公式情報案内へ接続し、再開位置も現在のSTEPにする。
- 検索あり/なし/0件/URL直アクセス/戻る・進む/解除/繰り返し入力が使える。1165×747および375/390/430pxで最初の結果が初期画面内に見える。
- `/my#my-games` は旧チェック一覧を検索付き `/my-games#my-games` への入口に置換。既存 `gemnao-my-games` の配列形式・キー・登録上限・追加解除処理を保持。

実装: 14記事36か所に明示的な症状の終点を付与。本文、STEP ID、匿名投票のキー/最終STEP集計仕様は維持。終点以外の既存順序と明示nextStepIdは維持。検索のinput要素を維持してフォーカスを失わず、検索中のみ紹介・検索例を隠し短い見出しを表示。

検証:
- `pnpm build` 成功（321 HTML snapshots / sitemap 308 URLs / OG 240）。
- `pnpm typecheck`、`pnpm lint`、変更ファイルlint、`pnpm check:localized`（106翻訳ページ）成功。
- `node scripts/check-symptom-step-endpoints.mjs` / `check-safe-step-navigation.mjs`: 有効な症状リンク、14記事36終点、本文/ID保持、既存分岐維持。
- `node scripts/run-site-search-check.mjs` / `check-search-entry-guides.mjs`: 検索ランキング、別名、空・0件、フィルターとURL保持。
- `node scripts/run-my-games-analytics-check.mjs` / `run-my-games-page-check.mjs`: 保存済みデータ、重複、古い状態、破損/保存失敗、10件上限、4言語、旧入口の保存非変更。
- ローカルChromiumの検索/マイゲームE2E: 375/390/430/1165pxで19件表示、0件、解除、連続入力、戻る/進む、旧入口→検索UI、既存データ読み込み・解除・再登録・戻る成功。

失敗記録と対処:
- pnpm既定データディレクトリが書込不可・既存modulesの更新にTTY要求: 作業用 `/tmp` のPNPM_HOME/XDG_DATA_HOMEとCIでlockfile固定インストール。依存の追加・更新なし。
- ローカル起動はprepare-pagesがWorkers用設定を削除するため、DBなしの一時Pages設定を使った。Pagesは任意configパスを受け付けないため設定ディレクトリから起動。
- 新規ブラウザテストの初回失敗はhydrate前入力と日本語名を英語名で探すfixtureの誤り。ready待機と実際の表示名に修正し再確認。

実ブラウザ検証は合成データ・ローカルDBなし・APIモック。実ユーザーの保存データ/私的データは使用せず、診断ON/OFF・DB・認証・Cloudflare管理・権限/保護設定は変更しない。実機Windows、Safari/Firefox、支援技術、実ゲーム動作、実APIへの投稿は未検証。
- 統合ビルドで `check-symptom-step-endpoints-browser.mjs`: FF STEP2 / Dogma STEP5 ×375/390/430px、症状リンク、公式出典リンク、ノート保存・再読込後の同じSTEP再開、横溢れ/JS errorなし。`check-step-result-ui.mjs` の投票・再送・ノート分離回帰も成功。
