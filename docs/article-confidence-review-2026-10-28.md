# 対象条件・入口・保存記事・報告改善（2026-10-28）

## 範囲と根拠

base `gemunao` / `75a1d0b` から独立ブランチ。別ブランチのsitemap/publication-discovery作業は取り込まない。
対象は日英の既存4記事（8URL）。PVは選定の参考のみで公開表示しない。

- `/games/ace-combat-8/error-st-3100001`：日英で読まれる正確なエラーコード。`lib/error-code-articles.ts` の公式説明・時刻同期案内が根拠。実機再現・版番号は未確認。
- `/games/call-of-duty-modern-warfare-4/tpm-secure-boot`：`lib/cod-mw4-articles.ts` の公式製品版要件。Windows要件と実機検証環境は区別。
- `/games/aniimo/not-launching`：Aniimoの入口として起動失敗を選定（提示PVはAniimo単位で記事別とは扱わない）。`lib/aniimo-articles.ts` のランチャー／Steamの区別と公式FAQ・告知記録。新たなバージョンは補完しない。
- `/games/monster-hunter-wilds/not-launching`：`lib/reported-cases.ts` と `lib/monster-hunter-articles.ts` の本人報告と照合。i5-14400F / RTX4060Ti、体験版動作、製品版起動直後クラッシュ、追加DLL切り離し後の起動を確認したとの本人申告。診断0.1.0 / C0000005は今回の本人からの追加条件。既存公開記録にはないため独立検証としない。OS/ゲームの版番号は未確認。既存実例 `/examples/wilds-steam-added-dll` へリンク。

既存記録を整理した変更であり、公式情報の再検証日を更新しない。記事のSTEP id、URL、言語index方針、広告/認証/ルーティングは変更しない。

## 入口のAI監査

現行コードでは記事の症状ナビ・結論・Windows用ツールの対象制限が既にある。トップのWindows用ツールにもブラウザ問診との違いが記載済み。一方 `DiagnosisCta` は「無料診断」だけで実行方式が不明瞭で、Windowsダウンロード入口との違いがその場で判断しにくい。ブラウザ問診、ダウンロード不要、PCログの自動検査ではないことを明示。受付可否の既存API gateは維持。対象外のTPMやオンライン通信へWindowsアプリの導線を追加しない。

これはAIによる実装・操作監査で、人間の初見ユーザーテストではない。人間テストは未完了。

人間テスト（5〜10分、PCとスマホで各1名が目安）：
1. 対象記事から開始し、自分のWindows/ゲーム版と一致するか、未確認は何かを説明してもらう。
2. 「エラーコードは分かる」「原因が分からない」「Windowsの記録を調べたい」の3場面で、記事／ブラウザ問診／Windowsツールを選んでもらう。誘導せず、迷ったラベルを記録。
3. スマホではWindowsツールをその場で実行できないと判断できるか確認。
4. 保存→マイページ→記事を再開。表示された重要変更の対象・未確認範囲を説明してもらう。
5. 迷い・誤操作が実際にあった箇所のみ次の修正候補にする。必要入力：参加者・対象PC/スマホ・観察結果（個人情報不要）。

## 保存記事の重要変更

既存 `officialGameChanges` は公式出典・対象条件・安定したrevision IDを持ち、`MyGameChanges` は既読操作を持つが、マイゲーム単位のみで「あとで読む」と接続されていなかった。既存registryとUIを再利用して保存記事の完全一致パスに限定（言語prefixを正規化）。記事の更新日から変更を推定しない。

既存localStorageは変更せず別キーで既読状態を保持。初回は既存registry全件を既読で登録、以後新しい確認済みrevisionが未読になる。初回時点の記録は履歴として参照可能。解除・再追加は既読状態を維持。変更の記録がない場合も「更新がない」と断定しない。ゲーム保存・診断・ノート・記事保存の形式は変更しない。

## 未解決報告→記事改善の運用（準備／実データは未完了）

既存の匿名投票 `issue_feedback` / `solution_method_feedback` と、条件・STEP idのある審査報告 `community-reports` は別経路。投票合計から機器条件や原因を推測しない。`/admin/reports` は既存ログイン・ページング・審査・重複・撤回管理を備える。新しいフォーム/集計/公開データAPIは追加しない。

編集者の実行手順：
1. 既存管理ログインで `/admin/reports` の一覧を読む。拒否・取得失敗は0件としない。設定や新しい鍵は作らない。
2. 審査済みの未解決報告から記事パス、STEP id、OS/ゲーム版、症状、試した手順と結果を照合。個人情報や生ログは作業文書/公開PRに転記しない。同じ報告や同じ環境を別の独立再現として数えない。
3. 公式出典で確認可能な不足手順を特定し、個票を引用せず記事を改善。本人の報告文の転載は既存の同意では認められておらず、`service.ts` の引用無効化を維持。本人報告を公開利用する必要がある場合は別途同意条件の確認が必要。
4. 記事とSTEP idを保ったまま対象条件・中止条件・確認結果を編集。読者に重要な変更だけ `officialGameChanges` のようなレビュー済み記録へ出典/対象/限界付きで登録する。単なる編集日は重要変更としない。現registryは公式変更用なので、非公式の改善を公式修正として登録しない。
5. 既存の撤回管理と公開プレビューを使い、秘密・未審査投稿・生ログを含まないことを確認後に別途公開承認を受ける。

