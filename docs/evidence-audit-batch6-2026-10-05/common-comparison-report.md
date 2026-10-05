# 旧43項目の比較結果

supported=対象主張を一次本文と照合、corrected=条件記述差を修正、narrowed=未確認の具体説明を公式で確認できる範囲へ限定、deferred=比較材料を取得できず理由付き保留。全ページ検証完了を意味しない。

## discord-bot-add-1-c1 — narrowed

/discord/bot-add

スマホで招待リンクを使える場合がある

変更前の本文対応: 招待リンクなどから追加できる場合がありますが、Discord公式のApp Directoryはデスクトップ版・ブラウザ版で利用します。権限内容を確認しやすいため、管理作業はPC版を推奨します。

モバイルでの起動とインストール経路は同一ではない。未確認のスマホ招待可能性を削り、公式が記載するPCのApp Directoryと提供元確認に限定。

- https://support.discord.com/hc/en-us/articles/21334461140375-Using-Apps-on-Discord

## discord-bot-not-responding-1-c2 — supported

/discord/bot-not-responding

interaction応答と通常投稿で条件が異なる

変更前の本文対応: スラッシュコマンドへの応答と通常のメッセージ投稿では動作条件が異なるため、送信権限を付ければすべて直るとは考えない。Bot独自の許可チャンネル設定もあれば確認する。

本文は具体的な権限ビット差を断定していない。公式のinteraction専用callback・token・応答期限と、通常メッセージ投稿とは動作条件が異なるという限定主張を比較。特定Botの成功は保証していない。

- https://docs.discord.com/developers/interactions/receiving-and-responding

## discord-echo-double-voice-1-c1 — supported

/discord/echo-double-voice

Runからmmsys.cplで録音プロパティを開く

変更前の本文対応: Windows＋Rを押し「mmsys.cpl」と入力してサウンド画面を開く。「録音」タブ → 使用中のマイク →「プロパティ」を開く

MicrosoftのSound canonical項目がmmsys.cplを指定し、コントロールパネル実行資料がOpen欄からの起動を説明。Focusriteの録音デバイス→プロパティ手順と組み合わせて入口と操作対象を照合。現行Windows実機操作をしたとの意味ではない。

- https://learn.microsoft.com/en-us/windows/win32/shell/controlpanel-canonical-names
- https://support.microsoft.com/en-us/servicing/os/windows/2017/01/how-to-run-control-panel-tools-by-typing-a-command
- https://support.focusrite.com/hc/de/articles/206849219-Latency-while-using-Direct-Monitor

## discord-slow-performance-1-c2 — narrowed

/discord/slow-performance

リンク先のキャッシュ退避手順で比較する

変更前の本文対応: アプリだけ重い状態が続くなら、関連記事「Discordが起動しない」のキャッシュ退避手順を使って比較する。再インストールはその後にし、メール・パスワード・二要素認証を確認してから行う

リンク先STEP3を実読。公式が具体指定するCacheに絞り、Code Cache/GPUCacheへ拡張する追加操作を削除。名前変更と復元は削除を避ける編集手順として維持し、公式操作そのものとは扱わない。

- https://support.discord.com/hc/en-us/articles/31623498041623-Discord-Troubleshooting-Guide

## discord-notifications-not-working-1-c1 — deferred

/discord/notifications-not-working

DMミュートの解除操作

変更前の本文対応: 1. DMだけ届かないなら、会話ごとのミュートと「無視」を調べる

公式223657667本文取得不能を維持。DM/グループDMの適用差も未解決。

- https://support.discord.com/hc/en-us/articles/223657667

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## discord-recommended-bots-1-c1 — deferred

/discord/recommended-bots

DynoのModulesからAutomodを開く

変更前の本文対応: Dynoを追加し、dyno.gg/accountで対象サーバーを選ぶ。「Modules」→「Automod」の設定を開く。使わない管理機能は一度に有効にしない。

本文取得不能。画面経路を確認できていない。

- https://docs.dyno.gg/en/modules/automod

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## discord-recommended-bots-1-c2 — deferred

/discord/recommended-bots

Dyno完全一致の禁止語とWarn処理

変更前の本文対応: 最初はBanned Words（exact／完全一致）でテスト語「gemnao_test_123」を設定し、Warnなど警告の処理から試す。自動BAN・キック・長時間のタイムアウトをテストには選ばない。

