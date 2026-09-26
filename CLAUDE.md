# ゲムなお｜Claude Code 作業ガイド

## プロジェクト概要

- 公開URL: https://gemnao.pages.dev/
- 目的: PCゲームのトラブルを、初心者にも分かる具体的な手順で解決するWiki
- 技術構成: Vinext、React 19、TypeScript、Cloudflare Pages、Cloudflare D1
- パッケージ管理: pnpm

既存の配色、レスポンシブ表示、多言語ページ、検索、SEO、匿名回答機能を維持すること。全面的なデザイン変更は行わない。

## 主要ファイル

- `lib/games.ts`: ゲーム総合ガイドのデータ
- `lib/game-articles.ts`: トラブル個別記事のデータ
- `lib/common-guides.ts`: PCゲーム共通トラブル（`/guide`）のデータ
- `lib/discord-articles.ts`: Discordトラブル（`/discord`）のデータ
- `components/troubleshooting-article.tsx`: ゲーム別個別記事の共通テンプレート
- `components/wiki-home.tsx`: 日本語トップと検索・テーマ絞り込み
- `components/issue-feedback.tsx`: 「解決した／解決しなかった」の匿名回答UI
- `app/games/[slug]/page.tsx`: ゲーム別ハブ
- `app/games/[slug]/[article]/page.tsx`: トラブル個別記事
- `app/guide/[slug]/page.tsx`: PCゲーム共通トラブル個別記事
- `app/discord/page.tsx`: Discordトラブルハブ（症状から探す）
- `app/discord/[slug]/page.tsx`: Discordトラブル個別記事
- `app/sitemap.ts` / `app/robots.ts`: 検索エンジン向け設定
- `wrangler.json`: Cloudflare PagesとD1の設定

## 作業ルール

1. ゲーム固有情報を推測で追加しない。既存情報または確認できる一次情報を使う。
2. 外部文章や画像を転載しない。内容は独自の表現で要約し、出典へリンクする。
3. 既存URLを削除せず、ゲーム総合ページをハブとして残す。
4. 個別記事には固有のtitle、description、canonical、OGP、パンくず、構造化データ、確認日、出典、関連記事を設定する。
5. 新しい個別記事はページを複製せず、`lib/game-articles.ts`へデータを追加する。
6. `NEXT_PUBLIC_ADSENSE_CLIENT`、Googleサイト確認タグ、`public/ads.txt`を削除しない。
7. `.env*`、認証情報、CloudflareトークンをGitへ追加しない。
8. D1の既存テーブルと回答データを壊さない。

## SEO・SNS共有の仕組み（壊さないこと）

- `next.config.ts`の`htmlLimitedBots: /.*/`を削除しない。削除するとtitle・description・canonical・OGPが`<body>`側に出力され、LINE・はてブ・Bluesky・Googlebotで正しく読まれなくなる。
- 多言語ページ（`/en`・`/zh`・`/es`）は内容が一部だけのため`noindex`。hreflangは設定しない（noindexや404のページを指すとGoogleで無効扱いになる）。全記事を翻訳してindexする段階になったら、日本語ページと翻訳ページの双方向hreflangとsitemapを同時に追加する。
- 記事ごとのOGP画像は`lib/og-cards.ts`が記事データから自動で内容を作り、`public/images/og/`にPNGとして保存する。記事を追加・タイトル変更したら`pnpm og:cards`を実行し、`public/images/og/`と`lib/og-image-manifest.ts`をコミットする（Python 3と`pip install pymupdf pillow`が必要）。未実行でもビルドは成功し、その記事は`/og-default.png`になる（`pnpm build`で警告が出る）。
- `lib/og-image-manifest.ts`は自動生成ファイル。手で編集しない。
- 共有ボタンは`components/share-buttons.tsx`。Xアカウントを作ったら環境変数`NEXT_PUBLIC_X_ACCOUNT`（@なし）を設定すると`twitter:site`と共有時の`via`が有効になる。
- `cloudflare/worker-source.mjs`はHTMLをCloudflareのエッジに最大1時間キャッシュする（デプロイごとにキーが変わるので、公開直後に古いCSS・JSを参照することはない）。表示のたびにD1やCookieを読むページを追加する場合は、`cacheablePath`の対象から外す。現在は`/discord-servers`・`/contact`・`/admin`・`/api`が対象外。
- 「このトラブルの解決状況」パネルは匿名回答が10件以上になった記事にだけ表示する。

## 検証コマンド

```bash
pnpm build
pnpm lint
```

変更したファイルにlintエラーがないことを確認する。プロジェクト全体のlintには、未使用の既存UI部品に由来する警告が残っている場合がある。

## 公開時の重要事項

Cloudflare Pagesの`_worker.js`は、`/_next/static/`、`/ads.txt`、`/favicon.svg`を`env.ASSETS.fetch(request)`へ渡す必要がある。`dist/server/index.js`をそのまま`_worker.js`として配備するとCSSとJavaScriptが404になり、表示が崩れる。

`cloudflare/worker-wrapper.mjs`の静的ファイル振り分けを維持すること。公開後はトップページだけでなく、HTML内で参照されるCSS・JavaScriptがHTTP 200で返ることを必ず確認する。

## 完了条件

- `pnpm build`が成功する
- トップ、ゲームハブ、個別記事、多言語ページが開く
- CSSとJavaScriptが200で配信される
- `/api/feedback`、`/sitemap.xml`、`/robots.txt`、`/ads.txt`が正常
- 記事ページの`<head>`内にtitle・canonical・`og:image`がある
- PCとスマートフォンで横スクロールや文字切れがない

