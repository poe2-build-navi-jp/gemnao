import { ogImageFor } from '@/lib/og-images';
import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { RefreshRateCheck } from '@/components/refresh-rate-check';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';

export const metadata: Metadata = {
  title: 'モニターのHz確認ツール｜ブラウザ描画の目安とWindows設定を比較',
  description:
    'ブラウザの描画間隔を約4秒間測り、Windowsのリフレッシュレート設定と比較。144Hz設定なのに約60回／秒と出る時の確認先、使い方と限界を解説します。物理モニターのHzやゲームFPSの直接測定ではありません。',
  alternates: { canonical: '/tools/refresh-rate' },
  openGraph: {
    title: 'モニターのHz確認｜ブラウザ描画とWindows設定を比較',
    description:
      '約4秒の描画間隔を測定。モニターHzやゲームFPSの直接測定ではありません。',
    url: '/tools/refresh-rate',
    images: [ogImageFor('/tools/refresh-rate')],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'モニターのHz確認｜ブラウザ描画とWindows設定を比較',
    images: [ogImageFor('/tools/refresh-rate')],
  },
};

export default function RefreshRatePage() {
  return (
    <main>
      <WikiHeader pagePath="/tools/refresh-rate" />
      <article className="static-page">
        <p className="page-kicker">TOOLS</p>
        <h1>モニターのリフレッシュレート（Hz）確認ツール</h1>
        <p className="page-lead">
          このツールで分かるのは、ブラウザが描画を更新する頻度の目安です。モニターの設定Hz・最大Hzや、ゲーム中のFPSは直接取得できません。まずWindowsの表示設定を確認し、このページの測定値と分けて比較してください。
        </p>
        <section>
          <h2>使い方：対象モニターを選んで約4秒測る</h2>
          <ol>
            <li>
              Windowsの「設定」→「システム」→「ディスプレイ」→「ディスプレイの詳細設定」で、対象モニターと設定Hzを控えます。
            </li>
            <li>
              このウィンドウを対象モニターの中に収め、複数の画面にまたがらせず、ノートPCは電源条件をそろえます。
            </li>
            <li>
              測定ボタンを押し、タブを表示したまま待ちます。別の画面へ動かす場合は中断し、移動後に測り直します。
            </li>
          </ol>
        </section>
        <RefreshRateCheck />
        <p>
          60Hzのまま、またはWindowsの表示と合わない場合は、
          <a href="/pc/refresh-rate-stuck-60hz#diagnosis">
            症状別の判断表から直す手順を選ぶ
          </a>
          → 設定を1つ変更 → このページで再測定、の順に進めます。
        </p>
        <section id="results">
          <h2>WindowsのHzと測定結果から次の確認を選ぶ</h2>
          <ul>
            <li>
              <strong>Windowsも60Hz：</strong>高いHzに対応するモニターなら、
              <a href="/pc/refresh-rate-stuck-60hz#diagnosis">
                Windows設定・接続端子の判断表
              </a>
              へ。測定値だけでケーブルの故障とは判断できません。
            </li>
            <li>
              <strong>Windowsは144Hz以上、ブラウザは約60回／秒：</strong>
              タブを表示したまま再測定し、ブラウザの省電力設定やPCの負荷を確認します。ブラウザの結果だけでWindows設定が失敗したとは言えません。
            </li>
            <li>
              <strong>Windowsとブラウザは高い値、ゲームだけ重い：</strong>
              <a href="/guide/low-fps">ゲーム内のFPSと画質設定を確認</a>
              してください。このツールではゲームのFPSは測れません。
            </li>
            <li>
              <strong>測るたびに変わる・中断される：</strong>
              測定中は別タブへ移動せず、同じモニター・同じ電源条件で再試行してください。数値は丸めを含む目安です。143と144などの差だけで故障と判断しないでください。
            </li>
          </ul>
        </section>
        <section id="retest">
          <h2>直した後に、同じ条件で再確認</h2>
          <ol>
            <li>
              Windowsの「ディスプレイの詳細設定」で、対象モニターと現在のHzをもう一度確認します。
            </li>
            <li>
              変更前と同じモニターにこのページを置き、上の測定ボタンをもう一度押します。Windowsの表示とブラウザの目安を別々に比べてください。
            </li>
            <li>
              Windowsは高いHzになったのにゲームだけ滑らかでなければ、
              <a href="/pc/refresh-rate-stuck-60hz#step-2">
                ゲームだけ低い時の確認手順
              </a>
              へ。高いHzを選べないままなら、
              <a href="/pc/refresh-rate-stuck-60hz#step-3">
                ケーブル・端子の確認
              </a>
              に進みます。
            </li>
          </ol>
        </section>
        <section>
          <h2>HzとFPSの違い</h2>
          <p>
            リフレッシュレート（Hz）はモニターが1秒間に画面を書き換える回数、FPSはゲームが1秒間に作る画面の数です。144Hzのモニターでも、ゲームのFPSが60しか出ていなければ、滑らかさは60FPS相当になります。FPSが低い時は
            <a href="/guide/low-fps">ゲームのFPSが低い時の対処法</a>
            を確認してください。
          </p>
        </section>
        <section>
          <h2>測定の仕組みと限界</h2>
          <p>
            約4秒間のブラウザの描画コールバック間隔を集め、中央値から1秒当たりの回数を計算します。間隔の中央80％も表示します。これは描画タイミングのばらつきであり、モニターの応答速度や入力遅延ではありません。
          </p>
          <p>
            ブラウザ負荷・省電力・非表示タブなどの影響を受けます。可変リフレッシュレート（VRR）の動作や、パネルの最大性能を保証するテストではありません。非表示になった測定は中断します。
          </p>
          <p>
            このページの数値はその場のブラウザ測定です。特定の144Hz／240Hzモニターで精度を実機検証したという意味ではありません。
          </p>
          <h2>参考情報</h2>
          <ul>
            <li>
              <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame">
                MDN：requestAnimationFrameの動作と非表示タブでの停止（英語）
              </a>
            </li>
            <li>
              <a href="https://support.microsoft.com/en-us/windows/hardware/display-graphics/change-the-refresh-rate-on-your-monitor-in-windows">
                Microsoft：モニターごとのリフレッシュレート設定（英語）
              </a>
            </li>
          </ul>
        </section>
      </article>
      <WikiFooter />
    </main>
  );
}
