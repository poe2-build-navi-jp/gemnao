# 鬼武者総合ハブ：セーブ検索意図の入口改善

- 基点: origin/gemunao = 55363b1c15db4eb5aabdd52c8030e18037ddded7
- 作業ブランチ: improve/onimusha-hub-save
- 対象: /games/onimusha-way-of-the-sword の日本語ハブ。タイトル・URLは維持。
- セーブ方法の短い結論、バックアップ・同期競合の既存共通記事への案内、保存パスとCloudのFAQ 2問を追加。既存7症状の記事案内を維持。
- 英語版の本文、既存6記事改稿、ホスティング・DB・認証・受付設定は変更していない。

## 出典確認（2026-10-21）

- https://store.steampowered.com/app/2638890/Onimusha_Way_of_the_Sword/?l=japanese : リリース日2026年9月3日、Steamクラウド表記を確認。
- https://steamcommunity.com/app/2638890/discussions/0/589562598193771782/ : Capcom Customer Service Center の公式トラブルシューティング。
- 上記公式資料で保存パス・オートセーブ条件は確認できない。本文に未確認範囲を明記し、既存内部データのパスをハブで表示していない。
- https://game8.jp/onimusha-ws/813817 : 破魔鏡のセーブ機能。公式ではない攻略情報として明記。実機プレイ検証ではない。
- カプコン製品サイトは403で取得できず、上記Steamの公式情報で照合。

## 検証

- pnpm build: 成功（609 editorial snapshots / sitemap 591 URLs / OG 536 pages）。最終ログを同梱。
- 変更ファイルのoxlint: 成功。
- pnpm typecheck / tsc --noEmit: 成功。基点でも成功。この環境では過去に報告された19件は再現せず。
- pnpm lint: 失敗10件。基点のoxlintでも全く同じ10件。discord-server-directory.tsx 4件、feedback-stats-d1/control.test.mjs 6件。過去の29件という数値を今回の結果として流用していない。
- check-onimusha-save-answer.mjs --built: 成功。日英の根拠境界、内部導線、未確認パス、FAQ数、canonical等。
- check-onimusha-english-build.mjs: 成功。日英各8ページの静的HTML、相互メタデータ、sitemap等。
- run-onimusha-localization-check.mjs: 英語トップの個別記事直リンクを要求する旧assertで失敗。基点でも同じ失敗を再現（同梱ログ）。
- Chromium 375 / 1440px: 横はみ出しなし、画面の文字切れなし。FAQ開閉、セーブ方法へのアンカー、バックアップ記事への遷移、マイゲーム追加・解除、詳細記事9リンクのHTTP 200、自己canonical・OG、h1一つ、pageerrorなし。
- ブラウザ検証はlocalhostの開発サーバー。APIは読み書きをモックし外部通信を遮断。回答送信・実DBへの書き込みは行っていない。
- ブラウザスクリプトは一時環境用の絶対パスを含む再現記録。公開サイトの機能コードではない。

## 未検証

ゲーム実機、個々のPCの同期状態、セーブの保存先・復元成功、SEO順位・CTR改善は未検証。公開後の配備とHTTP確認は作業の最終報告で補足。
