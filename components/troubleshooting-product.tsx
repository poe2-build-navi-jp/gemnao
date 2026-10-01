import { amazonUrl } from '@/lib/gear-articles';

// Show one optional product only in the relevant diagnostic step of these articles.
const products: Record<
  string,
  {
    step: number;
    heading: string;
    name: string;
    asin: string;
    when: string;
    caution: string;
    source: string;
  }
> = {
  '/discord/bluetooth-audio-problem': {
    step: 2,
    heading: '内蔵マイクがない・声を拾いにくい場合の選択肢',
    name: 'サンワダイレクト 400-MC017（USB-A接続のクリップ式マイク）',
    asin: 'B08H6X6G28',
    when: 'まずPC内蔵マイクや手持ちの別マイクをDiscordの入力に選んで比較してください。それで通話とゲーム音に問題がなければ購入不要です。内蔵マイクがない、または声を拾いにくく別の入力が必要な場合は、USB-A接続のクリップ式マイクが候補になります。',
    caution:
      '400-MC017は全指向性なので周囲の音も拾います。PCのUSB-A端子と約2mのケーブルで届くかを確認し、接続後はDiscordの入力をこのマイク、出力をBluetoothイヤホンに設定して比較します。すべての環境で音質が改善する保証はありません。',
    source: 'https://direct.sanwa.co.jp/ItemPage/400-MC017',
  },
  '/guide/save-data-backup': {
    step: 2,
    heading: '別の保存先を持っていない場合の選択肢',
    name: 'エレコム MF-TPC3032GBK（32GB・USB-A／USB-C両対応USBメモリ）',
    asin: 'B0CQYF95V6',
    when: '十分な空き容量のある手持ちのUSBメモリや外付けSSDがあれば購入不要です。別の保存先がなく、小容量のセーブデータを複製したい場合には、USB-A／USB-C両対応の32GB USBメモリが候補になります。',
    caution:
      '保存対象と日付別に残す世代分の合計容量、PCの端子を先に確認してください。ゲーム本体や大量のMODの保存には容量が足りない場合があります。元データは消さず「コピー」し、次のSTEPで一致を確認します。このUSBメモリだけを唯一の保存先にしないでください。',
    source: 'https://www.elecom.co.jp/products/MF-TPC3032GBK.html',
  },
  '/pc/usb-c-device-not-recognized': {
    step: 1,
    heading: 'ケーブルだけ替えると認識した場合の交換候補',
    name: 'エレコム MPA-CC1G05BK（USB-C同士・0.5m・最大10Gbps）',
    asin: 'B0CVQM2TWH',
    when: 'まず付属ケーブルや手持ちの対応ケーブルで切り分けてください。同じ機器・同じポートでケーブルだけ替えると認識した場合に、元のケーブルの交換を検討します。使える予備ケーブルがあれば購入不要です。PCと機器の両側がUSB-Cで、交換が必要な場合にはこの製品が候補になります。',
    caution:
      '0.5mで届くか、両端の端子と機器が必要とする規格を確認してください。最大10Gbpsは接続機器・ポートも対応する場合の規格値です。映像出力にはPC・接続機器側のDisplayPort Alt Mode対応も必要で、このケーブルを買うだけでは非対応ポートで映像は出ません。ケーブル以外の故障や設定の問題を解決する保証はありません。',
    source: 'https://www.elecom.co.jp/products/MPA-CC1G05BK.html',
  },
};

export function TroubleshootingProduct({
  articlePath,
  step,
}: {
  articlePath: string;
  step: number;
}) {
  const product = products[articlePath];
  if (!product || product.step !== step) return null;

  return (
    <aside
      className="affiliate-box"
      aria-label="広告・必要な場合だけ検討する製品"
    >
      <span className="affiliate-label">PR・広告</span>
      <strong>{product.heading}</strong>
      <p>{product.when}</p>
      <p>{product.name}</p>
      <p>{product.caution}</p>
      <p>
        仕様の確認：{' '}
        <a href={product.source} target="_blank" rel="noopener noreferrer">
          メーカー公式情報
        </a>
        。実機での動作検証に基づく紹介ではありません。
      </p>
      <p>
        <a
          href={amazonUrl(product.asin)}
          target="_blank"
          rel="sponsored nofollow noopener"
        >
          Amazonで製品の詳細を確認する
        </a>
      </p>
      <small>
        Amazonのアソシエイトとして、ゲムなおは適格販売により収入を得ています。
      </small>
    </aside>
  );
}
