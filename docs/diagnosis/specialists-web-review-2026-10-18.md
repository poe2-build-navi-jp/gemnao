# Web診断の5分野追加（2026-10-18）

対象は日本語 `/diagnose` の質問式Web診断。従来6症状にGPU使用率・VRAM・音・Steam Cloud・コントローラーを追加。24の具体的状況と各分野の不明分岐を用意。入力は自己申告のみで、ブラウザから機器・音声・セーブ内容を取得しない。

- GPU：上限達成時の低使用率、目標未達、描画負荷、温度警告を区別。熱の疑いは負荷再現を止める。
- VRAM：専用メモリ、共有メモリ、システムRAM、ゲーム内予測を区別。共有分を搭載VRAMへ加算しない。
- 音：他アプリ、アプリ別・ゲーム内設定、HDMI等、Bluetoothのマイク使用あり／なし・不明を区別。Windows 10/11/不明の案内、ClassicとLE Audioの差を明記。
- Cloud：競合、同期通信エラー、進行消失、対応不明を区別。ローカルコピーを優先し、正しい版が不明なら起動・上書き選択を保留。日時だけで選ばない。
- 入力：Windows未認識、Steam未認識、ゲームだけ、二重入力の変換アプリあり／なし／不明を区別。

既存の安全・ストレージ警告・PC全体停止ゲートを最優先する。戻る・上位回答変更時の下位回答と結果の無効化、端末内保存、全文確認後のメモコピー／ダウンロードを維持。古い2世代の端末内記録も保持して安全確認から再開する。関係のない専用対処は「試した対処」候補に混ぜない。

既存の検証済み `/guide` 記事へリンク。Web診断は日本語のみで、架空の翻訳URLは作らない。Windows配布ツール0.6.0、配布ZIP・ハッシュ、日本語／英語のWindowsツール固有の未対応説明は変更していない。`/diagnose` の専用診断準備中文言だけを完成した機能説明へ置換。

## 確認

- `node scripts/test-diagnosis.mjs tests/diagnosis/rules.test.ts tests/diagnosis/api.test.ts tests/diagnosis/availability.test.ts tests/diagnosis/specialists.test.ts`：82件成功。全24分岐、既存6症状、すべて不明、危険・保存警告、PC停止、型選択検証、既存記事リンク、実施済み除外、相談メモを確認。
- `scripts/check-diagnosis-specialists-browser.mjs`：合成データ・ローカルのみ。390/1165pxで5分野完走、横はみ出しなし、再読み込み復元、全文確認・クリップボード・テキストダウンロード・やり直し。戻って別症状へ変えた際の古い回答・結果消去と不明分岐も確認。外部通信・POSTは禁止。
- 全体TypeScript検査成功。環境にない `@playwright/test` は隔離検査用tsconfigで既設Playwrightの型へ解決し、既存ブラウザspecも除外せず検査した。リポジトリの依存設定は変更なし。
- 変更実装・追加テストのoxlint成功。既存Playwright specの表示ラベル2箇所も追従。
- 隔離ビルドでVinext全ページ生成、Pages準備、静的検索アセット確認、OG357ページ確認、ローカライズ190ページ確認が成功。生成 `/diagnose` HTMLに11分野の説明があり、準備中文言がないことを確認。
- 受付・監視・課金・権限・DB・秘密・配布ツールに変更なし。既存の未公開community-reports作業は対象外として保持。

## 参照

既存の検証済みガイドの公式出典を引き継いだ。今回本文を再確認できたのはGPUメモリ、Bluetooth Classic、通信音声のMicrosoft資料。CPU/GPU boundednessは取得403、Steam Cloudは本文取得が限定的なため新規確認済みとは扱わず、既存ガイドと親の公式確認を根拠とした。参照一覧：

- https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/
- https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/
- https://learn.microsoft.com/ja-jp/windows-hardware/drivers/bluetooth/bluetooth-classic-audio
- https://learn.microsoft.com/en-us/windows/win32/coreaudio/communications-audio-format-capabilities
- https://help.steampowered.com/ja/faqs/view/68D2-35AB-09A9-7678
- https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_players

本番配信HTML/CSS/JSの確認は親ブラウザ担当に引き継ぐ（この環境の本番直アクセスは既知の接続制限）。Pages成功と実画面確認は区別する。

## 公開QA後の説明文修正

`/diagnose` 下部の「サーバー送信・結果共有は行わない」という旧説明を修正。共有コンポーネントの確認・同意・URL発行ガード、送信対象（answers/tried/results/version、自由入力ゲーム名なし）、サーバーTTL（作成から30日）、端末内TTL（最終操作から30日・再訪時削除）と照合した。自動送信なしと本人による任意共有を区別し、リンク閲覧範囲と端末内削除／共有削除の違いを明記。端末内βビルドは共有不可の説明を維持。受付設定・共有処理・APIは変更せず、共有POSTも実行していない。説明ページのみのlint・生成HTML確認・ビルドで検証。
