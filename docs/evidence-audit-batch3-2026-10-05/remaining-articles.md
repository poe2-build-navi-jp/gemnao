# 第3バッチ：記事別の残作業

対象は共通ガイド28・Windows記事19・Discord記事38の計85ページ群。以下のSTEP/原因見出しは残作業の具体的な入口であり、全体未確認です。共通主張の一部に根拠があってもSTEP全体を完了扱いにしません。

## /discord/audio-input-not-found

Discordでオーディオ入力が見つからない｜Windows・アプリ・ブラウザで切り分け

共通根拠の対象: discord-input-output, windows-desktop-mic

未完了の確認:

- Windowsの入力一覧にないなら、接続と入力機器を確認する
- 一覧にはあるが声が入らないなら、Windowsのテストで確認する
- Windowsでは成功するなら、アプリの許可と入力機器をそろえる
- ブラウザ版だけ失敗するなら、サイト権限と使用マイクを確認する
- テスト成功なら、実際の通話で届くかを確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /discord/bluetooth-audio-problem

Discord通話でBluetoothのゲーム音が消える・音質が悪くなる原因と直し方

共通根拠の対象: le-audio, windows-app-output

未完了の確認:

- ゲーム音が消えたら、ゲームとDiscordの出力先を確認
- 音質だけ落ちるなら、Bluetoothマイクを別の入力に替える
- 音量だけ下がるなら、通話中の音量調整を確認
- 通話の外でも接続が不安定な場合だけ、再接続を試す
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /discord/bot-add

Discord Botの入れ方・追加方法｜サーバーへ導入する手順

共通根拠の対象: 未着手

未完了の確認:

- サーバー管理権限と追加先を確認する
- App DirectoryからBot・アプリを選ぶ
- 追加後にメンバー一覧とコマンドを確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /discord/bot-not-responding

Discord Botが反応しない｜コマンドが出ない・エラー・無応答で切り分け

共通根拠の対象: 未着手

未完了の確認:

- 候補が出ないなら、使い方とアプリの追加先を確認する
- 同じコマンドで、チャンネルと利用者を1つずつ変える
- 実行エラーは、文言と失敗した処理で次の確認先を選ぶ
- 管理者は、利用者のコマンド権限とBotの操作権限を別々に確認する
- 無応答が広く再現するなら、Bot提供者と応答先を確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 6。詳細は article-queue.json / source-queue.json.gz。

## /discord/bot-remove

Discord Botの消し方・連携解除｜削除後も投稿が続く時の確認

共通根拠の対象: 未着手

未完了の確認:

- 削除前に、止まる機能と戻すための情報を確認する
- サーバーのBotは、対象をキックして追加状態を確認する
- 自分のアカウントのアプリは、認証を解除する
- 削除後も新しい投稿が続くなら、Webhookと転送元を調べる
- コマンド・過去の投稿・ロールが残る時は、残った物ごとに判断する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 7。詳細は article-queue.json / source-queue.json.gz。

## /discord/call-disconnects

Discordの通話が切れる・落ちる時の直し方【切断・アプリ終了を区別】

共通根拠の対象: discord-udp

未完了の確認:

- 最初に通話切断・アプリ終了・音切れを区別する
- 別チャンネル・DMで、通話場所だけを変えて比較
- アプリとブラウザを、同じPC・同じ回線で比較
- 別回線で比較し、元の回線やVPNを確認
- ゲーム・配信中だけ切れる：負荷と症状を再確認
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 1。詳細は article-queue.json / source-queue.json.gz。

## /discord/camera-not-working

Discordでカメラが映らない時の直し方【自分・相手の画面で切り分け】

共通根拠の対象: discord-mute-permission

未完了の確認:

- Windows・Discord・相手の画面を順に比較する
- Windowsでも映らない：カバー・接続・権限を確認
- Windowsだけ映る：Discordの機器選択とアクセス許可
- 自分には映る：通話のカメラ開始と相手側を確認
- 特定サーバーだけ映らない：ビデオ権限を確認
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /discord/cant-hear-voice

Discordで相手の声が聞こえない時の直し方｜全員・一人だけで切り分け

共通根拠の対象: discord-input-output, discord-mute-permission, discord-reset, discord-mic-test, windows-app-output

未完了の確認:

- Windowsや別アプリの音を同じヘッドホンで確認する
- Discordだけ全員無音：スピーカーミュートと出力を確認する
- 一人だけ無音：個別設定と話す側を比較する
- 特定サーバー・接続中だけの問題を分ける
- ゲーム・配信中だけ無音：出力先と音の種類を確認する
- アプリだけ直らない場合は、ブラウザ版と比較する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /discord/crashing

Discordが落ちる・勝手に終了する原因と直し方【起動・通話・配信別】

共通根拠の対象: discord-cache, discord-install-folders, discord-overlay

未完了の確認:

- 最小化・通話切断・アプリ終了を見分ける
- 起動直後に落ちる：完全終了とブラウザ比較を行う
- 通話開始で落ちる：音声だけで機器を比較する
- カメラ・画面共有で落ちる：共有対象と描画設定を比較する
- ゲーム中・長時間後に落ちる：併用機能と負荷を確認する
- エラーなしで落ちる：Windowsの信頼性履歴を読む
- アプリだけ落ち続ける場合：データの場所を確認して入れ直す
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /discord/echo-double-voice

Discordで自分の声が返る・二重になる時の直し方【エコーの原因別】

