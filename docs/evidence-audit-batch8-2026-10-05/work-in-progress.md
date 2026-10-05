# 第8バッチ 作業中

対象はPR65のremaining-97。PR65への追加push禁止。親レビュー中の60121556から別ブランチを作成。マージ後の基準通知があればrebaseする。現時点では監査未完了・PR未作成。

- `/tmp/b8-pages.json`: 70系統の構造化本文＋全97台帳。
- `/tmp/b8-source-map.json`: 217出典URLと参照ページ対応（取得/比較済みという意味ではない）。
- `/tmp/b8-extract.ts` / `/tmp/b8-read.py`: 抽出・閲覧用。
- 27ページの自サイト機能説明は実装とfixtureで検証し、外部の一般論で代用しない。
- 19ハブのうちfocused=trueは本文の保存場所/FPS/HDR/要件を表示しない。一方、launchFixesはFAQ構造化データに出るため監査対象。英語鬼武者は別ハブで要件を表示。共通コンポーネントの表示分岐と合わせて分類する。

## 取得・比較した共通一次情報（2026-10-05）

1. Discord voice guide: https://support.discord.com/hc/en-us/articles/360045138471-Discord-Voice-and-Video-Troubleshooting-Guide
   入出力指定、Mute/Deafen/権限、個人音量、デバッグ欄のReset、Krisp、browser権限。古いLegacyサブシステムも公式本文には残る。各対象記事への対応づけは作業中。
2. Codes: https://support.discord.com/hc/en-us/articles/30952914470807-Discord-Audio-and-Video-Error-Codes-Troubleshooting-Guide
   JA短縮URLは取得失敗、公式voice記事リンク先ENで本文取得。1001許可/映像だけ可能、1002ノイズキャンセル内部エラー/再参加/完全終了、1003入力rate/入出力分離。1001/1002/1003記事の条件は公式より断定を強めていない。1002本文の一部は巨大出力で省略されたため再読が必要。
3. Helper: https://support.discord.com/hc/ja/articles/34853435033367-Discordシステムヘルパー
   Windows一部ユーザー実験、ゲーム権限/キー補助、4か所の通知、ユーザー設定内Windows設定から削除。system-helper本文は全主要手順/FAQを比較済み。キー編集中無効は別の公式Keybinds要取得。
4. Go Live: https://support.discord.com/hc/ja/articles/360040816151
   Windows/macOS/Chrome/mobile音声可、Linux/他browser不可。任意アプリ/全画面、権限Video、視聴側volume。stream-no-audio本文はまだ未読。
5. Attachment: https://support.discord.com/hc/en-us/articles/25444343291031-File-Attachments-FAQ
   9/30更新、無料20MB・実験、PDF等プレビューなし・Chat設定。upload-failedの後半は読んだが容量FAQ末尾の1GB/圧縮前判定など本文取得が必要。Nitro/Permissions/FilePreview/SaferMessagingは未取得。
6. VoiceConnection: https://support.discord.com/hc/en-us/articles/115001310031-Voice-Connection-Errors
   NoRoute/RTC等、UDP VPN、管理者、Region Override、障害。call-disconnects/rtc-connecting全主要手順を比較。no-route中段だけ再読必要。
7. AMD: https://support.discord.com/hc/en-us/articles/4978019693463-AMD-GPU-CPU-RTC-CONNECTING-Troubleshooting
   OpenH264無効、GPUdriver、dxdiag。古い一部機器という冒頭行は未読、本文手順は一致。
8. Krisp: https://support.discord.com/hc/en-us/articles/360040843952-Krisp-FAQ
   自分側のみ、静かな環境では声質低下もあり、device内処理、CPU高負荷自動停止のFAQ後半は未読。
9. MicTesting: https://support.discord.com/hc/en-us/articles/360020641332-Mic-Testing
   desktop/browserのみ、選択出力へ再生、テスト中mute/deafen。audio-input-not-found/mic-volume-low/user-volume-lowは主要手順/FAQ全読。mic-not-workingの後半は再読必要。
