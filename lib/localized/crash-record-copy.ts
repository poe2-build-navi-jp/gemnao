export const crashRecordCopy = {
  zh: {
    title: '日志与诊断结果：三个阅读示例',
    note: '仅用于说明，不是真实游戏事故、测量结果或截图。SampleGame.exe 与 OtherApp.exe 是虚构名称。比较的是同一天、同一时区的时间。',
    where:
      '可靠性历史中查看时间与应用名称；事件查看器中查看常规信息里的故障应用、模块和异常代码。诊断工具需核对选中的游戏 EXE、采集时间范围及观察到的错误或无响应。不同 Windows 版本与界面的字段名可能不同。',
    read: '比较字段（示例）',
    know: '可以知道什么，以及不能断定什么',
    next: '下一项检查',
    cases: [
      {
        title: '1. 游戏名与时间一致',
        fields: [
          ['个人记录', 'SampleGame.exe 在 20:15 关闭'],
          ['日志时间与应用', '20:15 / SampleGame.exe'],
          ['事件', 'Application Error / 1000'],
        ],
        meaning:
          '这是与游戏退出有关的候选记录。名称和时间一致也不能确定原因，不能只凭模块名或异常代码更换 DLL 或认定驱动故障。',
        href: '/zh/guide/pc-game-crash#crash-timing',
        link: '按崩溃时机选择一项比较',
      },
      {
        title: '2. 同时刻的错误属于其他应用',
        fields: [
          ['个人记录', 'SampleGame.exe 在 20:15 关闭'],
          ['日志时间与应用', '20:15 / OtherApp.exe'],
        ],
        meaning:
          '时间接近但应用不符，不能用这一条解释游戏崩溃。确认选择的是游戏 EXE 而非启动器，再寻找相符记录。',
        href: '/zh/guide/pc-game-crash#crash-history',
        link: '在 Windows 崩溃历史中核对目标应用',
      },
      {
        title: '3. 没有找到匹配记录',
        fields: [
          ['个人记录', '游戏在 20:15 关闭'],
          ['检查范围', '20:10–20:20 / 匹配游戏记录 0 条'],
        ],
        meaning:
          '只表示这个范围内未找到匹配记录，不证明正常或已修复。区分采集失败、EXE 选错、时间范围错误和记录延迟。读取错误不等于结果为零。',
        href: '/en/tools/windows-diagnosis#use',
        link: '核对游戏 EXE 和采集范围（英文）',
      },
    ],
    stop: '没有日志时仍可记录时间、退出方式和测试的一项改动。电脑整体不稳定或疑似存档损坏时，不要反复复现。分享前去除用户名、电脑名与完整路径，不要直接公开原始日志。',
    source: '来源：Microsoft Learn — 应用崩溃事件的阅读方法（英文）',
  },
  es: {
    title: 'Cómo leer registros y resultados: tres ejemplos',
    note: 'Solo son ejemplos ilustrativos, no incidentes reales, mediciones ni capturas. SampleGame.exe y OtherApp.exe son nombres ficticios. Compara horas del mismo día y zona horaria.',
    where:
      'En el Monitor de confiabilidad, comprueba hora y aplicación. En el Visor de eventos, lee aplicación, módulo y código de excepción en General. En la herramienta de diagnóstico, compara el EXE elegido, intervalo de lectura y errores o bloqueos observados. Los nombres de campos varían según versión y vista de Windows.',
    read: 'Campos que comparar (ejemplo)',
    know: 'Qué indica y qué no permite concluir',
    next: 'Siguiente comprobación',
    cases: [
      {
        title: '1. Coinciden el juego y la hora',
        fields: [
          ['Tu observación', 'SampleGame.exe se cerró a las 20:15'],
          ['Hora y aplicación registradas', '20:15 / SampleGame.exe'],
          ['Evento', 'Application Error / 1000'],
        ],
        meaning:
          'Es un registro candidato relacionado con el cierre. Coincidir en nombre y hora no demuestra la causa. Un módulo o código por sí solo no justifica sustituir una DLL ni culpar al controlador.',
        href: '/es/guide/pc-game-crash#crash-timing',
        link: 'Elige una comparación según cuándo se cierra',
      },
      {
        title: '2. El error corresponde a otra aplicación',
        fields: [
          ['Tu observación', 'SampleGame.exe se cerró a las 20:15'],
          ['Hora y aplicación registradas', '20:15 / OtherApp.exe'],
        ],
        meaning:
          'La hora es próxima, pero la aplicación no coincide. Este registro no explica por sí solo el cierre. Confirma que seleccionaste el ejecutable del juego, no su lanzador, y busca registros coincidentes.',
        href: '/es/guide/pc-game-crash#crash-history',
        link: 'Identifica la aplicación en el historial de Windows',
      },
      {
        title: '3. No aparece un registro coincidente',
        fields: [
          ['Tu observación', 'El juego se cerró a las 20:15'],
          ['Intervalo consultado', '20:10–20:20 / 0 registros coincidentes'],
        ],
        meaning:
          'Solo indica que no se encontró un registro en ese intervalo; no demuestra que funcione o esté reparado. Distingue fallos de lectura, EXE o intervalo incorrectos y registros retrasados. Un error al obtener datos no equivale a cero resultados.',
        href: '/en/tools/windows-diagnosis#use',
        link: 'Comprueba el EXE y el intervalo de lectura (inglés)',
      },
    ],
    stop: 'Sin registro, anota igualmente hora, comportamiento y el único cambio probado. No reproduzcas repetidamente el problema si el PC es inestable o pueden dañarse partidas. Antes de compartir, elimina usuarios, nombres del PC y rutas completas; no publiques registros sin revisar.',
    source:
      'Fuente: Microsoft Learn — lectura de eventos de cierre de aplicaciones (inglés)',
  },
};
