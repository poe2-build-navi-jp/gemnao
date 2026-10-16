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
