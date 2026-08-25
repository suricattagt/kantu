import { useState, type CSSProperties } from 'react';
import { useKantu } from '../state/store';
import { dictionaries } from '../i18n/dict';
import { sendDisclaimerEmail } from '../state/api';
import { BloomGesture } from '../components/BloomGesture';
import { Toast } from '../components/Toast';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TOTAL_STEPS = 3;

const ONB_POINTS: Record<'es' | 'en', { n: string; text: string }[]> = {
  es: [
    { n: '01', text: 'Presión, glucosa, pulso y peso — en dos toques.' },
    { n: '02', text: 'Ánimo, memoria y foco cuentan igual que un número.' },
    { n: '03', text: 'Un resumen claro para llevar a tu próxima cita.' },
  ],
  en: [
    { n: '01', text: 'Blood pressure, glucose, pulse and weight — in two taps.' },
    { n: '02', text: 'Mood, memory and focus count as much as any number.' },
    { n: '03', text: 'A clear summary to take to your next appointment.' },
  ],
};

function bigLangBtnStyle(active: boolean): CSSProperties {
  return {
    flex: 1,
    fontFamily: 'Archivo',
    fontSize: '14px',
    fontWeight: 800,
    padding: '13px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
    textAlign: 'center',
    border: '2px solid rgba(255,253,251,.6)',
    background: active ? '#fffdfb' : 'transparent',
    color: active ? 'var(--kw-lav700)' : '#fffdfb',
  };
}

function ctaStyle(enabled: boolean): CSSProperties {
  return {
    width: '100%',
    border: 0,
    background: enabled ? '#fffdfb' : 'rgba(255,253,251,.28)',
    color: enabled ? 'var(--kw-lav700)' : 'rgba(255,253,251,.7)',
    fontFamily: 'Archivo',
    fontSize: '15px',
    fontWeight: 700,
    textAlign: 'left',
    padding: '16px 18px',
    borderRadius: '3px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };
}

const fieldInputStyle: CSSProperties = {
  width: '100%',
  marginTop: '9px',
  boxSizing: 'border-box',
  background: '#fffdfb',
  border: '2px solid transparent',
  borderRadius: '3px',
  color: '#211f28',
  fontFamily: 'Archivo',
  fontSize: '17px',
  fontWeight: 600,
  padding: '12px 14px',
  outline: 'none',
};

function StepNav({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '18px 16px 0' }}>
      <div>
        {step > 0 && (
          <button
            onClick={onBack}
            style={{ border: 0, background: 'transparent', color: '#fffdfb', opacity: 0.85, fontFamily: 'Archivo', fontSize: '13px', fontWeight: 700, cursor: 'pointer', padding: '6px 4px', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            &#8592;
          </button>
        )}
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fffdfb', opacity: i === step ? 1 : i < step ? 0.6 : 0.28 }} />
        ))}
      </div>
      <div />
    </div>
  );
}

export function Onboarding() {
  const { lang, setLang, name, setName, email, setEmail, showDsc, setShowDsc, say, toast } = useKantu();
  const t = dictionaries[lang];
  const [step, setStep] = useState(0);
  const nameOk = name.trim().length > 0;
  const emailOk = EMAIL_RE.test(email.trim());

  const next = () => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const goToHow = () => {
    if (!nameOk) return say(t.nameInvalid);
    next();
  };

  const submitEmail = () => {
    if (!emailOk) return say(t.emailInvalid);
    setShowDsc(true);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--kw-lav)', color: '#fffdfb', overflow: 'auto' }}>
      <StepNav step={step} onBack={back} />

      {step === 0 && (
        <>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 24px', textAlign: 'center' }}>
            <BloomGesture />
            <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-.03em', marginTop: '20px' }}>{t.greetingWord}</div>
            <div style={{ fontSize: '11px', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.75, marginTop: '8px' }}>Kantu</div>

            <div style={{ marginTop: '32px', width: '100%', maxWidth: '320px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 800, opacity: 0.85, marginBottom: '9px' }}>{t.langLabel}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setLang('es')} style={bigLangBtnStyle(lang === 'es')}>
                  Español
                </button>
                <button onClick={() => setLang('en')} style={bigLangBtnStyle(lang === 'en')}>
                  English
                </button>
              </div>
            </div>
          </div>
          <div style={{ padding: '0 20px 26px' }}>
            <button onClick={next} style={ctaStyle(true)}>
              <span>{t.continueLabel}</span>
              <span style={{ fontSize: '18px' }}>&#8594;</span>
            </button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 24px' }}>
            <div style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.1, maxWidth: '320px', textWrap: 'pretty' }}>{t.nameStepHead}</div>
            <div style={{ fontSize: '14px', lineHeight: 1.5, opacity: 0.85, marginTop: '12px', maxWidth: '300px', textWrap: 'pretty' }}>{t.nameStepSub}</div>

            <div style={{ marginTop: '28px' }}>
              <label htmlFor="kantu-name" style={{ display: 'block', fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 800, opacity: 0.85 }}>
                {t.nameLabel}
              </label>
              <input
                id="kantu-name"
                type="text"
                className="kw-onb-email"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePh}
                autoComplete="given-name"
                autoFocus
                style={fieldInputStyle}
              />
              <div style={{ fontSize: '11px', lineHeight: 1.45, opacity: 0.8, marginTop: '8px', maxWidth: '300px', textWrap: 'pretty' }}>{t.nameHelp}</div>
            </div>
          </div>
          <div style={{ padding: '0 20px 26px' }}>
            <button onClick={goToHow} style={ctaStyle(nameOk)}>
              <span>{t.continueLabel}</span>
              <span style={{ fontSize: '18px' }}>&#8594;</span>
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ padding: '20px 24px 0' }}>
            <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.15, maxWidth: '320px', textWrap: 'pretty' }}>{t.aboutHead}</div>
            <div style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.45, maxWidth: '320px', marginTop: '10px', textWrap: 'pretty' }}>{t.onbTitle}</div>
          </div>

          <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: '1fr', gap: '2px', background: 'rgba(255,253,251,.4)' }}>
            {ONB_POINTS[lang].map((p) => (
              <div key={p.n} style={{ background: 'var(--kw-lav)', padding: '12px 24px', display: 'flex', gap: '14px', alignItems: 'baseline' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.7, minWidth: '16px' }}>{p.n}</div>
                <div style={{ fontSize: '13.5px', lineHeight: 1.45, opacity: 0.95 }}>{p.text}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px 24px 0', fontSize: '12.5px', lineHeight: 1.5, opacity: 0.85, maxWidth: '300px', textWrap: 'pretty' }}>{t.onbNote}</div>

          <div style={{ padding: '18px 24px 0' }}>
            <label htmlFor="kantu-email" style={{ display: 'block', fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 800, opacity: 0.85 }}>
              {t.emailLabel}
            </label>
            <input
              id="kantu-email"
              type="email"
              className="kw-onb-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPh}
              autoComplete="email"
              style={fieldInputStyle}
            />
            <div style={{ fontSize: '11px', lineHeight: 1.45, opacity: 0.8, marginTop: '8px', maxWidth: '300px', textWrap: 'pretty' }}>{t.emailHelp}</div>
          </div>

          <div style={{ padding: '22px 24px 26px' }}>
            <button onClick={submitEmail} style={ctaStyle(emailOk)}>
              <span>{t.onbStart}</span>
              <span style={{ fontSize: '18px' }}>&#8594;</span>
            </button>
          </div>
        </>
      )}

      <Toast message={toast} />
      {showDsc && <DisclaimerModal />}
    </div>
  );
}

