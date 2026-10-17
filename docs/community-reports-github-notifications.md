# GitHub標準通知による投稿受付監視（実到達は未確認）

2026-10-17、所有者がChatGPT監視の到達を確認できない場合の無料GitHub Actions通知への変更を承認。既存ChatGPTタスクは変更・停止しない。新credential、外部通知サービス、セキュリティ変更は不要。本人の通知設定は親ブラウザでActionsのOn GitHub/Emailと失敗のみ通知が有効と確認済み。宛先・個人情報は保存しない。

## 最小変更

既存 `.github/workflows/community-reports-public-health.yml` は変更せず、その既存コマンドが実行する `public-health-check.mjs` を修正する。固定公開URLへの認証なしGET一回、redirect禁止、10秒timeout、no-store、既存schema/鮮度検査を維持する。503（閉鎖中も含む）、OFF、invalid、stale、取得不能は終了コード1にし、GitHub標準の失敗通知の対象にする。正常だけ0。JSON receiptの notificationDeliveryVerified=false は常に維持する。別ホスト、ヘッダー偽装、拒否後の再試行は追加しない。Cloudflare設定・アプリ・D1・DO・受付・cleanup設定は変更しない。

closed-setupの既存monitor_receiptに代替形式を追加：

`GITHUB_SCHEDULE_ALERT_RECEIVED@RUN_ID@YYYY-MM-DDTHH:mm:ss.sssZ`

このリポジトリのpublic-health **定期（event=schedule）run** の失敗通知を本人が実際に受信した日時（UTC、24時間以内）。run IDは数値、日時は正規ISO、未来・期限超過・追加文字は拒否。receiptに固定repoのrun URL・event・本人申告であることを保存する。これは通知/イベントをAPIで独立検証する機能ではない。本人申告前に親がrunのworkflow、event、source SHA、結論、healthステップと実測receiptを読み合わせる。ジョブ失敗、設定済み画面、手動runの通知、合成テスト結果だけではこの形式を入力しない。従来ChatGPT形式も保持し、未知の到達をtrueへ変換しない。

## 公開・試験手順

1. 対象変更だけcommit/pushし、remote SHAを確認。Pages通常配備を避ける `[CF-Pages-Skip]` commitを使う。既存の毎時17分scheduleが新コードを読むため、反映後は閉鎖中の503で実際の失敗通知が発生し得る。
2. 本人アカウントで既存workflowをbranch gemunaoから一度手動起動できる（入力なし）。これは読取りだけでEnvironment承認不要。実測503/OFFによる失敗を確認する。GETが403等なら拒否後に再試行せず、監視経路未確認として停止する。テストステップ自体の失敗はhealth検査成功の代用にしない。
3. 次の**定期run**のevent=schedule、反映SHA、実health receiptと終了コード1を確認。そのrunに対応する本人のGitHubまたはメール通知の実受信日時を確認する。手動通知と定期通知を混同しない。未到達・未起動なら保留する。
4. 確認済みの定期run IDと実受信時刻をmonitor_receiptに入れ、既存closed-setupを `start-free`、`source_sha=<反映SHA>`、`confirmation=START_FREE_REPORTS_30D_CLEANUP_AND_CRON:<反映SHA>` で起動。既存本人Environment承認、直前の空DB・binding照合を維持する。この段階で初回を含むcleanup cron開始、受付はOFF。
5. 実cleanupのDO/D1成功がhealthに反映された後だけ `open-free`、同SHA、`OPEN_FREE_REPORTS_AFTER_VERIFIED_CLEANUP:<SHA>`、24時間以内の同実受信根拠を使う。実cleanup成功なしでは公開不可。開放後のhealth確認と設定追随commitは既存手順通り。

通知の発信はGitHub標準機能が行う。こちらでメール送信・受信者代理承認はしない。通知受信日時・run IDは未取得であり、文書の形式例は実証拠ではない。

## 実行者・受信条件と限界

GitHub公式ではscheduled workflowの通知先はcron構文を最後に変更したユーザー。既存cron行はcommit f850f488bd7d015bc34c00d44dfb83a3db3cea54に由来し、親が確認した本人アカウントへの紐付けをGitHub commit metadataでも確認した。今回cron行を変更しない。手動dispatchの通知を受け取れてもscheduled run受信を実測する。個人通知設定や配信先の将来変更で到達しなくなる可能性がある。

GitHub scheduleは混雑で遅延・欠落し得る。本件では既に長い欠落があり、毎時17分でも75分以内の観測は保証できない。workflowが起動しない場合は失敗job自体がなく、**この方式だけで監視自身の停止・通知不達を検知できない**。同じschedulerに別workflowを追加しても独立した停止検知にはならない。既存ChatGPTタスクも独立監視として検証済みとは扱わない。新しいcron時刻や頻度の変更による解決は主張しない。

受付側のcleanup記録鮮度チェックは別に維持されるが、通知を保証しない。今回の承認は基盤変更の承認であり、確実な毎時通知や独立した監視停止検知を実現したとは報告しない。この制約を明示して親が開始判断する。追加の独立監視が必要という条件なら、この範囲では公開ブロッカーが残る。

公式資料:
- https://docs.github.com/en/subscriptions-and-notifications/how-tos/managing-github-actions-notifications
- https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule
