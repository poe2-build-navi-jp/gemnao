import type { GearGuide } from './gear-guides';

// Decision guides, not benchmark results. All editions use the same section IDs
// and sources. Existing zh/es indexing policy is intentionally unchanged.
export type UpgradeLocale = 'ja' | 'en' | 'zh' | 'es';
type Copy = Omit<
  GearGuide,
  'slug' | 'seoTitle' | 'checkedAt' | 'sources' | 'related'
>;
type Source = { url: string; title: Record<UpgradeLocale, string> };
const sources: Record<string, Source> = {
  performance: {
    url: 'https://support.microsoft.com/en-us/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows',
    title: {
      ja: 'Microsoft公式：Windowsのパフォーマンス確認（英語）',
      en: 'Microsoft: Check Windows performance',
      zh: 'Microsoft：检查 Windows 性能（英文）',
      es: 'Microsoft: comprobar el rendimiento de Windows (inglés)',
    },
  },
  ram: {
    url: 'https://www.kingston.com/unitedkingdom/en/blog/gaming/how-much-memory-for-gaming',
    title: {
      ja: 'Kingston公式：ゲームの要求メモリの確認（英語）',
      en: 'Kingston: Memory requirements for gaming',
      zh: 'Kingston：游戏需要多少内存（英文）',
      es: 'Kingston: requisitos de memoria para jugar (inglés)',
    },
  },
  ddr: {
    url: 'https://www.kingston.com/en/blog/pc-performance/ddr-memory-generation-differences',
    title: {
      ja: 'Kingston公式：DDR4とDDR5の互換性（英語）',
      en: 'Kingston: DDR4 and DDR5 compatibility',
      zh: 'Kingston：DDR4 与 DDR5 的兼容性（英文）',
      es: 'Kingston: compatibilidad entre DDR4 y DDR5 (inglés)',
    },
  },
  memorySupport: {
    url: 'https://www.kingston.com/en/support/technical/products/desktop-notebook-memory',
    title: {
      ja: 'Kingston公式：機種別メモリの互換性・増設時の確認（英語）',
      en: 'Kingston: Desktop and notebook memory support',
      zh: 'Kingston：台式机与笔记本内存支持（英文）',
      es: 'Kingston: compatibilidad de memoria para PC y portátiles (inglés)',
    },
  },
  space: {
    url: 'https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/free-up-drive-space-in-windows',
    title: {
      ja: 'Microsoft公式：Windowsでドライブの空き容量を増やす（英語）',
      en: 'Microsoft: Free up drive space in Windows',
      zh: 'Microsoft：释放 Windows 磁盘空间（英文）',
      es: 'Microsoft: liberar espacio en Windows (inglés)',
    },
  },
  steamMove: {
    url: 'https://help.steampowered.com/en/faqs/view/4BD4-4528-6B2E-8327',
    title: {
      ja: 'Steam公式：ゲームのインストール先を移動する（英語）',
      en: 'Steam: Moving a Steam installation and games',
      zh: 'Steam：移动 Steam 与游戏安装位置（英文）',
      es: 'Steam: mover la instalación de Steam y los juegos (inglés)',
    },
  },
  ssd: {
    url: 'https://www.kingston.com/en/blog/pc-performance/ssd-form-factors',
    title: {
      ja: 'Kingston公式：SSDの形状とSATA・NVMeの違い（英語）',
      en: 'Kingston: SSD form factors and interfaces',
      zh: 'Kingston：SSD 外形与接口（英文）',
      es: 'Kingston: formatos e interfaces de SSD (inglés)',
    },
  },
  parts: {
    url: 'https://www.intel.com/content/www/us/en/gaming/resources/how-to-build-a-gaming-pc.html',
    title: {
      ja: 'Intel公式：PC部品の選定と互換性（英語）',
      en: 'Intel: Selecting compatible gaming PC components',
      zh: 'Intel：选择兼容的游戏 PC 部件（英文）',
      es: 'Intel: elegir componentes compatibles para un PC (inglés)',
    },
  },
  upgrades: {
    url: 'https://www.hp.com/us-en/tech-takes/desktops/glossary/desktop-upgrades.html',
    title: {
      ja: 'HP公式：部品交換と電源・マザーボードの確認（英語）',
      en: 'HP: Desktop upgrades and compatibility checks',
      zh: 'HP：台式机升级与兼容性检查（英文）',
      es: 'HP: ampliaciones y compatibilidad de un PC de sobremesa (inglés)',
    },
  },
  windows: {
    url: 'https://www.microsoft.com/en-us/windows/windows-11-specifications',
    title: {
      ja: 'Microsoft公式：Windows 11の仕様と要件（英語）',
      en: 'Microsoft: Windows 11 specifications and requirements',
      zh: 'Microsoft：Windows 11 规格与要求（英文）',
      es: 'Microsoft: especificaciones y requisitos de Windows 11 (inglés)',
    },
  },
};

type Entry = {
  slug: string;
  sourceKeys: string[];
  related: string[];
  amazonSearches: { label: string; query: string }[];
  copy: Record<UpgradeLocale, Copy>;
};

