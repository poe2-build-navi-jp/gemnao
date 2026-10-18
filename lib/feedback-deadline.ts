// Bound the entire operation, including response-body parsing. Racing also
// releases the UI when a transport ignores AbortSignal. Late responses must
// not commit state: callers apply their result only after this promise resolves.
export const FEEDBACK_TIMEOUT_MS = 15_000;
export async function withFeedbackDeadline<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  cancellation?: AbortSignal,
): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let cancel: (() => void) | undefined;
  const deadline = new Promise<never>((_, reject) => {
    cancel = () => {
      reject(new DOMException('Feedback request cancelled', 'AbortError'));
      controller.abort();
    };
    if (cancellation?.aborted) {
      cancel();
      return;
    }
    cancellation?.addEventListener('abort', cancel, { once: true });
    timer = setTimeout(() => {
      reject(new DOMException('Feedback request timed out', 'TimeoutError'));
      controller.abort();
    }, FEEDBACK_TIMEOUT_MS);
  });
  try {
    if (controller.signal.aborted) return await deadline;
    return await Promise.race([
      deadline,
      Promise.resolve().then(() => operation(controller.signal)),
    ]);
  } finally {
    clearTimeout(timer);
    if (cancel) cancellation?.removeEventListener('abort', cancel);
  }
}
