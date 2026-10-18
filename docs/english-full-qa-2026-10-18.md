# 英語版全体QA台帳 — 2026-10-18

状態: **未実施・未完了**。英語版の未対応追加後、スペイン語版へ進む前に全体監査・修正・再テスト・通常公開を行う（ユーザー明示依頼、親スレッド経由）。個別バッチの合格を全体合格としない。

対象一覧は `english-localization-backlog-2026-10-18.csv` の基準と、その後の追加差分から再生成する。sitemap外の操作画面、実在する英語のみのURLも含め、管理者専用画面と公開UIを区別する。

| 確認項目 | 状態 | 証拠・結果の記録先 |
|---|---|---|
| 全英語登録URLの応答、404、意図したnoindex | 未実施 | URL別結果にする |
| 自己canonical、実在翻訳の双方向hreflang、sitemap | 未実施 | URL別結果にする |
| 内部リンク、アンカー、画像、CSS/JS | 未実施 | 壊れた参照と修正commitを記録 |
| 翻訳漏れ、綴り、自然な英語、UI用語 | 未実施 | 記事本文と操作UIの両方を校正 |
| 375/390/430pxとPCでの文字切れ・横スクロール・画像 | 未実施 | route/viewport別証拠 |
| メニュー、検索、言語切替、一覧、戻る・進む | 未実施 | 閲覧操作の遷移と実在URL |
| 診断、保存、回答: 連打・遅延・失敗・再試行・キャンセル | 未実施 | ローカルまたは既存QAで実施 |
| 外部リンクの到達性・適切な言語・資料内容 | 未実施 | 拒否・ログイン必須・未検証は保留 |
| 修正後の再テストと同一SHAの配備成功 | 未実施 | commit/Pages deployment |
| 公開HTML/CSS/JS・安全な閲覧導線 | 未実施 | 親ブラウザ担当の確認結果 |

実ユーザーの個人データは使用しない。本番投票、合成GA送信、GSC送信は行わない。書き込み機能はローカル／既存QAで検証する。実行環境から公開PagesはCONNECT 403で到達できないため、ブラウザ確認URLをまとまった単位で親へ渡す。拒否されたアクセスを合格にしない。

追加の課金・認証・権限・データ削除・セキュリティ変更はこのQA承認に含めない。全体QAの完了・保留を報告してからスペイン語版へ移る。

## 追加中に見つかった導線の未対応

- `components/save-article.tsx` の英語「Saved articles (Japanese page)」は `/my#my-reading-list` へ遷移する。`/en/my-games` はゲーム登録・保存した解決策の画面で、記事のreading listとは別のため単純なリンク差し替えはしない。`/my` の英語UI対応時にreading listの保存・削除・再表示・ストレージ拒否を含めて解消する。現時点は日本語行きの表示があり、英語内で完結したとは扱わない。

## 外部資料の到達確認待ち

- https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767 — 本文取得ツールは1行のみ、実行環境の直接取得はCONNECT403。到達性・本文確認は未検証。低GPU使用率の記事はゲーム内FPS表示で手順を実施可能とし、未確認のSteam画面名や機能詳細を追加していない。元日本語版の補助出典は保持し、親ブラウザで確認する。

Steam補助資料の位置づけ: パフォーマンスモニターの任意の参照であり、記事の必須手順の根拠ではない。FPSはゲーム内表示で比較できる。GPU番号・3D負荷・専用/共有メモリはMicrosoft DirectXのTask Manager資料、CPU/GPU制約はMicrosoft DirectXのCPU/GPU-boundedness資料、GPU選択はMicrosoft WindowsのGraphics preference資料で独立に確認済み。Steam固有UI・監視機能詳細は未検証として追加していない。

親ブラウザからの確認受領: no-game-audio / steam-input-controller / controller-double-input / directx-error / visual-c-runtime-error の英語5記事について、内容・表示・主要リンク・FAQを確認済み（親スレッド報告）。全英語版の全体合格とはしない。

## メンテナンス4記事の個別検証

