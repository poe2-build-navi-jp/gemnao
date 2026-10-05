import type { LocalizedArticle } from '@/lib/localized/types';

// Artículos clásicos basados en el soporte oficial, con adaptaciones de seguridad.
// La revisión parcial consta en docs/evidence-audit-2026-10-05; no implica
// una nueva verificación de todo el artículo.

const verify = (name: string) =>
  `En la biblioteca de Steam, haz clic derecho en «${name}» → Propiedades → Archivos instalados → Verificar integridad de los archivos del juego.`;

const base = { locale: 'es' as const, checkedAt: '2026-10-01' };

export const articlesEs: LocalizedArticle[] = [
  {
    ...base,
    gameSlug: 'cyberpunk-2077',
    slug: 'not-launching',
    title:
      'Cyberpunk 2077 no inicia o se cierra en PC: soluciones oficiales en orden',
    shortTitle: 'No inicia o se cierra',
    description:
      '¿Cyberpunk 2077 no arranca o se cierra en PC? Pruébalo sin mods y sigue el orden de CD PROJEKT RED: instalación limpia del controlador, Visual C++, verificación de archivos, superposiciones y overclock.',
    lead: 'Para las versiones de Steam, GOG y Epic en Windows: no pasa nada al pulsar Jugar, el juego se cierra tras REDlauncher o vuelve al escritorio mientras juegas.',
    summary:
      'A partir de las comprobaciones del soporte de CD PROJEKT RED, esta guía revisa los requisitos y Windows, el controlador gráfico, Visual C++ y los archivos del juego. Aquí mantenemos activa la protección y comparamos solo las superposiciones no esenciales, una por una. Si usas mods, comprueba primero si el juego inicia sin ellos.',
    quickFacts: [
      {
        label: 'Ver la versión de Windows',
        value:
          'Windows + R → «winver» (Windows 10 debe ser la versión 1909 o posterior)',
      },
      {
        label: 'Ubicación de la partida',
        value: String.raw`%USERPROFILE%\Saved Games\CD Projekt Red\Cyberpunk 2077`,
        copy: true,
      },
      {
        label: 'Se cierra desde que actualizaste el controlador',
        value: 'Instala la versión anterior (consejo oficial)',
      },
      { label: 'Usas mods', value: 'Pruébalo sin mods antes que nada' },
    ],
    diagnosis: [
      {
        symptom: 'Dejó de iniciar tras instalar mods o un parche grande',
        cause: 'Un mod no es compatible con la versión actual',
        stepId: 'mods-off',
      },
      {
        symptom: 'Se cierra desde que actualizaste el controlador gráfico',
        cause: 'Problema del controlador',
        stepId: 'gpu-driver',
      },
      {
        symptom: 'Aparece un error como «no se encontró MSVCP140.dll»',
        cause: 'Faltan o están dañados los paquetes de Visual C++',
        stepId: 'vcredist',
      },
      {
        symptom: 'Cierres aleatorios mientras juegas',
        cause: 'Archivos dañados, superposiciones u overclock',
        stepId: 'verify-files',
      },
    ],
    steps: [
      {
        id: 'mods-off',
        title:
          'Retira los mods y comprueba los requisitos y la versión de Windows',
        summary: 'Descarta primero los mods.',
        time: 'Unos 5 min',
        actions: [
          'Si usas un gestor de mods, desactiva todos. Si los instalaste a mano, mueve los archivos que añadiste a otra carpeta.',
          'Pulsa Windows + R, escribe «winver» y mira tu versión de Windows. En Windows 10, actualiza si es anterior a la 1909 (requisito oficial).',
          'Compara los requisitos de la tienda de Steam con tu tarjeta gráfica y tu memoria.',
        ],
        note: 'Si el juego inicia sin mods, actualiza cada mod a una versión compatible con la versión actual y vuelve a añadirlos de uno en uno.',
      },
      {
        id: 'gpu-driver',
        title: 'Haz una instalación limpia del controlador gráfico',
        summary:
          'Los pasos oficiales eliminan el controlador antiguo antes de instalar el más reciente.',
        time: 'Unos 15 min',
        actions: [
          'Descarga antes el controlador más reciente de NVIDIA, AMD o Intel.',
          'NVIDIA e Intel: elimina el controlador antiguo con Display Driver Uninstaller (DDU) e instala el que descargaste. AMD: elimínalo con AMD Cleanup Utility e instala el nuevo.',
          'Si los cierres empezaron justo después de actualizar el controlador, instala la versión anterior.',
        ],
        note: 'La resolución puede bajar mientras se elimina el controlador. Ten estos pasos abiertos en otro dispositivo.',
      },
      {
        id: 'vcredist',
        title: 'Reinstala los paquetes de Visual C++',
        summary:
          'Hazlo si ves un error de DLL o si el juego se cierra al iniciar sin ningún mensaje.',
        time: 'Unos 5 min',
        actions: [
          'Descarga de Microsoft los paquetes redistribuibles de Visual C++ x64 y x86.',
          'Haz clic derecho en cada instalador → Ejecutar como administrador.',
          'Reinicia el PC e inicia el juego.',
        ],
      },
      {
        id: 'verify-files',
        title:
          'Verifica los archivos y compara las superposiciones no esenciales',
        summary:
          'Repara archivos dañados y compara solo las superposiciones no esenciales, manteniendo activa la protección.',
        time: '10–20 min',
        actions: [
          verify('Cyberpunk 2077'),
          'En GOG GALAXY o Epic Games, usa la opción de verificar o reparar del lanzador.',
          'Desactiva solo las superposiciones no esenciales (Discord, Ubisoft Connect, GOG GALAXY, etc.), una por una, y compara el inicio. Mantén activos el antivirus y el cortafuegos.',
          'Ejecuta el lanzador (Steam, GOG GALAXY o Epic) como administrador e inicia el juego.',
          'Si aumentaste o redujiste la frecuencia de la CPU o la GPU, restaura la frecuencia de fábrica (consejo oficial).',
        ],
        note: 'No restaures archivos en cuarentena ni añadas exclusiones solo para iniciar el juego. Si sospechas un falso positivo en un archivo oficial, anota el nombre de la detección y el archivo afectado y consulta al soporte oficial del producto de seguridad o de CD PROJEKT RED.',
      },
    ],
    avoid: [
      'No reinstales con los mods todavía instalados; pueden quedar archivos.',
      'No borres la carpeta de partidas. Cópiala en otro lugar antes de empezar.',
      'No busques el fallo con el hardware con overclock.',
    ],
    cautions: [
      'Si nada funciona, contacta con el soporte de CD PROJEKT RED indicando el mensaje o código de error exacto (consejo oficial).',
    ],
    faqs: [
      {
        question: 'REDlauncher no se abre.',
        answer:
          'CD PROJEKT RED recomienda ejecutar la tienda (Steam, Epic Games o GOG GALAXY) como administrador e iniciar el juego desde ahí.',
      },
      {
        question: '¿Se borran las partidas si reinstalo?',
        answer: String.raw`Las partidas se guardan en %USERPROFILE%\Saved Games\CD Projekt Red\Cyberpunk 2077, fuera de la carpeta del juego. Aun así, cópiala en un lugar seguro antes de empezar.`,
      },
    ],
    sources: [
      {
        label:
          'Soporte de CD PROJEKT RED: Game is not launching — Cyberpunk 2077 (en inglés)',
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1568/game-is-not-launching',
      },
      {
        label:
          'Soporte de CD PROJEKT RED: Game crashes — Cyberpunk 2077 (en inglés)',
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1700/my-game-crashes-7',
      },
      {
        label:
          'Soporte de CD PROJEKT RED: no se encontró MSVCP140_1.dll (en inglés)',
        url: 'https://support.cdprojektred.com/en/cyberpunk/pc/sp-technical/issue/1915/error-the-code-execution-cannot-proceed-because-msvcp140-1-dll-was-not-found',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'baldurs-gate-3',
    slug: 'crash-on-startup',
    title:
      'Baldur’s Gate 3 se cierra al iniciar o no arranca en PC: soluciones de Larian',
    shortTitle: 'Se cierra al iniciar',
    description:
      '¿Baldur’s Gate 3 se cierra al iniciar o no arranca? Alterna entre DirectX 11 y Vulkan, abre el ejecutable directamente, elimina mods antiguos y recrea la carpeta del perfil, según el soporte de Larian.',
    lead: 'Para las versiones de Steam y GOG en Windows: no pasa nada al pulsar Play en el lanzador, el juego se cierra cerca del logotipo o dejó de iniciar tras un parche.',
    summary:
      'El soporte de Larian propone este orden: cerrar los programas innecesarios, verificar los archivos, alternar entre DirectX 11 y Vulkan en el lanzador, abrir el ejecutable directamente y quitar del todo los mods antiguos. Deja para el final recrear la carpeta del perfil, y cámbiale el nombre en vez de borrarla para conservar tus partidas.',
    quickFacts: [
      {
        label: 'Ejecutables',
        value: 'Vulkan: bg3.exe / DirectX 11: bg3_dx11.exe (en la carpeta bin)',
      },
      {
        label: 'Carpeta de mods',
        value: String.raw`%LocalAppData%\Larian Studios\Baldur's Gate 3\Mods`,
        copy: true,
      },
      {
        label: 'Partidas y ajustes',
        value: String.raw`%LocalAppData%\Larian Studios\Baldur's Gate 3`,
        copy: true,
      },
      {
        label: 'Problema conocido',
        value:
          'ASUS Sonic Studio Virtual Mixer puede cerrar el juego al iniciar (oficial)',
      },
    ],
    diagnosis: [
      {
        symptom: 'Se cierra al pulsar Play en el lanzador',
        cause: 'Programas en segundo plano o la API gráfica',
        stepId: 'switch-api',
      },
      {
        symptom: 'El propio lanzador aparece en blanco o no responde',
        cause: 'Problema del lanzador',
        stepId: 'direct-exe',
      },
      {
        symptom: 'Dejó de iniciar tras un parche (usabas mods)',
        cause: 'Restos de mods antiguos',
        stepId: 'remove-mods',
      },
      {
        symptom: 'Se cierra al iniciar incluso en una partida nueva',
        cause: 'Ajustes o caché dañados',
        stepId: 'reset-profile',
      },
    ],
    steps: [
      {
        id: 'switch-api',
        title:
          'Cierra programas, verifica los archivos y alterna DirectX 11 / Vulkan',
        summary:
          'Esta guía adapta las comprobaciones de Larian manteniendo activa la protección de seguridad.',
        time: '10–15 min',
        actions: [
          'Cierra una por una las herramientas de ajuste, las superposiciones de monitorización y las aplicaciones de chat que no necesites. Mantén activos el antivirus y el cortafuegos. Si hay una detección, consulta el archivo y el nombre detectado con el proveedor de seguridad o Larian.',
          'Si usas ASUS Sonic Studio Virtual Mixer, desactívalo o desinstálalo (problema conocido indicado por Larian).',
          verify("Baldur's Gate 3"),
          'En el lanzador, cambia entre DirectX 11 y Vulkan y vuelve a probar.',
        ],
      },
      {
        id: 'direct-exe',
        title: 'Omite el lanzador y ejecuta el .exe como administrador',
        summary:
          'Cierra Steam o GOG GALAXY e inicia el juego desde la carpeta bin.',
        time: 'Unos 3 min',
        actions: [
          'Cierra Steam (o GOG GALAXY).',
          String.raw`Abre «…\SteamApps\common\Baldurs Gate 3\bin» (o en Steam: clic derecho en el juego → Administrar → Ver archivos locales).`,
          'Haz clic derecho en bg3.exe (Vulkan) o bg3_dx11.exe (DirectX 11) → Ejecutar como administrador.',
          'Larian también sugiere mantener pulsada la tecla Mayús tras el clic derecho, elegir Ejecutar como administrador y seguir pulsándola hasta que aparezca la pantalla de inicio.',
        ],
        note: 'Si aparece un error de DLL de Visual C++, instala el paquete redistribuible de Visual C++ de 64 bits más reciente de Microsoft.',
      },
      {
        id: 'remove-mods',
        title: 'Quita del todo los mods antiguos',
        summary:
          'Los archivos de mods de un parche anterior pueden cerrar el juego al iniciar.',
        time: 'Unos 5 min',
        actions: [
          'Cierra el juego y el lanzador.',
          String.raw`Pega «%LocalAppData%\Larian Studios\Baldur's Gate 3\Mods» en la barra de direcciones del Explorador y mueve su contenido a otro lugar.`,
          String.raw`Si en la carpeta de instalación «…\Baldurs Gate 3\Data» hay carpetas «Mods» o «Public», muévelas también (Larian indica que se pueden borrar sin problema).`,
          'Comprueba si el juego inicia sin mods.',
        ],
      },
      {
        id: 'reset-profile',
        title:
          'Cambia el nombre de la carpeta del perfil para que se vuelva a crear',
        summary:
          'El juego crea de nuevo las carpetas de partidas, ajustes y caché. Al renombrar, puedes deshacerlo.',
        time: 'Unos 5 min',
        actions: [
          String.raw`Primero, borra el contenido de «%LocalAppData%\Larian Studios\Baldur's Gate 3\LevelCache» y vuelve a probar (oficial).`,
          String.raw`Si no funciona, abre «%LocalAppData%\Larian Studios» y cambia el nombre de la carpeta «Baldur's Gate 3» (por ejemplo, añade _old al final).`,
          'Si ahora inicia, comprueba que puedes empezar una partida nueva, guardar y cargar.',
          'Para recuperar tus partidas, borra la carpeta nueva y devuelve su nombre original a la antigua.',
        ],
        note: 'Con Steam Cloud activado, Steam puede descargar tus datos de la nube al iniciar. Larian sugiere desactivar Steam Cloud para este juego temporalmente si hace falta.',
      },
    ],
    avoid: [
      'No borres la carpeta del perfil: cámbiale el nombre. Contiene tus partidas.',
      'No pruebes el multijugador si los jugadores tienen mods o versiones de mods distintas.',
    ],
    cautions: [
      'Si sigue cerrándose, Larian pide un informe de DxDiag (Windows + R → «dxdiag» → Guardar toda la información), además de gold.log y los volcados de error de la carpeta bin.',
    ],
    faqs: [
      {
        question: '¿Juego con DirectX 11 o con Vulkan?',
        answer:
          'Si uno no inicia, Larian recomienda probar el otro. Usa el que arranque y funcione de forma estable en tu PC.',
      },
      {
        question: '¿Dónde están mis partidas?',
        answer: String.raw`Las partidas, los ajustes y la caché de niveles están en %LocalAppData%\Larian Studios\Baldur's Gate 3 (oficial).`,
      },
    ],
    sources: [
      {
        label:
          'Microsoft: protección contra virus y amenazas (riesgos de las exclusiones)',
        url: 'https://support.microsoft.com/en-us/windows/security/threat-malware-protection/virus-and-threat-protection-in-the-windows-security-app',
      },
      {
        label: 'Soporte de Larian: Crashing upon startup (PC) (en inglés)',
        url: 'https://larian.com/support/faqs/crashing-upon-startup-pc_59',
      },
      {
        label: 'Soporte de Larian: The Larian Launcher is crashing (en inglés)',
        url: 'https://larian.com/support/faqs/the-larian-launcher-is-crashing_63',
      },
      {
        label: 'Soporte oficial de Baldur’s Gate 3 (en inglés)',
        url: 'https://baldursgate3.game/support',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'helldivers-2',
    slug: 'gameguard-error-114',
    title: 'Error 114 de GameGuard en HELLDIVERS 2 (PC): cómo solucionarlo',
    shortTitle: 'Error 114 de GameGuard',
    description:
      '¿HELLDIVERS 2 no inicia por el error 114 de nProtect GameGuard? Guía basada en las recomendaciones de Arrowhead: administrador y modo de compatibilidad, reinstalar GameGuard, cerrar utilidades y revisar las alertas de seguridad.',
    lead: 'Guía basada en Arrowhead para cuando nProtect GameGuard muestra el error 114 y el juego no se inicia (versión de Steam).',
    summary:
      'El soporte de Arrowhead indica cinco soluciones: ejecutar el juego como administrador (y en modo de compatibilidad con Windows 8 en Windows 11), desinstalar y reinstalar GameGuard, cerrar programas de utilidades, revisar el antivirus y los discos duros antiguos. Esta guía mantiene activa la protección y remite las detecciones al proveedor. No desconectes hardware interno con el equipo encendido; consulta al fabricante o a un técnico si tienes dudas.',
    quickFacts: [
      {
        label: 'Abrir la carpeta del juego',
        value:
          'Steam: clic derecho en el juego → Administrar → Ver archivos locales',
      },
      {
        label: 'Ejecutable del juego',
        value: '«helldivers2» en la carpeta bin',
      },
      {
        label: 'Reinstalar GameGuard',
        value:
          'Ejecuta como administrador «gguninst» y después «GGSetup», en la carpeta tools',
      },
      {
        label: 'En Windows 11',
        value: 'Activa también la compatibilidad con Windows 8 (oficial)',
      },
    ],
    diagnosis: [
      {
        symptom: 'El error 114 aparece siempre',
        cause: 'Permisos o compatibilidad',
        stepId: 'run-as-admin',
      },
      {
        symptom: 'El error 114 aparece incluso como administrador',
        cause: 'Instalación de GameGuard dañada',
        stepId: 'reinstall-gameguard',
      },
      {
        symptom: 'Solo ocurre con ciertos programas abiertos',
        cause: 'Una utilidad o el antivirus interfieren',
        stepId: 'utilities',
      },
    ],
    steps: [
      {
        id: 'run-as-admin',
        title:
          'Ejecuta helldivers2 como administrador (y en compatibilidad en Windows 11)',
        summary: 'Es la primera solución de la lista de Arrowhead.',
        time: 'Unos 3 min',
        actions: [
          'En la biblioteca de Steam, haz clic derecho en HELLDIVERS 2 → Administrar → Ver archivos locales.',
          'Abre la carpeta «bin», haz clic derecho en «helldivers2» → Propiedades → pestaña Compatibilidad.',
          'Marca «Ejecutar este programa como administrador».',
          'En Windows 11, marca también «Ejecutar este programa en modo de compatibilidad para» y elige Windows 8.',
          'Pulsa Aceptar e inicia el juego desde Steam.',
        ],
        note: 'Si causa otros problemas, desmarca las casillas para deshacerlo.',
      },
      {
        id: 'reinstall-gameguard',
        title: 'Desinstala y reinstala GameGuard',
        summary: 'Usa las herramientas de GameGuard incluidas con el juego.',
        time: 'Unos 5 min',
        actions: [
          'Abre la carpeta del juego como en el paso 1.',
          'En la carpeta «tools», haz clic derecho en «gguninst» → Ejecutar como administrador.',
          'Cuando termine, haz clic derecho en «GGSetup» en la misma carpeta → Ejecutar como administrador.',
          'Reinicia el PC e inicia el juego.',
        ],
      },
      {
        id: 'utilities',
        title:
          'Cierra utilidades una por una y revisa las alertas de seguridad',
        summary:
          'Arrowhead explica que el error 114 puede aparecer con programas que no son trampas.',
        time: 'Unos 10 min',
        actions: [
          'Cierra de uno en uno superposiciones, herramientas de macros, programas de iluminación RGB y de monitorización, y comprueba si el juego inicia.',
          'Mantén activa la protección. Si detecta un archivo oficial de GameGuard o HELLDIVERS 2, anota el nombre de la detección y la ruta y consulta al proveedor de seguridad o a Arrowhead antes de excluirlo o restaurarlo desde cuarentena. No excluyas carpetas enteras automáticamente.',
          'Arrowhead también menciona discos antiguos. No desconectes hardware interno con el equipo encendido. Si no sabes qué disco está afectado o si contiene datos necesarios, consulta primero al fabricante o a un técnico.',
        ],
        note: 'Si descubres qué programa lo provoca, Arrowhead pide a los jugadores que informen de su nombre.',
      },
    ],
    avoid: [
      'No desactives la protección ni añadas exclusiones solo para iniciar el juego.',
      'No uses herramientas de modificación ni trampas; el antitrampas reaccionará.',
    ],
    cautions: [
      'Si nada de esto funciona, contacta con el soporte de Arrowhead.',
    ],
    faqs: [
      {
        question: 'Solo uso Windows Defender. ¿También necesito una excepción?',
        answer:
          'No automáticamente. Arrowhead menciona excepciones, pero los archivos excluidos dejan de analizarse en tiempo real. Mantén activa la protección y consulta al proveedor de seguridad o a Arrowhead para confirmar si la detección corresponde a un archivo oficial.',
      },
      {
        question: '¿Reinstalar GameGuard borra mi progreso?',
        answer:
          'Reinstalar GameGuard solo reinstala el antitrampas de la carpeta del juego. Los pasos de Arrowhead no incluyen borrar datos de partida.',
      },
    ],
    sources: [
      {
        label:
          'Microsoft: protección contra virus y amenazas (riesgos de las exclusiones)',
        url: 'https://support.microsoft.com/en-us/windows/security/threat-malware-protection/virus-and-threat-protection-in-the-windows-security-app',
      },
      {
        label:
          'Soporte de Arrowhead: error 114 al iniciar HELLDIVERS 2 (en inglés)',
        url: 'https://arrowhead.zendesk.com/hc/en-us/articles/14732747845020-I-receive-Error-114-when-attempting-to-launch-HELLDIVERS-2',
      },
      {
        label: 'Tienda de Steam: HELLDIVERS 2',
        url: 'https://store.steampowered.com/app/553850/',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'hogwarts-legacy',
    slug: 'crash',
    title:
      'Hogwarts Legacy se cierra o no inicia en PC: solución de problemas oficial',
    shortTitle: 'Se cierra o no inicia',
    description:
      '¿Hogwarts Legacy se cierra en PC? Deshaz los cambios en Engine.ini y los mods, y sigue la guía de WB Games: controladores, Windows Update, overclock, verificación de archivos, gráficos y antivirus.',
    lead: 'Los pasos del soporte de WB Games (Portkey Games) cuando la versión de Steam se cierra al iniciar, vuelve al escritorio o se queda colgada al cargar.',
    summary:
      'El soporte oficial revisa, en este orden: actualizar los controladores de vídeo y sonido, ejecutar Windows Update (que actualiza DirectX), devolver a fábrica los componentes con overclock, verificar los archivos, bajar los ajustes gráficos y revisar la seguridad y cerrar programas innecesarios. El soporte también menciona excepciones, pero esta guía mantiene activa la protección y recomienda consultar las detecciones con el proveedor de seguridad. Si editaste Engine.ini o instalaste mods, deshazlo primero.',
    quickFacts: [
      {
        label: 'Ubicación de las partidas',
        value: String.raw`%LOCALAPPDATA%\Hogwarts Legacy\Saved\SaveGames`,
        copy: true,
      },
      {
        label: 'Ubicación de la configuración',
        value: String.raw`%LOCALAPPDATA%\Hogwarts Legacy\Saved\Config\WindowsNoEditor`,
        copy: true,
      },
      {
        label: 'Actualizar DirectX',
        value: 'Mediante Windows Update (oficial)',
      },
      {
        label: 'Si sigue cerrándose',
        value: 'Busca, vota o amplía informes en la web oficial de errores',
      },
    ],
    diagnosis: [
      {
        symptom: 'Se cierra desde que editaste Engine.ini o añadiste mods',
        cause: 'Cambios de configuración o mods',
        stepId: 'undo-changes',
      },
      {
        symptom: 'Hace tiempo que no actualizas controladores o Windows',
        cause: 'Controlador o DirectX desactualizados',
        stepId: 'drivers-windows',
      },
      {
        symptom: 'El juego inicia pero se cierra en ciertos lugares',
        cause: 'Archivos dañados o ajustes gráficos',
        stepId: 'verify-settings',
      },
      {
        symptom: 'El antivirus mostró un aviso',
        cause: 'Archivos del juego en cuarentena',
        stepId: 'background-apps',
      },
    ],
    steps: [
      {
        id: 'undo-changes',
        title: 'Deshaz los cambios en Engine.ini y retira los mods',
        summary:
          'La guía oficial da por hecho un juego sin modificar, así que restáuralo primero.',
        time: 'Unos 5 min',
        actions: [
          String.raw`Abre «%LOCALAPPDATA%\Hogwarts Legacy\Saved\Config\WindowsNoEditor». Si editaste Engine.ini, restaura el original o mueve el archivo editado a otro lugar.`,
          'Si instalaste mods, saca sus archivos de la carpeta del juego.',
          'Inicia el juego y comprueba si sigue cerrándose.',
        ],
      },
      {
        id: 'drivers-windows',
        title: 'Actualiza los controladores de vídeo y sonido, y Windows',
        summary:
          'DirectX se actualiza con Windows Update; los controladores, desde el fabricante.',
        time: '10–20 min',
        actions: [
          'Instala el controlador gráfico más reciente de NVIDIA, AMD, Intel o del fabricante de tu PC.',
          'Busca un controlador de sonido más reciente en la web del fabricante de tu PC o placa base.',
          'Ve a Configuración → Windows Update → Buscar actualizaciones.',
          'Si la CPU o la GPU tienen overclock (incluidas las herramientas de «turbo boost»), vuelve a los valores del fabricante (oficial).',
        ],
      },
      {
        id: 'verify-settings',
        title: 'Verifica los archivos y baja los ajustes gráficos',
        summary:
          'Descarta primero los archivos dañados y después la carga de los gráficos.',
        time: '10–20 min',
        actions: [
          verify('Hogwarts Legacy'),
          'Elige un preajuste gráfico más bajo en el juego y comprueba si sigue cerrándose en el mismo lugar.',
          'Si continúa, desinstala y vuelve a instalar el juego. Las partidas se guardan en otra carpeta, pero cópialas antes por si acaso.',
        ],
      },
      {
        id: 'background-apps',
        title:
          'Revisa las alertas de seguridad y cierra programas innecesarios uno por uno',
        summary:
          'Comprueba si hay archivos en cuarentena o conflictos con otros programas. El arranque limpio es solo una prueba temporal.',
        time: 'Unos 10 min',
        actions: [
          'Mantén activa la protección y anota la detección y la ruta del archivo en el historial de cuarentena. No restaures archivos ni excluyas la carpeta entera solo para iniciar el juego; consulta antes al proveedor de seguridad o a WB Games.',
          'Cierra todos los programas que puedas antes de iniciar el juego.',
          'Si sigue cerrándose, haz un arranque limpio siguiendo las instrucciones de Microsoft para comparar y, al terminar, vuelve a un inicio normal de Windows.',
        ],
        note: 'WB Games advierte que un arranque limpio mal hecho puede afectar al inicio del PC, así que sigue exactamente los pasos de Microsoft.',
      },
    ],
    avoid: [
      'No borres la carpeta de partidas; cópiala antes de reinstalar.',
      'No sigas usando Windows en modo de arranque limpio.',
    ],
    cautions: [
      'Si nada funciona, WB Games sugiere buscar un informe parecido en la web de errores de Hogwarts Legacy y votarlo o añadir capturas.',
    ],
    faqs: [
      {
        question:
          'Mi PC cumple los requisitos mínimos, pero el juego se sigue cerrando.',
        answer:
          'El soporte oficial explica que los ajustes de mayor calidad pueden afectar al rendimiento y la estabilidad aunque el PC cumpla los requisitos. Prueba con ajustes gráficos más bajos.',
      },
      {
        question: '¿Cómo actualizo DirectX?',
        answer:
          'DirectX se actualiza mediante Windows Update: Configuración → Windows Update → Buscar actualizaciones.',
      },
    ],
    sources: [
      {
        label:
          'Microsoft: protección contra virus y amenazas (riesgos de las exclusiones)',
        url: 'https://support.microsoft.com/en-us/windows/security/threat-malware-protection/virus-and-threat-protection-in-the-windows-security-app',
      },
      {
        label:
          'Soporte de Portkey Games: PC Troubleshooting (Steam) (en inglés)',
        url: 'https://portkeygamessupport.wbgames.com/hc/en-us/articles/10765467342099-PC-Troubleshooting-Steam',
      },
      {
        label: 'Soporte de Portkey Games: Hogwarts Legacy (en inglés)',
        url: 'https://portkeygamessupport.wbgames.com/hc/en-us/categories/360004524734-Hogwarts-Legacy',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'gta-v-enhanced',
    slug: 'story-save-migration',
    title:
      'Cómo pasar tu partida del modo historia de GTA V Legacy a Enhanced (PC)',
    shortTitle: 'Pasar la partida del modo historia',
    description:
      'Pasa tu progreso del modo historia de GTA V Legacy a Enhanced en PC: sube una partida en Legacy y descárgala en Enhanced. Una vez por cuenta, 90 días, solo PC — pasos oficiales de Rockstar.',
    lead: 'Para quienes empezaron el modo historia en GTA V Legacy y quieren continuar en GTA V Enhanced, con el proceso oficial de Rockstar.',
    summary:
      'En GTA V Legacy, abre el menú de pausa y elige Game → Upload Save Game. Después, en GTA V Enhanced, descárgala desde la pestaña Story de la página de inicio o desde el menú de pausa en Game → Download Save Game. Cada cuenta solo puede hacerlo una vez, y es definitivo al descargar.',
    quickFacts: [
      {
        label: 'Número de traspasos',
        value: 'Uno por cuenta (definitivo al descargar)',
      },
      {
        label: 'La subida está disponible',
        value: '90 días (después hay que volver a subirla)',
      },
      {
        label: 'Plataformas',
        value: 'Solo de PC a PC; no entre PC y consolas',
      },
      {
        label: 'Partidas de Enhanced',
        value: String.raw`%USERPROFILE%\Documents\Rockstar Games\GTAV Enhanced\Profiles`,
        copy: true,
      },
    ],
    diagnosis: [
      {
        symptom: 'Upload Save Game no está disponible o falla',
        cause: 'Vinculación de la cuenta',
        stepId: 'link-account',
      },
      {
        symptom: 'No sabes qué partida enviar',
        cause: 'Solo se puede subir una partida',
        stepId: 'upload-save',
      },
      {
        symptom: 'La página de inicio de Enhanced no ofrece el traspaso',
        cause: 'Enhanced ya tiene una partida del modo historia',
        stepId: 'download-save',
      },
    ],
    steps: [
      {
        id: 'link-account',
        title: 'Comprueba que tu cuenta de Rockstar Games está vinculada',
        summary:
          'El traspaso se hace a través de la cuenta de Rockstar Games con la que inicias sesión.',
        time: 'Unos 3 min',
        actions: [
          'Asegúrate de usar la misma cuenta de Rockstar Games en Legacy y en Enhanced.',
          'Asegúrate de que esa cuenta está vinculada a la cuenta de la plataforma de PC en la que juegas (por ejemplo, Steam).',
        ],
        note: 'Algunos perfiles no se pueden traspasar, por ejemplo por suspensión o bloqueo de la cuenta, o por tener un progreso ilegítimo o insuficiente (oficial).',
      },
      {
        id: 'upload-save',
        title: 'Sube tu partida desde GTA V Legacy',
        summary:
          'Solo se puede subir una partida, así que elige la que quieras conservar.',
        time: 'Unos 5 min',
        actions: [
          'Inicia GTA V Legacy en tu PC y abre el menú de pausa en el modo historia.',
          'Elige Game → Upload Save Game.',
          'Selecciona la partida que quieres pasar y confírmala en la pantalla de aviso.',
          'Espera al mensaje que confirma que la subida ha terminado.',
        ],
        note: 'Hasta que la descargues en Enhanced, puedes subir otra partida para sustituirla las veces que quieras. Lo que juegues en Legacy después de subirla no se sincroniza.',
      },
      {
        id: 'download-save',
        title: 'Descarga la partida en GTA V Enhanced',
        summary:
          'Usa la pestaña Story de la página de inicio o el menú de pausa. Al descargarla, el traspaso queda hecho.',
        time: 'Unos 5 min',
        actions: [
          'Si Enhanced aún no tiene partidas del modo historia: en la página de inicio, elige la pestaña Story y confirma la descarga.',
          'Si Enhanced ya tiene partidas del modo historia: abre el menú de pausa en el modo historia → Game → Download Save Game → elige la partida y confirma.',
          'Cuando termine la descarga, el juego cargará la partida automáticamente.',
        ],
        note: 'Después de descargarla, esa cuenta ya no podrá hacer más traspasos del modo historia. Comprueba antes que subiste la partida correcta.',
      },
    ],
    avoid: [
      'No la descargues en Enhanced hasta estar seguro de que subiste la partida correcta: solo hay un traspaso.',
      'No dejes pasar más de 90 días desde la subida.',
    ],
    cautions: [
      'Según el tamaño de la partida y la carga de los servidores, el traspaso puede tardar (oficial).',
      'Los nombres de los menús están en inglés; en español pueden variar ligeramente.',
    ],
    faqs: [
      {
        question:
          '¿Puedo pasar a PC una partida del modo historia de PS5 o Xbox?',
        answer:
          'No. El soporte de Rockstar indica que el traspaso de Legacy a Enhanced solo funciona dentro de PC; no se admiten traspasos entre PC y consolas.',
      },
      {
        question: '¿Se pasará lo que juegue en Legacy después?',
        answer:
          'No. El progreso del modo historia que hagas en Legacy después del traspaso no se sincroniza con Enhanced (oficial).',
      },
      {
        question: '¿Puedo cambiar la partida que subí?',
        answer:
          'Sí, hasta que la descargues en Enhanced: sube otra partida desde Legacy para sustituirla. Después de descargarla ya no se puede cambiar.',
      },
    ],
    sources: [
      {
        label:
          'Soporte de Rockstar: migrar la partida del modo historia de GTAV Legacy a Enhanced en PC (en inglés)',
        url: 'https://support.rockstargames.com/articles/mmRgMVfuQC3xNzXK4Cq9b/migrating-your-story-mode-save-from-grand-theft-auto-v-legacy-to-grand-theft',
      },
      {
        label: 'Soporte de Rockstar: Grand Theft Auto V (en inglés)',
        url: 'https://support.rockstargames.com/gta-v',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'skyrim-special-edition',
    slug: 'skse-after-update',
    title: 'SKSE no funciona tras actualizar Skyrim: cómo solucionarlo (PC)',
    shortTitle: 'SKSE falla tras una actualización',
    description:
      '¿Skyrim no inicia con SKSE tras una actualización? Comprueba la versión del juego, instala la versión de SKSE correspondiente y retira los plugins de SKSE hasta que tus mods se actualicen, según el sitio oficial de SKSE.',
    lead: 'Para las versiones de Steam y GOG: tras una actualización de Skyrim, el juego no inicia con SKSE o se cierra nada más abrirse.',
    summary:
      'Cada versión de SKSE es compatible con una versión concreta del juego. Tras una actualización, instala la versión correspondiente desde el sitio oficial de SKSE. Si después de un parche el juego sigue cerrándose al iniciar, el equipo de SKSE recomienda retirar los archivos de Data/SKSE/Plugins y volver a probar, porque los mods que usan plugins suelen necesitar también una actualización.',
    quickFacts: [
      {
        label: 'Versiones compatibles',
        value: 'Steam y GOG (no Game Pass ni Epic)',
      },
      {
        label: 'Se cierra tras un parche',
        value:
          'Retira los archivos de Data/SKSE/Plugins y vuelve a probar (equipo de SKSE)',
      },
      {
        label: 'Registros para pedir ayuda',
        value:
          'skse.log, skse_loader.log y skse_steam_loader.log (en My Games)',
      },
      {
        label: 'Ubicación de las partidas',
        value: String.raw`%USERPROFILE%\Documents\My Games\Skyrim Special Edition\Saves`,
        copy: true,
      },
    ],
    diagnosis: [
      {
        symptom:
          'El cargador de SKSE avisa de que tu versión del juego no es compatible',
        cause: 'SKSE no corresponde a la nueva versión del juego',
        stepId: 'check-version',
      },
      {
        symptom: 'SKSE está actualizado, pero el juego se cierra al instante',
        cause: 'Mods con plugins aún no compatibles',
        stepId: 'plugins-off',
      },
      {
        symptom: 'El juego no inicia ni siquiera sin SKSE',
        cause: 'Un problema del propio juego',
        stepId: 'vanilla-check',
      },
    ],
    steps: [
      {
        id: 'vanilla-check',
        title: 'Comprueba si el juego inicia sin SKSE',
        summary:
          'El equipo de SKSE pide confirmar que el juego funciona bien sin SKSE antes de contactarles.',
        time: 'Unos 5 min',
        actions: [
          'Copia antes la carpeta de partidas en otro lugar.',
          'Inicia «The Elder Scrolls V: Skyrim Special Edition» sin el cargador de SKSE por la vía normal de tu edición: Steam para la edición de Steam o el inicio normal de GOG para la edición de GOG.',
          'Si la edición de Steam no inicia: ' +
            verify('The Elder Scrolls V: Skyrim Special Edition'),
        ],
        note: 'La verificación también restaura los archivos del juego que hayan sustituido los mods. Si usas un gestor de mods, revisa también sus instrucciones.',
      },
      {
        id: 'check-version',
        title: 'Instala la versión de SKSE que corresponde a tu juego',
        summary:
          'Steam y GOG tienen compilaciones distintas de SKSE, cada una para una versión concreta del juego. Comprueba tanto la tienda como la versión.',
        time: 'Unos 10 min',
        actions: [
          'En la carpeta del juego (Steam: clic derecho → Administrar → Ver archivos locales), haz clic derecho en «SkyrimSE.exe» → Propiedades → Detalles y anota la versión del archivo.',
          'En el sitio oficial de SKSE (skse.silverlock.org), busca la versión para esa versión del juego: la de Anniversary Edition para Steam y la de GOG para GOG.',
          'Reinstala SKSE siguiendo las instrucciones del sitio.',
          'Si aún no hay una versión para tu versión del juego, espera a que se actualice SKSE.',
        ],
        note: 'Sigue el enlace de descarga y las instrucciones incluidas de la compilación SE/AE que elegiste en el sitio oficial. Puedes extraer archivos 7z con 7-Zip. No confundas «Install via Steam» ni el instalador de la versión classic con un método de instalación de SE/AE.',
      },
      {
        id: 'plugins-off',
        title:
          'Retira los plugins de SKSE y vuelve a añadir los mods actualizados',
        summary:
          'Tras una actualización del juego, los mods que usan plugins de SKSE también pueden necesitar una actualización.',
        time: 'Unos 10 min',
        actions: [
          String.raw`Mueve a otro lugar el contenido de «Data\SKSE\Plugins» en la carpeta del juego (con un gestor de mods, desactiva los mods que incluyen plugins).`,
          'Comprueba si el juego inicia con el cargador de SKSE.',
          'Si inicia, busca en la página de cada mod una versión compatible con la nueva versión del juego y añádelos de uno en uno.',
        ],
      },
    ],
    avoid: [
      'Haz copia de las partidas antiguas antes de sobrescribirlas; una partida guardada sin tus mods puede no tener vuelta atrás.',
      'No descargues SKSE de sitios no oficiales.',
    ],
    cautions: [
      'Si contactas con el equipo de SKSE, adjunta skse.log, skse_loader.log y skse_steam_loader.log de la carpeta SKSE en My Games (consejo oficial).',
      'Las versiones citadas eran correctas al revisarlas. Consulta el sitio oficial de SKSE para ver el estado actual.',
    ],
    faqs: [
      {
        question: '¿SKSE funciona con la versión de Game Pass o de Epic?',
        answer:
          'No. El sitio oficial de SKSE indica que las versiones de Windows Store/Game Pass y de Epic Games Store no son compatibles.',
      },
      {
        question: '¿Puedo quedarme en una versión antigua del juego?',
        answer:
          'El sitio de SKSE mantiene una versión para quienes volvieron a la 1.5.97, pero recomienda la de Anniversary Edition para la versión actual de Steam.',
      },
    ],
    sources: [
      {
        label: 'Sitio oficial de Skyrim Script Extender (SKSE) (en inglés)',
        url: 'https://skse.silverlock.org/',
      },
      {
        label: 'Tienda de Steam: The Elder Scrolls V: Skyrim Special Edition',
        url: 'https://store.steampowered.com/app/489830/',
      },
    ],
  },
  {
    ...base,
    gameSlug: 'stardew-valley',
    slug: 'save-restore',
    title:
      'Dónde están las partidas de Stardew Valley y cómo recuperar una perdida o dañada (PC)',
    shortTitle: 'Ubicación y recuperación de partidas',
    description:
      'Dónde guarda Stardew Valley las partidas en PC y cómo recuperar una que desapareció o no carga: quitar _STARDEWVALLEYSAVETMP, deshacer el último guardado, restaurar copias de SMAPI o una partida sobrescrita por Steam Cloud.',
    lead: 'Para quien busca la carpeta de partidas, ha perdido una partida de la lista, no consigue cargarla o quiere volver un día atrás.',
    summary: String.raw`Las partidas están en «%appdata%\StardewValley\Saves», una carpeta «NombreGranja_número» por granja. Si una partida falta o no carga, prueba en este orden: quitar «_STARDEWVALLEYSAVETMP» de los nombres, deshacer el último guardado con los archivos _old y restaurar una copia de SMAPI. Copia la carpeta entera antes de cambiar nada.`,
    quickFacts: [
      {
        label: 'Ubicación de las partidas',
        value: String.raw`%appdata%\StardewValley\Saves`,
        copy: true,
      },
      {
        label: 'Archivos necesarios',
        value:
          'El archivo «NombreGranja_número» y SaveGameInfo (mantén la carpeta completa)',
      },
      {
        label: 'Cuándo se guarda',
        value:
          'Solo al terminar el día en el juego (al dormir, al desmayarte o a las 2 de la madrugada)',
      },
      {
        label: 'Copias de SMAPI',
        value: '«save-backups» en la carpeta del juego (hasta 10 días)',
      },
    ],
    diagnosis: [
      {
        symptom: 'Los nombres de archivo terminan en «_STARDEWVALLEYSAVETMP»',
        cause: 'Un guardado se interrumpió',
        stepId: 'tmp-name',
      },
      {
        symptom: 'El juego se cierra al cargar o quieres volver un día atrás',
        cause: 'Un problema con el último guardado',
        stepId: 'undo-save',
      },
      {
        symptom: 'La carpeta de la partida ha desaparecido (usas SMAPI)',
        cause: 'Archivos borrados o dañados',
        stepId: 'smapi-backup',
      },
      {
        symptom: 'Faltan días que ya habías jugado',
        cause: 'Steam Cloud sustituyó la partida por una copia anterior',
        stepId: 'cloud-overwrite',
      },
    ],
    steps: [
      {
        id: 'open-backup',
        title: 'Abre la carpeta de partidas y haz una copia',
        summary:
          'Copia el estado actual antes de intentar cualquier recuperación.',
        time: 'Unos 2 min',
        actions: [
          'Cierra el juego.',
          String.raw`Pulsa Windows + R, escribe «%appdata%\StardewValley\Saves» y pulsa Aceptar.`,
          'Haz clic derecho en la carpeta «NombreGranja_número», comprímela en un ZIP y guárdala en otro lugar, como el escritorio.',
        ],
        note: 'No guardes copias dentro de la carpeta Saves: el juego intentará cargarlas (wiki oficial).',
      },
      {
        id: 'tmp-name',
        title: 'Quita «_STARDEWVALLEYSAVETMP» de los nombres de archivo',
        summary: 'Es la primera solución que indica la wiki oficial.',
        time: 'Unos 3 min',
        actions: [
          'Abre la carpeta de la partida y busca archivos con «_STARDEWVALLEYSAVETMP» en el nombre.',
          'Quita esa parte del nombre e inicia el juego.',
          'Si el nombre vuelve a cambiar cada vez, abre en Steam las Propiedades de Stardew Valley (icono del engranaje) → General, desactiva la sincronización con Steam Cloud y vuelve a corregir los nombres.',
          'Comprueba también que el nombre de la carpeta coincide exactamente con el del archivo «NombreGranja_número».',
        ],
      },
      {
        id: 'undo-save',
        title: 'Deshaz el último guardado con los archivos _old',
        summary:
          'Si la carpeta tiene dos archivos que terminan en «_old», puedes volver un día atrás.',
        time: 'Unos 3 min',
        actions: [
          'Comprueba que la carpeta contiene «SaveGameInfo_old» y «NombreGranja_número_old» (si no, este paso no sirve).',
          'Asegúrate de tener la copia del paso 1.',
          'Borra «SaveGameInfo» y «NombreGranja_número» (los archivos sin _old).',
          'Quita «_old» del nombre de «SaveGameInfo_old» y de «NombreGranja_número_old».',
        ],
      },
      {
        id: 'smapi-backup',
        title: 'Restaura una copia de SMAPI',
        summary:
          'Si tienes SMAPI instalado, su mod SaveBackup guarda hasta 10 copias diarias.',
        time: 'Unos 5 min',
        actions: [
          'Abre la carpeta del juego (Steam: clic derecho → Administrar → Ver archivos locales).',
          'Abre «save-backups» y descomprime el ZIP más reciente que contenga tu partida.',
          'Copia la carpeta de la partida que hay dentro en tu carpeta Saves.',
        ],
      },
      {
        id: 'cloud-overwrite',
        title: 'Si Steam Cloud sobrescribió tu partida',
        summary:
          'Para cuando tienes una copia, pero el juego vuelve una y otra vez a una copia anterior de la nube.',
        time: 'Unos 3 min',
        actions: [
          'Inicia el juego, pero no cargues todavía ninguna partida.',
          'Con el juego abierto, borra la carpeta de la partida en Saves y vuelve a poner tu copia.',
          'Carga la partida en el juego. Como cambió con el juego abierto, la nube la considera la versión más reciente (wiki oficial).',
        ],
      },
    ],
    avoid: [
      'No borres ni cambies el nombre de ningún archivo antes de hacer una copia.',
      'No guardes copias dentro de la carpeta Saves.',
      'Evita los editores automáticos de partidas: la wiki oficial advierte que a menudo las estropean.',
    ],
    cautions: [
      'Las partidas multijugador solo se guardan en el PC del anfitrión (wiki oficial).',
      'Una versión antigua del juego no puede cargar una partida guardada con una versión más nueva.',
    ],
    faqs: [
      {
        question: 'Salí a mitad del día y perdí el progreso.',
        answer:
          'Stardew Valley solo guarda al terminar el día en el juego (al irte a dormir, al desmayarte por agotamiento o a las 2 de la madrugada). Si sales antes, se pierde lo jugado ese día (wiki oficial).',
      },
      {
        question:
          'Tengo el juego en Steam y en GOG. ¿Las partidas son distintas?',
        answer:
          'En PC, las partidas se guardan aparte del juego y se comparten entre copias de distintas tiendas, como Steam y GOG (wiki oficial).',
      },
      {
        question: 'Mi partida no carga después de quitar los mods.',
        answer:
          'La wiki oficial indica que algunas partidas con mods no cargan en el juego sin modificar. Reinstala SMAPI y juega un día: SMAPI elimina el contenido personalizado de la partida (los objetos personalizados del inventario pueden convertirse en objetos de error).',
      },
    ],
    sources: [
      {
        label: 'Wiki oficial de Stardew Valley: Saves (en inglés)',
        url: 'https://stardewvalleywiki.com/Saves',
      },
      {
        label: 'Tienda de Steam: Stardew Valley',
        url: 'https://store.steampowered.com/app/413150/',
      },
    ],
  },
];
