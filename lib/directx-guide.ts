import type { CommonGuide } from './common-guides';

export const directxGuide: CommonGuide = {
  slug: 'directx-error',
  title: 'DirectXエラー｜機能レベル・DLL不足・GPUエラーの見分け方',
  shortTitle: 'DirectXエラー',
  description:
    'PCゲームのDirectXエラーを表示名から切り分け。DX12と機能レベル12_0の違い、d3dx9_43.dll・XINPUT1_3.dllの不足、DXGI_ERROR_DEVICE_REMOVEDなどのGPUエラーを分けて対処します。',
  conclusion:
    'エラー全文を撮影し、まず「機能レベル不足」「d3dx9_43.dllなどの追加DLL不足」「DXGI_ERROR_DEVICE_REMOVEDなどのGPUエラー」のどれかを選びます。機能レベルはdxdiagの使用GPUで照合、古いDLLだけ不足する場合はMicrosoft公式の追加ランタイム、GPUエラーはドライバー・設定・発生条件を1項目ずつ比較します。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    'ゲームの要求する機能レベルに、実際に使用しているGPUが対応していない',
    '古いゲームが使うD3DX・XInputなどの追加ランタイムが不足している',
    'ゲームの描画中にGPUデバイスがリセットされる、またはドライバーが応答しない',
    'ゲーム固有の設定・改変ファイル、破損したゲームファイルやWindows側の問題',
  ],
  steps: [
    {
      title: 'エラー全文と使用GPUを確認する',
      actions: [
        'エラーの英数字・DLL名を最後まで撮影。起動直後か、プレイ中の特定場面かを控える。下の表でエラー名ごとの確認先を選ぶ。',
        'Windowsキー＋R→dxdiag→「システム」でDirectXバージョン、「ディスプレイ」または「レンダリング」でGPU名・「機能レベル」・ドライバーの日付を確認。GPUが複数あるPCは、見ているGPUがゲーム用か確かめる。',
      ],
    },
    {
      title: '一致したエラーの対処だけを試す',
      actions: [
        '「Feature Level 12_0 required」などはゲーム公式の必要機能と対象GPUの機能レベルを比較。対応GPUが別にある場合はWindowsの「設定」→「システム」→「ディスプレイ」→「グラフィック」で対象ゲームのGPUを選ぶ。GPU自体に必要機能がなければランタイムの追加では解決しない。',
        'd3dx9_43.dllやXINPUT1_3.dllなどの不足はゲーム公式が案内するランタイムを優先。該当する古いDirectX追加ライブラリならMicrosoft公式の「DirectX エンドユーザー ランタイム」を使用する。d3d12.dllなどのWindows標準DLLとは分ける。',
        'DXGI_ERROR_DEVICE_REMOVED／HUNG／RESETなどはGPU故障と決めつけず、発生したゲーム・場面・ドライバー更新日を記録。MOD・オーバーレイ、画質やドライバー版を1項目ずつ比較する。',
      ],
    },
    {
      title: '同じ条件で再確認し、記録を残す',
      actions: [
        '再起動して同じ起動方法・同じ場面でエラーが再現するか調べる。エラーが変わったら新しい全文を控え、別種類の対処へ切り替える。',
        '解決しなければゲーム名・版、エラー全文、dxdiagの使用GPU・機能レベル・ドライバー版、発生場面、試した項目をゲームの公式サポートへ伝える。必要に応じてdxdiagの「すべての情報を保存」で記録を残す。',
      ],
    },
  ],
  faqs: [
    {
      question:
        'dxdiagにDirectX 12と出るのに、機能レベル12_0が必要と表示されます。なぜ？',
      answer:
        '「DirectXバージョン」はWindows側のランタイム、「機能レベル」はGPUとドライバー側の対応機能です。DirectX 12でも実際に使うGPUの機能レベルが11_0の場合があります。ゲームの要求レベルと使用GPUを比べてください。',
    },
    {
      question: 'd3dx9_43.dllがない場合、DLLファイルだけを入れればいいですか？',
      answer:
        '単体DLLの配布サイトから取得せず、まずゲーム公式の前提ソフトを確認します。旧DirectX SDKの追加ライブラリが必要ならMicrosoft公式「DirectX エンドユーザー ランタイム」を使用します。これでGPUの機能レベルやWindowsに入ったDirectXのバージョンは上がりません。',
    },
    {
      question:
        'DXGI_ERROR_DEVICE_REMOVEDはGPUが物理的に外れたという意味ですか？',
      answer:
        '必ずしもそうではありません。Microsoftの説明ではドライバーの更新やリセットなどでもゲームからデバイスを使えなくなる場合があります。ドライバー版、ゲームの場面、MOD・オーバーレイ、複数ゲームでも起きるかを分けて確認してください。',
    },
    {
      question:
        'd3d12.dllやdxgi.dllがないと表示されたら旧ランタイムを入れますか？',
      answer:
        '旧ゲーム向けの追加ランタイムとは対象が違います。まずDLL名とゲーム公式の必要環境を確認し、Windows Updateを実施します。複数アプリでOSのシステムファイル異常が続く場合はMicrosoft公式のDISM・システムファイルチェッカーの手順を参照してください。非公式のDLL単体配布は使用しません。',
    },
    {
      question: '「DirectX 12が使えない」場合にDX11へ切り替えていいですか？',
      answer:
        '対象ゲームの設定や公式サポートにDX11など別の描画モードがある場合のみ、元の値を控えて切り替えて比較します。全ゲームに共通する起動オプションはありません。必要な機能を持たないGPUをソフトだけで対応させる方法でもありません。',
    },
  ],
  related: [
    'gpu-driver-update',
    'pc-game-crash',
    'verify-steam-files',
    'visual-c-runtime-error',
    'vram-shortage',
  ],
  sources: [
    {
      label: 'Microsoft：dxdiagでDirectXのバージョンを確認する',
      url: 'https://support.microsoft.com/ja-jp/windows/hardware/display-graphics/which-version-of-directx-is-on-your-pc',
    },
    {
      label: 'Microsoft Learn：GPUの機能レベルとAPIのバージョンの違い',
      url: 'https://learn.microsoft.com/ja-jp/windows/win32/direct3d12/hardware-feature-levels',
    },
    {
      label: 'Microsoft：古いゲーム向けDirectXエンドユーザーランタイム',
      url: 'https://www.microsoft.com/ja-jp/download/details.aspx?id=8109',
    },
    {
      label: 'Microsoft Learn：DEVICE_REMOVEDなどのDXGIエラー',
      url: 'https://learn.microsoft.com/ja-jp/windows/win32/direct3ddxgi/dxgi-error',
    },
    {
      label: 'Microsoft：Windowsでシステムファイルチェッカーを使う',
      url: 'https://support.microsoft.com/ja-jp/windows/experience/backup-recovery/using-system-file-checker-in-windows',
    },
    {
      label: 'Steam：ゲームファイルの整合性確認',
      url: 'https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB',
    },
  ],
};