共通根拠の対象: 未着手

未完了の確認:

- まず1人ずつミュートして、声が戻る経路を探す
- 特定の相手をミュートすると止まる：その人の再生音を確認
- 退出後も自分の声が聞こえる：モニター機能を確認
- 相手に二重に届く：通話・配信・仮想音声を分けて比較
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 1。詳細は article-queue.json / source-queue.json.gz。

## /discord/error-1001

Discordエラー1001の直し方｜音声共有の許可画面が出ない場合も解説

共通根拠の対象: code1001

未完了の確認:

- 許可画面が出たら、サウンド共有を許可して結果を聞く
- 許可画面が出ない場合は、配信対象を選び直して再確認する
- 1001が続く場合、別アプリでも出るか比べて相談先を決める
- 1001が消えたのに無音なら、ゲーム音の記事へ進む
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /discord/error-1002

Discordエラー1002の直し方｜ノイズ抑制の比較と再発時の対処

共通根拠の対象: discord-mute-permission, krisp-conditions, code1002

未完了の確認:

- 1002を確認し、再参加と完全再起動を順に試す
- 元の設定→オフ→元の設定で、エラーと声を比較する
- 戻すと再発する場合は、通話を確保して発生条件を絞る
- 通話自体ができない場合は、止まる地点で別の確認へ進む
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /discord/error-1003

Discordエラー1003・ロボット声の直し方｜入力と出力を分けて比較

共通根拠の対象: code1003

未完了の確認:

- 1003の表示があるか、誰が歪んだ声を聞くかを確認する
- 入力だけ・出力だけを変え、改善する組み合わせを調べる
- 予備機器がない場合は、内蔵機器・録音・ブラウザで比較する
- 比較結果に合わせて、設定確認かサポート相談へ進む
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /discord/game-not-detected

Discordがゲームを認識しない・表示されない時の直し方｜検出と共有を切り分け

共通根拠の対象: 未着手

未完了の確認:

- 未検出なら、ゲーム本体を起動して手動追加を確認する
- 検出済みなら、共有設定を確認して相手の画面と比べる
- 相手によって表示が違うなら、共有する範囲を確認する
- 別のゲームと比べて、1本だけか全体の問題かを絞る
- 招待・参加・オーバーレイだけ使えない場合は別に確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /discord/game-volume-lowers

Discord通話中にゲーム音が小さくなる｜発言時・参加直後・音質変化で切り分け

共通根拠の対象: le-audio, windows-ducking

未完了の確認:

- 同じBGMで、通話前・無言・発言中・退出後を比較する
- 発言中だけなら、Discordの減衰を0％にして比べる
- 参加直後から小さいなら、Windowsの通信設定を確認する
- Bluetoothで音質も変わるなら、マイク使用時のモードを切り分ける
- 退出後も小さい・特定ゲームだけなら、音量と出力先を確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 1。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /discord/installation-failed

DiscordのInstallation has failedを直す｜初回・再インストールとログで切り分け

共通根拠の対象: discord-install-folders

未完了の確認:

- 初回インストールは、取得元と失敗した段階を確認する
- 再インストールは、ログイン手段を確保して完全終了する
- Open Setup Logでは、今回の日時・失敗行・前後の処理を見る
- 残存フォルダーを確認し、ない・使用中・拒否を分けて進む
- 起動・再起動で完了を確認し、再失敗なら比較結果を添えて相談する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /discord/loading-stuck

Discordが読み込み中から進まないときの直し方【ロゴ・灰色画面】

共通根拠の対象: discord-cache

未完了の確認:

- まずブラウザ版と同じアカウントで比較する
- ブラウザ版は開く：Discordアプリを完全終了する
- ブラウザ版も止まる：障害情報と接続を確認する
- アプリだけ止まる：キャッシュを退避して比較する
- 更新・破損エラーが表示された場合は専用の対処へ
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /discord/login-error

Discordにログインできない時の直し方｜メール・パスワード・二要素認証別

共通根拠の対象: 未着手

未完了の確認:

- 登録メールを確認し、ログイン済み端末を残す
- パスワードを忘れた場合は、公式画面から再設定する
- 再設定メールが届かない：宛先と受信側を確認する
- 認証コードで止まる：使える認証方法を確認する
- アプリだけ失敗する：同じアカウントでブラウザ比較を行う
- 無効化・身に覚えのない変更は、通知内容に合う窓口へ進む
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 6。詳細は article-queue.json / source-queue.json.gz。

## /discord/mic-not-working

Discordでマイクが反応しない・声が届かない時の直し方【Windows】

共通根拠の対象: discord-input-output, discord-mute-permission, discord-reset, discord-mic-test, windows-desktop-mic

未完了の確認:

- Windowsで同じマイクに入力があるか確認する
- Windowsのマイク許可とDiscordの入出力をそろえる
- テストは成功する場合：ミュート・入力モード・感度を確認する
- 通話相手・サーバーを変え、権限と受信側を切り分ける
- アプリだけ改善しない場合はブラウザ比較と音声設定のリセットへ
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /discord/mic-volume-low

Discordでマイク・声が小さい時の直し方【自分と相手の設定を切り分け】

共通根拠の対象: discord-input-output, discord-mic-test

未完了の確認:

- 特定の相手だけ小さい：聞く人が個別音量を確認
- 全員に小さい：録音・マイクテスト・通話を比較
- Windows録音から小さい：入力音量を調整する
- Discordだけ小さい：入力音量と音声処理を比較
- 100％でも小さい：位置・機器のゲイン・接続を確認
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /discord/no-route