本文取得不能。exactとWarnの組合せが未比較。

- https://docs.dyno.gg/en/modules/automod

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## discord-recommended-bots-1-c3 — deferred

/discord/recommended-bots

Dynoの免除ロール・チャンネル

変更前の本文対応: 一般メンバーにテスト語を1回投稿してもらい、警告やログを確認する。免除ロール・免除チャンネルでは検出されない場合があるため、管理者の投稿だけで合否を決めない。確認後はテスト語を外し、必要なルールを1つずつ追加する。

本文取得不能。設定条件が未比較。

- https://docs.dyno.gg/en/modules/automod

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## discord-recommended-bots-1-c4 — deferred

/discord/recommended-bots

Dyno無料で始められる機能範囲

変更前の本文対応: 無料で始める候補は、基本の日程調整ならsesh、通常のゲーム別ロール選択ならCarl-bot、管理・荒らし対策ならDynoです。定期イベントや設定上限の拡張などは有料になる場合があります。Ticket Toolは必要なパネル機能と上限を設定画面で確認してください。契約前に、使いたい機能のPremium表示を確認します。

今回Premium資料もCopied to clipboardのみ。Automod本文とは別URL。

- https://docs.dyno.gg/en/premium

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## discord-recommended-bots-2-c1 — deferred

/discord/recommended-bots

Carl DashboardのReaction Roles設定入口

変更前の本文対応: carl.ggでログインし対象サーバーを選び、Reaction Roles（リアクションロール）の作成画面を開く。投稿先を「#ゲーム選択」にし、説明文と絵文字・ロールの組み合わせを登録する。メニュー表記が違う場合は公式マニュアルのReaction Rolesを参照する。

Carl about本文は機能概説のみ。公式Reaction Roles資料は取得不能。コマンド資料からDashboard画面や現行Premium境界を推定しない。契約・Bot起動による補完も行わない。

- https://docs.carl.gg/roles/reaction-roles/
- https://carl.gg/about

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## discord-recommended-bots-2-c2 — deferred

/discord/recommended-bots

Carl等の設定上限拡張の有料境界

変更前の本文対応: 無料で始める候補は、基本の日程調整ならsesh、通常のゲーム別ロール選択ならCarl-bot、管理・荒らし対策ならDynoです。定期イベントや設定上限の拡張などは有料になる場合があります。Ticket Toolは必要なパネル機能と上限を設定画面で確認してください。契約前に、使いたい機能のPremium表示を確認します。

Carl about本文は機能概説のみ。公式Reaction Roles資料は取得不能。コマンド資料からDashboard画面や現行Premium境界を推定しない。契約・Bot起動による補完も行わない。

- https://docs.carl.gg/roles/reaction-roles/
- https://carl.gg/about

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## guide-gpu-driver-update-1-c2 — narrowed

/guide/gpu-driver-update

複数GPUのRenderタブ表示

変更前の本文対応: 対象GPUを右クリック→「プロパティ」→「ドライバー」で「ドライバーのバージョン」「日付」を記録する。Windows＋R→dxdiag→「ディスプレイ」または「レンダー」も確認できるが、複数GPUでは対象名を取り違えない。

取得済みMicrosoft資料が説明するDisplayまでに限定し、複数GPUでRenderタブが出るという未確認の具体名を外した。

- https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/

## guide-pc-game-crash-1-c2 — deferred

/guide/pc-game-crash

10月3日のSteam拡張停止でプレイできた1件の来歴

変更前の本文対応: 2026年10月3日（日本時間）、Steam版モンハンワイルズがタイトル前に落ちる環境で、 Steamクライアントの外部拡張を一時停止した後に「プレイできた」との報告が1件ありました。 OBS終了・SteamオーバーレイOFF・ゲームの整合性確認・管理者実行OFFの確認・GPUドライバー更新と再起動だけでは改善せず、 SteamプロセスにSteam直下の追加DLLが読み込まれていることを確認してから切り分けています。

2026-10-03に受け取った報告という本文は一次サポートの一般論で真偽確認できない。元ユーザー報告の記録はこの作業環境にない。報告件数や因果・改善率を補わず、私的履歴の推測取得もしない。


再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## guide-pc-game-crash-1-c4 — supported

/guide/pc-game-crash

Steam整合性の手順

