# 英語トップの探索構成・SEO確認（2026-10-19 JST）

対象は `/en` と新しい英語全件一覧 `/en/articles`。ユーザーの「SEOに強い設計に変えて」と既存のテスト後公開承認に基づく。日本語トップ・他言語への展開は対象外。collector関連3ファイルは保全し、この変更に含めない。

## 変更の理由と構成

旧英語トップは説明→報告カード→検索→多数の記事の一括表示だった。検索・症状7分類・ゲーム選択・3テーマのガイドを先に置き、診断はWindows 11 x64用ダウンロードの説明へ明確に誘導する。報告は探索と利用方針の後へ移動。

ゲームはアルファベット順の6件＋全22ゲームの展開。展開内もSSRリンクであり、人気順の推定やランキングではない。テーマはゲーム共通・Windows/機器・Discordの3分類で各3記事と英語カテゴリ入口を置く。最新3記事は既存のcheckedAtで表示。保存/ノート再開/ブックマークは既存部品を再利用。

既存英語231件は検索と全件一覧の両方に保持し、全件一覧は7カテゴリの通常HTMLリンクにする。`/en#articles`・`#games`・`#tools`も維持。新しい一覧の日本語メニューは実在の `/?view=articles#articles` へ。存在しない `/articles` や他言語一覧のhreflangは出さない。

## SEOと性能の範囲

- トップのtitle/descriptionと単一H1、H2/H3を内容に合わせて整理。説明的なリンク文言を使う。
- `/en` の既存canonical/実在する言語alternateを保持。`/en/articles` は自己canonical、英語とx-defaultのみ。新一覧はindex対象でsitemap/静的HTMLに登録。
- 共通WebSite/Organizationを維持し、英語CollectionPageを既存WebSiteへ関連付ける。検索順位・評価・解決率を構造化データに捏造しない。
- トップと一覧に英語OG画像を追加。広告・GA・Search Consoleへの送信変更なし。
- ローカル無圧縮HTMLは437,112→246,693 bytes（約44%減）、DOM要素1,558→489。375pxの通常表示高さ27,782→5,976px。ローカルJS読込量は約3.62MBでほぼ同じ。検索データをすべて保持しており、JavaScript全体の最適化を達成したという意味ではない。
- 上記は同一ローカル環境の実装比較で、実機・実回線のCore Web VitalsやGoogle検索順位改善の証明ではない。

## 検証

変更前後の375/390/430/1180/1440px画面、検索（エラーコード/複数語/該当なし）、キーボード選択、戻る/再読込の検索語保持、クリア後フォーカス、症状クリック、全ゲーム展開と記事遷移、全件一覧を検査。新一覧の明るい背景のパンくずコントラスト不足を発見し修正。H1/H2の表示サイズも目視補正。最終build後も同じ5幅で全件再検査し成功。

証拠:
- `/tmp/english-home-before.json`、`/tmp/english-home-after.json`
- `/tmp/english-home-before-{width}.png`、`/tmp/english-home-after-{width}.png`
- `/tmp/english-home-before-fold-{width}.png`、`/tmp/english-home-after-fold-{width}.png`
- `/tmp/english-directory-after-{width}.png`
- `/tmp/english-home-browser.json`、`/tmp/english-home-seo.log`
- `scripts/check-english-home.mjs`（SSR全件保持・実リンク・SEO回帰）

本番画面の最終確認は親ブラウザ担当へ依頼する。実行環境の公開サイト接続制約があり、ローカル成功と本番閲覧成功を混同しない。

最終結果: 型・対象lint・本番build成功。609静的HTML / 591 sitemap / 536 OG。SEO検査は既存231件のSSRリンク保持、238英語遷移先HTTP200、単一H1・canonical・CollectionPage・sitemap・旧アンカーを確認。最終ブラウザ検査は5幅のトップ/一覧、検索と履歴/キーボード/クリア/症状/ゲーム展開/一覧からの記事移動、axe対象違反0、JS/CSS失敗0、API書き込み0。日本語/中国語/スペイン語トップの本文と全リンクが変更前と一致。モバイルメニュー、全件一覧→日本語の記事一覧、未提供zh/es一覧404も成功。

最終ログ `/tmp/english-home-final-build.log`、`/tmp/english-home-seo-final.log`、`/tmp/english-home-browser-final.log`。375pxと1440pxトップ、375px一覧、OG2枚を目視確認済み。ブラウザ側CSS注入での予備試験は最終判定に用いず、修正済みCSSを含む再build後の検査成功を採用。
