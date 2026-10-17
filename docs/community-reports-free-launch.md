> 2026-10-17追記：GitHub標準通知を使う承認済み代替経路は [community-reports-github-notifications.md](community-reports-github-notifications.md) を参照。下記のChatGPT未確認記録は当時の履歴。ChatGPTタスクは親で存在・有効状態を確認済みだが実受信は未確認。既存タスクは変更しない。inspect-cleanup run39005896813 は05:24:43 UTCに成功し対象5表・削除候補・古いrateは0件、binding一致、productionChanged=false。開始時には件数を再取得する。

# 初回Free受付開始の限定operation（未実行）

コード配備run39003076598、source `8f964ad2d63cfaf8059da4128f5120229c23f92f`、Pages `7215d9ee-cfc7-45a2-89cc-a06849a2ca28` の成功receiptを確認済み。親ブラウザの2026-10-17 04:50:57 UTC公開healthはschemaVersion1、ok=false、intakeEnabled=false、publicEnabled=false、reason=not-configured、cleanupAt等null。一般受付OFFを確認。今回の変更は準備・テスト・ソース保存だけで、本番操作はしていない。

## 起動値

既存 **Community reports closed setup** workflow、branch `gemunao`、既存Environment `gemnao-d1-production`。新しいworkflow・credential・権限は作成しない。全操作でreviewer/branch保護と初回attemptを検査し、入力source_sha=実行GITHUB_SHA=checkout HEADを要求する。appコード・binding・既存Wrangler設定は上記配備commitから変更不可。許可するのは今回のcontroller/workflow/SQL/test/文書だけ。

| operation       | confirmation（SHAは同じ40桁source_sha）      | 作用                                                                                                                     |
| --------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| inspect-cleanup | READ_REPORTS_CLEANUP_COUNTS:SHA              | 固定metadata GET＋専用D1への固定SELECTだけ。build/配備なし、mode/cron変更なし                                            |
| start-free      | START_FREE_REPORTS_30D_CLEANUP_AND_CRON:SHA  | guardとcleanupの限定設定、受付OFFのPages設定を反映してから、初回cleanupを含む15分cronを開始。受付は開かない              |
| open-free       | OPEN_FREE_REPORTS_AFTER_VERIFIED_CLEANUP:SHA | 同じmode/binding・cronと実cleanup成功を確認してPagesの受付/一覧/管理/予算確認フラグだけを有効化。Worker/cronは変更しない |

start-free/open-freeの `monitor_receipt` は、本人が指定の投稿受付用タスクの存在・有効状態・実通知受信を確認した場合に限り、`CHATGPT_REPORTS_ALERT_RECEIVED@YYYY-MM-DDTHH:mm:ss.sssZ` を入力する（実受信時刻、UTC、24時間以内）。空欄、別形式、未来、期限超過はgate/runで拒否。機械的なjob成功を受信日時へ置換しない。これは本人申告であり、controllerが端末配達を独立検証するものではない。inspect-cleanupではmonitor_receiptは空欄。

**現在の監視ブロッカー**：今回のprivate task lookupでは取得できた11件の中に「ゲムなお投稿受付の異常監視」がなかった。別用途の「ゲムなお自動削除の異常通知」は別endpointを監視しており、代用不可。過去の作成記録だけで現在の存在・有効状態・到達を確定しない。親で正しいタスクID、enabled、親会話への通知先、実受信を確認するまでstart/openは実行しない。タスクの新設・変更は今回行っていない。

想定到達先は **本人の親ChatGPT会話（thread 01a10db8-2b45-7705-b8cc-a627082330e9）**。メール・Slackや端末プッシュ到達は確認していない。既存設計はGitHubの公開health検査を毎時17分、ChatGPT側で毎時27分JSTに確認し、75分超の古さ・欠落・取得不能・異常を通知する。新規タスクの重複登録や閾値緩和はしない。

## 件数確認と初回開始条件

対象はD1 `3141aae6-8dc9-47e9-a8a2-7a05f642f94f` / `gemnao-community-reports-production`、guard namespace `54f03069afc249779996d92530e835e1`、instance `c3cdfc3f-6ba1-495e-b3fd-a377b610b25e`。metadata・bindingを照合してから `cleanup-counts.sql` の固定SELECTを実行する。SQL改変・任意SQL・別DBはtransportで拒否。時刻と件数だけをreceiptへ出し、本文・所有者hash・IP・生ID・credentialは出さない。HTTP POSTはD1 SELECTの搬送でありSQL書込みではない。

DO使用量・保存量・GraphQLは取得しない。guard `/check` はpruneを書き込むため呼ばない。完全なguard対応dry runとは主張しない。inspectは期限切れ・物理削除候補・cascade・撤回待ち・古いrate等を表示する。

start-freeは投稿・改訂・監査・通報・記事参照の全表が0件、古いrateは1000行以下、取得時刻±60秒の初回pilotに限定する。各設定変更とcron開始の直前にも同じSELECTを読み直す。非空・不明・増加は追加レビューなしに進めない。初回に本文対象が0でも、古いrateの削除、D1 heartbeat、DO日次枠と成功記録の更新は起こる。現在の本番件数はまだ取得していない。過去04:06の0件は代用しない。

この新read-only operationは本人Environment承認後に実行できる。local環境にtokenを取り出したり、既知ForbiddenのCLI workflow GETを再試行したりしない。今回dispatchはしていない。

## 設定・実cleanup・公開の順序

