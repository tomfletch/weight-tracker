import { WeightUnit } from "../context/WeightContext";

const LBS_PER_KG = 2.20462;

function convertStsLbsToLbs(sts: number, lbs: number): number {
  return sts * 14 + lbs;
}

export function convertStsLbsToKg(sts: number, lbs: number): number {
  const totalLbs = convertStsLbsToLbs(sts, lbs);
  return convertLbsToKgs(totalLbs);
}

export function convertLbsToKgs(lbs: number): number {
  return lbs / LBS_PER_KG;
}

export function convertKgsToLbs(kgs: number): number {
  return kgs * LBS_PER_KG;
}



export function formatKgs(kgs: number, precision: number=1): string {
  return `${kgs.toFixed(precision)}kg`;
}

export function formatLbs(lbs: number, precision: number=1): string {
  return `${lbs.toFixed(precision)}lb`;
}

export function formatStsLbs(stone: number, lbs: number, precision: number=1): string {
  if (stone > 0) {
    return `${stone}st ${lbs.toFixed(precision)}lb`;
  }

  return `${lbs.toFixed(precision)}lb`;
}

export function formatLbsAsStsLbs(lbs: number, precision: number=1): string {
  const stone = Math.floor(lbs / 14);
  const remainderLbs = (lbs % 14);
  return formatStsLbs(stone, remainderLbs, precision);
}

export function formatWeight(kgs: number, unit: WeightUnit): string {

  if (unit === WeightUnit.STONES_LBS) {
    const lbs = convertKgsToLbs(kgs);
    return formatLbsAsStsLbs(lbs);
  }

  if (unit === WeightUnit.LBS) {
    const lbs = convertKgsToLbs(kgs);
    return formatLbs(lbs);
  }

  if (unit === WeightUnit.KGS) {
    return formatKgs(kgs);
  }

  throw Error('Invalid weight unit');
}