# マイゲーム：続き・今日の候補・チェックリスト・対処再開

対象：`poe2-build-navi-jp/gemnao` / `gemunao`。開始HEAD：`640f58255fdc0c4bf51d9ff515a7102eb757e27c`。日付：2026-10-14。
作成途中だった `play-plans.ts`、翻訳、ブラウザー購読フックを引き継いで実装。記事の追加・再検証は今回の機能差分に含めない。

## 実装

1. **前回の続き**：短い進捗、次の行動、任意の攻略URL、既存設定記録の参照、保存結果と保存時刻。設定参照は保存時の値を保持し、元記録の削除を通知する。機器設定を変更しない。攻略URLは絶対http/https限定で、資格情報・制御文字・その他スキームを拒否。明示的なボタン操作時だけ、新規タブへnoopener/noreferrerで開く。ユーザーURLを自動取得・自動計測しない。
2. **今日遊ぶゲーム**：本人が登録した希望時間、ソロ／友達／どちらでも、準備状況を、今回の空き時間・遊び方と照合。準備済みかつ条件一致のゲームを表示順で最大3本。理由と続きカードへのリンクを表示。条件不足数と該当なしを表示し、所要時間・動作可否を推測しない。直近の選択条件も端末内に保存。
3. **チェックリスト**：続きカード内に任意の8タスクまで。チェック状態を保存。削除済み20件までを保持し、再読み込み後も元の完了状態付きで復元。上限時に古い削除項目を勝手に捨てない。完全削除は明示的な2段階操作。ネイティブcheckbox・buttonとフォーカス移動でキーボード操作に対応。
4. **公式確認・対処再開**：対象ゲーム・地域・プラットフォーム・掲載時刻の確認案内、試した対処と結果、次の対処、既存相談メモの参照。メモの試行結果も既存の4言語ラベルで表示する。元メモを変更せず、削除・読取不能時も独立した対処記録を保持。相談メモ一覧へのリンクを用意。

日本語・英語・簡体字中国語・スペイン語を同じコンポーネントで提供。既存の設定保存比較・実験ログ・公式変更カードはそのまま配置する。

## 公式リンクの確認と表示範囲

2026-10-14に以下のリンク先を実際に取得して確認した。

