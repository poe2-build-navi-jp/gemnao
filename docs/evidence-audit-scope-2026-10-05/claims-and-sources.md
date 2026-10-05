# 26群の主張・出典対応

基準: `33d78198cd261e8a7906177535d926a3f08ab7c5`。以下は旧残件の範囲を分解した検査項目。記事全体の全主張一覧ではない。引用位置はローカル展開本文の行番号であり、現行ソースコードの行番号や本番取得の証明ではない。

## discord-bot-add-1

/discord/bot-add

2項目 / 文書残件 1。実機操作は未実施で別枠。

### discord-bot-add-1-c1 — 特定文言の根拠不足

スマホで招待リンクを使える場合がある

本文対応: 招待リンクなどから追加できる場合がありますが、Discord公式のApp Directoryはデスクトップ版・ブラウザ版で利用します。権限内容を確認しやすいため、管理作業はPC版を推奨します。

根拠: https://support.discord.com/hc/en-us/articles/21334461140375-Using-Apps-on-Discord

公式資料のモバイル実行と招待を混同しない。招待経路の個別例を裏付ける資料が必要。

### discord-bot-add-1-c2 — 編集・適用範囲

個別Botの要求権限を利用者が確認する

本文対応: 1. サーバー管理権限と追加先を確認する

根拠: https://support.discord.com/hc/en-us/articles/21334461140375-Using-Apps-on-Discord

特定Botの全権限が正当だとは本文は主張していない。提供者別の実行成功を残件にしない。

## discord-bot-not-responding-1

/discord/bot-not-responding

2項目 / 文書残件 1。実機操作は未実施で別枠。

### discord-bot-not-responding-1-c1 — 既比較

応答エラーは権限不足のみを意味しない

本文対応: 「アプリケーションが応答しませんでした」などは、必要な応答が得られなかった表示で、権限不足だけを意味しない。STEP 2の比較と提供者の稼働情報を確認する。

根拠: https://docs.discord.com/developers/interactions/receiving-and-responding

3秒以内の初回応答という別条件がある。本文は秒数を断定しておらず期限全体を残す必要なし。

### discord-bot-not-responding-1-c2 — 特定文言の根拠不足

interaction応答と通常投稿で条件が異なる

本文対応: スラッシュコマンドへの応答と通常のメッセージ投稿では動作条件が異なるため、送信権限を付ければすべて直るとは考えない。Bot独自の許可チャンネル設定もあれば確認する。

根拠: https://docs.discord.com/developers/interactions/receiving-and-responding

callback方式は確認済みだが、具体的な権限差の文書対応はまだ不足。通常SEND_MESSAGESの資料だけで完了にしない。

## discord-bot-remove-1

/discord/bot-remove

5項目 / 文書残件 0。実機操作は未実施で別枠。

### discord-bot-remove-1-c1 — 既比較

Webhook一覧で作成者・投稿先を確認する

本文対応: 「サーバー設定」→「連携サービス」→Webhookの一覧を開く。投稿先チャンネル、作成者、作成日時を照合し、同じ名前だけで削除対象を決めない。

根拠: https://support.discord.com/hc/en-us/articles/360045093012-Server-Integrations-Page

前バッチで本文比較済み。再計上しない。

### discord-bot-remove-1-c2 — 既比較

チャンネルフォローも別の投稿経路

本文対応: 最初にBotの担当機能と必要な設定を保存し、追加先を確認します。サーバーのBotはキックまたは連携サービスから削除、自分のアプリはユーザー設定の認証済みアプリから解除します。削除後の新しい投稿は、Webhook・チャンネルフォロー・他の利用者のアプリも確認してください。

根拠: https://support.discord.com/hc/en-us/articles/360045093012-Server-Integrations-Page

既に編集・削除可能な別経路として照合済み。

### discord-bot-remove-1-c3 — 今回比較

削除したWebhookは新規URLを通知元へ設定し直す

本文対応: 外部サービスの通知と一致したら、その送信設定を止める。不要と確認できたWebhookは対象だけ削除する。再作成時は新しいURLを外部サービス側へ設定し直す必要がある。

根拠: https://docs.discord.com/developers/resources/webhook

Createは新規オブジェクト、Deleteはpermanently。再作成を旧URLの復元としない案内に整合。

### discord-bot-remove-1-c4 — 既比較

キックは権限とロール階層も必要

本文対応: 削除項目がない場合はサーバー所有者へ依頼する。アプリ管理の権限に加え、メンバーのキックでは権限とロールの上下関係も確認対象になる。

根拠: https://docs.discord.com/developers/topics/permissions

前バッチで同位・上位をキックできない条件を照合済み。

### discord-bot-remove-1-c5 — 既比較

個人追加アプリは認証済みアプリから解除

本文対応: 歯車アイコンからユーザー設定を開き、「認証済みアプリ／Authorized Apps」で対象アプリを選び、認証解除を実行します。表示名は言語やバージョンにより異なる場合があります。

根拠: https://support.discord.com/hc/en-us/articles/24160905919511-My-Discord-Account-was-Hacked-or-Compromised

前バッチのDiscord侵害対応資料でPC・モバイル解除を比較済み。

## discord-echo-double-voice-1

/discord/echo-double-voice

3項目 / 文書残件 1。実機操作は未実施で別枠。

### discord-echo-double-voice-1-c1 — 特定文言の根拠不足

Runからmmsys.cplで録音プロパティを開く

本文対応: Windows＋Rを押し「mmsys.cpl」と入力してサウンド画面を開く。「録音」タブ → 使用中のマイク →「プロパティ」を開く

根拠: https://support.focusrite.com/hc/de/articles/206849219-Latency-while-using-Direct-Monitor

Focusriteは別入口で聴くタブまで案内。コマンド入口自体の根拠をまだ対応付けていない。

### discord-echo-double-voice-1-c2 — 編集・適用範囲

機種の説明書に沿って監視機能を比較する

本文対応: 項目がない、または変化しない場合は、ヘッドセットの専用アプリやオーディオインターフェースの「サイドトーン」「Direct Monitor」などを確認する。機器の説明書に沿って一時的にオフにし比較する

根拠: https://support.focusrite.com/hc/de/articles/206849219-Latency-while-using-Direct-Monitor

特定ヘッドセットの項目名・操作成功の断定はない。機種全部の資料収集は不要。

### discord-echo-double-voice-1-c3 — 編集・適用範囲

仮想入力を外して物理マイクと比較する

本文対応: AさんはDiscordの「音声・ビデオ」で現在の入力デバイス名を控え、仮想ケーブルやミキサーではなく物理マイクを直接選ぶ。OBS・ボイスチェンジャーなども終了し、同じ言葉で再比較する

根拠: 対応する一次資料の箇所を未特定

仮想ミキサー個別配線の断定はなく、一条件ずつ比べる編集手順。実アプリ配線を文書残件にしない。

## discord-slow-performance-1

/discord/slow-performance

2項目 / 文書残件 1。実機操作は未実施で別枠。

### discord-slow-performance-1-c1 — 既比較

タスクマネージャーでCPU等を確認する

本文対応: 2. CPU・メモリ・GPU・ディスクの結果から次の操作を選ぶ

根拠: https://support.microsoft.com/ja-jp/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows

既に比較済み。全PC負荷の再現は実機枠へ。

### discord-slow-performance-1-c2 — 比較未完了

リンク先のキャッシュ退避手順で比較する

本文対応: アプリだけ重い状態が続くなら、関連記事「Discordが起動しない」のキャッシュ退避手順を使って比較する。再インストールはその後にし、メール・パスワード・二要素認証を確認してから行う

根拠: 対応する一次資料の箇所を未特定

このページは退避対象を直接断定しない。リンク先Discord起動不良記事の対象フォルダー・戻し方が未比較。

## discord-notifications-not-working-1

/discord/notifications-not-working

1項目 / 文書残件 1。実機操作は未実施で別枠。

