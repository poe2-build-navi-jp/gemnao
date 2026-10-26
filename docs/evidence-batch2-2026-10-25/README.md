# 根拠・既存言語の整合：第2バッチ（全体未完）

PR145 の固定 SHA `7b2cebd1c1690af7ceb93b560ba28a36e9c04850` をベースにした後続差分。PR145 の公開承認とは別のレビュー対象です。本番 merge は行いません。新規記事・URL・言語は追加していません。

## 今回の本文変更

| 元記事 | 既存翻訳の根拠整合 |
|---|---|
| `/games/monster-hunter-wilds/not-launching` | `/en/games/monster-hunter-wilds/not-launching` |
| `/guide/directx-error` | `/en/guide/directx-error` |
| `/guide/steam-game-not-launching` | `/en/guide/steam-game-not-launching`, `/zh/guide/steam-game-not-launching`, `/es/guide/steam-game-not-launching` |
| `/guide/verify-steam-files` | `/en/guide/verify-steam-files`, `/zh/guide/verify-steam-files`, `/es/guide/verify-steam-files` |

8既存翻訳ページに、日付を更新せず日本語の限定された根拠を反映。Wilds の日英本文と `/en/guide/pc-game-crash` の同一事例の記述で、10月3日を報告受領日とする断定を元記事の記録日に修正しました。正確な報告日時は未記録です。本人報告を独立した実機検証へ格上げしていません。

部分説明17記事のうち、以下の日本語5記事に個別の結果／限界／比較条件／対象版／公式説明を追加しました。

- `/guide/low-gpu-usage`: 使用率を上げることとFPS改善を区別。60/120fpsは仮例。
- `/guide/low-fps`: 描画解像度と上限を同じ場面で比較。原因・改善率は未確定。
- `/guide/stutter-fix`: 初回と再訪、固定Hz/VRR、平均FPSと停止を区別。90fpsは最適値ではない。
- `/guide/vram-shortage`: 専用／共有・内蔵GPU・プロセス集計を区別。数値は測定結果ではない。
- `/games/aniimo/video-memory-error`: 7.6→5.2GBは仮例。更新告知からエラー修正済みとは判断しない。

この5記事の既存翻訳への展開は次のバッチです。共通表示は登録済み記事だけに適用し、ホーム・機能一覧・未登録記事へ同じ注意書きを一括追加していません。

## 出典確認と限界

- Microsoft [GPU表示解説](https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/)：2026-10-25にGPUエンジン、WDDM条件、専用／共有メモリを照合。2017年の説明を現在の全UI確認としない。
- NVIDIA [3D設定](https://www.nvidia.com/content/Control-Panel-Help/vLatest/en-us/mergedProjects/nv3d/Manage_3D_Settings_(reference).htm)：同日にプログラム別設定と復元の説明を照合。カクつき改善の実測根拠ではない。
- Aniimo [9月23日更新告知](https://aniimo.com/ja/newslist/detail/100139)：同日に告知日・更新予定・再起動案内を照合。最新パッチやVRAMエラーの解消確認ではない。
- Microsoft CPU/GPU制約記事の取得は403。迂回・再試行していない。該当2記事で本文再確認不可を明記。
- SteamはPR145の限定を継承。公式検索抜粋のみでFAQ全文・現行UIは未再確認。新しい手順の断定を追加していない。

## 全191記事のcoverage

[coverage.json](coverage.json) に記事別の短答文字数、手順数、操作数、結果欄、出典URL、既存の限界説明の引用、対象欄、本文内のプラットフォーム記述、次の個別作業を保存。[coverage.tsv](coverage.tsv) は一覧用です。`node scripts/inventory-evidence-batch2.mjs` で再生成できます。

| 区分 | 件数 | 今回の監査で分かること／残件 |
|---|---:|---|
| 先行の個別説明 | 5 | PR145の4件＋既存Rocket League。根拠欄があることを全断定の実証としない |
| 今回の個別説明 | 5 | 性能/GPUの個別範囲を追加。実測版は未記録 |
| 部分説明の残り | 12 | ゲーム1・共通4・Discord7。記事固有の次作業をJSONに記載 |
| 限界説明あり | 50 | ゲーム22・共通6・Discord2・PC20。説明の適用範囲、公式根拠、実測版の照合は未完 |
| 根拠分離の個別監査対象 | 119 | ゲーム79・共通11・Discord29。構造と既存情報を監査、断定と一次資料の照合は未完 |

残181件には結論・操作・出典の構造があります。ただし結論欄の存在は「短く十分な回答」、操作欄は「実際に成功した手順」、出典欄は「全断定を裏付ける根拠」を保証しません。119件のうち33件は専用の対象欄がなく、本文のプラットフォーム記述を出典へ対応付ける必要があります。5件は結論が220文字超で短答化の編集候補です。この文字数は品質の合否基準ではありません。50件にも対象欄がない22件があり、単なる限界説明を全要件充足に数えません。

次のまとまり：残りの共通4記事（freeze/crash/driver/disk）と同じWilds事例の表記 → Discord7件 → ST-3100001 → 119件の対象欄がない共通・ゲーム記事。50件の範囲照合も残ります。各記事の既存情報に応じて進め、全体整備は未完です。

## 検査

最終結果はPR本文および `validation.json` に記録。ブラウザ検査はローカルの生成物が対象で、ゲーム実機試験・本番配信確認ではありません。外部通信と書込みを遮断し、APIは503のfixtureを使用します。スクリーンショット等の生成物は公開コミットに含めません。

既存のDiscordルート期待値不一致は、先行作業で変更前 `a03f37a` と先行headの同じ失敗を比較済みです。このバッチで比較試験を再実行したものではなく、全証拠記事スイート合格ともしていません。
