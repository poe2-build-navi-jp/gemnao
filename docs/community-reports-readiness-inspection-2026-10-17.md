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

- 合成HTTPの監視検証5件と既存25件が成功。新監視の本番実行・通知到達の結果は実行後に追記する。
