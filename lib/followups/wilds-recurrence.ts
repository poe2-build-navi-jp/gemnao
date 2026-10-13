import type { FollowupGuide } from './types';

export const wildsRecurrenceGuide: FollowupGuide = {
  gameSlug: 'monster-hunter-wilds',
  gameName: 'Monster Hunter Wilds',
  slug: 'crash-after-fixes',
  category: 'launch',
  checkedAt: '2026-10-13',
  relatedSlugs: ['not-launching', 'config-file', 'system-requirements'],
  sources: [
    {
      url: 'https://steamcommunity.com/app/2246340/discussions/0/596267902352499612/',
      labels: {
        ja: 'カプコン公式：トラブルシューティングと問題の報告（英語）',
        en: 'Capcom: official troubleshooting and issue reporting',
        zh: 'Capcom：官方故障排查与问题报告（英语）',
        es: 'Capcom: solución de problemas e informes oficiales (inglés)',
      },
    },
    {
      url: 'https://support.microsoft.com/en-us/windows/experience/system-configuration-tools-in-windows',
      labels: {
        ja: 'Microsoft：イベントビューアーなどWindowsの構成ツール（英語）',
        en: 'Microsoft: Windows system configuration tools, including Event Viewer',
        zh: 'Microsoft：Windows 系统配置工具与事件查看器（英语）',
        es: 'Microsoft: herramientas de configuración y Visor de eventos (inglés)',
      },
    },
  ],
  copy: {
    ja: {
      title: 'モンハンワイルズが対処後も落ちる・再発する時の比較と相談手順',
      shortTitle: '対処後のクラッシュ・再発',
      description:
        'ワイルズのプレイ中クラッシュが対処後に戻る場合、同じ狩猟・経過時間・変更した1項目を比較。再発記録とCrashReportを揃え、原因を決めつけず公式相談へ進みます。',
      lead: 'PC・Steam版で整合性確認や設定変更を試した後も、狩猟中に落ちる・次回また落ちる人向けです。初回の起動直後やシェーダー準備中の対処は既存のクラッシュ記事にまとめています。',
      summary:
        '一度起動しただけで解決とせず、前に落ちた場面と同程度の時間で比べます。変更した項目と戻した項目を記録し、再発したら同時刻のWindows履歴・CrashReportを整理してください。ここで示す比較方法は編集部による整理で、故障箇所や特定の解決率を示すものではありません。',
      quickFacts: [
        {
          label: '比較の単位',
          value: '同じセーブ・狩猟・場面・おおよその経過時間',
        },
        {
          label: '記録の書き方',
          value: '変更前 → 変えた1項目 → 再発／今回は再発なし → 戻した状態',
        },
        {
          label: '先に区別',
          value: 'ゲームだけ終了するのか、PC全体が再起動・電源断するのか',
        },
      ],
      diagnosis: [
        {
          symptom: '一度起動したが、同じ狩猟でまた落ちた',
          cause: '起動成功とプレイ継続を別の結果として記録',
          stepId: 'record-recurrence',
        },
        {
          symptom: '複数の設定を変えたので、何が効いたか不明',
          cause: '比較できる状態を決め、1項目ずつ確認',
          stepId: 'compare-one-change',
        },
        {
          symptom: '元の設定やツールを戻したら再発した',
          cause: '最後に戻した項目を控え、安全な状態へ戻す',
          stepId: 'restore-one',
        },
        {
          symptom: '繰り返す／PC全体が落ちる／エラーが出ない',
          cause: '記録を揃え、症状に合う公式窓口へ',
          stepId: 'support-record',
        },
      ],
      steps: [
        {
          id: 'record-recurrence',
          title: '最後の再発を、以前の症状と同じ基準で記録する',
          summary: '違う場面の成功を、以前のクラッシュの改善と混同しません。',
          time: '約3分',
          risk: 'low',
          actions: [
            '日時、クエスト・ロード先、起動からの経過時間、ゲームだけかPC全体か、エラー全文を控える。ゲーム・ドライバー更新と、最後に試した操作も並べる。',
            '例：「起動は成功、以前落ちた狩猟にはまだ進んでいない」は未確認とする。同じ場面を通過した時も「今回は再発なし」と記録し、完全解決と断定しない。',
            'PCの電源断・再起動・停止コードなら、ゲームだけのクラッシュと分けてSTEP 4へ。危険な発熱などがある状態で再現を繰り返さない。',
          ],
          note: 'この段階では設定変更やログ削除は不要です。実際の記録を残し、例の時間を自分の検証結果として使わないでください。',
        },
        {
          id: 'compare-one-change',
          title: '同じ狩猟で、条件に合う1項目だけ比較する',
          summary: 'すでに試した項目を無条件にやり直す必要はありません。',
          time: '前回の発生までの時間を目安に',
          risk: 'low',
          actions: [
            '以前の画質・FPS上限・追加ツールの状態を控える。不要な録画・表示オーバーレイを終了する、または画質プリセットを低くするなど、該当する1項目を選ぶ。保護ソフトは止めない。',
            '同じ狩猟・同程度の時間で結果を比較する。改善しない場合は元の値へ戻してから別の項目へ。画質とFPS上限を同時に変えない。',
            '高解像度DLCやGPUドライバーが関係しそうなら、親記事の要件・現行公式案内を先に確認する。古いドライバー版を全員向けの固定解としない。',
          ],
          note: '戻し方：比較前に控えた画質・FPS上限へ戻し、終了した自分のツールは必要なものだけ再開します。',
          guideLink: {
            href: '/games/monster-hunter-wilds/not-launching#check-vram',
            label: '高解像度DLCとVRAMの適用条件',
            description: 'DLCを比較する前に確認します。',
          },
        },
        {
          id: 'restore-one',
          title: '戻した直後に再発した場合は、その変更だけを記録する',
          summary:
            '相関があっても、故障部品や唯一の原因が確定したわけではありません。',
          time: '次の通常プレイで確認',
          risk: 'low',
          actions: [
            '安定していた状態へ何を戻したかを確認する。自分で変更した画質やツールだけなら、その1項目を再び比較前の状態に戻し、同じ場面を確認する。',
            'ゲームやドライバーの更新が間に入った場合は、前回と完全に同条件とは扱わない。旧版への強制差し戻しやDLL・セーブ削除はせず、現在の版を記録する。',
            '再発なしでも一度の結果で保証しない。改善が不明、同じ操作を繰り返している、悪化した場合は比較を止め、STEP 4の記録を揃える。',
          ],
          note: '非対応のMODや出所不明のファイルを、比較のためだけに戻す必要はありません。',
        },
        {
          id: 'support-record',
          title: '再発時刻と記録を揃えて、公式サポートへ相談する',
          summary: 'エラー名1つから故障箇所を決めず、時系列を渡します。',
          time: '約5分',
          risk: 'low',
          actions: [
            'Windows＋R → eventvwr.msc → Windowsログ → Applicationで同時刻の記録を確認。アプリ名・障害モジュール・例外コードを控える。見つからなければ「記録なし」とする。',
            'Steamのローカルファイル閲覧からCrashReportを確認し、再発時刻に近いZIPと表示されたレポート番号を保管。生成されない場合は画面と再現手順を残す。',
            'カプコンの公式報告案内に従い、環境、場面、経過時間、試した1項目と結果を伝える。PC全体の再起動や電源断はPCメーカーにも相談し、修理ツールの一括実行で記録を上書きしない。',
          ],
          note: 'ログにはユーザー名・PC名・パスが含まれ得ます。元の記録は手元に保存し、SNSへ丸ごと公開せず公式窓口の指示に沿って渡してください。',
        },
      ],
      avoid: [
        '一度起動しただけで解決と断定しない',
        '画質・ドライバー・DLCを同時に変更しない',
        'セーブ、DLL、CrashReportを原因の推測だけで削除しない',
      ],
      cautions: [
        'ここには編集部の実機測定や新しい成功事例は含めていません。比較例は記録方法の説明です。',
        'PC全体の電源断などをゲーム設定だけの問題と決めつけず、再現テストを繰り返す前にメーカーへ相談してください。',
      ],
      faqs: [
        {
          question:
            '整合性確認で修復されたのに再発したら、修復は無意味ですか？',
          answer:
            'ファイルの修復と症状の再発は別の結果です。再取得の有無、完了時刻、その後に同じ場面で何が起きたかを並べて記録し、検証だけを際限なく繰り返さないでください。',
        },
        {
          question: '何分落ちなければ解決ですか？',
          answer:
            '全員に使える分数は決められません。以前落ちた場面と経過時間を比較の目安にし、通常プレイでも再発しないか確認します。一度通過した時点では「今回は再発なし」です。',
        },
      ],
      related: [
        {
          href: '/games/monster-hunter-wilds/not-launching',
          label: '初回の起動・シェーダー準備・狩猟中の確認',
        },
      ],
    },
    en: {
      title:
        'Monster Hunter Wilds Still Crashes After Fixes: Compare Recurrence and Prepare a Report',
      shortTitle: 'Crashes return after fixes',
      description:
        'When Wilds crashes return during hunts after a repair or settings change, compare the same scene, duration and one changed item. Match records by time before contacting support.',
      lead: 'For the PC/Steam game crashing during hunts or on the next session after you have already verified files or changed settings. Initial launch and shader-preparation checks remain in the main crash guide.',
      summary:
        'A successful launch is not the same as completing the scene that used to crash. Compare a similar duration, record each change and reversal, and match a recurrence with Windows history and CrashReport. This comparison workflow is an editorial guide, not a hardware diagnosis or a measured success rate.',
      quickFacts: [
        {
          label: 'Keep comparable',
          value: 'Save, hunt, scene and approximate time in the session',
        },
        {
          label: 'Useful record',
          value:
            'Before → one change → recurrence/no recurrence this time → restored state',
        },
        {
          label: 'Distinguish first',
          value:
            'The game closing versus the whole PC restarting or losing power',
        },
      ],
      diagnosis: [
        {
          symptom: 'It launched once but crashed again in the same hunt',
          cause: 'Record launch and continued play as separate results',
          stepId: 'record-recurrence',
        },
        {
          symptom: 'Several changes made it unclear what helped',
          cause: 'Choose a comparable baseline and change one item',
          stepId: 'compare-one-change',
        },
        {
          symptom: 'The crash returned after restoring a setting or tool',
          cause: 'Record that item and return to the safer comparison state',
          stepId: 'restore-one',
        },
        {
          symptom: 'Repeated crashes, whole-PC failure or no error message',
          cause: 'Prepare records for the appropriate official support team',
          stepId: 'support-record',
        },
      ],
      steps: [
        {
          id: 'record-recurrence',
          title: 'Record the latest recurrence against the same symptom',
          summary:
            'Success in a different scene cannot settle the original failure.',
          time: 'About 3 minutes',
          risk: 'low',
          actions: [
            'Note the date, hunt or loading destination, time since launch, full error and whether only the game closed. Add game/driver updates and the last change you tried.',
            'For example, “launch worked; the original hunt is untested” remains unverified. Passing the scene once means “no recurrence this time,” not a proven permanent fix.',
            'If the PC restarts, loses power or shows a stop code, separate that from an application crash and go to Step 4. Do not keep reproducing a failure with dangerous overheating or other warning signs.',
          ],
          note: 'No setting change or log deletion is needed here. Use your own observations, not an example duration as if you measured it.',
        },
        {
          id: 'compare-one-change',
          title: 'Compare one relevant change in the same hunt',
          summary:
            'You do not need to repeat completed checks without a reason.',
          time: 'Use the previous time to failure as a reference',
          risk: 'low',
          actions: [
            'Record graphics, frame cap and optional tools first. Choose one relevant comparison, such as closing an unnecessary recording/overlay tool or lowering the graphics preset. Keep security protection enabled.',
            'Compare the same hunt for a similar duration. If unchanged, restore the recorded value before trying another item. Do not change the preset and frame cap together.',
            'For a suspected high-resolution DLC or driver issue, check the main guide’s requirements and current official advice first. Do not treat an old driver version as a universal fix.',
          ],
          note: 'To undo the comparison, restore your recorded graphics/frame-cap values and reopen only the tools you need.',
          guideLink: {
            href: '/en/games/monster-hunter-wilds/not-launching#check-vram',
            label: 'High-resolution DLC and VRAM conditions',
            description: 'Check applicability before comparing the DLC.',
          },
        },
        {
          id: 'restore-one',
          title:
            'If restoration brings the crash back, record that change alone',
          summary:
            'An association does not establish a failed component or a single cause.',
          time: 'Check during normal play',
          risk: 'low',
          actions: [
            'Identify what you restored to the previously stable setup. For a setting or tool you changed yourself, return just that item to the comparison state and check the same scene.',
            'If a game or driver update occurred between runs, do not call them identical conditions. Record the current versions instead of forcing an old build or deleting DLLs or saves.',
            'One run without a crash is not a guarantee. If improvement is unclear, the same checks keep repeating or things worsen, stop comparisons and prepare the Step 4 record.',
          ],
          note: 'You do not need to restore an unsupported mod or an unidentified file merely to reproduce a crash.',
        },
        {
          id: 'support-record',
          title: 'Match the recurrence time with records for official support',
          summary:
            'Provide a timeline rather than diagnosing hardware from one error name.',
          time: 'About 5 minutes',
          risk: 'low',
          actions: [
            'Open Windows + R → eventvwr.msc → Windows Logs → Application. Check the matching time and note the application, faulting module and exception code. If absent, record that no matching event was found.',
            'Open the game’s local files through Steam and look in CrashReport. Keep the ZIP nearest the recurrence and any displayed report number. If no report was generated, retain the screen and reproduction steps.',
            'Follow Capcom’s official reporting instructions with your environment, scene, duration, single change and result. For whole-PC restarts or power loss, also consult the PC maker; do not overwrite evidence with batches of repair tools.',
          ],
          note: 'Logs can include usernames, PC names and paths. Keep originals privately and follow the official support channel’s instructions instead of posting entire logs publicly.',
        },
      ],
      avoid: [
        'Do not call one successful launch a complete fix',
        'Do not change graphics, drivers and DLC together',
        'Do not delete saves, DLLs or CrashReport based on a guessed cause',
      ],
      cautions: [
        'This article contains no new hands-on measurement or success story. Examples explain how to record a comparison.',
        'Do not assume whole-PC power loss is just a game setting. Ask the manufacturer before repeatedly reproducing it.',
      ],
      faqs: [
        {
          question: 'Was file verification pointless if the crash came back?',
          answer:
            'File repair and symptom recurrence are separate observations. Record whether files were reacquired, when verification finished and what happened in the same scene afterward. Avoid repeating verification indefinitely.',
        },
        {
          question: 'How many crash-free minutes prove it is fixed?',
          answer:
            'There is no universal duration. Use the original scene and time to failure as a comparison, then observe normal play. Passing once means no recurrence on that attempt.',
        },
      ],
      related: [
        {
          href: '/en/games/monster-hunter-wilds/not-launching',
          label: 'Initial launch, shader and hunting crash checks',
        },
        {
          href: '/en/guide/pc-game-crash',
          label: 'General PC game crash checks',
        },
      ],
    },
    zh: {
      title: 'Monster Hunter Wilds 修复后仍崩溃或复发：比较条件与整理报告',
      shortTitle: '修复后再次崩溃',
      description:
        'Wilds 在修复文件或更改设置后仍在狩猎中崩溃时，比较相同场景、时长与单项变化，按时间整理记录和 CrashReport，再联系官方支持。',
      lead: '适用于 PC／Steam 版已经验证文件或调整设置，仍在狩猎中或下次游玩时崩溃的情况。首次启动和着色器准备问题仍由主排查文章说明。',
      summary:
        '成功启动不等于通过了原本崩溃的场景。以相近时长比较，记录每次更改和恢复，并把复发时间与 Windows 记录、CrashReport 对齐。这是编辑整理的比较方法，不是硬件诊断或实测成功率。',
      quickFacts: [
        { label: '保持可比', value: '同一存档、狩猎、场景和大致游玩时长' },
        {
          label: '记录格式',
          value: '更改前 → 单项更改 → 复发／本次未复发 → 恢复后的状态',
        },
        { label: '先区分', value: '仅游戏退出，还是整台电脑重启或断电' },
      ],
      diagnosis: [
        {
          symptom: '启动成功一次，但同一狩猎又崩溃',
          cause: '分别记录启动与持续游玩的结果',
          stepId: 'record-recurrence',
        },
        {
          symptom: '同时改了多项，不清楚哪项有效',
          cause: '确定可比的基线，每次只改一项',
          stepId: 'compare-one-change',
        },
        {
          symptom: '恢复设置或工具后再次崩溃',
          cause: '记录该项并回到较安全的比较状态',
          stepId: 'restore-one',
        },
        {
          symptom: '反复崩溃、整机异常或没有错误提示',
          cause: '整理记录，联系对应的官方支持',
          stepId: 'support-record',
        },
      ],
      steps: [
        {
          id: 'record-recurrence',
          title: '按同一种症状记录最近一次复发',
          summary: '另一个场景成功，不能证明原问题消失。',
          time: '约 3 分钟',
          risk: 'low',
          actions: [
            '记录日期、任务或加载目标、启动后时长、完整错误和是否只有游戏退出，并列出游戏／驱动更新及最后尝试的更改。',
            '例如“启动成功，原来的狩猎还没测试”仍是未确认。通过一次原场景，只能记作本次未复发，不能断言永久修复。',
            '电脑重启、断电或显示停止代码时，区别于应用崩溃，转到第 4 步。有危险过热等迹象时不要反复复现。',
          ],
          note: '这里无需更改设置或删除日志。记录自己的观察，不要把示例时长当成实测结果。',
        },
        {
          id: 'compare-one-change',
          title: '在同一狩猎中比较一项相关更改',
          summary: '无需无理由地重复已经完成的检查。',
          time: '参考上次出错前的时长',
          risk: 'low',
          actions: [
            '先记录画质、帧率上限和附加工具。选择一个相关比较项，例如退出不需要的录制／叠加显示工具，或降低画质预设。保持安全防护开启。',
            '在同一狩猎中游玩相近时长。没有改善时，先恢复记录的值再试其他项，不要同时更改画质和帧率上限。',
            '怀疑高清材质 DLC 或驱动时，先查看主文章的适用条件与当前官方说明，不要把旧驱动版本当成通用答案。',
          ],
          note: '恢复方法：改回记录的画质和帧率上限，只重新打开需要的工具。',
          guideLink: {
            href: '/en/games/monster-hunter-wilds/not-launching#check-vram',
            label: '高清材质 DLC 与显存条件（英语）',
            description: '比较 DLC 前先确认适用条件。',
          },
        },
        {
          id: 'restore-one',
          title: '恢复后复发时，只记录这一次变化',
          summary: '有关联不代表已确定损坏部件或唯一原因。',
          time: '在正常游玩中确认',
          risk: 'low',
          actions: [
            '确认向先前稳定的环境恢复了什么。如果只是自己改过的设置或工具，将该项恢复到比较状态，再检查同一场景。',
            '两次尝试之间更新了游戏或驱动，就不能视为完全相同条件。记录当前版本，不要强制退回旧版或删除 DLL、存档。',
            '一次不崩溃不是保证。如果改善不清楚、反复执行相同操作或情况恶化，停止比较，整理第 4 步的记录。',
          ],
          note: '不必为了复现崩溃而重新启用不兼容的 MOD 或来源不明的文件。',
        },
        {
          id: 'support-record',
          title: '按复发时间整理记录并联系官方',
          summary: '提供时间顺序，不凭一个错误名称判断硬件故障。',
          time: '约 5 分钟',
          risk: 'low',
          actions: [
            'Windows＋R → eventvwr.msc → Windows 日志 → 应用程序，查看对应时刻，记录应用名、故障模块和异常代码。找不到就记为没有对应事件。',
            '通过 Steam 浏览游戏本地文件，查看 CrashReport，保留最接近复发时刻的 ZIP 和显示的报告编号。没有生成报告时，保存画面和复现步骤。',
            '按 Capcom 官方报告要求提供环境、场景、时长、单项更改及结果。整机重启或断电还应联系电脑厂商，不要用批量修复工具覆盖记录。',
          ],
          note: '日志可能含用户名、电脑名和路径。私下保留原件，按官方支持渠道的要求提供，不要把完整日志公开发布。',
        },
      ],
      avoid: [
        '不要把一次启动成功当成完全修复',
        '不要同时改画质、驱动与 DLC',
        '不要根据猜测删除存档、DLL 或 CrashReport',
      ],
      cautions: [
        '本文没有新增实机测量或成功案例；示例只说明如何记录比较。',
        '不要认定整机断电只是游戏设置问题，反复复现前先向厂商咨询。',
      ],
      faqs: [
        {
          question: '验证文件后又崩溃，说明修复没意义吗？',
          answer:
            '文件修复与症状复发是不同结果。记录是否重新下载文件、完成时间，以及之后在同一场景发生的情况，不要无限重复验证。',
        },
        {
          question: '多少分钟不崩溃才算修好？',
          answer:
            '没有适用于所有人的时长。参考原来的场景和出错时间，再观察正常游玩。通过一次只能说明该次未复发。',
        },
      ],
      related: [
        {
          href: '/en/games/monster-hunter-wilds/not-launching',
          label: '启动、着色器与狩猎崩溃的初步排查（英语）',
        },
      ],
    },
    es: {
      title:
        'Monster Hunter Wilds vuelve a fallar tras los arreglos: compara la recaída y prepara un informe',
      shortTitle: 'El fallo vuelve tras los arreglos',
      description:
        'Si Wilds vuelve a cerrarse durante las cacerías tras reparar archivos o cambiar ajustes, compara la misma escena, duración y una sola variable. Ordena los registros antes de contactar con soporte.',
      lead: 'Para PC/Steam cuando ya verificaste archivos o cambiaste ajustes, pero el juego vuelve a cerrarse durante una cacería o en la siguiente sesión. La guía principal conserva las comprobaciones iniciales de inicio y sombreadores.',
      summary:
        'Iniciar el juego no equivale a superar la escena que fallaba. Compara una duración similar, anota cada cambio y su reversión, y relaciona la recaída con los registros de Windows y CrashReport. Este método editorial no es un diagnóstico de hardware ni una tasa de éxito medida.',
      quickFacts: [
        {
          label: 'Mantén comparable',
          value:
            'Partida guardada, cacería, escena y tiempo aproximado de sesión',
        },
        {
          label: 'Registro útil',
          value:
            'Antes → un cambio → vuelve a fallar/no falla esta vez → estado restaurado',
        },
        {
          label: 'Distingue primero',
          value:
            'Solo se cierra el juego o todo el PC se reinicia o pierde alimentación',
        },
      ],
      diagnosis: [
        {
          symptom: 'Arrancó una vez, pero falló en la misma cacería',
          cause: 'Registra el inicio y el juego continuado por separado',
          stepId: 'record-recurrence',
        },
        {
          symptom: 'Varios cambios impiden saber cuál ayudó',
          cause: 'Elige una base comparable y cambia una sola variable',
          stepId: 'compare-one-change',
        },
        {
          symptom: 'El fallo volvió al restaurar un ajuste o herramienta',
          cause:
            'Anota ese cambio y vuelve al estado de comparación más seguro',
          stepId: 'restore-one',
        },
        {
          symptom: 'Fallos repetidos, problema de todo el PC o sin mensaje',
          cause: 'Prepara registros para el soporte oficial adecuado',
          stepId: 'support-record',
        },
      ],
      steps: [
        {
          id: 'record-recurrence',
          title: 'Registra la última recaída con el mismo criterio',
          summary:
            'Superar otra escena no resuelve la duda sobre el fallo original.',
          time: 'Unos 3 minutos',
          risk: 'low',
          actions: [
            'Anota fecha, cacería o destino de carga, tiempo desde el inicio, error completo y si solo se cerró el juego. Añade actualizaciones del juego/controlador y el último cambio probado.',
            'Por ejemplo, “arranca, pero no he probado la cacería original” sigue sin verificarse. Superar la escena una vez significa que no falló esta vez, no una reparación definitiva.',
            'Si el PC se reinicia, pierde alimentación o muestra un código de detención, sepáralo del cierre de la aplicación y ve al paso 4. No repitas pruebas con sobrecalentamiento peligroso u otras señales de alarma.',
          ],
          note: 'Aquí no hace falta cambiar ajustes ni borrar registros. Usa tus observaciones, no la duración de un ejemplo como si la hubieras medido.',
        },
        {
          id: 'compare-one-change',
          title: 'Compara un cambio pertinente en la misma cacería',
          summary: 'No repitas comprobaciones ya completadas sin un motivo.',
          time: 'Toma como referencia el tiempo hasta el fallo anterior',
          risk: 'low',
          actions: [
            'Anota gráficos, límite de FPS y herramientas opcionales. Elige una comparación, como cerrar una grabación/superposición innecesaria o reducir el preajuste gráfico. Mantén activa la protección de seguridad.',
            'Compara la misma cacería durante un tiempo similar. Si no mejora, restaura el valor anotado antes de probar otra cosa. No cambies a la vez el preajuste y el límite de FPS.',
            'Si sospechas del DLC de texturas o del controlador, consulta primero los requisitos de la guía principal y la información oficial actual. Una versión antigua no es una solución universal.',
          ],
          note: 'Para deshacer la comparación, restaura los valores gráficos y de FPS anotados y abre solo las herramientas necesarias.',
          guideLink: {
            href: '/en/games/monster-hunter-wilds/not-launching#check-vram',
            label: 'Condiciones del DLC de texturas y VRAM (inglés)',
            description: 'Comprueba si se aplica antes de comparar el DLC.',
          },
        },
        {
          id: 'restore-one',
          title:
            'Si el fallo vuelve al restaurar algo, registra solo ese cambio',
          summary:
            'La asociación no confirma una pieza averiada ni una causa única.',
          time: 'Compruébalo durante el juego normal',
          risk: 'low',
          actions: [
            'Identifica qué restauraste en la configuración estable. Si era un ajuste o herramienta que cambiaste, devuelve solo ese elemento al estado de comparación y prueba la misma escena.',
            'Si hubo una actualización del juego o controlador entre intentos, no son condiciones idénticas. Anota las versiones actuales sin forzar una versión antigua ni borrar DLL o partidas.',
            'Una sesión sin fallo no es una garantía. Si no hay una mejora clara, repites las mismas pruebas o empeora, detén las comparaciones y prepara el registro del paso 4.',
          ],
          note: 'No necesitas reinstalar un mod incompatible o un archivo desconocido solo para reproducir el cierre.',
        },
        {
          id: 'support-record',
          title: 'Relaciona la hora del fallo con los registros para soporte',
          summary:
            'Entrega una cronología, no un diagnóstico basado en un nombre de error.',
          time: 'Unos 5 minutos',
          risk: 'low',
          actions: [
            'Abre Windows + R → eventvwr.msc → Registros de Windows → Aplicación. Busca la hora correspondiente y anota aplicación, módulo con errores y código de excepción. Si no aparece, indica que no encontraste un evento coincidente.',
            'Abre los archivos locales desde Steam y revisa CrashReport. Conserva el ZIP más cercano al fallo y el número mostrado. Si no se generó informe, guarda la pantalla y los pasos para reproducirlo.',
            'Sigue las instrucciones oficiales de Capcom con entorno, escena, duración, único cambio y resultado. Para reinicios o cortes de alimentación de todo el PC, consulta también al fabricante; evita sobrescribir pruebas con herramientas de reparación en bloque.',
          ],
          note: 'Los registros pueden incluir usuarios, nombres de PC y rutas. Conserva los originales en privado y sigue las instrucciones del soporte oficial, sin publicarlos completos.',
        },
      ],
      avoid: [
        'No des por resuelto el fallo porque el juego arranque una vez',
        'No cambies gráficos, controladores y DLC a la vez',
        'No borres partidas, DLL o CrashReport por una causa supuesta',
      ],
      cautions: [
        'No se incluyen nuevas mediciones prácticas ni casos de éxito. Los ejemplos explican cómo registrar una comparación.',
        'No asumas que un apagado de todo el PC se debe solo al juego. Consulta al fabricante antes de reproducirlo repetidamente.',
      ],
      faqs: [
        {
          question: '¿Verificar archivos no sirvió si volvió a cerrarse?',
          answer:
            'Reparar archivos y que reaparezca el síntoma son observaciones distintas. Anota si se descargaron archivos, cuándo terminó y qué ocurrió después en la misma escena. Evita repetir la verificación indefinidamente.',
        },
        {
          question:
            '¿Cuántos minutos sin fallar demuestran que está arreglado?',
          answer:
            'No hay una duración universal. Usa la escena y el tiempo del fallo original como referencia y observa las siguientes sesiones. Superarlo una vez solo confirma que no falló en ese intento.',
        },
      ],
      related: [
        {
          href: '/en/games/monster-hunter-wilds/not-launching',
          label:
            'Comprobaciones iniciales de inicio, sombreadores y cacerías (inglés)',
        },
      ],
    },
  },
};