変更前の本文対応: セーブ・エリアのロード中	特定のセーブ・場面だけか、別スロットや新規ゲームでも起きるか	セーブをコピー。別スロットも落ちるならSteamの整合性確認。特定データだけなら消さずにゲームのサポートへ

Valve FAQ本文は引き続き読めないが、CD PROJEKT REDの公式修復資料にSteamのLibrary→Properties→Installed files→Verifyが明記。公開本文の整合性確認の入口と破損修復という限定用途を比較した。症状との対照、バックアップ、追加MODが全削除されたと判断しない注意は編集上の条件で、全ファイル削除や必ず直るとの主張ではない。

- https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1562/verify-integrity-of-game-files-1

## guide-pc-game-freezes-1-c2 — narrowed

/guide/pc-game-freezes

HWiNFOのSensors-only→Start/Run

変更前の本文対応: メーカー付属の監視ソフトがあるなら先に使います。ない場合はHWiNFO公式から入手し、起動時に「Sensors-only」を選んで「Start」または「Run」でセンサー画面を開きます。版によって表示名は異なります。

HWiNFO公式は監視機能を説明するが起動画面のボタン名は保証しない。Sensors-only/Start/Runの断定を外し、使用版の公式案内でセンサー監視画面を特定する手順にした。

- https://www.hwinfo.com/about-software/

## guide-pc-game-freezes-1-c3 — narrowed

/guide/pc-game-freezes

HWiNFOのCPU Package/Tctl/Tdie欄

変更前の本文対応: CPUの欄で「CPU Package」や「CPU (Tctl/Tdie)」などの温度項目を探します。表示されるセンサー名はCPUによって異なります。

CPU Package/Tctl/Tdieの機種別表示を公式概説で裏付けられないため列挙を外し、CPUに対応する実際のセンサー名を記録する操作に限定。

- https://www.hwinfo.com/about-software/

## guide-pc-game-freezes-1-c4 — narrowed

/guide/pc-game-freezes

Task ManagerではCPU温度を調べられない

変更前の本文対応: 「パフォーマンス」→使用中の「GPU」で温度表示を確認します。対応するGPU・ドライバーでのみ表示されます。温度がないこと自体は故障ではありません。また、ここでCPU温度を調べることはできません。

GPU温度の公式資料からCPU温度機能全体の不存在を推定していた。断定を外し、GPU欄の値をCPU温度と混同しない説明に変更。

- https://blogs.windows.com/windows-insider/2019/08/16/announcing-windows-10-insider-preview-build-18963/

## guide-pc-game-freezes-1-c7 — supported

/guide/pc-game-freezes

Steam整合性手順

変更前の本文対応: Alt＋Tabで他アプリに切り替えられ、操作もできる	ゲーム側の停止を優先して調べる	進捗を確認し、戻らなければ対象ゲームだけ終了。整合性・MOD・メモリを比較

Valve FAQ本文は引き続き読めないが、CD PROJEKT REDの公式修復資料にSteamのLibrary→Properties→Installed files→Verifyが明記。公開本文の整合性確認の入口と破損修復という限定用途を比較した。症状との対照、バックアップ、追加MODが全削除されたと判断しない注意は編集上の条件で、全ファイル削除や必ず直るとの主張ではない。

- https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1562/verify-integrity-of-game-files-1

## guide-ray-tracing-gpu-1-c1 — supported

/guide/ray-tracing-gpu

RTX各世代の専用RT機能

変更前の本文対応: NVIDIA：GeForce RTX（RTX 20・30・40・50シリーズ）は対応。GeForce GTX（GTX 10・16シリーズなど）は非対応

RTX20/30とGTXの既資料にRTX40の第三世代RT Cores、RTX50の第四世代Ray Tracing Coresの製品本文を加え、20/30/40/50の専用ハードウェアという範囲を照合。GTXのソフトウェアDXRとは区別。

- https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/
- https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/
- https://www.nvidia.com/en-us/geforce/news/geforce-gtx-dxr-ray-tracing-available-now/

## guide-ray-tracing-gpu-1-c2 — deferred

/guide/ray-tracing-gpu

RX5000以前がハードウェアRT非対応

