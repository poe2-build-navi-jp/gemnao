# 投稿受付前の読取り検証（2026-10-17 JST）

## 実行済みのschema確認

- run [38957022668](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/38957022668)、source `5a5d4da964cf71e9bf46a30bca80d894c0727573`、初回attemptでgate/discoverが成功。
- 利用者から、このrunの既存Environmentに対する「Approve and deploy」の明示承認を受けて実行。これは新credentialの作成・登録や、別runの承認を意味しない。
- 8datasetがenabled。入れ子型の修正により、D1行read/writeと容量、Workers request、DO request/duration/SQLite行read/write/容量のfield名を取得できた。
- `d1AnalyticsAdaptiveGroups` はsum/ dimensionsのみ、`d1StorageAdaptiveGroups` のmaxはdatabaseSizeBytesのみ、`durableObjectsSqlStorageGroups` のmaxはstoredBytesのみ。現在のcollectorがすべての指標で要求する「provider coverageを示すmax時刻」は、この結果では確認できない。
- DO invocationsのmax.datetimeを、全指標の集計完了時刻と読み替えない。利用量・単位・完全性・鮮度はschema成功だけでは証明されず、profileと受付をONにしない。

## 次の固定読取り処理

既存 `community-reports-preflight.yml` に手動選択 `mode=readiness` を追加。defaultは従来のschema。既存のrepository/branch/first-attempt/Environment/reviewer保護とread-only GitHub permissionsを維持する。

`ops/community-reports/readiness-inspection.mjs` は次だけを行う。

1. 同じ既存認証で従来のmetadata/schema/settings読取りを再確認。
2. 固定の報告専用D1 UUIDと名前が一覧に一致する場合だけ、固定SELECTを一度実行。報告件数、期限切れ・古いrate・未完了withdrawalの件数、cleanup/monitorの処理時刻だけを読む。本文・所有者hash・鍵は読まない。出力は行の有無と処理時刻に限定し、件数は公開ログへ出さない。
3. UTC当日の開始から5分前までの固定GraphQL queryを一度送る。実利用量をメモリ内で比較し、数値・resource IDをログやartifactへ保存せず、しきい値未満かどうかだけを出力する。空・不正・未収録resourceの保存量はunknownにする。日付切替直後は旧日の値で代用しない。
4. cleanupのcron設定をmetadataとして確認。存在だけで実行成功としない。
5. 公開GET `/api/reports/health` を認証なしで一度読む。固定schema・時刻・no-store・HTTP状態を確認し、取得不可は未確認とする。

新しい認証情報の確認・発行・登録、設定変更、UPDATE/INSERT/DELETE、DOへの状態更新、通知送信、cleanup実行、cron開始、受付ONは含まない。

durationの課金単位、providerの集計完了時刻、通知到達、cleanup実行成功は別の未充足条件として明示する。取得時刻や5分の待機幅を、providerの完全性・鮮度保証と扱わない。`authorizesActivation` は常にfalse。

## ローカル検証

- preflightとreadinessの単体テスト25件成功。
- 変更したMJSのlint、Node構文、diff検査成功。
- 手動trigger、固定Environment、既存permissions、2択modeをYAMLで確認。
- 専用DBの識別不一致時はSQL要求0、SQLは固定SELECTのみ、期限切れ行があっても削除0、公開healthへAuthorizationを送らないことを検証。
- これは合成HTTPの結果であり、新しい本番readiness実行の結果ではない。

## 本番readiness実測（2026-10-17 04:56 JST）

- run [38958360153](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/38958360153)、source `52c504ae808b760e48d8c16431e1c71f41a63405`、初回attemptのgate/discoverが成功。利用者のこのrunに対する明示承認後に実行。
- UTC 10月16日00:00〜19:51:11の要求期間で、D1行read/write・合計容量・最大DB容量、Workers request、DO request・SQLite行read/writeの8項目は返された値が80%未満。DO SQLite保存量はunknown。duration値は返されたが課金換算の検証は未完了。これは全項目の余裕・集計の完全性や鮮度を証明しない。
- 専用DBの一致を確認。投稿、期限切れ投稿、古いrate、未完了withdrawalはいずれも存在しない。cleanup/monitor成功時刻なし。期待する15分cronなし。削除処理は実行していない。
- 公開healthは認証なしで取得でき、503・正しいschema・no-store・`reason=not-configured`・受付/公開OFFを確認。異常時の正しい応答であり、運用正常や通知到達を意味しない。
- 現collectorのcoverage要件は未充足。profile、VERIFIED、受付、公開を変更していない。