start-freeは既存guardへ `REPORTS_BUDGET_MODE=free-small-v1`、cleanup/Pagesへ同modeと `REPORTS_MONITOR_MODE=public-status`、本人が確認した `REPORTS_PUBLIC_MONITOR_VERIFIED=true` を設定する。cleanup側の一般受付フラグはOFFのまま。AUTO_OBSERVATION/USAGE_PROFILE/BOOTSTRAP/VERIFICATIONはOFF。namespace/instanceは固定、再初期化・DO migration・credential API・直接SQL DELETEは禁止。公開/preview Worker URLもOFF。

Pagesを閉鎖設定でreadback後、cron `*/15 * * * *` だけを開始する。既存scheduledにより初回、直前失敗、または前回成功から1時間以上のときcleanupが走る。日次48回枠、一般128件/削除32件/管理32件は独立。provider Free全体枯渇では削除や監視も停止し得る。cron設定の成功はcleanup成功ではなく、start-freeのreceiptもcleanupExecutionVerified=falseとする。

初回が実際に走った後、open-freeは公開health v2で `budgetMode=free-small-v1`、観測時刻null、D1とDO両方の2時間以内の実cleanup成功（health実装が確認）、受付OFF時のreason=intake-disabledを要求する。同時にprovider settings/binding/cronを再照合する。不明・古い・失敗なら開かない。開始と公開は同じsource_shaで実行する。公開後healthが失敗した場合は同じ審査済みartifactでPagesを閉鎖設定へ戻す限定の安全処理を行い、失敗を報告する。配備応答が不明な場合は成功や閉鎖を推測せず、receiptのnextWriteを基に読取り確認する。cronの自動停止は含めない。

設定PATCHは既存bindingを保持し、許可した変数だけを変更。Pagesは既存managed uploadを使いpreview・secret descriptor・build設定を保持する。各段階でreadbackし、応答不明時は同一要求を再試行しない。完全に認識できる同じSHAの部分状態は次の本人承認runで確認して既済操作をスキップできる。想定外の状態は採用しない。

開始/公開は環境別の明示configで配備するため、root wrangler.jsonはこの準備commitでは閉鎖設定を保持する。**成功receiptを確認してから** `launchConfig(base, opened)` と同じ内容をsource-of-truthへ保存する追随commitが必要。receiptのdesiredConfigSha256と照合する。先にtrueを保存しない。追随完了までは通常の自動Pages配備をしない（閉鎖設定へ戻るため）。この初回controllerは別SHA/別configを黙って採用しない。

## 保存期間・不可逆な対象

- 投稿の期限は作成から30日。期限切れかguardで削除済みの本文・公開本文・改訂本文・監査証拠を消去する。
- 期限切れで未完了の記事撤回参照がない投稿は行自体を削除し、外部キーcascadeで改訂・監査・通報・参照も削除する。
- 未完了の撤回参照があるものは本文等を消し、必要な参照・構造メタデータを残す。このメタデータに自動30日削除保証はない。撤回完了を別に管理する。
- 60秒より古いrate行を削除する。guardの削除印はID発行から31日まで保持し、累積100作成枠は減らさない。初期化・guardカウンターのresetはしない。
- cronやFree枠による遅延があり、30日経過ちょうどの物理消去を保証しない。消去した内容は元に戻せず、古いD1への復元で復活させない。他機能DBは対象外。

## 親から本人への承認文案（全文）

コード配備は完了し、受付OFFを確認しました。次に、専用投稿DB「gemnao-community-reports-production」（末尾f94f）の最新件数を読取り確認します。投稿・改訂・監査・通報・記事参照がすべて0件の場合だけ、受付OFFのまま無料枠向け日次制限を有効にし、初回を含む定期cleanupを開始してよいですか？

今後保存される投稿の期限は作成から30日です。期限切れ・削除済み投稿の本文、公開本文、改訂本文、監査証拠を消去し、撤回待ちでない期限切れ投稿は関連履歴とともに削除します。記事引用の撤回待ちは本文を消して必要な参照記録を残すため、その参照メタデータには自動30日削除保証はありません。60秒より古いrate記録も削除します。消去内容は元に戻せません。他のDBやguardの削除印・累積件数は消しません。

15分ごとに起動し、初回・直前失敗・前回成功から1時間以上のときcleanupを実行します。無料枠を使い切った場合は受付停止や削除遅延があり得ます。本人のこのChatGPT会話へ届く「ゲムなお投稿受付の異常監視」について、タスクが有効で実際に通知を受信できたことを確認できない間は開始しません。現在、この接続の一覧ではそのタスクを確認できていないため、存在・通知先・実受信の確認が必要です。別用途の監視では代用しません。

対象件数・bindingが想定外なら停止します。実cleanup成功と通知到達を確認できた場合だけ、承認済みの一般受付・公開一覧・管理画面を開始します。新しい認証情報や権限は追加しません。この範囲の初回・定期cleanupと必要設定を承認しますか？

## 検証・未確認事項

合成providerと隔離SQLiteで、SELECT無書込み、対象非空・誤binding・監視未確認拒否、途中失敗停止、cron一意性、実cleanup鮮度、公開後失敗時閉鎖を検証する。本番実行・実対象件数・通知到達は未確認。既存配備/保護/manifest境界テストも再利用する。

provider仕様: [Worker settings](https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/script_and_version_settings/methods/edit/)、[Worker schedules](https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/schedules/methods/update/)。実際の設定PATCH/cron API実行は未実施で、provider拒否時は保護や権限を広げず停止する。
