# STEP回答案内と計測

回答ボタンの近くに「直らなかった結果も、次の人の役に立ちます」を4言語で表示。未解決を選んだ後は次STEP、最終STEP・症状の終点では記事内の公式情報／サポート案内へ進める。送信失敗は案内を妨げない。日本語の前提確認・症状終点を維持し、翻訳にも元記事の終点と明示nextStepIdを引き継ぐ。実在しない言語別診断URLは作らない。

## GAイベント

既存の本番origin・除外ページ・gtag有無・同意設定に従う。GA管理画面、キー、同意設定は変更しない。

- `step_result_controls_viewed`: 受付可能な回答欄がviewportに25%以上入った時。同一document内の公開記事path＋STEPにつき1回。再描画・再mountでは増やさない。再訪・再読込は別表示。
- `step_result_saved`: 既存イベントに`step_id`を追加。POSTの成功確認後のみ。ローカル既送信・同時二重クリックでは増やさない。
- `step_result_failed`: 実際のPOST試行の失敗のみ。固定分類`network` / `rate_limited` / `rejected` / `unavailable` / `invalid_response`。GET失敗、未送信のローカル重複・再送不可判定は含めない。
- 共通: 公開記事pathnameのみの`page_location`、公開`step_id`、固定`page_title`、空`page_referrer`。保存・失敗には`outcome`。クエリ、fragment、自由文、個人情報、request ID、エラー本文は含めない。

GAはブラウザの観測値であり、D1の受付件数とは一致を保証しない。広告ブロッカー・同意状態・通信断で欠落し、失敗後の再送で保存と失敗の両方が観測される場合がある。D1の人数・解決率として扱わない。

## 評価対象

引継ぎで確認済みの10月11–17日の入口件数は英語ST記事107、日本語ST記事49。以下のURLは記事ソースと翻訳レジストリに存在する。

1. `/en/games/ace-combat-8/error-st-3100001`
2. `/games/ace-combat-8/error-st-3100001`
3. 候補のみ: `/games/ace-combat-8/connection-after-time-sync`。3位のGA実績は未確認で、上位3記事と断定しない。

公開後に同じ期間幅で記事・STEP・言語ごとの表示／保存／失敗イベントを比較する。保存÷表示は参考指標であり、ユニーク回答者の回答率ではない。既送信者、複数結果、再読込の影響がある。導入前には表示イベントがないため、この変更だけで改善効果を判定できない。今後の実測が必要。カスタムディメンション登録等のGA管理変更は実施していない。

## ローカル検証

- 既存transport/UIテスト: 送信失敗、同じtokenで再送、二重送信防止、保存済みノートからの独立性。
- 翻訳テスト: 120記事＋英語crash guideのSTEP ID整合、3言語の次STEP／終点／明示分岐、失敗時の導線。
- `check-public-outcome-counts.mjs`: JA/EN/ZH/ES、375/390/430/1440px、ゼロ・少数・GET失敗。APIは合成GETのみ。
- `check-step-result-engagement.mjs`: EN/ZH/ES、390/1440px、実viewport表示・再描画重複防止、保存STEP ID、失敗分類、再送、次／最終リンク、無効時・非公開path・不正ID抑止。ブラウザ通信を全件interceptし、GAもメモリ内mock。本番投票・本番GA送信なし。
- 安全なSTEP移動・14記事36症状終点・190翻訳ページの既存検査。

既存のcommunity-reports collector作業3ファイルは今回の公開に含めない。D1・受付フラグ・cron・credential・権限を変更しない。
