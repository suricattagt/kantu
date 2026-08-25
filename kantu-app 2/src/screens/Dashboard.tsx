import { useMemo } from 'react';
import { useKantu } from '../state/store';
import { dictionaries } from '../i18n/dict';
import { ctxWord, meta, moodWord, focusWord, when } from '../i18n/meta';
import { VITAL_TYPES, buildInsights, latest, sorted, spark, status, statusColorVar, valOf } from '../state/domain';
import { pillStyle } from '../components/styleHelpers';
import { DisclaimerBox } from '../components/DisclaimerBox';
import { displayWeight } from '../state/weight';
import type { VitalType } from '../i18n/types';

export function Dashboard() {
  const { lang, entries, now, go, setMetric, pickLogType, name, weightUnit } = useKantu();
  const t = dictionaries[lang];
  const greet = name.trim() ? `${t.greet}, ${name.trim()}` : t.greet;

  const vitals = useMemo(
    () =>
      VITAL_TYPES.map((type) => {
        const m = meta(lang, type);
        const e = latest(entries, type);
        const st = status(lang, type, e);
        const series = sorted(entries, type).slice(-7).map(valOf);
        let value = '—';
        let unit = m.unit;
        let sub = lang === 'es' ? 'Sin registros' : 'No entries';
        if (e) {
          if (type === 'bp') value = `${e.v.sys}/${e.v.dia}`;
          else if (type === 'weight') {
            value = displayWeight(e.v.n ?? 0, weightUnit).toFixed(1);
            unit = weightUnit;
          } else value = String(e.v.n);
          sub = when(lang, e.at, now);
          if (type === 'glucose' && e.v.ctx) {
            sub = `${ctxWord(lang, e.v.ctx)} · ${sub}`;
          }
        }
        return { type, m, unit, value, sub, st, spark: spark(series) };
      }),
    [lang, entries, now, weightUnit],
  );

  const feelings = useMemo(
    () =>
      (['mood', 'focus'] as const).map((type) => {
        const e = latest(entries, type);
        const n = e?.v.n ?? 0;
        const word = e ? (type === 'mood' ? moodWord(lang, n) : focusWord(lang, n)) : lang === 'es' ? 'Sin registrar' : 'Not logged';
        return { type, label: meta(lang, type).full, word, n, whenText: e ? when(lang, e.at, now) : lang === 'es' ? 'Toca para anotar' : 'Tap to log' };
      }),
    [lang, entries, now],
  );

  const insights = useMemo(() => buildInsights(lang, entries, now).slice(0, 2), [lang, entries, now]);

  const homeSub = useMemo(() => {
    const day = (ts: number) => new Date(ts).toDateString();
    const today = day(now);
    const count = entries.filter((e) => day(e.at) === today).length;
    if (count === 0) return t.homeSubEmpty;
    if (count === 1) return t.homeSubOne;
    return count + t.homeSubManySuffix;
  }, [entries, now, t]);

  const openVital = (type: VitalType) => {
    setMetric(type);
    go('trends');
  };

  const openFeeling = (type: 'mood' | 'focus') => {
    pickLogType(type);
    go('log');
  };

  return (
    <>
      <div style={{ padding: '16px 16px 12px', background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line)' }}>
        <div style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-.01em' }}>{greet}</div>
        <div style={{ fontSize: '12px', color: 'var(--kw-mute)', marginTop: '3px' }}>{homeSub}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: 'var(--kw-line)', borderBottom: '2px solid var(--kw-line)' }}>
        {vitals.map((v) => (
          <button
            key={v.type}
            onClick={() => openVital(v.type)}
            style={{ background: 'var(--kw-card)', border: 0, padding: '12px 13px 10px', textAlign: 'left', cursor: 'pointer', fontFamily: 'Archivo', color: 'var(--kw-ink)', display: 'flex', flexDirection: 'column', gap: '7px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px', width: '100%' }}>
              <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{v.m.label}</div>
              <div style={pillStyle(v.st.key)}>{v.st.label}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <div style={{ fontSize: '29px', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 0.9 }}>{v.value}</div>
              <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--kw-mute)' }}>{v.unit}</div>
            </div>
            <div style={{ width: '100%', height: '22px' }}>
              <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ width: '100%', height: '22px', display: 'block', overflow: 'visible' }}>
                <path d={v.spark} fill="none" stroke={statusColorVar(v.st.key === 'none' ? 'good' : v.st.key)} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--kw-mute)' }}>{v.sub}</div>
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line)' }}>
        <div style={{ padding: '13px 14px 8px', fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>
          {t.feelHead}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: 'var(--kw-line2)' }}>
          {feelings.map((f) => (
            <button
              key={f.type}
              onClick={() => openFeeling(f.type)}
              style={{ background: 'var(--kw-card)', border: 0, padding: '4px 14px 14px', textAlign: 'left', cursor: 'pointer', fontFamily: 'Archivo', color: 'var(--kw-ink)' }}
            >
              <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--kw-mute)' }}>{f.label}</div>
              <div style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-.02em', marginTop: '4px' }}>{f.word}</div>
              <div style={{ display: 'flex', gap: '3px', marginTop: '9px' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    style={{ width: '13px', height: '13px', borderRadius: '3px', background: i <= f.n ? 'var(--kw-lav)' : 'transparent', border: '1px solid ' + (i <= f.n ? 'var(--kw-lav)' : 'var(--kw-line)') }}
                  />
                ))}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--kw-mute)', marginTop: '7px' }}>{f.whenText}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--kw-lav100)', borderBottom: '2px solid var(--kw-line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '13px 14px 6px' }}>
          <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-lav700)' }}>{t.insHead}</div>
          <button
            onClick={() => go('insights')}
            style={{ border: 0, background: 'transparent', fontFamily: 'Archivo', fontSize: '11px', fontWeight: 700, color: 'var(--kw-lav700)', cursor: 'pointer', padding: 0, textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            {t.seeAll}
          </button>
        </div>
        {insights.map((i, idx) => (
          <div key={idx} style={{ padding: '10px 14px 13px', borderTop: '2px solid ' + i.tone }}>
            <div style={{ fontSize: '13.5px', fontWeight: 700, letterSpacing: '-.01em', lineHeight: 1.25 }}>{i.title}</div>
            <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--kw-mute)', marginTop: '4px', textWrap: 'pretty' }}>{i.body}</div>
          </div>
        ))}
      </div>

      <DisclaimerBox heading={t.dscHead} body={t.dscBody} style={{ margin: '14px', marginBottom: '90px' }} />
    </>
  );
}
