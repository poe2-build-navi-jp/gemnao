# 公開と復旧

## 2026-10-07 integration: still disabled and not released

Rebased onto production source a77bb60383860196a5f7d1503f0008eeccac9b9a. No production migration, runtime flag, binding, credential, cleanup Worker or deployment is changed by this integration.

The candidate schema is staged only at `migrations/diagnosis/0001_diagnosis.sql`, outside `.openai/drizzle`. Production already owns `0004_step_result_reports.sql`; its control workflow and prior approval do not cover diagnosis. The staged filename is not a production migration-registry assignment. Before any remote SQL, separately verify actual diagnosis objects, existing history, target/preview isolation, backup and ownership; review an exact forward-only migration and registry plan. Never replay existing DDL or write a fabricated history entry. The local harness applies the staged file only to its fixed dummy DB using `--local`.

## Historical starting configuration

2026-10-02にpublic Git cloneで確認: `poe2-build-navi-jp/gemnao`, branch `gemunao`, base commit `cdc1581301a00b0ff35dd5d833b263c49bfed6b1`。そのcommitのCloudflare Pages checkは成功、previewは https://e345be6d.gemnao.pages.dev 。既存公開URLは https://gemnao.pages.dev 。Vinext/React/TypeScript、pnpm-lock、Pages worker wrapperを使用。

`wrangler.json`: Pages project `gemnao`, D1 binding `DB`, DB名 `gemnao-db`, DB ID `385a194f-5119-4bbe-9afe-2e6ce4ceb341`, migration `.openai/drizzle`, 管理表 `d1_migrations`。これはリポジトリ上の設定。実際のPages production/preview bindingと既存D1 schemaの管理画面照合は別の公開必須ゲート。アクセスできなければ推測で本番へ適用しない。

## 初期状態

診断DBへのアクセス、新規共有、計測は既定で無効。`DIAGNOSIS_STORAGE_ENABLED=true`を明示した環境でだけ診断DBへアクセスする。既存wrangler.json/Cloudflare設定やD1接続情報は変更していない。migrationはファイル追加のみで、アプリ起動時に勝手にテーブルを作らない。安全なfeature previewでは共有と計測を無効のままにし、本番と分離されたD1が確認できるまで有効化しない。

## 開発/検証

1. `pnpm install --frozen-lockfile`
2. `pnpm typecheck && pnpm lint && pnpm test:diagnosis && pnpm build`
3. `pnpm test:diagnosis:browser`（既存Chromiumが`/usr/bin/chromium`以外ならCHROMIUM_PATHを指定）

ブラウザスクリプトは識別済みの偽ID `00000000-0000-4000-8000-000000000004` のローカルD1に全migrationを適用し、ローカルのPagesとcleanup Workerを起動する。`--remote`は使わない。HTTP/D1/Cron統合確認も行う。ブラウザ実行不可の環境では `DIAGNOSIS_SKIP_BROWSER=true bash scripts/test-diagnosis-browser.sh` でHTTP側のみを実行し、ブラウザ済みと扱わない。

このクラウド作業環境はOS interface inventoryが取得できないため、テスト専用bootstrapが失敗時だけloopbackを使用する。ChromiumのUnixソケット利用が拒否される環境では、制限を回避せず許可されたプレビュー用ブラウザで確認する。

## 本番共有を有効にする前

1. Pages project、production branch/build command/output、現行commit、production DB bindingを確認
2. previewに別DBを設定。既存テーブルのschemaとmigration履歴を読み、バックアップ/復旧窓・追加exports・基盤ログを確認
3. 承認済みの個別手順で検証DBへ `migrations/diagnosis/0001_diagnosis.sql` の追加schemaを適用。既存migrationは履歴に従い、不用意に再適用/初期化しない
4. 別のcleanup Worker用の `cloudflare/wrangler.diagnosis-cleanup.json` のプレースホルダーを検証済みDB名/IDに置換。新しい恒久的DBアクセスを与える場合は運営者の承認を得る
5. cleanup Workerを同じ検証DBへ公開し、毎時17分UTCのCronを登録。手動検証、失敗時ログと通知/担当、heartbeatの更新、期限切れ削除を確認
6. 本番も同じ順で追加migration、cleanup Worker/Cronを準備。実績が確認できてからPagesの `DIAGNOSIS_STORAGE_ENABLED=true` と `DIAGNOSIS_SHARING_ENABLED=true`。必要なら `DIAGNOSIS_METRICS_ENABLED=true`。実行には既存の認証済み公式環境を使い、トークンをコードへ入れない
7. このfeatureのテスト済みcommitをproductionへ反映。Pages checkが当該commitで成功したことを確認
8. 公開URLで診断→結果→共有作成→別セッション閲覧→他人の変更拒否→所有者更新→失効→削除。検証データは最後に削除
9. CSS/JS200、既存記事、locale、feedback、robots、ads、canonical/Article/FAQ/パンくず/Google確認/AdSenseを確認