DiscordでNo Routeが出る時の直し方｜回線・PC・通話先で切り分け

共通根拠の対象: discord-udp

未完了の確認:

- 障害確認と比較で、失敗する範囲を決める
- 特定回線だけ失敗する場合はVPNとルーターを確認する
- PCだけ失敗する場合は、アプリ・通信許可・QoSを比較する
- 特定チャンネルだけ失敗する場合は音声リージョンを比較する
- DNS変更やネットワーク初期化へ進む前に結果を整理する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 1。詳細は article-queue.json / source-queue.json.gz。

## /discord/not-opening

Discordが起動しない原因と直し方｜無反応・すぐ閉じる場合【Windows】

共通根拠の対象: discord-cache

未完了の確認:

- 完全終了して、起動経路を変えて確認する
- ブラウザ版と比較し、アプリ・接続・ログインを分ける
- アプリだけ開かない場合は、キャッシュを退避して比較する
- ブロック通知がある場合は、検出内容を確認する
- 改善しない場合は、ログイン手段を確保して再インストールする
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 1。詳細は article-queue.json / source-queue.json.gz。

## /discord/notifications-not-working

Discordの通知が来ない原因と直し方｜DM・メンション・開いている時で切り分け【PC版】

共通根拠の対象: 未着手

未完了の確認:

- DMだけ届かないなら、会話ごとのミュートと「無視」を調べる
- 初めての相手のDMが見当たらないなら、リクエストを探す
- サーバー投稿・メンションだけなら、通知の種類を見比べる
- Discordを開いている時だけなら、表示中の会話と状態を比較
- 全部の通知が出ない・ゲーム中だけ出ないなら、DiscordとWindowsを確認
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 7。詳細は article-queue.json / source-queue.json.gz。

## /discord/overlay-not-showing

Discordのオーバーレイが表示されない｜本体・通話・通知別の直し方

共通根拠の対象: discord-overlay, discord-helper

未完了の確認:

- 本体が開かない：有効化とゲーム内でのキー操作を確認する
- 通話参加者だけ見えない：表示条件とボイスウィンドウを確認する
- 通知だけ出ない：受信とゲーム内表示を分けて確認する
- 特定ゲームだけ出ない：表示モードと別ゲームで比較する
- 権限の高いゲームでキーが効かない：公式ヘルパーの案内を確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /discord/phone-verification-error

Discordの電話番号認証ができない｜無効・登録済み・SMSが届かない場合の直し方

共通根拠の対象: 未着手

未完了の確認:

- 「無効な電話番号」なら形式と番号の種類を確認
- 「すでに登録済み」なら登録元のアカウントで番号を外す
- 「レートリミット・最近使用された」なら待機する
- 番号は通ったがSMSが届かないなら受信段階を比べる
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /discord/recommended-bots

DiscordおすすめBot 4選｜ゲームサーバー向けの選び方・導入手順

共通根拠の対象: 未着手

未完了の確認:

- 導入前：標準機能と既存Botで足りるか確認する
- 共通の入れ方：公式リンクから追加先・権限を確認する
- 導入後：管理者以外で、期待した結果を確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 12。詳細は article-queue.json / source-queue.json.gz。

## /discord/rtc-connecting

DiscordがRTC接続中から進まない時の直し方｜端末・回線・通話先で判定

共通根拠の対象: discord-reset, discord-udp

未完了の確認:

- 表示と障害情報を確認し、通話へ入り直す
- チャンネル・ブラウザ・端末を順に比較する
- 回線・VPN・PCの通信許可を確認する
- 特定チャンネルだけ失敗する場合は、音声リージョンを比較する
- ブラウザ版だけ成功する場合は、アプリとAMD対象条件を確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /discord/screen-share-black-screen

Discord画面共有が黒いときの直し方｜配信者・視聴者・特定アプリで切り分け

共通根拠の対象: 未着手

未完了の確認:

- 最初に「配信者の小窓」と「視聴者の配信画面」を区別する
- 同じメモ帳をアプリ共有と画面全体共有で比べる
- 一人の視聴者だけ黒いなら、同じ配信を二人で開く
- 特定アプリだけ黒いなら表示モードと共有対象を調べる
- 普通のアプリも画面全体も全員に黒い場合を調べる
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 6。詳細は article-queue.json / source-queue.json.gz。

## /discord/screen-share-not-working

Discordで画面共有できない・相手に映らない時の直し方【PC版】

共通根拠の対象: discord-stream-acceleration

未完了の確認:

- 共有を始められない：通話への参加と「動画」権限を調べる
- 配信中なのに見えない：視聴画面とプレビューを区別する
- 特定アプリだけ映らない：アプリ単体と画面全体を比べる
- 一人だけ見えない：二人目の視聴者で切り分ける
- 通常アプリも全員に黒い：描画設定と通信を一つずつ比較する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /discord/slow-performance

Discordが重い・遅い時の直し方｜画面操作・通信・ゲーム中で切り分け

共通根拠の対象: 未着手

未完了の確認:

- 同じ操作を決め、変更前の状態を記録する
- CPU・メモリ・GPU・ディスクの結果から次の操作を選ぶ
- 送受信だけ遅い：障害・接続・通信中の処理を比較する
- Discordの画面だけ重い：アニメーションと描画設定を比較する
- ゲーム・配信中だけ重い：同時に使う機能を減らして比較する
- アプリだけ重い場合：完全終了・更新後に再確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /discord/stream-no-audio