const entries: Entry[] = [
  {
    slug: 'gaming-memory-16gb-32gb',
    sourceKeys: ['ram', 'performance', 'ddr', 'memorySupport'],
    related: ['steam-storage-ssd-guide', 'gaming-pc-upgrade-or-replace'],
    amazonSearches: [
      { label: 'DDR4・32GBの製品を調べる', query: 'DDR4 メモリ 32GB キット' },
      { label: 'DDR5・32GBの製品を調べる', query: 'DDR5 メモリ 32GB キット' },
    ],
    copy: {
      ja: {
        title: 'ゲーム用メモリは16GBで足りる？32GBへ増設する前の確認',
        shortTitle: 'メモリ16GBと32GBの選び方',
        description:
          'ゲーム用メモリを16GBから32GBへ増設すべきか、公式の要求量と普段の使用状況から判断。RAMとVRAMの違い、DDR4・DDR5、ノートPCの増設可否、購入前の確認点を整理します。',
        lead: '容量を増やす前に、遊ぶゲームが求める量と、実際に足りなくなる場面を確認しましょう。32GBにすればすべてのカクつきが直る、という意味ではありません。',
        answer:
          '16GBでゲームの推奨条件を満たし、普段の使い方でもメモリ不足が見られなければ、そのまま使えます。ゲーム側が32GBを求める場合や、同時に使うアプリを減らしても容量不足が続く場合は32GBを検討。購入前に、PCの型番ごとの対応規格・最大容量・交換可否を確認してください。',
        beforeBuying: [
          'ゲームの公式動作環境で、最低と推奨の「メモリ」を確認する。VRAM・ビデオメモリの欄は別に見る。',
          'Ctrl＋Shift＋Escでタスクマネージャーを開き、メモリを確認。普段のゲーム・通話・ブラウザーを使う場面と、不要なアプリを閉じた場面を比べる。',
          '使用率が一度高くなっただけで増設を決めない。症状の時刻、再現条件、同時起動アプリを記録し、ほかの原因の切り分けにも使う。',
        ],
        compareTitle: '16GBを使い続ける条件と、32GBを検討する条件',
        compare: {
          headers: ['状況', '判断の目安', '次に確認すること'],
          rows: [
            [
              '16GBで要求を満たし、普段の操作に支障がない',
              '追加購入を急がない',
              '大型更新で要求が変わった場合に再確認',
            ],
            [
              'ゲームが32GBを要求する／同時起動時に容量不足が続く',
              '32GBへの増設を検討',
              'PCの対応規格、空きスロット、最大容量',
            ],
            [
              'ビデオメモリ不足の警告が出る',
              'RAM増設とは別の切り分け',
              'GPUのVRAMとゲームのテクスチャ設定',
            ],
          ],
        },
        sections: [
          {
            id: 'measure-memory',
            title: '同じ場面を比べ、メモリが足りない条件を残す',
            paragraphs: [
              '普段問題が出る場面でメモリの使用状況を見てから、不要なブラウザーや録画アプリを正常に終了し、同じ場面で比べます。アプリ終了前には作業を保存してください。',
              'この比較は購入判断の材料です。使用率だけで原因を確定したり、32GBにした場合のFPSを予測したりはできません。特定のゲームだけなら、更新情報や設定も併せて確認します。',
            ],
          },
          {
            id: 'ram-and-vram',
            title: 'RAMの32GBとGPUのVRAMを分けて考える',
            paragraphs: [
              'PCのメインメモリとGPU用のメモリは別の確認項目です。メインメモリを16GBから32GBへ増設しても、専用GPUに載ったVRAMの容量が増えるわけではありません。',
              '「ビデオメモリが不足」と出たら、GPUの正確な型番とVRAM、ゲーム側の解像度・テクスチャ条件を先に照合します。内蔵GPUが使う共有メモリも、専用GPUのVRAMと同じ性能として扱わないでください。',
            ],
          },
          {
            id: 'compatibility',
            title: 'DDR4・DDR5、形状、交換できる機種かを確認する',
            paragraphs: [
              '同じ32GBでもDDR4とDDR5は差し替えて使えません。PC・マザーボードの公式仕様で対応世代、DIMM／SO-DIMMなどの形状、対応容量と取り付け構成を確認します。',
              'ノートPCには交換できないメモリを使う機種もあります。タスクマネージャーの表示だけで増設可否を決めず、機種別マニュアルやメーカーの対応表で確認してください。',
            ],
            items: [
              'PCの正確な型番と、メーカーが対応するとしている部品',
              '既存メモリの容量・枚数、交換後の合計容量',
              '対応速度、保証、作業費を含めた総額',
            ],
          },
        ],
        setupTitle: '増設した後に確認すること',
        setup: [
          '取り付けは機種別の公式手順に従います。電源・内蔵バッテリーの扱いが不明なら作業を進めず、メーカーや対応店へ相談してください。',
          'Windowsで認識容量を確認し、増設前と同じゲーム・アプリ・設定で比較。エラーや起動失敗が出たら、追加の設定変更を重ねず部品の互換性と取り付け手順を確認します。',
        ],
        faqs: [
          {
            question: '32GBにすればFPSは必ず上がりますか？',
            answer:
              '必ず上がるとは言えません。CPU・GPU・設定・ゲーム側の問題なども関係します。このページは実機ベンチマークではなく、容量と互換性の判断ガイドです。',
          },
          {
            question: '16GBに別の16GBを足してもいい？',
            answer:
              '合計容量だけで判断しないでください。規格、PCの対応構成、既存品との組み合わせをメーカーの資料で確認します。混在では互換性の問題が起こる場合があります。',
          },
          {
            question: 'ノートPCならSO-DIMMを買えば増設できますか？',
            answer:
              '機種によります。交換できない構造や対応容量の制限もあるため、型番ごとの公式マニュアルを先に確認してください。',
          },
        ],
      },
      en: {
        title: '16GB or 32GB RAM for Gaming? Check Before You Upgrade',
        shortTitle: 'Choose between 16GB and 32GB RAM',
        description:
          'Compare game requirements with actual memory use before upgrading from 16GB to 32GB. Check RAM versus VRAM, DDR4/DDR5 compatibility and laptop upgrade limits.',
        lead: 'Start with the games you play and the situations where memory runs short. Installing 32GB does not promise to fix every hitch.',
        answer:
          'Keep 16GB if it meets the game’s recommended requirements and your usual workload has no memory shortage. Consider 32GB when the game requires it or shortages persist after closing unnecessary apps. Confirm the exact PC model’s supported memory, capacity and replacement options first.',
        beforeBuying: [
          'Read the game’s minimum and recommended RAM requirements. Treat the VRAM requirement separately.',
          'Open Task Manager with Ctrl+Shift+Esc. Compare memory use during your usual game, voice chat and browser workload with unnecessary apps closed.',
          'A single high reading is not a diagnosis. Record when the symptom occurs, what is running and whether the comparison changes it.',
        ],
        compareTitle: 'When to keep 16GB and when to consider 32GB',
        compare: {
          headers: ['Situation', 'Decision', 'Next check'],
          rows: [
            [
              '16GB meets requirements and normal use is fine',
              'No urgent purchase',
              'Recheck if a game update changes its requirements',
            ],
            [
              'The game requires 32GB or simultaneous apps keep exhausting memory',
              'Consider a 32GB upgrade',
              'Supported generation, slots and maximum capacity',
            ],
            [
              'The warning says video memory',
              'Investigate separately from system RAM',
              'GPU VRAM and texture settings',
            ],
          ],
        },
        sections: [
          {
            id: 'measure-memory',
            title: 'Compare the same scene and record the workload',
            paragraphs: [
              'Observe memory use where the problem normally happens. Save your work, close unnecessary browsers or recording apps normally, then compare the same scene.',
              'This is evidence for a purchase decision, not proof of the cause or a prediction of FPS after an upgrade. For a problem limited to one game, also check its updates and settings.',
            ],
          },
          {
            id: 'ram-and-vram',
            title: 'Separate system RAM from GPU VRAM',
            paragraphs: [
              'System memory and graphics memory are different checks. Increasing system RAM from 16GB to 32GB does not increase the VRAM fitted to a discrete GPU.',
              'For a video-memory warning, compare the exact GPU, its VRAM and the game’s resolution and texture requirements. Shared memory on an integrated GPU is not equivalent to the performance of dedicated VRAM.',
            ],
          },
          {
            id: 'compatibility',
            title: 'Check DDR generation, form factor and replaceability',
            paragraphs: [
              'A 32GB DDR5 kit is not a drop-in replacement for DDR4. Check the PC or motherboard manual for generation, DIMM/SO-DIMM form factor, supported capacity and installation arrangement.',
              'Some laptops have memory that cannot be replaced. Task Manager alone cannot establish upgradeability; use the exact model’s manual or compatibility list.',
            ],
            items: [
              'Exact PC model and supported components',
              'Current module count and total capacity after replacement',
              'Supported speed, warranty and total cost including installation',
            ],
          },
        ],
        setupTitle: 'Check the result after an upgrade',
        setup: [
          'Follow the model-specific installation instructions. If power or internal-battery handling is unclear, ask the manufacturer or an appropriate service provider before proceeding.',
          'Check the detected capacity in Windows and compare the original workload and settings. For errors or a failed boot, investigate compatibility and installation instead of stacking further changes.',
        ],
        faqs: [
          {
            question: 'Will 32GB always increase FPS?',
            answer:
              'No. CPU/GPU limits, settings and game problems also matter. This is a capacity and compatibility guide, not a hands-on benchmark.',
          },
          {
            question: 'Can I add another 16GB module?',
            answer:
              'Capacity alone is not enough. Check the specification, supported arrangement and combination with existing memory. Mixed modules can introduce compatibility problems.',
          },
          {
            question: 'Can any laptop take SO-DIMM memory?',
            answer:
              'No. Some designs do not allow replacement and capacity limits vary. Check the exact model’s official manual first.',
          },
        ],
      },
      zh: {
        title: '游戏内存选 16GB 还是 32GB？升级前先检查这些条件',
        shortTitle: '16GB 与 32GB 游戏内存怎么选',
        description:
          '对照游戏要求与实际内存使用情况，判断是否从 16GB 升到 32GB。区分 RAM 与显存，核对 DDR4、DDR5、笔记本升级限制和购买条件。',
        lead: '先确认游戏要求，以及在哪些使用场景中内存不足。换成 32GB 不代表所有卡顿都会消失。',
        answer:
          '如果 16GB 符合游戏推荐要求，日常使用也没有内存不足，可以继续使用。游戏要求 32GB，或关闭不必要的应用后仍持续缺少内存时，再考虑升级。购买前应核对具体机型支持的规格、最大容量及能否更换。',
        beforeBuying: [
          '查看游戏官方最低与推荐配置中的内存要求，显存要求要单独核对。',
          '按 Ctrl+Shift+Esc 打开任务管理器，对比平时游戏、语音和浏览器同时运行，与关闭不必要应用后的内存使用情况。',
          '不要仅凭一次高占用决定购买。记录症状时间、同时运行的应用，以及对比后是否变化。',
        ],
        compareTitle: '什么时候保留 16GB，什么时候考虑 32GB',
        compare: {
          headers: ['情况', '判断方向', '下一项检查'],
          rows: [
            [
              '16GB 满足要求，平时使用正常',
              '不急于购买',
              '游戏更新并改变要求时再确认',
            ],
            [
              '游戏要求 32GB，或多任务持续导致内存不足',
              '考虑升级到 32GB',
              '支持的代数、插槽及最大容量',
            ],
            ['提示显存不足', '与系统内存分开排查', 'GPU 显存及纹理设置'],
          ],
        },
        sections: [
          {
            id: 'measure-memory',
            title: '用同一场景对比，记录运行条件',
            paragraphs: [
              '在通常出现问题的场景观察内存使用。先保存工作，正常关闭不必要的浏览器或录制应用，再比较同一场景。',
              '这些记录用于辅助购买判断，不能单凭占用率确定原因，也不能预测升级后的帧率。只有某款游戏出现问题时，还要检查更新信息和设置。',
            ],
          },
          {
            id: 'ram-and-vram',
            title: '系统内存和 GPU 显存是两项检查',
            paragraphs: [
              '把系统内存从 16GB 升到 32GB，不会增加独立显卡自带的显存容量。两者应分别核对。',
              '出现显存不足提示时，先检查准确的 GPU 型号、显存容量，以及游戏的分辨率和纹理要求。集成显卡使用的共享内存，也不能按独立显存的性能来理解。',
            ],
          },
          {
            id: 'compatibility',
            title: '核对 DDR 代数、外形和能否更换',
            paragraphs: [
              '同为 32GB，DDR4 和 DDR5 也不能直接互换。查看电脑或主板手册中的代数、DIMM／SO-DIMM 外形、容量与安装组合。',
              '部分笔记本的内存无法更换。任务管理器的显示不能独立证明可以升级，应查具体机型的官方手册或兼容列表。',
            ],
            items: [
              '准确机型与官方支持的部件',
              '现有内存条数量及更换后的总容量',
              '支持速度、保修与含安装费的总价',
            ],
          },
        ],
        setupTitle: '升级后如何确认',
        setup: [
          '按照具体机型的官方安装说明操作。电源或内置电池的处理方式不明确时，先咨询厂商或维修服务方。',
          '在 Windows 中检查识别容量，并用原来的游戏、应用和设置对比。出现错误或无法启动时，先核对兼容性和安装，不要连续叠加修改。',
        ],
        faqs: [
          {
            question: '32GB 一定能提高帧率吗？',
            answer:
              '不一定。CPU、GPU、设置和游戏本身的问题也会影响表现。本文提供容量与兼容性判断，不是实机性能测试。',
          },
          {
            question: '可以再加一条 16GB 吗？',
            answer:
              '不能只看总容量。要核对规格、机型支持的安装组合和现有内存的兼容性；混用可能产生兼容问题。',
          },
          {
            question: '所有笔记本都能安装 SO-DIMM 吗？',
            answer:
              '不能。部分机型无法更换内存，最大容量也不同。应先查看准确机型的官方手册。',
          },
        ],
      },
      es: {
        title: '¿16GB o 32GB de RAM para jugar? Qué comprobar antes de ampliar',
        shortTitle: 'Elegir entre 16GB y 32GB de RAM',
        description:
          'Compara los requisitos del juego con el uso real antes de pasar de 16GB a 32GB. Distingue RAM y VRAM y comprueba DDR4, DDR5 y las limitaciones de tu portátil.',
        lead: 'Empieza por los juegos que usas y las situaciones en las que falta memoria. Instalar 32GB no garantiza eliminar todos los tirones.',
        answer:
          'Puedes mantener 16GB si cumplen los requisitos recomendados y tu uso habitual no agota la memoria. Considera 32GB si el juego los exige o la falta de memoria persiste al cerrar aplicaciones innecesarias. Confirma primero las especificaciones, la capacidad máxima y las opciones de sustitución del modelo exacto.',
        beforeBuying: [
          'Consulta la RAM mínima y recomendada del juego. Comprueba la VRAM por separado.',
          'Abre el Administrador de tareas con Ctrl+Shift+Esc. Compara el uso de memoria con tu juego, chat y navegador habituales y después de cerrar aplicaciones innecesarias.',
          'Un único valor alto no demuestra la causa. Anota cuándo ocurre el problema, qué aplicaciones están abiertas y qué cambia al compararlas.',
        ],
        compareTitle: 'Cuándo mantener 16GB y cuándo valorar 32GB',
        compare: {
          headers: ['Situación', 'Decisión', 'Siguiente comprobación'],
          rows: [
            [
              '16GB cumplen los requisitos y el uso habitual es correcto',
              'No urge comprar',
              'Revisar si una actualización cambia los requisitos',
            ],
            [
              'El juego exige 32GB o las aplicaciones simultáneas agotan la memoria',
              'Valorar una ampliación a 32GB',
              'Generación compatible, ranuras y capacidad máxima',
            ],
            [
              'El aviso menciona memoria de vídeo',
              'Investigar aparte de la RAM del sistema',
              'VRAM de la GPU y ajustes de texturas',
            ],
          ],
        },
        sections: [
          {
            id: 'measure-memory',
            title: 'Compara la misma escena y anota la carga',
            paragraphs: [
              'Observa la memoria donde suele aparecer el problema. Guarda tu trabajo, cierra normalmente los navegadores o grabadores innecesarios y compara la misma escena.',
              'Esta comparación ayuda a decidir una compra; no demuestra la causa ni predice los FPS tras ampliar. Si solo ocurre en un juego, consulta también sus actualizaciones y ajustes.',
            ],
          },
          {
            id: 'ram-and-vram',
            title: 'Distingue la RAM del sistema de la VRAM',
            paragraphs: [
              'Ampliar la RAM de 16GB a 32GB no aumenta la VRAM instalada en una tarjeta gráfica dedicada. Son comprobaciones diferentes.',
              'Ante un aviso de memoria de vídeo, contrasta el modelo exacto de GPU, su VRAM y los requisitos de resolución y texturas. La memoria compartida de una GPU integrada tampoco equivale al rendimiento de una VRAM dedicada.',
            ],
          },
          {
            id: 'compatibility',
            title: 'Comprueba generación DDR, formato y posibilidad de cambio',
            paragraphs: [
              'Un kit DDR5 de 32GB no sustituye directamente a uno DDR4. Consulta el manual del PC o placa: generación, formato DIMM/SO-DIMM, capacidad y configuración admitidas.',
              'Algunos portátiles no permiten sustituir la memoria. El Administrador de tareas no basta para confirmar una ampliación: consulta el manual o la lista de compatibilidad del modelo.',
            ],
            items: [
              'Modelo exacto y componentes admitidos',
              'Número de módulos actuales y capacidad total resultante',
              'Velocidad admitida, garantía y coste total con instalación',
            ],
          },
        ],
        setupTitle: 'Qué comprobar después de ampliar',
        setup: [
          'Sigue las instrucciones de instalación del modelo. Si no está claro cómo tratar la alimentación o la batería interna, consulta al fabricante o a un servicio adecuado.',
          'Comprueba la capacidad detectada en Windows y compara con el mismo juego, aplicaciones y ajustes. Si hay errores o no arranca, revisa compatibilidad e instalación antes de acumular cambios.',
        ],
        faqs: [
          {
            question: '¿32GB siempre aumentan los FPS?',
            answer:
              'No. También influyen CPU, GPU, ajustes y problemas del juego. Esta guía trata de capacidad y compatibilidad; no contiene pruebas de rendimiento propias.',
          },
          {
            question: '¿Puedo añadir otro módulo de 16GB?',
            answer:
              'La capacidad no basta. Comprueba las especificaciones, la distribución admitida y la combinación con la memoria existente. Mezclar módulos puede causar incompatibilidades.',
          },
          {
            question: '¿Cualquier portátil admite SO-DIMM?',
            answer:
              'No. Algunos no permiten sustituir la memoria y los límites de capacidad varían. Consulta primero el manual oficial del modelo exacto.',
          },
        ],
      },
    },
  },
  {
    slug: 'steam-storage-ssd-guide',
    sourceKeys: ['space', 'steamMove', 'ssd'],
    related: ['gaming-memory-16gb-32gb', 'gaming-pc-upgrade-or-replace'],
    amazonSearches: [
      { label: '1TBのSSDを調べる', query: 'SSD 1TB' },
      { label: '2TBのSSDを調べる', query: 'SSD 2TB' },
    ],
    copy: {
      ja: {
        title: 'Steamの容量不足を解消する方法｜ゲーム移動とSSD増設の選び方',
        shortTitle: 'Steamの容量不足とSSDの選び方',
        description:
          'Steamの容量不足を、不要データの整理・手持ちドライブへのゲーム移動・SSD増設の順に確認。必要容量の見積もり、SATAとNVMe、M.2の対応規格、セーブ保全と移動後の確認を解説します。',
        lead: '空き容量が足りないときは、どのドライブが埋まっているかを先に確認します。新しいSSDが必要か、手持ちのドライブで足りるかを判断しましょう。',
        answer:
          'Steamの設定→ストレージで対象ドライブとゲームの容量を確認します。不要なデータを整理するか、対応する手持ちの別ドライブへSteamの移動機能で移せば、追加購入が不要な場合があります。残したいゲームと更新用の空きを確保できない場合に、容量とPCの対応規格を確認してSSDを検討してください。',
        beforeBuying: [
          'Windowsの「設定→システム→ストレージ」とSteamのストレージ画面で、空きが足りないドライブを特定する。C:の不足と、別ドライブの不足を分ける。',
          'ゲームのセーブ場所とバックアップを確認。インストールフォルダーを移すだけで、すべてのセーブも移るとは限らない。',
          '削除候補は中身を確認し、必要なファイルを別に保全する。Downloadsやごみ箱を一括で空にせず、ゲームのフォルダーも手動で削除しない。',
        ],
        compareTitle: '整理・移動・増設から選ぶ',
        compare: {
          headers: ['選択肢', '向いている条件', '確認点'],
          rows: [
            [
              '不要データを整理する',
              '使っていない録画・ファイル・ゲームがある',
              '削除対象とセーブの保全を確認',
            ],
            [
              '手持ちの別ドライブへ移動する',
              '対応する移動先に十分な空きがある',
              'Steamライブラリを作り、移動機能を使う',
            ],
            [
              'SSDを増設・交換する',
              '残すゲームと更新に必要な空きが足りない',
              '容量だけでなく形状・接続・設置条件を確認',
            ],
          ],
        },
        sections: [
          {
            id: 'free-space',
            title: '削除する前に、容量を使っているものを確認する',
            paragraphs: [
              'Windowsのストレージ設定で分類を確認し、一時ファイルの一覧も内容を読んで選びます。手元に残したい録画や文書は、正常に開ける別のコピーを確認してから整理してください。',
              'ゲームを減らす場合はSteamのライブラリからアンインストールします。セーブの保存方法はゲームによって違うため、削除前に公式の保存先やCloud対応を確認し、必要なデータを保全します。',
            ],
          },
          {
            id: 'move-game',
            title: '同じPC内ならSteamのストレージ画面で移動する',
            paragraphs: [
              'Steamの設定→ストレージで移動先のライブラリを追加します。その後、移動元のドライブと対象ゲームを選び、「移動」から移動先を指定します。画面の表示はクライアントの版により変わる場合があります。',
              '移動後はインストール先を確認し、ゲームの起動と必要なセーブの表示を確かめます。別ドライブへの移動はバックアップの作成とは別です。エラーが出たら元データを手動削除せず、表示された内容を記録してください。',
            ],
          },
          {
            id: 'choose-ssd',
            title: '必要容量とSSDの接続規格を別々に確認する',
            paragraphs: [
              '同時に入れておきたいゲームの現在の容量を合計し、OS・アプリ・録画と更新作業に必要な空きも別に見積もります。例として100GBのゲーム5本ならゲームだけで500GBですが、これは容量計算の仮定で、特定ゲームの要件ではありません。',
              'M.2は形状の名前で、すべてのM.2がNVMeではありません。PCのマニュアルでSATA／PCIe NVMe、長さ、空きスロット、冷却部品との干渉を確認します。2.5インチなら接続・電源・設置場所も確認してください。',
              '外付けSSDはUSB端子や接続経路も確認が必要です。Steam本体の外付けドライブへのインストールをValveは推奨していません。外付けならどのゲームでも内蔵SSD要件を満たす、と判断しないでください。',
            ],
            items: [
              '保持するゲームの合計容量と、更新で必要になる追加の空き',
              '内蔵／外付け、接続規格、形状・長さと対応機種',
              'セーブの別コピー、設置・移行費、保証',
            ],
          },
        ],
        setupTitle: '整理・移動・増設後の確認',
        setup: [
          'WindowsとSteamの両方で対象ドライブの空き容量とライブラリを確認。ゲームのインストール先を取り違えていないか見ます。',
          'ゲームの起動と進行を確認してから、必要なセーブの別コピーを残します。この手順のために既存ドライブを初期化したり、パーティションを削除したりする必要はありません。',
        ],
        faqs: [
          {
            question: '空き容量は何％残せばいいですか？',
            answer:
              'すべてのゲームに共通する割合では決められません。公式のインストール要件に加え、更新時の展開容量と、同じドライブで使うOS・アプリの空きも確認してください。',
          },
          {
            question: 'ゲームを移したらセーブも移りますか？',
            answer:
              '必ずではありません。セーブはゲームのインストール先とは別のフォルダーにある場合があります。ゲームごとの保存先とCloud対象を確認してください。',
          },
          {
            question: 'SSDにすればFPSも上がりますか？',
            answer:
              '容量不足の解消とFPS向上は別の判断です。このページでは速度やFPSの実機比較は行っていません。ゲームのSSD要件を満たすことと、描画性能が上がることを同一視しないでください。',
          },
        ],
      },
      en: {
        title: 'Steam Running Out of Space? Move Games or Choose an SSD',
        shortTitle: 'Steam storage and SSD choices',
        description:
          'Check cleanup and moving Steam games before buying an SSD. Plan capacity, check SATA/NVMe and M.2 compatibility, preserve saves and verify the move.',
        lead: 'Identify which drive is full before buying storage. An existing drive may already give you the space you need.',
        answer:
          'Open Steam Settings → Storage to check the drive and installed games. Cleanup or Steam’s Move feature to a suitable existing drive may avoid a purchase. Consider an SSD when you cannot fit the games you want to keep plus update space, after checking capacity and PC compatibility.',
        beforeBuying: [
          'Compare Windows Settings → System → Storage with Steam’s Storage page. Separate a full C: drive from a full game drive.',
          'Locate and back up saves. Moving an installation folder does not necessarily move every save.',
          'Review deletion candidates and preserve needed files first. Do not indiscriminately empty Downloads or the Recycle Bin, or manually delete game folders.',
        ],
        compareTitle: 'Choose cleanup, relocation or more storage',
        compare: {
          headers: ['Option', 'Useful when', 'Check'],
          rows: [
            [
              'Clean up unwanted data',
              'Unused recordings, files or games occupy space',
              'Review deletions and preserve saves',
            ],
            [
              'Move to an existing drive',
              'A suitable destination has enough free space',
              'Create a Steam library and use Move',
            ],
            [
              'Add or replace an SSD',
              'Retained games and updates will not fit',
              'Check interface and physical compatibility as well as capacity',
            ],
          ],
        },
        sections: [
          {
            id: 'free-space',
            title: 'Identify what occupies space before deleting it',
            paragraphs: [
              'Review storage categories in Windows and inspect temporary-file selections. For recordings or documents you want to retain, verify a separate readable copy before cleanup.',
              'Uninstall unwanted games through Steam’s library. Save handling differs by game; check its official save location and Cloud support and preserve needed data first.',
            ],
          },
          {
            id: 'move-game',
            title: 'Use Steam Storage to move games on the same PC',
            paragraphs: [
              'In Steam Settings → Storage, add a destination library. Select the source drive and games, then use Move to choose the destination. Labels may vary with the client version.',
              'Afterward, check the installation location, launch the game and verify the expected saves. Relocation is not an independent backup. On an error, record the message rather than manually deleting original files.',
            ],
          },
          {
            id: 'choose-ssd',
            title: 'Plan capacity and check the SSD interface separately',
            paragraphs: [
              'Add the current sizes of games you want installed together. Budget separately for the OS, apps, recordings and working space for updates. Five hypothetical 100GB games take 500GB before anything else; this is a calculation example, not a game requirement.',
              'M.2 describes a form factor; not every M.2 SSD uses NVMe. Check the PC manual for SATA/PCIe NVMe support, length, available slots and cooling clearance. For 2.5-inch drives, also check mounting, data and power connections.',
              'External SSDs also depend on the USB connection. Valve advises against installing the Steam client on an external drive. Do not assume an external device satisfies every game’s internal-SSD requirements.',
            ],
            items: [
              'Total retained game size and extra update space',
              'Internal/external use, interface, dimensions and PC support',
              'Separate save copies, installation/migration costs and warranty',
            ],
          },
        ],
        setupTitle: 'Verify cleanup, relocation or expansion',
        setup: [
          'Check free space and library locations in both Windows and Steam. Confirm you are looking at the correct game drive.',
          'Verify launch and progress, and keep separate save copies. This procedure does not require formatting an existing drive or deleting partitions.',
        ],
        faqs: [
          {
            question: 'What percentage of the drive must remain free?',
            answer:
              'There is no single percentage for every game. Check installation requirements, update working space and the needs of the OS and apps sharing that drive.',
          },
          {
            question: 'Will moving a game also move its saves?',
            answer:
              'Not necessarily. Saves may live outside the installation folder. Check the specific game’s save location and Cloud coverage.',
          },
          {
            question: 'Will an SSD improve FPS?',
            answer:
              'Solving capacity shortage and improving FPS are different decisions. This guide contains no hands-on speed or FPS comparison; meeting an SSD requirement is not a promise of higher rendering performance.',
          },
        ],
      },
      zh: {
        title: 'Steam 空间不足怎么办？移动游戏与选择 SSD 的方法',
        shortTitle: 'Steam 容量不足与 SSD 选择',
        description:
          '购买 SSD 前先检查清理文件和移动 Steam 游戏的办法。估算容量，核对 SATA、NVMe 与 M.2 兼容性，保全存档并确认移动结果。',
        lead: '先确定是哪块硬盘空间不足。现有的另一块硬盘可能已经能解决容量问题。',
        answer:
          '在 Steam 设置→存储空间中查看目标硬盘与游戏容量。清理不需要的数据，或用 Steam 的移动功能转移到合适的现有硬盘，可能无需购买。仍无法容纳想保留的游戏及更新空间时，再核对容量与电脑兼容性后选择 SSD。',
        beforeBuying: [
          '对照 Windows 设置→系统→存储和 Steam 的存储页面，区分 C: 盘不足与其他游戏硬盘不足。',
          '先确认存档位置并备份。移动安装目录不一定会移动所有存档。',
          '删除前检查内容并保全需要的文件。不要直接清空下载文件夹、回收站，也不要手动删除游戏目录。',
        ],
        compareTitle: '选择清理、移动还是扩容',
        compare: {
          headers: ['办法', '适用条件', '需要确认'],
          rows: [
            [
              '清理不需要的数据',
              '有不用的录像、文件或游戏',
              '核对删除内容并保全存档',
            ],
            [
              '移动到现有硬盘',
              '合适的目标硬盘有足够空间',
              '创建 Steam 库并使用移动功能',
            ],
            [
              '增加或更换 SSD',
              '想保留的游戏与更新空间仍放不下',
              '除容量外，还要核对接口和安装条件',
            ],
          ],
        },
        sections: [
          {
            id: 'free-space',
            title: '先看哪些内容占空间，再决定删除',
            paragraphs: [
              '在 Windows 存储设置中查看分类，并检查临时文件的勾选项目。要保留的录像和文档，应先确认另一份副本能正常读取。',
              '不玩的游戏通过 Steam 库卸载。不同游戏的存档方式不同，应先查官方保存位置、云同步范围并保全需要的数据。',
            ],
          },
          {
            id: 'move-game',
            title: '同一台电脑内通过 Steam 存储页面移动',
            paragraphs: [
              '在 Steam 设置→存储空间中添加目标库，再选择来源硬盘和游戏，使用移动功能指定目标位置。客户端版本不同，界面文字可能变化。',
              '移动后核对安装位置，并检查启动和预期存档。移动不等于保留独立备份；遇到错误时先记录提示，不要手动删除原文件。',
            ],
          },
          {
            id: 'choose-ssd',
            title: '容量与接口分开核对',
            paragraphs: [
              '把想同时安装的游戏当前容量相加，再单独估算系统、应用、录像及更新工作空间。假设五款游戏各 100GB，仅游戏就需要 500GB；这是计算示例，不是某款游戏的要求。',
              'M.2 是外形规格，并不都采用 NVMe。查看电脑手册中的 SATA／PCIe NVMe 支持、长度、空余插槽和散热空间。2.5 英寸硬盘还要确认安装位、数据和供电连接。',
              '外置 SSD 还取决于 USB 接口和连接方式。Valve 不建议把 Steam 客户端安装到外置硬盘。不能默认任何外置设备都符合游戏的内置 SSD 要求。',
            ],
            items: [
              '保留游戏的总容量与更新额外空间',
              '内置或外置、接口、尺寸及机型支持',
              '独立存档副本、安装迁移费与保修',
            ],
          },
        ],
        setupTitle: '清理、移动或扩容后确认',
        setup: [
          '在 Windows 和 Steam 中分别查看目标硬盘的空闲容量与库位置，避免看错游戏所在的盘。',
          '检查启动和进度，并保留独立存档副本。本流程不要求格式化现有硬盘或删除分区。',
        ],
        faqs: [
          {
            question: '需要留出多少百分比的空闲空间？',
            answer:
              '不能用统一百分比适用于所有游戏。应核对安装要求、更新展开空间，以及同一硬盘上系统和应用的需要。',
          },
          {
            question: '移动游戏会同时移动存档吗？',
            answer:
              '不一定。存档可能在安装目录之外，应查具体游戏的保存位置与云同步范围。',
          },
          {
            question: '换 SSD 就能提高帧率吗？',
            answer:
              '解决容量不足与提高帧率是两项判断。本文没有实机速度或帧率对比；满足 SSD 要求不代表渲染性能一定提升。',
          },
        ],
      },
      es: {
        title: '¿Steam sin espacio? Mueve juegos o elige un SSD compatible',
        shortTitle: 'Espacio en Steam y elección de SSD',
        description:
          'Antes de comprar un SSD, revisa la limpieza y el traslado de juegos de Steam. Calcula la capacidad, comprueba SATA, NVMe y M.2 y protege tus partidas.',
        lead: 'Identifica qué unidad está llena antes de comprar almacenamiento. Otra unidad que ya tienes podría aportar el espacio necesario.',
        answer:
          'En Steam, abre Parámetros → Almacenamiento para comprobar la unidad y los juegos. Limpiar datos o usar la función de traslado hacia otra unidad adecuada puede evitar una compra. Valora un SSD si no caben los juegos que quieres conservar y el espacio de actualización, comprobando capacidad y compatibilidad.',
        beforeBuying: [
          'Compara Configuración → Sistema → Almacenamiento de Windows con la página de Steam. Distingue una unidad C: llena de otra unidad de juegos llena.',
          'Localiza y copia las partidas. Mover la carpeta de instalación no implica trasladar todos los guardados.',
          'Revisa qué vas a borrar y conserva primero los archivos necesarios. No vacíes Descargas o la Papelera indiscriminadamente ni borres carpetas de juegos a mano.',
        ],
        compareTitle: 'Elige entre limpiar, trasladar o ampliar',
        compare: {
          headers: ['Opción', 'Cuándo conviene', 'Comprobación'],
          rows: [
            [
              'Limpiar datos innecesarios',
              'Hay grabaciones, archivos o juegos que no usas',
              'Revisar lo que borras y proteger partidas',
            ],
            [
              'Trasladar a otra unidad existente',
              'Un destino adecuado tiene espacio suficiente',
              'Crear una biblioteca de Steam y usar el traslado',
            ],
            [
              'Añadir o sustituir un SSD',
              'No caben los juegos conservados y las actualizaciones',
              'Comprobar interfaz e instalación además de capacidad',
            ],
          ],
        },
        sections: [
          {
            id: 'free-space',
            title: 'Identifica qué ocupa espacio antes de borrarlo',
            paragraphs: [
              'Revisa las categorías de almacenamiento de Windows y la selección de archivos temporales. Si quieres conservar documentos o grabaciones, comprueba antes una copia independiente que puedas leer.',
              'Desinstala juegos desde la biblioteca de Steam. Cada juego gestiona las partidas de forma distinta: comprueba su ubicación oficial y la cobertura de la nube y conserva los datos necesarios.',
            ],
          },
          {
            id: 'move-game',
            title: 'Traslada juegos desde Almacenamiento en el mismo PC',
            paragraphs: [
              'Añade una biblioteca de destino desde los ajustes de almacenamiento de Steam. Selecciona la unidad de origen y los juegos y usa la opción de traslado para indicar el destino. Los nombres pueden variar con la versión.',
              'Comprueba la ubicación de instalación, el arranque y las partidas esperadas. Trasladar no crea una copia independiente. Si aparece un error, anótalo en vez de borrar manualmente los originales.',
            ],
          },
          {
            id: 'choose-ssd',
            title: 'Calcula capacidad y comprueba la interfaz por separado',
            paragraphs: [
              'Suma el tamaño actual de los juegos que quieres mantener instalados. Añade aparte sistema, aplicaciones, grabaciones y espacio de trabajo para actualizar. Cinco juegos hipotéticos de 100GB ocupan 500GB antes de lo demás: es un ejemplo de cálculo, no un requisito real de un título.',
              'M.2 es un formato; no todos los SSD M.2 son NVMe. Consulta en el manual SATA/PCIe NVMe, longitud, ranuras disponibles y espacio de refrigeración. En unidades de 2,5 pulgadas, revisa también montaje y conexiones de datos y alimentación.',
              'Un SSD externo también depende de la conexión USB. Valve desaconseja instalar el cliente de Steam en una unidad externa. No presupongas que un dispositivo externo satisface cualquier requisito de SSD interno.',
            ],
            items: [
              'Capacidad total de los juegos y espacio adicional para actualizar',
              'Uso interno/externo, interfaz, medidas y compatibilidad',
              'Copias separadas de partidas, instalación, migración y garantía',
            ],
          },
        ],
        setupTitle: 'Comprueba el resultado',
        setup: [
          'Revisa espacio libre y bibliotecas tanto en Windows como en Steam. Confirma que estás mirando la unidad correcta.',
          'Comprueba arranque y progreso y conserva copias de partidas. Este procedimiento no requiere formatear una unidad existente ni borrar particiones.',
        ],
        faqs: [
          {
            question: '¿Qué porcentaje debe quedar libre?',
            answer:
              'No existe un porcentaje válido para todos los juegos. Comprueba los requisitos de instalación, el espacio de actualización y las necesidades del sistema y aplicaciones de esa unidad.',
          },
          {
            question: '¿Se trasladan también las partidas?',
            answer:
              'No necesariamente. Pueden estar fuera de la carpeta de instalación. Consulta la ubicación y los datos sincronizados del juego concreto.',
          },
          {
            question: '¿Un SSD mejora los FPS?',
            answer:
              'Resolver la falta de capacidad y aumentar FPS son decisiones diferentes. Aquí no se han realizado comparaciones propias de velocidad o FPS; cumplir un requisito de SSD no garantiza mayor rendimiento gráfico.',
          },
        ],
      },
    },
  },
  {
    slug: 'gaming-pc-upgrade-or-replace',
    sourceKeys: ['performance', 'upgrades', 'parts', 'windows'],
    related: ['gaming-memory-16gb-32gb', 'steam-storage-ssd-guide'],
    amazonSearches: [
      { label: 'ゲーミングPCの構成を比較する', query: 'ゲーミングPC' },
    ],
    copy: {
      ja: {
        title: 'ゲーミングPCは増設か買い替えか？遊ぶゲームと予算で決める手順',
        shortTitle: 'PCの増設と買い替えを判断する',
        description:
          '遊びたいゲーム・解像度・FPS・総予算から、いまのPCの増設と買い替えを比較。CPU・GPU・VRAM・メモリ・SSD・OSの確認、電源やケースの互換性、見積もりの取り方を整理します。',
        lead: '「ゲームが重い」だけでは、PCを丸ごと買い替えるべきか判断できません。遊ぶ条件と、不足している項目を先にそろえて比較します。',
        answer:
          'まず遊びたいゲーム、画面の解像度、目標FPS、画質と総予算を書き出します。現在のPCを公式の動作環境と照合し、対応メモリやSSDの追加だけで必要条件を満たせるなら増設を比較。GPU・CPU・電源など複数の交換が必要なら、作業費と移行費も含めて完成品PCと見積もりを比べてください。',
        beforeBuying: [
          'ゲームを更新し、症状別の無料対策を確認。必要スペックを満たすのに特定のゲームだけ動かない場合は、買い替えを原因調査の代わりにしない。',
          'Windowsのシステム情報やタスクマネージャーで、CPU・GPUの正確な型番、RAM、OSを確認する。購入候補も同じ項目で比較する。',
          '最低環境・推奨環境に目標の解像度やFPSが書かれているか読む。記載がなければ「推奨だから144fps」のように補わない。',
        ],
        compareTitle: '不足している項目から比較対象を絞る',
        compare: {
          headers: ['現在の状態', '先に比較するもの', '購入前の確認'],
          rows: [
            [
              '条件は満たしているが、一部のゲームだけ不調',
              '無料対策と公式サポート',
              'ゲームの更新・設定・エラー記録',
            ],
            [
              'メモリか保存容量だけが不足',
              '対応部品の増設・交換',
              '対応規格、交換可否、部品＋作業費',
            ],
            [
              'CPU・GPUなど複数箇所が不足',
              '部品交換の総額と完成品PC',
              '電源・冷却・ケース・OS・移行費も含める',
            ],
          ],
        },
        sections: [
          {
            id: 'target',
            title: 'ゲーム・解像度・FPS・総予算を一枚にまとめる',
            paragraphs: [
              '遊びたいゲームを挙げ、例として「1920×1080・60fps・標準画質」のように希望条件を一つ決めます。これは目標の書き方の例で、どのPCでも達成できるという意味ではありません。',
              '総予算には本体だけでなく、必要なモニター、周辺機器、設置・作業費、データ移行を含めます。すでに使えるものは再利用し、希望条件を変える場合は見積もりも同じ条件で取り直します。',
            ],
          },
          {
            id: 'compare-specs',
            title: 'CPU・GPUの正式名と、容量以外の条件をそろえる',
            paragraphs: [
              'CPUとGPUはシリーズ名だけでなく、世代と正確な型番を記録します。デスクトップ版とノート版を名前だけで同等と扱わず、確認できる同じゲーム・解像度・設定の比較資料を使ってください。',
              'VRAMの容量が同じでもGPU性能が同じとは限りません。RAM、ストレージの種類と空き、対応OS、ゲーム固有の必須条件も別々に照合します。Windowsの要件を満たすことと、ゲームの推奨環境を満たすことも別です。',
            ],
          },
          {
            id: 'total-cost',
            title: '部品代だけでなく、交換できる構成と総額を比較する',
            paragraphs: [
              'GPU交換は電源の容量・端子、ケースの寸法、冷却の確認が必要です。CPU交換はマザーボードとファームウェアの対応も確認。メーカー製PCの独自部品やノートPCでは、交換範囲が限られることがあります。',
              '部品＋必要な関連部品＋作業費＋移行費を合計し、同じ希望条件の完成品PCと比べます。「増設の方が必ず安い」「何年以上なら買い替え」と一律には決めません。候補の詳細構成と保証も書面や販売ページに残してください。',
            ],
            items: [
              'ゲームと目標条件、現在のPC型番を見積もり先へ伝える',
              '追加部品・工賃・送料・移行を含む総額で比較する',
              '保証範囲、返品条件、納期、既存データの扱いを確認する',
            ],
          },
        ],
        setupTitle: '購入・交換後は同じ条件で確認する',
        setup: [
          '作業前にセーブと必要なデータを別に残し、メーカーの移行・設定手順を確認。新環境で確認できるまで旧PCや元のドライブを初期化しないでください。',
          '同じゲーム・解像度・画質で起動と進行を確認。目標を満たさない場合は、構成・設定・公式の不具合情報を照合し、確認した条件を販売元やメーカーへ伝えます。',
        ],
        faqs: [
          {
            question: '予算だけでおすすめPCを決められますか？',
            answer:
              '遊ぶゲーム、解像度、FPS、画質も必要です。同じ価格でも構成は異なり、価格だけでは希望する動作を保証できません。',
          },
          {
            question: 'ノートPCのGPUだけ交換できますか？',
            answer:
              'できるとは限りません。一般的なデスクトップ用GPUの交換手順をそのまま使わず、機種別の公式マニュアルやメーカーの回答で確認してください。',
          },
          {
            question: 'ゲームの推奨環境なら必ず快適ですか？',
            answer:
              '条件と更新状況によります。公式が示す解像度・画質・FPSがあればそこまで含めて照合し、記載のない性能を推測しないでください。この記事は特定機種の実機評価ではありません。',
          },
        ],
      },
      en: {
        title: 'Upgrade or Replace Your Gaming PC? Start with Games and Budget',
        shortTitle: 'Decide between a PC upgrade and replacement',
        description:
          'Set your games, resolution, FPS and total budget before comparing a PC upgrade with replacement. Check exact CPU/GPU models, compatibility and complete costs.',
        lead: 'A slow game alone does not tell you whether to replace the whole PC. Compare the intended workload and the requirements it fails to meet first.',
        answer:
          'Write down games, resolution, target FPS, quality settings and total budget. Compare your PC with official requirements. If supported RAM or storage upgrades cover the shortfall, price those first. When several parts need replacing, compare complete upgrade costs, installation and migration with a prebuilt PC.',
        beforeBuying: [
          'Update the game and try the relevant free troubleshooting. If requirements are met and only one title fails, investigate its error instead of treating replacement as a diagnosis.',
          'Record exact CPU/GPU models, RAM and OS using Windows system information or Task Manager. Compare candidates using the same fields.',
          'Check whether official requirements specify resolution, FPS and settings. A recommended specification with no FPS figure does not promise 144fps.',
        ],
        compareTitle: 'Narrow the decision by the actual shortfall',
        compare: {
          headers: ['Current situation', 'Compare first', 'Before purchasing'],
          rows: [
            [
              'Requirements met; only some games fail',
              'Free checks and official support',
              'Updates, settings and error records',
            ],
            [
              'Only RAM or storage capacity is insufficient',
              'Compatible component upgrades',
              'Specification, replaceability, parts and labor',
            ],
            [
              'Several components, such as CPU/GPU, fall short',
              'Total upgrade cost versus a prebuilt PC',
              'Include power, cooling, case, OS and migration',
            ],
          ],
        },
        sections: [
          {
            id: 'target',
            title: 'Write games, resolution, FPS and complete budget together',
            paragraphs: [
              'Choose the games and a clear target, such as 1920×1080, 60fps and medium settings. This is an example of describing a goal, not a promise that any PC can meet it.',
              'Include required displays, peripherals, installation and migration in the budget. Reuse suitable equipment; when the goal changes, obtain comparable quotes for the new conditions.',
            ],
          },
          {
            id: 'compare-specs',
            title: 'Use exact component names and more than capacity',
            paragraphs: [
              'Record the exact CPU/GPU model and generation, not just a family name. Do not equate desktop and laptop parts from similar names; use verifiable comparisons for the same game, resolution and settings.',
              'Equal VRAM capacity does not establish equal GPU performance. Check system RAM, storage type and free space, supported OS and game-specific requirements separately. Windows eligibility does not establish game performance.',
            ],
          },
          {
            id: 'total-cost',
            title: 'Compare compatible configurations and the whole bill',
            paragraphs: [
              'A GPU change needs checks for power capacity/connectors, case dimensions and cooling. CPU replacement also depends on motherboard and firmware support. Proprietary prebuilt parts and laptop designs can limit replacement options.',
              'Add components, supporting parts, labor and migration, then compare with a prebuilt PC for the same target. Neither upgrades nor replacement are always cheaper, and age alone is not the decision. Retain the detailed configuration and warranty terms.',
            ],
            items: [
              'Give the provider your games, target conditions and exact PC model',
              'Compare totals including extra parts, labor, delivery and migration',
              'Check warranty, returns, delivery time and treatment of existing data',
            ],
          },
        ],
        setupTitle: 'Verify the same workload after purchase or replacement',
        setup: [
          'Keep separate copies of saves and required files and check the manufacturer’s migration instructions. Do not erase the old PC or drive before verifying the new setup.',
          'Check launch and progress using the same game, resolution and quality. If the target is missed, compare configuration, settings and official issue reports and share the recorded conditions with the seller or manufacturer.',
        ],
        faqs: [
          {
            question: 'Is budget enough to choose a gaming PC?',
            answer:
              'No. Games, resolution, FPS and quality also matter. PCs at the same price can have different configurations; price alone guarantees no particular result.',
          },
          {
            question: 'Can I replace just a laptop GPU?',
            answer:
              'Do not assume so. Confirm the exact model’s service manual or manufacturer’s advice rather than applying a desktop GPU procedure.',
          },
          {
            question: 'Do recommended requirements guarantee smooth play?',
            answer:
              'Read the conditions and current game information. Include any stated resolution, settings and FPS, and do not invent figures that are absent. This article is not a hands-on review of a particular PC.',
          },
        ],
      },
      zh: {
        title: '游戏 PC 该升级还是换新？从游戏需求与预算开始判断',
        shortTitle: '判断电脑升级还是换新',
        description:
          '先确定游戏、分辨率、目标帧率和总预算，再比较升级与换新。核对 CPU、GPU、内存、SSD、系统要求，以及电源、机箱兼容性和完整费用。',
        lead: '只知道游戏运行慢，还不能判断是否需要换整台电脑。先统一目标条件，并找出不满足要求的项目。',
        answer:
          '写下游戏、分辨率、目标帧率、画质和总预算，再对照官方要求检查现有电脑。如果兼容的内存或存储升级能补足需求，先比较扩容费用。多个部件都需要更换时，把安装与数据迁移计入总价，再与整机比较。',
        beforeBuying: [
          '更新游戏并检查相应的免费排查办法。配置已符合要求、仅某款游戏失败时，应先调查错误，不能把换电脑当作诊断结果。',
          '通过 Windows 系统信息或任务管理器记录准确的 CPU、GPU 型号、内存和系统，候选电脑也按相同项目比较。',
          '检查官方要求是否写明分辨率、画质和帧率。没有帧率说明的推荐配置，不代表保证 144fps。',
        ],
        compareTitle: '根据实际不足缩小比较范围',
        compare: {
          headers: ['当前情况', '优先比较', '购买前确认'],
          rows: [
            [
              '满足配置要求，只有部分游戏异常',
              '免费排查与官方支持',
              '更新、设置及错误记录',
            ],
            [
              '仅内存或存储容量不足',
              '兼容部件的扩容或更换',
              '规格、能否更换、部件与人工费用',
            ],
            [
              'CPU、GPU 等多个项目不足',
              '升级总价与整机',
              '包含电源、散热、机箱、系统和迁移',
            ],
          ],
        },
        sections: [
          {
            id: 'target',
            title: '一起记录游戏、分辨率、帧率与完整预算',
            paragraphs: [
              '列出游戏，设定明确目标，例如 1920×1080、60fps、中等画质。这是目标写法的示例，不是任何电脑都能达到的保证。',
              '预算应包括需要的显示器、外设、安装和迁移费用。仍能满足条件的设备可以继续使用；目标变化后，应按新条件重新取得可比较的报价。',
            ],
          },
          {
            id: 'compare-specs',
            title: '使用完整型号，不只比较容量',
            paragraphs: [
              '记录 CPU、GPU 的准确型号和代数，不只看系列名称。不要根据相似名称认为台式机与笔记本部件性能相同，应采用同款游戏、分辨率和设置下可核实的比较资料。',
              '显存容量相同不代表 GPU 性能相同。系统内存、存储类型与空余空间、支持的系统和游戏特定要求都要分开核对。符合 Windows 要求也不代表符合游戏要求。',
            ],
          },
          {
            id: 'total-cost',
            title: '比较可兼容的配置与完整费用',
            paragraphs: [
              '更换 GPU 要确认电源容量和接口、机箱尺寸及散热。CPU 更换还取决于主板与固件支持。品牌机的专用部件和笔记本设计可能限制更换范围。',
              '将部件、配套部件、人工和迁移费用相加，再与满足同一目标的整机比较。不能统一认定升级一定便宜，也不能只凭使用年限决定换新。应保留详细配置和保修条件。',
            ],
            items: [
              '向报价方说明游戏、目标条件和准确机型',
              '把额外部件、人工、运费与迁移全部计入',
              '确认保修、退货、交付时间和原有数据处理方式',
            ],
          },
        ],
        setupTitle: '购买或更换后，用相同条件检查',
        setup: [
          '先保留存档与必要文件的独立副本，查看厂商迁移说明。新环境确认完成前，不要清空旧电脑或原硬盘。',
          '以相同游戏、分辨率和画质检查启动与进度。未达到目标时，核对配置、设置和官方问题公告，并向销售方或厂商提供已记录的条件。',
        ],
        faqs: [
          {
            question: '只看预算就能选游戏电脑吗？',
            answer:
              '还需要游戏、分辨率、帧率和画质。相同价格的配置可能不同，价格本身不能保证运行结果。',
          },
          {
            question: '笔记本可以只换 GPU 吗？',
            answer:
              '不能默认可以。应根据具体机型的官方维修手册或厂商答复判断，不要直接套用台式机显卡更换流程。',
          },
          {
            question: '达到推荐配置就一定流畅吗？',
            answer:
              '要结合官方条件和游戏更新情况。若写明分辨率、画质和帧率，应一起对照；没有写出的性能不要推测。本文不是某款整机的实测评测。',
          },
        ],
      },
      es: {
        title:
          '¿Ampliar o cambiar tu PC para jugar? Decide con juegos y presupuesto',
        shortTitle: 'Decidir entre ampliar y cambiar el PC',
        description:
          'Define juegos, resolución, FPS y presupuesto total antes de ampliar o cambiar el PC. Comprueba modelos de CPU/GPU, memoria, SSD, compatibilidad y costes completos.',
        lead: 'Que un juego vaya lento no basta para decidir cambiar el PC entero. Compara primero el objetivo y los requisitos que no se cumplen.',
        answer:
          'Anota juegos, resolución, FPS, calidad y presupuesto total. Contrasta el PC con los requisitos oficiales. Si ampliar RAM o almacenamiento compatible cubre lo que falta, compara esa opción. Si debes sustituir varios componentes, incluye instalación y migración y compara el total con un equipo premontado.',
        beforeBuying: [
          'Actualiza el juego y realiza las comprobaciones gratuitas pertinentes. Si cumples requisitos y solo falla un título, investiga el error; cambiar el PC no demuestra su causa.',
          'Anota modelos exactos de CPU/GPU, RAM y sistema mediante la información de Windows o el Administrador de tareas. Compara candidatos con los mismos datos.',
          'Comprueba si los requisitos oficiales indican resolución, FPS y calidad. Unos requisitos recomendados sin cifra de FPS no prometen 144fps.',
        ],
        compareTitle: 'Acota la decisión según lo que falta',
        compare: {
          headers: ['Situación actual', 'Comparar primero', 'Antes de comprar'],
          rows: [
            [
              'Cumple requisitos; solo fallan algunos juegos',
              'Comprobaciones gratuitas y soporte oficial',
              'Actualizaciones, ajustes y errores',
            ],
            [
              'Solo falta RAM o capacidad de almacenamiento',
              'Ampliar componentes compatibles',
              'Especificación, posibilidad de cambio, piezas y mano de obra',
            ],
            [
              'Faltan varios componentes, como CPU/GPU',
              'Coste total de ampliar frente a un premontado',
              'Incluir fuente, refrigeración, caja, sistema y migración',
            ],
          ],
        },
        sections: [
          {
            id: 'target',
            title:
              'Anota juntos juegos, resolución, FPS y presupuesto completo',
            paragraphs: [
              'Elige los juegos y un objetivo claro, por ejemplo 1920×1080, 60fps y calidad media. Es un ejemplo de cómo definir la meta, no una garantía para cualquier PC.',
              'Incluye pantalla, periféricos, instalación y migración necesarios. Reutiliza lo que sirva; si cambias el objetivo, pide presupuestos comparables con las nuevas condiciones.',
            ],
          },
          {
            id: 'compare-specs',
            title: 'Compara modelos exactos y algo más que capacidad',
            paragraphs: [
              'Anota modelo y generación exactos de CPU/GPU, no solo la familia. No equipares piezas de sobremesa y portátil por nombres parecidos; utiliza comparaciones verificables del mismo juego, resolución y ajustes.',
              'Tener igual VRAM no demuestra igual rendimiento de GPU. Revisa por separado RAM, tipo y espacio libre de almacenamiento, sistema compatible y requisitos específicos del juego. Cumplir Windows no equivale a cumplir el juego.',
            ],
          },
          {
            id: 'total-cost',
            title: 'Compara configuraciones compatibles y el importe completo',
            paragraphs: [
              'Cambiar GPU requiere comprobar potencia y conectores de la fuente, dimensiones de caja y refrigeración. Una CPU también depende de placa y firmware. Piezas propietarias y diseños de portátil pueden limitar el cambio.',
              'Suma piezas, componentes adicionales, mano de obra y migración y compara con un premontado para el mismo objetivo. Ampliar no siempre es más barato y la antigüedad por sí sola no decide. Conserva la configuración y las condiciones de garantía.',
            ],
            items: [
              'Comunica juegos, objetivo y modelo exacto al pedir presupuesto',
              'Incluye piezas adicionales, mano de obra, envío y migración',
              'Comprueba garantía, devoluciones, plazo y tratamiento de datos existentes',
            ],
          },
        ],
        setupTitle: 'Comprueba la misma carga después de comprar o cambiar',
        setup: [
          'Guarda copias independientes de partidas y archivos y consulta las instrucciones de migración. No borres el PC o disco anterior antes de verificar el nuevo entorno.',
          'Comprueba arranque y progreso con el mismo juego, resolución y calidad. Si no alcanzas el objetivo, contrasta configuración, ajustes e incidencias oficiales y comunica las condiciones al vendedor o fabricante.',
        ],
        faqs: [
          {
            question: '¿Basta el presupuesto para elegir un PC?',
            answer:
              'No. También importan juegos, resolución, FPS y calidad. Equipos del mismo precio pueden tener configuraciones distintas y el precio no garantiza un resultado.',
          },
          {
            question: '¿Puedo cambiar solo la GPU de un portátil?',
            answer:
              'No lo presupongas. Confírmalo en el manual del modelo o con el fabricante, sin aplicar directamente un procedimiento de sobremesa.',
          },
          {
            question: '¿Los requisitos recomendados garantizan fluidez?',
            answer:
              'Consulta las condiciones y el estado actual del juego. Incluye resolución, calidad y FPS si se indican y no inventes cifras ausentes. Este artículo no es una prueba propia de un PC concreto.',
          },
        ],
      },
    },
  },
];

