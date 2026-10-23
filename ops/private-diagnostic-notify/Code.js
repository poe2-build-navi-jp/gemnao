// Copy only into an owner-private standalone Apps Script. No web app deployment.
// Replace this synthetic endpoint and recipient in that private copy after review.
const NOTIFICATION_ENDPOINT = 'https://reviewed-host.invalid/api/private-diagnostic/notifications';
const OWNER_EMAIL = 'owner@example.invalid';
// eslint-disable-next-line no-unused-vars -- Entry point invoked by the owner-created Apps Script trigger.
function checkPrivateDiagnostic() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return 'busy';
  try {
    const p = PropertiesService.getScriptProperties();
    if (p.getProperty('NOTIFY_ENABLED') !== 'true') return 'disabled';
    const key = p.getProperty('NOTIFY_READ_TOKEN');
    if (!/^[a-f0-9]{64}$/.test(key || '') || OWNER_EMAIL.endsWith('.invalid') || NOTIFICATION_ENDPOINT.includes('.invalid/')) return 'not-configured';
    // Credentials never enter URLs, output, logs, returned provider errors or redirects.
    const response = UrlFetchApp.fetch(NOTIFICATION_ENDPOINT, {method:'get', headers:{Authorization:'Bearer '+key}, followRedirects:false, muteHttpExceptions:true});
    if (response.getResponseCode() !== 200) return 'read-failed';
    const text = response.getContentText();
    if (text.length > 256) return 'invalid-response';
    const data = JSON.parse(text);
    if (!data || Array.isArray(data) || Object.keys(data).sort().join(',') !== 'cursor,version' || data.version !== 1 || !(data.cursor === null || /^[a-f0-9]{32}$/.test(data.cursor))) return 'invalid-response';
    const cursor = data.cursor || '';
    // First successful read establishes a baseline without notifying historical receipts.
    if (p.getProperty('INITIALIZED') !== 'true') {
      p.setProperties({INITIALIZED:'true',LAST_CURSOR:cursor});return 'baseline';
    }
    if (p.getProperty('PENDING_CURSOR')) return 'send-uncertain';
    if (!cursor) {p.setProperty('LAST_CURSOR','');return 'empty';}
    if (cursor === p.getProperty('LAST_CURSOR')) return 'unchanged';
    if (MailApp.getRemainingDailyQuota() < 1) return 'quota-exhausted';
    // Persist intent first: a crash/throw after send must not silently send twice.
    p.setProperty('PENDING_CURSOR',cursor);
    MailApp.sendEmail(OWNER_EMAIL,'[Gemnao] New private diagnostic result','新しい診断結果が届いた');
    p.setProperty('LAST_CURSOR',cursor);
    p.deleteProperty('PENDING_CURSOR');
    return 'mail-call-completed'; // NOT verified Gmail/ChatGPT delivery.
  } catch {return 'uncertain';} finally {lock.releaseLock();}
}
