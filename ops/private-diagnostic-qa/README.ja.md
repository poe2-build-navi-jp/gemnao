# 有限・合成データ専用QA guard（未配備）

コード候補のみ。本番guard、既存app、wrangler、workflow、binding、namespace、cronに接続していない。実データ・通知credential・Google OAuth・メール送信は対象外。

## 固定する条件

- モード `finite-synthetic-v1` 以外は拒否。開始/終了は承認対象の固定絶対時刻で最大900秒。期間は自動延長しない。
- 専用SQLite Durable Objectの同一transactionでgeneral12、deletion8、admin8、notification4、cleanup4の一度限りの予算を消費する。日次リセットなし、返金なし、reset APIなし。
- runFiniteQaStepで本人認証→guard消費→固定合成操作の順。既存handlerのhealth/rate/本文検証を含め、すべてのD1処理をcallback内に置く。入力不正・後段失敗・再送も消費する。未認証/不明用途/guard失敗はD1を呼ばない。
- object名は固定。既存状態の期間変更、時計逆行、破損、保存失敗で閉鎖。再起動でも同じ予算を使用。closeは永続的で、期限満了も閉鎖する。
- public Workerは404のみ。名前付きservice entrypointだけが専用objectへ到達する。初期設定/接続許可は別承認。public HTTPでclose/admitを公開しない。

この部品を追加しただけでは既存private APIに制限は掛からない。配備前に、固定した合成試験driverの全D1入口をrunFiniteQaStepに通し、未経由の公開routeをQA外側ゲートで閉じたままにする接続差分が必要。任意HTTP本文をsyntheticOperationへ渡してはならない。本人認証は既存QAゲートを保持し、guardが代替しない。

## ローカル検証

`node --test ops/private-diagnostic-qa/budget.test.mjs`：競合、用途別枠、後段失敗/再送、再作成、期間外、時計逆行、期間延長拒否、永続close、認証/設定不備、破損/保存失敗。

`node scripts/check-private-finite-qa.mjs`：実際のローカルSQLite DOとD1、40件同時試行で12回だけD1、実行環境停止→同じローカル永続領域で再起動しても追加D1ゼロ、既存fixture表不変、close。ログに実ユーザー/credential/remote metadataなし。

合成試験でありCloudflare本番費用、リモート権限、無料残枠、実配備を確認したとは扱わない。

## 推奨する最小分離と代案

推奨はQA専用guard Worker 1個＋専用SQLite DO namespace 1個＋既存QAへの用途限定service binding。既存本番guard・本番instance・削除台帳・日次予算は一切変更しない。QAの固定合成操作だけを許可する。既存QA Worker内にDOを同梱すれば追加Workerを避ける可能性はあるが、既存wrapper/exportとの適合と専用namespaceは依然必要。専用Worker案の方が差分を独立して監査しやすい。

既存本番namespaceの別objectを利用する案は、共有namespaceと本番guardコード変更を伴うため採用しない。メモリ内カウンターやD1内カウンターを永続preD1制限と呼ばない。

既存のQA DBはprivate専用スキーマを使う。スキーマ追加は別承認。有限試験は新しいcronを開始せず、private cleanup関数を固定driverのcleanup枠で実行する候補。既存legacy cleanup/cronを変更・停止しない。cleanupは合成データしかないことを事前確認したprivate名前空間だけを対象とし、実行許可は別に必要。予期しない既存行があれば試験・削除を止める。

## 一回の実行承認へまとめる範囲

実行前に対象QA、コード/fixture/migration/artifact hash、開始/終了UTC、既存認証方法、exact run、合成データの対象を固定する。

承認候補：QA専用guard Worker/namespace作成・binding、privateスキーマ追加、固定合成driver配備、既存QAゲートの最大15分更新、上記36回以内のD1入口試験、指定合成行だけの削除と残存確認、受付OFF/guard closeのreadback。無料プランを変更しない。本番変更・新credential・通知・有料契約・新cronは含めない。

close/期限切れ後は削除枠も停止する。したがって試験の最後に削除・残存確認を予約し、予期せぬ失敗/期限切れで残った合成行は自動的に消えたと扱わない。閉鎖を維持し、対象限定の別の復旧/削除承認へ進む。予算をリセットして再開しない。既存データのrollbackやDB全体削除はしない。

上限はD1入口の回数でありSQL行数/課金の上限ではない。guard自身のDO要求・storage、Worker呼出、index/trigger/複数SQLの消費は残る。既存のFree小容量・枯渇時停止/削除遅延モデルを踏襲し、未取得利用量を正常/予約済みと表示しない。新しい日次残枠画像や旧collectorを一律の必須条件にはしない。新規リソースを作成できない場合は有料化せず停止する。
