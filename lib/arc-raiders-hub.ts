import type { LocalizedHub } from '@/lib/localized/hubs';

export const arcRaidersLocalizedHub: LocalizedHub = {
  focused: true, checkedAt: '2026-10-08',
  names: { en: 'ARC Raiders', zh: 'ARC Raiders', es: 'ARC Raiders' },
  title: { en: 'ARC Raiders PC Troubleshooting: Matchmaking and Voice Chat', zh: 'ARC Raiders PC 版问题排查：匹配与语音聊天', es: 'Problemas de ARC Raiders en PC: emparejamiento y chat de voz' },
  lead: { en: 'Choose the symptom: cannot find a match, cannot enter map conditions, or cannot transmit in party or proximity voice chat.', zh: '按症状选择：无法匹配、无法进入特殊地图条件，或小队／近距离语音无法传送声音。', es: 'Elige el síntoma: no encuentras partida, no puedes acceder a condiciones de mapa o tu voz no llega al grupo o al chat de proximidad.' },
  intro: { en: 'The matchmaking guide checks the device clock, party-wide crossplay restrictions and Automatic server region. The voice guide separates chat modes, input devices, Windows microphone access and competing apps. Both summarize official Embark guidance and include one-change-at-a-time comparisons. They do not claim hands-on testing or guarantee a fix. Do not disable security protection or change a shared network just to try something.', zh: '匹配指南检查设备时间、队伍的跨平台限制与 Automatic 服务器区域；语音指南区分聊天模式、输入设备、Windows 麦克风权限及同时使用麦克风的应用。两篇指南均依据 Embark 官方信息，建议每次只改一项再比较结果。内容不代表实机验证，也不保证一定修复。不要为了尝试修复就关闭安全防护或擅自修改共用网络。', es: 'La guía de emparejamiento revisa el reloj, las restricciones de juego cruzado del grupo y la región de servidor Automatic. La de voz distingue modos de chat, dispositivos de entrada, permisos de Windows y otras aplicaciones que usan el micrófono. Ambas sintetizan las indicaciones oficiales de Embark y comparan un cambio cada vez. No afirman haber probado cada solución ni garantizan resultados. No desactives la protección de seguridad ni modifiques una red compartida solo por probar.' },
  sources: [
    { label: { en: 'Embark: matchmaking troubleshooting (English)', zh: 'Embark：匹配问题排查（英文）', es: 'Embark: problemas de emparejamiento (en inglés)' }, url: 'https://id.embark.games/arc-raiders/support/faq/148-matchmaking-troubleshooting---pc-console' },
    { label: { en: 'Embark: PC voice-chat troubleshooting (English)', zh: 'Embark：PC 语音聊天问题排查（英文）', es: 'Embark: problemas del chat de voz en PC (en inglés)' }, url: 'https://id.embark.games/arc-raiders/support/faq/156-troubleshooting-voice-chat---pc' },
    { label: { en: 'Embark: Frozen Trail 2.0 fixes and known issues (English)', zh: 'Embark：Frozen Trail 2.0 修复与已知问题（英文）', es: 'Embark: correcciones y problemas conocidos de Frozen Trail 2.0 (en inglés)' }, url: 'https://arcraiders.com/news/frozen-trail-2-0-update' },
  ],
};
