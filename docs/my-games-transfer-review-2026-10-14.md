# トップの次行動・全体バックアップ・設定コピー

2026-10-14。対象：`poe2-build-navi-jp/gemnao` / `gemunao`。開始HEADは公開済み `b705c7950230019d0a22db9a0e7cda25784ffc85`。最新リモートと一致、開始時に既存変更なし。ユーザーの「1-3まで実装して公開して」の承認に基づく3改善のみ。

## 実装範囲

1. **トップの次行動**：既存のマイゲーム入口の中に、登録中の実在ゲームで「次にやること」がある最新記録を1件表示する。続きカードのアンカーへ直接戻る。記録なし・空の次行動・削除したゲーム・未登録のゲームは表示しない。既存の本数リンク・最近の記事・相談ノートの続きは保持。長文は折り返し、日本語・英語・簡体字中国語・スペイン語で提供。
2. **全体バックアップ**：`/my` と4言語の `/my-games#my-games-backup` に端末内のJSONダウンロード・読込を追加。既存 `/my` の `SolutionNotebook` は `serializeSolutions(readSolutions(...))` で相談ノートのみを出力していた。その旧形式とノート専用操作を保持し、全体の対象・入口を明記した。
3. **設定の共有用コピー**：選択中の設定記録で、ゲーム名・設定値・本人の確認日を先に表示してからコピー。自由記述メモは初期状態で除外し、別記録への切替でも除外に戻す。未記録の確認日は未記録と表示し、保存日で補わない。コピー失敗・Clipboard APIなしの時は読み取り専用テキスト欄の選択による手動コピーへ。投稿・送信・実機設定の変更はしない。

## バックアップの仕様

明示的な9キーだけを対象にする：ゲーム登録、マイPC、相談ノート、設定スナップショット、実験ログ、進捗・次行動と候補条件、タスク・対処再開、公式変更の既読、今日の選択条件。記事ブックマーク・閲覧履歴・診断ツールの未保存の回答・認証情報・その他localStorageは取り込まない。

新形式は `format: gemnao-my-games` / `version: 1` と固定の `data` 項目。旧 `{version:1,items:[...]}` は相談ノートのみとして認識。5MB以下を文字長とUTF-8容量で確認し、各保存形式の既存パーサーで既知の項目だけコピーする。危険なURL、未知バージョン、無関係な項目、ID重複、別ゲームへの設定参照を拒否。ゲーム10本、設定10件/ゲーム・100件全体、実験20件/ゲーム・100件全体などの上限を合併後にも確認し、超過時には省略して進めず全体を停止する。

復元前には種類ごとに現在数・ファイル数・追加・重複・競合を表示し、確認チェックと確定ボタンが必要。既存記録を優先し、同じ記録は追加しない。同じIDまたは同じゲームでも内容が異なる記録は取り込まないため、競合時は元ファイルの保管も案内する。削除済み設定の参照値や削除済みノートのIDを保持。内容が異なる同じIDの設定・ノートには参照用IDを割り当て、現在の別記録へ誤って結び付けない。

プレビュー後の保存変更を検知して中止する。最初の変更前に専用キー `gemnao-my-games-recovery-v1` へ復元前・予定状態を記録する。この回復記録の保存自体が容量不足なら変更を始めない。途中失敗時は元の値へ巻き戻し、巻き戻しも失敗した場合は回復記録を残して次の読み込み後に回復ボタンを提示する。復元前のデータをファイルに保存する操作もある。復元開始後に別の変更があれば、その変更を上書きせず回復を止める。別タブに回復記録を上書きされた場合も、その別の復元を勝手に巻き戻さない。

ブラウザーのlocalStorageは複数キーの原子的なトランザクションではない。短い同期処理と変更検知・回復記録で保護し、保存容量や他タブとの同時操作で中止する場合はUIに表示する。サイトデータ削除やブラウザーによる保存領域消去はバックアップファイルから復元する。

## ファイル

- 新UI：`components/next-game-action.tsx`、`components/my-games-backup.tsx`、`components/settings-share.tsx`。
- 保存・選択・コピー・4言語：`lib/my-games-backup.ts`、`lib/my-games-selection.ts`、`lib/my-game-next.ts`、`lib/settings-share.ts`、`lib/my-games-transfer-copy.ts`。
- 既存UIへの組込み：`components/my-shortcut.tsx`、`components/my-games-home-entry.tsx`、`components/my-games-page.tsx`、`components/my-dashboard.tsx`、`components/game-settings-snapshots.tsx`、`components/solution-notebook.tsx`、`app/globals.css`。既存処理を置き換えず追加。
- 検証：`scripts/run-my-games-transfer-check.mjs`、`scripts/check-my-games-transfer.ts`、`scripts/check-my-games-transfer-browser.mjs`、この報告書。