変更前の本文対応: タスクマネージャーの「パフォーマンス」→「GPU」でGPU名を確認します。NVIDIAはGeForce RTXシリーズ（RTX 20シリーズ以降）、AMDはRadeon RX 6000シリーズ以降が、ハードウェアのレイトレーシング機能を備えています。GTX 10／16シリーズやRadeon RX 5000シリーズ以前は非対応で、ゲーム側の設定では解決できません。

RX6000のRay Acceleratorは支持されるがRX5000以前の全機種否定までをそのページでは証明できない。5000シリーズ公式URLは取得不能、RDNA2旧URLは一般トップへ転送。世代全体の裏付けは未取得。

- https://www.amd.com/en/products/graphics/desktops/radeon/6000-series.html
- https://www.amd.com/en/products/graphics/desktops/radeon/5000-series.html
- https://www.amd.com/en/technologies/rdna-2

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## guide-ray-tracing-gpu-1-c4 — narrowed

/guide/ray-tracing-gpu

GPU列を見出し右クリックから追加

変更前の本文対応: ゲームを起動したままタスクマネージャーの「プロセス」タブで、「GPUエンジン」列にどのGPUが使われているか見る（列がなければ見出しを右クリックして追加）

MicrosoftはProcessesのGPU/Engine表示を説明する一方、右クリックSelect columnsの説明はDetailsタブ。Processesの具体メニューを混同せず、列が表示されない場合は既存のGPU設定確認へ進む案内に変更。

- https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/

## guide-ray-tracing-gpu-1-c7 — deferred

/guide/ray-tracing-gpu

Gears E-Dayの10月発売・RT必須

変更前の本文対応: エースコンバット8とGears of War: E-Dayです。一覧は「2026年10月発売の新作PCゲーム 動作環境まとめ」で確認できます。

Steam年齢確認で本文未取得。発売日と要件は別属性だが同じ取得不能に依存。

- https://store.steampowered.com/app/3010850/

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## guide-remove-mods-safely-1-c2 — supported

/guide/remove-mods-safely

MO2で対象プロファイルのMODを無効化

変更前の本文対応: Vortex等の管理ツールなら対象ゲームの管理画面で疑わしいMODを無効化し、必要に応じ「Deploy Mods」等の反映を完了。Vortexの「Purge Mods」を使う場合はツールが配置したリンクをまとめて外す操作であり、手動導入分は対象外。MOD一覧を削除する操作とは区別する。MO2など仮想配置のツールでは対象プロファイルのMODを無効化し、そのツール経由で起動して比較する。

公式ソースProfileがプロファイル内modlist.txtとenabled状態を保持し、setModEnabledで変更することを確認。usvfsの仮想配置と合わせ、対象プロファイルで無効にしてツール経由起動という本文を支持。本文は未確認のボタン名を指定しない。

- https://raw.githubusercontent.com/ModOrganizer2/modorganizer/master/src/profile.cpp
- https://github.com/ModOrganizer2/usvfs

## guide-remove-mods-safely-1-c4 — supported

/guide/remove-mods-safely

Steam修復は追加MOD全削除の証明ではない

変更前の本文対応: 本体ファイルの破損が疑われる時だけ、Steam「ライブラリ」→対象ゲームを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」を使う。Steamの修復だけで、後から追加したMODファイルがすべて消えるとは判断しない。

Valve FAQ本文は引き続き読めないが、CD PROJEKT REDの公式修復資料にSteamのLibrary→Properties→Installed files→Verifyが明記。公開本文の整合性確認の入口と破損修復という限定用途を比較した。症状との対照、バックアップ、追加MODが全削除されたと判断しない注意は編集上の条件で、全ファイル削除や必ず直るとの主張ではない。

- https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1562/verify-integrity-of-game-files-1

## guide-shader-cache-delete-1-c2 — narrowed

/guide/shader-cache-delete

Windows11設定→一時ファイル側の削除経路

変更前の本文対応: Windows 11の設定から開く場合は「設定」→「システム」→「ストレージ」→「一時ファイル」。一覧の読み込み後、同じ項目だけを選び「ファイルの削除」を押します。ダウンロードやごみ箱など、ほかの項目のチェックを必ず確認してください。

Microsoft空き容量資料だけではSettings側のDirectX項目名を確認できない。重複する代替経路を外し、Intel公式担当者が説明するDisk Cleanupの既存手順を残した。

