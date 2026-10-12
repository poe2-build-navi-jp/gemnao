# 固定2件の本番自動削除を既存controllerから設置

`operation=production-cleanup`。許可branch `prepare/feedback-preview-controller-20261007`、既存Environment `gemnao-preview-data` と本人最終Approveを使う。受付・Pages・QA・他DB・token・権限・課金設定は変更しない。DB作成／schema適用は行わない。

## 対象と持続する動作

| Worker | DB ID / binding | UTC cron |
| --- | --- | --- |
| `gemnao-diagnosis-cleanup-production` | `1ef1f798-7518-4b1a-a5a6-4f6f7dddfcfe` / `DIAGNOSIS_DB` | `17 * * * *` |
| `gemnao-diagnostic-feedback-cleanup-production` | `f3379342-bb5e-461c-bad3-1175be8836c5` / `FEEDBACK_DB` | `43 * * * *` |

設置API書込みは各Workerの作成・固定module version配備・cron登録の計6回まで。設置処理からD1 queryを呼ばない。cron登録後は**設置runの承認期限を過ぎても毎時継続し、対象DBの期限切れ行を削除する**。初回cronが2Workerの設置完了前に実行される可能性もある。

診断共有とfeedback reportは作成から30日、feedback tombstoneは削除/取消から30日。診断の期限切れrate/salt・30日前以前のmetrics、feedbackの60秒超rate・前UTC日以前のsaltも対象。`cleanup-profile.mjs` の `RETENTION_SCOPE` と固定module hashが完全な境界。成功後だけheartbeat更新。通常DB、QA DB、他テーブルを触らず、公開HTTP/routeを作らない。WorkerへAPI tokenを保存しない。既存controllerと同じくobservability/logpushを無効にして配備する。

## 事前確認と停止

run/head/初回attempt、既存Environmentの本人承認・branch制限・admin bypass禁止を確認。D1一覧と固定2DB metadataがID/name一致、Worker一覧の全ページが揃い、固定2Workerが存在しないことを確認する。全WorkerのcronをGETし、現cron数+2<=5、Worker数+2<=100を要求。親保有の現在Free確認と無料ハード上限停止方針を使う。日次rows/requests・残容量の余裕は未計測であり、あると推定しない。

同名、ID/name不一致、不完全応答、枠不足、期限切れは停止。versionは作成応答の新Worker IDで配備し、module/bindingを読み戻す。cronはAPIが名前指定のため直前にIDと名前を双方向照合するが、同時renameを原子的に防ぐ機構ではない。承認recordの `cronTargeting` はこの残余リスクの確認を表す。

不確実な書込み、partial success、claim競合の後は再試行・上書き・削除rollbackをしない。読み取りで照合し、新しい判断を待つ。既存の不変claimはrun/head/planに固定。成功した各Worker作成・version配備・cron登録は `cleanupInstallationReceipt` として非秘密metadataを出力する。最終結果は全6journalと対象境界を返す。実cronのheartbeat／通知到達は未確認と明示する。

## 親が行う実行手順（この変更では実行しない）

1. 許可branchの新source SHAとplanHashを照合する。workflow `feedback-preview-control.yml` で許可branch・`production-cleanup` を選び、新runを用意する。
2. `cleanup-record.template.json` の `commit` を実source SHA、`runId` を新run IDの数値へ置換する。他のrunのrecordやartifactを流用しない。テンプレート内の先行run照合は確認済み履歴として保持し、未知の新runが増えた場合は読み取りで照合する。
3. `approvedAt=2026-10-12T05:09:29Z`、Free確認 `2026-10-12T04:29:03Z` は実際の発言時刻。確認の有効期限はそれぞれ1時間。Free確認は **05:29:03 UTC / 14:29:03 JST** まで。経過後は日付を書き換えず、親が実際の新確認の必要性を扱う。スクショや新tokenは要求しない。
4. 完成recordのUTF-8 bytesを確定し、その同じbytesのSHA256を計算する。既存 `GEMNAO_PREVIEW_APPROVAL_RECORD` と `GEMNAO_PREVIEW_APPROVAL_SHA256` を本人保護Environmentへ設定し、gate成功後に本人が最終Approveする。secretの保護・配置を変更しない。
5. 成功receiptのDB ID、Worker ID/name、version/module hash、cron、6回confirmedを照合する。次の実cronによる削除成功heartbeat確認は別の読み取りで行う。設置成功だけで自動削除・通知・保存QAを合格扱いしない。受付はOFFを維持する。

本会話への通知承認は済んでいるが、この操作は通知transportを設置しない。DBのheartbeatを無人取得する経路は未接続。保護secretの複製や本人Approveの迂回は行わない。
