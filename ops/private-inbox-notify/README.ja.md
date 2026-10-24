# 問い合わせフォーム・Discord掲載依頼の通知（接続未設定）

コード配備と通知稼働は別です。D1フォームのみが対象。公開連絡先への直接メールは別メールボックスです。実キー・本人メールアドレスはこのリポジトリに保存しません。

## 親担当へ：必要な本人ブラウザ操作

設定直前の対象確認後に実施。非公開standalone Apps Scriptの新規プロジェクト名は `Gemnao Form Inbox Notify (Private)` を提案します（未作成）。既存Windows診断プロジェクトを変更しません。Webアプリとして公開せず、他者と共有しません。Google Apps Scriptの正規エディタで、このフォルダーのCode.jsとappsscript.jsonを取り込みます。iOSでのエディタ動作は未検証です。

1. 対象は既存Cloudflare Pagesプロジェクト `gemnao` のproduction環境。`INBOX_NOTIFY_READ_TOKEN_HASH_V2` は暗号化secret、`INBOX_NOTIFY_ENABLED` は最初false。既存DB binding・管理認証は変更不要です。
2. 同じ承認済み32byteランダム専用キーの生値を、本人だけのApps Script Script Properties `NOTIFY_READ_TOKEN` へ。そのSHA-256だけをCloudflare側secretへ。専用キーは管理キーと別。生成・移送は承認済みの本人側安全な方法を使い、チャット・ツール出力・ログ・URL・GitHubへ貼りません。現候補は実キー生成を行いません。Script Propertiesは編集者が読めるため共有禁止です。
3. Script Propertiesの `OWNER_EMAIL` に、本人が承認し接続済みGmailで確認した正確な中継宛先を固定入力。`RECIPIENT_VERIFIED=true`、`NOTIFY_ENABLED=false`。フォーム投稿者のメールを宛先に使いません。
4. Google OAuthは本人が承認。manifestの権限は `script.send_mail` と `script.external_request` の2つ。受信箱の読取・Gmail全権限・トリガー管理scopeは要求しません。ただしGoogleのメール送信権限自体は宛先限定でなく、固定宛先はコードで制約します。想定外scopeなら停止。
5. サーバーの専用secret設定・コード反映を確認してから `INBOX_NOTIFY_ENABLED=true` を対象確認の上で設定。`initializeInboxBaseline` を1回実行し結果baseline、メール0通を確認。認証失敗なら停止し、管理Cookieやキーを代用しません。既存データは新着通知しません。
6. 許可された合成投稿と到達テストを実施。対象・件数・残存する試験レコードを記録し、無断削除しません。`NOTIFY_ENABLED=true` にして `checkInboxNotifications` を実行。メール件名は固定 `[Gemnao Inbox] New form submissions`。本文は種類別件数と固定管理リンクのみ。メール受付成功はGmail到達・ChatGPT配信成功ではありません。親担当が受信した実メールでGmailイベントを設定し、この会話まで到達確認します。
7. 正常到達・重複防止・停止確認後、本人がApps Scriptの「トリガー」から `checkInboxNotifications` の時間主導型・1時間おきを設定。毎時確認であり即時webhookではありません。Google/Cloudflare共用枠や配送の遅延・停止があり得ます。

## 結果不明と停止

`PENDING_BATCH` が残ったら後続送信は停止します。本人がGmail到達と記録を確認するまで削除・再送しません。確認後の復旧も元データをチャットに貼らず非公開プロジェクトで実施します。これは欠落も重複も絶対にない保証ではなく、結果不明時の重複回避を優先します。

停止はApps Script `NOTIFY_ENABLED=false` とトリガー停止。サーバー `INBOX_NOTIFY_ENABLED=false` でも停止できます。キー失効はサーバーsecret削除/変更。ローテーション時はカーソルが無効になるため、未通知分の扱いを確認してから基準点を再設定します。

## 現在の制約

この実行環境には当該Cloudflareプロジェクトの安全なsecret入力やApps Script編集/OAuthの接続経路が確認できません。AppDeploy用secretツールは別サービス向けなので転用しません。一般Web取得やGitHub fetchはBearerを安全に預けて定期実行する接続ではありません。本人操作または正規の接続済み管理手段が必要です。コードだけで通知設定済みと報告しません。

検証: `node ops/private-inbox-notify/notify.test.mjs` は模擬Googleサービスのみを使用。実メール・OAuth・遠隔DB操作なし。

## 専用設定名の切替候補

認証に使う名前は `INBOX_NOTIFY_READ_TOKEN_HASH_V2` のみです。旧 `INBOX_NOTIFY_TOKEN_SHA256` はコードから参照せず、フォールバックもありません。旧項目の削除・変更は不要です。Google側の生キーは変更せず、その64文字テキストのUTF-8 SHA-256を新名のproduction秘密へ本人が保存します。値をチャット・コード・ログに出しません。

順序は新名の秘密保存→本人の保存完了確認→この候補コードの本番配信→配信成功確認→許可された単回baselineです。プレビューOFFとメールOFFを維持します。この変更は有効化フラグ・Googleプロパティ・既存カーソルを変更しません。現在の本番フラグは既にONであり、上の初期構築手順を繰り返して変更しないでください。新名への保存だけでは現行旧コードは切り替わりません。今回、実設定・配信・認証成功はまだ検証していません。
