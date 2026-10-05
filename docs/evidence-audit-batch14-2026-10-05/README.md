# batch14：症状ハブの適用条件と保存操作の順序

PR71 head d0dd4700942c02e4b35cec0750482ee36a06f126を継承し、gemunao 28b3708caf5ba2e728b29aebc42b619246b32ba7を取り込み済み。

起動・クラッシュ・セーブ・コントローラーの4ハブで、使用中のMOD/ツールだけを比較する条件、DLLを名前だけで削除しない注意、有線対応パッド/Steam版の適用条件を明示。保存はゲーム終了→利用中のクラウド同期完了→ランチャー終了→バックアップの順にし、復元前の退避を案内する。ゲーム固有ガイド優先と1項目ずつ戻せる案内を維持する。新たな解決実績や公式更新を作らない。

## 検証

型・lint・翻訳79ページ・ナビゲーション回帰・保存安全性回帰 PASS。ビルド成功、285 snapshots / 272 sitemap / 204 OG。既存prerenderのERR_UNSUPPORTED_ESM_URL_SCHEME警告は出るが終了0と生成結果を確認。

375/390/430/1440pxで4ハブの文面、キーボードでガイドへ移動、戻る/進む、横はみ出しとJS例外なしを確認。全APIはローカルfixture、外部通信遮断。今回変更していないノート保存・開閉は再検証していない（先行PRの検証を継承）。静的配信285ルート、CSS/JS、robots/ads/sitemap、ZIP3個byte一致 PASS。D1未接続。

## 比較の範囲と制限

97系統は compared19 / compared-with-holds7 / partial34 / partial-with-corrections18 / read-not-compared19 / not-started0。全件wholePageVerified=false。全ページ監査完了を意味しない。追加比較は台帳に明記し、未比較主張・翻訳・図版などを残している。

Windows診断ZIPのREADME・ビルド報告・同意/履歴/出力に関連するソースの一部とソースguardrailsを比較。guardrails PASS。dotnetがなく386 syntheticを再実行していない。Windows実機UI・ネイティブ収集・DPAPI・ごみ箱は未検証で、同梱報告にもこの制限がある。配布物は変更しない。

記事末尾CTA、保存形式、MyGames上限、URL/SEO/AdSense/D1は変更しない。新規GAイベントや個人情報/本文送信なし。PVや解決率の効果測定はしていない。Bot・実ユーザー記録・Cloudflareブラウザ認証に触れていない。マージと公開は親の確認待ち。
