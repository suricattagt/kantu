import type { Config } from '@netlify/functions';
import nodemailer from 'nodemailer';
import { renderDisclaimerEmail, type Lang } from '../../server/copy.ts';

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

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const body = await req.json().catch(() => null);
  const email = String(body?.email || '').trim();
  const lang: Lang = body?.lang === 'en' ? 'en' : 'es';

  if (!EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  const { subject, html, text } = renderDisclaimerEmail(lang);
  const transport = buildTransport();

  if (!transport) {
    console.warn(`[send-disclaimer] SMTP not configured; skipped sending to ${email}`);
    return Response.json({ ok: true, sent: false, reason: 'smtp_not_configured' });
  }

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject,
      html,
      text,
    });
    return Response.json({ ok: true, sent: true });
  } catch (err) {
    console.error('[send-disclaimer] send failed', err);
    return Response.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }
};

export const config: Config = { path: '/api/send-disclaimer' };
