# 2026-10-05 継続監査（30ページ群）

基準: `8f03f0bca9fab3e75cfb388a08b80b011f5a4c5d`。PR61で残した30ページ群の限定命題を、ローカルの公開ルート用ビルド本文と一次資料本文で手動比較した。公開サーバーの検証ではない。

比較群は 74（根拠あり 72、文言訂正 1、資料の適用範囲の整理 1）。対象は各JSONのclaimに明示した範囲で、全文・全事実の個数ではない。未比較の文書範囲は 27 群、編集上の比較提案や実機制約は 11 群に分けた。取得不能8資料群は未比較範囲と重複するため加算しない。

## 訂正と追加照合

- Discord通知: 公式本文に旧・新設定名が混在しているため、DMの許可設定の意味と両表記を案内。日本語の現行実機ラベルを確認したとは扱わない。
- Discord記事の障害注意: サイト全体で自動取得していないという誤記を除き、この記事自体が現在の稼働状況ではないことを説明。既存のstatus取得実装と比較。
- 前回のapp-audio / permission / duckingのscopeReadを実際の資料本文・対象段落比較に合わせて修正。全出現箇所の確認済み化はしない。
- 前回保留したUSBコード28/43とMBR2GPT前提条件を限定して追加比較。Steam現行UIとDiscord逆方向アクセラレーション/黒画面の改善効果は引き続き保留。

## ページ別の比較範囲

| ページ | 比較群 | 未比較文書範囲群 | 全文確認 |
|---|---:|---:|---|
| `/discord/bot-add` | 3 | 1 | 未完了 |
| `/discord/bot-not-responding` | 3 | 1 | 未完了 |
| `/discord/bot-remove` | 3 | 1 | 未完了 |
| `/discord/login-error` | 5 | 0 | 未完了 |
| `/discord/phone-verification-error` | 3 | 0 | 未完了 |
| `/discord/echo-double-voice` | 2 | 1 | 未完了 |
| `/discord/slow-performance` | 3 | 1 | 未完了 |
| `/discord/voice-client-outdated` | 2 | 1 | 未完了 |
| `/discord/game-not-detected` | 3 | 0 | 未完了 |
| `/discord/notifications-not-working` | 5 | 1 | 未完了 |
| `/discord/screen-share-black-screen` | 3 | 0 | 未完了 |
| `/discord/recommended-bots` | 5 | 2 | 未完了 |
| `/guide/gpu-driver-update` | 3 | 1 | 未完了 |
| `/guide/pc-game-crash` | 2 | 1 | 未完了 |
| `/guide/pc-game-freezes` | 2 | 1 | 未完了 |
| `/guide/ray-tracing-gpu` | 2 | 1 | 未完了 |
| `/guide/remove-mods-safely` | 2 | 1 | 未完了 |
| `/guide/reshade-uninstall` | 1 | 1 | 未完了 |
| `/guide/shader-cache-delete` | 2 | 1 | 未完了 |
| `/guide/steam-disk-write-error` | 1 | 1 | 未完了 |
| `/guide/steam-game-not-launching` | 2 | 1 | 未完了 |
| `/guide/stutter-fix` | 3 | 1 | 未完了 |
| `/guide/verify-steam-files` | 1 | 1 | 未完了 |
| `/pc/bluetooth-option-missing` | 3 | 1 | 未完了 |
| `/pc/disk-usage-100` | 1 | 1 | 未完了 |
| `/pc/pc-broken` | 1 | 1 | 未完了 |
| `/pc/pc-hacked-signs` | 2 | 1 | 未完了 |
| `/pc/second-monitor-not-detected` | 2 | 1 | 未完了 |
| `/pc/wifi-connected-no-internet` | 2 | 1 | 未完了 |
| `/pc/wifi-option-missing` | 2 | 1 | 未完了 |

## 根拠と限界

`manual-comparisons-30.json`に命題・一次資料URL・本文の位置/比較結果・未比較範囲を記録。`prior-pending-followups.json`は前回保留群の追加照合、`unavailable-sources.json`は取得不能理由。リンクや正規表現のヒットだけを根拠確認には数えない。

Windows/Discord/Steam/各ゲームそのものの設定変更・起動・効果測定は行っていない。これは公式文書の裏付けがある命題を未検証扱いに戻す意味ではなく、別の実機検証軸である。ブラウザ回帰はサイトのUIだけを対象とし、実機の不具合解決を証明しない。

30ページ群への比較着手は完了したが、全文確認済みは0。212ページ全体の監査も未完了。ゲーム固有条件・翻訳全文・補足コンポーネントなど残りの範囲は、前回の全212台帳と本台帳の未比較欄を併用する。旧バッチの件数は当時のスナップショットで、今回の比較群とは母集団が異なるため合算しない。

実ユーザー記録、D1、本番、Bot、認証/CAPTCHA経路には触れていない。PV・解決率・改善実績は算出していない。

## 検証

型・lint・翻訳79・build成功（285 snapshots / sitemap 272 / OG 204）。修正2ルートを375/390/430/1440pxで開閉・キーボード・横幅・JSエラー確認。既存保存/結果/再訪と4言語回帰も成功。戻る/進むテストの初回タイミング失敗と再実行条件は`validation.json`に記録。実ユーザー記録を使わず、APIはfixtureで応答し外部通信を遮断した。
