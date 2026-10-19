# ゲムなお｜AIエージェント作業ガイド

このリポジトリの作業ルール、主要ファイル、検証手順、公開時の注意はすべて`CLAUDE.md`に書かれています。作業を始める前に必ず`CLAUDE.md`を読み、そのルールに従ってください（ChatGPT・Codex・Claude Codeで共通のルールです）。

特に次の点は、変更すると検索順位やSNSでの表示に直接影響します。

- `next.config.ts`の`htmlLimitedBots: /.*/`を削除しない。
- 検証済みの翻訳ページはindex対象。実在する翻訳だけに双方向hreflangを設定し、sitemapと一致させる（`lib/localized/index.ts`）。未翻訳ページや存在しない言語別URLを作らない。
- 記事を追加・タイトル変更したら`pnpm og:cards`を実行し、`public/images/og/`と`lib/og-image-manifest.ts`をコミットする。
- `cloudflare/worker-wrapper.mjs`と`cloudflare/worker-source.mjs`の静的ファイル振り分けとHTMLキャッシュ設定を維持する。
- `NEXT_PUBLIC_ADSENSE_CLIENT`、Googleサイト確認タグ、`public/ads.txt`を削除しない。

## ローカル品質検証の入口

無料の既存ツールを使う再現手順は `docs/site-quality-kit.md`。`pnpm qa:checks` は型・lint・データ/部品検査、`pnpm qa:site` はローカルHTTPリンクとChromium実ブラウザ検査。ブラウザ検査には先に `pnpm build` が必要。結果の種類と既存エラーを区別し、本番配備成功や全サイト検証済みとは言い換えない。
