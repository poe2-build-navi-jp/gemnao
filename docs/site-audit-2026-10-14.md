# 全サイト監査・修正候補（2026-10-14）

基準: `gemunao` / `997d925010d200bd14e7de3ddc913df8f28e2f13`。今回の対象は全サイト監査と再現した不具合の修正。commit・push・公開は行わない。

## 初回監査の範囲と証跡

68個のpage/routeファイル、467 prerenderエントリ（443 rendered / 24 skipped）、426 editorial snapshotsから具体的URLを列挙。445 HTML 200と意図的な404ページ1件をローカルで取得した。動的ID・APIを任意の実データで試すことはせず、ローカルの合成レコード・モック・専用SQLite fixtureで検査する。

- 445 HTML: title/h1、公開ページの自己canonical、私的ページのnoindex、実在・双方向hreflang、JSON-LD 865、内部リンク23,311、ローカル資産参照3,139、画像469、sitemap 405 URLを検査。欠けたローカルファイル・URL・静的アンカーなし。query依存アンカーはブラウザーで別検査。
- 全445ページのSSR HTML/CSS × 320/360/390/430/1440px = 2,225ケース: 横はみ出し・画像の読込失敗なし。スクリーンショットによるweeklyカード幅の別確認が必要だった。
- 全445ページを390pxでhydrateして検査: JS例外・CSS/JS非200・横はみ出しなし。4ページの画面外の遅延画像が未読込だったため、読込完了と壊れた画像を区別して再確認する。
- 34画面でaxe-coreのWCAG 2 A/AA・2.1 AAタグを検査。文字コントラストとリンクの視覚的識別に不備。自動検査の通過はWCAG完全準拠の証明ではない。
- 初回lint/typecheck/build通過。安全なNode検査80グループは67通過・13失敗。初回ブラウザー28コマンドは18通過・10未通過（うち1つは手動fixtureサーバーで、完了するテストではなかった）。失敗は実不具合、古い前提、依存不足、ローカルQA終了を切り分ける。

詳細証跡: `/tmp/gemnao-audit/`（crawl.json、html-analysis.json、visual-all.json、hydrated-all.json、accessibility.json、node-results.json、browser-results.json、logs、screenshots）。初回の相対URLを解決できない幅検査と、ローカルworkerdがメモリ上限で終了した後の接続拒否は無効な検査結果であり、正常判定にも本番不具合件数にも含めない。正しく解決するハーネスと再起動後に再検査済み。

## 確認済み不具合と修正方針

| 優先 | 再現・影響 | 修正 |
| --- | --- | --- |
| P1 | `/admin/contacts`、合成キーでPOST 200の後 `Cannot read properties of null (reading 'reset')`、一覧を取得せずログインのまま | await前にformを保持。二重送信防止・失敗/タイムアウト後の再試行・アンマウント中断を既存Discord管理と同じ方式で対応 |
| P2 | `/weekly`、1165pxでカード幅106px/高さ772px。TOCのない記事が220pxの左列に配置される | インデックス専用の1列レイアウト。号別ページのTOC/2列は維持 |
| P2 | EN/ES等のmy-gamesで日本語ゲーム名fallback、`Dragon`は0件 | 確認済みの多言語ゲーム名/ハブ名/翻訳記事名を優先。Steamの正式英語名fallbackとslug検索別名を補う。翻訳ハブ・動作環境は作らない |
| P2 | `/my`空の「症状に合う記事を探す」が `/#articles`、hydrate後target 0 | 実際の記事一覧 `/?view=articles#articles`へ修正 |
| P2 | 管理ログインAPIに数値tokenを合成POSTすると500 | 文字列型を確認して既存の認証拒否へ。認証条件・Cookie・キー・権限は維持 |
| P2 | 複数画面の青い小文字4.25:1、週刊ラベル2.8:1、注記/募集パネルも不足 | 既存配色の色相を維持して文字色を必要な範囲で濃くする |
| P2 | `/diagnose`の本文内リンクが色以外で識別できない | 常時下線を付ける |
| P2 | 鬼武者EN low-fpsがJAに追加された体験版FAQ/出典を欠く | SteamでDEMOの存在を再読し、FAQ・出典を補う。black-screenで1項目にまとめられた2操作を分け、STEP数値整合を維持 |
| P3 | EN記事の深いfragmentを直接開いた際、hydrate後のレイアウト変化でscroll-margin 24pxに対し100.64pxで止まる | 初期fragmentだけをhydrate後に整合。通常の手動スクロール/リンクを妨げないことを回帰検査 |

