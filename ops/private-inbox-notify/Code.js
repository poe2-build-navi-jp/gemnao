// Owner-private standalone Apps Script only. No web-app deployment or mailbox reading.
const INBOX_ENDPOINT = 'https://gemnao.pages.dev/api/private-inbox/notifications';
function initializeInboxBaseline() { return runInboxCheck(false); }
function checkInboxNotifications() { return runInboxCheck(true); }
function runInboxCheck(send) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return 'busy';
  try {
    const p = PropertiesService.getScriptProperties();
    if (send && p.getProperty('NOTIFY_ENABLED') !== 'true') return 'disabled';
    const token = p.getProperty('NOTIFY_READ_TOKEN');
    const recipient = p.getProperty('OWNER_EMAIL');
    // Recipient is privately configured once; never comes from the API or invocation.
    if (!/^[a-f0-9]{64}$/.test(token || '') || !/^[^\s@]+@gmail\.com$/.test(recipient || '') || p.getProperty('RECIPIENT_VERIFIED') !== 'true') return 'not-configured';
    if (p.getProperty('PENDING_BATCH')) return 'send-uncertain';
    const previous = p.getProperty('LAST_CURSOR');
    if (!send && previous) return 'already-initialized';
    const headers = { Authorization: 'Bearer ' + token };
    if (previous) headers['X-Inbox-Cursor'] = previous;
    const response = UrlFetchApp.fetch(INBOX_ENDPOINT, { method:'get', headers, followRedirects:false, muteHttpExceptions:true });
    if (response.getResponseCode() !== 200) return 'read-failed';
    const text = response.getContentText();
    if (text.length > 512) return 'invalid-response';
    const data = JSON.parse(text);
    if (!data || Object.keys(data).sort().join(',') !== 'baseline,counts,cursor,version' || data.version !== 1 || data.baseline !== !previous || !/^[A-Za-z0-9_-]{40,160}$/.test(data.cursor || '') || !data.counts || Object.keys(data.counts).sort().join(',') !== 'contact,discord_listing' || !Object.values(data.counts).every(n=>Number.isSafeInteger(n)&&n>=0)) return 'invalid-response';
    if (!previous) {
      if (data.counts.contact || data.counts.discord_listing) return 'invalid-response';
      p.setProperty('LAST_CURSOR',data.cursor); return 'baseline';
    }
    if (!data.counts.contact && !data.counts.discord_listing) {
      p.setProperty('LAST_CURSOR',data.cursor); return 'unchanged';
    }
    if (data.cursor === previous) return 'invalid-response';
    if (MailApp.getRemainingDailyQuota() < 1) return 'quota-exhausted';
    // Persist intent before any send; uncertain sends block all future batches.
    const pending = JSON.stringify({cursor:data.cursor,counts:data.counts});
    p.setProperty('PENDING_BATCH',pending);
    if (p.getProperty('PENDING_BATCH') !== pending) return 'checkpoint-failed';
    MailApp.sendEmail(recipient,'[Gemnao Inbox] New form submissions',
      'ゲムなおに新しい申請が届きました。\n問い合わせ: '+data.counts.contact+'件\nDiscord掲載依頼: '+data.counts.discord_listing+'件\nhttps://gemnao.pages.dev/admin/contacts\nhttps://gemnao.pages.dev/admin/discord-servers');
    p.setProperty('LAST_CURSOR',data.cursor);
    if (p.getProperty('LAST_CURSOR') !== data.cursor) return 'send-uncertain';
    p.deleteProperty('PENDING_BATCH');
    return 'mail-call-completed'; // Not proof of Gmail or ChatGPT delivery.
  } catch { return 'uncertain'; } finally { lock.releaseLock(); }
}
