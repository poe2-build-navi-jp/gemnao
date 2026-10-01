import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { RefreshRateCheck } from '@/components/refresh-rate-check';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';

export const metadata: Metadata = {
  title:
    'モニターのリフレッシュレート（Hz）確認ツール｜144Hzになっているか測る',
  description:
    'ブラウザでモニターのリフレッシュレート（60Hz・144Hz・165Hzなど）を測れる確認ツール。144Hzのはずが60Hzのまま、という時の切り分けに使えます。結果の見方とWindowsでの確認方法も解説。',
  alternates: { canonical: '/tools/refresh-rate' },
};

export default function RefreshRatePage() {
  return (
    <main>
      <WikiHeader pagePath="/tools/refresh-rate" />
      <article className="static-page">
        <p className="page-kicker">TOOLS</p>
        <h1>モニターのリフレッシュレート（Hz）確認ツール</h1>
        <p className="page-lead">
          このページを測りたいモニターに表示して、ボタンを押してください。ブラウザが画面を描き直す間隔から、今のリフレッシュレートを測ります。
        </p>
        <RefreshRateCheck />
        <section>
          <h2>結果の見方</h2>
          <ul>
            <li>
              144Hzや165Hzのモニターで「約60Hz」と出た場合は、Windowsの設定・ケーブル・端子のどこかで60Hzになっている可能性があります。
              <a href="/pc/refresh-rate-stuck-60hz">60Hzのままの時の直し方</a>
              で確認してください。
            </li>
            <li>
              ノートPCの省電力モードや、ブラウザの省エネ設定が有効だと、低めに出ることがあります。電源につないだ状態で測ってください。
            </li>
            <li>
              モニターが2台以上ある場合は、このウィンドウを置いているモニターの値になります。
            </li>
            <li>
              測った値は目安です。正確な値は、Windowsの「設定」→「システム」→「ディスプレイ」→「ディスプレイの詳細設定」で確認できます。
            </li>
          </ul>
        </section>
        <section>
          <h2>HzとFPSの違い</h2>
          <p>
            リフレッシュレート（Hz）はモニターが1秒間に画面を書き換える回数、FPSはゲームが1秒間に作る画面の数です。144Hzのモニターでも、ゲームのFPSが60しか出ていなければ、滑らかさは60FPS相当になります。FPSが低い時は
            <a href="/guide/low-fps">ゲームのFPSが低い時の対処法</a>
            を確認してください。
          </p>
        </section>
      </article>
      <WikiFooter />
    </main>
  );
}