### discord-notifications-not-working-1-c1 — 本文取得不能

DMミュートの解除操作

本文対応: 1. DMだけ届かないなら、会話ごとのミュートと「無視」を調べる

根拠: https://support.discord.com/hc/en-us/articles/223657667

公式223657667本文取得不能を維持。DM/グループDMの適用差も未解決。

## discord-recommended-bots-1

/discord/recommended-bots

4項目 / 文書残件 4。実機操作は未実施で別枠。

### discord-recommended-bots-1-c1 — 本文取得不能

DynoのModulesからAutomodを開く

本文対応: Dynoを追加し、dyno.gg/accountで対象サーバーを選ぶ。「Modules」→「Automod」の設定を開く。使わない管理機能は一度に有効にしない。

根拠: https://docs.dyno.gg/en/modules/automod

本文取得不能。画面経路を確認できていない。

### discord-recommended-bots-1-c2 — 本文取得不能

Dyno完全一致の禁止語とWarn処理

本文対応: 最初はBanned Words（exact／完全一致）でテスト語「gemnao_test_123」を設定し、Warnなど警告の処理から試す。自動BAN・キック・長時間のタイムアウトをテストには選ばない。

根拠: https://docs.dyno.gg/en/modules/automod

本文取得不能。exactとWarnの組合せが未比較。

### discord-recommended-bots-1-c3 — 本文取得不能

Dynoの免除ロール・チャンネル

本文対応: 一般メンバーにテスト語を1回投稿してもらい、警告やログを確認する。免除ロール・免除チャンネルでは検出されない場合があるため、管理者の投稿だけで合否を決めない。確認後はテスト語を外し、必要なルールを1つずつ追加する。

根拠: https://docs.dyno.gg/en/modules/automod

本文取得不能。設定条件が未比較。

### discord-recommended-bots-1-c4 — 本文取得不能

Dyno無料で始められる機能範囲

本文対応: 無料で始める候補は、基本の日程調整ならsesh、通常のゲーム別ロール選択ならCarl-bot、管理・荒らし対策ならDynoです。定期イベントや設定上限の拡張などは有料になる場合があります。Ticket Toolは必要なパネル機能と上限を設定画面で確認してください。契約前に、使いたい機能のPremium表示を確認します。

根拠: https://docs.dyno.gg/en/premium

今回Premium資料もCopied to clipboardのみ。Automod本文とは別URL。

## discord-recommended-bots-2

/discord/recommended-bots

5項目 / 文書残件 2。実機操作は未実施で別枠。

### discord-recommended-bots-2-c1 — 特定文言の根拠不足

Carl DashboardのReaction Roles設定入口

本文対応: carl.ggでログインし対象サーバーを選び、Reaction Roles（リアクションロール）の作成画面を開く。投稿先を「#ゲーム選択」にし、説明文と絵文字・ロールの組み合わせを登録する。メニュー表記が違う場合は公式マニュアルのReaction Rolesを参照する。

根拠: https://carl.gg/about

aboutは概説のみ。GitHubのコマンド資料だけでDashboard現行画面は確認できない。

### discord-recommended-bots-2-c2 — 特定文言の根拠不足

Carl等の設定上限拡張の有料境界

本文対応: 無料で始める候補は、基本の日程調整ならsesh、通常のゲーム別ロール選択ならCarl-bot、管理・荒らし対策ならDynoです。定期イベントや設定上限の拡張などは有料になる場合があります。Ticket Toolは必要なパネル機能と上限を設定画面で確認してください。契約前に、使いたい機能のPremium表示を確認します。

根拠: https://carl.gg/about

本文は数値上限を挙げていない。料金境界の一次資料不足。

### discord-recommended-bots-2-c3 — 既比較

sesh繰り返し開催のPremium境界

本文対応: 無料で始める候補は、基本の日程調整ならsesh、通常のゲーム別ロール選択ならCarl-bot、管理・荒らし対策ならDynoです。定期イベントや設定上限の拡張などは有料になる場合があります。Ticket Toolは必要なパネル機能と上限を設定画面で確認してください。契約前に、使いたい機能のPremium表示を確認します。

根拠: https://sesh.fyi/

前バッチで比較済み。契約やBot実行は別枠。

### discord-recommended-bots-2-c4 — 既比較

Ticket Tool担当者ロールの権限対象

本文対応: Dashboardで対象サーバーの「Manage」→「Panel Configs」を開き、「Create Panel」または「＋」でパネルを作る。General OptionsのSupport Team Rolesに対応者ロールを登録し、作成先カテゴリの権限も確認する。

根拠: https://docs.tickettool.xyz/dashboard/panel-configs/permission-options.md

前バッチでSupport Team/User/Everyoneと必要権限の条件を比較済み。

### discord-recommended-bots-2-c5 — 編集・適用範囲

Ticket Tool作成先カテゴリの権限を確認する

本文対応: Dashboardで対象サーバーの「Manage」→「Panel Configs」を開き、「Create Panel」または「＋」でパネルを作る。General OptionsのSupport Team Rolesに対応者ロールを登録し、作成先カテゴリの権限も確認する。

根拠: https://docs.tickettool.xyz/dashboard/panel-configs/permission-options.md

カテゴリの具体的ボタン位置は断定していない。公開前の相談者/第三者別比較は実操作枠。

## guide-gpu-driver-update-1

/guide/gpu-driver-update

3項目 / 文書残件 1。実機操作は未実施で別枠。

### guide-gpu-driver-update-1-c1 — 既比較

dxdiagでGPU・ドライバー情報を確認

本文対応: 対象GPUを右クリック→「プロパティ」→「ドライバー」で「ドライバーのバージョン」「日付」を記録する。Windows＋R→dxdiag→「ディスプレイ」または「レンダー」も確認できるが、複数GPUでは対象名を取り違えない。

根拠: https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/

資料にDisplayタブの情報あり。Win+R入口/Renderタブは下の別検査項目。

### guide-gpu-driver-update-1-c2 — 特定文言の根拠不足

複数GPUのRenderタブ表示

本文対応: 対象GPUを右クリック→「プロパティ」→「ドライバー」で「ドライバーのバージョン」「日付」を記録する。Windows＋R→dxdiag→「ディスプレイ」または「レンダー」も確認できるが、複数GPUでは対象名を取り違えない。

根拠: https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/

現在の参照資料はDisplayのみ。Render名の根拠を未対応付け。

### guide-gpu-driver-update-1-c3 — 編集・適用範囲

OEM適合版と再導入結果を確認する

本文対応: メーカー別の入口

根拠: 対応する一次資料の箇所を未特定

各OEM製品の対応成功を断定せず製造元確認へ誘導。機種別実測を文書残件にしない。

## guide-pc-game-crash-1

/guide/pc-game-crash

4項目 / 文書残件 2。実機操作は未実施で別枠。

### guide-pc-game-crash-1-c1 — 既比較

障害モジュール名だけでは根因を確定できない

本文対応: 例：同時刻にGame.exeの停止が記録され、ゲームだけ閉じたなら、そのゲームの更新・MOD・保存データを優先して調べます。KERNELBASE.dllなどのモジュール名は原因の確定やDLL交換の指示ではありません。複数ゲームが落ちる、Windowsも停止する場合はPC側も調べます。

根拠: https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-application-service-crashing-behavior

既にkernelbaseが他の破損の被害側となる説明と照合済み。

### guide-pc-game-crash-1-c2 — 元報告の来歴不足

10月3日のSteam拡張停止でプレイできた1件の来歴

本文対応: 2026年10月3日（日本時間）、Steam版モンハンワイルズがタイトル前に落ちる環境で、 Steamクライアントの外部拡張を一時停止した後に「プレイできた」との報告が1件ありました。 OBS終了・SteamオーバーレイOFF・ゲームの整合性確認・管理者実行OFFの確認・GPUドライバー更新と再起動だけでは改善せず、 SteamプロセスにSteam直下の追加DLLが読み込まれていることを確認してから切り分けています。

