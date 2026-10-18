# 英語版の全体棚卸し — 2026-10-18

基準commit: `659e2e633c6bd4bee4b3c72e99d5aaca364a3173`。本番Pages成功: `32a79a20-9cf9-45dc-b9c7-3246d9d297c6`。sitemapとhasTranslationの実登録を照合。日本語231 URL、英語86 URL、未対応145 URL、登録との不一致0。公開ブラウザの全ページ再検証を意味しない。

[全URLの基準CSV](english-localization-backlog-2026-10-18.csv) はこのcommitのスナップショットとして保持し、バッチ差分を下に記録する。

| 系列 | 日本語 | 英語 | 未対応 |
|---|---:|---:|---:|
| public-page | 8 | 1 | 7 |
| index | 6 | 3 | 3 |
| discord-article | 38 | 4 | 34 |
| examples | 1 | 1 | 0 |
| game-hub | 22 | 18 | 4 |
| game-article | 91 | 46 | 45 |
| gear-article | 3 | 2 | 1 |
| guide-article | 28 | 9 | 19 |
| new-releases | 2 | 0 | 2 |
| pc-article | 20 | 1 | 19 |
| tool | 3 | 1 | 2 |
| trouble | 7 | 0 | 7 |
| weekly | 2 | 0 | 2 |

## 今回の差分

共通ガイド `no-game-audio`、`steam-input-controller`、`controller-double-input` の英語版3件を追加。英語共通一覧は12件、サイト全体では89/231、未対応142となる。配備前は実装件数、配備成功確認後に公開件数として扱う。既存 `/en/pc/repair-or-replace` の英語ホーム検索・カードへの掲載漏れも修正（記事数増加には数えない）。

## sitemap外の操作画面

以下は145件と別枠。noindexを翻訳済みとは扱わない。実在ルートを調査し、管理画面は対象外とした。

| 日本語ルート | 英語対応 | 確認事項 |
|---|---|---|
| /my-games | あり | localeルートあり。UI再確認は別工程 |
| /reports | あり | localeルートあり。実投稿・運用変更は本作業外 |
| /my | なし | localStorageのPC情報画面、noindex |
| /diagnose | なし | 日本語の診断UI、既存公開フラグを維持 |
| /diagnose/privacy | なし | 診断説明、noindex |
| /diagnostic-feedback | なし | 診断フィードバック、noindex |
| /discord-servers/submit | なし | 投稿フォーム、noindex |
| /diagnosis/[id]、/diagnosis/manage/[id] | なし | 共有結果・管理操作。本文と権限動作を分けて検証が必要 |

英語版を完了とするには、記事だけでなく上記UI・索引・検索の不足も扱う。英語の公開URLがあることのみで内容校正完了とはみなさない。

## 保留条件

出典の未確認により保留するゲーム別復元・MOD条件は [資料再確認待ち](localization-source-blockers-2026-10-18.md) の正確なURLと条件に従う。他の独立した英語記事は継続する。言語順は英語版、スペイン語版、中国語版。

英語版追加後の全体QAは [QA台帳](english-full-qa-2026-10-18.md) に記録。全体監査・修正・再テスト・公開と保留報告を終えるまでスペイン語版に進まない。

## 公開・実装の更新

- 音声・コントローラー3件は `8294a413869ccd14b04e7bad59e0bc808ac9c3f3`、Pages `2fbd9792-7eab-4278-a91f-f2de2d691be0` 成功。89/231 URL、未対応142。
- DirectX・Visual C++の2件を追加実装。共通一覧14件、91/231 URL、未対応140。配備確認前は実装件数として扱う。
- DirectX・Visual C++は `be89783446fb6fdf92842fea295434944f1458dd` / Pages `18663c7f-3c59-4b99-8600-306fac4f9205` 成功。
- VRAM不足・低GPU使用率を2件追加実装。共通一覧16件（共通残12件）、93/231 URL、未対応138。配備確認前は実装件数として扱う。
- VRAM・低GPU使用率は `a298d8735eab65f8257154401502e75ea2b2d454` / Pages `079c0cae-4ebd-4a3e-be25-ec51ba9072ae` 成功。
- フリーズ記事を追加実装。共通一覧17件（共通残11件）、94/231 URL、未対応137。配備確認前は実装件数。Steamディスク書き込みエラーは中核の公式資料取得不可で保留（資料台帳参照）。