## 検証

最終差分で以下を確認した。

- 全体 `pnpm lint`・`pnpm typecheck`・`pnpm build`：PASS。426静的HTML、405 sitemap URL、345 OGが最新。`git diff --check` PASS。
- `pnpm check:localized`：184ページPASS。新UIの4言語は型検査と実際の画面操作でも確認。
- `node scripts/run-my-games-transfer-check.mjs`：全体往復、重複復元、旧ノート形式、既存優先と参照値保持、登録数・ゲーム別上限、UTF-8容量、不正・危険URL、別ゲーム参照、未知形式、プレビュー後の競合、quota、巻き戻し、再読み込み後の回復、回復後の別変更・回復記録の競合、対象外キー保護がPASS。トップの実記録選択と4言語のコピー整形も確認。
- `scripts/check-my-games-transfer-browser.mjs`：4言語×320/360/390/1440px＝16ケースPASS。長文の実記録から続きへ移動、設定のプレビュー・メモ除外・選択切替・Clipboard成功/拒否・手動選択、実ファイルのダウンロード→プレビュー→確認→再読込→再復元、旧形式、不正ファイル・現在の不正保存・容量超過・競合、途中失敗の回復記録と復元前ファイル・reload後の回復、旧 `/my` の両バックアップ入口を確認。横はみ出し、JS例外、CSS/JS失敗、私的入力を含むリクエストなし。
- 追加の視覚検査も同じ16言語/幅でPASS：復元プレビューと設定コピーを展開した状態の幅を確認。390pxのトップ次行動・コピー・復元プレビューを各言語で撮影。日本語の長文入口・復元プレビューとスペイン語のコピー画面を目視。
- 最終ビルド上の既存4ブラウザー検査：`check-play-plans-browser.mjs`（16ケース＋実ブラウザー再起動・別タブ）、`check-game-settings-browser.mjs`、`check-game-experiments-browser.mjs`、`check-my-game-changes-browser.mjs`（各12ケース＋追加ケース）全てPASS。既存7機能、320px長文、保存失敗、不正データ、コピー/比較、参照元削除、旧ノート編集・診断再開を維持。
- 既存ロジック検査 `run-my-games-page-check.mjs`・`run-my-games-analytics-check.mjs`・`run-support-check.mjs`・`run-saved-solutions-check.mjs`・`run-game-settings-check.mjs`・`run-game-experiments-check.mjs`・`run-my-game-changes-check.mjs`・`run-play-plans-check.mjs`：全てPASS。
- `check-editorial-snapshots.mjs`：426ページPASS。

証跡：`.wrangler/transfer-review/results.json`、同ディレクトリの4枚のバックアップ画像と12枚のトップ/コピー/プレビュー画像。ログは `/tmp/transfer-build-final.log`、`/tmp/transfer-browser-final.log`、`/tmp/transfer-visual-final.log`、`/tmp/transfer-play-final.log`、`/tmp/transfer-settings-final.log`、`/tmp/transfer-experiments-final.log`、`/tmp/transfer-changes-final.log`。追加の視覚検査スクリプトは `/tmp/gemnao-qa/transfer-visual.mjs`。

ローカルPagesは一時コピーとD1を継承しない設定で起動。ブラウザーのAPIはテスト応答へ代替し、外部通信を遮断している。コピーAPI成功・拒否はスタブで検証し、失敗時には実際のテキスト選択も確認する。合成データだけを使い、実ユーザー記録を送信しない。

## 公開

検証通過後に、この3改善を既存Cloudflare Pages Git連携でcommit・push・配信確認する。DB・認証・GA設定・課金・IndexNow・Bing/GSC変更なし。不明な78 URLバッチは再送しない。新しい公開ルートや記事タイトルはなくOG追加は不要。

本番の直接確認が通信制限でできない場合は、同じコミットのCloudflare Pagesチェック成功と、未確認の公開HTML/CSS/JSを明確に分けて報告する。実スマートフォン、Safari/Firefox、OSの実クリップボード許可動作はローカルQAの対象外。

公開前に最新リモートとの差分を再確認し、検証済みの19ファイルだけを公開する。
