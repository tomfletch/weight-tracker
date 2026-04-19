import type { WeightRecord } from '../context/WeightContext';
import { daysBetween, parseISODate } from './dates';

/**
 * Interpolate weight for a given date based on available weight records.
 * Uses linear interpolation between nearest records before and after the target date.
 * Returns null if exact match is not found and interpolation is not possible
 * (i.e., insufficient before/after records).
 *
 * Assumes records are sorted by date in ascending order.
 */
export function interpolateWeightAtDate(
  date: Date,
  weightRecords: WeightRecord[],
): number | null {
  if (weightRecords.length === 0) {
    return null;
  }

  let nearestRecordBefore: WeightRecord | null = null;
  let nearestRecordAfter: WeightRecord | null = null;

  for (const weightRecord of weightRecords) {
    const weightRecordDate = parseISODate(weightRecord.date);

    if (weightRecordDate.getTime() === date.getTime()) {
      return weightRecord.weightKgs;
    }

    if (
      weightRecordDate < date &&
      (!nearestRecordBefore ||
        weightRecordDate > parseISODate(nearestRecordBefore.date))
    ) {
      nearestRecordBefore = weightRecord;
    }

    if (
      weightRecordDate > date &&
      (!nearestRecordAfter ||
        weightRecordDate < parseISODate(nearestRecordAfter.date))
    ) {
      nearestRecordAfter = weightRecord;
    }
  }

  if (!nearestRecordBefore || !nearestRecordAfter) {
    return null;
  }

  const beforeDate = parseISODate(nearestRecordBefore.date);
  const afterDate = parseISODate(nearestRecordAfter.date);

  const deltaDays = daysBetween(beforeDate, afterDate);
  const targetDays = daysBetween(beforeDate, date);

  const deltaWeight =
    nearestRecordAfter.weightKgs - nearestRecordBefore.weightKgs;
  const targetDeltaWeight = (deltaWeight / deltaDays) * targetDays;

  const interpolatedWeight = nearestRecordBefore.weightKgs + targetDeltaWeight;

  return interpolatedWeight;
}

/**
 * Interpolate weight using an ISO date string instead of Date object.
 * Convenience wrapper around interpolateWeightAtDate.
 */
export function interpolateWeightAtDateString(
  dateString: string,
  weightRecords: WeightRecord[],
): number | null {
  const date = parseISODate(dateString);
  return interpolateWeightAtDate(date, weightRecords);
}
