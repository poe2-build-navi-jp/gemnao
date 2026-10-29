import { createWorker } from 'tesseract.js';
// One document owns one job. Removing this iframe destroys even booting workers.
let started = false;
window.addEventListener('message', async event => {
  if (started || event.source !== parent || event.origin !== location.origin || !event.ports[0]) return;
  started = true;
  const port = event.ports[0];
  const { file, language } = event.data;
  if (!(file instanceof File) || !['eng', 'jpn+eng', 'chi_sim+eng', 'spa+eng'].includes(language)) {
    port.postMessage({ type: 'error' }); return;
  }
  let worker: Awaited<ReturnType<typeof createWorker>> | undefined;
  try {
    const base = `${location.origin}/ocr/v7/`;
    worker = await createWorker(language, 1, {
      workerPath: `${base}worker.min.js`, corePath: base, langPath: base,
      workerBlobURL: false, cacheMethod: 'none',
      logger: message => port.postMessage({ type: 'progress', value: message.status === 'recognizing text' ? message.progress : 0 }),
      errorHandler: () => port.postMessage({ type: 'error' }),
    });
    const result = await worker.recognize(file);
    await worker.terminate(); worker = undefined;
    port.postMessage({ type: 'done', text: result.data.text.slice(0, 10000) });
  } catch {
    port.postMessage({ type: 'error' });
  } finally { await worker?.terminate(); }
});