- 2026-10-18 maintenance batch: remove-mods-safely / uninstall-save-data / shader-cache-delete / steam-disk-write-error の英語版4件を追加。英語98/231、未対応133、共通21/28（残7）。配備成功までは実装件数。既存CSVは659e基準のまま保持。

- maintenance4件は `da96abe4c81833c3068e0ee9abebf80ddd3a3258` / Pages `633bf043-bf4b-419f-a099-3cbabf8be5b2` 成功。
- 電源断・停止コード・ReShade解除を3件追加。英語101/231、未対応130、共通24/28（残4）。配備成功までは実装件数。

## 共通ガイド完了バッチ

要件3件と設定ファイル初期化を追加し共通28/28。英語105/231、残126。初期CSVは保持。再集計でregistry/sitemap不一致0。Discord34、PC19、ゲーム記事45・ハブ4、gear1、tools2、index3、public7、trouble7、月間2・週刊2が未対応。sitemap外の保存/診断等UIと英語全体QAも残る。

## Discord起動・更新バッチ

既存4記事を追加してDiscord8/38・残30。英語109/231、未対応122。次候補はcant-hear-voice、audio-input-not-found、error-1001/1002/1003。公式エラーコード30952914470807は短いURLで取得失敗後、公式一般ガイドのリンクからフルURL本文を取得済み。候補はまだ翻訳/公開済み件数に含めない。

## Discord音声5件

Discord13/38・残25、英語114/231・残117。registry/sitemap不一致0。次は台帳順Bluetooth音声、Bot追加/応答/削除。既存日本語も公式日本語も読めるためBluetooth英語資料単体の取得失敗を全体停止条件にはしない。スペイン語版/中国語版へは未移行。

## Discord Bluetooth・Bot4件

bluetooth-audio-problem / bot-add / bot-not-responding / bot-remove追加。Discord17/38・残21、英語118/231・残113、registry/sitemap不一致0。localized250、全体型/buildと対象lint、49記事2261内部リンク、4幅20組・検索16件成功。API書込み0。詳細english-discord-bots-review-2026-10-18.md。英語全体QAと親担当の本番画面確認は残る。次は台帳順call-disconnects以降。

## Discord通話切断・カメラ・終了3件

call-disconnects / camera-not-working / crashing追加。Discord20/38・残18、英語121/231・残110。registry/sitemap不一致0。前バッチfbf5faaはPages 6ea872e2-cac5-4d4e-bc54-e14baf1df268成功を確認済み。次はecho-double-voice、game-not-detected、game-volume-lowers以降。スペイン語版・中国語版には移行していない。

## Discord反響・ゲーム検出・音量低下3件

Discord23/38・残15、英語124/231・残107。localized256、型/lint/build、55記事2539内部リンク、4幅16組・検索12件成功。OG3枚の省略と改行を修正して再生成。詳細english-discord-echo-review-2026-10-18.md。親は先行17記事とreset-config位置案内修正まで確認済み。英語全体QAは未完了。

## Discordログイン・マイク音量・No Route3件

Discord26/38・残12、英語127/231・残104。registry/sitemap不一致0。localized259、型/lint/build、58記事2683内部リンク、4幅16組・検索12件成功。マイク音声方向図も英語化しリンク/4幅/375px目視確認。詳細english-discord-login-review-2026-10-18.md。英語全体QAと今回の本番ブラウザ確認は未完了。

## Discord通知・オーバーレイ・電話認証3件

Discord29/38・残9、英語130/231・残101。registry/sitemap不一致0。localized262、型/lint/build、510静的HTML・489 sitemap・429OG、61記事2815内部リンク、4幅16組・検索12件成功。OG3目視/修正済み、API書込み0。詳細english-discord-notifications-review-2026-10-18.md。前コミット35cfe12とab44b66のPages成功確認済み。英語全体QAと今回の本番ブラウザ確認は未完了。

