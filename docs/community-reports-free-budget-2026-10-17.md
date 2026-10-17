# Workers Free + 永続日次受付枠（公開準備、2026-10-17）

実装・ローカル検証用の候補。承認済みの方式変更を実装したが、本番設定・Worker配備・cleanup実行・cronは変更していない。bootstrap-pinは完了済みで再実行しない。旧bootstrap専用 `closed-source.json` の保護範囲も変更しない。

## 受付と障害時の扱い

`REPORTS_BUDGET_MODE=free-small-v1` をPages、既存guard、cleanupへ一致させた場合のみ新方式を使用する。未設定なら旧方式、不明値・旧guardとの不一致は受付失敗。無料枠超過時に課金へ移行する設定は行わず、Workers Freeのサービス停止を最後の上限として維持する。アカウントの他機能・攻撃・healthへのアクセスをこのアプリが予約／制御するわけではない。共有無料枠の枯渇で削除・監視も一時停止し得る。

既存固定instance `c3cdfc3f-6ba1-495e-b3fd-a377b610b25e` 内の小さい別キー `daily-budget-v1` に日付、最終消費秒、4カウンターのみを保存。同じDO transactionで確認・消費する。投稿内容・所有鍵・IPは保存しない。ledger本体の累積100件・削除印は上書きせず、別namespaceや初期化は不要。

| 枠       | UTC日ごとの上限 | 対象                                                                 |
| -------- | --------------: | -------------------------------------------------------------------- |
| general  |             128 | status、一覧、所有者閲覧、作成・更新、通報。無効入力や後段失敗も消費 |
| deletion |              32 | 所有者削除。一般枠・受付停止から独立                                 |
| admin    |              32 | 認証済み管理操作、閉鎖検証のinspect                                  |
| cleanup  |              48 | 実maintenance、閉鎖検証のerase。日次上限後はD1処理なし               |

D1のhealth確認・ネットワーク別rate処理より前に消費し、返金しない。UTC 00:00以降の次回受付で日付更新。再起動で枠は戻らない。時計逆行・不正カウンター・保存障害は閉鎖。DO storageを過去状態へ戻したりカウンターを手動削除しない。read-only healthはカウンターを変更しないため、このGET自体は日次枠では制限されない。

既存の管理者緊急停止（空のobserve）はFree方式でも永続停止し、cleanupやUTC更新で一般受付を再開しない。削除・cleanupは継続できる。停止解除の自動処理は設けていない。解除は別途レビューが必要。

新方式ではGraphQLの未取得値・coverage時刻を正常とみなさず、collectorは実行しない。health schema v2は `budgetMode:free-small-v1`、`observedAt:null`、`validUntil:null` を明示する。正常判定にはDOとD1両方の実cleanup成功記録（2時間以内）と既存監視の確認が必要。一般枠枯渇は503 health/429 API。一般受付OFF、PUBLIC OFF、BUDGET未確認なら公開しない。

## 初期値の根拠と検証範囲

隔離SQLiteで実際のコードを実行したSQL文数: status 5、空の公開一覧6、新規作成10、1件管理一覧11、1件削除13、空cleanup13。既存テストは5件管理一覧が50 query以内であることも検証する。日次192件の通常API枠（128+32+32）とcleanup48回に限定し、累積100作成・各20改訂・監査上限・rate制限も維持する。通常のhourly cleanup24回に対し48枠は失敗再試行の余地。これは初期pilot用の保守的な制限であり、閲覧やstatusも消費するため少人数でも枯渇し得る。

文数はCloudflareの課金対象rows_read/rows_writtenとは異なる。索引・cascade・走査・他機能の負荷を含む本番課金行数や10ms CPUの実測値はまだなく、「この日次枠なら全アカウント枠内」とは保証しない。再cleanupでは消去済み本文・改訂・監査行を書き直さず、fixtureの再実行で書込みはheartbeat1行のみ。初回の既存期限切れ内容消去にはより多くの行処理があり得る。

`node scripts/check-community-reports-admission.mjs` は150件並行、再起動、UTC境界、時計逆行、破損、保存失敗、後段失敗消費、一般枠枯渇後の実削除、未認証管理拒否、cleanup拒否時SQLゼロ、旧guard・未知mode拒否、cleanup鮮度、緊急停止永続化、実API処理コストを検証する。実ネットワーク・本番データ・秘密情報は使用しない。既存API/運用/統合回帰とpublic health/publication検査も対象。

## 公開準備と残る操作

対象D1 `3141aae6-8dc9-47e9-a8a2-7a05f642f94f`、guard namespace `54f03069afc249779996d92530e835e1` と上記instanceを維持。

1. 同じ既存Workersのコードと上記modeを更新し、Pagesにも同じmodeを設定する段階は受付・PUBLIC・REVIEW・BUDGET・BOOTSTRAPをOFFのまま行う。公開/preview URLsはOFF、cronは空、既存migration tag/namespace/bindingを維持。新credential・権限・D1 migrationは不要。
2. **現行closed-setup workflowのbootstrap専用source固定は新コードを許可しない。** 古いbootstrap操作を流用しない。現時点でこの新コード用の実行可能な配備operation/確認文字列は未作成。既存 `gemnao-d1-production` の本人承認を維持する配備経路に、今回の限定差分を正式に組み込む必要がある。CLIの既知Forbidden GETは再試行しない。ソースpushは `[CF-Pages-Skip]` とし、自動配備成功とは扱わない。
3. 実cleanupの承認を得た後、最新read-only対象確認を行ってから1回実行し、DOとD1両方の成功記録を確認。2026-10-17 04:06 UTC readinessでは対象行0だったが、実行時の件数を0と決めつけない。
4. cron開始は別承認。候補は既存15分trigger `*/15 * * * *`、実cleanupは初回・前回失敗時・前回から1時間以上でのみ実行。collectionは実行しない。監視の到達未確認を確認済みフラグへ自動昇格しない。遅延して2時間超なら受付閉鎖。
5. 保護された配備の成功・identity/URL/cron readback・実cleanup記録・監視到達・最新healthを確認してから一般公開フラグを反映する。公開後は既存publication-checkでHTML/CSS/JS等を確認する。現時点は公開済みと報告しない。

### 本人承認に提示する実cleanupの内容

専用REPORTS_DBの期限切れレポート、および固定guardで削除済みのIDに対応する本文・公開本文・改訂本文・監査証拠を消去する。期限切れかつ記事引用撤回待ちでないreportは削除し、外部キーcascadeで関連履歴等も消える。撤回待ちは本文を消し、参照メタデータを残す。古いrate記録を削除し、実行記録を更新する。既存の別機能DB、guardの削除印、累積作成数は消さない。消去した内容は不可逆で、過去DB復元による復活は運用対象外。cron承認はこの処理の継続実行を意味する。実行前のread-only件数確認、不一致時停止、一般受付OFFを条件に本人へ提示する。

公式条件: [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)、[D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)、[Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)。Free維持の確認を有料プランでも同じと解釈しない。

既存のcollector schema v2ローカル案3ファイルは別の未公開案として保持し、このFree方式の有効化に必須とはしない。