- https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/free-up-drive-space-in-windows
- https://community.intel.com/t5/Gaming-on-Intel-Processors-with/CS2-crashed-Failure-Exception-IP-Module-igd10umt64xe-DLL/m-p/1757369

## guide-steam-disk-write-error-1-c1 — deferred

/guide/steam-disk-write-error

Steamライブラリ修復操作

変更前の本文対応: Steamのインストール・更新で「ディスク書き込みエラー」が出る時は、対象ゲームの保存先ドライブを先に特定。空き容量を確認し、ライブラリ修復後の再試行結果から、整合性確認・競合調査・Windowsのドライブ点検へ進む条件を解説します。

FAQ本文取得不能。Windowsの検査とは別。

- https://help.steampowered.com/en/faqs/view/21F5-8D5D-0141-7A5E

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## guide-steam-disk-write-error-1-c2 — deferred

/guide/steam-disk-write-error

Windowsドライブのツール→エラーチェック

変更前の本文対応: Windowsキー＋E→「このPC」→問題のドライブを右クリック→「プロパティ」→「ツール」→「エラーチェック」の「チェック」を開き、Windowsが表示する結果と修復指示を記録。システムドライブの修復を求められたら保存中の作業を終え、指示に従う。

ドライブProperties→Tools→Error checkingの正確なUIを支える一次箇所を特定できない。Windows一般案内は対象画面を説明しない。検索が指定語・ドメインに沿わない結果を返したため、その結果を証拠にしていない。取得済みで未読の該当本文がある状態ではない。


再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## guide-steam-game-not-launching-1-c1 — deferred

/guide/steam-game-not-launching

起動準備後のSteam公式対処順

変更前の本文対応: Steamゲームが起動しない時の対処法｜プレイを押しても起動しない・「起動準備を行っています」で止まる

本文取得不能。FAQへの帰属が未確認。

- https://help.steampowered.com/ja/faqs/view/5814-D9A3-BE42-62DF

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## guide-steam-game-not-launching-1-c2 — deferred

/guide/steam-game-not-launching

Radeonや一部ゲームの.NET更新要件

変更前の本文対応: Windows Updateでは、追加の更新プログラムに出てくる.NET Frameworkも入れる。Steam公式によると、AMD Radeonのドライバーや一部のゲームは.NET Frameworkのインストールと最新の状態を必要とする。

FAQ本文取得不能。現在の全Radeonへ拡張しない必要があるが編集は保留。

- https://help.steampowered.com/ja/faqs/view/5814-D9A3-BE42-62DF

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## guide-steam-game-not-launching-1-c3 — deferred

/guide/steam-game-not-launching

Steamと競合するソフトの対処

変更前の本文対応: 「起動準備を行っています」と出たあと何も起きない場合、Steam公式は、PCを再起動してから「Windowsを最新にする」「ドライバーを最新にする」「ゲームファイルの整合性を確認する」「Steamを妨害するソフトを止める」「システム要件を確認する」の順に試すよう案内している。

今回該当FAQも画像1行のみと判明。

- https://help.steampowered.com/ja/faqs/view/1F39-DCB4-FF28-5748

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## guide-steam-game-not-launching-1-c4 — deferred

/guide/steam-game-not-launching

実行ファイル不明時の整合性操作

変更前の本文対応: 「実行ファイルが見つかりません」	不足ファイル、Windowsセキュリティの保護履歴	ゲームファイルの整合性を確認し、同時刻の隔離も確認

今回該当FAQも画像1行のみ。

- https://help.steampowered.com/ja/faqs/view/3A2A-BF2D-15FF-7963

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## guide-steam-game-not-launching-1-c5 — deferred

/guide/steam-game-not-launching

既に実行中のエラー対処

変更前の本文対応: 一瞬「停止／実行中」になり「プレイ」に戻る	ゲームのプロセスと同時刻のWindows停止履歴	信頼性の履歴でゲームやランチャーの名前を照合

今回該当FAQも画像1行のみ。

- https://help.steampowered.com/ja/faqs/view/7CFE-6339-CEA8-DC13

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## guide-stutter-fix-1-c2 — deferred

/guide/stutter-fix

Steam性能モニターの現行UI

変更前の本文対応: 同じセーブ・練習場・同じカメラ方向を使い、約60秒で通れるルートを決めます。Steamでは「設定」→「ゲーム中（In Game）」のパフォーマンスオーバーレイから表示を設定できます。ゲーム内のFPS表示でも構いません。計測表示は1つにし、全比較で同じ表示を使います。

