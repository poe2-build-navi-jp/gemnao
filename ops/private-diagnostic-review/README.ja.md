# 既存 QA メタデータ：protected controller 接続候補（未実行）

既存の成功済み controller commit `4ec99fd7d91b2320f43da8b66b664de2e75ba7d9` を土台にしたレビュー候補です。既存 workflow `feedback-preview-control.yml` に `private-qa-metadata` という固定選択肢だけを追加します。新しい workflow・credential・Environment・権限・承認記録 Secret は不要です。許可済み controller branch と既存本人 reviewer、bypass不可、exact-run/head照合を維持します。既存の record-free read-only モードと同様に、当該 run に対する GitHub Environment の承認を API で検証します。過去の approval record は読みません。

## 固定範囲

アカウント `6a09a32cba1288cccce5912015086a35` の次の5要求だけです（API root は `https://api.cloudflare.com/client/v4`）。

1. GET `/accounts/{account}/d1/database/3a714aee-e602-4590-afd0-3c2ddd9aea8f` — 既存 QA feedback DB の名前/UUID一致とfile_size。
2. GET `/accounts/{account}/workers/workers/4cde2e6602024e6b9650d26b28955010` — 既存 `gemnao-diagnostic-qa` の識別一致。
3. GET `/accounts/{account}/workers/scripts/gemnao-diagnostic-feedback-cleanup-preview/schedules` — 既存の毎時cronとの一致。
4. POST `/accounts/{account}/d1/database/3a714aee-e602-4590-afd0-3c2ddd9aea8f/query` — `scope.mjs` の `sqlite_schema` SELECT（5つの既知テーブル名/typeだけ）。
5. 同じ query endpoint — `pragma_table_info('diagnostic_reports')` の列番号/名前/type/主キーだけ。default値・本文・受付ID・件数・本人回答は読まない。

3 GET + 2 schema-only SELECT。任意URL/SQL、本文テーブルSELECT、Pages、Worker versions/settings、他DB、本番inventoryの対象は許可しません。Cloudflare要求前に既存のGitHub run・保護設定・本人承認のGETが別途必要です。5要求はCloudflare分の上限です。redirect禁止、1要求につき1回、失敗/401/403/不確実時に即停止し、別credential・経路変更・自動再試行を行いません。

最終出力は固定mode/plan hash、観測時刻、対象識別一致、容量bytes（欠落ならunknown）、既知schema/cron一致boolean、readOnly=true、reuseAuthorized=false等に限定します。生レスポンスや任意SQL結果は出力しません。SQL結果のrows_written=0、changed_db=falseも検証します。SDKのインストール・Artifact作成・DB/cron/Worker書き込みはこのモードでは行いません。

## 既存モードでは不足する理由

`cleanup-health` はUUID/nameとheartbeat、`read-only-preflight` は資源一覧と数量を内部で確認するが、今回必要なQA容量/列形状を返しません。本番inventory run38152090495の403を別経路で再試行する案ではありません。成功したpreview資源の確認に限定します。ただし過去の成功は現存credentialの現在の権限保証ではなく、今回拒否されたら停止します。

## 実行時にまとめて確認すること

レビューしたcommitを既存許可branch `prepare/feedback-preview-controller-20261007` に反映し、既存workflowの `private-qa-metadata` を1回だけ起動し、出力されたplan hash/run/headを確認して既存 `gemnao-preview-data` Environmentで本人がそのrunを承認する、という一連の読み取り実行を確認します。コード案を別branchへ置くことは実行承認ではありません。default側の既存dispatcherに選択肢登録が必要なら、同じworkflowの選択肢のみを反映し、保護設定は変更しません。

新規credential、既存credentialの永続設定、approval record/digest Secret更新、権限変更はありません。リスクは既存スコープのcredentialをrunnerで一時利用すること、5要求中2回のmetadata queryがD1読取使用量を消費すること、資源状態が承認時から変化する可能性です。実行前に現行無料プランと少量の読取枠の余裕を本人が確認すること。不明なら課金しない条件を保証できないため実行を保留します。契約・課金設定を変更せず、リソース作成は行いません。

結果は再利用の判断材料だけです。同名テーブル衝突があるため、容量・schema一致だけで既存DBを転用しません。残存用途、binding、実際のheartbeatは今回の5要求では確認しません。DB新設・namespace変更・binding変更・migration・削除有効化・本番受付開始・通知接続・Windows実機検証は別工程です。
