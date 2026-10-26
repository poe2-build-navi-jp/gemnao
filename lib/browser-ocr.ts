export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export async function validateOcrImage(file: File) {
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error('image');
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const png = bytes.slice(0, 8).join(',') === '137,80,78,71,13,10,26,10';
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp = new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP';
  if (!(file.type === 'image/png' && png || file.type === 'image/jpeg' && jpeg || file.type === 'image/webp' && webp)) throw new Error('image');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image(); image.src = url;
    await image.decode();
    if (!image.width || !image.height || image.width > 8192 || image.height > 8192 || image.width * image.height > 12000000) throw new Error('image');
  } finally { URL.revokeObjectURL(url); }
}
export function recognizeLocalImage(file: File, language: string, signal: AbortSignal, progress: (value: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const frame = document.createElement('iframe');
    frame.hidden = true; frame.title = 'Local OCR'; frame.src = '/ocr/v7/runner.html';
    const channel = new MessageChannel();
    let finished = false;
    const cleanup = () => {
      clearTimeout(timer); signal.removeEventListener('abort', abort);
      channel.port1.close(); channel.port2.close(); frame.remove();
    };
    const end = (text?: string) => {
      if (finished) return;
      finished = true; cleanup();
      if (text !== undefined) resolve(text); else reject(new Error('ocr'));
    };
    const abort = () => end();
    const timer = setTimeout(() => end(), 120000);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) { end(); return; }
    channel.port1.onmessage = event => {
      const message = event.data;
      if (message.type === 'done' && typeof message.text === 'string') end(message.text);
      else if (message.type === 'error') end();
      else if (message.type === 'progress' && Number.isFinite(message.value)) progress(Math.max(0, Math.min(1, message.value)));
    };
    frame.onload = () => frame.contentWindow?.postMessage({ file, language }, location.origin, [channel.port2]);
    frame.onerror = () => end();
    document.body.appendChild(frame);
  });
}
