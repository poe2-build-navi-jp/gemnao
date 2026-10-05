# batch10監査記録

PR67 head `52c62502655819b9b9e504cedc2184dca4e56a06`から分岐。全97系統の監査は継続中。

共通8件（BSOD、電源断、VRAM、音声、保存バックアップ、アンインストール、設定リセット、Steam Cloud）の本文・メタ・FAQ・補足を読了し、台帳の指定主張を一次資料と部分比較。Steam消費者FAQの本文取得不可、ASUS取得失敗は未比較として保持。System/MemoryDiagnostics-ResultsはMicrosoft 0x116資料に記載があり、別公式資料との差を理由に誤りと断定しない。AMD Metricsの画像とタブ対応は未照合。

My、MyGames、Status、Windows診断、Discordハブ、症状ハブ7系統を追加読解。MyDashboardは部分、MyGamesのESコピー後半と本体、Windows診断末尾・配布ソース、Statusデータ後半、症状図解は未読範囲あり。主ページを読んだことと全主張の比較を区別する。

MyのcheckedAt→「記事を更新」という表示だけを修正。再訪バッジのロジックや保存形式は変更なし。

## 次の精査対象

- GPUカタログのまとめ方と判定。RTX4070TiSUPER=16GB/Ti=12GB（https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-family/）、RX7900GRE=16GB（https://www.amd.com/en/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7900-gre.html）。現在それぞれ12GB、20GBで一括しており不整合。旧保存IDの曖昧さを保持して別修正が必要。他の複数容量SKU、内蔵GPUのRT可否も未比較。
- Myのメンテ終了時刻での除外とStatusの終了未確認/完了状態の扱いの差。
- StatusのDB取得失敗時と急増なしの区別。実データに接続して調べない。
- Steam4566の抽出は1行。タイトルだけでアンインストール出典が誤りと断定しない。

実ユーザー記録、D1、Bot、Cloudflareブラウザ認証には触れていない。実機のWindows/GPU操作を検証済みとはしない。
