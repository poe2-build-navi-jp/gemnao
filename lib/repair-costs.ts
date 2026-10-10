/** Official Japanese service examples, checked 2026-10-10. Not averages or quotes. */
export type RepairCategory =
  | 'memory'
  | 'storage'
  | 'gpu'
  | 'cpu'
  | 'cooling'
  | 'power'
  | 'mainboard'
  | 'battery'
  | 'screen'
  | 'keyboard'
  | 'adapter'
  | 'network'
  | 'speaker'
  | 'optical'
  | 'os'
  | 'backup'
  | 'recovery'
  | 'other';
export type RepairCostExample = {
  id: string;
  category: RepairCategory;
  provider: string;
  label: string;
  price: string;
  basis: 'labor' | 'repair' | 'service' | 'example' | 'quote';
  conditions: string;
  source: string;
};
const kobo = (id: string) =>
  `https://www.pc-koubou.jp/products/detail.php?product_id=${id}`;
const nec =
  'https://support.nec-lavie.jp/navigate/support/repair/guide/expense/pc/index.html';
export const repairCostCheckedAt = '2026-10-10';
export const repairCostExamples: RepairCostExample[] = [
  {
    id: 'quick-diagnosis',
    category: 'other',
    provider: 'パソコン工房',
    label: 'ワンコイン簡易診断',
    price: '500円',
    basis: 'service',
    conditions:
      '任意の簡易診断メニュー。全故障の特定・分解・修理・部品交換込みではない。詳細な総合診断や修理は別途確認。全機種の必須初回費用とは扱わない。',
    source: 'https://www.pc-koubou.jp/faq/faq_detail.html?id=10569',
  },
  {
    id: 'ram-labor',
    category: 'memory',
    provider: 'パソコン工房',
    label: 'メモリ取付・交換',
    price: '3,500円',
    basis: 'labor',
    conditions: '部品代別。対応規格・空きスロット・最大容量を確認。',
    source: kobo('985076'),
  },
  {
    id: 'ssd-labor',
    category: 'storage',
    provider: 'パソコン工房',
    label: 'SSD・HDD取付・交換',
    price: '4,000円',
    basis: 'labor',
    conditions: '部品代・データ移行別。接続規格と取り付け場所を確認。',
    source: kobo('984992'),
  },
  {
    id: 'ssd-migration',
    category: 'storage',
    provider: 'ドスパラ',
    label: '500GB SATA SSDへの交換・移行例',
    price: '28,500円',
    basis: 'example',
    conditions:
      '工賃16,500円＋SSD12,000円の公式計算例（掲載基準2026年6月）。故障データ復旧は含まない。',
    source: 'https://www.dospara.co.jp/service/srv_ssd-upgrade-service.html',
  },
  {
    id: 'gpu-labor',
    category: 'gpu',
    provider: 'パソコン工房',
    label: 'グラフィックボード交換',
    price: '4,500円',
    basis: 'labor',
    conditions:
      'GPU部品代別。交換対応デスクトップ向け。電源・寸法・端子を確認。',
    source: kobo('985012'),
  },
  {
    id: 'gpu-dospara',
    category: 'gpu',
    provider: 'ドスパラ',
    label: 'グラフィックボード交換',
    price: '11,000円',
    basis: 'labor',
    conditions: 'GPU部品代別。ノートの直付けGPUには適用しない。',
    source: 'https://www.dospara.co.jp/service/srv_graphics_card.html',
  },
  {
    id: 'cpu-labor',
    category: 'cpu',
    provider: 'パソコン工房',
    label: 'CPU交換',
    price: '5,000円',
    basis: 'labor',
    conditions: 'CPU部品代別。デスクトップの対応ソケット・構成を確認。',
    source: kobo('980625'),
  },
  {
    id: 'fan-labor',
    category: 'cooling',
    provider: 'ドスパラ',
    label: 'CPU冷却ファン交換',
    price: '11,000円',
    basis: 'labor',
    conditions:
      'デスクトップ対象。部品代・清掃別。ノートファン・水冷・ケースファンへ一律適用しない。',
    source: 'https://www.dospara.co.jp/service/srv_silent_fan.html',
  },
  {
    id: 'cleaning',
    category: 'cooling',
    provider: 'ドスパラ',
    label: '内部クリーニング',
    price: '4,000 / 6,500 / 9,500円',
    basis: 'service',
    conditions:
      '基本／まんぞく／forゲームの作業料。消耗品別の場合あり。故障修理や発熱改善の保証ではない。',
    source: 'https://www.dospara.co.jp/service/srv-pc-upgrade.html',
  },
  {
    id: 'psu-labor',
    category: 'power',
    provider: 'パソコン工房',
    label: '電源ユニット交換',
    price: '8,000円',
    basis: 'labor',
    conditions:
      '部品代別。デスクトップ専用でメーカー製PC・ノート対象外。内部の分解は利用者に案内しない。',
    source: kobo('985081'),
  },
  {
    id: 'board-labor',
    category: 'mainboard',
    provider: 'パソコン工房',
    label: 'マザーボード交換',
    price: '10,000円',
    basis: 'labor',
    conditions:
      '部品代別。構成・OSライセンス・交換可否は要確認。故障部品を問診だけで確定しない。',
    source: kobo('985075'),
  },
  {
    id: 'nec-battery',
    category: 'battery',
    provider: 'NEC',
    label: 'バッテリー修理',
    price: '29,480〜32,780円',
    basis: 'repair',
    conditions: 'メーカー修理概算。膨張時は使用・充電を止め、自己交換しない。',
    source: nec,
  },
  {
    id: 'nec-psu',
    category: 'power',
    provider: 'NEC',
    label: '電源ユニット修理',
    price: '41,580〜44,880円',
    basis: 'repair',
    conditions: 'メーカー修理概算。工賃と部品の個別内訳は公表されていない。',
    source: nec,
  },
  {
    id: 'nec-ssd',
    category: 'storage',
    provider: 'NEC',
    label: 'SSD修理',
    price: '48,950円〜',
    basis: 'repair',
    conditions:
      'OSインストール込み。個別見積もり。データ移行・復旧込みとは扱わない。',
    source: nec,
  },
  {
    id: 'nec-hdd',
    category: 'storage',
    provider: 'NEC',
    label: 'HDD修理',
    price: '59,840〜63,140円',
    basis: 'repair',
    conditions: 'OSインストール込み。データ復旧は含まない。',
    source: nec,
  },
  {
    id: 'nec-ram',
    category: 'memory',
    provider: 'NEC',
    label: 'メモリ修理',
    price: '57,860〜61,160円',
    basis: 'repair',
    conditions: 'メーカー修理概算。メモリ部品の単品価格ではない。',
    source: nec,
  },
  {
    id: 'nec-board',
    category: 'mainboard',
    provider: 'NEC',
    label: 'メインボード修理',
    price: '61,160〜71,830円',
    basis: 'repair',
    conditions: 'CPUセット型を含む区分。機種や追加作業で別見積もり。',
    source: nec,
  },
  {
    id: 'nec-screen',
    category: 'screen',
    provider: 'NEC',
    label: '液晶修理（12〜16型未満／16〜19型未満）',
    price: '69,410〜72,710 / 90,860〜94,160円',
    basis: 'repair',
    conditions:
      '12型未満・19型以上・タッチ・IGZO・4K等は個別見積もり。外付けモニターとは別。',
    source: nec,
  },
  {
    id: 'nec-keyboard',
    category: 'keyboard',
    provider: 'NEC',
    label: 'ノートPCキーボード修理',
    price: '17,930〜21,230円',
    basis: 'repair',
    conditions:
      'タッチパッド等カバー一体ユニットは38,060円〜、一部は個別見積もり。外付けキーボードとは別。',
    source: nec,
  },
  {
    id: 'nec-adapter',
    category: 'adapter',
    provider: 'NEC',
    label: 'ACアダプター修理',
    price: '20,790〜24,090円',
    basis: 'repair',
    conditions:
      'メーカー修理料金。店頭のアダプター単品価格とは異なる。指定仕様の適合を確認。',
    source: nec,
  },
  {
    id: 'nec-network',
    category: 'network',
    provider: 'NEC',
    label: 'LAN・無線LANボード修理',
    price: '39,930〜43,230円',
    basis: 'repair',
    conditions:
      '接続不良だけではボード故障と断定しない。設定・回線との切り分けが必要。',
    source: nec,
  },
  {
    id: 'nec-speaker',
    category: 'speaker',
    provider: 'NEC',
    label: 'スピーカー修理',
    price: '27,720〜39,050円',
    basis: 'repair',
    conditions: '出力先・ミュートなどの設定確認後に相談。',
    source: nec,
  },
  {
    id: 'nec-optical',
    category: 'optical',
    provider: 'NEC',
    label: 'DVD／Blu-rayドライブ修理',
    price: '51,590〜54,890 / 70,400〜73,700円',
    basis: 'repair',
    conditions: '搭載機種と対応部品を確認。外付け製品の購入価格ではない。',
    source: nec,
  },
  {
    id: 'nec-os',
    category: 'os',
    provider: 'NEC',
    label: 'OS再セットアップ／調整で回復する作業',
    price: '18,810円',
    basis: 'service',
    conditions:
      '各作業の料金。部品交換は別見積もり。初期化前に必要データと回復キーの保全を確認。',
    source: nec,
  },
  {
    id: 'backup',
    category: 'backup',
    provider: 'ドスパラ',
    label: 'データ丸ごとバックアップ',
    price: '13,800円＋保存先媒体',
    basis: 'service',
    conditions:
      '同容量以上の媒体へのクローン。故障媒体・破損データは対象外になり得る。新PCのアプリ再設定やデータ復旧とは別。',
    source: 'https://www.dospara.co.jp/service/srv_all_bkup.html',
  },
  {
    id: 'recovery',
    category: 'recovery',
    provider: 'ドスパラ',
    label: 'HDD・SSDデータ復旧',
    price: '見積5,980円＋38,500 / 77,000 / 154,000円',
    basis: 'service',
    conditions:
      '見積料は復旧有無によらず発生。復旧は軽度／中度／重度の区分例で、問診では区分を判定しない。深刻な障害は個別見積もり。2TB超の納品媒体別、一部媒体の着手金あり。',
    source: 'https://www.dospara.co.jp/service/srv_datarescue.html',
  },
  {
    id: 'other-quote',
    category: 'other',
    provider: '各メーカー・修理窓口',
    label: '充電端子・ヒンジ・筐体・ノート直付け部品・水冷等',
    price: '個別見積もり',
    basis: 'quote',
    conditions:
      '機種・障害によって異なるため、一律料金の裏付けなし。0円ではない。',
    source: nec,
  },
];
