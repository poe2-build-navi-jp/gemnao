import type { MyGamesLocale } from './my-games-copy';
// A report is not an independently replicated experiment. Unknown values stay null.
export const reportedCases = [
  {
    slug: 'wilds-steam-added-dll',
    gameSlug: 'monster-hunter-wilds',
    articlePath: '/games/monster-hunter-wilds/not-launching',
    stepId: 'steam-client-isolation',
    reviewedOn: '2026-10-14',
    reportedOn: null,
    priorRecordOn: '2026-10-03',
    gameVersion: null,
    steamVersion: null,
    cpu: 'Intel Core i5-14400F',
    gpu: 'NVIDIA GeForce RTX 4060 Ti',
    sources: [
      {
        url: 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process',
        name: 'Microsoft Learn: Get-Process',
        checkedOn: '2026-10-14',
      },
      {
        url: 'https://github.com/OpenSteam001/OpenSteamTool/blob/main/README.md',
        name: 'OpenSteamTool: developer README',
        checkedOn: '2026-10-14',
      },
      {
        url: 'https://steamcommunity.com/app/2246340/discussions/0/596267902352499612/',
        name: 'Capcom: official troubleshooting thread',
        checkedOn: '2026-10-14',
      },
    ],
    copy: {
      ja: {
        jaGuide: '（日本語）',
        title: 'Wilds実例：Steam側の追加DLLを切り離した後に遊べた本人報告',
        summary:
          'i5-14400F・RTX 4060 TiのPCで、Steamからの起動直後にタイトル前で終了し、追加DLLの切り離し後は起動・プレイできたという1件の本人報告です。特定DLLの原因証明や、同じGPUなら直るという保証ではありません。',
        badge: '本人報告1件・独立再現なし',
        conditions: '報告された条件',
        cpu: 'CPU',
        gpu: 'GPU',
        platform: 'PC・Steam製品版',
        symptom: 'Steamの「プレイ」から起動するとタイトル前に終了',
        prior: '先に試したこと',
        tried: [
          'Steamの整合性確認では再取得がなかった。',
          'SteamオーバーレイOFF等では解決しなかった。',
        ],
        change: '変更と結果',
        changed:
          'Steam側の追加DLL（OpenSteamTool.dll関連）を切り離した後、起動して遊べるようになり、PC再起動後も遊べたと本人が報告。',
        documented:
          '既存記事の記録ではSteam直下の追加ローダーだけをバックアップして復元可能な形で一時停止し、読み込み元を再確認しています。Windows本体のDLLやセーブの削除ではありません。正確な前提・中止条件・復元手順は元の記事を参照してください。',
        limits: '分かっていないこと',
        unknown: '未記録',
        reportDate: '本人報告の正確な日時',
        priorDate: '元記事の改善報告記録日（日本時間）',
        gameVersion: '本人のゲーム版',
        steamVersion: '本人のSteam版',
        reviewed: '記録・資料の確認日',
        limitations: [
          'ドライバー版、Windows版、プレイ時間・再起動の回数は未記録。',
          '本人の申告を編集した記録で、編集部による独立した実機再現ではありません。',
          '一度に複数のローダーを切り離したため、原因DLLを1つに特定できません。CPU故障とも断定できません。',
          '公式資料と開発元資料は確認方法・構成の裏付けであり、このPCでの改善や現在の全環境での有効性を証明しません。',
        ],
        safety: '別のPCでの確認',
        safe: '名前だけでDLLを削除したり、セキュリティを無効にしたりしないでください。導入元・読み込み元・セーブの保存先・復元方法が分からない場合は操作を止めて相談してください。',
        guide: '前提と復元可能な確認手順を読む',
        sources: '出典と、その出典が示す範囲',
        sourceNote:
          '体験の出典は本人申告（公開検証ログなし）。以下は一般の確認方法・構成・公式相談窓口です。導入の推奨ではありません。',
        cite: 'この実例の参照リンクをコピー',
        copied: '参照リンクをコピーしました。',
        copyError:
          'コピーできませんでした。下のURLを選択してコピーしてください。',
        link: '参照URL',
      },
      en: {
        jaGuide: ' (Japanese)',
        title:
          'Wilds case: a player could play after isolating added Steam DLLs',
        summary:
          'One player with an i5-14400F and RTX 4060 Ti reported a crash before the title screen after pressing Play in Steam, then could launch and play after isolating added Steam DLLs. This does not prove which DLL caused the crash or guarantee a fix on similar GPUs.',
        badge: 'One self-report; not independently reproduced',
        conditions: 'Reported conditions',
        cpu: 'CPU',
        gpu: 'GPU',
        platform: 'PC, Steam retail version',
        symptom: 'Exits before the title screen after pressing Play in Steam',
        prior: 'Earlier checks',
        tried: [
          'Steam verification did not reacquire files.',
          'Disabling the Steam overlay and other attempted checks did not resolve it.',
        ],
        change: 'Change and reported result',
        changed:
          'After isolating added DLLs on the Steam side, associated with OpenSteamTool.dll, the player reported being able to launch and play, including after restarting the PC.',
        documented:
          'The existing guide records backing up only identified added Steam-root loaders, temporarily disabling them reversibly, and checking load paths again. It does not describe deleting Windows DLLs or saves. Read the original guide for prerequisites, stop conditions and restoration details.',
        limits: 'What remains unknown',
        unknown: 'Not recorded',
        reportDate: 'Exact time of the player report',
        priorDate: 'Improvement record in the original guide (Japan time)',
        gameVersion: 'Player’s game version',
        steamVersion: 'Player’s Steam version',
        reviewed: 'Record and reference review date',
        limitations: [
          'Driver and Windows versions, play duration and restart count were not recorded.',
          'This is an edited self-report, not an independent hardware test by the editorial team.',
          'Several loaders were isolated together, so no single causal DLL was established. CPU failure was not established either.',
          'Official and developer references support the inspection method and configuration, not the reported improvement or effectiveness on all current systems.',
        ],
        safety: 'Checking another PC',
        safe: 'Do not delete DLLs by name or disable security protection. Stop and seek help if the source, load path, save locations or restoration method are unknown.',
        guide: 'Read prerequisites and reversible checks',
        sources: 'References and their scope',
        sourceNote:
          'The outcome comes from the player’s own report, without public verification logs. These references cover general inspection, configuration and official support. They are not an installation recommendation.',
        cite: 'Copy a reference link to this case',
        copied: 'Reference link copied.',
        copyError: 'Could not copy. Select and copy the URL below.',
        link: 'Reference URL',
      },
      zh: {
        jaGuide: '（日语）',
        title: 'Wilds实例：隔离Steam额外DLL后可以游玩的本人反馈',
        summary:
          '一位使用i5-14400F和RTX 4060 Ti的玩家反馈，点击Steam的开始游戏后，在标题画面之前退出；隔离Steam额外DLL后可以启动并游玩。这不能证明某个DLL是原因，也不保证相同显卡都有效。',
        badge: '仅1条本人反馈，未独立复现',
        conditions: '反馈中的条件',
        cpu: 'CPU',
        gpu: 'GPU',
        platform: 'PC、Steam正式版',
        symptom: '点击Steam的开始游戏后，在标题画面之前退出',
        prior: '此前的检查',
        tried: [
          'Steam验证完整性没有重新获取文件。',
          '关闭Steam叠加界面等尝试未解决问题。',
        ],
        change: '变更与反馈结果',
        changed:
          '隔离Steam侧与OpenSteamTool.dll相关的额外DLL后，本人反馈能够启动并游玩，重启电脑后也可以游玩。',
        documented:
          '现有指南记录了仅备份已确认的Steam根目录额外加载器，以可恢复的方式临时停用，然后重新检查加载路径。没有删除Windows DLL或存档。前提、中止条件和恢复方法请参阅原指南。',
        limits: '尚不清楚的事项',
        unknown: '未记录',
        reportDate: '本人反馈的准确时间',
        priorDate: '原指南中改善反馈的记录日期（日本时间）',
        gameVersion: '本人使用的游戏版本',
        steamVersion: '本人使用的Steam版本',
        reviewed: '记录与资料核对日期',
        limitations: [
          '未记录驱动和Windows版本、游玩时长及重启次数。',
          '这是整理后的本人反馈，不是编辑部独立进行的实机验证。',
          '同时隔离了多个加载器，不能确定某个DLL是原因，也不能判定CPU故障。',
          '官方和开发者资料支持检查方法与配置说明，不证明此电脑的改善或当前所有环境均有效。',
        ],
        safety: '在其他电脑上检查',
        safe: '不要只按名称删除DLL或关闭安全保护。若不知道来源、加载路径、存档位置或恢复方法，请停止操作并咨询。',
        guide: '阅读前提与可恢复的检查步骤',
        sources: '来源及其适用范围',
        sourceNote:
          '体验结果来自本人反馈，没有公开验证日志。以下资料说明一般检查、配置及官方支持渠道，并非安装推荐。',
        cite: '复制此实例的引用链接',
        copied: '已复制引用链接。',
        copyError: '无法复制，请选择下方URL并复制。',
        link: '引用URL',
      },
      es: {
        jaGuide: ' (japonés)',
        title:
          'Caso Wilds: un jugador pudo jugar tras aislar DLL añadidas a Steam',
        summary:
          'Un jugador con i5-14400F y RTX 4060 Ti informó que el juego se cerraba antes del título tras pulsar Jugar en Steam y que pudo iniciarlo y jugar después de aislar DLL añadidas a Steam. No demuestra qué DLL causaba el fallo ni garantiza que funcione con GPU similares.',
        badge: 'Un testimonio; sin reproducción independiente',
        conditions: 'Condiciones comunicadas',
        cpu: 'CPU',
        gpu: 'GPU',
        platform: 'PC, versión comercial de Steam',
        symptom: 'Cierre antes del título tras pulsar Jugar en Steam',
        prior: 'Comprobaciones anteriores',
        tried: [
          'La verificación de Steam no volvió a descargar archivos.',
          'Desactivar la superposición de Steam y otras pruebas no lo resolvió.',
        ],
        change: 'Cambio y resultado comunicado',
        changed:
          'Tras aislar DLL añadidas al lado de Steam, relacionadas con OpenSteamTool.dll, el jugador comunicó que podía iniciar y jugar, también después de reiniciar el PC.',
        documented:
          'La guía existente registra una copia de seguridad de los cargadores añadidos e identificados en la raíz de Steam, su desactivación temporal reversible y otra revisión de las rutas de carga. No describe borrar DLL de Windows ni partidas. Consulta la guía original para los requisitos, cuándo detenerse y cómo restaurar.',
        limits: 'Lo que no sabemos',
        unknown: 'No registrado',
        reportDate: 'Fecha y hora exactas del testimonio',
        priorDate: 'Registro de mejora en la guía original (hora de Japón)',
        gameVersion: 'Versión del juego del jugador',
        steamVersion: 'Versión de Steam del jugador',
        reviewed: 'Fecha de revisión del registro y referencias',
        limitations: [
          'No se registraron las versiones del controlador y Windows, la duración de juego ni el número de reinicios.',
          'Es un testimonio editado, no una prueba independiente del equipo editorial.',
          'Se aislaron varios cargadores a la vez: no se identificó una única DLL causante ni se demostró un fallo de CPU.',
          'Las referencias oficiales y del desarrollador respaldan el método de inspección y la configuración, no la mejora comunicada ni su eficacia en todos los sistemas actuales.',
        ],
        safety: 'Comprobar otro PC',
        safe: 'No borres DLL por su nombre ni desactives la protección. Detente y pide ayuda si desconoces el origen, la ruta de carga, las ubicaciones de partidas o cómo restaurar.',
        guide: 'Leer requisitos y comprobaciones reversibles',
        sources: 'Referencias y su alcance',
        sourceNote:
          'El resultado procede del testimonio del jugador, sin registros públicos de verificación. Estas referencias cubren inspección general, configuración y soporte oficial; no recomiendan instalar herramientas.',
        cite: 'Copiar enlace de referencia a este caso',
        copied: 'Enlace copiado.',
        copyError: 'No se pudo copiar. Selecciona y copia la URL inferior.',
        link: 'URL de referencia',
      },
    },
  },
] as const;
export type ReportedCase = (typeof reportedCases)[number];
export const casePath = (item: ReportedCase, locale: MyGamesLocale = 'ja') =>
  `${locale === 'ja' ? '' : `/${locale}`}/examples/${item.slug}`;
export const reportedCaseBySlug = (slug: string) =>
  reportedCases.find((item) => item.slug === slug);
