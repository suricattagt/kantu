import { useKantu, type FormState } from '../state/store';
import { dictionaries } from '../i18n/dict';
import { ctxWord, meta, moodWord, focusWord, sevWord, tagLabel } from '../i18n/meta';
import { SYMPTOM_TAGS } from '../state/domain';
import { chipStyle, segStyle } from '../components/styleHelpers';
import { kgToLb, lbToKg, type WeightUnit } from '../state/weight';
import type { GlucoseContext, SymptomTag } from '../i18n/types';

interface FieldSpec {
  label: string;
  val: number | undefined;
  unit: string;
  step: number;
  onMinus: () => void;
  onPlus: () => void;
  onSet: (v: number | undefined) => void;
  unitToggle?: { unit: WeightUnit; onSet: (u: WeightUnit) => void };
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function LogForm() {
  const { lang, logType, form, setForm, backToPick, saveEntry, weightUnit, setWeightUnit } = useKantu();
  const t = dictionaries[lang];
  if (!logType) return null;
  const f = form;

  const bump = (k: keyof FormState, d: number, min: number, max: number, dec = 0) => {
    const cur = (f[k] as number) ?? 0;
    const next = Number((cur + d).toFixed(dec));
    setForm({ [k]: clamp(next, min, max) } as Partial<FormState>);
  };

  let fields: FieldSpec[] = [];
  if (logType === 'bp') {
    fields = [
      {
        label: lang === 'es' ? 'SISTÓLICA (ALTA)' : 'SYSTOLIC (UPPER)',
        val: f.sys,
        unit: 'mmHg',
        step: 1,
        onMinus: () => bump('sys', -1, 70, 250),
        onPlus: () => bump('sys', 1, 70, 250),
        onSet: (v) => setForm({ sys: v }),
      },
      {
        label: lang === 'es' ? 'DIASTÓLICA (BAJA)' : 'DIASTOLIC (LOWER)',
        val: f.dia,
        unit: 'mmHg',
        step: 1,
        onMinus: () => bump('dia', -1, 40, 160),
        onPlus: () => bump('dia', 1, 40, 160),
        onSet: (v) => setForm({ dia: v }),
      },
    ];
  } else if (logType === 'glucose') {
    fields = [
      {
        label: lang === 'es' ? 'GLUCOSA' : 'GLUCOSE',
        val: f.n,
        unit: 'mg/dL',
        step: 1,
        onMinus: () => bump('n', -1, 40, 500),
        onPlus: () => bump('n', 1, 40, 500),
        onSet: (v) => setForm({ n: v }),
      },
    ];
  } else if (logType === 'hr') {
    fields = [
      {
        label: lang === 'es' ? 'PULSO EN REPOSO' : 'RESTING HEART RATE',
        val: f.n,
        unit: lang === 'es' ? 'lpm' : 'bpm',
        step: 1,
        onMinus: () => bump('n', -1, 35, 200),
        onPlus: () => bump('n', 1, 35, 200),
        onSet: (v) => setForm({ n: v }),
      },
    ];
  } else if (logType === 'weight') {
    // Entries always store weight in kg; the field displays/accepts whichever unit is selected.
    const toDisplay = (kg: number) => (weightUnit === 'lb' ? kgToLb(kg) : kg);
    const toKg = (v: number) => (weightUnit === 'lb' ? lbToKg(v) : v);
    const step = weightUnit === 'lb' ? 0.2 : 0.1;
    fields = [
      {
        label: lang === 'es' ? 'PESO' : 'WEIGHT',
        val: f.n !== undefined ? Number(toDisplay(f.n).toFixed(1)) : undefined,
        unit: weightUnit,
        step,
        onMinus: () => bump('n', -toKg(step), 25, 250, 2),
        onPlus: () => bump('n', toKg(step), 25, 250, 2),
        onSet: (v) => setForm({ n: v === undefined ? undefined : toKg(v) }),
        unitToggle: { unit: weightUnit, onSet: setWeightUnit },
      },
    ];
  }

  const hasCtx = logType === 'glucose';
  const hasScale = logType === 'mood' || logType === 'focus';
  const hasTags = logType === 'symptom';

  const ctxOpts: GlucoseContext[] = ['fasting', 'before', 'after', 'random'];
  const scaleNs = [5, 4, 3, 2, 1];

  const toggleTag = (k: SymptomTag) => {
    const cur = f.tags || [];
    const i = cur.indexOf(k);
    const next = i >= 0 ? cur.filter((x) => x !== k) : [...cur, k];
    setForm({ tags: next });
  };

  const scalePrompt =
    logType === 'mood'
      ? lang === 'es'
        ? '¿Cómo te sientes hoy? No hace falta explicar por qué.'
        : 'How do you feel today? No need to explain why.'
      : lang === 'es'
        ? '¿Cómo está tu cabeza hoy — clara o nublada?'
        : 'How is your head today — clear or foggy?';

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line)' }}>
        <button
          onClick={backToPick}
          style={{ border: '1px solid var(--kw-line)', background: 'transparent', color: 'var(--kw-ink)', fontFamily: 'Archivo', fontSize: '12px', fontWeight: 700, padding: '6px 10px', borderRadius: '3px', cursor: 'pointer' }}
        >
          &#8592;
        </button>
        <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-.015em' }}>{meta(lang, logType).full}</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: '10.5px', color: 'var(--kw-mute)' }}>{t.nowLabel}</div>
      </div>