function DisclaimerModal() {
  const { lang, email, ack, setAck, setShowDsc, say, completeOnboarding } = useKantu();
  const t = dictionaries[lang];

  const ackBoxStyle: CSSProperties = {
    width: '20px',
    height: '20px',
    flex: '0 0 20px',
    border: '2px solid #16141c',
    background: ack ? '#16141c' : 'transparent',
    color: '#fffdfb',
    fontSize: '13px',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  };

  const acceptStyle: CSSProperties = {
    width: '100%',
    border: 0,
    background: ack ? 'var(--kw-lav)' : 'rgba(22,20,28,.18)',
    color: ack ? '#fffdfb' : 'rgba(22,20,28,.5)',
    fontFamily: 'Archivo',
    fontSize: '14.5px',
    fontWeight: 800,
    textAlign: 'left',
    padding: '14px 15px',
    cursor: ack ? 'pointer' : 'not-allowed',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const startApp = () => {
    if (!ack) {
      say(t.ackRequired);
      return;
    }
    completeOnboarding();
    sendDisclaimerEmail(email, lang)
      .then((res) => {
        if (res.sent) say(t.emailSent);
      })
      .catch(() => say(t.emailSendFailed));
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        background: 'rgba(12,10,18,.72)',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '18px',
      }}
    >
      <div style={{ width: '100%', background: '#fffdfb', color: '#16141c', border: '2px solid #16141c' }}>
        <div style={{ background: '#16141c', color: '#fffdfb', padding: '13px 16px 14px' }}>
          <div style={{ fontSize: '9.5px', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 800, opacity: 0.75 }}>
            {t.dscKicker}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.05, marginTop: '6px', textWrap: 'pretty' }}>
            {t.dscHead}
          </div>
        </div>
        <div style={{ padding: '14px 16px 0', fontSize: '13.5px', lineHeight: 1.55, fontWeight: 500, textWrap: 'pretty' }}>{t.dscBody}</div>
        <div style={{ padding: '14px 16px 0' }}>
          <div style={{ fontSize: '11.5px', lineHeight: 1.45, fontWeight: 600, color: '#5b5568' }}>
            {t.dscTo} <strong style={{ fontWeight: 800, color: '#16141c' }}>{email}</strong>
          </div>
        </div>
        <button
          onClick={() => setAck((a) => !a)}
          style={{ margin: '14px 16px 0', display: 'flex', gap: '11px', alignItems: 'flex-start', textAlign: 'left', background: 'transparent', border: 0, padding: 0, cursor: 'pointer', color: '#16141c', fontFamily: 'Archivo' }}
        >
          <span style={ackBoxStyle}>{ack ? '✓' : ''}</span>
          <span style={{ fontSize: '12.5px', lineHeight: 1.45, fontWeight: 700, textWrap: 'pretty' }}>{t.dscAck}</span>
        </button>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={startApp} style={acceptStyle}>
            <span>{t.dscAccept}</span>
            <span style={{ fontSize: '16px' }}>&#8594;</span>
          </button>
          <button
            onClick={() => setShowDsc(false)}
            style={{ border: '2px solid #16141c', background: 'transparent', color: '#16141c', fontFamily: 'Archivo', fontSize: '13px', fontWeight: 700, textAlign: 'left', padding: '12px 14px', cursor: 'pointer' }}
          >
            {t.dscBack}
          </button>
        </div>
      </div>
    </div>
  );
}
