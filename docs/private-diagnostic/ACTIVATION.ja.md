# 非公開診断受付：残りの運用化チェックリスト

**コード候補のみ。今回の変更でmigration・binding・cron・認証・受付・通知は有効化していません。** 既存QAを再利用する選択肢を用意しましたが、メタデータ確認の成功は受信サービスの稼働や転用許可を意味しません。既存配布はv0.6.0のままです。

## 1. 対象と既存用途・残枠を確認（読み取り）

候補対象は既存QA feedback DB `gemnao-diagnostic-feedback-preview-20261007`（UUID `3a714aee-e602-4590-afd0-3c2ddd9aea8f`）。本番feedback DBではありません。既存QA Worker、既存用途・利用者・削除継続要件を確認します。既存本文や受付IDは読みません。今回のschema確認だけでは空・未使用・現在のbindingを判断できません。

現在の無料プラン、アカウント共通のDB/Worker/cron枠・容量・日次読書込余裕、既存アクセス権を確認。アプリ上限は料金上限ではありません。同じ物理DBでは使用量・容量・障害の影響を共有します。不明なら作成・配備を止め、有料化しません。既存protected controller経路を使い、403時に別credentialで回避しません。

## 2. 専用namespaceのmigrationをレビューし、実行前に承認

`migrations/private-diagnostic/0001.sql` は `private_diagnostic_reports`、`private_diagnostic_report_tombstones`、`private_diagnostic_retention_health`、`private_diagnostic_rate_salt`、`private_diagnostic_rate_attempts` と同じprefixのindexだけを作成します。事前にこのnamespaceのオブジェクトが存在しないことをschema metadataで確認し、既存なら停止して調査します。旧候補の同名テーブルmigrationは適用しません。既存データのコピー・改名・削除は行いません。

承認対象：上記UUIDにこのmigrationだけを一度適用すること。リスク：同じDB内のスキーマ追加と共通容量消費。現在は未実行です。予期せぬ結果では再試行や自動rollbackをせず確認します。

## 3. QAのbinding・認証・コード配備を個別に確定

`PRIVATE_DIAGNOSTIC_DB` を上記QA DBへ明示的に追加する候補です。既存 `FEEDBACK_DB` 等は変更せず、既存表へのfallbackを作りません。現行QAの実binding・アクセスゲート・有効期限を読み取り確認し、変更する既存Worker/versionと正確な設定差分をレビューします。管理閲覧は既存の本人用管理Cookie認証を使用し、未認証の代替画面を作りません。既存ログインは `https://gemnao.pages.dev/admin/discord-servers` の「管理キー」です。キー値をチャットへ貼る必要はありません。

承認対象：特定QA Workerへの候補コード・追加binding配備、必要なQAアクセス期限設定。受付と管理閲覧は最初はOFF。credential永続設定・新しい権限が必要と判明した場合は、その変更だけを実行前に確認します。SQL namespaceはアクセス権の分離ではないため、既存QAの他の利用者が閲覧可能でないことを確認します。

## 4. private専用cleanupと監視を実証

`cloudflare/private-diagnostic-cleanup.ts` はprivate表だけを削除し、成功した同一batchでprivate heartbeatだけを更新します。legacy cleanupやlegacy heartbeatで代用できません。候補は専用QA cleanup Worker（名称案 `gemnao-private-diagnostic-cleanup-qa`）に同じQA DBを `PRIVATE_DIAGNOSTIC_DB` としてbindingし、毎時cronを設定することです。既存cleanup・cronは変更しません。

承認対象：無料枠を確認した専用Workerの作成/配備・binding・毎時cron、private期限切れ行の自動削除、失敗/heartbeat遅延の監視。名称衝突時は採用せず停止。架空データだけで期限切れ削除・private heartbeat更新・旧表不変・停止時の本人削除を実証します。単なるcron設定一致は成功の証明ではありません。原データは30日で閲覧不可、正常な毎時処理でその後約1時間以内に削除。障害遅延と事業者backup/log保持を別に扱います。

## 5. この会話だけへの通知経路を確認

現在、ゲムなお/Cloudflareからこの会話へ直接届く対応済み接続は確認できておらず、通知未設定です。既存のGitHub/Gmail接続は管理Cookieを引き継がず、公開issue/commitやメールを中継にしません。

候補は、対応する認証済みprivate read接続が利用可能になった場合に、本文・個人情報・受付IDを返さない件数/サーバー側カーソルだけの取得口を定期確認することです。管理キーをURLやタスク本文に埋めません。新規保存成功時だけ進むカーソルを検討し、再送・削除による二重通知を合成試験します。これは即時webhookではなく、確認間隔分の遅延があります。直接通知を望む場合は、サービスに対応した正規イベント接続が別途必要です。

承認対象：実在する接続方式・認証保管先・必要権限・通知頻度/遅延・この会話という送信先。外部メール/Slack/公開メタデータは対象外。対応接続のreadが成功してから通知を設定し、架空受信→この会話に「新しい診断結果が届いた」＋最小件数/管理リンクだけが届くことを実証します。失敗監視も対応経路と停止手順を決めます。コードやタスク作成だけで到達済みとはしません。

## 6. QAとWindows実機、最後に本番を別途承認

同意OFF・全文プレビュー・内容変更時の同意解除、正しいowner/未認証拒否、二重送信・同じ受付番号の再試行、通信断/保存失敗/結果不明、削除後再送、private容量上限、両namespaceの独立quota/cleanupを合成データで確認。公開コミュニティに混ざらないことも確認します。

Windows標準ユーザーでJA/EN、EXE選択、共通/Wilds、実ログ、0件/取得失敗、中止、履歴保存→再起動→復元→ゴミ箱、専用JSON保存とブラウザ経由の試験受付を確認します。現在は実機未確認。保護機能回避・権限変更で通しません。

本番保存先・用途隔離・無料枠・認証・cleanup/監視・通知到達を改めて確定してから、本番migration/binding/配備と受付/管理閲覧の有効化を別途承認します。QAで成功しても本番を自動有効化しません。実機未検証の候補を既定ダウンロードへ昇格しません。

## 停止

新規受付は `PRIVATE_DIAGNOSTIC_ENABLED=false`。privateのbinding・本人削除API・cleanupを残します。管理閲覧は独立スイッチ。DB/Worker削除・binding除去・キー変更は別承認と削除継続計画が必要です。既存の500枠やlegacy機能は変更しません。
