# 英語版：VRAM不足・低GPU使用率

既存日本語2記事を英語化し、共通一覧14→16件。DirectX記事からVRAM記事への関連リンクも英語化。実登録再集計は英語93/231 URL、未対応138、共通ガイド残12件、sitemap/hasTranslation不一致0。配備成功前は実装数として扱う。

STEP ID・操作数（VRAM 2/2/2、低GPU 2/2/2/2）・FAQ各5・言語違いを正規化した出典を照合。日本語の補足コンポーネントも確認し、VRAM4節・低GPU6節の内容を保持。専用・共有メモリ、内蔵GPU、FPS上限、CPUの偏り、使用GPU、前面/背景で変わる計測条件を分けた。数値例は仮例と明示。設定を1項目ずつ変更し、同じ場面で比較、効果がなければ元へ戻す。レジストリ変更、VRAM増加の誤認、使用率だけでの買い替えを案内しない。

Microsoft DirectXのTask Manager/CPU・GPU負荷資料、Learnのメモリ構成・Windows 10プロセス別カウンター問題、WindowsのGPU選択・CPU表示・電源資料を確認。NVIDIAのWitcher 3資料は特定ゲームのテクスチャ例として扱い、現行全ゲームの必要容量に一般化しない。Steam補助資料 https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767 は本文1行・直接取得CONNECT403で未検証。ゲーム内FPS表示でも手順を実施可能とし、未確認のSteam画面・機能詳細を本文へ追加していない。到達確認は全体QA台帳に残す。

検証成功: localized225、変更箇所lint、全体strict型、隔離production build。473静的HTML、452 sitemap URL、392OG。英語24記事・1107内部リンクとアンカー、相互metadata・言語メニュー。Chromiumで375/390/430/1440pxの一覧と2記事12組、検索8件。横スクロール・アンカー切れ・JS例外・CSS/JS失敗・API書き込み0。OGとモバイル表示を目視確認。

親ブラウザ確認対象:

- https://gemnao.pages.dev/en/guide/vram-shortage
- https://gemnao.pages.dev/en/guide/low-gpu-usage
- https://gemnao.pages.dev/en/guide （16本）
- https://gemnao.pages.dev/en （VRAM、Low GPU Usage検索）

本番HTML/CSS/JSは実行環境のCONNECT403のため親ブラウザ確認待ち。全英語版追加・全体QAは未完了。未公開collector3ファイルと保留中の他言語branchは除外。
