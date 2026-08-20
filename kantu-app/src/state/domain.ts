import type { Entry } from './entry';
import type { EntryType, Lang, SymptomTag, VitalType } from '../i18n/types';
import { meta, tagLabel, when, whenNoTime } from '../i18n/meta';

export function sorted(entries: Entry[], type?: EntryType): Entry[] {
  return entries
    .filter((e) => !type || e.type === type)
    .slice()
    .sort((a, b) => a.at - b.at);
}

export function latest(entries: Entry[], type: EntryType): Entry | undefined {
  const s = sorted(entries, type);
  return s[s.length - 1];
}

export function valOf(e: Entry): number {
  return e.type === 'bp' ? (e.v.sys as number) : (e.v.n as number);
}

export type StatusKey = 'none' | 'good' | 'watch' | 'high';
export interface Status {
  key: StatusKey;
  label: string;
}

export function status(lang: Lang, type: EntryType, e: Entry | undefined): Status {
  const p = (a: string, b: string) => (lang === 'es' ? a : b);
  if (!e) return { key: 'none', label: '—' };
  const ok: Status = { key: 'good', label: p('EN META', 'ON TARGET') };
  const w: Status = { key: 'watch', label: p('VIGILAR', 'WATCH') };
  const hi: Status = { key: 'high', label: p('ALTO', 'HIGH') };
  if (type === 'bp') {
    const s = e.v.sys ?? 0;
    const d = e.v.dia ?? 0;
    if (s >= 140 || d >= 90) return hi;
    if (s >= 130 || d >= 85) return w;
    return ok;
  }
  if (type === 'glucose') {
    const n = e.v.n ?? 0;
    if (n >= 140) return hi;
    if (n >= 110) return w;
    return ok;
  }
  if (type === 'hr') {
    const n = e.v.n ?? 0;
    if (n > 100 || n < 50) return hi;
    if (n > 90) return w;
    return ok;
  }
  return { key: 'none', label: p('REGISTRADO', 'LOGGED') };
}

export function statusColorVar(k: StatusKey): string {
  return k === 'high' ? 'var(--kw-high)' : k === 'watch' ? 'var(--kw-watch)' : k === 'good' ? 'var(--kw-good)' : 'var(--kw-mute)';
}

/** Builds an SVG polyline path (viewBox 0 0 100 24) for a mini sparkline. */
export function spark(vals: number[]): string {
  if (!vals || vals.length < 2) return '';
  const mn = Math.min(...vals);
  const mx = Math.max(...vals);
  const sp = mx - mn || 1;
  return vals
    .map((v, i) => (i ? 'L' : 'M') + ((i / (vals.length - 1)) * 100).toFixed(1) + ' ' + (21 - ((v - mn) / sp) * 18).toFixed(1))
    .join(' ');
}

export interface ChartPoint {
  x: string;
  y: string;
  color: string;
}
export interface ChartPath {
  d: string;
  color: string;
}
export interface ChartStat {
  k: string;
  v: string;
}
export interface ChartLegendItem {
  color: string;
  label: string;
}
export interface Chart {
  title: string;
  range: string;
  grid: number[];
  paths: ChartPath[];
  dots: ChartPoint[];
  xlabels: string[];
  legend: ChartLegendItem[];
  stats: ChartStat[];
}

const CHART_METRICS: EntryType[] = ['bp', 'glucose', 'hr', 'weight', 'mood', 'focus'];

export type ChartRange = 'week' | 'month';

