# 英語版：電源断・停止コード・ReShade解除

既存日本語3記事と各補足5節を翻訳。pc-shuts-down-while-gaming / bsod-while-gaming / reshade-uninstall。共通一覧24件、英語101/231、未対応130（共通残4）。配備前は実装件数。

MicrosoftのEvent41とBugcheckCode0の限界、停止コード4種、MemoryDiagnostics-Results、Minidump保存と設定を確認。IRQL資料は直接取得エラー後、同URLの公式検索インデックス本文で診断起動を確認。ASUS/Dellの通風・ファン条件を照合し、低負荷でファン停止だけを故障とは断定しない。既存のIntel/AMD温度資料とMicrosoft表示条件を再利用。繰り返す電源断や危険兆候で測定・再現を中止し、OC復帰を一括BIOSリセットに拡大しない。ダンプは公開アップロードを促さない。

ReShadeは公式タグv6.8.0のMainWindow.xaml.csとSelectOperationPage.xamlを取得・確認。既存検出とProductName、初期選択Update、Uninstall ReShade and effects、PresetPath、Vulkan/OpenXRの共有アプリ管理を照合。現行版の同一挙動は保証せず、対象exe/API・版・所有元不明なら中止。解除でadd-onも対象になり得るため保全対象に含める。共有登録やSystem32の手動削除は案内しない。実機解除を実行したとは記載しない。

検証成功: localized233、対象lint、隔離全体strict型、本番build。481静的HTML、460 sitemap URL、400OG。英語32記事1492内部リンク/アンカー、双方向metadata・言語切替と既存スペイン語版/中国語版回帰。Chromium 375/390/430/1440pxで一覧+3記事16組、検索12件。横スクロール・壊れたアンカー・JS例外・CSS/JS失敗・API書き込み0。OG・モバイル画面を目視確認。

公開確認対象: /en/guide（24件）、/en の各記事検索、/en/guide/pc-shuts-down-while-gaming、/en/guide/bsod-while-gaming、/en/guide/reshade-uninstall。公開Pagesへの直接取得は既知のCONNECT403のため親ブラウザ待ち。全体追加・全体QAは未完了。無関係collector未公開3ファイル・保留スペイン語版/中国語版は保持。
