'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid the existing vinext client-link runtime issue. */


import { useEffect, useRef, useState } from 'react';
import { summarizeFrameTimes } from '@/lib/refresh-rate';

export function RefreshRateCheck({ locale = 'ja' }: { locale?: 'ja' | 'en' }) {
  const en = locale === 'en';
  const [result, setResult] =
    useState<ReturnType<typeof summarizeFrameTimes>>(null);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');
  const cleanup = useRef<(() => void) | null>(null);
  useEffect(() => () => cleanup.current?.(), []);

  const measure = () => {
    cleanup.current?.();
    setRunning(true);
    setResult(null);
    setMessage(
      en
        ? 'Keep this tab visible and leave the window on the same monitor.'
        : 'このタブを表示したまま、ウィンドウを動かさずにお待ちください。',
    );
    const times: number[] = [];
    let frame: number | null = null;
    const dispose = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', onVisibility);
      cleanup.current = null;
    };
    const stop = (reason: string) => {
      dispose();
      setRunning(false);
      setMessage(reason);
    };
    const onVisibility = () => {
      if (document.hidden)
        stop(
          en
            ? 'Measurement stopped because the tab became hidden. Show the page and try again.'
            : 'タブが非表示になったため中断しました。ページを表示して測り直してください。',
        );
    };
    const tick = (time: number) => {
      times.push(time);
      if (time - times[0] < 4000) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const summary = summarizeFrameTimes(times);
      dispose();
      setResult(summary);
      setRunning(false);
      setMessage(
        summary
          ? en
            ? 'Measurement complete. Compare this estimate separately with the Windows setting.'
            : '測定完了。Windowsの設定値と別々に比較してください。'
          : en
            ? 'Not enough frame intervals were recorded. Reduce browser load and try again.'
            : '十分な描画間隔を取得できませんでした。負荷を下げて測り直してください。',
      );
    };
    cleanup.current = dispose;
    document.addEventListener('visibilitychange', onVisibility);
    const timeout = setTimeout(
      () =>
        stop(
          en
            ? 'Measurement timed out. Keep the page visible, reduce browser load and retry.'
            : '測定が時間内に完了しませんでした。ページを表示し、ブラウザの負荷を下げて再試行してください。',
        ),
      10000,
    );
    if (document.hidden) onVisibility();
    else frame = requestAnimationFrame(tick);
  };

  return (
    <div className="refresh-check">
      <button type="button" onClick={measure} disabled={running}>
        {running
          ? en
            ? 'Measuring… (about 4 seconds)'
            : '測定中…（約4秒）'
          : en
            ? 'Measure browser frame timing'
            : 'ブラウザの描画頻度を測る'}
      </button>
      {running ? (
        <button
          type="button"
          onClick={() => {
            cleanup.current?.();
            setRunning(false);
            setMessage(en ? 'Measurement cancelled.' : '測定を中断しました。');
          }}
        >
          {en ? 'Cancel measurement' : '中断する'}
        </button>
      ) : null}
      <p aria-live="polite">{message}</p>
      {result ? (
        <output aria-live="polite">
          {en ? (
            <>
              <b>Browser estimate: about {result.hz} updates/second</b>
              <span>
                Median interval: {result.interval.toFixed(2)} ms (
                {result.samples} intervals)
              </span>
              <span>
                Central 80% of intervals: {result.low.toFixed(2)}–
                {result.high.toFixed(2)} ms. If spread is large, repeat under
                the same load and conditions.
              </span>
              <span>
                This does not directly measure the monitor’s configured/maximum
                Hz or game FPS.
              </span>
              <a href="#results">
                Compare with Windows and choose the next check →
              </a>
            </>
          ) : (
            <>
              <b>ブラウザ描画の目安：約{result.hz}回／秒</b>
              <span>
                描画間隔の中央値 {result.interval.toFixed(2)}ms（
                {result.samples}
                区間）
              </span>
              <span>
                中央80％の間隔：{result.low.toFixed(2)}〜
                {result.high.toFixed(2)}
                ms。数値が離れる場合は、負荷や測定条件を変えずに再測定してください。
              </span>
              <span>
                モニターの設定Hz・最大Hzや、ゲームのFPSを直接測った値ではありません。
              </span>
              <a href="#results">
                Windowsの表示と照らし合わせて、次の確認を選ぶ →
              </a>
            </>
          )}
        </output>
      ) : null}
    </div>
  );
}