第5バッチの画像1行のみを維持。

- https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## guide-verify-steam-files-1-c1 — supported

/guide/verify-steam-files

Steam整合性の現行UIと照合範囲

変更前の本文対応: ゲームとSteamの更新を終え、必要なセーブ・MODの記録を残してから「ライブラリ→ゲームのプロパティ→インストール済みファイル→ゲームファイルの整合性を確認」を実行します。再取得された場合はダウンロード完了後に同じ症状を比較し、変化がなければ起動条件・MOD・設定など別の原因を確認します。毎回再取得される場合は更新履歴・保存先ドライブ・セキュリティソフトの履歴を照合します。

Valve FAQ本文は引き続き読めないが、CD PROJEKT REDの公式修復資料にSteamのLibrary→Properties→Installed files→Verifyが明記。公開本文の整合性確認の入口と破損修復という限定用途を比較した。症状との対照、バックアップ、追加MODが全削除されたと判断しない注意は編集上の条件で、全ファイル削除や必ず直るとの主張ではない。

- https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1562/verify-integrity-of-game-files-1

## pc-bluetooth-option-missing-1-c3 — narrowed

/pc/bluetooth-option-missing

ロールバック灰色は以前の版がない等

変更前の本文対応: 更新後だけ悪化し、アダプターが表示される場合はプロパティ→ドライバー→ドライバーを元に戻すが使えるか確認する。戻したら再起動して、スイッチ・アダプター・機器の接続を同じ条件で比較する。灰色なら以前の版が保存されていないなどの理由があり、その操作は使えない。

GPU向けの旧版がない説明をBluetooth全般へ流用しない。灰色なら使わずメーカーの適合ドライバー確認へ進むという既存FAQと同じ分岐に限定。

- https://support.microsoft.com/ja-jp/windows/hardware/bluetooth/update-bluetooth-drivers-in-windows

## pc-disk-usage-100-1-c1 — deferred

/pc/disk-usage-100

100%は忙しい時間割合で転送速度と別

変更前の本文対応: 使用率100％＝最大の転送速度とは限らない：「アクティブな時間」は処理で忙しい時間の割合、「読み取り／書き込み速度」は1秒に転送したデータ量です。細かな読み書きや応答待ちでも、速度が小さいまま100％になることがあります。MB/sだけで故障とは判断しません。

旧Task Manager本文が取得不能。Microsoft PhysicalDiskカウンター資料は転送量と時間の区別を支持するが、Task Managerの現在のアクティブ時間との対応までは記載しない。別カウンターを同一と断定せず保留。

- https://techcommunity.microsoft.com/blog/askperf/windows-8--windows-server-2012-the-new-task-manager/375149
- https://learn.microsoft.com/en-us/previous-versions/aa394262(v=vs.85)

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## pc-disk-usage-100-1-c2 — deferred

/pc/disk-usage-100

リソースモニターでディスク詳細を見る

変更前の本文対応: 同じ画面で「メモリ」と「CPU」も見る。上位がSystemで読み書き先が分からなければ、Windowsキー＋R→resmon→「ディスク」を開き、「ディスク活動」のイメージ名・ファイルのパス・合計（B/秒）を照合する。SystemはWindowsの処理を含むため終了しない。

MicrosoftのSystem configuration tools本文はTask Manager等の説明で、resmon→Disk活動のイメージ・パス・B/秒の画面を支持しない。対象一次箇所を検索で特定できず、現行Windows画面もこのLinux環境にはない。実機がないことのみを理由にせず、文書の具体名対応不足を保留理由にする。

- https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。

## pc-pc-broken-1-c3 — supported

/pc/pc-broken

膨張・液体侵入時の中止

変更前の本文対応: 膨張したバッテリーを押す・穴を開ける・無理に外すことはしない。電源ユニットやACアダプターも分解しない。発煙・火災など差し迫る危険がある場合は避難と消防への連絡を優先する。

Dellの現行膨張バッテリー手引きで圧迫・貫通・工具でこじる・膨張で引っ掛かったものの取り外し禁止を本文と比較。電源資料では液体/物理損傷の修理を指示。危険時の中止と専門窓口への相談という範囲に整合し、自己分解は案内していない。

