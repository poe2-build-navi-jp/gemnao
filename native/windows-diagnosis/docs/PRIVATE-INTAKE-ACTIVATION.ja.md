# 非公開診断受付の運用化手順

現行の一体化したチェックリストはリポジトリの [docs/private-diagnostic/ACTIVATION.ja.md](https://github.com/poe2-build-navi-jp/gemnao/blob/feature/private-diagnostic-intake/docs/private-diagnostic/ACTIVATION.ja.md) を参照してください。

既存QA DB内で `private_diagnostic_*` namespaceを分離する未マージ候補です。旧feedback表の流用・migration・binding・cron・受付有効化は行っていません。チェックリストには既存用途、無料枠、認証、現在のbinding、private専用cleanup/heartbeat、Windows実機、対応する非公開通知接続をまとめています。

rc2 ZIPは作成時のソース・説明を含む固定のレビュー成果物です。ZIP内の旧保存先計画は新規DBを前提としていました。現在のWeb/storage候補は上記チェックリストに従い、ZIPや本番配布をこの変更で差し替えません。Windows実機未確認、通知未設定、受付準備中です。