10. LE Audio: https://support.microsoft.com/en-us/windows/hardware/bluetooth/configuring-bluetooth-le-audio-quality-settings-on-windows-11
   Win11 24H2/26100.4484以降+factoryLE+対応driver/機器でstereo双方向。一般Bluetooth5.xでは保証しない。bluetooth-audio-problem/game-volume-lowers本文全読。Discord 19850083499159 EN短縮と206342888長URLは取得エラー、JAリンク/既存記録等で代替根拠を探す。Windows通信減衰の公式CoreAudio未取得。

## 確認した修正候補（まだコード変更なし）

- lib/games.ts Dawnwalker launchFixesに「BIOSを最新に（Intel13/14は特に）」「感度1→0.8」が残り、FAQ JSON-LDに出る。PR65の同じIntel/公式known issue根拠で、対象モデル限定・PCへ適用未確認へ修正する。
- EldenハブhdrのWindows HDRキャリブレーションはWin11専用条件がない。PR65のMicrosoft根拠を共有して修正。
- 鬼武者ハブlaunchFixesの596.49以上/26.5.1以上は最新の恒久保証に読める。対応版と告知確認へ狭める。キャッシュが無ければスキップもハブ要約に追加する候補。
- PR65比較台帳のCastlevania保留欄にi5-6400/8GBと誤記があった。実記事/ハブはi5-8400/16GB。出典が取得できないことは同じだが、次バッチの最終残件表は実際の文言を使って訂正し、PR65へのpushはしない。

## 未着手の主な範囲

- Discord残り記事/上記の読み落とし/各記事diagnosis・メタ要約（同一主張は対応づけ）。
- Windows11記事、共通14、機器3、一覧/ツール/運用27の本文比較。
- ゲーム19ハブの本文データは主要項目を全読したが、新規5作品の一次根拠/翻訳ハブ/実際の表示範囲の対応づけが未完。
- 既存batch3〜7の同日一次比較は同じ主張に限り出典箇所を示して再利用可能。リンクがあるだけで比較済みにしない。

## 2026-10-05 再開後追記（作業中、未テスト・未PR）

- 親の指示でPR65に黒画面ナビ修正9ba2cc9をpush、日本語・英語4幅の操作回帰済み。その後親がマージ/本番確認。現ブランチを新基準c6c026fbe7f1c9cc1075918dc658b8877c375dc4へrebase済み。PR65追加pushは禁止。
- 親の最新指示: 全97系統の事実主張を比較し、理由付き保留と未着手を混ぜない。取得可能なのに未比較を優先。重大誤り途中報告、確定修正は別PR。ユーザー「完了反映にして」のため公開確認まで継続。
- `comparisons-97.json` 初期台帳を作成。まだ大半not-started。6ページのみ現状を反映。他の既読範囲は下記/前節から追記が必要。「全件確認済み」は主張しない。
- `/tmp/b8-record.py` 台帳更新補助。`/tmp/b8-pages.json`は現在の修正前の構造化本文。`/tmp/b8-rendered.json`はPR65時点の118言語ページ抽出。ナビ/headerを除外しているのでmeta/本文は構造化データや実ソースでも比較する。
- `/tmp/b8-fetch.py`で217出典をurllib取得したが、全件ネットワークproxyの403で失敗。これはwebツールの取得不能を意味しない。保留理由には転用しない。webツールは取得可能。

