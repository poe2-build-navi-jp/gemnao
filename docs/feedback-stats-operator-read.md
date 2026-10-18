# 運営者承認による匿名投票の実保存集計

公開APIの拒否を回避する経路ではなく、本人から依頼された運営者のD1読み取り。既存 `gemnao-d1-production` Environment、既存 `CLOUDFLARE_API_TOKEN`、既存の本番専用ブランチ制限とreviewer承認を再利用する。権限・キー・設定・スケジュールは新設／変更しない。トークンの現在の実効権限は実行成功まで未確認。

既存 `d1-control.yml` はsettings/preflight/applyのみで、preflightは構造確認、applyは書き込みを伴うため今回使わない。game-request inventoryも別対象。今回の `feedback-stats-read.yml` は固定SELECT一回のみの専用手動操作で、公開サイトにはimportされない。

## 起動と本人承認

1. [GitHub Actionsの専用workflow](https://github.com/poe2-build-navi-jp/gemnao/actions/workflows/feedback-stats-read.yml)でRun workflowを開く。branchは `gemunao`。
2. `source_sha` にレビューした今回の40文字commitを指定。`confirmation` は `READ_FEEDBACK_TOTALS_ONLY`。任意SQL・別DB・任意URLは入力できない。
3. gate成功後、実行ページの既存Environment `gemnao-d1-production` のReview deploymentsを本人が承認する。代理承認しない。実行前なので固有run/承認URLはまだ存在しない。
4. 成功したreadジョブのsummaryまたはartifact `anonymous-feedback-totals` の `feedback-stats.json` を親の日次通知で読む。`complete: true` がない失敗runを0件として扱わない。

既存Environmentのreviewer・本番限定policyを承認前と承認後に検証。最初のworkflow_dispatchのみ、再実行不可。Pagesプロジェクト・本番成功deployment・現DB binding・preview隔離・D1名/UUIDを確認してからSELECT。識別情報は既存D1 controllerの固定値を使用（本体gemnao-db、コミュニティ報告用DBではない）。既存の共有concurrency groupを使い、他の運用をキャンセルしない。

Cloudflare D1 query APIのPOSTはSQL実行用通信で、サイトの投票POSTではない。SQLは2表のCOUNT/SUMを同じSELECTで返すだけ。個票、topic/slug/method識別子、ラベル、IP、本文、receipt、秘密情報は取得・出力しない。応答の `changed_db === false` を必須とし、不完全応答・不正カウンタ・想定外列・403は停止、再試行なし。

## 範囲・比較・保持

- `issue_feedback`: 保存行数、context数、resolved/struggling累積回答数。
- `solution_method_feedback`: 保存行数、context数、resolved/not_resolved累積回答数。
- 全保存context（旧contextを含む）。元公開APIの179キー限定とは範囲が異なる。2表は重複する回答を含み得るので合算禁止。人数でも当日の新規回答数でもない。
- `observed_at`: SELECT内で取得したUTC。ソースcommit、当時の成功本番deployment commit、固定DB UUIDも記録。別々の時点で2表を読む方式ではない。
- 前回値は自動取得しない。差分比較は同DB・同スキーマ・同範囲、復元/リセットなし、カウンタ非減少が確認できる場合のみ。条件未確認や前回が部分取得なら日次増分として断定しない。
- 現行コードではこの2表の累積カウンタに定期TTL削除なし（永続保証ではない）。30日で削除される送信receiptとは別。artifact保持要求は7日。ジョブログ/summaryの保持はリポジトリ設定に従い、ここでは未検証。

## 不足時の停止

必要な既存権限はGitHub Environmentの保護設定を読む権限と、対象CloudflareアカウントのPages Read（現在のDB binding確認）、D1 Read（DB識別・固定集計SELECT）。D1 Edit、Pages Edit、追加キーは要求しない。既存権限不足・秘密未設定・保護未設定ならその段階で停止し、勝手に付与/変更せず具体的なblocked codeを返す。

本人が一度行う最小の実行操作は上記手動起動と既存Environment承認。日次の無人実行を認可するものではなく、毎日新規集計が必要なら現行承認の運用条件を維持する。古いartifactを新しい集計として通知しない。

## 検証状況

`node --test tests/feedback-stats-d1/control.test.mjs`：6テスト成功。すべて合成HTTP応答とローカルSQLite。固定SELECT実行、2表非合算、空DB、SQL読み取り専用、保護・SHA・branch・credential・binding、不正結果、各段階403で停止を検証。変更JSのoxlint、diff check成功。サイトのbuild/配備は不要。workflow公開commitには `[CI Skip]` を付けPages配備を抑止。

**実保存件数はまだ取得していない。** 本人承認後の成功runが必要で、準備やテストだけを取得完了とはしない。過去の公開API403の原因確定とも別問題。