根拠: 対応する一次資料の箇所を未特定

既存本文以外の一次の報告記録を今回参照できていない。公開資料で内部報告の真偽は証明できない。実ユーザー記録はアクセスしない。

### guide-pc-game-crash-1-c3 — 編集・適用範囲

ゲーム固有のMODやセーブ条件

本文対応: まず「ゲームだけ閉じた／PCが再起動した」を分け、落ちた時刻とタイミングを記録します。起動直後はMOD・オーバーレイ、ロード中はセーブを保全してファイルと特定場面、長時間後はメモリ・VRAM・温度の変化を優先して確認。エラー表示がなくても信頼性履歴とイベントビューアーで同時刻のゲーム名を照合し、変更は1項目ずつ試してください。

根拠: 対応する一次資料の箇所を未特定

個別ゲームの互換性成功は断定していない。問題に応じて確認する分岐を全ゲーム検証に膨らませない。

### guide-pc-game-crash-1-c4 — 本文取得不能

Steam整合性の手順

本文対応: セーブ・エリアのロード中	特定のセーブ・場面だけか、別スロットや新規ゲームでも起きるか	セーブをコピー。別スロットも落ちるならSteamの整合性確認。特定データだけなら消さずにゲームのサポートへ

根拠: https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB

前バッチから本文取得不能。

## guide-pc-game-freezes-1

/guide/pc-game-freezes

7項目 / 文書残件 4。実機操作は未実施で別枠。

### guide-pc-game-freezes-1-c1 — 既比較

AMD Metrics記録ショートカットと温度欄

本文対応: 対応環境のAMD Softwareでも、アプリ内検索で「Metrics」→「Performance Metrics」を開き、CPU TemperatureやGPU Current Temperatureを確認できます。初期設定ではCtrl＋Shift＋Lで記録の開始・終了ができます。項目が出ない環境では利用できません。GPU Junction Temperatureは別の測定点なので、通常のGPU温度と同列に比べません。

根拠: https://www.amd.com/en/resources/support-articles/faqs/DH3-038.html

前バッチ比較済み。キー変更可能性は実機でなく資料条件。

### guide-pc-game-freezes-1-c2 — 特定文言の根拠不足

HWiNFOのSensors-only→Start/Run

本文対応: メーカー付属の監視ソフトがあるなら先に使います。ない場合はHWiNFO公式から入手し、起動時に「Sensors-only」を選んで「Start」または「Run」でセンサー画面を開きます。版によって表示名は異なります。

根拠: https://www.hwinfo.com/about-software/

aboutに監視機能はあるが具体的な起動UIの裏付けなし。別公式操作資料が必要。

### guide-pc-game-freezes-1-c3 — 特定文言の根拠不足

HWiNFOのCPU Package/Tctl/Tdie欄

本文対応: CPUの欄で「CPU Package」や「CPU (Tctl/Tdie)」などの温度項目を探します。表示されるセンサー名はCPUによって異なります。

根拠: https://www.hwinfo.com/about-software/

監視できることと特定センサー表示名は別。対応資料未確保。

### guide-pc-game-freezes-1-c4 — 特定文言の根拠不足

Task ManagerではCPU温度を調べられない

本文対応: 「パフォーマンス」→使用中の「GPU」で温度表示を確認します。対応するGPU・ドライバーでのみ表示されます。温度がないこと自体は故障ではありません。また、ここでCPU温度を調べることはできません。

根拠: https://blogs.windows.com/windows-insider/2019/08/16/announcing-windows-10-insider-preview-build-18963/

公式GPU温度追加資料はCPU温度非対応を明示していない。否定の根拠が不足。

### guide-pc-game-freezes-1-c5 — 既比較

Task Manager温度は対応GPU/ドライバー依存

本文対応: 「パフォーマンス」→使用中の「GPU」で温度表示を確認します。対応するGPU・ドライバーでのみ表示されます。温度がないこと自体は故障ではありません。また、ここでCPU温度を調べることはできません。

根拠: https://blogs.windows.com/windows-insider/2019/08/16/announcing-windows-10-insider-preview-build-18963/

既に専用GPUとWDDM条件を比較済み。

### guide-pc-game-freezes-1-c6 — 編集・適用範囲

強制電源断を機種別手順に委ねる

本文対応: マウスも操作できず、Ctrl＋Alt＋Deleteにも反応しない	PC全体・画面表示・入力機器の問題が候補	通常操作で復旧しない場合は機種の手順で終了。再起動後に履歴を確認し、繰り返すならメーカー診断

根拠: 対応する一次資料の箇所を未特定

一律の長押し秒数を断定していない。実機で強制断しないことは文書残件ではない。

### guide-pc-game-freezes-1-c7 — 本文取得不能

Steam整合性手順

本文対応: Alt＋Tabで他アプリに切り替えられ、操作もできる	ゲーム側の停止を優先して調べる	進捗を確認し、戻らなければ対象ゲームだけ終了。整合性・MOD・メモリを比較

根拠: https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB

既存の本文取得不能。

## guide-ray-tracing-gpu-1

/guide/ray-tracing-gpu

7項目 / 文書残件 4。実機操作は未実施で別枠。

### guide-ray-tracing-gpu-1-c1 — 特定文言の根拠不足

RTX各世代の専用RT機能

本文対応: NVIDIA：GeForce RTX（RTX 20・30・40・50シリーズ）は対応。GeForce GTX（GTX 10・16シリーズなど）は非対応

根拠: https://www.nvidia.com/en-us/geforce/news/geforce-gtx-dxr-ray-tracing-available-now/

20/30の文書比較は済み。40/50まで一つの古い記事で証明しない。追加一次仕様が必要。

### guide-ray-tracing-gpu-1-c2 — 特定文言の根拠不足

RX5000以前がハードウェアRT非対応

本文対応: タスクマネージャーの「パフォーマンス」→「GPU」でGPU名を確認します。NVIDIAはGeForce RTXシリーズ（RTX 20シリーズ以降）、AMDはRadeon RX 6000シリーズ以降が、ハードウェアのレイトレーシング機能を備えています。GTX 10／16シリーズやRadeon RX 5000シリーズ以前は非対応で、ゲーム側の設定では解決できません。

根拠: https://www.amd.com/en/products/graphics/desktops/radeon/6000-series.html

RX6000の加速機能は確認済み。過去全世代の否定を同じページで証明しない。

### guide-ray-tracing-gpu-1-c3 — 既比較

GPUエンジン列で実行GPUを確認

本文対応: ゲームを起動したままタスクマネージャーの「プロセス」タブで、「GPUエンジン」列にどのGPUが使われているか見る（列がなければ見出しを右クリックして追加）

根拠: https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/

最も使用するGPU/エンジン列の意味は比較済み。

### guide-ray-tracing-gpu-1-c4 — 比較未完了

GPU列を見出し右クリックから追加

本文対応: ゲームを起動したままタスクマネージャーの「プロセス」タブで、「GPUエンジン」列にどのGPUが使われているか見る（列がなければ見出しを右クリックして追加）

根拠: https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/

表示の意味と現行追加操作は別。記事の現行UI資料照合が残る。

### guide-ray-tracing-gpu-1-c5 — 今回比較

Windowsのゲーム別GPU指定操作

本文対応: Windowsの「設定」→「システム」→「ディスプレイ」→「グラフィック」で、ゲームを「高パフォーマンス」のGPUに設定する

根拠: https://support.microsoft.com/en-us/windows/hardware/display-graphics/optimizations-for-windowed-games-in-windows-11

Microsoft公式143–161行のSystem→Display→Graphics→Options→High performanceをSTEP3と比較。一致。

### guide-ray-tracing-gpu-1-c6 — 既比較

エースコンバット8の10月発売

