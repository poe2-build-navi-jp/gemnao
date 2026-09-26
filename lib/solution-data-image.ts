import { feedbackSummary, solutionRanking } from './solution-ranking';

type Row = { resolved: number; struggling: number };
type Step = { id: string; title: string };
type Method = { methodId: string; methodLabel: string; responses: number };

const escapeXml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[character] || character,
  );

function splitLabel(value: string, length = 17) {
  const characters = Array.from(value);
  return [
    characters.slice(0, length).join(''),
    characters.slice(length, length * 2).join(''),
  ];
}

/** Returns null until real, consistent D1 reports meet the publication threshold. */
export function solutionDataImage(
  title: string,
  row: Row,
  methods: Method[],
  steps: Step[],
  generatedAt: Date,
): string | null {
  if (
    !Number.isSafeInteger(row.resolved) ||
    !Number.isSafeInteger(row.struggling) ||
    row.resolved < 0 ||
    row.struggling < 0
  )
    return null;
  const { total, percentage } = feedbackSummary(row);
  const ranking = solutionRanking(methods, steps, row.resolved);
  if (total < 10 || percentage === null || !ranking.length) return null;

  const safeTitle = escapeXml(Array.from(title).slice(0, 34).join(''));
  const date = generatedAt.toISOString().slice(0, 10);
  const bars = ranking
    .slice(0, 3)
    .map((method, index) => {
      const y = 390 + index * 192;
      const [first, second] = splitLabel(method.methodLabel);
      const barWidth = Math.max(
        8,
        Math.round((690 * method.responses) / ranking[0].responses),
      );
      return `<g>
      <text x="80" y="${y}" fill="#bed7ec" font-size="26">STEP ${escapeXml(method.methodId)} / ${method.tied ? '同率' : ''}${method.rank}位</text>
      <text x="80" y="${y + 48}" fill="#ffffff" font-size="38" font-weight="700">${escapeXml(first)}</text>
      ${second ? `<text x="80" y="${y + 89}" fill="#ffffff" font-size="32">${escapeXml(second)}</text>` : ''}
      <rect x="80" y="${y + 108}" width="700" height="16" rx="8" fill="#274c67"/>
      <rect x="80" y="${y + 108}" width="${barWidth}" height="16" rx="8" fill="#6ec9ff"/>
      <text x="1000" y="${y + 122}" text-anchor="end" fill="#ffffff" font-size="37" font-weight="700">${method.responses}件</text>
    </g>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" role="img" aria-label="${safeTitle}のSTEP別解決回答数">
    <rect width="1080" height="1080" fill="#0e263f"/>
    <text x="80" y="95" fill="#6ec9ff" font-size="28" font-weight="700">ゲムなお｜実際の解決報告</text>
    <text x="80" y="165" fill="#ffffff" font-size="42" font-weight="700">${safeTitle}</text>
    <text x="80" y="240" fill="#ffffff" font-size="40">解決回答 ${row.resolved}件 ／ 全回答 ${total}件</text>
    <text x="80" y="292" fill="#bed7ec" font-size="26">自己申告による解決報告の割合 ${percentage}%</text>
    ${bars}
    <path d="M80 955H1000" stroke="#335974"/>
    <text x="80" y="1004" fill="#bed7ec" font-size="24">人数ではなく回答数です。重複報告の可能性があります。</text>
    <text x="80" y="1040" fill="#bed7ec" font-size="23">D1集計：${date} UTC｜詳細は記事本文を確認</text>
  </svg>`;
}
