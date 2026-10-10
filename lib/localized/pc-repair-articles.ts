import type { Locale } from '@/lib/i18n';
import type { PcArticle } from '@/lib/pc-articles';

export type LocalizedPcArticle = PcArticle & {
  locale: Locale;
  sourcePolicy: string;
};

const lenovoLiquid =
  'https://download.lenovo.com/pccbbs/pubs/ideapad_slim5_14_16/ug/html_en/en/faq_drain_liquid.html';
const storageWarning =
  'https://support.microsoft.com/ja-jp/windows/experience/storage-filemanagement/what-to-do-about-a-critical-warning-for-a-storage-device';
const hpBattery =
  'https://support.hp.com/in-en/document/ish_4158581-4158704-16';
const microsoft =
  'https://support.microsoft.com/ja-jp/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows';
const dell =
  'https://www.dell.com/support/contents/ja-jp/article/product-support/self-support-knowledgebase/fix-common-issues/no-post';

export const localizedPcRepairArticles: LocalizedPcArticle[] = [
  {
    locale: 'en',
    slug: 'repair-or-replace',
    title: 'Repair, upgrade or replace your PC? Compare the full cost',
    shortTitle: 'Repair, upgrade or replace',
    seoTitle: 'PC repair or replacement: upgrade costs and what to compare',
    description:
      'Separate settings problems, insufficient performance and suspected faults before replacing your PC. Compare warranty, compatible parts, repair quotes, data migration and the performance you need.',
    lead: 'Before deciding that a slow or older PC needs replacing, check whether it can still do what you need and compare the scope and total cost of fixing it. This guide focuses on consumer Windows PCs and repair services in Japan. Power, display and startup troubleshooting are covered separately.',
    answer:
      'Compare evidence of a fault, warranty coverage, replaceable parts, what the repaired PC can do and the full cost including data migration. Keep using it if settings changes meet your needs; compare an upgrade if a specific shortfall is clear and the part is replaceable; ask about repair if there are warning signs. If information is missing, investigate and get a quote first. Age or a fixed “half the price of a new PC” rule cannot decide this on their own.',
    quickChecks: [
      'Liquid has entered the PC, it was recently wet, or there is an unusual smell, smoke, swelling or dangerously high heat: stop using and charging the PC and contact the manufacturer. Do not force it to start for diagnostics or a backup.',
      'Critical storage warning: prioritize important backups only if the PC is safe to use. If files cannot be copied, stop repeated writes or resets and ask about preserving the data.',
      'No danger signs: gather your requirements, model, warranty, upgrade options and a repair quote before comparing.',
    ],
    evidenceSummary: {
      title: 'Four starting points before spending money',
      tocLabel: 'Four decisions and next checks',
      intro:
        'These are editorial categories for choosing the next check, not a purchase recommendation. A diagnostic result or utilization figure alone cannot confirm that a component has failed.',
      items: [
        {
          label: 'Try settings first',
          explanation:
            'You have recorded an improvement after changing an app or graphics setting. If the improved setup meets your needs, continuing to use the PC without buying anything is an option.',
        },
        {
          label: 'Check a possible performance shortfall',
          explanation:
            'The PC falls short of the software’s official requirements, or you have identified a limitation in your normal workload. Check the model specifications and full cost to see whether compatible RAM, storage or a GPU upgrade would meet your needs.',
        },
        {
          label: 'Suspected fault: ask about repair',
          explanation:
            'Manufacturer diagnostic errors, storage warnings or repeated whole-PC problems warrant attention. Preserve important data and check the warranty and inspection or repair quote. A warning does not establish the faulty part or repair price.',
        },
        {
          label: 'Not enough information',
          explanation:
            'The affected tasks, required performance, PC model or quote are unknown. Do not count an unknown as a pass: return to symptom checks and gather the missing information.',
        },
      ],
      limitation:
        '“No fault found” does not mean replacement is necessary. A short diagnostic test that finds no errors also cannot guarantee that everything is working correctly.',
      sources: [
        {
          label: 'Microsoft: improving PC performance (Japanese)',
          url: microsoft,
        },
        {
          label:
            'Dell: distinguishing power, startup and video problems (Japanese)',
          url: dell,
        },
      ],
    },
    diagnosis: [
      {
        symptom:
          'Liquid entry or recent wetting, unusual smell, swelling, dangerous heat or a critical storage warning',
        check:
          'Prioritize safety and data preservation; do not run a stress test to compare costs',
        next: 1,
      },
      {
        symptom:
          'Slow, but settings help; or performance requirements are unclear',
        check:
          'Check your workload, official requirements and results before and after a change',
        next: 2,
      },
      {
        symptom: 'You want to replace only RAM, storage or another component',
        check:
          'Check model-specific compatibility, replaceability, labor and migration costs',
        next: 3,
      },
      {
        symptom: 'You have a repair quote or are considering replacement',
        check:
          'Compare warranty, what will be fixed, data handling, total cost and turnaround on the same basis',
        next: 4,
      },
    ],
    steps: [
      {
        title: 'Protect yourself and your data; check the warranty',
        actions: [
          'If liquid has entered the PC, it was recently wet, or there is smoke, an unusual smell, swelling or dangerous heat, stop using and charging the PC. Disconnect its power supply only if you can do so safely. Do not touch hot parts; contact the manufacturer. Do not remove a swollen battery or open a power supply.',
          'If there are no danger signs and the PC is safe to use, prioritize copying important files to separate storage when there is a critical storage warning or suspected fault. Do not start with a reset, reinstall, benchmark or repeated repair attempts. If the data cannot be read, ask about preserving it.',
          'Check the purchase date, model, manufacturer or retailer warranty, extended coverage and exclusions. You do not need to paste warranty documents containing personal details or a serial number into a website diagnosis or public comment. For a work or school PC, contact its administrator.',
        ],
        expected:
          'You know the safety concerns, warranty contact and whether important data is backed up.',
        unexpected:
          'If there are danger signs or unreadable data, seek help rather than repeatedly powering on or dismantling the PC.',
        revert:
          'Do not resume use just to make a comparison. Wait for the manufacturer’s advice before using it again, and verify your backup after the repair.',
      },
      {
        title: 'Separate settings issues from insufficient performance',
        actions: [
          'Define what you want to run comfortably: documents, several apps at once, or a specific game at your target quality and resolution. Compare the software’s official minimum and recommended requirements with your OS, CPU, RAM, GPU and available storage.',
          'Only if there are no danger signs or critical warnings, close unnecessary apps and check storage space or graphics settings one change at a time. Compare ordinary use before and after. Do not choose a replacement part based only on a 100% utilization reading.',
          'If the settings changes are satisfactory, keeping the current PC is an option. Go to Step 3 if you have identified a shortfall. Contact repair support for suspected faults such as power loss or diagnostic errors. If the result is unclear, postpone the purchase decision.',
        ],
        expected:
          'You can distinguish improvements from settings changes from the hardware shortfalls that affect your needs.',
        unexpected:
          'A problem limited to one game may involve its updates, settings or software. Replacing the PC is not guaranteed to fix it.',
        revert:
          'Restore any comparison settings to the original values you recorded. Do not use data deletion or a reset as a comparison test.',
      },
      {
        title: 'Check whether compatible parts can meet your needs',
        actions: [
          'Use the model’s official specifications or service information to check soldered RAM, free slots, supported capacity, SSD interface and GPU, power-supply or case constraints. Some laptop and all-in-one parts are not replaceable. You do not need to dismantle the PC yourself.',
          'An SSD replacement may address capacity or storage-related limitations; it does not increase CPU or GPU performance. More RAM is an option when memory is insufficient, not a fix for every freeze.',
          'Include parts, labor, diagnosis, shipping, OS setup, data migration, extra components and the warranty after the work. For failed storage, ask about data recovery separately: its price and feasibility differ from ordinary migration.',
          'If compatibility is uncertain, the PC is under warranty, or there is a battery or power-supply problem, ask the manufacturer or repair shop about compatibility and the scope of work before buying parts or opening the PC.',
        ],
        expected:
          'You know what can be replaced, what it would improve and the total upgrade cost.',
        unexpected:
          'If the part cannot be replaced, the result would not meet your needs or compatibility is unclear, get repair or replacement quotes before buying parts.',
        revert:
          'Getting a quote requires no hardware change. Ask about restoring the previous setup and return eligibility before ordering.',
      },
      {
        title: 'Compare three options: repair, upgrade or a new PC',
        actions: [
          'Write down one thing the PC needs to do, such as playing your current game at the same settings. Compare the options below that can meet that need. If settings changes are enough, keeping the PC is also an option.',
          'Here, repair means fixing a fault; an upgrade means adding performance or capacity. Replacing a broken part is also a repair. Check your model to find out which parts can be replaced.',
          'Compare the amount you pay after warranty coverage, including tax and shipping. Add only necessary costs that are missing from the quote; do not count included items twice. Leave unknown fees marked for confirmation, not as zero.',
          'Alongside the price, check the warranty after repair or purchase, when the PC will be usable, and support for the OS and required software. Ask separately about data recovery: it differs from ordinary migration in cost and feasibility.',
        ],
        resultRows: [
          {
            state: 'Repair: fix a fault in your current PC',
            meaning:
              'Aims to restore what the PC could already do. Fixing the fault does not necessarily improve performance that was already insufficient.',
            next: 'Diagnosis + repair parts + labor + shipping + required migration and setup. Confirm the amount you pay after warranty coverage.',
          },
          {
            state: 'Upgrade: improve your current PC',
            meaning:
              'Addresses a known shortfall, such as RAM or storage capacity. Check compatibility. An SSD does not boost CPU or GPU performance, and an upgrade may not fix an unexplained fault.',
            next: 'Compatible parts + installation + required supporting components + shipping + migration and setup. Add diagnosis if charged separately.',
          },
          {
            state: 'Replace: buy a different PC',
            meaning:
              'Lets you choose a PC with the performance you need. Check software and peripheral compatibility. It is not a guaranteed fix for a game or software problem.',
            next: 'PC + shipping + required software and peripherals + migration and setup + disposal of the old PC.',
          },
        ],
        expected:
          'You can compare options that meet the same need by total cost, warranty and days without a usable PC.',
        unexpected:
          'If details are missing, wait before buying. Confirm what the repair covers, the extra-charge limit and approval process, and whether data will be erased.',
        revert:
          'Comparing makes no changes. Before ordering, check diagnosis and return-shipping fees if you decline or cancel, and when the quote expires.',
      },
    ],
    escalation:
      'Before contacting support, gather the model, intended use, symptoms, warranty status, backup status and what the quote includes. Do not post passwords, recovery keys, serial numbers or complete logs publicly. This page and the web diagnosis cannot identify a failed component, set a repair price or establish that replacement is necessary.',
    faqs: [
      {
        question: 'Should I replace a PC that is more than five years old?',
        answer:
          'Age alone cannot decide this. Check whether it meets your needs, warranty and parts availability, OS and software support, the actual fault and the total repair cost. Keeping it is an option if it works and meets your needs.',
      },
      {
        question:
          'Should I replace it if repair costs more than half of a new PC?',
        answer:
          'That is not a universal threshold. The new PC’s performance, migration costs, post-repair warranty, data and your requirements can change the answer. Compare the full cost of options that meet the same needs.',
      },
      {
        question: 'Will replacing just the SSD or RAM fix it?',
        answer:
          'First identify the shortfall or fault and confirm model compatibility. An SSD does not boost CPU or GPU performance, and more RAM does not fix every crash. Some configurations, including soldered memory, cannot be upgraded.',
      },
      {
        question: 'Does “no fault found” mean I need a new PC?',
        answer:
          'No. Distinguish settings or software issues, insufficient performance for your needs and faults that did not occur during inspection. One clean diagnostic result neither guarantees a healthy PC nor means you need to buy another.',
      },
    ],
    sources: [
      {
        title: 'Lenovo: safely stopping power after a liquid spill',
        url: lenovoLiquid,
      },
      {
        title:
          'Microsoft: what to do about a critical storage-device warning (Japanese)',
        url: storageWarning,
      },
      { title: 'HP: stop using a PC with a swollen battery', url: hpBattery },
      {
        title: 'Microsoft: improving PC performance (Japanese)',
        url: microsoft,
      },
      {
        title:
          'Dell: distinguishing power, startup and video problems (Japanese)',
        url: dell,
      },
    ],
    related: [
      {
        href: '/pc/pc-broken',
        label: 'Check power, display and startup symptoms (Japanese)',
      },
      {
        href: '/diagnose',
        label:
          'Organize your checks with the free on-device PC game diagnosis (Japanese)',
      },
      {
        href: '/pc/disk-usage-100',
        label:
          'Check 100% disk usage without assuming hardware failure (Japanese)',
      },
      {
        href: '/en/tools/windows-diagnosis',
        label: 'Windows game diagnosis: how to use it and its limits',
      },
    ],
    sourcePolicy:
      'We checked the official guidance below and organized the comparisons and decision categories editorially. Follow the manufacturer’s model-specific advice. The examples are troubleshooting aids, not results of hands-on testing across all devices. Linked Japanese sources and Japan-based cost examples retain their original scope.',
    checkedAt: '2026-10-10',
  },
  {
    locale: 'zh',
    slug: 'repair-or-replace',
    title: '电脑该维修、升级还是换新？比较配件与总费用',
    shortTitle: '比较维修、升级与换新',
    seoTitle: '电脑维修还是换新：配件更换费用与判断步骤',
    description:
      '先区分设置问题、性能不足与疑似故障，再决定是否换电脑。核对保修、机型、可更换配件、维修报价、数据迁移及实际使用需求。',
    lead: '不要仅因电脑变慢或用了多年就决定换新。先确认它能否满足你的用途，再比较修复范围和总费用。本指南主要面向日本的个人 Windows 电脑及维修服务；电源、显示和启动问题另有排查文章。',
    answer:
      '维修还是换新，需要结合故障依据、保修、可更换配件、修复后能满足的用途，以及包含数据迁移的总费用判断。调整设置后能满足需求，可以继续使用；确认某项性能不足且配件可更换，可以比较升级方案；出现故障警告，应咨询维修。信息不足时先检查和询价，不能仅凭使用年数或“维修费达到新机一半”来决定。',
    quickChecks: [
      '有液体进入电脑、电脑近期曾被弄湿，或有异味、烟雾、鼓包或危险高温：停止使用和充电，联系厂商。不要为了诊断或备份而强行开机。',
      '有严重存储警告：仅在能够安全操作时，优先备份重要数据。无法复制时，不要反复写入或重置，应咨询数据保全。',
      '没有危险迹象：收集用途、机型、保修、配件更换限制和维修报价，再进行比较。',
    ],
    evidenceSummary: {
      title: '花钱前先分清四种情况',
      tocLabel: '四种判断与下一步',
      intro:
        '以下是编辑部整理的检查顺序，不是购买结论。诊断结果或使用率本身不能确定某个配件已经损坏。',
      items: [
        {
          label: '优先调整设置',
          explanation:
            '已有记录显示调整应用或画质设置后症状改善。如果改善后的状态能满足用途，也可以不购买新设备，继续使用。',
        },
        {
          label: '确认是否性能不足',
          explanation:
            '电脑未达到软件官方要求，或已确认日常使用中的具体短板。根据机型规格和总费用，核对更换兼容内存、SSD、显卡等能否满足需求。',
        },
        {
          label: '疑似故障，咨询维修',
          explanation:
            '厂商诊断报错、存储警告或整台电脑反复异常，都需要进一步检查。先保护重要数据，再核对保修和检测、维修报价。警告本身不能确定损坏配件或维修价格。',
        },
        {
          label: '信息不足',
          explanation:
            '尚不清楚受影响的操作、所需性能、机型或报价。未知不等于正常，应返回症状排查，补齐信息。',
        },
      ],
      limitation:
        '“未发现故障”并不代表必须换新。短时间诊断没有报错，也不能保证电脑完全正常。',
      sources: [
        { label: 'Microsoft：改善电脑性能（日语）', url: microsoft },
        { label: 'Dell：区分电源、启动与显示问题（日语）', url: dell },
      ],
    },
    diagnosis: [
      {
        symptom:
          '液体进入电脑或近期被弄湿、异味、鼓包、危险高温，或严重存储警告',
        check: '优先保证安全和保护数据，不为比较费用而运行压力测试',
        next: 1,
      },
      {
        symptom: '运行慢但调整设置有效，或性能要求不明确',
        check: '核对用途、官方配置要求，以及修改前后的结果',
        next: 2,
      },
      {
        symptom: '只想更换内存、SSD 等个别配件',
        check: '确认具体机型是否可更换、兼容配件、工时费和迁移费',
        next: 3,
      },
      {
        symptom: '已有维修报价，或正在考虑换新',
        check: '在相同条件下比较保修、修复范围、数据处理、总费用和耗时',
        next: 4,
      },
    ],
    steps: [
      {
        title: '先保证安全、保护数据，再核对保修',
        actions: [
          '有液体进入电脑、电脑近期曾被弄湿，或出现烟雾、异味、鼓包或危险高温时，停止使用和充电；仅在能够安全操作时断开供电。不要勉强触碰高温部位，应联系厂商。不要自行拆下鼓包电池或拆开电源装置。',
          '没有危险迹象且可以安全操作时，如有严重存储警告或疑似故障，先将重要文件复制到其他存储介质。不要先重置、重装、跑分或反复尝试修复。数据无法读取时，应咨询如何保全数据。',
          '核对购买日期、型号、厂商及销售商保修、延长保修的范围与免责条款。无需把含个人信息的保修单或序列号粘贴到网站诊断或公开留言中。公司或学校的电脑请联系管理员。',
        ],
        expected: '明确安全风险、保修联系渠道，以及重要数据是否已有备份。',
        unexpected:
          '存在危险迹象或数据无法读取时，停止反复通电和拆机，寻求专业帮助。',
        revert:
          '不要为了比较结果而恢复使用；应按厂商确认后的建议处理。维修完成后仍需检查备份。',
      },
      {
        title: '区分设置问题与用途所需的性能不足',
        actions: [
          '明确希望流畅完成的任务，例如文档处理、同时运行多个应用，或以目标画质和分辨率玩某款游戏。对照软件官方最低及推荐配置，核对系统、CPU、内存、GPU 和可用存储空间。',
          '仅在没有危险异常或严重警告时，逐项关闭不需要的应用、检查剩余空间或画质设置，并用日常操作比较前后变化。不要仅凭使用率达到 100% 就决定更换哪个配件。',
          '设置调整后已满意，可以保留现有电脑。找到具体性能短板后进入步骤 3；如有断电、诊断报错等疑似故障，联系维修。如果结果不清楚，暂缓购买决定。',
        ],
        expected: '分清设置能改善的部分，以及满足用途仍缺少的性能。',
        unexpected:
          '只有某款游戏出问题时，也应考虑更新、设置和软件问题。不能保证换电脑就能解决。',
        revert:
          '将为比较而修改的设置恢复为事先记录的值。不要通过删除数据或重置电脑来做比较。',
      },
      {
        title: '按具体机型确认升级能否满足需求',
        actions: [
          '查看该型号的官方规格或维护说明，确认内存是否板载焊接、空闲插槽、支持容量、SSD 接口，以及显卡、电源和机箱的限制。笔记本和一体机的部分配件可能无法更换，无需自行拆机确认。',
          '更换 SSD 可能改善容量或存储相关瓶颈，但不会提升 CPU 或 GPU 本身的性能。增加内存适用于内存不足的情况，并不能解决所有卡死问题。',
          '除了配件价格，还要询问工时、检测、运费、系统设置、数据迁移、附加配件及施工后的保修。存储设备故障时，数据恢复的价格和可行性应与普通迁移分开确认。',
          '不确定兼容性、仍在保修期内，或内置电池及电源有异常时，应先向厂商或维修店确认适配情况和作业范围，再决定是否购买配件或拆机。',
        ],
        expected: '明确可更换的配件、能够改善的范围，以及升级总费用。',
        unexpected:
          '无法更换、升级后仍达不到所需性能，或兼容性不明时，不要先买配件，应继续比较维修和换新报价。',
        revert:
          '询价阶段无需更改硬件。下单前向商家确认能否恢复原配置，以及退货条件。',
      },
      {
        title: '比较三个方案：修好、升级、换电脑',
        actions: [
          '先写下电脑必须完成的一件事，例如以相同画质玩现在的游戏。再从下面三个方案中比较能满足这一需求的选项。如果调整设置已经够用，也可以继续使用。',
          '这里的“维修”指修复故障，“升级配件”指补足性能或容量。更换损坏配件也属于维修。哪些配件能换，要按具体机型确认。',
          '比较含税、含运费、保修承担后实际自付的总额。只加上报价未包含的必要费用，不要重复计算。未知费用应标为待确认，不能按零计算。',
          '除价格外，还要确认维修或购买后的保修、何时能用上电脑，以及系统和必要软件的支持情况。数据恢复与普通迁移不同，应单独询问价格和可行性。',
        ],
        resultRows: [
          {
            state: '维修：修好现有电脑的故障',
            meaning:
              '目标是恢复原本能完成的用途。故障修好了，也不代表原来不足的性能会提高。',
            next: '检测费＋维修配件＋工时＋运费＋必要的迁移和设置费。确认保修承担后实际自付的金额。',
          },
          {
            state: '升级：提高现有电脑的性能',
            meaning:
              '补足已确认的内存或存储容量等短板，需确认兼容性。换 SSD 不会提升 CPU 或 GPU 性能，也不能保证解决原因不明的故障。',
            next: '兼容配件＋安装工时＋必要的配套部件＋运费＋迁移和设置费。检测费如单独收取，也要加上。',
          },
          {
            state: '换新：更换整台电脑',
            meaning:
              '选择性能满足需求的电脑。需确认软件和外设的兼容性，不能保证解决游戏或软件本身的问题。',
            next: '电脑价格＋运费＋必要的软件和外设＋迁移和设置费＋旧电脑处理费。',
          },
        ],
        expected:
          '按总费用、保修和无法使用电脑的天数，比较能满足同一用途的方案。',
        unexpected:
          '信息不清楚时暂缓购买。先确认维修能解决什么、追加费用上限和批准方式，以及是否会清除数据。',
        revert:
          '比较方案无需改动电脑。委托前确认拒绝报价或取消时的检测费、退回运费，以及报价有效期。',
      },
    ],
    escalation:
      '咨询时整理型号、用途、症状、保修状态、是否备份及报价包含的项目。不要公开密码、恢复密钥、序列号或完整日志。本页和网页诊断都不能确定损坏配件、维修价格，也不能判定必须换新。',
    faqs: [
      {
        question: '电脑用了五年以上就该换新吗？',
        answer:
          '不能只看年数。应核对能否满足用途、保修和配件供应、系统与软件支持、具体故障，以及维修总费用。如果运行正常并能满足用途，继续使用也是一种选择。',
      },
      {
        question: '维修费超过新机价格的一半就该换新吗？',
        answer:
          '这不是通用界线。新机性能、迁移费用、维修后的保修、数据和用途不同，结论也会不同。请比较能满足相同需求的方案总费用。',
      },
      {
        question: '只换 SSD 或内存就能修好吗？',
        answer:
          '需要先确认短板或故障位置，以及机型兼容性。SSD 不会提高 CPU 或 GPU 性能，增加内存也不能解决所有崩溃。板载焊接等配置可能无法升级。',
      },
      {
        question: '检测说没有故障，就必须换新吗？',
        answer:
          '不是。应区分设置或软件问题、用途所需的性能不足，以及检测时没有复现的异常。一次“无异常”结果既不能保证电脑完全正常，也不能证明必须购买新机。',
      },
    ],
    sources: [
      {
        title: 'Lenovo：洒入液体后安全断电的注意事项（英语）',
        url: lenovoLiquid,
      },
      {
        title: 'Microsoft：存储设备出现严重警告时的处理方法（日语）',
        url: storageWarning,
      },
      { title: 'HP：电池鼓包时停止使用（英语）', url: hpBattery },
      { title: 'Microsoft：改善电脑性能（日语）', url: microsoft },
      { title: 'Dell：区分电源、启动与显示问题（日语）', url: dell },
    ],
    related: [
      {
        href: '/pc/pc-broken',
        label: '从电源、显示与启动症状排查故障（日语）',
      },
      {
        href: '/diagnose',
        label: '用免费的本地 PC 游戏诊断整理检查顺序（日语）',
      },
      {
        href: '/pc/disk-usage-100',
        label: '磁盘使用率 100% 时，先检查而非直接认定故障（日语）',
      },
      {
        href: '/tools/windows-diagnosis',
        label: 'Windows 游戏诊断的用法与局限（日语）',
      },
    ],
    sourcePolicy:
      '我们核对了以下官方说明，并由编辑部整理比较方法和判断框架。具体机型应遵循厂商说明。这些示例用于排查，并非对所有设备进行实机测试的结论。日语来源和日本维修费用示例保留原有适用范围。',
    checkedAt: '2026-10-10',
  },
  {
    locale: 'es',
    slug: 'repair-or-replace',
    title: '¿Reparar, ampliar o cambiar de PC? Compara el coste total',
    shortTitle: 'Reparar, ampliar o cambiar de PC',
    seoTitle: 'Reparar o cambiar de PC: costes de componentes y presupuestos',
    description:
      'Distingue ajustes, falta de rendimiento y posibles averías antes de cambiar de PC. Compara garantía, componentes compatibles, reparación, traslado de datos y tus necesidades.',
    lead: 'Antes de cambiar un PC porque va lento o tiene años, comprueba si puede cubrir tus necesidades y compara el alcance y el coste total de repararlo. Esta guía se centra en ordenadores Windows de uso personal y servicios de reparación en Japón. Los problemas de encendido, imagen y arranque se tratan por separado.',
    answer:
      'Compara los indicios de avería, la garantía, los componentes sustituibles, las tareas que podrá realizar el PC reparado y el coste total, incluido el traslado de datos. Si unos ajustes bastan, puedes seguir usándolo; si identificas una carencia y la pieza es sustituible, compara una ampliación; si hay señales de avería, consulta una reparación. Si faltan datos, investiga y pide presupuesto primero. Ni la edad ni la regla de “la mitad del precio de uno nuevo” bastan por sí solas.',
    quickChecks: [
      'Ha entrado líquido en el PC, se ha mojado recientemente, o hay olor extraño, humo, hinchazón o calor peligroso: deja de usar y cargar el PC y contacta con el fabricante. No fuerces el arranque para diagnosticarlo ni hacer una copia.',
      'Advertencia crítica de almacenamiento: prioriza la copia de los datos importantes solo si es seguro usar el equipo. Si no puedes copiarlos, evita seguir escribiendo o restableciendo y consulta cómo conservarlos.',
      'Sin señales de peligro: reúne tus necesidades, el modelo, la garantía, las opciones de ampliación y un presupuesto de reparación.',
    ],
    evidenceSummary: {
      title: 'Cuatro situaciones que revisar antes de gastar',
      tocLabel: 'Cuatro decisiones y sus comprobaciones',
      intro:
        'Son categorías editoriales para elegir la siguiente comprobación, no una recomendación de compra. Un diagnóstico o un porcentaje de uso no confirman por sí solos que un componente esté averiado.',
      items: [
        {
          label: 'Prioriza los ajustes',
          explanation:
            'Has registrado una mejora al cambiar ajustes de una aplicación o la calidad gráfica. Si así cubres tus necesidades, seguir usando el equipo sin comprar nada es una opción.',
        },
        {
          label: 'Comprueba una posible falta de rendimiento',
          explanation:
            'El equipo no alcanza los requisitos oficiales del programa, o has identificado una limitación en tu uso habitual. Revisa las especificaciones del modelo y el coste total para saber si ampliar RAM, SSD o GPU con piezas compatibles bastaría.',
        },
        {
          label: 'Posible avería: consulta una reparación',
          explanation:
            'Los errores del diagnóstico del fabricante, las advertencias de almacenamiento o los fallos repetidos de todo el PC requieren atención. Protege los datos y revisa la garantía y el presupuesto de inspección o reparación. Una advertencia no determina la pieza averiada ni el precio.',
        },
        {
          label: 'Falta información',
          explanation:
            'No conoces el alcance del problema, el rendimiento necesario, el modelo o el presupuesto. No consideres correcto lo desconocido: vuelve a comprobar los síntomas y reúne los datos que faltan.',
        },
      ],
      limitation:
        'Que no se encuentre una avería no significa que debas cambiar de PC. Tampoco un diagnóstico breve sin errores garantiza que todo funcione correctamente.',
      sources: [
        {
          label: 'Microsoft: mejorar el rendimiento del PC (en japonés)',
          url: microsoft,
        },
        {
          label:
            'Dell: distinguir problemas de encendido, arranque e imagen (en japonés)',
          url: dell,
        },
      ],
    },
    diagnosis: [
      {
        symptom:
          'Entrada de líquido o equipo mojado recientemente, olor extraño, hinchazón, calor peligroso o una advertencia crítica de almacenamiento',
        check:
          'Prioriza la seguridad y los datos; no hagas pruebas de estrés para comparar costes',
        next: 1,
      },
      {
        symptom:
          'Va lento, pero los ajustes ayudan; o desconoces los requisitos',
        check:
          'Revisa tu uso, los requisitos oficiales y el resultado antes y después de cada cambio',
        next: 2,
      },
      {
        symptom: 'Quieres sustituir solo la RAM, el SSD u otro componente',
        check:
          'Comprueba si el modelo permite el cambio, la compatibilidad, la mano de obra y la migración',
        next: 3,
      },
      {
        symptom:
          'Tienes presupuesto de reparación o estás pensando en cambiar de PC',
        check:
          'Compara garantía, alcance, datos, coste total y plazo bajo las mismas condiciones',
        next: 4,
      },
    ],
    steps: [
      {
        title: 'Protege tu seguridad y tus datos; revisa la garantía',
        actions: [
          'Si ha entrado líquido en el PC, se ha mojado recientemente, o hay humo, olor extraño, hinchazón o calor peligroso, deja de usar y cargar el equipo. Desconecta la alimentación solo si puedes hacerlo sin riesgo. No toques zonas calientes y contacta con el fabricante. No extraigas una batería hinchada ni abras una fuente de alimentación.',
          'Si no hay señales de peligro y es seguro usar el PC, ante una advertencia crítica de almacenamiento o posible avería, copia primero los archivos importantes a otro dispositivo. No empieces por restablecer, reinstalar, ejecutar pruebas de rendimiento o repetir reparaciones. Si los datos no se leen, consulta cómo conservarlos.',
          'Comprueba fecha de compra, modelo, garantía del fabricante y de la tienda, ampliaciones de cobertura y exclusiones. No necesitas pegar documentos de garantía con datos personales ni el número de serie en un diagnóstico web o comentario público. En un PC del trabajo o del centro educativo, contacta con su administrador.',
        ],
        expected:
          'Conoces los riesgos, el contacto de garantía y si hay copia de los datos importantes.',
        unexpected:
          'Si hay peligro o datos ilegibles, busca ayuda en lugar de encender o desmontar el equipo repetidamente.',
        revert:
          'No vuelvas a usarlo solo para comparar resultados. Espera las indicaciones del fabricante y verifica la copia después de la reparación.',
      },
      {
        title: 'Distingue los ajustes de una falta de rendimiento',
        actions: [
          'Define qué quieres hacer con comodidad: documentos, varias aplicaciones a la vez o un juego concreto con cierta calidad y resolución. Compara los requisitos oficiales mínimos y recomendados con el sistema operativo, CPU, RAM, GPU y espacio disponible.',
          'Solo si no hay señales de peligro ni advertencias críticas, cierra aplicaciones innecesarias y comprueba espacio libre o ajustes gráficos, cambiando una cosa cada vez. Compara el uso habitual antes y después. No elijas qué pieza sustituir solo por un uso del 100 %.',
          'Si los ajustes te satisfacen, conservar el equipo es una opción. Ve al Paso 3 si identificas una carencia concreta. Consulta al servicio de reparación si sospechas una avería, por ejemplo apagados o errores de diagnóstico. Si el resultado no está claro, aplaza la compra.',
        ],
        expected:
          'Puedes separar lo que mejoran los ajustes de las carencias de hardware para tus tareas.',
        unexpected:
          'Si solo falla un juego, también pueden influir sus actualizaciones, ajustes o software. Cambiar de PC no garantiza resolverlo.',
        revert:
          'Restaura los ajustes de comparación a los valores originales que anotaste. No borres datos ni restablezcas el PC para hacer una comparación.',
      },
      {
        title: 'Comprueba si una ampliación compatible sería suficiente',
        actions: [
          'Consulta las especificaciones o documentación de servicio del modelo: RAM soldada, ranuras libres, capacidad admitida, interfaz del SSD y límites de GPU, fuente y caja. Algunos componentes de portátiles y equipos todo en uno no se pueden sustituir. No necesitas desmontar el PC tú mismo.',
          'Cambiar el SSD puede ayudar con la capacidad o las limitaciones de almacenamiento, pero no aumenta el rendimiento de CPU o GPU. Añadir RAM es una opción si falta memoria, no una solución para todos los bloqueos.',
          'Incluye piezas, mano de obra, diagnóstico, envío, configuración del sistema, traslado de datos, componentes adicionales y garantía posterior. Si falla el almacenamiento, pregunta aparte por la recuperación de datos: su precio y viabilidad difieren de una migración normal.',
          'Si no sabes si una pieza es compatible, el PC sigue en garantía o hay problemas de batería o alimentación, consulta la compatibilidad y el alcance del trabajo con el fabricante o el taller antes de comprar piezas o abrir el equipo.',
        ],
        expected:
          'Sabes qué se puede sustituir, qué mejoraría y el coste total de la ampliación.',
        unexpected:
          'Si no se puede cambiar la pieza, no se alcanzaría el rendimiento necesario o la compatibilidad es incierta, pide presupuestos de reparación o sustitución antes de comprar componentes.',
        revert:
          'Pedir presupuesto no requiere cambiar el hardware. Antes de comprar, pregunta por la restauración de la configuración anterior y las condiciones de devolución.',
      },
      {
        title: 'Compara tres opciones: reparar, ampliar o cambiar de PC',
        actions: [
          'Anota una tarea que el PC debe poder hacer, como jugar a tu juego actual con los mismos ajustes. Compara las opciones de abajo que cumplan ese objetivo. Si basta con cambiar ajustes, también puedes conservarlo.',
          'Aquí, reparar significa arreglar una avería; ampliar, mejorar el rendimiento o la capacidad. Cambiar una pieza averiada también es una reparación. Consulta qué piezas se pueden sustituir en tu modelo.',
          'Compara lo que pagarás tras aplicar la garantía, con impuestos y envío. Suma solo los gastos necesarios que falten en el presupuesto; no cuentes dos veces los incluidos. Marca los importes desconocidos como pendientes, no como cero.',
          'Además del precio, revisa la garantía tras reparar o comprar, cuándo podrás usar el PC y el soporte del sistema y los programas necesarios. Pregunta aparte por la recuperación de datos: su precio y viabilidad difieren del traslado normal.',
        ],
        resultRows: [
          {
            state: 'Reparar: arreglar tu PC actual',
            meaning:
              'Busca recuperar lo que ya podía hacer. Resolver la avería no implica mejorar un rendimiento que ya era insuficiente.',
            next: 'Diagnóstico + piezas de reparación + mano de obra + envío + traslado de datos y configuración necesarios. Confirma cuánto pagarás tras aplicar la garantía.',
          },
          {
            state: 'Ampliar: mejorar tu PC actual',
            meaning:
              'Cubre una carencia identificada, como RAM o almacenamiento. Requiere compatibilidad. Un SSD no mejora la CPU ni la GPU; ampliar tampoco garantiza resolver una avería de causa desconocida.',
            next: 'Piezas compatibles + instalación + componentes auxiliares necesarios + envío + traslado de datos y configuración. Añade el diagnóstico si se cobra aparte.',
          },
          {
            state: 'Cambiar: comprar otro PC',
            meaning:
              'Permite elegir un PC con el rendimiento necesario. Comprueba programas y periféricos compatibles. No garantiza resolver problemas del propio juego o software.',
            next: 'PC + envío + programas y periféricos necesarios + traslado de datos y configuración + retirada del equipo antiguo.',
          },
        ],
        expected:
          'Puedes comparar opciones para la misma tarea por coste total, garantía y días sin un PC utilizable.',
        unexpected:
          'Si faltan datos, espera antes de comprar. Confirma qué cubre la reparación, el límite y la aprobación de cargos extra, y si se borrarán los datos.',
        revert:
          'Comparar no cambia nada. Antes de encargar, consulta los gastos de diagnóstico y devolución si rechazas o cancelas, y cuándo caduca el presupuesto.',
      },
    ],
    escalation:
      'Al consultar, prepara modelo, uso previsto, síntomas, estado de la garantía y de la copia de seguridad, y partidas incluidas en el presupuesto. No publiques contraseñas, claves de recuperación, números de serie ni registros completos. Esta página y el diagnóstico web no determinan la pieza averiada, el precio de reparación ni que sea obligatorio cambiar de PC.',
    faqs: [
      {
        question: '¿Debo cambiar un PC con más de cinco años?',
        answer:
          'La edad por sí sola no lo determina. Revisa si cubre tus necesidades, la garantía, la disponibilidad de piezas, el soporte del sistema y programas, la avería real y el coste total de reparación. Conservarlo es una opción si funciona y te sirve.',
      },
      {
        question:
          '¿Conviene cambiarlo si reparar cuesta más de la mitad de uno nuevo?',
        answer:
          'No es un límite universal. El rendimiento del equipo nuevo, la migración, la garantía posterior a la reparación, los datos y tus tareas pueden cambiar la conclusión. Compara el coste total de opciones que cubran las mismas necesidades.',
      },
      {
        question: '¿Basta con cambiar el SSD o la RAM?',
        answer:
          'Primero hay que identificar la carencia o avería y confirmar la compatibilidad del modelo. Un SSD no mejora CPU o GPU, y más RAM no resuelve todos los cierres. Algunas configuraciones, como la memoria soldada, no se pueden ampliar.',
      },
      {
        question:
          '¿“No se ha encontrado avería” significa que necesito otro PC?',
        answer:
          'No. Distingue problemas de ajustes o software, falta de rendimiento para tus tareas y fallos que no se reprodujeron durante la inspección. Un único diagnóstico sin errores no garantiza que el PC esté sano ni demuestra que debas comprar otro.',
      },
    ],
    sources: [
      {
        title:
          'Lenovo: precauciones para cortar la alimentación tras un derrame (en inglés)',
        url: lenovoLiquid,
      },
      {
        title:
          'Microsoft: qué hacer ante una advertencia crítica de almacenamiento (en japonés)',
        url: storageWarning,
      },
      {
        title: 'HP: deja de usar el PC si la batería está hinchada (en inglés)',
        url: hpBattery,
      },
      {
        title: 'Microsoft: mejorar el rendimiento del PC (en japonés)',
        url: microsoft,
      },
      {
        title:
          'Dell: distinguir problemas de encendido, arranque e imagen (en japonés)',
        url: dell,
      },
    ],
    related: [
      {
        href: '/pc/pc-broken',
        label: 'Comprueba encendido, imagen y arranque (en japonés)',
      },
      {
        href: '/diagnose',
        label:
          'Ordena las comprobaciones con el diagnóstico gratuito de juegos de PC, ejecutado en tu dispositivo (en japonés)',
      },
      {
        href: '/pc/disk-usage-100',
        label:
          'Comprueba el uso del disco al 100 % sin dar por hecho una avería (en japonés)',
      },
      {
        href: '/tools/windows-diagnosis',
        label: 'Diagnóstico de juegos para Windows: uso y límites (en japonés)',
      },
    ],
    sourcePolicy:
      'Revisamos las instrucciones oficiales enlazadas y organizamos editorialmente las comparaciones y categorías de decisión. Sigue las indicaciones del fabricante para tu modelo. Los ejemplos ayudan a investigar; no son pruebas prácticas de todos los dispositivos. Las fuentes japonesas y los ejemplos de costes de Japón conservan ese ámbito.',
    checkedAt: '2026-10-10',
  },
];
