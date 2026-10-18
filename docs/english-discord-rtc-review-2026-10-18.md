# 英語版：RTC接続・画面共有・System Helper

rtc-connecting / screen-share-not-working / system-helper追加。Discord32/38・残6、英語133/231・残98（配備前は実装数）。元step id・操作数・診断行数・FAQ・注意有無・出典順を保持。既存の接続/音声/共有/overlay記事から実在英語へリンク更新。RTC相談メモはコピー専用の英語コンポーネントとして保持。

公式Voice Connection Errors115001310031、Voice & Video360045138471、AMD4978019693463（2022年の条件付き案内）、Go Live360040816151、Streaming33030151293079、System Helper34853435033367、Overlay217659737、Keybinds217083547を確認。AMD搭載だけで原因確定せず、同PC/同回線browserで実通話成功かを先に比較。OpenH264項目なしは推測変更しない。QoS/region/codecは元の値と復元を明記。任意reset前に設定記録、再install前にlogin/MFA保全。学校/職場の制限回避・firewall全無効化・router初期化を避ける。

共有はVideo権限を管理者へ限定依頼、Go Live開始/実視聴/小previewを区別。全画面前に私的windowと通知を隠す。Hardware AccelerationはVoice & Video→Video。System Helperは一部Windows向け実験機能、公式app内promptと本人開始の権限要求確認、管理PCは管理者対応。強制提供のための権限引上げ/外部installerなし。Keybind編集画面では無効という公式条件と導入後の動作比較を保持。

検証：localized265、全体型/build成功。対象lintはリンク更新で未使用となったjp関数1件を除去し解消。513静的HTML・492 sitemap・432OG、64記事2953内部リンク/アンカー成功。OG3を目視し1見出しの切れを修正。4幅16組・32カード・検索12件・未翻訳8ルート404成功。相談メモは各幅でコピー成功・失敗時全文選択を検証、375pxを目視確認。JSエラーとCSS/JS失敗0。全体英語QA未完了、実API書込みなし、無関係collector3ファイル保持。

前コミットdaaa5cf4bc17b176ce5a665ee9368a98f071454dはPages 5c0816a8-d4e4-49fb-94e5-bb14b41d8427成功確認済み。