本文対応: エースコンバット8とGears of War: E-Dayです。一覧は「2026年10月発売の新作PCゲーム 動作環境まとめ」で確認できます。

根拠: https://acecombat.jp/ace8news/?p=27

第2バッチace-releaseで10月2日告知本文を比較済み。第5バッチの未確認への逆戻りは台帳の誤り。

### guide-ray-tracing-gpu-1-c7 — 本文取得不能

Gears E-Dayの10月発売・RT必須

本文対応: エースコンバット8とGears of War: E-Dayです。一覧は「2026年10月発売の新作PCゲーム 動作環境まとめ」で確認できます。

根拠: https://store.steampowered.com/app/3010850/

Steam年齢確認で本文未取得。発売日と要件は別属性だが同じ取得不能に依存。

## guide-remove-mods-safely-1

/guide/remove-mods-safely

4項目 / 文書残件 2。実機操作は未実施で別枠。

### guide-remove-mods-safely-1-c1 — 既比較

MO2の仮想配置と起動経路の区別

本文対応: Vortex等の管理ツールなら対象ゲームの管理画面で疑わしいMODを無効化し、必要に応じ「Deploy Mods」等の反映を完了。Vortexの「Purge Mods」を使う場合はツールが配置したリンクをまとめて外す操作であり、手動導入分は対象外。MOD一覧を削除する操作とは区別する。MO2など仮想配置のツールでは対象プロファイルのMODを無効化し、そのツール経由で起動して比較する。

根拠: https://github.com/ModOrganizer2/usvfs

USVFSの対象プロセス限定を前バッチ比較済み。

### guide-remove-mods-safely-1-c2 — 比較未完了

MO2で対象プロファイルのMODを無効化

本文対応: Vortex等の管理ツールなら対象ゲームの管理画面で疑わしいMODを無効化し、必要に応じ「Deploy Mods」等の反映を完了。Vortexの「Purge Mods」を使う場合はツールが配置したリンクをまとめて外す操作であり、手動導入分は対象外。MOD一覧を削除する操作とは区別する。MO2など仮想配置のツールでは対象プロファイルのMODを無効化し、そのツール経由で起動して比較する。

根拠: 対応する一次資料の箇所を未特定

Profiles wiki URLは本文ではなく新規ページ作成フォームだった。書き込みはしていない。別の公式手順・ソースコードの対応箇所は未特定。

### guide-remove-mods-safely-1-c3 — 編集・適用範囲

MOD必須の既存セーブを上書きしない

本文対応: 普段と同じ方法でゲームを起動し、タイトル画面まで進むか記録する。セーブがMOD必須の場合は既存セーブを開いて上書きせず、必要ならゲームの許可する新規データで試す。外す前に比べて変化がなければ、追加物が残っていないか導入記録と照合する。

根拠: 対応する一次資料の箇所を未特定

ゲームごとの互換保証ではなく保全上の条件。全MOD実測は文書残件から除外。

### guide-remove-mods-safely-1-c4 — 本文取得不能

Steam修復は追加MOD全削除の証明ではない

本文対応: 本体ファイルの破損が疑われる時だけ、Steam「ライブラリ」→対象ゲームを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」を使う。Steamの修復だけで、後から追加したMODファイルがすべて消えるとは判断しない。

根拠: https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB

公式FAQ本文取得不能。Steam配布物の検証範囲の裏付けをまだ確保できない。

## guide-reshade-uninstall-1

/guide/reshade-uninstall

4項目 / 文書残件 0。実機操作は未実施で別枠。

### guide-reshade-uninstall-1-c1 — 既比較

ReShade製品名による識別

本文対応: 候補を右クリック→「プロパティ」→「詳細」で製品名・説明を確認する。

根拠: https://raw.githubusercontent.com/crosire/reshade/v6.8.0/setup/MainWindow.xaml.cs

v6.8.0のProductName識別処理を比較済み。

### guide-reshade-uninstall-1-c2 — 既比較

Vulkan/OpenXR共有登録をセットアップで解除

本文対応: ReShadeを消したい、導入後にゲームが起動しない人向け。公式セットアップでのアンインストール、dxgi.dllなどの識別、プリセットの保全、Vulkanの注意点、削除後の確認と復元まで説明します。

根拠: https://raw.githubusercontent.com/crosire/reshade/v6.8.0/setup/MainWindow.xaml.cs

共有登録と最終対象時の削除をソース比較済み。

### guide-reshade-uninstall-1-c3 — 既比較

設定とプリセットを先に退避

本文対応: ReShadeを消したい、導入後にゲームが起動しない人向け。公式セットアップでのアンインストール、dxgi.dllなどの識別、プリセットの保全、Vulkanの注意点、削除後の確認と復元まで説明します。

根拠: https://raw.githubusercontent.com/crosire/reshade/v6.8.0/setup/MainWindow.xaml.cs

設定削除とPresetPath参照は比較済み。成功率の実測不要。

### guide-reshade-uninstall-1-c4 — 編集・適用範囲

復元前に所有元を確認し上書きしない

本文対応: 手動退避した場合：ゲームを終了し、同名の新しいファイルがないか確認してから、退避したReShadeファイルを元のフォルダーへ戻します。同名のファイルがあれば上書きせず、所有元を確かめます。

根拠: 対応する一次資料の箇所を未特定

復元成功の保証ではなく編集上の保全手順。全DLL配置を実測しないことは文書残件にしない。

## guide-shader-cache-delete-1

/guide/shader-cache-delete

5項目 / 文書残件 1。実機操作は未実施で別枠。

### guide-shader-cache-delete-1-c1 — 既比較

Windows削除対象選択

本文対応: 3. 「削除するファイル」で他のチェックを外し、「DirectX シェーダー キャッシュ」だけを選択。「OK」→「ファイルの削除」で実行します。

根拠: https://community.intel.com/t5/Gaming-on-Intel-Processors-with/CS2-crashed-Failure-Exception-IP-Module-igd10umt64xe-DLL/m-p/1757369

Intel担当者のC:選択とDirectX項目、Microsoftチェック対象操作を比較済み。

### guide-shader-cache-delete-1-c2 — 比較未完了

Windows11設定→一時ファイル側の削除経路

本文対応: Windows 11の設定から開く場合は「設定」→「システム」→「ストレージ」→「一時ファイル」。一覧の読み込み後、同じ項目だけを選び「ファイルの削除」を押します。ダウンロードやごみ箱など、ほかの項目のチェックを必ず確認してください。

根拠: https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/free-up-drive-space-in-windows

Disk Cleanup経路の比較とは別。設定アプリの同項目選択をまだ本文に対応付けていない。

### guide-shader-cache-delete-1-c3 — 既比較

AMDリセット機能と23.9.1適用範囲

本文対応: AMD公式の説明はAdrenalin Edition 23.9.1のFull Installを基準としています。版・導入形態で画面が異なり、項目がない場合もあります。「工場出荷時にリセット」など、ソフト全体の初期化とは区別してください。

根拠: https://www.amd.com/en/resources/support-articles/faqs/dh3-012.html

古い資料の版条件を本文が明記。全現行構成の成功を残件にしない。

### guide-shader-cache-delete-1-c4 — 既比較

BO6のメインメニューで構築を待つ

本文対応: PC版を起動し、シェーダープリロードが進行中ならメインメニューから移動せず完了を待ちます。その後にプレイを開始します。Activisionは、メインメニューを離れるとプリロードが止まり、性能に影響すると説明しています。

根拠: https://support.activision.com/black-ops-6/articles/black-ops-6-pc-troubleshooting

前バッチ比較済み。

### guide-shader-cache-delete-1-c5 — 既比較

Fortnite初回マッチの再コンパイル

本文対応: Epic Gamesは、DirectX 12でシェーダーの再コンパイルが繰り返される症状についてキャッシュ削除を案内しています。同時に、削除後の最初のマッチは新しいシェーダーのコンパイルでカクつく可能性も説明しています。初回だけで失敗と決めず、その後の変化を確認する例です。

