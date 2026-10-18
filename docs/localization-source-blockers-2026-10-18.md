# ゲーム記事の資料再確認待ち — 2026-10-18

英語版を優先し、その後にスペイン語版・中国語版を進める。下記はゲーム固有の復元・MOD変更の条件が未確認のため新しい翻訳を公開しない。既存日本語記事を今回変更したという意味ではない。

| 候補 | 正確な資料URL | 取得状況と確認が必要な条件 |
|---|---|---|
| Palworld ローカル保存・復元 | https://docs.google.com/document/d/e/2PACX-1vTm43IoZ--_EGVCd2_tZGJNf7HzjgJmYTRkfNk8rpKWxDQgMY5Cq8_w5x6xJBpx-c7_7TIqDYSw6WRp/pub | Web取得不可、実行環境からはCONNECT403。Q&A 5-1のゲーム内復元と5-2の旧手動復元の現行区分、対象版、置換されるデータ、内蔵backupと独立したworld全体コピーの違いを確認したい。 |
| Wilds 保存・復元 | https://store.steampowered.com/news/app/2246340/view/1839676055896017 | 元記事の告知を取得できない。体験版引き継ぎ条件（製品版セーブがないこと）、対象版と更新番号を全文で確認したい。既存セーブを消して条件を満たす手順は掲載しない。 |
| Wilds 告知の確認候補 | https://info.monsterhunter.com/wilds/update/en-us/Ver.1.042.00.00.html ／ https://store.steampowered.com/news/app/2246340/view/712282517277772136 | 公式検索結果には同版の告知が出たが本文条件の確認は未完了。公式サイト直接取得はCONNECT403。見出し・検索要約だけを全文確認として扱わない。 |
| Elden Ring 保存・復元 | https://www.pcgamingwiki.com/wiki/Elden_Ring ／ https://store.steampowered.com/app/1245620/ELDEN_RING/ | 既存記事の保存階層・ER0000.sl2・GraphicsConfig.xmlは二次資料に依存。SteamストアのCloud対応だけでは手動復元互換性は保証できない。同一アカウント、版、MOD環境で復元が成立する条件と、既存状態を保持する方法を確認したい。 |
| Elden Ring 起動 | https://bnfaq.channel.or.jp/faq/detail/2836/7485 ／ https://www.fromsoftware.jp/jp/faq-games.html | 前者は今回のWeb取得で404。後者の対応説明と新しい公式FAQの所在を確認したい。古いURLを根拠に設定リセットやMOD撤去を一律推奨しない。 |
| Palworld 起動・MOD | https://steamcommunity.com/games/1623730/announcements/detail/686383649529010210 ／ https://guideline.palworldgame.com/palworld-mod-guideline | 1.0告知は画像参照のみ、ガイドラインはJavaScript必須で本文未取得。現行の非互換条件、対象の導入先・管理方法、保存保護、残留ファイルの確認条件を確認したい。名前だけでDLLやフォルダを削除する手順は作らない。 |
| Palworld MOD補助資料 | https://github.com/pocketpairjp/PalworldModUploader/blob/main/PalworldModUploader/docs/en/04-Tech.md | 元記事の公式開発者資料。現行の導入先と管理対象を上記告知・ガイドラインと突き合わせる必要がある。この資料単独で全ユーザー環境の削除対象を断定しない。 |

親ブラウザで本文を取得できる場合は、該当節と確認日時を共有すれば再評価できる。新しい権限や認証情報を作る必要はない。復元やMOD操作を実機で実行した事実はなく、成功実績は補わない。

## Steamディスク書き込みエラー英語版の中核資料

対象 `/en/guide/steam-disk-write-error` は未追加のまま保留。必要な資料: https://help.steampowered.com/en/faqs/view/21F5-8D5D-0141-7A5E 。公開本文取得では画像1行のみ、公式ドメイン検索でも該当本文は取得できなかった。確認したいのは対象ライブラリの Repair Folder の現在の操作・対象範囲、更新再試行とWindowsのドライブ検査へ分ける条件。Windowsの一般的なドライブ検査資料ではSteam固有の修復操作を裏付けられないため、代替済みとは扱わない。親ブラウザで該当節を確認できれば再開可能。一般的な空き容量の説明だけで薄い記事を公開しない。

Steamの性能モニター補助資料 https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767 は上記とは別。低GPU使用率記事はゲーム内FPSで実施でき、GPU/CPUの読み方とGPU選択はMicrosoft一次資料で独立に確認済み。Steam固有操作を必須としていない。詳細は全体QA台帳。

## Steamディスク書き込みエラー：中核資料の保留解除

2026-10-18、親担当から別担当による公式検索インデックス本文の確認を受領（先週crawl、直接抽出は画像のみ、Steam実機UI未検証）。上記21F5資料はSettings → Storage → … → Repair Folder、更新に必要なライブラリフォルダーのユーザー権限修復と説明。整合性確認は別対象。ドライブ選択の詳細・変更される権限の細目は不明のまま保持。英語版では対象ライブラリが不明なら中止、権限の一括変更や全ディスク障害修復を断定しない。4記事バッチで実装し、ビルド・画面・配備確認後に公開する。
