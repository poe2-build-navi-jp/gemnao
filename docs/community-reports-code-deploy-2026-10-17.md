# Community reports: code-only配備

既存workflow **Community reports closed setup** に `deploy-code-only` を追加。既存 `gemnao-d1-production` のreviewer・branch保護、同一concurrency group、初回run限定を維持する。bootstrap処理は呼ばない。

## 確定した範囲

アプリコードの基準commitは `9afbc63211a16c7e3584fe261c6b27dec26999a1`。このcommitから変更可能なのは今回のworkflow、配備controller、新配備module、専用test、この文書の5ファイルだけ。通常コード・Wrangler設定・lockfile・旧bootstrap scopeに差分があれば停止する。実行時には入力source_shaとGITHUB_SHAとcheckout HEADの40桁SHAが一致し、確認文字列もそのSHAを含む必要がある。

資格情報なしのgateでコードをbuild/packageし、SHA-256 manifestへ全Pages資産・guard/cleanup bundleのbyte hashとsource SHAを固定。保護Environment承認後にartifact digest、ファイル集合、各byteを再検証する。既存Pages upload経路を使用し、既存config・preview・secret descriptors・build設定を配備前後に照合する。

許される変更は次の3回のみ。応答不明時は同一runで再試行しない。

1. 既存 `gemnao-community-reports-guard` のコードPUT。
2. 既存 `gemnao-community-reports-cleanup` のコードPUT。
3. `gemnao` の同一設定によるPages配備。

Worker uploadは既存binding型を `keep_bindings` で維持し、新binding・credential・DO migrationは送らない。D1 UUID `3141aae6-8dc9-47e9-a8a2-7a05f642f94f`、guard namespace `54f03069afc249779996d92530e835e1`、instance `c3cdfc3f-6ba1-495e-b3fd-a377b610b25e`、guard migration tag `v1` を維持する。事前に全reportフラグOFF、bootstrap OFF、URL/preview OFF、cron空を要求する。Pagesの許可開始点は成功deployment `a7ed93fa-b823-40a0-a8e6-6e0198dd8337`／source `fa5f0f5904423aff596b671ad7b3c187c8acefc6` に固定。異なる開始点を自動採用しない。

Free日次枠のmode設定・受付ON・bootstrap・SQL・実cleanup・cron・secret・権限変更はこのoperationに含まれない。healthは引き続き閉鎖でよい。実cleanupが動いたことや、一般公開完了を配備成功から推定しない。

API仕様: [Upload Worker Module](https://developers.cloudflare.com/api/resources/workers/subresources/scripts/methods/update/) の `keep_bindings` と任意のmigrationを確認。metadataは現在settingsの互換日付等を保持する。Cloudflareが未知のbindingや設定を返した場合は安全側に停止する。並行変更は各段階のsettings/etag/Pages anchor照合で検出するが、他経路からの変更まで原子的にロックするものではない。

## 起動

[workflow画面](https://github.com/poe2-build-navi-jp/gemnao/actions/workflows/community-reports-closed-setup.yml) でRun workflowを選ぶ。

- Branch: `gemunao`
- operation: `deploy-code-only`
- source_sha: この配備経路を含むレビュー済み40桁commit SHA（最終報告に記載）
- confirmation: `DEPLOY_REPORTS_CODE_ONLY:` に同じ40桁SHAを連結

gateの成功後、同じrunの `control` jobが `gemnao-d1-production` 本人承認待ちになる。承認URLはrun生成後に確定する。代理承認しない。runのSHAが入力SHAと一致しない、再実行attempt、保護不足、コード・binding・Pages開始点の不一致は拒否する。既知のCLI workflow GET Forbiddenを再試行しない。

artifactは同一runのimmutable artifact IDから取得し、credential投入前のdependency installを維持。結果は `closed-reports-receipt-<run_id>` に保存する。途中で失敗した場合はreceiptのcompleted/nextWriteを確認して止め、旧bootstrapによる初期化やDB復元を行わない。Pagesが更新済みなら開始点も変わるため再dispatchは拒否される。再試行・rollbackが必要ならその対象を別途レビューする。

## 親から本人へ提示するcleanup承認文

> 次は受付OFFのまま、専用REPORTS_DBでcleanupを1回実行します。実行直前に対象件数を読み取り確認し、binding・instanceが一致しなければ停止します。期限切れ、または削除済みの投稿本文・公開本文・改訂本文・監査証拠を消去し、撤回待ちでない期限切れ投稿は関連履歴とともに削除します。記事引用の撤回待ちは本文を消し、必要な参照記録を残します。古いrate記録も削除し、成功記録を更新します。消去内容は元に戻せません。ほかのDBやguardの削除印・累積件数は消しません。この1回の実行を承認しますか？

cron開始はこの承認に含めない。別途「15分ごとに起動し、初回・失敗後・前回成功から1時間以上のときだけ同じcleanupを実行する」継続処理として承認を得る。最新実対象件数・成功記録・監視通知到達を未確認のまま正常扱いしない。