根拠: https://www.epicgames.com/help/c-34254770/c-38015632/a11302262

前バッチ比較済み。実FPS改善は別枠。

## guide-steam-disk-write-error-1

/guide/steam-disk-write-error

5項目 / 文書残件 2。実機操作は未実施で別枠。

### guide-steam-disk-write-error-1-c1 — 本文取得不能

Steamライブラリ修復操作

本文対応: Steamのインストール・更新で「ディスク書き込みエラー」が出る時は、対象ゲームの保存先ドライブを先に特定。空き容量を確認し、ライブラリ修復後の再試行結果から、整合性確認・競合調査・Windowsのドライブ点検へ進む条件を解説します。

根拠: https://help.steampowered.com/en/faqs/view/21F5-8D5D-0141-7A5E

FAQ本文取得不能。Windowsの検査とは別。

### guide-steam-disk-write-error-1-c2 — 比較未完了

Windowsドライブのツール→エラーチェック

本文対応: Windowsキー＋E→「このPC」→問題のドライブを右クリック→「プロパティ」→「ツール」→「エラーチェック」の「チェック」を開き、Windowsが表示する結果と修復指示を記録。システムドライブの修復を求められたら保存中の作業を終え、指示に従う。

根拠: 対応する一次資料の箇所を未特定

Windowsの空き容量資料ではこの操作を証明できない。公式GUI手順の追加照合が必要。

### guide-steam-disk-write-error-1-c3 — 既比較

ダウンロード量と必要ディスク領域の差

本文対応: Steamのダウンロード表示のサイズは書き込みに必要な領域と同じとは限らない。展開・更新用の一時領域も考え、対象ドライブに余裕がない時は不要なファイルを自分で確認して整理するか、Steamのストレージ管理で別の空きがあるドライブを選ぶ。

根拠: https://partner.steamgames.com/doc/sdk/uploading

SteamPipeの新版を旧版と並べる処理を比較済み。

### guide-steam-disk-write-error-1-c4 — 今回比較

このPCで保存先ドライブの空きを確認

本文対応: Windowsキー＋E→「このPC」で、先ほど確認したドライブ（例：D:）の空き容量を見る。新規インストールでは選択したインストール先を確認。Steam本体がC:にあってもゲームがD:ならD:の空きを優先し、必要に応じてC:も確認する。

根拠: https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/free-up-drive-space-in-windows

Microsoft公式135行のFile Explorer→This PC→Devices and drivesとSTEP1を直接比較。一致。

### guide-steam-disk-write-error-1-c5 — 既比較

隔離履歴を確認し無条件で許可しない

本文対応: ライブラリ修復後もそのゲームだけ失敗するなら、ゲームを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」を試し、再び更新・起動を確認する。隔離履歴がある場合は原因を確認し、保護機能をむやみに無効化しない。

根拠: https://support.microsoft.com/ja-jp/windows/security/windows-security/protection-history-in-the-windows-security-app

前バッチ比較済み。

## guide-steam-game-not-launching-1

/guide/steam-game-not-launching

7項目 / 文書残件 5。実機操作は未実施で別枠。

### guide-steam-game-not-launching-1-c1 — 本文取得不能

起動準備後のSteam公式対処順

本文対応: Steamゲームが起動しない時の対処法｜プレイを押しても起動しない・「起動準備を行っています」で止まる

根拠: https://help.steampowered.com/ja/faqs/view/5814-D9A3-BE42-62DF

本文取得不能。FAQへの帰属が未確認。

### guide-steam-game-not-launching-1-c2 — 本文取得不能

Radeonや一部ゲームの.NET更新要件

本文対応: Windows Updateでは、追加の更新プログラムに出てくる.NET Frameworkも入れる。Steam公式によると、AMD Radeonのドライバーや一部のゲームは.NET Frameworkのインストールと最新の状態を必要とする。

根拠: https://help.steampowered.com/ja/faqs/view/5814-D9A3-BE42-62DF

FAQ本文取得不能。現在の全Radeonへ拡張しない必要があるが編集は保留。

### guide-steam-game-not-launching-1-c3 — 本文取得不能

Steamと競合するソフトの対処

本文対応: 「起動準備を行っています」と出たあと何も起きない場合、Steam公式は、PCを再起動してから「Windowsを最新にする」「ドライバーを最新にする」「ゲームファイルの整合性を確認する」「Steamを妨害するソフトを止める」「システム要件を確認する」の順に試すよう案内している。

根拠: https://help.steampowered.com/ja/faqs/view/1F39-DCB4-FF28-5748

今回該当FAQも画像1行のみと判明。

### guide-steam-game-not-launching-1-c4 — 本文取得不能

実行ファイル不明時の整合性操作

本文対応: 「実行ファイルが見つかりません」	不足ファイル、Windowsセキュリティの保護履歴	ゲームファイルの整合性を確認し、同時刻の隔離も確認

根拠: https://help.steampowered.com/ja/faqs/view/3A2A-BF2D-15FF-7963

今回該当FAQも画像1行のみ。

### guide-steam-game-not-launching-1-c5 — 本文取得不能

既に実行中のエラー対処

本文対応: 一瞬「停止／実行中」になり「プレイ」に戻る	ゲームのプロセスと同時刻のWindows停止履歴	信頼性の履歴でゲームやランチャーの名前を照合

根拠: https://help.steampowered.com/ja/faqs/view/7CFE-6339-CEA8-DC13

今回該当FAQも画像1行のみ。

### guide-steam-game-not-launching-1-c6 — 今回比較

Steam購入の一部EAゲームにもEA appが必要

本文対応: 一部のEAゲームはSteam版でもEA appが必要です。対象ゲームのSteamストアの第三者DRM・外部アプリの条件を確認してください。ログインや認証で止まる場合は、そのランチャー名とエラー文を控えて公式ヘルプへ進み、原因が分からないままアカウント連携を解除しないでください。

根拠: https://help.ea.com/en/articles/platforms/download-and-play-ea-app-games/

公式How to play EA app games on Steamで外部DRM表示により判断する説明とFAQを比較。一致。

### guide-steam-game-not-launching-1-c7 — 既比較

隔離履歴の確認

本文対応: 「実行ファイルが見つかりません」や隔離の疑いがある場合は「Windows セキュリティ」→「ウイルスと脅威の防止」→「保護の履歴」で同時刻の項目を確認します。ファイル名と配布元を確かめずに復元・許可しないでください。

根拠: https://support.microsoft.com/ja-jp/windows/security/windows-security/protection-history-in-the-windows-security-app

前バッチ比較済み。

## guide-stutter-fix-1

/guide/stutter-fix

4項目 / 文書残件 1。実機操作は未実施で別枠。

### guide-stutter-fix-1-c1 — 今回比較

Fortniteフレーム上限の設定経路

本文対応: ロビー右上のプレイヤープロフィール→歯車の「設定」→映像の「フレームレート制限（Frame Rate Limit）」で値を選び、「適用」。ロビーには別のFPS制限があるため、効果はプレイ中に確認します。

根拠: https://www.epicgames.com/help/c-34254770/c-38015632/a17266354

Epicのプロフィール→設定→DisplayのV-Sync/Frame Rate Limit→Applyと比較。V-Sync制限とロビー判定の留保も一致。

### guide-stutter-fix-1-c2 — 本文取得不能

Steam性能モニターの現行UI

本文対応: 同じセーブ・練習場・同じカメラ方向を使い、約60秒で通れるルートを決めます。Steamでは「設定」→「ゲーム中（In Game）」のパフォーマンスオーバーレイから表示を設定できます。ゲーム内のFPS表示でも構いません。計測表示は1つにし、全比較で同じ表示を使います。

根拠: https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767

第5バッチの画像1行のみを維持。

### guide-stutter-fix-1-c3 — 既比較

