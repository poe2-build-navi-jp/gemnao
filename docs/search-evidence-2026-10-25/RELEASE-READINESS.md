# PR145 第一弾の公開判断

対象: PR145、基準 `a03f37a2eb4e06a222cda0d2bb581e5e817870c1`。第一弾はrobots方針と日本語4記事の整理。全191記事の根拠整備完了とはしない。本番mergeなし。

## 1. 正確な記事URLと既存の対応言語

翻訳判定は実データの `hasTranslation` とsitemap/既存ルートに基づく。今回の本文変更は日本語のみ。英語等の内容が今回の新しい根拠欄と同等になったとは扱わない。zh/esは公開ルートがあっても現在noindexであり、検索対象言語と混同しない。

| 変更記事（日本語） | 既存の対応言語・URL |
|---|---|
| https://gemnao.pages.dev/games/monster-hunter-wilds/not-launching | 英語: https://gemnao.pages.dev/en/games/monster-hunter-wilds/not-launching 。zh/esなし。 |
| https://gemnao.pages.dev/guide/steam-game-not-launching | 英語: https://gemnao.pages.dev/en/guide/steam-game-not-launching ／簡体字: https://gemnao.pages.dev/zh/guide/steam-game-not-launching ／スペイン語: https://gemnao.pages.dev/es/guide/steam-game-not-launching |
| https://gemnao.pages.dev/guide/verify-steam-files | 英語: https://gemnao.pages.dev/en/guide/verify-steam-files ／簡体字: https://gemnao.pages.dev/zh/guide/verify-steam-files ／スペイン語: https://gemnao.pages.dev/es/guide/verify-steam-files |
| https://gemnao.pages.dev/guide/directx-error | 英語: https://gemnao.pages.dev/en/guide/directx-error 。zh/esなし。 |

## 2. Steam本文未再確認の影響

取得拒否を回避する追加アクセスはしない。前回取得した検索抜粋だけを本文再確認済みと扱わない。

| 今回の記述 | 基準コードに存在する根拠 | 判断 |
|---|---|---|
| 整合性のメニュー操作 | `lib/verify-steam-guide.ts` の結論/手順、`components/verify-steam-details.tsx` の既存操作説明、既存Steam公式FAQリンク | 既存操作を短く再掲。最新UIで操作したという主張は追加しない。記事確認日2026-09-27を保持。現行UIの再確認は残件。 |
| 起動ボタン・停止履歴・整合性/保護履歴を分ける | `lib/steam-launch-guide.ts` の既存4手順と `components/steam-launch-details.tsx` の状態別分岐 | 編集上の順序整理で、新しい公式修正手順・成功実績ではない。確認日2026-10-21を保持。 |
| 再取得の有無と改善を別に記録 | 既存verify手順の再取得あり/なし/繰り返し分岐、既存Wilds実例の「再取得なし」 | 比較記録の方法。再取得だけで原因/成功を断定しない。新しい修復率や測定値なし。 |
| セーブ復旧・MOD互換性・機器故障との関係 | 既存verify-detailsの照合対象/対象外の判断、既存バックアップ注意 | 機能全般を断定する新文言を弱め、「この記事の手順ではセーブ復旧・互換性保証・故障診断を対象にしない」という記事範囲の宣言に修正。 |
| 公式FAQのWindows/ドライバー/整合性等 | 基準記事のsources/本文、取得できたSteam公式検索抜粋 | 公式確認先の説明に限定。最新本文・全手順・現行画面の再確認を主張しない。 |
| Wildsの起動改善 | 基準 `lib/reported-cases.ts` の本人報告のみ | Steam公式が改善を検証したとの主張なし。本人報告1件、独立再現なし、版・日時不明を維持。 |

このPRに「Steamで現在必ず直る」「現行画面を実機確認した」という新規断定はない。未再確認を明示した既存説明の整理として第一弾の公開候補にできる。Steam最新手順を再確認した記事としては公開しない。Capcom/Microsoftの今回照合部分も、資料確認と実機結果を区別する。

## 3. Discord既存テストの因果

変更前commitを独立したdetached worktreeへ展開し、同じNode・依存ライブラリで `node scripts/run-evidence-articles-check.mjs` を実行。

- 変更前 `a03f37a`: exit 1。
- PR初稿 `7439f8b`: exit 1。
- 両方とも `assert.deepEqual(discordParams(), locales.map(... upload-failed ...))` で停止。
- 期待値はupload-failedのen/zh/esの3件。実際値にはmic-not-working等の既存英語ルートが含まれる。
- バンドル生成による行番号・列番号だけを正規化すると、失敗ログ全体（actual/expected配列を含む）が一致。
- テスト、Discordルート、翻訳集合は基準との差分なし。このPRが作った失敗ではない。

