# MW4製品版要件・セーブ場所の案内修正

公式本文を2026-10-18（日本時間）に確認：

- [Activision製品版PC要件（10月1日更新）](https://support.activision.com/modern-warfare-4/articles/pc-system-requirements-for-modern-warfare-4)：最低RAM 8GB、Ryzen 5 1400 / i5-6600、SSD空き115GB。推奨GPU RX 6600 XT。推奨はマルチプレイ高画質90fps向け。発売時のデスクトップ向け要件で、更新時は追加容量が必要な場合あり。
- [エディション案内（10月13日更新）](https://support.activision.com/modern-warfare-4/articles/modern-warfare-4-editions)：10月23日発売、デジタル予約特典キャンペーン早期アクセスは10月16日PT開始。時刻を推測して日本日付に換算しない。
- [TPM案内（9月16日更新）](https://support.activision.com/articles/trusted-platform-module-and-secure-boot)：TPM 2.0とSecure Boot必須。TPMはPTT/fTPMに加えてdTPMにも言及。CPU最低要件だけでTPM対応を判定せず機種別資料を確認。バックアップ・回復キー・中止条件を維持。

変更：MW4個別記事・総合データ・10月一覧を製品版要件へ統一。一覧の構造化RAM値も8GBへ更新。今回確認した対象がMW4であることを一覧に明記。既存のMW4・月別一覧翻訳はなし。

パス案内：日本語と既存EN/ZH/ESの共通カードで、各パスの直後にSteam userdata／ゲームインストール先／環境変数／不明な表示に応じた説明を表示。パスデータは変更・新設しない。ファイル名で終わる場合は親フォルダを開く。Wilds詳細は実在する翻訳へリンクし、未翻訳なら日本語と表示。Steamのuserdataとゲームのインストール先は区別する。

検証：`scripts/check-mw4-save-paths.mjs`（製品版値・RAM判定値・安全注意・4言語パス分類・390/1165px）、対象oxlint、翻訳190ページ検査、型検査、本番ビルド・検索資産・OG357件整合。型検査は既知のPlaywright型依存2ファイルのみ除外する既存検証設定を使用。生成HTMLとビルド済みCSSの画面・リンク確認は `/tmp/gemnao-mw4-save/` に保存。公開HTML/CSS/JSの最終確認は親ブラウザ担当へ引き継ぐ。
