import { stepLabels } from '@/lib/private-diagnostic/steps';
import type { PrivateReport } from '@/lib/private-diagnostic/contract';
export function PrivateDiagnosticPreview({
  report,
  en = false,
}: {
  report: PrivateReport;
  en?: boolean;
}) {
  const a = report.observed.application,
    s = report.observed.system;
  const complete = a.status === 'complete';
  const labels: Record<string, [string, string]> = {
    general: ['ゲーム共通', 'General game'],
    wilds: ['ワイルズ', 'Wilds'],
    launch: ['起動しない', 'Launch problem'],
    crash: ['クラッシュ', 'Crash'],
    'black-screen': ['黒画面', 'Black screen'],
    freeze: ['フリーズ', 'Freeze'],
    'low-fps': ['低FPS', 'Low FPS'],
    stutter: ['カクつき', 'Stutter'],
    other: ['その他', 'Other'],
    'not-read': ['未取得', 'Not read'],
    complete: ['取得完了', 'Complete'],
    'access-denied': ['アクセス拒否', 'Access denied'],
    unavailable: ['取得不能', 'Unavailable'],
    'timed-out': ['時間切れ', 'Timed out'],
    partial: ['部分取得', 'Partial'],
    cancelled: ['中止', 'Cancelled'],
    unknown: ['不明', 'Unknown'],
    yes: ['はい', 'Yes'],
    no: ['いいえ', 'No'],
    'not-tested': ['未記録', 'Not recorded'],
    better: ['改善した', 'Better'],
    same: ['変わらない', 'Same'],
    worse: ['悪化した', 'Worse'],
    unsure: ['判断できない', 'Unsure'],
  };
  const label = (value: string) => labels[value]?.[en ? 1 : 0] ?? value;
  const observed = (value: boolean) =>
    value
      ? en
        ? 'record found'
        : '記録あり'
      : en
        ? 'no record in collected data (not proof of absence)'
        : '取得済みデータ内に記録なし（発生なしの証明ではありません）';
  return (
    <section className="space-y-3 rounded border p-4">
      <h2>{en ? 'Content to send privately' : '非公開で送る内容'}</h2>
      <p>
        {en ? 'Course / symptom' : 'コース／症状'}: {label(report.game)} /{' '}
        {label(report.symptom)} · v{report.tool_version}
      </p>
      <h3>{en ? 'Reported observations' : '送る観測値'}</h3>
      <p>
        {en
          ? 'These are reported tool outputs, not independently verified evidence.'
          : 'ツール出力として報告される値です。運営側の独立検証ではありません。'}
      </p>
      <p>
        {en ? 'Application log state' : 'Applicationログの取得状態'}:{' '}
        {label(a.status)} (
        {complete
          ? en
            ? 'collection complete'
            : '取得完了'
          : en
            ? 'incomplete; zero matches is not established'
            : '未完了。一致0件とは確定しません'}
        )
      </p>
      <p>
        {en ? 'Exact-path / name-only matches' : 'パス一致／名前のみ一致'}:{' '}
        {a.exact_matches} / {a.name_matches}
      </p>
      <p>
        {en
          ? 'Other targets / examined / unsupported / limit reached'
          : '別対象／調べた件数／非対応／上限到達'}
        : {a.other_target_records} / {a.examined} / {a.unsupported} /{' '}
        {a.limit_reached ? (en ? 'yes' : 'はい') : en ? 'no' : 'いいえ'}
      </p>
      <p>
        {en
          ? 'System log state / restart record / display recovery record'
          : 'Systemログ取得状態／再起動記録／画面復帰記録'}
        : {label(s.status)} / {observed(s.restart_record)} /{' '}
        {observed(s.display_record)}
      </p>
      <h3>
        {en
          ? 'Your answers (not verified observations)'
          : '本人回答（観測による確認とは別）'}
      </h3>
      <p>
        {en ? 'Whole-PC issue / trial outcome' : 'PC全体の異常／試した結果'}:{' '}
        {label(report.self_report.whole_pc_issue)} /{' '}
        {label(report.self_report.trial)}
      </p>
      <p>
        {en
          ? 'No cause, pending record, wrong EXE or resolution is established by these fields. No full diagnostic text or hardware details are sent.'
          : 'この内容だけで原因・反映待ち・EXEの選択誤り・解決を断定しません。診断全文やハードウェアの詳細は送りません。'}
      </p>
      <h3>
        {en
          ? 'Suggested next step (not a confirmed cause)'
          : '次の提案（確定した原因ではありません）'}
      </h3>
      <p>
        {report.next_step
          ? stepLabels[report.next_step][en ? 1 : 0]
          : en
            ? 'No next step included'
            : '次の提案は含まれていません'}
      </p>
      <details>
        <summary>{en ? 'Complete JSON' : 'JSON全文'}</summary>
        <pre className="whitespace-pre-wrap break-all">
          {JSON.stringify(report, null, 2)}
        </pre>
      </details>
    </section>
  );
}
