import type { FollowupGuide } from './types';

export const apexVersionMismatchGuide: FollowupGuide = {
  gameSlug: 'apex-legends',
  gameName: 'Apex Legends',
  slug: 'game-version-mismatch',
  category: 'launch',
  checkedAt: '2026-10-14',
  sources: [
    {
      url: 'https://help.ea.com/en/articles/apex-legends/error-codes/',
      labels: {
        ja: 'EA：Apexのエラー・バージョン不一致（英語）',
        en: 'EA: Apex error codes and version mismatch',
        zh: 'EA：Apex 错误与版本不匹配（英语）',
        es: 'EA: errores y versión incompatible de Apex (inglés)',
      },
    },
    {
      url: 'https://www.playstation.com/en-us/support/hardware/playstation-system-software-application-version/',
      labels: {
        ja: 'PlayStation：ゲーム更新の確認（英語）',
        en: 'PlayStation: check game updates',
        zh: 'PlayStation：检查游戏更新（英语）',
        es: 'PlayStation: comprobar actualizaciones del juego (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title:
        'Apex「ゲームのバージョンがホストと一致しない」の直し方｜更新の確認順',
      shortTitle: 'ホストとのバージョン不一致',
      description:
        'Apexのホストとのバージョン不一致は、まずゲーム更新を確認。Steam・EA app・家庭用機を分け、更新中・完了後も残る・別エラーになった場合の次の確認を案内します。',
      lead: '「Game version does not match host」または同じ意味の表示で参加できない場合が対象です。通信切断やJavelinの起動エラーは別記事で扱います。',
      summary:
        'EAはこの表示を古いパッチで動いている場合のエラーと説明しています。再インストールの前に、使っている機種・ランチャーでゲーム更新を確認して完了を待ち、ゲームを起動し直します。更新後も同じ表示なら、全文と更新状況を記録してEAの案内へ進みます。',
      quickFacts: [
        {
          label: '最初の確認',
          value: 'ゲームの更新が完了したか',
        },
        {
          label: '区別する状態',
          value: 'ダウンロード中・インストール中・完了',
        },
        {
          label: '適用範囲',
          value: 'ホストとのバージョン不一致の表示',
        },
      ],
      diagnosis: [
        {
          symptom: '更新の進捗がある',
          cause: '完了を待つ',
          stepId: 'check-platform-update',
        },
        {
          symptom: '更新済みなのに同じ表示',
          cause: '終了・再起動後の状態を比較',
          stepId: 'restart-compare',
        },
        {
          symptom: 'code:netやJavelinに変わった',
          cause: '違う症状の入口へ',
          stepId: 'choose-next',
        },
      ],
      steps: [
        {
          id: 'record-version',
          title: '全文と機種を記録する',
          summary: '同じ「参加できない」でも番号や文面で入口が変わります。',
          actions: [
            'エラー全文、発生時刻、自分と同じパーティーの利用機種、PCならランチャーを控える。相手の設定を勝手に変えず、それぞれ更新状況を確認してもらう。',
            '更新待ちか、更新自体のエラーかを分ける。古いパッチのファイルや非公式の修正ツールは入れない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'check-platform-update',
          title: '使っている機種でゲーム更新を確認する',
          summary: '本体更新とゲーム更新を混同しません。',
          actions: [
            'Steamはダウンロード画面のApexの状態を確認し、ダウンロードとインストールの完了まで待つ。EA appなど別ランチャーではApexの更新表示を確認し、そのランチャーの公式案内に従う。',
            'XboxはマイゲームとアプリでApexを選択→メニュー→管理→更新を確認。PS5／PS4はゲームを選択してOPTIONS→アップデートを確認。Switch系はEAページから機種別サポートを確認し、ゲームソフトの更新も確認する。',
            '更新が失敗・停止する場合は、その全文と空き容量・進捗を記録してプラットフォームの更新サポートへ。完了していないままゲーム修復を重ねない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'restart-compare',
          title: '更新完了後にゲームを起動し直す',
          summary: '同じ文面かどうかを比較して次を決めます。',
          actions: [
            'ゲームを終了してランチャーの更新状態を読み直し、同じ方法で起動する。変化がなければ作業を保存して機器を再起動する。',
            'パーティー参加でのみ発生するなら、各自の更新完了後に再参加して結果を記録する。ホスト側だけの故障とは決めつけない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
        {
          id: 'choose-next',
          title: '残ったエラーに合わせて相談する',
          summary: '更新確認で直らなければ同じ操作を際限なく繰り返しません。',
          actions: [
            '同じ表示なら、機種・ランチャー・全文・更新完了の状態・再起動結果をEAへ伝える。公式に障害や配信待ちの告知がある場合は案内を待つ。',
            'code:net／code:leafなら接続記事へ、Javelinと出る起動エラーなら専用記事へ。バージョン不一致を解消する目的でBIOSやセキュリティ設定を変更しない。',
          ],
          time: '確認の目安：3〜5分',
          risk: 'low',
        },
      ],
      avoid: [
        '旧版パッチへの差し戻しや非公式実行ファイルを使わない',
        '更新確認より先にゲーム全体の再インストールやネットワーク設定リセットを繰り返さない',
      ],
      cautions: [
        '公式確認日：2026-10-14。実機での再現・解決を示すものではありません。',
        'PC以外は機種別公式案内を優先します。表示名は言語や機種で異なります。',
      ],
      faqs: [
        {
          question: '更新中の表示が消えればすぐ直りますか？',
          answer:
            '進捗が消えたことだけでなく更新完了を確認し、ゲームを起動し直して同じエラーが出るか比較します。',
        },
        {
          question: 'ホストの人だけが更新すればよいですか？',
          answer:
            '自分のゲームも確認します。表示の名前だけでどちら側が古いかを断定せず、参加者それぞれの更新状況を揃えます。',
        },
      ],
      related: [
        {
          href: '/games/apex-legends/code-net-leaf',
          label: 'code:net・code:leafの接続エラー',
        },
        {
          href: '/games/apex-legends/javelin-launch-error',
          label: 'Javelinの起動エラー',
        },
      ],
    },
    en: {
      title: 'Apex “Game Version Does Not Match Host”: Check Updates in Order',
      shortTitle: 'Game version does not match host',
      description:
        'Check Apex updates by platform before reinstalling. Separate downloads in progress, completed updates and a different error after restarting.',
      lead: 'For the message “Game version does not match host”. Connection drops and Javelin launch errors use separate guides.',
      summary:
        'EA associates this message with an outdated game patch. Check updates on the platform or launcher you actually use, wait for installation to finish and restart the game. If the same message remains, record it with the update status for EA support.',
      quickFacts: [
        {
          label: 'First check',
          value: 'Has the game update finished?',
        },
        {
          label: 'Separate',
          value: 'Downloading, installing and completed',
        },
        {
          label: 'Scope',
          value: 'The host version mismatch message',
        },
      ],
      diagnosis: [
        {
          symptom: 'Update progress is visible',
          cause: 'Wait for completion',
          stepId: 'check-platform-update',
        },
        {
          symptom: 'Same message after updating',
          cause: 'Compare after restarting',
          stepId: 'restart-compare',
        },
        {
          symptom: 'Now code:net or Javelin',
          cause: 'Use the matching symptom guide',
          stepId: 'choose-next',
        },
      ],
      steps: [
        {
          id: 'record-version',
          title: 'Record the message and platform',
          summary: 'Different join failures need different checks.',
          actions: [
            'Note the full message, time, your platform and launcher, and the platforms used by party members. Ask each person to check their own update status.',
            'Separate pending updates from update failures. Do not install old patch files or unofficial repair tools.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'check-platform-update',
          title: 'Check the game update on your platform',
          summary: 'A system update is not the same as a game update.',
          actions: [
            'In Steam Downloads, check Apex and wait for both download and installation to finish. In EA app or another launcher, check its Apex update status and follow that launcher’s official help.',
            'On Xbox, select Apex in My games & apps, then Menu, Manage All and Updates. On PS5/PS4, highlight the game, press OPTIONS and check for updates. For Switch systems, follow the model-specific support linked by EA and check game software updates too.',
            'If updating fails or stalls, record the message, free space and progress for platform support. Do not stack repairs while the update remains incomplete.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'restart-compare',
          title: 'Relaunch after the update finishes',
          summary: 'Compare the exact message before choosing another step.',
          actions: [
            'Close the game, recheck launcher update status and launch normally. If unchanged, save your work and restart the device.',
            'If it only happens when joining a party, compare again after everyone finishes updating. Do not assume only the host has a fault.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
        {
          id: 'choose-next',
          title: 'Choose the next check from the remaining error',
          summary: 'Do not repeat the same update check indefinitely.',
          actions: [
            'If unchanged, give EA the platform, launcher, message, completed-update status and restart result. Follow any official outage or rollout notice that applies.',
            'For code:net/code:leaf use the connection guide; for a Javelin launch message use its guide. Do not change BIOS or security settings to fix a version mismatch.',
          ],
          time: 'Allow 3–5 min to check',
          risk: 'low',
        },
      ],
      avoid: [
        'Do not downgrade patches or use unofficial executables.',
        'Do not repeatedly reinstall or reset networking before checking updates.',
      ],
      cautions: [
        'Sources checked on 2026-10-14; no hands-on reproduction or guaranteed fix is claimed.',
        'For consoles, prioritize model-specific official help. Labels vary by platform and language.',
      ],
      faqs: [
        {
          question: 'Does the progress bar disappearing prove it is fixed?',
          answer:
            'Confirm the update completed, relaunch and compare the actual message.',
        },
        {
          question: 'Does only the host need to update?',
          answer:
            'Check your own game too. The message alone does not establish which participant has an old version; each person should check.',
        },
      ],
      related: [
        {
          href: '/en/games/apex-legends/code-net-leaf',
          label: 'code:net and code:leaf connection errors',
        },
        {
          href: '/en/games/apex-legends/javelin-launch-error',
          label: 'Javelin launch errors',
        },
      ],
    },
    zh: {
      title: 'Apex「游戏版本与主机不匹配」：按平台检查更新',
      shortTitle: '游戏版本与主机不匹配',
      description:
        '先按平台检查 Apex 游戏更新，再考虑重新安装。区分下载中、安装中、更新完成以及重启后的不同错误。',
      lead: '适用于 Game version does not match host 或同义提示。连接中断和 Javelin 启动错误请使用专用文章。',
      summary:
        'EA 将此提示解释为游戏运行在旧补丁上。先在实际使用的平台或启动器检查游戏更新，等待安装完成后重启游戏。仍有同一提示时，记录全文和更新状态并咨询 EA。',
      quickFacts: [
        {
          label: '首先检查',
          value: '游戏更新是否完成',
        },
        {
          label: '区分状态',
          value: '下载中、安装中、已完成',
        },
        {
          label: '适用范围',
          value: '与主机版本不匹配的提示',
        },
      ],
      diagnosis: [
        {
          symptom: '显示更新进度',
          cause: '等待完成',
          stepId: 'check-platform-update',
        },
        {
          symptom: '更新后仍有同一提示',
          cause: '重启后比较',
          stepId: 'restart-compare',
        },
        {
          symptom: '变为 code:net 或 Javelin',
          cause: '转到对应症状文章',
          stepId: 'choose-next',
        },
      ],
      steps: [
        {
          id: 'record-version',
          title: '记录完整提示和平台',
          summary: '无法加入并不只有一种原因。',
          actions: [
            '记录提示全文、时间、自己的平台和启动器，以及队友的平台。请各自检查更新，不擅自修改他人设置。',
            '区分等待更新与更新失败，不安装旧补丁文件或非官方修复工具。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'check-platform-update',
          title: '在当前平台检查游戏更新',
          summary: '主机系统更新与游戏更新不是一回事。',
          actions: [
            'Steam 中查看下载页面的 Apex 状态，等待下载和安装完成。EA app 或其他启动器则查看 Apex 更新状态并按该平台官方说明操作。',
            'Xbox 在我的游戏和应用中选 Apex，经菜单进入管理和更新。PS5／PS4 选中游戏后按 OPTIONS 检查更新。Switch 系列按 EA 链接进入对应机型支持，并检查游戏软件更新。',
            '更新失败或停住时，记录错误、剩余空间和进度，联系平台支持。更新未完成时不要叠加修复操作。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'restart-compare',
          title: '更新完成后重新启动游戏',
          summary: '比较是否仍为同一提示。',
          actions: [
            '关闭游戏并再次确认启动器更新状态，然后正常启动。无变化时保存工作并重启设备。',
            '仅加入队伍时发生的话，在各自更新完成后重新加入并记录结果。不认定只有房主的设备有问题。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
        {
          id: 'choose-next',
          title: '按剩余错误选择下一步',
          summary: '不要无休止重复相同检查。',
          actions: [
            '仍有同一提示时，向 EA 提供平台、启动器、全文、更新完成状态和重启结果。有适用的官方维护或发布说明时按公告等待。',
            'code:net／code:leaf 转连接文章；Javelin 启动提示转专用文章。不为版本不匹配修改 BIOS 或安全设置。',
          ],
          time: '检查约需 3–5 分钟',
          risk: 'low',
        },
      ],
      avoid: [
        '不回退旧补丁，不使用非官方可执行文件。',
        '检查更新前不反复重装游戏或重置网络。',
      ],
      cautions: [
        '资料核对日期：2026-10-14；未声称实机复现或保证修复。',
        '主机优先参考对应机型官方说明，界面名称可能随语言和平台不同。',
      ],
      faqs: [
        {
          question: '进度条消失就说明修好了吗？',
          answer: '还需确认更新完成并重新启动游戏，比较实际错误是否消失。',
        },
        {
          question: '只有房主需要更新吗？',
          answer:
            '也应检查自己的游戏。提示本身不能确定哪位玩家使用旧版本，应各自核对。',
        },
      ],
      related: [
        {
          href: '/zh/games/apex-legends/code-net-leaf',
          label: 'code:net 与 code:leaf 连接错误',
        },
        {
          href: '/zh/games/apex-legends/javelin-launch-error',
          label: 'Javelin 启动错误',
        },
      ],
    },
    es: {
      title: 'Apex: la versión del juego no coincide con la del anfitrión',
      shortTitle: 'Versión incompatible con el anfitrión',
      description:
        'Comprueba las actualizaciones de Apex por plataforma antes de reinstalar. Distingue descarga, instalación, actualización completada y errores distintos tras reiniciar.',
      lead: 'Para el mensaje Game version does not match host o su equivalente. Las desconexiones y los errores de Javelin tienen guías propias.',
      summary:
        'EA relaciona este mensaje con un parche antiguo. Comprueba las actualizaciones en tu plataforma o lanzador, espera a que termine la instalación y reinicia el juego. Si sigue el mismo mensaje, anótalo junto al estado de actualización para consultar a EA.',
      quickFacts: [
        {
          label: 'Primera comprobación',
          value: '¿Ha terminado la actualización del juego?',
        },
        {
          label: 'Distingue',
          value: 'Descarga, instalación y finalización',
        },
        {
          label: 'Ámbito',
          value: 'Mensaje de versión incompatible con el anfitrión',
        },
      ],
      diagnosis: [
        {
          symptom: 'Hay progreso de actualización',
          cause: 'Espera a que termine',
          stepId: 'check-platform-update',
        },
        {
          symptom: 'Mismo mensaje tras actualizar',
          cause: 'Compara después de reiniciar',
          stepId: 'restart-compare',
        },
        {
          symptom: 'Ahora aparece code:net o Javelin',
          cause: 'Consulta la guía de ese síntoma',
          stepId: 'choose-next',
        },
      ],
      steps: [
        {
          id: 'record-version',
          title: 'Anota el mensaje y la plataforma',
          summary: 'No todos los fallos al unirse son iguales.',
          actions: [
            'Anota mensaje completo, hora, plataforma y lanzador, además de las plataformas del grupo. Pide a cada persona que compruebe sus actualizaciones.',
            'Distingue actualizaciones pendientes de fallos al actualizar. No instales parches antiguos ni reparadores no oficiales.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'check-platform-update',
          title: 'Comprueba la actualización del juego',
          summary: 'Actualizar el sistema no equivale a actualizar el juego.',
          actions: [
            'En Descargas de Steam, comprueba Apex y espera a que terminen descarga e instalación. En EA app u otro lanzador, consulta el estado de Apex y su ayuda oficial.',
            'En Xbox, selecciona Apex en Mis juegos y aplicaciones, abre Menú, Administrar todo y Actualizaciones. En PS5/PS4, selecciona el juego, pulsa OPTIONS y busca actualizaciones. En Switch, sigue el soporte del modelo enlazado por EA y comprueba también el software del juego.',
            'Si se detiene o falla, anota mensaje, espacio libre y progreso para el soporte de la plataforma. No acumules reparaciones con la actualización incompleta.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'restart-compare',
          title: 'Vuelve a iniciar tras completar la actualización',
          summary: 'Compara el mensaje exacto antes de seguir.',
          actions: [
            'Cierra el juego, revisa de nuevo el estado del lanzador y abre normalmente. Si no cambia, guarda tu trabajo y reinicia el dispositivo.',
            'Si solo falla al unirte a un grupo, repite después de que todos terminen de actualizar. No atribuyas el problema solo al anfitrión.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
        {
          id: 'choose-next',
          title: 'Elige según el error que queda',
          summary: 'No repitas indefinidamente la misma comprobación.',
          actions: [
            'Si continúa, facilita a EA plataforma, lanzador, mensaje, estado de actualización y resultado del reinicio. Sigue los avisos oficiales de incidencia o distribución que correspondan.',
            'Para code:net/code:leaf usa la guía de conexión; para un mensaje de Javelin, su guía. No cambies BIOS o seguridad para resolver una versión incompatible.',
          ],
          time: 'Comprobación: unos 3–5 min',
          risk: 'low',
        },
      ],
      avoid: [
        'No vuelvas a parches antiguos ni uses ejecutables no oficiales.',
        'No reinstales o restablezcas la red repetidamente antes de comprobar actualizaciones.',
      ],
      cautions: [
        'Fuentes consultadas el 2026-10-14; no se afirma reproducción en un equipo ni solución garantizada.',
        'En consolas, prioriza el soporte oficial del modelo. Los nombres varían según idioma y plataforma.',
      ],
      faqs: [
        {
          question: '¿Que desaparezca la barra demuestra que se ha resuelto?',
          answer:
            'Confirma que terminó la actualización, abre el juego y compara el mensaje real.',
        },
        {
          question: '¿Solo debe actualizar el anfitrión?',
          answer:
            'Comprueba también tu juego. El mensaje no determina quién usa una versión antigua; cada participante debe revisarlo.',
        },
      ],
      related: [
        {
          href: '/es/games/apex-legends/code-net-leaf',
          label: 'Errores de conexión code:net y code:leaf',
        },
        {
          href: '/es/games/apex-legends/javelin-launch-error',
          label: 'Errores de inicio de Javelin',
        },
      ],
    },
  },
  relatedSlugs: ['code-net-leaf', 'javelin-launch-error'],
};
