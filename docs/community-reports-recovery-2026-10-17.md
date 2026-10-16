# ゲムなお 報告UI/API復旧確認（2026-10-17 JST）

## 統合内容

- 現行ブランチ `gemunao` の `cbff64e530d238aa81c1c481f4ac552b2856e90c` を取得して復旧。
- 受領ZIPのmanifest対象105ファイルについてSHA256とサイズを照合し、すべて一致。
- 56ファイルの旧原本は一括適用せず、基準 `2501d2758dcde9dd98184f4be265a571cbe869e1` のUI/API統合38ファイル差分を適用。
- 37ファイルは統合候補と完全一致。`cloudflare/worker-source.mjs` は現行のbootstrap管理画面のprivate/no-store/noindex/CSP保護を残し、報告UI用の保護を追加。
- `ops/community-reports/closed-source.json` が指定する21ファイルの固定hashをすべて維持。Wrangler設定、初期化phase、bootstrap/maintenanceを変更していない。
- 記事本文、翻訳本文、OG画像、既存のマイゲーム保存キーを維持。

## 今回再実行した検証

| 検証 | 結果 |
| --- | --- |
| `pnpm install --frozen-lockfile` | 成功。依存定義・lockfile変更なし |
| `pnpm build` | 成功。記事snapshot 438、sitemap 417 URL、OG 357 |
| `pnpm typecheck` | 成功 |
| 復旧38ファイル内のTS/TSX/MJSに対するoxlint | 成功 |
| `pnpm check:localized` | 成功。翻訳190ページと3ゲームの整合 |
| `node scripts/check-community-reports.mjs` | 成功。32群。隔離されたローカルSQLiteのみ |
| `node scripts/check-community-reports-operations.mjs` | 成功。12群。合成HTTP・ローカルSQLiteのみ |
| `node scripts/check-community-reports-integration.mjs` | 成功。private/cache/CSP、GA除外、保存範囲など |
| operating-plan/publication-check単体テスト | 21件成功 |
| bootstrap-phase/preflight単体テスト（未変更の現行基準ソース） | 34件成功 |
| `git diff --check` | 成功 |

## 検証の限界

- 全体の `pnpm lint` は既存のbootstrap関連4ファイルで失敗した。今回復旧した38ファイルは個別lint成功。既存箇所は、`components/reports-bootstrap-admin.tsx`、`app/admin/reports-bootstrap/page.tsx`、`tests/community-reports/bootstrap-phase.test.mjs`、`scripts/check-bootstrap-admin-browser.mjs`。
- bootstrap-phaseのソース範囲検証は、UIの追加を認めない初期化専用ワークフローの検査。UI統合済みツリーでその公開ゲートを流用しない。初回の検証ではpartial clone由来の未取得Git objectで失敗したため、Git objectを取得し直し、UI未適用の現行基準ソースで34件すべて成功を確認した。ゲートや検証hashを緩和していない。
- ブラウザ描画・スクリーンショット・24シナリオは今回は再実行していない。受領ZIPの過去実績と今回の実行結果を混同しない。
- 本番APIの書込・削除・初期化・利用量収集・cleanup・cron・credential作成/登録・通知の送信・受付再開は実行していない。今回のローカル検証は本番運用の準備完了を証明しない。
- 受付再開には、受領資料 `evidence/permissions-and-launch-gaps.json` にある実利用量の完全性・鮮度、collection/cleanupの実行証跡、外部health監視と通知到達などの未確認事項が残る。

復旧差分は本番とは別のブランチで保存する。本番の設定・データはこの復旧作業で変更しない。

## 公開ブランチへの統合確認

- 回収commit `f6e928cb7e7548cf7f51b6846580ab33c04cbc2e` はpin commit `cbff64e530d238aa81c1c481f4ac552b2856e90c` の直接の子。競合なく統合でき、38ファイルと本記録以外の差分はない。
- pin run `38950683052` のcontrol job `117141404439` の成功receiptを確認。Pages deployment `1ed878e3-32bb-46ab-a6d5-2a9245e55506`、Pages/cleanupともinstance `c3cdfc3f-6ba1-495e-b3fd-a377b610b25e` 固定、bootstrap OFF、受付OFF、Worker URL/preview OFF、cron空。
- 今回は既存のビルド・型・変更箇所lint等の上記検証を再利用。統合検査、operating-plan/publication-check単体21件、21個の固定backend hash、全9報告フラグOFF、UUID一致を再確認した。
- この環境から本番GET検査は `HTTP_UNAVAILABLE`。UI公開後のHTML/CSS/JS・4言語報告画面・health受付OFF確認は親ブラウザ側で必要。ローカル検査を本番成功と扱わない。
- UI/APIの配信だけを対象とし、使用量profile、credential、セキュリティ設定、cleanup実行、cron、受付フラグは変更しない。実運用の開始条件は引き続き未確認。