合格したとは扱わず、広範囲テストは途中で止まる制限を残す。今回のローカル実ブラウザ検査は別に4記事・既存根拠欄・robotsを確認したもの。一般CIの成功を代用しない。

## 4. 残186記事の構造別棚卸し

`article-inventory.json` に全191記事の対応言語・操作数・実際に使われる出典URL（ゲーム共通出典含む）・対象範囲・既存のevidenceSummaryを保存。`structure-review.json` は全191件の生成HTMLから候補文を抽出し、説明の適用範囲を人手で分類したもの。キーワードがあるだけで検証済みにはしない。

残186件すべてに結論・操作手順・出典がある。ゲーム103、共通25、Discord38、Windows20。対象範囲の専用データは123件、未定義は63件（ゲーム38＋共通25）。専用データがないことは本文に対象記述がないという断定ではない。既存の対象記述も、実機で確認した対象版の証明ではない。

| 残186件の状態 | 件数 | 既にあるもの／不足 |
|---|---:|---|
| 記事単位の限界説明あり | 50 | 結論・操作・出典に加え「実機結果ではない」「実機効果は未確認」等が本文にある。Windows20件は共通テンプレートにも区別があり、6件には固有evidenceSummaryもある。対象版の記録・出典の現在性・本人報告の原記録までは今回監査していない。 |
| 一部の例・報告・商品紹介だけ限界説明あり | 17 | 数値例が仮例であること、報告から原因を断定できないこと等を明記。その一文を記事全体の検証状況に拡大できない。残る主張・手順の根拠対応が不足。 |
| 基本構造あり、根拠区分の個別監査が必要 | 119 | 結論・操作・出典はあるが、まとまった結果/未検証範囲の説明を今回認定できない。不存在や未検証の断定ではなく、本文と元記録を照合すべき対象。 |

今回4件＋既存Rocket League1件は別の5件として記録。残186件のうちどれかを実機検証済みと新たにラベル付けしてはいない。共通テンプレートへの追加は、根拠レコードがある4件への目次リンクだけ。既存Windowsの固有根拠欄を再生成したり、空欄を同一文で埋めたりしない。

### 次に整えるまとまり

1. **起動・クラッシュ共通の5件**: `/guide/pc-game-crash`、`/guide/pc-game-freezes`、`/guide/black-screen`、`/guide/gpu-driver-update`、`/guide/steam-disk-write-error`。既存の比較例と実例の引用範囲を分け、公式説明との対応を記事別に整える。既存Wilds報告を別の新規成功例として数えない。
2. **負荷・性能の5件**: `/guide/low-gpu-usage`、`/guide/low-fps`、`/guide/stutter-fix`、`/guide/vram-shortage`、`/games/aniimo/video-memory-error`。既存の仮の数値例を維持し、対象の機器/版・測定条件の書式と、実際の測定記録の有無を分ける。
3. **ゲーム別の対象範囲フィールドなし38件**: JSONの`family=games`かつ`declaredScope=null`で全件抽出できる。症状記事を先に扱い、セーブ場所・MOD・機能解説にはそれぞれの型を使う。版番号は出典がある時だけ追加し、ないものを推測しない。
4. **Discord残記事**: PC/モバイル・アカウント・通話条件の区別と公式根拠を整理。既存の音量やエラー比較例を実測扱いしない。

## 公開判断の範囲

第一弾の変更内容は、既存情報の整理と限定された公式資料照合として公開候補。全体完了・全手順の最新性・全言語の同等整備・実機での改善を保証する内容ではない。公開robots取得403と実OAI-SearchBot到達性は、この環境から確認できていないまま。Cloudflare等の設定変更を伴わず、公開後の本文/到達性確認は別の検査事項とする。既存テスト失敗は上記の再現根拠付きで残す。本番反映は親による具体差分の確認後で、この作業ではmergeしない。

### 追補後の検査結果

- 再build成功: HTML646、sitemap495、OG573。型検査・全体lint・翻訳整合355ページ成功。
- 設定/根拠/構造検査成功: 191生成HTML、50/17/119分類、4記事の対応言語を照合。日本語を含む実在12言語ルートの生成HTMLを確認。
- Chromium再実行成功: 375/390/430/1440px×4記事=16ケース＋対照5ページ。4記事の目次リンクが各1件あること、根拠欄の順序、canonical/OG、横はみ出しなし、対象ケースのJS例外・資産失敗・書込み試行0。
- 変更前/初稿のDiscord既存テストは前述の同一失敗。回避・無効化・無関係な期待値変更はしていない。
- 今回は公式ページの再取得を試しておらず、先の403・本文抽出不可を迂回していない。
