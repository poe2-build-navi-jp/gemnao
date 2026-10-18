# English Palworld dedicated server backup — 2026-10-18

対象: `/en/games/palworld/dedicated-server-backup`。既存日本語の4 STEP IDと順序を維持し、英語ハブ・トップ検索・hreflang・sitemap・OGへ登録。

公式サーバーガイドの設定・管理コマンドを再確認。自動バックアップ設定、実設定ファイル、保持間隔、AdminPassword、Save、Shutdownを照合。停止を確認してワールド全体を独立保管し、コピーを検査する手順。復元・移行の成功や保存ファイルの実機検証は主張しない。WorldIDの保存階層は既存日本語から継承した情報と明示。ホスティングの親パスを固定しない。

検証: localized 204件、変更箇所lint、strict型検査、隔離production build成功。452静的HTML、431 sitemap URL、371 OG、英語17組・内部リンク795件の回帰検査成功。Chromium 375/390/1440pxで4 STEP ID・ハブ導線・検索を確認。横スクロール、壊れたアンカー、JS例外、CSS/JS失敗なし。外部通信とAPI書き込みは遮断。

次の不足: Palworldローカルsave-data、Wilds save-data、Elden Ring save-data。Palworld公式Q&AとWilds更新告知の直接取得は403制限。更新告知は公式サイト検索結果だけでは全文の条件確認に足りないため、新しい再確認済み本文とは扱わない。Elden Ring保存階層は既存記事がPCGamingWikiに依存しており、今回の一次資料再確認は未完了。推測で本文を埋めず、未確認の復元条件を保証しない。

本番HTML/CSS/JSの直接取得は環境制限のため親ブラウザ担当で確認する。無関係のcollector未公開3ファイルは除外。
