'use client';

import { useState } from 'react';

// Measures how often the browser paints (requestAnimationFrame), which
// follows the refresh rate of the monitor the window is on.
const common = [60, 75, 90, 100, 120, 144, 165, 170, 180, 200, 240, 280, 360];

export function RefreshRateCheck() {
  const [hz, setHz] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const measure = () => {
    setRunning(true);
    setHz(null);
    const times: number[] = [];
    const tick = (time: number) => {
      times.push(time);
      if (times.length < 241) {
        requestAnimationFrame(tick);
        return;
      }
      const gaps = times
        .slice(1)
        .map((value, index) => value - times[index])
        .sort((a, b) => a - b);
      const median = gaps[Math.floor(gaps.length / 2)];
      setHz(Math.round(1000 / median));
      setRunning(false);
    };
    requestAnimationFrame(tick);
  };

  const nearest = hz
    ? common.reduce((best, value) =>
        Math.abs(value - hz) < Math.abs(best - hz) ? value : best,
      )
    : null;

  return (
    <div className="refresh-check">
      <button type="button" onClick={measure} disabled={running}>
        {running ? '測定中…（2〜4秒）' : '今のリフレッシュレートを測る'}
      </button>
      {hz ? (
        <output>
          <b>約{hz}Hz</b>
          {nearest && Math.abs(nearest - hz) <= 3
            ? `（${nearest}Hzで表示されている可能性が高い）`
            : ''}
        </output>
      ) : null}
    </div>
  );
}
