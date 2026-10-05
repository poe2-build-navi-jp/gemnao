# batch11：GPUの異なるVRAMを同じ容量として判定しない

基準: PR68 head `028fb122f06f5710c81317843f4681b16f051230`。公式仕様で確認した4070 Ti/Ti SUPER、7900 XT/GREの2系列を修正。

旧IDと保存形式は維持し、旧選択から型番を推測しない。必要VRAMが容量範囲内なら△で型番の選び直しへ、範囲の上限より多ければ×。容量を明記した個別4選択肢を追加。GPU性能tierは従来の編集部目安を維持。別の確定したRAM/OS不足は引き続き×。この修正はカタログ全製品の検証完了を意味しない。

## 根拠

- NVIDIA 4070 family仕様表: https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-family/ （Ti 12GB、Ti SUPER 16GB）
- AMD GRE: https://www.amd.com/en/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7900-gre.html （16GB）
- AMD XT: https://www.amd.com/en/products/graphics/desktops/radeon/7000-series/amd-radeon-rx-7900xt.html （20GB）

## 検証

tsc/lint/localized79/build285 snapshots・272 sitemap・204 OG、GPU境界値/旧ID/個別型番/RAM不足優先テスト、MyGames analyticsと4言語実handler/ページ回帰、snapshot検査、全285ルートのローカルPages配信・CSS/JS・robots/ads/sitemap・ZIP3個byte一致 PASS。

375/390/430/1440pxで旧保存fixture、未保存変更の破棄、4選択肢のキーボード保存・再読込、戻る/進む、削除、横幅、例外なし PASS。ブラウザスクリプトとログはvalidation/。node直接実行は拡張子解決で失敗したため、既存と同じesbuildランナーを作成して成功。製品の失敗ではない。

## 監査継続

97系統: compared19、compared-with-holds7、partial24、partial-with-corrections12、read-not-compared35、not-started0。全ページwholePageVerified=false。未着手0は全主張・翻訳・補足の読了/比較完了ではない。最後の日本語3主ページを読解し、Windows黒画面・更新停止を公式と部分比較。トップのcheckedAt更新日表示を追加発見し、次の小修正へ残す。他GPU容量違い、内蔵GPU RT、未知ID、Myメンテ表示の差も未修正で継続。

Windows実機未検証。実ユーザー記録・D1・Bot・Cloudflareブラウザ認証は未使用。PV効果/解決率の推定・新しい個人情報計測なし。マージ・公開は親の確認待ち。