export function chartFor(lang: Lang, entries: Entry[], now: number, metric: EntryType, range: ChartRange = 'week'): Chart {
  const p = (a: string, b: string) => (lang === 'es' ? a : b);
  const m = meta(lang, metric);
  const s = sorted(entries, metric);
  const grid = [12, 46, 80, 114];
  const rangeDays = range === 'month' ? 30 : 7;
  const emptyRange = range === 'month' ? p('ÚLTIMOS 30 DÍAS', 'LAST 30 DAYS') : p('ÚLTIMOS 7 DÍAS', 'LAST 7 DAYS');
  const empty: Chart = { title: m.full, range: emptyRange, grid, paths: [], dots: [], xlabels: [], legend: [], stats: [] };
  if (s.length < 2) return empty;

  const cutoff = now - rangeDays * 86400000;
  const windowed = s.filter((e) => e.at >= cutoff);
  const pick = windowed.length >= 2 ? windowed : s.slice(-8);
  const series: number[][] = metric === 'bp' ? [pick.map((e) => e.v.sys ?? 0), pick.map((e) => e.v.dia ?? 0)] : [pick.map((e) => e.v.n ?? 0)];
  const all = series.flat();
  let mn = Math.min(...all);
  let mx = Math.max(...all);
  const pad = (mx - mn) * 0.25 || 4;
  mn -= pad;
  mx += pad;
  const X = (i: number) => (pick.length === 1 ? 170 : 6 + (i / (pick.length - 1)) * 328);
  const Y = (v: number) => 130 - ((v - mn) / (mx - mn)) * 118;
  const colors = ['var(--kw-lav)', 'var(--kw-lav300)'];

  const paths: ChartPath[] = series.map((arr, k) => ({
    d: arr.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' '),
    color: colors[k],
  }));
  const dots: ChartPoint[] = [];
  series.forEach((arr, k) => arr.forEach((v, i) => dots.push({ x: X(i).toFixed(1), y: Y(v).toFixed(1), color: colors[k] })));

  const xl: string[] = [];
  pick.forEach((e, i) => {
    if (i === 0 || i === pick.length - 1 || i === Math.floor((pick.length - 1) / 2)) xl.push(whenNoTime(lang, e.at, now));
  });

  const legend: ChartLegendItem[] =
    metric === 'bp'
      ? [
          { color: 'var(--kw-lav)', label: p('Sistólica', 'Systolic') },
          { color: 'var(--kw-lav300)', label: p('Diastólica', 'Diastolic') },
        ]
      : [{ color: 'var(--kw-lav)', label: m.full }];

  const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
  const fmt = (v: number) => (metric === 'weight' ? v.toFixed(1) : String(Math.round(v)));

  let stats: ChartStat[];
  if (metric === 'bp') {
    stats = [
      { k: p('PROMEDIO', 'AVERAGE'), v: Math.round(avg(series[0])) + '/' + Math.round(avg(series[1])) },
      { k: p('MÁXIMO', 'HIGHEST'), v: Math.max(...series[0]) + '/' + Math.max(...series[1]) },
      { k: p('REGISTROS', 'ENTRIES'), v: String(s.length) },
    ];
  } else if (metric === 'mood' || metric === 'focus') {
    stats = [
      { k: p('PROMEDIO', 'AVERAGE'), v: avg(series[0]).toFixed(1) + '/5' },
      { k: p('MEJOR', 'BEST'), v: Math.max(...series[0]) + '/5' },
      { k: p('REGISTROS', 'ENTRIES'), v: String(s.length) },
    ];
  } else {
    stats = [
      { k: p('PROMEDIO', 'AVERAGE'), v: fmt(avg(series[0])) },
      { k: p('MÁXIMO', 'HIGHEST'), v: fmt(Math.max(...series[0])) },
      { k: p('REGISTROS', 'ENTRIES'), v: String(s.length) },
    ];
  }

  return { title: m.full, range: p('ÚLTIMOS ' + pick.length, 'LAST ' + pick.length), grid, paths, dots, xlabels: xl, legend, stats };
}

export interface Insight {
  kicker: string;
  tone: string;
  title: string;
  body: string;
}

