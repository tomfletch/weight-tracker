import type { WeightRecord } from '~/types/weight';
import { toISODate } from '~/utils/dates';
import { interpolateWeightAtDate } from '~/utils/weightInterpolation';

export const MOVING_AVERAGE_SIZE = 7;
export const MOVING_AVERAGE_OFFSET = (MOVING_AVERAGE_SIZE - 1) / 2;

/**
 * Compute the 7-day moving average for a given date using interpolated weights.
 * Returns null if any value in the window is null (cannot interpolate full window).
 */
export function computeMovingAverage(
  date: Date,
  weightRecords: WeightRecord[],
): number | null {
  let sumWeight = 0;

  for (
    let offset = -MOVING_AVERAGE_OFFSET;
    offset <= MOVING_AVERAGE_OFFSET;
    offset += 1
  ) {
    const offsetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + offset,
    );
    const weight = interpolateWeightAtDate(offsetDate, weightRecords);
    if (weight === null) return null;
    sumWeight += weight;
  }

  return sumWeight / MOVING_AVERAGE_SIZE;
}

/**
 * Generate date and average weight series from first to last weight record.
 * Each day in the range is processed with the moving average function.
 */
export function generateMovingAverageSeries(
  firstDate: Date,
  lastDate: Date,
  weightRecords: WeightRecord[],
  inclusive: boolean = true,
): { dates: string[]; weights: (number | null)[] } {
  const dates: string[] = [];
  const weights: (number | null)[] = [];
  const currentDate = new Date(firstDate.getTime());

  // Use <= for inclusive (through last date), < for exclusive
  const shouldContinue = inclusive
    ? () => currentDate <= lastDate
    : () => currentDate < lastDate;

  while (shouldContinue()) {
    dates.push(toISODate(currentDate));
    weights.push(computeMovingAverage(currentDate, weightRecords));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { dates, weights };
}
