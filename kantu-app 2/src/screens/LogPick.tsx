import { useKantu } from '../state/store';
import { dictionaries } from '../i18n/dict';
import { meta } from '../i18n/meta';
import { LOG_TYPES } from '../state/domain';

export function LogPick() {
  const { lang, pickLogType } = useKantu();
  const t = dictionaries[lang];

  return (
    <>
      <div style={{ padding: '14px 16px 12px', background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line)' }}>
        <div style={{ fontSize: '13px', lineHeight: 1.45, color: 'var(--kw-mute)' }}>{t.logSub}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: 'var(--kw-line)', borderBottom: '2px solid var(--kw-line)' }}>
        {LOG_TYPES.map((type) => {
          const m = meta(lang, type);
          const mind = type === 'mood' || type === 'focus';
          return (
            <button
              key={type}
              onClick={() => pickLogType(type)}
              style={{
                background: mind ? 'var(--kw-lav100)' : 'var(--kw-card)',
                border: 0,
                padding: '14px 13px 15px',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'Archivo',
                color: 'var(--kw-ink)',
                minHeight: '96px',
              }}
            >
              <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{m.group}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.15, marginTop: '6px' }}>{m.full}</div>
              <div style={{ fontSize: '10.5px', color: 'var(--kw-mute)', marginTop: '5px' }}>{m.hint}</div>
            </button>
          );
        })}
      </div>
      <div style={{ padding: '14px 14px 90px', fontSize: '10.5px', lineHeight: 1.5, color: 'var(--kw-mute)' }}>{t.logFoot}</div>
    </>
  );
}
