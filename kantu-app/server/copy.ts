// Disclaimer copy for the confirmation email — mirrors the in-app disclaimer text
// (dscHead / dscBody) from the Kantu design spec, ES/EN.
export type Lang = 'es' | 'en';

export const disclaimerCopy: Record<Lang, { subject: string; heading: string; body: string; ack: string }> = {
  es: {
    subject: 'Kantu — aviso importante sobre tus registros',
    heading: 'Esto no es un diagnóstico médico',
    body: 'Kantu es una libreta: guarda lo que tú anotas y lo ordena. No mide, no interpreta ni diagnostica. Ninguna cifra, color ni frase de esta app equivale a la opinión de un profesional. Lleva estos registros a tu médica o médico: solo ellos pueden examinarte y decirte qué significan. Si algo cambia de golpe o te sientes mal, busca atención médica de inmediato — no esperes a la próxima anotación.',
    ack: 'Confirmaste: entiendes que Kantu no te da un diagnóstico y que un profesional de salud debe revisar tus registros.',
  },
  en: {
    subject: 'Kantu — important notice about your records',
    heading: 'This is not a medical diagnosis',
    body: 'Kantu is a notebook: it keeps what you write down and puts it in order. It does not measure, interpret or diagnose. No number, color or sentence in this app is a professional opinion. Take these records to your doctor — only they can examine you and tell you what they mean. If something changes suddenly or you feel unwell, seek medical care right away; do not wait for the next entry.',
    ack: 'You confirmed: you understand Kantu gives you no diagnosis and that a health professional must review your records.',
  },
};

export function renderDisclaimerEmail(lang: Lang) {
  const c = disclaimerCopy[lang] || disclaimerCopy.es;
  const html = `<!doctype html>
<html><body style="margin:0;background:#f4f2f7;font-family:Arial,Helvetica,sans-serif;color:#211f28;padding:24px 0">
  <table role="presentation" width="100%"><tr><td align="center">
    <table role="presentation" width="480" style="background:#fffdfb;border:2px solid #16141c">
      <tr><td style="background:#16141c;color:#fffdfb;padding:18px 22px">
        <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;opacity:.75">Kantu</div>
        <div style="font-size:22px;font-weight:800;line-height:1.15;margin-top:6px">${c.heading}</div>
      </td></tr>
      <tr><td style="padding:20px 22px 8px;font-size:14px;line-height:1.6">${c.body}</td></tr>
      <tr><td style="padding:8px 22px 22px;font-size:13px;line-height:1.6;color:#5b5568">${c.ack}</td></tr>
    </table>
  </td></tr></table>
</body></html>`;
  const text = `${c.heading}\n\n${c.body}\n\n${c.ack}`;
  return { subject: c.subject, html, text };
}