- https://www.dell.com/support/manuals/en-id/dell/swollenbattery
- https://www.dell.com/support/kbdoc/ja-jp/000124389/

## pc-pc-hacked-signs-1-c5 — corrected

/pc/pc-hacked-signs

Offline前のBitLocker条件

変更前の本文対応: 必要に応じて「Microsoft Defender オフライン スキャン」を選択する。再起動するため作業を保存し、BitLockerを使う場合は回復キーの入手方法を事前に確認する。再起動後、Windows セキュリティ→保護の履歴で結果を確認する。

公式にはBitLocker保護の一時停止と、未実施時に回復キーを要求する可能性の明示がある。キー確認だけの本文に前提を追記し、管理端末・方法不明なら自己変更せず相談する条件と保護再開の確認を付けた。

- https://learn.microsoft.com/ja-jp/defender-endpoint/microsoft-defender-offline

## pc-pc-hacked-signs-1-c7 — supported

/pc/pc-hacked-signs

身代金・暗号化ファイル・外部機器の初動

変更前の本文対応: 暗号化や身代金要求がある場合は外付け保存機器も切り離す。復元可能なバックアップを保護し、身代金の支払い・暗号化ファイルの削除・復号ツールの実行を自己判断で急がない。警察・専門窓口へ状況を伝える。

JPCERT/CCのQ1-3とQ3で隔離・未侵害バックアップの退避・暗号化ファイルの保管・支払い非推奨を確認。外付けの保護と自己判断で復号や削除を急がず相談する本文はこれらを家庭向けに限定した案内。

- https://www.jpcert.or.jp/magazine/security/ransom-faq.html
- https://www.ipa.go.jp/security/anshin/attention/2017/mgdayori20170515.html

## pc-second-monitor-not-detected-1-c4 — supported

/pc/second-monitor-not-detected

以前の版がある時だけロールバック

変更前の本文対応: 更新直後の不具合で以前の版が残っている時だけ「ドライバーを元に戻す」を検討し、再起動後に設定→ディスプレイで1・2があるか確認する。

Microsoftのディスプレイドライバー向け資料に旧版がない時はロールバック不可、操作後再起動が明記される。Bluetooth資料の流用をやめ、対象デバイスに合う根拠で照合。

- https://support.microsoft.com/en-us/windows/hardware/display-graphics/troubleshoot-screen-flickering-in-windows

## pc-wifi-connected-no-internet-1-c6 — narrowed

/pc/wifi-connected-no-internet

Get Help日本語の結果名

変更前の本文対応: まだPCだけ開けなければ、スタートで「ヘルプを表示」を開き、検索欄に「ネットワーク」と入力して「ネットワーク診断の実行」を探す。見つからなければ公式ページに記載の「connect to network and internet」で検索する。提案と結果を控え、同じサイトを開く。IP・DNS関連の指摘が出たらSTEP 5へ。Wi-Fiボタン自体がない場合は関連記事の専用記事へ。

公式日本語本文に「ネットワーク診断の実行」は実在し、旧保留はこの点で過大だった。検索語は英語が明示されるため、未確認の日本語検索を先に試す経路を外して公式の英語検索語から結果選択する手順にした。

- https://support.microsoft.com/ja-jp/support/get-help/windows-troubleshooters

## pc-wifi-option-missing-1-c2 — deferred

/pc/wifi-option-missing

停止WlanSvcの開始操作

変更前の本文対応: スマホには見えるがPCには1件も出ない時は、Windowsキー＋R→services.msc→「WLAN AutoConfig」を開いて「状態」を確認。実行中なら右クリック→「再起動」、停止中なら「開始」を選び、接続先一覧をもう一度開く。開始に失敗したら表示されたエラーを控え、ほかのサービスを推測で変更しない。

公式はWlanSvc稼働の必要とservices.mscからのRestartを説明するが、停止時Startボタンまで対象文書で確認できない。sc-startの追加公式URLも取得不能。具体UIの文書対応が不足しており、サービスの推測変更で補わない。

- https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/wireless-network-connectivity-issues-troubleshooting
- https://support.microsoft.com/en-us/windows/experience/connectivity-networking/fix-wi-fi-connection-issues-in-windows
- https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/sc-start

再開条件: 対象の一次本文または元資料を通常の公開経路で取得できた時だけ再開。実機未実施とは別。
