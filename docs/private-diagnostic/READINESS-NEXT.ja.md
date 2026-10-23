# QA実行前の最小追加確認と通知案

準備のみ。既存の有効化チェックリストは `ACTIVATION.ja.md`。今回のファイルは実行許可・配備・受付開始ではない。

## 調査結果と追加read

既存QAはfeedback/sharing用。`ops/worker-qa-access/README.md` と更新controllerに既存ID、2つのQA D1 binding、最大1時間のBasicアクセスゲート、全受付OFFの運用がある。履歴の成功は当時の状態を証明し、現在の状態や他利用者不在を証明しない。成功済みprivate-qa-metadataはbinding、ゲート、heartbeat、無料プランを読んでいない。既存cleanup-healthモードはsharing DBにもアクセスし、現在用途には広すぎる。既存gate読取はアカウントWorkers一覧も読むが必要なD1照合を返さない。既存modeをそのまま再実行しない。

`ops/private-diagnostic-review/readiness-scope.mjs` は新しいcontroller用のオフライン許可リスト・設定projection案。ネットワーク、credential、CLI、workflow、実行adapterなし。既存のexact-run/head/owner/environment検証を維持して接続するレビューが必要。実行承認はまだない。

アカウント `6a09a32cba1288cccce5912015086a35` の以下3要求だけ:

1. GET `/workers/scripts/gemnao-diagnostic-qa/settings`。D1 bindingが既存QAの2つと一致するか、ゲート期間の有効性、既存受付OFF、private binding未追加かをbooleanだけ出力。設定応答には他のplain-text設定も含まれ得るため、raw response/log/artifactを禁止。projectionはverifierやsecret値を参照しない。JSON設定応答自体の取扱いが許可されない場合はこの要求を実行せず、本人の設定画面で対象項目だけ確認する。
2. POST `/d1/database/3a714aee-e602-4590-afd0-3c2ddd9aea8f/query`、SQL `SELECT last_cleanup FROM diagnostic_retention_health WHERE singleton=1 LIMIT 1;`。既存health判定を再利用し、2時間以内かをboolean出力。生timestampは出さない。
3. 同じquery endpointに `SELECT name,type FROM sqlite_schema WHERE substr(name,1,19)='private_diagnostic_' ORDER BY name LIMIT 33;`。namespaceが空かだけ出力。行本文・件数・受付IDは読まない。既存オブジェクトがあれば停止。

各要求1回。401/403、redirect、不確実な応答で停止し再試行しない。過去失敗したproduction inventory、一覧取得、課金API、別credentialは含めない。SQL結果はrows_written=0/changed_db=falseを検証してから判定。既存owner gateの検証GETは別途必要。公開workflowに運用値を出さず、固定判定以外を記録しない。

このreadでも無料契約・全体残枠・QA利用者は判定できない。本人のCloudflare画面でWorkers Free、D1日次read/write・全体容量、Worker/cron残枠を確認する。秘密や診断本文のスクリーンショットは不要。Cloudflare公式上はFree D1 500万read/日・10万write/日・全体5GB、Worker 100個・cron全体5個。契約・残枠の証明とは区別する。枠不足なら有料化せず停止。

## 次のQA変更の正確な範囲

上記確認後に一括提示する承認範囲は、指定QA UUIDへの `migrations/private-diagnostic/0001.sql` 一度適用、既存QA Workerへprivate bindingのみ追加し候補コードを配備（既存2binding維持、受付/閲覧OFF）、専用cleanup `gemnao-private-diagnostic-cleanup-qa` と同じDBへのbinding・毎時cron、最大1時間の本人用QAゲート更新。共有DB容量・既存QA利用との競合、期限切れprivateデータの削除が影響範囲。既存cleanup変更、本番変更、新credential・永続権限追加は含めない。新credentialや管理認証設定が必要ならその正確な設定を別に提示する。

実行前にcontroller/source/artifact/planのhashとrunを固定。合成データだけでowner認証、同意、保存/不確実/失敗、削除、旧表不変、cleanup/監視を実証した後、QA限定の受付/閲覧フラグONを明示承認する。本番・Windows新版の昇格は別段階。

## この会話への具体的な通知候補（提案のみ）

ソースにSMTP/Resend/SendGrid/Mailgun/送信bindingの既存実装はない。contact APIはDBへ保存するだけ。managed-configのsend_email記載は未表現bindingを拒否するチェックで、送信設備ではない。アカウント全体のメール設定・secret値は未取得。

最小候補: private保存成功と同じDB transactionで本文なし通知outboxを作成 → Cloudflare `send_email` bindingで確認済み本人Gmailだけに定型通知 → 接続済みGmailの新着イベント → このChatGPT会話。宛先は固定 `destination_address`、送信元は本人の利用可能なEmail Serviceドメイン。通知本文は「新しい診断結果が届いた」と固定管理画面リンクのみ。診断本文、個人情報、受付ID、削除キーを入れない。再送は新着と数えず、通知用IDは診断IDから独立させる。メールの重複・送信失敗・結果不明とDB保存成功を分け、失敗時も診断を再送させない。outboxも30日を超えて残さない。メールは別事業者側で保持され得るため診断原文は一切載せない。

Cloudflareの確認済み宛先への送信は公式上無料でAPI key不要のbindingを利用可能。ただし送信元ドメイン/Email Routing・宛先確認が必要。既存設定がなければドメイン設定/DNS変更と宛先確認、新bindingを具体化して承認を得る。ドメイン購入・有料プランは実施しない。本人Gmailの実アドレスは正規connectorで解決し、公開repoに入れない。

必要な新しい同意は「通知の中継として本人Gmailへ本文なしメールを送ること」。承認後に既存メール設定を対象限定で確認し、必要なbinding/DNS変更、outbox migration、通知workerコード、本人Gmailイベント設定と合成配信テストを具体的に提示する。現時点でメール送信・Gmail検索・通知設定はしない。

認証付きpollingは現在のGitHub/Gmail接続ではGemnao private APIを読めないため、そのままタスク化できない。対応するprivate connectorを新設・認可する必要があり、メール中継より設定が多い。使う場合は最大毎時の定期確認であり即時webhookではない。メール案もCloudflareからChatGPTへの直接webhookではなく、メール配送とGmailイベント処理の遅延・失敗がある。

一次資料（2026-10-23確認）:
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/email-service/platform/pricing/
- https://developers.cloudflare.com/email-service/configuration/send-bindings/
