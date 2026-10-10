import type { Locale } from '@/lib/i18n';

type CostCopy = { label: string; conditions: string; provider: string };
const kobo = 'PC Koubou';
const dospara = 'Dospara';
const nec = 'NEC';

// Text only. Prices, categories, source URLs and dates remain in repair-costs.ts.
export const localizedRepairCosts: Record<Locale, Record<string, CostCopy>> = {
  en: {
    'quick-diagnosis': {
      provider: kobo,
      label: 'One-coin basic diagnostic service',
      conditions:
        'An optional basic check, not comprehensive fault identification, disassembly, repair or replacement. Confirm detailed diagnostic and repair charges separately. Not a mandatory initial charge for every model.',
    },
    'ram-labor': {
      provider: kobo,
      label: 'RAM installation or replacement',
      conditions:
        'Parts not included. Check the memory standard, free slots and maximum capacity.',
    },
    'ssd-labor': {
      provider: kobo,
      label: 'SSD or HDD installation or replacement',
      conditions:
        'Parts and data migration not included. Check the interface and mounting location.',
    },
    'ssd-migration': {
      provider: dospara,
      label: 'Example: replacement with a 500GB SATA SSD and migration',
      conditions:
        'Official example: JPY 16,500 labor + JPY 12,000 SSD (published price basis: June 2026). Does not include recovery from failed storage.',
    },
    'gpu-labor': {
      provider: kobo,
      label: 'Graphics card replacement',
      conditions:
        'GPU not included. For desktops that support replacement. Check power, dimensions and connectors.',
    },
    'gpu-dospara': {
      provider: dospara,
      label: 'Graphics card replacement',
      conditions: 'GPU not included. Does not apply to soldered laptop GPUs.',
    },
    'cpu-labor': {
      provider: kobo,
      label: 'CPU replacement',
      conditions:
        'CPU not included. Check the desktop socket and configuration compatibility.',
    },
    'fan-labor': {
      provider: dospara,
      label: 'CPU cooling fan replacement',
      conditions:
        'For desktops. Parts and cleaning not included. Do not apply this price to all laptop fans, liquid coolers or case fans.',
    },
    cleaning: {
      provider: dospara,
      label: 'Internal cleaning',
      conditions:
        'Service fees for the Basic / Manzoku / for Game plans. Consumables may cost extra. Not a fault repair or a guarantee of lower temperatures.',
    },
    'psu-labor': {
      provider: kobo,
      label: 'Power supply unit replacement',
      conditions:
        'Parts not included. Desktop-only; excludes manufacturer-brand PCs and laptops. Do not open the power supply yourself.',
    },
    'board-labor': {
      provider: kobo,
      label: 'Motherboard replacement',
      conditions:
        'Parts not included. Confirm the configuration, OS license and whether replacement is supported. A questionnaire cannot establish which component has failed.',
    },
    'nec-battery': {
      provider: nec,
      label: 'Battery repair',
      conditions:
        'Manufacturer repair estimate. If the battery is swollen, stop use and charging; do not replace it yourself.',
    },
    'nec-psu': {
      provider: nec,
      label: 'Power supply repair',
      conditions:
        'Manufacturer repair estimate. Separate parts and labor amounts are not published.',
    },
    'nec-ssd': {
      provider: nec,
      label: 'SSD repair',
      conditions:
        'Includes OS installation. Individual quote required. Do not assume data migration or recovery is included.',
    },
    'nec-hdd': {
      provider: nec,
      label: 'HDD repair',
      conditions: 'Includes OS installation. Data recovery not included.',
    },
    'nec-ram': {
      provider: nec,
      label: 'Memory repair',
      conditions:
        'Manufacturer repair estimate, not the standalone price of a RAM module.',
    },
    'nec-board': {
      provider: nec,
      label: 'Mainboard repair',
      conditions:
        'Category includes boards with a CPU assembly. The model and extra work may require a separate quote.',
    },
    'nec-screen': {
      provider: nec,
      label: 'LCD repair: 12–under 16 inches / 16–under 19 inches',
      conditions:
        'Under 12 inches, 19 inches or larger, touch, IGZO, 4K and other variants require individual quotes. Not an external monitor repair price.',
    },
    'nec-keyboard': {
      provider: nec,
      label: 'Laptop keyboard repair',
      conditions:
        'An integrated cover assembly with a touchpad or similar parts starts at JPY 38,060; some need individual quotes. Not for an external keyboard.',
    },
    'nec-adapter': {
      provider: nec,
      label: 'AC adapter repair',
      conditions:
        'Manufacturer service price, not the retail price of a standalone adapter. Confirm the specified compatibility.',
    },
    'nec-network': {
      provider: nec,
      label: 'LAN or wireless LAN board repair',
      conditions:
        'A connection failure alone does not establish a board fault. Rule out settings and connection-service problems.',
    },
    'nec-speaker': {
      provider: nec,
      label: 'Speaker repair',
      conditions:
        'Check the selected audio output and mute settings before requesting repair.',
    },
    'nec-optical': {
      provider: nec,
      label: 'DVD / Blu-ray drive repair',
      conditions:
        'Check the model and available compatible parts. Not the purchase price of an external drive.',
    },
    'nec-os': {
      provider: nec,
      label: 'OS reinstallation or adjustment that restores operation',
      conditions:
        'Price for each service. Component replacement is quoted separately. Preserve necessary data and recovery keys before resetting.',
    },
    backup: {
      provider: dospara,
      label: 'Full-drive data backup',
      conditions:
        'Cloning to storage of equal or greater capacity. Failed media or damaged data may be excluded. Separate from setting up apps on a new PC or recovering data.',
    },
    recovery: {
      provider: dospara,
      label: 'HDD or SSD data recovery',
      conditions:
        'The assessment fee applies whether or not recovery succeeds. Recovery prices are examples for minor / moderate / severe cases; a questionnaire cannot determine the category. Serious faults require individual quotes. Delivery media above 2TB costs extra, and some media require an initial work fee.',
    },
    'other-quote': {
      provider: 'Manufacturer or repair provider',
      label:
        'Charging port, hinges, case, soldered laptop parts, liquid cooling and more',
      conditions:
        'Depends on the model and fault; no verified universal fee. This does not mean free.',
    },
  },
  zh: {
    'quick-diagnosis': {
      provider: kobo,
      label: '简易诊断服务',
      conditions:
        '可选的简易检查，不包含确定所有故障、拆机、维修或更换零件。详细综合诊断和维修费用须另行确认，并非所有机型都必须支付的首次费用。',
    },
    'ram-labor': {
      provider: kobo,
      label: '内存安装或更换',
      conditions: '不含配件。确认内存规格、空闲插槽和最大支持容量。',
    },
    'ssd-labor': {
      provider: kobo,
      label: 'SSD 或 HDD 安装、更换',
      conditions: '不含配件和数据迁移。确认连接接口和安装位置。',
    },
    'ssd-migration': {
      provider: dospara,
      label: '更换为 500GB SATA SSD 并迁移的示例',
      conditions:
        '官方计算示例：工时费 16,500 日元＋SSD 12,000 日元（公布价格基准：2026 年 6 月）。不含故障数据恢复。',
    },
    'gpu-labor': {
      provider: kobo,
      label: '显卡更换',
      conditions: '不含显卡。适用于支持更换的台式机；确认电源、尺寸和接口。',
    },
    'gpu-dospara': {
      provider: dospara,
      label: '显卡更换',
      conditions: '不含显卡，不适用于笔记本板载焊接 GPU。',
    },
    'cpu-labor': {
      provider: kobo,
      label: 'CPU 更换',
      conditions: '不含 CPU。确认台式机插槽和配置兼容性。',
    },
    'fan-labor': {
      provider: dospara,
      label: 'CPU 散热风扇更换',
      conditions:
        '适用于台式机，不含配件和清洁。不能把此价格统一套用于笔记本风扇、水冷或机箱风扇。',
    },
    cleaning: {
      provider: dospara,
      label: '内部清洁',
      conditions:
        'Basic／Manzoku／for Game 套餐的作业费，耗材可能另收费。不等于故障维修，也不保证改善温度。',
    },
    'psu-labor': {
      provider: kobo,
      label: '电源装置更换',
      conditions:
        '不含配件，仅适用于台式机，品牌整机和笔记本不在范围内。不要自行拆开电源装置。',
    },
    'board-labor': {
      provider: kobo,
      label: '主板更换',
      conditions:
        '不含配件，需确认配置、系统许可和能否更换。不能只凭问诊确定损坏配件。',
    },
    'nec-battery': {
      provider: nec,
      label: '电池维修',
      conditions: '厂商维修概算。电池鼓包时停止使用和充电，不要自行更换。',
    },
    'nec-psu': {
      provider: nec,
      label: '电源装置维修',
      conditions: '厂商维修概算，未单独公布配件与工时明细。',
    },
    'nec-ssd': {
      provider: nec,
      label: 'SSD 维修',
      conditions: '含系统安装，需单独报价。不能视为包含数据迁移或恢复。',
    },
    'nec-hdd': {
      provider: nec,
      label: 'HDD 维修',
      conditions: '含系统安装，不含数据恢复。',
    },
    'nec-ram': {
      provider: nec,
      label: '内存维修',
      conditions: '厂商维修概算，不是单条内存的零售价格。',
    },
    'nec-board': {
      provider: nec,
      label: '主板维修',
      conditions:
        '此分类包含 CPU 组合型主板。具体机型和追加作业可能需另行报价。',
    },
    'nec-screen': {
      provider: nec,
      label: '液晶屏维修：12 至不足 16 英寸／16 至不足 19 英寸',
      conditions:
        '不足 12 英寸、19 英寸及以上、触摸屏、IGZO、4K 等需单独报价。与外接显示器不同。',
    },
    'nec-keyboard': {
      provider: nec,
      label: '笔记本键盘维修',
      conditions:
        '含触摸板等的外壳一体组件从 38,060 日元起，部分需单独报价。与外接键盘不同。',
    },
    'nec-adapter': {
      provider: nec,
      label: '电源适配器维修',
      conditions:
        '厂商维修服务价格，不是零售适配器单品价格。确认指定规格是否适配。',
    },
    'nec-network': {
      provider: nec,
      label: '有线或无线网卡维修',
      conditions:
        '连接失败本身不能证明网卡损坏，需要与设置及网络线路问题区分。',
    },
    'nec-speaker': {
      provider: nec,
      label: '扬声器维修',
      conditions: '先检查输出设备和静音等设置，再咨询维修。',
    },
    'nec-optical': {
      provider: nec,
      label: 'DVD／Blu-ray 光驱维修',
      conditions: '确认机型和兼容配件。这不是外接光驱的购买价格。',
    },
    'nec-os': {
      provider: nec,
      label: '通过系统重装或调整恢复运行的服务',
      conditions:
        '每项作业的价格。配件更换另行报价；重置前先保全必要数据和恢复密钥。',
    },
    backup: {
      provider: dospara,
      label: '整盘数据备份',
      conditions:
        '克隆到容量相同或更大的介质。故障介质或损坏数据可能不适用。与新电脑的应用设置、数据恢复是不同服务。',
    },
    recovery: {
      provider: dospara,
      label: 'HDD 或 SSD 数据恢复',
      conditions:
        '无论是否恢复均收评估费。恢复费为轻度／中度／重度分类示例，不能靠问诊确定分类。严重故障需单独报价；超过 2TB 的交付介质另收费，部分介质有起始作业费。',
    },
    'other-quote': {
      provider: '厂商或维修服务方',
      label: '充电接口、转轴、机壳、笔记本焊接配件、水冷等',
      conditions: '因机型和故障而异，没有已核实的统一价格；不代表免费。',
    },
  },
  es: {
    'quick-diagnosis': {
      provider: kobo,
      label: 'Servicio de diagnóstico básico',
      conditions:
        'Revisión básica opcional; no incluye identificar todas las averías, desmontar, reparar ni cambiar piezas. Confirma por separado el diagnóstico detallado y las reparaciones. No es una tarifa inicial obligatoria para todos los modelos.',
    },
    'ram-labor': {
      provider: kobo,
      label: 'Instalación o sustitución de RAM',
      conditions:
        'Piezas no incluidas. Revisa el tipo de memoria, las ranuras libres y la capacidad máxima.',
    },
    'ssd-labor': {
      provider: kobo,
      label: 'Instalación o sustitución de SSD o HDD',
      conditions:
        'Piezas y migración no incluidas. Comprueba la interfaz y el lugar de montaje.',
    },
    'ssd-migration': {
      provider: dospara,
      label: 'Ejemplo: cambio a SSD SATA de 500GB con migración',
      conditions:
        'Ejemplo oficial: 16.500 JPY de mano de obra + 12.000 JPY de SSD (precios publicados con referencia a junio de 2026). No incluye recuperar datos de una unidad averiada.',
    },
    'gpu-labor': {
      provider: kobo,
      label: 'Sustitución de tarjeta gráfica',
      conditions:
        'GPU no incluida. Para sobremesas que admiten el cambio. Revisa alimentación, dimensiones y conectores.',
    },
    'gpu-dospara': {
      provider: dospara,
      label: 'Sustitución de tarjeta gráfica',
      conditions: 'GPU no incluida. No se aplica a GPU soldadas de portátiles.',
    },
    'cpu-labor': {
      provider: kobo,
      label: 'Sustitución de CPU',
      conditions:
        'CPU no incluida. Revisa el zócalo y la configuración compatible del sobremesa.',
    },
    'fan-labor': {
      provider: dospara,
      label: 'Sustitución del ventilador de CPU',
      conditions:
        'Para sobremesas. Piezas y limpieza no incluidas. No extrapoles el precio a ventiladores de portátil, refrigeración líquida o ventiladores de caja.',
    },
    cleaning: {
      provider: dospara,
      label: 'Limpieza interna',
      conditions:
        'Tarifas de los planes Basic / Manzoku / for Game. Los consumibles pueden cobrarse aparte. No es una reparación ni garantiza reducir temperaturas.',
    },
    'psu-labor': {
      provider: kobo,
      label: 'Sustitución de fuente de alimentación',
      conditions:
        'Piezas no incluidas. Solo sobremesas; excluye PC de marcas fabricantes y portátiles. No abras la fuente tú mismo.',
    },
    'board-labor': {
      provider: kobo,
      label: 'Sustitución de placa base',
      conditions:
        'Piezas no incluidas. Confirma configuración, licencia del sistema y viabilidad del cambio. Un cuestionario no determina qué pieza está averiada.',
    },
    'nec-battery': {
      provider: nec,
      label: 'Reparación de batería',
      conditions:
        'Estimación de reparación del fabricante. Si está hinchada, deja de usarla y cargarla; no la sustituyas tú mismo.',
    },
    'nec-psu': {
      provider: nec,
      label: 'Reparación de fuente de alimentación',
      conditions:
        'Estimación del fabricante. No publica por separado los importes de piezas y mano de obra.',
    },
    'nec-ssd': {
      provider: nec,
      label: 'Reparación de SSD',
      conditions:
        'Incluye instalar el sistema operativo. Requiere presupuesto individual. No presupongas que incluye migración o recuperación de datos.',
    },
    'nec-hdd': {
      provider: nec,
      label: 'Reparación de HDD',
      conditions:
        'Incluye instalar el sistema operativo. No incluye recuperación de datos.',
    },
    'nec-ram': {
      provider: nec,
      label: 'Reparación de memoria',
      conditions:
        'Estimación de reparación del fabricante, no el precio de un módulo de RAM suelto.',
    },
    'nec-board': {
      provider: nec,
      label: 'Reparación de placa base',
      conditions:
        'La categoría incluye conjuntos con CPU. El modelo y los trabajos extra pueden requerir otro presupuesto.',
    },
    'nec-screen': {
      provider: nec,
      label:
        'Reparación de LCD: de 12 a menos de 16 / de 16 a menos de 19 pulgadas',
      conditions:
        'Menos de 12 pulgadas, 19 o más, táctil, IGZO, 4K y otras variantes requieren presupuesto individual. No es una tarifa para monitores externos.',
    },
    'nec-keyboard': {
      provider: nec,
      label: 'Reparación de teclado de portátil',
      conditions:
        'Los conjuntos de cubierta con panel táctil u otras piezas parten de 38.060 JPY; algunos requieren presupuesto individual. No es para teclados externos.',
    },
    'nec-adapter': {
      provider: nec,
      label: 'Reparación de adaptador de corriente',
      conditions:
        'Tarifa de servicio del fabricante, distinta del precio de un adaptador suelto en una tienda. Confirma la compatibilidad con las especificaciones indicadas.',
    },
    'nec-network': {
      provider: nec,
      label: 'Reparación de tarjeta LAN o Wi-Fi',
      conditions:
        'Un fallo de conexión no demuestra una avería de la tarjeta. Hay que distinguirlo de ajustes o problemas de la conexión.',
    },
    'nec-speaker': {
      provider: nec,
      label: 'Reparación de altavoces',
      conditions:
        'Comprueba antes la salida de audio seleccionada y el silencio.',
    },
    'nec-optical': {
      provider: nec,
      label: 'Reparación de unidad DVD / Blu-ray',
      conditions:
        'Confirma el modelo y las piezas compatibles. No es el precio de compra de una unidad externa.',
    },
    'nec-os': {
      provider: nec,
      label:
        'Reinstalación del sistema o ajustes que restauran el funcionamiento',
      conditions:
        'Precio de cada servicio. Las piezas se presupuestan aparte. Conserva los datos necesarios y las claves de recuperación antes de restablecer.',
    },
    backup: {
      provider: dospara,
      label: 'Copia de seguridad de la unidad completa',
      conditions:
        'Clonación a un soporte de igual o mayor capacidad. Puede excluir soportes averiados o datos dañados. Es distinto de configurar aplicaciones en un PC nuevo o recuperar datos.',
    },
    recovery: {
      provider: dospara,
      label: 'Recuperación de datos de HDD o SSD',
      conditions:
        'La evaluación se cobra aunque no se recuperen los datos. Los precios son ejemplos de casos leves / moderados / graves; un cuestionario no determina la categoría. Los fallos serios requieren presupuesto individual. El soporte de entrega de más de 2TB se cobra aparte, y algunos soportes tienen un cargo inicial de trabajo.',
    },
    'other-quote': {
      provider: 'Fabricante o servicio de reparación',
      label:
        'Puerto de carga, bisagras, carcasa, piezas soldadas de portátil, refrigeración líquida y más',
      conditions:
        'Depende del modelo y la avería; no hay una tarifa universal verificada. No significa que sea gratis.',
    },
  },
};
