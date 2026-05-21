import type { WeightRecord } from '~/types/weight';
import { DAY_NAMES_SHORT, daysBetween } from '~/utils/dates';

type ChangeIndicator = 'improve' | 'worsen' | 'noChange';

type HistoryTableRow = {
  record: WeightRecord;
  date: Date;
  dayOfMonth: number;
  dayOfWeek: string;
  weightChange: number | undefined;
  daysBetweenRecords: number;
  changeIndicator: ChangeIndicator;
};

export function getChangeIndicator(
  weightChange: number | undefined,
  weightTargetKgs: number | null,
  currentWeightKgs: number,
): ChangeIndicator {
  if (weightChange === undefined || weightChange === 0) {
    return 'noChange';
  }

  if (weightTargetKgs === null) {
    // Fallback if no goal weight set
    return weightChange > 0 ? 'worsen' : 'improve';
  }

  // Determine if moving towards or away from goal
  const isCurrentAboveGoal = currentWeightKgs > weightTargetKgs;
  const isMovingTowardsGoal =
    (isCurrentAboveGoal && weightChange < 0) ||
    (!isCurrentAboveGoal && weightChange > 0);

  return isMovingTowardsGoal ? 'improve' : 'worsen';
}

export function createHistoryTableRow(
  record: WeightRecord,
  allWeightRecords: WeightRecord[],
  weightTargetKgs: number | null,
): HistoryTableRow {
  const date = new Date(record.date);
  const dayOfMonth = date.getUTCDate();
  const dayOfWeek = DAY_NAMES_SHORT[(date.getUTCDay() + 6) % 7];

  const recordIndex = allWeightRecords.findIndex((r) => r.date === record.date);
  const previousRecord =
    recordIndex >= 0 ? allWeightRecords[recordIndex - 1] : undefined;

  const weightChange = previousRecord
    ? record.weightKgs - previousRecord.weightKgs
    : undefined;

  const daysBetweenRecords = previousRecord
    ? daysBetween(new Date(previousRecord.date), date)
    : 1;

  const changeIndicator = getChangeIndicator(
    weightChange,
    weightTargetKgs,
    record.weightKgs,
  );

  return {
    record,
    date,
    dayOfMonth,
    dayOfWeek,
    weightChange,
    daysBetweenRecords,
    changeIndicator,
  };
}
