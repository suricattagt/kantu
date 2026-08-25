import type { Lang } from './types';

export interface Dict {
  kicker: string;
  greet: string;
  homeSubEmpty: string;
  homeSubOne: string;
  homeSubManySuffix: string;
  feelHead: string;
  insHead: string;
  insTitle: string;
  insFoot: string;
  seeAll: string;
  disclaimer: string;
  logSub: string;
  logFoot: string;
  nowLabel: string;
  save: string;
  ctxHead: string;
  tagHead: string;
  sevHead: string;
  noteHead: string;
  notePh: string;
  del: string;
  docSummary: string;
  docSub: string;
  docPeriod: string;
  docSymp: string;
  docShare: string;
  langLabel: string;
  themeLabel: string;
  dataLabel: string;
  export: string;
  accountLabel: string;
  logOut: string;
  logOutConfirm: string;
  about: string;
  credit: string;
  dscHead: string;
  dscKicker: string;
  dscTo: string;
  dscAccept: string;
  dscBack: string;
  nameLabel: string;
  namePh: string;
  nameHelp: string;
  nameInvalid: string;
  emailLabel: string;
  emailPh: string;
  emailHelp: string;
  dscBody: string;
  dscAck: string;
  onbKicker: string;
  onbTitle: string;
  onbStart: string;
  onbNote: string;
  greetingWord: string;
  continueLabel: string;
  backLabel: string;
  nameStepHead: string;
  nameStepSub: string;
  aboutHead: string;
  savedPrefix: string;
  entryDeleted: string;
  emailInvalid: string;
  ackRequired: string;
  summaryDownloaded: string;
  summaryShared: string;
  jsonExported: string;
  entriesSuffix: string;
  all: string;
  claro: string;
  oscuro: string;
  emailSent: string;
  emailSendFailed: string;
}

