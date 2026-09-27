import type { CommonGuide } from './common-guides';

export const audioGuide: CommonGuide = {
  slug: 'no-game-audio',
  title:
    'PCゲームで音が出ない時の直し方｜Windows全体・ゲームだけ無音を切り分ける',
  shortTitle: 'PCゲームで音が出ない',
  description:
    'ゲームだけ無音か、PC全体が無音か、ヘッドホンなど特定の機器だけかを先に確認。Windows 11の出力先、ゲーム別の音量ミキサー、ゲーム内の音量・出力設定を順番に調べ、結果に合わせて対処します。',
  conclusion:
    '同じヘッドホン・スピーカーで別のアプリの音が出るかを先に確認します。どのアプリも無音ならWindowsの「設定」→「システム」→「サウンド」で出力先と全体音量を確認。ゲームだけ無音ならゲームを開いたまま「音量ミキサー」のゲーム別音量・出力先を確認し、最後にゲーム内のマスター音量を調べます。設定は1項目ずつ変更し、同じ場面で聞こえるか比べてください。',
  checkedAt: '2026-09-27',
  status: 'verified',
  causes: [
    'Windows全体の出力先が、音の出ないモニターや別の機器へ切り替わっている',
    'ゲームだけ音量ミキサーでミュート、または別の出力先が指定されている',
    'ゲーム内のマスター音量・個別チャンネル・出力設定が変わっている',
    '接続機器・音声拡張・ドライバーの問題（複数のアプリにも影響する場合がある）',
  ],
  steps: [
    {
      title: '同じ出力機器で、ほかの音が聞こえるか調べる',
      actions: [
        'ゲームを起動したまま音が鳴る場面を用意し、同じヘッドホン／スピーカーで別アプリの音も試す。両方無音ならWindows全体の出力先へ、ゲームだけ無音ならゲーム別の音量ミキサーへ進む。',
        '片方のヘッドホンやモニターだけ無音なら、Windowsの「設定」→「システム」→「サウンド」→「出力」で本当に聞きたい機器が選ばれているかを確認する。HDMIやBluetoothの接続後は別の出力先へ変わる場合がある。',
      ],
    },
    {
      title: 'Windowsの出力先とゲーム別の音量を確認する',
      actions: [
        'Windows全体が無音なら「設定」→「システム」→「サウンド」で正しい「出力」を選び、全体音量と機器側の音量・ミュートを確認。別の機器に切り替えた時だけ音が出るかも比較する。',
        'ほかのアプリは鳴るならゲームを起動したまま「設定」→「システム」→「サウンド」→「音量ミキサー」を開き、「アプリ」のゲーム名のミュート・音量・出力デバイスを確認。「既定」または実際に使う機器を選び、一度ゲームを終了して起動し直す。',
        'ゲーム名が音量ミキサーに出ない場合は、音が鳴る場面まで進んで再確認。表示がないだけで原因を断定せず、ゲーム内設定・起動状態も見る。',
      ],
    },
    {
      title: 'ゲーム内の音量を確認し、同じ場面で聞き比べる',
      actions: [
        'ゲーム内「設定」→「オーディオ」または「サウンド」でマスター音量・効果音・BGM・音声が0やミュートでないか確認。ゲームに出力先の選択肢がある場合だけ、現在使う機器または「既定」へ戻す。',
        '変更後はゲームを通常終了して再起動し、変更前と同じ場面で音が戻ったか確認。戻らなければ設定値を記録して元へ戻し、ほかのゲームでも無音かを比べる。',
      ],
    },
    {
      title: '直らない場合だけ、結果に合う次の確認へ進む',
      actions: [
        '別アプリも無音ならWindows 11の「ヘルプの取得」アプリからMicrosoftのオーディオ診断を実行。機器の認識やドライバーの問題が続くならPC・ヘッドセットメーカーの公式案内へ進む。',
        'そのゲームだけ無音ならゲームの既知問題と更新状況を確認。Steam版でインストールファイルが疑わしい時はゲームファイルの整合性を確認する。Discord・録画ソフト・仮想音声機器を使う場合は1つずつ終了して比較する。',
        'Bluetoothだけ聞こえない場合は接続状態とWindowsの出力先を確認し、MicrosoftのBluetooth音声の案内へ。変更した項目と結果を記録し、原因不明のまま全デバイスのドライバーを一括変更しない。',
      ],
    },
  ],
  faqs: [
    {
      question:
        'YouTubeは聞こえるのにゲームだけ音が出ません。最初に見る画面は？',
      answer:
        'ゲームを音が鳴る場面で開いたまま、Windows 11の「設定」→「システム」→「サウンド」→「音量ミキサー」を開きます。「アプリ」に表示されたゲームの音量、ミュートと出力デバイスを確かめてからゲーム内設定を見てください。',
    },
    {
      question: 'モニターを接続した後から、ゲームも動画も無音です。',
      answer:
        'Windowsの「設定」→「システム」→「サウンド」→「出力」で、HDMI／DisplayPort側のモニターが選ばれていないか確認します。スピーカーのないモニターに出力すると無音に感じるため、使うヘッドホン・スピーカーを選び直して同じ動画とゲームで比較してください。',
    },
    {
      question:
        '音量ミキサーにゲームが表示されません。ゲームが故障していますか？',
      answer:
        '一覧に見えないだけでは判断できません。ゲームが起動して音声を再生する場面まで進め、ミキサーを開き直します。それでも表示されなければゲーム内音声設定・起動状態を確認し、ほかのゲームやアプリと比較してください。',
    },
    {
      question: 'Bluetoothヘッドホンだけ無音です。ゲームを入れ直しますか？',
      answer:
        'まずWindowsのBluetooth接続状態と「出力」にそのヘッドホンが選ばれているか確認します。有線機器では音が出るなら出力先・Bluetooth側の案内を優先し、ゲームの再インストールを最初の対処にはしません。',
    },
    {
      question: 'ゲームには「出力デバイス」の項目がありません。',
      answer:
        'すべてのゲームにその項目があるわけではありません。Windowsの音量ミキサーにあるゲーム別の出力先を確認し、ゲーム内ではマスター音量と個別の音量だけを調べてください。',
    },
  ],
  related: ['verify-steam-files', 'steam-game-not-launching', 'directx-error'],
  sources: [
    {
      label: 'Microsoft：システム音が出るのにアプリだけ無音の場合',
      url: 'https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-app-audio-not-working-while-system-sounds-work-in-windows',
    },
    {
      label: 'Microsoft：スピーカーやヘッドホンから音が出ない場合',
      url: 'https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-audio-issues-when-no-sound-plays-from-speakers-or-headphones-in-windows',
    },
    {
      label: 'Microsoft：Windowsのサウンドまたはオーディオの問題',
      url: 'https://support.microsoft.com/ja-jp/windows/hardware/audio/fix-sound-or-audio-problems-in-windows',
    },
    {
      label: 'Microsoft：Bluetooth接続中に音が出ない場合',
      url: 'https://support.microsoft.com/ja-jp/windows/hardware/bluetooth/fix-bluetooth-connected-but-no-sound-issue-on-windows',
    },
    {
      label: 'Steam：ゲームファイルの整合性確認',
      url: 'https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB',
    },
  ],
};
