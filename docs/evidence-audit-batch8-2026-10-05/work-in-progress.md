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
