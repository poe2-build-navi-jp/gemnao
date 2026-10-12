# 本番 cleanup heartbeat の限定読取り

設置 run [38207736391](https://github.com/poe2-build-navi-jp/gemnao/actions/runs/38207736391) は source `a7a0c08dcf89e9c2f99ca19863a5ea545ffb70c4`、attempt 1 で成功した。
provision job `114674925272` の 2026-10-12 06:44:48 UTC receipt を `cleanup-installation.receipt.json` に保存した。
新Worker・version・cron 各2件、計6書込みが confirmed。receipt は設置成功の証拠であり、実cronの成功や通知配送の証拠ではない。

## 読取り対象と結果

`production-cleanup-health` は専用本番DB2つの metadata GET 各1回で ID/name を確認してから、固定SELECTを各1回だけ実行する。

- 診断共有 `1ef1f798-7518-4b1a-a5a6-4f6f7dddfcfe`: `SELECT value,expires_at FROM diagnosis_operations WHERE key='cleanup_success' LIMIT 1;`
- feedback `f3379342-bb5e-461c-bad3-1175be8836c5`: `SELECT last_cleanup FROM diagnostic_retention_health WHERE singleton=1 LIMIT 1;`

D1 API は SELECT でも HTTP POST `/query` を使う。SQL全文・DB ID・返却列を固定し、DB書込み・本文・削除用秘密の取得・任意SQL・再試行を拒否する。
Cloudflareリクエストは最大4回、SELECT最大2回、結果最大各1行。Worker/Cron操作、DB一覧、QA DB、通常DB、Artifact作成、配信、受付ONは行わない。
既存の保護ジョブの依存パッケージ準備・合成テストは維持するが、実読取りは Artifact SDK をロードせず claim/upload を行わない。

診断共有の成功時刻が **2026-10-12 07:17 UTC以後**、feedbackが **07:43 UTC以後**で、未来でなく2時間以内ならそれぞれ `healthy:true`。
`lastSuccessAt` はUTC ISO形式。欠落・古い・予定時刻より前の値は `pending:true`、不正な列や書込みを示す応答は停止する。
両方正常な場合だけ `actualHeartbeatVerified:true`。常に `intakeEnabled:false`、`alertDeliveryVerified:false`。
確認できるのは成功heartbeatの記録であり、全データの削除完了や通知配送ではない。

## 最小実行手順

1. 許可済み `prepare/feedback-preview-controller-20261007` の新headを確認し、既存 workflow `feedback-preview-control.yml` を operation=`production-cleanup-health` で **新runを1回**開始する。設置runのrerunはしない。
2. gate成功後、**07:43 UTC（16:43 JST）以後**に既存Environmentの本人Approveを行い、両方の次cron後の値を1runで確認する。実行の遅延を考慮して数分後の確認が適切。早すぎる場合のpendingは故障の断定ではない。
3. `lastSuccessAt`、`healthy`、`pending` を親の会話へ報告する。欠落やエラーなら自動再試行せず、別の読取りrunとして開始する。通知配送は未接続のまま。

このoperationだけは、現在runのGitHub Environment本人reviewを承認元にする。実際のapproved状態・本人ID・Environment IDをAPIから確認し、固定branch、run/headとcheckoutの一致、attempt 1、管理者bypass禁止を引き続き強制する。
実行コンテキストはrunを識別する情報であり承認証拠ではない。Cloudflareへの最初の要求より前にGitHubの実reviewを照合する。承認時刻は生成しない。
この固定読取りでは、チャットでの追加作業承認、Free再確認、スクショ、record/SHA secret更新は不要。旧recordは読まず、workflowもhealth時にrecord/SHAを渡さない。
既存Cloudflare資格情報とアクセス範囲を使い、契約プランを再検証したとは主張しない。書込みoperationのrecord・60分期限・Free条件・保護は変更しない。
経路の準備だけではworkflow dispatch、Environment更新、本人Approve、DB照会を自動実行しない。