## 公開healthの継続確認

専用の `.github/workflows/community-reports-public-health.yml` を毎時17分UTC（日本時間も毎時17分）と手動実行に限定して追加。Cloudflare資格情報・本番Environment・SQL・cleanup・設定変更を使用せず、固定の公開healthを1回GETする。GitHub permissionsはcontents:readのみ。

`COMMUNITY_REPORTS_HEALTH` の1行JSONに固定operation、source SHA、取得時刻と公開状態だけを記録する。監視側はjobの成功だけで正常と判定せず、`healthy`、schema、取得の鮮度を読む。503、timeout、取得不能、不正schema、古い観測・cleanup、期限切れを正常扱いしない。読取りの成功と通知配達は区別し、通知配達の確認前にMONITOR_VERIFIEDを設定しない。

専用の通知タスクはGitHubのこのworkflow結果を読む方式とする。最新runの完了・時刻・operation・source一致を確認し、監視job自体の停止やログ欠落も異常とする。GitHub cronと通知タスクの実行・配達には遅延があるため即時通知とは扱わない。既存の別用途タスクは変更しない。

- 合成HTTPの監視検証5件と既存25件が成功。ビルド成功（HTML438、sitemap417、OG357）。変更MJSのlint・構文・YAML・diff検査成功。全体lintは既存bootstrap関連4ファイルのエラーで失敗し、この変更には含めていない。
- 初回本番run [38958978577](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/38958978577)、source `f850f488bd7d015bc34c00d44dfb83a3db3cea54`、check成功。`capturedAt=2026-10-16T19:59:54.738Z`、`healthy=false`、health取得成功・503・`not-configured`・受付/公開OFF。GitHub経由でこのrun・job・ログを読めることも確認した。
- ChatGPTタスク「ゲムなお投稿受付の異常監視」を毎時27分JSTに作成成功。毎時17分のGitHub結果を参照し、最新結果が75分超、欠落、取得不能、異常でも通知する。既存の別用途タスクは変更していない。
- 即時実行を1回依頼したが、実行・配達は非同期。依頼成功は実行完了・端末到達の証拠ではない。通知到達確認と自然なcron実行の確認は未完了であり、MONITOR_VERIFIEDを設定していない。

## 受付開始を止めている条件

1. DO SQLite保存量がunknown、duration課金換算と全指標のcoverageが未確認。現collectorが要求するcoverage fieldはschemaに存在せず、実装と取得方法を整合させる必要がある。最終活動日時・HTTP時刻・query上限で偽装しない。
2. 専用cleanupのcronと成功receiptがない。現在専用DBに削除対象行はないが、将来の期限切れや台帳による消去を伴う処理の実行・定期化には具体的な削除承認が必要。単なる読取りの承認を流用しない。
3. 通知タスクは作成・試験依頼済みだが実配達未確認。自然な定期確認の証跡も未確認。
4. 自動取得用の新しいcredentialは作成・登録していない。既存のsetup credentialをログへ取り出したりruntimeへ転用したりせず、必要となる登録は対象・権限・保存先を確定して個別承認を得る。利用者の指示に従いtoken自体の確認は実施しない。

この記録で本番の受付・公開・予算・検証済みフラグは変更していない。自動削除も開始していない。

## 確認済み事実の引継ぎと取得不整合の切分け

