import type { Lang } from '../i18n/types';

export interface SendDisclaimerResult {
  ok: boolean;
  sent?: boolean;
}

export async function sendDisclaimerEmail(email: string, lang: Lang): Promise<SendDisclaimerResult> {
  const res = await fetch('/api/send-disclaimer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, lang }),
  });
  if (!res.ok) throw new Error('send_failed');
  return (await res.json()) as SendDisclaimerResult;
}
