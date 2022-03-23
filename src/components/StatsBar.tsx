import { useContext } from 'react';
import { subDays } from 'date-fns';
import WeightContext, { WeightRecord } from '../context/WeightContext';
import { daysBetween } from '../utils/dates';
import { formatWeight } from '../utils/weights';
import styles from './StatsBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowDown, faLongArrowUp } from '@fortawesome/free-solid-svg-icons';

function interpolateWeight(weightRecords: WeightRecord[], date: Date): number | null {
  let nearestRecordBefore: WeightRecord | null = null;
  let nearestRecordAfter: WeightRecord | null = null;

  for (const weightRecord of weightRecords) {
    const weightRecordDate = new Date(weightRecord.date);

    if (weightRecordDate.getTime() === date.getTime()) {
      return weightRecord.weightKgs;
    }

    if (weightRecordDate < date && (!nearestRecordBefore || weightRecordDate > new Date(nearestRecordBefore.date))) {
      nearestRecordBefore = weightRecord;
    }

    if (weightRecordDate > date && (!nearestRecordAfter || weightRecordDate < new Date(nearestRecordAfter.date))) {
      nearestRecordAfter = weightRecord;
    }
  }

  if (!nearestRecordBefore || !nearestRecordAfter) {
    return null;
  }

  const beforeDate = new Date(nearestRecordBefore.date);
  const afterDate = new Date(nearestRecordAfter.date);

  const deltaDays = daysBetween(beforeDate, afterDate);
  const targetDays = daysBetween(beforeDate, date);

  const deltaWeight = nearestRecordAfter.weightKgs - nearestRecordBefore.weightKgs;
  const targetDeltaWeight = deltaWeight / deltaDays * targetDays;

  const interpolatedWeight = nearestRecordBefore.weightKgs + targetDeltaWeight;

  return interpolatedWeight;
}

function RateStatsWidget({ type, startDate }: { type: string, startDate: Date }) {
  const { weightRecords, weightUnit, weightTargetKgs } = useContext(WeightContext);

  const lastWeightRecord = weightRecords[weightRecords.length - 1];
  const lastWeightDate = new Date(lastWeightRecord.date);
  const lastWeight = lastWeightRecord.weightKgs;
  const targetWeightDelta = weightTargetKgs - lastWeight;

  const startWeight = interpolateWeight(weightRecords, startDate);

  let currentRate = <>Unknown</>;
  let daysUntilTarget = null;

  if (startWeight !== null) {
    const weightDelta = lastWeight - startWeight;
    const daysDelta = daysBetween(startDate, lastWeightDate);

    const kgPerDay = weightDelta / daysDelta;
    const kgPerWeek = kgPerDay * 7;

    const formattedWeight = formatWeight(Math.abs(kgPerWeek), weightUnit);

    let icon = null;

    if (kgPerWeek !== 0) {
        icon = <FontAwesomeIcon icon={kgPerWeek > 0 ? faLongArrowUp : faLongArrowDown} className={styles.weightChangeIcon} />
    }

    currentRate = <>{icon} {formattedWeight} per week</>;

    if (kgPerDay !== 0 && Math.sign(kgPerDay) === Math.sign(targetWeightDelta)) {
      daysUntilTarget = Math.round(targetWeightDelta / kgPerDay)
    }
  }

  return (
    <div className={`card ${styles.statsWidget}`}>
      <div className={styles.title}>{type} Rate</div>
      <p>{currentRate}</p>
      {daysUntilTarget && (
        <p>Days until target: {daysUntilTarget}</p>
      )}
    </div>
  );
}

function StatsBar() {
  const { weightRecords } = useContext(WeightContext);

  const firstRecordDate = new Date(weightRecords[0].date);
  const lastRecordDate = new Date(weightRecords[weightRecords.length - 1].date);
  const weekAgoDate = subDays(lastRecordDate, 7);

  return (
    <div className={styles.statsBar}>
      <RateStatsWidget type="All Time" startDate={firstRecordDate} />
      <RateStatsWidget type="Current" startDate={weekAgoDate} />
    </div>
  );
}

export default StatsBar;