### 新たに取得した一次情報（web参照番号は作業用、報告にはURL）
- turn288view0 Microsoft Windows11 SecureBoot: 最低要件はcapableで、無効だけでは不可ではない。turn288view1 TPM: TPM2.0は有効必要。turn291view0 ESUページ（https://www.microsoft.com/en-us/windows/extended-security-updates）: 22H2 Home/Pro等の登録でcritical/important更新、一般技術サポート/新機能なし。2027-10-12までという現ページだが日付は修正文へ追加しない。
- turn289view0 Microsoft app-audio: Win11ミキサーの音量/出力先、WindowsAudio/EndpointBuilder再起動、driver。Win10側との分岐も読んだ。
- turn289view1 Microsoft fix-microphone: Win11入力テスト、desktop権限個別一覧なし、接続/既定、driver再導入部分まで読んだ。小音量末尾は未読。
- turn290view0 Bluetooth-no-sound: 接続≠出力、10秒オフオン、再ペア、driver、A2DP、Win10/11手順まで読んだ。
- turn290view1 microphone test: Start/System/Sound/Input/>/start/stop/play/inputvolume。
- turn291view1 Krisp: CPU高負荷で自動停止、AppleCPU/macOS12+、自分側のみ、device処理、Chrome/Firefox、quiet時quality低下。全本文読了。
- turn291view2 AttachmentFAQ: free20MB、pre-compression、Basic50MB/Nitro1GB、Chatpreview、NSFWscan、PDFなどnopreview。末尾FAQまで読了。
- turn292view0 Discord InstallerErrors: AppData/LocalAppDataDiscordのみ、全終了、使用中はtask/startup、restart/reinstall。SetupLogボタン自体の説明はない。
- turn292view1 GameOverlay101: Windows10/11のみ、messages/mute/streamer、always/speaking/pin、windowed/borderless、crashdisable、hooklog。全文読了。
- turn292view2 StuckMainConnecting: 時刻自動、FW許可、proxy無効、接続console。全文読了。ただし記事loading-stuckは未読。
- turn293view0 audio-after-update: driver rollbackは以前版がある時のみ、services、更新。turn293view1 uninstall: Win11同版修復先、リスク、一部削除不可。
- turn294view0 repair sameversion: apps/files/settings保持、電源ネット維持、Win11 2022+Feb2024更新以後、管理デバイス不可の場合。全主要本文読了。
- turn294view1 missing output: showhidden/scan、enableifpresent、manufacturerWindows適合driver。全文主要読了。
- turn295view0 refresh: selecteddisplay、asteriskは解像度変更、VRR、DRRはVRR+120Hz/hardware、ゲーム上限制限あり。turn295view1 MDN rAF183–217: repaint前callback、概ねdisplayfrequency、hiddenpause、timestamp。

### この再開中に読んだ記事
- Discord camera、stream-no-audio、overlay、installation主要全文。stream/overlay/installationの表/meta/OG/相談文も読了、台帳に反映（installationSetupLog保留）。cameraのMicrosoftカメラ一次は未取得。
- Discord crashingはSTEP6後半・7・FAQ一部が出力切れ。cant-hear-voiceは後半/FAQ出力切れ。voice-cutting-outは主要全文読了（meta未読）。これらは未比較範囲を残す。
- PC audio-after-update、microphone-after-update主要/表/meta全文比較し台帳反映。
- PC bluetooth-connected-no-sound、call-starts-audio-disappears主要全文読了。後者通信減衰はMicrosoftCoreAudio一次未取得、LEAudioは先のturn285view2で条件比較可能。meta未読。
- PC gaming-shortcut-keys主要全文、refresh-rate-stuck-60hz主要全文（冒頭answer一部出力切れ）。refreshのMicrosoftは取得比較済み、externalmonitor/shortcuts/DXGI/GameBar/SteamF12一次の細部は未取得（batch6同主張再利用可能）。meta未読。
- about/privacy/terms本文読了。自サイト実装への対応途中。about運営者/提携/方針/実績はリポジトリ方針と外部証明を区別。法的効力を審査した意味ではない。
- tools/refresh-rate全文+lib/refresh-rate.ts+components/refresh-rate-check.tsx全文読了。4秒・中央値/中央80%・非表示中断・モニター直接取得なし一致。MDN/MSも比較済み。ブラウザ回帰はまだ。
- tools一覧全文読了、冒頭の直接Hz測定誤認を修正中。
- discord一覧は全文読んだが既存Bot領域は再開/変更しない。gear/guide/pc/trouble7一覧を一括出力して大量切れ。読了扱いしない。lib/trouble-hubs.tsの7見出し/説明/quickChecksとルートテンプレートは全文読了。カードは元記事の症状/descriptionを再利用する実装、各記事の比較/保留を対応づける必要がある。
- Windows診断ページ後半（STEP1途中以降）は読了、冒頭/英語は未読。ZIPを/tmp/b8-diagnosis-sourceへ展開。配布0.6.0は299650 bytes SHA25634719ffa93fe31143dcd392b383831fdf8f3f3ecc98d64f2d9e68d9405126b77でmanifest一致。source/README、docs/BUILD-RESULTS、ソース/386testsとの照合は未完。Windows実機不可はページも明示。勝手にWindows実機検証済みにしない。

