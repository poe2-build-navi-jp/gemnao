# batch16：AMD・Intelの容量違いを区別する

PR73の後続。RX7600/XT、RX9060XT、ArcA750/A770、B570/B580のVRAM容量をAMD/Intelの製品仕様で照合。9種類の型番・容量別選択を追加し、旧IDは容量範囲として保持する。例えば旧RX9060XT保存は8GBか16GBか判断できないため、12GB要件に自動合格せず再選択を案内する。性能tierは従来の編集目安を継承し、実測性能の判定とはしない。保存形式/キーは変更しない。

## 検証

型・lint・容量境界/旧ID/明確なメモリ不足優先の回帰 PASS。ビルド285 snapshots / 272 sitemap / 204 OG成功。既存prerenderのERR_UNSUPPORTED_ESM_URL_SCHEME警告があるが終了0と生成を確認。

375/390/430/1440pxで旧ID、未保存変更破棄、9種類の明示保存/再訪、キーボード保存、戻る/進む、削除、横はみ出し・JS例外なしを検証。初回はpreview起動前に接続して失敗。Ready確認後に再実行したログと初回ログを保存。外部通信遮断・APIモック・ローカルfixtureのみ。

配信ロジック/翻訳に変更がないため285ルート全静的HTTP/翻訳79検査はPR72結果を継承。新しい全体検査を重複実行しない。

## 比較範囲

97系統: compared19 / compared-with-holds7 / partial38 / partial-with-corrections18 / read-not-compared15 / not-started0。すべてwholePageVerified=false。全監査完了ではない。

アニモの修復/倍率/報告窓口等を公式FAQ/告知と、Rocket Leagueの4言語focusedハブの接続/再起動/firmware更新注意をEpic/Sonyと追加比較。個別記事・図版・全主張や実機動作を検証済みとはしない。一次資料URL/保留/未比較範囲は台帳参照。

GPUカタログの他の旧型容量違い、内蔵GPU、未知のGPU、性能tierは未検証。Intelの最初のA770/B570 URLはエラーだったが、容量/正しいSKUを含む公式URLで取得できたため取得不能扱いはしない。ドラゴンズドグマ2公式トップ/更新ページはweb取得エラーで他の取得先は未試行。

記事末尾CTA、MyGames上限、URL/SEO/AdSense/D1、診断ZIPは変更なし。新規計測なし。実ユーザー記録・Bot・Cloudflareブラウザ認証に触れない。マージと公開は親の確認待ち。
