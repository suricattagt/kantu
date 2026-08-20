import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { renderDisclaimerEmail, type Lang } from './copy.ts';

const app = express();
app.use(cors());
app.use(express.json());

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function buildTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT ? Number(SMTP_PORT) : 587,
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

app.post('/api/send-disclaimer', async (req, res) => {
  const email = String(req.body?.email || '').trim();
  const lang: Lang = req.body?.lang === 'en' ? 'en' : 'es';

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_email' });
  }

  const { subject, html, text } = renderDisclaimerEmail(lang);
  const transport = buildTransport();

  if (!transport) {
    // No SMTP configured — don't block onboarding on missing infra, but say so.
    console.warn(`[send-disclaimer] SMTP not configured; skipped sending to ${email}`);
    return res.json({ ok: true, sent: false, reason: 'smtp_not_configured' });
  }

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject,
      html,
      text,
    });
    return res.json({ ok: true, sent: true });
  } catch (err) {
    console.error('[send-disclaimer] send failed', err);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT ? Number(process.env.PORT) : 8787;
app.listen(port, () => console.log(`Kantu API listening on :${port}`));
