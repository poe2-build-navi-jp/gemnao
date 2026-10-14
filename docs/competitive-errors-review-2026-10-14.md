# 追加3記事のローカルレビュー（2026-10-14）

ベース: `gemunao` / `cbd57fca425304a13008044ba35146be8829ba71`。最新リモートを取得して開始。ローカルレビュー完了後、2026-10-14 08:22 UTCに公開承認を受領。以下の検証結果は公開前の記録。

## 対象と変更

- Apex: `/games/apex-legends/game-version-mismatch` — 古いパッチと更新完了を最初に確認。Javelin・接続エラーとは別の入口。
- Overwatch 2: `/games/overwatch-2/rendering-device-lost` — GPU故障と即断せず、場面・GPU・ドライバー版を記録して公式更新前後を比較。
- PUBG: `/games/pubg/anti-cheat-conflict-warning` — 2025-08-11の37.1告知の範囲を明記。別ゲームの通常終了と単独起動で比較。特定製品の原因断定なし。

各記事に日本語・英語・簡体字中国語・スペイン語を追加（12 URL）。本文は `lib/followups/{apex-version-mismatch,overwatch-rendering,pubg-anticheat}.ts`。既存レジストリを使い、STEP id・公式出典・注意点を整合。

`lib/competitive-game-hubs.ts` にOW2/PUBGの4言語ハブを追加。単一記事ハブはnoindex、sitemapから除外。Apex既存2記事、共通ガイド4記事、英語クラッシュ記事からの導線を追加。canonical・hreflang・構造化データ・sitemapは既存の生成方式。OGカード24枚（新規20・Apexハブ更新4）とmanifestを更新。

## 一次情報と限界

2026-10-14に本文確認:

- [EAエラー一覧](https://help.ea.com/en/articles/apex-legends/error-codes/) — host mismatch、Steam・Xboxの更新案内。
- [PlayStation更新案内](https://www.playstation.com/en-us/support/hardware/playstation-system-software-application-version/) — PS4/PS5ゲーム更新。
- [Blizzardフォーラムの2023-05-04サポート回答](https://us.forums.blizzard.com/en/overwatch/t/your-rendering-device-has-been-lost-application-closing/813964) — GPU停止・クラッシュにはドライバーやハードウェア等の複数原因。
- [NVIDIAドライバー](https://www.nvidia.com/ja-jp/drivers/) と [AMD情報・更新案内](https://www.amd.com/en/resources/support-articles/faqs/DH3-016.html)。
- [PUBG公式レター](https://www.pubg.com/ja/news/9001) — 2025-08-11、37.1以降の別ゲーム同時起動時の警告。

Blizzard専用記事32553はリダイレクトループで未取得。その手順を読んだものとして使用していない。2026年の個人投稿を広範な障害の証拠にしていない。PUBG告知内画像の警告全文は取得未確認のため引用せず、本文で確認した発生場面のみ使用。ゲーム実機再現・解決率・検索数は未検証。TDR編集、保護機能の恒久無効化、.sys削除の指示なし。

## 検証結果

- `pnpm typecheck` / `pnpm lint`: 成功。
- `pnpm check:localized`: 184翻訳ページの整合検査成功。
- `pnpm og:cards`: 24枚生成、345ページ分のOG整合。
- `pnpm build`: 成功。426静的HTML、405 sitemap URL。
- `node scripts/check-editorial-snapshots.mjs`: 426ページ成功。
- `node scripts/check-english-articles.mjs`: 既存5英語記事、249内部リンク・アンカー成功。
- 追加記事専用検査: 12記事の自己canonical、相互hreflang、OG、確認日、sitemap、schema、531内部リンク・アンカー成功。既存8言語別記事からの流入リンク、全言語ハブ、共通記事からの導線を確認。
- ローカルPages配信: 12記事 × 360/390/1440px = 36表示検査成功。HTTP 200 / STATIC、横溢れなし、JS例外なし、CSS・JS失敗なし。トップ・ゲームハブ・sitemap・robots・adsのHTTP 200も確認。
- `git diff --check`: 成功。

検証はD1接続のない一時設定で実施。ブラウザー検査では外部通信を遮断し、APIをモックしたため、実際の回答・診断・DBは検証対象外かつ未変更。証跡は `.wrangler/next-three-review/results.json` と12枚の390px画面、`/tmp/gemnao-next-{qa,build,og}.log`（ローカル一時ファイル）。

## 公開前の残り

新たな公開承認後に最終差分を確認してコミット・pushし、同じコミットの配信成功と本番HTML・CSS・JSを再確認する。本番確認は今回未実施。GA、DB、認証、診断保存、既存キーを変更していない。IndexNowの再送・新規送信、Bing/GSC提出は一切実行していない。

## 公開前最終確認

2026-10-14、公式6資料を再取得して本文と照合。Blizzard 32553は引き続きリダイレクトループ。4言語すべてで未取得を明示し、その手順を引用していない。PUBGの警告全文は創作せず、Vanguard等を原因と断定していない。TDR改変・保護機能の恒久無効化を推奨する記述なし。本文修正は不要。最新リモートはベースと同じcbd57fcで、他作業の追加なし。
