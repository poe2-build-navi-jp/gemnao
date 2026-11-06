export type GemnaoCard = {
  game: string;
  symptom: string;
  action: string;
  result: 'resolved' | 'checking' | 'unresolved';
  theme: 'mint' | 'gold' | 'violet';
  article: string;
  date: string;
};
export const CARD_KEY = 'gemnao-brand-cards-v1';
export function cleanCard(input: Partial<GemnaoCard>): GemnaoCard {
  const text = (s: unknown, max: number) =>
    typeof s === 'string'
      ? s
          .replace(/\p{Cc}/gu, ' ')
          .trim()
          .slice(0, max)
      : '';
  const article = text(input.article, 180);
  return {
    game: text(input.game, 40),
    symptom: text(input.symptom, 70),
    action: text(input.action, 130),
    result: ['resolved', 'unresolved'].includes(input.result || '')
      ? (input.result as GemnaoCard['result'])
      : 'checking',
    theme: ['gold', 'violet'].includes(input.theme || '')
      ? (input.theme as GemnaoCard['theme'])
      : 'mint',
    article: /^\/(?:guide\/[a-z0-9-]+|games\/[a-z0-9-]+\/[a-z0-9-]+)$/.test(
      article,
    )
      ? article
      : '',
    date: /^\d{4}-\d{2}-\d{2}$/.test(input.date || '') ? input.date! : '',
  };
}
const xml = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[c]!,
  );
function lines(s: string, width: number, max: number) {
  const out: string[] = [];
  let line = '';
  let size = 0;
  for (const char of s) {
    const n = /[ -~]/.test(char) ? 0.55 : 1;
    if (size + n > width) {
      out.push(line);
      line = '';
      size = 0;
    }
    line += char;
    size += n;
  }
  if (line) out.push(line);
  return out
    .slice(0, max)
    .map((l, i) =>
      i === max - 1 && out.length > max ? l.slice(0, -1) + '…' : l,
    );
}
export function cardSvg(input: GemnaoCard) {
  const c = cleanCard(input),
    color = { mint: '#7af4d3', gold: '#f5d58d', violet: '#bdb0ff' }[c.theme];
  const number = { mint: '001', gold: '002', violet: '003' }[c.theme];
  const block = (text: string, y: number, w: number, max: number, size = 29) =>
    lines(text, w, max)
      .map(
        (l, i) =>
          `<text x="66" y="${y + i * (size + 14)}" font-size="${size}">${xml(l)}</text>`,
      )
      .join('');
  const result = {
    resolved: '解決した',
    checking: '確認中',
    unresolved: 'まだ解決していない',
  }[c.result];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1000" viewBox="0 0 720 1000"><defs><linearGradient id="rim" x2="1" y2="1"><stop stop-color="${color}"/><stop offset=".3" stop-color="#ffffff"/><stop offset=".52" stop-color="#556775"/><stop offset=".8" stop-color="${color}"/><stop offset="1" stop-color="#f8efe1"/></linearGradient><radialGradient id="glow"><stop stop-color="${color}" stop-opacity=".24"/><stop offset="1" stop-color="#102330" stop-opacity="0"/></radialGradient><pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" fill="none" stroke="#ffffff" stroke-opacity=".055"/></pattern></defs><rect x="8" y="8" width="704" height="984" rx="34" fill="url(#rim)"/><rect x="17" y="17" width="686" height="966" rx="27" fill="#0b1d2a"/><rect x="25" y="25" width="670" height="950" rx="20" fill="url(#grid)"/><ellipse cx="610" cy="210" rx="450" ry="380" fill="url(#glow)"/><g font-family="sans-serif" fill="#f6fafb"><path d="M66 59h43v34H66z M77 77l8 7 15-17 M79 100h18" fill="none" stroke="${color}" stroke-width="4"/><text x="125" y="84" font-size="32" font-weight="700">ゲムなおカード</text><text x="65" y="132" font-size="15" letter-spacing="4" fill="${color}">GEMNAO · PLAYER'S FIELD NOTES</text><text x="65" y="204" font-size="17" fill="${color}">SERIES 01 / No.${number}</text>${block(c.game || 'あなたのゲーム', 257, 16, 2, 36)}<path d="M66 345H654" stroke="${color}" stroke-opacity=".5"/><text x="66" y="389" font-size="17" fill="${color}">SYMPTOM / 症状</text>${block(c.symptom || 'どんなことで困った？', 435, 20, 3)}<text x="66" y="591" font-size="17" fill="${color}">TRIED / 試したこと</text>${block(c.action || '試した対処と条件を記録しよう', 635, 23, 4, 25)}<rect x="64" y="821" width="592" height="67" rx="12" fill="${color}" fill-opacity=".12" stroke="${color}"/><text x="84" y="862" font-size="27" fill="${color}">${result}</text><text x="66" y="920" font-size="17">本人の記録 · ${xml(c.date)} · 効果を保証するものではありません</text><text x="66" y="951" font-size="17" fill="${color}">gemnao.pages.dev / 困ったら、ゲムなお。</text><path d="M634 62l5 13 14 5-14 5-5 13-5-13-14-5 14-5z" fill="${color}"/></g></svg>`;
}
export function readCardCollection(raw: string | null): GemnaoCard[] {
  if (raw === null) return [];
  const data: unknown = JSON.parse(raw);
  if (
    !Array.isArray(data) ||
    data.length > 100 ||
    data.some(
      (c) =>
        !c ||
        typeof c !== 'object' ||
        ['game', 'symptom', 'action', 'article', 'date'].some(
          (k) => typeof c[k] !== 'string',
        ) ||
        !['mint', 'gold', 'violet'].includes(c.theme) ||
        !['resolved', 'checking', 'unresolved'].includes(c.result),
    )
  )
    throw Error('Invalid collection');
  return data.map(cleanCard);
}
