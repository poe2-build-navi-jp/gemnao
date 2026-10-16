# Community reports 本番準備と安全機能の検証

## 2026-10-16の統合候補

この節を現在の状態として優先し、以下の2026-10-15の記録は履歴として読む。
UI/API候補38ファイルを `2501d2758dcde9dd98184f4be265a571cbe869e1` にローカル統合した。
既存21ファイルのバックエンド／スキーマ、最新記事と4言語の翻訳、元の未公開56ファイルは保持している。
専用D1・guard・cleanupとPages接続は既に完了している。古いsetupの再実行や既存DBへのmigrationは不要。

初期化の一時許可は別の保護run `38942924014`（`bootstrap-open`、同じSHA、初回attempt）で本人のEnvironment承認待ち。
このUI/API候補を先にpushして初期化runのソース範囲を変えない。初期化とUUID固定・bootstrap閉鎖の完了後、
その最新コミットへUI/API差分だけを統合し直す。root設定・phase record・実UUIDを古い状態に戻してはならない。

候補のローカル検証はSQL/API32群、自動運用12群、関連unit34件、lint・型検査・ビルド、4言語のSTEP／
マイゲーム／バックアップの回帰検査を通過した。ビルドは記事438、sitemap417 URL、OG357ページを維持。
ブラウザのAPI・編集・削除は独立した一時SQLite fixtureのみで検証し、本番報告や使用量の合成データを作らない。
ローカルのUI公開確認は17 URL・59 assets、healthは未設定を503で示し、受付・公開の両方falseだった。
これらは本番利用量・監視到達・実運用の成功を証明するものではない。

一般受付の開始条件は引き続き未充足：実アカウント全体の使用量・単位・完全性／鮮度、実profile、
定期取得とcleanup、外部health監視と通知到達の確認が必要。設定不足・未確認をゼロや正常に置き換えない。
現在の自動collectorには固定アカウント向けの `Account Analytics Read`、`Workers Metadata Read-Only`、
`D1 Read` が必要で、専用cleanupの `REPORTS_CLOUDFLARE_READ_TOKEN` への登録は別の具体的承認を要する。
既存の書込み可能なsetup tokenをruntimeへコピーしない。新しい発行・登録・永続アクセス拡大はまだ行っていない。
本番の実データ削除やcron開始もこのローカル統合では行っていない。

確認日：2026-10-15。対象は利用者の不具合報告、本人編集・削除、出典・検証日・状態表示、運営審査、マイゲームからの再開。基準は `gemunao` の `beca48964d3129f2464d97741a355b1e58ea0f0e`。このコミット自体は昨日公開した成長施策で、今回の報告機能の公開実績ではない。

**報告機能本体は未コミット・未push・未配信。読取りpreflightのworkflow・script・testだけ3ファイルを `9f5ca3d46f3c8328c28941f2f2fcb2d64412f70a` でpush済み。既存の `[CF-Pages-Skip]` を使用。本番リソース、binding、鍵、権限、課金、受付フラグを変更していない。** Cloudflareの本人確認後に一般的なログイン失敗が発生し、親スレッドで認証再試行を停止。使用量の全項目、空きDB・Worker・cron枠、実通知先が未確認のため、本番受付を開けない。

元の35ファイル候補は `.wrangler/community-reports-review/pre-activation-manifest-2026-10-15.json` と `pre-activation-35-files.patch` に保全済み。旧記録は [community-reports-review-2026-10-14.md](community-reports-review-2026-10-14.md)。以下は追加安全機能の現在の状態で、旧記録の未実装事項はこちらを優先する。

## 読取りpreflightの最新状態

2026-10-15、既存ログインのGitHub UIで親担当が一度だけdispatchした。[run 38683298759](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/38683298759) は `gemunao`、SHA `9f5ca3d46f3c8328c28941f2f2fcb2d64412f70a`、初回attempt。GitHub APIの承認履歴は `gemnao-d1-production` の `approved`、pending deploymentsは空配列で、本人承認の反映を確認した。gate job `116252424349` は成功、discover job `116252464347` は失敗。12:10:50 UTCの固定エラーは **`NAMESPACE_LIST_HTTP_403`**。再dispatch・承認代行・保護設定変更はしていない。以下のCLI失敗・承認待ちの記述はそれ以前の履歴で、現在はこの節を優先する。

同じコミットの逐次処理と照合し、既存tokenによるD1一覧の完全性検査、Worker一覧の形式・上限検査、cron列挙loopは通過したと分かる。ただし成功値・件数を途中ログへ出す方式ではないため、実件数やcron呼出し数、空き枠、使用量は確認できない。Workerが0件ならcronへのHTTP要求は0件なので、loop通過をcron API権限の実証と取り違えない。DO namespace一覧のGETでHTTP 403となり、GraphQL schema/settingsへは到達していない。**DO数・Analytics権限・dataset可用性・実使用量・単位・coverageは未証明で、受付は閉じたまま。**

固定アカウントID `6a09a32cba1288cccce5912015086a35` は32文字で、既存のproduction resource inventory・D1 control・game request inventoryの指定と一致する。画面で選択中の本番accountやtokenの実policyまではこの環境から閲覧できていない。根拠があるのはコード間の一致と対象URLでの先行API処理通過だけで、別accountの同名資源との照合まで完了したとは扱わない。

### 403の切り分けと最小の次操作

拒否はCloudflare対象URLへのHTTP応答403であり、以前のGitHub CLIの接続段階のForbiddenとは別。コードは生のproviderエラーやheaderを保持・出力しないため、Cloudflare側の詳細code/messageは残っておらず、scope不足・resource制限・その他の制約のどれかを断定できない。D1/Workersの前段処理通過からtoken全体の恒常的な無効だけでは説明しにくいが、実policyの代わりにはならない。

