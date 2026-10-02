# ルールの追加・変更

## 基準

`lib/diagnosis/model.ts` の `RULE_VERSION` が診断全体の版。各ルールには固定ID、適用条件、除外条件、整数の確認優先度、理由、action ID、版、確認日がある。優先度は確率ではない。現在18ルールと安全/情報不足の分岐。

`rules.ts` のactionsはID、表示名、時間目安、危険度、元に戻す方法、先に読む注意事項、具体手順、改善/変化なしの次の行動、ゲムなお記事、一次情報を保持する。たとえば「driver更新の時期が一致」から版の確認を優先するが、原因と断定しない。

- 技術的に不明な回答を問題なしへ変換しない
- ゲーム単体とPC全体を先に分ける。PC全体なら通常ルールを走らせない
- 同じactionは1回。既に試した/変化なし/改善済みは通常候補から外す
- 適用ルールがなければ情報不足を表示。無理に3件へ埋めない
- 各候補は最大3つ。単なる症状だけでドライバー更新へ直結させない
- 症状別のobservation表示は同じ値名でもsymptomを使って解決する
- GUI設定の変更は戻せる範囲で説明し、削除/BIOS/電圧/完全ドライバー削除などを初期対処にしない

## 手順

1. 原因候補・除外条件・必要な質問を考え、既存のモデルに追加する
2. 一次情報で行動を確認。既存記事のURL・公開状態をレジストリで照合
3. actionとruleに小さな固有IDを追加。UIへ条件をベタ書きしない
4. 新ルールの最小適用例、似ていて対象外の例、不明回答、試行済み、上流変更のテストを追加
5. `RULE_VERSION`と確認日を更新し、診断/共有のschemaの互換性を検討する
6. 型、lint、ルール/API、ブラウザ、既存回帰の全テストを通す
7. プレビュー確認後に公開し、変更履歴を記録

過去の共有は作成時の回答、結果、説明、記事/根拠、版のスナップショットを読む。新しいルールを自動適用しない。実施結果の更新APIは結果とrevisionだけを受け付け、診断時の内容/有効期限は変えない。再診断は新しい共有。

## 根拠

初期のルール確認日：2026-10-02。既存の詳細記事と一次情報へのリンクを対処ごとに保持。手順は独自要約。Steamの公式HTMLは取得環境によって本文抽出できないため、既存記事に記録された公式出典との照合を含む。確認できない画面項目やゲーム固有条件を新たに断定しない。

- Steam整合性: https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB
- Steam更新/インストール: https://help.steampowered.com/ja/faqs/view/21F5-8D5D-0141-7A5E
- Steam性能表示: https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767
- Microsoft Visual C++: https://learn.microsoft.com/ja-jp/cpp/windows/latest-supported-vc-redist
- Microsoft DXGI: https://learn.microsoft.com/ja-jp/windows/win32/direct3ddxgi/dxgi-error
- Microsoft DirectX CPU/GPU: https://devblogs.microsoft.com/directx/cpu-and-gpu-boundedness/
- Windows黒画面: https://support.microsoft.com/en-us/windows/hardware/display-graphics/troubleshooting-blank-screens-in-windows
- NVIDIAアプリ: https://www.nvidia.com/en-us/software/nvidia-app/faq/
- Vortex開発元: https://github.com/Nexus-Mods/Vortex/wiki/MODDINGWIKI-Users-FAQ
