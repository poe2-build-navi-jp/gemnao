# マイゲーム①：公式変更カード MVP

ベースは `gemunao` / `4cadc9739a5cd807c48ff26d7a1dd1113303ec95`。リモートを確認して開始。今回の機能変更は未コミット・未push・未配信。公開承認待ち。

## 変更と根拠

- `/my-games` と `/en/my-games`、`/zh/my-games`、`/es/my-games` の保存ゲーム欄にカードを追加。
- 初期登録はApexとPUBGのみ。公式発表日・最終確認日・対象条件・変更内容・確認すること・公式出典・関連記事・既存ノートへのリンクを表示。
- [EA公式発表](https://www.ea.com/ja/games/apex-legends/apex-legends/news/javelin-anticheat-announcement)：発表日2026-09-24、PC版Javelin移行日2026-09-29。発表時点のSecure Boot不要を条件付きで記載。
- [PUBG公式レター](https://www.pubg.com/ja/news/9001)：発表日2025-08-11、37.1の別ゲーム同時起動時の警告。最近の障害告知ではないと明記。
- 両資料の確認日は2026-10-14。全ゲームを監視しているとは表現しない。環境は検出せず対象条件を提示。未登録は「変更なし」ではない。警告の固定文言や原因製品名は創作しない。
- 既存Steamニュース取得は変更なし。新機能からのAPI・自動巡回・通知・ログインは追加なし。

## 保存と表示の仕様

既存キー（`gemnao-my-games`、`gemnao-my-pc`、`gemnao-solutions-v1`、`gemnao-diagnosis-v1`）は変更しない。新規キー `gemnao-official-changes-read-v1` に `{version:1, read:string[]}` を保存するだけ。個人情報・PC検出なし。

- 初回表示は既読を書き込まず、すべて未読。「未読」は発表の新しさではなく、このブラウザでの操作状態。
- 追加ゲームは未読カードを表示。ゲームを外すと非表示、再追加時は既読状態を保持。
- 明示操作で既読／未読を切り替え。再読み込み・言語移動・同一オリジン別タブでも反映。別端末同期なし。サイトデータ削除でリセット。
- 内容の再確認が必要な更新では編集者がカードのrevision IDを更新する。確認日だけの変更で再び未読にしない。
- 不正JSON・未知の保存バージョンは上書きせず状態不明を表示。読み取り禁止・容量不足でも既存データを保持してエラー表示。
- 空データは未登録表示。未翻訳カードは日本語へフォールバックし言語を明示、日本語も欠けたカードは表示しない。存在する翻訳記事だけにリンクする。
- 不正日付、未来の確認日、発表より前の確認日を持つカードは表示しない。日付はYYYY-MM-DDのまま表示しタイムゾーンでずらさない。

## 変更ファイル

- `lib/my-game-changes.ts`：手動カード・対象選択・日付／翻訳欠損処理。
- `lib/my-game-changes-copy.ts`：4言語UI。
- `lib/my-game-changes-read.ts`：独立した既読保存。
- `components/my-game-changes.tsx`：表示・操作・状態通知。
- `lib/my-games-data.ts`、`components/my-games-panel.tsx`、`app/globals.css`：既存画面への最小限の組込み。
- `scripts/check-my-game-changes.ts`、`scripts/run-my-game-changes-check.mjs`、`scripts/check-my-game-changes-browser.mjs`：再実行可能な検査。

## 検証

成功：`pnpm build`（426静的HTML）、`pnpm lint`、`pnpm typecheck`、`pnpm check:localized`（184翻訳ページ）。OG内容変更なし、既存345枚の整合チェック成功。

成功：新規データ・保存テスト、既存 `run-my-games-page-check.mjs` / `run-my-games-analytics-check.mjs` / `run-support-check.mjs` / `run-saved-solutions-check.mjs`。既存選択・失敗時の保持・旧ノート形式を確認。新規テストで実際の診断保存／読込モジュールを使用し、既読操作後も診断を再開できることを確認。

ブラウザー検査成功：4言語×360/390/1440px＝12ケース。横溢れなし、44px操作領域、キーボード、日付、関連記事HTTP 200、CSS/JS失敗なし、JS例外なし。初回無書込み、既読・再読み込み・削除再追加・別タブ・未登録・壊れた保存・未知バージョン・容量不足・既存キー保持を検査。

既存ノートUIもローカルで保存・再読込・記事間試行記録・復元チェック・コピー・容量不足を確認。旧 `check-support-browser.mjs` 全体は既に存在しない「直らない → 次は」ボタンのセレクターで停止したため、一時コピーでそのナビゲーション部分だけを除いて実行。元スクリプトやアプリの該当処理は変更していない。この旧セレクター部分の通過は主張しない。

ローカル検査はD1未接続のPages設定を使用し、ブラウザーの外部通信を遮断・APIをモック。本番サービスへのデータ送信なし。画面証跡は `.wrangler/my-game-changes-review/{ja,en,zh,es}-390.png`。ログは `/tmp/gemnao-changes-{build,browser,support-browser}.log`。

## ②への引継ぎ

既存の `SavedSolution.settings` は自由記述、`support.reversions` は変更名・元の値・戻し方・状態、`support.attempts` は記事単位の試行履歴。②「前回快適だった設定」と③「設定変更の実験ログ」はこれらとの整合を先に検討し、既存ノートの形式を壊さないこと。①の既読キーはノートとは独立し、②③にPC自動検出や新規認証を導入する必要はない。

公開承認後に必要なのは最終差分確認、コミット・push、同じコミットの配信成功と本番表示の確認。今回DB・診断共有・認証・課金・GA・IndexNowは変更・実行していない。
