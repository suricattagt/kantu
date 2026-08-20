import { useKantu } from '../state/store';
import { dictionaries } from '../i18n/dict';
import { segStyle } from '../components/styleHelpers';
import { DisclaimerBox } from '../components/DisclaimerBox';
import { exportEntriesJson } from '../state/exports';

export function Settings() {
  const { lang, setLang, dark, setDark, entries, say } = useKantu();
  const t = dictionaries[lang];

  const doExport = () => {
    exportEntriesJson(entries);
    say(t.jsonExported);
  };

  return (
    <>
      <div style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line2)', padding: '14px' }}>
        <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{t.langLabel}</div>
        <div style={{ display: 'flex', gap: '2px', marginTop: '10px', background: 'var(--kw-line2)' }}>
          <button onClick={() => setLang('es')} style={segStyle(lang === 'es')}>
            Español
          </button>
          <button onClick={() => setLang('en')} style={segStyle(lang === 'en')}>
            English
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line2)', padding: '14px' }}>
        <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{t.themeLabel}</div>
        <div style={{ display: 'flex', gap: '2px', marginTop: '10px', background: 'var(--kw-line2)' }}>
          <button onClick={() => setDark(false)} style={segStyle(!dark)}>
            {t.claro}
          </button>
          <button onClick={() => setDark(true)} style={segStyle(dark)}>
            {t.oscuro}
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line)', padding: '14px' }}>
        <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{t.dataLabel}</div>
        <button
          onClick={doExport}
          style={{ width: '100%', border: '2px solid var(--kw-line)', background: 'transparent', color: 'var(--kw-ink)', fontFamily: 'Archivo', fontSize: '14px', fontWeight: 700, textAlign: 'left', padding: '13px 14px', borderRadius: '3px', cursor: 'pointer', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>{t.export}</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--kw-mute)' }}>
            {entries.length}
            {t.entriesSuffix}
          </span>
        </button>
      </div>

      <div style={{ padding: '16px 14px 0', fontSize: '11.5px', lineHeight: 1.6, color: 'var(--kw-mute)', textWrap: 'pretty' }}>{t.about}</div>

      <DisclaimerBox heading={t.dscHead} body={t.dscBody} style={{ margin: '14px 14px 100px' }} />
    </>
  );
}
