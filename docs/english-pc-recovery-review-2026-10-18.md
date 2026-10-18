# 英語PC一覧・更新後音声・Bluetooth消失

/en/pc、/en/pc/audio-after-update、/en/pc/bluetooth-option-missing追加。英語PC6/20・残14、英語全体144/231・残87（配備前は実装数）。英語のみ一覧登録、ヘッダー/モバイル/フッター/ホーム検索/パンくずとschemaを実在/en/pcへ接続。日本語/pcと双方向hreflang。中国語/スペイン語一覧は作らない。

更新後音声は5STEP、Bluetooth消失は6STEPと結果表を保持。原文の診断行/操作数/FAQ/出典順/復元条件を照合。Microsoft公式音声更新・出力消失・Device Manager codes・update uninstall・same-version reinstall本文を確認。更新削除は特定KBとセキュリティ影響、まず同版修復の案内、管理PCや古い版で回復項目がない条件を記載。services操作は通話/録音中断と管理制限に注意し、不要なサービス停止は追加しない。

Microsoft公式Bluetooth disappeared/problems/drivers/pairing/not-connecting/disconnectingおよびLearn hidden-devices本文を確認。Shift+通常Shutdownで1分待つ手順を強制電源断と区別。code22/45とhidden表示の限界を保持。再導入前に適合driver・非Bluetooth入力・接続手段を確保、対象adapter限定、driverpackage削除しない。UEFI/BIOSを通常driverと混同せず、未対応設定を強制しない。

親ブラウザで先行PC3記事の本文・desktop表示・アンカー正常との報告を受領。指摘に従いbluetooth-connected-no-soundの通話開始時だけの症状は、Step3冒頭で再接続/登録削除を行う前に/en/pc/call-starts-audio-disappears#step-3へ直接案内。

検証：localized276、型/lint/build成功。初回は日本語専用footerの不要locale分岐を型検査で検出して修正。最初のbuildはexit137、過去の隔離previewサーバー12件を停止後の再build成功。524静的HTML・503sitemap・443OG、74記事3396内部リンク/アンカー成功。OG3枚と375px一覧/結果表目視済み。英語全体QAと本番ブラウザ確認は未完了。実API書込みなし、collector関連3ファイル保持。

## Dyno：親ブラウザで本文確認が必要

- https://docs.dyno.gg/en/modules/automod — Create Ruleから禁止語完全一致設定への操作、Banned Words (exact)の現行表記、Warnの動作と自動削除/メッセージ削除との関係、管理者・免除role/channelの扱い、対象actionの必要権限。
- https://docs.dyno.gg/en/premium — Automodの無料/Premium区分・ルールや対象語の上限、管理画面でPremium対象と区別する方法。料金や上限を推測しない。

こちらのWeb抽出はCopied to clipboard!のみ、直接取得はCONNECT403。検索断片を全文確認とせずrecommended-bots1件は保留。本人のBot導入や権限変更を依頼するものではなく、公式説明本文の確認だけが必要。

終了条件：ユーザー最新指示により英語追加・全体QA・修正・公開確認後に一旦終了。他言語へ進まない。既存他言語公開物/保全下書きは維持。

画面検証初回は1440pxで通常headerが表示されるというテスト側の仮定が誤り、クリック待機失敗。既存CSSは1480px以下で折り畳みメニュー。表示状態で分岐するよう修正し、1920px通常headerを追加検証。

画面検証2回目は直接リンクのURL変更直後に対象STEPの描画を待たずisVisibleを判定して失敗。対象STEPのvisible待機へ変更して再実行。製品コードの未確認動作を合格とは扱わない。

最終再検証：PC6/20・残14、英語144/231・残87。英語PC一覧も追加。localized276、型/lint/build、524静的HTML・503sitemap・443OG、74記事3396内部リンク/アンカー成功。4幅28組、1920px通常header、検索クリック/戻る12件、6カード、未翻訳6ルート404成功。通話開始時のみのBluetooth音質問題を別マイク比較へ直接案内し、4幅でリンク位置/遷移先STEP表示確認。JS/CSS失敗0・API書込み0。英語全体QAと本番ブラウザ確認は未完了。
