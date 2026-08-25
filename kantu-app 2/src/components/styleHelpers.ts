import type { CSSProperties } from 'react';
import type { StatusKey } from '../state/domain';
import { statusColorVar } from '../state/domain';

export function pillStyle(key: StatusKey): CSSProperties {
  const c = statusColorVar(key);
  return {
    border: '1px solid ' + c,
    color: c,
    fontSize: '8.5px',
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    fontWeight: 700,
    padding: '3px 5px',
    borderRadius: '3px',
    whiteSpace: 'nowrap',
    flex: 'none',
  };
}

export function chipStyle(active: boolean, extra?: CSSProperties): CSSProperties {
  return {
    fontFamily: 'Archivo',
    fontSize: '12px',
    fontWeight: 700,
    padding: '8px 11px',
    borderRadius: '3px',
    cursor: 'pointer',
    border: active ? '1px solid var(--kw-lav)' : '1px solid var(--kw-line)',
    background: active ? 'var(--kw-lav)' : 'transparent',
    color: active ? '#fffdfb' : 'var(--kw-ink)',
    ...extra,
  };
}

export function segStyle(active: boolean): CSSProperties {
  return {
    flex: 1,
    fontFamily: 'Archivo',
    fontSize: '13px',
    fontWeight: 700,
    padding: '12px 12px',
    border: 0,
    borderRadius: 0,
    cursor: 'pointer',
    textAlign: 'left',
    background: active ? 'var(--kw-lav)' : 'var(--kw-card)',
    color: active ? '#fffdfb' : 'var(--kw-ink)',
  };
}

export function langBtnStyle(active: boolean): CSSProperties {
  return {
    fontFamily: 'Archivo',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '.06em',
    padding: '7px 9px',
    borderRadius: '3px',
    cursor: 'pointer',
    border: '1px solid ' + (active ? 'var(--kw-lav)' : 'var(--kw-line)'),
    background: active ? 'var(--kw-lav)' : 'transparent',
    color: active ? '#fffdfb' : 'var(--kw-ink)',
  };
}