Discord配信でゲーム音が入らない・相手に聞こえない時の直し方

共通根拠の対象: windows-app-output

未完了の確認:

- 配信者側：ゲームの音量と出力先を確認する
- 共有方法：ゲームのアプリと画面全体を比べる
- 視聴者側：配信のミュート・配信音量を確認する
- 特定のゲームだけ無音：ゲーム内設定と共有対象を照合する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 1。詳細は article-queue.json / source-queue.json.gz。

## /discord/stream-stuttering

Discord配信がカクカクする・重いときの直し方【配信者・視聴者別】

共通根拠の対象: discord-stream-acceleration

未完了の確認:

- 配信の解像度・フレームレートが回線に対して高い
- アップロード回線またはDiscord側に問題がある
- ゲーム・録画・DiscordでPC負荷が高い
- 配信対象やGPUドライバーとの相性
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /discord/system-helper

Discordシステムヘルパーとキー割り当て｜ゲーム中だけ効かない時の直し方

共通根拠の対象: discord-helper

未完了の確認:

- 編集画面を閉じ、同じ操作をゲーム外とゲーム中で比べる
- 別の未使用キーを記録し、競合と設定ミスを確認する
- ゲーム中だけ失敗する場合は、Discord内の公式案内を確認する
- 案内がない場合は、基本確認と代替操作を使う
- 導入後も、キー操作・音声・オーバーレイを分けて再確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /discord/update-failed

DiscordのUpdate Failed・更新ループの直し方｜削除前に通信とアプリを確認

共通根拠の対象: discord-install-folders

未完了の確認:

- 障害情報とブラウザ版を、ファイル削除より先に確認する
- 同じPCで回線を変え、ダウンロードと更新を比較する
- Discordと更新プロセスを完全終了して起動し直す
- 条件がそろった場合だけ、残存フォルダーを整理して入れ直す
- 入れ直しても失敗する場合は、止まる画面と比較結果を残す
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /discord/upload-failed

Discordで画像・ファイルを送れない時の対処法｜容量・権限・送信失敗を切り分け

共通根拠の対象: discord-file-limit

未完了の確認:

- 失敗の場所を記録し、安全な比較用ファイルを用意する
- 今の上限表示と、圧縮前のファイル容量を照合する
- 同じチャンネルの「ファイルを添付」権限を確認する
- 元ファイルの問題と、プレビューだけの問題を分ける
- 同じ条件でアプリとブラウザを比べ、通信の範囲を絞る
- 安全上の警告を尊重し、必要な情報だけで問い合わせる
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 7。詳細は article-queue.json / source-queue.json.gz。

## /discord/user-volume-low

Discordで相手の声が小さい時の直し方｜1人だけ・全員・ゲーム中で切り分け

共通根拠の対象: discord-input-output, windows-app-output

未完了の確認:

- 1人だけ小さいなら、その人のユーザー音量を調整する
- 全員小さいなら、Discordの出力先と出力音量を確認する
- Windowsの音量ミキサーと機器本体を確認する
- ゲーム中だけ小さいなら、ゲーム音とのバランスを比べる
- 他の参加者にも同じなら、相手側のマイクを確認してもらう
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 1。詳細は article-queue.json / source-queue.json.gz。

## /discord/voice-client-outdated

Discordの古いバージョンで通話できない｜更新できない時の対処

共通根拠の対象: 未着手

未完了の確認:

- 更新前の版を記録し、完全終了して更新する
- 番号が変わらない・更新できない時は、表示と起動先を確認する
- ブラウザ自体を更新・再起動して、同じ通話を試す
- 比較結果に合わせ、更新・接続・音声・Botを分けて対処する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 6。詳細は article-queue.json / source-queue.json.gz。

## /discord/voice-cutting-out

Discordで音声・マイクが途切れる時の直し方【語尾・ゲーム中の症状別】

共通根拠の対象: discord-mic-test, krisp-conditions

未完了の確認:

- 同じ文章を録音・テスト・通話で比較する
- Windows録音も切れる：接続と使用マイクを確認
- 語尾だけ切れる：入力モードに合う項目を調整
- Discordだけ欠ける：ノイズ抑制を1項目ずつ比較
- 通話・ゲーム中だけ切れる：相手と回線・負荷を比較
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /guide/black-screen

PCゲームが黒い画面になる時の対処法｜音だけ出る・起動後に真っ暗

共通根拠の対象: blank-screen-keys

未完了の確認:

- Windowsの画面が出るか確認
- 画面モードと直前の設定を戻す
- 修復と追加機能を1つずつ比較
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 5。詳細は article-queue.json / source-queue.json.gz。

## /guide/bsod-while-gaming

ゲーム中のブルースクリーン｜停止コード・メモリ診断・ミニダンプの調べ方

共通根拠の対象: kernel-power

未完了の確認:

- 停止コードと発生時刻を記録する
- コード別にGPU・メモリ・機器を調べる
- メモリ診断とダンプを確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 7。詳細は article-queue.json / source-queue.json.gz。

## /guide/controller-double-input

コントローラーが二重入力する時の直し方｜Steam Input・仮想パッドの見分け方

共通根拠の対象: steam-input-legacy

未完了の確認:

