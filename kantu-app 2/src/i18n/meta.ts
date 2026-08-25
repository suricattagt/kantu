import type { EntryType, GlucoseContext, Lang, SymptomTag } from './types';

export interface TypeMeta {
  label: string;
  full: string;
  unit: string;
  group: string;
  hint: string;
}

const META: Record<Lang, Record<EntryType, TypeMeta>> = {
  es: {
    bp: { label: 'PRESIÓN', full: 'Presión arterial', unit: 'mmHg', group: 'CORAZÓN', hint: 'Sistólica y diastólica' },
    glucose: { label: 'GLUCOSA', full: 'Glucosa', unit: 'mg/dL', group: 'DIABETES', hint: 'Con el momento del día' },
    hr: { label: 'PULSO', full: 'Pulso', unit: 'lpm', group: 'CORAZÓN', hint: 'En reposo' },
    weight: { label: 'PESO', full: 'Peso', unit: 'kg', group: 'CUERPO', hint: 'Una vez por semana basta' },
    mood: { label: 'ÁNIMO', full: 'Ánimo', unit: '', group: 'MENTE', hint: 'Del 1 al 5, sin explicar' },
    focus: { label: 'MEMORIA', full: 'Memoria y foco', unit: '', group: 'MENTE', hint: '¿Claro o nublado hoy?' },
    symptom: { label: 'SÍNTOMA', full: 'Síntoma', unit: '', group: 'CUERPO', hint: 'Elige una o varias etiquetas' },
    note: { label: 'NOTA', full: 'Nota libre', unit: '', group: 'LIBRE', hint: 'Lo que quieras recordar' },
  },
  en: {
    bp: { label: 'BLOOD PRESSURE', full: 'Blood pressure', unit: 'mmHg', group: 'HEART', hint: 'Systolic and diastolic' },
    glucose: { label: 'GLUCOSE', full: 'Blood glucose', unit: 'mg/dL', group: 'DIABETES', hint: 'With time of day' },
    hr: { label: 'HEART RATE', full: 'Heart rate', unit: 'bpm', group: 'HEART', hint: 'At rest' },
    weight: { label: 'WEIGHT', full: 'Weight', unit: 'kg', group: 'BODY', hint: 'Once a week is enough' },
    mood: { label: 'MOOD', full: 'Mood', unit: '', group: 'MIND', hint: 'One to five, no explaining' },
    focus: { label: 'MEMORY', full: 'Memory & focus', unit: '', group: 'MIND', hint: 'Clear or foggy today?' },
    symptom: { label: 'SYMPTOM', full: 'Symptom', unit: '', group: 'BODY', hint: 'Pick one or more tags' },
    note: { label: 'NOTE', full: 'Free note', unit: '', group: 'FREE', hint: 'Whatever you want to remember' },
  },
};

export function meta(lang: Lang, type: EntryType): TypeMeta {
  return META[lang][type];
}

const TAG_LABEL: Record<Lang, Record<SymptomTag, string>> = {
  es: {
    chest: 'Dolor de pecho',
    palp: 'Palpitaciones',
    dizzy: 'Mareo',
    brainfog: 'Niebla mental',
    forget: 'Olvidos',
    swell: 'Hinchazón',
    numb: 'Hormigueo',
    headache: 'Dolor de cabeza',
    tired: 'Cansancio',
    anxious: 'Ansiedad',
    sleepless: 'Mal sueño',
    breath: 'Falta de aire',
  },
  en: {
    chest: 'Chest pain',
    palp: 'Palpitations',
    dizzy: 'Dizziness',
    brainfog: 'Brain fog',
    forget: 'Forgetfulness',
    swell: 'Swelling',
    numb: 'Numbness',
    headache: 'Headache',
    tired: 'Fatigue',
    anxious: 'Anxiety',
    sleepless: 'Poor sleep',
    breath: 'Breathlessness',
  },
};

export function tagLabel(lang: Lang, k: SymptomTag): string {
  return TAG_LABEL[lang][k] || k;
}

const MOOD_WORD: Record<Lang, string[]> = {
  es: ['—', 'Muy bajo', 'Bajo', 'Normal', 'Bien', 'Muy bien'],
  en: ['—', 'Very low', 'Low', 'Okay', 'Good', 'Very good'],
};

export function moodWord(lang: Lang, n: number): string {
  return MOOD_WORD[lang][n];
}

const FOCUS_WORD: Record<Lang, string[]> = {
  es: ['—', 'Muy nublado', 'Nublado', 'Normal', 'Claro', 'Muy claro'],
  en: ['—', 'Very foggy', 'Foggy', 'Okay', 'Clear', 'Very clear'],
};

export function focusWord(lang: Lang, n: number): string {
  return FOCUS_WORD[lang][n];
}

const CTX_WORD: Record<Lang, Record<GlucoseContext, string>> = {
  es: { fasting: 'En ayunas', before: 'Antes de comer', after: 'Después de comer', random: 'Cualquier momento' },
  en: { fasting: 'Fasting', before: 'Before meal', after: 'After meal', random: 'Any time' },
};

export function ctxWord(lang: Lang, k: GlucoseContext | undefined): string {
  if (!k) return '';
  return CTX_WORD[lang][k] || '';
}

const SEV_WORD: Record<Lang, string[]> = {
  es: ['', 'Leve', 'Moderado', 'Fuerte'],
  en: ['', 'Mild', 'Moderate', 'Severe'],
};

export function sevWord(lang: Lang, n: number): string {
  return SEV_WORD[lang][n];
}

const MONTHS: Record<Lang, string[]> = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/** Formats a timestamp relative to `now`: "Hoy 7:40", "Ayer 8:05", or "20 ago 7:48". */
export function when(lang: Lang, ts: number, now: number): string {
  const x = new Date(ts);
  const base = new Date(now);
  const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dd = Math.round((day(base) - day(x)) / 86400000);
  const hm = x.getHours() + ':' + String(x.getMinutes()).padStart(2, '0');
  if (dd === 0) return (lang === 'es' ? 'Hoy ' : 'Today ') + hm;
  if (dd === 1) return (lang === 'es' ? 'Ayer ' : 'Yesterday ') + hm;
  return x.getDate() + ' ' + MONTHS[lang][x.getMonth()] + ' ' + hm;
}

export function whenNoTime(lang: Lang, ts: number, now: number): string {
  return when(lang, ts, now).replace(/ \d+:\d+$/, '');
}