DD2のDark Arisen併記は誤情報として削除しない。[カプコン2026-09-02発表](https://prtimes.jp/main/html/rd/p/000006004.000013450.html)とSteamのDLC 2593290で2026年の拡張を確認済み。旧2016年タイトルとは別に現在の拡張も存在する。
ゲーム名fallbackは [DD2](https://store.steampowered.com/app/2054970/)、[Tales of Eternia](https://store.steampowered.com/app/3470960/)、[Dragon Quest Monsters](https://store.steampowered.com/app/3681610/)、[Dynasty Warriors](https://store.steampowered.com/app/3841510/)の正式英語名を実読。後者は日本語番号から推測せず、正式名 `DYNASTY WARRIORS 3: Complete Edition Remastered`を使用。鬼武者[Steam DEMO](https://store.steampowered.com/app/3974650/)は本編ページへリダイレクトし、DEMOダウンロード欄を確認した。

## 境界と未検証

外部URL1,528件の本文は全件再読していない。検索数・実機での成功率・ユーザー体験談は補っていない。ZH/ESホームの検索UI有無は既存の機能差であり、依頼外の新機能として追加しない。診断はnoindexでsitemap外の既存方針を維持。
DB/認証設定・権限・キー・GA・課金・IndexNow・Bing/GSCは変更しない。合成API応答のUI検査は、本番D1の状態や管理キーの有効性を検証していない。実iPhone/Safari・実ゲーム/BIOS・本番HTML/CSS/JS・本番メモリ挙動は未検証。この環境から本番へのCONNECTはプロキシ403で遮断されるが、サイト自体の403を意味しない。

最終差分・検証結果は作業完了時に下へ追記する。

## 追加で再現した停止と修正

公開のお問い合わせとDiscord掲載申請を合成POSTで保留し、Playwrightの時計を60秒進めても送信ボタンが無効なままだった。`/admin/search-demand`の合成GET保留も「読み込み中…」のままで再試行できなかった。証跡は `form-timeouts-baseline.json` と同名ログ・スクリーンショット。

前者2フォームは共通の15秒上限・同期的な二重送信ガード・アンマウント中断で復帰させ、入力を保持する。通信応答がない場合は受付済みの可能性を表示し、自動再送しない。確定503と通信不確実を区別する。検索集計は読込本文のJSON処理も上限の内側で行い、401/503/不正JSON・不正行で例外なく読込エラーと再試行を表示する。

ゲーム名は一覧だけでなくホームの続きカード・設定コピー・相談メモ/更新カードにも同じfallbackがあったため、`lib/game-display-name.ts`を共用した。既存の保存キー・スキーマ・保存済み値・ゲームslugは変更しない。

全445ページのaxe検査を完走すると、34画面の初回検査外だった7ページに追加のコントラスト不足があった。`/gear`・`/pc`の明るい背景でパンくずが2.08:1、Steam起動/クラッシュ/DirectX/コントローラー二重入力/BSODガイドのコード表記が4.46:1だった。背景を変えずに該当文字色を修正する。

自動判定不能だった155ページの`aria-prohibited-attr`を実ノードで確認すると、共通の進行状況`div.step-progress`がroleなしでaria-labelを持っていた。表示中のSTEP番号を伝える名前付きsectionへ変更する。見た目とSTEP値は維持する。これは自動検査の「incomplete」を正常と見なさず、実DOMを確認して修正した項目。

支援ノートのブラウザー検査も現行仕様に合わせた。STEPごとの「試したが直らない」が匿名回答を送る既存機能のため、A/B切替後の全POST件数ではなく、解決回答の重複防止と未解決回答のSTEP・最終フラグを別々に検証する。解決判定や匿名集計の仕様を変更してテストを通す修正は行わない。

進行状況の修正後に残った日本語トップの自動判定不能2ノードも確認した。検索例のcontainerを名前付きsectionにし、症状グリッドのgeneric divに付いた重複aria-labelを削除する。症状セクションには既存の見出しとのaria-labelledbyがあるため、名前は維持される。装飾矢印・○/△、コードの折返し、診断受付の文章、Discord募集の背景グラデーションは、自動コントラスト判定の限界を実DOMと現在のスクリーンショットで確認した。コード・文章の実際の重なり/欠落は見つからず、装飾矢印はaria-hidden、判定記号には説明がある。未検証の実スクリーンリーダー動作は完全準拠として断定しない。

相談ノートのゲーム選択肢にも日本語名fallbackが残っていたため、`components/solution-form.tsx`を同じゲーム名処理に揃えた。新しい保存形式やゲーム識別子は作らない。

管理画面の状態変更も追加検査した。お問い合わせPATCHとDiscord募集審査PATCHを合成応答で保留すると、60秒経過後も行のボタンが無効でエラー案内がなかった（`admin-updates-baseline.json`）。共通の上限付き通信に揃え、一覧の確認が終わるまで別行の変更を止める。完了を確認できないときは再読込で状態を確認する案内を出し、自動PATCHはしない。認証Cookie・APIの権限・実データは変更しない。

query表示も検査し、記事一覧の症状フィルターに同じgeneric divのaria-labelが残っていたため名前付きsectionに変更した。各ボタンの選択状態をaria-pressedでも伝える。フィルター条件・表示記事・URLのロジックは維持する。

## 公開承認前のローカル検証・引き継ぎ

この節は公開承認前の候補時点の記録。ローカル作業完了時、HEADとリモートgemunaoは開始時の997d925で、commit/push/公開・IndexNow/Bing/GSC提出は行っていなかった。

- 最終コードの全体lint・typecheck・build・diff check: PASS。426 editorial snapshots、405 sitemap URLs、345 OGが最新。OG対象のタイトル変更はなく、画像/manifestの差分なし。
- 安全なNode検査81グループ: 81 PASS。ブラウザー検査30グループ: 最終試行を統合して30 PASS。支援ノートの古い文言/匿名回答仕様と履歴遷移の待機を修正した検査を含む。最初の失敗はログから消していない。
- 診断は実ローカルSQLite/D1を使ったHTTPセッション・共有・失効・削除・定期掃除の検査と、ブラウザー18ケースPASS。本番D1への操作ではない。
- お問い合わせ/Discord管理ログイン各32、管理更新10、公開フォーム/管理読込15、ゲームリクエスト管理の10合成状態×4幅=40、メニュー/Escape/焦点/Hz測定中断・完了/セーブ場所リンク12ケースPASS。管理fixtureの審査は合成データだけで、実掲載・実記事生成・公開を行わない。
- weekly、/my記事一覧の復帰と履歴、EN/ZH/ESのゲーム名検索・追加/解除・相談ノートのゲーム選択を320/360/390/430/1440pxでPASS。最長の選択肢でもページ横はみ出しなし。
- 445ページの自動アクセシビリティ検査は違反0。追加のquery表示と最後の変更対象10ページも違反0、禁止されたgeneric aria-labelなし。自動判定不能のコントラストは実DOM/スクリーンショットで確認した。実支援技術の完全適合は未確認。
- 最終ビルドの直接Pages HTTP: 426ルート、HEAD/query/RSC/non-GET/私的ページの分離、404、無効contact 400、robots/ads/sitemap、既存ZIP3本のバイト一致PASS。UI再検査の一部はループバックの資産配信補助を使用したため、この直接Pages検査を配信振り分けの証跡とする。
- 初回の5幅全ページ検査2,225ケース、全445ページのhydrate検査と4ページのlazy画像decode確認、最終表示対象の再検査を併記する。端末エミュレーションを実スマートフォン検証として扱わない。

機能範囲: 公開記事/ハブ/ホーム/検索・症状フィルター/言語切替、あとで読む、マイゲーム・PC、設定保存/比較/コピー、実験ログ、続き/今日の候補/タスク/トラブル途中再開、全体/旧ノートbackup・競合/上限/中断復旧、支援ノートのA/B分離・保存/コピー・履歴、フォーム、管理読込/認証/更新、診断・共有/撤回、ツール・ナビゲーション。各機能は既存のモデル/回帰検査と追加の停止/失敗検査を組み合わせた。全入力/全ブラウザー/全現実状態を総当たりしたという意味ではない。

集約証跡は `docs/site-audit-evidence-2026-10-14.json`。詳細ログ/画像は `/tmp/gemnao-audit/` と `.wrangler/site-audit/final/`、ログイン画像は `.wrangler/contact-admin-review/` と `.wrangler/admin-login-review/`。最新版weekly画像を目視し、カードが本文幅を使って読めることを確認。Node用の固定SDK2.3.2とaxeは/tmpに導入し、repo内の検査用SDKシンボリックリンクは除去済み。package/lockfileを変更していない。再実行時は既存依存を使い、必要なPlaywright/SDKの検査依存だけを一時環境に用意する。

未検証: 実iPhone/Safari/Firefox、実スクリーンリーダー、実ゲーム/BIOS/OSクリップボード、本番ページ/API・実管理キー・本番メモリ挙動、外部出典1,528 URLの全件再読、別ビルドの旧local-beta UIと全状態総当たり。環境切断は復旧し、最後の保存済み差分と検査ログを再確認した。

公開手順: 最終差分レビューと再検証を終え、承認された43ファイルだけをcommit/pushする。同じSHAのCloudflare Pages配信成功を確認し、接続可能なら本番HTML/CSS/JSも確認する。DB/認証/GA等の設定変更やIndexNow/Bing/GSC送信は行わない。

## 公開承認後の最終差分レビュー（2026-10-14）

ユーザーの本番反映指示を受け、43ファイルの差分を再確認した。変更はこの監査で再現した表示・導線・通信停止・翻訳の不整合と、その回帰検査・記録に限る。管理ログインAPIの変更は不正なtoken型の401化のみで、同一Origin判定、実際のハッシュ検証、Cookie属性、既存権限は維持。最終レビューでは合成環境だけを差し替えて本物のroute/admin-auth/admin-cookieを実行し、通常文字列と前後空白付き文字列の成功、不正型/壊れたJSON/誤ったキーの拒否、別Origin拒否、HttpOnly/Secure/SameSite=Strict/Path=/・8時間期限の16ケースをPASSした。実キーや本番Cookieは使わない。

保存モジュール・キー・スキーマ・API送信payloadを差分で照合した。ゲーム名変更は表示/検索/コピー時の名前とoptionラベルだけで、既存ゲームslug・記事URL・保存IDは維持。旧保存値の移行や書き換えを追加していない。既存の全体バックアップ・旧ノート、設定、実験、プレイ計画、読書リスト、保存済み解決ノートの互換/破損/容量/競合/復旧検査6グループとcontact品質検査も再実行PASS。設定・DB・migrations・認証ライブラリ・匿名集計・GA・課金・IndexNow・検索エンジン提出・package/lockfileの差分はない。新規スクリプトの合成データは回帰fixtureとして残し、実ユーザーデータ・詳細ログ・スクリーンショット・一時依存はコミット対象から除外した。

範囲の正確な内訳: 445×5=2,225は**修正前**の保存HTMLからscriptを除いたJavaScript無効表示検査（320/360/390/430/1440px）。全445ページのhydrate検査は390pxの1幅であり、5幅全ページのhydrate検査ではない。修正後の全445ページaxeは390px、最後の変更後は影響する10ページ/query表示を再検査。全体Node81グループは全製品コード修正後に再実行済み。ブラウザー30グループは各検査の最新試行を集約した値で、30すべてを最後の軽微なaria/ゲーム名修正後に再実行したという意味ではない。最終製品変更の影響対象は別途再検査した（管理更新10、両管理ログイン各32、5幅の表示/導線/多言語ゲーム選択、検索/履歴、記事fragment25、読書ページ）。最終直接Pages HTTP426は全製品コード修正後のビルドに対して実施した。今回の最終レビューで製品コードを追加修正していないため、実認証テストと互換検査・全体lint/typecheck・diff checkを再実行し、すべてPASSした。

残る検証の境界: 実Safari/Firefox/実支援技術、本番DB/APIと実管理キー、全外部出典の再読は未確認。記事の初期fragment補正はfonts.readyと2フレーム後に一度だけ行い、ユーザー操作で中止する。さらに遅い外部応答による後続レイアウト変化は全組合せ検証していない。本番への接続制限が続く場合は配信成功チェックと直接アクセス未確認を区別して報告する。

## 変更ファイル

- `app/api/admin/discord-servers/login/route.ts`
- `app/diagnose/diagnosis.css`
- `app/globals.css`
- `app/weekly/page.tsx`
- `components/article-toc.tsx`
- `components/contact-admin.tsx`
- `components/contact-form.tsx`
- `components/discord-server-admin.tsx`
- `components/discord-server-submit-form.tsx`
- `components/game-settings-snapshots.tsx`
- `components/interactive-steps.tsx`
- `components/next-game-action.tsx`
- `components/reading-list.tsx`
- `components/search-demand-admin.tsx`
- `components/solution-form.tsx`
- `components/support-workspace.tsx`
- `components/wiki-home.tsx`
- `lib/localized/onimusha-articles-en.ts`
- `lib/my-games-data.ts`
- `scripts/check-admin-login-browser.mjs`
- `scripts/check-contact-quality.mjs`
- `scripts/check-diagnosis-integration.mjs`
- `scripts/check-game-request-manual.mjs`
- `scripts/check-home-return-paths.tsx`
- `scripts/check-localized-step-results.mjs`
- `scripts/check-my-games-page.tsx`
- `scripts/check-preview-bindings.mjs`
- `scripts/check-public-outcome-counts.mjs`
- `scripts/check-ranked-steam-guides.mjs`
- `scripts/check-safe-step-navigation-browser.mjs`
- `scripts/check-search-editorial.mjs`
- `scripts/check-search-my-games-browser.mjs`
- `scripts/check-support-browser.mjs`
- `scripts/check-support-case-switch-browser.mjs`
- `scripts/check-useful-navigation.tsx`
- `components/use-bounded-request.ts`
- `docs/site-audit-2026-10-14.md`
- `docs/site-audit-evidence-2026-10-14.json`
- `lib/game-display-name.ts`
- `scripts/check-admin-login-input.mjs`
- `scripts/check-admin-updates-browser.mjs`
- `scripts/check-public-forms-browser.mjs`
- `scripts/check-site-audit-browser.mjs`