今回、現環境から本番の管理APIはHTTP応答を取得できず（curl status 000）、webツールもアクセス不可。認証済みセッションや新たなトークンは作成せず、D1の読取/書換えや受付設定変更は行っていない。実報告に基づく記事改善・件数・効果の評価は未完了。必要入力：運営者が既存の正規ログインで読める審査済み報告から、匿名化した対象記事/STEP/条件/結果/根拠の共有。取得不可の原因は未確定で、権限拒否や0件と断定しない。

## 実装・検証結果

- 管理画面に日英中西の編集手順を追加（折りたたみ）。既存審査操作・API・認証・D1は変更なし。
- `pnpm review:index`：171記事・105contextを再生成。`lib/article-review-index.ts` はbaseと同一（本文データ/STEPの変更なしのため差分なし）。最新の生成結果を確認済み。
- `pnpm typecheck`、`pnpm lint`、`pnpm build`：成功。ビルド646 HTML snapshots、sitemap495 URLs、OG573。
- `node scripts/check-locale-indexing.mjs`：成功（zh/es noindex、ja/en維持）。ビルド中に並列実行した1回は生成途中のsitemapを読んで失敗したため、ビルド完了後に再実行して成功。
- `node scripts/check-static-search-assets.mjs`：成功。
- `node scripts/run-my-game-changes-check.mjs`：既存診断保存と重要変更の回帰、および保存記事の初期化/完全一致/既読/未読/再訪/更新なし/解除再追加/他キー保護/未来schema保護が成功。
- `node scripts/check-article-diagnosis.mjs`：4言語の既存Windows導線と対象外症状の除外を維持。
- `TEST_BASE_URL=http://localhost:8795 node scripts/check-article-confidence-browser.mjs`：Chromium、390/1440px、日英4記事の冒頭表示、保存記事の初回既読・未読切替・再訪・解除再追加・再既読、既存マイゲーム/診断キー保持が成功。横はみ出し・pageerrorなし。ローカル環境・模擬APIのみ。
- `node scripts/check-report-queue-feedback.mjs`：日英中西、読込/空/模擬行、HTTP失敗/不正JSON/通信/タイムアウト/連打/ページングを成功。実報告ではない。
- 画面証跡：`docs/validation/article-confidence-2026-10-28/`。スマホのワイルズとPCの英語ACE8を目視確認。

未完了：人間の初見テスト、実報告に基づく記事改善、本番公開（今回は承認範囲外）。重要変更表示は既存の確認済み公式変更に対応。非公式の「新しい解決策追加」は、記録が未登録なだけでなく、イベント種別・登録と表示の仕組み自体が未実装です。現在の実装は確認済み公式変更のみを対象とし、両者を同じ完了項目として扱いません。非公式の解決策追加に対応するには、実際の根拠を確認したうえで公式修正と区別したイベント設計・表示・検査が必要です。

追加：`TEST_BASE_URL=http://localhost:8796 CHROMIUM_PATH=/usr/bin/chromium node scripts/check-home-cls-browser.mjs` は本番ビルドのローカルpreviewで成功。受付状態・フォーカス・レイアウト25ケース、JavaScriptなし5幅を確認。既存gateを保ち、ラベル変更に合わせた期待文言のみ更新（検査条件の弱体化なし）。


## 独立レビュー後の追加回帰検証

`node scripts/check-saved-article-revisions-browser.mjs` を追加。実際の `SavedArticleChanges` と既存のフィルタ・初回登録・既読保存・カードUIをローカルChromiumで実行します。テストbundle内だけの合成registryを使用し、本番registryファイルは変更しません。

日英それぞれで、旧revisionだけの初回表示が既読→新revisionを加えたページへの再訪で実際のカードが未読→reloadでも未読→既読ボタン操作→reload後も既読、まで成功。2つのrevisionは同じ日付にして、日付変更ではなくrevision IDによる判定を検証しました。外部リクエスト・APIアクセス・pageerrorなし。従来の「将来IDが集合にない」検査だけに依存しません。

追加分は検査と文書のみ。`node scripts/run-my-game-changes-check.mjs`、`pnpm lint`、`pnpm typecheck` を再実行して成功。製品コードは前回のビルド成功時から変更していないため、本番ビルドは再実行していません。draft PR作成は承認待ちのままで実行していません。