## Discord RTC・画面共有・System Helper3件

Discord32/38・残6、英語133/231・残98。registry/sitemap不一致0。localized265、型/lint/build、513静的HTML・492 sitemap・432OG、64記事2953内部リンク成功。4幅16組・検索12件とRTCメモのコピー成功/失敗フォールバック確認。詳細english-discord-rtc-review-2026-10-18.md。英語全体QA・本番画面確認は未完了。

## Discord動作負荷・配信・旧音声client3件

Discord35/38・残3、英語136/231・残95。registry/sitemap不一致0。localized268、型/lint/build、516静的HTML・495 sitemap・435OG、67記事3093内部リンク成功。4幅16組・検索12件成功。詳細english-discord-performance-review-2026-10-18.md。英語全体QAと本番画面確認は未完了。

## Discord相手音量・音声途切れ2件

Discord37/38・残1、英語138/231・残93。registry/sitemap不一致0。localized270、型/lint/build、518静的HTML・497 sitemap・437OG、69記事3184内部リンク成功。4幅16組・検索8件・37カード・未翻訳8ルート404、JS/CSS失敗0、API書込み0。音量方向図の英語リンク更新も確認。英語全体QA・本番ブラウザ確認は未完了。 詳細english-discord-listening-review-2026-10-18.md。残1はDyno本文確認待ち。次はPC/Windows19記事。

## PC音声3件

PC4/20・残16、英語141/231・残90。registry/sitemap不一致0。localized273、型/lint/build成功。521静的HTML・500 sitemap・440OG、72記事3302内部リンク/アンカー成功。4幅16組（既存repair含む）・検索クリック/戻る12件・未翻訳9ルート404、JS/CSS失敗0、API書込み0。英語全体QA・本番ブラウザ確認は未完了。 詳細english-pc-audio-review-2026-10-18.md。Discord残1はDyno本文確認待ち。

## 終了条件の更新

ユーザー最新指示「英語版終わったらとりあえず一旦終わりで」により、英語追加・全体QA・修正・公開確認までを継続し、その時点で終了する。スペイン語・中国語へは進まない。既存公開物と保全下書きは維持。確認不能事項は個別保留・未完として報告する。

## PC一覧・更新後音声・Bluetooth消失

PC6/20・残14、英語144/231・残87。英語PC一覧も追加。localized276、型/lint/build、524静的HTML・503sitemap・443OG、74記事3396内部リンク/アンカー成功。4幅28組、1920px通常header、検索クリック/戻る12件、6カード、未翻訳6ルート404成功。通話開始時のみのBluetooth音質問題を別マイク比較へ直接案内し、4幅でリンク位置/遷移先STEP表示確認。JS/CSS失敗0・API書込み0。英語全体QAと本番ブラウザ確認は未完了。 詳細english-pc-recovery-review-2026-10-18.md。

## PC USB-C・外部モニター

PC8/20・残12、英語146/231・残85。registry/sitemap不一致0。localized278、型/lint/build成功。526静的HTML・505sitemap・445OG、76記事3478内部リンク/アンカー成功。4幅16組、1920px通常header、検索クリック/戻る12件、8カード、未翻訳6ルート404成功。JS/CSS失敗0・API書込み0。英語全体QAと本番ブラウザ確認は未完了。 詳細english-pc-usb-display-review-2026-10-18.md。

## PCリフレッシュレート・ショートカット

PC10/20・残10、英語148/231・残83。localized280、型/lint/build、528静的HTML・507sitemap・447OG、78記事3572内部リンク/アンカー成功。4幅16組、検索クリック/戻る12件、10カード、7行早見表と28回STEP遷移、1920px通常header、未翻訳6ルート404成功。JS/CSS失敗0・API書込み0。OG2枚と375px早見表目視済み。英語全体QA・本番画面確認は未完了。 詳細english-pc-gaming-review-2026-10-18.md。

