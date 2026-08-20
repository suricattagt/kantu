import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Entry, EntryValue } from './entry';
import { defaultsFor } from './entry';
import type { EntryType, GlucoseContext, Lang, SymptomTag } from '../i18n/types';
import { dictionaries } from '../i18n/dict';
import { meta } from '../i18n/meta';

export type Screen = 'onb' | 'home' | 'log' | 'trends' | 'hist' | 'insights' | 'settings' | 'summary';

export interface FormState {
  sys?: number;
  dia?: number;
  n?: number;
  ctx?: GlucoseContext;
  tags?: SymptomTag[];
  sev?: number;
  note?: string;
}

export type ChartRange = 'week' | 'month';

interface PersistedState {
  entries: Entry[];
  lang: Lang | null;
  dark: boolean | null;
  onboarded: boolean;
  email: string;
  name: string;
  range: ChartRange | null;
}

const STORAGE_KEY = 'kantu:v1';

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function savePersisted(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable (private mode, quota) — app still works for this session
  }
}

export interface KantuState {
  lang: Lang;
  dark: boolean;
  onboarded: boolean;
  email: string;
  name: string;
  ack: boolean;
  showDsc: boolean;
  screen: Screen;
  logType: EntryType | null;
  form: FormState;
  entries: Entry[];
  toast: string | null;
  filter: EntryType | 'all';
  metric: EntryType;
  range: ChartRange;
  now: number;

  setLang: (l: Lang) => void;
  setDark: (d: boolean) => void;
  setEmail: (e: string) => void;
  setName: (n: string) => void;
  setAck: (a: boolean | ((prev: boolean) => boolean)) => void;
  setShowDsc: (s: boolean) => void;
  go: (screen: Screen) => void;
  pickLogType: (t: EntryType) => void;
  backToPick: () => void;
  setForm: (patch: Partial<FormState>) => void;
  saveEntry: () => void;
  deleteEntry: (id: string) => void;
  setFilter: (f: EntryType | 'all') => void;
  setMetric: (m: EntryType) => void;
  setRange: (r: ChartRange) => void;
  say: (msg: string) => void;
  completeOnboarding: () => void;
}

const KantuContext = createContext<KantuState | null>(null);

export function KantuProvider({ children }: { children: ReactNode }) {
  const [init] = useState(() => ({ persisted: loadPersisted(), now: Date.now() }));
  const persisted = init.persisted;

  const [entries, setEntries] = useState<Entry[]>(() => persisted?.entries ?? []);
  const [lang, setLangState] = useState<Lang>(persisted?.lang ?? 'es');
  const [dark, setDarkState] = useState<boolean>(persisted?.dark ?? false);
  const [onboarded, setOnboarded] = useState<boolean>(persisted?.onboarded ?? false);
  const [email, setEmailState] = useState<string>(persisted?.email ?? '');
  const [name, setNameState] = useState<string>(persisted?.name ?? '');

  const [ack, setAckState] = useState(false);
  const [showDsc, setShowDsc] = useState(false);
  const [screen, setScreen] = useState<Screen>(onboarded ? 'home' : 'onb');
  const [logType, setLogType] = useState<EntryType | null>(null);
  const [form, setFormState] = useState<FormState>({});
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<EntryType | 'all'>('all');
  const [metric, setMetric] = useState<EntryType>('bp');
  const [range, setRange] = useState<ChartRange>(persisted?.range ?? 'week');
  const [now, setNow] = useState(init.now);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    savePersisted({ entries, lang, dark, onboarded, email, name, range });
  }, [entries, lang, dark, onboarded, email, name, range]);

  const say = useCallback((msg: string) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const go = useCallback((next: Screen) => {
    setScreen(next);
    setLogType(null);
  }, []);

  const pickLogType = useCallback((t: EntryType) => {
    setLogType(t);
    setFormState(defaultsFor(t));
  }, []);

  const backToPick = useCallback(() => setLogType(null), []);

  const setForm = useCallback((patch: Partial<FormState>) => {
    setFormState((f) => ({ ...f, ...patch }));
  }, []);

  const saveEntry = useCallback(() => {
    setEntries((prev) => {
      if (!logType) return prev;
      let v: EntryValue = {};
      if (logType === 'bp') v = { sys: form.sys, dia: form.dia };
      else if (logType === 'glucose') v = { n: form.n, ctx: form.ctx };
      else if (logType === 'symptom' || logType === 'note') v = {};
      else v = { n: form.n };
      const entry: Entry = {
        id: 'n' + Date.now(),
        type: logType,
        at: Date.now(),
        v,
        tags: form.tags || [],
        sev: form.sev,
        note: form.note || '',
      };
      return [entry, ...prev];
    });
    if (logType) {
      const t = dictionaries[lang];
      say(t.savedPrefix + meta(lang, logType).full.toLowerCase());
    }
    setScreen('home');
    setLogType(null);
    setFormState({});
  }, [logType, form, lang, say]);

  const deleteEntry = useCallback(
    (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      say(dictionaries[lang].entryDeleted);
    },
    [lang, say],
  );

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const setDark = useCallback((d: boolean) => setDarkState(d), []);
  const setEmail = useCallback((e: string) => setEmailState(e), []);
  const setName = useCallback((n: string) => setNameState(n), []);
  const setAck = useCallback((a: boolean | ((prev: boolean) => boolean)) => {
    setAckState((prev) => (typeof a === 'function' ? (a as (p: boolean) => boolean)(prev) : a));
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboarded(true);
    setShowDsc(false);
    setScreen('home');
  }, []);

  const value = useMemo<KantuState>(
    () => ({
      lang,
      dark,
      onboarded,
      email,
      name,
      ack,
      showDsc,
      screen,
      logType,
      form,
      entries,
      toast,
      filter,
      metric,
      range,
      now,
      setLang,
      setDark,
      setEmail,
      setName,
      setAck,
      setShowDsc,
      go,
      pickLogType,
      backToPick,
      setForm,
      saveEntry,
      deleteEntry,
      setFilter,
      setMetric,
      setRange,
      say,
      completeOnboarding,
    }),
    [
      lang,
      dark,
      onboarded,
      email,
      name,
      ack,
      showDsc,
      screen,
      logType,
      form,
      entries,
      toast,
      filter,
      metric,
      range,
      now,
      setLang,
      setDark,
      setEmail,
      setName,
      setAck,
      go,
      pickLogType,
      backToPick,
      setForm,
      saveEntry,
      deleteEntry,
      say,
      completeOnboarding,
    ],
  );

  return <KantuContext.Provider value={value}>{children}</KantuContext.Provider>;
}

export function useKantu(): KantuState {
  const ctx = useContext(KantuContext);
  if (!ctx) throw new Error('useKantu must be used within KantuProvider');
  return ctx;
}
