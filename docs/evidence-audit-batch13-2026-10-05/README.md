# batch13：Myのメンテを予定時刻だけで終了扱いにしない

基準 PR70 head `a6f45531b3be24941a5ef74bc77795c03087d736`。

Myは予定終了時刻を過ぎた項目を除外し、予定前でも公式に完了・中止となった項目を残す可能性があった。既存StatusのcurrentMaintenanceを共有し、公式の終了・中止だけを除外、経過後は「終了未確認」で残す。予定・予定時間内・実施中も共通ラベルで表示し、時刻が予定と明記する。公式告知・確認日・終了情報は作成/更新しない。

## 検証

- 型/lint/localized79/build285 snapshots・272 sitemap・204 OG、Statusの状態遷移/完了中止除外/失敗回帰、MyGames4言語の実handler・上限・不正データ・計測回帰、My表示の4状態/空状態/計測なし、snapshot検査 PASS。
- 375/390/430/1440px: 初回空、AION2選択のローカルfixture、予定経過後の終了未確認・予定時刻、公式リンクのキーボードfocus、再訪・戻る/進む・削除後の空・横幅/例外なし PASS。全APIはモック、外部通信遮断。
- 静的配信検査は初回タイムアウト。不要な以前のローカルpreviewを終了後に再実行し、全285ルート・CSS/JS・HEAD/query/RSC分離・robots/ads/sitemap・ZIP3個byte一致 PASS。初回ログも保存。

保存形式/MyGames上限/記事末尾CTA/URL/SEO/AdSense/D1を変更しない。Myは既存の日本語のみ。実ユーザー記録・D1・Bot・Cloudflareブラウザ認証には触れていない。

## 追加比較と残り

97系統: compared19 / compared-with-holds7 / partial29 / partial-with-corrections14 / read-not-compared28 / not-started0。すべてwholePageVerified=false。AION2の早期アクセス発表、Wilds公式の一部対処、Status実装を追加比較。全件監査完了ではない。

Wilds公式サイト403、Steam要件本文未取得、AION2年齢確認ページ、公開APIのweb取得不可/shell proxy403は限定した保留。別の未読/未比較を取得不能扱いにしない。確認済みでもゲーム/Windows実機での動作検証とはしない。詳細は台帳。PV/解決率の推定やノート本文を含む新規計測なし。

マージ・公開は親の確認待ち。
