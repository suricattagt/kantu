export type WeightUnit = 'kg' | 'lb';

const KG_PER_LB = 0.45359237;

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

/** Entries always store weight in kg; this converts for display only. */
export function displayWeight(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kgToLb(kg) : kg;
}

export function formatWeight(kg: number, unit: WeightUnit): string {
  return `${displayWeight(kg, unit).toFixed(1)} ${unit}`;
}