- 1回押した結果と実機・仮想パッドを記録する
- 外部ツールを停止しSteam Inputだけで比較する
- 残る場合だけSteam Inputかゲーム側を確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /guide/directx-error

DirectXエラー｜機能レベル・DLL不足・GPUエラーの見分け方

共通根拠の対象: dism-order, legacy-directx, dxgi-removed, feature-level-capability

未完了の確認:

- エラー全文と使用GPUを確認する
- 一致したエラーの対処だけを試す
- 同じ条件で再確認し、記録を残す
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /guide/gpu-driver-update

GPUドライバーの更新方法｜NVIDIA・AMD・Intel別の操作と戻し方

共通根拠の対象: 未着手

未完了の確認:

- GPU名・現在の版と症状を記録する
- メーカー別に1つの経路で更新する
- 同じ条件で比較し、悪化したら戻す
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 7。詳細は article-queue.json / source-queue.json.gz。

## /guide/low-fps

PCゲームのFPSが低い時の調べ方｜上限・CPU・GPU負荷を切り分ける

共通根拠の対象: cpu-gpu-load

未完了の確認:

- 同じ場面でFPS・上限・使用GPUを記録する
- FPSが上限値で頭打ちなら、まず上限設定を確認する
- 解像度だけを下げてFPSを比べる
- 結果に合わせてCPU側・GPU側の対処を選ぶ
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 5。詳細は article-queue.json / source-queue.json.gz。

## /guide/low-gpu-usage

ゲーム中にGPU使用率が低い時の見方｜正常なFPS上限と性能不足を判別

共通根拠の対象: cpu-gpu-load

未完了の確認:

- プレイ中のFPSと上限が一致しているか確認する
- ゲームが使うGPUとCPUの負荷をセットで記録する
- 目標未達ならCPU側か使用GPUかを一つずつ比べる
- 改善しない時は電源と描画設定を条件付きで確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /guide/no-game-audio

PCゲームで音が出ない時の直し方｜Windows全体・ゲームだけ無音を切り分ける

共通根拠の対象: windows-app-output

未完了の確認:

- 同じ出力機器で、ほかの音が聞こえるか調べる
- Windowsの出力先とゲーム別の音量を確認する
- ゲーム内の音量を確認し、同じ場面で聞き比べる
- 直らない場合だけ、結果に合う次の確認へ進む
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /guide/pc-game-crash

PCゲームが落ちる・強制終了する時の対処法｜タイミング別の原因確認

共通根拠の対象: 未着手

未完了の確認:

- 落ち方と発生時刻を記録する
- 発生タイミングに合う1項目を試す
- 同じ条件で結果を比べ、次へ進む
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /guide/pc-game-freezes

PCゲームが固まる・応答なしになる時の対処法｜メモリ・温度の確認手順

共通根拠の対象: 未着手

未完了の確認:

- ゲームだけかPC全体か分ける
- メモリと温度を記録する
- 結果に合う対処を1つ試す
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 8。詳細は article-queue.json / source-queue.json.gz。

## /guide/pc-shuts-down-while-gaming

ゲーム中にPCの電源が落ちる・勝手に再起動する時の調べ方

共通根拠の対象: kernel-power

未完了の確認:

- 電源断・再起動・停止コードを分ける
- 信頼性履歴とイベント41を時刻で照合する
- 温度・冷却・電源接続を安全に確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 7。詳細は article-queue.json / source-queue.json.gz。

## /guide/ray-tracing-gpu

「レイトレーシング対応GPUが必要」なゲームが起動しない｜自分のGPUが対応か確認する方法

共通根拠の対象: 未着手

未完了の確認:

- GPU名を確認する
- レイトレーシングに対応しているか判断する
- ノートPCはゲームが使うGPUを確認する
- 対応GPUなのに起動しない場合
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /guide/remove-mods-safely

PCゲームのMODを安全に外す方法｜管理ツール・手動・Steamワークショップ別の戻し方

共通根拠の対象: 未着手

未完了の確認:

- セーブ・導入記録・退避先を用意する
- 管理ツール・手動導入・ワークショップ別に外す
- 残存を確認し、MODなしの起動を比べる
- 元に戻す場合は、導入経路から1件ずつ再適用する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /guide/reset-config-file

PCゲームの設定ファイルを初期化する方法｜場所の探し方・安全な戻し方

共通根拠の対象: steam-cloud-timing

未完了の確認:

- 対象ファイルとセーブの場所を確認する
- ゲームを終了し、別の場所へコピーする
- 設定だけを退避し、既定値で起動する
- 再起動で確認し、必要なら元に戻す
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 1。未取得URL: 7。詳細は article-queue.json / source-queue.json.gz。

## /guide/reshade-uninstall

ReShadeのアンインストール方法｜消すファイルの見分け方・戻し方

共通根拠の対象: 未着手

未完了の確認:

- 導入先とプリセットを控える
- 導入方法に合わせてReShadeを解除する
- 起動を確認し、残すものを整理する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 1。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /guide/save-data-backup

PCゲームのセーブデータをバックアップする方法｜保存先・確認・復元手順

共通根拠の対象: steam-cloud-timing

未完了の確認:

- 保存先とコピー対象を確認する
- 元の名前で日付別にコピーする
- コピーの一致を確認して記録する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 1。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /guide/shader-cache-delete

シェーダーキャッシュの削除・再構築方法｜Windows・NVIDIA・AMD

共通根拠の対象: 未着手

