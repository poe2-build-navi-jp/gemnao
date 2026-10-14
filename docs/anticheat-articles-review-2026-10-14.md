# アンチチート関連記事3本：ローカルレビュー候補

確認日：2026-10-14。対象：`poe2-build-navi-jp/gemnao` / `gemunao`。
開始時に `git fetch origin gemunao` を実行し、最新 `ee4c38a` と一致するクリーンな作業ツリーから編集。コミット・push・公開・IndexNow・Bing/GSC提出は未実施。

## 追加内容

日本語と英語・簡体字中国語・スペイン語の計12 URLを、既存 `FollowupGuide` → 記事レジストリの方式で追加。

| 日本語パス（翻訳は `/en`・`/zh`・`/es` を前置） | ファイル | 対象 |
| --- | --- | --- |
| `/games/apex-legends/javelin-launch-error` | `lib/followups/apex-javelin.ts` | Javelinと明記された起動エラー |
| `/games/valorant/van-restriction-5` | `lib/followups/valorant-restriction5.ts` | 番号5に一致するメモリ整合性/HVCI確認 |
| `/games/valorant/van9005` | `lib/followups/valorant-van9005.ts` | TPM 2.0 → Secure Boot → メモリ整合性 |

`lib/followups/index.ts` に登録。既存6記事の全4言語に、最初の状態記録STEPからの分岐と関連記事を追加：`apex-launch.ts`、`apex-crash.ts`、`apex-network.ts`、`valorant-launch.ts`、`valorant-van9001.ts`、`valorant-van9003.ts`。これらの旧確認日はリンク追加だけで更新していない。

固有の冒頭結論、症状別入口、STEP、注意、FAQ、出典ラベル、確認日を4言語で整合。既存テンプレートにより自己canonical・相互hreflang・構造化データ・sitemapへ反映。`pnpm og:cards` で新記事12枚＋掲載症状（shortTitle）の追加・並び順変更に伴うハブ8枚を生成し、`lib/og-image-manifest.ts` を更新。ルートやSEO共通処理の変更は不要。

## 実読した一次情報