export const pcUpgradeSlugs = entries.map((entry) => entry.slug);
export function pcUpgradeGuideBySlug(
  slug: string,
  locale: UpgradeLocale = 'ja',
): GearGuide | undefined {
  const entry = entries.find((item) => item.slug === slug);
  if (!entry) return undefined;
  const copy = entry.copy[locale];
  return {
    ...copy,
    slug,
    seoTitle: copy.title,
    checkedAt: '2026-11-15',
    sources: entry.sourceKeys.map((key) => ({
      title: sources[key].title[locale],
      url: sources[key].url,
    })),
    related: entry.related
      .map((relatedSlug) => ({
        href: `${locale === 'ja' ? '' : `/${locale}`}/gear/${relatedSlug}`,
        label: entries.find((item) => item.slug === relatedSlug)!.copy[locale]
          .shortTitle,
      }))
      .concat([
        {
          href: `${locale === 'ja' ? '' : `/${locale}`}/guide/low-fps`,
          label: {
            ja: '買う前に試す：低FPSの切り分け',
            en: 'Before buying: troubleshoot low FPS',
            zh: '购买前：排查低帧率',
            es: 'Antes de comprar: comprobar los FPS bajos',
          }[locale],
        },
        {
          href: `${locale === 'ja' ? '' : `/${locale}`}/guide/save-data-backup`,
          label: {
            ja: '作業前にセーブをバックアップする',
            en: 'Back up saves before making changes',
            zh: '操作前备份存档',
            es: 'Copiar partidas antes de hacer cambios',
          }[locale],
        },
      ]),
  };
}
export const pcUpgradeGuides = pcUpgradeSlugs.map((slug) =>
  pcUpgradeGuideBySlug(slug)!,
);
export const pcUpgradeGuidesEn = pcUpgradeSlugs.map((slug) =>
  pcUpgradeGuideBySlug(slug, 'en')!,
);
export const pcUpgradeGuidesZhEs = (['zh', 'es'] as const).flatMap((locale) =>
  pcUpgradeSlugs.map((slug) => ({
    locale,
    guide: pcUpgradeGuideBySlug(slug, locale)!,
  })),
);
export const upgradeAmazonSearches = (slug: string) =>
  entries.find((entry) => entry.slug === slug)?.amazonSearches ?? [];
