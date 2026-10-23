// Review-only policy. Not imported by the app, no network/provider/credential access.
const signal = Object.freeze({
  subject: '[Gemnao] New private diagnostic result',
  text: '新しい診断結果が届いた',
});
export function createReceiptSignal({ enabled = false, sendFixedSignal } = {}) {
  return async event => {
    if (enabled !== true) return {status:'disabled'};
    if (!event || typeof event !== 'object' || Array.isArray(event)
      || Object.keys(event).length !== 1 || event.kind !== 'new-receipt-committed') return {status:'invalid-event'};
    if (typeof sendFixedSignal !== 'function') return {status:'not-configured'};
    try {
      // Exactly one call. No event/provider values may enter the email or result.
      const result = await sendFixedSignal(signal);
      return {status:result === 'accepted' ? 'provider-accepted' : result === 'rejected' ? 'rejected' : 'uncertain'};
    } catch { return {status:'uncertain'}; }
  };
}
