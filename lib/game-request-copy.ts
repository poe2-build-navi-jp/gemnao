import type { MyGamesLocale } from './my-games-copy';

export const gameRequestCopy = {
  ja: {
    title: 'このゲームを追加してほしい',
    intro: '一覧にないゲームの追加をリクエストできます。',
    privacy:
      'ゲーム名だけを入力してください。氏名・メールアドレス・連絡先は入力しないでください。ゲーム名と言語を送信します。内容は公開されず、編集担当者が確認します。追加や公開時期はお約束できません。',
    security:
      '不正な連続送信を防ぐため、IPアドレスから日ごとに作る非公開の識別子を使用します。IPアドレス自体はリクエスト記録に保存しません。',
    privacyLink: 'プライバシーポリシー',
    label: 'ゲーム名',
    placeholder: '例：原神',
    submit: '追加をリクエスト',
    sending: '送信中…',
    received: 'リクエストを受け付けました。編集担当者が確認します。',
    duplicate: 'このゲームのリクエストはすでに受け付けています。',
    invalid:
      'ゲーム名を2〜80文字で入力してください。URL・メールアドレス・改行は入力できません。',
    unavailable:
      '現在、リクエストを受け付けていません。時間をおいてお試しください。',
    failed:
      '受付を確認できませんでした。入力内容は残っています。もう一度送信してください。',
    rateLimited: '送信回数が多いため、少し待ってからもう一度お試しください。',
    check: '受付状況を再確認',
    checking: '受付状況を確認中…',
  },
  en: {
    title: 'Request a game',
    intro: 'Suggest a game that is missing from the list.',
    privacy:
      'Enter only the game title. Do not include your name, email address, or contact details. The game title and page language are sent privately for review by the editorial team. We cannot promise that a game will be added or when it will be published.',
    security:
      'To prevent abuse, we use a private identifier derived from your IP address that changes daily. The IP address itself is not stored in request records.',
    privacyLink: 'Privacy policy (Japanese)',
    label: 'Game title',
    placeholder: 'e.g. Genshin Impact',
    submit: 'Request this game',
    sending: 'Sending…',
    received: 'Request received. The editorial team will review it.',
    duplicate: 'A request for this game has already been received.',
    invalid:
      'Enter a game title of 2–80 characters, without URLs, email addresses, or line breaks.',
    unavailable:
      'Game requests are currently unavailable. Please try again later.',
    failed:
      'We could not confirm receipt. Your entry is still here. Please try sending it again.',
    rateLimited: 'Too many requests. Please wait a little before trying again.',
    check: 'Check availability again',
    checking: 'Checking availability…',
  },
  zh: {
    title: '申请添加游戏',
    intro: '可以申请添加列表中没有的游戏。',
    privacy:
      '请仅填写游戏名称，不要填写姓名、电子邮箱或其他联系方式。游戏名称及页面语言将发送给编辑人员审核，内容不会公开。无法保证一定添加该游戏或确定上线时间。',
    security:
      '为防止滥用，我们使用由IP地址生成且每日更换的非公开标识符。申请记录不保存IP地址本身。',
    privacyLink: '隐私政策（日语）',
    label: '游戏名称',
    placeholder: '例如：原神',
    submit: '提交添加申请',
    sending: '正在提交…',
    received: '已收到申请，编辑人员将进行审核。',
    duplicate: '已收到过这款游戏的添加申请。',
    invalid: '请输入2至80个字符的游戏名称，不要包含网址、电子邮箱或换行。',
    unavailable: '目前暂不接受申请，请稍后再试。',
    failed: '无法确认是否收到申请。输入内容已保留，请重新提交。',
    rateLimited: '提交过于频繁，请稍后再试。',
    check: '重新检查是否可提交',
    checking: '正在检查是否可提交…',
  },
  es: {
    title: 'Solicitar un juego',
    intro: 'Sugiere un juego que no aparezca en la lista.',
    privacy:
      'Introduce solo el título del juego. No incluyas tu nombre, correo electrónico ni datos de contacto. Se envían el título del juego y el idioma de la página de forma privada para que el equipo editorial los revise. No podemos garantizar que se añada el juego ni cuándo se publicará.',
    security:
      'Para evitar abusos, usamos un identificador privado derivado de tu dirección IP que cambia cada día. La dirección IP no se guarda en los registros de solicitudes.',
    privacyLink: 'Política de privacidad (japonés)',
    label: 'Título del juego',
    placeholder: 'Ej.: Genshin Impact',
    submit: 'Solicitar este juego',
    sending: 'Enviando…',
    received: 'Solicitud recibida. El equipo editorial la revisará.',
    duplicate: 'Ya hemos recibido una solicitud para este juego.',
    invalid:
      'Introduce un título de entre 2 y 80 caracteres, sin URL, correos electrónicos ni saltos de línea.',
    unavailable:
      'No se pueden enviar solicitudes por el momento. Inténtalo más tarde.',
    failed:
      'No hemos podido confirmar la recepción. El texto sigue aquí. Intenta enviarlo de nuevo.',
    rateLimited:
      'Demasiadas solicitudes. Espera un poco antes de volver a intentarlo.',
    check: 'Volver a comprobar la disponibilidad',
    checking: 'Comprobando disponibilidad…',
  },
} satisfies Record<MyGamesLocale, Record<string, string>>;
