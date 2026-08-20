import type { Lang } from '../i18n/types';
import { langBtnStyle } from './styleHelpers';

const TITLES: Record<Lang, Record<string, string>> = {
  es: { home: 'Hoy', log: 'Registrar', trends: 'Tendencias', hist: 'Historia', insights: 'Señales', settings: 'Ajustes', summary: 'Para el doctor' },
  en: { home: 'Today', log: 'Log', trends: 'Trends', hist: 'History', insights: 'Signals', settings: 'Settings', summary: 'For the doctor' },
};

export function screenTitle(lang: Lang, screen: string): string {
  return TITLES[lang][screen] || TITLES[lang].home;
}

export function Header({
  kicker,
  title,
  lang,
  onSetLang,
  onSettings,
  onHome,
}: {
  kicker: string;
  title: string;
  lang: Lang;
  onSetLang: (l: Lang) => void;
  onSettings: () => void;
  onHome: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '14px 16px 10px',
        borderBottom: '2px solid var(--kw-line)',
        background: 'var(--kw-card)',
      }}
    >
      <div>
        <button
          onClick={onHome}
          style={{
            border: 0,
            background: 'transparent',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            fontFamily: 'Archivo',
            fontSize: '9.5px',
            letterSpacing: '.15em',
            textTransform: 'uppercase',
            color: 'var(--kw-mute)',
            fontWeight: 700,
          }}
        >
          {kicker}
        </button>
        <div style={{ fontSize: '21px', fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.05, marginTop: '2px' }}>{title}</div>
      </div>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button onClick={() => onSetLang('es')} style={langBtnStyle(lang === 'es')}>
          ES
        </button>
        <button onClick={() => onSetLang('en')} style={langBtnStyle(lang === 'en')}>
          EN
        </button>
        <button
          onClick={onSettings}
          aria-label="Ajustes"
          style={{
            width: '34px',
            height: '30px',
            border: '1px solid var(--kw-line)',
            background: 'transparent',
            color: 'var(--kw-ink)',
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.6.66 1 1.27 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
