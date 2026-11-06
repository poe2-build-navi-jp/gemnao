# バズ部の記事一覧を基にしたSEO・AI検索改善（2026-11-06）

## 確認範囲と方法

[指定された一覧](https://lucy.ne.jp/bazubu/articles)に掲載された498 URLを重複排除し、全498件でHTTP 200と本文・見出しの取得を確認した。URL・記事名・カテゴリ・照合観点は[article-inventory.csv](article-inventory.csv)、件数と分類方法は[coverage.json](coverage.json)に記録した。テーマ分類はタイトル・本文見出しによる機械的な照合を含む。カテゴリ欄の「SEO」は167件、「AI検索(LLMO)」は29件だった。

全文の転載、画像のコピー、外部記事の自動リライトは行わない。取得した第三者本文はこのリポジトリに保存していない。記事ごとの主張をすべて採用したという意味ではなく、古いWordPress設定、BtoB営業事例、現在のゲムなおに適用しない施策も含めて棚卸しした。

## 判断に使った記事・一次資料

- [内部リンク](https://lucy.ne.jp/bazubu/internal-link-41279.html)：行き先が症状・目的に合うリンクを選ぶ。
- [検索ユーザーの状況](https://lucy.ne.jp/bazubu/specifying-the-situation-of-search-users-51083.html)：同じ「起動しない」でも、OS要件・認証エラー・ゲーム起動後の問題を区別する。
- [E-E-A-T](https://lucy.ne.jp/bazubu/what-is-e-e-a-t-49125.html)：編集主体・根拠・確認範囲を明確にする。実在しない監修者や実機検証を追加しない。
- [トピッククラスター](https://lucy.ne.jp/bazubu/what-is-topic-cluster-49050.html)：症状ハブ・共通ガイド・個別記事を意味のある関係でつなぐ。既存リンクの一括削除という手順は採用しない。
- [PVだけを追わない効果測定](https://lucy.ne.jp/bazubu/owned-media-number-of-page-views-52069.html)：アクセスと、読者が対処へ進めたかを分けて評価する。
- [Google：AI機能とウェブサイト](https://developers.google.com/search/docs/appearance/ai-features?hl=ja)：通常のSEOを基礎とし、AI掲載専用の特殊なファイルや構造化データを必須と扱わない。
- [Google：リンクのベストプラクティス](https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=ja)：意味が分かるアンカーテキストと、実在する関連ページへのリンクを維持する。
- [Google：記事の構造化データ](https://developers.google.com/search/docs/appearance/structured-data/article?hl=ja)：本文と一致する編集主体・画像・日付等を使用する。

## 反映した変更

| 項目 | 確認した不足 | 変更 |
|---|---|---|
| 編集者の識別 | ゲーム総合ページや一部翻訳ガイド等で、編集者が名前のみになっていた | 既存編集部のURL・共通ID・運営者との関係を統一。架空の個人は追加しない |
| 総合ページの根拠 | ゲーム総合ページの本文には出典やOG画像があるが、構造化データに未反映のページがあった | 本文にある出典・既存OG画像・運営者IDを日英ほか対応済みページに反映 |
| 表示上の編集主体 | ゲーム総合ページ・翻訳共通ガイドの編集方針への導線が弱かった | 言語に合う編集者表示を追加。日本語・英語の編集方針に実在するアンカーを設定 |
| 関連記事の精度 | Windows 11という語だけでWindows Updateエラーへ、FPS低下だけでモニターのHz設定へ誘導する等の広すぎるルール | Windows側の具体的な症状が一致する場合に限定。右クリックで固まる・勝手にスリープ解除等から無関係なゲーム症状へ誘導するリンクを除去 |
| 要件トピックの接続 | MW4のTPM記事とPC共通の要件ガイドの関係が未反映 | 確認済みの既存記事間で双方向リンクを追加 |
| 継続的な検査 | テンプレート間の情報差をビルド時に横断検出できなかった | `pnpm check:seo`を追加し、通常のビルド末尾にも組み込む |

サイト内の主要ナビゲーション・症状ハブ・各記事の既存URLは維持している。リンクの数を減らすこと自体を目的にはしない。

## 対応済みとして維持したもの

- 660ページ分の生成HTMLを基に、タイトル・説明文の重複、壊れたページ内アンカー、JSON-LDの構文、空のFAQを確認。変更前のこれらの検査では問題を検出しなかった。
- 自己canonical、実在する翻訳だけのhreflang、サイトマップ、記事の結論、症状別分岐、出典リンク、手順の結果別案内を維持。
- `htmlLimitedBots`、静的HTML配信、CSS/JSの振り分け、Google確認タグ、AdSense確認、既存の収集除外を維持。
- OAI-SearchBotの公開記事へのアクセス許可と、GPTBotに対する既存方針を維持。検索用途と学習用途を混同しない。
- 記事の確認日や実機検証実績を、SEO目的で新しいものに見せかけない。

## 採用しなかったもの・追加データが必要なもの

- 全記事への定型FAQ、キーワード・共起語の機械的な挿入、根拠のない実体験の追加、更新日のみの変更、リンクの一括削除は行わない。
- `llms.txt`や新たなAI専用マークアップを、掲載の必須条件として追加しない。AI回答への掲載や順位の上昇は保証しない。
- WordPressプラグイン導入手順はVinext/Cloudflare構成へそのまま転用しない。
- 「SEOの点数」「AIに一度名前が出たか」だけで成果を判定しない。他社事例の増加率をゲムなおの効果見込みに転用しない。
- 検索順位・表示回数・CTR・インデックス除外理由は、Search Consoleの実データが必要。今回のHTML検査でGoogleの登録状況を推定しない。

## 検証と運用

```sh
pnpm build
pnpm check:seo
pnpm typecheck
pnpm lint
pnpm check:localized
node --test tests/seo-aio.test.mjs
node scripts/check-guide-game-links.mjs --built
node scripts/check-search-editorial.mjs
```

SEO検査はサイトマップ507 URLのうち、静的スナップショットが存在する496ページ（記事構造化データ455件）を検査する。対象外の動的ページ11 URLは実行結果に列挙する。対象外を検査済みと扱わず、個別記事のスナップショット欠落は失敗にする。

各記事の編集者ID・URL、運営者ID、canonical、本文に出ている出典URL、総合ページの既存画像、タイトル・説明文の重複、空のFAQを検査する。不正なcanonical、本文にない出典、編集者URLの欠落、空FAQを拒否するテストも追加した。

効果は7日単位・28日単位で、ユーザー数・検索クリック・関連記事クリック・マイゲーム追加・対処結果保存を別々に比較する。操作回数をユニーク人数や解決成功人数と混同せず、小さな母数で効果を断定しない。イベント・個人識別情報の収集範囲は今回変更していない。
