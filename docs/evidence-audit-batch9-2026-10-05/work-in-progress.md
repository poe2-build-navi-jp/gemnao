# batch9 作業中

PR66のhead 061d3a81e90c6ba38064090447f5ff980619cc51を固定して別ブランチで継続。まだ未テスト・未PR。97系統台帳はbatch8から継承し、追加更新は別ファイルで保存する。

- contact本文/component/API/contact-dbを全文比較。任意メール・添付不可・保存フィールド・エラーと成功は一致。実ユーザー問い合わせは取得せず、本番送信もしない。事業相談受託実績や運営者方針の履行はコードから証明しない。
- about/privacy/terms本文再読。サイトの方針を示す文と外部認証が必要な参加資格・提携関係を区別。法的効力の審査はしない。privacyの広告/CMP外部仕様は未比較。
- Discord募集guidelines/submit本文・POST API・DB全文を比較。pending/uncheckedで作成しapproved+validのみ公開、owner/emailは公開selectから除外。30日を超えた募集の停止はクエリで自動強制されておらず管理者処理。実運用で停止済みかは実データを読まず未確認。方針文を自動停止の実装証明には使わない。
- Discord募集一覧は主要全文読了（構造化データ/heroの出力切れ箇所も補完）。DirectoryとSubmitFormの全読は未完。
- 一次資料の誤差発見：旧Server Discovery記事360023968311は冒頭で実験終了、現Discover Tabへ誘導。現25323248535319は一部ユーザー実験・検索desktopのみ。全アプリ一律に左側から検索させる本文/FAQを条件付きへ修正。公式Web一覧は既存リンクを再利用。Bot領域は変更なし。
- 出典: https://support.discord.com/hc/ja/articles/360023968311 、https://support.discord.com/hc/en-us/articles/25323248535319-Discover-Tab 。参加手順JA360034842871は取得失敗。作成/招待の一次本文は未比較。
- submit formの成功後にawait済みevent.currentTarget.reset()がnull例外になる実装を発見。旧buildのlocalhost3009、API201モック・合成入力だけで`Cannot read properties of null (reading 'reset')`を再現。ContactFormと同じく同期時にformElementを保持し、成功時resetしてからsentへ切替。多重送信中guardも追加。保存形式/API/D1不変。修正後テストはこれから。
- 参加手順JA失敗はEN公式360034842871で補完。作成は参加記事内公式リンク204849977でCreateMyOwn/template/nameを確認。招待101 JA208866998で期限・回数・停止/削除を確認。Directory/SubmitFormを全読し、検索5条件・空/エラー・owner非表示を確認。実際の管理権限確認運用の履行は未検証。
- /weekly、/gear、/guide、/tools/save-locationsのpageソース全文、/pcのpageとlib/pc-hub.ts、common-guide-categories全読。カード由来の主張の対応とWindows一次比較はまだ途中。/pc画面の最終確認9/30とdata.checkedAt10/1に差があるが、根拠なく日付を更新しない。

- 親よりPR66マージ基準885e89ba34bfe84563f81c736b3265f7c2991562受領。本番確認は親側で進行中。
- low-fps/low-gpu-usage本文・メタ・補足全文読了。Microsoft CPU/GPU制約・TaskManager GPU・GPUアプリ設定、NVIDIA上限/VSync、AMD FRTCを比較。Steam FAQ本文と論理プロセッサ切替UIは保留。更新台帳をcomparisons-97.jsonに保存。

- 修正後375/390/430/1440pxのDiscord募集FAQ開閉・キーボード送信・503入力保持→201成功・戻る/進む・横幅をPASS。最初の実行はプレビュー起動前で接続拒否、次は履歴遷移の待機不足。DOM遷移とnetworkidleを待って4幅を完走。全外部通信を遮断、APIモックのみ。
- 親よりPR66本番反映確認完了の連絡。Dawnwalker/OnimushaのlaunchFixes修正はfocused hubではFAQ JSON-LDへの反映で、可視本文の修正とは区別する。
