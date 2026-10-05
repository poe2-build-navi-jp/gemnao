# batch10：記事の確認日を更新日と区別

PR67 head `52c62502655819b9b9e504cedc2184dca4e56a06`からの小修正。MyのcheckedAt由来の表示を「記事の確認」に変更し、実際に内容が更新されたという誤認を避ける。新しい日付・更新履歴・計測の追加なし。保存形式・バッジ判定・URL・SEO・AdSense・D1は変更しない。Myは既存の日本語専用ページで、架空の翻訳は追加しない。

## 検証

- tsc、lint、localized（79）、build（285 snapshots/272 sitemap/204 OG）PASS。
- my-games-page、my-games-analytics（4言語/上限/不正保存/旧dashboard）、saved-solutions、reading-experience PASS。
- editorial-safety、editorial-snapshots、english-articles PASS。
- 375/390/430/1440pxで初回、ゲーム保存fixture、確認日の文言、再訪バッジ、キーボード開閉、戻る/進む、記録削除後の空状態、横幅、例外なしを確認。APIはローカルモック、外部通信を遮断。validation/に実行スクリプトと結果。
- 全285ルートのローカルPages配信、CSS/JS、HEAD/query/RSC分離、robots/ads/sitemap、ZIP3個byte一致 PASS。D1 bindingなし。

build中のERR_UNSUPPORTED_ESM_URL_SCHEME警告は最終build成功・snapshot/配信検査通過と区別する。本番反映・実機Windows操作は今回未実施。PV効果/解決率を推定しない。ノート本文や個人情報を新しく計測しない。

## 監査範囲

97系統: compared 19 / compared-with-holds 7 / partial 22 / partial-with-corrections 12 / read-not-compared 34 / not-started 3。comparedは台帳に記載した主張のみ。全項目wholePageVerified=falseで、全件監査完了ではない。未読の補足・翻訳・画面、資料未取得、比較待ちを保留と混同しない。追加のGPU仕様不整合などはwork-in-progress.mdに残す。

マージと公開は親の確認待ち。Bot・実ユーザー記録・Cloudflareブラウザログイン/CAPTCHAは未使用。