- [EA Server Status](https://help.ea.com/en/server-status/)：本文にApex LegendsとBattlefield 6の対象表示を確認。
- [Riot Games Service Status](https://status.riotgames.com/)：公式入口の到達を確認。本文表示にはJavaScriptが必要で、検索取得でもVALORANTの入口を確認。現在の個別障害状態を検証したものではない。

登録対象はApex Legends、Battlefield 6、VALORANT。その他は「確認済みリンク未登録」と表示し、ゲームガイドから公式サポートを探すよう案内する。日付はリンク確認日であり、稼働状況の確認日ではない。ライブAPIを追加せず、全ゲームに「現在の障害状況は未取得」と明記する。正常・復旧済みとは判定しない。

## データ保護

新規キーのみ：`gemnao-play-plans-v1`、`gemnao-play-activity-v1`、`gemnao-today-choices-v1`。既存キーの移行・削除・書換えなし。ゲームを一覧から外しても新規記録は保持される。ブラウザー間同期はなく、サイトデータ削除で消える。

読み取れない値・未知バージョンを空の正常データとして上書きしない。保存直前に最新データを読み、レコードrevisionで古い編集の上書きを拒否する。quota・読取失敗時はエラーを表示し、下書きと既存データを保持。別タブの変更はstorageイベントで反映する。保存と対処は別キーのため、片方の破損で他方を消さない。

## 変更ファイル

- UI：`components/play-plan.tsx`、`components/play-activity.tsx`、`components/use-browser-records.ts`。
- 保存・判定・翻訳・公式リンク：`lib/play-plans.ts`、`lib/play-plans-copy.ts`、`lib/play-activity.ts`、`lib/play-activity-copy.ts`、`lib/play-status-links.ts`。
- 組込み・スタイル：`components/my-games-panel.tsx`（3行追加）、`app/globals.css`（新機能に限定）。
- 検証：`scripts/run-play-plans-check.mjs`、`scripts/check-play-plans.ts`、`scripts/check-play-plans-browser.mjs`、この報告書。

## 検証

最終差分で以下を確認した。

- `pnpm lint`、`pnpm typecheck`、`pnpm build`：PASS。426静的HTML、405 sitemap URL、345既存OGが最新。`git diff --check` PASS。
- `pnpm check:localized`：184ページPASS。新機能の4言語は型検査と下記の画面操作でも確認。
- `node scripts/run-play-plans-check.mjs`：PASS。保存・再読込、設定の参照保持、安全なURL、最大3候補／未設定／該当なし、タスクの削除・復元・上限・完全削除、対処記録、古い編集の拒否、quota、未知スキーマ・不正値、既存キー不変を確認。
- `scripts/check-play-plans-browser.mjs`：4言語×320/360/390/1440px＝16ケースPASS。新機能の実操作、既存メモ参照、キーボードでのチェック、削除→再読込→復元、保存失敗後の入力保持、不正データ到着時の下書き保持を確認。実際にブラウザーを閉じて同じプロファイルで再起動し、進捗・チェック・対処を復元。別タブからの更新による競合、参照元メモの削除も確認。横はみ出し・JS例外・CSS/JS失敗・個人入力を含むリクエストなし。
- 最終ビルド上の既存 `check-game-settings-browser.mjs`、`check-game-experiments-browser.mjs`、`check-my-game-changes-browser.mjs`：各12言語/画面幅ケースと追加ケースPASS。設定・実験は320px長文、既存メモ編集・診断再開、削除／再追加、保存不能・不正データも検証。
- 既存保存ロジックの `run-game-settings-check.mjs`、`run-game-experiments-check.mjs`、`run-my-game-changes-check.mjs`、`run-my-games-page-check.mjs`、`run-my-games-analytics-check.mjs`、`run-support-check.mjs`、`run-saved-solutions-check.mjs`：PASS。
- `check-editorial-snapshots.mjs`：426ページPASS。
- 390pxの全4言語のカードを撮影。最終版の英語画面を目視し、入力欄・ボタン境界、長文折返し、保存値、元メモの対処結果を確認。

証跡：`.wrangler/play-review/results.json` と同ディレクトリの4枚の画像。ログは `/tmp/play-build-final.log`、`/tmp/play-browser-final.log`、`/tmp/play-settings-final.log`、`/tmp/play-experiments-final.log`、`/tmp/play-changes-final.log`。ローカルQAサーバーは検証後に停止。

ブラウザーQAは一時ディレクトリへコピーしたローカルPagesで実施し、D1バインディングを継承しない。APIをテスト応答に代替し、外部通信を遮断する。新しい実機設定・外部サービス状態の取得は行わない。

## 公開・対象外

commit・push・公開なし。DB・認証・課金・GA・IndexNow・Bing/GSCを変更・操作していない。新規ルートや記事タイトルはなく、OG追加は不要（ビルドの既存OG検査を実施）。

実スマートフォン、Safari/Firefox、本番HTML・実API通信は未検証。端末内保存はユーザー操作によるサイトデータ削除やブラウザーの保存領域消去には耐久保証がない。公開する場合はレビュー・明示承認後に最新リモートとの差分を確認し、commit/pushと配信確認を別途行う。

## 公開承認

2026-10-14（日本時間）、ユーザーの「公開して」を受領。最新 `origin/gemunao` は開始HEADの `640f58255fdc0c4bf51d9ff515a7102eb757e27c` と一致し、競合更新なし。検証済みアプリコードを変更せず、14ファイルをコミットして既存Cloudflare Pages Git連携で公開する。配信結果は別の公開記録で確認する。IndexNow・Bing/GSC送信は行わない。
