import { WeightUnit } from '~/types/weight';
import {
  convertKgToLb,
  formatKg,
  formatLb,
  formatLbAsStLb,
} from '~/utils/weights';

/**
 * Format a single weight value for display based on weight unit.
 * Precision controls decimal places (default 1 for labels, 0 for ticks).
 */
export function formatWeightValueByUnit(
  value: number,
  weightUnit: WeightUnit,
  precision: number = 1,
): string {
  if (weightUnit === WeightUnit.KGS) {
    return formatKg(value, precision);
  }
  if (weightUnit === WeightUnit.LBS) {
    return formatLb(value, precision);
  }
  return formatLbAsStLb(value, precision);
}

/**
 * Convert an array of weight values from kg to the target weight unit.
 * Null values are preserved; only non-null values are converted and rounded.
 */
export function convertSeriesKgToDisplayUnit(
  values: (number | null)[],
  weightUnit: WeightUnit,
): (number | null)[] {
  if (weightUnit === WeightUnit.KGS) {
    return values;
  }

  return values.map((weightKg) =>
    weightKg === null ? null : Math.round(convertKgToLb(weightKg) * 10) / 10,
  );
}
