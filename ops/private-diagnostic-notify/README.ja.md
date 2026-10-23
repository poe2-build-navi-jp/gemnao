# 本人だけの定期通知：未配備候補

すべて初期OFF。実キー、メールアドレス、運用metadataは含まない。Apps Script、API、migrationのコードだけでは通知は開始しない。

## 方式と限界

通知APIは独立したBearerキーのSHA-256 verifierだけを使用し、管理キー/Cookieを流用しない。返すのはversionと不透明cursor（またはnull）だけ。本文・受付ID・件数・時刻は返さない。新規receiptのinsertと同じtransactionのtriggerがsingleton cursorを更新する。再送のINSERT OR IGNOREや削除はcursorを進めない。過去30日を超えたcursorは返さず、既存private cleanupのheartbeat insert/updateと同じtransactionで物理削除する。新cronは不要。0002 migrationは未適用で、0001だけの既存動作は変わらない。

Apps Scriptは本人の非公開standalone projectで実行し、Webアプリとして公開しない。最初の正常読取はbaselineのみ。毎時の新着を1通へまとめ、本文は定型一文だけ。LockServiceと保存前intentで同時実行・通常の重複を防ぐ。送信途中のクラッシュ/例外はPENDING_CURSORを残し、再送を停止する。結果不明時は本人がGmailで確認し、必要ならPENDING_CURSORをLAST_CURSORへ反映してからPENDING_CURSORを削除する。値をチャットへ貼らない。これは欠落も重複も絶対にない保証ではなく、確認まで後続通知が保留される設計。カーソルは診断本文ではなく通知用の比較値で、Gmail/公開ログへ出さない。

MailApp受付成功はGmail到達やChatGPT通知成功ではない。毎時polling、メール配送、Gmailイベント処理に遅延がある。個人Googleアカウントの既知上限は100宛先/日で他スクリプトと共有するため、残枠を都度確認する。1時間に最大1通でも無料枠や配送を保証しない。

## 保存先と失効

- 生の32byteランダムキー（64桁hex）：本人だけが編集できるApps Scriptの「プロジェクトの設定→スクリプト プロパティ」の `NOTIFY_READ_TOKEN`。公開コード、URL、ログ、メール、チャットに置かない。Script Propertiesは専用の秘密保管サービスではなくproject利用者/編集者に対するアクセス境界なので、projectを共有しない。
- SHA-256 verifier（64桁hex）：承認した実行先Workerの暗号化secret `PRIVATE_DIAGNOSTIC_NOTIFY_TOKEN_SHA256`。管理キーと別。公開wrangler varsへ書かない。実行先と設定操作は別途特定して承認する。
- クライアント停止：Script Property `NOTIFY_ENABLED` を `false`。サーバー停止：`PRIVATE_DIAGNOSTIC_NOTIFY_ENABLED` を `false`。credential失効はサーバーverifier削除/変更。Google権限の取消とトリガー削除も別途可能。

## 本人のブラウザ操作（設定承認後）

1. Google Apps Scriptのホームで本人アカウントの新しいstandalone projectを作り、共有しない。Google OAuthは本人が操作する。CLIは不要。iOS Safariでeditorが正常に使えることは未検証で、モバイル非対応/表示不良なら無理に権限操作を進めない。
2. `Code.js`をコピーし、非公開のコピー内だけでsynthetic ENDPOINTとOWNER_EMAILを、承認済みの正確な取得先と正規connectorで確認した本人Gmailへ置換する。受信者が未確認なら送信しない。
3. editor設定でmanifestを表示し`appsscript.json`をコピーする。要求scopeはsend_mailとexternal_requestだけ。受信箱読取やGmail全権限、trigger管理scopeを追加しない。
4. 承認された安全な本人側手順でキーを生成・設定する。現候補はキー生成しない。NOTIFY_ENABLEDはfalseのまま。verifierも承認済みWorkerへ設定するまで受付/APIを有効化しない。
5. QAの追加migration、コード配備、既存アクセスゲートを維持した接続方法をレビューし承認する。既存QAゲートを通知キーで迂回しない。Apps Scriptへ管理キーをコピーしない。
6. メールなしbaseline読取を先に実証し、合成新着1件と本人宛て試験メールを許可してからONにする。Google承認画面に想定外のscopeが出たら停止。トリガー画面から対象関数checkPrivateDiagnostic、時間主導型、1時間おきを本人が設定する。
7. 本人Gmailに実際に届いた送信元を確認し、既存Gmailイベント接続でこの会話への通知を設定する。本人宛ての自己送信メールがイベント対象になることも実測する。署名/秘密/本文をfilterやタスク本文へ入れない。再送・結果不明・停止・失効を合成テスト後に本番運用を別途判断する。

公式資料: https://developers.google.com/apps-script/reference/mail/mail-app 、 https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app 、 https://developers.google.com/apps-script/guides/triggers/installable 、 https://developers.google.com/apps-script/guides/properties