export const dictionaries: Record<Lang, Dict> = {
  es: {
    kicker: 'SALUD DIARIA',
    greet: 'Buenos días',
    homeSubEmpty: 'Aún no tienes registros hoy.',
    homeSubOne: 'Un registro hoy. Nada urgente.',
    homeSubManySuffix: ' registros hoy. Nada urgente.',
    feelHead: 'ÁNIMO Y MENTE',
    insHead: 'VALE LA PENA MENCIONARLO',
    insTitle: 'Esto vi en tus últimas dos semanas.',
    insFoot:
      'Kantu no diagnostica nada. Estas frases solo describen lo que tú anotaste, en palabras que puedes repetir en una consulta.',
    seeAll: 'Ver todo',
    disclaimer: 'Kantu es tu registro personal. No sustituye a tu médica ni te da un diagnóstico.',
    logSub: '¿Qué quieres anotar? Puedes hacerlo en segundos y volver después.',
    logFoot: 'Solo lo que tú elijas seguir. Nada de ciclo, fertilidad ni embarazo.',
    nowLabel: 'Ahora',
    save: 'Guardar',
    ctxHead: 'MOMENTO',
    tagHead: '¿QUÉ SENTISTE?',
    sevHead: 'INTENSIDAD',
    noteHead: 'NOTA (OPCIONAL)',
    notePh: 'Algo que quieras recordar…',
    del: 'Borrar',
    docSummary: 'Resumen para el doctor',
    docSub: 'Promedios y notas de este periodo, listos para leer en voz alta en la consulta.',
    docPeriod: 'PERIODO',
    docSymp: 'SÍNTOMAS ANOTADOS',
    docShare: 'Compartir resumen (PDF)',
    langLabel: 'IDIOMA',
    themeLabel: 'APARIENCIA',
    dataLabel: 'TUS DATOS',
    export: 'Exportar mis registros',
    accountLabel: 'CUENTA',
    logOut: 'Cerrar sesión',
    logOutConfirm: 'Esto borra tu nombre, correo y todos tus registros de este teléfono, y te regresa al inicio. ¿Continuar?',
    about: 'Tus registros se guardan solo en este teléfono. Puedes exportarlos o borrarlos cuando quieras.',
    credit: 'Creado por Suricatta',
    dscHead: 'Esto no es un diagnóstico médico',
    dscKicker: 'ANTES DE ENTRAR — LEE ESTO',
    dscTo: 'Enviaremos una copia de este aviso a',
    dscAccept: 'Acepto y entrar',
    dscBack: 'Volver',
    nameLabel: 'TU NOMBRE',
    namePh: 'Solo tu nombre',
    nameHelp: 'Sin apellido — así Kantu se siente más tuyo.',
    nameInvalid: 'Escribe tu nombre para continuar.',
    emailLabel: 'TU CORREO',
    emailPh: 'nombre@correo.com',
    emailHelp: 'Solo para guardar el aviso legal y poder enviarte tus registros. Nada más.',
    dscBody:
      'Kantu es una libreta: guarda lo que tú anotas y lo ordena. No mide, no interpreta ni diagnostica. Ninguna cifra, color ni frase de esta app equivale a la opinión de un profesional. Lleva estos registros a tu médica o médico: solo ellos pueden examinarte y decirte qué significan. Si algo cambia de golpe o te sientes mal, busca atención médica de inmediato — no esperes a la próxima anotación.',
    dscAck:
      'Entiendo que Kantu no me da un diagnóstico y que un profesional de salud debe revisar mis registros.',
    onbKicker: 'TU REGISTRO DE SALUD',
    onbTitle: 'Lo que anotas hoy es lo que puedes contarle a tu médica mañana.',
    onbStart: 'Empezar',
    onbNote: 'Sin cuentas, sin nube, sin diagnósticos. Solo tú y tus números.',
    greetingWord: 'Hola',
    continueLabel: 'Continuar',
    backLabel: 'Atrás',
    nameStepHead: '¿Cómo te llamas?',
    nameStepSub: 'Así Kantu se sentirá más tuyo, desde el saludo hasta tus registros.',
    aboutHead: 'Kantu es la memoria de tu salud.',
    savedPrefix: 'Guardado — ',
    entryDeleted: 'Registro borrado',
    emailInvalid: 'Escribe un correo válido para continuar.',
    ackRequired: 'Marca la casilla para continuar.',
    summaryDownloaded: 'Resumen PDF descargado',
    summaryShared: 'Resumen enviado',
    jsonExported: 'JSON exportado',
    entriesSuffix: ' registros',
    all: 'Todo',
    claro: 'Claro',
    oscuro: 'Oscuro',
    emailSent: 'Te enviamos una copia del aviso por correo.',
    emailSendFailed: 'No pudimos enviar el correo con el aviso. Puedes seguir usando Kantu.',
  },
  en: {
    kicker: 'DAILY HEALTH',
    greet: 'Good morning',
    homeSubEmpty: 'No entries yet today.',
    homeSubOne: 'One entry today. Nothing urgent.',
    homeSubManySuffix: ' entries today. Nothing urgent.',
    feelHead: 'MOOD & MIND',
    insHead: 'WORTH MENTIONING',
    insTitle: 'Here is what I saw in your last two weeks.',
    insFoot:
      'Kantu diagnoses nothing. These lines only describe what you logged, in words you can repeat at an appointment.',
    seeAll: 'See all',
    disclaimer: 'Kantu is your personal record. It does not replace your doctor and gives no diagnosis.',
    logSub: 'What would you like to note? It takes seconds — you can come back later.',
    logFoot: 'Only what you choose to track. No cycle, fertility or pregnancy.',
    nowLabel: 'Now',
    save: 'Save',
    ctxHead: 'CONTEXT',
    tagHead: 'WHAT DID YOU FEEL?',
    sevHead: 'INTENSITY',
    noteHead: 'NOTE (OPTIONAL)',
    notePh: 'Anything you want to remember…',
    del: 'Delete',
    docSummary: 'Summary for the doctor',
    docSub: 'Averages and notes for this period, ready to read out at the appointment.',
    docPeriod: 'PERIOD',
    docSymp: 'SYMPTOMS LOGGED',
    docShare: 'Share summary (PDF)',
    langLabel: 'LANGUAGE',
    themeLabel: 'APPEARANCE',
    dataLabel: 'YOUR DATA',
    export: 'Export my entries',
    accountLabel: 'ACCOUNT',
    logOut: 'Log out',
    logOutConfirm: 'This clears your name, email, and all your entries from this phone, and takes you back to the start. Continue?',
    about: 'Your entries are stored only on this phone. Export or delete them whenever you like.',
    credit: 'Made by Suricatta',
    dscHead: 'This is not a medical diagnosis',
    dscKicker: 'BEFORE YOU GO IN — READ THIS',
    dscTo: 'We will send a copy of this notice to',
    dscAccept: 'I accept — go in',
    dscBack: 'Go back',
    nameLabel: 'YOUR NAME',
    namePh: 'First name only',
    nameHelp: 'No last name needed — makes Kantu feel more like yours.',
    nameInvalid: 'Enter your name to continue.',
    emailLabel: 'YOUR EMAIL',
    emailPh: 'name@email.com',
    emailHelp: 'Only to keep the legal notice on file and send you your records. Nothing else.',
    dscBody:
      'Kantu is a notebook: it keeps what you write down and puts it in order. It does not measure, interpret or diagnose. No number, color or sentence in this app is a professional opinion. Take these records to your doctor — only they can examine you and tell you what they mean. If something changes suddenly or you feel unwell, seek medical care right away; do not wait for the next entry.',
    dscAck: 'I understand Kantu gives me no diagnosis and that a health professional must review my records.',
    onbKicker: 'YOUR HEALTH RECORD',
    onbTitle: 'What you note today is what you can tell your doctor tomorrow.',
    onbStart: 'Get started',
    onbNote: 'No accounts, no cloud, no diagnoses. Just you and your numbers.',
    greetingWord: 'Hello',
    continueLabel: 'Continue',
    backLabel: 'Back',
    nameStepHead: "What's your name?",
    nameStepSub: 'This is how Kantu will feel more like yours, from the greeting to your records.',
    aboutHead: 'Kantu is the memory of your health.',
    savedPrefix: 'Saved — ',
    entryDeleted: 'Entry deleted',
    emailInvalid: 'Enter a valid email to continue.',
    ackRequired: 'Tick the box to continue.',
    summaryDownloaded: 'Summary PDF downloaded',
    summaryShared: 'Summary shared',
    jsonExported: 'JSON exported',
    entriesSuffix: ' entries',
    all: 'All',
    claro: 'Light',
    oscuro: 'Dark',
    emailSent: 'We emailed you a copy of the notice.',
    emailSendFailed: "We couldn't send the notice by email. You can keep using Kantu.",
  },
};
