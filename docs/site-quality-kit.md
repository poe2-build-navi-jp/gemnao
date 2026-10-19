# Gemnaoの無料・ローカル品質検証キット

対象: Gemnaoのスマホ表示・主要な閲覧導線・英語リンク・アクセシビリティ。ゲーム開発、翻訳追加、本番配備、外部サービス設定は対象外。

## 既存資産と今回の最小追加

- 既存の `@playwright/test`、TypeScript、oxlint、esbuild、英語検索/参照データ/翻訳/保存部品の検査を再利用。
- `axe-core` 4.14.0だけをdevDependencyに追加し、lockfileで固定。一時 `/tmp` にあるaxeを要求しない。Playwrightの重複パッケージや外部QAサービスは導入しない。
- `playwright.quality.config.ts` と `tests/quality/` に再現可能な4幅の実ブラウザ試験を保存。
- 既存 `scripts/check-english-home.mjs` をリンク検査に再利用。ローカルoriginのみ、タイムアウト20秒、同一origin内の最大5回リダイレクトに限定。外部リダイレクトは追従しない。

## セットアップ（一度だけ）

今回の整備と実行はこの作業環境で完了しており、ユーザーのPC接続は不要。以下は別環境で再実行する際の手順。Node >=22.13 とpnpmを使う。既存の作業差分を消さず、対象ブランチまたはクリーンな作業コピーで実行する。

```bash
pnpm install --frozen-lockfile
# 対応Chromiumが未導入の場合だけ。公式Playwrightのブラウザ取得。
pnpm exec playwright install chromium
```

既存Chromiumを使う場合はブラウザ取得不要。`CHROMIUM_PATH=/usr/bin/chromium` のように指定できる。通常はsandbox有効のまま使う。隔離された実行環境でsandbox起動が不可能な場合だけ `QUALITY_NO_SANDBOX=1` を明示する。OSパッケージの自動導入・管理者権限・有料APIは不要。

## 実行

```bash
pnpm qa:checks     # 型、lint、ローカル通信制約、既存データ/部品検査
pnpm build         # 既存のローカルビルド。配備コマンドではない
pnpm qa:site       # 下記HTTPリンク1件＋ブラウザ12件
# 必要な部分だけ再実行する場合
pnpm qa:links
pnpm qa:browser
```

`qa:checks` に失敗があっても全項目の結果を保存し、終了コード1を返す。失敗を無視して公開してよいという意味ではない。今回検出した既存lintエラーは下記「実行記録」を参照。

`qa:site` はビルド成果物を127.0.0.1:3099で自動起動・終了する。既存サーバーを流用しない。ポート競合時は `QUALITY_PORT=3100 pnpm qa:site`。未ビルドなら先にbuildする。Cloudflare remote/D1/管理APIに接続するコマンドは使わない。

この環境のようにpnpmの既定キャッシュが書き込めない場合、セットアップ時だけ `XDG_DATA_HOME=/tmp/gemnao-pnpm-data XDG_CACHE_HOME=/tmp/gemnao-pnpm-cache` など書き込み可能な一時領域を指定する。pnpmの自動installを避けて既存インストール済みツールを起動する代替:

```bash
node scripts/quality/run-checks.mjs
CHROMIUM_PATH=/usr/bin/chromium QUALITY_NO_SANDBOX=1 node node_modules/@playwright/test/cli.js test --config playwright.quality.config.ts
```

## 検査範囲を区別する

| 種類 | 確認内容 | これだけでは確認できないこと |
|---|---|---|
| 型・lint・データ | 既存設定、英語検索順位/参照データ、翻訳整合、保存処理 | 実画面の描画やクリック |
| React静的描画・部品検査 | 既存reading検査の静的マークアップ、浅いhooks/保存fixture | 実ブラウザのフォーカス・表示 |
| HTTPリンク | 既存英語231件のSSR経路、238遷移先、canonical/H1/schema/sitemap/旧アンカー | CSS描画、実外部リンク、本番D1 |
| Chromium実ブラウザ | 375/390/430/1440px、6ページ×4幅、検索/キーボード/戻る/再読込、症状/ゲーム/一覧移動、directory失敗と空一覧の区別 | 全端末、WebKit/Firefox、全サイト全状態 |
| axe | 同じ24画面のWCAG2 A/AA・2.1 AAタグ | 完全なWCAG適合。`incomplete`は手動確認が必要 |