## PC Wi-Fi2記事

PC12/20・残8、英語150/231・残81。localized282、型/lint/build成功。530静的HTML・509sitemap・449OG、80記事3658内部リンク/アンカー成功。4幅16組、検索クリック/戻る12件、12カード、1920px通常header、未翻訳6ルート404成功。JS/CSS失敗0・API書込み0。OG2枚と375px結果表目視済み。英語全体QA・本番画面確認は未完了。 詳細english-pc-network-review-2026-10-18.md。

## PCスリープ復帰・サインイン後黒画面

PC14/20・残6、英語152/231・残79。localized284、型/lint/build成功。532静的HTML・511sitemap・451OG、82記事3745内部リンク/アンカー成功。4幅16組、検索クリック/戻る12件、14カード、1920px通常header、未翻訳6ルート404成功。JS/CSS失敗0・API書込み0。OG2枚と375px結果表目視済み。英語全体QA・本番画面確認は未完了。 詳細english-pc-sleep-signin-review-2026-10-18.md。

## PC更新エラー・エクスプローラー

PC16/20・残4、英語154/231・残77。localized286、型/lint/build成功。534静的HTML・513sitemap・453OG、84記事3833内部リンク/アンカー成功。4幅16組、検索クリック/戻る12件、16カード、1920px通常header、未翻訳6ルート404成功。JS/CSS失敗0・API書込み0。OG2枚と375px結果表目視済み。英語全体QA・本番画面確認は未完了。 詳細english-pc-update-explorer-review-2026-10-18.md。

## PC Windows Update停止

PC17/20・残3、英語155/231・残76。localized287、型/lint/build成功。535静的HTML・514sitemap・454OG、85記事3884内部リンク/アンカー成功。4幅16組、検索クリック/戻る12件、17カード、1920px通常header、未翻訳6ルート404成功。JS/CSS失敗0・API書込み0。OGと375px結果表目視済み。英語全体QA・本番画面確認は未完了。 詳細english-pc-update-stuck-review-2026-10-18.md。

## PC故障・不正アクセス対処

PC19/20・残1、英語157/231・残74。localized289、型/lint/build成功。537静的HTML・516sitemap・456OG、87記事3984内部リンク/アンカー成功。4幅16組、検索クリック/戻る12件、19カード、1920px通常header、未翻訳6ルート404成功。JS/CSS失敗0・API書込み0。OG2枚と375px結果表目視済み。英語全体QA・本番画面確認は未完了。 詳細english-pc-hardware-security-review-2026-10-18.md。

## Discord Bot比較

Discord38/38、英語158/231・残73。localized290、型/lint/build成功。538静的HTML・517sitemap・457OG、88記事4038内部リンク/アンカー成功。日英各4幅、4カード各4操作、比較表/カード/戻る32組、一覧・検索からの到達、zh/es未翻訳404成功。横はみ出し・欠落アンカー・JS/CSS失敗・API書込み0。OGと375px比較表目視済み。英語全体QAと本番ブラウザ確認は未完了。 詳細english-discord-recommendations-review-2026-10-18.md。

## ELDEN RING 6記事

英語164/231・残67。ゲーム個別52/91・残39。localized296、型/lint/build成功。544静的HTML・523sitemap・463OG、94記事4309内部リンク/アンカー成功。6記事×4幅、診断24遷移、ハブ到達、検索クリック/戻る8件、セーブパスのコピー一致。横はみ出し・欠落アンカー・JS/CSS失敗・API書込み0。OG6枚と375px保存パス/1440px診断表目視済み。英語全体QA・本番画面確認は未完了。 詳細english-elden-review-2026-10-18.md。

## Monster Hunter Wilds 8記事

英語172/231・残59。ゲーム個別60/91・残31。localized304、型/lint/build成功。552静的HTML・531sitemap・471OG、102記事4672内部リンク/アンカー成功。8記事×4幅、診断32遷移、ハブ到達、検索クリック/戻る8件、セーブパスのコピー一致。横はみ出し・欠落アンカー・JS/CSS失敗・API書込み0。OG8枚と375px保存パス/1440px診断表目視済み。英語全体QA・本番画面確認は未完了。 詳細english-wilds-review-2026-10-18.md。