未完了の確認:

- 症状を控え、ゲームを終了する
- 対象のキャッシュだけを削除する
- 再構築を待ち、同じ場面で比較する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 7。詳細は article-queue.json / source-queue.json.gz。

## /guide/steam-cloud-sync-error

Steamクラウド同期エラー・競合｜ローカルとクラウドの選び方

共通根拠の対象: steam-cloud-timing

未完了の確認:

- 競合画面を記録し候補を保全する
- PCごとの最後のプレイを調べる
- 判断例に当てはめて候補を選ぶ
- 選択後に進行を確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 1。未取得URL: 1。詳細は article-queue.json / source-queue.json.gz。

## /guide/steam-disk-write-error

Steamディスク書き込みエラーの直し方｜保存先と空き容量・修復後の判断

共通根拠の対象: 未着手

未完了の確認:

- 対象ゲームの保存先ドライブと空き容量を確認する
- 再起動後に同じ更新を一度再開して結果を記録する
- 対象のSteamライブラリを修復し、更新完了まで確認する
- 複数ゲームでも失敗する場合はドライブ側を点検する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 1。未取得URL: 5。詳細は article-queue.json / source-queue.json.gz。

## /guide/steam-game-not-launching

Steamゲームが起動しない時の対処法｜プレイを押しても起動しない・「起動準備を行っています」で止まる

共通根拠の対象: 未着手

未完了の確認:

- プレイ直後の状態を見分ける
- 無反応・「起動準備」で止まるならSteam公式の基本手順を試す
- 一瞬起動して閉じるなら停止履歴を調べる
- 試した結果から次の行動を決める
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 1。未取得URL: 8。詳細は article-queue.json / source-queue.json.gz。

## /guide/steam-input-controller

Steam Inputでコントローラーが反応しない時の直し方｜認識場所別に確認

共通根拠の対象: steam-input-legacy, steam-controller-detection

未完了の確認:

- Steamが機器とボタン入力を認識するか確認する
- ゲーム別Steam Inputと入力方式を比較する
- 外部変換・複数機器を外して結果を確かめる
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /guide/stutter-fix

PCゲームがカクつく・一瞬止まる時の対処法｜FPS上限の設定と比較手順

共通根拠の対象: 未着手

未完了の確認:

- FPS上限を1か所で設定する
- シェーダー構築の完了を確認
- VRAM・読み込み負荷を確認
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 6。詳細は article-queue.json / source-queue.json.gz。

## /guide/tpm-secure-boot

ゲームでTPM 2.0・セキュアブートが必要と出た時の確認と有効化の方法【Windows】

共通根拠の対象: tpm-check, secure-capable-not-enabled

未完了の確認:

- Windowsで今の状態を確認する
- UEFI（BIOS）の設定画面を開く
- TPMを有効にする
- セキュアブートを有効にする
- 有効にしたのにゲームで要件を満たさないと出る場合
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /guide/uninstall-save-data

ゲームをアンインストールするとセーブは消える？Steam・PC版の判断方法

共通根拠の対象: steam-cloud-timing

未完了の確認:

- 本体とセーブの場所を分けて確認する
- クラウド同期と使用アカウントを確認する
- 削除範囲の外へコピーして照合する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 1。未取得URL: 5。詳細は article-queue.json / source-queue.json.gz。

## /guide/verify-steam-files

Steamゲームファイルの整合性確認｜再取得・変化なし・再発時の判断方法

共通根拠の対象: 未着手

未完了の確認:

- ゲームを終了し、MODとセーブの状態を残す
- ライブラリから整合性確認を実行する
- 「再取得」「変化なし」を起動結果と組み合わせて判断する
- 再発または毎回再取得される場合は発生時刻を照合する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 2。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /guide/visual-c-runtime-error

ゲームのVisual C++ Runtimeエラー対処｜DLL別の版とx86・x64の選び方

共通根拠の対象: vc-architecture, vc-series

未完了の確認:

- エラーの全文とゲームの対象を控える
- Windowsで同じ系列・x86／x64の導入状況を見る
- Microsoft公式の該当パッケージを修復または導入する
- 再起動して再現を確認し、結果で次を決める
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /guide/vram-shortage

PCゲームのVRAM不足を確認する方法｜専用・共有GPUメモリの見方と比較例

共通根拠の対象: gpu-memory

未完了の確認:

- ゲームが使うGPUと専用・共有GPUメモリを確認する
- 症状と数値を照合して、変える設定を一つ選ぶ
- 同じ場面を再訪し、使用量と症状を一緒に比べる
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /guide/windows-11-required

動作環境が「Windows 11」のゲームをWindows 10で遊べる？確認方法とアップグレード前の注意

共通根拠の対象: tpm-check

未完了の確認:

- Windowsのバージョンを確認する
- Windows 11にアップグレードできるか確認する
- アップグレードの前にセーブデータをバックアップする
- Windows 10のまま遊ぶ場合の注意
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合
- app/guide/[slug]/page.tsxで対応する補足コンポーネントを確認（supplement-queue.json）

本文取得不能URL: 0。未取得URL: 2。詳細は article-queue.json / source-queue.json.gz。

## /pc/audio-after-update

Windows Update後に音が出なくなった時の直し方【Windows 11】

共通根拠の対象: windows-app-output

未完了の確認:

