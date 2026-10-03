# 障害・メンテナンス欄の公式情報確認（2026-10-03）

確認時刻：2026-10-03 08:38 UTC（17:38 JST）。公式Steamアナウンス25ゲーム・798件を確認。取得範囲に告知がないことは、サービス全体の正常稼働を保証しない。

## 掲載する予定

- AION2 グローバル版（Steam／PURPLE）の正式サービス開始前メンテナンス：10月5日05:00–13:00 UTC（14:00–22:00 JST）予定。時刻は変更される場合がある。
- [公式の個別告知](https://store.steampowered.com/news/app/3393110/view/689769594581155930)。告知はEurope、NA West、NA East、Latin America、ASIAを対象に記載。
- [公式Launch FAQ](https://store.steampowered.com/news/app/3393110/view/680761758839734961)：SteamとPURPLEはサーバー共通。日本を含むグローバル版であり、韓国・台湾の既存サービスとは分けて扱う。

## 現在の障害として追加しない情報

- AION2の10月1日メンテナンス：[公式の復旧告知](https://store.steampowered.com/news/app/3393110/view/712288224875118805)で全サーバーオンラインを確認。
- Aniimoの過去メンテナンス：[公式の更新済み告知](https://store.steampowered.com/news/app/4126040/view/703279756977636272)が復旧を明記。
- Discord：08:36 UTC時点の公式summaryはincident/maintenanceとも空。10月1日のAPIエラーは[個別の公式告知](https://discordstatus.com/incidents/yb8bzhp6nd87)でresolved。
- WARDOGS：10月2日08:00 UTCから約1時間の[予定告知](https://store.steampowered.com/news/app/1867240/view/670629928317748115)はあるが、明確な完了告知は確認できなかった。現在も継続しているとも復旧したとも断定せず、過去の予定を新しい障害として掲載しない。[後続hotfix](https://store.steampowered.com/news/app/1867240/view/670629928317748295)の「停止不要」は前回メンテナンスの完了確認には使わない。
- AION2の[既知のゲーム内不具合](https://store.steampowered.com/news/app/3393110/view/712288224875119580)、ACE COMBAT 8の[PCクラッシュ調査](https://store.steampowered.com/news/app/2288340/view/695399726270383658)は参考のお知らせであり、稼働中のサーバー障害件数に加算しない。

## 更新・削除の境界

- Discordは公式APIのresolved/postmortem/completed/cancelledを現在一覧から除外する。
- 手動登録の予定は公式の完了・中止発表を確認してstatusとresolution（確認日時・出典）を更新すると現在一覧から消える。記録はGitから復元できる。
- 終了予定時刻だけでは削除しない。予定時間内と実施確認済みを区別し、予定終了後は「終了未確認」とする。
- Steamのタイトル抽出は参考ニュースに限定する。明示的な復旧・完了タイトルは除外するが、本文の一部にresolvedがあることを理由に未解決の別問題まで削除しない。
- APIは既存の10分エッジキャッシュを継続。ページが表示されている間に10分ごとに再取得し、バックグラウンドでは更新を休止する。個人向けの定期通知や別の自動実行は作成しない。
- 取得失敗を「障害なし」と同一視しない。提供元ごとの取得日時と失敗を表示し、同じページ内で分かる前回の取得成功日時を保持する。

## Steamリンクの修正

GetNewsForAppのgidはニュースフィードIDであり、Steam記事の/view/IDとは異なる場合がある。実際に構築された/view/184…はHTTP 200でも一般ニュース一覧になることを確認。APIが返したHTTPSの公式アナウンスURLを検証して使用する。HTTP、javascript、不正なホスト・パス・ポート・ユーザー情報・クエリを許可しない。第三者メディアのfeedや別appidは対象外。

## 回帰確認

`node scripts/run-status-check.mjs` で、予定/時間帯内/実施中/終了未確認/完了/中止、Discordのterminal status除外、Steam公式URLとfeed、取得失敗と一部失敗、参考ニュースの件数分離、更新失敗後の旧データ維持、10分更新・非表示・再表示・unmount中断を確認する。