## Palworld 5記事

英語177/231・残54。ゲーム個別65/91・残26。localized309、型/lint/build成功。557静的HTML・536sitemap・476OG、107記事4900内部リンク/アンカー成功。5記事×4幅、診断20遷移、ハブ到達、検索クリック/戻る8件、セーブパスのコピー一致。横はみ出し・欠落アンカー・JS/CSS失敗・API書込み0。OG5枚と375px保存パス/1440pxポート診断表目視済み。初回buildは最終処理で137終了、完了済み検証サーバーを停止後の再buildは正常完了。英語全体QA・本番画面確認は未完了。 詳細english-palworld-review-2026-10-18.md。

## ゲームハブ4件・Dogma性能記事

英語182/231・残49。ゲーム個別66/91・残25、ゲームハブ22/22。localized314、型/lint/build成功。562静的HTML・541sitemap・481OG、108記事4948内部リンク/アンカー成功。5ページ×4幅、検索クリック/戻る16件、日英ハブ相互metadata、ACE記事からハブ遷移、存在しないzh/esハブ非生成を確認。横はみ出し・欠落アンカー・JS/CSS失敗・API書込み0。OG5枚と375px性能記事/1440pxAniimoハブ目視済み。英語全体QA・本番画面確認は未完了。 詳細english-game-hubs-review-2026-10-18.md。

## Aniimo 5記事

英語187/231・残44。ゲーム個別71/91・残20。localized319、型/lint/build成功。567静的HTML・546sitemap・486OG、113記事5192内部リンク/アンカー成功。5記事×4幅、診断20遷移、ハブ到達、検索クリック/戻る8件。横はみ出し・欠落アンカー・JS/CSS失敗・API書込み0。OG5枚と375px表示倍率/1440pxGPU診断表目視済み。英語全体QA・本番画面確認は未完了。 詳細english-aniimo-review-2026-10-18.md。

## Dawnwalker 3記事

英語190/231・残41。ゲーム個別74/91・残17。localized322、型/lint/build成功。570静的HTML・549sitemap・489OG、116記事5327内部リンク/アンカー成功。3記事×4幅、診断12遷移、ハブ到達、検索クリック/戻る8件、エラー文コピー一致。横はみ出し・欠落アンカー・JS/CSS失敗・API書込み0。OG3枚と375px要点/1440px入力診断表目視済み。初回buildは137終了、完了済み検証サーバー停止後の再buildは成功。英語全体QA・本番画面確認は未完了。 詳細english-dawnwalker-review-2026-10-18.md。

## Star Wars Zero Company 4記事とWilds診断リンク

英語194/231・残37。ゲーム個別78/91・残13。localized326、型/lint/build成功。574静的HTML・553sitemap・493OG、120記事5511内部リンク/アンカー成功。4記事×4幅、診断16遷移、ハブ到達、検索クリック/戻る8件、保存パスコピー一致。横はみ出し・欠落アンカー・JS/CSS失敗・API書込み0。OG4枚と375px保存パス/1440px診断表を目視。Wilds config-file症状表の再発行をsafe-startからrestore-configへ修正し、4幅で実クリックしてStep 4へ到達。英語全体QA・本番画面確認は未完了。 詳細english-star-wars-review-2026-10-18.md。

## PCディスク使用率・本番QA指摘修正

英語195/231・残36、PC20/20。localized327、型/lint/build成功。575 HTML・554 sitemap・494 OG、121英語記事5563リンク/アンカー成功。Bot比較表は日英5幅80クリック成功、1180px単語分断を解消。Palworld3記事の空Avoidを非表示にし既存注意を保持。ディスク記事4幅・検索/戻る・20カード・未翻訳404成功。OG/画面目視済み、API書込み0。全英語QAと本番画面確認は未完了。詳細english-pc-disk-review-2026-10-18.md。
