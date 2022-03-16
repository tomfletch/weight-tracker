import { WeightRecord, WeightUnit } from "../context/WeightContext";

const LBS_PER_KG = 2.20462;

export function convertLbsToKgs(lbs: number): number {
  return lbs / LBS_PER_KG;
}

export function convertKgsToLbs(kgs: number): number {
  return kgs * LBS_PER_KG;
}

export function formatWeight(weightRecord: WeightRecord, unit: WeightUnit): string {
  let { kgs, lbs } = weightRecord;

  if (!kgs) {
    kgs = convertLbsToKgs(lbs!);
  }

  if (!lbs) {
    lbs = convertKgsToLbs(kgs!);
  }

  if (unit === WeightUnit.STONES_LBS) {
    const stone = Math.floor(lbs / 14);
    const remainderLbs = (lbs % 14).toFixed(1);
    return `${stone}st ${remainderLbs}lb`;
  }

  if (unit === WeightUnit.LBS) {
    return `${lbs.toFixed(1)}lb`;
  }

  if (unit === WeightUnit.KGS) {
    return `${kgs.toFixed(1)}kgs`;
  }

  return 'unkown';
}