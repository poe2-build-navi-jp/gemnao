/* oxlint-disable next/no-html-link-for-pages -- Editorial source links. */
import {
  repairCostExamples,
  repairCostCheckedAt,
  type RepairCategory,
} from '@/lib/repair-costs';
import { localizedRepairCosts } from '@/lib/localized/repair-costs';

type Locale = 'ja' | 'en' | 'zh' | 'es';
const copy = {
  ja: {
    title: '部品交換・修理費用の公式掲載例（税込）',
    intro:
      '以下は平均価格やあなたのPCの見積額ではありません。2026年10月10日に確認した日本国内の公式料金例です。同じ部品でも機種・作業範囲が違うため、店や方式をまたいだ最安〜最高の相場にはしていません。',
    headings: ['作業・提供元', '掲載料金（税込）', '含む範囲・条件'],
    source: '公式料金・条件 ↗',
    basis: {
      labor: '工賃のみ',
      repair: 'メーカー修理概算',
      service: 'サービス料金',
      example: '構成指定の計算例',
      quote: '要見積もり',
    },
    kobo: 'パソコン工房：簡易診断500円は任意メニューで、詳細診断・修理は別です。その他のeチケットは工賃例。部品代は別。診断料込みの確認はありません。郵送利用の往復送料は別、他店購入部品には1点2,000円の持込料がかかる場合があります。対象機種・作業は注文前に確認してください。',
    nec: 'NEC：2026年7月31日付のメーカー修理概算表。対象はLAVIE・Mate・VersaPro等でN11・Tab・GIGA等は対象外。工賃／部品の個別内訳は非公表。追加部品・破損・水濡れ・複数箇所は別見積もり。指定の引取修理は集配無料、引取後の修理キャンセルは診断料6,600円（税込）。',
    dospara:
      'ドスパラ：宅配利用の送料は別。梱包お任せの場合は2,200円（税込）追加。通常の移行・バックアップと故障データ復旧は別作業です。買い替えても、元の故障媒体からの復旧費用は別途必要です。',
    caution:
      '候補は必須の交換部品ではありません。異臭・膨張・危険な発熱・液体侵入や水濡れ直後は使用中止、重大なストレージ警告は安全にできる範囲のバックアップ・専門相談を先に。見積もりでは診断・部品・工賃・送料・移行・キャンセル料を分け、合計と追加作業の事前承諾を確認してください。',
    policy: '料金の共通条件',
    checked: '公式料金の確認日',
    japanese: '',
  },
  en: {
    title:
      'Official repair and parts-replacement price examples (tax included)',
    intro:
      'These are published Japanese service examples checked on 10 October 2026, not averages or quotes for your PC. Models and service scope differ; prices from different providers are not combined into a market price range.',
    headings: [
      'Service / provider',
      'Published price (JPY, tax included)',
      'Scope and conditions',
    ],
    source: 'Official prices and terms ↗',
    basis: {
      labor: 'Labor only',
      repair: 'Manufacturer repair estimate',
      service: 'Service fee',
      example: 'Specified configuration example',
      quote: 'Individual quote',
    },
    kobo: 'PC Koubou: the JPY 500 basic diagnostic menu is optional; detailed diagnosis and repairs are separate. Other e-ticket examples are labor only; parts are extra. Inclusion of a diagnostic fee is unconfirmed. Mail-in return shipping is extra; a JPY 2,000 fee per part bought elsewhere may apply. Confirm eligible models and work before ordering.',
    nec: 'NEC: manufacturer repair estimates dated 31 July 2026 for eligible LAVIE, Mate, VersaPro and similar models; N11, Tab and GIGA models are excluded. Parts/labor breakdowns are not published. Additional parts, damage, liquid exposure or multiple faults require separate quotes. Designated collection service includes shipping; cancellation after collection costs JPY 6,600 in diagnostic fees, tax included.',
    dospara:
      'Dospara: mail-in shipping is extra; optional packing service adds JPY 2,200 including tax. Ordinary migration/backup and recovery from damaged media are different services. Replacing the PC does not eliminate separate recovery costs for the original damaged drive.',
    caution:
      'Candidates are not confirmed failed parts or mandatory purchases. Stop use and charging if liquid has entered the PC, it was recently wet, or there is an unusual smell, swelling or dangerous heat; contact the manufacturer. Prioritize safe backup/professional advice for a critical storage warning. Request separate diagnostic, parts, labor, shipping, migration and cancellation charges, a total, and approval before extra work.',
    policy: 'Shared pricing conditions',
    checked: 'Prices checked',
    japanese: ' (Japanese)',
  },
  zh: {
    title: '零部件更换与维修的官方报价示例（含税）',
    intro:
      '以下为2026年10月10日核实的日本境内官方服务价格示例，不是平均价格，也不是您的电脑报价。机型和服务范围不同，不将不同商家的金额拼成市场价格区间。',
    headings: ['服务与提供商', '公开价格（日元，含税）', '范围与条件'],
    source: '官方价格与条款 ↗',
    basis: {
      labor: '仅人工费',
      repair: '厂商维修概算',
      service: '服务费用',
      example: '指定配置计算示例',
      quote: '单独报价',
    },
    kobo: 'PC Koubou：500日元简易诊断为可选服务，详细诊断与维修另计。其他电子服务券为人工费示例，零部件另计。未确认是否包含诊断费。邮寄往返运费另计；其他商家购买的零件可能每件加收2,000日元。下单前确认适用机型与服务。',
    nec: 'NEC：2026年7月31日的厂商维修概算表，适用LAVIE、Mate、VersaPro等机型，不适用N11、Tab、GIGA等。人工与部件费用未分别公开。追加部件、破损、进液或多处故障须另行报价。指定取送维修免运费；取件后取消维修收取含税6,600日元诊断费。',
    dospara:
      'Dospara：邮寄运费另计，委托包装另加含税2,200日元。普通迁移与备份不同于损坏介质的数据恢复。即使更换电脑，原故障硬盘的数据恢复费仍另计。',
    caution:
      '候选项目不代表已经确定故障，也不是必须购买的部件。有液体进入电脑、电脑近期曾被弄湿，或有异味、鼓包或危险发热时，停止使用和充电并联系厂商；严重存储警告时优先安全备份并咨询专业人员。报价中应分别列出诊断、部件、人工、运费、迁移和取消费用，确认总额及追加作业须事先同意。',
    policy: '共同价格条件',
    checked: '价格核实日期',
    japanese: '（日语）',
  },
  es: {
    title:
      'Ejemplos oficiales de reparación y cambio de piezas (impuestos incluidos)',
    intro:
      'Son precios publicados de servicios en Japón, verificados el 10 de octubre de 2026; no son promedios ni presupuestos para tu PC. Los modelos y trabajos difieren, por lo que no se combinan precios de proveedores distintos en un rango de mercado.',
    headings: [
      'Servicio / proveedor',
      'Precio publicado (JPY, impuestos incluidos)',
      'Alcance y condiciones',
    ],
    source: 'Precios y condiciones oficiales ↗',
    basis: {
      labor: 'Solo mano de obra',
      repair: 'Estimación de reparación del fabricante',
      service: 'Tarifa del servicio',
      example: 'Ejemplo con configuración concreta',
      quote: 'Presupuesto individual',
    },
    kobo: 'PC Koubou: el diagnóstico básico de 500 JPY es opcional; diagnóstico detallado y reparaciones aparte. Los otros cupones electrónicos son ejemplos de mano de obra; piezas aparte. No se ha confirmado que incluyan el diagnóstico. Envíos de ida y vuelta aparte; puede aplicarse un cargo de 2.000 JPY por pieza comprada en otra tienda. Confirma modelos y trabajos admitidos antes de pedirlos.',
    nec: 'NEC: estimaciones del fabricante del 31 de julio de 2026 para modelos LAVIE, Mate, VersaPro y similares; excluye N11, Tab y GIGA. No se publica el desglose entre piezas y mano de obra. Piezas adicionales, daños, líquidos o varias averías requieren otro presupuesto. La recogida designada incluye transporte; cancelar tras la recogida cuesta 6.600 JPY de diagnóstico, impuestos incluidos.',
    dospara:
      'Dospara: envío aparte; el embalaje opcional añade 2.200 JPY con impuestos. La migración o copia ordinaria y la recuperación de soportes dañados son servicios distintos. Cambiar el PC no elimina el coste separado de recuperar los datos del disco averiado.',
    caution:
      'Los candidatos no son piezas averiadas confirmadas ni compras obligatorias. Deja de usar y cargar el equipo si ha entrado líquido, se ha mojado recientemente, o hay olor, hinchazón o calor peligroso; contacta con el fabricante. Ante una alerta crítica de almacenamiento, prioriza una copia segura y la consulta profesional. Solicita diagnóstico, piezas, mano de obra, envío, migración y cancelación por separado, el total y autorización previa para trabajos adicionales.',
    policy: 'Condiciones comunes de los precios',
    checked: 'Precios verificados',
    japanese: ' (en japonés)',
  },
};
export function RepairCostTable({
  categories,
  locale = 'ja',
}: {
  categories?: RepairCategory[];
  locale?: Locale;
}) {
  const t = copy[locale];
  const rows = categories
    ? repairCostExamples.filter((row) => categories.includes(row.category))
    : repairCostExamples;
  if (!rows.length) return null;
  return (
    <section
      className="guide-section repair-costs"
      id="repair-costs"
      aria-labelledby="repair-costs-title"
    >
      <h2 id="repair-costs-title">{t.title}</h2>
      <p>{t.intro}</p>
      <p>
        {t.checked}: {repairCostCheckedAt}
      </p>
      <div className="diagnosis-table">
        <table>
          <thead>
            <tr>
              {t.headings.map((h) => (
                <th scope="col" key={h}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const translated =
                locale === 'ja' ? row : localizedRepairCosts[locale][row.id];
              return (
                <tr key={row.id}>
                  <td data-label={t.headings[0]}>
                    <strong>{translated.label}</strong>
                    <br />
                    {translated.provider}
                  </td>
                  <td data-label={t.headings[1]}>
                    <strong>
                      {locale === 'ja'
                        ? row.price
                        : row.basis === 'quote'
                          ? t.basis.quote
                          : row.price
                              .replaceAll('円', ' JPY')
                              .replace('見積', '')
                              .replace(
                                '＋保存先媒体',
                                {
                                  en: ' + destination media',
                                  zh: ' + 目标存储介质',
                                  es: ' + soporte de destino',
                                }[locale],
                              )
                              .replaceAll('〜', '–')}
                    </strong>
                    <br />
                    {t.basis[row.basis]}
                  </td>
                  <td data-label={t.headings[2]}>
                    {translated.conditions}
                    <br />
                    <a
                      href={row.source}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {t.source}
                      {t.japanese}
                    </a>
                    {row.id === 'quick-diagnosis' && (
                      <>
                        <br />
                        <a
                          href="https://www.pc-koubou.jp/contents/iiyamapc_support.php?pre=sgi_sup"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {
                            {
                              ja: '税込料金の明記',
                              en: 'Tax-inclusive price confirmation',
                              zh: '含税价格说明',
                              es: 'Confirmación del precio con impuestos',
                            }[locale]
                          }
                          {t.japanese}
                        </a>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <details>
        <summary>{t.policy}</summary>
        <p>
          {t.kobo}{' '}
          <a
            href="https://www.pc-koubou.jp/faq/faq_detail.html?category=&id=10522&page=1"
            target="_blank"
            rel="noreferrer noopener"
          >
            FAQ{t.japanese}
          </a>
        </p>
        <p>
          {t.nec}{' '}
          <a
            href="https://support.nec-lavie.jp/navigate/support/repair/guide/check/index.html"
            target="_blank"
            rel="noreferrer noopener"
          >
            NEC{t.japanese}
          </a>
        </p>
        <p>{t.dospara}</p>
      </details>
      <p className="source-policy">{t.caution}</p>
    </section>
  );
}
