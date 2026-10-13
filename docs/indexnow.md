# 記事の変更をIndexNowへ通知する

`ping:index` は **既定ではdry-run**。新規・更新した公開記事だけを明示的なJSON一覧から扱う。日付だけでサイトマップ全件を選ばず、Google WebSub通知も行わない。既存の公開キーを再利用するため、secret追加や権限変更は不要。Bingの `msvalidate.01` タグとは別の仕組み。

## 変更一覧の作成

変更前・変更後それぞれの完全なコミットを、別checkoutで `pnpm build` する。未コミットの編集を混ぜず、`--commit` には実際にビルドしたcheckoutの40桁SHAを指定する。`snapshot` はSHAを自動推測しない。ビルド出力の対応は実行者が確認する。

```sh
mkdir -p outputs/indexnow
node scripts/indexnow-plan.mjs snapshot --root /path/to/before-checkout --commit BEFORE_SHA --out outputs/indexnow/before.json
node scripts/indexnow-plan.mjs snapshot --root /path/to/after-checkout --commit AFTER_SHA --out outputs/indexnow/after.json
node scripts/indexnow-plan.mjs diff --before outputs/indexnow/before.json --after outputs/indexnow/after.json --out outputs/indexnow/changed.json
pnpm ping:index --urls outputs/indexnow/changed.json --dry-run
```

比較対象はビルド済み記事のtitle・description・本文・リンク先・画像の代替テキスト。共通ヘッダー／フッター、JS/CSSのハッシュ、hydration、レイアウト属性だけの変更は除く。変更された本文中の関連記事リンクも対象になる。削除記事、ホーム、ハブ、診断共有、API、プレビューURLはこのコマンドの対象外。候補一覧を確認し、内容変更の根拠がないURLは送らない。JSONは `baseCommit`、`headCommit` と各URLの前後ハッシュを保持する。

## 本番配信後の確認と送信

現在は手動の公開後作業とする。既存のPages自動配信はpush時点でまだ完了していないため、push workflowやビルドコマンドからは呼び出さない。将来自動化する場合も、正確な本番配信成功イベントと永続receiptを用意してから接続する。

```sh
pnpm ping:index --urls outputs/indexnow/changed.json --verify
pnpm ping:index --urls outputs/indexnow/changed.json --send --state-dir /path/to/persistent-gemnao-indexnow-receipts
```

`--verify` は読み取りだけ。`--send` も次の全条件を毎回確認する。

- `gemunao` の現在のheadがJSONの `headCommit` と一致。
- そのSHAに対する、既存Cloudflare公式AppのゲムなおPagesチェックが最新実行で成功。
- 本番originの既存キー本文がローカルの公開キーファイルと一致。
- 全候補が本番originの許可された記事URLで、リダイレクトなしのHTTP 200・HTML・自己canonical・noindexなし。
- 公開HTMLの本文ハッシュが確認済みビルドと一致。
- 確認後と各再試行直前にもbranchと配信チェックが変わっていない。

どれかが未確認ならPOSTしない。通信403、GitHub APIの制限、認証画面、キー不一致を解除するオプションはない。アクセス拒否を別ホスト・別プロキシで迂回しない。通常の許可された実行環境で同じ検証を完了させる。本番キー／記事をブラウザーで目視確認しただけではコマンドの検証を省略できない。

## 結果と再試行

送信先は `https://api.indexnow.org/indexnow` のみ。最大10,000件で、超過時は切り捨てず停止する。200は通知受理、202は受理後のキー確認待ち。どちらも検索掲載・クロール完了の証拠ではない。

`--state-dir` は必須で、全実行で同じ永続ディレクトリを使う。`receipts.json` と `submission.lock` を保持し、checkout変更・ジョブ変更で削除しない。200/202済みの同一URL・本文ハッシュは再送しない。別の本文でも同一URLの再通知は5分以上空ける。

429および500/502/503/504だけ、明示的なHTTP応答を得た場合に最大3回（再実行を含む）まで再試行する。`Retry-After` を守り、30秒を超える待機指定はreceiptへ次回時刻を保存して終了する。400/403/422その他の拒否は停止する。途中の切断・タイムアウトは受理有無が不明なので `uncertain` とし、自動再送しない。

プロセス中断でlockまたは `in_flight` が残った場合も手作業で実行状況を調べる。新しいstateディレクトリで再実行して重複防止を回避しない。ログはURL・本文ハッシュ・commit・配信チェック・HTTP状態・試行回数を保持し、キー・認証情報・応答本文は保存しない。

検証: `pnpm test:indexnow`。公式仕様: [IndexNow Documentation](https://www.indexnow.org/documentation)、[FAQ](https://www.indexnow.org/faq)（2026-10-13確認）。
