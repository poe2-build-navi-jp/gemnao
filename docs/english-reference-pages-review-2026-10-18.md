# 残り23ページと英語マイページ

対象は公開済み日本語ページの追加翻訳。public 7、index 2、gear 1、tool 2、trouble 7、weekly 2、new-releases 2。公開対象棚卸しは231/231、登録とsitemapの不一致0（配備確認は別途）。`/en/my` と `/en/discord-servers/submit` はnoindexの操作画面で231件には含めない。

- 週刊は全33項目・予定10行を当時の記録として訳し、過去の調査・予定を現在の障害と扱わない。日付は元記事のJST、公式source URL・記事対応を保持。
- 新作まとめは18作品の構造化spec、GPU/Windows判定、全FAQを保持。Where the Seeds FallのSteam現行容量5GBと旧版10GB、Prinnyの日本向け11/12と英語Steam11/11を明示し、推測で時差の理由を補わない。楽園追放は公式英語名を創作せず日本語名のローマ字表記と明記。GTA VIは9/28時点の記録と限定。
- Stream Deckの仕様・比較・注意・FAQ・出典・既存Amazon Japan ASIN/tagを保持。10/10イベントは過去の開催予定と明記し、開催実績を断定しない。
- Hz計測アルゴリズム、セーブパス、問い合わせ／募集API payloadと列挙値、PC判定ルールを保持。英語の選択表示でも送信値は元の値。
- 英語募集一覧は既存公開APIをclient取得し、取得前・空・失敗を分離。Cloudflare専用D1モジュールをNodeの動的locale列挙でimportするとbuildが失敗するため、既存APIを利用。DB/受付設定は変更しない。英語問い合わせ／募集のedge HTML cacheを除外。
- status/募集一覧の取得待ちに15秒上限。statusは前回成功結果を保持し、失敗・未確認を正常と表示しない。既存状態取得テストにdeadline検証を追加。
- 保存記事の英語リンクを実在する `/en/my#my-reading-list` へ。マイページのPC登録・読みたい記事・ノート・バックアップUIを英語化。既存保存内容とゲーム登録を維持。翻訳ハブのないゲームは日本語overviewと明示。
- 本番QA依頼: disk-usage-100 Sourcesの `below` のみ除去。
- 英語privacyは公開済み日本語規約の翻訳。報告機能の「準備中」説明は原文の状態説明であることを明示。運用設定が正常／有効であるとの新規保証をしない。

検証済み（最終差分のbuildと公開確認は追記する）:

- TypeScript、変更範囲oxlint、localized340。reference-data検査: 23ページ、週刊項目/出典/日付、18作品spec/判定、機器/症状ハブの対応。全GPU×Windows×RAM×18作品で英語と日本語の判定結果一致。
- 保存・読書リスト・GPU型番判定・statusの既存テスト成功。既存searchテストの古いzh/es検索なし前提を、既に公開済みの各言語検索維持の確認へ更新。英語検索231実在URL。
- build成功、608静的HTML、590 sitemap、530 OG。134記事6545内部リンク/アンカー、tools80参照、Windows診断0.6.0ダウンロードidentity不変。残23のsitemap、日英20組40ページの静的metadata/hreflangと英語HTML/OG/schemaを確認。contact/status/directoryはbrowserでliveルート確認。
- 25ページ×375/390/430/1180/1440px =125画面: 200、h1、main lang、canonical、横はみ出し、混入、ページ内リンク、JS/CSSを確認。`/tmp/references-browser.json`。
- local fixture POST5回、本番書込み0。contact未入力/失敗/15秒timeout/入力保持/再送/成功、募集の必須選択/API列挙値/失敗/成功、一覧空/掲載あり/英語検索/一致なし、Hz中断/完了、記事保存→reading list、PC登録→比較、ノート作成/再読込/削除取消/削除。`/tmp/reference-flows.json`。
- OG23枚の一覧と機器OG原寸、375/1440pxのページ画面を目視。測定結果や実機性能の検証とは区別。
- 初回buildはENOSPC。停止済み・公開QA完了済み3バッチの再生成可能なdistのみ削除（source、未公開変更、QA記録は保持）。次のbuildはCloudflare import問題で失敗し、上記API方式へ修正後成功。

公開後確認と全英語235 URLの結果は全体QA台帳に記録する。他言語の追加翻訳・bootstrap・credential・cron操作は行わない。

最終検証:

- 最終TypeScript・build・prepare・静的検索資産・英語記事/tools/OG検査はすべて成功。534 OG（操作画面4枚追加）、608 HTML、590 sitemap。
- 全英語235 URLを375/1440pxで470画面確認。PC巡回途中のChromium page crash後に影響118 URLを20件ずつ新contextで再検証し、未確認を残していない。ページ応答、h1、main言語、canonical、横はみ出し、可視日本語、ページ内リンク、JS/CSS失敗0、API書込み0。`/tmp/all-english-browser-combined.json`。
- 全235 URLの10,929内部リンク・75画像/CSS/JS資産を検査。既存 `/en/guide` → 存在しない `/en/games` を `/en#games` へ修正。残るローカルHTTP500は日本語 `/discord-servers` のCloudflare D1専用モジュールによるNode環境制約で、本番結果とは扱わない。親ブラウザで確認待ち。
- `/en/my`・`/en/my-games`・`/en/reports` の日本語継承OGを英語化し、申請画面も含め4枚の専用OGを追加。4画面ともnoindexを保持。最終ビルドでheadを確認。
- 最終差分は実クリック再検証: guide→ゲーム一覧、英語記事→英語問い合わせとURLプリセット、マイページの翻訳ハブ未提供ゲーム保持、mobile menu→status、about日英切替往復、4画面metadata/noindex/OG。`/tmp/reference-final-deltas.json`。
- 既存My games transfer browserテストの英語390/1440pxケース＋共通復元ケースを再利用。全体backup/download/preview/reload/重複、旧ノート、不正/サイズ超過、preview競合、復旧journal、英語 `/my` 統合を確認。private request・JS/CSSエラー0。`/tmp/english-transfer-final.log` と検証コピー `.wrangler/transfer-review/results.json`。
- status未取得とOperationalの区別、過去予定の未確認表示、status/一覧の15秒timeoutをbrowserで確認。`/tmp/status-directory-en.json`。
- 最終型チェックの1回は137終了したため不合格として扱い、記録で完了を確認した旧英語QAサーバー7台のみ停止。メモリ上限1536MBを付けた型チェックとbuildを順に行い、正常終了を確認。ブラウザ・ビルドの終了前ログを成功判定に用いていない。
