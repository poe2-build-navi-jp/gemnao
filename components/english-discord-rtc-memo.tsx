'use client';
import { useRef, useState } from 'react';
export const englishRtcMemoTemplate = `Discord RTC Connecting support notes
Mark unknown or unavailable comparisons as “untested”. Do not include secrets.
Date, time and time zone:
Exact error (without personal information):
OS / Discord app version / browser name and version:
Time and result of checking Discord Status:
Same call destination (works / fails / untested):
- PC app:
- Browser on the same PC and network:
- Another device on the same Wi-Fi:
- Same PC on another network:
DM versus another channel (no names or invite links needed):
VPN use / personal, school or work network:
Settings changed one at a time / original state / result / restored?:
Result after restart / any later recurrence actually checked:`;
const example = `Fictional example — not an actual incident or recovery report
Time: 20XX-XX-XX 20:00 UTC
Display: RTC Connecting; no additional error
Windows 11; app and browser versions unconfirmed
Status: checked 20:05; no voice incident found at that time
Same destination: PC app fails; same-PC/same-network browser works
Other same-Wi-Fi device and same-PC other network: untested
DM and another channel both fail in the app (names omitted)
No VPN; home network
QoS on → off: no improvement; restored to on
After restart: app fails; a short browser conversation works
Long sessions and later recurrence: untested`;
export function EnglishDiscordRtcMemo() {
 const memo=useRef<HTMLTextAreaElement>(null);
 const [message,setMessage]=useState('');
 async function copy(){try{await navigator.clipboard.writeText(englishRtcMemoTemplate);setMessage('Template copied. Fill it in using your own notes app.');}catch{memo.current?.focus();memo.current?.select();setMessage('Copy failed. The template is selected; copy it manually with Ctrl+C or a long press.');}}
 return <section className="discord-rtc-memo" aria-labelledby="rtc-memo-title">
 <h2 id="rtc-memo-title">Copy a support-notes template</h2>
 <p>Summarize comparisons for the administrator or official support. Copy the blank template and fill it in locally. This area does not accept or submit your answers.</p>
 <p className="safety-note">Do not include passwords, tokens, authentication codes, public IP addresses, email addresses or invite links. Hide personal information in screenshots and logs too.</p>
 <label htmlFor="rtc-memo-template">Blank template — also selectable for manual copying</label>
 <textarea id="rtc-memo-template" ref={memo} readOnly value={englishRtcMemoTemplate} rows={18}/>
 <button type="button" className="copy-button" onClick={copy}>Copy support-notes template</button>
 <output aria-live="polite">{message}</output>
 <h3>Fictional completed example</h3><p>This illustrates record keeping only. Browser success does not prove the cause or lasting recovery.</p><pre>{example}</pre>
 </section>;
}
