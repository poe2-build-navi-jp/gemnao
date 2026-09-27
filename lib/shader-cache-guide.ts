import type { CommonGuide } from './common-guides';
export const shaderCacheGuide: CommonGuide = {
  slug: 'shader-cache-delete',
  title: 'シェーダーキャッシュの削除・再構築方法｜Windows・NVIDIA・AMD',
  shortTitle: 'シェーダーキャッシュ',
  description:
    'シェーダーキャッシュを消す画面をWindows・NVIDIA・AMD別に解説。ゲーム内の事前構築との違い、削除後のカクつき、終わらない時の判断、同じ場面での比較方法まで説明します。',
  conclusion:
    'WindowsのDirectXシェーダーキャッシュは「ディスク クリーンアップ」から削除できます。GPU側はNVIDIAとAMDで手順が異なるため、下の表から対象を1つ選びます。削除後は再構築で一時的に重くなることがあります。初回だけで判断せず、構築完了後に同じ場面を再確認してください。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    'キャッシュの破損による起動失敗・描画の乱れ',
    '更新後や初回起動時のシェーダー構築が未完了',
    'シェーダー以外の負荷：VRAM不足・画質設定・ストレージなど',
  ],
  steps: [
    {
      title: '症状を控え、ゲームを終了する',
      actions: [
        'ゲーム名、GPU、ドライバーの版、症状が始まった更新、止まる場面をメモする。画質設定を変えずに比較できる場面を1つ決める。',
        'ゲームとランチャーを終了する。再構築用にドライブの空き容量を確認する。初回のシェーダー構築が進んでいるだけなら、削除せず完了を待つ。',
      ],
    },
    {
      title: '対象のキャッシュだけを削除する',
      actions: [
        '以下の「Windows」「NVIDIA」「AMD」から、調べたい対象の手順を1つ実行する。全種類の一括削除はせず、1回ごとに起動して結果を比較する。',
        'ゲーム内に事前構築の表示がある場合は「ゲーム内」の例を参照する。事前構築はキャッシュ削除と同じ操作ではない。',
      ],
    },
    {
      title: '再構築を待ち、同じ場面で比較する',
      actions: [
        'ゲームを起動する。シェーダーの構築・最適化・プリロードが表示されたら、そのゲームが指定する画面で完了を待つ。所要時間はゲーム・CPU・保存先などで変わるため、一律に何分とは決めない。',
        '構築完了後に決めた場面を確認し、一度終了して再起動後にも同じ設定・同じ場面を確認する。初回だけの引っかかりと、毎回同じ場所で起こる不具合を分けて記録する。',
        '改善しなければ削除を繰り返さず、下の症状表から整合性確認・VRAM・ドライバーの切り分けへ進む。NVIDIAはキャッシュ設定を戻したことも確認する。',
      ],
    },
  ],
  faqs: [
    {
      question: 'シェーダーキャッシュを削除するとセーブも消えますか？',
      answer:
        'ここで指定したキャッシュは再利用する描画処理のデータで、セーブとは別です。ただしゲームの保存フォルダーを丸ごと消すと別のデータを失う恐れがあります。対象項目・対象フォルダーの中身だけを操作してください。',
    },
    {
      question: '毎回削除すればFPSは上がりますか？',
      answer:
        '毎回の削除は勧めません。キャッシュは同じシェーダーの再コンパイルを減らすための仕組みです。削除すると作り直しが必要になり、初回のロードやカクつきが増えることがあります。常に低いFPSは画質やGPU負荷も調べます。',
    },
    {
      question: 'DirectXシェーダーキャッシュが0バイト・表示されない時は？',
      answer:
        'その画面で削除できる対象がない可能性があります。別名のフォルダーを探して消す必要はありません。GPUやゲーム側のキャッシュまで空だとは限らないため、対象の手順と症状を照合します。',
    },
    {
      question: 'NVIDIAのShader Cache SizeをOffのままにしてよいですか？',
      answer:
        'この記事の削除手順では一時的な変更です。削除後にDriver Defaultへ戻し、Applyを押して再起動します。Offのままだとキャッシュの再利用を妨げ、比較条件も変わります。',
    },
    {
      question: 'Windowsの削除だけで全ゲームのキャッシュを消せますか？',
      answer:
        '全種類の削除は保証されません。WindowsのDirectXキャッシュ、GPUドライバー側、ゲームが管理するデータは同一ではありません。必要な対象を選び、ゲーム固有の保存先はそのゲームの案内がある場合だけ操作します。',
    },
  ],
  related: [
    'stutter-fix',
    'verify-steam-files',
    'gpu-driver-update',
    'vram-shortage',
    'pc-game-crash',
  ],
  sources: [
    {
      label: 'Intelサポート担当者：WindowsのDirectXキャッシュ削除画面',
      url: 'https://community.intel.com/t5/Gaming-on-Intel-Processors-with/CS2-crashed-Failure-Exception-IP-Module-igd10umt64xe-DLL/m-p/1757369',
    },
    {
      label: 'Microsoft：ディスク クリーンアップ・一時ファイルの削除',
      url: 'https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/free-up-drive-space-in-windows',
    },
    {
      label: 'NVIDIA：シェーダーキャッシュ削除の具体的手順（2026年5月更新）',
      url: 'https://nvidia.custhelp.com/app/answers/detail/a_id/5735/~/deleting-nvidia-shader-cache-files',
    },
    {
      label: 'NVIDIA：Shader Cache Sizeの役割・更新後の再コンパイル',
      url: 'https://www.nvidia.com/content/Control-Panel-Help/vLatest/en-us/mergedProjects/nv3d/Manage_3D_Settings_(reference).htm',
    },
    {
      label: 'AMD：Global Graphics／Advanced／Reset Shader Cache',
      url: 'https://www.amd.com/en/resources/support-articles/faqs/dh3-012.html',
    },
    {
      label: 'Activision：Black Ops 6のシェーダープリロードと待機画面',
      url: 'https://support.activision.com/black-ops-6/articles/black-ops-6-pc-troubleshooting',
    },
    {
      label: 'Epic Games：FortniteのDirectX 12と削除後の初回カクつき',
      url: 'https://www.epicgames.com/help/c-34254770/c-38015632/a11302262',
    },
  ],
};
