# batch12：確認日表示とHidHide対象の訂正

基準 PR69 head `215b962806a5e73ed4fc0792da588ebb232a617f`。

- トップ記事カードのcheckedAtを「更新日」から「確認日」に訂正。日付と並び順は変更なし。
- コントローラー二重入力記事の本文1箇所で、HidHideで隠す対象が「仮想パッド」と逆になっていたため「実機のパッドをゲームから隠す」に訂正。既存の補足・FAQと資料に一致させる。出典: https://kanuan.github.io/DS4WSite/guides/solving-double-input/ の実機を隠しDS4Windowsへ許可する説明。新規ドライバー操作の追加なし。

型/lint/localized79/build285 snapshots・272 sitemap・204 OG、home-return-paths/site-search、editorial-safety/snapshots/english-articles、全285ルートローカルPages・CSS/JS・robots/ads/sitemap・ZIP3個byte一致 PASS。最終build後375/390/430/1440pxで確認日、検索・絞込、キーボード消去、記事遷移と戻る/進む、HidHide本文、FAQ開閉、横幅・例外なしを確認。全APIモック・外部通信遮断。変更後に再build・配信・操作を確認済み。

97系統はcompared19/compared-with-holds7/partial26/partial-with-corrections14/read-not-compared31/not-started0。全ページwholePageVerified=false。共通3記事の補足と一次資料を追加比較した範囲は台帳に記録。全件監査完了ではなく、全翻訳・全図解・実機・取得不能資料は残る。DS4Windows資料はツールの資料、Microsoft joy.cplとSteamworksは旧UIも含む資料として区別。現行Steam画面を実機検証したとはしない。

マージ・公開は親の確認待ち。Bot・実ユーザー記録・D1・Cloudflareブラウザ認証は未使用。PV/解決率の推定・ノート本文の計測なし。