- 音が出る範囲と出力先を同じ音で比べる
- 出力機器が一覧にない場合は、認識と有効状態を確認する
- 更新履歴とドライバーの版を照合する
- 音声サービスが止まっていないか確認する
- 特定の更新が原因と疑われる時だけ回復・削除を検討する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /pc/black-screen-after-sign-in

Windows 11でサインイン後に黒い画面・マウスカーソルだけが出る時の直し方

共通根拠の対象: blank-screen-keys

未完了の確認:

- Windowsの画面が見えているかを最初に分ける
- タスクマネージャーが開くなら、デスクトップの表示を戻す
- 画面全体が映らないなら、表示先と接続を確認する
- デスクトップが一度戻っても再発する時は、起動条件を照合する
- タスクマネージャーが使えない・再発する時はセーフモードで比較する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 6。詳細は article-queue.json / source-queue.json.gz。

## /pc/bluetooth-connected-no-sound

Bluetoothイヤホンが接続済みなのに音が出ない時の確認手順【Windows 11】

共通根拠の対象: le-audio, windows-app-output

未完了の確認:

- 「接続済み」と「音の出力先」を分けて確認する
- 特定アプリだけ無音なら音量ミキサーを見る
- 出力に現れない時だけ接続をやり直す
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 1。詳細は article-queue.json / source-queue.json.gz。

## /pc/bluetooth-option-missing

Windows 11でBluetoothが消えた時の直し方｜スイッチ・アダプター・機器別

共通根拠の対象: 未着手

未完了の確認:

- 設定とクイック設定を比べ、何が消えたか確かめる
- デバイスマネージャーのアダプター名・状態を読む
- アダプターがない場合は、搭載仕様と電源・USB接続を確認する
- 更新前後の記録から、ドライバーの更新・戻し・再導入を選ぶ
- 機器だけ見つからない場合は、ペアリングと検出設定を比べる
- 復旧を確認し、再発時は同じ条件の記録をメーカーへ渡す
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 8。詳細は article-queue.json / source-queue.json.gz。

## /pc/call-starts-audio-disappears

通話を始めるとゲームや動画の音が消える・小さくなる時の直し方【Windows 11】

共通根拠の対象: le-audio, windows-ducking

未完了の確認:

- Windowsの「通信」設定を一度だけ比較する
- 通話前後でゲームと通話の出力先を比べる
- Bluetoothヘッドセットのマイク使用による変化を分ける
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 1。詳細は article-queue.json / source-queue.json.gz。

## /pc/disk-usage-100

ディスク使用率100％でPCが重い時の対処法｜Windows 11

共通根拠の対象: 未着手

未完了の確認:

- タスクマネージャーでプロセス・ディスク・メモリを見る
- 更新・ゲームの展開・同期が進んでいるか確認する
- 自動起動するアプリを一つずつ減らす
- メモリ不足による読み書きが重なっていないか比べる
- 検索インデックスとウイルススキャンを区別する
- 空き容量が少ない場合だけ、削除する項目を確認する
- 低速で固まる場合はドライブの警告・接続・履歴を調べる
- 同じ操作で改善を確認し、相談用の記録を残す
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 12。詳細は article-queue.json / source-queue.json.gz。

## /pc/file-explorer-freezes-on-right-click

Windows 11のエクスプローラーが右クリックで固まる・応答なしになる時の直し方

共通根拠の対象: dism-order

未完了の確認:

- 開く段階と、固まる操作を記録する
- ウィンドウが開かないなら、エクスプローラーを再起動する
- 右クリックだけ止まるなら、対象とメニューを比較する
- 特定の場所だけ固まるなら、別の場所と比べる
- 右クリック時の追加機能が疑わしい場合、1つずつ一時的に外す
- ローカルの全フォルダーで失敗するならWindows側の状態を調べる
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 6。詳細は article-queue.json / source-queue.json.gz。

## /pc/gaming-shortcut-keys

ゲーム中に固まった・画面がおかしい時のショートカットキー｜PCゲーマー向け一覧【Windows 11】

共通根拠の対象: blank-screen-keys

未完了の確認:

- 画面が固まった・真っ黒なら、Windowsキー＋Ctrl＋Shift＋Bでドライバーをリセット
- ゲームが応答しないなら、Ctrl＋Shift＋Escでタスクマネージャーを開く
- フルスクリーンとウィンドウの切り替えは、Alt＋Enterを試す
- HDRの見え方がおかしいなら、Windowsキー＋Alt＋Bで切り替えて比べる
- エラー画面を残す・フォルダーを開くキー
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /pc/microphone-after-update

Windows Update後にマイクが使えない・認識されない時の確認手順【Windows 11】

共通根拠の対象: windows-desktop-mic

未完了の確認:

- Windowsの入力テストで、OSまで声が届くか調べる
- 通話アプリだけ使えない場合は権限と入力先を合わせる
- マイクが一覧にない時は機器とエラー表示を調べる
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /pc/pc-broken

PCが壊れた？症状別の確認方法と修理に出す目安【電源・画面・起動】

共通根拠の対象: 未着手

未完了の確認:

- 危険な異常があれば、使用・充電を止めて相談する
- 電源が入らない場合は、外から確認できる接続を調べる
- 電源は入るが映らない場合は、モニターとPCを分ける
- Windowsが起動しない場合は、データと回復キーを先に確認する
- 起動できるが落ちる・重い場合は、PC全体か一部か比較する
- データを保全し、診断結果と見積もりで修理・買い替えを決める
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 6。詳細は article-queue.json / source-queue.json.gz。

