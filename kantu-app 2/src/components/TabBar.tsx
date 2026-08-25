import type { Screen } from '../state/store';

interface Tab {
  key: 'home' | 'log' | 'trends' | 'hist';
  label: string;
}

export function TabBar({ screen, tabs, onGo }: { screen: Screen; tabs: Tab[]; onGo: (s: Screen) => void }) {
  const isActive = (k: Tab['key']) =>
    screen === k || (k === 'trends' && screen === 'summary') || (k === 'home' && screen === 'insights');

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '2px',
        background: 'var(--kw-line)',
        borderTop: '2px solid var(--kw-line)',
        flexShrink: 0,
      }}
    >
      {tabs.map((tb) => {
        const active = isActive(tb.key);
        return (
          <button
            key={tb.key}
            onClick={() => onGo(tb.key)}
            style={{
              background: active ? 'var(--kw-lav100)' : 'var(--kw-card)',
              border: 0,
              padding: '0 0 13px',
              cursor: 'pointer',
              fontFamily: 'Archivo',
              color: active ? 'var(--kw-lav700)' : 'var(--kw-mute)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '9px',
            }}
          >
            <div style={{ width: '100%', height: '3px', background: active ? 'var(--kw-lav)' : 'transparent' }} />
            <div style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '-.005em', padding: '0 10px' }}>{tb.label}</div>
          </button>
        );
      })}
    </div>
  );
}
