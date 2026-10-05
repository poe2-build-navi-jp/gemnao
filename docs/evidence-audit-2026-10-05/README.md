# 一次情報の確認台帳 — 第1段階（未完了）

対象は gemnao、基準コミットは PR58 マージ `9a1389c6fd22c1fb6d6d0b4d13ac47b660e7b827`。確認日: 2026-10-05（UTC）。**全件の事実確認は完了していない。** 本PRはURL・本文候補の棚卸しと、安全面を優先した最初の修正をレビュー可能にするもの。

## 到達範囲

- 最新基準ビルドのサイトマップ272 URLと内部リンクをローカルで巡回。ルートの空パスと `/` を統一し、296 HTML URL（JA 212 / EN 38 / ZH 23 / ES 23）を記録。管理画面、API、任意のユーザー生成IDを含む全パラメータの列挙は対象外。
- 285の静的記事・ハブ等に加え、公開の動的ページ・ツール等を含む。これは公開サイトで同じ版が配信中という確認ではない。
- 本文の段落・リスト・表・見出しから17,272の候補ブロックを抽出。UI文言・まとめ・複合主張も含み、厳密な独立主張の数ではない。抽出器は12文字未満、本文外、実行後にだけ出る内容を完全にはカバーしない。
- 一次情報との人手照合は30候補のみ: `verified` 13、`erroneous` 17。残り17,242候補は `unverified`。17件は6ゲームの安全な案内への修正と、鬼武者の公式手順の順番に関する訂正。ファイル内の各記事の従来の `checkedAt` は全件再確認した日として更新していない。
- FF Resonance・DQM4・AC8の公式ストア、カプコンのDragon’s Dogma 2 DLC / TU3.2の発表を確認。未知の作品名を理由に「架空」と判断していない。

## 台帳の読み方

- `pages.json`: URL、言語、H1、候補数、本文内の外部リンク、ローカル取得時刻、部分確認状態。`external_links` は候補リンクであり、根拠として採用済みという意味ではない。
- `claims.jsonl.gz`: **修正前の基準ビルド**の本文候補と安定ID。`status` はこの旧文言への評価。`erroneous` の解消状況は `reviews.json` の `resolution` を参照。未確認行の根拠URL・確認日・対象バージョンは空/`null`（不明）であり、推測で補完しない。
- `reviews.json`: 人手で照合したID、判定理由、根拠URL、確認日、対応バージョン・範囲、修正内容。安全上の問題を `unsafe-guidance`、公式の順番の誤説明を `factual-attribution` と区別。ゲーム公式にも除外の記述はあるため、「公式が言っていない」とは主張しない。
- `source-observations.json`: 確認範囲が狭い出典、取得不能、発売日表示の差などの保留事項。
- `priority-queue.json`: 未確認候補を危険手順→発売/パッチ→動作環境/設定の順で検索するための索引。キーワード分類で重複あり。検出数を誤りの数にしない。

読取例（ネットワーク不要）:

```bash
gzip -dc docs/evidence-audit-2026-10-05/claims.jsonl.gz | head -n 3
```

再生成は対象リビジョンの `pnpm build` 後、D1を接続しないローカルプレビューに対し実行する:

```bash
python3 scripts/audit-public-site.py --base http://127.0.0.1:3001 --output outputs/evidence-local-baseline --workers 3
python3 scripts/inventory-evidence.py --crawl outputs/evidence-local-baseline
```

既存の `reviews.json` は基準ビルドの文言IDに紐づく。修正後の別ビルドを同じ台帳に上書きするとID不一致で停止する。次回は別の台帳ディレクトリを使い、旧候補IDと新しい文言を照合する。

## 修正内容と根拠

BG3・HELLDIVERS 2・ホグワーツのJA/ZH/ES、鬼武者・AION2・GearsのJAにあった、保護停止・自動的な広い除外を推奨する手順を変更。保護を有効に保ち、検出名と対象ファイルを確認して提供元へ相談する。既存ENの安全方針に合わせ、同じ主張の要約・FAQ・HELLDIVERSハブZH/ESも修正。クラシック3記事の4言語と追加3記事にMicrosoftの一次情報を掲載。

根拠: [Microsoftの除外に関する注意](https://support.microsoft.com/en-us/windows/security/threat-malware-protection/virus-and-threat-protection-in-the-windows-security-app)、[Larian](https://larian.com/support/faqs/crashing-upon-startup-pc_59)、[Arrowhead](https://arrowhead.zendesk.com/hc/en-us/articles/14732747845020-I-receive-Error-114-when-attempting-to-launch-HELLDIVERS-2)、[WB Games](https://portkeygamessupport.wbgames.com/hc/en-us/articles/10765467342099-PC-Troubleshooting-Steam)、[カプコンの開発者投稿](https://steamcommunity.com/app/2638890/discussions/0/589562598193771782/)。安全面の編集判断と、各社が実際に書いている内容を区別した。

鬼武者の「公式の最初の確認項目はドライバー更新」は、公式がPCの要件確認から始めていることと不一致だったため訂正。編集部が並べ替えた手順だと明示。

## 検証

- 型検査、lint、ビルド、翻訳整合性79ページ: PASS。
- 関連既存回帰 `check-editorial-safety.mjs` / `check-safe-step-navigation.mjs`: PASS。
- `check-evidence-safety-browser.mjs`: 15対象URL × 375 / 390 / 430 / 1440px = 60組、4言語の表示、Microsoft出典リンク、危険な旧指示の非表示、横スクロール/JS例外なし: PASS。
- 既存 `check-safe-step-navigation-browser.mjs`: 4幅でキーボードによる認識分岐、結果押下、保存取消/保存/再訪、ノート切替・投票重複防止: PASS。fixtureのみ、APIはモック、外部リクエスト遮断。
- `check-static-pages-http.mjs`: D1未接続のローカルPagesで285 HTML、robots/ads/sitemap、404、HEAD/RSC、既存ZIP3種の同一性: PASS。
- `check-home-return-build.mjs`: ローカルCSS/JS 32ファイル: PASS。
- [390pxの修正後表示](helldivers-390.png)を目視確認。本文修正のみで、STEP ID、URL、保存形式、MyGames上限、計測、D1、Botに変更なし。OG3枚とマニフェストを再生成。

## 残作業・制限

1. 公開サイトへのcurlはプロキシの `CONNECT tunnel failed, response 403`。webツールでもサイトマップを取得できず。本番の配信内容・公開後確認は未実施。Cloudflareログイン/CAPTCHA経路は利用していない。
2. Steamニュースはタイトルのみで本文が取れないものがある。WARDOGSのWindows更新/修正、CONTROL 1.4.1、AION2メンテ終了、AC8時刻同期・ペナルティ解除は今回未確認。検索に出るユーザー報告を公式根拠にしていない。誤りと断定していない。
3. FF Resonance / AC8の発売日は取得したSteam表示と記事に1日の差がある。日本の公式日時と地域表示を照合する必要があり、未確認のまま日付を書き換えていない。
4. 残る17,242候補、その他の動作環境・設定名・パッチ内容・症状と原因の断定、各言語のすべての主張について一次情報との照合が必要。全体完了率は算出しない（候補ブロックにはUIと複合主張が含まれる）。
5. ゲーム実機の解決検証はしていない。ユーザーの記録・本番回答に触れず、PV改善や解決率の結果も作っていない。既存計測から本修正の効果は未計測。

マージと公開は親スレッドで調整する。本PRを全件監査の完了として扱わない。
