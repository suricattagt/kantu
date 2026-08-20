import { useMemo } from 'react';
import { useKantu } from '../state/store';
import { dictionaries } from '../i18n/dict';
import { ctxWord, meta, moodWord, focusWord, sevWord, tagLabel, when } from '../i18n/meta';
import { FILTER_TYPES, status, statusColorVar } from '../state/domain';
import { chipStyle } from '../components/styleHelpers';
import type { Entry } from '../state/entry';

function valueLabel(lang: 'es' | 'en', e: Entry): string {
  if (e.type === 'bp') return `${e.v.sys}/${e.v.dia} mmHg`;
  if (e.type === 'glucose') return `${e.v.n} mg/dL · ${ctxWord(lang, e.v.ctx)}`;
  if (e.type === 'hr') return `${e.v.n} ${meta(lang, 'hr').unit}`;
  if (e.type === 'weight') return `${(e.v.n ?? 0).toFixed(1)} kg`;
  if (e.type === 'mood') return `${moodWord(lang, e.v.n ?? 0)} · ${e.v.n}/5`;
  if (e.type === 'focus') return `${focusWord(lang, e.v.n ?? 0)} · ${e.v.n}/5`;
  if (e.type === 'symptom') return `${(e.tags || []).map((tg) => tagLabel(lang, tg)).join(', ')} · ${sevWord(lang, e.sev ?? 1)}`;
  return e.note || '—';
}

export function History() {
  const { lang, entries, now, filter, setFilter, deleteEntry } = useKantu();
  const t = dictionaries[lang];

  const items = useMemo(
    () =>
      entries
        .slice()
        .sort((a, b) => b.at - a.at)
        .filter((e) => filter === 'all' || e.type === filter),
    [entries, filter],
  );

  return (
    <>
      <div style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line)', padding: '12px 14px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {FILTER_TYPES.map((k) => (
            <button key={k} onClick={() => setFilter(k)} style={chipStyle(filter === k, { fontSize: '11.5px', padding: '7px 10px' })}>
              {k === 'all' ? t.all : meta(lang, k).full}
            </button>
          ))}
        </div>
      </div>

      {items.map((e) => {
        const m = meta(lang, e.type);
        const st = status(lang, e.type, e);
        const c = statusColorVar(st.key);
        return (
          <div key={e.id} style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line2)', padding: '12px 14px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                flex: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '3px',
                fontSize: '13px',
                fontWeight: 800,
                background: 'var(--kw-lav100)',
                color: 'var(--kw-lav700)',
                border: '1px solid ' + (st.key === 'high' ? c : 'var(--kw-lav200)'),
              }}
            >
              {m.full.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'baseline' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-.015em' }}>{m.full}</div>
                <div style={{ fontSize: '10px', color: 'var(--kw-mute)', whiteSpace: 'nowrap', fontWeight: 600 }}>{when(lang, e.at, now)}</div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--kw-ink)', marginTop: '3px', fontVariantNumeric: 'tabular-nums' }}>{valueLabel(lang, e)}</div>
              {e.type !== 'note' && e.note && (
                <div style={{ fontSize: '11.5px', color: 'var(--kw-mute)', marginTop: '3px', lineHeight: 1.45, textWrap: 'pretty' }}>{e.note}</div>
              )}
            </div>
            <button
              onClick={() => deleteEntry(e.id)}
              aria-label="borrar"
              style={{ border: '1px solid var(--kw-line2)', background: 'transparent', color: 'var(--kw-mute)', fontFamily: 'Archivo', fontSize: '11px', fontWeight: 700, padding: '5px 8px', borderRadius: '3px', cursor: 'pointer', flex: 'none' }}
            >
              {t.del}
            </button>
          </div>
        );
      })}

      <div style={{ padding: '14px 14px 100px', fontSize: '10.5px', color: 'var(--kw-mute)' }}>
        {items.length}
        {t.entriesSuffix}
      </div>
    </>
  );
}
