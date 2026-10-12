# 障害通知の固定接続手順（実配備・通知設定は未実行）

専用Worker `gemnao-retention-health` の匿名 `GET /health` を1つ用意し、親のChatGPT会話から毎時確認する。予定URLは `https://gemnao-retention-health.soykururu143.workers.dev/health`。新token、secret複製、Environment保護解除は不要。既存のcleanup Worker/Cronとサイト配備は変更しない。

## 公開情報

JSONは固定キー `sharing` / `feedback` と、各 `lastSuccessAt`（UTC ISOまたはnull）、`status`（ok/delayed/stale/unknown）だけ。
成功時刻は固定本番2DBの既存heartbeatから取得する。本文、共有URL、削除用秘密、ユーザー情報、件数、DB/Worker ID、SQL、providerエラーは取得・公開しない。
受付flagは参照しないためOFF中も動く。診断configやfeedback GETのハンドラは呼ばない。

## 読取りの抑制

- SQLは既存の保護付きhealthと同じ2本。各DBの主キーで最大1行、更新処理・batch・任意SQL・再試行なし。
- URLは完全一致でGETだけ。クエリ文字列・別path・別hostはD1より前に拒否。Cookie・IP・Authorization・Cache-Controlをcache keyやlimit keyに使わない。
- 固定キーの5分cacheと同一isolate内の同時要求の共有で、集中アクセスによる反復SELECTを抑える。cache済み成功時刻から状態を毎回再計算する。
- cache miss時も、Cloudflare Rate Limiting bindingの固定キーで1回/60秒を設定する。missing/failed/deniedならD1を呼ばずunknown。採用されたrefreshだけが最大2 SELECTを実行する。
- Cache API自体の欠落・読取り失敗もD1へ進まない。cache書込み失敗後はisolate内cacheとrate limitが継続する。
- 公開HTTPには `Cache-Control: no-store` を返し、内部のcacheだけを使う。観測不能や異常はhealthyへ丸めない。

Rate Limitingは拠点単位・結果整合であり、厳密な全世界共通の回数保証には使えない。Cache APIも拠点間で共有されない。ここで保証するのは固定SELECT・各refresh最大2本・limit失敗時にD1へ進まないこと。分散アクセスによる全体消費をゼロにはできない。[Rate Limiting仕様](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)、[Cache仕様](https://developers.cloudflare.com/workers/runtime-apis/cache/)

## 差分と配備範囲

- `cloudflare/retention-health.mjs`: read-only fetch handler、固定SQL、cache、rate limit、公開shape。
- `cloudflare/wrangler.retention-health.proposal.json`: 専用Worker1つ、固定本番D1 binding2つ、Rate Limit binding1つ。namespace候補は `2026101201`。追加Cron/DB/KVやAPI secret bindingはない。
- `tests/diagnosis-production/public-health.test.mjs`: 受付OFF、100並列要求、cache key、rate limit欠落/失敗、非公開列、時刻、固定bindingの検証。
- `ops/diagnosis-production/notification-plan.json`: 副作用のある既存API案を除去し、専用endpointとこの会話への通知案に置換。

Wrangler参照設定は `workers_dev:false` のまま。このファイルから配備しない。既存controllerの `production-health-publish` が専用Workerを `subdomain.enabled:true` で新規作成し、review済みmoduleと固定3bindingのversionを配備する。Cloudflare書込みは最大2回、追加Cron・DB・DB書込みなし。公開承認があるこの分岐だけを公開設定にする。新bindingはWorker設定であり、API tokenをWorkerへ渡すものではない。実アカウントへのこのbinding組合せの配備は未検証。

## 本人reviewを通す実行手順

1. 待機中のread-only run `38216143650` を完了させ、結果を照合してからcontroller branchを更新する。先にheadを動かすと、そのrunの固定head検証が失敗する。
2. `prepare/feedback-preview-controller-20261007` の新source SHAを固定し、既存 `feedback-preview-control.yml` を `operation=production-health-publish` で1回だけdispatchする。未完了runがある間は開始しない。
3. `public-health-record.template.json` の `commit` と `runId` だけを実値に置換する。既存Environmentのapproval record/hashへ、完全一致のUTF-8 bytesとSHA-256を設定する。Cloudflare tokenは変更・取得しない。
4. gateの成功と対象run/headを確認し、本人が既存EnvironmentのApproveを行う。代行不可。公開承認の実時刻は `2026-10-12T07:29:52Z` に固定され、既存の60分実行枠は `08:29:52Z` まで。期限切れ時に時刻を書き換えない。
5. 2書込みのreceipt・version readbackを確認してから公開URLを直接GETする。結果不明・途中失敗なら再実行せず、既存Workerの読取り照合から再開する。

Freeの根拠は実際の `2026-10-12T06:29:58Z` の回答で、元の対象はcleanup設置。新しい確認・現在の契約API検証・使用量測定とは扱わない。この公開分岐は当該過去申告をそのまま記録し、毎時の再申告を要求しない。課金プラン変更・有料化は許可しない。既存DB設置・cleanup設置の別操作の検証条件は変更しない。

## 接続後の通知

公開後、直接GETでJSONを取得し、実成功時刻を保護付きhealth runと照合する。その後、本人承認済みの親会話宛てに毎時のcondition-watchを1件作成し、配送確認を行う。
正常が続く場合は通知せず、90分以上の遅延、120分以上の停止疑い、取得不能、不正な応答、復旧を機能名・成功時刻・状態だけで通知する。毎時確認なので即時検知を保証しない。DB書込み・受付flag操作・再試行は行わない。
通知task未作成・配信未確認。検索cacheだけで稼働確認できたとは扱わない。現在の契約プランを再検証したという主張もしない。