### コード修正（現在別ブランチ、未テスト）
- lib/requirement-guides.ts: Win11SecureBootcapable/有効混同、ESU例外補足、firmware自己判断変更しない・回復キー確認。新作OS列挙は未比較でまだ変更しない。checkedAtを全体確認済みに更新しない。
- lib/games.ts: Dawnwalker対象desktopBIOS/console0.8、EldenWin11限定HDRapp、Onimusha固定driver版要件/不存在cacheスキップ。前バッチ同一次主張の再利用、manifest必要ならOG生成。
- app/tools/page.tsx: browser描画frequencyの目安へ。
- app/privacy/page.tsx: 件数だけという誤記を、手順別件数+困りごとの対象/種別/日時記録、新規書込時30日超削除へ。根拠lib/status/events-db.tsとapp/api/feedback/route.tsを全文読了。ノート送信禁止は変更なし。
- lib/pc-gaming-articles.ts: lowFPS=GPU性能不足という決めつけ削除、DRR因果は候補表現、AltEnter無効時のメニュー操作は画面が見える場合のみ（黒い場合STEP1へ）。日本語のみの既存記事、英中西新設不要。

### 追加比較と検証（同日、batch8途中）
- comparisons-97.jsonにDiscord23系統とPC/機器/ツール等の現在の比較範囲を追記。本文を読んだだけのゲーム16ハブはread-not-comparedで保持し、出典不足のholdとは区別。全体完了ではない。
- Windows update 0x800f081fはDISM/SFCの順、修復元のversion/servicing/language、NET3.5 26H1以降standaloneを一次比較。Sleepはpowercfg各引数/SleepStudy/VAIOのwake設定。Power-Troubleshooter ID1は取得資料に記載なし。ExplorerはAutoruns公式とMicrosoft File Explorer本文で旧メニュー/このPC/チェック解除を比較。残るmetaは未比較。
- Discord全主要本文の読み落としを補完中。loading/update/error1002/cant-hear/crashing/mic-not-working/no-routeの未読後半を補完。Keybinds217083547で編集中無効、perfmon公式で/rel、Troubleshooting31623498041623でCache対象と全終了/更新、CoreAudio stream-attenuationとusing-the-communication-deviceでWindows減衰を確認。Discord減衰206342888はEN長URL/JA短URL取得失敗、代替本文未確保。
- Gearマイク/保存先の全文を比較。Shureの指向性、Microsoft FAT32/安全取外しは取得一致。400-MC017メーカー503、Steam Cloud/Backup FAQはJA/ENとも本文無し。取得失敗を明示。Stream Deck + XLの公式仕様・Plus比較と主催ASCIIの展示予定は一致。KeyLogic等の細部と未出力フィールドはまだ未比較。
- 型・lint・79翻訳検査PASS。buildは285 snapshots/272 sitemap/204 OG一致。editorial-safety/snapshots/english-articles/safe-step-navigation PASS。ブラウザ回帰は3009の別tmp runtime（D1 bindingなし）、外部/APIモック、fixture限定。onimusha-black-screenとsafe-step-navigationは全4幅PASS。変更ページのlayout/Hz操作とstatic配信検査は実行中。
- コード変更後のWindows実機・ゲーム・GPU検証は不可。source comparisonとbrowser regressionを混同しない。実ユーザー記録、本番D1、Bot、Cloudflareブラウザ認証には触れない。
