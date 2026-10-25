# 取得API・共通診断とWilds固有ルールの根拠

確認日: 2026-10-02。最新バージョン/障害情報をアプリ内で自動取得しません。コミュニティの一般コメントを公式見解として利用しません。

## カプコン・Steam

- [日本語のカプコン開発者投稿](https://steamcommunity.com/app/2246340/discussions/0/596267902352499417/)
- [英語の同公式ガイド](https://steamcommunity.com/app/2246340/discussions/0/596267902352499612/)
  - ゲーム本体名、実際のインストール先、CrashReport、互換モード確認、高解像度DLC/VRAMの注意を参照
  - 元記事に含まれる保護の除外・DDU等を、本ツールで自動実行/一律推奨しない
- [Steamストアの必要環境](https://store.steampowered.com/app/2246340/)
- [カプコン直営ストアの必要環境](https://store.captown.capcom.com/products/805461-jp)
  - 最低: 64-bit Windows 10/11、RAM16GB、i5-10400/i3-12100/Ryzen5 3600、GTX1660 6GB/RX5500XT8GB、DirectX12、SSD/75GB。これは今回のクラッシュ原因の証明ではない
- [Steamのファイル整合性確認](https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB)
- [公式ガイドがリンクするGPUドライバー告知](https://store.steampowered.com/news/app/2246340/view/534357354429284375)
  - リンク応答は確認したが、現時点の本文から特定版の条件を十分確認できなかった。数値版を推奨/禁止しない
- [カプコンの問い合わせ先案内](https://www.capcom-support.com/hc/en-us/articles/18800681490460-Monster-Hunter-Wilds-Support-Contact)
  - 案内先は https://www.monsterhunter.com/support/wilds/ 。クラウドでの直接取得は403だった。URLは公式指定先と確認済み。アプリでは本人のブラウザーで開き、データ送信はしない

## Microsoft一次情報

- [.NET Framework system requirements](https://learn.microsoft.com/en-us/dotnet/framework/get-started/system-requirements): Windows 11の同梱Frameworkを使う、小さな読み取りアプリとしてnet48を採用
- [EventLogReader.ReadEvent](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.eventing.reader.eventlogreader.readevent?view=netframework-4.8.1): 待機上限付きのイベント読取り
- [EventLogQuery.ReverseDirection](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.eventing.reader.eventlogquery.reversedirection?view=netframework-4.8.1): 最新記録からの読取り
- [Win32_OperatingSystem](https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-operatingsystem): 可視RAM/空きRAMはKiBから換算
- [Win32_PhysicalMemory](https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-physicalmemory): Capacityだけを取得。バイトからMiBへ換算し、モジュール識別情報を収集しない
- [Win32_VideoController](https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-videocontroller): ドライバー版を取得。DriverDateを更新実施日とみなさず、AdapterRAMで専用VRAMを判定しない
- [Win32_LogicalDisk](https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-logicaldisk): FreeSpace/Sizeだけを対象固定ドライブに照会
- [FileVersionInfo.FileMajorPart](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.fileversioninfo.filemajorpart?view=netframework-4.8.1): 実行せず版リソースの数値4部を表示。任意文字列をレポートへ流さない
- [クラッシュと障害モジュール](https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-application-service-crashing-behavior): ntdll等が現れるだけでそのモジュールの破損を断定しない
- [Kernel-Power 41](https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/event-id-41-restart): 次回起動時の正常でない終了記録。単独で根因を特定しない
- [保護の履歴](https://support.microsoft.com/en-us/windows/security/windows-security/protection-history-in-the-windows-security-app): 通知がある場合の本人による照合のみ。許可/除外/保護変更を行わない

## ゲムなおの案内先

下記2ページはHTTP200、記載の6つの手順IDも実際のHTMLで存在を確認済み。

- https://gemnao.pages.dev/games/monster-hunter-wilds/not-launching
  - #security / #remove-mods / #crash-record / #verify-files / #check-vram / #update-driver
- https://gemnao.pages.dev/games/monster-hunter-wilds/system-requirements

このネイティブ版のためのWeb記事変更、デプロイ、新規CI設定は行っていない。

## 独自の判断・限界

容量5GiB/5%、空きRAM1GiBは確認を促す本ツールの目安。ゲーム公式の必要量や故障閾値ではない。

Steam登録ファイルの解析は既知のKeyValues形式への限定対応で、Steam SDKの保証されたインストール検出APIではない。未対応・取得不能では手動選択へ進み、不在を未インストールの証明にしない。

原因確率、成功率、ログ不在での正常判定は出さない。以前動いた/追加DLC/試した手順などの本人回答は、取得事実と分けて表示する。

## 0.3の限定解析

- [MINIDUMP_HEADER](https://learn.microsoft.com/en-us/windows/win32/api/minidumpapiset/ns-minidumpapiset-minidump_header)、[MINIDUMP_MODULE](https://learn.microsoft.com/en-us/windows/win32/api/minidumpapiset/ns-minidumpapiset-minidump_module)、[MINIDUMP_EXCEPTION_STREAM](https://learn.microsoft.com/en-us/windows/win32/api/minidumpapiset/ns-minidumpapiset-minidump_exception_stream): ヘッダー、モジュール範囲/版、例外情報だけを読み、メモリ/レジスタ/スタックは解析しない
- [OBS Game Capture](https://obsproject.com/kb/game-capture-source): ゲーム描画を取り込む仕組みがある。併用の申告がある場合だけ比較候補とし、存在を原因の証明にしない
- [REFramework開発元](https://github.com/praydog/REFramework)、[ReShade開発元](https://github.com/crosire/reshade): 固定の既知名/メタデータを痕跡候補に使う。単独のDLL名だけで追加ツールと確定しない

ユーザーが許可して提供した実物ZIPで、固定見出しCrashReport.txtと標準MiniDump構造を確認した。元データ/実際のパス/画面/ダンプはソースやテストに含めない。テストは合成・架空パスのデータを使用する。生成時刻/例外/版/位置が異なる資料は一つの原因に統合しない。


## 0.4のローカルAPI（2026-10-02確認）

- Microsoft Process.Modules: https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.process.modules?view=netframework-4.8.1
- Microsoft GetProcessesByName: https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.process.getprocessesbyname?view=netframework-4.8.1
- Processの32/64bit制約: https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.process
- Hidden/ReparsePoint属性: https://learn.microsoft.com/en-us/dotnet/api/system.io.fileattributes?view=netframework-4.8.1
- ユーザー別データ保護: https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.dataprotectionscope
- 本人UI付きゴミ箱操作: https://learn.microsoft.com/en-us/dotnet/api/microsoft.visualbasic.fileio.filesystem.deletefile?view=netframework-4.8.1

Steam固定名は限定確認対象の名前であり、Microsoft/Valveがそれらを原因・マルウェアと認定したという引用ではない。事例に基づく観測と一般化可能なAPI事実を分ける。公開前の新記事anchorや未公開受付を「利用可能」としない。

## 0.5共通コース（2026-10-02確認）

- Microsoft: https://support.microsoft.com/en-us/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows
  - タスクマネージャーでリソース使用を本人が確認できることを参照。アプリはFPS/使用率/温度を測定しない。電力設定変更/掃除ソフト/レジストリ等へ拡張しない
- Valve: https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB
  - Steamのインストール済みファイル検証。Steam以外へ一律適用しない
- Valve: https://help.steampowered.com/en/faqs/view/3978-072C-18DF-FBF9
  - オーバーレイの確認用。本人の利用申告がある場合のみ手動比較候補

同じ場面・1設定ずつ・結果自己申告は本ツールの比較設計であり、メーカーが全ゲームで原因判定できると保証する引用ではない。一般ゲームの必要要件をWildsの16GB等で代用しない。
