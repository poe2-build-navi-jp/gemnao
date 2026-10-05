# batch9：Discordの案内・申請成功後の不具合修正

基準: `885e89ba34bfe84563f81c736b3265f7c2991562`。2026-10-05。残り97系統の監査は継続中で、全件完了ではない。

- Discoverは一部ユーザー向け実験。デスクトップとモバイルの位置、検索がデスクトップのみという条件を本文/FAQ/メタ要約へ反映。表示されない場合は既存の公式Web一覧や公開招待へ案内。
- 申請のawait後にevent.currentTargetがnullになり、成功画面へ遷移する際に例外が出る不具合を旧build+201モックで再現。フォーム参照を同期時に保持し、reset後に成功表示へ遷移する。
- 新しい申請/API/保存形式の追加はなし。Bot関連は変更しない。

## 確認

`pnpm exec tsc --noEmit`、lint、localized（79）、build（285 snapshots/272 sitemap/204 OG）、editorial-safety、editorial-snapshots、english-articles、contact-quality、safe-step-navigation PASS。

375/390/430/1440pxでDiscover条件文、空の一覧、FAQキーボード開閉、申請503時入力保持・201再送成功、戻る/進む、横幅、例外なしを確認。全APIはローカルモック、外部通信を遮断。検証スクリプトとログはvalidation/。

285ルートのローカルPages配信・CSS/JS・HEAD/query/RSC分離・robots/ads/sitemap・ZIP3個byte一致もPASS。D1 bindingなし。再base後の製品差分は検証時と同一。

## 比較の範囲と残作業

not-started: 23, partial: 13, compared: 19, partial-with-corrections: 11, compared-with-holds: 7, read-not-compared: 24

台帳のcomparedは対象主張の比較に限り、ページ全体の保証ではない。今回、運用ページと実装、FPS/GPU使用率2記事とMicrosoft/NVIDIA/AMD資料の一部を追加比較。Steam本文未取得、CPUグラフ切替UI、ゲームハブ詳細/翻訳、その他未読・未比較を継続する。未読を保留済みに置換していない。checkedAtは更新しない。

Windows/Discord実機操作、実運用の承認・30日停止実績は未検証。実ユーザー記録・本番D1に触れていない。PV効果/解決率の推定や新規計測はなし。Cloudflareブラウザログイン/CAPTCHA不使用。本PRのマージ・公開は親の確認待ち。