MOD解除、アンインストールとセーブ、シェーダーキャッシュ、Steamディスク書き込みエラーを追加。全体QA完了とは扱わない。Steamの中核資料は親の公式検索本文確認で保留解除し、対象不明時は中止・権限修復に限定。英語版98/231、共通21/28。公開画面は親ブラウザ確認待ち。詳細は english-maintenance-review-2026-10-18.md。

## 電源断・停止コード・ReShadeの個別検証

3記事追加と既存フリーズ/MOD記事の関連記事を実在英語版へ更新。全体QAは引き続き未完了。詳細は english-system-review-2026-10-18.md。

## 共通残り4件（要件・設定ファイル）

共通28/28、英語105/231、未対応126。詳細はenglish-requirements-review-2026-10-18.md。localized237、全体型/build、英語36記事1674内部リンク、4画面幅20組・検索16件と準備チェック/パスコピー成功失敗を検査。コピー色を目視修正。公開ブラウザ・英語全体UI/操作/言語QAは引き続き未完了。次はDiscord34件。

## Discord起動・更新4件

not-opening / loading-stuck / update-failed / installation-failed追加。Discord8/38、英語109/231、未対応122。localized241、対象lint、隔離型/build、489静的HTML・468 sitemap・408OG、英語40記事1859内部リンク。4幅20組・検索16件・モバイル導線・未翻訳10ルート404成功。JS/CSS失敗と本番書き込み0。詳細english-discord-launch-review-2026-10-18.md。公開確認と全体英語QAは残る。

## Discord音声5件

cant-hear-voice / audio-input-not-found / error-1001 / error-1002 / error-1003。Discord13/38、英語114/231、残117。localized246、型/build/lint、45記事2089内部リンク、494静的HTML・473 sitemap・413OG成功。4幅24組・検索20件・未翻訳12ルート404、API書込み0。reset-config-fileの位置案内を親指摘どおり方向語なしへ変更。親の共通28一覧+11記事確認はdesktop全文/一部リンクFAQの範囲で、全体QA完了とはしない。詳細english-discord-audio-review-2026-10-18.md。

## Discord Bluetooth・Bot4件

bluetooth-audio-problem / bot-add / bot-not-responding / bot-remove追加。Discord17/38・残21、英語118/231・残113、registry/sitemap不一致0。localized250、全体型/buildと対象lint、49記事2261内部リンク、4幅20組・検索16件成功。API書込み0。詳細english-discord-bots-review-2026-10-18.md。英語全体QAと親担当の本番画面確認は残る。次は台帳順call-disconnects以降。

## Discord通話切断・カメラ・終了3件

Discord20/38、英語121/231・残110。localized253、全体型/build・対象lint、501静的HTML・480 sitemap・420OG、52記事2407内部リンク/アンカー。4幅16組・検索12件・未翻訳8ルート404成功。JS/CSS失敗・API書込み0。OG3枚と375px画面目視済み。詳細english-discord-connection-review-2026-10-18.md。親本番ブラウザ確認と英語全体QAは未完了。

## Discord反響・ゲーム検出・音量低下3件

Discord23/38・残15、英語124/231・残107。localized256、型/lint/build、55記事2539内部リンク、4幅16組・検索12件成功。OG3枚の省略と改行を修正して再生成。詳細english-discord-echo-review-2026-10-18.md。親は先行17記事とreset-config位置案内修正まで確認済み。英語全体QAは未完了。

## Discordログイン・マイク音量・No Route3件

Discord26/38・残12、英語127/231・残104。registry/sitemap不一致0。localized259、型/lint/build、58記事2683内部リンク、4幅16組・検索12件成功。マイク音声方向図も英語化しリンク/4幅/375px目視確認。詳細english-discord-login-review-2026-10-18.md。英語全体QAと今回の本番ブラウザ確認は未完了。

## Discord通知・オーバーレイ・電話認証3件

Discord29/38・残9、英語130/231・残101。registry/sitemap不一致0。localized262、型/lint/build、510静的HTML・489 sitemap・429OG、61記事2815内部リンク、4幅16組・検索12件成功。OG3目視/修正済み、API書込み0。詳細english-discord-notifications-review-2026-10-18.md。前コミット35cfe12とab44b66のPages成功確認済み。英語全体QAと今回の本番ブラウザ確認は未完了。
