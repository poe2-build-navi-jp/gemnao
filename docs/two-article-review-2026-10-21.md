# Steam Input・Aniimo総合の改稿（2026-10-21）

基点: origin/gemunao = bc5eeac7ecc0f2cbca1f288fb9c9dbcf153411de。日本語2ページの本文・データと必要なOG・検証のみ。既存の他記事改善、URL、ホスティング、DB、投票、認証、受付設定は変更しない。

AGENTS.md、CLAUDE.md、README.mdを確認。作業環境の `/workspace/.agents` は空、リポジトリにも `.agents/skills` / SKILL.md は存在しなかった。

## 意図と差分

- Steam Input: 未認識→接続、Steamで反応→ゲーム別設定、二重入力→入力経路、操作可能で表記違い→ゲームの表示対応という入口を明示。ゲーム別設定とレイアウトの記録・復元を追加。旧UIの「一般のコントローラ設定」を必須入口とせず、版・言語差がある項目名は断定しない。ボタン表記の詳細は本文に置き、既存翻訳とのFAQ数・STEP構造を維持。
- Aniimo: 「開けない／開かない」「パッチエラー」をタイトル・冒頭・症状表に反映。更新中の処理待ちと明示的なエラーを区別。総合は確認先の案内、修復の具体操作・クラッシュ・黒画面は既存個別記事に集約。10月告知は対象端末と修正日を分ける。
- GSC（依頼者提供、9/22–10/19）: Steam Input 20表示/1クリック/平均10.7位、検索語非表示。Aniimo 331表示/2クリック/平均6.6位/CTR 0.6%。小標本であり順位・CTR改善を保証しない。効果判定には公開後の同期間比較が必要。

## 一次情報（10月21日確認）

- https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_players?l=japanese — Steam→設定→コントローラの入口。旧UI画像も含まれるため全項目が現在の日本語UIと一致するとは扱わない。
- https://partner.steamgames.com/doc/features/steam_controller/legacy_mode?l=japanese — ゲームパッド・キーボード・マウス割り当て。
- https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_devs — Steamが送るゲームパッド入力と、ゲーム側の機種別ボタン表示。
- https://store.steampowered.com/news/posts/?enddate=1701713393&feed=steam_blog — 2023年の公式コントローラー対応表示更新、ライブラリの設定アイコン、USBのみ対応するゲーム、部分対応とボタン表記。現時点の更新告知とは呼ばない。
- https://aniimo.com/ja/newslist/detail/100091 — 9月14日掲載のPC版FAQ。更新停止時のローカル処理、空き容量、ブロック履歴、ワンクリック修復。セキュリティ無効化・無条件の除外登録は記事で推奨しない。
- https://www.aniimo.com/newslist/detail/100198 — 10月16日掲載、10月15日のリソース更新。Console Platform Fixesのクラッシュ対策をPC起動不可の修正に転用しない。
- https://www.aniimo.com/newslist/detail/100208 — 10月16日掲載の既知問題・修正履歴（10月17日の項目も含む）。末尾の黒画面向け案内は既存黒画面記事へ誘導。
- https://aniimo.com/newslist/detail/100117 — 9月16日のサービス開始案内、PC/Steam等の配布とF10・メール窓口。新たな発売日・要件の数値は追加しない。
- https://www.aniimo.com/newslist — 一覧の本文を今回の取得では抽出できず。上記個別告知を確認した範囲であり、全告知を網羅した、または現在障害がないとは断定しない。

## 検証と制約

検証ログ・ブラウザQAスクリプト・画像: `/workspace/scratch/two-articles-20261021/`。

- pnpm 11の実行前依存確認が既存環境の書き込み先で失敗したため、以降は `pnpm --config.verify-deps-before-run=false run ...` でインストール済み依存を利用。依存・lockfile・設定は変更していない。
- 改稿前から全体lintはno-floating-promises等で失敗、全体typecheckは未導入の@playwright/testと派生型エラー19件で失敗。変更後ログを改稿前と比較する。
- 既存 `check-ranked-steam-guides.mjs` は基点でも他記事Steam起動ガイドの確認日を古い10月8日に固定して失敗。対象Steam Inputの日付を更新し、対象外ガイドの日付は形式検査へ変更した。他記事本文は変更していない。
- 最初の翻訳チェックで追加FAQによる件数差を検出。Steamの追加FAQは本文節に集約し、日本語以外のページを変更せず修正した。
- 実機Steamクライアント・コントローラーやAniimoのプレイ検証は行っていない。成功実績・現在のサーバー状態・パッチエラーの一律原因は未確認。
- GitHub CLIによる基点commitのcheck-runs/status取得は接続側Forbidden。認証変更・別経路のAPI照会で回避していない。

### 最終ローカル結果

- 変更箇所oxlint、`git diff --check`：成功。
- `pnpm build`：成功。HTML 609件、sitemap 591 URL、静的検索資産検証成功。536 OG整合、Aniimoの1画像のみ再生成。Steam Inputは既存の専用手順図を使う設計でありOGカード生成対象外。
- `node scripts/check-ranked-steam-guides.mjs --built`：成功。
- `pnpm check:localized`：340翻訳ページと整合検査成功。追加の開発者向け出典は本文リンク・この記録に保持し、共有sources配列は維持。
- `pnpm check:search-index`：8検索語×10フィルター、177記事の比較成功。
- `node scripts/check-editorial-snapshots.mjs`：609件のcanonical・言語・広告確認・schema保持を検証し成功。
- Chromium画面QA：両ページ360/390/1440pxで横スクロールなし、pageerrorなし。タイトル、H1、自己canonical、OG、TechArticleの日付・見出し、表示FAQとFAQPage、症状アンカー、個別記事の修復アンカー、静的記事リンク、参照CSS/JSの200を確認。APIはローカルモック、外部通信は遮断。DB/API本番挙動と動的トップページはこのQAの対象外。
- 全体lintの29エラー、全体typecheckの19エラー：改稿前後ログが完全一致、新規差分なし。
- `check-english-articles.mjs`：対象外のEnglish home discovery（Gears of War E-Day）で失敗。bc5eeacを別ディレクトリに展開して全ビルド後、同一箇所の失敗を再現。今回の改稿による新規エラーではない。
- 本番ページ読み取り：`curl -I https://gemnao.pages.dev/games/aniimo` がCONNECT tunnel 403（envoy）で拒否。別ホスト・別資格情報へ切り替えて回避していない。CI結果・本番HTML/CSS/JSの実配信確認はこの環境から未完了。

### 公開条件

後続の明示承認により公開禁止は解除された。対象差分のcommitとgemunaoへの反映を行う場合も、GitHub CI照会と本番実配信の拒否は別の未確認項目として扱う。push成功だけでは公開成功と記載しない。GSCでの効果測定は実配信確認後に行う。