[Worker一覧](https://developers.cloudflare.com/api/resources/workers/subresources/scripts/methods/list/) は `Workers Tail Read` も受理する一方、[DO namespace一覧](https://developers.cloudflare.com/api/resources/durable_objects/subresources/namespaces/methods/list/) にはこの権限がない。両方が受理する `Workers Metadata Read-Only` や `Workers Scripts Read` の実保有・resource範囲は未確認で、Worker一覧成功だけでDO権限ありとは言えない。`Workers Tail Read` だけだったというのは候補の説明であり、実際のtokenの権限と断定しない。公式の[account token対応表](https://developers.cloudflare.com/fundamentals/api/get-started/account-owned-tokens/) はDO・D1・Workers・Account Analyticsに対応するため、account tokenであることだけを失敗原因としたり、user tokenへの作り直しを求めたりしない。

次は**既存tokenの表示だけ**を確認する。ユーザーtokenならCloudflareの `My Profile > API Tokens`、account tokenなら対象accountの `Manage Account > Account API tokens` から、GitHub Environment `gemnao-d1-production` の既存 `CLOUDFLARE_API_TOKEN` に登録したtokenの権限概要を開く。[公式の画面案内](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) と [account token案内](https://developers.cloudflare.com/fundamentals/api/get-started/account-owned-tokens/)（2026-10-15確認）を参照。tokenの特定には既存の運用記録を使い、名前だけで推測・置換しない。

確認する非秘密項目は、token名／種類、有効状態、権限一覧、Account Resourcesの対象と除外条件、特定Worker限定の有無、TTL、有効開始・終了時刻、Client IP Address Filtering。対象accountはWorkers & PagesのAccount DetailsにあるAccount IDと固定IDを照合する。[Account IDの公式確認手順](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/)。表示のために編集画面を開く場合も保存・権限追加・更新・roll・削除は行わず、token文字列やAuthorization headerは確認・転記しない。

| 用途                                             | 最小の読取り権限として確認するもの                                                                                                                           | 今回の実証範囲                                              |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Worker・cron・DOのmetadata一覧                   | 対象accountの `Workers Metadata Read-Only` を優先。APIが受理する `Workers Scripts Read` はより広い代替で、追加を自動承認しない                               | DO一覧は403。Worker一覧通過だけでは実scopeが分からない      |
| D1一覧metadata                                   | 対象accountの `D1 Read`                                                                                                                                      | 対象GETと完全性検査は通過。実policy名・件数・空き枠は未確認 |
| Account Analyticsのschema/settings・後続の使用量 | `Account / Account Analytics / Read`。[公式設定案内](https://developers.cloudflare.com/analytics/graphql-api/getting-started/authentication/api-token-auth/) | 今回は要求前に停止し、可否は不明                            |

権限が足りない場合は不足する具体的な読取りscopeとaccount範囲を提示して別承認へ進む。既に満たす場合も本runの403を成功に読み替えず、provider側の制約・tokenのresource policyなどを追加で切り分ける。今回、新token・権限拡張・secret登録・再実行・料金や本番資源の変更は行っていない。

独立したローカル検証として、同じ公開済みscriptへ合成のD1/Worker/cron成功→DO namespace HTTP403を返すmockを注入。`NAMESPACE_LIST_HTTP_403` で停止、GraphQL要求0、拒否body読取り0、秘密値や生bodyの出力なしを確認した。HTTP要求6件はすべてmockで、本番要求0。確認scriptは `/tmp/gemnao-preflight-namespace-denial-check.mjs`。providerの実権限・実値の証明ではない。

全使用量とprovider coverageの意味が確認できるまでprofileを作らずVERIFIEDをOFFに保つ。専用DB・guard/cleanup・初期100件・審査・30日本文削除・端末内所有者キー・削除／復旧・通知・自動停止の本番検証は依然として別条件であり、preflightだけで投稿受付を開始しない。読取り結果と根拠は `.wrangler/community-reports-review/preflight-publication-receipt-2026-10-15.json` に記録した。

### ユーザー画面の既存tokenとsecret名の照合

親担当が直接閲覧したユーザー画面の転記を受領。Cloudflare token表示名は `gemnao-preview-data`、権限は `D1 Edit`・`Cloudflare Pages Read`・`Workers Scripts Edit` の3項目、Account Analytics Readの表示なし、Client IPフィルタ空欄。Account Resourcesにはユーザーのaccount名があるが、32文字IDとの画面照合は未確認。この担当は元画像を直接見ておらず、実run時刻のpolicyと同一とも未証明。画面を保存・変更していないと受領した。

実run SHAの[workflow49行目](https://github.com/poe2-build-navi-jp/gemnao/blob/9f5ca3d46f3c8328c28941f2f2fcb2d64412f70a/.github/workflows/community-reports-preflight.yml#L49) は `secrets.CLOUDFLARE_API_TOKEN` を使い、jobのEnvironmentは `gemnao-d1-production`。一方、既存preview controlの[SETUP](../ops/feedback-preview/live.mjs) とworkflowはEnvironment `gemnao-preview-data` 内の別名 `GEMNAO_PREVIEW_CLOUDFLARE_API_TOKEN` を使う。コード・README・該当命名のgit履歴・ローカルの非秘密レビュー記録を調べたが、Cloudflare表示名を今回の `CLOUDFLARE_API_TOKEN` と結び付けるtoken ID／表示名の記録は見つからなかった。表示名とEnvironment名が一致することはsecret値の一致を証明せず、別名のsecretだから値が違うとも断定しない。

GitHubは同名secretが複数階層にある場合Environmentを優先し、その次がrepository、organization。[公式仕様](https://docs.github.com/en/actions/reference/security/secrets)。コードだけでは実際にどの階層から解決されたかや、Cloudflare上のどのtokenかは分からない。既存GitHub UIでは `Settings > Environments > gemnao-d1-production > Environment secrets` の `CLOUDFLARE_API_TOKEN` の名前と更新日時だけ確認する。Environmentに同名がない場合は既存repository側の `Settings > Secrets and variables > Actions` の同名metadataを確認する。秘密値取得・置換・preview用への参照変更は行わない。更新日時だけでも対応を確定できなければ、既存の運用記録か次の監査記録が必要。

公式の[Edit権限の説明](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) はread/listを含み、[DO namespace endpoint](https://developers.cloudflare.com/api/resources/durable_objects/subresources/namespaces/methods/list/) は `Workers Scripts Write` を受理する。したがって画面のtokenが本当に当該runのtokenで、対象account／run時policyも一致するなら、単純にWorkers Readを重ねて足せば直るという説明には根拠がない。これまでのTail Readのみという候補は、今回の画面tokenには当てはまらない。実効secretが別、画面の対象accountと固定IDが別、実行時policyが別、provider側の拒否条件などの区別が残る。

最小の次操作は、既存ログインのCloudflare UIで対象accountの `Manage Account > Audit Logs`（v2）を **2026-10-15 12:09–12:12 UTC** に絞って読むこと。`view` を除く既定フィルタを外し、APIのGET `/accounts/<固定ID>/workers/durable_objects/namespaces` と先行のD1／Worker GETがあれば、`actor.token_name`・`actor.token_id`・`raw.uri`・`raw.method`・`raw.status_code` の非秘密metadataを照合する。[画面とview filter](https://developers.cloudflare.com/fundamentals/account/account-security/audit-logs/)、[APIのtoken名／ID fields](https://developers.cloudflare.com/api/resources/accounts/subresources/logs/subresources/audit/methods/list/)（2026-10-15確認）。fieldsは任意で一部endpointは対象外なので、見つからなければ対応や原因を未確定のままにする。この調査のためにAccount Settings Readを追加したり、既存secretを読み出してaudit APIを呼んだりしていない。ログの生のrequest/response body、個人情報、Authorizationは扱わない。

**現段階の変更案は設定変更ゼロ。** 対応が証明できた場合、画面で不足している後続GraphQL用の `Account / Account Analytics / Read` 1項目を同じ固定accountに限って追加する案が別承認候補になる。ただしこの欠落はnamespace GET403の原因ではなく、追加だけでpreflight全体が通るとも言えない。先にDO403の根拠を確認する。追加のWorkers Edit／DO書込み、secret置換、新token作成、課金変更、再実行、報告受付は行わない。生provider理由の取得が後で必要になった場合は、安全な数値code等に限定した診断と実行範囲を別レビューし、今回の禁止条件を迂回しない。

### 実runのaccount tokenが特定された後の最小案

親担当が追加で確認した既存account tokenの表示名は **`gemnao-github-d1`**。編集URL末尾の識別IDと、当該時刻の監査ログのactor側token識別IDが一致したと受領した（IDはsecret値ではない。詳細receiptに記録）。この担当はその画面を直接見ておらず、親の直接確認を根拠として扱う。前節の `gemnao-preview-data` は別候補で、今回のtokenとして採用しない。

同tokenの現在の権限はaccount全体の `Pages Read` と `D1 Read/Write` の2枠だけ、有効期限なし、IPフィルタ空欄と受領した。Workers metadataとAccount Analyticsの読取りは未設定。namespace GET403に対して、今回はこちらの実token側の不足を確認対象にできる。ただし追加後の成功や実scopeは実行前に推定しない。

本人の明示承認後に限る最小追加案は、同じ固定accountだけの **`Workers Metadata Read-Only`** と **`Account Analytics Read`** の2つ。前者は[namespace一覧APIの受理権限](https://developers.cloudflare.com/api/resources/durable_objects/subresources/namespaces/methods/list/)に明記され、Worker一覧・cron metadataの公式受理権限とも一致する。後者の3選択UI表記は `Account > Account Analytics > Read`。[公式Analytics設定](https://developers.cloudflare.com/analytics/graphql-api/getting-started/authentication/api-token-auth/)。account tokenの権限行でMetadataの候補が実際にどう分割表示されるかは未確認なので、存在しないメニュー名を案内しない。正確な `Workers Metadata Read-Only` が見当たらなければ保存せず確認し、より広い `Workers Scripts Read` やEditへ自動で置き換えない。`Individual Workers` の範囲ではaccount全体の完全な列挙を証明できないので、今回の固定account範囲を保つ。

操作案は既存 `gemnao-github-d1` の編集画面で2権限を追加し、既存Pages/D1、対象account、IP、期限を意図せず変えていないことを概要で確認してから、承認範囲に従って既存tokenを更新すること。新token作成・roll・secret再登録はこの案に含めない。2026-10-15 12:58 UTC、ユーザーは同accountの同tokenへこの2権限だけ追加することを承認した（親から受領）。Cloudflareログイン済みのユーザー自身が既存編集画面で操作予定で、保存完了は未確認。より広いWorkers Scripts Read／Edit、新token、secret変更、再dispatchはこの承認に含めず実行していない。成功後も実使用量・単位・coverage・削除／復旧等の本番開始条件は別に確認する。

### metadata失敗箇所を限定表示する診断修正

本人から2権限を追加したと申告があり、新run [38741315353](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/38741315353)（同じ `9f5ca3d46f3c8328c28941f2f2fcb2d64412f70a`）を確認。gate成功、discoverは13:18:05 UTCに `METADATA_READ_FAILED` で停止した。この旧scriptのログだけでは失敗したmetadata endpointや成功／失敗envelopeの形を区別できない。最新policyの保存内容をこの担当が独立して確認したことにはしない。

13:22 UTC、ユーザーは診断専用コード修正の反映と読取りworkflowの新規1回実行を承認。専用worktreeから **`b0a2e3d6ddd55e3c735e051b34862b3d9d6db86d`** をpushした。変更は `ops/community-reports/preflight.mjs` と `tests/community-reports/preflight.test.mjs` の2ファイルだけ。[CF-Pages-Skip]を用い、workflow・本体55ファイル・保護・権限・secret・本番設定は変更していない。remote SHAとcommitの変更2ファイルをGitおよびコネクタで確認した。

失敗出力は固定endpoint label、HTTP status、envelope／success／errors／resultの型、boolean success、最大8件のエラー要素にある0–999999の整数codeだけ。body全文・headers・URL・account ID・resource名・provider message・秘密値を出さない。HTTP失敗時はbody／headersを読まない。元の厳密なREST envelope条件を4つの固定metadata endpointに対するrequest内へ移し、同じ不合格応答をendpoint別コードで停止する。代替envelope受理やerrors抑制はせず、GraphQL範囲やrunattempt／本人承認gateも維持する。出力できる例外を内部の固定失敗型に限り、外部例外や偽のdiagnostic propertyは `READ_FAILED` にする。

Nodeテスト10件（既存6＋診断4）、Node構文確認、diff検査PASS。各metadata endpointのHTTP200失敗envelope、null／array／scalarや欠落、非数値・範囲外code、403でのbody/header非読取、機密canary・resource名・外部例外の出力除外をmockで確認。Cloudflare本番へテスト要求はしていない。ローカルprettierは存在せず依存追加は行わなかった。製品変更がないためビルド／UI検査の再実行はせず、診断だけを検証した。

CLIの `gh workflow run community-reports-preflight.yml --ref gemunao` は一度だけ試したが、workflow metadata GETがForbiddenでdispatch POSTへ進まなかった。全78件のrunをコネクタで読み、新SHAのrunは0件と確認。新規run／承認待ちURLはまだない。次は親の既存ログイン済みGitHub UIで[対象workflow](https://github.com/poe2-build-navi-jp/gemnao/actions/workflows/community-reports-preflight.yml)を `gemunao`、新SHAで1回だけRun workflowし、本人が `gemnao-d1-production` を承認する。古いrunのrerunや権限追加で迂回しない。

記録は `.wrangler/community-reports-review/preflight-diagnostics-publication-2026-10-15.json`。主作業treeのHEADと他差分は保持し、元の2ファイルが公開前hashと一致することを確認してから、新診断コードを主作業treeへ同期した。未公開本体のpatch／hashは歴史記録として保持する。受付開始はしていない。

### namespaceのerrors:null互換性修正

診断run [38743328039](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/38743328039) は `b0a2e3d6ddd55e3c735e051b34862b3d9d6db86d`、gate成功、discover失敗。固定診断は `NAMESPACE_LIST`、HTTP200、`success:true`、`errorsType:null`、`resultType:array` だった。DO403はこのrunで解消した一方、旧判定がerrors配列以外を拒否していた。[公式namespace一覧reference](https://developers.cloudflare.com/api/resources/durable_objects/subresources/namespaces/methods/list/)を確認したが、errorsは配列表記でnullは明記されていない。この点を一般的な公式仕様と偽らず、承認済み実runで観測した当該endpointの差異にだけ対応する。

**新commit `3d2f8d9d57ca41614882841062e44950e0702d63` をpush済み。** 本番コードの差分は `preflight.mjs` の11行だけ（コメントを含む）。`NAMESPACE_LIST`、HTTP200の場合に限り `errors:null` をerrorなしの表現として許容し、`success:true`、result配列、paginationのtotal_count一致を満たす必要は維持する。他のmetadata APIには適用せず、errors欠落・非空配列・不正型、HTTP異常、成功フラグ欠落・false、不正result、不完全paginationは止める。GraphQL要求範囲・診断出力・承認gate・runattempt制限・権限・secretは変更していない。

変更ファイルは `ops/community-reports/preflight.mjs` と `tests/community-reports/preflight.test.mjs` の2つ。tests13群PASS（追加3群、namespace拒否17ケース＋他3 endpointのnull拒否＋空／非空完全一覧の受理）、Node構文・diff検査PASS。未公開本体55ファイルを含めず `[CF-Pages-Skip]` で反映し、remote SHAと変更ファイルをGit／コネクタで確認した。主作業treeは前回公開hashと一致する2ファイルだけ新状態へ同期し、HEADと他差分は保持した。

既知のCLI workflow GET Forbiddenを繰り返さず、今回はdispatchを試していない。全79runに新SHAのrunは0件。重複を避け、親の既存GitHub UI担当が [preflight workflow](https://github.com/poe2-build-navi-jp/gemnao/actions/workflows/community-reports-preflight.yml) を `gemunao`／この新SHAで新規1回実行する。本人Environment承認は代行しない。実schema/settings、実使用量、coverage、受付開始条件はまだ未証明。記録は `.wrangler/community-reports-review/preflight-namespace-null-publication-2026-10-15.json`。

### preflight成功後の実集計読取り候補（未公開）

[run 38745059313](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/38745059313) は `3d2f8d9d57ca41614882841062e44950e0702d63`、初回attemptでgate／discoverとも成功。コネクタでrun・job・成功出力を確認し、metadataReadable／accountAnalyticsReadableはtrue、8datasetはenabledだった。usageValuesVerified／profileVerifiedはfalse、productionChanged／secretsExportedもfalse。実使用量やcoverageの証明とは扱わない。

成功ログのdatasetsにはfilter名だけがあり、sum／max／dimensionsが全8datasetで欠けていた。現在の型introspectionは深さが足りず、GraphQLの `NON_NULL > LIST > NON_NULL > OBJECT` を最後までたどれない可能性が高い。未公開候補ではofTypeの固定深さを増やし、実際のfield名とsettings.availableFields・maxPageSize・maxNumberOfFields・maxDuration・notOlderThanを確認してから集計queryを作る。schemaや権限・上限が不明なら集計を送らない。

候補は `/tmp/gemnao-usage-probe-review-20261015` の5ファイルだけで、公開済みコードや未公開本体55ファイルへ混ぜていない。workflowは既定 `discover` を保ち、明示的な `usage` 選択時だけ同じ保護Environment内で追加のGraphQL queryを1回送る。repo／branch／first attempt／本人reviewer／権限／既存secretは維持する。新DB・課金・cron・受付・profile設定へ書き込む処理はない。**未commit・未push・未dispatch、本番集計要求0。**

| 限定query                                                  | unitの根拠と出力の意味                                                                                                                                                                         |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| workersInvocationsAdaptiveのsum.requests                   | [公式query例](https://developers.cloudflare.com/analytics/graphql-api/tutorials/querying-workers-metrics/)。要求された期間のprovider request集計値。無料枠の課金対象requestsと同じだとは未証明 |
| d1AnalyticsAdaptiveGroupsのsum.rowsRead／rowsWritten       | [公式D1 metrics表](https://developers.cloudflare.com/d1/observability/metrics-analytics/)の行数。query本文やd1Queries datasetは読まない                                                        |
| d1StorageAdaptiveGroupsのmax.databaseSizeBytes＋databaseId | 同じ公式表でbytes。全DB IDとの一致を内部で検査し、DB別の期間最大値の合計と最大だけを出す。異なる時点の最大値なので現在の同時点保存量とは呼ばない。ID・名前は出さない                           |
| durableObjectsInvocationsAdaptiveGroupsのsum.requests      | [公式DO query例](https://developers.cloudflare.com/durable-objects/observability/metrics-and-analytics/)。WebSocket等の集計タイミングや課金requestsとの同値は未証明                            |

UTC当日00:00から取得時刻の2分前までを固定windowとし、UTC切替直後は停止。2分待つこと自体はcoverageの証明にしない。空配列は不明で、明示された数値0と区別する。GraphQL partial errors、欠落・異常数値・切捨て疑い・別account・DB重複／不一致は停止する。全DBの保存量が揃わない場合は保存量をnullにし、合計を捏造しない。出力は限定数値・既知unit・資源件数・要求window／取得時刻・追加確認用DO schema field名だけ。投稿、個人情報、SQL、objectId、scriptName、namespaceId等の個別活動dimension、生body／headers／provider message／secretは出さない。

DOの課金GB-duration、SQLite行read/write、保存量はfield／unit／合計方式がまだ証明できないのでqueryを推測せず、未照会の4指標として明示する。実schemaのsum/max/dimensions名を次の判断材料として出すが、それだけでunitやcoverageを認定しない。[settings資料](https://developers.cloudflare.com/analytics/graphql-api/features/discovery/settings/)のnotOlderThanは保持期間、maxDurationはquery期間上限で、集計完了時刻ではない。[Workers資料](https://developers.cloudflare.com/workers/observability/metrics-and-analytics/)も直近数分の集計遅延を明記する。公開資料と現在の成功出力からprovider watermarkは証明できておらず、最終活動時刻・query end・HTTP Dateで代用しない。

このため候補は取得後も **usageValuesVerified／billingTotalsVerified／coverageVerified／profileVerified／profileCreated／authorizesActivationをすべてfalse、providerCoverageThroughをnullに固定**する。collectorへ渡す完全profileやruntime観測を生成せず、Pages／WorkerのVERIFIEDフラグも設定しない。

Native Nodeテスト21件、構文確認、diff検査PASS。深いtype wrapper、field accessと期間上限、単一追加query、本人gate維持、悪性値の出力除外、空配列と明示ゼロ、全DB照合・切捨て・partial errors・UTC切替、coverage／profileの未証明維持を合成応答だけで検証した。最初の統合fixtureにDO Invocations rootがなく意図どおり停止したため、実成功runに存在するrootをfixtureへ追加して再確認した。productの条件を緩めてテストを通していない。

差分とhashは `.wrangler/community-reports-review/usage-probe-candidate-2026-10-15.patch` と `usage-probe-candidate-manifest-2026-10-15.json`。ログは `/tmp/gemnao-usage-probe-tests-20261015.log`。次はこの5ファイルをレビューし、GitHub反映とusageを1回読む範囲が了承された後にだけPagesSkipでpush・本人Environment承認付き実行へ進む。現在使用量の推定や受付開始は行っていない。

## 14時台の公開準備：復旧とローカル検証完了、未公開

2026-10-15 14:13 UTCの「とりあえず公開できるようにまでやって」を受け、公開・受付開始をせず準備を再開した。Gitのls-remoteとGitHubコネクタは正常。公開済みHEADは `3d2f8d9d57ca41614882841062e44950e0702d63`。preflight [38745059313](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/38745059313) の成功も再確認した。新規dispatchやCloudflare設定変更はしていない。

未公開55ファイルは全件残り、保全した58ファイル版から公開済みpreflight3ファイルを除いて照合すると、54件は元hashと一致、差異1件はこの検証記録への追記だけだった。欠落は0。元35・48・58ファイルのpatch／hashは保持した。最新公開済みHEADを基準に `/tmp/gemnao-release-prep-20261015` へ55ファイルだけ復元し、usage-probe候補は別worktreeに保留した。主作業treeのHEADや既存差分をresetしていない。

検証中、元のPlaywright symlinkが削除済み `/tmp/gemnao-qa` を指していたため、lockfile固定の `@playwright/test@1.63.0` を `/tmp` に復旧し、release候補だけに依存overlayを作った。axe-coreは公式npm registryで版を確認し `4.14.0` を一時検査用に固定した。package.json／lockfileは変更していない。Wranglerのローカル設定・cache・logも `/tmp` に限定し、HOMEや既存認証storeを変更していない。テスト対象の本番資格情報は使わない。

最新preflightの拒否ケースfixtureに型推論エラーが1件あり、`tests/community-reports/preflight.test.mjs` にJSDoc tuple型を1行だけ追記した。runtimeや判定の変更はない。したがって完成候補は **元の55ファイル＋検証用1ファイル＝56ファイル**。この1行は別patchにも分離し、未公開55ファイルの保全範囲と区別できるようにした。元の製品コード54件は変更していない。

今回の復元先で実施した検証：

- SQL/API 32群、運用12群、Node単体29件PASS。初期100件、審査、本人編集／削除、期限、復元されたD1と独立削除印、停止条件を合成値と独立SQLiteで確認。本番DBには接続しない。
- lint・typecheck・build PASS。記事snapshot430、sitemap409、OG349を維持。最初のlintは欠落依存と上記fixture型で停止し、環境復旧と型注記後にPASS。buildが除いた追跡済み `.gitkeep` は復元済み。
- 多言語184ページ、翻訳114記事のSTEP整合、STEP UI、マイゲームのbackup／復元・旧ノート・SSR、記事430 HTMLのcanonical／言語／構造化データ／広告所有権タグの回帰検査PASS。
- ブラウザ：報告機能24フロー（4言語×320／390／1440pxを含む）、既存マイゲーム16言語幅ケース（320／360／390／1440px）PASS。報告機能は今回もJS例外・不良asset・横はみ出し・対象axe違反なし。APIは独立SQLiteへinterceptし、loopback以外の要求をabortした。本番投稿・GA送信0。
- ローカルPagesの19 URL、61 CSS/JSがHTTP200。報告ページno-store／noindex／CSP、sitemap除外、実API default-OFFを確認。healthは503／no-storeでintakeEnabled／publicEnabled false、observedAt／validUntil null、reason not-configured。要求の初回補助リストで存在しない `/en/my` を指定したため404になり、既存の実在 `/en/my-games` 等へ検査対象だけ修正した。製品URLは変更していない。
- guard／cleanup Workerのdry-run PASS。guardは15.01KiB（gzip4.17）、cleanupは24.96KiB（gzip7.22）。configはrepo外、実DB・DO・cron・secret登録なし。本番deployではない。以前の実local workerdでのDO永続化・再起動・削除印・失敗優先の証跡も保持しており、今回不変の製品コードと対応する。実Cloudflare復旧検証の代替にはしない。

前回確認した無料枠・当日余力とpreflight成功を引き継ぎ、同じ利用量画面を再要求していない。過去の数値を現在値や新しい30分leaseとして使っていない。usage-probeの追加反映／実行は保留し、実profile、provider coverage、実通知確認等は未証明のままにしている。受付・公開・予算・profile／monitorのverified設定はOFFを維持する。

**ソースの復旧・ローカル検証・レビュー用の公開候補作成は完了。本番で投稿を受け付ける条件までは未達。** 専用REPORTS_DB、guard／cleanupとbinding・instance、初回bootstrap、実削除／期限cleanup／復旧・停止・通知の確認が本番設定側に残る。現在確認済みのWorkers権限はmetadata読取りで、専用Workerの作成・配置を行う権限とは扱わない。実設定へ進む場合は、固定された2Workerやbindingの操作と必要な権限／本人の既存ダッシュボード操作を具体化してから扱い、今は権限拡張・新token・secret登録・DB作成・課金・cron・公開・受付開始をしていない。既存DB／認証／診断保存／キー／root本番wrangler設定は変更していない。

成果物は `.wrangler/community-reports-review/release-prep-55-files-2026-10-15.patch`（元55ファイル）、`release-prep-validation-only-2026-10-15.patch`（型注記1行）、`release-prep-full-candidate-2026-10-15.patch`（統合56）、`release-prep-final-manifest-2026-10-15.json`。ログは `/tmp/gemnao-release-prep-{sql,operations,unit,lint,typecheck,build,browser,my-games-browser,localized,guard-dry-run,cleanup-dry-run}.log`、HTTP結果は `/tmp/gemnao-release-prep-http-results.json`。Browser画像・結果は復元先 `.wrangler/community-reports-review/browser/`。IndexNow／Bing／GSC提出はしていない。

## 承認条件

親スレッドで「保存先と編集権限・自動削除の本番設定を進め、検証後に公開・受付開始していいですか？」への「いいよ」を受領。条件はFree継続、独立保存先、初期通算100件、公開前審査、重要編集時の再審査、初回受理から30日で本文削除、長期再掲載には別同意、所有者鍵はブラウザ内のみ、削除・通知・利用量停止・復元対策の検証後に開始すること。既存DB・cleanup・監視・認証・診断保存・課金を変更しない。新規資格情報や権限が必要なら対象操作を示して別確認する。

## 受領した部分的な使用量

2026-10-15 12:55 JST頃（03:55 UTC頃）、親スレッドがユーザー提供のCloudflareスマホ画面を読み取った転記を受領。Workers Usageは **Requests today 435 / 100,000**、Observability events today 0 / 200,000。画面の期間 October 1–15 の集計はRequests 81.58k、CPU time 627.06k ms。後者2項目は当日値として扱わない。

続いて2026-10-15 12:56 JST頃（03:56 UTC頃）のD1画像の転記を受領。Daily October 15–15はDB数6 / 10、read756 / 5M行、write16 / 100k行、Total storage 446.46 kB / 5 GB、Metered storage 2.48 kB-mo。DBを1個追加する空きはある。Metered storageは当日行使用量や現在保存量に置き換えない。

主担当は元画像を直接閲覧していない。全DB名・最大DB容量、Worker数・cron余力、DO使用量は未確認。全項目がないためRuntimeStateへ登録せず、30分の受付条件を満たす観測とも、自動停止の検証結果とも扱わない。ブラウザ認証の代替にはならず、受付は閉じたまま。

## 実装した安全機能

### 本人報告の長期転載を無効化

引用登録 `cite` はAPIで過去の再送判定より先に403を返し、管理画面のボタンも除去。投稿同意は初回30日間の報告用途だけで、別同意の画面・記録は未実装。静的記事への本人報告の転載を開始しない。

旧引用参照を扱う互換コードと合成テストは残すが、新規受付は空の独立DBから始め、このAPIで引用参照を作れない。旧記録の有限撤回期限・担当者通知は未実装。実記事への引用・撤回実績もない。

### D1と別の削除台帳

`ledger.ts` と `community-reports-guard.ts` はSQLite-backed Durable ObjectにID、期限、受付／削除状態、通算受付数、非秘密のinstance UUID、利用量観測を保存する。報告本文・所有者鍵・鍵ハッシュは保存しない。公開Workerは404で、named entrypoint `ReportsGuardService` へのservice bindingだけが台帳を呼ぶ。

本人削除は台帳更新を先に行い、その後D1を消去する。D1行が既に存在しなくても、IDの有効期間内は削除を記録する。後段のD1障害では成功表示せず、同じ削除を再送できる。D1だけを過去に戻しても、本人取得・編集・公開・審査は台帳を確認して削除本文を返さず、maintenanceが本文と履歴を再消去する。通算100件のカウンターもD1復元では戻らない。受付予約後のD1失敗は保守的に1枠を消費し、同じIDの再送では二重消費しない。

本文の期限は初回受理から30日で、編集では延長しない。ID別台帳情報は発行から31日で失効し、次の照合・毎時maintenanceで消去する。これは24時間の送信準備期間を含む本文の最長期限を覆う。集計カウンターとinstance UUIDは残す。本文は期限直後から取得不可、物理消去は次の成功したcleanup。provider障害や枠超過中の物理削除は遅れる可能性があり、本人削除も失敗を成功表示しない。

PagesとcleanupにはD1外で `REPORTS_GUARD_INSTANCE` を固定する。instance不一致はDOトランザクションの変更・pruneより前に拒否する。台帳消失・不一致・台帳にない有効なD1行があれば停止。通常のmaintenanceは初期化しない。

**D1と台帳の同時復元・台帳そのものの巻戻しに対する完全な保証はない。** 初期運用では両方の過去復元・過去bindingへの切戻しを禁止する。疑いがあれば受付・公開・予算をOFFにし、削除状態を証明できるまで再開しない。Cloudflare管理者の既存権限を変更したものではない。

### 利用量観測の30分失効と再送制御

純粋な計算 `assessUsage` を `runtime.ts` と台帳の受付判定へ接続した。互換の手動経路は既存管理者認証で同一originの `POST /api/admin/reports-control` に `{ "state": "RuntimeStateのJSON文字列" }` を送る方式。自動モードではこのHTTP経路は空stateによる緊急停止だけを受理し、手入力をcollector由来と名乗らせない。常設用の自動取得は後述のローカル実装を追加済みで、実Cloudflareへの接続・API鍵作成は未実施。

観測には全D1の当日UTCのread/write・合計容量・最大DB容量、Workersリクエスト、DOリクエスト・GBミリ秒・SQLite read/write・容量、DB／Worker／cron数を含める。手動経路は `source=operator-transcribed-dashboard`、`monitoringVerifiedAt` を使い、通知到達の確認を24時間以内に要求する。自動経路は `source=cloudflare-graphql`、`monitoringMode=public-status` を使う。共通項目は `phase=after-setup`、実データの時刻 `observedAt`、当日UTC `utcDay`、`restorePolicy=no-past-db-restore`。正確なキーは `RuntimeState` と `assessUsage` を参照し、合成値を本番へ入力しない。

不足・未来・30分超・UTC日付変更・80%以上・枠不足では新規受付・本人編集・公開・公開承認を閉じる。固定の予算フラグだけでは開かない。古い観測は409、同時刻で内容が異なる場合は停止を保持し、同一内容の再送では期限を延長しない。無効入力による停止後も同時刻の再送では再開せず、条件を満たす新しい実観測が必要。

所有者のGET・DELETE、審査の非表示・見送りは観測失効後も扱う。独立DBや台帳まで利用不能なら成功表示しない。手入力の真実性を独立証明する機能ではなく、80%到達後も次の観測までは検知できない。観測が届かなければ30分で閉じる。無人のリアルタイム収集・金額上限とは扱わない。

### cleanupと通知

`maintenance.ts` は台帳照合、復元本文の再消去、30日cleanupを行い、`REPORTS_MONITOR_URL` へ固定JSON `{feature:'community-reports-cleanup',state:'ok'または'error',checkedAt:ISO時刻}` をHTTPS POSTする。redirectを許さず5秒timeout。URLや資格情報をログへ出さない。

cleanupと受信側2xxの両方が成功してから監視成功時刻を記録する。失敗時は可能なら監視時刻を0にし、error通知を試みる。両方の成功が2時間以内でなければ受付を閉じる。通知先未設定でも本文cleanupは試みる。

実通知先は未設定・未送信。受信側にはエラー通知に加え、毎時heartbeatが2時間を超えて届かなければ担当者へ知らせる機能が必要。2xxだけで人への到達確認としない。互換の既存受信先がなければ、正確なサービス・宛先・資格情報登録／権限を提示して別確認する。Free標準のCron通知が存在するとは仮定しない。

## 常設受付の自動観測と専用health

2026-10-15にcollector・cycle・専用healthと読取りpreflightをローカル実装した。実Cloudflareのschema・権限・使用量と通知配達は未検証。30分ごとの人手入力は常設受付の方式として採用せず、設定未完では閉じる。既存の公開health・監視タスクは変更していない。

### 自動観測の実行先と権限

専用cleanup Workerは `*/15 * * * *` の1triggerで観測し、初回・毎時・前回失敗時にcleanupする。違うcron式では既存leaseを閉じる。計画と同じ2Workers・1DO namespace・1D1・1cron枠で、別Worker・DB・外部有料サービスを追加しない。現在のcollectorはDB10個・Worker24個・namespace999個以下で完全な一覧を確認できる場合に限る。ページ欠落やそれ以上は予算内で完全取得できないとして閉じる。固定ホスト・対象account・GET metadataとGraphQL queryだけを許可し、redirect・retry・SQL・secret APIを使わない。各request5秒・全体25秒、JSON512kB、metric1000行未満を上限とする。Freeの実CPU・使用量での検証は残る。

当日UTC 00:00からの共有使用量をprofileから生成する限定的なGraphQL queryで取得し、同じ台帳へ30分有効の観測を保存する。schema・単位を確認した非秘密の `REPORTS_USAGE_PROFILE_JSON` と `REPORTS_USAGE_PROFILE_VERIFIED=true` が必須で、実profileはまだ作っていない。SQL由来のログやクエリ本文を読むdatasetは選べない。APIエラー・partial errors・dataset不可・一覧やmetricの欠落・古いデータ・80%以上では閉じ、空配列や拒否を0にしない。保存量はresourceごとの最大値を合計し、D1最大サイズも別に検査する。

profileの各metricはproviderの **集計完了／データcoverage時刻** を表す `freshnessField` を必須とする。全行・全datasetでISO時刻を確認し、現在より未来・30分超・欠落なら拒否する。`observedAt` はその最小値を要求期間上限で頭打ちにした時刻で、HTTP Dateだけでは更新しない。query上限は集計待機用に2分前とするが、それ自体を鮮度の証明とは扱わない。UTC切替時は新しい日の有効な観測が来るまで閉じる。**実schemaに取得可能なcoverageがあることと、その意味の証明は本番ブロッカー。最終活動日時・HTTP時刻・単なるquery上限で代用せず、確認できなければprofileとVERIFIEDは未設定を維持する。** provider集計と次の15分取得の遅延があり、80%瞬時停止や絶対的な費用上限とは扱わない。

この実行環境にはCloudflareの環境変数資格情報も通常のローカルWrangler認証storeもない。既存GitHub Environment `gemnao-d1-production` の `CLOUDFLARE_API_TOKEN` を参照する手動inventory workflowは存在するが、Cloudflareへの許可対象はaccount・Pages・D1 metadataの固定GETだけ。Analytics権限やcron閲覧の成功を証明しない。GitHub secretの値を取り出してWorkerへ転用しない。

ローカル候補の `.github/workflows/community-reports-preflight.yml` は既存の `gemnao-d1-production` Environmentを再検証する手動専用ジョブ。repo・branch・初回run・既存reviewer・単一branch保護を必須にし、環境や権限を修復・新設しない。Approve後のjob内だけで既存 `CLOUDFLARE_API_TOKEN` を使い、固定metadata GETとGraphQL schema/settingsを読む。出力はfield名・dataset可用性だけで、token・Authorization・account使用量・SQL・providerエラー全文は出さない。**3ファイルを独立レビューし、テスト6件と差分検査に成功してpush済み。CLIのworkflow取得がForbiddenで止まり、dispatch POSTへ到達せず、実runは未作成。現在のCloudflare API権限の証明にはなっておらず、実値・単位・coverageの確認も別途必要。** 必要な権限候補は次のとおり。

| 取得対象                  | 必要な読み取り範囲と根拠                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Workers・D1・DO analytics | 対象accountだけの `Account / Account Analytics / Read`。[公式のAnalytics token設定](https://developers.cloudflare.com/analytics/graphql-api/getting-started/authentication/api-token-auth/)                                                                                                                                                                                     |
| DB全件の識別とmetadata    | 同じaccountの `D1 Read`。[DB一覧API](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/list/)                                                                                                                                                                                                                                                    |
| Worker一覧・cron一覧      | 公式APIが受理する `Workers Metadata Read-Only` を優先。利用できない場合は `Workers Scripts Read` が代替候補だが、追加範囲として確認する。[Worker一覧](https://developers.cloudflare.com/api/resources/workers/subresources/scripts/methods/list/)、[cron一覧](https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/schedules/methods/get/) |

権限はaccountを限定し、書込み・token管理・課金・DNS・Pages編集を持たせない。既存権限だけで足りることを先に確認し、不足する場合だけ **新しい閲覧用tokenの発行と、`gemnao-community-reports-cleanup` Workerのsecret `REPORTS_CLOUDFLARE_READ_TOKEN` への登録** を個別承認として提示する。期限・更新手順もその時に確定する。Pages、ブラウザ、DO、GitHubへ新たに配布せず、ログへ値やAuthorization headerを出さない。今回は作成・登録していない。

データ取得方式の根拠は [Workers GraphQL](https://developers.cloudflare.com/analytics/graphql-api/tutorials/querying-workers-metrics/)、[D1 metrics](https://developers.cloudflare.com/d1/observability/metrics-analytics/)、[DO metrics](https://developers.cloudflare.com/durable-objects/observability/metrics-and-analytics/)（いずれも2026-10-15確認）。ただし実account／Freeで、必要なDO SQLiteの行使用量・容量・durationを含む全項目が提供されることは未確認。[settings node](https://developers.cloudflare.com/analytics/graphql-api/features/discovery/settings/) の可用性・利用可能field・期間制限と実値を確認してから実装を確定する。取れない項目を省略して受付を開かない。

### 既存GitHub経路と本人Approve

GitHubコネクタのGETで履歴を確認。[2026-10-11のproduction inventory](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/38152090495) はgate成功後、inventory jobが `CLOUDFLARE_HTTP_403` で停止した。該当コミットのコードでは最初のCloudflare要求がAccount metadata GETなので、D1・Analyticsまで権限不足とは断定しない。そのAPIの拒否を迂回・権限拡張せず、新preflightが本来必要とする別の読取りを保護環境内で判定する。どの読取りも拒否されたらそのrunを停止する。

この環境のGitHub CLIも接続側Forbiddenで停止。GitHubコネクタは履歴のGETが成功するが、workflow dispatchやEnvironmentのApprove操作を提供していない。現在のdefault branchは `gemunao` と確認した。新preflightの3ファイルは専用worktreeから `9f5ca3d46f3c8328c28941f2f2fcb2d64412f70a` で反映済み。`git ls-remote` とGitHubコネクタのcommit GETでSHA・変更3ファイルを確認。CLIの手動実行は一度だけ試みたが、workflow metadata GETがForbiddenでdispatch POSTへ到達しなかった。Actions全履歴76件にも該当runなし。権限を拡張せず、スマホのGitHubで次を行う。

1. [Community reports analytics preflight](https://github.com/poe2-build-navi-jp/gemnao/actions/workflows/community-reports-preflight.yml) を開き、Run workflowで `gemunao` を指定する。対象SHAは `9f5ca3d46f3c8328c28941f2f2fcb2d64412f70a`。別の更新が入っていたら実行せずレビュー対象との一致を確認する。
2. gate成功後の **Review deployments** で、対象が `gemnao-d1-production`、jobが `discover`、source SHAがレビュー済みのものと一致することを確認し、本人がApproveする。実runのURLとSHAはdispatch後に確認する。保護の削除・admin bypass・別Environmentへの置換は行わない。
3. 固定metadataとschema/settingsの結果を読み、取得できたfieldの意味・単位・coverageと実使用量を確認する。schema読取り成功だけで受付を開かない。

既存のinventoryはmetadataのみ、既存D1 controlは既存サイトDB、既存QA deployは別の固定対象。これらを未レビューの報告DB作成・専用Worker配備へ転用しない。secret値を表示・転記するスマホ操作は依頼していない。Cloudflareへの新token発行／登録が必要となった場合は、その段階で別の具体的承認が必要。

### 専用statusの会話による読取り監視

新しい公開 `GET /api/reports/health` を実装。schemaVersion、受付／公開可否、確認・観測・期限・cleanupの時刻、固定の異常理由だけを返す。報告本文・件数・ID・鍵・token・DB名は出さない。GETは台帳とcleanup receiptの小さい状態を読むだけで、GraphQL・cleanup・初期化・prune・lease延長・DBのrate更新を実行せず、no-storeで返す。反復GETでSQL／台帳変更ゼロを検証した。

現 `/api/reports/status` は画面用のbooleanだけで、稼働時にはrate用のDB更新も行うため、この読取り監視用の完成品とは扱わない。新healthは200を正常、503・timeout・取得不能・不正schema・期限超過を異常とする。失効した観測やcleanupの経過時間はGET時にも判定し、止まったWorkerが最後の正常値を返し続けないようにする。サーバー自身の停止判定が受付を閉じ、会話のタスクには停止・再開権限を持たせない。

この会話用に**別の毎時読取りタスクを作る案は利用可能**。既存タスクは変更せず、新healthが実際に読めることと、異常時にユーザーへ通知が届くことを確認してから採用する。タスクは毎時より高頻度では実行できず、通知は次の成功した実行とプラットフォーム配達に依存する。即時通知・欠落しない通知の保証はない。タスク自体の停止や配達不能を同じタスクだけで確実に検出することもできない。この検知遅延を許容できる初期100件の運用なら、外部有料サービスなしの候補になる。

`REPORTS_MONITOR_MODE=public-status`、`REPORTS_AUTO_OBSERVATION_ENABLED=true`、`REPORTS_PUBLIC_MONITOR_VERIFIED=true`、`REPORTS_USAGE_PROFILE_VERIFIED=true` をPagesと専用Workerへ整合設定する方式を実装。`PUBLIC_MONITOR_VERIFIED` は専用タスクの実通知確認後だけ設定する。自動モードは台帳のcollectionとcleanupの両成功も要求し、前回の失敗を遅い成功応答で消さない。24時間ごとの人手更新や架空のwebhookは不要。互換webhookモードは残す。GETで監視確認時刻は書かない。**監視タスクは未作成、実通知配達・本番連動は未検証。**

常設開始の最小条件は、実権限で全使用量の定期取得ができること、失敗・80%・失効時の実停止、毎時cleanup・本人削除・台帳整合、専用healthの外部取得、専用タスクの実通知配達を確認し、その通知遅延を運用条件として受け入れること。満たせなければ受付OFFを維持する。

## 認証復旧後の本番手順

以下は未実施。新DB・Worker・cron・instanceの実値をまだ確認していない。

1. 既存ブラウザで現在使用量、全DB・Worker・cron数、互換の実通知先と担当者到達を確認する。追加予定はD1が1個、Workerが2個、毎時cronが1個。DO枠も含めて余力を判定し、課金・権限を変更しない。
2. 独立D1候補 `gemnao-community-reports-production` だけに `migrations/community-reports/0001.sql` を適用し、Pagesとcleanupの `REPORTS_DB` を実UUIDでbindする。既存DBへの適用・fallbackは禁止。
3. `gemnao-community-reports-guard` をSQLiteクラスmigration付きで作成し、Pagesとcleanupの `REPORTS_GUARD` を `ReportsGuardService` にbindする。公開fetchをbindしない。設定候補は `cloudflare/wrangler.community-reports-guard.json`。今回実行したのはdry-runのみ。
4. 受付・公開・予算OFF、空DB、既存管理者認証、`REPORTS_BOOTSTRAP_ALLOWED=true` の一時設定で、同一originからbodyなしPOST `/api/admin/reports-bootstrap` を呼ぶ。非秘密instance UUIDをPagesとcleanupの `REPORTS_GUARD_INSTANCE` に固定し、bootstrapフラグを除く。固定済みなら再bootstrapしない。
5. 専用Workerに独立DB・service binding・instanceを設定する。実profile・既存権限での取得可否を確認し、新しいtoken発行やsecret登録が必要なら個別承認を得る。自動モードのcronは `*/15 * * * *`。専用healthが外部から読めることと、別の毎時読取りタスクの実通知配達を確認してから `PUBLIC_MONITOR_VERIFIED` を設定する。既存cleanup・監視を置換しない。
6. `REPORTS_REVIEW_ENABLED` と既存認証で審査を確認し、実自動観測・独立binding・削除と再送・失効・80%／取得失敗停止・cleanup・復元対策を実設定で検証する。揃うまで受付／公開／予算はOFF。
7. レビュー済み候補をcommit・pushし、同じコミットのPages配信と公開HTML・CSS・JS・モバイルを確認する。承認条件と検証が揃ってから段階的に有効化する。IndexNow再送・新規送信、Bing/GSC提出は行わない。

FreeではSQLite-backed DOを利用できる。無料枠はリクエスト10万/日、duration13,000GB秒/日、SQLite read500万行/日・write10万行/日・容量5GB。KVメソッドも内部SQLiteとして計上される。[DO pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)（2026-10-15確認）。計算入力はGBミリ秒なので13,000,000が上限。

D1はread500万行/日・write10万行/日・容量合計5GB。FreeのDB数10・1DB500MB・1呼出し50query。[D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)、[D1 limits](https://developers.cloudflare.com/d1/platform/limits/)（2026-10-15確認）。Worker数100・cron数5・リクエスト10万/日。[Workers limits](https://developers.cloudflare.com/workers/platform/limits/)（2026-10-15確認）。これら公表値は実アカウントの現在使用量・余力の確認を代替しない。

## ローカル検証

- `check-community-reports.mjs`：SQL・API32群PASS。元の本文・版競合・本人削除・再審査に加え、D1復元、台帳障害、行消失後の削除、instance違い、bootstrap、通知失敗、30分失効、100枠、観測再送を確認。SQLiteメモリDBと別の台帳fixtureを使用し、本番送信なし。
- 運用計算16件PASS。DO枠80%境界と2Worker分の空きも確認。合成値は実使用量ではない。
- 実ランタイム：`wrangler dev --local` のnamed serviceとSQLite-backed DOで予約・削除・再予約拒否・古い観測拒否・instance違いを確認。プロセス再起動後も同じ一時SQLiteでinstance・削除印・停止状態を保持。証跡 `.wrangler/community-reports-review/actual-do-results.json`。本番DOやTime Travel試験ではない。
- lint・型検査・ビルドPASS。記事430、sitemap409 URL、OG349を維持。初回lintはローカルguardの `cloudflare/.wrangler` 生成物を拾って失敗したため、生成物をレビュー用無視対象へ移動し、一時configをリポジトリ外に変更後に再実行してPASS。製品コードに検査例外を追加していない。
- 多言語184ページ、記事430、翻訳114記事のSTEP整合、STEP結果UI、既存My Gamesのbackup／復元・多言語SSR・解決ノートの回帰検査PASS。
- Worker統合：独立bindingなしの既定停止、private/no-store/CSP、公開originを模したGA除外、報告鍵・草稿の既存backup除外PASS。
- guardのWrangler dry-run PASS（14.81KiB、gzip4.15KiB）。専用cleanupもdry-run PASS（24.88KiB、gzip7.21KiB）。後者はbindingなしのリポジトリ外設定でbundleだけ検証し、本番deployは未実行。cleanup SQLとDB helperを `retention.ts`・`database.ts` へ分離し、記事データとNode専用rate処理を専用Workerへ含めない。既存SQL検査32群は再実行してPASS。
- ブラウザ24シナリオPASS。4言語×320・390・1440px、本人編集・再審査・削除、通信失敗と再送、2タブ競合、遅延応答、管理画面を確認。JS例外・不良CSS/JS・横はみ出し・対象WCAG axe違反なし。16枚の画面と結果は `.wrangler/community-reports-review/browser/`。HTMLとassetsはローカルPages、全APIは独立SQLiteへinterceptし、本番データ・計測へ送信していない。
- ローカルPagesの13 URL・57 CSS/JSでHTTP200、報告画面のno-store/noindex/CSP、sitemap除外、実APIの `enabled/publicEnabled/canDelete` 全OFFを確認。`.wrangler/community-reports-review/activation-http-results.json`。初回補助検査で存在しない `storageConfigured` を期待したため失敗し、実際のstatus schemaに合わせて再実行してPASS。製品コードの変更なし。
- 観測watermarkの読み取り再レビューで先の停止再送の指摘は解消し、この修正に追加指摘なし。レビュアー自身は編集・テスト実行・本番操作をしていない。
- 自動運用 `check-community-reports-operations.mjs` 12群PASS。15分更新・毎時cleanup、SQL／DOへ書かないhealth、実APIの受付失効と本人削除継続、権限拒否／partial errors／欠落・上限・不完全一覧、providerの古い応答と古いcoverage、80%、UTC切替、設定不足、cleanup失敗、同時刻／遅延応答、HTTPからの自動観測偽装拒否を確認。field名・coverageは意図的な合成profileで、実Cloudflareのschema確認とは扱わない。
- `node --test tests/community-reports/*.test.mjs` 22件PASS（運用16＋読取りpreflight6）。preflightは対象・reviewer保護・branchを必須にし、GET metadataとschema/settings以外の操作やsecret出力を行わない。実runはdispatchしていない。
- 実ローカルworkerdのSQLite-backed DOでも、自動healthと同時刻の失敗優先、以前の本人削除印の維持を確認。`.wrangler/community-reports-review/actual-do-auto-results.json`。実providerデータではない。
- 自動運用差分の独立読み取りレビューで、HTTPからのprovider source偽装とcoverage時刻不足の2指摘を修正。再レビューで解消を確認。実coverage fieldの意味・取得可否はコードレビューでは証明できず、本番前のブロッカーとして残す。
- 自動運用版のローカルHTTPは14 URL・57 CSS/JSを確認。新healthは未設定時503・no-storeで、時刻や正常状態を捏造せず `not-configured` を返す。`.wrangler/community-reports-review/auto-http-results.json`。

主要ログは `/tmp/gemnao-community-reports-activation-{sql,ops,lint,typecheck,build,browser}.log` と `/tmp/gemnao-community-reports-guard-dry-run.log`。ビルドが削除した追跡対象 `dist/client/.gitkeep` は復元済み。

自動運用版のログは `/tmp/gemnao-community-reports-auto-{sql,operations,unit,lint,typecheck,build,browser,cleanup-dry-run}.log`。この版でもブラウザ24シナリオ・16画面、4言語×320／390／1440pxを再確認してPASS。既存UIフローのAPI fixtureと、自動受付判定の実serviceを使う12群の役割を分離して検証した。

候補全体は58ファイルで、そのうちpreflight最小3ファイルだけpush済み、残る55ファイルは未公開。元35ファイルと追加安全版48ファイルのpatch／hashを残し、自動運用版は `.wrangler/community-reports-review/automation-candidate-manifest-2026-10-15.json` と `automation-candidate-2026-10-15.patch` に保存。既存DB・認証・診断保存・rootの本番wrangler設定は変更していない。preflight3ファイルの反映記録は `.wrangler/community-reports-review/preflight-publication-receipt-2026-10-15.json`。既存workflow・Environment保護は変更していない。主作業treeの未追跡3ファイルは公開コミットと同一で、既存差分を保持するため主作業treeのHEADは基準コミットのまま。独立worktree `/tmp/gemnao-reports-preflight-publish-h73zqw` が公開済みコミットを保持する。

未確認は本番使用量・CPU・行計上、実binding・管理者権限、実通知と担当者到達、本番cleanup・cron・障害停止、スマートフォン実機。認証復旧とこれらの確認まで本番設定・公開・受付を完了扱いにしない。
