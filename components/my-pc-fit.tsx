'use client';

/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { checkFit, gpuById, type MinSpec } from '@/lib/my-pc';
import { useMyPc } from '@/components/use-my-pc';

const mark = { ok: '○', maybe: '△', no: '×' } as const;
const label = {
  ok: '動く目安',
  maybe: '性能が足りない可能性',
  no: '最低環境に届かない',
} as const;

/** "あなたのPCで：○ 動く目安" for one game. Renders nothing on the server. */
export function MyPcFit({ spec }: { spec?: MinSpec }) {
  const [pc, , ready] = useMyPc();
  if (!ready) return null;
  if (!pc)
    return (
      <a className="my-pc-fit my-pc-fit-empty" href="/my#my-pc">
        マイPCを登録すると判定
      </a>
    );
  if (!spec) return <span className="my-pc-fit">判定できる情報なし</span>;
  const fit = checkFit(pc, spec);
  return (
    <span
      className={`my-pc-fit my-pc-fit-${fit.result}`}
      title={`${gpuById(pc.gpu)?.name ?? ''}／メモリ${pc.ramGb}GB／Windows ${pc.windows}`}
    >
      <b>{mark[fit.result]}</b> {label[fit.result]}
      <small>{fit.reasons.join('。')}</small>
    </span>
  );
}