- [EA：Apex Javelin移行告知](https://www.ea.com/ja/games/apex-legends/apex-legends/news/javelin-anticheat-announcement)：9月29日移行、告知時点のApexはSecure Boot不要。
- [EA：Javelinのインストール・エラー別案内](https://help.ea.com/ja/articles/platforms/pc-ea-anticheat/)：まず再起動、番号と名指し製品に応じた確認。#119は提供元を特定して更新を優先。
- [Riot：RESTRICTION 5](https://support.riotgames.com/ja-jp/riot/penalties/error-van-restriction-5/)：番号5への適用条件。
- [Riot：メモリ整合性](https://support.riotgames.com/ja-jp/riot/support-tools/enable-memory-integrity/)：VBS実行中に加え、実行中サービスのHVCIも確認。CPU仮想化の有効表示だけで完了としない。
- [Riot：VAN9005](https://support.riotgames.com/ja-jp/riot/client/error-van-9005)：現在の確認順を採用し、旧VBS無効化を一般解にしない。
- [Riot：TPM](https://support.riotgames.com/en-us/riot/client/enable-tpm-20)・[Secure Boot](https://support.riotgames.com/en-us/riot/client/secure-boot-guide)：状態読取り、機種別案内、Legacy環境での注意を確認。
- メモリ整合性ガイドから [ASUS](https://www.asus.com/us/support/faq/1045141/)・[Dell](https://www.dell.com/support/kbdoc/en-us/000195978/how-to-enable-or-disable-hardware-virtualization-on-dell-systems) のリンク先本文も確認。記事では機種を特定したうえで公式ガイドのメーカー入口を利用する方針とし、全機種共通のBIOSキー操作に置き換えていない。

ソースは確認した日本語・英語URLを各言語でも共有し、リンク先言語をラベルに明記。未確認の現地語URLや検索数、成功率、体験談を補っていない。

## 検証結果

- `pnpm check:localized`：PASS、169ページ。STEP ID、翻訳・リンク方針を既存検査で確認。
- `pnpm typecheck`：PASS。
- 変更した10個の `lib/followups/*.ts` に対する `oxlint`：PASS。
- `pnpm build`：PASS。静的HTML 406ページ、sitemap 393 URL、OG 325ページ分が最新。
- `node scripts/check-editorial-snapshots.mjs`：PASS、406スナップショット。
- `node scripts/check-english-articles.mjs`：PASS、既存英語5記事・日本語対・248リンクの回帰検証。
- 追加のローカルQA：新規12 URLのhead内canonical/OG、相互hreflang、言語切替、sitemapの確認日、構造化データ、541内部リンク/アンカーを確認。既存6記事×4言語の新規記事へのリンク、8ゲームハブでの掲載を確認。
- Chromium + ローカルPages：12 URL × 360/390/1440px＝36ケースPASS。全ページHTTP 200 / STATIC、横はみ出しなし、ページJS例外なし、参照CSS/JSの非200なし。390pxの全12ページを撮影し、日本語とスペイン語の長文表示も目視確認。新OGも目視確認。
- トップ4言語、対象ゲームハブ、sitemap.xml、robots.txt、ads.txtのローカルHTTP 200を確認。
- `git diff --check`：PASS。

**全体lintは未完了**：`pnpm lint` は今回未変更の `tests/production-resource-inventory/pages-deployment-log.test.mjs` の17・24・35行で `typescript(no-floating-promises)` の既存3件により失敗。今回の範囲では修正していない。

環境補足：初回pnpm実行は依存自動確認の書込み先が利用できず失敗。以後 `pnpm_config_verify_deps_before_run=false` を前置して既存依存を使用。型検査に不足していた既定バージョン `@playwright/test@1.63.0` は `/tmp/gemnao-qa` に導入し、無追跡の `node_modules` から参照。package/lockfileは変更していない。

ローカルQA証跡は `.wrangler/anticheat-review/` に保存（非コミット）：`results.json`、12枚の390pxスクリーンショット、`qa.mjs`、`server.mjs`、コマンドログ。QAサーバーはリポジトリのD1バインディングを継承しない一時設定で起動。ブラウザーのAPI応答をテスト内で代替し、外部通信を遮断。DB・認証・GA・診断保存・既存キー・公開設定に変更なし。

## 未検証・公開前の次の操作

ゲーム実機での再現・修復、各PC/BIOS機種での動作、スマートフォン実機、本番配信は未検証。ブラウザー検査はデスクトップChromiumのビューポートによる確認であり、APIの実通信やGA計測の検証ではない。

記事と翻訳のレビュー後、明示的な公開指示を受けて最新リモートとの差分を再確認し、必要に応じて再ビルドしてコミット・push・配信へ進む。公開後は12 URLと内部リンク、head、CSS/JSの200、sitemapを再確認する。IndexNowの再送・新規送信およびBing/GSC提出は今回の禁止範囲であり、この候補に自動提出処理は含まれない。


## 独立レビュー（追加確認）

別担当 `independent_content_review` が新規3記事のja/en/zh/es全12版と公式5ページ、追加出典2ページを独立照合。内容・安全性は承認可。公開承認とは別であり、pushは保留。

- Apex全4版：告知時点のSecure Boot不要、原因の非断定、#119の提供元特定と公式更新優先を確認。BF6条件の流用や全アンチチート削除の一般化なし。
- RESTRICTION 5全4版：番号一致、VBS実行中＋実行中サービスHVCI、Home/Hyper-V項目なしを非対応と断定しない点を確認。
- VAN9005全4版：現行公式のTPM 2.0→Secure Boot→メモリ整合性、回復キー・バックアップ、Legacy/MBR・管理PC・デュアルブートの相談、TPMクリア禁止を確認。
- 翻訳間の安全条件の脱落、検索数・実体験・成功率の捏造は認められない。
- 軽微な指摘1件を修正：RESTRICTION 5日本語冒頭で、別番号のRESTRICTIONは番号に合うRiot公式記事、VAN9005は関連記事へ進むと明確化。関連記事に1/3/4があると読める曖昧さを除去。

対象HEADは `ee4c38a6aacbe2328fe95bf2b35bb5e71ef23df1`、branchは `gemunao`。候補は未コミットの作業ツリーに存在。
差分は計32ファイル（新記事3・既存記事6・登録1・OG manifest1・OG画像20・この報告1）。既存6記事をHEADのオブジェクトと構造比較し、意図した4言語の初回分岐文・STEPリンク・関連記事だけを除くと完全一致。無関係な既存内容変更なし。
OG20枚の内訳は新記事3×4言語＝12枚と、ハブ2×4言語＝8枚。ハブOGは登録記事のshortTitleを掲載するため、新規症状の追加と先頭側の並び順変更でテキストハッシュが変わる。数字だけの更新や無関係な画像再生成ではない。その他の既存OGハッシュは不変で削除なし。

軽微修正後も多言語169ページ検査、変更ファイルlint、ビルド、12ページのSEO・541リンク検査を再通過。変更した日本語ページは360/390/1440pxで再確認し、修正文の配信・HTTP 200・横はみ出しなし・JS例外なしを確認した。証跡：`.wrangler/anticheat-review/review-recheck.log`。本文・タイトル・STEPはこの1文以外変更なし。


## 公開承認後の準備

ユーザーの「解消して公開まで進んで」という明示承認を受領。最新 `origin/gemunao` は引き続き `ee4c38a6aacbe2328fe95bf2b35bb5e71ef23df1` で、競合する更新なし。
既存lint3件は `tests/production-resource-inventory/pages-deployment-log.test.mjs` の3つの `test()` を `await test()` とする最小修正で解消。関連テスト13件、全体lint、型検査はすべてPASS。外部API処理や環境設定の変更はなく、総差分は当初32ファイル＋テスト1ファイルの33ファイル。
既存のPages連携による本番ブランチpushを使用する。IndexNow、Bing/GSC、DB・認証・課金・GA設定の変更は行わない。
