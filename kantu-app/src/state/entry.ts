import type { EntryType, GlucoseContext, SymptomTag } from '../i18n/types';

export interface EntryValue {
  sys?: number;
  dia?: number;
  n?: number;
  ctx?: GlucoseContext;
}

export interface Entry {
  id: string;
  type: EntryType;
  at: number;
  v: EntryValue;
  tags?: SymptomTag[];
  sev?: number;
  note?: string;
}

export function defaultsFor(type: EntryType): EntryValue & { tags?: SymptomTag[]; sev?: number; note?: string } {
  switch (type) {
    case 'bp':
      return { sys: 120, dia: 80 };
    case 'glucose':
      return { n: 100, ctx: 'fasting' };
    case 'hr':
      return { n: 72 };
    case 'weight':
      return { n: 68.5 };
    case 'mood':
      return { n: 0 };
    case 'focus':
      return { n: 0 };
    case 'symptom':
      return { tags: [], sev: 1 };
    case 'note':
      return {};
    default:
      return {};
  }
}