期限後24時間以内の削除を実際に守れる運用が作れなければ、有効化前に仕様を修正する。heartbeatが一度あるだけで以後の24h目標を保証しない。

## 監視・故障対応

- cleanup Workerの実行ログは`diagnosis_cleanup_success`。秘密や回答はログへ出さない
- D1: `SELECT value FROM diagnosis_operations WHERE key='cleanup_success';` のUNIXミリ秒が2時間以内か
- 期限切れ残留: `SELECT COUNT(*) FROM diagnosis_shared WHERE expires_at <= <現在のUNIXミリ秒>;`
- 値が古い/失敗ならCron設定、対象DB、Workerエラー/上限を確認。新規作成/更新と集計は自動停止し、期限による閲覧拒否は継続
- 復旧後に削除処理を実行し、成功heartbeatと期限切れ件数を確認してから作成の再開を判断
- CF使用量/費用のアラートと大量アクセス時のWAF上限も公開前に確認

## 個別停止

`DIAGNOSIS_STORAGE_ENABLED`は接続許可の初期ゲート。公開後は所有者の削除を維持するため通常trueのままにする。未確認のpreview環境ではfalseのままにし、他のフラグだけで保存を有効にしない。

- `DIAGNOSIS_WRITES_ENABLED=false`: 新規共有/更新を止める。既存の閲覧と本人の失効/削除は可能
- `DIAGNOSIS_SHARING_ENABLED=false`: 共有の閲覧/作成/更新を止める。本人の失効/削除/復元は可能
- `DIAGNOSIS_ENABLED=false`: 診断ページと診断APIを止め、CTAはconfig取得後に隠れる。管理画面と本人の失効/削除/復元だけ維持
- `DIAGNOSIS_METRICS_ENABLED=false`: 集計停止
- CTAをHTML初期表示から隠すには `NEXT_PUBLIC_DIAGNOSIS_ENABLED=false` で再buildする（API側フラグも併用）

フラグはプロジェクトで実際に有効な設定元（wrangler.jsonのvarsまたはPagesの管理設定）へ文字列で設定する。設定元を確認せず管理画面側だけの変更が有効になると仮定しない。反映には再デプロイが必要な場合がある。変更後は実際のレスポンスを確認する。ボタン非表示だけで停止したと判断しない。

## コードのロールバック

1. Pages dashboardで既知の直前正常デプロイへrollback、またはこのfeature commitをrevertして既存branchへ反映
2. トップ、記事と静的assets、既存D1機能を確認
3. 追加した診断テーブルは削除しない。既存データを保持し、cleanupを継続して既発行データの期限を守る
4. 古いコードに管理APIがない場合でも、診断テーブルだけの安全な失効/期限削除手段を先に確保する。削除・復元権限を失わせたまま放置しない

完全な旧コードへのrollbackは共有管理画面もなくなるため、通常は先に機能フラグで停止する。削除処理と管理を維持できる安全な最小修正を優先する。

## Dormant integration gate (2026-10-07 review correction)

The entire web diagnosis surface now defaults off: runtime `DIAGNOSIS_ENABLED` and build-time `NEXT_PUBLIC_DIAGNOSIS_ENABLED` both require the exact string `true`. Missing, false or malformed values do not activate it. CTA starts hidden and cannot be enabled by runtime configuration when the build gate is off. The wizard starts disabled pending configuration; the default build contains only a preparation message at `/diagnose`, marks it noindex and omits it from sitemap. The worker returns a no-store 503 while runtime activation is absent. Future publication requires separately reviewed activation, an explicitly enabled build, runtime flags and browser QA; none is performed here. Owner management/deletion remains available under its separate verified storage permission even when diagnosis intake is switched off.