export function buildInsights(lang: Lang, entries: Entry[], now: number): Insight[] {
  const p = (a: string, b: string) => (lang === 'es' ? a : b);
  const out: Insight[] = [];
  const week = 7 * 86400000;

  const bp = sorted(entries, 'bp').slice(-5);
  const over = bp.filter((e) => (e.v.sys ?? 0) >= 140 || (e.v.dia ?? 0) >= 90).length;
  const nearOver = bp.filter((e) => (e.v.sys ?? 0) >= 130 || (e.v.dia ?? 0) >= 85).length;
  if (over >= 1 || nearOver >= 3) {
    out.push({
      kicker: p('PRESIÓN', 'BLOOD PRESSURE'),
      tone: 'var(--kw-high)',
      title: p(
        nearOver + ' de tus últimas ' + bp.length + ' lecturas quedaron sobre tu meta.',
        nearOver + ' of your last ' + bp.length + ' readings were above your target.',
      ),
      body: p(
        'No es una emergencia. Es el dato más útil que puedes llevar a tu próxima cita — anota también a qué hora las tomaste.',
        'This is not an emergency. It is the most useful thing you can bring to your next appointment — note the time of day too.',
      ),
    });
  }

  const sym = entries.filter((e) => e.type === 'symptom' && now - e.at < 2 * week);
  const counts: Partial<Record<SymptomTag, number>> = {};
  sym.forEach((e) => (e.tags || []).forEach((tg) => (counts[tg] = (counts[tg] || 0) + 1)));
  const top = (Object.keys(counts) as SymptomTag[]).sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0))[0];
  const severe = sym.find((e) => (e.sev ?? 0) >= 3);
  if (severe) {
    out.push({
      kicker: p('SÍNTOMA FUERTE', 'SEVERE SYMPTOM'),
      tone: 'var(--kw-high)',
      title: p('Anotaste un síntoma fuerte esta semana.', 'You logged a severe symptom this week.'),
      body: p(
        'Si vuelve a pasar, no esperes a la próxima cita: llama a tu médica o a emergencias.',
        'If it happens again, do not wait for your next appointment — call your doctor or emergency services.',
      ),
    });
  } else if (top && (counts[top] ?? 0) >= 2) {
    const label = tagLabel(lang, top).toLowerCase();
    out.push({
      kicker: p('PATRÓN', 'PATTERN'),
      tone: 'var(--kw-lav)',
      title: p(
        'Anotaste «' + label + '» ' + counts[top] + ' veces en dos semanas.',
        'You logged "' + label + '" ' + counts[top] + ' times in two weeks.',
      ),
      body: p(
        'Puede no significar nada por sí solo. Seguir anotándolo es lo que convierte una sensación en algo que se puede revisar.',
        'On its own it may mean nothing. Keeping the note is what turns a feeling into something reviewable.',
      ),
    });
  }

  const mood = sorted(entries, 'mood')
    .slice(-5)
    .map((e) => e.v.n ?? 0);
  if (mood.length >= 3) {
    const avg = mood.reduce((a, b) => a + b, 0) / mood.length;
    out.push({
      kicker: p('ÁNIMO Y MENTE', 'MOOD & MIND'),
      tone: avg >= 3.5 ? 'var(--kw-good)' : 'var(--kw-watch)',
      title:
        avg >= 3.5
          ? p('Tu ánimo viene estable y hacia arriba.', 'Your mood has been steady and rising.')
          : p('Tu ánimo viene más bajo de lo habitual.', 'Your mood has been lower than usual.'),
      body:
        avg >= 3.5
          ? p(
              'Promedio de ' + avg.toFixed(1) + ' sobre 5 en tus últimos ' + mood.length + ' registros. Esto también cuenta como salud.',
              'Averaging ' + avg.toFixed(1) + ' of 5 across your last ' + mood.length + ' entries. This counts as health too.',
            )
          : p(
              'Promedio de ' + avg.toFixed(1) + ' sobre 5. Vale mencionarlo, igual que un número de presión.',
              'Averaging ' + avg.toFixed(1) + ' of 5. Worth mentioning, just like a blood-pressure number.',
            ),
    });
  }

  if (!out.length) {
    out.push({
      kicker: p('TODO TRANQUILO', 'ALL QUIET'),
      tone: 'var(--kw-good)',
      title: p('Nada que señalar esta semana.', 'Nothing to flag this week.'),
      body: p('Sigue anotando. Los patrones aparecen con el tiempo, no en un día.', 'Keep logging. Patterns show up over time, not in a day.'),
    });
  }
  return out;
}

export function avgOf(lang: Lang, entries: Entry[], type: EntryType): string | null {
  const a = sorted(entries, type);
  if (!a.length) return null;
  if (type === 'bp') {
    return Math.round(a.reduce((x, e) => x + (e.v.sys ?? 0), 0) / a.length) + '/' + Math.round(a.reduce((x, e) => x + (e.v.dia ?? 0), 0) / a.length) + ' mmHg';
  }
  const v = a.reduce((x, e) => x + (e.v.n ?? 0), 0) / a.length;
  if (type === 'weight') return v.toFixed(1) + ' kg';
  if (type === 'mood' || type === 'focus') return v.toFixed(1) + '/5';
  return Math.round(v) + ' ' + meta(lang, type).unit;
}

export const VITAL_TYPES: VitalType[] = ['bp', 'glucose', 'hr', 'weight'];
export const TREND_METRICS: EntryType[] = CHART_METRICS;
export const LOG_TYPES: EntryType[] = ['bp', 'glucose', 'hr', 'weight', 'mood', 'focus', 'symptom', 'note'];
export const SYMPTOM_TAGS = ['chest', 'palp', 'breath', 'dizzy', 'swell', 'numb', 'brainfog', 'forget', 'headache', 'tired', 'anxious', 'sleepless'] as const;
export const FILTER_TYPES: Array<EntryType | 'all'> = ['all', 'bp', 'glucose', 'hr', 'weight', 'mood', 'focus', 'symptom', 'note'];

export { when, whenNoTime };
