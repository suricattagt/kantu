import { useMemo } from 'react';
import { useKantu } from '../state/store';
import { dictionaries } from '../i18n/dict';
import { meta } from '../i18n/meta';
import { TREND_METRICS, chartFor } from '../state/domain';
import { chipStyle, segStyle } from '../components/styleHelpers';

export function Trends() {
  const { lang, entries, now, metric, setMetric, range, setRange, go } = useKantu();
  const t = dictionaries[lang];

  const chart = useMemo(() => chartFor(lang, entries, now, metric, range), [lang, entries, now, metric, range]);

  return (
    <>
      <div style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line)', padding: '12px 14px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {TREND_METRICS.map((m) => (
            <button key={m} onClick={() => setMetric(m)} style={chipStyle(metric === m, { fontSize: '11.5px', padding: '7px 10px' })}>
              {meta(lang, m).full}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '2px', marginTop: '10px', background: 'var(--kw-line2)', width: 'fit-content' }}>
          <button onClick={() => setRange('week')} style={segStyle(range === 'week')}>
            {lang === 'es' ? 'Semana' : 'Week'}
          </button>
          <button onClick={() => setRange('month')} style={segStyle(range === 'month')}>
            {lang === 'es' ? 'Mes' : 'Month'}
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line)', padding: '16px 14px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-.03em' }}>{chart.title}</div>
          <div style={{ fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{chart.range}</div>
        </div>
        <div style={{ marginTop: '14px' }}>
          <svg viewBox="0 0 340 150" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {chart.grid.map((y) => (
              <line key={y} x1="0" x2="340" y1={y} y2={y} stroke="rgba(33,31,40,.13)" strokeWidth={1} />
            ))}
            {chart.paths.map((p, i) => (
              <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth={2.4} strokeLinejoin="round" />
            ))}
            {chart.dots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={3.2} fill={d.color} />
            ))}
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          {chart.xlabels.map((xl, i) => (
            <div key={i} style={{ fontSize: '9.5px', color: 'var(--kw-mute)', fontWeight: 600 }}>
              {xl}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
          {chart.legend.map((lg, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '3px', background: lg.color }} />
              <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--kw-mute)' }}>{lg.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px', background: 'var(--kw-line)', borderBottom: '2px solid var(--kw-line)' }}>
        {chart.stats.map((st, i) => (
          <div key={i} style={{ background: 'var(--kw-card)', padding: '12px 12px 13px' }}>
            <div style={{ fontSize: '9.5px', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{st.k}</div>
            <div style={{ fontSize: '21px', fontWeight: 800, letterSpacing: '-.035em', marginTop: '5px' }}>{st.v}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 14px 100px' }}>
        <button
          onClick={() => go('summary')}
          style={{ width: '100%', border: '2px solid var(--kw-line)', background: 'transparent', color: 'var(--kw-ink)', fontFamily: 'Archivo', fontSize: '14px', fontWeight: 700, textAlign: 'left', padding: '14px 16px', borderRadius: '3px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>{t.docSummary}</span>
          <span style={{ fontSize: '16px' }}>&#8594;</span>
        </button>
      </div>
    </>
  );
}
