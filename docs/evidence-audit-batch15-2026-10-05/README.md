# batch15：NVIDIAの容量違いを区別する

PR72の後続。gemunao `528f97e277bc732ecf043a23d492b8ed320d24c0`を取り込み済み。

RTX 3050・3060・3080・4060 Ti・5060系を単一のVRAM容量で扱っていたため、低容量版を満たす扱い、高容量版を不足扱いにする場合があった。NVIDIA公式仕様表に合わせて11の容量別選択肢を追加し、既存保存IDは消さず容量範囲として保持する。範囲内で合否が分かれる旧選択は「△、型番の選び直し」を案内する。範囲より大きな要求は不足扱いを維持する。編集部の性能tierは変更しない。保存形式やキーは変更しない。

## 検証

型・lint・容量境界/旧ID/明確なメモリ不足優先の回帰 PASS。ビルド285 snapshots / 272 sitemap / 204 OG成功。既存prerenderのERR_UNSUPPORTED_ESM_URL_SCHEME警告があるが終了0と生成を確認。

375/390/430/1440pxで旧IDの読み込み、未保存変更の破棄、11種類の明示保存と再訪、キーボード保存、戻る/進む、削除、横はみ出し・JS例外なしを検証。外部通信遮断、APIモック、ローカルfixtureのみ。配信ロジックに変更がなく、全285ルート静的HTTP検査はPR72の結果を継承し今回は再実行しない。翻訳データも変更なし、79ページ検査はPR72の結果を継承。添付スクリプトを追加後にも全体lintを実行。

## 監査範囲

97系統: compared19 / compared-with-holds7 / partial36 / partial-with-corrections18 / read-not-compared17 / not-started0。全件wholePageVerified=falseで全監査完了ではない。MyGames4言語の保存・上限・ニュース条件を実装と照合、SkyrimのSKSEランタイム対応案内を著者ページと照合した。

SkyrimのSteam要件は年齢確認に遷移し未取得。ドラゴンズドグマ2の公式update URLはweb取得エラー。この2点をページ全体の取得不能とはしていない。GPU全カタログ・内蔵GPU・未知のGPU判定・実機性能・残りのゲーム主張は未検証。詳細と一次資料URLは台帳参照。

記事末尾CTA、MyGames上限、URL/SEO/AdSense/D1、診断ZIPは変更なし。新規計測なし。実ユーザー記録・Bot・Cloudflareブラウザ認証に触れていない。マージと公開は親の確認待ち。
