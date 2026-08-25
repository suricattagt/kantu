import { useMemo } from 'react';
import { useKantu } from '../state/store';
import { dictionaries } from '../i18n/dict';
import { buildInsights } from '../state/domain';

export function Insights() {
  const { lang, entries, now } = useKantu();
  const t = dictionaries[lang];
  const insights = useMemo(() => buildInsights(lang, entries, now), [lang, entries, now]);

  return (
    <>
      <div style={{ background: 'var(--kw-lav)', color: '#fffdfb', padding: '20px 16px 22px', borderBottom: '2px solid var(--kw-line)' }}>
        <div style={{ fontSize: '9.5px', letterSpacing: '.15em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.8 }}>{t.insHead}</div>
        <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.08, marginTop: '10px', maxWidth: '290px', textWrap: 'pretty' }}>
          {t.insTitle}
        </div>
      </div>

      {insights.map((i, idx) => (
        <div key={idx} style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line2)', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '26px', height: '2px', background: i.tone }} />
            <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{i.kicker}</div>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.22, marginTop: '9px', textWrap: 'pretty' }}>{i.title}</div>
          <div style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--kw-mute)', marginTop: '6px', textWrap: 'pretty' }}>{i.body}</div>
        </div>
      ))}

      <div style={{ margin: '16px 14px 100px', border: '2px solid var(--kw-ink)', padding: '13px 14px 14px' }}>
        <div style={{ fontSize: '9.5px', letterSpacing: '.15em', textTransform: 'uppercase', fontWeight: 800 }}>{t.dscHead}</div>
        <div style={{ height: '2px', background: 'var(--kw-ink)', margin: '9px 0' }} />
        <div style={{ fontSize: '12.5px', lineHeight: 1.5, fontWeight: 500, textWrap: 'pretty' }}>{t.insFoot}</div>
        <div style={{ fontSize: '12.5px', lineHeight: 1.5, fontWeight: 500, marginTop: '9px', textWrap: 'pretty' }}>{t.dscBody}</div>
      </div>
    </>
  );
}
