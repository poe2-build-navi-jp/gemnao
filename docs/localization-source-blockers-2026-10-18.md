# ゲーム記事の資料再確認待ち — 2026-10-18

最新指示により英語版の追加・全体QA・公開確認まで進めて一旦終了する。スペイン語版・中国語版へは進まない。下記はゲーム固有の復元・MOD変更の条件が未確認のため新しい翻訳を公開しない。既存日本語記事を今回変更したという意味ではない。

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

## Discord recommended-bots：Dyno本文の確認待ち

https://docs.dyno.gg/en/modules/automod と https://docs.dyno.gg/en/premium はWeb抽出が「Copied to clipboard!」のみ、直接取得はCONNECT403。公式検索の断片だけではBanned Words完全一致、Warn、免除、アクション別権限、無料/Premium範囲の全条件を確認できないため、この1記事は未翻訳のまま保持。親ブラウザ担当へ本文確認を依頼済み。ほかのDiscord記事とPC/Windowsを継続する。実Botの導入・権限変更は実行していない。

## Dyno：親担当の追加資料を受領

2026-10-18に親担当から公式検索インデックス本文の確認結果を受領。Automodは約3か月前crawl、Premiumは約1か月前crawl。ライブ抽出は空、実Bot設定試験ではない。全面的な本文確認待ちは解除し、確認範囲でrecommended-bots英語版の実装へ進む（現時点では未実装）。

https://docs.dyno.gg/en/modules/automod : Exact matchesは指定単語のメッセージ内一致で全文一致ではない。Wildcardは部分語一致。大小文字/句読点/Unicode/複数語の条件は未確認。Deleteは対象メッセージ削除、Warnは短時間で消える公開口頭警告相当でDM・正式警告履歴・Autopunish回数と同一視しない。違反は5分で失効。owner/admin/Dyno manager/mod免除。Ignored role/channelはglobal/per-rule、Affectedは対象範囲。同じ対象種別のIgnoredとAffectedの併用を推奨しない。custom response/log channelはStandard Premium。

https://docs.dyno.gg/en/premium?jump=limits : Autoresponder10/CustomCommands25/Autopunish3/Autodelete1/Automessage1から有料Unlimited（soft limits）の記載はAutomodの枠ではない。Autoban1 per ruleもAutomodと別。Automodの単語/ルール上限、価格表のチェック条件は未確認。基本Exact/Warn/Deleteに有料印はないが無料保証とはしない。

## PC disk-usage-100：限定的な公式資料確認待ち

原文全文を確認済み。NEC24546のプロセス比較、Microsoftのcommit limit、検索除外、NVMe監視、Microsoft JapanのDisk153=I/O再試行（故障断定ではない）、Steamworksの更新時local disk IOは確認済み。次は未確認のまま保持し、別の一般資料で裏付け済みとは扱わない。

- https://techcommunity.microsoft.com/blog/askperf/windows-8--windows-server-2012-the-new-task-manager/375149 : 本文0行、直接取得CONNECT403。Task ManagerのActive time（忙しい時間の割合）とMB/s（転送量）の区別を原資料で確認したい。
- https://help.steampowered.com/en/faqs/view/71AB-698D-57EB-178C : 本文1行、直接取得CONNECT403。現在のDownloads画面での進行/ディスク表示と一時停止・再開の操作を確認したい。
- https://support.microsoft.com/en-us/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows : 現在の取得本文にAutomatically manage paging file sizeの操作が見当たらない。自分で無効化した場合に限る、Adjust the appearance and performance of Windows → Advanced → Virtual memory → Change → Automatically manage paging file size for all drivesの現行経路を確認したい。
- https://support.microsoft.com/en-us/windows/experience/system-configuration-tools-in-windows : 現在の取得本文にResource Monitorが見当たらない。Windows+R → resmon → DiskのImage/File/Total(B/sec)表示の確認が必要。

検索ツールが無関係な結果を返すため、その結果は証拠に採用していない。実機Windows/Steamの操作検証は行っていない。
