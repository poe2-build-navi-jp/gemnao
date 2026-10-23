# 一回限定のprivate診断QA実行

候補ソースは `941e0a156473b9fff5963aeefacc6afda9891399`。固定driverと専用DOを新しいQA Worker一つに同梱する。既存QAサイトのコード・資産・binding・認証期限を変更しない。新Workerだけに既存QA DBへのPRIVATE_DIAGNOSTIC_DB bindingを付ける。DB自体の権限はテーブル単位ではないため、コードのprivate名前空間制約と固定driver以外のHTTP拒否を維持する。

操作名は `private-qa-finite`。既存 `feedback-preview-control.yml`、既存許可branch、既存 `gemnao-preview-data` 本人承認を使用する。新しいworkflow/credential/認証設定は作らない。既存EnvironmentのQA passphraseを一時使用し、新WorkerにはそのSHA256 verifierだけを設定する。管理キー・通知キーではない。Secretが存在しない場合は何も配備せず停止する。

- gateは無保護の同名secret fallbackを拒否する。protected jobでexact run/head、attempt 1、branch head不変、本人の実際のEnvironment approval、同一headの起動一回を確認。
- Cloudflareは固定アカウントの既存QA DBとQA設定、新Worker名だけ。全体inventory、過去403対象、production、billing、cron、secret API、DELETE APIは許可しない。
- DB識別、既存QA受付OFF/binding、legacy cleanupの2時間以内heartbeat、private schema無し、新Worker名無しを確認。404だけを不存在と扱い、401/403を不存在扱いしない。
- Worker/SQLite DO作成→private schema追加→認証必須のWorker URL有効化→固定合成driver一回→runtime OFFアップロード→OFF設定readback。
- provider管理要求は通常10、ハード上限20。driverのD1入口は固定13回、guardの用途別ハード上限合計36。SQL文数・課金行数とは別。期間は最初の書込み直前に一度だけ固定し最大900秒。再試行は一切しない。
- 認証付きHTTPは固定新Worker originへだけ送る。既存originのhash pinで別送信先への変更を拒否する。成功応答はok booleanだけ。本文、receipt ID、cursor、credentialをlogへ出さない。
- 新Workerは既存QAのpassphraseを再利用するが、その認証ゲート・driver・期限以外の入口を持たない。ログ/observabilityはOFF、preview URLはOFF。一般受付や運営閲覧を開始しない。
- 失敗/不確実時は後続処理を停止し、再起動しない。最長15分でゲートが閉じる。成功時はDO closeと合成6表の空確認をdriver内で完了し、管理経路でもruntime OFFを確認する。
- 成功後もQA Worker 1、SQLite DO namespace 1、private schemaとDB bindingが残る。DOを消して予算を復活させない。失敗後の残存確認・対象限定復旧は別の読み取り照合を先に行う。DB DROPやlegacy削除をしない。

`pins.json` はレビュー済み実行bundleとmigration bytesのSHA256。plan hashはprofileの固定条件とpinsから生成する。bundleは候補のdriver/既存QA認証ヘルパーに `entry.source.txt` の固定入口を付けてesbuildで作成した。通知の合成認証文字列はdriver内だけで使用し、実際の通知credential・OAuth・メール・新cronは作らない。

検証：`node --test ops/private-diagnostic-execution/*.test.mjs`、`node ops/private-diagnostic-execution/local-worker-check.mjs`。後者は正確な配備bundleをローカルSQLite DO/D1で実行する。Remote成功とは扱わない。

無料プランを変更せず、利用量未測定のまま既存の小容量・枯渇時停止モデルを使う。新規resource作成権限が不足すれば停止し、権限拡張や有料化へ切り替えない。
