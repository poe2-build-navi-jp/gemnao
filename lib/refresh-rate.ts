/** Browser callback timing only: this cannot read a monitor mode or game FPS. */
export function summarizeFrameTimes(times: number[]) {
  const gaps = times.slice(1).map((time, index) => time - times[index]);
  if (gaps.length < 30 || gaps.some((gap) => !Number.isFinite(gap) || gap <= 0))
    return null;
  gaps.sort((a, b) => a - b);
  const interval = gaps[Math.floor(gaps.length / 2)];
  return {
    hz: Math.round(1000 / interval),
    interval,
    samples: gaps.length,
    low: gaps[Math.floor(gaps.length * 0.1)],
    high: gaps[Math.floor(gaps.length * 0.9)],
  };
}
