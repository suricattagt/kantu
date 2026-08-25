import { useMemo } from 'react';
import { useKantu } from '../state/store';
import { dictionaries } from '../i18n/dict';
import { meta, tagLabel, whenNoTime } from '../i18n/meta';
import { avgOf, sorted } from '../state/domain';
import { shareDoctorSummary } from '../state/exports';
import type { SymptomTag } from '../i18n/types';

const SUMMARY_TYPES = ['bp', 'glucose', 'hr', 'weight', 'mood', 'focus'] as const;

export function Summary() {
  const { lang, entries, now, say, weightUnit } = useKantu();
  const t = dictionaries[lang];

  const sumRows = useMemo(
    () => SUMMARY_TYPES.map((k) => ({ k: meta(lang, k).full, v: avgOf(lang, entries, k, weightUnit) || '—' })),
    [lang, entries, weightUnit],
  );

  const sumSymptoms = useMemo(() => {
    const counts: Partial<Record<SymptomTag, number>> = {};
    entries.filter((e) => e.type === 'symptom').forEach((e) => (e.tags || []).forEach((tg) => (counts[tg] = (counts[tg] || 0) + 1)));
    const keys = Object.keys(counts) as SymptomTag[];
    if (!keys.length) return [lang === 'es' ? 'Ninguno anotado' : 'None logged'];
    return keys.map((k) => `${tagLabel(lang, k)} × ${counts[k]}`);
  }, [lang, entries]);

  const sumPeriod = useMemo(() => {
    const all = sorted(entries);
    if (!all.length) return '—';
    return `${whenNoTime(lang, all[0].at, now)} — ${whenNoTime(lang, all[all.length - 1].at, now)}`;
  }, [lang, entries, now]);

  const share = async () => {
    const outcome = await shareDoctorSummary(lang, entries, sumPeriod, weightUnit);
    if (outcome === 'shared') say(t.summaryShared);
    else if (outcome === 'downloaded') say(t.summaryDownloaded);
  };

  return (
    <>
      <div style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line)', padding: '16px 14px' }}>
        <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{t.docPeriod}</div>
        <div style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-.03em', marginTop: '5px' }}>{sumPeriod}</div>
        <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--kw-mute)', marginTop: '7px', textWrap: 'pretty' }}>{t.docSub}</div>
      </div>

      <div style={{ borderBottom: '2px solid var(--kw-line)' }}>
        {sumRows.map((r) => (
          <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px', padding: '11px 14px', background: 'var(--kw-card)', borderBottom: '1px solid var(--kw-line2)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{r.k}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-.01em' }}>{r.v}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line)', padding: '14px' }}>
        <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{t.docSymp}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
          {sumSymptoms.map((s, i) => (
            <div key={i} style={{ background: 'var(--kw-lav100)', border: '1px solid var(--kw-lav300)', color: 'var(--kw-lav700)', fontSize: '11.5px', fontWeight: 700, padding: '5px 9px', borderRadius: '3px' }}>
              {s}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 14px 100px' }}>
        <button
          onClick={share}
          style={{ width: '100%', border: 0, background: 'var(--kw-lav)', color: '#fffdfb', fontFamily: 'Archivo', fontSize: '15px', fontWeight: 700, textAlign: 'left', padding: '16px 18px', borderRadius: '3px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>{t.docShare}</span>
          <span style={{ fontSize: '16px' }}>&#8599;</span>
        </button>
      </div>
    </>
  );
}
