# 保存と安全対策

## 保存するもの

- 端末内: 選択式回答、任意のゲーム名、試した対処、結果、質問位置、共有ID。復元用管理キーは保存しない。最終操作から30日を超えた記録は次回読み取りで削除。端末が閉じている間には消せない
- `diagnosis_shared`: 128-bitランダム閲覧ID、独立256-bit所有者CookieのSHA-256、独立256-bit復元キーのSHA-256、再試行request ID、検証済みスナップショット、版、作成/更新/失効/有効期限、revision
- `diagnosis_metrics`: 日付・限定されたイベント/質問ID/action ID/statusの件数のみ、30日
- `diagnosis_rate_limits`: 原則10分枠のHMAC化アドレス識別子と回数。アドレスそのものは保存しない。per-addressレコード期限24時間、全体枠は日界で最長48時間。期限後は毎時掃除の遅延を加える
- `diagnosis_operations`: 日ごとの暗号乱数salt（最長48時間を基準）と定期削除成功時刻。saltは追跡目的ではなく、低エントロピーIPの単純ハッシュを避けるため

自由入力を共有APIで一切許可しない。Windowsユーザー名、メール、Steam ID、IP、ログ、ファイルパス、画像の保存欄はない。選択式GPUはメーカー分類までで、詳細型番は今回は収集しない。

## 共有と権限

作成確定後に管理用Cookieを準備。Cookieは`__Host-gemnao-diagnosis`、Secure、HttpOnly、SameSite=Strict、Path=/、30日。共有IDと所有者の秘密は独立してCSPRNG生成。閲覧者APIに所有者hashやキーは含めない。管理キーは作成レスポンスで一度表示し、以降は再表示不能。

Cookieに基づくPOST/PATCH/DELETEは、厳密なOrigin一致、Sec-Fetch-Site（存在するとき）same-origin、カスタムヘッダー、JSON Content-Typeを要求する。選択肢・キー集合・文字数・16KiBのストリーム読込上限をサーバーで検証。SQLはバインド。更新はrevisionによる競合検出。保存失敗は汎用503で内部SQLや秘密を返さない。

`DIAGNOSIS_ENABLED=false`でも所有者の復元/失効/削除と管理画面は利用可能。停止した共有の内容は公開APIでは読めない。期限切れ/失効したものは所有者APIにも内容を返さず、削除に必要な状態だけ返す。

## レート制限

D1の条件付きUPSERT RETURNINGで原子的に上限を守る。共有作成はアドレス由来枠で5回/10分、全体200回/UTC日。sessionは10/10分、復元キー試行5/10分、管理60/10分、API閲覧120/10分、計測100/10分。各種全体上限は原則10,000/日。拒否は429 + Retry-After。

これはアプリ内の保存膨張を抑える制限であり、CloudflareのWAF/ネットワークDoS対策を置き換えない。制限判定自体のD1要求やPages HTML読取を含め、運営側で使用量アラートと基盤制限を確認する。これら基盤設定を確認するまで高トラフィック向けの保証をしない。

## 失効・削除

作成+30日が固定期限。公開ページ/APIは都度期限・失効を検査。所有者の即時失効でスナップショットを同時に捨てる。削除APIは稼働DB行を削除。定期処理は毎時、期限切れ/失効済みの行を削除する。削除が成功してからheartbeatを更新。heartbeat不明/2時間以上古いと新規共有/更新は自動停止。既存共有の有効期限は障害中も毎回検査する。

定期処理の目標は期限後24時間以内。これを運用可能にするため、別WorkerのCron、ログ、失敗通知先/確認担当、対象DBを公開前に確認する。初期コードだけで運用確認済みとはしない。

## バックアップ等の限界

D1 Time Travelはプランにより7日/30日の復旧窓。実際のアカウントプラン、追加exports、Cloudflareアクセスログの保持設定は未確認。削除後も復旧用コピーに残る場合がある。全コピー即時削除とは説明しない。共有先の転載も取り消せない。

- https://developers.cloudflare.com/d1/reference/time-travel/
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- https://developers.cloudflare.com/workers/configuration/cron-triggers/