AMD FRTCと全画面条件

本文対応: AMD：FRTCが表示される環境

根拠: https://www.amd.com/en/resources/support-articles/faqs/dh3-012.html

前バッチで版範囲と機能を比較済み。

### guide-stutter-fix-1-c4 — 既比較

WindowsのHz確認

本文対応: 数値は設定の考え方を示す仮例で、実測結果・全ゲーム共通の推奨値ではありません。90fpsが選べなければ利用できる近い低めの値で比較します。固定リフレッシュレートでは上限との組み合わせで動きが不均等になる場合があり、VRRも動作範囲内での確認が必要です。

根拠: https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/change-the-refresh-rate-on-your-monitor-in-windows

前バッチ比較済み。個別ゲームの効果測定は文書残件にしない。

## guide-verify-steam-files-1

/guide/verify-steam-files

3項目 / 文書残件 1。実機操作は未実施で別枠。

### guide-verify-steam-files-1-c1 — 本文取得不能

Steam整合性の現行UIと照合範囲

本文対応: ゲームとSteamの更新を終え、必要なセーブ・MODの記録を残してから「ライブラリ→ゲームのプロパティ→インストール済みファイル→ゲームファイルの整合性を確認」を実行します。再取得された場合はダウンロード完了後に同じ症状を比較し、変化がなければ起動条件・MOD・設定など別の原因を確認します。毎回再取得される場合は更新履歴・保存先ドライブ・セキュリティソフトの履歴を照合します。

根拠: https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB

本文取得不能。

### guide-verify-steam-files-1-c2 — 編集・適用範囲

ゲーム別MOD・セーブへの影響を確認

本文対応: Steam「ゲームファイルの整合性を確認」の操作と結果の読み方。再取得された／何も変わらない／毎回同じ症状が再発する場合に、ダウンロード画面と起動結果から次の対処を選びます。MOD・ワークショップ・セーブへの影響も説明します。

根拠: 対応する一次資料の箇所を未特定

記事は全ゲームの保存保証をしていない。個別ゲーム未実測を文書残件から除外。

### guide-verify-steam-files-1-c3 — 既比較

保護履歴で再隔離を確認

本文対応: ダウンロード失敗や書き込みエラーを伴う場合は、ゲームの保存先ドライブと空き領域・Steamのストレージ設定を確認します。セキュリティソフトがゲームファイルを隔離した履歴がないかも確認し、隔離ファイルを出所の確認なしに許可しないでください。MODを再適用した直後だけ再発するなら、そのMODの導入元・対応版を調べます。

根拠: https://support.microsoft.com/ja-jp/windows/security/windows-security/protection-history-in-the-windows-security-app

前バッチ比較済み。

## pc-bluetooth-option-missing-1

/pc/bluetooth-option-missing

4項目 / 文書残件 1。実機操作は未実施で別枠。

### pc-bluetooth-option-missing-1-c1 — 既比較

非表示デバイスと非接続機器

本文対応: 非表示にするとアダプターが現れる：過去に接続されていた機器の項目も含まれます。コード45なら現在接続されていない状態で、一覧に名前があるだけでは使用可能と判断できません。電源の入れ直しやUSB接続を比較します。

根拠: https://learn.microsoft.com/en-us/windows-hardware/drivers/install/viewing-hidden-devices

前バッチ比較済み。

### pc-bluetooth-option-missing-1-c2 — 既比較

Bluetooth検出を詳細設定へ変更

本文対応: 出ない場合は設定→Bluetoothとデバイス→デバイス→デバイスの設定にある「Bluetoothデバイスの検出」を確認する。デフォルトから詳細設定へ変更できる環境では切り替えて再検索。項目がなければ、この操作は飛ばして比較結果を確認する。

根拠: https://support.microsoft.com/ja-jp/windows/hardware/bluetooth/fix-bluetooth-problems-in-windows

前バッチ比較済み。

### pc-bluetooth-option-missing-1-c3 — 特定文言の根拠不足

ロールバック灰色は以前の版がない等

本文対応: 更新後だけ悪化し、アダプターが表示される場合はプロパティ→ドライバー→ドライバーを元に戻すが使えるか確認する。戻したら再起動して、スイッチ・アダプター・機器の接続を同じ条件で比較する。灰色なら以前の版が保存されていないなどの理由があり、その操作は使えない。

根拠: https://support.microsoft.com/ja-jp/windows/hardware/bluetooth/update-bluetooth-drivers-in-windows

資料は使用可能な場合とのみ記載。灰色の具体理由の根拠は未比較。

### pc-bluetooth-option-missing-1-c4 — 既比較

切断時の電源管理比較

本文対応: 起動直後・スリープ復帰・更新後のどれで再発するかを記録。アダプターが表示されるが切断を繰り返す場合は、Microsoftの切断専用案内へ。サービス再起動や電源管理の比較は対象を絞り、設定欄がない機種に無理に適用しない。

根拠: https://support.microsoft.com/ja-jp/windows/hardware/bluetooth/bluetooth-keeps-disconnecting-in-windows

前バッチ比較済み。欄のない機種へ強制しない条件もある。

## pc-disk-usage-100-1

/pc/disk-usage-100

6項目 / 文書残件 2。実機操作は未実施で別枠。

### pc-disk-usage-100-1-c1 — 本文取得不能

100%は忙しい時間割合で転送速度と別

本文対応: 使用率100％＝最大の転送速度とは限らない：「アクティブな時間」は処理で忙しい時間の割合、「読み取り／書き込み速度」は1秒に転送したデータ量です。細かな読み書きや応答待ちでも、速度が小さいまま100％になることがあります。MB/sだけで故障とは判断しません。

根拠: https://techcommunity.microsoft.com/blog/askperf/windows-8--windows-server-2012-the-new-task-manager/375149

基礎定義の出典が本文0行。NECの対処ページだけでは定義を証明できない。

### pc-disk-usage-100-1-c2 — 特定文言の根拠不足

リソースモニターでディスク詳細を見る

本文対応: 同じ画面で「メモリ」と「CPU」も見る。上位がSystemで読み書き先が分からなければ、Windowsキー＋R→resmon→「ディスク」を開き、「ディスク活動」のイメージ名・ファイルのパス・合計（B/秒）を照合する。SystemはWindowsの処理を含むため終了しない。

根拠: https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows

今回取得したシステム構成ツール本文に該当操作を見つけられない。取得成功だけで支持にしない。

### pc-disk-usage-100-1-c3 — 今回比較

検索対象フォルダーの除外操作

本文対応: 検索に使わない大量のファイルがあるフォルダーだけが対象なら、「除外フォルダーを追加する」でそのフォルダーを指定する。項目が見つからない場合は「詳細インデックス オプション」→「変更」で対象の場所を確認する。除外した場所は検索結果の範囲が変わる。作成中の高負荷だけを理由にインデックスを再構築しない。

根拠: https://learn.microsoft.com/ja-jp/troubleshoot/windows-client/shell-experience/windows-search-performance-issues

公式89–93行の除外追加/詳細設定→変更と本文STEP5を直接比較。一致。

### pc-disk-usage-100-1-c4 — 既比較

Disk153は再試行で故障確定ではない

本文対応: Windowsキー＋R→eventvwr.msc→Windowsログ→システムを開き、固まった時刻の前後を見る。Disk・ストレージ関連のイベントがあれば、ソース・イベントID・「全般」の文言を控える。例：DiskのID 153は読み書きの再試行を示すが、単独ではSSD故障と断定できない。繰り返しと症状の時刻を照合して相談する。

根拠: https://jpwinsup.github.io/blog/2022/08/05/Storage/Management/Disk153/

前バッチ比較済み。

### pc-disk-usage-100-1-c5 — 既比較

Steam更新時のディスクI/O

本文対応: Steamの場合は下部の「ダウンロード」から対象ゲームの進行とディスク使用量を見る。ネットワーク速度が下がっても、ダウンロード済みファイルの展開・適用でディスクを使う場合がある。他の作業と比較したい時はSteamの一時停止ボタンを使う。