## /pc/pc-hacked-signs

PCが乗っ取られた症状は？危険な兆候・確認方法・最初にすること【Windows 11】

共通根拠の対象: 未着手

未完了の確認:

- 不審な遠隔操作があるなら先にネット接続を切る
- 安全な別端末からアカウントの履歴と復旧先を確認する
- ブラウザの偽警告と本物の検知を分ける
- 遠隔操作ソフト・拡張機能の導入経緯を確認する
- 重さ・カーソルの動きだけなら機器や通常処理も比較する
- Windowsのフルスキャン・オフラインスキャンと結果を確認する
- 遠隔操作済み・暗号化・被害ありなら復旧と相談を決める
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 11。詳細は article-queue.json / source-queue.json.gz。

## /pc/refresh-rate-stuck-60hz

モニターが144Hzにならない・60Hzのまま｜リフレッシュレートの確認と直し方【Windows 11】

共通根拠の対象: refresh-drr

未完了の確認:

- Windowsの「ディスプレイの詳細設定」で今のHzを見て、選び直す
- ゲームだけ低いなら、動的リフレッシュレート（DRR）とゲーム内設定を確認
- 高いHzが出てこないなら、ケーブル・端子・接続を確認
- ドライバーをリセット・ロールバック・再インストールする
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 1。詳細は article-queue.json / source-queue.json.gz。

## /pc/second-monitor-not-detected

2台目のモニターが認識されない・映らない時の確認手順【Windows 11】

共通根拠の対象: 未着手

未完了の確認:

- Windowsが2台目を見つけているか確認する
- 検出と直結で接続経路を分ける
- 更新後に限る場合はグラフィックドライバーの版を確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 3。詳細は article-queue.json / source-queue.json.gz。

## /pc/sleep-wakes-up-by-itself

Windows 11がスリープから勝手に復帰する原因の調べ方と直し方

共通根拠の対象: powercfg-meaning

未完了の確認:

- 画面消灯とスリープを区別し、復帰時刻を控える
- 4つの powercfg コマンドで、解除元と候補を分ける
- 機器が解除元なら、該当する1台の許可を比較する
- 時刻が合う場合だけスリープ解除タイマーを比較する
- 解除元が不明なら、スリープ方式と時間帯から絞り込む
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 5。詳細は article-queue.json / source-queue.json.gz。

## /pc/usb-c-device-not-recognized

USB-C機器が認識されない・「機能が制限される」と出る時の調べ方【Windows 11】

共通根拠の対象: new-disk-only

未完了の確認:

- 直結・ケーブル・別ポートを1つずつ比較する
- デバイスマネージャーで状態とエラーコードを見る
- SSDは「ディスクの管理」の表示結果から判断する
- 映像・ドック・USB4はポートの対応機能を照合する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /pc/wifi-connected-no-internet

Wi-Fiは接続済みなのにインターネットなし｜PCだけ・家中・特定サイト別の直し方

共通根拠の対象: 未着手

未完了の確認:

- PC・スマホ・別サイトで、止まる範囲を比べる
- 家中の端末で使えないなら、回線とルーターを調べる
- PCだけ使えないなら、接続先とWindowsの診断を確認
- 特定サイトだけなら、同じURLを別環境で比べる
- PCだけ続く場合、IPアドレスとDNSの結果を読む
- まだPCだけ失敗するなら、プロキシとVPNを確認
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 6。詳細は article-queue.json / source-queue.json.gz。

## /pc/wifi-option-missing

Windows 11でWi-Fiの項目が消えた・接続先が表示されない時の直し方

共通根拠の対象: 未着手

未完了の確認:

- スイッチがないのか、接続先だけが空なのか確かめる
- デバイスマネージャーで無線アダプターの状態を読む
- 接続先が空なら別端末・周波数帯・無線サービスを比べる
- 無線アダプターがない・更新後から消えた時に確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 4。詳細は article-queue.json / source-queue.json.gz。

## /pc/windows-update-0x800f081f

Windows Updateエラー「0x800f081f」の直し方｜更新履歴と修復結果で判断【Windows 11】

共通根拠の対象: dism-order, windows-repair

未完了の確認:

- 更新の履歴で失敗した項目とエラーの出た場所を記録する
- Windows Updateの診断を実行し、同じ更新を再確認する
- DISMとSFCの表示結果を読み、更新をもう一度試す
- 修復が失敗する時はWindows 11の回復機能を確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 5。詳細は article-queue.json / source-queue.json.gz。

## /pc/windows-update-stuck

Windows Updateが終わらない時の対処法｜0％・100％・再起動中を切り分ける

共通根拠の対象: dism-order, windows-repair

未完了の確認:

- 止まった画面と更新名を記録する
- ダウンロードが進まない時は通信とWindows側の空き容量を確認する
- 再起動待ちを終え、同じ更新が失敗するなら診断する
- 更新が繰り返し失敗する時だけ、DISM→SFCの結果を確認する
- 再起動後の更新画面・取り消し画面から戻れない場合
- 起動できても直らない場合は、現在のWindowsを修復再インストールする
- 同じ更新の成功・再起動待ち・再発を確認する
- 要約・症状早見表・FAQ・想定結果/戻し方の残る主張を照合
- 実在する翻訳variantの意味と対応UIを照合

本文取得不能URL: 0。未取得URL: 9。詳細は article-queue.json / source-queue.json.gz。
