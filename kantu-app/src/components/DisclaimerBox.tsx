import type { CSSProperties } from 'react';

export function DisclaimerBox({ heading, body, style }: { heading: string; body: string; style?: CSSProperties }) {
  return (
    <div style={{ border: '2px solid var(--kw-ink)', padding: '13px 14px 14px', ...style }}>
      <div style={{ fontSize: '9.5px', letterSpacing: '.15em', textTransform: 'uppercase', fontWeight: 800 }}>{heading}</div>
      <div style={{ height: '2px', background: 'var(--kw-ink)', margin: '9px 0' }} />
      <div style={{ fontSize: '12.5px', lineHeight: 1.5, fontWeight: 500, textWrap: 'pretty' }}>{body}</div>
    </div>
  );
}
