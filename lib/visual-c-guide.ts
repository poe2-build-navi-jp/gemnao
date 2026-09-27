import type { CommonGuide } from './common-guides';

export const visualCGuide: CommonGuide = {
  slug: 'visual-c-runtime-error',
  title: 'ゲームのVisual C++ Runtimeエラー対処｜DLL別の版とx86・x64の選び方',
  shortTitle: 'Visual C++ Runtimeエラー',
  description:
    '「MSVCP140.dllがない」「MSVCP120.dllがない」「Runtime Error」の違いから必要なVisual C++再頒布可能パッケージを絞る方法。Windowsでの導入状況の確認、ゲームのx86・x64に合う版の選択、修復やインストールが失敗した時の分岐を説明します。',
  conclusion:
    '表示されたDLL名とゲーム名を控え、140系ならMicrosoftの最新v14、120系なら2013、110系なら2012、100系なら2010の配布欄を確認します。x86・x64はWindowsではなくゲームの対象に合わせ、既に入っている同じ系列・対象なら「変更→修復」を試します。DLL名のない「Runtime Error」だけでは必要な版を決められません。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    'ゲームが必要とするVisual C++の系列またはアーキテクチャの不足',
    '導入済みの再頒布可能パッケージの破損・古い版',
    'ゲーム側の配布ファイルや別のMOD・プラグインの不具合',
    'DLL名だけでは特定できないアプリケーション側の実行時エラー',
  ],
  steps: [
    {
      title: 'エラーの全文とゲームの対象を控える',
      actions: [
        '起動時の表示を撮影し、DLL名（例：MSVCP120.dll）・エラーコード・どのEXEの起動時かを記録。表のDLL名に当てはまらない「Runtime Error」だけならVisual C++の版を決めつけず、ゲーム公式の必要条件とログを確認します。',
        'ゲームの配布元・公式サポートで32bit（x86）/64bit（x64）、必要なVisual C++の年版を確認。PCが64bitでもゲームが32bitならx86が必要です。MODやランチャーだけのエラーなら、エラーを出している実行ファイルの提供元も調べます。',
      ],
    },
    {
      title: 'Windowsで同じ系列・x86／x64の導入状況を見る',
      actions: [
        'Windowsキー＋R→「appwiz.cpl」→Enter。「プログラムと機能」からMicrosoft Visual C++ Redistributable／再頒布可能パッケージを探し、年版（または14.x）と(x86)/(x64)をそれぞれ記録。Windows 11なら「設定」→「アプリ」→「インストールされているアプリ」でも名前を確認できます。',
        '例：MSVCP120.dll不足で「2013 (x64)」だけが表示され、ゲームが32bitと判明した場合は「2013 (x86)」の不足を確認。2013 (x64)や新しいv14を消す必要はありません。名前が見つからない時も、この一覧だけでゲーム内のDLLの状態まで断定しません。',
      ],
    },
    {
      title: 'Microsoft公式の該当パッケージを修復または導入する',
      actions: [
        '記事内の対応表からMicrosoftの配布ページへ進み、エラーの系列とゲームのアーキテクチャが一致するインストーラーを選びます。2013以前が必要ならその年版を選び、最新のv14だけで置き換えたつもりにならないでください。',
        '同じ系列・アーキテクチャが導入済みなら「プログラムと機能」で対象を選択→「変更」→「修復」（表示される場合）を実行。未導入ならMicrosoft配布ページから導入します。変更や修復が表示されない場合は、該当する公式インストーラーで操作を確認します。',
      ],
    },
    {
      title: '再起動して再現を確認し、結果で次を決める',
      actions: [
        'PCを再起動し、同じ方法でゲームを起動します。DLL名が消えたらタイトル画面まで確認。別のDLL名に変わった場合は、追加で表示された名前を表で調べて必要な系列と対象を再確認します。',
        'インストール自体が失敗した場合は、画面のエラー番号を控えて「失敗した場合」の判断表へ。導入成功後も同じエラーならx86/x64の取り違え、ゲーム側のファイル破損、MOD・プラグインを確認。Steam版ならゲームの整合性確認を行い、それでも直らなければエラー全文と導入済み一覧をゲームのサポートへ渡します。',
      ],
    },
  ],
  faqs: [
    {
      question: 'Windowsが64bitなら、Visual C++もx64だけ入れればいいですか？',
      answer:
        'いいえ。必要なのはエラーを出すゲーム・プラグインの対象アーキテクチャに合うパッケージです。64bit Windows上の32bitゲームにはx86版が必要です。必要な年版も合わせて確認してください。',
    },
    {
      question:
        'MSVCP120.dllが見つからない場合、最新のv14を入れれば直りますか？',
      answer:
        '120系の候補はVisual C++ 2013です。Microsoftは2013以前をv14とは別の配布欄で案内しています。ゲーム側の必要条件とx86/x64を確かめ、2013の該当版を選んでください。',
    },
    {
      question: '2010・2013・v14の項目が複数あります。古いものを削除すべき？',
      answer:
        '削除しないでください。古い年版やx86版を別のゲームが使っている可能性があります。今回のエラーに対応する系列・アーキテクチャだけを修復または追加して結果を比べます。',
    },
    {
      question:
        '「Runtime Error!」だけでDLL名がありません。どれを入れればいい？',
      answer:
        'その表示だけでは年版・x86/x64を決められません。ゲームの公式動作環境、エラー時に動いていたプラグイン、配布元が用意する前提ソフトを確認してください。導入済みの一覧を撮影してサポートに伝えると切り分けやすくなります。',
    },
    {
      question: 'Microsoftのセットアップが失敗して1603と表示されます。',
      answer:
        '1603は一般的な失敗コードで原因を一つに決められません。セットアップの表示とログを保存し、Windows Updateと再起動、該当アーキテクチャの既存導入状況を確認してください。既存パッケージを一括削除したり、配布元不明のDLLをコピーしたりしないでください。',
    },
  ],
  related: [
    'steam-game-not-launching',
    'verify-steam-files',
    'directx-error',
    'pc-game-crash',
  ],
  sources: [
    {
      label: 'Microsoft：Visual C++再頒布可能パッケージの各年版・x86/x64',
      url: 'https://learn.microsoft.com/ja-jp/cpp/windows/latest-supported-vc-redist',
    },
    {
      label: 'Microsoft：Windowsでアプリ・プログラムを修復する',
      url: 'https://support.microsoft.com/ja-jp/windows/apps/repair-apps-and-programs-in-windows',
    },
    {
      label: 'Microsoft：Visual C++再頒布可能パッケージのインストール問題',
      url: 'https://learn.microsoft.com/ja-jp/cpp/windows/troubleshoot-vc-redistributable-installation-issues',
    },
    {
      label: 'Steam：ゲームファイルの整合性確認',
      url: 'https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB',
    },
  ],
};
