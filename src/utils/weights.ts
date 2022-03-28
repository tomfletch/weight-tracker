import { WeightUnit } from '../context/WeightContext';

const LB_PER_ST = 14;
const LB_PER_KG = 2.20462;

interface StLb {
  st: number,
  lb: number
}

export function convertLbToKg(lb: number): number {
  return lb / LB_PER_KG;
}

export function convertKgToLb(kgs: number): number {
  return kgs * LB_PER_KG;
}

export function convertStLbToLb({ st, lb }: StLb): number {
  return st * LB_PER_ST + lb;
}

export function convertStLbToKg(stLb: StLb): number {
  const lb = convertStLbToLb(stLb);
  return convertLbToKg(lb);
}

export function convertLbToStLb(totalLb: number): StLb {
  const st = Math.floor(totalLb / LB_PER_ST);
  const lb = (totalLb % LB_PER_ST);
  return { st, lb };
}

export function convertKgToStLb(kgs: number): StLb {
  const lb = convertKgToLb(kgs);
  return convertLbToStLb(lb);
}


export function formatKg(kgs: number, precision: number = 1): string {
  return `${kgs.toFixed(precision)}kg`;
}

export function formatLb(lbs: number, precision: number = 1): string {
  return `${lbs.toFixed(precision)}lb`;
}

export function formatStLb({ st, lb }: StLb, precision: number = 1): string {
  if (st > 0) {
    return `${st}st ${lb.toFixed(precision)}lb`;
  }
  return `${lb.toFixed(precision)}lb`;
}

export function formatLbAsStLb(totalLb: number, precision: number = 1): string {
  const stLb = convertLbToStLb(totalLb);
  return formatStLb(stLb, precision);
}

export function formatWeight(kgs: number, unit: WeightUnit): string {
  if (unit === WeightUnit.STONES_LBS) {
    const stLb = convertKgToStLb(kgs);
    return formatStLb(stLb);
  }

  if (unit === WeightUnit.LBS) {
    const lbs = convertKgToLb(kgs);
    return formatLb(lbs);
  }

  if (unit === WeightUnit.KGS) {
    return formatKg(kgs);
  }

  throw Error('Invalid weight unit');
}