      {fields.map((fd) => (
        <div key={fd.label} style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line2)', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{fd.label}</div>
            {fd.unitToggle && (
              <div style={{ display: 'flex', gap: '2px', background: 'var(--kw-line2)' }}>
                {(['kg', 'lb'] as WeightUnit[]).map((u) => (
                  <button key={u} onClick={() => fd.unitToggle!.onSet(u)} style={{ ...segStyle(fd.unitToggle!.unit === u), padding: '5px 10px', fontSize: '11px' }}>
                    {u}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '9px' }}>
            <button
              onClick={fd.onMinus}
              aria-label="menos"
              style={{ width: '56px', height: '56px', flex: 'none', border: '2px solid var(--kw-line)', background: 'transparent', color: 'var(--kw-ink)', fontFamily: 'Archivo', fontSize: '24px', fontWeight: 700, borderRadius: '3px', cursor: 'pointer' }}
            >
              &#8722;
            </button>
            <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: '5px', justifyContent: 'flex-start', paddingLeft: '4px', minWidth: 0 }}>
              <input
                type="number"
                inputMode="decimal"
                step={fd.step}
                className="kw-num-input"
                value={fd.val ?? ''}
                onChange={(e) => {
                  const raw = e.target.value;
                  fd.onSet(raw === '' ? undefined : Number(raw));
                }}
                style={{
                  // `size` has no effect on type="number" inputs, so width is driven
                  // by content length directly (ch = width of "0" in the current font).
                  width: `${Math.max(2, String(fd.val ?? '').length) + 1}ch`,
                  maxWidth: '100%',
                  minWidth: 0,
                  border: 0,
                  background: 'transparent',
                  color: 'var(--kw-ink)',
                  fontFamily: 'Archivo',
                  fontSize: '44px',
                  fontWeight: 800,
                  letterSpacing: '-.045em',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  padding: 0,
                  outline: 'none',
                }}
              />
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--kw-mute)', flex: 'none' }}>{fd.unit}</div>
            </div>
            <button
              onClick={fd.onPlus}
              aria-label="mas"
              style={{ width: '56px', height: '56px', flex: 'none', border: '2px solid var(--kw-lav)', background: 'var(--kw-lav)', color: '#fffdfb', fontFamily: 'Archivo', fontSize: '24px', fontWeight: 700, borderRadius: '3px', cursor: 'pointer' }}
            >
              +
            </button>
          </div>
        </div>
      ))}

      {hasCtx && (
        <div style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line2)', padding: '14px' }}>
          <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{t.ctxHead}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
            {ctxOpts.map((c) => (
              <button key={c} onClick={() => setForm({ ctx: c })} style={chipStyle(f.ctx === c)}>
                {ctxWord(lang, c)}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasScale && (
        <div style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line2)' }}>
          <div style={{ padding: '14px 14px 4px', fontSize: '13px', lineHeight: 1.45, color: 'var(--kw-mute)', textWrap: 'pretty' }}>{scalePrompt}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2px', background: 'var(--kw-line2)', marginTop: '12px' }}>
            {scaleNs.map((n) => {
              const active = f.n === n;
              return (
                <button
                  key={n}
                  onClick={() => setForm({ n })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: active ? 'var(--kw-lav100)' : 'var(--kw-card)',
                    border: 0,
                    borderLeft: '4px solid ' + (active ? 'var(--kw-lav)' : 'transparent'),
                    padding: '15px 14px',
                    cursor: 'pointer',
                    fontFamily: 'Archivo',
                    color: 'var(--kw-ink)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: active ? 'var(--kw-lav)' : 'transparent',
                        color: active ? '#fffdfb' : 'var(--kw-mute)',
                        border: '1px solid ' + (active ? 'var(--kw-lav)' : 'var(--kw-line)'),
                      }}
                    >
                      {n}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-.015em' }}>{logType === 'mood' ? moodWord(lang, n) : focusWord(lang, n)}</div>
                  </div>
                  <div style={{ fontSize: '15px', color: 'var(--kw-lav)', opacity: active ? 1 : 0 }}>&#10003;</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hasTags && (
        <div style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line2)', padding: '14px' }}>
          <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{t.tagHead}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
            {SYMPTOM_TAGS.map((k) => (
              <button key={k} onClick={() => toggleTag(k)} style={chipStyle((f.tags || []).includes(k))}>
                {tagLabel(lang, k)}
              </button>
            ))}
          </div>
          <div style={{ height: '2px', background: 'var(--kw-line2)', margin: '16px 0 14px' }} />
          <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{t.sevHead}</div>
          <div style={{ display: 'flex', gap: '2px', marginTop: '10px', background: 'var(--kw-line2)' }}>
            {[1, 2, 3].map((n) => (
              <button key={n} onClick={() => setForm({ sev: n })} style={segStyle(f.sev === n)}>
                {sevWord(lang, n)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: 'var(--kw-card)', borderBottom: '2px solid var(--kw-line)', padding: '14px' }}>
        <div style={{ fontSize: '9.5px', letterSpacing: '.13em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--kw-mute)' }}>{t.noteHead}</div>
        <textarea
          value={f.note || ''}
          onChange={(e) => setForm({ note: e.target.value })}
          placeholder={t.notePh}
          rows={3}
          style={{ width: '100%', boxSizing: 'border-box', marginTop: '9px', fontFamily: 'Archivo', fontSize: '14px', lineHeight: 1.5, color: 'var(--kw-ink)', background: 'var(--kw-bg)', border: '1px solid var(--kw-line)', borderRadius: '3px', padding: '10px', resize: 'none' }}
        />
      </div>

      <div style={{ padding: '16px 14px 100px' }}>
        <button
          onClick={saveEntry}
          style={{ width: '100%', border: 0, background: 'var(--kw-lav)', color: '#fffdfb', fontFamily: 'Archivo', fontSize: '15px', fontWeight: 700, textAlign: 'left', padding: '16px 18px', borderRadius: '3px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>{t.save}</span>
          <span style={{ fontSize: '13px', fontWeight: 600, opacity: 0.8 }}>{t.nowLabel}</span>
        </button>
      </div>
    </>
  );
}