根拠: https://partner.steamgames.com/doc/sdk/uploading

前バッチ比較済み。

### pc-disk-usage-100-1-c6 — 編集・適用範囲

SysMain一括停止を初手にしない

本文対応: このページは公式資料を基にした確認手順です。改善率や、すべてのPCに共通する正常な速度・応答時間は示していません。Systemの強制終了、ウイルス対策の停止、SysMain・Windows Searchの一括無効化、ページファイルの削除を最初の対処にしないでください。STEP 8の数値は比較方法を説明する仮想例です。

根拠: 対応する一次資料の箇所を未特定

必ず直るという因果主張ではなく原因未特定時の編集方針。SysMain全機種実測は不要。

## pc-pc-broken-1

/pc/pc-broken

5項目 / 文書残件 1。実機操作は未実施で別枠。

### pc-pc-broken-1-c1 — 既比較

NoPower/POST/Boot/Videoの区別

本文対応: ロゴは出るがWindowsが起動しない／自動修復を繰り返す	Windowsの回復画面と直前の更新。BitLocker回復キーと必要データを確認	STEP 4

根拠: https://www.dell.com/support/contents/ja-jp/article/product-support/self-support-knowledgebase/fix-common-issues/no-post

前バッチ比較済み。

### pc-pc-broken-1-c2 — 既比較

配線器具の異臭・発熱は中止

本文対応: 煙・焦げ臭さ・異常な発熱・液体の侵入・本体やバッテリーの膨らみがある場合は、起動確認や充電を中止する。安全にできる範囲で電源を切り、電源供給を止める。熱い・濡れている箇所に無理に触れない。

根拠: https://www.nite.go.jp/jiko/chuikanki/press/2024fy/prs241128.html

前バッチ比較済み。

### pc-pc-broken-1-c3 — 特定文言の根拠不足

膨張・液体侵入時の中止

本文対応: 膨張したバッテリーを押す・穴を開ける・無理に外すことはしない。電源ユニットやACアダプターも分解しない。発煙・火災など差し迫る危険がある場合は避難と消防への連絡を優先する。

根拠: https://www.dell.com/support/kbdoc/ja-jp/000124389/

Dell電源資料の本文取得済み。膨張バッテリーは修理・交換前の使用再開不可と対応するが、液体侵入時の具体的初動までこの資料で完了にしない。複合項目の一部支持。

### pc-pc-broken-1-c4 — 今回比較

停止コードを記録し再発と変更を比べる

本文対応: Windowsは使えるが、突然落ちる・停止コードが出る	PC全体かアプリだけか、停止コード・日時・新しい機器・更新を記録	STEP 5

根拠: https://support.microsoft.com/ja-jp/windows/experience/performance-optimization/troubleshooting-windows-unexpected-restarts-and-stop-code-errors

ハードウェア・ドライバー・ソフトの可能性とコード表示を本文と比較。部品故障の断定なし。

### pc-pc-broken-1-c5 — 今回比較

回復前のデータ保全とBitLockerキー

本文対応: 4. Windowsが起動しない場合は、データと回復キーを先に確認する

根拠: https://support.microsoft.com/ja-jp/windows/experience/backup-recovery/recovery-options-in-windows

公式127/169行のデータ喪失可能性とWinREのキー条件をSTEP4と比較。

## pc-pc-hacked-signs-1

/pc/pc-hacked-signs

7項目 / 文書残件 2。実機操作は未実施で別枠。

### pc-pc-hacked-signs-1-c1 — 既比較

遠隔操作後の復元と組織調査の留保

本文対応: IPAはサポート詐欺で遠隔操作された場合にシステムの復元、実行できない場合に初期化を案内している。復元や初期化はデータ・アプリ・証拠に影響するため、公式手順とメーカーで方法を確認し、会社PCは調査前に実施しない。

根拠: https://www.ipa.go.jp/security/anshin/attention/2024/mgdayori20241119.html

前バッチ比較済み。

### pc-pc-hacked-signs-1-c2 — 既比較

全体サインアウトの時間とXbox除外

本文対応: サービスが提供する全端末からのサインアウト／セッション解除も行う。Microsoftの全体サインアウトは反映まで最大24時間で、Xbox本体は対象外。ログインできない場合は公式のアカウント回復窓口を使う。

根拠: https://support.microsoft.com/ja-jp/accounts-billing/manage/how-to-sign-out-of-your-microsoft-account-everywhere

前バッチ比較済み。

### pc-pc-hacked-signs-1-c3 — 既比較

履歴の位置だけで不正と確定しない

本文対応: Microsoftアカウントは公式アカウント画面→セキュリティ→サインインのアクティビティを確認。日時・成功か失敗か・端末・操作内容を自分の利用と照合する。場所の表示だけで不正と確定しない。

根拠: https://support.microsoft.com/ja-jp/accounts-billing/security/what-is-the-recent-activity-page

前バッチ比較済み。

### pc-pc-hacked-signs-1-c4 — 今回比較

Offlineの画面操作・再起動・履歴

本文対応: 必要に応じて「Microsoft Defender オフライン スキャン」を選択する。再起動するため作業を保存し、BitLockerを使う場合は回復キーの入手方法を事前に確認する。再起動後、Windows セキュリティ→保護の履歴で結果を確認する。

根拠: https://learn.microsoft.com/ja-jp/defender-endpoint/microsoft-defender-offline

公式131–151/218行をSTEP6と比較。操作と結果確認は支持。

### pc-pc-hacked-signs-1-c5 — 条件記述差

Offline前のBitLocker条件

本文対応: 必要に応じて「Microsoft Defender オフライン スキャン」を選択する。再起動するため作業を保存し、BitLockerを使う場合は回復キーの入手方法を事前に確認する。再起動後、Windows セキュリティ→保護の履歴で結果を確認する。

根拠: https://learn.microsoft.com/ja-jp/defender-endpoint/microsoft-defender-offline

公式70行は保護の一時停止も案内。本文はキー入手確認のみで条件説明が不十分。修正候補として保留、未編集。

### pc-pc-hacked-signs-1-c6 — 今回比較

復旧先・転送・接続アプリを確認

本文対応: 身に覚えのない成功したログイン・変更・送信がある場合は、サービスの公式復旧手順に従い、使い回していないパスワードへ変更。復旧メール・電話番号・多要素認証の設定も確認する。メールの転送設定や接続アプリに知らないものがないか確認する。

根拠: https://support.microsoft.com/en-us/accounts-billing/manage/how-to-recover-a-hacked-or-compromised-microsoft-account

公式復旧案内のパスワード再設定と転送/接続確認をSTEP2と比較。本文は安全な別端末を使う限定あり。

### pc-pc-hacked-signs-1-c7 — 特定文言の根拠不足

身代金・暗号化ファイル・外部機器の初動

本文対応: 暗号化や身代金要求がある場合は外付け保存機器も切り離す。復元可能なバックアップを保護し、身代金の支払い・暗号化ファイルの削除・復号ツールの実行を自己判断で急がない。警察・専門窓口へ状況を伝える。

根拠: https://www.ipa.go.jp/security/anshin/measures/ransom_tokusetsu.html

特設トップは入口資料。具体行動を支えるリンク先資料を未比較。取得成功を実質照合としない。

## pc-second-monitor-not-detected-1

/pc/second-monitor-not-detected

4項目 / 文書残件 1。実機操作は未実施で別枠。

### pc-second-monitor-not-detected-1-c1 — 既比較

ディスプレイの検出ボタン

本文対応: Windowsが2台目を検出しない場合と、検出しているのにモニターが黒い場合で最初の操作が変わります。PC本体の画面が操作できる状態を対象にします。

根拠: https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/how-to-use-multiple-monitors-in-windows

前バッチ比較済み。

