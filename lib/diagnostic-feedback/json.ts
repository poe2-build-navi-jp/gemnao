/** Reject duplicate object keys, including escaped equivalents, at every depth. */
export function strictJson(text: string): unknown {
  let i = 0;
  const ws = () => {
    while (/\s/.test(text[i] || '') && i < text.length) i++;
  };
  const str = () => {
    const start = i++;
    while (i < text.length) {
      if (text[i] === '\\') {
        i += 2;
        continue;
      }
      if (text[i++] === '"') return JSON.parse(text.slice(start, i)) as string;
    }
    throw new Error('string');
  };
  const value = (depth: number): void => {
    if (depth > 12) throw new Error('depth');
    ws();
    if (text[i] === '{') {
      i++;
      ws();
      const keys = new Set<string>();
      if (text[i] === '}') {
        i++;
        return;
      }
      while (true) {
        ws();
        if (text[i] !== '"') throw new Error('key');
        const key = str();
        if (keys.has(key)) throw new Error('duplicate');
        keys.add(key);
        ws();
        if (text[i++] !== ':') throw new Error('colon');
        value(depth + 1);
        ws();
        const c = text[i++];
        if (c === '}') return;
        if (c !== ',') throw new Error('comma');
      }
    } else if (text[i] === '[') {
      i++;
      ws();
      if (text[i] === ']') {
        i++;
        return;
      }
      while (true) {
        value(depth + 1);
        ws();
        const c = text[i++];
        if (c === ']') return;
        if (c !== ',') throw new Error('comma');
      }
    } else if (text[i] === '"') {
      str();
    } else {
      const start = i;
      while (i < text.length && !/[\s,\]}]/.test(text[i])) i++;
      if (start === i) throw new Error('value');
      JSON.parse(text.slice(start, i));
    }
  };
  value(0);
  ws();
  if (i !== text.length) throw new Error('trailing');
  return JSON.parse(text);
}
