# 非公開診断：既存 QA のメタデータ確認案（実行未接続）

このフォルダーはレビュー用の純粋なスコープ定義・出力射影と合成テストだけです。ネットワーク、credentials 読み取り、workflow 接続、SQL 実行、設定変更を実装していません。自動実行できる controller ではありません。

## 既存モードとの比較

- `cleanup-health`：既存 preview D1 2個の UUID/name と固定 heartbeat SELECT、QA hostname discovery。過去 run 37648312766 は healthy。容量・スキーマ・用途競合は分からない。
- `read-only-preflight`：アカウント、D1/Worker 一覧、schedule を観測する既存経路。ただし公開結果は完了フラグに縮約され、現在の無料契約・日次利用残量を認証 API で証明するものではない。
- `diagnosis-readiness`：別の固定本番対象向け。今回の QA feedback DB の調査に転用しない。
- `production-resource-inventory`：run 38152090495 は `CLOUDFLARE_HTTP_403`。同じ観測を別 credential に替えて試すためには使わない。今回の候補は成功済み preview QA 資源の確認であり、失敗した本番 inventory の代替実行ではない。

## 最小候補（まだ実行しない）

アカウントは `6a09a32cba1288cccce5912015086a35`。対象は作成 receipt と結び付いた preview feedback DB `3a714aee-e602-4590-afd0-3c2ddd9aea8f`、既存 `gemnao-diagnostic-qa` Worker と対応 cleanup のみ。本番 DB は全て対象外。

`scope.mjs` に全 GET パス3本、schema metadata SELECT 2本を固定した。HTTP 上は D1 query のみ POST だが SQL は `sqlite_schema` / `pragma_table_info` に限定。本文テーブルの SELECT・件数・ID・時刻・既存の本人回答・環境変数・secret・Pages 設定・Worker version/settings は取得しない。最大5要求、redirect/自動retryは禁止。401/403はその場で停止し、credential変更・別経路・再実行をしない。

最終 adapter の許可出力は、対象識別一致boolean、DB容量bytes（欠落ならunknown）、既知テーブル/列の期待形状一致boolean、Worker識別一致boolean、予定cron一致boolean、観測時刻だけ。provider responseや任意の名前・SQL結果をログへ出さない。未知のschemaはfalse/unknownだけにする。`databaseSummary` はこのうちDB部分の射影例。残りのcontroller統合・projection・既存承認gateのテストは、方針レビュー後に別途必要。

容量bytesはアカウントの残容量や日次quotaを示さない。現在の無料契約とアカウント共通のDB枠・容量・日次利用の余裕は、既存のowner-current-free-plan確認とダッシュボードの必要最小限の確認で補う。不明なら無料で実行できると断定せず停止。有料契約・追加課金・新規credentialを行わない。

## 承認する範囲と実行順

1. 上記の既存QA限定・最大5要求・本文なしの確認方針を承認。既存credentialがこの対象と操作を許すことを確認する。権限不足なら拡張を自動で行わない。
2. 既存 `gemnao-preview-data` protected environment と許可controller branch、exact-run owner review、既存masked record/digest/token を維持してadapterを準備・レビュー。今回のcommit、plan hash、run IDを固定する。新規credentialは不要を想定するが、現存・権限は未検証。
3. fresh approval record/digestを既存Environmentへ更新する場合は、その永続設定変更を別途明示承認してから行う。key値をチャットへ送らない。workflow dispatchと待機runの承認も対象runを特定して行う。過去runを再実行しない。
4. metadata結果を見てQA再利用方式を判断する。現行候補と既存feedbackは同じテーブル名・スキーマなので、存在確認だけで未使用/空/転用可とは判断できない。用途確認・既存削除継続・namespace分離等の変更を別途設計・承認する。今回の確認はDB新設、binding付替え、migration、cleanup変更、受付開始を一切承認しない。

同意された30日保持と管理キーの本人限定保有は、新しい権限付与・保護解除・実行承認の代わりではありません。通知接続とWindows実機検証も別工程です。
