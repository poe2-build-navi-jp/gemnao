import type { FollowupGuide } from './types';

export const valorantLaunchGuide: FollowupGuide = {
  gameSlug: 'valorant',
  gameName: 'VALORANT',
  slug: 'not-launching-no-van',
  category: 'launch',
  checkedAt: '2026-10-13',
  sources: [
    {
      url: 'https://support.riotgames.com/en-us/riot/connectivity/riot-client-full-repair-tool',
      labels: {
        ja: 'Riot：クライアントの完全修復（英語）',
        en: 'Riot: Client Full Repair Tool',
        zh: 'Riot：客户端完整修复（英语）',
        es: 'Riot: reparación completa del cliente (inglés)',
      },
    },
    {
      url: 'https://support.riotgames.com/en-us/riot/performance/troubleshooting-game-launching-errors',
      labels: {
        ja: 'Riot：ゲーム起動エラーの分岐（英語）',
        en: 'Riot: game-launching errors',
        zh: 'Riot：游戏启动错误分支（英语）',
        es: 'Riot: errores al iniciar juegos (inglés)',
      },
    },
    {
      url: 'https://support.riotgames.com/en-us/riot/performance/uninstall-and-disable-vanguard',
      labels: {
        ja: 'Riot：Vanguardの通常アンインストール・再導入（英語）',
        en: 'Riot: normal Vanguard uninstall and reinstall',
        zh: 'Riot：正常卸载与重装 Vanguard（英语）',
        es: 'Riot: desinstalar y reinstalar Vanguard normalmente (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title: 'VALORANTが起動しない・VAN番号なし｜Riot Client修復と次の確認',
      shortTitle: 'VAN番号なし・起動しない',
      description:
        'VAN9003/9001以外のVALORANT起動失敗を切り分け。Riot Clientの修復、任意アプリ・GPUの確認、必要時の正規Vanguard再導入と相談記録を案内します。',
      lead: 'プレイを押しても開かない、System/Critical ErrorやFailed to Launchが出るなど、VAN番号がないPC版向けです。VAN9003・VAN9001は専用記事で確認します。',
      summary:
        'まずエラー全文と止まる段階を記録し、PCとRiot Clientを再起動します。VAN番号がなければ、Riot Clientのプロフィール→設定→VALORANT→修復を試します。続く場合は任意アプリや公式GPUドライバーを1項目ずつ確認し、必要時だけ通常手順でVanguardを再導入します。保護停止や広範なキャッシュ削除は行いません。',
      quickFacts: [
        {
          label: '対象',
          value: 'VAN番号なしの起動失敗',
        },
        {
          label: '修復の入口',
          value: 'Riot Client：プロフィール→設定→VALORANT→修復',
        },
        {
          label: '途中でVANが出た',
          value: '番号別の記事へ切り替える',
        },
      ],
      diagnosis: [
        {
          symptom: 'プレイ後に開かない／System Error',
          cause: '全文と発生段階を確認',
          stepId: 'record-non-van-launch',
        },
        {
          symptom: 'クライアントは開ける',
          cause: 'Riotの修復を実行',
          stepId: 'repair-riot-client',
        },
        {
          symptom: '修復後も同じ',
          cause: '任意アプリ・GPU情報を比較',
          stepId: 'compare-launch-environment',
        },
        {
          symptom: '正規再導入でも残る／別コード',
          cause: '結果をまとめて相談',
          stepId: 'report-non-van-launch',
        },
      ],
      steps: [
        {
          id: 'record-non-van-launch',
          title: 'VAN番号の有無と全文を確認',
          summary: '同じ「起動しない」でも次の確認は異なります。',
          actions: [
            'VAN RESTRICTION 5やVAN9005なら番号が異なるため、このSTEPのリンクと関連記事から専用の確認へ進む。',
            'プレイ後に何が表示されるか、全文、時刻、Windowsの版を控える。System/Critical/Failed to Launchなどの文言は省略しない。',
            '作業を保存してPCを再起動し、Riot Clientから一度起動して比較する。更新が進行中なら完了を待つ。',
            'VAN9003はSecure Boot、VAN9001はTPMの記事へ。ほかのVAN番号も公式の番号別案内へ進み、一般手順を重ねない。',
          ],
          risk: 'low',
          note: '職場・学校のPCや権限不足は管理者へ。起動失敗だけを理由にBIOSへ進みません。',
          time: '確認・記録：約3〜5分',
          guideLink: {
            href: '/games/valorant/van-restriction-5',
            label: 'VAN RESTRICTION 5：HVCIの確認',
          },
        },
        {
          id: 'repair-riot-client',
          title: 'Riot ClientでVALORANTを修復',
          summary: '対象ゲームを選んでファイルを確認します。',
          actions: [
            'ゲームを終了してRiot Clientにログインし、右上のプロフィールアイコン→設定を開く。',
            'VALORANTを選び、修復（Repair）を押して画面の指示に従う。完了してから同じ起動を比較する。',
            '修復ボタンがない・クライアントが開けない・処理が失敗する場合は、表示と全文を記録してSTEP 5へ。フォルダー削除で代用しない。',
          ],
          risk: 'low',
          note: '修復は欠落・破損したファイルを直す可能性がありますが、成功しても原因や解決が確定するわけではありません。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'compare-launch-environment',
          title: '任意アプリとGPU情報を確認',
          summary: '変更は1つずつ、元の状態を記録します。',
          actions: [
            '自分で開いた不要な録画・オーバーレイなどの作業を保存し、1つだけ通常終了して比較する。変わらなければ再度開いて戻す。',
            'GPU名とドライバー版を記録し、Riotの公式案内からメーカーの更新情報を確認する。必要な更新は機種別手順で行い、ほかの比較と同時にしない。',
            '戻す必要がある場合はメーカーの公式手順で記録した版への復旧を確認する。不明なら変更を止め、Windowsサービスやウイルス対策を停止しない。',
          ],
          risk: 'medium',
          note: 'この一般手順ではクリーンブート、レジストリ変更、セキュリティ除外を扱いません。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'reinstall-vanguard-normally',
          title: '必要時だけVanguardを正規再導入',
          summary: 'Riotの案内やサポートで再導入が必要な場合の手順です。',
          actions: [
            'Riot関連のゲームとクライアントを終了する。Windowsの「アプリの追加と削除」でRiot Vanguardを選び、通常のアンインストールを行う。管理されたPCは管理者に依頼する。',
            'PCを再起動後、Riot ClientまたはVALORANTを開き、正規のVanguard再導入を完了する。再起動を求められたら従う。',
            '完了後に起動結果を比較する。通常削除・再導入が失敗した場合はそこで止めてRiotへ相談し、サービス削除コマンドや.sys削除は使わない。',
          ],
          risk: 'medium',
          note: 'Vanguardを外したままでは遊べません。戻すには正規に再導入を完了します。他のVanguard依存ゲームにも影響するため、作業前に終了します。',
          time: '処理時間は環境により異なります',
        },
        {
          id: 'report-non-van-launch',
          title: '未解決の全文と比較結果を相談',
          summary: '別の番号が出た場合は対象を切り替えます。',
          actions: [
            'RiotへWindowsの版、GPUとドライバー版、止まる段階、全文、修復・アプリ比較・再導入の結果を伝える。未実施項目はそのまま記録する。',
            '途中でVAN9003/9001が出たら専用記事へ。番号なしのままならRiotの公式窓口へ進み、根拠なくTPMや起動モードを切り替えない。',
            'ログや画像は必要なものだけ共有し、公開の回答欄にアカウント情報や個人情報を貼らない。',
          ],
          risk: 'low',
          guideLink: {
            href: '/games/valorant/van9003',
            label: 'VAN9003が表示された場合',
          },
          time: '確認・記録：約3〜5分',
        },
      ],
      avoid: [
        'AppDataやゲームフォルダーを一括削除しない',
        'ウイルス対策・Vanguardを無効化して回避しない',
        'サービス削除、任意DLL/.sys取得・削除をしない',
      ],
      cautions: [],
      faqs: [
        {
          question: 'VAN番号がなくてもTPMを変更しますか？',
          answer:
            '起動しないという症状だけでは変更しません。Riot Clientの修復と全文の確認を先に行い、実際に表示された要件で分岐します。',
        },
        {
          question: '修復できないならVanguardを消せばよいですか？',
          answer:
            '無条件には進めません。修復エラーを記録し、Riotの案内やサポートに従います。再導入する場合も通常の削除と正規の再導入を完了し、外した状態を回避策にしません。',
        },
      ],
      related: [
        {
          href: '/games/valorant/van-restriction-5',
          label: 'VAN RESTRICTION 5：HVCIの確認',
        },
        {
          href: '/games/valorant/van9005',
          label: 'VAN9005：TPM・UEFI・メモリ整合性',
        },
        {
          href: '/games/valorant/van9003',
          label: 'VAN9003・セキュアブート',
        },
        {
          href: '/games/valorant/van9001',
          label: 'VAN9001・TPM 2.0',
        },
      ],
    },
    en: {
      title:
        'VALORANT Will Not Launch Without a VAN Code: Riot Client Repair and Next Checks',
      shortTitle: 'No VAN code: launch failure',
      description:
        'Separate non-VAN VALORANT launch failures from VAN9003/9001. Use Riot Client repair, compare optional apps and GPU information, then supported reinstallation if needed.',
      lead: 'For VALORANT on PC that will not open after Play, or shows System/Critical Error or Failed to Launch without a VAN number. VAN9003 and VAN9001 have dedicated guides.',
      summary:
        'Record the full message and failure stage, then restart the PC and Riot Client. Without a VAN number, try Riot Client Profile → Settings → VALORANT → Repair. If it continues, check optional apps and official GPU guidance one at a time. Use normal Vanguard reinstallation only when needed; do not disable protection or broadly delete caches.',
      quickFacts: [
        {
          label: 'Scope',
          value: 'Launch failure without a VAN number',
        },
        {
          label: 'Repair route',
          value: 'Riot Client: Profile → Settings → VALORANT → Repair',
        },
        {
          label: 'A VAN number appears',
          value: 'Switch to the code-specific guide',
        },
      ],
      diagnosis: [
        {
          symptom: 'No launch or System Error',
          cause: 'Record the full message and stage',
          stepId: 'record-non-van-launch',
        },
        {
          symptom: 'The client opens',
          cause: 'Use Riot’s repair tool',
          stepId: 'repair-riot-client',
        },
        {
          symptom: 'Same result after repair',
          cause: 'Compare optional apps and GPU information',
          stepId: 'compare-launch-environment',
        },
        {
          symptom: 'Still fails or a new code appears',
          cause: 'Summarize results for support',
          stepId: 'report-non-van-launch',
        },
      ],
      steps: [
        {
          id: 'record-non-van-launch',
          title: 'Check the full message and VAN number',
          summary: 'Different launch failures need different checks.',
          actions: [
            'For VAN RESTRICTION 5 or VAN9005, use this step’s link and related guides for that exact number.',
            'Record what follows Play, the complete message, time and Windows version. Keep the full System/Critical/Failed to Launch wording.',
            'Save work, restart the PC and compare one launch from Riot Client. Wait for an update if it is still progressing.',
            'Use the Secure Boot guide for VAN9003 and TPM guide for VAN9001. Other VAN numbers also go to official code-specific guidance instead of accumulating general fixes.',
          ],
          risk: 'low',
          note: 'Ask the administrator on managed PCs or without access. A launch failure alone is not a reason to change BIOS.',
          time: 'About 3–5 minutes to read and record',
          guideLink: {
            href: '/en/games/valorant/van-restriction-5',
            label: 'VAN RESTRICTION 5: HVCI checks',
          },
        },
        {
          id: 'repair-riot-client',
          title: 'Repair VALORANT in Riot Client',
          summary: 'Select the correct game for file repair.',
          actions: [
            'Close the game, sign in to Riot Client and open the top-right profile icon → Settings.',
            'Choose VALORANT, select Repair and follow the prompts. Compare the same launch after completion.',
            'If Repair is absent, the client cannot open or the process fails, record the full result and go to Step 5. Do not replace repair with folder deletion.',
          ],
          risk: 'low',
          note: 'Repair may address missing or corrupted files. Completion alone neither identifies the cause nor guarantees a fix.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'compare-launch-environment',
          title: 'Check optional apps and GPU information',
          summary: 'Record the starting state and change one thing at a time.',
          actions: [
            'Save work in an optional recorder or overlay you opened, close only that app normally and compare. Reopen it if nothing changes.',
            'Record the GPU and driver version. Use Riot’s official guidance to find manufacturer updates. Follow the model’s instructions for any needed update and test it separately.',
            'If restoration is needed, consult the manufacturer’s official procedure for the recorded driver version. Stop if unclear; do not stop Windows services or antivirus.',
          ],
          risk: 'medium',
          note: 'This general procedure does not use clean boot, registry changes or security exclusions.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'reinstall-vanguard-normally',
          title: 'Reinstall Vanguard normally if needed',
          summary:
            'Use this when Riot guidance or support calls for reinstallation.',
          actions: [
            'Close Riot games and the client. In Windows Add or Remove programs, select Riot Vanguard and use its normal uninstall. Ask the administrator on managed PCs.',
            'Restart the PC, then open Riot Client or VALORANT to complete legitimate Vanguard reinstallation. Follow any restart prompt.',
            'Compare launch after installation. If normal uninstall or reinstall fails, stop and contact Riot; do not use service-deletion commands or delete .sys files.',
          ],
          risk: 'medium',
          note: 'Vanguard must be installed to play. Restore it through legitimate reinstallation. Other Vanguard-dependent games are affected, so close them before starting.',
          time: 'Duration depends on the task and device',
        },
        {
          id: 'report-non-van-launch',
          title: 'Report the full remaining error and results',
          summary: 'Switch scope if a new number appears.',
          actions: [
            'Give Riot the Windows version, GPU/driver version, failure stage, full message and repair, app-comparison and reinstall results. Mark steps you did not perform.',
            'Use the dedicated guide if VAN9003 or VAN9001 appears. If no number appears, consult Riot support without speculatively switching TPM or boot mode.',
            'Share only requested logs or images and keep account/private information out of public article feedback.',
          ],
          risk: 'low',
          guideLink: {
            href: '/en/games/valorant/van9003',
            label: 'Check a displayed VAN9003 error',
          },
          time: 'About 3–5 minutes to read and record',
        },
      ],
      avoid: [
        'Do not broadly delete AppData or game folders',
        'Do not disable antivirus or Vanguard as a workaround',
        'Do not delete services or fetch/delete arbitrary DLL/.sys files',
      ],
      cautions: [],
      faqs: [
        {
          question: 'Should I change TPM without a VAN number?',
          answer:
            'Not from the launch symptom alone. First use Riot Client repair and read the full message, then follow the requirements actually shown.',
        },
        {
          question: 'Should I remove Vanguard if repair cannot complete?',
          answer:
            'Not automatically. Record the repair error and follow Riot guidance or support. If reinstalling, complete normal removal and legitimate installation; leaving it removed is not a workaround.',
        },
      ],
      related: [
        {
          href: '/en/games/valorant/van-restriction-5',
          label: 'VAN RESTRICTION 5: HVCI checks',
        },
        {
          href: '/en/games/valorant/van9005',
          label: 'VAN9005: TPM, UEFI and memory integrity',
        },
        {
          href: '/en/games/valorant/van9003',
          label: 'VAN9003 and Secure Boot',
        },
        {
          href: '/en/games/valorant/van9001',
          label: 'VAN9001 and TPM 2.0',
        },
      ],
    },
    zh: {
      title: 'VALORANT 无 VAN 编号却无法启动：Riot Client 修复与后续检查',
      shortTitle: '无 VAN 编号的启动失败',
      description:
        '区分非 VAN 启动失败与 VAN9003/9001。使用 Riot Client 修复，比较非必要应用和 GPU 信息，必要时正常重装 Vanguard 并记录结果。',
      lead: '适用于 PC 版 VALORANT 点击游玩后打不开，或出现 System/Critical Error、Failed to Launch 但没有 VAN 编号。VAN9003 与 VAN9001 使用各自专文。',
      summary:
        '先记录完整提示和失败阶段，再重启 PC 与 Riot Client。没有 VAN 编号时，使用客户端个人资料→设置→VALORANT→修复。仍失败时逐项核对非必要应用与官方 GPU 驱动；只有必要时正常重装 Vanguard，不关闭保护或大范围删除缓存。',
      quickFacts: [
        {
          label: '适用范围',
          value: '不含 VAN 编号的启动失败',
        },
        {
          label: '修复入口',
          value: 'Riot Client：个人资料→设置→VALORANT→修复',
        },
        {
          label: '出现 VAN 编号',
          value: '切换到对应代码指南',
        },
      ],
      diagnosis: [
        {
          symptom: '打不开或 System Error',
          cause: '记录全文与阶段',
          stepId: 'record-non-van-launch',
        },
        {
          symptom: '客户端可打开',
          cause: '使用 Riot 修复工具',
          stepId: 'repair-riot-client',
        },
        {
          symptom: '修复后相同',
          cause: '比较非必要应用与 GPU 信息',
          stepId: 'compare-launch-environment',
        },
        {
          symptom: '仍失败或出现新编号',
          cause: '整理结果咨询支持',
          stepId: 'report-non-van-launch',
        },
      ],
      steps: [
        {
          id: 'record-non-van-launch',
          title: '检查完整提示与 VAN 编号',
          summary: '不同启动失败需要不同检查。',
          actions: [
            '若显示 VAN RESTRICTION 5 或 VAN9005，请通过本步骤链接及相关文章检查对应编号。',
            '记录点击游玩后的情况、完整提示、时间和 Windows 版本，不省略 System/Critical/Failed to Launch 文本。',
            '保存工作并重启 PC，从 Riot Client 启动一次比较；更新仍在进行时先等待结束。',
            'VAN9003 查看安全启动专文，VAN9001 查看 TPM 专文；其他 VAN 编号也应查看官方对应说明，不叠加通用修复。',
          ],
          risk: 'low',
          note: '受管理电脑或无权限时找管理员，不因无法启动就进入 BIOS 修改。',
          time: '检查与记录约 3–5 分钟',
          guideLink: {
            href: '/zh/games/valorant/van-restriction-5',
            label: 'VAN RESTRICTION 5：HVCI 检查',
          },
        },
        {
          id: 'repair-riot-client',
          title: '在 Riot Client 修复 VALORANT',
          summary: '选中正确游戏再修复文件。',
          actions: [
            '退出游戏并登录 Riot Client，打开右上角个人资料图标→设置。',
            '选择 VALORANT，点击修复（Repair）并遵循提示，完成后比较相同启动操作。',
            '没有修复按钮、客户端打不开或修复失败时，记录完整结果并转第 5 步，不用删除文件夹代替。',
          ],
          risk: 'low',
          note: '修复可能处理缺失或损坏文件，但完成本身不证明原因或保证解决。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'compare-launch-environment',
          title: '检查非必要应用与 GPU 信息',
          summary: '记录原状态，每次只改一项。',
          actions: [
            '保存自己打开的非必要录制或叠加应用中的工作，只正常退出其中一个后比较；没有变化就重新打开恢复。',
            '记录 GPU 和驱动版本，从 Riot 官方说明查找厂商更新信息。确需更新时按机型官方步骤操作并单独比较。',
            '需要恢复时按厂商官方方法核对如何回到记录的驱动版本。不明确就停止，不关闭 Windows 服务或杀毒。',
          ],
          risk: 'medium',
          note: '此通用步骤不包含干净启动、注册表修改或安全排除。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'reinstall-vanguard-normally',
          title: '必要时正常重装 Vanguard',
          summary: '仅在 Riot 指南或支持要求重装时使用。',
          actions: [
            '关闭 Riot 游戏和客户端，在 Windows 添加或删除程序中选择 Riot Vanguard 正常卸载；受管理电脑由管理员处理。',
            '重启 PC，再打开 Riot Client 或 VALORANT 完成正规 Vanguard 安装，并遵循重新启动提示。',
            '安装完成后比较。正常卸载或安装失败时停止并联系 Riot，不使用删除服务命令或删除 .sys。',
          ],
          risk: 'medium',
          note: '游玩需要安装 Vanguard，恢复方式是正规重装。其他依赖它的游戏也受影响，应在操作前退出。',
          time: '耗时取决于操作和设备',
        },
        {
          id: 'report-non-van-launch',
          title: '提交剩余全文与比较结果',
          summary: '出现新编号时切换范围。',
          actions: [
            '向 Riot 提供 Windows、GPU／驱动版本、失败阶段、全文以及修复、应用比较、重装结果，注明未执行项。',
            '出现 VAN9003 或 VAN9001 时使用专文；仍无编号时咨询 Riot，不猜测切换 TPM 或启动模式。',
            '只分享官方要求的日志或图片，不在公开反馈中发布账号或隐私。',
          ],
          risk: 'low',
          guideLink: {
            href: '/zh/games/valorant/van9003',
            label: '检查已出现的 VAN9003',
          },
          time: '检查与记录约 3–5 分钟',
        },
      ],
      avoid: [
        '不大范围删除 AppData 或游戏目录',
        '不关闭杀毒或 Vanguard 绕过',
        '不删除服务或任意获取、删除 DLL/.sys',
      ],
      cautions: [],
      faqs: [
        {
          question: '没有 VAN 编号也该改 TPM 吗？',
          answer:
            '不能仅凭启动失败修改。先使用 Riot Client 修复并阅读全文，再按实际显示的要求分支。',
        },
        {
          question: '修复失败就卸载 Vanguard 吗？',
          answer:
            '不是自动进行。应记录错误并遵循 Riot 指南或支持；确需重装也要完成正常卸载与正规安装，不能保留卸载状态当作绕过。',
        },
      ],
      related: [
        {
          href: '/zh/games/valorant/van-restriction-5',
          label: 'VAN RESTRICTION 5：HVCI 检查',
        },
        {
          href: '/zh/games/valorant/van9005',
          label: 'VAN9005：TPM、UEFI 与内存完整性',
        },
        {
          href: '/zh/games/valorant/van9003',
          label: 'VAN9003 与安全启动',
        },
        {
          href: '/zh/games/valorant/van9001',
          label: 'VAN9001 与 TPM 2.0',
        },
      ],
    },
    es: {
      title:
        'VALORANT no inicia sin código VAN: reparar Riot Client y siguientes pasos',
      shortTitle: 'No inicia sin código VAN',
      description:
        'Distingue el fallo sin VAN de VAN9003/9001. Repara con Riot Client, compara aplicaciones opcionales y GPU y reinstala Vanguard normalmente solo si hace falta.',
      lead: 'Para VALORANT en PC que no abre tras Jugar o muestra System/Critical Error o Failed to Launch sin número VAN. VAN9003 y VAN9001 tienen guías propias.',
      summary:
        'Anota mensaje completo y fase, y reinicia PC y Riot Client. Sin número VAN, prueba Perfil → Ajustes → VALORANT → Reparar en el cliente. Si continúa, comprueba aplicaciones opcionales y ayuda oficial de GPU por separado. Reinstala Vanguard de forma normal solo si es necesario; no desactives protección ni borres cachés ampliamente.',
      quickFacts: [
        {
          label: 'Alcance',
          value: 'Fallo de inicio sin número VAN',
        },
        {
          label: 'Ruta de reparación',
          value: 'Riot Client: Perfil → Ajustes → VALORANT → Reparar',
        },
        {
          label: 'Aparece un VAN',
          value: 'Cambia a la guía de ese código',
        },
      ],
      diagnosis: [
        {
          symptom: 'No abre o muestra System Error',
          cause: 'Registra mensaje y fase',
          stepId: 'record-non-van-launch',
        },
        {
          symptom: 'El cliente sí abre',
          cause: 'Usa la reparación de Riot',
          stepId: 'repair-riot-client',
        },
        {
          symptom: 'Sigue igual tras reparar',
          cause: 'Compara aplicaciones y datos de GPU',
          stepId: 'compare-launch-environment',
        },
        {
          symptom: 'Persiste o aparece otro código',
          cause: 'Resume resultados para soporte',
          stepId: 'report-non-van-launch',
        },
      ],
      steps: [
        {
          id: 'record-non-van-launch',
          title: 'Comprueba el mensaje y número VAN',
          summary: 'Los fallos de inicio no comparten siempre la solución.',
          actions: [
            'Para VAN RESTRICTION 5 o VAN9005, usa el enlace de este paso y las guías relacionadas para ese número.',
            'Anota qué ocurre tras Jugar, mensaje completo, hora y versión de Windows, sin omitir System/Critical/Failed to Launch.',
            'Guarda el trabajo, reinicia el PC y compara un inicio desde Riot Client. Espera si una actualización sigue avanzando.',
            'Para VAN9003 usa Secure Boot; para VAN9001, TPM. Otros números VAN también van a su ayuda oficial, sin acumular soluciones generales.',
          ],
          risk: 'low',
          note: 'Consulta al administrador en equipos gestionados o sin acceso. No cambies BIOS solo porque no inicia.',
          time: 'Unos 3–5 minutos para consultar y anotar',
          guideLink: {
            href: '/es/games/valorant/van-restriction-5',
            label: 'VAN RESTRICTION 5: comprobaciones de HVCI',
          },
        },
        {
          id: 'repair-riot-client',
          title: 'Repara VALORANT desde Riot Client',
          summary: 'Selecciona el juego correcto.',
          actions: [
            'Cierra el juego, inicia sesión en Riot Client y abre el icono de perfil superior derecho → Ajustes.',
            'Elige VALORANT, pulsa Reparar (Repair) y sigue los avisos. Compara el mismo inicio cuando termine.',
            'Si no aparece Reparar, el cliente no abre o falla el proceso, registra el resultado completo y ve al paso 5. No sustituyas la reparación por borrar carpetas.',
          ],
          risk: 'low',
          note: 'Reparar puede corregir archivos ausentes o dañados. Terminar no identifica por sí solo la causa ni garantiza la solución.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'compare-launch-environment',
          title: 'Comprueba aplicaciones opcionales y GPU',
          summary: 'Registra el estado inicial y cambia una cosa cada vez.',
          actions: [
            'Guarda el trabajo de una grabadora o superposición opcional que abriste, ciérrala normalmente y compara. Vuelve a abrirla si no cambia nada.',
            'Anota GPU y versión del controlador. Usa la guía oficial de Riot para encontrar actualizaciones del fabricante; aplica las necesarias según el modelo y compara por separado.',
            'Si necesitas volver atrás, consulta el procedimiento oficial para recuperar la versión anotada. Detente si no está claro; no pares servicios de Windows ni antivirus.',
          ],
          risk: 'medium',
          note: 'Este procedimiento general no incluye inicio limpio, cambios de registro ni exclusiones de seguridad.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'reinstall-vanguard-normally',
          title: 'Reinstala Vanguard solo si es necesario',
          summary: 'Úsalo cuando la guía o soporte de Riot pida reinstalar.',
          actions: [
            'Cierra juegos y cliente de Riot. En Agregar o quitar programas de Windows, selecciona Riot Vanguard y desinstálalo normalmente. En equipos gestionados, pide ayuda al administrador.',
            'Reinicia el PC y abre Riot Client o VALORANT para completar la instalación legítima de Vanguard. Sigue cualquier aviso de reinicio.',
            'Compara al terminar. Si falla la desinstalación o instalación normal, detente y contacta con Riot; no borres servicios mediante comandos ni archivos .sys.',
          ],
          risk: 'medium',
          note: 'Vanguard debe estar instalado para jugar. La recuperación es reinstalarlo legítimamente. Afecta a otros juegos que lo necesitan; ciérralos antes.',
          time: 'La duración depende de la tarea y el equipo',
        },
        {
          id: 'report-non-van-launch',
          title: 'Comunica el error restante y resultados',
          summary: 'Cambia de alcance si aparece otro número.',
          actions: [
            'Entrega a Riot Windows, GPU/controlador, fase del fallo, mensaje completo y resultados de reparación, comparación y reinstalación; indica lo no realizado.',
            'Si aparece VAN9003 o VAN9001, usa su guía. Sin número, consulta a Riot sin cambiar TPM o modo de arranque por suposición.',
            'Comparte solo registros o imágenes solicitados, sin publicar datos de cuenta o privados en comentarios.',
          ],
          risk: 'low',
          guideLink: {
            href: '/es/games/valorant/van9003',
            label: 'Comprobar un VAN9003 mostrado',
          },
          time: 'Unos 3–5 minutos para consultar y anotar',
        },
      ],
      avoid: [
        'No borres AppData o carpetas de juegos de forma general',
        'No desactives antivirus ni Vanguard para evitar el fallo',
        'No borres servicios ni obtengas/borres DLL o .sys arbitrarios',
      ],
      cautions: [],
      faqs: [
        {
          question: '¿Cambio TPM aunque no aparezca un VAN?',
          answer:
            'No por el fallo de inicio solamente. Primero repara con Riot Client y lee el texto completo; después sigue los requisitos que realmente aparezcan.',
        },
        {
          question: '¿Quito Vanguard si no termina la reparación?',
          answer:
            'No automáticamente. Registra el error y sigue la guía o soporte de Riot. Si reinstalas, completa la retirada normal y la instalación legítima; dejarlo eliminado no es una solución.',
        },
      ],
      related: [
        {
          href: '/es/games/valorant/van-restriction-5',
          label: 'VAN RESTRICTION 5: comprobaciones de HVCI',
        },
        {
          href: '/es/games/valorant/van9005',
          label: 'VAN9005: TPM, UEFI e integridad de memoria',
        },
        {
          href: '/es/games/valorant/van9003',
          label: 'VAN9003 y arranque seguro',
        },
        {
          href: '/es/games/valorant/van9001',
          label: 'VAN9001 y TPM 2.0',
        },
      ],
    },
  },
  relatedSlugs: ['van-restriction-5', 'van9005', 'van9003', 'van9001'],
};
