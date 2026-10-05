# batch8：確定修正と残り97系統の途中経過

基準: `c6c026fbe7f1c9cc1075918dc658b8877c375dc4`（PR65反映済み）。2026-10-05。全97系統の完了報告ではない。

## 確定修正

- Windows 11のSecure Boot対応と有効化を区別。Windows 10通常サポート終了の説明にESUの条件付き例外を補足。
- DawnwalkerハブのBIOS案内を対象IntelデスクトップCPUに限定し、感度0.8をPCへ一律適用しない。Elden RingのHDR調整アプリをWindows 11に限定。鬼武者ハブのdriver・cache要約を既存個別記事の条件へ合わせる。
- Hzツール一覧をブラウザ描画頻度の推定と明記。低FPSの原因をGPU性能不足と決めつけない。
- Alt+Enterが効かない時のゲーム設定操作は、画面が見える場合だけ。
- プライバシー説明を実装の対象/種別/日時保存・新規書込時の30日超削除へ合わせる。保存実装は変更なし。

一次情報と比較範囲は`comparisons-97.json`。ハブ3件はbatch7の同じ主張の比較記録を再利用。未比較の仕様へ確認済みを広げず、checkedAtは変更しない。

## 97系統の内訳

|状態|系統数|
|---|---:|
|比較した対象主張に修正・保留なし（compared）|18|
|理由付き保留あり（compared-with-holds）|7|
|部分比較（partial）|9|
|修正を伴う部分比較（partial-with-corrections）|8|
|本文既読・出典対応未完（read-not-compared）|16|
|未着手（not-started）|39|

comparedは記載した主張の比較。Windows・ゲーム・機器の実機再現やページ全体の正しさを保証しない。partialの未比較範囲とholdsの取得失敗・根拠欠落は別欄。read-not-comparedは本文を読んだだけで事実確認済みではない。

## 検証

- `pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm check:localized`（79）PASS。
- `pnpm build` PASS：285 HTML snapshots、272 sitemap URLs、204 OGカード一致。
- editorial-safety / editorial-snapshots / english-articles / safe-step-navigation PASS。
- ローカルPages配信285ルート、CSS/JS、robots/ads/sitemap、HEAD/query/RSC分離、ZIP3個のbyte一致PASS（validation/static-delivery.txt）。D1 bindingなし。
- 375/390/430/1440px：鬼武者の日英黒画面案内、結果押下、保存取消/保存、再訪、戻る/進む、キーボードPASS。SteamInputの前提条件、ノート切替、4言語レイアウトPASS。
- 同4幅で変更・関連9ページの横幅/metadata/開閉と、Hz開始・中断・完了を操作PASS。再現用スクリプトとログはvalidation/。

## 制限と残作業

- 97系統の未着手・未比較が残る。共通14の補足コンポーネント、ゲームハブの仕様・翻訳、一覧/運用/ツールの実装照合、残るPC/Discord本文とmeta等を継続。根拠URLがあるだけで比較済みにしない。
- Windows実機・GPU・ゲーム・周辺機器は未検証。テストはLinux Chromiumと合成fixture。実ユーザー記録・本番D1にはアクセスしていない。
- Botを再開せず、Cloudflareブラウザログイン/CAPTCHAは不使用。PV効果/解決率の推定なし。新規計測追加なし。
- batch7のCastlevania保留表にはCPU/RAM転記ミスがある。実記事/ハブの主張はi5-8400/16GB。一次本文未取得という保留自体は継続。
- draftレビュー用。マージと本番反映・公開後確認はまだ実施していない。
