# 投稿受付開始の残条件（2026-10-17 JST）

ユーザー指定により、トークンの確認は行わない。認証フローの再試行、認証情報の発行・登録・変更、実データの削除、受付ONは今回実行していない。

## 確認できた内容

- GitHub run `38950683052` は `cbff64e530d238aa81c1c481f4ac552b2856e90c` のbootstrap-pin処理として成功。2026-10-16 18:56:40 UTCの最終receiptは、Pages/cleanupの同一instance固定、bootstrap閉鎖、受付OFF、cron空、Worker URL OFFを記録している。これは定期cleanupの実行成功を示さない。
- 本番health `https://gemnao.pages.dev/api/reports/health` は今回の取得元からHTTP 403 / code 1010を返した。アプリのhealth JSONを取得できておらず、監視成功や本番障害とは断定しない。制限の回避は行っていない。
- この会話で参照可能な定期タスク一覧には「ゲムなお自動削除の異常通知」がなかった。別の会話・環境に存在しないとは断定できないため、重複タスクは作成していない。通知到達の実績も取得できていない。
- run `38745059313` の既存出力は8datasetがenabled。各datasetの出力はfilterのみで、sum/max/dimensionsが欠けていた。実使用量・単位・coverage・profileは証明されていない。

## 修正した確認処理

`ops/community-reports/preflight.mjs` のGraphQL introspectionが、NON_NULL → LIST → NON_NULL → OBJECTの型構造に届かない不具合を修正した。固定深さ6段まで型を読む。型が解決できなければ、空の集計項目で成功とせず固定エラーで停止する。

追加した検証は実際の入れ子型と、row/aggregate/filterが解決不能なケース。関連単体テスト15件と変更箇所lint、diff検査が成功。新しい本番queryの実行結果ではない。

固定account、既存Environmentのreviewer/branch保護、既存認証の参照、GET metadataと読取りschema/settingsのみという範囲を維持した。使用量query、設定変更、SQL、cron、通知送信は追加していない。usageValuesVerified/profileVerifiedはfalseのまま。

## 受付ONまでに必要な証跡

1. 実accountの全必要指標について、値・単位・集計方法・完全性・鮮度を確認する。DO duration/SQLite行read/write/容量も対象。HTTP取得時刻や最後のイベント時刻をcoverageの代用品にしない。
2. 同じ固定instanceで、自動collectionとcleanupが受付OFFの状態で成功したことを確認する。現在のcycleは受付OFFでもUPDATE/DELETEを実行するため、実行前に削除対象と範囲を具体化する。承認なしに本番削除を試さない。
3. 外部から本番health JSONが取得できることと、既存監視から本人への異常通知到達を確認する。タスク存在だけで配達成功としない。
4. UI/API復旧版は別ブランチにあり、本番にはまだ反映していない。未確認事項をVERIFIED=trueで代用せず、すべて満たしてから受付設定と公開後検証へ進む。

今回、新たに認証情報の確認・承認を依頼しない。既存の実運用証跡を取得できない範囲は未確認として残す。