### pc-second-monitor-not-detected-1-c2 — 既比較

GPU確認とドライバー更新の分岐

本文対応: スタートで「デバイス マネージャー」を検索→「ディスプレイ アダプター」→使っているGPUを右クリック→プロパティ→「ドライバー」。版と日付を控える。

根拠: https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/

表示の意味は比較済み。全GPUの成功は別枠。

### pc-second-monitor-not-detected-1-c3 — 既比較

USB-Cの製品仕様による映像対応確認

本文対応: 可能ならモニターを別PCにつないで表示を比較。USB-C経由ならPCポート・ケーブル・ドックが映像出力に対応するか製品仕様を確認する。

根拠: https://support.microsoft.com/ja-jp/windows/hardware/fix-usb-c-problems-in-windows

機器・ケーブル・ポート全体の対応条件を比較済み。具体機種の互換性保証はない。

### pc-second-monitor-not-detected-1-c4 — 特定文言の根拠不足

以前の版がある時だけロールバック

本文対応: 更新直後の不具合で以前の版が残っている時だけ「ドライバーを元に戻す」を検討し、再起動後に設定→ディスプレイで1・2があるか確認する。

根拠: https://support.microsoft.com/ja-jp/windows/hardware/bluetooth/update-bluetooth-drivers-in-windows

別デバイス資料の使用可能条件だけではGPU保存条件を証明できない。GPU一次資料に対応付け必要。

## pc-wifi-connected-no-internet-1

/pc/wifi-connected-no-internet

6項目 / 文書残件 1。実機操作は未実施で別枠。

### pc-wifi-connected-no-internet-1-c1 — 既比較

169.254とDHCP取得失敗

本文対応: PCだけ「インターネットなし」、IPアドレスが169.254で始まる	Wi-Fi接続先、IPv4のアドレスと既定のゲートウェイ	STEP 5

根拠: https://support.microsoft.com/en-us/windows/experience/connectivity-networking/fix-wi-fi-connection-issues-in-windows

前バッチ比較済み。IPv6だけの通信成功を否定しない限定あり。

### pc-wifi-connected-no-internet-1-c2 — 既比較

ipconfigの限定適用とDNSキャッシュ

本文対応: IPv4とゲートウェイはあるが、このPCだけサイト名の解決エラーが出る時に限り「ipconfig /flushdns」を実行し、同じURLを再読み込みする。DNSサーバーが空欄・再取得に失敗・別のアプリもすべて開けない場合は、表示を控えてSTEP 6へ。手動で適当なDNSアドレスを入力しない。

根拠: https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig

前バッチ比較済み。

### pc-wifi-connected-no-internet-1-c3 — 既比較

プロキシ入口と組織設定の留保

本文対応: スタート→設定→ネットワークとインターネット→プロキシを開く。「セットアップ スクリプトを使用する」「プロキシ サーバーを使用する」の有無と元の状態を控える。自分で設定した不要なプロキシがオンなら一時的にオフにして同じ2サイトを再比較。職場・学校が指定した設定には触れず管理者に確認する。

根拠: https://support.microsoft.com/ja-jp/windows/experience/connectivity-networking/use-a-proxy-server-in-windows

前バッチ比較済み。

### pc-wifi-connected-no-internet-1-c4 — 既比較

Edge拡張のトグル操作

本文対応: PCのEdgeだけ失敗し、別ブラウザーは開けるなら、Edge右上「…」→「拡張機能」→「拡張機能の管理」で最近追加した拡張機能を1つだけオフ→同じURLを再読み込み。直らなければ元に戻す。ログイン画面や証明書の警告が出る場合は、警告を無視して進まずサイト運営者の案内を確認する。

根拠: https://support.microsoft.com/ja-jp/edge/add-turn-off-or-remove-extensions-in-microsoft-edge

前バッチ比較済み。

### pc-wifi-connected-no-internet-1-c5 — 既比較

Get Helpの公式英語検索語

本文対応: まだPCだけ開けなければ、スタートで「ヘルプを表示」を開き、検索欄に「ネットワーク」と入力して「ネットワーク診断の実行」を探す。見つからなければ公式ページに記載の「connect to network and internet」で検索する。提案と結果を控え、同じサイトを開く。IP・DNS関連の指摘が出たらSTEP 5へ。Wi-Fiボタン自体がない場合は関連記事の専用記事へ。

根拠: https://support.microsoft.com/ja-jp/support/get-help/windows-troubleshooters

前バッチ比較済み。

### pc-wifi-connected-no-internet-1-c6 — 特定文言の根拠不足

Get Help日本語の結果名

本文対応: まだPCだけ開けなければ、スタートで「ヘルプを表示」を開き、検索欄に「ネットワーク」と入力して「ネットワーク診断の実行」を探す。見つからなければ公式ページに記載の「connect to network and internet」で検索する。提案と結果を控え、同じサイトを開く。IP・DNS関連の指摘が出たらSTEP 5へ。Wi-Fiボタン自体がない場合は関連記事の専用記事へ。

根拠: https://support.microsoft.com/ja-jp/support/get-help/windows-troubleshooters

公式は英語検索語を示す。日本語検索の結果名は現資料にない。画面確認または断定しない編集が必要。

## pc-wifi-option-missing-1

/pc/wifi-option-missing

4項目 / 文書残件 1。実機操作は未実施で別枠。

### pc-wifi-option-missing-1-c1 — 既比較

WLAN AutoConfigの再起動

本文対応: スマホには見えるがPCには1件も出ない時は、Windowsキー＋R→services.msc→「WLAN AutoConfig」を開いて「状態」を確認。実行中なら右クリック→「再起動」、停止中なら「開始」を選び、接続先一覧をもう一度開く。開始に失敗したら表示されたエラーを控え、ほかのサービスを推測で変更しない。

根拠: https://support.microsoft.com/en-us/windows/experience/connectivity-networking/fix-wi-fi-connection-issues-in-windows

前バッチ比較済み。

### pc-wifi-option-missing-1-c2 — 特定文言の根拠不足

停止WlanSvcの開始操作

本文対応: スマホには見えるがPCには1件も出ない時は、Windowsキー＋R→services.msc→「WLAN AutoConfig」を開いて「状態」を確認。実行中なら右クリック→「再起動」、停止中なら「開始」を選び、接続先一覧をもう一度開く。開始に失敗したら表示されたエラーを控え、ほかのサービスを推測で変更しない。

根拠: https://learn.microsoft.com/ja-jp/troubleshoot/windows-client/networking/wireless-network-connectivity-issues-troubleshooting

起動が必要という状態条件は資料あり。services.mscの開始ボタン経路は未比較。

### pc-wifi-option-missing-1-c3 — 編集・適用範囲

ロールバック不可なら実行しない

本文対応: 無線アダプターが表示されており、更新直後から不調で「プロパティ→ドライバー→ドライバーを元に戻す」が押せる場合だけ、日付と版を控えて以前の版へ戻し、再起動して比べる。押せない、または機器自体がない場合は実行できない。機器が全く検出されなければ、適合ドライバーの確認結果をPCメーカーに伝え機器の点検を相談する。

根拠: 対応する一次資料の箇所を未特定

不可時に別の復旧先へ進む編集分岐。必ず復旧するという断定なし。

### pc-wifi-option-missing-1-c4 — 編集・適用範囲

無線チップ名と機種適合ドライバー

本文対応: 更新後から消えた、または警告がある場合は、PCのメーカー・型番とWindows 11対応状況を確認する。別端末や有線LANでPC／無線子機メーカー公式サイトから適合する無線LANドライバーを入手し、PCに保管してメーカーの導入手順に従う。導入後に再起動してSTEP 2の表示を再確認する。管理PCなら先に管理者へ確認する。

根拠: 対応する一次資料の箇所を未特定

特定チップ名の互換保証はない。ユーザー機種の識別を全機種の文書確認に膨らませない。
