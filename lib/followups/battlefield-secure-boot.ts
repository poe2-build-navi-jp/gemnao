import type { FollowupGuide } from './types';

export const battlefieldSecureBootGuide: FollowupGuide = {
  gameSlug: 'battlefield-6',
  gameName: 'Battlefield 6',
  slug: 'secure-boot-enabled-not-launching',
  category: 'launch',
  checkedAt: '2026-10-13',
  sources: [
    {
      url: 'https://www.ea.com/games/battlefield/battlefield-6/news/secure-boot-information',
      labels: {
        ja: 'EA：Battlefield 6のSecure Boot要件（英語）',
        en: 'EA: Battlefield 6 Secure Boot requirement',
        zh: 'EA：Battlefield 6 安全启动要求（英语）',
        es: 'EA: requisito de Secure Boot en Battlefield 6 (inglés)',
      },
    },
    {
      url: 'https://help.ea.com/en/articles/technical-issues/secure-boot/',
      labels: {
        ja: 'EA：Secure Bootの状態確認と機種別案内（英語）',
        en: 'EA: Secure Boot checks and manufacturer guidance',
        zh: 'EA：安全启动检查与厂商指南（英语）',
        es: 'EA: comprobaciones de Secure Boot y guía del fabricante (inglés)',
      },
    },
    {
      url: 'https://help.ea.com/en/articles/battlefield/battlefield-6/error-codes/',
      labels: {
        ja: 'EA：Battlefield 6のエラー別案内（英語）',
        en: 'EA: Battlefield 6 error messages',
        zh: 'EA：Battlefield 6 错误提示（英语）',
        es: 'EA: errores de Battlefield 6 (inglés)',
      },
    },
    {
      url: 'https://support.microsoft.com/en-us/windows/security/encryption/find-your-bitlocker-recovery-key',
      labels: {
        ja: 'Microsoft：BitLocker回復キー（英語）',
        en: 'Microsoft: BitLocker recovery key',
        zh: 'Microsoft：BitLocker 恢复密钥（英语）',
        es: 'Microsoft: clave de recuperación de BitLocker (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title:
        'Battlefield 6でセキュアブート有効なのに起動しない｜Windows側の確認',
      shortTitle: 'Secure Boot有効でも起動しない',
      description:
        'BF6のSecure Boot表示をBIOSのEnabledだけで判断せず、msinfo32のOn・UEFI、再起動とTPM状態を確認。94との分岐、機種別相談と回復キーの準備を案内します。',
      lead: 'BIOSで有効にしたつもりでもBattlefield 6がSecure Bootを求める、またはWindowsでOnでも止まる場合向けです。設定を何度も切り替える前に表示を照合します。',
      summary:
        'Windows＋R→msinfo32で「BIOSモード：UEFI」「セキュアブートの状態：有効」を確認します。BIOSのEnabled表示だけでは判断しません。有効化後は再起動して再確認し、On＋UEFIでも続く場合は全文を記録します。94ならJavelin記事へ、その他はEAへ相談し、万能なBIOS変更があるとは考えないでください。',
      quickFacts: [
        {
          label: 'Windowsで読む',
          value: 'msinfo32：UEFI／有効（On）',
        },
        {
          label: '94が出ている',
          value: 'Javelinの起動・導入先確認へ',
        },
        {
          label: '変更前の必須準備',
          value: 'バックアップ・回復キー・機種別公式手順',
        },
      ],
      diagnosis: [
        {
          symptom: 'BIOSはEnabledだがWindows未確認',
          cause: 'msinfo32で実際の表示を読む',
          stepId: 'read-windows-secure-boot',
        },
        {
          symptom: '有効化直後／再起動が未実施',
          cause: '再起動後とTPMの状態を記録',
          stepId: 'restart-and-read-tpm',
        },
        {
          symptom: 'Off・Legacy・Unsupported',
          cause: '変更せず機種別の確認へ',
          stepId: 'prepare-manufacturer-help',
        },
        {
          symptom: 'On＋UEFIでも止まる',
          cause: '全文と状態で相談先を分ける',
          stepId: 'report-secure-boot',
        },
      ],
      steps: [
        {
          id: 'read-windows-secure-boot',
          title: 'msinfo32でWindows側の表示を読む',
          summary: 'BIOS画面のEnabledと区別します。',
          actions: [
            'ゲームのエラー全文と時刻を記録し、Windows＋R→msinfo32→システム情報を開く。',
            '「BIOSモード」と「セキュアブートの状態」を控える。UEFI・有効（On）なら次の再確認へ。',
            'Off、Legacy、Unsupported、不明な表示ならSTEP 3へ進む。起動モードやCSMを先に切り替えない。',
          ],
          risk: 'low',
          note: '状態を読むだけなので戻す設定はありません。公式はPC版BF6にSecure Bootを要求しています。',
          time: '確認・記録：約3〜5分',
        },
        {
          id: 'restart-and-read-tpm',
          title: '再起動後の表示とTPMを確認',
          summary: 'EAは有効化後の追加再起動が必要な場合も案内しています。',
          actions: [
            '作業を保存してPCを再起動し、msinfo32の2項目をもう一度読む。繰り返しオン・オフを切り替えない。',
            'Windows＋R→tpm.mscで状態と仕様バージョンを控える。EAの準備案内はTPM 2.0も確認対象ですが、ここでは読むだけでクリア・初期化をしない。',
            '準備未完了、1.2、未検出などはその表示を記録してメーカーへ。On＋UEFIで止まる場合も、TPMの種類を推測で変更しない。',
          ],
          risk: 'low',
          note: 'TPM表示だけで部品不足や故障と断定しません。製造元バージョンと仕様バージョンを取り違えないでください。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'prepare-manufacturer-help',
          title: '機種別相談と回復手段を揃える',
          summary: '表示不一致を汎用BIOS操作で直そうとしません。',
          actions: [
            '正確なPC／マザーボードの機種名とWindowsの表示をメーカーへ伝える。Legacy・Unsupportedや画面の不一致はここで止める。',
            '設定変更を検討する前に重要データをバックアップし、BitLocker／デバイス暗号化の回復キーを別端末から確認できることを確かめる。管理されたPCは管理者へ相談する。',
            '機種の公式手順と復旧方法が確認できるまで変更しない。TPMクリア、Secure Bootキーの削除、ディスク変換、汎用BIOS更新を試さない。',
          ],
          risk: 'low',
          note: '回復キーは公開画像・回答欄・相談文へ載せません。復旧も正確な機種の公式案内に従います。',
          time: '確認・記録：約3〜5分',
        },
        {
          id: 'report-secure-boot',
          title: '残る全文から相談先を選ぶ',
          summary: 'On＋UEFIでも残る場合の万能修正は確認されていません。',
          actions: [
            'Javelin (94)が出るなら専用記事のEA app起動・導入先確認へ。Secure Boot不良と同じものとして扱わない。',
            '他の表示は、全文、Windowsの版、機種、msinfo32の2項目、TPM状態・仕様、再起動結果をEAへ伝える。',
            '変更済みの項目があれば記録する。キーの公開、保護停止、フォーラムの未確認の起動モード変更は追加しない。',
          ],
          risk: 'low',
          guideLink: {
            href: '/games/battlefield-6/javelin-error-94',
            label: '実際のエラーがJavelin 94の場合',
          },
          time: '確認・記録：約3〜5分',
        },
      ],
      avoid: [
        'Onなのに直らないことをキー故障やBANと断定しない',
        'TPMクリア・Secure Bootキー削除・汎用BIOS更新をしない',
        'Legacy/UEFI切替やディスク変換を一律に行わない',
      ],
      cautions: [],
      faqs: [
        {
          question: 'BIOSでEnabledならWindowsもOnですか？',
          answer:
            '必ず同じ表示とは限りません。EAの案内に沿ってmsinfo32のBIOSモードとSecure Boot状態を読み、違う場合は正確な機種のメーカーへ確認します。',
        },
        {
          question: 'On＋UEFIでも起動しないなら何を変更しますか？',
          answer:
            '一律に変更する項目は確認できていません。再起動後の全文を確認し、94ならJavelin手順、他は状態を添えてEAへ相談します。',
        },
      ],
      related: [
        {
          href: '/games/battlefield-6/javelin-error-94',
          label: 'Javelinエラー94',
        },
      ],
    },
    en: {
      title:
        'Battlefield 6 Will Not Launch with Secure Boot Enabled: Check Windows State',
      shortTitle: 'Secure Boot On but launch blocked',
      description:
        'Check BF6 Secure Boot in Windows, not only BIOS Enabled. Record msinfo32 On/UEFI, restart and TPM status, separate error 94 and prepare model-specific support.',
      lead: 'For Battlefield 6 still requesting Secure Boot after you enabled it in BIOS, or remaining blocked while Windows reports On. Compare the actual states before toggling settings.',
      summary:
        'Open Windows + R → msinfo32 and confirm BIOS Mode: UEFI and Secure Boot State: On. BIOS Enabled alone is not enough to assess Windows state. Restart after enabling and recheck. If On plus UEFI still fails, record the full error: use the Javelin guide for 94 and EA support for other messages rather than assuming a universal BIOS fix.',
      quickFacts: [
        {
          label: 'Read in Windows',
          value: 'msinfo32: UEFI / On',
        },
        {
          label: 'Error 94 appears',
          value: 'Check Javelin launch and installation',
        },
        {
          label: 'Before any change',
          value: 'Backup, recovery access and exact-model instructions',
        },
      ],
      diagnosis: [
        {
          symptom: 'BIOS Enabled; Windows not checked',
          cause: 'Read msinfo32',
          stepId: 'read-windows-secure-boot',
        },
        {
          symptom: 'Just enabled or not restarted',
          cause: 'Recheck after restart and read TPM',
          stepId: 'restart-and-read-tpm',
        },
        {
          symptom: 'Off, Legacy or Unsupported',
          cause: 'Stop for model-specific guidance',
          stepId: 'prepare-manufacturer-help',
        },
        {
          symptom: 'On plus UEFI still blocked',
          cause: 'Use the full message for escalation',
          stepId: 'report-secure-boot',
        },
      ],
      steps: [
        {
          id: 'read-windows-secure-boot',
          title: 'Read Windows state in msinfo32',
          summary: 'Distinguish it from BIOS Enabled.',
          actions: [
            'Record the game’s complete message and time. Press Windows + R, enter msinfo32 and open System Information.',
            'Record BIOS Mode and Secure Boot State. For UEFI and On, continue to the restart check.',
            'For Off, Legacy, Unsupported or an unclear result, go to Step 3. Do not switch boot mode or CSM first.',
          ],
          risk: 'low',
          note: 'Reading these fields needs no rollback. EA requires Secure Boot for Battlefield 6 on PC.',
          time: 'About 3–5 minutes to read and record',
        },
        {
          id: 'restart-and-read-tpm',
          title: 'Recheck after restart and read TPM',
          summary:
            'EA notes that another restart can be needed after enabling.',
          actions: [
            'Save work, restart the PC and read both msinfo32 fields again. Do not repeatedly toggle Secure Boot.',
            'Open Windows + R → tpm.msc and record status and Specification Version. EA’s preparation guide also checks TPM 2.0; read only, without clearing or initializing it.',
            'Record not-ready, 1.2 or not-detected results for the manufacturer. Do not speculate and switch TPM types even if On plus UEFI still fails.',
          ],
          risk: 'low',
          note: 'A TPM message alone does not prove missing or failed hardware. Specification Version and Manufacturer Version are different.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'prepare-manufacturer-help',
          title: 'Prepare model-specific help and recovery',
          summary:
            'Do not fix mismatched states with generic firmware changes.',
          actions: [
            'Give the manufacturer your exact PC/motherboard model and Windows readings. Stop here for Legacy, Unsupported or screens that differ from instructions.',
            'Before considering changes, back up important files and confirm access to the BitLocker/device-encryption recovery key from another device. Managed PCs go to their administrator.',
            'Make no change until the exact model’s official procedure and recovery steps are clear. Do not clear TPM, delete Secure Boot keys, convert disks or apply generic BIOS updates.',
          ],
          risk: 'low',
          note: 'Never put recovery keys in public screenshots, feedback or support descriptions. Recovery also needs exact-model guidance.',
          time: 'About 3–5 minutes to read and record',
        },
        {
          id: 'report-secure-boot',
          title: 'Use the remaining message to choose support',
          summary: 'No universal fix is verified for every On-plus-UEFI case.',
          actions: [
            'For Javelin (94), use its dedicated EA app launch and installation checks. Do not equate it with a Secure Boot fault.',
            'For other messages, give EA the full text, Windows version, model, both msinfo32 fields, TPM state/version and restart result.',
            'Record any settings already changed. Do not add key disclosure, disabled protection or unverified forum boot-mode changes.',
          ],
          risk: 'low',
          guideLink: {
            href: '/en/games/battlefield-6/javelin-error-94',
            label: 'Check an actual Javelin error 94',
          },
          time: 'About 3–5 minutes to read and record',
        },
      ],
      avoid: [
        'Do not infer broken keys or a ban from continued failure with On',
        'Do not clear TPM, delete Secure Boot keys or apply generic BIOS updates',
        'Do not routinely switch Legacy/UEFI or convert disks',
      ],
      cautions: [],
      faqs: [
        {
          question: 'Does BIOS Enabled guarantee Windows shows On?',
          answer:
            'Do not assume the readings are identical. Follow EA’s msinfo32 check for BIOS Mode and Secure Boot State, and consult the exact-model manufacturer if they differ.',
        },
        {
          question: 'What should I change if On plus UEFI still fails?',
          answer:
            'No single change is verified for every case. Check the full post-restart message: use Javelin steps for 94 or send EA the recorded states for other messages.',
        },
      ],
      related: [
        {
          href: '/en/games/battlefield-6/javelin-error-94',
          label: 'Javelin error 94',
        },
      ],
    },
    zh: {
      title: 'Battlefield 6 安全启动已开启仍无法启动：检查 Windows 状态',
      shortTitle: '安全启动开启仍被阻止',
      description:
        '不只看 BIOS 的 Enabled，核对 BF6 的 msinfo32 On／UEFI、重启与 TPM 状态。区分 94，准备机型支持与恢复密钥。',
      lead: '适用于已在 BIOS 开启安全启动，BF6 仍要求启用，或 Windows 显示 On 仍无法启动的情况。先对照实际状态，不反复切换设置。',
      summary:
        'Windows＋R→msinfo32，确认 BIOS 模式为 UEFI、安全启动状态为开启（On）。不能只凭 BIOS 的 Enabled 判断。启用后重启并再读状态；On＋UEFI 仍失败时记录完整错误，94 转到 Javelin 指南，其他提示咨询 EA，不假设存在通用 BIOS 修复。',
      quickFacts: [
        {
          label: '在 Windows 读取',
          value: 'msinfo32：UEFI／On',
        },
        {
          label: '出现 94',
          value: '检查 Javelin 启动与安装',
        },
        {
          label: '修改前准备',
          value: '备份、恢复密钥与准确机型的官方步骤',
        },
      ],
      diagnosis: [
        {
          symptom: 'BIOS Enabled，未查 Windows',
          cause: '读取 msinfo32',
          stepId: 'read-windows-secure-boot',
        },
        {
          symptom: '刚启用或尚未重启',
          cause: '重启后核对并读取 TPM',
          stepId: 'restart-and-read-tpm',
        },
        {
          symptom: 'Off、Legacy 或 Unsupported',
          cause: '停止并咨询机型支持',
          stepId: 'prepare-manufacturer-help',
        },
        {
          symptom: 'On＋UEFI 仍被阻止',
          cause: '按完整提示选择支持渠道',
          stepId: 'report-secure-boot',
        },
      ],
      steps: [
        {
          id: 'read-windows-secure-boot',
          title: '在 msinfo32 读取 Windows 状态',
          summary: '与 BIOS 的 Enabled 分开记录。',
          actions: [
            '记录游戏完整提示和时间，Windows＋R 输入 msinfo32，打开系统信息。',
            '记录 BIOS 模式和安全启动状态；UEFI 与 On 时继续下一项重启确认。',
            'Off、Legacy、Unsupported 或不明确时转第 3 步，不先切换启动模式或 CSM。',
          ],
          risk: 'low',
          note: '读取不需要回滚。EA 要求 PC 版 Battlefield 6 使用安全启动。',
          time: '检查与记录约 3–5 分钟',
        },
        {
          id: 'restart-and-read-tpm',
          title: '重启后核对并读取 TPM',
          summary: 'EA 提醒启用后可能还需要再重启。',
          actions: [
            '保存工作并重启 PC，再读 msinfo32 两项，不反复开关安全启动。',
            'Windows＋R→tpm.msc，记录状态与规范版本。EA 的准备指南也检查 TPM 2.0；这里只读取，不清除或初始化。',
            '未就绪、1.2 或未检测到时记录显示并询问厂商；即使 On＋UEFI 仍失败，也不猜测切换 TPM 类型。',
          ],
          risk: 'low',
          note: 'TPM 提示本身不能证明硬件缺失或损坏，不要混淆制造商版本和规范版本。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'prepare-manufacturer-help',
          title: '准备机型支持与恢复方式',
          summary: '不使用通用固件修改处理状态不一致。',
          actions: [
            '向厂商说明准确 PC／主板型号与 Windows 读数。Legacy、Unsupported 或界面不符时停在这里。',
            '考虑修改前先备份重要文件，并确认能从另一台设备取得 BitLocker／设备加密恢复密钥。受管理电脑找管理员。',
            '准确机型的官方流程与恢复方法明确前不修改，不清除 TPM、删除安全启动密钥、转换磁盘或尝试通用 BIOS 更新。',
          ],
          risk: 'low',
          note: '恢复密钥不能出现在公开图片、反馈或求助描述中。恢复操作也要使用准确机型的官方说明。',
          time: '检查与记录约 3–5 分钟',
        },
        {
          id: 'report-secure-boot',
          title: '按剩余提示选择支持',
          summary: '尚未确认适用于所有 On＋UEFI 情况的万能修复。',
          actions: [
            'Javelin (94) 应使用专文中的 EA app 启动与安装检查，不等同于安全启动故障。',
            '其他提示应向 EA 提供全文、Windows 版本、机型、msinfo32 两项、TPM 状态与规范版本、重启结果。',
            '记录已修改项目，不追加公开密钥、关闭保护或论坛中未经核实的启动模式变更。',
          ],
          risk: 'low',
          guideLink: {
            href: '/zh/games/battlefield-6/javelin-error-94',
            label: '检查实际出现的 Javelin 94',
          },
          time: '检查与记录约 3–5 分钟',
        },
      ],
      avoid: [
        '不因 On 仍失败就断定密钥损坏或封禁',
        '不清除 TPM、删除安全启动密钥或通用更新 BIOS',
        '不统一切换 Legacy／UEFI 或转换磁盘',
      ],
      cautions: [],
      faqs: [
        {
          question: 'BIOS Enabled 就保证 Windows 是 On 吗？',
          answer:
            '不要假设显示必然一致。按 EA 指南读取 msinfo32 的 BIOS 模式与安全启动状态，不一致时咨询准确机型的厂商。',
        },
        {
          question: 'On＋UEFI 仍失败该改什么？',
          answer:
            '尚无适用于所有情况的单项修改。确认重启后的完整提示；94 用 Javelin 步骤，其他提示连同状态交给 EA。',
        },
      ],
      related: [
        {
          href: '/zh/games/battlefield-6/javelin-error-94',
          label: 'Javelin 错误 94',
        },
      ],
    },
    es: {
      title:
        'Battlefield 6 no inicia con Secure Boot activado: comprobar Windows',
      shortTitle: 'Secure Boot activado y bloqueo',
      description:
        'No te bases solo en Enabled del BIOS. Comprueba On/UEFI en msinfo32, reinicio y TPM, distingue el error 94 y prepara ayuda del fabricante y recuperación.',
      lead: 'Para BF6 que sigue pidiendo Secure Boot tras activarlo en BIOS, o se bloquea aunque Windows indique On. Compara los estados antes de alternar ajustes.',
      summary:
        'Abre Windows + R → msinfo32 y comprueba Modo de BIOS: UEFI y Estado de arranque seguro: Activado/On. Enabled en BIOS no basta para valorar Windows. Reinicia tras activarlo y revisa otra vez. Si On y UEFI siguen sin funcionar, registra el error: usa Javelin para 94 o consulta a EA para otros mensajes, sin suponer una solución universal de BIOS.',
      quickFacts: [
        {
          label: 'Leer en Windows',
          value: 'msinfo32: UEFI / Activado',
        },
        {
          label: 'Aparece 94',
          value: 'Comprueba inicio e instalación de Javelin',
        },
        {
          label: 'Antes de cambiar',
          value: 'Copia, clave de recuperación y guía del modelo',
        },
      ],
      diagnosis: [
        {
          symptom: 'BIOS Enabled; Windows sin comprobar',
          cause: 'Consulta msinfo32',
          stepId: 'read-windows-secure-boot',
        },
        {
          symptom: 'Recién activado o sin reiniciar',
          cause: 'Revisa tras reiniciar y lee TPM',
          stepId: 'restart-and-read-tpm',
        },
        {
          symptom: 'Off, Legacy o Unsupported',
          cause: 'Detente y consulta el modelo',
          stepId: 'prepare-manufacturer-help',
        },
        {
          symptom: 'On y UEFI pero sigue bloqueado',
          cause: 'Usa el mensaje completo para consultar',
          stepId: 'report-secure-boot',
        },
      ],
      steps: [
        {
          id: 'read-windows-secure-boot',
          title: 'Lee el estado de Windows en msinfo32',
          summary: 'Distingue este dato de Enabled en BIOS.',
          actions: [
            'Registra el mensaje completo del juego y la hora. Pulsa Windows + R, introduce msinfo32 y abre Información del sistema.',
            'Anota Modo de BIOS y Estado de arranque seguro. Si son UEFI y Activado/On, continúa con el reinicio.',
            'Para Off, Legacy, Unsupported o un resultado incierto, ve al paso 3. No cambies primero el modo de arranque ni CSM.',
          ],
          risk: 'low',
          note: 'Consultar estos campos no necesita reversión. EA exige Secure Boot para BF6 en PC.',
          time: 'Unos 3–5 minutos para consultar y anotar',
        },
        {
          id: 'restart-and-read-tpm',
          title: 'Revisa tras reiniciar y consulta TPM',
          summary:
            'EA indica que puede hacer falta otro reinicio tras activarlo.',
          actions: [
            'Guarda el trabajo, reinicia el PC y vuelve a leer ambos campos. No actives y desactives Secure Boot repetidamente.',
            'Abre Windows + R → tpm.msc y anota estado y versión de especificación. La preparación de EA también comprueba TPM 2.0; solo consulta, sin borrar ni inicializar.',
            'Registra No preparado, 1.2 o No detectado para el fabricante. No cambies el tipo de TPM por suposición aunque On y UEFI no basten.',
          ],
          risk: 'low',
          note: 'Un mensaje de TPM no prueba falta o avería del hardware. Versión del fabricante y versión de especificación son datos distintos.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'prepare-manufacturer-help',
          title: 'Prepara ayuda del modelo y recuperación',
          summary: 'No corrijas diferencias con cambios genéricos de firmware.',
          actions: [
            'Entrega al fabricante el modelo exacto del PC/placa y los datos de Windows. Detente ante Legacy, Unsupported o pantallas distintas de la guía.',
            'Antes de considerar cambios, haz copia de los archivos importantes y confirma acceso a la clave de BitLocker/cifrado del dispositivo desde otro equipo. Consulta al administrador en equipos gestionados.',
            'No cambies nada hasta conocer la guía y recuperación del modelo. No borres TPM ni claves Secure Boot, conviertas discos o apliques actualizaciones genéricas de BIOS.',
          ],
          risk: 'low',
          note: 'No publiques claves en imágenes, comentarios o descripciones de soporte. La recuperación también requiere la guía exacta del modelo.',
          time: 'Unos 3–5 minutos para consultar y anotar',
        },
        {
          id: 'report-secure-boot',
          title: 'Elige soporte según el mensaje restante',
          summary:
            'No hay una corrección universal verificada para todos los casos On y UEFI.',
          actions: [
            'Para Javelin (94), usa su guía de inicio con EA app e instalación. No lo equipares a un fallo de Secure Boot.',
            'Para otros mensajes, entrega a EA texto completo, Windows, modelo, ambos campos de msinfo32, estado/versión TPM y resultado del reinicio.',
            'Registra los ajustes ya modificados. No añadas publicación de claves, protección desactivada ni cambios de arranque no verificados de foros.',
          ],
          risk: 'low',
          guideLink: {
            href: '/es/games/battlefield-6/javelin-error-94',
            label: 'Comprobar un error Javelin 94 real',
          },
          time: 'Unos 3–5 minutos para consultar y anotar',
        },
      ],
      avoid: [
        'No deduzcas claves dañadas o sanción de que siga fallando con On',
        'No borres TPM ni claves Secure Boot ni actualices BIOS de forma genérica',
        'No cambies Legacy/UEFI ni conviertas discos de forma general',
      ],
      cautions: [],
      faqs: [
        {
          question: '¿Enabled en BIOS garantiza On en Windows?',
          answer:
            'No asumas que ambos datos coinciden. Sigue la comprobación de EA en msinfo32 y consulta al fabricante del modelo exacto si difieren.',
        },
        {
          question: '¿Qué cambio si On y UEFI siguen sin funcionar?',
          answer:
            'No hay un cambio único verificado para todos los casos. Lee el mensaje tras reiniciar: usa Javelin para 94 o entrega los estados a EA para otros errores.',
        },
      ],
      related: [
        {
          href: '/es/games/battlefield-6/javelin-error-94',
          label: 'Error 94 de Javelin',
        },
      ],
    },
  },
  relatedSlugs: ['javelin-error-94'],
};
