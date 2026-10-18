# 英語版：動作負荷・配信のカクつき・旧音声クライアント

slow-performance / stream-stuttering / voice-client-outdated追加。Discord35/38・残3、英語136/231・残95（配備前は実装数）。元step id/操作数/診断行数/FAQ/注意有無/出典順を照合。既存関連記事を英語へ更新し、不要jp関数を除去。Chrome95414とMozillaの公式言語別URLを同一資料として照合するテスト正規化を追加。

公式Discord要件213491697、一般31623498041623、複数process225733808、Microsoft Windows performance本文を確認。typing/scroll/deliveryを分離、CPU/GPU/memory/diskは単独の故障・購入判断にしない。Advancedのアプリ描画とVoice & Video→Videoの配信用hardware accelerationを区別。変更前の値/同条件/復元を保持。

Go Live360040816151、Streaming33030151293079、Voice & Video360045138471を再利用。配信者のgame/視聴者各人を別評価、PiP gear・DM矢印のquality、browserはquality変更不可。720p30は比較値で万能解決ではない。全画面共有前の個人情報保護を明記。

最低voice版38025123604631はWindows1.0.9164/Firefox142/Chrome・Edge86、2026-03-02以降の暗号化対応必須を確認。最低値は最新版推奨・一般動作要件とは別と明記（総合要件Chrome108との意味差を維持）。Google95414、Mozillaupdate-firefox、MicrosoftEdge更新公式本文で更新/再起動/Store版とmanaged条件を確認。暗号化無効化・旧版指定・管理制限迂回を勧めず、実通話とbotDAVE対応を分ける。

検証：localized268、型/lint/build成功。516静的HTML・495 sitemap・435OG、67記事3093内部リンク/アンカー成功。OG3目視済み。4幅16組・検索12件・35カード・未翻訳8ルート404成功。検索初回はshortTitleの語句が本文titleに含まれず待機失敗し、実際の検索対象titleの語句で再検証成功。JS/CSS失敗0、375px旧client画面目視済み。英語全体QA未完了。実API書込みなし、collector3ファイル保持。

前コミットdaa1bc3のPages b1354bb0-224b-491b-b1d1-7af46afb3e65成功確認済み。