画面対象: `/en`、`/en/articles`、`/en/trouble/fps`、`/en/discord-servers`、`/en/new-releases/2026-11`、`/en/tools/save-locations`。横はみ出し、画像読込、JS/CSS失敗、単一H1、英語main、OS列のWindows単語分割を確認。スクリーンショットは目視比較用であり、pixel差分の自動合否判定ではない。

## 通信とデータ

ブラウザcontext単位で外部HTTPとWebSocketを遮断し、Service Workerを無効化。GET/HEAD以外は送信前に遮断し、試行があればテスト失敗として記録する。`/api/`のGETも実APIに流さず固定fixtureへ置換する。GAスクリプト取得・GAイベント・投稿・投票・認証・削除・管理操作を試験しない。既存保存データではなく新規ブラウザcontextを毎回使用する。

この制約はQAクライアントの通信に対するもの。第三者のサーバーや任意コードを安全に実行する汎用sandboxではない。テスト対象はこのリポジトリのローカルビルドだけ。

## 証拠と引き継ぎ

- `test-results/quality/checks/results.json` と項目別log: 静的/部品検査の成功・失敗。
- `test-results/quality/results.json`: Playwrightのテスト結果。
- `test-results/quality/artifacts/`: 画面、axe結果（違反と未判定）、遮断通信・JS/資産エラー、失敗時trace。
- `playwright-report/quality/`: HTMLレポート。`pnpm exec playwright show-report playwright-report/quality` で開く。
- 既存 `.gitignore` が上記成果物を除外する。画像の目視確認結果と、未検証の範囲も引き継ぐ。
- 本番公開は別作業。本キットにデプロイ・GitHub workflow・cron・IndexNow/GSC送信を追加していない。

公式資料: [Playwright通信制御](https://playwright.dev/docs/network)、[Playwright設定](https://playwright.dev/docs/test-configuration)、[Deque axe-core](https://github.com/dequelabs/axe-core)。

## 2026-10-19の実行記録

基準コード `605493a` のクリーンコピーへQA差分だけを適用。未公開collector関連3ファイルはコピー/変更/commit対象外。Node24.19.0、Playwright1.63.0、axe-core4.14.0、既存 `/usr/bin/chromium` を使用。ローカルbuild成功（609静的HTML / 591 sitemap / 536 OG）。本番再配備なし。

全体lintの既存エラー10件は保持:
- `components/discord-server-directory.tsx`: useMemo依存関係3件、status要素の推奨1件。
- `tests/feedback-stats-d1/control.test.mjs`: Node testの未await Promise6件。

これらの製品コード/対象外テストを変更せず、`lint-project`は失敗のまま記録する。追加QAファイルの `lint-quality` は別に合否を確認する。

最終実行結果:
- Playwright: **13/13成功**（実Chromiumの12ケース＋HTTPリンク1ケース、skip/flaky 0）。6ページ×4幅の24画面を検査。
- axe: 24回、対象ルールの違反0。ただしcolor-contrastの自動判定保留が9結果（複数要素を含む）あり、完全適合とはしない。装飾矢印・要件表の判定ラベル・desktopのhero周辺が対象。詳細targetsは添付axe JSONに保持。手動コントラスト評価は残る。
- ブラウザのAPI GET16件はfixtureへ置換。書き込み試行0、実API送信0、JS例外0、ローカル資産失敗0。外部通信は遮断設定で、今回の操作では外部要求も0。
- qa:checks: 8項目中7成功、既存lint-projectのみ失敗。追加QA lint・型・通信ポリシー4単体試験・既存英語検索/参照/翻訳/保存部品検査は成功。全体lintの失敗を隠す除外・無効化は行わない。

初回試験で見つかった試験コードの不備（ローカルredirectの拒否、重複文言locator）は修正して全13件を再実行済み。製品コードや表示は変更していない。専用ブランチへのcommitと、パッチ・手順・最終証跡のZIPを引き継ぐ。remote pushは自動プレビュー配備を避けるため行わない。
