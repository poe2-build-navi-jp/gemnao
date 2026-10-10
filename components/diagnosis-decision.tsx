/* oxlint-disable next/no-html-link-for-pages -- Diagnostic routes use full-document navigation. */
import type { Answers, RepairDecision } from '@/lib/diagnosis/model';
import { RepairCostTable } from './repair-cost-table';
import { repairCostExamples, type RepairCategory } from '@/lib/repair-costs';

export function DiagnosisDecision({ decision, answers }: { decision: RepairDecision; answers?: Answers }) {
  const category = answers?.costCategory;
  const knownCategory = category && repairCostExamples.some((row) => row.category === category);
  return <section className="diag-decision" aria-labelledby="diag-decision-title">
    <p className="diag-kicker">修理・部品交換・買い替えの判断材料</p>
    <h3 id="diag-decision-title">{decision.title}</h3>
    <div className={decision.urgency === 'normal' ? 'diag-notice' : 'diag-warning'}>
      <strong>この判断の根拠</strong>
      <ul>{decision.evidence.map((line) => <li key={line}>{line}</li>)}</ul>
    </div>
    <h4>次にすること</h4>
    <ol>{decision.nextSteps.map((line) => <li key={line}>{line}</li>)}</ol>
    {decision.urgency === 'stop' && <p className="diag-small"><a href="https://support.hp.com/in-en/document/ish_4158581-4158704-16" target="_blank" rel="noreferrer noopener">HP公式：バッテリーの膨らみへの対応（英語）</a><br /><a href="https://download.lenovo.com/pccbbs/pubs/ideapad_slim5_14_16/ug/html_en/en/faq_drain_liquid.html" target="_blank" rel="noreferrer noopener">Lenovo公式：液体をこぼした時の電源停止（英語）</a></p>}
    {decision.urgency === 'backup' && <p className="diag-small"><a href="https://support.microsoft.com/ja-jp/windows/experience/storage-filemanagement/what-to-do-about-a-critical-warning-for-a-storage-device" target="_blank" rel="noreferrer noopener">Microsoft公式：ストレージの重大な警告への対応</a></p>}
    {decision.urgency === 'normal' && <>
      <details>
        <summary>修理・部品交換・買い替えを比べるための確認項目</summary>
        <ul>{decision.comparison.map((line) => <li key={line}>{line}</li>)}</ul>
      </details>
      {knownCategory ? <div className="diag-costs">
        <h4>選んだ作業の公式料金例</h4>
        <p>相談したい作業に対応する参考例です。故障部品や、あなたのPCに必要な交換を特定した結果ではありません。部品代を含むかを確認し、正式な見積もりで比べてください。</p>
        <RepairCostTable categories={[category as RepairCategory]} />
      </div> : <p className="diag-small">費用を絞って見たい場合は、回答に戻って「費用を確認したい作業」を選べます。分からない部品を選ぶ必要はありません。</p>}
    </>}
    <a href="/pc/repair-or-replace" className="diag-link">修理・パーツ交換の費用目安と、総額の比べ方 →</a>
    <p className="diag-small">この診断は正常・故障の証明ではありません。年数、低FPS、GPU使用率、「分からない」だけで買い替えを勧めません。</p>
  </section>;
}
