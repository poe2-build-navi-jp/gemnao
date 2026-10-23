# 有限・合成データ専用QA guard（未配備）

コード候補のみ。本番guard、既存app、wrangler、workflow、binding、namespace、cronに接続していない。実データ・通知credential・Google OAuth・メール送信は対象外。

## 固定する条件

- モード `finite-synthetic-v1` 以外は拒否。開始/終了は承認対象の固定絶対時刻で最大900秒。期間は自動延長しない。
- 専用SQLite Durable Objectの同一transactionでgeneral12、deletion8、admin8、notification4、cleanup4の一度限りの予算を消費する。日次リセットなし、返金なし、reset APIなし。
- runFiniteQaStepで本人認証→guard消費→固定合成操作の順。既存handlerのhealth/rate/本文検証を含め、すべてのD1処理をcallback内に置く。入力不正・後段失敗・再送も消費する。未認証/不明用途/guard失敗はD1を呼ばない。
- object名は固定。既存状態の期間変更、時計逆行、破損、保存失敗で閉鎖。再起動でも同じ予算を使用。closeは永続的で、期限満了も閉鎖する。
- public Workerは404のみ。名前付きservice entrypointだけが専用objectへ到達する。初期設定/接続許可は別承認。public HTTPでclose/admitを公開しない。

固定driver `driver.mjs` は全D1入口をrunFiniteQaStep内に接続済み。QA wrapperの既存outer wrapQaAccessをwrapFiniteQaApplicationへ置換する候補で、既存認証・CSRF・時刻制限をそのまま再利用する（existing-qa-policy.mjsは既存controllerのworker-preview-policy.mjsの無変更コピー）。追加経路は本文なしPOST /api/private-qa/runだけ。一般private APIの公開・設定変更はしない。匿名・任意本文・クエリを拒否する。既存applicationは他経路でそのまま呼ばれる。専用DOの永続claimで1回だけ実行し、同時/再送起動を拒否する。予算は最大36、通常の固定列は13 admission（general4/deletion2/admin4/notification1/cleanup2）。失敗時に再試行しない。

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

## 完成した固定driverと実行差分

`node scripts/check-private-fixed-driver.mjs` は同じwrapper/driverを実SQLite DO+D1へbundleし、既存認証/CSRF、3並列起動の1回限定、入力不正、保存・重複、管理一覧/詳細、通知メタデータ、本人削除・再削除、削除後再送拒否、後片付け、再起動後閉鎖を検証する。通知は固定の公開合成文字列をメモリ内でだけ使い、実credential設定・メール・OAuthは行わない。notification triggerによりD1 meta.changesが増え、新規保存が既存の安全な再読取経路から200になる場合も検証する（201だけを成功条件にしない）。

実行前のresource差分：QA専用guard Worker 1、専用SQLite DO namespace 1、QA WorkerにPRIVATE_QA_GUARD named-entrypoint service binding 1、PRIVATE_DIAGNOSTIC_DBを承認対象の既存QA DBへbinding 1、private migration 0001/0002、QA wrapper差替え。既存DB数・productionguard・legacyテーブル/cleanup/cronは変更なし。通知flag・本番intakeflagはOFFのまま。QAモード/固定開始終了時刻だけ追加し、既存QAゲートの同じ認証verifierを維持して期限を最大15分に限定する。設計上、新しいsecretや権限の永続追加は要求しない。ただし既存tokenが新規resource作成を許すかは未確認であり、権限不足なら追加せず停止する。上記resource/binding/migration/deploy操作そのものの承認が必要。

開始前はprivate6表すべて空でなければ無変更で閉鎖。最後は既知の合成receipt/delete_hash、試験時間、固定TEST-NETアドレスのHMAC、salt/dayを照合し、全列一致WHEREで対象行だけ削除する。legacyをSELECT/DELETEしない。最後に6表空を確認。通知cursorは公開結果へ出さない。結果はok booleanだけ。

途中障害ではfinallyでguard closeを1回試みる。close通信失敗でも期限と予算は維持され、再claim不可。削除は自動再試行せず、残存行があれば対象限定の復旧承認が必要。元Worker artifactへ戻し追加binding/QAモードを除去するrollbackは受付を再開しない。DOを消して予算を復活させない。schema/DBをDROPしない。成功後もdeployment管理経路で受付OFF/期限/closeをreadbackする。

承認記録では実対象・controller run/head・この候補commit・migrationとbundle SHA256・開始終了UTCを固定する。ここでは実行予定時刻や未取得artifact hashを捏造しない。controller dispatch/遠隔操作は未実行。

既存controllerの `cloudflare/worker-preview.mjs` での接続は次の2行差替えに限定する（既存wrapPreviewApplicationとVERIFIED_WORKER_PREVIEW_ORIGINは保持）：

```js
import { wrapFiniteQaApplication } from '../ops/private-diagnostic-qa/driver.mjs';
export default wrapFiniteQaApplication(wrapPreviewApplication(application, VERIFIED_WORKER_PREVIEW_ORIGIN), VERIFIED_WORKER_PREVIEW_ORIGIN);
```

既存controllerのartifact input allowlistは新しいdriver依存ファイル・専用guard・上記binding差分を現在許可しない。実行準備時はこの限定操作専用のplan/manifestへ明示追加し、既存exact-run/head本人承認を保持する。既存read-only operation名で書込みを実行しない。ここで実行許可やcontroller設定を変更していない。
