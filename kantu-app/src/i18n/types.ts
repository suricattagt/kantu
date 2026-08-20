export type Lang = 'es' | 'en';

export type VitalType = 'bp' | 'glucose' | 'hr' | 'weight';
export type FeelingType = 'mood' | 'focus';
export type EntryType = VitalType | FeelingType | 'symptom' | 'note';

export type GlucoseContext = 'fasting' | 'before' | 'after' | 'random';

export type SymptomTag =
  | 'chest'
  | 'palp'
  | 'breath'
  | 'dizzy'
  | 'swell'
  | 'numb'
  | 'brainfog'
  | 'forget'
  | 'headache'
  | 'tired'
  | 'anxious'
  | 'sleepless';