- Freeプランおよび2026-10-15 12:55 JSTのWorkers 435/100000、12:56 JSTのD1 DB6/10、読取756/5000000、書込16/100000、保存446.46KB/5GBは利用者画像で確認済み。親担当の同日22:58 JSTの確認も引き継ぐ。過去時点の余力を未確認へ戻さず、現在の日次値やDO実消費量としても代用しない。画像再送は不要。
- schema run 38745059313の成功と8dataset enabledは確認済み。より新しい38957022668の実schemaログも再読し、D1 analyticsにmax aggregateがなく、DO SQLite保存量のmaxはstoredBytesのみであることを確認した。現在のcollectorが全指標に生成する `max{freshnessField}` をこのschemaへ適用できない。これは権限不足を示す証拠ではない。
- 読取りinspectionはこの架空fieldを要求しない別のqueryを既に使っている。今回、その違いを実schemaに基づくテストと `collectorSchema` 出力で明示。DO保存量のunknownを、空配列／応答欠落／上限到達／資源不一致／重複／一覧未網羅／不正値へ分類する `unknownReasons` を追加した。ID、値、本文、secretは出力しない。行数・バイト数の小数がしきい値検査を通る不備も拒否へ修正。
- 旧receiptはunknownの原因を保存していないため、過去のDO保存量unknownの原因は断定できない。未使用namespaceを推測で除外したり、空配列をゼロにして通過させたりしない。
- [Cloudflare公式metrics資料](https://developers.cloudflare.com/durable-objects/observability/metrics-and-analytics/)も照合したが、最終活動時刻を全datasetの集計完了保証とする根拠は確認できなかった。duration課金単位と全指標のcoverageは未解決。runtime collector、固定hash、profile、VERIFIED、受付フラグは変更しない。この修正は自動collectionが実行可能になったという意味ではない。
- 外部監視タスクは利用者提供リンクを親ブラウザが確認済み（10/17 05:02 JST登録、初回予定05:27 JST）。登録の証拠を引き継ぎ、重複作成しない。初回通知の端末到達は本人確認まで未検証。監視登録を利用量の証拠と混同しない。
- ローカルpreflight/readiness 28テスト成功。実schemaでのquery構成、DO保存量のunknown理由8種類、明示ゼロと空配列の区別、小数の拒否を含む。変更MJSのlint成功。サイトのコード・設定は未変更のため全ビルド／全テストは再実行しない。

次の具体操作は、親担当による既存analytics preflightの新規run（gemunao、mode=readiness、確認文字列なし）と、そのrunに対する本人の既存Environment承認。要求範囲は従来どおり固定metadata/GraphQL/専用DBの固定SELECT/公開healthの読取りだけ。新credential確認・登録・権限拡大・collection書込み・cleanup削除・cron変更を含めない。新しいreceiptでunknown理由を確認するまでは、原因の推測修正を進めない。

## readiness run #7の確定結果

本人承認済みrun [38960244101](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/38960244101)、source `f9dbad045d91679f7383e3f762d336706f364df9`、gate/discoverとも成功。receiptのcheckedAtは2026-10-16T20:16:17.782Z。要求期間は同日00:00〜20:11:17.782Z。

- DO保存量unknownの直接原因は `unknownReasons.doStorage=empty-rows`。GraphQL全体の成功応答に対し、当該datasetの配列が空だった。403、schema query error、資源ID不一致、不正数値を原因とした結果ではない。providerが行を返さない理由（収録時刻・対象期間・その他）はこのreceiptだけでは断定できない。
- D1/Workers/DO request・行read/writeの8指標は取得値が80%未満。durationは値あり、課金換算未検証。全体coverage未検証。過去の利用者画像による確認済み数値はそのまま保持する。
- SQL保存量queryは実schemaに存在する `durableObjectsSqlStorageGroups` / `max.storedBytes` / `dimensions.namespaceId` / `datetime_geq,datetime_leq` を使用している。guard作成コードも `new_sqlite_classes: ['CommunityReportLedger']` を使用しており、KV backendだったと推測してdatasetを差し替える根拠はない。
- 受付/公開OFF、health 503/not-configured。専用DBに投稿・期限切れ投稿・古いrate・未完了withdrawalなし。cleanup成功時刻なし、15分cronなし。実削除やcollectionを実行していない。
- 今回は取得コードを推測変更していない。空応答をゼロにする、namespaceを除外する、古い期間の値を現在値とする、HTTP時刻をcoverageにする変更は不適切。実schemaに集計完了保証がない問題も未解消であり、フラグはOFFのまま。

次の照合は親の既存Cloudflareブラウザで、対象accountのDO SQLite保存量表示が同じUTC期間に値を持つか、その表示の対象期間・更新時刻を読むこと。従来のWorkers/D1画像の再送やtoken確認は不要。表示にも値がなければprovider側の収録仕様の確認が必要。表示に値がある場合は、その値を取得する正式なdataset/集計期間の根拠を確認してからquery修正を行う。同じreadiness runの重複起動や、権限拡大では解決したとみなさない。

監視タスクは登録済みを継承し、重複作成なし。通知到達は本人確認待ち。新credential・権限拡大・削除・cron開始の承認は今回要求せず、それらの操作も行っていない。

## 2026-10-17 再開時の確認とブラウザ以外の読取り経路

- remote HEAD `4cdcbe45e67c6bcc65a8ed94556aa2183d348dd1`、ローカル作業ツリーは変更前クリーン。GitHub直近10runは全てcompletedで、同範囲に実行中の重複作業なし。外部管理者の操作全体を保証するものではないため、本番設定の変更は行わない。
- scheduled run `38990485678` / check job `117271569353` のログを再読。2026-10-17T01:21:17.421Z、同じsource SHAで公開health 503/not-configured、受付/公開OFF、cleanupReceiptPresent=false、notificationDeliveryVerified=false。約148分の監視間隔は正常な毎時実行の保証とは扱わず、75分の監視期限は延長しない。この環境から直接の公開GETはHTTP_UNAVAILABLEだった。
- 親ブラウザのCloudflareログイン拒否（メール方式403を含む）は回避しない。既存GitHub Environmentの読取りworkflowはrun #7で成功しており、通常の許可された代替経路として利用可能。CLI workflow GET Forbiddenは再試行しない。新credentialの確認・登録は不要な読取り経路。
- 検査のUTC当日windowだけでは、保存量datasetが前日にのみ行を持つ状態を切り分けられなかった。今回、当日のDO保存量がempty-rowsの時だけ、同じSQLite datasetへ直前のUTC暦日1日分を最大1回追加照会する。schemaにあるfieldだけ、同じaccount、limit 1000、既存timeout/応答サイズ制限を維持。出力は要求期間と固定の結果分類のみ。ID・保存量・credential・provider本文は出力しない。
- 過去日の行は診断用のみ。現在usage、30分lease、予算判定、guard、VERIFIEDへ転用しない。前日が空／provider拒否／資源不一致ならそのまま未確認。日付範囲を自動で広げ続けたりretryしたりしない。古いD1 446.46KB確認と監視登録は引き続き確認済みとして保持。
- preflight/readiness/public-health計35テスト成功。前日だけ値がある場合も当日unknownとactivation=false、前日の空/取得失敗、当日に行があれば追加要求0、月境界、schema不一致の拒否、秘密/数値の非出力を確認。変更MJS lintとdiff検査成功。サイトとruntimeは未変更のため全ビルドを再実行しない。

### 実行可能な次操作と承認範囲

1. 親GitHub UI担当が新commitのgemunaoで既存analytics preflightを新規1回起動（mode=readiness、確認文字列なし）。既存Environmentの当該run承認は本人が行う。固定SELECT/GraphQL/公開GETのみ。前日結果が返るまで当日unknownの原因を解決済みとしない。
2. collectionは未実行。現runtimeは全指標のprovider coverage fieldを要求するが実schemaには存在せず、保存量の前日照合だけで解消しない。HTTP時刻/最終活動時刻への代用はしない。現行の保護workflowもcollection書込みや受付activationを提供しておらず、単なるフラグ変更は正常運用にならない。
3. 後続の自動運用で必要となる限定操作は、専用cleanup Workerのみに読取りcredential（対象accountのAccount Analytics Read、Workers Metadata Read-Only、D1 Read）を登録すること、同Workerのcollectionと期限切れ/削除済み報告本文等の消去を含むmaintenanceを実行すること、同Workerへ `*/15 * * * *` を設定すること。これらは未実装・未検証条件を解決した上で別途具体承認が必要。既存setup credentialをruntimeへコピーしない。承認を先取りせず、今回は実行しない。
4. 外部監視は既存タスクを継続。通知到達は本人が受信確認する必要がある。148分間隔という実測を踏まえ、GitHub scheduleに定刻保証があると扱わない。監視設定の追加・重複作成・75分期限の緩和はしない。

本番受付フラグ、pin、bootstrap、cron、credential、保護設定は変更していない。受付開始は未達であり、この検査追加を開始完了と報告しない。
